from datetime import datetime, timedelta, timezone
import pytest
import pytz

from sqlalchemy import select

from app.models import Plant
from app.tests.conftest import get_all_objects, get_objects
from app.tests.populate_tests import populate_db


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants_without_token(setup_db, client):
    response = await client.get("/plants/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_all_no_plants(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    plants = await get_all_objects(Plant)

    assert plants == []
    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_get_my_plants_none(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/me", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants(setup_db, client, superuser_access_token):
    await populate_db()

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    plants = await get_all_objects(Plant)

    assert len(json_response) == len(plants)
    assert json_response[0]["id"] == plants[0].id
    assert json_response[1]["name"] == plants[1].name
    assert json_response[1]["plant_profile"]["id"] == plants[1].plant_profile.id
    assert json_response[-1]["device"]["id"] == plants[-1].device.id


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_exact(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/plants/?contains=My%20Precious%20Plant", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "My Precious Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_multiple(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=My", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"
    assert json_response[2]["name"] == "My Third Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_similar(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=pRecIOus", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "My Precious Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_multiple_similar(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=mY", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_different(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=Teeest", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_get_my_plants_without_token(setup_db, client):
    response = await client.get("/plants/me")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_my_plants(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/me", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"


@pytest.mark.asyncio(scope="session")
async def test_register_plant_without_token(setup_db, client):
    response = await client.post("/plants/register")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_device(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "My New Plant",
            "device_id": 999,
            "plant_profile_id": 1,
            "plant_type_id": 1,
            "outdoor": True,
            "latitude": 53.8067,
            "longitude": -1.5550,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The device does not exist."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_plant_profile(
    setup_db, client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "My New Plant",
            "device_id": 1,
            "plant_profile_id": 999,
            "plant_type_id": 2,
            "outdoor": True,
            "latitude": 53.8067,
            "longitude": -1.5550,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant profile does not exist."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_plant_type(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "My New Plant",
            "device_id": 1,
            "plant_profile_id": 1,
            "plant_type_id": 999,
            "outdoor": True,
            "latitude": 53.8067,
            "longitude": -1.5550,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_latitude(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "Invalid lattitude Plant",
            "device_id": 1,
            "plant_profile_id": 1,
            "plant_type_id": 2,
            "outdoor": True,
            "latitude": 91.0,
            "longitude": -1.5550,
        },
    )

    assert response.status_code == 400
    json_response = response.json()

    assert json_response["detail"] == "Invalid Latitude."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_longitude(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "Invalid Longitude Plant",
            "device_id": 1,
            "plant_profile_id": 1,
            "plant_type_id": 2,
            "outdoor": True,
            "latitude": 53.8067,
            "longitude": -181.0,
        },
    )

    assert response.status_code == 400
    json_response = response.json()

    assert json_response["detail"] == "Invalid Longitude."


@pytest.mark.asyncio(scope="session")
async def test_register_valid_plant(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "My New Plant",
            "device_id": 1,
            "plant_profile_id": 1,
            "plant_type_id": 2,
            "outdoor": True,
            "latitude": 53.8067,
            "longitude": -1.5550,
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["name"] == "My New Plant"
    assert json_response["device"]["id"] == 1
    assert json_response["plant_profile"]["id"] == 1
    assert json_response["plant_type"]["id"] == 2
    assert json_response["outdoor"]
    assert json_response["latitude"] == 53.8067
    assert json_response["longitude"] == -1.5550


@pytest.mark.asyncio(scope="session")
async def test_register_valid_plant_no_coorindates(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plants/register",
        headers=headers,
        json={
            "name": "My Plant Without Coordinates",
            "device_id": 1,
            "plant_profile_id": 1,
            "plant_type_id": 2,
            "outdoor": True,
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["name"] == "My Plant Without Coordinates"
    assert json_response["device"]["id"] == 1
    assert json_response["plant_profile"]["id"] == 1
    assert json_response["plant_type"]["id"] == 2
    assert json_response["outdoor"]
    assert not json_response["latitude"]
    assert not json_response["longitude"]


@pytest.mark.asyncio(scope="session")
async def test_get_plant_id_without_token(setup_db, client):
    response = await client.get("/plants/1")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_id_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["name"] == "My Precious Plant"
    assert json_response["device"]["id"] == 1
    assert json_response["plant_profile"]["id"] == 1
    assert json_response["plant_type"]["id"] == 2


@pytest.mark.asyncio(scope="session")
async def test_get_plant_invalid_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_by_id_forbidden(setup_db, client, user_access_token):
    prev_plants = await get_all_objects(Plant)

    headers = {"Authorization": f"Bearer {user_access_token}"}
    body = {"name": "patched"}
    response = await client.patch(
        "/plants/3",
        headers=headers,
        json=body,
    )

    assert response.status_code == 403

    curr_plants = await get_all_objects(Plant)
    assert len(curr_plants) == len(prev_plants)


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_by_id_doenst_exist(setup_db, client, superuser_access_token):
    query = select(Plant).where(Plant.id == 1)
    prev_plants = await get_objects(query)

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {"name": "patched"}
    response = await client.patch(
        "/plants/999",
        headers=headers,
        json=body,
    )

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The plant does not exist."

    curr_plants = await get_objects(query)
    assert len(prev_plants) == len(curr_plants)
    assert prev_plants[0].name == curr_plants[0].name


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_by_id(setup_db, client, superuser_access_token):
    time_planted_string = "2023-04-13T12:22:03.619Z"
    datetime_planted = datetime.strptime(time_planted_string, "%Y-%m-%dT%H:%M:%S.%fZ")
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {
        "name": "patched",
        "outdoor": False,
        "latitude": -10.0,
        "longitude": 10.0,
        "plant_type_id": 1,
        "plant_profile_id": 1,
        "device_id": 2,
        "time_planted": time_planted_string,
    }
    response = await client.patch(
        "/plants/3",
        headers=headers,
        json=body,
    )

    assert response.status_code == 200

    query = select(Plant).where(Plant.id == 3)
    plants = await get_objects(query)

    expected_datetime = datetime_planted.replace(tzinfo=None)

    assert len(plants) == 1
    assert plants[0].name == "patched"
    assert plants[0].outdoor is False
    assert plants[0].latitude == -10
    assert plants[0].longitude == 10.0
    assert plants[0].plant_type_id == 1
    assert plants[0].plant_profile_id == 1
    assert plants[0].device_id == 2
    assert plants[0].time_planted == expected_datetime


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_alternate_timezone(setup_db, client, superuser_access_token):
    current_date_time = datetime.now(pytz.timezone("America/New_York"))
    current_date_time_str = current_date_time.isoformat()
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {"time_planted": current_date_time_str}
    response = await client.patch(
        "/plants/3",
        headers=headers,
        json=body,
    )

    assert response.status_code == 200

    query = select(Plant).where(Plant.id == 3)
    plants = await get_objects(query)

    current_date_time_utc = current_date_time.astimezone(timezone.utc)
    expected_datetime = current_date_time_utc.replace(tzinfo=None)

    assert len(plants) == 1
    assert plants[0].time_planted == expected_datetime


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_future_time_planted(
    setup_db, client, superuser_access_token
):
    future_datetime = datetime.now(timezone.utc) + timedelta(minutes=30)
    futre_time_string = future_datetime.isoformat()
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    body = {"time_planted": futre_time_string}
    response = await client.patch(
        "/plants/3",
        headers=headers,
        json=body,
    )

    assert response.status_code == 400
    json_response = response.json()
    assert json_response["detail"] == "Time planted cannot be in the future."


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_by_id_doesnt_exist(
    setup_db, client, superuser_access_token
):
    prev_plants = await get_all_objects(Plant)

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/plants/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The plant does not exist."

    curr_plants = await get_all_objects(Plant)
    assert len(curr_plants) == len(prev_plants)


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_by_id_forbidden(setup_db, client, user_access_token):
    prev_plants = await get_all_objects(Plant)

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/plants/3", headers=headers)

    assert response.status_code == 403

    curr_plants = await get_all_objects(Plant)
    assert len(curr_plants) == len(prev_plants)


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_by_id(setup_db, client, superuser_access_token):
    query = select(Plant).where(Plant.id == 3)
    prev_plants = await get_objects(query)
    assert len(prev_plants) > 0

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/plants/3", headers=headers)

    assert response.status_code == 200

    curr_plants = await get_objects(query)
    assert len(prev_plants) - len(curr_plants) == 1
