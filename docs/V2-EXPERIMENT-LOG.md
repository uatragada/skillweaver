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

## Next Experiments

- Add a new fresh frozen holdout set from future real task logs before tuning more boosts.
- Work through the remaining coverage backlog from the independent audit, especially broader MCP server creation, deeper game-studio variants, Notion meeting-to-email ambiguity, Vercel Auth/Firewall variants, and visualization QA/accessibility variants.
- Decide whether support precision@5 should become an acceptance gate after expected-support lists are reviewed for completeness.
- Add an end-to-end graph-cap survival test if the corpus grows or cap behavior changes.
- Track latency over repeated scans if the indexed skill corpus grows past 1,000 skills.
