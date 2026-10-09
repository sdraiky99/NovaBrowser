'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const ok = message => console.log('OK', message);
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const pkg = JSON.parse(read('package.json'));

assert.strictEqual(pkg.version, '5.5.0'); ok('versión 5.5.0 coherente');
assert.ok(pkg.build.files.includes('shell/**'), 'el empaquetado debe incluir todos los archivos shell');
assert.ok(pkg.build.nsis.uninstallDisplayName.includes('5.5.0')); ok('configuración de empaquetado');

const allFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file); else allFiles.push(path.relative(root, file));
  }
})(root);
assert.ok(allFiles.length < 100, `se esperaba menos de 100 archivos; hay ${allFiles.length}`);
ok(`inventario: ${allFiles.length} archivos; sin eliminación masiva`);

const notes = allFiles.filter(f => /^RELEASE_NOTES_.*\.md$/i.test(path.basename(f)) && path.dirname(f) === '.');
assert.deepStrictEqual(notes, ['RELEASE_NOTES_5.5.0.md']);
assert.ok(fs.existsSync(path.join(root, 'docs/history/5.4.1.md')), 'conservar las notas previas');
assert.ok(fs.existsSync(path.join(root, 'docs/history/auditoria-archivos-5.5.0.md')), 'debe conservarse la auditoría de archivos');
ok('notas actuales separadas e historial anterior conservado');

const main = read('main.js');
const renderer = read('shell/nova.js');
const newTab = read('shell/newtab.html');
const preload = read('shell/newtab-preload.js');
const inlineScripts = [...newTab.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
assert.ok(inlineScripts.length > 0, 'debe existir el script de nueva pestaña');
inlineScripts.forEach((script, index) => new vm.Script(script, { filename: `newtab-inline-${index + 1}.js` }));
ok('script inline de nueva pestaña compila sin errores');
assert.ok(main.includes("wp.nodeIntegration = false;"));
assert.ok(main.includes("wp.contextIsolation = true;"));
assert.ok(main.includes("wp.sandbox = true;"));
assert.ok(main.includes("adblock: true"), 'bloqueador habilitado por defecto');
assert.ok(main.includes('setAdblock(prefs.adblock !== false)'), 'se restaura el bloqueador al arrancar');
assert.ok(main.includes('prefs.adblock = on; savePrefs();'), 'el ajuste del bloqueador debe persistir');
assert.ok(main.includes('if (blockOn === on) return true;'), 'el handler del bloqueador debe devolver éxito en estado estable');
assert.ok(main.includes("wp.preload = path.join(__dirname, 'shell', 'newtab-preload.js')"));
assert.ok(main.includes('isTrustedNewTabContents(e.sender)'));
assert.ok(!/require\(['"]electron['"]\)/.test(newTab), 'la página nueva no debe solicitar Electron directamente');
assert.ok(preload.includes("sendToHost('nova-newtab-action', payload)"));
assert.ok(preload.includes("ipcRenderer.invoke('news-feed'"));
assert.ok(renderer.includes("event.channel !== 'nova-newtab-action'"));
assert.ok(renderer.includes('function syncTabFromWeb(t)'));
assert.ok(renderer.includes('resolveNavigation(v, state.search)'));
ok('puente limitado de nueva pestaña, control de navegación, historial por pestaña y privacidad persistente');

const { resolveNavigation } = require('../shell/navigation.js');
const cases = [
  ['https://example.com/a', 'https://example.com/a'],
  ['example.com', 'https://example.com/'],
  ['example.com:8443/docs?q=test', 'https://example.com:8443/docs?q=test'],
  ['localhost:3000', 'http://localhost:3000/'],
  ['127.0.0.1:8080/path', 'http://127.0.0.1:8080/path'],
  ['[::1]:5173', 'http://[::1]:5173/'],
  ['hola mundo', 'https://www.google.com/search?q=hola%20mundo'],
  ['javascript:alert(1)', 'https://www.google.com/search?q=javascript%3Aalert(1)'],
  ['', '']
];
for (const [input, expected] of cases) assert.strictEqual(resolveNavigation(input), expected, `navegación: ${input}`);
assert.strictEqual(resolveNavigation('privado', 'https://duckduckgo.com/?q='), 'https://duckduckgo.com/?q=privado');
assert.ok(resolveNavigation('privado', 'javascript:alert(1)').startsWith('https://www.google.com/search?q='));
ok(`${cases.length + 2} pruebas de navegación resueltas`);

for (const rel of ['shell/index.html', 'shell/newtab.html', 'shell/newtab-preload.js', 'shell/navigation.js', 'shell/nova.js', 'shell/nova.css', 'main.js', 'build/installer.nsh']) assert.ok(fs.existsSync(path.join(root, rel)), `falta ${rel}`);
assert.ok(read('build/installer.nsh').includes('5.5.0'));
assert.ok(read('README.md').includes('5.5.0'));
assert.ok(read('CHANGELOG.md').includes('5.5.0'));
ok('archivos esenciales y metadatos presentes');

console.log(JSON.stringify({ ok: true, version: pkg.version, files: allFiles.length, navigationCases: cases.length + 2 }, null, 2));
