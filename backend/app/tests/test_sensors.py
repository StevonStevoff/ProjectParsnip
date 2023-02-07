import pytest
from sqlalchemy import select

from app.models import Sensor
from app.tests.conftest import get_all_objects, get_db, get_objects


async def add_sensors(client):
    async for session in get_db():
        test_sensors = []
        test_sensors.append(
            Sensor(
                id=2,
                name="sensor1",
                description="this is a description",
            )
        )
        test_sensors.append(
            Sensor(
                id=3,
                name="sensor2",
                description="this is also a description",
            )
        )

        for sensor in test_sensors:
            session.add(sensor)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_get_all_sensors_none(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No sensors found."


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors(client, user_access_token):
    await add_sensors(client)
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    sensors = await get_all_objects(client, Sensor)

    assert len(json_response) == len(sensors)
    assert json_response[0]["id"] == sensors[0].id
    assert json_response[1]["name"] == sensors[1].name
    assert json_response[-1]["description"] == sensors[-1].description


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/?contains=sensor1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 2
    assert json_response[0]["name"] == "sensor1"


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_similar(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/?contains=sor1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 2
    assert json_response[0]["name"] == "sensor1"


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_invalid(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/?contains=notsensor", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No sensors found."


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_multiple(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/?contains=sensor", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["id"] == 2
    assert json_response[1]["id"] == 3


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_register_sensor(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {
        "name": "new",
        "description": "this was made via post request",
    }
    response = await client.post(
        "/sensors/register",
        headers=headers,
        json=body,
    )

    assert response.status_code == 200
    json_response = response.json()

    query = select(Sensor).where(Sensor.name == "new")
    sensors = await get_objects(client, query)

    assert len(sensors) == 1
    assert sensors[0].description == "this was made via post request"
    assert json_response["id"] == sensors[0].id
    assert json_response["name"] == sensors[0].name
    assert json_response["description"] == sensors[0].description


# at this point we allow sensors to be registered with the same name
@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_register_sensor_name_already_exists(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {"name": "new", "description": "duplicate named sensor"}
    response = await client.post(
        "/sensors/register",
        headers=headers,
        json=body,
    )

    assert response.status_code == 200
    json_response = response.json()

    query = select(Sensor).where(Sensor.name == "new")
    sensors = await get_objects(client, query)

    assert len(sensors) == 2
    assert sensors[0].id != sensors[1].id
    assert sensors[0].name == sensors[1].name
    assert sensors[0].description != sensors[1].description
    assert json_response["id"] == sensors[1].id
    assert json_response["description"] == sensors[1].description


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_sensor_by_id(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    query = select(Sensor).where(Sensor.id == 1)
    sensors = await get_objects(client, query)

    assert len(sensors) == 1
    assert json_response["id"] == 1
    assert json_response["name"] == sensors[0].name
    assert json_response["description"] == sensors[0].description


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_sensor_by_id_doesnt_exist(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/9999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The sensor does not exist."


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_get_sensor_by_id_invalid(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/notanid", headers=headers)

    assert response.status_code == 422
    json_response = response.json()

    assert json_response["detail"][0]["msg"] == "value is not a valid integer"


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(3)
async def test_delete_sensor_by_id(client, superuser_access_token):
    query = select(Sensor).where(Sensor.id == 1)
    sensors_before = await get_objects(client, query)
    assert len(sensors_before) == 1

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/sensors/1", headers=headers)

    assert response.status_code == 200

    sensors_after = await get_objects(client, query)
    assert len(sensors_after) == 0


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_delete_sensor_by_id_doesnt_exist(client, superuser_access_token):
    sensors_before = await get_all_objects(client, Sensor)

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/sensors/999", headers=headers)

    assert response.status_code == 404
    json_resonse = response.json()
    assert json_resonse["detail"] == "The sensor does not exist."

    sensors_after = await get_all_objects(client, Sensor)
    assert len(sensors_before) == len(sensors_after)


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_delete_sensor_by_id_invalid(client, superuser_access_token):
    sensors_before = await get_all_objects(client, Sensor)

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/sensors/notanid", headers=headers)

    assert response.status_code == 422
    json_resonse = response.json()
    assert json_resonse["detail"][0]["msg"] == "value is not a valid integer"

    sensors_after = await get_all_objects(client, Sensor)
    assert len(sensors_before) == len(sensors_after)


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_patch_sensor_by_id(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {
        "name": "changed",
        "description": "this was changed via patch request",
    }
    response = await client.patch(
        "/sensors/1",
        headers=headers,
        json=body,
    )

    assert response.status_code == 200
    json_response = response.json()

    query = select(Sensor).where(Sensor.id == 1)
    sensors = await get_objects(client, query)

    assert len(sensors) == 1
    assert sensors[0].name == "changed"
    assert sensors[0].description == "this was changed via patch request"
    assert json_response["name"] == sensors[0].name
    assert json_response["description"] == sensors[0].description


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_patch_sensor_by_id_doenst_exist(client, superuser_access_token):
    query = select(Sensor).where(Sensor.id == 1)
    sensors_before = await get_objects(client, query)

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {
        "name": "changed",
        "description": "this was changed via patch request",
    }
    response = await client.patch(
        "/sensors/999",
        headers=headers,
        json=body,
    )

    assert response.status_code == 404
    json_resonse = response.json()
    assert json_resonse["detail"] == "The sensor does not exist."

    sensors_after = await get_objects(client, query)
    assert len(sensors_before) == len(sensors_after)
    assert sensors_before[0].name == sensors_after[0].name
    assert sensors_before[0].description == sensors_after[0].description
