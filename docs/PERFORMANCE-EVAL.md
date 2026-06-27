# SkillWeaver Performance Budget

Date: 2026-06-27

SkillWeaver should keep V2 routing quality gains without becoming a heavy service. The product route stays deterministic, local-first, in memory, and free of model calls or persistent indexing jobs.

## Protected Journeys

| Journey | Budget | Current evidence |
| --- | ---: | --- |
| Scan local skill corpus | warn over 6s, investigate over 8s | 442 skills indexed in 4.692s |
| Active benchmark check | warn over 15s | 12.087s for 78 cases |
| Challenge benchmark check | warn over 10s | 7.180s for 22 cases |
| Fresh-probe benchmark check | warn over 10s | 7.106s for 18 cases |
| Frozen holdout benchmark check | warn over 10s | 6.931s for 12 cases |
| Clean holdout V2 regression benchmark check | warn over 10s | 6.869s for 14 cases |
| Clean holdout V3 benchmark check | warn over 10s | 8.271s for 18 cases |
| Production build JS bundle | warn over 250 kB raw JS | 211.33 kB raw JS in latest build |
| Production build CSS bundle | warn over 20 kB raw CSS | 9.69 kB raw CSS in latest build |

## Latest Measurement Snapshot

Measured on June 27, 2026 from a clean SkillWeaver worktree with Node `v24.14.1` and npm `11.11.0`.

| Command | Elapsed | Exit code | Evidence |
| --- | ---: | ---: | --- |
| `npm test` | 1.307s | 0 | 20 tests passed |
| `npm run --silent index:skills` | 4.692s | 0 | 442 skills, 2,000/4,105 skill edges kept, 200/231 concept edges kept |
| `npm run --silent benchmark:skills:check` | 12.087s | 0 | 78 cases, report fresh |
| `npm run --silent benchmark:skills:holdout:check` | 7.180s | 0 | 22 cases, report fresh |
| `npm run --silent benchmark:skills:fresh:check` | 7.106s | 0 | 18 cases, report fresh |
| `npm run --silent benchmark:skills:frozen:check` | 6.931s | 0 | 12 cases, report fresh |
| `npm run --silent benchmark:skills:clean-v2-regression:check` | 6.869s | 0 | 14 cases, report fresh; non-gating regression evidence |
| `npm run --silent benchmark:skills:clean-v3:check` | 8.271s | 0 | 18 cases, report fresh; non-gating untouched baseline |
| `npm run build` | 2.342s | 0 | production build passed |
| `Get-ChildItem dist\assets -File` | n/a | 0 | JS 211,334 bytes; CSS 9,690 bytes |

The API waits for the initial scan before it is ready, and `/api/refresh` runs another scan on demand. Current scan time is inside the scanner budget, so this remains an in-memory scan concern rather than a reason to add persistence or caching infrastructure.

## No-Bloat Rules

- Do not add a database, cache service, LLM reranker, background worker, or generated persisted graph for routing quality claims.
- Do not add dependencies for benchmark reporting, statistics, CSV export, charting, or JSON validation unless the standard library path becomes impossible to maintain.
- Domain and concept reporting must be post-processing over already-evaluated benchmark rows. It must not rerun `scanSkillRoots()`, `rankConceptWorkflowSkills()`, or `recommendWorkflow()` per slice.
- Support-quality backlog and promotion reporting must stay documentation-only or O(case count) post-processing. It must not add product-route passes, scanner passes, persisted indexes, model calls, or new reporting dependencies.
- Keep graph caps explicit: 2,000 skill relationship edges and 200 concept edges are responsiveness caps, not completeness claims.
- Treat O(n^2) relationship generation as the main corpus-growth risk. Avoid widening `buildEdges()` unless a measured corpus-growth problem requires it.

## Read-Only Measurement Commands

```powershell
npm test
npm run index:skills
npm run benchmark:skills:check
npm run benchmark:skills:holdout:check
npm run benchmark:skills:fresh:check
npm run benchmark:skills:frozen:check
npm run benchmark:skills:clean-v2-regression:check
npm run benchmark:skills:clean-v3:check
Measure-Command { node server\skill-scanner.js *> $null }
Measure-Command { npm run benchmark:skills:check *> $null }
Measure-Command { npm run benchmark:skills:holdout:check *> $null }
Measure-Command { npm run benchmark:skills:fresh:check *> $null }
Measure-Command { npm run benchmark:skills:frozen:check *> $null }
Measure-Command { npm run benchmark:skills:clean-v2-regression:check *> $null }
Measure-Command { npm run benchmark:skills:clean-v3:check *> $null }
Get-ChildItem dist\assets -File | Select-Object Name,Length
```

## Write-Producing Verification Commands

```powershell
npm run build
npm run benchmark:skills
npm run benchmark:skills:holdout
npm run benchmark:skills:fresh
npm run benchmark:skills:frozen
npm run benchmark:skills:clean-v2-regression
npm run benchmark:skills:clean-v3
```

## Current Assessment

The V2 concept map and the benchmark slice reports add quality evidence, not product runtime infrastructure. Cross-domain, frozen-holdout, clean-holdout V2 regression, and clean-holdout V3 reporting is generated only when benchmark commands run, and the API route continues to use the same `rankConceptWorkflowSkills()` helper.

The current performance posture is acceptable: quality reports are richer, but no new dependencies, persistence, model calls, larger graph caps, or extra product-route passes were added.

## Breach Response

If a budget is exceeded:

1. Re-run the command once to rule out cold process noise.
2. Check whether the skill corpus grew, graph caps changed, or benchmark case count changed.
3. If product runtime slowed, inspect `server/skill-scanner.js` before docs or report generation.
4. If benchmark runtime slowed, confirm slice reporting is still O(case count) after row evaluation.
5. Record the regression and fix in `docs/V2-EXPERIMENT-LOG.md`.
