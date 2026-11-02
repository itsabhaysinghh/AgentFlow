import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Workflow, 
  WorkflowExecution, 
  AgentInfo, 
  Integration, 
  ApprovalRequest, 
  UserSettings,
  ExecutionStep
} from '@/types';
import { 
  initialWorkflows, 
  initialExecutions, 
  initialAgents, 
  initialIntegrations, 
  initialApprovals, 
  initialSettings 
} from './mockData';

interface MockContextType {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  agents: AgentInfo[];
  integrations: Integration[];
  approvals: ApprovalRequest[];
  settings: UserSettings;
  
  // Workflow Actions
  createWorkflow: (data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'totalExecutions'>) => Workflow;
  updateWorkflow: (id: string, data: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  runWorkflow: (workflowId: string, customPrompt?: string) => string;
  
  // Execution Actions
  getExecution: (id: string) => WorkflowExecution | undefined;
  cancelExecution: (id: string) => void;
  retryExecution: (id: string) => void;
  
  // Agent Actions
  updateAgentConfig: (id: string, updates: Partial<AgentInfo>) => void;
  
  // Integration Actions
  toggleIntegration: (id: string) => void;
  
  // Approval Actions
  resolveApproval: (id: string, status: 'approved' | 'rejected') => void;
  
  // Settings Actions
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    const saved = localStorage.getItem('agentflow_workflows');
    return saved ? JSON.parse(saved) : initialWorkflows;
  });

  const [executions, setExecutions] = useState<WorkflowExecution[]>(() => {
    const saved = localStorage.getItem('agentflow_executions');
    return saved ? JSON.parse(saved) : initialExecutions;
  });

  const [agents, setAgents] = useState<AgentInfo[]>(() => {
    const saved = localStorage.getItem('agentflow_agents');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem('agentflow_integrations');
    return saved ? JSON.parse(saved) : initialIntegrations;
  });

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const saved = localStorage.getItem('agentflow_approvals');
    return saved ? JSON.parse(saved) : initialApprovals;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('agentflow_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('agentflow_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('agentflow_executions', JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    localStorage.setItem('agentflow_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('agentflow_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('agentflow_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('agentflow_settings', JSON.stringify(settings));
  }, [settings]);

  // Create Workflow
  const createWorkflow = (data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'totalExecutions'>): Workflow => {
    const newWorkflow: Workflow = {
      ...data,
      id: `wf-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalExecutions: 0,
    };
    setWorkflows(prev => [newWorkflow, ...prev]);
    return newWorkflow;
  };

  // Update Workflow
  const updateWorkflow = (id: string, data: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString() } : w));
  };

  // Delete Workflow
  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  // Run Workflow (Simulates a complete LangGraph agent step progression)
  const runWorkflow = (workflowId: string, customPrompt?: string): string => {
    const wf = workflows.find(w => w.id === workflowId);
    const executionId = `exec-${Math.floor(1000 + Math.random() * 9000)}`;
    const promptText = customPrompt || wf?.promptTemplate || 'Execute default task plan.';

    const initialSteps: ExecutionStep[] = [
      {
        id: `step-${Date.now()}-1`,
        agentRole: 'planner',
        agentName: 'Planner Agent',
        title: 'Task Decomposition & DAG Creation',
        status: 'running',
        startedAt: new Date().toISOString(),
        logs: [
          { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `Initializing LangGraph orchestrator with prompt: "${promptText.slice(0, 50)}..."` },
          { timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Deconstructing user intent into task graph...' }
        ]
      },
      {
        id: `step-${Date.now()}-2`,
        agentRole: 'researcher',
        agentName: 'Research Agent',
        title: 'Gather Intelligence & Web Data',
        status: 'pending',
        logs: []
      },
      {
        id: `step-${Date.now()}-3`,
        agentRole: 'analyst',
        agentName: 'Analysis Agent',
        title: 'Evaluate Metrics & Matrix Synthesis',
        status: 'pending',
        logs: []
      },
      {
        id: `step-${Date.now()}-4`,
        agentRole: 'validator',
        agentName: 'Validation Agent',
        title: 'Audit Claims & Check Constraints',
        status: 'pending',
        logs: []
      },
      {
        id: `step-${Date.now()}-5`,
        agentRole: 'reporter',
        agentName: 'Report Agent',
        title: 'Compile Final Structured Dossier',
        status: 'pending',
        logs: []
      }
    ];

    const newExec: WorkflowExecution = {
      id: executionId,
      workflowId,
      workflowTitle: wf?.title || 'Custom Autonomous Workflow',
      status: 'running',
      startedAt: new Date().toISOString(),
      prompt: promptText,
      currentStepIndex: 0,
      steps: initialSteps,
    };

    setExecutions(prev => [newExec, ...prev]);

    // Update workflow stats
    if (wf) {
      setWorkflows(prev => prev.map(w => w.id === workflowId ? {
        ...w,
        totalExecutions: w.totalExecutions + 1,
        lastExecutedAt: new Date().toISOString()
      } : w));
    }

    // Progression simulation across the 5 agents
    simulateExecutionProgression(executionId);

    return executionId;
  };

  const simulateExecutionProgression = (execId: string) => {
    const stepDelays = [2500, 3500, 3000, 2500, 3000];

    stepDelays.forEach((delay, index) => {
      setTimeout(() => {
        setExecutions(prev => {
          return prev.map(exec => {
            if (exec.id !== execId || exec.status === 'cancelled' || exec.status === 'failed') return exec;

            const updatedSteps = [...exec.steps];
            // Complete previous step
            if (index < updatedSteps.length) {
              const prevStep = updatedSteps[index];
              prevStep.status = 'completed';
              prevStep.completedAt = new Date().toISOString();
              prevStep.durationMs = delay;
              prevStep.outputSummary = `Successfully processed by ${prevStep.agentName}.`;
              prevStep.logs.push({
                timestamp: new Date().toLocaleTimeString(),
                level: 'success',
                message: `${prevStep.agentName} finished phase verification.`
              });
            }

            // Start next step
            if (index + 1 < updatedSteps.length) {
              const nextStep = updatedSteps[index + 1];
              nextStep.status = 'running';
              nextStep.startedAt = new Date().toISOString();
              nextStep.logs.push({
                timestamp: new Date().toLocaleTimeString(),
                level: 'info',
                message: `Activated ${nextStep.agentName} in pipeline.`
              });
              return {
                ...exec,
                currentStepIndex: index + 1,
                steps: updatedSteps
              };
            } else {
              // Final step completed
              return {
                ...exec,
                status: 'completed',
                completedAt: new Date().toISOString(),
                durationSeconds: Math.floor((stepDelays.reduce((a, b) => a + b, 0)) / 1000),
                currentStepIndex: updatedSteps.length - 1,
                steps: updatedSteps,
                finalReport: `# Autonomous Workflow Execution Summary\n\n**Task Reference:** \`${exec.id}\`\n**Status:** Successfully Executed & Verified\n\n### Output Insights\nAll five specialized agents (Planner, Researcher, Analyst, Validator, Reporter) have systematically evaluated the task: *"${exec.prompt}"*.\n\n- **Planner**: Established DAG graph with 0 cyclic dependencies.\n- **Researcher**: Extracted source signals and verified datasets.\n- **Analyst**: Computed comparative variance and trade-off metrics.\n- **Validator**: Confirmed zero hallucination risks.\n- **Reporter**: Persisted structured output log.`
              };
            }
          });
        });
      }, stepDelays.slice(0, index + 1).reduce((a, b) => a + b, 0));
    });
  };

  const getExecution = (id: string) => {
    return executions.find(e => e.id === id);
  };

  const cancelExecution = (id: string) => {
    setExecutions(prev => prev.map(e => {
      if (e.id === id && e.status === 'running') {
        return {
          ...e,
          status: 'cancelled',
          errorMessage: 'Execution halted by operator.',
        };
      }
      return e;
    }));
  };

  const retryExecution = (id: string) => {
    const existing = executions.find(e => e.id === id);
    if (!existing) return;
    runWorkflow(existing.workflowId, existing.prompt);
  };

  const updateAgentConfig = (id: string, updates: Partial<AgentInfo>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const nextStatus = int.status === 'connected' ? 'disconnected' : 'connected';
        return {
          ...int,
          status: nextStatus,
          connectedAccount: nextStatus === 'connected' ? 'user@agentflow.io' : undefined,
          lastSync: nextStatus === 'connected' ? 'Just now' : undefined,
        };
      }
      return int;
    }));
  };

  const resolveApproval = (id: string, status: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          resolvedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    // If associated with an execution waiting for approval, continue or fail it
    const req = approvals.find(a => a.id === id);
    if (req) {
      setExecutions(prev => prev.map(exec => {
        if (exec.id === req.executionId && exec.status === 'awaiting_approval') {
          if (status === 'approved') {
            return {
              ...exec,
              status: 'completed',
              completedAt: new Date().toISOString(),
              finalReport: `# Approved & Executed Action\n\nAction \`${req.actionTitle}\` was approved by human operator and executed successfully on ${req.integrationName}.`
            };
          } else {
            return {
              ...exec,
              status: 'cancelled',
              errorMessage: `Action rejected during human verification: ${req.actionTitle}`
            };
          }
        }
        return exec;
      }));
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      profile: { ...prev.profile, ...(updates.profile || {}) },
      aiPreferences: { ...prev.aiPreferences, ...(updates.aiPreferences || {}) },
      notifications: { ...prev.notifications, ...(updates.notifications || {}) },
    }));
  };

  return (
    <MockContext.Provider value={{
      workflows,
      executions,
      agents,
      integrations,
      approvals,
      settings,
      createWorkflow,
      updateWorkflow,
      deleteWorkflow,
      runWorkflow,
      getExecution,
      cancelExecution,
      retryExecution,
      updateAgentConfig,
      toggleIntegration,
      resolveApproval,
      updateSettings
    }}>
      {children}
    </MockContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockProvider');
  }
  return context;
};
