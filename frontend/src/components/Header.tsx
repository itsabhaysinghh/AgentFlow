import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onStartBuilding: () => void;
  onExploreWorkflows: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartBuilding, onExploreWorkflows }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 lg:px-16 transition-all duration-300">
      {/* Brand Logo & Wordmark */}
      <a href="#" className="flex items-center gap-2.5 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 shadow-glass group-hover:border-zinc-500 transition-colors">
          <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-zinc-300 to-white rotate-45 group-hover:rotate-90 transition-transform duration-500" />
          <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-base font-medium tracking-tight text-white flex items-center gap-1">
          AgentFlow
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block animate-pulse" />
        </span>
      </a>

      {/* Desktop Floating Navigation Pill - Liquid Metal Style */}
      <nav className="hidden md:flex items-center px-4 py-1.5 rounded-full liquid-metal-pill">
        <div className="flex items-center gap-1 text-xs font-medium tracking-wide text-zinc-400">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.href === '#how-it-works' || item.href === '#features') {
                  e.preventDefault();
                  onExploreWorkflows();
                }
              }}
              className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* CTA Button */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={onStartBuilding}
          className="group relative inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wide rounded-full glass-btn-primary cursor-pointer"
        >
          <span>Start Building</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-5 rounded-2xl liquid-metal-pill flex flex-col gap-4 border border-zinc-800 bg-black/90 backdrop-blur-2xl md:hidden animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (item.href === '#how-it-works' || item.href === '#features') {
                    e.preventDefault();
                    onExploreWorkflows();
                  }
                }}
                className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartBuilding();
              }}
              className="w-full py-2.5 px-4 text-xs font-medium rounded-full glass-btn-primary flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Building</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

