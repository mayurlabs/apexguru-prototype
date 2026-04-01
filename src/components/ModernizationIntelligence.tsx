"use client";

import React, { useState, useEffect } from "react";
import {
  modIntelSummary,
  legacyClusters,
  modPhases,
  depGraphsByCluster,
  LegacyCluster,
} from "@/lib/data";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DependencyGraph from "@/components/DependencyGraph";

interface ModernizationIntelligenceProps {
  onBack: () => void;
}

function AIReadinessGauge({ score, animated }: { score: number; animated: boolean }) {
  const radius = 65;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const getColor = (s: number) => {
    if (s >= 80) return "#2e844a";
    if (s >= 60) return "#fe9339";
    return "#ea001e";
  };
  const getLabel = (s: number) => {
    if (s >= 80) return "AI-Ready";
    if (s >= 60) return "Needs Work";
    return "Not Ready";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="#e5e5e5" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 15 85 A 65 65 0 0 1 145 85"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        <text x="80" y="72" textAnchor="middle" className="text-[28px] font-bold" fill={getColor(score)}>{score}</text>
        <text x="80" y="90" textAnchor="middle" className="text-[11px]" fill="#706e6b">{getLabel(score)}</text>
      </svg>
    </div>
  );
}

const recColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Keep: { bg: "#e6f4ea", text: "#2e844a", border: "#2e844a", label: "🟢 Keep in Apex" },
  Simplify: { bg: "#fef3e5", text: "#8c4b00", border: "#fe9339", label: "🟡 Simplify" },
  Modernize: { bg: "#e5f1fd", text: "#0176d3", border: "#0176d3", label: "🔵 Modernize to Flow" },
  Retire: { bg: "#fde8e8", text: "#ea001e", border: "#ea001e", label: "🔴 Retire" },
};

const riskColors: Record<string, string> = {
  High: "slds-badge-error",
  Medium: "slds-badge-warning",
  Low: "slds-badge-success",
};

export default function ModernizationIntelligence({ onBack }: ModernizationIntelligenceProps) {
  const [activeTab, setActiveTab] = useState("map");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(true);
  const [depGraphCluster, setDepGraphCluster] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const s = modIntelSummary;
  const pieData = [
    { name: "Keep", value: s.keepPercent, color: "#2e844a" },
    { name: "Simplify", value: s.simplifyPercent, color: "#fe9339" },
    { name: "Modernize", value: s.modernizePercent, color: "#0176d3" },
    { name: "Retire", value: s.retirePercent, color: "#ea001e" },
  ];

  const clustersByRec = (rec: string) => legacyClusters.filter((c) => c.recommendation === rec);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>Modernization Intelligence</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#032d60] to-[#0176d3] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">
              Salesforce Modernization Intelligence
            </h1>
            <div className="text-[12px] text-[#706e6b]">
              Identify what to keep, simplify, modernize, or retire — making your org AI-ready
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="slds-btn"
            onClick={() => {
              setScanning(true);
              setScanned(false);
              setTimeout(() => { setScanning(false); setScanned(true); }, 2500);
            }}
          >
            {scanning ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M12 2a10 10 0 0110 10" /></svg>
                Scanning Org...
              </span>
            ) : "🔄 Rescan Org"}
          </button>
          <button className="slds-btn slds-btn-brand">
            📋 Export Modernization Plan
          </button>
        </div>
      </div>

      {/* Dependency Graph Modal */}
      {depGraphCluster && depGraphsByCluster[depGraphCluster] && (
        <DependencyGraph
          nodes={depGraphsByCluster[depGraphCluster].nodes}
          edges={depGraphsByCluster[depGraphCluster].edges}
          clusterName={legacyClusters.find((c) => c.id === depGraphCluster)?.name || ""}
          onClose={() => setDepGraphCluster(null)}
        />
      )}

      {/* Tabs */}
      <div className="slds-tabs mb-5">
        {[
          { key: "map", label: "Modernization Map" },
          { key: "clusters", label: "Legacy Clusters" },
          { key: "dependencies", label: "Dependencies" },
          { key: "ai-readiness", label: "AI-Readiness" },
          { key: "plan", label: "Phased Plan" },
        ].map((tab) => (
          <div
            key={tab.key}
            className={`slds-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ========= TAB: Modernization Map ========= */}
      {activeTab === "map" && (
        <div className="space-y-5 fade-in">
          {/* Hero summary */}
          <div className="slds-card p-6">
            <div className="grid grid-cols-[1fr_200px_1fr] gap-6">
              {/* Left: Key metrics */}
              <div>
                <div className="text-[13px] font-semibold text-[#3e3e3c] mb-3">Org Customization Estate</div>
                <div className="space-y-2.5">
                  {[
                    { label: "Total Customizations", value: s.totalCustomizations.toLocaleString() },
                    { label: "Apex Classes", value: "1,247" },
                    { label: "Flows", value: "384" },
                    { label: "Triggers", value: "89" },
                    { label: "Legacy Clusters Identified", value: s.legacyClusters, highlight: true },
                    { label: "Duplicate Logic Clusters", value: s.duplicateLogicClusters, highlight: true },
                    { label: "Deprecated API References", value: s.deprecatedApis, highlight: true },
                    { label: "Unused Methods", value: s.unusedMethods, highlight: true },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center text-[12px]">
                      <span className="text-[#706e6b]">{row.label}</span>
                      <span className={`font-semibold ${row.highlight ? "text-[#ea001e]" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center: Pie chart */}
              <div className="flex flex-col items-center border-x border-[#e5e5e5] px-4">
                <div className="text-[13px] font-semibold text-[#3e3e3c] mb-2">Modernization Map</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e5e5", borderRadius: 4 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1 w-full">
                  {pieData.map((e) => (
                    <div key={e.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                        <span className="text-[#706e6b]">{e.name}</span>
                      </div>
                      <span className="font-semibold">{e.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: AI-Readiness */}
              <div className="flex flex-col items-center">
                <div className="text-[13px] font-semibold text-[#3e3e3c] mb-2">AI-Readiness Score</div>
                <AIReadinessGauge score={s.aiReadinessScore} animated={animated} />
                <div className="mt-3 space-y-1.5 w-full">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#706e6b]">Dependency Sprawl</span>
                    <span className="text-[#ea001e] font-semibold">{s.dependencySprawlScore}%</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#706e6b]">Avg Automation Density</span>
                    <span className="text-[#fe9339] font-semibold">{s.automationDensityAvg} per object</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#706e6b]">Est. Effort to Modernize</span>
                    <span className="font-semibold">{s.estimatedEffortWeeks} weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation breakdown */}
          <div className="grid grid-cols-4 gap-4">
            {(["Keep", "Simplify", "Modernize", "Retire"] as const).map((rec) => {
              const c = recColors[rec];
              const clusters = clustersByRec(rec);
              return (
                <div key={rec} className="slds-card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("clusters")}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border" style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>
                      {c.label}
                    </span>
                  </div>
                  <div className="text-[28px] font-bold leading-none" style={{ color: c.text }}>
                    {rec === "Keep" ? s.keepPercent : rec === "Simplify" ? s.simplifyPercent : rec === "Modernize" ? s.modernizePercent : s.retirePercent}%
                  </div>
                  <div className="text-[11px] text-[#706e6b] mt-1">
                    {clusters.length} cluster{clusters.length !== 1 ? "s" : ""} · {clusters.reduce((a, c2) => a + c2.componentCount, 0)} components
                  </div>
                  <div className="mt-2 text-[11px] text-[#444] leading-relaxed">
                    {rec === "Keep" && "Well-structured code — retaining in Apex due to transactional complexity"}
                    {rec === "Simplify" && "Legacy patterns — consolidate entry points, reduce trigger/flow sprawl"}
                    {rec === "Modernize" && "Strong candidates for migration to Flow, Orchestration, or platform-native patterns"}
                    {rec === "Retire" && "Unused, redundant, or deprecated — safe to remove based on usage analysis"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic context */}
          <div className="slds-card p-5 bg-[#f0ecff] border-[#5849be]/20">
            <div className="flex items-start gap-3">
              <span className="text-[20px] mt-0.5">🤖</span>
              <div>
                <div className="text-[13px] font-semibold text-[#3e3e3c] mb-1">
                  Why Modernization Matters for AI-Readiness
                </div>
                <p className="text-[12px] text-[#444] leading-relaxed">
                  As Salesforce expands agentic development through Agentforce and MCP-based tooling, the quality of your org&apos;s architecture directly impacts AI effectiveness. Orgs with cleaner, more intentional architectures benefit from better agent reasoning, higher-confidence AI-generated code, and more reliable automated workflows. Legacy sprawl creates ambiguity that reduces trust in AI outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========= TAB: Legacy Clusters ========= */}
      {activeTab === "clusters" && (
        <div className="space-y-4 fade-in">
          <div className="slds-card">
            <div className="px-4 py-3 border-b border-[#e5e5e5] bg-[#fafaf9]">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#181818]">
                  Legacy Clusters ({legacyClusters.length})
                </h3>
                <div className="flex gap-2">
                  {(["All", "Keep", "Simplify", "Modernize", "Retire"] as const).map((filter) => (
                    <button key={filter} className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${filter === "All" ? "bg-[#0176d3] text-white" : "bg-white text-[#444] border border-[#c9c9c9] hover:bg-[#f3f3f3]"}`}>
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#e5e5e5]">
              {legacyClusters.map((cluster) => {
                const c = recColors[cluster.recommendation];
                const isExpanded = expandedCluster === cluster.id;
                return (
                  <div key={cluster.id} className="px-5 py-4">
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[15px] font-semibold text-[#181818]">{cluster.name}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border" style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>
                            {c.label}
                          </span>
                          <span className={`slds-badge ${riskColors[cluster.risk]}`}>
                            {cluster.risk} Risk
                          </span>
                          {cluster.automationDensity === "High" && (
                            <span className="slds-badge slds-badge-warning">High Density</span>
                          )}
                        </div>
                        <div className="flex gap-4 text-[11px] text-[#706e6b]">
                          <span>Objects: {cluster.objects.join(", ")}</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-[11px]">
                          <span className="text-[#444]"><strong>{cluster.componentCount}</strong> components</span>
                          <span className="text-[#444]"><strong>{cluster.triggerCount}</strong> triggers</span>
                          <span className="text-[#444]"><strong>{cluster.flowCount}</strong> flows</span>
                          <span className="text-[#444]"><strong>{cluster.apexCount}</strong> Apex</span>
                          <span className="text-[#ea001e]"><strong>{cluster.entryPoints}</strong> entry points</span>
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#706e6b" strokeWidth="2" className={`transition-transform mt-1 shrink-0 ${isExpanded ? "rotate-90" : ""}`}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 ml-0 p-5 bg-[#fafaf9] rounded-lg border border-[#e5e5e5] fade-in space-y-4">
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1.5 font-semibold">Rationale</div>
                            <p className="text-[12.5px] text-[#444] leading-relaxed">{cluster.rationale}</p>
                          </div>
                          <div>
                            <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1.5 font-semibold">AI-Readiness Impact</div>
                            <p className="text-[12.5px] text-[#444] leading-relaxed">{cluster.aiReadinessImpact}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-[#e5e5e5]">
                            <div className="text-[11px] text-[#706e6b] mb-1">Estimated Effort</div>
                            <div className="text-[14px] font-semibold text-[#181818]">{cluster.effort}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-[#e5e5e5]">
                            <div className="text-[11px] text-[#706e6b] mb-1">Migration Risk</div>
                            <div className={`text-[14px] font-semibold ${cluster.risk === "High" ? "text-[#ea001e]" : cluster.risk === "Medium" ? "text-[#fe9339]" : "text-[#2e844a]"}`}>{cluster.risk}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-[#e5e5e5]">
                            <div className="text-[11px] text-[#706e6b] mb-1">Entry Points (Goal: 1)</div>
                            <div className={`text-[14px] font-semibold ${cluster.entryPoints > 3 ? "text-[#ea001e]" : "text-[#2e844a]"}`}>{cluster.entryPoints}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="slds-btn slds-btn-brand text-[12px]">Begin Modernization</button>
                          <button
                            className="slds-btn text-[12px]"
                            onClick={(e) => { e.stopPropagation(); setDepGraphCluster(cluster.id); }}
                          >
                            🔗 View Dependencies
                          </button>
                          <button className="slds-btn text-[12px]">View Components</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========= TAB: Dependencies ========= */}
      {activeTab === "dependencies" && (
        <div className="space-y-5 fade-in">
          <div className="slds-card p-5">
            <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Dependency Analysis</h3>
            <p className="text-[12px] text-[#706e6b] mb-4">
              Visualize how components depend on each other within each cluster. Select a cluster to explore its dependency graph and understand the blast radius of modernization changes.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {legacyClusters.map((cluster) => {
                const c = recColors[cluster.recommendation];
                const hasGraph = !!depGraphsByCluster[cluster.id];
                return (
                  <button
                    key={cluster.id}
                    onClick={() => hasGraph && setDepGraphCluster(cluster.id)}
                    className={`slds-card p-4 text-left transition-all ${hasGraph ? "cursor-pointer hover:shadow-md hover:border-[#0176d3]" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-[#181818]">{cluster.name}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border" style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>
                        {cluster.recommendation}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#706e6b] mb-2">
                      <span>{cluster.componentCount} components</span>
                      <span>{cluster.entryPoints} entry points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasGraph ? (
                        <span className="text-[11px] text-[#0176d3] font-medium">🔗 View dependency graph →</span>
                      ) : (
                        <span className="text-[11px] text-[#706e6b]">Graph analysis pending</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Why dependency analysis matters */}
          <div className="slds-card p-5 bg-[#fef3e5] border-[#fe9339]/20">
            <div className="flex items-start gap-3">
              <span className="text-[20px] mt-0.5">🔗</span>
              <div>
                <div className="text-[13px] font-semibold text-[#3e3e3c] mb-1">
                  Why Dependency Analysis Matters for Modernization
                </div>
                <p className="text-[12px] text-[#444] leading-relaxed">
                  When you modernize a component — whether consolidating triggers, migrating to Flow, or retiring unused code — every component that depends on it must also be reviewed. The dependency graph reveals the full <strong>blast radius</strong> of any change: if OrderValidator is modernized to a Flow, every class that calls OrderValidator must update its invocation pattern. Without this view, modernization creates hidden breakage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========= TAB: AI-Readiness ========= */}
      {activeTab === "ai-readiness" && (
        <div className="space-y-5 fade-in">
          <div className="slds-card p-6">
            <div className="grid grid-cols-[280px_1fr] gap-8">
              <div className="flex flex-col items-center border-r border-[#e5e5e5] pr-6">
                <div className="text-[14px] font-semibold text-[#3e3e3c] mb-3">AI-Readiness Score</div>
                <AIReadinessGauge score={s.aiReadinessScore} animated={animated} />
                <p className="text-[11px] text-[#706e6b] text-center mt-3 leading-relaxed">
                  Measures how well your org&apos;s architecture supports AI-assisted development via Agentforce and MCP tooling
                </p>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#3e3e3c] mb-4">Score Breakdown</div>
                <div className="space-y-4">
                  {[
                    { label: "Architecture Clarity", score: 52, desc: "Multiple entry points per object reduce agent reasoning confidence", weight: "30%" },
                    { label: "Dependency Health", score: 45, desc: "High dependency sprawl creates ambiguous execution paths for AI", weight: "25%" },
                    { label: "Automation Density", score: 60, desc: "Average 3.4 automations per object — target is < 2 for clean AI context", weight: "20%" },
                    { label: "Code Quality", score: 72, desc: "Moderate anti-pattern density — AI-generated code confidence is affected", weight: "15%" },
                    { label: "Platform Alignment", score: 65, desc: "Some logic better suited for declarative patterns (Flow, Orchestration)", weight: "10%" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#181818]">{item.label}</span>
                          <span className="text-[10px] text-[#706e6b]">({item.weight})</span>
                        </div>
                        <span className={`font-bold ${item.score >= 70 ? "text-[#2e844a]" : item.score >= 55 ? "text-[#fe9339]" : "text-[#ea001e]"}`}>{item.score}/100</span>
                      </div>
                      <div className="h-[8px] bg-[#e5e5e5] rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${item.score >= 70 ? "bg-[#2e844a]" : item.score >= 55 ? "bg-[#fe9339]" : "bg-[#ea001e]"}`}
                          style={{ width: animated ? `${item.score}%` : "0%" }}
                        />
                      </div>
                      <div className="text-[11px] text-[#706e6b]">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* What this means */}
          <div className="grid grid-cols-2 gap-5">
            <div className="slds-card p-5">
              <h3 className="text-[14px] font-semibold text-[#ea001e] mb-3">Current Friction Points</h3>
              <div className="space-y-2.5">
                {[
                  "AI agents cannot reliably predict execution order across 7 entry points on Order object",
                  "Redundant logic in 7 clusters creates conflicting patterns for AI code generation",
                  "Low-confidence AI output (avg 64%) correlates with high automation density areas",
                  "Deprecated API references block AI from using latest platform capabilities",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-[#444]">
                    <span className="text-[#ea001e] mt-0.5">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="slds-card p-5">
              <h3 className="text-[14px] font-semibold text-[#2e844a] mb-3">After Modernization (Projected)</h3>
              <div className="space-y-2.5">
                {[
                  "AI-Readiness Score improves from 58 → 78 (+20 points)",
                  "Entry points reduced from avg 5.2 → 1.5 per object",
                  "AI code generation confidence improves to 82% avg",
                  "Agentforce can introspect declarative patterns directly via metadata",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-[#444]">
                    <span className="text-[#2e844a] mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========= TAB: Phased Plan ========= */}
      {activeTab === "plan" && (
        <div className="space-y-5 fade-in">
          {/* Timeline overview */}
          <div className="slds-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#181818]">Modernization Roadmap</h3>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="text-[#706e6b]">Total estimated effort:</span>
                <span className="font-bold text-[#0176d3]">{s.estimatedEffortWeeks} weeks</span>
                <span className="text-[#706e6b]">Projected CRI improvement:</span>
                <span className="font-bold text-[#2e844a]">+20 points</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1 mb-2">
              <div className="h-[8px] bg-[#ea001e] rounded-l-full" style={{ width: "15%" }} title="Retire" />
              <div className="h-[8px] bg-[#fe9339]" style={{ width: "35%" }} title="Simplify" />
              <div className="h-[8px] bg-[#0176d3] rounded-r-full" style={{ width: "50%" }} title="Modernize" />
            </div>
            <div className="flex justify-between text-[10px] text-[#706e6b]">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Week 6</span><span>Week 7</span><span>Week 8</span>
            </div>
          </div>

          {/* Phases */}
          {modPhases.map((phase, pi) => (
            <div key={pi} className="slds-card">
              <div className={`px-5 py-3 border-b border-[#e5e5e5] flex items-center justify-between ${pi === 0 ? "bg-[#fde8e8]" : pi === 1 ? "bg-[#fef3e5]" : "bg-[#e5f1fd]"}`}>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#181818]">{phase.phase}</h3>
                  <span className="text-[11px] text-[#706e6b]">{phase.timeline}</span>
                </div>
                <span className="text-[12px] font-semibold text-[#2e844a]">
                  +{phase.items.reduce((a, it) => a + parseInt(it.criImpact.replace("+", "")), 0)} CRI points
                </span>
              </div>
              <div className="divide-y divide-[#e5e5e5]">
                {phase.items.map((item, ii) => {
                  const ac = recColors[item.action] || recColors["Simplify"];
                  return (
                    <div key={ii} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border" style={{ backgroundColor: ac.bg, color: ac.text, borderColor: ac.border }}>
                          {item.action}
                        </span>
                        <span className="text-[13px] text-[#181818]">{item.target}</span>
                      </div>
                      <div className="flex items-center gap-6 text-[12px] shrink-0">
                        <span className="text-[#706e6b]">{item.effort}</span>
                        <span className="text-[#2e844a] font-semibold">{item.criImpact} CRI</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Key principles */}
          <div className="slds-card p-5">
            <h3 className="text-[14px] font-semibold text-[#181818] mb-3">Guiding Principles</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Not \"Move Everything to No-Code\"", desc: "Each area is evaluated on its own merits. Complex transactional logic stays in Apex. Rules-based logic moves to Flow. Dead code gets retired." },
                { title: "Least-Custom-Code Architecture", desc: "The goal is reducing unnecessary customization while preserving control, performance, and business intent — aligned with Salesforce Well-Architected principles." },
                { title: "Advisor First, Automate Later", desc: "V1 produces a modernization map with recommendations and phased plan. Autonomous conversion comes after the product proves trustworthy decision-making." },
              ].map((p, i) => (
                <div key={i} className="bg-[#fafaf9] rounded-lg p-4 border border-[#e5e5e5]">
                  <div className="text-[12px] font-semibold text-[#181818] mb-1.5">{p.title}</div>
                  <div className="text-[11px] text-[#706e6b] leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
