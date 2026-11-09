#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const failures=[];const ok=m=>console.log('OK',m);const fail=m=>failures.push(m);const read=f=>fs.readFileSync(path.join(root,f),'utf8');
if(pkg.version!=='9.0.0')fail(`versión incorrecta ${pkg.version}`);else ok('versión 9.0.0');
if(pkg.productName!=='NOVA')fail('productName debe ser NOVA');
const required=['main.js','portable-user-data.js','migration.js','permission-policy.js','shell/preload.js','shell/index.html','shell/newtab.html','shell/splash.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js','assets/brand/nova-mark.svg','assets/brand/nova-icon.png','assets/brand/nova.ico','scripts/qa-9.js','scripts/performance-smoke.js','scripts/check-syntax-all.js','scripts/check-distribution-config.js','.github/workflows/build.yml','.github/workflows/release.yml','RELEASE_NOTES_9.0.0.md','VALIDATION_9.0.0.txt','scripts/check-security.js'];
for(const f of required){if(!fs.existsSync(path.join(root,f)))fail(`falta ${f}`);else ok(`archivo ${f}`)}
if(pkg.scripts.check!=='npm run check:distribution-config && npm run check:project && npm run check:syntax && npm run qa:9 && npm run check:build-assets && npm run check:performance && npm run check:security')fail('pipeline de comprobación incompleto');
if(!pkg.build.files.includes('shell/**')||!pkg.build.files.includes('assets/**'))fail('runtime no empaqueta shell y assets');
if(pkg.build.nsis.perMachine!==false||pkg.build.nsis.allowElevation!==false||pkg.build.nsis.oneClick!==false)fail('Setup debe ser per-user, asistido y sin elevación');
const activeNotes=fs.readdirSync(root).filter(x=>/^RELEASE_NOTES_.*\.md$/i.test(x));if(activeNotes.length!==1||activeNotes[0]!=='RELEASE_NOTES_9.0.0.md')fail('notas activas no aisladas');
const ui=read('shell/nova.js'),home=read('shell/newtab.html'),index=read('shell/index.html');
for(const [needle,label] of [['browserMode','selector de experiencias'],['timeMachineSnapshots','estado Time Machine'],['renderTimeMachine(r)','vista Time Machine'],['renderCompanion(r)','vista Companion'],['renderGaming(r)','vista Gaming'],['launch-web-app','lanzador de webs'],['default-browser','flujo de navegador predeterminado'],['newsToggle','control de noticias'],['Crear / asignar grupo','grupos de pestañas'],['permission-sites-list','permisos por sitio'],['migration-scan','importación'],['detailed-download','descargas']])if(!ui.includes(needle))fail(`falta ${label}`);else ok(`${label} integrado`);
for(const mode of ['modern','xp','win7','firefox-classic','firefox-2017','chrome-2017','edge-legacy']){if(!ui.includes(mode)||!read('shell/nova.css').includes(`data-browser-mode="${mode}"`))fail(`falta modo ${mode}`);}
if(!home.includes('id="defaultBrowser"')||!home.includes('id="openCompanion"'))fail('acciones del Dashboard incompletas');
for(const view of ['time-machine','companion','gaming'])if(!index.includes(`data-view="${view}"`))fail(`falta ruta lateral ${view}`);
if(!read('assets/brand/nova-mark.svg').includes('<svg'))fail('logo SVG original no encontrado');
if(pkg.build.nsis.artifactName!=='NOVA-9-Setup-${version}.${ext}'||pkg.build.portable.artifactName!=='NOVA-9-Portable-${version}.exe')fail('nombres de artefactos incorrectos');
const all=[];(function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git','dist'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else all.push(f)}})(root);
if(all.length>100)fail(`supera 100 archivos (${all.length})`);else ok(`límite de archivos: ${all.length}/100`);
if(failures.length){failures.forEach(x=>console.error('FAIL',x));process.exit(1)}console.log('PROJECT CHECK OK: NOVA 9 structure and feature contract.');
