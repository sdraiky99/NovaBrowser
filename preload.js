const { contextBridge, ipcRenderer, clipboard, shell: electronShell } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const os = require('os');

const INVOKE = new Set([
  'account-login','account-logout','account-register','account-status','account-sync',
  'adblock','ai-ask','clear','clear-data','default-browser','install-cfg','key-has','key-set',
  'migration-read','migration-scan','opacity','open-external','performance-cache','performance-info',
  'performance-mode','pick-wp','save-docx','save-shot','security-state','state-load','state-save',
  'open-path','show-in-folder','supercat-chat','supercat-key-has','supercat-key-set','copy-shot','update-check','update-download','update-install',
  'window-material','install-cfg'
]);
const SEND = new Set(['dl-ctl','fullscreen','new-window','perm-policy','prefs-set','win']);
const SEND_SYNC = new Set(['app-version','prefs-get','userdata','fs-list','fs-mkdir','fs-write']);
const EVENTS = new Set(['ask-ai','blocked','combo','ctx-search','dl','key','open-tab','tab-health','update-state','zoom-changed']);

function invoke(channel, ...args) {
  if (!INVOKE.has(channel)) return Promise.reject(new Error(`IPC no permitido: ${channel}`));
  return ipcRenderer.invoke(channel, ...args);
}
function send(channel, ...args) {
  if (!SEND.has(channel)) throw new Error(`IPC no permitido: ${channel}`);
  return ipcRenderer.send(channel, ...args);
}
function sendSync(channel, ...args) {
  if (!SEND_SYNC.has(channel)) throw new Error(`IPC sync no permitido: ${channel}`);
  return ipcRenderer.sendSync(channel, ...args);
}
function on(channel, listener) {
  if (!EVENTS.has(channel)) throw new Error(`Evento no permitido: ${channel}`);
  const wrapped = (_event, ...args) => listener(_event, ...args);
  ipcRenderer.on(channel, wrapped);
  return () => ipcRenderer.removeListener(channel, wrapped);
}

const fsSafe = Object.freeze({
  readdirSync: (dir) => sendSync('fs-list', dir),
  mkdirSync: (dir, options) => sendSync('fs-mkdir', dir, options || {}),
  writeFileSync: (file, data) => sendSync('fs-write', file, data)
});
const pathSafe = Object.freeze({
  join: (...parts) => path.join(...parts),
  extname: (value) => path.extname(String(value || '')),
  basename: (value) => path.basename(String(value || ''))
});
const shellSafe = Object.freeze({
  openExternal: (url) => { const u = String(url || ''); if (/^https?:\/\//i.test(u)) return invoke('open-external', u); if (/^file:/i.test(u)) { try { return invoke('open-path', decodeURIComponent(new URL(u).pathname)); } catch {} } return Promise.resolve(false); },
  openPath: (p) => invoke('open-path', p),
  showItemInFolder: (p) => invoke('show-in-folder', p)
});
const clipboardSafe = Object.freeze({
  writeText: (value) => clipboard.writeText(String(value ?? '')),
  writeImage: (image) => { try { const png = image?.toPNG?.(); return invoke('copy-shot', png); } catch { return Promise.resolve(false); } }
});
const bufferSafe = Object.freeze({
  from: (value) => {
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    if (typeof value === 'string') return new TextEncoder().encode(value);
    return value;
  }
});

const api = {
  version: sendSync('app-version'),
  userData: sendSync('userdata'),
  shellDir: path.join(__dirname, 'shell'),
  shellRoot: __dirname,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node
  },
  platform: process.platform,
  os: Object.freeze({ homedir: () => os.homedir(), release: () => os.release() }),
  process: Object.freeze({ versions: { chrome: process.versions.chrome, electron: process.versions.electron, node: process.versions.node }, platform: process.platform }),
  path: pathSafe,
  pathToFileURL: (value) => pathToFileURL(String(value)).href,
  fs: fsSafe,
  Buffer: bufferSafe,
  shell: shellSafe,
  clipboard: clipboardSafe,
  invoke,
  send,
  sendSync,
  on
};

contextBridge.exposeInMainWorld('novaAPI', Object.freeze(api));
