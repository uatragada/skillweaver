# SkillWeaver V2 Benchmark

Generated: 6/27/2026, 6:57:01 AM

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
| Output quality score (0-100) | 77.4 | 80.1 | 91.6 | +14.3 pts | +11.6 pts |
| Primary hit@1 | 77.6% | 81.6% | 95.9% | +18.4 pp | +14.3 pp |
| Expected skill in top/workflow 5 | 95.9% | 95.9% | 100.0% | +4.1 pp | +4.1 pp |
| Mean reciprocal rank | 0.851 | 0.888 | 0.980 | +0.129 | +0.092 |
| Support-skill coverage@5 | 50.7% | 52.4% | 68.4% | +17.7 pp | +16.0 pp |
| Forbidden primary rate, lower is better | 2.0% | 0.0% | 0.0% | -2.0 pp better | 0.0 pp |
| Mean candidates to expected skill, lower is better | 1.8 | 1.9 | 1.0 | -0.8 candidates better | -0.9 candidates better |

Both the skill-level baseline and V2 expose a top-5 workflow/recommendation set, narrowing review from 442 skills to 5 candidates, a 98.9% candidate reduction per task.

## Per-Case Results

| Case | Expected primary | No primary / rank | Skill-level primary / rank | V2 primary / rank | V2 top concept | V2 top/workflow 5 |
| --- | --- | --- | --- | --- | --- | --- |
| frontend-dashboard | frontend-app-builder | frontend-app-builder / 1 | frontend-app-builder / 1 | frontend-app-builder / 1 | Frontend implementation | frontend-app-builder -> frontend-testing-debugging -> dev-frontend-react-next -> playwright-interactive -> playwright |
| frontend-regression | frontend-testing-debugging | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | Frontend implementation | frontend-testing-debugging -> dev-frontend-react-next -> dev-frontend-accessibility-css -> autovise-premium-mobility-style -> premium-web-design |
| github-ci | gh-fix-ci, gh-address-comments | github / 2 | gh-address-comments / 1 | gh-fix-ci / 1 | GitHub PR repair | gh-fix-ci -> gh-address-comments -> dev-devops-ci-cd -> triage-finding -> github |
| github-comments | gh-address-comments | gh-address-comments / 1 | gh-address-comments / 1 | gh-address-comments / 1 | GitHub PR repair | gh-address-comments -> dev-git-github-collaboration -> dependency-audit -> track-findings -> code-review-checklist |
| figma-use-implement | figma-use | figma-implement-motion / 5 | figma-use / 1 | figma-use / 1 | Figma design handoff | figma-use -> figma-implement-design -> figma-implement-motion -> design-image-to-code -> figma-code-connect-components |
| figma-library | figma-generate-library | figma-generate-diagram / 4 | figma-generate-design / 1 | figma-generate-library / 1 | Figma design handoff | figma-generate-library -> figma-generate-design -> figma-component-audit -> figma-create-design-system-rules -> figma-implement-design |
| data-dashboard | build-dashboard | create-data-context / 6 | analyze-data-quality / 26 | build-dashboard / 1 | Data dashboards and reports | build-dashboard -> data-visualization -> testing-data-visualizations -> visualize-data -> kpi-reporting |
| kpi-report | kpi-reporting, build-report | build-report / 1 | kpi-reporting / 1 | kpi-reporting / 1 | Data dashboards and reports | kpi-reporting -> build-report -> visualize-data -> data-visualization -> testing-data-visualizations |
| data-quality | analyze-data-quality, data-quality-audit | data-quality-audit / 1 | data-quality-audit / 1 | data-quality-audit / 1 | Data dashboards and reports | data-quality-audit -> analyze-data-quality -> data-visualization -> data-pipeline-spec -> chart-data-extractor |
| security-scan | security-scan, deep-security-scan | skill-security-auditor / 5 | security-threat-model / 5 | deep-security-scan / 1 | Security review | deep-security-scan -> security-scan -> attack-path-analysis -> dependency-audit -> skill-security-auditor |
| attack-path | attack-path-analysis | security-threat-model / 2 | security-threat-model / 3 | attack-path-analysis / 1 | Security review | attack-path-analysis -> security-threat-model -> deep-security-scan -> web-perf -> security-ownership-map |
| vercel-deploy | deployments-cicd, vercel-deploy, vercel-api | deployments-cicd / 1 | vercel-api / 1 | vercel-api / 1 | Deployment and release | vercel-api -> vercel-cli -> vercel-deploy -> deployments-cicd -> vercel-services |
| cloudflare-worker | wrangler, workers-best-practices | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare / 2 | Cloudflare workers | building-mcp-server-on-cloudflare -> wrangler -> cloudflare-deploy -> building-ai-agent-on-cloudflare -> workers-best-practices |
| skill-create | skill-creator | skill-creator / 1 | hatch-pet / 2 | skill-creator / 1 | Skill authoring | skill-creator -> skillweaver -> skill-installer -> dev-documentation-systems -> template-creator |
| skillweaver-self | skillweaver | skillweaver / 1 | skillweaver / 1 | skillweaver / 1 | Skill authoring | skillweaver -> skill-creator -> skill-security-auditor -> skill-installer -> project-derived-skills |
| pdf-extract | pdf | pdf / 1 | pdf / 1 | pdf / 1 | Documents and PDFs | pdf -> reports-pdfs-and-slide-automation -> resume-cover-letter-tailor -> documents -> latex-doctor |
| spreadsheet-analysis | Spreadsheets | analyze-data-quality / 2 | Spreadsheets / 1 | Spreadsheets / 1 | Data dashboards and reports | Spreadsheets -> analyze-data-quality -> chart-data-extractor -> data-pipeline-spec -> database-schema-design |
| presentation-deck | Presentations, roadmap-presentation | roadmap-presentation / 1 | roadmap-presentation / 1 | roadmap-presentation / 1 | Presentations | roadmap-presentation -> Presentations -> template-creator -> roadmap-narrative -> reports-pdfs-and-slide-automation |
| hf-train | huggingface-llm-trainer, huggingface-datasets | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | Hugging Face ML | huggingface-llm-trainer -> huggingface-vision-trainer -> huggingface-papers -> huggingface-paper-publisher -> huggingface-community-evals |
| hf-dataset | huggingface-datasets | huggingface-datasets / 1 | huggingface-datasets / 1 | huggingface-datasets / 1 | Hugging Face ML | huggingface-datasets -> huggingface-papers -> huggingface-paper-publisher -> huggingface-llm-trainer -> huggingface-vision-trainer |
| gmail-triage | gmail, gmail-inbox-triage | gmail-inbox-triage / 1 | gmail / 1 | gmail / 1 | Email triage | gmail -> gmail-inbox-triage -> email-triage -> triage-finding -> investigation-mode |
| phaser-game | phaser-2d-game | phaser-2d-game / 1 | phaser-2d-game / 1 | phaser-2d-game / 1 | Game development | phaser-2d-game -> game-studio -> three-webgl-game -> web-game-foundations -> react-three-fiber-game |
| three-game | three-webgl-game | three-webgl-game / 1 | three-webgl-game / 1 | three-webgl-game / 1 | Game development | three-webgl-game -> game-playtest -> react-three-fiber-game -> threejs-data-visualization -> phaser-2d-game |
| adr | architecture-decision-record | architecture-decision-record / 1 | architecture-decision-record / 1 | architecture-decision-record / 1 | Repository operations | architecture-decision-record -> uml-and-software-architecture-visualization -> dev-architecture-review -> security-threat-model -> dev-backend-api-design |
| cro-reporting | analytics-cro-and-reporting | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting / 1 | Marketing growth | analytics-cro-and-reporting -> marketing-strategy-and-growth -> industry-playbooks -> scrollytelling-and-parallax-data-visualization -> creative-shot |
| linear-planning | linear | linear / 1 | linear / 1 | linear / 1 | Product planning | linear -> ux-research-plan -> product-launch-checklist -> notion-spec-to-implementation -> research |
| openai-docs | openai-docs | openai-docs / 1 | openai-docs / 1 | openai-docs / 1 | Agent and LLM apps | openai-docs -> openai-agents-js -> chatgpt-apps -> copilot-sdk -> speech |
| openai-agents | openai-agents-js | openai-agents-js / 1 | openai-agents-js / 1 | openai-agents-js / 1 | Agent and LLM apps | openai-agents-js -> openai-docs -> agents-sdk -> dev-ai-llm-apps -> chatgpt-apps |
| browser-qa | playwright, frontend-testing-debugging | control-in-app-browser / 3 | control-in-app-browser / 3 | control-in-app-browser / 2 | Browser verification | control-in-app-browser -> frontend-testing-debugging -> playwright -> agent-browser -> playwright-interactive |
| chrome-control | control-chrome, chrome:control-chrome | control-chrome / 1 | control-in-app-browser / 2 | control-chrome / 1 | Browser verification | control-chrome -> control-in-app-browser -> url-to-code -> design-url-to-code -> agent-browser-verify |
| backend-api | dev-backend-api-design | dev-backend-api-design / 1 | dev-backend-api-design / 1 | dev-backend-api-design / 1 | Backend APIs and services | dev-backend-api-design -> dev-node-typescript-services -> api-versioning-strategy -> dev-python-services -> performance-budget |
| python-service | dev-python-services | dev-python-services / 1 | dev-python-services / 1 | dev-python-services / 1 | Backend APIs and services | dev-python-services -> vercel-services -> dev-backend-api-design -> dev-node-typescript-services -> dev-java-dotnet-services |
| database-migration | database-migration-plan, dev-database-postgres | database-migration-plan / 1 | database-migration-plan / 1 | database-migration-plan / 1 | Databases and data engineering | database-migration-plan -> database-schema-design -> dev-database-postgres -> supabase-postgres-best-practices -> uml-and-software-architecture-visualization |
| data-pipeline-spec | data-pipeline-spec, dev-data-engineering | data-pipeline-spec / 1 | data-pipeline-spec / 1 | data-pipeline-spec / 1 | Databases and data engineering | data-pipeline-spec -> dev-data-engineering -> data-quality-audit -> analyze-data-quality -> dev-database-postgres |
| observability-slo | slo-error-budget, dev-observability-sre | slo-error-budget / 1 | slo-error-budget / 1 | slo-error-budget / 1 | Observability and reliability | slo-error-budget -> performance-budget -> monitoring-setup-guide -> feature-flag-guide -> dev-observability-sre |
| incident-postmortem | incident-postmortem | incident-postmortem / 1 | incident-postmortem / 1 | incident-postmortem / 1 | Observability and reliability | incident-postmortem -> dev-observability-sre -> slo-error-budget -> monitoring-setup-guide -> disaster-recovery-plan |
| infra-terraform | dev-infra-terraform-cloud, infra-as-code-review | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | dev-infra-terraform-cloud / 1 | Infrastructure and platforms | dev-infra-terraform-cloud -> infra-as-code-review -> cloudflare -> cloudflare-deploy -> capacity-planning |
| containers-kubernetes | dev-containers-kubernetes | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | dev-containers-kubernetes / 1 | Infrastructure and platforms | dev-containers-kubernetes -> capacity-planning -> dev-infra-terraform-cloud -> monitoring-setup-guide -> dev-devops-ci-cd |
| repo-dependency-audit | dependency-audit, technical-debt-register, conservative-repo-operations | technical-debt-register / 1 | technical-debt-register / 1 | technical-debt-register / 1 | Repository operations | technical-debt-register -> dependency-audit -> dev-git-github-collaboration -> dev-dependency-maintenance -> dev-architecture-review |
| seo-organic-growth | seo-and-organic-growth | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | seo-and-organic-growth / 1 | Marketing growth | seo-and-organic-growth -> marketing-strategy-and-growth -> last-30-days-research -> agent-operating-system -> industry-playbooks |
| creative-ad-offer-production | creative-ads-explorer, creative-production | creative-production / 1 | creative-production / 1 | creative-production / 1 | Marketing growth | creative-production -> creative-shot -> creative-ads-explorer -> creative-offer -> explore |
| competitive-intelligence-monitor | competitive-intelligence-monitor | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | competitive-intelligence-monitor / 1 | Marketing growth | competitive-intelligence-monitor -> creative-positioning -> creative-production -> business-strategy-and-research -> explore |
| notion-workspace-knowledge | notion-knowledge-capture | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | notion-knowledge-capture / 1 | Product planning | notion-knowledge-capture -> notion-spec-to-implementation -> notion-research-documentation -> building-ai-agent-on-cloudflare -> openai-docs |
| latex-technical-publishing | latex-doctor, latex-compile | latex-compile / 1 | latex-doctor / 1 | latex-doctor / 1 | Documents and PDFs | latex-doctor -> latex-compile -> resume-cover-letter-tailor -> documents -> api-docs-writer |
| mobile-desktop-packaging | dev-mobile-desktop | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | dev-mobile-desktop / 1 | Frontend implementation | dev-mobile-desktop -> winui-app -> dev-frontend-react-next -> autovise-premium-mobility-style -> frontend-app-builder |
| speech-local-ai-loop | transformers-js, transcribe, speech | control-in-app-browser / 2 | speech / 1 | transcribe / 1 | Agent and LLM apps | transcribe -> speech -> transformers-js -> ai-sdk -> agent-browser |
| racingsim-ppo-progress | racingsim-ai-ml | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | racingsim-ai-ml / 1 | Game development | racingsim-ai-ml -> racingsim-game-dev -> game-playtest -> design-research -> imagegen |
| frontend-dashboard-not-analytics | frontend-app-builder, dev-frontend-react-next | build-dashboard !build-dashboard / 19 | analytics-cro-and-reporting / 9 | dev-frontend-react-next / 1 | Frontend implementation | dev-frontend-react-next -> frontend-app-builder -> database-schema-design -> database-migration-plan -> dev-database-postgres |
| threat-model-no-scan | security-threat-model, threat-model | threat-model / 1 | threat-model / 1 | threat-model / 1 | Security review | threat-model -> security-threat-model -> triage-finding -> dev-security-engineering -> security-diff-scan |

## Interpretation

SkillWeaver V2 changes the composite output-quality score by +14.3 points versus no SkillWeaver and +11.6 points versus the skill-level baseline.
V2 changes primary selection by +18.4 percentage points versus no SkillWeaver and +14.3 percentage points versus the skill-level baseline.
V2 changes expected-skill top/workflow-5 retrieval by +4.1 percentage points versus no SkillWeaver and +4.1 percentage points versus the skill-level baseline.
The V2 score reflects a concept-aided skill-loading experience, not an LLM reranker; it is fully deterministic and derived from the local skill corpus.
