from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_insights_summary_and_timeline():
    unique_email = f"insights_user_{uuid4()}@example.com"

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

    entries = [
        {
            "date_time": "2026-03-01T08:00:00Z",
            "category": "cramps",
            "severity": 6,
            "notes": "Morning cramps",
            "tags": ["period day 1"],
        },
        {
            "date_time": "2026-03-01T18:00:00Z",
            "category": "cramps",
            "severity": 8,
            "notes": "Evening cramps",
            "tags": ["period day 1"],
        },
        {
            "date_time": "2026-03-02T09:00:00Z",
            "category": "fatigue",
            "severity": 5,
            "notes": "Tired in the morning",
            "tags": ["poor sleep"],
        },
        {
            "date_time": "2026-03-03T10:00:00Z",
            "category": "cramps",
            "severity": 4,
            "notes": "Less pain today",
            "tags": ["period day 3"],
        },
    ]

    for entry in entries:
        response = client.post("/symptoms", json=entry, headers=headers)
        assert response.status_code == 201

    summary_response = client.get("/insights/summary", headers=headers)
    assert summary_response.status_code == 200
    summary = summary_response.json()

    assert summary["total_entries"] == 4
    assert summary["days_tracked"] == 3

    averages = {item["category"]: item["average_severity"] for item in summary["average_severity_per_category"]}
    assert averages["cramps"] == 6.0
    assert averages["fatigue"] == 5.0

    timeline_response = client.get("/insights/timeline?category=cramps", headers=headers)
    assert timeline_response.status_code == 200
    timeline = timeline_response.json()

    assert timeline["category"] == "cramps"
    assert len(timeline["points"]) == 2
    assert timeline["points"][0]["date"] == "2026-03-01"
    assert timeline["points"][0]["average_severity"] == 7.0
    assert timeline["points"][1]["date"] == "2026-03-03"
    assert timeline["points"][1]["average_severity"] == 4.0