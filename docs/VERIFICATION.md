# Verification

Current first-slice verification:

```powershell
npm test
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

The current detailed snapshot lives in [CORPUS-SNAPSHOT.md](CORPUS-SNAPSHOT.md). The current routing-quality benchmark lives in [SKILL-USE-GAINS.md](SKILL-USE-GAINS.md).

Before marking a release ready:

1. Confirm `G:\Projects\MindWeaver` has no new changes from SkillWeaver work.
2. Run the three commands above.
3. Launch the UI and verify:
   - search returns relevant ranked skills,
   - filters change the result set,
   - the inspector shows the selected skill path,
   - related skills navigate,
   - concept workflow recommendations update from the query.
