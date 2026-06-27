# SkillWeaver

SkillWeaver is a lightweight local-first navigator for Codex skills. It scans local `SKILL.md` files and turns them into a concept-first map with ranked routing, related skills, resources, and source paths.

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
npm run benchmark:skills
npm run benchmark:skills:check
npm run build
npm start
```

## What It Indexes

- `SKILL.md` frontmatter and body headings.
- `agents/openai.yaml` UI metadata.
- Resource folders: `references`, `reference`, `scripts`, `assets`, `examples`, and `evaluations`.
- Heuristic domains and tool hints.
- Duplicate names, shared namespaces, shared domains, shared tools, and skill mentions.
- High-level work concepts that reference role-tagged skills.
- Concept links from curated workflow adjacency and shared concept evidence.

The filesystem stays authoritative. SkillWeaver does not rewrite existing skills.

## Concept Mapping

SkillWeaver now treats high-level work concepts as the primary graph nodes. Each concept references skills by role:

- `gateway`: load or inspect first.
- `primary`: main execution skill for that concept.
- `verification`: skills that prove the work is correct.
- `supporting`: adjacent helpers.
- `reference`: weaker but still relevant matches.

The concept layer is deterministic and derived from current skill metadata; it does not mutate the source `SKILL.md` files.

By default, `/api/skills` and `/api/workflow` use the V2 concept-aided route. Use `?mode=skills` on either endpoint to inspect the raw skill-level baseline.

## Research Ledger

- [Routing evaluation methodology](docs/ROUTING-EVAL-METHODOLOGY.md)
- [Skill use gains benchmark](docs/SKILL-USE-GAINS.md)
- [Routing failure atlas](docs/ROUTING-FAILURE-ATLAS.md)
- [Concept map governance](docs/CONCEPT-MAP-GOVERNANCE.md)
- [Corpus snapshot](docs/CORPUS-SNAPSHOT.md)
- [V2 experiment log](docs/V2-EXPERIMENT-LOG.md)

## Benchmarking

Run the reproducible routing benchmark with:

```powershell
npm run benchmark:skills
```

The benchmark compares V2 against a flat no-SkillWeaver metadata-search baseline and the V1 skill-level SkillWeaver route, then writes [docs/SKILL-USE-GAINS.md](docs/SKILL-USE-GAINS.md).
Use `npm run benchmark:skills:check` to fail fast when the checked-in benchmark report is stale, generated from different scanner/case/corpus inputs, or generated while benchmark-invalidating files are dirty.
