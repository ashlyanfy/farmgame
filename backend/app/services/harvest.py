"""
services/harvest.py

Handles harvest logic for farm (carrot/apple), fish (trout), and bee (honey).
Validates readiness, creates inventory items, resets cycle state, awards goodness.
"""

import time
from typing import Literal

from fastapi import HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import FarmState, FishState, BeeState, Inventory
from .progress import calculate_progress, HARVEST_WEIGHT
from .goodness import award_collect


def _now_ms() -> int:
    return int(time.time() * 1000)


# ─── Farm harvest ─────────────────────────────────────────────────────────────


async def harvest_farm(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> dict:
    """
    Harvest the active culture on the farm.
    Returns inventory item info + goodness points awarded.
    """
    farm = await db.get(FarmState, user_id)
    if farm is None:
        raise HTTPException(status_code=404, detail="Farm state not found")

    culture = farm.active_culture  # "carrot" or "apple"
    if culture == "carrot":
        start_ms = farm.carrot_start_ms
        care_index = farm.carrot_care_index
        nutrients_used = farm.carrot_nutrients_used
    else:
        start_ms = farm.apple_start_ms
        care_index = farm.apple_care_index
        nutrients_used = farm.apple_nutrients_used

    prog = calculate_progress(start_ms, care_index, nutrients_used, culture)
    if prog["percent"] < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Crop not ready yet ({prog['percent']}%)",
        )

    quality = prog["quality"]
    weight_g = HARVEST_WEIGHT[culture]

    item = Inventory(
        user_id=user_id,
        product=culture,
        weight_g=weight_g,
        quality=quality,
    )
    db.add(item)

    # Reset cycle
    now_ms = _now_ms()
    if culture == "carrot":
        farm.carrot_start_ms = now_ms
        farm.carrot_care_index = 0
        farm.carrot_nutrients_used = 0
    else:
        farm.apple_start_ms = now_ms
        farm.apple_care_index = 0
        farm.apple_nutrients_used = 0

    goodness_pts = await award_collect(user_id, quality, db)
    await db.flush()

    return {
        "product": culture,
        "weight_g": weight_g,
        "quality": quality,
        "goodness_awarded": goodness_pts,
    }


# ─── Fish harvest ─────────────────────────────────────────────────────────────


async def harvest_fish(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> dict:
    fish = await db.get(FishState, user_id)
    if fish is None:
        raise HTTPException(status_code=404, detail="Fish state not found")

    prog = calculate_progress(fish.cycle_start_ms, fish.care_index, fish.nutrients_used, "trout")
    if prog["percent"] < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fish not ready yet ({prog['percent']}%)",
        )

    quality = prog["quality"]
    weight_g = HARVEST_WEIGHT["trout"]

    item = Inventory(
        user_id=user_id,
        product="trout",
        weight_g=weight_g,
        quality=quality,
    )
    db.add(item)

    fish.cycle_start_ms = _now_ms()
    fish.care_index = 0
    fish.nutrients_used = 0

    goodness_pts = await award_collect(user_id, quality, db)
    await db.flush()

    return {
        "product": "trout",
        "weight_g": weight_g,
        "quality": quality,
        "goodness_awarded": goodness_pts,
    }


# ─── Bee harvest ──────────────────────────────────────────────────────────────


async def harvest_bee(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> dict:
    bee = await db.get(BeeState, user_id)
    if bee is None:
        raise HTTPException(status_code=404, detail="Bee state not found")

    prog = calculate_progress(bee.cycle_start_ms, bee.care_index, bee.nutrients_used, "bee")
    if prog["percent"] < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Honey not ready yet ({prog['percent']}%)",
        )

    quality = prog["quality"]
    weight_g = HARVEST_WEIGHT["honey"]

    item = Inventory(
        user_id=user_id,
        product="honey",
        weight_g=weight_g,
        quality=quality,
    )
    db.add(item)

    bee.cycle_start_ms = _now_ms()
    bee.care_index = 0
    bee.nutrients_used = 0

    goodness_pts = await award_collect(user_id, quality, db)
    await db.flush()

    return {
        "product": "honey",
        "weight_g": weight_g,
        "quality": quality,
        "goodness_awarded": goodness_pts,
    }
