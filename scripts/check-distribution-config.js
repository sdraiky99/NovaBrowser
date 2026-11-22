'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')),build=pkg.build||{};
assert.equal(pkg.version,'11.0.0');assert.equal(pkg.productName,'NOVA X');assert.equal(build.appId,'com.nova.browser','preserve existing app identity');
assert.equal(pkg.devDependencies?.electron,'45.4.1');assert.equal(pkg.devDependencies?.['electron-builder'],'26.18.1');assert.equal(pkg.dependencies?.['@ghostery/adblocker-electron'],'2.20.3');
assert.deepEqual(build.win?.target,['nsis','portable']);assert.equal(build.nsis?.oneClick,false);assert.equal(build.nsis?.perMachine,false);assert.equal(build.nsis?.allowElevation,false);assert.equal(build.nsis?.allowToChangeInstallationDirectory,false);assert.equal(build.nsis?.shortcutName,'NOVA X QUANTUM');
assert.equal(build.nsis?.artifactName,'NOVA-X-QUANTUM-Setup-${version}.${ext}');assert.equal(build.portable?.artifactName,'NOVA-X-QUANTUM-Portable-${version}.exe');
assert.equal(pkg.scripts['dist:setup'],'electron-builder --win nsis --publish never -c.directories.output=dist/setup');assert.equal(pkg.scripts['dist:portable'],'electron-builder --win portable --publish never -c.directories.output=dist/portable');
for(const name of ['.github/workflows/build.yml','.github/workflows/release.yml']){const content=fs.readFileSync(path.join(root,name),'utf8');for(const marker of ['npm install --no-audit --no-fund --engine-strict','npm run dist:setup','npm run dist:portable','NOVA-X-QUANTUM-Setup-${VERSION}.exe','NOVA-X-QUANTUM-Portable-${VERSION}.exe'])assert.ok(content.includes(marker),`${name}: ${marker}`);assert.ok(content.includes('node-version: 22.12.0'));assert.ok(!content.includes('cache: npm'),'No npm cache setup is allowed without a committed lockfile');}
const release=fs.readFileSync(path.join(root,'.github/workflows/release.yml'),'utf8');assert.ok(release.includes('latest.yml'));assert.ok(release.includes('sha512'));assert.ok(release.includes('release/NOVA-X-QUANTUM-Setup-*.exe'));
for(const file of ['portable-user-data.js','migration.js','permission-policy.js'])assert.ok(build.files.includes(file));
console.log('DISTRIBUTION CONFIG OK: NOVA X QUANTUM 11.0.0; stable app identity; NSIS per-user + isolated Portable; updater manifest in release workflow.');
