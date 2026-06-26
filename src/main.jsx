import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Copy,
  FileCode2,
  Filter,
  GitBranch,
  LocateFixed,
  RefreshCw,
  Search,
  Sparkles,
  TriangleAlert
} from "lucide-react";
import "./styles.css";

const API_BASE = "";

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function apiPost(path) {
  const response = await fetch(`${API_BASE}${path}`, { method: "POST" });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function buildQuery(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  const value = query.toString();
  return value ? `?${value}` : "";
}

function compactPath(path) {
  if (!path) return "";
  const normalized = path.replaceAll("\\", "/");
  const parts = normalized.split("/");
  if (parts.length <= 4) return path;
  return `${parts[0]}/.../${parts.slice(-3).join("/")}`;
}

function SourceBadge({ value }) {
  return <span className={`source-badge source-${value}`}>{value}</span>;
}

function EmptyState({ title, detail }) {
  return (
    <div className="empty-state">
      <LocateFixed size={28} />
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SelectFilter({ icon: Icon, label, value, onChange, options }) {
  return (
    <label className="filter-control">
      <span><Icon size={14} /> {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SkillRow({ skill, selected, onSelect }) {
  return (
    <button className={`skill-row ${selected ? "is-selected" : ""}`} type="button" onClick={() => onSelect(skill.id)}>
      <div className="skill-row-main">
        <div className="skill-title-line">
          <strong>{skill.name}</strong>
          <SourceBadge value={skill.sourceType} />
          {skill.namespace ? <span className="namespace-pill">{skill.namespace}</span> : null}
        </div>
        <p>{skill.description || skill.excerpt || "No description found."}</p>
        <div className="tag-row">
          {skill.domains.slice(0, 4).map((domain) => <span key={domain}>{domain}</span>)}
          {skill.tools.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}
        </div>
      </div>
      <div className="skill-row-meta">
        <span>{skill.score ? Math.round(skill.score) : 0}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

function WorkflowPanel({ workflow, onSelect }) {
  const steps = workflow?.steps ?? [];
  return (
    <section className="workflow-panel">
      <div className="section-heading">
        <Sparkles size={16} />
        <h2>Suggested Workflow</h2>
      </div>
      {steps.length ? (
        <ol className="workflow-list">
          {steps.map((step) => (
            <li key={`${step.order}-${step.skillId}`}>
              <button type="button" onClick={() => onSelect(step.skillId)}>
                <span>{step.order}</span>
                <strong>{step.name}</strong>
                <small>{step.reason}</small>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="muted">Type a task to generate a compact skill-loading path.</p>
      )}
    </section>
  );
}

function Inspector({ skill, onSelectRelated }) {
  const [copied, setCopied] = useState(false);

  if (!skill) {
    return (
      <aside className="inspector">
        <EmptyState title="Select a skill" detail="Search for a task or pick a result to inspect triggers, resources, and related skills." />
      </aside>
    );
  }

  const copyPath = async () => {
    await navigator.clipboard.writeText(skill.path);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const resourceEntries = Object.entries(skill.resources ?? {})
    .filter(([, files]) => files?.length);

  return (
    <aside className="inspector">
      <div className="inspector-header">
        <div>
          <span className="eyeless-label">{skill.sourceType}</span>
          <h2>{skill.name}</h2>
        </div>
        <button className="icon-button" type="button" onClick={copyPath} title="Copy SKILL.md path">
          {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
        </button>
      </div>

      <p className="skill-description">{skill.description || "No frontmatter description found."}</p>

      <div className="path-box">
        <FileCode2 size={15} />
        <span title={skill.path}>{compactPath(skill.path)}</span>
      </div>

      <div className="inspector-section">
        <h3>Trigger Phrases</h3>
        <div className="trigger-list">
          {(skill.triggers ?? []).slice(0, 8).map((trigger) => <span key={trigger}>{trigger}</span>)}
        </div>
      </div>

      {resourceEntries.length ? (
        <div className="inspector-section">
          <h3>Resources</h3>
          <div className="resource-list">
            {resourceEntries.map(([kind, files]) => (
              <div key={kind}>
                <strong>{kind}</strong>
                <span>{files.length} file{files.length === 1 ? "" : "s"}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="inspector-section">
        <h3>Related Skills</h3>
        <div className="related-list">
          {(skill.related ?? []).length ? skill.related.slice(0, 8).map((entry) => (
            <button key={`${entry.id}-${entry.edge.type}`} type="button" onClick={() => onSelectRelated(entry.id)}>
              <span>{entry.name}</span>
              <small>{entry.edge.label} · {entry.edge.type}</small>
            </button>
          )) : <p className="muted">No relationships found yet.</p>}
        </div>
      </div>

      {skill.warnings?.length ? (
        <div className="warning-box">
          <TriangleAlert size={16} />
          <span>{skill.warnings.join(" ")}</span>
        </div>
      ) : null}
    </aside>
  );
}

function App() {
  const [summary, setSummary] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [query, setQuery] = useState("fix failing github ci");
  const [filters, setFilters] = useState({ domain: "", sourceType: "", namespace: "", root: "" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => buildQuery({ q: query, ...filters }), [query, filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      apiGet(`/api/skills${queryString}`),
      apiGet(`/api/workflow${queryString}`)
    ])
      .then(([skillPayload, workflowPayload]) => {
        if (cancelled) return;
        setSummary(skillPayload.summary);
        setSkills(skillPayload.skills);
        setWorkflow(workflowPayload);
        const nextSelected = skillPayload.skills.find((skill) => skill.id === selectedId)?.id
          ?? skillPayload.skills[0]?.id
          ?? null;
        setSelectedId(nextSelected);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedId) {
      setSelectedSkill(null);
      return undefined;
    }
    apiGet(`/api/skills/${selectedId}`)
      .then((payload) => {
        if (!cancelled) setSelectedSkill(payload.skill);
      })
      .catch(() => {
        if (!cancelled) setSelectedSkill(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      await apiPost("/api/refresh");
      const payload = await apiGet(`/api/skills${queryString}`);
      setSummary(payload.summary);
      setSkills(payload.skills);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div className="brand-block">
          <div className="brand-mark"><Boxes size={22} /></div>
          <div>
            <h1>SkillWeaver</h1>
            <span>Codex skill navigator</span>
          </div>
        </div>

        <div className="stats-grid">
          <Stat label="skills" value={summary?.skillCount ?? "?"} />
          <Stat label="edges" value={summary?.edgeCount ?? "?"} />
          <Stat label="warnings" value={summary?.warningCount ?? "?"} />
        </div>

        <div className="filter-stack">
          <SelectFilter icon={Filter} label="Domain" value={filters.domain} onChange={(value) => updateFilter("domain", value)} options={summary?.domains ?? []} />
          <SelectFilter icon={BookOpen} label="Source" value={filters.sourceType} onChange={(value) => updateFilter("sourceType", value)} options={summary?.sourceTypes ?? []} />
          <SelectFilter icon={GitBranch} label="Namespace" value={filters.namespace} onChange={(value) => updateFilter("namespace", value)} options={summary?.namespaces ?? []} />
        </div>

        <button className="refresh-button" type="button" onClick={refresh} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? "spin" : ""} />
          Refresh Index
        </button>
      </aside>

      <section className="workspace">
        <header className="search-header">
          <div className="search-box">
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are you trying to do?"
              aria-label="Skill search query"
            />
          </div>
          <div className="root-chip">{summary?.roots?.length ?? 0} roots indexed</div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="workspace-grid">
          <section className="results-panel">
            <div className="section-heading results-heading">
              <Search size={16} />
              <h2>Ranked Skills</h2>
              <span>{loading ? "Scanning..." : `${skills.length} shown`}</span>
            </div>
            <div className="skill-list">
              {skills.length ? skills.map((skill) => (
                <SkillRow key={skill.id} skill={skill} selected={skill.id === selectedId} onSelect={setSelectedId} />
              )) : <EmptyState title="No matching skills" detail="Try a broader task phrase or clear the filters." />}
            </div>
          </section>

          <WorkflowPanel workflow={workflow} onSelect={setSelectedId} />
        </div>
      </section>

      <Inspector skill={selectedSkill} onSelectRelated={setSelectedId} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

