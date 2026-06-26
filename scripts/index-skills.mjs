import { scanSkillRoots, summarizeIndex } from "../server/skill-scanner.js";

const index = await scanSkillRoots();
const summary = summarizeIndex(index);

console.log(JSON.stringify(summary, null, 2));

