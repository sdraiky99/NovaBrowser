'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.equal(pkg.version, '6.2.1', 'La versión esperada debe ser 6.2.1');
assert.ok(pkg.build && typeof pkg.build === 'object', 'Falta configuración build');
assert.deepEqual(pkg.build.win && pkg.build.win.target, ['portable'], 'Windows debe compilar solo portable');
assert.equal(pkg.build.nsis, undefined, 'No debe existir configuración NSIS activa');
assert.equal(pkg.nsis, undefined, 'No debe existir configuración NSIS a nivel raíz');
assert.equal(pkg.build.artifactName, 'Nova-Portable-${version}.exe', 'Nombre de artefacto incorrecto');
assert.equal(pkg.build.portable && pkg.build.portable.artifactName, 'Nova-Portable-${version}.exe', 'Nombre portable incorrecto');
assert.equal(pkg.scripts && pkg.scripts['dist:portable'], 'electron-builder --win portable --publish never', 'Comando de compilación portable incorrecto');
assert.equal(pkg.scripts && pkg.scripts.dist, 'npm run dist:portable', 'El comando dist debe apuntar al portable');
assert.equal(pkg.scripts && pkg.scripts['dist:win'], 'npm run dist:portable', 'El alias dist:win debe apuntar al portable');
assert.equal(pkg.scripts && pkg.scripts['dist:linux'], undefined, 'No debe crear otros formatos en este canal');

for (const name of ['.github/workflows/build.yml', '.github/workflows/release.yml']) {
  const content = fs.readFileSync(path.join(root, name), 'utf8');
  assert.ok(content.includes('npm run check:portable-config'), `${name} debe validar la configuración portable`);
  assert.ok(content.includes('npm run dist:portable'), `${name} debe compilar el portable`);
  assert.ok(!content.includes('p.build.nsis.include'), `${name} no debe modificar propiedades NSIS inexistentes`);
  assert.ok(!/build\.win\.target\s*=\s*\[\s*['"]nsis['"]\s*,\s*['"]portable['"]\s*\]/.test(content), `${name} no debe reactivar NSIS`);
}
console.log('PORTABLE CONFIG OK: no Setup/NSIS; el preflight no muta package.json.');
