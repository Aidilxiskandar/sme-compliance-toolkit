// Coverage check: is every planted gap revealed by the 'check' step of at least one of its controls?
// Usage: node tools/coverage.mjs   (exit code 1 if any gap is uncovered)
import { readFileSync } from 'node:fs';
const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const q = Object.fromEntries(read('data/assessment.json').questions.map((x) => [x.id, x]));
const keys = read('data/answer-keys.json').businesses;
let total = 0; const missing = [];
for (const [biz, gaps] of Object.entries(keys)) {
  for (const g of gaps) {
    total++;
    for (const c of g.controls) if (!q[c]) throw new Error(`${biz} gap ${g.gap}: unknown control ${c}`);
    const hit = g.controls.find((c) => q[c].check.toLowerCase().includes(g.evidence.toLowerCase()));
    if (!hit) missing.push(`${biz} gap ${g.gap}: "${g.text}" (needs "${g.evidence}" in ${g.controls.join('/')})`);
  }
}
console.log(`Covered ${total - missing.length} of ${total} planted gaps.`);
for (const m of missing) console.log('  UNCOVERED ' + m);
process.exitCode = missing.length ? 1 : 0;
