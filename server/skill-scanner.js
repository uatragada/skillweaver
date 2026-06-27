import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const DEFAULT_SKILL_ROOTS = [
  "C:\\Users\\Uday\\.codex\\skills",
  "C:\\Users\\Uday\\.codex\\skills\\.system",
  "C:\\Users\\Uday\\.agents\\skills",
  "G:\\Projects\\Digital Marketing Super Skills",
  "C:\\Users\\Uday\\.codex\\plugins\\cache\\openai-bundled",
  "C:\\Users\\Uday\\.codex\\plugins\\cache\\openai-curated",
  "C:\\Users\\Uday\\.codex\\plugins\\cache\\openai-curated-remote",
  "C:\\Users\\Uday\\.codex\\plugins\\cache\\openai-primary-runtime"
];

const DOMAIN_RULES = [
  ["frontend", ["frontend", "react", "vite", "css", "ui", "design", "web app", "browser"]],
  ["backend", ["api", "backend", "server", "node", "express", "database", "postgres", "dotnet", "java"]],
  ["data", ["data", "analytics", "dashboard", "metric", "kpi", "visualization", "spreadsheet"]],
  ["ai", ["llm", "ai", "agent", "openai", "hugging face", "model", "prompt", "rag"]],
  ["security", ["security", "threat", "vulnerability", "audit", "risk", "compliance"]],
  ["github", ["github", "pull request", "pr", "issue", "ci", "coderabbit"]],
  ["operations", ["devops", "deploy", "release", "monitoring", "incident", "sre", "cloudflare", "vercel"]],
  ["documents", ["pdf", "docx", "document", "latex", "presentation", "slide"]],
  ["product", ["product", "roadmap", "prd", "user research", "strategy"]],
  ["creative", ["creative", "image", "moodboard", "ads", "positioning", "copy"]]
];

const TOOL_RULES = [
  ["OpenAI", ["openai", "responses api", "agents sdk"]],
  ["GitHub", ["github", "gh ", "pull request", "issues"]],
  ["Linear", ["linear"]],
  ["Gmail", ["gmail", "email"]],
  ["Figma", ["figma"]],
  ["Vercel", ["vercel"]],
  ["Cloudflare", ["cloudflare", "wrangler", "workers"]],
  ["Playwright", ["playwright", "browser qa", "screenshot"]],
  ["Python", ["python", "pytest", ".py"]],
  ["Node", ["node", "npm", "typescript", "javascript"]]
];

const CONCEPT_RULES = [
  {
    id: "frontend-implementation",
    label: "Frontend implementation",
    description: "Build, adapt, and harden browser-facing React, Vite, CSS, and component work.",
    triggers: ["build a web app", "frontend app", "react ui", "implement a page", "fix ui"],
    domains: ["frontend", "product"],
    tools: ["Node", "Playwright", "Figma", "Vercel"],
    gatewaySkillNames: ["build-web-apps:frontend-app-builder"],
    primarySkillNames: ["dev-frontend-react-next", "build-web-apps:react-best-practices"],
    supportingSkillNames: ["build-web-apps:shadcn", "dev-frontend-accessibility-css", "premium-web-design", "design-qa"],
    verificationSkillNames: ["build-web-apps:frontend-testing-debugging", "playwright", "screenshot"],
    relatedConceptIds: ["figma-handoff", "browser-verification", "deployment-release"]
  },
  {
    id: "browser-verification",
    label: "Browser verification",
    description: "Exercise live browser behavior, inspect screenshots, and verify UI changes against the running app.",
    triggers: ["browser qa", "playwright screenshot", "verify live app", "control chrome", "inspect page"],
    domains: ["frontend"],
    tools: ["Playwright", "Node"],
    gatewaySkillNames: ["browser:control-in-app-browser", "chrome:control-chrome"],
    primarySkillNames: ["playwright", "playwright-interactive", "build-web-apps:frontend-testing-debugging"],
    supportingSkillNames: ["screenshot"],
    verificationSkillNames: ["vercel:agent-browser-verify"],
    relatedConceptIds: ["frontend-implementation", "deployment-release"]
  },
  {
    id: "figma-handoff",
    label: "Figma design handoff",
    description: "Navigate Figma context, audit component intent, and translate designs into implementation work.",
    triggers: ["figma design", "design to code", "implement figma", "design handoff", "component audit"],
    domains: ["frontend", "product", "creative"],
    tools: ["Figma", "Node"],
    gatewaySkillNames: ["figma-use", "figma:figma-use"],
    primarySkillNames: ["figma-implement-design", "figma:figma-code-connect", "product-design:image-to-code", "design-image-to-code", "design-url-to-code"],
    supportingSkillNames: ["figma-design-qa", "figma-component-audit", "figma-create-design-system-rules", "product-design:get-context", "figma:figma-generate-design"],
    verificationSkillNames: ["design-qa", "figma-design-review"],
    relatedConceptIds: ["frontend-implementation", "browser-verification"]
  },
  {
    id: "data-dashboarding",
    label: "Data dashboards and reports",
    description: "Profile data, design KPIs, build dashboards or reports, and validate analytical outputs.",
    triggers: ["analytics dashboard", "kpi report", "visualize data", "data quality", "business analysis"],
    domains: ["data", "product"],
    tools: ["Python", "Node"],
    gatewaySkillNames: ["data-analytics:index"],
    primarySkillNames: ["data-analytics:build-dashboard", "data-analytics:build-report", "build-web-data-visualization:data-visualization", "data-analytics:visualize-data"],
    supportingSkillNames: ["data-analytics:design-kpis", "data-analysis-standard", "chart-data-extractor", "spreadsheets:Spreadsheets"],
    verificationSkillNames: ["data-analytics:validate-data", "data-analytics:analyze-data-quality"],
    relatedConceptIds: ["frontend-implementation", "product-planning"]
  },
  {
    id: "github-pr-repair",
    label: "GitHub PR repair",
    description: "Inspect branches, address review comments, repair CI, and keep issue or PR state aligned with code.",
    triggers: ["fix ci", "github actions", "pull request review", "address comments", "check ci"],
    domains: ["github", "operations"],
    tools: ["GitHub", "Node"],
    primarySkillNames: ["gh-fix-ci", "github:gh-fix-ci", "gh-address-comments", "github:gh-address-comments", "github:github"],
    supportingSkillNames: ["coderabbit:code-review", "code-review-checklist", "changelog-generator", "dev-git-github-collaboration"],
    verificationSkillNames: ["codex-security:security-diff-scan"],
    relatedConceptIds: ["repo-operations", "deployment-release", "security-review"]
  },
  {
    id: "security-review",
    label: "Security review",
    description: "Threat-model, scan, triage findings, and validate security-sensitive changes.",
    triggers: ["security scan", "threat model", "vulnerability", "audit finding", "risk review"],
    domains: ["security", "operations"],
    tools: ["GitHub"],
    primarySkillNames: ["codex-security:security-scan", "codex-security:deep-security-scan", "codex-security:threat-model", "security-threat-model", "security-best-practices"],
    supportingSkillNames: ["codex-security:finding-discovery", "codex-security:triage-finding", "codex-security:track-findings", "skill-security-auditor"],
    verificationSkillNames: ["codex-security:validation", "codex-security:security-diff-scan"],
    relatedConceptIds: ["github-pr-repair", "repo-operations"]
  },
  {
    id: "deployment-release",
    label: "Deployment and release",
    description: "Prepare releases, deploy to hosting providers, repair deployment issues, and verify production surfaces.",
    triggers: ["deploy app", "release readiness", "vercel", "cloudflare", "netlify", "render"],
    domains: ["operations", "frontend", "backend"],
    tools: ["Vercel", "Cloudflare", "GitHub", "Node"],
    primarySkillNames: ["vercel-deploy", "vercel:bootstrap", "cloudflare-deploy", "cloudflare:wrangler", "netlify-deploy", "render-deploy"],
    supportingSkillNames: ["launch-readiness", "dev-release-productization", "cicd-playbook", "monitoring-setup-guide"],
    verificationSkillNames: ["vercel:agent-browser-verify", "browser-verification"],
    relatedConceptIds: ["frontend-implementation", "browser-verification", "github-pr-repair"]
  },
  {
    id: "skill-authoring",
    label: "Skill authoring",
    description: "Create, install, evaluate, and maintain Codex skills and plugin bundles.",
    triggers: ["create a skill", "install skill", "skill navigator", "plugin creator", "skill routing"],
    domains: ["ai", "documents"],
    tools: ["OpenAI", "GitHub", "Node"],
    gatewaySkillNames: ["skillweaver"],
    primarySkillNames: ["skill-creator", "skill-installer", "plugin-creator"],
    supportingSkillNames: ["template-creator:template-creator", "dev-documentation-systems"],
    verificationSkillNames: ["skill-security-auditor"],
    relatedConceptIds: ["agent-llm-apps", "repo-operations"]
  },
  {
    id: "documents-pdf",
    label: "Documents and PDFs",
    description: "Read, transform, write, or validate PDF, document, LaTeX, and documentation artifacts.",
    triggers: ["pdf", "docx", "document pipeline", "latex", "write docs", "api documentation"],
    domains: ["documents", "data"],
    tools: ["Python", "Node"],
    primarySkillNames: ["pdf", "pdf:pdf", "documents:documents", "api-docs-writer", "dev-documentation-systems"],
    supportingSkillNames: ["latex:latex-compile", "latex:latex-doctor", "architecture-decision-record", "technical-spec-template"],
    verificationSkillNames: ["docbridge-full-stack-verification"],
    relatedConceptIds: ["presentations", "data-dashboarding"]
  },
  {
    id: "presentations",
    label: "Presentations",
    description: "Build slide decks, roadmap narratives, and presentation-ready documents.",
    triggers: ["presentation", "slides", "roadmap deck", "pitch deck"],
    domains: ["documents", "product"],
    tools: ["Node"],
    primarySkillNames: ["presentations:Presentations", "roadmap-presentation"],
    supportingSkillNames: ["template-creator:template-creator", "documents:documents"],
    relatedConceptIds: ["documents-pdf", "product-planning"]
  },
  {
    id: "email-triage",
    label: "Email triage",
    description: "Search, triage, summarize, and act on Gmail threads or inbox state.",
    triggers: ["gmail", "inbox triage", "email", "draft reply"],
    domains: ["operations"],
    tools: ["Gmail"],
    primarySkillNames: ["gmail:gmail", "gmail:gmail-inbox-triage", "email-triage"],
    relatedConceptIds: ["product-planning", "repo-operations"]
  },
  {
    id: "game-development",
    label: "Game development",
    description: "Build, test, and tune browser games, WebGL scenes, sprites, and playtest loops.",
    triggers: ["game", "phaser", "three.js", "webgl", "playtest", "sprite"],
    domains: ["frontend", "creative"],
    tools: ["Node", "Playwright"],
    primarySkillNames: ["game-studio:game-studio", "game-studio:phaser-2d-game", "game-studio:three-webgl-game", "game-studio:web-game-foundations", "game-studio:react-three-fiber-game"],
    supportingSkillNames: ["game-studio:sprite-pipeline", "game-studio:web-3d-asset-pipeline", "racingsim-game-dev"],
    verificationSkillNames: ["game-studio:game-playtest"],
    relatedConceptIds: ["frontend-implementation", "browser-verification"]
  },
  {
    id: "agent-llm-apps",
    label: "Agent and LLM apps",
    description: "Build OpenAI, agent SDK, RAG, ChatGPT app, and model-backed application workflows.",
    triggers: ["openai", "agent sdk", "llm app", "rag", "chatgpt app", "copilot"],
    domains: ["ai", "backend", "frontend"],
    tools: ["OpenAI", "Cloudflare", "Vercel", "Node"],
    primarySkillNames: ["openai-docs", "dev-ai-llm-apps", "openai-agents-js", "chatgpt-apps", "copilot-sdk", "cloudflare:agents-sdk", "vercel:ai-sdk"],
    supportingSkillNames: ["hugging-face:transformers-js", "hugging-face:huggingface-gradio", "local-speech-ai-mvp"],
    relatedConceptIds: ["skill-authoring", "cloudflare-workers", "huggingface-ml"]
  },
  {
    id: "product-planning",
    label: "Product planning",
    description: "Turn goals, research, roadmaps, and issue trackers into actionable product or implementation plans.",
    triggers: ["prd", "roadmap", "linear", "user research", "feature priority", "launch checklist"],
    domains: ["product", "documents"],
    tools: ["Linear"],
    primarySkillNames: ["linear", "linear:linear", "prd-template", "roadmap-narrative", "feature-prioritisation", "ux-research-plan", "user-research-synthesis"],
    supportingSkillNames: ["product-launch-checklist", "product-design:index", "onboarding-plan"],
    relatedConceptIds: ["presentations", "data-dashboarding", "github-pr-repair"]
  },
  {
    id: "cloudflare-workers",
    label: "Cloudflare workers",
    description: "Build, configure, and deploy Cloudflare Workers, Durable Objects, MCP servers, and agent runtimes.",
    triggers: ["cloudflare workers", "wrangler", "durable object", "mcp server", "cloudflare agent"],
    domains: ["operations", "backend", "ai"],
    tools: ["Cloudflare", "Node"],
    primarySkillNames: ["cloudflare:workers-best-practices", "cloudflare:wrangler", "cloudflare:durable-objects", "cloudflare:building-mcp-server-on-cloudflare", "cloudflare:building-ai-agent-on-cloudflare"],
    supportingSkillNames: ["cloudflare:cloudflare", "cloudflare:web-perf", "cloudflare:sandbox-sdk"],
    relatedConceptIds: ["deployment-release", "agent-llm-apps"]
  },
  {
    id: "huggingface-ml",
    label: "Hugging Face ML",
    description: "Search, inspect, train, publish, and operate Hugging Face models, datasets, Spaces, and papers.",
    triggers: ["hugging face", "dataset", "model training", "gradio", "papers", "spaces"],
    domains: ["ai", "data"],
    tools: ["Python"],
    primarySkillNames: ["hugging-face:hf-cli", "hugging-face:huggingface-datasets", "hugging-face:huggingface-llm-trainer", "hugging-face:huggingface-vision-trainer", "hugging-face:huggingface-papers"],
    supportingSkillNames: ["hugging-face:huggingface-gradio", "hugging-face:huggingface-jobs", "hugging-face:transformers-js"],
    relatedConceptIds: ["agent-llm-apps", "data-dashboarding"]
  },
  {
    id: "marketing-growth",
    label: "Marketing growth",
    description: "Plan, research, produce, and measure marketing, SEO, CRO, creative, and industry growth work.",
    triggers: ["marketing strategy", "seo", "cro", "creative ads", "growth report", "competitive intelligence"],
    domains: ["creative", "data", "product"],
    tools: ["Node"],
    primarySkillNames: ["marketing-strategy-and-growth", "seo-and-organic-growth", "analytics-cro-and-reporting", "creative-production", "creative-offer", "creative-ads-explorer"],
    supportingSkillNames: ["competitive-intelligence-monitor", "business-strategy-and-research", "industry-playbooks", "creative-positioning"],
    relatedConceptIds: ["data-dashboarding", "product-planning"]
  },
  {
    id: "repo-operations",
    label: "Repository operations",
    description: "Inspect repos, preserve worktree state, review dependencies, document architecture, and keep implementation changes scoped.",
    triggers: ["repo audit", "code review", "dependency audit", "technical debt", "architecture review", "monorepo"],
    domains: ["backend", "operations", "github", "security"],
    tools: ["GitHub", "Node", "Python"],
    primarySkillNames: ["conservative-repo-operations", "code-review-checklist", "dependency-audit", "dev-architecture-review", "technical-debt-register"],
    supportingSkillNames: ["dev-monorepo-build-systems", "dev-dependency-maintenance", "error-decoder", "debugging-log-analyser"],
    verificationSkillNames: ["codex-security:security-diff-scan"],
    relatedConceptIds: ["github-pr-repair", "security-review", "deployment-release"]
  }
];

const CONCEPT_ROLE_PRIORITY = {
  gateway: 5,
  primary: 4,
  verification: 3,
  supporting: 2,
  reference: 1
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "any",
  "are",
  "build",
  "can",
  "code",
  "create",
  "for",
  "from",
  "how",
  "into",
  "make",
  "need",
  "needs",
  "new",
  "not",
  "that",
  "the",
  "this",
  "use",
  "uses",
  "using",
  "when",
  "with",
  "work"
]);

const SOURCE_TYPE_PRIORITY = {
  user: 5,
  system: 4,
  plugin: 3,
  runtime: 2,
  "legacy-plugin-cache": 1,
  external: 0
};

function splitEnvList(value) {
  return String(value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizePath(value) {
  return normalize(resolve(value));
}

function getConfiguredSkillRoots() {
  const envRoots = splitEnvList(process.env.SKILLWEAVER_SKILL_ROOTS);
  const roots = envRoots.length ? envRoots : DEFAULT_SKILL_ROOTS;
  const seen = new Set();
  return roots
    .map((root) => normalizePath(root))
    .filter((root) => {
      const key = root.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return existsSync(root);
    });
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s:.-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashId(value) {
  return createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s:/.-]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeSearchText(value)
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));
}

function parseFrontmatter(content) {
  const normalized = String(content ?? "").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return {
      frontmatter: {},
      body: normalized,
      warnings: ["missing frontmatter"]
    };
  }

  const end = normalized.indexOf("\n---", 4);
  if (end === -1) {
    return {
      frontmatter: {},
      body: normalized,
      warnings: ["unterminated frontmatter"]
    };
  }

  const rawFrontmatter = normalized.slice(4, end).trim();
  const body = normalized.slice(end + 4).replace(/^\n/, "");
  const warnings = [];

  try {
    const parsed = YAML.parse(rawFrontmatter) ?? {};
    return {
      frontmatter: typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {},
      body,
      warnings
    };
  } catch (error) {
    return { frontmatter: parseLooseFrontmatter(rawFrontmatter), body, warnings };
  }
}

function parseLooseFrontmatter(rawFrontmatter) {
  const output = {};
  const lines = String(rawFrontmatter ?? "").replace(/\r\n?/g, "\n").split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;

    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if (value === ">" || value === "|") {
      const block = [];
      while (index + 1 < lines.length && (/^\s+/.test(lines[index + 1]) || !lines[index + 1].trim())) {
        index += 1;
        block.push(lines[index].trim());
      }
      output[key] = value === ">" ? block.filter(Boolean).join(" ") : block.join("\n").trim();
      continue;
    }

    output[key] = parseLooseScalar(value);
  }

  return output;
}

function parseLooseScalar(value) {
  const trimmed = String(value ?? "").trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\""))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractHeadings(body) {
  return String(body ?? "")
    .split(/\r?\n/)
    .map((line) => /^(#{1,4})\s+(.+)$/.exec(line.trim()))
    .filter(Boolean)
    .map((match) => match[2].replace(/[#`*_]+/g, "").trim())
    .filter(Boolean)
    .slice(0, 18);
}

function extractReferences(body) {
  const references = new Set();
  const patterns = [
    /\[[^\]]+\]\(([^)]+)\)/g,
    /(?:See|Read|Use|Open|Run)\s+`([^`]+\.(?:md|py|mjs|js|ts|tsx|json|yaml|yml))`/gi,
    /(?:references|scripts|assets|examples)\/[A-Za-z0-9_.\-\/]+/g
  ];

  for (const pattern of patterns) {
    for (const match of String(body ?? "").matchAll(pattern)) {
      const value = (match[1] ?? match[0]).trim();
      if (!value || value.startsWith("http")) continue;
      references.add(value.replace(/^\.\/+/, ""));
    }
  }

  return [...references].slice(0, 30);
}

async function readYamlFile(filePath) {
  try {
    if (!existsSync(filePath)) return null;
    const content = await readFile(filePath, "utf8");
    const parsed = YAML.parse(content);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

async function listResourceFiles(folder, names) {
  const resources = {};
  for (const name of names) {
    const dir = join(folder, name);
    if (!existsSync(dir)) {
      resources[name] = [];
      continue;
    }
    const files = [];
    async function walk(current, depth = 0) {
      if (depth > 2) return;
      let entries = [];
      try {
        entries = await readdir(current, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        const child = join(current, entry.name);
        if (entry.isDirectory()) {
          await walk(child, depth + 1);
        } else if (entry.isFile()) {
          files.push(relative(folder, child));
        }
      }
    }
    await walk(dir);
    resources[name] = files.slice(0, 80);
  }
  return resources;
}

function inferSourceType(skillPath, root) {
  const lowerPath = skillPath.toLowerCase();
  const lowerRoot = root.toLowerCase();
  if (lowerPath.includes(`${sep}.system${sep}`) || lowerRoot.endsWith(`${sep}.system`)) return "system";
  if (lowerPath.includes(`${sep}openai-primary-runtime${sep}`)) return "runtime";
  if (lowerPath.includes(`${sep}openai-curated${sep}`) && !lowerPath.includes(`${sep}openai-curated-remote${sep}`)) return "legacy-plugin-cache";
  if (lowerPath.includes(`${sep}plugins${sep}cache${sep}`)) return "plugin";
  if (lowerPath.includes(`${sep}.codex${sep}skills${sep}`)) return "user";
  return "external";
}

function inferNamespace(name, folder, root) {
  const safeName = String(name ?? "");
  if (safeName.includes(":")) return safeName.split(":")[0];

  const relativeFolder = relative(root, folder);
  const parts = relativeFolder.split(/[\\/]+/).filter(Boolean);
  if (parts.length > 2 && parts.includes("skills")) {
    const skillIndex = parts.lastIndexOf("skills");
    const beforeSkills = parts.slice(0, skillIndex);
    const maybeVersion = beforeSkills.at(-1) ?? "";
    if (/^\d+\.\d+/.test(maybeVersion) || /^\d{2}\.\d+/.test(maybeVersion) || /^[a-f0-9]{7,}$/i.test(maybeVersion)) {
      return beforeSkills.at(-2) || null;
    }
    return beforeSkills.at(-1) || null;
  }
  return null;
}

function inferDomains(text) {
  const haystack = normalizeSearchText(text);
  return DOMAIN_RULES
    .filter(([, terms]) => terms.some((term) => haystack.includes(term)))
    .map(([domain]) => domain);
}

function inferTools(text) {
  const haystack = normalizeSearchText(text);
  return TOOL_RULES
    .filter(([, terms]) => terms.some((term) => haystack.includes(normalizeSearchText(term))))
    .map(([tool]) => tool);
}

function extractTriggers({ name, description, headings, body }) {
  const phrases = new Set();
  for (const value of [name, description, ...headings.slice(0, 8)]) {
    const cleaned = String(value ?? "").trim();
    if (cleaned.length >= 3) phrases.add(cleaned);
  }

  for (const match of String(description ?? "").matchAll(/\b(?:use|when|for)\s+([^.;\n]{8,120})/gi)) {
    phrases.add(match[1].trim());
  }

  for (const line of String(body ?? "").split(/\r?\n/).slice(0, 80)) {
    const trimmed = line.trim();
    if (/^(use|when|for|typical tasks|examples?|triggers?)\b/i.test(trimmed)) {
      phrases.add(trimmed.replace(/^[-*]\s*/, "").slice(0, 140));
    }
  }

  return [...phrases].slice(0, 20);
}

function makeExcerpt(body) {
  return String(body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 360);
}

function buildSkillId(skillPath, name) {
  return `${slugify(name || "skill")}-${hashId(skillPath.toLowerCase())}`;
}

async function findSkillFiles(root, { maxDepth = 8 } = {}) {
  const files = [];
  const start = normalizePath(root);

  async function walk(current, depth) {
    if (depth > maxDepth) return;
    let entries = [];
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    if (entries.some((entry) => entry.isFile() && entry.name === "SKILL.md")) {
      files.push(join(current, "SKILL.md"));
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (["node_modules", ".git", "dist", "build", "__pycache__"].includes(entry.name)) continue;
      await walk(join(current, entry.name), depth + 1);
    }
  }

  await walk(start, 0);
  return files;
}

async function readSkillFile(skillPath, root) {
  const folder = dirname(skillPath);
  const content = await readFile(skillPath, "utf8");
  const { frontmatter, body, warnings } = parseFrontmatter(content);
  const ui = await readYamlFile(join(folder, "agents", "openai.yaml"));
  const resources = await listResourceFiles(folder, ["references", "reference", "scripts", "assets", "examples", "evaluations"]);
  const folderName = folder.split(/[\\/]+/).filter(Boolean).at(-1) ?? "skill";
  const name = String(frontmatter.name ?? folderName).trim() || folderName;
  const description = String(frontmatter.description ?? "").trim();
  const headings = extractHeadings(body);
  const references = extractReferences(body);
  const uiText = ui ? JSON.stringify(ui) : "";
  const combined = `${name}\n${description}\n${headings.join("\n")}\n${uiText}\n${body}`;
  const namespace = inferNamespace(name, folder, root);
  const domains = inferDomains(combined);
  const tools = inferTools(combined);
  const triggers = extractTriggers({ name, description, headings, body });

  if (!frontmatter.name) warnings.push("missing frontmatter name");
  if (!description) warnings.push("missing frontmatter description");

  return {
    id: buildSkillId(skillPath, name),
    name,
    description,
    path: skillPath,
    folder,
    root,
    sourceType: inferSourceType(skillPath, root),
    namespace,
    frontmatter,
    ui,
    headings,
    references,
    resources,
    domains,
    triggers,
    tools,
    contentHash: createHash("sha256").update(content).digest("hex"),
    excerpt: makeExcerpt(body),
    body,
    bodyLength: body.length,
    warnings,
    searchText: normalizeSearchText(`${name} ${description} ${headings.join(" ")} ${triggers.join(" ")} ${body}`)
  };
}

function createEdge(sourceId, targetId, type, label, weight, reason) {
  return { sourceId, targetId, type, label, weight, reason };
}

function buildEdges(skills) {
  const edges = [];
  const byNamespace = new Map();
  const byDomain = new Map();
  const byTool = new Map();
  const byName = new Map();

  function addTo(map, key, skill) {
    if (!key) return;
    const list = map.get(key) ?? [];
    list.push(skill);
    map.set(key, list);
  }

  for (const skill of skills) {
    addTo(byNamespace, skill.namespace, skill);
    addTo(byName, normalizeSearchText(skill.name), skill);
    for (const domain of skill.domains) addTo(byDomain, domain, skill);
    for (const tool of skill.tools) addTo(byTool, tool, skill);
  }

  for (const [name, group] of byName.entries()) {
    if (!name || group.length < 2) continue;
    for (const pair of neighborPairs(group, 30)) {
      edges.push(createEdge(pair[0].id, pair[1].id, "duplicates_name", name, 0.98, `Same skill name appears in multiple roots: ${name}.`));
    }
  }

  for (const [namespace, group] of byNamespace.entries()) {
    for (const pair of neighborPairs(group, 16)) {
      edges.push(createEdge(pair[0].id, pair[1].id, "same_namespace", namespace, 0.92, `Both skills share namespace ${namespace}.`));
    }
  }

  for (const [domain, group] of byDomain.entries()) {
    for (const pair of neighborPairs(group, 20)) {
      edges.push(createEdge(pair[0].id, pair[1].id, "shared_domain", domain, 0.72, `Heuristic: both skills mention ${domain} terms.`));
    }
  }

  for (const [tool, group] of byTool.entries()) {
    for (const pair of neighborPairs(group, 20)) {
      edges.push(createEdge(pair[0].id, pair[1].id, "shared_tool", tool, 0.78, `Heuristic: both skills reference ${tool}.`));
    }
  }

  for (const skill of skills) {
    for (const other of skills) {
      if (skill.id === other.id) continue;
      const otherName = normalizeSearchText(other.name);
      if (otherName.length < 5 || !skill.searchText.includes(otherName)) continue;
      edges.push(createEdge(skill.id, other.id, "mentions", "mentions", 0.65, `${skill.name} mentions ${other.name}.`));
    }
  }

  const seen = new Set();
  return edges
    .filter((edge) => {
      const key = [edge.sourceId, edge.targetId].sort().join("|") + `|${edge.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 2000);
}

function neighborPairs(group, limit) {
  return [...group]
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, limit)
    .flatMap((skill, index, list) => {
      const next = list[index + 1];
      return next ? [[skill, next]] : [];
    });
}

function rankSkill(skill, query) {
  const normalizedQuery = normalizeSearchText(query);
  const terms = tokenize(query);
  if (!normalizedQuery) return 0;

  const nameText = normalizeSearchText(skill.name);
  const descriptionText = normalizeSearchText(skill.description);
  const triggerText = normalizeSearchText(skill.triggers.join(" "));
  const domainText = normalizeSearchText(skill.domains.join(" "));
  const bodyText = skill.searchText;

  let score = 0;
  if (nameText === normalizedQuery) score += 150;
  if (nameText.includes(normalizedQuery)) score += 100;
  if (descriptionText.includes(normalizedQuery)) score += 70;
  if (triggerText.includes(normalizedQuery)) score += 55;
  if (domainText.includes(normalizedQuery)) score += 40;
  if (bodyText.includes(normalizedQuery)) score += 8;

  for (const term of terms) {
    if (nameText.includes(term)) score += 18;
    if (descriptionText.includes(term)) score += 12;
    if (triggerText.includes(term)) score += 10;
    if (domainText.includes(term)) score += 8;
    if (bodyText.includes(term)) score += 1;
  }

  const gatewayMatch = /^([a-z0-9]+(?:-[a-z0-9]+)*) use$/.exec(nameText);
  if (gatewayMatch && normalizedQuery.includes(gatewayMatch[1])) {
    score += normalizedQuery.includes(`use ${gatewayMatch[1]}`) ? 90 : 45;
  }

  if (nameText === "index" && !normalizedQuery.includes("index")) {
    score -= 80;
  }

  if (skill.sourceType === "user") score += 2;
  return score;
}

function getConceptNamedRole(rule, normalizedName) {
  const roleFields = [
    ["gateway", rule.gatewaySkillNames],
    ["primary", rule.primarySkillNames],
    ["verification", rule.verificationSkillNames],
    ["supporting", rule.supportingSkillNames]
  ];

  for (const [role, names] of roleFields) {
    if ((names ?? []).some((name) => normalizeSearchText(name) === normalizedName)) {
      return role;
    }
  }
  return null;
}

function overlap(left = [], right = []) {
  const rightSet = new Set(right.map((value) => normalizeSearchText(value)));
  return left.filter((value) => rightSet.has(normalizeSearchText(value)));
}

function makeConceptSkillRef(rule, skill) {
  const normalizedName = normalizeSearchText(skill.name);
  const namedRole = getConceptNamedRole(rule, normalizedName);
  const nameText = normalizeSearchText(skill.name);
  const descriptionText = normalizeSearchText(skill.description);
  const triggerText = normalizeSearchText((skill.triggers ?? []).join(" "));
  const domainText = normalizeSearchText((skill.domains ?? []).join(" "));
  const toolText = normalizeSearchText((skill.tools ?? []).join(" "));
  const bodyText = skill.searchText ?? "";
  const conceptPhraseText = `${rule.label} ${rule.description} ${(rule.triggers ?? []).join(" ")}`;
  const conceptTerms = tokenize(conceptPhraseText);
  const sharedDomains = overlap(skill.domains, rule.domains);
  const sharedTools = overlap(skill.tools, rule.tools);
  const reasons = [];

  let score = 0;
  if (namedRole) {
    score += {
      gateway: 260,
      primary: 240,
      verification: 220,
      supporting: 200
    }[namedRole];
    reasons.push(`Named ${namedRole} skill for this concept.`);
  }

  if (sharedDomains.length) {
    score += sharedDomains.length * 28;
    reasons.push(`Shares domain ${sharedDomains.slice(0, 2).join(", ")}.`);
  }

  if (sharedTools.length) {
    score += sharedTools.length * 22;
    reasons.push(`Shares tool ${sharedTools.slice(0, 2).join(", ")}.`);
  }

  for (const phrase of rule.triggers ?? []) {
    const normalizedPhrase = normalizeSearchText(phrase);
    if (!normalizedPhrase) continue;
    if (descriptionText.includes(normalizedPhrase)) score += 24;
    if (triggerText.includes(normalizedPhrase)) score += 22;
    if (bodyText.includes(normalizedPhrase)) score += 8;
  }

  for (const term of conceptTerms) {
    if (nameText.includes(term)) score += 14;
    if (descriptionText.includes(term)) score += 7;
    if (triggerText.includes(term)) score += 6;
    if (domainText.includes(term)) score += 5;
    if (toolText.includes(term)) score += 4;
    if (bodyText.includes(term)) score += 0.5;
  }

  if (nameText === "index" && !namedRole) score -= 60;

  const include = Boolean(namedRole) || score >= 46;
  if (!include) return null;

  const role = namedRole
    ?? (score >= 95 ? "supporting" : "reference");

  return {
    skillId: skill.id,
    name: skill.name,
    description: skill.description,
    path: skill.path,
    folder: skill.folder,
    root: skill.root,
    sourceType: skill.sourceType,
    namespace: skill.namespace,
    domains: skill.domains,
    tools: skill.tools,
    role,
    score: Number(score.toFixed(1)),
    reason: reasons[0] ?? "Matches concept trigger language."
  };
}

function compareConceptSkillRefs(left, right) {
  return (CONCEPT_ROLE_PRIORITY[right.role] ?? 0) - (CONCEPT_ROLE_PRIORITY[left.role] ?? 0)
    || right.score - left.score
    || (SOURCE_TYPE_PRIORITY[right.sourceType] ?? 0) - (SOURCE_TYPE_PRIORITY[left.sourceType] ?? 0)
    || left.name.localeCompare(right.name);
}

function dedupeConceptSkillRefs(refs) {
  const byName = new Map();
  for (const ref of refs) {
    const key = normalizeSearchText(ref.name);
    const existing = byName.get(key);
    if (!existing || compareConceptSkillRefs(ref, existing) < 0) {
      byName.set(key, ref);
    }
  }

  return [...byName.values()]
    .sort(compareConceptSkillRefs)
    .slice(0, 18);
}

function buildConceptEdges(concepts) {
  const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));
  const edges = [];

  for (const concept of concepts) {
    for (const targetId of concept.relatedConceptIds ?? []) {
      if (!conceptById.has(targetId)) continue;
      edges.push({
        sourceId: concept.id,
        targetId,
        type: "curated_concept_link",
        label: "curated",
        weight: 0.95,
        reason: `${concept.label} commonly feeds ${conceptById.get(targetId).label}.`
      });
    }
  }

  for (let leftIndex = 0; leftIndex < concepts.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < concepts.length; rightIndex += 1) {
      const left = concepts[leftIndex];
      const right = concepts[rightIndex];
      const sharedSkillIds = overlap(
        left.skillRefs.map((ref) => ref.skillId),
        right.skillRefs.map((ref) => ref.skillId)
      );
      const sharedDomains = overlap(left.domains, right.domains);
      const sharedTools = overlap(left.tools, right.tools);
      const weight = Math.min(0.9, (sharedSkillIds.length * 0.22) + (sharedDomains.length * 0.12) + (sharedTools.length * 0.1));

      if (weight < 0.28) continue;
      edges.push({
        sourceId: left.id,
        targetId: right.id,
        type: "shared_concept_evidence",
        label: sharedSkillIds.length ? "shared skills" : sharedTools.length ? "shared tools" : "shared domains",
        weight: Number(weight.toFixed(2)),
        reason: `Shared ${sharedSkillIds.length} skills, ${sharedDomains.length} domains, and ${sharedTools.length} tools.`
      });
    }
  }

  const seen = new Set();
  return edges
    .filter((edge) => {
      const key = [edge.sourceId, edge.targetId].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => right.weight - left.weight || left.sourceId.localeCompare(right.sourceId))
    .slice(0, 200);
}

function buildConceptMap(skills) {
  const concepts = CONCEPT_RULES.map((rule) => {
    const skillRefs = dedupeConceptSkillRefs(
      skills
        .map((skill) => makeConceptSkillRef(rule, skill))
        .filter(Boolean)
    );
    const domains = [...new Set([...(rule.domains ?? []), ...skillRefs.flatMap((ref) => ref.domains)])].sort();
    const tools = [...new Set([...(rule.tools ?? []), ...skillRefs.flatMap((ref) => ref.tools)])].sort();
    const roleCounts = skillRefs.reduce((counts, ref) => {
      counts[ref.role] = (counts[ref.role] ?? 0) + 1;
      return counts;
    }, {});

    return {
      id: rule.id,
      label: rule.label,
      description: rule.description,
      triggers: rule.triggers ?? [],
      domains,
      tools,
      skillRefs,
      roleCounts,
      skillCount: skillRefs.length,
      relatedConceptIds: rule.relatedConceptIds ?? [],
      searchText: normalizeSearchText([
        rule.label,
        rule.description,
        ...(rule.triggers ?? []),
        ...domains,
        ...tools,
        ...skillRefs.flatMap((ref) => [ref.name, ref.description, ref.reason])
      ].join(" "))
    };
  });

  return {
    concepts,
    conceptEdges: buildConceptEdges(concepts)
  };
}

function rankConcept(concept, query) {
  const normalizedQuery = normalizeSearchText(query);
  const terms = tokenize(query);
  if (!normalizedQuery) return 0;

  const labelText = normalizeSearchText(concept.label);
  const descriptionText = normalizeSearchText(concept.description);
  const triggerText = normalizeSearchText((concept.triggers ?? []).join(" "));
  const skillText = normalizeSearchText((concept.skillRefs ?? []).flatMap((ref) => [ref.name, ref.description]).join(" "));
  const domainToolText = normalizeSearchText([...(concept.domains ?? []), ...(concept.tools ?? [])].join(" "));

  let score = 0;
  if (labelText === normalizedQuery) score += 160;
  if (labelText.includes(normalizedQuery)) score += 120;
  if (descriptionText.includes(normalizedQuery)) score += 80;
  if (triggerText.includes(normalizedQuery)) score += 70;
  if (skillText.includes(normalizedQuery)) score += 34;
  if (concept.searchText.includes(normalizedQuery)) score += 12;

  for (const term of terms) {
    if (labelText.includes(term)) score += 22;
    if (descriptionText.includes(term)) score += 14;
    if (triggerText.includes(term)) score += 13;
    if (domainToolText.includes(term)) score += 10;
    if (skillText.includes(term)) score += 5;
    if (concept.searchText.includes(term)) score += 1;
  }

  return score;
}

function conceptMatchesFilters(concept, filters = {}) {
  const root = String(filters.root ?? "").trim();
  const domain = String(filters.domain ?? "").trim();
  const sourceType = String(filters.sourceType ?? "").trim();
  const namespace = String(filters.namespace ?? "").trim();
  if (!root && !domain && !sourceType && !namespace) return true;

  return (concept.skillRefs ?? []).some((ref) =>
    (!root || ref.root === root)
    && (!domain || ref.domains.includes(domain))
    && (!sourceType || ref.sourceType === sourceType)
    && (!namespace || ref.namespace === namespace)
  );
}

function serializeConceptSummary(concept) {
  return {
    id: concept.id,
    label: concept.label,
    description: concept.description,
    triggers: concept.triggers,
    domains: concept.domains,
    tools: concept.tools,
    roleCounts: concept.roleCounts,
    skillCount: concept.skillCount,
    skillRefs: concept.skillRefs.slice(0, 8)
  };
}

function searchConcepts(index, query, filters = {}) {
  return (index.concepts ?? [])
    .filter((concept) => conceptMatchesFilters(concept, filters))
    .map((concept) => ({ concept, score: query ? rankConcept(concept, query) : 1 }))
    .filter((entry) => !query || entry.score > 0)
    .sort((left, right) =>
      right.score - left.score
      || right.concept.skillCount - left.concept.skillCount
      || left.concept.label.localeCompare(right.concept.label)
    )
    .map(({ concept, score }) => ({ ...serializeConceptSummary(concept), score }))
    .slice(0, 50);
}

function getRelatedConcepts(index, conceptId) {
  const conceptById = new Map((index.concepts ?? []).map((concept) => [concept.id, concept]));
  return (index.conceptEdges ?? [])
    .filter((edge) => edge.sourceId === conceptId || edge.targetId === conceptId)
    .map((edge) => {
      const relatedId = edge.sourceId === conceptId ? edge.targetId : edge.sourceId;
      const concept = conceptById.get(relatedId);
      return concept ? { ...serializeConceptSummary(concept), edge } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.edge.weight - left.edge.weight || left.label.localeCompare(right.label))
    .slice(0, 12);
}

function serializeConceptDetail(index, conceptId) {
  const concept = (index.concepts ?? []).find((entry) => entry.id === conceptId);
  if (!concept) return null;
  return {
    ...serializeConceptSummary(concept),
    skillRefs: concept.skillRefs,
    relatedConcepts: getRelatedConcepts(index, conceptId)
  };
}

function searchSkills(index, query, filters = {}) {
  const root = String(filters.root ?? "").trim();
  const domain = String(filters.domain ?? "").trim();
  const sourceType = String(filters.sourceType ?? "").trim();
  const namespace = String(filters.namespace ?? "").trim();

  return index.skills
    .filter((skill) => !root || skill.root === root)
    .filter((skill) => !domain || skill.domains.includes(domain))
    .filter((skill) => !sourceType || skill.sourceType === sourceType)
    .filter((skill) => !namespace || skill.namespace === namespace)
    .map((skill) => ({ skill, score: query ? rankSkill(skill, query) : 1 }))
    .filter((entry) => !query || entry.score > 0)
    .sort((left, right) =>
      right.score - left.score
      || (SOURCE_TYPE_PRIORITY[right.skill.sourceType] ?? 0) - (SOURCE_TYPE_PRIORITY[left.skill.sourceType] ?? 0)
      || left.skill.name.localeCompare(right.skill.name)
    )
    .map(({ skill, score }) => ({ ...serializeSkillSummary(skill), score }))
    .slice(0, 80);
}

function recommendWorkflow(index, query, filters = {}) {
  const results = searchSkills(index, query, filters).slice(0, 8);
  const primary = results[0] ?? null;
  if (!primary) return { query, primary: null, supporting: [], steps: [] };

  const relatedIds = new Set(getRelatedSkills(index, primary.id).slice(0, 8).map((entry) => entry.id));
  const primaryName = normalizeSearchText(primary.name);
  const seenNames = new Set([primaryName]);
  const supporting = results
    .filter((entry) => entry.id !== primary.id)
    .filter((entry) => {
      const name = normalizeSearchText(entry.name);
      if (!name || seenNames.has(name)) return false;
      seenNames.add(name);
      return true;
    })
    .sort((left, right) => Number(relatedIds.has(right.id)) - Number(relatedIds.has(left.id)) || right.score - left.score)
    .slice(0, 4);

  return {
    query,
    primary,
    supporting,
    steps: [primary, ...supporting].map((skill, index) => ({
      order: index + 1,
      skillId: skill.id,
      name: skill.name,
      path: skill.path,
      reason: index === 0
        ? "Primary match for the task wording."
        : relatedIds.has(skill.id)
          ? "Supporting skill connected by the local relationship graph."
          : "Supporting skill from the ranked search results."
    }))
  };
}

function getRelatedSkills(index, skillId) {
  const skillById = new Map(index.skills.map((skill) => [skill.id, skill]));
  return index.edges
    .filter((edge) => edge.sourceId === skillId || edge.targetId === skillId)
    .map((edge) => {
      const relatedId = edge.sourceId === skillId ? edge.targetId : edge.sourceId;
      const skill = skillById.get(relatedId);
      return skill ? { ...serializeSkillSummary(skill), edge } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.edge.weight - left.edge.weight || left.name.localeCompare(right.name))
    .slice(0, 24);
}

function serializeSkillSummary(skill) {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    path: skill.path,
    folder: skill.folder,
    root: skill.root,
    sourceType: skill.sourceType,
    namespace: skill.namespace,
    domains: skill.domains,
    triggers: skill.triggers,
    tools: skill.tools,
    resources: skill.resources,
    ui: skill.ui ? {
      display_name: skill.ui.display_name ?? skill.ui.displayName ?? null,
      short_description: skill.ui.short_description ?? skill.ui.shortDescription ?? null,
      default_prompt: skill.ui.default_prompt ?? skill.ui.defaultPrompt ?? null
    } : null,
    contentHash: skill.contentHash,
    excerpt: skill.excerpt,
    bodyLength: skill.bodyLength,
    warnings: skill.warnings
  };
}

function serializeSkillDetail(index, skillId) {
  const skill = index.skills.find((entry) => entry.id === skillId);
  if (!skill) return null;
  return {
    ...serializeSkillSummary(skill),
    headings: skill.headings,
    references: skill.references,
    frontmatter: skill.frontmatter,
    body: skill.body,
    related: getRelatedSkills(index, skillId)
  };
}

function summarizeIndex(index) {
  const domains = [...new Set(index.skills.flatMap((skill) => skill.domains))].sort();
  const namespaces = [...new Set(index.skills.map((skill) => skill.namespace).filter(Boolean))].sort();
  const sourceTypes = [...new Set(index.skills.map((skill) => skill.sourceType))].sort();
  const warnings = index.skills.flatMap((skill) => skill.warnings.map((warning) => ({
    skillId: skill.id,
    name: skill.name,
    path: skill.path,
    warning
  })));

  return {
    scannedAt: index.scannedAt,
    roots: index.roots,
    skillCount: index.skills.length,
    edgeCount: index.edges.length,
    conceptCount: index.concepts?.length ?? 0,
    conceptEdgeCount: index.conceptEdges?.length ?? 0,
    domains,
    namespaces,
    sourceTypes,
    warningCount: warnings.length,
    warnings: warnings.slice(0, 80)
  };
}

async function scanSkillRoots(roots = getConfiguredSkillRoots()) {
  const normalizedRoots = roots
    .map((root) => normalizePath(root))
    .filter((root) => existsSync(root));
  const skillFilesByPath = new Map();

  for (const root of normalizedRoots) {
    const files = await findSkillFiles(root);
    for (const file of files) {
      const key = normalizePath(file).toLowerCase();
      if (!skillFilesByPath.has(key)) {
        skillFilesByPath.set(key, { file: normalizePath(file), root });
      }
    }
  }

  const skills = [];
  for (const { file, root } of skillFilesByPath.values()) {
    try {
      const fileStat = await stat(file);
      if (!fileStat.isFile()) continue;
      skills.push(await readSkillFile(file, root));
    } catch (error) {
      skills.push({
        id: buildSkillId(file, file),
        name: file.split(/[\\/]+/).at(-2) ?? "unreadable-skill",
        description: "",
        path: file,
        folder: dirname(file),
        root,
        sourceType: inferSourceType(file, root),
        namespace: null,
        headings: [],
        references: [],
        domains: [],
        triggers: [],
        tools: [],
        excerpt: "",
        body: "",
        bodyLength: 0,
        warnings: [`failed to read: ${error.message}`],
        searchText: ""
      });
    }
  }

  skills.sort((left, right) => left.name.localeCompare(right.name) || left.path.localeCompare(right.path));
  const edges = buildEdges(skills);
  const { concepts, conceptEdges } = buildConceptMap(skills);
  return {
    scannedAt: Date.now(),
    roots: normalizedRoots,
    skills,
    edges,
    concepts,
    conceptEdges
  };
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  const index = await scanSkillRoots();
  console.log(JSON.stringify(summarizeIndex(index), null, 2));
}

export {
  DEFAULT_SKILL_ROOTS,
  parseFrontmatter,
  extractHeadings,
  extractReferences,
  inferDomains,
  inferTools,
  rankSkill,
  buildConceptMap,
  searchConcepts,
  getRelatedConcepts,
  serializeConceptDetail,
  searchSkills,
  recommendWorkflow,
  getRelatedSkills,
  serializeSkillDetail,
  summarizeIndex,
  scanSkillRoots
};
