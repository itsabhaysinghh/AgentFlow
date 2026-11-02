from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.db.models import Agent, User, Workflow, WorkflowExecution
from app.core.security import get_password_hash

# Routers
from app.features.authentication.routes import auth_router
from app.features.workflows.routes import workflows_router
from app.features.executions.routes import executions_router
from app.features.agents.routes import agents_router
from app.features.integrations.routes import integrations_router
from app.features.approvals.routes import approvals_router
from app.features.reports.routes import reports_router
from app.websocket.router import ws_router

setup_logging()

def seed_initial_database():
    """Seeds default agents and admin user if not present"""
    db = SessionLocal()
    try:
        # 1. Seed Default User
        admin = db.query(User).filter(User.email == "alex.vance@agentflow.io").first()
        if not admin:
            admin = User(
                email="alex.vance@agentflow.io",
                hashed_password=get_password_hash("password123"),
                full_name="Alex Vance",
                role="Lead AI Systems Architect",
                is_superuser=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # 2. Seed Default Agents
        default_agents_data = [
            {
                "role": "planner",
                "name": "Planner Agent",
                "description": "Deconstructs high-level objectives into an optimized directed acyclic graph (DAG) of actionable subtasks.",
                "responsibilities": ["Parse natural language instructions", "Establish DAG topology", "Identify approval gates"],
                "system_prompt": "You are an expert AI workflow architect. Break user goals into atomic subtasks for research, analysis, and validation.",
                "temperature": 0.2
            },
            {
                "role": "researcher",
                "name": "Research Agent",
                "description": "Queries search APIs, retrieves documentation, scrapes trusted web sources, and gathers raw intelligence.",
                "responsibilities": ["Harvest documentation", "Extract metrics & citations", "Query search brokers"],
                "system_prompt": "You are an autonomous Research Agent. Gather objective facts and citations without unverified opinions.",
                "temperature": 0.3
            },
            {
                "role": "analyst",
                "name": "Analysis Agent",
                "description": "Performs quantitative evaluations, matrix comparisons, sentiment breakdown, and pattern identification.",
                "responsibilities": ["Synthesize disparate sources", "Compute variance and cost efficiency", "Evaluate trade-offs"],
                "system_prompt": "You are an analytical intelligence agent. Transform raw research into comparative benchmark matrices.",
                "temperature": 0.2
            },
            {
                "role": "validator",
                "name": "Validation Agent",
                "description": "Audits outputs against source citations, checks for hallucinations, and ensures compliance constraints.",
                "responsibilities": ["Cross-reference source citations", "Detect AI hallucinations", "Flag high-risk actions"],
                "system_prompt": "You are a strict verification and fact-checking agent. Scrutinize every claim and reject unsupported assertions.",
                "temperature": 0.1
            },
            {
                "role": "reporter",
                "name": "Report Agent",
                "description": "Compiles validated findings into publication-ready markdown reports, summaries, and executive decks.",
                "responsibilities": ["Structure executive summaries", "Generate markdown comparison tables", "Format audit logs"],
                "system_prompt": "You are an executive reporting agent. Assemble validated data into structured markdown dossiers.",
                "temperature": 0.4
            }
        ]

        for item in default_agents_data:
            existing = db.query(Agent).filter(Agent.role == item["role"]).first()
            if not existing:
                agent = Agent(**item)
                db.add(agent)

        # 3. Seed Initial Demo Workflow if empty
        wf_count = db.query(Workflow).count()
        if wf_count == 0:
            demo_wf = Workflow(
                user_id=admin.id,
                title="Cloud Computing Market Analysis",
                description="Researches top cloud providers, compares regional datacenter availability, pricing tiers, and prepares an executive comparative report.",
                prompt_template="Research the top five cloud computing companies in India, compare their services, and prepare a report.",
                category="Market Intelligence",
                status="active",
                requires_approval=True
            )
            db.add(demo_wf)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    seed_initial_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(workflows_router, prefix=settings.API_V1_STR)
app.include_router(executions_router, prefix=settings.API_V1_STR)
app.include_router(agents_router, prefix=settings.API_V1_STR)
app.include_router(integrations_router, prefix=settings.API_V1_STR)
app.include_router(approvals_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgentFlow Orchestration Engine",
        "version": "1.0.0"
    }

@app.get("/ready")
def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "orchestrator": "online"
    }
