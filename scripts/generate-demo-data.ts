/**
 * 生成 demo/index.html 使用的内联数据
 * 运行: npx tsx scripts/generate-demo-data.ts
 */

import { writeFileSync } from 'fs';
import { createSkillGraph } from '../packages/core/src/index';

async function main() {
  const graph = await createSkillGraph('/root/.openclaw/workspace/agent-skills/skills');

  const data = {
    nodes: graph.nodes.map(n => ({
      id: n.id,
      name: n.name,
      description: n.description.substring(0, 100),
      phase: n.phase,
    })),
    edges: graph.edges.map(e => ({
      source: e.from,
      target: e.to,
    })),
  };

  // 读取 HTML 模板
  const fs = await import('fs');
  let html = fs.readFileSync('demo/index.html', 'utf-8');

  // 替换内联数据占位符
  html = html.replace(
    '__INLINE_DATA__',
    JSON.stringify(data, null, 2)
  );

  // 输出到 docs/demo.html（GitHub Pages 用）
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/demo.html', html);

  console.log(`✅ 生成 docs/demo.html — ${data.nodes.length} 节点, ${data.edges.length} 边`);
}

main().catch(console.error);
