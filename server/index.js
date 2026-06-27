import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getRelatedConcepts,
  getRelatedSkills,
  recommendConceptWorkflow,
  recommendWorkflow,
  scanSkillRoots,
  searchConceptWorkflowSkills,
  searchConcepts,
  searchSkills,
  serializeConceptDetail,
  serializeSkillDetail,
  summarizeIndex
} from "./skill-scanner.js";

const PORT = Number(process.env.PORT || 3777);
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIST_DIR = join(ROOT, "dist");

let indexPromise = scanSkillRoots();
let latestIndex = await indexPromise;

function refreshIndex() {
  indexPromise = scanSkillRoots().then((index) => {
    latestIndex = index;
    return index;
  });
  return indexPromise;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    app: "SkillWeaver",
    summary: summarizeIndex(latestIndex)
  });
});

app.post("/api/refresh", async (req, res) => {
  const index = await refreshIndex();
  res.json({ ok: true, summary: summarizeIndex(index) });
});

app.get("/api/skills", async (req, res) => {
  const index = await indexPromise;
  const filters = {
    root: req.query.root,
    domain: req.query.domain,
    sourceType: req.query.sourceType,
    namespace: req.query.namespace
  };
  res.json({
    summary: summarizeIndex(index),
    skills: req.query.mode === "skills"
      ? searchSkills(index, String(req.query.q ?? ""), filters)
      : searchConceptWorkflowSkills(index, String(req.query.q ?? ""), filters)
  });
});

app.get("/api/skills/:id", async (req, res) => {
  const index = await indexPromise;
  const skill = serializeSkillDetail(index, req.params.id);
  if (!skill) return res.status(404).json({ error: "skill not found" });
  res.json({ skill });
});

app.get("/api/skills/:id/related", async (req, res) => {
  const index = await indexPromise;
  res.json({ related: getRelatedSkills(index, req.params.id) });
});

app.get("/api/concepts", async (req, res) => {
  const index = await indexPromise;
  const filters = {
    root: req.query.root,
    domain: req.query.domain,
    sourceType: req.query.sourceType,
    namespace: req.query.namespace
  };
  res.json({
    summary: summarizeIndex(index),
    concepts: searchConcepts(index, String(req.query.q ?? ""), filters),
    conceptEdges: index.conceptEdges
  });
});

app.get("/api/concepts/:id", async (req, res) => {
  const index = await indexPromise;
  const concept = serializeConceptDetail(index, req.params.id);
  if (!concept) return res.status(404).json({ error: "concept not found" });
  res.json({ concept });
});

app.get("/api/concepts/:id/related", async (req, res) => {
  const index = await indexPromise;
  res.json({ related: getRelatedConcepts(index, req.params.id) });
});

app.get("/api/workflow", async (req, res) => {
  const index = await indexPromise;
  const filters = {
    root: req.query.root,
    domain: req.query.domain,
    sourceType: req.query.sourceType,
    namespace: req.query.namespace
  };
  const query = String(req.query.q ?? "");
  const workflow = req.query.mode === "skills"
    ? recommendWorkflow(index, query, filters)
    : recommendConceptWorkflow(index, query, filters);
  res.json(workflow);
});

if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res) => {
    res.sendFile(join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, "127.0.0.1", () => {
  console.log(`SkillWeaver API listening on http://127.0.0.1:${PORT}`);
});
