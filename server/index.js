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
const DEFAULT_DEV_ORIGIN = "http://127.0.0.1:5177";

function parseAllowedOrigins(value) {
  return String(value ?? "")
    .split(/[,\s]+/)
    .map((entry) => entry.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

const ALLOWED_CORS_ORIGINS = new Set([
  DEFAULT_DEV_ORIGIN,
  ...parseAllowedOrigins(process.env.SKILLWEAVER_ALLOWED_ORIGINS)
]);

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;
  return ALLOWED_CORS_ORIGINS.has(String(origin).replace(/\/+$/, ""));
}

function shouldIncludeSkillBody(value) {
  return ["1", "true", "yes", "body"].includes(String(value ?? "").toLowerCase());
}

async function createSkillWeaverApp({ initialIndexPromise = scanSkillRoots() } = {}) {
  let indexPromise = initialIndexPromise;
  let latestIndex = await indexPromise;

  function refreshIndex() {
    indexPromise = scanSkillRoots().then((index) => {
      latestIndex = index;
      return index;
    });
    return indexPromise;
  }

  const app = express();
  app.use(cors({
    origin(origin, callback) {
      callback(null, isAllowedCorsOrigin(origin));
    }
  }));
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
    const includeBody = shouldIncludeSkillBody(req.query.includeBody);
    const skill = serializeSkillDetail(index, req.params.id, {
      includeBody,
      includeFrontmatter: includeBody
    });
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

  return app;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  const app = await createSkillWeaverApp();
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`SkillWeaver API listening on http://127.0.0.1:${PORT}`);
  });
}

export { createSkillWeaverApp, isAllowedCorsOrigin };
