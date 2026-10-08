"use strict";
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8'); const exists=f=>fs.existsSync(path.join(root,f)); let failed=0,warnings=0;
const fail=x=>{console.error('QA FAIL:',x);failed++}; const ok=x=>console.log('QA OK:',x); const warn=x=>{console.warn('QA WARN:',x);warnings++};
let pkg;try{pkg=JSON.parse(read('package.json'))}catch{fail('package.json inválido');process.exit(1)}
if(pkg.version!=='5.2.0')fail('version '+pkg.version);else ok('version 5.2.0');
if(pkg.engines?.node!==' >=22.12.0'.trim())fail('Node engine incorrecto');else ok('Node >=22.12.0');
if(read('.nvmrc').trim()!=='22.12.0')fail('.nvmrc incorrecto');else ok('Node 22.12.0 fijado');
const index=read('shell/index.html');
for(const m of ['nova51.js','nova52.js','id="tabs"','id="nt"','id="addr"']) if(!index.includes(m))fail('index missing '+m); else ok('index '+m);
if((index.match(/nova52\.js/g)||[]).length!==1)fail('nova52.js debe cargarse una sola vez');else ok('nova52 single load');
if(read('shell/nova52.js').includes('newTab('))fail('nova52.js no debe mutar creación de pestañas');else ok('nova52 protege navegación');
for(const f of ['assets/icon.png','assets/icon.ico','assets/logo/nova-quantum.svg','assets/logo/nova-quantum-wordmark.svg','assets/logo/nova-quantum-mono.svg','assets/logo/nova-quantum.png','shell/splash.html','build/installerHeader.bmp','build/installerSidebar.bmp']) if(!exists(f))fail('missing '+f);else ok('asset '+f);
if(exists('shell/themes.css'))fail('themes.css sigue en el producto');else ok('legacy themes.css absent');
if(exists('assets/logos'))fail('assets/logos sigue en el producto');else ok('legacy logos absent');
const oldRootNotes=fs.readdirSync(root).filter(f=>/^RELEASE_NOTES_.*\.md$/i.test(f)); if(oldRootNotes.length!==1||oldRootNotes[0]!=='RELEASE_NOTES_5.2.0.md')fail('release notes root invalid: '+oldRootNotes.join(','));else ok('solo release notes 5.2.0');
if(!exists('docs/history/5.1.0.md'))warn('5.1 release note not moved to history'); else ok('5.1 history preserved');
const main=read('main.js'); if(!main.includes("const LOGOS = ['quantum']"))fail('main logo contract changed');else ok('single logo contract');
if(!pkg.build?.files?.includes('shell/**')||!pkg.build?.files?.includes('assets/**'))fail('electron-builder files incomplete');else ok('electron-builder files');
if(pkg.build?.win?.icon!=='assets/icon.ico')fail('Windows icon path changed');else ok('Windows icon path');
const splash=read('shell/splash.html'); if(!splash.includes('QUANTUM 5.2'))fail('splash not 5.2');else ok('splash 5.2');
const installer=read('build/installer.nsh'); if(installer.includes('5.1.0'))fail('installer has 5.1 text');else ok('installer branding current');
const ico=fs.readFileSync(path.join(root,'assets/icon.ico')); if(ico.length<500)fail('icon.ico suspiciously small'); else ok('ICO present');
if(ico.length>=22){try{const count=ico.readUInt16LE(4);let hasBig=false;for(let i=0;i<count;i++){const off=6+i*16,w=ico.readUInt8(off)||256,h=ico.readUInt8(off+1)||256;if(w>=256&&h>=256)hasBig=true}if(!hasBig)fail('ico no 256 frame');else ok('ICO 256 frame');}catch{fail('ico header unreadable')}}
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js',...fs.readdirSync(path.join(root,'shell')).filter(x=>x.endsWith('.js')).map(x=>'shell/'+x),'scripts/qa-5.2.0.js']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)fail('syntax '+f+'\n'+(r.stderr||r.stdout))}ok('JavaScript syntax');
if(!exists('package-lock.json')&&!exists('npm-shrinkwrap.json')&&!exists('yarn.lock')&&!exists('pnpm-lock.yaml'))warn('no lockfile committed; dependency versions remain exact');
if(main.includes('contextIsolation: false')&&main.includes('nodeIntegration: true'))warn('legacy renderer Node integration remains intentionally for compatibility');
if(failed){console.error(`Nova 5.2.0 QA FAILED: ${failed} failures, ${warnings} warnings`);process.exit(1)}console.log(`Nova 5.2.0 Quantum Identity QA PASSED · ${warnings} warnings`);
