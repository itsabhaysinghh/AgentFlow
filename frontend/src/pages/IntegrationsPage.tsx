import React, { useState } from 'react';
import { 
  GitBranch, 
  Mail, 
  Send, 
  Calendar, 
  HardDrive, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';
import type { Integration } from '@/types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegration } = useMockData();
  const [activeModal, setActiveModal] = useState<Integration | null>(null);

  const getIntegrationIcon = (key: Integration['key']) => {
    switch (key) {
      case 'github': return GitBranch;
      case 'gmail': return Mail;
      case 'telegram': return Send;
      case 'gcalendar': return Calendar;
      case 'gdrive': return HardDrive;
      case 'whatsapp': return MessageSquare;
      default: return ShieldCheck;
    }
  };

  const handleToggle = (integration: Integration) => {
    toggleIntegration(integration.id);
    setActiveModal(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Connected Integrations & Tools</h2>
        <p className="text-xs text-zinc-400">
          Authorize external capabilities with encrypted OAuth credentials and least-privilege scoping
        </p>
      </div>

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-zinc-300 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-zinc-200">Zero-Trust Action Enforcement</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All destructive external write operations (e.g. sending emails, modifying GitHub branches, booking calendar slots) trigger an automated Human Approval checkpoint before dispatch.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => {
          const Icon = getIntegrationIcon(int.key);
          const isConnected = int.status === 'connected';

          return (
            <div
              key={int.id}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:border-zinc-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}>
                    {isConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{int.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {int.description}
                </p>

                {isConnected && int.connectedAccount && (
                  <div className="mb-4 p-2 rounded-xl bg-zinc-900/60 border border-zinc-900 text-[11px] text-zinc-400 font-mono truncate">
                    Linked: <span className="text-zinc-200">{int.connectedAccount}</span>
                  </div>
                )}

                {/* Scopes pill */}
                <div className="space-y-1 mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                    Granted Permissions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {int.permissions.slice(0, 2).map((p) => (
                      <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {p}
                      </span>
                    ))}
                    {int.permissions.length > 2 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-zinc-600">
                        +{int.permissions.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveModal(int)}
                className={`w-full py-2 px-4 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  isConnected
                    ? 'glass-btn-secondary text-zinc-300 hover:text-white'
                    : 'glass-btn-primary'
                }`}
              >
                {isConnected ? 'Manage Connection' : 'Connect Integration'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Integration Configuration Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {React.createElement(getIntegrationIcon(activeModal.key), { className: 'w-4 h-4' })}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{activeModal.name} Integration</h3>
                  <p className="text-xs text-zinc-500">OAuth & Tool Calling Provider</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Security Architecture</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  In production, this connector utilizes OAuth 2.0 PKCE flow with encrypted tokens in PostgreSQL and AWS Secrets Manager.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-zinc-300">Required OAuth Scopes:</span>
                <div className="space-y-1">
                  {activeModal.permissions.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>State toggle reflects immediately in workflow agent capabilities.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium rounded-full glass-btn-secondary cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleToggle(activeModal)}
                className={`px-5 py-2 rounded-full text-xs font-medium cursor-pointer ${
                  activeModal.status === 'connected'
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30'
                    : 'glass-btn-primary'
                }`}
              >
                {activeModal.status === 'connected' ? 'Disconnect Tool' : 'Authorize & Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
