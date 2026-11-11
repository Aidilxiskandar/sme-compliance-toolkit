// Generic table + form editor for one collection (devices, accounts, data sets, risks).

import { h, clear } from '../dom.js';
import { COLLECTIONS, defaultsFor, coerce, newId } from '../model.js';
import { toCsv, download } from '../export.js';

export function field(f, value, idPrefix) {
  const id = `${idPrefix}-${f.key}`;
  let input;
  if (f.type === 'select') {
    input = h('select', { id, name: f.key }, f.options.map(([k, label]) => h('option', { value: k, selected: k === value }, label)));
  } else if (f.type === 'bool') {
    input = h('input', { id, name: f.key, type: 'checkbox', checked: value });
  } else if (f.type === 'textarea') {
    input = h('textarea', { id, name: f.key, rows: 2, maxlength: 2000 });
    input.value = value ?? '';
  } else {
    input = h('input', { id, name: f.key, type: f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text', min: f.min, max: f.max, step: f.decimal ? 'any' : null, maxlength: f.type === 'text' ? 2000 : null, required: f.required, value: value ?? '' });
  }
  const cls = f.type === 'bool' ? 'field field-bool' : f.type === 'textarea' ? 'field field-wide' : 'field';
  return f.type === 'bool'
    ? h('label', { class: cls, for: id }, input, h('span', {}, f.label))
    : h('div', { class: cls }, h('label', { for: id }, f.label), input);
}

export function readForm(form, fields) {
  const out = {};
  for (const f of fields) {
    const el = form.elements.namedItem(f.key);
    out[f.key] = coerce(f, f.type === 'bool' ? el.checked : el.value);
  }
  return out;
}

export function display(f, v) {
  if (f.type === 'bool') return v ? 'Yes' : 'No';
  if (f.type === 'select') return (f.options.find(([k]) => k === v) || [, v])[1];
  return v === '' ? '–' : String(v);
}

// columns: keys to show in the table (others are visible in the form)
// extra: optional { header, cell(row) } for a computed column
export function renderCollection(root, biz, key, { columns, extra, onSave }) {
  const def = COLLECTIONS[key];
  const fields = def.fields;
  let editing = null; // row id, 'new', or null

  function draw() {
    clear(root);
    const rows = biz[key];
    root.append(
      h('div', { class: 'section-head' },
        h('div', {}, h('h2', {}, def.label), h('p', { class: 'help' }, def.help)),
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'primary', onclick: () => { editing = 'new'; draw(); } }, `Add ${def.singular}`),
          h('button', { type: 'button', onclick: () => download(`${slug(biz.profile.name)}-${key}.csv`, toCsv(fields, rows), 'text/csv') }, 'Export CSV'),
        ),
      ),
    );
    if (editing) root.append(form(editing === 'new' ? null : rows.find((r) => r.id === editing)));
    if (!rows.length) {
      root.append(h('p', { class: 'empty' }, `No ${def.label.toLowerCase()} yet.`));
      return;
    }
    const cols = columns.map((c) => fields.find((f) => f.key === c));
    root.append(h('div', { class: 'table-wrap' }, h('table', {},
      h('thead', {}, h('tr', {}, cols.map((f) => h('th', { scope: 'col' }, f.label)), extra ? h('th', { scope: 'col' }, extra.header) : null, h('th', { scope: 'col' }, h('span', { class: 'sr-only' }, 'Actions')))),
      h('tbody', {}, rows.map((r) => h('tr', {},
        cols.map((f) => h('td', { 'data-label': f.label }, cellFor(f, r[f.key]))),
        extra ? h('td', { 'data-label': extra.header }, extra.cell(r)) : null,
        h('td', { class: 'row-actions' },
          h('button', { type: 'button', onclick: () => { editing = r.id; draw(); } }, 'Edit'),
          h('button', { type: 'button', class: 'danger', onclick: () => remove(r) }, 'Delete'),
        ),
      ))),
    )));
  }

  function cellFor(f, v) {
    const text = display(f, v);
    if (f.type === 'select' && ['yes', 'no'].includes(v)) {
      const good = isGood(f.key, v);
      return h('span', { class: `pill ${good ? 'pill-ok' : 'pill-bad'}` }, text);
    }
    return text;
  }

  function form(row) {
    const value = row || { ...defaultsFor(fields) };
    const prefix = `f-${key}`;
    const el = h('form', { class: 'card form', onsubmit: (e) => {
      e.preventDefault();
      const data = readForm(el, fields);
      if (row) Object.assign(row, data);
      else biz[key].push({ id: newId(), ...data });
      editing = null;
      onSave();
      draw();
    } },
      h('h3', {}, row ? `Edit ${def.singular}` : `New ${def.singular}`),
      h('div', { class: 'grid' }, fields.map((f) => field(f, value[f.key], prefix))),
      h('div', { class: 'actions' },
        h('button', { type: 'submit', class: 'primary' }, 'Save'),
        h('button', { type: 'button', onclick: () => { editing = null; draw(); } }, 'Cancel'),
      ),
    );
    queueMicrotask(() => el.querySelector('input,select,textarea')?.focus());
    return el;
  }

  function remove(r) {
    const label = r[fields[0].key] || def.singular;
    if (!confirm(`Delete "${label}"?`)) return;
    biz[key] = biz[key].filter((x) => x.id !== r.id);
    onSave();
    draw();
  }

  draw();
}

// For yes/no columns: is "yes" the good answer?
function isGood(k, v) {
  const yesIsBad = ['sharedLogin', 'defaultPassword', 'internetExposed'];
  return yesIsBad.includes(k) ? v === 'no' : v === 'yes';
}

export function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'business';
}
