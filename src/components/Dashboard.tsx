"use client";

import React, { useState, useEffect } from "react";
import {
  orgCRI,
  riskCategories,
  hotspots,
  governanceStats,
  criTrend,
  HotspotItem,
} from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DashboardProps {
  onHotspotClick: (item: HotspotItem) => void;
  onNavigate: (view: string) => void;
}

function CRIGauge({ score, animated }: { score: number; animated: boolean }) {
  const radius = 80;
  const circumference = Math.PI * radius;
  const percentage = score / 100;
  const offset = circumference * (1 - percentage);

  const getColor = (s: number) => {
    if (s >= 80) return "#2e844a";
    if (s >= 60) return "#fe9339";
    return "#ea001e";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Healthy";
    if (s >= 60) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Color arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={animated ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />
        {/* Score text */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="text-[36px] font-bold"
          fill={getColor(score)}
        >
          {score}
        </text>
        <text x="100" y="105" textAnchor="middle" className="text-[12px]" fill="#706e6b">
          {getLabel(score)}
        </text>
      </svg>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    Critical: "slds-badge-error",
    High: "slds-badge-warning",
    Medium: "slds-badge-info",
    Low: "slds-badge-success",
  };
  const icons: Record<string, string> = {
    Critical: "🔴",
    High: "🟠",
    Medium: "🟡",
    Low: "🟢",
  };
  return (
    <span className={`slds-badge ${styles[risk] || ""}`}>
      {icons[risk]} {risk}
    </span>
  );
}

function TrendArrow({ trend, delta }: { trend: string; delta: number }) {
  if (trend === "stable") return <span className="text-[#706e6b] text-[11px]">— Stable</span>;
  if (trend === "up" && delta > 0)
    return <span className="text-[#ea001e] text-[11px]">↑ +{delta}%</span>;
  if (trend === "down")
    return <span className="text-[#ea001e] text-[11px]">↓ {delta}</span>;
  return <span className="text-[#2e844a] text-[11px]">↑ +{delta}</span>;
}

export default function Dashboard({ onHotspotClick, onNavigate }: DashboardProps) {
  const [animated, setAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-[40px] h-[40px] bg-[#0176d3] rounded-lg flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <div className="text-[11px] text-[#706e6b] uppercase tracking-wider">SETUP</div>
          <h1 className="text-[20px] font-normal text-[#181818]">
            ApexGuru — Code Risk Intelligence
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="slds-tabs mb-5 mt-2">
        {["Overview", "Runtime Hotspots", "Governance", "Trends"].map((tab) => (
          <div
            key={tab}
            className={`slds-tab ${activeTab === tab.toLowerCase().replace(" ", "-") ? "active" : ""}`}
            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* CRI Hero Card */}
      <div className="slds-card p-6 mb-5">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-6">
          {/* CRI Gauge */}
          <div className="flex flex-col items-center border-r border-[#e5e5e5] pr-6">
            <div className="text-[13px] font-semibold text-[#3e3e3c] mb-2">
              Code Risk Index (CRI)
            </div>
            <CRIGauge score={orgCRI.score} animated={animated} />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#ea001e] text-[13px] font-semibold">
                ↓ {orgCRI.delta} from {orgCRI.previousScore}
              </span>
              <span className="text-[11px] text-[#706e6b]">last 30 days</span>
            </div>
          </div>

          {/* CRI Trend */}
          <div className="border-r border-[#e5e5e5] pr-6">
            <div className="text-[13px] font-semibold text-[#3e3e3c] mb-3">
              CRI Trend (Last 30 Days)
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={criTrend}>
                <defs>
                  <linearGradient id="criGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0176d3" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0176d3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#706e6b" }} />
                <YAxis domain={[60, 90]} tick={{ fontSize: 10, fill: "#706e6b" }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid #e5e5e5",
                    borderRadius: 4,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0176d3"
                  strokeWidth={2}
                  fill="url(#criGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Org Stats */}
          <div>
            <div className="text-[13px] font-semibold text-[#3e3e3c] mb-3">
              Org Composition
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#444]">Apex Classes</span>
                <span className="text-[13px] font-semibold">{orgCRI.totalClasses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#444]">Flows</span>
                <span className="text-[13px] font-semibold">{orgCRI.totalFlows}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#444]">Triggers</span>
                <span className="text-[13px] font-semibold">{orgCRI.totalTriggers}</span>
              </div>
              <div className="border-t border-[#e5e5e5] pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#444]">AI-Generated Code</span>
                  <span className="text-[13px] font-semibold text-[#5849be]">{orgCRI.aiGeneratedPercent}%</span>
                </div>
                <div className="mt-1.5">
                  <div className="h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5849be] rounded-full transition-all duration-1000"
                      style={{ width: animated ? `${orgCRI.aiGeneratedPercent}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#444]">AI Avg Confidence</span>
                <span className={`text-[13px] font-semibold ${orgCRI.aiConfidence < 70 ? "text-[#ea001e]" : "text-[#2e844a]"}`}>
                  {orgCRI.aiConfidence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Breakdown Grid */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {riskCategories.map((cat) => (
          <div key={cat.label} className="slds-card p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#706e6b]">{cat.label}</span>
              <span className="text-[16px]">{cat.icon}</span>
            </div>
            <div className="flex items-end gap-2">
              <span
                className={`text-[28px] font-bold leading-none ${
                  cat.score >= 80
                    ? "text-[#2e844a]"
                    : cat.score >= 60
                    ? "text-[#fe9339]"
                    : "text-[#ea001e]"
                }`}
              >
                {cat.score}
              </span>
              <TrendArrow trend={cat.trend} delta={cat.delta} />
            </div>
            <div className="mt-2 h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  cat.score >= 80
                    ? "bg-[#2e844a]"
                    : cat.score >= 60
                    ? "bg-[#fe9339]"
                    : "bg-[#ea001e]"
                }`}
                style={{ width: animated ? `${cat.score}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Governance Status */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {governanceStats.map((stat) => (
          <div key={stat.label} className="slds-card p-4">
            <div className="text-[12px] text-[#706e6b] mb-1">{stat.label}</div>
            <div className="text-[28px] font-bold leading-none" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[11px] text-[#706e6b] mt-1">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Hotspot Table */}
      <div className="slds-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-[#181818]">
              Runtime Risk Hotspots
            </h2>
            <span className="slds-badge slds-badge-error">{hotspots.filter((h) => h.risk === "Critical").length} Critical</span>
            <span className="slds-badge slds-badge-warning">{hotspots.filter((h) => h.risk === "High").length} High</span>
          </div>
          <div className="flex gap-2">
            <button className="slds-btn text-[12px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4h18M3 12h18M3 20h18" />
              </svg>
              Filter
            </button>
            <button className="slds-btn text-[12px]">
              Export
            </button>
          </div>
        </div>
        <table className="slds-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Type</th>
              <th>Risk Level</th>
              <th>Issue</th>
              <th>CPU Impact</th>
              <th>Owner</th>
              <th>AI</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((item) => (
              <tr
                key={item.id}
                className="clickable-row"
                onClick={() => onHotspotClick(item)}
              >
                <td>
                  <span className="text-[#0176d3] font-medium hover:underline cursor-pointer">
                    {item.component}
                  </span>
                </td>
                <td>
                  <span className="slds-badge slds-badge-info">{item.type}</span>
                </td>
                <td>
                  <RiskBadge risk={item.risk} />
                </td>
                <td className="text-[12px] text-[#444] max-w-[260px] truncate">
                  {item.issue}
                </td>
                <td>
                  <span className={`font-semibold text-[12px] ${
                    item.cpuImpact.includes("42") || item.cpuImpact.includes("35") || item.cpuImpact.includes("28") || item.cpuImpact.includes("25")
                      ? "text-[#ea001e]"
                      : "text-[#fe9339]"
                  }`}>
                    {item.cpuImpact}
                  </span>
                </td>
                <td className="text-[12px] text-[#444]">{item.owner}</td>
                <td>
                  {item.aiGenerated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0ecff] text-[#5849be] rounded text-[10px] font-semibold">
                      🤖 AI
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-[11px] text-[#706e6b] text-center">
        Last updated: {orgCRI.lastUpdated} · Data refreshes every 15 minutes
      </div>
    </div>
  );
}
