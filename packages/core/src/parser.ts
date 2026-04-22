import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import type { SkillNode, SkillPhase, SkillGraph, SkillEdge } from './types';

// 阶段映射目录
const PHASE_MAP: Record<string, SkillPhase> = {
  'idea-refine': 'define',
  'spec-driven-development': 'define',
  'planning-and-task-breakdown': 'plan',
  'context-engineering': 'plan',
  'incremental-implementation': 'build',
  'frontend-ui-engineering': 'build',
  'api-and-interface-design': 'build',
  'source-driven-development': 'build',
  'test-driven-development': 'verify',
  'browser-testing-with-devtools': 'verify',
  'debugging-and-error-recovery': 'verify',
  'code-review-and-quality': 'review',
  'security-and-hardening': 'review',
  'performance-optimization': 'review',
  'git-workflow-and-versioning': 'ship',
  'ci-cd-and-automation': 'ship',
  'documentation-and-adrs': 'ship',
  'shipping-and-launch': 'ship',
  'deprecation-and-migration': 'review',
  'code-simplification': 'review',
  'using-agent-skills': 'define',
};

// 触发关键词模式
const TRIGGER_PATTERNS = [
  /use when[:\s]+(.+?)(?=\.|$)/gi,
  /trigger(?:s|ed|ing)[:\s]+(.+?)(?=\.|$)/gi,
  /applies? when[:\s]+(.+?)(?=\.|$)/gi,
];

/**
 * 从 SKILL.md 内容中提取触发关键词
 */
function extractTriggers(content: string): string[] {
  const triggers: string[] = [];
  for (const pattern of TRIGGER_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const phrase = match[1].trim();
      if (phrase.length > 3 && phrase.length < 100) {
        triggers.push(phrase.toLowerCase());
      }
    }
  }
  return [...new Set(triggers)];
}

/**
 * 从 description 提取阶段
 */
function inferPhase(skillId: string, content: string): SkillPhase {
  if (PHASE_MAP[skillId]) return PHASE_MAP[skillId];

  const lower = content.toLowerCase();
  if (lower.includes('spec') || lower.includes('define')) return 'define';
  if (lower.includes('plan') || lower.includes('breakdown')) return 'plan';
  if (lower.includes('build') || lower.includes('implement')) return 'build';
  if (lower.includes('test') || lower.includes('verify') || lower.includes('debug')) return 'verify';
  if (lower.includes('review') || lower.includes('quality')) return 'review';
  if (lower.includes('ship') || lower.includes('deploy') || lower.includes('launch')) return 'ship';
  return 'build';
}

/**
 * 解析单个 SKILL.md 文件
 */
async function parseSkillFile(filePath: string): Promise<SkillNode | null> {
  try {
    const content = await readFile(filePath, 'utf-8');

    // 提取 description
    const descMatch = content.match(/description[:\s]+([^\n]+)/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // 提取 name
    const nameMatch = content.match(/^#\s+(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : filePath.split('/').pop()?.replace('.md', '') || '';

    // 计算 skillId
    const parts = filePath.split('/');
    const skillId = parts[parts.length - 2] || name.toLowerCase().replace(/\s+/g, '-');

    // 提取触发词
    const triggers = extractTriggers(content);

    // 推断阶段
    const phase = inferPhase(skillId, content);

    return {
      id: skillId,
      name,
      description,
      phase,
      triggers,
      triggersStyle: 'manual',
      dependsOn: [],
      relatedSkills: [],
      keywords: triggers,
      filePath,
    };
  } catch {
    return null;
  }
}

/**
 * 解析 skills 目录，构建完整图谱
 */
export async function parseSkillsDir(skillsRoot: string): Promise<SkillGraph> {
  const nodes: SkillNode[] = [];
  const edges: SkillEdge[] = [];

  try {
    const entries = await readdir(skillsRoot, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = join(skillsRoot, entry.name);
      const skillFile = join(skillDir, 'SKILL.md');

      const node = await parseSkillFile(skillFile);
      if (node) {
        nodes.push(node);
      }
    }

    // 构建关系边（基于 phase 顺序）
    const phaseOrder: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // 不同阶段的技能有隐式依赖关系
        if (phaseOrder.indexOf(nodes[j].phase) > phaseOrder.indexOf(nodes[i].phase)) {
          edges.push({
            from: nodes[i].id,
            to: nodes[j].id,
            type: 'depends',
          });
        }
      }
    }

  } catch (error) {
    console.error('Error parsing skills directory:', error);
  }

  return { nodes, edges };
}
