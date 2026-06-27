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

## Current Residual Weak Spots

### No Open Benchmark Misses

The current 49-case benchmark has:

- 100.0% V2 primary hit@1.
- 100.0% V2 expected primary top/workflow-5 retrieval.
- 100.0% V2 support coverage@5.
- 0.0% V2 forbidden primary rate.

Current status: fixed for the benchmark, fragile outside the covered query set.

### Benchmark Breadth And Overfit Risk

The benchmark now covers 49 cases across frontend, browser QA, GitHub, Figma, data, security, deployment, documents, Hugging Face, email, games, repo operations, marketing, product, agent apps, backend, database/data engineering, observability, infrastructure, and thin-domain aliases.

Likely next fix type: add holdout cases from future real task logs before tuning more boosts.

### Recently Covered Thin Domains

The benchmark now has 49 cases. The June 27, 2026 breadth pass added coverage for:

- SEO and organic growth.
- Creative ad/offer production.
- Competitive intelligence monitoring.
- Notion/workspace knowledge workflows.
- LaTeX and technical publishing.
- Mobile/desktop app packaging.
- Speech/local AI.
- Project-derived skills such as RacingSim PPO workflows.

These are fixed enough for routing evaluation, but still thin enough to revisit when real task logs reveal a miss.

## Tuning Rules

- Prefer adding exact aliases to concept rules before adding score boosts.
- Prefer narrow intent boosts over new concepts when the concept is already correct.
- Add a benchmark case before tuning a new domain.
- Keep every fix deterministic and inspectable.
