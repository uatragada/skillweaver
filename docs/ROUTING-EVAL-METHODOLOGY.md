# Routing Evaluation Methodology

This document defines how SkillWeaver routing quality is measured. It exists so future routing changes improve real skill-loading behavior instead of only feeling plausible.

## Systems Compared

- `no-skillweaver`: flat metadata search over skill name, description, namespace, domain tags, and tool hints. It does not use body text, trigger phrases, relationship edges, workflows, or concepts.
- `skill-level-baseline`: current skill-level SkillWeaver ranking plus workflow recommendations. It uses triggers, body/resource signals, dedupe, gateway boosts, and skill-to-skill relationships, but excludes concept nodes.
- `skillweaver-v2-concepts`: current product routing. It anchors on skill-level ranking, scores matching concept nodes, reranks role-tagged skill references within those concepts, then appends skill-level fallback results.

The last pre-concept commit was `80d31f1`; the benchmark does not execute code from that historical commit. It compares the current skill-level path against the current V2 concept-aided path.

## Evaluation Splits

SkillWeaver reports two routing suites:

- Active acceptance suite: `benchmarks/skill-routing-cases.json`, generated into `docs/SKILL-USE-GAINS.md`. This is the regression gate for V2 routing claims.
- Holdout/challenge suite: `benchmarks/skill-routing-holdout.json`, generated into `docs/SKILL-USE-HOLDOUT.md`. This reports generalization pressure and is not an acceptance gate.

The current holdout/challenge suite started as a frozen pilot, then its misses were used to improve broad routing anchors and specialist concept membership. From this commit forward it is a fixed challenge suite, not pristine untouched holdout evidence. A future clean holdout claim should use new real task prompts collected after the last routing-tuning commit.

## Case Schema

Cases live in `benchmarks/skill-routing-cases.json` and `benchmarks/skill-routing-holdout.json`.

- `id`: stable case identifier.
- `query`: task wording to route.
- `expectedPrimary`: acceptable primary skill names or name fragments.
- `expectedSupport`: supporting skills expected within the top/workflow five.
- `mustNotPrimary`: optional forbidden primary skill names or fragments for negative guard cases.

Expected names are matched by normalized name containment. This makes plugin-prefix variants measurable, but broad expected names should be avoided because they can hide false positives.

The benchmark validates every case before measuring quality. Duplicate case ids, missing required fields, and expected skill fragments that do not match the live indexed corpus fail the run before a report can be written.

## Benchmark Case Governance

Add a benchmark case only when it protects a real recurring task, a known failure, or a concrete corpus gap. Expected primary and support skills should be justified by actual indexed skill names, descriptions, trigger text, or prior task evidence.

Case rules:

- Keep `expectedPrimary` narrow; avoid broad fragments such as `pdf` unless prefix variants require containment matching.
- Keep `expectedSupport` to skills that materially improve the workflow. Leave it empty for primary-only negative guards.
- Use `mustNotPrimary` when the case protects against keyword overreach, such as dashboard UI being mistaken for data analytics.
- Name at least one confusable rival in the failure atlas when a case is regression-driven.
- Add or update the atlas entry before tuning concept rules for the case.

## Score

The composite output quality score is 0-100:

- 40% primary hit at rank 1.
- 20% expected primary appears in top/workflow 5.
- 20% mean reciprocal rank of the expected primary.
- 20% support-skill coverage in top/workflow 5.

Support coverage currently rewards expected support hits but does not penalize irrelevant extras. Use the per-case table in `docs/SKILL-USE-GAINS.md` before calling a support gain meaningful.

Support precision@5 is tracked as an exploratory metric outside the composite score. It measures how much of the non-primary top/workflow-five list is made of expected support skills, averaged only across cases with expected support. This is a stricter noise check than support coverage, but it is not yet an acceptance gate because many valid helper skills are intentionally omitted from small expected-support lists.

Forbidden primary rate is tracked separately as a lower-is-better guardrail. It is not part of the composite score, but any V2 violation should block a routing-quality claim until fixed or explicitly retired.

## Acceptance Bar

For V2 to count as a real improvement on the active acceptance suite:

- Output quality must improve over both baselines.
- Primary hit@1 must improve or stay flat while support coverage materially improves.
- Expected top/workflow-5 retrieval must not regress.
- Forbidden primary rate should stay at 0 for V2.
- Mean candidates to expected skill should stay near 1.
- The route must be product-real: `/api/workflow` should use the same V2 helper as the benchmark.
- Any benchmark case validation issue should fail the run before quality metrics are trusted.

The holdout/challenge suite is reported with the same metrics, freshness metadata, and case validation, but it does not gate acceptance. Holdout misses should become a backlog until they recur in real task logs or are explicitly promoted into the active suite.

## Report Freshness Contract

A benchmark claim is fresh only when it records:

- Command run.
- Generated timestamp.
- Git commit or dirty/clean status.
- Benchmark case count.
- Corpus counts.
- Paths whose changes invalidate the report: the suite case file, `package.json`, `server/skill-scanner.js`, `scripts/benchmark-skill-routing.mjs`, and any indexed skill root.

Run `npm run benchmark:skills:check` before relying on the checked-in report. The check recomputes the current benchmark snapshot without rewriting docs and fails when:

- Embedded report metadata is missing.
- The report snapshot fingerprint does not match current case, scanner, benchmark-script, corpus, and acceptance inputs.
- The report records a failed acceptance result.
- Benchmark-invalidating files are dirty at check time.

Do not update current-snapshot metrics by hand without regenerating `docs/SKILL-USE-GAINS.md`, or label the numbers as historical.

## Current Snapshot

Generated by `npm run benchmark:skills` on June 27, 2026:

- Cases: 78.
- Skills: 442.
- Concept nodes: 22.
- Concept edges: 200.
- V2 output quality: 100.0.
- V2 gain over no SkillWeaver: +24.7 points.
- V2 gain over skill-level baseline: +22.8 points.
- V2 primary hit@1: 100.0%.
- V2 support coverage@5: 100.0%.
- V2 support precision@5: 40.9%.
- V2 support precision gain over no SkillWeaver: +22.3 percentage points.
- V2 support precision gain over skill-level baseline: +19.8 percentage points.
- V2 forbidden primary rate: 0.0%.

Generated by `npm run benchmark:skills:holdout` on June 27, 2026:

- Cases: 22.
- V2 output quality: 92.7.
- V2 gain over no SkillWeaver: +22.6 points.
- V2 gain over skill-level baseline: +15.7 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 63.6%.
- V2 support precision@5: 31.8%.
- V2 forbidden primary rate: 0.0%.

These snapshots are strong evidence for the active and challenge suites, not proof of universal routing correctness.
