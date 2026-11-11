// Minimal Markdown renderer for the toolkit's own templates. It builds DOM nodes with h(),
// so text is never parsed as HTML. Supports: # headings, paragraphs, - lists, - [ ] checklists,
// 1. lists, | tables |, ---, **bold**, *italic*, `code`.

import { h } from './dom.js';

export function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in values && values[k] !== '' ? values[k] : '__________'));
}

function inline(text) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(h('strong', {}, t.slice(2, -2)));
    else if (t.startsWith('`')) out.push(h('code', {}, t.slice(1, -1)));
    else out.push(h('em', {}, t.slice(1, -1)));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function render(md) {
  const root = h('div', { class: 'md' });
  const lines = md.replace(/\r/g, '').split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) { root.append(h(`h${m[1].length + 1}`, {}, inline(m[2]))); i++; continue; }
    if (/^---+\s*$/.test(line)) { root.append(h('hr')); i++; continue; }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i]); i++; }
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const body = rows.slice(1).filter((r) => !/^\|[\s:|-]+\|$/.test(r));
      root.append(h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, cells(rows[0]).map((c) => h('th', {}, inline(c))))),
        h('tbody', {}, body.map((r) => h('tr', {}, cells(r).map((c, j) => h('td', { 'data-label': cells(rows[0])[j] || '' }, inline(c)))))))));
      continue;
    }
    if (/^\s*[-*] /.test(line) || /^\s*\d+\. /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line);
      const items = [];
      while (i < lines.length && (ordered ? /^\s*\d+\. /.test(lines[i]) : /^\s*[-*] /.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''));
        i++;
      }
      root.append(h(ordered ? 'ol' : 'ul', {}, items.map((t) => {
        const box = t.match(/^\[( |x)\]\s+(.*)/i);
        return box ? h('li', { class: 'check' }, h('span', { class: 'box', 'aria-hidden': 'true' }, box[1].trim() ? '☑' : '☐'), ' ', inline(box[2])) : h('li', {}, inline(t));
      })));
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|---|\||\s*[-*] |\s*\d+\. )/.test(lines[i])) { para.push(lines[i]); i++; }
    root.append(h('p', {}, inline(para.join(' '))));
  }
  return root;
}
