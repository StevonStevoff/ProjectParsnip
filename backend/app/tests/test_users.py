import pytest


@pytest.mark.asyncio(scope="session")
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


@pytest.mark.asyncio(scope="session")
async def test_login_user(client):
    # Create User
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
