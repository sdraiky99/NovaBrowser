#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const failures=[];const ok=m=>console.log('OK',m);const fail=m=>failures.push(m);const read=f=>fs.readFileSync(path.join(root,f),'utf8');
if(pkg.version!=='11.0.0')fail(`versión incorrecta ${pkg.version}`);else ok('versión NOVA X QUANTUM 11.0.0');
if(pkg.productName!=='NOVA X')fail('productName debe conservar NOVA X para continuidad');
if(pkg.build.appId!=='com.nova.browser')fail('appId debe conservar com.nova.browser para mantener continuidad de actualización');
const required=['main.js','portable-user-data.js','migration.js','permission-policy.js','shell/preload.js','shell/index.html','shell/newtab.html','shell/splash.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js','shell/quantum.js','assets/brand/nova-mark.svg','assets/brand/nova-icon.png','assets/brand/nova.ico','scripts/qa-quantum.js','scripts/qa-10.js','scripts/check-quantum.js','scripts/performance-smoke.js','scripts/check-syntax-all.js','scripts/check-distribution-config.js','.github/workflows/build.yml','.github/workflows/release.yml','RELEASE_NOTES_11.0.0.md','VALIDATION_11.0.0.txt','scripts/check-security.js'];
for(const f of required){if(!fs.existsSync(path.join(root,f)))fail(`falta ${f}`);else ok(`archivo ${f}`)}
if(!pkg.scripts.check.includes('qa:quantum')||!pkg.scripts.check.includes('check:quantum'))fail('pipeline de comprobación QUANTUM incompleto');
if(!pkg.build.files.includes('shell/**')||!pkg.build.files.includes('assets/**'))fail('runtime no empaqueta shell y assets');
if(pkg.build.nsis.perMachine!==false||pkg.build.nsis.allowElevation!==false||pkg.build.nsis.oneClick!==false)fail('Setup debe ser per-user, asistido y sin elevación');
if(pkg.build.nsis.shortcutName!=='NOVA X QUANTUM')fail('acceso directo debe identificar NOVA X QUANTUM');
const activeNotes=fs.readdirSync(root).filter(x=>/^RELEASE_NOTES_.*\.md$/i.test(x));if(activeNotes.length!==1||activeNotes[0]!=='RELEASE_NOTES_11.0.0.md')fail('notas activas no aisladas');
const ui=read('shell/nova.js'),home=read('shell/newtab.html'),index=read('shell/index.html'),main=read('main.js'),css=read('shell/nova.css'),preload=read('shell/preload.js');
if(!main.includes("ipcMain.handle('adblock-stats'")||!preload.includes("'adblock-stats'"))fail('Shield debe exponer estadísticas reales');
if(main.includes("b.on('request-blocked'"))fail('no usar evento request-blocked no soportado');
if(!/state\.tabMode==='vertical'/.test(ui)||!css.includes('body.vertical-tabs #verticalTabs'))fail('deben conservarse pestañas horizontales y verticales');
for(const [needle,label] of [['browserMode','selector de experiencias'],['timeMachineSnapshots','estado Capsules'],['renderTimeMachine(r)','snapshot engine'],['renderCompanion(r)','Companion'],['renderGaming(r)','Gaming'],['launch-web-app','lanzador de aplicaciones'],['default-browser','flujo de navegador predeterminado'],['newsToggle','control de noticias'],['Crear / asignar grupo','grupos de pestañas'],['permission-sites-list','permisos por sitio'],['migration-scan','importación'],['detailed-download','descargas'],['quantumApps','biblioteca de aplicaciones'],['atlasProjects','persistencia Atlas'],['quantumActions','persistencia Actions'],['customThemes','temas personalizados']])if(!ui.includes(needle))fail(`falta ${label}`);else ok(`${label} integrado`);
for(const mode of ['modern','xp','win7','firefox-classic','firefox-2017','chrome-2017','edge-legacy'])if(!ui.includes(mode)||!css.includes(`data-browser-mode="${mode}"`))fail(`falta modo ${mode}`);
for(const view of ['atlas','capsules','actions','app-center','themes','vault','profiles','recovery','migration','time-machine','companion','gaming'])if(!index.includes(`data-view="${view}"`))fail(`falta ruta lateral ${view}`);
if(!home.includes('data-q-section="app-center"')||!home.includes('NOVA X QUANTUM · 11.0.0'))fail('nueva pestaña sin navegación o marca QUANTUM');
if(!main.includes("app.setName('NOVA X')")||!main.includes("const APP_ID = 'com.nova.browser'"))fail('se debe conservar identidad de datos de usuario anterior');
if(!main.includes("127.0.0.1:11434"))fail('endpoint Ollama local no corregido');
const all=[];(function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git','dist'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else all.push(f)}})(root);
if(all.length>100)fail(`supera 100 archivos (${all.length})`);else ok(`límite de archivos: ${all.length}/100`);
if(failures.length){failures.forEach(x=>console.error('FAIL',x));process.exit(1)}console.log('PROJECT CHECK OK: NOVA X QUANTUM structure and feature contract.');
