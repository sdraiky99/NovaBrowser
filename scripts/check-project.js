'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));
let failed = 0;
const fail = msg => { console.error('CHECK FAIL:', msg); failed++; };
const warn = msg => console.warn('CHECK WARN:', msg);

let pkg;
try { pkg = JSON.parse(read('package.json')); } catch (e) { fail('package.json is not valid JSON'); process.exit(1); }
if (pkg.version !== '4.5.1') fail(`version expected 4.5.1, got ${pkg.version}`);

const required = [
  'main.js','migration.js','account-service.js','account-config.json','account-server/server.js',
  'shell/index.html','shell/newtab.html','shell/extensions.js','shell/supercat.js','shell/nova25.js','shell/hotfix254.js','shell/nova30.js',
  'shell/extras.js','shell/extras2.js','shell/nova432.js','shell/nova44.js','shell/extras3.js','shell/extras4.js','shell/extras5.js','shell/extras6.js','shell/extras7.js','shell/extras8.js','shell/extras9.js','shell/extras10.js','shell/extras11.js','shell/extras12.js','shell/nova31.js','shell/nova40.js','shell/nova41.js','shell/nova45.js',
  'scripts/qa-4.4.1.js','scripts/qa-4.5.0.js','scripts/qa-vm-3.0.1.js','scripts/qa-vm-3.1.js','scripts/qa-vm-4.0.js','build/installer.nsh','.github/workflows/build.yml','.github/workflows/release.yml','.github/workflows/security.yml',
  'assets/release/2.5/safari.svg','assets/release/2.5/islands.svg','assets/release/2.5/glance.svg','assets/release/2.5/focus.svg',
  'assets/release/2.5/writer.svg','assets/release/2.5/docs.svg','assets/release/2.5/study.svg','assets/release/2.5/improvements.svg',
  'TUTORIAL-NOVA-3.0.0.md','VERIFICATION-3.0.1.md'
];
for (const f of required) if (!exists(f)) fail(`missing ${f}`);

const index = read('shell/index.html');
const scripts = [...index.matchAll(/<script\s+src=["']([^"']+)["']/gi)].map(m => m[1]);
const activeScripts = scripts.map(x => x.replace(/^\.\//,''));
for (const s of activeScripts) if (!exists(path.posix.normalize(path.posix.join('shell', s)))) fail(`active script missing: ${s}`);
if (activeScripts.includes('tabs.js')) fail('tabs.js is legacy and must not be loaded by the active shell');
if (!activeScripts.includes('extras9.js') || !activeScripts.includes('nova30.js')) fail('active shell script chain is incomplete');
if (index.includes('allowpopups')) fail('allowpopups is still enabled');
if (!index.includes('newTabLinks') || !index.includes('TAB_ADD')) fail('link/new-tab behavior is missing');

const main = read('main.js');
for (const x of [
  "ipcMain.handle('ai-ask'", "ipcMain.handle('performance-info'", "ipcMain.handle('security-state'",
  "ipcMain.handle('save-shot'", "ipcMain.handle('save-docx'", "ipcMain.handle('save-text'",
  "ipcMain.handle('open-downloads-folder'", "ipcMain.handle('launch-web-app'", "ipcMain.handle('show-in-folder'"
]) if (!main.includes(x)) fail(`missing IPC handler: ${x}`);
if (!main.includes('allowRunningInsecureContent = false')) fail('insecure-content protection missing');
if (!main.includes('fromPrebuiltAdsAndTracking(fetcher')) fail('Ghostery prebuilt loader API/fetcher missing');
if (main.includes('fromPrebuiltAdsAndTrackingLists')) fail('obsolete Ghostery API still present');
if (!main.includes('wp.sandbox = true') || !main.includes('wp.contextIsolation = true') || !main.includes('wp.nodeIntegration = false')) fail('webview hardening missing');

const hotfix = read('shell/hotfix254.js');
for (const x of ['N.openFeature','N.aiSend','N.aiAct','N.askSel','N.newNote','N.__hotfix254Ready']) if (!hotfix.includes(x)) fail(`hotfix bridge missing: ${x}`);
if (hotfix.includes("const vm = require('vm')") || hotfix.includes("const fs = require('fs')")) fail('hotfix254.js was overwritten by the QA harness');

const ex4 = read('shell/extras4.js');
for (const x of ['N.dlg','N.ctx','N.renderGroups','N.saveSession','N.activeWebTab']) if (!ex4.includes(x)) fail(`cross-module export missing: ${x}`);
for (const x of ['NOVA.newTab','NOVA.closeTab','NOVA.askAI','NOVA.openAI']) if (!ex4.includes(x)) fail(`public browser/AI export missing: ${x}`);

const nx = read('shell/nova30.js');
for (const x of ['N.PG.safari','N.PG.islands','N.PG.workspaces','N.PG.glance','N.PG.focus','N.PG.reader','N.PG.collections','N.PG.reading','N.PG.writer','N.PG.docs','N.PG.study3','N.PG.privacidad2','N.PG.rendimiento2','N.PG.descargas2','N.PG.apps','N.PG.panels','N.PG.media','N.PG.pestanas','N.PG.sesiones','N.PG.qr','N.PG.backup','N.PG.shortcuts','N.PG.send','N.PG.pip','verticalTabs','customShortcuts']) if (!nx.includes(x)) fail(`Nova 3 feature missing: ${x}`);

const ext = read('shell/extensions.js');
const ids = [...ext.matchAll(/\{\s*id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate extension id');
if (ids.length < 34) fail(`too few extensions: ${ids.length}`);

const invoked = new Set();
for (const f of fs.readdirSync(path.join(root,'shell')).filter(x => x.endsWith('.js'))) {
  const s = read('shell/' + f);
  for (const m of s.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g)) invoked.add(m[1]);
}
for (const m of index.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g)) invoked.add(m[1]);
const handled = new Set([...main.matchAll(/ipcMain\.handle\(\s*['"]([^'"]+)['"]/g)].map(m => m[1]));
for (const ch of invoked) if (!handled.has(ch)) fail(`renderer invokes unhandled IPC: ${ch}`);

for (const f of ['main.js','migration.js','account-service.js','account-server/server.js', ...fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x)]) {
  const r = spawnSync(process.execPath, ['--check', f], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) fail(`syntax error: ${f}\n${r.stderr || r.stdout}`);
}

const n41=read('shell/nova41.js');
for (const x of ['N.PG.gaming41','N.PG.gamingprofile41','N.PG.extensions41','N.PG.privacy41','N.PG.sync41','N.PG.translate41','N.PG.devtools41']) if (!n41.includes(x)) fail(`Nova 4.1 feature missing: ${x}`);
if (!index.includes('nova41.js')) fail('Nova 4.1 script is not loaded');
if (index.includes('Nova 2.2') || index.includes('Nova 2.3') || index.includes('Nova 2.4')) warn('legacy version strings remain in shell/index.html; review before release');
if (!exists('package-lock.json') && !exists('npm-shrinkwrap.json') && !exists('yarn.lock') && !exists('pnpm-lock.yaml')) warn('no package lockfile is committed');
if (!pkg.engines?.node || !pkg.engines.node.includes('22.12.0')) warn('Node engine is not pinned to Electron-compatible baseline >=22.12.0');
if (main.includes('contextIsolation: false') && main.includes('nodeIntegration: true')) warn('main renderer still uses Node integration; migrate to preload/contextBridge for production hardening');

if (failed) { console.error(`Nova 4.5.0 project checks failed: ${failed}`); process.exit(1); }
console.log(`Nova 4.5.1 project checks OK · ${ids.length} extensions · ${invoked.size} IPC invoke channels verified`);
