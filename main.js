const { app, BrowserWindow, ipcMain, session, dialog, Menu, clipboard } = require('electron');
const path = require('path'), fs = require('fs');
app.setName('Nova');
let win, splash, blocker;

const userFile = (...p) => path.join(app.getPath('userData'), ...p);

async function setAdblock(on) {
  try {
    if (!blocker) {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      blocker = await ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch);
      let bt = 0, n = 0;
      blocker.on('request-blocked', () => { n++; if (!bt) bt = setTimeout(() => { bt = 0; win && win.webContents.send('blocked', n); }, 600); });
    }
    const ses = session.defaultSession;
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
  const ua = session.defaultSession.getUserAgent()
    .replace(/\s?Electron\/\S+/i, '').replace(/\s?nova-browser\/\S+/i, '').replace(/\s?Nova\/\S+/i, '') + ' Nova/2.0';
  session.defaultSession.setUserAgent(ua);

  splash = new BrowserWindow({
    width: 420, height: 420, frame: false, transparent: true, resizable: false,
    alwaysOnTop: true, skipTaskbar: true, icon: path.join(__dirname, 'assets/icon.png')
  });
  splash.loadFile('shell/splash.html');
  setTimeout(createMain, 1900);

  session.defaultSession.on('will-download', (e, item) => {
    const id = Date.now() + Math.random(), f = path.join(app.getPath('downloads'), item.getFilename());
    item.setSavePath(f);
    const send = st => win && win.webContents.send('dl', { id, name: item.getFilename(), path: f, recv: item.getReceivedBytes(), total: item.getTotalBytes(), state: st });
    send('progressing'); item.on('updated', () => send('progressing')); item.once('done', (_, st) => send(st));
  });
  app.on('web-contents-created', (_, c) => {
    if (c.getType() !== 'webview') return;
    c.setWindowOpenHandler(({ url }) => { win.webContents.send('open-tab', url); return { action: 'deny' }; });

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
      if (i.control && i.type === 'keyDown' && 'twlfdhjkT'.includes(i.key)) {
        e.preventDefault(); win.webContents.send('key', i.key);
      }
    });
  });
});

ipcMain.on('win', (_, a) => {
  if (a === 'min') win.minimize();
  if (a === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (a === 'close') win.close();
});
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
ipcMain.handle('clear', async () => { await session.defaultSession.clearStorageData(); await session.defaultSession.clearCache(); return true; });
app.on('window-all-closed', () => app.quit());
