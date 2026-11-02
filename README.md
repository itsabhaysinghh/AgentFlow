# AgentFlow — Multi-Agent AI Automation Platform

AgentFlow is an enterprise-grade multi-agent AI workflow automation platform that enables users to translate natural-language tasks into structured, verifiable multi-agent execution pipelines using LangGraph and human-in-the-loop safeguards.

## Architecture Overview

```text
Frontend (React + Vite + Tailwind + TypeScript)
   │
   ▼  REST / WebSocket
FastAPI Backend (Modular Monolith)
   │
   ▼
Feature Services & Repositories (PostgreSQL)
   │
   ▼
LangGraph Orchestration Engine
   ├── Planner Agent (DAG task deconstruction)
   ├── Research Agent (Data retrieval & scraping)
   ├── Analysis Agent (Quantitative & qualitative synthesis)
   ├── Validation Agent (Claim auditing & citation verification)
   └── Report Agent (Structured synthesis & output generation)
   │
   ▼
Human-in-the-Loop Verification Gate
```

## Current Status: Phase 1 (Foundation & Landing Page)

- [x] Initialized clean project structure with Git version control and proper `.gitignore`
- [x] Scaffolded React + TypeScript + Vite frontend
- [x] Configured Tailwind CSS with custom design tokens matching the Vesper aesthetic
- [x] Loaded typography: Inter (UI) and Instrument Serif (Italic hero highlights)
- [x] Implemented responsive navigation with liquid-metal pills and glass CTAs
- [x] Integrated cinematic video hero layer with fallback and pure `#000000` vignette overlays
- [x] Built understated bottom feature indicators for Multi-agent orchestration, Human-in-the-loop approvals, and Connected tools
- [x] Implemented interactive Workflow Pipeline preview modal simulating the 5 specialized agents

## Quick Start (Frontend)

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

