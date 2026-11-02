import React, { useState } from 'react';
import { 
  Bot, 
  Settings2, 
  Cpu, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  X, 
  Save, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';
import type { AgentInfo, AgentRole } from '@/types';

export const AgentsPage: React.FC = () => {
  const { agents, updateAgentConfig } = useMockData();
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editTemp, setEditTemp] = useState(0.2);
  const [savedNotification, setSavedNotification] = useState(false);

  const getAgentIcon = (role: AgentRole) => {
    switch (role) {
      case 'planner': return Cpu;
      case 'researcher': return Search;
      case 'analyst': return BarChart3;
      case 'validator': return ShieldCheck;
      case 'reporter': return FileText;
      default: return Bot;
    }
  };

  const handleOpenConfig = (agent: AgentInfo) => {
    setSelectedAgent(agent);
    setEditPrompt(agent.systemPrompt);
    setEditTemp(agent.temperature);
  };

  const handleSaveConfig = () => {
    if (selectedAgent) {
      updateAgentConfig(selectedAgent.id, {
        systemPrompt: editPrompt,
        temperature: editTemp
      });
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
      setSelectedAgent(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Specialized Agent Swarm</h2>
          <p className="text-xs text-zinc-400">
            Fine-tune prompts, temperature settings, and model providers for each LangGraph node
          </p>
        </div>

        {savedNotification && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Agent parameters updated</span>
          </div>
        )}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.role);
          return (
            <div
              key={agent.id}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:border-zinc-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{agent.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Model and parameters chip */}
                <div className="flex items-center gap-2 mb-4 text-[11px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {agent.modelProvider}
                  </span>
                  <span className="truncate">{agent.modelName}</span>
                </div>

                {/* Responsibilities list */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                    Node Responsibilities
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-400">
                    {agent.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-zinc-600 mt-1">•</span>
                        <span className="line-clamp-1">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Configure button */}
              <button
                onClick={() => handleOpenConfig(agent)}
                className="w-full py-2 px-4 rounded-full text-xs font-medium glass-btn-secondary flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Configure Agent</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Configure Agent Drawer/Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-zinc-500">Node Configuration & Prompt Engineering</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">System Instruction Prompt</label>
                <textarea
                  rows={5}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-600 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Inference Temperature</span>
                  <span className="font-mono text-zinc-400">{editTemp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={editTemp}
                  onChange={(e) => setEditTemp(parseFloat(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                  <span>0.0 (Deterministic)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 text-xs font-medium rounded-full glass-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium glass-btn-primary cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Parameters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
