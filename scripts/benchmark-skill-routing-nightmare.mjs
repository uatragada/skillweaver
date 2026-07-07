#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  rankConceptWorkflowSkills,
  rankSkill,
  recommendConceptWorkflow,
  recommendWorkflow,
  scanSkillRoots,
  searchConcepts
} from "../server/skill-scanner.js";

const DEFAULT_CASES_PATH = resolve("benchmarks/skill-routing-nightmare-cases.json");
const REPORT_PATH = resolve("docs/SKILL-ROUTING-NIGHTMARE.md");
const RESULT_PATH = resolve("benchmarks/results/skill-routing-nightmare.latest.json");
const DEFAULT_CASES_DISPLAY_PATH = "benchmarks/skill-routing-nightmare-cases.json";
const REPORT_DISPLAY_PATH = "docs/SKILL-ROUTING-NIGHTMARE.md";
const RESULT_DISPLAY_PATH = "benchmarks/results/skill-routing-nightmare.latest.json";
const DEFAULT_COMMAND = "npm run benchmark:skills:nightmare";

const CATEGORY_LABELS = new Map([
  ["negation", "Negation"],
  ["multi_intent", "Multi-intent"],
  ["ambiguity", "Ambiguity"],
  ["decoy", "Decoy"],
  ["ordering", "Ordering"],
  ["support_quality", "Support quality"],
  ["concept_collision", "Concept collision"],
  ["source_priority", "Source priority"],
  ["thin_alias", "Thin alias"],
  ["real_world", "Real world"]
]);

const BROAD_EXPECTED_FRAGMENTS = new Set([
  "api",
  "app",
  "data",
  "design",
  "doc",
  "docs",
  "model",
  "pdf",
  "report",
  "review",
  "skill",
  "test",
  "web"
]);

const SOURCE_TYPE_PRIORITY = {
  user: 5,
  system: 4,
  plugin: 3,
  runtime: 2,
  "legacy-plugin-cache": 1,
  external: 0
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "before",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "use",
  "using",
  "with"
]);

function normalizeName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s:.-]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  return normalizeName(value)
    .split(" ")
    .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));
}

function toArray(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  return [String(value).trim()].filter(Boolean);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return `sha256:${createHash("sha256").update(String(value)).digest("hex")}`;
}

function toDisplayPath(path) {
  const relativePath = relative(process.cwd(), path).replace(/\\/g, "/");
  return relativePath && !relativePath.startsWith("..") ? relativePath : String(path).replace(/\\/g, "/");
}

function compactSkill(skill) {
  return {
    id: skill.id,
    name: skill.name,
    score: skill.score,
    sourceType: skill.sourceType,
    conceptId: skill.conceptId ?? null,
    conceptLabel: skill.conceptLabel ?? null
  };
}

function compareRanked(left, right) {
  return (right.score ?? 0) - (left.score ?? 0)
    || (SOURCE_TYPE_PRIORITY[right.sourceType] ?? 0) - (SOURCE_TYPE_PRIORITY[left.sourceType] ?? 0)
    || String(left.name ?? "").localeCompare(String(right.name ?? ""));
}

function dedupeByName(skills) {
  const byName = new Map();
  for (const skill of skills) {
    const key = normalizeName(skill.name);
    const existing = byName.get(key);
    if (!existing || compareRanked(skill, existing) < 0) byName.set(key, skill);
  }
  return [...byName.values()];
}

function matchesNameFragment(name, fragments) {
  const candidate = normalizeName(name);
  if (!candidate) return false;
  return toArray(fragments).some((fragment) => {
    const expected = normalizeName(fragment);
    if (!expected) return false;
    return candidate === expected
      || candidate.includes(expected)
      || expected.includes(candidate)
      || candidate.split(":").at(-1) === expected
      || candidate.split(":").at(-1)?.includes(expected);
  });
}

function matchesConceptFragment(concept, fragments) {
  if (!concept) return false;
  const values = [concept.id, concept.label, concept.conceptId, concept.conceptLabel].map(normalizeName).filter(Boolean);
  return toArray(fragments).some((fragment) => {
    const expected = normalizeName(fragment);
    return values.some((value) => value === expected || value.includes(expected) || expected.includes(value));
  });
}

function findMatchingSkills(index, fragment) {
  return (index.skills ?? []).filter((skill) => matchesNameFragment(skill.name, [fragment]));
}

function findMatchingConcepts(index, fragment) {
  return (index.concepts ?? []).filter((concept) => matchesConceptFragment(concept, [fragment]));
}

function normalizeCase(rawCase, ordinal) {
  const weight = Number(rawCase.weight ?? 1);
  return {
    ...rawCase,
    id: String(rawCase.id ?? `case-${ordinal + 1}`).trim(),
    query: String(rawCase.query ?? "").trim(),
    category: String(rawCase.category ?? rawCase.domain ?? "").trim(),
    weight,
    expectedPrimary: toArray(rawCase.expectedPrimary),
    expectedSupport: toArray(rawCase.expectedSupport),
    expectedTopConcept: toArray(rawCase.expectedTopConcept ?? rawCase.concept),
    expectedOrder: toArray(rawCase.expectedOrder),
    mustNotPrimary: toArray(rawCase.mustNotPrimary),
    mustNotTop5: toArray(rawCase.mustNotTop5),
    mustNotConcept: toArray(rawCase.mustNotConcept),
    notes: String(rawCase.notes ?? "").trim(),
    allowBroadMatch: Boolean(rawCase.allowBroadMatch)
  };
}

function validateNightmareCases(rawCases, index = { skills: [], concepts: [] }) {
  const errors = [];
  const warnings = [];
  const missingExpectedNames = [];
  const missingSkillFragments = [];
  const missingConceptFragments = [];
  const broadExpectedFragments = [];
  const seenIds = new Set();

  if (!Array.isArray(rawCases)) {
    return {
      ok: false,
      cases: [],
      errors: ["nightmare cases file must contain a JSON array"],
      warnings,
      missingExpectedNames,
      missingSkillFragments,
      missingConceptFragments,
      broadExpectedFragments
    };
  }

  const cases = rawCases.map(normalizeCase);

  for (const testCase of cases) {
    if (!testCase.id) errors.push("case missing id");
    if (seenIds.has(testCase.id)) errors.push(`${testCase.id}: duplicate id`);
    seenIds.add(testCase.id);

    if (!testCase.query) errors.push(`${testCase.id}: missing query`);
    if (!CATEGORY_LABELS.has(testCase.category)) errors.push(`${testCase.id}: unknown category: ${testCase.category || "(missing)"}`);
    if (!Number.isFinite(testCase.weight) || testCase.weight <= 0) errors.push(`${testCase.id}: weight must be a positive number`);
    if (!testCase.expectedPrimary.length) errors.push(`${testCase.id}: expectedPrimary must be a non-empty array or string`);

    for (const field of ["expectedPrimary", "expectedSupport", "expectedOrder"]) {
      for (const fragment of testCase[field]) {
        const normalized = normalizeName(fragment);
        if (!testCase.allowBroadMatch && BROAD_EXPECTED_FRAGMENTS.has(normalized)) {
          const issue = { caseId: testCase.id, field, fragment };
          broadExpectedFragments.push(issue);
          warnings.push(`${testCase.id}: ${field} fragment is broad and may overmatch: ${fragment}`);
        }

        if ((index.skills?.length ?? 0) && !findMatchingSkills(index, fragment).length) {
          const issue = { caseId: testCase.id, field, fragment };
          missingExpectedNames.push(issue);
          missingSkillFragments.push(issue);
          warnings.push(`${testCase.id}: ${field} fragment matches no indexed skill: ${fragment}`);
        }
      }
    }

    for (const field of ["mustNotPrimary", "mustNotTop5"]) {
      for (const fragment of testCase[field]) {
        if ((index.skills?.length ?? 0) && !findMatchingSkills(index, fragment).length) {
          const issue = { caseId: testCase.id, field, fragment };
          missingSkillFragments.push(issue);
          warnings.push(`${testCase.id}: ${field} fragment matches no indexed skill: ${fragment}`);
        }
      }
    }

    for (const field of ["expectedTopConcept", "mustNotConcept"]) {
      for (const fragment of testCase[field]) {
        if ((index.concepts?.length ?? 0) && !findMatchingConcepts(index, fragment).length) {
          const issue = { caseId: testCase.id, field, fragment };
          missingConceptFragments.push(issue);
          warnings.push(`${testCase.id}: ${field} fragment matches no indexed concept: ${fragment}`);
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    cases,
    errors,
    warnings,
    missingExpectedNames,
    missingSkillFragments,
    missingConceptFragments,
    broadExpectedFragments
  };
}

function flatMetadataScore(skill, query) {
  const q = normalizeName(query);
  const terms = tokenSet(query);
  const name = normalizeName(skill.name);
  const description = normalizeName(skill.description);
  const namespace = normalizeName(skill.namespace);
  const domainText = normalizeName((skill.domains ?? []).join(" "));
  const toolText = normalizeName((skill.tools ?? []).join(" "));
  let score = 0;

  if (name === q) score += 140;
  if (name.includes(q)) score += 90;
  if (description.includes(q)) score += 60;
  if (namespace && q.includes(namespace)) score += 30;
  if (domainText && q.includes(domainText)) score += 20;

  for (const term of terms) {
    if (name.includes(term)) score += 16;
    if (description.includes(term)) score += 8;
    if (namespace.includes(term)) score += 5;
    if (domainText.includes(term)) score += 3;
    if (toolText.includes(term)) score += 2;
  }

  if (skill.sourceType === "user") score += 1;
  return score;
}

function rankNoSkillWeaver(index, query) {
  return dedupeByName(index.skills ?? [])
    .map((skill) => ({ ...skill, score: flatMetadataScore(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function rankSkillLevelBaseline(index, query) {
  return dedupeByName(index.skills ?? [])
    .map((skill) => ({ ...skill, score: rankSkill(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function mergeTopNames(primaryName, workflowNames, ranked) {
  const names = [];
  for (const name of [primaryName, ...workflowNames, ...ranked.map((skill) => skill.name)]) {
    if (!name) continue;
    if (names.some((existing) => normalizeName(existing) === normalizeName(name))) continue;
    names.push(name);
    if (names.length >= 5) break;
  }
  return names;
}

function firstExpectedRank(ranked, expectedPrimary) {
  const index = ranked.findIndex((skill) => matchesNameFragment(skill.name, expectedPrimary));
  return index >= 0 ? index + 1 : null;
}

function reciprocalRank(rank) {
  return rank ? 1 / rank : 0;
}

function supportCoverage(names, expectedSupport) {
  if (!expectedSupport.length) return 1;
  const hits = expectedSupport.filter((fragment) => names.some((name) => matchesNameFragment(name, [fragment]))).length;
  return hits / expectedSupport.length;
}

function supportPrecision(names, expectedSupport) {
  if (!expectedSupport.length) return 1;
  const supportNames = names.slice(1);
  const hits = expectedSupport.filter((fragment) => supportNames.some((name) => matchesNameFragment(name, [fragment]))).length;
  return hits / Math.max(1, supportNames.length);
}

function missingSupport(names, expectedSupport) {
  return expectedSupport.filter((fragment) => !names.some((name) => matchesNameFragment(name, [fragment])));
}

function scoreExpectedOrder(names, expectedOrder) {
  if (!expectedOrder.length) return 1;
  let previousIndex = -1;
  let matched = 0;

  for (const fragment of expectedOrder) {
    const nextIndex = names.findIndex((name, index) => index > previousIndex && matchesNameFragment(name, [fragment]));
    if (nextIndex === -1) continue;
    matched += 1;
    previousIndex = nextIndex;
  }

  return matched / expectedOrder.length;
}

function legacyOutputQualityScore({ primaryHit, hitAt5, reciprocalRankValue, supportCoverageValue }) {
  return 100 * (
    (primaryHit ? 0.4 : 0)
    + (hitAt5 ? 0.2 : 0)
    + (reciprocalRankValue * 0.2)
    + (supportCoverageValue * 0.2)
  );
}

function scoreNightmareCase({
  primaryHit,
  hitAt3,
  reciprocalRankValue,
  supportCoverageValue,
  conceptHit,
  expectedOrderScore,
  guardrailCleanliness
}) {
  return 100 * (
    (primaryHit ? 0.30 : 0)
    + (hitAt3 ? 0.15 : 0)
    + (reciprocalRankValue * 0.15)
    + (supportCoverageValue * 0.15)
    + (conceptHit ? 0.10 : 0)
    + (expectedOrderScore * 0.10)
    + (guardrailCleanliness ? 0.05 : 0)
  );
}

function decoyPenalty({ forbiddenPrimary, mustNotTop5Violations, forbiddenConcept, confusableWrongPrimary }) {
  return Math.min(1,
    (forbiddenPrimary ? 0.5 : 0)
    + (mustNotTop5Violations.length ? 0.3 : 0)
    + (forbiddenConcept ? 0.2 : 0)
    + (confusableWrongPrimary ? 0.1 : 0)
  );
}

function evaluateSystem({ index, testCase, systemName, ranked, topNames, primaryName, topConcept }) {
  const visibleNames = topNames.length ? topNames.slice(0, 5) : ranked.slice(0, 5).map((skill) => skill.name);
  const primary = primaryName ?? visibleNames[0] ?? null;
  const rank = firstExpectedRank(ranked, testCase.expectedPrimary);
  const topThree = visibleNames.slice(0, 3);
  const forbiddenPrimary = primary && testCase.mustNotPrimary.length
    ? testCase.mustNotPrimary.find((fragment) => matchesNameFragment(primary, [fragment])) ?? null
    : null;
  const mustNotTop5Violations = testCase.mustNotTop5.filter((fragment) =>
    visibleNames.some((name) => matchesNameFragment(name, [fragment]))
  );
  const forbiddenConcept = topConcept && testCase.mustNotConcept.length
    ? testCase.mustNotConcept.find((fragment) => matchesConceptFragment(topConcept, [fragment])) ?? null
    : null;
  const primaryHit = Boolean(primary && !forbiddenPrimary && matchesNameFragment(primary, testCase.expectedPrimary));
  const hitAt3 = topThree.some((name) => matchesNameFragment(name, testCase.expectedPrimary));
  const hitAt5 = visibleNames.some((name) => matchesNameFragment(name, testCase.expectedPrimary));
  const conceptHit = testCase.expectedTopConcept.length
    ? Boolean(topConcept && matchesConceptFragment(topConcept, testCase.expectedTopConcept))
    : true;
  const orderScore = scoreExpectedOrder(visibleNames, testCase.expectedOrder);
  const coverage = supportCoverage(visibleNames, testCase.expectedSupport);
  const precision = supportPrecision(visibleNames, testCase.expectedSupport);
  const supportMisses = missingSupport(visibleNames, testCase.expectedSupport);
  const rr = reciprocalRank(rank);
  const guardrailCleanliness = !forbiddenPrimary && !mustNotTop5Violations.length && !forbiddenConcept;
  const confusableWrongPrimary = Boolean(primary && !primaryHit && hitAt5);
  const penalty = decoyPenalty({
    forbiddenPrimary,
    mustNotTop5Violations,
    forbiddenConcept,
    confusableWrongPrimary
  });
  const nightmareScore = scoreNightmareCase({
    primaryHit,
    hitAt3,
    reciprocalRankValue: rr,
    supportCoverageValue: coverage,
    conceptHit,
    expectedOrderScore: orderScore,
    guardrailCleanliness
  });

  return {
    systemName,
    primary,
    topNames: visibleNames,
    topConcept: topConcept ? {
      id: topConcept.id ?? topConcept.conceptId ?? null,
      label: topConcept.label ?? topConcept.conceptLabel ?? null
    } : null,
    rank,
    primaryHit,
    hitAt3,
    hitAt5,
    reciprocalRank: rr,
    supportCoverage: coverage,
    supportPrecision: precision,
    supportExpectedCount: testCase.expectedSupport.length,
    supportMisses,
    conceptHit,
    expectedOrderScore: orderScore,
    forbiddenPrimary,
    mustNotTop5Violations,
    forbiddenConcept,
    guardrailCleanliness,
    confusableWrongPrimary,
    decoyPenalty: penalty,
    qualityScore: legacyOutputQualityScore({
      primaryHit,
      hitAt5,
      reciprocalRankValue: rr,
      supportCoverageValue: coverage
    }),
    weightedOutputQualityScore: nightmareScore,
    candidatesReviewedToExpected: rank ?? (index.skills?.length ?? 0)
  };
}

function weightedAverage(evaluations, getValue) {
  const totalWeight = evaluations.reduce((sum, entry) => sum + entry.weight, 0) || 1;
  return evaluations.reduce((sum, entry) => sum + (getValue(entry) * entry.weight), 0) / totalWeight;
}

function summarizeSystem(evaluations) {
  const ranks = evaluations.map((entry) => entry.rank ?? Infinity).filter(Number.isFinite).sort((left, right) => left - right);
  const reviewed = evaluations.map((entry) => entry.candidatesReviewedToExpected).sort((left, right) => left - right);
  return {
    cases: evaluations.length,
    totalWeight: evaluations.reduce((sum, entry) => sum + entry.weight, 0),
    primaryHitAt1: weightedAverage(evaluations, (entry) => Number(entry.primaryHit)),
    hitAt3: weightedAverage(evaluations, (entry) => Number(entry.hitAt3)),
    hitAt5: weightedAverage(evaluations, (entry) => Number(entry.hitAt5)),
    mrr: weightedAverage(evaluations, (entry) => entry.reciprocalRank),
    supportCoverage: weightedAverage(evaluations, (entry) => entry.supportCoverage),
    supportPrecisionAt5: weightedAverage(evaluations, (entry) => entry.supportPrecision),
    forbiddenPrimaryRate: weightedAverage(evaluations, (entry) => Number(Boolean(entry.forbiddenPrimary))),
    mustNotTop5ViolationRate: weightedAverage(evaluations, (entry) => Number(entry.mustNotTop5Violations.length > 0)),
    conceptHitAt1: weightedAverage(evaluations, (entry) => Number(entry.conceptHit)),
    forbiddenConceptRate: weightedAverage(evaluations, (entry) => Number(Boolean(entry.forbiddenConcept))),
    expectedOrderScore: weightedAverage(evaluations, (entry) => entry.expectedOrderScore),
    decoyPenalty: weightedAverage(evaluations, (entry) => entry.decoyPenalty),
    outputQualityScore: weightedAverage(evaluations, (entry) => entry.qualityScore),
    weightedOutputQualityScore: weightedAverage(evaluations, (entry) => entry.weightedOutputQualityScore),
    meanCandidatesToExpected: weightedAverage(evaluations, (entry) => entry.candidatesReviewedToExpected),
    medianCandidatesToExpected: reviewed[Math.floor(reviewed.length / 2)] ?? null,
    medianExpectedRank: ranks[Math.floor(ranks.length / 2)] ?? null
  };
}

function summarizeRows(rows) {
  return {
    noSkillWeaver: summarizeSystem(rows.map((row) => ({ ...row.noSkillWeaver, weight: row.weight }))),
    skillLevelBaseline: summarizeSystem(rows.map((row) => ({ ...row.skillLevelBaseline, weight: row.weight }))),
    skillweaverV2Concepts: summarizeSystem(rows.map((row) => ({ ...row.skillweaverV2Concepts, weight: row.weight })))
  };
}

function categoryBreakdown(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.category)) groups.set(row.category, []);
    groups.get(row.category).push(row);
  }
  return [...groups.entries()]
    .map(([category, categoryRows]) => ({
      category,
      label: CATEGORY_LABELS.get(category) ?? category,
      cases: categoryRows.length,
      systems: summarizeRows(categoryRows)
    }))
    .sort((left, right) => left.category.localeCompare(right.category));
}

function collectGuardrailViolations(rows, systemKey) {
  return rows
    .map((row) => {
      const result = row[systemKey];
      const violations = [
        result.forbiddenPrimary ? `forbidden primary: ${result.forbiddenPrimary}` : null,
        ...result.mustNotTop5Violations.map((fragment) => `forbidden top5: ${fragment}`),
        result.forbiddenConcept ? `forbidden concept: ${result.forbiddenConcept}` : null
      ].filter(Boolean);
      return violations.length ? {
        caseId: row.id,
        category: row.category,
        system: result.systemName,
        primary: result.primary,
        topConcept: result.topConcept,
        topNames: result.topNames,
        violations
      } : null;
    })
    .filter(Boolean);
}

function worstCases(rows, limit = 20) {
  return [...rows]
    .sort((left, right) =>
      left.skillweaverV2Concepts.weightedOutputQualityScore - right.skillweaverV2Concepts.weightedOutputQualityScore
      || left.id.localeCompare(right.id)
    )
    .slice(0, limit)
    .map((row) => ({
      caseId: row.id,
      category: row.category,
      weight: row.weight,
      query: row.query,
      expectedPrimary: row.expectedPrimary,
      expectedTopConcept: row.expectedTopConcept,
      v2Primary: row.skillweaverV2Concepts.primary,
      v2TopConcept: row.skillweaverV2Concepts.topConcept,
      v2TopNames: row.skillweaverV2Concepts.topNames,
      weightedOutputQualityScore: row.skillweaverV2Concepts.weightedOutputQualityScore,
      supportMisses: row.skillweaverV2Concepts.supportMisses,
      guardrailViolations: [
        row.skillweaverV2Concepts.forbiddenPrimary ? `forbidden primary: ${row.skillweaverV2Concepts.forbiddenPrimary}` : null,
        ...row.skillweaverV2Concepts.mustNotTop5Violations.map((fragment) => `forbidden top5: ${fragment}`),
        row.skillweaverV2Concepts.forbiddenConcept ? `forbidden concept: ${row.skillweaverV2Concepts.forbiddenConcept}` : null
      ].filter(Boolean),
      notes: row.notes
    }));
}

function getV2TopConcept(index, query, workflow) {
  if (workflow.concept) return workflow.concept;
  return searchConcepts(index, query)[0] ?? null;
}

function evaluateCase(index, testCase) {
  const noRanked = rankNoSkillWeaver(index, testCase.query);
  const v1Ranked = rankSkillLevelBaseline(index, testCase.query);
  const v1Workflow = recommendWorkflow(index, testCase.query);
  const v1TopNames = mergeTopNames(
    v1Workflow.primary?.name,
    (v1Workflow.steps ?? []).map((step) => step.name),
    v1Ranked
  );
  const v2Ranked = rankConceptWorkflowSkills(index, testCase.query);
  const v2Workflow = recommendConceptWorkflow(index, testCase.query);
  const v2TopNames = mergeTopNames(
    v2Workflow.primary?.name,
    (v2Workflow.steps ?? []).map((step) => step.name),
    v2Ranked
  );
  const v2TopConcept = getV2TopConcept(index, testCase.query, v2Workflow);

  return {
    id: testCase.id,
    query: testCase.query,
    category: testCase.category,
    categoryLabel: CATEGORY_LABELS.get(testCase.category) ?? testCase.category,
    weight: testCase.weight,
    expectedPrimary: testCase.expectedPrimary,
    expectedSupport: testCase.expectedSupport,
    expectedTopConcept: testCase.expectedTopConcept,
    expectedOrder: testCase.expectedOrder,
    mustNotPrimary: testCase.mustNotPrimary,
    mustNotTop5: testCase.mustNotTop5,
    mustNotConcept: testCase.mustNotConcept,
    notes: testCase.notes,
    noSkillWeaver: evaluateSystem({
      index,
      testCase,
      systemName: "no-skillweaver",
      ranked: noRanked,
      topNames: noRanked.slice(0, 5).map((skill) => skill.name),
      primaryName: noRanked[0]?.name ?? null,
      topConcept: null
    }),
    skillLevelBaseline: evaluateSystem({
      index,
      testCase,
      systemName: "skill-level-baseline",
      ranked: v1Ranked,
      topNames: v1TopNames,
      primaryName: v1Workflow.primary?.name ?? v1Ranked[0]?.name ?? null,
      topConcept: null
    }),
    skillweaverV2Concepts: evaluateSystem({
      index,
      testCase,
      systemName: "skillweaver-v2-concepts",
      ranked: v2Ranked,
      topNames: v2TopNames,
      primaryName: v2Workflow.primary?.name ?? v2Ranked[0]?.name ?? null,
      topConcept: v2TopConcept
    }),
    debug: {
      noSkillWeaverTop: noRanked.slice(0, 8).map(compactSkill),
      skillLevelTop: v1Ranked.slice(0, 8).map(compactSkill),
      v2Top: v2Ranked.slice(0, 8).map(compactSkill)
    }
  };
}

function compactRow(row) {
  return {
    ...row,
    debug: undefined
  };
}

function evaluateEnforcement(summary) {
  const v2 = summary.skillweaverV2Concepts;
  const failures = [];
  if (v2.weightedOutputQualityScore < 80) failures.push(`V2 weighted score ${v2.weightedOutputQualityScore.toFixed(2)} < 80`);
  if (v2.forbiddenPrimaryRate > 0) failures.push(`V2 forbidden primary rate ${(v2.forbiddenPrimaryRate * 100).toFixed(2)}% > 0%`);
  if (v2.mustNotTop5ViolationRate > 0.05) failures.push(`V2 mustNotTop5 violation rate ${(v2.mustNotTop5ViolationRate * 100).toFixed(2)}% > 5%`);
  if (v2.conceptHitAt1 < 0.70) failures.push(`V2 concept hit@1 ${(v2.conceptHitAt1 * 100).toFixed(2)}% < 70%`);
  return {
    ok: failures.length === 0,
    failures
  };
}

function runNightmareBenchmark({
  index,
  cases,
  validation,
  command = DEFAULT_COMMAND,
  caseFilePath = DEFAULT_CASES_DISPLAY_PATH,
  reportPath = REPORT_DISPLAY_PATH,
  resultPath = RESULT_DISPLAY_PATH,
  generatedAt = Date.now()
}) {
  const rows = cases.map((testCase) => evaluateCase(index, testCase));
  const summary = summarizeRows(rows);
  const categories = categoryBreakdown(rows);
  const worst = worstCases(rows);
  const guardrailViolations = {
    noSkillWeaver: collectGuardrailViolations(rows, "noSkillWeaver"),
    skillLevelBaseline: collectGuardrailViolations(rows, "skillLevelBaseline"),
    skillweaverV2Concepts: collectGuardrailViolations(rows, "skillweaverV2Concepts")
  };
  const corpus = {
    skills: index.skills?.length ?? 0,
    skillEdges: index.edges?.length ?? 0,
    concepts: index.concepts?.length ?? 0,
    conceptEdges: index.conceptEdges?.length ?? 0,
    roots: index.roots?.length ?? 0
  };
  const result = {
    generatedAt,
    generatedAtIso: new Date(generatedAt).toISOString(),
    command,
    caseFilePath,
    reportPath,
    resultPath,
    corpus,
    caseCount: cases.length,
    systemsCompared: [
      "no-skillweaver",
      "skill-level-baseline",
      "skillweaver-v2-concepts"
    ],
    summary,
    categoryBreakdown: categories,
    worstCases: worst,
    guardrailViolations,
    validation,
    inputFingerprint: sha256(stableJson({
      cases,
      corpus,
      command
    })),
    rows: rows.map(compactRow)
  };
  result.enforcement = evaluateEnforcement(summary);
  result.markdown = buildMarkdownReport(result);
  return result;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatScore(value) {
  return value.toFixed(1);
}

function escapeCell(value) {
  return String(value ?? "-")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim() || "-";
}

function formatConcept(concept) {
  if (!concept) return "-";
  return concept.label || concept.id || "-";
}

function formatViolations(result) {
  const values = [
    result.forbiddenPrimary ? `primary:${result.forbiddenPrimary}` : null,
    ...result.mustNotTop5Violations.map((fragment) => `top5:${fragment}`),
    result.forbiddenConcept ? `concept:${result.forbiddenConcept}` : null
  ].filter(Boolean);
  return values.length ? values.join("; ") : "-";
}

function summaryTableRows(summary) {
  const rows = [
    ["Weighted nightmare score", "weightedOutputQualityScore", formatScore],
    ["Legacy output quality score", "outputQualityScore", formatScore],
    ["Primary hit@1", "primaryHitAt1", formatPercent],
    ["Hit@3", "hitAt3", formatPercent],
    ["Hit@5", "hitAt5", formatPercent],
    ["MRR", "mrr", (value) => value.toFixed(3)],
    ["Support coverage", "supportCoverage", formatPercent],
    ["Concept hit@1", "conceptHitAt1", formatPercent],
    ["Expected order score", "expectedOrderScore", formatPercent],
    ["Forbidden primary rate", "forbiddenPrimaryRate", formatPercent],
    ["Must-not top5 violation rate", "mustNotTop5ViolationRate", formatPercent],
    ["Forbidden concept rate", "forbiddenConceptRate", formatPercent],
    ["Decoy penalty", "decoyPenalty", formatPercent]
  ];
  return rows.map(([label, key, formatter]) => ({
    label,
    no: formatter(summary.noSkillWeaver[key]),
    v1: formatter(summary.skillLevelBaseline[key]),
    v2: formatter(summary.skillweaverV2Concepts[key])
  }));
}

function buildMarkdownReport(result) {
  const lines = [
    "# SkillWeaver Nightmare Routing Benchmark",
    "",
    `Generated: ${result.generatedAtIso}`,
    "",
    "This benchmark is adversarial by design. It stresses ambiguity, negation, multi-intent ordering, decoy skills, concept collisions, source-priority ambiguity, and support-skill quality. It should not be used alone to claim product quality.",
    "",
    "## Run Metadata",
    "",
    `- Command: \`${result.command}\``,
    `- Case file: \`${result.caseFilePath}\``,
    `- Result JSON: \`${result.resultPath}\``,
    `- Input fingerprint: \`${result.inputFingerprint}\``,
    "",
    "## Corpus",
    "",
    `- Skills indexed: ${result.corpus.skills}`,
    `- Skill relationship edges: ${result.corpus.skillEdges}`,
    `- Concept nodes: ${result.corpus.concepts}`,
    `- Concept edges: ${result.corpus.conceptEdges}`,
    `- Skill roots: ${result.corpus.roots}`,
    `- Nightmare cases: ${result.caseCount}`,
    "",
    "## Compared Systems",
    "",
    "- `no-skillweaver`: flat metadata baseline over names, descriptions, namespaces, domains, and tools.",
    "- `skill-level-baseline`: `rankSkill` plus `recommendWorkflow`.",
    "- `skillweaver-v2-concepts`: `rankConceptWorkflowSkills` plus `recommendConceptWorkflow` and `searchConcepts`.",
    "",
    "## Summary",
    "",
    "| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 Concepts |",
    "| --- | ---: | ---: | ---: |"
  ];

  for (const row of summaryTableRows(result.summary)) {
    lines.push(`| ${row.label} | ${row.no} | ${row.v1} | ${row.v2} |`);
  }

  lines.push(
    "",
    "## Category Breakdown",
    "",
    "| Category | Cases | No score | Skill-level score | V2 score | V2 hit@1 | V2 concept hit@1 | V2 guardrail violation rate |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
  );

  for (const category of result.categoryBreakdown) {
    const v2 = category.systems.skillweaverV2Concepts;
    lines.push(`| ${escapeCell(category.label)} | ${category.cases} | ${formatScore(category.systems.noSkillWeaver.weightedOutputQualityScore)} | ${formatScore(category.systems.skillLevelBaseline.weightedOutputQualityScore)} | ${formatScore(v2.weightedOutputQualityScore)} | ${formatPercent(v2.primaryHitAt1)} | ${formatPercent(v2.conceptHitAt1)} | ${formatPercent(Math.max(v2.forbiddenPrimaryRate, v2.mustNotTop5ViolationRate, v2.forbiddenConceptRate))} |`);
  }

  lines.push(
    "",
    "## Worst 20 Cases",
    "",
    "| Case | Category | V2 score | Expected primary | V2 primary | V2 top concept | V2 top/workflow 5 | Support misses | Guardrails |",
    "| --- | --- | ---: | --- | --- | --- | --- | --- | --- |"
  );

  for (const row of result.worstCases) {
    lines.push(`| ${escapeCell(row.caseId)} | ${escapeCell(CATEGORY_LABELS.get(row.category) ?? row.category)} | ${formatScore(row.weightedOutputQualityScore)} | ${escapeCell(row.expectedPrimary.join(", "))} | ${escapeCell(row.v2Primary)} | ${escapeCell(formatConcept(row.v2TopConcept))} | ${escapeCell(row.v2TopNames.join(" -> "))} | ${escapeCell(row.supportMisses.join(", ") || "-")} | ${escapeCell(row.guardrailViolations.join("; ") || "-")} |`);
  }

  lines.push(
    "",
    "## Guardrail Violations",
    "",
    `- No SkillWeaver: ${result.guardrailViolations.noSkillWeaver.length}`,
    `- Skill-level baseline: ${result.guardrailViolations.skillLevelBaseline.length}`,
    `- SkillWeaver V2 concepts: ${result.guardrailViolations.skillweaverV2Concepts.length}`,
    ""
  );

  if (result.guardrailViolations.skillweaverV2Concepts.length) {
    lines.push(
      "| Case | Violations | V2 primary | V2 top concept | V2 top/workflow 5 |",
      "| --- | --- | --- | --- | --- |"
    );
    for (const violation of result.guardrailViolations.skillweaverV2Concepts) {
      lines.push(`| ${escapeCell(violation.caseId)} | ${escapeCell(violation.violations.join("; "))} | ${escapeCell(violation.primary)} | ${escapeCell(formatConcept(violation.topConcept))} | ${escapeCell(violation.topNames.join(" -> "))} |`);
    }
  } else {
    lines.push("No V2 guardrail violations.");
  }

  lines.push(
    "",
    "## Validation Warnings",
    "",
    result.validation.warnings.length ? result.validation.warnings.map((warning) => `- ${warning}`).join("\n") : "No validation warnings.",
    "",
    "## Per-Case Results",
    "",
    "| Case | Category | Weight | Expected primary | Expected concept | No primary | Skill-level primary | V2 primary | V2 concept | V2 score | V2 top/workflow 5 | V2 guardrails | Notes |",
    "| --- | --- | ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |"
  );

  for (const row of result.rows) {
    lines.push(`| ${escapeCell(row.id)} | ${escapeCell(row.categoryLabel)} | ${row.weight} | ${escapeCell(row.expectedPrimary.join(", "))} | ${escapeCell(row.expectedTopConcept.join(", "))} | ${escapeCell(row.noSkillWeaver.primary)} | ${escapeCell(row.skillLevelBaseline.primary)} | ${escapeCell(row.skillweaverV2Concepts.primary)} | ${escapeCell(formatConcept(row.skillweaverV2Concepts.topConcept))} | ${formatScore(row.skillweaverV2Concepts.weightedOutputQualityScore)} | ${escapeCell(row.skillweaverV2Concepts.topNames.join(" -> "))} | ${escapeCell(formatViolations(row.skillweaverV2Concepts))} | ${escapeCell(row.notes)} |`);
  }

  lines.push(
    "",
    "## Interpretation",
    "",
    `SkillWeaver V2 concepts scored ${formatScore(result.summary.skillweaverV2Concepts.weightedOutputQualityScore)} on the weighted nightmare score, versus ${formatScore(result.summary.noSkillWeaver.weightedOutputQualityScore)} for no SkillWeaver and ${formatScore(result.summary.skillLevelBaseline.weightedOutputQualityScore)} for the skill-level baseline.`,
    `The V2 primary hit@1 is ${formatPercent(result.summary.skillweaverV2Concepts.primaryHitAt1)}, concept hit@1 is ${formatPercent(result.summary.skillweaverV2Concepts.conceptHitAt1)}, and must-not top5 violation rate is ${formatPercent(result.summary.skillweaverV2Concepts.mustNotTop5ViolationRate)}.`,
    "Failures here are useful backlog evidence, not proof that product routing is bad in normal traffic. This suite is intentionally harder than the active acceptance benchmark and should be paired with acceptance, holdout, and real-task evidence before making broad product-quality claims.",
    ""
  );

  return `${lines.join("\n")}\n`;
}

function parseArgs(argv) {
  const options = {
    casesPath: DEFAULT_CASES_PATH,
    json: false,
    enforce: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--enforce") {
      options.enforce = true;
    } else if (arg === "--cases") {
      options.casesPath = resolve(argv[index + 1]);
      index += 1;
    } else if (arg.startsWith("--cases=")) {
      options.casesPath = resolve(arg.slice("--cases=".length));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const rawCases = JSON.parse(await readFile(options.casesPath, "utf8"));
  const index = await scanSkillRoots();
  const validation = validateNightmareCases(rawCases, index);
  if (!validation.ok) {
    console.error(`Nightmare case validation failed:\n${validation.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exitCode = 1;
    return null;
  }

  const command = [
    DEFAULT_COMMAND,
    options.casesPath === DEFAULT_CASES_PATH ? "" : `-- --cases ${toDisplayPath(options.casesPath)}`,
    options.enforce ? "--enforce" : "",
    options.json ? "--json" : ""
  ].filter(Boolean).join(" ");
  const result = runNightmareBenchmark({
    index,
    cases: validation.cases,
    validation,
    command,
    caseFilePath: options.casesPath === DEFAULT_CASES_PATH ? DEFAULT_CASES_DISPLAY_PATH : toDisplayPath(options.casesPath)
  });

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await mkdir(dirname(RESULT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, result.markdown);
  await writeFile(RESULT_PATH, `${JSON.stringify({ ...result, markdown: undefined }, null, 2)}\n`);

  if (options.json) {
    console.log(JSON.stringify({ ...result, markdown: undefined }, null, 2));
  } else {
    console.log([
      `Nightmare benchmark written to ${REPORT_PATH}`,
      `Result JSON written to ${RESULT_PATH}`,
      `V2 weighted nightmare score: ${formatScore(result.summary.skillweaverV2Concepts.weightedOutputQualityScore)}`,
      `V2 primary hit@1: ${formatPercent(result.summary.skillweaverV2Concepts.primaryHitAt1)}`,
      `V2 concept hit@1: ${formatPercent(result.summary.skillweaverV2Concepts.conceptHitAt1)}`,
      `V2 must-not top5 violation rate: ${formatPercent(result.summary.skillweaverV2Concepts.mustNotTop5ViolationRate)}`,
      `Validation warnings: ${result.validation.warnings.length}`
    ].join("\n"));
  }

  if (options.enforce && !result.enforcement.ok) {
    console.error(`Nightmare enforcement failed:\n${result.enforcement.failures.map((failure) => `- ${failure}`).join("\n")}`);
    process.exitCode = 1;
  }

  return result;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  await main();
}

export {
  BROAD_EXPECTED_FRAGMENTS,
  CATEGORY_LABELS,
  buildMarkdownReport,
  evaluateSystem,
  matchesConceptFragment,
  matchesNameFragment,
  normalizeCase,
  normalizeName,
  runNightmareBenchmark,
  scoreExpectedOrder,
  scoreNightmareCase,
  validateNightmareCases
};
