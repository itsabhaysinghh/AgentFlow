# AgentFlow — Multi-Agent AI Workflow Automation Platform

AgentFlow is an enterprise-grade multi-agent AI workflow automation platform that translates high-level natural language instructions into validated, multi-agent execution graphs orchestrated by **LangGraph**, backed by **FastAPI**, **PostgreSQL**, **Redis**, and **Celery**, with human-in-the-loop verification gates and a **Vesper-inspired cinematic dark UI**.

---

## 1. Architecture Overview

```text
                                 AGENTFLOW PLATFORM
                                 
      +-----------------------------------------------------------------------+
      |               Frontend Application (React + Vite + TS)                |
      |   - Vesper-Inspired Pure Black Theme (#000000) & Liquid Metal Pills   |
      |   - Landing Page, Dashboard Shell, Workflow Creator, Graph Telemetry  |
      +-----------------------------------+-----------------------------------+
                                          |
                      REST API (/api/v1)  |  WebSockets (/ws/executions/{id})
                                          v
      +-----------------------------------+-----------------------------------+
      |                   FastAPI Backend (Modular Monolith)                  |
      |   - JWT Auth & RBAC               - Feature Repositories & Services   |
      |   - API Routers (/workflows, etc) - WebSocket Connection Manager      |
      +-----------------+---------------------------------+-----------------+
                        |                                 |
            Persist &   v                     Dispatch to v
            Query State                                   
      +-----------------+--------+              +---------+-------------------+
      |  PostgreSQL Database     |              |    Redis Broker & Cache     |
      |  - Users & Workflows     |              |  - Celery Task Queue        |
      |  - Executions & Steps    |              |  - Ephemeral Event Pub/Sub  |
      |  - Approvals & Reports   |              +---------+-------------------+
      +--------------------------+                        |
                                                          | Consumes Task
                                                          v
                                                +---------+-------------------+
                                                |     Celery Worker Pool      |
                                                +---------+-------------------+
                                                          |
                                                          | Runs Pipeline
                                                          v
+----------------------------------------------------------------------------------------------------+
|                                 LANGGRAPH MULTI-AGENT SWARM                                        |
|                                                                                                    |
|    +-------------+       +---------------+       +-------------+       +---------------+           |
|    |   PLANNER   | ----> |   RESEARCH    | ----> |  ANALYSIS   | ----> |  VALIDATION   |           |
|    |    AGENT    |       |     AGENT     |       |    AGENT    |       |     AGENT     |           |
|    +-------------+       +---------------+       +-------------+       +-------+-------+           |
|                                                                                |                   |
|                                                     Validation Failed?         |                   |
|                                               +--------------------------------+                   |
|                                               | (Retry Research)                                   |
|                                               v                                                    |
|                                     +-------------------+       +-----------------------+          |
|                                     |   REPORT AGENT    | ----> |  HUMAN-IN-THE-LOOP    |          |
|                                     | (Markdown Dossier)|       |  VERIFICATION GATE    |          |
|                                     +-------------------+       +-----------------------+          |
+----------------------------------------------------------------------------------------------------+
                                                |
                                                | External Tool Connectors (Gated)
                                                v
             +------------+------------+-------------+--------------+------------+
             |   GitHub   |   Gmail    |  Telegram   |   GCalendar  |  WhatsApp  |
             +------------+------------+-------------+--------------+------------+
```

---

## 2. Directory Structure

```text
AgentFlow/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # Automated GitHub Actions test, build & lint pipeline
├── backend/
│   ├── alembic/                     # Database migrations
│   │   ├── versions/                # Generated Alembic revision scripts
│   │   └── env.py                   # Migration environment configuration
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory, CORS, and lifecycle seeder
│   │   ├── core/                    # Security, JWT, bcrypt hashing, and settings
│   │   │   ├── config.py            # Pydantic Settings from environment
│   │   │   ├── logging.py           # Structured logging configuration
│   │   │   └── security.py          # Salted hashing and JWT encode/decode
│   │   ├── db/                      # SQLAlchemy 2.0 database engine & schema
│   │   │   ├── base.py              # Declarative Base
│   │   │   ├── session.py           # Session factory with SQLite/Postgres auto-dialect
│   │   │   └── models.py            # Relational models: Users, Workflows, Steps, Approvals
│   │   ├── features/                # Modular domain features
│   │   │   ├── authentication/      # User register, login, and current profile
│   │   │   ├── workflows/           # Workflow CRUD, natural language plan triggers
│   │   │   ├── executions/          # Execution monitoring and telemetry traces
│   │   │   ├── agents/              # Swarm configuration and temperature parameters
│   │   │   ├── integrations/        # GitHub, Gmail, Telegram tool bindings
│   │   │   ├── approvals/           # Human-in-the-loop review and decision gate
│   │   │   └── reports/             # Formatted dossier exports
│   │   ├── orchestration/           # Core LangGraph implementation
│   │   │   ├── graph.py             # Compiled StateGraph with conditional routing
│   │   │   ├── nodes.py             # Specialized agents (Planner, Researcher, etc.)
│   │   │   ├── routing.py           # Conditional edge logic & retry loops
│   │   │   └── state.py             # TypedDict AgentFlowState schema
│   │   ├── websocket/               # Real-time WebSocket connection manager
│   │   └── workers/                 # Celery app and distributed background tasks
│   ├── tests/                       # Pytest automated test suite
│   ├── Dockerfile                   # Production Python 3.12 multi-stage Docker build
│   ├── pyproject.toml               # Poetry/pip project metadata and pytest settings
│   └── requirements.txt             # Pinned backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Landing page header, hero, indicators, modals
│   │   ├── layouts/                 # Collapsible dashboard sidebar layout
│   │   ├── pages/                   # Workflows, Executions, Swarm, Integrations, Settings
│   │   ├── mock/                    # In-memory reactive state context & realistic data
│   │   ├── types/                   # Strict TypeScript interfaces
│   │   ├── lib/                     # API client, WebSocket telemetry bridge, and utils
│   │   └── App.tsx                  # React Router client-side routing
│   ├── Dockerfile                   # Multi-stage Node.js build with Nginx SPA server
│   ├── package.json                 # React 19, TypeScript, Tailwind CSS, Lucide icons
│   └── tailwind.config.js           # Pure black design tokens and metallic styling
│
├── infrastructure/
│   └── terraform/                   # AWS Cloud Infrastructure as Code (IaC)
│       ├── main.tf                  # VPC, ECS Fargate, ECR, RDS Postgres, S3, ALB
│       ├── variables.tf             # Configurable cloud inputs
│       └── outputs.tf               # Infrastructure endpoints and ARN outputs
├── docker-compose.yml               # Multi-container local production environment
└── README.md                        # Platform documentation & portfolio guide
```

---

## 3. End-to-End Data Flow

When a user initiates an objective such as:  
*“Research the top five cloud computing companies in India, compare AWS, Azure and GCP, analyse their services and generate a report.”*

1. **User Prompt Dispatch**: The prompt is captured in the React workflow creation interface and submitted via `POST /api/v1/workflows/{id}/execute`.
2. **Database Record Initialization**: FastAPI generates a unique `execution_id` (`exec-XXXX`), logs the starting timestamp, and registers initial step rows in PostgreSQL.
3. **Queueing & Worker Handoff**: The execution job is queued in Redis and picked up by a Celery background worker.
4. **LangGraph Pipeline Execution**:
   - **Planner Agent**: Parses the natural language prompt into atomic subtasks, evaluates external tool requirements, and establishes the dependency graph.
   - **Research Agent**: Collects verified technical specifications, datacenter regions, compliance accreditations (e.g. MeitY), and raw metrics.
   - **Analysis Agent**: Synthesizes comparative matrices, calculates compute cost efficiency, and identifies trade-offs.
   - **Validation Agent**: Cross-references claims against citations to prevent hallucinations. If confidence falls below 95%, the graph routes back to the Research Agent for additional verification.
   - **Report Agent**: Compiles the executive dossier into structured, publication-ready markdown.
5. **Human-in-the-Loop Safeguard**: If any sensitive external action is detected (e.g., merging code or sending emails), the execution halts at an approval gate until an operator confirms or rejects the action in the Approvals dashboard.
6. **Telemetry & Persistence**: Final results, step durations, and logs are persisted to PostgreSQL and pushed in real time via WebSockets to the frontend.

---

## 4. Specialized Agents

| Agent | Core Responsibility | Model Provider | Temperature |
| :--- | :--- | :--- | :--- |
| **Planner Agent** | Deconstructs user objectives into an optimized directed acyclic graph (DAG). | Groq / LLaMA 3.3 70B | `0.2` (Deterministic) |
| **Research Agent** | Queries search brokers, extracts pricing matrices, and collects citations. | Groq / LLaMA 3.3 70B | `0.3` (Exploratory) |
| **Analysis Agent** | Evaluates compliance, compute pricing tiers, and statistical variance. | Groq / LLaMA 3.3 70B | `0.2` (Analytical) |
| **Validation Agent** | Factual auditing, hallucination detection, and compliance gating. | Groq / LLaMA 3.3 70B | `0.1` (Strict) |
| **Report Agent** | Executive dossier compilation and structured markdown synthesis. | Groq / LLaMA 3.3 70B | `0.4` (Synthesizing) |

---

## 5. Local Development Setup

### Prerequisites
- Node.js `v20+` & npm
- Python `3.12+`

### Step 1: Frontend Setup
```bash
cd frontend
npm install
npm test          # Runs Vitest unit test suite
npm run build     # Verifies TypeScript & bundle compilation
npm run dev       # Starts Vite dev server on http://localhost:5173
```

### Step 2: Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt

# Run migrations:
alembic upgrade head

# Run backend test suite:
pytest tests -v

# Start FastAPI server on http://localhost:8000:
uvicorn app.main:app --reload --port 8000
```

### Interactive API Documentation
- OpenAPI Swagger UI: `http://localhost:8000/api/v1/docs`
- Redoc UI: `http://localhost:8000/api/v1/redoc`

---

## 6. Docker & Containerized Deployment

To start the full stack (PostgreSQL, Redis, FastAPI Backend, Celery Worker, and React Nginx Frontend) with one command:

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api/v1`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 7. Cloud Infrastructure (AWS Terraform)

The `infrastructure/terraform` directory provisions an enterprise AWS deployment:
- **VPC**: Dual-AZ public and private subnets with internet routing.
- **Application Load Balancer (ALB)**: Public entry point routing traffic to backend and frontend services.
- **ECS Fargate**: Serverless container orchestration for FastAPI and Celery workers.
- **RDS PostgreSQL**: Managed relational database in isolated private subnets.
- **Amazon S3**: Secure object storage for generated reports and data exports.
- **Amazon ECR**: Container registries for versioned deployment images.
- **CloudWatch Logs & Secrets Manager**: Centralized logging and credential management.

---

## 8. Feature Status Ledger

| Feature Area | Status | Notes |
| :--- | :--- | :--- |
| **Cinematic Landing Page** | Fully Implemented & Tested | Pure `#000000` Vesper aesthetic, video background, responsive navigation. |
| **Application Dashboard** | Fully Implemented & Tested | Collapsible sidebar, metrics, workflow creator, agent monitor, approvals. |
| **LangGraph Multi-Agent Engine** | Fully Implemented & Tested | 5-agent state graph with conditional edges and validation loops. |
| **FastAPI REST API** | Fully Implemented & Tested | `/api/v1` endpoints for Auth, Workflows, Executions, Agents, and Approvals. |
| **Database & Migrations** | Fully Implemented & Tested | SQLAlchemy 2.0 models + Alembic revision script with PostgreSQL/SQLite compatibility. |
| **Automated Testing** | Fully Implemented & Tested | Pytest backend suite (4/4 passed) + Vitest frontend suite (3/3 passed). |
| **Docker & Docker Compose** | Fully Implemented | Multi-stage Dockerfiles + complete 5-service `docker-compose.yml`. |
| **AWS Terraform IaC** | Fully Implemented | Production-ready Terraform configuration for VPC, ECS, RDS, ALB, and S3. |
| **CI/CD Pipeline** | Fully Implemented | GitHub Actions workflow for automated testing, type-checking, and builds. |
| **Real Tool Integrations** | Architected & Safe-Gated | GitHub, Gmail, Telegram OAuth architectures with zero-trust approval gates. External API dispatch awaits live user-provided API credentials. |
