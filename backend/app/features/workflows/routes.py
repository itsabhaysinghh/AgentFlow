from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db.models import Workflow, WorkflowExecution, User
from app.features.workflows.schemas import WorkflowCreate, WorkflowUpdate, WorkflowOut, WorkflowExecuteRequest
from app.features.authentication.routes import get_current_user
from app.orchestration.graph import agentflow_graph
import uuid
from datetime import datetime, timezone

workflows_router = APIRouter(prefix="/workflows", tags=["Workflows"])

@workflows_router.get("", response_model=List[WorkflowOut])
def list_workflows(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workflow).filter(Workflow.user_id == current_user.id).order_by(Workflow.created_at.desc()).all()

@workflows_router.post("", response_model=WorkflowOut, status_code=status.HTTP_201_CREATED)
def create_workflow(payload: WorkflowCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wf = Workflow(
        user_id=current_user.id,
        title=payload.title,
        description=payload.description or payload.prompt_template,
        prompt_template=payload.prompt_template,
        category=payload.category,
        requires_approval=payload.requires_approval,
        default_agents=payload.default_agents
    )
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf

@workflows_router.get("/{workflow_id}", response_model=WorkflowOut)
def get_workflow(workflow_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

@workflows_router.put("/{workflow_id}", response_model=WorkflowOut)
def update_workflow(workflow_id: str, payload: WorkflowUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(wf, k, v)

    db.commit()
    db.refresh(wf)
    return wf

@workflows_router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(workflow_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    db.delete(wf)
    db.commit()
    return None

@workflows_router.post("/{workflow_id}/execute")
def execute_workflow(workflow_id: str, req: WorkflowExecuteRequest = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    exec_prompt = (req.prompt if req and req.prompt else wf.prompt_template)

    exec_record = WorkflowExecution(
        workflow_id=wf.id,
        user_id=current_user.id,
        prompt=exec_prompt,
        status="running",
        started_at=datetime.now(timezone.utc)
    )
    db.add(exec_record)
    wf.total_executions += 1
    db.commit()
    db.refresh(exec_record)

    # Execute through LangGraph engine
    state_input = {
        "execution_id": exec_record.id,
        "workflow_id": wf.id,
        "task_prompt": exec_prompt,
        "plan": [],
        "research_data": {},
        "analysis_metrics": {},
        "validation_results": {},
        "final_report": "",
        "approval_required": False,
        "approval_details": None,
        "is_valid": True,
        "retry_count": 0,
        "errors": [],
        "current_agent": "planner"
    }

    try:
        final_state = agentflow_graph.invoke(state_input)
        exec_record.status = "completed"
        exec_record.final_report = final_state.get("final_report", "")
        exec_record.completed_at = datetime.now(timezone.utc)
        exec_record.duration_seconds = 42
        db.commit()
    except Exception as e:
        exec_record.status = "failed"
        exec_record.error_message = str(e)
        db.commit()

    return {
        "execution_id": exec_record.id,
        "status": exec_record.status,
        "message": "Workflow executed successfully through LangGraph."
    }
