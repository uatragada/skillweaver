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
const ROLE_ORDER = ["gateway", "primary", "verification", "supporting", "reference"];
const ROLE_LABELS = {
  gateway: "Gateway",
  primary: "Primary",
  verification: "Verification",
  supporting: "Supporting",
  reference: "Reference"
};

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

function RoleBadge({ role }) {
  return <span className={`role-badge role-${role}`}>{ROLE_LABELS[role] ?? role}</span>;
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

function SelectFilter({ icon: Icon, label, value, onChange, options, formatOption = (option) => option }) {
  return (
    <label className="filter-control">
      <span><Icon size={14} /> {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{formatOption(option)}</option>
        ))}
      </select>
    </label>
  );
}

function ModeToggle({ value, onChange }) {
  return (
    <div className="mode-toggle" aria-label="Navigator mode">
      <button type="button" className={value === "concepts" ? "is-active" : ""} onClick={() => onChange("concepts")}>
        <GitBranch size={15} />
        Concepts
      </button>
      <button type="button" className={value === "skills" ? "is-active" : ""} onClick={() => onChange("skills")}>
        <Search size={15} />
        Skills
      </button>
    </div>
  );
}

function GraphCapNotice({ summary }) {
  if (!summary?.edgeTruncated && !summary?.conceptEdgeTruncated) return null;
  const lines = [];
  if (summary.edgeTruncated) {
    lines.push(`${summary.edgeDroppedCount} skill links hidden after ${summary.edgeLimit}`);
  }
  if (summary.conceptEdgeTruncated) {
    lines.push(`${summary.conceptEdgeDroppedCount} concept links hidden after ${summary.conceptEdgeLimit}`);
  }

  return (
    <div className="cap-notice">
      <TriangleAlert size={16} />
      <span>{lines.join("; ")}.</span>
    </div>
  );
}

function ConceptRow({ concept, selected, onSelect }) {
  const topRefs = concept.skillRefs ?? [];
  return (
    <button className={`concept-row ${selected ? "is-selected" : ""}`} type="button" onClick={() => onSelect(concept.id)}>
      <div className="concept-row-main">
        <div className="concept-title-line">
          <strong>{concept.label}</strong>
          <span className="concept-count">{concept.skillCount} skills</span>
        </div>
        <p>{concept.description}</p>
        <div className="tag-row">
          {concept.domains.slice(0, 4).map((domain) => <span key={domain}>{domain}</span>)}
          {concept.tools.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}
        </div>
        <div className="concept-skill-strip">
          {topRefs.slice(0, 4).map((ref) => (
            <span key={`${concept.id}-${ref.skillId}`}>
              {ref.name}
            </span>
          ))}
        </div>
      </div>
      <div className="skill-row-meta">
        <span>{concept.score ? Math.round(concept.score) : 0}</span>
        <ArrowRight size={16} />
      </div>
    </button>
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
    <section className="side-panel">
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

function ConceptLinksPanel({ concept, onSelect }) {
  const related = concept?.relatedConcepts ?? [];
  return (
    <section className="side-panel">
      <div className="section-heading">
        <GitBranch size={16} />
        <h2>Concept Links</h2>
      </div>
      <div className="related-list">
        {related.length ? related.map((entry) => (
          <button key={`${entry.id}-${entry.edge.type}`} type="button" onClick={() => onSelect(entry.id)}>
            <span>{entry.label}</span>
            <small>{entry.edge.label} · {entry.edge.reason}</small>
          </button>
        )) : <p className="muted">No neighboring concept selected.</p>}
      </div>
    </section>
  );
}

function SkillRefButton({ refEntry, onSelect }) {
  return (
    <button className="skill-ref-button" type="button" onClick={() => onSelect(refEntry.skillId)}>
      <div>
        <strong>{refEntry.name}</strong>
        <small>{refEntry.reason}</small>
      </div>
      <div className="skill-ref-meta">
        <RoleBadge role={refEntry.role} />
        <SourceBadge value={refEntry.sourceType} />
      </div>
    </button>
  );
}

function ConceptInspector({ concept, onSelectSkill, onSelectConcept }) {
  if (!concept) {
    return (
      <aside className="inspector">
        <EmptyState title="Select a concept" detail="Search for a task or pick a concept node to inspect referenced skills." />
      </aside>
    );
  }

  return (
    <aside className="inspector">
      <div className="inspector-header">
        <div>
          <span className="eyeless-label">concept node</span>
          <h2>{concept.label}</h2>
        </div>
        <div className="concept-score">{concept.skillCount}</div>
      </div>

      <p className="skill-description">{concept.description}</p>

      <div className="concept-meta-grid">
        <div>
          <strong>{concept.relatedConcepts?.length ?? 0}</strong>
          <span>links</span>
        </div>
        <div>
          <strong>{concept.skillCount}</strong>
          <span>skills</span>
        </div>
      </div>

      <div className="inspector-section">
        <h3>Trigger Phrases</h3>
        <div className="trigger-list">
          {(concept.triggers ?? []).slice(0, 8).map((trigger) => <span key={trigger}>{trigger}</span>)}
        </div>
      </div>

      <div className="inspector-section">
        <h3>Referenced Skills</h3>
        <div className="role-stack">
          {ROLE_ORDER.map((role) => {
            const refs = (concept.skillRefs ?? []).filter((entry) => entry.role === role);
            if (!refs.length) return null;
            return (
              <div className="role-group" key={role}>
                <div className="role-group-heading">
                  <RoleBadge role={role} />
                  <span>{refs.length}</span>
                </div>
                {refs.map((entry) => (
                  <SkillRefButton key={`${role}-${entry.skillId}`} refEntry={entry} onSelect={onSelectSkill} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="inspector-section">
        <h3>Related Concepts</h3>
        <div className="related-list">
          {(concept.relatedConcepts ?? []).length ? concept.relatedConcepts.map((entry) => (
            <button key={`${entry.id}-${entry.edge.type}`} type="button" onClick={() => onSelectConcept(entry.id)}>
              <span>{entry.label}</span>
              <small>{entry.edge.label} · {entry.edge.type}</small>
            </button>
          )) : <p className="muted">No relationships found yet.</p>}
        </div>
      </div>
    </aside>
  );
}

function SkillInspector({ skill, onSelectRelated }) {
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

function Inspector({ mode, concept, skill, onSelectConcept, onSelectSkill }) {
  if (mode === "concepts") {
    return <ConceptInspector concept={concept} onSelectConcept={onSelectConcept} onSelectSkill={onSelectSkill} />;
  }

  return <SkillInspector skill={skill} onSelectRelated={onSelectSkill} />;
}

function App() {
  const [summary, setSummary] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [query, setQuery] = useState("turn a Figma design into a React app");
  const [filters, setFilters] = useState({ domain: "", sourceType: "", namespace: "", root: "" });
  const [mode, setMode] = useState("concepts");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [error, setError] = useState("");

  const queryString = useMemo(() => buildQuery({ q: query, ...filters }), [query, filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      apiGet(`/api/concepts${queryString}`),
      apiGet(`/api/skills${queryString}`),
      apiGet(`/api/workflow${queryString}`)
    ])
      .then(([conceptPayload, skillPayload, workflowPayload]) => {
        if (cancelled) return;
        setSummary(conceptPayload.summary);
        setConcepts(conceptPayload.concepts);
        setSkills(skillPayload.skills);
        setWorkflow(workflowPayload);
        setSelectedConceptId((current) =>
          conceptPayload.concepts.find((concept) => concept.id === current)?.id
          ?? conceptPayload.concepts[0]?.id
          ?? null
        );
        setSelectedSkillId((current) =>
          skillPayload.skills.find((skill) => skill.id === current)?.id
          ?? skillPayload.skills[0]?.id
          ?? null
        );
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
  }, [queryString, refreshVersion]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedConceptId) {
      setSelectedConcept(null);
      return undefined;
    }
    apiGet(`/api/concepts/${selectedConceptId}`)
      .then((payload) => {
        if (!cancelled) setSelectedConcept(payload.concept);
      })
      .catch(() => {
        if (!cancelled) setSelectedConcept(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedConceptId]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedSkillId) {
      setSelectedSkill(null);
      return undefined;
    }
    apiGet(`/api/skills/${selectedSkillId}`)
      .then((payload) => {
        if (!cancelled) setSelectedSkill(payload.skill);
      })
      .catch(() => {
        if (!cancelled) setSelectedSkill(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSkillId]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const selectConcept = (id) => {
    setSelectedConceptId(id);
    setMode("concepts");
  };

  const selectSkill = (id) => {
    setSelectedSkillId(id);
    setMode("skills");
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      await apiPost("/api/refresh");
      setRefreshVersion((version) => version + 1);
    } finally {
      setRefreshing(false);
    }
  };

  const resultCount = mode === "concepts" ? concepts.length : skills.length;

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
          <Stat label="concepts" value={summary?.conceptCount ?? "?"} />
          <Stat label="skills" value={summary?.skillCount ?? "?"} />
          <Stat label="links" value={summary?.conceptEdgeCount ?? "?"} />
          <Stat label="warnings" value={summary?.warningCount ?? "?"} />
        </div>

        <GraphCapNotice summary={summary} />

        <div className="filter-stack">
          <SelectFilter icon={Filter} label="Domain" value={filters.domain} onChange={(value) => updateFilter("domain", value)} options={summary?.domains ?? []} />
          <SelectFilter icon={BookOpen} label="Source" value={filters.sourceType} onChange={(value) => updateFilter("sourceType", value)} options={summary?.sourceTypes ?? []} />
          <SelectFilter icon={FileCode2} label="Root" value={filters.root} onChange={(value) => updateFilter("root", value)} options={summary?.roots ?? []} formatOption={compactPath} />
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
          <ModeToggle value={mode} onChange={setMode} />
          <div className="root-chip">{summary?.roots?.length ?? 0} roots indexed</div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="workspace-grid">
          <section className="results-panel">
            <div className="section-heading results-heading">
              {mode === "concepts" ? <GitBranch size={16} /> : <Search size={16} />}
              <h2>{mode === "concepts" ? "Concept Nodes" : "Ranked Skills"}</h2>
              <span>{loading ? "Scanning..." : `${resultCount} shown`}</span>
            </div>

            {mode === "concepts" ? (
              <div className="skill-list">
                {concepts.length ? concepts.map((concept) => (
                  <ConceptRow key={concept.id} concept={concept} selected={concept.id === selectedConceptId} onSelect={selectConcept} />
                )) : <EmptyState title="No matching concepts" detail="Try a broader task phrase or clear the filters." />}
              </div>
            ) : (
              <div className="skill-list">
                {skills.length ? skills.map((skill) => (
                  <SkillRow key={skill.id} skill={skill} selected={skill.id === selectedSkillId} onSelect={selectSkill} />
                )) : <EmptyState title="No matching skills" detail="Try a broader task phrase or clear the filters." />}
              </div>
            )}
          </section>

          <div className="side-stack">
            <WorkflowPanel workflow={workflow} onSelect={selectSkill} />
            {mode === "concepts" ? <ConceptLinksPanel concept={selectedConcept} onSelect={selectConcept} /> : null}
          </div>
        </div>
      </section>

      <Inspector
        mode={mode}
        concept={selectedConcept}
        skill={selectedSkill}
        onSelectConcept={selectConcept}
        onSelectSkill={selectSkill}
      />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
