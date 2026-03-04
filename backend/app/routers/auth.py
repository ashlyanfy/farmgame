"""
routers/auth.py

POST /auth/register  — create new user
POST /auth/login     — obtain access + refresh tokens
POST /auth/refresh   — exchange refresh token for new access token
"""

import time
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..deps import get_db, get_redis
from ..models import User, Wallet, Goodness, FarmState, FishState, BeeState, DeliveryProfile
from ..schemas import Token, UserCreate, LoginRequest, TokenPayload
from redis.asyncio import Redis

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RefreshRequest(BaseModel):
    refresh_token: str


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "exp": int(expire.timestamp())}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _create_refresh_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {"sub": user_id, "exp": int(expire.timestamp()), "type": "refresh"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def _init_user_records(user_id: str, db: AsyncSession) -> None:
    """Create all related records for a new user with initial values."""
    now_ms = int(time.time() * 1000)

    db.add(Wallet(user_id=user_id))
    db.add(Goodness(user_id=user_id))
    db.add(FarmState(user_id=user_id, carrot_start_ms=now_ms, apple_start_ms=now_ms))
    db.add(FishState(user_id=user_id, cycle_start_ms=now_ms))
    db.add(BeeState(user_id=user_id, cycle_start_ms=now_ms))
    db.add(DeliveryProfile(user_id=user_id))


@router.post("/register", response_model=Token)
async def register(
    body: UserCreate,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    existing = await db.execute(select(User).where(User.username == body.username))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    user = User(
        username=body.username,
        password_hash=_hash_password(body.password),
        language=body.language,
    )
    db.add(user)
    await db.flush()

    await _init_user_records(user.id, db)
    await db.commit()

    # ✅ БАГ 1+2 исправлены: генерируем токены и сохраняем в Redis
    access_token = _create_access_token(user.id)
    refresh_token = _create_refresh_token(user.id)
    await redis.set(f"session:{user.id}", refresh_token, ex=7 * 24 * 3600)

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=Token)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    result = await db.execute(select(User).where(User.username == body.username))
    user = result.scalar_one_or_none()
    if not user or not _verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = _create_access_token(user.id)
    refresh_token = _create_refresh_token(user.id)
    await redis.set(f"session:{user.id}", refresh_token, ex=7 * 24 * 3600)

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(  # ✅ БАГ 5: переименована функция
    body: RefreshRequest,          # ✅ БАГ 4: токен из body, не query
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    try:
        payload = jwt.decode(body.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    stored = await redis.get(f"session:{token_data.sub}")
    if stored != body.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token revoked or not found",
        )

    user = await db.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access = _create_access_token(user.id)
    new_refresh = _create_refresh_token(user.id)
    await redis.set(f"session:{user.id}", new_refresh, ex=7 * 24 * 3600)

    return Token(access_token=new_access, refresh_token=new_refresh)
