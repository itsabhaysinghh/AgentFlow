import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, 
  Search, BarChart3, ShieldCheck, FileText, Play,
  Cpu
} from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose }) => {
  const [taskPrompt, setTaskPrompt] = useState(
    "Research the top five cloud computing companies in India, compare their services, and prepare a report."
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const agentSteps = [
    {
      agent: "Planner Agent",
      role: "Workflow Decomposition",
      icon: <Cpu className="w-4 h-4 text-zinc-300" />,
      detail: "Formulates directed acyclic graph (DAG) of research and analytical subtasks."
    },
    {
      agent: "Research Agent",
      role: "Data Gathering & Extraction",
      icon: <Search className="w-4 h-4 text-zinc-300" />,
      detail: "Executes queries across verified sources, pricing matrices, and technical benchmarks."
    },
    {
      agent: "Analysis Agent",
      role: "Synthesis & Comparison",
      icon: <BarChart3 className="w-4 h-4 text-zinc-300" />,
      detail: "Evaluates market share, SLA tiers, data sovereignty compliance, and feature parity."
    },
    {
      agent: "Validation Agent",
      role: "Factual Audit & Verification",
      icon: <ShieldCheck className="w-4 h-4 text-zinc-300" />,
      detail: "Identifies unsupported claims, checks citation freshness, and flags discrepancies."
    },
    {
      agent: "Report Agent",
      role: "Document Generation",
      icon: <FileText className="w-4 h-4 text-zinc-300" />,
      detail: "Produces executive brief with formatted tables, key findings, and strategic guidance."
    }
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= agentSteps.length) {
          clearInterval(interval);
          setIsSimulating(false);
          return agentSteps.length;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Metallic Border Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent opacity-30" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700">
              <Sparkles className="w-4 h-4 text-zinc-200" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white tracking-tight">Interactive Workflow Pipeline</h3>
              <p className="text-xs text-zinc-500">Preview multi-agent orchestration architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Prompt Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Natural-Language Task Input
            </label>
            <div className="relative">
              <textarea
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
                placeholder="Describe your complex task..."
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Example task from architecture specification</span>
              <button
                onClick={() => setTaskPrompt("Research the top five cloud computing companies in India, compare their services, and prepare a report.")}
                className="text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Reset Example
              </button>
            </div>
          </div>

          {/* Orchestration Agents Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Specialized Agents Graph (LangGraph)
              </span>
              <span className="text-xs text-zinc-500">
                {activeStep === 0 ? "Ready to execute" : activeStep > agentSteps.length ? "Execution completed" : `Active: Step ${activeStep} of ${agentSteps.length}`}
              </span>
            </div>

            <div className="space-y-2">
              {agentSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCurrent = isSimulating && activeStep === stepNum;
                const isCompleted = activeStep > stepNum;

                return (
                  <div
                    key={step.agent}
                    className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                      isCurrent
                        ? "bg-zinc-900/90 border-zinc-500 shadow-metal-glow"
                        : isCompleted
                        ? "bg-zinc-950/80 border-zinc-800/80"
                        : "bg-zinc-950/40 border-zinc-900"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <div className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400">
                          {stepNum}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-zinc-200">
                          {step.agent}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {step.role}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-normal">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-900 bg-zinc-900/40">
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Phase 1 Prototype Preview</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium glass-btn-primary disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isSimulating ? "Executing Workflow..." : "Simulate Flow"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium glass-btn-secondary cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
