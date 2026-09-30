'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));
const fail = m => { console.error('CHECK FAIL:', m); process.exitCode = 1; };

const pkg = JSON.parse(read('package.json'));
if (pkg.version !== '1.6.4') fail(`version expected 1.6.4, got ${pkg.version}`);
for (const f of ['main.js','migration.js','shell/index.html','shell/extensions.js','shell/extras6.js','build/installer.nsh','.github/workflows/build.yml','.github/workflows/security.yml']) if (!exists(f)) fail(`missing ${f}`);
for (const f of ['assets/welcome/welcome-hero.jpg','assets/welcome/welcome-performance.jpg','assets/welcome/welcome-security.jpg']) if (!exists(f)) fail(`missing welcome asset ${f}`);

const ext = read('shell/extensions.js');
const ids = [...ext.matchAll(/\{\s*id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate extension id');
if (ids.length < 29) fail(`expected at least 29 extensions, got ${ids.length}`);
for (const id of ['aviso-https','limpiar-tracking','media-ligero','enlaces-seguros']) if (!ids.includes(id)) fail(`missing extension ${id}`);

const main = read('main.js');
if (!main.includes("fromPrebuiltAdsAndTracking(fetcher")) fail('Ghostery prebuilt loader is not using the current API/fetcher');
if (main.includes('fromPrebuiltAdsAndTrackingLists')) fail('obsolete Ghostery prebuilt loader API is still present');
if (!main.includes("require('cross-fetch')")) fail('cross-fetch missing from adblock loader');
if (!main.includes('wp.sandbox = true') || !main.includes('wp.contextIsolation = true') || !main.includes('wp.nodeIntegration = false')) fail('webview hardening missing');
if (!main.includes("allowRunningInsecureContent = false")) fail('insecure content protection missing');
if (!main.includes("ipcMain.handle('performance-info'")) fail('performance telemetry handler missing');
if (!main.includes("ipcMain.handle('security-state'")) fail('security diagnostics handler missing');

const index = read('shell/index.html');
if (index.includes('allowpopups')) fail('allowpopups is still present in the UI');
if (!index.includes('extras6.js')) fail('extras6.js is not loaded');
if (!index.includes('memSave:false,bmbar:false')) fail('1.6.4 state defaults missing');

const ex4 = read('shell/extras4.js');
if (!ex4.includes('#bmb{display:none;position:fixed;left:0;right:0;bottom:0')) fail('bookmark bar is not fixed to bottom');

const ex6 = read('shell/extras6.js');
for (const x of ['nova164-welcome','nova://novedades','nova://marcadores','nova://migrar','nova://rendimiento','nova://seguridad','contextmenu','Abrir todos']) if (!ex6.includes(x)) fail(`1.6.4 feature missing: ${x}`);

const tabs = read('shell/tabs.js');
const bCount = (tabs.match(/c === 'shift\+b'/g) || []).length;
if (bCount !== 1) fail(`expected one Ctrl+Shift+B handler, got ${bCount}`);

if (process.exitCode) process.exit(1);
console.log(`Nova 1.6.4 static check OK · ${ids.length} extensions · required security/features present`);
