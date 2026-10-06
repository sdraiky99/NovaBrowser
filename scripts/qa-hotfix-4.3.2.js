'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));
let failed = 0;
const fail = msg => { console.error('QA FAIL:', msg); failed++; };
const ok = msg => console.log('QA OK:', msg);

const pkg = JSON.parse(read('package.json'));
if (pkg.version !== '4.3.2') fail(`package version ${pkg.version}`); else ok('package version 4.3.2');

const index = read('shell/index.html');
for (const marker of [
  '<div id="app">', '<div id="top">', '<div id="tabs">', '<div id="bar">', '<input id="addr"',
  '<div id="side">', '<div id="view">', '<div id="panel">', "const S=Object.assign({theme:'air'", "function newTab(u){"
]) if (!index.includes(marker)) fail(`index marker missing: ${marker}`);
else ok('main index structure present');

if (!index.includes('<script src="nova432.js"></script>')) fail('nova432.js not loaded');
if (index.includes('ui.css') || index.includes('preload.js')) fail('hotfix unexpectedly rewrote the main shell');
const originalIndex = fs.readFileSync('/mnt/data/orig41/shell/index.html','utf8');
const normalizedIndex = index.replace('<script src="nova432.js"></script>','');
if (normalizedIndex !== originalIndex) fail('main index differs from the stable base beyond the hotfix script'); else ok('main index preserved exactly; only nova432.js was added');

const scriptRefs = [...index.matchAll(/<script\s+src=["']([^"']+)["']/gi)].map(m => m[1]);
for (const ref of scriptRefs) if (!exists(path.join('shell', ref))) fail(`active script missing: ${ref}`);
ok(`active shell scripts verified: ${scriptRefs.length}`);

const hotfix = read('shell/nova432.js');
for (const marker of [
  'nova432-glass', 'pinSite', 'pinnedSites', 'page-favicon-updated', 'performance-mode', 'NovaUIAudit432', 'PG.ajustes'
]) if (!hotfix.includes(marker)) fail(`hotfix feature missing: ${marker}`);
else ok('hotfix feature markers present');

const main = read('main.js');
if (!main.includes("shell/index.html")) fail('main no longer loads shell/index.html');
if (!main.includes("webPreferences: { nodeIntegration: true, contextIsolation: false")) fail('4.1 renderer base was unexpectedly replaced');
if (!main.includes("ipcMain.handle('performance-mode'")) fail('performance IPC missing');

const build = read('package.json');
if (!build.includes('"shell/**"')) fail('electron-builder no longer includes shell/**'); else ok('packaging includes shell/**');
if (!build.includes('"deleteAppDataOnUninstall": false')) fail('installer would delete user app data'); else ok('installer preserves user app data');
if (exists('COPIA-build.yml')) fail('obsolete backup workflow remains: COPIA-build.yml'); else ok('obsolete backup workflow removed');

const forbiddenFiles = fs.readdirSync(root).filter(f => /^RELEASE_NOTES_.*\.md$/i.test(f) && f !== 'RELEASE_NOTES_4.3.2.md');
if (forbiddenFiles.length) fail(`old release notes remain: ${forbiddenFiles.join(', ')}`); else ok('only new release notes remain');

const activeShellJs = fs.readdirSync(path.join(root,'shell')).filter(f => f.endsWith('.js'));
for (const f of activeShellJs) {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['--check', path.join('shell', f)], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) fail(`syntax: shell/${f}`);
}
const rMain = require('child_process').spawnSync(process.execPath, ['--check','main.js'], {cwd:root,encoding:'utf8'});
if (rMain.status !== 0) fail('syntax: main.js'); else ok('JavaScript syntax verified');

if (failed) { console.error(`Nova 4.3.2 hotfix QA failed: ${failed}`); process.exit(1); }
console.log('Nova 4.3.2 hotfix QA PASSED');
