import pytest
from sqlalchemy import select

from app.models import PlantProfile, PlantType, User
from app.tests.conftest import get_db


# create plant for testing here so that we are not
# dependant on test_plant_types.py being called
async def add_plant_types(client):
    async for session in get_db():
        test_plant_types = []
        test_plant_types.append(
            PlantType(
                id=1,
                name="Test Admin Potato",
                description="This is a Test Potato Type, not created by a user",
                user_created=False,
                creator_id=1,
            )
        )
        for test_plant_type in test_plant_types:
            session.add(test_plant_type)
        await session.commit()
        break


async def add_plant_profiles(client):
    async for session in get_db():
        user_1 = await session.get(User, 1)

        test_plant_profiles = []
        test_plant_profiles.append(
            PlantProfile(
                id=1,
                name="First Test Profile",
                description="Test Profile Description",
                public=True,
                user_created=True,
                plant_type_id=1,
                creator_id=2,
                users=[user_1],
            )
        )
        for test_plant_profile in test_plant_profiles:
            session.add(test_plant_profile)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_profiles(client, user_access_token):
    await add_plant_types(client)
    await add_plant_profiles(client)

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    async for session in get_db():
        profile_results = await session.execute(select(PlantProfile))
        break
    plant_profiles = profile_results.scalars().all()

    assert len(json_response) == len(plant_profiles)
    assert json_response[0]["id"] == 1
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[0]["description"] == "Test Profile Description"
    assert json_response[0]["public"]
    assert json_response[0]["creator"]["id"] == 2
    assert json_response[0]["plant_type"]["id"] == 1
    assert len(json_response[0]["users"]) == 1
