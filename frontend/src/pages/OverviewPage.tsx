import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Workflow as WorkflowIcon, 
  PlayCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight,
  Bot,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const OverviewPage: React.FC = () => {
  const { workflows, executions, agents, approvals } = useMockData();
  const navigate = useNavigate();

  const totalWorkflows = workflows.length;
  const activeExecutions = executions.filter(e => e.status === 'running').length;
  const completedExecutions = executions.filter(e => e.status === 'completed').length;
  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;

  const statCards = [
    {
      title: 'Total Workflows',
      value: totalWorkflows,
      icon: WorkflowIcon,
      subtitle: 'Configured automated pipelines',
      link: '/app/workflows'
    },
    {
      title: 'Active Executions',
      value: activeExecutions,
      icon: PlayCircle,
      subtitle: 'Currently running agent graphs',
      highlight: activeExecutions > 0,
      link: '/app/executions'
    },
    {
      title: 'Completed Executions',
      value: completedExecutions,
      icon: CheckCircle2,
      subtitle: 'Successfully validated & persisted',
      link: '/app/executions'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: ShieldAlert,
      subtitle: 'Sensitive actions waiting for human check',
      alert: pendingApprovals > 0,
      link: '/app/approvals'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full metallic-badge text-zinc-300 text-[11px] font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Multi-Agent Swarm Orchestrator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-medium text-white tracking-tight">
              Turn complex objectives into{' '}
              <span className="font-serif italic font-normal text-zinc-100">autonomous workflows.</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              LangGraph coordinates your Planner, Researcher, Analyst, Validator, and Report agents with checkpointed state and human verification gates.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/app/workflows/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium glass-btn-primary cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Create Workflow</span>
            </button>
            <button
              onClick={() => navigate('/app/executions')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-btn-secondary cursor-pointer"
            >
              <span>Live Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.link)}
              className="group relative p-5 rounded-2xl bg-zinc-950/70 border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{card.title}</span>
                <div className={`p-2 rounded-lg border ${
                  card.alert 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : card.highlight
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-semibold text-white tracking-tight mb-1">
                {card.value}
              </div>
              <p className="text-[11px] text-zinc-500 truncate">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Executions + Agent Swarm Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Executions Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-zinc-400" />
              <span>Recent Workflow Executions</span>
            </h3>
            <button
              onClick={() => navigate('/app/executions')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 overflow-hidden">
            <div className="divide-y divide-zinc-900">
              {executions.slice(0, 5).map((exec) => {
                const isRunning = exec.status === 'running';
                const isWaiting = exec.status === 'awaiting_approval';
                const isFailed = exec.status === 'failed';
                const isSuccess = exec.status === 'completed';

                return (
                  <div
                    key={exec.id}
                    onClick={() => navigate(`/app/executions/${exec.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-zinc-500 uppercase">{exec.id}</span>
                        <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                          {exec.workflowTitle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate max-w-md">
                        {exec.prompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                        isRunning
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : isWaiting
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : isFailed
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                        {isWaiting && <AlertTriangle className="w-3 h-3 text-amber-300" />}
                        {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {exec.status.replace('_', ' ')}
                      </span>

                      <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{exec.durationSeconds ? `${exec.durationSeconds}s` : 'Live'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Agent Swarm Health (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Bot className="w-4 h-4 text-zinc-400" />
              <span>Specialized Agent Swarm</span>
            </h3>
            <button
              onClick={() => navigate('/app/agents')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => navigate('/app/agents')}
                className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-200">{agent.name}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {agent.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-1">
                  {agent.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">{agent.modelProvider}</span>
                  <span className="truncate">{agent.modelName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
