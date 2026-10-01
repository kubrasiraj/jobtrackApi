
def test_me_requires_authentication(client):
    response = client.get("/auth/me")
    assert response.status_code in (401, 403)


def test_me_rejects_invalid_token(client):
    response = client.get(
        "/auth/me",
        headers={
            "Authorization": "Bearer invalid-token",
        },
    )

    assert response.status_code == 401


def test_login_rejects_wrong_password(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "testuser2@example.com",
            "password": "WrongPassword123",
        },
    )

    assert response.status_code == 401