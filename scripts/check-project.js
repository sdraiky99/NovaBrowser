#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const failures = [];
const ok = message => console.log('OK', message);
const fail = message => failures.push(message);
if (pkg.version !== '6.3.0') fail(`versión incorrecta: ${pkg.version}`); else ok('versión 6.3.0');
const required = [
  'main.js','portable-user-data.js','migration.js','permission-policy.js','account-service.js','account-server/server.js',
  'shell/index.html','shell/newtab.html','shell/splash.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js',
  'assets/brand/nova-mark.svg','assets/brand/nova-icon.png','assets/brand/nova.ico','assets/icons/plus.svg','assets/icons/settings.svg',
  'scripts/qa-6.3.js','scripts/performance-smoke.js','scripts/check-syntax-all.js','scripts/check-distribution-config.js','.github/workflows/build.yml','.github/workflows/release.yml',
  'RELEASE_NOTES_6.3.0.md','VALIDATION_6.3.0.txt','docs/history/RELEASE_NOTES_6.2.2.md'
];
for (const rel of required) { if (!fs.existsSync(path.join(root, rel))) fail(`falta ${rel}`); else ok(`archivo ${rel}`); }
if (pkg.scripts['dist:setup'] !== 'electron-builder --win nsis --publish never -c.directories.output=dist/setup') fail('script dist:setup incorrecto');
if (pkg.scripts['dist:portable'] !== 'electron-builder --win portable --publish never -c.directories.output=dist/portable') fail('script dist:portable incorrecto');
if (pkg.scripts.check !== 'npm run check:distribution-config && npm run check:project && npm run check:syntax && npm run qa:6.3 && npm run check:build-assets && npm run check:performance') fail('pipeline check incompleto');
if (!pkg.build?.files?.includes('shell/**') || !pkg.build?.files?.includes('assets/**') || !pkg.build?.files?.includes('portable-user-data.js') || !pkg.build?.files?.includes('migration.js') || !pkg.build?.files?.includes('permission-policy.js')) fail('faltan recursos de ejecución en build.files'); else ok('archivos de ejecución y recursos incluidos');
if (pkg.build?.files?.some(x => x === 'docs/**' || x === 'scripts/**')) fail('documentación/QA no debe empaquetarse como código de ejecución'); else ok('documentación y QA fuera del runtime');
if (!pkg.build?.nsis || pkg.build.nsis.perMachine !== false || pkg.build.nsis.allowElevation !== false) fail('NSIS no está configurado por usuario'); else ok('NSIS por usuario sin elevación');
if (fs.existsSync(path.join(root, 'build'))) fail('carpeta build histórica activa en raíz'); else ok('sin recursos NSIS históricos activos');
const releaseNotes = fs.readdirSync(root).filter(x => /^RELEASE_NOTES_.*\.md$/i.test(x));
if (releaseNotes.length !== 1 || releaseNotes[0] !== 'RELEASE_NOTES_6.3.0.md') fail('las notas activas no están aisladas'); else ok('notas activas correctas');
const home = fs.readFileSync(path.join(root, 'shell/newtab.html'), 'utf8');
if (!home.includes('Nova 6.3 Deluxe Edition · Velocidades Locas')) fail('pie de nueva pestaña no muestra la edición Deluxe');
if (!home.includes('DELUXE EDITION') || !home.includes('../assets/brand/nova-mark.svg')) fail('nueva pestaña sin identidad Deluxe/asset SVG');
if (!home.includes('Novedades de Nova 6.3')) fail('botón de novedades conserva una versión anterior');
if (!home.includes('id="newsSection"') || !home.includes('state.showNews!==false')) fail('noticias desactivables no integradas'); else ok('nueva pestaña con noticias opcionales');
const splash = fs.readFileSync(path.join(root, 'shell/splash.html'), 'utf8');
if (!splash.includes('VELOCIDADES LOCAS · DELUXE EDITION · 6.3') || !splash.includes('../assets/brand/nova-mark.svg')) fail('splash sin identidad Deluxe actualizada');
const ui = fs.readFileSync(path.join(root, 'shell/nova.js'), 'utf8');
for (const [needle, label] of [["id=\"newsToggle\"",'control de noticias'],['Crear / asignar grupo','grupos de pestañas'],['permission-sites-list','permisos por sitio'],['migration-scan','importación de perfiles'],['detailed-download','gestor de descargas']]) {
  if (!ui.includes(needle)) fail(`falta la implementación de ${label}`); else ok(`${label} integrado`);
}
if (failures.length) { for (const message of failures) console.error('FAIL', message); process.exit(1); }
