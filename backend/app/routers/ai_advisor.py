"""
routers/ai_advisor.py

GET /ai/advice — get personalised AI advice (rule-engine, anti-spam 1/hour)
"""

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_redis, get_current_user
from ..models import User
from ..services.ai_advisor import get_advice

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/advice")
async def ai_advice(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    return await get_advice(current_user.id, db, redis)
