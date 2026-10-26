'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const fail = message => { console.error('FAIL', message); process.exitCode = 1; };
const ok = message => console.log('OK', message);
if (pkg.version !== '6.2.1') fail(`version ${pkg.version}`); else ok('versión 6.2.1');
const required = [
  'main.js', 'portable-user-data.js', 'migration.js', 'account-service.js', 'account-server/server.js',
  'shell/index.html', 'shell/newtab.html', 'shell/splash.html', 'shell/newtab-preload.js',
  'shell/navigation.js', 'shell/nova.js', 'shell/nova.css', 'shell/extensions.js',
  'assets/brand/nova-icon.png', 'assets/brand/nova.ico', 'assets/icons/plus.svg',
  'scripts/qa-6.2.1.js', 'scripts/check-syntax-all.js', '.github/workflows/build.yml',
  '.github/workflows/release.yml', 'RELEASE_NOTES_6.2.1.md', 'VALIDATION_6.2.1.txt',
  'docs/history/RELEASE_NOTES_6.2.0.md', 'docs/history/installer-resources-6.2.0/README.md'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`falta ${rel}`); else ok(`archivo ${rel}`);
}
const build = pkg.build || {};
if (JSON.stringify(build.win?.target) !== JSON.stringify(['portable'])) fail('Windows debe tener únicamente el target portable'); else ok('target Windows solo portable');
if (build.nsis || pkg.nsis) fail('no debe existir configuración activa NSIS'); else ok('sin configuración NSIS activa');
if (pkg.scripts['dist:linux']) fail('no debe existir un flujo de distribución adicional'); else ok('distribución limitada al portable Windows');
if (build.portable?.artifactName !== 'Nova-Portable-${version}.exe') fail('nombre de artefacto portable incorrecto'); else ok('nombre de artefacto portable coherente');
if (!build.files?.includes('portable-user-data.js')) fail('portable-user-data.js no está empaquetado'); else ok('gestor de perfil incluido en el paquete');
if (!build.files?.includes('shell/**') || !build.files?.includes('assets/**')) fail('faltan globs de interfaz/recursos'); else ok('recursos de interfaz y branding incluidos');
if (fs.existsSync(path.join(root, 'build'))) fail('carpeta de recursos del instalador aún activa en raíz'); else ok('recursos del instalador archivados');
const roots = fs.readdirSync(root).filter(x => /^RELEASE_NOTES_.*\.md$/i.test(x));
if (roots.length !== 1 || roots[0] !== 'RELEASE_NOTES_6.2.1.md') fail('notas de versión actuales en raíz'); else ok('notas actuales separadas del historial');
const activeRefs = ['package.json', 'README.md', 'CHANGELOG.md', 'shell/newtab.html', 'shell/splash.html'];
for (const rel of activeRefs) {
  const s = fs.readFileSync(path.join(root, rel), 'utf8');
  if (/(Nova-Setup-|setup NSIS|instalador y paquete portable)/i.test(s) && rel !== 'CHANGELOG.md') fail(`referencia a setup en ${rel}`);
}
ok('documentación y metadatos activos coherentes');
const index = fs.readFileSync(path.join(root, 'shell/index.html'), 'utf8');
if (!index.includes('<script src="nova.js"></script>')) fail('loader de renderer no encontrado'); else ok('loader del renderer');
const home = fs.readFileSync(path.join(root, 'shell/newtab.html'), 'utf8');
if (!home.includes('Nova 6.2.1 · Portable Stability')) fail('versión de nueva pestaña incorrecta'); else ok('versión de interfaz');
const all = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full); else all.push(path.relative(root, full));
  }
})(root);
if (all.length < 50) fail(`inventario pequeño (${all.length} archivos)`); else ok(`inventario de ${all.length} archivos útiles`);
if (process.exitCode) process.exit(1);
