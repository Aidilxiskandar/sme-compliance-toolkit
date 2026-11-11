// Storage adapter. Every read and write in the app goes through `store`.
// Today: the browser's localStorage (falling back to memory if it is blocked).
// Phase 4: replace with an ApiStore that talks to a server with accounts,
// keeping the same async methods, and the views don't change (ADR 0003).

import { validateBusiness } from './model.js';

const KEY = 'sme-toolkit:v1:businesses';
const ACTIVE = 'sme-toolkit:v1:active';
const memory = new Map();

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return Object.fromEntries(memory);
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return Object.fromEntries(memory);
  }
}

function writeAll(all) {
  memory.clear();
  for (const [k, v] of Object.entries(all)) memory.set(k, v);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    return true;
  } catch {
    return false; // storage blocked or full: data lives in memory for this session only
  }
}

export const LocalStore = {
  kind: 'local',
  async list() {
    return Object.values(readAll())
      .map((b) => validateBusiness(b).value)
      .filter(Boolean)
      .sort((a, b) => a.profile.name.localeCompare(b.profile.name));
  },
  async get(id) {
    const b = readAll()[id];
    return b ? validateBusiness(b).value : null;
  },
  async save(biz) {
    const all = readAll();
    biz.updated = new Date().toISOString();
    all[biz.id] = biz;
    return { persisted: writeAll(all) };
  },
  async remove(id) {
    const all = readAll();
    delete all[id];
    writeAll(all);
  },
  getActive() {
    try { return localStorage.getItem(ACTIVE); } catch { return memory.get('__active') || null; }
  },
  setActive(id) {
    memory.set('__active', id);
    try { localStorage.setItem(ACTIVE, id); } catch { /* ignore */ }
  },
};

export const store = LocalStore;
