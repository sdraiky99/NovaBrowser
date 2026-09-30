const { app, BrowserWindow, ipcMain, session, dialog, Menu, clipboard, safeStorage, shell, webContents, nativeImage } = require('electron');
const path = require('path'), fs = require('fs'), { execFile } = require('child_process');
const APP_ID = 'com.nova.browser';
app.setName('Nova');
app.setAppUserModelId(APP_ID); // imprescindible en Windows: agrupa la ventana con el acceso directo y permite cambiar el icono de la barra de tareas
// rendimiento: rasterizado por GPU y sin el cálculo de oclusión de Windows (evita tirones al volver a la ventana)
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
let win, splash, splashAt = 0, pendingUrl = null;
const EXT = require('./shell/extensions.js');
const LOGOS = ['classic', 'orbita', 'estrella', 'cometa', 'minimal'], SPLASH_MS = 1800;
const logoId = id => (LOGOS.includes(id) ? id : 'classic');
const logoIco = id => path.join(__dirname, `assets/logos/${logoId(id)}.ico`);      // dentro del paquete (asar)
const logoImg = id => { const i = nativeImage.createFromPath(process.platform === 'win32' ? logoIco(id) : path.join(__dirname, `assets/logos/${logoId(id)}.png`)); return i.isEmpty() ? nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png')) : i; };
// preferencias que el proceso principal necesita antes de abrir la interfaz (logo, animación de inicio, extensiones)
let prefs = { logo: 'classic', splash: true, ext: {}, reg: '' };
const prefsFile = () => path.join(app.getPath('userData'), 'prefs.json');
const loadPrefs = () => { try { prefs = Object.assign(prefs, JSON.parse(fs.readFileSync(prefsFile(), 'utf8'))); } catch { } };
const savePrefs = () => { try { fs.writeFileSync(prefsFile(), JSON.stringify(prefs)); } catch { } };
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
const applyExt = (wc, ids) => { if (wc.isDestroyed()) return; (ids || Object.keys(prefs.ext).filter(k => prefs.ext[k])).forEach(id => wc.executeJavaScript(EXT.on(id)).catch(() => { })); };
const web = () => session.fromPartition('persist:web'); // datos de navegación aislados de la interfaz de Nova

const userFile = (...p) => path.join(app.getPath('userData'), ...p);

let blockerP = null, blockOn = null;
async function setAdblock(on) {
  on = !!on; if (blockOn === on) return; blockOn = on; // applyTheme lo llama muchas veces: solo actuamos si cambia
  try {
    if (!blockerP) blockerP = (async () => {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      // las listas se guardan en disco: el arranque no espera a la red y funciona sin conexión
      const cache = { path: userFile('adblock.bin'), read: fs.promises.readFile, write: fs.promises.writeFile };
      const b = await ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch, cache).catch(() => ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch)); // si falla la caché, carga normal
      let bt = 0, n = 0;
      b.on('request-blocked', () => { n++; if (!bt) bt = setTimeout(() => { bt = 0; win && !win.isDestroyed() && win.webContents.send('blocked', n); }, 600); });
      return b;
    })();
    const b = await blockerP; if (blockOn !== on) return;
    const ses = web();
    on ? b.enableBlockingInSession(ses) : b.disableBlockingInSession(ses);
  } catch (e) { blockerP = null; blockOn = null; console.error('Adblock:', e.message); }
}


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

function createMain() {
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 720, minHeight: 480,
    frame: false, show: false, title: 'Nova',
    icon: logoImg(prefs.logo),
    backgroundColor: '#0d0b1a',
    webPreferences: { nodeIntegration: true, contextIsolation: false, webviewTag: true }
  });
  win.loadFile('shell/index.html');
  win.once('ready-to-show', () => {
    const go = () => { if (splash && !splash.isDestroyed()) splash.close(); win.show(); };
    setTimeout(go, splash ? Math.max(0, splashAt + SPLASH_MS - Date.now()) : 0); // deja ver la animación de inicio
  });
  win.webContents.once('did-finish-load', () => { if (pendingUrl) setTimeout(() => win && win.webContents.send('open-tab', pendingUrl), 900); });
  win.on('page-title-updated', e => e.preventDefault());
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
    c.on('dom-ready', () => applyExt(c));
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
ipcMain.on('prefs-get', e => (e.returnValue = prefs));
ipcMain.on('prefs-set', (_, p) => {
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
ipcMain.handle('default-browser', async (_, set) => {
  const portable = !!process.env.PORTABLE_EXECUTABLE_FILE;
  if (process.platform !== 'win32') { if (set) { app.setAsDefaultProtocolClient('http'); app.setAsDefaultProtocolClient('https'); } return { portable, isDefault: app.isDefaultProtocolClient('https') }; }
  if (portable) return { portable, isDefault: false };
  if (set) {
    await registerBrowser(true); // asegura que Nova figura en "Aplicaciones predeterminadas"
    shell.openExternal('ms-settings:defaultapps?registeredAppUser=Nova').catch(() => shell.openExternal('ms-settings:defaultapps'));
  }
  return { portable, isDefault: await isWinDefault() };
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
