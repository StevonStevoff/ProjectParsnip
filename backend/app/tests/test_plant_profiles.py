import pytest
from sqlalchemy import or_, select

from app.models import PlantProfile, PlantType, User
from app.tests.conftest import get_all_objects, get_db, get_objects


# create plant for testing here so that we are not
# dependant on test_plant_types.py being called
#
# Tests simply need two plant types to exist, therefore it doesn't
# matter if ID 1 and ID 2 are created in test_plant_types.py instead
async def add_plant_types():
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


async def add_plant_profiles():
    async for session in get_db():
        user_1 = await session.get(User, 1)
        user_2 = await session.get(User, 2)

        test_plant_profiles = []
        test_plant_profiles.append(
            PlantProfile(
                id=1,
                name="First Test Profile",
                description="Test Profile Description",
                public=True,
                user_created=True,
                plant_type_id=1,
                creator_id=1,
                users=[user_1, user_2],
            )
        )
        test_plant_profiles.append(
            PlantProfile(
                id=2,
                name="Private Test Profile",
                description="Admin's Private Test Profile Description",
                public=False,
                user_created=True,
                plant_type_id=1,
                creator_id=1,
                users=[user_1],
            )
        )
        test_plant_profiles.append(
            PlantProfile(
                id=3,
                name="User's Private Test Profile",
                description="Normal User's Private Test Profile Description",
                public=False,
                user_created=True,
                plant_type_id=1,
                creator_id=2,
                users=[user_2],
            )
        )
        for test_plant_profile in test_plant_profiles:
            session.add(test_plant_profile)
        await session.commit()
        break


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_profiles_without_token(client):
    response = await client.get("/plant_profiles/")
    assert response.status_code == 401
    json_response = response.json()
    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_all_no_plant_profiles(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No plant profiles found."


@pytest.mark.asyncio(scope="session")
async def test_get_all_plant_profiles(client, superuser_access_token):
    await add_plant_types()
    await add_plant_profiles()

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    plant_profiles = await get_all_objects(PlantProfile)

    assert len(json_response) == len(plant_profiles)
    assert json_response[0]["id"] == 1
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[0]["description"] == "Test Profile Description"
    assert json_response[0]["public"]
    assert json_response[0]["user_created"]
    assert json_response[0]["creator"]["id"] == 1
    assert json_response[0]["plant_type"]["id"] == 1
    assert len(json_response[0]["users"]) == 2

    # check last item
    assert json_response[-1]["id"] == len(plant_profiles)
    assert json_response[-1]["name"] == "User's Private Test Profile"
    assert (
        json_response[-1]["description"]
        == "Normal User's Private Test Profile Description"
    )


@pytest.mark.asyncio(scope="session")
async def test_get_all_accessible_plant_profiles(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    query = select(PlantProfile).where(
        or_(PlantProfile.public, PlantProfile.creator_id == 2)
    )
    plant_profiles = await get_objects(query)

    assert len(json_response) == len(plant_profiles)

    # Second element should be ID 3, as ID 2 is private and inaccessible
    assert json_response[1]["id"] == 3
    assert json_response[1]["name"] == "User's Private Test Profile"
    assert (
        json_response[1]["description"]
        == "Normal User's Private Test Profile Description"
    )
    assert not json_response[1]["public"]
    assert json_response[1]["creator"]["id"] == 2
    assert json_response[1]["plant_type"]["id"] == 1
    assert len(json_response[1]["users"]) == 1


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_exact(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/plant_profiles/?contains=First%20Test%20Profile", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[0]["description"] == "Test Profile Description"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_exact_special_characters(
    client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/plant_profiles/?contains=User&#39;sPrivate%20Test%20Profile", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_multiple(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/?contains=test", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[1]["name"] == "Private Test Profile"
    assert json_response[2]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_similar(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get(
        "/plant_profiles/?contains=fIrSt%20tESt", headers=headers
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "First Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_mulitple_similar(
    client, superuser_access_token
):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/?contains=tEsT", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[1]["name"] == "Private Test Profile"
    assert json_response[2]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_accessible_plant_profile_contains_mulitple_similar(
    client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/?contains=test", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[1]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_contains_different(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/?contains=Teeest", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No plant profiles found."


@pytest.mark.asyncio(scope="session")
async def test_get_my_plant_profiles_without_token(client):
    response = await client.get("/plant_profiles/me")
    assert response.status_code == 401
    json_response = response.json()
    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_my_plant_profiles(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/me", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["name"] == "First Test Profile"
    assert json_response[1]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_created_plant_profiles_without_token(client):
    response = await client.get("/plant_profiles/created")
    assert response.status_code == 401
    json_response = response.json()
    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_created_plant_profiles(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/created", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["name"] == "User's Private Test Profile"


@pytest.mark.asyncio(scope="session")
async def test_register_plant_profile_without_token(client):
    response = await client.post("/plant_profiles/register", json={})
    assert response.status_code == 401
    json_response = response.json()
    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_register_valid_plant_profile(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_profiles/register",
        headers=headers,
        json={
            "name": "Test Registered Profile",
            "description": "Profile created by unittest",
            "public": True,
            "plant_type_id": 1,
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["id"] == 4
    assert json_response["name"] == "Test Registered Profile"
    assert json_response["description"] == "Profile created by unittest"
    assert json_response["public"]
    assert json_response["plant_type"]["id"] == 1
    assert json_response["creator"]["id"] == 2
    assert len(json_response["users"]) == 2


@pytest.mark.asyncio(scope="session")
async def test_register_invalid_plant_profile(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_profiles/register",
        headers=headers,
        json={
            "name": "Test Registered Profile",
            "description": "Profile created by unittest",
            "public": "Idk maybe",  # <- wrong variable type
            "plant_type_id": 1,
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio(scope="session")
async def test_register_incomplete_plant_profile(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_profiles/register",
        headers=headers,
        json={
            "name": "Test Registered Profile",
            "description": "Profile created by unittest",
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio(scope="session")
async def test_register_plant_profile_invalid_plant_type(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/plant_profiles/register",
        headers=headers,
        json={
            "name": "Test Registered Profile",
            "description": "Profile created by unittest",
            "public": True,
            "plant_type_id": 9999,
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "No plant type with id (9999) found."


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_id_without_token(client):
    response = await client.get("/plant_profiles/1")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_id_forbidden(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/plant_profiles/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_id(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/4", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["id"] == 4
    assert json_response["name"] == "Test Registered Profile"


@pytest.mark.asyncio(scope="session")
async def test_get_plant_profile_id_invalid(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/plant_profiles/9999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant profile does not exist."


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_profile_without_token(client):
    response = await client.delete("/plant_profiles/1")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_profile(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/plant_profiles/4", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_profile_not_manageable(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.delete("/plant_profiles/1", headers=headers)

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_delete_plant_profile_nonexistent(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.delete("/plant_profiles/4", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert json_response["detail"] == "The plant profile does not exist."


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_without_token(client):
    response = await client.patch("/plant_profiles/3")

    assert response.status_code == 401
    json_response = response.json()

    assert json_response["detail"] == "Unauthorized"


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_not_manageable(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch("/plant_profiles/1", headers=headers, json={})

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_remove_self_not_manageable(
    client, user_access_token
):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_profiles/1", headers=headers, json={"user_ids": [1]}
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response["users"]) == 1
    assert json_response["users"][0]["id"] == 1


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_add_self_not_manageable(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_profiles/1", headers=headers, json={"user_ids": [1, 2]}
    )

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response["users"]) == 2
    assert json_response["users"][1]["id"] == 2


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_change_users_invalid(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_profiles/1", headers=headers, json={"user_ids": [1, 2, 3]}
    )

    assert response.status_code == 403
    json_response = response.json()

    assert json_response["detail"] == "Forbidden"


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.patch(
        "/plant_profiles/3",
        headers=headers,
        json={
            "name": "Edited Public Test Profile",
            "description": "Edited User's Public Test Profile Description",
            "public": True,
            "plant_type_id": 2,
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["name"] == "Edited Public Test Profile"
    assert (
        json_response["description"] == "Edited User's Public Test Profile Description"
    )
    assert json_response["public"]
    assert json_response["plant_type"]["id"] == 2
    assert len(json_response["users"]) == 2


@pytest.mark.asyncio(scope="session")
async def test_patch_plant_profile_make_private(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.patch(
        "/plant_profiles/3", headers=headers, json={"public": False}
    )

    assert response.status_code == 200
    json_response = response.json()

    assert not json_response["public"]
