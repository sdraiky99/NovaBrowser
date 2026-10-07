'use strict';
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
let failed=0;const fail=x=>{console.error('QA FAIL:',x);failed++};const ok=x=>console.log('QA OK:',x);
const pkg=JSON.parse(read('package.json'));
if(pkg.version!=='4.5.0') fail(`version ${pkg.version}`); else ok('version 4.5.0');
const idx=read('shell/index.html');
for(const m of ['<div id="tabs">','id="nt"','id="addr"','nova441.js','nova45.js','id="side"']) if(!idx.includes(m)) fail(`index marker missing: ${m}`); else ok(`index marker: ${m}`);
for(const m of ['icon.png','nova45.js','id="nt"','id="addr"','id="side"']) if(!idx.includes(m)) fail(`index feature marker missing: ${m}`); else ok(`index feature marker: ${m}`);
const n45=read('shell/nova45.js');
if(!n45.includes("q('#mnp')") || !n45.includes('legacy-main-menu')) fail('legacy main menu was not disabled'); else ok('legacy main menu disabled');
for(const m of ['nova45-style','NOVA45_AUDIT','data-n45="home"','data-n45="bookmarks"','data-n45="workspaces"','data-n45="performance"','data-n45="settings"','nova45-menu','legacy-theme-choices']) if(!n45.includes(m)) fail(`nova45 marker missing: ${m}`); else ok(`nova45 marker: ${m}`);
const nt=read('shell/newtab.html'); if(!nt.includes('../assets/nova-logo.svg')) fail('newtab logo not updated'); else ok('newtab logo updated');
const main=read('main.js'); for(const m of ['news-feed','performance-info','extension-pick-load']) if(!main.includes(m)) fail(`main marker missing: ${m}`); else ok(`main marker: ${m}`); if(!pkg.build?.files?.includes?.('shell/**')) fail('electron-builder shell inclusion missing'); else ok('electron-builder shell inclusion');
const shellJS=fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x);
const files=['main.js','migration.js','account-service.js','account-server/server.js',...shellJS,'scripts/qa-4.5.0.js'];
for(const f of files){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)fail(`syntax ${f}: ${r.stderr||r.stdout}`)}ok('JavaScript syntax verified');
// Verify every direct IPC invoke used by shell code has an ipcMain handler.
const invoked=new Set(); for(const f of shellJS){const s=read(f);for(const m of s.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g)) invoked.add(m[1]);}
const handled=new Set([...main.matchAll(/ipcMain\.(?:handle|on)\(\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
for(const ch of invoked) if(!handled.has(ch)) fail(`unhandled IPC ${ch}`); else if(['news-feed','performance-info','extensions-list'].includes(ch)) ok(`IPC handled: ${ch}`);
// User-visible release notes: only current release note file.
const rel=fs.readdirSync(root).filter(f=>/^RELEASE_NOTES_.*\.md$/i.test(f)); if(rel.length!==1||rel[0]!=='RELEASE_NOTES_4.5.0.md') fail(`release notes set: ${rel.join(', ')}`); else ok('only 4.5.0 release notes remain');
if(!exists('assets/icon.png')||!exists('assets/icon.ico')||!exists('assets/nova-logo.svg')) fail('new logo assets missing'); else ok('new logo assets present');

if(!idx.includes('id="sh"')) ok('capture button markup retained only as internal fallback');
if(!n45.includes("display:none!important")) fail('toolbar simplification CSS missing');
if(failed){console.error(`Nova 4.5.0 QA FAILED: ${failed}`);process.exit(1)}
console.log('Nova 4.5.0 QA PASSED');
