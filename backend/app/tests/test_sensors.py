import pytest
from sqlalchemy import select

from app.models import Sensor
from app.tests.conftest import get_db


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

    async for db in get_db():
        sensor_results = await db.execute(select(Sensor))
        break
    sensors = sensor_results.scalars().all()

    assert len(json_response) == len(sensors)
    assert json_response[0]["id"] == sensors[0].id
    assert json_response[1]["name"] == sensors[1].name
    assert (
        json_response[len(sensors) - 1]["description"]
        == sensors[len(sensors) - 1].description
    )


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

    async for session in get_db():
        sensor_query = select(Sensor).where(Sensor.name == "new")
        query_result = await session.execute(sensor_query)
        sensor = query_result.scalars().all()
        break

    assert len(sensor) == 1
    assert sensor[0].description == "this was made via post request"
    assert json_response["id"] == sensor[0].id
    assert json_response["name"] == sensor[0].name
    assert json_response["description"] == sensor[0].description


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

    async for session in get_db():
        sensor_query = select(Sensor).where(Sensor.name == "new")
        query_result = await session.execute(sensor_query)
        sensors = query_result.scalars().all()
        break

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
    # json_response = response.json()


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_sensor_by_id_invalid(client, user_access_token):
    """headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/sensors/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()"""
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(3)
async def test_delete_sensor_by_id(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_delete_sensor_by_id_invalid(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(3)
async def test_patch_sensor_by_id(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_patch_sensor_by_id_invalid(client, user_access_token):
    pass
