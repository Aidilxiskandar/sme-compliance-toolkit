import { h } from '../dom.js';
import { SECTORS, LEGAL_FORMS } from '../model.js';
import { registration, dpo, breachImpact, findings } from '../pdpa.js';
import { score, level, LEVEL_LABEL, matrix, topRisks } from '../risk.js';

const STATUS = {
  yes: ['Required', 'pill-bad'],
  likely: ['Likely required', 'pill-warn'],
  check: ['Check', 'pill-warn'],
  grey: ['Grey area', 'pill-warn'],
  no: ['Not required', 'pill-ok'],
};

const label = (list, k) => (list.find(([x]) => x === k) || [, k])[1];
const pill = (status) => h('span', { class: `pill ${STATUS[status][1]}` }, STATUS[status][0]);

export function renderDashboard(root, biz) {
  const p = biz.profile;
  const reg = registration(p);
  const d = dpo(biz.dataSets);
  const open = biz.risks.filter((r) => r.status !== 'done');
  const serious = open.filter((r) => ['critical', 'high'].includes(level(score(r)))).length;
  const people = d.people.low === d.people.high ? d.people.low.toLocaleString('en-MY') : `${d.people.low.toLocaleString('en-MY')}–${d.people.high.toLocaleString('en-MY')}`;
  const f = findings(biz);

  root.append(
    h('div', { class: 'section-head' },
      h('div', {},
        h('h2', {}, p.name, p.fictional ? h('span', { class: 'badge' }, 'Fictional example') : null),
        h('p', { class: 'help' }, [label(SECTORS, p.sector), label(LEGAL_FORMS, p.legalForm), p.location, p.staff ? `${p.staff} staff` : ''].filter(Boolean).join(' · ')),
      ),
      h('div', { class: 'actions no-print' }, h('button', { type: 'button', onclick: () => window.print() }, 'Print report')),
    ),
    h('div', { class: 'stats' },
      stat(biz.assets.length, 'devices', '#/assets'),
      stat(biz.accounts.length, 'online accounts', '#/accounts'),
      stat(people, 'people whose data is held (data sets may overlap)', '#/data'),
      stat(serious, 'high or critical open risks', '#/risks', serious > 0),
    ),

    h('section', { class: 'card' },
      h('h3', {}, 'PDPA duties'),
      h('p', { class: 'help' }, 'Worked out from the profile and the personal data list. An indication to start from, not legal advice. See docs/pdpa-summary.md.'),
      h('div', { class: 'duty' }, h('div', { class: 'duty-head' }, h('strong', {}, 'Register with JPDP'), pill(reg.status)),
        h('p', {}, reg.reason, reg.fee ? ` Fee: RM${reg.fee} a year.` : ''), h('p', { class: 'source' }, reg.source)),
      h('div', { class: 'duty' }, h('div', { class: 'duty-head' }, h('strong', {}, 'Appoint a Data Protection Officer'), pill(d.status)),
        h('ul', {}, d.reasons.map((r) => h('li', {}, r))), h('p', { class: 'source' }, d.source)),
      h('div', { class: 'duty' }, h('div', { class: 'duty-head' }, h('strong', {}, 'If this data is breached')),
        biz.dataSets.length ? h('div', { class: 'table-wrap' }, h('table', {},
          h('thead', {}, h('tr', {}, h('th', {}, 'Data set'), h('th', {}, 'People'), h('th', {}, 'Tell JPDP (72 h)'), h('th', {}, 'Tell the people (7 days)'), h('th', {}, 'Why'))),
          h('tbody', {}, biz.dataSets.map((ds) => {
            const b = breachImpact(ds);
            return h('tr', {},
              h('td', { 'data-label': 'Data set' }, ds.name),
              h('td', { 'data-label': 'People' }, (ds.count || 0).toLocaleString('en-MY')),
              h('td', { 'data-label': 'Tell JPDP' }, yn(b.notifyCommissioner)),
              h('td', { 'data-label': 'Tell the people' }, yn(b.notifyIndividuals)),
              h('td', { 'data-label': 'Why' }, b.reasons.join('; ') || 'Not sensitive, financial or ID data, and under 1,000 people'));
          })),
        )) : h('p', { class: 'empty' }, 'Add personal data sets to see this.'),
        h('p', { class: 'source' }, 'Every breach, notified or not, goes in the breach register for at least 2 years. ', 'JPDP Guideline on Data Breach Notification (25 Feb 2025)')),
    ),

    h('section', { class: 'card' },
      h('h3', {}, 'Quick findings from the inventory'),
      f.length ? h('ul', { class: 'findings' }, f.map((x) => h('li', {},
        h('a', { href: `#/controls/${x.control}`, class: 'ctl' }, x.control), ' ',
        h('strong', {}, `${x.text} (${x.items.length})`), ': ', x.items.join(', ')))) : h('p', { class: 'empty' }, 'No quick findings. Add devices, accounts and data first.'),
    ),

    h('section', { class: 'card' },
      h('h3', {}, 'Risks'),
      h('div', { class: 'risk-layout' }, heatmap(open), topTable(open)),
    ),
  );
}

function stat(value, text, href, alert = false) {
  return h('a', { class: `stat${alert ? ' stat-alert' : ''}`, href }, h('span', { class: 'stat-value' }, String(value)), h('span', { class: 'stat-label' }, text));
}

function yn(v) {
  return h('span', { class: `pill ${v ? 'pill-bad' : 'pill-ok'}` }, v ? 'Yes' : 'No');
}

function heatmap(risks) {
  const g = matrix(risks);
  const rows = [];
  for (let i = 4; i >= 0; i--) {
    rows.push(h('tr', {}, h('th', { scope: 'row' }, String(i + 1)),
      g[i].map((n, j) => h('td', { class: `heat heat-${level((i + 1) * (j + 1))}`, title: `Impact ${i + 1}, likelihood ${j + 1}: ${n} risk(s)` }, n ? String(n) : ''))));
  }
  return h('figure', { class: 'heatmap' },
    h('table', {}, h('tbody', {}, rows, h('tr', {}, h('th', {}), [1, 2, 3, 4, 5].map((n) => h('th', { scope: 'col' }, String(n)))))),
    h('figcaption', {}, 'Open risks by impact (up) and likelihood (across)'));
}

function topTable(risks) {
  const top = topRisks(risks);
  if (!top.length) return h('p', { class: 'empty' }, 'No open risks.');
  return h('div', { class: 'table-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, 'Top open risks'), h('th', {}, 'Score'), h('th', {}, 'Controls'))),
    h('tbody', {}, top.map((r) => h('tr', {},
      h('td', { 'data-label': 'Risk' }, r.title),
      h('td', { 'data-label': 'Score' }, scorePill(r)),
      h('td', { 'data-label': 'Controls' }, r.controls || '–')))),
  ));
}

export function scorePill(r) {
  const s = score(r);
  const l = level(s);
  return h('span', { class: `pill heat-${l}` }, `${s} ${LEVEL_LABEL[l]}`);
}
