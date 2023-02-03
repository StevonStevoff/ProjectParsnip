import pytest
from fastapi_users.password import PasswordHelper
from sqlalchemy import select

from app.models import User
from app.tests.conftest import get_db


async def add_users(client):
    async for db in get_db():
        hashed_pwd = PasswordHelper().hash("password")
        test_users = [None] * 3
        # id=1 and id=2 are already in use
        test_users[0] = User(
            id=3,
            email="user1@test.com",
            username="username1",
            name="user",
            hashed_password=hashed_pwd,
            is_active=True,
            is_superuser=False,
        )
        test_users[1] = User(
            id=4,
            email="user2@test.com",
            username="username2",
            name="name",
            hashed_password=hashed_pwd,
            is_active=True,
            is_superuser=False,
        )
        test_users[2] = User(
            id=5,
            email="user3@test.com",
            username="username3",
            name="username",
            hashed_password=hashed_pwd,
            is_active=True,
            is_superuser=False,
        )

        for test_user in test_users:
            db.add(test_user)
        await db.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_access_user_info(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_access_superuser_info(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_get_all_users(client, user_access_token):
    await add_users(client)

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    async for db in get_db():
        users_results = await db.execute(select(User))
        break
    users = users_results.scalars().all()

    assert len(json_response) == len(users)
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"
    assert json_response[len(users) - 1]["id"] == len(users)
    assert json_response[len(users) - 1]["name"] == "username"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_exact(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=TestAdmin", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_similar(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=aDmin", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_different(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=adddmin", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No users found"
