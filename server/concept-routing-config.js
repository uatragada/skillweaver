const ROUTING_CONFIG_VERSION = "2026-07-06";

const CONCEPT_RULES = [
  {
    id: "frontend-implementation",
    label: "Frontend implementation",
    description: "Build, adapt, and harden browser-facing React, Vite, CSS, and component work.",
    triggers: ["build a web app", "frontend app", "react ui", "implement a page", "fix ui", "mobile app", "desktop app", "react native", "flutter", "electron", "tauri", "app store", "native bridge", "winui"],
    domains: ["frontend", "product"],
    tools: ["Node", "Playwright", "Figma", "Vercel"],
    gatewaySkillNames: ["build-web-apps:frontend-app-builder", "frontend-app-builder"],
    primarySkillNames: ["dev-frontend-react-next", "build-web-apps:react-best-practices", "dev-mobile-desktop", "framer-code-components"],
    supportingSkillNames: ["build-web-apps:shadcn", "dev-frontend-accessibility-css", "premium-web-design", "design-qa", "winui-app", "launch-readiness", "dev-release-productization", "framer"],
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
    primarySkillNames: ["playwright", "playwright-interactive", "build-web-apps:frontend-testing-debugging", "frontend-testing-debugging", "screenshot"],
    supportingSkillNames: ["control-in-app-browser", "motion-qa"],
    verificationSkillNames: ["vercel:agent-browser-verify", "agent-browser-verify"],
    relatedConceptIds: ["frontend-implementation", "deployment-release"]
  },
  {
    id: "figma-handoff",
    label: "Figma design handoff",
    description: "Navigate Figma context, audit component intent, and translate designs into implementation work.",
    triggers: ["figma design", "design to code", "implement figma", "design handoff", "component audit", "swiftui", "figma swiftui motion", "figma annotation", "engineering handoff"],
    domains: ["frontend", "product", "creative"],
    tools: ["Figma", "Node"],
    gatewaySkillNames: ["figma-use", "figma:figma-use"],
    primarySkillNames: ["figma-implement-design", "figma-generate-library", "figma:figma-code-connect", "figma-code-connect", "figma-code-connect-components", "figma-annotation-guide", "product-design:image-to-code", "design-image-to-code", "design-url-to-code", "figma:figma-swiftui", "figma-swiftui"],
    supportingSkillNames: ["figma-design-qa", "figma-component-audit", "figma-create-design-system-rules", "product-design:get-context", "design-get-context", "figma:figma-generate-design", "figma-generate-design", "figma:figma-implement-motion", "figma-implement-motion", "figma:figma-use-motion", "figma-use-motion"],
    verificationSkillNames: ["design-qa", "figma-design-review", "figma-design-qa"],
    relatedConceptIds: ["frontend-implementation", "browser-verification"]
  },
  {
    id: "data-dashboarding",
    label: "Data dashboards and reports",
    description: "Profile data, design KPIs, build dashboards or reports, and validate analytical outputs.",
    triggers: ["analytics dashboard", "kpi report", "visualize data", "data quality", "business analysis", "metric diagnostics", "market sizing", "experiment design", "a/b test", "visualization accessibility", "geospatial map", "cartographic visualization"],
    domains: ["data", "product"],
    tools: ["Python", "Node"],
    gatewaySkillNames: ["data-analytics:index"],
    primarySkillNames: ["data-analytics:build-dashboard", "build-dashboard", "data-analytics:build-report", "build-report", "build-web-data-visualization:data-visualization", "data-visualization", "geospatial-and-cartographic-visualization", "data-analytics:visualize-data", "visualize-data", "data-analytics:jupyter-notebooks", "jupyter-notebooks", "metric-diagnostics", "product-business-analysis", "spreadsheets:Spreadsheets", "Spreadsheets", "chart-data-extractor"],
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
    primarySkillNames: ["codex-security:security-scan", "security-scan", "codex-security:deep-security-scan", "deep-security-scan", "codex-security:threat-model", "threat-model", "security-threat-model", "security-ownership-map", "security-best-practices", "codex-security:finding-discovery", "finding-discovery", "codex-security:validation", "validation"],
    supportingSkillNames: ["codex-security:attack-path-analysis", "attack-path-analysis", "codex-security:finding-discovery", "finding-discovery", "codex-security:triage-finding", "triage-finding", "codex-security:track-findings", "track-findings", "skill-security-auditor"],
    verificationSkillNames: ["codex-security:validation", "validation", "codex-security:security-diff-scan", "security-diff-scan"],
    relatedConceptIds: ["github-pr-repair", "repo-operations"]
  },
  {
    id: "deployment-release",
    label: "Deployment and release",
    description: "Prepare releases, deploy to hosting providers, repair deployment issues, and verify production surfaces.",
    triggers: ["deploy app", "release readiness", "vercel", "cloudflare", "netlify", "render", "branch preview", "dns cutover", "cron job", "scheduled workflow", "vercel queue", "queue worker", "background job"],
    domains: ["operations", "frontend", "backend"],
    tools: ["Vercel", "Cloudflare", "GitHub", "Node"],
    primarySkillNames: ["vercel-deploy", "vercel:bootstrap", "vercel-api", "deployments-cicd", "cloudflare-deploy", "cloudflare:wrangler", "netlify-deploy", "render-deploy", "cron-jobs", "vercel-functions", "vercel-queues"],
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
    primarySkillNames: ["presentations:Presentations", "Presentations", "roadmap-presentation", "template-creator:template-creator", "template-creator"],
    supportingSkillNames: ["roadmap-narrative", "linear", "documents:documents", "documents", "premium-saas-landing-pages"],
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
    primarySkillNames: ["game-studio:game-studio", "game-studio", "game-studio:phaser-2d-game", "phaser-2d-game", "game-studio:game-ui-frontend", "game-ui-frontend", "game-studio:sprite-pipeline", "sprite-pipeline", "game-studio:three-webgl-game", "three-webgl-game", "game-studio:web-game-foundations", "web-game-foundations", "game-studio:react-three-fiber-game", "react-three-fiber-game", "racingsim-ai-ml", "racingsim-game-dev"],
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
    primarySkillNames: ["dev-ai-llm-apps", "openai-docs", "openai-agents-js", "chatgpt-apps", "copilot-sdk", "cloudflare:agents-sdk", "agents-sdk", "vercel:ai-sdk", "ai-sdk", "vercel:ai-elements", "ai-elements", "vercel:ai-generation-persistence", "ai-generation-persistence", "transcribe", "speech"],
    supportingSkillNames: ["dev-node-typescript-services", "dev-frontend-react-next", "frontend-testing-debugging", "database-schema-design", "api-docs-writer", "hugging-face:transformers-js", "transformers-js", "hugging-face:huggingface-gradio", "local-speech-ai-mvp"],
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
    supportingSkillNames: ["product-launch-checklist", "product-design:index", "onboarding-plan", "launch-readiness", "metric-diagnostics", "design-kpis", "last-30-days-research", "research-protocol"],
    relatedConceptIds: ["presentations", "data-dashboarding", "github-pr-repair"]
  },
  {
    id: "cloudflare-workers",
    label: "Cloudflare workers",
    description: "Build, configure, and deploy Cloudflare Workers, Durable Objects, MCP servers, and agent runtimes.",
    triggers: ["cloudflare workers", "wrangler", "durable object", "cloudflare mcp server", "mcp server on cloudflare", "cloudflare agent"],
    domains: ["operations", "backend", "ai"],
    tools: ["Cloudflare", "Node"],
    primarySkillNames: ["cloudflare:workers-best-practices", "workers-best-practices", "cloudflare:wrangler", "wrangler", "cloudflare:durable-objects", "durable-objects", "cloudflare:agents-sdk", "agents-sdk", "cloudflare:building-mcp-server-on-cloudflare", "building-mcp-server-on-cloudflare", "cloudflare:building-ai-agent-on-cloudflare", "building-ai-agent-on-cloudflare"],
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
    primarySkillNames: ["hugging-face:hf-cli", "hf-cli", "hugging-face:huggingface-datasets", "huggingface-datasets", "hugging-face:huggingface-jobs", "huggingface-jobs", "hugging-face:huggingface-llm-trainer", "huggingface-llm-trainer", "hugging-face:huggingface-vision-trainer", "huggingface-vision-trainer", "hugging-face:huggingface-papers", "huggingface-papers", "hugging-face:huggingface-paper-publisher", "huggingface-paper-publisher", "hugging-face:huggingface-gradio", "huggingface-gradio", "hugging-face:huggingface-trackio", "huggingface-trackio"],
    supportingSkillNames: ["hugging-face:huggingface-community-evals", "huggingface-community-evals", "hugging-face:huggingface-gradio", "huggingface-gradio", "hugging-face:transformers-js", "transformers-js"],
    relatedConceptIds: ["agent-llm-apps", "data-dashboarding"]
  },
  {
    id: "marketing-growth",
    label: "Marketing growth",
    description: "Plan, research, produce, and measure marketing, SEO, CRO, creative, and industry growth work.",
    triggers: ["marketing strategy", "seo", "cro", "creative ads", "growth report", "competitive intelligence", "technical seo", "organic growth", "ai search", "entity content", "ad concepts", "offer angles", "promo creative", "competitor positioning", "competitive intelligence monitor", "product shot", "shot prompts", "saas copy", "docbridge copy"],
    domains: ["creative", "data", "product"],
    tools: ["Node"],
    primarySkillNames: ["marketing-strategy-and-growth", "seo-and-organic-growth", "analytics-cro-and-reporting", "creative-production", "creative-offer", "creative-ads-explorer", "competitive-intelligence-monitor", "creative-shot", "docbridge-saas-copywriter"],
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
    primarySkillNames: ["dev-backend-api-design", "dev-node-typescript-services", "dev-python-services", "dev-java-dotnet-services", "dev-go-rust-systems", "aspnet-core", "stripe-best-practices", "auth", "sign-in-with-vercel"],
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
    primarySkillNames: ["dev-database-postgres", "database-schema-design", "database-migration-plan", "dev-data-engineering", "data-pipeline-spec", "data-quality-audit"],
    supportingSkillNames: ["data-analysis-standard", "dev-python-services"],
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
    supportingSkillNames: ["dev-monorepo-build-systems", "dev-dependency-maintenance", "error-decoder", "debugging-log-analyser", "dev-git-github-collaboration"],
    verificationSkillNames: ["codex-security:security-diff-scan"],
    relatedConceptIds: ["github-pr-repair", "security-review", "deployment-release"]
  }
];

function getConfiguredSkillIntentBoost({ skillName, role, normalizedQuery, hasNegatedIntent, dataOutputTerms }) {
  const name = skillName;
  let boost = 0;
  const negatedDataOutputIntent = hasNegatedIntent(normalizedQuery, dataOutputTerms);
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
  const inAppBrowserIntent = /\bin app browser\b|\bcontrol in app browser\b|\bapp embedded browser\b|\bembedded browser\b|\bbrowser plugin\b/.test(normalizedQuery);
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
  const pdfChartExtractionIntent = /\bpdf\b/.test(normalizedQuery)
    && /\bchart|charts|graph|graphs|plot|plots|figure|figures\b/.test(normalizedQuery)
    && /\bextract|extraction|digitize|data points?|series\b/.test(normalizedQuery);
  const negatedNotionMeetingIntent = hasNegatedIntent(normalizedQuery, ["meeting", "meeting notes", "agenda", "pre reads"]);
  const notionSpecImplementationIntent = /\bnotion\b/.test(normalizedQuery)
    && /\bspec|implementation|acceptance criteria|repo handoff\b/.test(normalizedQuery)
    && (!/\bmeeting|agenda|pre reads?\b/.test(normalizedQuery) || negatedNotionMeetingIntent);
  const negatedCronIntent = hasNegatedIntent(normalizedQuery, ["cron", "scheduled", "scheduled job", "scheduled workflow"]);
  const vercelQueueIntent = /\bvercel\b/.test(normalizedQuery)
    && /\bqueue|queues|queued|background worker|worker queue|jobs?\b/.test(normalizedQuery)
    && (!/\bcron|scheduled\b/.test(normalizedQuery) || negatedCronIntent);
  const signInWithVercelIntent = /\bsign[ -]?in with vercel\b/.test(normalizedQuery)
    || (/\bvercel\b/.test(normalizedQuery) && /\bsign[ -]?in|sso|enterprise auth|protected routes?\b/.test(normalizedQuery));
  const goRustSystemsIntent = /\bgo\b|\bgolang\b|\brust\b/.test(normalizedQuery)
    && /\bcli|command line|packag|binary|binaries|cross compile|release|systems?\b/.test(normalizedQuery);
  const framerCodeComponentIntent = /\bframer\b/.test(normalizedQuery)
    && /\bcode component|code components|component props?|props?|controls?|property controls?\b/.test(normalizedQuery);
  const securityFindingDiscoveryIntent = /\bfinding discovery\b|\bdiscover\b.*\bfindings?\b|\bfindings?\b.*\bbefore\b.*\btriage\b|\bbefore\b.*\btriage\b.*\bfindings?\b/.test(normalizedQuery);
  const huggingFacePaperPublisherIntent = /\bhugging face\b/.test(normalizedQuery)
    && /\bpaper page|paper publisher|paper evidence summary|publish\b.*\bpaper\b/.test(normalizedQuery);
  const negatedOfferIntent = hasNegatedIntent(normalizedQuery, ["offer", "offer angle", "offer angles", "offer strategy"]);
  const creativeShotIntent = /\bcreative shot|product shot|product-shot|shot prompts?|shot list|scene shot|visual shot\b/.test(normalizedQuery)
    && (!/\boffer angles?\b|\bad concepts?\b/.test(normalizedQuery) || negatedOfferIntent || /\bshot direction\b/.test(normalizedQuery));
  const docbridgeCopyIntent = /\bdocbridge\b/.test(normalizedQuery)
    && /\bcopy|saas|landing|workflow review|positioning|sensitive workflows?\b/.test(normalizedQuery);
  const negatedRacingsimAiIntent = hasNegatedIntent(normalizedQuery, ["ppo", "training", "ppo training", "model training"]);
  const racingsimRuntimeIntent = /\bracingsim\b/.test(normalizedQuery)
    && /\bmap|runtime|track|godot|startup|timeout|checkpoint|normal play|rotation\b/.test(normalizedQuery)
    && (!/\bppo|stable baselines|training|policy|reward\b/.test(normalizedQuery) || negatedRacingsimAiIntent);
  const racingsimAiIntent = /\bracingsim\b/.test(normalizedQuery)
    && /\bppo|stable baselines|training|policy|reward|ai|ml\b/.test(normalizedQuery);
  const capacityBoundaryIntent = /\bcapacity\b/.test(normalizedQuery)
    && /\bslo|load|latency|throughput|traffic|scale|scaling|boundary|budget|headroom|forecast\b/.test(normalizedQuery)
    && !/\bterraform\b|\bmanifests?\b|\bsecret exposure\b|\brollout blast radius\b|\bci\/cd controls?\b/.test(normalizedQuery);
  const schemaBeforeSupabaseIntent = /\bschema\b/.test(normalizedQuery)
    && /\bsupabase\b/.test(normalizedQuery)
    && /\bbefore|not|without|avoid|rather than|instead of\b/.test(normalizedQuery);
  const openAiDocsMigrationIntent = /\bopenai\b/.test(normalizedQuery)
    && /\bapi migration|migration|current docs?|docs? check|documentation check|api changes?|api reference\b/.test(normalizedQuery)
    && !openAiAgentsJsIntent
    && !/\bwrite|generate|draft|document endpoints?|endpoint behavior\b/.test(normalizedQuery);
  const openAiDocsVerificationIntent = /\bopenai\b/.test(normalizedQuery)
    && /\bverify|current|migration|structured output|structured-output|api reference|before implementation\b/.test(normalizedQuery)
    && !openAiAgentsJsIntent;
  const aiElementsIntent = /\bai elements\b|\bstreaming messages?\b|\btool[- ]call states?\b/.test(normalizedQuery)
    && (!chatgptAppIntent || negatedChatgptAppIntent);
  const aiGenerationPersistenceIntent = /\bai generations?\b|\bgeneration persistence\b|\bresume outputs?\b|\bresume\b.*\brefresh\b/.test(normalizedQuery)
    && /\bpersist|\bpersistence|\bstorage boundaries?\b|\breplay tests?\b|\brefresh\b/.test(normalizedQuery);
  const cloudflareAgentStateIntent = /\bcloudflare\b/.test(normalizedQuery)
    && /\bagents? sdk\b|\bstateful\b.*\bagent|\bagent\b.*\bdurable object\b|\bworker bindings?\b.*\bagent/.test(normalizedQuery);
  const screenshotEvidenceIntent = /\bscreenshot evidence\b|\bcapture screenshots?\b|\battach browser qa notes?\b|\bdesktop and mobile states?\b/.test(normalizedQuery)
    && !agentBrowserPreviewIntent
    && !inAppBrowserIntent;
  const figmaAnnotationIntent = /\bfigma\b/.test(normalizedQuery)
    && /\bannotat|\bannotation|\bspacing\b|\bcomponent notes?\b|\breview comments?\b|\bengineering handoff\b/.test(normalizedQuery)
    && !/\bfigjam\b|\buser flow\b/.test(normalizedQuery);
  const productDesignAuditIntent = /\baudit\b/.test(normalizedQuery)
    && /\bproduct design\b|\bonboarding flow\b|\binteraction risks?\b|\bbefore implementation\b/.test(normalizedQuery)
    && !/\bbuild the page\b|\bimplement\b/.test(normalizedQuery);
  const geospatialMapIntent = /\bgeospatial\b|\bcartographic\b|\bmap visualization\b|\bprojection choices?\b/.test(normalizedQuery);
  const eventTableQualityIntent = /\bevent table\b|\bduplicate keys?\b|\bnull rates?\b|\bfreshness\b|\bdata pipeline contract\b/.test(normalizedQuery)
    && /\baudit\b|\bquality\b|\bownership rules?\b/.test(normalizedQuery);
  const securityRemediationValidationIntent = /\bvalidate\b|\bvalidation\b/.test(normalizedQuery)
    && /\bsecurity remediation\b|\bremediation pr\b|\breported issue\b|\bfixes?\b|\bfinding status\b/.test(normalizedQuery);
  const huggingFaceJobsIntent = /\bhugging face\b|\bhf\b/.test(normalizedQuery)
    && /\bgpu job\b|\bremote\b.*\bjob\b|\blaunch\b.*\bjob\b|\bmonitor\b.*\bjob\b|\brun artifacts?\b/.test(normalizedQuery);
  const speechToTextIntent = /\bspeech[- ]to[- ]text\b|\btranscrib|\bmicrophone\b|\bwhisper\b/.test(normalizedQuery);
  const voiceoverTtsIntent = /\bvoiceover\b|\bprepared script\b|\bvoice settings?\b|\bplayback\b/.test(normalizedQuery)
    || (/\btext[- ]to[- ]speech\b|\btts\b/.test(normalizedQuery) && !speechToTextIntent);
  const technicalDebtRegisterIntent = /\btechnical debt register\b|\bmodule hotspots?\b|\btodos?\b|\bowner notes?\b/.test(normalizedQuery);
  const presentationTemplateIntent = /\bpresentation\b|\bslides?\b|\btemplate pack\b|\breusable presentation\b/.test(normalizedQuery)
    && /\btemplate pack\b|\bslide layouts?\b|\bplaceholders?\b|\bbrand assets?\b|\bvalidation guidance\b/.test(normalizedQuery);
  const notionResearchSourceBankIntent = /\bnotion\b/.test(normalizedQuery)
    && /\bsource bank\b|\bevidence summaries?\b|\bopen questions?\b/.test(normalizedQuery)
    && !notionSpecImplementationIntent;

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

  if (pdfChartExtractionIntent) {
    if (name.includes("chart data extractor")) boost += 2600;
    if (["pdf", "documents", "build report", "data visualization"].some((term) => name === term || name.includes(term))) boost += 420;
    if (["spreadsheets", "reports pdfs and slide automation", "resume cover letter tailor"].some((term) => name.includes(term))) boost -= 1100;
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

  if (aiElementsIntent) {
    if (name.includes("ai elements")) boost += 3400;
    if (["ai sdk", "dev frontend react next", "frontend testing debugging"].some((term) => name.includes(term))) boost += 520;
    if (["chatgpt apps", "openai agents js", "dev ai llm apps", "building ai agent on cloudflare"].some((term) => name.includes(term))) boost -= 1300;
  }

  if (aiGenerationPersistenceIntent) {
    if (name.includes("ai generation persistence")) boost += 3400;
    if (["ai sdk", "dev node typescript services", "database schema design"].some((term) => name.includes(term))) boost += 520;
    if (["vercel storage", "openai agents js", "dev database postgres", "database migration plan"].some((term) => name.includes(term))) boost -= 1200;
  }

  if (cloudflareAgentStateIntent) {
    if (name.includes("agents sdk") || name.includes("building ai agent on cloudflare")) boost += 3200;
    if (["durable objects", "wrangler", "workers best practices"].some((term) => name.includes(term))) boost += 640;
    if (["openai agents js", "agent browser", "vercel agent"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (screenshotEvidenceIntent) {
    if (name === "screenshot" || name.includes("screenshot")) boost += 3600;
    if (["control in app browser", "frontend testing debugging", "playwright"].some((term) => name.includes(term))) boost += 520;
    if (["design image to code", "image to code", "design url to code", "url to code"].some((term) => name.includes(term))) boost -= 2200;
  }

  if (figmaAnnotationIntent) {
    if (name.includes("figma annotation guide")) boost += 3600;
    if (["figma use", "figma design review", "figma design qa"].some((term) => name.includes(term))) boost += 520;
    if (["figma implement design", "figma code connect", "dev frontend react next"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (productDesignAuditIntent) {
    if (name === "design audit" || name.includes("design audit")) boost += 4200;
    if (["design get context", "ux research plan", "design qa"].some((term) => name.includes(term))) boost += 520;
    if (["frontend app builder", "figma implement design"].some((term) => name.includes(term))) boost -= 1400;
    if (name === "audit") boost -= 2600;
  }

  if (geospatialMapIntent) {
    if (name.includes("geospatial and cartographic visualization")) boost += 3400;
    if (["data visualization", "testing data visualizations", "build report"].some((term) => name.includes(term))) boost += 520;
    if (["build dashboard", "chart data extractor", "uml and software architecture visualization"].some((term) => name.includes(term))) boost -= 1200;
  }

  if (eventTableQualityIntent) {
    if (name.includes("data quality audit")) boost += 3400;
    if (["validate data", "data pipeline spec", "data analysis standard"].some((term) => name.includes(term))) boost += 620;
    if (["database schema design", "database migration plan", "dev database postgres", "build dashboard"].some((term) => name.includes(term))) boost -= 1200;
  }

  if (securityRemediationValidationIntent) {
    if (name === "validation" || name.includes("validation")) boost += 3400;
    if (["security diff scan", "track findings", "security best practices"].some((term) => name.includes(term))) boost += 520;
    if (["finding discovery", "triage finding", "deep security scan"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (huggingFaceJobsIntent) {
    if (name.includes("huggingface jobs")) boost += 3600;
    if (["hf cli", "huggingface trackio", "huggingface llm trainer"].some((term) => name.includes(term))) boost += 520;
    if (["huggingface gradio", "huggingface datasets", "huggingface vision trainer"].some((term) => name.includes(term))) boost -= 1600;
  }

  if (voiceoverTtsIntent) {
    if (name === "speech") boost += 3400;
    if (["openai docs", "dev ai llm apps"].some((term) => name.includes(term))) boost += 420;
    if (["transcribe", "transformers js", "openai agents js", "copilot sdk"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (technicalDebtRegisterIntent) {
    if (name.includes("technical debt register")) boost += 3400;
    if (["dependency audit", "code review checklist", "dev git github collaboration"].some((term) => name.includes(term))) boost += 520;
    if (["dependency conflict resolver", "changelog generator"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (presentationTemplateIntent) {
    if (name.includes("template creator")) boost += 3400;
    if (["presentations", "documents", "premium saas landing pages"].some((term) => name.includes(term))) boost += 520;
    if (["roadmap presentation", "roadmap narrative"].some((term) => name.includes(term))) boost -= 1800;
  }

  if (notionResearchSourceBankIntent) {
    if (name.includes("notion research documentation")) boost += 3400;
    if (["last 30 days research", "research protocol", "notion knowledge capture"].some((term) => name.includes(term))) boost += 520;
    if (["notion meeting intelligence", "notion spec to implementation"].some((term) => name.includes(term))) boost -= 1800;
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
    if (name.includes("react three fiber game")) boost += 3400;
    if (["three webgl game", "game playtest", "web 3d asset pipeline"].some((term) => name.includes(term))) boost += 520;
    if (name.includes("threejs data visualization")) boost -= 420;
    if (name.includes("template creator")) boost -= 1800;
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
    if (/\bmeeting\b|\bmeeting notes?\b|\bagenda\b|\bpre reads?\b/.test(normalizedQuery) && !negatedNotionMeetingIntent && name.includes("notion meeting intelligence")) boost += 960;
    if (/\bcapture\b|\bdecision\b|\bknowledge base\b/.test(normalizedQuery) && name.includes("notion knowledge capture")) boost += 420;
    if (/\bspec\b|\bimplementation\b|\bfollow up\b|\btasks?\b/.test(normalizedQuery) && name.includes("notion spec to implementation")) boost += 260;
    if (/\bresearch\b|\bsource links?\b|\bsynthesize\b/.test(normalizedQuery) && name.includes("notion research documentation")) boost += 220;
    if (/\bmeeting\b|\bagenda\b|\bpre reads?\b/.test(normalizedQuery) && !negatedNotionMeetingIntent && name.includes("notion meeting intelligence")) boost += 220;
    if (negatedNotionMeetingIntent && name.includes("notion meeting intelligence")) boost -= 960;
  }

  if (notionSpecImplementationIntent) {
    if (name.includes("notion spec to implementation")) boost += 2200;
    if (["linear", "prd template", "notion research documentation", "notion knowledge capture"].some((term) => name === term || name.includes(term))) boost += 420;
    if (["notion meeting intelligence", "gmail inbox triage"].some((term) => name.includes(term))) boost -= 1200;
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
    if (name.includes("racingsim ai ml")) boost += racingsimRuntimeIntent ? -980 : racingsimAiIntent && !negatedRacingsimAiIntent ? 860 : 260;
    if (name.includes("racingsim game dev")) boost += racingsimRuntimeIntent ? 2200 : 360;
    if (racingsimRuntimeIntent && ["game playtest", "dev performance engineering"].some((term) => name.includes(term))) boost += 420;
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

  if (framerCodeComponentIntent) {
    if (name.includes("framer code components")) boost += 2600;
    if (name === "framer" || name.includes("dev frontend react next") || name.includes("design qa")) boost += 420;
    if (["figma code connect", "figma implement design", "figma generate design", "figma use"].some((term) => name.includes(term))) boost -= 1400;
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

  if (securityFindingDiscoveryIntent) {
    if (name.includes("finding discovery")) boost += 2600;
    if (["security scan", "validation"].some((term) => name === term || name.includes(term))) boost += 420;
    if (["triage finding", "track findings"].some((term) => name.includes(term))) boost -= 1500;
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

  if (vercelQueueIntent) {
    if (name.includes("vercel queues")) boost += 2600;
    if (["vercel functions", "workflow", "env vars"].some((term) => name === term || name.includes(term))) boost += 420;
    if (name.includes("cron jobs") && !/\bcron|scheduled\b/.test(normalizedQuery)) boost -= 1500;
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

  if (signInWithVercelIntent) {
    if (name.includes("sign in with vercel")) boost += 2800;
    if (["auth", "env vars", "vercel deploy", "security best practices", "dev backend api design"].some((term) => name === term || name.includes(term))) boost += 320;
    if (name === "auth") boost -= 900;
    if (["security scan", "deep security scan"].some((term) => name.includes(term))) boost -= 520;
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

  if (capacityBoundaryIntent) {
    if (name.includes("capacity planning")) boost += 2400;
    if (["load testing plan", "slo error budget", "dev containers kubernetes", "dev performance engineering"].some((term) => name.includes(term))) boost += 520;
    if (name.includes("dev observability sre") && !/\bobservability|otel|tracing|monitoring\b/.test(normalizedQuery)) boost -= 760;
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
    if (creativeShotIntent && name.includes("creative shot")) boost += 2400;
    if (/\bproduct shot\b|\bcampaign\b/.test(normalizedQuery) && name.includes("creative production")) boost += 520;
    if (name.includes("creative positioning")) boost += 220;
    if (name.includes("creative ads explorer")) boost += /\bad concepts?\b/.test(normalizedQuery) ? 520 : 180;
  }

  if (creativeShotIntent) {
    if (name.includes("creative shot")) boost += 1800;
    if (["creative scene", "creative moodboard", "creative production"].some((term) => name.includes(term))) boost += 360;
    if (["creative offer", "creative ads explorer"].some((term) => name.includes(term)) && !/\boffer angles?\b|\bad concepts?\b/.test(normalizedQuery)) boost -= 1100;
  }

  if (docbridgeCopyIntent) {
    if (name.includes("docbridge saas copywriter")) boost += 2800;
    if (["premium saas landing pages", "premium web design", "marketing strategy and growth"].some((term) => name.includes(term))) boost += 420;
    if (["creative production", "seo and organic growth"].some((term) => name.includes(term))) boost -= 760;
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

  if (openAiDocsMigrationIntent) {
    if (name === "openai docs") boost += 2400;
    if (["dev ai llm apps", "openai agents js", "api docs writer"].some((term) => name.includes(term))) boost += 360;
    if (["chatgpt apps", "copilot sdk"].some((term) => name.includes(term))) boost -= 1300;
    if (name.includes("api docs writer") && !/\bwrite|generate|draft|document endpoints?\b/.test(normalizedQuery)) boost -= 620;
  }

  if (openAiDocsVerificationIntent) {
    if (name === "openai docs") boost += 2200;
    if (["dev ai llm apps", "openai agents js"].some((term) => name.includes(term))) boost += 320;
    if (name.includes("api docs writer") && !/\bwrite|generate|draft|author\b/.test(normalizedQuery)) boost -= 1000;
    if (["chatgpt apps", "copilot sdk"].some((term) => name.includes(term))) boost -= 1300;
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

  if (huggingFacePaperPublisherIntent) {
    if (name.includes("huggingface paper publisher")) boost += 4200;
    if (["huggingface papers", "huggingface community evals", "huggingface datasets"].some((term) => name.includes(term))) boost += 260;
    if (name.includes("huggingface datasets")) boost -= 420;
    if (["huggingface llm trainer", "huggingface gradio", "huggingface vision trainer"].some((term) => name.includes(term))) boost -= 1300;
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

  if (goRustSystemsIntent) {
    if (name.includes("dev go rust systems")) boost += 2800;
    if (["cli creator", "dev testing qa", "dev release productization"].some((term) => name.includes(term))) boost += 360;
    if (name.includes("cli creator")) boost -= 1000;
    if (["dev java dotnet services", "dev node typescript services", "dev python services"].some((term) => name.includes(term))) boost -= 1200;
  }

  if (schemaBeforeSupabaseIntent) {
    if (name.includes("database schema design")) boost += 2600;
    if (["dev database postgres", "database migration plan", "data pipeline spec"].some((term) => name.includes(term))) boost += 420;
    if (["supabase postgres best practices", "build dashboard"].some((term) => name.includes(term))) boost -= 1400;
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

export { CONCEPT_RULES, ROUTING_CONFIG_VERSION, getConfiguredSkillIntentBoost };
