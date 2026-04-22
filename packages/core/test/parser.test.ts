import { describe, it, expect, beforeAll } from 'vitest';
import { parseSkillsDir } from '../src/parser';
import { findForPhase, findForTask, getSequence, recommendNext } from '../src/graph';

describe('core package', () => {
  // 使用本地 agent-skills 作为测试数据
  const SKILLS_PATH = '/root/.openclaw/workspace/agent-skills/skills';

  it('should parse skills directory', async () => {
    const graph = await parseSkillsDir(SKILLS_PATH);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
  });

  it('should find skills by phase', async () => {
    const graph = await parseSkillsDir(SKILLS_PATH);
    const defineSkills = findForPhase(graph, 'define');
    expect(defineSkills.length).toBeGreaterThan(0);
  });

  it('should find skills by task', async () => {
    const graph = await parseSkillsDir(SKILLS_PATH);
    const results = findForTask(graph, 'spec');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should get sequence for a phase', async () => {
    const graph = await parseSkillsDir(SKILLS_PATH);
    const sequence = getSequence(graph, 'build');
    expect(sequence.length).toBeGreaterThan(0);
    expect(sequence.every(s => s.phase !== 'ship')).toBe(true);
  });

  it('should recommend next skills', async () => {
    const graph = await parseSkillsDir(SKILLS_PATH);
    const recs = recommendNext(graph, 'define');
    expect(recs.length).toBeGreaterThan(0);
  });
});
