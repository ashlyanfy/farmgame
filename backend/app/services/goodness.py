"""
services/goodness.py

Manages the "Goodness" (Поток Добра) system.
Points are awarded for various in-game actions and tracked via Redis for daily limits.
"""

from datetime import datetime, timezone, timedelta

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Goodness

# ─── Constants ────────────────────────────────────────────────────────────────

DAILY_LOGIN_BONUS = 10
CARE_ACTION_BONUS = 1
CARE_DAILY_LIMIT = 20
COLLECT_BONUS = 15
QUALITY_BONUS = 5
QUALITY_THRESHOLD = 90

LEVEL_THRESHOLDS = {1: 0, 2: 100, 3: 300, 4: 600, 5: 1000}


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _almaty_today() -> str:
    """Return today's date string in Asia/Almaty timezone (UTC+5)."""
    now_almaty = datetime.now(timezone(timedelta(hours=5)))
    return now_almaty.strftime("%Y-%m-%d")


def _seconds_until_end_of_day() -> int:
    """Seconds remaining until midnight Asia/Almaty."""
    tz = timezone(timedelta(hours=5))
    now = datetime.now(tz)
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    return int((midnight - now).total_seconds())


def _compute_level(value: int) -> int:
    level = 1
    for lvl, threshold in sorted(LEVEL_THRESHOLDS.items(), reverse=True):
        if value >= threshold:
            level = lvl
            break
    return level


# ─── Service functions ────────────────────────────────────────────────────────


async def award_daily_login(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> int:
    """
    Award daily login bonus (+10). Returns points awarded (0 if already claimed today).
    Uses Redis key daily_login:{user_id}:{YYYY-MM-DD} with TTL 25h.
    """
    today = _almaty_today()
    redis_key = f"daily_login:{user_id}:{today}"

    already_claimed = await redis.get(redis_key)
    if already_claimed:
        return 0

    await redis.set(redis_key, "1", ex=25 * 3600)
    return await _add_goodness(user_id, DAILY_LOGIN_BONUS, db)


async def award_care_action(
    user_id: str,
    db: AsyncSession,
    redis: Redis,
) -> int:
    """
    Award care action bonus (+1), limited to 20/day.
    Returns points awarded (0 if limit reached).
    Uses Redis INCR with TTL until end of day.
    """
    today = _almaty_today()
    redis_key = f"goodness:care:{user_id}:{today}"

    count = await redis.incr(redis_key)
    if count == 1:
        # Set TTL only on first increment
        await redis.expire(redis_key, _seconds_until_end_of_day())

    if count > CARE_DAILY_LIMIT:
        return 0

    return await _add_goodness(user_id, CARE_ACTION_BONUS, db)


async def award_collect(
    user_id: str,
    quality: int,
    db: AsyncSession,
) -> int:
    """
    Award harvest collection bonus (+15, +5 if quality >= 90).
    Returns total points awarded.
    """
    points = COLLECT_BONUS
    if quality >= QUALITY_THRESHOLD:
        points += QUALITY_BONUS
    return await _add_goodness(user_id, points, db)


async def _add_goodness(user_id: str, points: int, db: AsyncSession) -> int:
    """Internal: add points to the user's goodness record and update level."""
    goodness = await db.get(Goodness, user_id)
    if goodness is None:
        goodness = Goodness(user_id=user_id, value=0, goal=100, level=1)
        db.add(goodness)

    goodness.value += points
    goodness.level = _compute_level(goodness.value)
    await db.flush()
    return points
