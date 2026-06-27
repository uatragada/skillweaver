import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  rankConceptWorkflowSkills,
  rankSkill,
  recommendWorkflow,
  scanSkillRoots
} from "../server/skill-scanner.js";

const PRE_CONCEPT_COMMIT = "80d31f1";
const CHECK_MODE = process.argv.includes("--check");
const HOLDOUT_MODE = process.argv.includes("--holdout");
const SUITE = HOLDOUT_MODE
  ? {
      id: "holdout",
      label: "Post-Tuning Challenge",
      reportTitle: "Post-Tuning Challenge Benchmark",
      casesPath: resolve("benchmarks/skill-routing-holdout.json"),
      casesRelativePath: "benchmarks/skill-routing-holdout.json",
      reportPath: resolve("docs/SKILL-USE-HOLDOUT.md"),
      command: CHECK_MODE ? "npm run benchmark:skills:holdout:check" : "npm run benchmark:skills:holdout",
      gatesAcceptance: false
    }
  : {
      id: "acceptance",
      label: "Active Acceptance",
      reportTitle: "Active Acceptance Benchmark",
      casesPath: resolve("benchmarks/skill-routing-cases.json"),
      casesRelativePath: "benchmarks/skill-routing-cases.json",
      reportPath: resolve("docs/SKILL-USE-GAINS.md"),
      command: CHECK_MODE ? "npm run benchmark:skills:check" : "npm run benchmark:skills",
      gatesAcceptance: true
    };
const CASES_PATH = SUITE.casesPath;
const REPORT_PATH = SUITE.reportPath;
const INVALIDATING_PATHS = [
  SUITE.casesRelativePath,
  "package.json",
  "server/skill-scanner.js",
  "scripts/benchmark-skill-routing.mjs"
];

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

const DOMAIN_LABELS = new Map([
  ["ai-agent-apps", "AI agent apps"],
  ["backend-services", "Backend services"],
  ["communications-knowledge", "Communications and knowledge"],
  ["data-analytics", "Data analytics"],
  ["database-data-engineering", "Database and data engineering"],
  ["documents-publishing", "Documents and publishing"],
  ["frontend-experience", "Frontend experience"],
  ["games-simulation", "Games and simulation"],
  ["huggingface-ml", "Hugging Face ML"],
  ["infrastructure-platforms", "Infrastructure platforms"],
  ["marketing-growth-creative", "Marketing, growth, and creative"],
  ["observability-reliability", "Observability and reliability"],
  ["platform-delivery", "Platform delivery"],
  ["product-research-planning", "Product, research, and planning"],
  ["repo-collaboration", "Repo collaboration"],
  ["security-risk", "Security and risk"],
  ["skill-tooling", "Skill tooling"]
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

async function hashFile(path) {
  return sha256(await readFile(path, "utf8"));
}

function getGitInfo() {
  try {
    const commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const dirtyPaths = execFileSync("git", ["status", "--short"], { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.slice(3).trim())
      .sort();
    return { commit, dirty: dirtyPaths.length > 0, dirtyPaths };
  } catch {
    return { commit: null, dirty: null, dirtyPaths: [] };
  }
}

function corpusFingerprint(index) {
  const corpus = index.skills.map((skill) => ({
    name: skill.name,
    path: skill.path,
    sourceType: skill.sourceType,
    contentHash: skill.contentHash
  })).sort((left, right) => left.path.localeCompare(right.path));
  return sha256(stableJson(corpus));
}

async function buildFreshness({ index, cases, rows, summaries, generatedAt }) {
  const git = getGitInfo();
  const inputHashes = {
    cases: await hashFile(CASES_PATH),
    scanner: await hashFile(resolve("server/skill-scanner.js")),
    benchmarkScript: await hashFile(resolve("scripts/benchmark-skill-routing.mjs")),
    corpus: corpusFingerprint(index)
  };
  const invalidatingDirtyPaths = git.dirtyPaths.filter((path) =>
    INVALIDATING_PATHS.includes(path.replace(/\\/g, "/"))
  );
  const qualityGate = evaluateAcceptance(summaries);
  const acceptance = SUITE.gatesAcceptance
    ? qualityGate
    : {
        ok: true,
        nongating: true,
        qualityGate
      };
  const snapshot = {
    generatedAt,
    command: SUITE.command,
    suite: {
      id: SUITE.id,
      label: SUITE.label,
      gatesAcceptance: SUITE.gatesAcceptance
    },
    git,
    invalidatingDirtyPaths,
    cases: {
      count: cases.length,
      sha256: inputHashes.cases
    },
    corpus: {
      skills: index.skills.length,
      skillEdges: index.edges.length,
      concepts: index.concepts?.length ?? 0,
      conceptEdges: index.conceptEdges?.length ?? 0,
      roots: index.roots.length,
      sha256: inputHashes.corpus
    },
    inputs: inputHashes,
    acceptance
  };
  snapshot.snapshotFingerprint = sha256(stableJson({
    suite: snapshot.suite,
    cases: snapshot.cases,
    corpus: snapshot.corpus,
    inputs: snapshot.inputs,
    acceptance: snapshot.acceptance,
    summaries
  }));
  return snapshot;
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

function supportPrecision(names, expectedSupport) {
  if (!expectedSupport?.length) return 1;
  const hitCount = expectedSupport.filter((expected) => names.some((name) => matchesExpected(name, [expected]))).length;
  return hitCount / Math.max(1, names.length - 1);
}

function missingSupport(names, expectedSupport) {
  return (expectedSupport ?? []).filter((expected) => !names.some((name) => matchesExpected(name, [expected])));
}

function validateCases(cases, index) {
  const issues = [];
  const ids = new Set();
  const skillNames = index.skills.map((skill) => skill.name);
  const conceptIds = new Set((index.concepts ?? []).map((concept) => concept.id));
  for (const testCase of cases) {
    if (!testCase.id) issues.push("case missing id");
    if (ids.has(testCase.id)) issues.push(`duplicate case id: ${testCase.id}`);
    ids.add(testCase.id);
    if (!testCase.query) issues.push(`${testCase.id}: missing query`);
    if (!testCase.domain) {
      issues.push(`${testCase.id}: missing domain`);
    } else if (!DOMAIN_LABELS.has(testCase.domain)) {
      issues.push(`${testCase.id}: unknown domain: ${testCase.domain}`);
    }
    if (!testCase.concept) {
      issues.push(`${testCase.id}: missing concept`);
    } else if (!conceptIds.has(testCase.concept)) {
      issues.push(`${testCase.id}: unknown concept: ${testCase.concept}`);
    }
    if (!Array.isArray(testCase.expectedPrimary) || !testCase.expectedPrimary.length) {
      issues.push(`${testCase.id}: expectedPrimary must be a non-empty array`);
    }

    for (const field of ["expectedPrimary", "expectedSupport", "mustNotPrimary"]) {
      for (const expected of testCase[field] ?? []) {
        if (!skillNames.some((name) => matchesExpected(name, [expected]))) {
          issues.push(`${testCase.id}: ${field} fragment does not match an indexed skill: ${expected}`);
        }
      }
    }
  }
  return {
    ok: issues.length === 0,
    issues
  };
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
  const precision = supportPrecision(visibleNames, testCase.expectedSupport ?? []);
  const supportMisses = missingSupport(visibleNames, testCase.expectedSupport ?? []);
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
    supportMisses,
    reciprocalRank: rr,
    supportCoverage: coverage,
    supportPrecision: precision,
    supportExpectedCount: testCase.expectedSupport?.length ?? 0,
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
  const supportEvaluations = evaluations.filter((entry) => entry.supportExpectedCount > 0);
  const supportTotal = supportEvaluations.length || 1;
  const ranks = evaluations.map((entry) => entry.rank ?? Infinity).filter(Number.isFinite).sort((left, right) => left - right);
  const reviewed = evaluations.map((entry) => entry.candidatesReviewedToExpected).sort((left, right) => left - right);
  return {
    cases: evaluations.length,
    primaryHitAt1: evaluations.filter((entry) => entry.primaryHit).length / total,
    hitAt5: evaluations.filter((entry) => entry.hitAt5).length / total,
    mrr: evaluations.reduce((sum, entry) => sum + entry.reciprocalRank, 0) / total,
    supportCoverage: evaluations.reduce((sum, entry) => sum + entry.supportCoverage, 0) / total,
    supportPrecisionAt5: supportEvaluations.reduce((sum, entry) => sum + entry.supportPrecision, 0) / supportTotal,
    forbiddenPrimaryRate: evaluations.filter((entry) => entry.forbiddenPrimary).length / total,
    outputQualityScore: evaluations.reduce((sum, entry) => sum + entry.qualityScore, 0) / total,
    meanCandidatesToExpected: evaluations.reduce((sum, entry) => sum + entry.candidatesReviewedToExpected, 0) / total,
    medianCandidatesToExpected: reviewed[Math.floor(reviewed.length / 2)] ?? null,
    medianExpectedRank: ranks[Math.floor(ranks.length / 2)] ?? null
  };
}

function summarizeRows(rows) {
  const noSkillWeaverSummary = summarize(rows.map((row) => row.noSkillWeaver));
  const v1Summary = summarize(rows.map((row) => row.v1));
  const v2Summary = summarize(rows.map((row) => row.v2));
  return {
    noSkillWeaverSummary,
    v1Summary,
    v2Summary,
    v2PrimaryHits: rows.filter((row) => row.v2.primaryHit).length,
    v2TopHits: rows.filter((row) => row.v2.hitAt5).length,
    v2ForbiddenPrimaries: rows.filter((row) => row.v2.forbiddenPrimary).length,
    v2SupportMissCases: rows.filter((row) => row.v2.supportMisses.length).length
  };
}

function summarizeByField(rows, field, labelForKey) {
  const groups = new Map();
  for (const row of rows) {
    const key = row[field] ?? "unclassified";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  return [...groups.entries()]
    .map(([key, groupRows]) => {
      const group = summarizeRows(groupRows);
      return {
        key,
        label: labelForKey(key),
        cases: groupRows.length,
        ...group,
        outputQualityGainVsNo: group.v2Summary.outputQualityScore - group.noSkillWeaverSummary.outputQualityScore,
        outputQualityGainVsV1: group.v2Summary.outputQualityScore - group.v1Summary.outputQualityScore
      };
    })
    .sort((left, right) => right.cases - left.cases || left.label.localeCompare(right.label));
}

function compactSliceSummaries(summaries) {
  return summaries.map((summary) => ({
    key: summary.key,
    label: summary.label,
    cases: summary.cases,
    v2OutputQualityScore: summary.v2Summary.outputQualityScore,
    v2PrimaryHitAt1: summary.v2Summary.primaryHitAt1,
    v2HitAt5: summary.v2Summary.hitAt5,
    v2SupportCoverage: summary.v2Summary.supportCoverage,
    v2SupportPrecisionAt5: summary.v2Summary.supportPrecisionAt5,
    v2ForbiddenPrimaryRate: summary.v2Summary.forbiddenPrimaryRate,
    v2SupportMissCases: summary.v2SupportMissCases,
    v2GainVsNoSkillWeaver: summary.outputQualityGainVsNo,
    v2GainVsSkillLevel: summary.outputQualityGainVsV1
  }));
}

function evaluateAcceptance({ noSkillWeaverSummary, v1Summary, v2Summary }) {
  const failures = [];
  if (v2Summary.outputQualityScore <= noSkillWeaverSummary.outputQualityScore) {
    failures.push("V2 output quality must beat no SkillWeaver.");
  }
  if (v2Summary.outputQualityScore <= v1Summary.outputQualityScore) {
    failures.push("V2 output quality must beat the skill-level baseline.");
  }
  if (v2Summary.hitAt5 < noSkillWeaverSummary.hitAt5 || v2Summary.hitAt5 < v1Summary.hitAt5) {
    failures.push("V2 expected top/workflow-5 retrieval must not regress.");
  }
  if (v2Summary.primaryHitAt1 < noSkillWeaverSummary.primaryHitAt1 && v2Summary.supportCoverage <= noSkillWeaverSummary.supportCoverage) {
    failures.push("V2 primary hit@1 must not drop unless support coverage materially improves.");
  }
  if (v2Summary.forbiddenPrimaryRate > 0) {
    failures.push("V2 forbidden primary rate must stay at 0.");
  }
  if (v2Summary.meanCandidatesToExpected > 1.25) {
    failures.push("V2 mean candidates to expected skill should stay near 1.");
  }
  return {
    ok: failures.length === 0,
    failures
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

function extractReportMetadata(report) {
  const match = /<!-- skillweaver-benchmark-metadata\s*\n([\s\S]*?)\nskillweaver-benchmark-metadata -->/.exec(report);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
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
      metric: "Support precision@5, exploratory",
      no: formatPercent(noSkillWeaverSummary.supportPrecisionAt5),
      v1: formatPercent(v1Summary.supportPrecisionAt5),
      v2: formatPercent(v2Summary.supportPrecisionAt5),
      v2VsNo: formatDelta((v2Summary.supportPrecisionAt5 - noSkillWeaverSummary.supportPrecisionAt5) * 100, " pp"),
      v2VsV1: formatDelta((v2Summary.supportPrecisionAt5 - v1Summary.supportPrecisionAt5) * 100, " pp")
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

function buildSliceTable(title, summaries) {
  const lines = [
    `## ${title}`,
    "",
    "| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
  ];

  for (const summary of summaries) {
    lines.push(
      `| ${summary.label} | ${summary.cases} | ${summary.v2Summary.outputQualityScore.toFixed(1)} | ${formatPercent(summary.v2Summary.primaryHitAt1)} | ${formatPercent(summary.v2Summary.hitAt5)} | ${formatPercent(summary.v2Summary.supportCoverage)} | ${formatPercent(summary.v2Summary.supportPrecisionAt5)} | ${formatPercent(summary.v2Summary.forbiddenPrimaryRate)} | ${summary.v2SupportMissCases}/${summary.cases} | ${formatDelta(summary.outputQualityGainVsNo, " pts")} | ${formatDelta(summary.outputQualityGainVsV1, " pts")} |`
    );
  }

  return lines;
}

function buildClaimScope({ cases, v2PrimaryHits, v2TopHits, v2Forbidden, v2SupportMissCases, v2Summary }) {
  if (SUITE.gatesAcceptance) {
    return [
      "## Claim Scope",
      "",
      `This report supports the claim that V2 is stronger on the current ${cases.length}-case active acceptance suite: ${v2PrimaryHits}/${cases.length} primary hit@1, ${v2TopHits}/${cases.length} expected primary in top/workflow five, ${v2Forbidden}/${cases.length} forbidden primaries, and ${v2SupportMissCases}/${cases.length} support-miss cases. It does not prove universal routing correctness or unseen cross-domain generalization.`
    ];
  }

  return [
    "## Claim Scope",
    "",
    `This report supports the claim that V2 remains strong on a ${cases.length}-case post-tuning challenge suite: ${v2PrimaryHits}/${cases.length} primary hit@1, ${v2TopHits}/${cases.length} expected primary in top/workflow five, and ${v2Forbidden}/${cases.length} forbidden primaries. Workflow support quality is weaker than primary routing: support coverage@5 is ${formatPercent(v2Summary.supportCoverage)}, support precision@5 is ${formatPercent(v2Summary.supportPrecisionAt5)}, and ${v2SupportMissCases}/${cases.length} cases miss at least one expected support skill.`
  ];
}

function buildMarkdown({
  index,
  cases,
  rows,
  noSkillWeaverSummary,
  v1Summary,
  v2Summary,
  domainSummaries,
  conceptSummaries,
  generatedAt,
  freshness
}) {
  const summaryRows = buildSummaryRows({ noSkillWeaverSummary, v1Summary, v2Summary });
  const candidateReduction = 1 - (5 / index.skills.length);
  const qualityVsNo = v2Summary.outputQualityScore - noSkillWeaverSummary.outputQualityScore;
  const qualityVsV1 = v2Summary.outputQualityScore - v1Summary.outputQualityScore;
  const strongClaimPrefix = SUITE.gatesAcceptance
    ? freshness.acceptance.ok ? "SkillWeaver V2 changes" : "SkillWeaver V2 currently reports"
    : "On the post-tuning challenge suite, SkillWeaver V2 changes";

  const lines = [
    `# SkillWeaver V2 ${SUITE.reportTitle}`,
    "",
    `Generated: ${new Date(generatedAt).toISOString()}`,
    "",
    "<!-- skillweaver-benchmark-metadata",
    JSON.stringify(freshness),
    "skillweaver-benchmark-metadata -->",
    "",
    "## Freshness",
    "",
    `- Command: \`${freshness.command}\``,
    `- Suite: ${freshness.suite.label}`,
    `- Acceptance gate: ${freshness.suite.gatesAcceptance ? "yes" : "no"}`,
    `- Git commit at generation: \`${freshness.git.commit ?? "unknown"}\``,
    `- Git dirty: ${freshness.git.dirty ? "yes" : "no"}`,
    `- Invalidating dirty paths: ${freshness.invalidatingDirtyPaths.length ? freshness.invalidatingDirtyPaths.map((path) => `\`${path}\``).join(", ") : "none"}`,
    `- Case hash: \`${freshness.cases.sha256}\``,
    `- Scanner hash: \`${freshness.inputs.scanner}\``,
    `- Benchmark script hash: \`${freshness.inputs.benchmarkScript}\``,
    `- Corpus hash: \`${freshness.corpus.sha256}\``,
    `- Snapshot fingerprint: \`${freshness.snapshotFingerprint}\``,
    ...(SUITE.gatesAcceptance
      ? [`- Acceptance: ${freshness.acceptance.ok ? "pass" : `fail: ${freshness.acceptance.failures.join("; ")}`}`]
      : [
          "- Freshness check: pass",
          `- Quality gate, reported only: ${freshness.acceptance.qualityGate.ok ? "pass" : `fail: ${freshness.acceptance.qualityGate.failures.join("; ")}`}`
        ]),
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
    ...(SUITE.gatesAcceptance
      ? []
      : [
          "## Suite Role",
          "",
          "This is not pristine untouched holdout evidence for the current V2 route. The first 22-case pilot exposed gaps, then those misses informed the current fixes. Treat this report as frozen challenge/regression evidence. A clean cross-domain generalization claim requires a fresh prompt set collected after the last routing-tuning commit and reported before any tuning from those prompts.",
          ""
        ]),
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

  const v2PrimaryHits = rows.filter((row) => row.v2.primaryHit).length;
  const v2TopHits = rows.filter((row) => row.v2.hitAt5).length;
  const v2Forbidden = rows.filter((row) => row.v2.forbiddenPrimary).length;
  const v2SupportMissCases = rows.filter((row) => row.v2.supportMisses.length).length;

  lines.push(
    "",
    ...buildClaimScope({
      cases,
      v2PrimaryHits,
      v2TopHits,
      v2Forbidden,
      v2SupportMissCases,
      v2Summary
    }),
    "",
    `V2 raw counts: primary hit@1 ${v2PrimaryHits}/${cases.length}; expected primary top/workflow-five ${v2TopHits}/${cases.length}; forbidden primary ${v2Forbidden}/${cases.length}; support-miss cases ${v2SupportMissCases}/${cases.length}.`,
    "",
    `Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from ${index.skills.length} skills to 5 candidates, a ${(candidateReduction * 100).toFixed(1)}% candidate reduction per task.`,
    "Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.",
    ...(SUITE.gatesAcceptance
      ? []
      : ["Challenge quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and challenge cases."]),
    "",
    ...buildSliceTable("Quality by Domain", domainSummaries),
    "",
    ...buildSliceTable("Quality by Expected Concept", conceptSummaries),
    "",
    "## Per-Case Results",
    "",
    "| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const row of rows) {
    lines.push(
      `| ${row.id} | ${row.domainLabel} | ${row.conceptLabel} | ${row.expectedPrimary.join(", ")} | ${formatPrimaryCell(row.noSkillWeaver)} | ${formatPrimaryCell(row.v1)} | ${formatPrimaryCell(row.v2)} | ${row.v2.contextLabel ?? "-"} | ${row.v2.topNames.join(" -> ")} |`
    );
  }

  const supportMissRows = rows.filter((row) => row.v2.supportMisses.length);
  lines.push(
    "",
    "## V2 Support Misses",
    "",
    supportMissRows.length
      ? SUITE.gatesAcceptance
        ? "These rows have a correct expected primary somewhere in V2's workflow, but not every expected support skill appears in the top/workflow five."
        : "This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise."
      : "No expected support misses in the current V2 workflow.",
    ""
  );

  if (supportMissRows.length) {
    lines.push(
      "| Case | Missing expected support | V2 top/workflow 5 |",
      "| --- | --- | --- |"
    );
    for (const row of supportMissRows) {
      lines.push(`| ${row.id} | ${row.v2.supportMisses.join(", ")} | ${row.v2.topNames.join(" -> ")} |`);
    }
  }

  lines.push(
    "",
    "## Interpretation",
    "",
    `${strongClaimPrefix} the composite output-quality score by ${formatDelta(qualityVsNo, " points")} versus no SkillWeaver and ${formatDelta(qualityVsV1, " points")} versus the skill-level baseline.`,
    `V2 changes primary selection by ${formatDelta((v2Summary.primaryHitAt1 - noSkillWeaverSummary.primaryHitAt1) * 100, " percentage points")} versus no SkillWeaver and ${formatDelta((v2Summary.primaryHitAt1 - v1Summary.primaryHitAt1) * 100, " percentage points")} versus the skill-level baseline.`,
    `V2 changes expected-skill top/workflow-5 retrieval by ${formatDelta((v2Summary.hitAt5 - noSkillWeaverSummary.hitAt5) * 100, " percentage points")} versus no SkillWeaver and ${formatDelta((v2Summary.hitAt5 - v1Summary.hitAt5) * 100, " percentage points")} versus the skill-level baseline.`,
    "The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus."
  );

  return `${lines.join("\n")}\n`;
}

async function main() {
  const cases = JSON.parse(await readFile(CASES_PATH, "utf8"));
  const index = await scanSkillRoots();
  const conceptLabels = new Map((index.concepts ?? []).map((concept) => [concept.id, concept.label]));
  const caseValidation = validateCases(cases, index);
  if (!caseValidation.ok) {
    console.error(`Benchmark case validation failed:\n${caseValidation.issues.map((issue) => `- ${issue}`).join("\n")}`);
    process.exit(1);
  }
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
      domain: testCase.domain,
      domainLabel: DOMAIN_LABELS.get(testCase.domain) ?? testCase.domain,
      concept: testCase.concept,
      conceptLabel: conceptLabels.get(testCase.concept) ?? testCase.concept,
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

  const aggregate = summarizeRows(rows);
  const { noSkillWeaverSummary, v1Summary, v2Summary } = aggregate;
  const domainSummaries = summarizeByField(rows, "domain", (domain) => DOMAIN_LABELS.get(domain) ?? domain);
  const conceptSummaries = summarizeByField(rows, "concept", (concept) => conceptLabels.get(concept) ?? concept);
  const compactDomainSummaries = compactSliceSummaries(domainSummaries);
  const compactConceptSummaries = compactSliceSummaries(conceptSummaries);
  const generatedAt = Date.now();
  const summaries = {
    noSkillWeaverSummary,
    v1Summary,
    v2Summary,
    domainSummaries: compactDomainSummaries,
    conceptSummaries: compactConceptSummaries
  };
  const freshness = await buildFreshness({
    index,
    cases,
    rows,
    summaries,
    generatedAt
  });
  const report = buildMarkdown({
    index,
    cases,
    rows,
    noSkillWeaverSummary,
    v1Summary,
    v2Summary,
    domainSummaries,
    conceptSummaries,
    generatedAt,
    freshness
  });

  let reportFresh = null;
  const mismatches = [];
  if (CHECK_MODE) {
    let currentReport = "";
    try {
      currentReport = await readFile(REPORT_PATH, "utf8");
    } catch {
      console.error(`Benchmark report is missing: ${REPORT_PATH}`);
      process.exitCode = 1;
    }

    if (!process.exitCode) {
      const metadata = extractReportMetadata(currentReport);
      if (!metadata) {
        mismatches.push("missing_metadata");
      } else {
        if (metadata.snapshotFingerprint !== freshness.snapshotFingerprint) mismatches.push("snapshot_fingerprint");
        if (metadata.acceptance?.ok !== true) mismatches.push("acceptance");
      }
      if (freshness.invalidatingDirtyPaths.length) mismatches.push("dirty_inputs");
      reportFresh = mismatches.length === 0;
      if (!reportFresh) {
        console.error(`Benchmark report is stale (${mismatches.join(", ")}). Run \`${SUITE.command.replace(":check", "")}\` to regenerate ${SUITE.reportPath}.`);
        process.exitCode = 1;
      }
    }
  } else {
    await mkdir(dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, report);
  }

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
    domains: compactDomainSummaries,
    concepts: compactConceptSummaries,
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
    reportPath: REPORT_PATH,
    suite: freshness.suite,
    checkMode: CHECK_MODE,
    status: CHECK_MODE ? reportFresh ? "fresh" : "stale" : "written",
    ok: CHECK_MODE ? Boolean(reportFresh) : freshness.acceptance.ok,
    reportFresh,
    snapshotFingerprint: freshness.snapshotFingerprint,
    inputsFingerprint: sha256(stableJson(freshness.inputs)),
    freshness,
    mismatches
  };

  console.log(JSON.stringify(output, null, 2));
}

await main();
