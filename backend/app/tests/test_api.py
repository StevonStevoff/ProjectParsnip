from fastapi.testclient import TestClient

from app.api import app

client = TestClient(app)


# This is an example test, we can remove this once we have added some
# some more real tests
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
