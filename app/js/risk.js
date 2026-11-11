// Risk scoring: 5 x 5 likelihood x impact. Pure functions.

export function score(r) {
  return (r.likelihood || 1) * (r.impact || 1);
}

export function level(s) {
  if (s >= 20) return 'critical';
  if (s >= 12) return 'high';
  if (s >= 6) return 'medium';
  return 'low';
}

export const LEVEL_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

// 5x5 grid of counts: grid[impact-1][likelihood-1]
export function matrix(risks) {
  const grid = Array.from({ length: 5 }, () => Array(5).fill(0));
  for (const r of risks) {
    if (r.status === 'done') continue;
    grid[(r.impact || 1) - 1][(r.likelihood || 1) - 1] += 1;
  }
  return grid;
}

export function topRisks(risks, n = 5) {
  return risks.filter((r) => r.status !== 'done').sort((a, b) => score(b) - score(a)).slice(0, n);
}
