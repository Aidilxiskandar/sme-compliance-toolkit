import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { validateBusiness } from '../app/js/model.js';
import { applies, checklistScore } from '../app/js/checklist.js';
import { fill } from '../app/js/md.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const items = JSON.parse(read('data/pdpa-checklist.json')).items;
const controls = new Set(JSON.parse(read('data/controls.json')).controls.map((c) => c.id));
const ex = Object.fromEntries(readdirSync(new URL('../data/examples/', import.meta.url))
  .map((f) => [f.slice(0, 2), JSON.parse(read(`data/examples/${f}`))]));

test('checklist answers survive validation for all examples', () => {
  for (const b of Object.values(ex)) assert.deepEqual(validateBusiness(b).value.checklist, b.checklist);
});

test('checklist items are well formed and point at real controls', () => {
  const ids = new Set();
  for (const it of items) {
    assert.match(it.id, /^[A-Z]\d{2}$/);
    assert.ok(!ids.has(it.id), `duplicate ${it.id}`); ids.add(it.id);
    assert.ok(controls.has(it.control), `${it.id} -> unknown control ${it.control}`);
    assert.ok(it.ref && it.q && it.help);
  }
});

test('checklist applicability follows the business', () => {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  assert.equal(applies(byId.K01, ex['01']), false, 'cafe: F&B need not register');
  assert.equal(applies(byId.K01, ex['02']), true, 'clinic must register');
  assert.equal(applies(byId.N03, ex['02']), true, 'clinic holds sensitive data');
  assert.equal(applies(byId.N04, ex['05']), true, 'tuition centre holds minors\' data');
  assert.equal(applies(byId.N04, ex['04']), false);
  assert.equal(applies(byId.N06, ex['01']), true, 'cafe has CCTV');
});

test('checklist score', () => {
  const its = [{ id: 'X01' }, { id: 'X02' }, { id: 'X03' }, { id: 'X04' }];
  const biz = { profile: {}, dataSets: [], assets: [], checklist: { X01: { status: 'yes' }, X02: { status: 'partly' }, X03: { status: 'na' } } };
  assert.deepEqual(checklistScore(its, biz), { points: 1.5, total: 3, answered: 2, percent: 50 });
  assert.ok(checklistScore(items, ex['04']).percent > checklistScore(items, ex['05']).percent, 'accounting firm is ahead of the tuition centre');
});

test('hostile checklist data is cleaned', () => {
  const v = validateBusiness({ schema: 'sme-toolkit/1', profile: { name: 'x' },
    checklist: { K01: { status: 'yes', note: 'ok' }, '__proto__': { status: 'yes' }, 'bad id': { status: 'yes' }, N01: { status: 'hacked', note: 7 }, N02: 'string' } }).value;
  assert.deepEqual(v.checklist, { K01: { status: 'yes', note: 'ok' }, N01: { status: 'unknown', note: '7' } });
});

test('templates only use placeholders the app fills', () => {
  const known = new Set(['business', 'responsible', 'backup', 'itSupport', 'date', 'review', 'keyAccounts', 'dataTable']);
  const files = [...readdirSync(new URL('../toolkit/policies/', import.meta.url)).map((f) => `toolkit/policies/${f}`), 'toolkit/incident-breach-plan.md'];
  assert.equal(files.length, 7);
  for (const f of files) for (const [, k] of read(f).matchAll(/\{\{(\w+)\}\}/g)) assert.ok(known.has(k), `${f}: unknown placeholder ${k}`);
});

test('fill replaces placeholders and blanks missing values', () => {
  assert.equal(fill('{{business}} / {{responsible}} / {{other}}', { business: 'Kopi', responsible: '' }), 'Kopi / __________ / __________');
});

// ---- Phase 3 ----
import { roundScore, assuranceGaps, gapFound, gapClosed, costTotals } from '../app/js/assess.js';
import { execFileSync } from 'node:child_process';
const ctl = JSON.parse(read('data/controls.json')).controls;
const bank = JSON.parse(read('data/assessment.json'));
const keys = JSON.parse(read('data/answer-keys.json')).businesses;

test('question bank has exactly one question per control', () => {
  assert.deepEqual(bank.questions.map((q) => q.id).sort(), [...controls].sort());
  for (const q of bank.questions) assert.ok(q.ask && q.check && q.good, q.id);
});

test('coverage: every planted gap is reachable by a question\'s evidence step', () => {
  const out = execFileSync(process.execPath, [new URL('../tools/coverage.mjs', import.meta.url).pathname], { encoding: 'utf8' });
  assert.match(out, /Covered 40 of 40/);
});

test('round scoring, assurance gaps, found and closed', () => {
  const c = [{ id: 'PR-2', fn: 'Protect', title: 'MFA' }, { id: 'PR-10', fn: 'Protect', title: 'Backups' }, { id: 'GV-1', fn: 'Govern', title: 'Owner' }];
  const self = { answers: { 'PR-2': { level: 3 }, 'PR-10': { level: 2 }, 'GV-1': { level: null } } };
  const ver = { answers: { 'PR-2': { level: 0 }, 'PR-10': { level: 2 } } };
  assert.equal(roundScore(self, c).overall, 83, '5 of 6 points; N/A excluded');
  assert.equal(roundScore(ver, c).byFunction.Govern, null);
  assert.deepEqual(assuranceGaps(self, ver, c).map((g) => g.id), ['PR-2']);
  const gap = { controls: ['PR-10', 'PR-2'] };
  assert.equal(gapFound(gap, ver), true, 'found through the secondary control');
  assert.equal(gapClosed(gap, ver), true, 'closed because the primary control is at 2');
  assert.equal(gapClosed({ controls: ['PR-2'] }, ver), false);
});

test('every example has three rounds that tell the expected story', () => {
  for (const [num, b] of Object.entries(ex)) {
    assert.equal(b.assessments.length, 3, num);
    const [s, v, a] = b.assessments.map((r) => roundScore(r, ctl).overall);
    assert.ok(s > v, `${num}: self-assessment should be higher than verified`);
    assert.ok(a > v, `${num}: after fixes should beat before`);
    assert.equal(keys[num].filter((g) => gapFound(g, b.assessments[1])).length, 8, `${num}: verified round finds all planted gaps`);
    assert.ok(assuranceGaps(b.assessments[0], b.assessments[1], ctl).length > 0, num);
  }
});

test('cost totals', () => {
  const t = costTotals([{ oneOff: 100, monthly: 10, hours: 1.5, status: 'done' }, { oneOff: 50, monthly: 0, hours: 2, status: 'planned' }], 'done');
  assert.deepEqual(t, { oneOff: 100, monthly: 10, hours: 1.5, count: 1 });
});
