from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_login_and_me():
    register_payload = {
        "email": "pytest_user@example.com",
        "password": "Password123",
    }

    register_response = client.post("/auth/register", json=register_payload)
    assert register_response.status_code == 201
    register_data = register_response.json()
    assert register_data["email"] == register_payload["email"]
    assert "id" in register_data

    login_response = client.post("/auth/login", json=register_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"

    token = login_data["access_token"]

    me_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == register_payload["email"]
    assert "id" in me_data