from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import WorkflowExecution, User
from app.features.authentication.routes import get_current_user

reports_router = APIRouter(prefix="/reports", tags=["Reports"])

@reports_router.get("/{execution_id}")
def get_report(execution_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exec_record = db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id, WorkflowExecution.user_id == current_user.id).first()
    if not exec_record or not exec_record.final_report:
        raise HTTPException(status_code=404, detail="Report not found for this execution")

    return {
        "execution_id": exec_record.id,
        "workflow_title": exec_record.workflow.title if exec_record.workflow else "Autonomous Task",
        "content_markdown": exec_record.final_report,
        "duration_seconds": exec_record.duration_seconds,
        "completed_at": exec_record.completed_at.isoformat() if exec_record.completed_at else None
    }
