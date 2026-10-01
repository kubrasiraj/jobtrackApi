
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_auth_headers():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "testuser2@example.com",
            "password": "TestPassword123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def test_create_company():
    headers = get_auth_headers()

    company_name = f"Automated Test Company {id(object())}"

    response = client.post(
        "/api/v1/companies/",
        headers=headers,
        json={
            "name": company_name,
            "industry": "Technology",
            "website": "https://example.com",
            "location": "Karachi",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == company_name
    assert "id" in data


def test_list_companies():
    headers = get_auth_headers()

    response = client.get(
        "/api/v1/companies/",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_company_endpoints_require_authentication():
    response = client.get(
        "/api/v1/companies/"
    )

    assert response.status_code in (401, 403)

