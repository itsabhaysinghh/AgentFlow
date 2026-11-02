import type { AgentInfo, Workflow, WorkflowExecution, Integration, ApprovalRequest, UserSettings } from '@/types';

export const initialAgents: AgentInfo[] = [
  {
    id: 'agent-1',
    role: 'planner',
    name: 'Planner Agent',
    description: 'Deconstructs high-level objectives into an optimized directed acyclic graph (DAG) of actionable subtasks.',
    status: 'active',
    modelProvider: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    responsibilities: [
      'Parse natural-language instructions into atomic tasks',
      'Determine execution sequence and agent dependencies',
      'Identify required external tools and human-in-the-loop checkpoints',
      'Set validation constraints for downstream outputs'
    ],
    systemPrompt: 'You are an expert AI workflow architect. Your responsibility is to break complex user goals into rigorous, serial and parallel subtasks for specialized research, analysis, validation, and reporting agents.',
    temperature: 0.2,
  },
  {
    id: 'agent-2',
    role: 'researcher',
    name: 'Research Agent',
    description: 'Queries search APIs, retrieves documentation, scrapes trusted web sources, and gathers raw intelligence.',
    status: 'active',
    modelProvider: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    responsibilities: [
      'Query verified external APIs and search providers',
      'Scrape data sheets, documentation, and pricing pages',
      'Extract structured metadata and citation URLs',
      'Filter out promotional fluff and irrelevant queries'
    ],
    systemPrompt: 'You are an autonomous Research Agent. You gather objective facts, citations, technical specifications, and raw datasets without inserting unverified opinions or marketing bias.',
    temperature: 0.3,
  },
  {
    id: 'agent-3',
    role: 'analyst',
    name: 'Analysis Agent',
    description: 'Performs quantitative evaluations, matrix comparisons, sentiment breakdown, and pattern identification.',
    status: 'active',
    modelProvider: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    responsibilities: [
      'Synthesize disparate data sources into comparative matrices',
      'Evaluate cost structures, latency benchmarks, and feature parity',
      'Calculate statistical variance and confidence scores',
      'Highlight trade-offs and structural differences'
    ],
    systemPrompt: 'You are an analytical intelligence agent. Transform raw research findings into comparative tables, identify trade-offs, and compute objective metrics.',
    temperature: 0.2,
  },
  {
    id: 'agent-4',
    role: 'validator',
    name: 'Validation Agent',
    description: 'Audits outputs against source citations, checks for hallucinations, and ensures compliance constraints.',
    status: 'active',
    modelProvider: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    responsibilities: [
      'Cross-reference claims with original research links',
      'Detect AI hallucinations or numerical inconsistencies',
      'Flag high-risk actions requiring human verification',
      'Verify strict schema compliance of structured outputs'
    ],
    systemPrompt: 'You are a strict verification and fact-checking agent. Scrutinize every claim, citation, and numeric data point. Reject unsupported claims.',
    temperature: 0.1,
  },
  {
    id: 'agent-5',
    role: 'reporter',
    name: 'Report Agent',
    description: 'Compiles validated findings into publication-ready markdown reports, summaries, and executive decks.',
    status: 'active',
    modelProvider: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    responsibilities: [
      'Structure executive summaries and key takeaway callouts',
      'Generate markdown tables and comparison grids',
      'Format footnotes, references, and audit logs',
      'Tailor tone for technical architects and decision-makers'
    ],
    systemPrompt: 'You are an executive synthesis and technical reporting agent. Assemble validated data into immaculate, structured markdown reports.',
    temperature: 0.4,
  },
];

export const initialWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    title: 'Cloud Computing Market Analysis',
    description: 'Researches top cloud providers, compares regional datacenter availability, pricing tiers, and prepares an executive comparative report.',
    promptTemplate: 'Research the top five cloud computing companies in India, compare their services, and prepare a report.',
    status: 'active',
    category: 'Market Intelligence',
    createdAt: '2026-10-18T10:30:00Z',
    updatedAt: '2026-11-01T14:15:00Z',
    totalExecutions: 24,
    lastExecutedAt: '2026-11-02T19:40:00Z',
    defaultAgents: ['planner', 'researcher', 'analyst', 'validator', 'reporter'],
    requiresApproval: true,
  },
  {
    id: 'wf-2',
    title: 'Automated GitHub PR Security Audit',
    description: 'Scans pull request diffs, checks dependencies against vulnerability databases, and prepares an approval request before tagging releases.',
    promptTemplate: 'Inspect recent PRs in the repository, evaluate code changes for secret leakage and dependency vulnerabilities, and format an audit summary.',
    status: 'active',
    category: 'DevSecOps',
    createdAt: '2026-10-22T08:10:00Z',
    updatedAt: '2026-10-30T16:20:00Z',
    totalExecutions: 48,
    lastExecutedAt: '2026-11-02T21:15:00Z',
    defaultAgents: ['planner', 'researcher', 'analyst', 'validator'],
    requiresApproval: true,
  },
  {
    id: 'wf-3',
    title: 'Weekly Tech Competitive Intelligence',
    description: 'Aggregates product announcements, changelogs, and patent filings across designated tech competitors.',
    promptTemplate: 'Gather this week’s product launches and architectural updates from leading AI infrastructure startups.',
    status: 'active',
    category: 'Market Intelligence',
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-11-02T09:30:00Z',
    totalExecutions: 12,
    lastExecutedAt: '2026-11-02T22:00:00Z',
    defaultAgents: ['planner', 'researcher', 'analyst', 'reporter'],
    requiresApproval: false,
  },
  {
    id: 'wf-4',
    title: 'Customer Feedback Sentiment Clustering',
    description: 'Processes incoming feedback from Telegram and Gmail, extracts sentiment categories, and drafts weekly action items.',
    promptTemplate: 'Analyze customer support tickets from the last 7 days, categorize main friction points, and output high-priority resolutions.',
    status: 'draft',
    category: 'Operations',
    createdAt: '2026-10-29T15:45:00Z',
    updatedAt: '2026-10-29T15:45:00Z',
    totalExecutions: 0,
    defaultAgents: ['planner', 'analyst', 'reporter'],
    requiresApproval: true,
  },
];

export const initialExecutions: WorkflowExecution[] = [
  {
    id: 'exec-8491',
    workflowId: 'wf-1',
    workflowTitle: 'Cloud Computing Market Analysis',
    status: 'completed',
    startedAt: '2026-11-02T19:40:00Z',
    completedAt: '2026-11-02T19:40:42Z',
    durationSeconds: 42,
    prompt: 'Research the top five cloud computing companies in India, compare their services, and prepare a report.',
    currentStepIndex: 4,
    steps: [
      {
        id: 'step-1',
        agentRole: 'planner',
        agentName: 'Planner Agent',
        title: 'Task Decomposition & DAG Creation',
        status: 'completed',
        startedAt: '2026-11-02T19:40:00Z',
        completedAt: '2026-11-02T19:40:05Z',
        durationMs: 4800,
        outputSummary: 'Formulated 4-stage research graph targeting AWS, Microsoft Azure, Google Cloud, Yotta D1, and Tata Communications.',
        logs: [
          { timestamp: '19:40:01', level: 'info', message: 'Received user prompt: "Research the top five cloud computing companies in India..."' },
          { timestamp: '19:40:02', level: 'info', message: 'Identified entities: AWS India, Azure India, GCP India, Yotta Infrastructure, Tata Communications.' },
          { timestamp: '19:40:04', level: 'success', message: 'Generated task dependency graph with 8 target endpoints.' },
        ],
      },
      {
        id: 'step-2',
        agentRole: 'researcher',
        agentName: 'Research Agent',
        title: 'Gather Regional Cloud Infrastructure Metrics',
        status: 'completed',
        startedAt: '2026-11-02T19:40:05Z',
        completedAt: '2026-11-02T19:40:17Z',
        durationMs: 12100,
        outputSummary: 'Harvested regional availability zones (Mumbai, Hyderabad, Chennai), MeitY compliance accreditations, and local billing support.',
        logs: [
          { timestamp: '19:40:06', level: 'info', message: 'Querying public infrastructure datasets for MeitY-empanelled cloud service providers (CSPs).' },
          { timestamp: '19:40:10', level: 'info', message: 'Extracted active zones: AWS (ap-south-1 Mumbai, ap-south-2 Hyderabad), Azure (Central India, South India, West India).' },
          { timestamp: '19:40:14', level: 'info', message: 'Retrieved Yotta NM1 and D1 Greater Noida hyperscale capacity specifications.' },
          { timestamp: '19:40:16', level: 'success', message: 'Collected 42 data points across 5 CSPs.' },
        ],
      },
      {
        id: 'step-3',
        agentRole: 'analyst',
        agentName: 'Analysis Agent',
        title: 'Comparative Matrix & Trade-Off Synthesis',
        status: 'completed',
        startedAt: '2026-11-02T19:40:17Z',
        completedAt: '2026-11-02T19:40:28Z',
        durationMs: 11400,
        outputSummary: 'Synthesized pricing efficiency, data sovereignty compliance, latency benchmarks, and ecosystem breadth.',
        logs: [
          { timestamp: '19:40:18', level: 'info', message: 'Normalizing compute pricing for general-purpose 4 vCPU / 16GB RAM instances across INR tariffs.' },
          { timestamp: '19:40:22', level: 'info', message: 'Scoring compliance: 100% MeitY audited status for banking and government sector workloads.' },
          { timestamp: '19:40:27', level: 'success', message: 'Constructed multi-dimensional benchmark ranking.' },
        ],
      },
      {
        id: 'step-4',
        agentRole: 'validator',
        agentName: 'Validation Agent',
        title: 'Factual Audit & Citation Cross-Check',
        status: 'completed',
        startedAt: '2026-11-02T19:40:28Z',
        completedAt: '2026-11-02T19:40:34Z',
        durationMs: 6200,
        outputSummary: 'Verified 100% of datacenter operational claims against Ministry of Electronics & IT empanelment records.',
        logs: [
          { timestamp: '19:40:29', level: 'info', message: 'Validating zone launch dates and MeitY accreditation numbers.' },
          { timestamp: '19:40:31', level: 'info', message: 'Zero hallucinations detected in pricing conversion tables.' },
          { timestamp: '19:40:33', level: 'success', message: 'Quality audit passed with 99.4% confidence score.' },
        ],
      },
      {
        id: 'step-5',
        agentRole: 'reporter',
        agentName: 'Report Agent',
        title: 'Generate Executive Markdown Dossier',
        status: 'completed',
        startedAt: '2026-11-02T19:40:34Z',
        completedAt: '2026-11-02T19:40:42Z',
        durationMs: 7800,
        outputSummary: 'Drafted 5-page structured markdown dossier with comparative tables and strategic deployment recommendations.',
        logs: [
          { timestamp: '19:40:35', level: 'info', message: 'Rendering executive summary and key findings.' },
          { timestamp: '19:40:38', level: 'info', message: 'Injecting markdown comparison tables.' },
          { timestamp: '19:40:41', level: 'success', message: 'Report completed and persisted to database store.' },
        ],
      },
    ],
    finalReport: `# Executive Report: Top 5 Cloud Computing Providers in India

**Prepared by:** AgentFlow Autonomous Multi-Agent Pipeline  
**Execution Reference:** \`EXEC-8491\`  
**Validation Status:** Verified (Confidence Score: 99.4%)

---

## 1. Executive Summary
The Indian cloud computing landscape is characterized by aggressive hyperscale expansion, stringent **MeitY (Ministry of Electronics and Information Technology)** data sovereignty mandates, and surging demand for localized GPU compute clusters. The top five providers leading enterprise adoption are:

1. **Amazon Web Services (AWS)** — Ecosystem depth & dual-region resilience
2. **Microsoft Azure** — Strongest public-sector & enterprise ERP presence
3. **Google Cloud Platform (GCP)** — Analytics, Kubernetes, and AI workload lead
4. **Yotta Infrastructure** — Sovereign hyperscale colocation & NVIDIA H100 GPU clusters
5. **Tata Communications Cloud** — Hybrid enterprise networking & banking grade SLA

---

## 2. Comparative Matrix

| Provider | India Regions & Zones | MeitY Empanelled | Sovereign GPU Hub | Key Differentiator |
| :--- | :--- | :--- | :--- | :--- |
| **AWS** | Mumbai (\`ap-south-1\`), Hyderabad (\`ap-south-2\`) | Yes | High availability | Mature managed services (200+ services) |
| **Azure** | Central (Pune), South (Chennai), West (Mumbai) | Yes | High availability | Seamless Microsoft 365 / Active Directory integration |
| **Google Cloud** | Mumbai (\`asia-south1\`), Delhi-NCR (\`asia-south2\`) | Yes | High availability | BigQuery & Vertex AI low-latency endpoints |
| **Yotta** | Navi Mumbai (NM1), Greater Noida (D1) | Yes | **16,000+ H100 GPUs** | Lowest cost per compute unit; 100% sovereign hosting |
| **Tata Comms** | 12+ Datacenters across India | Yes | Enterprise tier | Integrated MPLS, SD-WAN, and zero-egress models |

---

## 3. Strategic Recommendations
- **For Regulated BFSI Workloads**: Azure or AWS combined with Yotta colocation provides optimal MeitY and RBI data localization compliance.
- **For High-Compute AI / LLM Training**: Yotta's Shakti Cloud offers direct sovereign access to Nvidia Hopper clusters at sub-international pricing.
- **For Cloud-Native Microservices**: GCP's dual-region presence across Mumbai and Delhi-NCR ensures fault-tolerant 3ms latency thresholds.`,
  },
  {
    id: 'exec-8492',
    workflowId: 'wf-2',
    workflowTitle: 'Automated GitHub PR Security Audit',
    status: 'awaiting_approval',
    startedAt: '2026-11-02T21:15:00Z',
    prompt: 'Inspect recent PRs in the repository, evaluate code changes for secret leakage and dependency vulnerabilities, and format an audit summary.',
    currentStepIndex: 3,
    steps: [
      {
        id: 'step-201',
        agentRole: 'planner',
        agentName: 'Planner Agent',
        title: 'Audit Scope & Rule Mapping',
        status: 'completed',
        startedAt: '2026-11-02T21:15:00Z',
        completedAt: '2026-11-02T21:15:04Z',
        durationMs: 3900,
        outputSummary: 'Scanned PR #42 in agentflow/core. Identified 14 modified files.',
        logs: [
          { timestamp: '21:15:01', level: 'info', message: 'Fetching PR git diff from GitHub API.' },
          { timestamp: '21:15:03', level: 'success', message: 'Target: PR #42 "feat: add redis cache layer".' },
        ],
      },
      {
        id: 'step-202',
        agentRole: 'researcher',
        agentName: 'Research Agent',
        title: 'CVE Database & Dependency Lookup',
        status: 'completed',
        startedAt: '2026-11-02T21:15:04Z',
        completedAt: '2026-11-02T21:15:12Z',
        durationMs: 7800,
        outputSummary: 'Cross-referenced redis-py and celery packages against OSV / GitHub Advisory Database.',
        logs: [
          { timestamp: '21:15:05', level: 'info', message: 'Checking 6 new dependencies in pyproject.toml.' },
          { timestamp: '21:15:10', level: 'success', message: 'Zero known vulnerabilities in imported version pins.' },
        ],
      },
      {
        id: 'step-203',
        agentRole: 'analyst',
        agentName: 'Analysis Agent',
        title: 'Static Pattern & Secret Leakage Inspection',
        status: 'completed',
        startedAt: '2026-11-02T21:15:12Z',
        completedAt: '2026-11-02T21:15:20Z',
        durationMs: 7900,
        outputSummary: 'Found clean environment handling. Detected recommended approval rule before auto-merging.',
        logs: [
          { timestamp: '21:15:13', level: 'info', message: 'Scanning regex patterns for AWS secrets, JWT private keys, and passwords.' },
          { timestamp: '21:15:19', level: 'success', message: 'Clean diff verified. Prepared approval request for GitHub merge.' },
        ],
      },
      {
        id: 'step-204',
        agentRole: 'validator',
        agentName: 'Validation Agent',
        title: 'Human-in-the-Loop Approval Checkpoint',
        status: 'awaiting_approval',
        startedAt: '2026-11-02T21:15:20Z',
        outputSummary: 'Halted execution before sensitive action: "Approve and Merge PR #42 on agentflow/core". Waiting for operator review.',
        logs: [
          { timestamp: '21:15:21', level: 'warn', message: 'Sensitive action intercepted: GitHub PR approval & comment.' },
          { timestamp: '21:15:21', level: 'info', message: 'Dispatched approval item APPR-101 to Approvals dashboard.' },
        ],
      },
      {
        id: 'step-205',
        agentRole: 'reporter',
        agentName: 'Report Agent',
        title: 'Publish Audit Log & PR Badge',
        status: 'pending',
        logs: [],
      },
    ],
  },
  {
    id: 'exec-8493',
    workflowId: 'wf-3',
    workflowTitle: 'Weekly Tech Competitive Intelligence',
    status: 'running',
    startedAt: '2026-11-02T22:00:00Z',
    prompt: 'Gather this week’s product launches and architectural updates from leading AI infrastructure startups.',
    currentStepIndex: 1,
    steps: [
      {
        id: 'step-301',
        agentRole: 'planner',
        agentName: 'Planner Agent',
        title: 'Query Plan & Source Selection',
        status: 'completed',
        startedAt: '2026-11-02T22:00:00Z',
        completedAt: '2026-11-02T22:00:04Z',
        durationMs: 4100,
        outputSummary: 'Compiled target list of 12 AI infrastructure companies and RSS/changelog sources.',
        logs: [
          { timestamp: '22:00:01', level: 'info', message: 'Decomposing queries for vector database releases and inference runtimes.' },
          { timestamp: '22:00:03', level: 'success', message: 'Task graph initialized.' },
        ],
      },
      {
        id: 'step-302',
        agentRole: 'researcher',
        agentName: 'Research Agent',
        title: 'Live Changelog Crawl & Scraping',
        status: 'running',
        startedAt: '2026-11-02T22:00:04Z',
        outputSummary: 'Extracting release notes and API deprecations...',
        logs: [
          { timestamp: '22:00:05', level: 'info', message: 'Querying vLLM, Ollama, LangChain, and Qdrant releases.' },
          { timestamp: '22:00:09', level: 'info', message: 'Harvested 18 changelog entries from past 7 days.' },
        ],
      },
      {
        id: 'step-303',
        agentRole: 'analyst',
        agentName: 'Analysis Agent',
        title: 'Feature Delta & Market Impact Analysis',
        status: 'pending',
        logs: [],
      },
      {
        id: 'step-304',
        agentRole: 'validator',
        agentName: 'Validation Agent',
        title: 'Source Verification',
        status: 'pending',
        logs: [],
      },
      {
        id: 'step-305',
        agentRole: 'reporter',
        agentName: 'Report Agent',
        title: 'Weekly Digest Compilation',
        status: 'pending',
        logs: [],
      },
    ],
  },
  {
    id: 'exec-8490',
    workflowId: 'wf-1',
    workflowTitle: 'Cloud Computing Market Analysis',
    status: 'failed',
    startedAt: '2026-11-02T16:10:00Z',
    completedAt: '2026-11-02T16:10:14Z',
    durationSeconds: 14,
    prompt: 'Evaluate APAC cloud cost differentials for Kubernetes bare metal clusters.',
    currentStepIndex: 1,
    errorMessage: 'External API Rate Limit Exceeded (HTTP 429) on search endpoint.',
    steps: [
      {
        id: 'step-101',
        agentRole: 'planner',
        agentName: 'Planner Agent',
        title: 'DAG Construction',
        status: 'completed',
        startedAt: '2026-11-02T16:10:00Z',
        completedAt: '2026-11-02T16:10:04Z',
        durationMs: 4000,
        outputSummary: 'Plan formulated successfully.',
        logs: [
          { timestamp: '16:10:02', level: 'info', message: 'Initialized task pipeline.' },
        ],
      },
      {
        id: 'step-102',
        agentRole: 'researcher',
        agentName: 'Research Agent',
        title: 'Provider Pricing Retrieval',
        status: 'failed',
        startedAt: '2026-11-02T16:10:04Z',
        completedAt: '2026-11-02T16:10:14Z',
        durationMs: 10000,
        outputSummary: 'Failed to complete search query: HTTP 429 Too Many Requests.',
        logs: [
          { timestamp: '16:10:05', level: 'info', message: 'Connecting to search broker...' },
          { timestamp: '16:10:14', level: 'error', message: 'Provider returned HTTP 429 (Rate Limit). Execution halted.' },
        ],
      },
    ],
  },
];

export const initialIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'GitHub',
    key: 'github',
    description: 'Inspect repositories, pull requests, automated code audits, and PR review comments.',
    status: 'connected',
    category: 'code',
    connectedAccount: 'agentflow-platform/core',
    lastSync: '10 minutes ago',
    permissions: ['repo:read', 'pull_requests:write', 'issues:write'],
  },
  {
    id: 'int-2',
    name: 'Gmail',
    key: 'gmail',
    description: 'Draft, format, and dispatch executive reports and workflow completion alerts via Google Workspace.',
    status: 'connected',
    category: 'communication',
    connectedAccount: 'ops@agentflow.io',
    lastSync: '25 minutes ago',
    permissions: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
  },
  {
    id: 'int-3',
    name: 'Telegram',
    key: 'telegram',
    description: 'Send high-priority notifications, workflow status alerts, and human approval prompts directly to Telegram bots.',
    status: 'connected',
    category: 'messaging',
    connectedAccount: '@AgentFlowAlertsBot',
    lastSync: '1 hour ago',
    permissions: ['send_messages', 'inline_keyboard_callbacks'],
  },
  {
    id: 'int-4',
    name: 'Google Calendar',
    key: 'gcalendar',
    description: 'Schedule automated recurring runs and synchronize workflow execution timelines with your team calendar.',
    status: 'disconnected',
    category: 'productivity',
    permissions: ['calendar.events.readonly', 'calendar.events.write'],
  },
  {
    id: 'int-5',
    name: 'Google Drive',
    key: 'gdrive',
    description: 'Automatically export generated reports, analysis dossiers, and raw data dumps to Google Drive folders.',
    status: 'disconnected',
    category: 'productivity',
    permissions: ['drive.file', 'drive.readonly'],
  },
  {
    id: 'int-6',
    name: 'WhatsApp',
    key: 'whatsapp',
    description: 'Enterprise WhatsApp Business Cloud API integration for urgent human-in-the-loop approval escalation.',
    status: 'disconnected',
    category: 'messaging',
    permissions: ['messages:write', 'templates:read'],
  },
];

export const initialApprovals: ApprovalRequest[] = [
  {
    id: 'appr-101',
    executionId: 'exec-8492',
    workflowTitle: 'Automated GitHub PR Security Audit',
    actionTitle: 'Post PR Security Review & Merge Approval',
    actionDescription: 'AgentFlow wants to post a verified security audit comment and submit an approval status check on GitHub PR #42 in repository agentflow-platform/core.',
    integrationKey: 'github',
    integrationName: 'GitHub',
    status: 'pending',
    createdAt: '2026-11-02T21:15:21Z',
    payloadPreview: {
      'Target Repository': 'agentflow-platform/core',
      'PR Number': '#42',
      'Action': 'Review: APPROVED',
      'Comment': 'All 14 changed files audited. Zero vulnerability patterns or secret leakages detected.',
    },
  },
  {
    id: 'appr-102',
    executionId: 'exec-8491',
    workflowTitle: 'Cloud Computing Market Analysis',
    actionTitle: 'Email Executive Report to Stakeholders',
    actionDescription: 'AgentFlow completed execution EXEC-8491 and is requesting authorization to email the final markdown dossier to senior executives.',
    integrationKey: 'gmail',
    integrationName: 'Gmail',
    status: 'pending',
    createdAt: '2026-11-02T20:00:15Z',
    payloadPreview: {
      'Sender': 'ops@agentflow.io',
      'Recipients': 'vp-infra@agentflow.io, lead-architect@agentflow.io',
      'Subject': '[AgentFlow] Top 5 Cloud Providers in India - Executive Comparative Brief',
      'Attachment Format': 'Markdown / HTML PDF export',
    },
  },
  {
    id: 'appr-100',
    executionId: 'exec-8488',
    workflowTitle: 'Weekly Tech Competitive Intelligence',
    actionTitle: 'Broadcast Telegram Channel Digest',
    actionDescription: 'Send weekly synthesis to the private engineering leadership Telegram channel.',
    integrationKey: 'telegram',
    integrationName: 'Telegram',
    status: 'approved',
    createdAt: '2026-11-01T18:00:00Z',
    resolvedAt: '2026-11-01T18:05:22Z',
    payloadPreview: {
      'Target Channel': '@agentflow_leadership',
      'Message Length': '840 words',
    },
  },
];

export const initialSettings: UserSettings = {
  profile: {
    fullName: 'Alex Vance',
    email: 'alex.vance@agentflow.io',
    role: 'Lead AI Systems Architect',
  },
  aiPreferences: {
    provider: 'Groq',
    groqApiKey: 'gsk_demo_••••••••••••••••••••••••••••••••••••',
    defaultModel: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    maxTokens: 4096,
  },
  notifications: {
    emailOnApproval: true,
    emailOnFailure: true,
    telegramAlerts: true,
  },
};
