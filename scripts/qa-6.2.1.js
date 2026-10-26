'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const pkg = JSON.parse(read('package.json'));
const ok = message => console.log('OK', message);

assert.equal(pkg.version, '6.2.1');
assert.equal(pkg.build.portable.artifactName, 'Nova-Portable-${version}.exe');
assert.deepEqual(pkg.build.win.target, ['portable']);
assert.equal(pkg.build.nsis, undefined);
assert.equal(pkg.nsis, undefined);
assert.ok(!pkg.scripts['dist:linux']);
assert.ok(pkg.build.files.includes('portable-user-data.js'));
ok('metadata: 6.2.1, portable-only and no NSIS setup');

const all = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full); else all.push(path.relative(root, full));
  }
})(root);
assert.ok(all.length > 50, `inventario incompleto: ${all.length}`);
assert.deepEqual(all.filter(f => /^RELEASE_NOTES_.*\.md$/i.test(path.basename(f)) && path.dirname(f) === '.').sort(), ['RELEASE_NOTES_6.2.1.md']);
for (const rel of ['main.js', 'portable-user-data.js', 'migration.js', 'shell/index.html', 'shell/newtab.html', 'shell/splash.html', 'shell/nova.js', 'shell/nova.css', 'assets/brand/nova.ico', 'assets/icons/plus.svg', '.github/workflows/build.yml', '.github/workflows/release.yml']) assert.ok(fs.existsSync(path.join(root, rel)), `missing ${rel}`);
assert.ok(!fs.existsSync(path.join(root, 'build')));
ok('estructura del proyecto y archivado de recursos antiguos');

const main = read('main.js');
assert.ok(main.includes("require('./portable-user-data.js')"));
assert.ok(main.indexOf('configurePortableUserData(app, process.env)') < main.indexOf("require('./migration.js')"));
assert.ok(main.includes("ipcMain.on('portable-data-status'"));
ok('integración de perfil portable antes de iniciar servicios y sesiones');

// Test the actual storage-path helper against temporary directories.
const { configurePortableUserData } = require('../portable-user-data.js');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-621-qa-'));
try {
  const defaultProfile = path.join(tempRoot, 'WindowsProfile');
  const defaultSession = path.join(tempRoot, 'WindowsSession');
  fs.mkdirSync(defaultProfile, { recursive: true });
  fs.mkdirSync(defaultSession, { recursive: true });
  fs.writeFileSync(path.join(defaultProfile, 'prefs.json'), '{"theme":"dark"}');
  fs.mkdirSync(path.join(defaultProfile, 'Default', 'Local Storage'), { recursive: true });
  fs.writeFileSync(path.join(defaultProfile, 'Default', 'Local Storage', 'leveldb.data'), 'local-state');
  fs.mkdirSync(path.join(defaultProfile, 'Cache'), { recursive: true });
  fs.writeFileSync(path.join(defaultProfile, 'Cache', 'ignore.bin'), 'temporary');
  fs.writeFileSync(path.join(defaultSession, 'network-state'), 'cookies/network data');

  const makeApp = (userData = defaultProfile, sessionData = defaultSession) => {
    const paths = { userData, sessionData };
    return { paths, getPath(name) { return paths[name]; }, setPath(name, value) { paths[name] = value; } };
  };
  const logger = { info() {}, warn() {} };

  const nonPortableApp = makeApp();
  const nonPortable = configurePortableUserData(nonPortableApp, {}, { logger });
  assert.equal(nonPortable.isPortable, false);
  assert.equal(nonPortable.active, false);
  assert.equal(nonPortableApp.paths.userData, defaultProfile);
  ok('no altera rutas en modo no portable');

  const exeDir = path.join(tempRoot, 'PortableFolder');
  fs.mkdirSync(exeDir, { recursive: true });
  const exe = path.join(exeDir, 'Nova-Portable-6.2.1.exe');
  fs.writeFileSync(exe, 'fake exe');
  const target = path.join(exeDir, 'User Data');
  const freshApp = makeApp();
  const fresh = configurePortableUserData(freshApp, { PORTABLE_EXECUTABLE_FILE: exe, PORTABLE_EXECUTABLE_DIR: exeDir }, { logger });
  assert.equal(fresh.active, true);
  assert.equal(fresh.path, target);
  assert.equal(fresh.migrated, true);
  assert.equal(freshApp.paths.userData, target);
  assert.equal(freshApp.paths.sessionData, target);
  assert.equal(fs.readFileSync(path.join(target, 'prefs.json'), 'utf8'), '{"theme":"dark"}');
  assert.equal(fs.readFileSync(path.join(target, 'Default', 'Local Storage', 'leveldb.data'), 'utf8'), 'local-state');
  assert.equal(fs.readFileSync(path.join(target, 'network-state'), 'utf8'), 'cookies/network data');
  assert.equal(fs.existsSync(path.join(target, 'Cache')), false, 'cache should not be migrated');
  ok('first portable launch migrates profile and session data without caches');

  // Existing portable data wins; never overwrite it with the Windows profile.
  const prefFile = path.join(target, 'prefs.json');
  fs.writeFileSync(prefFile, '{"theme":"light","portable":true}');
  const existingApp = makeApp();
  const existing = configurePortableUserData(existingApp, { PORTABLE_EXECUTABLE_FILE: exe, PORTABLE_EXECUTABLE_DIR: exeDir }, { logger });
  assert.equal(existing.active, true);
  assert.equal(existing.migrated, false);
  assert.equal(fs.readFileSync(prefFile, 'utf8'), '{"theme":"light","portable":true}');
  ok('el perfil portable existente tiene prioridad y se conserva');

  // A path whose parent is a regular file cannot be writable; fallback to Windows.
  const blocker = path.join(tempRoot, 'not-a-directory');
  fs.writeFileSync(blocker, 'blocker');
  const blockedApp = makeApp();
  const blocked = configurePortableUserData(blockedApp, { PORTABLE_EXECUTABLE_FILE: path.join(blocker, 'Nova.exe'), PORTABLE_EXECUTABLE_DIR: blocker }, { logger });
  assert.equal(blocked.isPortable, true);
  assert.equal(blocked.active, false);
  assert.equal(blockedApp.paths.userData, defaultProfile);
  assert.ok(blocked.reason);
  ok('fallback a perfil de Windows ante una carpeta portable no escribible');

  // If the executable itself is stored inside the legacy profile folder, the
  // portable User Data descendant must not be recursively copied into itself.
  const nestedProfile = path.join(tempRoot, 'NovaProfileContainsPortable');
  fs.mkdirSync(nestedProfile, { recursive: true });
  fs.writeFileSync(path.join(nestedProfile, 'prefs.json'), '{\"legacy\":true}');
  const nestedExe = path.join(nestedProfile, 'Nova-Portable-6.2.1.exe');
  fs.writeFileSync(nestedExe, 'fake exe');
  const nestedApp = makeApp(nestedProfile, nestedProfile);
  const nested = configurePortableUserData(nestedApp, { PORTABLE_EXECUTABLE_FILE: nestedExe, PORTABLE_EXECUTABLE_DIR: nestedProfile }, { logger });
  assert.equal(nested.active, true);
  assert.equal(nested.migrated, true);
  assert.equal(fs.readFileSync(path.join(nestedProfile, 'User Data', 'prefs.json'), 'utf8'), '{\"legacy\":true}');
  ok('migración sin recursión si el portable vive dentro del perfil antiguo');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

const home = read('shell/newtab.html');
const splash = read('shell/splash.html');
assert.ok(home.includes('Nova 6.2.1 · Portable Stability'));
assert.ok(splash.includes('PORTABLE STABILITY · 6.2.1'));
assert.ok(read('shell/nova.js').includes("ipc.sendSync('portable-data-status')"));
assert.ok(read('shell/nova.js').includes('Datos de Nova'));
assert.ok(read('shell/index.html').includes('<title>Nova 6.2.1</title>'));
const inline = [...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
assert.ok(inline.length > 0);
inline.forEach((src, i) => new vm.Script(src, { filename: `newtab-inline-${i+1}.js` }));
ok('versión visible y JavaScript inline parseable');

const buildWorkflow = read('.github/workflows/build.yml');
const releaseWorkflow = read('.github/workflows/release.yml');
assert.ok(buildWorkflow.includes('npm run dist:portable'));
assert.ok(buildWorkflow.includes('Nova-Portable-'));
assert.ok(!buildWorkflow.includes('test -f "dist/Nova-Setup-'));
assert.ok(buildWorkflow.includes("compgen -G 'dist/Nova-Setup-*.exe'"), 'CI debe fallar si aparece un instalador accidental');
assert.ok(!buildWorkflow.includes('jobs:\n  linux:'));
assert.ok(releaseWorkflow.includes('npm run dist:portable'));
assert.ok(releaseWorkflow.includes('dist/Nova-Portable-*.exe'));
assert.ok(!releaseWorkflow.includes('Nova-Setup-'));
assert.ok(!releaseWorkflow.includes('needs: [windows, linux]'));
ok('CI y release generan y publican solo el portable Windows');

console.log(JSON.stringify({ ok: true, version: pkg.version, files: all.length, portableTests: 5, validation: 'static + portable storage tests' }, null, 2));
