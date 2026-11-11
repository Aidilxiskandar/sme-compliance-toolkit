import { withBrowser } from './cdp.mjs';
const F = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await withBrowser(async ({ send, evaluate, go, events, dialogs, BASE }) => {
  const R = {}; const log = (m) => console.error('…', m);
  log('// 1.');
  // 1. CSP as second layer: force an injection and see if the inline handler runs
  await go(`${BASE}/app/`);
  R.cspBlocksInjectedHandler = await evaluate(`new Promise(res => { window.__x = 0; const d = document.createElement('div'); d.innerHTML = '<img src=x onerror="window.__x=1">'; document.body.appendChild(d); setTimeout(() => res(window.__x === 0), 500); })`);
  R.cspBlocksInlineScript = await evaluate(`new Promise(res => { window.__y = 0; const s = document.createElement('script'); s.textContent = 'window.__y=1'; document.body.appendChild(s); setTimeout(() => res(window.__y === 0), 300); })`);
  R.cspBlocksExternalFetch = await evaluate(`fetch('https://example.com/x').then(() => false, () => true)`);
  log('// 2.');
  // 2. Malformed hashes
  const before = events.filter((e) => e.method === 'Runtime.exceptionThrown').length;
  for (const h of ['#/controls/%E0%A4%A', '#/policies/..%2F..%2F.git%2Fconfig', '#/example/99', '#/example/../../etc', '#/assessment/%3Cimg%3E', '#/' + 'a'.repeat(5000)]) {
    await evaluate(`location.hash = ${JSON.stringify(h)}; true`); await sleep(500);
  }
  const ex = events.filter((e) => e.method === 'Runtime.exceptionThrown').slice(before).map((e) => e.params.exceptionDetails.exception?.description?.split('\n')[0]);
  R.hashExceptions = ex;
  R.appStillRenders = await evaluate(`location.hash = '#/'; new Promise(r => setTimeout(() => r(document.querySelector('main').textContent.length > 50), 500))`);
  log('// 3.');
  // 3. Import fuzzing through the real file input
  const { root } = (await send('DOM.getDocument')).result;
  const results = {};
  for (const f of ['big.json', 'broken.json', 'deep.json', 'proto.json', 'many.json', 'types.json']) {
    log(f); await go(`${BASE}/app/?i=${f}#/`, 1200);
    const doc = (await send('DOM.getDocument')).result.root;
    const q = (await send('DOM.querySelector', { nodeId: doc.nodeId, selector: 'header input[type=file]' })).result;
    const d0 = dialogs().length;
    await send('DOM.setFileInputFiles', { nodeId: q.nodeId, files: [`${F}/${f}`] });
    await sleep(1500);
    const dl = dialogs().slice(d0).map((d) => d.params.message.slice(0, 80));
    await sleep(500);
    results[f] = { dialogs: dl, state: await evaluate(`(() => { const s = JSON.parse(localStorage.getItem('sme-toolkit:v1:businesses') || '{}'); const b = Object.values(s).find(x => x.profile && (x.id === '${f.replace('.json','')}' || x.id === 'fz')) || Object.values(s).slice(-1)[0]; return { stored: Object.keys(s).length, assets: b?.assets?.length, name: b?.profile?.name, polluted: ({}).polluted || ({}).polluted2 || ({}).polluted3 || null, protoKeys: b ? Object.keys(b.checklist || {}).length + '/' + Object.keys((b.assessments||[])[0]?.answers || {}).length : null }; })()`) };
  }
  R.imports = results;
  log('// 4.');
  // 4. Clickjacking: can another page frame the app?
  await go(`${BASE}/app/`); 
  await evaluate(`document.open(); document.write('<iframe id=f src="${BASE}/app/#/" width=800 height=600></iframe>'); document.close(); true`);
  await sleep(2000);
  R.framedRenders = await evaluate(`(() => { try { return document.getElementById('f').contentDocument.querySelector('main').textContent.length > 50; } catch (e) { return 'cross-origin: ' + e.name; } })()`);
  log('// 5.');
  // 5. Storage full
  await go(`${BASE}/app/?full=1#/`, 1000);
  R.storageFull = await evaluate(`(() => { try { let s = 'x'.repeat(1024*1024); for (let i = 0; i < 20; i++) localStorage.setItem('junk' + i, s); } catch (e) {} return 'filled'; })()`);
  await go(`${BASE}/app/?full=2#/example/01`, 2500);
  R.afterFull = await evaluate(`({ note: document.getElementById('note').textContent.slice(0, 90), rendered: document.querySelector('main').textContent.includes('Kopi Senja') })`);
  console.log(JSON.stringify(R, null, 1));
});
