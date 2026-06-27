# SkillWeaver V2 Fresh-Probe Regression Benchmark

Generated: 2026-06-27T20:12:00.934Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782591120934,"command":"npm run benchmark:skills:fresh","suite":{"id":"fresh","label":"Fresh-Probe Regression","gatesAcceptance":false},"git":{"commit":"8d7fa7e6a8ad281d9b7e629b94f6b5c2ae7753fa","dirty":true,"dirtyPaths":["README.md","benchmarks/skill-routing-frozen-holdout.json","docs/ROUTING-EVAL-METHODOLOGY.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","docs/SUPPORT-QUALITY-ROADMAP.md","docs/V2-EXPERIMENT-LOG.md","docs/VERIFICATION.md","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["scripts/benchmark-skill-routing.mjs","server/skill-scanner.js"],"cases":{"count":18,"sha256":"sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea","scanner":"sha256:68ae684585fd5f2f9e18fde3fbaa98e253f12d64ebc244d658258445f811fb1d","benchmarkScript":"sha256:e18ae157485a61ff61e9f5369349e32758de712b17e7714a76c980871ecd55aa","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:a631b4c01d5a5bb3989bc099fc5c43a3c93c987f042d7cb4ec3050f8ff8271e3"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:fresh`
- Suite: Fresh-Probe Regression
- Acceptance gate: no
- Git commit at generation: `8d7fa7e6a8ad281d9b7e629b94f6b5c2ae7753fa`
- Git dirty: yes
- Invalidating dirty paths: `scripts/benchmark-skill-routing.mjs`, `server/skill-scanner.js`
- Case hash: `sha256:32271c1c7467fa4d43192d60151c1ea4acd7eac1cf7b2eb00dc0610d026beaea`
- Scanner hash: `sha256:68ae684585fd5f2f9e18fde3fbaa98e253f12d64ebc244d658258445f811fb1d`
- Benchmark script hash: `sha256:e18ae157485a61ff61e9f5369349e32758de712b17e7714a76c980871ecd55aa`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:a631b4c01d5a5bb3989bc099fc5c43a3c93c987f042d7cb4ec3050f8ff8271e3`
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

This suite began as fresh generalization evidence collected after the previous routing-tuning work. Once misses from these prompts informed fixes, the checked-in report became non-gating regression evidence for the fresh-probe slice. A future untouched generalization claim requires another prompt set collected after the latest routing-tuning commit.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 70.2 | 74.3 | 94.6 | +24.4 pts | +20.3 pts |
| Primary hit@1 | 66.7% | 72.2% | 94.4% | +27.8 pp | +22.2 pp |
| Expected skill in top/workflow 5 | 88.9% | 88.9% | 100.0% | +11.1 pp | +11.1 pp |
| Mean reciprocal rank | 0.760 | 0.791 | 0.963 | +0.203 | +0.172 |
| Support-skill coverage@5 | 52.8% | 59.3% | 88.0% | +35.2 pp | +28.7 pp |
| Support precision@5, exploratory | 30.6% | 34.7% | 50.0% | +19.4 pp | +15.3 pp |
| Forbidden primary rate, lower is better | 0.0% | 0.0% | 0.0% | 0.0 pp | 0.0 pp |
| Mean candidates to expected skill, lower is better | 4.2 | 2.1 | 1.1 | -3.1 candidates better | -1.0 candidates better |

## Claim Scope

This report measures the current route against an 18-case suite that began as a fresh generalization probe. Current results are regression evidence for those prompts: 17/18 primary hit@1, 18/18 expected primary in top/workflow five, 0/18 forbidden primaries, support coverage@5 88.0%, support precision@5 50.0%, and 5/18 support-miss cases. Use the experiment log for the pre-tuning fresh-probe result; this report is not proof that cross-domain routing is solved.

V2 raw counts: primary hit@1 17/18; expected primary top/workflow-five 18/18; forbidden primary 0/18; support-miss cases 5/18.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Fresh-Probe Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and fresh-probe regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI agent apps | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 62.5% | 0.0% | 0/2 | +48.1 pts | +43.8 pts |
| Communications and knowledge | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 25.0% | 0.0% | 1/2 | +21.7 pts | +22.5 pts |
| Security and risk | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 50.0% | 0.0% | 1/2 | +8.3 pts | +6.7 pts |
| Backend services | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 1/1 | +88.8 pts | +10.0 pts |
| Data analytics | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Database and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Frontend experience | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Games and simulation | 1 | 46.7 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | -46.7 pts | -46.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +65.0 pts | +76.7 pts |
| Infrastructure platforms | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | +6.7 pts |
| Marketing, growth, and creative | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +60.0 pts | +76.0 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +56.7 pts | +56.7 pts |
| Product, research, and planning | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Repo collaboration | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cloudflare workers | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 50.0% | 0.0% | 1/2 | +5.0 pts | +8.3 pts |
| Product planning | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 37.5% | 0.0% | 1/2 | +26.7 pts | +22.5 pts |
| Security review | 2 | 95.0 | 100.0% | 100.0% | 75.0% | 50.0% | 0.0% | 1/2 | +8.3 pts | +6.7 pts |
| Agent and LLM apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +86.1 pts | +77.5 pts |
| Backend APIs and services | 1 | 90.0 | 100.0% | 100.0% | 50.0% | 25.0% | 0.0% | 1/1 | +88.8 pts | +10.0 pts |
| Data dashboards and reports | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | 0.0 pts |
| Databases and data engineering | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Documents and PDFs | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |
| Email triage | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Frontend implementation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +20.0 pts | +20.0 pts |
| Game development | 1 | 46.7 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | -46.7 pts | -46.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +65.0 pts | +76.7 pts |
| Marketing growth | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +60.0 pts | +76.0 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +56.7 pts | +56.7 pts |
| Repository operations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +10.0 pts | +10.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-server-cloudflare-fresh | AI agent apps | Cloudflare workers | building-mcp-server-on-cloudflare | building-mcp-server-on-cloudflare / 1 | building-mcp-server-on-cloudflare / 1 | building-mcp-server-on-cloudflare / 1 | Cloudflare workers | building-mcp-server-on-cloudflare -> wrangler -> workers-best-practices -> agents-sdk -> durable-objects |
| game-ui-playtest-fresh | Games and simulation | Game development | phaser-2d-game, game-studio | phaser-2d-game / 1 | phaser-2d-game / 1 | sprite-pipeline / 3 | Game development | sprite-pipeline -> game-ui-frontend -> game-studio -> game-playtest -> phaser-2d-game |
| notion-meeting-email-fresh | Communications and knowledge | Product planning | notion-meeting-intelligence | notion-spec-to-implementation / 3 | gmail / 4 | notion-meeting-intelligence / 1 | Product planning | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> notion-knowledge-capture -> email-triage |
| vercel-auth-protection-fresh | Backend services | Backend APIs and services | auth | vercel-api / 16 | auth / 1 | auth / 1 | Backend APIs and services | auth -> security-best-practices -> dev-backend-api-design -> payments -> dev-security-engineering |
| vercel-bot-firewall-fresh | Security and risk | Security review | vercel-firewall | vercel-firewall / 1 | vercel-firewall / 1 | vercel-firewall / 1 | Skill ranking anchor | vercel-firewall -> vercel-deploy -> building-mcp-server-on-cloudflare -> env-vars -> agent-browser-verify |
| visualization-accessibility-review-fresh | Data analytics | Data dashboards and reports | accessibility-and-inclusive-visualization | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | accessibility-and-inclusive-visualization / 1 | Data dashboards and reports | accessibility-and-inclusive-visualization -> data-visualization -> testing-data-visualizations -> visualization-strategy-and-critique -> d3-data-visualization |
| postgres-migration-rollback-fresh | Database and data engineering | Databases and data engineering | database-migration-plan | database-migration-plan / 1 | database-migration-plan / 1 | database-migration-plan / 1 | Databases and data engineering | database-migration-plan -> database-schema-design -> dev-database-postgres -> data-quality-audit -> data-analysis-standard |
| sentry-incident-slo-fresh | Observability and reliability | Observability and reliability | incident-postmortem | slo-error-budget / 2 | slo-error-budget / 2 | incident-postmortem / 1 | Observability and reliability | incident-postmortem -> sentry -> slo-error-budget -> dev-observability-sre -> monitoring-setup-guide |
| dependency-conflict-monorepo-fresh | Repo collaboration | Repository operations | dependency-conflict-resolver | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | Repository operations | dependency-conflict-resolver -> dev-monorepo-build-systems -> dev-git-github-collaboration -> turborepo -> gh-fix-ci |
| durable-object-agent-fresh | Infrastructure platforms | Cloudflare workers | durable-objects, building-ai-agent-on-cloudflare | building-ai-agent-on-cloudflare / 1 | durable-objects / 1 | durable-objects / 1 | Cloudflare workers | durable-objects -> sandbox-sdk -> workers-best-practices -> agents-sdk -> building-ai-agent-on-cloudflare |
| huggingface-gradio-vision-fresh | Hugging Face ML | Hugging Face ML | huggingface-gradio | huggingface-vision-trainer / 4 | huggingface-vision-trainer / 6 | huggingface-gradio / 1 | Hugging Face ML | huggingface-gradio -> huggingface-vision-trainer -> huggingface-trackio -> huggingface-paper-publisher -> huggingface-community-evals |
| api-versioning-docs-fresh | Documents and publishing | Documents and PDFs | api-versioning-strategy | api-versioning-strategy / 1 | api-versioning-strategy / 1 | api-versioning-strategy / 1 | Backend APIs and services | api-versioning-strategy -> api-docs-writer -> dev-backend-api-design -> technical-spec-template -> dev-java-dotnet-services |
| launch-risk-flags-fresh | Product, research, and planning | Product planning | launch-readiness | launch-readiness / 1 | launch-readiness / 1 | launch-readiness / 1 | Product planning | launch-readiness -> risk-register -> feature-flag-guide -> product-launch-checklist -> dev-release-productization |
| gmail-label-draft-fresh | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail-inbox-triage / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> triage-finding -> engineering-weekly-report |
| security-diff-remediation-fresh | Security and risk | Security review | security-diff-scan | security-diff-scan / 1 | security-diff-scan / 1 | security-diff-scan / 1 | Security review | security-diff-scan -> deep-security-scan -> track-findings -> validation -> triage-finding |
| electron-native-release-fresh | Frontend experience | Frontend implementation | dev-mobile-desktop | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | Frontend implementation | dev-mobile-desktop -> winui-app -> chatgpt-apps -> launch-readiness -> dev-release-productization |
| creative-competitor-offer-fresh | Marketing, growth, and creative | Marketing growth | creative-offer | creative-ads-explorer / 2 | creative-ads-explorer / 5 | creative-offer / 1 | Marketing growth | creative-offer -> creative-ads-explorer -> creative-positioning -> competitive-intelligence-monitor -> business-strategy-and-research |
| voice-browser-loop-fresh | AI agent apps | Agent and LLM apps | transcribe | control-in-app-browser / 37 | speech / 8 | transcribe / 1 | Agent and LLM apps | transcribe -> speech -> transformers-js -> frontend-testing-debugging -> control-in-app-browser |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| notion-meeting-email-fresh | notion-spec-to-implementation | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> notion-knowledge-capture -> email-triage |
| vercel-auth-protection-fresh | env-vars | auth -> security-best-practices -> dev-backend-api-design -> payments -> dev-security-engineering |
| vercel-bot-firewall-fresh | security-best-practices | vercel-firewall -> vercel-deploy -> building-mcp-server-on-cloudflare -> env-vars -> agent-browser-verify |
| postgres-migration-rollback-fresh | api-versioning-strategy | database-migration-plan -> database-schema-design -> dev-database-postgres -> data-quality-audit -> data-analysis-standard |
| durable-object-agent-fresh | wrangler | durable-objects -> sandbox-sdk -> workers-best-practices -> agents-sdk -> building-ai-agent-on-cloudflare |

## Interpretation

On the fresh-probe regression suite, SkillWeaver V2 changes the composite output-quality score by +24.4 points versus no SkillWeaver and +20.3 points versus the skill-level baseline.
V2 changes primary selection by +27.8 percentage points versus no SkillWeaver and +22.2 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +11.1 percentage points versus no SkillWeaver and +11.1 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
