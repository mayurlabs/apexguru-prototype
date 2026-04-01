"use client";

import React, { useState } from "react";

interface RemediationViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function RemediationView({ onBack, onNavigate }: RemediationViewProps) {
  const [activeRemedy, setActiveRemedy] = useState(0);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 2000);
  };

  const handleApply = () => {
    setApplied(true);
  };

  const remedies = [
    {
      component: "OrderTrigger.cls",
      risk: "Critical → Low",
      confidence: 94,
      cpuReduction: "-38%",
      issue: "SOQL inside loop",
      fix: "Bulkified query — Map-based lookup",
    },
    {
      component: "AI_LoanApprovalHandler.cls",
      risk: "High → Low",
      confidence: 87,
      cpuReduction: "-24%",
      issue: "DML inside conditional loop",
      fix: "Batch DML with governor checks",
    },
    {
      component: "CheckoutFlow",
      risk: "Critical → Medium",
      confidence: 72,
      cpuReduction: "-28%",
      issue: "Recursive subflow execution",
      fix: "Recursion guard + flow restructure",
    },
  ];

  const active = remedies[activeRemedy];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#706e6b] mb-3">
        <button onClick={onBack} className="text-[#0176d3] hover:underline cursor-pointer">
          ApexGuru — Code Risk Intelligence
        </button>
        <span>›</span>
        <span>AI Remediation</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-[#2e844a] rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-normal text-[#181818]">
              AI Controlled Remediation
            </h1>
            <div className="text-[12px] text-[#706e6b]">
              Intelligent code fixes with confidence scoring and sandbox validation
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {applied && (
        <div className="bg-[#e6f4ea] border border-[#2e844a]/20 rounded-lg p-4 mb-5 fade-in">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#2e844a">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <div className="text-[14px] font-semibold text-[#2e844a]">
                Remediation Applied Successfully
              </div>
              <div className="text-[12px] text-[#444]">
                {active.component} has been fixed. CRI improved: 72 → 79 (+7 points)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remedy Selector */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {remedies.map((r, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveRemedy(i);
              setValidated(false);
              setApplied(false);
              setValidating(false);
            }}
            className={`slds-card p-4 text-left transition-all cursor-pointer ${
              activeRemedy === i
                ? "border-[#0176d3] shadow-[0_0_0_1px_#0176d3]"
                : "hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#181818]">{r.component}</span>
              <span className={`text-[18px] font-bold ${r.confidence >= 85 ? "text-[#2e844a]" : "text-[#fe9339]"}`}>
                {r.confidence}%
              </span>
            </div>
            <div className="text-[11px] text-[#706e6b] mb-1">{r.issue}</div>
            <div className="flex items-center gap-2">
              <span className={`slds-badge ${r.confidence >= 85 ? "slds-badge-success" : "slds-badge-warning"}`}>
                {r.risk}
              </span>
              <span className="text-[11px] text-[#2e844a] font-semibold">{r.cpuReduction} CPU</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Before */}
        <div className="slds-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e5e5] bg-[#fde8e8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#ea001e]">Before (Current)</span>
              <span className="slds-badge slds-badge-error">Risky</span>
            </div>
          </div>
          <div className="code-block text-[11.5px]">
            {activeRemedy === 0 ? (
              <>
                <div><span className="keyword">trigger</span> <span className="function">OrderTrigger</span> <span className="keyword">on</span> <span className="type">Order</span> (before insert, before update) {"{"}</div>
                <div>&nbsp;</div>
                <div>    <span className="keyword">for</span> (<span className="type">Order</span> o : <span className="keyword">Trigger</span>.new) {"{"}</div>
                <div className="error-highlight">        <span className="comment">// ⚠️ SOQL inside loop</span></div>
                <div className="error-highlight">        <span className="type">Account</span> acc = [<span className="keyword">SELECT</span> Id, Name,</div>
                <div className="error-highlight">            BillingCity</div>
                <div className="error-highlight">            <span className="keyword">FROM</span> <span className="type">Account</span></div>
                <div className="error-highlight">            <span className="keyword">WHERE</span> Id = :o.AccountId];</div>
                <div>&nbsp;</div>
                <div>        <span className="keyword">if</span> (acc != <span className="keyword">null</span>) {"{"}</div>
                <div>            o.ShippingCity = acc.BillingCity;</div>
                <div>            o.Status = <span className="string">&apos;Processing&apos;</span>;</div>
                <div>        {"}"}</div>
                <div>    {"}"}</div>
                <div>{"}"}</div>
              </>
            ) : activeRemedy === 1 ? (
              <>
                <div><span className="keyword">public class</span> <span className="type">AI_LoanApprovalHandler</span> {"{"}</div>
                <div>&nbsp;</div>
                <div>    <span className="keyword">public static void</span> <span className="function">process</span>(<span className="type">List</span>&lt;<span className="type">Loan__c</span>&gt; loans) {"{"}</div>
                <div>        <span className="keyword">for</span> (<span className="type">Loan__c</span> loan : loans) {"{"}</div>
                <div className="error-highlight">            <span className="comment">// ⚠️ DML inside loop</span></div>
                <div className="error-highlight">            <span className="keyword">if</span> (loan.Status__c == <span className="string">&apos;Approved&apos;</span>) {"{"}</div>
                <div className="error-highlight">                <span className="keyword">insert new</span> <span className="type">Task</span>(</div>
                <div className="error-highlight">                    WhatId = loan.Id,</div>
                <div className="error-highlight">                    Subject = <span className="string">&apos;Follow up&apos;</span></div>
                <div className="error-highlight">                );</div>
                <div className="error-highlight">            {"}"}</div>
                <div>        {"}"}</div>
                <div>    {"}"}</div>
                <div>{"}"}</div>
              </>
            ) : (
              <>
                <div><span className="comment">{"<!-- CheckoutFlow -->"}</span></div>
                <div>&nbsp;</div>
                <div><span className="keyword">&lt;Flow&gt;</span></div>
                <div>  <span className="keyword">&lt;Decision&gt;</span></div>
                <div>    <span className="keyword">&lt;name&gt;</span>CheckOrderStatus<span className="keyword">&lt;/name&gt;</span></div>
                <div className="error-highlight">    <span className="comment">{"<!-- ⚠️ Recursive subflow call -->"}</span></div>
                <div className="error-highlight">    <span className="keyword">&lt;SubflowRef&gt;</span>CheckoutFlow<span className="keyword">&lt;/SubflowRef&gt;</span></div>
                <div>  <span className="keyword">&lt;/Decision&gt;</span></div>
                <div><span className="keyword">&lt;/Flow&gt;</span></div>
              </>
            )}
          </div>
        </div>

        {/* After */}
        <div className="slds-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e5e5] bg-[#e6f4ea] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#2e844a]">After (Optimized)</span>
              <span className="slds-badge slds-badge-success">Safe</span>
            </div>
            <span className="text-[12px] font-semibold text-[#2e844a]">
              Confidence: {active.confidence}%
            </span>
          </div>
          <div className="code-block text-[11.5px]">
            {activeRemedy === 0 ? (
              <>
                <div><span className="keyword">trigger</span> <span className="function">OrderTrigger</span> <span className="keyword">on</span> <span className="type">Order</span> (before insert, before update) {"{"}</div>
                <div>&nbsp;</div>
                <div className="fix-highlight">    <span className="comment">// ✅ Bulkified — SOQL moved outside loop</span></div>
                <div className="fix-highlight">    <span className="type">Set</span>&lt;<span className="type">Id</span>&gt; accountIds = <span className="keyword">new</span> <span className="type">Set</span>&lt;<span className="type">Id</span>&gt;();</div>
                <div className="fix-highlight">    <span className="keyword">for</span> (<span className="type">Order</span> o : <span className="keyword">Trigger</span>.new) {"{"}</div>
                <div className="fix-highlight">        accountIds.add(o.AccountId);</div>
                <div className="fix-highlight">    {"}"}</div>
                <div className="fix-highlight">&nbsp;</div>
                <div className="fix-highlight">    <span className="type">Map</span>&lt;<span className="type">Id</span>, <span className="type">Account</span>&gt; accMap = <span className="keyword">new</span> <span className="type">Map</span>&lt;<span className="type">Id</span>, <span className="type">Account</span>&gt;(</div>
                <div className="fix-highlight">        [<span className="keyword">SELECT</span> Id, Name, BillingCity</div>
                <div className="fix-highlight">         <span className="keyword">FROM</span> <span className="type">Account</span></div>
                <div className="fix-highlight">         <span className="keyword">WHERE</span> Id <span className="keyword">IN</span> :accountIds]</div>
                <div className="fix-highlight">    );</div>
                <div>&nbsp;</div>
                <div>    <span className="keyword">for</span> (<span className="type">Order</span> o : <span className="keyword">Trigger</span>.new) {"{"}</div>
                <div>        <span className="type">Account</span> acc = accMap.get(o.AccountId);</div>
                <div>        <span className="keyword">if</span> (acc != <span className="keyword">null</span>) {"{"}</div>
                <div>            o.ShippingCity = acc.BillingCity;</div>
                <div>            o.Status = <span className="string">&apos;Processing&apos;</span>;</div>
                <div>        {"}"}</div>
                <div>    {"}"}</div>
                <div>{"}"}</div>
              </>
            ) : activeRemedy === 1 ? (
              <>
                <div><span className="keyword">public class</span> <span className="type">AI_LoanApprovalHandler</span> {"{"}</div>
                <div>&nbsp;</div>
                <div>    <span className="keyword">public static void</span> <span className="function">process</span>(<span className="type">List</span>&lt;<span className="type">Loan__c</span>&gt; loans) {"{"}</div>
                <div className="fix-highlight">        <span className="comment">// ✅ Batch DML — collected outside loop</span></div>
                <div className="fix-highlight">        <span className="type">List</span>&lt;<span className="type">Task</span>&gt; tasksToInsert = <span className="keyword">new</span> <span className="type">List</span>&lt;<span className="type">Task</span>&gt;();</div>
                <div className="fix-highlight">&nbsp;</div>
                <div>        <span className="keyword">for</span> (<span className="type">Loan__c</span> loan : loans) {"{"}</div>
                <div>            <span className="keyword">if</span> (loan.Status__c == <span className="string">&apos;Approved&apos;</span>) {"{"}</div>
                <div className="fix-highlight">                tasksToInsert.add(<span className="keyword">new</span> <span className="type">Task</span>(</div>
                <div className="fix-highlight">                    WhatId = loan.Id,</div>
                <div className="fix-highlight">                    Subject = <span className="string">&apos;Follow up&apos;</span></div>
                <div className="fix-highlight">                ));</div>
                <div>            {"}"}</div>
                <div>        {"}"}</div>
                <div className="fix-highlight">&nbsp;</div>
                <div className="fix-highlight">        <span className="keyword">if</span> (!tasksToInsert.isEmpty()) {"{"}</div>
                <div className="fix-highlight">            <span className="keyword">insert</span> tasksToInsert;</div>
                <div className="fix-highlight">        {"}"}</div>
                <div>    {"}"}</div>
                <div>{"}"}</div>
              </>
            ) : (
              <>
                <div><span className="comment">{"<!-- CheckoutFlow — Fixed -->"}</span></div>
                <div>&nbsp;</div>
                <div><span className="keyword">&lt;Flow&gt;</span></div>
                <div>  <span className="keyword">&lt;Decision&gt;</span></div>
                <div>    <span className="keyword">&lt;name&gt;</span>CheckOrderStatus<span className="keyword">&lt;/name&gt;</span></div>
                <div className="fix-highlight">    <span className="comment">{"<!-- ✅ Removed recursive call -->"}</span></div>
                <div className="fix-highlight">    <span className="keyword">&lt;SubflowRef&gt;</span>OrderValidation<span className="keyword">&lt;/SubflowRef&gt;</span></div>
                <div className="fix-highlight">    <span className="keyword">&lt;RecursionGuard&gt;</span>true<span className="keyword">&lt;/RecursionGuard&gt;</span></div>
                <div>  <span className="keyword">&lt;/Decision&gt;</span></div>
                <div><span className="keyword">&lt;/Flow&gt;</span></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Validation Section */}
      <div className="slds-card p-5 mt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#181818] mb-1">Sandbox Validation</h3>
            <p className="text-[12px] text-[#706e6b]">
              Validate the fix in sandbox before applying to production
            </p>
          </div>
          <div className="flex gap-3">
            {!validated && !validating && (
              <button className="slds-btn slds-btn-brand" onClick={handleValidate}>
                ▶ Validate in Sandbox
              </button>
            )}
            {validating && (
              <div className="flex items-center gap-2 text-[13px] text-[#0176d3]">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" />
                </svg>
                Running sandbox validation...
              </div>
            )}
            {validated && !applied && (
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#2e844a] font-semibold">✅ Validation Passed</span>
                <button className="slds-btn slds-btn-success" onClick={handleApply}>
                  Apply Fix
                </button>
              </div>
            )}
            {applied && (
              <span className="text-[13px] text-[#2e844a] font-semibold">✅ Applied Successfully</span>
            )}
          </div>
        </div>

        {validated && (
          <div className="grid grid-cols-4 gap-4 mt-4 fade-in">
            <div className="bg-[#e6f4ea] rounded-lg p-3 text-center">
              <div className="text-[20px] font-bold text-[#2e844a]">{active.cpuReduction}</div>
              <div className="text-[11px] text-[#706e6b]">CPU Reduction</div>
            </div>
            <div className="bg-[#e6f4ea] rounded-lg p-3 text-center">
              <div className="text-[20px] font-bold text-[#2e844a]">0</div>
              <div className="text-[11px] text-[#706e6b]">Test Failures</div>
            </div>
            <div className="bg-[#e6f4ea] rounded-lg p-3 text-center">
              <div className="text-[20px] font-bold text-[#2e844a]">{active.confidence}%</div>
              <div className="text-[11px] text-[#706e6b]">Confidence</div>
            </div>
            <div className="bg-[#e6f4ea] rounded-lg p-3 text-center">
              <div className="text-[20px] font-bold text-[#2e844a]">Low</div>
              <div className="text-[11px] text-[#706e6b]">Residual Risk</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
