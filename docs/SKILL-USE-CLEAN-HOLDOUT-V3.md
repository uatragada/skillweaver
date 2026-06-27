# SkillWeaver V2 Clean Holdout V3 Benchmark

Generated: 2026-06-27T20:56:28.432Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782593788432,"command":"npm run benchmark:skills:clean-v3","suite":{"id":"clean-holdout-v3","label":"Clean Holdout V3","gatesAcceptance":false},"git":{"commit":"ba72179048a826164ec85ec2c50db72c5d735224","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":18,"sha256":"sha256:2ac680f0b8e1d06a1a8363017e05768144f4f1d0c8cd3020242f9c751cc67b81"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:2ac680f0b8e1d06a1a8363017e05768144f4f1d0c8cd3020242f9c751cc67b81","scanner":"sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b","benchmarkScript":"sha256:eeef9e64f904768fff8a1347d23926e4b46989a2dc8146b7e041965ed7d0294a","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:9ee9808f1796ea232c83e5d67e785bb23a99c430b2ca36d1f4f4b876e5c0390f"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean-v3`
- Suite: Clean Holdout V3
- Acceptance gate: no
- Git commit at generation: `ba72179048a826164ec85ec2c50db72c5d735224`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:2ac680f0b8e1d06a1a8363017e05768144f4f1d0c8cd3020242f9c751cc67b81`
- Scanner hash: `sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b`
- Benchmark script hash: `sha256:eeef9e64f904768fff8a1347d23926e4b46989a2dc8146b7e041965ed7d0294a`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:9ee9808f1796ea232c83e5d67e785bb23a99c430b2ca36d1f4f4b876e5c0390f`
- Freshness check: pass
- Quality gate, reported only: fail: V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 18

## Suite Role

This suite is intended as untouched holdout evidence for current V2 routing. Cases include provenance fields and were frozen before any routing changes from their results. The report is non-gating so failures can expose real gaps without weakening the active acceptance suite.

## Case Provenance

- Cases with provenance fields: 18/18.
- Source mix: manual-fresh-holdout: 18.
- Suite state mix: untouched-holdout: 18.
- Promotion status mix: candidate: 18.
- Support criticality mix: primary-critical: 12, support-critical: 6.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 50.3 | 62.3 | 64.9 | +14.5 pts | +2.6 pts |
| Primary hit@1 | 44.4% | 61.1% | 55.6% | +11.1 pp | -5.6 pp |
| Expected skill in top/workflow 5 | 72.2% | 77.8% | 83.3% | +11.1 pp | +5.6 pp |
| Mean reciprocal rank | 0.573 | 0.706 | 0.688 | +0.115 | -0.018 |
| Support-skill coverage@5 | 33.3% | 40.7% | 61.1% | +27.8 pp | +20.4 pp |
| Support precision@5, exploratory | 25.0% | 30.6% | 45.8% | +20.8 pp | +15.3 pp |
| Forbidden primary rate, lower is better | 11.1% | 5.6% | 11.1% | 0.0 pp | +5.6 pp worse |
| Mean candidates to expected skill, lower is better | 9.6 | 4.1 | 4.2 | -5.4 candidates better | +0.1 candidates worse |

## Claim Scope

This report is an untouched-holdout baseline for prompts captured after the latest routing-tuning commit and before any tuning from this suite. It supports a clean-split claim only while no misses from these prompts have informed routing changes: 10/18 primary hit@1, 15/18 expected primary in top/workflow five, 2/18 forbidden primaries, support coverage@5 61.1%, support precision@5 45.8%, and 13/18 support-miss cases. If this suite later drives tuning, relabel it as challenge or regression evidence before citing it again.

V2 raw counts: primary hit@1 10/18; expected primary top/workflow-five 15/18; forbidden primary 2/18; support-miss cases 13/18.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V3 quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v3 cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 2 | 90.0 | 100.0% | 100.0% | 50.0% | 37.5% | 0.0% | 1/2 | +6.7 pts | +3.3 pts |
| AI agent apps | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | -43.3 pts |
| Backend services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Communications and knowledge | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Data analytics | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 15.6 | 0.0% | 0.0% | 66.7% | 50.0% | 0.0% | 1/1 | -21.8 pts | -21.1 pts |
| Games and simulation | 1 | 45.0 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +37.8 pts | +29.2 pts |
| Hugging Face ML | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | +26.7 pts | +26.7 pts |
| Infrastructure platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing, growth, and creative | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +6.7 pts |
| Observability and reliability | 1 | 50.0 | 0.0% | 100.0% | 100.0% | 75.0% | 100.0% | 0/1 | +23.3 pts | -30.0 pts |
| Platform delivery | 1 | 7.2 | 0.0% | 0.0% | 33.3% | 25.0% | 0.0% | 1/1 | +5.8 pts | +6.6 pts |
| Product, research, and planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security and risk | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | +1.7 pts |
| Skill tooling | 1 | 16.7 | 0.0% | 0.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | +7.1 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | -43.3 pts |
| Backend APIs and services | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +86.4 pts | +6.7 pts |
| Browser verification | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +13.3 pts | +6.7 pts |
| Data dashboards and reports | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Deployment and release | 1 | 7.2 | 0.0% | 0.0% | 33.3% | 25.0% | 0.0% | 1/1 | +5.8 pts | +6.6 pts |
| Email triage | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | -6.7 pts |
| Figma design handoff | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Game development | 1 | 45.0 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +37.8 pts | +29.2 pts |
| Hugging Face ML | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | +26.7 pts | +26.7 pts |
| Infrastructure and platforms | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +50.0 pts | +50.0 pts |
| Marketing growth | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +20.0 pts | +6.7 pts |
| Observability and reliability | 1 | 50.0 | 0.0% | 100.0% | 100.0% | 75.0% | 100.0% | 0/1 | +23.3 pts | -30.0 pts |
| Presentations | 1 | 15.6 | 0.0% | 0.0% | 66.7% | 50.0% | 0.0% | 1/1 | -21.8 pts | -21.1 pts |
| Product planning | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Security review | 1 | 33.3 | 0.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | +1.7 pts |
| Skill authoring | 1 | 16.7 | 0.0% | 0.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | +7.1 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| netlify-preview-rollback-v3 | Platform delivery | Deployment and release | netlify-deploy | control-in-app-browser / 14 | winui-app / 33 | launch-readiness / 37 | Frontend implementation | launch-readiness -> web-3d-asset-pipeline -> winui-app -> sprite-pipeline -> agent-browser-verify |
| skill-author-reference-pack-v3 | Skill tooling | Skill authoring | skill-creator | skill-security-auditor / 6 | cli-creator !cli-creator / 7 | skillweaver / 6 | Skill authoring | skillweaver -> cli-creator -> skill-security-auditor -> code-review-checklist -> chatgpt-apps |
| inapp-responsive-console-v3 | Frontend experience | Browser verification | control-in-app-browser | control-in-app-browser / 1 | control-in-app-browser / 1 | control-in-app-browser / 1 | Browser verification | control-in-app-browser -> design-image-to-code -> frontend-testing-debugging -> screenshot -> playwright-interactive |
| figma-motion-token-handoff-v3 | Frontend experience | Figma design handoff | figma-implement-motion, figma-use-motion | figma-implement-motion / 1 | figma-use / 1 | figma-use-motion / 1 | Figma design handoff | figma-use-motion -> figma-code-connect-components -> figma-swiftui -> figma-code-connect -> figma-use |
| roadmap-research-slide-template-v3 | Documents and publishing | Presentations | Presentations, roadmap-presentation | prd-template !prd-template / 5 | onboarding-plan / 2 | linear / 9 | Product planning | linear -> prd-template -> feature-prioritisation -> notion-research-documentation -> roadmap-narrative |
| notebook-cohort-audit-v3 | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | jupyter-notebooks / 1 | Data dashboards and reports | jupyter-notebooks -> build-report -> data-analysis-standard -> analyze-data-quality -> kpi-reporting |
| warehouse-contract-migration-v3 | Database and data engineering | Databases and data engineering | data-pipeline-spec, database-migration-plan | database-migration-plan / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Databases and data engineering | data-pipeline-spec -> database-migration-plan -> dev-data-engineering -> data-quality-audit -> dev-architecture-review |
| terraform-k8s-rollout-risk-v3 | Infrastructure platforms | Infrastructure and platforms | infra-as-code-review, dev-containers-kubernetes | dev-infra-terraform-cloud / 2 | dev-infra-terraform-cloud / 2 | dev-containers-kubernetes / 1 | Infrastructure and platforms | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> dev-performance-engineering -> infra-as-code-review |
| otel-before-postmortem-v3 | Observability and reliability | Observability and reliability | dev-observability-sre | dev-java-dotnet-services / 3 | dev-observability-sre / 1 | incident-postmortem !incident-postmortem / 2 | Observability and reliability | incident-postmortem -> dev-observability-sre -> sentry -> monitoring-setup-guide -> slo-error-budget |
| oauth-session-hardening-v3 | Backend services | Backend APIs and services | auth | dev-architecture-review / 88 | auth / 1 | auth / 1 | Backend APIs and services | auth -> security-best-practices -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| pr-security-finding-triage-v3 | Security and risk | Security review | triage-finding, validation | dependency-audit / 3 | dependency-audit / 4 | dependency-audit / 3 | Security review | dependency-audit -> track-findings -> validation -> triage-finding -> infra-as-code-review |
| gmail-notion-action-owner-v3 | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> notion-knowledge-capture -> notion-spec-to-implementation |
| huggingface-dataset-card-eval-v3 | Hugging Face ML | Hugging Face ML | huggingface-datasets | huggingface-papers / 6 | huggingface-papers / 6 | huggingface-llm-trainer !huggingface-llm-trainer / 2 | Hugging Face ML | huggingface-llm-trainer -> huggingface-datasets -> huggingface-paper-publisher -> huggingface-community-evals -> huggingface-papers |
| game-accessible-hud-playtest-v3 | Games and simulation | Game development | game-ui-frontend | design-handoff-brief / 35 | phaser-2d-game / 8 | sprite-pipeline / 4 | Game development | sprite-pipeline -> game-playtest -> phaser-2d-game -> game-ui-frontend -> web-3d-asset-pipeline |
| creative-seo-conversion-readout-v3 | Marketing, growth, and creative | Marketing growth | seo-and-organic-growth | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | Skill ranking anchor | seo-and-organic-growth -> creative-ads-explorer -> analytics-cro-and-reporting -> kpi-reporting -> marketing-strategy-and-growth |
| market-sizing-source-bank-v3 | Product, research, and planning | Product planning | market-sizing | market-sizing / 1 | market-sizing / 1 | market-sizing / 1 | Skill ranking anchor | market-sizing -> build-dashboard -> product-business-analysis -> product-launch-checklist -> prd-template |
| repo-preserve-dependency-upgrade-v3 | Repo collaboration | Repository operations | dependency-conflict-resolver | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | Repository operations | dependency-conflict-resolver -> dev-dependency-maintenance -> dev-git-github-collaboration -> dev-monorepo-build-systems -> code-review-checklist |
| openai-agents-approval-flow-v3 | AI agent apps | Agent and LLM apps | openai-agents-js | chatgpt-apps !chatgpt-apps / 2 | openai-agents-js / 1 | openai-docs / 2 | Agent and LLM apps | openai-docs -> openai-agents-js -> chatgpt-apps -> copilot-sdk -> dev-ai-llm-apps |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| netlify-preview-rollback-v3 | frontend-testing-debugging, dev-release-productization | launch-readiness -> web-3d-asset-pipeline -> winui-app -> sprite-pipeline -> agent-browser-verify |
| skill-author-reference-pack-v3 | dev-documentation-systems | skillweaver -> cli-creator -> skill-security-auditor -> code-review-checklist -> chatgpt-apps |
| figma-motion-token-handoff-v3 | motion-implementation-recipes, motion-qa | figma-use-motion -> figma-code-connect-components -> figma-swiftui -> figma-code-connect -> figma-use |
| roadmap-research-slide-template-v3 | template-creator | linear -> prd-template -> feature-prioritisation -> notion-research-documentation -> roadmap-narrative |
| notebook-cohort-audit-v3 | validate-data, metric-diagnostics | jupyter-notebooks -> build-report -> data-analysis-standard -> analyze-data-quality -> kpi-reporting |
| warehouse-contract-migration-v3 | dev-database-postgres | data-pipeline-spec -> database-migration-plan -> dev-data-engineering -> data-quality-audit -> dev-architecture-review |
| terraform-k8s-rollout-risk-v3 | security-best-practices, cicd-playbook | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> dev-performance-engineering -> infra-as-code-review |
| oauth-session-hardening-v3 | env-vars | auth -> security-best-practices -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| pr-security-finding-triage-v3 | security-diff-scan, security-best-practices | dependency-audit -> track-findings -> validation -> triage-finding -> infra-as-code-review |
| gmail-notion-action-owner-v3 | notion-meeting-intelligence | gmail-inbox-triage -> gmail -> email-triage -> notion-knowledge-capture -> notion-spec-to-implementation |
| huggingface-dataset-card-eval-v3 | hf-cli | huggingface-llm-trainer -> huggingface-datasets -> huggingface-paper-publisher -> huggingface-community-evals -> huggingface-papers |
| market-sizing-source-bank-v3 | business-strategy-and-research, external-research-digests, research-protocol | market-sizing -> build-dashboard -> product-business-analysis -> product-launch-checklist -> prd-template |
| openai-agents-approval-flow-v3 | dev-node-typescript-services | openai-docs -> openai-agents-js -> chatgpt-apps -> copilot-sdk -> dev-ai-llm-apps |

## Interpretation

On the untouched holdout suite, SkillWeaver V2 changes the composite output-quality score by +14.5 points versus no SkillWeaver and +2.6 points versus the skill-level baseline.
V2 changes primary selection by +11.1 percentage points versus no SkillWeaver and -5.6 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +11.1 percentage points versus no SkillWeaver and +5.6 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
