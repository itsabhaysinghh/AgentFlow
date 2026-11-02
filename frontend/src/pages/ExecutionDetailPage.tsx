import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  StopCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  FileText,
  Search,
  BarChart3,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';
import type { AgentRole } from '@/types';

export const ExecutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getExecution, cancelExecution, retryExecution, resolveApproval, approvals } = useMockData();
  const navigate = useNavigate();

  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'success'>('all');
  const [copiedReport, setCopiedReport] = useState(false);

  const execution = getExecution(id || '');

  if (!execution) {
    return (
      <div className="p-12 text-center rounded-2xl border border-zinc-900 bg-zinc-950/60">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Execution not found</h3>
        <p className="text-xs text-zinc-500 mb-4">No record matches telemetry reference {id}.</p>
        <button
          onClick={() => navigate('/app/executions')}
          className="px-4 py-2 text-xs font-medium rounded-full glass-btn-primary"
        >
          Back to Executions
        </button>
      </div>
    );
  }

  const isRunning = execution.status === 'running';
  const isAwaitingApproval = execution.status === 'awaiting_approval';
  const isSuccess = execution.status === 'completed';
  const isFailed = execution.status === 'failed';

  const selectedStep = execution.steps[selectedStepIndex] || execution.steps[0];

  const pendingApproval = approvals.find(a => a.executionId === execution.id && a.status === 'pending');

  const handleCopyReport = () => {
    if (execution.finalReport) {
      navigator.clipboard.writeText(execution.finalReport);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    }
  };

  const getAgentIcon = (role: AgentRole) => {
    switch (role) {
      case 'planner': return Cpu;
      case 'researcher': return Search;
      case 'analyst': return BarChart3;
      case 'validator': return ShieldCheck;
      case 'reporter': return FileText;
      default: return Cpu;
    }
  };

  const allLogs = execution.steps.flatMap(s => 
    s.logs.map(l => ({ ...l, agentName: s.agentName }))
  );

  const filteredLogs = allLogs.filter(l => logFilter === 'all' || l.level === logFilter);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/executions')}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-zinc-400 uppercase font-semibold">
                {execution.id}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">{execution.workflowTitle}</span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Execution Monitoring & Graph Trace
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isRunning && (
            <button
              onClick={() => cancelExecution(execution.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Halt Execution</span>
            </button>
          )}

          {!isRunning && (
            <button
              onClick={() => retryExecution(execution.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-btn-secondary cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Workflow</span>
            </button>
          )}

          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isRunning
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : isAwaitingApproval
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : isSuccess
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : isFailed
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {isRunning && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
            {isAwaitingApproval && <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="capitalize">{execution.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Human Approval Required Warning Banner */}
      {isAwaitingApproval && pendingApproval && (
        <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/40 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Human-in-the-Loop Approval Intercepted
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed max-w-2xl">
                  {pendingApproval.actionDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => resolveApproval(pendingApproval.id, 'rejected')}
                className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                Reject Action
              </button>
              <button
                onClick={() => resolveApproval(pendingApproval.id, 'approved')}
                className="px-4 py-2 rounded-full text-xs font-medium bg-amber-400 hover:bg-amber-300 text-black font-semibold cursor-pointer shadow-lg"
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Natural Language Prompt & Context */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Target Natural-Language Objective
          </span>
          <p className="text-xs text-zinc-200 font-mono">
            &ldquo;{execution.prompt}&rdquo;
          </p>
        </div>
        <div className="text-right text-[11px] text-zinc-500 flex-shrink-0 font-mono">
          <div>Started: {new Date(execution.startedAt).toLocaleTimeString()}</div>
          {execution.durationSeconds && <div>Duration: {execution.durationSeconds}s</div>}
        </div>
      </div>

      {/* Visual Agent Progression Graph (5 Nodes) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            LangGraph Orchestration Topology
          </span>
          <span className="text-[11px] text-zinc-500">Click a node to inspect agent step outputs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {execution.steps.map((step, idx) => {
            const Icon = getAgentIcon(step.agentRole);
            const isStepRunning = step.status === 'running';
            const isStepCompleted = step.status === 'completed';
            const isStepFailed = step.status === 'failed';
            const isStepWaiting = step.status === 'awaiting_approval';
            const isSelected = selectedStepIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStepIndex(idx)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-500 shadow-glass'
                    : 'bg-zinc-950/70 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                {/* Node Status Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-1.5 rounded-lg border ${
                    isStepRunning
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : isStepCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isStepFailed
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : isStepWaiting
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">0{idx + 1}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 mb-0.5 truncate">
                    {step.agentName}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {step.title}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                  <span className={`capitalize font-medium ${
                    isStepRunning ? 'text-blue-400 animate-pulse' :
                    isStepCompleted ? 'text-emerald-400' :
                    isStepFailed ? 'text-rose-400' :
                    isStepWaiting ? 'text-amber-300' : 'text-zinc-600'
                  }`}>
                    {step.status.replace('_', ' ')}
                  </span>
                  {step.durationMs && (
                    <span className="text-zinc-500 font-mono">
                      {(step.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Details: Step Output Summary & Logs Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Step Outputs */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zinc-400" />
              <span>{selectedStep.agentName} Output</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              {selectedStep.status}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80 font-mono">
            {selectedStep.outputSummary || 'Awaiting agent dispatch...'}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase font-mono text-zinc-500">Step Telemetry</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-900">
                <span className="text-[11px] text-zinc-500 block">Agent Role</span>
                <span className="font-mono text-zinc-200 capitalize">{selectedStep.agentRole}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-900">
                <span className="text-[11px] text-zinc-500 block">Elapsed Time</span>
                <span className="font-mono text-zinc-200">
                  {selectedStep.durationMs ? `${(selectedStep.durationMs / 1000).toFixed(2)}s` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Execution Logs Console */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>Unified Execution Log</span>
            </h3>

            <div className="flex items-center gap-1 text-[10px]">
              {(['all', 'info', 'warn', 'error', 'success'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    logFilter === lvl ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 rounded-2xl bg-black border border-zinc-900 font-mono text-xs space-y-2 text-zinc-300">
            {filteredLogs.length === 0 ? (
              <span className="text-zinc-600">No log entries recorded for this filter.</span>
            ) : (
              filteredLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-600 flex-shrink-0 text-[11px]">{log.timestamp}</span>
                  <span className={`px-1 rounded text-[10px] font-semibold uppercase flex-shrink-0 ${
                    log.level === 'info' ? 'bg-zinc-800 text-zinc-300' :
                    log.level === 'success' ? 'bg-emerald-950 text-emerald-400' :
                    log.level === 'warn' ? 'bg-amber-950 text-amber-300' :
                    'bg-rose-950 text-rose-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-zinc-400 text-[11px]">[{log.agentName}]</span>
                  <span className="text-zinc-200 text-xs">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Final Markdown Report Viewer (When completed) */}
      {execution.finalReport && (
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Final Output Dossier</h3>
                <p className="text-xs text-zinc-500">Autonomous synthesis compiled by Report Agent</p>
              </div>
            </div>

            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium glass-btn-secondary cursor-pointer"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap bg-zinc-900/30 p-6 rounded-2xl border border-zinc-900">
            {execution.finalReport}
          </div>
        </div>
      )}
    </div>
  );
};
