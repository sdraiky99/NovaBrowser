"use strict";
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'); const read=f=>fs.readFileSync(path.join(root,f),'utf8'); const exists=f=>fs.existsSync(path.join(root,f)); let failed=0;
const fail=x=>{console.error('QA FAIL:',x);failed++}; const ok=x=>console.log('QA OK:',x);
const pkg=JSON.parse(read('package.json')); if(pkg.version!=='4.4.1')fail(`version ${pkg.version}`);else ok('version 4.4.1');
const index=read('shell/index.html');
for(const m of ['<div id="tabs">','id="nt"','id="addr"','nova44.js','nova441.js','&sec='])if(!index.includes(m))fail(`index marker missing: ${m}`);else ok(`index marker: ${m}`);
const nt=read('shell/newtab.html'); for(const m of ['Noticias','Tecnología','Gaming','Dev','renderNovaNews','NOVA BRIEFING','Abrir noticia','Ctrl+T'])if(!nt.includes(m))fail(`newtab marker missing: ${m}`); else ok(`newtab marker: ${m}`);
const n441=read('shell/nova441.js'); for(const m of ['news-feed','baseNewTab441','guestTopic','#nt','Ctrl+T','N.newTab'])if(!n441.includes(m))fail(`nova441 marker missing: ${m}`); else ok(`nova441 marker: ${m}`);
const main=read('main.js'); if(!main.includes("ipcMain.handle('news-feed'"))fail('news-feed IPC missing'); else ok('news-feed IPC present');
if(!main.includes('feeds.arstechnica.com/arstechnica/index')||!main.includes('www.theguardian.com/technology/rss'))fail('news RSS sources missing');else ok('live RSS sources present');
if(!main.includes('<item\\b'))fail('RSS item parser missing');else ok('RSS parser present');
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js',...fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x),'scripts/qa-4.4.1.js']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)fail(`syntax ${f}: ${r.stderr||r.stdout}`)}ok('JavaScript syntax verified');
const invoked=new Set();for(const f of fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js'))){const s=read('shell/'+f);for(const m of s.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g))invoked.add(m[1]);}
const handled=new Set([...main.matchAll(/ipcMain\.handle\(\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));for(const ch of invoked)if(!handled.has(ch))fail(`unhandled IPC ${ch}`);else if(['news-feed','performance-info'].includes(ch))ok(`IPC handled: ${ch}`);
const releases=fs.readdirSync(root).filter(f=>/^RELEASE_NOTES_.*\.md$/i.test(f)); if(releases.length!==1||releases[0]!=='RELEASE_NOTES_4.4.1.md')fail(`release notes set: ${releases.join(', ')}`);else ok('only 4.4.1 release notes remain');
if(!read('package.json').includes('"shell/**"'))fail('shell inclusion missing'); else ok('electron-builder includes shell/**');
if(failed){console.error(`Nova 4.4.1 QA FAILED: ${failed}`);process.exit(1)} console.log('Nova 4.4.1 QA PASSED');
