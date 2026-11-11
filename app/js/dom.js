// Safe DOM builder. User data only ever becomes text nodes or attribute values,
// never HTML, so imported data cannot inject script (see ADR 0003).

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k.startsWith('on')) {
      throw new Error('String event handlers are not allowed: ' + k);
    } else if (k === 'class') {
      el.className = v;
    } else if (k === 'value') {
      el.value = v;
    } else if (k === 'checked' || k === 'selected' || k === 'disabled') {
      el[k] = Boolean(v);
    } else if (k === 'href') {
      // Only allow in-app hash links and https links.
      const s = String(v);
      if (s.startsWith('#') || s.startsWith('https://')) el.setAttribute('href', s);
    } else {
      el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}
