"""
services/progress.py

Calculates game progress for all cultivation types (carrot, apple, trout, bee/honey).
All formulas are ported from the frontend algorithm spec.
"""

import math
import time
from typing import Literal

# ─── Constants ────────────────────────────────────────────────────────────────

CYCLE_DAYS: dict[str, int] = {
    "carrot": 75,
    "apple": 180,
    "trout": 120,
    "bee": 30,
}

CARE_BOOST_STEP = 0.01
CARE_BOOST_MAX = 0.15

NUTRIENTS_BOOST_STEP = 0.03
NUTRIENTS_BOOST_MAX = 0.18

HARVEST_WEIGHT: dict[str, int] = {
    "carrot": 10_000,
    "apple": 12_000,
    "trout": 8_000,
    "honey": 6_000,
}

# ─── Helpers ──────────────────────────────────────────────────────────────────


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _now_ms() -> int:
    return int(time.time() * 1000)


# ─── Core calculation ─────────────────────────────────────────────────────────


def calculate_progress(
    cycle_start_ms: int,
    care_index: int,
    nutrients_used: int,
    culture: Literal["carrot", "apple", "trout", "bee"],
    now_ms: int | None = None,
) -> dict:
    """
    Returns a dict with keys:
      - percent (int 0-100)
      - days_left (int >= 0)
      - progress (float 0.0-1.0)
      - quality (int 0-100)
    """
    if now_ms is None:
        now_ms = _now_ms()

    cycle_days = CYCLE_DAYS[culture]

    if cycle_start_ms <= 0:
        return {"percent": 0, "days_left": cycle_days, "progress": 0.0, "quality": 0}

    base = _clamp(
        (now_ms - cycle_start_ms) / (cycle_days * 86_400_000),
        0.0,
        1.0,
    )
    care_boost = _clamp(care_index * CARE_BOOST_STEP, 0.0, CARE_BOOST_MAX)
    nutrients_boost = _clamp(nutrients_used * NUTRIENTS_BOOST_STEP, 0.0, NUTRIENTS_BOOST_MAX)

    progress = _clamp(base + care_boost + nutrients_boost, 0.0, 1.0)
    percent = math.floor(progress * 100)
    days_left = max(0, math.ceil((1.0 - progress) * cycle_days))

    # Quality: base 50, +25 from care, +25 from nutrients (scaled to max boosts)
    quality_care = int((care_boost / CARE_BOOST_MAX) * 25) if CARE_BOOST_MAX > 0 else 0
    quality_nutrients = int((nutrients_boost / NUTRIENTS_BOOST_MAX) * 25) if NUTRIENTS_BOOST_MAX > 0 else 0
    quality = min(100, 50 + quality_care + quality_nutrients)

    return {
        "percent": percent,
        "days_left": days_left,
        "progress": progress,
        "quality": quality,
    }


def is_ready_to_harvest(
    cycle_start_ms: int,
    care_index: int,
    nutrients_used: int,
    culture: Literal["carrot", "apple", "trout", "bee"],
) -> bool:
    result = calculate_progress(cycle_start_ms, care_index, nutrients_used, culture)
    return result["percent"] >= 100
