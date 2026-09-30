const { app, BrowserWindow, ipcMain, session, dialog, Menu, clipboard, safeStorage } = require('electron');
const path = require('path'), fs = require('fs');
app.setName('Nova');
let win, splash, blocker;
const web = () => session.fromPartition('persist:web'); // datos de navegación aislados de la interfaz de Nova

const userFile = (...p) => path.join(app.getPath('userData'), ...p);

async function setAdblock(on) {
  try {
    if (!blocker) {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      blocker = await ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch);
      let bt = 0, n = 0;
      blocker.on('request-blocked', () => { n++; if (!bt) bt = setTimeout(() => { bt = 0; win && win.webContents.send('blocked', n); }, 600); });
    }
    const ses = web();
    on ? blocker.enableBlockingInSession(ses) : blocker.disableBlockingInSession(ses);
  } catch (e) { console.error('Adblock:', e.message); }
}

function createMain() {
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 720, minHeight: 480,
    frame: false, show: false, title: 'Nova',
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#0d0b1a',
    webPreferences: { nodeIntegration: true, contextIsolation: false, webviewTag: true }
  });
  win.loadFile('shell/index.html');
  win.once('ready-to-show', () => { if (splash) splash.close(); win.show(); });
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.on('context-menu', (e, p) => {
    if (!p.isEditable && !p.selectionText) return; const w = win.webContents;
    Menu.buildFromTemplate([{ label: 'Cortar', enabled: p.editFlags.canCut, click: () => w.cut() }, { label: 'Copiar', enabled: p.editFlags.canCopy, click: () => w.copy() },
      { label: 'Pegar', enabled: p.editFlags.canPaste, click: () => w.paste() }, { label: 'Seleccionar todo', click: () => w.selectAll() }]).popup({ window: win });
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const ua = web().getUserAgent()
    .replace(/\s?Electron\/\S+/i, '').replace(/\s?nova-browser\/\S+/i, '').replace(/\s?Nova\/\S+/i, '') + ' Nova/2.0';
  web().setUserAgent(ua);

  splash = new BrowserWindow({
    width: 420, height: 420, frame: false, transparent: true, resizable: false,
    alwaysOnTop: true, skipTaskbar: true, icon: path.join(__dirname, 'assets/icon.png')
  });
  splash.loadFile('shell/splash.html');
  createMain(); // la ventana se crea ya; el splash se cierra en ready-to-show

  const dlMap = new Map(), dlSend = new Map();
  web().on('will-download', (e, item) => {
    const id = Date.now() + Math.random(), dir = app.getPath('downloads');
    let f = path.join(dir, item.getFilename()), n = 1; const ext = path.extname(f), base = f.slice(0, f.length - ext.length);
    while (fs.existsSync(f)) f = `${base} (${n++})${ext}`;
    item.setSavePath(f); dlMap.set(id, item); let last = 0;
    const send = (st, force) => { const t = Date.now(); if (!force && t - last < 400) return; last = t; win && win.webContents.send('dl', { id, name: path.basename(f), path: f, recv: item.getReceivedBytes(), total: item.getTotalBytes(), state: st }); };
    dlSend.set(id, send); send('progressing', true);
    item.on('updated', (_, s) => send(s === 'interrupted' ? 'interrupted' : item.isPaused() ? 'paused' : 'progressing'));
    item.once('done', (_, st) => { dlMap.delete(id); dlSend.delete(id); send(st === 'interrupted' ? 'interrupted' : st, true); });
  });
  ipcMain.on('dl-ctl', (_, { id, a }) => {
    const it = dlMap.get(id), s = dlSend.get(id); if (!it) return;
    if (a === 'pause') { it.pause(); s('paused', true); } if (a === 'resume') { it.resume(); s('progressing', true); } if (a === 'cancel') it.cancel();
  });
  // permisos de sitios: cámara, micrófono, ubicación, notificaciones
  let perms = { cam: 'ask', mic: 'ask', geo: 'ask', notif: 'ask' };
  ipcMain.on('perm-policy', (_, p) => { perms = Object.assign(perms, p); });
  const PK = (perm, d) => perm === 'media' ? ((d.mediaTypes || []).includes('video') ? 'cam' : 'mic') : perm === 'geolocation' ? 'geo' : perm === 'notifications' ? 'notif' : null;
  const LBL = { cam: 'la cámara', mic: 'el micrófono', geo: 'tu ubicación', notif: 'enviar notificaciones' }, SAFE = ['fullscreen', 'clipboard-sanitized-write', 'pointerLock'];
  web().setPermissionRequestHandler((wc, perm, cb, d) => {
    const k = PK(perm, d); if (!k) return cb(SAFE.includes(perm));
    if (perms[k] === 'allow') return cb(true); if (perms[k] === 'block') return cb(false);
    let host = ''; try { host = new URL(d.requestingUrl).hostname; } catch { }
    dialog.showMessageBox(win, { type: 'question', buttons: ['Permitir', 'Bloquear'], defaultId: 1, cancelId: 1, title: 'Permiso del sitio', message: `${host || 'Un sitio'} quiere usar ${LBL[k]}` }).then(r => cb(r.response === 0));
  });
  web().setPermissionCheckHandler((wc, perm) => SAFE.includes(perm));
  app.on('web-contents-created', (_, c) => {
    if (c.getType() === 'window') {
      c.on('will-attach-webview', (e, wp, params) => { delete wp.preload; wp.nodeIntegration = false; wp.contextIsolation = true; if (!/^(https?:|file:|about:)/.test(params.src || '')) e.preventDefault(); });
      c.on('will-navigate', e => e.preventDefault()); c.setWindowOpenHandler(() => ({ action: 'deny' }));
    }
    if (c.getType() !== 'webview') return;
    c.setWindowOpenHandler(({ url }) => { if (/^(https?:|nova:)/.test(url)) win.webContents.send('open-tab', url); return { action: 'deny' }; });

    c.on('context-menu', (e, p) => {
      const T = [], nav = c.navigationHistory, send = (ch, d) => win.webContents.send(ch, d);
      if (p.linkURL) T.push({ label: 'Abrir enlace en pestaña nueva', click: () => send('open-tab', p.linkURL) },
        { label: 'Copiar dirección del enlace', click: () => clipboard.writeText(p.linkURL) }, { type: 'separator' });
      if (p.mediaType === 'image') T.push({ label: 'Copiar imagen', click: () => c.copyImageAt(p.x, p.y) },
        { label: 'Copiar dirección de la imagen', click: () => clipboard.writeText(p.srcURL) },
        { label: 'Guardar imagen', click: () => c.downloadURL(p.srcURL) },
        { label: 'Abrir imagen en pestaña nueva', click: () => send('open-tab', p.srcURL) }, { type: 'separator' });
      if (p.isEditable) T.push({ label: 'Cortar', enabled: p.editFlags.canCut, click: () => c.cut() },
        { label: 'Copiar', enabled: p.editFlags.canCopy, click: () => c.copy() },
        { label: 'Pegar', enabled: p.editFlags.canPaste, click: () => c.paste() },
        { label: 'Seleccionar todo', click: () => c.selectAll() }, { type: 'separator' });
      const s = (p.selectionText || '').trim();
      if (s) {
        if (!p.isEditable) T.push({ label: 'Copiar', click: () => c.copy() });
        T.push({ label: 'Buscar "' + s.slice(0, 24) + (s.length > 24 ? '…' : '') + '"', click: () => send('ctx-search', s) },
          { label: 'Explicar con Nova IA', click: () => send('ask-ai', { m: 'exp', t: s }) },
          { label: 'Traducir con Nova IA', click: () => send('ask-ai', { m: 'tr', t: s }) }, { type: 'separator' });
      } else if (!p.isEditable) T.push({ label: 'Seleccionar todo', click: () => c.selectAll() }, { type: 'separator' });
      T.push({ label: 'Atrás', enabled: nav.canGoBack(), click: () => nav.goBack() },
        { label: 'Adelante', enabled: nav.canGoForward(), click: () => nav.goForward() },
        { label: 'Recargar', click: () => c.reload() }, { type: 'separator' },
        { label: 'Copiar dirección de la página', click: () => clipboard.writeText(c.getURL()) },
        { label: 'Captura de pantalla', click: () => send('key', 'shot') },
        { label: 'Inspeccionar elemento', click: () => c.inspectElement(p.x, p.y) });
      Menu.buildFromTemplate(T).popup({ window: win });
    });
    c.on('before-input-event', (e, i) => {
      if (i.control && i.type === 'keyDown' && ('twlfdhjkTrRDB '.includes(i.key) || i.key === 'Tab')) {
        e.preventDefault(); win.webContents.send('key', i.key === 'Tab' ? (i.shift ? 'shift-tab' : 'tab') : i.key);
      }
    });
  });
});

ipcMain.on('win', (_, a) => {
  if (a === 'min') win.minimize();
  if (a === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (a === 'close') win.close();
  if (a === 'full') win.setFullScreen(!win.isFullScreen());
});
ipcMain.on('app-version', e => (e.returnValue = app.getVersion()));
ipcMain.on('userdata', e => (e.returnValue = app.getPath('userData')));
ipcMain.handle('install-cfg', () => {
  try { return JSON.parse(fs.readFileSync(userFile('install.json'), 'utf8')); } catch { return {}; }
});
ipcMain.handle('adblock', (_, on) => setAdblock(on));
ipcMain.handle('save-shot', (_, buf) => {
  const f = path.join(app.getPath('pictures'), `Nova-${Date.now()}.png`);
  fs.writeFileSync(f, Buffer.from(buf)); return f;
});
ipcMain.handle('pick-wp', async (_, sec) => {
  const r = await dialog.showOpenDialog(win, { filters: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'] }], properties: ['openFile', 'multiSelections'] });
  if (r.canceled) return 0;
  const dir = userFile('wallpapers', sec); fs.mkdirSync(dir, { recursive: true });
  r.filePaths.forEach(f => fs.copyFileSync(f, path.join(dir, path.basename(f))));
  return r.filePaths.length;
});
const keyFile = () => userFile('nova.key');
const getKey = () => { try { return safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(fs.readFileSync(keyFile())) : null; } catch { return null; } };
ipcMain.handle('key-set', (_, k) => { try { if (!k) { fs.rmSync(keyFile(), { force: true }); return true; } if (!safeStorage.isEncryptionAvailable()) return false; fs.writeFileSync(keyFile(), safeStorage.encryptString(k)); return true; } catch { return false; } });
ipcMain.handle('key-has', () => !!getKey());
ipcMain.handle('ai-ask', async (_, { msgs, system, model }) => {
  const post = async (url, headers, body) => { const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) }); if (!r.ok && r.status !== 400) throw new Error('HTTP ' + r.status); return r.json(); };
  try {
    const k = getKey();
    if (k) { const d = await post('https://api.anthropic.com/v1/messages', { 'x-api-key': k, 'anthropic-version': '2023-06-01' }, { model: model || 'claude-sonnet-4-6', max_tokens: 1500, system, messages: msgs }); if (d.error) return { error: d.error.message }; return { text: d.content.map(c => c.text || '').join(''), src: 'claude' }; }
    const d = await post('https://text.pollinations.ai/openai', {}, { model: 'openai', messages: [{ role: 'system', content: system }, ...msgs] });
    return { text: d.choices?.[0]?.message?.content || 'Sin respuesta.', src: 'free' };
  } catch (e) { return { error: e.message }; }
});
ipcMain.handle('clear-data', async (_, o) => {
  const s = web(), st = []; if (o.cookies) st.push('cookies'); if (o.storage) st.push('localstorage', 'indexdb', 'serviceworkers', 'cachestorage', 'websql', 'filesystem');
  if (st.length) await s.clearStorageData({ storages: st }); if (o.cache) await s.clearCache(); return true;
});
ipcMain.handle('clear', async () => { await web().clearStorageData(); await web().clearCache(); return true; });
app.on('window-all-closed', () => app.quit());
