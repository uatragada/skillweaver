# SkillWeaver V2 Clean Holdout V5 Regression Benchmark

Generated: 2026-06-27T22:04:16.186Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782597856186,"command":"npm run benchmark:skills:clean-v5","suite":{"id":"clean-holdout-v5","label":"Clean Holdout V5 Regression","gatesAcceptance":false},"git":{"commit":"38e4c6df2a46acc4840560ad73a872ee61460c37","dirty":true,"dirtyPaths":["README.md","REQUIREMENTS.md","benchmarks/skill-routing-clean-holdout-v5.json","docs/ROUTING-EVAL-METHODOLOGY.md","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-CLEAN-HOLDOUT-V3.md","docs/SKILL-USE-CLEAN-HOLDOUT-V4.md","docs/SKILL-USE-CLEAN-HOLDOUT-V5.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","docs/SUPPORT-QUALITY-ROADMAP.md","docs/V2-EXPERIMENT-LOG.md","docs/VERIFICATION.md","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["benchmarks/skill-routing-clean-holdout-v5.json","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js"],"cases":{"count":17,"sha256":"sha256:ca434c4a537a1702e063a21d4f5ad338f491548ab6cd8e0dffec27cc1346e130"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:ca434c4a537a1702e063a21d4f5ad338f491548ab6cd8e0dffec27cc1346e130","scanner":"sha256:2137087277e3bedff945d1034f09a05c3721d7ff73abda6e3405e4a273e13e37","benchmarkScript":"sha256:c9a9291425c29aca8466bad261d756d1c1eabd00c4af7761fa04c42a04b448b8","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:3248eb5b3c7238928cad6bbf365fc89f0a53e3125442bacfc6044ea2515ede61"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v5`
- Suite: Clean Holdout V5 Regression
- Acceptance gate: no
- Git commit at generation: `38e4c6df2a46acc4840560ad73a872ee61460c37`
- Git dirty: yes
- Invalidating dirty paths: `benchmarks/skill-routing-clean-holdout-v5.json`, `scripts/benchmark-skill-routing.mjs`, `server/skill-scanner.js`
- Case hash: `sha256:ca434c4a537a1702e063a21d4f5ad338f491548ab6cd8e0dffec27cc1346e130`
- Scanner hash: `sha256:2137087277e3bedff945d1034f09a05c3721d7ff73abda6e3405e4a273e13e37`
- Benchmark script hash: `sha256:c9a9291425c29aca8466bad261d756d1c1eabd00c4af7761fa04c42a04b448b8`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:3248eb5b3c7238928cad6bbf365fc89f0a53e3125442bacfc6044ea2515ede61`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 17

## Suite Role

This suite began as the clean holdout V5 baseline, then its misses informed this routing pass. Treat the current checked-in report as non-gating regression evidence for that prompt set. The pre-tuning V5 baseline remains preserved in git history at `38e4c6d`; a new clean holdout claim requires a fresh prompt set captured after these routing changes and reported before tuning from it.

## Case Provenance

- Cases with provenance fields: 17/17.
- Source mix: subagent-audit: 17.
- Suite state mix: regression: 17.
- Promotion status mix: challenge: 17.
- Support criticality mix: primary-critical: 17.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 59.3 | 55.1 | 95.3 | +36.0 pts | +40.2 pts |
| Primary hit@1 | 52.9% | 41.2% | 100.0% | +47.1 pp | +58.8 pp |
| Expected skill in top/workflow 5 | 94.1% | 94.1% | 100.0% | +5.9 pp | +5.9 pp |
| Mean reciprocal rank | 0.689 | 0.635 | 1.000 | +0.311 | +0.365 |
| Support-skill coverage@5 | 27.5% | 35.3% | 76.5% | +49.0 pp | +41.2 pp |
| Support precision@5, exploratory | 20.6% | 26.5% | 55.9% | +35.3 pp | +29.4 pp |
| Forbidden primary rate, lower is better | 29.4% | 47.1% | 0.0% | -29.4 pp better | -47.1 pp better |
| Mean candidates to expected skill, lower is better | 2.4 | 2.4 | 1.0 | -1.4 candidates better | -1.4 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V5 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 17/17 primary hit@1, 17/17 expected primary in top/workflow five, 0/17 forbidden primaries, support coverage@5 76.5%, support precision@5 55.9%, and 9/17 support-miss cases. The pre-tuning clean V5 baseline is preserved in git history at `38e4c6d`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 17/17; expected primary top/workflow-five 17/17; forbidden primary 0/17; support-miss cases 9/17.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V5 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v5 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 4 | 96.7 | 100.0% | 100.0% | 83.3% | 56.3% | 0.0% | 1/4 | +24.2 pts | +39.0 pts |
| Frontend experience | 3 | 95.6 | 100.0% | 100.0% | 77.8% | 58.3% | 0.0% | 1/3 | +47.2 pts | +41.1 pts |
| Security and risk | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +49.0 pts | +45.7 pts |
| Backend services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +56.7 pts |
| Data analytics | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.0 pts | +50.0 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +70.0 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +13.3 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +60.0 pts |
| Product, research, and planning | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | 0.0 pts |
| Repo collaboration | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.7 pts | +56.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 3 | 95.6 | 100.0% | 100.0% | 77.8% | 50.0% | 0.0% | 1/3 | +27.8 pts | +47.6 pts |
| Security review | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +49.0 pts | +45.7 pts |
| Backend APIs and services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +56.7 pts |
| Browser verification | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +66.7 pts | +60.0 pts |
| Cloudflare workers | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +13.3 pts |
| Data dashboards and reports | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.0 pts | +50.0 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Figma design handoff | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +75.0 pts | +63.3 pts |
| Frontend implementation | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +13.3 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +60.0 pts |
| Presentations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +70.0 pts |
| Product planning | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | 0.0 pts |
| Repository operations | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.7 pts | +56.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-elements-chat-surface-v5 | AI agent apps | Agent and LLM apps | ai-elements | ai-elements / 1 | openai-agents-js !openai-agents-js / 5 | ai-elements / 1 | Agent and LLM apps | ai-elements -> ai-sdk -> dev-frontend-react-next -> frontend-testing-debugging -> openai-agents-js |
| ai-generation-persistence-resume-v5 | AI agent apps | Agent and LLM apps | ai-generation-persistence | vercel-storage !vercel-storage / 2 | vercel-storage !vercel-storage / 3 | ai-generation-persistence / 1 | Agent and LLM apps | ai-generation-persistence -> database-schema-design -> vercel-storage -> uml-and-software-architecture-visualization -> bootstrap |
| cloudflare-agent-state-v5 | AI agent apps | Cloudflare workers | agents-sdk, building-ai-agent-on-cloudflare | agents-sdk / 1 | agents-sdk / 1 | agents-sdk / 1 | Cloudflare workers | agents-sdk -> building-ai-agent-on-cloudflare -> durable-objects -> workers-best-practices -> wrangler |
| screenshot-bug-evidence-v5 | Frontend experience | Browser verification | screenshot | control-in-app-browser / 3 | design-image-to-code !design-image-to-code / 3 | screenshot / 1 | Browser verification | screenshot -> frontend-testing-debugging -> playwright -> playwright-interactive -> control-in-app-browser |
| figma-annotation-review-v5 | Frontend experience | Figma design handoff | figma-annotation-guide | figma-code-connect !figma-code-connect / 4 | figma-code-connect-components !figma-code-connect / 2 | figma-annotation-guide / 1 | Figma design handoff | figma-annotation-guide -> figma-use -> figma-use-motion -> figma-design-qa -> figma-design-review |
| product-design-audit-no-build-v5 | Frontend experience | Frontend implementation | design-audit | audit / 1 | audit / 1 | audit / 1 | Skill ranking anchor | audit -> design-qa -> design-audit -> product-design -> dev-frontend-accessibility-css |
| geospatial-map-report-v5 | Data analytics | Data dashboards and reports | geospatial-and-cartographic-visualization | data-visualization / 5 | data-visualization / 2 | geospatial-and-cartographic-visualization / 1 | Data dashboards and reports | geospatial-and-cartographic-visualization -> data-visualization -> testing-data-visualizations -> database-schema-design -> visualization-strategy-and-critique |
| event-table-quality-contract-v5 | Database and data engineering | Databases and data engineering | data-quality-audit | data-quality-audit / 1 | data-quality-audit / 1 | data-quality-audit / 1 | Databases and data engineering | data-quality-audit -> data-pipeline-spec -> data-analysis-standard -> dev-architecture-review -> dependency-audit |
| security-validation-after-fix-v5 | Security and risk | Security review | validation | track-findings / 10 | triage-finding !triage-finding / 10 | validation / 1 | Security review | validation -> security-diff-scan -> finding-discovery -> triage-finding -> security-best-practices |
| hf-jobs-gpu-run-v5 | Hugging Face ML | Hugging Face ML | huggingface-jobs | huggingface-jobs / 1 | huggingface-vision-trainer / 3 | huggingface-jobs / 1 | Hugging Face ML | huggingface-jobs -> huggingface-llm-trainer -> huggingface-trackio -> hf-cli -> huggingface-community-evals |
| tts-voiceover-not-transcription-v5 | AI agent apps | Agent and LLM apps | speech | speech / 1 | speech / 1 | speech / 1 | Agent and LLM apps | speech -> openai-docs -> dev-ai-llm-apps -> frontend-testing-debugging -> building-mcp-server-on-cloudflare |
| vercel-firewall-observability-v5 | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> security-best-practices -> monitoring-setup-guide -> deep-security-scan -> skill-security-auditor |
| stripe-webhook-reconciliation-v5 | Backend services | Backend APIs and services | stripe-best-practices | payments !payments / 3 | payments !payments / 2 | stripe-best-practices / 1 | Backend APIs and services | stripe-best-practices -> auth -> dev-backend-api-design -> payments -> dev-node-typescript-services |
| r3f-scene-not-data-viz-v5 | Games and simulation | Game development | react-three-fiber-game | react-three-fiber-game / 1 | react-three-fiber-game / 1 | react-three-fiber-game / 1 | Game development | react-three-fiber-game -> three-webgl-game -> game-playtest -> web-3d-asset-pipeline -> frontend-app-builder |
| technical-debt-register-no-upgrade-v5 | Repo collaboration | Repository operations | technical-debt-register | dependency-conflict-resolver !dependency-conflict-resolver / 2 | dependency-conflict-resolver !dependency-conflict-resolver / 2 | technical-debt-register / 1 | Repository operations | technical-debt-register -> dependency-conflict-resolver -> dependency-audit -> code-review-checklist -> dev-dependency-maintenance |
| presentation-template-pack-v5 | Documents and publishing | Presentations | template-creator | template-creator / 1 | roadmap-presentation !roadmap-presentation / 2 | template-creator / 1 | Presentations | template-creator -> Presentations -> roadmap-presentation -> documents -> premium-saas-landing-pages |
| notion-research-source-bank-v5 | Product, research, and planning | Product planning | notion-research-documentation | notion-spec-to-implementation !notion-spec-to-implementation / 2 | notion-research-documentation / 1 | notion-research-documentation / 1 | Product planning | notion-research-documentation -> notion-knowledge-capture -> notion-spec-to-implementation -> ux-research-plan -> product-business-analysis |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| ai-generation-persistence-resume-v5 | ai-sdk, dev-node-typescript-services | ai-generation-persistence -> database-schema-design -> vercel-storage -> uml-and-software-architecture-visualization -> bootstrap |
| product-design-audit-no-build-v5 | design-get-context, ux-research-plan | audit -> design-qa -> design-audit -> product-design -> dev-frontend-accessibility-css |
| geospatial-map-report-v5 | build-report | geospatial-and-cartographic-visualization -> data-visualization -> testing-data-visualizations -> database-schema-design -> visualization-strategy-and-critique |
| event-table-quality-contract-v5 | validate-data | data-quality-audit -> data-pipeline-spec -> data-analysis-standard -> dev-architecture-review -> dependency-audit |
| security-validation-after-fix-v5 | track-findings | validation -> security-diff-scan -> finding-discovery -> triage-finding -> security-best-practices |
| vercel-firewall-observability-v5 | vercel-deploy | vercel-firewall -> security-best-practices -> monitoring-setup-guide -> deep-security-scan -> skill-security-auditor |
| stripe-webhook-reconciliation-v5 | security-best-practices | stripe-best-practices -> auth -> dev-backend-api-design -> payments -> dev-node-typescript-services |
| technical-debt-register-no-upgrade-v5 | dev-git-github-collaboration | technical-debt-register -> dependency-conflict-resolver -> dependency-audit -> code-review-checklist -> dev-dependency-maintenance |
| notion-research-source-bank-v5 | last-30-days-research, research-protocol | notion-research-documentation -> notion-knowledge-capture -> notion-spec-to-implementation -> ux-research-plan -> product-business-analysis |

## Interpretation

On the post-tuning challenge suite, SkillWeaver V2 changes the composite output-quality score by +36.0 points versus no SkillWeaver and +40.2 points versus the skill-level baseline.
V2 changes primary selection by +47.1 percentage points versus no SkillWeaver and +58.8 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +5.9 percentage points versus no SkillWeaver and +5.9 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
