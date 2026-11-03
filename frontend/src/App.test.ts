import { describe, it, expect } from 'vitest';
import { initialWorkflows, initialAgents, initialExecutions } from './mock/mockData';

describe('AgentFlow Core Data Models', () => {
  it('initializes the five specialized agents', () => {
    expect(initialAgents).toHaveLength(5);
    const roles = initialAgents.map(a => a.role);
    expect(roles).toEqual(['planner', 'researcher', 'analyst', 'validator', 'reporter']);
  });

  it('validates default workflows structure', () => {
    expect(initialWorkflows.length).toBeGreaterThan(0);
    const sample = initialWorkflows[0];
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('title');
    expect(sample).toHaveProperty('promptTemplate');
    expect(sample.defaultAgents).toContain('planner');
  });

  it('validates completed execution telemetry and report presence', () => {
    const completedExec = initialExecutions.find(e => e.status === 'completed');
    expect(completedExec).toBeDefined();
    expect(completedExec?.steps).toHaveLength(5);
    expect(completedExec?.finalReport).toContain('Executive Report');
  });
});

