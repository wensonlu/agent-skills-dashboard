# @agent-skills-dashboard/react

React components for visualizing Agent Skills graphs and project progress. Use it with `@agent-skills-dashboard/core` to render skill maps, stage trackers, and skill detail cards.

## Install

```bash
pnpm add @agent-skills-dashboard/core @agent-skills-dashboard/react

# or
npm install @agent-skills-dashboard/core @agent-skills-dashboard/react
```

This package expects `react` and `react-dom` to be installed in your app.

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
