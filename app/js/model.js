// Data model: field definitions for every table, plus validation for imported files.
// The same definitions drive the forms, the tables and the CSV exports.

export const SCHEMA = 'sme-toolkit/1';
const MAX_TEXT = 2000;
const MAX_ROWS = 500;

export const SECTORS = [
  ['fnb', 'Food and beverage (cafe, restaurant, stall)'],
  ['health_clinic', 'Private medical or dental clinic'],
  ['pharmacy', 'Pharmacy (registered body corporate)'],
  ['education_private', 'Tuition centre or private school / college'],
  ['retail', 'Retail or wholesale (incl. online shop)'],
  ['accounting', 'Accounting, audit or tax firm'],
  ['legal', 'Law firm'],
  ['engineering_arch', 'Engineering or architecture firm'],
  ['tourism', 'Tourism or registered accommodation'],
  ['real_estate', 'Licensed housing developer'],
  ['other', 'Other'],
];

export const LEGAL_FORMS = [
  ['sole', 'Sole proprietorship'],
  ['partnership', 'Partnership'],
  ['llp', 'Limited liability partnership (PLT)'],
  ['sdnbhd', 'Sdn Bhd'],
  ['bhd', 'Bhd'],
];

const YNU = [['yes', 'Yes'], ['no', 'No'], ['unknown', "Don't know"]];

export const PROFILE_FIELDS = [
  { key: 'name', label: 'Business name', type: 'text', required: true },
  { key: 'sector', label: 'Type of business', type: 'select', options: SECTORS },
  { key: 'legalForm', label: 'Legal form', type: 'select', options: LEGAL_FORMS },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'staff', label: 'Number of staff', type: 'number', min: 0 },
  { key: 'contact', label: 'Person responsible for security and data', type: 'text' },
  { key: 'backup', label: 'Backup person', type: 'text' },
  { key: 'itSupport', label: 'IT support / vendor contact', type: 'text' },
  { key: 'fictional', label: 'Fictional example business', type: 'bool' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export const COLLECTIONS = {
  assets: {
    label: 'Devices and software', singular: 'device',
    help: 'Every device used for the business, and the main software on it. (CSF ID.AM-01/02, toolkit control ID-1.)',
    fields: [
      { key: 'name', label: 'Device', type: 'text', required: true },
      { key: 'kind', label: 'Kind', type: 'select', options: [['pc', 'PC'], ['laptop', 'Laptop'], ['phone', 'Phone'], ['tablet', 'Tablet'], ['server', 'Server'], ['nas', 'NAS / file server'], ['router', 'Router / Wi-Fi'], ['pos', 'POS / card terminal'], ['dvr', 'CCTV / DVR'], ['printer', 'Printer'], ['other', 'Other']] },
      { key: 'usedBy', label: 'Used by', type: 'text' },
      { key: 'software', label: 'Main software', type: 'text' },
      { key: 'supported', label: 'Still gets security updates?', type: 'select', options: [...YNU, ['na', 'Not applicable']] },
      { key: 'encrypted', label: 'Disk encrypted?', type: 'select', options: [...YNU, ['na', 'Not applicable']] },
      { key: 'defaultPassword', label: 'Default admin password still set?', type: 'select', options: [...YNU, ['na', 'Not applicable']] },
      { key: 'internetExposed', label: 'Reachable from the internet?', type: 'select', options: YNU },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  accounts: {
    label: 'Online accounts', singular: 'account',
    help: 'Email, cloud, social media, marketplaces, banking and government portals. (CSF ID.AM-04, toolkit controls ID-3, PR-1, PR-2.)',
    fields: [
      { key: 'service', label: 'Service', type: 'text', required: true },
      { key: 'kind', label: 'Kind', type: 'select', options: [['email', 'Email'], ['cloud', 'Cloud storage / office'], ['social', 'Social media'], ['ads', 'Ad account'], ['marketplace', 'Marketplace / shop platform'], ['delivery', 'Food-delivery app'], ['banking', 'Banking / payments'], ['government', 'Government portal'], ['business_app', 'Business app (POS, clinic system, accounting)'], ['messaging', 'Messaging (WhatsApp Business)'], ['remote', 'Remote access'], ['other', 'Other']] },
      { key: 'usedBy', label: 'Who uses it', type: 'text' },
      { key: 'mfa', label: 'MFA on?', type: 'select', options: YNU },
      { key: 'sharedLogin', label: 'Login shared between people?', type: 'select', options: YNU },
      { key: 'businessOwned', label: 'Registered to a business email (not personal)?', type: 'select', options: YNU },
      { key: 'formerUsersRemoved', label: 'Former staff / vendors removed?', type: 'select', options: [...YNU, ['na', 'Not applicable']] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  dataSets: {
    label: 'Personal data', singular: 'data set',
    help: 'Each set of personal data you hold. These answers drive the PDPA checks on the dashboard. (CSF ID.AM-07, toolkit control ID-2.)',
    fields: [
      { key: 'name', label: 'Data set', type: 'text', required: true },
      { key: 'subjects', label: 'Whose data', type: 'select', options: [['customers', 'Customers'], ['patients', 'Patients'], ['students', 'Students'], ['parents', 'Parents / guardians'], ['staff', 'Staff'], ['clients', 'Clients'], ['client_employees', "Clients' employees"], ['public', 'Members of the public (e.g. CCTV)'], ['other', 'Other']] },
      { key: 'count', label: 'About how many people', type: 'number', min: 0 },
      { key: 'sensitive', label: 'Sensitive data (health, religion, offences, biometrics, politics)?', type: 'bool' },
      { key: 'financial', label: 'Financial data (bank details, salaries, income)?', type: 'bool' },
      { key: 'idNumbers', label: 'IC / passport / MyKid numbers or copies?', type: 'bool' },
      { key: 'minors', label: 'Includes children under 18?', type: 'bool' },
      { key: 'monitoring', label: 'Used for monitoring?', type: 'select', options: [['none', 'No'], ['cctv', 'CCTV'], ['behavioural_ads', 'Tracking / profiling for ads or recommendations'], ['other', 'Other systematic monitoring']] },
      { key: 'purpose', label: 'Why it is collected', type: 'text' },
      { key: 'storedIn', label: 'Where it is stored', type: 'text' },
      { key: 'access', label: 'Who can see it', type: 'text' },
      { key: 'retention', label: 'How long it is kept', type: 'text' },
      { key: 'processor', label: 'Third party processing it for you', type: 'text' },
      { key: 'notice', label: 'People were told / consent recorded?', type: 'select', options: YNU },
    ],
  },
  risks: {
    label: 'Risk register', singular: 'risk',
    help: 'What could go wrong, how likely and how bad, and what you will do. Score = likelihood × impact. (CSF GV.RM-03, ID.RA-05, toolkit control GV-4.)',
    fields: [
      { key: 'title', label: 'Risk', type: 'text', required: true },
      { key: 'cause', label: 'Cause / weakness', type: 'textarea' },
      { key: 'likelihood', label: 'Likelihood (1 rare to 5 almost certain)', type: 'number', min: 1, max: 5, default: 3 },
      { key: 'impact', label: 'Impact (1 minor to 5 severe)', type: 'number', min: 1, max: 5, default: 3 },
      { key: 'treatment', label: 'Decision', type: 'select', options: [['reduce', 'Reduce (fix it)'], ['accept', 'Accept'], ['transfer', 'Transfer (insurance, vendor)'], ['avoid', 'Avoid (stop doing it)']] },
      { key: 'actions', label: 'Actions', type: 'textarea' },
      { key: 'controls', label: 'Toolkit controls (e.g. PR-2, PR-10)', type: 'text' },
      { key: 'owner', label: 'Owner', type: 'text' },
      { key: 'due', label: 'Due date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: [['open', 'Open'], ['in_progress', 'In progress'], ['done', 'Done']] },
    ],
  },
  breaches: {
    label: 'Breach register', singular: 'breach',
    help: 'Every personal data breach, including ones you did not need to notify. Keep for at least 2 years. Fields follow the JPDP Guideline on Data Breach Notification para 14. (Toolkit control RS-3.)',
    fields: [
      { key: 'title', label: 'What happened', type: 'text', required: true },
      { key: 'found', label: 'Date the business found out', type: 'date' },
      { key: 'foundHow', label: 'How it was found / who reported it', type: 'text' },
      { key: 'dataTypes', label: 'Personal data involved', type: 'text' },
      { key: 'people', label: 'Estimated people affected', type: 'number', min: 0 },
      { key: 'records', label: 'Estimated records affected', type: 'number', min: 0 },
      { key: 'system', label: 'System or process that allowed it', type: 'text' },
      { key: 'rootCause', label: 'Root cause', type: 'textarea' },
      { key: 'consequences', label: 'Likely consequences for the people', type: 'textarea' },
      { key: 'timeline', label: 'Timeline of events', type: 'textarea' },
      { key: 'containment', label: 'Containment and recovery steps', type: 'textarea' },
      { key: 'notifiedJPDP', label: 'Told JPDP?', type: 'select', options: [['unknown', 'Not decided'], ['yes', 'Yes'], ['not_required', 'Not required']] },
      { key: 'jpdpDate', label: 'Date told JPDP', type: 'date' },
      { key: 'notifiedPeople', label: 'Told the affected people?', type: 'select', options: [['unknown', 'Not decided'], ['yes', 'Yes'], ['not_required', 'Not required']] },
      { key: 'peopleDate', label: 'Date told the people', type: 'date' },
      { key: 'reason', label: 'Why not notified (if not required)', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [['open', 'Open'], ['closed', 'Closed']] },
    ],
  },
};

export const CHECK_STATUS = [['unknown', 'Not answered'], ['yes', 'Yes'], ['partly', 'Partly'], ['no', 'No'], ['na', 'Not applicable']];

export function newId() {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function defaultsFor(fields) {
  const o = {};
  for (const f of fields) {
    if (f.default !== undefined) o[f.key] = f.default;
    else if (f.type === 'bool') o[f.key] = false;
    else if (f.type === 'select') o[f.key] = selectFallback(f);
    else if (f.type === 'number') o[f.key] = f.min ?? 0;
    else o[f.key] = '';
  }
  return o;
}

export function newBusiness(name = 'New business') {
  const b = { schema: SCHEMA, id: newId(), updated: new Date().toISOString(), profile: { ...defaultsFor(PROFILE_FIELDS), name } };
  for (const k of Object.keys(COLLECTIONS)) b[k] = [];
  b.checklist = {};
  return b;
}

// Unknown or missing answers become "Don't know" where that option exists, never "Yes",
// so a blank or tampered file can't make an account look protected.
function selectFallback(f) {
  return f.options.some(([k]) => k === 'unknown') ? 'unknown' : f.options[0][0];
}

// Coerce one value to its field's type. Unknown select values use selectFallback().
export function coerce(f, v) {
  switch (f.type) {
    case 'bool': return v === true || v === 'true' || v === 'on';
    case 'number': {
      let n = Number(v);
      if (!Number.isFinite(n)) n = f.default ?? f.min ?? 0;
      n = Math.round(n);
      if (f.min !== undefined) n = Math.max(f.min, n);
      if (f.max !== undefined) n = Math.min(f.max, n);
      return n;
    }
    case 'select': {
      const s = String(v ?? '');
      return f.options.some(([k]) => k === s) ? s : selectFallback(f);
    }
    case 'date': {
      const s = String(v ?? '');
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
    }
    default: return String(v ?? '').slice(0, MAX_TEXT);
  }
}

function cleanRecord(fields, obj) {
  const out = {};
  for (const f of fields) out[f.key] = coerce(f, obj?.[f.key] ?? defaultsFor([f])[f.key]);
  const id = String(obj?.id ?? '');
  out.id = /^[a-z0-9-]{1,40}$/i.test(id) ? id : newId();
  return out;
}

// Validate an imported or stored business. Unknown keys are dropped, types forced, sizes capped.
export function validateBusiness(raw) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, errors: ['File is not a business record.'] };
  if (raw.schema !== SCHEMA) errors.push(`Unexpected schema "${String(raw.schema).slice(0, 40)}"; expected ${SCHEMA}. Loaded what could be read.`);
  const b = { schema: SCHEMA, id: /^[a-z0-9-]{1,40}$/i.test(String(raw.id ?? '')) ? String(raw.id) : newId(), updated: new Date().toISOString() };
  b.profile = cleanRecord(PROFILE_FIELDS, raw.profile || {});
  delete b.profile.id;
  if (!b.profile.name) b.profile.name = 'Unnamed business';
  for (const [k, c] of Object.entries(COLLECTIONS)) {
    const rows = Array.isArray(raw[k]) ? raw[k] : [];
    if (rows.length > MAX_ROWS) errors.push(`${c.label}: only the first ${MAX_ROWS} rows were loaded.`);
    b[k] = rows.slice(0, MAX_ROWS).filter((r) => r && typeof r === 'object').map((r) => cleanRecord(c.fields, r));
  }
  b.checklist = cleanChecklist(raw.checklist);
  return { ok: true, errors, value: b };
}

// Checklist answers: { K01: { status, note }, ... }. Only well-formed ids and known statuses survive.
function cleanChecklist(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [id, v] of Object.entries(raw).slice(0, 200)) {
    if (!/^[A-Z]\d{2}$/.test(id) || !v || typeof v !== 'object') continue;
    const status = CHECK_STATUS.some(([k]) => k === v.status) ? v.status : 'unknown';
    out[id] = { status, note: String(v.note ?? '').slice(0, MAX_TEXT) };
  }
  return out;
}
