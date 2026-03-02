"""
routers/profile.py

GET  /profile          — get user profile
PUT  /profile          — update username / language
PUT  /profile/delivery — update delivery profile
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_current_user
from ..models import User, DeliveryProfile
from ..schemas import ProfileRead, ProfileUpdate, DeliveryProfileRead, DeliveryProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileRead)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=ProfileRead)
async def update_profile(
    body: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        if body.username is not None:
            current_user.username = body.username
        if body.language is not None:
            if body.language not in ("RU", "KZ"):
                raise HTTPException(status_code=400, detail="Language must be RU or KZ")
            current_user.language = body.language

    await db.refresh(current_user)
    return current_user


@router.get("/delivery", response_model=DeliveryProfileRead)
async def get_delivery(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await db.get(DeliveryProfile, current_user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Delivery profile not found")
    return profile


@router.put("/delivery", response_model=DeliveryProfileRead)
async def update_delivery(
    body: DeliveryProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        profile = await db.get(DeliveryProfile, current_user.id)
        if profile is None:
            profile = DeliveryProfile(user_id=current_user.id)
            db.add(profile)

        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)

    await db.refresh(profile)
    return profile
