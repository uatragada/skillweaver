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

const SKILL_EDGE_LIMIT = 2000;
const CONCEPT_EDGE_LIMIT = 200;

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
    triggers: ["build a web app", "frontend app", "react ui", "implement a page", "fix ui", "mobile app", "desktop app", "react native", "flutter", "electron", "tauri", "app store", "native bridge", "winui"],
    domains: ["frontend", "product"],
    tools: ["Node", "Playwright", "Figma", "Vercel"],
    gatewaySkillNames: ["build-web-apps:frontend-app-builder", "frontend-app-builder"],
    primarySkillNames: ["dev-frontend-react-next", "build-web-apps:react-best-practices", "dev-mobile-desktop"],
    supportingSkillNames: ["build-web-apps:shadcn", "dev-frontend-accessibility-css", "premium-web-design", "design-qa", "winui-app", "launch-readiness", "dev-release-productization"],
    verificationSkillNames: ["build-web-apps:frontend-testing-debugging", "playwright", "playwright-interactive", "screenshot"],
    relatedConceptIds: ["figma-handoff", "browser-verification", "deployment-release"]
  },
  {
    id: "browser-verification",
    label: "Browser verification",
    description: "Exercise live browser behavior, inspect screenshots, and verify UI changes against the running app.",
    triggers: ["browser qa", "playwright screenshot", "verify live app", "control chrome", "in-app browser", "inspect page", "motion qa"],
    domains: ["frontend"],
    tools: ["Playwright", "Node"],
    gatewaySkillNames: ["browser:control-in-app-browser", "control-in-app-browser", "chrome:control-chrome", "control-chrome"],
    primarySkillNames: ["playwright", "playwright-interactive", "build-web-apps:frontend-testing-debugging", "frontend-testing-debugging"],
    supportingSkillNames: ["screenshot", "motion-qa"],
    verificationSkillNames: ["vercel:agent-browser-verify", "agent-browser-verify"],
    relatedConceptIds: ["frontend-implementation", "deployment-release"]
  },
  {
    id: "figma-handoff",
    label: "Figma design handoff",
    description: "Navigate Figma context, audit component intent, and translate designs into implementation work.",
    triggers: ["figma design", "design to code", "implement figma", "design handoff", "component audit", "swiftui", "figma swiftui motion"],
    domains: ["frontend", "product", "creative"],
    tools: ["Figma", "Node"],
    gatewaySkillNames: ["figma-use", "figma:figma-use"],
    primarySkillNames: ["figma-implement-design", "figma-generate-library", "figma:figma-code-connect", "figma-code-connect", "figma-code-connect-components", "product-design:image-to-code", "design-image-to-code", "design-url-to-code", "figma:figma-swiftui", "figma-swiftui"],
    supportingSkillNames: ["figma-design-qa", "figma-component-audit", "figma-create-design-system-rules", "product-design:get-context", "figma:figma-generate-design", "figma-generate-design", "figma:figma-implement-motion", "figma-implement-motion", "figma:figma-use-motion", "figma-use-motion"],
    verificationSkillNames: ["design-qa", "figma-design-review"],
    relatedConceptIds: ["frontend-implementation", "browser-verification"]
  },
  {
    id: "data-dashboarding",
    label: "Data dashboards and reports",
    description: "Profile data, design KPIs, build dashboards or reports, and validate analytical outputs.",
    triggers: ["analytics dashboard", "kpi report", "visualize data", "data quality", "business analysis", "metric diagnostics", "market sizing", "experiment design", "a/b test", "visualization accessibility"],
    domains: ["data", "product"],
    tools: ["Python", "Node"],
    gatewaySkillNames: ["data-analytics:index"],
    primarySkillNames: ["data-analytics:build-dashboard", "build-dashboard", "data-analytics:build-report", "build-report", "build-web-data-visualization:data-visualization", "data-visualization", "data-analytics:visualize-data", "visualize-data", "data-analytics:jupyter-notebooks", "jupyter-notebooks", "metric-diagnostics", "product-business-analysis", "spreadsheets:Spreadsheets", "Spreadsheets"],
    supportingSkillNames: ["data-analytics:design-kpis", "design-kpis", "kpi-reporting", "data-analysis-standard", "chart-data-extractor", "visualization-strategy-and-critique"],
    verificationSkillNames: ["data-analytics:validate-data", "data-analytics:analyze-data-quality", "testing-data-visualizations", "accessibility-and-inclusive-visualization"],
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
    supportingSkillNames: ["coderabbit:code-review", "code-review-checklist", "changelog-generator", "dev-git-github-collaboration", "dev-testing-qa"],
    verificationSkillNames: ["codex-security:security-diff-scan", "dev-testing-qa"],
    relatedConceptIds: ["repo-operations", "deployment-release", "security-review"]
  },
  {
    id: "security-review",
    label: "Security review",
    description: "Threat-model, scan, triage findings, and validate security-sensitive changes.",
    triggers: ["security scan", "threat model", "vulnerability", "audit finding", "risk review", "attack path", "exploit chain"],
    domains: ["security", "operations"],
    tools: ["GitHub"],
    primarySkillNames: ["codex-security:security-scan", "security-scan", "codex-security:deep-security-scan", "deep-security-scan", "codex-security:threat-model", "threat-model", "security-threat-model", "security-ownership-map", "security-best-practices"],
    supportingSkillNames: ["codex-security:attack-path-analysis", "attack-path-analysis", "codex-security:finding-discovery", "finding-discovery", "codex-security:triage-finding", "triage-finding", "codex-security:track-findings", "track-findings", "skill-security-auditor"],
    verificationSkillNames: ["codex-security:validation", "validation", "codex-security:security-diff-scan", "security-diff-scan"],
    relatedConceptIds: ["github-pr-repair", "repo-operations"]
  },
  {
    id: "deployment-release",
    label: "Deployment and release",
    description: "Prepare releases, deploy to hosting providers, repair deployment issues, and verify production surfaces.",
    triggers: ["deploy app", "release readiness", "vercel", "cloudflare", "netlify", "render", "branch preview", "dns cutover", "cron job", "scheduled workflow"],
    domains: ["operations", "frontend", "backend"],
    tools: ["Vercel", "Cloudflare", "GitHub", "Node"],
    primarySkillNames: ["vercel-deploy", "vercel:bootstrap", "vercel-api", "deployments-cicd", "cloudflare-deploy", "cloudflare:wrangler", "netlify-deploy", "render-deploy", "cron-jobs", "vercel-functions"],
    supportingSkillNames: ["launch-readiness", "dev-release-productization", "cicd-playbook", "monitoring-setup-guide", "env-vars", "vercel-queues", "workflow"],
    verificationSkillNames: ["vercel:agent-browser-verify", "agent-browser-verify", "browser-verification"],
    relatedConceptIds: ["frontend-implementation", "browser-verification", "github-pr-repair"]
  },
  {
    id: "skill-authoring",
    label: "Skill authoring",
    description: "Create, install, evaluate, and maintain Codex skills and plugin bundles.",
    triggers: ["create a skill", "codex skill", "frontmatter", "reference files", "example scripts", "install skill", "skill navigator", "skillweaver", "plugin creator", "skill routing", "command line tool", "cli"],
    domains: ["ai", "documents"],
    tools: ["OpenAI", "GitHub", "Node"],
    gatewaySkillNames: ["skillweaver"],
    primarySkillNames: ["skill-creator", "skill-installer", "plugin-creator", "cli-creator"],
    supportingSkillNames: ["template-creator:template-creator", "dev-documentation-systems", "dev-release-productization"],
    verificationSkillNames: ["skill-security-auditor"],
    relatedConceptIds: ["agent-llm-apps", "repo-operations"]
  },
  {
    id: "documents-pdf",
    label: "Documents and PDFs",
    description: "Read, transform, write, or validate PDF, document, LaTeX, and documentation artifacts.",
    triggers: ["pdf", "docx", "document pipeline", "latex", "latex compile", "latex bibliography", "bibtex", "tex errors", "technical publishing", "write docs", "api documentation"],
    domains: ["documents", "data"],
    tools: ["Python", "Node"],
    primarySkillNames: ["pdf", "pdf:pdf", "documents:documents", "documents", "api-docs-writer", "dev-documentation-systems", "latex-compile", "latex-doctor"],
    supportingSkillNames: ["latex:latex-compile", "latex:latex-doctor", "architecture-decision-record", "technical-spec-template"],
    verificationSkillNames: ["docbridge-full-stack-verification"],
    relatedConceptIds: ["presentations", "data-dashboarding"]
  },
  {
    id: "presentations",
    label: "Presentations",
    description: "Build slide decks, roadmap narratives, and presentation-ready documents.",
    triggers: ["presentation", "slides", "roadmap deck", "pitch deck", "board-ready deck", "slide template", "speaker narrative"],
    domains: ["documents", "product"],
    tools: ["Node"],
    primarySkillNames: ["presentations:Presentations", "Presentations", "roadmap-presentation"],
    supportingSkillNames: ["template-creator:template-creator", "template-creator", "roadmap-narrative", "linear", "documents:documents"],
    relatedConceptIds: ["documents-pdf", "product-planning"]
  },
  {
    id: "email-triage",
    label: "Email triage",
    description: "Search, triage, summarize, and act on Gmail threads or inbox state.",
    triggers: ["gmail", "inbox triage", "email", "draft reply"],
    domains: ["operations"],
    tools: ["Gmail"],
    primarySkillNames: ["gmail:gmail-inbox-triage", "gmail-inbox-triage", "gmail:gmail", "gmail", "email-triage"],
    relatedConceptIds: ["product-planning", "repo-operations"]
  },
  {
    id: "game-development",
    label: "Game development",
    description: "Build, test, and tune browser games, WebGL scenes, sprites, and playtest loops.",
    triggers: ["game", "phaser", "three.js", "webgl", "playtest", "sprite", "racingsim", "ppo", "stable-baselines3", "godot json bridge", "lap progress", "nurburgring", "checkpoint progress"],
    domains: ["frontend", "creative"],
    tools: ["Node", "Playwright"],
    primarySkillNames: ["game-studio:game-studio", "game-studio", "game-studio:phaser-2d-game", "phaser-2d-game", "game-studio:game-ui-frontend", "game-ui-frontend", "game-studio:sprite-pipeline", "sprite-pipeline", "game-studio:three-webgl-game", "three-webgl-game", "game-studio:web-game-foundations", "web-game-foundations", "game-studio:react-three-fiber-game", "react-three-fiber-game", "racingsim-ai-ml"],
    supportingSkillNames: ["game-studio:web-3d-asset-pipeline", "web-3d-asset-pipeline", "racingsim-game-dev", "project-derived-skills"],
    verificationSkillNames: ["game-studio:game-playtest", "game-playtest"],
    relatedConceptIds: ["frontend-implementation", "browser-verification"]
  },
  {
    id: "agent-llm-apps",
    label: "Agent and LLM apps",
    description: "Build OpenAI, agent SDK, RAG, ChatGPT app, and model-backed application workflows.",
    triggers: ["openai", "agent sdk", "llm app", "rag", "chatgpt app", "copilot", "mcp server", "node typescript mcp", "typed tool handlers", "speech-to-text", "text-to-speech", "transcription", "voiceover", "voice agent", "local speech", "browser microphone", "silence rejection", "whisper"],
    domains: ["ai", "backend", "frontend"],
    tools: ["OpenAI", "Cloudflare", "Vercel", "Node"],
    primarySkillNames: ["dev-ai-llm-apps", "openai-docs", "openai-agents-js", "chatgpt-apps", "copilot-sdk", "cloudflare:agents-sdk", "vercel:ai-sdk", "transcribe", "speech"],
    supportingSkillNames: ["dev-node-typescript-services", "api-docs-writer", "hugging-face:transformers-js", "transformers-js", "hugging-face:huggingface-gradio", "local-speech-ai-mvp"],
    relatedConceptIds: ["skill-authoring", "cloudflare-workers", "huggingface-ml"]
  },
  {
    id: "product-planning",
    label: "Product planning",
    description: "Turn goals, research, roadmaps, and issue trackers into actionable product or implementation plans.",
    triggers: ["prd", "roadmap", "linear", "user research", "feature priority", "launch checklist", "risk register", "notion", "workspace knowledge", "knowledge capture", "decision log", "meeting intelligence", "notion spec", "experiment design", "market sizing", "product business analysis"],
    domains: ["product", "documents"],
    tools: ["Linear"],
    primarySkillNames: ["linear", "linear:linear", "prd-template", "roadmap-narrative", "feature-prioritisation", "ux-research-plan", "user-research-synthesis", "risk-register", "notion-knowledge-capture", "notion-research-documentation", "notion-meeting-intelligence", "notion-spec-to-implementation", "experiment-designer", "product-business-analysis", "market-sizing"],
    supportingSkillNames: ["product-launch-checklist", "product-design:index", "onboarding-plan", "launch-readiness", "metric-diagnostics", "design-kpis"],
    relatedConceptIds: ["presentations", "data-dashboarding", "github-pr-repair"]
  },
  {
    id: "cloudflare-workers",
    label: "Cloudflare workers",
    description: "Build, configure, and deploy Cloudflare Workers, Durable Objects, MCP servers, and agent runtimes.",
    triggers: ["cloudflare workers", "wrangler", "durable object", "cloudflare mcp server", "mcp server on cloudflare", "cloudflare agent"],
    domains: ["operations", "backend", "ai"],
    tools: ["Cloudflare", "Node"],
    primarySkillNames: ["cloudflare:workers-best-practices", "workers-best-practices", "cloudflare:wrangler", "wrangler", "cloudflare:durable-objects", "durable-objects", "cloudflare:building-mcp-server-on-cloudflare", "building-mcp-server-on-cloudflare", "cloudflare:building-ai-agent-on-cloudflare", "building-ai-agent-on-cloudflare"],
    supportingSkillNames: ["cloudflare:cloudflare", "cloudflare", "cloudflare:web-perf", "web-perf", "cloudflare:sandbox-sdk", "sandbox-sdk"],
    relatedConceptIds: ["deployment-release", "agent-llm-apps"]
  },
  {
    id: "huggingface-ml",
    label: "Hugging Face ML",
    description: "Search, inspect, train, publish, and operate Hugging Face models, datasets, Spaces, and papers.",
    triggers: ["hugging face", "dataset", "model training", "gradio", "papers", "spaces"],
    domains: ["ai", "data"],
    tools: ["Python"],
    primarySkillNames: ["hugging-face:hf-cli", "hf-cli", "hugging-face:huggingface-datasets", "huggingface-datasets", "hugging-face:huggingface-llm-trainer", "huggingface-llm-trainer", "hugging-face:huggingface-vision-trainer", "huggingface-vision-trainer", "hugging-face:huggingface-papers", "huggingface-papers", "hugging-face:huggingface-gradio", "huggingface-gradio", "hugging-face:huggingface-trackio", "huggingface-trackio"],
    supportingSkillNames: ["hugging-face:huggingface-community-evals", "huggingface-community-evals", "hugging-face:huggingface-gradio", "huggingface-gradio", "hugging-face:huggingface-jobs", "huggingface-jobs", "hugging-face:transformers-js", "transformers-js"],
    relatedConceptIds: ["agent-llm-apps", "data-dashboarding"]
  },
  {
    id: "marketing-growth",
    label: "Marketing growth",
    description: "Plan, research, produce, and measure marketing, SEO, CRO, creative, and industry growth work.",
    triggers: ["marketing strategy", "seo", "cro", "creative ads", "growth report", "competitive intelligence", "technical seo", "organic growth", "ai search", "entity content", "ad concepts", "offer angles", "promo creative", "competitor positioning", "competitive intelligence monitor"],
    domains: ["creative", "data", "product"],
    tools: ["Node"],
    primarySkillNames: ["marketing-strategy-and-growth", "seo-and-organic-growth", "analytics-cro-and-reporting", "creative-production", "creative-offer", "creative-ads-explorer", "competitive-intelligence-monitor"],
    supportingSkillNames: ["competitive-intelligence-monitor", "business-strategy-and-research", "industry-playbooks", "creative-positioning", "kpi-reporting", "creative-shot"],
    relatedConceptIds: ["data-dashboarding", "product-planning"]
  },
  {
    id: "backend-services",
    label: "Backend APIs and services",
    description: "Design, implement, document, and verify backend APIs, service boundaries, and server runtimes.",
    triggers: ["backend api", "node service", "python service", "dotnet service", "api versioning", "server endpoint", "stripe billing", "webhook"],
    domains: ["backend", "operations", "documents"],
    tools: ["Node", "Python", "OpenAI"],
    primarySkillNames: ["dev-backend-api-design", "dev-node-typescript-services", "dev-python-services", "dev-java-dotnet-services", "aspnet-core", "stripe-best-practices", "auth"],
    supportingSkillNames: ["api-versioning-strategy", "api-docs-writer", "technical-spec-template", "system-design-interview", "monitoring-setup-guide"],
    verificationSkillNames: ["dev-testing-qa", "load-testing-plan", "monitoring-setup-guide"],
    relatedConceptIds: ["database-data-engineering", "observability-reliability", "repo-operations"]
  },
  {
    id: "database-data-engineering",
    label: "Databases and data engineering",
    description: "Design schemas, plan migrations, maintain Postgres, and build reliable data pipelines.",
    triggers: ["database schema", "postgres", "migration", "data pipeline", "etl", "warehouse"],
    domains: ["backend", "data", "operations"],
    tools: ["Python", "Node"],
    primarySkillNames: ["dev-database-postgres", "database-schema-design", "database-migration-plan", "dev-data-engineering", "data-pipeline-spec"],
    supportingSkillNames: ["data-quality-audit", "data-analysis-standard", "dev-python-services"],
    verificationSkillNames: ["data-analytics:validate-data", "validate-data", "dependency-audit"],
    relatedConceptIds: ["backend-services", "data-dashboarding", "observability-reliability"]
  },
  {
    id: "observability-reliability",
    label: "Observability and reliability",
    description: "Set up monitoring, SLOs, incident response, error budgets, performance checks, and recovery plans.",
    triggers: ["monitoring", "slo", "incident", "error budget", "sentry", "performance budget", "reliability", "opentelemetry", "otel", "tracing", "distributed tracing"],
    domains: ["operations", "backend", "security"],
    tools: ["GitHub", "Python", "Node"],
    primarySkillNames: ["dev-observability-sre", "monitoring-setup-guide", "slo-error-budget", "incident-postmortem", "sentry"],
    supportingSkillNames: ["performance-budget", "performance-review", "disaster-recovery-plan", "dev-performance-engineering"],
    verificationSkillNames: ["load-testing-plan", "launch-readiness"],
    relatedConceptIds: ["backend-services", "deployment-release", "infrastructure-platforms"]
  },
  {
    id: "infrastructure-platforms",
    label: "Infrastructure and platforms",
    description: "Review and implement infrastructure-as-code, containers, Kubernetes, cloud foundations, and platform operations.",
    triggers: ["terraform", "infrastructure as code", "kubernetes", "container", "cloud platform", "devops"],
    domains: ["operations", "backend", "security"],
    tools: ["Cloudflare", "GitHub", "Node"],
    primarySkillNames: ["dev-infra-terraform-cloud", "infra-as-code-review", "dev-containers-kubernetes", "dev-devops-ci-cd", "capacity-planning"],
    supportingSkillNames: ["cicd-playbook", "cloudflare:cloudflare", "cloudflare", "deployment-release", "dev-performance-engineering"],
    verificationSkillNames: ["security-best-practices", "codex-security:security-diff-scan", "security-diff-scan"],
    relatedConceptIds: ["cloudflare-workers", "deployment-release", "observability-reliability"]
  },
  {
    id: "repo-operations",
    label: "Repository operations",
    description: "Inspect repos, preserve worktree state, review dependencies, document architecture, and keep implementation changes scoped.",
    triggers: ["repo audit", "code review", "dependency audit", "technical debt", "architecture review", "monorepo", "dependency conflict", "code explanation", "explain code path"],
    domains: ["backend", "operations", "github", "security"],
    tools: ["GitHub", "Node", "Python"],
    primarySkillNames: ["conservative-repo-operations", "code-review-checklist", "dependency-audit", "dependency-conflict-resolver", "dev-architecture-review", "technical-debt-register", "code-explainer"],
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

const GENERIC_CONCEPT_TOOLS = new Set(["github", "node", "python"]);
const DATA_OUTPUT_TERMS = [
  "data",
  "analytics",
  "report",
  "reports",
  "dashboard",
  "chart",
  "charts",
  "kpi",
  "metric",
  "metrics",
  "visualization",
  "visualize"
];

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

const EDGE_TYPE_PRIORITY = {
  duplicates_name: 6,
  same_namespace: 5,
  shared_tool: 4,
  shared_domain: 3,
  mentions: 2
};

const CONCEPT_EDGE_TYPE_PRIORITY = {
  curated_concept_link: 3,
  shared_concept_evidence: 2
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

function compareEdges(left, right) {
  return right.weight - left.weight
    || (EDGE_TYPE_PRIORITY[right.type] ?? 0) - (EDGE_TYPE_PRIORITY[left.type] ?? 0)
    || left.sourceId.localeCompare(right.sourceId)
    || left.targetId.localeCompare(right.targetId)
    || left.type.localeCompare(right.type)
    || left.label.localeCompare(right.label);
}

function attachCapMetadata(items, kept, limit) {
  kept.candidateCount = items.length;
  kept.droppedCount = Math.max(0, items.length - kept.length);
  kept.droppedTypeCounts = countBy(items.slice(limit), (item) => item.type);
  return kept;
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
  const deduped = edges
    .filter((edge) => {
      const key = [edge.sourceId, edge.targetId].sort().join("|") + `|${edge.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareEdges);
  return attachCapMetadata(deduped, deduped.slice(0, SKILL_EDGE_LIMIT), SKILL_EDGE_LIMIT);
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

  if (nameText === "auth" && /\boauth\b|\bsession cookies?\b|\bprotected routes?\b|\bauth callbacks?\b/.test(normalizedQuery)) {
    score += 180;
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
  const sharedTools = overlap(skill.tools, rule.tools)
    .filter((tool) => !GENERIC_CONCEPT_TOOLS.has(normalizeSearchText(tool)));
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
      const sharedTools = overlap(left.tools, right.tools)
        .filter((tool) => !GENERIC_CONCEPT_TOOLS.has(normalizeSearchText(tool)));
      const weight = Math.min(0.9, (sharedSkillIds.length * 0.24) + (sharedDomains.length * 0.08) + (sharedTools.length * 0.08));

      if (weight < 0.34) continue;
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
  const deduped = edges
    .filter((edge) => {
      const key = [edge.sourceId, edge.targetId].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareConceptEdges);
  return attachCapMetadata(deduped, deduped.slice(0, CONCEPT_EDGE_LIMIT), CONCEPT_EDGE_LIMIT);
}

function compareConceptEdges(left, right) {
  return (CONCEPT_EDGE_TYPE_PRIORITY[right.type] ?? 0) - (CONCEPT_EDGE_TYPE_PRIORITY[left.type] ?? 0)
    || right.weight - left.weight
    || left.sourceId.localeCompare(right.sourceId)
    || left.targetId.localeCompare(right.targetId)
    || left.type.localeCompare(right.type);
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
  const explicitSkillText = normalizeSearchText((concept.skillRefs ?? [])
    .filter((ref) => ref.role !== "reference")
    .flatMap((ref) => [ref.name, ref.reason])
    .join(" "));
  const curatedTagText = normalizeSearchText([...(concept.domains ?? []), ...(concept.tools ?? [])]
    .filter((value) => !GENERIC_CONCEPT_TOOLS.has(normalizeSearchText(value)))
    .join(" "));

  let score = 0;
  if (labelText === normalizedQuery) score += 160;
  if (labelText.includes(normalizedQuery)) score += 120;
  if (descriptionText.includes(normalizedQuery)) score += 80;
  if (triggerText.includes(normalizedQuery)) score += 70;
  if (explicitSkillText.includes(normalizedQuery)) score += 28;
  if (concept.searchText.includes(normalizedQuery)) score += 5;

  for (const term of terms) {
    if (labelText.includes(term)) score += 22;
    if (descriptionText.includes(term)) score += 14;
    if (triggerText.includes(term)) score += 13;
    if (curatedTagText.includes(term)) score += 6;
    if (explicitSkillText.includes(term)) score += 4;
    if (concept.searchText.includes(term)) score += 0.25;
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

function dedupeSkillsByName(skills) {
  const byName = new Map();
  for (const skill of skills) {
    const key = normalizeSearchText(skill.name);
    const existing = byName.get(key);
    if (!existing || compareRankedSkillLike(skill, existing) < 0) {
      byName.set(key, skill);
    }
  }
  return [...byName.values()];
}

function compareRankedSkillLike(left, right) {
  return right.score - left.score
    || (SOURCE_TYPE_PRIORITY[right.sourceType] ?? 0) - (SOURCE_TYPE_PRIORITY[left.sourceType] ?? 0)
    || left.name.localeCompare(right.name);
}

function hasNegatedIntent(normalizedQuery, terms, windowSize = 8) {
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  const normalizedTerms = terms.map((term) => normalizeSearchText(term)).filter(Boolean);
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    let start = null;
    if (["no", "not", "without", "avoid"].includes(word)) start = index + 1;
    if (word === "instead" && words[index + 1] === "of") start = index + 2;
    if (word === "rather" && words[index + 1] === "than") start = index + 2;
    if (word === "do" && words[index + 1] === "not") start = index + 2;
    if ((word === "don" && words[index + 1] === "t") || word === "dont") start = index + 2;
    if (start === null) continue;
    const window = words.slice(start, start + windowSize).join(" ");
    if (normalizedTerms.some((term) => window.includes(term))) return true;
  }
  return false;
}

function scoreConceptsForWorkflow(index, query, rankedSkills) {
  const conceptSearchScores = new Map(searchConcepts(index, query).map((concept) => [concept.id, concept.score ?? 0]));

  return (index.concepts ?? [])
    .map((concept) => {
      let score = (conceptSearchScores.get(concept.id) ?? 0) * 2;

      for (const [rankIndex, skill] of rankedSkills.slice(0, 8).entries()) {
        const ref = concept.skillRefs.find((entry) =>
          entry.skillId === skill.id || normalizeSearchText(entry.name) === normalizeSearchText(skill.name)
        );
        if (!ref) continue;
        score += (260 / (rankIndex + 1)) + ((CONCEPT_ROLE_PRIORITY[ref.role] ?? 0) * 12);
      }

      return { ...concept, score };
    })
    .filter((concept) => concept.score > 0)
    .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label));
}

const ANCHOR_STOP_WORDS = new Set([
  "best",
  "code",
  "creator",
  "dev",
  "guide",
  "implementation",
  "practices",
  "service",
  "services",
  "skill",
  "skills",
  "the"
]);

function queryHasTokenLike(words, token) {
  return words.some((word) =>
    word === token
    || (word.length >= 4 && token.startsWith(word))
    || (token.length >= 4 && word.startsWith(token))
  );
}

function isHighConfidenceSkillAnchor(skill, normalizedQuery, score, rankIndex) {
  if (rankIndex > 7 || score < 110) return false;
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  const name = normalizeSearchText(skill.name);
  const tokens = name.split(/\s+/)
    .filter((token) => token.length >= 3 && !ANCHOR_STOP_WORDS.has(token));
  if (!tokens.length) return false;

  const matched = tokens.filter((token) => queryHasTokenLike(words, token)).length;
  if (tokens.length === 1) return matched === 1 && (score >= 150 || (rankIndex === 0 && score >= 120));
  if (matched === tokens.length) return true;
  return score >= 170 && matched >= Math.max(2, Math.ceil(tokens.length * 0.75));
}

function rankConceptWorkflowSkills(index, query, filters = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const skillById = new Map(index.skills.map((skill) => [skill.id, skill]));
  const skillRanked = index.skills
    .filter((skill) => !filters.root || skill.root === filters.root)
    .filter((skill) => !filters.domain || skill.domains.includes(filters.domain))
    .filter((skill) => !filters.sourceType || skill.sourceType === filters.sourceType)
    .filter((skill) => !filters.namespace || skill.namespace === filters.namespace)
    .map((skill) => ({ ...skill, score: query ? rankSkill(skill, query) : 1 }))
    .filter((skill) => !query || skill.score > 0)
    .sort(compareRankedSkillLike);
  const rankedByName = new Map(skillRanked.map((skill, index) => [normalizeSearchText(skill.name), { skill, index }]));
  const conceptResults = scoreConceptsForWorkflow(index, query, skillRanked).slice(0, 6);
  const suppressDataDashboardConcept = hasNegatedIntent(normalizedQuery, DATA_OUTPUT_TERMS);
  const conceptCandidates = [];

  for (const [conceptIndex, concept] of conceptResults.entries()) {
    for (const [refIndex, ref] of (concept.skillRefs ?? []).entries()) {
      if (filters.root && ref.root !== filters.root) continue;
      if (filters.domain && !ref.domains.includes(filters.domain)) continue;
      if (filters.sourceType && ref.sourceType !== filters.sourceType) continue;
      if (filters.namespace && ref.namespace !== filters.namespace) continue;

      const skill = skillById.get(ref.skillId) ?? {
        id: ref.skillId,
        name: ref.name,
        description: ref.description,
        path: ref.path,
        folder: ref.folder,
        root: ref.root,
        sourceType: ref.sourceType,
        namespace: ref.namespace,
        domains: ref.domains ?? [],
        triggers: [],
        tools: ref.tools ?? [],
        resources: {},
        excerpt: "",
        bodyLength: 0,
        warnings: [],
        searchText: ""
      };
      const rankedEntry = rankedByName.get(normalizeSearchText(skill.name));
      const queryScore = rankedEntry?.skill.score ?? rankSkill(skill, query);
      const intentBoost = getSkillIntentBoost(skill, ref, normalizedQuery);
      const conceptIntentPenalty = suppressDataDashboardConcept && concept.id === "data-dashboarding" ? 720 : 0;

      conceptCandidates.push({
        ...skill,
        score: (queryScore * 4)
          + (concept.score ?? 0)
          + ((CONCEPT_ROLE_PRIORITY[ref.role] ?? 0) * 18)
          + intentBoost
          + (rankedEntry ? Math.max(0, 80 - (rankedEntry.index * 8)) : 0)
          - conceptIntentPenalty
          - (conceptIndex * 8)
          - (refIndex * 0.25),
        conceptId: concept.id,
        conceptLabel: concept.label,
        conceptRole: ref.role,
        conceptReason: ref.reason
      });
    }
  }

  const workflowPrimaryKey = normalizeSearchText(skillRanked[0]?.name);
  const anchorCandidates = skillRanked
    .slice(0, 8)
    .filter((skill, index) => {
      const isWorkflowPrimary = workflowPrimaryKey && normalizeSearchText(skill.name) === workflowPrimaryKey;
      return isHighConfidenceSkillAnchor(skill, normalizedQuery, skill.score, isWorkflowPrimary ? 0 : index);
    })
    .map((skill, index) => ({
      ...skill,
      score: (skill.score * 6) + Math.max(0, 900 - (index * 35)),
      conceptId: null,
      conceptLabel: "Skill ranking anchor",
      conceptRole: "anchor",
      conceptReason: "Promoted because the query directly names this high-confidence skill or platform intent."
    }));

  const conceptRanked = dedupeSkillsByName([...anchorCandidates, ...conceptCandidates]).sort(compareRankedSkillLike);
  const seen = new Set(conceptRanked.map((skill) => normalizeSearchText(skill.name)));
  const fallback = skillRanked
    .filter((skill) => !seen.has(normalizeSearchText(skill.name)))
    .map((skill, index) => ({
      ...skill,
      score: (skill.score * 3) + Math.max(0, 40 - index),
      conceptId: null,
      conceptLabel: "Skill ranking fallback",
      conceptRole: "fallback",
      conceptReason: "Appended after concept-map candidates."
    }));

  return [...conceptRanked, ...fallback];
}

function getSkillIntentBoost(skill, ref, normalizedQuery) {
  const name = normalizeSearchText(skill.name);
  const role = ref.role;
  let boost = 0;
  const negatedDataOutputIntent = hasNegatedIntent(normalizedQuery, DATA_OUTPUT_TERMS);
  const dataOutputIntent = /\b(data|analytics|kpi|metrics?|charts?|visuali[sz]e|visualization|business intelligence|executive)\b/.test(normalizedQuery)
    && !negatedDataOutputIntent;
  const dataOutputSkill = ["build dashboard", "data visualization", "visualize data", "kpi reporting", "build report"]
    .some((term) => name.includes(term));
  const dataNamedSkill = /\b(data|dashboard|analytics|kpi|chart|report)\b/.test(name);
  const genericMcpServerIntent = (/\bmcp server\b|\btyped tools?\b|\btyped tool handlers?\b/.test(normalizedQuery))
    && /\bnode\b|\btypescript\b|\bjavascript\b|\bcodex\b|\bresources?\b|\bfixture tests?\b|\blocal client\b|\btyped tools?\b|\btyped tool handlers?\b/.test(normalizedQuery);
  const cloudflareRuntimeIntent = /\bcloudflare\b|\bworkers?\b|\bwrangler\b|\bdurable object\b/.test(normalizedQuery);
  const negatedCloudflareRuntimeIntent = hasNegatedIntent(normalizedQuery, ["cloudflare", "cloudflare worker", "cloudflare workers", "worker", "workers", "wrangler", "durable object"]);
  const chatgptAppIntent = /\bchatgpt app\b/.test(normalizedQuery);
  const negatedChatgptAppIntent = hasNegatedIntent(normalizedQuery, ["chatgpt app", "chatgpt"]);
  const inAppBrowserIntent = /\bin app browser\b|\bcontrol in app browser\b|\bbrowser plugin\b/.test(normalizedQuery);
  const negatedChromeIntent = hasNegatedIntent(normalizedQuery, ["chrome", "desktop chrome"]);
  const agentBrowserPreviewIntent = /\bagent browser verify\b|\bvercel agent browser\b|\bprotected preview\b|\bpreview deployment\b/.test(normalizedQuery)
    || (/\bvercel\b/.test(normalizedQuery) && /\bpreview\b|\bdeployment\b|\bprotected\b/.test(normalizedQuery) && /\bscreenshot|\bconsole errors?\b|\bcompare\b|\binspect\b/.test(normalizedQuery));
  const broadObservabilitySetupIntent = /\bopentelemetry\b|\botel\b|\bdistributed tracing\b|\btracing\b|\bslo\b|\berror budget\b|\bmonitoring dashboard\b|\balert rules?\b/.test(normalizedQuery);
  const proactiveObservabilityIntent = broadObservabilitySetupIntent
    && (/\binstrument\b|\btraces?\b|\bservice indicators?\b|\balerting\b/.test(normalizedQuery)
      || /\bbefore\b.*\bincident\b|\bbefore there is any incident\b|\bbefore any incident\b/.test(normalizedQuery));
  const incidentReviewIntent = /\bpostmortem\b|\bincident\b/.test(normalizedQuery) && !proactiveObservabilityIntent;
  const notebookAnalyticsIntent = /\bnotebooks?\b|\bjupyter\b|\breproducible\b|\baudit trail\b|\bsql\b.*\bpython\b|\bpython\b.*\bsql\b|\bexperiment readout\b/.test(normalizedQuery);
  const dataReportBuildIntent = /\bbuild\b|\bcreate\b|\bnarrative\b|\breport\b|\bproduct metrics?\b/.test(normalizedQuery)
    && /\bcharts?\b|\bvisuali[sz]ation\b|\balt text\b|\bcolor checks?\b|\bchart qa\b/.test(normalizedQuery);
  const codexSkillAuditIntent = /\bcodex skill\b|\bskill pack\b/.test(normalizedQuery)
    && /\baudit\b|\bunsafe instructions?\b|\bhidden tool use\b|\binstall risk\b|\bthird party\b|\bthird-party\b/.test(normalizedQuery);
  const codexSkillInstallIntent = /\bcodex skill\b|\bskill pack\b/.test(normalizedQuery)
    && /\binstall\b|\bgithub\b|\blocal(?:ly)?\b/.test(normalizedQuery)
    && !/\binstall risk\b|\bwhether to install\b|\bdeciding whether to install\b/.test(normalizedQuery);
  const codexSkillAuthoringIntent = /\bcodex skill\b|\bfrontmatter\b|\breference files?\b|\bexample scripts?\b|\bvalidation notes?\b|\bsafe tool\b/.test(normalizedQuery)
    && /\bcreate\b|\bturn\b|\bauthor\b|\bshare\b|\breusable\b/.test(normalizedQuery)
    && !codexSkillAuditIntent
    && !codexSkillInstallIntent
    && !hasNegatedIntent(normalizedQuery, ["author a new skill", "create a skill", "create a new skill"]);
  const roadmapDeckIntent = /\bdeck\b|\bslides?\b|\bpresentation\b|\bspeaker narrative\b|\bslide template\b|\bboard ready\b/.test(normalizedQuery)
    && /\broadmap\b|\blinear\b|\bmilestones?\b|\bresearch notes?\b/.test(normalizedQuery);
  const securityFindingTriageIntent = (/\bcodeql\b|\bdependency alerts?\b|\bpull request\b|\bpr\b/.test(normalizedQuery)
      && /\bfindings?\b|\bfalse positives?\b|\bexploitable\b|\bremediation owners?\b|\bvalidation steps?\b/.test(normalizedQuery))
    || /\bsecurity findings?\b.*\btriage\b|\btriage\b.*\bsecurity findings?\b/.test(normalizedQuery);
  const securityDiffScanIntent = /\bsecurity diff scan\b|\bdiff scan\b/.test(normalizedQuery);
  const securityOwnershipMapIntent = /\bsecurity ownership map\b|\bownership map\b|\borphaned sensitive code\b|\bbus[- ]factor\b|\bsensitive code\b.*\bowners?\b/.test(normalizedQuery);
  const gameUiIntent = /\bmenu\b|\bcontroller\b|\bkeyboard\b|\bstates?\b|\bui layer\b|\bhud layer\b/.test(normalizedQuery)
    && /\bgame\b|\bphaser\b|\bprototype\b|\bhud\b/.test(normalizedQuery);
  const phaserPrototypePlanningIntent = /\bplan\b/.test(normalizedQuery)
    && /\bphaser\b/.test(normalizedQuery)
    && /\bprototype\b|\bbrowser game\b/.test(normalizedQuery)
    && /\bplaytest loop\b/.test(normalizedQuery)
    && !/\bcontroller\b|\bkeyboard\b|\bhud layer\b|\bui layer\b/.test(normalizedQuery);
  const openAiAgentsJsIntent = /\bopenai agents js\b|\bagents js\b|\btool approvals?\b|\btyped handoffs?\b/.test(normalizedQuery);

  if (/\bdashboard\b/.test(normalizedQuery) && dataOutputIntent) {
    if (name.includes("build dashboard")) boost += 520;
    if (["data visualization", "visualize data", "kpi reporting"].some((term) => name.includes(term))) boost += 260;
    if (name.includes("analyze data quality") && !/\b(audit|quality|missing|suspicious)\b/.test(normalizedQuery)) boost -= 360;
  } else if (/\bfrontend dashboard\b|\breact dashboard\b|\bpolished frontend dashboard\b/.test(normalizedQuery)) {
    if (name.includes("frontend app builder")) boost += 560;
    if (name.includes("frontend testing debugging")) boost += /\bbrowser qa\b|\bverify\b|\btesting\b/.test(normalizedQuery) ? 160 : 80;
  } else if (negatedDataOutputIntent && (dataOutputSkill || dataNamedSkill)) {
    boost -= 520;
  }

  if (negatedDataOutputIntent && /\breact\b|\bui\b|\bfrontend\b/.test(normalizedQuery)) {
    if (["frontend app builder", "dev frontend react next"].some((term) => name.includes(term))) boost += 520;
  }

  if ((/\breport\b|\bcharts?\b|\bmethodology\b/.test(normalizedQuery)) && dataOutputIntent) {
    if (["build report", "kpi reporting", "visualize data", "data visualization"].some((term) => name.includes(term))) boost += 220;
  }

  if (notebookAnalyticsIntent) {
    if (name.includes("jupyter notebooks")) boost += 1900;
    if (["data analysis standard", "validate data", "build report"].some((term) => name.includes(term))) boost += 420;
    if (["build dashboard", "spreadsheets"].some((term) => name.includes(term))) boost -= 820;
  }

  if (genericMcpServerIntent
    && (!cloudflareRuntimeIntent || negatedCloudflareRuntimeIntent)
    && (!chatgptAppIntent || negatedChatgptAppIntent)) {
    if (name.includes("dev ai llm apps")) boost += 1800;
    if (["dev node typescript services", "api docs writer"].some((term) => name.includes(term))) boost += 620;
    if (["building mcp server on cloudflare", "workers best practices", "wrangler", "chatgpt apps"].some((term) => name.includes(term))) boost -= 1400;
  }

  if (inAppBrowserIntent || negatedChromeIntent) {
    if (name.includes("control in app browser")) boost += 980;
    if (/\binspect\b|\binteractions?\b|\bcontrol\b|\bscreenshot\b/.test(normalizedQuery) && name.includes("playwright interactive")) boost += 220;
    if (["control chrome", "agent browser verify", "design url to code"].some((term) => name.includes(term))) boost -= negatedChromeIntent ? 760 : 240;
  }

  if (agentBrowserPreviewIntent) {
    if (name.includes("agent browser verify")) boost += 1900;
    if (name.includes("agent browser") && !name.includes("verify")) boost += 520;
    if (["control in app browser", "control chrome", "playwright interactive"].some((term) => name.includes(term))) boost -= 720;
  }

  if (/\bchrome\b/.test(normalizedQuery) && !negatedChromeIntent) {
    if (name.includes("control chrome")) boost += 420;
    if (name.includes("control in app browser")) boost -= 160;
    if (/\binspect\b|\binteractions?\b|\bcontrol\b/.test(normalizedQuery) && name.includes("playwright interactive")) boost += 260;
  }

  const negatedSecurityScanIntent = hasNegatedIntent(normalizedQuery, ["security scan", "scan", "vulnerability", "vulnerabilities"]);
  const threatModelIntent = /\bthreat model\b/.test(normalizedQuery);
  if (threatModelIntent) {
    if (name.includes("threat model")) boost += 420;
    if (negatedSecurityScanIntent && ["security scan", "deep security scan"].some((term) => name.includes(term))) boost -= 420;
  }

  if ((/\bsecurity scan\b|\bvulnerab|\bscan\b/.test(normalizedQuery)) && !negatedSecurityScanIntent) {
    if (["security scan", "deep security scan"].some((term) => name.includes(term))) boost += 460;
    if (name.includes("security threat model") && !/\bthreat model\b/.test(normalizedQuery)) boost -= 240;
  }

  if (/\battack paths?\b|\bexploit chains?\b/.test(normalizedQuery)) {
    const attackPathPrimaryIntent = /\bexploit chains?\b|\banalyze\b|\banalyse\b/.test(normalizedQuery)
      && !/\bvulnerab|\bsecurity scan\b|\brepo for security\b/.test(normalizedQuery);
    if (name.includes("attack path analysis")) boost += attackPathPrimaryIntent ? 520 : 120;
    if (name.includes("security threat model")) boost -= 240;
  }

  if (/\btests?\b|\bqa\b|\bverify\b|\bverification\b/.test(normalizedQuery)) {
    if (["dev testing qa", "game playtest", "playwright", "frontend testing debugging"].some((term) => name.includes(term))) boost += 150;
  }

  if (/\baccessibility\b|\bmotion\b|\bdesign qa\b|\bdesign audit\b/.test(normalizedQuery)) {
    if (name.includes("design audit")) boost += 360;
    if (name.includes("dev frontend accessibility css")) boost += 340;
    if (name.includes("motion qa")) boost += 520;
    if (name.includes("design system audit") && !/\bdesign system\b/.test(normalizedQuery)) boost -= 220;
  }

  if (/\bvisualization accessibility\b|\bchart\b.*\b(accessibility|contrast|alt text|keyboard)\b|\bdata visualization\b.*\b(accessibility|contrast|alt text|keyboard)\b|\balt text\b|\bcolor checks?\b|\bchart qa\b/.test(normalizedQuery)) {
    if (name.includes("accessibility and inclusive visualization")) boost += dataReportBuildIntent ? 540 : 1560;
    if (["testing data visualizations", "visualization strategy and critique"].some((term) => name.includes(term))) boost += 520;
    if (dataReportBuildIntent && name.includes("testing data visualizations")) boost -= 260;
    if (["data visualization", "visualize data", "build report"].some((term) => name.includes(term))) boost += dataReportBuildIntent ? 1080 : 520;
    if (name.includes("figma implement motion")) boost -= 520;
    if (name.includes("dev frontend accessibility css")) boost += dataReportBuildIntent ? -260 : 160;
  }

  if (broadObservabilitySetupIntent) {
    if (name.includes("dev observability sre")) boost += proactiveObservabilityIntent ? 2200 : incidentReviewIntent ? 260 : 1560;
    if (["monitoring setup guide", "slo error budget"].some((term) => name.includes(term))) boost += incidentReviewIntent ? 120 : 520;
    if (name === "sentry" && !incidentReviewIntent) boost -= /\bsentry\b/.test(normalizedQuery) ? 480 : 720;
    if (name.includes("incident postmortem") && !incidentReviewIntent) boost -= proactiveObservabilityIntent ? 1400 : 280;
  }

  if (/\bmonitoring\b|\boperational\b|\breadiness\b|\bslo\b|\botel\b|\bopentelemetry\b|\btracing\b/.test(normalizedQuery)) {
    if (["monitoring setup guide", "dev observability sre", "slo error budget"].some((term) => name.includes(term))) boost += 180;
  }

  if (/\bsentry\b/.test(normalizedQuery)) {
    if (name === "sentry") boost += 860;
    if (incidentReviewIntent && name.includes("incident postmortem")) boost += 1080;
    if (["monitoring setup guide", "dev observability sre"].some((term) => name.includes(term))) boost += 260;
    if (name.includes("slo error budget") && !/\bslo\b|\berror budget\b/.test(normalizedQuery)) boost -= 180;
    if (name.includes("huggingface")) boost -= 520;
  }

  const spritePipelineIntent = /\bsprites?\b|\bsprite sheet\b|\bhud\b|\btilemap\b|\basset pipeline\b/.test(normalizedQuery)
    && /\bgame\b|\bphaser\b|\bhud\b|\btilemap\b|\bplaytest\b|\bsprites?\b/.test(normalizedQuery);
  if (spritePipelineIntent) {
    if (name.includes("sprite pipeline")) boost += gameUiIntent ? 260 : 1540;
    if (/\bphaser\b/.test(normalizedQuery) && name.includes("phaser 2d game")) boost += 620;
    if (/\bhud\b|\bui\b/.test(normalizedQuery) && name.includes("game ui frontend")) boost += gameUiIntent ? 1900 : 720;
    if (/\bplaytest\b|\bchecks?\b|\bverify\b/.test(normalizedQuery) && name.includes("game playtest")) boost += 260;
    if (name.includes("web game foundations")) boost += 180;
    if (!/\b3d\b|\bwebgl\b|\bthree\b|\breact three fiber\b|\br3f\b/.test(normalizedQuery)) {
      if (["web 3d asset pipeline", "three webgl game", "react three fiber game"].some((term) => name.includes(term))) boost -= 780;
    }
  }

  if (/\bcanvas\b|\bwebgl\b|\basset\b|\brender/.test(normalizedQuery)) {
    if (["game playtest", "web 3d asset pipeline", "three webgl game"].some((term) => name.includes(term))) boost += 220;
    if (/\bgame\b|\bscene\b/.test(normalizedQuery) && name.includes("web 3d asset pipeline")) boost += 260;
    if (/\bgame\b|\bscene\b/.test(normalizedQuery) && name.includes("data visualization")) boost -= 220;
  }

  if (/\breact three fiber\b|\br3f\b/.test(normalizedQuery)) {
    if (name.includes("react three fiber game")) boost += 1240;
    if (name.includes("three webgl game")) boost += 180;
    if (name.includes("threejs data visualization")) boost -= 420;
  }

  if (/\b(game prototype|prototype a game|full web game|game mechanics|playtest loop)\b/.test(normalizedQuery)) {
    if (name === "game-studio" || name.includes("game studio")) boost += 980;
    if (["web game foundations", "game ui frontend", "game playtest", "sprite pipeline"].some((term) => name.includes(term))) boost += 420;
  }

  if (phaserPrototypePlanningIntent) {
    if (name.includes("phaser 2d game")) boost += 1800;
    if (name === "game-studio" || name.includes("game studio")) boost += 1480;
    if (["game ui frontend", "game playtest"].some((term) => name.includes(term))) boost += 360;
    if (name.includes("sprite pipeline")) boost -= 620;
  }

  if (gameUiIntent) {
    if (name.includes("game ui frontend")) boost += 1080;
    if (["phaser 2d game", "game playtest"].some((term) => name.includes(term))) boost += 320;
    if (["three webgl game", "react three fiber game", "web 3d asset pipeline"].some((term) => name.includes(term))) boost -= 760;
  }

  if (/\bkubernetes\b|\bcontainer\b|\bdevops\b/.test(normalizedQuery)) {
    if (["dev containers kubernetes", "dev devops ci cd", "monitoring setup guide"].some((term) => name.includes(term))) boost += 100;
    if (name.includes("capacity planning") && !/\bcapacity\b|\bload\b|\bscale\b|\bforecast\b/.test(normalizedQuery)) boost -= 220;
  }

  if (/\bcapacity\b|\bscal(?:e|ing)\b|\btraffic spike\b|\bforecast\b/.test(normalizedQuery)) {
    if (name.includes("capacity planning")) boost += 620;
    if (["dev performance engineering", "dev containers kubernetes"].some((term) => name.includes(term))) boost += 420;
    if (name.includes("gantt chart")) boost -= 260;
  }

  const emailInboxIntent = /\bgmail\b|\binbox\b|\bemail\b|\bdraft repl|\bthread\b/.test(normalizedQuery);
  const negatedEmailInboxIntent = hasNegatedIntent(normalizedQuery, ["gmail", "inbox", "email", "triage email", "triage"]);
  if (emailInboxIntent && !negatedEmailInboxIntent) {
    if (name.includes("gmail inbox triage")) boost += 1500;
    if (name === "gmail" || name.includes("gmail:gmail")) boost += 920;
    if (name.includes("email triage")) boost += 700;
    if (/\bnotion\b|\blinked notes?\b|\bcompany context\b/.test(normalizedQuery)) {
      if (name.includes("notion knowledge capture")) boost += 420;
      if (name.includes("notion research documentation")) boost += 180;
      if (name.includes("notion meeting intelligence")) boost -= 120;
    }
  }

  if (negatedEmailInboxIntent && ["gmail inbox triage", "gmail", "email triage"].some((term) => name === term || name.includes(term))) {
    boost -= 1100;
  }

  if (/\bnotion\b|\bworkspace knowledge\b|\bknowledge base\b|\bdecision log\b/.test(normalizedQuery)) {
    if (/\bmeeting\b|\bmeeting notes?\b|\bagenda\b|\bpre reads?\b/.test(normalizedQuery) && name.includes("notion meeting intelligence")) boost += 960;
    if (/\bcapture\b|\bdecision\b|\bknowledge base\b/.test(normalizedQuery) && name.includes("notion knowledge capture")) boost += 420;
    if (/\bspec\b|\bimplementation\b|\bfollow up\b|\btasks?\b/.test(normalizedQuery) && name.includes("notion spec to implementation")) boost += 260;
    if (/\bresearch\b|\bsource links?\b|\bsynthesize\b/.test(normalizedQuery) && name.includes("notion research documentation")) boost += 220;
    if (/\bmeeting\b|\bagenda\b|\bpre reads?\b/.test(normalizedQuery) && name.includes("notion meeting intelligence")) boost += 220;
  }

  if (/\blatex\b|\btex\b|\bbibtex\b|\bbibliography\b/.test(normalizedQuery)) {
    if (/\bcompile\b|\bbuild\b/.test(normalizedQuery) && name.includes("latex compile")) boost += 340;
    if (/\bdebug\b|\berrors?\b|\bmissing\b|\bpackage\b|\bdoctor\b/.test(normalizedQuery) && name.includes("latex doctor")) boost += 380;
  }

  if (/\bmobile\b|\bdesktop\b|\breact native\b|\bflutter\b|\belectron\b|\btauri\b|\bwinui\b|\bapp store\b|\bpackaging\b|\bnative bridge\b/.test(normalizedQuery)) {
    if (name.includes("dev mobile desktop")) boost += 460;
    if (name.includes("winui app")) boost += /\bwinui\b/.test(normalizedQuery) ? 220 : 120;
    if (/\bapp store\b|\breadiness\b|\bpackaging\b|\brelease\b/.test(normalizedQuery)
      && ["launch readiness", "dev release productization"].some((term) => name.includes(term))) boost += 360;
  }

  if (/\bspeech\b|\baudio\b|\btranscrib|\btext to speech\b|\bspeech to text\b|\btts\b|\bvoice\b|\bvoiceover\b|\bwhisper\b|\bmicrophone\b|\bsilence\b/.test(normalizedQuery)) {
    if (/\bspeech to text\b|\btranscrib|\bwhisper\b|\baudio\b|\bmicrophone\b/.test(normalizedQuery) && name.includes("transcribe")) boost += 520;
    if (/\btext to speech\b|\btts\b|\bvoice\b|\bvoiceover\b|\bspeech\b/.test(normalizedQuery) && name === "speech") boost += 260;
    if (/\blocal\b|\bbrowser\b|\bmicrophone\b|\bsilence\b/.test(normalizedQuery) && name.includes("transformers js")) boost += 260;
  }

  if (/\bracingsim\b|\bppo\b|\bstable baselines3\b|\bgodot json bridge\b|\blap progress\b|\bnurburgring\b|\bcheckpoint progress\b/.test(normalizedQuery)) {
    if (name.includes("racingsim ai ml")) boost += 560;
    if (name.includes("racingsim game dev")) boost += 260;
    if (name.includes("huggingface")) boost -= 90;
  }

  if (/\bcompetitive intelligence\b|\bcompetitor positioning\b|\bcompetitor\b/.test(normalizedQuery)) {
    if (name.includes("competitive intelligence monitor")) boost += 420;
  }

  if (/\bcodex plugin\b|\bplugin\b.*\bskills?\b|\bmcp tools?\b/.test(normalizedQuery)) {
    if (name.includes("plugin creator")) boost += 1240;
    if (["skill security auditor", "dev documentation systems"].some((term) => name.includes(term))) boost += 640;
    if (["openai docs", "chatgpt apps", "copilot sdk", "openai agents js", "migrate to codex"].some((term) => name.includes(term))) boost -= 240;
  }

  if (/\bcommand line\b|\bcli\b|\barguments?\b|\bhelp text\b/.test(normalizedQuery)) {
    if (name.includes("cli creator")) boost += 1280;
    if (name.includes("dev release productization")) boost += 420;
    if (["dev mobile desktop", "figma", "design image to code", "design url to code"].some((term) => name.includes(term))) boost -= 260;
  }

  if (/\bconsole errors?\b|\bresponsive\b|\bui regression\b|\bdebug\b/.test(normalizedQuery)) {
    if (["playwright", "playwright interactive", "frontend testing debugging"].some((term) => name.includes(term))) boost += 140;
  }

  if (codexSkillAuthoringIntent) {
    if (name.includes("skill creator")) boost += 2200;
    if (["dev documentation systems", "skill security auditor"].some((term) => name.includes(term))) boost += 520;
    if (name.includes("skillweaver")) boost += 240;
    if (["plugin creator", "cli creator", "chatgpt apps"].some((term) => name.includes(term))) boost -= 980;
  }

  if (codexSkillAuditIntent) {
    if (name.includes("skill security auditor")) boost += codexSkillInstallIntent ? 620 : 2200;
    if (name.includes("skill installer")) boost += 520;
    if (name.includes("skillweaver")) boost += 280;
    if (["skill creator", "plugin creator", "cli creator"].some((term) => name.includes(term))) boost -= 980;
  }

  if (codexSkillInstallIntent) {
    if (name.includes("skill installer")) boost += 2200;
    if (name.includes("skill security auditor")) boost += 620;
    if (name.includes("skillweaver")) boost += 240;
    if (["plugin creator", "cli creator"].some((term) => name.includes(term))) boost -= 980;
    if (name.includes("skill creator")) boost -= 360;
  }

  if (/\bskillweaver\b|\bskill routing\b|\brouting review\b|\brouting benchmark\b/.test(normalizedQuery)) {
    if (name.includes("skillweaver")) boost += codexSkillAuthoringIntent ? 360 : 1800;
    if (name.includes("code review checklist")) boost += 980;
    if (name.includes("dev performance engineering")) boost += 860;
    if (["performance review", "build dashboard", "sentry", "launch readiness", "performance budget"].some((term) => name.includes(term))) boost -= 620;
    if (name.includes("racingsim")) boost -= 900;
  }

  if (/\bgithub actions?\b|\bci\b|\bpull request\b|\bpr\b|\bbranch\b|\breview comments?\b/.test(normalizedQuery)) {
    if (name.includes("gh address comments")) boost += /\bcomments?\b/.test(normalizedQuery) ? 280 : 120;
    if (name.includes("gh fix ci")) boost += /\bci\b|\bgithub actions?\b/.test(normalizedQuery) ? 280 : 140;
    if (/\btests?\b|\bci\b|\bgithub actions?\b/.test(normalizedQuery) && name.includes("dev testing qa")) boost += 180;
  }

  if (/\bchangelog\b|\brelease notes?\b/.test(normalizedQuery)) {
    if (name.includes("changelog generator")) boost += 520;
    if (name.includes("dev release productization")) boost += 260;
  }

  if (/\bfigma\b/.test(normalizedQuery)) {
    const figmaGatewayIntent = /\buse figma\b|\binspect\b|\bfigma context\b|\bhandoff\b/.test(normalizedQuery);
    const figmaSwiftUiIntent = /\bswiftui\b|\bswift ui\b|\bios\b/.test(normalizedQuery);
    const figmaMotionIntent = /\bmotion\b|\banimation\b|\bprototype\b/.test(normalizedQuery);
    const negatedReactIntent = hasNegatedIntent(normalizedQuery, ["react", "react code"]);
    const figmaImplementationIntent = /\bimplement\b|\breact\b|\bcode\b/.test(normalizedQuery);
    const figmaCodeConnectIntent = /\bcode connect\b|\bcode-connect\b|\bmappings?\b|\bvariant props?\b|\bexisting react components?\b/.test(normalizedQuery);
    if (figmaCodeConnectIntent) {
      if (name.includes("figma code connect")) boost += 1900;
      if (name.includes("figma component audit")) boost += 360;
      if (name.includes("dev frontend react next")) boost += 260;
      if (["figma implement design", "figma generate design", "figma generate library"].some((term) => name.includes(term))) boost -= 980;
    }
    if (figmaSwiftUiIntent) {
      if (name.includes("figma swiftui")) boost += 1800;
      if (figmaMotionIntent && ["figma implement motion", "figma use motion"].some((term) => name.includes(term))) boost += 720;
      if (name.includes("figma use")) boost += figmaGatewayIntent ? 260 : 80;
      if (["dev frontend react next", "figma implement design", "figma code connect"].some((term) => name.includes(term))) boost -= negatedReactIntent ? 820 : 220;
    }
    if (name.includes("figma use")) boost += figmaGatewayIntent ? 860 : 180;
    if (figmaImplementationIntent) {
      if (name.includes("figma implement design")) boost += figmaCodeConnectIntent ? 0 : figmaGatewayIntent ? 120 : 900;
      if (name.includes("dev frontend react next")) boost += 1120;
      if (name.includes("frontend app builder")) boost += 220;
    }
  }

  if (/\bdata quality\b|\bquality checks?\b|\bsuspicious\b|\bmissing\b|\bspreadsheet\b|\bexcel\b|\bworkbook\b|\bdata pipeline\b|\bownership\b/.test(normalizedQuery)) {
    if (name.includes("data analysis standard")) boost += 280;
    if (/\bexcel\b|\bworkbook\b|\bspreadsheet\b/.test(normalizedQuery) && name.includes("spreadsheets")) boost += 1680;
  }

  if (/\bsecurity vulnerabilities\b|\bvulnerability\b|\bsecurity\b|\brisks?\b/.test(normalizedQuery)) {
    if (name.includes("dev security engineering")) boost += 280;
    if (name.includes("security best practices")) boost += /\brisks?\b|\bterraform\b|\binfrastructure\b/.test(normalizedQuery) ? 260 : 140;
  }

  if (/\bsecurity findings?\b|\bvalidate exploitability\b|\btrack remediation\b/.test(normalizedQuery) || securityFindingTriageIntent) {
    if (name.includes("triage finding")) boost += securityFindingTriageIntent ? securityDiffScanIntent ? 520 : 1700 : 520;
    if (name.includes("security diff scan")) boost += securityDiffScanIntent ? 2200 : securityFindingTriageIntent ? 1280 : 620;
    if (name === "validation" || name.includes("validation")) boost += securityFindingTriageIntent ? 1280 : 620;
    if (name.includes("track findings")) boost += 520;
    if (name.includes("dependency audit")) boost -= securityFindingTriageIntent ? 980 : 0;
    if (["security threat model", "security ownership map"].some((term) => name.includes(term))) boost -= 420;
    if (name.includes("security best practices")) boost -= 160;
  }

  if (securityOwnershipMapIntent) {
    if (name.includes("security ownership map")) boost += 2200;
    if (["risk register", "track findings", "security best practices"].some((term) => name.includes(term))) boost += 360;
    if (["triage finding", "validation", "security diff scan", "security threat model", "threat model"].some((term) => name.includes(term))) boost -= 760;
  }

  if (/\bvercel\b|\bdeploy\b|\bbuild logs?\b|\benv\b|\benvironment\b/.test(normalizedQuery)) {
    if (["agent browser verify", "env vars"].some((term) => name.includes(term))) boost += 260;
    if (/\bvercel\b/.test(normalizedQuery) && /\bdeploy\b|\bbuild logs?\b/.test(normalizedQuery)
      && ["vercel api", "deployments cicd", "vercel deploy"].some((term) => name.includes(term))) boost += 560;
    if (/\bvercel\b/.test(normalizedQuery) && /\binspect\b|\bbuild logs?\b/.test(normalizedQuery)
      && ["agent browser verify", "env vars"].some((term) => name.includes(term))) boost += 420;
    if (/\bvercel\b/.test(normalizedQuery) && /\binspect\b|\bbuild logs?\b/.test(normalizedQuery)
      && ["vercel cli", "vercel services"].some((term) => name.includes(term))) boost -= 160;
  }

  if (/\bnetlify\b|\brender\b/.test(normalizedQuery) && /\bdeploy\b|\bpublish\b|\bhosting\b|\bservice\b|\bship\b|\bpreview\b|\bbranch\b|\bdns\b|\bcutover\b|\brollback\b/.test(normalizedQuery)) {
    if (/\bnetlify\b/.test(normalizedQuery) && name.includes("netlify deploy")) boost += /\bpreview\b|\bbranch\b|\bdns\b|\bcutover\b/.test(normalizedQuery) ? 2400 : 1120;
    if (/\brender\b/.test(normalizedQuery) && name.includes("render deploy")) boost += 1320;
    if (/\brender\b/.test(normalizedQuery) && ["vercel api", "vercel services", "vercel deploy", "netlify deploy"].some((term) => name.includes(term))) boost -= 360;
    if (/\bnetlify\b/.test(normalizedQuery) && ["vercel api", "vercel services", "vercel deploy", "render deploy"].some((term) => name.includes(term))) boost -= 360;
    if (/\bnetlify\b/.test(normalizedQuery) && ["web 3d asset pipeline", "winui app", "sprite pipeline"].some((term) => name.includes(term))) boost -= 820;
    if (/\bnetlify\b/.test(normalizedQuery) && ["launch readiness", "dev release productization", "frontend testing debugging"].some((term) => name.includes(term))) boost += 360;
  }

  if (/\bcron\b|\bscheduled\b/.test(normalizedQuery) && /\bvercel\b|\bserverless\b|\bworkflow\b/.test(normalizedQuery)) {
    if (name.includes("cron jobs")) boost += 1460;
    if (["vercel functions", "vercel queues", "workflow"].some((term) => name === term || name.includes(term))) boost += 520;
    if (name.includes("env vars")) boost -= 160;
  }

  if (/\basp\.?net\b|\bminimal api\b/.test(normalizedQuery)) {
    if (name.includes("aspnet core")) boost += 1640;
    if (name === "auth") boost -= 420;
  }

  if (/\bauthentication\b|\bauth\b|\boauth\b|\bsession protection\b/.test(normalizedQuery)) {
    if (name === "auth") boost += 1540;
    if (["security best practices", "dev backend api design"].some((term) => name.includes(term))) boost += 380;
    if (["security scan", "deep security scan"].some((term) => name.includes(term))) boost -= 320;
  }

  if (/\bcloudflare worker\b|\bdurable object\b|\bwrangler\b/.test(normalizedQuery)) {
    if (/\bmcp server\b|\btyped tool handlers?\b/.test(normalizedQuery) && name.includes("building mcp server on cloudflare")) boost += 980;
    if (/\bdurable object\b/.test(normalizedQuery) && name.includes("durable objects")) boost += 980;
    if (name.includes("wrangler")) boost += /\bdurable object\b/.test(normalizedQuery) ? 360 : 560;
    if (name.includes("workers best practices")) boost += /\bdurable object\b/.test(normalizedQuery) ? 340 : 420;
    if (/\bsandbox\b/.test(normalizedQuery) && name.includes("sandbox sdk")) boost += 620;
    if (/\bmcp\b|\bagent\b/.test(name) && !/\bmcp\b|\bagent\b/.test(normalizedQuery)) boost -= 260;
  }

  if (/\bstripe\b|\bbilling\b|\bsubscriptions?\b|\bwebhooks?\b|\bpayment\b/.test(normalizedQuery)) {
    if (name.includes("stripe best practices")) boost += 1480;
    if (["dev backend api design", "dev node typescript services"].some((term) => name.includes(term))) boost += 460;
    if (["gh fix ci", "dev security engineering", "code review"].some((term) => name.includes(term))) boost -= 320;
  }

  if (/\bscreenshot\b|\bimage\b/.test(normalizedQuery) && /\b(code|react|frontend|layout)\b/.test(normalizedQuery)) {
    if (["design image to code", "image to code"].some((term) => name.includes(term))) boost += 1280;
    if (["frontend testing debugging", "playwright", "screenshot"].some((term) => name.includes(term))) boost += 380;
    if (["design url to code", "url to code"].some((term) => name.includes(term))) boost -= 420;
  }

  if (/\bload testing\b|\bperformance budget\b|\bthroughput\b|\blatency\b/.test(normalizedQuery)) {
    if (name.includes("load testing plan")) boost += 620;
    if (name.includes("performance budget")) boost += 380;
    if (name.includes("dev performance engineering")) boost += 560;
  }

  if (/\bplaytest|\bplaytesting\b|\bbrowser game\b|\bphaser\b/.test(normalizedQuery)) {
    if (name.includes("game playtest")) boost += 260;
  }

  if (/\bconversion\b|\bcro\b|\bmarketing funnel\b|\breporting\b/.test(normalizedQuery)) {
    if (name.includes("kpi reporting")) boost += 220;
  }

  if (/\boffer angles?\b|\bproduct shot\b|\bcampaign\b|\bad concepts?\b/.test(normalizedQuery)) {
    if (/\bcreative offer angles?\b|\boffer strategy\b|\bpromotional offer\b/.test(normalizedQuery) && name.includes("creative offer")) boost += 980;
    if (/\boffer angles?\b/.test(normalizedQuery) && name.includes("creative offer")) boost += 260;
    if (/\bproduct shot\b|\bcampaign\b/.test(normalizedQuery) && name.includes("creative production")) boost += 520;
    if (name.includes("creative positioning")) boost += 220;
    if (name.includes("creative ads explorer")) boost += /\bad concepts?\b/.test(normalizedQuery) ? 520 : 180;
  }

  if (/\blinear\b|\bplan product\b|\bproduct work\b|\broadmap\b|\blaunch readiness\b|\brollback\b|\brelease milestones?\b|\bfollow-up owners?\b/.test(normalizedQuery)) {
    if (name.includes("roadmap narrative")) boost += /\broadmap narrative\b|\brelease milestones?\b|\bfollow-up owners?\b/.test(normalizedQuery) ? 1260 : 220;
    if (name === "linear" || name.includes("linear")) boost += /\blinear issues?\b|\blinear\b/.test(normalizedQuery) ? 860 : 160;
    if (name.includes("notion research documentation")) boost += /\bnotion research\b|\bresearch notes?\b/.test(normalizedQuery) ? 520 : 120;
    if (name.includes("feature prioritisation")) boost += /\broadmap\b|\bmilestones?\b/.test(normalizedQuery) ? 360 : 120;
    if (/\blaunch readiness checklist\b|\bchecklist\b.*\blaunch readiness\b|\brollback\b|\bfeature flags?\b/.test(normalizedQuery) && name.includes("launch readiness")) boost += 920;
    if (/\bfeature flags?\b/.test(normalizedQuery) && name.includes("feature flag guide")) boost += 620;
    if ((/\bdo not\b.*\bprd\b|\bnot\b.*\bprd\b/.test(normalizedQuery)) && name.includes("prd template")) boost -= 720;
  }

  if (roadmapDeckIntent) {
    if (name === "presentations" || name.includes("presentations")) boost += 2200;
    if (name.includes("roadmap presentation")) boost += 1900;
    if (name.includes("template creator")) boost += 620;
    if (name.includes("roadmap narrative")) boost += 420;
    if (name === "linear" || name.includes("linear")) boost -= 420;
    if (["prd template", "gmail inbox triage"].some((term) => name.includes(term))) boost -= 900;
  }

  if (/\bfirewall\b|\bbot protection\b|\brate limits?\b|\bwaf\b/.test(normalizedQuery)) {
    if (name.includes("security best practices")) boost += 640;
    if (name.includes("vercel deploy")) boost += 220;
  }

  if (/\brisk register\b|\brisk matrix\b/.test(normalizedQuery)) {
    if (name.includes("risk register")) boost += 1180;
    if (name.includes("launch readiness")) boost += /\bchecklist\b|\brollback\b|\bfeature flags?\b/.test(normalizedQuery) ? 360 : 80;
    if (["slo error budget", "dev observability sre", "dev security engineering"].some((term) => name.includes(term))) boost -= 180;
  }

  if (/\bmetric diagnostics?\b|\bdiagnose\b.*\bmetric\b|\bmetric\b.*\bchanged\b|\bfunnel drop\b|\bactivation rate\b|\bmix shift\b/.test(normalizedQuery)) {
    if (name.includes("metric diagnostics")) boost += 1500;
    if (["data analysis standard", "validate data", "analyze data quality", "product business analysis"].some((term) => name.includes(term))) boost += 420;
    if (["build dashboard", "kpi reporting"].some((term) => name.includes(term))) boost -= 280;
  }

  if (/\ba\/b test\b|\bab test\b|\bexperiment design\b|\bexperiment\b.*\b(cohort|hypothesis|guardrail|stopping rules?)\b/.test(normalizedQuery)) {
    if (name.includes("experiment designer")) boost += 1560;
    if (["design kpis", "kpi reporting", "metric diagnostics"].some((term) => name.includes(term))) boost += 420;
    if (["feature flag guide", "load testing plan"].some((term) => name.includes(term))) boost -= 260;
  }

  if (/\bprd\b|\bfeature priorit|user research\b/.test(normalizedQuery)) {
    if (name.includes("prd template")) boost += 360;
    if (name.includes("feature prioritisation")) boost += 340;
    if (["user research synthesis", "ux research plan"].some((term) => name.includes(term))) boost += 260;
  }

  if (/\buser interviews?\b|\bsynthesize\b|\bsynthesise\b|\bthemes?\b|\bopportunities\b/.test(normalizedQuery)) {
    if (name.includes("user research synthesis")) boost += 520;
    if (["design research", "ux research plan"].some((term) => name.includes(term))) boost += 260;
  }

  if (/\bopenai\b|\bapi docs?\b|\bproduct feature\b/.test(normalizedQuery)) {
    const openAiDocsLookupIntent = /\bopenai\b/.test(normalizedQuery)
      && /\bdocs?\b|\bdocumentation\b|\bapi reference\b|\breference\b/.test(normalizedQuery)
      && !/\bwrite\b|\bdocument endpoints?\b|\bgenerate\b|\bendpoint behavior\b/.test(normalizedQuery);
    if (openAiDocsLookupIntent) {
      if (name === "openai docs") boost += 1420;
      if (name.includes("api docs writer")) boost -= 520;
    }
    if (name.includes("dev ai llm apps")) boost += 180;
  }

  if (openAiAgentsJsIntent) {
    if (name.includes("openai agents js")) boost += 2200;
    if (["dev ai llm apps", "dev node typescript services"].some((term) => name.includes(term))) boost += 520;
    if (name === "openai docs") boost += 260;
    if (["chatgpt apps", "copilot sdk"].some((term) => name.includes(term))) boost -= 1100;
  }

  if (/\bexplain\b|\bcode path\b|\bunfamiliar module\b|\bcontrol flow\b/.test(normalizedQuery)) {
    if (name.includes("code explainer")) boost += 1420;
    if (name.includes("dev architecture review")) boost += 360;
    if (/\bwithout\b.*\bcode review\b|\bnot\b.*\bcode review\b/.test(normalizedQuery) && name.includes("code review checklist")) boost -= 520;
  }

  if (/\bhugging face\b|\bgradio\b|\bspace\b|\bdemo\b|\bvision model\b|\btrackio\b/.test(normalizedQuery)) {
    const huggingFaceDemoIntent = /\bgradio\b|\bspace\b|\bdemo\b/.test(normalizedQuery);
    const huggingFaceDatasetResearchIntent = /\bdatasets?\b/.test(normalizedQuery)
      && /\bcard metadata\b|\bmetadata\b|\blicens(?:e|ing)\b|\brelated papers?\b|\bevals?\b|\bbefore any model training\b|\bbefore training\b/.test(normalizedQuery);
    const trackioPrimaryIntent = /\btrackio\b|\bexperiment tracking\b|\bevaluation artifacts?\b|\bmodel run\b/.test(normalizedQuery)
      || (!huggingFaceDemoIntent && /\btrack(?:ing)?\b|\bevaluation runs?\b/.test(normalizedQuery));
    if (huggingFaceDemoIntent && name.includes("huggingface gradio")) boost += 1260;
    if (/\bvision\b/.test(normalizedQuery) && name.includes("huggingface vision trainer")) boost += 620;
    if (trackioPrimaryIntent && name.includes("huggingface trackio")) boost += 1800;
    if (huggingFaceDemoIntent && /\btrack(?:ing)?\b|\bevaluation runs?\b/.test(normalizedQuery) && name.includes("huggingface trackio")) boost += 360;
    if (/\btrain\b|\bmodel training\b/.test(normalizedQuery) && name.includes("huggingface llm trainer")) boost += huggingFaceDatasetResearchIntent ? -920 : 620;
    if (/\bdatasets?\b|\bdataset metadata\b/.test(normalizedQuery) && name.includes("huggingface datasets")) boost += huggingFaceDatasetResearchIntent ? 2200 : 680;
    if (name.includes("huggingface community evals")) boost += huggingFaceDatasetResearchIntent ? 520 : 240;
    if ((/\bhf cli\b|\bspace\b|\bgradio\b/.test(normalizedQuery) || huggingFaceDatasetResearchIntent) && name.includes("hf cli")) boost += 260;
    if ((/\bpublish\b|\bpapers?\b|\bevaluation results?\b/.test(normalizedQuery)) && name.includes("huggingface paper publisher")) boost += 340;
    if (huggingFaceDatasetResearchIntent && ["huggingface gradio", "huggingface llm trainer", "huggingface vision trainer"].some((term) => name.includes(term))) boost -= 980;
    if (huggingFaceDatasetResearchIntent && name.includes("huggingface papers")) boost -= 120;
    if (/\btrackio\b|\bexperiment tracking\b|\bnot\b.*\bgradio\b|\bnot\b.*\bpaper\b/.test(normalizedQuery)
      && ["huggingface gradio", "huggingface paper publisher", "huggingface papers"].some((term) => name.includes(term))) boost -= 860;
    if (/\bgradio\b|\bspace\b|\bdemo\b/.test(normalizedQuery) && ["huggingface papers", "huggingface llm trainer", "huggingface vision trainer"].some((term) => name.includes(term))) boost -= 260;
  }

  if (/\bapi\b|\bendpoints?\b|\bdocument\b|\bversioned\b|\bcompatibility\b/.test(normalizedQuery)) {
    if (/\bdesign\b.*\bbackend api\b|\bbackend api\b.*\bdesign\b|\bnode service\b.*\bdocument endpoints?\b/.test(normalizedQuery) && name.includes("dev backend api design")) boost += 620;
    if (name.includes("api docs writer")) boost += /\bdocumentation\b|\bapi docs?\b|\bdocument endpoints?\b|\bendpoints? behavior\b|\bexamples?\b/.test(normalizedQuery) ? 520 : 240;
    if (/\bapi versioning strategy\b|\bversioning strategy\b|\bbreaking changes?\b|\bcompatibility\b/.test(normalizedQuery) && name.includes("api versioning strategy")) boost += 520;
  }

  if (/\bpython\b.*\bservice\b|\bservice\b.*\bpython\b/.test(normalizedQuery)) {
    if (name.includes("dev python services")) boost += 760;
    if (/\btests?\b|\boperational\b|\breadiness\b/.test(normalizedQuery)
      && ["dev testing qa", "monitoring setup guide"].some((term) => name.includes(term))) boost += 760;
    if (name.includes("dev backend api design")) boost -= 180;
    if (["dev node typescript services", "dev java dotnet services"].some((term) => name.includes(term))) boost -= 620;
    if (name.includes("vercel services")) boost -= 760;
  }

  if (/\bdependency audit\b|\btechnical debt\b|\brepo audit\b|\bcode review\b/.test(normalizedQuery)) {
    if (name.includes("code review checklist")) boost += 180;
  }

  if (/\bdependency conflicts?\b|\bversion conflicts?\b|\bnpm upgrade\b|\bpeer dependenc/.test(normalizedQuery)) {
    if (name.includes("dependency conflict resolver")) boost += 980;
    if (name.includes("dev dependency maintenance")) boost += 360;
    if (name.includes("dependency audit") && !/\baudit\b|\bvulnerability\b/.test(normalizedQuery)) boost -= 180;
  }

  if (/\bmonorepo\b|\bturborepo\b|\bbuild system\b|\bpipeline issue\b/.test(normalizedQuery)) {
    if (["dev monorepo build systems", "turborepo"].some((term) => name.includes(term))) boost += 520;
    if (name.includes("dev git github collaboration")) boost += 460;
    if (name.includes("dev security engineering") && !/\bsecurity\b/.test(normalizedQuery)) boost -= 260;
  }

  if (role === "primary" && /\b(create|build|implement|deploy|compile|train|debug|audit|review|plan|design)\b/.test(normalizedQuery)) {
    boost += 12;
  }

  return boost;
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

function recommendConceptWorkflow(index, query, filters = {}) {
  const ranked = rankConceptWorkflowSkills(index, query, filters).slice(0, 8);
  const primary = ranked[0] ? serializeConceptWorkflowSkill(ranked[0]) : null;
  if (!primary) return { query, primary: null, supporting: [], steps: [], concept: null };

  const seenNames = new Set([normalizeSearchText(primary.name)]);
  const supporting = ranked
    .slice(1)
    .filter((skill) => {
      const key = normalizeSearchText(skill.name);
      if (!key || seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    })
    .slice(0, 4)
    .map(serializeConceptWorkflowSkill);

  const steps = [primary, ...supporting].map((skill, index) => ({
    order: index + 1,
    skillId: skill.id,
    name: skill.name,
    path: skill.path,
    conceptId: skill.conceptId,
    conceptLabel: skill.conceptLabel,
    role: skill.conceptRole,
    reason: index === 0
      ? skill.conceptLabel
        ? `Primary concept-aided match from ${skill.conceptLabel}.`
        : "Primary skill-level match."
      : skill.conceptLabel
        ? `${skill.conceptRole === "fallback" ? "Fallback" : "Role-tagged"} support from ${skill.conceptLabel}.`
        : "Supporting skill from ranked skill fallback."
  }));

  return {
    query,
    primary,
    supporting,
    steps,
    concept: primary.conceptId ? {
      id: primary.conceptId,
      label: primary.conceptLabel
    } : null
  };
}

function searchConceptWorkflowSkills(index, query, filters = {}) {
  return rankConceptWorkflowSkills(index, query, filters)
    .slice(0, 80)
    .map(serializeConceptWorkflowSkill);
}

function serializeConceptWorkflowSkill(skill) {
  return {
    ...serializeSkillSummary(skill),
    score: skill.score,
    conceptId: skill.conceptId,
    conceptLabel: skill.conceptLabel,
    conceptRole: skill.conceptRole,
    conceptReason: skill.conceptReason
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

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    if (!key) return counts;
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
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
    edgeLimit: SKILL_EDGE_LIMIT,
    edgeCandidateCount: index.edges.candidateCount ?? index.edges.length,
    edgeDroppedCount: index.edges.droppedCount ?? 0,
    edgeDroppedTypeCounts: index.edges.droppedTypeCounts ?? {},
    edgeTruncated: (index.edges.droppedCount ?? 0) > 0,
    edgeTypeCounts: countBy(index.edges, (edge) => edge.type),
    conceptCount: index.concepts?.length ?? 0,
    conceptEdgeCount: index.conceptEdges?.length ?? 0,
    conceptEdgeLimit: CONCEPT_EDGE_LIMIT,
    conceptEdgeCandidateCount: index.conceptEdges?.candidateCount ?? index.conceptEdges?.length ?? 0,
    conceptEdgeDroppedCount: index.conceptEdges?.droppedCount ?? 0,
    conceptEdgeDroppedTypeCounts: index.conceptEdges?.droppedTypeCounts ?? {},
    conceptEdgeTruncated: (index.conceptEdges?.droppedCount ?? 0) > 0,
    conceptEdgeTypeCounts: countBy(index.conceptEdges ?? [], (edge) => edge.type),
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
  rankConceptWorkflowSkills,
  recommendConceptWorkflow,
  searchConceptWorkflowSkills,
  searchSkills,
  recommendWorkflow,
  getRelatedSkills,
  serializeSkillDetail,
  summarizeIndex,
  scanSkillRoots
};
