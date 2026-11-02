from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class WorkflowCreate(BaseModel):
    title: str
    description: Optional[str] = None
    prompt_template: str
    category: Optional[str] = "Market Intelligence"
    requires_approval: Optional[bool] = True
    default_agents: Optional[List[str]] = ["planner", "researcher", "analyst", "validator", "reporter"]

class WorkflowUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    prompt_template: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    requires_approval: Optional[bool] = None

class WorkflowExecuteRequest(BaseModel):
    prompt: Optional[str] = None

class WorkflowOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    prompt_template: str
    category: str
    status: str
    requires_approval: bool
    total_executions: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
