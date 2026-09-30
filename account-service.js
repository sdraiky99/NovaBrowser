'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function createAccountService({ app, safeStorage, fetch }) {
  const tokenFile = () => path.join(app.getPath('userData'), 'nova-account-token.bin');
  const accountFile = () => path.join(app.getPath('userData'), 'nova-account.json');
  const cleanBase = raw => {
    const base = String(raw || '').trim().replace(/\/$/, '');
    if (!base) return '';
    let u;
    try { u = new URL(base); } catch { return ''; }
    if (u.protocol === 'https:') return u.href.replace(/\/$/, '');
    if ((u.hostname === 'localhost' || u.hostname === '127.0.0.1') && u.protocol === 'http:') return u.href.replace(/\/$/, '');
    return '';
  };
  const config = () => {
    let fileBase = '';
    try {
      const f = path.join(app.getAppPath(), 'account-config.json');
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      fileBase = cleanBase(j.apiBase);
    } catch { }
    return cleanBase(process.env.NOVA_ACCOUNT_API || fileBase || 'https://accounts.nova.com/v1');
  };
  const writeAtomic = (file, data) => {
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, data, { mode: 0o600 });
    fs.renameSync(tmp, file);
  };
  const readMeta = () => {
    try { return JSON.parse(fs.readFileSync(accountFile(), 'utf8')); } catch { return {}; }
  };
  const writeMeta = meta => { try { writeAtomic(accountFile(), JSON.stringify(meta)); } catch { } };
  const storeToken = token => {
    if (!token || !safeStorage?.isEncryptionAvailable?.()) return false;
    try {
      writeAtomic(tokenFile(), safeStorage.encryptString(token));
      return true;
    } catch { return false; }
  };
  const loadToken = () => {
    try {
      if (!safeStorage?.isEncryptionAvailable?.()) return '';
      const b = fs.readFileSync(tokenFile());
      return safeStorage.decryptString(b);
    } catch { return ''; }
  };
  const clearToken = () => { try { fs.rmSync(tokenFile(), { force: true }); } catch { } };
  const accountState = () => {
    const m = readMeta();
    return { id: typeof m.id === 'string' ? m.id : '', username: typeof m.username === 'string' ? m.username : '', loggedIn: !!loadToken() };
  };
  const validUsername = v => /^[a-z0-9](?:[a-z0-9._-]{1,23})$/i.test(String(v || '').trim());
  const validPassword = v => typeof v === 'string' && v.length >= 8 && v.length <= 128;
  const normalizedId = v => `${String(v || '').trim().toLowerCase()}@Nova.com`;
  const request = async (endpoint, options = {}) => {
    const base = config();
    if (!base) throw new Error('Servidor de cuentas no configurado.');
    const url = new URL(endpoint.replace(/^\//, ''), `${base}/`);
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('La cuenta Nova requiere HTTPS.');
    const headers = Object.assign({ 'content-type': 'application/json', 'accept': 'application/json', 'x-nova-client': 'Nova/2.2.0' }, options.headers || {});
    const r = await fetch(url.href, Object.assign({}, options, { headers }));
    let data = {};
    try { data = await r.json(); } catch { }
    if (!r.ok) {
      const msg = data?.error || `Error del servidor (${r.status})`;
      const e = new Error(String(msg)); e.status = r.status; e.data = data; throw e;
    }
    return data;
  };
  const register = async (username, password) => {
    const u = String(username || '').trim().toLowerCase();
    if (!validUsername(u)) return { ok: false, error: 'El usuario debe tener 2-24 caracteres y usar solo letras, números, punto, guion o guion bajo.' };
    if (!validPassword(password)) return { ok: false, error: 'La contraseña debe tener entre 8 y 128 caracteres.' };
    try {
      const d = await request('/register', { method: 'POST', body: JSON.stringify({ username: u, password }) });
      if (d.token && !storeToken(d.token)) return { ok: false, error: 'No se pudo guardar la sesión de forma segura en este equipo.' };
      const id = normalizedId(u);
      writeMeta({ id, username: u, updatedAt: Date.now() });
      return { ok: true, id };
    } catch (e) { return { ok: false, error: e.message || 'No se pudo crear la cuenta.' }; }
  };
  const login = async (username, password) => {
    const raw = String(username || '').trim().toLowerCase().replace(/@nova\.com$/i, '');
    if (!validUsername(raw) || !validPassword(password)) return { ok: false, error: 'Usuario o contraseña no válidos.' };
    try {
      const d = await request('/login', { method: 'POST', body: JSON.stringify({ username: raw, password }) });
      if (!d.token || !storeToken(d.token)) return { ok: false, error: 'No se pudo guardar la sesión de forma segura en este equipo.' };
      const id = normalizedId(raw);
      writeMeta({ id, username: raw, updatedAt: Date.now() });
      return { ok: true, id };
    } catch (e) { clearToken(); return { ok: false, error: e.message || 'No se pudo iniciar sesión.' }; }
  };
  const logout = () => { clearToken(); writeMeta({}); return { ok: true }; };
  const sync = async payload => {
    const token = loadToken();
    if (!token) return { ok: false, error: 'No hay una cuenta Nova iniciada.' };
    if (!payload || typeof payload !== 'object') return { ok: false, error: 'Datos de sincronización inválidos.' };
    try {
      const remote = await request('/sync', { method: 'GET', headers: { authorization: `Bearer ${token}` } });
      const d = await request('/sync', { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify({ data: payload, updatedAt: Date.now() }) });
      return { ok: true, remote: remote.data || {}, remoteUpdatedAt: remote.updatedAt || 0, data: d.data || {}, updatedAt: d.updatedAt || 0 };
    } catch (e) {
      if (e.status === 401) { clearToken(); writeMeta({}); }
      return { ok: false, error: e.message || 'No se pudo sincronizar.' };
    }
  };
  const status = () => accountState();
  return { register, login, logout, sync, status, loadToken, config };
}

module.exports = { createAccountService };
