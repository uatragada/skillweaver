# SkillWeaver Agent Workflow

Use this workflow when building or auditing SkillWeaver.

## Roles

### 1. Skill Corpus Explorer

Read-only. Inspect configured skill roots and report:

- folder patterns,
- frontmatter variations,
- malformed or missing metadata,
- duplicated names,
- useful domain groupings,
- scanner edge cases.

### 2. MindWeaver Shape Explorer

Read-only. Inspect MindWeaver only as reference material and report:

- useful concepts to preserve,
- features to omit,
- local-first architecture lessons,
- risks from overbuilding.

### 3. Implementation Worker

Write-scoped to the SkillWeaver repo only. Build:

- scanner,
- API,
- UI,
- tests,
- docs.

### 4. Verification Reviewer

Read-only final pass. Confirm:

- MindWeaver was not edited,
- requirements are covered,
- local skill library indexes,
- tests/build pass,
- UI supports the core task routing workflow.

## Current Subagent Plan

For the first build:

1. Run Skill Corpus Explorer against the configured local skill roots.
2. Run MindWeaver Shape Explorer against a sibling MindWeaver checkout when one
   exists.
3. Main agent writes requirements and builds the first vertical slice.
4. Run a final read-only verification pass after implementation.

## Guardrails

- Never edit a MindWeaver checkout while working on SkillWeaver.
- Never rewrite existing skills during indexing.
- Keep the scanner deterministic first; use AI only as a future enhancement.
- Prefer path citations and direct file evidence over invented relationships.
- If a relationship is heuristic, label it as heuristic in the reason.
