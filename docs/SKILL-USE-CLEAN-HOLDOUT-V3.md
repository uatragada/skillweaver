# SkillWeaver V2 Clean Holdout V3 Regression Benchmark

Generated: 2026-07-07T06:37:59.822Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783406279822,"command":"npm run benchmark:skills:clean-v3","suite":{"id":"clean-holdout-v3","label":"Clean Holdout V3 Regression","gatesAcceptance":false},"git":{"commit":"c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784","dirty":true,"dirtyPaths":["docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md"]},"invalidatingDirtyPaths":[],"cases":{"count":18,"sha256":"sha256:588ebdf6e8dfc35a57e8189b33a10e2f0703c81d1800ca14cab901f3fa18d6d2"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"inputs":{"cases":"sha256:588ebdf6e8dfc35a57e8189b33a10e2f0703c81d1800ca14cab901f3fa18d6d2","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:0bb3e58dc5b209ec583f5ff0d418fb75d9b2aeadf7021a441e1a5187cd72a61c"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v3`
- Suite: Clean Holdout V3 Regression
- Acceptance gate: no
- Git commit at generation: `c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784`
- Git dirty: yes
- Invalidating dirty paths: none
- Case hash: `sha256:588ebdf6e8dfc35a57e8189b33a10e2f0703c81d1800ca14cab901f3fa18d6d2`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f`
- Snapshot fingerprint: `sha256:0bb3e58dc5b209ec583f5ff0d418fb75d9b2aeadf7021a441e1a5187cd72a61c`
- Freshness check: pass
- Quality gate, reported only: fail: V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
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
| Output quality score (0-100) | 46.3 | 58.2 | 89.3 | +43.0 pts | +31.1 pts |
| Primary hit@1 | 38.9% | 55.6% | 94.4% | +55.6 pp | +38.9 pp |
| Expected skill in top/workflow 5 | 66.7% | 77.8% | 94.4% | +27.8 pp | +16.7 pp |
| Mean reciprocal rank | 0.518 | 0.651 | 0.946 | +0.428 | +0.295 |
| Support-skill coverage@5 | 35.2% | 37.0% | 68.5% | +33.3 pp | +31.5 pp |
| Support precision@5, exploratory | 26.4% | 27.8% | 51.4% | +25.0 pp | +23.6 pp |
| Forbidden primary rate, lower is better | 11.1% | 5.6% | 5.6% | -5.6 pp better | 0.0 pp |
| Confusable wrong primary rate, lower is better | 27.8% | 22.2% | 0.0% | -27.8 pp better | -22.2 pp better |
| Mean candidates to expected skill, lower is better | 17.2 | 16.2 | 2.8 | -14.4 candidates better | -13.4 candidates better |

## Claim Scope

This report measures the current route against the clean holdout V3 prompt set after misses from that suite informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 17/18 primary hit@1, 17/18 expected primary in top/workflow five, 1/18 forbidden primaries, support coverage@5 68.5%, support precision@5 51.4%, and 10/18 support-miss cases. The pre-tuning clean V3 baseline is preserved in git history at `00ad343`; a new clean generalization claim requires another untouched prompt set captured after these routing changes.

V2 raw counts: primary hit@1 17/18; expected primary top/workflow-five 17/18; forbidden primary 1/18; confusable wrong primary 0/18; support-miss cases 10/18.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V3 Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v3 regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 0.0% | 1/2 | +6.7 pts | +3.3 pts |
| AI agent apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +63.3 pts | +13.3 pts |
| Backend services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Communications and knowledge | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Data analytics | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +56.0 pts | +56.7 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +92.8 pts | +84.2 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +83.3 pts | +83.3 pts |
| Infrastructure platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing, growth, and creative | 1 | 7.3 | 0.0% | 0.0% | 33.3% | 25.0% | 100.0% | 0.0% | 1/1 | +0.5 pts | +7.2 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +73.3 pts | +20.0 pts |
| Platform delivery | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +98.6 pts | +99.4 pts |
| Product, research, and planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security and risk | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +60.0 pts | +61.7 pts |
| Skill tooling | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +83.3 pts | +70.5 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +63.3 pts | +13.3 pts |
| Backend APIs and services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Browser verification | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +13.3 pts | +6.7 pts |
| Data dashboards and reports | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Deployment and release | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +98.6 pts | +99.4 pts |
| Email triage | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Figma design handoff | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +92.8 pts | +84.2 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +83.3 pts | +83.3 pts |
| Infrastructure and platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing growth | 1 | 7.3 | 0.0% | 0.0% | 33.3% | 25.0% | 100.0% | 0.0% | 1/1 | +0.5 pts | +7.2 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +73.3 pts | +20.0 pts |
| Presentations | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +56.0 pts | +56.7 pts |
| Product planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security review | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | +60.0 pts | +61.7 pts |
| Skill authoring | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +83.3 pts | +70.5 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| netlify-preview-rollback-v3 | Platform delivery | Deployment and release | netlify-deploy | control-in-app-browser / 14 | winui-app / 32 | netlify-deploy / 1 | Deployment and release | netlify-deploy -> launch-readiness -> frontend-testing-debugging -> dev-release-productization -> agent-browser-verify |
| skill-author-reference-pack-v3 | Skill tooling | Skill authoring | skill-creator | skill-security-auditor / 6 | cli-creator !cli-creator / 7 | skill-creator / 1 | Skill authoring | skill-creator -> skill-security-auditor -> skillweaver -> dev-documentation-systems -> hatch-pet |
| inapp-responsive-console-v3 | Frontend experience | Browser verification | control-in-app-browser | control-in-app-browser / 1 | control-in-app-browser / 1 | control-in-app-browser / 1 | Browser verification | control-in-app-browser -> design-image-to-code -> screenshot -> frontend-testing-debugging -> playwright-interactive |
| figma-motion-token-handoff-v3 | Frontend experience | Figma design handoff | figma-implement-motion, figma-use-motion | figma-implement-motion / 1 | figma-use / 1 | figma-use-motion / 1 | Figma design handoff | figma-use-motion -> figma-code-connect-components -> figma-swiftui -> figma-code-connect -> figma-use |
| roadmap-research-slide-template-v3 | Documents and publishing | Presentations | Presentations, roadmap-presentation | prd-template !prd-template / 5 | onboarding-plan / 2 | Presentations / 1 | Presentations | Presentations -> roadmap-presentation -> roadmap-narrative -> template-creator -> feature-prioritisation |
| notebook-cohort-audit-v3 | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | jupyter-notebooks / 1 | Data dashboards and reports | jupyter-notebooks -> build-report -> data-analysis-standard -> analyze-data-quality -> kpi-reporting |
| warehouse-contract-migration-v3 | Database and data engineering | Databases and data engineering | data-pipeline-spec, database-migration-plan | database-migration-plan / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Databases and data engineering | data-pipeline-spec -> database-migration-plan -> dev-data-engineering -> data-quality-audit -> dev-architecture-review |
| terraform-k8s-rollout-risk-v3 | Infrastructure platforms | Infrastructure and platforms | infra-as-code-review, dev-containers-kubernetes | dev-infra-terraform-cloud / 2 | dev-infra-terraform-cloud / 2 | dev-containers-kubernetes / 1 | Infrastructure and platforms | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> dev-performance-engineering -> infra-as-code-review |
| otel-before-postmortem-v3 | Observability and reliability | Observability and reliability | dev-observability-sre | dev-java-dotnet-services / 3 | dev-observability-sre / 1 | dev-observability-sre / 1 | Observability and reliability | dev-observability-sre -> monitoring-setup-guide -> slo-error-budget -> sentry -> dev-java-dotnet-services |
| oauth-session-hardening-v3 | Backend services | Backend APIs and services | auth | dev-architecture-review / 84 | auth / 1 | auth / 1 | Backend APIs and services | auth -> security-best-practices -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| pr-security-finding-triage-v3 | Security and risk | Security review | triage-finding, validation | dependency-audit / 3 | dependency-audit / 4 | triage-finding / 1 | Security review | triage-finding -> validation -> security-diff-scan -> track-findings -> infra-as-code-review |
| gmail-notion-action-owner-v3 | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> notion-knowledge-capture -> notion-spec-to-implementation |
| huggingface-dataset-card-eval-v3 | Hugging Face ML | Hugging Face ML | huggingface-datasets | huggingface-papers / 6 | huggingface-papers / 6 | huggingface-datasets / 1 | Hugging Face ML | huggingface-datasets -> huggingface-community-evals -> huggingface-paper-publisher -> huggingface-papers -> hf-cli |
| game-accessible-hud-playtest-v3 | Games and simulation | Game development | game-ui-frontend | design-handoff-brief / 35 | phaser-2d-game / 8 | game-ui-frontend / 1 | Game development | game-ui-frontend -> game-playtest -> phaser-2d-game -> sprite-pipeline -> game-studio |
| creative-seo-conversion-readout-v3 | Marketing, growth, and creative | Marketing growth | creative-production | ux-research-plan / 143 | ux-research-plan / 220 | creative-ads-explorer !creative-ads-explorer / 33 | Marketing growth | creative-ads-explorer -> ux-research-plan -> kpi-reporting -> premium-saas-landing-pages -> design-kpis |
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
| creative-seo-conversion-readout-v3 | creative-positioning, last-30-days-research | creative-ads-explorer -> ux-research-plan -> kpi-reporting -> premium-saas-landing-pages -> design-kpis |
| market-sizing-source-bank-v3 | business-strategy-and-research, external-research-digests, research-protocol | market-sizing -> build-dashboard -> product-business-analysis -> product-launch-checklist -> prd-template |

## Interpretation

On the clean holdout V3 regression suite, SkillWeaver V2 changes the composite output-quality score by +43.0 points versus no SkillWeaver and +31.1 points versus the skill-level baseline.
V2 changes primary selection by +55.6 percentage points versus no SkillWeaver and +38.9 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +27.8 percentage points versus no SkillWeaver and +16.7 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
