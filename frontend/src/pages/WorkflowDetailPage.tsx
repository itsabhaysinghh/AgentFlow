import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const WorkflowDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workflows, executions, runWorkflow } = useMockData();
  const navigate = useNavigate();

  const workflow = workflows.find((w) => w.id === id);

  if (!workflow) {
    return (
      <div className="p-12 text-center rounded-2xl border border-zinc-900 bg-zinc-950/60">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Workflow not found</h3>
        <p className="text-xs text-zinc-500 mb-4">The requested workflow ID does not exist in the active store.</p>
        <button
          onClick={() => navigate('/app/workflows')}
          className="px-4 py-2 text-xs font-medium rounded-full glass-btn-primary"
        >
          Back to Workflows
        </button>
      </div>
    );
  }

  const relatedExecutions = executions.filter((e) => e.workflowId === workflow.id);

  const handleExecute = () => {
    const newExecId = runWorkflow(workflow.id);
    navigate(`/app/executions/${newExecId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/workflows')}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400">
                {workflow.category}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${workflow.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              <span className="text-xs text-zinc-500 capitalize">{workflow.status}</span>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">{workflow.title}</h2>
          </div>
        </div>

        <button
          onClick={handleExecute}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium glass-btn-primary self-start sm:self-auto cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-black text-black" />
          <span>Execute Workflow</span>
        </button>
      </div>

      {/* Grid: Details + Execution History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Metadata & Prompt */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Task Prompt Specification
            </h3>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-sm text-zinc-200 font-mono leading-relaxed">
              &ldquo;{workflow.promptTemplate}&rdquo;
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {workflow.description}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Execution History ({relatedExecutions.length})
              </h3>
            </div>

            {relatedExecutions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No executions recorded for this workflow yet.</p>
            ) : (
              <div className="divide-y divide-zinc-900">
                {relatedExecutions.map((exec) => {
                  const isRunning = exec.status === 'running';
                  const isWaiting = exec.status === 'awaiting_approval';
                  const isSuccess = exec.status === 'completed';

                  return (
                    <div
                      key={exec.id}
                      onClick={() => navigate(`/app/executions/${exec.id}`)}
                      className="py-3 flex items-center justify-between hover:bg-zinc-900/30 transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-zinc-400 group-hover:text-white">
                            {exec.id}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(exec.startedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate max-w-sm mt-0.5">
                          {exec.prompt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                          isRunning
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : isWaiting
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : isSuccess
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                          {isWaiting && <AlertTriangle className="w-3 h-3 text-amber-300" />}
                          {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {exec.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Configuration Attributes */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Workflow Settings
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Human Approval</span>
                <span className="text-zinc-200 font-medium">
                  {workflow.requiresApproval ? 'Required (Gated)' : 'Autonomous'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Total Runs</span>
                <span className="text-zinc-200 font-medium">{workflow.totalExecutions}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Created</span>
                <span className="text-zinc-200 font-mono text-[11px]">
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500">Assigned Agents</span>
                <span className="text-zinc-200 font-medium">5 Specialized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
