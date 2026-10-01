from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def create_test_application(client, headers):
    response = client.post(
        "/api/v1/applications/",
        headers=headers,
        json={
            "company_id": 3,
            "job_title": "Test Backend Intern",
            "job_type": "INTERNSHIP",
            "status": "APPLIED",
            "applied_date": "2026-10-01",
            "salary": 30000,
            "description": "Automated test application",
        },
    )

    assert response.status_code == 201
    return response.json()


def test_create_application():
    # Login first
    login_response = client.post(
        "/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "TestPassword123",
        },
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Create application
    response = client.post(
        "/api/v1/applications/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "company_id": 3,
            "job_title": "Python Backend Intern",
            "job_type": "INTERNSHIP",
            "status": "APPLIED",
            "applied_date": "2026-09-30",
            "salary": 30000,
            "description": "Python backend internship",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["job_title"] == "Python Backend Intern"
    assert data["company_id"] == 3


def test_user_cannot_access_another_users_application():
    # Login as User 1
    user1_login = client.post(
        "/auth/login",
        json={
            "email": "testuser2@example.com",
            "password": "TestPassword123",
        },
    )

    assert user1_login.status_code == 200

    user1_token = user1_login.json()["access_token"]

    # Try to access another user's application
    response = client.get(
        "/api/v1/applications/2",
        headers={
            "Authorization": f"Bearer {user1_token}",
        },
    )

    assert response.status_code == 404


def test_update_application():
    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "testuser2@example.com",
            "password": "TestPassword123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create application
    application = create_test_application(
        client,
        headers,
    )

    # Update application
    response = client.patch(
        f"/api/v1/applications/{application['id']}",
        headers=headers,
        json={
            "job_title": "Updated Backend Intern",
            "status": "INTERVIEW",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["job_title"] == "Updated Backend Intern"
    assert data["status"] == "INTERVIEW"


def test_delete_application():
    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "testuser2@example.com",
            "password": "TestPassword123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create application
    application = create_test_application(
        client,
        headers,
    )

    # Delete application
    response = client.delete(
        f"/api/v1/applications/{application['id']}",
        headers=headers,
    )

    assert response.status_code == 204

    # Verify application was deleted
    get_response = client.get(
        f"/api/v1/applications/{application['id']}",
        headers=headers,
    )

    assert get_response.status_code == 404


def test_applications_require_authentication():
    response = client.get(
        "/api/v1/applications/"
    )

    assert response.status_code in (401, 403)