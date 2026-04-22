# @agent-skills-dashboard/core

TypeScript data layer for Agent Skills. It reads `SKILL.md` files, builds a skill graph, and helps AI agents find or recommend the next skill for a development workflow.

它把 `SKILL.md` 这类 Agent 技能文件组织成“阶段 + 依赖 + 推荐”的技能图谱。对 AI Agent 来说，它像一个开发流程导航器：可以根据当前阶段、任务描述和技能依赖，推荐下一步应该使用的技能。

## Install

```bash
pnpm add @agent-skills-dashboard/core

# or
npm install @agent-skills-dashboard/core
```

### AI Install

给 AI Agent 或自动化脚本使用时，可以临时指定淘宝 npm 镜像源，不修改全局 registry：

```bash
npm install @agent-skills-dashboard/core --registry=https://registry.npmmirror.com
```

## Quick Start

```ts
import {
  createSkillGraph,
  findForPhase,
  findForTask,
  recommendNext,
  createProject,
  updateProjectState,
} from '@agent-skills-dashboard/core';

const graph = await createSkillGraph('/path/to/agent-skills/skills');

const buildSkills = findForPhase(graph, 'build');
const apiSkills = findForTask(graph, 'api integration');
const recommendations = recommendNext(graph, 'define', 'I want to start a new app');

let project = createProject('My AI Project');
project = updateProjectState(project, 'idea-refine', graph);
```

## Input

`createSkillGraph()` expects a directory that contains skill folders with `SKILL.md` files:

```text
skills/
├── idea-refine/
│   └── SKILL.md
├── planning-and-task-breakdown/
│   └── SKILL.md
└── shipping-and-launch/
    └── SKILL.md
```

## Main APIs

- `createSkillGraph(skillsRoot)` parses skills and returns a graph.
- `findForPhase(graph, phase)` returns skills for `define`, `plan`, `build`, `verify`, `review`, or `ship`.
- `findForTask(graph, task)` searches skills by keyword, name, and description.
- `recommendNext(graph, currentPhase, context)` recommends useful next skills.
- `createProject(name)` creates a project tracking state.
- `updateProjectState(project, completedSkillId, graph)` marks a skill complete and advances the project phase when ready.

## License

MIT
