import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white flex items-center justify-center">
      <section className="w-full max-w-[480px]">
        <Link to="/" className="mb-8 inline-flex items-center gap-2.5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 rounded-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900" aria-hidden="true">
            <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-white" />
          </span>
          <span className="text-base font-semibold tracking-tight">AgentFlow</span>
        </Link>
        <div className="rounded-[17px] border border-[#303030] bg-[#171717] p-6 sm:p-[30px] shadow-2xl">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-base text-zinc-400">{description}</p>
          {children}
        </div>
        <p className="mt-6 text-center text-base text-zinc-400">{footer}</p>
      </section>
    </main>
  );
}
