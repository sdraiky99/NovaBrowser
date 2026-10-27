#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const failures = [];
const ok = message => console.log('OK', message);
const fail = message => failures.push(message);
if (pkg.version !== '6.2.2') fail(`versión de package.json incorrecta: ${pkg.version}`); else ok('versión 6.2.2');
const required = [
  'main.js','portable-user-data.js','migration.js','permission-policy.js','account-service.js','account-server/server.js',
  'shell/index.html','shell/newtab.html','shell/splash.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js',
  'assets/brand/nova-icon.png','assets/brand/nova.ico','assets/icons/plus.svg','assets/icons/settings.svg',
  'scripts/qa-6.2.2.js','scripts/check-syntax-all.js','scripts/check-distribution-config.js','.github/workflows/build.yml','.github/workflows/release.yml',
  'RELEASE_NOTES_6.2.2.md','VALIDATION_6.2.2.txt','docs/history/RELEASE_NOTES_6.2.0.md'
];
for (const rel of required) { if (!fs.existsSync(path.join(root, rel))) fail(`falta ${rel}`); else ok(`archivo ${rel}`); }
if (pkg.scripts['dist:setup'] !== 'electron-builder --win nsis --publish never -c.directories.output=dist/setup') fail('script dist:setup incorrecto');
if (pkg.scripts['dist:portable'] !== 'electron-builder --win portable --publish never -c.directories.output=dist/portable') fail('script dist:portable incorrecto');
if (pkg.scripts['check'] !== 'npm run check:distribution-config && npm run check:project && npm run check:syntax && npm run qa:6.2.2 && npm run check:build-assets') fail('el pipeline de check no ejecuta todas las verificaciones 6.2.2');
if (!pkg.build?.files?.includes('shell/**') || !pkg.build?.files?.includes('assets/**') || !pkg.build?.files?.includes('portable-user-data.js') || !pkg.build?.files?.includes('migration.js') || !pkg.build?.files?.includes('permission-policy.js')) fail('faltan recursos de ejecución en build.files'); else ok('archivos de ejecución y recursos incluidos');
if (pkg.build?.files?.some(x => x === 'docs/**' || x === 'scripts/**')) fail('documentación/QA no debe empaquetarse como código de ejecución'); else ok('carpeta histórica y scripts QA fuera del paquete runtime');
if (!pkg.build?.nsis || pkg.build.nsis.perMachine !== false || pkg.build.nsis.allowElevation !== false) fail('NSIS no está configurado para instalación por usuario sin elevación'); else ok('NSIS por usuario sin elevación');
if (fs.existsSync(path.join(root, 'build'))) fail('carpeta build histórica activa en raíz'); else ok('recursos antiguos NSIS no se consumen accidentalmente');
const releaseNotes = fs.readdirSync(root).filter(x => /^RELEASE_NOTES_.*\.md$/i.test(x));
if (releaseNotes.length !== 1 || releaseNotes[0] !== 'RELEASE_NOTES_6.2.2.md') fail('las notas de versión actuales en raíz no están aisladas'); else ok('notas activas correctas; el historial queda en docs/history');
const home = fs.readFileSync(path.join(root, 'shell/newtab.html'), 'utf8');
if (!home.includes('Nova 6.2.2 · Next Evolution')) fail('pie de nueva pestaña no muestra 6.2.2');
if (!home.includes('id="newsSection"') || !home.includes('state.showNews!==false')) fail('control de noticias desactivables no está integrado'); else ok('nueva pestaña admite ocultar noticias');
const ui = fs.readFileSync(path.join(root, 'shell/nova.js'), 'utf8');
for (const [needle, label] of [["id=\"newsToggle\"",'control de noticias'],['Crear / asignar grupo','grupos de pestañas'],['permission-sites-list','permisos por sitio'],['migration-scan','importación de perfiles'],['detailed-download','gestor de descargas']]) {
  if (!ui.includes(needle)) fail(`falta la implementación de ${label}`); else ok(`${label} integrado`);
}
if (failures.length) { for (const message of failures) console.error('FAIL', message); process.exit(1); }
