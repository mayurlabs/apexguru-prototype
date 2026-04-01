"use client";

import React, { useState } from "react";
import { LegacyCluster, depGraphsByCluster, DepNode } from "@/lib/data";

interface ComponentInventoryProps {
  cluster: LegacyCluster;
  onClose: () => void;
}

const recConfig: Record<string, { bg: string; text: string; icon: string; action: string; detail: string }> = {
  Keep: { bg: "#e6f4ea", text: "#2e844a", icon: "🛡️", action: "NO CHANGE", detail: "Well-structured. Preserve as-is during modernization." },
  Simplify: { bg: "#fef3e5", text: "#8c4b00", icon: "✏️", action: "REFACTOR", detail: "Needs cleanup — consolidate logic, reduce complexity." },
  Modernize: { bg: "#e5f1fd", text: "#0176d3", icon: "🔄", action: "MIGRATE", detail: "Move to declarative pattern (Flow / Orchestration)." },
  Retire: { bg: "#fde8e8", text: "#ea001e", icon: "🗑️", action: "REMOVE", detail: "Unused or redundant. Safe to delete." },
};

export default function ComponentInventory({ cluster, onClose }: ComponentInventoryProps) {
  const [filter, setFilter] = useState<string>("All");
  const graph = depGraphsByCluster[cluster.id];
  const nodes: DepNode[] = graph?.nodes || [];
  const filtered = filter === "All" ? nodes : nodes.filter((n) => n.recommendation === filter);

  const counts = {
    Keep: nodes.filter((n) => n.recommendation === "Keep").length,
    Simplify: nodes.filter((n) => n.recommendation === "Simplify").length,
    Modernize: nodes.filter((n) => n.recommendation === "Modernize").length,
    Retire: nodes.filter((n) => n.recommendation === "Retire").length,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[900px] max-h-[85vh] flex flex-col fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5e5e5] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[#181818]">Component Inventory — {cluster.name}</h2>
              <p className="text-[12px] text-[#706e6b]">{nodes.length} components across {cluster.objects.join(", ")}</p>
            </div>
            <button onClick={onClose} className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Summary bar */}
        <div className="px-5 py-3 border-b border-[#e5e5e5] bg-[#fafaf9] flex items-center gap-3 shrink-0">
          {(["All", "Keep", "Simplify", "Modernize", "Retire"] as const).map((f) => {
            const count = f === "All" ? nodes.length : counts[f as keyof typeof counts];
            const cfg = f !== "All" ? recConfig[f] : null;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[11px] font-medium transition-all ${filter === f ? "bg-[#0176d3] text-white border border-[#0176d3]" : "bg-white text-[#444] border border-[#c9c9c9] hover:bg-[#f3f3f3]"}`}
              >
                {cfg && <span>{cfg.icon}</span>}
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="slds-table">
            <thead>
              <tr>
                <th style={{ width: "28px" }}></th>
                <th>Component</th>
                <th>Type</th>
                <th>Methods</th>
                <th>Called By</th>
                <th>Status</th>
                <th>Action Required</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((node) => {
                const cfg = recConfig[node.recommendation];
                const isKeep = node.recommendation === "Keep";
                return (
                  <tr key={node.id} className={isKeep ? "bg-[#e6f4ea]/30" : ""}>
                    <td>
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: cfg.text }} />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-[#0176d3] font-medium text-[13px]">{node.label}</span>
                        {isKeep && (
                          <span className="text-[9px] font-bold text-[#2e844a] bg-[#e6f4ea] px-1.5 py-0.5 rounded border border-[#2e844a]/30">SAFE</span>
                        )}
                      </div>
                    </td>
                    <td><span className="slds-badge slds-badge-info">{node.type}</span></td>
                    <td className="text-[12px]">{node.methods || "—"}</td>
                    <td className="text-[12px]">{node.calledBy || 0}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                        {cfg.icon} {cfg.action}
                      </span>
                    </td>
                    <td className="text-[11px] text-[#706e6b] max-w-[220px]">{cfg.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-5 py-3 border-t border-[#e5e5e5] bg-[#fafaf9] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-[11px]">
              <span className="text-[#2e844a]"><strong>{counts.Keep}</strong> safe (no change)</span>
              <span className="text-[#8c4b00]"><strong>{counts.Simplify}</strong> to refactor</span>
              <span className="text-[#0176d3]"><strong>{counts.Modernize}</strong> to migrate</span>
              <span className="text-[#ea001e]"><strong>{counts.Retire}</strong> to remove</span>
            </div>
            <button onClick={onClose} className="slds-btn text-[12px]">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
