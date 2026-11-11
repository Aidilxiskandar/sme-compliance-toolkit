// Minimal Chrome DevTools Protocol harness for security tests. Usage: node cdp.mjs <test>
import { spawn } from 'node:child_process';
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:8765';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function withBrowser(fn) {
  const proc = spawn(CH, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9333', `--user-data-dir=${process.env.TMPDIR || '/tmp/'}cdp-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
  let ws, id = 0; const pending = new Map(); const events = [];
  try {
    let targets;
    for (let i = 0; i < 50; i++) { try { targets = await (await fetch('http://127.0.0.1:9333/json')).json(); if (targets.find((t) => t.type === 'page')) break; } catch {} await sleep(200); }
    const page = targets.find((t) => t.type === 'page');
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));
    ws.addEventListener('message', (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
      else if (d.method) {
        events.push(d);
        // auto-accept every alert/confirm/prompt so a modal can never block the test
        if (d.method === 'Page.javascriptDialogOpening') ws.send(JSON.stringify({ id: ++id, method: 'Page.handleJavaScriptDialog', params: { accept: true, promptText: 'Test business' } }));
      }
    });
    const send = (method, params = {}) => new Promise((r) => {
      const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
      setTimeout(() => { if (pending.has(i)) { pending.delete(i); r({ timeout: method }); } }, 8000);
    });
    await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
    const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
    const go = async (url, wait = 1200) => { await send('Page.navigate', { url }); await sleep(wait); };
    // auto-dismiss dialogs but record them (a dialog from injected code = XSS)
    const dialogs = () => events.filter((e) => e.method === 'Page.javascriptDialogOpening');
    return await fn({ send, evaluate, go, events, dialogs, BASE });
  } finally { try { ws?.close(); } catch {} proc.kill('SIGKILL'); }
}
