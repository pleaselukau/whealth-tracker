from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_symptom_crud_happy_path():
    unique_email = f"symptom_user_{uuid4()}@example.com"

    register_payload = {
        "email": unique_email,
        "password": "Password123",
    }

    register_response = client.post("/auth/register", json=register_payload)
    assert register_response.status_code == 201

    login_response = client.post("/auth/login", json=register_payload)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    create_payload = {
        "date_time": "2026-03-05T08:30:00Z",
        "category": "cramps",
        "severity": 7,
        "notes": "Sharp cramps in the morning",
        "tags": ["period day 2", "workday"],
    }

    create_response = client.post("/symptoms", json=create_payload, headers=headers)
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["category"] == "cramps"
    assert created["severity"] == 7
    symptom_id = created["id"]

    list_response = client.get("/symptoms", headers=headers)
    assert list_response.status_code == 200
    listed = list_response.json()
    assert len(listed) >= 1
    assert any(item["id"] == symptom_id for item in listed)

    get_response = client.get(f"/symptoms/{symptom_id}", headers=headers)
    assert get_response.status_code == 200
    fetched = get_response.json()
    assert fetched["id"] == symptom_id

    update_payload = {
        "severity": 9,
        "notes": "Pain got worse by noon",
        "tags": ["period day 2", "worse at noon"],
    }

    update_response = client.put(
        f"/symptoms/{symptom_id}",
        json=update_payload,
        headers=headers,
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["severity"] == 9
    assert updated["notes"] == "Pain got worse by noon"

    delete_response = client.delete(f"/symptoms/{symptom_id}", headers=headers)
    assert delete_response.status_code == 204

    final_list_response = client.get("/symptoms", headers=headers)
    assert final_list_response.status_code == 200
    final_list = final_list_response.json()
    assert all(item["id"] != symptom_id for item in final_list)