import React, { useState } from 'react';
import { 
  Key, 
  Bell, 
  CheckCircle2, 
  Save, 
  Cpu, 
  Lock
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useMockData();

  const [activeTab, setActiveTab] = useState<'ai' | 'profile' | 'notifications' | 'account'>('ai');
  const [provider, setProvider] = useState(settings.aiPreferences.provider);
  const [apiKey, setApiKey] = useState(settings.aiPreferences.groqApiKey);
  const [defaultModel, setDefaultModel] = useState(settings.aiPreferences.defaultModel);
  const [temp, setTemp] = useState(settings.aiPreferences.temperature);
  const [fullName, setFullName] = useState(settings.profile.fullName);
  const [email, setEmail] = useState(settings.profile.email);
  const [role, setRole] = useState(settings.profile.role);
  const [emailOnApproval, setEmailOnApproval] = useState(settings.notifications.emailOnApproval);
  const [emailOnFailure, setEmailOnFailure] = useState(settings.notifications.emailOnFailure);
  const [telegramAlerts, setTelegramAlerts] = useState(settings.notifications.telegramAlerts);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    updateSettings({
      profile: { fullName, email, role },
      aiPreferences: {
        provider,
        groqApiKey: apiKey,
        defaultModel,
        temperature: temp,
        maxTokens: 4096
      },
      notifications: {
        emailOnApproval,
        emailOnFailure,
        telegramAlerts
      }
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Platform Settings</h2>
          <p className="text-xs text-zinc-400">Configure LLM providers, agent defaults, notifications, and profile credentials</p>
        </div>

        {savedBanner && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preferences saved</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 gap-6 text-xs font-medium">
        {[
          { key: 'ai', label: 'AI Model Preferences', icon: Cpu },
          { key: 'profile', label: 'User Profile', icon: Lock },
          { key: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Model Preferences */}
      {activeTab === 'ai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Inference Engine Configuration</h3>
            <p className="text-xs text-zinc-400">
              AgentFlow interfaces directly with the Groq high-speed LPU runtime and Google Gemini API.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Default Model Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="Groq">Groq (Ultra-low latency LPU)</option>
                <option value="Gemini">Google Gemini (Vertex AI / Studio)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Model Selection</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fast)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Deep reasoning)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (Lightweight)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                Provider API Key
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Stored in encrypted backend vault</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-300">Default Temperature: {temp.toFixed(2)}</span>
              <span className="text-zinc-500 font-mono">Precision vs Creativity</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Operator Profile</h3>
            <p className="text-xs text-zinc-400">Account details for audit trails and execution authorship</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Architect Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Alert Subscriptions</h3>
            <p className="text-xs text-zinc-400">Configure when AgentFlow sends priority notifications</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Email on Human Approval Required', state: emailOnApproval, setter: setEmailOnApproval },
              { label: 'Email on Workflow Step Failure', state: emailOnFailure, setter: setEmailOnFailure },
              { label: 'Dispatch Instant Telegram Alerts', state: telegramAlerts, setter: setTelegramAlerts },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900">
                <span className="text-xs font-medium text-zinc-200">{n.label}</span>
                <button
                  type="button"
                  onClick={() => n.setter(!n.state)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    n.state ? 'bg-white' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full transition-transform ${
                      n.state ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium glass-btn-primary cursor-pointer shadow-glass"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
