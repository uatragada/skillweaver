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
npm run benchmark:skills:holdout
npm run benchmark:skills:holdout:check
npm run benchmark:skills:fresh
npm run benchmark:skills:fresh:check
npm run benchmark:skills:frozen
npm run benchmark:skills:frozen:check
npm run benchmark:skills:clean
npm run benchmark:skills:clean:check
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
- [Post-tuning challenge benchmark](docs/SKILL-USE-HOLDOUT.md)
- [Fresh-probe regression benchmark](docs/SKILL-USE-FRESH.md)
- [Frozen holdout benchmark](docs/SKILL-USE-FROZEN-HOLDOUT.md)
- [Clean holdout V2 benchmark](docs/SKILL-USE-CLEAN-HOLDOUT-V2.md)
- [Support quality roadmap](docs/SUPPORT-QUALITY-ROADMAP.md)
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

Run the non-gating post-tuning challenge suite with:

```powershell
npm run benchmark:skills:holdout
```

Use `npm run benchmark:skills:holdout:check` before citing [docs/SKILL-USE-HOLDOUT.md](docs/SKILL-USE-HOLDOUT.md). The active, challenge, and fresh reports include generated quality slices by benchmark domain and expected concept so broad claims show their coverage and thin spots.

Run the non-gating fresh-probe regression suite with:

```powershell
npm run benchmark:skills:fresh
```

Use `npm run benchmark:skills:fresh:check` before citing [docs/SKILL-USE-FRESH.md](docs/SKILL-USE-FRESH.md). This suite began as fresh generalization evidence; after its misses informed fixes, the checked-in report is regression evidence for that prompt slice.

Run the non-gating frozen holdout suite with:

```powershell
npm run benchmark:skills:frozen
```

Use `npm run benchmark:skills:frozen:check` before citing [docs/SKILL-USE-FROZEN-HOLDOUT.md](docs/SKILL-USE-FROZEN-HOLDOUT.md). This prompt set began as clean-split holdout evidence; after its misses informed V2 fixes, the checked-in report is regression evidence for that frozen slice. Use the earlier committed report for the pre-tuning baseline.

Run the non-gating clean holdout V2 suite with:

```powershell
npm run benchmark:skills:clean
```

Use `npm run benchmark:skills:clean:check` before citing [docs/SKILL-USE-CLEAN-HOLDOUT-V2.md](docs/SKILL-USE-CLEAN-HOLDOUT-V2.md). This suite was captured after commit `3cd6e51` and must stay untouched until any misses are deliberately promoted into challenge or regression work.
