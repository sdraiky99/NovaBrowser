'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function createAccountService({ app, safeStorage }) {
  const dbFile = () => path.join(app.getPath('userData'), 'nova-accounts.json');
  const sessionFile = () => path.join(app.getPath('userData'), 'nova-account-session.bin');

  const writeAtomic = (file, data, mode = 0o600) => {
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, data, { mode });
    fs.renameSync(tmp, file);
  };

  const loadDB = () => {
    try {
      const data = JSON.parse(fs.readFileSync(dbFile(), 'utf8'));
      if (data && typeof data === 'object' && data.accounts && typeof data.accounts === 'object') return data;
    } catch {}
    return { version: 1, accounts: {} };
  };

  const saveDB = db => writeAtomic(dbFile(), JSON.stringify(db, null, 2));
  const normalize = value => String(value || '').trim().toLowerCase().replace(/@nova\.com$/i, '');
  const validUsername = value => /^[a-z0-9](?:[a-z0-9._-]{1,23})$/i.test(normalize(value));
  const validPassword = value => typeof value === 'string' && value.length >= 8 && value.length <= 128;
  const accountId = username => `${username}@Nova.com`;

  const hashPassword = password => {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64);
    return { salt: salt.toString('hex'), hash: hash.toString('hex') };
  };

  const verifyPassword = (password, record) => {
    try {
      const actual = crypto.scryptSync(password, Buffer.from(record.salt, 'hex'), 64);
      const expected = Buffer.from(record.hash, 'hex');
      return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
    } catch { return false; }
  };

  const writeSession = username => {
    const payload = JSON.stringify({ username, issuedAt: Date.now() });
    try {
      const data = safeStorage?.isEncryptionAvailable?.() ? safeStorage.encryptString(payload) : payload;
      writeAtomic(sessionFile(), data);
      return true;
    } catch { return false; }
  };

  const readSession = () => {
    try {
      const raw = fs.readFileSync(sessionFile());
      let text = '';
      if (safeStorage?.isEncryptionAvailable?.()) {
        try { text = safeStorage.decryptString(raw); } catch {}
      }
      if (!text) text = raw.toString('utf8');
      const data = JSON.parse(text);
      return validUsername(data?.username) ? normalize(data.username) : '';
    } catch { return ''; }
  };

  const clearSession = () => { try { fs.rmSync(sessionFile(), { force: true }); } catch {} };

  const status = () => {
    const username = readSession();
    const db = loadDB();
    const rec = username ? db.accounts[username] : null;
    return { loggedIn: !!rec, id: rec ? accountId(username) : '', username: rec ? username : '' };
  };

  const register = (username, password) => {
    const u = normalize(username);
    if (!validUsername(u)) return { ok: false, error: 'El usuario debe tener 2-24 caracteres y usar solo letras, números, punto, guion o guion bajo.' };
    if (!validPassword(password)) return { ok: false, error: 'La contraseña debe tener entre 8 y 128 caracteres.' };
    const db = loadDB();
    if (db.accounts[u]) return { ok: false, error: 'Ese usuario ya existe en este equipo.' };
    const hp = hashPassword(password);
    db.accounts[u] = { id: accountId(u), username: u, salt: hp.salt, hash: hp.hash, createdAt: Date.now(), updatedAt: Date.now(), sync: null };
    try { saveDB(db); } catch { return { ok: false, error: 'No se pudo guardar la cuenta.' }; }
    if (!writeSession(u)) return { ok: false, error: 'La cuenta se creó, pero no se pudo guardar la sesión.' };
    return { ok: true, id: accountId(u), username: u };
  };

  const login = (username, password) => {
    const u = normalize(username);
    if (!validUsername(u) || !validPassword(password)) return { ok: false, error: 'Usuario o contraseña no válidos.' };
    const db = loadDB();
    const rec = db.accounts[u];
    if (!rec || !verifyPassword(password, rec)) return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    if (!writeSession(u)) return { ok: false, error: 'No se pudo guardar la sesión.' };
    rec.updatedAt = Date.now();
    saveDB(db);
    return { ok: true, id: rec.id, username: u };
  };

  const logout = () => { clearSession(); return { ok: true }; };

  const sync = payload => {
    const st = status();
    if (!st.loggedIn) return { ok: false, error: 'Inicia sesión en tu cuenta Nova.' };
    if (!payload || typeof payload !== 'object') return { ok: false, error: 'Datos de sincronización inválidos.' };
    const db = loadDB();
    const rec = db.accounts[st.username];
    const previous = rec.sync && typeof rec.sync === 'object' ? rec.sync : {};
    rec.sync = { data: payload, updatedAt: Date.now() };
    rec.updatedAt = Date.now();
    try { saveDB(db); } catch { return { ok: false, error: 'No se pudo guardar la sincronización.' }; }
    return { ok: true, remote: previous.data || {}, remoteUpdatedAt: previous.updatedAt || 0, data: rec.sync.data, updatedAt: rec.sync.updatedAt };
  };

  return { register, login, logout, sync, status };
}

module.exports = { createAccountService };
