import React from 'react';
import type { SkillNode } from '@agent-skills/core';

interface SkillCardProps {
  skill: SkillNode | null;
  onClose?: () => void;
}

export function SkillCard({ skill, onClose }: SkillCardProps) {
  if (!skill) return null;

  return (
    <div className="skill-card-overlay" onClick={onClose}>
      <div className="skill-card" onClick={e => e.stopPropagation()}>
        <div className="skill-card-header">
          <h3>{skill.name}</h3>
          <span className={`phase-badge phase-${skill.phase}`}>{skill.phase}</span>
        </div>
        <p className="skill-desc">{skill.description}</p>
        <div className="skill-meta">
          <div className="meta-section">
            <strong>触发场景：</strong>
            <ul>
              {skill.triggers.slice(0, 5).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          {skill.keywords.length > 0 && (
            <div className="meta-section">
              <strong>关键词：</strong>
              <div className="keyword-list">
                {skill.keywords.slice(0, 8).map((k, i) => (
                  <span key={i} className="keyword">{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
