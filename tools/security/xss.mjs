import { withBrowser } from './cdp.mjs';
import { readFileSync } from 'node:fs';
// Hostile business: payloads in every text field of every collection
const P = [
  '<img src=x onerror="window.__pwned=1;alert(1)">',
  '<script>window.__pwned=1</script>',
  '"><svg onload="window.__pwned=1">',
  "javascript:window.__pwned=1",
  '**bold** `code` | pipe | <b>x</b> {{business}}',
  '=HYPERLINK("http://evil.example","click")',
];
const base = JSON.parse(readFileSync(new URL('../../data/examples/04-tan-rahim-associates.json', import.meta.url), 'utf8'));
let k = 0; const pick = () => P[k++ % P.length];
const poison = (o) => { for (const [key, v] of Object.entries(o)) if (typeof v === 'string' && key !== 'id' && !['kind','status','supported','encrypted','defaultPassword','internetExposed','mfa','sharedLogin','businessOwned','formerUsersRemoved','subjects','monitoring','notice','treatment','sector','legalForm','notifiedJPDP','notifiedPeople','found','due','jpdpDate','peopleDate'].includes(key)) o[key] = pick() + ' ' + v; };
poison(base.profile);
for (const c of ['assets','accounts','dataSets','risks','breaches','fixes']) base[c].forEach(poison);
base.assessments.forEach((r) => { r.name = pick(); for (const a of Object.values(r.answers)) a.note = pick(); });
for (const a of Object.values(base.checklist)) a.note = pick();
base.id = 'hostile-1';
const routes = ['dashboard','profile','assets','accounts','data','risks','checklist','policies','plan','breaches','assessment','actions','controls','controls/PR-2'];
const res = await withBrowser(async ({ evaluate, go, events, dialogs, BASE }) => {
  await go(`${BASE}/app/`);
  await evaluate(`localStorage.setItem('sme-toolkit:v1:businesses', JSON.stringify({ 'hostile-1': ${JSON.stringify(base)} })); localStorage.setItem('sme-toolkit:v1:active','hostile-1'); true`);
  await go(`${BASE}/app/?fresh=1#/dashboard`, 2000); // full reload so the app reads storage
  const out = [];
  for (const r of routes) {
    await evaluate(`location.hash = '#/${r}'; true`);
    await new Promise((res) => setTimeout(res, 900));
    const dom = await evaluate(`(() => ({
      pwned: !!window.__pwned,
      injected: document.querySelectorAll('main img, main svg, main script, main iframe, main object, main embed').length,
      onattrs: [...document.querySelectorAll('main *')].filter(e => [...e.attributes].some(a => a.name.startsWith('on'))).length,
      badHref: [...document.querySelectorAll('main a[href]')].filter(a => !/^(#|https:)/.test(a.getAttribute('href'))).length,
      payloadAsText: document.querySelector('main')?.textContent.includes('<img src=x onerror'),
      mainLen: document.querySelector('main')?.textContent.length || 0,
    }))()`);
    out.push({ route: r, ...dom });
  }
  const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => e.params.exceptionDetails.exception?.description?.split('\n')[0] || e.params.exceptionDetails.text);
  const csp = events.filter((e) => e.method === 'Log.entryAdded' && /Content Security Policy/i.test(e.params.entry.text)).map((e) => e.params.entry.text.slice(0, 160));
  return { out, dialogs: dialogs().length, errs, csp };
});
console.table(res.out);
console.log('dialogs:', res.dialogs, '\nexceptions:', res.errs, '\ncsp violations:', res.csp);
