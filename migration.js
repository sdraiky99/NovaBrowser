'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const MAX_BOOKMARKS = 10000;
const MAX_HISTORY = 5000;
const MAX_JSON_BYTES = 25 * 1024 * 1024;
const MAX_DB_BYTES = 500 * 1024 * 1024;
const WEB_RE = /^https?:\/\//i;

const cleanText = (v, max = 500) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max).trim();
const safeWebUrl = v => WEB_RE.test(String(v || ''));
const sourceId = (browser, profile) => crypto.createHash('sha256').update(`${browser}|${profile}`).digest('hex').slice(0, 24);
const exists = p => { try { return fs.existsSync(p); } catch { return false; } };
const dirs = p => { try { return fs.readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); } catch { return []; } };

function rootsFor(appPath) {
  const home = appPath('home') || os.homedir();
  const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  const local = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
  if (process.platform === 'win32') return {
    chrome: [path.join(local, 'Google', 'Chrome', 'User Data')],
    edge: [path.join(local, 'Microsoft', 'Edge', 'User Data')],
    firefox: [path.join(appData, 'Mozilla', 'Firefox', 'Profiles')]
  };
  if (process.platform === 'darwin') return {
    chrome: [path.join(home, 'Library', 'Application Support', 'Google', 'Chrome')],
    edge: [path.join(home, 'Library', 'Application Support', 'Microsoft Edge')],
    firefox: [path.join(home, 'Library', 'Application Support', 'Firefox', 'Profiles')]
  };
  return {
    chrome: [path.join(home, '.config', 'google-chrome'), path.join(home, '.config', 'chromium')],
    edge: [path.join(home, '.config', 'microsoft-edge')],
    firefox: [path.join(home, '.mozilla', 'firefox')]
  };
}

function chromiumProfiles(root) {
  if (!exists(root)) return [];
  const candidates = ['Default', ...dirs(root).filter(n => /^Profile \d+$/i.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))];
  return [...new Set(candidates)].map(name => path.join(root, name)).filter(p => exists(path.join(p, 'Bookmarks')) || exists(path.join(p, 'History')));
}

function firefoxProfiles(root) {
  if (!exists(root)) return [];
  return dirs(root).map(name => path.join(root, name)).filter(p => exists(path.join(p, 'places.sqlite')));
}

function discover(appPath) {
  const r = rootsFor(appPath), out = [];
  for (const browser of ['chrome', 'edge']) for (const root of r[browser]) for (const profile of chromiumProfiles(root)) out.push({
    id: sourceId(browser, profile), browser, browserName: browser === 'chrome' ? 'Google Chrome' : 'Microsoft Edge',
    profile, profileName: path.basename(profile), kind: 'chromium',
    bookmarks: exists(path.join(profile, 'Bookmarks')), history: exists(path.join(profile, 'History'))
  });
  for (const root of r.firefox) for (const profile of firefoxProfiles(root)) out.push({
    id: sourceId('firefox', profile), browser: 'firefox', browserName: 'Mozilla Firefox',
    profile, profileName: path.basename(profile), kind: 'firefox',
    bookmarks: true, history: true
  });
  return out;
}

function flattenChromium(node, folder, out, folders) {
  if (!node || out.length >= MAX_BOOKMARKS) return;
  const type = node.type;
  if (type === 'url' && safeWebUrl(node.url)) {
    const f = folder.replace(/^\/+|\/+$/g, '');
    if (f) folders.add(f);
    out.push({ u: node.url, t: cleanText(node.name) || node.url, f });
    return;
  }
  if (type === 'folder' && Array.isArray(node.children)) {
    const name = cleanText(node.name, 100);
    const next = name ? (folder ? `${folder}/${name}` : name) : folder;
    if (next) folders.add(next);
    for (const child of node.children) flattenChromium(child, next, out, folders);
  }
}

function readChromiumBookmarks(file) {
  if (!exists(file)) return { items: [], folders: [] };
  try { if (fs.statSync(file).size > MAX_JSON_BYTES) return { items: [], folders: [] }; } catch { return { items: [], folders: [] }; }
  let json;
  try { json = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return { items: [], folders: [] }; }
  const items = [], folders = new Set();
  const roots = json && json.roots ? json.roots : {};
  for (const key of ['bookmark_bar', 'other', 'synced', 'managed']) {
    const root = roots[key];
    if (root) flattenChromium(root, cleanText(root.name, 100) || key, items, folders);
    if (items.length >= MAX_BOOKMARKS) break;
  }
  return { items: dedupeBookmarks(items), folders: [...folders].slice(0, 10000) };
}

async function getSql() {
  const initSqlJs = require('sql.js');
  const entry = require.resolve('sql.js');
  return initSqlJs({ locateFile: file => path.join(path.dirname(entry), file) });
}

function copySQLiteBundle(file) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-migrate-'));
  const base = path.basename(file), dst = path.join(dir, base);
  fs.copyFileSync(file, dst);
  for (const suffix of ['-wal', '-shm']) {
    const side = `${file}${suffix}`;
    if (exists(side)) { try { fs.copyFileSync(side, `${dst}${suffix}`); } catch { } }
  }
  return { dir, file: dst };
}

async function withDatabase(file, fn) {
  try { if (fs.statSync(file).size > MAX_DB_BYTES) throw new Error('La base de datos del perfil es demasiado grande para una migración segura.'); } catch (e) { if (e && e.message) throw e; throw new Error('No se puede leer la base de datos del perfil.'); }
  const SQL = await getSql();
  const snap = copySQLiteBundle(file);
  try {
    const db = new SQL.Database(new Uint8Array(fs.readFileSync(snap.file)));
    try { return await fn(db); } finally { db.close(); }
  } finally {
    try { fs.rmSync(snap.dir, { recursive: true, force: true }); } catch { }
  }
}

function rows(db, sql) {
  const result = db.exec(sql);
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map(v => Object.fromEntries(columns.map((c, i) => [c, v[i]])));
}

const chromeTime = v => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.max(0, Math.floor(n / 1000 - 11644473600000)) : 0; };
const firefoxTime = v => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.max(0, Math.floor(n / 1000)) : 0; };

async function readChromiumHistory(file) {
  if (!exists(file)) return [];
  return withDatabase(file, db => {
    const out = rows(db, `SELECT url, title, last_visit_time FROM urls WHERE url IS NOT NULL ORDER BY last_visit_time DESC LIMIT ${MAX_HISTORY}`);
    return dedupeHistory(out.map(x => ({ u: String(x.url || ''), t: cleanText(x.title) || String(x.url || ''), d: chromeTime(x.last_visit_time) })).filter(x => safeWebUrl(x.u) && x.d));
  });
}

async function readFirefox(file) {
  if (!exists(file)) return { bookmarks: { items: [], folders: [] }, history: [] };
  return withDatabase(file, db => {
    let bookmarks = [];
    try {
      const b = rows(db, `SELECT p.url AS url, COALESCE(NULLIF(b.title,''), p.title) AS title, b.parent AS parent FROM moz_bookmarks b JOIN moz_places p ON p.id=b.fk WHERE b.type=1 AND p.url IS NOT NULL AND b.fk IS NOT NULL LIMIT ${MAX_BOOKMARKS}`);
      bookmarks = dedupeBookmarks(b.map(x => ({ u: String(x.url || ''), t: cleanText(x.title) || String(x.url || ''), f: '' })).filter(x => safeWebUrl(x.u)));
    } catch { }
    let history = [];
    try {
      const h = rows(db, `SELECT url, title, last_visit_date FROM moz_places WHERE url IS NOT NULL AND last_visit_date IS NOT NULL ORDER BY last_visit_date DESC LIMIT ${MAX_HISTORY}`);
      history = dedupeHistory(h.map(x => ({ u: String(x.url || ''), t: cleanText(x.title) || String(x.url || ''), d: firefoxTime(x.last_visit_date) })).filter(x => safeWebUrl(x.u) && x.d));
    } catch { }
    return { bookmarks: { items: bookmarks, folders: [] }, history };
  });
}

function dedupeBookmarks(items) {
  const seen = new Set(), out = [];
  for (const x of items || []) {
    const u = String(x.u || '');
    if (!safeWebUrl(u) || seen.has(u)) continue;
    seen.add(u); out.push({ u, t: cleanText(x.t) || u, f: cleanText(x.f, 300) });
    if (out.length >= MAX_BOOKMARKS) break;
  }
  return out;
}

function dedupeHistory(items) {
  const seen = new Set(), out = [];
  for (const x of items || []) {
    const u = String(x.u || '');
    if (!safeWebUrl(u) || seen.has(u)) continue;
    seen.add(u); out.push({ u, t: cleanText(x.t) || u, d: Number(x.d) || Date.now() });
    if (out.length >= MAX_HISTORY) break;
  }
  return out;
}

async function readSource(source, opts = {}) {
  if (!source || !source.profile) throw new Error('Fuente no válida.');
  const wantBookmarks = opts.bookmarks !== false;
  const wantHistory = opts.history !== false;
  if (source.kind === 'chromium') {
    const result = { bookmarks: { items: [], folders: [] }, history: [] };
    if (wantBookmarks) result.bookmarks = readChromiumBookmarks(path.join(source.profile, 'Bookmarks'));
    if (wantHistory) result.history = await readChromiumHistory(path.join(source.profile, 'History'));
    return result;
  }
  const result = await readFirefox(path.join(source.profile, 'places.sqlite'));
  if (!wantBookmarks) result.bookmarks = { items: [], folders: [] };
  if (!wantHistory) result.history = [];
  return result;
}

function publicSource(s) {
  return { id: s.id, browser: s.browser, browserName: s.browserName, profileName: s.profileName, kind: s.kind, bookmarks: !!s.bookmarks, history: !!s.history };
}

function createMigrationService(app) {
  let index = new Map();
  return {
    scan() {
      const list = discover(p => app.getPath(p));
      index = new Map(list.map(x => [x.id, x]));
      return list.map(publicSource);
    },
    async read(id, opts) {
      const src = index.get(String(id || ''));
      if (!src) throw new Error('Perfil no disponible. Vuelve a escanear los navegadores.');
      return readSource(src, opts);
    }
  };
}

module.exports = { createMigrationService };
