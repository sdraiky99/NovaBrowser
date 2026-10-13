'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const ok = message => console.log('OK', message);
const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.version, '5.5.3');
assert.ok(pkg.engines.node && /22\.12\.0/.test(pkg.engines.node));
assert.ok(pkg.build.files.includes('shell/**') && pkg.build.files.includes('assets/**'));
assert.equal(pkg.build.nsis.uninstallDisplayName, 'Nova Browser 5.5.3');
assert.ok(read('build/installer.nsh').includes('5.5.3'));
assert.ok(read('shell/splash.html').includes('5.5.3'));
assert.ok(read('README.md').includes('5.5.3'));
assert.ok(read('CHANGELOG.md').includes('5.5.3'));
assert.ok(read('RELEASE_NOTES_5.5.3.md').includes('5.5.3'));
ok('versión 5.5.3 consistente en package, instalador, splash y documentación');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full); else files.push(path.relative(root, full));
  }
})(root);
assert.ok(files.length < 100, `inventario ${files.length} supera la meta acordada`);
assert.ok(files.includes('docs/history/RELEASE_NOTES_5.5.2.md'));
assert.ok(files.includes('docs/history/qa-5.5.2.js'));
assert.deepEqual(files.filter(f => /^RELEASE_NOTES_.*\.md$/i.test(path.basename(f)) && path.dirname(f) === '.').sort(), ['RELEASE_NOTES_5.5.3.md']);
for (const f of ['main.js','shell/index.html','shell/newtab.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js','scripts/check-syntax-all.js','scripts/qa-5.5.3.js','assets/brand/nova.ico','assets/brand/nova-icon.png']) assert.ok(fs.existsSync(path.join(root, f)), `falta ${f}`);
ok(`inventario y nombres: ${files.length} archivos; historial 5.5.2 conservado`);

const main = read('main.js');
const renderer = read('shell/nova.js');
const home = read('shell/newtab.html');
const preload = read('shell/newtab-preload.js');
const css = read('shell/nova.css');
const index = read('shell/index.html');
// Regression: source must be set before append so will-attach-webview sees it.
const createBody = renderer.slice(renderer.indexOf('function createTab(url)'), renderer.indexOf('\nfunction newTab(url)'));
assert.ok(createBody.indexOf("t.wv.setAttribute('src', target)") >= 0);
assert.ok(createBody.indexOf("t.wv.setAttribute('src', target)") < createBody.indexOf("$('#views').appendChild(t.wv)"));
assert.ok(main.includes("if (isNewTabFileUrl(params.src || '')) wp.preload = path.join(__dirname, 'shell', 'newtab-preload.js')"));
assert.ok(preload.includes("ipcRenderer.sendToHost('nova-newtab-action', payload)"));
assert.ok(home.includes("addEventListener('submit'"));
assert.ok(renderer.includes("$('#address').onkeydown=e=>{if(e.key==='Enter')"));
assert.ok(renderer.includes("if (action.type === 'navigate'"));
ok('preload confiable y eventos de búsqueda conectados en la primera carga');

// Execute the limited preload bridge with a test Electron shim.
const outbound = [];
let exposed = null;
const electronShim = {
  contextBridge: { exposeInMainWorld(name, api) { assert.equal(name, 'novaNewTab'); exposed = api; } },
  ipcRenderer: { sendToHost(channel, payload) { outbound.push({ channel, payload }); }, invoke: async () => ({ items: [] }) }
};
const preloadSandbox = {
  require(name) { assert.equal(name, 'electron'); return electronShim; },
  location: { href: 'file:///tmp/Nova/shell/newtab.html?state=%7B%7D' },
  URL, Object, String, Array, JSON, encodeURIComponent, console
};
vm.runInNewContext(preload, preloadSandbox, { filename: 'newtab-preload.js' });
assert.ok(exposed, 'puente de nueva pestaña expuesto');
exposed.navigate('hola mundo'); exposed.openTour(); exposed.openCommand(); exposed.openWhatsNew();
assert.deepEqual(outbound.map(x => x.payload.type), ['navigate','open-tour','open-command','open-whats-new']);
assert.equal(outbound[0].channel, 'nova-newtab-action');
assert.equal(outbound[0].payload.value, 'hola mundo');
exposed.navigate('x'.repeat(2049));
assert.equal(outbound.length, 4, 'payload demasiado largo bloqueado');
ok('bridge IPC de la nueva pestaña probado con simulación');

// Navigation resolution tests.
const { resolveNavigation, DEFAULT_SEARCH } = require('../shell/navigation.js');
const navCases = [
  ['https://example.com/a','https://example.com/a'],
  ['http://example.com','http://example.com/'],
  ['example.com','https://example.com/'],
  ['example.com:8443/docs?q=test','https://example.com:8443/docs?q=test'],
  ['localhost:3000','http://localhost:3000/'],
  ['127.0.0.1:8080/path','http://127.0.0.1:8080/path'],
  ['[::1]:5173','http://[::1]:5173/'],
  ['hola mundo','https://www.google.com/search?q=hola%20mundo'],
  ['buscar gato y perro','https://www.google.com/search?q=buscar%20gato%20y%20perro'],
  ['javascript:alert(1)','https://www.google.com/search?q=javascript%3Aalert(1)'],
  ['', '']
];
for (const [input, expected] of navCases) assert.equal(resolveNavigation(input), expected, `resolveNavigation(${input})`);
assert.equal(resolveNavigation('privado','https://duckduckgo.com/?q='),'https://duckduckgo.com/?q=privado');
assert.equal(resolveNavigation('privado','https://www.bing.com/search?q='),'https://www.bing.com/search?q=privado');
assert.equal(resolveNavigation('privado','not-a-provider'), `${DEFAULT_SEARCH}privado`);
assert.equal(resolveNavigation('file:///tmp/test.html'),'file:///tmp/test.html');
ok(`${navCases.length + 3} casos de URL/búsqueda y proveedor`);

// Accent preference must survive dark mode and new-tab reloads.
assert.ok(renderer.includes("setProperty('--user-accent', accent)"));
assert.ok(css.includes('--accent:var(--user-accent)') && css.includes('body.dark{--active:color-mix(in srgb,var(--user-accent)'));
assert.ok(home.includes("setProperty('--user-accent',state.accent)"));
assert.ok(renderer.includes('const ACCENT_COLORS = [') && renderer.includes('const colors = ACCENT_COLORS'));
assert.ok(!renderer.includes("querySelector('.accent-dot').style.background=state.accent"));
assert.ok(renderer.includes('function applyAppearance()') && renderer.includes('applyToolbarWallpaper()'));
assert.ok(renderer.includes("$('#appearance').onchange") && renderer.includes("$('#search').onchange") && renderer.includes('data-accent'));
ok('color de acento, modo oscuro y ajustes enlazados');

// Window and plus buttons: dimensions, alignment and actual event bindings.
assert.ok(index.includes('id="newTab"') && renderer.includes("$('#newTab').onclick=()=>newTab()"));
assert.ok(index.includes('data-window="min"') && index.includes('data-window="max"') && index.includes('data-window="close"'));
assert.ok(renderer.includes("ipc.send('win',a)"));
assert.ok(css.includes('#windowbar{height:44px;padding:0 0 0 8px'));
assert.ok(css.includes('.window-btn{width:46px;height:100%;min-height:44px'));
assert.ok(css.includes('#newTab{display:grid;place-items:center'));
assert.ok(renderer.includes('function selectTab(t)') && renderer.includes('function setInternal(view)'));
ok('controles de ventana, botón +, capas y acciones de navegación enlazados');

// Settings and primary actions must have working handler code.
for (const token of ["$('#back').onclick", "$('#forward').onclick", "$('#reload').onclick", "$('#star').onclick", "$('#menuButton').onclick", "$('#accentButton').onclick", "$('#address').onkeydown", "b.onclick=()=>setInternal(b.dataset.view)", "$('#sideToggle').onclick", "$('#animToggle').onclick", "r.querySelector('#pickWallpaper').onclick", "r.querySelector('#resetWallpaper').onclick", "$('#adblockToggle').onclick", "$('#defaultBrowser').onclick", "$('#update').onclick"]) assert.ok(renderer.includes(token), `falta manejador ${token}`);
for (const token of ['history','favorites','downloads','extensions','performance','settings','workspaces']) assert.ok(renderer.includes(`view==='${token}'`) || renderer.includes(`['${token[0].toUpperCase()+token.slice(1)}`), `falta vista ${token}`);
ok('regresión estática de botones y secciones principales');

// Extension support and non-misleading store UI.
assert.ok(main.includes('ses.loadExtension(extPath,{allowFileAccess:true})'));
assert.ok(main.includes("[2, 3].includes(Number(manifest.manifest_version))"));
assert.ok(renderer.includes('Ver ficha oficial'));
assert.ok(renderer.includes('instalación directa desde Chrome Web Store está reservada a Chrome'));
assert.ok(renderer.includes("id=\"loadRealExt\""));
assert.ok(renderer.includes("ipc.invoke('extension-pick-load'"));
assert.ok(main.includes("ipcMain.handle('extension-pick-load'"));
ok('gestor de extensiones local con validación y limitación de Web Store declarada');

// Inline new-tab code must parse; CSP and bridge names must agree.
const inline = [...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
assert.ok(inline.length > 0); inline.forEach((s,i) => new vm.Script(s, { filename: `newtab-inline-${i+1}.js` }));
assert.ok(home.includes("id=\"search\"") && home.includes("id=\"q\""));
assert.ok(home.includes('nova?.navigate'));
assert.ok(index.includes('<script src="nova.js"></script>'));
assert.ok(index.includes('id="address"'));
// Execute the actual new-tab script in a small DOM/bridge simulation and submit a search.
const elementMap = new Map();
const element = id => {
  if (!elementMap.has(id)) elementMap.set(id, {
    id, value:'', innerHTML:'', textContent:'', style:{setProperty(){},removeProperty(){}},
    classList:{toggle(){},add(){},remove(){}}, events:{},
    addEventListener(type,fn){this.events[type]=fn;},
    setAttribute(){}, querySelectorAll(){return []}, focus(){},
  });
  return elementMap.get(id);
};
let submittedSearch = '';
const homeBridge = {
  navigate(value){submittedSearch=value;},
  openTour(){}, openCommand(){}, openWhatsNew(){},
  async newsFeed(){return {items:[],live:false,stale:false,sources:[]};}
};
const homeSandbox = {
  window:{novaNewTab:homeBridge},
  document:{
    body:{classList:{toggle(){}}},
    documentElement:{style:{setProperty(){}}},
    getElementById:element,
    querySelectorAll(){return [];},
    querySelector(){return null;}
  },
  location:{search:'?state='+encodeURIComponent(JSON.stringify({appearance:'dark',accent:'#6f55df',bookmarks:[]}))},
  URL, URLSearchParams, Date, Promise, String, Array, Object, JSON, Math, console,
  matchMedia(){return {matches:true,addEventListener(){}};}
};
vm.runInNewContext(inline[0],homeSandbox,{filename:'newtab-runtime-test.js'});
element('q').value='hola mundo';
assert.equal(typeof element('search').events.submit,'function','form submit handler installed');
let prevented=false;
element('search').events.submit({preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(submittedSearch,'hola mundo','submit forwards the query through the Nova bridge');
ok('runtime simulado del formulario: Enter/Buscar envía la consulta al puente');

// Asset integrity and version/source scans.
const png = fs.readFileSync(path.join(root,'assets/brand/nova-icon.png'));
assert.ok(png.length > 1024 && png.toString('ascii',1,4)==='PNG' && png[25]===6, 'PNG RGBA');
assert.ok(read('build/installer.nsh').includes('5.5.3'));
assert.ok(read('shell/newtab.html').includes('Nova 5.5.3 · Reliability & UI Fix'));
assert.ok(!read('shell/newtab.html').includes('Nova 5.5.2 · Next-Gen'));
const currentSources = ['main.js','package.json','shell/index.html','shell/newtab.html','shell/newtab-preload.js','shell/navigation.js','shell/nova.js','shell/nova.css','shell/extensions.js','README.md','build/installer.nsh'];
for (const rel of currentSources) {
  const s=read(rel);
  assert.ok(!/Nova 1\.1\.0|Nova 2\.3|Nova 4\.4|Cyberpunk 2077|Extension Centre 53|Manager 44/.test(s), `texto heredado en ${rel}`);
}
ok('assets transparentes, nombre de versión y limpieza de referencias antiguas');

console.log(JSON.stringify({ok:true,version:pkg.version,files:files.length,navigationCases:navCases.length+3,preloadBridge:'simulated',checks:'all'},null,2));
