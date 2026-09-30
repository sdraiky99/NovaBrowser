const { app, BrowserWindow, ipcMain, session, dialog, Menu, clipboard, safeStorage, shell, webContents, nativeImage } = require('electron');
const path = require('path'), fs = require('fs'), { execFile } = require('child_process');
const fetch = require('cross-fetch');
const APP_ID = 'com.nova.browser';
app.setName('Nova');
app.setAppUserModelId(APP_ID); // imprescindible en Windows: agrupa la ventana con el acceso directo y permite cambiar el icono de la barra de tareas
// rendimiento: rasterizado por GPU y sin el cálculo de oclusión de Windows (evita tirones al volver a la ventana)
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
let win, splash, splashAt = 0, pendingUrl = null;
const EXT = require('./shell/extensions.js');
const { createMigrationService } = require('./migration.js');
const migration = createMigrationService(app);
const { createAccountService } = require('./account-service.js');
const accounts = createAccountService({ app, safeStorage, fetch });
const LOGOS = ['classic', 'orbita', 'estrella', 'cometa', 'minimal'], SPLASH_MS = 1800;
const logoId = id => (LOGOS.includes(id) ? id : 'classic');
const logoIco = id => path.join(__dirname, `assets/logos/${logoId(id)}.ico`);      // dentro del paquete (asar)
const logoImg = id => { const i = nativeImage.createFromPath(process.platform === 'win32' ? logoIco(id) : path.join(__dirname, `assets/logos/${logoId(id)}.png`)); return i.isEmpty() ? nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png')) : i; };
// preferencias que el proceso principal necesita antes de abrir la interfaz (logo, animación de inicio, extensiones)
let prefs = { logo: 'classic', splash: true, ext: {}, reg: '' };
const prefsFile = () => path.join(app.getPath('userData'), 'prefs.json');
const atomicWrite = (file, data) => {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
};
const loadPrefs = () => { try { prefs = Object.assign(prefs, JSON.parse(fs.readFileSync(prefsFile(), 'utf8'))); } catch { } };
const savePrefs = () => { try { atomicWrite(prefsFile(), JSON.stringify(prefs)); } catch { } };
const { pathToFileURL } = require('url');
const extUrl = a => { // enlace http(s) o archivo .html/.pdf/.svg... recibido desde Windows (navegador predeterminado)
  for (const x of a || []) {
    if (/^https?:\/\//i.test(x)) return x;
    if (/\.(html?|xhtml|pdf|svg|webp|png|jpe?g|gif|txt)$/i.test(x) && !/^-/.test(x)) { try { if (fs.existsSync(x)) return pathToFileURL(path.resolve(x)).href; } catch { } }
  }
};
// una sola instancia: si Nova es el navegador predeterminado, los enlaces llegan a la ventana abierta
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else app.on('second-instance', (_, argv) => {
  if (!win) return; if (win.isMinimized()) win.restore(); win.show(); win.focus();
  const u = extUrl(argv); if (u) win.webContents.send('open-tab', u);
});
const applyExt = (wc, ids) => {
  if (wc.isDestroyed()) return;
  const run = id => { const p = wc.executeJavaScript(EXT.on(id)); const t = new Promise((_, reject) => setTimeout(() => reject(new Error('extension-timeout')), 5000)); return Promise.race([p, t]).catch(() => { }); };
  (ids || Object.keys(prefs.ext).filter(k => prefs.ext[k])).forEach(run);
};
const web = () => session.fromPartition('persist:web'); // datos de navegación aislados de la interfaz de Nova

const userFile = (...p) => path.join(app.getPath('userData'), ...p);

let blockerP = null, blockOn = null, blockerAt = 0, blockerRefreshBusy = false;
const AD_CACHE = () => userFile('adblock-2.18.bin');
async function setAdblock(on) {
  on = !!on; if (blockOn === on) return; blockOn = on;
  try {
    if (!blockerP) blockerP = (async () => {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      // Cache versionada para no reutilizar un motor serializado de otra versión.
      const cache = { path: AD_CACHE(), read: fs.promises.readFile, write: fs.promises.writeFile };
      const fetcher = require('cross-fetch');
      const load = () => ElectronBlocker.fromPrebuiltAdsAndTracking(fetcher, cache);
      let b;
      try { b = await load(); } catch { b = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetcher); }
      let bt = 0, n = 0;
      b.on('request-blocked', () => {
        n++;
        if (!bt) bt = setTimeout(() => { bt = 0; if (win && !win.isDestroyed()) win.webContents.send('blocked', n); }, 600);
      });
      blockerAt = Date.now();
      return b;
    })();
    const b = await blockerP; if (blockOn !== on) return;
    const ses = web();
    on ? b.enableBlockingInSession(ses) : b.disableBlockingInSession(ses);
  } catch (e) {
    blockerP = null;
    blockOn = null;
    console.error('Adblock:', e.message);
  }
}

async function refreshAdblockLists() {
  if (!blockOn || blockerRefreshBusy) return;
  blockerRefreshBusy = true;
  try {
    const oldP = blockerP;
    if (oldP) { try { (await oldP).disableBlockingInSession(web()); } catch { } }
    blockerP = null; blockOn = false;
    try { fs.rmSync(AD_CACHE(), { force: true }); } catch { }
    await setAdblock(true);
  } finally { blockerRefreshBusy = false; }
}
const adblockRefreshTimer = setInterval(() => { if (blockerAt && Date.now() - blockerAt > 7 * 24 * 3600e3) refreshAdblockLists().catch(() => { }); }, 30 * 60e3);
adblockRefreshTimer.unref?.();


/* ---------- Windows: registro como navegador y logotipo en la barra de tareas ---------- */
const reg = (...a) => new Promise(r => execFile('reg.exe', a, { windowsHide: true }, (e, out) => r(e ? null : String(out))));
const regAdd = (key, name, val) => reg('add', 'HKCU\\' + key, name ? '/v' : '/ve', ...(name ? [name] : []), '/t', 'REG_SZ', '/d', val, '/f');
// Windows 10/11 solo deja elegir como predeterminado a los navegadores registrados con estas claves.
// El instalador ya las crea; esto las repara/actualiza solo si cambió la ruta o la versión (no hace nada más).
async function registerBrowser(force) {
  if (process.platform !== 'win32' || process.env.PORTABLE_EXECUTABLE_FILE || !app.isPackaged) return;
  const sig = process.execPath + '|' + app.getVersion(); if (!force && prefs.reg === sig) return;
  const exe = process.execPath, cmd = `"${exe}" "%1"`, ico = `"${exe}",0`, C = 'Software\\Clients\\StartMenuInternet\\Nova';
  const rows = [
    ['Software\\Classes\\NovaURL', '', 'Nova URL'], ['Software\\Classes\\NovaURL', 'URL Protocol', ''], ['Software\\Classes\\NovaURL\\DefaultIcon', '', ico], ['Software\\Classes\\NovaURL\\shell\\open\\command', '', cmd],
    ['Software\\Classes\\NovaHTML', '', 'Nova HTML Document'], ['Software\\Classes\\NovaHTML\\DefaultIcon', '', ico], ['Software\\Classes\\NovaHTML\\shell\\open\\command', '', cmd],
    [C, '', 'Nova'], [C + '\\DefaultIcon', '', ico], [C + '\\shell\\open\\command', '', `"${exe}"`],
    [C + '\\Capabilities', 'ApplicationName', 'Nova'], [C + '\\Capabilities', 'ApplicationIcon', ico],
    [C + '\\Capabilities', 'ApplicationDescription', 'Navegador web moderno basado en Chromium'],
    [C + '\\Capabilities\\URLAssociations', 'http', 'NovaURL'], [C + '\\Capabilities\\URLAssociations', 'https', 'NovaURL'],
    [C + '\\Capabilities\\FileAssociations', '.html', 'NovaHTML'], [C + '\\Capabilities\\FileAssociations', '.htm', 'NovaHTML'],
    ['Software\\RegisteredApplications', 'Nova', C + '\\Capabilities']
  ];
  for (const [k, n, v] of rows) await regAdd(k, n, v);
  prefs.reg = sig; savePrefs();
}
// ¿Es Nova el navegador que Windows usa de verdad? (lee la elección del usuario, no solo las claves de Nova)
async function isWinDefault() {
  const o = await reg('query', 'HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\https\\UserChoice', '/v', 'ProgId');
  return !!o && /NovaURL/i.test(o);
}
// Copia el .ico fuera del paquete (Windows no puede leer dentro de app.asar) y devuelve su ruta
function iconFile(id) {
  const dst = userFile('icons', `nova-${logoId(id)}.ico`);
  try { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, fs.readFileSync(logoIco(id))); return dst; } catch { return null; }
}
// Cambia el logotipo: ventana, barra de tareas (abierta y anclada), escritorio y menú Inicio
function applyLogo(id) {
  try { win && !win.isDestroyed() && win.setIcon(logoImg(id)); } catch { }
  if (process.platform !== 'win32' || !app.isPackaged) return;
  const f = iconFile(id); if (!f) return;
  try { win && !win.isDestroyed() && win.setAppDetails({ appId: APP_ID, appIconPath: f, appIconIndex: 0, relaunchCommand: `"${process.execPath}"`, relaunchDisplayName: 'Nova' }); } catch { }
  const dirs = [path.join(app.getPath('desktop')), path.join(process.env.APPDATA || '', 'Microsoft/Windows/Start Menu/Programs'), path.join(process.env.APPDATA || '', 'Microsoft/Internet Explorer/Quick Launch/User Pinned/TaskBar'), path.join(process.env.APPDATA || '', 'Microsoft/Internet Explorer/Quick Launch')];
  let changed = 0;
  for (const d of dirs) {
    let list = []; try { list = fs.readdirSync(d).filter(x => /\.lnk$/i.test(x)); } catch { continue; }
    for (const n of list) {
      const lnk = path.join(d, n);
      try { const o = shell.readShortcutLink(lnk); if (path.resolve(o.target || '').toLowerCase() === path.resolve(process.execPath).toLowerCase() && shell.writeShortcutLink(lnk, 'update', { icon: f, iconIndex: 0 })) changed++; } catch { }
    }
  }
  if (changed) execFile('ie4uinit.exe', ['-show'], { windowsHide: true }, () => { }); // refresca la caché de iconos de Windows
}

const isMainRenderer = sender => !!(win && !win.isDestroyed() && sender === win.webContents);
const denyUntrusted = e => !isMainRenderer(e.sender);
const safeWebUrl = u => {
  try {
    const x = new URL(u);
    return x.protocol === 'http:' || x.protocol === 'https:' || x.protocol === 'file:' || (x.protocol === 'about:' && x.href === 'about:blank');
  } catch { return false; }
};

function createMain() {
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 720, minHeight: 480,
    frame: false, show: false, title: 'Nova',
    icon: logoImg(prefs.logo),
    backgroundColor: '#0d0b1a',
    webPreferences: { nodeIntegration: true, contextIsolation: false, webviewTag: true, webSecurity: true, allowRunningInsecureContent: false }
  });
  win.loadFile('shell/index.html');
  win.once('ready-to-show', () => {
    const go = () => { if (splash && !splash.isDestroyed()) splash.close(); win.show(); };
    setTimeout(go, splash ? Math.max(0, splashAt + SPLASH_MS - Date.now()) : 0); // deja ver la animación de inicio
  });
  win.webContents.once('did-finish-load', () => { if (pendingUrl) setTimeout(() => win && win.webContents.send('open-tab', pendingUrl), 900); });
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('before-input-event', (e, input) => { if (input.type === 'keyDown' && input.key === 'F12') { e.preventDefault(); try { win.webContents.toggleDevTools(); } catch { } } });
  win.webContents.on('render-process-gone', () => { setTimeout(() => { try { if (win && !win.isDestroyed()) win.reload(); } catch { } }, 800); });
  win.webContents.on('context-menu', (e, p) => {
    if (!p.isEditable && !p.selectionText) return; const w = win.webContents;
    Menu.buildFromTemplate([{ label: 'Cortar', enabled: p.editFlags.canCut, click: () => w.cut() }, { label: 'Copiar', enabled: p.editFlags.canCopy, click: () => w.copy() },
      { label: 'Pegar', enabled: p.editFlags.canPaste, click: () => w.paste() }, { label: 'Seleccionar todo', click: () => w.selectAll() }]).popup({ window: win });
  });
}

app.whenReady().then(() => {
  if (!gotLock) return;
  loadPrefs(); pendingUrl = extUrl(process.argv.slice(1));
  Menu.setApplicationMenu(null);
  const ua = web().getUserAgent()
    .replace(/\s?Electron\/\S+/i, '').replace(/\s?nova-browser\/\S+/i, '').replace(/\s?Nova\/\S+/i, '') + ' Nova/2.0';
  web().setUserAgent(ua);

  if (prefs.splash !== false) { // animación de inicio (se puede quitar en Personalizar)
    splash = new BrowserWindow({
      width: 420, height: 420, frame: false, transparent: true, resizable: false,
      alwaysOnTop: true, skipTaskbar: true, icon: logoImg(prefs.logo)
    });
    splash.loadFile('shell/splash.html', { query: { logo: logoId(prefs.logo) } });
    splashAt = Date.now();
  }
  createMain();
  setTimeout(() => { registerBrowser(false).catch(() => { }); if (prefs.logo !== 'classic') applyLogo(prefs.logo); }, 4000);

  const dlMap = new Map(), dlSend = new Map();
  web().on('will-download', (e, item) => {
    const id = Date.now() + Math.random(), dir = app.getPath('downloads');
    const rawName = path.basename(item.getFilename() || 'download');
    let f = path.join(dir, rawName || 'download'), n = 1; const ext = path.extname(f), base = f.slice(0, f.length - ext.length);
    while (fs.existsSync(f)) f = `${base} (${n++})${ext}`;
    item.setSavePath(f); dlMap.set(id, item); let last = 0;
    const send = (st, force) => { const t = Date.now(); if (!force && t - last < 400) return; last = t; win && win.webContents.send('dl', { id, name: path.basename(f), path: f, recv: item.getReceivedBytes(), total: item.getTotalBytes(), state: st }); };
    dlSend.set(id, send); send('progressing', true);
    item.on('updated', (_, s) => send(s === 'interrupted' ? 'interrupted' : item.isPaused() ? 'paused' : 'progressing'));
    item.once('done', (_, st) => { dlMap.delete(id); dlSend.delete(id); send(st === 'interrupted' ? 'interrupted' : st, true); });
  });
  ipcMain.on('dl-ctl', (e, data) => {
    if (denyUntrusted(e) || !data || typeof data !== 'object') return;
    const { id, a } = data;
    const it = dlMap.get(id), s = dlSend.get(id); if (!it) return;
    if (a === 'pause') { it.pause(); s('paused', true); } if (a === 'resume') { it.resume(); s('progressing', true); } if (a === 'cancel') it.cancel();
  });
  // permisos de sitios: cámara, micrófono, ubicación, notificaciones
  let perms = { cam: 'ask', mic: 'ask', geo: 'ask', notif: 'ask' };
  ipcMain.on('perm-policy', (e, p) => { if (denyUntrusted(e) || !p || typeof p !== 'object') return; const clean = {}; for (const k of ['cam','mic','geo','notif']) if (['ask','allow','block'].includes(p[k])) clean[k] = p[k]; perms = Object.assign(perms, clean); });
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
      c.on('will-attach-webview', (e, wp, params) => {
        delete wp.preload;
        wp.nodeIntegration = false;
        wp.nodeIntegrationInSubFrames = false;
        wp.contextIsolation = true;
        wp.sandbox = true;
        wp.webSecurity = true;
        wp.allowRunningInsecureContent = false;
        wp.allowFileAccessFromFileUrls = false;
        wp.allowUniversalAccessFromFileUrls = false;
        if (!safeWebUrl(params.src || '')) e.preventDefault();
      });
      c.on('will-navigate', e => e.preventDefault()); c.setWindowOpenHandler(() => ({ action: 'deny' }));
    }
    if (c.getType() !== 'webview') return;
    c.on('dom-ready', () => applyExt(c));
    c.on('unresponsive', () => { if (win && !win.isDestroyed()) win.webContents.send('tab-health', { type: 'unresponsive' }); });
    c.on('responsive', () => { if (win && !win.isDestroyed()) win.webContents.send('tab-health', { type: 'responsive' }); });
    c.on('render-process-gone', (_e, details) => {
      if (win && !win.isDestroyed()) win.webContents.send('tab-health', { type: 'gone', reason: details && details.reason });
      setTimeout(() => { try { if (!c.isDestroyed() && c.getURL()) c.reload(); } catch { } }, 800);
    });
    const allowNavigation = url => {
      if (!safeWebUrl(url)) return false;
      if (/^file:/i.test(url) && !/^file:/i.test(c.getURL() || '')) return false;
      return true;
    };
    c.on('will-navigate', (e, url) => { if (!allowNavigation(url)) e.preventDefault(); });
    c.on('will-redirect', (e, url) => { if (!allowNavigation(url)) e.preventDefault(); });
    c.setWindowOpenHandler(({ url }) => { if (/^(https?:)/i.test(url)) win.webContents.send('open-tab', url); return { action: 'deny' }; });

    c.on('before-input-event', (e, input) => { if (input.type === 'keyDown' && input.key === 'F12') { e.preventDefault(); try { c.toggleDevTools(); } catch { } } });

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

ipcMain.on('fullscreen', e => { if (denyUntrusted(e) || !win || win.isDestroyed()) return; try { win.setFullScreen(!win.isFullScreen()); } catch { } });
ipcMain.handle('opacity', (e, v) => { if (denyUntrusted(e) || !win || win.isDestroyed() || typeof v !== 'number' || !Number.isFinite(v)) return false; try { win.setOpacity(Math.max(0.35, Math.min(1, v))); return true; } catch { return false; } });
ipcMain.on('win', (e, a) => {
  if (denyUntrusted(e)) return;
  if (a === 'min') win.minimize();
  if (a === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (a === 'close') win.close();
  if (a === 'full') win.setFullScreen(!win.isFullScreen());
});
ipcMain.on('app-version', e => { if (denyUntrusted(e)) return; e.returnValue = app.getVersion(); });
ipcMain.on('prefs-get', e => { if (denyUntrusted(e)) return; e.returnValue = JSON.parse(JSON.stringify(prefs)); });
ipcMain.on('prefs-set', (e, p) => {
  if (denyUntrusted(e)) return;
  if (!p || typeof p !== 'object') return;
  if (LOGOS.includes(p.logo)) { prefs.logo = p.logo; applyLogo(p.logo); }
  if (typeof p.splash === 'boolean') prefs.splash = p.splash;
  if (p.ext && typeof p.ext === 'object') { // instalar / activar / quitar extensiones al instante
    const nx = {}; Object.keys(p.ext).forEach(id => { if (EXT.byId(id)) nx[id] = !!p.ext[id]; });
    const all = webContents.getAllWebContents().filter(w => w.getType() === 'webview' && !w.isDestroyed());
    EXT.CATALOG.forEach(({ id }) => { const was = !!prefs.ext[id], now = !!nx[id]; if (was && !now) all.forEach(w => w.executeJavaScript(EXT.off(id)).catch(() => { })); if (!was && now) all.forEach(w => applyExt(w, [id])); });
    prefs.ext = nx;
  }
  savePrefs();
});
ipcMain.handle('default-browser', async (e, set) => {
  if (denyUntrusted(e)) return { portable: !!process.env.PORTABLE_EXECUTABLE_FILE, isDefault: false };
  const portable = !!process.env.PORTABLE_EXECUTABLE_FILE;
  if (process.platform !== 'win32') { if (set) { app.setAsDefaultProtocolClient('http'); app.setAsDefaultProtocolClient('https'); } return { portable, isDefault: app.isDefaultProtocolClient('https') }; }
  if (portable) return { portable, isDefault: false };
  if (set) {
    await registerBrowser(true); // asegura que Nova figura en "Aplicaciones predeterminadas"
    shell.openExternal('ms-settings:defaultapps?registeredAppUser=Nova').catch(() => shell.openExternal('ms-settings:defaultapps'));
  }
  return { portable, isDefault: await isWinDefault() };
});
ipcMain.on('userdata', e => { if (denyUntrusted(e)) return; e.returnValue = app.getPath('userData'); });
ipcMain.handle('install-cfg', e => { if (denyUntrusted(e)) return {}; 
  try { return JSON.parse(fs.readFileSync(userFile('install.json'), 'utf8')); } catch { return {}; }
});
ipcMain.handle('adblock', (e, on) => { if (denyUntrusted(e) || typeof on !== 'boolean') return false; return setAdblock(on); });
ipcMain.handle('save-shot', (e, buf) => {
  if (denyUntrusted(e) || (!Buffer.isBuffer(buf) && !(buf instanceof Uint8Array)) || buf.length > 25 * 1024 * 1024) return null;
  const f = path.join(app.getPath('pictures'), `Nova-${Date.now()}.png`);
  fs.writeFileSync(f, Buffer.from(buf)); return f;
});
ipcMain.handle('pick-wp', async (e, sec) => {
  if (denyUntrusted(e) || typeof sec !== 'string' || !/^[a-z0-9_-]{1,40}$/i.test(sec)) return 0;
  const r = await dialog.showOpenDialog(win, { filters: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'] }], properties: ['openFile', 'multiSelections'] });
  if (r.canceled) return 0;
  const dir = userFile('wallpapers', sec); fs.mkdirSync(dir, { recursive: true });
  r.filePaths.forEach(f => fs.copyFileSync(f, path.join(dir, path.basename(f))));
  return r.filePaths.length;
});
const keyFile = () => userFile('nova.key');
const getKey = () => { try { return safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(fs.readFileSync(keyFile())) : null; } catch { return null; } };
ipcMain.handle('key-set', (e, k) => { try { if (denyUntrusted(e) || typeof k !== 'string' || k.length > 2048) return false; if (!k) { fs.rmSync(keyFile(), { force: true }); return true; } if (!safeStorage.isEncryptionAvailable()) return false; atomicWrite(keyFile(), safeStorage.encryptString(k)); return true; } catch { return false; } });
ipcMain.handle('key-has', e => denyUntrusted(e) ? false : !!getKey());
let stateBackupAt = 0;
ipcMain.handle('state-save', (e, raw) => {
  if (denyUntrusted(e) || typeof raw !== 'string' || raw.length > 8 * 1024 * 1024) return false;
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return false;
    delete obj.key; // nunca guardar claves API en el backup de estado
    const f = userFile('state-backup.json'), bak = userFile('state-backup.json.bak');
    const data = JSON.stringify(obj);
    if (fs.existsSync(f) && Date.now() - stateBackupAt > 60 * 1000) { try { fs.copyFileSync(f, bak); stateBackupAt = Date.now(); } catch { } }
    atomicWrite(f, data);
    return true;
  } catch { return false; }
});
ipcMain.handle('state-load', e => {
  if (denyUntrusted(e)) return null;
  for (const f of [userFile('state-backup.json'), userFile('state-backup.json.bak')]) {
    try { const obj = JSON.parse(fs.readFileSync(f, 'utf8')); delete obj.key; return JSON.stringify(obj); } catch { }
  }
  return null;
});
ipcMain.handle('open-external', async (e, raw) => {
  if (denyUntrusted(e) || typeof raw !== 'string' || raw.length > 4096) return false;
  try { const u = new URL(raw); if (u.protocol !== 'https:') return false; await shell.openExternal(u.href); return true; } catch { return false; }
});
ipcMain.handle('update-check', async e => {
  if (denyUntrusted(e)) return { ok: false };
  try {
    const r = await fetch('https://api.github.com/repos/sdraiky99/NovaBrowser/releases/latest', { headers: { accept: 'application/vnd.github+json', 'user-agent': 'Nova/' + app.getVersion() }, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return { ok: false };
    const d = await r.json(), latest = String(d.tag_name || '').replace(/^v/, '');
    if (!latest) return { ok: false };
    const parse = v => v.split(/[^0-9]+/).slice(0, 3).map(x => Number(x) || 0).reduce((a, n, i) => a + n / 1000 ** (i + 1), 0);
    return { ok: true, current: app.getVersion(), latest, newer: parse(latest) > parse(app.getVersion()), url: /^https:\/\/github\.com\/sdraiky99\/NovaBrowser\/releases\/tag\/v?[0-9A-Za-z._-]+$/.test(String(d.html_url || '')) ? d.html_url : 'https://github.com/sdraiky99/NovaBrowser/releases' };
  } catch { return { ok: false }; }
});
/* ---------- Cuenta Nova: registro, inicio de sesión y sincronización ---------- */
ipcMain.handle('account-status', e => denyUntrusted(e) ? { loggedIn:false, id:'', username:'' } : accounts.status());
ipcMain.handle('account-register', async (e, data) => { if (denyUntrusted(e) || !data || typeof data !== 'object') return { ok:false, error:'Solicitud no válida.' }; return accounts.register(data.username, data.password); });
ipcMain.handle('account-login', async (e, data) => { if (denyUntrusted(e) || !data || typeof data !== 'object') return { ok:false, error:'Solicitud no válida.' }; return accounts.login(data.username, data.password); });
ipcMain.handle('account-logout', e => denyUntrusted(e) ? { ok:false, error:'Solicitud no válida.' } : accounts.logout());
ipcMain.handle('account-sync', async (e, data) => { if (denyUntrusted(e) || !data || typeof data !== 'object') return { ok:false, error:'Datos no válidos.' }; return accounts.sync(data); });

ipcMain.handle('migration-scan', e => { if (denyUntrusted(e)) return []; try { return migration.scan(); } catch { return []; } });
ipcMain.handle('migration-read', async (e, data) => {
  if (denyUntrusted(e) || !data || typeof data !== 'object' || typeof data.id !== 'string' || data.id.length > 64) return { error: 'Solicitud no válida.' };
  try { return await migration.read(data.id, { bookmarks: data.bookmarks !== false, history: data.history !== false }); } catch (err) { return { error: err.message || 'No se pudo leer el perfil.' }; }
});
ipcMain.handle('performance-info', async e => {
  if (denyUntrusted(e)) return { ok: false };
  try {
    const sys = process.getSystemMemoryInfo ? process.getSystemMemoryInfo() : {};
    const mainMem = process.memoryUsage();
    const appMetrics = typeof app.getAppMetrics === 'function' ? app.getAppMetrics() : [];
    const byPid = new Map(appMetrics.map(m => [m.pid, m]));
    const all = webContents.getAllWebContents().filter(w => w.getType() === 'webview' && !w.isDestroyed()).slice(0, 40);
    const tabs = await Promise.all(all.map(async w => {
      try {
        const m = await w.getProcessMemoryInfo();
        const pid = typeof w.getOSProcessId === 'function' ? w.getOSProcessId() : null;
        const metric = pid ? byPid.get(pid) : null;
        return {
          id: w.id,
          pid,
          url: String(w.getURL() || '').slice(0, 500),
          title: String(w.getTitle() || '').slice(0, 160),
          workingSetKB: Number(m.workingSetSize || m.residentSet || 0),
          privateKB: Number(m.private || 0),
          cpuPercent: Number(metric?.cpu?.percentCPUUsage || 0),
          throttling: typeof w.getBackgroundThrottling === 'function' ? w.getBackgroundThrottling() : true
        };
      } catch { return null; }
    }));
    const totalKB = Number(sys.total || 0), freeKB = Number(sys.free || 0);
    const mainMetric = byPid.get(process.pid);
    return {
      ok: true,
      generatedAt: Date.now(),
      main: {
        pid: process.pid,
        rssKB: Math.round(mainMem.rss / 1024),
        heapUsedKB: Math.round(mainMem.heapUsed / 1024),
        externalKB: Math.round(mainMem.external / 1024),
        cpuPercent: Number(mainMetric?.cpu?.percentCPUUsage || 0)
      },
      system: { totalKB, freeKB, availableKB: Number(sys.available || 0) },
      tabs: tabs.filter(Boolean)
    };
  } catch { return { ok: false }; }
});
ipcMain.handle('performance-mode', (e, enabled) => {
  if (denyUntrusted(e) || typeof enabled !== 'boolean') return false;
  for (const w of webContents.getAllWebContents()) {
    if (w.getType() !== 'webview' || w.isDestroyed()) continue;
    // Mantén el throttling normal de Electron siempre activado.
    try { w.setBackgroundThrottling(true); } catch { }
    try { w.setImageAnimationPolicy(enabled ? 'animateOnce' : 'animate'); } catch { }
  }
  prefs.performance = Object.assign(prefs.performance || {}, { memorySaver: enabled }); savePrefs();
  return true;
});
ipcMain.handle('performance-cache', async e => {
  if (denyUntrusted(e)) return false;
  try { await web().clearCache(); return true; } catch { return false; }
});
ipcMain.handle('security-state', e => {
  if (denyUntrusted(e)) return {};
  return { popupBlocked: true, insecureContentBlocked: true, webSecurity: true, webviewSandbox: true, webviewNodeIntegration: false, fileAccessFromFileUrls: false, universalAccessFromFileUrls: false, singleInstance: !!gotLock, adblock: blockOn !== false, csp: true };
});
ipcMain.handle('ai-ask', async (e, data) => {
  if (denyUntrusted(e) || !data || typeof data !== 'object') return { error: 'Solicitud no válida.' };
  const { msgs, system, model } = data;
  if (!Array.isArray(msgs) || msgs.length > 30 || typeof system !== 'string' || system.length > 50000 || (model !== undefined && typeof model !== 'string')) return { error: 'Solicitud no válida.' };
  if (msgs.some(m => !m || typeof m !== 'object' || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 20000)) return { error: 'Solicitud no válida.' };
  const post = async (url, headers, body) => { const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) }); if (!r.ok && r.status !== 400) throw new Error('HTTP ' + r.status); return r.json(); };
  try {
    const k = getKey();
    if (k) { const d = await post('https://api.anthropic.com/v1/messages', { 'x-api-key': k, 'anthropic-version': '2023-06-01' }, { model: model || 'claude-sonnet-4-6', max_tokens: 1500, system, messages: msgs }); if (d.error) return { error: d.error.message }; return { text: d.content.map(c => c.text || '').join(''), src: 'claude' }; }
    const d = await post('https://text.pollinations.ai/openai', {}, { model: 'openai', messages: [{ role: 'system', content: system }, ...msgs] });
    return { text: d.choices?.[0]?.message?.content || 'Sin respuesta.', src: 'free' };
  } catch (e) { return { error: e.message }; }
});
ipcMain.handle('clear-data', async (e, o) => {
  if (denyUntrusted(e) || !o || typeof o !== 'object') return false;
  const s = web(), st = []; if (o.cookies) st.push('cookies'); if (o.storage) st.push('localstorage', 'indexdb', 'serviceworkers', 'cachestorage', 'websql', 'filesystem');
  if (st.length) await s.clearStorageData({ storages: st }); if (o.cache) await s.clearCache(); return true;
});
ipcMain.handle('clear', async e => {
  if (denyUntrusted(e)) return false; await web().clearStorageData(); await web().clearCache(); return true; });
app.on('window-all-closed', () => app.quit());
