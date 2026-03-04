"""
app/main.py — FastAPI application entry point for "Моя Ферма" backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import (
    auth,
    wallet,
    farm,
    fish,
    bee,
    inventory,
    orders,
    profile,
    goodness,
    ai_advisor,
    market,
)

app = FastAPI(
    title="Моя Ферма API",
    description="Backend for the 'Моя Ферма' farming simulation PWA.",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # TODO: в продакшене заменить на конкретный домен
    ],
    allow_credentials=False,  # Bearer-токены не требуют credentials; allow_origins="*" + credentials=True невалидна по CORS-спецификации
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(wallet.router)
app.include_router(farm.router)
app.include_router(fish.router)
app.include_router(bee.router)
app.include_router(inventory.router)
app.include_router(orders.router)
app.include_router(profile.router)
app.include_router(goodness.router)
app.include_router(ai_advisor.router)
app.include_router(market.router)


@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "Моя Ферма API"}
