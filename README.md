# Agent Skills Dashboard

> AI Coding Skills 可视化仪表盘 — 让 AI Agent 理解技能关系、追踪项目阶段、推荐下一步行动。

## 核心定位

`@agent-skills/core` 是一个 TypeScript 数据解析包，无 UI 依赖，专门给 AI Agent 使用：

```typescript
import { createSkillGraph } from '@agent-skills/core';

const graph = await createSkillGraph('/path/to/skills/');

// 查找 Build 阶段技能
const buildSkills = graph.nodes.filter(n => n.phase === 'build');

// 根据任务推荐技能
const recs = recommendNext(graph, 'define', '我需要一个 API 设计');
```

`@agent-skills/react` 是 React 组件包，提供开箱即用的可视化界面。

## 包结构

```
agent-skills-dashboard/
├── packages/
│   ├── core/          # TypeScript 数据层
│   └── react/         # React 组件层
├── pnpm-workspace.yaml
└── package.json
```

## 安装

```bash
# 安装全部包
pnpm install

# 或单独安装 core
pnpm add @agent-skills/core
```

## 使用示例

### AI Agent 用法（core 包）

```typescript
import { createSkillGraph, findForPhase, recommendNext } from '@agent-skills/core';

// 初始化
const graph = await createSkillGraph('/path/to/agent-skills/skills');

// 查询 Build 阶段技能
const buildSkills = findForPhase(graph, 'build');

// 推荐下一步
const recs = recommendNext(graph, 'define', '我要写前端界面');
console.log(recs);
// [
//   { skill: frontend-ui-engineering, reason: '...' },
//   { skill: api-and-interface-design, reason: '...' }
// ]
```

### React 组件用法

```tsx
import { SkillMap, ProjectTracker } from '@agent-skills/react';
import { createSkillGraph } from '@agent-skills/core';

const graph = await createSkillGraph('/path/to/skills/');

<SkillMap graph={graph} currentPhase="plan" />

<ProjectTracker project={projectState} graph={graph} />
```

## 设计原则

本项目遵循 [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) 的工作流规范：

| 阶段 | 技能 |
|------|------|
| Define | idea-refine, spec-driven-development |
| Plan | planning-and-task-breakdown, context-engineering |
| Build | incremental-implementation, frontend-ui-engineering, api-and-interface-design |
| Verify | test-driven-development, browser-testing-with-devtools, debugging-and-error-recovery |
| Review | code-review-and-quality, security-and-hardening, performance-optimization |
| Ship | git-workflow-and-versioning, ci-cd-and-automation, shipping-and-launch |

## 开发

```bash
# 构建全部包
pnpm build

# 测试
pnpm test

# 监听模式
pnpm dev
```

## License

MIT
