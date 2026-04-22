import type {
  SkillGraph,
  SkillNode,
  SkillPhase,
  ProjectState,
  SkillRecommendation,
} from './types';

/**
 * 查找指定阶段的所有技能
 */
export function findForPhase(graph: SkillGraph, phase: SkillPhase): SkillNode[] {
  return graph.nodes.filter(n => n.phase === phase);
}

/**
 * 根据关键词查找相关技能
 */
export function findForTask(graph: SkillGraph, task: string): SkillNode[] {
  const lower = task.toLowerCase();
  return graph.nodes.filter(n =>
    n.keywords.some(k => lower.includes(k.toLowerCase())) ||
    n.name.toLowerCase().includes(lower) ||
    n.description.toLowerCase().includes(lower)
  );
}

/**
 * 获取到达目标阶段的最短路径（按执行顺序排列）
 */
export function getSequence(graph: SkillGraph, targetPhase: SkillPhase): SkillNode[] {
  const phaseOrder: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];
  const targetIndex = phaseOrder.indexOf(targetPhase);

  if (targetIndex === -1) return [];

  return graph.nodes
    .filter(n => phaseOrder.indexOf(n.phase) <= targetIndex)
    .sort((a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase));
}

/**
 * 推荐下一步技能
 */
export function recommendNext(
  graph: SkillGraph,
  currentPhase: SkillPhase,
  context: string = ''
): SkillRecommendation[] {
  const phaseOrder: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];
  const currentIndex = phaseOrder.indexOf(currentPhase);

  const recommendations: SkillRecommendation[] = [];

  // 同一阶段优先推荐
  const samePhase = findForPhase(graph, currentPhase);
  for (const skill of samePhase) {
    if (context && skill.keywords.some(k => context.toLowerCase().includes(k))) {
      recommendations.push({
        skill,
        reason: `当前处于 ${currentPhase} 阶段，匹配关键词 "${context}"`,
      });
    }
  }

  // 如果没有匹配，进入下一阶段
  if (recommendations.length === 0 && currentIndex < phaseOrder.length - 1) {
    const nextPhase = phaseOrder[currentIndex + 1];
    const nextSkills = findForPhase(graph, nextPhase);
    for (const skill of nextSkills.slice(0, 2)) {
      recommendations.push({
        skill,
        reason: `从 ${currentPhase} 进入 ${nextPhase} 阶段，建议使用 ${skill.name}`,
      });
    }
  }

  return recommendations;
}

/**
 * 创建项目状态
 */
export function createProject(name: string): ProjectState {
  return {
    id: `proj-${Date.now()}`,
    name,
    currentPhase: 'define',
    completedSkills: [],
    blockedBy: [],
  };
}

/**
 * 更新项目状态
 */
export function updateProjectState(
  state: ProjectState,
  completedSkill: string,
  graph: SkillGraph
): ProjectState {
  const skill = graph.nodes.find(n => n.id === completedSkill);
  if (!skill) return state;

  const newCompleted = [...state.completedSkills, completedSkill];

  // 如果当前阶段技能全部完成，自动进入下一阶段
  const phaseSkills = graph.nodes.filter(n => n.phase === state.currentPhase);
  const allPhaseDone = phaseSkills.every(s => newCompleted.includes(s.id));

  let nextPhase = state.currentPhase;
  if (allPhaseDone) {
    const phaseOrder: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];
    const idx = phaseOrder.indexOf(state.currentPhase);
    if (idx < phaseOrder.length - 1) {
      nextPhase = phaseOrder[idx + 1];
    }
  }

  return {
    ...state,
    currentPhase: nextPhase,
    completedSkills: newCompleted,
  };
}

/**
 * 获取被阻塞的技能
 */
export function getBlockedSkills(graph: SkillGraph, state: ProjectState): SkillNode[] {
  if (state.completedSkills.length === 0) return [];

  return graph.nodes.filter(n => {
    // 如果已完成，跳过
    if (state.completedSkills.includes(n.id)) return false;
    // 检查前置依赖是否都已完成
    return n.dependsOn.every(d => state.completedSkills.includes(d));
  });
}
