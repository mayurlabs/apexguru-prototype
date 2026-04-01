"use client";

import React, { useState } from "react";

interface SalesforceShellProps {
  children: React.ReactNode;
  onAgentforceClick: () => void;
  agentPanelOpen: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

const sidebarItems = [
  {
    label: "Scale",
    expanded: true,
    children: [
      {
        label: "Scale Center",
        expanded: true,
        children: [
          { label: "Org Overview", view: "dashboard" },
          { label: "Org Performance", view: "dashboard" },
          { label: "Performance Analysis", view: "dashboard" },
        ],
      },
      {
        label: "Scale Insights",
        expanded: true,
        children: [
          { label: "ApexGuru Insights", view: "dashboard", active: true },
          { label: "Database Insights", view: "dashboard" },
          { label: "Lightning Experience Insights", view: "dashboard" },
          { label: "Report Insights", view: "dashboard" },
          { label: "Search Insights", view: "dashboard" },
        ],
      },
      {
        label: "Code Governance",
        expanded: true,
        children: [
          { label: "Code Risk Index", view: "dashboard" },
          { label: "Runtime Hotspots", view: "dashboard" },
          { label: "Governance Policies", view: "policy" },
          { label: "Deployment Controls", view: "deployment" },
          { label: "AI Code Validation", view: "dashboard" },
        ],
      },
      {
        label: "Remediation",
        expanded: true,
        children: [
          { label: "AI Remediation", view: "remediation" },
          { label: "Modernization", view: "modernization" },
          { label: "Code Reusability", view: "modernization" },
        ],
      },
      {
        label: "Executive View",
        expanded: false,
        children: [
          { label: "Executive Dashboard", view: "exec" },
          { label: "Value Realization", view: "exec" },
        ],
      },
      {
        label: "Scale Test",
        expanded: false,
        children: [
          { label: "Overview", view: "dashboard" },
          { label: "Test Environment Setup", view: "dashboard" },
          { label: "Test Execution", view: "dashboard" },
          { label: "Test Plan Creation", view: "dashboard" },
          { label: "Test Scheduler", view: "dashboard" },
        ],
      },
    ],
  },
];

function WaffleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {[0, 7, 14].map((x) =>
        [0, 7, 14].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" fill="white" />
        ))
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SidebarSection({
  item,
  activeView,
  onNavigate,
  depth = 0,
}: {
  item: (typeof sidebarItems)[0];
  activeView: string;
  onNavigate: (view: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(item.expanded ?? false);
  const hasChildren = "children" in item && item.children && item.children.length > 0;

  if (!hasChildren) {
    const leaf = item as { label: string; view?: string; active?: boolean };
    const isActive = leaf.active || leaf.view === activeView;
    return (
      <div
        className={`py-[5px] pr-3 cursor-pointer text-[12.5px] transition-colors ${
          isActive
            ? "text-[#0176d3] font-semibold bg-[#e5f1fd]"
            : "text-[#444] hover:text-[#0176d3] hover:bg-[#f3f3f3]"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => leaf.view && onNavigate(leaf.view)}
      >
        {leaf.label}
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 py-[5px] pr-3 cursor-pointer text-[12px] font-bold text-[#3e3e3c] uppercase tracking-wide hover:bg-[#f3f3f3] transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronRight
          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
        />
        <span>{item.label}</span>
      </div>
      {expanded && (
        <div>
          {item.children!.map((child: any, i: number) => (
            <SidebarSection
              key={i}
              item={child}
              activeView={activeView}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SalesforceShell({
  children,
  onAgentforceClick,
  agentPanelOpen,
  activeView,
  onNavigate,
}: SalesforceShellProps) {
  const [quickFind, setQuickFind] = useState("");

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <header className="h-[44px] bg-[#032d60] flex items-center px-0 shrink-0 z-50">
        {/* Left section */}
        <div className="flex items-center h-full">
          <button className="w-[44px] h-full flex items-center justify-center hover:bg-[#014486] transition-colors">
            <WaffleIcon />
          </button>
          <div className="flex items-center h-full">
            <button className="h-full px-4 flex items-center text-white text-[13px] font-medium bg-white/10 border-b-[3px] border-white">
              Setup
            </button>
            <button className="h-full px-4 flex items-center text-white/70 text-[13px] hover:bg-white/5 transition-colors">
              Home
            </button>
            <button className="h-full px-4 flex items-center text-white/70 text-[13px] hover:bg-white/5 transition-colors">
              Object Manager
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 opacity-60">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search Setup"
              className="w-full h-[30px] bg-white/10 border border-white/20 rounded-[4px] pl-9 pr-3 text-[13px] text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/30 transition-all"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center h-full gap-0">
          <button className="w-[40px] h-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
            <GearIcon />
          </button>
          <button className="w-[40px] h-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors relative">
            <BellIcon />
            <span className="absolute top-2 right-2 w-[8px] h-[8px] bg-[#ea001e] rounded-full" />
          </button>
          <button className="w-[40px] h-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
            <HelpIcon />
          </button>
          <button className="w-[40px] h-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
            <UserIcon />
          </button>

          {/* Agentforce Button */}
          <button
            onClick={onAgentforceClick}
            className={`h-[30px] px-3 mx-2 flex items-center gap-1.5 rounded-[4px] text-[12px] font-semibold transition-all ${
              agentPanelOpen
                ? "bg-[#5849be] text-white"
                : "bg-[#5849be]/80 text-white hover:bg-[#5849be] pulse-glow"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Agentforce
          </button>

          {/* User Avatar */}
          <button className="w-[36px] h-[36px] rounded-full bg-[#0176d3] flex items-center justify-center text-white text-[13px] font-bold mr-3 ml-1">
            S
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[240px] bg-white border-r border-[#e5e5e5] flex flex-col shrink-0 overflow-hidden">
          {/* Quick Find */}
          <div className="p-3 border-b border-[#e5e5e5]">
            <div className="relative">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#939393]">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Quick Find"
                value={quickFind}
                onChange={(e) => setQuickFind(e.target.value)}
                className="w-full h-[30px] border border-[#c9c9c9] rounded-[4px] pl-8 pr-3 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:shadow-[0_0_0_1px_#0176d3] transition-all"
              />
            </div>
          </div>

          {/* Navigation Tree */}
          <nav className="flex-1 overflow-y-auto py-2">
            {sidebarItems.map((item, i) => (
              <SidebarSection
                key={i}
                item={item}
                activeView={activeView}
                onNavigate={onNavigate}
              />
            ))}

            <div className="mt-4 px-3 py-2 text-[11px] text-[#706e6b]">
              Didn&apos;t find what you&apos;re looking for? Try using Global Search.
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f3f3f3]">{children}</main>
      </div>
    </div>
  );
}
