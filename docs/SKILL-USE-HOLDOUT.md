# SkillWeaver V2 Post-Tuning Challenge Benchmark

Generated: 2026-06-27T12:20:00.480Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782562800480,"command":"npm run benchmark:skills:holdout","suite":{"id":"holdout","label":"Post-Tuning Challenge","gatesAcceptance":false},"git":{"commit":"1e6beae6d0f5514f51e2b18e4fdba9f0be7fd693","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":22,"sha256":"sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6","scanner":"sha256:d174b9eff6aaefcea64a3e6aa14f876c86969354d9b0b3a348bdf2b09a01e502","benchmarkScript":"sha256:a4eb4c21cd5b0559e8d170c3df2085961ebf303a59980934991499c84558cfca","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:fbf30a11f2c747c9d49568fe3182734ca7281d1a34930068bb768d5f5470ac71"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:holdout`
- Suite: Post-Tuning Challenge
- Acceptance gate: no
- Git commit at generation: `1e6beae6d0f5514f51e2b18e4fdba9f0be7fd693`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6`
- Scanner hash: `sha256:d174b9eff6aaefcea64a3e6aa14f876c86969354d9b0b3a348bdf2b09a01e502`
- Benchmark script hash: `sha256:a4eb4c21cd5b0559e8d170c3df2085961ebf303a59980934991499c84558cfca`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:fbf30a11f2c747c9d49568fe3182734ca7281d1a34930068bb768d5f5470ac71`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 22

## Suite Role

This is not pristine untouched holdout evidence for the current V2 route. The first 22-case pilot exposed gaps, then those misses informed the current fixes. Treat this report as frozen challenge/regression evidence. A clean cross-domain generalization claim requires a fresh prompt set collected after the last routing-tuning commit and reported before any tuning from those prompts.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 70.1 | 77.0 | 92.7 | +22.6 pts | +15.7 pts |
| Primary hit@1 | 68.2% | 77.3% | 100.0% | +31.8 pp | +22.7 pp |
| Expected skill in top/workflow 5 | 100.0% | 100.0% | 100.0% | 0.0 pp | 0.0 pp |
| Mean reciprocal rank | 0.801 | 0.850 | 1.000 | +0.199 | +0.150 |
| Support-skill coverage@5 | 34.1% | 45.5% | 63.6% | +29.5 pp | +18.2 pp |
| Support precision@5, exploratory | 18.2% | 25.4% | 31.8% | +13.6 pp | +6.4 pp |
| Forbidden primary rate, lower is better | 0.0% | 0.0% | 0.0% | 0.0 pp | 0.0 pp |
| Mean candidates to expected skill, lower is better | 1.6 | 1.5 | 1.0 | -0.6 candidates better | -0.5 candidates better |

## Claim Scope

This report supports the claim that V2 remains strong on a 22-case post-tuning challenge suite: 22/22 primary hit@1, 22/22 expected primary in top/workflow five, and 0/22 forbidden primaries. Workflow support quality is weaker than primary routing: support coverage@5 is 63.6%, support precision@5 is 31.8%, and 12/22 cases miss at least one expected support skill.

V2 raw counts: primary hit@1 22/22; expected primary top/workflow-five 22/22; forbidden primary 0/22; support-miss cases 12/22.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Challenge quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and challenge cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Backend services | 4 | 92.5 | 100.0% | 100.0% | 62.5% | 31.3% | 0.0% | 2/4 | +5.0 pts | +2.5 pts |
| Platform delivery | 3 | 90.0 | 100.0% | 100.0% | 50.0% | 33.3% | 0.0% | 2/3 | +47.8 pts | +36.4 pts |
| Product, research, and planning | 3 | 86.7 | 100.0% | 100.0% | 33.3% | 16.7% | 0.0% | 3/3 | +22.0 pts | +16.7 pts |
| AI agent apps | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 2/2 | +5.0 pts | 0.0 pts |
| Data analytics | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/2 | +41.7 pts | +10.0 pts |
| Frontend experience | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 1/2 | +35.0 pts | +26.7 pts |
| Games and simulation | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 1/2 | +37.5 pts | +41.7 pts |
| Communications and knowledge | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Security and risk | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | -10.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Backend APIs and services | 4 | 92.5 | 100.0% | 100.0% | 62.5% | 31.3% | 0.0% | 2/4 | +5.0 pts | +2.5 pts |
| Product planning | 4 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 3/4 | +19.0 pts | +15.0 pts |
| Deployment and release | 3 | 90.0 | 100.0% | 100.0% | 50.0% | 33.3% | 0.0% | 2/3 | +47.8 pts | +36.4 pts |
| Agent and LLM apps | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 2/2 | +5.0 pts | 0.0 pts |
| Data dashboards and reports | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/2 | +41.7 pts | +10.0 pts |
| Game development | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 1/2 | +37.5 pts | +41.7 pts |
| Documents and PDFs | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Figma design handoff | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +70.0 pts | +63.3 pts |
| Frontend implementation | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 1/1 | 0.0 pts | -10.0 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Security review | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | -10.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| chatgpt-app-mcp-widget | AI agent apps | Agent and LLM apps | chatgpt-apps | chatgpt-apps / 1 | chatgpt-apps / 1 | chatgpt-apps / 1 | Cloudflare workers | chatgpt-apps -> building-mcp-server-on-cloudflare -> copilot-sdk -> openai-agents-js -> agents-sdk |
| aspnet-minimal-api-review | Backend services | Backend APIs and services | aspnet-core | aspnet-core / 1 | aspnet-core / 1 | aspnet-core / 1 | Backend APIs and services | aspnet-core -> dev-backend-api-design -> dev-java-dotnet-services -> api-docs-writer -> dev-node-typescript-services |
| java-dotnet-service-boundary | Backend services | Backend APIs and services | dev-java-dotnet-services | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | Backend APIs and services | dev-java-dotnet-services -> dev-backend-api-design -> api-docs-writer -> aspnet-core -> dev-testing-qa |
| netlify-frontend-deploy | Platform delivery | Deployment and release | netlify-deploy | frontend-app-builder / 2 | netlify-deploy / 1 | netlify-deploy / 1 | Deployment and release | netlify-deploy -> env-vars -> agent-browser-verify -> cicd-playbook -> deployments-cicd |
| render-python-api-deploy | Platform delivery | Deployment and release | render-deploy | dev-python-services / 2 | dev-python-services / 5 | render-deploy / 1 | Deployment and release | render-deploy -> dev-python-services -> api-docs-writer -> aspnet-core -> api-versioning-strategy |
| screenshot-to-code-qa | Frontend experience | Figma design handoff | design-image-to-code, image-to-code | control-in-app-browser / 2 | agent-browser / 3 | design-image-to-code / 1 | Browser verification | design-image-to-code -> playwright -> frontend-testing-debugging -> playwright-interactive -> screenshot |
| react-three-fiber-scene | Games and simulation | Game development | react-three-fiber-game | react-three-fiber-game / 1 | react-three-fiber-game / 1 | react-three-fiber-game / 1 | Game development | react-three-fiber-game -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest -> phaser-2d-game |
| game-studio-prototype-plan | Games and simulation | Game development | game-studio | web-3d-asset-pipeline / 4 | three-webgl-game / 3 | game-studio / 1 | Game development | game-studio -> game-playtest -> web-3d-asset-pipeline -> web-game-foundations -> three-webgl-game |
| notion-meeting-followups | Communications and knowledge | Product planning | notion-meeting-intelligence | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | Product planning | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-knowledge-capture -> gmail -> notion-research-documentation |
| vercel-ai-gateway-routing | AI agent apps | Agent and LLM apps | ai-gateway | ai-gateway / 1 | ai-gateway / 1 | ai-gateway / 1 | Skill ranking anchor | ai-gateway -> ai-sdk -> copilot-sdk -> agents-sdk -> openai-agents-js |
| vercel-cron-workflow | Platform delivery | Deployment and release | cron-jobs | vercel-functions / 3 | vercel-functions / 3 | cron-jobs / 1 | Deployment and release | cron-jobs -> vercel-functions -> vercel-queues -> workflow -> agent-browser-verify |
| nextjs-auth-implementation | Backend services | Backend APIs and services | auth | auth / 1 | auth / 1 | auth / 1 | Skill ranking anchor | auth -> building-mcp-server-on-cloudflare -> vercel-api -> nextjs -> vercel-deploy |
| vercel-firewall-rules | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> frontend-app-builder -> figma-implement-design -> env-vars -> figma-generate-library |
| core-web-vitals-audit | Frontend experience | Frontend implementation | web-perf | web-perf / 1 | web-perf / 1 | web-perf / 1 | Cloudflare workers | web-perf -> frontend-testing-debugging -> frontend-app-builder -> dev-frontend-accessibility-css -> dev-frontend-react-next |
| market-sizing-research | Product, research, and planning | Product planning | market-sizing | market-sizing / 1 | market-sizing / 1 | market-sizing / 1 | Skill ranking anchor | market-sizing -> product-business-analysis -> experiment-designer -> user-research-synthesis -> launch-readiness |
| metric-diagnostics-shift | Data analytics | Data dashboards and reports | metric-diagnostics | analyze-data-quality / 3 | metric-diagnostics / 1 | metric-diagnostics / 1 | Data dashboards and reports | metric-diagnostics -> data-analysis-standard -> product-business-analysis -> analyze-data-quality -> validate-data |
| ab-test-design | Product, research, and planning | Product planning | experiment-designer | design-kpis / 5 | design-kpis / 2 | experiment-designer / 1 | Product planning | experiment-designer -> design-kpis -> product-business-analysis -> metric-diagnostics -> ux-research-plan |
| product-business-retention | Product, research, and planning | Product planning | product-business-analysis | product-business-analysis / 1 | product-business-analysis / 1 | product-business-analysis / 1 | Product planning | product-business-analysis -> design-kpis -> risk-register -> user-research-synthesis -> build-dashboard |
| code-path-explanation | Repo collaboration | Repository operations | code-explainer | code-explainer / 1 | code-explainer / 1 | code-explainer / 1 | Repository operations | code-explainer -> dev-architecture-review -> error-decoder -> dependency-conflict-resolver -> dev-dependency-maintenance |
| system-design-interview-prep | Backend services | Backend APIs and services | system-design-interview | system-design-interview / 1 | system-design-interview / 1 | system-design-interview / 1 | Backend APIs and services | system-design-interview -> technical-spec-template -> dev-architecture-review -> database-schema-design -> dev-performance-engineering |
| api-docs-from-behavior | Documents and publishing | Documents and PDFs | api-docs-writer | api-docs-writer / 1 | api-docs-writer / 1 | api-docs-writer / 1 | Documents and PDFs | api-docs-writer -> dev-backend-api-design -> api-versioning-strategy -> dev-documentation-systems -> dev-node-typescript-services |
| visualization-accessibility-audit | Data analytics | Data dashboards and reports | accessibility-and-inclusive-visualization | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | Data dashboards and reports | accessibility-and-inclusive-visualization -> visualization-strategy-and-critique -> d3-data-visualization -> data-visualization -> testing-data-visualizations |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| chatgpt-app-mcp-widget | openai-docs | chatgpt-apps -> building-mcp-server-on-cloudflare -> copilot-sdk -> openai-agents-js -> agents-sdk |
| netlify-frontend-deploy | dev-release-productization, frontend-testing-debugging | netlify-deploy -> env-vars -> agent-browser-verify -> cicd-playbook -> deployments-cicd |
| render-python-api-deploy | monitoring-setup-guide | render-deploy -> dev-python-services -> api-docs-writer -> aspnet-core -> api-versioning-strategy |
| game-studio-prototype-plan | game-ui-frontend | game-studio -> game-playtest -> web-3d-asset-pipeline -> web-game-foundations -> three-webgl-game |
| vercel-ai-gateway-routing | openai-docs | ai-gateway -> ai-sdk -> copilot-sdk -> agents-sdk -> openai-agents-js |
| nextjs-auth-implementation | security-best-practices, dev-backend-api-design | auth -> building-mcp-server-on-cloudflare -> vercel-api -> nextjs -> vercel-deploy |
| vercel-firewall-rules | security-best-practices, vercel-deploy | vercel-firewall -> frontend-app-builder -> figma-implement-design -> env-vars -> figma-generate-library |
| core-web-vitals-audit | performance-budget | web-perf -> frontend-testing-debugging -> frontend-app-builder -> dev-frontend-accessibility-css -> dev-frontend-react-next |
| market-sizing-research | business-strategy-and-research, external-research-digests | market-sizing -> product-business-analysis -> experiment-designer -> user-research-synthesis -> launch-readiness |
| ab-test-design | kpi-reporting | experiment-designer -> design-kpis -> product-business-analysis -> metric-diagnostics -> ux-research-plan |
| product-business-retention | metric-diagnostics | product-business-analysis -> design-kpis -> risk-register -> user-research-synthesis -> build-dashboard |
| system-design-interview-prep | dev-backend-api-design | system-design-interview -> technical-spec-template -> dev-architecture-review -> database-schema-design -> dev-performance-engineering |

## Interpretation

On the post-tuning challenge suite, SkillWeaver V2 changes the composite output-quality score by +22.6 points versus no SkillWeaver and +15.7 points versus the skill-level baseline.
V2 changes primary selection by +31.8 percentage points versus no SkillWeaver and +22.7 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by 0.0 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
