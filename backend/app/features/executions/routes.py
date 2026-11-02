from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import get_db
from app.db.models import WorkflowExecution, ExecutionStep, User
from app.features.authentication.routes import get_current_user

executions_router = APIRouter(prefix="/executions", tags=["Executions"])

@executions_router.get("")
def list_executions(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(WorkflowExecution).filter(WorkflowExecution.user_id == current_user.id)
    if status:
        query = query.filter(WorkflowExecution.status == status)
    records = query.order_by(WorkflowExecution.started_at.desc()).all()
    
    return [
        {
            "id": e.id,
            "workflow_id": e.workflow_id,
            "workflow_title": e.workflow.title if e.workflow else "Autonomous Task",
            "prompt": e.prompt,
            "status": e.status,
            "started_at": e.started_at.isoformat() if e.started_at else None,
            "completed_at": e.completed_at.isoformat() if e.completed_at else None,
            "duration_seconds": e.duration_seconds,
            "error_message": e.error_message
        }
        for e in records
    ]

@executions_router.get("/{execution_id}")
def get_execution(execution_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    e = db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id, WorkflowExecution.user_id == current_user.id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Execution not found")

    return {
        "id": e.id,
        "workflow_id": e.workflow_id,
        "workflow_title": e.workflow.title if e.workflow else "Autonomous Task",
        "prompt": e.prompt,
        "status": e.status,
        "current_step_index": e.current_step_index,
        "started_at": e.started_at.isoformat() if e.started_at else None,
        "completed_at": e.completed_at.isoformat() if e.completed_at else None,
        "duration_seconds": e.duration_seconds,
        "final_report": e.final_report,
        "error_message": e.error_message,
        "steps": [
            {
                "id": s.id,
                "agent_role": s.agent_role,
                "agent_name": s.agent_name,
                "title": s.title,
                "status": s.status,
                "duration_ms": s.duration_ms,
                "output_summary": s.output_summary,
                "logs": s.logs
            }
            for s in e.steps
        ]
    }

@executions_router.post("/{execution_id}/cancel")
def cancel_execution(execution_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    e = db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id, WorkflowExecution.user_id == current_user.id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Execution not found")

    if e.status == "running":
        e.status = "cancelled"
        e.error_message = "Execution cancelled by operator."
        e.completed_at = datetime.now(timezone.utc)
        db.commit()

    return {"status": e.status, "message": "Execution cancelled."}
