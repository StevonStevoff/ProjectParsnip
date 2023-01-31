import pytest


@pytest.mark.asyncio(scope="session")
async def test_create_device(client, user_access_token):
    headers = {"Authorization": f"Bearer {user_access_token}"}
    response = await client.post(
        "/devices/register",
        headers=headers,
        json={
            "name": "TestDevice",
            "model_name": "First Version",
            "sensor_ids": [],
            "user_ids": [1, 2],
        },
    )

    assert response.status_code == 201
    json_response = response.json()

    assert json_response["id"] == 1
    assert json_response["name"] == "TestDevice"
    assert json_response["model_name"] == "First Version"
    assert json_response["owner"]["id"] == 2
    assert len(json_response["users"]) == 2
