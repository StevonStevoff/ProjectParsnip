from datetime import datetime

import pytest

from app.models import PlantData
from app.tests.conftest import get_all_objects
from app.tests.populate_tests import populate_db


@pytest.mark.skip(reason="Greenlet error, also update populate db")
@pytest.mark.asyncio(scope="session")
async def test_send_plant_data(setup_db, client, user_access_token):
    await populate_db()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_data/",
        headers=headers,
        json={
            "plant_id": 1,
            "timestamp": str(datetime.now()),
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

    # assert response.status_code == 201
    json_response = response.json()

    # assert json_response["detail"] == ""

    plant_data = await get_all_objects(PlantData)
    assert len(plant_data) == 1
    assert plant_data[0].plant_id == 1
    assert len(plant_data[0].sensor_readings) == 2
    assert plant_data[0].sensor_readings[0].value == 55
    assert (
        plant_data[0].sensor_readings[1].sensor_id
        == json_response["sensor_readings"][1]["sensor_id"]
    )


# more tests for invalid combinations of ids
# e.g. plant_id and device_id are not compatable
# (plant entry has a different device_id)
