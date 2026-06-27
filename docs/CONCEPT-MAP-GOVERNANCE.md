# Concept Map Governance

SkillWeaver V2 should stay lightweight. The concept map is a deterministic routing aid, not a second knowledge base to maintain by hand.

## Concept Purpose

A concept node represents a high-level kind of agent work. Skills remain the source artifacts. Concepts only group and order skills for faster loading.

Good concept examples:

- `data-dashboarding`: build dashboards, KPI reports, visualizations, and data QA.
- `browser-verification`: browser control, Playwright, screenshots, Chrome, and live UI checks.
- `backend-services`: backend API/service work and endpoint documentation.

Poor concept examples:

- A single tool with one skill.
- A vague bucket like `misc engineering`.
- A concept that only exists to make one benchmark case pass.

## Role Rules

Each concept may reference skills by role:

- `gateway`: load first when a tool/session context is required.
- `primary`: main execution skill for a task in this concept.
- `verification`: proves the work is correct.
- `supporting`: adjacent helper.
- `reference`: weak evidence match, kept only when useful.

Named roles should include exact indexed skill names where possible. If a plugin contributes both prefixed and unprefixed names, include both only when the corpus actually contains both forms.

## Adding A Concept

Add a concept only when all are true:

- It covers at least three meaningful skills or a recurring workflow family.
- It maps to user-visible work, not implementation internals.
- It improves benchmark coverage or explains a known routing failure.
- It can be expressed as deterministic labels, triggers, roles, domains, and tools.

Add a benchmark case for every new concept unless the concept is clearly auxiliary to an already-tested workflow.

## Splitting A Concept

Split when one concept contains conflicting primary intent. Example: browser QA and Chrome-specific inspection share skills, but Chrome intent needs a strong exact boost for `control-chrome`.

Do not split only because two skills are different. Split when the query language should choose different primary skills.

## Merging A Concept

Merge when two concepts repeatedly share the same primary skills, triggers, and benchmark cases. Concept edges are enough for adjacency; separate concepts should represent different decisions.

## Scoring Policy

V2 ranking should stay concept-aided, not concept-only:

1. Use skill-level ranking as a high-confidence anchor.
2. Score matching concepts.
3. Rerank role-tagged skill references within those concepts.
4. Append skill-level fallback results.

Intent boosts are allowed only when the query contains explicit language. Examples:

- `dashboard` can boost `build-dashboard`.
- `Chrome` can boost `control-chrome`.
- `security scan` can boost `security-scan` and `deep-security-scan`.
- `attack path` or `exploit chain` can boost `attack-path-analysis`.

Avoid broad boosts for generic terms like `Node`, `Python`, `GitHub`, or `app`.

## Quality Gates

Before committing concept changes:

- Run `npm test`.
- Run `npm run benchmark:skills`.
- Run `npm run index:skills`.
- Confirm V2 does not regress expected top/workflow-5 retrieval.
- Inspect changed per-case rows in `docs/SKILL-USE-GAINS.md`.

## Mini Decision Record Template

Use this for small concept-map changes in `docs/V2-EXPERIMENT-LOG.md`:

- Date.
- Decision: add concept, split concept, merge concept, role change, or boost/penalty.
- Evidence: atlas entry, benchmark case, or corpus gap.
- Alternatives rejected.
- Expected benchmark effect.
- Regression guard.
- Rollback condition.
