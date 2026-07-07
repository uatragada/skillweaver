# SkillWeaver V2 Fresh-Probe Regression Benchmark

Generated: 2026-07-07T06:37:42.448Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783406262448,"command":"npm run benchmark:skills:fresh","suite":{"id":"fresh","label":"Fresh-Probe Regression","gatesAcceptance":false},"git":{"commit":"c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784","dirty":true,"dirtyPaths":["docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md"]},"invalidatingDirtyPaths":[],"cases":{"count":18,"sha256":"sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"inputs":{"cases":"sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 confusable wrong-primary rate must stay at 0."]}},"snapshotFingerprint":"sha256:0ae34508972a229d7d6c6680081a85d314ae79c012424cc36fd0a4bad8f80181"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:fresh`
- Suite: Fresh-Probe Regression
- Acceptance gate: no
- Git commit at generation: `c9c5caa4ad6a5bcccd10790b8ccdf2265a4f0784`
- Git dirty: yes
- Invalidating dirty paths: none
- Case hash: `sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:a07a6c39034e9ae41c52e3082729eb684b78c8f4fd09d795141b61874770aa4f`
- Snapshot fingerprint: `sha256:0ae34508972a229d7d6c6680081a85d314ae79c012424cc36fd0a4bad8f80181`
- Freshness check: pass
- Quality gate, reported only: fail: V2 confusable wrong-primary rate must stay at 0.

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
- Benchmark cases: 18

## Suite Role

This suite began as fresh generalization evidence collected after the previous routing-tuning work. Once misses from these prompts informed fixes, the checked-in report became non-gating regression evidence for the fresh-probe slice. A future untouched generalization claim requires another prompt set collected after the latest routing-tuning commit.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 70.2 | 74.4 | 95.4 | +25.2 pts | +21.0 pts |
| Primary hit@1 | 66.7% | 72.2% | 94.4% | +27.8 pp | +22.2 pp |
| Expected skill in top/workflow 5 | 88.9% | 88.9% | 100.0% | +11.1 pp | +11.1 pp |
| Mean reciprocal rank | 0.760 | 0.793 | 0.972 | +0.213 | +0.179 |
| Support-skill coverage@5 | 52.8% | 59.3% | 90.7% | +38.0 pp | +31.5 pp |
| Support precision@5, exploratory | 30.6% | 34.7% | 51.4% | +20.8 pp | +16.7 pp |
| Forbidden primary rate, lower is better | 0.0% | 0.0% | 0.0% | 0.0 pp | 0.0 pp |
| Confusable wrong primary rate, lower is better | 22.2% | 16.7% | 5.6% | -16.7 pp better | -11.1 pp better |
| Mean candidates to expected skill, lower is better | 4.2 | 2.1 | 1.1 | -3.2 candidates better | -1.1 candidates better |

## Claim Scope

This report measures the current route against an 18-case suite that began as a fresh generalization probe. Current results are regression evidence for those prompts: 17/18 primary hit@1, 18/18 expected primary in top/workflow five, 0/18 forbidden primaries, support coverage@5 90.7%, support precision@5 51.4%, and 4/18 support-miss cases. Use the experiment log for the pre-tuning fresh-probe result; this report is not proof that cross-domain routing is solved.

V2 raw counts: primary hit@1 17/18; expected primary top/workflow-five 18/18; forbidden primary 0/18; confusable wrong primary 1/18; support-miss cases 4/18.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Fresh-Probe Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and fresh-probe regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 62.5% | 0.0% | 0.0% | 0/2 | +48.1 pts | +43.9 pts |
| Communications and knowledge | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 25.0% | 0.0% | 0.0% | 1/2 | +21.7 pts | +22.5 pts |
| Security and risk | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 50.0% | 0.0% | 0.0% | 1/2 | +8.3 pts | +6.7 pts |
| Backend services | 1 | 50.0 | 0.0% | 100.0% | 100.0% | 50.0% | 0.0% | 100.0% | 0/1 | +48.8 pts | -30.0 pts |
| Data analytics | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Frontend experience | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | +6.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +65.0 pts | +76.7 pts |
| Infrastructure platforms | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | +6.7 pts |
| Marketing, growth, and creative | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +60.0 pts | +75.0 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +56.7 pts | +56.7 pts |
| Product, research, and planning | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cloudflare workers | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 50.0% | 0.0% | 0.0% | 1/2 | +5.0 pts | +8.3 pts |
| Product planning | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 0.0% | 1/2 | +26.7 pts | +22.5 pts |
| Security review | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 50.0% | 0.0% | 0.0% | 1/2 | +8.3 pts | +6.7 pts |
| Agent and LLM apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +86.1 pts | +77.8 pts |
| Backend APIs and services | 1 | 50.0 | 0.0% | 100.0% | 100.0% | 50.0% | 0.0% | 100.0% | 0/1 | +48.8 pts | -30.0 pts |
| Data dashboards and reports | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and PDFs | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Email triage | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Frontend implementation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +6.7 pts | +6.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +65.0 pts | +76.7 pts |
| Marketing growth | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +60.0 pts | +75.0 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0/1 | +56.7 pts | +56.7 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-server-cloudflare-fresh | AI agent apps | Cloudflare workers | building-mcp-server-on-cloudflare | building-mcp-server-on-cloudflare / 1 | building-mcp-server-on-cloudflare / 1 | building-mcp-server-on-cloudflare / 1 | Cloudflare workers | building-mcp-server-on-cloudflare -> wrangler -> workers-best-practices -> agents-sdk -> durable-objects |
| game-ui-playtest-fresh | Games and simulation | Game development | phaser-2d-game, game-studio | phaser-2d-game / 1 | phaser-2d-game / 1 | phaser-2d-game / 1 | Game development | phaser-2d-game -> game-studio -> game-ui-frontend -> game-playtest -> sprite-pipeline |
| notion-meeting-email-fresh | Communications and knowledge | Product planning | notion-meeting-intelligence | notion-spec-to-implementation / 3 | gmail / 4 | notion-meeting-intelligence / 1 | Product planning | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> notion-knowledge-capture -> email-triage |
| vercel-auth-protection-fresh | Backend services | Backend APIs and services | auth | vercel-api / 16 | auth / 1 | sign-in-with-vercel / 2 | Backend APIs and services | sign-in-with-vercel -> auth -> dev-backend-api-design -> security-best-practices -> env-vars |
| vercel-bot-firewall-fresh | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> vercel-deploy -> building-mcp-server-on-cloudflare -> env-vars -> agent-browser-verify |
| visualization-accessibility-review-fresh | Data analytics | Data dashboards and reports | accessibility-and-inclusive-visualization | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | Data dashboards and reports | accessibility-and-inclusive-visualization -> testing-data-visualizations -> data-visualization -> visualize-data -> visualization-strategy-and-critique |
| postgres-migration-rollback-fresh | Database and data engineering | Databases and data engineering | database-migration-plan | database-migration-plan / 1 | database-migration-plan / 1 | database-migration-plan / 1 | Databases and data engineering | database-migration-plan -> database-schema-design -> dev-database-postgres -> data-quality-audit -> data-analysis-standard |
| sentry-incident-slo-fresh | Observability and reliability | Observability and reliability | incident-postmortem | slo-error-budget / 2 | slo-error-budget / 2 | incident-postmortem / 1 | Observability and reliability | incident-postmortem -> sentry -> slo-error-budget -> dev-observability-sre -> monitoring-setup-guide |
| dependency-conflict-monorepo-fresh | Repo collaboration | Repository operations | dependency-conflict-resolver | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | Repository operations | dependency-conflict-resolver -> dev-monorepo-build-systems -> dev-git-github-collaboration -> turborepo -> gh-fix-ci |
| durable-object-agent-fresh | Infrastructure platforms | Cloudflare workers | durable-objects, building-ai-agent-on-cloudflare | building-ai-agent-on-cloudflare / 1 | durable-objects / 1 | durable-objects / 1 | Cloudflare workers | durable-objects -> sandbox-sdk -> agents-sdk -> workers-best-practices -> building-ai-agent-on-cloudflare |
| huggingface-gradio-vision-fresh | Hugging Face ML | Hugging Face ML | huggingface-gradio | huggingface-vision-trainer / 4 | huggingface-vision-trainer / 6 | huggingface-gradio / 1 | Hugging Face ML | huggingface-gradio -> huggingface-vision-trainer -> huggingface-paper-publisher -> huggingface-trackio -> huggingface-community-evals |
| api-versioning-docs-fresh | Documents and publishing | Documents and PDFs | api-versioning-strategy | api-versioning-strategy / 1 | api-versioning-strategy / 1 | api-versioning-strategy / 1 | Backend APIs and services | api-versioning-strategy -> api-docs-writer -> dev-backend-api-design -> technical-spec-template -> dev-java-dotnet-services |
| launch-risk-flags-fresh | Product, research, and planning | Product planning | launch-readiness | launch-readiness / 1 | launch-readiness / 1 | launch-readiness / 1 | Product planning | launch-readiness -> risk-register -> feature-flag-guide -> product-launch-checklist -> dev-release-productization |
| gmail-label-draft-fresh | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail-inbox-triage / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> triage-finding -> engineering-weekly-report |
| security-diff-remediation-fresh | Security and risk | Security review | security-diff-scan | security-diff-scan / 1 | security-diff-scan / 1 | security-diff-scan / 1 | Security review | security-diff-scan -> validation -> deep-security-scan -> track-findings -> triage-finding |
| electron-native-release-fresh | Frontend experience | Frontend implementation | dev-mobile-desktop | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | Frontend implementation | dev-mobile-desktop -> winui-app -> launch-readiness -> dev-release-productization -> frontend-app-builder |
| creative-competitor-offer-fresh | Marketing, growth, and creative | Marketing growth | creative-offer | creative-ads-explorer / 2 | creative-ads-explorer / 4 | creative-offer / 1 | Marketing growth | creative-offer -> creative-ads-explorer -> creative-positioning -> competitive-intelligence-monitor -> creative-production |
| voice-browser-loop-fresh | AI agent apps | Agent and LLM apps | transcribe | control-in-app-browser / 37 | speech / 9 | transcribe / 1 | Agent and LLM apps | transcribe -> speech -> transformers-js -> frontend-testing-debugging -> openai-agents-js |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| notion-meeting-email-fresh | notion-spec-to-implementation | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> notion-knowledge-capture -> email-triage |
| vercel-bot-firewall-fresh | security-best-practices | vercel-firewall -> vercel-deploy -> building-mcp-server-on-cloudflare -> env-vars -> agent-browser-verify |
| postgres-migration-rollback-fresh | api-versioning-strategy | database-migration-plan -> database-schema-design -> dev-database-postgres -> data-quality-audit -> data-analysis-standard |
| durable-object-agent-fresh | wrangler | durable-objects -> sandbox-sdk -> agents-sdk -> workers-best-practices -> building-ai-agent-on-cloudflare |

## Interpretation

On the fresh-probe regression suite, SkillWeaver V2 changes the composite output-quality score by +25.2 points versus no SkillWeaver and +21.0 points versus the skill-level baseline.
V2 changes primary selection by +27.8 percentage points versus no SkillWeaver and +22.2 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +11.1 percentage points versus no SkillWeaver and +11.1 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
