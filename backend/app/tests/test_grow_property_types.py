import pytest
from sqlalchemy import select

from app.models import GrowPropertyType
from app.tests.conftest import get_all_objects, get_objects
from app.tests.populate_tests import add_grow_property_types


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_no_token(setup_db, client):
    response = await client.get("/grow_property_types/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_none(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/", headers=headers
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No grow property types found"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types(setup_db, client, user_access_token):
    await add_grow_property_types()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    grow_property_types = await get_all_objects(GrowPropertyType)
    assert len(json_response) == len(grow_property_types)
    assert json_response[0]["name"] == "Test Temperature"
    assert json_response[1]["description"] == "Moisture description"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_contains(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/?contains=Test%20Moisture", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "Test Moisture"
    assert json_response[0]["description"] == "Moisture description"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_contains_multiple(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/?contains=Test", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "Test Temperature"
    assert json_response[1]["name"] == "Test Moisture"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_contains_similar(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/?contains=mOist", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "Test Moisture"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_property_types_contains_different(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/?contains=bloop", headers=headers
    )

    assert response.status_code == 404
    json_response = response.json()
    
    assert json_response["detail"] == "No grow property types found"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_propery_type_by_id_no_token(setup_db, client):
    response = await client.get(
        "/grow_property_types/?contains=temperature",
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_property_type_by_id_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_property_types/?contains=temperature", headers=headers,
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_property_type_by_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/grow_property_types/1", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response["name"] == "Moisture"
    assert json_response["description"] == "Moisture description"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_property_by_id_invalid(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get(
        "/grow_property_types/20", headers=headers
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The grow property type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_type_no_token(setup_db, client):
    response = await client.post(
        "/grow_property_types/register",
        json={
            "name": "New GP",
            "description": "New GP description",
        }
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"



@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_type_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_property_types/register",
        headers=headers,
        json={
            "name": "New GP",
            "description": "New GP description",
        }
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_type(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.post(
        "/grow_property_types/register",
        headers=headers,
        json={
            "name": "New GP",
            "description": "New GP description",
        }
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["name"] == "New GP"
    assert json_response["description"] == "New GP description"


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_type_invalid(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.post(
        "/grow_property_types/register",
        headers=headers,
        json={
            "name": "Incomplete type",
        }
    )

    assert response.status_code == 422


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_type_by_id_no_token(setup_db, client):
    response = await client.delete(
        "/grow_property_types/1",
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_type_by_id_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete(
        "/grow_property_types/1", headers=headers
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_type_by_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/grow_property_types/1", headers=headers
    )

    assert response.status_code == 200

    query = select(GrowPropertyType).where(GrowPropertyType.id == 1)
    grow_property_types = await get_objects(query)

    assert len(grow_property_types) == 0


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_type_by_id_invalid(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete(
        "/grow_property_types/1", headers=headers
    )

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The grow property type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_type_by_id_no_token(setup_db, client):
    response = await client.patch(
        "/grow_property_types/2",
        json={
            "name": "New GP name",
            "description": "New GP description"
        },
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_type_by_id_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/grow_property_types/2",
        headers=headers,
        json={
            "name": "New GP name",
            "description": "New GP description"
        },
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_type_by_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_property_types/2",
        headers,headers,
        json={
            "name": "New GP name",
            "description": "New GP description"
        },
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["name"] == "New GP name"
    assert json_response["description"] == "New GP description"


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_type_by_id_doesnt_exist(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_property_types/4",
        headers,headers,
        json={
            "name": "New GP name",
            "description": "New GP description"
        },
    )

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The grow property type does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_type_by_id_partial(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_property_types/2",
        headers,headers,
        json={
            "name": "Brand new GP name",
        },
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["name"] == "Brand new GP name"
    assert json_response["description"] == "New GP description"


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_type_by_id_nothing(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_property_types/2",
        headers,headers,
        json={},
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["name"] == "Brand new GP name"
    assert json_response["description"] == "New GP description"
