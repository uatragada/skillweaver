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

## Next Experiments

- Add non-exact benchmark cases for SEO, creative production, Notion/workspace workflows, LaTeX, mobile/desktop, speech/local AI, and project-derived RacingSim work.
- Improve support-quality precision for backend service readiness, Three.js asset pipelines, and Kubernetes rollout support.
- Add a benchmark check mode that can detect stale generated reports without rewriting files.

