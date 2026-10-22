'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// Expose the small bridge only on Nova's own new-tab document. External pages
// get no Nova API, Node integration, or direct IPC access.
let isNovaNewTab = false;
try {
  const u = new URL(location.href);
  isNovaNewTab = u.protocol === 'file:' && decodeURIComponent(u.pathname).toLowerCase().endsWith('/shell/newtab.html');
} catch { }

if (isNovaNewTab) {
  const sendAction = (type, value) => {
    if (!['navigate', 'open-tour', 'open-command', 'open-whats-new', 'open-settings', 'add-shortcut'].includes(type)) return;
    const payload = { type };
    if (type === 'navigate') {
      if (typeof value !== 'string' || value.length > 2048) return;
      payload.value = value;
    } else if (type === 'add-shortcut') {
      if (!value || typeof value !== 'object' || typeof value.title !== 'string' || typeof value.url !== 'string') return;
      if (!value.title.trim() || value.title.length > 80 || !value.url.trim() || value.url.length > 2048) return;
      payload.value = { title: value.title.trim(), url: value.url.trim() };
    }
    ipcRenderer.sendToHost('nova-newtab-action', payload);
  };

  contextBridge.exposeInMainWorld('novaNewTab', Object.freeze({
    navigate: value => sendAction('navigate', value),
    openTour: () => sendAction('open-tour'),
    openCommand: () => sendAction('open-command'),
    openWhatsNew: () => sendAction('open-whats-new'),
    openSettings: () => sendAction('open-settings'),
    addShortcut: (title, url) => sendAction('add-shortcut', { title, url }),
    newsFeed: payload => {
      const topic = ['todas', 'tecnologia', 'videojuegos', 'codigo'].includes(payload?.topic) ? payload.topic : 'todas';
      return ipcRenderer.invoke('news-feed', { topic, force: payload?.force === true });
    }
  }));
}
