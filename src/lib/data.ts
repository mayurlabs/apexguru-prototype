export interface HotspotItem {
  id: string;
  component: string;
  type: "Apex" | "Flow" | "LWC" | "Trigger" | "Batch";
  risk: "Critical" | "High" | "Medium" | "Low";
  issue: string;
  owner: string;
  cpuImpact: string;
  aiGenerated: boolean;
  lastModified: string;
  confidence: number;
}

export interface RiskCategory {
  label: string;
  score: number;
  trend: "up" | "down" | "stable";
  delta: number;
  icon: string;
}

export interface GovernanceStat {
  label: string;
  value: number;
  subtext: string;
  color: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  action: "Block" | "Review" | "Warn" | "Allow";
  scope: string;
  enabled: boolean;
  sfEnforced?: boolean;
  sfEnforcedReason?: string;
}

export interface ConversationMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  actions?: { label: string; actionId: string }[];
  timestamp?: string;
}

export interface ModernizationItem {
  id: string;
  title: string;
  description: string;
  type: "Duplicate" | "Legacy" | "Unused" | "Refactor";
  impact: "High" | "Medium" | "Low";
  affectedComponents: number;
  recommendation: "Consolidate" | "Retire" | "Simplify" | "Reuse";
}

export interface TrendDataPoint {
  date: string;
  score: number;
}

export const orgCRI = {
  score: 72,
  previousScore: 81,
  trend: "down" as const,
  delta: -9,
  riskLevel: "Moderate" as const,
  lastUpdated: "Apr 1, 2026 8:00 AM UTC",
  totalClasses: 1247,
  totalFlows: 384,
  totalTriggers: 89,
  aiGeneratedPercent: 23,
  aiConfidence: 64,
};

export const riskCategories: RiskCategory[] = [
  { label: "Performance Risk", score: 68, trend: "up", delta: 8, icon: "⚡" },
  { label: "Security Risk", score: 82, trend: "stable", delta: 0, icon: "🛡️" },
  { label: "AI Code Risk", score: 59, trend: "down", delta: -12, icon: "🤖" },
  { label: "Maintainability", score: 61, trend: "down", delta: -5, icon: "🔧" },
];

export const hotspots: HotspotItem[] = [
  {
    id: "hs-1",
    component: "OrderTrigger.cls",
    type: "Trigger",
    risk: "Critical",
    issue: "SOQL inside loop — CPU spike under concurrency",
    owner: "Payments Team",
    cpuImpact: "+42% CPU",
    aiGenerated: false,
    lastModified: "Mar 28, 2026",
    confidence: 96,
  },
  {
    id: "hs-2",
    component: "CheckoutFlow",
    type: "Flow",
    risk: "Critical",
    issue: "Recursive execution path — infinite loop risk",
    owner: "CX Team",
    cpuImpact: "+35% CPU",
    aiGenerated: false,
    lastModified: "Mar 25, 2026",
    confidence: 91,
  },
  {
    id: "hs-3",
    component: "AI_LoanApprovalHandler.cls",
    type: "Apex",
    risk: "High",
    issue: "Low-confidence AI-generated logic — governor limit risk",
    owner: "AI Platform",
    cpuImpact: "+28% CPU",
    aiGenerated: true,
    lastModified: "Mar 30, 2026",
    confidence: 62,
  },
  {
    id: "hs-4",
    component: "PaymentService.cls",
    type: "Apex",
    risk: "High",
    issue: "Unoptimized batch processing — latency under load",
    owner: "Platform Team",
    cpuImpact: "+22% CPU",
    aiGenerated: false,
    lastModified: "Mar 22, 2026",
    confidence: 88,
  },
  {
    id: "hs-5",
    component: "LeadConversionBatch.cls",
    type: "Batch",
    risk: "Medium",
    issue: "Row lock contention on high-volume object",
    owner: "Sales Ops",
    cpuImpact: "+15% CPU",
    aiGenerated: false,
    lastModified: "Mar 18, 2026",
    confidence: 84,
  },
  {
    id: "hs-6",
    component: "CaseEscalationLWC",
    type: "LWC",
    risk: "Medium",
    issue: "Excessive wire adapter calls — render performance",
    owner: "Service Team",
    cpuImpact: "+12% CPU",
    aiGenerated: false,
    lastModified: "Mar 15, 2026",
    confidence: 79,
  },
  {
    id: "hs-7",
    component: "AI_AccountEnrichment.cls",
    type: "Apex",
    risk: "High",
    issue: "AI-generated DML in loop — bulk failure risk",
    owner: "AI Platform",
    cpuImpact: "+25% CPU",
    aiGenerated: true,
    lastModified: "Mar 29, 2026",
    confidence: 58,
  },
  {
    id: "hs-8",
    component: "OpportunityTrigger.cls",
    type: "Trigger",
    risk: "Medium",
    issue: "Nested trigger invocation — cascading execution",
    owner: "Revenue Team",
    cpuImpact: "+18% CPU",
    aiGenerated: false,
    lastModified: "Mar 20, 2026",
    confidence: 82,
  },
];

export const governanceStats: GovernanceStat[] = [
  { label: "Active Policies", value: 3, subtext: "2 enforcing, 1 advisory", color: "#0176d3" },
  { label: "Blocked (7d)", value: 6, subtext: "3 critical, 3 high risk", color: "#ea001e" },
  { label: "Warnings (7d)", value: 18, subtext: "12 auto-resolved", color: "#fe9339" },
  { label: "Auto-Fixed", value: 4, subtext: "100% validated", color: "#2e844a" },
];

export const defaultPolicies: PolicyRule[] = [
  {
    id: "pol-sf-1",
    name: "Governor Limit Violation Prevention",
    condition: "Projected SOQL/DML/CPU exceeds 90% of governor limit",
    action: "Block",
    scope: "All deployments",
    enabled: true,
    sfEnforced: true,
    sfEnforcedReason: "Salesforce platform stability — governor limit violations cause runtime failures across multi-tenant infrastructure",
  },
  {
    id: "pol-sf-2",
    name: "Critical Anti-Pattern Detection",
    condition: "SOQL/DML inside loop OR recursive trigger/flow without guard",
    action: "Block",
    scope: "All deployments",
    enabled: true,
    sfEnforced: true,
    sfEnforcedReason: "Salesforce best practices — these patterns cause cascading failures in multi-tenant environments and are never acceptable in production",
  },
  {
    id: "pol-sf-3",
    name: "Deprecated API Version Block",
    condition: "Component uses API version < v50 (EOL)",
    action: "Block",
    scope: "Production deployments",
    enabled: true,
    sfEnforced: true,
    sfEnforcedReason: "Salesforce platform compliance — end-of-life API versions are unsupported and may break without notice",
  },
  {
    id: "pol-1",
    name: "Critical Runtime Risk Block",
    condition: "CRI component score < 50 OR CPU regression > 30%",
    action: "Block",
    scope: "All deployments",
    enabled: true,
  },
  {
    id: "pol-2",
    name: "High Risk Review Gate",
    condition: "CRI component score 50–70 OR CPU regression 15–30%",
    action: "Review",
    scope: "Production deployments",
    enabled: true,
  },
  {
    id: "pol-3",
    name: "AI Code Validation",
    condition: "AI-generated code with confidence < 70%",
    action: "Review",
    scope: "All AI-generated changes",
    enabled: true,
  },
  {
    id: "pol-4",
    name: "Medium Risk Advisory",
    condition: "CRI component score 70–80",
    action: "Warn",
    scope: "All deployments",
    enabled: true,
  },
  {
    id: "pol-5",
    name: "Governor Limit Proximity",
    condition: "Projected governor limit usage > 80%",
    action: "Review",
    scope: "Production deployments",
    enabled: false,
  },
];

export const criTrend: TrendDataPoint[] = [
  { date: "Mar 1", score: 84 },
  { date: "Mar 4", score: 83 },
  { date: "Mar 7", score: 82 },
  { date: "Mar 10", score: 81 },
  { date: "Mar 13", score: 81 },
  { date: "Mar 16", score: 80 },
  { date: "Mar 19", score: 78 },
  { date: "Mar 22", score: 77 },
  { date: "Mar 25", score: 75 },
  { date: "Mar 28", score: 73 },
  { date: "Mar 31", score: 72 },
];

export const modernizationItems: ModernizationItem[] = [
  {
    id: "mod-1",
    title: "Duplicate Account Validation Logic",
    description: "Same validation logic found in 5 Apex classes and 2 Flows. Can be consolidated into a single reusable service.",
    type: "Duplicate",
    impact: "High",
    affectedComponents: 7,
    recommendation: "Consolidate",
  },
  {
    id: "mod-2",
    title: "Legacy Trigger Pattern — OrderTrigger",
    description: "Uses deprecated trigger pattern without bulkification. Recommend migration to trigger framework or Flow.",
    type: "Legacy",
    impact: "High",
    affectedComponents: 3,
    recommendation: "Simplify",
  },
  {
    id: "mod-3",
    title: "Unused Apex Methods (47 detected)",
    description: "47 public methods across 12 classes have zero invocation in the last 90 days. Safe to retire.",
    type: "Unused",
    impact: "Medium",
    affectedComponents: 12,
    recommendation: "Retire",
  },
  {
    id: "mod-4",
    title: "Redundant Error Handling Patterns",
    description: "Custom error handling duplicated in 8 service classes. Can be refactored into shared utility.",
    type: "Duplicate",
    impact: "Medium",
    affectedComponents: 8,
    recommendation: "Reuse",
  },
  {
    id: "mod-5",
    title: "Deprecated API Version References",
    description: "14 classes reference API versions below v55. Recommend upgrade for compatibility and performance.",
    type: "Legacy",
    impact: "Low",
    affectedComponents: 14,
    recommendation: "Simplify",
  },
];

export const execMetrics = {
  riskReduced: 18,
  incidentsAvoided: 3,
  deploymentsBlocked: 6,
  autoRemediations: 4,
  avgDeployTime: "12 min",
  codeQualityImproved: 22,
  supportCasesReduced: 31,
  aiCodeCoverage: 23,
};

export const deploymentBlockData = {
  deploymentId: "DEP-2026-0401-0847",
  timestamp: "Apr 1, 2026 08:47 AM UTC",
  initiatedBy: "Sarah Chen (DevOps)",
  environment: "Production",
  components: [
    { name: "AI_LoanApprovalHandler.cls", type: "Apex", risk: "Critical" },
    { name: "LoanApprovalFlow", type: "Flow", risk: "High" },
    { name: "LoanService.cls", type: "Apex", risk: "Medium" },
  ],
  violations: [
    { rule: "Critical Runtime Risk Block", detail: "CPU regression projected at +35%", severity: "Critical" },
    { rule: "AI Code Validation", detail: "AI confidence score 58% (below 70% threshold)", severity: "High" },
    { rule: "Governor Limit Proximity", detail: "SOQL query count projected at 87% of limit", severity: "High" },
  ],
  criImpact: { before: 72, projected: 61 },
};

export const initialConversation: ConversationMessage[] = [
  {
    id: "msg-1",
    role: "agent",
    content: "Your Code Risk Index dropped from **81 → 72** this week.\n\nTop contributing factors:\n• New recursion pattern in **CheckoutFlow**\n• Increased CPU load in **OrderTrigger.cls**\n• Low-confidence AI-generated logic in **AI_LoanApprovalHandler.cls**\n\nHow would you like to proceed?",
    actions: [
      { label: "Understand the risk", actionId: "understand" },
      { label: "Show high-risk components", actionId: "show-hotspots" },
      { label: "Prevent future risk", actionId: "governance" },
      { label: "Suggest fixes", actionId: "remediation" },
      { label: "Assess modernization readiness", actionId: "mod-intelligence" },
    ],
  },
];

export const conversationFlows: Record<string, ConversationMessage[]> = {
  understand: [
    {
      id: "u-1",
      role: "user",
      content: "Understand the risk",
    },
    {
      id: "u-2",
      role: "agent",
      content: "Here's the breakdown of your org's risk position:\n\n**Performance Risk** has increased by **8 points** — primarily due to SOQL-in-loop patterns in OrderTrigger and recursive Flow execution in CheckoutFlow.\n\n**AI Code Risk** dropped **12 points** — your org has 23% AI-generated code with an average confidence of only 64%. The AI_LoanApprovalHandler has a confidence of just 58%.\n\n**Business Impact**: Under projected production load, these issues could increase checkout latency by **18%** and trigger **governor limit failures** during peak hours.",
      actions: [
        { label: "Show technical breakdown", actionId: "technical" },
        { label: "What should we do?", actionId: "governance" },
        { label: "View executive summary", actionId: "exec" },
      ],
    },
  ],
  technical: [
    {
      id: "t-1",
      role: "user",
      content: "Show technical breakdown",
    },
    {
      id: "t-2",
      role: "agent",
      content: "**Technical Risk Analysis**\n\n🔴 **OrderTrigger.cls** (Critical)\n→ SOQL query inside for-loop at line 47\n→ Under 500+ concurrent records: ~42% CPU increase\n→ Governor limit proximity: 87%\n\n🔴 **CheckoutFlow** (Critical)\n→ Recursive subflow call detected (depth 3+)\n→ Stack overflow risk under complex order scenarios\n→ CPU spike: +35%\n\n🔴 **AI_LoanApprovalHandler.cls** (High)\n→ AI-generated — confidence: 58%\n→ DML inside conditional loop\n→ No bulk-safe pattern detected\n\nWould you like to drill into a specific component?",
      actions: [
        { label: "View OrderTrigger code", actionId: "view-code" },
        { label: "Set up governance", actionId: "governance" },
        { label: "Generate fixes", actionId: "remediation" },
      ],
    },
  ],
  "show-hotspots": [
    {
      id: "sh-1",
      role: "user",
      content: "Show high-risk components",
    },
    {
      id: "sh-2",
      role: "agent",
      content: "Here are your **top risk hotspots** ranked by runtime impact:\n\n| # | Component | Risk | CPU Impact |\n|---|-----------|------|------------|\n| 1 | OrderTrigger.cls | 🔴 Critical | +42% |\n| 2 | CheckoutFlow | 🔴 Critical | +35% |\n| 3 | AI_LoanApprovalHandler | 🔴 High | +28% |\n| 4 | AI_AccountEnrichment | 🔴 High | +25% |\n| 5 | PaymentService.cls | ⚠️ High | +22% |\n\n3 of 5 top risks involve **AI-generated code** or **unoptimized triggers**.\n\nClick any component name in the dashboard to view detailed analysis.",
      actions: [
        { label: "View component details", actionId: "view-code" },
        { label: "Set up governance rules", actionId: "governance" },
        { label: "Modernize legacy code", actionId: "modernization" },
      ],
    },
  ],
  governance: [
    {
      id: "g-1",
      role: "user",
      content: "Set up governance to prevent this",
    },
    {
      id: "g-2",
      role: "agent",
      content: "Based on your org's scale and risk profile, I recommend these governance policies:\n\n**Policy 1: Critical Risk Block**\n→ Block deployment when CPU regression > 30%\n→ Applies to all deployments\n\n**Policy 2: AI Code Review Gate**\n→ Require review when AI confidence < 70%\n→ Applies to all AI-generated changes\n\n**Policy 3: High Risk Approval**\n→ Require architect approval for CRI score < 70\n→ Applies to production deployments\n\nThese policies would have **prevented 4 of the last 6 risky deployments**.\n\nWant me to activate these?",
      actions: [
        { label: "Apply recommended policies", actionId: "apply-policy" },
        { label: "Customize policies", actionId: "customize-policy" },
        { label: "Show what would have been blocked", actionId: "simulate" },
      ],
    },
  ],
  "apply-policy": [
    {
      id: "ap-1",
      role: "user",
      content: "Apply recommended policies",
    },
    {
      id: "ap-2",
      role: "agent",
      content: "✅ **Governance policies activated successfully.**\n\n3 policies now enforcing:\n• Critical Risk Block — **Active** (Enforcement)\n• AI Code Review Gate — **Active** (Enforcement)\n• High Risk Approval — **Active** (Advisory)\n\nCI/CD integration: **Connected**\nAudit logging: **Enabled**\n\nYour next deployment will be evaluated against these policies automatically.\n\nWould you like to simulate a deployment to see it in action?",
      actions: [
        { label: "Simulate deployment block", actionId: "simulate-deploy" },
        { label: "View governance dashboard", actionId: "view-governance" },
      ],
    },
  ],
  "simulate-deploy": [
    {
      id: "sd-1",
      role: "user",
      content: "Simulate a deployment block",
    },
    {
      id: "sd-2",
      role: "agent",
      content: "🚫 **Deployment Simulation — BLOCKED**\n\nDeployment: DEP-2026-0401-0847\nInitiated by: Sarah Chen (DevOps)\n\n**Violations detected:**\n\n1. ❌ CPU regression projected at **+35%** (threshold: 30%)\n2. ❌ AI confidence score **58%** (threshold: 70%)\n3. ⚠️ SOQL query count at **87%** of governor limit\n\n**CRI Impact:** 72 → 61 (projected drop of 11 points)\n\nThe deployment has been blocked. The team has been notified with specific remediation guidance.\n\nWant to see the full block screen?",
      actions: [
        { label: "View deployment block details", actionId: "view-block" },
        { label: "Generate fix for flagged code", actionId: "remediation" },
      ],
    },
  ],
  remediation: [
    {
      id: "r-1",
      role: "user",
      content: "Suggest fixes for risky code",
    },
    {
      id: "r-2",
      role: "agent",
      content: "I've analyzed the top 3 high-risk components and generated optimized versions:\n\n**1. OrderTrigger.cls** — Confidence: **94%**\n→ Bulkified SOQL query (moved outside loop)\n→ Projected CPU reduction: **-38%**\n→ Risk: Critical → Low\n\n**2. AI_LoanApprovalHandler.cls** — Confidence: **87%**\n→ Restructured DML for bulk safety\n→ Added governor limit checks\n→ Risk: High → Low\n\n**3. CheckoutFlow** — Confidence: **72%**\n→ Removed recursive subflow call\n→ Requires manual validation (complex logic)\n→ Risk: Critical → Medium\n\nFixes 1 and 2 are safe for auto-apply. Fix 3 requires human review.\n\nWant to view the code changes?",
      actions: [
        { label: "View code fix for OrderTrigger", actionId: "view-fix" },
        { label: "Apply safe fixes automatically", actionId: "auto-fix" },
        { label: "Validate in sandbox first", actionId: "sandbox" },
      ],
    },
  ],
  "auto-fix": [
    {
      id: "af-1",
      role: "user",
      content: "Apply safe fixes automatically",
    },
    {
      id: "af-2",
      role: "agent",
      content: "✅ **Auto-remediation applied successfully.**\n\n**OrderTrigger.cls** — Fixed\n→ SOQL moved outside loop\n→ Validated in sandbox: ✅ Passed\n→ CPU reduction confirmed: -38%\n\n**AI_LoanApprovalHandler.cls** — Fixed\n→ DML restructured for bulk safety\n→ Validated in sandbox: ✅ Passed\n→ CPU reduction confirmed: -24%\n\n**CheckoutFlow** — Pending human review\n→ Fix generated (confidence: 72%)\n→ Awaiting architect approval\n\n**Updated CRI: 72 → 79** ↑\n\nYour org risk has been measurably reduced.",
      actions: [
        { label: "View updated dashboard", actionId: "refresh-dashboard" },
        { label: "Review modernization opportunities", actionId: "modernization" },
      ],
    },
  ],
  modernization: [
    {
      id: "m-1",
      role: "user",
      content: "Review modernization opportunities",
    },
    {
      id: "m-2",
      role: "agent",
      content: "I've identified **5 modernization opportunities** in your org:\n\n**🔁 Consolidate** — Duplicate validation logic in 7 components\n→ Estimated effort: 3 days\n→ Impact: High\n\n**⚡ Simplify** — Legacy trigger pattern in OrderTrigger\n→ Migrate to trigger framework\n→ Impact: High\n\n**🗑️ Retire** — 47 unused public methods in 12 classes\n→ Zero invocations in 90 days\n→ Impact: Medium\n\n**♻️ Reuse** — Error handling patterns duplicated in 8 classes\n→ Create shared utility\n→ Impact: Medium\n\nTotal estimated improvement: **CRI +8-12 points**\n\nWant to view the full modernization plan?",
      actions: [
        { label: "View modernization details", actionId: "view-modernization" },
        { label: "Create refactor plan", actionId: "refactor-plan" },
      ],
    },
  ],
  "mod-intelligence": [
    {
      id: "mi-1",
      role: "user",
      content: "Assess modernization readiness",
    },
    {
      id: "mi-2",
      role: "agent",
      content: "**Modernization Intelligence Assessment**\n\nI've scanned your org's customization estate. Here's the summary:\n\n📊 **Org Composition**\n• 1,247 Apex classes · 384 Flows · 89 Triggers\n• 23% AI-generated code · 14 deprecated API versions\n• 47 unused methods · 7 duplicate logic clusters\n\n🤖 **AI-Readiness Score: 58/100** (Needs Work)\n→ High dependency sprawl reduces agent reasoning quality\n→ Redundant logic creates ambiguity for AI-generated code\n→ Legacy patterns limit platform-native optimizations\n\n**Modernization Map:**\n• 🟢 **Keep** — 68% of codebase (stable, well-structured)\n• 🟡 **Simplify** — 12% (legacy patterns, refactorable)\n• 🔵 **Modernize** — 11% (migrate to Flow/Orchestration)\n• 🔴 **Retire** — 9% (unused, redundant, or deprecated)\n\nWould you like to explore the full modernization map?",
      actions: [
        { label: "View modernization map", actionId: "view-mod-intelligence" },
        { label: "Show legacy clusters", actionId: "view-mod-intelligence" },
        { label: "AI-readiness deep dive", actionId: "view-mod-intelligence" },
      ],
    },
  ],
  exec: [
    {
      id: "e-1",
      role: "user",
      content: "View executive summary",
    },
    {
      id: "e-2",
      role: "agent",
      content: "**Executive Risk Summary — Q1 2026**\n\n📊 **Risk Position**\n• CRI: 72 (Moderate) — down from 84 at start of quarter\n• AI-generated code: 23% of codebase\n• High-risk components: 8 (up from 3)\n\n📈 **Governance Impact (Last 30 Days)**\n• Deployments blocked: 6 (preventing 3 potential incidents)\n• Auto-remediations applied: 4\n• Support cases reduced: 31%\n• Risk reduced: 18%\n\n💰 **Business Value**\n• Estimated incident cost avoided: ~$240K\n• Engineering hours saved: ~180 hours\n• Deployment confidence improved: 89%\n\nRecommendation: Tighten governance thresholds before next AI rollout phase.",
      actions: [
        { label: "View full exec dashboard", actionId: "view-exec" },
        { label: "Export report", actionId: "export" },
      ],
    },
  ],
};

// --- Modernization Intelligence Data ---

export interface LegacyCluster {
  id: string;
  name: string;
  objects: string[];
  componentCount: number;
  triggerCount: number;
  flowCount: number;
  apexCount: number;
  automationDensity: "High" | "Medium" | "Low";
  entryPoints: number;
  recommendation: "Keep" | "Simplify" | "Modernize" | "Retire";
  rationale: string;
  effort: string;
  risk: "High" | "Medium" | "Low";
  aiReadinessImpact: string;
}

export interface ModIntelSummary {
  totalCustomizations: number;
  keepPercent: number;
  simplifyPercent: number;
  modernizePercent: number;
  retirePercent: number;
  aiReadinessScore: number;
  dependencySprawlScore: number;
  automationDensityAvg: number;
  legacyClusters: number;
  deprecatedApis: number;
  unusedMethods: number;
  duplicateLogicClusters: number;
  redundantTriggers: number;
  estimatedEffortWeeks: number;
}

export const modIntelSummary: ModIntelSummary = {
  totalCustomizations: 1720,
  keepPercent: 68,
  simplifyPercent: 12,
  modernizePercent: 11,
  retirePercent: 9,
  aiReadinessScore: 58,
  dependencySprawlScore: 72,
  automationDensityAvg: 3.4,
  legacyClusters: 6,
  deprecatedApis: 14,
  unusedMethods: 47,
  duplicateLogicClusters: 7,
  redundantTriggers: 12,
  estimatedEffortWeeks: 8,
};

export const legacyClusters: LegacyCluster[] = [
  {
    id: "lc-1",
    name: "Order Management",
    objects: ["Order", "OrderItem", "OrderEvent__c"],
    componentCount: 34,
    triggerCount: 4,
    flowCount: 6,
    apexCount: 24,
    automationDensity: "High",
    entryPoints: 7,
    recommendation: "Simplify",
    rationale: "Multiple triggers on Order with overlapping logic. 4 entry points should be consolidated to 1 trigger framework handler. Flow-trigger hybrid creates ambiguous execution order.",
    effort: "2–3 weeks",
    risk: "High",
    aiReadinessImpact: "AI agents cannot reliably predict execution path — too many competing entry points",
  },
  {
    id: "lc-2",
    name: "Lead Processing Pipeline",
    objects: ["Lead", "Campaign", "CampaignMember"],
    componentCount: 22,
    triggerCount: 3,
    flowCount: 4,
    apexCount: 15,
    automationDensity: "High",
    entryPoints: 5,
    recommendation: "Modernize",
    rationale: "Rules-based lead routing and scoring logic currently in Apex is a strong candidate for Flow with Orchestration. Business logic is well-defined and low-complexity.",
    effort: "2 weeks",
    risk: "Medium",
    aiReadinessImpact: "Moving to declarative patterns improves agent introspection and metadata-driven reasoning",
  },
  {
    id: "lc-3",
    name: "Case Escalation Logic",
    objects: ["Case", "Entitlement", "Milestone"],
    componentCount: 18,
    triggerCount: 2,
    flowCount: 8,
    apexCount: 8,
    automationDensity: "Medium",
    entryPoints: 4,
    recommendation: "Simplify",
    rationale: "8 Flows with overlapping conditions create redundant paths. Consolidate into 2–3 well-structured Flows with clear priority ordering.",
    effort: "1–2 weeks",
    risk: "Medium",
    aiReadinessImpact: "Reducing flow count improves context clarity for Agentforce actions",
  },
  {
    id: "lc-4",
    name: "Legacy Batch Reporting",
    objects: ["Report__c", "ReportSnapshot__c", "ScheduledReport__c"],
    componentCount: 12,
    triggerCount: 0,
    flowCount: 0,
    apexCount: 12,
    automationDensity: "Low",
    entryPoints: 3,
    recommendation: "Retire",
    rationale: "Custom batch reporting logic replaced by native Salesforce reporting and Analytics. Zero active usage in 90+ days. 3 scheduled jobs still running but producing unused output.",
    effort: "< 1 week",
    risk: "Low",
    aiReadinessImpact: "Removing dead code reduces noise for AI analysis and org scanning",
  },
  {
    id: "lc-5",
    name: "Account Enrichment Services",
    objects: ["Account", "Contact", "AccountTeamMember"],
    componentCount: 28,
    triggerCount: 3,
    flowCount: 3,
    apexCount: 22,
    automationDensity: "High",
    entryPoints: 6,
    recommendation: "Keep",
    rationale: "Complex transactional logic with external API integrations and callout chains. Requires Apex for governor limit management and error handling. Well-structured with adequate test coverage (82%).",
    effort: "N/A",
    risk: "Low",
    aiReadinessImpact: "Well-structured Apex with clear contracts is already AI-friendly — no change needed",
  },
  {
    id: "lc-6",
    name: "Approval & Discount Logic",
    objects: ["Opportunity", "OpportunityLineItem", "Quote", "Discount__c"],
    componentCount: 19,
    triggerCount: 2,
    flowCount: 5,
    apexCount: 12,
    automationDensity: "Medium",
    entryPoints: 4,
    recommendation: "Modernize",
    rationale: "Discount calculations and approval routing currently split across Apex and Flows. Strong candidate for consolidation into Flow with Approval Process, reducing Apex footprint by ~60%.",
    effort: "2–3 weeks",
    risk: "Medium",
    aiReadinessImpact: "Declarative approval logic is directly actionable by Agentforce — eliminates black-box Apex",
  },
];

export const modPhases = [
  {
    phase: "Phase 1 — Quick Wins",
    timeline: "Weeks 1–2",
    items: [
      { action: "Retire", target: "Legacy Batch Reporting cluster (12 components)", effort: "< 1 week", criImpact: "+3" },
      { action: "Retire", target: "47 unused Apex methods across 12 classes", effort: "2–3 days", criImpact: "+2" },
      { action: "Simplify", target: "Upgrade 14 deprecated API version references", effort: "1–2 days", criImpact: "+1" },
    ],
  },
  {
    phase: "Phase 2 — Consolidation",
    timeline: "Weeks 3–5",
    items: [
      { action: "Simplify", target: "Order Management — consolidate 4 triggers to 1 framework handler", effort: "2–3 weeks", criImpact: "+4" },
      { action: "Simplify", target: "Case Escalation — reduce 8 Flows to 3 with clear priority", effort: "1–2 weeks", criImpact: "+2" },
      { action: "Consolidate", target: "7 duplicate logic clusters into shared services", effort: "1 week", criImpact: "+2" },
    ],
  },
  {
    phase: "Phase 3 — Modernize",
    timeline: "Weeks 6–8",
    items: [
      { action: "Modernize", target: "Lead Processing — migrate scoring/routing to Flow + Orchestration", effort: "2 weeks", criImpact: "+3" },
      { action: "Modernize", target: "Approval & Discount — consolidate into Flow + Approval Process", effort: "2–3 weeks", criImpact: "+3" },
    ],
  },
];
