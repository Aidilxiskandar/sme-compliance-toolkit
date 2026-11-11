// Gap assessment page (Phase 3) and action plan summary.

import { h, clear } from '../dom.js';
import { newId, ROUND_KINDS } from '../model.js';
import { findings } from '../pdpa.js';
import { FUNCTIONS, roundScore, assuranceGaps, latest, costTotals } from '../assess.js';
import { renderCollection } from './collection.js';

const kindLabel = (k) => (k === 'verified' ? 'Verified' : 'Self');

function bar(pct) {
  if (pct === null) return h('span', { class: 'help' }, '–');
  const cls = pct >= 67 ? 'heat-low' : pct >= 34 ? 'heat-medium' : 'heat-critical';
  return h('span', { class: 'bar-cell' }, h('span', { class: 'bar-track', 'aria-hidden': 'true' }, h('span', { class: `bar-fill ${cls}`, 'data-pct': pct })), h('span', { class: 'bar-num' }, `${pct}%`));
}

// CSP blocks inline style attributes set via markup, so widths are set through the CSSOM.
function sizeBars(root) {
  for (const el of root.querySelectorAll('.bar-fill')) el.style.width = `${el.dataset.pct}%`;
}

export function renderAssessment(root, biz, bank, controls, onSave, roundId) {
  const qs = Object.fromEntries(bank.questions.map((q) => [q.id, q]));
  const levels = bank.levels;
  const hints = {};
  for (const f of findings(biz)) (hints[f.control] ||= []).push(`${f.text} (${f.items.length}): ${f.items.slice(0, 4).join(', ')}${f.items.length > 4 ? '…' : ''}`);
  let current = biz.assessments.find((r) => r.id === roundId) || biz.assessments[biz.assessments.length - 1] || null;

  const summary = h('div');
  function drawSummary() {
    clear(summary);
    if (!biz.assessments.length) { summary.append(h('p', { class: 'empty' }, 'No assessment rounds yet. Start one below.')); return; }
    summary.append(h('section', { class: 'card' }, h('h3', {}, 'Scores by round'),
      h('p', { class: 'help' }, 'Level 3 everywhere = 100%. Not applicable and unanswered questions are left out.'),
      h('div', { class: 'table-wrap' }, h('table', { class: 'scores' },
        h('thead', {}, h('tr', {}, h('th', {}, 'Round'), h('th', {}, 'Overall'), FUNCTIONS.map((f) => h('th', {}, f)), h('th', {}, 'Answered'))),
        h('tbody', {}, biz.assessments.map((r) => {
          const s = roundScore(r, controls);
          return h('tr', { class: current && r.id === current.id ? 'row-current' : '' },
            h('td', { 'data-label': 'Round' }, h('a', { href: `#/assessment/${r.id}` }, r.name), ' ', h('span', { class: `pill ${r.kind === 'verified' ? 'pill-ok' : 'pill-warn'}` }, kindLabel(r.kind))),
            h('td', { 'data-label': 'Overall' }, bar(s.overall)),
            FUNCTIONS.map((f) => h('td', { 'data-label': f }, bar(s.byFunction[f]))),
            h('td', { 'data-label': 'Answered' }, `${s.answered}/${s.total}`));
        }))))));
    const self = latest(biz.assessments, 'self');
    const firstVer = biz.assessments.find((r) => r.kind === 'verified');
    const gaps = self && firstVer ? assuranceGaps(self, firstVer, controls) : [];
    if (self && firstVer) {
      summary.append(h('section', { class: 'card' }, h('h3', {}, `Assurance gaps (${gaps.length})`),
        h('p', { class: 'help' }, `Controls the owner rated as in place (level 2+) in "${self.name}" that the evidence in "${firstVer.name}" showed were not (level 1 or less). These are the dangerous ones: nobody is working on them because everyone thinks they're fine.`),
        gaps.length ? h('ul', { class: 'findings' }, gaps.map((g) => h('li', {},
          h('a', { href: `#/controls/${g.id}`, class: 'ctl' }, g.id), ' ', h('strong', {}, g.title), `: owner said ${g.self}, evidence showed ${g.verified}. `,
          h('span', { class: 'help' }, self.answers[g.id]?.note || ''), ' ', h('span', {}, firstVer.answers[g.id]?.note ? `→ ${firstVer.answers[g.id].note}` : '')))) : h('p', { class: 'empty' }, 'None found.')));
    }
    sizeBars(summary);
  }

  const newForm = h('form', { class: 'card form no-print', onsubmit: (e) => {
    e.preventDefault();
    const name = newForm.elements.namedItem('name').value.trim().slice(0, 100) || 'Assessment';
    const kind = newForm.elements.namedItem('kind').value;
    const r = { id: newId(), name, kind, date: new Date().toISOString().slice(0, 10), answers: {} };
    biz.assessments.push(r);
    onSave();
    location.hash = `#/assessment/${r.id}`;
  } },
    h('h3', {}, 'New round'),
    h('div', { class: 'grid' },
      h('div', { class: 'field' }, h('label', { for: 'nr-name' }, 'Name'), h('input', { id: 'nr-name', name: 'name', type: 'text', maxlength: 100, placeholder: 'e.g. Before: verified' })),
      h('div', { class: 'field' }, h('label', { for: 'nr-kind' }, 'Kind'), h('select', { id: 'nr-kind', name: 'kind' }, ROUND_KINDS.map(([k, l]) => h('option', { value: k }, l))))),
    h('button', { type: 'submit', class: 'primary' }, 'Start round'));

  root.append(
    h('div', { class: 'section-head' }, h('div', {}, h('h2', {}, 'Gap assessment'),
      h('p', { class: 'help' }, `${bank.questions.length} questions, one per toolkit control. Ask the owner, then check the evidence: what owners believe and what is true often differ. Score each control 0 to 3.`)),
      h('div', { class: 'actions no-print' }, h('button', { type: 'button', onclick: () => window.print() }, 'Print'))),
    summary,
  );
  drawSummary();

  if (current) {
    root.append(h('div', { class: 'section-head round-head' },
      h('div', {}, h('h3', {}, current.name), h('p', { class: 'help' }, `${kindLabel(current.kind)} round${current.date ? ` · ${current.date}` : ''}`)),
      h('div', { class: 'actions no-print' }, h('button', { type: 'button', class: 'danger', onclick: () => {
        if (!confirm(`Delete the round "${current.name}"?`)) return;
        biz.assessments = biz.assessments.filter((r) => r.id !== current.id);
        onSave();
        location.hash = '#/assessment';
      } }, 'Delete round'))));
    for (const fn of FUNCTIONS) {
      root.append(h('h3', { class: 'fn-head' }, fn));
      for (const c of controls.filter((x) => x.fn === fn)) {
        const q = qs[c.id];
        if (!q) continue;
        const ans = current.answers[c.id];
        const val = ans === undefined ? '' : ans.level === null ? 'na' : String(ans.level);
        const card = h('div', { class: `card check-item level-${val || 'none'}` });
        const sel = h('select', { 'aria-label': `Level for ${c.id}`, onchange: (e) => {
          const v = e.target.value;
          if (v === '') delete current.answers[c.id];
          else current.answers[c.id] = { level: v === 'na' ? null : Number(v), note: current.answers[c.id]?.note || '' };
          card.className = `card check-item level-${v || 'none'}`;
          onSave();
          drawSummary();
        } },
          h('option', { value: '', selected: val === '' }, 'Not answered'),
          levels.map(([n, l]) => h('option', { value: String(n), selected: val === String(n) }, `${n} · ${l}`)),
          h('option', { value: 'na', selected: val === 'na' }, 'Not applicable'));
        const note = h('input', { type: 'text', maxlength: 2000, placeholder: 'Evidence / note', 'aria-label': `Note for ${c.id}`, value: ans?.note || '',
          onchange: (e) => {
            if (!current.answers[c.id]) return;
            current.answers[c.id].note = e.target.value.slice(0, 2000);
            onSave();
          } });
        card.append(...[
          h('div', { class: 'check-q' }, h('a', { class: 'ctl', href: `#/controls/${c.id}` }, c.id), ' ', h('strong', {}, c.title)),
          h('p', {}, h('strong', {}, 'Ask: '), q.ask),
          h('p', { class: 'help' }, h('strong', {}, 'How to check: '), q.check),
          hints[c.id] ? h('p', { class: 'hint' }, h('strong', {}, 'Inventory says: '), hints[c.id].join(' · ')) : null,
          h('div', { class: 'check-row' }, sel, note),
          h('p', { class: 'source' }, `Level 3: ${q.good}`)].filter(Boolean));
        root.append(card);
      }
    }
  }
  root.append(newForm);
}

export function renderActions(root, biz, onSave) {
  const totals = h('div', { class: 'stats' });
  const drawTotals = () => {
    clear(totals);
    const done = costTotals(biz.fixes, 'done');
    const planned = costTotals(biz.fixes, 'planned');
    const rm = (n) => `RM${n.toLocaleString('en-MY')}`;
    totals.append(
      h('div', { class: 'stat' }, h('span', { class: 'stat-value' }, `${done.count} done`), h('span', { class: 'stat-label' }, `${rm(done.oneOff)} one-off · ${rm(done.monthly)}/month · ${done.hours} h`)),
      h('div', { class: 'stat' }, h('span', { class: 'stat-value' }, `${planned.count} planned`), h('span', { class: 'stat-label' }, `${rm(planned.oneOff)} one-off · ${rm(planned.monthly)}/month · ${planned.hours} h`)));
  };
  const list = h('div');
  root.append(totals, h('p', { class: 'help' }, 'Costs are rough planning estimates (Nov 2026), not quotes.'), list);
  drawTotals();
  renderCollection(list, biz, 'fixes', { columns: ['title', 'controls', 'oneOff', 'monthly', 'hours', 'status'], onSave: () => { onSave(); drawTotals(); } });
}
