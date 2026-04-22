export type {
  ProjectState,
  SkillEdge,
  SkillGraph,
  SkillNode,
  SkillPhase,
  SkillRecommendation,
} from '../../../packages/core/src/types';

export {
  createProject,
  findForPhase,
  findForTask,
  getBlockedSkills,
  getSequence,
  recommendNext,
  updateProjectState,
} from '../../../packages/core/src/graph';
