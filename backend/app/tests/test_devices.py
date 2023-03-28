import pytest

from app.models import Device
from app.tests.conftest import get_all_objects


@pytest.mark.asyncio(scope="session")
async def test_create_device(setup, client, user_access_token):
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


@pytest.mark.asyncio(scope="session")
async def test_create_device_no_token(setup, client, user_access_token):
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
async def test_get_owned_devices(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/owned",
        headers=headers,
    )

    assert response.status_code == 200
    json_response = response.json()

    devices = await get_all_objects(Device)

    assert len(json_response) == len(devices)
    assert json_response[0]["id"] == 1
    assert json_response[0]["name"] == "TestDevice"
    assert json_response[0]["model_name"] == "First Version"


@pytest.mark.asyncio(scope="session")
async def test_get_my_devices(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/me",
        headers=headers,
    )

    assert response.status_code == 200
    json_response = response.json()

    devices = await get_all_objects(Device)

    assert len(json_response) == len(devices)
    assert json_response[0]["name"] == "TestDevice"
    assert json_response[0]["model_name"] == "First Version"


@pytest.mark.asyncio(scope="session")
async def test_get_my_devices_no_token(setup, client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.get(
        "/devices/me",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_missing_token(setup, client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.get(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_not_superuser(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 403


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id_invalid_device(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/devices/2",
        headers=headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio(scope="session")
async def test_get_device_from_id(setup, client, superuser_access_token):
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
async def test_delete_device_by_id_no_token(setup, client, user_access_token):
    headers = {"Authorization": "Bearer {}"}
    response = await client.delete(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 401


@pytest.mark.asyncio(scope="session")
async def test_delete_device_by_id_invalid(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/devices/2",
        headers=headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio(scope="session")
async def test_delete_device_by_id(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/devices/1",
        headers=headers,
    )

    assert response.status_code == 200
