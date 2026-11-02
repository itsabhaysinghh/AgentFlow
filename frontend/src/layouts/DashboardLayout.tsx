import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Workflow, 
  PlayCircle, 
  Bot, 
  Layers, 
  ShieldAlert, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles,
  ArrowUpRight,
  LogOut,
  Bell
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { approvals, settings } = useMockData();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const navLinks = [
    { name: 'Overview', path: '/app', icon: LayoutDashboard },
    { name: 'Workflows', path: '/app/workflows', icon: Workflow },
    { name: 'Executions', path: '/app/executions', icon: PlayCircle },
    { name: 'Agents', path: '/app/agents', icon: Bot },
    { name: 'Integrations', path: '/app/integrations', icon: Layers },
    { 
      name: 'Approvals', 
      path: '/app/approvals', 
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/app') return 'Platform Overview';
    if (p.startsWith('/app/workflows/new')) return 'Create Autonomous Workflow';
    if (p.startsWith('/app/workflows/')) return 'Workflow Details';
    if (p.startsWith('/app/workflows')) return 'Workflow Management';
    if (p.startsWith('/app/executions/')) return 'Execution Telemetry';
    if (p.startsWith('/app/executions')) return 'Execution Monitoring';
    if (p.startsWith('/app/agents')) return 'Autonomous Agent Swarm';
    if (p.startsWith('/app/integrations')) return 'Tool & Service Integrations';
    if (p.startsWith('/app/approvals')) return 'Human-in-the-Loop Verification';
    if (p.startsWith('/app/settings')) return 'System Settings';
    return 'AgentFlow Workspace';
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden selection:bg-neutral-800">
      {/* Desktop Collapsible Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 relative z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Brand Bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-900/80">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 shadow-glass flex items-center justify-center group-hover:border-zinc-500 transition-colors">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-zinc-300 to-white rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap">
                AgentFlow
                <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">v1.0</span>
              </span>
            )}
          </NavLink>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white border border-zinc-700/80 shadow-glass'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 animate-ping" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Create CTA in sidebar */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-xs font-medium text-zinc-200">Autonomous Orchestration</span>
            </div>
            <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
              LangGraph-powered 5-agent swarm ready for workflow execution.
            </p>
            <button
              onClick={() => navigate('/app/workflows/new')}
              className="w-full py-2 px-3 text-xs font-medium rounded-xl glass-btn-primary flex items-center justify-center gap-2"
            >
              <span>New Workflow</span>
              <ArrowUpRight className="w-3 h-3 text-black" />
            </button>
          </div>
        )}

        {/* User Profile Bar */}
        <div className="p-3 border-t border-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {settings.profile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-200 truncate">{settings.profile.fullName}</p>
                <p className="text-[11px] text-zinc-500 truncate">{settings.profile.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <NavLink to="/" title="Exit to Landing Page" className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg">
              <LogOut className="w-3.5 h-3.5" />
            </NavLink>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-white rotate-45" />
                  </div>
                  <span className="text-sm font-semibold">AgentFlow</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                        isActive ? 'bg-zinc-900 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/app/workflows/new');
                }}
                className="w-full py-2.5 px-3 text-xs font-medium rounded-xl glass-btn-primary mb-2 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Create Workflow</span>
              </button>
              <NavLink to="/" className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-2 py-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Back to Landing Page</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-900/80 bg-black/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight">{getPageTitle()}</h1>
              <p className="text-[11px] text-zinc-500 hidden sm:block">Multi-Agent AI Automation Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Environment Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Orchestrator Online</span>
            </div>

            {/* Notification Bell */}
            <NavLink 
              to="/app/approvals" 
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Approvals & Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </NavLink>

            {/* New Workflow Top Action */}
            <button
              onClick={() => navigate('/app/workflows/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-btn-primary"
            >
              <Sparkles className="w-3 h-3 text-black" />
              <span className="hidden sm:inline">New Workflow</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
