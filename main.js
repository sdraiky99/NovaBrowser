const { app, BrowserWindow, ipcMain, session, dialog } = require('electron');
const path = require('path'), fs = require('fs');
app.setName('Nova');
let win, splash, blocker;

const userFile = (...p) => path.join(app.getPath('userData'), ...p);

async function setAdblock(on) {
  try {
    if (!blocker) {
      const { ElectronBlocker } = require('@ghostery/adblocker-electron');
      blocker = await ElectronBlocker.fromPrebuiltAdsAndTrackingLists(fetch);
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

  app.on('web-contents-created', (_, c) => {
    if (c.getType() !== 'webview') return;
    c.setWindowOpenHandler(({ url }) => { win.webContents.send('open-tab', url); return { action: 'deny' }; });
    c.on('before-input-event', (e, i) => {
      if (i.control && i.type === 'keyDown' && 'twlfd'.includes(i.key)) {
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
app.on('window-all-closed', () => app.quit());
