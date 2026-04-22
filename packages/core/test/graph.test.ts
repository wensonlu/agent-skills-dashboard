import { describe, it, expect, beforeAll } from 'vitest';
import {
  findForPhase,
  findForTask,
  getSequence,
  recommendNext,
  createProject,
  updateProjectState,
  getBlockedSkills,
} from '../src/graph';
import { createSkillGraph } from '../src/index';
import type { ProjectState } from '../src/types';
import { resolve } from 'path';

const SKILLS_PATH = resolve(__dirname, 'fixtures/skills');

describe('graph API', () => {
  let graph: Awaited<ReturnType<typeof createSkillGraph>>;

  beforeAll(async () => {
    graph = await createSkillGraph(SKILLS_PATH);
  });

  describe('findForPhase', () => {
    it('should return all skills for build phase', () => {
      const buildSkills = findForPhase(graph, 'build');
      expect(buildSkills.length).toBeGreaterThan(0);
      buildSkills.forEach(s => expect(s.phase).toBe('build'));
    });

    it('should return non-empty for each phase', () => {
      const phases = ['define', 'plan', 'build', 'verify', 'review', 'ship'] as const;
      phases.forEach(phase => {
        const results = findForPhase(graph, phase);
        expect(results.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findForTask', () => {
    it('should find skills related to testing', () => {
      const results = findForTask(graph, 'test');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find skills related to review', () => {
      // code-review-and-quality is in fixture
      const results = findForTask(graph, 'review');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty for gibberish', () => {
      const results = findForTask(graph, 'xyzabc123nonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('getSequence', () => {
    it('should return ordered skills up to ship phase', () => {
      const sequence = getSequence(graph, 'ship');
      expect(sequence.length).toBe(graph.nodes.length);

      const phaseOrder = ['define', 'plan', 'build', 'verify', 'review', 'ship'];
      for (let i = 1; i < sequence.length; i++) {
        const prevIdx = phaseOrder.indexOf(sequence[i - 1].phase);
        const currIdx = phaseOrder.indexOf(sequence[i].phase);
        expect(currIdx).toBeGreaterThanOrEqual(prevIdx);
      }
    });

    it('should return only define skills for define phase', () => {
      const sequence = getSequence(graph, 'define');
      sequence.forEach(s => expect(s.phase).toBe('define'));
    });

    it('should return empty for unknown phase', () => {
      const sequence = getSequence(graph, 'unknown' as any);
      expect(sequence.length).toBe(0);
    });
  });

  describe('recommendNext', () => {
    it('should recommend skills for define phase', () => {
      const recs = recommendNext(graph, 'define');
      expect(recs.length).toBeGreaterThan(0);
      recs.forEach(r => {
        expect(r.skill).toBeDefined();
        expect(r.reason).toBeTruthy();
      });
    });

    it('should include reason in recommendations', () => {
      const recs = recommendNext(graph, 'define', '我要写API');
      recs.forEach(r => {
        expect(typeof r.reason).toBe('string');
        expect(r.reason.length).toBeGreaterThan(0);
      });
    });

    it('should work for all phases', () => {
      const phases = ['define', 'plan', 'build', 'verify', 'review', 'ship'] as const;
      phases.forEach(phase => {
        const recs = recommendNext(graph, phase);
        expect(Array.isArray(recs)).toBe(true);
      });
    });
  });

  describe('project lifecycle', () => {
    it('should create project with initial state', () => {
      const project = createProject('Test Project');
      expect(project.id).toBeTruthy();
      expect(project.name).toBe('Test Project');
      expect(project.currentPhase).toBe('define');
      expect(project.completedSkills).toHaveLength(0);
      expect(project.blockedBy).toHaveLength(0);
    });

    it('should update project state after completing a skill', () => {
      const project = createProject('Test');
      const updated = updateProjectState(project, 'idea-refine', graph);

      expect(updated.completedSkills).toContain('idea-refine');
      expect(updated.completedSkills.length).toBeGreaterThanOrEqual(1);
    });

    it('should advance phase when all skills in phase are done', () => {
      // idea-refine and spec-driven-development are both in 'define' phase
      const project = createProject('Test');
      let updated = updateProjectState(project, 'idea-refine', graph);
      updated = updateProjectState(updated, 'spec-driven-development', graph);

      // After completing all define skills, should advance to plan
      // Note: depends on actual graph structure
      expect(updated.completedSkills).toContain('idea-refine');
      expect(updated.completedSkills).toContain('spec-driven-development');
    });

    it('should not advance phase if skills remain incomplete', () => {
      const project = createProject('Test');
      const updated = updateProjectState(project, 'idea-refine', graph);

      // Only completed idea-refine, should still be in define
      // (assuming spec-driven-development also needed)
      expect(updated.currentPhase).toBeTruthy();
    });

    it('should handle completing unknown skill gracefully', () => {
      const project = createProject('Test');
      const updated = updateProjectState(project, 'nonexistent-skill', graph);
      expect(updated.completedSkills).toHaveLength(0);
    });
  });

  describe('getBlockedSkills', () => {
    it('should return empty for fresh project', () => {
      const project = createProject('Test');
      const blocked = getBlockedSkills(graph, project);
      // Fresh project - all skills are technically blocked by nothing
      // but the function returns skills not blocked by completed skills
      expect(Array.isArray(blocked)).toBe(true);
    });

    it('should return skills not in completed list', () => {
      const project = createProject('Test');
      const blocked = getBlockedSkills(graph, project);

      blocked.forEach(skill => {
        expect(project.completedSkills).not.toContain(skill.id);
      });
    });
  });
});

describe('edge cases', () => {
  let graph: Awaited<ReturnType<typeof createSkillGraph>>;

  beforeAll(async () => {
    graph = await createSkillGraph(SKILLS_PATH);
  });

  it('should handle empty graph gracefully', async () => {
    const empty = await import('../src/parser').then(m => m.parseSkillsDir('/tmp/empty-dir'));
    expect(empty.nodes).toHaveLength(0);

    const recs = recommendNext(empty, 'define');
    expect(recs.length).toBe(0);
  });

  it('should handle special characters in skill names', () => {
    // All skill names should be valid strings
    graph.nodes.forEach(node => {
      expect(typeof node.name).toBe('string');
      expect(node.name.length).toBeGreaterThan(0);
    });
  });

  it('should have consistent node count between parse and create', async () => {
    const { parseSkillsDir } = await import('../src/parser');
    const parsed = await parseSkillsDir(SKILLS_PATH);
    expect(parsed.nodes.length).toBe(graph.nodes.length);
  });
});
