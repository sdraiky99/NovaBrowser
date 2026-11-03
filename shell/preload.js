'use strict';

const { contextBridge, ipcRenderer } = require('electron');
const { URL } = globalThis;

// Explicit channel allowlists: the renderer never receives ipcRenderer itself.
const INVOKE = new Set([
  'extensions-list','extension-pick-load','extension-toggle','extension-unload',
  'permission-sites-list','permission-site-set','permission-site-reset','default-browser',
  'install-cfg','adblock','save-shot','pick-wp','toolbar-wallpaper-pick','toolbar-wallpaper-clear',
  'save-docx',
  'state-save','state-load','backup-export','backup-import','open-external','open-downloads-folder','show-in-folder','save-text',
  'launch-web-app','news-feed','cloud-translate','media-pick-files','media-open-external','update-check','update-state','update-download','update-install',
  'migration-scan','migration-read','performance-info','performance-mode','performance-cache',
  'security-state','ollama-models','ollama-ai','clear-data','clear','nova51-diagnostics',
  'nova51-restore-backup','nova51-export-state'
]);
const SEND = new Set(['dl-ctl','prefs-set','win','fullscreen','perm-policy']);
const SYNC = new Set(['app-version','runtime-info','prefs-get','userdata','portable-data-status']);
const EVENTS = new Set(['open-tab','open-tour','open-command','blocked','dl','tab-health','key','ctx-search','ask-ai','zoom-changed','update-state']);
const listeners = new Map();
const api = Object.freeze({
  invoke(channel, ...args) { if (!INVOKE.has(channel)) return Promise.reject(new Error('Operación no permitida')); return ipcRenderer.invoke(channel, ...args); },
  send(channel, ...args) { if (!SEND.has(channel)) return false; ipcRenderer.send(channel, ...args); return true; },
  sendSync(channel, ...args) { if (!SYNC.has(channel)) return undefined; return ipcRenderer.sendSync(channel, ...args); },
  on(channel, callback) {
    if (!EVENTS.has(channel) || typeof callback !== 'function') return () => {};
    const wrapped = (_event, ...args) => callback(undefined, ...args);
    ipcRenderer.on(channel, wrapped);
    const set = listeners.get(channel) || new Set(); set.add(wrapped); listeners.set(channel, set);
    return () => { ipcRenderer.removeListener(channel, wrapped); set.delete(wrapped); };
  },
  resolveNavigation(raw, searchProvider) {
    const value = String(raw ?? '').trim(); if (!value) return '';
    const allowed = ['https://www.google.com/search?q=','https://duckduckgo.com/?q=','https://www.bing.com/search?q=','https://search.brave.com/search?q='];
    try { const u = new URL(value); if (['http:','https:','file:'].includes(u.protocol)) return u.href; } catch {}
    const local = /^(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d{1,5})?(?:[/?#].*)?$/i;
    const ip = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?(?:[/?#].*)?$/;
    const domain = /^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+(?:\:\d{1,5})?(?:[/?#].*)?$/i;
    let candidate = ''; if (local.test(value) || ip.test(value)) candidate = 'http://' + value; else if (domain.test(value)) candidate = 'https://' + value;
    if (candidate) { try { const u = new URL(candidate); if (['http:','https:','file:'].includes(u.protocol)) return u.href; } catch {} }
    const provider = allowed.includes(searchProvider) ? searchProvider : allowed[0]; return provider + encodeURIComponent(value);
  },
  extensionCatalog: ipcRenderer.sendSync('extension-catalog') || [],
  extensionScript: id => ipcRenderer.sendSync('extension-script', String(id || '')) || '',
  newTabFileUrl: () => new URL('newtab.html', location.href).href
});
contextBridge.exposeInMainWorld('nova', api);
