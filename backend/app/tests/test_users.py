import pytest
from PIL import Image
from sqlalchemy import select

from app.models import User
from app.tests.conftest import get_db
from app.tests.populate_tests import add_users


@pytest.mark.asyncio(scope="session")
async def test_access_user_info(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_access_superuser_info(setup_db, client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_get_all_users(setup_db, client, user_access_token):
    await add_users()

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    async for session in get_db():
        users_results = await session.execute(select(User))
        break
    users = users_results.scalars().all()

    assert len(json_response) == len(users)
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"
    assert json_response[len(users) - 1]["id"] == len(users)
    assert json_response[len(users) - 1]["name"] == "username"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_exact(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=TestAdmin", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_similar(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=aDmin", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 1
    assert json_response[0]["id"] == 1
    assert json_response[0]["username"] == "TestAdmin"
    assert json_response[0]["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_multiple_similar(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=username", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 3
    assert json_response[0]["username"] == "username1"
    assert json_response[1]["username"] == "username2"
    assert json_response[2]["username"] == "username3"


@pytest.mark.asyncio(scope="session")
async def test_get_user_contains_different(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/?contains=adddmin", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "No users found."


@pytest.mark.asyncio(scope="session")
async def test_get_user_id(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/1", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["username"] == "TestAdmin"
    assert json_response["name"] == "Mr Admin Test"


@pytest.mark.asyncio(scope="session")
async def test_get_user_id_invalid(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/999", headers=headers)

    assert response.status_code == 404
    json_response = response.json()
    assert json_response["detail"] == "The user does not exist."


# @pytest.mark.asyncio(scope="session")
# async def test_get_user_profile_pic_none_set(setup_db, client, user_access_token):
# headers = {"Authorization": f"Bearer {user_access_token}"}
# response = await client.get("/users/2/pfp", headers=headers)

# assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_set_user_profile_pic(setup_db, client, user_access_token):
    USER_PROFILE_IMG_STORE = "userdata/profileimages/"
    filename = "test.png"
    filepath = USER_PROFILE_IMG_STORE + filename
    fileInfo = {"image": (filename, open(filepath, "rb"))}
    img = Image.open(filepath)
    size = img.size

    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post("/users/pfp", headers=headers, files=fileInfo)
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["size"] == list(size)
