"use client";

import React from "react";
import { execMetrics, criTrend } from "@/lib/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ExecDashboardProps {
  onBack: () => void;
}

const monthlyData = [
  { month: "Jan", blocked: 2, warnings: 8, autoFixed: 1 },
  { month: "Feb", blocked: 4, warnings: 14, autoFixed: 2 },
  { month: "Mar", blocked: 6, warnings: 18, autoFixed: 4 },
];

const riskDistribution = [
  { name: "Low Risk", value: 62, color: "#2e844a" },
  { name: "Medium Risk", value: 20, color: "#fe9339" },
  { name: "High Risk", value: 12, color: "#ea001e" },
  { name: "Critical", value: 6, color: "#8c0000" },
];

const teamRiskData = [
  { team: "Payments", score: 64, components: 42 },
  { team: "CX", score: 71, components: 38 },
  { team: "AI Platform", score: 56, components: 23 },
  { team: "Platform", score: 78, components: 65 },
  { team: "Sales Ops", score: 82, components: 31 },
  { team: "Service", score: 75, components: 28 },
];

export default function ExecDashboard({ onBack }: ExecDashboardProps) {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>Executive Dashboard</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-[#032d60] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">
              Executive Dashboard
            </h1>
            <div className="text-[12px] text-[#706e6b]">
              Q1 2026 · Org-level risk and governance impact
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="slds-btn text-[12px]">
            📊 Export Report
          </button>
          <button className="slds-btn text-[12px]">
            📅 Schedule Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="slds-card p-5 text-center">
          <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
            Risk Reduced
          </div>
          <div className="text-[36px] font-bold text-[#2e844a] leading-none">
            {execMetrics.riskReduced}%
          </div>
          <div className="text-[11px] text-[#706e6b] mt-1">vs. start of quarter</div>
        </div>
        <div className="slds-card p-5 text-center">
          <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
            Incidents Avoided
          </div>
          <div className="text-[36px] font-bold text-[#0176d3] leading-none">
            {execMetrics.incidentsAvoided}
          </div>
          <div className="text-[11px] text-[#706e6b] mt-1">potential P0/P1</div>
        </div>
        <div className="slds-card p-5 text-center">
          <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
            Support Cases Reduced
          </div>
          <div className="text-[36px] font-bold text-[#5849be] leading-none">
            {execMetrics.supportCasesReduced}%
          </div>
          <div className="text-[11px] text-[#706e6b] mt-1">performance-related</div>
        </div>
        <div className="slds-card p-5 text-center">
          <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
            Engineering Hours Saved
          </div>
          <div className="text-[36px] font-bold text-[#032d60] leading-none">
            ~180
          </div>
          <div className="text-[11px] text-[#706e6b] mt-1">this quarter</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* CRI Trend */}
        <div className="slds-card p-5">
          <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
            Code Risk Index Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={criTrend}>
              <defs>
                <linearGradient id="criGradExec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0176d3" stopOpacity={0.2} />
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
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0176d3"
                strokeWidth={2}
                fill="url(#criGradExec)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Governance Activity */}
        <div className="slds-card p-5">
          <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
            Governance Activity (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#706e6b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#706e6b" }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  border: "1px solid #e5e5e5",
                  borderRadius: 4,
                }}
              />
              <Bar dataKey="blocked" fill="#ea001e" name="Blocked" radius={[2, 2, 0, 0]} />
              <Bar dataKey="warnings" fill="#fe9339" name="Warnings" radius={[2, 2, 0, 0]} />
              <Bar dataKey="autoFixed" fill="#2e844a" name="Auto-Fixed" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5 mb-5">
        {/* Team Risk Breakdown */}
        <div className="slds-card p-5">
          <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
            Team-Level Risk Scores
          </h3>
          <div className="space-y-3">
            {teamRiskData.map((team) => (
              <div key={team.team} className="flex items-center gap-3">
                <span className="text-[12px] text-[#444] w-[100px] shrink-0">
                  {team.team}
                </span>
                <div className="flex-1 h-[20px] bg-[#e5e5e5] rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      team.score >= 80 ? "bg-[#2e844a]" : team.score >= 65 ? "bg-[#fe9339]" : "bg-[#ea001e]"
                    }`}
                    style={{ width: `${team.score}%` }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#3e3e3c]">
                    {team.score}
                  </span>
                </div>
                <span className="text-[11px] text-[#706e6b] w-[80px] text-right">
                  {team.components} components
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="slds-card p-5">
          <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                paddingAngle={2}
              >
                {riskDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  border: "1px solid #e5e5e5",
                  borderRadius: 4,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {riskDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[#706e6b]">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Value */}
      <div className="slds-card p-5 mb-5">
        <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
          Business Value Realization
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-[#e5e5e5] rounded-lg p-4">
            <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
              Estimated Cost Avoided
            </div>
            <div className="text-[28px] font-bold text-[#2e844a]">~$240K</div>
            <div className="text-[12px] text-[#444] mt-1">
              Based on 3 prevented P0/P1 incidents at avg $80K resolution cost
            </div>
          </div>
          <div className="border border-[#e5e5e5] rounded-lg p-4">
            <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
              Deployment Confidence
            </div>
            <div className="text-[28px] font-bold text-[#0176d3]">89%</div>
            <div className="text-[12px] text-[#444] mt-1">
              Up from 64% before governance activation
            </div>
          </div>
          <div className="border border-[#e5e5e5] rounded-lg p-4">
            <div className="text-[11px] text-[#706e6b] uppercase tracking-wide mb-2">
              Code Quality Improved
            </div>
            <div className="text-[28px] font-bold text-[#5849be]">{execMetrics.codeQualityImproved}%</div>
            <div className="text-[12px] text-[#444] mt-1">
              Reduction in anti-patterns and runtime hotspots
            </div>
          </div>
        </div>
      </div>

      {/* AI Code Stats */}
      <div className="slds-card p-5">
        <h3 className="text-[14px] font-semibold text-[#181818] mb-4">
          AI-Generated Code Intelligence
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#f0ecff] rounded-lg p-4 text-center">
            <div className="text-[24px] font-bold text-[#5849be]">23%</div>
            <div className="text-[11px] text-[#706e6b] mt-1">AI Code Coverage</div>
          </div>
          <div className="bg-[#f0ecff] rounded-lg p-4 text-center">
            <div className="text-[24px] font-bold text-[#5849be]">64%</div>
            <div className="text-[11px] text-[#706e6b] mt-1">Avg AI Confidence</div>
          </div>
          <div className="bg-[#fef3e5] rounded-lg p-4 text-center">
            <div className="text-[24px] font-bold text-[#8c4b00]">5</div>
            <div className="text-[11px] text-[#706e6b] mt-1">AI Code Blocked</div>
          </div>
          <div className="bg-[#e6f4ea] rounded-lg p-4 text-center">
            <div className="text-[24px] font-bold text-[#2e844a]">3</div>
            <div className="text-[11px] text-[#706e6b] mt-1">AI Code Auto-Fixed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
