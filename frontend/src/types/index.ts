export type AgentRole = 'planner' | 'researcher' | 'analyst' | 'validator' | 'reporter';

export interface AgentInfo {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  modelProvider: string;
  modelName: string;
  responsibilities: string[];
  systemPrompt: string;
  temperature: number;
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval' | 'cancelled';

export interface ExecutionStep {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  outputSummary?: string;
  logs: {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
  }[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowTitle: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  prompt: string;
  steps: ExecutionStep[];
  currentStepIndex: number;
  finalReport?: string;
  errorMessage?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
  status: 'active' | 'draft' | 'archived';
  category: string;
  createdAt: string;
  updatedAt: string;
  totalExecutions: number;
  lastExecutedAt?: string;
  defaultAgents: AgentRole[];
  requiresApproval: boolean;
}

export interface Integration {
  id: string;
  name: string;
  key: 'github' | 'gmail' | 'telegram' | 'gcalendar' | 'gdrive' | 'whatsapp';
  description: string;
  status: 'connected' | 'disconnected' | 'configuring';
  category: 'code' | 'communication' | 'productivity' | 'messaging';
  connectedAccount?: string;
  lastSync?: string;
  permissions: string[];
}

export interface ApprovalRequest {
  id: string;
  executionId: string;
  workflowTitle: string;
  actionTitle: string;
  actionDescription: string;
  integrationKey: Integration['key'];
  integrationName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  payloadPreview: Record<string, string>;
}

export interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    role: string;
  };
  aiPreferences: {
    provider: string;
    groqApiKey: string;
    defaultModel: string;
    temperature: number;
    maxTokens: number;
  };
  notifications: {
    emailOnApproval: boolean;
    emailOnFailure: boolean;
    telegramAlerts: boolean;
  };
}

