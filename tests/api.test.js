import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createSkillWeaverApp } from "../server/index.js";

function makeIndex() {
  const skill = {
    id: "privacy-skill",
    name: "privacy-skill",
    description: "Use for privacy checks.",
    path: "C:/skills/privacy-skill/SKILL.md",
    folder: "C:/skills/privacy-skill",
    root: "C:/skills",
    sourceType: "user",
    namespace: null,
    domains: ["security"],
    triggers: ["privacy checks"],
    tools: ["Node"],
    resources: {},
    ui: null,
    contentHash: "sha256:test",
    excerpt: "Use for privacy checks.",
    bodyLength: 44,
    warnings: [],
    headings: ["Workflow"],
    references: ["references/privacy.md"],
    frontmatter: { name: "privacy-skill", localOnly: true },
    body: "# Workflow\nFull local instructions stay server-side.",
    searchText: "privacy skill privacy checks security node"
  };

  return {
    scannedAt: 0,
    roots: ["C:/skills"],
    skills: [skill],
    edges: [],
    concepts: [],
    conceptEdges: []
  };
}

async function startTestServer(index = makeIndex()) {
  const app = await createSkillWeaverApp({ initialIndexPromise: Promise.resolve(index) });
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    async close() {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  };
}

test("API CORS allows the local dev UI origin but not arbitrary webpages", async () => {
  const ctx = await startTestServer();

  try {
    const allowed = await fetch(`${ctx.baseUrl}/api/health`, {
      headers: { Origin: "http://127.0.0.1:5177" }
    });
    assert.equal(allowed.status, 200);
    assert.equal(allowed.headers.get("access-control-allow-origin"), "http://127.0.0.1:5177");

    const unknown = await fetch(`${ctx.baseUrl}/api/health`, {
      headers: { Origin: "https://example.test" }
    });
    assert.equal(unknown.status, 200);
    assert.equal(unknown.headers.get("access-control-allow-origin"), null);
  } finally {
    await ctx.close();
  }
});

test("skill detail API omits raw body and frontmatter unless requested", async () => {
  const ctx = await startTestServer();

  try {
    const defaultResponse = await fetch(`${ctx.baseUrl}/api/skills/privacy-skill`);
    const defaultPayload = await defaultResponse.json();
    assert.equal(defaultResponse.status, 200);
    assert.equal(defaultPayload.skill.body, undefined);
    assert.equal(defaultPayload.skill.frontmatter, undefined);
    assert.equal(defaultPayload.skill.bodyLength, 44);

    const fullResponse = await fetch(`${ctx.baseUrl}/api/skills/privacy-skill?includeBody=true`);
    const fullPayload = await fullResponse.json();
    assert.equal(fullResponse.status, 200);
    assert.match(fullPayload.skill.body, /Full local instructions/);
    assert.equal(fullPayload.skill.frontmatter.localOnly, true);
  } finally {
    await ctx.close();
  }
});
