/**
 * @wenson1234/core 使用示例
 *
 * 运行方式:
 *   npx tsx src/demo.ts
 *   或
 *   pnpm build && node dist/demo.js
 */

import { createSkillGraph, findForPhase, findForTask, recommendNext, createProject, updateProjectState } from './index';

// 使用本地 agent-skills 作为示例
const SKILLS_PATH = '/root/.openclaw/workspace/agent-skills/skills';

async function main() {
  console.log('🔍 初始化技能图谱...\n');

  const graph = await createSkillGraph(SKILLS_PATH);

  console.log(`📊 共解析 ${graph.nodes.length} 个技能，${graph.edges.length} 条关系\n`);

  // 1. 按阶段查找
  console.log('=== 按阶段查找 (build) ===');
  const buildSkills = findForPhase(graph, 'build');
  buildSkills.forEach(s => console.log(`  - ${s.name} [${s.phase}]`));
  console.log('');

  // 2. 按任务查找
  console.log('=== 按任务查找 ("api") ===');
  const apiSkills = findForTask(graph, 'api');
  apiSkills.forEach(s => console.log(`  - ${s.name}: ${s.description}`));
  console.log('');

  // 3. 推荐下一步
  console.log('=== 推荐下一步 (define 阶段) ===');
  const recs = recommendNext(graph, 'define', '我要开始一个新项目');
  recs.forEach(r => console.log(`  → ${r.skill.name}: ${r.reason}`));
  console.log('');

  // 4. 项目追踪
  console.log('=== 项目追踪演示 ===');
  const project = createProject('我的 AI 项目');
  console.log(`初始状态: ${project.name}, 阶段: ${project.currentPhase}`);

  const updated = updateProjectState(project, 'idea-refine', graph);
  console.log(`完成 idea-refine 后: 阶段 = ${updated.currentPhase}`);
}

main().catch(console.error);
