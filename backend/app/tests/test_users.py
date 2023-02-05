import pytest
from fastapi_users.password import PasswordHelper
from sqlalchemy import select

from app.models import User
from app.tests.conftest import get_db


async def add_users(client):
    async for session in get_db():
        hashed_pwd = PasswordHelper().hash("password")
        test_users = []
        # id=1 and id=2 are already in use
        test_users.append(
            User(
                id=3,
                email="user1@test.com",
                username="username1",
                name="user",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )
        test_users.append(
            User(
                id=4,
                email="user2@test.com",
                username="username2",
                name="name",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )
        test_users.append(
            User(
                id=5,
                email="user3@test.com",
                username="username3",
                name="username",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )

        for test_user in test_users:
            session.add(test_user)
        await session.commit()
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

    async for session in get_db():
        users_results = await session.execute(select(User))
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
async def test_get_user_contains_multiple_similar(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=username", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["username"] == "username1"
    assert json_response[1]["username"] == "username2"
    assert json_response[2]["username"] == "username3"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_different(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=adddmin", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No users found."


@pytest.mark.asyncio(scope="session")
async def test_get_user_id(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["username"] == "TestAdmin"
    assert json_response["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_id_invalid(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The user does not exist."
