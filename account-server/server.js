'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8080);
const DATA_DIR = path.resolve(process.env.NOVA_ACCOUNT_DATA_DIR || path.join(__dirname, 'data'));
const ACCOUNTS = path.join(DATA_DIR, 'accounts.json');
const MAX_BODY = 2 * 1024 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 25;
const attempts = new Map();

fs.mkdirSync(DATA_DIR, { recursive: true });
function readStore() { try { return JSON.parse(fs.readFileSync(ACCOUNTS, 'utf8')); } catch { return { accounts: {}, sessions: {}, sync: {} }; } }
function writeStore(s) {
  const tmp = `${ACCOUNTS}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s), { mode: 0o600 });
  fs.renameSync(tmp, ACCOUNTS);
}
const hash = v => crypto.createHash('sha256').update(v).digest('hex');
const timingSafe = (a, b) => { try { const x = Buffer.from(a, 'hex'), y = Buffer.from(b, 'hex'); return x.length === y.length && crypto.timingSafeEqual(x, y); } catch { return false; } };
function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const out = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `${salt}:${out.toString('hex')}`;
}
function passwordOk(password, stored) {
  const [salt, wanted] = String(stored || '').split(':');
  if (!salt || !wanted) return false;
  try { const got = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex'); return timingSafe(got, wanted); } catch { return false; }
}
const normalizeUsername = v => String(v || '').trim().toLowerCase().replace(/@nova\.com$/i, '');
const usernameOk = v => /^[a-z0-9](?:[a-z0-9._-]{1,23})$/i.test(String(v || ''));
const mergeBy = (a, b, key) => {
  const m = new Map();
  for (const x of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    const k = String(x?.[key] || ''); if (k) m.set(k, x);
  }
  return [...m.values()];
};
function mergeSync(oldData, nextData) {
  const old = oldData && typeof oldData === 'object' ? oldData : {};
  const next = nextData && typeof nextData === 'object' ? nextData : {};
  const out = Object.assign({}, old, next, { version: 1 });
  out.profiles = mergeBy(old.profiles, next.profiles, 'id').slice(0, 30);
  out.stores = Object.assign({}, old.stores || {});
  for (const [id, ns] of Object.entries(next.stores || {})) {
    const os = out.stores[id] && typeof out.stores[id] === 'object' ? out.stores[id] : {};
    const merged = Object.assign({}, os, ns || {});
    merged.marks = mergeBy(os.marks, ns?.marks, 'u').slice(-20000);
    merged.hist = mergeBy(os.hist, ns?.hist, 'u').sort((x,y)=>(Number(y.d)||0)-(Number(x.d)||0)).slice(0, 2000);
    merged.folders = [...new Set([...(Array.isArray(os.folders)?os.folders:[]), ...(Array.isArray(ns?.folders)?ns.folders:[])])].slice(0,1000);
    merged.quick = mergeBy(os.quick, ns?.quick, 'u').slice(0, 100);
    merged.notesL = mergeBy(os.notesL, ns?.notesL, 'id').slice(-2000);
    out.stores[id] = merged;
  }
  return out;
}
const json = (res, status, data) => { const body = JSON.stringify(data); res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }); res.end(body); };
function body(req) {
  return new Promise((resolve, reject) => {
    let n = 0, chunks = [];
    req.on('data', c => { n += c.length; if (n > MAX_BODY) { reject(new Error('Payload demasiado grande')); req.destroy(); return; } chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { reject(new Error('JSON inválido')); } });
    req.on('error', reject);
  });
}
function limited(ip) {
  const now = Date.now(), x = attempts.get(ip) || { n: 0, at: now };
  if (now - x.at > WINDOW_MS) { x.n = 0; x.at = now; }
  x.n++; attempts.set(ip, x); return x.n <= MAX_ATTEMPTS;
}
function auth(req, store) {
  const h = String(req.headers.authorization || ''); if (!h.startsWith('Bearer ')) return null;
  const tokenHash = hash(h.slice(7)); const s = store.sessions[tokenHash]; if (!s || s.expiresAt < Date.now()) return null; return s.username;
}
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return json(res, 204, {});
    const ip = req.socket.remoteAddress || 'unknown';
    if (!limited(ip)) return json(res, 429, { error: 'Demasiadas solicitudes. Inténtalo más tarde.' });
    const u = new URL(req.url, 'http://nova.local');
    if (req.method === 'GET' && u.pathname === '/health') return json(res, 200, { ok: true, service: 'Nova Accounts', time: Date.now() });
    const store = readStore();

    if (req.method === 'POST' && u.pathname === '/v1/register') {
      const b = await body(req), username = normalizeUsername(b.username);
      if (!usernameOk(username)) return json(res, 400, { error: 'Usuario no válido.' });
      if (typeof b.password !== 'string' || b.password.length < 8 || b.password.length > 128) return json(res, 400, { error: 'Contraseña no válida.' });
      if (store.accounts[username]) return json(res, 409, { error: 'Ese usuario Nova ya existe.' });
      store.accounts[username] = { password: passwordHash(b.password), createdAt: Date.now() };
      const token = crypto.randomBytes(32).toString('base64url'); store.sessions[hash(token)] = { username, expiresAt: Date.now() + 30 * 24 * 3600e3 };
      writeStore(store); return json(res, 201, { token });
    }

    if (req.method === 'POST' && u.pathname === '/v1/login') {
      const b = await body(req), username = normalizeUsername(b.username);
      const acc = store.accounts[username];
      if (!acc || !passwordOk(String(b.password || ''), acc.password)) return json(res, 401, { error: 'Usuario o contraseña incorrectos.' });
      const token = crypto.randomBytes(32).toString('base64url'); store.sessions[hash(token)] = { username, expiresAt: Date.now() + 30 * 24 * 3600e3 };
      writeStore(store); return json(res, 200, { token });
    }

    if (req.method === 'GET' && u.pathname === '/v1/sync') {
      const username = auth(req, store); if (!username) return json(res, 401, { error: 'Sesión no válida.' });
      return json(res, 200, store.sync[username] || { data: {}, updatedAt: 0 });
    }

    if (req.method === 'POST' && u.pathname === '/v1/sync') {
      const username = auth(req, store); if (!username) return json(res, 401, { error: 'Sesión no válida.' });
      const b = await body(req); if (!b.data || typeof b.data !== 'object') return json(res, 400, { error: 'Datos inválidos.' });
      const merged = mergeSync(store.sync[username]?.data, b.data);
      const raw = JSON.stringify(merged); if (Buffer.byteLength(raw, 'utf8') > MAX_BODY) return json(res, 413, { error: 'Los datos de sincronización son demasiado grandes.' });
      store.sync[username] = { data: merged, updatedAt: Date.now() }; writeStore(store);
      return json(res, 200, store.sync[username]);
    }

    return json(res, 404, { error: 'No encontrado.' });
  } catch (e) {
    return json(res, 400, { error: e.message || 'Solicitud no válida.' });
  }
});
server.listen(PORT, HOST, () => console.log(`Nova Accounts listening on http://${HOST}:${PORT}`));
