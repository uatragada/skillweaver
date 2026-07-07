import test from "node:test";
import assert from "node:assert/strict";
import { buildConceptMap } from "../server/skill-scanner.js";
import {
  evaluateSystem,
  matchesConceptFragment,
  matchesNameFragment,
  normalizeCase,
  runNightmareBenchmark,
  scoreExpectedOrder,
  scoreNightmareCase,
  validateNightmareCases
} from "../scripts/benchmark-skill-routing-nightmare.mjs";

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
    excerpt: description,
    bodyLength: description.length,
    warnings: [],
    searchText: `${name} ${description} ${triggers.join(" ")} ${domains.join(" ")} ${tools.join(" ")}`.toLowerCase()
  };
}

function makeIndex() {
  const skills = [
    makeSkill({
      id: "frontend-app-builder",
      name: "frontend-app-builder",
      description: "Build React frontend app shells, dashboards, routes, and UI states.",
      domains: ["frontend"],
      tools: ["Node"],
      triggers: ["react dashboard ui shell"]
    }),
    makeSkill({
      id: "frontend-testing-debugging",
      name: "frontend-testing-debugging",
      description: "Verify frontend behavior with browser QA.",
      domains: ["frontend"],
      tools: ["Playwright"],
      triggers: ["browser qa screenshots"]
    }),
    makeSkill({
      id: "build-dashboard",
      name: "build-dashboard",
      description: "Build analytics dashboards from KPI data.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["analytics dashboard"]
    }),
    makeSkill({
      id: "data-visualization",
      name: "data-visualization",
      description: "Create charts and visualizations.",
      domains: ["data"],
      tools: ["Node"],
      triggers: ["charts visualization"]
    })
  ];
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

test("validates nightmare case schema and reports broad fragments", () => {
  const index = makeIndex();
  const valid = validateNightmareCases([
    {
      id: "valid-dashboard-shell",
      query: "Build a React dashboard UI shell, not an analytics dashboard.",
      category: "negation",
      expectedPrimary: ["frontend-app-builder"],
      expectedSupport: ["frontend-testing-debugging"],
      expectedTopConcept: ["frontend-implementation"],
      mustNotPrimary: ["build-dashboard"],
      notes: "test"
    },
    {
      id: "broad-warning",
      query: "Check data.",
      category: "ambiguity",
      expectedPrimary: ["frontend-app-builder"],
      expectedSupport: ["data"],
      expectedTopConcept: ["frontend-implementation"],
      notes: "test"
    }
  ], index);

  assert.equal(valid.ok, true);
  assert.equal(valid.cases.length, 2);
  assert.deepEqual(valid.broadExpectedFragments.map((entry) => entry.fragment), ["data"]);

  const invalid = validateNightmareCases([
    {
      id: "bad",
      query: "",
      category: "unknown",
      expectedPrimary: []
    }
  ], index);

  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.some((error) => error.includes("missing query")));
  assert.ok(invalid.errors.some((error) => error.includes("unknown category")));
});

test("scores guardrail violations in nightmare weighted math", () => {
  const perfect = scoreNightmareCase({
    primaryHit: true,
    hitAt3: true,
    reciprocalRankValue: 1,
    supportCoverageValue: 1,
    conceptHit: true,
    expectedOrderScore: 1,
    guardrailCleanliness: true
  });
  const guardrailOnlyMiss = scoreNightmareCase({
    primaryHit: true,
    hitAt3: true,
    reciprocalRankValue: 1,
    supportCoverageValue: 1,
    conceptHit: true,
    expectedOrderScore: 1,
    guardrailCleanliness: false
  });

  assert.equal(perfect, 100);
  assert.equal(guardrailOnlyMiss, 95);

  const testCase = normalizeCase({
    id: "guard",
    query: "Build a React dashboard UI shell, not an analytics dashboard.",
    category: "negation",
    expectedPrimary: ["frontend-app-builder"],
    expectedTopConcept: ["frontend-implementation"],
    mustNotTop5: ["build-dashboard"]
  }, 0);
  const index = makeIndex();
  const result = evaluateSystem({
    index,
    testCase,
    systemName: "synthetic",
    ranked: index.skills.map((skill, score) => ({ ...skill, score: 10 - score })),
    topNames: ["frontend-app-builder", "build-dashboard"],
    primaryName: "frontend-app-builder",
    topConcept: { id: "frontend-implementation", label: "Frontend implementation" }
  });

  assert.deepEqual(result.mustNotTop5Violations, ["build-dashboard"]);
  assert.equal(result.guardrailCleanliness, false);
  assert.equal(result.weightedOutputQualityScore, 95);
});

test("scores expected order using top/workflow names", () => {
  const names = ["figma-use", "figma-implement-design", "frontend-app-builder", "playwright"];

  assert.equal(scoreExpectedOrder(names, ["figma-use", "frontend-app-builder", "playwright"]), 1);
  assert.equal(scoreExpectedOrder(names, ["playwright", "figma-use"]), 0.5);
  assert.equal(scoreExpectedOrder(names, []), 1);
});

test("matches skill and concept fragments with normalized names", () => {
  assert.equal(matchesNameFragment("build-web-apps:frontend-app-builder", ["frontend app builder"]), true);
  assert.equal(matchesNameFragment("pdf", ["pdf:pdf"]), true);
  assert.equal(matchesNameFragment("huggingface-llm-trainer", ["openai-docs"]), false);

  assert.equal(matchesConceptFragment({ id: "frontend-implementation", label: "Frontend implementation" }, ["frontend implementation"]), true);
  assert.equal(matchesConceptFragment({ id: "data-dashboarding", label: "Data dashboards and reports" }, ["security-review"]), false);
});

test("generates a nightmare report from a tiny synthetic index", () => {
  const index = makeIndex();
  const rawCases = [
    {
      id: "synthetic-dashboard-shell",
      query: "Build a React dashboard UI shell, not an analytics dashboard.",
      category: "negation",
      expectedPrimary: ["frontend-app-builder"],
      expectedSupport: ["frontend-testing-debugging"],
      expectedTopConcept: ["frontend-implementation"],
      expectedOrder: ["frontend-app-builder", "frontend-testing-debugging"],
      mustNotPrimary: ["build-dashboard"],
      mustNotTop5: ["build-dashboard"],
      mustNotConcept: ["data-dashboarding"],
      notes: "Synthetic smoke case."
    }
  ];
  const validation = validateNightmareCases(rawCases, index);
  assert.equal(validation.ok, true);

  const result = runNightmareBenchmark({
    index,
    cases: validation.cases,
    validation,
    command: "node synthetic-nightmare"
  });

  assert.equal(result.caseCount, 1);
  assert.equal(result.caseFilePath, "benchmarks/skill-routing-nightmare-cases.json");
  assert.equal(result.reportPath, "docs/SKILL-ROUTING-NIGHTMARE.md");
  assert.equal(result.resultPath, "benchmarks/results/skill-routing-nightmare.latest.json");
  assert.match(result.markdown, /## Category Breakdown/);
  assert.match(result.markdown, /## Guardrail Violations/);
  assert.match(result.markdown, /Case file: `benchmarks\/skill-routing-nightmare-cases\.json`/);
  assert.ok(result.summary.skillweaverV2Concepts.weightedOutputQualityScore > 0);
});
