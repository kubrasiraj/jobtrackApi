
def create_test_application(client, headers):
    response = client.post(
        "/api/v1/applications/",
        headers=headers,
        json={
            "company_id": 3,
            "job_title": "Notes Test Role",
            "job_type": "INTERNSHIP",
            "status": "APPLIED",
            "applied_date": "2026-10-01",
            "salary": 30000,
            "description": "Application for notes tests",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_test_note(client, headers, application_id):
    response = client.post(
        f"/api/v1/applications/{application_id}/notes",
        headers=headers,
        json={
            "content": "Prepare for the technical interview",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_note(client, auth_headers):
    application = create_test_application(client, auth_headers)
    note = create_test_note(
        client, auth_headers, application["id"]
    )

    assert note["application_id"] == application["id"]
    assert note["content"] == "Prepare for the technical interview"
    assert "id" in note


def test_get_notes(client, auth_headers):
    application = create_test_application(client, auth_headers)
    create_test_note(client, auth_headers, application["id"])

    response = client.get(
        f"/api/v1/applications/{application['id']}/notes",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_update_note(client, auth_headers):
    application = create_test_application(client, auth_headers)
    note = create_test_note(
        client, auth_headers, application["id"]
    )

    response = client.patch(
        f"/api/v1/notes/{note['id']}",
        headers=auth_headers,
        json={
            "content": "Review Python and FastAPI concepts",
        },
    )

    assert response.status_code == 200
    assert response.json()["content"] == (
        "Review Python and FastAPI concepts"
    )


def test_delete_note(client, auth_headers):
    application = create_test_application(client, auth_headers)
    note = create_test_note(
        client, auth_headers, application["id"]
    )

    response = client.delete(
        f"/api/v1/notes/{note['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204


def test_notes_require_authentication(client):
    response = client.get(
        "/api/v1/applications/2/notes"
    )
    assert response.status_code in (401, 403)