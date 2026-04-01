"use client";

import React, { useState } from "react";
import { HotspotItem } from "@/lib/data";

interface ComponentDetailProps {
  item: HotspotItem;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function ComponentDetail({
  item,
  onBack,
  onNavigate,
}: ComponentDetailProps) {
  const [activeTab, setActiveTab] = useState("analysis");

  const isOrderTrigger = item.component === "OrderTrigger.cls";

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>{item.component}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-[40px] h-[40px] rounded-lg flex items-center justify-center ${
            item.risk === "Critical" ? "bg-[#ea001e]" : item.risk === "High" ? "bg-[#fe9339]" : "bg-[#0176d3]"
          }`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">{item.component}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className={`slds-badge ${
                item.risk === "Critical" ? "slds-badge-error" : item.risk === "High" ? "slds-badge-warning" : "slds-badge-info"
              }`}>
                {item.risk} Risk
              </span>
              <span className="text-[12px] text-[#706e6b]">{item.type}</span>
              <span className="text-[12px] text-[#706e6b]">Owner: {item.owner}</span>
              {item.aiGenerated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0ecff] text-[#5849be] rounded text-[10px] font-semibold">
                  🤖 AI-Generated
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="slds-btn" onClick={() => onNavigate("remediation")}>
            Suggest Fix
          </button>
          <button className="slds-btn slds-btn-brand" onClick={() => onNavigate("policy")}>
            Add Governance Rule
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="slds-tabs mb-5">
        {["Analysis", "Code", "History", "Dependencies"].map((tab) => (
          <div
            key={tab}
            className={`slds-tab ${activeTab === tab.toLowerCase() ? "active" : ""}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        {/* Left - Main Content */}
        <div className="space-y-5">
          {/* Risk Summary */}
          <div className="slds-card p-5">
            <h3 className="text-[14px] font-semibold text-[#181818] mb-4">Risk Analysis</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#fde8e8] rounded-lg p-3 text-center">
                <div className="text-[24px] font-bold text-[#ea001e]">{item.cpuImpact}</div>
                <div className="text-[11px] text-[#706e6b] mt-1">CPU Impact</div>
              </div>
              <div className="bg-[#fef3e5] rounded-lg p-3 text-center">
                <div className="text-[24px] font-bold text-[#8c4b00]">87%</div>
                <div className="text-[11px] text-[#706e6b] mt-1">Governor Limit Proximity</div>
              </div>
              <div className="bg-[#e5f1fd] rounded-lg p-3 text-center">
                <div className="text-[24px] font-bold text-[#0176d3]">{item.confidence}%</div>
                <div className="text-[11px] text-[#706e6b] mt-1">Detection Confidence</div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-[#fafaf9] border border-[#e5e5e5] rounded-lg p-4">
              <div className="text-[13px] font-semibold text-[#181818] mb-2">
                Detected Issue
              </div>
              <div className="text-[13px] text-[#444] mb-3">{item.issue}</div>
              <div className="space-y-2 text-[12px]">
                <div className="flex gap-2">
                  <span className="text-[#ea001e] font-semibold">Impact:</span>
                  <span className="text-[#444]">Under 500+ concurrent records, this pattern causes ~{item.cpuImpact.replace("+", "")} CPU increase</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#fe9339] font-semibold">Pattern:</span>
                  <span className="text-[#444]">{isOrderTrigger ? "SOQL query inside for-loop — non-bulkified data access" : "Recursive execution with insufficient termination conditions"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#0176d3] font-semibold">Recommendation:</span>
                  <span className="text-[#444]">{isOrderTrigger ? "Move SOQL outside loop, use Map-based lookup pattern" : "Add recursion guard, refactor subflow invocation"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code View */}
          <div className="slds-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] bg-[#fafaf9]">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#181818]">Source Code</span>
                <span className="text-[11px] text-[#706e6b]">Lines 38–56</span>
              </div>
              <div className="flex gap-2">
                <button className="text-[11px] text-[#0176d3] hover:underline cursor-pointer">
                  View Full File
                </button>
              </div>
            </div>
            <div className="code-block">
              {isOrderTrigger ? (
                <>
                  <div><span className="keyword">trigger</span> <span className="function">OrderTrigger</span> <span className="keyword">on</span> <span className="type">Order</span> (before insert, before update) {"{"}</div>
                  <div>&nbsp;</div>
                  <div>    <span className="keyword">List</span>&lt;<span className="type">Order</span>&gt; ordersToProcess = <span className="keyword">Trigger</span>.new;</div>
                  <div>&nbsp;</div>
                  <div>    <span className="keyword">for</span> (<span className="type">Order</span> o : ordersToProcess) {"{"}</div>
                  <div className="error-highlight">        <span className="comment">// ⚠️ SOQL inside loop — anti-pattern detected</span></div>
                  <div className="error-highlight">        <span className="type">Account</span> acc = [<span className="keyword">SELECT</span> Id, Name, BillingCity</div>
                  <div className="error-highlight">                         <span className="keyword">FROM</span> <span className="type">Account</span></div>
                  <div className="error-highlight">                         <span className="keyword">WHERE</span> Id = :o.AccountId];</div>
                  <div>&nbsp;</div>
                  <div>        <span className="keyword">if</span> (acc != <span className="keyword">null</span>) {"{"}</div>
                  <div>            o.ShippingCity = acc.BillingCity;</div>
                  <div>            o.Status = <span className="string">&apos;Processing&apos;</span>;</div>
                  <div>        {"}"}</div>
                  <div>    {"}"}</div>
                  <div>{"}"}</div>
                </>
              ) : (
                <>
                  <div><span className="keyword">public class</span> <span className="type">{item.component.replace(".cls", "")}</span> {"{"}</div>
                  <div>&nbsp;</div>
                  <div>    <span className="keyword">public static void</span> <span className="function">processRecords</span>(<span className="type">List</span>&lt;<span className="type">SObject</span>&gt; records) {"{"}</div>
                  <div className="error-highlight">        <span className="comment">// ⚠️ Potential runtime risk detected</span></div>
                  <div className="error-highlight">        <span className="keyword">for</span> (<span className="type">SObject</span> rec : records) {"{"}</div>
                  <div className="error-highlight">            <span className="keyword">insert</span> <span className="keyword">new</span> <span className="type">Task</span>(WhatId = rec.Id);</div>
                  <div className="error-highlight">        {"}"}</div>
                  <div>    {"}"}</div>
                  <div>{"}"}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right - Metadata Panel */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="slds-card p-4">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-3">Component Details</h3>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Component</span>
                <span className="font-medium">{item.component}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Type</span>
                <span>{item.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Owner</span>
                <span>{item.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Last Modified</span>
                <span>{item.lastModified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">API Version</span>
                <span>v62.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Lines of Code</span>
                <span>{isOrderTrigger ? "156" : "243"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706e6b]">Test Coverage</span>
                <span className="text-[#fe9339] font-semibold">{isOrderTrigger ? "62%" : "48%"}</span>
              </div>
            </div>
          </div>

          {/* Runtime Metrics */}
          <div className="slds-card p-4">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-3">Runtime Metrics (7d Avg)</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#706e6b]">CPU Time</span>
                  <span className="text-[#ea001e] font-semibold">4,218ms</span>
                </div>
                <div className="h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ea001e] rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#706e6b]">SOQL Queries</span>
                  <span className="text-[#fe9339] font-semibold">87/100</span>
                </div>
                <div className="h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fe9339] rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#706e6b]">Heap Size</span>
                  <span className="text-[#0176d3] font-semibold">3.2MB / 6MB</span>
                </div>
                <div className="h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0176d3] rounded-full" style={{ width: "53%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#706e6b]">DML Statements</span>
                  <span className="text-[#2e844a] font-semibold">42/150</span>
                </div>
                <div className="h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2e844a] rounded-full" style={{ width: "28%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Components */}
          <div className="slds-card p-4">
            <h3 className="text-[13px] font-semibold text-[#181818] mb-3">Related Components</h3>
            <div className="space-y-2">
              {["OrderService.cls", "OrderHelper.cls", "AccountTrigger.cls"].map((comp) => (
                <div key={comp} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#f3f3f3] cursor-pointer transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0176d3" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                  </svg>
                  <span className="text-[12px] text-[#0176d3]">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              className="slds-btn slds-btn-brand w-full"
              onClick={() => onNavigate("remediation")}
            >
              🔧 Generate AI Fix
            </button>
            <button
              className="slds-btn w-full"
              onClick={() => onNavigate("policy")}
            >
              🛡️ Add Governance Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
