import asyncio
import os

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.password import PasswordHelper
from httpx import AsyncClient
from sqlalchemy import Table, select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api import app
from app.database import get_async_session, get_user_db
from app.models import Base, Sensor, User

PWD = os.path.abspath(os.curdir)

if "ProjectParsnip" in PWD:
    WORK_PATH = PWD.rsplit("ProjectParsnip", 1)[0]

    slashes = "///"
    if os.name != "nt":
        # nt means system is windows
        # windows needs one less slash for sqlalchemy
        slashes += "/"
    SQLALCHEMY_DATABASE_URL = (
        f"sqlite+aiosqlite:{slashes}{WORK_PATH}ProjectParsnip/backend/app/tests/test.db"
    )
else:
    # For Docker
    SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

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
    async for session in get_db():
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
        session.add(test_superuser)
        await session.commit()
        break


async def create_user():
    async for session in get_db():
        hashed_password = PasswordHelper().hash("password")
        test_user = User(
            id=2,
            email="user@test.com",
            username="TestUser",
            name="Mr User Test",
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False,
        )
        session.add(test_user)
        await session.commit()
        break


@pytest_asyncio.fixture(scope="session")
async def create_test_database():
    # create database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # await create_superuser()
    # await create_user()

    # run the tests
    yield

    # destroy database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="session")
async def client(create_test_database):
    app.dependency_overrides[get_async_session] = get_db
    app.dependency_overrides[get_user_db] = override_get_db

    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client


@pytest_asyncio.fixture(scope="module")
async def setup():
    await create_superuser()
    await create_user()

    yield

    await teardown()


async def teardown():
    all_objects = []
    tables = [User, Sensor]
    for type in tables:
        all_objects += await get_all_objects(type)
    async for session in get_db():
        for i in range(len(all_objects)):
            await session.delete(all_objects[i])
        await session.commit()


@pytest_asyncio.fixture(scope="module")
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


@pytest_asyncio.fixture(scope="module")
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


async def get_objects(query):
    async for session in get_db():
        query_res = await session.execute(query)
        objects = query_res.scalars().all()

    # print("print test")
    return objects


async def get_all_objects(model_type=Table):
    async for session in get_db():
        if model_type:
            query_result = await session.execute(select(model_type))
        objects = query_result.scalars().all()

    return objects
