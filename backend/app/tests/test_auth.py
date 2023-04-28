import pytest


@pytest.mark.asyncio(scope="session")
async def test_create_user(setup_db, client):
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
async def test_username_already_exists(setup_db, client):
    # Attempt to re-register user created in previous test
    response = await client.post(
        "/auth/register",
        json={
            "email": "newemail@example.com",
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
async def test_user_email_already_exists(setup_db, client):
    # Attempt to re-register user created in previous test
    response = await client.post(
        "/auth/register",
        json={
            "email": "anotheruser@example.com",
            "username": "newusername",
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
async def test_login_user_by_email(setup_db, client):
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
async def test_login_user_by_username(setup_db, client):
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
async def test_login_superuser_by_email(setup_db, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "admin@test.com", "password": "password"},
    )

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_login_superuser_by_username(setup_db, client):
    # Log in as Created User
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = await client.post(
        "/auth/jwt/login",
        headers=headers,
        data={"username": "TestAdmin", "password": "password"},
    )

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_refresh_user_token(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post("/auth/jwt/refresh", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    # logout with new token
    new_token = json_response["access_token"]
    headers = {"Authorization": f"Bearer {new_token}"}
    response = await client.post("/auth/jwt/logout", headers=headers)

    assert response.status_code == 200
