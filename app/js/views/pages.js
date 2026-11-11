// Profile, controls, start and about pages.

import { h } from '../dom.js';
import { PROFILE_FIELDS } from '../model.js';
import { field, readForm } from './collection.js';
import { findings } from '../pdpa.js';

export function renderProfile(root, biz, onSave) {
  const form = h('form', { class: 'card form', onsubmit: (e) => {
    e.preventDefault();
    Object.assign(biz.profile, readForm(form, PROFILE_FIELDS));
    onSave();
    msg.textContent = 'Saved.';
  } },
    h('div', { class: 'grid' }, PROFILE_FIELDS.map((f) => field(f, biz.profile[f.key], 'profile'))),
    h('div', { class: 'actions' }, h('button', { type: 'submit', class: 'primary' }, 'Save profile')),
  );
  const msg = h('p', { class: 'status', role: 'status' });
  root.append(h('div', { class: 'section-head' }, h('div', {}, h('h2', {}, 'Business profile'),
    h('p', { class: 'help' }, 'The type of business and legal form decide whether it must register with JPDP.'))), form, msg);
}

const FN_ORDER = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

export function renderControls(root, biz, controls, focus) {
  const flagged = new Set(biz ? findings(biz).map((f) => f.control) : []);
  const used = {};
  for (const r of biz?.risks || []) for (const id of String(r.controls).toUpperCase().match(/[A-Z]{2}-\d+/g) || []) (used[id] ||= []).push(r.title);
  root.append(h('div', { class: 'section-head' }, h('div', {}, h('h2', {}, 'Toolkit controls'),
    h('p', { class: 'help' }, `${controls.length} controls for small businesses, mapped to NIST CSF 2.0, ISO/IEC 27001:2022 (numbers only) and CIS Controls v8.1 IG1. ⚑ = flagged by this business's inventory.`))));
  for (const fn of FN_ORDER) {
    root.append(h('h3', { class: 'fn-head' }, fn));
    for (const c of controls.filter((x) => x.fn === fn)) {
      const card = h('article', { class: `card control${flagged.has(c.id) ? ' control-flagged' : ''}${focus === c.id ? ' control-focus' : ''}`, id: `control-${c.id}` },
        h('div', { class: 'duty-head' }, h('strong', {}, `${c.id} ${c.title}`), flagged.has(c.id) ? h('span', { class: 'pill pill-bad' }, '⚑ Flagged') : null),
        h('p', {}, c.what),
        h('dl', { class: 'refs' },
          h('dt', {}, 'CSF 2.0'), h('dd', {}, c.csf.join(', ')),
          h('dt', {}, 'ISO 27001'), h('dd', {}, c.iso.join(', ') || '–'),
          h('dt', {}, 'CIS IG1'), h('dd', {}, c.cis.join(', ') || '–'),
          h('dt', {}, 'PDPA'), h('dd', {}, c.pdpa || '–'),
          used[c.id] ? [h('dt', {}, 'Risks'), h('dd', {}, used[c.id].join('; '))] : null,
        ));
      root.append(card);
    }
  }
  if (focus) queueMicrotask(() => document.getElementById(`control-${focus}`)?.scrollIntoView({ block: 'center' }));
}

export function renderStart(root, { onNew, onExample, onImport, examples }) {
  root.append(
    h('section', { class: 'hero' },
      h('h2', {}, 'Security and PDPA starter kit for small businesses'),
      h('p', {}, 'List your devices, accounts and personal data, rate your risks, and see which PDPA duties apply and what to fix first.'),
      h('p', { class: 'privacy' }, '🔒 Everything you enter stays in this browser on this device. Nothing is sent to a server. Use "Save file" to keep a copy.'),
    ),
    h('div', { class: 'start-grid' },
      h('section', { class: 'card' }, h('h3', {}, 'Start'),
        h('button', { type: 'button', class: 'primary', onclick: onNew }, 'Add your business'), ' ',
        h('label', { class: 'button' }, 'Open a saved file', h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', onchange: onImport }))),
      h('section', { class: 'card' }, h('h3', {}, 'Explore an example'),
        h('p', { class: 'help' }, 'Five fictional businesses with realistic gaps.'),
        h('ul', { class: 'examples' }, examples.map((x) => h('li', {}, h('button', { type: 'button', onclick: () => onExample(x) }, x.name), h('span', { class: 'help' }, ` ${x.desc}`))))),
    ),
  );
}

export function renderAbout(root) {
  root.append(h('section', { class: 'card prose' },
    h('h2', {}, 'About this toolkit'),
    h('p', {}, 'A free starter kit to help Malaysian small businesses get security and personal data protection basics right. It is built on the NIST Cybersecurity Framework 2.0, mapped to ISO/IEC 27001:2022 and CIS Controls v8.1 (Implementation Group 1), and covers the Personal Data Protection Act 2010 as amended in 2024.'),
    h('h3', {}, 'Your data'),
    h('p', {}, 'The app runs entirely in your browser. Your entries are saved in this browser\'s storage on this device and in any file you export. There is no server, account, analytics or tracking. Clearing your browser data deletes your entries, so save a file.'),
    h('h3', {}, 'Not legal advice'),
    h('p', {}, 'The PDPA checks are indications based on the JPDP guidelines and circulars listed in the project documents (checked 11 Nov 2026). For legal questions, check pdp.gov.my or ask a lawyer.'),
  ));
}
