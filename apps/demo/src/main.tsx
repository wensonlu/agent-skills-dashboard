import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createProject,
  findForTask,
  recommendNext,
  updateProjectState,
  type SkillGraph,
  type SkillNode,
} from '@agent-skills-dashboard/core';
import { ProjectTracker, SkillCard, SkillMap } from '@agent-skills-dashboard/react';
import '@agent-skills-dashboard/react/styles';
import './styles.css';

const graph: SkillGraph = {
  nodes: [
    {
      id: 'idea-refine',
      name: 'Idea Refine',
      description: '把模糊想法整理成清晰目标、约束、用户价值和可执行方向。',
      phase: 'define',
      triggers: ['新项目还只有一个想法', '需要澄清用户和价值', '方案太散需要收敛'],
      triggersStyle: 'auto',
      dependsOn: [],
      relatedSkills: ['spec-driven-development', 'planning-and-task-breakdown'],
      keywords: ['idea', 'scope', 'value'],
      filePath: 'demo/skills/idea-refine/SKILL.md',
    },
    {
      id: 'spec-driven-development',
      name: 'Spec-Driven Development',
      description: '先写规格说明，再根据验收标准推进实现，减少返工和误解。',
      phase: 'define',
      triggers: ['开始重要功能', '需求不够明确', '需要验收标准'],
      triggersStyle: 'auto',
      dependsOn: ['idea-refine'],
      relatedSkills: ['test-driven-development'],
      keywords: ['spec', 'requirements', 'acceptance'],
      filePath: 'demo/skills/spec-driven-development/SKILL.md',
    },
    {
      id: 'planning-and-task-breakdown',
      name: 'Planning and Task Breakdown',
      description: '把规格拆成有依赖、有顺序、可交付的小任务。',
      phase: 'plan',
      triggers: ['需求已经清楚', '需要排期', '任务复杂需要拆解'],
      triggersStyle: 'auto',
      dependsOn: ['spec-driven-development'],
      relatedSkills: ['incremental-implementation'],
      keywords: ['plan', 'tasks', 'milestone'],
      filePath: 'demo/skills/planning-and-task-breakdown/SKILL.md',
    },
    {
      id: 'context-engineering',
      name: 'Context Engineering',
      description: '组织代码、资料和上下文，让 Agent 在实现前获得足够背景。',
      phase: 'plan',
      triggers: ['接手陌生代码库', '需要长期会话', '输出质量开始下降'],
      triggersStyle: 'auto',
      dependsOn: ['idea-refine'],
      relatedSkills: ['debugging-and-error-recovery'],
      keywords: ['context', 'repo', 'agent'],
      filePath: 'demo/skills/context-engineering/SKILL.md',
    },
    {
      id: 'incremental-implementation',
      name: 'Incremental Implementation',
      description: '用小步提交完成实现，每一步都保持可验证、可回退。',
      phase: 'build',
      triggers: ['开始编码', '功能跨多个文件', '需要降低变更风险'],
      triggersStyle: 'auto',
      dependsOn: ['planning-and-task-breakdown'],
      relatedSkills: ['test-driven-development', 'code-review-and-quality'],
      keywords: ['implementation', 'small steps', 'build'],
      filePath: 'demo/skills/incremental-implementation/SKILL.md',
    },
    {
      id: 'frontend-ui-engineering',
      name: 'Frontend UI Engineering',
      description: '构建可用、响应式、符合产品语境的前端界面。',
      phase: 'build',
      triggers: ['需要做页面', '需要交互状态', '需要视觉验收'],
      triggersStyle: 'auto',
      dependsOn: ['planning-and-task-breakdown'],
      relatedSkills: ['browser-testing-with-devtools'],
      keywords: ['frontend', 'react', 'ui'],
      filePath: 'demo/skills/frontend-ui-engineering/SKILL.md',
    },
    {
      id: 'test-driven-development',
      name: 'Test-Driven Development',
      description: '围绕行为和边界写测试，用测试保护实现质量。',
      phase: 'verify',
      triggers: ['业务逻辑变更', '修复 bug', '需要防回归'],
      triggersStyle: 'auto',
      dependsOn: ['incremental-implementation'],
      relatedSkills: ['debugging-and-error-recovery'],
      keywords: ['test', 'vitest', 'regression'],
      filePath: 'demo/skills/test-driven-development/SKILL.md',
    },
    {
      id: 'browser-testing-with-devtools',
      name: 'Browser Testing with DevTools',
      description: '在真实浏览器里验证加载、交互、布局和控制台错误。',
      phase: 'verify',
      triggers: ['前端页面改动', '需要截图验收', '浏览器行为异常'],
      triggersStyle: 'auto',
      dependsOn: ['frontend-ui-engineering'],
      relatedSkills: ['debugging-and-error-recovery'],
      keywords: ['browser', 'devtools', 'screenshot'],
      filePath: 'demo/skills/browser-testing-with-devtools/SKILL.md',
    },
    {
      id: 'code-review-and-quality',
      name: 'Code Review and Quality',
      description: '从正确性、可维护性、安全性和测试缺口审查变更。',
      phase: 'review',
      triggers: ['准备合并', '需要评审代码', '检查潜在风险'],
      triggersStyle: 'auto',
      dependsOn: ['test-driven-development'],
      relatedSkills: ['security-and-hardening'],
      keywords: ['review', 'quality', 'risk'],
      filePath: 'demo/skills/code-review-and-quality/SKILL.md',
    },
    {
      id: 'shipping-and-launch',
      name: 'Shipping and Launch',
      description: '发布前检查配置、文档、回滚路径和上线风险。',
      phase: 'ship',
      triggers: ['准备发布', '需要上线清单', '需要回滚计划'],
      triggersStyle: 'auto',
      dependsOn: ['code-review-and-quality'],
      relatedSkills: [],
      keywords: ['ship', 'release', 'launch'],
      filePath: 'demo/skills/shipping-and-launch/SKILL.md',
    },
  ],
  edges: [
    { from: 'idea-refine', to: 'spec-driven-development', type: 'depends' },
    { from: 'idea-refine', to: 'context-engineering', type: 'depends' },
    { from: 'spec-driven-development', to: 'planning-and-task-breakdown', type: 'depends' },
    { from: 'planning-and-task-breakdown', to: 'incremental-implementation', type: 'depends' },
    { from: 'planning-and-task-breakdown', to: 'frontend-ui-engineering', type: 'depends' },
    { from: 'incremental-implementation', to: 'test-driven-development', type: 'depends' },
    { from: 'frontend-ui-engineering', to: 'browser-testing-with-devtools', type: 'depends' },
    { from: 'test-driven-development', to: 'code-review-and-quality', type: 'depends' },
    { from: 'browser-testing-with-devtools', to: 'code-review-and-quality', type: 'depends' },
    { from: 'code-review-and-quality', to: 'shipping-and-launch', type: 'depends' },
    { from: 'context-engineering', to: 'debugging-and-error-recovery', type: 'relates' },
  ],
};

function App() {
  const [project, setProject] = useState(() => createProject('Agent Skills 实战项目'));
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(graph.nodes[0]);
  const [task, setTask] = useState('我要做一个 React 页面并上线');

  const taskMatches = useMemo(() => findForTask(graph, task), [task]);
  const recommendations = useMemo(
    () => recommendNext(graph, project.currentPhase, task).slice(0, 3),
    [project.currentPhase, task],
  );

  const handleSkillComplete = (skillId: string) => {
    setProject(current => updateProjectState(current, skillId, graph));
    const skill = graph.nodes.find(node => node.id === skillId);
    if (skill) setSelectedSkill(skill);
  };

  return (
    <main className="demo-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">React package demo</p>
          <h1>Agent Skills Dashboard</h1>
          <p className="lede">
            这个 demo 直接使用 monorepo 里的组件包，把技能依赖、项目阶段和下一步推荐放在同一个可交互工作台里。
          </p>
        </div>
        <div className="hero-stats" aria-label="graph stats">
          <span>{graph.nodes.length} skills</span>
          <span>{graph.edges.length} links</span>
          <span>{project.currentPhase}</span>
        </div>
      </section>

      <section className="workspace">
        <div className="graph-panel">
          <div className="panel-header">
            <div>
              <h2>技能关系图</h2>
              <p>点击节点查看详情，拖拽节点观察依赖关系。</p>
            </div>
          </div>
          <SkillMap
            graph={graph}
            currentPhase={project.currentPhase}
            width={860}
            height={520}
            onSkillClick={setSelectedSkill}
          />
        </div>

        <aside className="side-panel">
          <label className="task-search">
            <span>当前任务</span>
            <textarea value={task} onChange={event => setTask(event.target.value)} rows={4} />
          </label>

          <div className="recommendations">
            <h2>下一步推荐</h2>
            {recommendations.map(item => (
              <button key={item.skill.id} type="button" onClick={() => setSelectedSkill(item.skill)}>
                <strong>{item.skill.name}</strong>
                <span>{item.reason}</span>
              </button>
            ))}
          </div>

          <div className="matches">
            <h2>任务匹配</h2>
            <div className="match-list">
              {taskMatches.slice(0, 5).map(skill => (
                <button key={skill.id} type="button" onClick={() => setSelectedSkill(skill)}>
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="tracker-panel">
        <ProjectTracker project={project} graph={graph} onSkillComplete={handleSkillComplete} />
      </section>

      <SkillCard skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
