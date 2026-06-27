import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildConceptMap,
  parseFrontmatter,
  rankSkill,
  recommendWorkflow,
  scanSkillRoots,
  searchConcepts,
  searchSkills,
  serializeConceptDetail,
  summarizeIndex
} from "../server/skill-scanner.js";

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
  const makeSkill = ({ id, name, description, domains = [], tools = [], triggers = [] }) => ({
    id,
    name,
    description,
    path: `C:/skills/${name}/SKILL.md`,
    folder: `C:/skills/${name}`,
    root: "C:/skills",
    sourceType: "user",
    namespace: name.includes(":") ? name.split(":")[0] : null,
    domains,
    triggers,
    tools,
    resources: {},
    excerpt: "",
    bodyLength: 1,
    warnings: [],
    searchText: `${name} ${description} ${triggers.join(" ")} ${domains.join(" ")} ${tools.join(" ")}`.toLowerCase()
  });
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

  const { concepts, conceptEdges } = buildConceptMap(skills);
  const index = {
    scannedAt: 0,
    roots: ["C:/skills"],
    skills,
    edges: [],
    concepts,
    conceptEdges
  };

  const figma = serializeConceptDetail(index, "figma-handoff");
  assert.equal(figma.skillRefs.find((ref) => ref.name === "figma-use").role, "gateway");
  assert.equal(figma.skillRefs.find((ref) => ref.name === "figma-implement-design").role, "primary");
  assert.ok(figma.relatedConcepts.some((concept) => concept.id === "frontend-implementation"));

  const results = searchConcepts(index, "turn a Figma design into a React app");
  assert.equal(results[0].id, "figma-handoff");

  const summary = summarizeIndex(index);
  assert.equal(summary.conceptCount, 18);
  assert.ok(summary.conceptEdgeCount > 0);
});
