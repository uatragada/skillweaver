# SkillWeaver V2 Post-Tuning Challenge Benchmark

Generated: 2026-07-06T20:57:11.502Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783371431502,"command":"npm run benchmark:skills:holdout","suite":{"id":"holdout","label":"Post-Tuning Challenge","gatesAcceptance":false},"git":{"commit":"d044c7c71ab42e5a7405c287576ea03745f37a1d","dirty":true,"dirtyPaths":[".github/","benchmarks/skill-routing-cases.json","benchmarks/skill-routing-clean-holdout-v3.json","benchmarks/skill-routing-clean-holdout-v4.json","docs/ROUTING-EVAL-METHODOLOGY.md","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-CLEAN-HOLDOUT-V5.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","scripts/benchmark-skill-routing.mjs","server/concept-routing-config.js","server/index.js","server/skill-scanner.js","src/main.jsx","src/styles.css","tests/api.test.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["scripts/benchmark-skill-routing.mjs","server/concept-routing-config.js","server/skill-scanner.js"],"cases":{"count":22,"sha256":"sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c"},"inputs":{"cases":"sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 confusable wrong-primary rate must stay at 0."]}},"snapshotFingerprint":"sha256:a509344cfabdaad4288d1891340976b836dee2667c0187c199130424c86ba548"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:holdout`
- Suite: Post-Tuning Challenge
- Acceptance gate: no
- Git commit at generation: `d044c7c71ab42e5a7405c287576ea03745f37a1d`
- Git dirty: yes
- Invalidating dirty paths: `scripts/benchmark-skill-routing.mjs`, `server/concept-routing-config.js`, `server/skill-scanner.js`
- Case hash: `sha256:6fec374bdfbc78bfc2a8dc58daff363486365590b754c829afe1db0e676ab3a6`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c`
- Snapshot fingerprint: `sha256:a509344cfabdaad4288d1891340976b836dee2667c0187c199130424c86ba548`
- Freshness check: pass
- Quality gate, reported only: fail: V2 confusable wrong-primary rate must stay at 0.

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
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
| Output quality score (0-100) | 70.1 | 77.0 | 91.8 | +21.7 pts | +14.8 pts |
| Primary hit@1 | 68.2% | 77.3% | 95.5% | +27.3 pp | +18.2 pp |
| Expected skill in top/workflow 5 | 100.0% | 100.0% | 100.0% | 0.0 pp | 0.0 pp |
| Mean reciprocal rank | 0.801 | 0.850 | 0.977 | +0.177 | +0.127 |
| Support-skill coverage@5 | 34.1% | 45.5% | 70.5% | +36.4 pp | +25.0 pp |
| Support precision@5, exploratory | 18.2% | 25.4% | 35.2% | +17.0 pp | +9.8 pp |
| Forbidden primary rate, lower is better | 0.0% | 0.0% | 0.0% | 0.0 pp | 0.0 pp |
| Confusable wrong primary rate, lower is better | 31.8% | 22.7% | 4.5% | -27.3 pp better | -18.2 pp better |
| Mean candidates to expected skill, lower is better | 1.6 | 1.5 | 1.0 | -0.6 candidates better | -0.5 candidates better |

## Claim Scope

This report supports the claim that V2 remains strong on a 22-case post-tuning challenge suite: 21/22 primary hit@1, 22/22 expected primary in top/workflow five, and 0/22 forbidden primaries. Workflow support quality is weaker than primary routing: support coverage@5 is 70.5%, support precision@5 is 35.2%, and 12/22 cases miss at least one expected support skill.

V2 raw counts: primary hit@1 21/22; expected primary top/workflow-five 22/22; forbidden primary 0/22; confusable wrong primary 1/22; support-miss cases 12/22.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Post-Tuning Challenge quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and post-tuning challenge cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Backend services | 4 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 2/4 | +7.5 pts | +5.0 pts |
| Platform delivery | 3 | 93.3 | 100.0% | 100.0% | 66.7% | 41.7% | 0.0% | 0.0% | 2/3 | +51.1 pts | +39.8 pts |
| Product, research, and planning | 3 | 86.7 | 100.0% | 100.0% | 33.3% | 16.7% | 0.0% | 0.0% | 3/3 | +22.0 pts | +16.7 pts |
| AI agent apps | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 2/2 | +5.0 pts | 0.0 pts |
| Data analytics | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 1/2 | +36.7 pts | +5.0 pts |
| Frontend experience | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 1/2 | +35.0 pts | +26.7 pts |
| Games and simulation | 2 | 75.0 | 50.0% | 100.0% | 100.0% | 50.0% | 0.0% | 50.0% | 0/2 | +17.5 pts | +21.7 pts |
| Communications and knowledge | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Security and risk | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 1/1 | +10.0 pts | 0.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Backend APIs and services | 4 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 2/4 | +7.5 pts | +5.0 pts |
| Product planning | 4 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 3/4 | +19.0 pts | +15.0 pts |
| Deployment and release | 3 | 93.3 | 100.0% | 100.0% | 66.7% | 41.7% | 0.0% | 0.0% | 2/3 | +51.1 pts | +39.8 pts |
| Agent and LLM apps | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 2/2 | +5.0 pts | 0.0 pts |
| Data dashboards and reports | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 1/2 | +36.7 pts | +5.0 pts |
| Game development | 2 | 75.0 | 50.0% | 100.0% | 100.0% | 50.0% | 0.0% | 50.0% | 0/2 | +17.5 pts | +21.7 pts |
| Documents and PDFs | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Figma design handoff | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +70.0 pts | +63.3 pts |
| Frontend implementation | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | -10.0 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Security review | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 1/1 | +10.0 pts | 0.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| chatgpt-app-mcp-widget | AI agent apps | Agent and LLM apps | chatgpt-apps | chatgpt-apps / 1 | chatgpt-apps / 1 | chatgpt-apps / 1 | Agent and LLM apps | chatgpt-apps -> building-mcp-server-on-cloudflare -> copilot-sdk -> openai-agents-js -> agents-sdk |
| aspnet-minimal-api-review | Backend services | Backend APIs and services | aspnet-core | aspnet-core / 1 | aspnet-core / 1 | aspnet-core / 1 | Backend APIs and services | aspnet-core -> auth -> dev-backend-api-design -> dev-java-dotnet-services -> api-docs-writer |
| java-dotnet-service-boundary | Backend services | Backend APIs and services | dev-java-dotnet-services | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | dev-java-dotnet-services / 1 | Backend APIs and services | dev-java-dotnet-services -> dev-backend-api-design -> api-docs-writer -> aspnet-core -> dev-testing-qa |
| netlify-frontend-deploy | Platform delivery | Deployment and release | netlify-deploy | frontend-app-builder / 2 | netlify-deploy / 1 | netlify-deploy / 1 | Deployment and release | netlify-deploy -> dev-release-productization -> env-vars -> launch-readiness -> agent-browser-verify |
| render-python-api-deploy | Platform delivery | Deployment and release | render-deploy | dev-python-services / 2 | dev-python-services / 5 | render-deploy / 1 | Deployment and release | render-deploy -> dev-python-services -> api-docs-writer -> aspnet-core -> api-versioning-strategy |
| screenshot-to-code-qa | Frontend experience | Figma design handoff | design-image-to-code, image-to-code | control-in-app-browser / 2 | agent-browser / 3 | design-image-to-code / 1 | Browser verification | design-image-to-code -> playwright -> frontend-testing-debugging -> playwright-interactive -> screenshot |
| react-three-fiber-scene | Games and simulation | Game development | react-three-fiber-game | react-three-fiber-game / 1 | react-three-fiber-game / 1 | react-three-fiber-game / 1 | Game development | react-three-fiber-game -> three-webgl-game -> web-3d-asset-pipeline -> game-playtest -> racingsim-game-dev |
| game-studio-prototype-plan | Games and simulation | Game development | game-studio | web-3d-asset-pipeline / 4 | three-webgl-game / 3 | sprite-pipeline / 2 | Game development | sprite-pipeline -> game-studio -> game-playtest -> game-ui-frontend -> web-game-foundations |
| notion-meeting-followups | Communications and knowledge | Product planning | notion-meeting-intelligence | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | notion-meeting-intelligence / 1 | Product planning | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-knowledge-capture -> gmail -> notion-research-documentation |
| vercel-ai-gateway-routing | AI agent apps | Agent and LLM apps | ai-gateway | ai-gateway / 1 | ai-gateway / 1 | ai-gateway / 1 | Skill ranking anchor | ai-gateway -> ai-sdk -> agents-sdk -> copilot-sdk -> openai-agents-js |
| vercel-cron-workflow | Platform delivery | Deployment and release | cron-jobs | vercel-functions / 3 | vercel-functions / 3 | cron-jobs / 1 | Deployment and release | cron-jobs -> vercel-functions -> vercel-queues -> workflow -> agent-browser-verify |
| nextjs-auth-implementation | Backend services | Backend APIs and services | auth | auth / 1 | auth / 1 | auth / 1 | Backend APIs and services | auth -> sign-in-with-vercel -> dev-backend-api-design -> aspnet-core -> dev-java-dotnet-services |
| vercel-firewall-rules | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> vercel-deploy -> frontend-app-builder -> figma-implement-design -> env-vars |
| core-web-vitals-audit | Frontend experience | Frontend implementation | web-perf | web-perf / 1 | web-perf / 1 | web-perf / 1 | Cloudflare workers | web-perf -> frontend-testing-debugging -> frontend-app-builder -> dev-frontend-accessibility-css -> dev-frontend-react-next |
| market-sizing-research | Product, research, and planning | Product planning | market-sizing | market-sizing / 1 | market-sizing / 1 | market-sizing / 1 | Skill ranking anchor | market-sizing -> product-business-analysis -> build-report -> jupyter-notebooks -> experiment-designer |
| metric-diagnostics-shift | Data analytics | Data dashboards and reports | metric-diagnostics | analyze-data-quality / 3 | metric-diagnostics / 1 | metric-diagnostics / 1 | Data dashboards and reports | metric-diagnostics -> data-analysis-standard -> product-business-analysis -> analyze-data-quality -> data-visualization |
| ab-test-design | Product, research, and planning | Product planning | experiment-designer | design-kpis / 5 | design-kpis / 2 | experiment-designer / 1 | Product planning | experiment-designer -> design-kpis -> product-business-analysis -> ux-research-plan -> metric-diagnostics |
| product-business-retention | Product, research, and planning | Product planning | product-business-analysis | product-business-analysis / 1 | product-business-analysis / 1 | product-business-analysis / 1 | Product planning | product-business-analysis -> design-kpis -> risk-register -> user-research-synthesis -> build-dashboard |
| code-path-explanation | Repo collaboration | Repository operations | code-explainer | code-explainer / 1 | code-explainer / 1 | code-explainer / 1 | Repository operations | code-explainer -> dev-architecture-review -> error-decoder -> dependency-conflict-resolver -> dev-dependency-maintenance |
| system-design-interview-prep | Backend services | Backend APIs and services | system-design-interview | system-design-interview / 1 | system-design-interview / 1 | system-design-interview / 1 | Backend APIs and services | system-design-interview -> technical-spec-template -> dev-architecture-review -> database-schema-design -> dev-performance-engineering |
| api-docs-from-behavior | Documents and publishing | Documents and PDFs | api-docs-writer | api-docs-writer / 1 | api-docs-writer / 1 | api-docs-writer / 1 | Documents and PDFs | api-docs-writer -> dev-backend-api-design -> api-versioning-strategy -> dev-documentation-systems -> dev-node-typescript-services |
| visualization-accessibility-audit | Data analytics | Data dashboards and reports | accessibility-and-inclusive-visualization | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | Data dashboards and reports | accessibility-and-inclusive-visualization -> testing-data-visualizations -> data-visualization -> visualization-strategy-and-critique -> d3-data-visualization |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| chatgpt-app-mcp-widget | openai-docs | chatgpt-apps -> building-mcp-server-on-cloudflare -> copilot-sdk -> openai-agents-js -> agents-sdk |
| netlify-frontend-deploy | frontend-testing-debugging | netlify-deploy -> dev-release-productization -> env-vars -> launch-readiness -> agent-browser-verify |
| render-python-api-deploy | monitoring-setup-guide | render-deploy -> dev-python-services -> api-docs-writer -> aspnet-core -> api-versioning-strategy |
| vercel-ai-gateway-routing | openai-docs | ai-gateway -> ai-sdk -> agents-sdk -> copilot-sdk -> openai-agents-js |
| nextjs-auth-implementation | security-best-practices | auth -> sign-in-with-vercel -> dev-backend-api-design -> aspnet-core -> dev-java-dotnet-services |
| vercel-firewall-rules | security-best-practices | vercel-firewall -> vercel-deploy -> frontend-app-builder -> figma-implement-design -> env-vars |
| core-web-vitals-audit | performance-budget | web-perf -> frontend-testing-debugging -> frontend-app-builder -> dev-frontend-accessibility-css -> dev-frontend-react-next |
| market-sizing-research | business-strategy-and-research, external-research-digests | market-sizing -> product-business-analysis -> build-report -> jupyter-notebooks -> experiment-designer |
| metric-diagnostics-shift | validate-data | metric-diagnostics -> data-analysis-standard -> product-business-analysis -> analyze-data-quality -> data-visualization |
| ab-test-design | kpi-reporting | experiment-designer -> design-kpis -> product-business-analysis -> ux-research-plan -> metric-diagnostics |
| product-business-retention | metric-diagnostics | product-business-analysis -> design-kpis -> risk-register -> user-research-synthesis -> build-dashboard |
| system-design-interview-prep | dev-backend-api-design | system-design-interview -> technical-spec-template -> dev-architecture-review -> database-schema-design -> dev-performance-engineering |

## Interpretation

On the post-tuning challenge suite, SkillWeaver V2 changes the composite output-quality score by +21.7 points versus no SkillWeaver and +14.8 points versus the skill-level baseline.
V2 changes primary selection by +27.3 percentage points versus no SkillWeaver and +18.2 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by 0.0 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
