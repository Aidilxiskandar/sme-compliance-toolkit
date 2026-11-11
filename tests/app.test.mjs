// Run with: npm test   (or: node --test tests/*.test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { validateBusiness, newBusiness, COLLECTIONS, defaultsFor } from '../app/js/model.js';
import { registration, dpo, breachImpact, findings } from '../app/js/pdpa.js';
import { score, level, matrix } from '../app/js/risk.js';
import { csvCell, toCsv } from '../app/js/export.js';

const examplesDir = new URL('../data/examples/', import.meta.url);
const examples = readdirSync(examplesDir).filter((f) => f.endsWith('.json'))
  .map((f) => [f, JSON.parse(readFileSync(new URL(f, examplesDir), 'utf8'))]);
const ex = (prefix) => examples.find(([f]) => f.startsWith(prefix))[1];

test('five example businesses exist', () => assert.equal(examples.length, 5));

for (const [file, raw] of examples) {
  test(`${file} survives validation unchanged`, () => {
    const { ok, errors, value } = validateBusiness(raw);
    assert.ok(ok);
    assert.deepEqual(errors, []);
    for (const k of Object.keys(COLLECTIONS)) assert.deepEqual(value[k], raw[k], `${k} changed during validation`);
    assert.equal(value.profile.fictional, true);
  });
}

test('registration: clinic and accounting firm must register; cafe does not', () => {
  assert.equal(registration(ex('02').profile).status, 'yes');
  assert.equal(registration(ex('02').profile).fee, 300);
  assert.equal(registration(ex('04').profile).status, 'yes');
  assert.equal(registration(ex('04').profile).fee, 200);
  assert.equal(registration(ex('01').profile).status, 'no');
  assert.equal(registration({ sector: 'education_private', legalForm: 'sole' }).status, 'check');
});

test('registration: LLP (PLT) is excluded', () => {
  assert.equal(registration({ sector: 'accounting', legalForm: 'llp' }).status, 'no');
});

test('DPO thresholds', () => {
  assert.equal(dpo([{ count: 20000 }]).status, 'no', 'exactly 20,000 is not "more than"');
  assert.equal(dpo([{ count: 20001 }]).status, 'yes');
  assert.equal(dpo([{ count: 10001, sensitive: true }]).status, 'yes');
  assert.equal(dpo([{ count: 10001, financial: true }]).status, 'yes', 'financial counts with sensitive');
  assert.equal(dpo([{ count: 10, monitoring: 'behavioural_ads' }]).status, 'likely');
  assert.equal(dpo([{ count: 10, monitoring: 'cctv' }]).status, 'grey');
  assert.equal(dpo([{ count: 15000 }, { count: 15000 }]).status, 'likely', 'only the overlapping sum is over 20,000');
  assert.equal(dpo([{ count: 6000, sensitive: true }, { count: 6000, financial: true }]).status, 'likely');
});

test('DPO results for the five examples', () => {
  assert.equal(dpo(ex('01').dataSets).status, 'grey');   // cafe: CCTV only
  assert.equal(dpo(ex('02').dataSets).status, 'yes');    // clinic: >10,000 sensitive
  assert.equal(dpo(ex('03').dataSets).status, 'yes');    // shop: visitors + customers >20,000, plus ad tracking
  assert.equal(dpo(ex('04').dataSets).status, 'yes');    // accounting: >10,000 financial
  assert.equal(dpo(ex('05').dataSets).status, 'no');     // tuition centre
});

test('breach notification rules', () => {
  const plain = breachImpact({ count: 500 });
  assert.equal(plain.notifyCommissioner, false);
  assert.equal(plain.notifyIndividuals, false);
  const big = breachImpact({ count: 1001 });
  assert.equal(big.notifyCommissioner, true, 'over 1,000 = significant scale');
  assert.equal(big.notifyIndividuals, false, 'scale alone does not require telling individuals');
  const health = breachImpact({ count: 5, sensitive: true });
  assert.equal(health.notifyCommissioner, true, 'sensitive data = significant harm whatever the size');
  assert.equal(health.notifyIndividuals, true);
  assert.equal(breachImpact({ count: 5, idNumbers: true }).notifyIndividuals, true);
});

test('findings flag the planted gaps', () => {
  const f = Object.fromEntries(findings(ex('04')).map((x) => [x.control, x.items]));
  assert.ok(f['PR-2'].includes('Cloud email and office (12 users)'));
  assert.ok(f['PR-9'].includes('Office NAS (all client folders)'));
  const cafe = Object.fromEntries(findings(ex('01')).map((x) => [x.control, x.items]));
  assert.ok(cafe['PR-3'].includes('CCTV DVR (4 cameras)'));
});

test('risk scoring', () => {
  assert.equal(score({ likelihood: 4, impact: 5 }), 20);
  assert.equal(level(20), 'critical');
  assert.equal(level(12), 'high');
  assert.equal(level(6), 'medium');
  assert.equal(level(5), 'low');
  const g = matrix([{ likelihood: 2, impact: 5 }, { likelihood: 2, impact: 5, status: 'done' }]);
  assert.equal(g[4][1], 1, 'done risks are not counted');
});

test('import validation: hostile and broken files', () => {
  assert.equal(validateBusiness(null).ok, false);
  assert.equal(validateBusiness([1, 2]).ok, false);
  const evil = validateBusiness({
    schema: 'sme-toolkit/1', id: '"><img src=x onerror=alert(1)>', __proto__: { admin: true },
    profile: { name: '<script>alert(1)</script>', staff: 'lots', sector: 'hacker', extra: 'dropped' },
    accounts: [{ service: 'Email', mfa: 'definitely', id: '../../etc' }, 'not an object', null],
    risks: [{ title: 'x', likelihood: 99, impact: -4, due: 'tomorrow' }],
  });
  assert.ok(evil.ok);
  const v = evil.value;
  assert.match(v.id, /^[0-9a-f]{16}$/, 'bad id replaced');
  assert.equal(v.profile.extra, undefined, 'unknown keys dropped');
  assert.equal(v.profile.staff, 0);
  assert.equal(v.profile.sector, 'fnb', 'unknown sector falls back to first option');
  assert.equal(v.profile.name, '<script>alert(1)</script>', 'kept as plain text; the UI only renders text nodes');
  assert.equal(v.accounts.length, 1, 'non-objects dropped');
  assert.equal(v.accounts[0].mfa, 'unknown', 'invalid MFA answer must become unknown, never yes');
  assert.match(v.accounts[0].id, /^[0-9a-f]{16}$/);
  assert.equal(v.risks[0].likelihood, 5);
  assert.equal(v.risks[0].impact, 1);
  assert.equal(v.risks[0].due, '');
  assert.equal(validateBusiness({ schema: 'x', profile: { name: 'a'.repeat(5000) } }).value.profile.name.length, 2000);
});

test('new records never default to a "secure" answer', () => {
  const d = defaultsFor(COLLECTIONS.accounts.fields);
  assert.equal(d.mfa, 'unknown');
  assert.equal(d.sharedLogin, 'unknown');
  assert.equal(defaultsFor(COLLECTIONS.assets.fields).supported, 'unknown');
  assert.equal(newBusiness('x').accounts.length, 0);
});

test('CSV export neutralises spreadsheet formulas', () => {
  assert.equal(csvCell('=HYPERLINK("http://evil","x")'), `"'=HYPERLINK(""http://evil"",""x"")"`);
  assert.equal(csvCell('+60123'), "'+60123");
  assert.equal(csvCell('@SUM(A1)'), "'@SUM(A1)");
  assert.equal(csvCell('plain, text'), '"plain, text"');
  const csv = toCsv(COLLECTIONS.accounts.fields, [{ service: 'Mail', kind: 'email', mfa: 'no', sharedLogin: 'yes', businessOwned: 'yes', formerUsersRemoved: 'na', usedBy: '', notes: '' }]);
  assert.ok(csv.includes('Mail,Email,,No,Yes,Yes,Not applicable,'));
});
