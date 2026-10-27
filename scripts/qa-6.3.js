'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const pkg = JSON.parse(read('package.json'));
const ok = message => console.log('OK', message);
assert.equal(pkg.version, '6.3.0');
assert.match(pkg.description, /Deluxe Edition/);
assert.ok(fs.existsSync(path.join(root, 'assets/brand/nova-mark.svg')));
const brandSvg = read('assets/brand/nova-mark.svg');
assert.match(brandSvg, /viewBox="0 0 512 512"/);
assert.ok(!/<rect\b[^>]*fill="(?:#fff|white|#ffffff)"/i.test(brandSvg), 'el icono no debe tener una placa opaca');
assert.deepEqual(pkg.build.win.target, ['nsis', 'portable']);
assert.equal(pkg.build.nsis.oneClick, false);
assert.equal(pkg.build.nsis.perMachine, false);
assert.equal(pkg.build.nsis.allowElevation, false);
assert.equal(pkg.build.nsis.allowToChangeInstallationDirectory, false);
assert.equal(pkg.build.nsis.artifactName, 'Nova-Setup-${version}.${ext}');
assert.equal(pkg.build.portable.artifactName, 'Nova-Portable-${version}.exe');
assert.equal(pkg.scripts['dist:setup'], 'electron-builder --win nsis --publish never -c.directories.output=dist/setup');
assert.equal(pkg.scripts['dist:portable'], 'electron-builder --win portable --publish never -c.directories.output=dist/portable');
ok('configuración dual y artefactos nombrados correctamente');

const { normalizeHttpOrigin, isHttpOrigin, permissionKeysForRequest, permissionDecision, permissionRequestLabel } = require('../permission-policy.js');
assert.deepEqual(permissionKeysForRequest('media', { mediaTypes: ['audio', 'video'] }), ['cam', 'mic']);
assert.equal(permissionDecision(['cam', 'mic'], 'example.com', { 'example.com': { cam: 'allow' } }, {}), 'ask');
assert.equal(permissionDecision(['cam', 'mic'], 'example.com', { 'example.com': { cam: 'allow', mic: 'block' } }, {}), 'block');
assert.equal(permissionDecision(['cam', 'mic'], 'example.com', { 'example.com': { cam: 'allow', mic: 'allow' } }, {}), 'allow');
assert.equal(permissionDecision(['cam'], '', {}, { cam: 'allow' }), 'block');
assert.equal(permissionRequestLabel(['cam', 'mic']), 'cámara y micrófono');
assert.equal(normalizeHttpOrigin('https://EXAMPLE.com:443/path'), 'https://example.com');
assert.equal(isHttpOrigin('https://example.com'), true);
assert.equal(isHttpOrigin('file:///tmp/doc.html'), false);
assert.equal(permissionDecision(['cam'], 'http://example.com', { 'https://example.com': { cam: 'allow' } }, {}), 'ask', 'HTTPS allow must not grant HTTP origin');
ok('política de permisos por origen sin escalada de cámara/micrófono ni entre HTTP y HTTPS');

const { configurePortableUserData } = require('../portable-user-data.js');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-622-qa-'));
try {
  const defaultProfile = path.join(tempRoot, 'WindowsProfile');
  const defaultSession = path.join(tempRoot, 'WindowsSession');
  fs.mkdirSync(defaultProfile, {recursive:true}); fs.mkdirSync(defaultSession, {recursive:true});
  fs.writeFileSync(path.join(defaultProfile,'prefs.json'),'{"theme":"dark"}');
  fs.mkdirSync(path.join(defaultProfile,'Default','Local Storage'),{recursive:true});
  fs.writeFileSync(path.join(defaultProfile,'Default','Local Storage','origin.data'),'setup-data');
  fs.mkdirSync(path.join(defaultProfile,'Cache'),{recursive:true}); fs.writeFileSync(path.join(defaultProfile,'Cache','tmp'),'cache');
  fs.writeFileSync(path.join(defaultSession,'network-state'),'setup-session');
  const makeApp=(userData=defaultProfile,sessionData=defaultSession)=>{const paths={userData,sessionData};return {paths,getPath(name){return paths[name]},setPath(name,value){paths[name]=value}}};
  const logger={info(){},warn(){}};
  const ordinary=makeApp();
  const regular=configurePortableUserData(ordinary,{}, {logger});
  assert.equal(regular.active,false); assert.equal(ordinary.paths.userData,defaultProfile);
  ok('Setup/desarrollo mantiene el perfil normal de Windows');

  const exeDir=path.join(tempRoot,'PortableFresh'); fs.mkdirSync(exeDir,{recursive:true});
  const exe=path.join(exeDir,'Nova-Portable-6.3.0.exe');fs.writeFileSync(exe,'fake exe');
  const target=path.join(exeDir,'User Data');
  const freshApp=makeApp();
  const fresh=configurePortableUserData(freshApp,{PORTABLE_EXECUTABLE_FILE:exe,PORTABLE_EXECUTABLE_DIR:exeDir},{logger});
  assert.equal(fresh.active,true);assert.equal(fresh.path,target);assert.equal(fresh.migrated,false);
  assert.equal(fs.existsSync(path.join(target,'prefs.json')),false,'portable nuevo no debe copiar prefs del Setup');
  assert.equal(fs.readdirSync(target).length,0,'el perfil portable nuevo arranca vacío');
  ok('perfil portable nuevo e independiente; no copia datos de Setup sin consentimiento');

  fs.writeFileSync(path.join(target,'prefs.json'),'{"portable":true}');
  const existingApp=makeApp();const existing=configurePortableUserData(existingApp,{PORTABLE_EXECUTABLE_FILE:exe,PORTABLE_EXECUTABLE_DIR:exeDir},{logger});
  assert.equal(existing.active,true);assert.equal(existing.migrated,false);assert.equal(fs.readFileSync(path.join(target,'prefs.json'),'utf8'),'{"portable":true}');
  ok('actualización de Portable conserva su propio perfil');

  const importDir=path.join(tempRoot,'PortableImportOptIn');fs.mkdirSync(importDir,{recursive:true});
  const importExe=path.join(importDir,'Nova-Portable-6.3.0.exe');fs.writeFileSync(importExe,'fake exe');
  const importApp=makeApp();const imported=configurePortableUserData(importApp,{PORTABLE_EXECUTABLE_FILE:importExe,PORTABLE_EXECUTABLE_DIR:importDir,NOVA_IMPORT_EXISTING_PROFILE:'1'},{logger});
  assert.equal(imported.active,true);assert.equal(imported.migrated,true);
  assert.equal(fs.readFileSync(path.join(importDir,'User Data','prefs.json'),'utf8'),'{"theme":"dark"}');
  assert.equal(fs.existsSync(path.join(importDir,'User Data','Cache')),false);
  ok('importación heredada solo cuando se opta explícitamente; excluye cachés');

  const blocker=path.join(tempRoot,'file-not-dir');fs.writeFileSync(blocker,'x');
  const blockedApp=makeApp();const blocked=configurePortableUserData(blockedApp,{PORTABLE_EXECUTABLE_FILE:path.join(blocker,'Nova.exe'),PORTABLE_EXECUTABLE_DIR:blocker},{logger});
  assert.equal(blocked.active,false);assert.equal(blockedApp.paths.userData,defaultProfile);assert.ok(blocked.reason);
  ok('fallback seguro al perfil de Windows si la carpeta portable no permite escritura');
} finally { fs.rmSync(tempRoot,{recursive:true,force:true}); }

const nav = require('../shell/navigation.js');
assert.equal(nav.resolveNavigation('example.com'), 'https://example.com/');
assert.equal(nav.resolveNavigation('hola mundo').startsWith('https://www.google.com/search?q='), true);
assert.equal(nav.resolveNavigation('javascript:alert(1)'), 'https://www.google.com/search?q=javascript%3Aalert(1)');
ok('resolución URL/búsqueda y bloqueo de esquemas de ejecución');

const main=read('main.js'), ui=read('shell/nova.js'), home=read('shell/newtab.html'), preload=read('shell/newtab-preload.js');
assert.ok(home.includes('Nova 6.3 Deluxe Edition · Velocidades Locas'));
assert.ok(home.includes('Novedades de Nova 6.3'));
assert.ok(read('shell/index.html').includes('../assets/brand/nova-mark.svg'));
assert.ok(read('shell/splash.html').includes('DELUXE EDITION · 6.3'));
ok('identidad Deluxe integrada: SVG transparente, nueva pestaña, favicon y splash');
assert.ok(main.includes('permission-sites-list') && main.includes('permission-site-set') && main.includes('permission-site-reset'));
assert.ok(main.includes('Permitir siempre') && main.includes('Bloquear siempre'));
assert.ok(main.includes('The Verge') && main.includes('Engadget') && main.includes('PC Gamer'));
assert.ok(ui.includes('id="newsToggle"') && ui.includes('refreshAllNewTabs()'));
assert.ok(ui.includes('Crear / asignar grupo') && ui.includes('tab-group-badge'));
assert.ok(ui.includes('data-dlctl') && ui.includes('data-import-run'));
assert.ok(home.includes('id="newsSection"') && home.includes('if(showNews)loadNews()'));
assert.ok(ui.includes('raw.sessionTabs.slice(-50)') && ui.includes('urls.slice(-50)') && ui.includes('state.sessionTabs.slice(-50)'), 'la sesión debe conservar hasta 50 pestañas');
ok('restauración de sesiones ampliada hasta 50 pestañas');
assert.ok(main.includes('SPLASH_MS = 500'), 'el splash no debe imponer una espera larga');
ok('espera mínima del splash reducida para acelerar el arranque visible');
assert.ok(preload.includes("'news-feed'"));
ok('integración estática de noticias, grupos, descargas, permisos e importador');

const inline=[...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(x=>x.trim());
assert.ok(inline.length);
inline.forEach((src,i)=>new vm.Script(src,{filename:`newtab-inline-${i+1}.js`}));
ok('JavaScript inline de nueva pestaña parseable');

const build=read('.github/workflows/build.yml'), release=read('.github/workflows/release.yml');
for (const [name, content] of [['build',build],['release',release]]) {
  assert.ok(content.includes('npm run check:distribution-config'));
  assert.ok(content.includes('npm run dist:setup'));
  assert.ok(content.includes('npm run dist:portable'));
  assert.ok(content.includes('dist/setup/Nova-Setup-${VERSION}.exe'));
  assert.ok(content.includes('dist/portable/Nova-Portable-${VERSION}.exe'));
  assert.ok(!content.includes('p.build.nsis.include'));
  assert.ok(!content.includes("fs.writeFileSync(\"package.json\""));
}
ok('GitHub Actions compila y verifica ambos artefactos sin mutar package.json');
console.log('QA Nova 6.3.0: PASS');
