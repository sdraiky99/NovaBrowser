const { app, BrowserWindow, ipcMain, session, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('Nova');
app.setAppUserModelId('com.nova.browser');

let win;
const blockers = new Map();
const activeDownloads = new Map();

const userFile = (...parts) => path.join(app.getPath('userData'), ...parts);

function uniquePath(dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  const safe = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'download';
  let out = path.join(dir, safe);
  if (!fs.existsSync(out)) return out;
  const ext = path.extname(safe);
  const base = ext ? safe.slice(0, -ext.length) : safe;
  for (let i = 1; i < 10000; i++) {
    out = path.join(dir, `${base} (${i})${ext}`);
    if (!fs.existsSync(out)) return out;
  }
  return path.join(dir, `${base}-${Date.now()}${ext}`);
}

async function setAdblockForSession(ses, on) {
  const key = ses.getStoragePath ? ses.getStoragePath() : 'default';
  try {
    if (!blockers.has(key)) {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      const blocker = await ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch);
      blocker.on('request-blocked', () => {
        if (win && !win.isDestroyed()) win.webContents.send('blocked');
      });
      blockers.set(key, blocker);
    }
    const blocker = blockers.get(key);
    if (on) blocker.enableBlockingInSession(ses);
    else blocker.disableBlockingInSession(ses);
    return true;
  } catch (err) {
    console.error('Adblock:', err);
    return false;
  }
}

function wireDownloads(ses, privateMode = false) {
  ses.on('will-download', (event, item) => {
    const dir = privateMode ? path.join(app.getPath('temp'), 'Nova-Private-Downloads') : app.getPath('downloads');
    const target = uniquePath(dir, item.getFilename());
    item.setSavePath(target);
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    activeDownloads.set(id, item);
    const send = state => {
      if (win && !win.isDestroyed()) {
        win.webContents.send('download', {
          id,
          name: item.getFilename(),
          path: target,
          received: item.getReceivedBytes(),
          total: item.getTotalBytes(),
          state,
          privateMode,
          paused: item.isPaused?.() || false
        });
      }
    };
    send('progressing');
    item.on('updated', () => send(item.isPaused?.() ? 'paused' : 'progressing'));
    item.once('done', (_e, state) => {
      send(state);
      activeDownloads.delete(id);
    });
  });
}

function createMain() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 620,
    frame: false,
    show: false,
    title: 'Nova Browser',
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#090913',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: true,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, 'shell/index.html'));
  win.once('ready-to-show', () => win.show());
  win.on('page-title-updated', event => event.preventDefault());
}

function buildContextMenu(params, contents) {
  const canBack = !!contents?.canGoBack?.();
  const canForward = !!contents?.canGoForward?.();
  const linkItems = params.linkURL ? [
    { label: 'Abrir enlace en pestaña nueva', click: () => win.webContents.send('open-tab', params.linkURL) },
    { label: 'Abrir enlace externamente', click: () => shell.openExternal(params.linkURL).catch(() => {}) },
    { label: 'Copiar dirección del enlace', click: () => require('electron').clipboard.writeText(params.linkURL) }
  ] : [];
  const selectionItems = params.selectionText ? [
    { type: 'separator' },
    { label: 'Buscar selección en Nova', click: () => win.webContents.send('open-tab', `https://duckduckgo.com/?q=${encodeURIComponent(params.selectionText)}`) },
    { label: 'Copiar selección', click: () => require('electron').clipboard.writeText(params.selectionText) }
  ] : [];
  return Menu.buildFromTemplate([
    { label: 'Atrás', enabled: canBack, click: () => win.webContents.send('context-action', 'back') },
    { label: 'Adelante', enabled: canForward, click: () => win.webContents.send('context-action', 'forward') },
    { label: 'Recargar', click: () => win.webContents.send('context-action', 'reload') },
    { type: 'separator' },
    ...linkItems,
    ...(params.mediaType === 'image' && params.srcURL ? [{ label: 'Abrir imagen en pestaña', click: () => win.webContents.send('open-tab', params.srcURL) }] : []),
    ...selectionItems,
    { type: 'separator' },
    { label: 'Buscar en página', click: () => win.webContents.send('context-action', 'find') },
    { label: 'Guardar página', click: () => win.webContents.send('context-action', 'save-page') },
    { label: 'Capturar página', click: () => win.webContents.send('context-action', 'capture') },
    { label: 'Vista de impresión', click: () => win.webContents.send('context-action', 'print') },
    { type: 'separator' },
    { label: 'Inspeccionar', click: () => win.webContents.send('context-action', 'devtools') }
  ]);
}

app.whenReady().then(async () => {
  const ua = session.defaultSession.getUserAgent()
    .replace(/\s?Electron\/\S+/i, '')
    .replace(/\s?Nova\/\S+/i, '') + ` Nova/${app.getVersion()}`;
  session.defaultSession.setUserAgent(ua);
  const browserSession = session.fromPartition('persist:nova');
  browserSession.setUserAgent(ua);
  const privateSession = session.fromPartition('nova-private');
  privateSession.setUserAgent(ua + ' Private');
  await setAdblockForSession(browserSession, true);
  await setAdblockForSession(privateSession, true);
  wireDownloads(browserSession, false);
  wireDownloads(privateSession, true);

  createMain();

  app.on('web-contents-created', (_event, contents) => {
    if (contents.getType() !== 'webview') return;
    contents.setVisualZoomLevelLimits?.(0.25, 5).catch(() => {});

    contents.setWindowOpenHandler(({ url }) => {
      if (url) win.webContents.send('open-tab', url);
      return { action: 'deny' };
    });

    contents.on('context-menu', (_e, params) => {
      if (win && !win.isDestroyed()) buildContextMenu(params, contents).popup({ window: win });
    });
  });
});

ipcMain.on('win', (_event, action) => {
  if (!win) return;
  if (action === 'min') win.minimize();
  if (action === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (action === 'close') win.close();
});

ipcMain.on('userdata', event => { event.returnValue = app.getPath('userData'); });

ipcMain.handle('install-cfg', () => {
  try {
    const cfgPath = userFile('install.cfg');
    const out = {};
    for (const line of fs.readFileSync(cfgPath, 'utf8').split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i <= 0) continue;
      out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    if ('adblock' in out) out.adblock = out.adblock === '1' || out.adblock === 'true';
    if ('restoreTabs' in out) out.restoreTabs = out.restoreTabs !== '0' && out.restoreTabs !== 'false';
    return out;
  } catch { return {}; }
});

ipcMain.handle('adblock', (_event, on) => setAdblockForSession(session.fromPartition('persist:nova'), !!on));

ipcMain.handle('adblock-private', (_event, on) => setAdblockForSession(session.fromPartition('nova-private'), !!on));

ipcMain.handle('save-shot', (_event, buf) => {
  const file = uniquePath(app.getPath('pictures'), `Nova-Captura-${new Date().toISOString().replace(/[:.]/g, '-')}.png`);
  fs.writeFileSync(file, Buffer.from(buf));
  return file;
});

ipcMain.handle('pick-wp', async (_event, section) => {
  const result = await dialog.showOpenDialog(win, {
    title: 'Añadir fondos a Nova',
    filters: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'] }],
    properties: ['openFile', 'multiSelections']
  });
  if (result.canceled) return 0;
  const dir = userFile('wallpapers', section);
  fs.mkdirSync(dir, { recursive: true });
  result.filePaths.forEach(file => fs.copyFileSync(file, path.join(dir, path.basename(file))));
  return result.filePaths.length;
});

ipcMain.handle('clear', async () => {
  const browserSession = session.fromPartition('persist:nova');
  await browserSession.clearStorageData();
  await browserSession.clearCache();
  await browserSession.clearHostResolverCache();
  return true;
});

ipcMain.handle('open-path', async (_event, file) => {
  if (!file) return false;
  const err = await shell.openPath(file);
  return !err;
});

ipcMain.handle('show-item', (_event, file) => { if (file) shell.showItemInFolder(file); return true; });

ipcMain.handle('print-pdf', async (_event, contentsId) => {
  const wc = require('electron').webContents.fromId(Number(contentsId));
  if (!wc) throw new Error('Pestaña no encontrada');
  const file = uniquePath(app.getPath('downloads'), `Nova-Pagina-${Date.now()}.pdf`);
  const data = await wc.printToPDF({ printBackground: true, preferCSSPageSize: true });
  fs.writeFileSync(file, data);
  return file;
});

ipcMain.handle('set-badge', (_event, count) => {
  if (process.platform === 'win32') app.setBadgeCount?.(Number(count) || 0);
  return true;
});

ipcMain.handle('download-control', (_event, id, action) => {
  const item = activeDownloads.get(String(id));
  if (!item) return false;
  try {
    if (action === 'pause') item.pause();
    if (action === 'resume') item.resume();
    if (action === 'cancel') item.cancel();
    return true;
  } catch { return false; }
});

ipcMain.handle('capture-page', async (_event, contentsId) => {
  const wc = require('electron').webContents.fromId(Number(contentsId));
  if (!wc) throw new Error('Pestaña no encontrada');
  const image = await wc.capturePage();
  const file = uniquePath(app.getPath('pictures'), `Nova-Captura-${Date.now()}.png`);
  fs.writeFileSync(file, image.toPNG());
  return file;
});

ipcMain.handle('save-page', async (_event, contentsId) => {
  const wc = require('electron').webContents.fromId(Number(contentsId));
  if (!wc) throw new Error('Pestaña no encontrada');
  const suggested = (wc.getTitle() || 'Nova-Pagina').replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 90) || 'Nova-Pagina';
  const picked = await dialog.showSaveDialog(win, {
    title: 'Guardar página',
    defaultPath: path.join(app.getPath('downloads'), `${suggested}.html`),
    filters: [{ name: 'Página HTML completa', extensions: ['html'] }, { name: 'Todos los archivos', extensions: ['*'] }]
  });
  if (picked.canceled || !picked.filePath) return null;
  await wc.savePage(picked.filePath, 'HTMLComplete');
  return picked.filePath;
});

ipcMain.handle('open-external', async (_event, url) => {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  await shell.openExternal(url);
  return true;
});

ipcMain.handle('fullscreen', () => {
  if (!win) return false;
  win.setFullScreen(!win.isFullScreen());
  return win.isFullScreen();
});


app.on('window-all-closed', () => app.quit());
