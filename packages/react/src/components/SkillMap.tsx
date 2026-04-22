'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { SkillGraph, SkillNode, SkillPhase } from '@luwenchun1/core';

interface SkillMapProps {
  graph: SkillGraph;
  currentPhase?: SkillPhase;
  width?: number;
  height?: number;
  onSkillClick?: (skill: SkillNode) => void;
}

const PHASE_COLORS: Record<SkillPhase, string> = {
  define: '#6366f1',  // indigo
  plan: '#8b5cf6',    // violet
  build: '#10b981',   // emerald
  verify: '#f59e0b',  // amber
  review: '#ef4444',  // red
  ship: '#3b82f6',    // blue
};

const PHASE_LABELS: Record<SkillPhase, string> = {
  define: 'Define',
  plan: 'Plan',
  build: 'Build',
  verify: 'Verify',
  review: 'Review',
  ship: 'Ship',
};

export function SkillMap({
  graph,
  currentPhase,
  width = 800,
  height = 600,
  onSkillClick,
}: SkillMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create nodes with phase info
    const nodes = graph.nodes.map(n => ({ ...n }));
    const links = graph.edges
      .filter(e => e.type === 'depends')
      .map(e => ({ source: e.from, target: e.to }));

    // D3 force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Draw links
    const link = svg.append('g')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1.5)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-opacity', 0.6);

    // Draw node groups
    const node = svg.append('g')
      .selectAll<SVGGElement, typeof nodes[0]>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, typeof nodes[0]>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles
    node.append('circle')
      .attr('r', d => d.id === `spec-driven-development` ? 18 : 14)
      .attr('fill', d => PHASE_COLORS[d.phase] || '#9ca3af')
      .attr('stroke', d => d.phase === currentPhase ? '#1f2937' : 'white')
      .attr('stroke-width', d => d.phase === currentPhase ? 3 : 2)
      .attr('opacity', 0.9);

    // Node labels
    node.append('text')
      .text(d => d.name.length > 18 ? d.name.substring(0, 16) + '…' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 28)
      .attr('font-size', 11)
      .attr('fill', '#374151')
      .attr('pointer-events', 'none');

    // Phase legend
    const phases: SkillPhase[] = ['define', 'plan', 'build', 'verify', 'review', 'ship'];
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 20)`);

    phases.forEach((phase, i) => {
      const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
      g.append('circle').attr('r', 6).attr('fill', PHASE_COLORS[phase]);
      g.append('text')
        .text(PHASE_LABELS[phase])
        .attr('x', 14)
        .attr('y', 4)
        .attr('font-size', 12)
        .attr('fill', '#6b7280');
    });

    // Click handler
    node.on('click', (_, d) => {
      onSkillClick?.(d as SkillNode);
    });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graph, currentPhase, width, height, onSkillClick]);

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ background: '#f9fafb', borderRadius: 12 }}
      />
    </div>
  );
}
