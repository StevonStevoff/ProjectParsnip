import pytest

# from sqlalchemy import select

# from app.models import Sensor
# from app.tests.conftest import get_db


async def add_sensors(client):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(1)
async def test_get_all_sensors_none(client, user_access_token):
    pass


@pytest.mark.asyncio(scope="session")
@pytest.mark.order(2)
async def test_get_all_sensors(client, user_access_token):
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
