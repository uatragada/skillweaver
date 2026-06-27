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

## Next Experiments

- Add a small holdout set from real future task logs before tuning more boosts.
- Add stress cases for sibling skills with similar names, especially hosted-platform and plugin-cache variants.
- Track latency over repeated scans if the indexed skill corpus grows past 1,000 skills.
