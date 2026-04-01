"use client";

import React, { useState, useEffect } from "react";
import { deploymentBlockData } from "@/lib/data";

interface DeploymentBlockProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function DeploymentBlock({ onBack, onNavigate }: DeploymentBlockProps) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimationDone(true), 300);
  }, []);

  const d = deploymentBlockData;

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <button onClick={() => onNavigate("policy")} className="text-[#0176d3] hover:underline cursor-pointer">
          Governance Policies
        </button>
        <span>›</span>
        <span>Deployment Blocked</span>
      </div>

      {/* Block Banner */}
      <div
        className={`bg-[#ea001e] rounded-lg p-6 mb-5 text-white transition-all duration-500 ${
          animationDone ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="text-[24px] font-bold mb-1">🚫 Deployment Blocked</h1>
            <p className="text-white/80 text-[14px]">
              This deployment has been automatically blocked by runtime governance policies.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        {/* Left - Details */}
        <div className="space-y-5">
          {/* Deployment Info */}
          <div className="slds-card p-5">
            <h3 className="text-[14px] font-semibold text-[#181818] mb-4">Deployment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">Deployment ID</div>
                <div className="font-mono font-medium">{d.deploymentId}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">Timestamp</div>
                <div>{d.timestamp}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">Initiated By</div>
                <div>{d.initiatedBy}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">Target Environment</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ea001e] rounded-full" />
                  {d.environment}
                </div>
              </div>
            </div>
          </div>

          {/* Violations */}
          <div className="slds-card">
            <div className="px-5 py-3 border-b border-[#e5e5e5] bg-[#fde8e8]">
              <h3 className="text-[14px] font-semibold text-[#ea001e]">
                Policy Violations ({d.violations.length})
              </h3>
            </div>
            <div className="divide-y divide-[#e5e5e5]">
              {d.violations.map((v, i) => (
                <div key={i} className="px-5 py-4 fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 ${
                      v.severity === "Critical" ? "bg-[#ea001e]" : "bg-[#fe9339]"
                    }`}>
                      <span className="text-white text-[12px] font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`slds-badge ${
                          v.severity === "Critical" ? "slds-badge-error" : "slds-badge-warning"
                        }`}>
                          {v.severity}
                        </span>
                        <span className="text-[13px] font-semibold text-[#181818]">{v.rule}</span>
                      </div>
                      <div className="text-[13px] text-[#444]">{v.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Affected Components */}
          <div className="slds-card">
            <div className="px-5 py-3 border-b border-[#e5e5e5]">
              <h3 className="text-[14px] font-semibold text-[#181818]">
                Affected Components ({d.components.length})
              </h3>
            </div>
            <table className="slds-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Type</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {d.components.map((comp, i) => (
                  <tr key={i}>
                    <td>
                      <span className="text-[#0176d3] font-medium">{comp.name}</span>
                    </td>
                    <td>
                      <span className="slds-badge slds-badge-info">{comp.type}</span>
                    </td>
                    <td>
                      <span className={`slds-badge ${
                        comp.risk === "Critical" ? "slds-badge-error" : comp.risk === "High" ? "slds-badge-warning" : "slds-badge-info"
                      }`}>
                        {comp.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Trail */}
          <div className="slds-card p-5">
            <h3 className="text-[14px] font-semibold text-[#181818] mb-3">Audit Trail</h3>
            <div className="space-y-3">
              {[
                { time: "08:47:12 AM", event: "Deployment initiated", user: "Sarah Chen", icon: "🔄" },
                { time: "08:47:14 AM", event: "Runtime risk analysis started", user: "System", icon: "🔍" },
                { time: "08:47:18 AM", event: "3 policy violations detected", user: "System", icon: "⚠️" },
                { time: "08:47:18 AM", event: "Deployment blocked — Critical risk", user: "System", icon: "🚫" },
                { time: "08:47:19 AM", event: "Notification sent to team", user: "System", icon: "📧" },
              ].map((entry, i) => (
                <div key={i} className="flex items-center gap-3 text-[12px]">
                  <span className="text-[#706e6b] font-mono w-[90px] shrink-0">{entry.time}</span>
                  <span>{entry.icon}</span>
                  <span className="text-[#444]">{entry.event}</span>
                  <span className="text-[#706e6b] ml-auto">{entry.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* CRI Impact */}
          <div className="slds-card p-5">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-3">CRI Impact</h3>
            <div className="flex items-center justify-center gap-4 py-3">
              <div className="text-center">
                <div className="text-[32px] font-bold text-[#fe9339]">{d.criImpact.before}</div>
                <div className="text-[11px] text-[#706e6b]">Current</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea001e" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="text-center">
                <div className="text-[32px] font-bold text-[#ea001e]">{d.criImpact.projected}</div>
                <div className="text-[11px] text-[#706e6b]">Projected</div>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="slds-badge slds-badge-error">
                -11 point drop if deployed
              </span>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="slds-card p-5">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-3">Recommended Actions</h3>
            <div className="space-y-2.5">
              <button
                className="w-full text-left p-3 border border-[#e5e5e5] rounded-lg hover:bg-[#e5f1fd] hover:border-[#0176d3] transition-all cursor-pointer"
                onClick={() => onNavigate("remediation")}
              >
                <div className="text-[12px] font-semibold text-[#0176d3]">
                  🔧 Generate AI Fix
                </div>
                <div className="text-[11px] text-[#706e6b] mt-0.5">
                  Auto-generate optimized versions of flagged code
                </div>
              </button>
              <button className="w-full text-left p-3 border border-[#e5e5e5] rounded-lg hover:bg-[#e5f1fd] hover:border-[#0176d3] transition-all cursor-pointer">
                <div className="text-[12px] font-semibold text-[#0176d3]">
                  📋 Request Override
                </div>
                <div className="text-[11px] text-[#706e6b] mt-0.5">
                  Submit for architect approval with justification
                </div>
              </button>
              <button className="w-full text-left p-3 border border-[#e5e5e5] rounded-lg hover:bg-[#e5f1fd] hover:border-[#0176d3] transition-all cursor-pointer">
                <div className="text-[12px] font-semibold text-[#0176d3]">
                  🔄 Redirect to Sandbox
                </div>
                <div className="text-[11px] text-[#706e6b] mt-0.5">
                  Deploy to sandbox for validation instead
                </div>
              </button>
            </div>
          </div>

          {/* Why Blocked */}
          <div className="slds-card p-5 bg-[#fafaf9]">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-2">
              Why was this blocked?
            </h3>
            <p className="text-[12px] text-[#444] leading-relaxed">
              This deployment was automatically blocked because the runtime governance engine detected that the included components would cause a projected CPU regression of +35%, exceeding the configured threshold of 30%. Additionally, AI-generated code with a confidence score below 70% requires mandatory review before production deployment.
            </p>
            <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
              <div className="text-[11px] text-[#706e6b]">
                Policy: Critical Runtime Risk Block
              </div>
              <div className="text-[11px] text-[#706e6b]">
                Enforcement: Automatic
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
