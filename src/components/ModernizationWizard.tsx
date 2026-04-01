"use client";

import React, { useState } from "react";
import { LegacyCluster, depGraphsByCluster, DepNode } from "@/lib/data";

interface ModernizationWizardProps {
  cluster: LegacyCluster;
  onClose: () => void;
}

const stepLabels = [
  "Review Scope",
  "Your Preferences",
  "Impact Preview",
  "Action Plan",
  "Confirm",
];

export default function ModernizationWizard({ cluster, onClose }: ModernizationWizardProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    approach: "balanced",
    target: cluster.recommendation === "Modernize" ? "flow" : "framework",
    includeTests: true,
    sandboxFirst: true,
    notifyTeam: true,
    autoRetireUnused: false,
    batchSize: "incremental",
  });
  const [confirmed, setConfirmed] = useState(false);

  const graph = depGraphsByCluster[cluster.id];
  const nodes: DepNode[] = graph?.nodes || [];
  const keepNodes = nodes.filter((n) => n.recommendation === "Keep");
  const changeNodes = nodes.filter((n) => n.recommendation !== "Keep");

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[820px] max-h-[85vh] flex flex-col fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e5e5] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-[#181818]">
              Begin Modernization — {cluster.name}
            </h2>
            <button onClick={onClose} className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-1">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-bold ${i <= step ? "bg-[#0176d3] text-white" : "bg-[#e5e5e5] text-[#706e6b]"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[11px] ${i <= step ? "text-[#0176d3] font-semibold" : "text-[#706e6b]"}`}>{label}</span>
                </div>
                {i < 4 && <div className={`flex-1 h-[2px] mx-1 ${i < step ? "bg-[#0176d3]" : "bg-[#e5e5e5]"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: Review Scope */}
          {step === 0 && (
            <div className="fade-in space-y-5">
              <div>
                <h3 className="text-[14px] font-semibold text-[#181818] mb-1">What will be modernized</h3>
                <p className="text-[12px] text-[#706e6b]">Review the components in scope and the recommended approach for this cluster.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#e5e5e5] rounded-lg p-4">
                  <div className="text-[12px] font-semibold text-[#181818] mb-2">Cluster Summary</div>
                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex justify-between"><span className="text-[#706e6b]">Objects</span><span>{cluster.objects.join(", ")}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Total Components</span><span className="font-semibold">{cluster.componentCount}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Triggers</span><span>{cluster.triggerCount}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Flows</span><span>{cluster.flowCount}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Apex Classes</span><span>{cluster.apexCount}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Entry Points</span><span className="text-[#ea001e] font-semibold">{cluster.entryPoints}</span></div>
                  </div>
                </div>
                <div className="border border-[#e5e5e5] rounded-lg p-4">
                  <div className="text-[12px] font-semibold text-[#181818] mb-2">Modernization Scope</div>
                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex justify-between"><span className="text-[#706e6b]">Recommendation</span><span className="font-semibold" style={{ color: cluster.recommendation === "Modernize" ? "#0176d3" : "#fe9339" }}>{cluster.recommendation}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Components to Change</span><span className="text-[#ea001e] font-semibold">{changeNodes.length}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Components Untouched</span><span className="text-[#2e844a] font-semibold">{keepNodes.length}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Estimated Effort</span><span className="font-semibold">{cluster.effort}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Migration Risk</span><span className={cluster.risk === "High" ? "text-[#ea001e] font-semibold" : "text-[#fe9339] font-semibold"}>{cluster.risk}</span></div>
                  </div>
                </div>
              </div>

              {/* Safe zone */}
              {keepNodes.length > 0 && (
                <div className="border border-[#2e844a] bg-[#e6f4ea] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px]">🛡️</span>
                    <span className="text-[12px] font-bold text-[#2e844a] uppercase tracking-wide">Safe Zone — Do Not Touch</span>
                  </div>
                  <p className="text-[11px] text-[#444] mb-2">These components are well-structured and should remain unchanged during modernization:</p>
                  <div className="flex flex-wrap gap-2">
                    {keepNodes.map((n) => (
                      <span key={n.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border border-[#2e844a]/30 text-[11px] font-medium text-[#2e844a]">
                        🟢 {n.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 1 && (
            <div className="fade-in space-y-5">
              <div>
                <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Your Modernization Preferences</h3>
                <p className="text-[12px] text-[#706e6b]">Tell us how you want the modernization to be handled. We will tailor the plan accordingly.</p>
              </div>

              {/* Approach */}
              <div>
                <label className="text-[11px] font-bold text-[#3e3e3c] uppercase tracking-wide block mb-2">Approach</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "conservative", label: "Conservative", desc: "Minimal changes. Only fix critical issues. Preserve existing patterns." },
                    { key: "balanced", label: "Balanced", desc: "Modernize where clear benefit exists. Preserve stable components." },
                    { key: "aggressive", label: "Aggressive", desc: "Maximum modernization. Migrate all eligible components to platform-native patterns." },
                  ].map((opt) => (
                    <button key={opt.key} onClick={() => setPreferences((p) => ({ ...p, approach: opt.key }))} className={`p-3 rounded-lg border text-left transition-all ${preferences.approach === opt.key ? "border-[#0176d3] bg-[#e5f1fd] shadow-[0_0_0_1px_#0176d3]" : "border-[#e5e5e5] hover:border-[#c9c9c9]"}`}>
                      <div className="text-[12px] font-semibold text-[#181818] mb-1">{opt.label}</div>
                      <div className="text-[11px] text-[#706e6b] leading-relaxed">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Migration Target */}
              <div>
                <label className="text-[11px] font-bold text-[#3e3e3c] uppercase tracking-wide block mb-2">Migration Target</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "framework", label: "Trigger Framework", desc: "Consolidate triggers into a single handler framework (Apex-native)" },
                    { key: "flow", label: "Flow + Orchestration", desc: "Migrate rules-based logic to declarative Flow with Orchestration" },
                    { key: "hybrid", label: "Hybrid", desc: "Use Flow for simple logic, keep Apex for complex transactional patterns" },
                  ].map((opt) => (
                    <button key={opt.key} onClick={() => setPreferences((p) => ({ ...p, target: opt.key }))} className={`p-3 rounded-lg border text-left transition-all ${preferences.target === opt.key ? "border-[#0176d3] bg-[#e5f1fd] shadow-[0_0_0_1px_#0176d3]" : "border-[#e5e5e5] hover:border-[#c9c9c9]"}`}>
                      <div className="text-[12px] font-semibold text-[#181818] mb-1">{opt.label}</div>
                      <div className="text-[11px] text-[#706e6b] leading-relaxed">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deployment */}
              <div>
                <label className="text-[11px] font-bold text-[#3e3e3c] uppercase tracking-wide block mb-2">Deployment Strategy</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "incremental", label: "Incremental", desc: "Deploy changes component by component with validation gates" },
                    { key: "batch", label: "Batch", desc: "Deploy all changes in a single release after full sandbox validation" },
                  ].map((opt) => (
                    <button key={opt.key} onClick={() => setPreferences((p) => ({ ...p, batchSize: opt.key }))} className={`p-3 rounded-lg border text-left transition-all ${preferences.batchSize === opt.key ? "border-[#0176d3] bg-[#e5f1fd] shadow-[0_0_0_1px_#0176d3]" : "border-[#e5e5e5] hover:border-[#c9c9c9]"}`}>
                      <div className="text-[12px] font-semibold text-[#181818] mb-1">{opt.label}</div>
                      <div className="text-[11px] text-[#706e6b] leading-relaxed">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: "sandboxFirst" as const, label: "Validate in sandbox before production", desc: "Run all changes through sandbox with automated testing" },
                  { key: "includeTests" as const, label: "Auto-generate updated test classes", desc: "Generate new Apex tests for modified components" },
                  { key: "notifyTeam" as const, label: "Notify component owners", desc: "Send notifications to teams who own affected components" },
                  { key: "autoRetireUnused" as const, label: "Auto-retire unused methods", desc: "Automatically remove methods with zero invocations (90+ days)" },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between py-2 px-3 rounded-lg border border-[#e5e5e5]">
                    <div>
                      <div className="text-[12px] font-medium text-[#181818]">{toggle.label}</div>
                      <div className="text-[11px] text-[#706e6b]">{toggle.desc}</div>
                    </div>
                    <button onClick={() => setPreferences((p) => ({ ...p, [toggle.key]: !p[toggle.key] }))} className={`relative w-[44px] h-[22px] rounded-full transition-colors shrink-0 ${preferences[toggle.key] ? "bg-[#0176d3]" : "bg-[#c9c9c9]"}`}>
                      <span className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-all ${preferences[toggle.key] ? "left-[24px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Impact Preview */}
          {step === 2 && (
            <div className="fade-in space-y-5">
              <div>
                <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Impact Preview</h3>
                <p className="text-[12px] text-[#706e6b]">Based on your preferences, here is the projected impact of the modernization.</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Before */}
                <div className="border border-[#ea001e]/30 rounded-lg overflow-hidden">
                  <div className="bg-[#fde8e8] px-4 py-2">
                    <span className="text-[12px] font-bold text-[#ea001e]">Current Architecture</span>
                  </div>
                  <div className="p-4 space-y-2 text-[12px]">
                    <div className="flex justify-between"><span className="text-[#706e6b]">Entry Points</span><span className="text-[#ea001e] font-bold">{cluster.entryPoints}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Automation Density</span><span className="text-[#ea001e] font-bold">High</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">AI-Readiness</span><span className="text-[#ea001e] font-bold">Low</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Redundant Logic</span><span className="text-[#ea001e] font-bold">Yes</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Trigger Sprawl</span><span className="text-[#ea001e] font-bold">{cluster.triggerCount} triggers</span></div>
                  </div>
                </div>
                {/* After */}
                <div className="border border-[#2e844a]/30 rounded-lg overflow-hidden">
                  <div className="bg-[#e6f4ea] px-4 py-2">
                    <span className="text-[12px] font-bold text-[#2e844a]">After Modernization</span>
                  </div>
                  <div className="p-4 space-y-2 text-[12px]">
                    <div className="flex justify-between"><span className="text-[#706e6b]">Entry Points</span><span className="text-[#2e844a] font-bold">1–2</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Automation Density</span><span className="text-[#2e844a] font-bold">Optimized</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">AI-Readiness</span><span className="text-[#2e844a] font-bold">High</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Redundant Logic</span><span className="text-[#2e844a] font-bold">Eliminated</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Trigger Sprawl</span><span className="text-[#2e844a] font-bold">1 handler</span></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "CRI Impact", value: "+4", color: "#2e844a" },
                  { label: "Components Changed", value: String(changeNodes.length), color: "#fe9339" },
                  { label: "Components Safe", value: String(keepNodes.length), color: "#2e844a" },
                  { label: "Tests Needed", value: preferences.includeTests ? "Auto-gen" : "Manual", color: "#0176d3" },
                ].map((m) => (
                  <div key={m.label} className="border border-[#e5e5e5] rounded-lg p-3 text-center">
                    <div className="text-[20px] font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-[10px] text-[#706e6b] mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Component change list */}
              <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
                <div className="bg-[#fafaf9] px-4 py-2 border-b border-[#e5e5e5]">
                  <span className="text-[12px] font-semibold text-[#181818]">Component-Level Changes</span>
                </div>
                <div className="divide-y divide-[#e5e5e5] max-h-[200px] overflow-y-auto">
                  {nodes.map((n) => (
                    <div key={n.id} className="flex items-center justify-between px-4 py-2 text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.recommendation === "Keep" ? "#2e844a" : n.recommendation === "Retire" ? "#ea001e" : n.recommendation === "Modernize" ? "#0176d3" : "#fe9339" }} />
                        <span className="font-medium">{n.label}</span>
                        <span className="text-[10px] text-[#706e6b]">{n.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {n.recommendation === "Keep" ? (
                          <span className="text-[10px] font-bold text-[#2e844a] bg-[#e6f4ea] px-2 py-0.5 rounded">🛡️ NO CHANGE</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: n.recommendation === "Retire" ? "#fde8e8" : n.recommendation === "Modernize" ? "#e5f1fd" : "#fef3e5", color: n.recommendation === "Retire" ? "#ea001e" : n.recommendation === "Modernize" ? "#0176d3" : "#8c4b00" }}>
                            {n.recommendation === "Retire" ? "🗑️ REMOVE" : n.recommendation === "Modernize" ? "🔄 MIGRATE" : "✏️ REFACTOR"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Action Plan */}
          {step === 3 && (
            <div className="fade-in space-y-5">
              <div>
                <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Generated Action Plan</h3>
                <p className="text-[12px] text-[#706e6b]">Step-by-step execution plan tailored to your preferences. Each step includes validation gates.</p>
              </div>

              {[
                { phase: "Phase A — Preparation", steps: [
                  { action: "Create sandbox branch", detail: "Clone production metadata to isolated sandbox for safe modernization", status: "auto" },
                  { action: "Backup existing components", detail: `Snapshot ${cluster.componentCount} components in version control`, status: "auto" },
                  { action: "Notify component owners", detail: `Alert ${cluster.objects.join(", ")} object owners of upcoming changes`, status: preferences.notifyTeam ? "auto" : "skip" },
                ]},
                { phase: "Phase B — Consolidation", steps: [
                  { action: `Consolidate ${cluster.triggerCount} triggers → 1 handler`, detail: "Merge trigger logic into single framework handler with clear entry point", status: "manual" },
                  { action: "Remove redundant logic paths", detail: "Eliminate duplicate validation and processing across overlapping automations", status: "manual" },
                  { action: "Update downstream references", detail: `Update ${changeNodes.length} components that call consolidated logic`, status: "manual" },
                ]},
                { phase: "Phase C — Validation", steps: [
                  { action: "Run existing test suite", detail: "Execute all Apex tests to verify no regressions", status: "auto" },
                  { action: preferences.includeTests ? "Generate new test classes" : "Write new test classes", detail: "Cover all modified paths with 80%+ coverage", status: preferences.includeTests ? "auto" : "manual" },
                  { action: "Sandbox validation", detail: "Deploy to sandbox and validate under simulated load", status: preferences.sandboxFirst ? "auto" : "skip" },
                ]},
                { phase: "Phase D — Deployment", steps: [
                  { action: preferences.batchSize === "incremental" ? "Deploy incrementally" : "Deploy full batch", detail: preferences.batchSize === "incremental" ? "Release component by component with validation between each" : "Deploy all changes in single release after full validation", status: "manual" },
                  { action: "Post-deployment monitoring", detail: "Monitor CRI, CPU, and governor limits for 48 hours", status: "auto" },
                  { action: "Rollback readiness", detail: "Automated rollback trigger if CRI drops > 5 points", status: "auto" },
                ]},
              ].map((phase, pi) => (
                <div key={pi} className="border border-[#e5e5e5] rounded-lg overflow-hidden">
                  <div className="bg-[#fafaf9] px-4 py-2 border-b border-[#e5e5e5]">
                    <span className="text-[12px] font-semibold text-[#181818]">{phase.phase}</span>
                  </div>
                  <div className="divide-y divide-[#e5e5e5]">
                    {phase.steps.map((s, si) => (
                      <div key={si} className={`flex items-center gap-3 px-4 py-3 ${s.status === "skip" ? "opacity-40" : ""}`}>
                        <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${s.status === "auto" ? "bg-[#e6f4ea] text-[#2e844a]" : s.status === "manual" ? "bg-[#e5f1fd] text-[#0176d3]" : "bg-[#f3f3f3] text-[#706e6b]"}`}>
                          {s.status === "auto" ? "⚡" : s.status === "manual" ? "👤" : "—"}
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-medium text-[#181818]">{s.action}</div>
                          <div className="text-[11px] text-[#706e6b]">{s.detail}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${s.status === "auto" ? "bg-[#e6f4ea] text-[#2e844a]" : s.status === "manual" ? "bg-[#e5f1fd] text-[#0176d3]" : "bg-[#f3f3f3] text-[#706e6b]"}`}>
                          {s.status === "auto" ? "Automated" : s.status === "manual" ? "Manual" : "Skipped"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 4 && (
            <div className="fade-in space-y-5">
              {!confirmed ? (
                <>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Confirm & Begin</h3>
                    <p className="text-[12px] text-[#706e6b]">Review your selections and confirm to start the modernization process.</p>
                  </div>

                  <div className="border border-[#e5e5e5] rounded-lg p-4 space-y-2 text-[12px]">
                    <div className="flex justify-between"><span className="text-[#706e6b]">Cluster</span><span className="font-semibold">{cluster.name}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Approach</span><span className="font-semibold capitalize">{preferences.approach}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Migration Target</span><span className="font-semibold capitalize">{preferences.target === "flow" ? "Flow + Orchestration" : preferences.target === "framework" ? "Trigger Framework" : "Hybrid"}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Deployment</span><span className="font-semibold capitalize">{preferences.batchSize}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Sandbox First</span><span className="font-semibold">{preferences.sandboxFirst ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Auto-generate Tests</span><span className="font-semibold">{preferences.includeTests ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Components Changed</span><span className="text-[#fe9339] font-semibold">{changeNodes.length}</span></div>
                    <div className="flex justify-between"><span className="text-[#706e6b]">Components Safe</span><span className="text-[#2e844a] font-semibold">{keepNodes.length}</span></div>
                  </div>

                  <div className="bg-[#fef3e5] border border-[#fe9339]/30 rounded-lg p-4">
                    <div className="text-[12px] font-semibold text-[#8c4b00] mb-1">⚠️ Important</div>
                    <p className="text-[11px] text-[#444] leading-relaxed">
                      This will create a modernization workspace in your sandbox. No production changes will be made until you explicitly approve the deployment after validation.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 fade-in">
                  <div className="w-[64px] h-[64px] mx-auto bg-[#e6f4ea] rounded-full flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#2e844a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#2e844a] mb-2">Modernization Initiated</h3>
                  <p className="text-[13px] text-[#444] mb-4">Sandbox workspace created. The system is generating the modernization artifacts.</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f3f3] rounded-lg text-[12px] text-[#706e6b]">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0176d3" strokeWidth="2"><circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M12 2a10 10 0 0110 10" /></svg>
                    Generating migration plan and test scaffolding...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e5e5e5] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="slds-btn text-[12px]">Cancel</button>
          <div className="flex gap-2">
            {step > 0 && !confirmed && <button onClick={back} className="slds-btn text-[12px]">← Back</button>}
            {step < 4 && <button onClick={next} className="slds-btn slds-btn-brand text-[12px]">Next →</button>}
            {step === 4 && !confirmed && <button onClick={() => setConfirmed(true)} className="slds-btn slds-btn-success text-[12px]">✓ Begin Modernization</button>}
            {confirmed && <button onClick={onClose} className="slds-btn slds-btn-brand text-[12px]">Close</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
