# Support Quality Roadmap

Date: 2026-06-27

This roadmap turns V2's remaining workflow-quality gaps into deliberate research work. It is not a new gate and it is not a tuning checklist. The goal is to keep the concept map useful across more domains without adding runtime bloat, overfitting the current suites, or weakening claim discipline.

## Current Evidence

| Suite | Cases | V2 primary hit@1 | V2 support coverage@5 | V2 support precision@5 | Support-miss cases | Role |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Active acceptance | 78 | 100.0% | 100.0% | 40.9% | 0 | Regression gate |
| Post-tuning challenge | 22 | 100.0% | 68.2% | 34.1% | 12 | Non-gating pressure |
| Fresh-probe regression | 18 | 100.0% | 90.7% | 51.4% | 4 | Non-gating regression |

The active suite proves the current acceptance claim. The challenge and fresh-probe suites show where support recommendations can compound, but they are not clean generalization proof because their misses have already informed V2 work.

## Triage Rules

Classify support misses before changing routing:

| Priority | Meaning | Action |
| --- | --- | --- |
| P0 | Primary skill or forbidden-primary problem | Fix only with a frozen case, atlas entry, and full benchmark check |
| P1 | Missing support changes correctness, safety, deployment, or verification | Promote only after recurrence or a new clean holdout result |
| P2 | Missing support improves handoff quality but does not change correctness | Keep in backlog unless repeated in real task logs |
| P3 | Nice-to-have helper or ambiguous support expectation | Do not tune; consider removing expectation if it proves non-load-bearing |

Do not tune from the current challenge or fresh support misses directly. A support fix should have a fresh prompt captured before tuning, a named confusable rival, and a support-precision check after tuning.

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

## Fresh Holdout Coverage Needs

The next clean holdout should be captured after the current routing commit and reported before any tuning from those prompts. Candidate families, not final prompts:

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

These prompts came from a read-only domain coverage audit and were not routed through SkillWeaver. Keep them out of the benchmark JSON until the next clean holdout is intentionally frozen.

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
8. Re-run active, challenge, fresh, tests, index, and build.
9. Confirm support precision@5 does not drop in the affected suite.

## No-Bloat Boundary

Support-quality work should stay documentation-only or benchmark-only unless a repeated P1 gap proves that product routing must change. Do not add a database, persisted graph, background indexing job, model reranker, new report dependency, or additional product-route passes for these backlog items.
