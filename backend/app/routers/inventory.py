"""
routers/inventory.py

GET /inventory — list all inventory items for the current user
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_current_user
from ..models import User, Inventory
from ..schemas import InventoryItemRead

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=list[InventoryItemRead])
async def get_inventory(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Inventory)
        .where(Inventory.user_id == current_user.id)
        .order_by(Inventory.collected_at.desc())
    )
    return result.scalars().all()
