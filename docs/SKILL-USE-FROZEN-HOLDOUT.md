# SkillWeaver V2 Frozen Holdout Benchmark

Generated: 2026-06-27T19:53:30.530Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782590010530,"command":"npm run benchmark:skills:frozen","suite":{"id":"frozen-holdout","label":"Frozen Holdout","gatesAcceptance":false},"git":{"commit":"d7ba4be5b0d44a14961104a2c7e4e3aff5aba238","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":12,"sha256":"sha256:71a194bbd55bb5afa7f000ba03ab408ca3708433c17e4119c09f7a682165a099"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:71a194bbd55bb5afa7f000ba03ab408ca3708433c17e4119c09f7a682165a099","scanner":"sha256:9fe40c232a8a1d94d8df5f0b53184b708b8c81e54aec7e6f5ce4bb03aa3aa135","benchmarkScript":"sha256:87ba653f6982312617076c98b9b40595fe32addc551f2f595d1de86808b21434","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 output quality must beat no SkillWeaver.","V2 output quality must beat the skill-level baseline.","V2 expected top/workflow-5 retrieval must not regress.","V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:c9041e51cc98996b971949bcc13509ed9b67c299dd3f9079f98425a902ec7729"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:frozen`
- Suite: Frozen Holdout
- Acceptance gate: no
- Git commit at generation: `d7ba4be5b0d44a14961104a2c7e4e3aff5aba238`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:71a194bbd55bb5afa7f000ba03ab408ca3708433c17e4119c09f7a682165a099`
- Scanner hash: `sha256:9fe40c232a8a1d94d8df5f0b53184b708b8c81e54aec7e6f5ce4bb03aa3aa135`
- Benchmark script hash: `sha256:87ba653f6982312617076c98b9b40595fe32addc551f2f595d1de86808b21434`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:c9041e51cc98996b971949bcc13509ed9b67c299dd3f9079f98425a902ec7729`
- Freshness check: pass
- Quality gate, reported only: fail: V2 output quality must beat no SkillWeaver.; V2 output quality must beat the skill-level baseline.; V2 expected top/workflow-5 retrieval must not regress.; V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 12

## Suite Role

This suite is intended as untouched holdout evidence for current V2 routing. Cases include provenance fields and were frozen before any routing changes from their results. The report is non-gating so failures can expose real gaps without weakening the active acceptance suite.

## Case Provenance

- Cases with provenance fields: 12/12.
- Source mix: manual-fresh-holdout: 12.
- Suite state mix: untouched-holdout: 12.
- Promotion status mix: candidate: 12.
- Support criticality mix: primary-critical: 5, support-critical: 7.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 67.3 | 66.5 | 59.1 | -8.2 pts | -7.4 pts |
| Primary hit@1 | 58.3% | 50.0% | 41.7% | -16.7 pp | -8.3 pp |
| Expected skill in top/workflow 5 | 83.3% | 100.0% | 83.3% | 0.0 pp | -16.7 pp |
| Mean reciprocal rank | 0.754 | 0.714 | 0.620 | -0.134 | -0.094 |
| Support-skill coverage@5 | 61.1% | 61.1% | 66.7% | +5.6 pp | +5.6 pp |
| Support precision@5, exploratory | 45.8% | 45.8% | 50.0% | +4.2 pp | +4.2 pp |
| Forbidden primary rate, lower is better | 16.7% | 25.0% | 33.3% | +16.7 pp worse | +8.3 pp worse |
| Mean candidates to expected skill, lower is better | 2.8 | 2.1 | 3.9 | +1.1 candidates worse | +1.8 candidates worse |

## Claim Scope

This report is a frozen-holdout baseline for prompts captured after the latest routing-tuning commit and before any tuning from this suite. It supports a clean-split claim only while no misses from these prompts have informed routing changes: 5/12 primary hit@1, 10/12 expected primary in top/workflow five, 4/12 forbidden primaries, support coverage@5 66.7%, support precision@5 50.0%, and 8/12 support-miss cases. If this suite later drives tuning, relabel it as challenge or regression evidence before citing it again.

V2 raw counts: primary hit@1 5/12; expected primary top/workflow-five 10/12; forbidden primary 4/12; support-miss cases 8/12.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Frozen Holdout quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and frozen holdout cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 2 | 30.1 | 0.0% | 50.0% | 83.3% | 62.5% | 50.0% | 1/2 | -34.9 pts | -35.3 pts |
| AI agent apps | 1 | 1.3 | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 1/1 | -0.2 pts | -22.8 pts |
| Communications and knowledge | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | -56.7 pts | -50.0 pts |
| Data analytics | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Documents and publishing | 1 | 60.0 | 0.0% | 100.0% | 100.0% | 75.0% | 100.0% | 0/1 | +6.7 pts | 0.0 pts |
| Games and simulation | 1 | 37.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -2.7 pts | -2.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | 0.0 pts | +50.0 pts |
| Marketing, growth, and creative | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Observability and reliability | 1 | 46.7 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +30.5 pts | +6.7 pts |
| Platform delivery | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill tooling | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Agent and LLM apps | 1 | 1.3 | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 1/1 | -0.2 pts | -22.8 pts |
| Browser verification | 1 | 38.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | -41.7 pts | -48.3 pts |
| Data dashboards and reports | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |
| Deployment and release | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Email triage | 1 | 43.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | -56.7 pts | -50.0 pts |
| Figma design handoff | 1 | 21.8 | 0.0% | 0.0% | 100.0% | 75.0% | 0.0% | 0/1 | -28.2 pts | -22.2 pts |
| Game development | 1 | 37.3 | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -2.7 pts | -2.7 pts |
| Hugging Face ML | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | 0.0 pts | +50.0 pts |
| Marketing growth | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | -6.7 pts | -6.7 pts |
| Observability and reliability | 1 | 46.7 | 0.0% | 100.0% | 100.0% | 75.0% | 0.0% | 0/1 | +30.5 pts | +6.7 pts |
| Presentations | 1 | 60.0 | 0.0% | 100.0% | 100.0% | 75.0% | 100.0% | 0/1 | +6.7 pts | 0.0 pts |
| Skill authoring | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| node-typescript-mcp-server-holdout | AI agent apps | Agent and LLM apps | dev-ai-llm-apps | building-mcp-server-on-cloudflare !building-mcp-server-on-cloudflare / 14 | chatgpt-apps !chatgpt-apps / 5 | building-mcp-server-on-cloudflare !building-mcp-server-on-cloudflare / 16 | Cloudflare workers | building-mcp-server-on-cloudflare -> chatgpt-apps -> wrangler -> workers-best-practices -> agents-sdk |
| gmail-notion-inbox-holdout | Communications and knowledge | Email triage | gmail-inbox-triage, gmail | gmail-inbox-triage / 1 | gmail / 1 | notion-meeting-intelligence !notion-meeting-intelligence / 2 | Product planning | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> email-triage -> triage-finding |
| phaser-sprite-hud-holdout | Games and simulation | Game development | sprite-pipeline | phaser-2d-game / 3 | phaser-2d-game / 3 | game-playtest / 5 | Game development | game-playtest -> web-3d-asset-pipeline -> phaser-2d-game -> three-webgl-game -> sprite-pipeline |
| vercel-storage-marketplace-holdout | Platform delivery | Deployment and release | vercel-storage | vercel-storage / 1 | vercel-storage / 1 | vercel-storage / 1 | Skill ranking anchor | vercel-storage -> vercel-api -> env-vars -> bootstrap -> sandbox-sdk |
| analytics-semantic-layer-holdout | Data analytics | Data dashboards and reports | create-data-context | create-data-context / 1 | create-data-context / 1 | create-data-context / 1 | Skill ranking anchor | create-data-context -> product-business-analysis -> build-report -> build-dashboard -> design-kpis |
| otel-slo-tracing-holdout | Observability and reliability | Observability and reliability | dev-observability-sre | slo-error-budget / 7 | slo-error-budget / 3 | sentry / 3 | Observability and reliability | sentry -> monitoring-setup-guide -> dev-observability-sre -> slo-error-budget -> performance-budget |
| huggingface-paper-evals-holdout | Hugging Face ML | Hugging Face ML | huggingface-paper-publisher | huggingface-paper-publisher / 1 | huggingface-papers / 2 | huggingface-paper-publisher / 1 | Hugging Face ML | huggingface-paper-publisher -> huggingface-datasets -> huggingface-community-evals -> huggingface-papers -> huggingface-vision-trainer |
| brand-logo-moodboard-holdout | Marketing, growth, and creative | Marketing growth | logo-explorer | logo-explorer / 1 | logo-explorer / 1 | logo-explorer / 1 | Skill ranking anchor | logo-explorer -> moodboard-explorer -> offer-explorer -> creative-production -> ads-explorer |
| in-app-browser-choice-holdout | Frontend experience | Browser verification | control-in-app-browser | control-in-app-browser / 1 | control-in-app-browser / 1 | control-chrome !control-chrome / 4 | Browser verification | control-chrome -> design-url-to-code -> url-to-code -> control-in-app-browser -> playwright-interactive |
| figma-swiftui-motion-holdout | Frontend experience | Figma design handoff | figma-swiftui | figma-implement-motion / 2 | figma-implement-design !figma-implement-design / 5 | figma-use / 11 | Figma design handoff | figma-use -> figma-implement-design -> figma-implement-motion -> figma-code-connect-components -> design-handoff-brief |
| skill-install-security-holdout | Skill tooling | Skill authoring | skill-installer | skill-installer / 1 | skill-installer / 1 | skill-installer / 1 | Skill ranking anchor | skill-installer -> skill-security-auditor -> copilot-sdk -> template-creator -> skill-creator |
| analytics-report-to-slides-holdout | Documents and publishing | Presentations | reports-pdfs-and-slide-automation | reports-pdfs-and-slide-automation !pdf / 1 | reports-pdfs-and-slide-automation !pdf / 1 | reports-pdfs-and-slide-automation !pdf / 1 | Presentations | reports-pdfs-and-slide-automation -> build-report -> threejs-data-visualization -> Presentations -> template-creator |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| node-typescript-mcp-server-holdout | dev-node-typescript-services, api-docs-writer | building-mcp-server-on-cloudflare -> chatgpt-apps -> wrangler -> workers-best-practices -> agents-sdk |
| gmail-notion-inbox-holdout | notion-knowledge-capture | notion-meeting-intelligence -> gmail -> gmail-inbox-triage -> email-triage -> triage-finding |
| phaser-sprite-hud-holdout | game-ui-frontend | game-playtest -> web-3d-asset-pipeline -> phaser-2d-game -> three-webgl-game -> sprite-pipeline |
| vercel-storage-marketplace-holdout | marketplace, nextjs | vercel-storage -> vercel-api -> env-vars -> bootstrap -> sandbox-sdk |
| analytics-semantic-layer-holdout | gather-business-context, validate-data | create-data-context -> product-business-analysis -> build-report -> build-dashboard -> design-kpis |
| brand-logo-moodboard-holdout | positioning-explorer | logo-explorer -> moodboard-explorer -> offer-explorer -> creative-production -> ads-explorer |
| in-app-browser-choice-holdout | screenshot | control-chrome -> design-url-to-code -> url-to-code -> control-in-app-browser -> playwright-interactive |
| skill-install-security-holdout | skillweaver | skill-installer -> skill-security-auditor -> copilot-sdk -> template-creator -> skill-creator |

## Interpretation

On the frozen holdout suite, SkillWeaver V2 changes the composite output-quality score by -8.2 points versus no SkillWeaver and -7.4 points versus the skill-level baseline.
V2 changes primary selection by -16.7 percentage points versus no SkillWeaver and -8.3 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by 0.0 percentage points versus no SkillWeaver and -16.7 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
