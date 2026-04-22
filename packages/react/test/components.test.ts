import { describe, it, expect } from 'vitest';
import { SkillMap, ProjectTracker, SkillCard } from '../src/index';

describe('react components', () => {
  it('should export SkillMap component', () => {
    expect(SkillMap).toBeDefined();
    expect(typeof SkillMap).toBe('function');
  });

  it('should export ProjectTracker component', () => {
    expect(ProjectTracker).toBeDefined();
    expect(typeof ProjectTracker).toBe('function');
  });

  it('should export SkillCard component', () => {
    expect(SkillCard).toBeDefined();
    expect(typeof SkillCard).toBe('function');
  });
});
