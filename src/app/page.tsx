"use client";

import React, { useState, useEffect } from "react";
import SalesforceShell from "@/components/SalesforceShell";
import AgentforcePanel from "@/components/AgentforcePanel";
import Dashboard from "@/components/Dashboard";
import ComponentDetail from "@/components/ComponentDetail";
import PolicyBuilder from "@/components/PolicyBuilder";
import DeploymentBlock from "@/components/DeploymentBlock";
import RemediationView from "@/components/RemediationView";
import ModernizationView from "@/components/ModernizationView";
import ExecDashboard from "@/components/ExecDashboard";
import { HotspotItem, hotspots } from "@/lib/data";

type ViewType =
  | "dashboard"
  | "component-detail"
  | "policy"
  | "deployment"
  | "remediation"
  | "modernization"
  | "exec";

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem>(hotspots[0]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastMessage("⚠️ New high-risk pattern detected in AI_LoanApprovalHandler.cls — AI confidence 58%");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleAgentforceClick = () => {
    setAgentPanelOpen(!agentPanelOpen);
  };

  const handleHotspotClick = (item: HotspotItem) => {
    setSelectedHotspot(item);
    setActiveView("component-detail");
  };

  const handleNavigate = (view: string) => {
    setActiveView(view as ViewType);
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            onHotspotClick={handleHotspotClick}
            onNavigate={handleNavigate}
          />
        );
      case "component-detail":
        return (
          <ComponentDetail
            item={selectedHotspot}
            onBack={() => setActiveView("dashboard")}
            onNavigate={handleNavigate}
          />
        );
      case "policy":
        return (
          <PolicyBuilder
            onBack={() => setActiveView("dashboard")}
            onNavigate={handleNavigate}
          />
        );
      case "deployment":
        return (
          <DeploymentBlock
            onBack={() => setActiveView("dashboard")}
            onNavigate={handleNavigate}
          />
        );
      case "remediation":
        return (
          <RemediationView
            onBack={() => setActiveView("dashboard")}
            onNavigate={handleNavigate}
          />
        );
      case "modernization":
        return (
          <ModernizationView
            onBack={() => setActiveView("dashboard")}
          />
        );
      case "exec":
        return (
          <ExecDashboard
            onBack={() => setActiveView("dashboard")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SalesforceShell
      onAgentforceClick={handleAgentforceClick}
      agentPanelOpen={agentPanelOpen}
      activeView={activeView}
      onNavigate={handleNavigate}
    >
      <div className="flex h-full">
        <div className="flex-1 overflow-y-auto">{renderView()}</div>
        <AgentforcePanel
          isOpen={agentPanelOpen}
          onClose={() => setAgentPanelOpen(false)}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div
            className="flex items-center gap-3 bg-[#fe9339] text-white px-5 py-3 rounded-lg shadow-lg cursor-pointer"
            onClick={() => {
              setShowToast(false);
              setSelectedHotspot(hotspots[2]);
              setActiveView("component-detail");
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span className="text-[13px] font-medium">{toastMessage}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowToast(false);
              }}
              className="ml-3 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </SalesforceShell>
  );
}
