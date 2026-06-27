# Support Quality Roadmap

Date: 2026-06-27

This roadmap turns V2's remaining workflow-quality gaps into deliberate research work. It is not a new gate and it is not a tuning checklist. The goal is to keep the concept map useful across more domains without adding runtime bloat, overfitting the current suites, or weakening claim discipline.

## Current Evidence

| Suite | Cases | V2 primary hit@1 | V2 support coverage@5 | V2 support precision@5 | Support-miss cases | Role |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Active acceptance | 78 | 100.0% | 100.0% | 40.9% | 0 | Regression gate |
| Post-tuning challenge | 22 | 95.5% | 68.2% | 34.1% | 12 | Non-gating pressure |
| Fresh-probe regression | 18 | 94.4% | 88.0% | 50.0% | 5 | Non-gating regression |
| Frozen holdout regression | 12 | 100.0% | 77.8% | 56.3% | 6 | Non-gating regression |
| Clean holdout V2 regression | 14 | 100.0% | 52.4% | 39.3% | 14 | Non-gating regression |

The active suite proves the current acceptance claim. The challenge, fresh-probe, frozen-holdout-regression, and clean-holdout V2 regression suites show where support recommendations can compound, but they are not clean generalization proof because their misses have already informed V2 work. The pre-tuning frozen-holdout baseline and clean V2 baseline are preserved in git history. Broad generalization claims should stay off the table until a new clean holdout is captured after this tuning pass.

## Triage Rules

Classify support misses before changing routing:

| Priority | Meaning | Action |
| --- | --- | --- |
| P0 | Primary skill or forbidden-primary problem | Fix only with a frozen case, atlas entry, and full benchmark check |
| P1 | Missing support changes correctness, safety, deployment, or verification | Promote only after recurrence or a new clean holdout result |
| P2 | Missing support improves handoff quality but does not change correctness | Keep in backlog unless repeated in real task logs |
| P3 | Nice-to-have helper or ambiguous support expectation | Do not tune; consider removing expectation if it proves non-load-bearing |

Do not tune from the current challenge, fresh, or frozen-regression support misses directly. A support fix should have a fresh prompt captured before tuning, a named confusable rival, and a support-precision check after tuning.

For future clean holdouts, do not tune from the holdout inside the same evidence pass. If one of those cases becomes a routing target, first promote it with a failure-atlas entry, relabel the suite or fork the case into a challenge/regression file, and preserve the current report as the pre-tuning baseline.

## Clean Holdout V2 Promoted Queue

These cases were captured after commit `3cd6e51`, reported before tuning from the suite, then promoted into regression work. The current V2 report fixes the P0 primary/forbidden-primary issues, but this suite must now be cited only as regression evidence.

| Case | Pre-tuning V2 primary | Expected primary | Issue | Priority | Current status |
| --- | --- | --- | --- | --- | --- |
| `agent-browser-preview-qa-holdout` | `control-in-app-browser` | `agent-browser-verify` | Local browser tooling displaced the Vercel protected-preview verification skill. | P0 | Fixed; V2 primary hit@1 |
| `data-viz-accessible-report-holdout` | `accessibility-and-inclusive-visualization` | `data-visualization`, `visualize-data`, `build-report` | Support/QA helper became primary for a chart-report task. | P0 | Fixed; V2 primary hit@1 |
| `data-jupyter-audit-trail-holdout` | `build-dashboard` | `jupyter-notebooks` | Dashboard concept overruled explicit notebook/reproducibility wording. | P0 | Fixed; V2 primary hit@1 |
| `figma-code-connect-holdout` | `figma-implement-design` | `figma-code-connect-components`, `figma-code-connect` | Implementation/generation intent beat Code Connect mapping for existing React components. | P0 | Fixed; V2 primary hit@1 |
| `huggingface-trackio-eval-holdout` | `huggingface-gradio` | `huggingface-trackio` | Demo/publishing helpers displaced experiment-tracking primary. | P0 | Fixed; V2 primary hit@1 |
| `linear-notion-roadmap-holdout` | `gmail-inbox-triage` | `roadmap-narrative`, `linear` | Knowledge/collaboration words routed to inbox triage despite roadmap ownership wording. | P0 | Fixed; V2 primary hit@1 |
| `figjam-user-flow-holdout` | `figma-user-flow-planner` | `figma-use-figjam`, `figma-user-flow-planner` | Primary was acceptable, but support missed UX/product context and included creation/implementation noise. | P1 | Backlog; primary still accepted |
| `security-ownership-map-holdout` | `security-ownership-map` | `security-ownership-map` | Primary was correct, but ownership-map support missed tracking/risk/security helpers. | P1 | Backlog; primary still accepted |

## Frozen Failure Atlas

These were clean-split failures from the pre-tuning frozen-holdout report. They drove the current V2 routing fixes, so [SKILL-USE-FROZEN-HOLDOUT.md](SKILL-USE-FROZEN-HOLDOUT.md) is now regression evidence for this prompt set.

| Case | Pre-tuning V2 primary | Expected primary | Issue | Priority | Current status |
| --- | --- | --- | --- | --- | --- |
| `node-typescript-mcp-server-holdout` | `building-mcp-server-on-cloudflare` | `dev-ai-llm-apps` | Confuses generic Codex MCP server work with Cloudflare and ChatGPT-specific routes | P0 | Fixed; V2 primary hit@1 |
| `gmail-notion-inbox-holdout` | `notion-meeting-intelligence` | `gmail-inbox-triage`, `gmail` | Lets Notion context displace the inbox action primary | P0 | Fixed; V2 primary hit@1 |
| `in-app-browser-choice-holdout` | `control-chrome` | `control-in-app-browser` | Chooses desktop Chrome despite explicit in-app browser wording | P0 | Fixed; V2 primary hit@1 |
| `analytics-report-to-slides-holdout` | `reports-pdfs-and-slide-automation` | `reports-pdfs-and-slide-automation` | Expected primary was correct, but broad `pdf` containment marked it forbidden | P0 | Fixed in `mustNotPrimary` matching |
| `figma-swiftui-motion-holdout` | `figma-use` | `figma-swiftui` | SwiftUI/motion handoff support appeared, but primary stayed generic Figma use | P1 | Fixed; V2 primary hit@1 |
| `phaser-sprite-hud-holdout` | `game-playtest` | `sprite-pipeline` | Asset pipeline intent was buried under playtest/game support | P1 | Fixed; V2 primary hit@1 |
| `otel-slo-tracing-holdout` | `sentry` | `dev-observability-sre` | Observability setup routed to one tool instead of the systems skill | P1 | Fixed; V2 primary hit@1 |

## Current Support Backlog

| Suite | Case | Missing support | Priority | Notes |
| --- | --- | --- | --- | --- |
| Challenge | `nextjs-auth-implementation` | `security-best-practices` | P1 | Auth work has security implications; promote only with a fresh auth/security prompt. |
| Challenge | `vercel-firewall-rules` | `security-best-practices` | P1 | Firewall rules need hardening context; watch for Vercel deploy noise. |
| Challenge | `core-web-vitals-audit` | `performance-budget` | P1 | Performance audit without budget guidance weakens verification. |
| Fresh | `vercel-auth-protection-fresh` | `env-vars` | P1 | Vercel auth often depends on environment configuration; guard against generic env-var overreach. |
| Fresh | `vercel-bot-firewall-fresh` | `security-best-practices` | P1 | Same security-support pattern as challenge firewall case. |
| Fresh | `durable-object-agent-fresh` | `wrangler` | P1 | Cloudflare agent work often needs deploy/runtime commands. |
| Challenge | `netlify-frontend-deploy` | `frontend-testing-debugging`, `dev-release-productization` | P2 | Useful handoff support, but provider-specific deploy primary is correct. |
| Challenge | `render-python-api-deploy` | `monitoring-setup-guide` | P2 | Ops support is useful but should not displace Render/Python routing. |
| Challenge | `game-studio-prototype-plan` | `game-ui-frontend` | P2 | Useful workflow branch for game UI; needs more game-task evidence. |
| Challenge | `chatgpt-app-mcp-widget` | `openai-docs` | P2 | Docs support is plausible; avoid overboosting docs above app/widget primary skills. |
| Challenge | `vercel-ai-gateway-routing` | `openai-docs` | P2 | Similar docs-support pattern; should probably be solved as documentation support, not primary routing. |
| Challenge | `market-sizing-research` | `business-strategy-and-research`, `external-research-digests` | P2 | Research source quality matters, but market-sizing primary is correct. |
| Challenge | `ab-test-design` | `kpi-reporting` | P2 | KPI reporting helps readout design; avoid crowding out diagnostics and experiment design. |
| Challenge | `product-business-retention` | `metric-diagnostics` | P2 | Useful diagnostic companion; promote only from real product-analysis usage. |
| Challenge | `system-design-interview-prep` | `dev-backend-api-design` | P2 | Backend design is a useful support skill, but interview prep primary is correct. |
| Fresh | `postgres-migration-rollback-fresh` | `api-versioning-strategy` | P2 | Useful only when API compatibility is part of the migration prompt. |

## Next Holdout Coverage Needs

The clean holdout V2 prompt set is now regression evidence in `benchmarks/skill-routing-clean-holdout-v2.json`. The next clean holdout should be captured only after this routing-tuning commit and reported before tuning from those prompts. Candidate families, not final prompts:

| Coverage gap | Why it matters | Candidate family |
| --- | --- | --- |
| `platform-delivery` has no fresh-suite cases | Deployment/release routing is high-impact and provider-specific | Netlify/Render/Vercel deploy prompts with verification and rollback wording |
| `skill-tooling` has no fresh-suite cases | SkillWeaver's own usefulness depends on authoring/install/security workflows | Install, validate, audit, and author Codex skills without mutating unrelated repos |
| `deployment-release` has no fresh concept coverage | Release support can collide with frontend/backend implementation | Feature flag, release checklist, rollback, preview verification, and changelog tasks |
| `skill-authoring` has no fresh concept coverage | Local skill work is a core user workflow | Skill creation, plugin creation, CLI creation, and unsafe-skill audit variants |
| `browser-verification` has no fresh concept coverage | Browser tooling has many confusable skills | In-app browser, Chrome, Playwright, screenshot, and Vercel Agent Browser variants |
| `figma-handoff` has no fresh concept coverage | Design-to-code routing has plugin and user-skill variants | Figma implementation, SwiftUI, motion, and component-library handoff variants |
| `presentations` has only one active case | Presentation generation is thin and tool-specific | Slide generation, roadmap presentation, and template-creator prompts |

## Candidate Prompt Queue

These prompts came from a read-only domain coverage audit. Several were promoted into `benchmarks/skill-routing-frozen-holdout.json`; any remaining prompts should stay out of benchmark JSON until the next clean holdout is intentionally frozen.

| Candidate | Expected primary | Expected support | Confusable rivals |
| --- | --- | --- | --- |
| Generic Node/TypeScript MCP server with typed tools, resources, tests, and Codex client setup, without ChatGPT Apps or Cloudflare | `dev-ai-llm-apps` | `dev-node-typescript-services`, `api-docs-writer`, `codex-mcp-config` | `chatgpt-apps`, `building-mcp-server-on-cloudflare`, `copilot-sdk`, `ai-sdk` |
| Gmail thread plus linked Notion meeting notes to draft replies and summarize decisions, with inbox triage as the main action | `gmail-inbox-triage`, `gmail` | `email-triage`, `notion-meeting-intelligence`, `notion-knowledge-capture` | `notion-meeting-intelligence` |
| Sprite, tilemap, and HUD asset pipeline for a Phaser game, then playtest checks; do not build a 3D scene | `sprite-pipeline` | `phaser-2d-game`, `game-ui-frontend`, `game-playtest` | `game-studio`, `three-webgl-game`, `react-three-fiber-game` |
| Accessible chart report from product metric data with alt text, color checks, and chart QA | `data-visualization`, `visualize-data` | `accessibility-and-inclusive-visualization`, `testing-data-visualizations`, `build-report` | `dev-frontend-accessibility-css`, `build-dashboard`, `chart-data-extractor` |
| Vercel Blob, Edge Config, or Neon storage in a Next.js app with Marketplace provisioning and env vars | `vercel-storage` | `marketplace`, `env-vars`, `nextjs` | `database-schema-design`, `supabase-postgres-best-practices`, `vercel-api` |
| Vercel Flags with Flags Explorer, provider adapters, and staged A/B rollout guardrails | `vercel-flags` | `feature-flag-guide`, `experiment-designer`, `launch-readiness` | `feature-flag-guide`, `ab-test-design`, `launch-readiness` |
| Cloudflare Sandbox SDK code interpreter for untrusted generated code with preview URLs and Worker bindings | `sandbox-sdk` | `agents-sdk`, `workers-best-practices`, `wrangler` | `vercel-sandbox`, `durable-objects`, `security-scan` |
| Reusable Data Analytics semantic layer for warehouse tables before dashboards or reports consume it | `create-data-context` | `gather-business-context`, `validate-data`, `build-report` | `build-dashboard`, `data-pipeline-spec`, `database-schema-design` |
| Reproducible SQL/Python analytics notebook companion with audit trail and validation checks | `jupyter-notebooks` | `data-analysis-standard`, `validate-data` | `jupyter-notebook`, `build-report` |
| Existing HTML Data Analytics report converted into a native Google Slides deck | `report-to-google-slides` | `build-report`, `Presentations`, `template-creator` | `roadmap-presentation`, `report-to-pdf`, `Presentations` |
| Hugging Face paper page with linked models/datasets and evaluation summary published to the Hub | `huggingface-paper-publisher` | `huggingface-papers`, `huggingface-community-evals`, `huggingface-datasets` | `huggingface-llm-trainer`, `huggingface-gradio` |
| Logo identity routes and moodboard directions for a new brand before ad asset production | `logo-explorer` | `moodboard-explorer`, `positioning-explorer`, `creative-production` | `creative-ads-explorer`, `creative-offer`, `figma-generate-library` |

## Provenance Fields

Every future clean holdout case should carry these fields before the first report is generated:

| Field | Required value shape | Why it matters |
| --- | --- | --- |
| `source` | `real-task-log`, `subagent-audit`, or `manual-fresh-holdout` | Separates real usage from synthetic coverage probes |
| `collectedAfterCommit` | Git commit hash | Proves the prompt was captured after the previous tuning point |
| `frozenBeforeTuningCommit` | Git commit hash | Establishes the pre-tuning evidence boundary |
| `suiteState` | `untouched-holdout` before tuning | Prevents regression evidence from being cited as fresh generalization |
| `promotionStatus` | `candidate`, `challenge`, `active`, `backlog`, or `retired` | Explains how the case should affect routing work |
| `supportCriticality` | `primary-critical`, `support-critical`, `informational`, or `none` | Prevents nice-to-have support misses from driving noisy boosts |

## Promotion Checklist

Before a backlog item becomes an active acceptance case:

1. Record the prompt before tuning.
2. Identify expected primary and support from actual indexed skill names.
3. Name at least one confusable rival.
4. Decide whether the missing support is P1 or repeated P2.
5. Add or update the failure atlas entry.
6. Run the initial report before changing routing.
7. Tune narrowly.
8. Re-run active, challenge, fresh, frozen, clean-v2-regression, tests, index, and build.
9. Confirm support precision@5 does not drop in the affected suite.

## No-Bloat Boundary

Support-quality work should stay documentation-only or benchmark-only unless a repeated P1 gap proves that product routing must change. Do not add a database, persisted graph, background indexing job, model reranker, new report dependency, or additional product-route passes for these backlog items.
