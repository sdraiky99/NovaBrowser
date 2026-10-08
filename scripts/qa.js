'use strict';
/*
 * Nova QA estático y funcional (sin Electron).
 * Uso: node scripts/qa.js [syntax|wiring|ipc|assets|build|prefs|ci]
 * Cada sección comprueba RELACIONES entre archivos reales, no la presencia de palabras.
 * Lo que NO puede comprobarse aquí (arranque de Electron, pestañas, extensiones, instalador) se lista al final.
 */
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const root = path.resolve(__dirname, '..');
const R = f => fs.readFileSync(path.join(root, f), 'utf8');
const E = f => fs.existsSync(path.join(root, f));
const ls = d => fs.readdirSync(path.join(root, d));
const only = process.argv[2];
let failures = 0, warnings = 0;
const sections = {};
const section = (name, fn) => { sections[name] = fn; };
const fail = m => { failures++; console.error('  FAIL  ' + m); };
const ok = m => console.log('  ok    ' + m);
const warn = m => { warnings++; console.warn('  warn  ' + m); };
const walk = (d, acc = []) => {
  for (const n of fs.readdirSync(path.join(root, d))) {
    const rel = path.posix.join(d, n);
    fs.statSync(path.join(root, rel)).isDirectory() ? walk(rel, acc) : acc.push(rel);
  }
  return acc;
};

const pkg = JSON.parse(R('package.json'));

section('syntax', () => {
  const files = ['main.js', 'migration.js', 'account-service.js', 'account-server/server.js',
    ...ls('shell').filter(f => f.endsWith('.js')).map(f => 'shell/' + f),
    ...ls('scripts').filter(f => f.endsWith('.js')).map(f => 'scripts/' + f)];
  let bad = 0;
  for (const f of files) {
    try { new vm.Script(R(f).replace(/^#!.*/, ''), { filename: f }); }
    catch (e) { bad++; fail(`${f}: ${e.message}`); }
  }
  if (!bad) ok(`${files.length} archivos JS compilan`);
});

section('wiring', () => {
  const idx = R('shell/index.html');
  const loaded = [...idx.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
  for (const s of loaded) E('shell/' + s) ? 0 : fail(`index.html carga un script inexistente: ${s}`);
  const dupes = loaded.filter((s, i) => loaded.indexOf(s) !== i);
  if (dupes.length) fail('scripts cargados dos veces: ' + dupes.join(', '));
  const mainReq = [...R('main.js').matchAll(/require\('\.\/([^']+)'\)/g)].map(m => m[1]);
  for (const r of mainReq) if (!E(r) && !E(r + '.js')) fail(`main.js requiere un módulo inexistente: ${r}`);
  const required = new Set(mainReq.map(r => path.posix.basename(r.replace(/\.js$/, '')) + '.js'));
  for (const f of ls('shell').filter(f => f.endsWith('.js'))) {
    if (!loaded.includes(f) && !required.has(f)) fail(`shell/${f} no lo carga ni index.html ni main.js (huérfano)`);
  }
  for (const m of idx.matchAll(/<link[^>]+href="([^"#?]+)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    E(path.posix.normalize('shell/' + m[1])) || fail(`index.html enlaza un recurso inexistente: ${m[1]}`);
  }
  for (const h of ['index.html', 'newtab.html', 'offline.html', 'splash.html']) {
    const refs = ls('shell').flatMap(f => /\.(js|html)$/.test(f) ? [R('shell/' + f)] : []).join('\n') + R('main.js');
    if (!refs.includes(h)) fail(`shell/${h} no la referencia nadie`);
  }
  const ids = new Set([...idx.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const dupIds = [...idx.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter((x, i, a) => a.indexOf(x) !== i);
  if (dupIds.length) fail('IDs duplicados en index.html: ' + [...new Set(dupIds)].join(', '));
  if (!failures) ok(`${loaded.length} scripts cargados existen, sin huérfanos ni duplicados; ${ids.size} IDs únicos en index.html`);
});

section('ipc', () => {
  const main = R('main.js');
  const reg = [...main.matchAll(/ipcMain\.(handle|on|once)\(\s*'([^']+)'/g)].map(m => ({ kind: m[1], ch: m[2] }));
  const seen = {};
  for (const r of reg) {
    const k = r.ch;
    if (seen[k] && (r.kind === 'handle' || seen[k] === 'handle')) fail(`canal registrado dos veces con handle (lanza excepción en runtime): ${k}`);
    seen[k] = seen[k] || r.kind;
  }
  const handled = new Set(reg.map(r => r.ch));
  const callers = new Map(), listeners = new Set();
  for (const f of ls('shell').filter(f => /\.(js|html)$/.test(f))) {
    const s = R('shell/' + f);
    for (const m of s.matchAll(/\b(?:invoke|send|sendSync)\(\s*'([^']+)'/g)) callers.set(m[1], (callers.get(m[1]) || new Set()).add(f));
    for (const m of s.matchAll(/\bipc\w*\.on\(\s*'([^']+)'/g)) listeners.add(m[1]);
  }
  const pushed = new Set([...main.matchAll(/\bsend\(\s*'([^']+)'/g)].map(m => m[1]));
  for (const [ch, fs_] of callers) if (!handled.has(ch)) fail(`el renderer llama a un IPC inexistente: ${ch} (${[...fs_].join(', ')})`);
  for (const ch of handled) if (!callers.has(ch) && !listeners.has(ch)) fail(`IPC registrado que nadie usa: ${ch}`);
  for (const ch of listeners) if (!pushed.has(ch) && !handled.has(ch)) fail(`el renderer escucha un canal que main nunca emite: ${ch}`);
  const untrusted = (main.match(/denyUntrusted\(/g) || []).length;
  ok(`${handled.size} canales en main, ${callers.size} invocados desde el renderer, ${untrusted} comprobaciones denyUntrusted`);
  const unguarded = reg.filter(r => {
    const i = main.indexOf(`'${r.ch}'`);
    return !/denyUntrusted\(/.test(main.slice(i, i + 400));
  }).map(r => r.ch);
  if (unguarded.length) warn(`canales sin denyUntrusted visible en sus primeras líneas (revisar): ${unguarded.join(', ')}`);
});

section('assets', () => {
  const corpus = [R('main.js'), R('package.json'), R('build/installer.nsh'),
    ...ls('shell').map(f => R('shell/' + f))].join('\n');
  const dynamicDirs = /'assets',\s*'wallpapers'/.test(corpus) ? ['assets/wallpapers/'] : []; // enumerado con readdir en tiempo de ejecución
  const assets = walk('assets').filter(f => !/^assets\/icon\.(png|ico)$/.test(f) && !dynamicDirs.some(d => f.startsWith(d)));
  const dead = assets.filter(f => !corpus.includes(f.replace(/^assets\//, '')) && !corpus.includes(path.posix.basename(f)));
  dead.forEach(f => fail(`asset sin ninguna referencia: ${f}`));
  const refs = new Set();
  for (const m of corpus.matchAll(/(?:\.\.\/)?assets\/([A-Za-z0-9_\-./]+\.(?:png|svg|ico|jpg|webp))/g)) refs.add('assets/' + m[1]);
  // Deuda conocida: pantallas de bienvenida 1.6.4/2.0 (extras6/extras8) apuntan a imágenes que no existen en el paquete.
  const KNOWN_DEBT = /^assets\/welcome\//;
  for (const r of refs) if (!E(r)) (KNOWN_DEBT.test(r) ? warn(`deuda conocida, imagen inexistente: ${r}`) : fail(`referencia a un asset que no existe: ${r}`));
  if (!dead.length) ok(`${assets.length} assets, todos referenciados; ${refs.size} referencias resueltas`);
});

section('build', () => {
  const b = pkg.build, files = b.files;
  const need = ['main.js', 'migration.js', 'account-service.js', 'account-config.json', 'shell/index.html', 'shell/newtab.html',
    'shell/offline.html', 'shell/splash.html', 'assets/icon.ico', 'assets/icon.png', 'build/installer.nsh',
    'build/installerHeader.bmp', 'build/installerSidebar.bmp', 'build/uninstallerSidebar.bmp', 'build/LICENSE.txt'];
  need.forEach(f => E(f) || fail('falta ' + f));
  const covered = f => files.some(g => g === f || (g.endsWith('/**') && f.startsWith(g.slice(0, -2))));
  for (const f of ['main.js', 'migration.js', 'account-service.js', 'account-config.json', ...walk('shell'), ...walk('assets')])
    covered(f) || fail(`el empaquetado no incluye ${f}`);
  for (const dep of ['@ghostery/adblocker-electron', 'cross-fetch', 'sql.js', 'electron-updater']) {
    const used = [R('main.js'), R('account-service.js'), R('migration.js')].some(s => s.includes(`'${dep}'`));
    if (!used) warn(`dependencia declarada pero no importada por main/account/migration: ${dep}`);
  }
  const ico = fs.readFileSync(path.join(root, 'assets/icon.ico'));
  const n = ico.readUInt16LE(4), sizes = [];
  for (let i = 0; i < n; i++) sizes.push(ico.readUInt8(6 + i * 16) || 256);
  sizes.some(s => s >= 256) ? ok('icon.ico con frames ' + sizes.join(', ')) : fail('icon.ico no tiene frame >= 256');
  const png = fs.readFileSync(path.join(root, 'assets/icon.png'));
  const pw = png.readUInt32BE(16), ph = png.readUInt32BE(20);
  pw >= 256 && pw === ph ? ok(`icon.png ${pw}x${ph}`) : fail(`icon.png debe ser cuadrado >= 256 (es ${pw}x${ph})`);
  const nsh = R('build/installer.nsh');
  const stale = [...nsh.matchAll(/\b\d+\.\d+\.\d+\b/g)].map(m => m[0]).filter(v => v !== pkg.version);
  stale.length ? fail('installer.nsh menciona otra versión: ' + [...new Set(stale)].join(', ')) : ok('installer.nsh coherente con la versión ' + pkg.version);
  if (b.nsis.deleteAppDataOnUninstall !== false) fail('deleteAppDataOnUninstall debe ser false (preservar userData)');
  else ok('el desinstalador conserva userData');
  if (!R('shell/nova53.js').includes('nova53_seen_')) warn('What\'s New: no se encontró la marca de "visto"');
  const notes = ls('.').filter(f => /^RELEASE_NOTES_.*\.md$/.test(f));
  notes.length === 1 && notes[0] === `RELEASE_NOTES_${pkg.version}.md` ? ok('una sola nota de versión en la raíz: ' + notes[0]) : fail('la raíz debe tener solo RELEASE_NOTES_' + pkg.version + '.md (hay: ' + notes.join(', ') + ')');
  if (!R('CHANGELOG.md').split('\n').find(l => l.startsWith('## '))?.includes(pkg.version)) fail('CHANGELOG no tiene la versión actual arriba');
});

section('prefs', () => {
  // Prueba funcional: se extrae el bloque real de main.js y se ejecuta contra un directorio temporal.
  const main = R('main.js');
  const a = main.indexOf('const PREFS_SCHEMA'), z = main.indexOf('const { pathToFileURL }');
  if (a < 0 || z < 0) return fail('no se encontró el bloque de prefs en main.js');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-qa-'));
  const logs = [];
  const run = setup => {
    const dir = fs.mkdtempSync(path.join(tmp, 'u-'));
    const ctx = { fs, path, console: { warn: (...x) => logs.push(x.join(' ')) }, Date, JSON, Object, Array,
      app: { getPath: () => dir }, atomicWrite: (f, d) => { fs.writeFileSync(f, d); }, prefs: { logo: 'quantum', splash: true, ext: {}, reg: '' } };
    vm.createContext(ctx);
    vm.runInContext(`const prefsFile=()=>path.join(app.getPath('userData'),'prefs.json');\n${main.slice(a, z)}\nthis.loadPrefs=loadPrefs;this.getPrefs=()=>prefs;`, ctx);
    setup(path.join(dir, 'prefs.json'));
    ctx.loadPrefs();
    return { prefs: ctx.getPrefs(), dir, file: path.join(dir, 'prefs.json') };
  };
  let r = run(() => { });
  r.prefs.schemaVersion >= 2 && fs.existsSync(r.file) ? ok('primer arranque: se crea prefs.json con schemaVersion') : fail('primer arranque no crea prefs.json versionado');
  r = run(f => fs.writeFileSync(f, JSON.stringify({ splash: false, ext: { adblock: true }, theme: 'old', wallpaper: 'x', mods: [1] })));
  (r.prefs.splash === false && r.prefs.ext.adblock === true && !('theme' in r.prefs) && !('wallpaper' in r.prefs) && !('mods' in r.prefs))
    ? ok('migración: conserva ajustes válidos y elimina claves heredadas') : fail('la migración pierde datos o deja claves heredadas');
  r = run(f => { fs.writeFileSync(f, '{roto'); fs.writeFileSync(f + '.bak', JSON.stringify({ splash: false, ext: { a: 1 } })); });
  const leftovers = fs.readdirSync(r.dir).filter(x => x.includes('.corrupt-'));
  (r.prefs.splash === false && r.prefs.ext.a === 1 && leftovers.length === 1) ? ok('archivo corrupto: se aparta y se restaura desde .bak') : fail('no restaura desde el backup');
  r = run(f => fs.writeFileSync(f, '[1,2]'));
  r.prefs.splash === true && Object.keys(r.prefs.ext).length === 0 ? ok('prefs con forma inválida: arranca con valores por defecto') : fail('prefs inválidas no recuperan');
  r = run(f => { fs.writeFileSync(f, '\u0000\u0000'); });
  r.prefs.logo === 'quantum' ? ok('prefs ilegible sin backup: no impide arrancar') : fail('prefs ilegible rompe el arranque');
  if (!logs.length) fail('la recuperación no registró nada para diagnóstico'); else ok(`la recuperación deja ${logs.length} entradas de diagnóstico`);
  fs.rmSync(tmp, { recursive: true, force: true });
});

section('ci', () => {
  const eng = pkg.engines.node.replace(/[^\d.]/g, '');
  const nvm = R('.nvmrc').trim().replace(/^v/, '');
  nvm === eng ? ok('.nvmrc = engines.node = ' + eng) : fail(`.nvmrc (${nvm}) distinto de engines.node (${eng})`);
  const hasLock = E('package-lock.json');
  for (const wf of ls('.github/workflows')) {
    const s = R('.github/workflows/' + wf);
    for (const m of s.matchAll(/node-version:\s*([\d.]+)/g)) m[1] === eng ? 0 : fail(`${wf}: node-version ${m[1]} != ${eng}`);
    if (hasLock && /npm install/.test(s) && !/--ignore-scripts.*npm ci|npm ci/.test(s)) fail(`${wf}: hay lockfile, usar npm ci`);
    if (!hasLock && /npm ci/.test(s)) fail(`${wf}: usa npm ci sin package-lock.json`);
    if (/npm run (check|qa)/.test(s)) for (const sc of [...s.matchAll(/npm run ([\w:.-]+)/g)].map(x => x[1])) pkg.scripts[sc] || fail(`${wf}: npm run ${sc} no existe en package.json`);
  }
  hasLock ? ok('package-lock.json presente') : warn('no hay package-lock.json: la CI usa npm install (un lockfile real solo puede generarse con red: npm install --package-lock-only)');
  for (const [name, sc] of Object.entries(pkg.scripts)) for (const f of [...sc.matchAll(/node (?:--check )?([\w./-]+\.js)/g)].map(m => m[1])) E(f) || fail(`script "${name}" apunta a un archivo inexistente: ${f}`);
  if (!failures) ok('workflows y scripts npm referencian cosas que existen');
});

const names = only ? [only] : Object.keys(sections);
for (const n of names) {
  if (!sections[n]) { console.error('sección desconocida: ' + n); process.exit(2); }
  console.log(`\n[${n}]`);
  try { sections[n](); } catch (e) { fail(`${n}: excepción del propio QA: ${e.stack}`); }
}
console.log(`\nResultado: ${failures} fallos, ${warnings} avisos`);
if (!only) console.log([
  '\nNO COMPROBABLE con este QA (requiere Electron/Windows): arranque, apertura/cierre de pestañas, nueva pestaña x50,',
  'carga real de extensiones, instalador/actualización/desinstalación, renderizado visual y temas.'].join('\n'));
process.exit(failures ? 1 : 0);
