import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  rankSkill,
  recommendWorkflow,
  scanSkillRoots
} from "../server/skill-scanner.js";

const CASES_PATH = resolve("benchmarks/skill-routing-cases.json");
const REPORT_PATH = resolve("docs/SKILL-USE-GAINS.md");

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

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s:.-]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  return normalize(value)
    .split(" ")
    .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));
}

function skillKey(skillOrName) {
  return normalize(typeof skillOrName === "string" ? skillOrName : skillOrName?.name);
}

function matchesExpected(name, expectedNames) {
  const candidate = skillKey(name);
  return expectedNames.some((expected) => {
    const value = skillKey(expected);
    return candidate === value || candidate.includes(value) || value.includes(candidate);
  });
}

function dedupeByName(skills) {
  const byName = new Map();
  for (const skill of skills) {
    const key = skillKey(skill);
    const existing = byName.get(key);
    if (!existing || (SOURCE_TYPE_PRIORITY[skill.sourceType] ?? 0) > (SOURCE_TYPE_PRIORITY[existing.sourceType] ?? 0)) {
      byName.set(key, skill);
    }
  }
  return [...byName.values()];
}

function compareRanked(left, right) {
  return right.score - left.score
    || (SOURCE_TYPE_PRIORITY[right.sourceType] ?? 0) - (SOURCE_TYPE_PRIORITY[left.sourceType] ?? 0)
    || left.name.localeCompare(right.name);
}

function flatMetadataScore(skill, query) {
  const q = normalize(query);
  const terms = tokenSet(query);
  const name = normalize(skill.name);
  const description = normalize(skill.description);
  const namespace = normalize(skill.namespace);
  const domainText = normalize((skill.domains ?? []).join(" "));
  const toolText = normalize((skill.tools ?? []).join(" "));
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

function rankFlatMetadata(index, query) {
  return dedupeByName(index.skills)
    .map((skill) => ({ ...skill, score: flatMetadataScore(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function rankSkillWeaver(index, query) {
  return dedupeByName(index.skills)
    .map((skill) => ({ ...skill, score: rankSkill(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function firstExpectedRank(ranked, expectedPrimary) {
  const index = ranked.findIndex((skill) => matchesExpected(skill.name, expectedPrimary));
  return index >= 0 ? index + 1 : null;
}

function supportCoverage(names, expectedSupport) {
  if (!expectedSupport?.length) return 1;
  const hitCount = expectedSupport.filter((expected) => names.some((name) => matchesExpected(name, [expected]))).length;
  return hitCount / expectedSupport.length;
}

function reciprocalRank(rank) {
  return rank ? 1 / rank : 0;
}

function outputQualityScore({ primaryHit, hitAt5, reciprocalRank, supportCoverage }) {
  return 100 * (
    (primaryHit ? 0.4 : 0)
    + (hitAt5 ? 0.2 : 0)
    + (reciprocalRank * 0.2)
    + (supportCoverage * 0.2)
  );
}

function evaluateSystem({ index, testCase, systemName, ranked, workflowNames = null, primaryName = null }) {
  const topNames = workflowNames ?? ranked.slice(0, 5).map((skill) => skill.name);
  const primary = primaryName ?? topNames[0] ?? null;
  const rank = firstExpectedRank(ranked, testCase.expectedPrimary);
  const primaryHit = Boolean(primary && matchesExpected(primary, testCase.expectedPrimary));
  const hitAt5 = topNames.some((name) => matchesExpected(name, testCase.expectedPrimary));
  const coverage = supportCoverage(topNames, testCase.expectedSupport ?? []);
  const rr = reciprocalRank(rank);

  return {
    systemName,
    primary,
    topNames,
    rank,
    primaryHit,
    hitAt5,
    reciprocalRank: rr,
    supportCoverage: coverage,
    candidatesReviewedToExpected: rank ?? index.skills.length,
    qualityScore: outputQualityScore({
      primaryHit,
      hitAt5,
      reciprocalRank: rr,
      supportCoverage: coverage
    })
  };
}

function summarize(evaluations) {
  const total = evaluations.length || 1;
  const ranks = evaluations.map((entry) => entry.rank ?? Infinity).filter(Number.isFinite).sort((left, right) => left - right);
  const reviewed = evaluations.map((entry) => entry.candidatesReviewedToExpected).sort((left, right) => left - right);
  return {
    cases: evaluations.length,
    primaryHitAt1: evaluations.filter((entry) => entry.primaryHit).length / total,
    hitAt5: evaluations.filter((entry) => entry.hitAt5).length / total,
    mrr: evaluations.reduce((sum, entry) => sum + entry.reciprocalRank, 0) / total,
    supportCoverage: evaluations.reduce((sum, entry) => sum + entry.supportCoverage, 0) / total,
    outputQualityScore: evaluations.reduce((sum, entry) => sum + entry.qualityScore, 0) / total,
    meanCandidatesToExpected: evaluations.reduce((sum, entry) => sum + entry.candidatesReviewedToExpected, 0) / total,
    medianCandidatesToExpected: reviewed[Math.floor(reviewed.length / 2)] ?? null,
    medianExpectedRank: ranks[Math.floor(ranks.length / 2)] ?? null
  };
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDelta(value, suffix = "") {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${suffix}`;
}

function formatPreciseDelta(value, suffix = "") {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(3)}${suffix}`;
}

function formatLowerIsBetterDelta(nextValue, baselineValue, unit) {
  const delta = nextValue - baselineValue;
  if (Math.abs(delta) < 0.05) return `0.0 ${unit}`;
  return delta > 0
    ? `+${delta.toFixed(1)} ${unit} worse`
    : `${delta.toFixed(1)} ${unit} better`;
}

function formatRank(rank) {
  return rank ? String(rank) : "> corpus";
}

function buildMarkdown({ index, cases, rows, flatSummary, skillWeaverSummary, generatedAt }) {
  const primaryDelta = (skillWeaverSummary.primaryHitAt1 - flatSummary.primaryHitAt1) * 100;
  const hitDelta = (skillWeaverSummary.hitAt5 - flatSummary.hitAt5) * 100;
  const mrrDelta = skillWeaverSummary.mrr - flatSummary.mrr;
  const supportDelta = (skillWeaverSummary.supportCoverage - flatSummary.supportCoverage) * 100;
  const qualityDelta = skillWeaverSummary.outputQualityScore - flatSummary.outputQualityScore;
  const candidateReduction = 1 - (5 / index.skills.length);
  const candidateDelta = formatLowerIsBetterDelta(
    skillWeaverSummary.meanCandidatesToExpected,
    flatSummary.meanCandidatesToExpected,
    "candidates"
  );
  const medianCandidateDelta = formatLowerIsBetterDelta(
    skillWeaverSummary.medianCandidatesToExpected,
    flatSummary.medianCandidatesToExpected,
    "candidates"
  );

  const lines = [
    "# Skill Use Gains Benchmark",
    "",
    `Generated: ${new Date(generatedAt).toLocaleString()}`,
    "",
    "## Corpus",
    "",
    `- Skills indexed: ${index.skills.length}`,
    `- Relationship edges: ${index.edges.length}`,
    `- Skill roots: ${index.roots.length}`,
    `- Benchmark cases: ${cases.length}`,
    "",
    "## Compared Systems",
    "",
    "- `flat-metadata`: ranks the same skill corpus using only name, description, namespace, domains, and tool hints.",
    "- `skillweaver`: uses SkillWeaver ranking plus workflow recommendations from triggers, body/resource signals, dedupe, gateway boosts, and relationship edges.",
    "",
    "## Summary",
    "",
    "| Metric | Flat Metadata | SkillWeaver | Gain |",
    "| --- | ---: | ---: | ---: |",
    `| Output quality score (0-100) | ${flatSummary.outputQualityScore.toFixed(1)} | ${skillWeaverSummary.outputQualityScore.toFixed(1)} | ${formatDelta(qualityDelta, " pts")} |`,
    `| Primary hit@1 | ${formatPercent(flatSummary.primaryHitAt1)} | ${formatPercent(skillWeaverSummary.primaryHitAt1)} | ${formatDelta(primaryDelta, " pp")} |`,
    `| Expected skill in top/workflow 5 | ${formatPercent(flatSummary.hitAt5)} | ${formatPercent(skillWeaverSummary.hitAt5)} | ${formatDelta(hitDelta, " pp")} |`,
    `| Mean reciprocal rank | ${flatSummary.mrr.toFixed(3)} | ${skillWeaverSummary.mrr.toFixed(3)} | ${formatPreciseDelta(mrrDelta)} |`,
    `| Support-skill coverage@5 | ${formatPercent(flatSummary.supportCoverage)} | ${formatPercent(skillWeaverSummary.supportCoverage)} | ${formatDelta(supportDelta, " pp")} |`,
    `| Mean candidates to expected skill, lower is better | ${flatSummary.meanCandidatesToExpected.toFixed(1)} | ${skillWeaverSummary.meanCandidatesToExpected.toFixed(1)} | ${candidateDelta} |`,
    `| Median candidates to expected skill, lower is better | ${flatSummary.medianCandidatesToExpected} | ${skillWeaverSummary.medianCandidatesToExpected} | ${medianCandidateDelta} |`,
    "",
    `SkillWeaver's top-5 workflow narrows the review set from ${index.skills.length} skills to 5 candidates, a ${(candidateReduction * 100).toFixed(1)}% candidate reduction per task.`,
    "",
    "## Per-Case Results",
    "",
    "| Case | Expected | Flat quality | SkillWeaver quality | Flat primary / rank | SkillWeaver primary / rank | SkillWeaver workflow |",
    "| --- | --- | ---: | ---: | --- | --- | --- |"
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.id} | ${row.expectedPrimary.join(", ")} | ${row.flat.qualityScore.toFixed(1)} | ${row.skillweaver.qualityScore.toFixed(1)} | ${row.flat.primary ?? "-"} / ${formatRank(row.flat.rank)} | ${row.skillweaver.primary ?? "-"} / ${formatRank(row.skillweaver.rank)} | ${row.skillweaver.topNames.join(" -> ")} |`
    );
  }

  lines.push(
    "",
    "## Interpretation",
    "",
    `SkillWeaver improves the composite output-quality score by ${formatDelta(qualityDelta, " points")} on a 0-100 rubric over flat metadata search.`,
    `It improves primary selection by ${formatDelta(primaryDelta, " percentage points")} and expected-skill top/workflow-5 retrieval by ${formatDelta(hitDelta, " percentage points")} over flat metadata search on this benchmark.`,
    `Flat metadata still has a slight edge on mean expected-skill rank: ${flatSummary.meanCandidatesToExpected.toFixed(1)} candidates versus ${skillWeaverSummary.meanCandidatesToExpected.toFixed(1)} for SkillWeaver. SkillWeaver's quality gain comes from better primary choices and slightly better support-skill coverage, not faster first expected-skill rank on this dataset.`,
    "Remaining weak spots are cases where a broad foundational skill is a plausible primary but a more concrete plugin task skill should be preferred, especially data dashboard work."
  );

  return `${lines.join("\n")}\n`;
}

async function main() {
  const cases = JSON.parse(await readFile(CASES_PATH, "utf8"));
  const index = await scanSkillRoots();
  const rows = [];

  for (const testCase of cases) {
    const flatRanked = rankFlatMetadata(index, testCase.query);
    const skillWeaverRanked = rankSkillWeaver(index, testCase.query);
    const workflow = recommendWorkflow(index, testCase.query);
    const workflowNames = (workflow.steps ?? []).map((step) => step.name);

    rows.push({
      id: testCase.id,
      query: testCase.query,
      expectedPrimary: testCase.expectedPrimary,
      expectedSupport: testCase.expectedSupport ?? [],
      flat: evaluateSystem({
        index,
        testCase,
        systemName: "flat-metadata",
        ranked: flatRanked
      }),
      skillweaver: evaluateSystem({
        index,
        testCase,
        systemName: "skillweaver",
        ranked: skillWeaverRanked,
        workflowNames,
        primaryName: workflow.primary?.name ?? null
      })
    });
  }

  const flatSummary = summarize(rows.map((row) => row.flat));
  const skillWeaverSummary = summarize(rows.map((row) => row.skillweaver));
  const generatedAt = Date.now();
  const report = buildMarkdown({
    index,
    cases,
    rows,
    flatSummary,
    skillWeaverSummary,
    generatedAt
  });

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, report);

  const output = {
    generatedAt,
    corpus: {
      skills: index.skills.length,
      edges: index.edges.length,
      roots: index.roots.length
    },
    flatMetadata: flatSummary,
    skillweaver: skillWeaverSummary,
    gains: {
      primaryHitAt1PercentagePoints: (skillWeaverSummary.primaryHitAt1 - flatSummary.primaryHitAt1) * 100,
      hitAt5PercentagePoints: (skillWeaverSummary.hitAt5 - flatSummary.hitAt5) * 100,
      mrr: skillWeaverSummary.mrr - flatSummary.mrr,
      supportCoveragePercentagePoints: (skillWeaverSummary.supportCoverage - flatSummary.supportCoverage) * 100,
      outputQualityScore: skillWeaverSummary.outputQualityScore - flatSummary.outputQualityScore,
      meanExpectedRankDeltaLowerIsBetter: skillWeaverSummary.meanCandidatesToExpected - flatSummary.meanCandidatesToExpected
    },
    reportPath: REPORT_PATH
  };

  console.log(JSON.stringify(output, null, 2));
}

await main();
