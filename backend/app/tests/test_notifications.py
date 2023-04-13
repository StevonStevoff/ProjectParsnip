import pytest

from app.tests.populate_tests import populate_db


async def send_plant_data(json_data, client):
    response = await client.post(
        "/plant_data/",
        json=json_data,
    )

    return response


@pytest.mark.asyncio(scope="session")
async def test_get_my_notifications_no_token(setup_db, client):
    response = await client.get("/notifications/me")

    assert response.status_code == 401
    json_response = response.json()

    assert "Unauthorized" in json_response["detail"]


@pytest.mark.asyncio(scope="session")
async def test_get_my_notifications_none(setup_db, client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/notifications/me", headers=headers)

    assert response.status_code == 404
    json_response = response.json()

    assert "User has no notifications" in json_response["detail"]


@pytest.mark.skip(reason="Need to add notifications in populate db")
@pytest.mark.asyncio(scope="session")
async def test_get_my_notifications(setup_db, client, superuser_access_token):
    await populate_db()

    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/notifications/me", headers=headers)

    assert response.status_code == 200
    json_response = response.json()

    assert len(json_response) == 2
    assert json_response[0]["text"] == "Unresolved notification"
    assert json_response[1]["text"] == "Resolved notification"


@pytest.mark.asyncio(scope="session")
async def test_create_new_notification(setup_db, client, user_access_token):
    pass
