// Gap assessment scoring. Pure functions.
// Levels: 0 not in place, 1 partly, 2 in place, 3 in place and checked. null = not applicable.

export const FUNCTIONS = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

// Score as % of the maximum (level 3) over answered, applicable controls.
export function roundScore(round, controls) {
  const by = {};
  let pts = 0, max = 0, answered = 0;
  for (const fn of FUNCTIONS) by[fn] = { pts: 0, max: 0 };
  for (const c of controls) {
    const a = round.answers[c.id];
    if (!a || a.level === null) continue;
    answered++;
    by[c.fn].pts += a.level; by[c.fn].max += 3;
    pts += a.level; max += 3;
  }
  const pct = (p, m) => (m ? Math.round((p / m) * 100) : null);
  return {
    overall: pct(pts, max),
    answered,
    total: controls.length,
    byFunction: Object.fromEntries(FUNCTIONS.map((fn) => [fn, pct(by[fn].pts, by[fn].max)])),
  };
}

// Assurance gaps: the owner rates a control as in place (2+) but the evidence shows it isn't (1 or less).
export function assuranceGaps(self, verified, controls) {
  const out = [];
  for (const c of controls) {
    const s = self?.answers[c.id]?.level, v = verified?.answers[c.id]?.level;
    if (Number.isInteger(s) && Number.isInteger(v) && s >= 2 && v <= 1) out.push({ id: c.id, title: c.title, self: s, verified: v });
  }
  return out;
}

// A planted gap is "found" by a round if any of its controls scores 1 or less there.
export function gapFound(gap, round) {
  return gap.controls.some((c) => {
    const l = round?.answers[c]?.level;
    return Number.isInteger(l) && l <= 1;
  });
}

// A planted gap is "closed" when its primary control (the first one listed) reaches level 2.
// Detection can come from any related control; closing needs the main fix.
export function gapClosed(gap, round) {
  const l = round?.answers[gap.controls[0]]?.level;
  return l === null || (Number.isInteger(l) && l >= 2);
}

export function latest(rounds, kind) {
  const list = rounds.filter((r) => r.kind === kind);
  return list[list.length - 1] || null;
}

export function costTotals(fixes, status) {
  const f = status ? fixes.filter((x) => x.status === status) : fixes;
  return {
    oneOff: f.reduce((n, x) => n + (x.oneOff || 0), 0),
    monthly: f.reduce((n, x) => n + (x.monthly || 0), 0),
    hours: f.reduce((n, x) => n + (x.hours || 0), 0),
    count: f.length,
  };
}
