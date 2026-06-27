# SkillWeaver V2 Clean Holdout V4 Benchmark

Generated: 2026-06-27T21:29:15.994Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782595755994,"command":"npm run benchmark:skills:clean-v4","suite":{"id":"clean-holdout-v4","label":"Clean Holdout V4","gatesAcceptance":false},"git":{"commit":"6a1a027029019b8bd2ede8be1fbb9494f82913f1","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":21,"sha256":"sha256:84a60a0837d4488dc87cddc16caac751e1f5f1a2272521bc25ac08ffdac09ce3"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:84a60a0837d4488dc87cddc16caac751e1f5f1a2272521bc25ac08ffdac09ce3","scanner":"sha256:852d05e24e5bf263977b235b2cc0bce96e1a506b2c0ff29be50c398f03036be0","benchmarkScript":"sha256:d439f2d61d46b0a914306c368c42224447b0b9a1b9b2ff702ec34b45749b1b70","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 output quality must beat no SkillWeaver.","V2 output quality must beat the skill-level baseline.","V2 expected top/workflow-5 retrieval must not regress.","V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:e1820a51d9d0068ac42ad3cb4537d45517429d24058a9ae31e259e9340848791"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v4`
- Suite: Clean Holdout V4
- Acceptance gate: no
- Git commit at generation: `6a1a027029019b8bd2ede8be1fbb9494f82913f1`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:84a60a0837d4488dc87cddc16caac751e1f5f1a2272521bc25ac08ffdac09ce3`
- Scanner hash: `sha256:852d05e24e5bf263977b235b2cc0bce96e1a506b2c0ff29be50c398f03036be0`
- Benchmark script hash: `sha256:d439f2d61d46b0a914306c368c42224447b0b9a1b9b2ff702ec34b45749b1b70`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:e1820a51d9d0068ac42ad3cb4537d45517429d24058a9ae31e259e9340848791`
- Freshness check: pass
- Quality gate, reported only: fail: V2 output quality must beat no SkillWeaver.; V2 output quality must beat the skill-level baseline.; V2 expected top/workflow-5 retrieval must not regress.; V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 21

## Suite Role

This suite is intended as untouched holdout evidence for current V2 routing. Cases include provenance fields and were frozen before any routing changes from their results. The report is non-gating so failures can expose real gaps without weakening the active acceptance suite.

## Case Provenance

- Cases with provenance fields: 21/21.
- Source mix: manual-fresh-holdout: 21.
- Suite state mix: untouched-holdout: 21.
- Promotion status mix: candidate: 21.
- Support criticality mix: primary-critical: 21.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 55.8 | 51.5 | 49.0 | -6.8 pts | -2.5 pts |
| Primary hit@1 | 42.9% | 38.1% | 33.3% | -9.5 pp | -4.8 pp |
| Expected skill in top/workflow 5 | 95.2% | 90.5% | 81.0% | -14.3 pp | -9.5 pp |
| Mean reciprocal rank | 0.625 | 0.587 | 0.537 | -0.088 | -0.050 |
| Support-skill coverage@5 | 35.7% | 32.1% | 43.7% | +7.9 pp | +11.5 pp |
| Support precision@5, exploratory | 26.2% | 24.6% | 32.1% | +6.0 pp | +7.5 pp |
| Forbidden primary rate, lower is better | 23.8% | 33.3% | 38.1% | +14.3 pp worse | +4.8 pp worse |
| Mean candidates to expected skill, lower is better | 2.4 | 2.6 | 8.0 | +5.6 candidates worse | +5.3 candidates worse |

## Claim Scope

This report is an untouched-holdout baseline for prompts captured after the latest routing-tuning commit and before any tuning from this suite. It supports a clean-split claim only while no misses from these prompts have informed routing changes: 7/21 primary hit@1, 17/21 expected primary in top/workflow five, 8/21 forbidden primaries, support coverage@5 43.7%, support precision@5 32.1%, and 20/21 support-miss cases. If this suite later drives tuning, relabel it as challenge or regression evidence before citing it again.

V2 raw counts: primary hit@1 7/21; expected primary top/workflow-five 17/21; forbidden primary 8/21; support-miss cases 20/21.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V4 quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v4 cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 2 | 58.7 | 50.0% | 100.0% | 33.3% | 25.0% | 0.0% | 2/2 | +38.9 pts | +3.7 pts |
| Backend services | 2 | 26.8 | 0.0% | 50.0% | 58.3% | 50.0% | 50.0% | 2/2 | -25.2 pts | -0.7 pts |
| Data analytics | 2 | 44.0 | 50.0% | 50.0% | 16.7% | 12.5% | 50.0% | 2/2 | -11.8 pts | -11.8 pts |
| Frontend experience | 2 | 40.6 | 50.0% | 50.0% | 0.0% | 0.0% | 50.0% | 2/2 | -19.4 pts | -15.3 pts |
| Marketing, growth, and creative | 2 | 34.2 | 0.0% | 100.0% | 33.3% | 25.0% | 0.0% | 2/2 | -2.8 pts | +7.5 pts |
| Security and risk | 2 | 55.0 | 50.0% | 50.0% | 66.7% | 50.0% | 50.0% | 2/2 | +15.0 pts | -8.3 pts |
| Communications and knowledge | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Database and data engineering | 1 | 36.7 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | +76.7 pts |
| Games and simulation | 1 | 40.0 | 0.0% | 100.0% | 50.0% | 25.0% | 100.0% | 1/1 | -40.0 pts | -40.0 pts |
| Hugging Face ML | 1 | 44.0 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | -49.3 pts | +0.7 pts |
| Infrastructure platforms | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Platform delivery | 1 | 40.0 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | +6.7 pts | +3.3 pts |
| Product, research, and planning | 1 | 36.7 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -50.0 pts | -43.3 pts |
| Skill tooling | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 2 | 58.7 | 50.0% | 100.0% | 33.3% | 25.0% | 0.0% | 2/2 | +38.9 pts | +3.7 pts |
| Backend APIs and services | 2 | 26.8 | 0.0% | 50.0% | 58.3% | 50.0% | 50.0% | 2/2 | -25.2 pts | -0.7 pts |
| Data dashboards and reports | 2 | 44.0 | 50.0% | 50.0% | 16.7% | 12.5% | 50.0% | 2/2 | -11.8 pts | -11.8 pts |
| Frontend implementation | 2 | 40.6 | 50.0% | 50.0% | 0.0% | 0.0% | 50.0% | 2/2 | -19.4 pts | -15.3 pts |
| Marketing growth | 2 | 34.2 | 0.0% | 100.0% | 33.3% | 25.0% | 0.0% | 2/2 | -2.8 pts | +7.5 pts |
| Security review | 2 | 55.0 | 50.0% | 50.0% | 66.7% | 50.0% | 50.0% | 2/2 | +15.0 pts | -8.3 pts |
| Databases and data engineering | 1 | 36.7 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | 0.0 pts | 0.0 pts |
| Deployment and release | 1 | 40.0 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | +6.7 pts | +3.3 pts |
| Documents and PDFs | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | +76.7 pts |
| Email triage | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 40.0 | 0.0% | 100.0% | 50.0% | 25.0% | 100.0% | 1/1 | -40.0 pts | -40.0 pts |
| Hugging Face ML | 1 | 44.0 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | -49.3 pts | +0.7 pts |
| Infrastructure and platforms | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Product planning | 1 | 36.7 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -50.0 pts | -43.3 pts |
| Skill authoring | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pdf-chart-data-extract-v4 | Data analytics | Data dashboards and reports | chart-data-extractor | pdf / 4 | Spreadsheets !Spreadsheets / 4 | Spreadsheets !Spreadsheets / 15 | Data dashboards and reports | Spreadsheets -> pdf -> reports-pdfs-and-slide-automation -> documents -> resume-cover-letter-tailor |
| spreadsheet-model-audit-no-dashboard-v4 | Data analytics | Data dashboards and reports | Spreadsheets | Spreadsheets / 1 | Spreadsheets / 1 | Spreadsheets / 1 | Data dashboards and reports | Spreadsheets -> skill-security-auditor -> security-threat-model -> threat-model -> dependency-audit |
| notion-spec-to-ticket-plan-v4 | Product, research, and planning | Product planning | notion-spec-to-implementation | notion-spec-to-implementation / 1 | notion-spec-to-implementation / 1 | notion-meeting-intelligence !notion-meeting-intelligence / 2 | Product planning | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-knowledge-capture -> notion-research-documentation -> product-business-analysis |
| gmail-draft-review-safety-v4 | Communications and knowledge | Email triage | gmail, gmail-inbox-triage | gmail / 1 | gmail / 1 | gmail / 1 | Email triage | gmail -> gmail-inbox-triage -> email-triage -> track-findings -> code-review |
| vercel-queues-worker-v4 | Platform delivery | Deployment and release | vercel-queues | vercel-functions / 3 | vercel-functions / 2 | cron-jobs !cron-jobs / 3 | Deployment and release | cron-jobs -> vercel-functions -> vercel-queues -> workflow -> gmail-inbox-triage |
| sign-in-with-vercel-enterprise-v4 | Backend services | Backend APIs and services | sign-in-with-vercel | sign-in-with-vercel / 1 | auth !auth / 4 | auth !auth / 2 | Backend APIs and services | auth -> sign-in-with-vercel -> dev-backend-api-design -> vercel-api -> env-vars |
| go-rust-cli-packaging-v4 | Backend services | Backend APIs and services | dev-go-rust-systems | dev-java-dotnet-services !dev-java-dotnet-services / 5 | dev-java-dotnet-services !dev-java-dotnet-services / 4 | cli-creator / 92 | Skill authoring | cli-creator -> dev-java-dotnet-services -> dev-node-typescript-services -> dev-python-services -> dev-release-productization |
| framer-code-component-props-v4 | Frontend experience | Frontend implementation | framer-code-components | figma-code-connect !figma-code-connect / 3 | figma-code-connect-components !figma-code-connect / 4 | figma-code-connect-components !figma-code-connect / 18 | Figma design handoff | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-use-motion -> figma-component-audit |
| secure-sdlc-controls-v4 | Security and risk | Security review | dev-security-engineering | figma-design-review / 3 | dev-security-engineering / 1 | dev-security-engineering / 1 | Security review | dev-security-engineering -> security-threat-model -> dependency-audit -> security-best-practices -> deep-security-scan |
| finding-discovery-before-triage-v4 | Security and risk | Security review | finding-discovery | triage-finding !triage-finding / 3 | triage-finding !triage-finding / 3 | triage-finding !triage-finding / 6 | Security review | triage-finding -> validation -> security-diff-scan -> track-findings -> skill-security-auditor |
| hf-paper-publisher-no-training-v4 | Hugging Face ML | Hugging Face ML | huggingface-paper-publisher | huggingface-paper-publisher / 1 | huggingface-papers / 2 | huggingface-datasets / 5 | Hugging Face ML | huggingface-datasets -> huggingface-community-evals -> huggingface-papers -> hf-cli -> huggingface-paper-publisher |
| transformers-js-browser-model-v4 | AI agent apps | Agent and LLM apps | transformers-js | control-in-app-browser / 2 | transformers-js / 1 | transformers-js / 1 | Skill ranking anchor | transformers-js -> agent-browser-verify -> hf-cli -> huggingface-gradio -> agent-browser |
| creative-shot-vs-offer-v4 | Marketing, growth, and creative | Marketing growth | creative-shot | scene-explorer / 5 | creative-production / 6 | creative-production / 4 | Marketing growth | creative-production -> creative-offer -> creative-ads-explorer -> creative-shot -> ads-explorer |
| docbridge-saas-copy-v4 | Marketing, growth, and creative | Marketing growth | docbridge-saas-copywriter | premium-saas-landing-pages / 2 | premium-saas-landing-pages / 2 | premium-saas-landing-pages / 2 | Skill ranking anchor | premium-saas-landing-pages -> docbridge-saas-copywriter -> figma-generate-design -> documents -> speech |
| autovise-mobility-label-v4 | Frontend experience | Frontend implementation | autovise-premium-mobility-style | autovise-premium-mobility-style / 1 | autovise-premium-mobility-style / 1 | autovise-premium-mobility-style / 1 | Skill ranking anchor | autovise-premium-mobility-style -> skill-creator -> plugin-creator -> template-creator -> cli-creator |
| racingsim-map-runtime-v4 | Games and simulation | Game development | racingsim-game-dev | racingsim-game-dev / 1 | racingsim-game-dev / 1 | racingsim-ai-ml !racingsim-ai-ml / 2 | Game development | racingsim-ai-ml -> racingsim-game-dev -> game-playtest -> three-webgl-game -> roadmap-presentation |
| capacity-slo-load-boundary-v4 | Infrastructure platforms | Infrastructure and platforms | capacity-planning | load-testing-plan / 2 | load-testing-plan / 2 | dev-observability-sre / 2 | Observability and reliability | dev-observability-sre -> capacity-planning -> slo-error-budget -> monitoring-setup-guide -> dev-containers-kubernetes |
| schema-design-before-supabase-v4 | Database and data engineering | Databases and data engineering | database-schema-design | supabase-postgres-best-practices !supabase-postgres-best-practices / 2 | supabase-postgres-best-practices !supabase-postgres-best-practices / 2 | supabase-postgres-best-practices !supabase-postgres-best-practices / 2 | Skill ranking anchor | supabase-postgres-best-practices -> database-schema-design -> dev-database-postgres -> dev-architecture-review -> uml-and-software-architecture-visualization |
| latex-class-bibliography-v4 | Documents and publishing | Documents and PDFs | latex-doctor | latex-doctor / 1 | reports-pdfs-and-slide-automation / 6 | latex-doctor / 1 | Documents and PDFs | latex-doctor -> reports-pdfs-and-slide-automation -> figma-use-slides -> Presentations -> roadmap-presentation |
| skill-pack-install-no-author-v4 | Skill tooling | Skill authoring | skill-installer | skill-installer / 1 | skill-installer / 1 | skill-installer / 1 | Skill authoring | skill-installer -> skill-security-auditor -> skillweaver -> hatch-pet -> migrate-to-codex |
| openai-docs-api-migration-v4 | AI agent apps | Agent and LLM apps | openai-docs | chatgpt-apps !chatgpt-apps / 7 | chatgpt-apps !chatgpt-apps / 6 | api-docs-writer / 5 | Agent and LLM apps | api-docs-writer -> chatgpt-apps -> copilot-sdk -> openai-agents-js -> openai-docs |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| pdf-chart-data-extract-v4 | data-visualization, build-report | Spreadsheets -> pdf -> reports-pdfs-and-slide-automation -> documents -> resume-cover-letter-tailor |
| spreadsheet-model-audit-no-dashboard-v4 | data-analysis-standard, analyze-data-quality, chart-data-extractor | Spreadsheets -> skill-security-auditor -> security-threat-model -> threat-model -> dependency-audit |
| notion-spec-to-ticket-plan-v4 | prd-template, linear | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-knowledge-capture -> notion-research-documentation -> product-business-analysis |
| gmail-draft-review-safety-v4 | notion-knowledge-capture | gmail -> gmail-inbox-triage -> email-triage -> track-findings -> code-review |
| vercel-queues-worker-v4 | env-vars | cron-jobs -> vercel-functions -> vercel-queues -> workflow -> gmail-inbox-triage |
| sign-in-with-vercel-enterprise-v4 | vercel-deploy, security-best-practices | auth -> sign-in-with-vercel -> dev-backend-api-design -> vercel-api -> env-vars |
| go-rust-cli-packaging-v4 | dev-testing-qa | cli-creator -> dev-java-dotnet-services -> dev-node-typescript-services -> dev-python-services -> dev-release-productization |
| framer-code-component-props-v4 | framer, dev-frontend-react-next, design-qa | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-use-motion -> figma-component-audit |
| secure-sdlc-controls-v4 | security-ownership-map | dev-security-engineering -> security-threat-model -> dependency-audit -> security-best-practices -> deep-security-scan |
| finding-discovery-before-triage-v4 | security-scan | triage-finding -> validation -> security-diff-scan -> track-findings -> skill-security-auditor |
| transformers-js-browser-model-v4 | dev-frontend-react-next, frontend-testing-debugging, huggingface-datasets | transformers-js -> agent-browser-verify -> hf-cli -> huggingface-gradio -> agent-browser |
| creative-shot-vs-offer-v4 | creative-scene, creative-moodboard | creative-production -> creative-offer -> creative-ads-explorer -> creative-shot -> ads-explorer |
| docbridge-saas-copy-v4 | premium-web-design, marketing-strategy-and-growth | premium-saas-landing-pages -> docbridge-saas-copywriter -> figma-generate-design -> documents -> speech |
| autovise-mobility-label-v4 | premium-web-design, dev-frontend-react-next, launch-readiness | autovise-premium-mobility-style -> skill-creator -> plugin-creator -> template-creator -> cli-creator |
| racingsim-map-runtime-v4 | dev-performance-engineering | racingsim-ai-ml -> racingsim-game-dev -> game-playtest -> three-webgl-game -> roadmap-presentation |
| capacity-slo-load-boundary-v4 | load-testing-plan | dev-observability-sre -> capacity-planning -> slo-error-budget -> monitoring-setup-guide -> dev-containers-kubernetes |
| schema-design-before-supabase-v4 | database-migration-plan, data-pipeline-spec | supabase-postgres-best-practices -> database-schema-design -> dev-database-postgres -> dev-architecture-review -> uml-and-software-architecture-visualization |
| latex-class-bibliography-v4 | latex-compile, documents | latex-doctor -> reports-pdfs-and-slide-automation -> figma-use-slides -> Presentations -> roadmap-presentation |
| skill-pack-install-no-author-v4 | dev-documentation-systems | skill-installer -> skill-security-auditor -> skillweaver -> hatch-pet -> migrate-to-codex |
| openai-docs-api-migration-v4 | dev-ai-llm-apps | api-docs-writer -> chatgpt-apps -> copilot-sdk -> openai-agents-js -> openai-docs |

## Interpretation

On the untouched holdout suite, SkillWeaver V2 changes the composite output-quality score by -6.8 points versus no SkillWeaver and -2.5 points versus the skill-level baseline.
V2 changes primary selection by -9.5 percentage points versus no SkillWeaver and -4.8 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by -14.3 percentage points versus no SkillWeaver and -9.5 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
