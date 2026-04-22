# Agent Skills Dashboard

> AI Coding Skills 可视化仪表盘 — 让 AI Agent 理解技能关系、追踪项目阶段、推荐下一步行动。

[![npm](https://img.shields.io/npm/v/@agent-skills-dashboard/core)](https://www.npmjs.com/package/@agent-skills-dashboard/core)
[![npm](https://img.shields.io/npm/v/@agent-skills-dashboard/react)](https://www.npmjs.com/package/@agent-skills-dashboard/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/ci.yml)
[![Release](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/release.yml/badge.svg)](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/release.yml)

## 这是什么

Agent Skills Dashboard 是一个面向 AI Coding 工作流的 npm 包集合。它可以读取一组 `SKILL.md` 文件，解析出技能名称、阶段、依赖关系和触发关键词，再把这些技能组织成可查询、可推荐、可视化的技能图谱。

你可以用它做两类事情：

- 在脚本或 AI Agent 里使用 `@agent-skills-dashboard/core`，根据当前开发阶段推荐下一步技能。
- 在 React 应用里使用 `@agent-skills-dashboard/react`，展示技能关系图、项目阶段进度和技能详情。

## 核心定位

本项目是给 **AI Agent 用的技能导航系统**：

- **`@agent-skills-dashboard/core`** — TypeScript 纯数据解析包，无 UI 依赖，AI 通过 `import` 使用
- **`@agent-skills-dashboard/react`** — React 可视化组件包，人类通过浏览器预览技能关系图和项目状态

## 安装

只需要数据解析和推荐能力时，安装 core 包：

```bash
pnpm add @agent-skills-dashboard/core

# 或
npm install @agent-skills-dashboard/core
```

如果你要在 React 页面里展示技能图谱和项目进度，安装 React 组件包：

```bash
# 使用 pnpm（推荐）
pnpm add @agent-skills-dashboard/core @agent-skills-dashboard/react

# 或使用 npm
npm install @agent-skills-dashboard/core @agent-skills-dashboard/react
```

`@agent-skills-dashboard/react` 需要你的项目已经安装 `react` 和 `react-dom`。

## 快速开始

### AI Agent 用法（core 包）

```typescript
import { createSkillGraph, findForPhase, recommendNext } from '@agent-skills-dashboard/core';

// 初始化技能图谱
const graph = await createSkillGraph('/path/to/agent-skills/skills');

// 按阶段查找
const buildSkills = findForPhase(graph, 'build');
// → [frontend-ui-engineering, api-and-interface-design, ...]

// AI 推荐下一步
const recs = recommendNext(graph, 'define', '我要开始一个新项目');
// → [{ skill: planning-and-task-breakdown, reason: '...' }]
```

### React 组件用法

```tsx
import { createProject } from '@agent-skills-dashboard/core';
import { SkillMap, ProjectTracker, SkillCard } from '@agent-skills-dashboard/react';
import '@agent-skills-dashboard/react/styles';

const project = createProject('My AI Project');

// 技能关系图
<SkillMap
  graph={graph}
  currentPhase="plan"
  width={900}
  height={600}
  onSkillClick={(skill) => setSelectedSkill(skill)}
/>

// 项目阶段追踪
<ProjectTracker
  project={projectState}
  graph={graph}
  onSkillComplete={(skillId) => handleComplete(skillId)}
/>

// 技能详情弹窗
{selectedSkill && (
  <SkillCard skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
)}
```

## 输入数据要求

`createSkillGraph()` 接收的是一个 skills 目录路径。目录中每个技能通常是一个文件夹，里面包含 `SKILL.md`：

```text
skills/
├── planning-and-task-breakdown/
│   └── SKILL.md
├── test-driven-development/
│   └── SKILL.md
└── shipping-and-launch/
    └── SKILL.md
```

`SKILL.md` 会被解析为技能节点。推荐在文件中包含标题、描述、触发条件、依赖和相关技能等信息，这样图谱和推荐结果会更准确。

## API 一览

`@agent-skills-dashboard/core` 常用导出：

- `createSkillGraph(skillsRoot)`：读取 skills 目录并生成图谱。
- `findForPhase(graph, phase)`：查找某个阶段的技能，阶段包括 `define`、`plan`、`build`、`verify`、`review`、`ship`。
- `findForTask(graph, task)`：根据任务关键词查找相关技能。
- `recommendNext(graph, currentPhase, context)`：根据当前阶段和上下文推荐下一步技能。
- `createProject(name)`：创建项目阶段追踪状态。
- `updateProjectState(project, completedSkillId, graph)`：标记技能完成，并在阶段完成后推进项目状态。

`@agent-skills-dashboard/react` 常用导出：

- `SkillMap`：展示技能节点和依赖关系。
- `ProjectTracker`：展示项目从 define 到 ship 的阶段进度。
- `SkillCard`：展示单个技能详情。

## 技能生命周期

```
Define → Plan → Build → Verify → Review → Ship
```

| 阶段 | 技能 |
|------|------|
| **Define** | idea-refine, spec-driven-development |
| **Plan** | planning-and-task-breakdown, context-engineering |
| **Build** | incremental-implementation, frontend-ui-engineering, api-and-interface-design |
| **Verify** | test-driven-development, browser-testing-with-devtools, debugging-and-error-recovery |
| **Review** | code-review-and-quality, security-and-hardening, performance-optimization |
| **Ship** | git-workflow-and-versioning, ci-cd-and-automation, shipping-and-launch |

## 项目结构

```
agent-skills-dashboard/
├── packages/
│   ├── core/                    # TypeScript 数据层
│   │   ├── src/
│   │   │   ├── parser.ts        # SKILL.md 解析器
│   │   │   ├── graph.ts         # 图谱查询 API
│   │   │   ├── types.ts         # 类型定义
│   │   │   └── index.ts         # 导出入口
│   │   └── test/
│   └── react/                   # React 组件
│       ├── src/
│       │   ├── components/
│       │   │   ├── SkillMap.tsx      # D3 力导向图
│       │   │   ├── ProjectTracker.tsx # Kanban 阶段面板
│       │   │   └── SkillCard.tsx     # 技能详情弹窗
│       │   └── styles.css
│       └── dist/
├── pnpm-workspace.yaml
└── package.json
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建全部包
pnpm build

# 运行测试
pnpm test

# 监听模式开发
pnpm dev
```

## 设计原则

本项目遵循 [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) 的工作流规范，将技能编码为开发过程的每个阶段。

## License

MIT
