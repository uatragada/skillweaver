# Verification

Use this page before citing benchmark results or publishing a release.

## Core Checks

These are the portable repo checks used by CI:

```powershell
npm test
npm run build
```

`npm run index:skills` is still useful during local setup, but its counts and
warnings depend on the user's configured skill roots.

## Benchmark Checks

Benchmark checks are local-corpus evaluations. They should gate a benchmark
claim before publishing or citing it, but they should not be treated as
portable CI checks for every clone because each user can configure different
skill roots.

The active acceptance report is the main maintainer benchmark:

```powershell
npm run benchmark:skills:check
```

Non-gating regression and challenge suites:

```powershell
npm run benchmark:skills:holdout:check
npm run benchmark:skills:fresh:check
npm run benchmark:skills:frozen:check
npm run benchmark:skills:clean-v2-regression:check
npm run benchmark:skills:clean-v3:check
npm run benchmark:skills:clean-v4:check
npm run benchmark:skills:clean-v5:check
```

Adversarial stress suite:

```powershell
npm run benchmark:skills:nightmare
```

The nightmare suite writes [SKILL-ROUTING-NIGHTMARE.md](SKILL-ROUTING-NIGHTMARE.md)
and `benchmarks/results/skill-routing-nightmare.latest.json`.

## Expected Local Index Shape

Skill counts depend on each user's configured roots. On the latest local
benchmark runs in this repo, the corpus shape was:

- 429 skills indexed.
- 7 skill roots.
- 2,000 skill relationship edges.
- 22 concept nodes.
- 200 concept edges.

The same verification run reported 1 parser warning from a machine-local skill
with loose frontmatter. Parser warnings can differ by local skill library. Treat
warnings as scan evidence to inspect, not as universal repo failures.

The detailed corpus snapshot lives in [CORPUS-SNAPSHOT.md](CORPUS-SNAPSHOT.md).

## Report Ledger

| Report | Meaning |
| --- | --- |
| [SKILL-USE-GAINS.md](SKILL-USE-GAINS.md) | Active acceptance suite and main current-quality claim. |
| [SKILL-USE-HOLDOUT.md](SKILL-USE-HOLDOUT.md) | Post-tuning challenge evidence. |
| [SKILL-USE-FRESH.md](SKILL-USE-FRESH.md) | Fresh-probe regression evidence after fixes. |
| [SKILL-USE-FROZEN-HOLDOUT.md](SKILL-USE-FROZEN-HOLDOUT.md) | Frozen holdout regression evidence. |
| [SKILL-USE-CLEAN-HOLDOUT-V2.md](SKILL-USE-CLEAN-HOLDOUT-V2.md) | Clean V2 regression evidence; pre-tuning baseline preserved at `fb1b4cb`. |
| [SKILL-USE-CLEAN-HOLDOUT-V3.md](SKILL-USE-CLEAN-HOLDOUT-V3.md) | Clean V3 regression evidence; pre-tuning baseline preserved at `00ad343`. |
| [SKILL-USE-CLEAN-HOLDOUT-V4.md](SKILL-USE-CLEAN-HOLDOUT-V4.md) | Clean V4 regression evidence; pre-tuning baseline preserved at `77d4c73`. |
| [SKILL-USE-CLEAN-HOLDOUT-V5.md](SKILL-USE-CLEAN-HOLDOUT-V5.md) | Clean V5 regression evidence; pre-tuning baseline preserved at `38e4c6d`. |
| [SKILL-ROUTING-NIGHTMARE.md](SKILL-ROUTING-NIGHTMARE.md) | Adversarial ambiguity, negation, decoy, and guardrail stress evidence. |

Current clean holdout reports are regression evidence, not clean-split
generalization proof. A new clean generalization claim needs an untouched prompt
set captured after the routing changes being evaluated.

## UI Verification

Before calling UI work done:

1. Start `npm run dev`.
2. Open `http://127.0.0.1:5177`.
3. Search for a task phrase such as `build a polished frontend dashboard`.
4. Confirm concept results or ranked skills update.
5. Confirm filters change the result set.
6. Select a concept and inspect its role-tagged skills.
7. Select a skill and inspect path, resources, triggers, and related skills.
8. Confirm suggested workflow changes with the query.
9. Check mobile width for readable controls and non-overlapping text.

## Release Checklist

1. Confirm no SkillWeaver work changed any sibling MindWeaver checkout.
2. Run core checks.
3. Run benchmark checks that match the claim you intend to cite.
4. Confirm generated reports are not stale and include quality by domain and
   expected concept where applicable.
5. For routing changes, confirm any support-miss fix follows the promotion
   checklist in [SUPPORT-QUALITY-ROADMAP.md](SUPPORT-QUALITY-ROADMAP.md).
6. Confirm [../LICENSE](../LICENSE) is present before public distribution.
