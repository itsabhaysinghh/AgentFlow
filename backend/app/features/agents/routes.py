from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.db.session import get_db
from app.db.models import Agent

agents_router = APIRouter(prefix="/agents", tags=["Agents"])

class AgentConfigUpdate(BaseModel):
    system_prompt: str
    temperature: float

@agents_router.get("")
def list_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
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

@agents_router.get("/{role}")
def get_agent(role: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.role == role).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@agents_router.put("/{role}")
def update_agent_config(role: str, config: AgentConfigUpdate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.role == role).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.system_prompt = config.system_prompt
    agent.temperature = config.temperature
    db.commit()
    return {"message": "Agent parameters updated", "role": role}

