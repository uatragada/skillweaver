# SkillWeaver V2 Clean Holdout V2 Regression Benchmark

Generated: 2026-07-07T06:37:53.307Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783406273307,"command":"npm run benchmark:skills:clean-v2-regression","suite":{"id":"clean-holdout-v2","label":"Clean Holdout V2 Regression","gatesAcceptance":false},"git":{"commit":"c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784","dirty":true,"dirtyPaths":["docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md"]},"invalidatingDirtyPaths":[],"cases":{"count":14,"sha256":"sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"inputs":{"cases":"sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:51c1c83fec9431fa8fe12867f079892d0ffb3ffa240c4e0b4ffa87b58e2cfeee"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v2-regression`
- Suite: Clean Holdout V2 Regression
- Acceptance gate: no
- Git commit at generation: `c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784`
- Git dirty: yes
- Invalidating dirty paths: none
- Case hash: `sha256:dbb898ac75a81a7d7ad7dc007d5d85daea32d9e58b28e41fa6763ba4c0803f05`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f`
- Snapshot fingerprint: `sha256:51c1c83fec9431fa8fe12867f079892d0ffb3ffa240c4e0b4ffa87b58e2cfeee`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
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
| Output quality score (0-100) | 68.3 | 79.0 | 92.9 | +24.6 pts | +13.8 pts |
| Primary hit@1 | 71.4% | 85.7% | 100.0% | +28.6 pp | +14.3 pp |
| Expected skill in top/workflow 5 | 92.9% | 100.0% | 100.0% | +7.1 pp | 0.0 pp |
| Mean reciprocal rank | 0.794 | 0.903 | 1.000 | +0.206 | +0.097 |
| Support-skill coverage@5 | 26.2% | 33.3% | 64.3% | +38.1 pp | +31.0 pp |
| Support precision@5, exploratory | 19.6% | 25.6% | 48.2% | +28.6 pp | +22.6 pp |
| Forbidden primary rate, lower is better | 7.1% | 7.1% | 0.0% | -7.1 pp better | -7.1 pp better |
| Confusable wrong primary rate, lower is better | 21.4% | 14.3% | 0.0% | -21.4 pp better | -14.3 pp better |
| Mean candidates to expected skill, lower is better | 2.1 | 1.5 | 1.0 | -1.1 candidates better | -0.5 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V2 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 14/14 primary hit@1, 14/14 expected primary in top/workflow five, 0/14 forbidden primaries, support coverage@5 64.3%, support precision@5 48.2%, and 13/14 support-miss cases. The pre-tuning clean baseline is preserved in git history at `fb1b4cb`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 14/14; expected primary top/workflow-five 14/14; forbidden primary 0/14; confusable wrong primary 0/14; support-miss cases 13/14.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V2 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v2 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 3 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 3/3 | +8.9 pts | +2.2 pts |
| Data analytics | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 62.5% | 0.0% | 0.0% | 1/2 | +35.0 pts | +35.0 pts |
| Product, research, and planning | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 0.0% | 2/2 | +58.3 pts | +6.7 pts |
| AI agent apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Documents and publishing | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | +6.7 pts |
| Hugging Face ML | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +77.8 pts | +63.8 pts |
| Infrastructure platforms | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Platform delivery | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Security and risk | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | +13.3 pts |
| Skill tooling | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | +6.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cloudflare workers | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 2/2 | +6.7 pts | +3.3 pts |
| Data dashboards and reports | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 62.5% | 0.0% | 0.0% | 1/2 | +35.0 pts | +35.0 pts |
| Figma design handoff | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 0.0% | 2/2 | +34.2 pts | +3.3 pts |
| Agent and LLM apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Browser verification | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Deployment and release | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Hugging Face ML | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +77.8 pts | +63.8 pts |
| Presentations | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | +6.7 pts |
| Product planning | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +61.7 pts | +13.3 pts |
| Security review | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +13.3 pts | +13.3 pts |
| Skill authoring | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | +6.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vercel-flags-experiment-holdout | Platform delivery | Deployment and release | vercel-flags | vercel-flags / 1 | vercel-flags / 1 | vercel-flags / 1 | Skill ranking anchor | vercel-flags -> experiment-designer -> feature-flag-guide -> design-kpis -> dev-release-productization |
| vercel-sandbox-secure-exec-holdout | AI agent apps | Agent and LLM apps | vercel-sandbox | vercel-sandbox / 1 | vercel-sandbox / 1 | vercel-sandbox / 1 | Skill ranking anchor | vercel-sandbox -> sandbox-sdk -> agent-browser-verify -> cloudflare -> copilot-sdk |
| agent-browser-preview-qa-holdout | Frontend experience | Browser verification | agent-browser-verify | agent-browser-verify / 1 | agent-browser-verify / 1 | agent-browser-verify / 1 | Browser verification | agent-browser-verify -> agent-browser -> control-in-app-browser -> frontend-testing-debugging -> playwright |
| cloudflare-sandbox-worker-holdout | Infrastructure platforms | Cloudflare workers | sandbox-sdk | sandbox-sdk / 1 | sandbox-sdk / 1 | sandbox-sdk / 1 | Cloudflare workers | sandbox-sdk -> workers-best-practices -> wrangler -> cloudflare -> agents-sdk |
| data-viz-accessible-report-holdout | Data analytics | Data dashboards and reports | data-visualization, visualize-data, build-report | accessibility-and-inclusive-visualization / 2 | accessibility-and-inclusive-visualization / 2 | data-visualization / 1 | Data dashboards and reports | data-visualization -> testing-data-visualizations -> build-report -> visualize-data -> accessibility-and-inclusive-visualization |
| data-jupyter-audit-trail-holdout | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | jupyter-notebooks / 1 | Data dashboards and reports | jupyter-notebooks -> build-report -> visualize-data -> data-analysis-standard -> validate-data |
| figma-code-connect-holdout | Frontend experience | Figma design handoff | figma-code-connect-components, figma-code-connect | figma-code-connect / 1 | figma-code-connect-components / 1 | figma-code-connect-components / 1 | Figma design handoff | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-component-audit -> figma-generate-design |
| figjam-user-flow-holdout | Product, research, and planning | Figma design handoff | figma-use-figjam, figma-user-flow-planner | figma-code-connect / 4 | figma-user-flow-planner / 1 | figma-user-flow-planner / 1 | Skill ranking anchor | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | Skill tooling | Skill authoring | skill-security-auditor | skill-security-auditor / 1 | skill-security-auditor / 1 | skill-security-auditor / 1 | Skill authoring | skill-security-auditor -> skill-installer -> skillweaver -> hatch-pet -> copilot-sdk |
| security-ownership-map-holdout | Security and risk | Security review | security-ownership-map | security-ownership-map / 1 | security-ownership-map / 1 | security-ownership-map / 1 | Security review | security-ownership-map -> security-best-practices -> track-findings -> dev-security-engineering -> security-threat-model |
| huggingface-trackio-eval-holdout | Hugging Face ML | Hugging Face ML | huggingface-trackio | huggingface-papers !huggingface-papers / 9 | huggingface-papers !huggingface-papers / 7 | huggingface-trackio / 1 | Hugging Face ML | huggingface-trackio -> huggingface-community-evals -> huggingface-gradio -> hf-cli -> huggingface-jobs |
| template-creator-artifact-skill-holdout | Documents and publishing | Presentations | template-creator | template-creator / 1 | template-creator / 1 | template-creator / 1 | Presentations | template-creator -> Presentations -> documents -> premium-saas-landing-pages -> figma-use-slides |
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
| figma-code-connect-holdout | dev-frontend-react-next | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-component-audit -> figma-generate-design |
| figjam-user-flow-holdout | ux-research-plan, product-design:get-context | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | security-best-practices | skill-security-auditor -> skill-installer -> skillweaver -> hatch-pet -> copilot-sdk |
| security-ownership-map-holdout | risk-register | security-ownership-map -> security-best-practices -> track-findings -> dev-security-engineering -> security-threat-model |
| huggingface-trackio-eval-holdout | huggingface-llm-trainer | huggingface-trackio -> huggingface-community-evals -> huggingface-gradio -> hf-cli -> huggingface-jobs |
| template-creator-artifact-skill-holdout | dev-documentation-systems | template-creator -> Presentations -> documents -> premium-saas-landing-pages -> figma-use-slides |
| linear-notion-roadmap-holdout | launch-readiness | roadmap-narrative -> linear -> notion-research-documentation -> feature-prioritisation -> notion-spec-to-implementation |
| edge-web-perf-worker-holdout | frontend-testing-debugging | web-perf -> workers-best-practices -> wrangler -> performance-budget -> durable-objects |

## Interpretation

On the clean holdout regression suite, SkillWeaver V2 changes the composite output-quality score by +24.6 points versus no SkillWeaver and +13.8 points versus the skill-level baseline.
V2 changes primary selection by +28.6 percentage points versus no SkillWeaver and +14.3 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +7.1 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
