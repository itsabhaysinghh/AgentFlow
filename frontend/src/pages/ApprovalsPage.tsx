import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const ApprovalsPage: React.FC = () => {
  const { approvals, resolveApproval } = useMockData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const historyApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Human-in-the-Loop Verification</h2>
          <p className="text-xs text-zinc-400">
            Review and authorize sensitive operations before autonomous agents execute external actions
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Pending Review ({pendingApprovals.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            History ({historyApprovals.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'pending' ? (
        pendingApprovals.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-zinc-900 bg-zinc-950/60 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-medium text-zinc-200">Zero Pending Approval Requests</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              All autonomous workflows are currently running with verified bounds or have completed their tasks.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <span className="font-mono text-xs text-zinc-400 uppercase font-semibold">
                      {item.id}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-300 font-medium">{item.workflowTitle}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{item.actionTitle}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    {item.actionDescription}
                  </p>
                </div>

                {/* Payload Preview Table */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-2 text-xs font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                    Execution Payload Preview ({item.integrationName})
                  </span>
                  {Object.entries(item.payloadPreview).map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] py-1 border-b border-zinc-900/60">
                      <span className="text-zinc-500">{k}:</span>
                      <span className="text-zinc-200">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => navigate(`/app/executions/${item.executionId}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Inspect Full Graph Trace</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => resolveApproval(item.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => resolveApproval(item.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer font-semibold shadow-glass"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Action</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden divide-y divide-zinc-900">
          {historyApprovals.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-zinc-500 uppercase">{item.id}</span>
                  <span className="text-xs font-medium text-zinc-200">{item.actionTitle}</span>
                  <span className="text-xs text-zinc-500">• {item.integrationName}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate max-w-xl">
                  {item.actionDescription}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  item.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {item.status === 'approved' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span className="capitalize">{item.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
