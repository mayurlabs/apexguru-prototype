"use client";

import React, { useState } from "react";
import { modernizationItems } from "@/lib/data";

interface ModernizationViewProps {
  onBack: () => void;
}

export default function ModernizationView({ onBack }: ModernizationViewProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const typeIcons: Record<string, string> = {
    Duplicate: "🔁",
    Legacy: "⚡",
    Unused: "🗑️",
    Refactor: "♻️",
  };

  const recColors: Record<string, { bg: string; text: string }> = {
    Consolidate: { bg: "#e5f1fd", text: "#0176d3" },
    Retire: { bg: "#fde8e8", text: "#ea001e" },
    Simplify: { bg: "#fef3e5", text: "#8c4b00" },
    Reuse: { bg: "#e6f4ea", text: "#2e844a" },
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>Modernization Insights</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-[#5849be] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">
              Modernization Insights
            </h1>
            <div className="text-[12px] text-[#706e6b]">
              Identify what to fix, reuse, simplify, or retire
            </div>
          </div>
        </div>
        <button className="slds-btn slds-btn-brand">
          Create Refactor Plan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Consolidate", count: 2, icon: "🔁", color: "#0176d3" },
          { label: "Simplify", count: 2, icon: "⚡", color: "#fe9339" },
          { label: "Retire", count: 1, icon: "🗑️", color: "#ea001e" },
          { label: "Reuse", count: 1, icon: "♻️", color: "#2e844a" },
        ].map((cat) => (
          <div key={cat.label} className="slds-card p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="text-[24px] mb-1">{cat.icon}</div>
            <div className="text-[28px] font-bold" style={{ color: cat.color }}>
              {cat.count}
            </div>
            <div className="text-[12px] text-[#706e6b]">{cat.label}</div>
          </div>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="slds-card p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#181818]">
              Estimated Modernization Impact
            </h3>
            <p className="text-[12px] text-[#706e6b] mt-1">
              Completing all recommended modernizations could improve your CRI by 8–12 points
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#fe9339]">72</div>
              <div className="text-[10px] text-[#706e6b]">Current CRI</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e844a" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#2e844a]">80–84</div>
              <div className="text-[10px] text-[#706e6b]">Projected CRI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modernization Items */}
      <div className="slds-card">
        <div className="px-4 py-3 border-b border-[#e5e5e5] bg-[#fafaf9]">
          <h3 className="text-[14px] font-semibold text-[#181818]">
            Modernization Opportunities ({modernizationItems.length})
          </h3>
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {modernizationItems.map((item) => {
            const colors = recColors[item.recommendation];
            const isExpanded = selectedItem === item.id;
            return (
              <div key={item.id} className="px-5 py-4">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setSelectedItem(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-[20px] mt-0.5">{typeIcons[item.type]}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-[#181818]">
                          {item.title}
                        </span>
                        <span
                          className="slds-badge"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {item.recommendation}
                        </span>
                        <span className={`slds-badge ${
                          item.impact === "High" ? "slds-badge-error" : item.impact === "Medium" ? "slds-badge-warning" : "slds-badge-info"
                        }`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <p className="text-[12px] text-[#444] leading-relaxed">
                        {item.description}
                      </p>
                      <div className="text-[11px] text-[#706e6b] mt-1">
                        {item.affectedComponents} components affected
                      </div>
                    </div>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#706e6b" strokeWidth="2"
                    className={`transition-transform mt-1 ${isExpanded ? "rotate-90" : ""}`}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="mt-4 ml-9 p-4 bg-[#fafaf9] rounded-lg border border-[#e5e5e5] fade-in">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">
                          Recommendation
                        </div>
                        <div className="text-[13px] text-[#181818] font-medium">
                          {item.recommendation === "Consolidate" && "Merge duplicate logic into a single reusable service class"}
                          {item.recommendation === "Simplify" && "Refactor to modern patterns or migrate to declarative approach"}
                          {item.recommendation === "Retire" && "Remove unused code — safe to delete based on 90-day usage analysis"}
                          {item.recommendation === "Reuse" && "Extract into shared utility for cross-class consumption"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-1">
                          Estimated Effort
                        </div>
                        <div className="text-[13px] text-[#181818] font-medium">
                          {item.impact === "High" ? "3–5 days" : item.impact === "Medium" ? "1–2 days" : "< 1 day"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="slds-btn slds-btn-brand text-[12px]">
                        Start Modernization
                      </button>
                      <button className="slds-btn text-[12px]">
                        View Affected Components
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
