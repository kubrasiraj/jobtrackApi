
def test_dashboard_stats(client, auth_headers):
    response = client.get(
        "/api/v1/dashboard/stats",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_applications" in data
    assert "applied" in data
    assert "interview" in data
    assert "offer" in data
    assert "rejected" in data

    for key in (
        "total_applications",
        "applied",
        "interview",
        "offer",
        "rejected",
    ):
        assert isinstance(data[key], int)
        assert data[key] >= 0


def test_dashboard_requires_authentication(client):
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code in (401, 403)