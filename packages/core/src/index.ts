export * from './types';
export { parseSkillsDir } from './parser';
export {
  findForPhase,
  findForTask,
  getSequence,
  recommendNext,
  createProject,
  updateProjectState,
  getBlockedSkills,
} from './graph';

/**
 * 创建技能图谱（便捷入口）
 * @param skillsRoot skills 目录路径，如 '/path/to/agent-skills/skills'
 */
export async function createSkillGraph(skillsRoot: string) {
  const { parseSkillsDir } = await import('./parser');
  return parseSkillsDir(skillsRoot);
}
