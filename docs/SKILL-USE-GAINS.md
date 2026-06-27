# SkillWeaver V2 Benchmark

Generated: 2026-06-27T11:16:26.923Z

<!-- skillweaver-benchmark-metadata
{"generatedAt":1782558986923,"command":"npm run benchmark:skills","git":{"commit":"f3071ba3990669c0c23753f0b5a9581580a798e8","dirty":false,"dirtyPaths":[]},"invalidatingDirtyPaths":[],"cases":{"count":49,"sha256":"sha256:27b8afb4b4074404cc1d2ea44da9a1ec4a5f14ceeab79de1b9c37ad41104c439"},"corpus":{"skills":442,"skillEdges":2000,"concepts":22,"conceptEdges":200,"roots":8,"sha256":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"inputs":{"cases":"sha256:27b8afb4b4074404cc1d2ea44da9a1ec4a5f14ceeab79de1b9c37ad41104c439","scanner":"sha256:2c619aaab51037057265405a2038937d71eba9bf13aad5ed494f124d24bf0556","benchmarkScript":"sha256:75ce9ce3eb9371a66f56003b351498f6c8a32e6ec2225a7577723b83a2e8e79d","corpus":"sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0"},"acceptance":{"ok":true,"failures":[]},"snapshotFingerprint":"sha256:7fb1225aea428413196f4e9eba6a9ddfebb78b3925fa7e714841aecf8cfeae4b"}
skillweaver-benchmark-metadata -->

## Freshness

- Command: `npm run benchmark:skills`
- Git commit at generation: `f3071ba3990669c0c23753f0b5a9581580a798e8`
- Git dirty: no
- Invalidating dirty paths: none
- Case hash: `sha256:27b8afb4b4074404cc1d2ea44da9a1ec4a5f14ceeab79de1b9c37ad41104c439`
- Scanner hash: `sha256:2c619aaab51037057265405a2038937d71eba9bf13aad5ed494f124d24bf0556`
- Benchmark script hash: `sha256:75ce9ce3eb9371a66f56003b351498f6c8a32e6ec2225a7577723b83a2e8e79d`
- Corpus hash: `sha256:8a1e528112dd20a5ba8115803b1685d75de0a3a9dc4e735213ee183c53d6d1f0`
- Snapshot fingerprint: `sha256:7fb1225aea428413196f4e9eba6a9ddfebb78b3925fa7e714841aecf8cfeae4b`
- Acceptance: pass

## Corpus

- Skills indexed: 442
- Skill relationship edges: 2000
- Concept nodes: 22
- Concept edges: 200
- Skill roots: 8
- Benchmark cases: 49

## Compared Systems

- `no-skillweaver`: flat metadata search over name, description, namespace, domains, and tool hints. It does not use triggers, body text, resources, relationship edges, workflow recommendations, or concept nodes.
- `skill-level-baseline`: current SkillWeaver skill ranking plus workflow recommendations from triggers, bodies, resources, dedupe, gateway boosts, and skill relationship edges. It excludes concept nodes. The last pre-concept commit was `80d31f1`.
- `skillweaver-v2-concepts`: the current product route. It uses skill-level ranking as a high-confidence anchor, scores matching concept nodes, reranks role-tagged skill references inside those concepts, then appends skill-level ranking as fallback.

## Summary

| Metric | No SkillWeaver | Skill-Level Baseline | SkillWeaver V2 | V2 vs No | V2 vs Skill-Level |
| --- | ---: | ---: | ---: | ---: | ---: |
| Output quality score (0-100) | 77.4 | 80.1 | 100.0 | +22.6 pts | +19.9 pts |
| Primary hit@1 | 77.6% | 81.6% | 100.0% | +22.4 pp | +18.4 pp |
| Expected skill in top/workflow 5 | 95.9% | 95.9% | 100.0% | +4.1 pp | +4.1 pp |
| Mean reciprocal rank | 0.851 | 0.888 | 1.000 | +0.149 | +0.112 |
| Support-skill coverage@5 | 50.7% | 52.4% | 100.0% | +49.3 pp | +47.6 pp |
| Forbidden primary rate, lower is better | 2.0% | 0.0% | 0.0% | -2.0 pp better | 0.0 pp |
| Mean candidates to expected skill, lower is better | 1.8 | 1.9 | 1.0 | -0.8 candidates better | -0.9 candidates better |

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.

## Per-Case Results

| Case | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- |
| frontend-dashboard | frontend-app-builder | frontend-app-builder / 1 | frontend-app-builder / 1 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> frontend-testing-debugging -> dev-frontend-react-next -> playwright-interactive -> playwright |
| frontend-regression | frontend-testing-debugging | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | Frontend implementation | frontend-testing-debugging -> dev-frontend-react-next -> dev-frontend-accessibility-css -> playwright-interactive -> playwright |
| github-ci | gh-fix-ci, gh-address-comments | github / 2 | gh-address-comments / 1 | gh-fix-ci / 1 | GitHub PR repair | gh-fix-ci -> gh-address-comments -> dev-testing-qa -> dev-devops-ci-cd -> triage-finding |
| github-comments | gh-address-comments | gh-address-comments / 1 | gh-address-comments / 1 | gh-address-comments / 1 | GitHub PR repair | gh-address-comments -> dev-git-github-collaboration -> gh-fix-ci -> dependency-audit -> track-findings |
| figma-use-implement | figma-use | figma-implement-motion / 5 | figma-use / 1 | figma-use / 1 | Figma design handoff | figma-use -> figma-implement-design -> figma-implement-motion -> design-image-to-code -> figma-code-connect-components |
| figma-library | figma-generate-library | figma-generate-diagram / 4 | figma-generate-design / 1 | figma-generate-library / 1 | Figma design handoff | figma-generate-library -> figma-use -> figma-generate-design -> figma-component-audit -> figma-create-design-system-rules |
| data-dashboard | build-dashboard | create-data-context / 6 | analyze-data-quality / 26 | build-dashboard / 1 | Data dashboards and reports | build-dashboard -> data-visualization -> testing-data-visualizations -> visualize-data -> kpi-reporting |
| kpi-report | kpi-reporting, build-report | build-report / 1 | kpi-reporting / 1 | kpi-reporting / 1 | Data dashboards and reports | kpi-reporting -> build-report -> visualize-data -> data-visualization -> testing-data-visualizations |
| data-quality | analyze-data-quality, data-quality-audit | data-quality-audit / 1 | data-quality-audit / 1 | data-quality-audit / 1 | Data dashboards and reports | data-quality-audit -> data-analysis-standard -> analyze-data-quality -> data-visualization -> data-pipeline-spec |
| security-scan | security-scan, deep-security-scan | skill-security-auditor / 5 | security-threat-model / 5 | deep-security-scan / 1 | Security review | deep-security-scan -> security-scan -> attack-path-analysis -> dependency-audit -> dev-security-engineering |
| attack-path | attack-path-analysis | security-threat-model / 2 | security-threat-model / 3 | attack-path-analysis / 1 | Security review | attack-path-analysis -> security-threat-model -> deep-security-scan -> web-perf -> security-ownership-map |
| vercel-deploy | deployments-cicd, vercel-deploy, vercel-api | deployments-cicd / 1 | vercel-api / 1 | vercel-api / 1 | Deployment and release | vercel-api -> deployments-cicd -> vercel-deploy -> env-vars -> agent-browser-verify |
| cloudflare-worker | wrangler, workers-best-practices | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare / 2 | wrangler / 1 | Cloudflare workers | wrangler -> workers-best-practices -> cloudflare-deploy -> durable-objects -> building-mcp-server-on-cloudflare |
| skill-create | skill-creator | skill-creator / 1 | hatch-pet / 2 | skill-creator / 1 | Skill authoring | skill-creator -> skillweaver -> skill-installer -> dev-documentation-systems -> template-creator |
| skillweaver-self | skillweaver | skillweaver / 1 | skillweaver / 1 | skillweaver / 1 | Skill authoring | skillweaver -> skill-creator -> skill-security-auditor -> skill-installer -> project-derived-skills |
| pdf-extract | pdf | pdf / 1 | pdf / 1 | pdf / 1 | Documents and PDFs | pdf -> reports-pdfs-and-slide-automation -> resume-cover-letter-tailor -> documents -> latex-doctor |
| spreadsheet-analysis | Spreadsheets | analyze-data-quality / 2 | Spreadsheets / 1 | Spreadsheets / 1 | Data dashboards and reports | Spreadsheets -> data-analysis-standard -> analyze-data-quality -> chart-data-extractor -> data-pipeline-spec |
| presentation-deck | Presentations, roadmap-presentation | roadmap-presentation / 1 | roadmap-presentation / 1 | roadmap-presentation / 1 | Presentations | roadmap-presentation -> roadmap-narrative -> Presentations -> template-creator -> reports-pdfs-and-slide-automation |
| hf-train | huggingface-llm-trainer, huggingface-datasets | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | Hugging Face ML | huggingface-llm-trainer -> huggingface-vision-trainer -> huggingface-papers -> huggingface-paper-publisher -> huggingface-community-evals |
| hf-dataset | huggingface-datasets | huggingface-datasets / 1 | huggingface-datasets / 1 | huggingface-datasets / 1 | Hugging Face ML | huggingface-datasets -> huggingface-papers -> huggingface-paper-publisher -> huggingface-llm-trainer -> huggingface-vision-trainer |
| gmail-triage | gmail, gmail-inbox-triage | gmail-inbox-triage / 1 | gmail / 1 | gmail / 1 | Email triage | gmail -> gmail-inbox-triage -> email-triage -> triage-finding -> investigation-mode |
| phaser-game | phaser-2d-game | phaser-2d-game / 1 | phaser-2d-game / 1 | phaser-2d-game / 1 | Game development | phaser-2d-game -> game-playtest -> game-studio -> three-webgl-game -> web-game-foundations |
| three-game | three-webgl-game | three-webgl-game / 1 | three-webgl-game / 1 | three-webgl-game / 1 | Game development | three-webgl-game -> web-3d-asset-pipeline -> game-playtest -> react-three-fiber-game -> phaser-2d-game |
| adr | architecture-decision-record | architecture-decision-record / 1 | architecture-decision-record / 1 | architecture-decision-record / 1 | Repository operations | architecture-decision-record -> uml-and-software-architecture-visualization -> dev-architecture-review -> security-threat-model -> dev-backend-api-design |
| cro-reporting | analytics-cro-and-reporting | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting / 1 | Marketing growth | analytics-cro-and-reporting -> marketing-strategy-and-growth -> kpi-reporting -> industry-playbooks -> scrollytelling-and-parallax-data-visualization |
| linear-planning | linear | linear / 1 | linear / 1 | linear / 1 | Product planning | linear -> roadmap-narrative -> ux-research-plan -> product-launch-checklist -> notion-spec-to-implementation |
| openai-docs | openai-docs | openai-docs / 1 | openai-docs / 1 | openai-docs / 1 | Agent and LLM apps | openai-docs -> openai-agents-js -> chatgpt-apps -> api-docs-writer -> dev-ai-llm-apps |
| openai-agents | openai-agents-js | openai-agents-js / 1 | openai-agents-js / 1 | openai-agents-js / 1 | Agent and LLM apps | openai-agents-js -> dev-ai-llm-apps -> openai-docs -> agents-sdk -> chatgpt-apps |
| browser-qa | playwright, frontend-testing-debugging | control-in-app-browser / 3 | control-in-app-browser / 3 | frontend-testing-debugging / 1 | Browser verification | frontend-testing-debugging -> control-in-app-browser -> playwright -> playwright-interactive -> agent-browser |
| chrome-control | control-chrome, chrome:control-chrome | control-chrome / 1 | control-in-app-browser / 2 | control-chrome / 1 | Browser verification | control-chrome -> playwright-interactive -> control-in-app-browser -> url-to-code -> design-url-to-code |
| backend-api | dev-backend-api-design | dev-backend-api-design / 1 | dev-backend-api-design / 1 | dev-backend-api-design / 1 | Backend APIs and services | dev-backend-api-design -> dev-node-typescript-services -> api-docs-writer -> api-versioning-strategy -> dev-python-services |
| python-service | dev-python-services | dev-python-services / 1 | dev-python-services / 1 | dev-python-services / 1 | Backend APIs and services | dev-python-services -> monitoring-setup-guide -> dev-testing-qa -> performance-budget -> dev-backend-api-design |
| database-migration | database-migration-plan, dev-database-postgres | database-migration-plan / 1 | database-migration-plan / 1 | database-migration-plan / 1 | Databases and data engineering | database-migration-plan -> database-schema-design -> dev-database-postgres -> supabase-postgres-best-practices -> uml-and-software-architecture-visualization |
| data-pipeline-spec | data-pipeline-spec, dev-data-engineering | data-pipeline-spec / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Databases and data engineering | data-pipeline-spec -> dev-data-engineering -> data-quality-audit -> data-analysis-standard -> analyze-data-quality |
| observability-slo | slo-error-budget, dev-observability-sre | slo-error-budget / 1 | slo-error-budget / 1 | slo-error-budget / 1 | Observability and reliability | slo-error-budget -> monitoring-setup-guide -> performance-budget -> feature-flag-guide -> dev-observability-sre |
| incident-postmortem | incident-postmortem | incident-postmortem / 1 | incident-postmortem / 1 | incident-postmortem / 1 | Observability and reliability | incident-postmortem -> dev-observability-sre -> slo-error-budget -> monitoring-setup-guide -> disaster-recovery-plan |
| infra-terraform | dev-infra-terraform-cloud, infra-as-code-review | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | Infrastructure and platforms | dev-infra-terraform-cloud -> infra-as-code-review -> cloudflare -> security-best-practices -> cloudflare-deploy |
| containers-kubernetes | dev-containers-kubernetes | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | Infrastructure and platforms | dev-containers-kubernetes -> dev-infra-terraform-cloud -> monitoring-setup-guide -> dev-devops-ci-cd -> feature-flag-guide |
| repo-dependency-audit | dependency-audit, technical-debt-register, conservative-repo-operations | technical-debt-register / 1 | technical-debt-register / 1 | technical-debt-register / 1 | Repository operations | technical-debt-register -> dependency-audit -> dev-git-github-collaboration -> code-review-checklist -> dev-dependency-maintenance |
| seo-organic-growth | seo-and-organic-growth | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | Marketing growth | seo-and-organic-growth -> marketing-strategy-and-growth -> last-30-days-research -> agent-operating-system -> industry-playbooks |
| creative-ad-offer-production | creative-ads-explorer, creative-production | creative-production / 1 | creative-production / 1 | creative-production / 1 | Marketing growth | creative-production -> creative-shot -> creative-ads-explorer -> creative-offer -> creative-positioning |
| competitive-intelligence-monitor | competitive-intelligence-monitor | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | Marketing growth | competitive-intelligence-monitor -> creative-positioning -> creative-production -> business-strategy-and-research -> creative-ads-explorer |
| notion-workspace-knowledge | notion-knowledge-capture | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | Product planning | notion-knowledge-capture -> notion-spec-to-implementation -> notion-research-documentation -> building-ai-agent-on-cloudflare -> openai-docs |
| latex-technical-publishing | latex-doctor, latex-compile | latex-compile / 1 | latex-doctor / 1 | latex-doctor / 1 | Documents and PDFs | latex-doctor -> latex-compile -> resume-cover-letter-tailor -> frontend-testing-debugging -> documents |
| mobile-desktop-packaging | dev-mobile-desktop | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | Frontend implementation | dev-mobile-desktop -> winui-app -> launch-readiness -> dev-release-productization -> dev-frontend-react-next |
| speech-local-ai-loop | transformers-js, transcribe, speech | control-in-app-browser / 2 | speech / 1 | transcribe / 1 | Agent and LLM apps | transcribe -> speech -> transformers-js -> ai-sdk -> agent-browser |
| racingsim-ppo-progress | racingsim-ai-ml | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | Game development | racingsim-ai-ml -> racingsim-game-dev -> game-playtest -> design-research -> imagegen |
| frontend-dashboard-not-analytics | frontend-app-builder, dev-frontend-react-next | build-dashboard !build-dashboard / 19 | analytics-cro-and-reporting / 9 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> dev-frontend-react-next -> analytics-cro-and-reporting -> data-visualization -> dev-data-engineering |
| threat-model-no-scan | security-threat-model, threat-model | threat-model / 1 | threat-model / 1 | threat-model / 1 | Security review | threat-model -> security-threat-model -> dev-security-engineering -> triage-finding -> security-best-practices |

## V2 Support Misses

No expected support misses in the current V2 workflow.


## Interpretation

SkillWeaver V2 changes the composite output-quality score by +22.6 points versus no SkillWeaver and +19.9 points versus the skill-level baseline.
V2 changes primary selection by +22.4 percentage points versus no SkillWeaver and +18.4 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +4.1 percentage points versus no SkillWeaver and +4.1 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
