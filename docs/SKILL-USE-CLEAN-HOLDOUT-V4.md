# SkillWeaver V2 Clean Holdout V4 Regression Benchmark

Generated: 2026-07-07T06:38:06.532Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783406286532,"command":"npm run benchmark:skills:clean-v4","suite":{"id":"clean-holdout-v4","label":"Clean Holdout V4 Regression","gatesAcceptance":false},"git":{"commit":"c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784","dirty":true,"dirtyPaths":["docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-CLEAN-HOLDOUT-V3.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md"]},"invalidatingDirtyPaths":[],"cases":{"count":21,"sha256":"sha256:9caa171208db06561784dd81829395ea89d2390cb7df3acdc4665815fd3d609c"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"inputs":{"cases":"sha256:9caa171208db06561784dd81829395ea89d2390cb7df3acdc4665815fd3d609c","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:4f230da96cf55cf549a1be11fe4e6d33ca737febf36d9c95b6635b304bec9be0"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v4`
- Suite: Clean Holdout V4 Regression
- Acceptance gate: no
- Git commit at generation: `c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784`
- Git dirty: yes
- Invalidating dirty paths: none
- Case hash: `sha256:9caa171208db06561784dd81829395ea89d2390cb7df3acdc4665815fd3d609c`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f`
- Snapshot fingerprint: `sha256:4f230da96cf55cf549a1be11fe4e6d33ca737febf36d9c95b6635b304bec9be0`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
- Benchmark cases: 21

## Suite Role

This suite began as the clean holdout V4 baseline, then its misses informed this routing pass. Treat the current checked-in report as non-gating regression evidence for that prompt set. The pre-tuning V4 baseline remains preserved in git history at `77d4c73`; a new clean holdout claim requires a fresh prompt set captured after these routing changes and reported before tuning from it.

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
| Output quality score (0-100) | 55.8 | 51.5 | 92.7 | +36.9 pts | +41.2 pts |
| Primary hit@1 | 42.9% | 38.1% | 100.0% | +57.1 pp | +61.9 pp |
| Expected skill in top/workflow 5 | 95.2% | 90.5% | 100.0% | +4.8 pp | +9.5 pp |
| Mean reciprocal rank | 0.625 | 0.587 | 1.000 | +0.375 | +0.413 |
| Support-skill coverage@5 | 35.7% | 32.1% | 63.5% | +27.8 pp | +31.3 pp |
| Support precision@5, exploratory | 26.2% | 24.6% | 46.4% | +20.2 pp | +21.8 pp |
| Forbidden primary rate, lower is better | 23.8% | 33.3% | 0.0% | -23.8 pp better | -33.3 pp better |
| Confusable wrong primary rate, lower is better | 52.4% | 52.4% | 0.0% | -52.4 pp better | -52.4 pp better |
| Mean candidates to expected skill, lower is better | 2.4 | 2.6 | 1.0 | -1.4 candidates better | -1.6 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V4 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 21/21 primary hit@1, 21/21 expected primary in top/workflow five, 0/21 forbidden primaries, support coverage@5 63.5%, support precision@5 46.4%, and 13/21 support-miss cases. The pre-tuning clean V4 baseline is preserved in git history at `77d4c73`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 21/21; expected primary top/workflow-five 21/21; forbidden primary 0/21; confusable wrong primary 0/21; support-miss cases 13/21.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V4 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v4 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +66.9 pts | +31.7 pts |
| Backend services | 2 | 91.7 | 100.0% | 100.0% | 58.3% | 50.0% | 0.0% | 0.0% | 2/2 | +39.7 pts | +64.2 pts |
| Data analytics | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +30.8 pts | +30.8 pts |
| Frontend experience | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 0.0% | 1/2 | +30.0 pts | +34.2 pts |
| Marketing, growth, and creative | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +49.7 pts | +60.0 pts |
| Security and risk | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 62.5% | 0.0% | 0.0% | 1/2 | +56.7 pts | +33.3 pts |
| Communications and knowledge | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Database and data engineering | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +63.3 pts | +63.3 pts |
| Documents and publishing | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | +76.7 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | +56.7 pts |
| Infrastructure platforms | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +50.0 pts | +50.0 pts |
| Platform delivery | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +66.7 pts | +63.3 pts |
| Product, research, and planning | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +13.3 pts | +20.0 pts |
| Skill tooling | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +66.9 pts | +31.7 pts |
| Backend APIs and services | 2 | 91.7 | 100.0% | 100.0% | 58.3% | 50.0% | 0.0% | 0.0% | 2/2 | +39.7 pts | +64.2 pts |
| Data dashboards and reports | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +30.8 pts | +30.8 pts |
| Frontend implementation | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 0.0% | 1/2 | +30.0 pts | +34.2 pts |
| Marketing growth | 2 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 2/2 | +49.7 pts | +60.0 pts |
| Security review | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 62.5% | 0.0% | 0.0% | 1/2 | +56.7 pts | +33.3 pts |
| Databases and data engineering | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +63.3 pts | +63.3 pts |
| Deployment and release | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +66.7 pts | +63.3 pts |
| Documents and PDFs | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | +76.7 pts |
| Email triage | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | +56.7 pts |
| Infrastructure and platforms | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +50.0 pts | +50.0 pts |
| Product planning | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +13.3 pts | +20.0 pts |
| Skill authoring | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pdf-chart-data-extract-v4 | Data analytics | Data dashboards and reports | chart-data-extractor | pdf / 4 | Spreadsheets !Spreadsheets / 4 | chart-data-extractor / 1 | Data dashboards and reports | chart-data-extractor -> pdf -> Spreadsheets -> documents -> build-report |
| spreadsheet-model-audit-no-dashboard-v4 | Data analytics | Data dashboards and reports | Spreadsheets | Spreadsheets / 1 | Spreadsheets / 1 | Spreadsheets / 1 | Data dashboards and reports | Spreadsheets -> skill-security-auditor -> security-threat-model -> threat-model -> dependency-audit |
| notion-spec-to-ticket-plan-v4 | Product, research, and planning | Product planning | notion-spec-to-implementation | notion-spec-to-implementation / 1 | notion-spec-to-implementation / 1 | notion-spec-to-implementation / 1 | Product planning | notion-spec-to-implementation -> notion-knowledge-capture -> notion-research-documentation -> prd-template -> linear |
| gmail-draft-review-safety-v4 | Communications and knowledge | Email triage | gmail, gmail-inbox-triage | gmail / 1 | gmail / 1 | gmail / 1 | Email triage | gmail -> gmail-inbox-triage -> email-triage -> track-findings -> code-review |
| vercel-queues-worker-v4 | Platform delivery | Deployment and release | vercel-queues | vercel-functions / 3 | vercel-functions / 2 | vercel-queues / 1 | Deployment and release | vercel-queues -> cron-jobs -> vercel-functions -> workflow -> env-vars |
| sign-in-with-vercel-enterprise-v4 | Backend services | Backend APIs and services | sign-in-with-vercel | sign-in-with-vercel / 1 | auth !auth / 4 | sign-in-with-vercel / 1 | Backend APIs and services | sign-in-with-vercel -> auth -> dev-backend-api-design -> env-vars -> monitoring-setup-guide |
| go-rust-cli-packaging-v4 | Backend services | Backend APIs and services | dev-go-rust-systems | dev-java-dotnet-services !dev-java-dotnet-services / 5 | dev-java-dotnet-services !dev-java-dotnet-services / 4 | dev-go-rust-systems / 1 | Backend APIs and services | dev-go-rust-systems -> dev-testing-qa -> dev-release-productization -> dev-backend-api-design -> vercel-services |
| framer-code-component-props-v4 | Frontend experience | Frontend implementation | framer-code-components | figma-code-connect !figma-code-connect / 3 | figma-code-connect-components !figma-code-connect / 4 | framer-code-components / 1 | Frontend implementation | framer-code-components -> figma-code-connect-components -> figma-code-connect -> dev-frontend-react-next -> figma-design-qa |
| secure-sdlc-controls-v4 | Security and risk | Security review | dev-security-engineering | figma-design-review / 3 | dev-security-engineering / 1 | dev-security-engineering / 1 | Security review | dev-security-engineering -> security-threat-model -> dependency-audit -> security-best-practices -> deep-security-scan |
| finding-discovery-before-triage-v4 | Security and risk | Security review | finding-discovery | triage-finding !triage-finding / 3 | triage-finding !triage-finding / 3 | finding-discovery / 1 | Security review | finding-discovery -> validation -> security-diff-scan -> deep-security-scan -> triage-finding |
| hf-paper-publisher-no-training-v4 | Hugging Face ML | Hugging Face ML | huggingface-paper-publisher | huggingface-paper-publisher / 1 | huggingface-papers / 2 | huggingface-paper-publisher / 1 | Hugging Face ML | huggingface-paper-publisher -> huggingface-datasets -> huggingface-community-evals -> hf-cli -> huggingface-papers |
| transformers-js-browser-model-v4 | AI agent apps | Agent and LLM apps | transformers-js | control-in-app-browser / 2 | transformers-js / 1 | transformers-js / 1 | Skill ranking anchor | transformers-js -> agent-browser-verify -> hf-cli -> huggingface-gradio -> huggingface-community-evals |
| creative-shot-vs-offer-v4 | Marketing, growth, and creative | Marketing growth | creative-shot | scene-explorer / 5 | creative-production / 6 | creative-shot / 1 | Marketing growth | creative-shot -> creative-production -> creative-offer -> shot-explorer -> explore |
| docbridge-saas-copy-v4 | Marketing, growth, and creative | Marketing growth | docbridge-saas-copywriter | premium-saas-landing-pages / 2 | premium-saas-landing-pages / 2 | docbridge-saas-copywriter / 1 | Marketing growth | docbridge-saas-copywriter -> premium-saas-landing-pages -> creative-ads-explorer -> saas-motion-systems -> visualization-strategy-and-critique |
| autovise-mobility-label-v4 | Frontend experience | Frontend implementation | autovise-premium-mobility-style | autovise-premium-mobility-style / 1 | autovise-premium-mobility-style / 1 | autovise-premium-mobility-style / 1 | Skill ranking anchor | autovise-premium-mobility-style -> skill-creator -> plugin-creator -> template-creator -> cli-creator |
| racingsim-map-runtime-v4 | Games and simulation | Game development | racingsim-game-dev | racingsim-game-dev / 1 | racingsim-game-dev / 1 | racingsim-game-dev / 1 | Game development | racingsim-game-dev -> game-playtest -> dev-performance-engineering -> three-webgl-game -> roadmap-presentation |
| capacity-slo-load-boundary-v4 | Infrastructure platforms | Infrastructure and platforms | capacity-planning | load-testing-plan / 2 | load-testing-plan / 2 | capacity-planning / 1 | Infrastructure and platforms | capacity-planning -> slo-error-budget -> dev-containers-kubernetes -> load-testing-plan -> dev-performance-engineering |
| schema-design-before-supabase-v4 | Database and data engineering | Databases and data engineering | database-schema-design | supabase-postgres-best-practices !supabase-postgres-best-practices / 2 | supabase-postgres-best-practices !supabase-postgres-best-practices / 2 | database-schema-design / 1 | Databases and data engineering | database-schema-design -> dev-database-postgres -> supabase-postgres-best-practices -> database-migration-plan -> data-pipeline-spec |
| latex-class-bibliography-v4 | Documents and publishing | Documents and PDFs | latex-doctor | latex-doctor / 1 | reports-pdfs-and-slide-automation / 6 | latex-doctor / 1 | Documents and PDFs | latex-doctor -> reports-pdfs-and-slide-automation -> figma-use-slides -> Presentations -> roadmap-presentation |
| skill-pack-install-no-author-v4 | Skill tooling | Skill authoring | skill-installer | skill-installer / 1 | skill-installer / 1 | skill-installer / 1 | Skill authoring | skill-installer -> skill-security-auditor -> skillweaver -> hatch-pet -> migrate-to-codex |
| openai-docs-api-migration-v4 | AI agent apps | Agent and LLM apps | openai-docs | chatgpt-apps !chatgpt-apps / 7 | chatgpt-apps !chatgpt-apps / 6 | openai-docs / 1 | Agent and LLM apps | openai-docs -> openai-agents-js -> dev-ai-llm-apps -> copilot-sdk -> ai-sdk |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| pdf-chart-data-extract-v4 | data-visualization | chart-data-extractor -> pdf -> Spreadsheets -> documents -> build-report |
| spreadsheet-model-audit-no-dashboard-v4 | data-analysis-standard, analyze-data-quality, chart-data-extractor | Spreadsheets -> skill-security-auditor -> security-threat-model -> threat-model -> dependency-audit |
| gmail-draft-review-safety-v4 | notion-knowledge-capture | gmail -> gmail-inbox-triage -> email-triage -> track-findings -> code-review |
| sign-in-with-vercel-enterprise-v4 | vercel-deploy, security-best-practices | sign-in-with-vercel -> auth -> dev-backend-api-design -> env-vars -> monitoring-setup-guide |
| go-rust-cli-packaging-v4 | cli-creator | dev-go-rust-systems -> dev-testing-qa -> dev-release-productization -> dev-backend-api-design -> vercel-services |
| secure-sdlc-controls-v4 | security-ownership-map | dev-security-engineering -> security-threat-model -> dependency-audit -> security-best-practices -> deep-security-scan |
| transformers-js-browser-model-v4 | dev-frontend-react-next, frontend-testing-debugging, huggingface-datasets | transformers-js -> agent-browser-verify -> hf-cli -> huggingface-gradio -> huggingface-community-evals |
| creative-shot-vs-offer-v4 | creative-scene, creative-moodboard | creative-shot -> creative-production -> creative-offer -> shot-explorer -> explore |
| docbridge-saas-copy-v4 | creative-positioning, kpi-reporting | docbridge-saas-copywriter -> premium-saas-landing-pages -> creative-ads-explorer -> saas-motion-systems -> visualization-strategy-and-critique |
| autovise-mobility-label-v4 | premium-saas-landing-pages, dev-frontend-react-next, launch-readiness | autovise-premium-mobility-style -> skill-creator -> plugin-creator -> template-creator -> cli-creator |
| latex-class-bibliography-v4 | latex-compile, documents | latex-doctor -> reports-pdfs-and-slide-automation -> figma-use-slides -> Presentations -> roadmap-presentation |
| skill-pack-install-no-author-v4 | dev-documentation-systems | skill-installer -> skill-security-auditor -> skillweaver -> hatch-pet -> migrate-to-codex |
| openai-docs-api-migration-v4 | api-docs-writer | openai-docs -> openai-agents-js -> dev-ai-llm-apps -> copilot-sdk -> ai-sdk |

## Interpretation

On the clean holdout V4 regression suite, SkillWeaver V2 changes the composite output-quality score by +36.9 points versus no SkillWeaver and +41.2 points versus the skill-level baseline.
V2 changes primary selection by +57.1 percentage points versus no SkillWeaver and +61.9 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +4.8 percentage points versus no SkillWeaver and +9.5 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
