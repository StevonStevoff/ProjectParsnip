import pytest

from app.tests.test_auth import test_login_superuser_by_email, test_login_user_by_email


@pytest.mark.asyncio(scope="session")
async def test_access_user_info(client):
    access_token = await test_login_user_by_email(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_access_superuser_info(client):
    access_token = await test_login_superuser_by_email(client)
    headers = {"Authorization": f"Bearer {access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200
