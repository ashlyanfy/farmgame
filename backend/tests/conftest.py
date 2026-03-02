"""
tests/conftest.py — pytest fixtures for async FastAPI tests.

Uses an in-memory SQLite database (via aiosqlite) to avoid requiring a running
PostgreSQL instance during CI. Redis is mocked with fakeredis.
"""

import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app
from app.models.base import Base
from app.deps import get_db, get_redis

# ─── SQLite in-memory engine ───────────────────────────────────────────────────

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest_asyncio.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def create_tables():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    async with TestSessionLocal() as session:
        yield session


# ─── Fake Redis ────────────────────────────────────────────────────────────────

@pytest.fixture
def fake_redis():
    try:
        import fakeredis.aioredis as fakeredis
        return fakeredis.FakeRedis(decode_responses=True)
    except ImportError:
        # Fallback: simple dict-based mock
        class _FakeRedis:
            def __init__(self):
                self._store = {}

            async def get(self, key):
                return self._store.get(key)

            async def set(self, key, value, ex=None):
                self._store[key] = value

            async def incr(self, key):
                self._store[key] = int(self._store.get(key, 0)) + 1
                return self._store[key]

            async def expire(self, key, ttl):
                pass

        return _FakeRedis()


# ─── HTTP client ───────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def client(db_session, fake_redis):
    async def override_db():
        yield db_session

    async def override_redis():
        return fake_redis

    app.dependency_overrides[get_db] = override_db
    app.dependency_overrides[get_redis] = override_redis

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
