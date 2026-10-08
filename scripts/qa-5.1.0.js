"use strict";
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'); const read=f=>fs.readFileSync(path.join(root,f),'utf8'); const exists=f=>fs.existsSync(path.join(root,f)); let failed=0, warnings=0;
const fail=x=>{console.error('QA FAIL:',x);failed++}; const ok=x=>console.log('QA OK:',x); const warn=x=>{console.warn('QA WARN:',x);warnings++};
let pkg; try{pkg=JSON.parse(read('package.json'))}catch{fail('package.json inválido');process.exit(1)}
if(pkg.version!=='5.1.0')fail('version '+pkg.version);else ok('version 5.1.0');
if(pkg.engines?.node!==' >=22.12.0'.trim())fail('Node engine incorrecto');else ok('Node >=22.12.0');
if(read('.nvmrc').trim()!=='22.12.0')fail('.nvmrc incorrecto');else ok('Node 22.12.0 fijado');
if(!exists('shell/nova51.js'))fail('nova51.js faltante');else ok('nova51 layer');
const index=read('shell/index.html');
for(const m of ['quantum-base.css','quantum.css','nova50.js','nova51.js','id="tabs"','id="nt"','id="addr"']) if(!index.includes(m))fail('index missing '+m); else ok('index '+m);
if(index.includes('themes.css'))fail('themes.css sigue referenciado');
if(index.includes('Windows 95')||index.includes('Undertale')||index.includes('Cyberpunk'))fail('legacy theme text still present in active index');
const q=read('shell/nova51.js');
for(const m of ['nova51-diagnostics','nova51-restore-backup','quantumsettings','updates51','backup51','diagnostics51','reader51','actions51','q51-palette','Ctrl+K']) if(!q.includes(m)) fail('Nova 5.1 marker missing '+m); else ok('Nova 5.1 '+m);
if(exists('shell/themes.css'))fail('themes.css debe estar eliminado'); else ok('temas.css eliminado');
if(exists('assets/logos'))fail('assets/logos debe estar eliminado'); else ok('logos antiguos eliminados');
for(const f of ['assets/icon.png','assets/icon.ico','assets/logo/nova-quantum.svg','assets/logo/nova-quantum-wordmark.svg','assets/logo/nova-quantum-mono.svg','shell/quantum-base.css']) if(!exists(f))fail('missing '+f); else ok('asset '+f);
const main=read('main.js');
for(const m of ["const LOGOS = ['quantum']","const logoIco = id => path.join(__dirname, 'assets/icon.ico')","ipcMain.handle('nova51-diagnostics'","ipcMain.handle('nova51-restore-backup'","ipcMain.handle('nova51-export-state'"]) if(!main.includes(m))fail('main marker missing '+m); else ok('main '+m);
const oldLogosRefs=(main.match(/assets\/logos/g)||[]).length; if(oldLogosRefs) fail('main referencia assets/logos');
const ex5=read('shell/extras5.js'); if(ex5.includes('assets/logos/'))fail('extras5 still references legacy logos');
const ex12=read('shell/extras12.js'); if(ex12.includes('cyberpunk'))warn('extras12 is a disabled stub only');
const rel=fs.readdirSync(root).filter(f=>/^RELEASE_NOTES_.*\.md$/i.test(f)); if(rel.length!==1||rel[0]!=='RELEASE_NOTES_5.1.0.md')fail('release notes root invalid: '+rel.join(', '));else ok('solo release notes 5.1.0 en root');
for(const f of ['docs/history/3.0.0.md','docs/history/3.1.0.md']) if(!exists(f))fail('missing current history '+f); else ok('history '+f);
if(!pkg.build?.files?.includes('shell/**')||!pkg.build?.files?.includes('assets/**'))fail('electron-builder inclusiones incompletas');else ok('electron-builder files');
if(!pkg.build?.win?.icon?.includes('assets/icon.ico'))fail('Windows icon incorrecto');else ok('Windows icon path');
const scripts=[...index.matchAll(/<script\s+src=["']([^"']+)["']/gi)].map(m=>m[1]); for(const s of scripts){const f=path.normalize(path.join(root,'shell',s));if(!fs.existsSync(f))fail('active script missing '+s)} ok(`${scripts.length} active scripts exist`);
const invoked=new Set();for(const f of fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js'))){const z=read('shell/'+f);for(const m of z.matchAll(/ipc\.invoke\(\s*['"]([^'"]+)['"]/g))invoked.add(m[1]);}
const handled=new Set([...main.matchAll(/ipcMain\.handle\(\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));for(const ch of invoked)if(!handled.has(ch))fail('unhandled IPC '+ch);else{} ok(`${invoked.size} IPC invoke channels checked`);
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js',...fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x),'scripts/qa-5.1.0.js']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)fail('syntax '+f+'\n'+(r.stderr||r.stdout))}ok('JavaScript syntax');
const ico=fs.readFileSync(path.join(root,'assets/icon.ico')); if(ico.length<500)fail('icon.ico suspiciously small');else ok('Windows ICO present'); if(ico.length>=22){try{const count=ico.readUInt16LE(4);const frames=[];for(let i=0;i<count;i++){const off=6+i*16;frames.push((ico.readUInt8(off)||256)+'x'+(ico.readUInt8(off+1)||256))}if(!frames.some(x=>Number(x.split('x')[0])>=256&&Number(x.split('x')[1])>=256))fail('icon.ico has no 256x256 frame');else ok('Windows ICO 256x256 frame present')}catch{fail('icon.ico header unreadable')}}
if(!exists('package-lock.json')&&!exists('npm-shrinkwrap.json')&&!exists('yarn.lock')&&!exists('pnpm-lock.yaml'))warn('no lockfile committed; keep dependency versions exact');
if(main.includes('contextIsolation: false')&&main.includes('nodeIntegration: true'))warn('main renderer legacy Node integration remains for compatibility; do not migrate in this release');
if(failed){console.error(`Nova 5.1.0 QA FAILED: ${failed} failures, ${warnings} warnings`);process.exit(1)}console.log(`Nova 5.1.0 Quantum Hotfix QA PASSED · ${warnings} warnings`);
