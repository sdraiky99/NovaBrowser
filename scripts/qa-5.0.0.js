"use strict";
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'); const read=f=>fs.readFileSync(path.join(root,f),'utf8'); const exists=f=>fs.existsSync(path.join(root,f)); let failed=0;
const fail=x=>{console.error('QA FAIL:',x);failed++}; const ok=x=>console.log('QA OK:',x);
let pkg; try{pkg=JSON.parse(read('package.json'))}catch{fail('package.json invalid');process.exit(1)}
if(pkg.version!=='5.0.0')fail('version '+pkg.version);else ok('version 5.0.0');
if(pkg.engines?.node!==' >=22.12.0'.trim())fail('Node engine must be >=22.12.0');else ok('Node engine >=22.12.0');
if(read('.nvmrc').trim()!=='22.12.0')fail('nvmrc must pin Node 22.12.0');else ok('nvmrc pins Node 22.12.0');
const index=read('shell/index.html'); for(const m of ['<div id="tabs">','id="nt"','id="addr"','quantum.css','nova50.js'])if(!index.includes(m))fail('index missing '+m);else ok('index '+m);
if(index.includes('allowpopups'))fail('allowpopups enabled');
const q=read('shell/nova50.js'); for(const m of ['quantum-prime','quantumsettings','data-qaction="new"','data-qaction="workspaces"','data-qaction="performance"','data-qtheme="system"','q-menu-btn'])if(!q.includes(m))fail('Quantum marker missing '+m);else ok('Quantum marker '+m);
for(const f of ['shell/quantum.css','shell/quantum-newtab.css','assets/logo/nova-quantum.svg','assets/logo/nova-quantum-wordmark.svg','assets/logo/nova-quantum-mono.svg'])if(!exists(f))fail('missing '+f); else ok('asset '+f);
const nt=read('shell/newtab.html'); for(const m of ['quantum-newtab.css','nova-quantum.svg','Noticias','renderNovaNews','NOVA BRIEFING'])if(!nt.includes(m))fail('newtab marker missing '+m); else ok('newtab '+m);
const inst=read('build/installer.nsh'); if(!inst.includes('Nova Browser 5.0.0'))fail('installer branding is stale');else ok('installer branding 5.0.0');
const splash=read('shell/splash.html'); for(const m of ['nova-quantum.svg','QUANTUM PRIME'])if(!splash.includes(m))fail('splash marker missing '+m); else ok('splash '+m);
const main=read('main.js'); if(!main.includes("const LOGOS = ['quantum']"))fail('Prime logo enforcement missing');else ok('Prime logo enforced'); if(!main.includes("prefs.logo = 'quantum'"))fail('pref normalization missing');else ok('logo preference normalization');
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js',...fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x),'scripts/qa-5.0.0.js','scripts/check-build-assets.js']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)fail(`syntax ${f}: ${r.stderr||r.stdout}`)}ok('JavaScript syntax verified');
const invoked=new Set();for(const f of fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js'))){const s=read('shell/'+f);for(const m of s.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g))invoked.add(m[1]);}
const handled=new Set([...main.matchAll(/ipcMain\.handle\(\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));for(const ch of invoked)if(!handled.has(ch))fail(`unhandled IPC ${ch}`);ok(`${invoked.size} IPC invoke channels checked`);
const releases=fs.readdirSync(root).filter(f=>/^RELEASE_NOTES_.*\.md$/i.test(f)); if(releases.length!==1||releases[0]!=='RELEASE_NOTES_5.0.0.md')fail(`release notes set: ${releases.join(', ')}`);else ok('only 5.0.0 release notes remain');
if(!pkg.build?.files?.includes('shell/**'))fail('electron-builder shell/** missing');else ok('electron-builder includes shell/**');
const ico=fs.readFileSync(path.join(root,'assets/icon.ico')); if(ico.length<500)fail('icon.ico looks too small');else ok('Windows icon present');
if(failed){console.error(`Nova 5.0.0 QA FAILED: ${failed}`);process.exit(1)} console.log('Nova 5.0.0 Quantum Prime QA PASSED');
