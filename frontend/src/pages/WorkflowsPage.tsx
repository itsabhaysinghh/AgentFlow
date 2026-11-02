import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Play, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';
import type { Workflow } from '@/types';

export const WorkflowsPage: React.FC = () => {
  const { workflows, deleteWorkflow, runWorkflow } = useMockData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch = wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wf.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExecute = (e: React.MouseEvent, workflowId: string) => {
    e.stopPropagation();
    const newExecId = runWorkflow(workflowId);
    navigate(`/app/executions/${newExecId}`);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteWorkflow(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Workflows</h2>
          <p className="text-xs text-zinc-400">Autonomous multi-agent execution pipelines and prompt templates</p>
        </div>

        <button
          onClick={() => navigate('/app/workflows/new')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium glass-btn-primary self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-black" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workflows by title, category, or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
          {(['all', 'active', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === filter
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-zinc-900 bg-zinc-950/60">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-zinc-300 mb-1">No workflows found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or create a new autonomous workflow from a natural-language prompt.
          </p>
          <button
            onClick={() => navigate('/app/workflows/new')}
            className="px-4 py-2 text-xs font-medium rounded-full glass-btn-primary"
          >
            Create New Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => navigate(`/app/workflows/${wf.id}`)}
              className="group relative p-5 rounded-2xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {wf.category}
                    </span>
                    {wf.requiresApproval && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Human Gate
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${wf.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                    <span className="text-[11px] text-zinc-500 capitalize">{wf.status}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors mb-1.5">
                  {wf.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                  {wf.description}
                </p>

                {/* Prompt preview pill */}
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-900 mb-4 text-[11px] text-zinc-400 font-mono line-clamp-2">
                  &ldquo;{wf.promptTemplate}&rdquo;
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {wf.totalExecutions} runs
                  </span>
                  <span>5 Agents</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(wf);
                    }}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete workflow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleExecute(e, wf.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-btn-primary"
                  >
                    <Play className="w-3 h-3 fill-black text-black" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-semibold text-white">Delete Workflow</h3>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">&ldquo;{deleteTarget.title}&rdquo;</strong>? This action cannot be undone. Associated execution logs will remain archived.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium rounded-full glass-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-medium rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
