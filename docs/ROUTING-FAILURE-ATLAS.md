# Routing Failure Atlas

This atlas tracks routing failures and fragile wins. Treat it as the first stop before tuning concept rules.

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

## Current Residual Weak Spots

### Support Quality Is Still Uneven

Examples in the current report:

- `python-service` keeps backend service skills high, but support skills like `dev-testing-qa` and `monitoring-setup-guide` are not consistently top 5.
- `three-game` gets `game-playtest` into the workflow, but asset-pipeline support can still be displaced by adjacent visualization skills.
- `containers-kubernetes` now includes monitoring and DevOps support, but capacity/planning helpers can still rank high.

Likely fix type: sharper concept membership and role assignments, not broad score boosts.

### Underrepresented Domains

The current 39-case benchmark covers all 22 concepts at least once, but some domains are still thin:

- SEO and organic growth.
- Creative ad/offer production.
- Notion/workspace knowledge workflows.
- LaTeX and technical publishing.
- Mobile/desktop app packaging.
- Speech/local AI.
- Project-derived skills such as RacingSim PPO workflows.

Add cases only when they represent real recurring work and can be evaluated by concrete expected skills.

## Tuning Rules

- Prefer adding exact aliases to concept rules before adding score boosts.
- Prefer narrow intent boosts over new concepts when the concept is already correct.
- Add a benchmark case before tuning a new domain.
- Keep every fix deterministic and inspectable.

