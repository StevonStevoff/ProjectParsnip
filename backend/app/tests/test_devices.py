import pytest


@pytest.mark.asyncio(scope="session")
async def test_create_device(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/devices/register",
        headers=headers,
        json={
            "name": "TestDevice",
            "model_name": "First Version",
            "sensor_ids": [],
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["name"] == "TestDevice"
    assert json_response["model_name"] == "First Version"
    assert json_response["owner"]["id"] == 2
    assert len(json_response["users"]) == 2


async def test_create_device_no_token(client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.post(
        "/devices/register",
        headers=headers,
        json={
            "name": "TestDevice2",
            "model_name": "First Version",
            "sensor_ids": [],
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_get_owned_devices(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/owned",
        headers=headers,
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 1
    assert json_response[0]["name"] == "TestDevice"
    assert json_response[0]["model_name"] == "First Version"


@pytest.mark.asyncio(scope="session")
async def test_get_my_devices(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/me",
        headers=headers,
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "TestDevice"
    assert json_response[0]["model_name"] == "First Version"


@pytest.mark.asyncio(scope="session")
async def test_get_my_devices_no_token(client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.get(
        "/devices/me",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_missing_token(client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.get(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_not_superuser(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 403


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_invalid_device(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/devices/2",
        headers=headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["name"] == "TestDevice"
    assert json_response["model_name"] == "First Version"


@pytest.mark.asyncio(scope="session")
async def test_delete_device_by_id_no_token(client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.delete(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_delete_device_by_id_invalid(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/devices/2",
        headers=headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio(scope="session")
async def test_delete_device_by_id(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 200
