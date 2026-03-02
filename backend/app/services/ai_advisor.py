"""
services/ai_advisor.py

Rule-engine AI advisor. Returns mainTip, quickTips[3], and dailyPlan
based on the current game state without calling any external LLM.
Anti-spam: 1 request per hour per user via Redis key ai:cooldown:{user_id}.
"""

from fastapi import HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import FarmState, FishState, BeeState, Wallet, Goodness
from .progress import calculate_progress

AI_COOLDOWN_SECONDS = 3600


async def get_advice(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> dict:
    # Anti-spam check
    cooldown_key = f"ai:cooldown:{user_id}"
    if await redis.get(cooldown_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="AI advisor is on cooldown. Try again later.",
        )
    await redis.set(cooldown_key, "1", ex=AI_COOLDOWN_SECONDS)

    # Gather state
    wallet = await db.get(Wallet, user_id)
    farm = await db.get(FarmState, user_id)
    fish = await db.get(FishState, user_id)
    bee = await db.get(BeeState, user_id)
    goodness = await db.get(Goodness, user_id)

    tips: list[str] = []
    quick_tips: list[str] = []
    daily_plan: list[str] = []

    # ── Wallet advice ──────────────────────────────────────────────────────
    if wallet:
        if wallet.water_g < 250:
            tips.append("Your water supply is critically low — replenish it in the market before your crops suffer.")
            quick_tips.append("Buy water in the market.")
        if wallet.oxygen_g < 250:
            tips.append("Oxygen reserves are nearly depleted — fish and bees need it urgently.")
            quick_tips.append("Restock oxygen soon.")
        if wallet.nutrients < 2:
            tips.append("You have very few nutrients left. Using nutrients boosts harvest quality significantly.")
            quick_tips.append("Purchase more nutrients.")
        if wallet.coins < 100:
            tips.append("Your coin balance is low. Consider selling inventory items to earn more coins.")
            quick_tips.append("Sell products to earn coins.")

    # ── Farm advice ────────────────────────────────────────────────────────
    if farm:
        culture = farm.active_culture
        if culture == "carrot":
            prog = calculate_progress(
                farm.carrot_start_ms, farm.carrot_care_index, farm.carrot_nutrients_used, "carrot"
            )
        else:
            prog = calculate_progress(
                farm.apple_start_ms, farm.apple_care_index, farm.apple_nutrients_used, "apple"
            )

        if prog["percent"] >= 100:
            tips.append(f"Your {culture} crop is fully grown — harvest it now to free up the field!")
            quick_tips.append(f"Harvest {culture} immediately.")
            daily_plan.append(f"Harvest {culture} from the farm.")
        elif prog["percent"] >= 80:
            tips.append(f"The {culture} crop is almost ready ({prog['percent']}%). One more care action could push it over the line.")
            daily_plan.append(f"Care for the {culture} crop to finish it faster.")
        elif prog["days_left"] > 30:
            tips.append(f"The {culture} crop still has {prog['days_left']} days left. Regular care will speed things up.")
            daily_plan.append(f"Apply care to {culture} crop.")

    # ── Fish advice ────────────────────────────────────────────────────────
    if fish:
        prog = calculate_progress(fish.cycle_start_ms, fish.care_index, fish.nutrients_used, "trout")
        if prog["percent"] >= 100:
            tips.append("Your trout are ready! Head to the fish pond and harvest them.")
            quick_tips.append("Harvest trout from the pond.")
            daily_plan.append("Harvest trout.")
        elif prog["percent"] >= 70:
            daily_plan.append("Feed the fish to accelerate growth.")

    # ── Bee advice ─────────────────────────────────────────────────────────
    if bee:
        prog = calculate_progress(bee.cycle_start_ms, bee.care_index, bee.nutrients_used, "bee")
        if prog["percent"] >= 100:
            tips.append("The beehive is full of honey — collect it before quality degrades!")
            quick_tips.append("Collect honey from the hive.")
            daily_plan.append("Collect honey.")
        elif prog["percent"] >= 70:
            daily_plan.append("Tend to the bees to maximise syrup production.")

    # ── Goodness advice ────────────────────────────────────────────────────
    if goodness:
        if goodness.level < 5:
            next_level_pts = {1: 100, 2: 300, 3: 600, 4: 1000}.get(goodness.level, 1000)
            remaining = next_level_pts - goodness.value
            tips.append(
                f"You are {remaining} Goodness points away from level {goodness.level + 1}. "
                "Perform care actions and collect harvests to earn more."
            )
            daily_plan.append("Complete the daily login bonus and care actions for Goodness points.")

    # ── Fallback ───────────────────────────────────────────────────────────
    if not tips:
        tips.append("Everything looks great on your farm! Keep up the regular care routine for the best quality harvests.")
    if not quick_tips:
        quick_tips = ["Check crop progress.", "Perform a care action.", "Log in daily for bonus points."]
    if not daily_plan:
        daily_plan = ["Claim daily login bonus.", "Care for all crops.", "Check market prices."]

    return {
        "mainTip": tips[0],
        "quickTips": quick_tips[:3],
        "dailyPlan": daily_plan[:5],
    }
