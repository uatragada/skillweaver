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
  return {
    scannedAt: Date.now(),
    roots: normalizedRoots,
    skills,
    edges: buildEdges(skills)
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
  searchSkills,
  recommendWorkflow,
  getRelatedSkills,
  serializeSkillDetail,
  summarizeIndex,
  scanSkillRoots
};
