"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DepNode, DepEdge } from "@/lib/data";

interface DependencyGraphProps {
  nodes: DepNode[];
  edges: DepEdge[];
  clusterName: string;
  onClose: () => void;
}

const typeColors: Record<string, { fill: string; stroke: string; icon: string }> = {
  Trigger: { fill: "#fde8e8", stroke: "#ea001e", icon: "⚡" },
  Apex: { fill: "#e5f1fd", stroke: "#0176d3", icon: "{ }" },
  Flow: { fill: "#f0ecff", stroke: "#5849be", icon: "⟳" },
  Batch: { fill: "#fef3e5", stroke: "#fe9339", icon: "⧗" },
  LWC: { fill: "#e6f4ea", stroke: "#2e844a", icon: "◇" },
  API: { fill: "#f3f3f3", stroke: "#706e6b", icon: "⇌" },
};

const recBorder: Record<string, string> = {
  Keep: "#2e844a",
  Simplify: "#fe9339",
  Modernize: "#0176d3",
  Retire: "#ea001e",
};

function layoutNodes(nodes: DepNode[], edges: DepEdge[]) {
  const inDegree = new Map<string, number>();
  nodes.forEach((n) => inDegree.set(n.id, 0));
  edges.forEach((e) => inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1));

  const layers: string[][] = [];
  const placed = new Set<string>();
  const remaining = new Set(nodes.map((n) => n.id));

  while (remaining.size > 0) {
    const layer: string[] = [];
    for (const id of remaining) {
      const deps = edges.filter((e) => e.to === id).map((e) => e.from);
      if (deps.every((d) => placed.has(d)) || deps.length === 0) {
        layer.push(id);
      }
    }
    if (layer.length === 0) {
      for (const id of remaining) {
        layer.push(id);
        break;
      }
    }
    layer.forEach((id) => { placed.add(id); remaining.delete(id); });
    layers.push(layer);
  }

  const positions: Record<string, { x: number; y: number }> = {};
  const layerGap = 150;
  const nodeGap = 100;
  const startX = 60;
  const startY = 60;

  layers.forEach((layer, li) => {
    const totalHeight = (layer.length - 1) * nodeGap;
    const offsetY = startY + (400 - totalHeight) / 2;
    layer.forEach((id, ni) => {
      positions[id] = {
        x: startX + li * layerGap,
        y: Math.max(startY, offsetY + ni * nodeGap),
      };
    });
  });

  return positions;
}

function getDownstream(nodeId: string, edges: DepEdge[]): Set<string> {
  const result = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    edges.filter((e) => e.from === current).forEach((e) => {
      if (!result.has(e.to)) {
        result.add(e.to);
        queue.push(e.to);
      }
    });
  }
  return result;
}

function getUpstream(nodeId: string, edges: DepEdge[]): Set<string> {
  const result = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    edges.filter((e) => e.to === current).forEach((e) => {
      if (!result.has(e.from)) {
        result.add(e.from);
        queue.push(e.from);
      }
    });
  }
  return result;
}

export default function DependencyGraph({
  nodes,
  edges,
  clusterName,
  onClose,
}: DependencyGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const positions = useMemo(() => layoutNodes(nodes, edges), [nodes, edges]);

  const activeNode = selectedNode || hoveredNode;

  const downstream = useMemo(
    () => (activeNode ? getDownstream(activeNode, edges) : new Set<string>()),
    [activeNode, edges]
  );
  const upstream = useMemo(
    () => (activeNode ? getUpstream(activeNode, edges) : new Set<string>()),
    [activeNode, edges]
  );
  const impactChain = useMemo(() => {
    const s = new Set<string>();
    downstream.forEach((id) => s.add(id));
    upstream.forEach((id) => s.add(id));
    if (activeNode) s.add(activeNode);
    return s;
  }, [downstream, upstream, activeNode]);

  const isInChain = useCallback(
    (id: string) => !activeNode || impactChain.has(id),
    [activeNode, impactChain]
  );

  const isEdgeActive = useCallback(
    (e: DepEdge) => {
      if (!activeNode) return true;
      return impactChain.has(e.from) && impactChain.has(e.to);
    },
    [activeNode, impactChain]
  );

  const nodeMap = useMemo(() => {
    const m = new Map<string, DepNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const selectedNodeData = selectedNode ? nodeMap.get(selectedNode) : null;

  const svgWidth = Math.max(
    800,
    Math.max(...Object.values(positions).map((p) => p.x)) + 160
  );
  const svgHeight = Math.max(
    450,
    Math.max(...Object.values(positions).map((p) => p.y)) + 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-[95vw] max-w-[1200px] max-h-[85vh] flex flex-col fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e5e5e5] shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#181818]">
              Dependency Graph — {clusterName}
            </h2>
            <p className="text-[12px] text-[#706e6b]">
              Click any component to see its blast radius. Highlighted nodes must also be updated if this component is modernized.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-3 mr-4">
              {Object.entries(typeColors).map(([type, c]) => (
                <div key={type} className="flex items-center gap-1 text-[10px] text-[#706e6b]">
                  <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: c.fill, borderColor: c.stroke }} />
                  {type}
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Graph */}
          <div className="flex-1 overflow-auto bg-[#fafaf9]">
            <svg width={svgWidth} height={svgHeight} className="select-none">
              <defs>
                <marker id="arrowActive" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="#0176d3" />
                </marker>
                <marker id="arrowDim" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="#c9c9c9" />
                </marker>
                <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="#ea001e" />
                </marker>
              </defs>

              {/* Edges */}
              {edges.map((edge, i) => {
                const from = positions[edge.from];
                const to = positions[edge.to];
                if (!from || !to) return null;
                const active = isEdgeActive(edge);
                const isImpactEdge =
                  activeNode &&
                  (downstream.has(edge.to) || downstream.has(edge.from)) &&
                  impactChain.has(edge.from) &&
                  impactChain.has(edge.to);

                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const cx = from.x + dx * 0.5;
                const cy = from.y + dy * 0.5 - Math.abs(dy) * 0.1;

                return (
                  <path
                    key={i}
                    d={`M ${from.x + 60} ${from.y + 20} Q ${cx + 30} ${cy + 20} ${to.x - 4} ${to.y + 20}`}
                    fill="none"
                    stroke={!active ? "#e5e5e5" : isImpactEdge ? "#ea001e" : "#0176d3"}
                    strokeWidth={!active ? 1 : isImpactEdge ? 2.5 : 1.5}
                    strokeDasharray={edge.type === "references" ? "4 3" : "none"}
                    markerEnd={!active ? "url(#arrowDim)" : isImpactEdge ? "url(#arrowRed)" : "url(#arrowActive)"}
                    opacity={active ? 1 : 0.25}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const pos = positions[node.id];
                if (!pos) return null;
                const tc = typeColors[node.type];
                const inChain = isInChain(node.id);
                const isSelected = node.id === selectedNode;
                const isDownstream = activeNode ? downstream.has(node.id) : false;
                const isSource = node.id === activeNode;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    opacity={inChain ? 1 : 0.2}
                    style={{ transition: "opacity 0.3s ease" }}
                  >
                    {/* Glow for selected */}
                    {isSource && (
                      <rect
                        x={-4}
                        y={-4}
                        width={128}
                        height={48}
                        rx={8}
                        fill="none"
                        stroke={recBorder[node.recommendation]}
                        strokeWidth={3}
                        opacity={0.6}
                      />
                    )}
                    {/* Impact indicator */}
                    {isDownstream && !isSource && (
                      <rect
                        x={-3}
                        y={-3}
                        width={126}
                        height={46}
                        rx={7}
                        fill="none"
                        stroke="#ea001e"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                      />
                    )}
                    {/* Node body */}
                    <rect
                      x={0}
                      y={0}
                      width={120}
                      height={40}
                      rx={6}
                      fill={tc.fill}
                      stroke={isSelected ? recBorder[node.recommendation] : tc.stroke}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {/* Recommendation dot */}
                    <circle
                      cx={112}
                      cy={8}
                      r={5}
                      fill={recBorder[node.recommendation]}
                    />
                    {/* Type icon */}
                    <text x={10} y={17} fontSize={10} fill={tc.stroke} fontWeight="bold">
                      {tc.icon}
                    </text>
                    {/* Label */}
                    <text x={30} y={18} fontSize={10.5} fill="#181818" fontWeight="600">
                      {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                    </text>
                    {/* Type tag */}
                    <text x={30} y={32} fontSize={9} fill="#706e6b">
                      {node.type}{node.methods ? ` · ${node.methods} methods` : ""}
                    </text>
                    {/* KEEP badge — "DO NOT TOUCH" */}
                    {node.recommendation === "Keep" && !activeNode && (
                      <g>
                        <rect x={18} y={42} width={84} height={16} rx={3} fill="#2e844a" />
                        <text x={60} y={53} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">🛡️ DO NOT TOUCH</text>
                      </g>
                    )}
                    {/* Modernize / Simplify benefit label */}
                    {node.recommendation === "Modernize" && !activeNode && (
                      <g>
                        <rect x={10} y={42} width={100} height={16} rx={3} fill="#0176d3" />
                        <text x={60} y={53} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">🔄 Migrate to Flow</text>
                      </g>
                    )}
                    {node.recommendation === "Simplify" && !activeNode && (
                      <g>
                        <rect x={18} y={42} width={84} height={16} rx={3} fill="#fe9339" />
                        <text x={60} y={53} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">✏️ REFACTOR</text>
                      </g>
                    )}
                    {node.recommendation === "Retire" && !activeNode && (
                      <g>
                        <rect x={25} y={42} width={70} height={16} rx={3} fill="#ea001e" />
                        <text x={60} y={53} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">🗑️ REMOVE</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side panel */}
          <div className="w-[280px] border-l border-[#e5e5e5] bg-white p-4 overflow-y-auto shrink-0">
            {selectedNodeData ? (
              <div className="fade-in space-y-4">
                <div>
                  <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">Selected Component</div>
                  <div className="text-[15px] font-semibold text-[#181818]">{selectedNodeData.label}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="slds-badge slds-badge-info">{selectedNodeData.type}</span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: `${recBorder[selectedNodeData.recommendation]}15`,
                        color: recBorder[selectedNodeData.recommendation],
                        borderColor: recBorder[selectedNodeData.recommendation],
                      }}
                    >
                      {selectedNodeData.recommendation}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#e5e5e5] pt-3">
                  <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2 font-semibold">Blast Radius</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#fde8e8] rounded p-2 text-center">
                      <div className="text-[18px] font-bold text-[#ea001e]">{downstream.size}</div>
                      <div className="text-[10px] text-[#706e6b]">Downstream</div>
                    </div>
                    <div className="bg-[#fef3e5] rounded p-2 text-center">
                      <div className="text-[18px] font-bold text-[#8c4b00]">{upstream.size}</div>
                      <div className="text-[10px] text-[#706e6b]">Upstream</div>
                    </div>
                  </div>
                </div>

                {downstream.size > 0 && (
                  <div className="border-t border-[#e5e5e5] pt-3">
                    <div className="text-[11px] text-[#ea001e] uppercase tracking-wide mb-2 font-semibold">
                      Impacted by Change ({downstream.size})
                    </div>
                    <div className="space-y-1.5">
                      {Array.from(downstream).map((id) => {
                        const n = nodeMap.get(id);
                        if (!n) return null;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between py-1.5 px-2 rounded border border-[#fde8e8] bg-[#fde8e8]/30 text-[12px]"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: recBorder[n.recommendation] }} />
                              <span className="font-medium text-[#181818]">{n.label}</span>
                            </div>
                            <span className="text-[10px] text-[#706e6b]">{n.type}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#ea001e] mt-2 leading-relaxed">
                      These components call or depend on <strong>{selectedNodeData.label}</strong>. If modernized, they must also be reviewed and potentially updated.
                    </p>
                  </div>
                )}

                {upstream.size > 0 && (
                  <div className="border-t border-[#e5e5e5] pt-3">
                    <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2 font-semibold">
                      Called By ({upstream.size})
                    </div>
                    <div className="space-y-1.5">
                      {Array.from(upstream).map((id) => {
                        const n = nodeMap.get(id);
                        if (!n) return null;
                        return (
                          <div key={id} className="flex items-center justify-between py-1.5 px-2 rounded bg-[#fafaf9] text-[12px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: recBorder[n.recommendation] }} />
                              <span className="font-medium text-[#181818]">{n.label}</span>
                            </div>
                            <span className="text-[10px] text-[#706e6b]">{n.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modernization benefit */}
                <div className="border-t border-[#e5e5e5] pt-3">
                  <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2 font-semibold">
                    {selectedNodeData.recommendation === "Keep" ? "Why Keep" : "Modernization Benefit"}
                  </div>
                  {selectedNodeData.recommendation === "Keep" && (
                    <div className="bg-[#e6f4ea] border border-[#2e844a]/20 rounded p-2.5">
                      <p className="text-[11px] text-[#2e844a] font-semibold mb-1">🛡️ Do Not Touch</p>
                      <p className="text-[11px] text-[#444] leading-relaxed">This component is well-structured with adequate test coverage. Changing it would introduce unnecessary risk with no architectural benefit.</p>
                    </div>
                  )}
                  {selectedNodeData.recommendation === "Simplify" && (
                    <div className="bg-[#fef3e5] border border-[#fe9339]/20 rounded p-2.5">
                      <p className="text-[11px] text-[#8c4b00] font-semibold mb-1">✏️ Refactor Benefits</p>
                      <p className="text-[11px] text-[#444] leading-relaxed">Consolidating this component reduces entry point sprawl, improves AI agent reasoning, and lowers maintenance overhead. The {downstream.size} downstream dependencies will need interface updates.</p>
                    </div>
                  )}
                  {selectedNodeData.recommendation === "Modernize" && (
                    <div className="bg-[#e5f1fd] border border-[#0176d3]/20 rounded p-2.5">
                      <p className="text-[11px] text-[#0176d3] font-semibold mb-1">🔄 Migration Benefits</p>
                      <p className="text-[11px] text-[#444] leading-relaxed">Moving to Flow/Orchestration enables Agentforce to directly introspect this logic via metadata. Eliminates black-box Apex for rules-based patterns. {downstream.size > 0 ? `Note: ${downstream.size} dependent component${downstream.size > 1 ? "s" : ""} will need updated invocation patterns.` : ""}</p>
                    </div>
                  )}
                  {selectedNodeData.recommendation === "Retire" && (
                    <div className="bg-[#fde8e8] border border-[#ea001e]/20 rounded p-2.5">
                      <p className="text-[11px] text-[#ea001e] font-semibold mb-1">🗑️ Safe to Remove</p>
                      <p className="text-[11px] text-[#444] leading-relaxed">Zero active invocations in 90+ days. Removing this component reduces noise for AI analysis and shrinks the org footprint with no functional impact.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-[32px] mb-3">🔗</div>
                <div className="text-[13px] font-semibold text-[#181818] mb-1">Select a Component</div>
                <p className="text-[12px] text-[#706e6b] leading-relaxed">
                  Click any node in the graph to see its full dependency chain, blast radius, and modernization impact.
                </p>
                <div className="mt-6 space-y-2 text-left">
                  <div className="text-[11px] text-[#706e6b] uppercase tracking-wide font-semibold">Legend</div>
                  {(["Keep", "Simplify", "Modernize", "Retire"] as const).map((r) => (
                    <div key={r} className="flex items-center gap-2 text-[11px]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: recBorder[r] }} />
                      <span className="text-[#444]">{r}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#e5e5e5] pt-2 mt-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#706e6b]">
                      <span className="w-4 border-t-2 border-[#ea001e] border-dashed" />
                      Impact boundary (needs update)
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#706e6b] mt-1">
                      <span className="w-4 border-t-2 border-[#0176d3]" />
                      Dependency relationship
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
