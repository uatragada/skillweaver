# SkillWeaver V2 Frozen Holdout Regression Benchmark

Generated: 2026-06-27T20:37:08.433Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782592628433,"command":"npm run benchmark:skills:frozen","suite":{"id":"frozen-holdout","label":"Frozen Holdout Regression","gatesAcceptance":false},"git":{"commit":"fb1b4cb310d3b721d7c92cbff5cb28d494def751","dirty":true,"dirtyPaths":["benchmarks/skill-routing-clean-holdout-v2.json","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","package.json","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["package.json","scripts/benchmark-skill-routing.mjs","server/skill-scanner.js"],"cases":{"count":12,"sha256":"sha256:3309a371b272bfdc676377e5738d8924ee43686e5e8c1ac2533a3faedc0a3948"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:3309a371b272bfdc676377e5738d8924ee43686e5e8c1ac2533a3faedc0a3948","scanner":"sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b","benchmarkScript":"sha256:014ce3ab1d7dd1afd100b9ae1359300efa8da4af124ac3541e45d6c3719a767c","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":true,"failures":[]}},"snapshotFingerprint":"sha256:1a32898b9e9a91ec29c897264c6d5baa648c6ae9103ed1fddc8f42f7a719008a"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:frozen`
- Suite: Frozen Holdout Regression
- Acceptance gate: no
- Git commit at generation: `fb1b4cb310d3b721d7c92cbff5cb28d494def751`
- Git dirty: yes
- Invalidating dirty paths: `package.json`, `scripts/benchmark-skill-routing.mjs`, `server/skill-scanner.js`
- Case hash: `sha256:3309a371b272bfdc676377e5738d8924ee43686e5e8c1ac2533a3faedc0a3948`
- Scanner hash: `sha256:f6421ea8451cee6bdbd30739a1cda982685717291f8935540de3b4577ad6d78b`
- Benchmark script hash: `sha256:014ce3ab1d7dd1afd100b9ae1359300efa8da4af124ac3541e45d6c3719a767c`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:1a32898b9e9a91ec29c897264c6d5baa648c6ae9103ed1fddc8f42f7a719008a`
- Freshness check: pass
- Quality gate, reported only: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 12

## Suite Role

This suite began as untouched frozen-holdout evidence, then its misses informed this routing pass. Treat the current checked-in report as non-gating regression evidence for that frozen prompt set. The pre-tuning baseline remains preserved in git history; a new clean holdout claim requires a fresh prompt set captured after these routing changes and reported before tuning from it.

## Case Provenance

- Cases with provenance fields: 12/12.
- Source mix: manual-fresh-holdout: 12.
- Suite state mix: regression: 12.
- Promotion status mix: candidate: 12.
- Support criticality mix: primary-critical: 5, support-critical: 7.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 70.6 | 69.8 | 95.6 | +24.9 pts | +25.7 pts |
| Primary hit@1 | 66.7% | 58.3% | 100.0% | +33.3 pp | +41.7 pp |
| Expected skill in top/workflow 5 | 83.3% | 100.0% | 100.0% | +16.7 pp | 0.0 pp |
| Mean reciprocal rank | 0.754 | 0.714 | 1.000 | +0.246 | +0.286 |
| Support-skill coverage@5 | 61.1% | 61.1% | 77.8% | +16.7 pp | +16.7 pp |
| Support precision@5, exploratory | 45.8% | 45.8% | 56.3% | +10.4 pp | +10.4 pp |
| Forbidden primary rate, lower is better | 8.3% | 16.7% | 0.0% | -8.3 pp better | -16.7 pp better |
| Mean candidates to expected skill, lower is better | 2.8 | 2.1 | 1.0 | -1.8 candidates better | -1.1 candidates better |

## Claim Scope

This report measures the current route against the previously frozen holdout prompt set after its misses informed routing fixes. Current results are regression evidence for those prompts, not clean-split generalization proof: 12/12 primary hit@1, 12/12 expected primary in top/workflow five, 0/12 forbidden primaries, support coverage@5 77.8%, support precision@5 56.3%, and 6/12 support-miss cases. Use the earlier frozen-holdout baseline report in git history for pre-tuning evidence.

V2 raw counts: primary hit@1 12/12; expected primary top/workflow-five 12/12; forbidden primary 0/12; support-miss cases 6/12.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Frozen Holdout Regression quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and frozen holdout regression cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 2 | 96.7 | 100.0% | 100.0% | 83.3% | 62.5% | 0.0% | 1/2 | +31.7 pts | +31.3 pts |
| AI agent apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +98.6 pts | +76.0 pts |
| Communications and knowledge | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Data analytics | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Documents and publishing | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Games and simulation | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +60.0 pts | +60.0 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | 0.0 pts | +50.0 pts |
| Marketing, growth, and creative | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.8 pts | +60.0 pts |
| Platform delivery | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill tooling | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0/1 | +98.6 pts | +76.0 pts |
| Browser verification | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +13.3 pts | +6.7 pts |
| Data dashboards and reports | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Deployment and release | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Email triage | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Figma design handoff | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +50.0 pts | +56.0 pts |
| Game development | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +60.0 pts | +60.0 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | 0.0 pts | +50.0 pts |
| Marketing growth | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Observability and reliability | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +83.8 pts | +60.0 pts |
| Presentations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +6.7 pts | 0.0 pts |
| Skill authoring | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| node-typescript-mcp-server-holdout | AI agent apps | Agent and LLM apps | dev-ai-llm-apps | building-mcp-server-on-cloudflare !building-mcp-server-on-cloudflare / 14 | chatgpt-apps !chatgpt-apps / 5 | dev-ai-llm-apps / 1 | Agent and LLM apps | dev-ai-llm-apps -> dev-node-typescript-services -> building-mcp-server-on-cloudflare -> api-docs-writer -> agents-sdk |
| gmail-notion-inbox-holdout | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail-inbox-triage / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> notion-meeting-intelligence -> triage-finding |
| phaser-sprite-hud-holdout | Games and simulation | Game development | sprite-pipeline | phaser-2d-game / 3 | phaser-2d-game / 3 | sprite-pipeline / 1 | Game development | sprite-pipeline -> phaser-2d-game -> game-playtest -> game-ui-frontend -> web-3d-asset-pipeline |
| vercel-storage-marketplace-holdout | Platform delivery | Deployment and release | vercel-storage | vercel-storage / 1 | vercel-storage / 1 | vercel-storage / 1 | Skill ranking anchor | vercel-storage -> vercel-api -> env-vars -> bootstrap -> building-mcp-server-on-cloudflare |
| analytics-semantic-layer-holdout | Data analytics | Data dashboards and reports | create-data-context | create-data-context / 1 | create-data-context / 1 | create-data-context / 1 | Skill ranking anchor | create-data-context -> product-business-analysis -> build-report -> build-dashboard -> design-kpis |
| otel-slo-tracing-holdout | Observability and reliability | Observability and reliability | dev-observability-sre | slo-error-budget / 7 | slo-error-budget / 3 | dev-observability-sre / 1 | Observability and reliability | dev-observability-sre -> monitoring-setup-guide -> slo-error-budget -> sentry -> performance-budget |
| huggingface-paper-evals-holdout | Hugging Face ML | Hugging Face ML | huggingface-paper-publisher | huggingface-paper-publisher / 1 | huggingface-papers / 2 | huggingface-paper-publisher / 1 | Hugging Face ML | huggingface-paper-publisher -> huggingface-datasets -> huggingface-community-evals -> huggingface-papers -> huggingface-vision-trainer |
| brand-logo-moodboard-holdout | Marketing, growth, and creative | Marketing growth | logo-explorer | logo-explorer / 1 | logo-explorer / 1 | logo-explorer / 1 | Skill ranking anchor | logo-explorer -> moodboard-explorer -> offer-explorer -> creative-production -> ads-explorer |
| in-app-browser-choice-holdout | Frontend experience | Browser verification | control-in-app-browser | control-in-app-browser / 1 | control-in-app-browser / 1 | control-in-app-browser / 1 | Browser verification | control-in-app-browser -> url-to-code -> playwright-interactive -> agent-browser -> design-image-to-code |
| figma-swiftui-motion-holdout | Frontend experience | Figma design handoff | figma-swiftui | figma-implement-motion / 2 | figma-implement-design !figma-implement-design / 5 | figma-swiftui / 1 | Figma design handoff | figma-swiftui -> figma-use-motion -> figma-use -> figma-implement-motion -> design-image-to-code |
| skill-install-security-holdout | Skill tooling | Skill authoring | skill-installer | skill-installer / 1 | skill-installer / 1 | skill-installer / 1 | Skill ranking anchor | skill-installer -> skill-security-auditor -> copilot-sdk -> template-creator -> skill-creator |
| analytics-report-to-slides-holdout | Documents and publishing | Presentations | reports-pdfs-and-slide-automation | reports-pdfs-and-slide-automation / 1 | reports-pdfs-and-slide-automation / 1 | reports-pdfs-and-slide-automation / 1 | Presentations | reports-pdfs-and-slide-automation -> build-report -> threejs-data-visualization -> Presentations -> template-creator |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| gmail-notion-inbox-holdout | notion-knowledge-capture | gmail-inbox-triage -> gmail -> email-triage -> notion-meeting-intelligence -> triage-finding |
| vercel-storage-marketplace-holdout | marketplace, nextjs | vercel-storage -> vercel-api -> env-vars -> bootstrap -> building-mcp-server-on-cloudflare |
| analytics-semantic-layer-holdout | gather-business-context, validate-data | create-data-context -> product-business-analysis -> build-report -> build-dashboard -> design-kpis |
| brand-logo-moodboard-holdout | positioning-explorer | logo-explorer -> moodboard-explorer -> offer-explorer -> creative-production -> ads-explorer |
| in-app-browser-choice-holdout | screenshot | control-in-app-browser -> url-to-code -> playwright-interactive -> agent-browser -> design-image-to-code |
| skill-install-security-holdout | skillweaver | skill-installer -> skill-security-auditor -> copilot-sdk -> template-creator -> skill-creator |

## Interpretation

On the frozen holdout regression suite, SkillWeaver V2 changes the composite output-quality score by +24.9 points versus no SkillWeaver and +25.7 points versus the skill-level baseline.
V2 changes primary selection by +33.3 percentage points versus no SkillWeaver and +41.7 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +16.7 percentage points versus no SkillWeaver and 0.0 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
