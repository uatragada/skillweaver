# SkillWeaver Performance Evaluation

Date: 2026-06-26

## Method

Ran 15 realistic task prompts through `recommendWorkflow()` and compared whether the expected skill appeared as the primary recommendation or in the suggested workflow.

## Result

Initial benchmark:

- 424 skills indexed.
- 11 / 15 expected skills present.
- Main misses:
  - `figma-use` was not prioritized as a gateway skill.
  - generic plugin `index` skills could outrank concrete task skills.
  - external project skill roots were missing.

After tuning:

- 439 skills indexed.
- 13 / 15 expected skills present.
- 0 parser warnings.
- `figma-use` is now primary for “Use Figma...” prompts.
- `analytics-cro-and-reporting` is now indexed from the external Digital Marketing Super Skills root.

## Current Benchmark Cases

| Prompt | Expected | Primary after tuning | Result |
| --- | --- | --- | --- |
| Build a polished frontend dashboard with browser QA | `frontend-app-builder` | `frontend-app-builder` | pass |
| Fix failing GitHub Actions CI and address PR comments | `gh-fix-ci` | `gh-address-comments` | pass, expected skill in workflow |
| Use Figma to inspect a design and implement it | `figma-use` | `figma-use` | pass |
| Create a data analytics dashboard from KPI data | `build-dashboard` | `dev-data-engineering` | miss |
| Audit a repo for security vulnerabilities and attack paths | `security-scan` | `security-threat-model` | pass, expected skill family in workflow |
| Deploy this project to Vercel and inspect build logs | `vercel` | `vercel-api` | pass |
| Create or update a Codex skill with scripts and references | `skill-creator` | `hatch-pet` | pass, expected skill in workflow |
| Work with PDF extraction and manipulation | `pdf` | `pdf` | pass |
| Make a PowerPoint presentation deck | `presentations` | `Presentations` | pass |
| Train or inspect Hugging Face models and datasets | `hugging-face` | `huggingface-llm-trainer` | partial; useful concrete skill but namespace not shown |
| Triage Gmail inbox and draft replies | `gmail` | `gmail` | pass |
| Build a Phaser browser game with playtesting | `phaser-2d-game` | `phaser-2d-game` | pass |
| Write an architecture decision record | `architecture-decision-record` | `architecture-decision-record` | pass |
| Analyze conversion tracking and CRO reporting | `analytics-cro-and-reporting` | `analytics-cro-and-reporting` | pass |
| Investigate a MindWeaver graph or SkillWeaver itself | `skillweaver` | `skillweaver` | pass |

## Assessment

SkillWeaver improves agent skill selection for broad local navigation. It is especially useful when:

- the relevant skill is buried in the plugin cache,
- there are duplicate skills across roots,
- a workflow needs multiple supporting skills,
- a task has obvious tool nouns like Figma, Gmail, PDF, GitHub, Vercel, Phaser, or SkillWeaver.

It still needs better domain-specific routing for data analytics dashboard tasks and clearer namespace-aware scoring for plugin families such as Hugging Face.

