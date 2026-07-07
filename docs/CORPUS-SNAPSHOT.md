# Corpus Snapshot

Generated from the local SkillWeaver scanner on July 7, 2026.

This snapshot records the corpus shape from one configured local machine. Skill
counts, roots, and parser warnings can differ for another user because
SkillWeaver scans that user's own `SKILL.md` folders.

## Index Summary

- Skills indexed: 429.
- Skill relationship edges kept: 2,000.
- Concept nodes: 22.
- Concept edges kept: 200.
- Skill roots: 7.
- Parser warnings: 1.
- Skill edge cap reached: yes.
- Concept edge cap reached: yes.

## Relationship Caps

SkillWeaver caps relationship output for responsiveness, and reports the
candidate pool behind each cap.

| Graph | Kept | Candidates | Dropped | Dropped types |
| --- | ---: | ---: | ---: | --- |
| Skill relationships | 2,000 | 3,420 | 1,420 | `mentions`: 1,420 |
| Concept relationships | 200 | 231 | 31 | `shared_concept_evidence`: 31 |

Kept skill edge types:

- `duplicates_name`: 101.
- `same_namespace`: 147.
- `shared_tool`: 142.
- `shared_domain`: 51.
- `mentions`: 1,559.

Kept concept edge types:

- `curated_concept_link`: 37.
- `shared_concept_evidence`: 163.

All curated concept links are preserved before shared-evidence edges are capped.

## Indexed Root Types

The latest run used the default portable roots under the current user's home
directory:

- user Codex skills,
- system Codex skills,
- agent skills,
- bundled plugin cache,
- curated plugin cache,
- curated remote plugin cache,
- primary runtime plugin cache.

Avoid committing machine-specific roots to benchmark cases, source files, or
visitor-facing docs. Use `.env.local` and `SKILLWEAVER_SKILL_ROOTS` for local
overrides.

## Parser Warning

The latest run reported one warning from a local Framer skill whose frontmatter
contained an unescaped Windows path. The scanner used its loose fallback parser
and continued indexing.

Warnings are part of the local corpus health report. They should be reviewed,
but a warning in one user's skill library is not automatically a repo failure.

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

The scanner currently builds 22 high-level concepts. Each concept can reference
up to 18 skills, role-tagged as `gateway`, `primary`, `verification`,
`supporting`, or `reference`.

Thin areas should be treated carefully in benchmark claims. Concepts with only a
small number of prompt cases may still route well on checked-in tests without
proving broad generalization.

## Corpus Quality Checklist

- Parser warnings must be reviewed, not just counted.
- Root additions or removals require a drift note.
- Concepts with high `reference` share need review before routing claims rely
  on them.
- Concepts with only one benchmark case are thin coverage and should not be
  overfit.
- Plugin-prefixed and unprefixed duplicate skills should be intentional.
- New domains or namespaces need at least one representative benchmark case, or
  a note explaining why they remain untested.
- Edge caps at 2,000 skill edges and 200 concept edges should be treated as
  truncation signals, not natural corpus size.

## Drift Notes

- Older docs referenced 442 skills and 8 roots from a local setup that included
  an additional project-specific skill library.
- The current portable default-root run indexes 429 skills across 7 roots.
- The concept layer remains at 22 concepts and 200 kept concept edges.
- The nightmare benchmark adds adversarial evidence but does not replace the
  active acceptance suite as the main current-quality claim.
