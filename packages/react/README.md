# @agent-skills-dashboard/react

React components for visualizing Agent Skills graphs and project progress. Use it with `@agent-skills-dashboard/core` to render skill maps, stage trackers, and skill detail cards.

这个组件包把 `SKILL.md` 这类 Agent 技能文件背后的“阶段 + 依赖 + 推荐”关系可视化出来。对人来说，它可以展示技能关系、当前项目阶段、任务匹配和下一步推荐；对 AI Agent 来说，它是技能导航结果的可读界面。

## Install

```bash
pnpm add @agent-skills-dashboard/core @agent-skills-dashboard/react

# or
npm install @agent-skills-dashboard/core @agent-skills-dashboard/react
```

This package expects `react` and `react-dom` to be installed in your app.

### AI Install

给 AI Agent 或自动化脚本使用时，可以临时指定淘宝 npm 镜像源，不修改全局 registry：

```bash
npm install @agent-skills-dashboard/core @agent-skills-dashboard/react --registry=https://registry.npmmirror.com
```

## Quick Start

```tsx
import { createProject, type SkillGraph } from '@agent-skills-dashboard/core';
import { SkillMap, ProjectTracker, SkillCard } from '@agent-skills-dashboard/react';
import '@agent-skills-dashboard/react/styles';

export function SkillsDashboard({ graph }: { graph: SkillGraph }) {
  const project = createProject('My AI Project');

  return (
    <>
      <SkillMap graph={graph} currentPhase="plan" width={900} height={600} />
      <ProjectTracker project={project} graph={graph} />
      <SkillCard skill={graph.nodes[0]} />
    </>
  );
}
```

## Components

- `SkillMap` renders a D3-based skill relationship graph.
- `ProjectTracker` renders project progress across `define`, `plan`, `build`, `verify`, `review`, and `ship`.
- `SkillCard` renders details for a single skill.

## Styles

Import the bundled stylesheet once in your app:

```tsx
import '@agent-skills-dashboard/react/styles';
```

## License

MIT
