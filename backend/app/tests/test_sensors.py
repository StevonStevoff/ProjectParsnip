import pytest

from app.models import Sensor
from app.tests.conftest import get_db

# from sqlalchemy import select


async def add_sensors(client):
    async for db in get_db():
        test_sensors = [None] * 2
        test_sensors[0] = Sensor(
            id=2,
            name="sensor1",
            description="this is a description",
        )
        test_sensors[1] = Sensor(
            id=3,
            name="sensor2",
            description="this is also a description",
        )

        for sensor in test_sensors:
            await db.add(sensor)
        await db.commit()
        break


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_get_all_sensors_none(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_similar(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_invalid(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors_contains_multiple(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_register_sensor(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_register_sensor_already_exists(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
async def test_register_sensor_invalid_fields(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
async def test_get_sensor_by_id(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
async def test_get_sensor_by_id_invalid(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(3)
async def test_delete_sensor_by_id(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
async def test_delete_sensor_by_id_invalid(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(3)
async def test_patch_sensor_by_id(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
async def test_patch_sensor_by_id_invalid(client, user_access_token):
    pass
