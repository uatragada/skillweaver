# SkillWeaver V2 Frozen Holdout Benchmark

Generated: 2026-06-27T11:52:03.252Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782561123252,"command":"npm run benchmark:skills:holdout","suite":{"id":"holdout","label":"Frozen Holdout","gatesAcceptance":false},"git":{"commit":"b551d765926762033a03d45cc2ff326c62f6db30","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":22,"sha256":"sha256:7649eb6f455bf0cb555aaa678adad69ffe43526de2e83bfb3c8ead2f13dd2e59"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:7649eb6f455bf0cb555aaa678adad69ffe43526de2e83bfb3c8ead2f13dd2e59","scanner":"sha256:d174b9eff6aaefcea64a3e6aa14f876c86969354d9b0b3a348bdf2b09a01e502","benchmarkScript":"sha256:a1e3e4208155e746382d76f8925a9c0f3ff71a9ae15ca0dae65b2f93904cdd4f","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:a458de91d69e4ea0dea1b3269a49a3abb58781dcc9ddfe69f4d0107108eec00d"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:holdout`
- Suite: Frozen Holdout
- Acceptance gate: no
- Git commit at generation: `b551d765926762033a03d45cc2ff326c62f6db30`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:7649eb6f455bf0cb555aaa678adad69ffe43526de2e83bfb3c8ead2f13dd2e59`
- Scanner hash: `sha256:d174b9eff6aaefcea64a3e6aa14f876c86969354d9b0b3a348bdf2b09a01e502`
- Benchmark script hash: `sha256:a1e3e4208155e746382d76f8925a9c0f3ff71a9ae15ca0dae65b2f93904cdd4f`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:a458de91d69e4ea0dea1b3269a49a3abb58781dcc9ddfe69f4d0107108eec00d`
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

This is a frozen, non-gating holdout suite. It is meant to measure generalization after the active acceptance benchmark is already green. Do not tune concept rules directly from this report; promote misses into the active benchmark only after they recur in real task logs or are explicitly accepted as challenge coverage.

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

V2 raw counts: primary hit@1 22/22; expected primary top/workflow-five 22/22; forbidden primary 0/22; support-miss cases 12/22.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Holdout quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and holdout cases.

## Per-Case Results

| Case | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- |
| chatgpt-app-mcp-widget | chatgpt-apps | chatgpt-apps / 1 | chatgpt-apps / 1 | chatgpt-apps / 1 | Cloudflare workers | chatgpt-apps -> building-mcp-server-on-cloudflare -> copilot-sdk -> openai-agents-js -> agents-sdk |
| aspnet-minimal-api-review | aspnet-core | aspnet-core / 1 | aspnet-core / 1 | aspnet-core / 1 | Backend APIs and services | aspnet-core -> dev-backend-api-design -> dev-java-dotnet-services -> api-docs-writer -> dev-node-typescript-services |
| java-dotnet-service-boundary | dev-java-dotnet-services | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | Backend APIs and services | dev-java-dotnet-services -> dev-backend-api-design -> api-docs-writer -> aspnet-core -> dev-testing-qa |
| netlify-frontend-deploy | netlify-deploy | frontend-app-builder / 2 | netlify-deploy / 1 | netlify-deploy / 1 | Deployment and release | netlify-deploy -> env-vars -> agent-browser-verify -> cicd-playbook -> deployments-cicd |
| render-python-api-deploy | render-deploy | dev-python-services / 2 | dev-python-services / 5 | render-deploy / 1 | Deployment and release | render-deploy -> dev-python-services -> api-docs-writer -> aspnet-core -> api-versioning-strategy |
| screenshot-to-code-qa | design-image-to-code, image-to-code | control-in-app-browser / 2 | agent-browser / 3 | design-image-to-code / 1 | Browser verification | design-image-to-code -> playwright -> frontend-testing-debugging -> playwright-interactive -> screenshot |
| react-three-fiber-scene | react-three-fiber-game | react-three-fiber-game / 1 | react-three-fiber-game / 1 | react-three-fiber-game / 1 | Game development | react-three-fiber-game -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest -> phaser-2d-game |
| game-studio-prototype-plan | game-studio | web-3d-asset-pipeline / 4 | three-webgl-game / 3 | game-studio / 1 | Game development | game-studio -> game-playtest -> web-3d-asset-pipeline -> web-game-foundations -> three-webgl-game |
| notion-meeting-followups | notion-meeting-intelligence | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | Product planning | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-knowledge-capture -> gmail -> notion-research-documentation |
| vercel-ai-gateway-routing | ai-gateway | ai-gateway / 1 | ai-gateway / 1 | ai-gateway / 1 | Skill ranking anchor | ai-gateway -> ai-sdk -> copilot-sdk -> agents-sdk -> openai-agents-js |
| vercel-cron-workflow | cron-jobs | vercel-functions / 3 | vercel-functions / 3 | cron-jobs / 1 | Deployment and release | cron-jobs -> vercel-functions -> vercel-queues -> workflow -> agent-browser-verify |
| nextjs-auth-implementation | auth | auth / 1 | auth / 1 | auth / 1 | Skill ranking anchor | auth -> building-mcp-server-on-cloudflare -> vercel-api -> nextjs -> vercel-deploy |
| vercel-firewall-rules | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> frontend-app-builder -> figma-implement-design -> env-vars -> figma-generate-library |
| core-web-vitals-audit | web-perf | web-perf / 1 | web-perf / 1 | web-perf / 1 | Cloudflare workers | web-perf -> frontend-testing-debugging -> frontend-app-builder -> dev-frontend-accessibility-css -> dev-frontend-react-next |
| market-sizing-research | market-sizing | market-sizing / 1 | market-sizing / 1 | market-sizing / 1 | Skill ranking anchor | market-sizing -> product-business-analysis -> experiment-designer -> user-research-synthesis -> launch-readiness |
| metric-diagnostics-shift | metric-diagnostics | analyze-data-quality / 3 | metric-diagnostics / 1 | metric-diagnostics / 1 | Data dashboards and reports | metric-diagnostics -> data-analysis-standard -> product-business-analysis -> analyze-data-quality -> validate-data |
| ab-test-design | experiment-designer | design-kpis / 5 | design-kpis / 2 | experiment-designer / 1 | Product planning | experiment-designer -> design-kpis -> product-business-analysis -> metric-diagnostics -> ux-research-plan |
| product-business-retention | product-business-analysis | product-business-analysis / 1 | product-business-analysis / 1 | product-business-analysis / 1 | Product planning | product-business-analysis -> design-kpis -> risk-register -> user-research-synthesis -> build-dashboard |
| code-path-explanation | code-explainer | code-explainer / 1 | code-explainer / 1 | code-explainer / 1 | Repository operations | code-explainer -> dev-architecture-review -> error-decoder -> dependency-conflict-resolver -> dev-dependency-maintenance |
| system-design-interview-prep | system-design-interview | system-design-interview / 1 | system-design-interview / 1 | system-design-interview / 1 | Backend APIs and services | system-design-interview -> technical-spec-template -> dev-architecture-review -> database-schema-design -> dev-performance-engineering |
| api-docs-from-behavior | api-docs-writer | api-docs-writer / 1 | api-docs-writer / 1 | api-docs-writer / 1 | Documents and PDFs | api-docs-writer -> dev-backend-api-design -> api-versioning-strategy -> dev-documentation-systems -> dev-node-typescript-services |
| visualization-accessibility-audit | accessibility-and-inclusive-visualization | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | Data dashboards and reports | accessibility-and-inclusive-visualization -> visualization-strategy-and-critique -> d3-data-visualization -> data-visualization -> testing-data-visualizations |

## V2 Support Misses

These rows have a correct expected primary somewhere in V2's workflow, but not every expected support skill appears in the top/workflow five.

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

On the frozen holdout, SkillWeaver V2 changes the composite output-quality score by +22.6 points versus no SkillWeaver and +15.7 points versus the skill-level baseline.
V2 changes primary selection by +31.8 percentage points versus no SkillWeaver and +22.7 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by 0.0 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
