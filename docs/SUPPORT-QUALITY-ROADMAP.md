# Support Quality Roadmap

Date: 2026-06-27

This roadmap turns V2's remaining workflow-quality gaps into deliberate research work. It is not a new gate and it is not a tuning checklist. The goal is to keep the concept map useful across more domains without adding runtime bloat, overfitting the current suites, or weakening claim discipline.

## Current Evidence

| Suite | Cases | V2 primary hit@1 | V2 support coverage@5 | V2 support precision@5 | Support-miss cases | Role |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Active acceptance | 78 | 100.0% | 99.4% | 40.5% | 1 | Regression gate |
| Post-tuning challenge | 22 | 95.5% | 70.5% | 35.2% | 12 | Non-gating pressure |
| Fresh-probe regression | 18 | 94.4% | 90.7% | 51.4% | 4 | Non-gating regression |
| Frozen holdout regression | 12 | 100.0% | 76.4% | 56.3% | 6 | Non-gating regression |
| Clean holdout V2 regression | 14 | 100.0% | 64.3% | 48.2% | 13 | Non-gating regression |
| Clean holdout V3 regression | 18 | 100.0% | 72.2% | 54.2% | 9 | Non-gating regression |
| Clean holdout V4 regression | 21 | 100.0% | 65.1% | 47.6% | 13 | Non-gating regression |
| Clean holdout V5 regression | 17 | 100.0% | 76.5% | 55.9% | 9 | Non-gating regression |

The active suite proves the current acceptance claim. The challenge, fresh-probe, frozen-holdout-regression, clean-holdout V2 regression, clean-holdout V3 regression, clean-holdout V4 regression, and clean-holdout V5 regression suites show where support recommendations can compound, but they are not clean generalization proof because their misses have already informed V2 work. The pre-tuning frozen-holdout, clean V2, clean V3, clean V4, and clean V5 baselines are preserved in git history. Clean holdout V5's pre-tuning baseline at `38e4c6d` contradicted broad generalization claims even more sharply than V4; the current V5 report measures promoted regression fixes, not a new untouched split.

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

## Clean Holdout V3 Promoted Queue

These cases were captured after commit `e2a47a6`, reported before tuning from the suite, then promoted into regression work after the clean V3 baseline was preserved at `00ad343`. The current V3 report fixes the promoted P0/P1 primary misses, but this suite must now be cited only as regression evidence.

| Case | Baseline V2 primary | Expected primary | Issue | Priority | Current status |
| --- | --- | --- | --- | --- | --- |
| `netlify-preview-rollback-v3` | `launch-readiness` | `netlify-deploy` | Provider-specific deployment intent is buried under generic release/readiness and unrelated frontend/game helpers. | P0 | Fixed; V2 primary hit@1 |
| `skill-author-reference-pack-v3` | `skillweaver` | `skill-creator` | Skill navigation/gateway intent displaces the authoring skill for creating a reusable Codex skill. | P0 | Fixed; V2 primary hit@1 |
| `roadmap-research-slide-template-v3` | `linear` | `Presentations`, `roadmap-presentation` | Linear/research source material displaces the deck deliverable. | P0 | Fixed; V2 primary hit@1 |
| `otel-before-postmortem-v3` | `incident-postmortem` | `dev-observability-sre` | Proactive instrumentation routes to a reactive incident artifact and triggers a forbidden primary. | P0 | Fixed; V2 primary hit@1 |
| `pr-security-finding-triage-v3` | `dependency-audit` | `triage-finding`, `validation` | Dependency wording displaces security finding triage and validation ownership. | P0 | Fixed; V2 primary hit@1 |
| `huggingface-dataset-card-eval-v3` | `huggingface-llm-trainer` | `huggingface-datasets` | Dataset/card/licensing research is pulled into training and triggers a forbidden primary. | P0 | Fixed; V2 primary hit@1 |
| `game-accessible-hud-playtest-v3` | `sprite-pipeline` | `game-ui-frontend` | HUD/menu interaction design is routed to asset pipeline support instead of game UI. | P1 | Fixed; V2 primary hit@1 |
| `openai-agents-approval-flow-v3` | `openai-docs` | `openai-agents-js` | Current-docs support displaces the implementation skill for Agents JS workflows. | P1 | Fixed; V2 primary hit@1 |
| `market-sizing-source-bank-v3` | `market-sizing` | `market-sizing` | Primary is correct, but external-source and research-protocol support are absent. | P2 | Support backlog |

## Clean Holdout V4 Promoted Queue

These cases were captured after commit `764924b`, reported before tuning from the suite, then promoted into regression work after the clean V4 baseline was preserved at `77d4c73`. The current V4 report fixes the P0 primary/forbidden-primary issues, but this suite must now be cited only as regression evidence.

| Case | Baseline V2 primary | Expected primary | Issue | Priority | Current status |
| --- | --- | --- | --- | --- | --- |
| `pdf-chart-data-extract-v4` | `Spreadsheets` | `chart-data-extractor` | PDF/chart extraction was treated as spreadsheet cleanup. | P0 | Fixed; V2 primary hit@1 |
| `notion-spec-to-ticket-plan-v4` | `notion-meeting-intelligence` | `notion-spec-to-implementation` | Product-spec implementation work was displaced by meeting capture. | P0 | Fixed; V2 primary hit@1 |
| `vercel-queues-worker-v4` | `cron-jobs` | `vercel-queues` | Queue worker intent was displaced by scheduled workflow routing. | P0 | Fixed; V2 primary hit@1 |
| `sign-in-with-vercel-enterprise-v4` | `auth` | `sign-in-with-vercel` | Provider-specific enterprise auth was displaced by generic auth. | P0 | Fixed; V2 primary hit@1 |
| `go-rust-cli-packaging-v4` | `cli-creator` | `dev-go-rust-systems` | Go/Rust systems packaging was displaced by generic CLI creation. | P0 | Fixed; V2 primary hit@1 |
| `framer-code-component-props-v4` | `figma-code-connect-components` | `framer-code-components` | Framer code components were confused with Figma Code Connect. | P0 | Fixed; V2 primary hit@1 |
| `finding-discovery-before-triage-v4` | `triage-finding` | `finding-discovery` | Discovery-before-triage phase wording was ignored. | P0 | Fixed; V2 primary hit@1 |
| `hf-paper-publisher-no-training-v4` | `huggingface-datasets` | `huggingface-paper-publisher` | Paper publishing was treated as dataset research. | P0 | Fixed; V2 primary hit@1 |
| `racingsim-map-runtime-v4` | `racingsim-ai-ml` | `racingsim-game-dev` | RacingSim runtime/map work was displaced by PPO training. | P0 | Fixed; V2 primary hit@1 |

## Clean Holdout V5 Promoted Queue

These cases were captured after commit `c090354`, reported before tuning from the suite, then promoted into regression work after the clean V5 baseline was preserved at `38e4c6d`. The current V5 report fixes the primary/forbidden-primary issues, but this suite must now be cited only as regression evidence.

| Case | Baseline V2 primary | Expected primary | Issue | Priority | Current status |
| --- | --- | --- | --- | --- | --- |
| `ai-elements-chat-surface-v5` | `dev-ai-llm-apps` | `ai-elements` | Vercel AI UI primitives were displaced by generic LLM app routing. | P0 | Fixed; V2 primary hit@1 |
| `cloudflare-agent-state-v5` | `openai-agents-js` | `agents-sdk`, `building-ai-agent-on-cloudflare` | Cloudflare Agents SDK state work was displaced by OpenAI/Vercel agent routes. | P0 | Fixed; V2 primary hit@1 |
| `screenshot-bug-evidence-v5` | `design-image-to-code` | `screenshot` | Screenshot evidence was treated as image-to-code work despite a negative guard. | P0 | Fixed; V2 primary hit@1 |
| `security-validation-after-fix-v5` | `finding-discovery` | `validation` | Post-fix validation was pulled backward into discovery/triage. | P0 | Fixed; V2 primary hit@1 |
| `tts-voiceover-not-transcription-v5` | `transcribe` | `speech` | Text-to-speech voiceover generation was displaced by transcription despite a negative guard. | P0 | Fixed; V2 primary hit@1 |
| `presentation-template-pack-v5` | `roadmap-presentation` | `template-creator` | Reusable template creation was displaced by one-off roadmap deck authoring. | P0 | Fixed; V2 primary hit@1 |
| `notion-research-source-bank-v5` | `notion-meeting-intelligence` | `notion-research-documentation` | Source-bank research documentation was displaced by meeting/spec actions. | P0 | Fixed; V2 primary hit@1 |

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

The clean holdout V2, V3, V4, and V5 prompt sets are now regression evidence. The next clean holdout should be captured only after this routing-tuning commit and reported before tuning from those prompts. Candidate families, not final prompts:

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
8. Re-run active, challenge, fresh, frozen, clean-v2-regression, clean-v3, clean-v4, clean-v5, tests, index, and build.
9. Confirm support precision@5 does not drop in the affected suite.

## No-Bloat Boundary

Support-quality work should stay documentation-only or benchmark-only unless a repeated P1 gap proves that product routing must change. Do not add a database, persisted graph, background indexing job, model reranker, new report dependency, or additional product-route passes for these backlog items.
