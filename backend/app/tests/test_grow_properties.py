import pytest
from sqlalchemy import select

from app.models import GrowPropertyRange
from app.tests.conftest import get_all_objects, get_objects
from app.tests.populate_tests import populate_db


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_properties_no_token(setup_db, client):
    response = await client.get("/grow_properties/")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_properties_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/grow_properties/", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_properties_none(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/grow_properties/", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No grow properties found."


@pytest.mark.asyncio(scope="session")
async def test_get_all_grow_properties(setup_db, client, superuser_access_token):
    await populate_db()

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/grow_properties/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    grow_property_types = await get_all_objects(GrowPropertyRange)
    assert len(json_response) == len(grow_property_types)
    assert json_response[0]["min"] == 10
    assert json_response[0]["max"] == 50
    assert json_response[1]["sensor_id"] == 2
    assert json_response[1]["grow_property_type"]["name"] == "Test Moisture"
    assert (
        json_response[1]["grow_property_type"]["description"] == "Moisture description"
    )


@pytest.mark.asyncio(scope="session")
async def test_get_grow_properies_by_id_no_token(setup_db, client):
    response = await client.get(
        "/grow_properties/1",
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_properties_by_id_forbidden(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/grow_properties/1",
        headers=headers,
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_properties_by_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/grow_properties/2", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["min"] == 50
    assert json_response["max"] == 100
    assert json_response["sensor_id"] == 2
    assert json_response["grow_property_type"]["name"] == "Test Moisture"
    assert json_response["grow_property_type"]["description"] == "Moisture description"


@pytest.mark.asyncio(scope="session")
async def test_get_grow_property_by_id_invalid(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/grow_properties/20", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert "The grow property does not exist" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_no_token(setup_db, client):
    response = await client.post(
        "/grow_properties/register",
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 2,
            "grow_property_type_id": 2,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 2,
            "grow_property_type_id": 2,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    query = select(GrowPropertyRange).where(GrowPropertyRange.id == 3)
    grow_property = await get_objects(query)

    assert grow_property[0].min == json_response["min"]
    assert grow_property[0].max == json_response["max"]
    assert grow_property[0].sensor_id == json_response["sensor_id"]
    assert grow_property[0].grow_property_type_id == 2
    assert grow_property[0].plant_profile_id == 3
    assert json_response["grow_property_type"]["name"] == "Test Moisture"


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_minmax(
    setup_db, client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 3,
            "max": 2,
            "sensor_id": 2,
            "grow_property_type_id": 2,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 400
    json_response = response.json()

    assert "Range max cannot be less than min" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_type(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 1,
            "grow_property_type_id": 5,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert "grow property type does not exist" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_profile_forbidden(
    setup_db, client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 1,
            "grow_property_type_id": 2,
            "plant_profile_id": 2,
        },
    )

    assert response.status_code == 403
    json_response = response.json()

    assert "Forbidden" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_profile(
    setup_db, client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 1,
            "grow_property_type_id": 2,
            "plant_profile_id": 10,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert "plant profile does not exist" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_sensor(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 1,
            "max": 2,
            "sensor_id": 10,
            "grow_property_type_id": 2,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert "sensor does not exist" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_register_grow_property_invalid_incomplete(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.post(
        "/grow_properties/register",
        headers=headers,
        json={
            "min": 2,
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_by_id_no_token(setup_db, client):
    response = await client.delete(
        "/grow_properties/1",
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_by_id_forbidden(
    setup_db, client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/grow_properties/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_by_id_superuser(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/grow_properties/1", headers=headers)

    assert response.status_code == 200

    query = select(GrowPropertyRange).where(GrowPropertyRange.id == 1)
    grow_property_types = await get_objects(query)

    assert len(grow_property_types) == 0


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_by_id(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/grow_properties/2", headers=headers)

    assert response.status_code == 200

    query = select(GrowPropertyRange).where(GrowPropertyRange.id == 2)
    grow_property = await get_objects(query)

    assert len(grow_property) == 0


@pytest.mark.asyncio(scope="session")
async def test_delete_grow_property_by_id_invalid(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/grow_properties/10", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The grow property does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_by_id_no_token(setup_db, client):
    response = await client.patch(
        "/grow_properties/3",
        json={
            "min": 5,
            "max": 10,
            "sensor_id": 2,
            "grow_property_type": 1,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_by_id(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/grow_properties/3",
        headers=headers,
        json={
            "min": 5,
            "max": 10,
            "sensor_id": 2,
            "grow_property_type_id": 1,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 200
    json_response = response.json()

    query = select(GrowPropertyRange).where(GrowPropertyRange.id == 3)
    grow_property = await get_objects(query)

    assert grow_property[0].min == json_response["min"]
    assert grow_property[0].max == json_response["max"]
    assert grow_property[0].sensor_id == json_response["sensor_id"]
    assert grow_property[0].grow_property_type_id == 1
    assert grow_property[0].plant_profile_id == 3
    assert json_response["grow_property_type"]["name"] == "Test Temperature"


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_by_id_doesnt_exist(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_properties/4",
        headers=headers,
        json={
            "min": 5,
            "max": 10,
            "sensor_id": 2,
            "grow_property_type_id": 1,
            "plant_profile_id": 3,
        },
    )

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The grow property does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_grow_property_by_id_partial(
    setup_db, client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/grow_properties/3",
        headers=headers,
        json={
            "max": 100,
            "sensor_id": 1,
        },
    )

    assert response.status_code == 200
    json_response = response.json()

    query = select(GrowPropertyRange).where(GrowPropertyRange.id == 3)
    grow_property = await get_objects(query)

    assert grow_property[0].min == json_response["min"]
    assert grow_property[0].max == 100
    assert grow_property[0].sensor_id == 1
    assert grow_property[0].grow_property_type_id == 1
    assert grow_property[0].plant_profile_id == 3
    assert json_response["grow_property_type"]["name"] == "Test Temperature"
