# SkillWeaver V2 Clean Holdout V5 Benchmark

Generated: 2026-06-27T21:48:53.664Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782596933664,"command":"npm run benchmark:skills:clean-v5","suite":{"id":"clean-holdout-v5","label":"Clean Holdout V5","gatesAcceptance":false},"git":{"commit":"c090354bfdcceaa8f2a38e8bdb3b40a3d2d8b614","dirty":true,"dirtyPaths":["benchmarks/skill-routing-clean-holdout-v5.json","package.json","scripts/benchmark-skill-routing.mjs"]},"invalidatingDirtyPaths":["benchmarks/skill-routing-clean-holdout-v5.json","package.json","scripts/benchmark-skill-routing.mjs"],"cases":{"count":17,"sha256":"sha256:6fc72ba22ba7db6252c9ac6e94823dd3505efcf48e14205b156853697de5be97"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:6fc72ba22ba7db6252c9ac6e94823dd3505efcf48e14205b156853697de5be97","scanner":"sha256:3f665e09224c180a9432d3a2afae2e33a59b2b7bc556c908e728086b4ef9a56a","benchmarkScript":"sha256:6f65ac72d01742f16e3e68eb42b0fd2a38dcf530b2ac658b08dd6678d6cd5593","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 output quality must beat no SkillWeaver.","V2 output quality must beat the skill-level baseline.","V2 expected top/workflow-5 retrieval must not regress.","V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:e4039d7c32029b7d655371b89a7de4e0cfed8570464c5aa47deb43dc723455ea"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v5`
- Suite: Clean Holdout V5
- Acceptance gate: no
- Git commit at generation: `c090354bfdcceaa8f2a38e8bdb3b40a3d2d8b614`
- Git dirty: yes
- Invalidating dirty paths: `benchmarks/skill-routing-clean-holdout-v5.json`, `package.json`, `scripts/benchmark-skill-routing.mjs`
- Case hash: `sha256:6fc72ba22ba7db6252c9ac6e94823dd3505efcf48e14205b156853697de5be97`
- Scanner hash: `sha256:3f665e09224c180a9432d3a2afae2e33a59b2b7bc556c908e728086b4ef9a56a`
- Benchmark script hash: `sha256:6f65ac72d01742f16e3e68eb42b0fd2a38dcf530b2ac658b08dd6678d6cd5593`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:e4039d7c32029b7d655371b89a7de4e0cfed8570464c5aa47deb43dc723455ea`
- Freshness check: pass
- Quality gate, reported only: fail: V2 output quality must beat no SkillWeaver.; V2 output quality must beat the skill-level baseline.; V2 expected top/workflow-5 retrieval must not regress.; V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 17

## Suite Role

This suite is intended as untouched holdout evidence for current V2 routing. Cases include provenance fields and were frozen before any routing changes from their results. The report is non-gating so failures can expose real gaps without weakening the active acceptance suite.

## Case Provenance

- Cases with provenance fields: 17/17.
- Source mix: subagent-audit: 17.
- Suite state mix: untouched-holdout: 17.
- Promotion status mix: candidate: 17.
- Support criticality mix: primary-critical: 17.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 59.3 | 55.1 | 42.8 | -16.5 pts | -12.3 pts |
| Primary hit@1 | 52.9% | 41.2% | 23.5% | -29.4 pp | -17.6 pp |
| Expected skill in top/workflow 5 | 94.1% | 94.1% | 82.4% | -11.8 pp | -11.8 pp |
| Mean reciprocal rank | 0.689 | 0.635 | 0.472 | -0.217 | -0.163 |
| Support-skill coverage@5 | 27.5% | 35.3% | 37.3% | +9.8 pp | +2.0 pp |
| Support precision@5, exploratory | 20.6% | 26.5% | 27.9% | +7.4 pp | +1.5 pp |
| Forbidden primary rate, lower is better | 29.4% | 47.1% | 58.8% | +29.4 pp worse | +11.8 pp worse |
| Mean candidates to expected skill, lower is better | 2.4 | 2.4 | 4.4 | +2.0 candidates worse | +1.9 candidates worse |

## Claim Scope

This report is an untouched-holdout baseline for prompts captured after the latest routing-tuning commit and before any tuning from this suite. It supports a clean-split claim only while no misses from these prompts have informed routing changes: 4/17 primary hit@1, 14/17 expected primary in top/workflow five, 10/17 forbidden primaries, support coverage@5 37.3%, support precision@5 27.9%, and 16/17 support-miss cases. If this suite later drives tuning, relabel it as challenge or regression evidence before citing it again.

V2 raw counts: primary hit@1 4/17; expected primary top/workflow-five 14/17; forbidden primary 10/17; support-miss cases 16/17.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V5 quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v5 cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 4 | 25.7 | 0.0% | 75.0% | 25.0% | 18.8% | 75.0% | 4/4 | -46.8 pts | -32.0 pts |
| Frontend experience | 3 | 44.9 | 33.3% | 66.7% | 44.4% | 33.3% | 66.7% | 3/3 | -3.5 pts | -9.6 pts |
| Security and risk | 2 | 65.0 | 50.0% | 100.0% | 50.0% | 37.5% | 50.0% | 2/2 | +20.7 pts | +17.3 pts |
| Backend services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +56.7 pts |
| Data analytics | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.0 pts | 0.0 pts |
| Database and data engineering | 1 | 3.3 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 1/1 | -83.3 pts | -83.3 pts |
| Documents and publishing | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -46.7 pts | +3.3 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +13.3 pts |
| Hugging Face ML | 1 | 26.7 | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 1/1 | -60.0 pts | -13.3 pts |
| Product, research, and planning | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -3.3 pts | -53.3 pts |
| Repo collaboration | 1 | 26.7 | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 1/1 | -10.0 pts | -10.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 3 | 23.7 | 0.0% | 66.7% | 22.2% | 16.7% | 66.7% | 3/3 | -44.1 pts | -24.3 pts |
| Security review | 2 | 65.0 | 50.0% | 100.0% | 50.0% | 37.5% | 50.0% | 2/2 | +20.7 pts | +17.3 pts |
| Backend APIs and services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +56.7 pts |
| Browser verification | 1 | 40.0 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | +6.7 pts | 0.0 pts |
| Cloudflare workers | 1 | 31.7 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -55.0 pts | -55.0 pts |
| Data dashboards and reports | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.0 pts | 0.0 pts |
| Databases and data engineering | 1 | 3.3 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 1/1 | -83.3 pts | -83.3 pts |
| Figma design handoff | 1 | 7.9 | 0.0% | 0.0% | 33.3% | 25.0% | 100.0% | 1/1 | -17.1 pts | -28.8 pts |
| Frontend implementation | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +13.3 pts |
| Hugging Face ML | 1 | 26.7 | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 1/1 | -60.0 pts | -13.3 pts |
| Presentations | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -46.7 pts | +3.3 pts |
| Product planning | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 100.0% | 1/1 | -3.3 pts | -53.3 pts |
| Repository operations | 1 | 26.7 | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 1/1 | -10.0 pts | -10.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-elements-chat-surface-v5 | AI agent apps | Agent and LLM apps | ai-elements | ai-elements / 1 | openai-agents-js !openai-agents-js / 5 | dev-ai-llm-apps / 20 | Agent and LLM apps | dev-ai-llm-apps -> openai-agents-js -> chatgpt-apps -> ai-sdk -> building-ai-agent-on-cloudflare |
| ai-generation-persistence-resume-v5 | AI agent apps | Agent and LLM apps | ai-generation-persistence | vercel-storage !vercel-storage / 2 | vercel-storage !vercel-storage / 3 | vercel-storage !vercel-storage / 3 | Skill ranking anchor | vercel-storage -> database-schema-design -> ai-generation-persistence -> dev-database-postgres -> database-migration-plan |
| cloudflare-agent-state-v5 | AI agent apps | Cloudflare workers | agents-sdk, building-ai-agent-on-cloudflare | agents-sdk / 1 | agents-sdk / 1 | openai-agents-js !openai-agents-js / 4 | Cloudflare workers | openai-agents-js -> agent-browser-verify -> durable-objects -> agents-sdk -> building-ai-agent-on-cloudflare |
| screenshot-bug-evidence-v5 | Frontend experience | Browser verification | screenshot | control-in-app-browser / 3 | design-image-to-code !design-image-to-code / 3 | design-image-to-code !design-image-to-code / 3 | Browser verification | design-image-to-code -> frontend-testing-debugging -> screenshot -> playwright -> playwright-interactive |
| figma-annotation-review-v5 | Frontend experience | Figma design handoff | figma-annotation-guide | figma-code-connect !figma-code-connect / 4 | figma-code-connect-components !figma-code-connect / 2 | figma-code-connect-components !figma-code-connect / 16 | Figma design handoff | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-use-motion -> dev-frontend-react-next |
| product-design-audit-no-build-v5 | Frontend experience | Frontend implementation | design-audit | audit / 1 | audit / 1 | audit / 1 | Skill ranking anchor | audit -> design-qa -> design-audit -> product-design -> dev-frontend-accessibility-css |
| geospatial-map-report-v5 | Data analytics | Data dashboards and reports | geospatial-and-cartographic-visualization | data-visualization / 5 | data-visualization / 2 | data-visualization / 2 | Skill ranking anchor | data-visualization -> geospatial-and-cartographic-visualization -> uml-and-software-architecture-visualization -> database-schema-design -> dev-database-postgres |
| event-table-quality-contract-v5 | Database and data engineering | Databases and data engineering | data-quality-audit | data-quality-audit / 1 | data-quality-audit / 1 | database-schema-design / 6 | Databases and data engineering | database-schema-design -> dev-database-postgres -> database-migration-plan -> dev-architecture-review -> dependency-audit |
| security-validation-after-fix-v5 | Security and risk | Security review | validation | track-findings / 10 | triage-finding !triage-finding / 10 | finding-discovery !finding-discovery / 2 | Security review | finding-discovery -> validation -> security-diff-scan -> triage-finding -> deep-security-scan |
| hf-jobs-gpu-run-v5 | Hugging Face ML | Hugging Face ML | huggingface-jobs | huggingface-jobs / 1 | huggingface-vision-trainer / 3 | huggingface-datasets !huggingface-datasets / 3 | Hugging Face ML | huggingface-datasets -> huggingface-community-evals -> huggingface-jobs -> huggingface-gradio -> huggingface-vision-trainer |
| tts-voiceover-not-transcription-v5 | AI agent apps | Agent and LLM apps | speech | speech / 1 | speech / 1 | transcribe !transcribe / 2 | Agent and LLM apps | transcribe -> speech -> transformers-js -> openai-agents-js -> copilot-sdk |
| vercel-firewall-observability-v5 | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> security-best-practices -> monitoring-setup-guide -> deep-security-scan -> skill-security-auditor |
| stripe-webhook-reconciliation-v5 | Backend services | Backend APIs and services | stripe-best-practices | payments !payments / 3 | payments !payments / 2 | stripe-best-practices / 1 | Backend APIs and services | stripe-best-practices -> auth -> dev-backend-api-design -> payments -> dev-node-typescript-services |
| r3f-scene-not-data-viz-v5 | Games and simulation | Game development | react-three-fiber-game | react-three-fiber-game / 1 | react-three-fiber-game / 1 | react-three-fiber-game / 1 | Game development | react-three-fiber-game -> three-webgl-game -> game-playtest -> frontend-app-builder -> web-3d-asset-pipeline |
| technical-debt-register-no-upgrade-v5 | Repo collaboration | Repository operations | technical-debt-register | dependency-conflict-resolver !dependency-conflict-resolver / 2 | dependency-conflict-resolver !dependency-conflict-resolver / 2 | dependency-conflict-resolver !dependency-conflict-resolver / 3 | Repository operations | dependency-conflict-resolver -> dev-dependency-maintenance -> technical-debt-register -> dev-security-engineering -> risk-register |
| presentation-template-pack-v5 | Documents and publishing | Presentations | template-creator | template-creator / 1 | roadmap-presentation !roadmap-presentation / 2 | roadmap-presentation !roadmap-presentation / 3 | Presentations | roadmap-presentation -> Presentations -> template-creator -> roadmap-narrative -> reports-pdfs-and-slide-automation |
| notion-research-source-bank-v5 | Product, research, and planning | Product planning | notion-research-documentation | notion-spec-to-implementation !notion-spec-to-implementation / 2 | notion-research-documentation / 1 | notion-meeting-intelligence !notion-meeting-intelligence / 3 | Product planning | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-research-documentation -> notion-knowledge-capture -> ux-research-plan |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| ai-elements-chat-surface-v5 | dev-frontend-react-next, frontend-testing-debugging | dev-ai-llm-apps -> openai-agents-js -> chatgpt-apps -> ai-sdk -> building-ai-agent-on-cloudflare |
| ai-generation-persistence-resume-v5 | ai-sdk, dev-node-typescript-services | vercel-storage -> database-schema-design -> ai-generation-persistence -> dev-database-postgres -> database-migration-plan |
| cloudflare-agent-state-v5 | wrangler, workers-best-practices | openai-agents-js -> agent-browser-verify -> durable-objects -> agents-sdk -> building-ai-agent-on-cloudflare |
| screenshot-bug-evidence-v5 | control-in-app-browser | design-image-to-code -> frontend-testing-debugging -> screenshot -> playwright -> playwright-interactive |
| figma-annotation-review-v5 | figma-design-review, figma-design-qa | figma-code-connect-components -> figma-code-connect -> figma-use -> figma-use-motion -> dev-frontend-react-next |
| product-design-audit-no-build-v5 | design-get-context, ux-research-plan | audit -> design-qa -> design-audit -> product-design -> dev-frontend-accessibility-css |
| geospatial-map-report-v5 | build-report | data-visualization -> geospatial-and-cartographic-visualization -> uml-and-software-architecture-visualization -> database-schema-design -> dev-database-postgres |
| event-table-quality-contract-v5 | validate-data, data-pipeline-spec, data-analysis-standard | database-schema-design -> dev-database-postgres -> database-migration-plan -> dev-architecture-review -> dependency-audit |
| security-validation-after-fix-v5 | track-findings, security-best-practices | finding-discovery -> validation -> security-diff-scan -> triage-finding -> deep-security-scan |
| hf-jobs-gpu-run-v5 | hf-cli, huggingface-trackio, huggingface-llm-trainer | huggingface-datasets -> huggingface-community-evals -> huggingface-jobs -> huggingface-gradio -> huggingface-vision-trainer |
| tts-voiceover-not-transcription-v5 | openai-docs, dev-ai-llm-apps | transcribe -> speech -> transformers-js -> openai-agents-js -> copilot-sdk |
| vercel-firewall-observability-v5 | vercel-deploy | vercel-firewall -> security-best-practices -> monitoring-setup-guide -> deep-security-scan -> skill-security-auditor |
| stripe-webhook-reconciliation-v5 | security-best-practices | stripe-best-practices -> auth -> dev-backend-api-design -> payments -> dev-node-typescript-services |
| technical-debt-register-no-upgrade-v5 | dependency-audit, code-review-checklist, dev-git-github-collaboration | dependency-conflict-resolver -> dev-dependency-maintenance -> technical-debt-register -> dev-security-engineering -> risk-register |
| presentation-template-pack-v5 | documents, premium-saas-landing-pages | roadmap-presentation -> Presentations -> template-creator -> roadmap-narrative -> reports-pdfs-and-slide-automation |
| notion-research-source-bank-v5 | last-30-days-research, research-protocol | notion-meeting-intelligence -> notion-spec-to-implementation -> notion-research-documentation -> notion-knowledge-capture -> ux-research-plan |

## Interpretation

On the untouched holdout suite, SkillWeaver V2 changes the composite output-quality score by -16.5 points versus no SkillWeaver and -12.3 points versus the skill-level baseline.
V2 changes primary selection by -29.4 percentage points versus no SkillWeaver and -17.6 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by -11.8 percentage points versus no SkillWeaver and -11.8 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
