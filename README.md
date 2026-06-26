# SkillWeaver

SkillWeaver is a lightweight local-first navigator for Codex skills. It scans local `SKILL.md` files and turns them into a searchable skill map with ranked routing, related skills, resources, and source paths.

## Quick Start

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5177`.

The API runs on `http://127.0.0.1:3777`.

## Indexing

By default SkillWeaver scans:

- `C:\Users\Uday\.codex\skills`
- `C:\Users\Uday\.codex\skills\.system`
- `C:\Users\Uday\.agents\skills`
- `G:\Projects\Digital Marketing Super Skills`
- `C:\Users\Uday\.codex\plugins\cache\openai-bundled`
- `C:\Users\Uday\.codex\plugins\cache\openai-curated`
- `C:\Users\Uday\.codex\plugins\cache\openai-curated-remote`
- `C:\Users\Uday\.codex\plugins\cache\openai-primary-runtime`

Override roots with a semicolon-separated environment variable:

```powershell
$env:SKILLWEAVER_SKILL_ROOTS="C:\Users\Uday\.codex\skills;G:\Projects\SomeSkills"
npm run dev
```

## Commands

```powershell
npm test
npm run index:skills
npm run build
npm start
```

## What It Indexes

- `SKILL.md` frontmatter and body headings.
- `agents/openai.yaml` UI metadata.
- Resource folders: `references`, `reference`, `scripts`, `assets`, `examples`, and `evaluations`.
- Heuristic domains and tool hints.
- Duplicate names, shared namespaces, shared domains, shared tools, and skill mentions.

The filesystem stays authoritative. SkillWeaver does not rewrite existing skills.
