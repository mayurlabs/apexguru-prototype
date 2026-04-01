"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ConversationMessage,
  initialConversation,
  conversationFlows,
} from "@/lib/data";

interface AgentforcePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

function AgentAvatar() {
  return (
    <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#5849be] to-[#1b96ff] flex items-center justify-center shrink-0 shadow-md">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  );
}

function formatAgentMessage(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let processed: React.ReactNode = line;

    if (line.startsWith("**") && line.endsWith("**")) {
      processed = (
        <strong key={i} className="text-[#181818] font-semibold block mt-2 mb-1">
          {line.replace(/\*\*/g, "")}
        </strong>
      );
    } else if (line.match(/^\*\*.+\*\*/)) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      processed = (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j} className="font-semibold text-[#181818]">
                {part.replace(/\*\*/g, "")}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </span>
      );
    } else if (line.startsWith("• ") || line.startsWith("→ ")) {
      processed = (
        <div key={i} className="pl-3 text-[12.5px] leading-relaxed">
          {line.startsWith("• ") ? "• " : "→ "}
          {line.substring(2).split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j} className="font-semibold">{part.replace(/\*\*/g, "")}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      );
    } else if (line.startsWith("| ")) {
      return;
    } else if (line.startsWith("#")) {
      return;
    } else if (line.startsWith("🔴") || line.startsWith("⚠️") || line.startsWith("✅") || line.startsWith("📊") || line.startsWith("📈") || line.startsWith("💰") || line.startsWith("🚫") || line.startsWith("❌")) {
      processed = (
        <div key={i} className="mt-1.5 text-[12.5px] leading-relaxed">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j} className="font-semibold">{part.replace(/\*\*/g, "")}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      );
    } else if (line.match(/^\d+\./)) {
      processed = (
        <div key={i} className="mt-1 text-[12.5px] leading-relaxed">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j} className="font-semibold">{part.replace(/\*\*/g, "")}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      );
    }

    if (line === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      elements.push(
        <div key={i} className="text-[12.5px] leading-relaxed text-[#444]">
          {processed}
        </div>
      );
    }
  });

  return <>{elements}</>;
}

export default function AgentforcePanel({
  isOpen,
  onClose,
  onNavigate,
}: AgentforcePanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialConversation);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAction = (actionId: string) => {
    if (actionId === "view-code") {
      onNavigate("component-detail");
      return;
    }
    if (actionId === "view-block") {
      onNavigate("deployment");
      return;
    }
    if (actionId === "view-fix") {
      onNavigate("remediation");
      return;
    }
    if (actionId === "customize-policy" || actionId === "view-governance") {
      onNavigate("policy");
      return;
    }
    if (actionId === "view-modernization") {
      onNavigate("modernization");
      return;
    }
    if (actionId === "view-mod-intelligence") {
      onNavigate("mod-intelligence");
      return;
    }
    if (actionId === "view-exec") {
      onNavigate("exec");
      return;
    }
    if (actionId === "refresh-dashboard") {
      onNavigate("dashboard");
      return;
    }

    const flow = conversationFlows[actionId];
    if (flow) {
      setIsTyping(true);
      const userMsg = flow[0];
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, ...flow.slice(1)]);
      }, 1200);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentReply: ConversationMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content:
          "I understand your question. Based on your org's current runtime telemetry and Code Risk Index of 72, I'd recommend focusing on the **3 critical hotspots** first.\n\nWould you like me to walk through the specific components?",
        actions: [
          { label: "Show hotspots", actionId: "show-hotspots" },
          { label: "Set up governance", actionId: "governance" },
        ],
      };
      setMessages((prev) => [...prev, agentReply]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[340px] h-full bg-white border-l border-[#e5e5e5] flex flex-col shrink-0 agent-slide-in z-40 shadow-[-2px_0_8px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="h-[48px] border-b border-[#e5e5e5] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#181818]">Agentforce</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
          <button className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f3f3f3] text-[#706e6b] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="fade-in"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {msg.role === "agent" ? (
              <div className="flex gap-3">
                <AgentAvatar />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#f3f3f3] rounded-lg rounded-tl-none p-3 mb-2">
                    {formatAgentMessage(msg.content)}
                  </div>
                  {msg.actions && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actions.map((action) => (
                        <button
                          key={action.actionId}
                          onClick={() => handleAction(action.actionId)}
                          className="px-3 py-1.5 text-[11.5px] font-medium text-[#0176d3] bg-white border border-[#d8dde6] rounded-[4px] hover:bg-[#e5f1fd] hover:border-[#0176d3] transition-all cursor-pointer whitespace-nowrap"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-[#0176d3] text-white rounded-lg rounded-tr-none px-3 py-2 max-w-[85%]">
                  <div className="text-[12.5px]">{msg.content}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 fade-in">
            <AgentAvatar />
            <div className="bg-[#f3f3f3] rounded-lg rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#939393] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#939393] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#939393] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#e5e5e5] p-3 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Describe your task or ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full h-[36px] border border-[#c9c9c9] rounded-[4px] pl-3 pr-10 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:shadow-[0_0_0_1px_#0176d3] transition-all placeholder-[#939393]"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[24px] h-[24px] flex items-center justify-center text-[#0176d3] hover:bg-[#e5f1fd] rounded transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
