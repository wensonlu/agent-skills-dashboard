import React from 'react';
import type { SkillGraph, ProjectState, SkillPhase } from '@luwenchun1/core';

interface ProjectTrackerProps {
  project: ProjectState;
  graph: SkillGraph;
  onSkillComplete?: (skillId: string) => void;
}

const PHASE_ORDER: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];

/**
 * 项目阶段追踪面板
 */
export function ProjectTracker({ project, graph, onSkillComplete }: ProjectTrackerProps) {
  const currentIndex = PHASE_ORDER.indexOf(project.currentPhase);

  return (
    <div className="project-tracker">
      <h2>{project.name}</h2>
      <div className="phase-progress">
        {PHASE_ORDER.map((phase, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;
          const skills = graph.nodes.filter(n => n.phase === phase);

          return (
            <div
              key={phase}
              className={`phase-column ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
            >
              <div className="phase-header">{phase.toUpperCase()}</div>
              <div className="phase-skills">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className={`skill-item ${project.completedSkills.includes(skill.id) ? 'done' : ''}`}
                    onClick={() => onSkillComplete?.(skill.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
