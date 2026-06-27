# SkillWeaver Requirements

SkillWeaver is a separate, lightweight sibling app inspired by MindWeaver, but purpose-built for navigating agentic Codex skills. It must not live inside the MindWeaver repository and must not edit MindWeaver source files.

## Product Goal

Make Codex skill discovery faster, more reliable, and less context-expensive by turning local `SKILL.md` files into an explorable skill map.

The app is built for the agent using it as much as for the human operator. It should answer:

- Which high-level work concept does this task belong to?
- Which skill should I load for this task?
- Which skills overlap or form a workflow?
- What trigger language makes a skill relevant?
- Where is the source `SKILL.md` on disk?
- Which skill roots are indexed and which files failed to parse?

## Explicit Scope

- Create a new repo at `G:\Projects\SkillWeaver`.
- Keep MindWeaver as read-only reference material only.
- Build a local-first app with no hosted accounts, auth, extension, quiz loop, or long-term learning features.
- Index existing Codex user skills under the current user's home-directory Codex skill folders.
- Allow additional skill roots through environment configuration.
- Parse `SKILL.md` frontmatter and body enough to support search, relationships, and task routing.
- Expose a simple web UI for discovery, filtering, skill inspection, and recommended workflow paths.
- Include a subagent workflow that can be reused for future SkillWeaver audits and expansions.

## Non-Goals

- Do not copy MindWeaver code directly.
- Do not create a browser extension.
- Do not mutate or rewrite existing Codex skills during scanning.
- Do not require OpenAI, Ollama, or any LLM to get a useful index.
- Do not implement team collaboration, hosted persistence, backup/restore, spaced review, quizzes, or source ingestion queues.
- Do not create a MindWeaver map as the primary data store.

## Minimum Viable Product

1. A scanner discovers skill folders by finding `SKILL.md`.
2. The scanner parses:
   - skill name,
   - description,
   - path,
   - root,
   - namespace or plugin prefix when inferable,
   - body excerpt,
   - referenced files,
   - likely domains,
   - trigger terms,
   - tool or platform hints.
3. The API serves:
   - inventory summary,
   - concept list and concept details,
   - skill list,
   - search results,
   - individual skill details,
   - generated relationship edges.
4. The UI supports:
   - search by task wording,
   - concept-first browsing,
   - filtering by domain/root/plugin,
   - selected concept and selected skill inspectors,
   - related skills,
   - suggested multi-skill workflow for a query,
   - copyable path/loading guidance.
5. The repo includes requirements, architecture notes, subagent workflow notes, and a local run guide.

## Data Model

SkillWeaver uses a derived in-memory index. The filesystem remains authoritative.

### Concept

- `id`: stable concept identifier.
- `label`: human-readable high-level agent work concept.
- `description`: concise explanation of the work concept.
- `triggers`: task phrases associated with the concept.
- `domains`: inferred or configured domain tags.
- `tools`: inferred or configured platform/tool tags.
- `skillRefs`: referenced skills that belong to the concept.
- `roleCounts`: count of referenced skills by role.
- `skillCount`: total referenced skills.

Concepts are derived from deterministic rules and current skill metadata. They are graph nodes above the skill layer: a concept groups the skills that help execute that kind of work.

### Concept Skill Reference

- `skillId`
- `name`
- `description`
- `path`
- `root`
- `sourceType`
- `namespace`
- `domains`
- `tools`
- `role`: `gateway`, `primary`, `verification`, `supporting`, or `reference`.
- `score`
- `reason`

### Skill

- `id`: stable normalized path-derived id.
- `name`: frontmatter `name` or folder name fallback.
- `description`: frontmatter `description`.
- `path`: absolute path to `SKILL.md`.
- `folder`: absolute skill folder path.
- `root`: matched configured root.
- `sourceType`: `user`, `system`, `plugin`, or `external`.
- `namespace`: prefix before `:` in the name when present.
- `body`: body text.
- `excerpt`: compact body preview.
- `references`: relative references mentioned by the skill.
- `domains`: inferred domain tags.
- `triggers`: searchable phrases from description and headings.
- `tools`: tool or platform hints.
- `warnings`: parse or quality warnings.

### Edge

- `sourceId`
- `targetId`
- `type`: `same_namespace`, `shared_domain`, `shared_tool`, `mentions`, `curated_concept_link`, or `shared_concept_evidence`.
- `label`
- `weight`
- `reason`

## Search And Routing Requirements

- Search must work without LLM calls.
- Ranking should favor exact name matches, description matches, trigger matches, then body matches.
- A task query should produce a short recommended workflow:
  - primary skill,
  - supporting skills,
  - reason for each recommendation,
  - source path for each recommendation.
- Search should handle large local skill libraries without loading all skill bodies into the browser.

## UI Requirements

- First screen is the usable navigator, not a landing page.
- The interface should feel like an internal command center: dense, calm, fast, and low-friction.
- It should use real controls for search, filters, selection, relationship traversal, and copyable paths.
- It should avoid decorative marketing sections.
- It must remain readable on laptop and mobile widths.

## Verification Requirements

- Running `npm test` must exercise scanner parsing and ranking.
- Running `npm run build` must build the web app.
- Running `npm run benchmark:skills:check` must verify that the active acceptance report is fresh and passing.
- Running `npm run benchmark:skills:holdout:check` must verify that the non-gating post-tuning challenge report is fresh.
- Running `npm run benchmark:skills:fresh:check` must verify that the non-gating fresh-probe regression report is fresh.
- Running `npm run benchmark:skills:frozen:check` must verify that the non-gating frozen holdout regression report is fresh.
- Running `npm run benchmark:skills:clean-v2-regression:check` must verify that the non-gating clean holdout V2 regression report is fresh; it is regression evidence, not current clean generalization proof.
- Running `npm run benchmark:skills:clean-v3:check` must verify that the non-gating clean holdout V3 regression report is fresh; its pre-tuning baseline is preserved at `00ad343`, and the current report is not clean generalization proof.
- Running `npm run benchmark:skills:clean-v4:check` must verify that the non-gating clean holdout V4 regression report is fresh; its pre-tuning baseline is preserved at `77d4c73`, and the current report is not clean generalization proof.
- Running `npm run benchmark:skills:clean-v5:check` must verify that the non-gating clean holdout V5 regression report is fresh; its pre-tuning baseline is preserved at `38e4c6d`, and the current report is not clean generalization proof.
- Running the dev server must expose a usable UI.
- The scanner must successfully index the current local Codex skill library.
- Post-tuning challenge misses should be documented or promoted deliberately; they must not silently weaken the active acceptance result.
- MindWeaver `git status` must remain unchanged by SkillWeaver work.
