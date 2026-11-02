from app.db.models import ApprovalRequest, WorkflowExecution, Workflow, User
from app.core.security import get_password_hash

def test_approval_resolution(client, db_session):
    # Setup test user & workflow
    user = User(
        email="operator@agentflow.io",
        hashed_password=get_password_hash("pass"),
        full_name="Approval Operator"
    )
    db_session.add(user)
    db_session.commit()

    wf = Workflow(
        user_id=user.id,
        title="Automated Release",
        prompt_template="Deploy to prod",
        requires_approval=True
    )
    db_session.add(wf)
    db_session.commit()

    exec_record = WorkflowExecution(
        workflow_id=wf.id,
        user_id=user.id,
        prompt="Deploy to prod",
        status="awaiting_approval"
    )
    db_session.add(exec_record)
    db_session.commit()

    appr = ApprovalRequest(
        execution_id=exec_record.id,
        user_id=user.id,
        action_title="Approve Deployment",
        action_description="Deploy release v1.0 to production ECS cluster",
        integration_key="github",
        integration_name="GitHub",
        status="pending"
    )
    db_session.add(appr)
    db_session.commit()

    # Login to get token
    login_res = client.post("/api/v1/auth/login", json={"email": "operator@agentflow.io", "password": "pass"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Approve action
    res = client.post(f"/api/v1/approvals/{appr.id}/resolve?decision=approved", headers=headers)
    assert res.status_code == 200
    assert res.json()["status"] == "approved"

    # Verify execution resumed to completed
    db_session.refresh(exec_record)
    assert exec_record.status == "completed"
