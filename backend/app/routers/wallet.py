"""
routers/wallet.py

GET  /wallet              — get current wallet
POST /wallet/care         — spend resources on care action
POST /wallet/nutrient     — spend a nutrient on active tab
POST /wallet/daily-login  — claim daily login bonus
"""

import time

from fastapi import APIRouter, Depends, HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_redis, get_current_user
from ..models import User, Wallet, FarmState, FishState, BeeState
from ..schemas import WalletRead, CareRequest, NutrientRequest
from ..services.goodness import award_care_action, award_daily_login

CARE_COST = 125  # grams per care action

router = APIRouter(prefix="/wallet", tags=["wallet"])


async def _get_or_404(db: AsyncSession, model, pk) -> object:
    obj = await db.get(model, pk)
    if obj is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj


@router.get("", response_model=WalletRead)
async def get_wallet(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wallet = await _get_or_404(db, Wallet, current_user.id)
    return wallet


@router.post("/care", response_model=WalletRead)
async def care_action(
    body: CareRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    async with db.begin():
        wallet: Wallet = await _get_or_404(db, Wallet, current_user.id)

        # Determine which resource to spend
        tab = body.tab
        if tab == "fish":
            if wallet.oxygen_g < CARE_COST:
                raise HTTPException(status_code=400, detail="Not enough oxygen")
            wallet.oxygen_g -= CARE_COST
            fish: FishState = await _get_or_404(db, FishState, current_user.id)
            fish.care_index += 1
        elif tab == "bee":
            if wallet.syrup_g < CARE_COST:
                raise HTTPException(status_code=400, detail="Not enough syrup")
            wallet.syrup_g -= CARE_COST
            bee: BeeState = await _get_or_404(db, BeeState, current_user.id)
            bee.care_index += 1
        else:  # farm
            if wallet.water_g < CARE_COST:
                raise HTTPException(status_code=400, detail="Not enough water")
            wallet.water_g -= CARE_COST
            farm: FarmState = await _get_or_404(db, FarmState, current_user.id)
            culture = farm.active_culture
            if culture == "carrot":
                farm.carrot_care_index += 1
            else:
                farm.apple_care_index += 1

        await award_care_action(current_user.id, db, redis)

    await db.refresh(wallet)
    return wallet


@router.post("/nutrient", response_model=WalletRead)
async def nutrient_action(
    body: NutrientRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        wallet: Wallet = await _get_or_404(db, Wallet, current_user.id)

        if wallet.nutrients < 1:
            raise HTTPException(status_code=400, detail="Not enough nutrients")

        wallet.nutrients -= 1
        tab = body.tab

        if tab == "fish":
            fish: FishState = await _get_or_404(db, FishState, current_user.id)
            fish.nutrients_used += 1
        elif tab == "bee":
            bee: BeeState = await _get_or_404(db, BeeState, current_user.id)
            bee.nutrients_used += 1
        else:  # farm
            farm: FarmState = await _get_or_404(db, FarmState, current_user.id)
            culture = farm.active_culture
            if culture == "carrot":
                farm.carrot_nutrients_used += 1
            else:
                farm.apple_nutrients_used += 1

    await db.refresh(wallet)
    return wallet


@router.post("/daily-login")
async def daily_login(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    async with db.begin():
        pts = await award_daily_login(current_user.id, db, redis)

    if pts == 0:
        return {"message": "Daily bonus already claimed today", "goodness_awarded": 0}
    return {"message": "Daily login bonus claimed!", "goodness_awarded": pts}
