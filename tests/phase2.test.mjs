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
