# Corpus Snapshot

Generated from the local SkillWeaver scanner on June 27, 2026.

## Index Summary

- Skills indexed: 442.
- Skill relationship edges: 2,000.
- Concept nodes: 22.
- Concept edges: 200.
- Skill roots: 8.
- Parser warnings: 0.
- Skill edge cap reached: yes.
- Concept edge cap reached: yes.

## Relationship Caps

SkillWeaver caps relationship output for responsiveness, but the scanner now reports the candidate pool behind each cap.

| Graph | Kept | Candidates | Dropped | Dropped types |
| --- | ---: | ---: | ---: | --- |
| Skill relationships | 2,000 | 4,105 | 2,105 | `mentions`: 2,105 |
| Concept relationships | 200 | 231 | 31 | `shared_concept_evidence`: 31 |

Kept skill edge types:

- `duplicates_name`: 101.
- `same_namespace`: 147.
- `shared_tool`: 142.
- `shared_domain`: 53.
- `mentions`: 1,557.

Kept concept edge types:

- `curated_concept_link`: 37.
- `shared_concept_evidence`: 163.

All 37 curated concept links are preserved before shared-evidence edges are capped.

## Indexed Roots

- `C:\Users\Uday\.codex\skills`
- `C:\Users\Uday\.codex\skills\.system`
- `C:\Users\Uday\.agents\skills`
- `G:\Projects\Digital Marketing Super Skills`
- `C:\Users\Uday\.codex\plugins\cache\openai-bundled`
- `C:\Users\Uday\.codex\plugins\cache\openai-curated`
- `C:\Users\Uday\.codex\plugins\cache\openai-curated-remote`
- `C:\Users\Uday\.codex\plugins\cache\openai-primary-runtime`

## Domains

- `ai`
- `backend`
- `creative`
- `data`
- `documents`
- `frontend`
- `github`
- `operations`
- `product`
- `security`

## Namespaces

- `browser`
- `build-web-apps`
- `build-web-data-visualization`
- `chrome`
- `cloudflare`
- `coderabbit`
- `codex-security`
- `computer-use`
- `creative-production`
- `data-analytics`
- `documents`
- `figma`
- `game-studio`
- `github`
- `gmail`
- `hugging-face`
- `latex`
- `linear`
- `pdf`
- `presentations`
- `product-design`
- `spreadsheets`
- `template-creator`
- `vercel`

## Concept Coverage

| Concept | Skill refs | Benchmark cases | Roles |
| --- | ---: | ---: | --- |
| `agent-llm-apps` | 18 | 4 | primary:7, supporting:11 |
| `backend-services` | 18 | 4 | primary:6, verification:3, supporting:9 |
| `browser-verification` | 18 | 4 | gateway:2, primary:3, supporting:13 |
| `cloudflare-workers` | 18 | 2 | primary:5, supporting:13 |
| `data-dashboarding` | 18 | 4 | primary:6, verification:2, supporting:10 |
| `database-data-engineering` | 18 | 3 | primary:5, verification:2, supporting:11 |
| `deployment-release` | 18 | 1 | primary:8, verification:1, supporting:9 |
| `documents-pdf` | 18 | 4 | primary:6, supporting:12 |
| `email-triage` | 18 | 1 | primary:3, supporting:5, reference:10 |
| `figma-handoff` | 18 | 3 | gateway:1, primary:4, verification:2, supporting:11 |
| `frontend-implementation` | 18 | 5 | gateway:1, primary:2, verification:3, supporting:12 |
| `game-development` | 18 | 3 | primary:6, verification:1, supporting:11 |
| `github-pr-repair` | 18 | 3 | primary:2, verification:1, supporting:15 |
| `huggingface-ml` | 18 | 4 | primary:6, supporting:12 |
| `infrastructure-platforms` | 18 | 3 | primary:5, verification:2, supporting:11 |
| `marketing-growth` | 18 | 4 | primary:7, supporting:11 |
| `observability-reliability` | 18 | 5 | primary:5, verification:2, supporting:11 |
| `presentations` | 18 | 1 | primary:2, supporting:5, reference:11 |
| `product-planning` | 18 | 5 | primary:14, supporting:4 |
| `repo-operations` | 18 | 5 | primary:6, supporting:12 |
| `security-review` | 18 | 5 | primary:5, verification:2, supporting:11 |
| `skill-authoring` | 18 | 5 | gateway:1, primary:4, verification:1, supporting:12 |

## Corpus Quality Checklist

- Parser warnings must be reviewed, not just counted.
- Root additions or removals require a drift note.
- Concepts with high `reference` share need review before routing claims rely on them.
- Concepts with only one benchmark case are thin coverage and should not be overfit.
- Plugin-prefixed and unprefixed duplicate skills should be intentional.
- New domains or namespaces need at least one representative benchmark case, or a note explaining why they remain untested.
- Edge caps at 2,000 skill edges and 200 concept edges should be treated as truncation signals, not as natural corpus size.

## Drift Notes

Older docs referenced 439 skills and 18 concepts. Current V2 work indexes 442 skills and 22 concepts after adding backend, database/data engineering, observability/reliability, and infrastructure/platform concepts.
The June 27, 2026 breadth pass kept 22 concepts but expanded coverage from 39 to 49 benchmark cases and added live-name aliases for LaTeX, Notion, mobile/desktop, speech, competitive intelligence, and RacingSim skills.
The June 27, 2026 support-precision pass kept the same 22 concepts and 49 cases, but raised V2 primary hit@1 and support coverage to 100.0% on the benchmark by tuning concept role membership and narrow intent guards.
The June 27, 2026 challenge expansion kept 22 concepts but expanded coverage from 49 to 78 benchmark cases. It also added support precision@5, benchmark case validation, wider domain guards, negation-variant tests, and SkillWeaver self-review routing coverage.
The June 27, 2026 holdout/challenge pass kept 22 concepts and the same 18 refs per concept cap, while reallocating scarce refs toward specialist skills that repeatedly appeared in coverage audits: spreadsheets, metric diagnostics, product-business analysis, provider deploys, Vercel Cron, code explanation, and visualization accessibility.
