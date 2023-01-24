import pytest


@pytest.mark.asyncio(scope="session")
async def test_access_user_info(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200


@pytest.mark.asyncio(scope="session")
async def test_access_superuser_info(client, superuser_access_token):
    headers = {"Authorization": f"Bearer {superuser_access_token}"}
    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200
