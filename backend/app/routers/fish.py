"""
routers/fish.py

GET  /fish/state   — get fish state with progress
POST /fish/harvest — harvest trout
"""

from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_redis, get_current_user
from ..models import User, FishState
from ..schemas import FishStateRead
from ..schemas.game import ProgressInfo
from ..services.progress import calculate_progress
from ..services.harvest import harvest_fish

router = APIRouter(prefix="/fish", tags=["fish"])


@router.get("/state", response_model=FishStateRead)
async def get_fish_state(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    fish = await db.get(FishState, current_user.id)
    if fish is None:
        raise HTTPException(status_code=404, detail="Fish state not found")

    prog = calculate_progress(fish.cycle_start_ms, fish.care_index, fish.nutrients_used, "trout")
    return FishStateRead(
        cycle_start_ms=fish.cycle_start_ms,
        care_index=fish.care_index,
        nutrients_used=fish.nutrients_used,
        progress=ProgressInfo(percent=prog["percent"], days_left=prog["days_left"]),
    )


@router.post("/harvest")
async def harvest(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    async with db.begin():
        result = await harvest_fish(current_user.id, db, redis)
    return result
