import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildConceptMap,
  parseFrontmatter,
  rankConceptWorkflowSkills,
  rankSkill,
  recommendConceptWorkflow,
  recommendWorkflow,
  scanSkillRoots,
  searchConcepts,
  searchConceptWorkflowSkills,
  searchSkills,
  serializeConceptDetail,
  summarizeIndex
} from "../server/skill-scanner.js";

function makeSkill({ id, name, description, domains = [], tools = [], triggers = [], sourceType = "user" }) {
  return {
    id,
    name,
    description,
    path: `C:/skills/${name}/SKILL.md`,
    folder: `C:/skills/${name}`,
    root: "C:/skills",
    sourceType,
    namespace: name.includes(":") ? name.split(":")[0] : null,
    domains,
    triggers,
    tools,
    resources: {},
    excerpt: "",
    bodyLength: 1,
    warnings: [],
    searchText: `${name} ${description} ${triggers.join(" ")} ${domains.join(" ")} ${tools.join(" ")}`.toLowerCase()
  };
}

function makeConceptIndex(skills) {
  const { concepts, conceptEdges } = buildConceptMap(skills);
  return {
    scannedAt: 0,
    roots: ["C:/skills"],
    skills,
    edges: [],
    concepts,
    conceptEdges
  };
}

test("parses nested YAML frontmatter without losing unknown fields", () => {
  const parsed = parseFrontmatter(`---
name: figma-use
description: "Use when working with Figma: files, nodes, and components"
metadata:
  short-description: Figma operations
disable-model-invocation: false
---
# Figma Use

Load this before Figma tool calls.
`);

  assert.equal(parsed.frontmatter.name, "figma-use");
  assert.equal(parsed.frontmatter.description, "Use when working with Figma: files, nodes, and components");
  assert.equal(parsed.frontmatter.metadata["short-description"], "Figma operations");
  assert.equal(parsed.frontmatter["disable-model-invocation"], false);
  assert.match(parsed.body, /Figma Use/);
});

test("falls back on frontmatter with unescaped Windows paths", () => {
  const parsed = parseFrontmatter(`---
name: framer
description: >
  Use when the user mentions Framer or website edits.
allowed-tools: ["Read(C:\\Users\\Uday\\AppData\\Local\\Temp\\framer/*)"]
---
# Framer
`);

  assert.equal(parsed.frontmatter.name, "framer");
  assert.match(parsed.frontmatter.description, /Framer/);
  assert.equal(parsed.warnings.length, 0);
});


test("scans skill roots, resources, UI metadata, and duplicate-name edges", async () => {
  const root = await mkdtemp(join(tmpdir(), "skillweaver-"));
  const first = join(root, "skills", "skill-a");
  const second = join(root, "plugin", "skills", "skill-a");
  await mkdir(join(first, "agents"), { recursive: true });
  await mkdir(join(first, "references"), { recursive: true });
  await mkdir(second, { recursive: true });

  await writeFile(join(first, "SKILL.md"), `---
name: skill-a
description: Use for fixing GitHub CI failures and pull request checks.
---
# Workflow

Read references/ci.md before changing CI.
`);
  await writeFile(join(first, "agents", "openai.yaml"), `display_name: Skill A
short_description: Fix CI
default_prompt: Fix the failing checks.
`);
  await writeFile(join(first, "references", "ci.md"), "# CI notes\n");
  await writeFile(join(second, "SKILL.md"), `---
name: skill-a
description: Legacy plugin cache duplicate for CI repair.
---
# Duplicate
`);

  const index = await scanSkillRoots([root]);
  assert.equal(index.skills.length, 2);
  assert.ok(index.skills.some((skill) => skill.ui?.display_name === "Skill A"));
  assert.ok(index.skills.some((skill) => skill.resources.references?.includes("references\\ci.md") || skill.resources.references?.includes("references/ci.md")));
  assert.ok(index.edges.some((edge) => edge.type === "duplicates_name"));
});

test("ranks task wording and recommends a primary workflow skill", () => {
  const index = {
    skills: [
      {
        id: "github-ci",
        name: "gh-fix-ci",
        description: "Use when fixing GitHub Actions and CI failures.",
        path: "C:/skills/gh-fix-ci/SKILL.md",
        folder: "C:/skills/gh-fix-ci",
        root: "C:/skills",
        sourceType: "user",
        namespace: null,
        domains: ["github", "operations"],
        triggers: ["fix failing github ci"],
        tools: ["GitHub"],
        resources: {},
        excerpt: "",
        bodyLength: 1,
        warnings: [],
        searchText: "gh fix ci github actions failures"
      },
      {
        id: "frontend",
        name: "frontend-app-builder",
        description: "Use for frontend apps.",
        path: "C:/skills/frontend/SKILL.md",
        folder: "C:/skills/frontend",
        root: "C:/skills",
        sourceType: "user",
        namespace: null,
        domains: ["frontend"],
        triggers: ["build a frontend app"],
        tools: [],
        resources: {},
        excerpt: "",
        bodyLength: 1,
        warnings: [],
        searchText: "frontend react vite"
      }
    ],
    edges: [
      {
        sourceId: "github-ci",
        targetId: "frontend",
        type: "shared_tool",
        label: "GitHub",
        weight: 0.6,
        reason: "test"
      }
    ]
  };

  const results = searchSkills(index, "fix failing github ci");
  assert.equal(results[0].id, "github-ci");
  assert.ok(rankSkill(index.skills[0], "fix failing github ci") > rankSkill(index.skills[1], "fix failing github ci"));

  const workflow = recommendWorkflow(index, "fix failing github ci");
  assert.equal(workflow.primary.id, "github-ci");
  assert.equal(workflow.steps[0].name, "gh-fix-ci");
});

test("boosts gateway use skills and avoids generic index primaries", () => {
  const figmaUse = {
    id: "figma-use",
    name: "figma-use",
    description: "Use before Figma tool calls.",
    sourceType: "user",
    domains: [],
    triggers: [],
    searchText: "figma tool calls design inspection"
  };
  const figmaImplement = {
    id: "figma-implement-design",
    name: "figma-implement-design",
    description: "Implement a Figma design in code.",
    sourceType: "user",
    domains: [],
    triggers: [],
    searchText: "figma inspect design implement"
  };
  const genericIndex = {
    id: "index",
    name: "index",
    description: "Use for all data analytics workflows, dashboard creation, KPI analysis, and reporting.",
    sourceType: "plugin",
    domains: ["data"],
    triggers: [],
    searchText: "data analytics dashboard kpi reporting"
  };
  const dashboard = {
    id: "build-dashboard",
    name: "build-dashboard",
    description: "Build data analytics dashboards from KPI data.",
    sourceType: "plugin",
    domains: ["data"],
    triggers: ["dashboard from KPI data"],
    searchText: "build dashboard data analytics kpi"
  };

  assert.ok(rankSkill(figmaUse, "Use Figma to inspect a design") > rankSkill(figmaImplement, "Use Figma to inspect a design"));
  assert.ok(rankSkill(dashboard, "Create a data analytics dashboard from KPI data") > rankSkill(genericIndex, "Create a data analytics dashboard from KPI data"));
});

test("builds concept nodes with role-tagged skill references", () => {
  const skills = [
    makeSkill({
      id: "figma-use",
      name: "figma-use",
      description: "Use before Figma tool calls and design inspection.",
      domains: ["frontend", "product"],
      tools: ["Figma"],
      triggers: ["figma design"]
    }),
    makeSkill({
      id: "figma-implement-design",
      name: "figma-implement-design",
      description: "Implement a Figma design in code.",
      domains: ["frontend"],
      tools: ["Figma", "Node"],
      triggers: ["design to code"]
    }),
    makeSkill({
      id: "frontend-app-builder",
      name: "build-web-apps:frontend-app-builder",
      description: "Build a React frontend app.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["react ui"]
    }),
    makeSkill({
      id: "frontend-testing",
      name: "build-web-apps:frontend-testing-debugging",
      description: "Verify frontend behavior in the browser.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["browser qa"]
    })
  ];

  const index = makeConceptIndex(skills);

  const figma = serializeConceptDetail(index, "figma-handoff");
  assert.equal(figma.skillRefs.find((ref) => ref.name === "figma-use").role, "gateway");
  assert.equal(figma.skillRefs.find((ref) => ref.name === "figma-implement-design").role, "primary");
  assert.ok(figma.relatedConcepts.some((concept) => concept.id === "frontend-implementation"));

  const results = searchConcepts(index, "turn a Figma design into a React app");
  assert.equal(results[0].id, "figma-handoff");

  const summary = summarizeIndex(index);
  assert.equal(summary.conceptCount, 22);
  assert.ok(summary.conceptEdgeCount > 0);
});

test("concept workflow reranks dashboard intent toward builder skills", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "build-dashboard",
      name: "build-dashboard",
      description: "Build data analytics dashboards from KPI data.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["analytics dashboard"]
    }),
    makeSkill({
      id: "analyze-data-quality",
      name: "analyze-data-quality",
      description: "Audit data quality, missing values, and suspicious records.",
      domains: ["data"],
      tools: ["Python"],
      triggers: ["data quality"]
    }),
    makeSkill({
      id: "visualize-data",
      name: "visualize-data",
      description: "Visualize data with charts.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["visualize data"]
    })
  ]);

  const ranked = rankConceptWorkflowSkills(index, "Create a data analytics dashboard from KPI data");
  assert.equal(ranked[0].name, "build-dashboard");
  assert.equal(searchConceptWorkflowSkills(index, "Create a data analytics dashboard from KPI data")[0].name, "build-dashboard");

  const workflow = recommendConceptWorkflow(index, "Create a data analytics dashboard from KPI data");
  assert.equal(workflow.primary.name, "build-dashboard");
  assert.equal(workflow.concept.label, "Data dashboards and reports");
});

test("concept workflow respects Chrome-specific browser intent", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "control-in-app-browser",
      name: "control-in-app-browser",
      description: "Control the in-app browser for UI checks.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["browser qa"]
    }),
    makeSkill({
      id: "control-chrome",
      name: "control-chrome",
      description: "Use Chrome to inspect a live page and control browser interactions.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["control chrome"]
    }),
    makeSkill({
      id: "playwright",
      name: "playwright",
      description: "Run browser QA with screenshots.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["browser qa"]
    })
  ]);

  const workflow = recommendConceptWorkflow(index, "Use Chrome to inspect a live page and control browser interactions");
  assert.equal(workflow.primary.name, "control-chrome");
  assert.equal(workflow.concept.label, "Browser verification");
});

test("concept workflow routes attack-path intent to concrete analysis skill", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "security-threat-model",
      name: "security-threat-model",
      description: "Create a threat model for a system.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["threat model"]
    }),
    makeSkill({
      id: "attack-path-analysis",
      name: "attack-path-analysis",
      description: "Analyze exploit chains and attack paths in a codebase.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["attack path"]
    }),
    makeSkill({
      id: "deep-security-scan",
      name: "deep-security-scan",
      description: "Run a deep security scan.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["security scan"]
    })
  ]);

  const workflow = recommendConceptWorkflow(index, "Analyze likely exploit chains and attack paths in a codebase");
  assert.equal(workflow.primary.name, "attack-path-analysis");
  assert.equal(workflow.concept.label, "Security review");
});

test("concept workflow respects negated dashboard and scan intents", () => {
  const dashboardIndex = makeConceptIndex([
    makeSkill({
      id: "frontend-app-builder",
      name: "frontend-app-builder",
      description: "Build polished React frontend apps and dashboard UI shells.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["react dashboard ui"]
    }),
    makeSkill({
      id: "build-dashboard",
      name: "build-dashboard",
      description: "Build data analytics dashboards from KPI data.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["analytics dashboard"]
    }),
    makeSkill({
      id: "visualize-data",
      name: "visualize-data",
      description: "Visualize data with charts.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["visualize data"]
    })
  ]);

  const dashboardWorkflow = recommendConceptWorkflow(
    dashboardIndex,
    "Build a React dashboard UI shell, not a data analytics report"
  );
  assert.equal(dashboardWorkflow.primary.name, "frontend-app-builder");
  const dashboardInsteadWorkflow = recommendConceptWorkflow(
    dashboardIndex,
    "Build a React dashboard UI shell instead of a data analytics report"
  );
  assert.equal(dashboardInsteadWorkflow.primary.name, "frontend-app-builder");

  const securityIndex = makeConceptIndex([
    makeSkill({
      id: "security-threat-model",
      name: "security-threat-model",
      description: "Create a threat model for a system.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["threat model"]
    }),
    makeSkill({
      id: "deep-security-scan",
      name: "deep-security-scan",
      description: "Run a deep security scan for vulnerabilities.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["security scan"]
    }),
    makeSkill({
      id: "security-scan",
      name: "security-scan",
      description: "Run a security scan.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["scan vulnerabilities"]
    })
  ]);

  const securityWorkflow = recommendConceptWorkflow(
    securityIndex,
    "Create a threat model without running a vulnerability scan"
  );
  assert.equal(securityWorkflow.primary.name, "security-threat-model");
  const securityDontWorkflow = recommendConceptWorkflow(
    securityIndex,
    "Create a threat model, don't run a vulnerability scan"
  );
  assert.equal(securityDontWorkflow.primary.name, "security-threat-model");
});

test("concept workflow routes thin-domain aliases without new concept bloat", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "dev-mobile-desktop",
      name: "dev-mobile-desktop",
      description: "Mobile and desktop app engineering for React Native, Electron, WinUI, app packaging, and app store readiness.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["react native electron winui packaging"]
    }),
    makeSkill({
      id: "transcribe",
      name: "transcribe",
      description: "Transcribe speech from audio with diarization hints.",
      domains: ["ai"],
      tools: ["Python"],
      triggers: ["speech to text"]
    }),
    makeSkill({
      id: "speech",
      name: "speech",
      description: "Generate text-to-speech voiceover audio.",
      domains: ["ai"],
      tools: ["OpenAI"],
      triggers: ["text to speech"]
    }),
    makeSkill({
      id: "racingsim-ai-ml",
      name: "racingsim-ai-ml",
      description: "RacingSim PPO training, checkpoint inspection, lap progress verification, and reward shaping.",
      domains: ["ai"],
      tools: ["Python"],
      triggers: ["racingsim ppo"]
    }),
    makeSkill({
      id: "racingsim-game-dev",
      name: "racingsim-game-dev",
      description: "RacingSim Godot game development, map JSON, and vehicle physics.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["racingsim godot"]
    })
  ]);

  assert.equal(
    recommendConceptWorkflow(index, "Plan a React Native or Electron desktop app packaging review").primary.name,
    "dev-mobile-desktop"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Build a local speech-to-text and text-to-speech prototype").primary.name,
    "transcribe"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Continue RacingSim PPO training and verify lap progress").primary.name,
    "racingsim-ai-ml"
  );
});

test("concept workflow keeps deployment primary ahead of Vercel support skills", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "vercel-api",
      name: "vercel-api",
      description: "Deploy Vercel projects and inspect deployment build logs.",
      domains: ["operations", "frontend"],
      tools: ["Vercel"],
      triggers: ["vercel deploy build logs"]
    }),
    makeSkill({
      id: "env-vars",
      name: "env-vars",
      description: "Manage Vercel environment variables for deployments.",
      domains: ["operations"],
      tools: ["Vercel"],
      triggers: ["environment variables"]
    }),
    makeSkill({
      id: "agent-browser-verify",
      name: "agent-browser-verify",
      description: "Verify deployed Vercel apps in the browser.",
      domains: ["frontend", "operations"],
      tools: ["Vercel", "Playwright"],
      triggers: ["browser verify deployment"]
    })
  ]);

  const ranked = rankConceptWorkflowSkills(index, "Deploy this project to Vercel and inspect build logs");
  assert.equal(ranked[0].name, "vercel-api");
  assert.ok(ranked.slice(0, 5).some((skill) => skill.name === "env-vars"));
  assert.ok(ranked.slice(0, 5).some((skill) => skill.name === "agent-browser-verify"));
});

test("concept workflow keeps Python service primary while surfacing test and ops support", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "dev-python-services",
      name: "dev-python-services",
      description: "Build Python backend services with APIs and tests.",
      domains: ["backend"],
      tools: ["Python"],
      triggers: ["python service"]
    }),
    makeSkill({
      id: "dev-node-typescript-services",
      name: "dev-node-typescript-services",
      description: "Build Node and TypeScript backend services.",
      domains: ["backend"],
      tools: ["Node"],
      triggers: ["node service"]
    }),
    makeSkill({
      id: "dev-testing-qa",
      name: "dev-testing-qa",
      description: "Design backend test plans and verification.",
      domains: ["backend"],
      tools: ["Node"],
      triggers: ["tests verification"]
    }),
    makeSkill({
      id: "monitoring-setup-guide",
      name: "monitoring-setup-guide",
      description: "Set up service monitoring and operational readiness.",
      domains: ["operations"],
      tools: ["Node"],
      triggers: ["monitoring operational readiness"]
    })
  ]);

  const ranked = rankConceptWorkflowSkills(index, "Build a Python backend service with tests and operational readiness");
  const topFive = ranked.slice(0, 5).map((skill) => skill.name);
  assert.equal(topFive[0], "dev-python-services");
  assert.ok(topFive.includes("dev-testing-qa"));
  assert.ok(topFive.includes("monitoring-setup-guide"));
});

test("summarizeIndex exposes graph cap metadata", () => {
  const edges = [
    { sourceId: "a", targetId: "b", type: "mentions", label: "a", weight: 0.2, reason: "test" }
  ];
  edges.candidateCount = 3;
  edges.droppedCount = 2;
  edges.droppedTypeCounts = { mentions: 2 };
  const conceptEdges = [
    { sourceId: "frontend", targetId: "deployment", type: "curated_concept_link", label: "related", weight: 0.9, reason: "test" }
  ];
  conceptEdges.candidateCount = 2;
  conceptEdges.droppedCount = 1;
  conceptEdges.droppedTypeCounts = { shared_concept_evidence: 1 };

  const summary = summarizeIndex({
    scannedAt: 0,
    roots: ["C:/skills"],
    skills: [],
    edges,
    concepts: [],
    conceptEdges
  });

  assert.equal(summary.edgeLimit, 2000);
  assert.equal(summary.edgeCandidateCount, 3);
  assert.equal(summary.edgeDroppedCount, 2);
  assert.deepEqual(summary.edgeDroppedTypeCounts, { mentions: 2 });
  assert.equal(summary.edgeTruncated, true);
  assert.equal(summary.conceptEdgeLimit, 200);
  assert.equal(summary.conceptEdgeCandidateCount, 2);
  assert.equal(summary.conceptEdgeDroppedCount, 1);
  assert.deepEqual(summary.conceptEdgeDroppedTypeCounts, { shared_concept_evidence: 1 });
  assert.equal(summary.conceptEdgeTruncated, true);
});

test("concept workflow separates Figma gateway and implementation intent", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "figma-use",
      name: "figma-use",
      description: "Use Figma to inspect files and design context before work.",
      domains: ["frontend", "product"],
      tools: ["Figma"],
      triggers: ["use figma inspect design"]
    }),
    makeSkill({
      id: "figma-implement-design",
      name: "figma-implement-design",
      description: "Implement Figma designs in frontend code.",
      domains: ["frontend"],
      tools: ["Figma", "Node"],
      triggers: ["implement figma design"]
    }),
    makeSkill({
      id: "dev-frontend-react-next",
      name: "dev-frontend-react-next",
      description: "Build React and Next.js implementation code.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["react code"]
    })
  ]);

  assert.equal(
    recommendConceptWorkflow(index, "Use Figma to inspect a design and implement it").primary.name,
    "figma-use"
  );
  const implementation = rankConceptWorkflowSkills(index, "Implement a Figma design in React code").slice(0, 5).map((skill) => skill.name);
  assert.equal(implementation[0], "figma-implement-design");
  assert.ok(implementation.includes("dev-frontend-react-next"));
});

test("concept workflow keeps SkillWeaver routing reviews out of generic performance review", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "skillweaver",
      name: "skillweaver",
      description: "Inspect SkillWeaver skill routing and benchmark recommendations.",
      domains: ["ai", "documents"],
      tools: ["Node"],
      triggers: ["skillweaver skill routing benchmark"]
    }),
    makeSkill({
      id: "code-review-checklist",
      name: "code-review-checklist",
      description: "Review code and identify implementation risks.",
      domains: ["operations", "github"],
      tools: ["GitHub"],
      triggers: ["code review"]
    }),
    makeSkill({
      id: "dev-performance-engineering",
      name: "dev-performance-engineering",
      description: "Performance engineering for latency, throughput, and robustness.",
      domains: ["operations", "backend"],
      tools: ["Node"],
      triggers: ["performance robustness"]
    }),
    makeSkill({
      id: "performance-review",
      name: "performance-review",
      description: "Write a person performance review.",
      domains: ["product"],
      tools: [],
      triggers: ["performance review"]
    })
  ]);

  const topFive = rankConceptWorkflowSkills(index, "Read-only performance and robustness review of SkillWeaver V2 routing")
    .slice(0, 5)
    .map((skill) => skill.name);
  assert.equal(topFive[0], "skillweaver");
  assert.ok(topFive.includes("dev-performance-engineering"));
  assert.notEqual(topFive[0], "performance-review");
});

test("concept workflow anchors directly named specialist skills", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "ai-gateway",
      name: "ai-gateway",
      description: "Configure Vercel AI Gateway model routing and provider failover.",
      domains: ["ai", "operations"],
      tools: ["Vercel"],
      triggers: ["ai gateway model routing"]
    }),
    makeSkill({
      id: "ai-sdk",
      name: "ai-sdk",
      description: "Build AI SDK application flows.",
      domains: ["ai"],
      tools: ["Vercel"],
      triggers: ["ai sdk"]
    }),
    makeSkill({
      id: "metric-diagnostics",
      name: "metric-diagnostics",
      description: "Diagnose metric changes, cohorts, and product behavior shifts.",
      domains: ["data", "product"],
      tools: ["Python"],
      triggers: ["metric diagnostics"]
    }),
    makeSkill({
      id: "build-dashboard",
      name: "build-dashboard",
      description: "Build analytics dashboards.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["dashboard"]
    }),
    makeSkill({
      id: "code-explainer",
      name: "code-explainer",
      description: "Explain unfamiliar code paths in plain English.",
      domains: ["backend", "operations"],
      tools: ["GitHub"],
      triggers: ["explain code path"]
    }),
    makeSkill({
      id: "code-review-checklist",
      name: "code-review-checklist",
      description: "Review code and identify risks.",
      domains: ["operations", "github"],
      tools: ["GitHub"],
      triggers: ["code review"]
    }),
    makeSkill({
      id: "accessibility-and-inclusive-visualization",
      name: "accessibility-and-inclusive-visualization",
      description: "Audit data visualizations for accessibility and inclusive design.",
      domains: ["data", "frontend"],
      tools: ["Node"],
      triggers: ["visualization accessibility"]
    }),
    makeSkill({
      id: "data-visualization",
      name: "data-visualization",
      description: "Create data visualizations.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["data visualization"]
    })
  ]);

  assert.equal(
    recommendConceptWorkflow(index, "Route model calls through Vercel AI Gateway with fallback providers").primary.name,
    "ai-gateway"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Diagnose why a product metric changed across cohorts").primary.name,
    "metric-diagnostics"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Explain an unfamiliar code path without doing a code review").primary.name,
    "code-explainer"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Audit a data visualization for contrast, alt text, and keyboard access").primary.name,
    "accessibility-and-inclusive-visualization"
  );
});

test("concept workflow handles fresh generalization intent aliases", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "cloudflare-mcp",
      name: "building-mcp-server-on-cloudflare",
      description: "Build MCP servers on Cloudflare Workers with typed tools.",
      domains: ["backend", "ai", "operations"],
      tools: ["Cloudflare", "Node"],
      triggers: ["mcp server cloudflare workers"]
    }),
    makeSkill({
      id: "wrangler",
      name: "wrangler",
      description: "Deploy Cloudflare Workers with Wrangler.",
      domains: ["operations"],
      tools: ["Cloudflare"],
      triggers: ["wrangler deploy"]
    }),
    makeSkill({
      id: "auth",
      name: "auth",
      description: "Implement authentication, OAuth callbacks, protected routes, and session cookies.",
      domains: ["backend", "security"],
      tools: ["Vercel"],
      triggers: ["oauth protected routes session cookies"]
    }),
    makeSkill({
      id: "aspnet-core",
      name: "aspnet-core",
      description: "Review ASP.NET Core Minimal APIs, middleware, dependency injection, auth, and endpoint tests.",
      domains: ["backend"],
      tools: [".NET"],
      triggers: ["asp.net core minimal api middleware dependency injection"]
    }),
    makeSkill({
      id: "dev-backend-api-design",
      name: "dev-backend-api-design",
      description: "Design backend APIs, service boundaries, endpoint behavior, and documentation plans.",
      domains: ["backend"],
      tools: ["Node"],
      triggers: ["backend api node service endpoint design"]
    }),
    makeSkill({
      id: "api-docs-writer",
      name: "api-docs-writer",
      description: "Write API documentation from endpoint behavior, examples, errors, and version notes.",
      domains: ["documents", "backend"],
      tools: [],
      triggers: ["api documentation endpoint behavior examples"]
    }),
    makeSkill({
      id: "api-versioning-strategy",
      name: "api-versioning-strategy",
      description: "Plan API versioning strategies for breaking changes and compatibility.",
      domains: ["backend", "documents"],
      tools: [],
      triggers: ["api versioning strategy breaking changes compatibility"]
    }),
    makeSkill({
      id: "security-best-practices",
      name: "security-best-practices",
      description: "Review security risks and hardening.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["security review"]
    }),
    makeSkill({
      id: "notion-meeting-intelligence",
      name: "notion-meeting-intelligence",
      description: "Turn Notion meeting notes into decisions and follow-ups.",
      domains: ["product", "documents"],
      tools: [],
      triggers: ["notion meeting notes"]
    }),
    makeSkill({
      id: "notion-knowledge-capture",
      name: "notion-knowledge-capture",
      description: "Capture Notion workspace knowledge and decision logs.",
      domains: ["product", "documents"],
      tools: [],
      triggers: ["notion knowledge capture"]
    }),
    makeSkill({
      id: "incident-postmortem",
      name: "incident-postmortem",
      description: "Write incident postmortems from Sentry evidence and SLO impact.",
      domains: ["operations"],
      tools: [],
      triggers: ["incident postmortem"]
    }),
    makeSkill({
      id: "sentry",
      name: "sentry",
      description: "Use Sentry for error evidence and monitoring.",
      domains: ["operations"],
      tools: [],
      triggers: ["sentry"]
    }),
    makeSkill({
      id: "launch-readiness",
      name: "launch-readiness",
      description: "Prepare launch readiness checklists, rollback steps, and owner follow-ups.",
      domains: ["product", "operations"],
      tools: [],
      triggers: ["launch readiness rollback checklist"]
    }),
    makeSkill({
      id: "risk-register",
      name: "risk-register",
      description: "Create risk registers and risk matrices.",
      domains: ["product", "security"],
      tools: [],
      triggers: ["risk register"]
    }),
    makeSkill({
      id: "creative-offer",
      name: "creative-offer",
      description: "Generate creative offer angles and ad concepts.",
      domains: ["creative", "product"],
      tools: [],
      triggers: ["offer angles ad concepts"]
    }),
    makeSkill({
      id: "creative-production",
      name: "creative-production",
      description: "Produce campaign creative, ad concepts, product-shot prompts, and asset direction.",
      domains: ["creative"],
      tools: [],
      triggers: ["creative ad concepts product shot prompts campaign"]
    }),
    makeSkill({
      id: "creative-ads-explorer",
      name: "creative-ads-explorer",
      description: "Explore competitor ads and ad concepts.",
      domains: ["creative"],
      tools: [],
      triggers: ["creative ads ad concepts competitor ads"]
    }),
    makeSkill({
      id: "creative-positioning",
      name: "creative-positioning",
      description: "Develop competitor positioning and message angles.",
      domains: ["creative", "product"],
      tools: [],
      triggers: ["competitor positioning"]
    })
  ]);

  assert.equal(
    recommendConceptWorkflow(index, "Create a standalone MCP server on Cloudflare Workers with typed tool handlers").primary.name,
    "building-mcp-server-on-cloudflare"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Implement Vercel protected routes with OAuth callbacks and session cookies").primary.name,
    "auth"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Turn Notion meeting notes into a decision summary and follow-up tasks").primary.name,
    "notion-meeting-intelligence"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Write an incident postmortem with Sentry evidence and SLO impact").primary.name,
    "incident-postmortem"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Prepare a launch readiness checklist with feature flags and rollback steps").primary.name,
    "launch-readiness"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Generate creative offer angles and ad concepts from competitor positioning research").primary.name,
    "creative-offer"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Review an ASP.NET Core Minimal API with middleware, dependency injection, auth, and endpoint tests").primary.name,
    "aspnet-core"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Design a versioned backend API for a Node service and document endpoints").primary.name,
    "dev-backend-api-design"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Write API documentation from endpoint behavior, examples, error cases, and versioning notes").primary.name,
    "api-docs-writer"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Generate creative ad concepts, offer angles, and product-shot prompts for a new product campaign").primary.name,
    "creative-production"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Create a risk register for a launch readiness review").primary.name,
    "risk-register"
  );
});
