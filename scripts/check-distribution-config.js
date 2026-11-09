const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const build = pkg.build || {};
assert.equal(pkg.version, '9.0.0');
assert.equal(pkg.productName, 'NOVA');
assert.deepEqual(build.win?.target, ['nsis', 'portable']);
assert.equal(build.nsis?.oneClick, false);
assert.equal(build.nsis?.perMachine, false);
assert.equal(build.nsis?.allowElevation, false);
assert.equal(build.nsis?.allowToChangeInstallationDirectory, false);
assert.equal(build.nsis?.artifactName, 'NOVA-9-Setup-${version}.${ext}');
assert.equal(build.portable?.artifactName, 'NOVA-9-Portable-${version}.exe');
assert.equal(pkg.scripts['dist:setup'], 'electron-builder --win nsis --publish never -c.directories.output=dist/setup');
assert.equal(pkg.scripts['dist:portable'], 'electron-builder --win portable --publish never -c.directories.output=dist/portable');
assert.equal(pkg.scripts['dist:win'], 'npm run dist:setup && npm run dist:portable');
for (const name of ['.github/workflows/build.yml', '.github/workflows/release.yml']) {
  const content = fs.readFileSync(path.join(root, name), 'utf8');
  for (const marker of ['npm run dist:setup','npm run dist:portable','NOVA-9-Setup-${VERSION}.exe','NOVA-9-Portable-${VERSION}.exe']) assert.ok(content.includes(marker), `${name}: ${marker}`);
  assert.ok(!content.includes('p.build.nsis.include'));
  assert.ok(!content.includes('fs.writeFileSync("package.json"'));
  assert.ok(content.includes('node-version: 22.12.0'));
}
for (const file of ['portable-user-data.js','migration.js','permission-policy.js']) assert.ok(build.files.includes(file));
console.log('DISTRIBUTION CONFIG OK: NOVA 9.0.0; NSIS per-user + Portable; GitHub Actions targets valid.');
