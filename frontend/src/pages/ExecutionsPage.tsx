import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';
import type { ExecutionStatus } from '@/types';

export const ExecutionsPage: React.FC = () => {
  const { executions } = useMockData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | 'all'>('all');

  const filteredExecutions = executions.filter((e) => {
    const matchesSearch = e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.workflowTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Execution Telemetry</h2>
          <p className="text-xs text-zinc-400">Live monitoring of autonomous multi-agent graph runs</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by execution ID, workflow title, or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
          {(['all', 'running', 'awaiting_approval', 'completed', 'failed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === filter
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Executions Table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 overflow-hidden">
        {filteredExecutions.length === 0 ? (
          <div className="p-12 text-center">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-zinc-300 mb-1">No executions match criteria</h3>
            <p className="text-xs text-zinc-500">All workflow runs and telemetry logs will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filteredExecutions.map((exec) => {
              const isRunning = exec.status === 'running';
              const isWaiting = exec.status === 'awaiting_approval';
              const isSuccess = exec.status === 'completed';
              const isFailed = exec.status === 'failed';

              const activeStep = exec.steps[exec.currentStepIndex];

              return (
                <div
                  key={exec.id}
                  onClick={() => navigate(`/app/executions/${exec.id}`)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-zinc-400 group-hover:text-white uppercase font-medium">
                        {exec.id}
                      </span>
                      <span className="text-xs text-zinc-500">•</span>
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {exec.workflowTitle}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 mb-2">
                      {exec.prompt}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {exec.durationSeconds ? `${exec.durationSeconds}s duration` : 'In progress...'}
                      </span>
                      {activeStep && (
                        <span className="text-zinc-400">
                          Active Agent: <strong className="text-zinc-300 font-normal">{activeStep.agentName}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      isRunning
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : isWaiting
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : isSuccess
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isFailed
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                      {isWaiting && <AlertTriangle className="w-3 h-3 text-amber-300" />}
                      {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isFailed && <XCircle className="w-3 h-3 text-rose-400" />}
                      {exec.status.replace('_', ' ')}
                    </span>

                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
