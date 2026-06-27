# Routing Failure Atlas

This atlas tracks routing failures and fragile wins. Treat it as the first stop before tuning concept rules.

## Failure Entry Checklist

Use this shape for new entries:

- Query.
- Expected primary/support.
- Observed top/workflow five.
- Failure class: alias gap, intent collision, concept membership, role weighting, corpus quality, or benchmark expectation issue.
- Fix attempted.
- Regression guard case.
- Current status: open, fixed, fragile, or retired.
- Last verified date/report.

## Current High-Value Fixes

### Data Dashboard

- Query: `Create a data analytics dashboard from KPI data`
- Previous V2 behavior: routed to `analyze-data-quality`.
- Current V2 behavior: routes to `build-dashboard`.
- Fix type: explicit `dashboard` intent boost for builder/visualization skills and penalty for data-quality audit when the query is not about audit or missing values.
- Regression risk: overboosting dashboard terms could bury data-quality skills on audit queries. Guarded by the `data-quality` benchmark case.

### Chrome Control

- Query: `Use Chrome to inspect a live page and control browser interactions`
- Previous V2 behavior: routed to `control-in-app-browser`.
- Current V2 behavior: routes to `control-chrome`.
- Fix type: explicit `Chrome` intent boost.
- Regression risk: generic browser QA should still prefer in-app/browser QA or Playwright paths. Guarded by `browser-qa`.

### Security Scan

- Query: `Audit a repo for security vulnerabilities and attack paths`
- Previous V2 behavior: routed first to `security-threat-model` or `attack-path-analysis`.
- Current V2 behavior: routes to `deep-security-scan`, with `security-scan` and `attack-path-analysis` in the visible workflow.
- Fix type: scan/vulnerability intent boost plus threat-model penalty when the query does not ask for a threat model.
- Regression risk: pure attack-path analysis should still route to `attack-path-analysis`. Guarded by `attack-path`.

### Attack Path

- Query: `Analyze likely exploit chains and attack paths in a codebase`
- Previous V2 behavior: routed to `security-threat-model`.
- Current V2 behavior: routes to `attack-path-analysis`.
- Fix type: plural-aware `attack paths` and `exploit chains` intent boost.
- Regression risk: broad security audits should not overselect attack-path analysis. Guarded by `security-scan`.

### Negated Dashboard Intent

- Query: `Build a React dashboard UI shell, not a data analytics report`
- Previous V2 behavior: data-dashboarding candidates could still win because `dashboard`, `data`, and `report` appeared in the query.
- Current V2 behavior: routes to `dev-frontend-react-next` under `Frontend implementation`.
- Fix type: nearby negation detection plus a concept-level penalty for `data-dashboarding` when data/report intent is explicitly negated.
- Regression risk: real data dashboard prompts must still route to `build-dashboard`. Guarded by `data-dashboard`.

### Negated Security Scan Intent

- Query: `Create a threat model without running a vulnerability scan`
- Previous V2 behavior: scan/vulnerability boosts could overrule threat-model intent.
- Current V2 behavior: routes to `threat-model`, with `security-threat-model` as support.
- Fix type: nearby negation detection for scan/vulnerability terms plus explicit threat-model boost.
- Regression risk: real vulnerability scans must still route to `security-scan` or `deep-security-scan`. Guarded by `security-scan`.

### Thin-Domain Alias Coverage

- Queries: `seo-organic-growth`, `creative-ad-offer-production`, `competitive-intelligence-monitor`, `notion-workspace-knowledge`, `latex-technical-publishing`, `mobile-desktop-packaging`, `speech-local-ai-loop`, and `racingsim-ppo-progress`.
- Previous V2 behavior: these domains were thin or adjacent concepts could displace the intended primary skill.
- Current V2 behavior: all eight route to an expected primary at rank 1.
- Fix type: live-name aliases in existing concepts plus narrow intent boosts.
- Regression risk: concept nodes can become noisy if aliases are added without benchmark evidence. Guarded by the new cases and by the concept-governance rule to prefer existing concepts before adding new ones.

### Clean Holdout V2 Promoted Boundaries

- Queries: `agent-browser-preview-qa-holdout`, `data-viz-accessible-report-holdout`, `data-jupyter-audit-trail-holdout`, `figma-code-connect-holdout`, `huggingface-trackio-eval-holdout`, and `linear-notion-roadmap-holdout`.
- Previous V2 behavior: concept-level gateways or adjacent helpers displaced explicit specialist primaries in protected preview QA, chart-report creation, notebook audit trails, Figma Code Connect, Hugging Face Trackio, and roadmap planning.
- Current V2 behavior: all six promoted cases route to an expected primary at rank 1, and the clean V2 regression suite has 0.0% forbidden primary rate.
- Fix type: exact specialist concept membership plus narrow intent guards for the confusable rivals.
- Regression risk: Trackio must not steal Gradio Space prompts, report-building must not make visualization QA primary, Code Connect must not steal normal Figma implementation, and browser preview verification must not break Chrome or in-app-browser routing. Guarded by `concept workflow preserves clean holdout V2 specialist boundaries`.

## Current Residual Weak Spots

### No Open Benchmark Misses

The current 78-case benchmark has:

- 100.0% V2 primary hit@1.
- 100.0% V2 expected primary top/workflow-5 retrieval.
- 100.0% V2 support coverage@5.
- 40.9% V2 support precision@5 as an exploratory noise metric.
- 0.0% V2 forbidden primary rate.

Current status: fixed for the benchmark, fragile outside the covered query set.

### Benchmark Breadth And Overfit Risk

The active benchmark now covers 78 cases across 17 explicit benchmark domains and all 22 current expected concept ids. The generated `Quality by Domain` and `Quality by Expected Concept` tables are the authoritative breadth view; do not reduce the breadth claim to a prose list of examples.

The 22-case post-tuning challenge suite now covers 11 benchmark domains and 11 expected concept ids. It reports:

- 100.0% V2 primary hit@1.
- 100.0% V2 expected primary top/workflow-5 retrieval.
- 68.2% V2 support coverage@5.
- 34.1% V2 support precision@5 as an exploratory noise metric.
- 0.0% V2 forbidden primary rate.

Because the pilot misses informed the current fix, this suite is challenge evidence from this commit forward. The clean holdout V2 file now also contains regression evidence because its P0 misses were promoted into the current tuning pass. Current support-quality backlog is concentrated in challenge slices such as product/research/planning, platform delivery, backend services, AI agent apps, security/risk, and the clean-holdout support cases tracked in [SUPPORT-QUALITY-ROADMAP.md](SUPPORT-QUALITY-ROADMAP.md).

### Recently Covered Robustness Traps

The June 27, 2026 challenge expansion added guards for:

- `instead of`, `rather than`, `avoid`, and `don't` negation variants.
- SkillWeaver self-review wording, which should choose `skillweaver` rather than generic performance-review or dashboard skills.
- Figma implementation versus Figma gateway use.
- Dashboard wording that should route to frontend implementation instead of data analytics.
- Threat-model wording that should not become a vulnerability scan.
- Sibling-skill confusion in Stripe, Cloudflare Durable Objects, Hugging Face Gradio and vision training, dependency conflicts, monorepo builds, and security triage.

These are fixed in the active benchmark, but they should be treated as stress coverage rather than proof that all paraphrases are solved.

### Recently Covered Thin Domains

The benchmark now has 78 cases. The June 27, 2026 breadth and challenge passes added coverage for:

- SEO and organic growth.
- Creative ad/offer production.
- Competitive intelligence monitoring.
- Notion/workspace knowledge workflows.
- LaTeX and technical publishing.
- Mobile/desktop app packaging.
- Speech/local AI.
- Project-derived skills such as RacingSim PPO workflows.
- Accessibility design QA.
- URL-to-code and screenshot-adjacent frontend implementation.
- Plugin and CLI creation.
- Changelog, onboarding, resume, and API documentation workflows.
- Load testing, capacity planning, Sentry, disaster recovery, feature flags, and risk registers.
- Supabase, Stripe, Cloudflare Durable Objects, Hugging Face Gradio, and Hugging Face vision training.
- PRDs, feature prioritization, user research, and product/business analysis-adjacent planning.
- Dependency conflicts, debugging logs, monorepo builds, security triage, and Copilot SDK work.

These are fixed enough for routing evaluation, but still thin enough to revisit when real task logs reveal a miss.

### Support-Quality Backlog

The current support backlog comes from correct-primary challenge cases where V2 misses at least one expected helper in the top/workflow five. These are not failed routing claims, but they identify where future workflow recommendations can compound.

Backlog rules:

- Promote support-only cases only when the missing helper is load-bearing for the workflow.
- Prefer real task-log recurrence over synthetic paraphrases.
- Tune one support pattern at a time, then check primary hit@1, forbidden primary rate, support coverage@5, and support precision@5.
- Keep cases in backlog when the missing support is merely nice-to-have or when adding it would crowd out a more task-specific skill.

Current priority slices:

- Security/release support: `vercel-firewall-rules`, `nextjs-auth-implementation`.
- Product/research support: `market-sizing-research`, `ab-test-design`, `product-business-retention`.
- Platform delivery support: `netlify-frontend-deploy`, `render-python-api-deploy`.
- Agent/app documentation support: `chatgpt-app-mcp-widget`, `vercel-ai-gateway-routing`.
- Game/frontend support: `game-studio-prototype-plan`, `core-web-vitals-audit`.

### Coverage Backlog

Independent review found useful future cases. Several are now covered by the 22-case post-tuning challenge suite: ChatGPT Apps, ASP.NET, Java/.NET, Netlify, Render, screenshot-to-code, React Three Fiber, game-studio planning, Notion meeting workflows, Vercel AI Gateway/Cron/Auth/Firewall, web performance, market sizing, metric diagnostics, experiment design, product-business analysis, code explanation, system-design interview prep, API docs, and visualization accessibility.

Remaining useful future cases:

- Broader MCP server creation outside ChatGPT or Cloudflare wording.
- Deeper game-studio variants across planning, assets, UI, and playtest.
- Notion meeting-to-email workflows where the primary action is ambiguous.
- Additional Vercel Auth, Firewall, AI Gateway, and Cron paraphrases from real usage.
- Visualization QA and accessibility prompts that distinguish chart creation, chart review, and frontend accessibility.

These should become fresh holdout cases before any routing boost is tuned for them, or be compared against the next clean holdout before promotion.

## Tuning Rules

- Prefer adding exact aliases to concept rules before adding score boosts.
- Prefer narrow intent boosts over new concepts when the concept is already correct.
- Add a benchmark case before tuning a new domain.
- Keep every fix deterministic and inspectable.
- Do not tune directly from a challenge support miss until it is promoted or recurs in real task logs.
- Treat support precision drops as workflow noise, even when support coverage improves.
- Retire backlog entries when the corpus changes and the missing support is no longer load-bearing.
