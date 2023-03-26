import pytest

from app.models import Device, Plant, User
from app.tests.conftest import get_all_objects, get_db


async def add_devices():
    async for session in get_db():
        user_1 = await session.get(User, 1)
        user_2 = await session.get(User, 2)
        test_devices = []
        test_devices.append(
            Device(
                name="Plant Test Device",
                model_name="unit testing model",
                owner_id=2,
                users=[user_2],
            )
        )
        test_devices.append(
            Device(
                name="Plant Admin Test Device",
                model_name="unit testing model",
                owner_id=1,
                users=[user_1],
            )
        )
        for test_device in test_devices:
            session.add(test_device)
        await session.commit()
        break


async def add_plants():
    async for session in get_db():
        test_plants = []
        test_plants.append(
            Plant(
                name="My Precious Plant",
                device_id=1,
                plant_profile_id=1,
                plant_type_id=2,
                outdoor=True,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        test_plants.append(
            Plant(
                name="My Annoying Plant",
                device_id=1,
                plant_profile_id=2,
                plant_type_id=2,
                outdoor=False,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        test_plants.append(
            Plant(
                name="My Third Plant",
                device_id=2,
                plant_profile_id=2,
                plant_type_id=2,
                outdoor=True,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        for test_plant in test_plants:
            session.add(test_plant)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants_without_token(setup, client):
    response = await client.get("/plants/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants_forbidden(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_all_no_plants(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    plants = await get_all_objects(Plant)

    assert plants == []
    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants(setup, client, superuser_access_token):
    await add_devices()
    await add_plants()

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
async def test_get_plants_contains_exact(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/plants/?contains=My%20Precious%20Plant", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "My Precious Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_multiple(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=My", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"
    assert json_response[2]["name"] == "My Third Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_similar(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=pRecIOus", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "My Precious Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_multiple_similar(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=mY", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"


@pytest.mark.asyncio(scope="session")
async def test_get_plants_contains_different(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/?contains=Teeest", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_get_my_plants_without_token(setup, client):
    response = await client.get("/plants/me")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_my_plants(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/me", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "My Precious Plant"
    assert json_response[1]["name"] == "My Annoying Plant"


# enable test once we fix dependencies
@pytest.mark.skip(reason="Need to fix dependencies")
@pytest.mark.asyncio(scope="session")
async def test_get_my_plants_none(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/me", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plants found."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_without_token(setup, client):
    response = await client.post("/plants/register")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_device(setup, client, user_access_token):
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
async def test_register_plant_invalid_plant_profile(setup, client, user_access_token):
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
async def test_register_plant_invalid_plant_type(setup, client, user_access_token):
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
async def test_register_plant_invalid_latitude(setup, client, user_access_token):
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

    assert json_response["detail"] == "Invalid coordinates."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_invalid_longitude(setup, client, user_access_token):
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

    assert json_response["detail"] == "Invalid coordinates."


@pytest.mark.asyncio(scope="session")
async def test_register_valid_plant(setup, client, user_access_token):
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
async def test_register_valid_plant_no_coorindates(setup, client, user_access_token):
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
async def test_get_plant_id_without_token(setup, client):
    response = await client.get("/plants/1")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_id_forbidden(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_id(setup, client, superuser_access_token):
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
async def test_get_plant_invalid_id(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plants/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant does not exist."
