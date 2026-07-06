# SkillWeaver V2 Active Acceptance Benchmark

Generated: 2026-07-06T20:56:50.537Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1783371410537,"command":"npm run benchmark:skills","suite":{"id":"acceptance","label":"Active Acceptance","gatesAcceptance":true},"git":{"commit":"d044c7c71ab42e5a7405c287576ea03745f37a1d","dirty":true,"dirtyPaths":[".github/","benchmarks/skill-routing-cases.json","benchmarks/skill-routing-clean-holdout-v3.json","benchmarks/skill-routing-clean-holdout-v4.json","docs/ROUTING-EVAL-METHODOLOGY.md","docs/SKILL-USE-CLEAN-HOLDOUT-V2.md","docs/SKILL-USE-CLEAN-HOLDOUT-V5.md","docs/SKILL-USE-FRESH.md","docs/SKILL-USE-FROZEN-HOLDOUT.md","docs/SKILL-USE-GAINS.md","docs/SKILL-USE-HOLDOUT.md","scripts/benchmark-skill-routing.mjs","server/concept-routing-config.js","server/index.js","server/skill-scanner.js","src/main.jsx","src/styles.css","tests/api.test.js","tests/skill-scanner.test.js"]},"invalidatingDirtyPaths":["benchmarks/skill-routing-cases.json","scripts/benchmark-skill-routing.mjs","server/concept-routing-config.js","server/skill-scanner.js"],"cases":{"count":78,"sha256":"sha256:987980761a0867f6609b0d8dd8c144ea25922f5d752a03807274d513099a9a54"},"corpus":{"skills":429,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":7,"sha256":"sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c"},"inputs":{"cases":"sha256:987980761a0867f6609b0d8dd8c144ea25922f5d752a03807274d513099a9a54","routingConfig":"sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f","scanner":"sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039","benchmarkScript":"sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44","corpus":"sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c"},"acceptance":{"ok":true,"failures":[]},"snapshotFingerprint":"sha256:9454d38e896f7a7286c1175d9e12917553e52dc2e2d2e0421c7ee4853cda0ae5"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills`
- Suite: Active Acceptance
- Acceptance gate: yes
- Git commit at generation: `d044c7c71ab42e5a7405c287576ea03745f37a1d`
- Git dirty: yes
- Invalidating dirty paths: `benchmarks/skill-routing-cases.json`, `scripts/benchmark-skill-routing.mjs`, `server/concept-routing-config.js`, `server/skill-scanner.js`
- Case hash: `sha256:987980761a0867f6609b0d8dd8c144ea25922f5d752a03807274d513099a9a54`
- Routing config hash: `sha256:9ec7f5b2de88f53d2ed85cd77e18f60e1cd57db500b0c039f9e2a168b487497f`
- Scanner hash: `sha256:cae8afc744ec845a54947a72553d780632c76f3bc7f8aaaf1b952e36976c6039`
- Benchmark script hash: `sha256:0910853904f8cf2dfc1fe02ef98f2aeea1dad6f2836d05e53d325f1b012ddb44`
- Corpus hash: `sha256:287db3b7cbe5b96875f99de2fb93c42fa1f20a26b0bd556f7ebee13a49b5060c`
- Snapshot fingerprint: `sha256:9454d38e896f7a7286c1175d9e12917553e52dc2e2d2e0421c7ee4853cda0ae5`
- Acceptance: pass

## Corpus

- Skills indexed: 429
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 7
- Benchmark cases: 78

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 74.4 | 76.4 | 99.5 | +25.1 pts | +23.1 pts |
| Primary hit@1 | 73.1% | 75.6% | 100.0% | +26.9 pp | +24.4 pp |
| Expected skill in top/workflow 5 | 93.6% | 93.6% | 100.0% | +6.4 pp | +6.4 pp |
| Mean reciprocal rank | 0.814 | 0.846 | 1.000 | +0.186 | +0.154 |
| Support-skill coverage@5 | 51.1% | 52.8% | 97.6% | +46.6 pp | +44.9 pp |
| Support precision@5, exploratory | 18.6% | 20.7% | 39.5% | +20.9 pp | +18.8 pp |
| Forbidden primary rate, lower is better | 3.8% | 5.1% | 0.0% | -3.8 pp better | -5.1 pp better |
| Confusable wrong primary rate, lower is better | 20.5% | 17.9% | 0.0% | -20.5 pp better | -17.9 pp better |
| Mean candidates to expected skill, lower is better | 2.2 | 1.9 | 1.0 | -1.2 candidates better | -0.9 candidates better |

## Claim Scope

This report supports the claim that V2 is stronger on the current 78-case active acceptance suite: 78/78 primary hit@1, 78/78 expected primary in top/workflow five, 0/78 forbidden primaries, and 4/78 support-miss cases. It does not prove universal routing correctness or unseen cross-domain generalization.

V2 raw counts: primary hit@1 78/78; expected primary top/workflow-five 78/78; forbidden primary 0/78; confusable wrong primary 0/78; support-miss cases 4/78.

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 429 skills to 5 candidates, a 98.8% candidate reduction per task.
Support precision is exploratory: it estimates how much of the non-primary top/workflow-five set is expected support, while support coverage measures whether expected helpers are present at all.

## Quality by Domain

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend experience | 12 | 100.0 | 100.0% | 100.0% | 100.0% | 45.0% | 0.0% | 0.0% | 0/12 | +40.9 pts | +37.7 pts |
| Repo collaboration | 7 | 100.0 | 100.0% | 100.0% | 100.0% | 32.1% | 0.0% | 0.0% | 0/7 | +17.1 pts | +11.4 pts |
| Observability and reliability | 6 | 100.0 | 100.0% | 100.0% | 100.0% | 45.8% | 0.0% | 0.0% | 0/6 | +16.7 pts | +5.0 pts |
| Documents and publishing | 5 | 100.0 | 100.0% | 100.0% | 100.0% | 30.0% | 0.0% | 0.0% | 0/5 | +8.0 pts | +8.0 pts |
| Security and risk | 5 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/5 | +27.2 pts | +39.9 pts |
| Skill tooling | 5 | 98.0 | 100.0% | 100.0% | 90.0% | 30.0% | 0.0% | 0.0% | 1/5 | +49.8 pts | +61.4 pts |
| AI agent apps | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 43.8% | 0.0% | 0.0% | 0/4 | +23.3 pts | +5.0 pts |
| Data analytics | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/4 | +46.7 pts | +34.8 pts |
| Hugging Face ML | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/4 | +2.5 pts | +17.5 pts |
| Marketing, growth, and creative | 4 | 93.3 | 100.0% | 100.0% | 66.7% | 31.3% | 0.0% | 0.0% | 3/4 | +21.9 pts | +18.2 pts |
| Platform delivery | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 43.8% | 0.0% | 0.0% | 0/4 | +22.5 pts | +22.5 pts |
| Product, research, and planning | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/4 | +35.8 pts | +22.5 pts |
| Backend services | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/3 | +33.3 pts | +30.0 pts |
| Database and data engineering | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +3.3 pts | +3.3 pts |
| Games and simulation | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +13.3 pts | +10.0 pts |
| Infrastructure platforms | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +20.0 pts | +20.0 pts |
| Communications and knowledge | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/2 | 0.0 pts | +10.0 pts |

## Quality by Expected Concept

| Slice | Cases | V2 quality | V2 hit@1 | V2 top/workflow 5 | V2 support coverage@5 | V2 support precision@5 | V2 forbidden primary | V2 confusable wrong primary | V2 support-miss cases | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frontend implementation | 6 | 100.0 | 100.0% | 100.0% | 100.0% | 56.3% | 0.0% | 0.0% | 0/6 | +33.5 pts | +41.4 pts |
| Observability and reliability | 6 | 100.0 | 100.0% | 100.0% | 100.0% | 45.8% | 0.0% | 0.0% | 0/6 | +16.7 pts | +5.0 pts |
| Product planning | 5 | 100.0 | 100.0% | 100.0% | 100.0% | 40.0% | 0.0% | 0.0% | 0/5 | +28.7 pts | +22.0 pts |
| Security review | 5 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/5 | +27.2 pts | +39.9 pts |
| Skill authoring | 5 | 98.0 | 100.0% | 100.0% | 90.0% | 30.0% | 0.0% | 0.0% | 1/5 | +49.8 pts | +61.4 pts |
| Agent and LLM apps | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 43.8% | 0.0% | 0.0% | 0/4 | +23.3 pts | +5.0 pts |
| Data dashboards and reports | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/4 | +46.7 pts | +34.8 pts |
| Documents and PDFs | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 31.3% | 0.0% | 0.0% | 0/4 | +10.0 pts | +10.0 pts |
| Hugging Face ML | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/4 | +2.5 pts | +17.5 pts |
| Marketing growth | 4 | 93.3 | 100.0% | 100.0% | 66.7% | 31.3% | 0.0% | 0.0% | 3/4 | +21.9 pts | +18.2 pts |
| Repository operations | 4 | 100.0 | 100.0% | 100.0% | 100.0% | 31.3% | 0.0% | 0.0% | 0/4 | +10.0 pts | +15.0 pts |
| Backend APIs and services | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/3 | +33.3 pts | +30.0 pts |
| Browser verification | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 33.3% | 0.0% | 0.0% | 0/3 | +31.1 pts | +47.8 pts |
| Databases and data engineering | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +3.3 pts | +3.3 pts |
| Figma design handoff | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +65.3 pts | +20.0 pts |
| Game development | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +13.3 pts | +10.0 pts |
| GitHub PR repair | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 33.3% | 0.0% | 0.0% | 0/3 | +26.7 pts | +6.7 pts |
| Infrastructure and platforms | 3 | 100.0 | 100.0% | 100.0% | 100.0% | 41.7% | 0.0% | 0.0% | 0/3 | +20.0 pts | +20.0 pts |
| Cloudflare workers | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 37.5% | 0.0% | 0.0% | 0/2 | +30.0 pts | +30.0 pts |
| Deployment and release | 2 | 100.0 | 100.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0/2 | +15.0 pts | +15.0 pts |
| Email triage | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |
| Presentations | 1 | 100.0 | 100.0% | 100.0% | 100.0% | 25.0% | 0.0% | 0.0% | 0/1 | 0.0 pts | 0.0 pts |

## Per-Case Results

| Case | Domain | Expected concept | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| frontend-dashboard | Frontend experience | Frontend implementation | frontend-app-builder | frontend-app-builder / 1 | frontend-app-builder / 1 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> frontend-testing-debugging -> dev-frontend-react-next -> playwright-interactive -> playwright |
| frontend-regression | Frontend experience | Frontend implementation | frontend-testing-debugging | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | Frontend implementation | frontend-testing-debugging -> dev-frontend-react-next -> dev-frontend-accessibility-css -> playwright-interactive -> playwright |
| github-ci | Repo collaboration | GitHub PR repair | gh-fix-ci, gh-address-comments | github / 2 | gh-address-comments / 1 | gh-fix-ci / 1 | GitHub PR repair | gh-fix-ci -> gh-address-comments -> dev-testing-qa -> dev-devops-ci-cd -> triage-finding |
| github-comments | Repo collaboration | GitHub PR repair | gh-address-comments | gh-address-comments / 1 | gh-address-comments / 1 | gh-address-comments / 1 | GitHub PR repair | gh-address-comments -> dev-git-github-collaboration -> gh-fix-ci -> dependency-audit -> track-findings |
| figma-use-implement | Frontend experience | Figma design handoff | figma-use | figma-implement-motion / 5 | figma-use / 1 | figma-use / 1 | Figma design handoff | figma-use -> figma-use-motion -> figma-implement-design -> figma-implement-motion -> figma-code-connect-components |
| figma-library | Frontend experience | Figma design handoff | figma-generate-library | figma-generate-diagram / 4 | figma-generate-design / 1 | figma-generate-library / 1 | Figma design handoff | figma-generate-library -> figma-use -> figma-generate-design -> figma-component-audit -> figma-create-design-system-rules |
| data-dashboard | Data analytics | Data dashboards and reports | build-dashboard | create-data-context / 6 | analyze-data-quality / 25 | build-dashboard / 1 | Data dashboards and reports | build-dashboard -> data-visualization -> testing-data-visualizations -> visualize-data -> kpi-reporting |
| kpi-report | Data analytics | Data dashboards and reports | kpi-reporting, build-report | build-report / 1 | kpi-reporting / 1 | kpi-reporting / 1 | Data dashboards and reports | kpi-reporting -> build-report -> visualize-data -> data-visualization -> testing-data-visualizations |
| data-quality | Data analytics | Data dashboards and reports | analyze-data-quality, data-quality-audit | data-quality-audit / 1 | data-quality-audit / 1 | data-quality-audit / 1 | Skill ranking anchor | data-quality-audit -> data-analysis-standard -> data-pipeline-spec -> data-visualization -> dev-data-engineering |
| security-scan | Security and risk | Security review | security-scan, deep-security-scan | skill-security-auditor / 5 | security-threat-model / 5 | deep-security-scan / 1 | Security review | deep-security-scan -> security-scan -> attack-path-analysis -> dependency-audit -> dev-security-engineering |
| attack-path | Security and risk | Security review | attack-path-analysis | security-threat-model / 2 | security-threat-model / 3 | attack-path-analysis / 1 | Security review | attack-path-analysis -> security-threat-model -> deep-security-scan -> security-ownership-map -> web-perf |
| vercel-deploy | Platform delivery | Deployment and release | deployments-cicd, vercel-deploy, vercel-api | deployments-cicd / 1 | vercel-api / 1 | vercel-api / 1 | Deployment and release | vercel-api -> deployments-cicd -> vercel-deploy -> env-vars -> agent-browser-verify |
| cloudflare-worker | Platform delivery | Cloudflare workers | wrangler, workers-best-practices | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare / 2 | wrangler / 1 | Cloudflare workers | wrangler -> workers-best-practices -> cloudflare-deploy -> durable-objects -> building-mcp-server-on-cloudflare |
| skill-create | Skill tooling | Skill authoring | skill-creator | skill-creator / 1 | hatch-pet / 2 | skill-creator / 1 | Skill authoring | skill-creator -> dev-documentation-systems -> skill-security-auditor -> skillweaver -> hatch-pet |
| skillweaver-self | Skill tooling | Skill authoring | skillweaver | skillweaver / 1 | skillweaver / 1 | skillweaver / 1 | Skill authoring | skillweaver -> skill-creator -> skill-security-auditor -> skill-installer -> cli-creator |
| pdf-extract | Documents and publishing | Documents and PDFs | pdf | pdf / 1 | pdf / 1 | pdf / 1 | Documents and PDFs | pdf -> reports-pdfs-and-slide-automation -> resume-cover-letter-tailor -> documents -> latex-doctor |
| spreadsheet-analysis | Data analytics | Data dashboards and reports | Spreadsheets | analyze-data-quality / 2 | Spreadsheets / 1 | Spreadsheets / 1 | Data dashboards and reports | Spreadsheets -> data-analysis-standard -> chart-data-extractor -> analyze-data-quality -> product-business-analysis |
| presentation-deck | Documents and publishing | Presentations | Presentations, roadmap-presentation | roadmap-presentation / 1 | roadmap-presentation / 1 | Presentations / 1 | Presentations | Presentations -> roadmap-presentation -> template-creator -> roadmap-narrative -> reports-pdfs-and-slide-automation |
| hf-train | Hugging Face ML | Hugging Face ML | huggingface-llm-trainer, huggingface-datasets | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | Hugging Face ML | huggingface-llm-trainer -> huggingface-datasets -> huggingface-community-evals -> huggingface-vision-trainer -> huggingface-paper-publisher |
| hf-dataset | Hugging Face ML | Hugging Face ML | huggingface-datasets | huggingface-datasets / 1 | huggingface-datasets / 1 | huggingface-datasets / 1 | Hugging Face ML | huggingface-datasets -> huggingface-community-evals -> huggingface-paper-publisher -> hf-cli -> huggingface-papers |
| gmail-triage | Communications and knowledge | Email triage | gmail, gmail-inbox-triage | gmail-inbox-triage / 1 | gmail / 1 | gmail-inbox-triage / 1 | Email triage | gmail-inbox-triage -> gmail -> email-triage -> triage-finding -> investigation-mode |
| phaser-game | Games and simulation | Game development | phaser-2d-game | phaser-2d-game / 1 | phaser-2d-game / 1 | phaser-2d-game / 1 | Game development | phaser-2d-game -> game-playtest -> game-studio -> three-webgl-game -> web-game-foundations |
| three-game | Games and simulation | Game development | three-webgl-game | three-webgl-game / 1 | three-webgl-game / 1 | three-webgl-game / 1 | Game development | three-webgl-game -> web-3d-asset-pipeline -> game-playtest -> racingsim-game-dev -> react-three-fiber-game |
| adr | Repo collaboration | Repository operations | architecture-decision-record | architecture-decision-record / 1 | architecture-decision-record / 1 | architecture-decision-record / 1 | Skill ranking anchor | architecture-decision-record -> uml-and-software-architecture-visualization -> dev-architecture-review -> security-threat-model -> dev-backend-api-design |
| cro-reporting | Marketing, growth, and creative | Marketing growth | kpi-reporting | audit / 9 | audit / 5 | kpi-reporting / 1 | Marketing growth | kpi-reporting -> data-analysis-standard -> scrollytelling-and-parallax-data-visualization -> docbridge-saas-copywriter -> creative-shot |
| linear-planning | Product, research, and planning | Product planning | linear | linear / 1 | linear / 1 | linear / 1 | Product planning | linear -> roadmap-narrative -> ux-research-plan -> product-launch-checklist -> product-business-analysis |
| openai-docs | AI agent apps | Agent and LLM apps | openai-docs | openai-docs / 1 | openai-docs / 1 | openai-docs / 1 | Agent and LLM apps | openai-docs -> openai-agents-js -> dev-ai-llm-apps -> speech -> dev-frontend-react-next |
| openai-agents | AI agent apps | Agent and LLM apps | openai-agents-js | openai-agents-js / 1 | openai-agents-js / 1 | openai-agents-js / 1 | Skill ranking anchor | openai-agents-js -> dev-ai-llm-apps -> agents-sdk -> openai-docs -> chatgpt-apps |
| browser-qa | Frontend experience | Browser verification | playwright, frontend-testing-debugging | control-in-app-browser / 3 | control-in-app-browser / 3 | frontend-testing-debugging / 1 | Browser verification | frontend-testing-debugging -> control-in-app-browser -> playwright -> playwright-interactive -> agent-browser |
| chrome-control | Frontend experience | Browser verification | control-chrome, chrome:control-chrome | control-chrome / 1 | control-in-app-browser / 2 | control-chrome / 1 | Browser verification | control-chrome -> playwright-interactive -> control-in-app-browser -> url-to-code -> design-url-to-code |
| backend-api | Backend services | Backend APIs and services | dev-backend-api-design | dev-backend-api-design / 1 | dev-backend-api-design / 1 | dev-backend-api-design / 1 | Backend APIs and services | dev-backend-api-design -> api-docs-writer -> dev-node-typescript-services -> api-versioning-strategy -> dev-python-services |
| python-service | Backend services | Backend APIs and services | dev-python-services | dev-python-services / 1 | dev-python-services / 1 | dev-python-services / 1 | Backend APIs and services | dev-python-services -> monitoring-setup-guide -> dev-testing-qa -> dev-backend-api-design -> dev-go-rust-systems |
| database-migration | Database and data engineering | Databases and data engineering | database-migration-plan, dev-database-postgres | database-migration-plan / 1 | database-migration-plan / 1 | database-migration-plan / 1 | Databases and data engineering | database-migration-plan -> database-schema-design -> dev-database-postgres -> supabase-postgres-best-practices -> uml-and-software-architecture-visualization |
| data-pipeline-spec | Database and data engineering | Databases and data engineering | data-pipeline-spec, dev-data-engineering | data-pipeline-spec / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Skill ranking anchor | data-pipeline-spec -> data-quality-audit -> dev-data-engineering -> data-analysis-standard -> dev-database-postgres |
| observability-slo | Observability and reliability | Observability and reliability | slo-error-budget, dev-observability-sre | slo-error-budget / 1 | slo-error-budget / 1 | dev-observability-sre / 1 | Observability and reliability | dev-observability-sre -> slo-error-budget -> monitoring-setup-guide -> performance-budget -> feature-flag-guide |
| incident-postmortem | Observability and reliability | Observability and reliability | incident-postmortem | incident-postmortem / 1 | incident-postmortem / 1 | incident-postmortem / 1 | Observability and reliability | incident-postmortem -> dev-observability-sre -> slo-error-budget -> monitoring-setup-guide -> disaster-recovery-plan |
| infra-terraform | Infrastructure platforms | Infrastructure and platforms | dev-infra-terraform-cloud, infra-as-code-review | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | Skill ranking anchor | dev-infra-terraform-cloud -> infra-as-code-review -> cloudflare -> security-best-practices -> cloudflare-deploy |
| containers-kubernetes | Infrastructure platforms | Infrastructure and platforms | dev-containers-kubernetes | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | Skill ranking anchor | dev-containers-kubernetes -> dev-infra-terraform-cloud -> capacity-planning -> dev-devops-ci-cd -> monitoring-setup-guide |
| repo-dependency-audit | Repo collaboration | Repository operations | dependency-audit, technical-debt-register | technical-debt-register / 1 | technical-debt-register / 1 | technical-debt-register / 1 | Repository operations | technical-debt-register -> dependency-audit -> dev-git-github-collaboration -> code-review-checklist -> dev-dependency-maintenance |
| seo-organic-growth | Marketing, growth, and creative | Marketing growth | last-30-days-research | last-30-days-research / 1 | last-30-days-research / 1 | last-30-days-research / 1 | Marketing growth | last-30-days-research -> visualization-strategy-and-critique -> premium-saas-landing-pages -> testing-data-visualizations -> creative-shot |
| creative-ad-offer-production | Marketing, growth, and creative | Marketing growth | creative-ads-explorer, creative-production | creative-production / 1 | creative-production / 1 | creative-production / 1 | Marketing growth | creative-production -> creative-ads-explorer -> creative-offer -> creative-shot -> creative-explore |
| competitive-intelligence-monitor | Marketing, growth, and creative | Marketing growth | competitive-intelligence-monitor | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | Marketing growth | competitive-intelligence-monitor -> creative-positioning -> creative-production -> explore -> creative-shot |
| notion-workspace-knowledge | Communications and knowledge | Product planning | notion-knowledge-capture | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | Product planning | notion-knowledge-capture -> notion-spec-to-implementation -> notion-research-documentation -> product-business-analysis -> prd-template |
| latex-technical-publishing | Documents and publishing | Documents and PDFs | latex-doctor, latex-compile | latex-compile / 1 | latex-doctor / 1 | latex-doctor / 1 | Documents and PDFs | latex-doctor -> latex-compile -> resume-cover-letter-tailor -> frontend-testing-debugging -> documents |
| mobile-desktop-packaging | Frontend experience | Frontend implementation | dev-mobile-desktop | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | Frontend implementation | dev-mobile-desktop -> winui-app -> launch-readiness -> dev-release-productization -> dev-frontend-react-next |
| speech-local-ai-loop | AI agent apps | Agent and LLM apps | transformers-js, transcribe, speech | control-in-app-browser / 2 | speech / 1 | transcribe / 1 | Agent and LLM apps | transcribe -> speech -> transformers-js -> frontend-testing-debugging -> ai-sdk |
| racingsim-ppo-progress | Games and simulation | Game development | racingsim-ai-ml | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | Game development | racingsim-ai-ml -> racingsim-game-dev -> game-playtest -> roadmap-narrative -> design-research |
| design-accessibility-audit | Frontend experience | Frontend implementation | design-audit, dev-frontend-accessibility-css | design-audit / 1 | design-system-audit / 2 | design-audit / 1 | Skill ranking anchor | design-audit -> motion-qa -> dev-frontend-accessibility-css -> design-url-to-code -> figma-component-audit |
| url-to-code | Frontend experience | Browser verification | design-url-to-code, url-to-code | design-url-to-code / 1 | design-url-to-code / 1 | design-url-to-code / 1 | Browser verification | design-url-to-code -> url-to-code -> design-image-to-code -> dev-frontend-react-next -> frontend-testing-debugging |
| plugin-create | Skill tooling | Skill authoring | plugin-creator | openai-docs / 4 | openai-docs / 7 | plugin-creator / 1 | Skill authoring | plugin-creator -> dev-documentation-systems -> skill-security-auditor -> openai-docs -> building-mcp-server-on-cloudflare |
| cli-create | Skill tooling | Skill authoring | cli-creator | design-get-context / 20 | design-qa / 3 | cli-creator / 1 | Skill authoring | cli-creator -> dev-release-productization -> launch-readiness -> design-qa -> design-handoff-brief |
| changelog-release | Repo collaboration | GitHub PR repair | changelog-generator | changelog-generator / 1 | changelog-generator / 1 | changelog-generator / 1 | GitHub PR repair | changelog-generator -> dev-release-productization -> dev-git-github-collaboration -> dev-devops-ci-cd -> code-review-checklist |
| developer-onboarding | Documents and publishing | Documents and PDFs | developer-onboarding-doc | developer-onboarding-doc / 1 | developer-onboarding-doc / 1 | developer-onboarding-doc / 1 | Documents and PDFs | developer-onboarding-doc -> api-docs-writer -> dev-documentation-systems -> load-testing-plan -> monitoring-setup-guide |
| resume-cover-letter | Documents and publishing | Documents and PDFs | resume-cover-letter-tailor | resume-cover-letter-tailor / 1 | resume-cover-letter-tailor / 1 | resume-cover-letter-tailor / 1 | Skill ranking anchor | resume-cover-letter-tailor -> huggingface-jobs -> finding-discovery -> huggingface-llm-trainer -> huggingface-vision-trainer |
| performance-load-test | Observability and reliability | Observability and reliability | load-testing-plan | load-testing-plan / 1 | load-testing-plan / 1 | load-testing-plan / 1 | Backend APIs and services | load-testing-plan -> dev-performance-engineering -> performance-budget -> dev-backend-api-design -> api-docs-writer |
| feature-flag-rollout | Platform delivery | Deployment and release | feature-flag-guide | feature-flag-guide / 1 | feature-flag-guide / 1 | feature-flag-guide / 1 | Skill ranking anchor | feature-flag-guide -> launch-readiness -> product-launch-checklist -> dev-release-productization -> feature-prioritisation |
| disaster-recovery | Observability and reliability | Observability and reliability | disaster-recovery-plan | disaster-recovery-plan / 1 | disaster-recovery-plan / 1 | disaster-recovery-plan / 1 | Skill ranking anchor | disaster-recovery-plan -> incident-postmortem -> load-testing-plan -> monitoring-setup-guide -> feature-flag-guide |
| sentry-setup | Observability and reliability | Observability and reliability | sentry | monitoring-setup-guide / 2 | sentry / 1 | sentry / 1 | Observability and reliability | sentry -> monitoring-setup-guide -> dev-observability-sre -> slo-error-budget -> load-testing-plan |
| supabase-postgres | Database and data engineering | Databases and data engineering | supabase-postgres-best-practices, dev-database-postgres | supabase-postgres-best-practices / 1 | supabase-postgres-best-practices / 1 | supabase-postgres-best-practices / 1 | Skill ranking anchor | supabase-postgres-best-practices -> dev-database-postgres -> database-schema-design -> database-migration-plan -> dev-architecture-review |
| stripe-integration | Backend services | Backend APIs and services | stripe-best-practices | payments / 2 | payments / 2 | stripe-best-practices / 1 | Backend APIs and services | stripe-best-practices -> dev-node-typescript-services -> dev-backend-api-design -> dev-java-dotnet-services -> dev-python-services |
| cloudflare-durable-objects | Platform delivery | Cloudflare workers | durable-objects | durable-objects / 1 | durable-objects / 1 | durable-objects / 1 | Cloudflare workers | durable-objects -> wrangler -> workers-best-practices -> cloudflare-deploy -> agents-sdk |
| hf-vision-trainer | Hugging Face ML | Hugging Face ML | huggingface-vision-trainer | huggingface-vision-trainer / 1 | huggingface-vision-trainer / 1 | huggingface-vision-trainer / 1 | Hugging Face ML | huggingface-vision-trainer -> huggingface-llm-trainer -> huggingface-paper-publisher -> huggingface-community-evals -> huggingface-papers |
| hf-gradio-space | Hugging Face ML | Hugging Face ML | huggingface-gradio | huggingface-gradio / 1 | huggingface-papers / 2 | huggingface-gradio / 1 | Hugging Face ML | huggingface-gradio -> hf-cli -> huggingface-community-evals -> huggingface-paper-publisher -> huggingface-jobs |
| prd-feature-prioritization | Product, research, and planning | Product planning | prd-template, feature-prioritisation | prd-template / 1 | prd-template / 1 | prd-template / 1 | Product planning | prd-template -> ux-research-plan -> user-research-synthesis -> feature-prioritisation -> product-business-analysis |
| user-research-synthesis | Product, research, and planning | Product planning | user-research-synthesis | creative-production / 3 | user-research-synthesis / 1 | user-research-synthesis / 1 | Product planning | user-research-synthesis -> ux-research-plan -> product-business-analysis -> prd-template -> design-research |
| dependency-conflict | Repo collaboration | Repository operations | dependency-conflict-resolver | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | dependency-conflict-resolver / 1 | Repository operations | dependency-conflict-resolver -> dev-dependency-maintenance -> dev-monorepo-build-systems -> dev-git-github-collaboration -> dev-security-engineering |
| debugging-log-analysis | Observability and reliability | Observability and reliability | error-decoder, debugging-log-analyser | error-decoder / 1 | error-decoder / 1 | error-decoder / 1 | Skill ranking anchor | error-decoder -> debugging-log-analyser -> dev-observability-sre -> sentry -> observability |
| monorepo-build | Repo collaboration | Repository operations | dev-monorepo-build-systems, turborepo | dev-monorepo-build-systems / 1 | dev-monorepo-build-systems / 1 | dev-monorepo-build-systems / 1 | Repository operations | dev-monorepo-build-systems -> turborepo -> dev-git-github-collaboration -> dependency-audit -> dev-architecture-review |
| security-finding-triage | Security and risk | Security review | triage-finding, track-findings | track-findings / 1 | track-findings / 1 | triage-finding / 1 | Security review | triage-finding -> validation -> security-diff-scan -> track-findings -> dev-security-engineering |
| risk-register | Product, research, and planning | Product planning | risk-register | launch-readiness / 2 | launch-readiness / 2 | risk-register / 1 | Product planning | risk-register -> launch-readiness -> product-launch-checklist -> roadmap-narrative -> linear |
| capacity-planning | Infrastructure platforms | Infrastructure and platforms | capacity-planning | capacity-planning / 1 | capacity-planning / 1 | capacity-planning / 1 | Infrastructure and platforms | capacity-planning -> dev-containers-kubernetes -> dev-performance-engineering -> load-testing-plan -> slo-error-budget |
| copilot-sdk | AI agent apps | Agent and LLM apps | copilot-sdk | copilot-sdk / 1 | copilot-sdk / 1 | copilot-sdk / 1 | Agent and LLM apps | copilot-sdk -> agents-sdk -> openai-agents-js -> chatgpt-apps -> ai-sdk |
| skillweaver-routing-review | Skill tooling | Skill authoring | skillweaver, code-review-checklist | performance-review !performance-review / 4 | performance-review !performance-review / 6 | skillweaver / 1 | Skill authoring | skillweaver -> dev-performance-engineering -> slo-error-budget -> incident-postmortem -> dev-observability-sre |
| figma-implement-not-use | Frontend experience | Figma design handoff | figma-implement-design | figma-implement-motion / 4 | figma-implement-design / 1 | figma-implement-design / 1 | Figma design handoff | figma-implement-design -> dev-frontend-react-next -> figma-use -> figma-implement-motion -> figma-code-connect-components |
| frontend-dashboard-not-analytics | Frontend experience | Frontend implementation | frontend-app-builder, dev-frontend-react-next | build-dashboard !build-dashboard / 18 | data-visualization !data-visualization / 8 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> dev-frontend-react-next -> data-visualization -> data-quality-audit -> dev-data-engineering |
| frontend-dashboard-instead-analytics | Frontend experience | Frontend implementation | frontend-app-builder, dev-frontend-react-next | build-dashboard !build-dashboard / 17 | data-visualization !data-visualization / 9 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> dev-frontend-react-next -> data-visualization -> data-quality-audit -> dev-data-engineering |
| threat-model-no-scan | Security and risk | Security review | security-threat-model, threat-model | threat-model / 1 | threat-model / 1 | threat-model / 1 | Security review | threat-model -> security-threat-model -> dev-security-engineering -> triage-finding -> security-best-practices |
| threat-model-dont-scan | Security and risk | Security review | security-threat-model, threat-model | threat-model / 1 | deep-security-scan !security-scan / 2 | threat-model / 1 | Security review | threat-model -> security-threat-model -> dev-security-engineering -> triage-finding -> skill-security-auditor |

## V2 Support Misses

These rows have a correct expected primary somewhere in V2's workflow, but not every expected support skill appears in the top/workflow five.

| Case | Missing expected support | V2 top/workflow 5 |
| --- | --- | --- |
| skill-create | skill-installer | skill-creator -> dev-documentation-systems -> skill-security-auditor -> skillweaver -> hatch-pet |
| seo-organic-growth | creative-positioning | last-30-days-research -> visualization-strategy-and-critique -> premium-saas-landing-pages -> testing-data-visualizations -> creative-shot |
| creative-ad-offer-production | creative-positioning | creative-production -> creative-ads-explorer -> creative-offer -> creative-shot -> creative-explore |
| competitive-intelligence-monitor | business-strategy-and-research | competitive-intelligence-monitor -> creative-positioning -> creative-production -> explore -> creative-shot |

## Interpretation

SkillWeaver V2 changes the composite output-quality score by +25.1 points versus no SkillWeaver and +23.1 points versus the skill-level baseline.
V2 changes primary selection by +26.9 percentage points versus no SkillWeaver and +24.4 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +6.4 percentage points versus no SkillWeaver and +6.4 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
