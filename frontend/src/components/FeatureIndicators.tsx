import React from 'react';
import { Network, ShieldCheck, Cpu } from 'lucide-react';

interface FeatureIndicator {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureIndicators: React.FC = () => {
  const indicators: FeatureIndicator[] = [
    {
      icon: <Network className="w-4 h-4 text-zinc-300" />,
      title: "Multi-agent orchestration",
      description: "Autonomous task planning with Planner, Researcher, Analyst, and Reporter agents via LangGraph."
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-zinc-300" />,
      title: "Human-in-the-loop approvals",
      description: "Granular verification gates before committing code, executing cloud actions, or sending communications."
    },
    {
      icon: <Cpu className="w-4 h-4 text-zinc-300" />,
      title: "Connected tools & integrations",
      description: "Native connectors for GitHub, Gmail, Telegram, and cloud APIs with least-privilege security."
    }
  ];

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-14 pt-4 border-t border-zinc-900/90">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {indicators.map((item, index) => (
          <div
            key={index}
            className="group relative p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900/80 hover:border-zinc-800 transition-all duration-300 hover:bg-zinc-900/30"
          >
            {/* Top metallic hairline reflection */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:border-zinc-700 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-sm font-medium text-zinc-200 tracking-tight">
                {item.title}
              </h3>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed pl-10">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

