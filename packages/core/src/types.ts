// 技能阶段
export type SkillPhase =
  | 'define'    // 定义阶段
  | 'plan'      // 计划阶段
  | 'build'     // 构建阶段
  | 'verify'    // 验证阶段
  | 'review'    // 评审阶段
  | 'ship';     // 上线阶段

// 技能节点
export interface SkillNode {
  id: string;                    // e.g. "spec-driven-development"
  name: string;                  // e.g. "Spec Driven Development"
  description: string;
  phase: SkillPhase;
  triggers: string[];           // 触发关键词
  triggersStyle: 'auto' | 'manual';
  dependsOn: string[];           // 前置技能
  relatedSkills: string[];      // 相关技能
  keywords: string[];            // 搜索关键词
  filePath: string;              // SKILL.md 路径
}

// 项目追踪
export interface ProjectState {
  id: string;
  name: string;
  currentPhase: SkillPhase;
  completedSkills: string[];
  blockedBy: string[];
}

// 技能图谱
export interface SkillGraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

// 技能关系边
export interface SkillEdge {
  from: string;
  to: string;
  type: 'depends' | 'relates';
}

// 推荐结果
export interface SkillRecommendation {
  skill: SkillNode;
  reason: string;
}
