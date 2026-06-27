# Verification

Current first-slice verification:

```powershell
npm test
npm run benchmark:skills:check
npm run benchmark:skills:holdout:check
npm run benchmark:skills:fresh:check
npm run benchmark:skills:frozen:check
npm run benchmark:skills:clean-v2-regression:check
npm run benchmark:skills:clean-v3:check
npm run benchmark:skills:clean-v4:check
npm run benchmark:skills:clean-v5:check
npm run index:skills
npm run build
```

Expected index result on this machine after the V2 concept-map work:

- 442 skills indexed.
- 2,000 relationship edges generated.
- 22 concept nodes.
- 200 concept edges.
- 0 parser warnings.
- domains include `ai`, `backend`, `frontend`, `github`, `operations`, `security`, and `data`.
- namespaces include plugin names such as `vercel`, `cloudflare`, `figma`, `github`, `gmail`, and `data-analytics`.

The current detailed snapshot lives in [CORPUS-SNAPSHOT.md](CORPUS-SNAPSHOT.md). The active routing-quality benchmark lives in [SKILL-USE-GAINS.md](SKILL-USE-GAINS.md). The non-gating post-tuning challenge benchmark lives in [SKILL-USE-HOLDOUT.md](SKILL-USE-HOLDOUT.md). The non-gating fresh-probe regression benchmark lives in [SKILL-USE-FRESH.md](SKILL-USE-FRESH.md). The frozen holdout regression benchmark lives in [SKILL-USE-FROZEN-HOLDOUT.md](SKILL-USE-FROZEN-HOLDOUT.md); its pre-tuning clean-split baseline is preserved in git history. The clean holdout V2 regression benchmark lives in [SKILL-USE-CLEAN-HOLDOUT-V2.md](SKILL-USE-CLEAN-HOLDOUT-V2.md); its pre-tuning baseline is preserved at `fb1b4cb`. The clean holdout V3 regression benchmark lives in [SKILL-USE-CLEAN-HOLDOUT-V3.md](SKILL-USE-CLEAN-HOLDOUT-V3.md); its pre-tuning baseline is preserved at `00ad343`. The clean holdout V4 regression benchmark lives in [SKILL-USE-CLEAN-HOLDOUT-V4.md](SKILL-USE-CLEAN-HOLDOUT-V4.md); its pre-tuning baseline is preserved at `77d4c73`. The clean holdout V5 regression benchmark lives in [SKILL-USE-CLEAN-HOLDOUT-V5.md](SKILL-USE-CLEAN-HOLDOUT-V5.md); its pre-tuning baseline is preserved at `38e4c6d`. Current clean holdout reports are regression evidence, not clean generalization evidence. Remaining support-quality work is triaged in [SUPPORT-QUALITY-ROADMAP.md](SUPPORT-QUALITY-ROADMAP.md).

Before marking a release ready:

1. Confirm `G:\Projects\MindWeaver` has no new changes from SkillWeaver work.
2. Run the commands above.
3. Confirm all eight benchmark reports are fresh and include `Quality by Domain` plus `Quality by Expected Concept`.
4. For routing changes, confirm any support-miss fix follows the promotion checklist in [SUPPORT-QUALITY-ROADMAP.md](SUPPORT-QUALITY-ROADMAP.md).
5. Launch the UI and verify:
   - search returns relevant ranked skills,
   - filters change the result set,
   - the inspector shows the selected skill path,
   - related skills navigate,
   - concept workflow recommendations update from the query.
