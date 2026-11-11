import { h, clear } from './dom.js';
import { newBusiness, validateBusiness } from './model.js';
import { store } from './store.js';
import { download } from './export.js';
import { renderCollection, slug } from './views/collection.js';
import { renderDashboard, scorePill } from './views/dashboard.js';
import { renderProfile, renderControls, renderStart, renderAbout } from './views/pages.js';
import { renderPolicies, renderChecklist, renderPlan } from './views/phase2.js';
import { renderAssessment, renderActions } from './views/assessment.js';

const EXAMPLES = [
  { file: '01-kopi-senja.json', name: 'Kopi Senja', desc: 'cafe, 6 staff' },
  { file: '02-klinik-damai-sentosa.json', name: 'Klinik Damai Sentosa', desc: 'GP clinic, 9 staff' },
  { file: '03-rumah-batik-lestari.json', name: 'Rumah Batik Lestari', desc: 'online shop, 4 staff' },
  { file: '04-tan-rahim-associates.json', name: 'Tan & Rahim Associates', desc: 'accounting firm, 12 staff' },
  { file: '05-pusat-tuisyen-cemerlang.json', name: 'Pusat Tuisyen Cemerlang', desc: 'tuition centre, 8 staff' },
];
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

const TABS = [
  ['dashboard', 'Dashboard'], ['profile', 'Profile'], ['assets', 'Devices'], ['accounts', 'Accounts'],
  ['data', 'Personal data'], ['risks', 'Risks'], ['checklist', 'PDPA checklist'], ['policies', 'Policies'],
  ['plan', 'Breach plan'], ['breaches', 'Breach register'], ['assessment', 'Gap assessment'], ['actions', 'Action plan'],
  ['controls', 'Controls'],
];

const COLUMNS = {
  assets: ['name', 'kind', 'usedBy', 'supported', 'defaultPassword', 'internetExposed'],
  accounts: ['service', 'kind', 'usedBy', 'mfa', 'sharedLogin', 'businessOwned'],
  dataSets: ['name', 'subjects', 'count', 'sensitive', 'storedIn', 'notice'],
  risks: ['title', 'treatment', 'owner', 'status'],
  breaches: ['title', 'found', 'people', 'notifiedJPDP', 'notifiedPeople', 'status'],
};

let biz = null;
let controls = [];
let checklistItems = [];
let bank = { levels: [], questions: [] };
const main = document.getElementById('main');
const bar = document.getElementById('bar');
const note = document.getElementById('note');

// Anti-clickjacking: GitHub Pages can't send X-Frame-Options or a frame-ancestors header,
// and both are ignored in a <meta> CSP. So if another site frames the app, show no data and
// no buttons, only a link to open the app directly.
function framed() {
  try { return window.top !== window.self; } catch { return true; }
}

async function init() {
  if (framed()) {
    clear(main);
    clear(bar);
    main.append(h('section', { class: 'card' },
      h('h2', {}, 'This app can\'t be shown inside another website'),
      h('p', {}, 'To protect your data, the SME Security Kit only works when opened directly.'),
      h('p', {}, h('a', { href: 'https://aidilxiskandar.github.io/sme-compliance-toolkit/app/', target: '_blank', rel: 'noopener noreferrer' }, 'Open the SME Security Kit'))));
    return;
  }
  try {
    const res = await fetch('../data/controls.json');
    controls = (await res.json()).controls || [];
  } catch {
    controls = [];
  }
  try {
    const res = await fetch('../data/pdpa-checklist.json');
    checklistItems = (await res.json()).items || [];
  } catch {
    checklistItems = [];
  }
  try {
    const res = await fetch('../data/assessment.json');
    bank = await res.json();
  } catch {
    bank = { levels: [], questions: [] };
  }
  const active = store.getActive();
  if (active) biz = await store.get(active);
  window.addEventListener('hashchange', render);
  render();
}

async function save() {
  const { persisted } = await store.save(biz);
  note.textContent = persisted ? '' : 'Browser storage is blocked, so changes only last until you close this tab. Use "Save file".';
}

async function select(id) {
  biz = id ? await store.get(id) : null;
  store.setActive(id || '');
  location.hash = biz ? '#/dashboard' : '#/';
  render();
}

async function drawBar() {
  clear(bar);
  const all = await store.list();
  const picker = h('select', { 'aria-label': 'Business', onchange: (e) => select(e.target.value) },
    h('option', { value: '' }, all.length ? 'Choose a business…' : 'No businesses yet'),
    all.map((b) => h('option', { value: b.id, selected: biz && b.id === biz.id }, b.profile.name)));
  bar.append(
    h('a', { class: 'brand', href: '#/' }, 'SME Security Kit'),
    picker,
    h('button', { type: 'button', onclick: addBusiness }, 'New'),
    h('label', { class: 'button' }, 'Open file', h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', onchange: importFile })),
    biz ? h('button', { type: 'button', title: 'The file contains this business\'s security weaknesses and personal data details. Keep it somewhere private.', onclick: saveFile }, 'Save file') : null,
    biz ? h('button', { type: 'button', class: 'danger', onclick: removeBusiness }, 'Delete') : null,
  );
  if (biz) {
    const route = currentRoute()[0];
    bar.append(h('nav', { class: 'tabs', 'aria-label': 'Sections' },
      TABS.map(([k, label]) => h('a', { href: `#/${k}`, class: route === k ? 'active' : '', 'aria-current': route === k ? 'page' : null }, label))));
  }
}

function currentRoute() {
  return location.hash.replace(/^#\/?/, '').slice(0, 300).split('/').map((x) => {
    try { return decodeURIComponent(x); } catch { return ''; } // malformed %-encoding: ignore
  });
}

async function render() {
  await drawBar();
  clear(main);
  const [route, arg] = currentRoute();
  if (route === 'about') return renderAbout(main, clearAll);
  if (route === 'example') {
    const x = EXAMPLES.find((e) => e.file.startsWith(String(arg).padStart(2, '0') + '-'));
    if (x) return loadExample(x);
  }
  if (!biz) return renderStart(main, { onNew: addBusiness, onExample: loadExample, onImport: importFile, examples: EXAMPLES });
  switch (route) {
    case 'profile': return renderProfile(main, biz, async () => { await save(); drawBar(); });
    case 'assets': return renderCollection(main, biz, 'assets', { columns: COLUMNS.assets, onSave: save });
    case 'accounts': return renderCollection(main, biz, 'accounts', { columns: COLUMNS.accounts, onSave: save });
    case 'data': return renderCollection(main, biz, 'dataSets', { columns: COLUMNS.dataSets, onSave: save });
    case 'risks': return renderCollection(main, biz, 'risks', { columns: COLUMNS.risks, extra: { header: 'Score', cell: scorePill }, onSave: save });
    case 'breaches': return renderCollection(main, biz, 'breaches', { columns: COLUMNS.breaches, onSave: save });
    case 'checklist': return renderChecklist(main, biz, checklistItems, save);
    case 'policies': return renderPolicies(main, biz, arg);
    case 'plan': return renderPlan(main, biz);
    case 'assessment': return renderAssessment(main, biz, bank, controls, save, arg);
    case 'actions': return renderActions(main, biz, save);
    case 'controls': return renderControls(main, biz, controls, arg);
    default: return renderDashboard(main, biz, checklistItems, controls);
  }
}

function saveFile() {
  if (!confirm('This file lists the business\'s security weaknesses and details of the personal data it holds. Keep it somewhere private (not a shared folder or chat). Save it?')) return;
  download(`${slug(biz.profile.name)}.json`, JSON.stringify(biz, null, 2));
}

async function clearAll() {
  if (!confirm('Delete ALL businesses saved in this browser? Save files first if you want to keep anything. This cannot be undone.')) return;
  await store.clearAll();
  biz = null;
  location.hash = '#/';
  render();
}

async function addBusiness() {
  const name = prompt('Business name');
  if (!name || !name.trim()) return;
  biz = newBusiness(name.trim().slice(0, 200));
  await save();
  store.setActive(biz.id);
  location.hash = '#/profile';
  render();
}

async function removeBusiness() {
  if (!confirm(`Delete "${biz.profile.name}" from this browser? Save a file first if you want to keep it.`)) return;
  await store.remove(biz.id);
  select('');
}

async function loadExample(x) {
  try {
    const res = await fetch(`../data/examples/${x.file}`);
    const { value } = validateBusiness(await res.json());
    // A link like #/example/01 can come from anywhere, so never overwrite a saved copy without asking.
    if (await store.get(value.id)) {
      if (!confirm(`"${value.profile.name}" is already saved in this browser, possibly with your changes.\n\nOK = reset it to the original example\nCancel = open your saved copy`)) {
        return select(value.id);
      }
    }
    biz = value;
    await save();
    select(biz.id);
  } catch {
    alert('Could not load the example. The app must be served over http (see app/README.md).');
  }
}

async function importFile(e) {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  if (file.size > MAX_IMPORT_BYTES) return alert('That file is too large (limit 2 MB).');
  let raw;
  try { raw = JSON.parse(await file.text()); } catch { return alert('That file is not valid JSON.'); }
  const { ok, errors, value } = validateBusiness(raw);
  if (!ok) return alert(errors.join('\n'));
  if (await store.get(value.id) && !confirm(`"${value.profile.name}" is already in this browser. Replace it with the file?`)) return;
  biz = value;
  await save();
  if (errors.length) alert(errors.join('\n'));
  select(biz.id);
}

init();
