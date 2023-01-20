import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from fastapi_users.db import SQLAlchemyUserDatabase
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api import app as api_app
from app.database import get_user_db
from app.models import Base, User

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"


@pytest_asyncio.fixture
async def testing_async_session():
    engine = create_async_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

    testing_async_session = sessionmaker(
        engine, autocommit=False, class_=AsyncSession, autoflush=False
    )

    # create database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield testing_async_session

    # destory database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    # await engine.dispose()


@pytest_asyncio.fixture
async def client(testing_async_session):
    app = api_app

    async def override_get_db():
        yield SQLAlchemyUserDatabase(testing_async_session(), User)

    app.dependency_overrides[get_user_db] = override_get_db

    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client


@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post(
        "/auth/register",
        json={
            "email": "testuser@example.com",
            "username": "TestUsername",
            "password": "string",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )
    assert response.status_code == 201
    json_response = response.json()
    print(json_response)
    assert json_response["email"] == "testuser@example.com"
    assert json_response["username"] == "TestUsername"
    assert json_response["is_active"]
    assert not json_response["is_superuser"]
    assert not json_response["is_verified"]


@pytest.mark.asyncio
async def test_login_user(client):
    response = await client.post(
        "/auth/register",
        json={
            "email": "testuser@example.com",
            "username": "TestUsername",
            "password": "string",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "testuser@example.com", "password": "string"},
    )
    assert response.status_code == 200
