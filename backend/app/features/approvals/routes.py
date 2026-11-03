from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.db.session import get_db
from app.db.models import ApprovalRequest, WorkflowExecution, User
from app.features.authentication.routes import get_current_user

approvals_router = APIRouter(prefix="/approvals", tags=["Approvals"])

@approvals_router.get("")
def list_approvals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    approvals = db.query(ApprovalRequest).filter(ApprovalRequest.user_id == current_user.id).order_by(ApprovalRequest.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "execution_id": a.execution_id,
            "workflow_title": a.execution.workflow.title if (a.execution and a.execution.workflow) else "Autonomous Task",
            "action_title": a.action_title,
            "action_description": a.action_description,
            "integration_key": a.integration_key,
            "integration_name": a.integration_name,
            "status": a.status,
            "payload_preview": a.payload_preview,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None
        }
        for a in approvals
    ]

@approvals_router.post("/{approval_id}/resolve")
def resolve_approval(approval_id: str, decision: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if decision not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Decision must be 'approved' or 'rejected'")

    appr = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id, ApprovalRequest.user_id == current_user.id).first()
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")

    appr.status = decision
    appr.resolved_at = datetime.now(timezone.utc)

    # Resume or halt execution
    if appr.execution:
        if decision == "approved":
            appr.execution.status = "completed"
            appr.execution.completed_at = datetime.now(timezone.utc)
            appr.execution.final_report = f"# Approved Action Executed\n\nAction `{appr.action_title}` was approved by operator and dispatched to {appr.integration_name}."
        else:
            appr.execution.status = "cancelled"
            appr.execution.error_message = f"Action rejected by human operator: {appr.action_title}"

    db.commit()
    return {"id": appr.id, "status": appr.status}

