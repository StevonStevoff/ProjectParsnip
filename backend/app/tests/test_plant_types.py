import pytest
from sqlalchemy import select

from app.models import PlantType
from app.tests.conftest import get_all_objects, get_db, get_objects


async def add_plant_types():
    async for session in get_db():
        test_plant_types = []
        test_plant_types.append(
            PlantType(
                name="Test Tomato Type",
                description="This is a Test Tomato Type, created by a user",
                user_created=True,
                creator_id=2,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Artichoke Type",
                description="This is a Test Artichoke Type, created by a user",
                user_created=True,
                creator_id=2,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Basil",
                description="This is a Test Basil Type",
                user_created=True,
                creator_id=3,
            )
        )
        for test_plant_type in test_plant_types:
            session.add(test_plant_type)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_types_without_token(setup, client):
    response = await client.get("/plant_types/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_types(setup, client, user_access_token):
    await add_plant_types()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    plant_types = await get_all_objects(PlantType)

    assert len(json_response) == len(plant_types)
    assert json_response[0]["id"] == plant_types[0].id
    assert json_response[1]["name"] == plant_types[1].name
    assert json_response[1]["user_created"] == plant_types[1].user_created
    assert json_response[-1]["description"] == plant_types[-1].description


@pytest.mark.asyncio(scope="session")
async def test_get_plant_types_contains_exact(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/plant_types/?contains=Test%20Tomato%20Type", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "Test Tomato Type"
    assert (
        json_response[0]["description"]
        == "This is a Test Tomato Type, created by a user"
    )
    assert json_response[0]["user_created"]
    assert json_response[0]["creator"]["id"] == 2


@pytest.mark.asyncio(scope="session")
async def test_get_plant_types_contains_multiple(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/?contains=Type", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "Test Tomato Type"
    assert json_response[1]["name"] == "Test Artichoke Type"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_types_contains_similar(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/?contains=arTi", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "Test Artichoke Type"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_types_contains_multiple_similar(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/?contains=tYpE", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "Test Tomato Type"
    assert json_response[1]["name"] == "Test Artichoke Type"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_types_contains_different(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/?contains=spongebob", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plant types found."


@pytest.mark.asyncio(scope="session")
async def test_get_my_plant_types_without_token(setup, client):
    response = await client.get("/plant_types/me")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_my_plant_types(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/me", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    query = select(PlantType).where(PlantType.creator_id == 2)
    plant_types = await get_objects(query)

    assert len(json_response) == len(plant_types)
    assert json_response[0]["id"] == plant_types[0].id
    assert json_response[1]["name"] == plant_types[1].name
    assert json_response[1]["user_created"] == plant_types[1].user_created
    assert json_response[-1]["description"] == plant_types[-1].description


@pytest.mark.asyncio(scope="session")
async def test_get_my_plant_types_no_types(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_types/me", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "User has no created plant types."


@pytest.mark.asyncio(scope="session")
async def test_register_plant_type_without_token(setup, client):
    response = await client.post("/plant_types/register", json={})

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_register_valid_plant_type(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_types/register",
        headers=headers,
        json={
            "name": "Newly Registered Type",
            "description": "Newly Registered Description",
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["name"] == "Newly Registered Type"
    assert json_response["description"] == "Newly Registered Description"
    assert json_response["creator"]["id"] == 2
    assert json_response["user_created"]


@pytest.mark.asyncio(scope="session")
async def test_register_invalid_plant_type(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_types/register",
        headers=headers,
        json={
            "name": "Incomplete Type",
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio(scope="session")
async def test_get_plant_type_id_without_token(setup, client):
    response = await client.get("/plant_types/1")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_type_id_forbidden(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_types/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_type_id(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_types/1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    query = select(PlantType).where(PlantType.id == 1)
    plant_type = await get_objects(query)

    assert json_response["name"] == plant_type[0].name
    assert json_response["description"] == plant_type[0].description
    assert json_response["user_created"] == plant_type[0].user_created


@pytest.mark.asyncio(scope="session")
async def test_get_plant_type_id_invalid(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_types/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_type_id_without_token(setup, client):
    response = await client.delete("/plant_types/3")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_type_id_forbidden(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/plant_types/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_type_id(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/plant_types/1", headers=headers)

    assert response.status_code == 200

    query = select(PlantType).where(PlantType.id == 1)
    plant_type = await get_objects(query)

    assert plant_type == []


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_type_id_invalid(setup, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/plant_types/1", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    query = select(PlantType).where(PlantType.id == 1)
    plant_type = await get_objects(query)

    assert plant_type == []
    assert json_response["detail"] == "The plant type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_type_without_token(setup, client):
    response = await client.patch("/plant_types/3")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_type_invalid_id(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_types/999",
        headers=headers,
        json={"name": "Edited Plant Type", "description": "Edited Description"},
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_type_forbidden(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_types/2",
        headers=headers,
        json={"name": "Edited Plant Type", "description": "Edited Description"},
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_type(setup, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_types/3",
        headers=headers,
        json={"name": "Edited Plant Type", "description": "Edited Description"},
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["name"] == "Edited Plant Type"
    assert json_response["description"] == "Edited Description"
