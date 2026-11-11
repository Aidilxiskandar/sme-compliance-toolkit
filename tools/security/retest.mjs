import { withBrowser } from './cdp.mjs';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await withBrowser(async ({ evaluate, go, events, dialogs, BASE }) => {
  const R = {};
  // malformed hashes
  await go(`${BASE}/app/`);
  const n0 = events.filter((e) => e.method === 'Runtime.exceptionThrown').length;
  for (const h of ['#/controls/%E0%A4%A', '#/%', '#/assessment/%ZZ', '#/' + 'a'.repeat(5000)]) { await evaluate(`location.hash=${JSON.stringify(h)};true`); await sleep(400); }
  R.hashExceptions = events.filter((e) => e.method === 'Runtime.exceptionThrown').slice(n0).length;
  // example overwrite: load example, edit name, then visit the example link again; dialog is auto-accepted = reset (that's the explicit choice)
  await go(`${BASE}/app/?a=1#/example/01`, 2000);
  await evaluate(`(() => { const s = JSON.parse(localStorage.getItem('sme-toolkit:v1:businesses')); s['example-01'].profile.name = 'My edited cafe'; localStorage.setItem('sme-toolkit:v1:businesses', JSON.stringify(s)); return true; })()`);
  const d0 = dialogs().length;
  await go(`${BASE}/app/?a=2#/example/01`, 2000);
  R.exampleLinkAsksFirst = dialogs().slice(d0).map((d) => d.params.message.split('\n')[0]);
  // storage completely full -> warning shown?
  await go(`${BASE}/app/?f=1#/`, 1000);
  R.filled = await evaluate(`(() => { localStorage.clear(); let size = 1024 * 1024, n = 0; while (size >= 16) { try { localStorage.setItem('junk' + n++, 'x'.repeat(size)); } catch { size = Math.floor(size / 2); } } return n; })()`);
  await go(`${BASE}/app/?f=2#/example/02`, 2500);
  R.afterFull = await evaluate(`({ note: document.getElementById('note').textContent, shown: document.querySelector('main').textContent.includes('Klinik') })`);
  await evaluate(`localStorage.clear(); true`);
  console.log(JSON.stringify(R, null, 1));
});
