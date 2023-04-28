from datetime import datetime

import pytest
from sqlalchemy import select

from app.models import Device, Plant, PlantData, SensorReading
from app.tests.conftest import get_objects
from app.tests.populate_tests import add_plant_data, add_sensor_readings, populate_db


@pytest.mark.asyncio(scope="session")
async def test_get_plant_data_without_token(setup_db, client):
    await populate_db(exclude=[PlantData, SensorReading])
    response = await client.get("/plants/1/data")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_data_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/3/data", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Not owner or user of device with ID 2"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_data_no_data(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/1/data", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    plant_data_query = select(PlantData).where(PlantData.plant_id == 1)
    plant_data = await get_objects(plant_data_query)

    assert plant_data == []
    assert json_response["detail"] == "No plant data found."


@pytest.mark.asyncio(scope="session")
async def test_get_plant_data(setup_db, client, user_access_token):
    await add_plant_data()
    await add_sensor_readings()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/1/data", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    plant_data_query = select(PlantData).where(PlantData.plant_id == 1)
    plant_data = await get_objects(plant_data_query)
    expected_timestamp = datetime(2023, 3, 6, 10, 12, 0, 123456)

    assert len(plant_data) == len(json_response)
    assert plant_data[0].timestamp == expected_timestamp
    assert plant_data[0].timestamp.isoformat() == json_response[0]["timestamp"]
    assert plant_data[0].plant_id == json_response[0]["plant_id"]
    assert len(plant_data[0].sensor_readings) == len(
        json_response[0]["sensor_readings"]
    )


@pytest.mark.skip(reason="Greenlet error, also update populate db")
@pytest.mark.asyncio(scope="session")
async def test_send_plant_data(setup_db, client):
    device_query = select(Device).where(Device.id == 1)
    device = await get_objects(device_query)
    print(f"Token: {device[0].auth_token}")
    headers = {"X-SECRET-DEVICE": f"{device[0].auth_token}"}
    timestamp = datetime.now()
    response = await client.post(
        "/plant_data/",
        headers=headers,
        json={
            "timestamp": timestamp.isoformat(),
            "device_id": 1,
            "sensor_readings": [
                {
                    "value": 55,
                    "sensor_id": 1,
                },
                {
                    "value": 60,
                    "sensor_id": 2,
                },
            ],
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    # We expect the same number of plant data objects
    # as plants on the device to be created
    device_plants_query = select(Plant).where(Plant.device_id == 1)
    device_plants = await get_objects(device_plants_query)

    assert len(device_plants) == len(json_response)
    assert json_response[0]["plant_id"] == 1
    assert json_response[1]["plant_id"] == 2

    # assert json_response["detail"] == ""

    # plant_data = await get_all_objects(PlantData)
    # assert len(plant_data) == 1
    # assert len(plant_data[0].sensor_readings) == 2
    # assert plant_data[0].sensor_readings[0].value == 55
    # assert (
    #     plant_data[0].sensor_readings[1].sensor_id
    #     == json_response["sensor_readings"][1]["sensor_id"]
    # )


# more tests for invalid combinations of ids
# e.g. plant_id and device_id are not compatable
# (plant entry has a different device_id)
