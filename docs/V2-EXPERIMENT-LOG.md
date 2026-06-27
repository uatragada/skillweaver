# V2 Experiment Log

This log records routing experiments that changed SkillWeaver V2 quality. New entries should include the hypothesis, change, benchmark result, and any regression risk.

## 2026-06-27: Concept-Aided Product Route

### Hypothesis

A pure concept-first route identifies useful clusters but loses exact skill precision. A better lightweight route should use skill-level ranking as an anchor, then use concepts to improve primary selection and support coverage.

### Change

- Added `rankConceptWorkflowSkills()` and `recommendConceptWorkflow()` to `server/skill-scanner.js`.
- Updated `/api/workflow` to use the concept-aided route by default.
- Left `recommendWorkflow()` available as the skill-level baseline.
- Updated the benchmark to call the product V2 ranker instead of maintaining separate benchmark-only ranking logic.

### Result

On the 39-case benchmark:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 76.2 | 78.4 | 90.8 |
| Primary hit@1 | 76.9% | 79.5% | 94.9% |
| Expected skill top/workflow 5 | 97.4% | 97.4% | 100.0% |
| Support coverage@5 | 44.9% | 47.4% | 66.7% |
| Mean candidates to expected skill | 1.6 | 1.9 | 1.1 |

V2 gain:

- +14.5 output-quality points over no SkillWeaver.
- +12.4 output-quality points over the skill-level baseline.
- +21.8 percentage points support coverage over no SkillWeaver.
- +19.2 percentage points support coverage over the skill-level baseline.

### What Improved

- `data-dashboard` now routes to `build-dashboard` instead of data-quality audit skills.
- `chrome-control` now routes to `control-chrome`.
- `security-scan` now routes to scan skills first.
- `attack-path` now routes to `attack-path-analysis`.
- New backend, database, reliability, infrastructure, and repository operations concepts give broad engineering work explicit concept homes.

### What Got Worse

No benchmark metric regressed in the latest run. Remaining risks are mainly support quality and benchmark breadth.

### Runtime Impact

No new dependencies, persistence, model calls, or background jobs were added. V2 is still a deterministic in-memory derivation over the scanned corpus.

## 2026-06-27: Breadth Guards Without New Concepts

### Hypothesis

The concept map can cover more domains without adding new concept nodes if thin domains are expressed as live-name aliases inside existing high-level concepts. Negative guard cases should also catch broad keyword boosts before they inflate the aggregate score.

### Change

- Added 10 benchmark cases, expanding the suite from 39 to 49 cases.
- Covered SEO, creative ad/offer production, competitive intelligence, Notion workspace knowledge, LaTeX, mobile/desktop packaging, speech/local AI, RacingSim PPO progress, and two negative guard prompts.
- Added `mustNotPrimary` benchmark support and a forbidden-primary-rate metric.
- Added live-name aliases and narrow boosts for LaTeX, Notion, mobile/desktop, speech, RacingSim, and competitive-intelligence skills.
- Added nearby negation handling for data dashboard/report and vulnerability-scan wording.
- Filtered generic `Node`, `Python`, and `GitHub` tool overlap out of automatic concept skill-ref scoring.

### Result

On the 49-case benchmark:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 77.4 | 80.1 | 91.6 |
| Primary hit@1 | 77.6% | 81.6% | 95.9% |
| Expected skill top/workflow 5 | 95.9% | 95.9% | 100.0% |
| Support coverage@5 | 50.7% | 52.4% | 68.4% |
| Forbidden primary rate | 2.0% | 0.0% | 0.0% |
| Mean candidates to expected skill | 1.8 | 1.9 | 1.0 |

V2 gain:

- +14.3 output-quality points over no SkillWeaver.
- +11.6 output-quality points over the skill-level baseline.
- +18.4 percentage points primary hit@1 over no SkillWeaver.
- +14.3 percentage points primary hit@1 over the skill-level baseline.
- 0.0% forbidden primary rate.

### What Improved

- `frontend-dashboard-not-analytics` no longer routes to data dashboard skills.
- `threat-model-no-scan` no longer routes to scan skills.
- `speech-local-ai-loop` now chooses `transcribe`, then `speech` and `transformers-js`.
- `latex-technical-publishing` chooses `latex-doctor`, with `latex-compile` next.
- `mobile-desktop-packaging` chooses `dev-mobile-desktop`.
- `racingsim-ppo-progress` chooses `racingsim-ai-ml`, with `racingsim-game-dev` next.

### What Got Worse

No aggregate benchmark metric regressed versus the prior V2 run, but support quality still has noisy entries in some top five workflows. The next useful work is support precision, not more concept nodes.

### Runtime Impact

No new dependencies, persistence, model calls, or background jobs were added. The changes are static aliases, deterministic regex guards, and benchmark/doc updates.

## 2026-06-27: Support Precision, Freshness Checks, And Cap Metadata

### Hypothesis

V2 can become meaningfully better without adding concept bloat if the concept map treats support skills as role-specific workflow references instead of letting broad keyword overlap dominate the top five. The benchmark should also be self-auditing so future quality claims are not based on stale generated docs.

### Change

- Tuned role membership and narrow intent guards for frontend QA, GitHub CI, Vercel deploy/log inspection, Python service readiness, spreadsheet analysis, Cloudflare Worker deployment, Three.js asset support, marketing/CRO support, API docs, security review, and code-review adjacent workflows.
- Added `npm run benchmark:skills:check`, embedded benchmark metadata, input hashes, corpus fingerprinting, acceptance status, and stale-report checks.
- Added graph-cap metadata for skill edges and concept edges, including candidate counts and dropped edge types.
- Added regression tests for Vercel deploy support, Python service support, and graph-cap summary fields.

### Result

On the 49-case benchmark:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 77.4 | 80.1 | 100.0 |
| Primary hit@1 | 77.6% | 81.6% | 100.0% |
| Expected skill top/workflow 5 | 95.9% | 95.9% | 100.0% |
| Mean reciprocal rank | 0.851 | 0.888 | 1.000 |
| Support coverage@5 | 50.7% | 52.4% | 100.0% |
| Forbidden primary rate | 2.0% | 0.0% | 0.0% |
| Mean candidates to expected skill | 1.8 | 1.9 | 1.0 |

V2 gain:

- +22.6 output-quality points over no SkillWeaver.
- +19.9 output-quality points over the skill-level baseline.
- +22.4 percentage points primary hit@1 over no SkillWeaver.
- +18.4 percentage points primary hit@1 over the skill-level baseline.
- +49.3 percentage points support coverage over no SkillWeaver.
- +47.6 percentage points support coverage over the skill-level baseline.

### What Improved

- `vercel-deploy` keeps `vercel-api` / deployment skills primary while keeping `env-vars` and `agent-browser-verify` in the workflow.
- `python-service` keeps `dev-python-services` primary while surfacing `monitoring-setup-guide` and `dev-testing-qa`.
- Support misses are zero across the current benchmark.
- The benchmark report now has enough metadata to fail stale claims in CI or before commit.
- Relationship cap behavior is auditable without expanding the in-memory graph.

### What Got Worse

No benchmark metric regressed. The main risk is benchmark overfitting: 49 cases is broad enough to compare versions, but not enough to claim universal routing correctness.

### Runtime Impact

No new dependencies, persistence, model calls, or background jobs were added. The added work is deterministic sorting, fixed-size metadata, and a benchmark check path outside the product request flow.

## 2026-06-27: Challenge Expansion And Generalization Guards

### Hypothesis

V2 needs to keep 100.0% measured primary and support coverage after adding wider cross-domain cases and stricter wording traps. If a concept map is really useful for skill navigation, it should survive sibling-skill confusion, negated intent variants, self-review prompts, and thin-but-real development domains without adding new heavyweight infrastructure.

### Change

- Expanded the benchmark from 49 to 78 cases with 25 cross-domain challenge cases and 4 robustness stress cases.
- Added coverage for accessibility design QA, URL-to-code, plugin creation, CLI creation, changelogs, onboarding docs, resume tailoring, load testing, feature flags, disaster recovery, Sentry, Supabase, Stripe, Cloudflare Durable Objects, Hugging Face vision and Gradio, PRDs, user research, dependency conflicts, log debugging, monorepo builds, security triage, risk registers, capacity planning, and Copilot SDK work.
- Added stress cases for SkillWeaver self-review, Figma implementation versus Figma gateway use, dashboard wording that should prefer frontend over analytics, and threat-model wording that should not become a vulnerability scan.
- Added benchmark case validation for duplicate ids, required fields, and expected skill fragments that do not match the live indexed corpus.
- Added exploratory support precision@5 so support gains can be checked for noise, not only presence.
- Tuned only narrow deterministic guards: negation variants, SkillWeaver routing-review intent, Figma gateway versus implementation intent, Stripe and Durable Object sibling selection, Hugging Face Gradio and vision routing, dependency conflict handling, and planning/operations aliases.

### Result

On the 78-case benchmark:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 75.3 | 77.2 | 100.0 |
| Primary hit@1 | 74.4% | 76.9% | 100.0% |
| Expected skill top/workflow 5 | 94.9% | 93.6% | 100.0% |
| Mean reciprocal rank | 0.826 | 0.856 | 1.000 |
| Support coverage@5 | 50.4% | 52.8% | 100.0% |
| Support precision@5 | 18.6% | 21.1% | 40.9% |
| Forbidden primary rate | 3.8% | 2.6% | 0.0% |
| Mean candidates to expected skill | 2.2 | 1.9 | 1.0 |

V2 gain:

- +24.7 output-quality points over no SkillWeaver.
- +22.8 output-quality points over the skill-level baseline.
- +25.6 percentage points primary hit@1 over no SkillWeaver.
- +23.1 percentage points primary hit@1 over the skill-level baseline.
- +49.6 percentage points support coverage over no SkillWeaver.
- +47.2 percentage points support coverage over the skill-level baseline.
- +22.3 percentage points support precision@5 over no SkillWeaver.
- +19.8 percentage points support precision@5 over the skill-level baseline.

### What Improved

- `skillweaver-routing-review` now chooses `skillweaver` rather than generic performance, dashboard, or Sentry skills.
- Figma wording now separates gateway use (`figma-use`) from implementation work (`figma-implement-design` plus React support).
- Negated forms such as `instead of` and `don't run` no longer route dashboard UI or threat-model work into data analytics or vulnerability scans.
- Thin but important development tasks now have measured homes without adding concept nodes.
- The benchmark can fail fast when a case points at a skill name that is not actually indexed.

### What Got Worse

No benchmark metric regressed in the measured suite. The main remaining risk is still benchmark overfitting: all 78 cases are active acceptance cases, not a frozen holdout. Support precision also remains exploratory because expected-support lists are deliberately small and do not enumerate every reasonable helper skill.

### Runtime Impact

No new dependencies, persistence, model calls, or background jobs were added. The changes remain static concept membership, deterministic intent guards, and benchmark/report validation.

## 2026-06-27: Holdout Pilot And Specialist Anchors

### Hypothesis

The active 78-case suite was too easy to overfit once every case was an acceptance target. A separate post-tuning challenge report should expose whether V2 remains strong on specialist domains without adding runtime bloat.

### Change

- Added `benchmarks/skill-routing-holdout.json` with 22 cross-domain specialist prompts from the subagent coverage audits.
- Added `npm run benchmark:skills:holdout` and `npm run benchmark:skills:holdout:check`, reusing the same evaluator, metadata, hashes, case validation, and stale-report checks as the active suite.
- Kept post-tuning challenge quality non-gating while still reporting the same metrics.
- Added high-confidence skill-level anchors so V2 cannot bury directly named specialist skills behind broad concept refs.
- Tightened existing concept membership for provider deploys, Vercel Cron, Auth, screenshot-to-code, React Three Fiber, game planning, metric diagnostics, experiment design, code explanation, visualization accessibility, and spreadsheets without adding new concept nodes.
- Added a regression test for directly named specialist-skill anchors.

### Result

The first untouched holdout pilot exposed a real gap: V2 output quality was 48.4, primary hit@1 was 40.9%, top/workflow-5 retrieval was 54.5%, and forbidden primary rate was 4.5%.

| Holdout stage | Output quality | Primary hit@1 | Expected top/workflow 5 | Support coverage@5 | Support precision@5 | Forbidden primary rate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| First untouched pilot | 48.4 | 40.9% | 54.5% | not recorded | not recorded | 4.5% |
| Post-tuning challenge | 93.6 | 100.0% | 100.0% | 68.2% | 34.1% | 0.0% |

After the general anchor and concept-membership fixes, on the 22-case post-tuning challenge suite:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 70.1 | 77.0 | 93.6 |
| Primary hit@1 | 68.2% | 77.3% | 100.0% |
| Expected skill top/workflow 5 | 100.0% | 100.0% | 100.0% |
| Mean reciprocal rank | 0.801 | 0.850 | 1.000 |
| Support coverage@5 | 34.1% | 45.5% | 68.2% |
| Support precision@5 | 18.2% | 25.4% | 34.1% |
| Forbidden primary rate | 0.0% | 0.0% | 0.0% |
| Mean candidates to expected skill | 1.6 | 1.5 | 1.0 |

V2 gain:

- +23.5 output-quality points over no SkillWeaver.
- +16.6 output-quality points over the skill-level baseline.
- +31.8 percentage points primary hit@1 over no SkillWeaver.
- +22.7 percentage points primary hit@1 over the skill-level baseline.
- +34.1 percentage points support coverage over no SkillWeaver.
- +22.7 percentage points support coverage over the skill-level baseline.

### What Improved

- V2 now keeps direct specialist matches such as `ai-gateway`, `auth`, `metric-diagnostics`, `code-explainer`, and `accessibility-and-inclusive-visualization` ahead of broad concept candidates.
- Provider-specific deployment prompts now keep `netlify-deploy`, `render-deploy`, and Vercel Cron skills visible.
- The active acceptance suite stayed at 100.0 output quality after the holdout-driven fixes.
- The report machinery now separates active acceptance from non-gating post-tuning challenge evidence.

### What Got Worse

This 22-case file is no longer pristine untouched holdout evidence because the pilot misses informed the fix. It is now a post-tuning challenge suite. Future generalization claims should use fresh prompts gathered after this commit.

### Runtime Impact

No new dependencies, persistence, model calls, background jobs, or larger graph caps were added. Benchmark runtime increases only when the explicit holdout command is run.

## 2026-06-27: Fresh Probe And Alias Generalization

### Hypothesis

The post-tuning challenge suite is useful regression pressure, but it no longer proves untouched generalization. A fresh prompt set collected after the last routing-tuning commit should expose whether V2 is only passing known cases or whether the concept map handles new high-value paraphrases.

### Change

- Added `benchmarks/skill-routing-fresh.json` with 18 prompts across 15 benchmark domains and 15 expected concepts.
- Added `npm run benchmark:skills:fresh` and `npm run benchmark:skills:fresh:check`, reusing the existing benchmark evaluator, report metadata, freshness checks, case validation, domain slices, and concept slices.
- Recorded the first pre-tuning fresh-probe result before using those misses to tune the route.
- Tuned only narrow deterministic aliases and kept them fenced by rival-workflow checks:
  - MCP server wording on Cloudflare Workers prefers `building-mcp-server-on-cloudflare`.
  - OAuth/session/protected-route wording can anchor the `auth` skill.
  - Notion meeting-note wording prefers `notion-meeting-intelligence`.
  - Incident postmortem wording prefers `incident-postmortem` over generic Sentry support.
  - Launch-readiness checklist, rollback, and feature-flag wording prefers `launch-readiness` without displacing explicit risk-register prompts.
  - Explicit creative-offer wording prefers `creative-offer` without displacing ad-production prompts.
  - Support aliases improve sprite pipeline, Vercel firewall security support, API versioning, Hugging Face Trackio, and Cloudflare sandbox support.
- Added a unit test for these fresh-probe intent aliases and the active/challenge rival workflows they could regress.

### Result

The first fresh probe exposed a real gap: V2 improved support coverage but only matched the baselines on primary hit@1.

| Fresh-probe stage | Output quality | Primary hit@1 | Expected top/workflow 5 | Support coverage@5 | Support precision@5 | Forbidden primary rate | Mean candidates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| First pre-tuning probe | 76.9 | 66.7% | 88.9% | 86.1% | 48.6% | 0.0% | 7.7 |
| Post-alias regression | 98.1 | 100.0% | 100.0% | 90.7% | 51.4% | 0.0% | 1.0 |

After the narrow alias fixes, on the 18-case fresh-probe regression suite:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 70.2 | 74.3 | 98.1 |
| Primary hit@1 | 66.7% | 72.2% | 100.0% |
| Expected skill top/workflow 5 | 88.9% | 88.9% | 100.0% |
| Mean reciprocal rank | 0.760 | 0.791 | 1.000 |
| Support coverage@5 | 52.8% | 59.3% | 90.7% |
| Support precision@5 | 30.6% | 34.7% | 51.4% |
| Forbidden primary rate | 0.0% | 0.0% | 0.0% |
| Mean candidates to expected skill | 4.2 | 2.1 | 1.0 |

V2 gain:

- +28.0 output-quality points over no SkillWeaver.
- +23.8 output-quality points over the skill-level baseline.
- +33.3 percentage points primary hit@1 over no SkillWeaver.
- +27.8 percentage points primary hit@1 over the skill-level baseline.
- +38.0 percentage points support coverage over no SkillWeaver.
- +31.5 percentage points support coverage over the skill-level baseline.

### What Improved

- The fresh suite no longer fails the mean-candidates quality gate.
- New high-value paraphrases route to the intended primary skill without adding a concept node or product-runtime infrastructure.
- Support quality improved while support precision also rose, so the support gains are not just extra noise.
- The active and post-tuning challenge suites can be checked alongside a third non-gating suite.

### What Got Worse

The fresh suite is no longer untouched holdout evidence once these prompts informed route tuning. It is now a fresh-probe regression suite. Future clean generalization claims need another prompt set collected after this alias-tuning commit.

### Runtime Impact

No new dependencies, persistence, model calls, background jobs, graph caps, or product-route passes were added. The extra cost is an explicit benchmark command that scans the corpus once and post-processes 18 cases.

## 2026-06-27: Frozen Holdout Baseline

### Hypothesis

The active, challenge, and fresh-probe regression suites show V2 is strong where it has already been exercised. A new clean-split holdout should reveal whether the concept map is genuinely broad or still brittle around untouched high-value workflow boundaries.

### Change

- Added `benchmarks/skill-routing-frozen-holdout.json` with 12 provenance-backed cases captured after commit `9be00e7` and before any tuning from the suite.
- Added `npm run benchmark:skills:frozen` and `npm run benchmark:skills:frozen:check`, reusing the existing evaluator, metadata, freshness checks, provenance validation, and slice reporting.
- Generated [SKILL-USE-FROZEN-HOLDOUT.md](SKILL-USE-FROZEN-HOLDOUT.md) from a clean committed boundary at `d7ba4be`.
- Did not change `server/skill-scanner.js`, app routes, frontend code, graph caps, dependencies, or product runtime behavior.

### Result

The frozen holdout found real clean-split gaps:

| Metric | No SkillWeaver | Skill-Level Baseline | V2 |
| --- | ---: | ---: | ---: |
| Output quality score | 67.3 | 66.5 | 59.1 |
| Primary hit@1 | 58.3% | 50.0% | 41.7% |
| Expected skill top/workflow 5 | 83.3% | 100.0% | 83.3% |
| Mean reciprocal rank | 0.754 | 0.714 | 0.620 |
| Support coverage@5 | 61.1% | 61.1% | 66.7% |
| Support precision@5 | 45.8% | 45.8% | 50.0% |
| Forbidden primary rate | 16.7% | 25.0% | 33.3% |
| Mean candidates to expected skill | 2.8 | 2.1 | 3.9 |

The suite is intentionally non-gating. It improves the research system by preventing a too-broad generalization claim. Current V2 is excellent on known and post-tuning suites, but not yet undeniably broad on untouched prompts.

### What Failed Cleanly

- Generic Node/TypeScript MCP server wording over-routes to Cloudflare and ChatGPT-specific skills.
- Gmail-plus-Notion wording lets Notion context displace Gmail inbox action.
- In-app browser wording chooses desktop Chrome.
- SwiftUI/motion Figma handoff stays too generic.
- Sprite/HUD pipeline wording routes to playtest/game support before the asset pipeline.
- Observability setup wording routes to a tool-specific Sentry path instead of the broader observability skill.
- Report-to-slides exposes a benchmark matching issue: broad `pdf` containment can mark the correct `reports-pdfs-and-slide-automation` primary as forbidden.

### Runtime Impact

No new runtime infrastructure was added. The new suite costs an explicit benchmark command only; `benchmark:skills:frozen:check` measured 5.990s for 12 cases, inside the 10s non-gating suite budget.

## 2026-06-27: Frozen Holdout Regression Tuning

### Hypothesis

The frozen holdout failures are narrow routing-boundary problems, not proof that V2 needs heavier infrastructure. A small concept-membership and intent-boost pass should improve the hard cases without adding dependencies, graph passes, or runtime bloat.

### Change

- Relabeled `benchmarks/skill-routing-frozen-holdout.json` from `untouched-holdout` to `regression` after preserving the pre-tuning baseline in git history.
- Added focused concept memberships and intent guards for generic Node/TypeScript MCP servers, Gmail inbox triage with Notion context, in-app browser selection, Phaser sprite/HUD pipelines, OpenTelemetry/SLO setup, and Figma SwiftUI motion handoff.
- Tightened only `mustNotPrimary` benchmark matching so short forbidden fragments such as `pdf` do not invalidate longer correct skill names like `reports-pdfs-and-slide-automation`.
- Added a unit regression test for the frozen failure modes.

### Result

| Suite | Cases | V2 quality | V2 hit@1 | V2 support coverage@5 | V2 forbidden primary | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Active acceptance | 78 | 100.0 | 100.0% | 100.0% | 0.0% | +24.7 pts | +22.8 pts |
| Post-tuning challenge | 22 | 91.4 | 95.5% | 68.2% | 0.0% | +21.3 pts | +14.4 pts |
| Fresh-probe regression | 18 | 94.6 | 94.4% | 88.0% | 0.0% | +24.4 pts | +20.3 pts |
| Frozen holdout regression | 12 | 95.6 | 100.0% | 77.8% | 0.0% | +24.9 pts | +25.7 pts |

The frozen prompt set moved from V2 trailing both baselines to V2 leading both baselines: output quality rose from 59.1 to 95.6, primary hit@1 from 41.7% to 100.0%, and forbidden primary rate from 33.3% to 0.0%. This is strong regression evidence for those prompts, not clean-split generalization proof.

### Runtime Impact

No new dependencies, persistence, model calls, graph caps, background jobs, or product-route passes were added. The changes stay inside the deterministic concept map, lightweight intent boosts, benchmark matcher, tests, and docs.

## Clean Holdout V2 Benchmark

Question: after the frozen-regression tuning commit `3cd6e51`, does V2 still beat no SkillWeaver and the skill-level baseline on untouched prompts?

### Change

- Added `benchmarks/skill-routing-clean-holdout-v2.json` with 14 provenance-backed prompts collected after commit `3cd6e51`.
- Added an initial clean holdout command, later renamed to `npm run benchmark:skills:clean-v2-regression` after the suite drove tuning.
- Generated [SKILL-USE-CLEAN-HOLDOUT-V2.md](SKILL-USE-CLEAN-HOLDOUT-V2.md) before tuning from these prompts.

### Result

| System | Quality | Hit@1 | Top/workflow 5 | Support coverage@5 | Forbidden primary |
| --- | ---: | ---: | ---: | ---: | ---: |
| No SkillWeaver | 68.3 | 71.4% | 92.9% | 26.2% | 7.1% |
| Skill-level baseline | 79.0 | 85.7% | 100.0% | 33.3% | 7.1% |
| SkillWeaver V2 | 61.3 | 57.1% | 78.6% | 45.2% | 35.7% |

V2 improved support coverage on this clean holdout, but it regressed the main routing job: output quality was -7.0 points versus no SkillWeaver and -17.7 points versus the skill-level baseline. Primary hit@1 was also lower by 14.3 and 28.6 percentage points respectively, and forbidden-primary rate rose to 35.7%.

### Interpretation

This clean suite is useful precisely because it breaks the overconfident story. V2 is strong on exercised suites, but current concept routing can still over-apply concept-level gateways and displace specific primary skills in browser verification, data notebooks/reports, Figma Code Connect, Hugging Face tracking, and roadmap planning. Do not tune from this suite while continuing to cite it as untouched holdout evidence; promote or fork failures before making routing changes.

### Runtime Impact

No runtime infrastructure changed. The new cost is one explicit benchmark command that scans the corpus once and evaluates 14 cases.

## Next Experiments

- Preserve the clean holdout V3 baseline before tuning from it.
- Promote the V3 P0 primary/forbidden-primary misses into a regression pass only after the baseline is committed.
- Capture a new clean holdout after any V3-driven tuning commit before making another renewed generalization claim.
- Use the frozen regression suite as a guardrail, not as fresh evidence.
- Work through the remaining coverage backlog from the independent audit, especially broader MCP server creation, deeper game-studio variants, Notion meeting-to-email ambiguity, Vercel Auth/Firewall variants, and visualization QA/accessibility variants.
- Decide whether support precision@5 should become an acceptance gate after expected-support lists are reviewed for completeness.
- Add an end-to-end graph-cap survival test if the corpus grows or cap behavior changes.
- Track latency over repeated scans if the indexed skill corpus grows past 1,000 skills.

## Clean Holdout V2 Regression Tuning

Question: after preserving the clean V2 baseline at `fb1b4cb`, can narrow concept aliases and intent guards repair the six promoted P0 misses without adding runtime machinery or weakening the exercised suites?

### Change

- Relabeled `benchmarks/skill-routing-clean-holdout-v2.json` from `untouched-holdout` to `regression`.
- Promoted the six P0 primary failures to `promotionStatus: "challenge"` and left support-only cases in backlog.
- Added deterministic concept aliases and intent guards for Vercel Agent Browser Verify, accessible chart-report building, Jupyter notebooks, Figma Code Connect, Hugging Face Trackio, and Linear/Notion roadmap planning.
- Renamed the public clean command to `npm run benchmark:skills:clean-v2-regression`.

### Result

| System | Quality | Hit@1 | Top/workflow 5 | Support coverage@5 | Forbidden primary |
| --- | ---: | ---: | ---: | ---: | ---: |
| No SkillWeaver | 68.3 | 71.4% | 92.9% | 26.2% | 7.1% |
| Skill-level baseline | 79.0 | 85.7% | 100.0% | 33.3% | 7.1% |
| SkillWeaver V2 | 90.5 | 100.0% | 100.0% | 52.4% | 0.0% |

V2 moved from -7.0 quality points versus no SkillWeaver and -17.7 versus the skill-level baseline to +22.2 and +11.5 respectively on this promoted regression suite. Primary hit@1 improved from 57.1% to 100.0%, and forbidden-primary rate improved from 35.7% to 0.0%.

### Runtime Impact

No new dependencies, persistence, model calls, graph caps, background jobs, or product-route passes were added. The changes stay inside deterministic concept membership, intent scoring, benchmark provenance, and tests.

## Clean Holdout V3 Baseline

Question: after preserving and tuning the clean V2 regression suite at `e2a47a6`, does V2 remain strong on a new untouched prompt set captured after that tuning point?

### Change

- Added `benchmarks/skill-routing-clean-holdout-v3.json` with 18 provenance-backed prompts collected after commit `e2a47a6`.
- Added `npm run benchmark:skills:clean-v3` and `npm run benchmark:skills:clean-v3:check`.
- Added stricter provenance validation for suites marked `role: "untouched-holdout"` so every case must declare the clean-split fields and `suiteState: "untouched-holdout"`.
- Did not change `server/skill-scanner.js`, product API routing, frontend code, graph caps, dependencies, model calls, or persistence.

### Result

| System | Quality | Hit@1 | Top/workflow 5 | Support coverage@5 | Support precision@5 | Forbidden primary |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| No SkillWeaver | 50.3 | 44.4% | 72.2% | 33.3% | 25.0% | 11.1% |
| Skill-level baseline | 62.3 | 61.1% | 77.8% | 40.7% | 30.6% | 5.6% |
| SkillWeaver V2 | 64.9 | 55.6% | 83.3% | 61.1% | 45.8% | 11.1% |

V2 still improves composite output quality over both baselines on the clean V3 split: +14.5 points versus no SkillWeaver and +2.6 points versus the skill-level baseline. It also improves expected top/workflow-five retrieval and support coverage over both baselines.

The same result blocks any "solved" claim. V2 trails the skill-level baseline on primary hit@1 by 5.6 percentage points, has 2/18 forbidden primaries, and has 13/18 support-miss cases. The most important clean misses are Netlify deployment, skill authoring, roadmap deck delivery, proactive observability, security finding triage, Hugging Face dataset research, game UI, and OpenAI Agents JS implementation.

### Interpretation

This is the right kind of uncomfortable evidence: V2 is directionally useful on a truly new split, but not yet undeniable. Preserve this report before tuning. If these cases drive routing changes, the suite must become regression evidence and a later clean split must be captured before renewed generalization claims.

### Runtime Impact

No runtime infrastructure changed. The new cost is one explicit benchmark command that scans the corpus once and evaluates 18 cases.

## Clean Holdout V3 Regression Tuning

Question: after preserving the clean V3 baseline at `00ad343`, can the concept map fix the promoted V3 misses while staying lightweight?

### Change

- Relabeled `benchmarks/skill-routing-clean-holdout-v3.json` from `untouched-holdout` to `regression`.
- Promoted the Netlify deployment, skill authoring, roadmap deck, proactive observability, security finding triage, Hugging Face dataset research, game UI, and OpenAI Agents JS misses to `promotionStatus: "challenge"`.
- Added narrow deterministic intent boosts and concept references for those boundaries.
- Added a focused V3 regression-boundary unit test.
- Did not add dependencies, persistence, model calls, graph caps, background jobs, or product-route passes.

### Result

| System | Quality | Hit@1 | Top/workflow 5 | Support coverage@5 | Support precision@5 | Forbidden primary |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| No SkillWeaver | 50.3 | 44.4% | 72.2% | 33.3% | 25.0% | 11.1% |
| Skill-level baseline | 62.3 | 61.1% | 77.8% | 40.7% | 30.6% | 5.6% |
| SkillWeaver V2 | 94.4 | 100.0% | 100.0% | 72.2% | 54.2% | 0.0% |

V2 moved from 64.9 to 94.4 quality on the V3 suite after tuning. Primary hit@1 improved from 55.6% to 100.0%, expected top/workflow-five retrieval from 83.3% to 100.0%, and forbidden-primary rate from 11.1% to 0.0%.

### Interpretation

This is strong regression evidence, not a renewed clean-split claim. The lightweight concept map now handles the promoted V3 boundaries across delivery, skill tooling, documents, observability, security, Hugging Face, games, and OpenAI agent work. A new untouched split is still required before saying the route generalizes beyond exercised prompts.
