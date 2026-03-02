"""
routers/farm.py

GET  /farm/state          — get farm state with progress
POST /farm/switch-culture — switch active culture
POST /farm/harvest        — harvest active culture
"""

import time

from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_redis, get_current_user
from ..models import User, FarmState
from ..schemas import FarmStateRead, SwitchCultureRequest
from ..schemas.game import ProgressInfo
from ..services.progress import calculate_progress
from ..services.harvest import harvest_farm

router = APIRouter(prefix="/farm", tags=["farm"])


def _build_farm_read(farm: FarmState) -> FarmStateRead:
    carrot_prog = calculate_progress(
        farm.carrot_start_ms, farm.carrot_care_index, farm.carrot_nutrients_used, "carrot"
    )
    apple_prog = calculate_progress(
        farm.apple_start_ms, farm.apple_care_index, farm.apple_nutrients_used, "apple"
    )
    return FarmStateRead(
        active_culture=farm.active_culture,
        carrot_start_ms=farm.carrot_start_ms,
        carrot_care_index=farm.carrot_care_index,
        carrot_nutrients_used=farm.carrot_nutrients_used,
        carrot_progress=ProgressInfo(
            percent=carrot_prog["percent"], days_left=carrot_prog["days_left"]
        ),
        apple_start_ms=farm.apple_start_ms,
        apple_care_index=farm.apple_care_index,
        apple_nutrients_used=farm.apple_nutrients_used,
        apple_progress=ProgressInfo(
            percent=apple_prog["percent"], days_left=apple_prog["days_left"]
        ),
    )


@router.get("/state", response_model=FarmStateRead)
async def get_farm_state(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm = await db.get(FarmState, current_user.id)
    if farm is None:
        raise HTTPException(status_code=404, detail="Farm state not found")
    return _build_farm_read(farm)


@router.post("/switch-culture", response_model=FarmStateRead)
async def switch_culture(
    body: SwitchCultureRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        farm = await db.get(FarmState, current_user.id)
        if farm is None:
            raise HTTPException(status_code=404, detail="Farm state not found")
        farm.active_culture = body.culture

    await db.refresh(farm)
    return _build_farm_read(farm)


@router.post("/harvest")
async def harvest(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    async with db.begin():
        result = await harvest_farm(current_user.id, db, redis)
    return result
