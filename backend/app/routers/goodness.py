"""
routers/goodness.py

GET /goodness — get current goodness state
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_current_user
from ..models import User, Goodness
from ..schemas import GoodnessRead

router = APIRouter(prefix="/goodness", tags=["goodness"])


@router.get("", response_model=GoodnessRead)
async def get_goodness(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goodness = await db.get(Goodness, current_user.id)
    if goodness is None:
        raise HTTPException(status_code=404, detail="Goodness record not found")
    return goodness
