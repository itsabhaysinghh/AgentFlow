def test_register_and_login(client):
    # 1. Register new user
    reg_payload = {
        "email": "test.engineer@agentflow.io",
        "password": "SecretPassword123!",
        "full_name": "Test Engineer"
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "test.engineer@agentflow.io"

    # 2. Login with credentials
    login_payload = {
        "email": "test.engineer@agentflow.io",
        "password": "SecretPassword123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # 3. Get /me with bearer token
    token = login_data["access_token"]
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "test.engineer@agentflow.io"
