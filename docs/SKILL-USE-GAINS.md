# Skill Use Gains Benchmark

Generated: 6/27/2026, 2:37:12 AM

## Corpus

- Skills indexed: 439
- Relationship edges: 2000
- Skill roots: 8
- Benchmark cases: 30

## Compared Systems

- `flat-metadata`: ranks the same skill corpus using only name, description, namespace, domains, and tool hints.
- `skillweaver`: uses SkillWeaver ranking plus workflow recommendations from triggers, body/resource signals, dedupe, gateway boosts, and relationship edges.

## Summary

| Metric | Flat Metadata | SkillWeaver | Gain |
| --- | ---: | ---: | ---: |
| Output quality score (0-100) | 73.1 | 75.6 | +2.5 pts |
| Primary hit@1 | 70.0% | 73.3% | +3.3 pp |
| Expected skill in top/workflow 5 | 96.7% | 96.7% | 0.0 pp |
| Mean reciprocal rank | 0.805 | 0.847 | +0.042 |
| Support-skill coverage@5 | 48.3% | 50.0% | +1.7 pp |
| Mean candidates to expected skill, lower is better | 1.7 | 2.2 | +0.5 candidates worse |
| Median candidates to expected skill, lower is better | 1 | 1 | 0.0 candidates |

SkillWeaver's top-5 workflow narrows the review set from 439 skills to 5 candidates, a 98.9% candidate reduction per task.

## Per-Case Results

| Case | Expected | Flat quality | SkillWeaver quality | Flat primary / rank | SkillWeaver primary / rank | SkillWeaver workflow |
| --- | --- | ---: | ---: | --- | --- | --- |
| frontend-dashboard | frontend-app-builder | 90.0 | 90.0 | frontend-app-builder / 1 | frontend-app-builder / 1 | frontend-app-builder -> dev-frontend-react-next -> frontend-testing-debugging -> game-ui-frontend -> design-image-to-code |
| frontend-regression | frontend-testing-debugging | 90.0 | 90.0 | frontend-testing-debugging / 1 | frontend-testing-debugging / 1 | frontend-testing-debugging -> dev-frontend-accessibility-css -> web-perf -> dev-frontend-react-next -> debugging-log-analyser |
| github-ci | gh-fix-ci, gh-address-comments | 40.0 | 100.0 | github / 2 | gh-address-comments / 1 | gh-address-comments -> gh-fix-ci -> dev-testing-qa -> dev-devops-ci-cd |
| github-comments | gh-address-comments | 80.0 | 80.0 | gh-address-comments / 1 | gh-address-comments / 1 | gh-address-comments -> dev-git-github-collaboration -> dependency-audit -> security-diff-scan -> track-findings |
| figma-use-implement | figma-use | 44.0 | 100.0 | figma-implement-motion / 5 | figma-use / 1 | figma-use -> figma-code-connect-components -> figma-implement-design -> figma-implement-motion -> design-image-to-code |
| figma-library | figma-generate-library | 35.0 | 50.0 | figma-generate-diagram / 4 | figma-generate-design / 1 | figma-generate-design -> figma-generate-library -> figma-component-audit -> figma-create-design-system-rules |
| data-dashboard | build-dashboard | 3.3 | 10.8 | create-data-context / 6 | analyze-data-quality / 26 | analyze-data-quality -> create-data-context -> dev-data-engineering -> data-visualization -> testing-data-visualizations |
| kpi-report | kpi-reporting, build-report | 80.0 | 90.0 | build-report / 1 | kpi-reporting / 1 | kpi-reporting -> build-report -> reports-pdfs-and-slide-automation -> visualize-data -> engineering-weekly-report |
| data-quality | analyze-data-quality, data-quality-audit | 80.0 | 80.0 | data-quality-audit / 1 | data-quality-audit / 1 | data-quality-audit -> design-system-audit -> analyze-data-quality -> figma-component-audit -> data-visualization |
| security-scan | security-scan, deep-security-scan | 34.0 | 34.0 | skill-security-auditor / 5 | security-threat-model / 5 | security-threat-model -> deep-security-scan -> dependency-audit -> skill-security-auditor -> attack-path-analysis |
| attack-path | attack-path-analysis | 40.0 | 36.7 | security-threat-model / 2 | security-threat-model / 3 | security-threat-model -> web-perf -> attack-path-analysis -> user-context -> audit |
| vercel-deploy | deployments-cicd, vercel-deploy, vercel-api | 80.0 | 80.0 | deployments-cicd / 1 | vercel-api / 1 | vercel-api -> vercel-cli -> deployments-cicd -> vercel-deploy -> vercel-services |
| cloudflare-worker | wrangler, workers-best-practices | 50.0 | 50.0 | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare / 2 | building-mcp-server-on-cloudflare -> wrangler -> cloudflare-deploy -> building-ai-agent-on-cloudflare -> workers-best-practices |
| skill-create | skill-creator | 90.0 | 50.0 | skill-creator / 1 | hatch-pet / 2 | hatch-pet -> skill-creator -> skillweaver -> skill-installer -> dev-documentation-systems |
| skillweaver-self | skillweaver | 100.0 | 100.0 | skillweaver / 1 | skillweaver / 1 | skillweaver -> deep-security-scan -> skill-security-auditor -> skill-creator -> routing-middleware |
| pdf-extract | pdf | 80.0 | 80.0 | pdf / 1 | pdf / 1 | pdf -> reports-pdfs-and-slide-automation -> playwright -> resume-cover-letter-tailor -> chart-data-extractor |
| spreadsheet-analysis | Spreadsheets | 50.0 | 80.0 | analyze-data-quality / 2 | Spreadsheets / 1 | Spreadsheets -> chart-data-extractor -> analyze-data-quality -> user-research-synthesis -> data-pipeline-spec |
| presentation-deck | Presentations, roadmap-presentation | 100.0 | 100.0 | roadmap-presentation / 1 | roadmap-presentation / 1 | roadmap-presentation -> Presentations -> template-creator -> roadmap-narrative -> reports-pdfs-and-slide-automation |
| hf-train | huggingface-llm-trainer, huggingface-datasets | 100.0 | 100.0 | huggingface-llm-trainer / 1 | huggingface-llm-trainer / 1 | huggingface-llm-trainer -> huggingface-paper-publisher -> huggingface-vision-trainer -> huggingface-community-evals -> huggingface-papers |
| hf-dataset | huggingface-datasets | 100.0 | 100.0 | huggingface-datasets / 1 | huggingface-datasets / 1 | huggingface-datasets -> huggingface-community-evals -> huggingface-papers -> huggingface-paper-publisher -> huggingface-llm-trainer |
| gmail-triage | gmail, gmail-inbox-triage | 100.0 | 100.0 | gmail-inbox-triage / 1 | gmail / 1 | gmail -> gmail-inbox-triage -> email-triage -> triage-finding -> gh-fix-ci |
| phaser-game | phaser-2d-game | 80.0 | 90.0 | phaser-2d-game / 1 | phaser-2d-game / 1 | phaser-2d-game -> game-studio -> three-webgl-game -> web-game-foundations |
| three-game | three-webgl-game | 80.0 | 80.0 | three-webgl-game / 1 | three-webgl-game / 1 | three-webgl-game -> threejs-data-visualization -> racingsim-game-dev -> canvas2d-data-visualization -> react-three-fiber-game |
| adr | architecture-decision-record | 100.0 | 80.0 | architecture-decision-record / 1 | architecture-decision-record / 1 | architecture-decision-record -> uml-and-software-architecture-visualization -> dev-backend-api-design -> security-threat-model -> system-design-interview |
| cro-reporting | analytics-cro-and-reporting | 80.0 | 80.0 | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting / 1 | analytics-cro-and-reporting -> marketing-strategy-and-growth -> audit -> data-analysis-standard -> dev-mobile-desktop |
| linear-planning | linear | 80.0 | 80.0 | linear / 1 | linear / 1 | linear -> dependency-audit -> product-launch-checklist -> database-migration-plan -> ux-research-plan |
| openai-docs | openai-docs | 80.0 | 80.0 | openai-docs / 1 | openai-docs / 1 | openai-docs -> chatgpt-apps -> openai-agents-js -> dev-release-productization -> api-docs-writer |
| openai-agents | openai-agents-js | 100.0 | 100.0 | openai-agents-js / 1 | openai-agents-js / 1 | openai-agents-js -> openai-docs -> workflow -> agents-sdk -> dev-ai-llm-apps |
| browser-qa | playwright, frontend-testing-debugging | 46.7 | 46.7 | control-in-app-browser / 3 | control-in-app-browser / 3 | control-in-app-browser -> playwright -> agent-browser -> frontend-testing-debugging -> cli-creator |
| chrome-control | control-chrome, chrome:control-chrome | 80.0 | 30.0 | control-chrome / 1 | control-in-app-browser / 2 | control-in-app-browser -> control-chrome -> url-to-code -> design-prototype -> design-url-to-code |

## Interpretation

SkillWeaver improves the composite output-quality score by +2.5 points on a 0-100 rubric over flat metadata search.
It improves primary selection by +3.3 percentage points and expected-skill top/workflow-5 retrieval by 0.0 percentage points over flat metadata search on this benchmark.
Flat metadata still has a slight edge on mean expected-skill rank: 1.7 candidates versus 2.2 for SkillWeaver. SkillWeaver's quality gain comes from better primary choices and slightly better support-skill coverage, not faster first expected-skill rank on this dataset.
Remaining weak spots are cases where a broad foundational skill is a plausible primary but a more concrete plugin task skill should be preferred, especially data dashboard work.
