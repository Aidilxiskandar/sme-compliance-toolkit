// File exports: JSON (full save) and CSV (one table, opens in Excel / Google Sheets).

export function download(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// CSV with protection against spreadsheet formula injection: a cell starting with
// = + - @ (or tab / carriage return) is prefixed with ' so Excel treats it as text.
export function csvCell(v) {
  let s = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(fields, rows) {
  const head = fields.map((f) => csvCell(f.label)).join(',');
  const body = rows.map((r) => fields.map((f) => {
    const v = r[f.key];
    const opt = f.type === 'select' ? f.options.find(([k]) => k === v) : null;
    return csvCell(opt ? opt[1] : v);
  }).join(','));
  return '﻿' + [head, ...body].join('\r\n') + '\r\n';
}
