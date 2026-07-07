# Routing Evaluation Methodology

This document defines how SkillWeaver routing quality is measured. It exists so future routing changes improve real skill-loading behavior instead of only feeling plausible.

## Systems Compared

- `no-skillweaver`: flat metadata search over skill name, description, namespace, domain tags, and tool hints. It does not use body text, trigger phrases, relationship edges, workflows, or concepts.
- `skill-level-baseline`: current skill-level SkillWeaver ranking plus workflow recommendations. It uses triggers, body/resource signals, dedupe, gateway boosts, and skill-to-skill relationships, but excludes concept nodes.
- `skillweaver-v2-concepts`: current product routing. It anchors on skill-level ranking, scores matching concept nodes, reranks role-tagged skill references within those concepts, then appends skill-level fallback results.

The last pre-concept commit was `80d31f1`; the benchmark does not execute code from that historical commit. It compares the current skill-level path against the current V2 concept-aided path.

## Permitted Claims

Safe: "V2 improves deterministic skill routing on the active acceptance suite and remains strong on the post-tuning challenge, fresh-probe regression, frozen-holdout regression, clean-holdout V2 regression, clean-holdout V3 regression, clean-holdout V4 regression, and clean-holdout V5 regression suites."

Safe: "V2 has 0.0% forbidden primary rate across the current active, challenge, fresh-probe regression, frozen holdout regression, clean V2 regression, clean V3 regression, clean V4 regression, and clean V5 regression suites, while improving output quality versus both compared baselines."

Safe: "On the clean V4 regression suite, V2 now reaches 100.0% primary hit@1 and 0.0% forbidden primaries, after the pre-tuning clean V4 baseline was preserved at `77d4c73`."

Safe: "On the clean V5 regression suite, V2 now reaches 100.0% primary hit@1 and 0.0% forbidden primaries, after the pre-tuning clean V5 baseline was preserved at `38e4c6d`."

Not safe with the current evidence: "V2 generalizes across all domains", "V2 has 100% routing accuracy", "cross-domain routing is solved", "the current clean V2 report is untouched holdout evidence", "the current clean V3 report is untouched holdout evidence", "the current clean V4 report is untouched holdout evidence", "the current clean V5 report is untouched holdout evidence", or "clean V5 proves V2 is solved."

Any cross-domain quality claim must include suite role, case count, domain/case coverage, primary hit@1, expected top/workflow-five retrieval, MRR, support coverage@5, support precision@5, forbidden primary rate, and support-miss count.

## Evaluation Splits

SkillWeaver reports eight routing suites:

- Active acceptance suite: `benchmarks/skill-routing-cases.json`, generated into `docs/SKILL-USE-GAINS.md`. This is the regression gate for V2 routing claims.
- Post-tuning challenge suite: `benchmarks/skill-routing-holdout.json`, generated into `docs/SKILL-USE-HOLDOUT.md`. This reports generalization pressure and is not an acceptance gate.
- Fresh-probe regression suite: `benchmarks/skill-routing-fresh.json`, generated into `docs/SKILL-USE-FRESH.md`. This began as an untouched prompt set collected after the previous routing-tuning commit; once misses from it informed fixes, it became non-gating regression evidence for that fresh-probe slice.
- Frozen holdout regression suite: `benchmarks/skill-routing-frozen-holdout.json`, generated into `docs/SKILL-USE-FROZEN-HOLDOUT.md`. This began as the clean-split frozen baseline; after misses from it informed routing changes, the current report is non-gating regression evidence for that frozen prompt set.
- Clean holdout V2 regression suite: `benchmarks/skill-routing-clean-holdout-v2.json`, generated into `docs/SKILL-USE-CLEAN-HOLDOUT-V2.md`. This began as the clean V2 baseline captured after commit `3cd6e51`; after misses from it informed routing fixes, the current report is non-gating regression evidence for that prompt set.
- Clean holdout V3 regression suite: `benchmarks/skill-routing-clean-holdout-v3.json`, generated into `docs/SKILL-USE-CLEAN-HOLDOUT-V3.md`. This began as the clean V3 baseline captured after commit `e2a47a6`; after misses from it informed routing fixes, the current report is non-gating regression evidence for that prompt set. The pre-tuning baseline is preserved at `00ad343`.
- Clean holdout V4 regression suite: `benchmarks/skill-routing-clean-holdout-v4.json`, generated into `docs/SKILL-USE-CLEAN-HOLDOUT-V4.md`. This began as the clean V4 baseline captured after commit `764924b`; after misses from it informed routing fixes, the current report is non-gating regression evidence for that prompt set. The pre-tuning baseline is preserved at `77d4c73`.
- Clean holdout V5 regression suite: `benchmarks/skill-routing-clean-holdout-v5.json`, generated into `docs/SKILL-USE-CLEAN-HOLDOUT-V5.md`. This began as the clean V5 baseline captured after commit `c090354`; after misses from it informed routing fixes, the current report is non-gating regression evidence for that prompt set. The pre-tuning baseline is preserved at `38e4c6d`.

The current challenge suite started as a frozen pilot, then its misses were used to improve broad routing anchors and specialist concept membership. From this commit forward it is a fixed post-tuning challenge suite, not pristine untouched holdout evidence. The clean holdout V2, V3, V4, and V5 suites are also no longer pristine because their misses drove later routing passes. A future clean-split claim requires another prompt set captured after the latest tuning commit and reported before tuning from those prompts.

Fresh-probe, frozen-holdout, and clean-holdout provenance are process claims, not something the benchmark metadata can prove by itself. The metadata proves report freshness against the current cases, scanner, benchmark script, corpus, and acceptance inputs. It does not prove that prompts were collected before tuning. Preserve the first pre-tuning result in the experiment log or git history before using fresh prompts to tune the router.

## Case Schema

Cases live in `benchmarks/skill-routing-cases.json`, `benchmarks/skill-routing-holdout.json`, `benchmarks/skill-routing-fresh.json`, `benchmarks/skill-routing-frozen-holdout.json`, `benchmarks/skill-routing-clean-holdout-v2.json`, `benchmarks/skill-routing-clean-holdout-v3.json`, `benchmarks/skill-routing-clean-holdout-v4.json`, and `benchmarks/skill-routing-clean-holdout-v5.json`.

- `id`: stable case identifier.
- `domain`: one benchmark-intent domain label. It is evaluation metadata, not a skill-derived domain.
- `concept`: one expected V2 concept id. It is the intended high-level work concept, not the observed output concept.
- `query`: task wording to route.
- `expectedPrimary`: acceptable primary skill names or name fragments.
- `expectedSupport`: supporting skills expected within the top/workflow five.
- `mustNotPrimary`: optional forbidden primary skill names or fragments for negative guard cases.

Clean holdout cases must record provenance fields before any tuning from those prompts:

- `source`: where the prompt came from, such as `real-task-log`, `subagent-audit`, or `manual-fresh-holdout`.
- `collectedAfterCommit`: the commit after which the prompt was captured.
- `frozenBeforeTuningCommit`: the first commit before any tuning from that prompt.
- `suiteState`: `untouched-holdout`, `post-tuning-challenge`, or `regression`.
- `promotionStatus`: `candidate`, `active`, `challenge`, `backlog`, or `retired`.
- `supportCriticality`: `primary-critical`, `support-critical`, `informational`, or `none`.

Expected names are matched by normalized name containment. This makes plugin-prefix variants measurable, but broad expected names should be avoided because they can hide false positives.

The benchmark validates every case before measuring quality. Duplicate case ids, missing required fields, unknown `domain` values, unknown `concept` ids, and expected skill fragments that do not match the live indexed corpus fail the run before a report can be written.

Current allowed domain labels:

- `ai-agent-apps`
- `backend-services`
- `communications-knowledge`
- `data-analytics`
- `database-data-engineering`
- `documents-publishing`
- `frontend-experience`
- `games-simulation`
- `huggingface-ml`
- `infrastructure-platforms`
- `marketing-growth-creative`
- `observability-reliability`
- `platform-delivery`
- `product-research-planning`
- `repo-collaboration`
- `security-risk`
- `skill-tooling`

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

Confusable wrong-primary rate is also tracked separately as a lower-is-better guardrail. It counts cases where the expected primary appears in the top/workflow-five set, but the selected primary is still wrong. This catches benchmark false positives where broad expected-name fragments or support-heavy workflows hide a bad first skill.

## Slice Reporting

Each generated report includes `Quality by Domain` and `Quality by Expected Concept` tables. These tables reuse the already-evaluated benchmark rows; they do not run extra scanner passes, extra route evaluations, or LLM calls.

The slice tables are meant to expose breadth and thin spots:

- Domains with only one or two cases are visible as thin coverage.
- Challenge slices with 100.0% primary hit@1 but weak support coverage remain visible as workflow-quality backlog.
- A cross-domain claim should cite the slice table, not only the aggregate score.
- Benchmark domains are stable evaluation labels; adding one should be rarer than adding a case to an existing domain.

## Support-Quality Backlog

Support misses are workflow-quality debt, not automatic routing failures. A support miss should enter the backlog when the missing helper would materially change what an agent loads, verifies, or hands off for the task.

Backlog entries should record: source suite, case id or real task prompt, expected primary, missing support, observed top/workflow five, affected domain/concept slice, confusable rivals, and whether the miss is primary-critical, support-critical, or informational.

Do not tune concept rules only to clear a support miss. First decide whether the expected support is load-bearing, whether the prompt comes from real usage or a frozen challenge case, and whether adding the helper would displace a more useful skill. Support precision@5 should be watched as a noise signal; support coverage gains are not meaningful if the workflow five becomes a bag of plausible but nonessential helpers.

## Acceptance Bar

For V2 to count as a real improvement on the active acceptance suite:

- Output quality must improve over both baselines.
- Primary hit@1 must improve or stay flat while support coverage materially improves.
- Expected top/workflow-5 retrieval must not regress.
- Forbidden primary rate should stay at 0 for V2.
- Confusable wrong-primary rate should stay at 0 for V2.
- Mean candidates to expected skill should stay near 1.
- The route must be product-real: `/api/workflow` should use the same V2 helper as the benchmark.
- Any benchmark case validation issue should fail the run before quality metrics are trusted.

The post-tuning challenge suite is reported with the same metrics, freshness metadata, and case validation, but it does not gate acceptance. Challenge misses become backlog evidence only. They may be promoted into the active suite when they recur in real task logs, represent a high-impact workflow miss, or protect a confusable rival that has already failed once.

Promotion requires: a failure-atlas entry, a frozen prompt before tuning, narrow `expectedPrimary`, load-bearing `expectedSupport`, a named confusable rival when applicable, and a documented reason why the case belongs in acceptance rather than challenge. A promoted case must not be used both as the tuning prompt and as proof of generalization for the same change.

A future untouched holdout claim also requires all cases in that suite to declare `suiteState: "untouched-holdout"` and matching `collectedAfterCommit` / `frozenBeforeTuningCommit` evidence. Once any miss from that file informs tuning, change the suite state to `post-tuning-challenge` or `regression` before citing it again.

## Report Freshness Contract

A benchmark claim is fresh only when it records:

- Command run.
- Generated timestamp.
- Git commit or dirty/clean status.
- Benchmark case count.
- Corpus counts.
- Paths whose changes invalidate the report: the suite case file, `package.json`, `server/skill-scanner.js`, `scripts/benchmark-skill-routing.mjs`, and any indexed skill root.

Run `npm run benchmark:skills:check` before relying on the checked-in report for
the same configured local corpus. The check recomputes the current benchmark
snapshot without rewriting docs and fails when:

- Embedded report metadata is missing.
- The report snapshot fingerprint does not match current case, scanner, benchmark-script, corpus, and acceptance inputs.
- The report records a failed acceptance result.
- Benchmark-invalidating files are dirty at check time.
- The configured skill roots no longer contain the skills referenced by the
  benchmark cases.

Do not update current-snapshot metrics by hand without regenerating `docs/SKILL-USE-GAINS.md`, or label the numbers as historical.

## Current Snapshot

Generated by `npm run benchmark:skills` on June 27, 2026:

- Cases: 78.
- Domains covered: 17.
- Expected concepts covered: 22.
- Skills: 442.
- Concept nodes: 22.
- Concept edges: 200.
- V2 output quality: 99.9.
- V2 gain over no SkillWeaver: +24.6 points.
- V2 gain over skill-level baseline: +22.7 points.
- V2 primary hit@1: 100.0%.
- V2 support coverage@5: 99.4%.
- V2 support precision@5: 40.5%.
- V2 support precision gain over no SkillWeaver: +22.0 percentage points.
- V2 support precision gain over skill-level baseline: +19.5 percentage points.
- V2 forbidden primary rate: 0.0%.

Generated by `npm run benchmark:skills:holdout` on June 27, 2026:

- Cases: 22.
- Domains covered: 11.
- Expected concepts covered: 11.
- V2 output quality: 91.8.
- V2 gain over no SkillWeaver: +21.7 points.
- V2 gain over skill-level baseline: +14.8 points.
- V2 primary hit@1: 95.5%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 70.5%.
- V2 support precision@5: 35.2%.
- V2 forbidden primary rate: 0.0%.

Initial fresh-probe result on June 27, 2026 before tuning from those prompts:

- Cases: 18.
- Domains covered: 15.
- Expected concepts covered: 15.
- V2 output quality: 76.9.
- V2 gain over no SkillWeaver: +6.7 points.
- V2 gain over skill-level baseline: +6.9 points.
- V2 primary hit@1: 66.7%.
- V2 expected primary top/workflow 5: 88.9%.
- V2 support coverage@5: 86.1%.
- V2 support precision@5: 48.6%.
- V2 forbidden primary rate: 0.0%.

After narrow tuning from the fresh-probe misses, the same suite becomes regression evidence:

- V2 output quality: 95.4.
- V2 gain over no SkillWeaver: +25.2 points.
- V2 gain over skill-level baseline: +21.0 points.
- V2 primary hit@1: 94.4%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 90.7%.
- V2 support precision@5: 51.4%.
- V2 forbidden primary rate: 0.0%.

Frozen holdout baseline generated by `npm run benchmark:skills:frozen` on June 27, 2026:

- Cases: 12.
- Domains covered: 11.
- Expected concepts covered: 12.
- Cases with provenance fields: 12/12.
- V2 output quality: 59.1.
- V2 gain over no SkillWeaver: -8.2 points.
- V2 gain over skill-level baseline: -7.4 points.
- V2 primary hit@1: 41.7%.
- V2 expected primary top/workflow 5: 83.3%.
- V2 support coverage@5: 66.7%.
- V2 support precision@5: 50.0%.
- V2 forbidden primary rate: 33.3%.
- V2 support-miss cases: 8/12.

The frozen holdout result is valuable because it contradicts a too-broad V2 claim. Do not tune from it and then continue calling it untouched holdout evidence.

After narrow tuning from the frozen-holdout misses, the same suite becomes regression evidence:

- V2 output quality: 95.3.
- V2 gain over no SkillWeaver: +24.6 points.
- V2 gain over skill-level baseline: +25.4 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 76.4%.
- V2 support precision@5: 56.3%.
- V2 forbidden primary rate: 0.0%.

Clean holdout V2 baseline generated by `npm run benchmark:skills:clean` on June 27, 2026 and preserved at `fb1b4cb`:

- Cases: 14.
- Domains covered: 10.
- Expected concepts covered: 11.
- Cases with provenance fields: 14/14.
- V2 output quality: 61.3.
- V2 gain over no SkillWeaver: -7.0 points.
- V2 gain over skill-level baseline: -17.7 points.
- V2 primary hit@1: 57.1%.
- V2 expected primary top/workflow 5: 78.6%.
- V2 support coverage@5: 45.2%.
- V2 support precision@5: 33.9%.
- V2 forbidden primary rate: 35.7%.
- V2 support-miss cases: 13/14.

After narrow tuning from the clean-holdout V2 misses, the same suite is regression evidence generated by `npm run benchmark:skills:clean-v2-regression`:

- V2 output quality: 92.9.
- V2 gain over no SkillWeaver: +24.6 points.
- V2 gain over skill-level baseline: +13.8 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 64.3%.
- V2 support precision@5: 48.2%.
- V2 forbidden primary rate: 0.0%.
- V2 support-miss cases: 13/14.

Clean holdout V3 baseline generated by `npm run benchmark:skills:clean-v3` on June 27, 2026 after commit `e2a47a6`:

- Cases: 18.
- Domains covered: 17.
- Expected concepts covered: 18.
- Cases with provenance fields: 18/18.
- V2 output quality: 64.9.
- V2 gain over no SkillWeaver: +14.5 points.
- V2 gain over skill-level baseline: +2.6 points.
- V2 primary hit@1: 55.6%.
- V2 expected primary top/workflow 5: 83.3%.
- V2 support coverage@5: 61.1%.
- V2 support precision@5: 45.8%.
- V2 forbidden primary rate: 11.1%.
- V2 support-miss cases: 13/18.

That baseline remains valuable because it was untouched evidence and because it contradicted an overconfident claim. V2 improved composite quality and support coverage on the split, but was not yet undeniable on primary selection or forbidden-primary discipline.

Clean holdout V3 regression generated by `npm run benchmark:skills:clean-v3` after the promoted V3 misses informed routing fixes:

- Cases: 18.
- V2 output quality: 94.4.
- V2 gain over no SkillWeaver: +44.1 points.
- V2 gain over skill-level baseline: +32.2 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 72.2%.
- V2 support precision@5: 54.2%.
- V2 forbidden primary rate: 0.0%.
- V2 support-miss cases: 9/18.

The current V3 report is regression evidence for those prompts. It shows the promoted failures were fixed on this regression suite without runtime bloat, but a new clean generalization claim requires a fresh prompt set captured after this tuning commit.

Clean holdout V4 baseline generated by `npm run benchmark:skills:clean-v4` on June 27, 2026 after commit `764924b` and preserved at `77d4c73`:

- Cases: 21.
- V2 output quality: 49.0.
- V2 gain over no SkillWeaver: -6.8 points.
- V2 gain over skill-level baseline: -2.5 points.
- V2 primary hit@1: 33.3%.
- V2 expected primary top/workflow 5: 81.0%.
- V2 support coverage@5: 43.7%.
- V2 support precision@5: 32.1%.
- V2 forbidden primary rate: 38.1%.
- V2 support-miss cases: 20/21.

After narrow tuning from the clean-holdout V4 misses, the same suite is regression evidence generated by `npm run benchmark:skills:clean-v4`:

- V2 output quality: 93.0.
- V2 gain over no SkillWeaver: +37.2 points.
- V2 gain over skill-level baseline: +41.5 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 65.1%.
- V2 support precision@5: 47.6%.
- V2 forbidden primary rate: 0.0%.
- V2 support-miss cases: 13/21.

Clean holdout V5 baseline generated by `npm run benchmark:skills:clean-v5` on June 27, 2026 after commit `c090354` and preserved at `38e4c6d`:

- Cases: 17.
- Domains covered: 11.
- Expected concepts covered: 14.
- Cases with provenance fields: 17/17.
- V2 output quality: 42.8.
- V2 gain over no SkillWeaver: -16.5 points.
- V2 gain over skill-level baseline: -12.3 points.
- V2 primary hit@1: 23.5%.
- V2 expected primary top/workflow 5: 82.4%.
- V2 support coverage@5: 37.3%.
- V2 support precision@5: 27.9%.
- V2 forbidden primary rate: 58.8%.
- V2 support-miss cases: 16/17.

After narrow tuning from the clean-holdout V5 misses, the same suite is regression evidence generated by `npm run benchmark:skills:clean-v5`:

- V2 output quality: 95.3.
- V2 gain over no SkillWeaver: +36.0 points.
- V2 gain over skill-level baseline: +40.2 points.
- V2 primary hit@1: 100.0%.
- V2 expected primary top/workflow 5: 100.0%.
- V2 support coverage@5: 76.5%.
- V2 support precision@5: 55.9%.
- V2 forbidden primary rate: 0.0%.
- V2 support-miss cases: 9/17.

These snapshots are strong evidence for the active, challenge, fresh-probe regression, frozen-holdout regression, clean-holdout V2 regression, clean-holdout V3 regression, clean-holdout V4 regression, and clean-holdout V5 regression suites, not proof of universal routing correctness.
