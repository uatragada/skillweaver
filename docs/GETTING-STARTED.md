# Getting Started

This guide gets SkillWeaver running against your own local skill library.

## Requirements

- Node.js `22.12.0` or newer.
- A local Codex or agent skill library with `SKILL.md` files.
- PowerShell, Windows Terminal, or any shell that can run npm scripts.

## Install

```powershell
npm install
```

## Run The App

```powershell
npm run dev
```

Open `http://127.0.0.1:5177`.

The API is served from `http://127.0.0.1:3777`.

## Point SkillWeaver At Your Skills

SkillWeaver works out of the box with common home-directory Codex paths. To add
your own roots, copy `.env.example` to `.env.local` and set
`SKILLWEAVER_SKILL_ROOTS`:

```powershell
$env:SKILLWEAVER_SKILL_ROOTS="C:\Users\you\.codex\skills;D:\your-team\skills"
```

You can also set the variable for one shell session:

```powershell
$env:SKILLWEAVER_SKILL_ROOTS="$HOME\.codex\skills;D:\your-team\skills"
npm run index:skills
```

Use semicolons between roots. Do not quote individual paths inside the value.

## Verify The Index

```powershell
npm run index:skills
```

The output should list discovered roots, indexed skills, relationship edges,
concept nodes, concept edges, domains, namespaces, and parser warnings.

Parser warnings are usually caused by malformed frontmatter in a local
`SKILL.md` or adjacent metadata file. SkillWeaver falls back where it can and
reports the warning instead of stopping the whole scan.

## Use The Navigator

1. Enter task wording such as `build a polished frontend dashboard`.
2. Review the top concept or ranked skill.
3. Open the selected item to inspect description, triggers, tags, resource
   folders, and source path.
4. Check the suggested workflow for primary and supporting skills.
5. Copy or load only the relevant `SKILL.md` paths.

## Run Checks

```powershell
npm test
npm run build
npm run benchmark:skills:nightmare
```

For release verification, see [Verification](VERIFICATION.md).

## Troubleshooting

If no skills appear:

- Confirm the configured roots exist.
- Confirm each skill folder has a `SKILL.md`.
- Run `npm run index:skills` to see warnings.
- Check that `.env.local` uses semicolon-separated Windows paths.

If the UI loads but the API is unavailable:

- Confirm `npm run dev` started both the API and Vite server.
- Open `http://127.0.0.1:3777/api/health`.
- If another process owns a port, stop it or adjust the local command.

If benchmark checks fail:

- Read the failure text first. The check mode intentionally fails when reports
  are stale or benchmark-invalidating files are dirty.
- Regenerate the relevant report only when the code, corpus, and cases are in
  the state you intend to cite.
