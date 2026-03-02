"""
tests/test_wallet.py — Integration tests for /wallet endpoints.
"""

import pytest


async def _register_and_login(client, username: str = "farmuser", password: str = "pass1234") -> str:
    """Helper: register + login, return access token."""
    await client.post(
        "/auth/register",
        json={"username": username, "password": password},
    )
    resp = await client.post(
        "/auth/login",
        json={"username": username, "password": password},
    )
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_get_wallet(client):
    token = await _register_and_login(client, "walletuser1")
    response = await client.get("/wallet", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    # Initial values
    assert data["coins"] == 500
    assert data["water_g"] == 1000
    assert data["oxygen_g"] == 1000
    assert data["syrup_g"] == 1000
    assert data["nutrients"] == 5


@pytest.mark.asyncio
async def test_care_action_farm_deducts_water(client):
    token = await _register_and_login(client, "careuser1")
    response = await client.post(
        "/wallet/care",
        json={"tab": "farm"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["water_g"] == 1000 - 125  # CARE_COST = 125


@pytest.mark.asyncio
async def test_care_action_fish_deducts_oxygen(client):
    token = await _register_and_login(client, "careuser2")
    response = await client.post(
        "/wallet/care",
        json={"tab": "fish"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["oxygen_g"] == 1000 - 125


@pytest.mark.asyncio
async def test_care_action_bee_deducts_syrup(client):
    token = await _register_and_login(client, "careuser3")
    response = await client.post(
        "/wallet/care",
        json={"tab": "bee"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["syrup_g"] == 1000 - 125


@pytest.mark.asyncio
async def test_care_action_insufficient_water(client):
    """Drain water to 0 then attempt care — should return 400."""
    token = await _register_and_login(client, "dryuser")
    # 1000 / 125 = 8 care actions to drain water
    for _ in range(8):
        await client.post(
            "/wallet/care",
            json={"tab": "farm"},
            headers={"Authorization": f"Bearer {token}"},
        )
    response = await client.post(
        "/wallet/care",
        json={"tab": "farm"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_daily_login_bonus(client):
    token = await _register_and_login(client, "dailyuser")
    response = await client.post(
        "/wallet/daily-login",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["goodness_awarded"] == 10


@pytest.mark.asyncio
async def test_daily_login_bonus_idempotent(client):
    """Claiming twice on the same day should award 0 the second time."""
    token = await _register_and_login(client, "dailyuser2")
    await client.post("/wallet/daily-login", headers={"Authorization": f"Bearer {token}"})
    response = await client.post("/wallet/daily-login", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["goodness_awarded"] == 0


@pytest.mark.asyncio
async def test_wallet_requires_auth(client):
    response = await client.get("/wallet")
    assert response.status_code == 401
