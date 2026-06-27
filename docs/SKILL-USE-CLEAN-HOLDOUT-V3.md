# SkillWeaver V2 Clean Holdout V3 Regression Benchmark

Generated: 2026-06-27T22:04:16.644Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782597856644,"command":"npm run benchmark:skills:clean-v3","suite":{"id":"clean-holdout-v3","label":"Clean Holdout V3 Regression","gatesAcceptance":false},"git":{"commit":"38e4c6df2a46acc4840560ad73a872ee61460c37","dirty":true,"dirtyPaths":["README.md","REQUIREMENTS.md","benchmarks/skill-routing-clean-holdout-v5.json","docs/ROUTING-EVAL-METHODOLOGY.md","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-CLEAN-HOLDOUT-V3.md","docs/SKILL-USE-CLEAN-HOLDOUT-V4.md","docs/SKILL-USE-CLEAN-HOLDOUT-V5.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","docs/SUPPORT-QUALITY-ROADMAP.md","docs/V2-EXPERIMENT-LOG.md","docs/VERIFICATION.md","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["scripts/benchmark-skill-routing.mjs","server/skill-scanner.js"],"cases":{"count":18,"sha256":"sha256:36c81fb6aaaeee3712766db3ab64a341468e9935040933919699c16c9fa57732"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:36c81fb6aaaeee3712766db3ab64a341468e9935040933919699c16c9fa57732","scanner":"sha256:2137087277e3bedff945d1034f09a05c3721d7ff73abda6e3405e4a273e13e37","benchmarkScript":"sha256:c9a9291425c29aca8466bad261d756d1c1eabd00c4af7761fa04c42a04b448b8","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:10eb5ca40678367322dade3a862c95fa760238757567e9489701688ef4c902ba"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v3`
- Suite: Clean Holdout V3 Regression
- Acceptance gate: no
- Git commit at generation: `38e4c6df2a46acc4840560ad73a872ee61460c37`
- Git dirty: yes
- Invalidating dirty paths: `scripts/benchmark-skill-routing.mjs`, `server/skill-scanner.js`
- Case hash: `sha256:36c81fb6aaaeee3712766db3ab64a341468e9935040933919699c16c9fa57732`
- Scanner hash: `sha256:2137087277e3bedff945d1034f09a05c3721d7ff73abda6e3405e4a273e13e37`
- Benchmark script hash: `sha256:c9a9291425c29aca8466bad261d756d1c1eabd00c4af7761fa04c42a04b448b8`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:10eb5ca40678367322dade3a862c95fa760238757567e9489701688ef4c902ba`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 18

## Suite Role

This suite began as the clean holdout V3 baseline, then its misses informed this routing pass. Treat the current checked-in report as non-gating regression evidence for that prompt set. The pre-tuning V3 baseline remains preserved in git history at `00ad343`; a new clean holdout claim requires a fresh prompt set captured after these routing changes and reported before tuning from it.

## Case Provenance

- Cases with provenance fields: 18/18.
- Source mix: manual-fresh-holdout: 18.
- Suite state mix: regression: 18.
- Promotion status mix: backlog: 10, challenge: 8.
- Support criticality mix: primary-critical: 12, support-critical: 6.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 50.3 | 62.3 | 94.4 | +44.1 pts | +32.2 pts |
| Primary hit@1 | 44.4% | 61.1% | 100.0% | +55.6 pp | +38.9 pp |
| Expected skill in top/workflow 5 | 72.2% | 77.8% | 100.0% | +27.8 pp | +22.2 pp |
| Mean reciprocal rank | 0.573 | 0.706 | 1.000 | +0.427 | +0.294 |
| Support-skill coverage@5 | 33.3% | 40.7% | 72.2% | +38.9 pp | +31.5 pp |
| Support precision@5, exploratory | 25.0% | 30.6% | 54.2% | +29.2 pp | +23.6 pp |
| Forbidden primary rate, lower is better | 11.1% | 5.6% | 0.0% | -11.1 pp better | -5.6 pp better |
| Mean candidates to expected skill, lower is better | 9.6 | 4.1 | 1.0 | -8.6 candidates better | -3.1 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V3 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 18/18 primary hit@1, 18/18 expected primary in top/workflow five, 0/18 forbidden primaries, support coverage@5 72.2%, support precision@5 54.2%, and 9/18 support-miss cases. The pre-tuning clean V3 baseline is preserved in git history at `00ad343`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 18/18; expected primary top/workflow-five 18/18; forbidden primary 0/18; support-miss cases 9/18.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V3 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v3 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 1/2 | +6.7 pts | +3.3 pts |
| AI agent apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +63.3 pts | +13.3 pts |
| Backend services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Communications and knowledge | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Data analytics | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.0 pts | +56.7 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +92.8 pts | +84.2 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.3 pts | +83.3 pts |
| Infrastructure platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing, growth, and creative | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +6.7 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +73.3 pts | +20.0 pts |
| Platform delivery | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +98.6 pts | +99.4 pts |
| Product, research, and planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security and risk | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +61.7 pts |
| Skill tooling | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.3 pts | +90.5 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +63.3 pts | +13.3 pts |
| Backend APIs and services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Browser verification | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +6.7 pts |
| Data dashboards and reports | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Deployment and release | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +98.6 pts | +99.4 pts |
| Email triage | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Figma design handoff | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +92.8 pts | +84.2 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.3 pts | +83.3 pts |
| Infrastructure and platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing growth | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +6.7 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +73.3 pts | +20.0 pts |
| Presentations | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +56.0 pts | +56.7 pts |
| Product planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security review | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +60.0 pts | +61.7 pts |
| Skill authoring | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.3 pts | +90.5 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| netlify-preview-rollback-v3 | Platform delivery | Deployment and release | netlify-deploy | control-in-app-browser / 14 | winui-app / 33 | netlify-deploy / 1 | Deployment and release | netlify-deploy -> launch-readiness -> frontend-testing-debugging -> dev-release-productization -> agent-browser-verify |
| skill-author-reference-pack-v3 | Skill tooling | Skill authoring | skill-creator | skill-security-auditor / 6 | cli-creator !cli-creator / 7 | skill-creator / 1 | Skill authoring | skill-creator -> skill-security-auditor -> skillweaver -> dev-documentation-systems -> hatch-pet |
| inapp-responsive-console-v3 | Frontend experience | Browser verification | control-in-app-browser | control-in-app-browser / 1 | control-in-app-browser / 1 | control-in-app-browser / 1 | Browser verification | control-in-app-browser -> design-image-to-code -> screenshot -> frontend-testing-debugging -> playwright-interactive |
| figma-motion-token-handoff-v3 | Frontend experience | Figma design handoff | figma-implement-motion, figma-use-motion | figma-implement-motion / 1 | figma-use / 1 | figma-use-motion / 1 | Figma design handoff | figma-use-motion -> figma-code-connect-components -> figma-swiftui -> figma-code-connect -> figma-use |
| roadmap-research-slide-template-v3 | Documents and publishing | Presentations | Presentations, roadmap-presentation | prd-template !prd-template / 5 | onboarding-plan / 2 | Presentations / 1 | Presentations | Presentations -> roadmap-presentation -> roadmap-narrative -> template-creator -> feature-prioritisation |
| notebook-cohort-audit-v3 | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | jupyter-notebooks / 1 | Data dashboards and reports | jupyter-notebooks -> build-report -> data-analysis-standard -> analyze-data-quality -> kpi-reporting |
| warehouse-contract-migration-v3 | Database and data engineering | Databases and data engineering | data-pipeline-spec, database-migration-plan | database-migration-plan / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Databases and data engineering | data-pipeline-spec -> database-migration-plan -> dev-data-engineering -> data-quality-audit -> dev-architecture-review |
| terraform-k8s-rollout-risk-v3 | Infrastructure platforms | Infrastructure and platforms | infra-as-code-review, dev-containers-kubernetes | dev-infra-terraform-cloud / 2 | dev-infra-terraform-cloud / 2 | dev-containers-kubernetes / 1 | Infrastructure and platforms | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> dev-performance-engineering -> infra-as-code-review |
| otel-before-postmortem-v3 | Observability and reliability | Observability and reliability | dev-observability-sre | dev-java-dotnet-services / 3 | dev-observability-sre / 1 | dev-observability-sre / 1 | Observability and reliability | dev-observability-sre -> monitoring-setup-guide -> slo-error-budget -> sentry -> dev-java-dotnet-services |
| oauth-session-hardening-v3 | Backend services | Backend APIs and services | auth | dev-architecture-review / 88 | auth / 1 | auth / 1 | Backend APIs and services | auth -> security-best-practices -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| pr-security-finding-triage-v3 | Security and risk | Security review | triage-finding, validation | dependency-audit / 3 | dependency-audit / 4 | triage-finding / 1 | Security review | triage-finding -> validation -> security-diff-scan -> track-findings -> infra-as-code-review |
| gmail-notion-action-owner-v3 | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> notion-knowledge-capture -> notion-spec-to-implementation |
| huggingface-dataset-card-eval-v3 | Hugging Face ML | Hugging Face ML | huggingface-datasets | huggingface-papers / 6 | huggingface-papers / 6 | huggingface-datasets / 1 | Hugging Face ML | huggingface-datasets -> huggingface-community-evals -> huggingface-paper-publisher -> huggingface-papers -> hf-cli |
| game-accessible-hud-playtest-v3 | Games and simulation | Game development | game-ui-frontend | design-handoff-brief / 35 | phaser-2d-game / 8 | game-ui-frontend / 1 | Game development | game-ui-frontend -> game-playtest -> phaser-2d-game -> sprite-pipeline -> game-studio |
| creative-seo-conversion-readout-v3 | Marketing, growth, and creative | Marketing growth | seo-and-organic-growth | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | Skill ranking anchor | seo-and-organic-growth -> creative-ads-explorer -> analytics-cro-and-reporting -> kpi-reporting -> marketing-strategy-and-growth |
| market-sizing-source-bank-v3 | Product, research, and planning | Product planning | market-sizing | market-sizing / 1 | market-sizing / 1 | market-sizing / 1 | Skill ranking anchor | market-sizing -> build-dashboard -> product-business-analysis -> product-launch-checklist -> prd-template |
| repo-preserve-dependency-upgrade-v3 | Repo collaboration | Repository operations | dependency-conflict-resolver | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | Repository operations | dependency-conflict-resolver -> dev-dependency-maintenance -> dev-git-github-collaboration -> dev-monorepo-build-systems -> code-review-checklist |
| openai-agents-approval-flow-v3 | AI agent apps | Agent and LLM apps | openai-agents-js | chatgpt-apps !chatgpt-apps / 2 | openai-agents-js / 1 | openai-agents-js / 1 | Agent and LLM apps | openai-agents-js -> openai-docs -> dev-ai-llm-apps -> dev-node-typescript-services -> agents-sdk |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| figma-motion-token-handoff-v3 | motion-implementation-recipes, motion-qa | figma-use-motion -> figma-code-connect-components -> figma-swiftui -> figma-code-connect -> figma-use |
| roadmap-research-slide-template-v3 | linear | Presentations -> roadmap-presentation -> roadmap-narrative -> template-creator -> feature-prioritisation |
| notebook-cohort-audit-v3 | validate-data, metric-diagnostics | jupyter-notebooks -> build-report -> data-analysis-standard -> analyze-data-quality -> kpi-reporting |
| warehouse-contract-migration-v3 | dev-database-postgres | data-pipeline-spec -> database-migration-plan -> dev-data-engineering -> data-quality-audit -> dev-architecture-review |
| terraform-k8s-rollout-risk-v3 | security-best-practices, cicd-playbook | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> dev-performance-engineering -> infra-as-code-review |
| oauth-session-hardening-v3 | env-vars | auth -> security-best-practices -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| pr-security-finding-triage-v3 | security-best-practices | triage-finding -> validation -> security-diff-scan -> track-findings -> infra-as-code-review |
| gmail-notion-action-owner-v3 | notion-meeting-intelligence | gmail-inbox-triage -> gmail -> email-triage -> notion-knowledge-capture -> notion-spec-to-implementation |
| market-sizing-source-bank-v3 | business-strategy-and-research, external-research-digests, research-protocol | market-sizing -> build-dashboard -> product-business-analysis -> product-launch-checklist -> prd-template |

## Interpretation

On the clean holdout V3 regression suite, SkillWeaver V2 changes the composite output-quality score by +44.1 points versus no SkillWeaver and +32.2 points versus the skill-level baseline.
V2 changes primary selection by +55.6 percentage points versus no SkillWeaver and +38.9 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +27.8 percentage points versus no SkillWeaver and +22.2 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
