import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  parseFrontmatter,
  rankSkill,
  recommendWorkflow,
  scanSkillRoots,
  searchSkills
} from "../server/skill-scanner.js";

test("parses nested YAML frontmatter without losing unknown fields", () => {
  const parsed = parseFrontmatter(`---
name: figma-use
description: "Use when working with Figma: files, nodes, and components"
metadata:
  short-description: Figma operations
disable-model-invocation: false
---
# Figma Use

Load this before Figma tool calls.
`);

  assert.equal(parsed.frontmatter.name, "figma-use");
  assert.equal(parsed.frontmatter.description, "Use when working with Figma: files, nodes, and components");
  assert.equal(parsed.frontmatter.metadata["short-description"], "Figma operations");
  assert.equal(parsed.frontmatter["disable-model-invocation"], false);
  assert.match(parsed.body, /Figma Use/);
});

test("scans skill roots, resources, UI metadata, and duplicate-name edges", async () => {
  const root = await mkdtemp(join(tmpdir(), "skillweaver-"));
  const first = join(root, "skills", "skill-a");
  const second = join(root, "plugin", "skills", "skill-a");
  await mkdir(join(first, "agents"), { recursive: true });
  await mkdir(join(first, "references"), { recursive: true });
  await mkdir(second, { recursive: true });

  await writeFile(join(first, "SKILL.md"), `---
name: skill-a
description: Use for fixing GitHub CI failures and pull request checks.
---
# Workflow

Read references/ci.md before changing CI.
`);
  await writeFile(join(first, "agents", "openai.yaml"), `display_name: Skill A
short_description: Fix CI
default_prompt: Fix the failing checks.
`);
  await writeFile(join(first, "references", "ci.md"), "# CI notes\n");
  await writeFile(join(second, "SKILL.md"), `---
name: skill-a
description: Legacy plugin cache duplicate for CI repair.
---
# Duplicate
`);

  const index = await scanSkillRoots([root]);
  assert.equal(index.skills.length, 2);
  assert.ok(index.skills.some((skill) => skill.ui?.display_name === "Skill A"));
  assert.ok(index.skills.some((skill) => skill.resources.references?.includes("references\\ci.md") || skill.resources.references?.includes("references/ci.md")));
  assert.ok(index.edges.some((edge) => edge.type === "duplicates_name"));
});

test("ranks task wording and recommends a primary workflow skill", () => {
  const index = {
    skills: [
      {
        id: "github-ci",
        name: "gh-fix-ci",
        description: "Use when fixing GitHub Actions and CI failures.",
        path: "C:/skills/gh-fix-ci/SKILL.md",
        folder: "C:/skills/gh-fix-ci",
        root: "C:/skills",
        sourceType: "user",
        namespace: null,
        domains: ["github", "operations"],
        triggers: ["fix failing github ci"],
        tools: ["GitHub"],
        resources: {},
        excerpt: "",
        bodyLength: 1,
        warnings: [],
        searchText: "gh fix ci github actions failures"
      },
      {
        id: "frontend",
        name: "frontend-app-builder",
        description: "Use for frontend apps.",
        path: "C:/skills/frontend/SKILL.md",
        folder: "C:/skills/frontend",
        root: "C:/skills",
        sourceType: "user",
        namespace: null,
        domains: ["frontend"],
        triggers: ["build a frontend app"],
        tools: [],
        resources: {},
        excerpt: "",
        bodyLength: 1,
        warnings: [],
        searchText: "frontend react vite"
      }
    ],
    edges: [
      {
        sourceId: "github-ci",
        targetId: "frontend",
        type: "shared_tool",
        label: "GitHub",
        weight: 0.6,
        reason: "test"
      }
    ]
  };

  const results = searchSkills(index, "fix failing github ci");
  assert.equal(results[0].id, "github-ci");
  assert.ok(rankSkill(index.skills[0], "fix failing github ci") > rankSkill(index.skills[1], "fix failing github ci"));

  const workflow = recommendWorkflow(index, "fix failing github ci");
  assert.equal(workflow.primary.id, "github-ci");
  assert.equal(workflow.steps[0].name, "gh-fix-ci");
});

