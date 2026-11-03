import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Save, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  FileText, 
  Cpu
} from 'lucide-react';
import { useMockData } from '@/mock/MockContext';

export const WorkflowCreatePage: React.FC = () => {
  const { createWorkflow, runWorkflow } = useMockData();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('Market Intelligence');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const examplePrompts = [
    {
      label: 'Cloud Infrastructure Comparison',
      text: 'Research the top five cloud computing companies in India, compare AWS, Azure, and GCP pricing and MeitY compliance, and prepare a PDF report.',
      title: 'Top Cloud Computing Providers in India Analysis',
      category: 'Market Intelligence'
    },
    {
      label: 'GitHub PR Vulnerability Audit',
      text: 'Inspect recent PRs in the repository, evaluate code changes for secret leakage and dependency vulnerabilities, and format an audit summary.',
      title: 'Automated GitHub PR Security Audit',
      category: 'DevSecOps'
    },
    {
      label: 'AI Startups Weekly Digest',
      text: 'Gather this week’s product launches and architectural updates from leading AI infrastructure startups and draft a concise executive summary.',
      title: 'AI Startup Weekly Architecture Intelligence',
      category: 'Market Intelligence'
    }
  ];

  const handleApplyExample = (ex: typeof examplePrompts[0]) => {
    setTitle(ex.title);
    setPrompt(ex.text);
    setDescription(ex.text);
    setCategory(ex.category);
    setPlanGenerated(false);
  };

  const handleGeneratePlan = () => {
    if (!prompt.trim()) return;
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setPlanGenerated(true);
      if (!title) {
        setTitle(prompt.slice(0, 40) + '...');
      }
      if (!description) {
        setDescription(prompt);
      }
    }, 900);
  };

  const handleSaveOnly = () => {
    if (!prompt.trim()) return;
    const wf = createWorkflow({
      title: title || 'Autonomous Workflow',
      description: description || prompt,
      promptTemplate: prompt,
      category,
      status: 'active',
      defaultAgents: ['planner', 'researcher', 'analyst', 'validator', 'reporter'],
      requiresApproval
    });
    navigate(`/app/workflows/${wf.id}`);
  };

  const handleSaveAndExecute = () => {
    if (!prompt.trim()) return;
    const wf = createWorkflow({
      title: title || 'Autonomous Workflow',
      description: description || prompt,
      promptTemplate: prompt,
      category,
      status: 'active',
      defaultAgents: ['planner', 'researcher', 'analyst', 'validator', 'reporter'],
      requiresApproval
    });
    const execId = runWorkflow(wf.id, prompt);
    navigate(`/app/executions/${execId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/app/workflows')}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Create Autonomous Workflow</h2>
          <p className="text-xs text-zinc-400">Describe your task in natural language — the Planner Agent generates the DAG plan</p>
        </div>
      </div>

      {/* Example Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Example Task Inspirations
        </span>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleApplyExample(ex)}
              className="px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              + {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6">
        {/* Natural Language Task Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
            <span>Natural-Language Task Prompt <span className="text-rose-400">*</span></span>
            <span className="text-[11px] text-zinc-500 font-mono">LangGraph Instruction</span>
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setPlanGenerated(false);
            }}
            placeholder="e.g. Research the top five cloud computing companies in India, compare AWS, Azure, and GCP, analyse their services and generate a comparison report."
            className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
          />
        </div>

        {/* Generate Plan Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-zinc-500">
            {planGenerated ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Execution DAG Plan Synthesized
              </span>
            ) : (
              <span>Generate preview plan to review agent allocations before running</span>
            )}
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={!prompt.trim() || isGeneratingPlan}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium glass-btn-secondary disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>{isGeneratingPlan ? 'Generating DAG Plan...' : 'Generate Execution Plan'}</span>
          </button>
        </div>

        {/* Generated Plan Preview */}
        {planGenerated && (
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Synthesized Multi-Agent DAG Plan
              </span>
              <span className="text-[11px] font-mono text-zinc-500">5 Interlocked Nodes</span>
            </div>

            <div className="space-y-2.5">
              {[
                { role: 'Planner Agent', action: 'Deconstruct prompt into dependencies & tool constraints', icon: Cpu },
                { role: 'Research Agent', action: 'Retrieve live technical specs, pricing matrices, and zone data', icon: Search },
                { role: 'Analysis Agent', action: 'Cross-tabulate metrics, calculate confidence scores and cost matrices', icon: BarChart3 },
                { role: 'Validation Agent', action: 'Audit claims, verify citations, and halt at human approval gates', icon: ShieldCheck },
                { role: 'Report Agent', action: 'Compile structured markdown brief with executive summary & recommendations', icon: FileText },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.role} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400">
                      {idx + 1}
                    </div>
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <div className="flex-1">
                      <span className="font-medium text-zinc-200">{step.role}: </span>
                      <span className="text-zinc-400">{step.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Workflow Configuration Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Workflow Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud Provider Competitive Intelligence"
              className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              <option value="Market Intelligence">Market Intelligence</option>
              <option value="DevSecOps">DevSecOps</option>
              <option value="Operations">Operations</option>
              <option value="Executive Briefing">Executive Briefing</option>
            </select>
          </div>
        </div>

        {/* Human-in-the-Loop Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900">
          <div className="space-y-0.5">
            <div className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>Human-in-the-Loop Safeguard</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Pause execution for manual operator approval before sensitive operations (API writes, commits, emails).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRequiresApproval(!requiresApproval)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              requiresApproval ? 'bg-white' : 'bg-zinc-800'
            }`}
          >
            <div
              className={`bg-black w-4 h-4 rounded-full transition-transform ${
                requiresApproval ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
          <button
            onClick={() => navigate('/app/workflows')}
            className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveOnly}
            disabled={!prompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium glass-btn-secondary disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workflow</span>
          </button>
          <button
            onClick={handleSaveAndExecute}
            disabled={!prompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium glass-btn-primary disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black text-black" />
            <span>Save & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};

