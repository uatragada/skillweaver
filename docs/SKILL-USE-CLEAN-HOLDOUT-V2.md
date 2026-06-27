# SkillWeaver V2 Clean Holdout V2 Regression Benchmark

Generated: 2026-06-27T20:37:25.864Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782592645864,"command":"npm run benchmark:skills:clean-v2-regression","suite":{"id":"clean-holdout-v2","label":"Clean Holdout V2 Regression","gatesAcceptance":false},"git":{"commit":"fb1b4cb310d3b721d7c92cbff5cb28d494def751","dirty":true,"dirtyPaths":["benchmarks/skill-routing-clean-holdout-v2.json","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","package.json","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["benchmarks/skill-routing-clean-holdout-v2.json","package.json","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js"],"cases":{"count":14,"sha256":"sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05","scanner":"sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b","benchmarkScript":"sha256:014ce3ab1d7dd1afd100b9ae1359300efa8da4af124ac3541e45d6c3719a767c","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:657fd63fdf74d5fa6a601efe23362080eb3966f0e85b21872e19b5b466c41b76"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v2-regression`
- Suite: Clean Holdout V2 Regression
- Acceptance gate: no
- Git commit at generation: `fb1b4cb310d3b721d7c92cbff5cb28d494def751`
- Git dirty: yes
- Invalidating dirty paths: `benchmarks/skill-routing-clean-holdout-v2.json`, `package.json`, `scripts/benchmark-skill-routing.mjs`, `server/skill-scanner.js`
- Case hash: `sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05`
- Scanner hash: `sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b`
- Benchmark script hash: `sha256:014ce3ab1d7dd1afd100b9ae1359300efa8da4af124ac3541e45d6c3719a767c`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:657fd63fdf74d5fa6a601efe23362080eb3966f0e85b21872e19b5b466c41b76`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 14

## Suite Role

This suite began as the clean holdout V2 baseline, then its misses informed this routing pass. Treat the current checked-in report as non-gating regression evidence for that prompt set. The pre-tuning baseline remains preserved in git history at `fb1b4cb`; a new clean holdout claim requires a fresh prompt set captured after these routing changes and reported before tuning from it.

## Case Provenance

- Cases with provenance fields: 14/14.
- Source mix: subagent-audit: 14.
- Suite state mix: regression: 14.
- Promotion status mix: backlog: 8, challenge: 6.
- Support criticality mix: primary-critical: 11, support-critical: 3.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 68.3 | 79.0 | 90.5 | +22.2 pts | +11.5 pts |
| Primary hit@1 | 71.4% | 85.7% | 100.0% | +28.6 pp | +14.3 pp |
| Expected skill in top/workflow 5 | 92.9% | 100.0% | 100.0% | +7.1 pp | 0.0 pp |
| Mean reciprocal rank | 0.794 | 0.903 | 1.000 | +0.206 | +0.097 |
| Support-skill coverage@5 | 26.2% | 33.3% | 52.4% | +26.2 pp | +19.0 pp |
| Support precision@5, exploratory | 19.6% | 25.6% | 39.3% | +19.6 pp | +13.7 pp |
| Forbidden primary rate, lower is better | 7.1% | 7.1% | 0.0% | -7.1 pp better | -7.1 pp better |
| Mean candidates to expected skill, lower is better | 2.1 | 1.5 | 1.0 | -1.1 candidates better | -0.5 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V2 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 14/14 primary hit@1, 14/14 expected primary in top/workflow five, 0/14 forbidden primaries, support coverage@5 52.4%, support precision@5 39.3%, and 14/14 support-miss cases. The pre-tuning clean baseline is preserved in git history at `fb1b4cb`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 14/14; expected primary top/workflow-five 14/14; forbidden primary 0/14; support-miss cases 14/14.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V2 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v2 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 3 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 3/3 | +8.9 pts | +2.2 pts |
| Data analytics | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +31.7 pts | +31.7 pts |
| Product, research, and planning | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 2/2 | +58.3 pts | +6.7 pts |
| AI agent apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Documents and publishing | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Hugging Face ML | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +77.8 pts | +63.8 pts |
| Infrastructure platforms | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Platform delivery | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Security and risk | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill tooling | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cloudflare workers | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +6.7 pts | +3.3 pts |
| Data dashboards and reports | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +31.7 pts | +31.7 pts |
| Figma design handoff | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 2/2 | +34.2 pts | +3.3 pts |
| Agent and LLM apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Browser verification | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Deployment and release | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Hugging Face ML | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +77.8 pts | +63.8 pts |
| Presentations | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Product planning | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +61.7 pts | +13.3 pts |
| Security review | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill authoring | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vercel-flags-experiment-holdout | Platform delivery | Deployment and release | vercel-flags | vercel-flags / 1 | vercel-flags / 1 | vercel-flags / 1 | Skill ranking anchor | vercel-flags -> experiment-designer -> feature-flag-guide -> design-kpis -> dev-release-productization |
| vercel-sandbox-secure-exec-holdout | AI agent apps | Agent and LLM apps | vercel-sandbox | vercel-sandbox / 1 | vercel-sandbox / 1 | vercel-sandbox / 1 | Skill ranking anchor | vercel-sandbox -> sandbox-sdk -> agent-browser-verify -> cloudflare -> copilot-sdk |
| agent-browser-preview-qa-holdout | Frontend experience | Browser verification | agent-browser-verify | agent-browser-verify / 1 | agent-browser-verify / 1 | agent-browser-verify / 1 | Browser verification | agent-browser-verify -> agent-browser -> control-in-app-browser -> frontend-testing-debugging -> playwright |
| cloudflare-sandbox-worker-holdout | Infrastructure platforms | Cloudflare workers | sandbox-sdk | sandbox-sdk / 1 | sandbox-sdk / 1 | sandbox-sdk / 1 | Cloudflare workers | sandbox-sdk -> workers-best-practices -> wrangler -> cloudflare -> agents-sdk |
| data-viz-accessible-report-holdout | Data analytics | Data dashboards and reports | data-visualization, visualize-data, build-report | accessibility-and-inclusive-visualization / 2 | accessibility-and-inclusive-visualization / 2 | data-visualization / 1 | Data dashboards and reports | data-visualization -> testing-data-visualizations -> build-report -> visualize-data -> accessibility-and-inclusive-visualization |
| data-jupyter-audit-trail-holdout | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | jupyter-notebooks / 1 | Data dashboards and reports | jupyter-notebooks -> build-report -> visualize-data -> data-analysis-standard -> kpi-reporting |
| figma-code-connect-holdout | Frontend experience | Figma design handoff | figma-code-connect-components, figma-code-connect | figma-code-connect / 1 | figma-code-connect-components / 1 | figma-code-connect-components / 1 | Figma design handoff | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-component-audit -> figma-generate-design |
| figjam-user-flow-holdout | Product, research, and planning | Figma design handoff | figma-use-figjam, figma-user-flow-planner | figma-code-connect / 4 | figma-user-flow-planner / 1 | figma-user-flow-planner / 1 | Skill ranking anchor | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | Skill tooling | Skill authoring | skill-security-auditor | skill-security-auditor / 1 | skill-security-auditor / 1 | skill-security-auditor / 1 | Skill authoring | skill-security-auditor -> skill-installer -> skill-creator -> copilot-sdk -> plugin-creator |
| security-ownership-map-holdout | Security and risk | Security review | security-ownership-map | security-ownership-map / 1 | security-ownership-map / 1 | security-ownership-map / 1 | Skill ranking anchor | security-ownership-map -> security-threat-model -> threat-model -> dev-security-engineering -> triage-finding |
| huggingface-trackio-eval-holdout | Hugging Face ML | Hugging Face ML | huggingface-trackio | huggingface-papers !huggingface-papers / 9 | huggingface-papers !huggingface-papers / 7 | huggingface-trackio / 1 | Hugging Face ML | huggingface-trackio -> huggingface-community-evals -> huggingface-gradio -> hf-cli -> huggingface-papers |
| template-creator-artifact-skill-holdout | Documents and publishing | Presentations | template-creator | template-creator / 1 | template-creator / 1 | template-creator / 1 | Skill ranking anchor | template-creator -> Presentations -> figma-use-slides -> reports-pdfs-and-slide-automation -> roadmap-presentation |
| linear-notion-roadmap-holdout | Product, research, and planning | Product planning | roadmap-narrative, linear | notion-research-documentation / 4 | roadmap-narrative / 1 | roadmap-narrative / 1 | Product planning | roadmap-narrative -> linear -> notion-research-documentation -> feature-prioritisation -> notion-spec-to-implementation |
| edge-web-perf-worker-holdout | Frontend experience | Cloudflare workers | web-perf | web-perf / 1 | web-perf / 1 | web-perf / 1 | Skill ranking anchor | web-perf -> workers-best-practices -> wrangler -> performance-budget -> durable-objects |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| vercel-flags-experiment-holdout | launch-readiness | vercel-flags -> experiment-designer -> feature-flag-guide -> design-kpis -> dev-release-productization |
| vercel-sandbox-secure-exec-holdout | ai-sdk, security-best-practices | vercel-sandbox -> sandbox-sdk -> agent-browser-verify -> cloudflare -> copilot-sdk |
| agent-browser-preview-qa-holdout | vercel-deploy | agent-browser-verify -> agent-browser -> control-in-app-browser -> frontend-testing-debugging -> playwright |
| cloudflare-sandbox-worker-holdout | security-best-practices | sandbox-sdk -> workers-best-practices -> wrangler -> cloudflare -> agents-sdk |
| data-viz-accessible-report-holdout | visualization-strategy-and-critique | data-visualization -> testing-data-visualizations -> build-report -> visualize-data -> accessibility-and-inclusive-visualization |
| data-jupyter-audit-trail-holdout | validate-data | jupyter-notebooks -> build-report -> visualize-data -> data-analysis-standard -> kpi-reporting |
| figma-code-connect-holdout | dev-frontend-react-next | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-component-audit -> figma-generate-design |
| figjam-user-flow-holdout | ux-research-plan, product-design:get-context | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | skillweaver, security-best-practices | skill-security-auditor -> skill-installer -> skill-creator -> copilot-sdk -> plugin-creator |
| security-ownership-map-holdout | track-findings, risk-register, security-best-practices | security-ownership-map -> security-threat-model -> threat-model -> dev-security-engineering -> triage-finding |
| huggingface-trackio-eval-holdout | huggingface-llm-trainer | huggingface-trackio -> huggingface-community-evals -> huggingface-gradio -> hf-cli -> huggingface-papers |
| template-creator-artifact-skill-holdout | documents, dev-documentation-systems | template-creator -> Presentations -> figma-use-slides -> reports-pdfs-and-slide-automation -> roadmap-presentation |
| linear-notion-roadmap-holdout | launch-readiness | roadmap-narrative -> linear -> notion-research-documentation -> feature-prioritisation -> notion-spec-to-implementation |
| edge-web-perf-worker-holdout | frontend-testing-debugging | web-perf -> workers-best-practices -> wrangler -> performance-budget -> durable-objects |

## Interpretation

On the clean holdout regression suite, SkillWeaver V2 changes the composite output-quality score by +22.2 points versus no SkillWeaver and +11.5 points versus the skill-level baseline.
V2 changes primary selection by +28.6 percentage points versus no SkillWeaver and +14.3 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +7.1 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
