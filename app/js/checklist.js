// PDPA checklist logic: which items apply to a business, and a simple score. Pure functions.
import { registration } from './pdpa.js';

export function applies(item, biz) {
  switch (item.when) {
    case 'registration': return registration(biz.profile).status !== 'no';
    case 'sensitive': return biz.dataSets.some((d) => d.sensitive);
    case 'minors': return biz.dataSets.some((d) => d.minors);
    case 'cctv': return biz.dataSets.some((d) => d.monitoring === 'cctv') || biz.assets.some((a) => a.kind === 'dvr');
    default: return true;
  }
}

// yes = 1, partly = 0.5, no / not answered = 0; "not applicable" and items that don't apply are left out.
export function checklistScore(items, biz) {
  let points = 0, total = 0, answered = 0;
  for (const it of items) {
    if (!applies(it, biz)) continue;
    const st = biz.checklist?.[it.id]?.status || 'unknown';
    if (st === 'na') continue;
    total += 1;
    if (st !== 'unknown') answered += 1;
    if (st === 'yes') points += 1;
    else if (st === 'partly') points += 0.5;
  }
  return { points, total, answered, percent: total ? Math.round((points / total) * 100) : 0 };
}
