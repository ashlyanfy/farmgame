from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_current_user
from ..models import User, Goodness
from ..schemas import GoodnessRead

router = APIRouter(prefix="/goodness", tags=["goodness"])


def _almaty_date():
    """Текущая дата в часовом поясе Алматы (UTC+5)."""
    return datetime.now(timezone(timedelta(hours=5))).date()


@router.get("", response_model=GoodnessRead)
async def get_goodness(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goodness = await db.get(Goodness, current_user.id)
    if goodness is None:
        raise HTTPException(status_code=404, detail="Goodness record not found")

    # Сбросить счётчик если наступил новый день или значения NULL (после миграции)
    today = _almaty_date()
    if goodness.today_date != today or goodness.today_count is None:
        goodness.today_count = 0
        goodness.today_date = today
        await db.commit()
        await db.refresh(goodness)

    return goodness

