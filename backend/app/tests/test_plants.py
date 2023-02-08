import pytest

from app.models import Device, Plant, User
from app.tests.conftest import get_db


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
                users=[user_1, user_2],
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
                plant_type_id=1,
            )
        )
        test_plants.append(
            Plant(
                name="My Annoying Plant",
                device_id=1,
                plant_profile_id=2,
                plant_type_id=2,
            )
        )
        for test_plant in test_plants:
            session.add(test_plant)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plants_without_token(client):
    response = await client.get("/plants/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_types_forbidden(client, user_access_token):
    await add_devices()
    await add_plants()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plants/", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


# @pytest.mark.asyncio(scope="session")
# async def test_get_all_plant_types(client, superuser_access_token):
#     await add_devices()
#     await add_plants()

#     headers = {"Authorization": f"Bearer {superuser_access_token}"}
#     response = await client.get("/plants/", headers=headers)

#     assert response.status_code == 200
#     json_response = response.json()

#     plants = await get_all_objects(Plant)

#     assert len(json_response) == len(plants)
#     assert json_response[0]["id"] == plants[0].id
#     assert json_response[1]["name"] == plants[1].name
#     assert json_response[1]["plant_profile"]["id"] == plants[1].plant_profile_id
#     assert json_response[-1]["device"]["id"] == plants[-1].device_id
