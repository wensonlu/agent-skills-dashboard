import React from 'react';
import type { SkillGraph, SkillNode } from '@agent-skills/core';

interface SkillMapProps {
  graph: SkillGraph;
  currentPhase?: string;
  onSkillClick?: (skill: SkillNode) => void;
}

/**
 * 技能关系图组件
 * TODO: 实现 D3.js 力导向图
 */
export function SkillMap({ graph, currentPhase, onSkillClick }: SkillMapProps) {
  return (
    <div className="skill-map" data-phase={currentPhase}>
      <h2>技能关系图</h2>
      <div className="skill-nodes">
        {graph.nodes.map(node => (
          <div
            key={node.id}
            className={`skill-node phase-${node.phase}`}
            onClick={() => onSkillClick?.(node)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{node.name}</strong>
            <span className="phase-badge">{node.phase}</span>
          </div>
        ))}
      </div>
      <p className="note">完整 D3 力导向图实现中...</p>
    </div>
  );
}
