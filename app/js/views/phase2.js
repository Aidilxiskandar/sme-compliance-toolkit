// Policies, PDPA checklist and breach plan pages (Phase 2).

import { h, clear } from '../dom.js';
import { CHECK_STATUS } from '../model.js';
import { breachImpact } from '../pdpa.js';
import { applies, checklistScore } from '../checklist.js';
import { fill, render } from '../md.js';
import { download } from '../export.js';
import { slug } from './collection.js';

export const POLICIES = [
  ['01-acceptable-use.md', 'Acceptable use'],
  ['02-passwords-and-mfa.md', 'Passwords and MFA'],
  ['03-access-control.md', 'Access control'],
  ['04-devices-updates-backups.md', 'Devices, updates and backups'],
  ['05-personal-data-protection.md', 'Personal data protection'],
  ['06-clear-desk-and-physical.md', 'Clear desk and physical security'],
];

const cache = new Map();
async function getText(path) {
  if (!cache.has(path)) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Could not load ${path}`);
    cache.set(path, await res.text());
  }
  return cache.get(path);
}

const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const cell = (s) => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');

export function values(biz) {
  const now = new Date();
  const review = new Date(now);
  review.setFullYear(now.getFullYear() + 1);
  const p = biz.profile;
  const priority = ['email', 'banking', 'cloud', 'business_app', 'remote', 'social', 'ads', 'marketplace'];
  const key = [...biz.accounts].sort((a, b) => priority.indexOf(a.kind) - priority.indexOf(b.kind))
    .filter((a) => priority.includes(a.kind)).slice(0, 5).map((a) => a.service);
  const rows = biz.dataSets.map((d) => {
    const b = breachImpact(d);
    return `| ${cell(d.name)} | ${(d.count || 0).toLocaleString('en-MY')} | ${b.notifyCommissioner ? 'Yes' : 'Only if harm or >1,000 people'} | ${b.notifyIndividuals ? 'Yes' : 'Only if significant harm'} |`;
  });
  return {
    business: p.name, responsible: p.contact, backup: p.backup, itSupport: p.itSupport,
    date: fmtDate(now), review: fmtDate(review),
    keyAccounts: key.length ? key.join(', ') : 'email, banking and cloud storage',
    dataTable: rows.length
      ? ['| Data | People | Tell JPDP if breached? | Tell the people? |', '|---|---|---|---|', ...rows].join('\n')
      : '*No personal data sets listed yet. Add them on the Personal data page.*',
  };
}

function docHead(title, help, actions) {
  return h('div', { class: 'section-head' }, h('div', {}, h('h2', {}, title), h('p', { class: 'help' }, help)), h('div', { class: 'actions no-print' }, actions));
}

export async function renderPolicies(root, biz, which) {
  const v = values(biz);
  const current = POLICIES.find(([f]) => f === which) || null;
  let texts;
  try {
    texts = await Promise.all(POLICIES.map(([f]) => getText(`../toolkit/policies/${f}`).then((t) => fill(t, v))));
  } catch (e) {
    root.append(h('p', { class: 'empty' }, String(e.message)));
    return;
  }
  const all = () => texts.join('\n\n');
  root.append(docHead('Policy pack', `Six one-page policies, filled in with ${biz.profile.name}'s details from the Profile page. Blanks (____) are for you to complete. Print them, or download and edit.`, [
    h('button', { type: 'button', onclick: () => window.print() }, 'Print'),
    h('button', { type: 'button', class: 'primary', onclick: () => download(`${slug(biz.profile.name)}-policies.md`, all(), 'text/markdown') }, 'Download all (Markdown)'),
  ]));
  if (!biz.profile.contact) root.append(h('p', { class: 'note-inline' }, 'Tip: add the responsible person on the Profile page so their name appears in the policies.'));
  root.append(h('nav', { class: 'chips no-print', 'aria-label': 'Policies' },
    h('a', { href: '#/policies', class: current ? '' : 'active' }, 'All'),
    POLICIES.map(([f, t]) => h('a', { href: `#/policies/${f}`, class: current?.[0] === f ? 'active' : '' }, t))));
  POLICIES.forEach(([f], i) => {
    if (current && current[0] !== f) return;
    root.append(h('article', { class: 'card doc' }, render(texts[i]),
      h('p', { class: 'no-print' }, h('button', { type: 'button', onclick: () => download(`${slug(biz.profile.name)}-${f}`, texts[i], 'text/markdown') }, 'Download this policy'))));
  });
}

export function renderChecklist(root, biz, items, onSave) {
  const draw = () => {
    clear(root);
    const sc = checklistScore(items, biz);
    root.append(docHead('PDPA checklist',
      `${items.length} checks from the Act, the 2024 amendments and the JPDP guidelines. Items that don't apply to this business are hidden. Not legal advice.`,
      [h('button', { type: 'button', onclick: () => window.print() }, 'Print')]));
    root.append(h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('span', { class: 'stat-value' }, `${sc.percent}%`), h('span', { class: 'stat-label' }, `in place (${sc.points} of ${sc.total} applicable checks)`)),
      h('div', { class: 'stat' }, h('span', { class: 'stat-value' }, `${sc.answered}/${sc.total}`), h('span', { class: 'stat-label' }, 'answered'))));
    const groups = [...new Set(items.map((i) => i.group))];
    for (const g of groups) {
      const list = items.filter((i) => i.group === g && applies(i, biz));
      if (!list.length) continue;
      root.append(h('h3', { class: 'fn-head' }, g));
      for (const it of list) {
        const ans = biz.checklist[it.id] || { status: 'unknown', note: '' };
        const sel = h('select', { 'aria-label': `Answer for ${it.id}`, onchange: (e) => { biz.checklist[it.id] = { ...ans, status: e.target.value }; onSave(); draw(); } },
          CHECK_STATUS.map(([k, l]) => h('option', { value: k, selected: k === ans.status }, l)));
        const note = h('input', { type: 'text', maxlength: 2000, placeholder: 'Note (optional)', 'aria-label': `Note for ${it.id}`, value: ans.note,
          onchange: (e) => { biz.checklist[it.id] = { status: biz.checklist[it.id]?.status || 'unknown', note: e.target.value.slice(0, 2000) }; onSave(); } });
        root.append(h('div', { class: `card check-item status-${ans.status}` },
          h('div', { class: 'check-q' }, h('span', { class: 'ctl' }, it.id), ' ', h('strong', {}, it.q)),
          h('p', { class: 'help' }, it.help),
          h('div', { class: 'check-row' }, sel, note),
          h('p', { class: 'source' }, `${it.ref} · control `, h('a', { href: `#/controls/${it.control}` }, it.control))));
      }
    }
  };
  draw();
}

export async function renderPlan(root, biz) {
  let text;
  try {
    text = fill(await getText('../toolkit/incident-breach-plan.md'), values(biz));
  } catch (e) {
    root.append(h('p', { class: 'empty' }, String(e.message)));
    return;
  }
  root.append(docHead('Incident and breach plan', 'Generated from the Profile, Accounts and Personal data pages. Print it and keep it near the main computer.', [
    h('button', { type: 'button', onclick: () => window.print() }, 'Print'),
    h('button', { type: 'button', class: 'primary', onclick: () => download(`${slug(biz.profile.name)}-incident-breach-plan.md`, text, 'text/markdown') }, 'Download (Markdown)'),
  ]));
  root.append(h('article', { class: 'card doc' }, render(text)));
}
