import pytest

from app.models import PlantType
from app.tests.conftest import get_db


async def add_plant_types(client):
    async for session in get_db():
        test_plant_types = []
        test_plant_types.append(
            PlantType(
                name="Test Admin Parsnip",
                description="This is a Test Parsnip Type, not created by a user",
                user_created=False,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Admin Potato",
                description="This is a Test Potato Type, not created by a user",
                user_created=False,
            )
        )
        for test_plant_type in test_plant_types:
            session.add(test_plant_type)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_profiles_without_token(client):
    response = await client.get("/plant_types/")
    assert response.status_code == 401
    json_response = response.json()
    assert json_response["detail"] == "Unauthorized"
