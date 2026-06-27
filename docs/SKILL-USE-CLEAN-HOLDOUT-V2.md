# SkillWeaver V2 Clean Holdout V2 Benchmark

Generated: 2026-06-27T20:21:59.974Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782591719974,"command":"npm run benchmark:skills:clean","suite":{"id":"clean-holdout-v2","label":"Clean Holdout V2","gatesAcceptance":false},"git":{"commit":"3cd6e51f971b91248e621893ce15a492288fe63c","dirty":true,"dirtyPaths":["benchmarks/skill-routing-clean-holdout-v2.json","package.json","scripts/benchmark-skill-routing.mjs"]},"invalidatingDirtyPaths":["benchmarks/skill-routing-clean-holdout-v2.json","package.json","scripts/benchmark-skill-routing.mjs"],"cases":{"count":14,"sha256":"sha256:93f204a9f5f9cd83d97bb61edd3ebafca650d4980360ba4bfdc808cbc1699af1"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:93f204a9f5f9cd83d97bb61edd3ebafca650d4980360ba4bfdc808cbc1699af1","scanner":"sha256:68ae684585fd5f2f9e18fde3fbaa98e253f12d64ebc244d658258445f811fb1d","benchmarkScript":"sha256:ad2bd39b4a674255cb246240d99c398632630a58a08e6e7af9cd0da5825ff639","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"nongating":true,"qualityGate":{"ok":false,"failures":["V2 output quality must beat no SkillWeaver.","V2 output quality must beat the skill-level baseline.","V2 expected top/workflow-5 retrieval must not regress.","V2 forbidden primary rate must stay at 0.","V2 mean candidates to expected skill should stay near 1."]}},"snapshotFingerprint":"sha256:0b5516592ab4a7c28f02c6b2040e885ae6662ca9bd1ab017261394f50110d40f"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills:clean`
- Suite: Clean Holdout V2
- Acceptance gate: no
- Git commit at generation: `3cd6e51f971b91248e621893ce15a492288fe63c`
- Git dirty: yes
- Invalidating dirty paths: `benchmarks/skill-routing-clean-holdout-v2.json`, `package.json`, `scripts/benchmark-skill-routing.mjs`
- Case hash: `sha256:93f204a9f5f9cd83d97bb61edd3ebafca650d4980360ba4bfdc808cbc1699af1`
- Scanner hash: `sha256:68ae684585fd5f2f9e18fde3fbaa98e253f12d64ebc244d658258445f811fb1d`
- Benchmark script hash: `sha256:ad2bd39b4a674255cb246240d99c398632630a58a08e6e7af9cd0da5825ff639`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:0b5516592ab4a7c28f02c6b2040e885ae6662ca9bd1ab017261394f50110d40f`
- Freshness check: pass
- Quality gate, reported only: fail: V2 output quality must beat no SkillWeaver.; V2 output quality must beat the skill-level baseline.; V2 expected top/workflow-5 retrieval must not regress.; V2 forbidden primary rate must stay at 0.; V2 mean candidates to expected skill should stay near 1.

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 14

## Suite Role

This suite is intended as untouched holdout evidence for current V2 routing. Cases include provenance fields and were frozen before any routing changes from their results. The report is non-gating so failures can expose real gaps without weakening the active acceptance suite.

## Case Provenance

- Cases with provenance fields: 14/14.
- Source mix: subagent-audit: 14.
- Suite state mix: untouched-holdout: 14.
- Promotion status mix: candidate: 14.
- Support criticality mix: primary-critical: 11, support-critical: 3.

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 68.3 | 79.0 | 61.3 | -7.0 pts | -17.7 pts |
| Primary hit@1 | 71.4% | 85.7% | 57.1% | -14.3 pp | -28.6 pp |
| Expected skill in top/workflow 5 | 92.9% | 100.0% | 78.6% | -14.3 pp | -21.4 pp |
| Mean reciprocal rank | 0.794 | 0.903 | 0.684 | -0.110 | -0.219 |
| Support-skill coverage@5 | 26.2% | 33.3% | 45.2% | +19.0 pp | +11.9 pp |
| Support precision@5, exploratory | 19.6% | 25.6% | 33.9% | +14.3 pp | +8.3 pp |
| Forbidden primary rate, lower is better | 7.1% | 7.1% | 35.7% | +28.6 pp worse | +28.6 pp worse |
| Mean candidates to expected skill, lower is better | 2.1 | 1.5 | 8.9 | +6.9 candidates worse | +7.4 candidates worse |

## Claim Scope

This report is an untouched-holdout baseline for prompts captured after the latest routing-tuning commit and before any tuning from this suite. It supports a clean-split claim only while no misses from these prompts have informed routing changes: 8/14 primary hit@1, 11/14 expected primary in top/workflow five, 5/14 forbidden primaries, support coverage@5 45.2%, support precision@5 33.9%, and 13/14 support-miss cases. If this suite later drives tuning, relabel it as challenge or regression evidence before citing it again.

V2 raw counts: primary hit@1 8/14; expected primary top/workflow-five 11/14; forbidden primary 5/14; support-miss cases 13/14.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.
Clean Holdout V2 quality is intentionally reported rather than accepted or failed; the freshness check only proves that the report matches the current code, corpus, and clean holdout v2 cases.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 3 | 56.1 | 33.3% | 100.0% | 55.6% | 41.7% | 66.7% | 3/3 | -28.3 pts | -35.0 pts |
| Data analytics | 2 | 25.1 | 0.0% | 50.0% | 50.0% | 37.5% | 50.0% | 1/2 | -36.6 pts | -36.6 pts |
| Product, research, and planning | 2 | 48.3 | 50.0% | 50.0% | 33.3% | 25.0% | 50.0% | 2/2 | +16.7 pts | -35.0 pts |
| AI agent apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Documents and publishing | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Hugging Face ML | 1 | 16.2 | 0.0% | 0.0% | 66.7% | 50.0% | 100.0% | 1/1 | +0.6 pts | -13.3 pts |
| Infrastructure platforms | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Platform delivery | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Security and risk | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill tooling | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cloudflare workers | 2 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 2/2 | +6.7 pts | +3.3 pts |
| Data dashboards and reports | 2 | 25.1 | 0.0% | 50.0% | 50.0% | 37.5% | 50.0% | 1/2 | -36.6 pts | -36.6 pts |
| Figma design handoff | 2 | 61.7 | 50.0% | 100.0% | 33.3% | 25.0% | 50.0% | 2/2 | +5.8 pts | -25.0 pts |
| Agent and LLM apps | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | +6.7 pts |
| Browser verification | 1 | 38.3 | 0.0% | 100.0% | 66.7% | 50.0% | 100.0% | 1/1 | -48.3 pts | -55.0 pts |
| Deployment and release | 1 | 93.3 | 100.0% | 100.0% | 66.7% | 50.0% | 0.0% | 1/1 | +13.3 pts | 0.0 pts |
| Hugging Face ML | 1 | 16.2 | 0.0% | 0.0% | 66.7% | 50.0% | 100.0% | 1/1 | +0.6 pts | -13.3 pts |
| Presentations | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | +6.7 pts | 0.0 pts |
| Product planning | 1 | 10.0 | 0.0% | 0.0% | 33.3% | 25.0% | 100.0% | 1/1 | -21.7 pts | -70.0 pts |
| Security review | 1 | 80.0 | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 1/1 | 0.0 pts | 0.0 pts |
| Skill authoring | 1 | 86.7 | 100.0% | 100.0% | 33.3% | 25.0% | 0.0% | 1/1 | -6.7 pts | 0.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vercel-flags-experiment-holdout | Platform delivery | Deployment and release | vercel-flags | vercel-flags / 1 | vercel-flags / 1 | vercel-flags / 1 | Skill ranking anchor | vercel-flags -> experiment-designer -> feature-flag-guide -> design-kpis -> dev-release-productization |
| vercel-sandbox-secure-exec-holdout | AI agent apps | Agent and LLM apps | vercel-sandbox | vercel-sandbox / 1 | vercel-sandbox / 1 | vercel-sandbox / 1 | Skill ranking anchor | vercel-sandbox -> sandbox-sdk -> agent-browser-verify -> cloudflare -> copilot-sdk |
| agent-browser-preview-qa-holdout | Frontend experience | Browser verification | agent-browser-verify | agent-browser-verify / 1 | agent-browser-verify / 1 | control-in-app-browser !control-in-app-browser / 4 | Browser verification | control-in-app-browser -> frontend-testing-debugging -> playwright-interactive -> agent-browser-verify -> agent-browser |
| cloudflare-sandbox-worker-holdout | Infrastructure platforms | Cloudflare workers | sandbox-sdk | sandbox-sdk / 1 | sandbox-sdk / 1 | sandbox-sdk / 1 | Cloudflare workers | sandbox-sdk -> workers-best-practices -> wrangler -> cloudflare -> agents-sdk |
| data-viz-accessible-report-holdout | Data analytics | Data dashboards and reports | data-visualization, visualize-data, build-report | accessibility-and-inclusive-visualization / 2 | accessibility-and-inclusive-visualization / 2 | accessibility-and-inclusive-visualization / 2 | Data dashboards and reports | accessibility-and-inclusive-visualization -> data-visualization -> testing-data-visualizations -> visualization-strategy-and-critique -> d3-data-visualization |
| data-jupyter-audit-trail-holdout | Data analytics | Data dashboards and reports | jupyter-notebooks | jupyter-notebooks / 1 | jupyter-notebooks / 1 | build-dashboard !build-dashboard / 96 | Data dashboards and reports | build-dashboard -> data-quality-audit -> visualize-data -> data-visualization -> skill-security-auditor |
| figma-code-connect-holdout | Frontend experience | Figma design handoff | figma-code-connect-components, figma-code-connect | figma-code-connect / 1 | figma-code-connect-components / 1 | figma-implement-design !figma-implement-design / 2 | Figma design handoff | figma-implement-design -> figma-code-connect-components -> figma-use -> figma-generate-design -> figma-create-design-system-rules |
| figjam-user-flow-holdout | Product, research, and planning | Figma design handoff | figma-use-figjam, figma-user-flow-planner | figma-code-connect / 4 | figma-user-flow-planner / 1 | figma-user-flow-planner / 1 | Skill ranking anchor | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | Skill tooling | Skill authoring | skill-security-auditor | skill-security-auditor / 1 | skill-security-auditor / 1 | skill-security-auditor / 1 | Skill authoring | skill-security-auditor -> skill-installer -> skill-creator -> copilot-sdk -> plugin-creator |
| security-ownership-map-holdout | Security and risk | Security review | security-ownership-map | security-ownership-map / 1 | security-ownership-map / 1 | security-ownership-map / 1 | Skill ranking anchor | security-ownership-map -> security-threat-model -> threat-model -> dev-security-engineering -> triage-finding |
| huggingface-trackio-eval-holdout | Hugging Face ML | Hugging Face ML | huggingface-trackio | huggingface-papers !huggingface-papers / 9 | huggingface-papers !huggingface-papers / 7 | huggingface-gradio !huggingface-gradio / 7 | Hugging Face ML | huggingface-gradio -> huggingface-paper-publisher -> huggingface-community-evals -> hf-cli -> huggingface-papers |
| template-creator-artifact-skill-holdout | Documents and publishing | Presentations | template-creator | template-creator / 1 | template-creator / 1 | template-creator / 1 | Skill ranking anchor | template-creator -> Presentations -> figma-use-slides -> reports-pdfs-and-slide-automation -> roadmap-presentation |
| linear-notion-roadmap-holdout | Product, research, and planning | Product planning | roadmap-narrative, linear | notion-research-documentation / 4 | roadmap-narrative / 1 | gmail-inbox-triage !gmail-inbox-triage / 6 | Email triage | gmail-inbox-triage -> notion-knowledge-capture -> gmail -> prd-template -> notion-research-documentation |
| edge-web-perf-worker-holdout | Frontend experience | Cloudflare workers | web-perf | web-perf / 1 | web-perf / 1 | web-perf / 1 | Skill ranking anchor | web-perf -> workers-best-practices -> wrangler -> performance-budget -> durable-objects |

## V2 Support Misses

This table is a support-quality backlog source, not an acceptance failure list. A row should drive tuning only after promotion rules are met: the missing support is load-bearing, the prompt is frozen before tuning, and the change can improve support without regressing primary selection or increasing workflow noise.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| vercel-flags-experiment-holdout | launch-readiness | vercel-flags -> experiment-designer -> feature-flag-guide -> design-kpis -> dev-release-productization |
| vercel-sandbox-secure-exec-holdout | ai-sdk, security-best-practices | vercel-sandbox -> sandbox-sdk -> agent-browser-verify -> cloudflare -> copilot-sdk |
| agent-browser-preview-qa-holdout | vercel-deploy | control-in-app-browser -> frontend-testing-debugging -> playwright-interactive -> agent-browser-verify -> agent-browser |
| cloudflare-sandbox-worker-holdout | security-best-practices | sandbox-sdk -> workers-best-practices -> wrangler -> cloudflare -> agents-sdk |
| data-jupyter-audit-trail-holdout | data-analysis-standard, validate-data, build-report | build-dashboard -> data-quality-audit -> visualize-data -> data-visualization -> skill-security-auditor |
| figma-code-connect-holdout | figma-component-audit, dev-frontend-react-next | figma-implement-design -> figma-code-connect-components -> figma-use -> figma-generate-design -> figma-create-design-system-rules |
| figjam-user-flow-holdout | ux-research-plan, product-design:get-context | figma-user-flow-planner -> figma-create-new-file -> figma-use -> figma-code-connect-components -> figma-implement-design |
| skill-security-audit-holdout | skillweaver, security-best-practices | skill-security-auditor -> skill-installer -> skill-creator -> copilot-sdk -> plugin-creator |
| security-ownership-map-holdout | track-findings, risk-register, security-best-practices | security-ownership-map -> security-threat-model -> threat-model -> dev-security-engineering -> triage-finding |
| huggingface-trackio-eval-holdout | huggingface-llm-trainer | huggingface-gradio -> huggingface-paper-publisher -> huggingface-community-evals -> hf-cli -> huggingface-papers |
| template-creator-artifact-skill-holdout | documents, dev-documentation-systems | template-creator -> Presentations -> figma-use-slides -> reports-pdfs-and-slide-automation -> roadmap-presentation |
| linear-notion-roadmap-holdout | launch-readiness, feature-prioritisation | gmail-inbox-triage -> notion-knowledge-capture -> gmail -> prd-template -> notion-research-documentation |
| edge-web-perf-worker-holdout | frontend-testing-debugging | web-perf -> workers-best-practices -> wrangler -> performance-budget -> durable-objects |

## Interpretation

On the untouched holdout suite, SkillWeaver V2 changes the composite output-quality score by -7.0 points versus no SkillWeaver and -17.7 points versus the skill-level baseline.
V2 changes primary selection by -14.3 percentage points versus no SkillWeaver and -28.6 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by -14.3 percentage points versus no SkillWeaver and -21.4 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
