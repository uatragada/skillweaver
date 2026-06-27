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

## Next Experiments

- Improve support-quality precision for backend service readiness, Three.js asset pipelines, and Kubernetes rollout support.
- Add a benchmark check mode that can detect stale generated reports without rewriting files.
- Add a cap-aware relationship summary so `edgeTruncated` and `conceptEdgeTruncated` can distinguish true corpus size from capped output.
