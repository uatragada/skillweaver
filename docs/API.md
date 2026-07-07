# API Reference

SkillWeaver serves a local JSON API from `http://127.0.0.1:3777`.

The API is designed for local tools and agents. It exposes the current
in-memory index, so responses reflect the configured skill roots on the machine
running the server.

## Health

```http
GET /api/health
```

Returns server status.

## Refresh

```http
POST /api/refresh
```

Rebuilds the skill index from configured roots.

## List Skills

```http
GET /api/skills?q=frontend%20dashboard
GET /api/skills?q=frontend%20dashboard&mode=skills
```

Returns ranked skills plus a summary object. By default this uses the V2
concept-aided route. Passing `mode=skills` returns the raw skill-level baseline.

Supported filters:

- `q`: task wording or search text.
- `domain`: inferred domain tag.
- `sourceType`: `user`, `system`, `plugin`, or `external`.
- `namespace`: skill namespace or plugin prefix.
- `mode`: default concept route, or `skills` for the skill-level baseline.

## Skill Detail

```http
GET /api/skills/:id
```

Returns a single skill with parsed metadata, excerpt, tags, triggers, resources,
warnings, source path, and relationship data.

## Related Skills

```http
GET /api/skills/:id/related
```

Returns relationship edges for a skill. Edge types include shared namespace,
shared domain, shared tool, mentions, and concept evidence.

## List Concepts

```http
GET /api/concepts?q=frontend%20dashboard
```

Returns concept nodes ranked against the query and filters. Concepts are
high-level work areas that reference role-tagged skills.

Supported filters:

- `q`: task wording or concept search text.
- `domain`: inferred domain tag.
- `sourceType`: source type of referenced skills.
- `namespace`: namespace of referenced skills.

## Concept Detail

```http
GET /api/concepts/:id
```

Returns the concept description, triggers, domains, tools, role counts,
role-tagged skill references, and related concept nodes.

## Related Concepts

```http
GET /api/concepts/:id/related
```

Returns adjacent concept nodes and the edge evidence connecting them.

## Recommended Workflow

```http
GET /api/workflow?q=frontend%20dashboard
GET /api/workflow?q=frontend%20dashboard&mode=skills
```

Returns a compact workflow for the query:

- `primary`: best skill candidate.
- `supporting`: supporting skill candidates.
- `steps`: ordered primary/supporting steps with reasons.
- `concept`: top concept when the V2 route provides one.

Passing `mode=skills` returns the skill-level workflow baseline for comparison.

## Local-First Notes

- The API does not require authentication because it is intended for local use.
- Do not expose the server to an untrusted network without adding an access
  control layer.
- Absolute source paths can appear in responses because provenance is part of
  the local debugging experience.
