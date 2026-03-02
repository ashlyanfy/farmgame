"""
routers/market.py

GET /market/products — list market products (cached in Redis for 300s)
"""

import json

from fastapi import APIRouter, Depends
from redis.asyncio import Redis

from ..deps import get_redis, get_current_user
from ..models import User
from ..schemas import MarketProductRead

router = APIRouter(prefix="/market", tags=["market"])

MARKET_CACHE_KEY = "market:products"
MARKET_CACHE_TTL = 300  # 5 minutes

# Static product catalogue — in a real app this would come from a DB table
PRODUCTS = [
    MarketProductRead(
        product="carrot",
        price_per_kg=150,
        available_g=50_000,
        description="Fresh organic carrots grown on your virtual farm.",
    ),
    MarketProductRead(
        product="apple",
        price_per_kg=200,
        available_g=40_000,
        description="Crisp apples from the orchard.",
    ),
    MarketProductRead(
        product="trout",
        price_per_kg=450,
        available_g=20_000,
        description="Premium rainbow trout from the fish pond.",
    ),
    MarketProductRead(
        product="honey",
        price_per_kg=600,
        available_g=15_000,
        description="Pure natural honey from the beehive.",
    ),
]


@router.get("/products", response_model=list[MarketProductRead])
async def get_products(
    current_user: User = Depends(get_current_user),
    redis: Redis = Depends(get_redis),
):
    cached = await redis.get(MARKET_CACHE_KEY)
    if cached:
        return json.loads(cached)

    data = [p.model_dump() for p in PRODUCTS]
    await redis.set(MARKET_CACHE_KEY, json.dumps(data), ex=MARKET_CACHE_TTL)
    return data
