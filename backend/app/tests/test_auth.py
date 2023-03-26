import pytest


@pytest.mark.asyncio(scope="session")
async def test_create_user(setup, client):
    # Register Valid User
    response = await client.post(
        "/auth/register",
        json={
            "email": "anotheruser@example.com",
            "username": "AnotherTestUser",
            "name": "Mr Another Test",
            "password": "password",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )

    assert response.status_code == 201

    json_response = response.json()
    assert json_response["email"] == "anotheruser@example.com"
    assert json_response["username"] == "AnotherTestUser"
    assert json_response["name"] == "Mr Another Test"
    assert json_response["is_active"]
    assert not json_response["is_superuser"]
    assert not json_response["is_verified"]


@pytest.mark.asyncio(scope="session")
async def test_user_already_exists(setup, client):
    # Attempt to re-register user created in previous test
    response = await client.post(
        "/auth/register",
        json={
            "email": "anotheruser@example.com",
            "username": "AnotherTestUser",
            "name": "Mr Another Test",
            "password": "password",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        },
    )

    assert response.status_code == 400
    json_response = response.json()
    assert json_response["detail"] == "REGISTER_USER_ALREADY_EXISTS"


@pytest.mark.asyncio(scope="session")
async def test_login_user_by_email(setup, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "anotheruser@example.com", "password": "password"},
    )

    assert response.status_code == 200
    json_respone = response.json()
    return json_respone["access_token"]


@pytest.mark.asyncio(scope="session")
async def test_login_user_by_username(setup, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "AnotherTestUser", "password": "password"},
    )

    assert response.status_code == 200
    json_respone = response.json()
    return json_respone["access_token"]


@pytest.mark.asyncio(scope="session")
async def test_login_superuser_by_email(setup, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "admin@test.com", "password": "password"},
    )

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_login_superuser_by_username(setup, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "TestAdmin", "password": "password"},
    )

    assert response.status_code == 200
