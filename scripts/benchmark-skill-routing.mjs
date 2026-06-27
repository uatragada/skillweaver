import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  rankConceptWorkflowSkills,
  rankSkill,
  recommendWorkflow,
  scanSkillRoots
} from "../server/skill-scanner.js";

const CASES_PATH = resolve("benchmarks/skill-routing-cases.json");
const REPORT_PATH = resolve("docs/SKILL-USE-GAINS.md");
const PRE_CONCEPT_COMMIT = "80d31f1";

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
    if (!existing || compareRanked(skill, existing) < 0) {
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

function rankNoSkillWeaver(index, query) {
  return dedupeByName(index.skills)
    .map((skill) => ({ ...skill, score: flatMetadataScore(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function rankSkillWeaverV1(index, query) {
  return dedupeByName(index.skills)
    .map((skill) => ({ ...skill, score: rankSkill(skill, query) }))
    .filter((skill) => skill.score > 0)
    .sort(compareRanked);
}

function rankSkillWeaverV2(index, query) {
  return rankConceptWorkflowSkills(index, query);
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

function evaluateSystem({ index, testCase, systemName, ranked, topNames = null, primaryName = null, contextLabel = null }) {
  const visibleNames = topNames ?? ranked.slice(0, 5).map((skill) => skill.name);
  const primary = primaryName ?? visibleNames[0] ?? null;
  const rank = firstExpectedRank(ranked, testCase.expectedPrimary);
  const forbiddenPrimary = primary && testCase.mustNotPrimary?.length
    ? testCase.mustNotPrimary.find((expected) => matchesExpected(primary, [expected])) ?? null
    : null;
  const primaryHit = Boolean(primary && !forbiddenPrimary && matchesExpected(primary, testCase.expectedPrimary));
  const hitAt5 = visibleNames.some((name) => matchesExpected(name, testCase.expectedPrimary));
  const coverage = supportCoverage(visibleNames, testCase.expectedSupport ?? []);
  const rr = reciprocalRank(rank);

  return {
    systemName,
    primary,
    topNames: visibleNames,
    contextLabel,
    rank,
    primaryHit,
    hitAt5,
    forbiddenPrimary,
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
    forbiddenPrimaryRate: evaluations.filter((entry) => entry.forbiddenPrimary).length / total,
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

function formatLowerIsBetterPercentDelta(nextValue, baselineValue) {
  const delta = (nextValue - baselineValue) * 100;
  if (Math.abs(delta) < 0.05) return "0.0 pp";
  return delta > 0
    ? `+${delta.toFixed(1)} pp worse`
    : `${delta.toFixed(1)} pp better`;
}

function formatRank(rank) {
  return rank ? String(rank) : "> corpus";
}

function formatPrimaryCell(result) {
  const warning = result.forbiddenPrimary ? ` !${result.forbiddenPrimary}` : "";
  return `${result.primary ?? "-"}${warning} / ${formatRank(result.rank)}`;
}

function buildSummaryRows({ noSkillWeaverSummary, v1Summary, v2Summary }) {
  return [
    {
      metric: "Output quality score (0-100)",
      no: noSkillWeaverSummary.outputQualityScore.toFixed(1),
      v1: v1Summary.outputQualityScore.toFixed(1),
      v2: v2Summary.outputQualityScore.toFixed(1),
      v2VsNo: formatDelta(v2Summary.outputQualityScore - noSkillWeaverSummary.outputQualityScore, " pts"),
      v2VsV1: formatDelta(v2Summary.outputQualityScore - v1Summary.outputQualityScore, " pts")
    },
    {
      metric: "Primary hit@1",
      no: formatPercent(noSkillWeaverSummary.primaryHitAt1),
      v1: formatPercent(v1Summary.primaryHitAt1),
      v2: formatPercent(v2Summary.primaryHitAt1),
      v2VsNo: formatDelta((v2Summary.primaryHitAt1 - noSkillWeaverSummary.primaryHitAt1) * 100, " pp"),
      v2VsV1: formatDelta((v2Summary.primaryHitAt1 - v1Summary.primaryHitAt1) * 100, " pp")
    },
    {
      metric: "Expected skill in top/workflow 5",
      no: formatPercent(noSkillWeaverSummary.hitAt5),
      v1: formatPercent(v1Summary.hitAt5),
      v2: formatPercent(v2Summary.hitAt5),
      v2VsNo: formatDelta((v2Summary.hitAt5 - noSkillWeaverSummary.hitAt5) * 100, " pp"),
      v2VsV1: formatDelta((v2Summary.hitAt5 - v1Summary.hitAt5) * 100, " pp")
    },
    {
      metric: "Mean reciprocal rank",
      no: noSkillWeaverSummary.mrr.toFixed(3),
      v1: v1Summary.mrr.toFixed(3),
      v2: v2Summary.mrr.toFixed(3),
      v2VsNo: formatPreciseDelta(v2Summary.mrr - noSkillWeaverSummary.mrr),
      v2VsV1: formatPreciseDelta(v2Summary.mrr - v1Summary.mrr)
    },
    {
      metric: "Support-skill coverage@5",
      no: formatPercent(noSkillWeaverSummary.supportCoverage),
      v1: formatPercent(v1Summary.supportCoverage),
      v2: formatPercent(v2Summary.supportCoverage),
      v2VsNo: formatDelta((v2Summary.supportCoverage - noSkillWeaverSummary.supportCoverage) * 100, " pp"),
      v2VsV1: formatDelta((v2Summary.supportCoverage - v1Summary.supportCoverage) * 100, " pp")
    },
    {
      metric: "Forbidden primary rate, lower is better",
      no: formatPercent(noSkillWeaverSummary.forbiddenPrimaryRate),
      v1: formatPercent(v1Summary.forbiddenPrimaryRate),
      v2: formatPercent(v2Summary.forbiddenPrimaryRate),
      v2VsNo: formatLowerIsBetterPercentDelta(v2Summary.forbiddenPrimaryRate, noSkillWeaverSummary.forbiddenPrimaryRate),
      v2VsV1: formatLowerIsBetterPercentDelta(v2Summary.forbiddenPrimaryRate, v1Summary.forbiddenPrimaryRate)
    },
    {
      metric: "Mean candidates to expected skill, lower is better",
      no: noSkillWeaverSummary.meanCandidatesToExpected.toFixed(1),
      v1: v1Summary.meanCandidatesToExpected.toFixed(1),
      v2: v2Summary.meanCandidatesToExpected.toFixed(1),
      v2VsNo: formatLowerIsBetterDelta(v2Summary.meanCandidatesToExpected, noSkillWeaverSummary.meanCandidatesToExpected, "candidates"),
      v2VsV1: formatLowerIsBetterDelta(v2Summary.meanCandidatesToExpected, v1Summary.meanCandidatesToExpected, "candidates")
    }
  ];
}

function buildMarkdown({ index, cases, rows, noSkillWeaverSummary, v1Summary, v2Summary, generatedAt }) {
  const summaryRows = buildSummaryRows({ noSkillWeaverSummary, v1Summary, v2Summary });
  const candidateReduction = 1 - (5 / index.skills.length);
  const qualityVsNo = v2Summary.outputQualityScore - noSkillWeaverSummary.outputQualityScore;
  const qualityVsV1 = v2Summary.outputQualityScore - v1Summary.outputQualityScore;

  const lines = [
    "# SkillWeaver V2 Benchmark",
    "",
    `Generated: ${new Date(generatedAt).toLocaleString()}`,
    "",
    "## Corpus",
    "",
    `- Skills indexed: ${index.skills.length}`,
    `- Skill relationship edges: ${index.edges.length}`,
    `- Concept nodes: ${index.concepts?.length ?? 0}`,
    `- Concept edges: ${index.conceptEdges?.length ?? 0}`,
    `- Skill roots: ${index.roots.length}`,
    `- Benchmark cases: ${cases.length}`,
    "",
    "## Compared Systems",
    "",
    "- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.",
    "- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `" + PRE_CONCEPT_COMMIT + "`.",
    "- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.",
    "",
    "## Summary",
    "",
    "| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |",
    "| --- | ---: | ---: | ---: | ---: | ---: |"
  ];

  for (const row of summaryRows) {
    lines.push(`| ${row.metric} | ${row.no} | ${row.v1} | ${row.v2} | ${row.v2VsNo} | ${row.v2VsV1} |`);
  }

  lines.push(
    "",
    `Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from ${index.skills.length} skills to 5 candidates, a ${(candidateReduction * 100).toFixed(1)}% candidate reduction per task.`,
    "",
    "## Per-Case Results",
    "",
    "| Case | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |",
    "| --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const row of rows) {
    lines.push(
      `| ${row.id} | ${row.expectedPrimary.join(", ")} | ${formatPrimaryCell(row.noSkillWeaver)} | ${formatPrimaryCell(row.v1)} | ${formatPrimaryCell(row.v2)} | ${row.v2.contextLabel ?? "-"} | ${row.v2.topNames.join(" -> ")} |`
    );
  }

  lines.push(
    "",
    "## Interpretation",
    "",
    `SkillWeaver V2 changes the composite output-quality score by ${formatDelta(qualityVsNo, " points")} versus no SkillWeaver and ${formatDelta(qualityVsV1, " points")} versus the skill-level baseline.`,
    `V2 changes primary selection by ${formatDelta((v2Summary.primaryHitAt1 - noSkillWeaverSummary.primaryHitAt1) * 100, " percentage points")} versus no SkillWeaver and ${formatDelta((v2Summary.primaryHitAt1 - v1Summary.primaryHitAt1) * 100, " percentage points")} versus the skill-level baseline.`,
    `V2 changes expected-skill top/workflow-5 retrieval by ${formatDelta((v2Summary.hitAt5 - noSkillWeaverSummary.hitAt5) * 100, " percentage points")} versus no SkillWeaver and ${formatDelta((v2Summary.hitAt5 - v1Summary.hitAt5) * 100, " percentage points")} versus the skill-level baseline.`,
    "The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus."
  );

  return `${lines.join("\n")}\n`;
}

async function main() {
  const cases = JSON.parse(await readFile(CASES_PATH, "utf8"));
  const index = await scanSkillRoots();
  const rows = [];

  for (const testCase of cases) {
    const noRanked = rankNoSkillWeaver(index, testCase.query);
    const v1Ranked = rankSkillWeaverV1(index, testCase.query);
    const v1Workflow = recommendWorkflow(index, testCase.query);
    const v1WorkflowNames = (v1Workflow.steps ?? []).map((step) => step.name);
    const v2Ranked = rankSkillWeaverV2(index, testCase.query);
    const v2WorkflowNames = v2Ranked.slice(0, 5).map((skill) => skill.name);

    rows.push({
      id: testCase.id,
      query: testCase.query,
      expectedPrimary: testCase.expectedPrimary,
      expectedSupport: testCase.expectedSupport ?? [],
      noSkillWeaver: evaluateSystem({
        index,
        testCase,
        systemName: "no-skillweaver",
        ranked: noRanked
      }),
      v1: evaluateSystem({
        index,
        testCase,
        systemName: "skillweaver-v1",
        ranked: v1Ranked,
        topNames: v1WorkflowNames,
        primaryName: v1Workflow.primary?.name ?? null
      }),
      v2: evaluateSystem({
        index,
        testCase,
        systemName: "skillweaver-v2-concepts",
        ranked: v2Ranked,
        topNames: v2WorkflowNames,
        primaryName: v2Ranked[0]?.name ?? null,
        contextLabel: v2Ranked[0]?.conceptLabel ?? null
      })
    });
  }

  const noSkillWeaverSummary = summarize(rows.map((row) => row.noSkillWeaver));
  const v1Summary = summarize(rows.map((row) => row.v1));
  const v2Summary = summarize(rows.map((row) => row.v2));
  const generatedAt = Date.now();
  const report = buildMarkdown({
    index,
    cases,
    rows,
    noSkillWeaverSummary,
    v1Summary,
    v2Summary,
    generatedAt
  });

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, report);

  const output = {
    generatedAt,
    corpus: {
      skills: index.skills.length,
      skillEdges: index.edges.length,
      concepts: index.concepts?.length ?? 0,
      conceptEdges: index.conceptEdges?.length ?? 0,
      roots: index.roots.length
    },
    noSkillWeaver: noSkillWeaverSummary,
    skillweaverV1: v1Summary,
    skillweaverV2: v2Summary,
    gains: {
      v2VsNoSkillWeaver: {
        primaryHitAt1PercentagePoints: (v2Summary.primaryHitAt1 - noSkillWeaverSummary.primaryHitAt1) * 100,
        hitAt5PercentagePoints: (v2Summary.hitAt5 - noSkillWeaverSummary.hitAt5) * 100,
        mrr: v2Summary.mrr - noSkillWeaverSummary.mrr,
        supportCoveragePercentagePoints: (v2Summary.supportCoverage - noSkillWeaverSummary.supportCoverage) * 100,
        outputQualityScore: v2Summary.outputQualityScore - noSkillWeaverSummary.outputQualityScore,
        meanExpectedRankDeltaLowerIsBetter: v2Summary.meanCandidatesToExpected - noSkillWeaverSummary.meanCandidatesToExpected
      },
      v2VsSkillWeaverV1: {
        primaryHitAt1PercentagePoints: (v2Summary.primaryHitAt1 - v1Summary.primaryHitAt1) * 100,
        hitAt5PercentagePoints: (v2Summary.hitAt5 - v1Summary.hitAt5) * 100,
        mrr: v2Summary.mrr - v1Summary.mrr,
        supportCoveragePercentagePoints: (v2Summary.supportCoverage - v1Summary.supportCoverage) * 100,
        outputQualityScore: v2Summary.outputQualityScore - v1Summary.outputQualityScore,
        meanExpectedRankDeltaLowerIsBetter: v2Summary.meanCandidatesToExpected - v1Summary.meanCandidatesToExpected
      }
    },
    reportPath: REPORT_PATH
  };

  console.log(JSON.stringify(output, null, 2));
}

await main();
