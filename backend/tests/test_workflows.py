def test_workflow_lifecycle(client):
    # 1. Register & login
    client.post("/api/v1/auth/register", json={
        "email": "architect@agentflow.io",
        "password": "Password123!",
        "full_name": "Cloud Architect"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "architect@agentflow.io",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Workflow
    wf_payload = {
        "title": "AWS vs GCP Regional Comparison",
        "prompt_template": "Compare latency and compute cost between AWS Mumbai and GCP Mumbai.",
        "category": "Market Intelligence",
        "requires_approval": True
    }
    create_res = client.post("/api/v1/workflows", json=wf_payload, headers=headers)
    assert create_res.status_code == 201
    wf_data = create_res.json()
    wf_id = wf_data["id"]
    assert wf_data["title"] == "AWS vs GCP Regional Comparison"

    # 3. List Workflows
    list_res = client.get("/api/v1/workflows", headers=headers)
    assert list_res.status_code == 200
    workflows = list_res.json()
    assert any(w["id"] == wf_id for w in workflows)

    # 4. Execute Workflow
    exec_res = client.post(f"/api/v1/workflows/{wf_id}/execute", headers=headers)
    assert exec_res.status_code == 200
    exec_data = exec_res.json()
    assert exec_data["status"] == "completed"
    assert "execution_id" in exec_data

    # 5. Delete Workflow
    del_res = client.delete(f"/api/v1/workflows/{wf_id}", headers=headers)
    assert del_res.status_code == 204

