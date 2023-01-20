import asyncio

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

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    return loop


async def override_get_db():
    testing_async_session = sessionmaker(
        engine, autocommit=False, class_=AsyncSession, autoflush=False
    )
    session = testing_async_session()
    try:
        yield SQLAlchemyUserDatabase(session, User)
    finally:
        await session.close()


@pytest_asyncio.fixture(scope="session")
async def testing_async_session():

    # create database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # run the tests
    yield

    # destory database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="session")
async def client(testing_async_session):
    app = api_app

    app.dependency_overrides[get_user_db] = override_get_db

    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client
