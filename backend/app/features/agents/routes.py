from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.db.session import get_db
from app.db.models import Agent, AgentExecution, User
from app.features.authentication.routes import get_current_user
from app.features.agents.gemini import GeminiError, available_models, generate

agents_router = APIRouter(prefix="/agents", tags=["Agents"])

class AgentConfigUpdate(BaseModel):
    system_prompt: str
    temperature: float

class AgentCreate(BaseModel):
    name: str
    description: str
    system_prompt: str
    model_name: str = "gemini-3.8-flash"
    temperature: float = 0.2

class AgentRunRequest(BaseModel):
    prompt: str

@agents_router.get("")
def list_agents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agents = db.query(Agent).filter(Agent.user_id == current_user.id).all()
    return [
        {
            "id": a.id,
            "role": a.role,
            "name": a.name,
            "description": a.description,
            "status": a.status,
            "model_provider": a.model_provider,
            "model_name": a.model_name,
            "responsibilities": a.responsibilities,
            "system_prompt": a.system_prompt,
            "temperature": a.temperature
        }
        for a in agents
    ]

@agents_router.get("/models")
def list_gemini_models(current_user: User = Depends(get_current_user)):
    try: return {"provider": "Gemini", "models": available_models()}
    except GeminiError as error: raise HTTPException(status_code=503, detail=str(error))

@agents_router.post("")
def create_agent(payload: AgentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = Agent(user_id=current_user.id, role=f"custom-{payload.name.lower().replace(' ', '-')}", name=payload.name, description=payload.description, system_prompt=payload.system_prompt, model_provider="Gemini", model_name=payload.model_name, temperature=payload.temperature)
    db.add(agent); db.commit(); db.refresh(agent)
    return {"id": agent.id, "name": agent.name, "description": agent.description, "model_name": agent.model_name, "temperature": agent.temperature}

@agents_router.post("/{agent_id}/execute")
def execute_agent(agent_id: str, payload: AgentRunRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == agent_id, Agent.user_id == current_user.id).first()
    if not agent: raise HTTPException(status_code=404, detail="Agent not found")
    record = AgentExecution(user_id=current_user.id, agent_id=agent.id, prompt=payload.prompt, model_name=agent.model_name)
    db.add(record); db.commit()
    try:
        result = generate(model=agent.model_name, system_prompt=agent.system_prompt, prompt=payload.prompt, temperature=agent.temperature)
        record.status = "completed"; record.output = result["output"]; record.duration_seconds = result["duration_seconds"]; record.input_tokens = result["input_tokens"]; record.output_tokens = result["output_tokens"]
    except GeminiError as error:
        record.status = "failed"; record.error_message = str(error)
    db.commit(); db.refresh(record)
    return {"id": record.id, "status": record.status, "output": record.output, "duration_seconds": record.duration_seconds, "input_tokens": record.input_tokens, "output_tokens": record.output_tokens, "error_message": record.error_message}

@agents_router.get("/{agent_id}/executions")
def agent_executions(agent_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not db.query(Agent.id).filter(Agent.id == agent_id, Agent.user_id == current_user.id).first():
        raise HTTPException(status_code=404, detail="Agent not found")
    return [{"id": item.id, "prompt": item.prompt, "output": item.output, "status": item.status, "duration_seconds": item.duration_seconds, "input_tokens": item.input_tokens, "output_tokens": item.output_tokens, "error_message": item.error_message, "created_at": item.created_at} for item in db.query(AgentExecution).filter(AgentExecution.agent_id == agent_id, AgentExecution.user_id == current_user.id).order_by(AgentExecution.created_at.desc()).all()]

@agents_router.delete("/{agent_id}", status_code=204)
def delete_agent(agent_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == agent_id, Agent.user_id == current_user.id).first()
    if not agent: raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent); db.commit()

@agents_router.get("/{role}")
def get_agent(role: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.role == role, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@agents_router.put("/{role}")
def update_agent_config(role: str, config: AgentConfigUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.role == role, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.system_prompt = config.system_prompt
    agent.temperature = config.temperature
    db.commit()
    return {"message": "Agent parameters updated", "role": role}

