
def create_test_application(client, headers):
    response = client.post(
        "/api/v1/applications/",
        headers=headers,
        json={
            "company_id": 3,
            "job_title": "Interview Test Role",
            "job_type": "INTERNSHIP",
            "status": "APPLIED",
            "applied_date": "2026-10-01",
            "salary": 35000,
            "description": "Application for interview tests",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_test_interview(client, headers, application_id):
    response = client.post(
        f"/api/v1/applications/{application_id}/interviews",
        headers=headers,
        json={
            "round": 1,
            "scheduled_at": "2026-10-05T15:00:00",
            "interview_type": "Online",
            "status": "SCHEDULED",
            "feedback": None,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_interview(client, auth_headers):
    application = create_test_application(client, auth_headers)

    interview = create_test_interview(
        client,
        auth_headers,
        application["id"],
    )

    assert interview["application_id"] == application["id"]
    assert interview["round"] == 1
    assert interview["status"] == "SCHEDULED"


def test_get_interviews(client, auth_headers):
    application = create_test_application(client, auth_headers)
    create_test_interview(client, auth_headers, application["id"])

    response = client.get(
        f"/api/v1/applications/{application['id']}/interviews",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_update_interview(client, auth_headers):
    application = create_test_application(client, auth_headers)
    interview = create_test_interview(
        client, auth_headers, application["id"]
    )

    response = client.patch(
        f"/api/v1/interviews/{interview['id']}",
        headers=auth_headers,
        json={
            "status": "COMPLETED",
            "feedback": "Good technical discussion",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "COMPLETED"
    assert response.json()["feedback"] == "Good technical discussion"


def test_delete_interview(client, auth_headers):
    application = create_test_application(client, auth_headers)
    interview = create_test_interview(
        client, auth_headers, application["id"]
    )

    response = client.delete(
        f"/api/v1/interviews/{interview['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204


def test_interviews_require_authentication(client):
    response = client.get(
        "/api/v1/applications/2/interviews"
    )
    assert response.status_code in (401, 403)