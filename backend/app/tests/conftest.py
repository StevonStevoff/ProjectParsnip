import asyncio
import os

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.password import PasswordHelper
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api import app
from app.database import get_async_session, get_user_db
from app.models import Base, User

PWD = os.path.abspath(os.curdir)
WORK_PATH = PWD.rsplit("ProjectParsnip", 1)[0]

slashes = "///"
if os.name != "nt":
    # nt means system is windows
    # windows needs one less slash for sqlalchemy
    slashes += "/"
SQLALCHEMY_DATABASE_URL = (
    f"sqlite+aiosqlite:{slashes}{WORK_PATH}ProjectParsnip/backend/app/tests/test.db"
)

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

testing_async_session = sessionmaker(
    engine, autocommit=False, class_=AsyncSession, autoflush=False
)


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    return loop


async def get_db():
    async with testing_async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def override_get_db():
    async with testing_async_session() as session:
        try:
            yield SQLAlchemyUserDatabase(session, User)
        finally:
            await session.close()


# superusers can only be created directly in the database
# without an already existing superuser
async def create_superuser():
    async for db in get_db():
        hashed_password = PasswordHelper().hash("password")
        test_superuser = User(
            id=1,
            email="admin@test.com",
            username="TestAdmin",
            name="Mr Admin Test",
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True,
        )
        db.add(test_superuser)
        await db.commit()
        break


@pytest_asyncio.fixture(scope="session")
async def create_test_database():
    # create database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await create_superuser()

    # run the tests
    yield

    # destory database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="session")
async def client(create_test_database):
    app.dependency_overrides[get_async_session] = get_db
    app.dependency_overrides[get_user_db] = override_get_db

    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client


@pytest_asyncio.fixture(scope="session")
async def user_access_token(client):
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "TestUser", "password": "password"},
    )
    assert response.status_code == 200
    json_response = response.json()
    return json_response["access_token"]


@pytest_asyncio.fixture(scope="session")
async def superuser_access_token(client):
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "TestAdmin", "password": "password"},
    )
    assert response.status_code == 200
    json_response = response.json()
    return json_response["access_token"]