import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex.vance@agentflow.io');
  const [password, setPassword] = useState('••••••••••••');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <NavLink to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-white rotate-45" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white">AgentFlow</span>
          </NavLink>
          <h2 className="text-xl font-semibold text-white tracking-tight">Sign in to your workspace</h2>
          <p className="text-xs text-zinc-400">Access multi-agent orchestrations and telemetry</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-300">Password</span>
              <a href="#" className="text-zinc-500 hover:text-zinc-300 text-[11px]">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-full text-xs font-medium glass-btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-glass mt-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don&apos;t have an account?{' '}
          <NavLink to="/register" className="text-white hover:underline">
            Register workspace
          </NavLink>
        </p>
      </div>
    </div>
  );
};
