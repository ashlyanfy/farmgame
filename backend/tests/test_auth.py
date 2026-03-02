"""
tests/test_auth.py — Integration tests for /auth endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/auth/register",
        json={"username": "testuser", "password": "secret123", "language": "RU"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data
    assert "referral_code" in data


@pytest.mark.asyncio
async def test_register_duplicate_username(client):
    await client.post(
        "/auth/register",
        json={"username": "dupuser", "password": "secret123"},
    )
    response = await client.post(
        "/auth/register",
        json={"username": "dupuser", "password": "another"},
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client):
    await client.post(
        "/auth/register",
        json={"username": "loginuser", "password": "mypassword"},
    )
    response = await client.post(
        "/auth/login",
        json={"username": "loginuser", "password": "mypassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post(
        "/auth/register",
        json={"username": "wrongpass", "password": "correct"},
    )
    response = await client.post(
        "/auth/login",
        json={"username": "wrongpass", "password": "wrong"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    response = await client.post(
        "/auth/login",
        json={"username": "nobody", "password": "anything"},
    )
    assert response.status_code == 401
