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
  serializeSkillDetail,
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
  assert.equal(parsed.warnings.length, 1);
  assert.match(parsed.warnings[0], /frontmatter parsed with loose fallback/i);
});

test("skill detail omits raw body and frontmatter unless explicitly requested", () => {
  const skill = {
    ...makeSkill({
      id: "privacy-skill",
      name: "privacy-skill",
      description: "Use for privacy checks."
    }),
    headings: ["Workflow"],
    references: ["references/privacy.md"],
    frontmatter: { name: "privacy-skill", secretish: "local metadata" },
    body: "# Workflow\nFull local instructions stay server-side by default."
  };
  const index = { skills: [skill], edges: [] };

  const defaultDetail = serializeSkillDetail(index, "privacy-skill");
  assert.equal(defaultDetail.body, undefined);
  assert.equal(defaultDetail.frontmatter, undefined);
  assert.equal(defaultDetail.bodyLength, skill.bodyLength);
  assert.deepEqual(defaultDetail.references, ["references/privacy.md"]);

  const fullDetail = serializeSkillDetail(index, "privacy-skill", {
    includeBody: true,
    includeFrontmatter: true
  });
  assert.equal(fullDetail.body, skill.body);
  assert.deepEqual(fullDetail.frontmatter, skill.frontmatter);
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
      id: "openai-docs",
      name: "openai-docs",
      description: "Look up OpenAI docs, API reference, and product guidance.",
      domains: ["ai", "documents"],
      tools: ["OpenAI"],
      triggers: ["openai docs api reference"]
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
    recommendConceptWorkflow(index, "Look up the OpenAI API docs and reference for tool calls").primary.name,
    "openai-docs"
  );
  assert.equal(
    recommendConceptWorkflow(index, "Write API documentation from endpoint behavior, examples, and error cases").primary.name,
    "api-docs-writer"
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

test("concept workflow handles frozen holdout specialist routing aliases", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "dev-ai-llm-apps",
      name: "dev-ai-llm-apps",
      description: "Build LLM applications, MCP servers, agent workflows, typed tools, and provider integrations.",
      domains: ["ai", "backend"],
      tools: ["OpenAI", "Node"],
      triggers: ["node typescript mcp server typed tools resources fixtures"]
    }),
    makeSkill({
      id: "dev-node-typescript-services",
      name: "dev-node-typescript-services",
      description: "Build Node and TypeScript services with tests and local setup.",
      domains: ["backend"],
      tools: ["Node"],
      triggers: ["node typescript service fixture tests"]
    }),
    makeSkill({
      id: "api-docs-writer",
      name: "api-docs-writer",
      description: "Document typed tools, resources, endpoint behavior, examples, and local clients.",
      domains: ["documents", "backend"],
      tools: [],
      triggers: ["api documentation typed tools resources local client"]
    }),
    makeSkill({
      id: "chatgpt-apps",
      name: "chatgpt-apps",
      description: "Build ChatGPT Apps and widgets.",
      domains: ["ai", "frontend"],
      tools: ["OpenAI"],
      triggers: ["chatgpt app widget"]
    }),
    makeSkill({
      id: "building-mcp-server-on-cloudflare",
      name: "building-mcp-server-on-cloudflare",
      description: "Build MCP servers on Cloudflare Workers.",
      domains: ["backend", "operations", "ai"],
      tools: ["Cloudflare", "Node"],
      triggers: ["cloudflare workers mcp server"]
    }),
    makeSkill({
      id: "gmail-inbox-triage",
      name: "gmail-inbox-triage",
      description: "Triage Gmail inboxes, summarize threads, labels, and draft replies.",
      domains: ["operations"],
      tools: ["Gmail"],
      triggers: ["gmail inbox triage draft replies"]
    }),
    makeSkill({
      id: "gmail",
      name: "gmail",
      description: "Search and read Gmail messages and threads.",
      domains: ["operations"],
      tools: ["Gmail"],
      triggers: ["gmail email inbox"]
    }),
    makeSkill({
      id: "email-triage",
      name: "email-triage",
      description: "Triage email and summarize inbox state.",
      domains: ["operations"],
      tools: ["Gmail"],
      triggers: ["email triage"]
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
      description: "Capture linked Notion knowledge and decision context.",
      domains: ["product", "documents"],
      tools: [],
      triggers: ["notion knowledge capture company context"]
    }),
    makeSkill({
      id: "control-in-app-browser",
      name: "control-in-app-browser",
      description: "Control the in-app browser for page inspection and screenshots.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["in app browser inspect screenshot"]
    }),
    makeSkill({
      id: "control-chrome",
      name: "control-chrome",
      description: "Control desktop Chrome for browser interactions.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["control chrome desktop chrome"]
    }),
    makeSkill({
      id: "playwright-interactive",
      name: "playwright-interactive",
      description: "Inspect live pages, browser interactions, and screenshots with Playwright.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["browser inspect interactions screenshots"]
    }),
    makeSkill({
      id: "sprite-pipeline",
      name: "sprite-pipeline",
      description: "Build sprite sheets, tilemaps, HUD assets, and 2D game asset pipelines.",
      domains: ["frontend", "creative"],
      tools: ["Node"],
      triggers: ["sprite sheet tilemap hud asset pipeline phaser"]
    }),
    makeSkill({
      id: "game-ui-frontend",
      name: "game-ui-frontend",
      description: "Build game UI overlays, HUDs, menus, and responsive play surfaces.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["game ui hud overlay"]
    }),
    makeSkill({
      id: "phaser-2d-game",
      name: "phaser-2d-game",
      description: "Build Phaser 2D browser games.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["phaser 2d game"]
    }),
    makeSkill({
      id: "web-3d-asset-pipeline",
      name: "web-3d-asset-pipeline",
      description: "Prepare 3D and WebGL game assets.",
      domains: ["frontend", "creative"],
      tools: ["Node"],
      triggers: ["webgl 3d asset pipeline"]
    }),
    makeSkill({
      id: "dev-observability-sre",
      name: "dev-observability-sre",
      description: "Set up OpenTelemetry tracing, monitoring dashboards, SLOs, alerts, and reliability practices.",
      domains: ["operations", "backend"],
      tools: ["Node"],
      triggers: ["opentelemetry tracing slo monitoring alerts"]
    }),
    makeSkill({
      id: "monitoring-setup-guide",
      name: "monitoring-setup-guide",
      description: "Plan monitoring setup, dashboards, alert rules, and operational checks.",
      domains: ["operations"],
      tools: ["Node"],
      triggers: ["monitoring dashboards alert rules"]
    }),
    makeSkill({
      id: "slo-error-budget",
      name: "slo-error-budget",
      description: "Define SLOs, error budgets, and reliability guardrails.",
      domains: ["operations"],
      tools: [],
      triggers: ["slo error budget"]
    }),
    makeSkill({
      id: "sentry",
      name: "sentry",
      description: "Use Sentry for error evidence, issue triage, and alerts.",
      domains: ["operations"],
      tools: [],
      triggers: ["sentry errors alerts"]
    }),
    makeSkill({
      id: "figma-swiftui",
      name: "figma-swiftui",
      description: "Translate Figma designs into SwiftUI and iOS implementation handoff.",
      domains: ["frontend", "product"],
      tools: ["Figma"],
      triggers: ["figma swiftui ios"]
    }),
    makeSkill({
      id: "figma-implement-motion",
      name: "figma-implement-motion",
      description: "Implement motion and animation details from Figma.",
      domains: ["frontend"],
      tools: ["Figma"],
      triggers: ["figma motion animation"]
    }),
    makeSkill({
      id: "figma-use-motion",
      name: "figma-use-motion",
      description: "Inspect Figma motion and prototype details.",
      domains: ["frontend", "product"],
      tools: ["Figma"],
      triggers: ["figma motion prototype"]
    }),
    makeSkill({
      id: "figma-implement-design",
      name: "figma-implement-design",
      description: "Implement Figma designs in frontend code.",
      domains: ["frontend"],
      tools: ["Figma", "Node"],
      triggers: ["figma react implementation"]
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
  const topFive = (query) => rankConceptWorkflowSkills(index, query).slice(0, 5).map((skill) => skill.name);

  let names = topFive("Build a generic Node TypeScript MCP server with typed tool handlers, resources, fixture tests, and local client setup; not a ChatGPT App or Cloudflare Worker");
  assert.equal(names[0], "dev-ai-llm-apps");
  assert.ok(names.includes("dev-node-typescript-services"));
  assert.ok(names.includes("api-docs-writer"));
  assert.notEqual(names[0], "chatgpt-apps");
  assert.notEqual(names[0], "building-mcp-server-on-cloudflare");

  names = topFive("Triage my Gmail inbox, draft replies, and use linked Notion company context when it helps");
  assert.equal(names[0], "gmail-inbox-triage");
  assert.ok(names.includes("notion-knowledge-capture"));
  assert.notEqual(names[0], "notion-meeting-intelligence");

  names = topFive("Use the in-app browser to inspect this page and take screenshots without switching to desktop Chrome");
  assert.equal(names[0], "control-in-app-browser");
  assert.notEqual(names[0], "control-chrome");

  names = topFive("Build a Phaser sprite sheet, tilemap, HUD, and asset pipeline with playtest checks, not a 3D scene");
  assert.equal(names[0], "sprite-pipeline");
  assert.ok(names.includes("game-ui-frontend"));

  names = topFive("Plan a Phaser browser game prototype with HUD menus, sprite production, and a repeatable playtest loop");
  assert.equal(names[0], "phaser-2d-game");
  assert.ok(names.includes("sprite-pipeline"));

  names = topFive("Set up OpenTelemetry tracing, SLO monitoring dashboards, error budgets, and Sentry alert rules");
  assert.equal(names[0], "dev-observability-sre");
  assert.notEqual(names[0], "sentry");

  names = topFive("Use Figma handoff to turn a mobile design into SwiftUI with motion details rather than React code");
  assert.equal(names[0], "figma-swiftui");
  assert.ok(names.includes("figma-implement-motion"));
});

test("concept workflow preserves clean holdout V2 specialist boundaries", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "agent-browser-verify",
      name: "agent-browser-verify",
      description: "Verify protected Vercel preview deployments with screenshots, console errors, and deployed UI inspection.",
      domains: ["frontend"],
      tools: ["Vercel", "Playwright"],
      triggers: ["agent browser verify protected preview deployment screenshots console errors"]
    }),
    makeSkill({
      id: "agent-browser",
      name: "agent-browser",
      description: "Use Vercel Agent Browser for deployed app inspection.",
      domains: ["frontend"],
      tools: ["Vercel"],
      triggers: ["vercel agent browser preview"]
    }),
    makeSkill({
      id: "control-in-app-browser",
      name: "control-in-app-browser",
      description: "Control the local in-app browser for screenshots and inspection.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["in app browser local screenshot inspect"]
    }),
    makeSkill({
      id: "control-chrome",
      name: "control-chrome",
      description: "Control desktop Chrome for browser interactions.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["desktop chrome control"]
    }),
    makeSkill({
      id: "data-visualization",
      name: "data-visualization",
      description: "Build data visualizations and narrative chart reports.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["data visualization chart report alt text color checks chart qa"]
    }),
    makeSkill({
      id: "build-report",
      name: "build-report",
      description: "Build analytical reports with charts and narrative findings.",
      domains: ["data", "product"],
      tools: ["Node"],
      triggers: ["build report product metrics charts"]
    }),
    makeSkill({
      id: "accessibility-and-inclusive-visualization",
      name: "accessibility-and-inclusive-visualization",
      description: "Review visualization accessibility, alt text, and contrast.",
      domains: ["data"],
      tools: [],
      triggers: ["visualization accessibility alt text contrast"]
    }),
    makeSkill({
      id: "testing-data-visualizations",
      name: "testing-data-visualizations",
      description: "Test data visualizations for correctness and accessibility.",
      domains: ["data"],
      tools: [],
      triggers: ["testing data visualizations chart qa"]
    }),
    makeSkill({
      id: "build-dashboard",
      name: "build-dashboard",
      description: "Build interactive analytics dashboards.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["dashboard analytics"]
    }),
    makeSkill({
      id: "jupyter-notebooks",
      name: "jupyter-notebooks",
      description: "Create reproducible Jupyter notebooks with SQL, Python, validation checks, and audit trails.",
      domains: ["data"],
      tools: ["Python"],
      triggers: ["jupyter notebook reproducible sql python audit trail experiment readout"]
    }),
    makeSkill({
      id: "data-analysis-standard",
      name: "data-analysis-standard",
      description: "Run standard data analysis with validation and documented findings.",
      domains: ["data"],
      tools: ["Python"],
      triggers: ["data analysis validation findings"]
    }),
    makeSkill({
      id: "validate-data",
      name: "validate-data",
      description: "Validate datasets and analysis results.",
      domains: ["data"],
      tools: ["Python"],
      triggers: ["validate data checks"]
    }),
    makeSkill({
      id: "figma-code-connect-components",
      name: "figma-code-connect-components",
      description: "Create Figma Code Connect mappings for existing React components and variant props.",
      domains: ["frontend", "product"],
      tools: ["Figma", "Node"],
      triggers: ["figma code connect mappings existing react components variant props"]
    }),
    makeSkill({
      id: "figma-code-connect",
      name: "figma-code-connect",
      description: "Configure Figma Code Connect for component mappings.",
      domains: ["frontend", "product"],
      tools: ["Figma"],
      triggers: ["figma code connect mappings"]
    }),
    makeSkill({
      id: "figma-implement-design",
      name: "figma-implement-design",
      description: "Implement Figma designs in frontend code.",
      domains: ["frontend"],
      tools: ["Figma", "Node"],
      triggers: ["figma react implementation"]
    }),
    makeSkill({
      id: "figma-generate-design",
      name: "figma-generate-design",
      description: "Generate new Figma design files.",
      domains: ["product"],
      tools: ["Figma"],
      triggers: ["generate figma design"]
    }),
    makeSkill({
      id: "figma-generate-library",
      name: "figma-generate-library",
      description: "Generate a Figma component library.",
      domains: ["product"],
      tools: ["Figma"],
      triggers: ["figma component library"]
    }),
    makeSkill({
      id: "huggingface-trackio",
      name: "huggingface-trackio",
      description: "Use Hugging Face Trackio for experiment tracking, model runs, and evaluation artifacts.",
      domains: ["ai", "data"],
      tools: ["Python"],
      triggers: ["hugging face trackio experiment tracking model run evaluation artifacts"]
    }),
    makeSkill({
      id: "huggingface-gradio",
      name: "huggingface-gradio",
      description: "Build Gradio demos and Spaces.",
      domains: ["ai"],
      tools: ["Python"],
      triggers: ["hugging face gradio demo space"]
    }),
    makeSkill({
      id: "huggingface-papers",
      name: "huggingface-papers",
      description: "Search and summarize Hugging Face papers.",
      domains: ["ai"],
      tools: [],
      triggers: ["hugging face papers summary"]
    }),
    makeSkill({
      id: "roadmap-narrative",
      name: "roadmap-narrative",
      description: "Turn research and issue context into roadmap narratives, milestones, and owners.",
      domains: ["product"],
      tools: ["Linear"],
      triggers: ["roadmap narrative release milestones follow up owners"]
    }),
    makeSkill({
      id: "linear",
      name: "linear",
      description: "Plan and update Linear issues.",
      domains: ["product"],
      tools: ["Linear"],
      triggers: ["linear issues"]
    }),
    makeSkill({
      id: "notion-research-documentation",
      name: "notion-research-documentation",
      description: "Turn Notion research notes into structured product documentation.",
      domains: ["product", "documents"],
      tools: [],
      triggers: ["notion research notes"]
    }),
    makeSkill({
      id: "gmail-inbox-triage",
      name: "gmail-inbox-triage",
      description: "Triage Gmail inboxes and draft replies.",
      domains: ["operations"],
      tools: ["Gmail"],
      triggers: ["gmail inbox triage email"]
    }),
    makeSkill({
      id: "prd-template",
      name: "prd-template",
      description: "Write PRDs from scratch.",
      domains: ["product", "documents"],
      tools: [],
      triggers: ["prd template"]
    }),
    makeSkill({
      id: "skill-security-auditor",
      name: "skill-security-auditor",
      description: "Audit Codex skill packs for unsafe instructions, hidden tool use, and install risk.",
      domains: ["ai", "security"],
      tools: ["GitHub"],
      triggers: ["audit codex skill pack unsafe instructions hidden tool use install risk"]
    }),
    makeSkill({
      id: "skill-installer",
      name: "skill-installer",
      description: "Install reusable Codex skill packs from GitHub and validate them locally.",
      domains: ["ai", "operations"],
      tools: ["GitHub"],
      triggers: ["install codex skill pack github validate locally"]
    }),
    makeSkill({
      id: "skill-creator",
      name: "skill-creator",
      description: "Create reusable Codex skills with frontmatter and reference files.",
      domains: ["ai", "documents"],
      tools: ["OpenAI"],
      triggers: ["create reusable codex skill frontmatter reference files"]
    }),
    makeSkill({
      id: "plugin-creator",
      name: "plugin-creator",
      description: "Create Codex plugins.",
      domains: ["ai"],
      tools: ["OpenAI"],
      triggers: ["plugin creator"]
    }),
    makeSkill({
      id: "security-ownership-map",
      name: "security-ownership-map",
      description: "Create security ownership maps from repo evidence, orphaned sensitive code, and remediation owners.",
      domains: ["security", "github"],
      tools: ["GitHub"],
      triggers: ["security ownership map repo evidence orphaned sensitive code bus factor remediation owners"]
    }),
    makeSkill({
      id: "triage-finding",
      name: "triage-finding",
      description: "Triage CodeQL and dependency alert findings from pull requests.",
      domains: ["security", "github"],
      tools: ["GitHub"],
      triggers: ["codeql dependency alert findings pull request false positives exploitable"]
    }),
    makeSkill({
      id: "validation",
      name: "validation",
      description: "Validate security remediations and finding fixes.",
      domains: ["security", "github"],
      tools: ["GitHub"],
      triggers: ["validation steps remediation"]
    }),
    makeSkill({
      id: "security-diff-scan",
      name: "security-diff-scan",
      description: "Scan pull request diffs for security findings.",
      domains: ["security", "github"],
      tools: ["GitHub"],
      triggers: ["security diff scan pull request"]
    })
  ]);

  const topFive = (query) => rankConceptWorkflowSkills(index, query).slice(0, 5).map((skill) => skill.name);

  let names = topFive("Use Vercel Agent Browser Verify to inspect a protected preview deployment, capture screenshots and console errors, and compare the deployed UI; not the local in-app browser or desktop Chrome.");
  assert.equal(names[0], "agent-browser-verify");
  assert.notEqual(names[0], "control-in-app-browser");
  assert.notEqual(names[0], "control-chrome");

  names = topFive("Build an accessible narrative chart report from product metrics with data visualization, alt text, color checks, and chart QA; do not turn this into a frontend CSS accessibility audit.");
  assert.ok(["data-visualization", "build-report"].includes(names[0]));
  assert.notEqual(names[0], "accessibility-and-inclusive-visualization");
  assert.notEqual(names[0], "testing-data-visualizations");
  assert.notEqual(names[0], "build-dashboard");

  names = topFive("Create a reproducible SQL and Python analytics notebook with validation checks, audit trail, and exportable findings for an experiment readout before any dashboard is built.");
  assert.equal(names[0], "jupyter-notebooks");
  assert.notEqual(names[0], "build-dashboard");

  names = topFive("Create Figma Code Connect mappings for existing React components and variant props; do not generate a new Figma design or implement the UI from scratch.");
  assert.ok(["figma-code-connect-components", "figma-code-connect"].includes(names[0]));
  assert.notEqual(names[0], "figma-implement-design");
  assert.notEqual(names[0], "figma-generate-design");
  assert.notEqual(names[0], "figma-generate-library");

  names = topFive("Set up Hugging Face Trackio experiment tracking for a model run, connect evaluation artifacts, and summarize results on the Hub; not a Gradio demo or paper summary.");
  assert.equal(names[0], "huggingface-trackio");
  assert.notEqual(names[0], "huggingface-gradio");
  assert.notEqual(names[0], "huggingface-papers");

  names = topFive("Publish a Hugging Face Gradio demo Space for a vision model and track evaluation runs.");
  assert.equal(names[0], "huggingface-gradio");
  assert.ok(names.includes("huggingface-trackio"));

  names = topFive("Turn Linear issues and Notion research notes into a roadmap narrative, release milestones, and follow-up owners; do not triage email or write a PRD from scratch.");
  assert.ok(["roadmap-narrative", "linear"].includes(names[0]));
  assert.notEqual(names[0], "gmail-inbox-triage");
  assert.notEqual(names[0], "prd-template");

  names = topFive("Audit a third-party Codex skill pack for unsafe instructions, hidden tool use, and install risk before deciding whether to install it; do not author a new skill or plugin.");
  assert.equal(names[0], "skill-security-auditor");
  assert.notEqual(names[0], "skill-creator");
  assert.notEqual(names[0], "plugin-creator");

  names = topFive("Install a reusable Codex skill pack from GitHub, validate it locally, audit it for unsafe instructions, and avoid mutating unrelated repos");
  assert.equal(names[0], "skill-installer");
  assert.ok(names.includes("skill-security-auditor"));
  assert.notEqual(names[0], "skill-creator");

  names = topFive("Create a security ownership map from repo evidence to identify orphaned sensitive code, bus-factor hotspots, and remediation owners; not a vulnerability scan or threat model.");
  assert.equal(names[0], "security-ownership-map");
  assert.notEqual(names[0], "triage-finding");
  assert.notEqual(names[0], "validation");

  names = topFive("Run a security diff scan on a pull request and track remediation findings through validation");
  assert.equal(names[0], "security-diff-scan");
  assert.notEqual(names[0], "triage-finding");
});

test("concept workflow promotes clean holdout V3 regression boundaries", () => {
  const index = makeConceptIndex([
    makeSkill({
      id: "netlify-deploy",
      name: "netlify-deploy",
      description: "Deploy static apps to Netlify with branch previews, redirects, DNS cutover, and rollback notes.",
      domains: ["operations", "frontend"],
      tools: ["Node"],
      triggers: ["netlify branch preview redirects dns cutover rollback"]
    }),
    makeSkill({
      id: "launch-readiness",
      name: "launch-readiness",
      description: "Prepare release checklists, rollout plans, and rollback notes.",
      domains: ["product", "operations"],
      tools: [],
      triggers: ["release readiness rollback"]
    }),
    makeSkill({
      id: "skill-creator",
      name: "skill-creator",
      description: "Create Codex skills with frontmatter, references, examples, scripts, and validation notes.",
      domains: ["ai", "documents"],
      tools: ["OpenAI"],
      triggers: ["codex skill frontmatter reference files examples validation"]
    }),
    makeSkill({
      id: "skillweaver",
      name: "skillweaver",
      description: "Inspect SkillWeaver routes and benchmark skill navigation.",
      domains: ["ai", "documents"],
      tools: ["Node"],
      triggers: ["skillweaver skill routing"]
    }),
    makeSkill({
      id: "cli-creator",
      name: "cli-creator",
      description: "Create command line tools and CLIs.",
      domains: ["backend"],
      tools: ["Node"],
      triggers: ["cli command line"]
    }),
    makeSkill({
      id: "Presentations",
      name: "Presentations",
      description: "Create slide decks and presentation artifacts.",
      domains: ["documents", "product"],
      tools: ["Node"],
      triggers: ["slides presentation deck"]
    }),
    makeSkill({
      id: "roadmap-presentation",
      name: "roadmap-presentation",
      description: "Build roadmap decks with speaker narrative.",
      domains: ["documents", "product"],
      tools: ["Node"],
      triggers: ["roadmap deck speaker narrative"]
    }),
    makeSkill({
      id: "linear",
      name: "linear",
      description: "Plan and update Linear issues and milestones.",
      domains: ["product"],
      tools: ["Linear"],
      triggers: ["linear issues milestones"]
    }),
    makeSkill({
      id: "dev-observability-sre",
      name: "dev-observability-sre",
      description: "Instrument services with tracing, SLOs, alerting, and service indicators.",
      domains: ["operations", "backend"],
      tools: [],
      triggers: ["otel tracing slo alerting service indicators"]
    }),
    makeSkill({
      id: "incident-postmortem",
      name: "incident-postmortem",
      description: "Write incident postmortems after production incidents.",
      domains: ["operations"],
      tools: [],
      triggers: ["incident postmortem"]
    }),
    makeSkill({
      id: "triage-finding",
      name: "triage-finding",
      description: "Triage security findings and separate false positives from exploitable issues.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["security findings false positives exploitable"]
    }),
    makeSkill({
      id: "validation",
      name: "validation",
      description: "Validate security remediations and findings.",
      domains: ["security"],
      tools: ["GitHub"],
      triggers: ["validation steps remediation"]
    }),
    makeSkill({
      id: "dependency-audit",
      name: "dependency-audit",
      description: "Audit dependency vulnerabilities and packages.",
      domains: ["security", "operations"],
      tools: ["GitHub"],
      triggers: ["dependency audit"]
    }),
    makeSkill({
      id: "huggingface-datasets",
      name: "huggingface-datasets",
      description: "Search Hugging Face datasets, cards, metadata, licensing, and related resources.",
      domains: ["ai", "data"],
      tools: ["Python"],
      triggers: ["hugging face dataset card metadata licensing"]
    }),
    makeSkill({
      id: "huggingface-llm-trainer",
      name: "huggingface-llm-trainer",
      description: "Train language models on Hugging Face.",
      domains: ["ai"],
      tools: ["Python"],
      triggers: ["hugging face model training"]
    }),
    makeSkill({
      id: "game-ui-frontend",
      name: "game-ui-frontend",
      description: "Design game menus, HUD layers, controller states, and keyboard interaction UI.",
      domains: ["frontend", "creative"],
      tools: ["Node"],
      triggers: ["game menu hud layer controller keyboard states"]
    }),
    makeSkill({
      id: "sprite-pipeline",
      name: "sprite-pipeline",
      description: "Prepare sprite sheets, tilemaps, and game asset pipelines.",
      domains: ["frontend", "creative"],
      tools: ["Node"],
      triggers: ["sprite sheet tilemap asset pipeline"]
    }),
    makeSkill({
      id: "openai-agents-js",
      name: "openai-agents-js",
      description: "Implement OpenAI Agents JS workflows with tool approvals and typed handoffs.",
      domains: ["ai", "backend"],
      tools: ["OpenAI", "Node"],
      triggers: ["openai agents js tool approvals typed handoffs"]
    }),
    makeSkill({
      id: "openai-docs",
      name: "openai-docs",
      description: "Check current OpenAI documentation and API references.",
      domains: ["ai", "documents"],
      tools: ["OpenAI"],
      triggers: ["openai docs api reference"]
    }),
    makeSkill({
      id: "chatgpt-apps",
      name: "chatgpt-apps",
      description: "Build ChatGPT Apps.",
      domains: ["ai", "frontend"],
      tools: ["OpenAI"],
      triggers: ["chatgpt app"]
    })
  ]);
  const topFive = (query) => rankConceptWorkflowSkills(index, query).slice(0, 5).map((skill) => skill.name);

  let names = topFive("Ship a Netlify branch preview for a static app, set redirect rules and environment scopes, run a deployed browser smoke check, and write the rollback note for DNS cutover.");
  assert.equal(names[0], "netlify-deploy");
  assert.notEqual(names[0], "launch-readiness");

  names = topFive("Turn a recurring repo workflow into a Codex skill with frontmatter, reference files, example scripts, validation notes, safe tool-use guidance, and a SkillWeaver route check before sharing it.");
  assert.equal(names[0], "skill-creator");
  assert.notEqual(names[0], "skillweaver");
  assert.notEqual(names[0], "cli-creator");

  names = topFive("Create a board-ready roadmap deck from Linear milestones and research notes, with a reusable slide template and speaker narrative rather than a PRD or inbox triage.");
  assert.ok(["Presentations", "roadmap-presentation"].includes(names[0]));
  assert.notEqual(names[0], "linear");

  names = topFive("Instrument a production API with traces, service indicators, SLO alerting, and Sentry noise controls before there is any incident report to write.");
  assert.equal(names[0], "dev-observability-sre");
  assert.notEqual(names[0], "incident-postmortem");

  names = topFive("Classify CodeQL and dependency-alert findings from a pull request, separate false positives from exploitable issues, assign remediation owners, and define validation steps.");
  assert.ok(["triage-finding", "validation"].includes(names[0]));
  assert.notEqual(names[0], "dependency-audit");

  names = topFive("Find the right Hugging Face dataset, inspect card metadata and licensing, compare related papers and evaluations, and prepare Hub notes before any model training starts.");
  assert.equal(names[0], "huggingface-datasets");
  assert.notEqual(names[0], "huggingface-llm-trainer");

  names = topFive("Design the menu and HUD layer for a Phaser 2D prototype, including controller and keyboard states, sprite handoff, and playtest checks; avoid 3D or WebGL scene work.");
  assert.equal(names[0], "game-ui-frontend");
  assert.notEqual(names[0], "sprite-pipeline");

  names = topFive("Implement an OpenAI Agents JS workflow with tool approvals, typed handoffs, test fixtures, and current docs checks; do not make it a ChatGPT App or Copilot SDK task.");
  assert.equal(names[0], "openai-agents-js");
  assert.notEqual(names[0], "openai-docs");
  assert.notEqual(names[0], "chatgpt-apps");
});

test("concept workflow promotes clean holdout V4 regression boundaries", () => {
  const index = makeConceptIndex([
    makeSkill({ id: "chart-data-extractor", name: "chart-data-extractor", description: "Extract numeric series and data points from charts, graphs, figures, and PDF appendices.", domains: ["data", "documents"], tools: ["Python"], triggers: ["chart data extractor pdf numeric series axis labels"] }),
    makeSkill({ id: "pdf", name: "pdf", description: "Read and manipulate PDF files.", domains: ["documents"], tools: ["Python"], triggers: ["pdf document extraction"] }),
    makeSkill({ id: "data-visualization", name: "data-visualization", description: "Create data visualizations and charts.", domains: ["data"], tools: ["Node"], triggers: ["data visualization charts"] }),
    makeSkill({ id: "build-report", name: "build-report", description: "Build analytical reports with methods and charts.", domains: ["data", "documents"], tools: ["Node"], triggers: ["report methodology"] }),
    makeSkill({ id: "Spreadsheets", name: "Spreadsheets", description: "Work with Excel workbooks, formulas, pivots, and sheets.", domains: ["data"], tools: ["Python"], triggers: ["spreadsheet excel workbook formulas"] }),
    makeSkill({ id: "reports-pdfs-and-slide-automation", name: "reports-pdfs-and-slide-automation", description: "Automate PDF reports and slide documents.", domains: ["documents"], tools: ["Python"], triggers: ["pdf report slides"] }),

    makeSkill({ id: "notion-spec-to-implementation", name: "notion-spec-to-implementation", description: "Convert Notion product specs into implementation tasks, acceptance criteria, and repo handoff notes.", domains: ["product", "documents"], tools: ["Linear"], triggers: ["notion product spec implementation tasks acceptance criteria"] }),
    makeSkill({ id: "notion-meeting-intelligence", name: "notion-meeting-intelligence", description: "Capture Notion meeting notes, agendas, pre-reads, and decisions.", domains: ["product"], tools: ["Linear"], triggers: ["notion meeting notes agenda"] }),
    makeSkill({ id: "notion-research-documentation", name: "notion-research-documentation", description: "Document Notion research notes and source links.", domains: ["product", "documents"], tools: ["Linear"], triggers: ["notion research documentation"] }),
    makeSkill({ id: "prd-template", name: "prd-template", description: "Write product requirements and acceptance criteria.", domains: ["product"], tools: ["Linear"], triggers: ["prd acceptance criteria"] }),
    makeSkill({ id: "linear", name: "linear", description: "Plan and update Linear issues.", domains: ["product"], tools: ["Linear"], triggers: ["linear tickets issues"] }),
    makeSkill({ id: "gmail-inbox-triage", name: "gmail-inbox-triage", description: "Triage Gmail inbox threads and draft replies.", domains: ["operations"], tools: ["Gmail"], triggers: ["gmail inbox email replies"] }),

    makeSkill({ id: "vercel-queues", name: "vercel-queues", description: "Implement Vercel Queues, background workers, and queue jobs.", domains: ["operations", "backend"], tools: ["Vercel"], triggers: ["vercel queues queue worker background job"] }),
    makeSkill({ id: "cron-jobs", name: "cron-jobs", description: "Configure cron jobs and scheduled workflows.", domains: ["operations"], tools: ["Vercel"], triggers: ["cron scheduled workflow"] }),
    makeSkill({ id: "vercel-functions", name: "vercel-functions", description: "Implement Vercel serverless functions.", domains: ["backend", "operations"], tools: ["Vercel"], triggers: ["vercel functions serverless"] }),
    makeSkill({ id: "workflow", name: "workflow", description: "Build workflow orchestration steps.", domains: ["operations"], tools: ["Vercel"], triggers: ["workflow orchestration"] }),
    makeSkill({ id: "env-vars", name: "env-vars", description: "Configure deployment environment variables.", domains: ["operations"], tools: ["Vercel"], triggers: ["environment variables"] }),

    makeSkill({ id: "sign-in-with-vercel", name: "sign-in-with-vercel", description: "Configure Sign in with Vercel, enterprise auth, protected routes, and callbacks.", domains: ["backend", "operations"], tools: ["Vercel"], triggers: ["sign in with vercel enterprise auth callbacks"] }),
    makeSkill({ id: "auth", name: "auth", description: "Implement generic authentication and OAuth.", domains: ["backend"], tools: ["Node"], triggers: ["auth oauth protected routes"] }),
    makeSkill({ id: "dev-backend-api-design", name: "dev-backend-api-design", description: "Design backend APIs and service boundaries.", domains: ["backend"], tools: ["Node"], triggers: ["backend api design"] }),
    makeSkill({ id: "security-best-practices", name: "security-best-practices", description: "Apply security hardening and safe defaults.", domains: ["security"], tools: ["GitHub"], triggers: ["security best practices"] }),
    makeSkill({ id: "vercel-deploy", name: "vercel-deploy", description: "Deploy and verify apps on Vercel.", domains: ["operations"], tools: ["Vercel"], triggers: ["vercel deploy"] }),

    makeSkill({ id: "dev-go-rust-systems", name: "dev-go-rust-systems", description: "Build Go and Rust systems, CLIs, binaries, packaging, and release workflows.", domains: ["backend", "operations"], tools: ["Node"], triggers: ["go rust cli packaging binaries release"] }),
    makeSkill({ id: "cli-creator", name: "cli-creator", description: "Create generic command line tools.", domains: ["backend"], tools: ["Node"], triggers: ["cli command line"] }),
    makeSkill({ id: "dev-java-dotnet-services", name: "dev-java-dotnet-services", description: "Build Java and .NET services.", domains: ["backend"], tools: ["Node"], triggers: ["java dotnet service"] }),
    makeSkill({ id: "dev-node-typescript-services", name: "dev-node-typescript-services", description: "Build Node and TypeScript services.", domains: ["backend"], tools: ["Node"], triggers: ["node typescript service"] }),
    makeSkill({ id: "dev-release-productization", name: "dev-release-productization", description: "Prepare packaging and release notes.", domains: ["operations"], tools: ["Node"], triggers: ["release productization packaging"] }),
    makeSkill({ id: "dev-testing-qa", name: "dev-testing-qa", description: "Add tests and QA checks.", domains: ["operations"], tools: ["Node"], triggers: ["tests qa"] }),

    makeSkill({ id: "framer-code-components", name: "framer-code-components", description: "Build Framer code components with property controls and typed props.", domains: ["frontend"], tools: ["Node"], triggers: ["framer code component props controls"] }),
    makeSkill({ id: "framer", name: "framer", description: "Use Framer for site edits.", domains: ["frontend"], tools: ["Node"], triggers: ["framer"] }),
    makeSkill({ id: "figma-code-connect", name: "figma-code-connect", description: "Connect Figma components to code.", domains: ["frontend"], tools: ["Figma"], triggers: ["figma code connect"] }),
    makeSkill({ id: "figma-code-connect-components", name: "figma-code-connect-components", description: "Map Figma variants to existing React components.", domains: ["frontend"], tools: ["Figma"], triggers: ["figma code connect components"] }),
    makeSkill({ id: "dev-frontend-react-next", name: "dev-frontend-react-next", description: "Build React and Next.js frontends.", domains: ["frontend"], tools: ["Node"], triggers: ["react next frontend"] }),
    makeSkill({ id: "design-qa", name: "design-qa", description: "Review design implementation quality.", domains: ["frontend"], tools: ["Figma"], triggers: ["design qa"] }),

    makeSkill({ id: "finding-discovery", name: "finding-discovery", description: "Discover security findings before triage and prepare evidence.", domains: ["security"], tools: ["GitHub"], triggers: ["finding discovery discover findings before triage"] }),
    makeSkill({ id: "triage-finding", name: "triage-finding", description: "Triage security findings and assign severity.", domains: ["security"], tools: ["GitHub"], triggers: ["triage findings severity"] }),
    makeSkill({ id: "security-scan", name: "security-scan", description: "Run security scans.", domains: ["security"], tools: ["GitHub"], triggers: ["security scan"] }),
    makeSkill({ id: "validation", name: "validation", description: "Validate security fixes and remediation.", domains: ["security"], tools: ["GitHub"], triggers: ["validation remediation"] }),

    makeSkill({ id: "huggingface-paper-publisher", name: "huggingface-paper-publisher", description: "Publish Hugging Face paper evidence summaries with linked models, datasets, evaluations, and Hub metadata.", domains: ["ai", "data"], tools: ["Python"], triggers: ["hugging face paper publisher paper evidence summary hub metadata"] }),
    makeSkill({ id: "huggingface-datasets", name: "huggingface-datasets", description: "Inspect Hugging Face datasets and metadata.", domains: ["ai", "data"], tools: ["Python"], triggers: ["hugging face datasets metadata"] }),
    makeSkill({ id: "huggingface-papers", name: "huggingface-papers", description: "Search Hugging Face papers.", domains: ["ai"], tools: ["Python"], triggers: ["hugging face papers"] }),
    makeSkill({ id: "huggingface-community-evals", name: "huggingface-community-evals", description: "Review community evaluation results.", domains: ["ai", "data"], tools: ["Python"], triggers: ["evaluation notes evals"] }),
    makeSkill({ id: "huggingface-llm-trainer", name: "huggingface-llm-trainer", description: "Train Hugging Face language models.", domains: ["ai"], tools: ["Python"], triggers: ["train model"] }),
    makeSkill({ id: "huggingface-gradio", name: "huggingface-gradio", description: "Launch Gradio demos and Spaces.", domains: ["ai", "frontend"], tools: ["Python"], triggers: ["gradio demo"] }),

    makeSkill({ id: "creative-shot", name: "creative-shot", description: "Create product shot prompts and shot direction.", domains: ["creative"], tools: ["Node"], triggers: ["creative shot product shot shot prompts"] }),
    makeSkill({ id: "creative-offer", name: "creative-offer", description: "Create offer angles and promotional hooks.", domains: ["creative"], tools: ["Node"], triggers: ["offer angles"] }),
    makeSkill({ id: "creative-production", name: "creative-production", description: "Produce campaign creative assets.", domains: ["creative"], tools: ["Node"], triggers: ["creative production campaign"] }),
    makeSkill({ id: "creative-scene", name: "creative-scene", description: "Plan scene direction for creative work.", domains: ["creative"], tools: ["Node"], triggers: ["creative scene"] }),
    makeSkill({ id: "creative-moodboard", name: "creative-moodboard", description: "Build creative moodboards.", domains: ["creative"], tools: ["Node"], triggers: ["moodboard"] }),
    makeSkill({ id: "creative-ads-explorer", name: "creative-ads-explorer", description: "Explore competitor ads.", domains: ["creative"], tools: ["Node"], triggers: ["creative ads"] }),

    makeSkill({ id: "docbridge-saas-copywriter", name: "docbridge-saas-copywriter", description: "Write DocBridge SaaS copy for sensitive workflow review and landing pages.", domains: ["creative", "product"], tools: ["Node"], triggers: ["docbridge saas copy workflow review"] }),
    makeSkill({ id: "premium-saas-landing-pages", name: "premium-saas-landing-pages", description: "Design premium SaaS landing pages.", domains: ["frontend", "creative"], tools: ["Node"], triggers: ["saas landing page"] }),
    makeSkill({ id: "premium-web-design", name: "premium-web-design", description: "Create premium web design.", domains: ["frontend", "creative"], tools: ["Node"], triggers: ["premium web design"] }),
    makeSkill({ id: "marketing-strategy-and-growth", name: "marketing-strategy-and-growth", description: "Plan marketing growth strategy.", domains: ["creative", "product"], tools: ["Node"], triggers: ["marketing growth"] }),
    makeSkill({ id: "seo-and-organic-growth", name: "seo-and-organic-growth", description: "Plan SEO and organic growth.", domains: ["creative"], tools: ["Node"], triggers: ["seo organic growth"] }),

    makeSkill({ id: "racingsim-game-dev", name: "racingsim-game-dev", description: "Fix RacingSim map runtime loading, camera behavior, and playtest checks.", domains: ["frontend", "creative"], tools: ["Node"], triggers: ["racingsim generated map runtime loading camera playtest"] }),
    makeSkill({ id: "racingsim-ai-ml", name: "racingsim-ai-ml", description: "Continue RacingSim PPO training and reward policies.", domains: ["ai"], tools: ["Python"], triggers: ["racingsim ppo training policy reward"] }),
    makeSkill({ id: "game-playtest", name: "game-playtest", description: "Run game playtests and checks.", domains: ["frontend"], tools: ["Node"], triggers: ["playtest checks"] }),
    makeSkill({ id: "dev-performance-engineering", name: "dev-performance-engineering", description: "Tune runtime performance.", domains: ["operations"], tools: ["Node"], triggers: ["runtime performance"] }),

    makeSkill({ id: "capacity-planning", name: "capacity-planning", description: "Plan capacity for traffic spikes, load, SLO boundaries, and scale.", domains: ["operations"], tools: ["Node"], triggers: ["capacity load slo traffic scale"] }),
    makeSkill({ id: "dev-observability-sre", name: "dev-observability-sre", description: "Instrument observability, tracing, and SRE monitors.", domains: ["operations"], tools: ["Node"], triggers: ["observability tracing sre"] }),
    makeSkill({ id: "slo-error-budget", name: "slo-error-budget", description: "Define SLOs and error budgets.", domains: ["operations"], tools: ["Node"], triggers: ["slo error budget"] }),
    makeSkill({ id: "load-testing-plan", name: "load-testing-plan", description: "Design load testing plans.", domains: ["operations"], tools: ["Node"], triggers: ["load testing"] }),
    makeSkill({ id: "dev-containers-kubernetes", name: "dev-containers-kubernetes", description: "Plan Kubernetes container capacity.", domains: ["operations"], tools: ["Node"], triggers: ["kubernetes containers"] }),

    makeSkill({ id: "database-schema-design", name: "database-schema-design", description: "Design database schemas before choosing an implementation backend.", domains: ["backend", "data"], tools: ["Node"], triggers: ["database schema design"] }),
    makeSkill({ id: "supabase-postgres-best-practices", name: "supabase-postgres-best-practices", description: "Apply Supabase Postgres patterns.", domains: ["backend", "data"], tools: ["Node"], triggers: ["supabase postgres"] }),
    makeSkill({ id: "dev-database-postgres", name: "dev-database-postgres", description: "Implement Postgres database work.", domains: ["backend", "data"], tools: ["Node"], triggers: ["postgres database"] }),
    makeSkill({ id: "database-migration-plan", name: "database-migration-plan", description: "Plan database migrations.", domains: ["backend", "data"], tools: ["Node"], triggers: ["database migration"] }),
    makeSkill({ id: "data-pipeline-spec", name: "data-pipeline-spec", description: "Specify data pipelines.", domains: ["data"], tools: ["Node"], triggers: ["data pipeline"] }),

    makeSkill({ id: "openai-docs", name: "openai-docs", description: "Verify current OpenAI API docs, migration details, structured output examples, and API references.", domains: ["ai", "documents"], tools: ["OpenAI"], triggers: ["openai docs api migration structured output"] }),
    makeSkill({ id: "api-docs-writer", name: "api-docs-writer", description: "Write API documentation and endpoint behavior examples.", domains: ["documents", "backend"], tools: ["Node"], triggers: ["api docs writer endpoint behavior examples"] }),
    makeSkill({ id: "chatgpt-apps", name: "chatgpt-apps", description: "Build ChatGPT Apps.", domains: ["ai", "frontend"], tools: ["OpenAI"], triggers: ["chatgpt app"] }),
    makeSkill({ id: "copilot-sdk", name: "copilot-sdk", description: "Build Copilot SDK features.", domains: ["ai", "frontend"], tools: ["OpenAI"], triggers: ["copilot sdk"] }),
    makeSkill({ id: "dev-ai-llm-apps", name: "dev-ai-llm-apps", description: "Build AI and LLM apps.", domains: ["ai", "backend"], tools: ["OpenAI"], triggers: ["llm app"] }),
    makeSkill({ id: "openai-agents-js", name: "openai-agents-js", description: "Implement OpenAI Agents JS workflows.", domains: ["ai", "backend"], tools: ["OpenAI"], triggers: ["openai agents js"] })
  ]);
  const topFive = (query) => rankConceptWorkflowSkills(index, query).slice(0, 5).map((skill) => skill.name);

  let names = topFive("Extract numeric series from charts embedded in a PDF appendix, reconcile axis labels, and produce a small CSV plus methodology notes; do not turn this into PDF form handling or spreadsheet cleanup.");
  assert.equal(names[0], "chart-data-extractor");
  assert.notEqual(names[0], "Spreadsheets");

  names = topFive("Convert a Notion product spec into implementation tasks, acceptance criteria, and repo handoff notes; do not only capture the meeting or draft email replies.");
  assert.equal(names[0], "notion-spec-to-implementation");
  assert.notEqual(names[0], "notion-meeting-intelligence");

  names = topFive("Add a Vercel Queues worker for background jobs with retry behavior, env var setup, and workflow notes; do not use Cron as the primary path.");
  assert.equal(names[0], "vercel-queues");
  assert.notEqual(names[0], "cron-jobs");

  names = topFive("Wire Sign in with Vercel for enterprise protected routes, callback URLs, env vars, and security review; do not run a generic auth build first.");
  assert.equal(names[0], "sign-in-with-vercel");
  assert.notEqual(names[0], "auth");

  names = topFive("Package a Go and Rust CLI with release binaries, help text, tests, and cross-platform build notes.");
  assert.equal(names[0], "dev-go-rust-systems");
  assert.notEqual(names[0], "cli-creator");

  names = topFive("Create Framer code components with property controls, typed props, responsive behavior, and design QA; do not map Figma Code Connect.");
  assert.equal(names[0], "framer-code-components");
  assert.notEqual(names[0], "figma-code-connect");

  names = topFive("Discover security findings from scan output before triage, gather evidence, and prepare validation steps without starting with finding triage.");
  assert.equal(names[0], "finding-discovery");
  assert.notEqual(names[0], "triage-finding");

  names = topFive("Publish a Hugging Face paper evidence summary with linked models, datasets, evaluation notes, and Hub metadata; do not train a model or launch a Gradio demo.");
  assert.equal(names[0], "huggingface-paper-publisher");
  assert.notEqual(names[0], "huggingface-datasets");

  names = topFive("Generate product-shot prompts and creative shot direction for a campaign, with scene and moodboard support, not offer angle strategy.");
  assert.equal(names[0], "creative-shot");
  assert.notEqual(names[0], "creative-offer");

  names = topFive("Rewrite DocBridge SaaS landing copy around workflow review, partner outputs, sensitive workflows, and plain trust language.");
  assert.equal(names[0], "docbridge-saas-copywriter");
  assert.notEqual(names[0], "premium-saas-landing-pages");

  names = topFive("Improve RacingSim generated-map runtime loading, camera behavior, and playtest checks for a large road network; do not continue PPO training.");
  assert.equal(names[0], "racingsim-game-dev");
  assert.notEqual(names[0], "racingsim-ai-ml");

  names = topFive("Plan capacity, SLO load boundaries, Kubernetes headroom, and load testing for a traffic spike.");
  assert.equal(names[0], "capacity-planning");
  assert.notEqual(names[0], "dev-observability-sre");

  names = topFive("Design the database schema and migration path before choosing Supabase implementation details or dashboard work.");
  assert.equal(names[0], "database-schema-design");
  assert.notEqual(names[0], "supabase-postgres-best-practices");

  names = topFive("Verify current OpenAI API migration details, structured-output examples, and endpoint behavior before implementation; do not build a ChatGPT App or Copilot SDK feature.");
  assert.equal(names[0], "openai-docs");
  assert.notEqual(names[0], "api-docs-writer");
  assert.notEqual(names[0], "chatgpt-apps");
});

test("concept workflow promotes clean holdout V5 regression boundaries", () => {
  const index = makeConceptIndex([
    makeSkill({ id: "ai-elements", name: "ai-elements", description: "Build Vercel AI Elements chat surfaces with streaming messages and tool-call states.", domains: ["ai", "frontend"], tools: ["Vercel"], triggers: ["ai elements streaming messages tool-call states"] }),
    makeSkill({ id: "ai-sdk", name: "ai-sdk", description: "Use the Vercel AI SDK for model-backed UI.", domains: ["ai"], tools: ["Vercel"], triggers: ["ai sdk"] }),
    makeSkill({ id: "openai-agents-js", name: "openai-agents-js", description: "Build OpenAI Agents JS workflows.", domains: ["ai"], tools: ["OpenAI"], triggers: ["openai agents js"] }),
    makeSkill({ id: "chatgpt-apps", name: "chatgpt-apps", description: "Build ChatGPT Apps.", domains: ["ai", "frontend"], tools: ["OpenAI"], triggers: ["chatgpt app"] }),
    makeSkill({ id: "dev-frontend-react-next", name: "dev-frontend-react-next", description: "Build React and Next.js frontends.", domains: ["frontend"], tools: ["Node"], triggers: ["react next frontend"] }),
    makeSkill({ id: "frontend-testing-debugging", name: "frontend-testing-debugging", description: "Verify frontend behavior.", domains: ["frontend"], tools: ["Playwright"], triggers: ["frontend testing"] }),
    makeSkill({ id: "ai-generation-persistence", name: "ai-generation-persistence", description: "Persist AI generations so users can resume outputs after refresh.", domains: ["ai", "backend"], tools: ["Vercel"], triggers: ["ai generation persistence resume outputs"] }),
    makeSkill({ id: "vercel-storage", name: "vercel-storage", description: "Provision Vercel Blob and storage.", domains: ["backend"], tools: ["Vercel"], triggers: ["vercel blob storage"] }),
    makeSkill({ id: "database-schema-design", name: "database-schema-design", description: "Design database schemas.", domains: ["backend", "data"], tools: ["Node"], triggers: ["database schema"] }),
    makeSkill({ id: "dev-node-typescript-services", name: "dev-node-typescript-services", description: "Build Node TypeScript services.", domains: ["backend"], tools: ["Node"], triggers: ["node typescript services"] }),

    makeSkill({ id: "agents-sdk", name: "agents-sdk", description: "Build Cloudflare Agents SDK workflows.", domains: ["ai", "backend"], tools: ["Cloudflare"], triggers: ["cloudflare agents sdk"] }),
    makeSkill({ id: "building-ai-agent-on-cloudflare", name: "building-ai-agent-on-cloudflare", description: "Build AI agents on Cloudflare.", domains: ["ai"], tools: ["Cloudflare"], triggers: ["cloudflare ai agent"] }),
    makeSkill({ id: "durable-objects", name: "durable-objects", description: "Use Durable Objects for state.", domains: ["backend"], tools: ["Cloudflare"], triggers: ["durable object state"] }),
    makeSkill({ id: "wrangler", name: "wrangler", description: "Deploy and configure Cloudflare Workers.", domains: ["operations"], tools: ["Cloudflare"], triggers: ["wrangler workers"] }),
    makeSkill({ id: "workers-best-practices", name: "workers-best-practices", description: "Apply Workers best practices.", domains: ["backend"], tools: ["Cloudflare"], triggers: ["workers best practices"] }),
    makeSkill({ id: "agent-browser-verify", name: "agent-browser-verify", description: "Verify Vercel Agent Browser previews.", domains: ["frontend"], tools: ["Vercel"], triggers: ["agent browser verify"] }),

    makeSkill({ id: "screenshot", name: "screenshot", description: "Capture screenshot evidence for browser QA.", domains: ["frontend"], tools: ["Playwright"], triggers: ["screenshot evidence"] }),
    makeSkill({ id: "design-image-to-code", name: "design-image-to-code", description: "Turn screenshots and images into code.", domains: ["frontend"], tools: ["Node"], triggers: ["image to code screenshot to code"] }),
    makeSkill({ id: "design-url-to-code", name: "design-url-to-code", description: "Turn URLs into code.", domains: ["frontend"], tools: ["Node"], triggers: ["url to code"] }),
    makeSkill({ id: "control-in-app-browser", name: "control-in-app-browser", description: "Control the in-app browser.", domains: ["frontend"], tools: ["Playwright"], triggers: ["in app browser"] }),
    makeSkill({ id: "playwright", name: "playwright", description: "Run Playwright browser checks.", domains: ["frontend"], tools: ["Playwright"], triggers: ["playwright browser qa"] }),

    makeSkill({ id: "figma-annotation-guide", name: "figma-annotation-guide", description: "Annotate Figma files for engineering handoff.", domains: ["frontend", "product"], tools: ["Figma"], triggers: ["figma annotation engineering handoff spacing component notes"] }),
    makeSkill({ id: "figma-use-figjam", name: "figma-use-figjam", description: "Use FigJam boards for user flows, sections, connectors, sticky notes, and decision maps.", domains: ["frontend", "product"], tools: ["Figma"], triggers: ["figjam user flow sections connectors sticky notes"] }),
    makeSkill({ id: "figma-user-flow-planner", name: "figma-user-flow-planner", description: "Plan user flows in FigJam and Figma with decision paths and annotations.", domains: ["product"], tools: ["Figma"], triggers: ["figjam user flow decision annotations"] }),
    makeSkill({ id: "figma-use", name: "figma-use", description: "Use Figma files and nodes.", domains: ["frontend"], tools: ["Figma"], triggers: ["figma use"] }),
    makeSkill({ id: "figma-code-connect", name: "figma-code-connect", description: "Create Figma Code Connect mappings.", domains: ["frontend"], tools: ["Figma"], triggers: ["figma code connect"] }),
    makeSkill({ id: "figma-implement-design", name: "figma-implement-design", description: "Implement Figma designs in code.", domains: ["frontend"], tools: ["Figma"], triggers: ["implement figma"] }),
    makeSkill({ id: "design-audit", name: "design-audit", description: "Audit product design flows and interaction risks.", domains: ["frontend", "product"], tools: ["Figma"], triggers: ["product design audit onboarding interaction risks"] }),
    makeSkill({ id: "audit", name: "audit", description: "Generic product design audit.", domains: ["product"], tools: [], triggers: ["audit"] }),

    makeSkill({ id: "geospatial-and-cartographic-visualization", name: "geospatial-and-cartographic-visualization", description: "Create geospatial map visualizations with projections and legends.", domains: ["data"], tools: ["Node"], triggers: ["geospatial map cartographic projection"] }),
    makeSkill({ id: "data-visualization", name: "data-visualization", description: "Create data visualizations.", domains: ["data"], tools: ["Node"], triggers: ["data visualization"] }),
    makeSkill({ id: "build-dashboard", name: "build-dashboard", description: "Build BI dashboards.", domains: ["data"], tools: ["Node"], triggers: ["dashboard"] }),
    makeSkill({ id: "chart-data-extractor", name: "chart-data-extractor", description: "Extract chart data.", domains: ["data"], tools: ["Python"], triggers: ["chart extraction"] }),
    makeSkill({ id: "data-quality-audit", name: "data-quality-audit", description: "Audit data freshness, duplicate keys, null rates, and quality contracts.", domains: ["data"], tools: ["Python"], triggers: ["data quality audit event table duplicate keys null rates"] }),
    makeSkill({ id: "data-pipeline-spec", name: "data-pipeline-spec", description: "Specify data pipeline contracts.", domains: ["data"], tools: ["Node"], triggers: ["data pipeline contract"] }),

    makeSkill({ id: "validation", name: "validation", description: "Validate security remediation fixes.", domains: ["security"], tools: ["GitHub"], triggers: ["validate remediation fixing reported issue"] }),
    makeSkill({ id: "finding-discovery", name: "finding-discovery", description: "Discover security findings before triage.", domains: ["security"], tools: ["GitHub"], triggers: ["finding discovery"] }),
    makeSkill({ id: "triage-finding", name: "triage-finding", description: "Triage security findings.", domains: ["security"], tools: ["GitHub"], triggers: ["triage finding"] }),
    makeSkill({ id: "security-diff-scan", name: "security-diff-scan", description: "Scan security diffs.", domains: ["security"], tools: ["GitHub"], triggers: ["security diff scan"] }),
    makeSkill({ id: "security-best-practices", name: "security-best-practices", description: "Apply security best practices.", domains: ["security"], tools: ["GitHub"], triggers: ["security best practices"] }),

    makeSkill({ id: "huggingface-jobs", name: "huggingface-jobs", description: "Launch and monitor Hugging Face GPU jobs.", domains: ["ai"], tools: ["Python"], triggers: ["hugging face gpu job remote job logs metrics"] }),
    makeSkill({ id: "huggingface-datasets", name: "huggingface-datasets", description: "Inspect Hugging Face datasets.", domains: ["ai", "data"], tools: ["Python"], triggers: ["dataset card"] }),
    makeSkill({ id: "huggingface-gradio", name: "huggingface-gradio", description: "Create Gradio Spaces.", domains: ["ai", "frontend"], tools: ["Python"], triggers: ["gradio space"] }),
    makeSkill({ id: "hf-cli", name: "hf-cli", description: "Use the Hugging Face CLI.", domains: ["ai"], tools: ["Python"], triggers: ["hf cli"] }),
    makeSkill({ id: "huggingface-trackio", name: "huggingface-trackio", description: "Track Hugging Face runs.", domains: ["ai"], tools: ["Python"], triggers: ["trackio metrics"] }),

    makeSkill({ id: "speech", name: "speech", description: "Generate text-to-speech voiceover audio.", domains: ["ai"], tools: ["OpenAI"], triggers: ["text to speech voiceover voice settings playback"] }),
    makeSkill({ id: "transcribe", name: "transcribe", description: "Transcribe microphone and audio input.", domains: ["ai"], tools: ["OpenAI"], triggers: ["transcribe microphone speech to text"] }),
    makeSkill({ id: "transformers-js", name: "transformers-js", description: "Run local browser ML models.", domains: ["ai"], tools: ["Node"], triggers: ["transformers js"] }),
    makeSkill({ id: "dev-ai-llm-apps", name: "dev-ai-llm-apps", description: "Build LLM apps.", domains: ["ai"], tools: ["OpenAI"], triggers: ["llm app"] }),
    makeSkill({ id: "openai-docs", name: "openai-docs", description: "Check OpenAI docs.", domains: ["ai", "documents"], tools: ["OpenAI"], triggers: ["openai docs"] }),

    makeSkill({ id: "react-three-fiber-game", name: "react-three-fiber-game", description: "Build React Three Fiber game scenes.", domains: ["frontend", "creative"], tools: ["Node"], triggers: ["react three fiber game scene camera controls physics placeholders"] }),
    makeSkill({ id: "three-webgl-game", name: "three-webgl-game", description: "Build Three.js WebGL games.", domains: ["frontend"], tools: ["Node"], triggers: ["three webgl game"] }),
    makeSkill({ id: "game-playtest", name: "game-playtest", description: "Playtest game scenes.", domains: ["frontend"], tools: ["Node"], triggers: ["game playtest"] }),
    makeSkill({ id: "web-3d-asset-pipeline", name: "web-3d-asset-pipeline", description: "Prepare 3D web game assets.", domains: ["frontend"], tools: ["Node"], triggers: ["3d asset pipeline"] }),
    makeSkill({ id: "threejs-data-visualization", name: "threejs-data-visualization", description: "Create 3D data visualizations.", domains: ["data"], tools: ["Node"], triggers: ["3d data visualization"] }),
    makeSkill({ id: "template-creator", name: "template-creator", description: "Create reusable document and slide templates.", domains: ["documents"], tools: ["Node"], triggers: ["template pack slide layouts placeholders"] }),
    makeSkill({ id: "roadmap-presentation", name: "roadmap-presentation", description: "Create roadmap decks.", domains: ["documents"], tools: ["Node"], triggers: ["roadmap deck"] }),
    makeSkill({ id: "Presentations", name: "Presentations", description: "Create presentations.", domains: ["documents"], tools: ["Node"], triggers: ["presentation slides"] }),
    makeSkill({ id: "documents", name: "documents", description: "Work with documents.", domains: ["documents"], tools: ["Node"], triggers: ["documents"] }),

    makeSkill({ id: "technical-debt-register", name: "technical-debt-register", description: "Create technical debt registers from hotspots, TODOs, dependency risk, and owner notes.", domains: ["operations"], tools: ["GitHub"], triggers: ["technical debt register module hotspots todos owner notes"] }),
    makeSkill({ id: "dependency-conflict-resolver", name: "dependency-conflict-resolver", description: "Resolve dependency conflicts.", domains: ["operations"], tools: ["Node"], triggers: ["dependency conflict"] }),
    makeSkill({ id: "dependency-audit", name: "dependency-audit", description: "Audit dependency risk.", domains: ["operations"], tools: ["Node"], triggers: ["dependency audit risk"] }),
    makeSkill({ id: "code-review-checklist", name: "code-review-checklist", description: "Review code with a checklist.", domains: ["github"], tools: ["GitHub"], triggers: ["code review checklist"] }),
    makeSkill({ id: "changelog-generator", name: "changelog-generator", description: "Write release notes and changelogs.", domains: ["documents"], tools: ["Node"], triggers: ["changelog release notes"] }),

    makeSkill({ id: "notion-research-documentation", name: "notion-research-documentation", description: "Document Notion research notes, source links, evidence summaries, and open questions.", domains: ["product", "documents"], tools: ["Linear"], triggers: ["notion research notes source links evidence summaries open questions"] }),
    makeSkill({ id: "notion-spec-to-implementation", name: "notion-spec-to-implementation", description: "Convert Notion specs into implementation tickets.", domains: ["product"], tools: ["Linear"], triggers: ["notion spec implementation tickets"] }),
    makeSkill({ id: "notion-meeting-intelligence", name: "notion-meeting-intelligence", description: "Summarize Notion meeting notes.", domains: ["product"], tools: ["Linear"], triggers: ["notion meeting notes"] }),
    makeSkill({ id: "notion-knowledge-capture", name: "notion-knowledge-capture", description: "Capture knowledge in Notion.", domains: ["product"], tools: ["Linear"], triggers: ["notion knowledge capture"] })
  ]);
  const topFive = (query) => rankConceptWorkflowSkills(index, query).slice(0, 5).map((skill) => skill.name);

  let names = topFive("Build a production chat UI with Vercel AI Elements, streaming messages, tool-call states, and accessibility checks; do not create a ChatGPT App or OpenAI Agents workflow.");
  assert.equal(names[0], "ai-elements");
  assert.notEqual(names[0], "openai-agents-js");

  names = topFive("Add persistence for AI generations in a Next.js app so users can resume outputs after refresh, including storage boundaries and replay tests; do not route this to generic database schema design or Vercel Blob setup.");
  assert.equal(names[0], "ai-generation-persistence");
  assert.notEqual(names[0], "vercel-storage");

  names = topFive("Build a stateful Cloudflare Agents SDK workflow with Worker bindings and Durable Object state; do not use Vercel Agent Browser or OpenAI Agents JS.");
  assert.ok(["agents-sdk", "building-ai-agent-on-cloudflare"].includes(names[0]));
  assert.notEqual(names[0], "openai-agents-js");

  names = topFive("Capture screenshot evidence for a local UI bug, compare desktop and mobile states, and attach browser QA notes; do not turn the screenshot into code.");
  assert.equal(names[0], "screenshot");
  assert.notEqual(names[0], "design-image-to-code");

  names = topFive("Use Vercel Agent Browser Verify to inspect a protected preview deployment, capture screenshots and console errors, and compare the deployed UI; not the local in-app browser or desktop Chrome.");
  assert.equal(names[0], "agent-browser-verify");
  assert.notEqual(names[0], "screenshot");

  names = topFive("Use the app embedded browser against localhost, reproduce a mobile layout break, capture screenshot proof, and inspect console output without launching desktop Chrome.");
  assert.equal(names[0], "control-in-app-browser");
  assert.notEqual(names[0], "screenshot");

  names = topFive("Annotate a Figma design for engineering handoff with spacing, component notes, and review comments; do not implement React code or create Code Connect mappings.");
  assert.equal(names[0], "figma-annotation-guide");
  assert.notEqual(names[0], "figma-code-connect");

  names = topFive("Use FigJam to map a user flow with sections, connectors, sticky notes, and decision annotations; do not create a Figma design file or component library.");
  assert.ok(["figma-use-figjam", "figma-user-flow-planner"].includes(names[0]));
  assert.notEqual(names[0], "figma-annotation-guide");

  names = topFive("Create a geospatial map visualization from regional performance data with legend, projection choices, and QA notes; not a general BI dashboard or chart extraction task.");
  assert.equal(names[0], "geospatial-and-cartographic-visualization");
  assert.notEqual(names[0], "build-dashboard");

  names = topFive("Audit event table freshness, duplicate keys, null rates, and ownership rules before locking a data pipeline contract; do not build a dashboard.");
  assert.equal(names[0], "data-quality-audit");
  assert.notEqual(names[0], "database-schema-design");

  names = topFive("Validate that a security remediation PR actually fixes the reported issue, attach evidence, and update finding status; do not discover new findings or triage the backlog.");
  assert.equal(names[0], "validation");
  assert.notEqual(names[0], "finding-discovery");

  names = topFive("Launch and monitor a remote Hugging Face GPU Job for a training script, capture logs and metrics, and summarize run artifacts; do not make a Gradio Space or dataset card.");
  assert.equal(names[0], "huggingface-jobs");
  assert.notEqual(names[0], "huggingface-datasets");

  names = topFive("Generate text-to-speech voiceover audio from a prepared script, choose voice settings, and verify playback; do not transcribe microphone input.");
  assert.equal(names[0], "speech");
  assert.notEqual(names[0], "transcribe");

  names = topFive("Build an interactive React Three Fiber game scene with camera controls, physics placeholders, and canvas verification; do not create a 3D data visualization.");
  assert.equal(names[0], "react-three-fiber-game");
  assert.notEqual(names[0], "template-creator");

  names = topFive("Create a technical debt register from module hotspots, TODOs, dependency risk, and owner notes; do not resolve a dependency conflict or write release notes.");
  assert.equal(names[0], "technical-debt-register");
  assert.notEqual(names[0], "dependency-conflict-resolver");

  names = topFive("Create a reusable presentation template pack from brand assets with slide layouts, placeholders, and validation guidance; do not produce a one-off roadmap deck.");
  assert.equal(names[0], "template-creator");
  assert.notEqual(names[0], "roadmap-presentation");

  names = topFive("Turn Notion research notes and source links into a structured source bank with evidence summaries and open questions; do not convert a spec into implementation tickets or prepare meeting follow-ups.");
  assert.equal(names[0], "notion-research-documentation");
  assert.notEqual(names[0], "notion-spec-to-implementation");
});
