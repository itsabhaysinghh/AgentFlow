import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, default="Operator")
    role = Column(String(100), default="AI Systems Architect")
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    workflows = relationship("Workflow", back_populates="owner", cascade="all, delete-orphan")
    executions = relationship("WorkflowExecution", back_populates="user", cascade="all, delete-orphan")
    integrations = relationship("IntegrationAccount", back_populates="user", cascade="all, delete-orphan")
    approvals = relationship("ApprovalRequest", back_populates="user", cascade="all, delete-orphan")

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String(36), primary_key=True, default=lambda: f"wf-{uuid.uuid4().hex[:6]}")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    prompt_template = Column(Text, nullable=False)
    category = Column(String(100), default="General Automation")
    status = Column(String(50), default="active")  # active, draft, archived
    requires_approval = Column(Boolean, default=True)
    total_executions = Column(Integer, default=0)
    default_agents = Column(JSON, default=lambda: ["planner", "researcher", "analyst", "validator", "reporter"])
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="workflows")
    executions = relationship("WorkflowExecution", back_populates="workflow", cascade="all, delete-orphan")

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"

    id = Column(String(36), primary_key=True, default=lambda: f"exec-{uuid.uuid4().hex[:6]}")
    workflow_id = Column(String(36), ForeignKey("workflows.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    status = Column(String(50), default="pending")  # pending, running, completed, failed, awaiting_approval, cancelled
    current_step_index = Column(Integer, default=0)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    final_report = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)

    workflow = relationship("Workflow", back_populates="executions")
    user = relationship("User", back_populates="executions")
    steps = relationship("ExecutionStep", back_populates="execution", cascade="all, delete-orphan")
    approvals = relationship("ApprovalRequest", back_populates="execution", cascade="all, delete-orphan")

class ExecutionStep(Base):
    __tablename__ = "execution_steps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    execution_id = Column(String(36), ForeignKey("workflow_executions.id"), nullable=False)
    agent_role = Column(String(50), nullable=False)
    agent_name = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")  # pending, running, completed, failed, awaiting_approval, skipped
    duration_ms = Column(Integer, nullable=True)
    output_summary = Column(Text, nullable=True)
    logs = Column(JSON, default=list)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    execution = relationship("WorkflowExecution", back_populates="steps")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    role = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="active")
    model_provider = Column(String(50), default="Groq")
    model_name = Column(String(100), default="llama-3.3-70b-versatile")
    responsibilities = Column(JSON, default=list)
    system_prompt = Column(Text, nullable=False)
    temperature = Column(Float, default=0.2)

class IntegrationAccount(Base):
    __tablename__ = "integration_accounts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    provider_key = Column(String(50), nullable=False)  # github, gmail, telegram, gcalendar, gdrive, whatsapp
    name = Column(String(100), nullable=False)
    status = Column(String(50), default="disconnected")  # connected, disconnected
    account_identifier = Column(String(255), nullable=True)
    encrypted_credentials = Column(Text, nullable=True)
    permissions = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="integrations")

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(String(36), primary_key=True, default=lambda: f"appr-{uuid.uuid4().hex[:6]}")
    execution_id = Column(String(36), ForeignKey("workflow_executions.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action_title = Column(String(255), nullable=False)
    action_description = Column(Text, nullable=False)
    integration_key = Column(String(50), nullable=False)
    integration_name = Column(String(100), nullable=False)
    status = Column(String(50), default="pending")  # pending, approved, rejected
    payload_preview = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    execution = relationship("WorkflowExecution", back_populates="approvals")
    user = relationship("User", back_populates="approvals")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    execution_id = Column(String(36), ForeignKey("workflow_executions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    s3_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

