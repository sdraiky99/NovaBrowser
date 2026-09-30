'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));
const fail = m => { console.error('CHECK FAIL:', m); process.exitCode = 1; };

const pkg = JSON.parse(read('package.json'));
if (pkg.version !== '2.2.0') fail(`version expected 2.2.0, got ${pkg.version}`);
for (const f of ['main.js','migration.js','account-service.js','account-config.json','account-server/server.js','shell/index.html','shell/extensions.js','shell/extras6.js','shell/extras7.js','shell/extras8.js','shell/extras9.js','build/installer.nsh','.github/workflows/build.yml','.github/workflows/security.yml']) if (!exists(f)) fail(`missing ${f}`);
for (const f of ['assets/welcome/welcome-hero.jpg','assets/welcome/welcome-performance.jpg','assets/welcome/welcome-security.jpg']) if (!exists(f)) fail(`missing welcome asset ${f}`);

const ext = read('shell/extensions.js');
const ids = [...ext.matchAll(/\{\s*id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate extension id');
if (ids.length < 34) fail(`expected at least 29 extensions, got ${ids.length}`);
for (const id of ['aviso-https','limpiar-tracking','media-ligero','enlaces-seguros','anti-ping','referer-estricto','enfoque','imagenes-ligeras','sin-pantallas-automaticas']) if (!ids.includes(id)) fail(`missing extension ${id}`);

if (pkg.dependencies?.['electron-updater'] !== '6.8.10') fail('electron-updater 6.8.10 missing');
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
if (!index.includes('extras8.js')) fail('extras6.js is not loaded');
if (!index.includes('memSave:false,bmbar:false')) fail('1.6.4 state defaults missing');

const ex4 = read('shell/extras4.js');
if (!ex4.includes('#bmb{display:none;position:fixed;left:0;right:0;bottom:0')) fail('bookmark bar is not fixed to bottom');

const ex6 = read('shell/extras6.js');
for (const x of ['nova164-welcome','nova://novedades','nova://marcadores','nova://migrar','nova://rendimiento','nova://seguridad','contextmenu','Abrir todos']) if (!ex6.includes(x)) fail(`1.6.4 feature missing: ${x}`);

const ex7 = read('shell/extras7.js');
for (const x of ['F12','profileStores','Account','@Nova.com','account-sync','nova-profile-button','NOVA_PROFILE_PARTITION','v200']) if (!ex7.includes(x)) fail(`1.6.5 feature missing: ${x}`);
const accountServer = read('account-server/server.js');
for (const x of ['scryptSync','mergeSync','/v1/register','/v1/login','/v1/sync']) if (!accountServer.includes(x)) fail(`account server missing: ${x}`);
const account = read('account-service.js');
if (!account.includes('safeStorage.encryptString')) fail('account token is not protected with safeStorage');
if (!account.includes('requiere HTTPS')) fail('account service HTTPS guard missing');
const inlineScripts = [...read('shell/index.html').matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
for (const code of inlineScripts) { try { new Function(code); } catch (e) { fail(`inline script syntax error: ${e.message}`); } }
const indexHtml = read('shell/index.html');
if (!indexHtml.includes("setAttribute('partition',profilePartition())")) fail('profile partition not wired to webviews');
if (!indexHtml.includes('extras7.js')) fail('extras7.js is not loaded');

const tabs = read('shell/tabs.js');
const bCount = (tabs.match(/c === 'shift\+b'/g) || []).length;
if (bCount !== 1) fail(`expected one Ctrl+Shift+B handler, got ${bCount}`);

const ex8 = read('shell/extras8.js','shell/extras9.js');
for (const x of ['Nova Study','workspaces','readerToggle','Accesibilidad','Rendimiento','Bienvenido a Nova 2.0.0','Gran actualización']) if (!ex8.includes(x)) fail(`2.0 feature missing: ${x}`);
if (!read('build/installer.nsh').includes('Nova 2.2.0')) fail('installer branding is not 2.2.0');
if (!exists('RELEASE_NOTES_2.0.0.md')) fail('2.0.0 release notes missing');
if (!exists('RELEASE_NOTES_2.1.0.md')) fail('2.1.0 release notes missing');

const ex9 = read('shell/extras9.js');
for (const x of ['Nova 2.1','Nova Tab','PG.study','PG.pestanas','PG.memoria','PG.media','PG.pdf','PG.perfiles','PG.sync','PG.extensiones','Nova Turbo 2.1','Tutor','Examen']) if (!ex9.includes(x)) fail(`2.1 feature missing: ${x}`);
if (!read('shell/index.html').includes('extras9.js')) fail('extras9.js is not loaded');
if (process.exitCode) process.exit(1);
console.log(`Nova 2.2.0 core checks OK · ${ids.length} extensions`);

const ex10 = read('shell/extras10.js');
for (const x of ['Nova 2.2.0','Nova 2.2','nova22-top-tools','Vista dividida','nova22-webctx','Perfiles','Zoom','Buscar actualizaciones','default-browser']) if (!ex10.includes(x)) fail(`2.2 feature missing: ${x}`);
if (!main.includes('electron-updater')) fail('electron-updater integration missing');
if (!main.includes("c.setZoomFactor(next)")) fail('real webview zoom handler missing');
if (!main.includes("setZoomMode?.('isolated')")) fail('isolated zoom mode missing');
if (!main.includes("win.webContents.send('zoom-changed'")) fail('zoom state event missing');
if (!index.includes('nova22-top-tools')) fail('top tools host missing');
if (!index.includes('nova22-split')) fail('split host missing');
if (!exists('RELEASE_NOTES_2.2.0.md')) fail('2.2.0 release notes missing');
console.log(`Nova 2.2.0 static check OK · ${ids.length} extensions · top toolbar/split/context menu/profiles/zoom/updater present`);
