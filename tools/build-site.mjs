// Assemble the public site into dist/ for Cloudflare Pages (no dependencies).
// Only what the browser app needs is published: no tests, tools or git metadata.
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";

const PUBLIC = ["index.html", "app", "data", "toolkit", "case-study", "docs", "LICENSE", "README.md"];
const OUT = "dist";

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const path of PUBLIC) {
  if (!existsSync(path)) throw new Error(`missing ${path}`);
  cpSync(path, `${OUT}/${path}`, { recursive: true, filter: (p) => !p.endsWith(".DS_Store") });
}
cpSync("deploy/_headers", `${OUT}/_headers`);
console.log(`built ${OUT}/ (${PUBLIC.join(", ")}, _headers)`);
