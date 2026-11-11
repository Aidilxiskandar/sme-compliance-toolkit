// PDPA checks, based on docs/pdpa-summary.md (verified 11 Nov 2026 against JPDP sources).
// Pure functions with no DOM, so they can be unit-tested with `node --test`.
// These are indications to help a business find its duties, not legal advice.

export const SOURCES = {
  dbn: 'JPDP Guideline on Data Breach Notification v1.0 (25 Feb 2025)',
  dpo: 'JPDP Guideline on Appointment of DPO v1.0 (25 Feb 2025)',
  reg: 'Commissioner\'s Circular No. 1/2026, Registration of Data Controllers (from 1 Jun 2026)',
};

const FEES = { sole: 100, partnership: 200, sdnbhd: 300, bhd: 400 };

const SECTOR_CLASS = {
  health_clinic: ['yes', 'Health class: private medical or dental clinic.'],
  pharmacy: ['yes', 'Health class: body corporate registered under the Registration of Pharmacists Act.'],
  accounting: ['yes', 'Service class: accounting / audit.'],
  legal: ['yes', 'Service class: law.'],
  engineering_arch: ['yes', 'Service class: engineering / architecture.'],
  tourism: ['yes', 'Tourism and hospitality class.'],
  real_estate: ['yes', 'Real estate class: licensed housing developer.'],
  education_private: ['check', 'Education class covers registered private schools or private educational institutions under the Education Act 1996. Check whether your centre is registered as one.'],
  retail: ['check', 'Service class lists "wholesale and retail". Check the exact wording of P.U.(A) 326/2016 for your business.'],
  fnb: ['no', 'Food and beverage is not one of the 13 classes.'],
  other: ['check', 'Check the 13 classes on pdp.gov.my.'],
};

export function registration(profile) {
  const [status, reason] = SECTOR_CLASS[profile.sector] || SECTOR_CLASS.other;
  if (status !== 'no' && profile.legalForm === 'llp') {
    return { status: 'no', reason: reason + ' However, limited liability partnerships (PLT) are excluded from registration.', fee: 0, source: SOURCES.reg };
  }
  return { status, reason, fee: status === 'no' ? 0 : (FEES[profile.legalForm] || 0), source: SOURCES.reg };
}

// DPO thresholds: >20,000 data subjects; >10,000 for sensitive incl. financial; or regular and systematic monitoring.
// The same person can appear in several data sets, so the true number of people is somewhere between
// the largest single data set (lower bound) and the sum of all of them (upper bound).
// "yes" only when the lower bound is over a threshold; "likely" when only the upper bound is.
export function dpo(dataSets) {
  const range = (sets) => ({
    low: sets.reduce((m, d) => Math.max(m, d.count || 0), 0),
    high: sets.reduce((n, d) => n + (d.count || 0), 0),
  });
  const all = range(dataSets);
  const sens = range(dataSets.filter((d) => d.sensitive || d.financial));
  const fmt = (n) => n.toLocaleString('en-MY');
  const span = (r) => (r.low === r.high ? `about ${fmt(r.low)}` : `between ${fmt(r.low)} and ${fmt(r.high)}`);
  const reasons = [];
  let status = 'no';
  const bump = (st) => { const order = ['no', 'grey', 'likely', 'yes']; if (order.indexOf(st) > order.indexOf(status)) status = st; };
  const test = (r, limit, what) => {
    if (r.low > limit) { bump('yes'); reasons.push(`${what}: ${span(r)} people (over ${fmt(limit)}).`); }
    else if (r.high > limit) { bump('likely'); reasons.push(`${what}: ${span(r)} people. Over ${fmt(limit)} unless the data sets mostly hold the same people, so check the number of unique people.`); }
  };
  test(all, 20000, 'All personal data');
  test(sens, 10000, 'Sensitive or financial data');
  if (dataSets.some((d) => d.monitoring === 'behavioural_ads')) { bump('likely'); reasons.push('Tracking or profiling people for advertising or recommendations is the guideline\'s first example of systematic monitoring.'); }
  if (dataSets.some((d) => d.monitoring === 'other')) { bump('likely'); reasons.push('Other regular and systematic monitoring of people.'); }
  if (dataSets.some((d) => d.monitoring === 'cctv')) { bump('grey'); reasons.push('CCTV "may constitute" systematic monitoring. Not settled for small shops: write down your reasoning and review it yearly.'); }
  if (!reasons.length) reasons.push(`Under the thresholds (${span(all)} people, ${sens.high ? span(sens) : 'none'} with sensitive or financial data, no monitoring). Keep a short record of why no DPO is needed.`);
  return { status, reasons, people: all, sensitivePeople: sens, source: SOURCES.dpo };
}

// What a breach of this data set would trigger.
export function breachImpact(d) {
  const harm = [];
  if (d.sensitive) harm.push('sensitive data');
  if (d.financial) harm.push('financial data (risk of financial loss)');
  if (d.idNumbers) harm.push('ID numbers (could enable identity fraud)');
  const scale = (d.count || 0) > 1000;
  if (scale) harm.push('more than 1,000 people (significant scale)');
  const significantHarm = harm.length > 0;
  return {
    significantHarm,
    scale,
    notifyCommissioner: significantHarm,
    notifyIndividuals: Boolean(d.sensitive || d.financial || d.idNumbers),
    reasons: harm,
    source: SOURCES.dbn,
  };
}

// Simple findings from the inventory that map to toolkit controls.
export function findings(biz) {
  const f = [];
  const add = (control, text, items) => { if (items.length) f.push({ control, text, items }); };
  add('PR-2', 'Accounts without MFA', biz.accounts.filter((a) => a.mfa !== 'yes').map((a) => a.service));
  add('PR-1', 'Logins shared between people', biz.accounts.filter((a) => a.sharedLogin === 'yes').map((a) => a.service));
  add('PR-5', 'Former staff or vendors still have access', biz.accounts.filter((a) => a.formerUsersRemoved === 'no').map((a) => a.service));
  add('ID-3', 'Business accounts tied to a personal email', biz.accounts.filter((a) => a.businessOwned === 'no').map((a) => a.service));
  add('PR-3', 'Devices with default admin passwords', biz.assets.filter((a) => a.defaultPassword === 'yes').map((a) => a.name));
  add('PR-7', 'Devices or software no longer getting security updates', biz.assets.filter((a) => a.supported === 'no').map((a) => a.name));
  add('PR-9', 'Devices reachable from the internet', biz.assets.filter((a) => a.internetExposed === 'yes').map((a) => a.name));
  add('PR-8', 'Devices without disk encryption', biz.assets.filter((a) => a.encrypted === 'no').map((a) => a.name));
  add('PR-13', 'Personal data collected without notice or consent', biz.dataSets.filter((d) => d.notice === 'no').map((d) => d.name));
  add('GV-5', 'Third parties process personal data (check contracts)', biz.dataSets.filter((d) => d.processor.trim()).map((d) => `${d.name}: ${d.processor}`));
  return f;
}
