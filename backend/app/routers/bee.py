"""
routers/bee.py

GET  /bee/state   — get bee state with progress
POST /bee/harvest — harvest honey
"""

from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_redis, get_current_user
from ..models import User, BeeState
from ..schemas import BeeStateRead
from ..schemas.game import ProgressInfo
from ..services.progress import calculate_progress
from ..services.harvest import harvest_bee

router = APIRouter(prefix="/bee", tags=["bee"])


@router.get("/state", response_model=BeeStateRead)
async def get_bee_state(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    bee = await db.get(BeeState, current_user.id)
    if bee is None:
        raise HTTPException(status_code=404, detail="Bee state not found")

    prog = calculate_progress(bee.cycle_start_ms, bee.care_index, bee.nutrients_used, "bee")
    return BeeStateRead(
        cycle_start_ms=bee.cycle_start_ms,
        care_index=bee.care_index,
        nutrients_used=bee.nutrients_used,
        progress=ProgressInfo(percent=prog["percent"], days_left=prog["days_left"]),
    )


@router.post("/harvest")
async def harvest(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    async with db.begin():
        result = await harvest_bee(current_user.id, db, redis)
    return result
