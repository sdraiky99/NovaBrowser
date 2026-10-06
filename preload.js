"use strict";
const { contextBridge, ipcRenderer, shell, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const extensions = require(path.join(__dirname, 'shell', 'extensions.js'));

const on = (channel, callback) => {
  const listener = (_event, data) => callback({ channel }, data);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};

const readDir = dir => {
  const resolved = path.resolve(String(dir || ''));
  const appRoot = path.resolve(__dirname);
  const userData = path.resolve(ipcRenderer.sendSync('userdata'));
  const allowed = resolved === appRoot || resolved.startsWith(appRoot + path.sep) || resolved === userData || resolved.startsWith(userData + path.sep);
  if (!allowed) throw new Error('Ruta no permitida');
  return fs.readdirSync(resolved);
};

contextBridge.exposeInMainWorld('NOVA_BRIDGE', Object.freeze({
  ipc: Object.freeze({
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    sendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on,
  }),
  shell: Object.freeze({
    openExternal: url => shell.openExternal(String(url)),
    openPath: p => shell.openPath(String(p)),
    showItemInFolder: p => shell.showItemInFolder(String(p)),
  }),
  clipboard: Object.freeze({
    writeText: text => clipboard.writeText(String(text)),
    writeImage: data => clipboard.writeImage(nativeImage.createFromBuffer(Buffer.from(data))),
  }),
  fs: Object.freeze({
    readDir,
  }),
  path: Object.freeze({
    join: (...parts) => path.join(...parts),
    extname: value => path.extname(String(value)),
    basename: value => path.basename(String(value)),
  }),
  url: Object.freeze({ pathToFileURL: value => pathToFileURL(String(value)).href }),
  os: Object.freeze({ homedir: () => os.homedir() }),
  versions: Object.freeze({ chrome: process.versions.chrome, electron: process.versions.electron, node: process.versions.node }),
  appRoot: __dirname,
  extensions,
}));
