"use client";

import React, { useState } from "react";
import { defaultPolicies, PolicyRule } from "@/lib/data";

interface PolicyBuilderProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function PolicyBuilder({ onBack, onNavigate }: PolicyBuilderProps) {
  const [policies, setPolicies] = useState<PolicyRule[]>(defaultPolicies);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSaveAll = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const actionColors: Record<string, { bg: string; text: string; border: string }> = {
    Block: { bg: "#fde8e8", text: "#ea001e", border: "#ea001e" },
    Review: { bg: "#fef3e5", text: "#8c4b00", border: "#fe9339" },
    Warn: { bg: "#e5f1fd", text: "#0176d3", border: "#0176d3" },
    Allow: { bg: "#e6f4ea", text: "#2e844a", border: "#2e844a" },
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>Governance Policies</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-[#0176d3] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">
              Governance Policies
            </h1>
            <div className="text-[12px] text-[#706e6b]">
              Define how risk is managed across deployments
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="slds-btn">+ New Policy</button>
          <button className="slds-btn slds-btn-brand" onClick={handleSaveAll}>
            Save & Activate
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="toast-notification">
          <div className="flex items-center gap-3 bg-[#2e844a] text-white px-5 py-3 rounded-lg shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-[13px] font-medium">
              Governance policies saved and activated. CI/CD integration connected.
            </span>
          </div>
        </div>
      )}

      {/* Enforcement Mode */}
      <div className="slds-card p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#181818] mb-1">
              Enforcement Mode
            </h3>
            <p className="text-[12px] text-[#706e6b]">
              Choose how governance policies are applied to your org
            </p>
          </div>
          <div className="flex gap-2">
            {["Monitor", "Advisory", "Enforce"].map((mode) => (
              <button
                key={mode}
                className={`px-4 py-2 rounded-[4px] text-[12px] font-medium transition-all ${
                  mode === "Enforce"
                    ? "bg-[#0176d3] text-white border border-[#0176d3]"
                    : "bg-white text-[#444] border border-[#c9c9c9] hover:bg-[#f3f3f3]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="bg-[#fafaf9] rounded-lg p-4 border border-[#e5e5e5]">
            <div className="text-[12px] font-semibold text-[#181818] mb-1">Monitor</div>
            <div className="text-[11px] text-[#706e6b]">
              Observe and log all risk signals. No enforcement actions taken.
            </div>
          </div>
          <div className="bg-[#fafaf9] rounded-lg p-4 border border-[#e5e5e5]">
            <div className="text-[12px] font-semibold text-[#181818] mb-1">Advisory</div>
            <div className="text-[11px] text-[#706e6b]">
              Warn on policy violations but allow deployments to proceed.
            </div>
          </div>
          <div className="bg-[#e5f1fd] rounded-lg p-4 border border-[#0176d3]">
            <div className="text-[12px] font-semibold text-[#0176d3] mb-1">Enforce ✓</div>
            <div className="text-[11px] text-[#444]">
              Block critical violations. Require review for high risk. Warn on moderate.
            </div>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="slds-card">
        <div className="px-4 py-3 border-b border-[#e5e5e5] bg-[#fafaf9]">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#181818]">Active Policies</h3>
            <span className="text-[12px] text-[#706e6b]">
              {policies.filter((p) => p.enabled).length} of {policies.length} enabled
            </span>
          </div>
        </div>

        <div className="divide-y divide-[#e5e5e5]">
          {policies.map((policy) => {
            const colors = actionColors[policy.action];
            const isSfEnforced = policy.sfEnforced === true;
            return (
              <div
                key={policy.id}
                className={`px-5 py-4 transition-colors ${
                  !policy.enabled ? "opacity-50" : ""
                } ${isSfEnforced ? "bg-[#fafaf9]" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border,
                        }}
                      >
                        {policy.action === "Block" && "🚫 "}
                        {policy.action === "Review" && "👁️ "}
                        {policy.action === "Warn" && "⚠️ "}
                        {policy.action === "Allow" && "✅ "}
                        {policy.action}
                      </span>
                      {isSfEnforced && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#032d60] text-white border border-[#032d60]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                          Salesforce Enforced
                        </span>
                      )}
                      <span className="text-[14px] font-semibold text-[#181818]">
                        {policy.name}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#444] mb-1.5">
                      <span className="text-[#706e6b]">Condition: </span>
                      <code className="bg-[#f3f3f3] px-1.5 py-0.5 rounded text-[11px] font-mono">
                        {policy.condition}
                      </code>
                    </div>
                    <div className="text-[11px] text-[#706e6b]">
                      Scope: {policy.scope}
                    </div>
                    {isSfEnforced && policy.sfEnforcedReason && (
                      <div className="mt-2 text-[11px] text-[#032d60] bg-[#e5f1fd] rounded px-2.5 py-1.5 border border-[#0176d3]/20 leading-relaxed">
                        <strong>Platform requirement:</strong> {policy.sfEnforcedReason}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!isSfEnforced && (
                      <button
                        className="text-[12px] text-[#0176d3] hover:underline cursor-pointer"
                        onClick={() => setEditingPolicy(editingPolicy === policy.id ? null : policy.id)}
                      >
                        Edit
                      </button>
                    )}
                    {isSfEnforced ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#706e6b]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#706e6b" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        Locked
                      </div>
                    ) : (
                      <button
                        onClick={() => togglePolicy(policy.id)}
                        className={`relative w-[44px] h-[22px] rounded-full transition-colors ${
                          policy.enabled ? "bg-[#0176d3]" : "bg-[#c9c9c9]"
                        }`}
                      >
                        <span
                          className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-all ${
                            policy.enabled ? "left-[24px]" : "left-[2px]"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Edit */}
                {editingPolicy === policy.id && (
                  <div className="mt-4 p-4 bg-[#fafaf9] rounded-lg border border-[#e5e5e5] fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-[#3e3e3c] uppercase tracking-wide block mb-1">
                          Action
                        </label>
                        <select className="w-full h-[32px] border border-[#c9c9c9] rounded px-2 text-[13px] outline-none focus:border-[#0176d3]">
                          <option>{policy.action}</option>
                          <option>Block</option>
                          <option>Review</option>
                          <option>Warn</option>
                          <option>Allow</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#3e3e3c] uppercase tracking-wide block mb-1">
                          Scope
                        </label>
                        <select className="w-full h-[32px] border border-[#c9c9c9] rounded px-2 text-[13px] outline-none focus:border-[#0176d3]">
                          <option>{policy.scope}</option>
                          <option>All deployments</option>
                          <option>Production only</option>
                          <option>AI-generated only</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-semibold text-[#3e3e3c] uppercase tracking-wide block mb-1">
                          Condition
                        </label>
                        <input
                          type="text"
                          defaultValue={policy.condition}
                          className="w-full h-[32px] border border-[#c9c9c9] rounded px-3 text-[13px] font-mono outline-none focus:border-[#0176d3]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="slds-btn text-[12px]"
                        onClick={() => setEditingPolicy(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="slds-btn slds-btn-brand text-[12px]"
                        onClick={() => setEditingPolicy(null)}
                      >
                        Update Policy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CI/CD Integration */}
      <div className="slds-card p-5 mt-5">
        <h3 className="text-[14px] font-semibold text-[#181818] mb-3">CI/CD Integration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-[#e6f4ea] rounded-lg border border-[#2e844a]/20">
            <span className="text-[18px]">✅</span>
            <div>
              <div className="text-[12px] font-semibold text-[#2e844a]">Salesforce DX</div>
              <div className="text-[11px] text-[#706e6b]">Connected</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#e6f4ea] rounded-lg border border-[#2e844a]/20">
            <span className="text-[18px]">✅</span>
            <div>
              <div className="text-[12px] font-semibold text-[#2e844a]">GitHub Actions</div>
              <div className="text-[11px] text-[#706e6b]">Connected</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#fafaf9] rounded-lg border border-[#e5e5e5]">
            <span className="text-[18px]">⬜</span>
            <div>
              <div className="text-[12px] font-medium text-[#444]">Azure DevOps</div>
              <div className="text-[11px] text-[#0176d3] cursor-pointer hover:underline">
                Connect
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulate */}
      <div className="mt-5 flex justify-center">
        <button
          className="slds-btn slds-btn-destructive px-6"
          onClick={() => onNavigate("deployment")}
        >
          🚫 Simulate Deployment Block
        </button>
      </div>
    </div>
  );
}
