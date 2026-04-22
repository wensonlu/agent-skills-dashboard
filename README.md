# Agent Skills Dashboard

> AI Coding Skills 可视化仪表盘 — 让 AI Agent 理解技能关系、追踪项目阶段、推荐下一步行动。

[![npm](https://img.shields.io/npm/v/@wenson123/core)](https://www.npmjs.com/package/@wenson123/core)
[![npm](https://img.shields.io/npm/v/@wenson123/react)](https://www.npmjs.com/package/@wenson123/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/ci.yml)
[![Release](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/release.yml/badge.svg)](https://github.com/wensonlu/agent-skills-dashboard/actions/workflows/release.yml)

## 核心定位

本项目是给 **AI Agent 用的技能导航系统**：

- **`@wenson123/core`** — TypeScript 纯数据解析包，无 UI 依赖，AI 通过 `import` 使用
- **`@wenson123/react`** — React 可视化组件包，人类通过浏览器预览技能关系图和项目状态

## 安装

```bash
# 使用 pnpm（推荐）
pnpm add @wenson123/core @wenson123/react

# 或使用 npm
npm install @wenson123/core @wenson123/react
```

## 快速开始

### AI Agent 用法（core 包）

```typescript
import { createSkillGraph, findForPhase, recommendNext } from '@wenson123/core';

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
import { SkillMap, ProjectTracker, SkillCard } from '@wenson123/react';
import '@wenson123/react/styles';  // 引入样式

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
