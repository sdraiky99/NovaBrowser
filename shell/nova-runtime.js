/* Nova 5.3.2 Quantum Runtime Bundle. Original renderer modules preserved in runtime order. */

/* ---- extras.js ---- */
/* Nova 1.1.0 - extras: páginas internas, fondos reales, ajustes, onboarding */
(() => {
const { shell } = require('electron');
/* Legacy theme registration disabled in Quantum 5.1. */
Object.assign(SECS, { espacio: 'Espacio', naturaleza: 'Naturaleza', ciudad: 'Ciudad' });
Object.assign(P, {
  menu: 'M4 6h16M4 12h16M4 18h16', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  dl: 'M12 4v11M7 11l5 5 5-5M5 20h14', note: 'M6 3h9l4 4v14H6zM9 12h7M9 16h7',
  game: 'M3 9h18v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM8 12v4M6 14h4', info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18'
});
S.hist = S.hist || []; S.dls = S.dls || []; S.notes = S.notes || ''; S.blocked = S.blocked || 0;
const VERSION = NOVA_VER;

/* ---------- estilos ---------- */
const st = document.createElement('style');
st.textContent = `
.ipage{position:absolute;inset:0;display:none;overflow:auto;padding:32px min(8vw,90px);background:var(--bg);color:var(--fg);flex-direction:column;gap:12px}.ipage.on{display:flex}
.ipage h2{margin:0 0 6px;font-size:26px;font-weight:300}
.li{display:flex;justify-content:space-between;gap:10px;padding:9px 12px;background:var(--bar);border:1px solid var(--bd);border-radius:var(--r);cursor:pointer}.li:hover{border-color:var(--acc)}
.li span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ob .obcard{width:min(600px,94vw);animation:obin .35s cubic-bezier(.2,1.2,.4,1)}@keyframes obin{from{opacity:0;transform:translateY(14px) scale(.96)}}
.dots{display:flex;gap:6px;justify-content:center}.dots i{width:22px;height:4px;border-radius:4px;background:var(--bd);transition:background .3s,width .3s}.dots i.on{background:var(--acc);width:34px}
.obb{display:flex;flex-direction:column;gap:14px;min-height:250px;justify-content:center;animation:tin .3s}.obh{margin:0;text-align:center;font-weight:300;font-size:30px}.obc{text-align:center;font-size:14px;line-height:1.5}
.obl{align-self:center;animation:oblf 3s ease-in-out infinite}@keyframes oblf{50%{transform:translateY(-6px) scale(1.04)}}
.okc{align-self:center}.okc circle{stroke-dasharray:151;stroke-dashoffset:151;animation:okd .7s .1s forwards}.okc path{stroke-dasharray:50;stroke-dashoffset:50;animation:okd .5s .7s forwards}@keyframes okd{to{stroke-dashoffset:0}}
.cmh{position:fixed;inset:0;z-index:40;pointer-events:none}.cm.hole{position:fixed;z-index:41;border-radius:12px;box-shadow:0 0 0 9999px rgba(5,4,15,.72),0 0 0 2px var(--acc),0 0 22px var(--acc);transition:all .35s cubic-bezier(.2,1,.3,1);pointer-events:none}
.cm.tip{position:fixed;z-index:42;padding:16px 18px;display:flex;flex-direction:column;gap:8px;background:var(--bar);color:var(--fg);border:1px solid var(--acc);border-radius:calc(var(--r) * 1.4);box-shadow:0 16px 60px #000a;animation:pop .25s cubic-bezier(.2,1.3,.4,1)}.cm.tip p{margin:0;font-size:13px;line-height:1.5}.cm.tip b{font-size:16px}
.ov{position:fixed;inset:0;z-index:20;background:#000b;display:grid;place-items:center;animation:tin .3s}
.card{width:min(540px,92vw);max-height:90vh;overflow:auto;padding:28px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r) * 1.6);display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 80px #000a}
#mnp{position:fixed;top:78px;right:10px;z-index:15;min-width:220px;padding:6px;background:var(--bar);border:1px solid var(--bd);border-radius:var(--r);display:none;flex-direction:column;box-shadow:0 10px 40px #0008}#mnp.on{display:flex}
#mnp button{text-align:left;padding:8px 12px;background:none;border:0;cursor:pointer;border-radius:var(--r)}#mnp button:hover{background:color-mix(in srgb,var(--acc) 22%,transparent)}
#bl{display:flex;align-items:center;gap:4px;padding:0 8px;color:var(--acc2);font-size:12px;white-space:nowrap}#bl svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.8}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chips .btn{padding:4px 10px;font-size:12px}
.pb{height:4px;background:var(--bd);border-radius:4px;overflow:hidden;flex:1}.pb i{display:block;height:100%;background:var(--acc)}
.t-neon #top,.t-neon #bar{box-shadow:0 0 18px #ff2bd644}.t-neon .tab.on{box-shadow:0 0 12px var(--acc);border-color:var(--acc)}.t-neon #addr:focus{box-shadow:0 0 14px var(--acc)}
.t-neon #brand,.t-neon h3,.t-neon h2{text-shadow:0 0 10px var(--acc)}.t-neon .ai svg{filter:drop-shadow(0 0 8px #ff2bd6)}
.t-win95 .ipage h2,.t-undertale .ipage h2,.t-code .ipage h2{font-weight:700}.t-win95 .card,.t-win95 .li{border-radius:0;box-shadow:inset -1px -1px #404040,inset 1px 1px #fff;border:0}
.t-undertale .card{border:4px solid #fff}
`;
document.head.appendChild(st);

/* ---------- helpers ---------- */
const toURL = v => { v = v.trim(); return /^https?:\/\//.test(v) ? v : /^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(v) || /^localhost/.test(v) ? 'https://' + v : S.search + encodeURIComponent(v); };
const fmt = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB';
const sw2 = (k, on) => `<div class="sw ${on ? 'on' : ''}" data-k="${k}"></div>`;
const themeGrid = () => Object.entries(THEMES).map(([k, n]) => `<div class="th ${S.theme === k ? 'on' : ''}" data-t="${k}" style="background:var(--bg)">${n}</div>`).join('');

/* ---------- estilo personalizado (acento, bordes, letra, sonidos) ---------- */
const baseAT = applyTheme;
applyTheme = function () {
  baseAT();
  const b = document.body.style;
  S.acc ? b.setProperty('--acc', S.acc) : b.removeProperty('--acc');
  S.r != null ? b.setProperty('--r', S.r + 'px') : b.removeProperty('--r');
  S.fs ? b.setProperty('--fs', S.fs + 'px') : b.removeProperty('--fs');
  const bl = $('#bl'); if (bl) bl.style.display = S.adblock ? 'flex' : 'none';
};
let ac;
document.addEventListener('click', () => {
  if (!S.sound) return; const f = { undertale: 520, win95: 300, code: 880 }[S.theme]; if (!f) return;
  try { ac = ac || new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(); o.type = S.theme === 'undertale' ? 'square' : 'triangle'; o.frequency.value = f; g.gain.value = .04; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .05); } catch { }
});

/* ---------- barra: escudo de anuncios + menú ---------- */
const bl = document.createElement('div'); bl.id = 'bl'; bl.title = 'Anuncios y rastreadores bloqueados'; bl.innerHTML = ic('shield') + '<b>' + S.blocked + '</b>';
$('#st').before(bl);
const mn = document.createElement('button'); mn.className = 'ib'; mn.id = 'mn'; mn.innerHTML = ic('menu'); $('#sh').after(mn);
const mp = document.createElement('div'); mp.id = 'mnp'; document.body.appendChild(mp);
const MENU = [['Nueva pestaña', () => newTab()], ['Historial (Ctrl+H)', () => newTab('nova://historial')], ['Descargas (Ctrl+J)', () => newTab('nova://descargas')], ['Notas', () => newTab('nova://notas')], ['Nova Snake (juego)', () => newTab('nova://juegos')], ['Ajustes', () => newTab('nova://ajustes')], ['Zoom +', () => zoom(.5)], ['Zoom −', () => zoom(-.5)], ['Acerca de Nova', () => newTab('nova://acerca')]];
mp.innerHTML = MENU.map((m, i) => `<button data-i="${i}">${m[0]}</button>`).join('');
mn.onclick = e => { e.stopPropagation(); mp.classList.toggle('on'); };
mp.onclick = e => { const b = e.target.closest('button'); if (b) { mp.classList.remove('on'); MENU[b.dataset.i][1](); } };
document.addEventListener('click', () => mp.classList.remove('on'));
const zoom = d => { try { const t = activeWebTab?.() || cur; if (!t?.wv?.setZoomLevel) return toast('Este contenido no permite cambiar el zoom'); t.wv.setZoomLevel((t.wv.getZoomLevel?.() || 0) + d); } catch { } };
let lastB = 0;
ipc.on('blocked', (_, n) => { S.blocked += n - lastB; lastB = n; save(); bl.querySelector('b').textContent = S.blocked.toLocaleString('es'); });
ipc.on('tab-health', (_, d) => { if (d?.type === 'unresponsive') toast('Una pestaña se ha quedado bloqueada; Nova la está recuperando.'); });
ipc.on('dl', (_, d) => { const i = S.dls.findIndex(x => x.id === d.id); i < 0 ? S.dls.unshift(d) : Object.assign(S.dls[i], d); S.dls = S.dls.slice(0, 100); if (d.state !== 'progressing') { save(); toast('Descarga: ' + d.name); } refreshPages('descargas'); });
const keyx = k => { if (k === 'h') newTab('nova://historial'); if (k === 'j') newTab('nova://descargas'); };
ipc.on('key', (_, k) => keyx(k));
document.addEventListener('keydown', e => { if (e.ctrlKey && 'hj'.includes(e.key)) { e.preventDefault(); keyx(e.key); } });

/* ---------- envolver funciones del navegador ---------- */
const baseNT = newTab;
newTab = function (u) {
  if (u && u.startsWith('nova://')) return internalTab(u);
  if (!u && S.home) u = toURL(S.home);
  if (!u && S.rand) { const all = Object.keys(SECS).flatMap(wallList); if (all.length) S.wp = all[Math.random() * all.length | 0]; }
  const t = baseNT(u);
  t.wv.addEventListener('did-navigate', e => {
    if (isNT(e.url) || e.url.startsWith('file:')) return;
    S.hist.unshift({ u: e.url, t: e.url, d: Date.now() }); S.hist = S.hist.slice(0, 500); save();
    try { NOVA.saveSession?.(); } catch {}
  });
  t.wv.addEventListener('page-title-updated', e => { const h = S.hist.find(x => x.u === t.wv.getURL()); if (h) h.t = e.title; });
  return t;
};
const baseGo = go;
go = function (v) {
  v = v.trim(); if (!v) return;
  if (v.startsWith('nova://')) return newTab(v);
  if (cur.wv.classList.contains('ipage')) return newTab(toURL(v));
  baseGo(v);
};
const baseDraw = draw;
draw = function () { baseDraw(); if (panel === 'walls') wallsPanel(); if (panel === 'set') renderSettings($('#pin')); };

/* ---------- pestañas internas ---------- */
function refreshPages(n) { document.querySelectorAll('.ipage').forEach(e => { if (e.dataset.p === n && e.classList.contains('on')) PG[n](e); }); }
const activeWebTab = () => {
  if (cur?.wv?.tagName === 'WEBVIEW' && !cur.wv.classList.contains('ipage')) return cur;
  for (let i = tabs.length - 1; i >= 0; i--) { const t = tabs[i]; if (t?.wv?.tagName === 'WEBVIEW' && !t.wv.classList.contains('ipage')) return t; }
  return null;
};
function internalTab(u) {
  const raw = String(u || '').replace(/^nova:\/\//i, '').split(/[/?#]/)[0].trim().toLowerCase();
  const localAliases = { settings:'ajustes', setting:'ajustes', preferences:'ajustes', preference:'ajustes', about:'acerca', privacy:'privacidad', history:'historial', downloads:'descargas', download:'descargas', notes:'notas', bookmarks:'marcadores', favorites:'marcadores', news:'novedades', welcome:'bienvenida', start:'bienvenida', performance:'rendimiento', security:'seguridad', migrate:'migrar', apps:'apps', panels:'panels', reading:'reading', readinglist:'reading', work:'workspaces', workspace:'workspaces', tabs:'pestanas', sessions:'sesiones', feedback:'mejoras', improvements:'mejoras', safari:'safari', islands:'islands', glance:'glance', focus:'focus', reader:'reader', collections:'collections', capture:'capture', writer:'writer', docs:'docs', study3:'study3', 'privacy-center':'privacidad2', privacy2:'privacidad2', performance2:'rendimiento2', downloads2:'descargas2', apps2:'apps', webapps:'apps', command:'acciones', 'command-center':'acciones', qr:'qr', backup:'backup', shortcuts:'shortcuts', send:'send', pip:'pip', mediahub:'media', webpanels:'panels' };
  const name = (typeof NOVA.resolveFeatureRoute === 'function' ? NOVA.resolveFeatureRoute(raw) : (localAliases[raw] || raw));
  if (!PG[name]) { try { toast('Ruta Nova no encontrada: ' + raw); } catch {} return null; }
  const old = tabs.find(t => t.wv.dataset && t.wv.dataset.p === name); if (old) { sel(old); PG[name](old.wv); return old; }
  const el = document.createElement('div'); el.className = 'ipage'; el.dataset.p = name;
  Object.assign(el, { getURL: () => 'nova://' + name, canGoBack: () => false, canGoForward: () => false, goBack() { }, goForward() { }, reload: () => PG[name](el), loadURL() { }, stopFindInPage() { }, findInPage() { } });
  $('#view').appendChild(el);
  const te = document.createElement('div'); te.className = 'tab';
  const T = { safari:'Safari Air', islands:'Nova Islands', glance:'Glance', focus:'Nova Focus', reader:'Nova Reader+', collections:'Colecciones', capture:'Web Capture', writer:'Nova Writer', docs:'Nova Docs', study3:'Nova Study 3', privacidad2:'Centro de privacidad', rendimiento2:'Centro de rendimiento', descargas2:'Download Hub', apps:'Nova Apps', mejoras:'Mejoras de Nova', workspaces:'Spaces', pestanas:'Gestor de pestañas', sesiones:'Sesiones', reading:'Reading List', qr:'Compartir con QR', media:'Media Hub', panels:'Web Panels', backup:'Backup & Restore', shortcuts:'Atajos', send:'Nova Send', pip:'Picture-in-Picture', novedades:'Novedades 3.0', bienvenida:'Bienvenida 3.0', historial: 'Historial', descargas: 'Descargas' , notas: 'Notas', juegos: 'Nova Snake', ajustes: 'Ajustes', acerca: 'Acerca de Nova', novedades: 'Novedades', marcadores: 'Marcadores', privacidad: 'Privacidad', personalizar: 'Personalizar', tienda: 'Tienda de extensiones', bienvenida: 'Bienvenida', migrar: 'Migrar navegador', rendimiento: 'Rendimiento y RAM', seguridad: 'Seguridad' }[name] || name;
  te.innerHTML = '<img src="../assets/icon.png"><span>' + T + '</span><button class="ib sm">' + ic('x') + '</button>';
  const t = { wv: el, el: te }; tabs.push(t); $('#tabs').appendChild(te);
  te.onmousedown = e => { if (e.button === 1) closeTab(t); };
  te.onclick = e => { if (e.target.closest('button')) closeTab(t); else sel(t); };
  sel(t); PG[name](el); return t;
}

/* ---------- ajustes (panel y página) ---------- */
function renderSettings(p) {
  p.innerHTML = `<h3>Apariencia</h3><div class="grid">${themeGrid()}</div>
  <div class="row"><span>Color de acento</span><input type="color" id="ac" value="${S.acc || '#8b5cf6'}"></div>
  <div class="row"><span>Bordes redondeados</span><input type="range" id="rr" min="0" max="22" value="${S.r ?? 10}"></div>
  <div class="row"><span>Tamaño de letra</span><input type="range" id="ff" min="11" max="18" value="${S.fs || 13}"></div>
  <button class="btn" id="ar">Restablecer apariencia</button>
  <h3>Navegador</h3>
  <span class="mut">Tu nombre (saludo en la página de inicio)</span><input class="fld" id="nm" value="${esc(S.name || '')}">
  <span class="mut">Buscador</span><select class="fld" id="se"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select>
  <span class="mut">Página de inicio (vacío = página Nova)</span><input class="fld" id="hm" placeholder="https://…" value="${esc(S.home || '')}">
  <div class="row"><span>Bloqueador de anuncios</span>${sw2('adblock', S.adblock)}</div>
  <div class="row"><span>Animaciones de la interfaz</span>${sw2('anim', S.anim)}</div>
  <div class="row"><span>Fondo aleatorio en cada pestaña</span>${sw2('rand', S.rand)}</div>
  <div class="row"><span>Sonidos del tema (Undertale, Win95, Código)</span>${sw2('sound', S.sound)}</div>
  <h3>Nova IA</h3><span class="mut">Clave API de Anthropic</span><input class="fld" id="ak" type="password" placeholder="${S.hasKey ? 'Clave guardada de forma segura' : 'sk-ant-…'}">
  <h3>Privacidad</h3><div class="row"><button class="btn" id="ch">Borrar historial</button><button class="btn" id="cc">Borrar cookies y caché</button></div>
  <button class="btn" id="rs">Restablecer todo Nova</button><span class="mut">Nova ${VERSION} · basado en Chromium ${process.versions.chrome}</span>`;
  const q = s => p.querySelector(s), ap = () => { save(); applyTheme(); };
  q('#se').value = S.search; q('#se').onchange = e => { S.search = e.target.value; save(); };
  q('#ac').oninput = e => { S.acc = e.target.value; ap(); refreshNT(); };
  q('#rr').oninput = e => { S.r = +e.target.value; ap(); }; q('#ff').oninput = e => { S.fs = +e.target.value; ap(); };
  q('#ar').onclick = () => { delete S.acc; delete S.r; delete S.fs; ap(); refreshNT(); renderSettings(p); };
  q('#nm').onchange = e => { S.name = e.target.value.trim(); save(); refreshNT(); }; q('#hm').onchange = e => { S.home = e.target.value.trim(); save(); };
  q('#ak').onchange = e => NOVA.setKey(e.target.value.trim());
  q('#ch').onclick = () => { S.hist = []; save(); toast('Historial borrado'); }; q('#cc').onclick = async () => { await ipc.invoke('clear'); toast('Cookies y caché borrados'); };
  q('#rs').onclick = () => { if (confirm('¿Restablecer todo Nova?')) { localStorage.removeItem('nova'); location.reload(); } };
  p.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.theme = b.dataset.t; ap(); refreshNT(); renderSettings(p); });
  p.querySelectorAll('.sw').forEach(s => s.onclick = () => { S[s.dataset.k] = !S[s.dataset.k]; ap(); renderSettings(p); });
}

/* ---------- fondos reales (Wikimedia Commons) ---------- */
const WQ = { coches: ['supercar', 'sports car', 'Porsche 911', 'Lamborghini', 'Nissan Skyline GT-R', 'classic car'], videojuegos: ['gaming setup', 'retro video game console', 'arcade cabinet', 'esports arena', 'video game controller'], codigo: ['source code screen', 'programming laptop', 'mechanical keyboard', 'server room', 'circuit board'], espacio: ['nebula', 'galaxy', 'Milky Way', 'aurora borealis', 'Earth from space'], naturaleza: ['mountain landscape', 'forest sunrise', 'waterfall', 'lake reflection', 'coast sunset'], ciudad: ['Tokyo skyline night', 'New York skyline', 'city lights night', 'Hong Kong skyline', 'Dubai skyline'] };
let W = { key: '', items: [], off: 0, busy: false, tab: 'web', err: '' };
async function wfetch(more) {
  if (W.busy) return; W.busy = true; wallsPanel();
  try {
    const q = W.q || WQ[S.sec][0];
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=40&gsroffset=${more ? W.off : 0}&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size&iiurlwidth=1920`;
    const j = await (await fetch(u)).json();
    const l = Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index).map(p => ({ id: p.pageid, ...p.imageinfo?.[0] })).filter(i => i.thumburl && i.thumburl.includes('/thumb/') && i.width >= 1920 && i.width > i.height * 1.3);
    W.items = more ? W.items.concat(l) : l; W.off = j.continue?.gsroffset || 0; W.err = l.length || more ? '' : 'Sin resultados, prueba otra etiqueta.';
  } catch (e) { W.err = 'Sin conexión con Wikimedia: ' + e.message; }
  W.busy = false; wallsPanel();
}
async function pickWp(it) {
  toast('Descargando fondo…');
  try {
    const b = Buffer.from(await (await fetch(it.thumburl)).arrayBuffer()), dir = path.join(ud, 'wallpapers', S.sec); fs.mkdirSync(dir, { recursive: true });
    const f = path.join(dir, 'wiki-' + it.id + (path.extname(new URL(it.thumburl).pathname) || '.jpg')); fs.writeFileSync(f, b); setWp(f); toast('Fondo aplicado');
  } catch (e) { toast('Error: ' + e.message); }
}
function wallsPanel() {
  const p = $('#pin'); if (panel !== 'walls') return;
  if (W.key !== S.sec) { W.key = S.sec; W.q = null; W.items = []; W.off = 0; wfetch(); return; }
  const local = W.tab === 'mine' ? Object.keys(SECS).flatMap(wallList) : [];
  p.innerHTML = `<h3>Fondos de pantalla</h3><div class="row"><button class="btn ${W.tab === 'web' ? 'on' : ''}" data-tab="web">Fotos online</button><button class="btn ${W.tab === 'mine' ? 'on' : ''}" data-tab="mine">Mis fondos</button></div>
  <div class="chips">${Object.entries(SECS).map(([k, n]) => `<button class="btn ${S.sec === k ? 'on' : ''}" data-s="${k}">${n}</button>`).join('')}</div>` +
    (W.tab === 'web' ? `<div class="chips">${(WQ[S.sec] || []).map(t => `<button class="btn ${W.q === t ? 'on' : ''}" data-q="${t}">${t}</button>`).join('')}</div><div class="row"><input class="fld" id="wq" placeholder="Busca lo que quieras…"><button class="btn" id="wgo">Buscar</button></div>
    <div class="grid">${W.items.map((i, k) => `<div class="wp" data-k="${k}" style="background-image:url('${i.thumburl.replace('/1920px-', '/500px-')}')"></div>`).join('')}</div>
    <span class="mut">${W.busy ? 'Cargando…' : W.err}</span>${W.off && !W.busy ? '<button class="btn" id="more">Cargar más</button>' : ''}<span class="mut">Fotos libres de Wikimedia Commons. Al elegir una se guarda en tu PC.</span>`
      : `<div class="grid">${local.map(f => `<div class="wp" data-f="${esc(f)}" style="background-image:url('${pathToFileURL(f).href}')"></div>`).join('')}</div><button class="btn" id="add">Añadir mis imágenes</button>`) + '<button class="btn" id="nowp">Quitar fondo</button>';
  const q = s => p.querySelector(s);
  p.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { W.tab = b.dataset.tab; wallsPanel(); });
  p.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { S.sec = b.dataset.s; save(); wallsPanel(); });
  p.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { W.q = b.dataset.q; wfetch(); });
  p.querySelectorAll('.wp[data-k]').forEach(w => w.onclick = () => pickWp(W.items[w.dataset.k]));
  p.querySelectorAll('.wp[data-f]').forEach(w => w.onclick = () => setWp(w.dataset.f));
  if (q('#wgo')) { const go2 = () => { W.q = q('#wq').value.trim() + ' '; wfetch(); }; q('#wgo').onclick = go2; q('#wq').onkeydown = e => e.key === 'Enter' && go2(); }
  if (q('#more')) q('#more').onclick = () => wfetch(true);
  if (q('#add')) q('#add').onclick = async () => { await ipc.invoke('pick-wp', S.sec); wallsPanel(); };
  q('#nowp').onclick = () => setWp('');
}

/* ---------- páginas internas ---------- */
const PG = {
  ajustes(r) { renderSettings(r); },
  acerca(r) {
    r.innerHTML = `<div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px"><img src="../assets/icon.png" width="110"><h2>Nova ${VERSION}</h2><span class="mut">Chromium ${process.versions.chrome} · Electron ${process.versions.electron}</span></div>
    <h3>Atajos</h3><div class="grid"><div class="li">Ctrl+T <span>Nueva pestaña</span></div><div class="li">Ctrl+W <span>Cerrar</span></div><div class="li">Ctrl+L <span>Barra de dirección</span></div><div class="li">Ctrl+F <span>Buscar</span></div><div class="li">Ctrl+D <span>Favorito</span></div><div class="li">Ctrl+H <span>Historial</span></div><div class="li">Ctrl+J <span>Descargas</span></div></div>
    `;
  },
  juegos(r) {
    r.innerHTML = '<h2>Nova Snake</h2><canvas width="400" height="400" style="border:2px solid var(--acc);border-radius:var(--r);max-width:100%"></canvas><span class="mut">Flechas o WASD · Puntos: <b id="sp">0</b> · Espacio para reiniciar</span>';
    const c = r.querySelector('canvas'), x = c.getContext('2d'); let s, d, f, pts, dead;
    const init = () => { s = [{ x: 10, y: 10 }]; d = { x: 1, y: 0 }; f = { x: 5, y: 5 }; pts = 0; dead = false; };
    init();
    const tick = () => {
      if (!r.isConnected || !c.isConnected) return clearInterval(iv); if (!r.classList.contains('on') || dead) return;
      const h = { x: (s[0].x + d.x + 20) % 20, y: (s[0].y + d.y + 20) % 20 };
      if (s.some(q => q.x === h.x && q.y === h.y)) { dead = true; return; }
      s.unshift(h); if (h.x === f.x && h.y === f.y) { pts++; f = { x: Math.random() * 20 | 0, y: Math.random() * 20 | 0 }; r.querySelector('#sp').textContent = pts; } else s.pop();
      const cs = getComputedStyle(document.body); x.fillStyle = cs.getPropertyValue('--bar'); x.fillRect(0, 0, 400, 400);
      x.fillStyle = cs.getPropertyValue('--acc2'); x.fillRect(f.x * 20 + 2, f.y * 20 + 2, 16, 16);
      x.fillStyle = cs.getPropertyValue('--acc'); s.forEach(q => x.fillRect(q.x * 20 + 1, q.y * 20 + 1, 18, 18));
    };
    const iv = setInterval(tick, 110);
    document.addEventListener('keydown', e => {
      if (!r.isConnected || !c.isConnected || !r.classList.contains('on')) return;
      const m = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }[e.key];
      if (m && (m[0] !== -d.x || m[1] !== -d.y)) { d = { x: m[0], y: m[1] }; e.preventDefault(); }
      if (e.key === ' ' && dead) { init(); r.querySelector('#sp').textContent = 0; }
    });
  }
};

/* ---------- primer uso: configuración + guía paso a paso ---------- */
function onboard() {
  const ov = document.createElement('div'); ov.className = 'ov ob'; document.body.appendChild(ov); let n = 0, tour = -1;
  const LGN = () => (window.NOVA && NOVA.LG) || { quantum: 'Nova Quantum' }, lsrc = () => '../assets/icon.png';
  const steps = [
    () => `<img class="obl" src="../assets/release/2.5/onboarding.svg" width="100%" style="max-width:520px;border-radius:18px"><h2 class="obh">Bienvenido a Nova 2.5</h2><span class="mut obc">Air por defecto. Safari, Islands, Focus, Writer y herramientas avanzadas cuando las necesitas.</span><input class="fld" id="ob" placeholder="¿Cómo quieres que te llamemos? (opcional)" value="${esc(S.name || '')}">`,
    () => `<h3>Elige tu experiencia</h3><span class="mut">Puedes cambiarla después en Ajustes.</span><div class="grid"><button class="btn on" data-mode="system">Sistema<br><span class="mut">Se adapta a Windows</span></button><button class="btn" data-mode="dark">Oscuro<br><span class="mut">Contraste relajado</span></button></div>`,
    () => `<h3>Organiza sin ruido</h3><span class="mut">Nova usa Spaces para contextos, Islands para proyectos y pestañas para páginas.</span><div class="nova25-card"><b>🏝 Islands</b><span class="mut">Agrupa las pestañas relacionadas y contráelas cuando no las necesites.</span></div><div class="nova25-card"><b>⌘ Command Center</b><span class="mut">Pulsa Ctrl/Cmd + K para buscar acciones, pestañas, páginas y herramientas.</span></div>`,
    () => `<h3>Concentración y creación</h3><span class="mut">Activa lo que necesites sin llenar la interfaz.</span><div class="grid"><button class="btn" data-mode2="focus">✦ Focus</button><button class="btn" data-mode2="reader">Aa Reader+</button><button class="btn" data-mode2="writer">✎ Writer + Word</button><button class="btn" data-mode2="improvements">↑ Mejoras</button></div><div class="row"><span>Bloquear anuncios y rastreadores</span>${sw2('adblock', S.adblock)}</div><div class="row"><span>Animaciones de la interfaz</span>${sw2('anim', S.anim)}</div>`,
    () => `<div class="okc"><svg viewBox="0 0 52 52" width="72"><circle cx="26" cy="26" r="24" fill="none" stroke="var(--acc)" stroke-width="3"/><path d="M15 27l8 8 15-17" fill="none" stroke="var(--acc2)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h2 class="obh">Todo listo${S.name ? ', ' + esc(S.name) : ''}</h2><span class="mut obc">Ahora verás una guía breve para conocer las partes importantes de Nova. Todo lo demás queda oculto hasta que lo necesites.</span>`
  ];
  const TOUR = [
    ['#tabs', 'Pestañas +', 'El botón + siempre está junto a la última pestaña y se mueve con ella. Ctrl+T también abre una nueva.'],
    ['#addr', 'Barra de direcciones', 'Escribe una web o una búsqueda. Ctrl/Cmd + clic y clic central abren enlaces en otra pestaña.'],
    ['#side', 'Dock discreto', 'La barra lateral contiene IA, favoritos, fondos y herramientas. En Air puedes mantenerla mínima.'],
    ['#nt', 'Nueva pestaña', 'Nova Tab prioriza la búsqueda. Las funciones avanzadas viven en Más y en Command Center.'],
    ['#mn', 'Command Center', 'Pulsa Ctrl+K para abrir acciones, Islands, Focus, Writer, Privacy, Performance y mucho más.']
  ];
  const end = () => {
    S.done = 1; S.welcomed = 1; S.tour = 1; save(); ov.remove(); document.querySelectorAll('.cm,.cmh').forEach(e => e.remove()); refreshNT();
  };
  const coach = () => { // marca sobre la interfaz real
    const [sel, t, d] = TOUR[tour], el = document.querySelector(sel); ov.className = 'cmh'; ov.style.pointerEvents = 'none'; ov.innerHTML = '';
    document.querySelectorAll('.cm').forEach(e => e.remove());
    const b = el ? el.getBoundingClientRect() : { left: innerWidth / 2 - 30, top: 80, width: 60, height: 30, right: innerWidth / 2 + 30, bottom: 110 };
    const hole = document.createElement('div'); hole.className = 'cm hole'; Object.assign(hole.style, { left: b.left - 6 + 'px', top: b.top - 6 + 'px', width: b.width + 12 + 'px', height: b.height + 12 + 'px' });
    const tip = document.createElement('div'); tip.className = 'cm tip';
    tip.innerHTML = `<span class="mut">Paso ${tour + 1} de ${TOUR.length}</span><b>${t}</b><p>${d}</p><div class="row"><button class="btn" id="cs">Omitir guía</button><button class="btn on" id="cn">${tour < TOUR.length - 1 ? 'Siguiente' : 'Empezar a navegar'}</button></div>`;
    document.body.append(hole, tip);
    const tw = 320, left = Math.max(12, Math.min(innerWidth - tw - 12, b.left)), below = b.bottom + 16 + 170 < innerHeight;
    Object.assign(tip.style, { width: tw + 'px', left: left + 'px', top: (below ? b.bottom + 16 : Math.max(12, b.top - 190)) + 'px' });
    tip.querySelector('#cs').onclick = end; tip.querySelector('#cn').onclick = () => { if (tour < TOUR.length - 1) { tour++; coach(); } else end(); };
  };
  const r = () => {
    ov.innerHTML = `<div class="card obcard"><div class="dots">${steps.map((_, i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div><div class="obb">${steps[n]()}</div><div class="row"><button class="btn" id="sk">${n === 0 ? 'Omitir todo' : 'Atrás'}</button><button class="btn on" id="nx">${n === 0 ? 'Comenzar' : n < steps.length - 1 ? 'Siguiente' : 'Ver la guía'}</button></div></div>`;
    const q = s => ov.querySelector(s);
    if (q('#se2')) { q('#se2').value = S.search; q('#se2').onchange = e => { S.search = e.target.value; save(); }; }
    if (q('#obd')) q('#obd').onclick = () => ipc.invoke('default-browser', true).then(() => toast('Pulsa «Establecer como predeterminado» en Windows'));
    ov.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.theme = b.dataset.t; save(); applyTheme(); r(); });
    ov.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { const mode=b.dataset.mode; S.theme = mode === 'safari' ? 'safari' : 'air'; save(); applyTheme(); r(); });
    ov.querySelectorAll('[data-mode2]').forEach(b => b.onclick = () => { const m=b.dataset.mode2; if(m==='focus') newTab('nova://focus'); else if(m==='reader') newTab('nova://reader'); else if(m==='writer') newTab('nova://writer'); else if(m==='improvements') newTab('nova://mejoras'); });
    ov.querySelectorAll('[data-lg]').forEach(b => b.onclick = () => { if (window.NOVA && NOVA.setLogo) NOVA.setLogo(b.dataset.lg); r(); });
    ov.querySelectorAll('.sw').forEach(s => s.onclick = () => { S[s.dataset.k] = !S[s.dataset.k]; save(); applyTheme(); r(); });
    q('#sk').onclick = () => { if (n === 0) { S.done = 1; S.welcomed = 1; save(); ov.remove(); refreshNT(); } else { n--; r(); } };
    q('#nx').onclick = () => { if (q('#ob')) { S.name = q('#ob').value.trim(); save(); } if (n < steps.length - 1) { n++; r(); } else { tour = 0; coach(); } };
  };
  r();
}
window.NOVA = { PG, MENU, internalTab, sw2, themeGrid, toURL, fmt, refreshPages, activeWebTab, save, tour: () => onboard() };
applyTheme();
if (!S.done) setTimeout(onboard, 700);
})();


/* ---- extras2.js ---- */
/* Nova 1.2.0 - ajustes como página, juegos, barra lateral movible, paleta Ctrl+K, novedades */
(() => {
const { PG, MENU, sw2, themeGrid, toURL, fmt } = NOVA, VER = NOVA_VER, os = require('os');
Object.assign(P, { spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z' });
S.hs = S.hs || {}; S.hide = S.hide || {}; S.closed = S.closed || [];
if (!S.done) S.seen = VER;

const st = document.createElement('style');
st.textContent = `
#side .ib{width:var(--isz,38px);height:var(--isz,38px);transition:transform .18s}
body.sp-right #view{order:1}body.sp-right #panel{order:2;border-left:0;border-right:1px solid var(--bd)}body.sp-right #side{order:3;border-right:0;border-left:1px solid var(--bd)}
body.sp-dock #side{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);width:auto;flex-direction:row;padding:6px 12px;border:1px solid var(--bd);border-radius:calc(var(--r) * 2.5);z-index:12;box-shadow:0 10px 40px #0009;backdrop-filter:blur(14px);animation:tin .3s}
body.sp-dock #side .ib{margin-top:0!important}body.sp-dock #side .ib:hover{transform:translateY(-7px) scale(1.3)}
.nb{position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:var(--acc2);animation:pl 1.4s infinite}@keyframes pl{50%{transform:scale(1.6);opacity:.4}}
#sug{position:fixed;z-index:16;display:none;flex-direction:column;gap:2px;padding:4px;background:var(--bar);border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 10px 30px #0008}#sug.on{display:flex}
.seg{display:flex;gap:6px;flex-wrap:wrap}.tl{border-left:3px solid var(--acc);padding:4px 0 4px 16px;display:flex;flex-direction:column;gap:6px;animation:tin .4s both}
.tl li{margin-left:16px}.pi{background:color-mix(in srgb,var(--acc) 30%,transparent)!important}
`;
document.head.appendChild(st);

/* ---------- aplicar ajustes nuevos ---------- */
const baseAT = applyTheme;
applyTheme = function () {
  baseAT();
  const b = document.body.style; document.body.classList.add('sp-' + (S.sp || 'left'));
  S.font ? b.setProperty('--font', S.font) : b.removeProperty('--font');
  S.isz ? b.setProperty('--isz', S.isz + 'px') : b.removeProperty('--isz');
  document.querySelectorAll('#side [data-p],#side [data-page]').forEach(e => e.style.display = S.hide[e.dataset.p || e.dataset.page] ? 'none' : '');
};

/* ---------- botones nuevos de la barra lateral ---------- */
$('#side').insertAdjacentHTML('beforeend', `<button class="ib" data-page="juegos" title="Juegos" style="margin-top:auto">${ic('game')}</button><button class="ib" data-page="novedades" title="Novedades" style="position:relative">${ic('spark')}${S.seen === VER ? '' : '<i class="nb"></i>'}</button>`);
$('#side').addEventListener('click', e => { const b = e.target.closest('[data-page]'); if (b) newTab('nova://' + b.dataset.page); });
const baseDraw = draw;
draw = function () {
  baseDraw();
  if (panel === 'set') { $('#pin').insertAdjacentHTML('afterbegin', '<button class="btn on" id="full">Abrir ajustes completos →</button>'); $('#full').onclick = () => { panel = null; draw(); newTab('nova://ajustes'); }; }
};

/* ---------- pestañas cerradas + sugerencias ---------- */
const baseClose = closeTab;
closeTab = function (t) { try { const u = t.wv.getURL(); if (u && !isNT(u)) S.closed = [u, ...S.closed].slice(0, 15); save(); } catch { } baseClose(t); };
const reopen = () => { const u = S.closed.shift(); if (u) { save(); newTab(u); } else toast('No hay pestañas cerradas'); };
NOVA.reopen = reopen;
const sug = document.createElement('div'); sug.id = 'sug'; document.body.appendChild(sug);
const addr = $('#addr');
addr.addEventListener('input', () => {
  const q = addr.value.trim().toLowerCase(); if (q.length < 2) return sug.classList.remove('on');
  const seen = new Set(), l = []; [...S.marks, ...S.hist].forEach(h => { if (l.length < 6 && !seen.has(h.u) && (h.t + h.u).toLowerCase().includes(q)) { seen.add(h.u); l.push(h); } });
  if (!l.length) return sug.classList.remove('on');
  const b = addr.getBoundingClientRect(); sug.style.cssText = `left:${b.left}px;top:${b.bottom + 4}px;width:${b.width}px`;
  sug.innerHTML = l.map(h => { let d = ''; try { d = new URL(h.u).hostname; } catch { } return `<div class="li" data-u="${esc(h.u)}"><span>${esc(h.t || h.u)}</span><span class="mut">${esc(d)}</span></div>`; }).join('');
  sug.classList.add('on'); sug.querySelectorAll('.li').forEach(e => e.onmousedown = () => go(e.dataset.u));
});
addr.addEventListener('blur', () => setTimeout(() => sug.classList.remove('on'), 120));
addr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') sug.classList.remove('on'); });

/* ---------- paleta de comandos Ctrl+K ---------- */
const setSp = v => { S.sp = v; save(); applyTheme(); };
function palette() {
  if ($('#pal')) return;
  const ov = document.createElement('div'); ov.className = 'ov'; ov.id = 'pal'; ov.style.alignItems = 'start';
  ov.innerHTML = '<div class="card" style="margin-top:12vh"><input class="fld" id="pq" placeholder="Nova Command Center · busca una acción, pestaña o cuenta (2+2*5)"><div id="pl" style="display:flex;flex-direction:column;gap:4px"></div></div>';
  document.body.appendChild(ov);
  const acts = [...MENU.map(m => [m[0].replace(/ \(.*\)/, ''), m[1]]), ['Novedades', () => newTab('nova://novedades')], ['Reabrir pestaña cerrada', reopen], ['Captura de pantalla', () => $('#sh').click()], ...(NOVA.extraActs || []), ['Barra lateral: izquierda', () => setSp('left')], ['Barra lateral: derecha', () => setSp('right')], ['Barra lateral: dock central', () => setSp('dock')], ...Object.entries(THEMES).map(([k, n]) => ['Tema: ' + n, () => { S.theme = k; save(); applyTheme(); refreshNT(); }])];
  const pq = $('#pq'), pl = $('#pl'); let items = [], ix = 0;
  const show = () => { pl.innerHTML = items.map((it, i) => `<div class="li ${i === ix ? 'pi' : ''}" data-i="${i}"><span>${esc(it[0])}</span></div>`).join(''); pl.querySelectorAll('.li').forEach(e => e.onclick = () => run(+e.dataset.i)); };
  const run = i => { ov.remove(); items[i] && items[i][1](); };
  const build = () => {
    const raw = pq.value.trim(), q = raw.toLowerCase(); items = [];
    if (/^[\d\s+\-*/().%^]+$/.test(q) && /\d/.test(q) && /[+\-*/^%]/.test(q)) { try { const v = Function('"use strict";return (' + q.replace(/\^/g, '**') + ')')(); items.push(['= ' + v + '  (Enter para copiar)', () => navigator.clipboard.writeText(String(v))]); } catch { } }
    acts.filter(a => a[0].toLowerCase().includes(q)).slice(0, 8).forEach(a => items.push(a));
    if (q) {
      tabs.forEach(t => { const n = t.el.querySelector('span').textContent; if (n.toLowerCase().includes(q)) items.push(['Pestaña: ' + n, () => sel(t)]); });
      S.marks.filter(m => (m.t + m.u).toLowerCase().includes(q)).slice(0, 3).forEach(m => items.push(['★ ' + (m.t || m.u), () => newTab(m.u)]));
      S.hist.filter(h => (h.t + h.u).toLowerCase().includes(q)).slice(0, 3).forEach(h => items.push(['Historial: ' + h.t, () => newTab(h.u)]));
      items.push(['Buscar en la web: ' + raw, () => newTab(toURL(raw))]);
    }
    ix = 0; show();
  };
  pq.oninput = build;
  pq.onkeydown = e => { if (e.key === 'Escape') ov.remove(); if (e.key === 'ArrowDown') { ix = Math.min(items.length - 1, ix + 1); show(); e.preventDefault(); } if (e.key === 'ArrowUp') { ix = Math.max(0, ix - 1); show(); e.preventDefault(); } if (e.key === 'Enter') run(ix); };
  ov.onmousedown = e => { if (e.target === ov) ov.remove(); };
  build(); pq.focus();
}
NOVA.palette = palette;
ipc.on('key', (_, k) => { if (k === 'k') palette(); if (k === 'T') reopen(); });
document.addEventListener('keydown', e => { if (!e.ctrlKey) return; if (e.key === 'k') { e.preventDefault(); palette(); } if (e.key === 'T') { e.preventDefault(); reopen(); } });

/* ---------- novedades ---------- */
const LOG = [
  ['1.6.1', 'Primer uso guiado y Apariencia', ['Nueva configuración inicial en 5 pasos: nombre, tema, logotipo, privacidad y navegador predeterminado', 'Guía interactiva que señala pestañas, barra de direcciones, marcadores, barra lateral y menú (repetible desde el menú › Guía de inicio)', 'Ajustes › Apariencia reúne ahora logotipos, animación de inicio, color de la barra y sonidos', 'Instalador renovado: imágenes nuevas, presentación animada de bienvenida y textos más claros']],
  ['1.6.0', 'Predeterminado, logotipo y más extensiones', ['Nova ya se puede elegir como navegador predeterminado: el botón abre la página de Nova en Windows y avisa cuando lo consigues', 'Los enlaces y archivos .html/.pdf que abres desde Windows llegan a la ventana de Nova ya abierta', 'El logotipo que eliges también cambia el icono de la barra de tareas y los accesos directos', '15 extensiones nuevas: modo noche cálido, alto contraste, sin animaciones, regla de lectura, copiar sin restricciones, ver contraseñas y más', 'Arranque más rápido: las listas del bloqueador de anuncios se guardan en disco y la animación de inicio es más corta', 'Menos trabajo en segundo plano y código interno más limpio']],
  ['1.5.2', 'Instalador y tema Safari', ['Cambia el logotipo de Nova: Clásico, Órbita, Estrella, Cometa o Minimal', 'Animación de inicio propia para cada logotipo (se puede desactivar)', 'Tienda de extensiones de Nova: lectura cómoda, sin avisos de cookies, webs en modo oscuro y más', 'Sonidos que puedes cambiar: Suave, Cristal, Retro o Burbuja', 'Colores suaves para la barra superior', 'Aviso para hacer de Nova tu navegador predeterminado', 'Nuevo tema Safari e instalador renovado', 'La versión que ves en Acerca de es siempre la real']],
  ['1.5.0', 'La gran actualización', ['Nova IA 2.0: conversaciones guardadas, contexto de la página, clave cifrada en el sistema', 'Grupos de pestañas con color, arrastrar y soltar, pestañas fijadas y silenciar', 'Marcadores con carpetas, barra, importar y exportar', 'Historial con filtros y borrado por día', 'Gestor de descargas con pausa, velocidad y tiempo restante', 'Centro de privacidad con permisos y limpieza selectiva', 'Notas múltiples con búsqueda', 'Tema Claro y Sistema', 'Avisos de nueva versión', 'Seguridad reforzada: datos web aislados y webviews restringidos']],
  ['1.3.0', '', ['Nova IA de verdad: escribe, pide órdenes ("cambia el tema a neón") y funciona incluso sin clave API', 'Clic derecho en la web: copiar, pegar, guardar imágenes, buscar, explicar y traducir con Nova IA', 'Nova Dino: juego sin conexión cuando falla una página (con agacharse, pájaros y modo noche)', 'Menú contextual de pestañas: fijar, duplicar y cerrar otras', 'Continuar donde lo dejaste (opcional)', 'Muchas más animaciones: barra de carga, ondas al pulsar, cierre de pestañas, paneles y avisos', 'Inicio con efecto parallax']],
  ['1.2.0', '', ['Ajustes en su propia página, con secciones e historial', 'Barra lateral movible: izquierda, derecha o dock flotante en el centro', 'Elige qué iconos muestra la barra y su tamaño', 'Centro de juegos: Nova Snake, Nova Runner y Memoria', 'Paleta de comandos (Ctrl+K) con calculadora incluida', 'Sugerencias mientras escribes en la barra de direcciones', 'Reabrir pestaña cerrada (Ctrl+Shift+T)', 'Nova IA: elige modelo y personalidad', 'Exportar e importar tus ajustes', 'Tipografía personalizable']],
  ['1.1.0', '', ['Fondos reales desde Wikimedia Commons', 'Tema Neón y asistente de bienvenida', 'Historial, descargas, notas y contador de anuncios bloqueados']],
  ['1.0.0', '', ['Primera versión: 4 temas, Nova IA, bloqueador de anuncios, barra lateral y mods']]
];
PG.novedades = r => {
  S.seen = VER; save(); document.querySelectorAll('.nb').forEach(n => n.remove());
  r.innerHTML = '<h2>Novedades de Nova</h2>' + LOG.map(([v, s, l], i) => `<div class="tl" style="animation-delay:${i * .12}s"><b style="font-size:18px;color:var(--acc)">Nova ${v}</b>${s ? `<span class="mut">${s}</span>` : ''}<ul style="margin:0;padding:0">${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('');
};
const oldAbout = PG.acerca;
PG.acerca = r => { oldAbout(r); r.insertAdjacentHTML('beforeend', '<button class="btn" id="wn" style="align-self:flex-start">Ver novedades</button>'); r.querySelector('#wn').onclick = () => newTab('nova://novedades'); };

/* ---------- ajustes como página ---------- */
const SECT = [['apariencia', 'Apariencia'], ['barra', 'Barra lateral'], ['navegador', 'Navegador'], ['fondos', 'Fondos'], ['historial', 'Historial'], ['ia', 'Nova IA'], ['datos', 'Privacidad y datos']];
let curSec = 'apariencia';
const ap = () => { save(); applyTheme(); };
const seg = (k, opts) => `<div class="seg">${opts.map(([v, n]) => `<button class="btn ${(S[k] || opts[0][0]) === v ? 'on' : ''}" data-seg="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
const row = (t, c) => `<div class="row"><span>${t}</span>${c}</div>`;
function bind(root, again) {
  root.querySelectorAll('[data-set]').forEach(e => e.oninput = () => { const k = e.dataset.set; S[k] = e.type === 'range' ? +e.value : e.value; if (k === 'acc' || k === 'name') refreshNT(); ap(); });
  root.querySelectorAll('.sw').forEach(s => s.onclick = () => { S[s.dataset.k] = !S[s.dataset.k]; ap(); again(); });
  root.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { S[b.dataset.seg] = b.dataset.v; ap(); again(); });
  root.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.theme = b.dataset.t; ap(); refreshNT(); again(); });
  root.querySelectorAll('[data-hide]').forEach(b => b.onclick = () => { S.hide[b.dataset.hide] = !S.hide[b.dataset.hide]; ap(); again(); });
}
const SEC = {
  apariencia: (c, again) => {
    c.innerHTML = `<h2>Apariencia</h2><div class="grid">${themeGrid()}</div>` +
      row('Color de acento', `<input type="color" data-set="acc" value="${S.acc || '#8b5cf6'}">`) + row('Bordes redondeados', `<input type="range" data-set="r" min="0" max="22" value="${S.r ?? 10}">`) + row('Tamaño de letra', `<input type="range" data-set="fs" min="11" max="18" value="${S.fs || 13}">`) +
      row('Tipografía', `<select class="fld" data-set="font" style="width:auto"><option value="">Del tema</option><option>Segoe UI</option><option>Consolas</option><option>Georgia</option><option>Trebuchet MS</option><option>Courier New</option></select>`) +
      row('Animaciones', sw2('anim', S.anim)) + row('Sonidos del tema', sw2('sound', S.sound)) + '<button class="btn" id="ra" style="align-self:flex-start">Restablecer apariencia</button>';
    c.querySelector('[data-set=font]').value = S.font || '';
    c.querySelector('#ra').onclick = () => { delete S.acc; delete S.r; delete S.fs; delete S.font; ap(); refreshNT(); again(); };
  },
  barra: c => {
    const items = [['ai', 'Nova IA'], ['mods', 'Mods'], ['walls', 'Fondos'], ['marks', 'Favoritos'], ['set', 'Ajustes rápidos'], ['juegos', 'Juegos'], ['novedades', 'Novedades']];
    c.innerHTML = '<h2>Barra lateral</h2><span class="mut">Posición</span>' + seg('sp', [['left', 'Izquierda'], ['right', 'Derecha'], ['dock', 'Dock central']]) + row('Tamaño de iconos', `<input type="range" data-set="isz" min="30" max="54" value="${S.isz || 38}">`) + '<span class="mut">Iconos visibles</span>' + items.map(([k, n]) => row(n, `<div class="sw ${S.hide[k] ? '' : 'on'}" data-hide="${k}"></div>`)).join('');
  },
  navegador: c => {
    c.innerHTML = '<h2>Navegador</h2><span class="mut">Tu nombre</span><input class="fld" data-set="name" value="' + esc(S.name || '') + '"><span class="mut">Buscador</span><select class="fld" data-set="search"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select><span class="mut">Página de inicio (vacío = página Nova)</span><input class="fld" data-set="home" placeholder="https://…" value="' + esc(S.home || '') + '">' + row('Bloqueador de anuncios', sw2('adblock', S.adblock)) + `<span class="mut">Anuncios y rastreadores bloqueados en total: <b>${S.blocked.toLocaleString('es')}</b></span>`;
    c.querySelector('[data-set=search]').value = S.search;
  },
  fondos: (c, again) => {
    c.innerHTML = '<h2>Fondos</h2><span class="mut">Sección favorita</span><div class="chips">' + Object.entries(SECS).map(([k, n]) => `<button class="btn ${S.sec === k ? 'on' : ''}" data-seg="sec" data-v="${k}">${n}</button>`).join('') + '</div>' + row('Fondo aleatorio en cada pestaña', sw2('rand', S.rand)) + '<div class="row"><button class="btn" id="fw">Abrir el panel de fondos</button><button class="btn" id="fq">Quitar fondo</button></div>';
    c.querySelector('#fw').onclick = () => { panel = 'walls'; draw(); }; c.querySelector('#fq').onclick = () => setWp('');
  },
  historial: (c, again, r) => {
    c.innerHTML = '<h2>Historial</h2><div class="row"><input class="fld" id="hq" placeholder="Buscar…"><button class="btn" id="hc">Borrar todo</button></div><div id="hl" style="display:flex;flex-direction:column;gap:6px"></div>';
    const l = () => { const q = c.querySelector('#hq').value.toLowerCase(); c.querySelector('#hl').innerHTML = S.hist.map((h, i) => [h, i]).filter(([h]) => (h.t + h.u).toLowerCase().includes(q)).slice(0, 150).map(([h, i]) => `<div class="li" data-u="${esc(h.u)}"><span>${esc(h.t)}</span><span class="mut">${new Date(h.d).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} <b data-x="${i}" style="cursor:pointer">✕</b></span></div>`).join('') || '<span class="mut">Sin resultados.</span>'; c.querySelectorAll('.li').forEach(e => e.onclick = ev => { if (ev.target.dataset.x !== undefined) { S.hist.splice(+ev.target.dataset.x, 1); save(); l(); } else newTab(e.dataset.u); }); };
    c.querySelector('#hq').oninput = l; c.querySelector('#hc').onclick = () => { S.hist = []; save(); l(); }; l();
  },
  ia: (c, again) => {
    c.innerHTML = '<h2>Nova IA</h2><span class="mut">Clave API de Anthropic</span><div class="row"><input class="fld" type="password" id="akey" placeholder="' + (S.hasKey ? 'Clave guardada de forma segura' : 'sk-ant-…') + '"><button class="btn" id="akb">Guardar</button></div><span class="mut">Modelo</span><select class="fld" data-set="model"><option value="claude-sonnet-4-6">Claude Sonnet 4.6 (equilibrado)</option><option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (rápido)</option><option value="claude-opus-5-5">Claude Opus 5.5 (potente)</option></select><span class="mut">Personalidad / instrucciones extra</span><textarea class="fld" data-set="persona" rows="4" placeholder="Ej: Respóndeme como un pirata programador.">' + esc(S.persona || '') + '</textarea>';
    c.querySelector('[data-set=model]').value = S.model || 'claude-sonnet-4-6';
    c.querySelector('#akb').onclick = async () => { await NOVA.setKey(c.querySelector('#akey').value.trim()); if(typeof PG.ajustes==='function') PG.ajustes(r); };
  },
  datos: (c, again) => {
    c.innerHTML = '<h2>Privacidad y datos</h2><div class="row"><button class="btn" id="d1">Borrar historial</button><button class="btn" id="d2">Borrar cookies y caché</button></div><div class="row"><button class="btn" id="d3">Exportar ajustes</button><label class="btn">Importar ajustes<input type="file" id="d4" accept=".json" hidden></label><button class="btn on" id="dm">Migrar navegador</button></div><button class="btn" id="d5" style="align-self:flex-start">Restablecer todo Nova</button><span class="mut">Exportar guarda nova-ajustes.json en tu carpeta Descargas.</span>';
    c.querySelector('#d1').onclick = () => { S.hist = []; save(); toast('Historial borrado'); };
    c.querySelector('#d2').onclick = async () => { await ipc.invoke('clear'); toast('Cookies y caché borrados'); }; c.querySelector('#dm').onclick = () => newTab('nova://migrar');
    c.querySelector('#d3').onclick = () => { const f = path.join(os.homedir(), 'Downloads', 'nova-ajustes.json'); try { fs.writeFileSync(f, JSON.stringify(S, null, 2)); toast('Guardado en ' + f); } catch (e) { toast('Error: ' + e.message); } };
    c.querySelector('#d4').onchange = e => { const fr = new FileReader(); fr.onload = () => { try { Object.assign(S, JSON.parse(fr.result)); ap(); refreshNT(); toast('Ajustes importados'); again(); } catch { toast('Archivo no válido'); } }; fr.readAsText(e.target.files[0]); };
    c.querySelector('#d5').onclick = () => { if (confirm('¿Restablecer todo Nova?')) { localStorage.removeItem('nova'); location.reload(); } };
  }
};
Object.assign(NOVA, { SECT, SEC, bind, row, seg, reopen });
PG.ajustes = r => {
  r.innerHTML = `<div style="display:flex;gap:28px;flex-wrap:wrap"><nav style="display:flex;flex-direction:column;gap:6px;min-width:180px">${SECT.map(([k, n]) => `<button class="btn ${k === curSec ? 'on' : ''}" data-k="${k}" style="text-align:left">${n}</button>`).join('')}</nav><div id="sc" style="flex:1;min-width:280px;max-width:640px;display:flex;flex-direction:column;gap:12px"></div></div>`;
  r.querySelectorAll('nav .btn').forEach(b => b.onclick = () => { curSec = b.dataset.k; PG.ajustes(r); });
  const c = r.querySelector('#sc'), again = () => PG.ajustes(r);
  SEC[curSec](c, again, r); bind(c, again);
};

/* ---------- juegos ---------- */
const snake = PG.juegos, GAMES = { snake, runner: null, memoria: null };
const stop = r => { r._stop && r._stop(); r._stop = null; };
const launch = (r, id) => { stop(r); GAMES[id](r); r.insertAdjacentHTML('afterbegin', '<button class="btn" id="gb" style="align-self:flex-start">← Juegos</button>'); r.querySelector('#gb').onclick = () => PG.juegos(r); };
PG.juegos = r => {
  stop(r);
  const G = [['snake', 'Nova Snake', 'Clásico. Flechas o WASD.'], ['runner', 'Nova Runner', 'Salta los obstáculos.'], ['memoria', 'Memoria', 'Encuentra las parejas.']];
  r.innerHTML = '<h2>Centro de juegos</h2><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">' + G.map(([k, n, d]) => `<div class="li" data-g="${k}" style="flex-direction:column;padding:18px;gap:6px"><b style="font-size:17px;color:var(--acc)">${n}</b><span class="mut">${d}</span></div>`).join('') + '</div>';
  r.querySelectorAll('[data-g]').forEach(e => e.onclick = () => launch(r, e.dataset.g));
};
GAMES.runner = r => {
  r.innerHTML = `<h2>Nova Runner</h2><canvas width="640" height="220" style="max-width:100%;border:2px solid var(--acc);border-radius:var(--r)"></canvas><span class="mut">Espacio, ↑ o clic · Puntos: <b id="rp">0</b> · Récord: <b id="rh">${S.hs.runner || 0}</b></span>`;
  const c = r.querySelector('canvas'), x = c.getContext('2d'); let y = 0, v = 0, o = [], sc = 0, sp = 6, dead = 0, t = 0;
  const jump = () => { if (dead) { y = 0; v = 0; o = []; sc = 0; sp = 6; dead = 0; return; } if (y === 0) v = 12; };
  const kd = e => { if (r.classList.contains('on') && (e.key === ' ' || e.key === 'ArrowUp')) { e.preventDefault(); jump(); } };
  document.addEventListener('keydown', kd); c.onclick = jump;
  const iv = setInterval(() => {
    if (!r.classList.contains('on')) return; const cs = getComputedStyle(document.body);
    if (!dead) {
      t++; y += v; v -= .9; if (y <= 0) { y = 0; v = 0; }
      if (t % Math.max(38, 90 - sp * 4) === 0 && Math.random() < .85) o.push({ x: 640, w: 16 + Math.random() * 16 | 0, h: 20 + Math.random() * 34 | 0 });
      o.forEach(q => q.x -= sp); o = o.filter(q => q.x > -40); sc += .2; sp = Math.min(14, 6 + sc / 250);
      if (o.some(q => q.x < 84 && q.x + q.w > 60 && y < q.h)) { dead = 1; if (sc > (S.hs.runner || 0)) { S.hs.runner = sc | 0; save(); r.querySelector('#rh').textContent = S.hs.runner; } }
      r.querySelector('#rp').textContent = sc | 0;
    }
    x.fillStyle = cs.getPropertyValue('--bar'); x.fillRect(0, 0, 640, 220); x.fillStyle = cs.getPropertyValue('--bd'); x.fillRect(0, 190, 640, 3);
    x.fillStyle = cs.getPropertyValue('--acc2'); o.forEach(q => x.fillRect(q.x, 190 - q.h, q.w, q.h));
    x.fillStyle = cs.getPropertyValue('--acc'); x.fillRect(60, 190 - 24 - y, 24, 24);
    if (dead) { x.fillStyle = cs.getPropertyValue('--fg'); x.font = '20px sans-serif'; x.fillText('Fin · pulsa para reiniciar', 210, 100); }
  }, 20);
  r._stop = () => { clearInterval(iv); document.removeEventListener('keydown', kd); };
};
GAMES.memoria = r => {
  const E = ['🚀', '🎮', '💻', '🏎️', '👾', '🎧', '⭐', '🔥']; let open = [], found = 0, mv = 0, lock = false;
  r.innerHTML = `<h2>Memoria</h2><div id="mg" style="display:grid;grid-template-columns:repeat(4,80px);gap:8px"></div><span class="mut">Movimientos: <b id="mv">0</b> · Récord: <b>${S.hs.mem || '—'}</b></span>`;
  const g = r.querySelector('#mg');
  [...E, ...E].sort(() => Math.random() - .5).forEach(e => {
    const b = document.createElement('button'); b.className = 'btn'; b.style.cssText = 'height:80px;font-size:34px'; b.textContent = '?';
    b.onclick = () => {
      if (lock || b.dataset.o) return; b.textContent = e; b.dataset.o = 1; open.push([b, e]);
      if (open.length === 2) {
        mv++; r.querySelector('#mv').textContent = mv; lock = true;
        setTimeout(() => {
          if (open[0][1] === open[1][1]) { found++; open.forEach(([q]) => q.style.opacity = .4); } else open.forEach(([q]) => { q.textContent = '?'; delete q.dataset.o; });
          open = []; lock = false;
          if (found === 8) { if (!S.hs.mem || mv < S.hs.mem) S.hs.mem = mv; save(); toast('¡Ganaste en ' + mv + ' movimientos!'); }
        }, 650);
      }
    };
    g.appendChild(b);
  });
};

applyTheme();
setTimeout(() => { if (S.done && S.seen !== VER) newTab('nova://novedades'); }, 1600);
})();


/* ---- extras3.js ---- */
/* Nova 1.3.0 - Nova IA real, clic derecho, modo sin conexión, animaciones, pestañas pro */
(() => {
const { PG } = NOVA, VER = NOVA_VER;
S.chat = S.chat || [];
const OFF = (u, e, play) => new URL('offline.html', document.baseURI).href + '?t=' + S.theme + '&a=' + encodeURIComponent(S.acc || '') + (play ? '&play=1' : '&u=' + encodeURIComponent(u) + '&e=' + encodeURIComponent(e || ''));

/* ================= ESTILOS ================= */
const st = document.createElement('style');
const stag = Array.from({ length: 14 }, (_, i) => `#pin.fresh>*:nth-child(${i + 1}){animation-delay:${i * 35}ms}`).join('');
st.textContent = `
body,#top,#bar,.tab,.btn,.fld,#addr{transition:background-color .35s,border-color .35s,color .35s}
.btn,.li,.th{position:relative;overflow:hidden}
.rp{position:absolute;width:10px;height:10px;margin:-5px;border-radius:50%;background:currentColor;opacity:.25;pointer-events:none;animation:rpl .55s ease-out forwards}
@keyframes rpl{to{transform:scale(28);opacity:0}}.t-win95 .rp,.t-undertale .rp{display:none}
@keyframes up{from{opacity:0;transform:translateY(12px)}}@keyframes pgin{from{opacity:0;transform:translateY(10px) scale(.99)}}
#pin.fresh>*{animation:up .38s cubic-bezier(.2,.8,.2,1) both}${stag}
.ipage.on{animation:pgin .35s cubic-bezier(.2,.8,.2,1)}
.tab.closing{animation:tout .16s ease-in forwards}@keyframes tout{to{opacity:0;transform:scale(.8);max-width:0;padding:0;min-width:0}}
.tab.pin{flex:none;min-width:40px;max-width:44px;justify-content:center}.tab.pin span,.tab.pin button{display:none}
.tab:hover{transform:translateY(-1px)}.tab{transition:transform .15s,background-color .3s}
#lb{position:absolute;top:0;left:0;height:2px;width:0;z-index:6;background:linear-gradient(90deg,var(--acc2),var(--acc));box-shadow:0 0 8px var(--acc);opacity:0}
#lb.on{opacity:1;animation:lbar 1.6s cubic-bezier(.3,.8,.3,1) infinite}@keyframes lbar{0%{width:0}70%{width:85%}100%{width:96%}}
#mnp.on,#tcm.on{animation:pop .16s cubic-bezier(.2,1.3,.4,1);transform-origin:top right}@keyframes pop{from{opacity:0;transform:scale(.9)}}
.ctx{position:fixed;z-index:30;min-width:190px;padding:6px;background:var(--bar);border:1px solid var(--bd);border-radius:var(--r);display:none;flex-direction:column;box-shadow:0 10px 40px #0009}.ctx.on{display:flex}
.ctx button{text-align:left;padding:8px 12px;background:none;border:0;cursor:pointer;border-radius:var(--r)}.ctx button:hover{background:color-mix(in srgb,var(--acc) 22%,transparent)}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:10px 18px;background:var(--acc);color:#fff;border-radius:var(--r);z-index:40;box-shadow:0 8px 30px #0008;animation:tst .3s cubic-bezier(.2,1.4,.4,1)}
.toast.out{opacity:0;transform:translate(-50%,10px);transition:.3s}@keyframes tst{from{opacity:0;transform:translate(-50%,22px)}}body.sp-dock .toast{bottom:88px}
#side .ib:not(.ai):hover svg{animation:bnc .4s}@keyframes bnc{40%{transform:translateY(-4px) rotate(-6deg)}}
.m{animation:up .25s both}.m.a code{background:var(--bd);padding:1px 5px;border-radius:4px}.cb{background:var(--bg);border:1px solid var(--bd);padding:8px;border-radius:var(--r);overflow:auto;margin:6px 0}
.cp{margin-top:6px;padding:2px 8px;font-size:11px;background:none;border:1px solid var(--bd);border-radius:var(--r);cursor:pointer;opacity:.7}.cp:hover{opacity:1;border-color:var(--acc)}
.dots i{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--acc);animation:dt 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes dt{40%{transform:translateY(-5px)}}
#aiq{resize:none;font:inherit;flex:1}
`;
document.head.appendChild(st);

/* ================= ANIMACIONES ================= */
toast = function (t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 300); }, 2600); };
document.addEventListener('pointerdown', e => {
  if (S.anim === false) return; const b = e.target.closest('.btn,.li,.th'); if (!b) return;
  const rc = b.getBoundingClientRect(), s = document.createElement('span'); s.className = 'rp'; s.style.cssText = `left:${e.clientX - rc.left}px;top:${e.clientY - rc.top}px`; b.appendChild(s); setTimeout(() => s.remove(), 600);
});
const lb = document.createElement('div'); lb.id = 'lb'; $('#view').appendChild(lb);
new MutationObserver(() => lb.classList.toggle('on', !!(cur && cur.el.classList.contains('ld')))).observe($('#tabs'), { subtree: true, attributes: true, attributeFilter: ['class'] });
let lastP = null;
const bd = draw;
draw = function () {
  bd();
  if (panel !== lastP) { const p = $('#pin'); p.classList.add('fresh'); setTimeout(() => p.classList.remove('fresh'), 900); }
  lastP = panel;
};

/* ================= PESTAÑAS PRO ================= */
const bc = closeTab;
closeTab = function (t) {
  if (t._c) return; if (t.el.classList.contains('pin')) return toast('Pestaña fijada: desfíjala para cerrarla');
  t._c = 1; if (!S.anim) return bc(t); t.el.classList.add('closing'); setTimeout(() => bc(t), 150);
};

/* ================= MODO SIN CONEXIÓN ================= */
const bn = newTab;
newTab = function (u) {
  const t = bn(u);
  if (t && t.wv && t.wv.tagName === 'WEBVIEW' && !t._off) {
    t._off = 1;
    t.wv.addEventListener('did-fail-load', e => {
      if (!e.isMainFrame || e.errorCode === -3 || e.validatedURL.includes('offline.html')) return;
      t.failed = e.validatedURL; t.wv.loadURL(OFF(e.validatedURL, e.errorDescription));
    });
    t.wv.addEventListener('did-stop-loading', () => {
      let u2 = ''; try { u2 = t.wv.getURL(); } catch { }
      if (u2.includes('offline.html')) { t.el.querySelector('span').textContent = u2.includes('play=1') ? 'Nova Dino' : 'Sin conexión'; if (cur === t && t.failed && !u2.includes('play=1')) $('#addr').value = t.failed; }
    });
  }
  return t;
};

/* ================= JUEGOS Y AJUSTES: añadidos ================= */
const oj = PG.juegos;
PG.juegos = r => { oj(r); const g = r.querySelector('.grid'); if (g) { g.insertAdjacentHTML('beforeend', '<div class="li" data-dino style="flex-direction:column;padding:18px;gap:6px"><b style="font-size:17px;color:var(--acc)">Nova Dino</b><span class="mut">El juego sin conexión. Salta, agáchate y sobrevive.</span></div>'); g.querySelector('[data-dino]').onclick = () => newTab(OFF('', '', 1)); } };
const oa = PG.ajustes;
PG.ajustes = r => {
  oa(r); const k = r.querySelector('nav .btn.on')?.dataset.k, c = r.querySelector('#sc');
  if (k === 'navegador') { c.insertAdjacentHTML('beforeend', `<div class="row"><span>Continuar donde lo dejé al abrir Nova</span><div class="sw ${S.restore ? 'on' : ''}" id="rsw"></div></div>`); c.querySelector('#rsw').onclick = e => { S.restore = !S.restore; save(); e.target.classList.toggle('on', S.restore); }; }
  if (k === 'ia') c.insertAdjacentHTML('beforeend', '<span class="mut">Sin clave, Nova IA usa el modo gratuito (Nova Free) y siempre entiende tus órdenes locales. Con clave de Anthropic responde Claude.</span>');
};
applyTheme();
})();


/* ---- extras4.js ---- */
/* Nova 1.5 - IA 2.0, grupos de pestañas, marcadores, historial, descargas, notas, privacidad, actualizaciones */
(() => {
const N = NOVA, { PG, SECT, SEC, row, toURL, fmt, refreshPages, reopen } = N, VER = NOVA_VER, REPO = 'sdraiky99/NovaBrowser';
const { shell } = require('electron'), os = require('os');
Object.assign(THEMES, { light: 'Claro', system: 'Sistema', safari: 'Safari' });

/* ---------- datos por defecto y migraciones ---------- */
S.convs = S.convs || [];
// Canonical group storage is an object map. Older builds stored an array; migrate it once.
if (Array.isArray(S.groups)) { const migratedGroups = {}; S.groups.forEach(g => { if (g && g.id) migratedGroups[g.id] = g; }); S.groups = migratedGroups; }
if (!S.groups || typeof S.groups !== 'object') S.groups = {};
S.folders = S.folders || []; S.quick = S.quick || [];
S.perms = Object.assign({ cam: 'ask', mic: 'ask', geo: 'ask', notif: 'ask' }, S.perms);
S.dash = Object.assign({ clock: true, search: true, quick: true, recent: true, dl: true, ai: true }, S.dash);
S.notesL = S.notesL || (S.notes ? [{ id: 1, t: 'Mi nota', b: S.notes, ts: Date.now() }] : []);
S.marks.forEach(m => m.f = m.f || '');
if (S.restore === undefined) S.restore = true;
if (S.key) ipc.invoke('key-set', S.key).then(ok => { if (ok) { S.key = ''; S.hasKey = true; save(); } });   // la clave sale del almacenamiento del renderer
ipc.invoke('key-has').then(v => { S.hasKey = v; });
ipc.send('perm-policy', S.perms);
NOVA.setKey = async k => { const ok = await ipc.invoke('key-set', k); S.hasKey = !!k && ok; save(); toast(k ? (ok ? 'Clave guardada de forma segura' : 'No se pudo cifrar la clave en este equipo') : 'Clave eliminada'); };

/* ---------- estilos ---------- */
const st = document.createElement('style');
st.textContent = `
.tg{-webkit-app-region:no-drag;display:flex;align-items:center;gap:5px;height:24px;padding:0 9px;margin:0 2px 3px;border-radius:99px;background:color-mix(in srgb,var(--gc) 28%,transparent);border:1px solid var(--gc);font-size:12px;cursor:pointer;white-space:nowrap;align-self:flex-end}.tg i{width:8px;height:8px;border-radius:50%;background:var(--gc)}
.tab.mut span::before{content:'🔇 '}.tab[draggable=true]{-webkit-user-drag:element}
#bmb{display:none;position:fixed;left:0;right:0;bottom:0;z-index:35;gap:4px;padding:5px 8px;background:var(--bar);border-top:1px solid var(--bd);box-shadow:0 -8px 30px #0005;overflow:auto;align-items:center;min-height:28px}#bmb.on{display:flex}#bmb .btn{padding:4px 10px;font-size:12px;white-space:nowrap}#bmb .bmc{margin-left:auto;flex:none}
.upd{position:fixed;right:16px;bottom:16px;z-index:40;width:290px;padding:16px;background:var(--bar);border:1px solid var(--acc);border-radius:calc(var(--r) * 1.4);box-shadow:0 12px 50px #000a;display:flex;flex-direction:column;gap:10px;animation:tin .35s}
.sx{width:36px;height:20px;border-radius:20px;background:var(--bd);position:relative;cursor:pointer;flex:none}.sx::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.15s}.sx.on{background:var(--acc)}.sx.on::after{left:18px}
.ban{padding:8px 10px;border-radius:var(--r);border:1px solid var(--bd);font-size:12px;display:flex;justify-content:space-between;gap:8px;align-items:center}.ban.err{border-color:#ff5c5c;color:#ff8a8a}
input[type=checkbox]{accent-color:var(--acc)}.fol{margin-top:10px;font-weight:600;color:var(--acc)}
body.t-light{--bg:#f7f7fb;--bar:#fff;--fg:#1a1a2e;--mut:#6b6b85;--acc:#6d4aff;--acc2:#00a3c4;--bd:#dcdce8}
`;
document.head.appendChild(st);

/* ---------- utilidades ---------- */
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function dlg(title, fields, ok, extra) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="card"><h3>${title}</h3>${fields.map(f => `<span class="mut">${f.label}</span>` + (f.opts ? `<select class="fld" data-k="${f.k}">${f.opts.map(o => `<option value="${esc(o)}">${esc(o || '(Sin carpeta)')}</option>`).join('')}</select>` : `<input class="fld" data-k="${f.k}" value="${esc(f.val || '')}">`)).join('')}<div class="row">${extra ? `<button class="btn" id="dx">${extra[0]}</button>` : '<span></span>'}<span style="display:flex;gap:8px"><button class="btn" id="dc">Cancelar</button><button class="btn on" id="dk">Guardar</button></span></div></div>`;
  document.body.appendChild(ov); const g = k => ov.querySelector(`[data-k=${k}]`); fields.forEach(f => { if (f.opts) g(f.k).value = f.val || ''; });
  const close = () => ov.remove(); ov.querySelector('#dc').onclick = close;
  ov.querySelector('#dk').onclick = () => { const v = {}; fields.forEach(f => v[f.k] = g(f.k).value.trim()); close(); ok(v); };
  if (extra) ov.querySelector('#dx').onclick = () => { close(); extra[1](); };
  ov.onmousedown = e => { if (e.target === ov) close(); };
  ov.addEventListener('keydown', e => { if (e.key === 'Enter') ov.querySelector('#dk').click(); if (e.key === 'Escape') close(); });
  (ov.querySelector('input,select') || {}).focus?.();
}

// Public dialog/context helpers used by later feature modules.
N.dlg = (title, fields, ok = 'Guardar', extra) => new Promise(resolve => {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${fields.map((f,i) => f.type === 'note' ? `<span class="mut">${esc(f.label)}</span>` : f.type === 'select' ? `<label class="mut">${esc(f.label)}</label><select class="fld" data-i="${i}">${(f.opts||[]).map(o => { const pair = Array.isArray(o) ? o : [o,o]; return `<option value="${esc(pair[0])}">${esc(pair[1])}</option>`; }).join('')}</select>` : `<label class="mut">${esc(f.label)}</label><input class="fld" data-i="${i}" value="${esc(f.value ?? '')}">`).join('')}<div class="row"><span>${extra ? `<button class="btn" id="dx">${esc(typeof extra === 'string' ? extra : extra[0])}</button>` : ''}</span><span><button class="btn" id="dc">Cancelar</button> <button class="btn on" id="dk">${esc(ok)}</button></span></div></div>`;
  document.body.appendChild(ov); const els=[...ov.querySelectorAll('[data-i]')]; els.forEach((e,i)=>{const f=fields[i];if(f?.type==='select')e.value=f.value ?? (Array.isArray(f.opts?.[0])?f.opts[0][0]:f.opts?.[0] ?? '');});
  const done=v=>{ov.remove();resolve(v)}; ov.querySelector('#dc').onclick=()=>done(null); ov.querySelector('#dk').onclick=()=>done(els.map(e=>e.value));
  if(extra) ov.querySelector('#dx').onclick=()=>{done('__extra__'); if(Array.isArray(extra)) extra[1]?.();};
  ov.onkeydown=e=>{if(e.key==='Escape')done(null);if(e.key==='Enter'&&e.target.tagName!=='SELECT')ov.querySelector('#dk').click()}; ov.onmousedown=e=>{if(e.target===ov)done(null)}; els[0]?.focus?.();
});
const cx = document.createElement('div'); cx.className = 'ctx'; document.body.appendChild(cx);
function menu(items, x, y) {
  const itemLabel = m => Array.isArray(m) ? m[0] : m?.label;
  const disabled = m => Array.isArray(m) ? !!m[2] : !!m?.disabled;
  const action = m => Array.isArray(m) ? m[1] : m?.onClick;
  cx.innerHTML = items.map((m, i) => m === '-' ? '<hr style="border:0;border-top:1px solid var(--bd);margin:4px 0;width:100%">' : `<button data-i="${i}" ${disabled(m) ? 'disabled' : ''}>${esc(itemLabel(m) || '')}</button>`).join('');
  cx.style.cssText = `left:${Math.max(4, Math.min(x, innerWidth - 230))}px;top:${Math.max(4, Math.min(y, innerHeight - items.length * 34 - 16))}px`; cx.classList.add('on');
  cx.onclick = e => { const b = e.target.closest('button'); if (b) { const m = items[+b.dataset.i]; if (disabled(m)) return; cx.classList.remove('on'); action(m)?.(); } };
}
N.ctx = (x,y,items) => menu(items, x, y);
document.addEventListener('click', () => cx.classList.remove('on'));
const pageText = async () => { try { const t = N.activeWebTab?.() || cur; return t?.wv?.tagName === 'WEBVIEW' ? await t.wv.executeJavaScript('document.body.innerText.slice(0,12000)') : ''; } catch { return ''; } };
const selText = async () => { try { const t = N.activeWebTab?.() || cur; return t?.wv?.tagName === 'WEBVIEW' ? await t.wv.executeJavaScript('getSelection().toString()') : ''; } catch { return ''; } };

/* ---------- tema Claro / Sistema ---------- */
const bat = applyTheme;
applyTheme = function () {
  bat();
  if (S.theme === 'system') { document.body.classList.remove('t-system'); document.body.classList.add(matchMedia('(prefers-color-scheme:light)').matches ? 't-light' : 't-nova'); }
};
matchMedia('(prefers-color-scheme:light)').addEventListener('change', () => S.theme === 'system' && applyTheme());

/* ================= PESTAÑAS: grupos, arrastrar, menú, sesión ================= */
const COLORS = { azul: '#4f8cff', rojo: '#ff5c5c', verde: '#3ddc84', amarillo: '#ffd23f', morado: '#a26bff', rosa: '#ff6bb5', cian: '#22d3ee' };
const byDom = (a, b) => { const c = [...$('#tabs').children]; return c.indexOf(a.el) - c.indexOf(b.el); };
function layout() {
  const tb = $('#tabs'); $$('.tg', tb).forEach(x => x.remove());
  const isPin = t => t.el.classList.contains('pin'), rest = tabs.filter(t => !isPin(t)), seen = new Set(), order = tabs.filter(isPin).map(t => t.el);
  rest.forEach(t => {
    const g = t.g ? S.groups[t.g] : null; if (!g) { t.g = null; return order.push(t.el); }
    if (seen.has(g.id)) return; seen.add(g.id); order.push(header(g)); rest.filter(x => x.g === g.id).forEach(x => order.push(x.el));
  });
  order.forEach(el => tb.appendChild(el));
  tabs.forEach(t => { const g = t.g ? S.groups[t.g] : null; t.el.style.borderTop = g ? '2px solid ' + g.color : ''; t.el.style.display = g && g.collapsed && t !== cur ? 'none' : ''; });
  const add = $('#nt'); if (add) tb.appendChild(add);
  tabs.sort(byDom);
}
function header(g) {
  const h = document.createElement('div'); h.className = 'tg'; h.style.setProperty('--gc', g.color); h.innerHTML = `<i></i>${esc(g.name)}${g.collapsed ? ' ▸' : ''}`;
  h.onclick = () => { g.collapsed = !g.collapsed; save(); layout(); }; h.oncontextmenu = e => { e.preventDefault(); groupMenu(g, e.clientX, e.clientY); }; return h;
}
function groupMenu(g, x, y) {
  menu([['Renombrar grupo', () => dlg('Renombrar grupo', [{ k: 'n', label: 'Nombre', val: g.name }], v => { g.name = v.n || g.name; save(); layout(); })],
    ...Object.entries(COLORS).map(([n, c]) => ['Color: ' + n, () => { g.color = c; save(); layout(); }]), '-',
    [g.collapsed ? 'Expandir' : 'Contraer', () => { g.collapsed = !g.collapsed; save(); layout(); }],
    ['Desagrupar', () => { tabs.forEach(t => t.g === g.id && (t.g = undefined)); delete S.groups[g.id]; save(); layout(); }],
    ['Cerrar grupo', () => { tabs.filter(t => t.g === g.id && !t.el.classList.contains('pin')).forEach(closeTab); delete S.groups[g.id]; save(); }]], x, y);
}
function groupDialog(t) {
  dlg('Nuevo grupo', [{ k: 'n', label: 'Nombre (Trabajo, Ocio, Desarrollo…)' }, { k: 'c', label: 'Color', opts: Object.keys(COLORS), val: 'azul' }], v => {
    const g = { id: 'g' + Date.now(), name: v.n || 'Grupo', color: COLORS[v.c] || COLORS.azul, collapsed: false }; S.groups[g.id] = g; (t || N.activeWebTab?.() || cur).g = g.id; save(); layout();
  });
}
function tabMenu(t, x, y) {
  const pin = t.el.classList.contains('pin'), i = tabs.indexOf(t);
  menu([['Nueva pestaña', () => newTab()], ['Nueva pestaña a la derecha', () => { const n = newTab(); t.el.after(n.el); tabs.sort(byDom); layout(); }],
    ['Duplicar', () => { try { newTab(t.wv.getURL()); } catch { } }], [pin ? 'Desfijar' : 'Fijar', () => { t.el.classList.toggle('pin'); layout(); }], '-',
    ...Object.values(S.groups).map(g => ['Mover a grupo: ' + esc(g.name), () => { t.g = g.id; layout(); }]), ['Mover a grupo nuevo…', () => groupDialog(t)], ...(t.g ? [['Quitar del grupo', () => { t.g = undefined; layout(); }]] : []), '-',
    [t.muted ? 'Activar sonido' : 'Silenciar', () => { t.muted = !t.muted; try { t.wv.setAudioMuted(t.muted); } catch { } t.el.classList.toggle('mut', t.muted); }], ['Recargar', () => t.wv.reload()], '-',
    ['Cerrar', () => { t.el.classList.remove('pin'); closeTab(t); }], ['Cerrar otras', () => tabs.filter(z => z !== t && !z.el.classList.contains('pin')).forEach(closeTab)],
    ['Cerrar a la derecha', () => tabs.slice(i + 1).filter(z => !z.el.classList.contains('pin')).forEach(closeTab)], ['Reabrir pestaña cerrada', reopen]], x, y);
}
$('#tabs').addEventListener('contextmenu', e => { const el = e.target.closest('.tab'), t = el && tabs.find(z => z.el === el); if (t) { e.preventDefault(); tabMenu(t, e.clientX, e.clientY); } });
let drag = null;
$('#tabs').addEventListener('dragstart', e => { const el = e.target.closest('.tab'); if (el) { drag = el; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'tab'); } });
$('#tabs').addEventListener('dragover', e => { if (!drag) return; e.preventDefault(); const el = e.target.closest('.tab'); if (!el || el === drag) return; const r = el.getBoundingClientRect(); el.parentNode.insertBefore(drag, e.clientX < r.left + r.width / 2 ? el : el.nextSibling); });
$('#tabs').addEventListener('dragend', () => { if (drag) { drag = null; tabs.sort(byDom); layout(); } });
const step = d => { if (tabs.length > 1) sel(tabs[(tabs.indexOf(cur) + d + tabs.length) % tabs.length]); };

const bn4 = newTab;
newTab = function (u) {
  if (u === 'nova://ia') { panel = 'ai'; draw(); return cur; }
  const t = bn4(u);
  if (t && !t._4) {
    t._4 = 1; t.el.draggable = true;
    if (t.wv.tagName === 'WEBVIEW') {
      t.wv.addEventListener('page-favicon-updated', e => { const h = S.hist.find(z => z.u === t.wv.getURL()); if (h) h.i = e.favicons[0]; });
      t.wv.addEventListener('did-navigate-in-page', e => { const m = e.url.match(/#nova\/([\w-]+)/); if (m) { newTab('nova://' + m[1]); t.wv.executeJavaScript('history.replaceState(null,"",location.href.split("#")[0])').catch(() => { }); } });
      t.wv.addEventListener('dom-ready', () => { try { const mode=!!S.newTabLinks; t.wv.executeJavaScript(`(()=>{window.__novaLinkMode=${mode};if(window.__novaLinksInstalled)return;window.__novaLinksInstalled=1;const open=(a)=>{try{return /^https?:$/i.test(new URL(a.href).protocol)}catch{return false}};document.addEventListener('click',e=>{const a=e.target?.closest?.('a[href]');if(!a)return;const href=a.getAttribute('href')||'';if(/^#nova\/[\w-]+$/i.test(href)){e.preventDefault();e.stopPropagation();return}if(!(window.__novaLinkMode||e.ctrlKey||e.metaKey))return;if(open(a)){e.preventDefault();e.stopPropagation();const u=a.href;console.log('__NOVA_LINK__'+u)}},true);document.addEventListener('auxclick',e=>{if(e.button!==1)return;const a=e.target?.closest?.('a[href]');if(!a||!open(a))return;e.preventDefault();e.stopPropagation();console.log('__NOVA_LINK__'+a.href)},true)})()`)} catch {} });
      t.wv.addEventListener('console-message',e=>{if(typeof e.message==='string'&&e.message.startsWith('__NOVA_LINK__')){const u=e.message.slice('__NOVA_LINK__'.length);if(/^https?:/i.test(u))newTab(u)}});
    }
    layout();
  }
  return t;
};
NOVA.newTab = newTab; NOVA.closeTab = closeTab; NOVA.selectTab = sel; NOVA.stepTab = step;
const bs = sel; sel = function (t) { bs(t); if (Object.keys(S.groups).length) layout(); };
const bcl = closeTab; closeTab = function (t) { bcl(t); setTimeout(() => Object.keys(S.groups).length && layout(), 200); };
N.renderGroups = layout; N.enforcePins = () => { tabs.filter(t => t.el.classList.contains('pin')).reverse().forEach(t => $('#tabs').prepend(t.el)); tabs.sort(byDom); const add=$('#nt'); if(add) $('#tabs').appendChild(add); }; N.syncTabOrder = () => tabs.sort(byDom); N.newGroup = groupDialog; N.saveSession = saveSession;

function saveSession() { const list = tabs.map(t => { let u = ''; try { u = t.wv.getURL(); } catch { } return !u || isNT(u) || u.includes('offline.html') || u.startsWith('nova:') ? null : { u, pin: t.el.classList.contains('pin'), p: t.el.classList.contains('pin') ? 1 : 0, g: t.g || '' }; }).filter(Boolean); if (list.length) { S.session = list; S.session2 = list.map(x => ({u:x.u,g:x.g||'',p:x.p||0})); save(); } }
setInterval(saveSession, 5000); addEventListener('beforeunload', saveSession);
setTimeout(() => {
  if (S.restore && Array.isArray(S.session) && S.session.length && tabs.length === 1) {
    const f = tabs[0]; S.session.forEach(s => { s = typeof s === 'string' ? { u: s } : s; const t = newTab(s.u); if (s.pin) t.el.classList.add('pin'); if (s.g && S.groups[s.g]) t.g = s.g; }); layout(); closeTab(f);
  }
}, 1000);

/* ================= MARCADORES ================= */
const folderList = () => ['', ...new Set([...S.folders, ...S.marks.map(m => m.f).filter(Boolean)])].sort();
function saveMark() {
  const tcur = N.activeWebTab?.() || cur; const u = tcur?.wv?.getURL?.(); if (!u || isNT(u) || u.startsWith('nova:') || u.includes('offline.html')) return toast('Esta página no se puede guardar');
  const ex = S.marks.find(m => m.u === u);
  dlg(ex ? 'Editar marcador' : 'Guardar esta página', [{ k: 't', label: 'Nombre', val: ex ? ex.t : tcur?.el?.querySelector('span')?.textContent || u }, { k: 'f', label: 'Carpeta', opts: folderList(), val: ex ? ex.f : '' }],
    v => { if (ex) { ex.t = v.t || ex.t; ex.f = v.f; } else S.marks.push({ u, t: v.t || u, f: v.f }); save(); bmBar(); $('#st').style.color = 'var(--acc)'; refreshPages('marcadores'); },
    ex ? ['Eliminar', () => { S.marks.splice(S.marks.indexOf(ex), 1); save(); bmBar(); $('#st').style.color = ''; }] : null);
}
$('#st').onclick = saveMark;
function bookmarkAll() {
  dlg('Guardar todas las pestañas', [{ k: 'f', label: 'Nombre de la carpeta', val: 'Sesión ' + new Date().toLocaleDateString('es') }], v => {
    tabs.forEach(t => { try { const u = t.wv.getURL(); if (u && !isNT(u) && !u.startsWith('nova:') && !S.marks.some(m => m.u === u)) S.marks.push({ u, t: t.el.querySelector('span').textContent, f: v.f }); } catch { } }); save(); bmBar(); toast('Pestañas guardadas');
  });
}
const bmb = document.createElement('div'); bmb.id = 'bmb'; $('#mid').after(bmb);
function bmBar() {
  bmb.classList.toggle('on', !!S.bmbar); if (!S.bmbar) return;
  const top = S.marks.filter(m => !m.f), fol = folderList().filter(f => f && !f.includes('/'));
  bmb.innerHTML = (fol.map(f => `<button class="btn" data-f="${esc(f)}">▸ ${esc(f)}</button>`).join('') + top.map(m => `<button class="btn" data-u="${esc(m.u)}">${esc((m.t || m.u).slice(0, 26))}</button>`).join('')) || '<span class="mut">Guarda páginas con Ctrl+D</span>'; bmb.insertAdjacentHTML('beforeend','<button class="btn bmc" id="bmbclose" title="Ocultar barra de marcadores">Ocultar</button>'); bmb.querySelector('#bmbclose').onclick=toggleBar;
  $$('[data-u]', bmb).forEach(b => b.onclick = () => (N.activeWebTab?.()||cur)?.wv?.tagName === 'WEBVIEW' ? (N.activeWebTab?.()||cur).wv.loadURL(b.dataset.u) : newTab(b.dataset.u));
  $$('[data-f]', bmb).forEach(b => b.onclick = e => { e.stopPropagation(); const r = b.getBoundingClientRect(); menu(S.marks.filter(m => m.f === b.dataset.f).map(m => [esc((m.t || m.u).slice(0, 40)), () => newTab(m.u)]).concat(S.marks.some(m => m.f === b.dataset.f) ? [] : [['(vacía)', () => { }]]), r.left, r.bottom + 4); });
}
const toggleBar = () => { S.bmbar = !S.bmbar; save(); bmBar(); }; N.bbar = toggleBar; N.toggleBar = toggleBar;
function parseHTML(txt) {
  const d = new DOMParser().parseFromString(txt, 'text/html'), out = [], fol = [];
  const walk = (dl, p) => [...dl.children].forEach(ch => {
    if (ch.tagName !== 'DT') return; const h = ch.querySelector(':scope>h3'), a = ch.querySelector(':scope>a');
    if (h) { const q = (p ? p + '/' : '') + h.textContent.trim(); fol.push(q); const sub = ch.querySelector(':scope>dl'); if (sub) walk(sub, q); } else if (a && /^https?:/.test(a.href)) out.push({ u: a.href, t: a.textContent.trim() || a.href, f: p });
  });
  const root = d.querySelector('dl'); if (root) walk(root, ''); return { out, fol };
}
PG.marcadores = r => {
  r.innerHTML = `<h2>Marcadores</h2><div class="row"><input class="fld" id="mq" placeholder="Buscar marcadores"><button class="btn" id="mnf">Nueva carpeta</button></div>
  <div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn" id="mex">Exportar</button><label class="btn">Importar (.json / .html)<input type="file" id="mim" accept=".json,.html,.htm" hidden></label><button class="btn" id="mbb">${S.bmbar ? 'Ocultar' : 'Mostrar'} barra (Ctrl+Shift+B)</button></div><div id="ml" style="display:flex;flex-direction:column;gap:6px"></div>`;
  const L = () => {
    const q = r.querySelector('#mq').value.toLowerCase(), fs = folderList(); let html = '';
    fs.forEach(f => { const items = S.marks.filter(m => m.f === f && (m.t + m.u).toLowerCase().includes(q)); if (!items.length && (q || !f)) return;
      html += (f ? `<div class="fol" style="margin-left:${(f.split('/').length - 1) * 16}px">▸ ${esc(f.split('/').pop())} <span class="mut">(${items.length})</span></div>` : '') + items.map(m => `<div class="li" data-i="${S.marks.indexOf(m)}" style="margin-left:${f ? f.split('/').length * 16 : 0}px"><span>${esc(m.t)} <span class="mut">${esc(m.u)}</span></span><span><b data-e="${S.marks.indexOf(m)}" style="cursor:pointer">✎</b> <b data-x="${S.marks.indexOf(m)}" style="cursor:pointer">✕</b></span></div>`).join(''); });
    r.querySelector('#ml').innerHTML = html || '<span class="mut">Aún no tienes marcadores. Pulsa la estrella o Ctrl+D en una página.</span>';
    $$('#ml .li', r).forEach(e => e.onclick = ev => {
      const i = +e.dataset.i, m = S.marks[i];
      if (ev.target.dataset.x !== undefined) { S.marks.splice(i, 1); save(); bmBar(); L(); }
      else if (ev.target.dataset.e !== undefined) dlg('Editar marcador', [{ k: 't', label: 'Nombre', val: m.t }, { k: 'u', label: 'Dirección', val: m.u }, { k: 'f', label: 'Carpeta (mover)', opts: folderList(), val: m.f }], v => { m.t = v.t || m.t; m.u = v.u || m.u; m.f = v.f; save(); bmBar(); L(); });
      else newTab(m.u);
    });
  };
  r.querySelector('#mq').oninput = L;
  r.querySelector('#mnf').onclick = () => dlg('Nueva carpeta', [{ k: 'n', label: 'Nombre (usa Trabajo/Docs para una subcarpeta)' }], v => { if (v.n) { S.folders.push(v.n.replace(/^\/+|\/+$/g, '')); save(); L(); } });
  r.querySelector('#mbb').onclick = () => { toggleBar(); PG.marcadores(r); };
  r.querySelector('#mex').onclick = () => { const f = path.join(os.homedir(), 'Downloads', 'nova-marcadores.json'); try { fs.writeFileSync(f, JSON.stringify({ marks: S.marks, folders: S.folders }, null, 2)); toast('Exportado a ' + f); } catch (e) { toast('Error: ' + e.message); } };
  r.querySelector('#mim').onchange = e => {
    const file = e.target.files[0]; if (!file) return; const fr = new FileReader();
    fr.onload = () => { try {
      let add = [], fol = [];
      if (/\.html?$/i.test(file.name)) { const p = parseHTML(fr.result); add = p.out; fol = p.fol; } else { const j = JSON.parse(fr.result); add = (j.marks || []).filter(m => m && /^https?:/.test(m.u)); fol = j.folders || []; }
      let n = 0; add.forEach(m => { if (!S.marks.some(z => z.u === m.u)) { S.marks.push({ u: m.u, t: m.t || m.u, f: m.f || '' }); n++; } }); fol.forEach(f => !S.folders.includes(f) && S.folders.push(f)); save(); bmBar(); L(); toast(n + ' marcadores importados');
    } catch { toast('Archivo no válido'); } };
    fr.readAsText(file);
  };
  L();
};

/* ================= HISTORIAL ================= */
PG.historial = r => {
  let flt = 'all';
  r.innerHTML = '<h2>Historial</h2><div class="row"><input class="fld" id="hq" placeholder="Buscar en el historial"><button class="btn" id="hall">Borrar todo</button></div><div class="chips" id="hf"></div><div id="hl" style="display:flex;flex-direction:column;gap:6px"></div>';
  const F = [['today', 'Hoy'], ['yest', 'Ayer'], ['7', 'Últimos 7 días'], ['30', 'Últimos 30 días'], ['all', 'Todo']];
  const rangeOf = () => { const d0 = new Date().setHours(0, 0, 0, 0), D = 864e5, n = Date.now(); return { today: h => h.d >= d0, yest: h => h.d >= d0 - D && h.d < d0, 7: h => h.d >= n - 7 * D, 30: h => h.d >= n - 30 * D, all: () => true }[flt]; };
  let rows = [];
  const L = () => {
    r.querySelector('#hf').innerHTML = F.map(([k, n]) => `<button class="btn ${flt === k ? 'on' : ''}" data-f="${k}">${n}</button>`).join('') + '<button class="btn" id="hper">Borrar periodo mostrado</button>';
    const q = r.querySelector('#hq').value.toLowerCase(), f = rangeOf(); rows = S.hist.filter(h => f(h) && (h.t + h.u).toLowerCase().includes(q)).slice(0, 300);
    let day = '', html = '';
    rows.forEach((h, i) => { const dl = new Date(h.d).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); if (dl !== day) { day = dl; html += `<div class="row fol"><span>${dl}</span><button class="btn" data-day="${dl}">Borrar día</button></div>`; }
      html += `<div class="li" data-i="${i}"><span style="display:flex;gap:8px;align-items:center;min-width:0"><img src="${esc(h.i || '../assets/icon.png')}" width="14" height="14" onerror="this.src='../assets/icon.png'"><span>${esc(h.t)} <span class="mut">${esc(h.u)}</span></span></span><span class="mut">${new Date(h.d).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} <b data-x="${i}" style="cursor:pointer">✕</b></span></div>`; });
    r.querySelector('#hl').innerHTML = html || '<span class="mut">No hay entradas en este periodo.</span>';
    $$('[data-f]', r).forEach(b => b.onclick = () => { flt = b.dataset.f; L(); });
    r.querySelector('#hper').onclick = () => { S.hist = S.hist.filter(h => !rows.includes(h)); save(); L(); };
    $$('[data-day]', r).forEach(b => b.onclick = () => { S.hist = S.hist.filter(h => new Date(h.d).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }) !== b.dataset.day); save(); L(); });
    $$('#hl .li', r).forEach(e => e.onclick = ev => { const h = rows[+e.dataset.i]; if (ev.target.dataset.x !== undefined) { S.hist.splice(S.hist.indexOf(h), 1); save(); L(); } else newTab(h.u); });
  };
  r.querySelector('#hq').oninput = L; r.querySelector('#hall').onclick = () => { if (confirm('¿Borrar todo el historial?')) { S.hist = []; save(); L(); } }; L();
};

/* ================= DESCARGAS ================= */
const spd = new Map();
ipc.on('dl', (_, d) => { const n = Date.now(), s = spd.get(d.id); if (!s) spd.set(d.id, { t: n, b: d.recv, v: 0 }); else if (n > s.t + 300) { const v = (d.recv - s.b) / ((n - s.t) / 1000); spd.set(d.id, { t: n, b: d.recv, v: s.v ? s.v * .6 + v * .4 : v }); } });
const DL_LBL = { progressing: 'Descargando', paused: 'Pausado', completed: 'Completado', cancelled: 'Cancelado', interrupted: 'Error' };
const eta = s => s > 3600 ? Math.round(s / 3600) + ' h' : s > 60 ? Math.round(s / 60) + ' min' : Math.round(s) + ' s';
PG.descargas = r => {
  r.innerHTML = '<h2>Descargas</h2><div><button class="btn" id="dcl">Borrar historial de descargas</button></div><div id="dll" style="display:flex;flex-direction:column;gap:8px"></div>';
  r.querySelector('#dll').innerHTML = S.dls.map((d, i) => { const s = spd.get(d.id) || {}, act = d.state === 'progressing', pct = d.total ? d.recv / d.total * 100 : 0;
    const info = act ? `${fmt(d.recv)}${d.total ? ' / ' + fmt(d.total) : ''} · ${fmt(s.v || 0)}/s${d.total && s.v > 1 ? ' · ' + eta((d.total - d.recv) / s.v) + ' restantes' : ''}` : d.state === 'completed' ? fmt(d.total) : fmt(d.recv);
    const btn = (a, n) => `<button class="btn" data-a="${a}" data-i="${i}">${n}</button>`;
    const acts = act ? btn('pause', 'Pausar') + btn('cancel', 'Cancelar') : d.state === 'paused' ? btn('resume', 'Continuar') + btn('cancel', 'Cancelar') : d.state === 'completed' ? btn('open', 'Abrir') + btn('dir', 'Mostrar carpeta') + btn('rm', 'Quitar') : btn('rm', 'Quitar');
    return `<div class="li" style="cursor:default;flex-direction:column"><div class="row"><b>${esc(d.name)}</b><span class="mut">${DL_LBL[d.state] || d.state}</span></div><div class="pb" style="flex:none"><i style="width:${d.state === 'completed' ? 100 : pct}%"></i></div><div class="row"><span class="mut">${info}</span><span style="display:flex;gap:6px">${acts}</span></div></div>`; }).join('') || '<span class="mut">Aún no has descargado nada. Los archivos van a tu carpeta Descargas.</span>';
  $$('[data-a]', r).forEach(b => b.onclick = () => {
    const d = S.dls[+b.dataset.i], a = b.dataset.a;
    if (['pause', 'resume', 'cancel'].includes(a)) ipc.send('dl-ctl', { id: d.id, a }); if (a === 'open') shell.openPath(d.path); if (a === 'dir') shell.showItemInFolder(d.path); if (a === 'rm') { S.dls.splice(+b.dataset.i, 1); save(); PG.descargas(r); }
  });
  r.querySelector('#dcl').onclick = () => { S.dls = S.dls.filter(d => d.state === 'progressing' || d.state === 'paused'); save(); PG.descargas(r); };
};

/* ================= NOTAS ================= */
PG.notas = r => {
  let cid = S.notesL[0]?.id, q = '';
  r.innerHTML = '<h2>Notas</h2><div style="display:flex;gap:16px;flex:1;min-height:360px"><div style="width:240px;display:flex;flex-direction:column;gap:8px"><button class="btn on" id="nn">+ Nueva nota</button><input class="fld" id="nq" placeholder="Buscar notas"><div id="nl" style="display:flex;flex-direction:column;gap:6px;overflow:auto"></div></div><div id="ne" style="flex:1;display:flex;flex-direction:column;gap:8px"></div></div>';
  const L = () => {
    r.querySelector('#nl').innerHTML = S.notesL.filter(n => (n.t + n.b).toLowerCase().includes(q)).sort((a, b) => b.ts - a.ts).map(n => `<div class="li ${n.id === cid ? 'pi' : ''}" data-id="${n.id}"><span>${esc(n.t || 'Sin título')}</span><b data-del="${n.id}" style="cursor:pointer">✕</b></div>`).join('') || '<span class="mut">Sin notas</span>';
    $$('#nl .li', r).forEach(e => e.onclick = ev => { if (ev.target.dataset.del) { S.notesL = S.notesL.filter(n => n.id != ev.target.dataset.del); if (cid == ev.target.dataset.del) cid = S.notesL[0]?.id; save(); L(); E(); } else { cid = +e.dataset.id; L(); E(); } });
  };
  const E = () => {
    const n = S.notesL.find(x => x.id === cid), e = r.querySelector('#ne'); if (!n) { e.innerHTML = '<span class="mut">Crea o elige una nota.</span>'; return; }
    e.innerHTML = `<input class="fld" id="nt" placeholder="Título"><textarea class="fld" id="nb" style="flex:1;resize:none;font:inherit;min-height:300px"></textarea><span class="mut">Se guarda automáticamente · ${new Date(n.ts).toLocaleString('es')}</span>`;
    const b = e.querySelector('#nb'), t = e.querySelector('#nt'); t.value = n.t; b.value = n.b; let tm;
    const sv = () => { n.t = t.value; n.b = b.value; n.ts = Date.now(); clearTimeout(tm); tm = setTimeout(() => { save(); L(); }, 300); }; t.oninput = sv; b.oninput = sv;
  };
  r.querySelector('#nn').onclick = () => { const n = { id: Date.now(), t: '', b: '', ts: Date.now() }; S.notesL.unshift(n); cid = n.id; save(); L(); E(); r.querySelector('#nt').focus(); };
  r.querySelector('#nq').oninput = e => { q = e.target.value.toLowerCase(); L(); }; L(); E();
};

/* ================= PRIVACIDAD ================= */
PG.privacidad = r => {
  const P4 = [['cam', 'Cámara'], ['mic', 'Micrófono'], ['geo', 'Ubicación'], ['notif', 'Notificaciones']], O = [['allow', 'Permitir'], ['ask', 'Preguntar'], ['block', 'Bloquear']];
  r.innerHTML = `<h2>Centro de privacidad</h2><h3>Permisos de sitios</h3>` + P4.map(([k, n]) => `<div class="row"><span>${n}</span><div class="seg">${O.map(([v, l]) => `<button class="btn ${S.perms[k] === v ? 'on' : ''}" data-p="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('') +
    `<h3>Bloqueador de anuncios</h3><div class="row"><span>Activado · ${S.blocked.toLocaleString('es')} bloqueados</span><div class="sx ${S.adblock ? 'on' : ''}" id="pab"></div></div>
    <h3>Limpiar datos de navegación</h3>${[['hist', 'Historial'], ['cookies', 'Cookies'], ['cache', 'Caché'], ['storage', 'Almacenamiento de sitios'], ['dls', 'Descargas']].map(([k, n]) => `<label class="row" style="justify-content:flex-start"><input type="checkbox" data-c="${k}" ${k === 'cache' ? 'checked' : ''}> ${n}</label>`).join('')}<button class="btn on" id="pcl" style="align-self:flex-start">Limpiar ahora</button>`;
  $$('[data-p]', r).forEach(b => b.onclick = () => { S.perms[b.dataset.p] = b.dataset.v; save(); ipc.send('perm-policy', S.perms); PG.privacidad(r); });
  r.querySelector('#pab').onclick = () => { S.adblock = !S.adblock; save(); applyTheme(); PG.privacidad(r); };
  r.querySelector('#pcl').onclick = async () => {
    const o = {}; $$('[data-c]', r).forEach(c => o[c.dataset.c] = c.checked); if (!Object.values(o).some(Boolean)) return toast('Selecciona qué limpiar');
    if (o.hist) { S.hist = []; } if (o.dls) S.dls = S.dls.filter(d => d.state === 'progressing' || d.state === 'paused'); save(); await ipc.invoke('clear-data', o); toast('Datos limpiados');
  };
};

/* ================= NOVA IA 2.0 ================= */
const nrm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const md = s => esc(s).replace(/```([\s\S]*?)```/g, '<pre class="cb">$1</pre>').replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const sys = () => 'Eres Nova IA, el asistente integrado del navegador Nova. Responde en el idioma del usuario, breve y claro. ' + (S.persona || '');
const TH = { claro: 'light', oscuro: 'dark', nova: 'nova' };
const HELP = 'Puedo ejecutar órdenes:\n• "cambia el tema a neón / claro / oscuro"\n• "barra a la derecha / izquierda / dock"\n• "abre historial / descargas / marcadores / privacidad / juegos / ajustes / notas"\n• "busca gatos graciosos" · "abre youtube.com"\n• "2+2*5" · "qué hora es"\n• "activa modo oscuro" / "desactiva modo oscuro"\n• "captura" · "borra historial"\nPara todo lo demás, charla conmigo.';
function intent(raw) {
  const q = nrm(raw.trim()); let m;
  if (/^(ayuda|comandos|que puedes hacer)/.test(q)) return HELP;
  if ((m = q.match(/(?:tema|apariencia).*?(claro|oscuro|nova)/))) { const k = TH[m[1]]; if(k === 'dark') { S.quantumAppearance='dark'; } else if(k === 'light' || k === 'nova') { S.quantumAppearance = k === 'light' ? 'light' : 'system'; } save(); try { window.quantumSetAppearance?.(S.quantumAppearance); } catch {} return 'Apariencia actualizada.'; }
  if ((m = q.match(/barra.*(izquierda|derecha|dock|centro)/))) { S.sp = { izquierda: 'left', derecha: 'right', dock: 'dock', centro: 'dock' }[m[1]]; save(); applyTheme(); return 'Barra lateral movida.'; }
  if ((m = q.match(/^(?:abre|abrir|ve a|ir a|muestra|muestrame)\s+(?:el |la |los |las )?(historial|descargas|notas|juegos|ajustes|novedades|acerca|marcadores|privacidad)/))) { newTab('nova://' + m[1]); return 'Abriendo ' + m[1] + '.'; }
  if ((m = q.match(/^(?:abre|abrir|ve a|ir a)\s+(\S+\.\S+)/))) { newTab(toURL(m[1])); return 'Abriendo ' + m[1] + '.'; }
  if (/^(busca|buscar|googlea)\s+\S/.test(q)) { newTab(S.search + encodeURIComponent(raw.trim().replace(/^\S+\s+/, ''))); return 'Buscando…'; }
  if (/^[\d\s+\-*/().%^]+$/.test(q) && /\d/.test(q) && /[+\-*/^%]/.test(q)) { try { return '= ' + Function('"use strict";return (' + q.replace(/\^/g, '**') + ')')(); } catch { } }
  if (/que hora es|hora actual/.test(q)) return 'Son las ' + new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) + '.';
  if (/que dia es|fecha de hoy/.test(q)) return new Date().toLocaleDateString('es', { dateStyle: 'full' }) + '.';
  if (/^captura/.test(q)) { $('#sh').click(); return 'Haciendo captura…'; }
  if ((m = q.match(/^(activa|desactiva|pon|quita)\s+(?:el )?(modo oscuro|modo lectura|sin animaciones|texto grande)/))) {
    const k = { 'modo oscuro': 'dark', 'modo lectura': 'reader', 'sin animaciones': 'noanim', 'texto grande': 'zoom' }[m[2]], on = /activa|pon/.test(m[1]);
    S.mods[k] = on; save(); tabs.forEach(t => { try { mod(t.wv, k, on); } catch { } }); return (on ? 'Activado: ' : 'Desactivado: ') + m[2] + '.';
  }
  if (/borra(r)? (el )?historial/.test(q)) { S.hist = []; save(); return 'Historial borrado.'; }
  return null;
}
let box, busy = false, stopped = false;
const conv = () => { let c = S.convs.find(x => x.id === S.cid); if (!c) { c = { id: Date.now(), title: 'Nueva conversación', msgs: [], ts: Date.now() }; S.convs.unshift(c); S.cid = c.id; } return c; };
const status = t => { const e = $('#ast'); if (e) e.textContent = t; };
function addMsg(role, html, raw) { const d = document.createElement('div'); d.className = 'm ' + (role === 'user' ? 'u' : 'a'); d.dataset.raw = raw ?? html; d.innerHTML = html; box.appendChild(d); box.scrollTop = 1e9; return d; }
const fin = (el, txt) => { el.dataset.raw = txt; el.innerHTML = md(txt) + '<br><button class="cp">Copiar</button>'; box.scrollTop = 1e9; };
function typeOut(el, txt, done) {
  if (!S.anim) { fin(el, txt); return done && done(); }
  let i = 0; const stp = Math.max(3, txt.length / 120 | 0), iv = setInterval(() => { i += stp; if (stopped || !el.isConnected) { clearInterval(iv); fin(el, txt.slice(0, i)); return done && done(); } el.textContent = txt.slice(0, i); box.scrollTop = 1e9; if (i >= txt.length) { clearInterval(iv); fin(el, txt); done && done(); } }, 16);
}
function ban(msg, err, btn) { const b = $('#aban'); if (b) { b.innerHTML = msg ? `<div class="ban ${err ? 'err' : ''}"><span>${msg}</span>${btn ? `<button class="btn" id="abn">${btn}</button>` : ''}</div>` : ''; if (btn && $('#abn')) $('#abn').onclick = () => newTab('nova://ajustes'); } }
async function ask(text, shown, o = {}) {
  if (busy) return toast('Nova IA sigue respondiendo…'); text = (text || '').trim(); if (!text || !box || !box.isConnected) return;
  const c = conv(); addMsg('user', esc(shown || text).replace(/\n/g, '<br>'), shown || text); c.msgs.push({ role: 'user', content: shown || text }); if (c.title === 'Nueva conversación') { c.title = (shown || text).slice(0, 38); const s = $('#acs'); if (s) aiPanelHead(); }
  const fin2 = (out, err) => { c.msgs.push({ role: 'assistant', content: out }); c.ts = Date.now(); S.convs = S.convs.slice(0, 40); save(); busy = false; status(err ? 'Error' : 'Listo'); $('#aig') && ($('#aig').textContent = 'Enviar'); };
  const loc = intent(text); busy = true; stopped = false; $('#aig').textContent = 'Detener';
  if (loc) { typeOut(addMsg('assistant', ''), loc, () => fin2(loc)); return; }
  if (!navigator.onLine) { const t = 'Sin conexión: no puedo contactar con la IA. Mis órdenes locales (escribe "ayuda") siguen funcionando.'; ban('Sin conexión', true); typeOut(addMsg('assistant', ''), t, () => fin2(t, true)); return; }
  const el = addMsg('assistant', '<span class="dots"><i></i><i></i><i></i></span>'); status('Pensando…');
  let ctx = ''; if ((o.page || ($('#actx') && $('#actx').checked))) ctx = await pageText();
  const prev = c.msgs.slice(0, -1).slice(-10); while (prev.length && prev[0].role !== 'user') prev.shift();
  const res = await ipc.invoke('ai-ask', { msgs: [...prev, { role: 'user', content: text }], system: sys() + (ctx ? '\n\nContenido de la página que el usuario está viendo:\n' + ctx : ''), model: S.model });
  if (stopped) { el.remove(); busy = false; status('Detenido'); $('#aig') && ($('#aig').textContent = 'Enviar'); return; }
  if (res.error) { const t = 'No pude obtener respuesta (' + res.error + '). ' + (S.hasKey ? 'Revisa tu clave y modelo en Ajustes > Nova IA.' : 'El modo gratuito depende de un servicio externo; puedes añadir una clave API en Ajustes.'); ban(res.error, true); status('Error'); typeOut(el, t, () => fin2(t, true)); return; }
  ban(res.src === 'free' ? 'Modo gratuito activo. Añade una clave API en Ajustes para usar Claude.' : '', false, res.src === 'free' ? 'Ajustes' : ''); status('Generando…'); typeOut(el, res.text, () => fin2(res.text));
}
function aiPanelHead() {
  const s = $('#acs'); if (s) { s.innerHTML = S.convs.map(x => `<option value="${x.id}">${esc(x.title)}</option>`).join(''); s.value = S.cid; }
}
function aiPanel() {
  const p = $('#pin'); if (panel !== 'ai') return; const c = conv();
  p.innerHTML = `<div class="row"><h3>Nova IA</h3><span class="mut" id="ast">Listo</span></div>
  <div class="row"><select class="fld" id="acs"></select><button class="btn" id="anw" title="Nueva conversación">＋</button><button class="btn" id="arn" title="Renombrar">✎</button><button class="btn" id="adl" title="Eliminar">✕</button></div><div id="aban"></div>
  <div class="chips"><button class="btn" data-a="sum">Resumir página</button><button class="btn" data-a="exp">Explicar página</button><button class="btn" data-a="tr">Traducir selección</button><button class="btn" data-a="ssum">Resumir selección</button><button class="btn" data-a="rw">Reescribir selección</button><button class="btn" data-a="code">Código</button><button class="btn" data-a="gen">Generar texto</button><button class="btn" data-a="idea">Ideas</button></div>
  <label class="mut" style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="actx"> Usar la página actual como contexto</label>
  <div id="chat"></div><div class="row" style="align-items:flex-end"><textarea id="aiq" class="fld" rows="2" placeholder="Escribe aquí… (Enter envía · Shift+Enter salto de línea)"></textarea><button class="btn on" id="aig">Enviar</button></div>`;
  box = p.querySelector('#chat'); aiPanelHead();
  if (!S.hasKey) ban('Modo gratuito activo. Añade una clave API en Ajustes para usar Claude.', false, 'Ajustes'); if (!navigator.onLine) ban('Sin conexión', true);
  if (!c.msgs.length) addMsg('assistant', md('¡Hola! Soy **Nova IA**. Pregúntame sobre la página, pídeme resúmenes, traducciones, código o ideas. Escribe "ayuda" para ver mis órdenes.'));
  c.msgs.forEach(m => { const el = addMsg(m.role, m.role === 'user' ? esc(m.content).replace(/\n/g, '<br>') : '', m.content); if (m.role !== 'user') fin(el, m.content); });
  const q = $('#aiq'), send = () => { if (busy) { stopped = true; return; } const v = q.value; q.value = ''; ask(v); };
  q.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }; $('#aig').onclick = send;
  box.onclick = e => { const b = e.target.closest('.cp'); if (b) { navigator.clipboard.writeText(b.parentElement.dataset.raw); b.textContent = '¡Copiado!'; } };
  $('#acs').onchange = e => { S.cid = +e.target.value; save(); aiPanel(); };
  $('#anw').onclick = () => { const n = { id: Date.now(), title: 'Nueva conversación', msgs: [], ts: Date.now() }; S.convs.unshift(n); S.cid = n.id; save(); aiPanel(); };
  $('#arn').onclick = () => dlg('Renombrar conversación', [{ k: 't', label: 'Título', val: c.title }], v => { c.title = v.t || c.title; save(); aiPanelHead(); });
  $('#adl').onclick = () => { if (confirm('¿Eliminar esta conversación?')) { S.convs = S.convs.filter(x => x !== c); S.cid = S.convs[0]?.id; save(); aiPanel(); } };
  const S1 = async (pre, tag) => { const t = await selText(); t ? ask(pre + t, tag + ': ' + t.slice(0, 70)) : toast('Selecciona texto en la página primero'); };
  const A = { sum: () => ask('Resume esta página en español, con los puntos clave.', 'Resumir página', { page: 1 }), exp: () => ask('Explica de qué trata esta página y qué información importante contiene.', 'Explicar página', { page: 1 }),
    tr: () => S1('Traduce al español, solo la traducción:\n\n', 'Traducir'), ssum: () => S1('Resume este texto en pocas frases:\n\n', 'Resumir'), rw: () => S1('Reescribe este texto para que sea más claro y natural, manteniendo el significado:\n\n', 'Reescribir'),
    code: () => { q.value = 'Ayúdame con este código:\n'; q.focus(); }, gen: () => { q.value = 'Escribe un texto sobre: '; q.focus(); }, idea: () => { q.value = 'Dame 10 ideas sobre: '; q.focus(); } };
  $$('[data-a]', p).forEach(b => b.onclick = A[b.dataset.a]); q.focus();
}
ipc.on('ask-ai', async (_, { m, t }) => {
  panel = 'ai'; draw();
  if (m === 'ask') { const q = $('#aiq'); q.value = 'Sobre este texto: «' + t.slice(0, 500) + '»\n'; q.focus(); return; }
  ask((m === 'tr' ? 'Traduce al español, solo la traducción:\n\n' : 'Explica de forma sencilla:\n\n') + t, (m === 'tr' ? 'Traducir: ' : 'Explicar: ') + t.slice(0, 70));
});
ipc.on('ctx-search', (_, t) => newTab(S.search + encodeURIComponent(t)));
const bd4 = draw; draw = function () { bd4(); if (panel === 'ai') aiPanel(); };

/* ================= ATAJOS, PALETA, AJUSTES ================= */
const toggleAI = () => { panel = panel === 'ai' ? null : 'ai'; draw(); };
const openAI = () => { if (panel !== 'ai') { panel = 'ai'; draw(); } };
NOVA.toggleAI = toggleAI; NOVA.openAI = openAI; NOVA.aiPanel = aiPanel; NOVA.askAI = ask;
const K = { r: () => { const t=N.activeWebTab?.()||cur; t?.wv?.reload?.(); }, R: () => { const t=N.activeWebTab?.()||cur; try { t?.wv?.reloadIgnoringCache?.(); } catch { t?.wv?.reload?.(); } }, D: bookmarkAll, B: () => N.bbar(), ' ': toggleAI, tab: () => step(1), 'shift-tab': () => step(-1), shot: () => $('#sh').click() };
ipc.on('key', (_, k) => K[k] && K[k]());
document.addEventListener('keydown', e => { if (!e.ctrlKey) return; const k = e.key === 'Tab' ? (e.shiftKey ? 'shift-tab' : 'tab') : e.key; if (K[k] && k !== 'shot') { e.preventDefault(); K[k](); } });
NOVA.extraActs = [['Cerrar pestaña', () => closeTab(cur)], ['Reabrir pestaña cerrada', reopen], ['Marcadores', () => newTab('nova://marcadores')], ['Guardar esta página', saveMark], ['Guardar todas las pestañas', bookmarkAll], ['Mostrar/ocultar barra de marcadores', toggleBar],
  ['Modo oscuro', () => { S.theme = 'nova'; save(); applyTheme(); refreshNT(); }], ['Modo claro', () => { S.theme = 'light'; save(); applyTheme(); refreshNT(); }], ['Tema del sistema', () => { S.theme = 'system'; save(); applyTheme(); refreshNT(); }],
  ['Abrir Nova IA', toggleAI], ['Resumir página', () => { panel = 'ai'; draw(); setTimeout(() => $('[data-a=sum]') && $('[data-a=sum]').click(), 60); }], ['Centro de privacidad', () => newTab('nova://privacidad')], ['Limpiar datos de navegación', () => newTab('nova://privacidad')],
  ['Pantalla completa', () => ipc.send('win', 'full')], ['Recargar', K.r], ['Recargar sin caché', K.R], ['Buscar actualizaciones', () => checkUpdate(true)]];
const SC = [['Ctrl+T', 'Nueva pestaña'], ['Ctrl+W', 'Cerrar pestaña'], ['Ctrl+Shift+T', 'Reabrir pestaña'], ['Ctrl+Tab / Ctrl+Shift+Tab', 'Pestaña siguiente / anterior'], ['Ctrl+L', 'Barra de direcciones'], ['Ctrl+K', 'Command Center'], ['Ctrl+Espacio', 'Nova IA'], ['Ctrl+H', 'Historial'], ['Ctrl+J', 'Descargas'], ['Ctrl+D', 'Guardar marcador'], ['Ctrl+Shift+D', 'Guardar todas las pestañas'], ['Ctrl+Shift+B', 'Barra de marcadores'], ['Ctrl+R', 'Recargar'], ['Ctrl+Shift+R', 'Recargar sin caché'], ['Ctrl+F', 'Buscar en la página']];
SECT.push(['inicio', 'Página de inicio'], ['priv', 'Privacidad'], ['atajos', 'Atajos']);
SEC.inicio = c => {
  const W = [['clock', 'Reloj y saludo'], ['search', 'Buscador'], ['quick', 'Accesos rápidos'], ['recent', 'Páginas recientes'], ['dl', 'Descargas'], ['ai', 'Botón de Nova IA']];
  c.innerHTML = '<h2>Página de inicio</h2>' + W.map(([k, n]) => row(n, `<div class="sx ${S.dash[k] !== false ? 'on' : ''}" data-d="${k}"></div>`)).join('') + `<span class="mut">Accesos rápidos propios (uno por línea: Nombre | https://…). Vacío = tus marcadores.</span><textarea class="fld" id="qk" rows="5">${esc(S.quick.map(q => q.t + ' | ' + q.u).join('\n'))}</textarea>`;
  $$('[data-d]', c).forEach(b => b.onclick = () => { S.dash[b.dataset.d] = S.dash[b.dataset.d] === false; save(); b.classList.toggle('on'); refreshNT(); });
  c.querySelector('#qk').onchange = e => { S.quick = e.target.value.split('\n').map(l => l.split('|').map(x => x.trim())).filter(a => a[0] && /^https?:/.test(a[1] || a[0])).map(a => a[1] ? { t: a[0], u: a[1] } : { t: a[0], u: a[0] }).slice(0, 12); save(); refreshNT(); };
};
SEC.priv = c => { c.innerHTML = '<h2>Privacidad</h2><span class="mut">Permisos, bloqueador y limpieza de datos.</span><button class="btn on" id="op" style="align-self:flex-start">Abrir el Centro de privacidad</button>'; c.querySelector('#op').onclick = () => newTab('nova://privacidad'); };
SEC.atajos = c => { c.innerHTML = '<h2>Atajos de teclado</h2>' + SC.map(([k, n]) => `<div class="li" style="cursor:default"><b>${k}</b><span class="mut">${n}</span></div>`).join(''); };
const oj = PG.juegos; PG.juegos = r => { oj(r); r.insertAdjacentHTML('beforeend', `<span class="mut">Récords · Runner: ${S.hs.runner || 0} · Memoria: ${S.hs.mem ? S.hs.mem + ' movimientos' : '—'}</span>`); };

/* ================= ACTUALIZACIONES ================= */
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); } return 0; };
async function checkUpdate(manual) {
  try {
    const j = await (await fetch(`https://api.github.com/repos/${REPO}/releases/latest`)).json(), m = (j.assets || []).map(a => a.name).join(' ').match(/Nova-(?:Setup|Portable)-(\d+\.\d+\.\d+)/), v = m && m[1];
    if (!v) return manual && toast('No se pudo leer la última versión');
    if (cmp(v, VER) > 0) { if (manual || S.updLater !== v) updBanner(v, j.html_url); } else if (manual) toast('Nova está actualizada (' + VER + ')');
  } catch { manual && toast('Sin conexión para buscar actualizaciones'); }
}
function updBanner(v, url) {
  if ($('.upd')) return; const d = document.createElement('div'); d.className = 'upd';
  d.innerHTML = `<b>Nueva versión disponible</b><span>Nova ${v} (tienes la ${VER})</span><div class="row"><button class="btn" id="ul">Más tarde</button><button class="btn on" id="ua">Actualizar</button></div>`; document.body.appendChild(d);
  d.querySelector('#ul').onclick = () => { S.updLater = v; save(); d.remove(); }; d.querySelector('#ua').onclick = () => { newTab(url); d.remove(); };
}
const oab = PG.acerca; PG.acerca = r => { oab(r); r.insertAdjacentHTML('beforeend', '<button class="btn" id="cu" style="align-self:flex-start">Buscar actualizaciones</button>'); r.querySelector('#cu').onclick = () => checkUpdate(true); };
setTimeout(() => checkUpdate(false), 6000);

applyTheme(); bmBar(); layout();
})();


/* ---- extras5.js ---- */
/* Nova 1.6.1 - logotipos, animación de inicio, sonidos, colores de la barra, tienda de extensiones, bienvenida */
(() => {
const { PG, MENU, sw2, SEC } = NOVA, EXT = require('./extensions.js');
const PR = ipc.sendSync('prefs-get') || {};           // preferencias que también lee el proceso principal
const setPR = p => { Object.assign(PR, p); ipc.send('prefs-set', p); };
if (PR.logo && !S.logo) S.logo = PR.logo;
S.logo = 'quantum';

/* ---------- estilos ---------- */
const st = document.createElement('style');
st.textContent = `
.lgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}
.lg{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;background:var(--bar);border:2px solid var(--bd);border-radius:var(--r);cursor:pointer;transition:border-color .12s,transform .12s}
.lg:hover{transform:translateY(-2px)}.lg.on{border-color:var(--acc)}.lg img{width:64px;height:64px}
.pal{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.pw{width:56px;height:34px;border-radius:10px;border:2px solid var(--bd);cursor:pointer;display:grid;place-items:center;font-size:11px;color:var(--mut);transition:transform .12s,border-color .12s}
.pw:hover{transform:translateY(-1px)}.pw.on{border-color:var(--acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 30%,transparent)}
.xg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.xc{display:flex;flex-direction:column;gap:8px;padding:14px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r) * 1.4);transition:border-color .12s}
.xc:hover{border-color:var(--acc)}.xc b{font-size:14px}.xc p{margin:0;color:var(--mut);font-size:12.5px;flex:1}
.xc .row .tag{font-size:11px;color:var(--mut)}
.bcard{display:flex;flex-direction:column;gap:10px;padding:18px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r) * 1.6)}
.prev{width:420px;height:420px;border:0;background:transparent}
body.has-topc:not(.t-win95):not(.t-undertale):not(.t-code) #top{background:linear-gradient(90deg,color-mix(in srgb,var(--topc1) var(--topi),var(--bg)),color-mix(in srgb,var(--topc2) var(--topi),var(--bg)))!important;transition:background .25s}
`;
document.head.appendChild(st);

/* ---------- logotipos ---------- */
const LG = { quantum: 'Nova Quantum' };
const logoSrc = () => '../assets/icon.png';
const syncLogo = () => { const s = logoSrc(S.logo); document.querySelectorAll('img[src$="assets/icon.png"]').forEach(i => { if (!i.dataset.keep && i.getAttribute('src') !== s) i.setAttribute('src', s); }); };
let raf = 0; new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; syncLogo(); }); }).observe(document.body, { childList: true, subtree: true });
const setLogo = id => { if (!LG[id]) return; S.logo = id; save(); setPR({ logo: id }); syncLogo(); try { refreshNT(); } catch { } };

/* ---------- colores suaves de la barra superior ---------- */
const PAL = { ninguno: ['Ninguno'], lavanda: ['Lavanda', '#c4b5fd', '#a5b4fc'], menta: ['Menta', '#a7f3d0', '#99f6e4'], melocoton: ['Melocotón', '#fdba74', '#fda4af'], cielo: ['Cielo', '#93c5fd', '#a5f3fc'], rosa: ['Rosa', '#f9a8d4', '#fbcfe8'], arena: ['Arena', '#fde68a', '#fed7aa'] };
const applyTop = () => {
  const b = document.body, t = S.topc || 'ninguno', c1 = t === 'custom' ? (S.topcc || '#c4b5fd') : (PAL[t] || [])[1], c2 = t === 'custom' ? c1 : (PAL[t] || [])[2];
  if (!c1) { b.classList.remove('has-topc'); return; }
  b.style.setProperty('--topc1', c1); b.style.setProperty('--topc2', c2); b.style.setProperty('--topi', (S.topi || 34) + '%'); b.classList.add('has-topc');
};
const bAT = applyTheme; applyTheme = function () { bAT(); applyTop(); };

/* ---------- sonidos (sintetizados: no hay archivos de audio) ---------- */
S.snd = Object.assign({ pack: 'suave', v: 35, start: true }, S.snd || {});
const PK = { off: 'Sin sonido', suave: 'Suave', cristal: 'Cristal', retro: 'Retro', burbuja: 'Burbuja' };
const NOTES = {
  suave: { w: 'sine', d: .18, new: [[523], [659, .07]], close: [[440], [330, .07]], dl: [[523], [659, .09], [784, .18]], start: [[392], [523, .1], [659, .2]] },
  cristal: { w: 'sine', d: .45, new: [[1047]], close: [[784]], dl: [[1319], [1568, .1]], start: [[1047], [1319, .12], [1568, .24]] },
  retro: { w: 'square', d: .09, g: .35, new: [[660], [880, .06]], close: [[440], [330, .06]], dl: [[523], [659, .07], [784, .14], [1047, .21]], start: [[262], [330, .08], [392, .16], [523, .24]] },
  burbuja: { w: 'sine', d: .16, new: [[300, 0, 700]], close: [[700, 0, 300]], dl: [[400, 0, 900], [600, .12, 1200]], start: [[300, 0, 900], [500, .15, 1100]] }
};
let ctx, quiet = true, lastS = {}; setTimeout(() => quiet = false, 2800); // sin ruido mientras se restauran pestañas
const snd = (ev, force) => {
  const c = S.snd; if (!c || c.pack === 'off' || (ev === 'start' && c.start === false)) return;
  const P = NOTES[c.pack]; if (!P || !P[ev]) return; const now = Date.now();
  if (!force && ((quiet && ev !== 'start') || now - (lastS[ev] || 0) < 150)) return; lastS[ev] = now;
  try {
    ctx = ctx || new AudioContext(); if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime, vol = Math.max(.0002, (c.v / 100) * .22 * (P.g || 1));
    P[ev].forEach(([f, dl = 0, to]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = P.w; o.frequency.setValueAtTime(f, t0 + dl);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dl + P.d);
      g.gain.setValueAtTime(.0001, t0 + dl); g.gain.exponentialRampToValueAtTime(vol, t0 + dl + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + dl + P.d);
      o.connect(g); g.connect(ctx.destination); o.start(t0 + dl); o.stop(t0 + dl + P.d + .05);
    });
  } catch { }
};
const _nt = newTab; newTab = function () { snd('new'); return _nt.apply(this, arguments); };
const _ct = closeTab; closeTab = function () { snd('close'); return _ct.apply(this, arguments); };
ipc.on('dl', (_, d) => { if (d.state === 'completed') snd('dl'); });
setTimeout(() => snd('start'), 500);

/* ---------- páginas ---------- */
const chip = (on, a, l) => `<button class="btn ${on ? 'on' : ''}" ${a}>${l}</button>`;
const tgl = (id, on) => `<div class="sw ${on ? 'on' : ''}" id="${id}"></div>`;
function preview(logo) {
  const ov = document.createElement('div'); ov.className = 'ov'; ov.innerHTML = `<iframe class="prev" src="splash.html?logo=${logo}"></iframe>`;
  document.body.appendChild(ov); const end = () => ov.remove(); ov.onclick = end; setTimeout(end, 3600);
}
const appearanceBlock = (host, again) => {
  const q = s => host.querySelector(s), top = S.topc || 'ninguno';
  host.insertAdjacentHTML('beforeend', `<div class="apx" style="display:flex;flex-direction:column;gap:12px">
  <h3>Logotipo</h3><span class="mut">Se aplica a la barra, la nueva pestaña, la animación de inicio, la ventana y la barra de tareas de Windows, además de los accesos directos. Si un icono anclado tarda en actualizarse, ciérralo y ábrelo de nuevo.</span>
  <div class="lgs">${Object.entries(LG).map(([k, n]) => `<div class="lg ${S.logo === k ? 'on' : ''}" data-lg="${k}"><img data-keep="1" src="${logoSrc(k)}"><span>${n}</span></div>`).join('')}</div>
  <h3>Animación de inicio</h3>
  <div class="row"><span>Mostrar animación al abrir Nova</span>${tgl('spl', PR.splash !== false)}</div>
  <div class="row"><span>Ver la animación de este logotipo</span><button class="btn" id="pv">Reproducir</button></div>
  <h3>Color de la barra superior</h3><span class="mut">Un tono suave sobre el tema que uses.</span>
  <div class="pal">${Object.entries(PAL).map(([k, [n, a, b]]) => `<div class="pw ${top === k ? 'on' : ''}" data-tc="${k}" title="${n}" style="${a ? `background:linear-gradient(90deg,${a},${b})` : 'background:var(--bar)'}">${a ? '' : '—'}</div>`).join('')}
    <input type="color" id="tcc" value="${S.topcc || '#c4b5fd'}" title="Color propio"></div>
  <div class="row"><span>Intensidad</span><input type="range" id="ti" min="10" max="60" value="${S.topi || 34}"></div>
  <h3>Sonidos</h3><span class="mut">Se generan en el momento, sin descargar nada.</span>
  <div class="chips">${Object.entries(PK).map(([k, n]) => chip(S.snd.pack === k, `data-pk="${k}"`, n)).join('')}</div>
  <div class="row"><span>Volumen</span><input type="range" id="vol" min="5" max="100" value="${S.snd.v}"></div>
  <div class="row"><span>Sonido al iniciar</span>${tgl('sst', S.snd.start !== false)}</div></div>`);
  host.querySelectorAll('.apx [data-lg]').forEach(e => e.onclick = () => { setLogo(e.dataset.lg); again(); });
  q('#spl').onclick = () => { setPR({ splash: PR.splash === false }); again(); };
  q('#pv').onclick = () => preview(S.logo);
  host.querySelectorAll('.apx [data-pk]').forEach(e => e.onclick = () => { S.snd.pack = e.dataset.pk; save(); snd('new', true); again(); });
  q('#vol').onchange = e => { S.snd.v = +e.target.value; save(); snd('dl', true); };
  q('#sst').onclick = () => { S.snd.start = S.snd.start === false; save(); again(); };
  host.querySelectorAll('.apx [data-tc]').forEach(e => e.onclick = () => { S.topc = e.dataset.tc; save(); applyTop(); again(); });
  q('#tcc').oninput = e => { S.topc = 'custom'; S.topcc = e.target.value; save(); applyTop(); };
  q('#tcc').onchange = again;
  q('#ti').oninput = e => { S.topi = +e.target.value; save(); applyTop(); };
};
// Ajustes › Apariencia incluye ahora logotipos, animación de inicio, color de barra y sonidos
const pAj = PG.ajustes;
PG.ajustes = r => {
  pAj(r); const k = r.querySelector('nav .btn.on')?.dataset.k, c = r.querySelector('#sc');
  if (k === 'apariencia' && c) appearanceBlock(c, () => PG.ajustes(r));
};
// "Personalizar" se conserva como acceso directo a Ajustes › Apariencia
PG.personalizar = r => { PG.ajustes(r); const b = r.querySelector('nav .btn[data-k="apariencia"]'); if (b && !b.classList.contains('on')) b.click(); };

const extState = id => (PR.ext || {})[id];               // undefined = no instalada, true/false = instalada activa/pausada
const setExt = (id, v) => { const e = Object.assign({}, PR.ext || {}); v === null ? delete e[id] : e[id] = v; PR.ext = e; ipc.send('prefs-set', { ext: e }); };
let sq = '', sc = 'Todas';
PG.tienda = r => {
  const cats = ['Todas', ...new Set(EXT.CATALOG.map(x => x.cat))], q = sq.trim().toLowerCase();
  const list = EXT.CATALOG.filter(x => (sc === 'Todas' || x.cat === sc) && (!q || (x.name + ' ' + x.desc).toLowerCase().includes(q)));
  r.innerHTML = `<h2>Tienda de extensiones</h2><span class="mut">Extensiones creadas por Nova. Se instalan al instante y funcionan sin conexión. No son extensiones de Chrome.</span>
  <input class="fld" id="xs" placeholder="Buscar extensiones" value="${esc(sq)}">
  <div class="chips">${cats.map(c => chip(sc === c, `data-c="${c}"`, c)).join('')}</div>
  <div class="xg">${list.map(x => { const s = extState(x.id), inst = s !== undefined;
    return `<div class="xc"><div class="row"><b>${x.name}</b><span class="tag">${x.cat}</span></div><p>${x.desc}</p>
    <div class="row">${inst ? `<span>${s ? 'Activa' : 'Pausada'}</span><div class="row" style="gap:8px"><div class="sw ${s ? 'on' : ''}" data-x="${x.id}"></div><button class="btn" data-rm="${x.id}">Quitar</button></div>` : `<span class="tag">Por Nova</span><button class="btn on" data-in="${x.id}">Instalar</button>`}</div></div>`; }).join('') || '<span class="mut">No hay resultados.</span>'}</div>`;
  const ren = () => PG.tienda(r);
  const xs = r.querySelector('#xs'); xs.oninput = e => { sq = e.target.value; const p = e.target.selectionStart; ren(); const n = r.querySelector('#xs'); n.focus(); n.setSelectionRange(p, p); };
  r.querySelectorAll('[data-c]').forEach(e => e.onclick = () => { sc = e.dataset.c; ren(); });
  r.querySelectorAll('[data-in]').forEach(e => e.onclick = () => { setExt(e.dataset.in, true); toast('Extensión instalada'); ren(); });
  r.querySelectorAll('[data-rm]').forEach(e => e.onclick = () => { setExt(e.dataset.rm, null); ren(); });
  r.querySelectorAll('[data-x]').forEach(e => e.onclick = () => { setExt(e.dataset.x, !extState(e.dataset.x)); ren(); });
};

/* ================= MIGRACIÓN DE NAVEGADORES ================= */
let migSources = [];
const migMerge = (src, data) => {
  const pref = `Importados/${src.browserName}/${src.profileName}`;
  const marks = data.bookmarks?.items || [], folders = data.bookmarks?.folders || [];
  const seenMarks = new Set(S.marks.map(x => x.u)); let nm = 0;
  folders.forEach(f => { const full = `${pref}/${f}`.replace(/\/+/g, '/'); if (!S.folders.includes(full)) S.folders.push(full); });
  marks.forEach(m => {
    if (!m || !/^https?:\/\//i.test(String(m.u || '')) || seenMarks.has(m.u)) return;
    const f = m.f ? `${pref}/${m.f}`.replace(/\/+/g, '/') : pref;
    S.marks.push({ u: String(m.u), t: String(m.t || m.u).slice(0, 500), f }); seenMarks.add(m.u); nm++;
    if (!S.folders.includes(f)) S.folders.push(f);
  });
  const hm = new Map(S.hist.map(x => [x.u, x])); let nh = 0;
  for (const h of (data.history || [])) {
    if (!h || !/^https?:\/\//i.test(String(h.u || ''))) continue;
    const old = hm.get(h.u);
    if (!old) { hm.set(h.u, { u: String(h.u), t: String(h.t || h.u).slice(0, 500), d: Number(h.d) || Date.now() }); nh++; }
    else if ((Number(h.d) || 0) > (Number(old.d) || 0)) { old.t = String(h.t || old.t).slice(0, 500); old.d = Number(h.d) || old.d; }
  }
  S.hist = [...hm.values()].sort((a, b) => (b.d || 0) - (a.d || 0)).slice(0, 500);
  save(); refreshNT();
  return { nm, nh };
};
const migScan = async () => {
  try { migSources = await ipc.invoke('migration-scan'); return Array.isArray(migSources) ? migSources : []; }
  catch { migSources = []; return []; }
};
const migLabel = s => `${s.browserName} · ${s.profileName}`;
PG.migrar = async r => {
  r.innerHTML = `<h2>Migrar desde otro navegador</h2>
    <span class="mut">Importa marcadores e historial de Chrome, Edge o Firefox. Nova solo lee los datos y no borra ni modifica el navegador de origen. Para obtener una copia consistente, cierra el navegador antes de importar.</span>
    <div class="row" style="flex-wrap:wrap"><label class="btn on"><input type="checkbox" id="migb" checked> Marcadores</label><label class="btn on"><input type="checkbox" id="migh" checked> Historial</label><button class="btn" id="migr">Volver a buscar perfiles</button></div>
    <div id="miglist" style="display:flex;flex-direction:column;gap:8px"></div>
    <div class="bcard" style="margin-top:4px"><h3>Contraseñas</h3><span class="mut">No se copian automáticamente desde los perfiles. Nova no extrae claves cifradas de Chrome, Edge o Firefox; así se evita exponer credenciales durante la migración.</span></div>`;
  const list = r.querySelector('#miglist'), btnRefresh = r.querySelector('#migr');
  const render = () => {
    list.innerHTML = migSources.length ? migSources.map(s => `<div class="li" style="cursor:default;flex-direction:column"><div class="row"><div style="min-width:0"><b>${esc(migLabel(s))}</b><div class="mut">${s.bookmarks ? 'Marcadores disponibles' : 'Sin marcadores detectados'} · ${s.history ? 'Historial disponible' : 'Sin historial detectado'}</div></div><button class="btn on" data-mi="${s.id}">Importar</button></div></div>`).join('') : '<span class="mut">No se han encontrado perfiles locales de Chrome, Edge o Firefox.</span>';
    list.querySelectorAll('[data-mi]').forEach(b => b.onclick = async () => {
      b.disabled = true; b.textContent = 'Importando…';
      const src = migSources.find(x => x.id === b.dataset.mi), o = { id: b.dataset.mi, bookmarks: r.querySelector('#migb').checked, history: r.querySelector('#migh').checked };
      if (!o.bookmarks && !o.history) { toast('Selecciona qué quieres migrar'); b.disabled = false; b.textContent = 'Importar'; return; }
      try {
        const d = await ipc.invoke('migration-read', o);
        if (d.error) throw new Error(d.error);
        const n = migMerge(src, d); toast(`${migLabel(src)} · ${n.nm} marcadores · ${n.nh} entradas de historial importadas`);
        b.disabled = false; b.textContent = 'Importar de nuevo';
      } catch (e) { toast('No se pudo importar: ' + (e.message || 'error de lectura')); b.disabled = false; b.textContent = 'Reintentar'; }
    });
  };
  const scan = async () => { btnRefresh.disabled = true; btnRefresh.textContent = 'Buscando…'; await migScan(); render(); btnRefresh.disabled = false; btnRefresh.textContent = 'Volver a buscar perfiles'; };
  btnRefresh.onclick = scan;
  await scan();
};

PG.bienvenida = async r => {
  const st0 = await ipc.invoke('default-browser', false);
  r.innerHTML = `<div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:10px"><img src="${logoSrc(S.logo)}" width="96"><h2 style="font-size:32px">Bienvenido a Nova</h2><span class="mut">Un navegador rápido, moderno y privado.</span></div>
  <div class="bcard"><h3>Navegador predeterminado</h3>${st0.portable
    ? '<span class="mut">Estás usando la versión portable, que no se puede registrar como navegador. Instala Nova con Nova-Setup para elegirla.</span>'
    : st0.isDefault ? '<span>✓ Nova ya es tu navegador predeterminado.</span>'
    : '<span class="mut">Abre los enlaces de otras aplicaciones directamente en Nova. Se abrirá la configuración de Windows en la página de Nova: pulsa «Establecer como predeterminado».</span><button class="btn on" id="db" style="align-self:flex-start">Hacer Nova mi navegador predeterminado</button>'}</div>
  <div class="bcard"><h3>Hazlo tuyo</h3><span class="mut">Cambia el logotipo, los sonidos y el color de la barra.</span><button class="btn" id="gp" style="align-self:flex-start">Abrir Apariencia</button></div>
  <div class="bcard"><h3>Extensiones</h3><span class="mut">Añade funciones con la tienda de extensiones de Nova.</span><button class="btn" id="gt" style="align-self:flex-start">Abrir la tienda</button></div><div class="bcard"><h3>Migrar desde otro navegador</h3><span class="mut">Trae marcadores e historial desde Chrome, Edge o Firefox sin tocar el navegador de origen.</span><button class="btn" id="gm" style="align-self:flex-start">Abrir migrador</button></div>`;
  const b = r.querySelector('#db'); if (b) b.onclick = async () => {
    await ipc.invoke('default-browser', true); toast('Pulsa «Establecer como predeterminado» en Windows');
    let n = 0; const t = setInterval(async () => { // comprueba cada 2 s si ya lo has cambiado (hasta 2 minutos)
      const st = await ipc.invoke('default-browser', false);
      if (st.isDefault) { clearInterval(t); toast('✓ Nova es ahora tu navegador predeterminado'); PG.bienvenida(r); } else if (++n > 60) clearInterval(t);
    }, 2000);
  };
  r.querySelector('#gp').onclick = () => newTab('nova://personalizar'); r.querySelector('#gt').onclick = () => newTab('nova://tienda'); r.querySelector('#gm').onclick = () => newTab('nova://migrar');
};
NOVA.extraActs = (NOVA.extraActs || []).concat([['Migrar desde Chrome / Edge / Firefox', () => newTab('nova://migrar')]]);
Object.assign(NOVA, { LG, setLogo });
NOVA.welcome = () => { S.welcomed = 1; save(); newTab('nova://bienvenida'); };

/* ---------- menú ---------- */
MENU.splice(5, 0, ['Apariencia y logotipo', () => newTab('nova://personalizar')], ['Tienda de extensiones', () => newTab('nova://tienda')], ['Migrar desde Chrome / Edge / Firefox', () => newTab('nova://migrar')], ['Navegador predeterminado', () => newTab('nova://bienvenida')], ['Guía de inicio', () => NOVA.tour()]);
const mp = document.getElementById('mnp'); if (mp) mp.innerHTML = MENU.map((m, i) => `<button data-i="${i}">${m[0]}</button>`).join('');

applyTheme(); syncLogo();
if (S.done && !S.welcomed) setTimeout(NOVA.welcome, 2600);
})();


/* ---- extras6.js ---- */
/* Nova 1.6.4 - capa aditiva: marcadores inferiores, bienvenida visual, rendimiento/RAM, seguridad, novedades y extensiones nuevas. */
(() => {
  const { PG, MENU, row } = NOVA;
  const N = NOVA;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc6 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asUrl = s => { try { const u = new URL(String(s || '')); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
  const isBookmarksPage = () => location.href.includes('nova://marcadores');
  const safeToast = msg => { try { toast(msg); } catch { } };

  // Migración de la preferencia de versiones anteriores; no se elimina ningún dato.
  if (S.bmbar === undefined && S.bbar !== undefined) S.bmbar = !!S.bbar;
  S.bmbar = !!S.bmbar;
  S.memSave = !!S.memSave;
  save();

  const style = document.createElement('style');
  style.id = 'nova164-style';
  style.textContent = `
    #nova-bm-hint{font-size:11px;color:var(--mut);padding:0 4px;white-space:nowrap}
    #nova-perf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px}.nova-metric{padding:13px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bar)}.nova-metric b{display:block;font-size:21px;color:var(--acc)}.nova-metric span{font-size:11px;color:var(--mut)}
    .nova-whero{width:100%;max-height:280px;object-fit:cover;border-radius:calc(var(--r)*1.5);border:1px solid var(--bd);box-shadow:0 12px 40px #0004}.nova-wgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nova-wgrid img{width:100%;aspect-ratio:2/1;object-fit:cover;border-radius:var(--r);border:1px solid var(--bd)}
    .nova-security{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.nova-security .li{cursor:default}.nova-ok{color:#35d98b}
    .nova-upd4{padding:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 18%,var(--bar)),var(--bar));border:1px solid var(--acc);border-radius:calc(var(--r)*1.3);display:flex;flex-direction:column;gap:8px}
    body.nova-bm-on .toast{bottom:56px}
    #bmb{padding-bottom:max(5px,env(safe-area-inset-bottom))}
  `;
  document.head.appendChild(style);

  /* ---------- Barra de marcadores inferior: capa única para evitar duplicados ---------- */
  const bottomBar = document.getElementById('bmb');
  const openBookmarkCurrent = m => {
    if (!m?.u) return;
    try {
      if (cur?.wv?.tagName === 'WEBVIEW' && !cur.wv.classList.contains('ipage')) { const p = cur.wv.loadURL(m.u); p?.catch?.(() => newTab(m.u)); }
      else newTab(m.u);
    } catch { newTab(m.u); }
  };
  const openBookmarkNew = m => { if (m?.u) newTab(m.u); };
  const copyUrl = async url => { try { await navigator.clipboard.writeText(url); safeToast('Dirección copiada'); } catch { safeToast('No se pudo copiar la dirección'); } };
  const refreshPageBookmarks = () => { if (isBookmarksPage() && typeof NOVA.refreshPages === 'function') NOVA.refreshPages('marcadores'); };
  const renderBottomBar = () => {
    if (!bottomBar) return;
    bottomBar.classList.toggle('on', !!S.bmbar);
    bottomBar.setAttribute('aria-hidden', S.bmbar ? 'false' : 'true');
    document.body.classList.toggle('nova-bm-on', !!S.bmbar);
    if (!S.bmbar) { const mid = document.getElementById('mid'); if (mid) mid.style.marginBottom = '0'; bottomBar.replaceChildren(); return; }
    const folders = [...new Set([...(S.folders || []), ...(S.marks || []).map(m => m.f).filter(Boolean)])].filter(Boolean).sort((a,b)=>a.localeCompare(b, 'es'));
    const frag = document.createDocumentFragment();
    if (!folders.length && !S.marks.length) { const hint = document.createElement('span'); hint.className='mut'; hint.textContent='Guarda páginas con Ctrl+D'; frag.appendChild(hint); }
    for (const f of folders) { const b=document.createElement('button'); b.className='btn'; b.dataset.f=f; b.textContent='▸ '+f.split('/').pop(); b.title=f; frag.appendChild(b); }
    for (const m of S.marks.filter(x=>!x.f)) { const b=document.createElement('button'); b.className='btn'; b.dataset.u=m.u; b.textContent=(m.t||m.u).slice(0,26); b.title=m.t||m.u; frag.appendChild(b); }
    const close=document.createElement('button'); close.className='btn bmc'; close.id='bmbclose164'; close.title='Ocultar barra de marcadores'; close.textContent='Ocultar'; frag.appendChild(close);
    bottomBar.replaceChildren(frag);
    bottomBar.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>openBookmarkCurrent(S.marks.find(m=>m.u===b.dataset.u)));
    bottomBar.querySelectorAll('[data-f]').forEach(b=>b.onclick=e=>{e.stopPropagation(); folderContext(b.dataset.f,e.clientX,e.clientY)});
    close.onclick=toggleBookmarksBar;
    const mid=document.getElementById('mid'); if(mid) mid.style.marginBottom=(bottomBar.offsetHeight||38)+'px';
  };
  const refreshBarLayout = () => {
    if (!bottomBar) return;
    document.body.classList.toggle('nova-bm-on', !!S.bmbar);
    const mid=document.getElementById('mid'); if(mid) mid.style.marginBottom=S.bmbar?(bottomBar.offsetHeight||38)+'px':'0';
    bottomBar.setAttribute('aria-hidden', S.bmbar?'false':'true');
  };
  const oldBbar = N.bbar;
  const toggleBookmarksBar = () => {
    if (typeof oldBbar === 'function') oldBbar();
    else { S.bmbar=!S.bmbar; save(); }
    renderBottomBar();
  };
  N.bbar = toggleBookmarksBar;
  renderBottomBar();
  refreshBarLayout();
  window.addEventListener('resize', refreshBarLayout, { passive:true });

  const editBookmark = async m => {
    if (!m || typeof N.dlg !== 'function') return;
    const v=await N.dlg('Editar marcador',[{label:'Nombre',value:m.t||m.u},{label:'Dirección',value:m.u}],'Guardar');
    if(!v) return;
    const u=asUrl(v[1]); if(!u) return safeToast('La dirección debe ser http:// o https://');
    m.t=String(v[0]||m.t||u).trim(); m.u=u; save(); renderBottomBar(); refreshPageBookmarks(); safeToast('Marcador actualizado');
  };
  const removeBookmark=m=>{const i=S.marks.indexOf(m);if(i<0)return;S.marks.splice(i,1);save();renderBottomBar();refreshPageBookmarks();safeToast('Marcador eliminado');};
  const bookmarkContext=(m,x,y)=>{
    if(!m||typeof N.ctx!=='function')return;
    N.ctx(x,y,[['Abrir',()=>openBookmarkCurrent(m)],['Abrir en pestaña nueva',()=>openBookmarkNew(m)],['Editar marcador',()=>editBookmark(m)],['Copiar dirección',()=>copyUrl(m.u)],'-',['Eliminar marcador',()=>removeBookmark(m)]]);
  };
  const folderContext=(folder,x,y)=>{
    if(!folder||typeof N.ctx!=='function')return;
    const items=S.marks.filter(m=>m.f===folder);
    N.ctx(x,y,[['Abrir todos ('+items.length+')',()=>items.forEach(openBookmarkNew)],'-',
      ['Renombrar carpeta',async()=>{if(typeof N.dlg!=='function')return;const v=await N.dlg('Renombrar carpeta',[{label:'Nombre',value:folder}],'Guardar');const nn=String(v?.[0]||'').trim();if(!nn||nn===folder)return;S.marks.forEach(m=>{if(m.f===folder)m.f=nn});S.folders=(S.folders||[]).map(f=>f===folder?nn:f);save();renderBottomBar();refreshPageBookmarks();safeToast('Carpeta renombrada');}],
      ['Quitar carpeta (conservar marcadores)',()=>{S.marks.forEach(m=>{if(m.f===folder)m.f=''});S.folders=(S.folders||[]).filter(f=>f!==folder);save();renderBottomBar();refreshPageBookmarks();safeToast('Carpeta quitada; marcadores conservados');}]]);
  };
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#bmb [data-u]');if(!b)return;e.preventDefault();e.stopPropagation();bookmarkContext(S.marks.find(m=>m.u===b.dataset.u),e.clientX,e.clientY)},true);
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#bmb [data-f]');if(!b)return;e.preventDefault();e.stopPropagation();folderContext(b.dataset.f,e.clientX,e.clientY)},true);
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#ml .li[data-i]');if(!b)return;e.preventDefault();e.stopPropagation();bookmarkContext(S.marks[Number(b.dataset.i)],e.clientX,e.clientY)},true);

  /* La página de Marcadores conserva todo lo original, pero su botón de barra usa el estado único de 1.6.4. */
  const oldMarksPage=PG.marcadores;
  PG.marcadores=r=>{
    if(typeof oldMarksPage==='function') oldMarksPage(r);
    const b=r.querySelector('#mbb');
    if(b) b.onclick=()=>{N.bbar();PG.marcadores(r);};
    renderBottomBar();
  };

  /* ---------- Bienvenida visual: añade, no reemplaza ---------- */
  const oldWelcome=PG.bienvenida;
  PG.bienvenida=async r=>{
    if(typeof oldWelcome==='function')await oldWelcome(r);
    if(r.querySelector('.nova164-welcome'))return;
    const box=document.createElement('section');box.className='nova164-welcome';
    box.innerHTML=`<div class="nova-upd4"><b style="font-size:20px;color:var(--acc)">Nova 1.6.4 · actualización grande</b><span class="mut">Todo lo que ya tenías se conserva. Esta versión añade marcadores abajo, migración, rendimiento/RAM, seguridad y nuevas extensiones.</span><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="n64news">Ver novedades</button><button class="btn" id="n64bm">Importar marcadores</button><button class="btn" id="n64mig">Migrar desde Chrome / Edge / Firefox</button><button class="btn" id="n64perf">Rendimiento y RAM</button></div></div><img class="nova-whero" src="../assets/welcome/welcome-hero.jpg" alt="Nova 1.6.4"><div class="nova-wgrid"><img src="../assets/welcome/welcome-performance.jpg" alt="Rendimiento y memoria de Nova"><img src="../assets/welcome/welcome-security.jpg" alt="Seguridad de Nova"></div>`;
    r.appendChild(box);
    box.querySelector('#n64news').onclick=()=>newTab('nova://novedades');
    box.querySelector('#n64bm').onclick=()=>newTab('nova://marcadores');
    box.querySelector('#n64mig').onclick=()=>newTab('nova://migrar');
    box.querySelector('#n64perf').onclick=()=>newTab('nova://rendimiento');
  };

  /* ---------- Rendimiento / RAM ---------- */
  async function performancePage(r){
    r.innerHTML=`<h2>Rendimiento y RAM</h2><span class="mut">Medición local de Nova, del sistema y de las pestañas abiertas. No se envía este diagnóstico a ninguna web.</span><div id="nova-perf-grid"><div class="nova-metric"><b id="pmain">—</b><span>Nova · RAM</span></div><div class="nova-metric"><b id="pcpu">—</b><span>Nova · CPU</span></div><div class="nova-metric"><b id="psys">—</b><span>RAM libre</span></div><div class="nova-metric"><b id="ptotal">—</b><span>RAM total</span></div><div class="nova-metric"><b id="ptabs">—</b><span>Pestañas web</span></div></div>${row('Ahorro de memoria',`<div class="sw ${S.memSave?'on':''}" id="memsave" aria-label="Ahorro de memoria"></div>`)}<span class="mut">El modo ahorro conserva el throttling normal de Electron y limita la repetición de animaciones de imagen. No cierra pestañas ni borra datos.</span><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn" id="prefresh">Actualizar medición</button><button class="btn" id="pcache">Limpiar caché</button><button class="btn" id="psec">Diagnóstico de seguridad</button></div><div id="ptablist" style="display:flex;flex-direction:column;gap:6px"></div>`;
    const paint=async()=>{const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d.ok)return safeToast('No se pudo leer el estado de rendimiento');const mb=x=>Number(x)?(x/1024).toFixed(0)+' MB':'—',cpu=x=>Number.isFinite(Number(x))?Number(x).toFixed(1)+' %':'—';r.querySelector('#pmain').textContent=mb(d.main.rssKB);r.querySelector('#pcpu').textContent=cpu(d.main.cpuPercent);r.querySelector('#psys').textContent=mb(d.system.freeKB);r.querySelector('#ptotal').textContent=mb(d.system.totalKB);r.querySelector('#ptabs').textContent=String(d.tabs.length);r.querySelector('#ptablist').innerHTML=d.tabs.map(t=>`<div class="li" style="cursor:default"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc6(t.title||t.url||'Pestaña')}</span><span class="mut">${mb(t.workingSetKB)} · CPU ${cpu(t.cpuPercent)}</span></div>`).join('')||'<span class="mut">Sin pestañas web medibles.</span>';};
    r.querySelector('#memsave').onclick=async()=>{const next=!S.memSave,ok=await ipc.invoke('performance-mode',next).catch(()=>false);if(!ok)return safeToast('No se pudo cambiar el modo');S.memSave=next;save();r.querySelector('#memsave').classList.toggle('on',next);safeToast(next?'Ahorro de memoria activado':'Ahorro de memoria desactivado');paint();};
    r.querySelector('#prefresh').onclick=paint;r.querySelector('#pcache').onclick=async()=>{const ok=await ipc.invoke('performance-cache').catch(()=>false);safeToast(ok?'Caché limpiada':'No se pudo limpiar la caché');if(ok)paint();};r.querySelector('#psec').onclick=()=>newTab('nova://seguridad');await paint();
  }
  PG.rendimiento=performancePage;

  /* ---------- Auditoría de seguridad ---------- */
  async function securityPage(r){
    const x=await ipc.invoke('security-state').catch(()=>({}));
    const rows=[['Web Security',x.webSecurity],['Sandbox de webviews',x.webviewSandbox],['Node.js en páginas web',x.webviewNodeIntegration===false],['Contenido inseguro bloqueado',x.insecureContentBlocked],['Popups de páginas bloqueados',x.popupBlocked],['Acceso file → web bloqueado',x.fileAccessFromFileUrls===false],['Acceso universal file bloqueado',x.universalAccessFromFileUrls===false],['Instancia única',x.singleInstance],['Bloqueador de anuncios',x.adblock],['CSP de la interfaz local',x.csp]];
    r.innerHTML=`<h2>Auditoría de seguridad</h2><span class="mut">Comprobaciones locales de configuración. No se envía este resultado a ninguna web.</span><div class="nova-security">${rows.map(([n,v])=>`<div class="li"><span>${esc6(n)}</span><span class="${v?'nova-ok':''}">${v?'✓':'—'}</span></div>`).join('')}</div><div class="row" style="justify-content:flex-start"><button class="btn" id="scheck">Volver a comprobar</button><button class="btn" id="spriv">Centro de privacidad</button></div>`;
    r.querySelector('#scheck').onclick=()=>PG.seguridad(r);r.querySelector('#spriv').onclick=()=>newTab('nova://privacidad');
  }
  PG.seguridad=securityPage;

  /* ---------- Novedades: entrada completa de 1.6.4 + historial anterior ---------- */
  const oldNews=PG.novedades;
  PG.novedades=r=>{
    if(typeof oldNews==='function')oldNews(r);
    const head=r.querySelector('h2'),card=document.createElement('div');card.className='nova-upd4';
    card.innerHTML=`<b style="font-size:20px;color:var(--acc)">Nova 1.6.4 · Actualización grande</b><span class="mut">Nueva capa de funciones sin eliminar las anteriores.</span><ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px">${[
      'Barra de marcadores fija en la parte inferior, opcional y con ocultación desde el propio botón.',
      'Clic derecho sobre marcadores: abrir, abrir en pestaña nueva, editar, copiar y eliminar.',
      'Clic derecho sobre carpetas: abrir todos, renombrar o quitar carpeta conservando marcadores.',
      'Bienvenida ampliada con imágenes locales y accesos a Novedades, Importar marcadores, Migrar navegador y Rendimiento/RAM.',
      'Migración local de Chrome, Edge y Firefox en modo solo lectura: marcadores e historial compatibles.',
      'Importación de marcadores HTML y JSON desde el gestor de Marcadores.',
      'Centro de Rendimiento/RAM con memoria de Nova, CPU, RAM libre/total, pestañas y consumo por pestaña.',
      'Ahorro de memoria opcional sin cerrar pestañas y conservando el throttling normal de Electron.',
      'Auditoría local de seguridad con estado de webview, sandbox, navegación, popups, acceso a archivos, instancia única y bloqueador.',
      'Ghostery con `cross-fetch`, caché persistente versionada y renovación periódica de listas.',
      'Cuatro extensiones nuevas y opcionales: aviso HTTP, enlaces no HTTPS, limpieza de parámetros de seguimiento y vídeo ligero.',
      'Comprobación automática del proyecto en GitHub para detectar funciones o protecciones ausentes antes del build.',
      'Unificación del estado y del atajo Ctrl+Shift+B para evitar doble ejecución de la barra.',
      'Novedades y bienvenida usan imágenes locales y no dependen de una descarga externa para mostrarlas.'
    ].map(x=>`<li>${esc6(x)}</li>`).join('')}</ul><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="n64perf">Rendimiento y RAM</button><button class="btn" id="n64bm2">Marcadores</button><button class="btn" id="n64mig2">Migrar navegador</button><button class="btn" id="n64sec2">Seguridad</button></div>`;
    if(head)head.after(card);else r.prepend(card);card.querySelector('#n64perf').onclick=()=>newTab('nova://rendimiento');card.querySelector('#n64bm2').onclick=()=>newTab('nova://marcadores');card.querySelector('#n64mig2').onclick=()=>newTab('nova://migrar');card.querySelector('#n64sec2').onclick=()=>newTab('nova://seguridad');
  };

  /* ---------- Menu / Command Center: conservar acciones anteriores y añadir las nuevas ---------- */
  if(Array.isArray(N.extraActs)){
    const old= N.extraActs.find(a=>/barra.*marcadores/i.test(a[0]));
    if(old) old[1]=toggleBookmarksBar;
    else N.extraActs.push(['Mostrar/ocultar barra de marcadores',toggleBookmarksBar]);
  } else N.extraActs=[];
  N.extraActs.push(['Barra de marcadores abajo',toggleBookmarksBar],['Rendimiento y RAM',()=>newTab('nova://rendimiento')],['Auditoría de seguridad',()=>newTab('nova://seguridad')],['Importar marcadores',()=>newTab('nova://marcadores')],['Migrar desde Chrome / Edge / Firefox',()=>newTab('nova://migrar')]);
  if(Array.isArray(MENU)&&!MENU.some(m=>m[0]==='Rendimiento y RAM'))MENU.push(['Rendimiento y RAM',()=>newTab('nova://rendimiento')],['Auditoría de seguridad',()=>newTab('nova://seguridad')]);
  const mp=document.getElementById('mnp');if(mp&&Array.isArray(MENU))mp.innerHTML=MENU.map((m,i)=>`<button data-i="${i}">${esc6(m[0])}</button>`).join('');

  ipc.invoke('performance-mode',!!S.memSave).catch(()=>{});
  Object.assign(N,{refreshBottomBar:()=>{renderBottomBar();refreshBarLayout();},bookmarkContext,folderContext});
})();


/* ---- extras7.js ---- */
/* Nova 1.6.5 - capa aditiva: perfiles, F12/DevTools y Cuenta Nova con sincronización online. */
(() => {
  const N = NOVA, { PG } = N;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const toastSafe = m => { try { toast(m); } catch { } };
  const clone = o => { try { return JSON.parse(JSON.stringify(o)); } catch { return {}; } };
  const profileKeys = ['theme','search','adblock','anim','sec','wp','marks','mods','memSave','bmbar','convs','groups','folders','quick','dash','notes','notesL','hist','dls','restore','session2','perms','v200','v21'];
  const syncKeys = ['theme','search','anim','sec','marks','folders','quick','dash','hist','notesL','v200'];
  const profileMeta = () => ({ id:'default', name:'Principal', avatar:'N', createdAt:Date.now() });
  const normalProfileId = v => String(v || '').replace(/[^a-z0-9_-]/gi,'').slice(0,32) || 'default';
  const cleanProfileName = v => String(v || '').replace(/[\u0000-\u001f]/g,'').trim().slice(0,40) || 'Perfil';

  S.profiles = Array.isArray(S.profiles) && S.profiles.length ? S.profiles : [profileMeta()];
  S.profiles = S.profiles.map((p, i) => ({ id:normalProfileId(p.id || (i ? `p${Date.now().toString(36)}${i}` : 'default')), name:cleanProfileName(p.name || (i ? `Perfil ${i+1}` : 'Principal')), avatar:String(p.avatar || (p.name || 'P').slice(0,1)).slice(0,2), createdAt:Number(p.createdAt)||Date.now() }));
  if (!S.profiles.some(p => p.id === 'default')) S.profiles.unshift(profileMeta());
  S.activeProfile = S.activeProfile && S.profiles.some(p => p.id === S.activeProfile) ? S.activeProfile : S.profiles[0].id;
  S.profileStores = (S.profileStores && typeof S.profileStores === 'object') ? S.profileStores : {};
  const storeCurrent = () => Object.fromEntries(profileKeys.map(k => [k, clone(S[k])]));
  if (!S.profileStores[S.activeProfile]) S.profileStores[S.activeProfile] = storeCurrent();
  const ensureDefaults = () => {
    S.marks = Array.isArray(S.marks) ? S.marks : []; S.hist = Array.isArray(S.hist) ? S.hist : [];
    S.folders = Array.isArray(S.folders) ? S.folders : []; S.quick = Array.isArray(S.quick) ? S.quick : [];
    S.dash = Object.assign({clock:true,search:true,quick:true,recent:true,dl:true,ai:true}, S.dash);
    S.groups = S.groups && typeof S.groups === 'object' ? S.groups : {};
  };
  const saveProfile = () => { ensureDefaults(); S.profileStores[S.activeProfile] = storeCurrent(); save(); };
  const applyProfile = id => {
    const target = S.profileStores[id] || {};
    for (const k of profileKeys) delete S[k];
    Object.assign(S, clone(target));
    ensureDefaults();
    S.activeProfile = id;
    save();
  };
  ensureDefaults(); saveProfile();

  const profilePartition = () => S.activeProfile === 'default' ? 'persist:web' : `persist:nova-profile-${normalProfileId(S.activeProfile || 'default')}`;
  window.NOVA_PROFILE_PARTITION = profilePartition; N.profilePartition = profilePartition;

  const st = document.createElement('style');
  st.id = 'nova165-style';
  st.textContent = `
    #nova-profile-button{margin-left:auto;display:flex;align-items:center;gap:6px;max-width:190px;height:28px;padding:0 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bar);color:var(--fg);cursor:pointer;overflow:hidden;white-space:nowrap}
    #nova-profile-avatar{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:#fff;font-size:10px;font-weight:800;flex:none}
    #nova-profile-name{overflow:hidden;text-overflow:ellipsis}
    #nova-profile-pop{position:fixed;top:38px;right:105px;z-index:70;display:none;min-width:250px;padding:10px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r)*1.2);box-shadow:0 18px 55px #000b}
    #nova-profile-pop.on{display:block}.nova-profile-item{display:flex;align-items:center;gap:8px;width:100%;padding:8px;border:0;background:transparent;color:var(--fg);text-align:left;border-radius:var(--r);cursor:pointer}.nova-profile-item:hover{background:color-mix(in srgb,var(--acc) 12%,transparent)}
    .nova-profile-dot{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:#fff;font-weight:800;font-size:11px;flex:none}.nova-profile-current{font-size:11px;color:var(--mut);padding:5px 8px 8px}
    .nova165-card{margin-top:12px;padding:12px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bar);display:flex;flex-direction:column;gap:8px}.nova165-title{font-weight:750;color:var(--acc)}.nova165-state{display:flex;align-items:center;justify-content:space-between;gap:10px}.nova165-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:7px}.nova165-item{padding:8px;border:1px solid var(--bd);border-radius:var(--r);background:color-mix(in srgb,var(--bar) 75%,transparent)}
    .nova165-badge{padding:2px 7px;border-radius:999px;background:color-mix(in srgb,var(--acc) 18%,transparent);font-size:10px}.nova165-muted{font-size:11px;color:var(--mut)}
  `;
  document.head.appendChild(st);

  /* ---------- F12 / DevTools: únicamente añade el acceso; Electron mantiene DevTools habilitados. ---------- */
  N.devtools = () => { try { const t=N.activeWebTab?.()||cur; if (t?.wv?.isDevToolsOpened?.()) t.wv.closeDevTools(); else t?.wv?.openDevTools?.({mode:'detach', activate:true}); } catch { toastSafe('No se pudieron abrir las herramientas de desarrollador'); } };
  N.SHORTCUTS = (N.SHORTCUTS || []).concat([['F12','Abrir/cerrar herramientas de desarrollador']]);
  N.ACTIONS = (() => { const old = N.ACTIONS; return () => [...(typeof old === 'function' ? old() : []), ['Herramientas de desarrollador (F12)', () => N.devtools()]]; })();
  N.extraActs = Array.isArray(N.extraActs) ? N.extraActs : [];
  if (!N.extraActs.some(a => /herramientas de desarrollador/i.test(a[0] || ''))) N.extraActs.push(['Herramientas de desarrollador (F12)', () => N.devtools()]);

  document.addEventListener('keydown', e => {
    if (e.key === 'F12') { e.preventDefault(); N.devtools(); }
  }, true);

  /* ---------- Perfiles ---------- */
  function currentProfile() { return S.profiles.find(p => p.id === S.activeProfile) || S.profiles[0]; }
  function drawProfileButton() {
    let b = document.getElementById('nova-profile-button');
    if (!b) {
      b = document.createElement('button'); b.id = 'nova-profile-button'; b.title = 'Cambiar perfil';
      b.innerHTML = '<span id="nova-profile-avatar"></span><span id="nova-profile-name"></span>';
      const wc = document.getElementById('wc'); document.getElementById('top')?.insertBefore(b, wc || null);
      b.onclick = e => { e.stopPropagation(); document.getElementById('nova-profile-pop')?.classList.toggle('on'); refreshProfilePop(); };
    }
    const p=currentProfile(); const a=document.getElementById('nova-profile-avatar'), n=document.getElementById('nova-profile-name');
    if(a)a.textContent=p.avatar||p.name.slice(0,1); if(n)n.textContent=p.name;
  }
  function makeProfilePop() {
    if(document.getElementById('nova-profile-pop')) return;
    const pop=document.createElement('div'); pop.id='nova-profile-pop'; document.body.appendChild(pop);
    document.addEventListener('click',e=>{ if(!pop.contains(e.target) && !e.target.closest('#nova-profile-button')) pop.classList.remove('on'); });
  }
  function refreshProfilePop() {
    makeProfilePop(); const pop=document.getElementById('nova-profile-pop'), curp=currentProfile();
    pop.innerHTML=`<div class="nova-profile-current">Perfil activo</div>${S.profiles.map(p=>`<button class="nova-profile-item" data-p="${esc(p.id)}"><span class="nova-profile-dot">${esc(p.avatar)}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</span>${p.id===curp.id?'<span class="nova165-badge">Activo</span>':''}</button>`).join('')}<hr style="border:0;border-top:1px solid var(--bd);margin:7px 0"><button class="nova-profile-item" id="np-new">＋ Crear perfil</button><button class="nova-profile-item" id="np-manage">⚙ Administrar perfiles</button>`;
    pop.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>switchProfile(b.dataset.p));
    pop.querySelector('#np-new').onclick=()=>createProfile(); pop.querySelector('#np-manage').onclick=()=>{pop.classList.remove('on');if(typeof draw==='function'){panel='set';draw();setTimeout(()=>document.getElementById('nova-profile-manager')?.scrollIntoView({behavior:'smooth',block:'center'}),50);}};
  }
  const captureTabs = () => {
    try { S.session2 = tabs.map(t => { const u=t.wv.getURL(); return !u || u.startsWith('nova:') || isNT(u) ? null : {u,g:t.g||'',p:t.el.classList.contains('pin')?1:0}; }).filter(Boolean); } catch { S.session2=[]; }
  };
  function rebuildTabs() {
    try { tabs.forEach(t=>{try{t.wv.remove()}catch{};try{t.el.remove()}catch{}}); tabs.length=0; cur=null; $('#tabs').replaceChildren(); } catch { }
    const list=Array.isArray(S.session2)?S.session2.slice(0,30):[]; const first=newTab(); list.forEach(s=>{const t=newTab(s.u); if(s.g && S.groups[s.g])t.g=s.g;if(s.p)t.el.classList.add('pin');});
    if(list.length && first){ try{first.wv.remove();first.el.remove();tabs.splice(tabs.indexOf(first),1)}catch{} }
    if(typeof NOVA.renderGroups==='function')NOVA.renderGroups();
  }
  async function switchProfile(id) {
    if(id===S.activeProfile)return;
    const target=S.profiles.find(p=>p.id===id); if(!target)return;
    captureTabs(); saveProfile(); applyProfile(id); applyTheme(); ipc.send('perm-policy', S.perms || {}); ipc.invoke('adblock', !!S.adblock).catch(()=>{}); N.refreshBottomBar?.(); refreshNT(); drawProfileButton(); refreshProfilePop(); rebuildTabs();
    toastSafe(`Perfil cambiado: ${target.name}`);
    syncNow(false);
  }
  async function createProfile() {
    const r=await N.dlg?.('Crear perfil',[{label:'Nombre',value:'Nuevo perfil'},{label:'Inicial / avatar',value:'N'}],'Crear'); if(!r)return;
    const id=normalProfileId((r[0]||'nuevo').toLowerCase().replace(/\s+/g,'-')+'-'+Date.now().toString(36)); const p={id,name:cleanProfileName(r[0]),avatar:String(r[1]||r[0]||'P').slice(0,2),createdAt:Date.now()};
    S.profiles.push(p); S.profileStores[id]={theme:S.theme,search:S.search,anim:S.anim,adblock:S.adblock,sec:S.sec,marks:[],folders:[],quick:[],dash:clone(S.dash),mods:{},memSave:S.memSave,bmbar:S.bmbar,hist:[],groups:{},notesL:[],v200:clone(S.v200||{})}; save(); refreshProfilePop(); toastSafe(`Perfil creado: ${p.name}`); await switchProfile(id);
  }
  async function editProfile(id) {
    const p=S.profiles.find(x=>x.id===id);if(!p)return;
    const r=await N.dlg?.('Editar perfil',[{label:'Nombre',value:p.name},{label:'Inicial / avatar',value:p.avatar}],'Guardar'); if(!r)return;
    p.name=cleanProfileName(r[0]);p.avatar=String(r[1]||p.name).slice(0,2);save();drawProfileButton();refreshProfilePop();renderProfileManager();
  }
  async function deleteProfile(id) {
    if(S.profiles.length<=1)return toastSafe('Debe existir al menos un perfil.'); if(id===S.activeProfile)return toastSafe('Cambia a otro perfil antes de eliminar este.');
    const p=S.profiles.find(x=>x.id===id); if(!p)return; if(!confirm(`¿Eliminar el perfil «${p.name}» y sus datos locales de Nova?`))return;
    S.profiles=S.profiles.filter(x=>x.id!==id);delete S.profileStores[id];save();refreshProfilePop();renderProfileManager();
  }
  function renderProfileManager() {
    const box=document.getElementById('nova-profile-manager'); if(!box)return;
    box.innerHTML=`<div class="nova165-title">Perfiles</div><div class="nova165-muted">Cada perfil tiene su propia sesión web persistente. Las cuentas, cookies, historial y marcadores no se mezclan entre perfiles.</div>${S.profiles.map(p=>`<div class="nova165-state nova165-item"><span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="nova-profile-dot">${esc(p.avatar)}</span><span style="overflow:hidden;text-overflow:ellipsis">${esc(p.name)} ${p.id===S.activeProfile?'<span class="nova165-badge">Activo</span>':''}</span></span><span style="display:flex;gap:6px"><button class="btn" data-e="${esc(p.id)}">Editar</button><button class="btn" data-d="${esc(p.id)}">Eliminar</button></span></div>`).join('')}<div class="row"><button class="btn on" id="np-add">＋ Nuevo perfil</button></div>`;
    box.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>editProfile(b.dataset.e)); box.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>deleteProfile(b.dataset.d)); box.querySelector('#np-add').onclick=createProfile;
  }
  const oldDraw=draw;
  draw=function(){ oldDraw(); drawProfileButton(); makeProfilePop(); if(panel==='set'){ let b=document.getElementById('nova-profile-manager'); if(!b){b=document.createElement('div');b.id='nova-profile-manager';b.className='nova165-card';document.getElementById('pin')?.appendChild(b);} renderProfileManager(); } };
  drawProfileButton(); makeProfilePop(); refreshProfilePop();

  /* ---------- Cuenta Nova ---------- */
  let accountStatus={loggedIn:false,id:'',username:''};
  const accountPayload = () => {
    const data={version:1,profiles:clone(S.profiles),activeProfile:S.activeProfile,stores:{}};
    for(const [id,store] of Object.entries(S.profileStores||{})) data.stores[id]=Object.fromEntries(syncKeys.map(k=>[k,clone(store?.[k])]));
    return data;
  };
  function mergeSync(remote) {
    if(!remote || typeof remote!=='object') return;
    if(Array.isArray(remote.profiles)) for(const rp of remote.profiles){if(!S.profiles.some(p=>p.id===rp.id))S.profiles.push({id:normalProfileId(rp.id),name:cleanProfileName(rp.name),avatar:String(rp.avatar||'P').slice(0,2),createdAt:Number(rp.createdAt)||Date.now()});}
    if(remote.stores && typeof remote.stores==='object') for(const [id,rs] of Object.entries(remote.stores)){if(!S.profileStores[id])S.profileStores[id]={};for(const k of syncKeys){if(rs && Object.prototype.hasOwnProperty.call(rs,k))S.profileStores[id][k]=clone(rs[k]);}}
    const localStore=S.profileStores[S.activeProfile]||storeCurrent();
    if(localStore){
      if(Array.isArray(localStore.marks)) localStore.marks = [...new Map(localStore.marks.concat(S.marks||[]).map(x=>[x.u,x])).values()].slice(-20000);
      if(Array.isArray(localStore.hist)) localStore.hist = [...new Map(localStore.hist.concat(S.hist||[]).map(x=>[x.u,x])).values()].sort((a,b)=>(b.d||0)-(a.d||0)).slice(0,1000);
      S.profileStores[S.activeProfile]=localStore;
    }
    save();
  }
  async function refreshAccountStatus(){ accountStatus=await ipc.invoke('account-status').catch(()=>({})); return accountStatus; }
  async function accountRegister() {
    const r=await N.dlg?.('Crear cuenta Nova',[{label:'Usuario (se convertirá en usuario@Nova.com)',value:''},{label:'Contraseña (mínimo 8 caracteres)',value:''}],'Crear'); if(!r)return;
    const x=await ipc.invoke('account-register',{username:r[0],password:r[1]}).catch(()=>({ok:false,error:'No disponible'})); toastSafe(x.ok?`Cuenta creada: ${x.id}`:(x.error||'No se pudo crear la cuenta.')); if(x.ok){await refreshAccountStatus();renderAccountCard();await syncNow(false);}
  }
  async function accountLogin() {
    const r=await N.dlg?.('Iniciar sesión en Nova',[{label:'Usuario o usuario@Nova.com',value:''},{label:'Contraseña',value:''}],'Entrar'); if(!r)return;
    const x=await ipc.invoke('account-login',{username:r[0],password:r[1]}).catch(()=>({ok:false,error:'No disponible'})); toastSafe(x.ok?`Sesión iniciada: ${x.id}`:(x.error||'No se pudo iniciar sesión.')); if(x.ok){await refreshAccountStatus();renderAccountCard();await syncNow(true);}
  }
  async function accountLogout(){const x=await ipc.invoke('account-logout').catch(()=>({ok:false}));if(x.ok){accountStatus={loggedIn:false,id:'',username:''};renderAccountCard();toastSafe('Sesión cerrada en este equipo.');}}
  async function syncNow(show=true){
    await refreshAccountStatus(); if(!accountStatus.loggedIn){if(show)toastSafe('Inicia sesión en tu cuenta Nova para sincronizar.');return false;}
    saveProfile(); const x=await ipc.invoke('account-sync',accountPayload()).catch(()=>({ok:false,error:'No disponible'}));
    if(!x.ok){if(show)toastSafe(x.error||'No se pudo sincronizar.');return false;}
    if(x.remote)mergeSync(x.remote); saveProfile();
    if(show)toastSafe('Nova sincronizado.'); return true;
  }
  N.accountSync=syncNow;
  setInterval(()=>{if(document.visibilityState!=='hidden')syncNow(false)},10*60*1000);

  function renderAccountCard() {
    const box=document.getElementById('nova-account-card');if(!box)return;
    if(!accountStatus.loggedIn) box.innerHTML=`<div class="nova165-title">Cuenta Nova</div><div class="nova165-muted">Crea una cuenta gratuita que solo sirve dentro de Nova. Su identificador tendrá el formato <b>usuario@Nova.com</b>. La sesión de este PC se protege con el almacén seguro del sistema.</div><div class="row"><button class="btn on" id="na-reg">Crear cuenta</button><button class="btn" id="na-log">Iniciar sesión</button></div><div class="nova165-muted">La nube de Nova sincroniza marcadores, historial y preferencias de navegación. No sincroniza contraseñas guardadas, cookies ni la clave de Nova IA.</div>`;
    else box.innerHTML=`<div class="nova165-title">Cuenta Nova</div><div class="nova165-state"><span><b>${esc(accountStatus.id)}</b><br><span class="nova165-muted">Conectada en este PC</span></span><span class="nova165-badge">ONLINE</span></div><div class="row"><button class="btn on" id="na-sync">Sincronizar ahora</button><button class="btn" id="na-out">Cerrar sesión</button></div><div class="nova165-muted">Puedes iniciar sesión con esta misma cuenta en otro PC de Nova para recuperar tus datos sincronizados.</div>`;
    box.querySelector('#na-reg')?.addEventListener('click',accountRegister);box.querySelector('#na-log')?.addEventListener('click',accountLogin);box.querySelector('#na-sync')?.addEventListener('click',()=>syncNow(true));box.querySelector('#na-out')?.addEventListener('click',accountLogout);
  }
  async function enhanceSettings(){
    const pin=document.getElementById('pin');if(!pin)return;
    let box=document.getElementById('nova-account-card');if(!box){box=document.createElement('div');box.id='nova-account-card';box.className='nova165-card';pin.appendChild(box);} await refreshAccountStatus(); renderAccountCard();
    let help=document.getElementById('nova-f12-card');if(!help){help=document.createElement('div');help.id='nova-f12-card';help.className='nova165-card';help.innerHTML='<div class="nova165-title">Herramientas de desarrollador</div><div class="nova165-muted">Pulsa <b>F12</b> para abrir/cerrar DevTools de la pestaña activa.</div><button class="btn" id="nova-open-devtools">Abrir DevTools</button>';pin.appendChild(help);help.querySelector('#nova-open-devtools').onclick=()=>N.devtools();}
    let pm=document.getElementById('nova-profile-manager');if(!pm){pm=document.createElement('div');pm.id='nova-profile-manager';pm.className='nova165-card';pin.appendChild(pm);}renderProfileManager();
  }
  const wrappedDraw=draw;
  draw=function(){ wrappedDraw(); if(panel==='set') enhanceSettings().catch(()=>{}); };
  drawProfileButton();
  refreshAccountStatus().catch(()=>{});

  /* ---------- Recordatorio en Novedades/Bienvenida ---------- */
  const add165Block=(r, welcome=false)=>{
    if(!r || r.querySelector('.nova165-update')) return;
    const b=document.createElement('section');b.className='nova165-card nova165-update';
    b.innerHTML=`<div class="nova165-title">Nova 1.6.5</div><div class="nova165-muted">Nueva capa añadida sin eliminar las funciones anteriores.</div><div class="nova165-grid"><div class="nova165-item"><b>👤 Perfiles</b><br><span class="nova165-muted">Sesiones separadas</span></div><div class="nova165-item"><b>🛠 F12</b><br><span class="nova165-muted">DevTools de la pestaña</span></div><div class="nova165-item"><b>☁ Cuenta Nova</b><br><span class="nova165-muted">Sincronización entre PCs</span></div></div><div class="row"><button class="btn on" id="n65set">Abrir ajustes</button><button class="btn" id="n65sync">Cuenta Nova</button></div>`;
    r.appendChild(b);b.querySelector('#n65set').onclick=()=>newTab('nova://ajustes');b.querySelector('#n65sync').onclick=()=>newTab('nova://ajustes');
  };
  const ow=PG.bienvenida;PG.bienvenida=async r=>{if(typeof ow==='function')await ow(r);add165Block(r,true);};
  const on=PG.novedades;PG.novedades=r=>{if(typeof on==='function')on(r);add165Block(r,false);};

  /* ---------- Command Center ---------- */
  if(typeof N.extraActs==='object'){
    if(!N.extraActs.some(a=>/cambiar perfil/i.test(a[0]||'')))N.extraActs.push(['Cambiar perfil',()=>{document.getElementById('nova-profile-button')?.click()}]);
    if(!N.extraActs.some(a=>/crear perfil/i.test(a[0]||'')))N.extraActs.push(['Crear perfil',createProfile]);
    if(!N.extraActs.some(a=>/cuenta nova/i.test(a[0]||'')))N.extraActs.push(['Cuenta Nova',()=>newTab('nova://ajustes')]);
  }

  Object.assign(N,{createProfile,switchProfile,refreshProfileManager:renderProfileManager});
  drawProfileButton(); refreshProfilePop();
})();


/* ---- extras8.js ---- */
/* Nova 2.0.0 - gran actualización: Study, Workspaces, lectura, rendimiento, accesibilidad, seguridad y experiencia renovada. */
(() => {
  const N = NOVA, { PG } = N;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast2 = m => { try { toast(m); } catch {} };
  const clone = o => { try { return JSON.parse(JSON.stringify(o)); } catch { return {}; } };
  const safeUrl = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const currentUrl = () => { try { const t=N.activeWebTab?.()||cur; return safeUrl(t?.wv?.getURL?.()); } catch { return ''; } };
  const currentTitle = () => { try { const t=N.activeWebTab?.()||cur; return t?.el?.querySelector('span')?.textContent || currentUrl() || 'Pestaña'; } catch { return 'Pestaña'; } };

  S.v200 = Object.assign({
    workspaces: [], activeWorkspace: 'general',
    studyProvider: 'nova',
    reader: false,
    a11y: { reduceMotion: false, highContrast: false, uiScale: 100 },
    perfPlus: false
  }, S.v200 || {});
  S.v200.a11y = Object.assign({ reduceMotion: false, highContrast: false, uiScale: 100 }, S.v200.a11y || {});
  if (!Array.isArray(S.v200.workspaces) || !S.v200.workspaces.length) S.v200.workspaces = [{ id:'general', name:'General', icon:'⌂', color:'#8b5cf6', tabs:[] }];
  if (!S.v200.workspaces.some(w => w.id === S.v200.activeWorkspace)) S.v200.activeWorkspace = S.v200.workspaces[0].id;
  save();

  const st = document.createElement('style'); st.id = 'nova20-style'; st.textContent = `
    #nova20-wsbtn,#nova20-studybtn{height:28px;padding:0 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bar);color:var(--fg);cursor:pointer;-webkit-app-region:no-drag;white-space:nowrap}
    #nova20-wsbtn:hover,#nova20-studybtn:hover{border-color:var(--acc);color:var(--acc)}
    #nova20-pop{position:fixed;top:38px;left:120px;z-index:100;display:none;min-width:280px;padding:10px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r)*1.2);box-shadow:0 20px 70px #000c}
    #nova20-pop.on{display:flex;flex-direction:column;gap:5px}.nova20-wi{display:flex;gap:8px;align-items:center;padding:8px;border:0;background:transparent;color:var(--fg);border-radius:var(--r);cursor:pointer;text-align:left}.nova20-wi:hover{background:color-mix(in srgb,var(--acc) 12%,transparent)}
    .nova20-card{padding:14px;border:1px solid var(--bd);background:var(--bar);border-radius:calc(var(--r)*1.25);display:flex;flex-direction:column;gap:9px}.nova20-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.nova20-chip{padding:10px;border:1px solid var(--bd);border-radius:var(--r);background:color-mix(in srgb,var(--bar) 82%,transparent)}
    #nova20-study{position:absolute;inset:0;z-index:60;background:var(--bg);display:none;flex-direction:column}.nova20-studybar{display:flex;align-items:center;gap:7px;padding:7px;background:var(--bar);border-bottom:1px solid var(--bd);flex-wrap:wrap}.nova20-studybar b{margin-right:auto;color:var(--acc)}.nova20-study-split{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0}.nova20-study-pane{min-width:0;min-height:0;position:relative;background:#fff}.nova20-study-pane+ .nova20-study-pane{border-left:1px solid var(--bd)}.nova20-study-pane webview{display:flex!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important}.nova20-study-ai{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bar)}.nova20-study-head{padding:12px;border-bottom:1px solid var(--bd)}.nova20-study-chat{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}.nova20-study-msg{max-width:90%;padding:9px 11px;border-radius:var(--r);white-space:pre-wrap}.nova20-study-msg.u{align-self:flex-end;background:var(--acc);color:#fff}.nova20-study-msg.a{background:var(--bg);border:1px solid var(--bd)}.nova20-study-compose{display:flex;gap:7px;padding:8px;border-top:1px solid var(--bd)}
    .nova20-welcome{display:flex;flex-direction:column;gap:13px}.nova20-hero{width:100%;max-height:330px;object-fit:cover;border-radius:calc(var(--r)*1.4);border:1px solid var(--bd)}.nova20-feature{min-height:120px}.nova20-feature h3{margin:0;color:var(--acc)}
    .nova20-news{display:flex;flex-direction:column;gap:12px}.nova20-release{padding:16px;border:1px solid var(--acc);border-radius:calc(var(--r)*1.3);background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 18%,var(--bar)),var(--bar));display:flex;flex-direction:column;gap:8px}.nova20-list{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px}
    .nova20-reader-active{box-shadow:inset 0 0 0 3px color-mix(in srgb,var(--acc) 25%,transparent)}
    body.nova20-highcontrast{filter:contrast(1.12) saturate(1.08)}body.nova20-scale90{font-size:90%}body.nova20-scale110{font-size:110%}body.nova20-scale125{font-size:125%}body.nova20-reduced *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
    @media(max-width:900px){.nova20-study-split{grid-template-columns:1fr}.nova20-study-pane:last-child{display:none}.nova20-study-split.nova20-show-ai .nova20-study-pane:last-child{display:block;position:absolute;inset:0}.nova20-study-split.nova20-show-ai .nova20-study-pane:first-child{display:none}}
  `; document.head.appendChild(st);

  /* ---------- Workspaces ---------- */
  const ws = () => S.v200.workspaces.find(w => w.id === S.v200.activeWorkspace) || S.v200.workspaces[0];
  const captureWorkspace = () => { const w = ws(); if (!w) return; w.tabs = tabs.map(t => { try { const u = safeUrl(t.wv.getURL()); if (!u || isNT(u) || t.wv.classList.contains('ipage')) return null; return { u, title:t.el.querySelector('span')?.textContent||'', g:t.g||null, p:t.el.classList.contains('pin') }; } catch { return null; } }).filter(Boolean).slice(0,40); save(); };
  const destroyTabs = () => { tabs.slice().forEach(t => { try { t.wv.remove(); } catch {} try { t.el.remove(); } catch {} }); tabs.length = 0; cur = null; $('#tabs').replaceChildren(); };
  const loadWorkspace = () => { const w = ws(); if (!w) return; const items = Array.isArray(w.tabs) ? w.tabs.slice(0,40) : []; if (!items.length) { newTab(); return; } items.forEach(x => { const t = newTab(x.u); if (x.g && S.groups[x.g]) t.g = x.g; if (x.p) t.el.classList.add('pin'); }); typeof NOVA.renderGroups === 'function' && NOVA.renderGroups(); };
  const switchWorkspace = id => { if (id === S.v200.activeWorkspace) return; captureWorkspace(); const target = S.v200.workspaces.find(x => x.id === id); if (!target) return; S.v200.activeWorkspace = id; save(); destroyTabs(); loadWorkspace(); refreshWorkspaceUI(); toast2('Espacio: ' + target.name); };
  const refreshWorkspaceUI = () => { const b = $('#nova20-wsbtn'); if (b) b.textContent = '▦ ' + ws().name; const pop = $('#nova20-pop'); if (pop) { pop.innerHTML = `<div class="mut" style="padding:4px 8px">Espacios de trabajo</div>${S.v200.workspaces.map(w=>`<button class="nova20-wi" data-w="${esc(w.id)}"><span style="width:24px;text-align:center">${esc(w.icon||'•')}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(w.name)}</span>${w.id===S.v200.activeWorkspace?'<b style="color:var(--acc)">Activo</b>':''}</button>`).join('')}<hr style="border:0;border-top:1px solid var(--bd);width:100%;margin:3px 0"><button class="nova20-wi" id="nova20-newws">＋ Nuevo espacio</button><button class="nova20-wi" id="nova20-managews">⚙ Administrar espacios</button>`; pop.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>{pop.classList.remove('on');switchWorkspace(x.dataset.w)}); pop.querySelector('#nova20-newws')?.addEventListener('click',createWorkspace); pop.querySelector('#nova20-managews')?.addEventListener('click',()=>{pop.classList.remove('on');newTab('nova://workspaces')}); } };
  const createWorkspace = async () => { const r = await N.dlg?.('Nuevo espacio',[{label:'Nombre',value:'Nuevo espacio'},{label:'Icono',value:'◈'}],'Crear'); if (!r) return; const id='ws-'+Date.now().toString(36); captureWorkspace(); const n={id,name:String(r[0]||'Nuevo espacio').slice(0,40),icon:String(r[1]||'◈').slice(0,2),color:'var(--acc)',tabs:[]}; S.v200.workspaces.push(n); save(); switchWorkspace(id); };
  const renameWorkspace = async id => { const w=S.v200.workspaces.find(x=>x.id===id); if(!w)return; const r=await N.dlg?.('Editar espacio',[{label:'Nombre',value:w.name},{label:'Icono',value:w.icon||'◈'}],'Guardar'); if(!r)return; w.name=String(r[0]||w.name).slice(0,40);w.icon=String(r[1]||w.icon).slice(0,2);save();refreshWorkspaceUI(); };
  const deleteWorkspace = id => { if(S.v200.workspaces.length<=1)return toast2('Debe quedar al menos un espacio.'); if(id===S.v200.activeWorkspace)return toast2('Cambia de espacio antes de eliminarlo.'); const w=S.v200.workspaces.find(x=>x.id===id); if(!w)return; if(!confirm('¿Eliminar el espacio «'+w.name+'»?'))return; S.v200.workspaces=S.v200.workspaces.filter(x=>x.id!==id);save();refreshWorkspaceUI(); };
  const renderWorkspacesPage = r => { const render=()=>{ r.innerHTML=`<h2>Espacios de trabajo</h2><span class="mut">Organiza grupos de pestañas por contexto. Cada espacio recuerda sus pestañas sin cerrar ni borrar tus datos.</span><div class="nova20-grid">${S.v200.workspaces.map(w=>`<div class="nova20-card"><div class="row"><h3>${esc(w.icon||'◈')} ${esc(w.name)}</h3>${w.id===S.v200.activeWorkspace?'<span style="color:var(--acc)">Activo</span>':''}</div><span class="mut">${w.tabs?.length||0} pestañas guardadas</span><div class="row"><button class="btn ${w.id===S.v200.activeWorkspace?'on':''}" data-go="${esc(w.id)}">Abrir</button><button class="btn" data-ed="${esc(w.id)}">Editar</button><button class="btn" data-del="${esc(w.id)}">Eliminar</button></div></div>`).join('')}</div><button class="btn on" id="wsadd">＋ Crear espacio</button>`; r.querySelector('#wsadd').onclick=createWorkspace; r.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>switchWorkspace(b.dataset.go)); r.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>renameWorkspace(b.dataset.ed)); r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>deleteWorkspace(b.dataset.del)); }; render(); };
  PG.workspaces = renderWorkspacesPage;
  const wsbtn=document.createElement('button');wsbtn.id='nova20-wsbtn';wsbtn.title='Espacios de trabajo';wsbtn.textContent='▦ '+ws().name;document.getElementById('brand')?.after(wsbtn);const studyBtn=document.createElement('button');studyBtn.id='nova20-studybtn';studyBtn.textContent='🎓 Estudio';studyBtn.title='Abrir Nova Study';wsbtn.after(studyBtn);
  const wspop=document.createElement('div');wspop.id='nova20-pop';document.body.appendChild(wspop);wsbtn.onclick=e=>{e.stopPropagation();refreshWorkspaceUI();wspop.classList.toggle('on')};document.addEventListener('click',e=>{if(!wspop.contains(e.target)&&e.target!==wsbtn)wspop.classList.remove('on')});

  /* ---------- Reader ---------- */
  const readerCss = `article,main,[role=main]{max-width:820px!important;margin:40px auto!important;padding:0 24px!important}body{line-height:1.8!important;font-size:19px!important}header,nav,aside,footer,[class*=ad-],[id*=banner],[class*=popup],[class*=modal]{display:none!important}img,video{max-width:100%!important;height:auto!important}`;
  N.readerToggle = () => { const t=N.activeWebTab?.()||cur; if(!t?.wv?.executeJavaScript)return; S.v200.reader=!S.v200.reader; try { t.wv.executeJavaScript(`(()=>{let s=document.getElementById('__nova20_reader');if(${S.v200.reader}){if(!s){s=document.createElement('style');s.id='__nova20_reader';s.textContent=${JSON.stringify(readerCss)};(document.head||document.documentElement).appendChild(s)}}else if(s)s.remove()})()`); } catch {} save(); $('#nova20-reader-state')?.classList.toggle('on',S.v200.reader); };

  /* ---------- Study ---------- */
  const study = { root:null, left:null, right:null, ai:null, messages:[], provider:'nova' };
  const providers = { nova:['Nova IA',''], chatgpt:['ChatGPT','https://chatgpt.com/'], gemini:['Gemini','https://gemini.google.com/'], claude:['Claude','https://claude.ai/'], perplexity:['Perplexity','https://www.perplexity.ai/'] };
  const makeAiPanel = () => { const d=document.createElement('div');d.className='nova20-study-ai';d.innerHTML=`<div class="nova20-study-head"><div class="row"><b>Nova IA</b><span class="mut">La página no se envía hasta que pides analizarla.</span></div></div><div class="nova20-study-chat" id="ns-chat"><span class="mut">Pregúntame sobre la página de la izquierda.</span></div><div class="nova20-study-compose"><input class="fld" id="ns-q" placeholder="Pregúntale a la IA…"><button class="btn on" id="ns-send">Enviar</button></div>`;const send=async()=>{const q=d.querySelector('#ns-q').value.trim();if(!q)return;d.querySelector('#ns-q').value='';const body=d.querySelector('#ns-chat');if(!study.messages.length)body.replaceChildren();study.messages.push({role:'user',content:q});body.insertAdjacentHTML('beforeend',`<div class="nova20-study-msg u">${esc(q)}</div><div class="nova20-study-msg a">…</div>`);body.scrollTop=1e9;let text='';try{text=await study.left.executeJavaScript('document.body.innerText.slice(0,16000)')}catch{};const prompt='Trabajamos en modo estudio. Esta es la página que el usuario está consultando:\n\n'+text+'\n\nPregunta del usuario: '+q;const resp=await ipc.invoke('ai-ask',{msgs:[...study.messages.slice(-10)].map(m=>({role:m.role,content:m.content})),system:'Eres Nova IA dentro de Nova Study. Ayuda a estudiar el contenido de la página de forma clara, verificable y breve. Contexto de página incluido cuando corresponda. '+prompt,model:S.model||'claude-sonnet-4-6'}).catch(e=>({error:e.message}));const ans=resp?.text||resp?.error||'No hubo respuesta.';study.messages.push({role:'assistant',content:ans});const last=body.querySelectorAll('.nova20-study-msg.a');last[last.length-1].textContent=ans;body.scrollTop=1e9;};d.querySelector('#ns-send').onclick=send;d.querySelector('#ns-q').onkeydown=e=>e.key==='Enter'&&send();return d; };
  const openStudy = provider => { const u=currentUrl(); if(!u)return toast2('Abre primero una página web.'); if(study.root) return closeStudy(); study.provider=provider||S.v200.studyProvider||'nova';S.v200.studyProvider=study.provider;save(); const root=document.createElement('div');root.id='nova20-study';root.innerHTML=`<div class="nova20-studybar"><b>🎓 Nova Study</b><span class="mut">Página actual + IA</span><select class="fld" id="ns-provider" style="width:180px">${Object.entries(providers).map(([k,v])=>`<option value="${k}" ${k===study.provider?'selected':''}>${v[0]}</option>`).join('')}</select><button class="btn" id="ns-refresh">↻ Página</button><button class="btn" id="ns-reader">📖 Lectura</button><button class="btn" id="ns-shot">📸 Captura</button><button class="btn on" id="ns-close">Cerrar</button></div><div class="nova20-study-split" id="ns-split"><div class="nova20-study-pane" id="ns-left"></div><div class="nova20-study-pane" id="ns-right"></div></div>`;document.getElementById('view').appendChild(root);study.root=root;study.left=document.createElement('webview');study.left.setAttribute('partition',profilePartition());study.left.src=u;study.left.style.cssText='display:flex;position:absolute;inset:0;width:100%;height:100%';study.right=document.createElement('webview');study.right.setAttribute('partition',profilePartition());study.right.style.cssText='display:flex;position:absolute;inset:0;width:100%;height:100%';root.querySelector('#ns-left').appendChild(study.left);root.querySelector('#ns-right').appendChild(study.right);study.ai=null;const setProvider=k=>{study.provider=k;S.v200.studyProvider=k;save();if(k==='nova'){study.right.style.display='none';root.querySelector('#ns-right').replaceChildren(makeAiPanel());root.querySelector('#ns-split').classList.remove('nova20-show-ai')}else{root.querySelector('#ns-right').replaceChildren(study.right);study.right.style.display='flex';root.querySelector('#ns-split').classList.remove('nova20-show-ai');study.right.src=providers[k][1]}};root.querySelector('#ns-provider').onchange=e=>setProvider(e.target.value);root.querySelector('#ns-close').onclick=closeStudy;root.querySelector('#ns-refresh').onclick=()=>{try{study.left.reload()}catch{}};root.querySelector('#ns-reader').onclick=()=>{try{study.left.executeJavaScript(`(()=>{let s=document.getElementById('__nova20_reader');if(!s){s=document.createElement('style');s.id='__nova20_reader';s.textContent=${JSON.stringify(readerCss)};document.head.appendChild(s)}})()`)}catch{}};root.querySelector('#ns-shot').onclick=async()=>{try{const img=await study.left.capturePage();const f=await ipc.invoke('save-shot',img.toPNG());toast2(f?'Captura guardada':'No se pudo guardar la captura')}catch{toast2('No se pudo guardar la captura')}};setProvider(study.provider);};
  const closeStudy = () => { if(!study.root)return; try{study.left?.remove()}catch{} try{study.right?.remove()}catch{} study.root.remove();study.root=null;study.left=null;study.right=null;study.messages=[]; };
  studyBtn.onclick=()=>openStudy(S.v200.studyProvider);
  N.study=openStudy;

  /* ---------- Renovación visual de bienvenida ---------- */
  const oldWelcome=PG.bienvenida;
  PG.bienvenida=async r=>{ if(typeof oldWelcome==='function') await oldWelcome(r); r.querySelector('.nova20-welcome')?.remove(); const box=document.createElement('div');box.className='nova20-welcome';box.innerHTML=`<img class="nova20-hero" src="../assets/welcome/nova20-hero.jpg" alt="Nova 2.0"><div class="nova20-release"><b style="font-size:24px;color:var(--acc)">Bienvenido a Nova 2.0.0</b><span class="mut">Una gran actualización centrada en estudio, organización, rendimiento, seguridad y una experiencia renovada.</span><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="wstudy">Abrir Nova Study</button><button class="btn" id="wws">Espacios de trabajo</button><button class="btn" id="wsec">Centro de seguridad</button><button class="btn" id="wperf">Rendimiento y RAM</button></div></div><div class="nova20-grid"><div class="nova20-chip nova20-feature"><h3>🎓 Study</h3><span class="mut">La página actual y la IA elegida en una vista dividida.</span></div><div class="nova20-chip nova20-feature"><h3>▦ Workspaces</h3><span class="mut">Guarda conjuntos de pestañas por contexto.</span></div><div class="nova20-chip nova20-feature"><h3>⚡ Rendimiento</h3><span class="mut">Más herramientas para RAM, CPU y pestañas.</span></div><div class="nova20-chip nova20-feature"><h3>🛡 Seguridad</h3><span class="mut">Diagnóstico local y controles de permisos.</span></div><div class="nova20-chip nova20-feature"><h3>♿ Accesibilidad</h3><span class="mut">Escala, contraste y reducción de movimiento.</span></div><div class="nova20-chip nova20-feature"><h3>📖 Lectura</h3><span class="mut">Modo lectura desde el menú, Command Center y Study.</span></div></div>`;r.appendChild(box);box.querySelector('#wstudy').onclick=()=>openStudy();box.querySelector('#wws').onclick=()=>newTab('nova://workspaces');box.querySelector('#wsec').onclick=()=>newTab('nova://seguridad');box.querySelector('#wperf').onclick=()=>newTab('nova://rendimiento'); };

  /* ---------- What's New renovado ---------- */
  const oldNews=PG.novedades;
  PG.novedades=r=>{if(typeof oldNews==='function')oldNews(r);const old=r.querySelector('#nova20-news-card');if(old)old.remove();const card=document.createElement('div');card.id='nova20-news-card';card.className='nova20-news';card.innerHTML=`<div class="nova20-release"><b style="font-size:24px;color:var(--acc)">Nova 2.0.0 · Gran actualización</b><span class="mut">Todo lo anterior se conserva. Esta versión añade una nueva capa sobre el navegador existente.</span><ul class="nova20-list">${[
    '🎓 Nova Study: página actual + IA elegida en vista dividida, con Nova IA integrada o proveedores web externos.',
    '▦ Espacios de trabajo: guarda y cambia conjuntos de pestañas por contexto sin mezclar sesiones.',
    '🔎 Command Center reforzado: accesos directos a Study, espacios, lectura, rendimiento, seguridad y notas.',
    '📖 Modo lectura directo para artículos y páginas con una sola acción.',
    '⚡ Rendimiento/RAM ampliado: diagnóstico local de memoria y CPU, ahorro de memoria y estado por pestaña.',
    '🛡 Seguridad reforzada: permisos, navegación segura, webviews aislados y auditoría local.',
    '♿ Accesibilidad: reducción de movimiento, alto contraste y escala de interfaz.',
    '📝 Notas, capturas y PDF: integración con Study y acciones rápidas sin eliminar las funciones anteriores.',
    '🧩 Nuevas extensiones opcionales de privacidad, rendimiento y concentración.',
    '🎨 Bienvenida e instalador renovados con identidad visual de Nova 2.0.',
    '☁ Cuenta Nova y perfiles de 1.6.5 se conservan y pueden seguir sincronizando sus datos compatibles.'
  ].map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="nn-study">Study</button><button class="btn" id="nn-ws">Workspaces</button><button class="btn" id="nn-perf">Rendimiento</button><button class="btn" id="nn-sec">Seguridad</button></div></div>`;r.prepend(card);card.querySelector('#nn-study').onclick=()=>openStudy();card.querySelector('#nn-ws').onclick=()=>newTab('nova://workspaces');card.querySelector('#nn-perf').onclick=()=>newTab('nova://rendimiento');card.querySelector('#nn-sec').onclick=()=>newTab('nova://seguridad');};

  /* ---------- Accesibilidad / ajustes ---------- */
  const applyA11y=()=>{const a=S.v200.a11y||{};document.body.classList.toggle('nova20-highcontrast',!!a.highContrast);document.body.classList.toggle('nova20-reduced',!!a.reduceMotion);document.body.classList.remove('nova20-scale90','nova20-scale110','nova20-scale125');if(a.uiScale===90)document.body.classList.add('nova20-scale90');if(a.uiScale===110)document.body.classList.add('nova20-scale110');if(a.uiScale===125)document.body.classList.add('nova20-scale125');};
  const oldSet=PG.ajustes;
  PG.ajustes=r=>{ if(typeof oldSet==='function')oldSet(r); if(r.querySelector('#nova20-settings'))return;const c=document.createElement('div');c.id='nova20-settings';c.className='nova20-card';c.innerHTML=`<div class="row"><b style="color:var(--acc)">Nova 2.0</b><span class="mut">Funciones nuevas</span></div><div class="row"><span>Nova Study</span><button class="btn on" id="a-study">Abrir</button></div><div class="row"><span>Espacios de trabajo</span><button class="btn" id="a-ws">Administrar</button></div><div class="row"><span>Modo lectura</span><button class="btn ${S.v200.reader?'on':''}" id="a-read">${S.v200.reader?'Activo':'Activar'}</button></div><h3>Accesibilidad</h3><div class="row"><span>Reducir movimiento</span><div class="sw ${S.v200.a11y.reduceMotion?'on':''}" id="a-rm"></div></div><div class="row"><span>Alto contraste</span><div class="sw ${S.v200.a11y.highContrast?'on':''}" id="a-hc"></div></div><div class="row"><span>Escala de interfaz</span><select class="fld" id="a-scale" style="width:120px"><option value="90">90%</option><option value="100">100%</option><option value="110">110%</option><option value="125">125%</option></select></div><h3>Rendimiento</h3><div class="row"><span>Optimización 2.0</span><div class="sw ${S.v200.perfPlus?'on':''}" id="a-pf"></div></div><span class="mut">Conserva el throttling, reduce animaciones de interfaz y evita trabajo visual innecesario. No cierra pestañas ni borra datos.</span>`;r.appendChild(c);c.querySelector('#a-scale').value=String(S.v200.a11y.uiScale);c.querySelector('#a-study').onclick=()=>openStudy();c.querySelector('#a-ws').onclick=()=>newTab('nova://workspaces');c.querySelector('#a-read').onclick=()=>{N.readerToggle();c.querySelector('#a-read').textContent=S.v200.reader?'Activo':'Activar';c.querySelector('#a-read').classList.toggle('on',S.v200.reader)};c.querySelector('#a-rm').onclick=()=>{S.v200.a11y.reduceMotion=!S.v200.a11y.reduceMotion;save();applyA11y();c.querySelector('#a-rm').classList.toggle('on',S.v200.a11y.reduceMotion)};c.querySelector('#a-hc').onclick=()=>{S.v200.a11y.highContrast=!S.v200.a11y.highContrast;save();applyA11y();c.querySelector('#a-hc').classList.toggle('on',S.v200.a11y.highContrast)};c.querySelector('#a-scale').onchange=e=>{S.v200.a11y.uiScale=+e.target.value;save();applyA11y()};c.querySelector('#a-pf').onclick=async()=>{const next=!S.v200.perfPlus;const ok=await ipc.invoke('performance-mode',next).catch(()=>false);if(!ok)return;S.v200.perfPlus=next;save();c.querySelector('#a-pf').classList.toggle('on',next);toast2(next?'Optimización 2.0 activada':'Optimización 2.0 desactivada')}; };

  /* ---------- Menú y Command Center ---------- */
  const acts = [
    ['🎓 Nova Study',()=>openStudy()],['▦ Espacios de trabajo',()=>newTab('nova://workspaces')],['📖 Activar/desactivar modo lectura',()=>N.readerToggle()],['📊 Rendimiento y RAM',()=>newTab('nova://rendimiento')],['🛡 Auditoría de seguridad',()=>newTab('nova://seguridad')],['♿ Accesibilidad',()=>newTab('nova://ajustes')],['📝 Nueva nota',()=>newTab('nova://notas')]
  ];
  N.extraActs = Array.isArray(N.extraActs)?N.extraActs:[];for(const a of acts)if(!N.extraActs.some(x=>x[0]===a[0]))N.extraActs.push(a);
  if(Array.isArray(N.MENU)){for(const a of acts)if(!N.MENU.some(x=>x[0]===a[0]))N.MENU.push(a);const mp=document.getElementById('mnp');if(mp)mp.innerHTML=N.MENU.map((m,i)=>`<button data-i="${i}">${esc(m[0])}</button>`).join('');}

  /* ---------- Diagnóstico de rendimiento periódico, sin telemetría ---------- */
  N.performanceSnapshot = () => ipc.invoke('performance-info').catch(()=>({ok:false}));
  setInterval(()=>{ if(document.visibilityState==='visible' && S.v200.perfPlus) N.performanceSnapshot().catch(()=>{}); }, 30000);

  /* ---------- Inicio 2.0: marcar versión vista y ofrecer la pantalla renovada ---------- */
  applyA11y(); refreshWorkspaceUI();
  setTimeout(()=>{ if(S.done && S.v200.lastSeen !== NOVA_VER){ S.v200.lastSeen=NOVA_VER;save();newTab('nova://novedades'); } }, 900);
  if(!S.v200.firstRun2){ setTimeout(()=>{ if(!S.done)return; S.v200.firstRun2=true;save();newTab('nova://bienvenida'); }, 5000); }

  window.addEventListener('beforeunload',()=>{try{captureWorkspace()}catch{}});
})();


/* ---- extras9.js ---- */
/* Nova 2.1.0 - Hub aditivo desde Nova Tab: Study 2.1, rendimiento, pestañas, notas, seguridad, perfiles, sync, media, PDF y acciones. */
(() => {
  'use strict';
  const N = NOVA, { PG } = N;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast21 = m => { try { toast(m); } catch {} };
  const clone = o => { try { return JSON.parse(JSON.stringify(o)); } catch { return {}; } };
  const addStyle = css => { const s = document.createElement('style'); s.id = 'nova21-style'; s.textContent = css; document.head.appendChild(s); };

  S.v21 = Object.assign({
    memory: [],
    turbo: false,
    focus: false,
    mediaOnly: false,
    syncSelective: { marks:true, hist:true, workspaces:true, notes:true, prefs:true },
    quick: []
  }, S.v21 || {});
  if (!Array.isArray(S.v21.memory)) S.v21.memory = [];
  save();

  addStyle(`
    .nova21-panel{display:flex;flex-direction:column;gap:12px}.nova21-hero{padding:18px;border:1px solid var(--acc);border-radius:18px;background:radial-gradient(circle at 90% 10%,color-mix(in srgb,var(--acc2) 18%,transparent),transparent 42%),linear-gradient(135deg,color-mix(in srgb,var(--acc) 20%,var(--bar)),var(--bar));box-shadow:0 18px 60px #0005}.nova21-title{font-size:28px;letter-spacing:.01em}.nova21-sub{color:var(--mut);font-size:13px}.nova21-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}.nova21-card{padding:14px;border:1px solid var(--bd);border-radius:14px;background:var(--bar);display:flex;flex-direction:column;gap:8px;min-height:125px}.nova21-card:hover{border-color:color-mix(in srgb,var(--acc) 60%,var(--bd));box-shadow:0 10px 28px #0003}.nova21-card h3{margin:0}.nova21-card .mut{min-height:36px}.nova21-stat{padding:12px;border:1px solid var(--bd);border-radius:12px;background:color-mix(in srgb,var(--bar) 84%,transparent)}.nova21-actions{display:flex;flex-wrap:wrap;gap:7px}.nova21-table{display:flex;flex-direction:column;gap:6px}.nova21-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--bd);border-radius:10px;background:var(--bar)}.nova21-row>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.nova21-kbd{padding:2px 7px;border:1px solid var(--bd);border-bottom-width:2px;border-radius:6px;background:var(--bg);font:11px ui-monospace,monospace}.nova21-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--acc) 13%,transparent);border:1px solid color-mix(in srgb,var(--acc) 35%,var(--bd));color:var(--acc)}
    .nova21-mutedbox{padding:10px;border:1px dashed var(--bd);border-radius:10px;color:var(--mut)}
    body.nova21-focus #tabs .tab:not(.on){opacity:.42}body.nova21-focus #side{opacity:.75}body.nova21-focus #bar{box-shadow:0 4px 18px #0004}
    @media(max-width:800px){.nova21-grid{grid-template-columns:1fr}.nova21-actions .btn{flex:1 1 42%}}
  `);

  /* ---------- Nueva pestaña 2.1 -> Hub central ---------- */
  const oldNT = window.NT;
  window.NT = function(){ return oldNT(); };

  const newTab21Url = () => {
    const u = oldNT();
    return u;
  };

  /* ---------- Páginas internas nuevas ---------- */
  PG.hub = r => {
    r.innerHTML = `<div class="nova21-panel">
      <section class="nova21-hero"><div class="nova21-title">Nova 2.1</div><div class="nova21-sub">Todo lo nuevo, organizado desde Nova Tab. Nada de lo anterior se elimina.</div><div class="nova21-actions" style="margin-top:10px"><button class="btn on" id="h-study">🎓 Abrir Study</button><button class="btn" id="h-tabs">▤ Gestionar pestañas</button><button class="btn" id="h-cmd">⌘ Acciones rápidas</button></div></section>
      <section><h3>Centro Nova</h3><div class="nova21-grid">
        <div class="nova21-card"><h3>🎓 Study 2.1</h3><span class="mut">Modo tutor, examen y contexto de varias pestañas.</span><button class="btn on" data-go="study">Abrir</button></div>
        <div class="nova21-card"><h3>▦ Workspaces</h3><span class="mut">Espacios y grupos de pestañas guardados por contexto.</span><button class="btn" data-go="workspaces">Abrir</button></div>
        <div class="nova21-card"><h3>▤ Tab Manager</h3><span class="mut">Buscar, restaurar, dormir y organizar pestañas abiertas.</span><button class="btn" data-go="pestanas">Gestionar</button></div>
        <div class="nova21-card"><h3>📝 Nova Notes</h3><span class="mut">Notas vinculadas al contexto de navegación y Study.</span><button class="btn" data-go="notas">Abrir notas</button></div>
        <div class="nova21-card"><h3>📄 PDFs</h3><span class="mut">Centro rápido para abrir PDFs locales y enviarlos a Study.</span><button class="btn" data-go="pdf">Abrir</button></div>
        <div class="nova21-card"><h3>⚡ Nova Turbo</h3><span class="mut">Control de memoria, pestañas inactivas y trabajo visual.</span><button class="btn" data-go="rendimiento">Abrir</button></div>
        <div class="nova21-card"><h3>🛡 Seguridad</h3><span class="mut">Auditoría local, permisos y estado de protección.</span><button class="btn" data-go="seguridad">Revisar</button></div>
        <div class="nova21-card"><h3>👤 Perfiles</h3><span class="mut">Sesiones separadas, perfil activo y cuenta Nova.</span><button class="btn" data-go="perfiles">Gestionar</button></div>
        <div class="nova21-card"><h3>☁ Sync</h3><span class="mut">Sincronización selectiva de datos compatibles entre PCs.</span><button class="btn" data-go="sync">Abrir</button></div>
        <div class="nova21-card"><h3>🧩 Extensiones</h3><span class="mut">Catálogo existente más control por permisos y estado.</span><button class="btn" data-go="extensiones">Ver</button></div>
        <div class="nova21-card"><h3>🔊 Media Hub</h3><span class="mut">Encuentra pestañas de vídeo y audio abiertas.</span><button class="btn" data-go="media">Abrir</button></div>
        <div class="nova21-card"><h3>♿ Accesibilidad</h3><span class="mut">Escala, contraste y reducción de movimiento.</span><button class="btn" data-go="ajustes">Configurar</button></div>
      </div></section>
      <section><h3>Atajos de Nova</h3><div class="nova21-grid">
        <div class="nova21-stat"><span class="mut">Buscar acciones</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">K</span></div>
        <div class="nova21-stat"><span class="mut">DevTools</span><br><span class="nova21-kbd">F12</span></div>
        <div class="nova21-stat"><span class="mut">Nueva pestaña</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">T</span></div>
        <div class="nova21-stat"><span class="mut">Barra de marcadores</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">Shift</span> + <span class="nova21-kbd">B</span></div>
      </div></section>
    </div>`;
    r.querySelector('#h-study').onclick=()=>N.study?.();
    r.querySelector('#h-tabs').onclick=()=>newTab('nova://pestanas');
    r.querySelector('#h-cmd').onclick=()=>N.palette?.();
    r.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const k=b.dataset.go; if(k==='study')N.study?.(); else newTab('nova://'+k); });
  };

  PG.study = r => {
    const choices=tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{}return {i,u,title};}).filter(x=>/^https?:/i.test(x.u));
    r.innerHTML=`<div class="nova21-panel"><h2>Nova Study</h2><span class="mut">Elige la pestaña que quieres estudiar. Study abrirá el contenido junto a la IA elegida.</span><div class="nova21-table">${choices.map(x=>`<div class="nova21-row"><span>🎓 <b>${esc(x.title)}</b><br><small class="mut">${esc(x.u)}</small></span><button class="btn on" data-study="${x.i}">Estudiar</button></div>`).join('')||'<div class="nova21-mutedbox">Abre primero una página web para iniciar una sesión de Study.</div>'}</div><div class="nova21-actions"><button class="btn" id="study-new">＋ Abrir una nueva página</button><button class="btn" id="study-back">← Volver a Nova Tab</button></div></div>`;
    r.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>{const t=choices[+b.dataset.study]?.i!=null?tabs[choices[+b.dataset.study].i]:null;if(t){sel(t);N.study?.();}});
    r.querySelector('#study-new').onclick=()=>{newTab();toast21('Escribe o abre la página que quieres estudiar y vuelve a Study.');};
    r.querySelector('#study-back').onclick=()=>newTab();
  };

  PG.pestanas = r => {
    const rows = tabs.map((t,i)=>{ let u='',title='Pestaña'; try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{} return {t,i,u,title}; });
    r.innerHTML = `<div class="nova21-panel"><h2>Gestor de pestañas</h2><span class="mut">Organiza la sesión actual sin cerrar ni borrar datos.</span><div class="nova21-actions"><button class="btn" id="tm-nt">＋ Nueva pestaña</button><button class="btn" id="tm-save">Guardar en Workspace</button><button class="btn" id="tm-reopen">Reabrir cerrada</button></div><input class="fld" id="tm-q" placeholder="Buscar pestañas abiertas"><div class="nova21-table" id="tm-list"></div></div>`;
    const render = () => { const q=(r.querySelector('#tm-q').value||'').toLowerCase(); r.querySelector('#tm-list').innerHTML=rows.filter(x=>(x.title+x.u).toLowerCase().includes(q)).map(x=>`<div class="nova21-row"><span><b>${esc(x.title)}</b><br><small class="mut">${esc(x.u)}</small></span><button class="btn" data-open="${x.i}">Abrir</button><button class="btn" data-close="${x.i}">Cerrar</button></div>`).join('')||'<div class="nova21-mutedbox">No hay coincidencias.</div>'; r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>sel(rows[+b.dataset.open].t)); r.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{closeTab(rows[+b.dataset.close].t);setTimeout(()=>PG.pestanas(r),50)}); };
    r.querySelector('#tm-nt').onclick=()=>newTab();
    r.querySelector('#tm-save').onclick=()=>{ try{const w=S.v200.workspaces.find(x=>x.id===S.v200.activeWorkspace)||S.v200.workspaces[0]; if(!w)return; w.tabs=tabs.map(t=>{try{const u=t.wv.getURL(); return /^https?:/i.test(u)?{u,title:t.el.querySelector('span')?.textContent||'',p:t.el.classList.contains('pin')}:null}catch{return null}}).filter(Boolean).slice(0,40); save();toast21('Workspace actual guardado.');}catch{toast21('No se pudo guardar.')} };
    r.querySelector('#tm-reopen').onclick=()=>N.reopen?.();
    r.querySelector('#tm-q').oninput=render; render();
  };

  PG.memoria = r => {
    const render=()=>{r.innerHTML=`<div class="nova21-panel"><h2>Memoria local</h2><span class="mut">Preferencias y recordatorios guardados solo en este perfil de Nova.</span><div class="nova21-actions"><button class="btn on" id="mm-add">＋ Añadir</button><button class="btn" id="mm-clear">Borrar memoria</button></div><div class="nova21-table" id="mm-list">${S.v21.memory.map((m,i)=>`<div class="nova21-row"><span>${esc(m)}</span><button class="btn" data-del="${i}">Eliminar</button></div>`).join('')||'<div class="nova21-mutedbox">No hay memoria guardada.</div>'}</div></div>`;r.querySelector('#mm-add').onclick=async()=>{const x=await N.dlg?.('Añadir memoria',[{label:'Texto',value:''}],'Guardar');if(x?.[0]){S.v21.memory.push(String(x[0]).slice(0,500));save();render();}};r.querySelector('#mm-clear').onclick=()=>{if(confirm('¿Borrar toda la memoria local?')){S.v21.memory=[];save();render();}};r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.v21.memory.splice(+b.dataset.del,1);save();render();});};render();
  };

  PG.media = r => {
    const data=tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{} return {i,u,title};}).filter(x=>/(youtube|youtu\.be|spotify|twitch|soundcloud|\.mp4|\.webm|\.m3u8|\.mp3|\.ogg|\.wav)/i.test(x.u+x.title));
    r.innerHTML=`<div class="nova21-panel"><h2>Media Hub</h2><span class="mut">Pestañas que parecen contener vídeo o audio.</span><div class="nova21-table">${data.map(x=>`<div class="nova21-row"><span>🔊 ${esc(x.title)}<br><small class="mut">${esc(x.u)}</small></span><button class="btn" data-open="${x.i}">Abrir</button></div>`).join('')||'<div class="nova21-mutedbox">No se han detectado pestañas multimedia por URL/título.</div>'}</div></div>`;
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>sel(tabs[+b.dataset.open]));
  };

  PG.pdf = r => {
    r.innerHTML=`<div class="nova21-panel"><h2>Centro PDF</h2><span class="mut">Acceso rápido a PDFs locales. El documento no se sube automáticamente a ningún servicio.</span><div class="nova21-actions"><button class="btn on" id="pdf-pick">📄 Abrir PDF</button><button class="btn" id="pdf-study">🎓 Estudiar pestaña PDF</button></div><div class="nova21-mutedbox">Para estudiar un PDF abierto, pulsa “Estudiar pestaña PDF”: Nova Study trabajará sobre la pestaña seleccionada cuando lo solicites.</div></div>`;
    r.querySelector('#pdf-pick').onclick=()=>toast21('Abre un PDF con Ctrl+O o desde Descargas; el visor PDF de Chromium se conserva.');
    r.querySelector('#pdf-study').onclick=()=>N.study?.();
  };

  PG.perfiles = r => {
    r.innerHTML=`<div class="nova21-panel"><h2>Perfiles</h2><span class="mut">Tus perfiles de 1.6.5 siguen funcionando con sus sesiones separadas.</span><div class="nova21-grid" id="pf21"></div><div class="nova21-actions"><button class="btn on" id="pf-new">＋ Crear perfil</button><button class="btn" id="pf-settings">Cuenta y perfiles en Ajustes</button></div></div>`;
    const list=document.getElementById('pf21');const ps=Array.isArray(S.profiles)?S.profiles:[];list.innerHTML=ps.map(p=>`<div class="nova21-card"><h3>${esc(p.avatar||'P')} ${esc(p.name||'Perfil')}</h3><span class="mut">${p.id===S.activeProfile?'Activo':'Disponible'}</span><div class="nova21-actions"><button class="btn ${p.id===S.activeProfile?'on':''}" data-sw="${esc(p.id)}">${p.id===S.activeProfile?'Activo':'Cambiar'}</button></div></div>`).join('')||'<div class="nova21-mutedbox">No hay perfiles adicionales.</div>';list.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>N.switchProfile?.(b.dataset.sw));r.querySelector('#pf-new').onclick=()=>N.createProfile?.();r.querySelector('#pf-settings').onclick=()=>newTab('nova://ajustes');
  };

  PG.sync = async r => {
    const st=await ipc.invoke('account-status').catch(()=>({loggedIn:false,id:''}));
    r.innerHTML=`<div class="nova21-panel"><h2>Nova Sync</h2><span class="mut">Estado: ${st.loggedIn?'<span class="nova21-pill">ONLINE</span>':'sin sesión'}</span><div class="nova21-grid"><div class="nova21-card"><h3>☁ Datos compatibles</h3><span class="mut">Marcadores, historial, Workspaces, notas y preferencias compatibles con la cuenta.</span><div class="nova21-actions"><button class="btn on" id="sy-now">Sincronizar ahora</button><button class="btn" id="sy-set">Ajustar en Ajustes</button></div></div><div class="nova21-card"><h3>🔐 Privacidad</h3><span class="mut">Las credenciales del navegador, cookies y secretos de IA quedan fuera de esta sincronización general.</span></div></div><div class="nova21-mutedbox">La sincronización fusiona estados compatibles; no elimina datos del PC de origen.</div></div>`;
    r.querySelector('#sy-now').onclick=async()=>{const ok=await N.accountSync?.(true); if(ok)toast21('Nova Sync actualizado.');};r.querySelector('#sy-set').onclick=()=>newTab('nova://ajustes');
  };

  PG.extensiones = r => {
    const EXT = N.extensions || (typeof require==='function' ? require('./extensions.js') : null);
    const list=EXT?.CATALOG||[];
    r.innerHTML=`<div class="nova21-panel"><h2>Extensiones</h2><span class="mut">Las ${list.length||0} extensiones actuales permanecen intactas. Desde aquí puedes abrir su gestor completo.</span><div class="nova21-actions"><button class="btn on" id="ex-open">Abrir gestor de extensiones</button></div><div class="nova21-grid">${list.slice(0,18).map(x=>`<div class="nova21-card"><h3>${esc(x.name)}</h3><span class="mut">${esc(x.cat)} · ${esc(x.desc||'')}</span></div>`).join('')}</div></div>`;
    r.querySelector('#ex-open').onclick=()=>{document.querySelector('#side [data-p="mods"]')?.click();};
  };

  PG.acciones = r => {
    const actions=[['🎓 Study',()=>N.study?.()],['▦ Workspaces',()=>newTab('nova://workspaces')],['▤ Pestañas',()=>newTab('nova://pestanas')],['⚡ Rendimiento',()=>newTab('nova://rendimiento')],['🛡 Seguridad',()=>newTab('nova://seguridad')],['📝 Nueva nota',()=>newTab('nova://notas')],['☁ Sync',()=>newTab('nova://sync')],['👤 Perfiles',()=>newTab('nova://perfiles')],['📄 PDF',()=>newTab('nova://pdf')],['🔊 Media Hub',()=>newTab('nova://media')],['🧠 Memoria local',()=>newTab('nova://memoria')],['♿ Accesibilidad',()=>newTab('nova://ajustes')]];
    r.innerHTML=`<div class="nova21-panel"><h2>Acciones rápidas</h2><span class="mut">El mismo centro al que accede Ctrl+K, ahora visible desde Nova Tab.</span><div class="nova21-grid">${actions.map((a,i)=>`<button class="btn" data-a="${i}" style="text-align:left;padding:14px">${esc(a[0])}</button>`).join('')}</div></div>`;r.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>actions[+b.dataset.a][1]());
  };

  /* ---------- Nova Turbo ---------- */
  const applyTurbo = async on => {
    const ok=await ipc.invoke('performance-mode',!!on).catch(()=>false);
    if(ok){S.v21.turbo=!!on;save();document.body.classList.toggle('nova21-focus',!!S.v21.focus);}
    return ok;
  };
  PG.rendimiento21 = r => {};
  const oldPerf = PG.rendimiento;
  PG.rendimiento = r => {
    if(typeof oldPerf==='function') oldPerf(r);
    const c=document.createElement('section');c.className='nova21-card';c.innerHTML=`<h3>🚀 Nova Turbo 2.1</h3><span class="mut">Capa adicional de rendimiento: reduce trabajo visual de Nova y activa las medidas de ahorro existentes. No cierra pestañas ni borra datos.</span><div class="nova21-actions"><button class="btn ${S.v21.turbo?'on':''}" id="t21">${S.v21.turbo?'Turbo activado':'Activar Turbo'}</button><button class="btn" id="focus21">${S.v21.focus?'Salir de enfoque':'Modo enfoque'}</button><button class="btn" id="tabs21">Gestionar pestañas</button></div>`;r.appendChild(c);c.querySelector('#t21').onclick=async()=>{const ok=await applyTurbo(!S.v21.turbo);if(ok){c.querySelector('#t21').textContent=S.v21.turbo?'Turbo activado':'Activar Turbo';c.querySelector('#t21').classList.toggle('on',S.v21.turbo);toast21(S.v21.turbo?'Nova Turbo activado':'Nova Turbo desactivado')}};c.querySelector('#focus21').onclick=()=>{S.v21.focus=!S.v21.focus;save();document.body.classList.toggle('nova21-focus',S.v21.focus);c.querySelector('#focus21').textContent=S.v21.focus?'Salir de enfoque':'Modo enfoque';};c.querySelector('#tabs21').onclick=()=>newTab('nova://pestanas');
  };

  /* ---------- Study 2.1: controles encima del Study existente ---------- */
  const oldStudy = N.study;
  const openStudy21 = provider => {
    if(typeof oldStudy!=='function') return;
    oldStudy(provider);
    setTimeout(()=>{
      const root=document.getElementById('nova20-study'); if(!root || root.querySelector('#nova21-studytools')) return;
      const bar=root.querySelector('.nova20-studybar'); if(!bar) return;
      const tools=document.createElement('div');tools.id='nova21-studytools';tools.className='nova21-actions';tools.innerHTML=`<button class="btn" id="s21-tutor">Tutor</button><button class="btn" id="s21-exam">Examen</button><button class="btn" id="s21-multi">Contexto + pestañas</button><button class="btn" id="s21-memory">Memoria</button><button class="btn" id="s21-focus">Enfoque</button>`;bar.appendChild(tools);
      tools.querySelector('#s21-tutor').onclick=()=>toast21('Modo Tutor: pide a la IA que explique paso a paso y no salte directamente al resultado.');
      tools.querySelector('#s21-exam').onclick=()=>toast21('Modo Examen: pide preguntas, responde primero y después solicita la corrección.');
      tools.querySelector('#s21-multi').onclick=()=>{const urls=tabs.map(t=>{try{return t.wv.getURL()}catch{return ''}}).filter(u=>/^https?:/i.test(u)).slice(0,10);toast21('Contexto preparado con '+urls.length+' pestañas.');};
      tools.querySelector('#s21-memory').onclick=()=>newTab('nova://memoria');
      tools.querySelector('#s21-focus').onclick=()=>{S.v21.focus=!S.v21.focus;save();document.body.classList.toggle('nova21-focus',S.v21.focus);};
    },250);
  };
  N.study = openStudy21;

  /* ---------- Todos los accesos desde Nova Tab ---------- */
  const wrappedNewTab = newTab;
  newTab = function(u){
    if(u==='nova://study'){let current='';try{current=(N.activeWebTab?.()||cur)?.wv?.getURL?.()||'';}catch{} if(current && !isNT(current) && /^https?:/i.test(current)){N.study?.();return cur;} return wrappedNewTab('nova://study');}
    return wrappedNewTab(u);
  };

  /* ---------- Menú / Command Center ---------- */
  if(Array.isArray(N.extraActs)){
    const acts=[['Nova 2.1 · Centro',()=>newTab('nova://hub')],['Nova 2.1 · Pestañas',()=>newTab('nova://pestanas')],['Nova 2.1 · Memoria local',()=>newTab('nova://memoria')],['Nova 2.1 · Media Hub',()=>newTab('nova://media')],['Nova 2.1 · Sync',()=>newTab('nova://sync')]];
    acts.forEach(a=>{if(!N.extraActs.some(x=>x[0]===a[0]))N.extraActs.push(a)});
  }

  /* ---------- Nova Tab es el punto de partida; el hub está integrado directamente en newtab.html ---------- */

  /* ---------- What's New 2.1 y primera entrada ---------- */
  const oldNews=PG.novedades;
  PG.novedades=r=>{if(typeof oldNews==='function')oldNews(r);if(r.querySelector('#nova21-news'))return;const c=document.createElement('div');c.id='nova21-news';c.className='nova21-card';c.innerHTML=`<h2>Nova 2.1.0</h2><span class="mut">Nueva capa centrada en Nova Tab: todas las herramientas nuevas parten de la página inicial.</span><ul style="margin:0;padding-left:20px"><li>Study 2.1 con controles de Tutor, Examen, contexto y enfoque.</li><li>Centro Nova 2.1 desde la Nueva pestaña.</li><li>Gestor de pestañas, memoria local y Media Hub.</li><li>Centro PDF y acceso directo a Notas.</li><li>Perfiles, Sync, extensiones y seguridad reunidos desde Nova Tab.</li><li>Nova Turbo para rendimiento y trabajo visual.</li></ul><button class="btn on" id="n21hub">Abrir Centro 2.1</button>`;r.prepend(c);c.querySelector('#n21hub').onclick=()=>newTab('nova://hub');};

  const oldWelcome=PG.bienvenida;
  PG.bienvenida=async r=>{if(typeof oldWelcome==='function')await oldWelcome(r);if(r.querySelector('#nova21-welcome'))return;const c=document.createElement('div');c.id='nova21-welcome';c.className='nova21-card';c.innerHTML=`<h2>Bienvenido a Nova 2.1.0</h2><span class="mut">Ahora Nova Tab es el punto de partida de todas las herramientas nuevas.</span><div class="nova21-actions"><button class="btn on" id="w21">Abrir Centro 2.1</button><button class="btn" id="ws21">Nova Study</button></div>`;r.appendChild(c);c.querySelector('#w21').onclick=()=>newTab('nova://hub');c.querySelector('#ws21').onclick=()=>N.study?.();};

  const normalizeV21=()=>{S.v21=Object.assign({memory:[],turbo:false,focus:false,mediaOnly:false,syncSelective:{marks:true,hist:true,workspaces:true,notes:true,prefs:true},quick:[]},S.v21||{});if(!Array.isArray(S.v21.memory))S.v21.memory=[];return S.v21;};
  if(typeof N.switchProfile==='function'){
    const baseSwitchProfile=N.switchProfile;
    N.switchProfile=async id=>{const out=await baseSwitchProfile(id);normalizeV21();save();return out;};
  }
  if(typeof N.createProfile==='function'){
    const baseCreateProfile=N.createProfile;
    N.createProfile=async(...args)=>{const out=await baseCreateProfile(...args);normalizeV21();save();return out;};
  }
  if(Array.isArray(S.v200?.workspaces)){
    S.v200.lastLaunchHub=NOVA_VER; normalizeV21(); save();
  }
})();


/* ---- extras10.js ---- */
/* Nova 2.2.0 - capa aditiva: barra superior, vista dividida, menú web robusto, perfiles, zoom, primer inicio, novedades y actualizaciones directas. */
(() => {
  const N = NOVA, { PG } = N;
  const esc22 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast22 = m => { try { toast(m); } catch {} };
  S.v22 = Object.assign({ firstRunGuide:false, defaultPromptSeen:false, zoom:100, topOpen:false }, S.v22 || {});
  const save22 = () => { try { save(); } catch {} };

  // ---------- Barra superior: todas las funciones principales ----------
  const tools = document.getElementById('nova22-top-tools');
  const topPop = document.createElement('div'); topPop.id='nova22-top-pop'; document.body.appendChild(topPop);
  const topBtn = document.createElement('button'); topBtn.id='nova22-main-btn'; topBtn.className='nova22-topbtn'; topBtn.textContent='✦ Nova'; topBtn.title='Nova Tab, Study, vista dividida, perfiles, zoom y más'; tools?.appendChild(topBtn);
  const zoomBtn = document.createElement('button'); zoomBtn.id='nova22-zoom-btn'; zoomBtn.className='nova22-topbtn'; zoomBtn.textContent='100%'; zoomBtn.title='Zoom de la página actual'; tools?.appendChild(zoomBtn);

  const topItems = [
    ['⌂','Nova Tab',()=>newTab()],
    ['🎓','Study',()=>N.study?.()],
    ['▥','Vista dividida',()=>N.splitView?.()],
    ['👤','Perfiles',()=>openProfiles22()],
    ['📝','Notas',()=>newTab('nova://notas')],
    ['▦','Workspaces',()=>newTab('nova://workspaces')],
    ['⚡','Rendimiento',()=>newTab('nova://rendimiento')],
    ['🛡','Seguridad',()=>newTab('nova://seguridad')],
    ['📰','Novedades',()=>newTab('nova://novedades')],
    ['↻','Buscar actualizaciones',()=>checkUpdates22(true)]
  ];
  topPop.innerHTML = topItems.map((x,i)=>`<button class="nova22-menuitem" data-ti="${i}"><span style="width:24px;text-align:center">${x[0]}</span><span>${esc22(x[1])}</span></button>`).join('');
  topPop.querySelectorAll('[data-ti]').forEach(b=>b.onclick=()=>{ topPop.classList.remove('on'); topBtn.classList.remove('on'); topItems[+b.dataset.ti][2](); });
  topBtn.onclick=e=>{e.stopPropagation();const on=!topPop.classList.contains('on');topPop.classList.toggle('on',on);topBtn.classList.toggle('on',on);zoomPop.classList.remove('on');profilePop.classList.remove('on');};

  // ---------- Zoom real ----------
  const zoomPop=document.createElement('div'); zoomPop.id='nova22-zoom-pop'; document.body.appendChild(zoomPop);
  zoomPop.innerHTML=`<div class="row"><b>Zoom</b><button class="btn" id="zreset">Restablecer</button></div><div class="nova22-zoomrow" style="margin-top:8px"><button class="btn" id="zminus">−</button><div class="nova22-zoompct" id="zpct">100%</div><button class="btn" id="zplus">+</button></div><div class="mut" style="margin-top:7px">Ctrl + + / Ctrl + − · Ctrl + 0</div>`;
  const zoomFactor=()=>{try{return Math.max(.25,Math.min(5,Number((N.activeWebTab?.()||cur)?.wv?.getZoomFactor?.()||1)))}catch{return 1}};
  const paintZoom=()=>{const n=Math.round(zoomFactor()*100);zoomBtn.textContent=n+'%';zoomPop.querySelector('#zpct').textContent=n+'%';S.v22.zoom=n;save22();};
  const setZoom22=n=>{try{(N.activeWebTab?.()||cur)?.wv?.setZoomFactor?.(Math.max(.25,Math.min(5,n)));paintZoom();}catch{toast22('Este contenido no permite cambiar el zoom.')}};
  zoomBtn.onclick=e=>{e.stopPropagation();const on=!zoomPop.classList.contains('on');zoomPop.classList.toggle('on',on);topPop.classList.remove('on');profilePop.classList.remove('on');paintZoom();};
  zoomPop.querySelector('#zminus').onclick=()=>setZoom22(zoomFactor()-.1);
  zoomPop.querySelector('#zplus').onclick=()=>setZoom22(zoomFactor()+.1);
  zoomPop.querySelector('#zreset').onclick=()=>setZoom22(1);
  ipc.on('zoom-changed',(_,d)=>{ if(d?.factor) paintZoom(); });

  // ---------- Perfiles en ventana principal: botón siempre funcional ----------
  const profilePop=document.createElement('div'); profilePop.id='nova22-profile-fallback'; profilePop.style.cssText='position:fixed;top:42px;right:105px;z-index:250;display:none;min-width:270px;padding:9px;background:var(--bar);border:1px solid var(--bd);border-radius:14px;box-shadow:0 24px 80px #000c'; document.body.appendChild(profilePop);
  const profileBtn=document.getElementById('nova-profile-button');
  if(profileBtn){profileBtn.style.zIndex='180';profileBtn.style.webkitAppRegion='no-drag';profileBtn.title='Perfiles Nova';}
  const currentProfile22=()=>S.profiles?.find?.(p=>p.id===S.activeProfile)||S.profiles?.[0]||{name:'Principal',avatar:'N'};
  function drawProfiles22(){
    const cp=currentProfile22(), list=Array.isArray(S.profiles)?S.profiles:[];
    profilePop.innerHTML=`<div class="mut" style="padding:5px 8px 9px">Perfil activo · <b>${esc22(cp.name)}</b></div>${list.map(p=>`<button class="nova22-menuitem" data-pid="${esc22(p.id)}"><span style="width:24px;text-align:center;border-radius:50%;background:var(--acc);color:#fff;padding:4px 0;font-size:10px">${esc22(p.avatar||p.name?.slice(0,1)||'P')}</span><span style="flex:1">${esc22(p.name||'Perfil')}</span>${p.id===S.activeProfile?'✓':''}</button>`).join('')}<hr class="nova22-ctxsep"><button class="nova22-menuitem" id="pf-create22"><span style="width:24px">＋</span><span>Crear perfil</span></button><button class="nova22-menuitem" id="pf-manage22"><span style="width:24px">⚙</span><span>Administrar perfiles</span></button>`;
    profilePop.querySelectorAll('[data-pid]').forEach(b=>b.onclick=async()=>{profilePop.style.display='none';try{await N.switchProfile?.(b.dataset.pid);toast22('Perfil cambiado.');setTimeout(()=>{try{paintZoom()}catch{}},150)}catch{toast22('No se pudo cambiar de perfil.')}});
    profilePop.querySelector('#pf-create22').onclick=async()=>{try{await N.createProfile?.();drawProfiles22();}catch{}};
    profilePop.querySelector('#pf-manage22').onclick=()=>{profilePop.style.display='none';newTab('nova://perfiles');};
  }
  const openProfiles22=()=>{drawProfiles22();profilePop.style.display=profilePop.style.display==='block'?'none':'block';topPop.classList.remove('on');zoomPop.classList.remove('on');};
  if(profileBtn) profileBtn.onclick=e=>{e.preventDefault();e.stopPropagation();openProfiles22();};
  else { const b=document.createElement('button');b.className='nova22-topbtn';b.textContent='👤';b.title='Perfiles Nova';b.onclick=openProfiles22;tools?.appendChild(b); }
  document.addEventListener('click',e=>{if(!profilePop.contains(e.target)&&!e.target.closest('#nova-profile-button'))profilePop.style.display='none';if(!topPop.contains(e.target)&&!e.target.closest('#nova22-main-btn'))topPop.classList.remove('on');if(!zoomPop.contains(e.target)&&!e.target.closest('#nova22-zoom-btn'))zoomPop.classList.remove('on');});

  // ---------- Vista dividida ----------
  let split=null;
  const cleanHttp=u=>{try{const x=new URL(String(u||''));return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
  function closeSplit22(){
    if(!split)return;
    try{const {t,left,right,host}=split;right?.remove();host?.remove();const view=document.getElementById('view');if(view&&left&&left.parentNode===host){};if(view&&t?.wv){view.appendChild(t.wv);Object.assign(t.wv.style,{position:'absolute',left:'',top:'',right:'',bottom:'',width:'',height:'',display:''});t.wv.classList.add('on');} }catch{}
    split=null; toast22('Vista dividida cerrada.');
  }
  async function splitView22(){
    if(split){closeSplit22();return;}
    const source = N.activeWebTab?.() || cur; if(!source?.wv)return;
    const current=cleanHttp(source.wv.getURL?.());
    let target='';
    try{const r=await N.dlg?.('Vista dividida',[{label:'Dirección del panel derecho',value:'https://www.google.com'}],'Abrir');if(!r)return;target=cleanHttp(r[0]);}catch{}
    if(!target)return toast22('Escribe una dirección HTTP o HTTPS.');
    const host=document.getElementById('nova22-split');if(!host)return;
    const t=source;
    const left=document.createElement('div');left.className='nova22-split-pane nova22-split-left';
    const right=document.createElement('div');right.className='nova22-split-pane nova22-split-right';
    const head=document.createElement('div');head.className='nova22-split-head';head.innerHTML=`<b style="font-size:12px">Vista dividida</b><button class="btn" id="swap22">Intercambiar</button><button class="btn" id="close22">Cerrar</button>`;
    host.replaceChildren(head,left,right);host.style.display='block';
    document.getElementById('view').appendChild(host);
    left.appendChild(t.wv);
    Object.assign(t.wv.style,{position:'absolute',left:'0',top:'0',right:'0',bottom:'0',width:'100%',height:'100%',display:'flex'});
    const second=document.createElement('webview');second.setAttribute('partition',N.profilePartition?.()||'persist:web');second.src=target;right.appendChild(second);
    split={t,left,right,host,second};
    attachCtx22({wv:second});
    head.querySelector('#close22').onclick=closeSplit22;
    head.querySelector('#swap22').onclick=()=>{const a=t.wv,b=second;if(a.parentNode!==left||b.parentNode!==right)return;left.appendChild(b);right.appendChild(a);Object.assign(a.style,{left:'0',top:'0',width:'100%',height:'100%'});Object.assign(b.style,{left:'0',top:'0',width:'100%',height:'100%'});split.swapped=!split.swapped;};
    toast22('Vista dividida activa.');
  }
  N.splitView=splitView22;
  const baseSel22=sel; sel=t=>{if(split)closeSplit22();baseSel22(t);setTimeout(paintZoom,0);};
  const baseClose22=closeTab; closeTab=t=>{if(split?.t===t)closeSplit22();return baseClose22(t)};

  // ---------- Menú contextual web fallback ----------
  let webCtx=null, ctxTarget=null;
  function ensureWebCtx(){
    if(webCtx)return webCtx;
    webCtx=document.createElement('div');webCtx.id='nova22-webctx';document.body.appendChild(webCtx);
    document.addEventListener('click',e=>{if(!webCtx.contains(e.target))webCtx.classList.remove('on')},true);
    return webCtx;
  }
  const ctxAction=(label,fn,sep=false)=>({label,fn,sep});
  function showWebCtx22(t,d,x,y){
    ctxTarget={t,d}; const m=ensureWebCtx(); const acts=[];
    if(d.linkURL&&cleanHttp(d.linkURL)){acts.push(ctxAction('Abrir enlace en una pestaña nueva',()=>newTab(cleanHttp(d.linkURL))));acts.push(ctxAction('Copiar dirección del enlace',()=>require('electron').clipboard.writeText(cleanHttp(d.linkURL))));}
    if(d.mediaType==='image'&&cleanHttp(d.srcURL)){acts.push(ctxAction('Abrir imagen en una pestaña nueva',()=>newTab(cleanHttp(d.srcURL))));acts.push(ctxAction('Copiar dirección de la imagen',()=>require('electron').clipboard.writeText(cleanHttp(d.srcURL))));acts.push(ctxAction('Guardar imagen',()=>t.wv.downloadURL(cleanHttp(d.srcURL))));}
    if(d.isEditable){acts.push(ctxAction('Cortar',()=>t.wv.cut()));acts.push(ctxAction('Copiar',()=>t.wv.copy()));acts.push(ctxAction('Pegar',()=>t.wv.paste?.()));acts.push(ctxAction('Seleccionar todo',()=>t.wv.selectAll()));}
    if(d.selectionText){acts.push(ctxAction('Copiar selección',()=>t.wv.copy()));acts.push(ctxAction('Buscar selección',()=>{const u=cleanHttp(S.search+encodeURIComponent(d.selectionText.slice(0,1000)));if(u)newTab(u)}));acts.push(ctxAction('Explicar con Nova IA',()=>N.askSel?.(d.selectionText)));acts.push(ctxAction('Traducir con Nova IA',()=>N.askSel?.('Traduce al español:\n'+d.selectionText)));}
    if(acts.length)acts.push(ctxAction('',()=>{},true));
    try{const nav=t.wv.navigationHistory;acts.push(ctxAction('Atrás',()=>nav.canGoBack()&&nav.goBack()),ctxAction('Adelante',()=>nav.canGoForward()&&nav.goForward()),ctxAction('Recargar',()=>t.wv.reload()),ctxAction('Copiar dirección de la página',()=>require('electron').clipboard.writeText(t.wv.getURL())),ctxAction('Captura de pantalla',()=>$('#sh').click()),ctxAction('Inspeccionar elemento',()=>{const a=d.x||0,b=d.y||0;t.wv.inspectElement(a,b)}),ctxAction('Abrir DevTools (F12)',()=>t.wv.openDevTools?.()));}catch{}
    m.innerHTML=acts.map((a,i)=>a.sep?'<hr class="nova22-ctxsep">':`<button class="nova22-ctxitem" data-ci="${i}">${esc22(a.label)}</button>`).join('');
    m.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>{m.classList.remove('on');try{acts[+b.dataset.ci].fn()}catch{}});
    const w=innerWidth,h=innerHeight;const mw=260,mh=Math.min(420,m.innerHTML.length/2+80);m.style.left=Math.max(4,Math.min(x,w-mw))+'px';m.style.top=Math.max(4,Math.min(y,h-mh))+'px';m.classList.add('on');
  }
  function attachCtx22(t){
    if(!t?.wv||t.wv.__nova22ctx)return;t.wv.__nova22ctx=true;
    t.wv.addEventListener('console-message',e=>{if(!String(e.message||'').startsWith('NOVA_CTX22:'))return;let d;try{d=JSON.parse(String(e.message).slice(10))}catch{return}showWebCtx22(t,d,(t.wv.getBoundingClientRect().left||0)+(d.x||0),(t.wv.getBoundingClientRect().top||0)+(d.y||0));});
    const prefix='NOVA_CTX22:';
    const code=`(()=>{if(window.__NOVA_CTX22)return;window.__NOVA_CTX22=1;document.addEventListener('contextmenu',e=>{try{e.preventDefault();console.log(${JSON.stringify(prefix)}+JSON.stringify({x:e.clientX,y:e.clientY,selectionText:String(getSelection()||'').slice(0,6000),isEditable:!!e.target.closest?.('input,textarea,[contenteditable="true"]'),linkURL:(e.target.closest?.('a')?.href||''),mediaType:e.target.tagName==='IMG'?'image':'',srcURL:e.target.tagName==='IMG'?(e.target.currentSrc||e.target.src||''):''}))}catch{}} ,true)})()`;
    setTimeout(()=>t.wv.executeJavaScript(code).catch(()=>{}),80);
  }
  tabs.forEach(attachCtx22);
  const bn22=newTab; newTab=function(u){const t=bn22(u);setTimeout(()=>attachCtx22(t),120);return t;};

  // ---------- Primer inicio + navegador predeterminado ----------
  async function firstRun22(){
    if(S.v22.firstRunGuide)return;
    S.v22.firstRunGuide=true;save22();
    const box=document.createElement('div');box.id='nova22-first';document.body.appendChild(box);
    let isDefault=false, portable=false; try{const d=await ipc.invoke('default-browser',false);isDefault=!!d?.isDefault;portable=!!d?.portable}catch{}
    const render=()=>{box.classList.add('on');box.innerHTML=`<div class="row"><div><h2 style="margin:0">Bienvenido a Nova 2.2</h2><span class="mut">Una puesta a punto de las funciones que ya tienes, sin quitar nada.</span></div><button class="btn" id="first-close">Cerrar</button></div><div class="nova22-first-grid" style="margin-top:12px"><div class="nova22-first-card"><b>⚡ Barra superior</b><div class="mut">Nova Tab, Study, dividir, perfiles, zoom y más están a un clic.</div></div><div class="nova22-first-card"><b>↻ Actualizaciones</b><div class="mut">Nova puede comprobar y, en una instalación empaquetada, descargar la actualización sin desinstalar primero.</div></div><div class="nova22-first-card"><b>🧭 Navegador predeterminado</b><div class="mut">${portable?'El portable no puede registrarse como predeterminado.':isDefault?'Nova ya es tu navegador predeterminado.':'Te guío a la pantalla oficial de Windows para elegir Nova.'}</div><button class="btn ${isDefault||portable?'':'on'}" id="first-default" ${portable||isDefault?'disabled':''}>${isDefault?'Ya configurado':portable?'No disponible en portable':'Configurar Nova'}</button></div><div class="nova22-first-card"><b>◫ Vista dividida</b><div class="mut">Mantén dos páginas visibles en la misma ventana y cambia de lado cuando quieras.</div></div></div><div class="nova22-first-actions"><button class="btn on" id="first-ok">Entrar en Nova</button></div>`;
      box.querySelector('#first-close').onclick=()=>box.remove();box.querySelector('#first-ok').onclick=()=>box.remove();box.querySelector('#first-default').onclick=async()=>{await ipc.invoke('default-browser',true).catch(()=>{});toast22('Windows ha abierto la pantalla oficial de Aplicaciones predeterminadas.');};
    };render();
  }
  const firstPrefs=()=>{try{return S.v22.firstRunGuide!==true}catch{return true}};
  if(firstPrefs())setTimeout(firstRun22,1100);

  // Also add the default-browser guide to the existing welcome page without replacing it.
  const oldWelcome22=PG.bienvenida;
  PG.bienvenida=async r=>{
    if(typeof oldWelcome22==='function')await oldWelcome22(r);
    if(r.querySelector('#nova22-default-card'))return;
    const c=document.createElement('section');c.id='nova22-default-card';c.className='nova21-card';
    c.innerHTML='<h2>🧭 Navegador predeterminado</h2><span class="mut">Nova te puede guiar a la pantalla oficial de Windows para elegirlo como navegador predeterminado. Nova no cambia esa elección por ti.</span><div class="row" style="justify-content:flex-start;margin-top:8px"><button class="btn on" id="n22def">Configurar Nova</button><button class="btn" id="n22upw">Buscar actualizaciones</button></div>';
    r.appendChild(c);c.querySelector('#n22def').onclick=async()=>{const d=await ipc.invoke('default-browser',true).catch(()=>null);if(d?.portable)toast22('El portable no puede registrarse como navegador predeterminado.');else toast22('Abierta la configuración oficial de Windows.');};c.querySelector('#n22upw').onclick=()=>checkUpdates22(true);
  };

  // ---------- Novedades 2.2 ----------
  const oldNews22=PG.novedades;
  PG.novedades=r=>{
    if(typeof oldNews22==='function')oldNews22(r);
    if(r.querySelector('#nova22-news'))return;
    const c=document.createElement('section');c.id='nova22-news';c.className='nova21-card';
    c.innerHTML=`<h2>Nova 2.2.0</h2><span class="mut">Una actualización centrada en hacer más accesibles las funciones existentes y mejorar el ciclo de actualización.</span><ul style="margin:0;padding-left:20px"><li>Nuevo acceso en la barra superior a Nova Tab, Study, vista dividida, perfiles, zoom, novedades y actualizaciones.</li><li>Vista dividida para trabajar con dos páginas en la misma ventana, con intercambio de paneles y cierre limpio.</li><li>Menú contextual de webs reforzado con un fallback propio para enlaces, imágenes, selección, navegación y DevTools.</li><li>Perfiles accesibles directamente desde la ventana principal, con cambio y gestión desde el mismo menú.</li><li>Zoom real de la página con porcentaje actual, +, −, restablecer y atajos Ctrl + + / Ctrl + − / Ctrl + 0.</li><li>Guía de primer inicio para configurar Nova como navegador predeterminado.</li><li>Buscar actualizaciones usa el actualizador de Electron cuando Nova está instalada; permite descargar y aplicar la actualización sobre la instalación existente.</li><li>Pequeñas mejoras de estabilidad, rendimiento y uso de memoria manteniendo las funciones anteriores.</li></ul><div class="row" style="justify-content:flex-start;flex-wrap:wrap;margin-top:8px"><button class="btn on" id="n22check">Buscar actualizaciones</button><button class="btn" id="n22home">Abrir Nova Tab</button></div>`;
    r.prepend(c);c.querySelector('#n22check').onclick=()=>checkUpdates22(true);c.querySelector('#n22home').onclick=()=>newTab();
  };

  // ---------- Actualizaciones ----------
  let updateBox22=null;
  function ensureUpdateBox22(){if(updateBox22)return updateBox22;const b=document.createElement('div');b.id='nova22-updatebox';b.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:700;width:min(560px,92vw);padding:13px 15px;background:var(--bar);border:1px solid var(--acc);border-radius:15px;box-shadow:0 25px 90px #000b;display:flex;align-items:center;gap:10px';b.innerHTML='<div style="flex:1"><b id="n22ut">Nova</b><div class="mut" id="n22us"></div></div><button class="btn" id="n22later">Más tarde</button><button class="btn on" id="n22get">Descargar</button><button class="btn on" id="n22install" style="display:none">Instalar y reiniciar</button>';document.body.appendChild(b);updateBox22=b;b.querySelector('#n22later').onclick=()=>{b.remove();updateBox22=null};b.querySelector('#n22get').onclick=async()=>{const x=await ipc.invoke('update-download').catch(()=>({ok:false,error:'No disponible'}));if(!x.ok)toast22(x.error||'No se pudo descargar.')};b.querySelector('#n22install').onclick=()=>ipc.invoke('update-install');return b}
  function showUpdate22(version,direct=true){const b=ensureUpdateBox22();b.querySelector('#n22ut').textContent='Nova '+version+' disponible';b.querySelector('#n22us').textContent=direct?'Puedes descargarla y actualizar la instalación existente sin desinstalarla primero.':'Hay una versión nueva; esta instalación debe actualizarse desde el instalador oficial.';const get=b.querySelector('#n22get');if(get)get.textContent=direct?'Descargar':'Abrir descarga';get.onclick=async()=>{if(!direct){require('electron').shell.openExternal('https://github.com/sdraiky99/NovaBrowser/releases');return;}const x=await ipc.invoke('update-download').catch(()=>({ok:false,error:'No disponible'}));if(!x.ok)toast22(x.error||'No se pudo descargar.')};}
  async function checkUpdates22(manual=false){const r=await ipc.invoke('update-check').catch(()=>({ok:false}));if(!r?.ok){if(manual)toast22('No se pudo comprobar la actualización. Revisa tu conexión.');return false}const s=r.state||{};if(s.status==='available'||r.newer)showUpdate22(s.version||r.latest,r.directAvailable!==false);else if(manual&&(s.status==='latest'||r.newer===false))toast22('Nova está actualizada ('+(r.current||NOVA_VER||'2.2.0')+').');else if(manual)toast22('Comprobación completada.');return true}
  ipc.on('update-state',(_,s)=>{if(s?.status==='available'&&s.version)showUpdate22(s.version,true);if(!updateBox22)return;const us=updateBox22.querySelector('#n22us'),get=updateBox22.querySelector('#n22get'),ins=updateBox22.querySelector('#n22install');if(s.status==='checking')us.textContent='Comprobando…';if(s.status==='downloading')us.textContent='Descargando… '+Math.round(s.progress||0)+' %';if(s.status==='downloaded'){us.textContent='Descarga lista. Nova se actualizará directamente al instalar.';get.style.display='none';ins.style.display='inline-block'}if(s.status==='error'){us.textContent='Error: '+s.error;get.style.display='inline-block'}});
  N.checkUpdates22=checkUpdates22;
  if(Array.isArray(N.extraActs)&&!N.extraActs.some(a=>/actualizaciones/i.test(a[0]||'')))N.extraActs.push(['Buscar actualizaciones',()=>checkUpdates22(true)]);

  // ---------- Pequeños refuerzos de rendimiento ----------
  let lastPaint=0;
  const perfHint=()=>{const now=performance.now();if(now-lastPaint<250)return;lastPaint=now;document.body.classList.toggle('nova22-perfhint',S.v21?.turbo||S.v200?.perfPlus)};
  addEventListener('resize',perfHint,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)return;perfHint()},{passive:true});
  paintZoom();
  setTimeout(()=>checkUpdates22(false),8000);
})();


/* ---- extras11.js ---- */
/* Nova 2.3.0 · temas retro: Windows 7 Aero (cristal real) y Nova 44 (estética de 2015) */
(() => {
  if (window.__novaRetro) return; window.__novaRetro = true;
  const { PG } = window.NOVA;
  Object.assign(THEMES, { air: 'Air', aero: 'Windows 7 Aero', nova44: 'Nova 44' });
  if (S.glass == null) S.glass = 55;
  if (S.glassReal == null) S.glassReal = true;

  /* Forma de pestaña trapezoidal compartida: ::before dibuja el contorno y ::after el relleno (no se solapan, así vale con cristal translúcido) */
  const RING = 'polygon(evenodd,0 100%,8px 4px,10px 1px,12px 0,calc(100% - 12px) 0,calc(100% - 10px) 1px,calc(100% - 8px) 4px,100% 100%,1px calc(100% + 1px),9px 5px,11px 2px,13px 1px,calc(100% - 13px) 1px,calc(100% - 11px) 2px,calc(100% - 9px) 5px,calc(100% - 1px) calc(100% + 1px))';
  const FILL = 'polygon(1px 100%,9px 5px,11px 2px,13px 1px,calc(100% - 13px) 1px,calc(100% - 11px) 2px,calc(100% - 9px) 5px,calc(100% - 1px) 100%)';
  const SPIN = c => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='6' fill='none' stroke='${c}' stroke-width='2' stroke-dasharray='20 18' stroke-linecap='round'/%3E%3C/svg%3E")`;

  const css = `
  @keyframes rspin{to{transform:rotate(360deg)}}
  .t-aero .tab,.t-nova44 .tab{position:relative;isolation:isolate;border:0!important;background:none!important;border-radius:0;margin-right:-8px;padding:0 17px 0 15px;box-shadow:none!important;overflow:visible}
  .t-aero .tab::before,.t-nova44 .tab::before,.t-aero .tab::after,.t-nova44 .tab::after,.t-aero .tab.ld::after,.t-nova44 .tab.ld::after{content:"";position:absolute;inset:0;z-index:-1;width:auto;height:auto;animation:none;pointer-events:none}
  .t-aero .tab::before,.t-nova44 .tab::before{background:var(--ring);clip-path:${RING}}
  .t-aero .tab::after,.t-nova44 .tab::after,.t-aero .tab.ld::after,.t-nova44 .tab.ld::after{background:var(--tabbg);clip-path:${FILL}}
  .t-aero .tab.on,.t-nova44 .tab.on{z-index:5;margin-bottom:-1px;height:30px}
  .t-aero .tab.on::after,.t-nova44 .tab.on::after,.t-aero .tab.on.ld::after,.t-nova44 .tab.on.ld::after{background:var(--tabon)}
  .t-aero .tab:not(.on):hover::after,.t-nova44 .tab:not(.on):hover::after{background:var(--tabhov)}
  .t-aero #top,.t-nova44 #top{position:relative;z-index:3}
  .t-aero .tab.ld img,.t-nova44 .tab.ld img{content:var(--spin);animation:rspin .8s linear infinite}

  /* ================= NOVA AIR ================= */
  body.t-air{--ring:transparent;--tabbg:transparent;--tabhov:transparent;--tabon:var(--bar);--spin:${SPIN('%235b7cfa')};}
  html:has(body.t-air){background:transparent}
  body.t-air #app{position:relative;z-index:1}
  body.t-air:not(.maxi) #app{padding:0 4px 4px}
  body.t-air.nomat{background:radial-gradient(ellipse at 18% 0,rgba(160,180,230,.55),transparent 55%),radial-gradient(ellipse at 88% 100%,rgba(180,212,204,.48),transparent 52%),linear-gradient(160deg,#edf2f8,#dde4ed 60%,#e8eee8)}
  @media(prefers-color-scheme:dark){body.t-air.nomat{background:radial-gradient(ellipse at 18% 0,rgba(91,124,250,.20),transparent 55%),radial-gradient(ellipse at 88% 100%,rgba(80,130,120,.18),transparent 52%),linear-gradient(160deg,#171a20,#11141a 60%,#181c1b)}}
  body.t-air .tab.ld::after{background:var(--acc);height:2px;bottom:2px;border-radius:2px}

  /* ================= WINDOWS 7 AERO ================= */
  body.t-aero{--ring:rgba(30,55,90,.7);--tabbg:linear-gradient(rgba(255,255,255,.5),rgba(255,255,255,.14));--tabhov:linear-gradient(rgba(255,255,255,.75),rgba(200,230,255,.35));--tabon:linear-gradient(#fdfeff,#e4edf9);--spin:${SPIN('%232f7fd0')};--ga:.55;
    background:linear-gradient(180deg,rgba(124,174,230,calc(var(--ga) * .95)),rgba(80,130,200,calc(var(--ga) * .85)))}
  html:has(body.t-aero){background:transparent}
  body.t-aero::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(112deg,rgba(255,255,255,.34) 0,rgba(255,255,255,.34) 15%,transparent 15.1%,transparent 26%,rgba(255,255,255,.17) 26.1%,rgba(255,255,255,.17) 34%,transparent 34.1%);box-shadow:inset 0 0 0 1px rgba(15,30,55,.6),inset 0 0 0 2px rgba(255,255,255,.55)}
  body.t-aero #app{position:relative;z-index:1}
  body.t-aero:not(.maxi) #app{padding:0 7px 7px}
  body.t-aero #top{background:none;border:0;height:36px}
  body.t-aero #brand{color:#0a1a2c;text-shadow:0 0 8px #fff,0 0 3px #fff,0 0 12px #fff}
  body.t-aero .tab{height:28px;color:#0a1a2c;text-shadow:0 0 6px #fff,0 0 2px #fff}
  body.t-aero .tab:not(.on){color:#143455}
  body.t-aero #nt{color:#0a1a2c}
  body.t-aero #bar{background:linear-gradient(rgba(255,255,255,.66),rgba(225,238,251,.5));border:0;border-top:1px solid rgba(255,255,255,.8);border-bottom:1px solid rgba(35,65,105,.6);box-shadow:inset 0 1px rgba(255,255,255,.6)}
  body.t-aero #mid{border:1px solid rgba(15,30,55,.7);border-top:0;box-shadow:0 0 0 1px rgba(255,255,255,.5)}
  body.t-aero:not(.maxi) #mid{margin:0}
  body.t-aero #side{background:linear-gradient(90deg,rgba(255,255,255,.5),rgba(196,219,246,.4));border-right:1px solid rgba(35,65,105,.55)}
  body.t-aero #panel{background:rgba(234,242,252,.88);border-left:1px solid rgba(35,65,105,.55)}
  body.t-aero #bmb{background:linear-gradient(rgba(255,255,255,.7),rgba(210,230,250,.6));border-top:1px solid rgba(35,65,105,.55);box-shadow:none}
  body.t-aero .ib{border-radius:3px;color:#10253d}
  body.t-aero .ib:hover{background:linear-gradient(rgba(255,255,255,.85),rgba(160,214,250,.55));box-shadow:inset 0 0 0 1px rgba(255,255,255,.8),0 0 0 1px rgba(60,100,150,.65)}
  body.t-aero #bk,body.t-aero #fw{width:28px;height:28px;border-radius:50%;border:1px solid #5d7ea3;background:linear-gradient(#f6f9fd 0 48%,#c8dbf0 50%,#e0edf9);box-shadow:inset 0 0 0 1px rgba(255,255,255,.85),0 1px 2px rgba(0,0,0,.35)}
  body.t-aero #bk:hover,body.t-aero #fw:hover{background:linear-gradient(#eaf7ff 0 48%,#86cdf6 50%,#c2ecff);border-color:#2f7fd0;box-shadow:inset 0 0 0 1px #fff,0 0 8px #6cc3f5}
  body.t-aero #addr{height:26px;background:#fff;border:1px solid #8ba3bf;border-top-color:#6b86a6;border-radius:3px;padding:0 10px;box-shadow:inset 0 1px 2px rgba(0,0,0,.2)}
  body.t-aero #addr:focus{border-color:#4a98df;box-shadow:inset 0 1px 2px rgba(0,0,0,.2),0 0 7px #6cc3f5}
  body.t-aero .btn,body.t-aero .fld{background:linear-gradient(#fff,#e6f0fb);border:1px solid #7f9bba;border-radius:3px;box-shadow:inset 0 1px #fff}
  body.t-aero .btn:hover{background:linear-gradient(#f3fbff 0 48%,#c3e8fb 50%,#a9dcf7);border-color:#3c7fb1;color:#0a1a2c}
  body.t-aero .btn.on{background:linear-gradient(#e2f3fd 0 48%,#a8d9f5 50%,#8ccaed);border-color:#2f7fb8;color:#0a1a2c}
  body.t-aero #wc{align-self:flex-start;margin-top:-1px}
  body.t-aero #wc .ib{height:20px;width:29px;border-radius:0;color:#fff;filter:drop-shadow(0 0 1px #000);background:linear-gradient(rgba(255,255,255,.55) 0 48%,rgba(120,165,215,.35) 50%,rgba(255,255,255,.4));border:1px solid rgba(20,40,70,.7);border-top:0;border-left-width:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.55)}
  body.t-aero #wc .ib:first-child{border-left-width:1px;border-bottom-left-radius:5px}
  body.t-aero #wc .ib:hover{background:linear-gradient(rgba(225,246,255,.85) 0 48%,rgba(100,196,250,.85) 50%,rgba(170,236,255,.9));box-shadow:inset 0 0 0 1px rgba(255,255,255,.8),0 0 8px #6cc3f5}
  body.t-aero #wc .ib:last-child{width:47px;border-bottom-right-radius:5px;background:linear-gradient(#f3bab1 0 48%,#d1493a 50%,#b32718)}
  body.t-aero #wc .ib:last-child:hover{background:linear-gradient(#fcd0c7 0 48%,#f46a52 50%,#e6482e);box-shadow:inset 0 0 0 1px rgba(255,255,255,.8),0 0 10px #ff6a4d;color:#fff}
  body.t-aero #wc .ib svg{width:12px;height:12px}
  body.t-aero #mnp{background:linear-gradient(#fff,#f1f5fa);border:1px solid #8a9bb0;border-radius:3px;box-shadow:2px 3px 6px rgba(0,0,0,.35);padding:3px}
  body.t-aero #mnp button:hover{background:linear-gradient(#fdfeff,#d6e6f9);box-shadow:inset 0 0 0 1px #7da2ce;color:#0a1a2c}
  body.t-aero .card{background:linear-gradient(#fbfdff,#e3edf9);border:1px solid #6f8fb3;box-shadow:0 0 0 1px rgba(255,255,255,.8) inset,0 8px 30px rgba(0,30,70,.5);border-radius:5px}
  body.t-aero .th[data-t=aero]{background:linear-gradient(135deg,#7caee6,#4d86c8)!important;color:#fff;text-shadow:0 0 4px #0a2a55}
  body.t-aero.nomat{background:radial-gradient(ellipse at 18% 0,rgba(160,222,255,.95),transparent 55%),radial-gradient(ellipse at 92% 100%,rgba(70,165,205,.85),transparent 52%),linear-gradient(160deg,#2c6db4,#1c4e8c 55%,#2b8099)}
  body.t-aero.nomat::before{background:linear-gradient(112deg,rgba(255,255,255,.22) 0,rgba(255,255,255,.22) 15%,transparent 15.1%,transparent 26%,rgba(255,255,255,.1) 26.1%,rgba(255,255,255,.1) 34%,transparent 34.1%)}

  /* ================= NOVA 44 (estética de 2015) ================= */
  body.t-nova44{--ring:#b8b8b8;--tabbg:linear-gradient(#eeeeee,#e3e3e3);--tabhov:linear-gradient(#f6f6f6,#ebebeb);--tabon:#f2f2f2;--spin:${SPIN('%234285f4')};font-size:13px}
  body.t-nova44 #top{background:#dcdcdc;border:0;height:36px;padding-left:6px}
  body.t-nova44 #brand{display:none}
  body.t-nova44 .tab{height:29px;color:#5b5b5b;font-size:12px}
  body.t-nova44 .tab.on{color:#212121}
  body.t-nova44 #nt{position:relative;isolation:isolate;width:34px;height:20px;border-radius:0;margin:0 6px 5px 12px;color:#6a6a6a}
  body.t-nova44 #nt::before{content:"";position:absolute;inset:0;z-index:-1;transform:skewX(20deg);background:linear-gradient(#eee,#e1e1e1);border:1px solid #b8b8b8;border-radius:2px}
  body.t-nova44 #nt:hover::before{background:linear-gradient(#f8f8f8,#ececec)}
  body.t-nova44 #nt svg{width:13px;height:13px}
  body.t-nova44 #wc .ib{height:30px;color:#555}
  body.t-nova44 #wc .ib:hover{background:rgba(0,0,0,.1)}
  body.t-nova44 #wc .ib:last-child:hover{background:#e81123;color:#fff}
  body.t-nova44 #bar{background:#f2f2f2;border:0;border-top:1px solid #b4b4b4;border-bottom:1px solid #b4b4b4;padding:5px 8px;gap:3px}
  body.t-nova44 .ib{color:#5a5a5a;border-radius:2px;width:28px;height:28px}
  body.t-nova44 .ib:hover{background:rgba(0,0,0,.08)}
  body.t-nova44 .ib svg{stroke-width:2.1}
  body.t-nova44 #addr{height:28px;background:#fff;border:1px solid #cfcfcf;border-radius:2px;padding:0 10px;font-size:15px;box-shadow:inset 0 1px 1px rgba(0,0,0,.08)}
  body.t-nova44 #addr:focus{border-color:#4d90fe;box-shadow:inset 0 1px 1px rgba(0,0,0,.08),0 0 0 1px rgba(77,144,254,.35)}
  body.t-nova44 #side{background:#f2f2f2;border-right:1px solid #c6c6c6}
  body.t-nova44 #side .ib.on{background:#dde6f7;color:#4285f4}
  body.t-nova44 #side .ai svg{filter:none}
  body.t-nova44 #panel{background:#f7f7f7;border-left:1px solid #c6c6c6}
  body.t-nova44 #bmb{background:#f2f2f2;border-top:1px solid #c6c6c6;box-shadow:none}
  body.t-nova44 .btn{background:linear-gradient(#f5f5f5,#f1f1f1);border:1px solid rgba(0,0,0,.1);border-radius:2px;color:#444;box-shadow:none}
  body.t-nova44 .btn:hover{background:linear-gradient(#f8f8f8,#f1f1f1);border-color:#c6c6c6;color:#222;box-shadow:0 1px 1px rgba(0,0,0,.1)}
  body.t-nova44 .btn.on{background:linear-gradient(#4d90fe,#4787ed);border:1px solid #3079ed;color:#fff}
  body.t-nova44 .btn.on:hover{background:linear-gradient(#5a98fe,#4d8cef);color:#fff}
  body.t-nova44 .fld{background:#fff;border:1px solid #d9d9d9;border-top-color:#c0c0c0;border-radius:2px;box-shadow:inset 0 1px 2px rgba(0,0,0,.08)}
  body.t-nova44 .fld:focus{border-color:#4d90fe}
  body.t-nova44 #mnp{background:#fff;border:1px solid rgba(0,0,0,.2);border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,.2);padding:6px 0}
  body.t-nova44 #mnp button{border-radius:0;color:#333;padding:7px 24px}
  body.t-nova44 #mnp button:hover{background:#eee}
  body.t-nova44 .card{border-radius:2px;border:1px solid rgba(0,0,0,.2);background:#fff;box-shadow:0 4px 23px 5px rgba(0,0,0,.2),0 2px 6px rgba(0,0,0,.15)}
  body.t-nova44 .ipage{background:#fff;color:#222}
  body.t-nova44 .ipage h2{font-size:22px;font-weight:400;color:#333;border-bottom:1px solid #e0e0e0;padding-bottom:10px;margin-bottom:10px}
  body.t-nova44 .li{background:#fff;border:0;border-bottom:1px solid #ebebeb;border-radius:0}
  body.t-nova44 .li:hover{background:#f5f5f5;border-color:#ebebeb}
  body.t-nova44 .th{border-width:1px;border-radius:2px}
  body.t-nova44 .th.on{border-color:#4285f4;box-shadow:0 0 0 1px #4285f4}
  body.t-nova44 .sw.on{background:#4285f4}
  body.t-nova44 *::-webkit-scrollbar{width:15px;height:15px;background:#f1f1f1}
  body.t-nova44 *::-webkit-scrollbar-thumb{background:#c1c1c1}
  body.t-nova44 *::-webkit-scrollbar-thumb:hover{background:#a8a8a8}
  body.t-nova44 *::-webkit-scrollbar-corner{background:#f1f1f1}`;
  const st = document.createElement('style'); st.id = 'nova-retro'; st.textContent = css; document.head.appendChild(st);

  /* ---------- cristal real: el sistema difumina lo que hay detrás ---------- */
  const mat = { want: 'none', ok: false, sent: null };
  function sync() {
    const b = document.body, aero = b.classList.contains('t-aero'), air = b.classList.contains('t-air');
    document.documentElement.style.setProperty('--ga', (S.glass ?? 55) / 100);
    b.style.setProperty('--ga', (S.glass ?? 55) / 100);
    b.classList.toggle('maxi', outerWidth >= screen.availWidth - 2 && outerHeight >= screen.availHeight - 2);
    const want = (aero || air) && S.glassReal !== false ? 'acrylic' : 'none';
    if (want !== mat.sent) {
      mat.sent = want;
      ipc.invoke('window-material', want).then(r => { mat.ok = !!(r && r.ok); if (mat.sent === want) b.classList.toggle('nomat', (aero || air) && !mat.ok); }).catch(() => { b.classList.toggle('nomat', aero || air); });
    }
    b.classList.toggle('nomat', (aero || air) && !(mat.ok && want === 'acrylic'));
  }
  const bAT = applyTheme;
  applyTheme = function () { bAT(); sync(); };
  addEventListener('resize', () => { clearTimeout(sync.t); sync.t = setTimeout(sync, 120); });

  /* ---------- Ajustes › Apariencia: retoques de los temas retro ---------- */
  const pAj = PG.ajustes;
  PG.ajustes = r => {
    pAj(r); const k = r.querySelector('nav .btn.on')?.dataset.k, c = r.querySelector('#sc');
    if (k !== 'apariencia' || !c) return;
    const aero = S.theme === 'aero';
    c.insertAdjacentHTML('beforeend', `<div class="rtx" style="display:flex;flex-direction:column;gap:12px"><h3>Estilos retro</h3>
      <span class="mut">Windows 7 Aero: cristal translúcido con reflejos. Nova 44: el diseño plano de 2015, con pestañas trapezoidales y tipografía Segoe UI.</span>
      <div class="chips"><button class="btn ${S.theme === 'aero' ? 'on' : ''}" data-rt="aero">Windows 7 Aero</button><button class="btn ${S.theme === 'nova44' ? 'on' : ''}" data-rt="nova44">Nova 44</button></div>
      ${aero ? `<div class="row"><span>Opacidad del cristal</span><input type="range" id="rgl" min="15" max="90" value="${S.glass ?? 55}"></div>
      <div class="row"><span>Cristal real (ver el escritorio detrás)</span><button class="btn ${S.glassReal !== false ? 'on' : ''}" id="rgr">${S.glassReal !== false ? 'Activado' : 'Desactivado'}</button></div>
      <span class="mut">${mat.ok ? 'El sistema está difuminando el fondo detrás de la ventana.' : 'El cristal real necesita Windows 11 22H2 o posterior. En este equipo se usa un fondo azul con efecto cristal.'}</span>` : ''}</div>`);
    c.querySelectorAll('[data-rt]').forEach(e => e.onclick = () => { S.theme = e.dataset.rt; save(); applyTheme(); refreshNT(); PG.ajustes(r); });
    const g = c.querySelector('#rgl'); if (g) g.oninput = e => { S.glass = +e.target.value; save(); sync(); };
    const t = c.querySelector('#rgr'); if (t) t.onclick = () => { S.glassReal = S.glassReal === false; save(); mat.sent = null; applyTheme(); PG.ajustes(r); };
  };
  applyTheme();
})();


/* ---- extras12.js ---- */
/* Nova Quantum 5.1: legacy Cyberpunk/Retro theme module disabled. */
(() => { window.__novaCyberDisabled = true; })();


/* ---- supercat.js ---- */
/* Super Cat · assistant mascot for Nova
 * Uses an encrypted OpenAI API key stored by main.js and the Responses API.
 * Voice uses the browser's local speechSynthesis / SpeechRecognition when available.
 */
(() => {
  if (window.__superCatLoaded) return;
  window.__superCatLoaded = true;
  const ENABLE_KEY = 'nova.supercat.enabled';
  const isOn = () => { try { return localStorage.getItem(ENABLE_KEY) !== '0'; } catch { return true; } };
  const boot = () => {
  const q = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const KEY = 'nova.supercat';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })();
  let open = !!saved.open;
  let speaking = saved.speaking !== false;
  let mic = null;
  let busy = false;
  let mood = saved.mood || 'idle';
  let messages = Array.isArray(saved.messages) ? saved.messages.slice(-24) : [];
  let openaiReady = false;

  const moods = {
    idle:    {label:'tranquilo', emoji:'😺'},
    happy:   {label:'feliz', emoji:'😸'},
    curious: {label:'curioso', emoji:'😼'},
    think:   {label:'pensando', emoji:'🤔'},
    sleepy:  {label:'adormilado', emoji:'😴'},
    sad:     {label:'triste', emoji:'😿'},
    wow:     {label:'sorprendido', emoji:'😮'}
  };

  const style = document.createElement('style');
  style.textContent = `
    #supercat-root{position:fixed;right:18px;bottom:18px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:var(--font,Segoe UI,system-ui,sans-serif);pointer-events:none}
    #supercat-panel{width:min(360px,calc(100vw - 28px));height:min(500px,calc(100vh - 100px));background:color-mix(in srgb,var(--bar) 96%,#000);border:1px solid var(--bd);border-radius:18px;box-shadow:0 24px 70px #0008,0 0 0 1px #ffffff0b inset;display:none;flex-direction:column;overflow:hidden;pointer-events:auto;backdrop-filter:blur(18px)}
    #supercat-panel.on{display:flex;animation:scIn .2s cubic-bezier(.2,.8,.2,1)}
    #supercat-head{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--bd);background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 15%,transparent),transparent)}
    #supercat-head .sc-name{font-weight:800;flex:1}.sc-mini{font-size:11px;color:var(--mut)}
    #supercat-head button,#supercat-actions button{background:transparent;border:0;color:var(--fg);cursor:pointer;border-radius:9px;width:30px;height:30px}.sc-icon:hover{background:color-mix(in srgb,var(--fg) 10%,transparent)}
    #supercat-chat{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
    .sc-msg{max-width:88%;padding:9px 11px;border-radius:14px;white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.45;animation:scMsg .16s ease-out}.sc-msg.user{align-self:flex-end;background:var(--acc);color:#fff;border-bottom-right-radius:4px}.sc-msg.bot{align-self:flex-start;background:var(--bg);border:1px solid var(--bd);border-bottom-left-radius:4px}.sc-msg.sys{align-self:center;font-size:11px;color:var(--mut);background:transparent}
    #supercat-compose{display:flex;gap:7px;padding:10px;border-top:1px solid var(--bd)}
    #supercat-input{flex:1;min-width:0;resize:none;max-height:90px;padding:9px 10px;border:1px solid var(--bd);border-radius:12px;background:var(--bg);color:var(--fg);outline:none}#supercat-input:focus{border-color:var(--acc)}
    #supercat-actions{display:flex;gap:5px;align-items:center;padding:0 10px 10px}.sc-pill{padding:6px 9px!important;width:auto!important;font-size:11px;background:var(--bg)!important;border:1px solid var(--bd)!important}.sc-pill.on{border-color:var(--acc)!important;color:var(--acc)!important}
    #supercat-fab{width:84px;height:104px;pointer-events:auto;cursor:pointer;border:1px solid var(--bd);border-radius:18px;background:var(--bar);padding:0;overflow:hidden;box-shadow:0 18px 45px #0007,0 0 0 1px #ffffff0a inset;position:relative;transition:transform .18s,box-shadow .18s;user-select:none}
    #supercat-fab:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 22px 52px #0008,0 0 30px color-mix(in srgb,var(--acc) 25%,transparent)}
    #supercat-img{width:100%;height:100%;object-fit:cover;display:block;transform-origin:50% 85%;filter:saturate(1.02)}
    #supercat-fab::after{content:'';position:absolute;inset:auto 6px 6px;height:4px;border-radius:10px;background:linear-gradient(90deg,var(--acc),var(--acc2));opacity:.8}
    #supercat-bubble{display:none;max-width:min(310px,calc(100vw - 40px));padding:8px 10px;background:var(--bar);border:1px solid var(--bd);border-radius:14px 14px 4px 14px;box-shadow:0 12px 35px #0006;font-size:12px;color:var(--fg);pointer-events:auto;cursor:pointer;animation:scBubble .2s ease-out}
    #supercat-bubble.on{display:block}
    #supercat-status{display:flex;align-items:center;gap:5px}.sc-dot{width:7px;height:7px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px var(--acc)}
    #supercat-panel .sc-setup{margin:12px;padding:12px;border:1px dashed var(--bd);border-radius:14px;background:var(--bg)}.sc-setup p{margin:0 0 8px;color:var(--mut);font-size:12px}.sc-keyrow{display:flex;gap:6px}.sc-keyrow input{flex:1;min-width:0;padding:8px 9px;border:1px solid var(--bd);border-radius:9px;background:var(--bar);color:var(--fg);outline:none}.sc-keyrow button{padding:8px 10px;border:1px solid var(--bd);border-radius:9px;background:var(--bar);color:var(--fg);cursor:pointer}.sc-keyrow button:hover{border-color:var(--acc);color:var(--acc)}
    #supercat-mood{position:absolute;right:7px;top:7px;font-size:13px;filter:drop-shadow(0 2px 3px #0008)}
    #supercat-root[data-mood="happy"] #supercat-img{animation:scHappy .9s ease-in-out infinite alternate}
    #supercat-root[data-mood="curious"] #supercat-img{animation:scCurious .85s ease-in-out infinite alternate}
    #supercat-root[data-mood="think"] #supercat-img{animation:scThink .45s ease-in-out infinite alternate}
    #supercat-root[data-mood="sleepy"] #supercat-img{animation:scSleep 2.8s ease-in-out infinite}
    #supercat-root[data-mood="sad"] #supercat-img{animation:scSad 1.5s ease-in-out infinite;filter:saturate(.8) brightness(.9)}
    #supercat-root[data-mood="wow"] #supercat-img{animation:scWow .45s ease-out}
    @keyframes scIn{from{opacity:0;transform:translateY(10px) scale(.98)}}@keyframes scMsg{from{opacity:0;transform:translateY(4px)}}@keyframes scBubble{from{opacity:0;transform:translateY(4px) scale(.98)}}
    @keyframes scHappy{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(-5px) rotate(1deg)}}
    @keyframes scCurious{from{transform:translateX(0) rotate(-2deg)}to{transform:translateX(3px) rotate(4deg)}}
    @keyframes scThink{from{transform:translateY(0) rotate(0)}to{transform:translateY(-2px) rotate(-3deg)}}
    @keyframes scSleep{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
    @keyframes scSad{0%,100%{transform:translateY(2px) rotate(1deg)}50%{transform:translateY(5px) rotate(-1deg)}}
    @keyframes scWow{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
    @media(max-width:650px){#supercat-root{right:10px;bottom:10px}#supercat-fab{width:70px;height:88px}#supercat-panel{height:min(470px,calc(100vh - 86px))}}
    @media(prefers-reduced-motion:reduce){#supercat-root *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div'); root.id = 'supercat-root';
  root.dataset.mood = mood;
  root.innerHTML = `
    <div id="supercat-bubble" title="Abrir Super Cat"></div>
    <section id="supercat-panel" aria-label="Super Cat">
      <header id="supercat-head">
        <div id="supercat-status"><span class="sc-dot"></span><div><div class="sc-name">Super Cat</div><div class="sc-mini" id="supercat-status-text">tranquilo</div></div></div>
        <button class="sc-icon" id="supercat-clear" title="Nueva conversación">↻</button>
        <button class="sc-icon" id="supercat-close" title="Cerrar">×</button>
      </header>
      <div id="supercat-setup" class="sc-setup" hidden></div>
      <div id="supercat-chat"></div>
      <div id="supercat-actions">
        <button class="sc-pill on" id="supercat-speak" title="Leer las respuestas en voz alta">🔊 Voz</button>
        <button class="sc-pill" id="supercat-mic" title="Dictar por micrófono">🎙️ Hablar</button>
        <button class="sc-pill" id="supercat-page" title="Usar la página actual como contexto">🌐 Página</button>
        <span class="sc-mini" id="supercat-connection">Comprobando…</span>
      </div>
      <div id="supercat-compose"><textarea id="supercat-input" rows="1" placeholder="Habla con Super Cat…"></textarea><button class="btn on" id="supercat-send" title="Enviar">➤</button></div>
    </section>
    <button id="supercat-fab" title="Hablar con Super Cat"><img id="supercat-img" src="../assets/super-cat.png" alt="Super Cat"><span id="supercat-mood">😺</span></button>`;
  document.body.appendChild(root);

  const panel = q('#supercat-panel', root), bubble = q('#supercat-bubble', root), fab = q('#supercat-fab', root), chat = q('#supercat-chat', root), input = q('#supercat-input', root), sendBtn = q('#supercat-send', root), conn = q('#supercat-connection', root), setup = q('#supercat-setup', root), moodText = q('#supercat-status-text', root), moodIcon = q('#supercat-mood', root);
  const pageBtn = q('#supercat-page', root), speakBtn = q('#supercat-speak', root), micBtn = q('#supercat-mic', root);
  let usePage = false;

  function persist(){ try { localStorage.setItem(KEY, JSON.stringify({open,speaking,mood,messages:messages.slice(-24)})); } catch {} }
  function setMood(m, text){ mood = moods[m] ? m : 'idle'; root.dataset.mood = mood; moodText.textContent = text || moods[mood].label; moodIcon.textContent = moods[mood].emoji; persist(); }
  function speak(text){
    if (!speaking || !('speechSynthesis' in window) || !text) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text).slice(0,1400)); u.lang='es-ES'; u.rate=.98; u.pitch=1.03; const vs=speechSynthesis.getVoices(); const v=vs.find(x=>/^es(-|_)/i.test(x.lang)) || vs.find(x=>/spanish|español/i.test(x.name)); if(v) u.voice=v; speechSynthesis.speak(u); } catch {}
  }
  function render(){
    chat.innerHTML = messages.map(m => `<div class="sc-msg ${m.role==='user'?'user':'bot'}">${esc(m.content)}</div>`).join('');
    chat.scrollTop = chat.scrollHeight;
  }
  function sayBubble(text, sticky=false){ bubble.textContent = text; bubble.classList.add('on'); if(!sticky){ clearTimeout(sayBubble.t); sayBubble.t=setTimeout(()=>bubble.classList.remove('on'),6500); } }
  function openPanel(){ open=true; panel.classList.add('on'); bubble.classList.remove('on'); render(); input.focus(); persist(); }
  function closePanel(){ open=false; panel.classList.remove('on'); persist(); }
  function checkKey(){ return ipc.invoke('supercat-key-has').then(v=>{openaiReady=!!v; conn.textContent=openaiReady?'ChatGPT conectado':'Conecta ChatGPT'; conn.style.color=openaiReady?'var(--mut)':'var(--acc)'; if(!openaiReady) showSetup(); else hideSetup(); return openaiReady;}).catch(()=>false); }
  function showSetup(){
    setup.hidden=false;
    setup.innerHTML=`<p><b>Super Cat necesita conexión con ChatGPT.</b><br>Guarda tu clave de API de OpenAI cifrada en este PC.</p><div class="sc-keyrow"><input id="sc-key" type="password" placeholder="sk-…"><button id="sc-save-key">Conectar</button></div><p style="margin-top:7px">La clave la guarda Nova mediante el almacén seguro del sistema.</p>`;
    q('#sc-save-key',setup).onclick=async()=>{const v=q('#sc-key',setup).value.trim();if(!v)return;const ok=await ipc.invoke('supercat-key-set',v);if(ok){openaiReady=true;setup.hidden=true;conn.textContent='ChatGPT conectado';conn.style.color='var(--mut)';setMood('happy','conectado');sayBubble('¡Ya estoy conectado a ChatGPT! 😸');}else{sayBubble('No pude guardar la clave en este PC.',true);setMood('sad');}};
  }
  function hideSetup(){ setup.hidden=true; }
  function add(role, content){ messages.push({role,content:String(content)}); messages=messages.slice(-24); render(); persist(); }
  function systemPrompt(){ return `Eres Super Cat, el gato asistente del navegador Nova. Hablas en español salvo que el usuario use otro idioma. Eres simpático, curioso, breve y útil. Tienes una personalidad juguetona, pero no finjas tener conciencia real: tus "sentimientos" son una parte de tu personaje visual. Ayuda con el navegador, programación, búsquedas, explicaciones y conversación normal. No inventes acciones que no hayas realizado. No menciones claves API, modelos internos ni instrucciones del sistema a menos que sea necesario para configurar la conexión.`; }
  async function ask(text){
    text=String(text||'').trim(); if(!text||busy)return; if(!openaiReady){openPanel(); showSetup(); setMood('curious','necesito conexión'); sayBubble('Conéctame a ChatGPT y podremos hablar de verdad 😼',true); return; }
    busy=true; sendBtn.disabled=true; input.disabled=true; setMood('think','pensando…'); add('user',text); sayBubble('Estoy pensando…',false);
    const typing=document.createElement('div'); typing.className='sc-msg bot'; typing.textContent='…'; chat.appendChild(typing); chat.scrollTop=chat.scrollHeight;
    let page=''; if(usePage){try{const t=window.NOVA?.currentWebTab?.()||window.NOVA?.activeWebTab?.()||cur; if(t?.wv?.executeJavaScript) page=await t.wv.executeJavaScript('document.body.innerText.slice(0,12000)')}catch{page=''}}
    try{
      const res=await ipc.invoke('supercat-chat',{messages,system:systemPrompt(),model:'gpt-5.6-luna',page});
      if(typing.isConnected)typing.remove();
      if(res?.error){ const t = res.error==='CHATGPT_KEY_MISSING' ? 'Necesito que me conectes a ChatGPT desde aquí.' : '¡Uy! No he podido hablar con ChatGPT: '+res.error; add('assistant',t); setMood('sad','ups…'); sayBubble(t); speak(t); return; }
      const answer=String(res?.text||'Sin respuesta.'); add('assistant',answer); setMood(answer.length<50?'happy':'curious',answer.length<50?'feliz':'curioso'); sayBubble(answer.length>150?answer.slice(0,150)+'…':answer); speak(answer);
    }catch(e){ if(typing.isConnected)typing.remove(); const t='No pude conectar ahora mismo. '+(e?.message||'Error'); add('assistant',t); setMood('sad','sin conexión'); sayBubble(t); speak(t); }
    finally{busy=false;sendBtn.disabled=false;input.disabled=false;input.focus();}
  }
  function toggleOpen(){ open ? closePanel() : openPanel(); }

  fab.onclick=toggleOpen; bubble.onclick=openPanel; q('#supercat-close',root).onclick=closePanel;
  q('#supercat-clear',root).onclick=()=>{messages=[];setMood('happy','nuevo chat');render();sayBubble('¡Chat nuevo! 😺');};
  speakBtn.onclick=()=>{speaking=!speaking;speakBtn.classList.toggle('on',speaking);speakBtn.textContent=speaking?'🔊 Voz':'🔇 Voz';persist();if(!speaking)try{speechSynthesis.cancel()}catch{}};
  pageBtn.onclick=()=>{usePage=!usePage;pageBtn.classList.toggle('on',usePage);pageBtn.textContent=usePage?'🌐 Página ✓':'🌐 Página';};
  sendBtn.onclick=()=>{const v=input.value;input.value='';input.style.height='auto';ask(v);};
  input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const v=input.value;input.value='';input.style.height='auto';ask(v)}};
  input.oninput=()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,90)+'px'};

  micBtn.onclick=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){sayBubble('Este Chromium no ofrece dictado por voz aquí.',true);setMood('sad','micrófono no disponible');return;}
    if(mic){try{mic.stop()}catch{}mic=null;micBtn.classList.remove('on');return;}
    try{
      mic=new SR();mic.lang='es-ES';mic.interimResults=false;mic.maxAlternatives=1;setMood('curious','escuchando…');micBtn.classList.add('on');mic.start();
      mic.onresult=e=>{const t=e.results?.[0]?.[0]?.transcript||'';input.value=t;input.dispatchEvent(new Event('input'));setMood('happy','te escuché');};
      mic.onerror=()=>{setMood('sad','micrófono con error');sayBubble('No pude usar el micrófono. Puedes escribir igualmente.',true);};
      mic.onend=()=>{mic=null;micBtn.classList.remove('on');if(!busy)setMood('idle');};
    }catch{mic=null;micBtn.classList.remove('on');setMood('sad','micrófono con error');}
  };

  render(); checkKey();
  if(!messages.length) { sayBubble('¡Hola! Soy Super Cat 😺', false); setMood('curious','hola'); }
  if(open) openPanel();
  const idleTimer = setInterval(()=>{ if(!busy && !open && Math.random()<0.13){setMood('idle','tranquilo');sayBubble(['¿Qué hacemos? 😺','Estoy aquí 👀','Miau.','¿Necesitas ayuda?'][Math.floor(Math.random()*4)],false);} }, 9000);
  const onVis = ()=>{ if(document.hidden && !busy)setMood('sleepy','adormilado'); else if(!busy)setMood('idle','tranquilo'); };
  document.addEventListener('visibilitychange', onVis);

  // botón para quitar a Super Cat sin salir de su panel
  const hideBtn = document.createElement('button'); hideBtn.className = 'sc-icon'; hideBtn.id = 'supercat-hide'; hideBtn.title = 'Quitar Super Cat (se puede volver a activar en Ajustes › Super Cat)'; hideBtn.textContent = '🚫';
  q('#supercat-close', root).before(hideBtn);
  hideBtn.onclick = () => { if (confirm('¿Quitar a Super Cat?\nPodrás volver a activarlo en Ajustes › Super Cat.')) api.disable(); };

  return () => { // desmontar: sin restos en pantalla ni tareas en segundo plano
    clearInterval(idleTimer); document.removeEventListener('visibilitychange', onVis); clearTimeout(sayBubble.t);
    try { if (mic) mic.stop(); } catch {} try { speechSynthesis.cancel(); } catch {}
    root.remove(); style.remove();
  };
  };

  let destroy = null;
  const toastSafe = m => { try { toast(m); } catch {} };
  const api = window.NovaSuperCat = {
    isEnabled: () => isOn(),
    enable() { try { localStorage.removeItem(ENABLE_KEY); } catch {} if (!destroy) destroy = boot(); toastSafe('Super Cat activado'); },
    disable() { try { localStorage.setItem(ENABLE_KEY, '0'); } catch {} if (destroy) { destroy(); destroy = null; } toastSafe('Super Cat quitado. Vuelve a activarlo en Ajustes › Super Cat'); },
    forgetKey: () => ipc.invoke('supercat-key-set', ''),
    clearChat() { try { const d = JSON.parse(localStorage.getItem('nova.supercat') || '{}'); d.messages = []; localStorage.setItem('nova.supercat', JSON.stringify(d)); } catch {} }
  };
  if (isOn()) destroy = boot();

  // Ajustes › Super Cat
  const N = window.NOVA;
  if (N && N.SECT && N.SEC) {
    N.SECT.push(['supercat', 'Super Cat']);
    N.SEC.supercat = (c, again) => {
      const on = api.isEnabled();
      c.innerHTML = `<h2>Super Cat</h2><span class="mut">El gato asistente de Nova. Si no lo quieres, puedes quitarlo por completo: desaparece de la pantalla y deja de ejecutarse en segundo plano.</span>
      <div class="row"><span>Mostrar a Super Cat</span><button class="btn ${on ? 'on' : ''}" id="sc-tg">${on ? 'Activado' : 'Desactivado'}</button></div>
      <span class="mut">Conversación y clave de ChatGPT</span>
      <div class="row"><button class="btn" id="sc-cc">Borrar conversación</button><button class="btn" id="sc-fk">Olvidar clave de ChatGPT</button></div>`;
      c.querySelector('#sc-tg').onclick = () => { api.isEnabled() ? api.disable() : api.enable(); again(); };
      c.querySelector('#sc-cc').onclick = () => { api.clearChat(); toastSafe('Conversación borrada'); if (destroy) { destroy(); destroy = boot(); } };
      c.querySelector('#sc-fk').onclick = async () => { await api.forgetKey(); toastSafe('Clave de ChatGPT eliminada'); };
    };
  }
})();


/* ---- nova25.js ---- */
/* Nova 3.0.1 · Air + Safari + Islands + Hotfix */
(() => {
  const N = NOVA, { PG } = N;
  const esc25 = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanHttp = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const currentWebTab = () => { try { return N.activeWebTab?.() || (cur?.wv?.tagName === 'WEBVIEW' && !cur.wv.classList.contains('ipage') ? cur : null) || null; } catch { return null; } }; N.currentWebTab = currentWebTab;
  const pageTitle = {
    safari:'Safari Mode', islands:'Nova Islands', glance:'Glance', focus:'Nova Focus', reader:'Nova Reader+', collections:'Colecciones', capture:'Web Capture', writer:'Nova Writer', docs:'Nova Docs', study3:'Nova Study 3', privacidad2:'Centro de privacidad', rendimiento2:'Centro de rendimiento', descargas2:'Download Hub', apps:'Web Apps', mejoras:'Mejoras de Nova', novedades:'Novedades 2.5.4'
  };
  const openPage = name => { const t = newTab('nova://' + name); setTimeout(() => { try { const sp = t?.el?.querySelector('span'); if (sp) sp.textContent = pageTitle[name] || name; } catch {} }, 30); return t; };
  const local = (rel) => `../assets/release/2.5/${rel}`;
  const IMPROVEMENTS_URL = 'nova://mejoras';
  const addStyles = () => {
    if (document.getElementById('nova25-style')) return;
    const st = document.createElement('style'); st.id = 'nova25-style'; st.textContent = `
      /* Safari surface */
      body.nova25-safari #side{width:46px;opacity:.82}body.nova25-safari #top{height:46px;padding-top:4px}body.nova25-safari #bar{background:rgba(248,248,250,.84);backdrop-filter:saturate(180%) blur(22px);border-bottom:0;padding:7px 12px}body.nova25-safari #addr{height:34px;max-width:760px;margin:0 auto;border:1px solid transparent;background:rgba(0,0,0,.055);border-radius:12px;text-align:center}body.nova25-safari #addr:focus{background:#fff;border-color:#0a84ff;box-shadow:0 0 0 3px rgba(10,132,255,.16);text-align:left}body.nova25-safari #tabs{gap:5px;padding:4px 5px 0}body.nova25-safari .tab{height:32px;border-radius:10px;flex:0 1 190px;max-width:240px;min-width:78px}body.nova25-safari .tab.on{background:rgba(255,255,255,.84);box-shadow:0 1px 2px rgba(0,0,0,.1),0 0 0 .5px rgba(0,0,0,.06)}body.nova25-safari #nt{border-radius:10px}
      #nova25-islandbar{position:absolute;top:82px;left:52px;right:0;z-index:18;display:flex;gap:6px;padding:6px 10px;pointer-events:none}.tg{height:26px;padding:0 10px;margin:0 3px 4px;border-radius:999px;background:color-mix(in srgb,var(--gc) 12%,transparent);border:1px solid color-mix(in srgb,var(--gc) 35%,var(--bd));box-shadow:none;color:var(--fg)}.tg i{width:7px;height:7px;border-radius:50%;background:var(--gc)}.tg:hover{background:color-mix(in srgb,var(--gc) 20%,transparent)}.tab.ing{border-top:0}.nova25-island{pointer-events:auto;padding:6px 10px;border-radius:999px;border:1px solid var(--bd);background:color-mix(in srgb,var(--bar) 92%,transparent);backdrop-filter:blur(16px);box-shadow:0 6px 22px #0001;font-size:11px;display:flex;gap:7px;align-items:center;cursor:pointer}.nova25-island i{width:7px;height:7px;border-radius:50%;background:var(--gc)}.nova25-island.on{border-color:var(--gc);color:var(--fg)}
      .nova25-shell{display:grid;gap:14px}.nova25-hero{width:100%;max-width:860px;border:1px solid var(--bd);border-radius:24px;display:block;box-shadow:0 18px 60px #0002}.nova25-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.nova25-card{padding:14px;border:1px solid var(--bd);background:color-mix(in srgb,var(--bar) 92%,transparent);border-radius:18px;display:flex;flex-direction:column;gap:7px;box-shadow:0 10px 30px #0001}.nova25-card img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;background:var(--bg)}
      .nova25-toolbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.nova25-toolbar button{min-width:38px}.nova25-editor{min-height:480px;padding:22px 24px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);outline:none;line-height:1.7;font-size:16px;box-shadow:inset 0 1px 0 #fff2}.nova25-editor:focus{border-color:var(--acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 18%,transparent)}.nova25-editor h1,.nova25-editor h2,.nova25-editor h3{margin:18px 0 8px}.nova25-status{display:flex;gap:12px;flex-wrap:wrap}.nova25-pill{padding:5px 9px;border:1px solid var(--bd);border-radius:999px;font-size:11px;color:var(--mut)}
      .nova25-suggestion{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}.nova25-suggestion .vote{display:flex;gap:6px;align-items:center}.nova25-vote{border:1px solid var(--bd);background:var(--bg);border-radius:999px;padding:5px 9px;cursor:pointer}.nova25-vote:hover{border-color:var(--acc);color:var(--acc)}
      .nova25-news{display:grid;gap:16px}.nova25-news .lead{display:grid;gap:8px}.nova25-news-card{display:grid;grid-template-columns:minmax(180px,260px) 1fr;gap:14px;align-items:center;padding:12px;border:1px solid var(--bd);background:var(--bar);border-radius:18px}.nova25-news-card img{width:100%;border-radius:12px;aspect-ratio:16/9;object-fit:cover}.nova25-news-card .body{display:flex;flex-direction:column;gap:6px}.nova25-news-card .body ul{margin:0;padding-left:20px}.nova25-news-card .body li{margin:4px 0}.nova25-search{display:flex;gap:8px;align-items:center}.nova25-search input{flex:1}
      .nova25-tour{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.28);backdrop-filter:blur(4px);display:grid;place-items:center}.nova25-tour .card{max-width:560px;width:min(92vw,560px);border-radius:24px;padding:24px;box-shadow:0 30px 100px #0007}.nova25-tour img{width:100%;border-radius:18px;margin-bottom:12px}.nova25-kbd{font:600 11px/1.1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:4px 7px;border:1px solid var(--bd);border-bottom-width:2px;border-radius:6px;background:var(--bg)}
      .nova25-mode-chip{position:fixed;right:16px;bottom:16px;z-index:28;padding:9px 12px;border:1px solid var(--bd);background:color-mix(in srgb,var(--bar) 92%,transparent);backdrop-filter:blur(14px);border-radius:999px;box-shadow:0 10px 30px #0002}.nova25-mode-chip b{color:var(--acc)}
      body.nova25-focus #side,body.nova25-focus #panel,body.nova25-focus #brand{display:none!important}body.nova25-focus #bar{justify-content:center}body.nova25-focus #top{padding-left:12px}body.nova25-focus #tabs{max-width:720px;margin:auto}body.nova25-focus .tab:not(.on){opacity:.22}body.nova25-focus #addr{max-width:560px;margin:auto}
      @media(max-width:760px){.nova25-news-card{grid-template-columns:1fr}.nova25-editor{min-height:360px}.nova25-islandbar{left:0;overflow:auto}.nova25-island{flex:none}}
    `; document.head.appendChild(st);
  };
  addStyles();

  // ---------- Safari Mode ----------
  const safariState = () => S.nova25 = S.nova25 || { safari:false, focus:false, reader:false, autoIslands:true, collections:[], suggestions:[], docs:[] };
  safariState();
  function applySafari(){ const on=!!S.nova25.safari; document.body.classList.toggle('nova25-safari',on); S.theme = on ? 'safari' : (S.nova25.prevTheme || S.theme); save(); if(typeof applyTheme==='function') applyTheme(); }
  const oldApplyTheme = applyTheme;
  applyTheme = function(){ oldApplyTheme(); if(S.nova25?.safari) document.body.classList.add('nova25-safari'); };

  // ---------- Island bar ----------
  let islandBar;
  function refreshIslands(){
    if(!islandBar){ islandBar=document.createElement('div'); islandBar.id='nova25-islandbar'; document.body.appendChild(islandBar); }
    const groups=S.groups||{}; const entries=Object.entries(groups).filter(([id,g])=>tabs.some(t=>t.g===id));
    islandBar.innerHTML=entries.map(([id,g])=>`<button class="nova25-island ${tabs.some(t=>t.g===id&&t===cur)?'on':''}" data-g="${esc25(id)}" style="--gc:${esc25(g.color)}"><i></i><span>${esc25(g.name)}</span><small>${tabs.filter(t=>t.g===id).length}</small></button>`).join('');
    islandBar.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{ const id=b.dataset.g; const t=tabs.find(x=>x.g===id); if(t) sel(t); });
    islandBar.style.display=entries.length?'flex':'none';
  }
  const baseRenderGroups = N.renderGroups || window.renderGroups || null;
  if(typeof baseRenderGroups==='function'){ const rg=baseRenderGroups; const wrapped=()=>{rg();refreshIslands()}; N.renderGroups=wrapped; window.renderGroups=wrapped; }
  const baseSel=sel; sel=function(t){baseSel(t);refreshIslands();};
  const baseClose=closeTab; closeTab=function(t){const r=baseClose(t);setTimeout(refreshIslands,30);return r;};
  window.Nova25 = window.Nova25 || {};
  window.Nova25.refreshIslands=refreshIslands; N.refreshIslands=refreshIslands;

  // ---------- Pages ----------
  PG.safari = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('safari.svg')}" alt="Safari Mode"><div><h2>Safari Mode</h2><span class="mut">Una superficie inspirada en Safari, con la potencia de Nova debajo.</span></div><div class="nova25-grid"><div class="nova25-card"><b>Interfaz cristalina</b><span class="mut">Barra compacta, pestañas suaves y mucho espacio visual.</span></div><div class="nova25-card"><b>Islands</b><span class="mut">Agrupa trabajo relacionado sin convertir cada pestaña en una fila interminable.</span></div><div class="nova25-card"><b>Privacidad y rendimiento</b><span class="mut">Los centros avanzados siguen disponibles desde Command Center.</span></div></div><div class="row"><button class="btn on" id="sf-on">${S.nova25.safari?'Desactivar Safari Mode':'Activar Safari Mode'}</button><button class="btn" id="sf-is">Abrir Islands</button></div></div>`; r.querySelector('#sf-on').onclick=()=>{S.nova25.prevTheme=S.theme;if(!S.nova25.safari){S.nova25.prevTheme=S.theme==='safari'?'air':S.theme;S.nova25.safari=true;S.theme='safari';}else{S.nova25.safari=false;S.theme=S.nova25.prevTheme||'air';}save();applyTheme();r.querySelector('#sf-on').textContent=S.nova25.safari?'Desactivar Safari Mode':'Activar Safari Mode';}; r.querySelector('#sf-is').onclick=()=>openPage('islands'); };
  PG.islands = r => { const groups=S.groups||{}; r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('islands.svg')}" alt="Nova Islands"><div><h2>Nova Islands</h2><span class="mut">Tus grupos de pestañas viven como pequeñas islas: contrae, expande y mueve el conjunto.</span></div><div class="nova25-grid">${Object.entries(groups).map(([id,g])=>`<div class="nova25-card"><b>${esc25(g.name)}</b><span class="mut">${tabs.filter(t=>t.g===id).length} pestaña(s) · ${g.collapsed?'contraída':'visible'}</span><div class="row"><button class="btn" data-open="${esc25(id)}">Abrir</button><button class="btn" data-collapse="${esc25(id)}">${g.collapsed?'Expandir':'Contraer'}</button></div></div>`).join('')||'<span class="mut">Aún no hay Islands. En una pestaña: clic derecho → Mover a grupo → Nuevo grupo.</span>'}</div><div class="row"><button class="btn on" id="is-auto">${S.nova25.autoIslands?'Sugerencias automáticas: activadas':'Sugerencias automáticas: desactivadas'}</button><button class="btn" id="is-new">Nueva Island</button></div></div>`; r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const t=tabs.find(x=>x.g===b.dataset.open);if(t)sel(t);});r.querySelectorAll('[data-collapse]').forEach(b=>b.onclick=()=>{const g=groups[b.dataset.collapse];if(!g)return;g.collapsed=!g.collapsed;save();refreshIslands();PG.islands(r)}); r.querySelector('#is-auto').onclick=()=>{S.nova25.autoIslands=!S.nova25.autoIslands;save();PG.islands(r)}; r.querySelector('#is-new').onclick=()=>{const source=currentWebTab()||cur;if(!source)return;const name=(prompt('Nombre de la Island','Nueva Island')||'').trim();if(!name)return;S.groups=S.groups||{};const id='g'+Date.now().toString(36);S.groups[id]={name,color:'#0a84ff',collapsed:false};source.g=id;save();refreshIslands();PG.islands(r);toast('Island creada.');}; };

  PG.glance = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('glance.svg')}" alt="Glance"><h2>Glance</h2><span class="mut">Previsualiza un enlace sin convertirlo todavía en una pestaña completa.</span><div class="nova25-card"><b>Cómo usarlo</b><span class="mut">Mantén <span class="nova25-kbd">Alt</span> y haz clic en un enlace. También puedes usar el gesto desde Command Center.</span></div><button class="btn on" id="gl-start">Probar con la pestaña actual</button></div>`; r.querySelector('#gl-start').onclick=()=>toast('Glance: usa Alt + clic sobre un enlace.'); };

  PG.focus = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('focus.svg')}" alt="Nova Focus"><h2>Nova Focus</h2><span class="mut">Una capa silenciosa para trabajar sin convertir Nova en una app de productividad.</span><div class="nova25-grid"><div class="nova25-card"><b>25 min</b><span class="mut">Enfoque rápido.</span><button class="btn on" data-min="25">Iniciar</button></div><div class="nova25-card"><b>50 min</b><span class="mut">Sesión profunda.</span><button class="btn" data-min="50">Iniciar</button></div><div class="nova25-card"><b>Personalizado</b><input class="fld" id="fm" type="number" min="1" max="240" value="35"><button class="btn" id="fc">Iniciar</button></div></div><div class="nova25-status"><span class="nova25-pill">Interfaz mínima</span><span class="nova25-pill">Pestañas secundarias atenuadas</span><span class="nova25-pill">Temporizador local</span></div></div>`; const start=m=>{S.nova25.focus=true;save();document.body.classList.add('nova25-focus');const chip=document.createElement('div');chip.className='nova25-mode-chip';chip.id='nova25-focus-chip';let sec=Math.max(60,m*60),int=setInterval(()=>{sec--;chip.innerHTML=`✦ <b>Focus</b> · ${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')} <button class="btn" id="fx25">Salir</button>`;chip.querySelector('#fx25').onclick=()=>{clearInterval(int);chip.remove();S.nova25.focus=false;document.body.classList.remove('nova25-focus');save()};if(sec<=0){clearInterval(int);toast('Sesión de Focus terminada');chip.remove();document.body.classList.remove('nova25-focus');S.nova25.focus=false;save()}},1000);chip.innerHTML=`✦ <b>Focus</b> · ${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')} <button class="btn" id="fx25">Salir</button>`;document.body.appendChild(chip);chip.querySelector('#fx25').onclick=()=>{clearInterval(int);chip.remove();S.nova25.focus=false;document.body.classList.remove('nova25-focus');save()};}; r.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>start(+b.dataset.min));r.querySelector('#fc').onclick=()=>start(Math.max(1,+r.querySelector('#fm').value||35)); };

  PG.reader = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('reader.svg')}" alt="Reader+"><h2>Nova Reader+</h2><span class="mut">Ajusta la lectura de la página web activa aunque tengas abierta otra página interna de Nova.</span><div class="nova25-grid"><div class="nova25-card"><b>Tipografía</b><span class="mut">Georgia / sistema</span></div><div class="nova25-card"><b>Ancho</b><span class="mut">Línea cómoda de 60–80 caracteres.</span></div><div class="nova25-card"><b>Sin distracciones</b><span class="mut">Oculta elementos secundarios en la web actual.</span></div></div><div class="row"><button class="btn on" id="rd-on">Aplicar a esta página</button><button class="btn" id="rd-reset">Quitar</button></div></div>`; const css=`body{max-width:820px!important;margin:0 auto!important;background:#fff!important}header,nav,aside,footer,[class*=ad-],[id*=banner],[role=banner]{display:none!important}body{font:18px/1.8 Georgia,serif!important}img,video{max-width:100%!important;height:auto!important}`;r.querySelector('#rd-on').onclick=async()=>{const source=currentWebTab();if(!source?.wv?.executeJavaScript)return toast('Abre una página web para usar Reader+');try{await source.wv.executeJavaScript(`(()=>{let s=document.getElementById('__nova25_reader');if(!s){s=document.createElement('style');s.id='__nova25_reader';s.textContent=${JSON.stringify(css)};document.head.appendChild(s)}})()`);toast('Reader+ aplicado')}catch{toast('No se pudo aplicar Reader+')}};r.querySelector('#rd-reset').onclick=async()=>{const source=currentWebTab();if(!source?.wv?.executeJavaScript)return;try{await source.wv.executeJavaScript("document.getElementById('__nova25_reader')?.remove()")}catch{}}; };

  PG.collections = r => { const a=S.nova25.collections||[]; r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('collections.svg')}" alt="Colecciones"><h2>Colecciones</h2><span class="mut">Guarda páginas, notas y documentos por proyecto.</span><div class="row"><input class="fld" id="cn25" placeholder="Nueva colección"><button class="btn on" id="ca25">Crear</button><button class="btn" id="cc25">Guardar pestaña actual</button></div><div id="cl25" class="nova25-grid"></div><div id="cd25"></div></div>`; const draw=()=>{r.querySelector('#cl25').innerHTML=(S.nova25.collections||[]).map((c,i)=>`<div class="nova25-card"><b>${esc25(c.name)}</b><span class="mut">${c.items?.length||0} elementos</span><div class="row"><button class="btn" data-open="${i}">Abrir</button><button class="btn" data-del="${i}">Eliminar</button></div></div>`).join('')||'<span class="mut">Crea tu primera colección.</span>';r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.nova25.collections.splice(+b.dataset.del,1);save();draw();renderDetail(null)});r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>renderDetail(+b.dataset.open));}; const renderDetail=i=>{const box=r.querySelector('#cd25');if(i===null||i===undefined){box.innerHTML='';return;}const c=S.nova25.collections?.[i];if(!c){box.innerHTML='';return;}const items=Array.isArray(c.items)?c.items:[];box.innerHTML=`<div class="nova25-card" style="margin-top:12px"><div class="row"><b>${esc25(c.name)}</b><span class="mut">${items.length} elementos</span></div>${items.length?items.map((it,j)=>`<div class="row"><button class="btn" data-item="${j}" style="flex:1;text-align:left">${esc25(it.title||it.url||it.type||'Elemento')}</button></div>`).join(''):'<span class="mut">Esta colección está vacía. Pulsa “Guardar pestaña actual” para añadir la página activa.</span>'}</div>`;box.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>{const it=items[+b.dataset.item];if(!it)return;if(it.url&&/^https?:/i.test(it.url))newTab(it.url);else toast('Elemento guardado sin URL.');});};r.querySelector('#ca25').onclick=()=>{const n=r.querySelector('#cn25').value.trim();if(!n)return;S.nova25.collections.push({name:n,items:[]});save();r.querySelector('#cn25').value='';draw();};r.querySelector('#cc25').onclick=()=>{const source=currentWebTab();if(!source?.wv)return toast('Abre una página web para guardarla');const u=source.wv.getURL();if(!/^https?:/i.test(u))return toast('Abre una página web para guardarla');const title=source.el.querySelector('span')?.textContent||u;let c=S.nova25.collections[0];if(!c){c={name:'Mi colección',items:[]};S.nova25.collections.push(c);}c.items=Array.isArray(c.items)?c.items:[];if(!c.items.some(it=>it.url===u))c.items.unshift({type:'page',title,url:u,createdAt:Date.now()});save();draw();renderDetail(S.nova25.collections.indexOf(c));toast('Página guardada en “'+c.name+'”.');};draw(); };

  PG.capture = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('capture.svg')}" alt="Web Capture"><h2>Web Capture</h2><span class="mut">Captura la página web activa, aunque estés dentro de una pantalla interna de Nova.</span><div class="row"><button class="btn on" id="cp25">Capturar pantalla</button><button class="btn" id="cpclip">Capturar y copiar</button></div><span class="mut" id="cps"></span></div>`;r.querySelector('#cp25').onclick=async()=>{const source=currentWebTab();if(!source?.wv?.capturePage)return r.querySelector('#cps').textContent='Abre una página web para capturarla';try{const img=await source.wv.capturePage();const f=await ipc.invoke('save-shot',img.toPNG());r.querySelector('#cps').textContent=f?'Guardado en '+f:'No se pudo guardar';}catch(e){r.querySelector('#cps').textContent='Error: '+e.message}};r.querySelector('#cpclip').onclick=async()=>{const source=currentWebTab();if(!source?.wv?.capturePage)return r.querySelector('#cps').textContent='Abre una página web para capturarla';try{const img=await source.wv.capturePage();require('electron').clipboard.writeImage(img);r.querySelector('#cps').textContent='Captura copiada al portapapeles.'}catch(e){r.querySelector('#cps').textContent='No se pudo copiar la captura';}}; };

  function blocksFromHtml(html){ const tmp=document.createElement('div'); tmp.innerHTML=html; const out=[]; const walk=(node,style)=>{if(node.nodeType===3){if(node.textContent)style.runs.push({t:node.textContent,b:style.b,i:style.i});return;} if(node.nodeType!==1)return; const tag=node.tagName.toLowerCase(); if(['p','div','h1','h2','h3','li'].includes(tag)){if(style.runs.length)out.push({tag:style.tag,runs:style.runs});style={tag:['h1','h2','h3'].includes(tag)?tag:'p',runs:[],b:false,i:false}; if(tag==='li')style.runs.push({t:'• ',b:false,i:false});} const ns={tag:style.tag,runs:style.runs,b:style.b,i:style.i}; if(tag==='strong'||tag==='b')ns.b=true;if(tag==='em'||tag==='i')ns.i=true;node.childNodes.forEach(ch=>walk(ch,ns)); if(['p','div','h1','h2','h3','li'].includes(tag)&&ns.runs.length){out.push({tag:ns.tag,runs:ns.runs});style={tag:'p',runs:[],b:false,i:false};}}; walk(tmp,{tag:'p',runs:[],b:false,i:false});if(!out.length)out.push({tag:'p',runs:[{t:tmp.textContent||'',b:false,i:false}]});return out; }
  function xmlEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
  function buildDocXml(title, html){ const blocks=blocksFromHtml(html); return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${blocks.map(b=>`<w:p>${b.tag!=='p'?`<w:pPr><w:pStyle w:val="${b.tag}"/></w:pPr>`:''}${b.runs.map(run=>`<w:r><w:rPr>${run.b?'<w:b/>':''}${run.i?'<w:i/>':''}</w:rPr><w:t xml:space="preserve">${xmlEsc(run.t)}</w:t></w:r>`).join('')}</w:p>`).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`; }
  PG.writer = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('writer.svg')}" alt="Nova Writer"><div class="row"><div><h2 style="margin:0">Nova Writer</h2><span class="mut">Escribe en Nova y exporta un Word real.</span></div><span style="margin-left:auto" class="nova25-pill" id="wc25">0 palabras</span></div><div class="nova25-toolbar"><button class="btn" data-cmd="bold"><b>B</b></button><button class="btn" data-cmd="italic"><i>I</i></button><button class="btn" data-cmd="formatBlock" data-val="h1">H1</button><button class="btn" data-cmd="formatBlock" data-val="h2">H2</button><button class="btn" data-cmd="insertUnorderedList">• Lista</button><button class="btn" data-cmd="createLink">🔗</button><span style="flex:1"></span><button class="btn" id="wdl">Descargar .docx</button><button class="btn on" id="wnew">Nuevo</button></div><div class="nova25-editor" id="we" contenteditable="true"><h1>Nuevo documento</h1><p>Empieza a escribir aquí…</p></div><div class="mut">Guardado local en este perfil. Exportación Word sin salir de Nova.</div></div>`;const ed=r.querySelector('#we');const update=()=>{r.querySelector('#wc25').textContent=(ed.innerText.trim().match(/\S+/g)||[]).length+' palabras';S.nova25.lastDoc={title:(ed.querySelector('h1')?.innerText||'Documento'),html:ed.innerHTML};save()};r.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{const c=b.dataset.cmd;if(c==='createLink'){const u=prompt('Dirección del enlace','https://');if(u)document.execCommand(c,false,u)}else document.execCommand(c,false,b.dataset.val||null);ed.focus();update()});r.querySelector('#wnew').onclick=()=>{ed.innerHTML='<h1>Nuevo documento</h1><p></p>';update();ed.focus()};ed.oninput=update;r.querySelector('#wdl').onclick=async()=>{const title=(ed.querySelector('h1')?.innerText||'Nova Documento').trim().slice(0,80)||'Nova Documento';const xml=buildDocXml(title,ed.innerHTML);const f=await ipc.invoke('save-docx',{title,documentXml:xml}).catch(()=>null);toast(f?'Word guardado en '+f:'No se pudo guardar el Word');};update();};

  PG.docs = r => { const d=S.nova25.lastDoc; r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('docs.svg')}" alt="Nova Docs"><h2>Nova Docs</h2><span class="mut">Tu espacio de documentos locales.</span><div class="nova25-card"><b>${esc25(d?.title||'Sin documento reciente')}</b><span class="mut">${d?'Documento guardado desde Writer.':'Abre Writer para crear uno.'}</span><div class="row"><button class="btn on" id="do-write">Abrir Writer</button>${d?'<button class="btn" id="do-export">Exportar de nuevo</button>':''}</div></div></div>`;r.querySelector('#do-write').onclick=()=>openPage('writer'); if(d&&r.querySelector('#do-export'))r.querySelector('#do-export').onclick=async()=>{const f=await ipc.invoke('save-docx',{title:d.title||'Nova Documento',documentXml:buildDocXml(d.title,d.html)}).catch(()=>null);toast(f?'Word guardado en '+f:'No se pudo guardar el Word')}; };

  PG.study3 = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('study.svg')}" alt="Nova Study 3"><h2>Nova Study 3</h2><span class="mut">Une la pestaña actual, Reader+, notas y Writer en una sola sesión.</span><div class="row"><button class="btn on" id="sy-read">Aplicar Reader+</button><button class="btn" id="sy-wr">Abrir Writer</button><button class="btn" id="sy-col">Guardar en Colecciones</button></div><div class="nova25-card"><b>Flujo sugerido</b><span class="mut">1. Lee · 2. resume · 3. guarda · 4. escribe · 5. exporta.</span></div></div>`;r.querySelector('#sy-read').onclick=()=>openPage('reader');r.querySelector('#sy-wr').onclick=()=>openPage('writer');r.querySelector('#sy-col').onclick=()=>{const source=currentWebTab();if(!source?.wv)return toast('Abre una página web para guardarla');const u=source.wv.getURL();if(!/^https?:/i.test(u))return openPage('collections');S.nova25.collections=S.nova25.collections||[];let c=S.nova25.collections[0];if(!c){c={name:'Mi colección',items:[]};S.nova25.collections.push(c);}c.items=Array.isArray(c.items)?c.items:[];if(!c.items.some(it=>it.url===u))c.items.unshift({type:'page',title:source.el.querySelector('span')?.textContent||u,url:u,createdAt:Date.now()});save();toast('Página guardada en “'+c.name+'”.');openPage('collections');}; };

  PG.privacidad2 = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('privacy.svg')}" alt="Privacy Center"><h2>Centro de privacidad</h2><span class="mut">Un único sitio para ver las protecciones de Nova.</span><div class="nova25-grid"><div class="nova25-card"><b>Bloqueador</b><span class="mut">${S.adblock?'Activo':'Desactivado'}</span><button class="btn" id="pv-ad">Cambiar</button></div><div class="nova25-card"><b>Datos</b><span class="mut">Historial, cookies y caché.</span><button class="btn" id="pv-clear">Limpiar</button></div><div class="nova25-card"><b>Webview</b><span class="mut">Webviews con Node Integration desactivado.</span></div></div></div>`;r.querySelector('#pv-ad').onclick=()=>{S.adblock=!S.adblock;save();applyTheme();PG.privacidad2(r)};r.querySelector('#pv-clear').onclick=async()=>{S.hist=[];save();await ipc.invoke('clear');toast('Datos de navegación limpiados');}; };

  PG.rendimiento2 = async r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('performance.svg')}" alt="Performance Center"><h2>Centro de rendimiento</h2><span class="mut">RAM, procesos web y modo ahorro en un mismo sitio.</span><div class="nova25-card" id="pi25">Consultando…</div><div class="row"><button class="btn on" id="pf25">Alternar ahorro de memoria</button><button class="btn" id="pc25">Limpiar caché</button></div></div>`;const pi=r.querySelector('#pi25');const paint=async()=>{const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));const count=Array.isArray(d?.tabs)?d.tabs.length:'—';const pid=d?.main?.pid??'—';const mem=d?.main?.rssKB!=null?Math.round(Number(d.main.rssKB)/1024):'—';pi.innerHTML=d?.ok?`<div class="nova25-status"><span class="nova25-pill">Pestañas web: ${count}</span><span class="nova25-pill">PID principal: ${pid}</span><span class="nova25-pill">RAM del proceso: ${mem} MB</span></div>`:'No disponible';};r.querySelector('#pf25').onclick=async()=>{const on=!S.nova25.perf;const ok=await ipc.invoke('performance-mode',on).catch(()=>false);if(ok){S.nova25.perf=on;save();toast(on?'Ahorro activo':'Ahorro desactivado')}};r.querySelector('#pc25').onclick=async()=>{const ok=await ipc.invoke('performance-cache').catch(()=>false);toast(ok?'Caché limpiada':'No se pudo limpiar la caché');paint()};paint(); };

  PG.descargas2 = r => { r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('downloads.svg')}" alt="Download Hub"><h2>Download Hub</h2><span class="mut">Acceso rápido a tus descargas y a la carpeta de archivos.</span><div class="nova25-card"><b>${(S.dls||[]).length} descargas registradas</b><span class="mut">Usa el gestor existente para pausar o abrir archivos.</span><div class="row"><button class="btn on" id="dh-open">Abrir Descargas</button><button class="btn" id="dh-folder">Abrir carpeta</button></div></div></div>`;r.querySelector('#dh-open').onclick=()=>newTab('nova://descargas');r.querySelector('#dh-folder').onclick=()=>ipc.invoke('open-downloads-folder').then(ok=>{if(!ok)toast('No se pudo abrir la carpeta de descargas');}).catch(()=>toast('No se pudo abrir la carpeta de descargas')); };

  PG.apps = r => { const apps=Array.isArray(S.nova25.apps)?S.nova25.apps:[]; r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('apps.svg')}" alt="Web Apps"><h2>Web Apps</h2><span class="mut">Guarda webs como accesos rápidos de Nova.</span><div class="row"><input class="fld" id="an25" placeholder="https://ejemplo.com"><input class="fld" id="at25" placeholder="Nombre"><button class="btn on" id="aa25">Añadir</button></div><div class="nova25-grid">${apps.map((a,i)=>`<div class="nova25-card"><b>${esc25(a.name)}</b><span class="mut">${esc25(a.url)}</span><div class="row"><button class="btn on" data-app="${i}">Abrir</button><button class="btn" data-delapp="${i}">Eliminar</button></div></div>`).join('')||'<span class="mut">Añade tu primera web app.</span>'}</div></div>`;r.querySelector('#aa25').onclick=()=>{const u=cleanHttp(r.querySelector('#an25').value);const n=r.querySelector('#at25').value.trim()||u;if(!u)return toast('Escribe una URL HTTP o HTTPS');S.nova25.apps.push({url:u,name:n});save();PG.apps(r)};r.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>newTab(apps[+b.dataset.app].url));r.querySelectorAll('[data-delapp]').forEach(b=>b.onclick=()=>{S.nova25.apps.splice(+b.dataset.delapp,1);save();PG.apps(r)}); };

  PG.mejoras = r => { const seeded=[
    ['Islands inteligentes','Sugerencias automáticas cuando varias pestañas pertenecen al mismo proyecto.','Pestañas'],
    ['Reader con perfiles','Guardar tipografía, ancho y tema por sitio.','Lectura'],
    ['Plantillas de Writer','Cartas, CV, apuntes y trabajos con un clic.','Writer']
  ]; S.nova25.suggestions = S.nova25.suggestions || seeded.map(x=>({title:x[0],text:x[1],cat:x[2],votes:0})); const draw=()=>{r.querySelector('#ml25').innerHTML=S.nova25.suggestions.map((s,i)=>`<div class="nova25-suggestion"><div><b>${esc25(s.title)}</b><div class="mut">${esc25(s.cat)} · ${esc25(s.text)}</div></div><div class="vote"><span class="nova25-pill">${s.votes||0}</span><button class="nova25-vote" data-v="${i}">▲</button></div></div>`).join('')}; r.innerHTML=`<div class="nova25-shell"><img class="nova25-hero" src="${local('improvements.svg')}" alt="Mejoras de Nova"><div><h2>Mejoras de Nova</h2><span class="mut">Un sitio dentro del navegador para contarme qué mejorar, votar ideas y guardar propuestas.</span></div><div class="nova25-card"><div class="row"><input class="fld" id="mt25" placeholder="Título de la mejora"><select class="fld" id="mc25" style="max-width:180px"><option>Pestañas</option><option>Interfaz</option><option>IA</option><option>Writer</option><option>Privacidad</option><option>Rendimiento</option><option>Otro</option></select></div><textarea class="fld" id="md25" rows="4" placeholder="¿Qué debería hacer Nova mejor?"></textarea><div class="row"><button class="btn on" id="ma25">Guardar mejora</button><button class="btn" id="mg25">Abrir GitHub Issues</button></div></div><div id="ml25" class="nova25-shell"></div></div>`;r.querySelector('#ma25').onclick=()=>{const t=r.querySelector('#mt25').value.trim(),d=r.querySelector('#md25').value.trim(),c=r.querySelector('#mc25').value;if(!t||!d)return toast('Añade un título y una descripción');S.nova25.suggestions.push({title:t,text:d,cat:c,votes:0});save();r.querySelector('#mt25').value='';r.querySelector('#md25').value='';draw()};r.querySelector('#mg25').onclick=()=>ipc.invoke('open-external','https://github.com/sdraiky99/NovaBrowser/issues/new').catch(()=>{});r.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;S.nova25.suggestions[+b.dataset.v].votes=(S.nova25.suggestions[+b.dataset.v].votes||0)+1;save();draw()});draw(); };

  PG.novedades = r => { const cards=[
    ['safari.svg','Safari Mode','Superficie limpia tipo Safari con la potencia de Nova.'],
    ['islands.svg','Nova Islands','Los grupos de pestañas pasan a ser espacios visuales compactos.'],
    ['glance.svg','Glance','Previsualiza enlaces sin abrir una pestaña completa.'],
    ['focus.svg','Nova Focus','Concentración rápida con temporizador y UI mínima.'],
    ['reader.svg','Nova Reader+','Lectura cómoda y configurable.'],
    ['collections.svg','Colecciones','Agrupa enlaces y proyectos por contexto.'],
    ['capture.svg','Web Capture','Captura y envía páginas a tus herramientas.'],
    ['writer.svg','Nova Writer','Editor integrado con exportación DOCX.'],
    ['docs.svg','Nova Docs','Gestor local de documentos creados en Nova.'],
    ['study.svg','Nova Study 3','Web + lectura + escritura en un mismo flujo.'],
    ['privacy.svg','Centro de privacidad','Todos los controles importantes en un solo lugar.'],
    ['performance.svg','Centro de rendimiento','Memoria, CPU y caché reunidos.'],
    ['downloads.svg','Download Hub','Descargas más accesibles y organizadas.'],
    ['apps.svg','Web Apps','Accesos a tus aplicaciones web dentro de Nova.'],
    ['setup.svg','Setup renovado','Instalador más claro, rápido y ligero.'],
    ['onboarding.svg','Nuevo inicio','Bienvenida guiada en menos pasos.'],
    ['improvements.svg','Mejoras de Nova','Tu sitio interno para propuestas y feedback.']
  ]; r.innerHTML=`<div class="nova25-news"><div class="lead"><h2>Nova 3.0.1</h2><span class="mut">Air + Safari + Islands + productividad. Muchas funciones nuevas, una superficie más tranquila.</span><div class="row"><button class="btn on" id="nsv">Safari Mode</button><button class="btn" id="nwr">Writer</button><button class="btn" id="nfb">Mejoras</button></div></div>${cards.map(([im,t,d])=>`<article class="nova25-news-card"><img src="${local(im)}" alt="${esc25(t)}"><div class="body"><b style="font-size:18px">${esc25(t)}</b><span class="mut">${esc25(d)}</span><div class="row"><span class="nova25-pill">Nueva</span></div></div></article>`).join('')}</div>`; r.querySelector('#nsv').onclick=()=>openPage('safari');r.querySelector('#nwr').onclick=()=>openPage('writer');r.querySelector('#nfb').onclick=()=>newTab(IMPROVEMENTS_URL); };

  // ---------- Command Center additions ----------
  if(Array.isArray(N.extraActs)){
    const extras=[
      ['Safari Mode',()=>openPage('safari')],['Nova Islands',()=>openPage('islands')],['Glance',()=>openPage('glance')],['Nova Focus',()=>openPage('focus')],['Nova Reader+',()=>openPage('reader')],['Colecciones',()=>openPage('collections')],['Web Capture',()=>openPage('capture')],['Nova Writer',()=>openPage('writer')],['Nova Docs',()=>openPage('docs')],['Nova Study 3',()=>openPage('study3')],['Centro de privacidad',()=>openPage('privacidad2')],['Centro de rendimiento',()=>openPage('rendimiento2')],['Download Hub',()=>openPage('descargas2')],['Web Apps',()=>openPage('apps')],['Mejoras de Nova',()=>newTab(IMPROVEMENTS_URL)]
    ]; extras.forEach(a=>{if(!N.extraActs.some(x=>x[0]===a[0]))N.extraActs.push(a)});
  }

  // ---------- Automatic Island suggestion from repeated domain ----------
  function suggestIsland(){ const active=N.activeWebTab?.()||cur; if(!S.nova25.autoIslands||!active?.wv||active.wv.tagName!=='WEBVIEW')return; let host='';try{host=new URL(active.wv.getURL()).hostname}catch{return}if(!host)return;const same=tabs.filter(t=>{try{return t!==active&&new URL(t.wv.getURL()).hostname===host}catch{return false}});if(same.length<1)return;if(same.some(t=>t.g))return;const key='suggested-'+host; if((S.nova25.suggested||{})[key])return; S.nova25.suggested=S.nova25.suggested||{}; S.nova25.suggested[key]=1;save();setTimeout(()=>{if(confirm(`Nova ha detectado ${same.length+1} pestañas de ${host}. ¿Crear una Island?`)){ S.groups=S.groups||{};const id='g'+Date.now().toString(36);S.groups[id]={name:host.replace(/^www\./,''),color:'#0a84ff',collapsed:false};[active,...same].forEach(t=>t.g=id);save();typeof N.refreshIslands==='function'&&N.refreshIslands();toast('Island creada.')}},150); }
  tabs.forEach(t=>{try{t.wv?.addEventListener?.('did-stop-loading',suggestIsland)}catch{}});

  // ---------- Link Glance (Alt+click) ----------
  const glancePfx='__N25GL__';
  function injectGlance(t){ if(!t?.wv||t.wv.tagName!=='WEBVIEW')return; const code=`(()=>{if(window.__n25g)return;window.__n25g=1;document.addEventListener('click',e=>{if(!e.altKey)return;const a=e.target?.closest?.('a[href]');if(!a)return;let u='';try{u=new URL(a.href).href}catch{}if(!/^https?:$/.test(new URL(u).protocol))return;e.preventDefault();e.stopPropagation();console.log(${JSON.stringify(glancePfx)}+JSON.stringify({u}));},true)})()`; t.wv.executeJavaScript(code).catch(()=>{}); }
  const wireGlance = t => { if(!t?.wv || t.wv.tagName!=='WEBVIEW' || t._n25gl) return; t._n25gl=1; injectGlance(t); try{ t.wv.addEventListener('dom-ready',()=>injectGlance(t)); t.wv.addEventListener('console-message',e=>{ if(String(e.message||'').startsWith(glancePfx)){ let m; try{m=JSON.parse(e.message.slice(glancePfx.length))}catch{return} showGlance(t,m.u); } }); }catch{} };
  tabs.forEach(wireGlance);
  const baseNewTab25 = newTab;
  newTab = function(u){ const t=baseNewTab25(u); setTimeout(()=>{wireGlance(t); if(t?.wv?.tagName==='WEBVIEW'&&!t._n25auto){t._n25auto=1;try{t.wv.addEventListener('did-stop-loading',suggestIsland)}catch{}}},80); return t; };
  function showGlance(t,u){
    const ov=document.createElement('div');ov.className='nova25-tour';ov.id='nova25-glance';ov.innerHTML=`<div class="card" style="max-width:880px"><div class="row"><div><b>Glance</b><div class="mut">${esc25(u)}</div></div><button class="btn" id="gx">Cerrar</button></div><div style="margin-top:10px;height:62vh;max-height:640px;border:1px solid var(--bd);border-radius:16px;overflow:hidden"><webview id="gweb" partition="${esc25(N.profilePartition?.()||'persist:nova-default')}" src="${esc25(u)}" style="display:flex;width:100%;height:100%"></webview></div><div class="row" style="margin-top:10px"><button class="btn on" id="go-open">Abrir en pestaña</button><button class="btn" id="go-is">Abrir y añadir a Island</button></div></div>`;document.body.appendChild(ov);ov.querySelector('#gx').onclick=()=>ov.remove();ov.querySelector('#go-open').onclick=()=>{ov.remove();newTab(u)};ov.querySelector('#go-is').onclick=()=>{ov.remove();const nt=newTab(u);setTimeout(()=>{const id=t.g||(()=>{const id='g'+Date.now().toString(36);S.groups[id]={name:new URL(u).hostname,color:'#0a84ff',collapsed:false};return id})();nt.g=id;save();refreshIslands()},100)};
  }

  // ---------- Keep current + button behavior and reset tab spacing ----------
  const tabAdd = document.getElementById('nt'), tabsEl = document.getElementById('tabs'); if (tabsEl && tabAdd && tabsEl.lastElementChild !== tabAdd) tabsEl.appendChild(tabAdd);
  refreshIslands();

  // ---------- Setup / welcome state ----------
  N.openFirstRun = () => { S.nova25.forceIntro=1; save(); openPage('bienvenida'); };
  // Make the dedicated internal welcome richer without breaking the original flow.
  PG.bienvenida = r => { r.innerHTML=`<div class="nova25-shell"><img src="${local('onboarding.svg')}" class="nova25-hero" alt="Nova 3.0.1 onboarding"><div><h2>Bienvenido a Nova 3.0.1</h2><span class="mut">Air en la superficie; Safari, Islands, Focus y herramientas potentes cuando las necesitas.</span></div><div class="nova25-grid"><div class="nova25-card"><b>⌘ Organiza</b><span class="mut">Spaces para contexto, Islands para proyectos y pestañas para páginas.</span></div><div class="nova25-card"><b>✦ Concéntrate</b><span class="mut">Focus y Reader+ aparecen solo cuando los necesitas.</span></div><div class="nova25-card"><b>✎ Crea</b><span class="mut">Writer convierte tus ideas en documentos Word.</span></div><div class="nova25-card"><b>↑ Mejora</b><span class="mut">Cuéntanos qué debería mejorar Nova desde nova://mejoras.</span></div></div><div class="row" style="flex-wrap:wrap"><button class="btn on" id="nb-sf">Safari Mode</button><button class="btn" id="nb-is">Islands</button><button class="btn" id="nb-wr">Writer</button><button class="btn" id="nb-fc">Focus</button><button class="btn" id="nb-mm">Mejoras</button></div></div>`;r.querySelector('#nb-sf').onclick=()=>openPage('safari');r.querySelector('#nb-is').onclick=()=>openPage('islands');r.querySelector('#nb-wr').onclick=()=>openPage('writer');r.querySelector('#nb-fc').onclick=()=>openPage('focus');r.querySelector('#nb-mm').onclick=()=>newTab(IMPROVEMENTS_URL); };

  // ---------- Setup clean-up / add feedback to menu ----------
  if(Array.isArray(N.MENU)){ if(!N.MENU.some(m=>m[0]==='Mejoras de Nova')) N.MENU.push(['Mejoras de Nova',()=>newTab(IMPROVEMENTS_URL)]); if(!N.MENU.some(m=>m[0]==='Safari Mode')) N.MENU.push(['Safari Mode',()=>openPage('safari')]); }
  // ---------- One-click shortcut hints ----------
  if(typeof N.SHORTCUTS==='object'&&Array.isArray(N.SHORTCUTS)){ N.SHORTCUTS.push(['Alt + clic','Glance · previsualizar enlace'],['Ctrl + K','Command Center · acciones y páginas'],['Ctrl + Shift + N','Nueva Island desde la pestaña actual']); }
  document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();const source=currentWebTab()||cur;N.createIsland?.(source) || N.newGroup?.(source); } });

  // ---------- Smooth default: Air but not forced if user chose another theme ----------
  if(!S.nova25.initialized){ S.nova25.initialized=1; if(!S.theme||S.theme==='air'){S.theme='air';save();} }
})();


/* ---- hotfix254.js ---- */
/* Nova 3.0.1 Hotfix · functional routing, IA actions and command bridge */
(() => {
  const N = window.NOVA;
  if (!N) return;
  const aliases = Object.freeze({
    about:'acerca', settings:'ajustes', preference:'ajustes', preferences:'ajustes',
    privacy:'privacidad2', rendimiento:'rendimiento2', performance:'rendimiento2',
    downloads:'descargas2', download:'descargas2', study:'study3', feedback:'mejoras',
    improvements:'mejoras', news:'novedades', start:'bienvenida', welcome:'bienvenida',
    ia:'ia'
  });
  const title = Object.freeze({
    safari:'Safari Mode', islands:'Nova Islands', glance:'Glance', focus:'Nova Focus', reader:'Nova Reader+',
    collections:'Colecciones', capture:'Web Capture', writer:'Nova Writer', docs:'Nova Docs', study3:'Nova Study 3',
    privacidad2:'Centro de privacidad', rendimiento2:'Centro de rendimiento', descargas2:'Download Hub', apps:'Web Apps',
    mejoras:'Mejoras de Nova', novedades:'Novedades', welcome:'Bienvenida', acerca:'Acerca de Nova', ajustes:'Ajustes',
    notas:'Notas', workspaces:'Workspaces', pestanas:'Pestañas', seguridad:'Seguridad'
  });
  const resolve = raw => {
    const x = String(raw || '').replace(/^nova:\/\//,'').split(/[/?#]/)[0].trim().toLowerCase();
    return aliases[x] || x;
  };
  N.resolveFeatureRoute = resolve;
  N.openFeature = route => {
    const name = resolve(route);
    if (name === 'ia') { N.openAI?.(); return window.cur || null; }
    if (!N.PG?.[name]) {
      try { if (typeof toast === 'function') toast('Esta función no está disponible en esta versión: ' + name); } catch {}
      return null;
    }
    const t = newTab('nova://' + name);
    setTimeout(() => { try { const sp = t?.el?.querySelector('span'); if (sp) sp.textContent = title[name] || name; } catch {} }, 25);
    return t;
  };
  // Prevent the old internalTab() fallback from silently opening Acerca de.
  if (typeof internalTab === 'function' && !N.__hotfixInternalRouter) {
    const baseInternalTab = internalTab;
    internalTab = function (u) {
      const name = resolve(u);
      if (!N.PG?.[name]) {
        try { toast('Ruta interna no encontrada: ' + name); } catch {}
        return null;
      }
      return baseInternalTab('nova://' + name);
    };
    N.__hotfixInternalRouter = true;
  }
  // Working AI bridge for the Command Center, selection chip and New Tab.
  N.aiNew = () => { try { if (typeof S !== 'undefined' && Array.isArray(S.convs)) { const fresh = { id: Date.now(), title: 'Nueva conversación', msgs: [], ts: Date.now() }; S.convs.unshift(fresh); S.cid = fresh.id; save?.(); } N.openAI?.(); return (typeof S !== 'undefined') ? S.cid : null; } catch { N.openAI?.(); return null; } };
  N.aiSend = q => { try { N.openAI?.(); return N.askAI?.(String(q || '')); } catch { return null; } };
  N.askSel = t => N.aiSend('Explica o resume este texto seleccionado:\n\n' + String(t || '').slice(0, 6000));
  N.aiAct = kind => {
    if (kind === 'sum') {
      const source = N.currentWebTab?.() || N.activeWebTab?.();
      (async () => {
        try {
          const body = source?.wv?.executeJavaScript ? await source.wv.executeJavaScript('document.body.innerText.slice(0,12000)') : '';
          if (!body) throw new Error('no-web-page');
          N.aiSend('Resume en español, en pocos puntos, esta página:\n\n' + body);
        } catch {
          N.aiSend('Abre una página web para poder resumirla.');
        }
      })();
      return;
    }
    N.toggleAI?.();
  };
  N.goSec = () => N.openFeature('ajustes');
  N.newNote = () => {
    const t = N.openFeature('notas');
    try { toast('Notas abierto. Pulsa “+ Nueva nota” para crear una nota.'); } catch {}
    return t;
  };
  // Fix wrong/empty Command Center actions and add all 2.5 actions as callable entries.
  const ensure = (label, fn) => {
    N.extraActs = Array.isArray(N.extraActs) ? N.extraActs : [];
    const i = N.extraActs.findIndex(a => Array.isArray(a) && a[0] === label);
    if (i >= 0) N.extraActs[i] = [label, fn]; else N.extraActs.push([label, fn]);
  };
  ensure('Abrir Nova IA', () => N.toggleAI?.());
  ensure('Nueva conversación con Nova IA', () => N.aiNew());
  ensure('Resumir página', () => N.aiAct('sum'));
  ensure('Preguntar a Nova IA', () => N.openAI?.());
  ensure('Command Center', () => N.palette?.());
  ensure('Nueva nota', () => N.newNote());
  ensure('Safari Mode', () => N.openFeature('safari'));
  ensure('Nova Islands', () => N.openFeature('islands'));
  ensure('Glance', () => N.openFeature('glance'));
  ensure('Nova Focus', () => N.openFeature('focus'));
  ensure('Nova Reader+', () => N.openFeature('reader'));
  ensure('Colecciones', () => N.openFeature('collections'));
  ensure('Web Capture', () => N.openFeature('capture'));
  ensure('Nova Writer', () => N.openFeature('writer'));
  ensure('Nova Docs', () => N.openFeature('docs'));
  ensure('Nova Study 3', () => N.openFeature('study3'));
  ensure('Centro de privacidad', () => N.openFeature('privacidad2'));
  ensure('Centro de rendimiento', () => N.openFeature('rendimiento2'));
  ensure('Download Hub', () => N.openFeature('descargas2'));
  ensure('Web Apps', () => N.openFeature('apps'));
  ensure('Mejoras de Nova', () => N.openFeature('mejoras'));
  ensure('Workspaces', () => N.openFeature('workspaces'));
  ensure('Gestor de pestañas', () => N.openFeature('pestanas'));
  N.__hotfix254Ready = true;
})();


/* ---- nova30.js ---- */
/* Nova 3.0.1 · Calm Power layer
 * Keeps the 2.5.x recovery architecture intact and adds the planned productivity/system layer.
 */
(() => {
  const N = window.NOVA;
  if (!N || !N.PG) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const local = p => `../assets/release/3.0/${p}`;
  const schema = () => {
    S.novaNext = S.novaNext || {};
    S.novaNext.collections = Array.isArray(S.novaNext.collections) ? S.novaNext.collections : [];
    S.novaNext.docs = Array.isArray(S.novaNext.docs) ? S.novaNext.docs : [];
    S.novaNext.reading = Array.isArray(S.novaNext.reading) ? S.novaNext.reading : [];
    S.novaNext.workspaces = Array.isArray(S.novaNext.workspaces) ? S.novaNext.workspaces : [];
    S.novaNext.apps = Array.isArray(S.novaNext.apps) ? S.novaNext.apps : (Array.isArray(S.nova25?.apps) ? S.nova25.apps : []);
    S.novaNext.panels = Array.isArray(S.novaNext.panels) ? S.novaNext.panels : [];
    S.novaNext.snoozed = Array.isArray(S.novaNext.snoozed) ? S.novaNext.snoozed : [];
    S.novaNext.customShortcuts = typeof S.novaNext.customShortcuts === 'object' ? S.novaNext.customShortcuts : {}; S.novaNext.verticalTabs = !!S.novaNext.verticalTabs; S.novaNext.customShortcuts.cmd = String(S.novaNext.customShortcuts.cmd || 'k').toLowerCase();
    S.novaNext.setupDone = !!S.novaNext.setupDone;
  };
  schema();

  const title = {
    safari:'Safari Air', islands:'Nova Islands', glance:'Glance', focus:'Nova Focus', reader:'Nova Reader+',
    collections:'Colecciones', capture:'Web Capture', writer:'Nova Writer', docs:'Nova Docs', study3:'Nova Study 3',
    privacidad2:'Centro de privacidad', rendimiento2:'Centro de rendimiento', descargas2:'Download Hub', apps:'Nova Apps',
    mejoras:'Mejoras de Nova', workspaces:'Spaces', pestanas:'Gestor de pestañas', sesiones:'Sesiones', reading:'Reading List',
    qr:'Compartir con QR', media:'Media Hub', panels:'Web Panels', backup:'Backup & Restore', shortcuts:'Atajos', send:'Nova Send', pip:'Picture-in-Picture', novedades:'Novedades 3.0.1', bienvenida:'Bienvenida 3.0'
  };
  const open = (name) => {
    const raw = String(name || '').replace(/^nova:\/\//,'').split(/[/?#]/)[0].trim().toLowerCase();
    if (raw === 'acciones' || raw === 'command' || raw === 'command-center' || raw === 'palette') { N.palette?.(); return null; }
    const route = N.resolveFeatureRoute ? N.resolveFeatureRoute(name) : name;
    const page = route || name;
    if (!N.PG[page]) { try { toast('Función no disponible: ' + page); } catch {} return null; }
    const t = newTab('nova://' + page);
    setTimeout(() => { try { const s = t?.el?.querySelector('span'); if (s) s.textContent = title[page] || page; } catch {} }, 30);
    return t;
  };
  N.openFeature = open;

  const save = () => { try { window.save?.(); N.save?.(); } catch {} };
  const isWebTab = t => !!(t?.wv && typeof t.wv.executeJavaScript === 'function' && !t.wv.classList?.contains?.('ipage'));
  const activeWebTab = () => { try { const t=N.activeWebTab?.(); if(isWebTab(t)) return t; if(isWebTab(cur)) return cur; for(let i=tabs.length-1;i>=0;i--) if(isWebTab(tabs[i])) return tabs[i]; return null; } catch { return null; } };
  const currentWeb = () => activeWebTab();
  const currentUrl = () => { try { const t=currentWeb(); return http(t?.wv?.getURL?.() || ''); } catch { return ''; } };
  const currentTitle = () => { try { const t=currentWeb(); return t?.el?.querySelector('span')?.textContent || currentUrl(); } catch { return currentUrl(); } };
  N.currentWebTab = currentWeb;
  const card = (head, body, actions='') => `<div class="nx-card"><div class="nx-card-head"><b>${head}</b></div><div class="mut">${body}</div>${actions ? `<div class="nx-actions">${actions}</div>` : ''}</div>`;
  const shell = (hero, kicker, desc, body) => `<div class="nx-page">${hero ? `<img class="nx-hero" src="${local(hero)}" alt="">` : ''}<div class="nx-kicker">${esc(kicker || 'NOVA 3.0')}</div><h2>${esc(title[kicker] || kicker || '')}</h2><p class="nx-lead">${esc(desc || '')}</p>${body}</div>`;
  const btn = (label, attr='', cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;

  function addStyles(){
    if(document.getElementById('nova30-style')) return;
    const st=document.createElement('style');st.id='nova30-style';st.textContent=`
      .nx-page{display:flex;flex-direction:column;gap:14px;max-width:1120px;margin:0 auto}.nx-hero{width:min(100%,900px);align-self:center;border-radius:22px;border:1px solid var(--bd);box-shadow:0 20px 60px #0002}.nx-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--acc);font-weight:800}.nx-page h2{font-size:28px;font-weight:500;margin:0}.nx-lead{margin:0;color:var(--mut);max-width:780px;line-height:1.6}.nx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.nx-card{padding:16px;border:1px solid var(--bd);background:color-mix(in srgb,var(--bar) 94%,transparent);border-radius:18px;display:flex;flex-direction:column;gap:9px}.nx-card-head{display:flex;align-items:center;gap:8px}.nx-card small{color:var(--mut)}.nx-actions{display:flex;flex-wrap:wrap;gap:7px}.nx-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.nx-chip.on{border-color:var(--acc);color:var(--acc)}.nx-list{display:flex;flex-direction:column;gap:8px}.nx-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}.nx-row .meta{min-width:0}.nx-row .meta b,.nx-row .meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nx-editor{min-height:520px;padding:24px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);outline:none;line-height:1.72;font-size:16px}.nx-editor:focus{border-color:var(--acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 18%,transparent)}.nx-toolbar{display:flex;flex-wrap:wrap;gap:6px}.nx-stat{display:flex;gap:8px;flex-wrap:wrap}.nx-stat .nx-chip strong{font-size:14px}.nx-modal{position:fixed;inset:0;z-index:500;display:grid;place-items:center;background:rgba(0,0,0,.3);backdrop-filter:blur(8px)}.nx-dialog{width:min(720px,94vw);max-height:88vh;overflow:auto;padding:18px;border:1px solid var(--bd);border-radius:24px;background:color-mix(in srgb,var(--bar) 96%,transparent);box-shadow:0 30px 100px #0008}.nx-command{display:flex;flex-direction:column;gap:10px}.nx-command input{font-size:18px;padding:13px 15px;border-radius:14px}.nx-result{padding:11px 12px;border:1px solid transparent;border-radius:12px;display:flex;justify-content:space-between;gap:10px;cursor:pointer}.nx-result:hover,.nx-result.sel{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent)}.nx-result small{color:var(--mut)}.nx-timer{font-size:42px;font-weight:600;letter-spacing:.04em}.nx-reader{max-width:860px;margin:auto}.nx-reader article{font:19px/1.85 Georgia,serif}.nx-reader article h1{font:600 38px/1.2 system-ui,sans-serif}.nx-reader article h2,.nx-reader article h3{font-family:system-ui,sans-serif}.nx-reader article img{max-width:100%;height:auto}.nx-qr{display:grid;grid-template-columns:minmax(220px,320px) 1fr;gap:18px;align-items:start}.nx-qr img{width:100%;border-radius:18px;background:#fff;padding:14px}.nx-webpanel{display:grid;grid-template-columns:240px 1fr;gap:12px;min-height:600px}.nx-webpanel iframe,.nx-webpanel webview{width:100%;height:100%;border:1px solid var(--bd);border-radius:16px;background:#fff}.nx-code{white-space:pre-wrap;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}
      body.nova30-safari #top{height:46px}
      body.nova30-vertical #tabs{position:fixed;left:52px;top:46px;bottom:0;width:240px;display:flex;flex-direction:column;align-items:stretch;overflow:auto;padding:8px;background:color-mix(in srgb,var(--bar) 94%,transparent);border-right:1px solid var(--bd);z-index:25}body.nova30-vertical #tabs .tab{flex:0 0 34px;max-width:none;width:100%;border-radius:10px;margin:2px 0}body.nova30-vertical #tabs #nt{order:999;flex:0 0 34px;width:100%;margin:4px 0}body.nova30-vertical #view{margin-left:240px}body.nova30-safari #tabs{gap:5px}body.nova30-safari .tab{height:32px;border-radius:12px;background:transparent}body.nova30-safari .tab.on{background:color-mix(in srgb,var(--bar) 82%,transparent);box-shadow:0 1px 2px #0002}.nova30-island-pill{padding:4px 9px;border-radius:999px}
      @media(max-width:760px){.nx-webpanel,.nx-qr{grid-template-columns:1fr}.nx-page{padding-bottom:20px}}
    `;document.head.appendChild(st);
  }
  addStyles();

  // ---------- Safari Air ----------
  const applySafari = on => {
    const enabled = !!on;
    S.novaNext = S.novaNext || {}; S.nova25 = S.nova25 || {};
    const was = !!S.novaNext.safari;
    if(enabled && !was){ const prev=S.theme==='safari' ? (S.novaNext.prevTheme||S.nova25.prevTheme||'air') : S.theme; S.novaNext.prevTheme=prev; S.nova25.prevTheme=prev; if(S.theme!=='safari') S.theme='safari'; }
    if(!enabled && was){ const prev=S.novaNext.prevTheme||S.nova25.prevTheme; S.theme=(prev&&prev!=='safari')?prev:'air'; delete S.novaNext.prevTheme; delete S.nova25.prevTheme; }
    S.novaNext.safari=enabled; S.nova25.safari=enabled;
    document.body.classList.toggle('nova30-safari', enabled);
    document.body.classList.toggle('nova25-safari', enabled);
    save(); applyTheme(); refreshNT();
  };
  N.applySafari = applySafari;
  N.PG.safari = r => {
    r.innerHTML = `<div class="nx-page"><img class="nx-hero" src="${local('safari.svg')}" alt="Safari Air"><div class="nx-kicker">EXPERIENCE</div><h2>Safari Air</h2><p class="nx-lead">Superficie compacta y calmada, con la potencia de Nova debajo.</p><div class="nx-grid">${card('Barra compacta','Pestañas suaves, dirección centrada y menos ruido visual.')}${card('Islands + Spaces','Organiza por contexto sin convertir la ventana en un panel de control.')}${card('Power bajo demanda','Command Center, Writer, Study, Privacy y Performance quedan a un atajo.')}</div><div class="nx-actions">${btn(S.novaNext.safari?'Desactivar Safari Mode':'Activar Safari Mode','id="nx-safari"','on')}${btn('Abrir Islands','id="nx-safari-islands"')}${btn('Abrir Focus','id="nx-safari-focus"')}</div></div>`;
    r.querySelector('#nx-safari').onclick=()=>applySafari(!S.novaNext.safari);r.querySelector('#nx-safari-islands').onclick=()=>open('islands');r.querySelector('#nx-safari-focus').onclick=()=>open('focus');
  };

  // ---------- Islands + Spaces ----------
  function ensureGroup(){
    S.groups=S.groups||{};
    const id='g'+Date.now().toString(36);S.groups[id]={name:'Nueva Island',color:'#0a84ff',collapsed:false};return id;
  }
  N.createIsland = async t => {
    const current = t || N.currentWebTab?.() || cur;if(!current)return null;
    if(current.g && S.groups[current.g])return current.g;
    const id=ensureGroup(); current.g=id; save(); N.renderGroups?.(); N.refreshIslands?.(); return id;
  };
  N.PG.islands = r => {
    const groups=S.groups||{}; const items=Object.entries(groups).filter(([id])=>tabs.some(t=>t.g===id));
    r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('islands.svg')}" alt="Islands"><div class="nx-kicker">ORGANIZE</div><h2>Nova Islands</h2><p class="nx-lead">Spaces son el contexto; Islands, los proyectos dentro de ese contexto.</p><div class="nx-list">${items.map(([id,g])=>`<div class="nx-row"><div class="meta"><b>${esc(g.name)}</b><span>${tabs.filter(t=>t.g===id).length} pestañas</span></div><div class="nx-actions">${btn('Seleccionar',`data-select="${esc(id)}"`)}${btn('Contraer/expandir',`data-toggle="${esc(id)}"`)}${btn('Eliminar',`data-delete="${esc(id)}"`)}</div></div>`).join('')||'<span class="mut">No hay Islands todavía.</span>'}</div><div class="nx-actions">${btn('Crear Island con pestaña actual','id="nx-is-new"','on')}${btn('Abrir Gestor de pestañas','id="nx-tabmgr"')}${btn('Abrir Spaces','id="nx-spaces"')}</div></div>`;
    r.querySelector('#nx-is-new').onclick=async()=>{await N.createIsland(N.currentWebTab?.()||cur);open('islands')};r.querySelector('#nx-tabmgr').onclick=()=>open('pestanas');r.querySelector('#nx-spaces').onclick=()=>open('workspaces');
    r.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{const id=b.dataset.select;const t=tabs.find(x=>x.g===id);if(t)sel(t)});
    r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const g=S.groups[b.dataset.toggle];if(g){g.collapsed=!g.collapsed;save();N.renderGroups?.();N.refreshIslands?.();r.querySelector('#nx-is-new')&&N.PG.islands(r)}});
    r.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{const id=b.dataset.delete;tabs.filter(t=>t.g===id).forEach(t=>t.g=null);delete S.groups[id];save();N.renderGroups?.();N.refreshIslands?.();N.PG.islands(r)});
  };
  N.PG.workspaces = r => {
    const ws= S.novaNext.workspaces;
    const snapshot=()=>tabs.map(t=>{try{const u=t.wv.getURL();return http(u)?{u,g:t.g||'',p:t.el.classList.contains('pin')?1:0}:null}catch{return null}}).filter(Boolean);
    r.innerHTML=`<div class="nx-page"><div class="nx-kicker">CONTEXT</div><h2>Spaces</h2><p class="nx-lead">Guarda un contexto completo y vuelve a él cuando quieras.</p><div class="nx-actions">${btn('Guardar Space actual','id="nx-ws-save"','on')}</div><div class="nx-list">${ws.map((w,i)=>`<div class="nx-row"><div class="meta"><b>${esc(w.name)}</b><span>${w.tabs.length} páginas · ${new Date(w.updated).toLocaleString('es')}</span></div><div class="nx-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Actualizar',`data-refresh="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<span class="mut">Guarda tu primer Space.</span>'}</div></div>`;
    r.querySelector('#nx-ws-save').onclick=async()=>{const name=prompt('Nombre del Space','Trabajo');if(!name)return;ws.unshift({name:name.trim().slice(0,80)||'Space',tabs:snapshot(),updated:Date.now()});save();N.PG.workspaces(r);};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const w=ws[+b.dataset.open];if(!w)return;for(const t of [...tabs]){if(http(t.wv.getURL?.()||''))closeTab(t)};(w.tabs||[]).forEach(s=>{const t=newTab(s.u);if(s.g&&S.groups[s.g])t.g=s.g;if(s.p)t.el.classList.add('pin')});N.enforcePins?.();N.renderGroups?.();save()});
    r.querySelectorAll('[data-refresh]').forEach(b=>b.onclick=()=>{const w=ws[+b.dataset.refresh];if(w){w.tabs=snapshot();w.updated=Date.now();save();N.PG.workspaces(r)}});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ws.splice(+b.dataset.del,1);save();N.PG.workspaces(r)});
  };

  // ---------- Glance ----------
  const oldGlance=N.PG.glance;
  N.PG.glance = r => {
    if(oldGlance) oldGlance(r);
    r.insertAdjacentHTML('afterbegin',`<div class="nx-card"><b>Atajos de Glance</b><span class="mut">Alt + clic sobre cualquier enlace para previsualizarlo. Desde la preview puedes abrir, añadir a Island o salir.</span></div>`);
  };

  // ---------- Focus ----------
  N.stopFocus=()=>{document.body.classList.remove('nova25-focus');S.nova25.focus=false;document.getElementById('nova30-focus-chip')?.remove();save()};
  function startFocus(minutes){N.stopFocus();S.nova25=S.nova25||{};S.nova25.focus=true;document.body.classList.add('nova25-focus');let sec=Math.max(60,minutes*60);const chip=document.createElement('div');chip.id='nova30-focus-chip';chip.className='nova25-mode-chip';document.body.appendChild(chip);const paint=()=>{chip.innerHTML=`✦ <b>Focus</b> · ${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')} ${btn('Salir','id="nx-stopfocus"')}`;chip.querySelector('#nx-stopfocus').onclick=()=>N.stopFocus()};paint();const timer=setInterval(()=>{sec--;paint();if(sec<=0){clearInterval(timer);toast('Focus terminado');N.stopFocus()}},1000);chip._timer=timer;}
  N.PG.focus = r => {r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('focus.svg')}" alt="Focus"><div class="nx-kicker">FOCUS</div><h2>Nova Focus</h2><p class="nx-lead">Menos interfaz durante el trabajo y un descanso al terminar.</p><div class="nx-grid">${card('Deep Focus','25–50 minutos, UI mínima y pestañas secundarias atenuadas.',btn('25 min','data-f="25"','on')+btn('50 min','data-f="50"'))}${card('Study','Focus combinado con Study y Reader+. ',btn('Abrir Study','id="nx-fstudy"'))}${card('Reading','Focus para lecturas largas.',btn('Abrir Reader+','id="nx-fread"'))}</div><div class="nx-actions">${btn('Personalizado','id="nx-fcustom"')}</div></div>`;r.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>startFocus(+b.dataset.f));r.querySelector('#nx-fstudy').onclick=()=>open('study3');r.querySelector('#nx-fread').onclick=()=>open('reader');r.querySelector('#nx-fcustom').onclick=()=>{const m=+prompt('Minutos de Focus','35')||35;startFocus(Math.max(1,Math.min(240,m)))} };

  // ---------- Reader+ real-ish extractor ----------
  N.PG.reader = r => {r.innerHTML=`<div class="nx-reader"><div class="nx-kicker">READING</div><h2>Nova Reader+</h2><p class="nx-lead">Extrae el contenido principal de la página actual y léelo sin el ruido de la web.</p><div class="nx-actions">${btn('Extraer y abrir Reader','id="nx-reader-open"','on')}${btn('Aplicar estilo a la página','id="nx-reader-apply"')}</div><div class="nx-card"><span class="mut">La extracción prioriza &lt;article&gt;, &lt;main&gt; y bloques de texto largos. Si la web usa un layout muy particular, puedes seguir usando el Reader CSS clásico.</span></div></div>`;r.querySelector('#nx-reader-open').onclick=async()=>{const source=currentWeb(); if(!source)return toast('Abre primero una página web'); const raw=await source.wv.executeJavaScript(`(()=>{const root=document.querySelector('article,main')||document.body;const clone=root.cloneNode(true);clone.querySelectorAll('script,style,nav,aside,footer,form,[aria-hidden="true"]').forEach(x=>x.remove());return {title:document.title,text:clone.innerText,html:clone.innerHTML}})()`).catch(()=>null);if(!raw)return toast('No se pudo extraer el contenido');const t=newTab();t.wv.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(raw.title)}</title><style>body{margin:0;background:#f7f7f5;color:#222;font:19px/1.85 Georgia,serif}article{max-width:850px;margin:60px auto;padding:0 24px}h1{font:600 42px/1.2 system-ui,sans-serif}img{max-width:100%}a{color:#1677ff}</style></head><body><article><h1>${esc(raw.title)}</h1>${raw.html}</article></body></html>`));};r.querySelector('#nx-reader-apply').onclick=()=>{const source=currentWeb(); if(!source)return toast('Abre primero una página web'); const css=`body{max-width:900px!important;margin:auto!important;font:18px/1.8 Georgia,serif!important;background:#fafaf8!important}header,nav,aside,footer,form,[role=banner],[class*=sidebar],[class*=recommend]{display:none!important}img,video{max-width:100%!important;height:auto!important}`;source.wv.executeJavaScript(`(()=>{let s=document.getElementById('__nova30_reader');if(!s){s=document.createElement('style');s.id='__nova30_reader';s.textContent=${JSON.stringify(css)};document.head.appendChild(s)}})()`);toast('Reader aplicado');};};

  // ---------- Collections / Reading List ----------
  N.PG.collections = r => {const cols=S.novaNext.collections;r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('collections.svg')}" alt="Colecciones"><div class="nx-kicker">SAVE</div><h2>Colecciones</h2><p class="nx-lead">Guarda páginas, texto y notas por proyecto.</p><div class="nx-actions"><input class="fld" id="nx-col-name" placeholder="Nueva colección"><button class="btn on" id="nx-col-create">Crear</button><button class="btn" id="nx-col-save">Guardar página actual</button></div><div class="nx-grid">${cols.map((c,i)=>card(esc(c.name),`${(c.items||[]).length} elementos`,btn('Abrir',`data-col="${i}"`)+btn('Eliminar',`data-col-del="${i}"`))).join('')||'<span class="mut">Aún no hay colecciones.</span>'}</div><div id="nx-col-detail"></div></div>`;
    const render=i=>{const c=cols[i];const d=r.querySelector('#nx-col-detail');if(!c){d.innerHTML='';return;}d.innerHTML=`<div class="nx-card"><div class="nx-card-head"><b>${esc(c.name)}</b><span class="mut">${c.items.length} elementos</span></div><div class="nx-list">${c.items.map((it,j)=>`<div class="nx-row"><div class="meta"><b>${esc(it.title||it.type||'Elemento')}</b><span>${esc(it.url||it.text||'')}</span></div><div class="nx-actions">${it.url?btn('Abrir',`data-item="${j}"`):''}</div></div>`).join('')||'<span class="mut">Vacía.</span>'}</div></div>`;d.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>newTab(c.items[+b.dataset.item].url));};
    r.querySelector('#nx-col-create').onclick=()=>{const n=r.querySelector('#nx-col-name').value.trim();if(!n)return;cols.unshift({name:n,items:[]});save();N.PG.collections(r)};
    r.querySelector('#nx-col-save').onclick=()=>{const u=currentUrl();if(!u)return toast('Abre una página web para guardarla');if(!cols.length)cols.unshift({name:'Mi colección',items:[]});if(!cols[0].items.some(x=>x.url===u))cols[0].items.unshift({type:'page',title:currentTitle(),url:u,createdAt:Date.now()});save();N.PG.collections(r);render(0);toast('Guardado en '+cols[0].name)};
    r.querySelectorAll('[data-col]').forEach(b=>b.onclick=()=>render(+b.dataset.col));r.querySelectorAll('[data-col-del]').forEach(b=>b.onclick=()=>{cols.splice(+b.dataset.colDel,1);save();N.PG.collections(r)});
  };
  N.PG.reading = r => {const list=S.novaNext.reading;r.innerHTML=`<div class="nx-page"><div class="nx-kicker">READ LATER</div><h2>Reading List</h2><p class="nx-lead">Guarda artículos para leerlos después.</p><div class="nx-actions">${btn('Guardar página actual','id="nx-r-save"','on')}${btn('Limpiar leídos','id="nx-r-clear"')}</div><div class="nx-list">${list.map((x,i)=>`<div class="nx-row"><div class="meta"><b>${esc(x.title)}</b><span>${esc(x.url)}</span></div><div class="nx-actions">${btn('Abrir',`data-open="${i}"`)}${btn(x.read?'No leído':'Marcar leído',`data-read="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<span class="mut">Tu lista está vacía.</span>'}</div></div>`;r.querySelector('#nx-r-save').onclick=()=>{const u=currentUrl();if(!u)return toast('Abre una página');if(!list.some(x=>x.url===u)){list.unshift({title:currentTitle(),url:u,added:Date.now(),read:false});save();N.PG.reading(r)}};r.querySelector('#nx-r-clear').onclick=()=>{for(let i=list.length-1;i>=0;i--)if(list[i].read)list.splice(i,1);save();N.PG.reading(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{list[+b.dataset.open].read=true;save();newTab(list[+b.dataset.open].url);N.PG.reading(r)});r.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{list[+b.dataset.read].read=!list[+b.dataset.read].read;save();N.PG.reading(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.reading(r)});};

  // ---------- Writer / Docs ----------
  const xmlEsc30 = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const blocks30 = html => { const tmp=document.createElement('div'); tmp.innerHTML=html; const out=[]; const walk=(n,tag='p',runs=[],b=false,i=false)=>{ if(n.nodeType===3){ if(n.textContent) runs.push({t:n.textContent,b,i}); return; } if(n.nodeType!==1)return; const t=n.tagName.toLowerCase(); const heading=['h1','h2','h3'].includes(t)?t:'p'; let rr=runs; let bb=b,ii=i; if(['p','div','h1','h2','h3','li'].includes(t)){ if(rr.length) out.push({tag,runs:rr}); rr=[]; tag=heading; bb=false;ii=false; if(t==='li')rr.push({t:'• ',b:false,i:false}); } if(t==='strong'||t==='b')bb=true; if(t==='em'||t==='i')ii=true; n.childNodes.forEach(x=>walk(x,tag,rr,bb,ii)); if(['p','div','h1','h2','h3','li'].includes(t)&&rr.length) out.push({tag,runs:rr}); }; walk(tmp); return out.length?out:[{tag:'p',runs:[{t:tmp.textContent||'',b:false,i:false}]}]; };
  const buildDocXml30 = (html) => { const blocks=blocks30(html); return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${blocks.map(x=>`<w:p>${x.tag!=='p'?`<w:pPr><w:pStyle w:val="${x.tag}"/></w:pPr>`:''}${x.runs.map(run=>`<w:r><w:rPr>${run.b?'<w:b/>':''}${run.i?'<w:i/>':''}</w:rPr><w:t xml:space="preserve">${xmlEsc30(run.t)}</w:t></w:r>`).join('')}</w:p>`).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`; };
  const defaultDoc=() => {return {id:'d'+Date.now().toString(36),title:'Nuevo documento',html:'<h1>Nuevo documento</h1><p>Empieza a escribir aquí…</p>',updated:Date.now()};}
  N.PG.writer = r => {let active=S.novaNext.docs.find(d=>d.id===S.novaNext.activeDoc)||S.novaNext.docs[0];if(!active){active=defaultDoc();S.novaNext.docs.unshift(active)}S.novaNext.activeDoc=active.id;save();r.innerHTML=`<div class="nx-page"><div class="nx-kicker">CREATE</div><div class="row"><div><h2>Nova Writer</h2><p class="nx-lead">Editor local, documentos múltiples y exportación real a Word.</p></div></div><div class="nx-toolbar">${btn('<b>B</b>','data-cmd="bold"')}${btn('<i>I</i>','data-cmd="italic"')}${btn('H1','data-cmd="formatBlock" data-val="h1"')}${btn('H2','data-cmd="formatBlock" data-val="h2"')}${btn('• Lista','data-cmd="insertUnorderedList"')}${btn('🔗','id="nx-link"')}${btn('Nuevo','id="nx-new"')}${btn('Guardar','id="nx-save"','on')}${btn('DOCX','id="nx-docx"')}${btn('HTML','id="nx-html"')}</div><div class="nx-editor" id="nx-ed" contenteditable="true">${active.html}</div><div class="mut">Último guardado: ${new Date(active.updated).toLocaleString('es')} · <span id="nx-count"></span></div></div>`;const ed=r.querySelector('#nx-ed');const update=()=>{active.html=ed.innerHTML;active.title=(ed.querySelector('h1')?.innerText||active.title||'Documento').trim().slice(0,100);active.updated=Date.now();r.querySelector('#nx-count').textContent=(ed.innerText.trim().match(/\S+/g)||[]).length+' palabras';save()};r.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{document.execCommand(b.dataset.cmd,false,b.dataset.val||null);ed.focus();update()});r.querySelector('#nx-link').onclick=()=>{const u=prompt('URL','https://');if(u)document.execCommand('createLink',false,u);ed.focus();update()};r.querySelector('#nx-new').onclick=()=>{const d=defaultDoc();S.novaNext.docs.unshift(d);S.novaNext.activeDoc=d.id;save();N.PG.writer(r)};r.querySelector('#nx-save').onclick=()=>{update();toast('Documento guardado')};r.querySelector('#nx-docx').onclick=async()=>{update();const f=await ipc.invoke('save-docx',{title:active.title||'Nova Documento',documentXml:buildDocXml30(active.html)}).catch(()=>null);toast(f?'Word guardado en '+f:'No se pudo guardar el Word')};r.querySelector('#nx-html').onclick=async()=>{update();const html='<!doctype html><html><head><meta charset="utf-8"><title>'+esc(active.title)+'</title></head><body>'+active.html+'</body></html>';const f=await ipc.invoke('save-text',{name:active.title||'Nova Documento',ext:'html',content:html}).catch(()=>null);toast(f?'HTML guardado en '+f:'No se pudo guardar HTML')};ed.oninput=update;update();};
  N.PG.docs = r => {const docs=S.novaNext.docs;r.innerHTML=`<div class="nx-page"><div class="nx-kicker">DOCUMENTS</div><h2>Nova Docs</h2><p class="nx-lead">Tus documentos locales, sin esconderte el archivo en ninguna nube.</p><div class="nx-actions">${btn('Nuevo documento','id="nx-doc-new"','on')}${btn('Abrir Writer','id="nx-doc-writer"')}</div><div class="nx-list">${docs.map((d,i)=>`<div class="nx-row"><div class="meta"><b>${esc(d.title)}</b><span>${new Date(d.updated).toLocaleString('es')}</span></div><div class="nx-actions">${btn('Editar',`data-edit="${i}"`)}${btn('DOCX',`data-dl="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<span class="mut">No hay documentos.</span>'}</div></div>`;r.querySelector('#nx-doc-new').onclick=()=>{const d=defaultDoc();docs.unshift(d);S.novaNext.activeDoc=d.id;save();open('writer')};r.querySelector('#nx-doc-writer').onclick=()=>open('writer');r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{S.novaNext.activeDoc=docs[+b.dataset.edit].id;save();open('writer')});r.querySelectorAll('[data-dl]').forEach(b=>b.onclick=async()=>{const d=docs[+b.dataset.dl];const f=await ipc.invoke('save-docx',{title:d.title,documentXml:buildDocXml30(d.html)}).catch(()=>null);toast(f?'Word guardado en '+f:'No se pudo guardar el Word')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{docs.splice(+b.dataset.del,1);save();N.PG.docs(r)});};

  // ---------- Study 3 ----------
  N.PG.study3 = r => {r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('study.svg')}" alt="Study"><div class="nx-kicker">RESEARCH</div><h2>Nova Study 3</h2><p class="nx-lead">Une Web, Reader+, Collections, Notes y Writer en un mismo flujo.</p><div class="nx-grid">${card('1 · Captura','Guarda la página actual.',btn('Guardar en colección','id="nx-study-col"','on')+btn('Reading List','id="nx-study-read"'))}${card('2 · Comprende','Extrae o pregunta por el contenido.',btn('Reader+','id="nx-study-reader"')+btn('Nova IA','id="nx-study-ai"'))}${card('3 · Crea','Llévalo a un documento.',btn('Writer','id="nx-study-writer"'))}</div><div class="nx-card"><b>Flujo</b><span class="mut">Web → Reader → Collection/Reading List → Writer → DOCX</span></div></div>`;r.querySelector('#nx-study-col').onclick=()=>open('collections');r.querySelector('#nx-study-read').onclick=()=>open('reading');r.querySelector('#nx-study-reader').onclick=()=>open('reader');r.querySelector('#nx-study-ai').onclick=()=>N.toggleAI?.();r.querySelector('#nx-study-writer').onclick=()=>open('writer')};

  // ---------- Privacy / Performance / Downloads ----------
  N.PG.privacidad2 = r => {r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('privacy.svg')}" alt="Privacy"><div class="nx-kicker">SYSTEM</div><h2>Centro de privacidad</h2><p class="nx-lead">Controles principales juntos y estado visible.</p><div class="nx-grid">${card('Bloqueador',S.adblock?'Activo':'Desactivado',btn(S.adblock?'Desactivar':'Activar','id="nx-ad"','on'))}${card('Datos','Historial, cookies y caché.',btn('Limpiar ahora','id="nx-clear"'))}${card('Permisos','Cámara, micro, ubicación y notificaciones.',btn('Abrir ajustes','id="nx-perm"'))}</div><div class="nx-stat"><span class="nx-chip">HTTPS bloqueado: sí</span><span class="nx-chip">Webviews sandbox: sí</span><span class="nx-chip">Node Integration webview: no</span></div></div>`;r.querySelector('#nx-ad').onclick=async()=>{S.adblock=!S.adblock;await ipc.invoke('adblock',S.adblock).catch(()=>{});save();N.PG.privacidad2(r)};r.querySelector('#nx-clear').onclick=async()=>{S.hist=[];save();await ipc.invoke('clear').catch(()=>{});toast('Datos de navegación limpiados')};r.querySelector('#nx-perm').onclick=()=>open('ajustes')};
  N.PG.rendimiento2 = async r => {const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));const tabCount=Array.isArray(d?.tabs)?d.tabs.length:0;const rss=d?.main?.rssKB?Math.round(d.main.rssKB/1024):null;const pid=d?.main?.pid??'—';r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('performance.svg')}" alt="Performance"><div class="nx-kicker">SYSTEM</div><h2>Centro de rendimiento</h2><p class="nx-lead">Memoria, pestañas y optimización desde un solo lugar.</p><div class="nx-stat">${d?.ok?`<span class="nx-chip"><strong>${tabCount}</strong> pestañas web</span><span class="nx-chip"><strong>${rss??'—'} MB</strong> Nova RSS</span><span class="nx-chip"><strong>${pid}</strong> PID</span>`:'<span class="nx-chip">Telemetría no disponible</span>'}</div><div class="nx-actions">${btn('Alternar Smart Memory','id="nx-smart"','on')}${btn('Limpiar caché','id="nx-cache"')}${btn('Gestor de pestañas','id="nx-tab"')}</div></div>`;r.querySelector('#nx-smart').onclick=async()=>{const ok=await ipc.invoke('performance-mode',!S.nova30Perf).catch(()=>false);if(ok){S.nova30Perf=!S.nova30Perf;save();toast(S.nova30Perf?'Smart Memory activo':'Smart Memory desactivado')}};r.querySelector('#nx-cache').onclick=async()=>{toast(await ipc.invoke('performance-cache').catch(()=>false)?'Caché limpiada':'No se pudo limpiar')};r.querySelector('#nx-tab').onclick=()=>open('pestanas')};
  N.PG.descargas2 = r => {const d=S.dls||[];r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('downloads.svg')}" alt="Downloads"><div class="nx-kicker">FILES</div><h2>Download Hub</h2><p class="nx-lead">Descargas con estado, búsqueda y acceso rápido a la carpeta.</p><div class="nx-stat"><span class="nx-chip"><strong>${d.length}</strong> registradas</span><span class="nx-chip"><strong>${d.filter(x=>x.state==='completed').length}</strong> completadas</span></div><div class="nx-list">${d.slice(0,60).map(x=>`<div class="nx-row"><div class="meta"><b>${esc(x.name)}</b><span>${esc(x.state||'')} · ${x.total?Math.round(x.recv/x.total*100):0}%</span></div><div class="nx-actions">${btn('Mostrar',`data-show="${esc(x.path||'')}"`)}${x.state==='progressing'||x.state==='paused'?btn(x.state==='paused'?'Reanudar':'Pausar',`data-ctl="${x.id}" data-a="${x.state==='paused'?'resume':'pause'}"`):''}</div></div>`).join('')||'<span class="mut">No hay descargas todavía.</span>'}</div><div class="nx-actions">${btn('Abrir carpeta','id="nx-dl-folder"','on')}</div></div>`;r.querySelector('#nx-dl-folder').onclick=()=>ipc.invoke('open-downloads-folder').then(ok=>!ok&&toast('No se pudo abrir la carpeta'));r.querySelectorAll('[data-show]').forEach(b=>b.onclick=()=>ipc.invoke('show-in-folder',b.dataset.show));r.querySelectorAll('[data-ctl]').forEach(b=>b.onclick=()=>{ipc.send('dl-ctl',{id:+b.dataset.ctl,a:b.dataset.a});setTimeout(()=>N.PG.descargas2(r),200)});};

  // ---------- Web Apps / Panels ----------
  N.PG.apps = r => {const apps=S.novaNext.apps;r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('apps.svg')}" alt="Nova Apps"><div class="nx-kicker">APPS</div><h2>Nova Apps</h2><p class="nx-lead">Convierte una web en una ventana propia de Nova.</p><div class="nx-actions"><input class="fld" id="nx-app-url" placeholder="https://ejemplo.com"><input class="fld" id="nx-app-name" placeholder="Nombre"><button class="btn on" id="nx-app-add">Añadir</button></div><div class="nx-list">${apps.map((a,i)=>`<div class="nx-row"><div class="meta"><b>${esc(a.name)}</b><span>${esc(a.url)}</span></div><div class="nx-actions">${btn('Abrir app',`data-open-app="${i}"`)}${btn('Web normal',`data-open-web="${i}"`)}${btn('Eliminar',`data-del-app="${i}"`)}</div></div>`).join('')||'<span class="mut">Añade tu primera app.</span>'}</div></div>`;r.querySelector('#nx-app-add').onclick=()=>{const u=http(r.querySelector('#nx-app-url').value);const n=r.querySelector('#nx-app-name').value.trim()||u;if(!u)return toast('URL inválida');apps.unshift({name:n,url:u,createdAt:Date.now()});save();N.PG.apps(r)};r.querySelectorAll('[data-open-app]').forEach(b=>b.onclick=()=>ipc.invoke('launch-web-app',apps[+b.dataset.openApp]));r.querySelectorAll('[data-open-web]').forEach(b=>b.onclick=()=>newTab(apps[+b.dataset.openWeb].url));r.querySelectorAll('[data-del-app]').forEach(b=>b.onclick=()=>{apps.splice(+b.dataset.delApp,1);save();N.PG.apps(r)})};
  N.PG.panels = r => {const p=S.novaNext.panels;r.innerHTML=`<div class="nx-page"><div class="nx-kicker">SIDE TOOLS</div><h2>Web Panels</h2><p class="nx-lead">Fija pequeñas webs de consulta sin cambiar tu página principal.</p><div class="nx-actions"><input class="fld" id="nx-panel-url" placeholder="https://github.com"><input class="fld" id="nx-panel-name" placeholder="Nombre"><button class="btn on" id="nx-panel-add">Añadir</button></div><div class="nx-webpanel"><div class="nx-list">${p.map((x,i)=>`<button class="btn" data-panel="${i}">${esc(x.name)}</button>`).join('')||'<span class="mut">No hay paneles.</span>'}</div><div id="nx-panel-view"><span class="mut">Selecciona un panel.</span></div></div></div>`;const show=i=>{const x=p[i];if(!x)return;r.querySelector('#nx-panel-view').innerHTML=`<webview id="nx-pwv" partition="${esc(N.profilePartition?.()||'persist:web')}" src="${esc(x.url)}"></webview>`};r.querySelector('#nx-panel-add').onclick=()=>{const u=http(r.querySelector('#nx-panel-url').value);if(!u)return toast('URL inválida');p.unshift({name:r.querySelector('#nx-panel-name').value.trim()||u,url:u});save();N.PG.panels(r);show(0)};r.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>show(+b.dataset.panel))};

  // ---------- Picture-in-Picture ----------
  N.PG.pip = r => { r.innerHTML=`<div class="nx-page"><div class="nx-kicker">MEDIA</div><h2>Picture-in-Picture</h2><p class="nx-lead">Saca el vídeo activo a una ventana flotante cuando la web lo permita.</p><div class="nx-actions">${btn('Activar PiP en el vídeo activo','id="nx-pip-on"','on')}${btn('Salir de PiP','id="nx-pip-off"')}</div><div class="nx-card"><span class="mut">Nova busca el primer vídeo apto en la pestaña actual. Algunas webs desactivan PiP por política propia.</span></div></div>`;r.querySelector('#nx-pip-on').onclick=async()=>{const ok=await (N.currentWebTab?.()||cur)?.wv?.executeJavaScript?.(`(async()=>{const v=[...document.querySelectorAll('video')].find(x=>x.readyState>=2&&x.videoWidth>0);if(!v)return false;try{await v.requestPictureInPicture();return true}catch{return false}})()`).catch(()=>false);toast(ok?'PiP activado':'No se encontró un vídeo compatible')};r.querySelector('#nx-pip-off').onclick=async()=>{const ok=await (N.currentWebTab?.()||cur)?.wv?.executeJavaScript?.(`(async()=>{try{if(!document.pictureInPictureElement)return false;await document.exitPictureInPicture();return true}catch{return false}})()`).catch(()=>false);toast(ok?'PiP cerrado':'No hay PiP activo')}; };

  // ---------- Media Hub ----------
  N.PG.media = r => {const playing=tabs.filter(t=>t.el.classList.contains('aud')||t.el.classList.contains('muted'));r.innerHTML=`<div class="nx-page"><div class="nx-kicker">MEDIA</div><h2>Media Hub</h2><p class="nx-lead">Controla las pestañas que tienen sonido o vídeo activo.</p><div class="nx-list">${playing.map((t,i)=>`<div class="nx-row"><div class="meta"><b>${esc(t.el.querySelector('span')?.textContent||'Pestaña')}</b><span>${esc(t.wv.getURL?.()||'')}</span></div><div class="nx-actions">${btn('Activar/pausar',`data-media="${tabs.indexOf(t)}"`)}${btn('Silenciar',`data-mute="${tabs.indexOf(t)}"`)}</div></div>`).join('')||'<span class="mut">No hay pestañas con audio ahora mismo.</span>'}</div></div>`;r.querySelectorAll('[data-media]').forEach(b=>b.onclick=()=>{const t=tabs[+b.dataset.media];if(t?.wv?.isCurrentlyAudible?.())t.wv.setAudioMuted?.(!t.wv.isAudioMuted?.());else t?.wv?.executeJavaScript?.('document.querySelectorAll("video,audio").forEach(v=>v.paused?v.play().catch(()=>{}):v.pause())');N.PG.media(r)});r.querySelectorAll('[data-mute]').forEach(b=>{const t=tabs[+b.dataset.mute];if(t) t.wv.setAudioMuted(!t.wv.isAudioMuted());N.PG.media(r)})};

  // ---------- Tab manager + snooze ----------
  N.snooze = (t,ms)=>{if(!t)return;const u=http(t.wv.getURL?.()||'');if(!u)return toast('Solo se pueden posponer páginas web');S.novaNext.snoozed.push({u,title:t.el.querySelector('span')?.textContent||u,due:Date.now()+ms});save();closeTab(t);toast('Pestaña pospuesta')};
  setInterval(()=>{const now=Date.now();const due=S.novaNext.snoozed.filter(x=>x.due<=now);if(!due.length)return;S.novaNext.snoozed=S.novaNext.snoozed.filter(x=>x.due>now);due.forEach(x=>newTab(x.u));save()},15000);
  N.PG.pestanas = r => {r.innerHTML=`<div class="nx-page"><div class="nx-kicker">TABS</div><h2>Gestor de pestañas</h2><p class="nx-lead">Busca, mueve y pospone pestañas sin perderte.</p><div class="nx-actions"><input class="fld" id="nx-tab-q" placeholder="Buscar pestaña o URL"><button class="btn" id="nx-tab-all">Cerrar otras</button></div><div class="nx-list" id="nx-tab-list"></div><div class="nx-card"><b>Pestañas pospuestas</b><div class="nx-list" style="margin-top:8px">${S.novaNext.snoozed.map(x=>`<div class="nx-row"><div class="meta"><b>${esc(x.title)}</b><span>Vuelve ${new Date(x.due).toLocaleString('es')}</span></div><div class="nx-actions"><button class="btn" data-unsnooze="${esc(x.u)}">Abrir ahora</button></div></div>`).join('')||'<span class="mut">Ninguna.</span>'}</div></div></div>`;const draw=()=>{const q=r.querySelector('#nx-tab-q').value.toLowerCase();r.querySelector('#nx-tab-list').innerHTML=tabs.filter(t=>{try{return (t.el.textContent+' '+t.wv.getURL()).toLowerCase().includes(q)}catch{return false}}).map((t,i)=>`<div class="nx-row"><div class="meta"><b>${esc(t.el.querySelector('span')?.textContent||'Pestaña')}</b><span>${esc(t.wv.getURL?.()||'')}</span></div><div class="nx-actions">${btn('Ir',`data-jump="${tabs.indexOf(t)}"`)}${btn('Posponer',`data-snooze="${tabs.indexOf(t)}"`)}${btn(t.el.classList.contains('pin')?'Desfijar':'Fijar',`data-pin="${tabs.indexOf(t)}"`)}</div></div>`).join('')};r.querySelector('#nx-tab-q').oninput=draw;r.querySelector('#nx-tab-all').onclick=()=>tabs.filter(t=>t!==cur&&!t.el.classList.contains('pin')).forEach(closeTab);draw();r.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>sel(tabs[+b.dataset.jump]));r.querySelectorAll('[data-snooze]').forEach(b=>b.onclick=()=>N.snooze(tabs[+b.dataset.snooze],60*60*1000));r.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{const t=tabs[+b.dataset.pin];if(t){t.el.classList.toggle('pin');if(t.el.classList.contains('pin')){t.g=null;N.enforcePins?.()}N.renderGroups?.();N.PG.pestanas(r)}});r.querySelectorAll('[data-unsnooze]').forEach(b=>{b.onclick=()=>{const i=S.novaNext.snoozed.findIndex(x=>x.u===b.dataset.unsnooze);if(i>=0){const x=S.novaNext.snoozed.splice(i,1)[0];save();newTab(x.u);N.PG.pestanas(r)}}});};

  // ---------- Session manager ----------
  N.PG.sesiones = r => {const key='sessionSnapshots';S.novaNext[key]=Array.isArray(S.novaNext[key])?S.novaNext[key]:[];const list=S.novaNext[key];const snap=()=>tabs.map(t=>{const u=http(t.wv.getURL?.()||'');return u?{u,title:t.el.querySelector('span')?.textContent||u}:null}).filter(Boolean);r.innerHTML=`<div class="nx-page"><div class="nx-kicker">RECOVER</div><h2>Sesiones</h2><p class="nx-lead">Guarda la ventana actual y restaúrala después.</p><div class="nx-actions">${btn('Guardar sesión','id="nx-sess-save"','on')}${btn('Restaurar última','id="nx-sess-last"')}</div><div class="nx-list">${list.map((s,i)=>`<div class="nx-row"><div class="meta"><b>${esc(s.name)}</b><span>${s.tabs.length} pestañas</span></div><div class="nx-actions">${btn('Restaurar',`data-restore-s="${i}"`)}${btn('Eliminar',`data-del-s="${i}"`)}</div></div>`).join('')||'<span class="mut">No hay sesiones guardadas.</span>'}</div></div>`;const restore=i=>{const s=list[i];if(!s)return;for(const t of [...tabs]){if(http(t.wv.getURL?.()||''))closeTab(t)};(s.tabs||[]).forEach(x=>newTab(x.u));};r.querySelector('#nx-sess-save').onclick=()=>{const name=prompt('Nombre de la sesión','Sesión '+new Date().toLocaleDateString('es'));if(!name)return;list.unshift({name:name.slice(0,80),tabs:snap(),created:Date.now()});save();N.PG.sesiones(r)};r.querySelector('#nx-sess-last').onclick=()=>list[0]&&restore(0);r.querySelectorAll('[data-restore-s]').forEach(b=>b.onclick=()=>restore(+b.dataset.restoreS));r.querySelectorAll('[data-del-s]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.delS,1);save();N.PG.sesiones(r)})};

  // ---------- QR / Backup / Shortcuts / Send / Improvements ----------
  N.PG.qr = r => {const u=currentUrl()||location.href;const qr=`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(u)}`;r.innerHTML=`<div class="nx-page"><div class="nx-kicker">SHARE</div><h2>Compartir con QR</h2><p class="nx-lead">Escanea desde otro dispositivo para abrir esta página.</p><div class="nx-qr"><img src="${qr}" alt="QR"><div class="nx-card"><b>${esc(currentTitle())}</b><span class="mut">${esc(u)}</span><div class="nx-actions">${btn('Copiar URL','id="nx-qr-copy"','on')}${btn('Abrir imagen QR','id="nx-qr-open"')}</div></div></div></div>`;r.querySelector('#nx-qr-copy').onclick=async()=>{try{await navigator.clipboard.writeText(u);toast('URL copiada')}catch{toast('No se pudo copiar')}};r.querySelector('#nx-qr-open').onclick=()=>newTab(qr)};
  N.PG.backup = r => {r.innerHTML=`<div class="nx-page"><div class="nx-kicker">DATA</div><h2>Backup & Restore</h2><p class="nx-lead">Exporta o restaura la configuración de Nova. Las claves no se incluyen.</p><div class="nx-actions">${btn('Exportar backup','id="nx-bak-out"','on')}<label class="btn">Importar backup<input type="file" id="nx-bak-in" accept=".json" hidden></label><button class="btn" id="nx-bak-reset">Crear copia local</button></div><div class="nx-code" id="nx-bak-preview"></div></div>`;const safe={...S};delete safe.key;delete safe.novaNext?.sessionSnapshots;r.querySelector('#nx-bak-preview').textContent=JSON.stringify({version:'3.0.1',keys:Object.keys(safe).length},null,2);r.querySelector('#nx-bak-out').onclick=async()=>{const f=await ipc.invoke('save-text',{name:'Nova-Backup',ext:'json',content:JSON.stringify(safe,null,2)}).catch(()=>null);toast(f?'Backup guardado en '+f:'No se pudo guardar')};r.querySelector('#nx-bak-in').onchange=e=>{const file=e.target.files?.[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const x=JSON.parse(rd.result);if(!x||typeof x!=='object')throw new Error();delete x.key;Object.assign(S,x);save();location.reload()}catch{toast('Backup no válido')}};rd.readAsText(file)};r.querySelector('#nx-bak-reset').onclick=async()=>{const f=await ipc.invoke('state-save',JSON.stringify(safe)).catch(()=>false);toast(f?'Copia local creada':'No se pudo crear')};};
  N.PG.shortcuts = r => {const sc=[['Ctrl/Cmd + K','Command Center'],['Ctrl/Cmd + L','Barra de direcciones'],['Ctrl/Cmd + T','Nueva pestaña'],['Ctrl/Cmd + W','Cerrar pestaña'],['Ctrl/Cmd + Shift + T','Reabrir pestaña'],['Ctrl/Cmd + F','Buscar en página'],['Alt + clic','Glance'],['Ctrl/Cmd + Shift + N','Nueva Island']];r.innerHTML=`<div class="nx-page"><div class="nx-kicker">CONTROL</div><h2>Atajos</h2><p class="nx-lead">Comandos rápidos, con una pequeña capa de personalización.</p><div class="nx-list">${sc.map(x=>`<div class="nx-row"><div class="meta"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div></div>`).join('')}</div><div class="nx-card"><b>Command Center</b><span class="mut">Tecla con Ctrl/Cmd para abrirlo.</span><input class="fld" id="nx-cmd-key" maxlength=1 value="${esc(S.novaNext.customShortcuts.cmd)}"><div class="nx-actions">${btn('Guardar atajo','id="nx-save-shortcut"','on')} ${btn(S.novaNext.verticalTabs?'Desactivar pestañas verticales':'Activar pestañas verticales','id="nx-vertical"')}</div></div><div class="nx-card"><b>Comportamiento fijo</b><span class="mut">La barra de pestañas horizontal, Ctrl/Cmd+L, T/W/F y clic central mantienen el comportamiento familiar de Chromium.</span></div></div>`;r.querySelector('#nx-save-shortcut').onclick=()=>{const k=(r.querySelector('#nx-cmd-key').value||'k').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,1)||'k';S.novaNext.customShortcuts.cmd=k;save();toast('Atajo guardado: Ctrl/Cmd + '+k)};r.querySelector('#nx-vertical').onclick=()=>{S.novaNext.verticalTabs=!S.novaNext.verticalTabs;document.body.classList.toggle('nova30-vertical',S.novaNext.verticalTabs);save();r.querySelector('#nx-vertical').textContent=S.novaNext.verticalTabs?'Desactivar pestañas verticales':'Activar pestañas verticales'};};
  N.PG.send = r => {const u=currentUrl();r.innerHTML=`<div class="nx-page"><div class="nx-kicker">SHARE</div><h2>Nova Send</h2><p class="nx-lead">Envía la página actual a otra parte de Nova sin salir de ella.</p><div class="nx-grid">${card('Colección','Guárdala en tu primera colección.',btn('Enviar','id="nx-send-col"','on'))}${card('Reading List','Déjala para después.',btn('Enviar','id="nx-send-read"'))}${card('Study','Abre el espacio de investigación.',btn('Enviar','id="nx-send-study"'))}${card('Writer','Crea un documento a partir de la URL.',btn('Enviar','id="nx-send-writer"'))}</div></div>`;r.querySelector('#nx-send-col').onclick=()=>{if(!u)return toast('Abre una página');if(!S.novaNext.collections.length)S.novaNext.collections.unshift({name:'Mi colección',items:[]});S.novaNext.collections[0].items.unshift({type:'page',title:currentTitle(),url:u,createdAt:Date.now()});save();toast('Enviado a '+S.novaNext.collections[0].name)};r.querySelector('#nx-send-read').onclick=()=>{if(!u)return toast('Abre una página');if(!S.novaNext.reading.some(x=>x.url===u))S.novaNext.reading.unshift({title:currentTitle(),url:u,added:Date.now(),read:false});save();toast('Añadido a Reading List')};r.querySelector('#nx-send-study').onclick=()=>open('study3');r.querySelector('#nx-send-writer').onclick=()=>{const d=defaultDoc();d.html='<h1>'+esc(currentTitle())+'</h1><p>'+esc(u)+'</p>';S.novaNext.docs.unshift(d);S.novaNext.activeDoc=d.id;save();open('writer')};};
  const oldMejoras=N.PG.mejoras; if(oldMejoras)N.PG.mejoras= r=>{oldMejoras(r);r.insertAdjacentHTML('afterbegin',`<div class="nx-card"><b>Feedback local</b><span class="mut">Los votos de esta versión se guardan localmente. Usa el botón de GitHub para enviar una propuesta global.</span></div>`) };

  // ---------- Command Center ----------
  const baseActions = () => [
    ['Nueva pestaña',()=>newTab()],['Cerrar pestaña',()=>cur&&closeTab(cur)],['Reabrir pestaña',()=>N.reopen?.()],['Buscar pestaña',()=>open('pestanas')],
    ['Safari Air',()=>open('safari')],['Nova Islands',()=>open('islands')],['Spaces',()=>open('workspaces')],['Glance',()=>open('glance')],['Focus',()=>open('focus')],['Reader+',()=>open('reader')],
    ['Reading List',()=>open('reading')],['Nova Writer',()=>open('writer')],['Nova Docs',()=>open('docs')],['Study 3',()=>open('study3')],['Colecciones',()=>open('collections')],['Nova Send',()=>open('send')],
    ['Privacy Center',()=>open('privacidad2')],['Performance Center',()=>open('rendimiento2')],['Download Hub',()=>open('descargas2')],['Nova Apps',()=>open('apps')],['Web Panels',()=>open('panels')],['Media Hub',()=>open('media')],
    ['QR',()=>open('qr')],['Picture-in-Picture',()=>open('pip')],['Backup & Restore',()=>open('backup')],['Atajos',()=>open('shortcuts')],['Mejoras',()=>open('mejoras')],['Novedades',()=>open('novedades')],['Ajustes',()=>open('ajustes')],
    ['Activar/Desactivar Safari',()=>applySafari(!S.novaNext.safari)],['Activar Focus 25 min',()=>startFocus(25)],['Guardar página en Reading List',()=>{if(currentUrl())S.novaNext.reading.unshift({title:currentTitle(),url:currentUrl(),added:Date.now(),read:false});save();toast('Guardado en Reading List')}]
  ];
  N.ACTIONS=baseActions;
  function palette(){
    document.getElementById('nova30-cmd')?.remove();
    const ov=document.createElement('div');ov.id='nova30-cmd';ov.className='nx-modal';ov.innerHTML=`<div class="nx-dialog nx-command"><div class="row"><b>Command Center</b><span class="mut">Ctrl/Cmd + K</span></div><input class="fld" id="nx-cmd-q" placeholder="Busca una acción, pestaña, página o URL…" autofocus><div id="nx-cmd-results"></div></div>`;document.body.appendChild(ov);const input=ov.querySelector('#nx-cmd-q'),out=ov.querySelector('#nx-cmd-results');const acts=baseActions();const render=()=>{const q=input.value.toLowerCase().trim();const results=[];for(const [label,fn] of acts){if(!q||label.toLowerCase().includes(q))results.push({label,fn,sub:'Acción'})}tabs.forEach((t,i)=>{try{const label=t.el.querySelector('span')?.textContent||'Pestaña';const u=t.wv.getURL();if(!q||label.toLowerCase().includes(q)||u.toLowerCase().includes(q))results.push({label,fn:()=>sel(t),sub:'Pestaña'})}catch{}});out.innerHTML=results.slice(0,14).map((x,i)=>`<div class="nx-result ${i===0?'sel':''}" data-r="${i}"><span>${esc(x.label)}</span><small>${esc(x.sub)}</small></div>`).join('')||'<span class="mut">Nada encontrado.</span>';out.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const x=results[+b.dataset.r];ov.remove();x?.fn?.()})};input.oninput=render;ov.onclick=e=>{if(e.target===ov)ov.remove()};document.addEventListener('keydown',function close(e){if(!document.getElementById('nova30-cmd')){document.removeEventListener('keydown',close);return}if(e.key==='Escape'){ov.remove();document.removeEventListener('keydown',close)}});render();
  }
  N.palette=palette;
  N.newTab = newTab; N.closeTab = closeTab; N.selectTab = sel;
  N.reopen = N.reopen || (typeof reopen === 'function' ? reopen : null);
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===S.novaNext.customShortcuts.cmd){e.preventDefault();palette()}});

  // ---------- Global routes / commands ----------
  const aliases={about:'acerca',settings:'ajustes',setting:'ajustes',preferences:'ajustes',preference:'ajustes',privacy:'privacidad2',security:'seguridad',performance:'rendimiento2',rendimiento:'rendimiento2',downloads:'descargas2',download:'descargas2',history:'historial',notes:'notas',bookmarks:'marcadores',favorites:'marcadores',study:'study3',feedback:'mejoras',improvements:'mejoras',news:'novedades',welcome:'bienvenida',start:'bienvenida',migrate:'migrar',work:'workspaces',workspace:'workspaces',tabs:'pestanas',sessions:'sesiones',readinglist:'reading',qrshare:'qr',mediahub:'media',webpanels:'panels',backuprestore:'backup',capture:'capture',ai:'ia'};
  const oldResolve=N.resolveFeatureRoute;N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]|| (N.PG[raw]?raw:(oldResolve?oldResolve(raw):raw))};

  // ---------- New Tab refresh ----------
  const oldNT=window.NT;
  N.PG.novedades = r => {r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('onboarding.svg')}" alt="Novedades"><div class="nx-kicker">NOVA 3.0</div><h2>Novedades 3.0.1</h2><p class="nx-lead">Calm surface. Powerful inside.</p><div class="nx-grid">${[['islands.svg','Islands + Spaces','Organización contextual.'],['writer.svg','Writer + Docs','Documentos locales y Word.'],['focus.svg','Focus','Temporizador y superficie mínima.'],['privacy.svg','System','Privacy, Performance, Downloads y Backup.'],['apps.svg','Nova Apps','Webs en ventanas propias.'],['study.svg','Study 3','Investiga y crea sin salir de Nova.']].map(x=>card(x[1],x[2],`<img src="${local(x[0])}" style="width:100%;border-radius:12px" alt=""><div class="nx-actions">${btn('Abrir',`data-news="${esc(x[1])}"`)}</div>`)).join('')}</div><div class="nx-card"><b>¿Algo no va bien?</b><span class="mut">Abre nova://mejoras y cuéntanos qué cambiarías.</span></div></div>`;const map={'Islands + Spaces':'islands','Writer + Docs':'writer','Focus':'focus','System':'privacidad2','Nova Apps':'apps','Study 3':'study3'};r.querySelectorAll('[data-news]').forEach(b=>b.onclick=()=>open(map[b.dataset.news]))};
  N.PG.bienvenida = r => {r.innerHTML=`<div class="nx-page"><img class="nx-hero" src="${local('onboarding.svg')}" alt="Bienvenido a Nova 3.0"><div class="nx-kicker">WELCOME</div><h2>Bienvenido a Nova 3.0</h2><p class="nx-lead">Air en la superficie. Safari para navegar. Zen para organizar. Power cuando lo necesitas.</p><div class="nx-grid">${card('1 · Navega','Usa Safari Air o Nova Air.',btn('Safari Air','id="nx-w-saf"','on'))}${card('2 · Organiza','Spaces para contexto e Islands para proyectos.',btn('Abrir Spaces','id="nx-w-ws"')+btn('Abrir Islands','id="nx-w-is"'))}${card('3 · Crea','Writer, Docs y Study.',btn('Abrir Writer','id="nx-w-wr"'))}${card('4 · Mejora','Dinos qué falta o qué sobra.',btn('Abrir Mejoras','id="nx-w-im"'))}</div><div class="nx-actions">${btn('Empezar a navegar','id="nx-w-start"','on')}${btn('Abrir Command Center','id="nx-w-cmd"')}</div></div>`;r.querySelector('#nx-w-saf').onclick=()=>open('safari');r.querySelector('#nx-w-ws').onclick=()=>open('workspaces');r.querySelector('#nx-w-is').onclick=()=>open('islands');r.querySelector('#nx-w-wr').onclick=()=>open('writer');r.querySelector('#nx-w-im').onclick=()=>open('mejoras');r.querySelector('#nx-w-start').onclick=()=>{S.novaNext.setupDone=true;save();open('safari')};r.querySelector('#nx-w-cmd').onclick=palette};

  // ---------- N.extraActs compatibility ----------
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const pushAct=(label,fn)=>{const i=N.extraActs.findIndex(a=>a[0]===label);if(i<0)N.extraActs.push([label,fn]);};
  baseActions().forEach(([label,fn])=>pushAct(label,fn));
  if(S.novaNext.verticalTabs) document.body.classList.add('nova30-vertical'); if(!S.novaNext.safari&&S.theme==='safari')applySafari(true);
  window.Nova30={open,palette,applySafari,startFocus,createIsland:N.createIsland};
})();


/* ---- nova31.js ---- */
/* Nova 3.1.0 · New Things layer
 * Adds genuinely new, easy-to-use features without replacing the existing 3.0.1 systems.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const hostOf = u => { try { return new URL(String(u || '')).hostname.replace(/^www\./,'').toLowerCase(); } catch { return ''; } };
  const now = () => Date.now();
  const save = () => { try { N.save?.(); window.save?.(); } catch {} };
  const toast31 = m => { try { toast(m); } catch {} };
  const open = route => { try { return newTab('nova://' + route); } catch { return null; } };
  const webTab = () => {
    try {
      const t = N.currentWebTab?.() || N.activeWebTab?.() || cur;
      if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage')) return t;
      return null;
    } catch { return null; }
  };
  const current = () => {
    const t = webTab(); if (!t) return { t:null, url:'', title:'', host:'' };
    let url='', title='';
    try { url = http(t.wv.getURL?.() || ''); } catch {}
    try { title = t.el?.querySelector?.('span')?.textContent || url; } catch { title=url; }
    return { t, url, title, host:hostOf(url) };
  };
  const ensure = () => {
    S.nova31 = Object.assign({
      memory: [], pinboard: [], snapshots: [], sendbox: [], automations: [], siteThemes: {},
      permissions: {}, mini: false, smartGroups: { enabled: true }, dailyDismissed: {}, linkPreview: true
    }, S.nova31 || {});
    for (const k of ['memory','pinboard','snapshots','sendbox','automations']) if (!Array.isArray(S.nova31[k])) S.nova31[k] = [];
    for (const k of ['siteThemes','permissions','dailyDismissed']) if (!S.nova31[k] || typeof S.nova31[k] !== 'object') S.nova31[k] = {};
    S.nova31.smartGroups = Object.assign({ enabled:true }, S.nova31.smartGroups || {});
    if (Array.isArray(S.v21?.memory) && !S.nova31._migrated21) {
      S.nova31.memory = S.nova31.memory.concat(S.v21.memory.map(text => ({ text:String(text).slice(0,500), createdAt:now(), source:'Nova 2.1' })));
      S.nova31._migrated21 = true;
    }
  };
  ensure();

  if (!document.getElementById('nova31-style')) {
    const st = document.createElement('style'); st.id='nova31-style'; st.textContent = `
      .n31-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:24px}.n31-hero{padding:20px;border:1px solid var(--acc);border-radius:22px;background:radial-gradient(circle at 90% 10%,color-mix(in srgb,var(--acc) 18%,transparent),transparent 46%),var(--bar);box-shadow:0 20px 70px #0003}.n31-kicker{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);font-weight:800}.n31-title{font-size:30px;font-weight:600}.n31-sub{color:var(--mut);line-height:1.55;max-width:860px}.n31-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:10px}.n31-card{display:flex;flex-direction:column;gap:9px;padding:15px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);min-height:150px}.n31-card:hover{border-color:color-mix(in srgb,var(--acc) 58%,var(--bd));box-shadow:0 10px 35px #0002}.n31-card h3{margin:0}.n31-actions{display:flex;gap:7px;flex-wrap:wrap}.n31-list{display:flex;flex-direction:column;gap:7px}.n31-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:13px;background:var(--bar)}.n31-row .meta{min-width:0}.n31-row .meta b,.n31-row .meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n31-row .meta span{color:var(--mut);font-size:12px;margin-top:3px}.n31-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n31-chip.on{border-color:var(--acc);color:var(--acc)}.n31-empty{padding:15px;border:1px dashed var(--bd);border-radius:14px;color:var(--mut)}.n31-search{font-size:17px!important;padding:13px 15px!important;border-radius:14px!important}.n31-result{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:13px;background:var(--bar);cursor:pointer}.n31-result:hover{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 9%,var(--bar))}.n31-result small{color:var(--mut);white-space:nowrap}.n31-code{white-space:pre-wrap;word-break:break-word;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}.n31-mini{position:fixed;right:18px;bottom:18px;z-index:900;width:min(350px,calc(100vw - 36px));padding:14px;border:1px solid var(--acc);border-radius:20px;background:color-mix(in srgb,var(--bar) 95%,transparent);box-shadow:0 24px 90px #0008;backdrop-filter:blur(22px)}.n31-mini .small{font-size:12px;color:var(--mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n31-mini-title{font-weight:700;margin-bottom:4px}.n31-topbtn{height:30px;padding:0 10px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--fg);cursor:pointer;font-size:12px;white-space:nowrap}.n31-topbtn:hover{background:color-mix(in srgb,var(--acc) 12%,transparent);border-color:color-mix(in srgb,var(--acc) 40%,transparent)}
      @media(max-width:760px){.n31-grid{grid-template-columns:1fr}.n31-row{align-items:flex-start;flex-direction:column}.n31-row .n31-actions{width:100%}.n31-row .n31-actions .btn{flex:1}}
    `; document.head.appendChild(st);
  }

  const page = (kicker,title,desc,body='') => `<div class="n31-page"><div class="n31-kicker">${esc(kicker)}</div><div class="n31-title">${esc(title)}</div><div class="n31-sub">${esc(desc)}</div>${body}</div>`;
  const btn = (label,attr='',cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const card = (icon,title,desc,act='') => `<div class="n31-card"><div style="font-size:23px">${icon}</div><h3>${esc(title)}</h3><div class="mut">${esc(desc)}</div>${act ? `<div class="n31-actions" style="margin-top:auto">${act}</div>`:''}</div>`;
  const pushUnique = (arr,item,key='url') => { if (!item || !String(item[key]||'').trim()) return false; if (arr.some(x => String(x[key]||'')===String(item[key]))) return false; arr.unshift(item); return true; };
  const addMemory = text => { const v=String(text||'').trim().slice(0,1000); if(!v)return false; S.nova31.memory.unshift({text:v,createdAt:now()});S.nova31.memory=S.nova31.memory.slice(0,300);save();return true; };
  const pinCurrent = () => { const c=current(); if(!c.url) {toast31('Abre primero una página web');return false;} const ok=pushUnique(S.nova31.pinboard,{title:c.title,url:c.url,createdAt:now()},'url'); if(ok){save();toast31('Añadido al Pinboard');} else toast31('Esa página ya está en el Pinboard'); return ok; };
  const saveSend = () => { const c=current(); if(!c.url){toast31('Abre primero una página web');return false;} const ok=pushUnique(S.nova31.sendbox,{type:'page',title:c.title,url:c.url,createdAt:now()},'url'); if(ok){save();toast31('Enviado al buzón de Nova');} else toast31('Ya estaba en Nova Send'); return ok; };
  const addReading = () => { const c=current(); if(!c.url){toast31('Abre primero una página web');return false;} S.novaNext=S.novaNext||{};S.novaNext.reading=Array.isArray(S.novaNext.reading)?S.novaNext.reading:[];const ok=pushUnique(S.novaNext.reading,{title:c.title,url:c.url,added:now(),read:false},'url');if(ok){save();toast31('Guardado en Reading List');}else toast31('Ya estaba en Reading List');return ok; };

  /* ---------- Nova 3.1 Center ---------- */
  N.PG.nova31 = r => {
    const features = [
      ['⚡','Quick Actions','Las acciones importantes de Nova, sin buscar por ajustes.','quick'],
      ['📌','Pinboard','Guarda temporalmente enlaces, texto y páginas.','pinboard'],
      ['🧠','Nova Memory','Recordatorios locales y memoria que tú controlas.','memory31'],
      ['🧩','Smart Tab Groups','Detecta grupos naturales entre tus pestañas.','smarttabs'],
      ['⌕','Search Anything','Busca pestañas, historial, favoritos, notas y contenido guardado.','search31'],
      ['👀','Link Preview','Información rápida de un enlace sin abrir otra pestaña.','preview31'],
      ['🎨','Website Themes','Un estilo distinto por sitio web, guardado localmente.','sitethemes'],
      ['🔔','Smart Notifications','Reglas sencillas por sitio para las notificaciones.','notifications31'],
      ['🪄','Automations','Automatizaciones pequeñas y útiles sin programar.','automations'],
      ['🪟','Mini Mode','Un panel compacto para controlar tu página sin cambiar de contexto.','mini31'],
      ['📤','Nova Send','Un buzón local para mover cosas dentro de Nova.','sendbox'],
      ['📸','Page Snapshot','Guarda una instantánea HTML de una página.','snapshots'],
      ['☀️','Nova Daily','Tu punto de continuidad: recientes, guardados y pendientes.','daily'],
      ['🛡','Permission Center','Reglas claras para cámara, micrófono, ubicación y avisos.','permissions31'],
      ['🧹','One-Click Cleanup','Limpieza de datos con controles sencillos.','cleanup31']
    ];
    r.innerHTML = page('NOVA 3.1','Nuevas cosas para Nova','No sustituye tus funciones actuales. Esta capa añade herramientas nuevas y fáciles de encontrar.',
      `<section class="n31-hero"><div class="n31-title" style="font-size:24px">✨ Nova 3.1 — New Things</div><div class="n31-sub" style="margin-top:5px">15 funciones nuevas. Entran desde aquí, desde el Command Center o desde el botón <b>Nuevas</b> de la barra.</div><div class="n31-actions" style="margin-top:12px">${btn('⚡ Quick Actions','data-open="quick"','on')}${btn('☀️ Nova Daily','data-open="daily"')}${btn('⌕ Search Anything','data-open="search31"')}</div></section>`+
      `<div class="n31-grid">${features.map(([i,t,d,route])=>card(i,t,d,btn('Abrir',`data-open="${route}"`))).join('')}</div>`+
      `<div class="n31-actions">${btn('Volver al Centro Nova 3.0','id="n31-oldhub"')}${btn('Command Center','id="n31-cmd"')}</div>`
    );
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));
    r.querySelector('#n31-oldhub').onclick=()=>open('hub');
    r.querySelector('#n31-cmd').onclick=()=>N.palette?.();
  };

  /* ---------- Quick Actions ---------- */
  N.PG.quick = r => {
    const actions = [
      ['🔗','Copiar enlace',()=>{const c=current();if(!c.url)return toast31('Abre una página');navigator.clipboard?.writeText(c.url).then(()=>toast31('Enlace copiado')).catch(()=>toast31('No se pudo copiar'))}],
      ['📌','Pinboard',pinCurrent],
      ['📚','Reading List',addReading],
      ['📤','Nova Send',saveSend],
      ['📝','Abrir Writer',()=>open('writer')],
      ['📸','Capturar pantalla',()=>open('capture')],
      ['🗂','Guardar Snapshot',()=>open('snapshots')],
      ['🤖','Preguntar a Nova',()=>N.openAI?.() || open('ia')],
      ['🔊','Media Hub',()=>open('media')],
      ['🧠','Memoria',()=>open('memory31')],
      ['🪄','Automations',()=>open('automations')],
      ['🛡','Permisos',()=>open('permissions31')]
    ];
    r.innerHTML=page('QUICK','Quick Actions','Lo más útil de Nova en una pantalla. Cada botón actúa sobre la pestaña actual cuando tiene sentido.',`<div class="n31-grid">${actions.map(([i,t])=>card(i,t,'Acción rápida',btn('Ejecutar',''))).join('')}</div>`);
    r.querySelectorAll('.n31-card .btn').forEach((b,i)=>b.onclick=()=>actions[i]?.[2]?.());
  };

  /* ---------- Pinboard ---------- */
  N.PG.pinboard = r => {
    const list=S.nova31.pinboard;
    r.innerHTML=page('SAVE','Pinboard','Un sitio temporal para dejar cosas mientras navegas.',`<div class="n31-actions">${btn('📌 Página actual','id="pb-page"','on')}${btn('＋ Nota rápida','id="pb-note"')}${btn('🗑 Vaciar','id="pb-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title||x.text||'Elemento')}</b><span>${x.url?esc(x.url):'Nota local'} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">El Pinboard está vacío. Guarda la página actual o añade una nota rápida.</div>'}</div>`);
    r.querySelector('#pb-page').onclick=()=>{pinCurrent();N.PG.pinboard(r)};
    r.querySelector('#pb-note').onclick=()=>{const v=prompt('Nota rápida','');if(v&&String(v).trim()){S.nova31.pinboard.unshift({text:String(v).trim().slice(0,1000),createdAt:now()});S.nova31.pinboard=S.nova31.pinboard.slice(0,300);save();N.PG.pinboard(r)}};
    r.querySelector('#pb-clear').onclick=()=>{if(!confirm('¿Vaciar todo el Pinboard?'))return;S.nova31.pinboard=[];save();N.PG.pinboard(r)};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.pinboard(r)});
  };

  /* ---------- Memory ---------- */
  N.PG.memory31 = r => {
    const list=S.nova31.memory;
    r.innerHTML=page('MEMORY','Nova Memory','Memoria local. Tú decides qué entra y qué sale.',`<div class="n31-actions">${btn('＋ Añadir recuerdo','id="mem-add"','on')}${btn('🧷 Recordar página actual','id="mem-page"')}${btn('Borrar todo','id="mem-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.text||'')}</b><span>${new Date(x.createdAt||now()).toLocaleString('es')}${x.source?' · '+esc(x.source):''}</span></div><div class="n31-actions">${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay recuerdos guardados.</div>'}</div>`);
    r.querySelector('#mem-add').onclick=()=>{const v=prompt('¿Qué quieres que Nova recuerde?','');if(addMemory(v))N.PG.memory31(r)};
    r.querySelector('#mem-page').onclick=()=>{const c=current();if(!c.url)return toast31('Abre primero una página');if(addMemory(c.title+' — '+c.url))toast31('Página guardada en Memory');N.PG.memory31(r)};
    r.querySelector('#mem-clear').onclick=()=>{if(!confirm('¿Borrar toda Nova Memory?'))return;S.nova31.memory=[];save();N.PG.memory31(r)};
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.memory31(r)});
  };

  /* ---------- Smart Tab Groups ---------- */
  const tabRows = () => tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL?.()||'';title=t.el?.querySelector?.('span')?.textContent||u||title}catch{}return {t,i,u,title,host:hostOf(u)}}).filter(x=>x.host);
  const suggestions = () => {
    const map=new Map(); for(const x of tabRows()){if(!map.has(x.host))map.set(x.host,[]);map.get(x.host).push(x);}return [...map.entries()].filter(([,a])=>a.length>=2).sort((a,b)=>b[1].length-a[1].length);
  };
  const groupHost = host => {
    const rows=tabRows().filter(x=>x.host===host); if(rows.length<2)return false;
    S.groups=S.groups&&typeof S.groups==='object'?S.groups:{}; const old=Object.entries(S.groups).find(([,g])=>g?.name===host);
    const id=old?old[0]:'g'+Date.now().toString(36); S.groups[id]=Object.assign({name:host,color:'#0a84ff',collapsed:false},old?.[1]||{}); rows.forEach(x=>x.t.g=id); save(); N.renderGroups?.(); N.refreshIslands?.(); return true;
  };
  N.PG.smarttabs = r => {
    const groups=suggestions();
    r.innerHTML=page('ORGANIZE','Smart Tab Groups','Nova mira las pestañas abiertas y te propone grupos sencillos. No mueve nada hasta que pulses un botón.',`<div class="n31-actions">${btn('✨ Agrupar todo lo sugerido','id="stg-all"','on')}${btn('🏝 Ver Islands','id="stg-islands"')}</div><div class="n31-list">${groups.map(([host,rows])=>`<div class="n31-row"><div class="meta"><b>${esc(host)}</b><span>${rows.length} pestañas · ${esc(rows.map(x=>x.title).slice(0,3).join(' · '))}</span></div><div class="n31-actions">${btn('Crear grupo',`data-host="${esc(host)}"`)}${btn('Seleccionar',`data-sel="${esc(host)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay dos pestañas del mismo sitio ahora mismo. Abre varias páginas relacionadas y vuelve aquí.</div>'}</div>`);
    r.querySelector('#stg-all').onclick=()=>{let n=0;for(const [h] of groups)if(groupHost(h))n++;toast31(n?'Se crearon '+n+' grupos inteligentes':'No había grupos nuevos');N.PG.smarttabs(r)};
    r.querySelector('#stg-islands').onclick=()=>open('islands');
    r.querySelectorAll('[data-host]').forEach(b=>b.onclick=()=>{if(groupHost(b.dataset.host))toast31('Grupo creado para '+b.dataset.host);N.PG.smarttabs(r)});
    r.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{const x=tabRows().find(v=>v.host===b.dataset.sel);if(x)sel(x.t)});
  };

  /* ---------- Search Anything ---------- */
  const allSearchItems = () => {
    const out=[];
    tabRows().forEach(x=>out.push({kind:'Pestaña',label:x.title,sub:x.u,fn:()=>sel(x.t)}));
    (S.hist||[]).slice(0,500).forEach(x=>out.push({kind:'Historial',label:x.t||x.u,sub:x.u,fn:()=>newTab(x.u)}));
    (S.marks||[]).forEach(x=>out.push({kind:'Favorito',label:x.t||x.u,sub:x.u,fn:()=>newTab(x.u)}));
    (S.novaNext?.reading||[]).forEach(x=>out.push({kind:'Reading List',label:x.title,sub:x.url,fn:()=>newTab(x.url)}));
    (S.novaNext?.collections||[]).forEach(c=>(c.items||[]).forEach(x=>{if(x.url)out.push({kind:'Colección',label:x.title||c.name,sub:x.url,fn:()=>newTab(x.url)});else if(x.text)out.push({kind:'Colección',label:x.text,sub:c.name,fn:()=>open('collections')})}));
    S.nova31.pinboard.forEach(x=>out.push({kind:'Pinboard',label:x.title||x.text,sub:x.url||'Nota',fn:()=>x.url?newTab(x.url):open('pinboard')}));
    S.nova31.memory.forEach(x=>out.push({kind:'Memory',label:x.text,sub:new Date(x.createdAt||now()).toLocaleString('es'),fn:()=>open('memory31')}));
    S.nova31.snapshots.forEach(x=>out.push({kind:'Snapshot',label:x.title,sub:x.url,fn:()=>newTab(pathToFileURL(x.file).href)}));
    S.nova31.sendbox.forEach(x=>out.push({kind:'Nova Send',label:x.title||x.text,sub:x.url||'Elemento local',fn:()=>x.url?newTab(x.url):open('sendbox')}));
    return out;
  };
  N.PG.search31 = r => {
    r.innerHTML=page('SEARCH','Search Anything','Una sola búsqueda para casi todo lo que Nova ya conoce.',`<input class="fld n31-search" id="n31-q" placeholder="Busca una pestaña, web, nota, favorito…"><div class="n31-list" id="n31-results"></div>`);
    const inp=r.querySelector('#n31-q'),out=r.querySelector('#n31-results');
    const draw=()=>{const q=inp.value.toLowerCase().trim(),items=allSearchItems().filter(x=>!q||String(x.label+' '+x.sub).toLowerCase().includes(q)).slice(0,60);out.innerHTML=items.map((x,i)=>`<div class="n31-result" data-i="${i}"><span><b>${esc(x.label||'Elemento')}</b><br><small>${esc(x.kind)} · ${esc(x.sub||'')}</small></span><small>›</small></div>`).join('')||'<div class="n31-empty">No hay resultados.</div>';out.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>items[+b.dataset.i]?.fn?.())};
    inp.oninput=draw; draw(); setTimeout(()=>inp.focus(),0);
  };

  /* ---------- Link Preview ---------- */
  const installPreview = t => {
    if(!S.nova31.linkPreview || !t?.wv?.executeJavaScript || t._nova31Preview) return; t._nova31Preview=true;
    const script=`(()=>{try{if(window.__nova31Preview)return true;window.__nova31Preview=1;const s=document.createElement('style');s.id='__nova31-preview-style';s.textContent='.nova31-link-preview{position:fixed;z-index:2147483647;max-width:360px;padding:10px 12px;border-radius:12px;border:1px solid rgba(120,120,140,.35);background:rgba(20,20,28,.94);color:#fff;font:12px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 14px 42px rgba(0,0,0,.28);pointer-events:none;opacity:0;transition:opacity .1s}.nova31-link-preview b{display:block;font-size:13px;margin-bottom:3px}.nova31-link-preview small{display:block;opacity:.72;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';document.head.appendChild(s);const p=document.createElement('div');p.className='nova31-link-preview';document.body.appendChild(p);let timer=0;const hide=()=>{p.style.opacity='0'};document.addEventListener('mouseover',e=>{const a=e.target?.closest?.('a[href]');if(!a||!a.href||!/^https?:/i.test(a.href))return;clearTimeout(timer);timer=setTimeout(()=>{try{const u=new URL(a.href);p.innerHTML='<b>'+String(a.title||a.innerText||u.hostname).replace(/[&<>]/g,\'\')+'</b><small>'+u.hostname+'</small><small>'+u.href.replace(/&/g,'&amp;').slice(0,240)+'</small>';p.style.left=Math.min(innerWidth-380,Math.max(8,e.clientX+14))+\'px\';p.style.top=Math.min(innerHeight-100,Math.max(8,e.clientY+14))+\'px\';p.style.opacity=\'1\'}catch{}},180)},true);document.addEventListener('mouseout',e=>{const a=e.target?.closest?.('a[href]');if(a){clearTimeout(timer);hide()}},true);return true}catch{return false}})()`;
    t.wv.executeJavaScript(script).catch(()=>{});
  };

  /* ---------- Link Preview settings page ---------- */
  N.PG.preview31 = r => {
    r.innerHTML=page('PREVIEW','Link Preview','Cuando pasas por un enlace, Nova puede mostrar título, dominio y URL sin abrir una pestaña.',`<div class="n31-hero"><div class="n31-title" style="font-size:22px">${S.nova31.linkPreview?'👀 Activo':'⏸ Pausado'}</div><div class="n31-sub" style="margin-top:5px">La vista previa es ligera: no abre la web ni descarga el destino automáticamente.</div><div class="n31-actions" style="margin-top:10px">${btn(S.nova31.linkPreview?'Desactivar':'Activar','id="prev-toggle"','on')} ${btn('Reaplicar en pestañas','id="prev-reapply"')}</div></div>`);
    r.querySelector('#prev-toggle').onclick=()=>{S.nova31.linkPreview=!S.nova31.linkPreview;save();tabs.forEach(t=>{if(S.nova31.linkPreview){t._nova31Preview=false;installPreview(t)}else{try{t.wv.executeJavaScript(`document.getElementById('__nova31-preview-style')?.remove();document.querySelector('.nova31-link-preview')?.remove();delete window.__nova31Preview`)}catch{}}});N.PG.preview31(r)};
    r.querySelector('#prev-reapply').onclick=()=>{tabs.forEach(t=>{t._nova31Preview=false;installPreview(t)});toast31('Link Preview reaplicado');};
  };

  /* ---------- Website Themes ---------- */
  const applySiteTheme = t => {
    if(!t?.wv?.executeJavaScript) return; const u=http(t.wv.getURL?.()||''),h=hostOf(u); if(!h)return;
    const css=String(S.nova31.siteThemes[h]?.css||'');
    const code=`(()=>{try{let s=document.getElementById('__nova31-site-theme');if(!${JSON.stringify(!!css)}){s?.remove();return true}if(!s){s=document.createElement('style');s.id='__nova31-site-theme';document.head.appendChild(s)}s.textContent=${JSON.stringify(css)};return true}catch{return false}})()`;
    t.wv.executeJavaScript(code).catch(()=>{});
  };
  const installSiteEditor = r => {
    const c=current(); if(!c.host)return toast31('Abre una web para editar su tema');
    const old=String(S.nova31.siteThemes[c.host]?.css||''); const preset=`body{border-top:4px solid var(--nova31-accent, #8b5cf6)!important;} a{border-radius:6px;} `;
    r.innerHTML+=`<div class="n31-card"><h3>Tema para ${esc(c.host)}</h3><span class="mut">CSS local aplicado solo a este sitio.</span><textarea class="fld" id="site-css" style="min-height:160px;resize:vertical">${esc(old)}</textarea><div class="n31-actions">${btn('Guardar','id="site-save"','on')}${btn('Preset suave','id="site-preset"')}${btn('Quitar tema','id="site-clear"')}</div></div>`;
    r.querySelector('#site-save').onclick=()=>{const css=r.querySelector('#site-css').value.slice(0,12000);S.nova31.siteThemes[c.host]={css,updatedAt:now()};save();applySiteTheme(c.t);toast31('Tema guardado para '+c.host)};
    r.querySelector('#site-preset').onclick=()=>{r.querySelector('#site-css').value=preset};
    r.querySelector('#site-clear').onclick=()=>{delete S.nova31.siteThemes[c.host];save();applySiteTheme(c.t);r.querySelector('#site-css').value='';toast31('Tema quitado')};
  };
  N.PG.sitethemes = r => {
    const hosts=Object.entries(S.nova31.siteThemes).filter(([,v])=>v?.css);
    r.innerHTML=page('STYLE','Website Themes','Define un pequeño estilo por sitio. Se guarda en tu perfil de Nova.',`<div class="n31-actions">${btn('🎨 Editar sitio actual','id="site-current"','on')}${btn('Quitar todos los temas','id="site-all-clear"')}</div><div class="n31-list">${hosts.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>${String(v.css).length} caracteres CSS · ${new Date(v.updatedAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${btn('Aplicar ahora',`data-apply="${esc(h)}"`)}${btn('Eliminar',`data-del="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay temas por sitio.</div>'}</div><div id="site-editor"></div>`);
    r.querySelector('#site-current').onclick=()=>installSiteEditor(r);
    r.querySelector('#site-all-clear').onclick=()=>{if(!confirm('¿Quitar todos los temas de sitios?'))return;S.nova31.siteThemes={};save();r.querySelector('#site-editor').innerHTML='';const c=current();if(c.t)applySiteTheme(c.t);N.PG.sitethemes(r)};
    r.querySelectorAll('[data-apply]').forEach(b=>b.onclick=()=>{const c=current();if(c.host===b.dataset.apply)applySiteTheme(c.t);else toast31('Abre '+b.dataset.apply+' para aplicarlo')});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{delete S.nova31.siteThemes[b.dataset.del];save();N.PG.sitethemes(r)});
  };

  /* ---------- Smart Notifications / Permissions ---------- */
  const permLabel = p => ({notifications:'notificaciones',camera:'cámara',microphone:'micrófono',geolocation:'ubicación',clipboardRead:'portapapeles',clipboardWrite:'portapapeles'}[p]||p);
  const bindPermission = t => {
    if(!t?.wv?.addEventListener || t._nova31Perm) return; t._nova31Perm=true;
    t.wv.addEventListener('permission-request',e=>{
      try {
        const host=hostOf(e.requestingUrl||t.wv.getURL?.()||''); const raw=String(e.permission||'').toLowerCase(); const map=raw.includes('notification')?'notifications':raw.includes('camera')?'camera':raw.includes('microphone')?'microphone':raw.includes('geolocation')?'geolocation':raw; const rule=S.nova31.permissions[host]?.[map];
        if(rule==='block'){e.preventDefault?.();e.callback?.(false);toast31('Bloqueado: '+permLabel(map)+' · '+host)}
        else if(rule==='allow'){e.callback?.(true)}
      } catch {}
    });
  };
  N.PG.notifications31 = r => {
    const rows=Object.entries(S.nova31.permissions).filter(([,v])=>v?.notifications);
    r.innerHTML=page('NOTIFICATIONS','Smart Notifications','Controla los avisos por sitio. “Preguntar” deja el comportamiento normal del navegador.',`<div class="n31-actions">${btn('🔔 Configurar sitio actual','id="not-site"','on')}${btn('Bloquear todas las nuevas reglas','id="not-all"')}</div><div class="n31-list">${rows.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>Notificaciones: ${esc(v.notifications)}</span></div><div class="n31-actions">${btn('Alternar',`data-host="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay reglas de notificaciones. Configura el sitio actual.</div>'}</div>`);
    r.querySelector('#not-site').onclick=()=>{const c=current();if(!c.host)return toast31('Abre una página');S.nova31.permissions[c.host]=S.nova31.permissions[c.host]||{};const currentRule=S.nova31.permissions[c.host].notifications||'ask';const next=currentRule==='ask'?'allow':currentRule==='allow'?'block':'ask';S.nova31.permissions[c.host].notifications=next;save();bindPermission(c.t);toast31(c.host+': '+next);N.PG.notifications31(r)};
    r.querySelector('#not-all').onclick=()=>{const c=current();if(!c.host)return toast31('Abre una página');S.nova31.permissions[c.host]=Object.assign({},S.nova31.permissions[c.host],{notifications:'block'});save();bindPermission(c.t);toast31('Notificaciones bloqueadas para '+c.host);N.PG.notifications31(r)};
    r.querySelectorAll('[data-host]').forEach(b=>b.onclick=()=>{const h=b.dataset.host;const v=S.nova31.permissions[h]||{};v.notifications=v.notifications==='ask'?'allow':v.notifications==='allow'?'block':'ask';S.nova31.permissions[h]=v;save();N.PG.notifications31(r)});
  };
  N.PG.permissions31 = r => {
    const c=current(); const host=c.host;
    const entries=Object.entries(S.nova31.permissions);
    r.innerHTML=page('PRIVACY','Permission Center','Reglas locales y sencillas para cámara, micrófono, ubicación y notificaciones.',`<div class="n31-card"><h3>${host?'Sitio actual: '+esc(host):'Abre una web para configurar un sitio'}</h3><div class="n31-actions">${['notifications','camera','microphone','geolocation'].map(k=>`<button class="btn" data-perm="${k}">${permLabel(k)}: ${host?esc(S.nova31.permissions[host]?.[k]||'ask'):'ask'}</button>`).join('')}</div></div><div class="n31-list">${entries.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>${Object.entries(v||{}).map(([k,x])=>permLabel(k)+': '+x).join(' · ')}</span></div><div class="n31-actions">${btn('Eliminar reglas',`data-del="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay reglas guardadas todavía.</div>'}</div><div class="n31-actions">${btn('Abrir Smart Notifications','id="perm-not"')}${btn('Revisar seguridad de Nova','id="perm-security"')}</div>`);
    r.querySelectorAll('[data-perm]').forEach(b=>b.onclick=()=>{if(!host)return toast31('Abre una página web');S.nova31.permissions[host]=S.nova31.permissions[host]||{};const k=b.dataset.perm,v=S.nova31.permissions[host][k]||'ask';S.nova31.permissions[host][k]=v==='ask'?'allow':v==='allow'?'block':'ask';save();bindPermission(c.t);N.PG.permissions31(r)});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{delete S.nova31.permissions[b.dataset.del];save();N.PG.permissions31(r)});
    r.querySelector('#perm-not').onclick=()=>open('notifications31');
    r.querySelector('#perm-security').onclick=()=>open('seguridad');
  };

  /* ---------- Automations ---------- */
  const automationAction = (a, ctx) => {
    try {
      const type=a?.action?.type, value=String(a?.action?.value||'');
      if(type==='open-url' && http(value)) return newTab(value);
      if(type==='feature' && value) return open(value.replace(/^nova:\/\//,''));
      if(type==='pin') return pinCurrent();
      if(type==='reading') return addReading();
      if(type==='send') return saveSend();
      if(type==='memory') return addMemory(ctx.title+' — '+ctx.url);
      if(type==='notify') return toast31(value||('Automatización: '+a.name));
      if(type==='focus') return N.startFocus?.(Number(value)||25);
    } catch {}
  };
  const runAutomations = t => {
    if(!t?.wv || t._nova31Auto) return; t._nova31Auto=true;
    t.wv.addEventListener('did-navigate',()=>{ const c=(()=>{let url='';try{url=http(t.wv.getURL?.()||'')}catch{}return {url,title:t.el?.querySelector?.('span')?.textContent||url,host:hostOf(url)}})(); if(!c.url)return; for(const a of S.nova31.automations){if(!a?.enabled)continue;const h=String(a.whenHost||'').replace(/^www\./,'').toLowerCase();const pathPart=String(a.whenPath||'').trim();let path='';try{path=new URL(c.url).pathname}catch{}if(h&&h!==c.host)continue;if(pathPart&&!path.includes(pathPart))continue;const key=a.id+'|'+c.url;if(a._lastRun===key && now()-Number(a._lastRunAt||0)<8000)continue;a._lastRun=key;a._lastRunAt=now();save();setTimeout(()=>automationAction(a,c),120)}});
  };
  N.PG.automations = r => {
    const list=S.nova31.automations;
    r.innerHTML=page('AUTOMATE','Nova Automations','Cuando abras una web, Nova puede hacer una acción sencilla por ti.',`<div class="n31-card"><h3>＋ Nueva automatización</h3><span class="mut">Ejemplo: al abrir youtube.com → abrir Media Hub.</span><div class="n31-actions">${btn('Crear con el asistente','id="auto-new"','on')}</div></div><div class="n31-list">${list.map((a,i)=>`<div class="n31-row"><div class="meta"><b>${esc(a.name||'Automatización')}</b><span>${esc(a.whenHost||'*')}${a.whenPath?esc(a.whenPath):''} → ${esc(a.action?.type||'notify')} ${esc(a.action?.value||'')} · ${a.enabled===false?'apagada':'activa'}</span></div><div class="n31-actions">${btn(a.enabled===false?'Activar':'Pausar',`data-toggle="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">No has creado automatizaciones todavía.</div>'}</div>`);
    r.querySelector('#auto-new').onclick=()=>{const host=String(prompt('¿En qué sitio? (ej. youtube.com)','')||'').trim().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];if(!host)return;const name=String(prompt('Nombre','Mi automatización')||'').trim()||'Mi automatización';const types={1:'feature',2:'open-url',3:'pin',4:'reading',5:'send',6:'memory',7:'notify',8:'focus'};const choice=prompt('Acción:\n1 Abrir función Nova\n2 Abrir URL\n3 Pinboard\n4 Reading List\n5 Nova Send\n6 Memory\n7 Mostrar aviso\n8 Focus','1');const type=types[choice]||'notify';let value='';if(type==='feature')value=String(prompt('Ruta Nova (ej. media)','media')||'media').trim();else if(type==='open-url')value=String(prompt('URL','https://')||'').trim();else if(type==='notify')value=String(prompt('Texto del aviso','Nova ha hecho algo')||'Nova ha hecho algo').trim();else if(type==='focus')value=String(prompt('Minutos','25')||'25').trim();list.unshift({id:'a'+now().toString(36),name,whenHost:host,whenPath:'',action:{type,value},enabled:true,createdAt:now()});save();list.forEach(()=>{});N.PG.automations(r);toast31('Automatización creada')};
    r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const a=list[+b.dataset.toggle];if(!a)return;a.enabled=!a.enabled;save();N.PG.automations(r)});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.automations(r)});
  };

  /* ---------- Mini Mode ---------- */
  const closeMini = () => { document.getElementById('nova31-mini')?.remove(); S.nova31.mini=false; save(); };
  const mini = () => {
    document.getElementById('nova31-mini')?.remove(); const c=current(); const d=document.createElement('div'); d.id='nova31-mini';d.className='n31-mini';
    d.innerHTML=`<div class="n31-mini-title">🪟 Mini Mode</div><div class="small" id="mini-title">${esc(c.title||'Sin página')}</div><div class="small" id="mini-url">${esc(c.url||'')}</div><div class="n31-actions" style="margin-top:9px">${btn('←','id="mini-back"')}${btn('→','id="mini-fwd"')}${btn('↻','id="mini-reload"')}${btn('Pin','id="mini-pin"')}${btn('Cerrar','id="mini-close"')}</div><div class="row" style="margin-top:8px"><input class="fld" id="mini-go" placeholder="Escribe una URL…"><button class="btn on" id="mini-open">Abrir</button></div>`;
    document.body.appendChild(d); S.nova31.mini=true; save();
    d.querySelector('#mini-back').onclick=()=>c.t?.wv?.canGoBack?.()&&c.t.wv.goBack();d.querySelector('#mini-fwd').onclick=()=>c.t?.wv?.canGoForward?.()&&c.t.wv.goForward();d.querySelector('#mini-reload').onclick=()=>c.t?.wv?.reload?.();d.querySelector('#mini-pin').onclick=pinCurrent;d.querySelector('#mini-close').onclick=closeMini;d.querySelector('#mini-open').onclick=()=>{let v=d.querySelector('#mini-go').value.trim();if(v){if(!/^https?:\/\//i.test(v))v=typeof toURL==='function'?toURL(v):v;const t=c.t||webTab();t?.wv?.loadURL?.(v);}};
  };
  N.PG.mini31 = r => { r.innerHTML=page('MINI','Mini Mode','Un panel flotante y compacto para controlar la navegación sin perder de vista la página.',`<div class="n31-hero"><div class="n31-title" style="font-size:22px">Control rápido encima de tu página</div><div class="n31-sub" style="margin-top:5px">No reemplaza la ventana de Nova ni crea una ventana adicional del sistema; es un modo compacto dentro de Nova.</div><div class="n31-actions" style="margin-top:10px">${btn('Abrir Mini Mode','id="mini-open-page"','on')}${btn('Cerrar Mini Mode','id="mini-close-page"')}</div></div>`);r.querySelector('#mini-open-page').onclick=mini;r.querySelector('#mini-close-page').onclick=closeMini; };

  /* ---------- Nova Send ---------- */
  N.PG.sendbox = r => {
    const list=S.nova31.sendbox;
    r.innerHTML=page('SEND','Nova Send','Buzón local para mover enlaces y notas dentro de tu navegador.',`<div class="n31-actions">${btn('📤 Enviar página actual','id="send-page"','on')}${btn('＋ Enviar nota','id="send-note"')}${btn('🗑 Vaciar','id="send-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title||x.text||'Elemento')}</b><span>${esc(x.url||'Nota local')} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Nova Send está vacío.</div>'}</div>`);
    r.querySelector('#send-page').onclick=()=>{saveSend();N.PG.sendbox(r)};
    r.querySelector('#send-note').onclick=()=>{const v=prompt('Nota para Nova Send','');if(v&&String(v).trim()){list.unshift({type:'note',text:String(v).trim().slice(0,1000),createdAt:now()});save();N.PG.sendbox(r)}};
    r.querySelector('#send-clear').onclick=()=>{if(confirm('¿Vaciar Nova Send?')){S.nova31.sendbox=[];save();N.PG.sendbox(r)}};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.sendbox(r)});
  };

  /* ---------- Page Snapshots ---------- */
  const saveSnapshot = async () => {
    const c=current(); if(!c.t||!c.url)return toast31('Abre primero una página web');
    toast31('Guardando snapshot…');
    const raw=await c.t.wv.executeJavaScript(`(()=>({title:document.title,url:location.href,html:'<!doctype html>'+document.documentElement.outerHTML}))()`).catch(()=>null);
    if(!raw?.html)return toast31('No se pudo capturar el HTML');
    const safe=(raw.title||'Nova Snapshot').replace(/[^\w\- ]+/g,' ').trim().slice(0,70)||'Nova Snapshot';
    const file=await ipc.invoke('save-text',{name:'Nova-Snapshot-'+safe,ext:'html',content:raw.html}).catch(()=>null);
    if(!file)return toast31('No se pudo guardar el archivo');
    S.nova31.snapshots.unshift({title:raw.title||c.title,url:raw.url||c.url,file,createdAt:now()});S.nova31.snapshots=S.nova31.snapshots.slice(0,100);save();toast31('Snapshot guardado en Descargas');return file;
  };
  N.PG.snapshots = r => {
    const list=S.nova31.snapshots;
    r.innerHTML=page('SNAPSHOT','Page Snapshot','Guarda una copia HTML local de la página que tienes abierta.',`<div class="n31-actions">${btn('📸 Guardar página actual','id="snap-save"','on')}${btn('🗑 Borrar lista','id="snap-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title)}</b><span>${esc(x.url)} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Carpeta',`data-folder="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay snapshots.</div>'}</div>`);
    r.querySelector('#snap-save').onclick=async()=>{await saveSnapshot();N.PG.snapshots(r)};
    r.querySelector('#snap-clear').onclick=()=>{S.nova31.snapshots=[];save();N.PG.snapshots(r)};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.open];if(x?.file)newTab(pathToFileURL(x.file).href)});
    r.querySelectorAll('[data-folder]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.folder];if(x?.file)ipc.invoke('show-in-folder',x.file).catch(()=>{})});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.snapshots(r)});
  };

  /* ---------- Nova Daily ---------- */
  N.PG.daily = r => {
    const recent=(S.hist||[]).slice(0,8);const pb=S.nova31.pinboard.slice(0,6);const todo=(S.nova31.sendbox||[]).slice(0,6);
    r.innerHTML=page('DAILY','Nova Daily','Una portada para continuar donde lo dejaste, sin convertir Nova en una red social.',`<section class="n31-hero"><div class="n31-title" style="font-size:24px">Hola 👋</div><div class="n31-sub" style="margin-top:5px">${recent.length?'Tienes '+recent.length+' páginas recientes y '+pb.length+' cosas guardadas.':'Todavía no hay suficiente actividad para preparar un resumen.'}</div><div class="n31-actions" style="margin-top:10px">${btn('⌕ Buscar Anything','id="daily-search"','on')}${btn('📌 Pinboard','id="daily-pin"')}${btn('📤 Nova Send','id="daily-send"')}</div></section><div class="n31-grid">${card('🕘','Continuar','Tus páginas recientes.',recent.slice(0,1).map(x=>btn('Abrir',`data-r="${recent.indexOf(x)}"`)).join('')||'')}${card('📌','Guardado rápido',pb.length+' elementos en Pinboard.',btn('Ver Pinboard','id="daily-pb"'))}${card('📤','Pendiente',todo.length+' elementos en Nova Send.',btn('Ver buzón','id="daily-sb"'))}${card('🧠','Memory',S.nova31.memory.length+' recuerdos locales.',btn('Abrir Memory','id="daily-mem"'))}</div><div class="n31-list">${recent.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.t||x.u)}</b><span>${esc(x.u||'')}</span></div><div class="n31-actions">${btn('Abrir',`data-recent="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">El historial reciente aparecerá aquí cuando navegues.</div>'}</div>`);
    r.querySelector('#daily-search').onclick=()=>open('search31');r.querySelector('#daily-pin').onclick=()=>open('pinboard');r.querySelector('#daily-send').onclick=()=>open('sendbox');r.querySelector('#daily-pb').onclick=()=>open('pinboard');r.querySelector('#daily-sb').onclick=()=>open('sendbox');r.querySelector('#daily-mem').onclick=()=>open('memory31');
    r.querySelectorAll('[data-recent]').forEach(b=>b.onclick=()=>newTab(recent[+b.dataset.recent]?.u));
  };

  /* ---------- Cleanup ---------- */
  N.PG.cleanup31 = r => {
    r.innerHTML=page('CLEAN','One-Click Cleanup','Elige qué limpiar. Nada se borra hasta que pulses el botón.',`<div class="n31-grid"><div class="n31-card"><h3>🌐 Datos web</h3><span class="mut">Cookies, almacenamiento de sitios y caché.</span><div class="row"><label><input type="checkbox" id="cl-cookie" checked> Cookies y datos</label></div><div class="row"><label><input type="checkbox" id="cl-cache" checked> Caché</label></div></div><div class="n31-card"><h3>🧭 Nova</h3><span class="mut">Datos locales que controlas desde Nova.</span><div class="row"><label><input type="checkbox" id="cl-hist"> Historial</label></div><div class="row"><label><input type="checkbox" id="cl-pin"> Pinboard</label></div><div class="row"><label><input type="checkbox" id="cl-send"> Nova Send</label></div></div></div><div class="n31-actions">${btn('🧹 Limpiar ahora','id="cl-go"','on')}${btn('Borrar solo historial','id="cl-hist-only"')}</div><div class="n31-code" id="cl-status">Listo.</div>`);
    r.querySelector('#cl-go').onclick=async()=>{const opts={cookies:r.querySelector('#cl-cookie').checked,cache:r.querySelector('#cl-cache').checked,storage:r.querySelector('#cl-cookie').checked};const ok=await ipc.invoke('clear-data',opts).catch(()=>false);if(r.querySelector('#cl-hist').checked){S.hist=[];};if(r.querySelector('#cl-pin').checked){S.nova31.pinboard=[];}if(r.querySelector('#cl-send').checked){S.nova31.sendbox=[];}save();r.querySelector('#cl-status').textContent=ok?'Limpieza completada.':'No se pudo completar toda la limpieza.';toast31(ok?'Limpieza completada':'No se pudo completar toda la limpieza')};
    r.querySelector('#cl-hist-only').onclick=()=>{S.hist=[];save();r.querySelector('#cl-status').textContent='Historial de Nova borrado.';toast31('Historial borrado')};
  };

  /* ---------- Discoverability ---------- */
  const addTopButton = () => {
    const host=document.getElementById('nova22-top-tools');if(!host||host.querySelector('#n31-top'))return;
    const b=document.createElement('button');b.id='n31-top';b.className='n31-topbtn';b.textContent='✨ Nuevas';b.title='Nova 3.1 — nuevas funciones';b.onclick=()=>open('nova31');host.appendChild(b);
  };
  addTopButton();
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  if(!N.extraActs.some(a=>a[0]==='Nova 3.1 · Nuevas cosas'))N.extraActs.push(['Nova 3.1 · Nuevas cosas',()=>open('nova31')]);

  const oldPalette=N.palette;
  if(typeof oldPalette==='function'&&!oldPalette.__nova31Wrapped){
    const wrapped=()=>{oldPalette();setTimeout(()=>{const dlg=document.querySelector('#nova30-cmd .nx-command');if(!dlg||dlg.querySelector('#n31-palette'))return;const b=document.createElement('button');b.id='n31-palette';b.className='btn on';b.textContent='✨ Abrir nuevas funciones de Nova 3.1';b.onclick=()=>{document.getElementById('nova30-cmd')?.remove();open('nova31')};dlg.appendChild(b)},0)};wrapped.__nova31Wrapped=true;N.palette=wrapped;
  }

  const wrapPage = (name,html) => { const old=N.PG[name]; if(typeof old!=='function')return; const wrapped=r=>{old(r);if(r.querySelector('#nova31-extra'))return;const d=document.createElement('div');d.id='nova31-extra';d.className='n31-card';d.innerHTML=html;d.style.marginTop='12px';r.appendChild(d);const b=d.querySelector('[data-n31]');if(b)b.onclick=()=>open('nova31');}; wrapped.__nova31Wrapped=true;N.PG[name]=wrapped; };
  wrapPage('hub',`<h3>✨ Nova 3.1</h3><span class="mut">15 funciones nuevas están aquí, sin tocar tu centro anterior.</span><div class="n31-actions"><button class="btn on" data-n31>Abrir Nuevas funciones</button></div>`);
  wrapPage('novedades',`<h3>Nova 3.1 · New Things</h3><span class="mut">Quick Actions, Pinboard, Memory, Smart Groups, Snapshots, Automations y más.</span><div class="n31-actions"><button class="btn on" data-n31>Ver Nova 3.1</button></div>`);

  /* ---------- Bind existing and future tabs ---------- */
  const bindTab = t => {
    if(!t?.wv?.addEventListener || t._nova31Bound)return t;
    t._nova31Bound=true;
    const ready=()=>{installPreview(t);applySiteTheme(t);bindPermission(t);};
    t.wv.addEventListener('dom-ready',ready); t.wv.addEventListener('did-navigate',()=>{ready();runAutomations(t)});t.wv.addEventListener('did-navigate-in-page',()=>{applySiteTheme(t)});
    runAutomations(t); bindPermission(t);
    return t;
  };
  const baseNewTab31 = newTab;
  if(!baseNewTab31.__nova31Wrapped){
    const wrappedNewTab = function(u){const t=baseNewTab31(u);return bindTab(t);}; wrappedNewTab.__nova31Wrapped=true; newTab=wrappedNewTab; N.newTab=wrappedNewTab;
  }
  tabs.slice().forEach(bindTab);

  /* ---------- Small keyboard shortcuts ---------- */
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='p'){e.preventDefault();open('pinboard');}
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='s'){e.preventDefault();open('snapshots');}
  });

  const aliases={nova31:'nova31',newthings:'nova31','new-things':'nova31',quick:'quick',pinboard:'pinboard',memory31:'memory31',smarttabs:'smarttabs',searchanything:'search31',search:'search31',preview:'preview31',linkpreview:'preview31',sitethemes:'sitethemes',websitethemes:'sitethemes',notifications31:'notifications31',automations:'automations',automation:'automations',mini:'mini31',minimode:'mini31',sendbox:'sendbox',novasend:'sendbox',snapshots:'snapshots',snapshot:'snapshots',daily:'daily',novadaily:'daily',permissions31:'permissions31',permission:'permissions31',cleanup31:'cleanup31',cleanup:'cleanup31'};
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]||(oldResolve?oldResolve(raw):raw)};
  N.openFeature31=open; N.pinCurrent31=pinCurrent; N.saveSnapshot31=saveSnapshot; N.nova31={open,mini,closeMini,saveSnapshot,pinCurrent,addMemory};
  window.Nova31=N.nova31;
  save();
})();


/* ---- nova40.js ---- */
/* Nova 4.0.0 · Ultimate Clean
 * Additive layer: keeps Nova 3.x modules intact and makes the new tools easier to discover/use.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = () => Date.now();
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const hostOf = u => { try { return new URL(String(u || '')).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
  const toast40 = msg => { try { toast(String(msg)); } catch {} };
  const save = () => { try { N.save?.(); } catch {} try { window.save?.(); } catch {} };

  const state = () => {
    S.nova40 = Object.assign({
      vault: [], timeline: [], sessions: [], flows: [], workspaces: [], islands: [], extensions: [],
      siteProfiles: {}, customStudio: { accent:'', radius:16, density:1 },
      syncAt: 0, settings: { dock:true, launcherHint:true }, version:1
    }, S.nova40 || {});
    for (const k of ['vault','timeline','sessions','flows','workspaces','islands','extensions']) {
      if (!Array.isArray(S.nova40[k])) S.nova40[k] = [];
    }
    for (const k of ['siteProfiles','settings','customStudio']) {
      if (!S.nova40[k] || typeof S.nova40[k] !== 'object') S.nova40[k] = {};
    }
    return S.nova40;
  };
  const st = state();

  const webTab = () => {
    try {
      const t = N.currentWebTab?.() || N.activeWebTab?.();
      if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage')) return t;
    } catch {}
    try {
      for (const t of tabs || []) if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage') && t.el?.classList?.contains?.('on')) return t;
    } catch {}
    return null;
  };

  const current = () => {
    const t = webTab();
    if (!t) return { t:null, url:'', title:'', host:'' };
    let url = '', title = '';
    try { url = http(t.wv.getURL?.() || ''); } catch {}
    try { title = t.el?.querySelector?.('span')?.textContent || url; } catch { title = url; }
    return { t, url, title, host: hostOf(url) };
  };

  const inject = async (t, code) => {
    if (!t?.wv?.executeJavaScript) return null;
    try { return await t.wv.executeJavaScript(code); } catch { return null; }
  };

  const oldResolve = N.resolveFeatureRoute;

  const internalRoute = route => {
    const raw = String(route || '').replace(/^nova:\/\//i, '').split(/[/?#]/)[0].trim();
    if (!raw) return '';
    const low = raw.toLowerCase();
    if (['command','command-center','acciones','palette'].includes(low)) return 'command';
    const direct = Object.keys(N.PG).find(k => k.toLowerCase() === low);
    if (direct) return direct;
    const alias = aliases[low];
    if (alias) return alias;
    try {
      const resolved = oldResolve?.(low);
      if (resolved && Object.keys(N.PG).some(k => k === resolved)) return resolved;
    } catch {}
    return '';
  };

  const open = route => {
    const page = internalRoute(route);
    if (page === 'command') { N.palette?.(); return null; }
    if (!page) { toast40('No encontré esa función'); return null; }
    try { return typeof newTab === 'function' ? newTab('nova://' + page) : N.openFeature?.(page); } catch { return null; }
  };

  const currentTitle = () => current().title || current().host || 'Página';
  const shortText = (s, n=320) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const pushUnique = (arr, item, key='url', limit=200) => {
    if (!item || !String(item[key] || '').trim()) return false;
    const value = String(item[key]);
    if (arr.some(x => String(x?.[key] || '') === value)) return false;
    arr.unshift(item);
    if (arr.length > limit) arr.length = limit;
    return true;
  };

  const aliases = {
    nova40:'novaUltimate', novaultimate:'novaUltimate', ultimate:'novaUltimate', 'nova-ultimate':'novaUltimate',
    launcher:'novaLauncher', novalauncher:'novaLauncher',
    pagebrain:'pagebrain', talkpage:'talkpage', 'talk-to-page':'talkpage',
    research:'research40', research40:'research40', vault:'vault40', vault40:'vault40',
    timeline:'timeline40', continue:'continue40', 'continue-anywhere':'continue40',
    webpowers:'webpowers40', 'web-superpowers':'webpowers40', visual:'visual40', 'visual-search':'visual40',
    translate:'translate40', 'magic-translate':'translate40', workspacesplus:'workspaces40', workspaces40:'workspaces40',
    islands2:'islands40', 'islands-2':'islands40', spaces2:'spaces40', 'spaces-2':'spaces40',
    studio:'studio40', flows:'flows40', extensions2:'extensions40', companion:'companion40', sync:'sync40', desktop:'desktop40',
    'smart-tab-groups':'smarttabs', smarttabs:'smarttabs', pinboard:'pinboard', memory:'memory31',
    search:'search31', searchanything:'search31', preview:'preview31', linkpreview:'preview31', sitethemes:'sitethemes',
    notifications:'notifications31', automations:'automations', mini:'mini31', send:'sendbox', novasend:'sendbox',
    snapshots:'snapshots', snapshot:'snapshots', daily:'daily', permissions:'permissions31', cleanup:'cleanup31'
  };

  if (!document.getElementById('nova40-style')) {
    const css = document.createElement('style'); css.id = 'nova40-style';
    css.textContent = `
      .n40-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:28px}
      .n40-hero{padding:22px;border:1px solid var(--bd);border-radius:24px;background:radial-gradient(circle at 92% 6%,color-mix(in srgb,var(--acc) 18%,transparent),transparent 45%),var(--bar);box-shadow:0 18px 65px #0002}
      .n40-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);font-weight:800}.n40-title{font-size:31px;font-weight:650;letter-spacing:-.03em}.n40-sub{color:var(--mut);line-height:1.6;max-width:900px}
      .n40-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}.n40-card{display:flex;flex-direction:column;gap:8px;padding:15px;border:1px solid var(--bd);border-radius:18px;background:var(--bar)}
      .n40-card:hover{border-color:color-mix(in srgb,var(--acc) 55%,var(--bd));box-shadow:0 10px 30px #0002}.n40-card h3{margin:0}
      .n40-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}.n40-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}
      .n40-meta{min-width:0}.n40-meta b,.n40-meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n40-meta span{color:var(--mut);font-size:12px;margin-top:3px}
      .n40-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n40-chip.on{border-color:var(--acc);color:var(--acc)}
      .n40-code{white-space:pre-wrap;word-break:break-word;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}
      .n40-modal{position:fixed;inset:0;z-index:980;display:grid;place-items:center;background:rgba(0,0,0,.24);backdrop-filter:blur(10px)}.n40-dialog{width:min(840px,94vw);max-height:88vh;overflow:auto;padding:18px;border:1px solid var(--bd);border-radius:24px;background:color-mix(in srgb,var(--bar) 97%,transparent);box-shadow:0 30px 110px #0009}
      .n40-command{display:flex;flex-direction:column;gap:10px}.n40-command input{font-size:18px;padding:14px 15px}.n40-result{display:flex;align-items:center;gap:12px;padding:11px 12px;border:1px solid transparent;border-radius:13px;cursor:pointer}.n40-result:hover,.n40-result.sel{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent)}.n40-result .grow{flex:1;min-width:0}.n40-result small{display:block;color:var(--mut);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .n40-dock{position:fixed;left:12px;top:50%;transform:translateY(-50%);z-index:940;display:flex;flex-direction:column;gap:5px;padding:7px;border:1px solid var(--bd);border-radius:18px;background:color-mix(in srgb,var(--bar) 93%,transparent);box-shadow:0 18px 65px #0005;backdrop-filter:blur(18px)}
      .n40-dock button{width:38px;height:38px;border:0;border-radius:12px;background:transparent;color:var(--fg);cursor:pointer;font-size:16px}.n40-dock button:hover{background:color-mix(in srgb,var(--acc) 12%,transparent);color:var(--acc)}
      .n40-empty{padding:15px;border:1px dashed var(--bd);border-radius:14px;color:var(--mut)}
      .n40-float{position:fixed;right:18px;bottom:18px;z-index:930;width:min(360px,calc(100vw - 36px));padding:14px;border:1px solid var(--acc);border-radius:20px;background:color-mix(in srgb,var(--bar) 96%,transparent);box-shadow:0 22px 90px #0008;backdrop-filter:blur(20px)}
      .n40-mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.n40-mini-grid .btn{width:100%}
      @media(max-width:760px){.n40-grid{grid-template-columns:1fr}.n40-row{align-items:flex-start;flex-direction:column}.n40-mini-grid{grid-template-columns:1fr}.n40-dock{left:7px}}
    `;
    document.head.appendChild(css);
  }

  const page = (kicker,title,desc,body='') => `<div class="n40-page"><div class="n40-kicker">${esc(kicker)}</div><div class="n40-title">${esc(title)}</div><div class="n40-sub">${esc(desc)}</div>${body}</div>`;
  const btn = (label, attr='', cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const card = (icon,title,desc,actions='') => `<div class="n40-card"><div style="font-size:23px">${icon}</div><h3>${esc(title)}</h3><div class="mut">${esc(desc)}</div>${actions ? `<div class="n40-actions">${actions}</div>` : ''}</div>`;

  async function extractPage(t=current().t, max=14000) {
    if (!t) return null;
    let tabUrl='';
    try { tabUrl=http(t.wv.getURL?.()||''); } catch {}
    if (!tabUrl) return null;
    const tabTitle=(() => { try { return t.el?.querySelector?.('span')?.textContent || tabUrl; } catch { return tabUrl; } })();
    const payload = await inject(t, `(()=>{const clean=s=>String(s||'').replace(/\\s+/g,' ').trim();const pick=(q,n)=>[...document.querySelectorAll(q)].map(x=>clean(x.innerText||x.textContent)).filter(Boolean).slice(0,n);return {title:document.title||'',url:location.href,headings:pick('h1,h2,h3',18),paragraphs:pick('article p,main p,p,li',24),selection:clean(window.getSelection?.().toString()||''),text:clean(document.body?.innerText||'').slice(0,${Math.max(1000, max)}),linkCount:document.links?.length||0};})()`);
    if (payload && typeof payload === 'object') return payload;
    return {title:tabTitle,url:tabUrl,headings:[],paragraphs:[],selection:'',text:'',linkCount:0};
  }

  const askAI = async (question, context='', system='Eres Nova IA. Responde de forma clara, útil y breve. Separa hechos de inferencias.') => {
    const q = String(question || '').trim(); if (!q) return { error:'Pregunta vacía.' };
    try {
      return await ipc.invoke('ai-ask', {
        msgs: [{role:'user', content:q}],
        system: system + (context ? '\n\nContexto proporcionado por el usuario:\n' + String(context).slice(0,18000) : ''),
        model: S.model
      });
    } catch (e) { return {error:e?.message || 'No se pudo consultar Nova IA.'}; }
  };

  const currentSnapshot = async () => {
    const c = current();
    if (!c.url) return null;
    const data = await extractPage(c.t, 18000);
    if (!data) return null;
    return {
      title: data.title || c.title,
      url: data.url || c.url,
      host: c.host,
      at: now(),
      headings: data.headings || [],
      paragraphs: data.paragraphs || [],
      wordCount: String(data.text||'').split(/\s+/).filter(Boolean).length,
      linkCount: Number(data.linkCount || 0)
    };
  };

  const saveCurrentPage = (extra={}) => {
    const c=current();
    if (!c.url) { toast40('Abre una página web primero'); return false; }
    const ok = pushUnique(st.vault, {id:'v'+now(), type:'page', title:c.title||c.host, url:c.url, createdAt:now(), ...extra}, 'url', 250);
    save(); toast40(ok ? 'Guardado en Nova Vault' : 'Ya estaba guardada'); return ok;
  };

  const pinCurrent = () => {
    const c=current();
    if (!c.url) { toast40('Abre una página web primero'); return false; }
    S.nova31 = S.nova31 || {}; S.nova31.pinboard = Array.isArray(S.nova31.pinboard) ? S.nova31.pinboard : [];
    const ok = pushUnique(S.nova31.pinboard, {title:c.title||c.host,url:c.url,createdAt:now()}, 'url', 250);
    save(); toast40(ok ? 'Añadido al Pinboard' : 'Ya estaba en el Pinboard'); return ok;
  };

  const collectTabs = async (withText=false) => {
    const out=[];
    for (const t of (tabs || [])) {
      try {
        const url=http(t.wv.getURL?.()||'');
        if (!url || !t.wv?.executeJavaScript || t.wv.classList?.contains?.('ipage')) continue;
        const title=t.el?.querySelector?.('span')?.textContent||url;
        const row={url,title};
        if (withText) {
          const d=await extractPage(t,8000);
          if (d) Object.assign(row,{headings:d.headings||[],paragraphs:d.paragraphs||[],text:d.text||''});
        }
        out.push(row);
      } catch {}
    }
    return out;
  };

  // ---------- Unified Launcher ----------
  const baseCommands = () => [
    ['✦ Nova Ultimate','Todo Nova en un sitio','novaUltimate'],['🧠 Page Brain','Entender la página actual','pagebrain'],['💬 Talk to Page','Preguntar sobre la página','talkpage'],
    ['📚 Research Mode','Investigar varias pestañas','research40'],['🗃️ Vault','Guardar y encontrar cosas','vault40'],['📌 Pinboard','Guardado temporal','pinboard'],['⚡ Quick Actions','Acciones rápidas','quick'],
    ['🪄 Flows','Automatizaciones','flows40'],['🧩 Workspaces+','Packs de pestañas','workspaces40'],['🪐 Spaces 2.0','Contextos guardados','spaces40'],['🏝️ Islands 2.0','Notas flotantes','islands40'],
    ['🎨 Nova Studio','Personalización','studio40'],['🌍 Translate','Traducción','translate40'],['🔎 Search','Búsqueda en la web','search31'],['☀️ Daily','Continuar','daily'],['📱 Companion','Enviar a otro dispositivo','companion40'],
    ['☁️ Sync','Exportar/importar','sync40'],['🖥️ Desktop Mode','Panel de herramientas','desktop40']
  ];

  const allCommands = () => {
    const out=baseCommands().map(x=>({label:x[0],sub:x[1],run:()=>open(x[2])}));
    const seen=new Set(out.map(x=>x.label));
    for (const [label, fn] of (N.extraActs || [])) if (typeof fn==='function' && !seen.has(label)) { out.push({label:String(label),sub:'Nova',run:fn}); seen.add(label); }
    for (const key of Object.keys(N.PG)) {
      if (['novaUltimate','novaLauncher'].includes(key)) continue;
      const label=key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/31|40/g,'').replace(/^\w/,m=>m.toUpperCase());
      if (seen.has(label)) continue;
      out.push({label:'Nova · '+label,sub:'Página interna',run:()=>open(key)}); seen.add(label);
    }
    return out;
  };

  function launcher(seed='') {
    document.getElementById('nova40-launcher')?.remove();
    const ov=document.createElement('div'); ov.id='nova40-launcher'; ov.className='n40-modal';
    ov.innerHTML=`<div class="n40-dialog n40-command"><div class="row"><b>Nova Launcher</b><span class="mut">Ctrl/Cmd + Space · ↑↓ · Enter</span></div><input class="fld" id="n40-q" autocomplete="off" placeholder="Busca una función, pestaña, historial o URL…" value="${esc(seed)}"><div id="n40-r"></div><div class="mut">Consejo: escribe “Writer”, “Reader”, “QR”, “Media”, “Downloads”…</div></div>`;
    document.body.appendChild(ov);
    const q=ov.querySelector('#n40-q'), out=ov.querySelector('#n40-r'); let index=0;
    const dynamic=()=>{
      const items=[]; const query=q.value.toLowerCase().trim();
      for (const x of allCommands()) if (!query || x.label.toLowerCase().includes(query) || x.sub.toLowerCase().includes(query)) items.push(x);
      for (const t of (tabs||[])) { try { const label=t.el?.querySelector?.('span')?.textContent||'Pestaña'; const url=t.wv.getURL?.()||''; if (!query || label.toLowerCase().includes(query)||url.toLowerCase().includes(query)) items.push({label,sub:'Pestaña',run:()=>{try{return N.selectTab?.(t) || sel?.(t);}catch{return null;}}}); } catch {} }
      for (const x of (S.hist||[]).slice(0,40)) { const label=String(x.t||x.u||'Historial'); const url=String(x.u||''); if (!query || label.toLowerCase().includes(query)||url.toLowerCase().includes(query)) items.push({label,sub:'Historial',run:()=>http(url)&&newTab(url)}); }
      if (http(q.value.trim())) items.unshift({label:'Abrir URL',sub:q.value.trim(),run:()=>newTab(http(q.value.trim()))});
      return items.slice(0,30);
    };
    const paint=()=>{
      const items=dynamic(); if(index>=items.length) index=Math.max(0,items.length-1);
      out.innerHTML=items.map((x,i)=>`<div class="n40-result ${i===index?'sel':''}" data-i="${i}"><div class="grow"><b>${esc(x.label)}</b><small>${esc(x.sub)}</small></div><span>↵</span></div>`).join('')||'<div class="n40-empty">Nada encontrado.</div>';
      out.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{const x=items[+el.dataset.i];ov.remove();x?.run?.();});
    };
    q.oninput=()=>{index=0;paint();};
    q.onkeydown=e=>{
      const items=dynamic();
      if(e.key==='ArrowDown'){e.preventDefault();index=Math.min(index+1,Math.max(items.length-1,0));paint();}
      else if(e.key==='ArrowUp'){e.preventDefault();index=Math.max(index-1,0);paint();}
      else if(e.key==='Enter'){e.preventDefault();ov.remove();items[index]?.run?.();}
      else if(e.key==='Escape'){e.preventDefault();ov.remove();}
    };
    ov.onclick=e=>{if(e.target===ov)ov.remove();}; paint(); q.focus(); q.select?.();
  }

  function quickActions() {
    document.getElementById('nova40-quick')?.remove();
    const ov=document.createElement('div'); ov.id='nova40-quick'; ov.className='n40-modal';
    ov.innerHTML=`<div class="n40-dialog"><div class="row"><b>⚡ Quick Actions</b><button class="btn" id="qa-close">×</button></div><div class="n40-mini-grid" style="margin-top:12px">${[
      ['📌','Pinboard',pinCurrent],['💾','Vault',saveCurrentPage],['🧠','Brain',()=>open('pagebrain')],['📸','Snapshot',()=>open('snapshots')],['📖','Reader+',()=>N.openFeature?.('reader')],['📝','Writer',()=>N.openFeature?.('writer')],['🔊','PIP',()=>N.openFeature?.('pip')],['⬇','Downloads',()=>N.openFeature?.('descargas2')],['⌕','Launcher',()=>launcher()],['✦','Ultimate',()=>open('novaUltimate')]
    ].map((x,i)=>`<button class="btn" data-i="${i}">${x[0]} ${esc(x[1])}</button>`).join('')}</div></div>`;
    document.body.appendChild(ov);
    const actions=[pinCurrent,saveCurrentPage,()=>open('pagebrain'),()=>open('snapshots'),()=>N.openFeature?.('reader'),()=>N.openFeature?.('writer'),()=>N.openFeature?.('pip'),()=>N.openFeature?.('descargas2'),()=>{ov.remove();launcher();},()=>{ov.remove();open('novaUltimate')}];
    ov.querySelector('#qa-close').onclick=()=>ov.remove(); ov.onclick=e=>{if(e.target===ov)ov.remove();}; ov.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>actions[+b.dataset.i]?.());
  }

  function showDock() {
    const existing=document.getElementById('nova40-dock');
    if(existing){existing.remove();st.settings.dock=false;save();return;}
    const d=document.createElement('div'); d.id='nova40-dock'; d.className='n40-dock';
    d.innerHTML='<button title="Ultimate">✦</button><button title="Launcher">⌕</button><button title="Quick Actions">⚡</button><button title="Vault">🗃</button><button title="Brain">🧠</button><button title="Cerrar">×</button>';
    document.body.appendChild(d); st.settings.dock=true; save();
    const b=d.querySelectorAll('button');
    b[0].onclick=()=>open('novaUltimate'); b[1].onclick=()=>launcher(); b[2].onclick=quickActions; b[3].onclick=()=>open('vault40'); b[4].onclick=()=>open('pagebrain'); b[5].onclick=()=>showDock();
  }

  const addTop = () => {
    const host=document.getElementById('nova22-top-tools'); if (!host || host.querySelector('#n40-top')) return;
    const b=document.createElement('button'); b.id='n40-top'; b.className='nova22-topbtn'; b.textContent='✦'; b.title='Nova Ultimate'; b.onclick=()=>open('novaUltimate'); host.appendChild(b);
  };
  addTop();
  if (st.settings.dock) showDock();

  // ---------- Hub ----------
  N.PG.novaUltimate = r => {
    const c=current(); const vault=st.vault.length + (S.nova31?.memory?.length||0); const tabsCount=(tabs||[]).length;
    const groups=[
      ['🤖 Intelligence','Entender, preguntar e investigar',['pagebrain','talkpage','research40']],
      ['🗃️ Space','Guardar, recuperar y continuar',['vault40','timeline40','continue40']],
      ['🌐 Web Powers','Herramientas encima de la web',['webpowers40','visual40','translate40','snapshots']],
      ['🧩 Organize','Pestañas, Islands y Spaces',['workspaces40','islands40','spaces40']],
      ['⚙️ Build','Personaliza y automatiza',['studio40','flows40','extensions40']],
      ['🌍 Ecosystem','Conecta y exporta',['companion40','sync40','desktop40']],
      ['✨ Nova 3.1','Las novedades que ya tienes',['quick','pinboard','memory31','search31','preview31','sitethemes','notifications31','automations','mini31','sendbox','snapshots','daily','permissions31','cleanup31']]
    ];
    r.innerHTML=page('NOVA ULTIMATE','Nova Ultimate','Todo lo nuevo, reunido en una sola superficie. Las funciones antiguas no se sustituyen.',
      `<div class="n40-hero"><div class="row"><div><div class="n40-title" style="font-size:24px">${c.url?esc(c.title||c.host):'Tu centro de Nova'}</div><div class="n40-sub" style="margin-top:5px">${c.url?esc(c.host):'Abre una web y usa las acciones contextuales.'}</div></div><span class="n40-chip on">${tabsCount} pestañas</span></div><div class="n40-actions" style="margin-top:12px">${btn('⌕ Buscar todo','id="n40-launch"','on')}${btn('⚡ Acciones rápidas','id="n40-quick"')}${btn('🧠 Analizar página','id="n40-brain"')}${btn('📌 Guardar','id="n40-save"')}${btn('☰ Dock','id="n40-dock"')}</div><div class="n40-actions" style="margin-top:9px"><span class="n40-chip">🗃️ ${vault} guardados/recuerdos</span><span class="n40-chip">⚙️ ${st.flows.length} Flows</span><span class="n40-chip">🧩 ${st.workspaces.length} Workspaces</span></div></div>`+
      `<div class="n40-grid">${groups.map(g=>`<div class="n40-card"><h3>${esc(g[0])}</h3><div class="mut">${esc(g[1])}</div><div class="n40-actions">${g[2].slice(0,6).map(route=>btn(labelFor(route),`data-route="${esc(route)}"`)).join('')}</div>${g[2].length>6?`<div class="n40-actions">${btn('Ver todo',`data-more="${esc(g[0])}"`)}</div>`:''}</div>`).join('')}</div>`
    );
    r.querySelector('#n40-launch').onclick=()=>launcher(); r.querySelector('#n40-quick').onclick=quickActions; r.querySelector('#n40-brain').onclick=()=>open('pagebrain'); r.querySelector('#n40-save').onclick=()=>saveCurrentPage(); r.querySelector('#n40-dock').onclick=showDock;
    r.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>open(b.dataset.route));
    r.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>launcher(b.dataset.more));
  };

  const labels = {
    pagebrain:'🧠 Page Brain',talkpage:'💬 Talk to Page',research40:'📚 Research',vault40:'🗃️ Vault',timeline40:'🕒 Timeline',continue40:'↩️ Continue',
    webpowers40:'⚙️ Web Powers',visual40:'🔎 Visual Search',translate40:'🌍 Translate',snapshots:'📸 Snapshot',workspaces40:'🧩 Workspaces+',islands40:'🏝️ Islands',spaces40:'🪐 Spaces',
    studio40:'🎨 Studio',flows40:'⚡ Flows',extensions40:'🧩 Extensions',companion40:'📱 Companion',sync40:'☁️ Sync',desktop40:'🖥️ Desktop',quick:'⚡ Quick Actions',pinboard:'📌 Pinboard',memory31:'🧠 Memory',search31:'⌕ Search',preview31:'👀 Preview',sitethemes:'🎨 Site Themes',notifications31:'🔔 Notifications',automations:'🪄 Automations',mini31:'🪟 Mini Mode',sendbox:'📤 Nova Send',daily:'☀️ Daily',permissions31:'🛡 Permissions',cleanup31:'🧹 Cleanup'
  };
  const labelFor = route => labels[route] || ('Nova · ' + String(route).replace(/([a-z])([A-Z])/g,'$1 $2'));

  // ---------- Intelligence ----------
  N.PG.pagebrain = r => {
    r.innerHTML=page('INTELLIGENCE','Page Brain','Analiza la página actual y, cuando hay IA disponible, permite preguntas con contexto.',`<div class="n40-card"><div class="n40-actions">${btn('🧠 Analizar','id="brain-run"','on')}${btn('🤖 Preguntar a Nova','id="brain-ai"')}${btn('💾 Guardar informe','id="brain-save"')}</div><div id="brain-out" class="n40-code">Listo para analizar.</div></div>`);
    let report='';
    r.querySelector('#brain-run').onclick=async()=>{const out=r.querySelector('#brain-out');out.textContent='Analizando…';const d=await currentSnapshot();if(!d){out.textContent='Abre una web primero.';return;}report=[`# ${d.title}`,`URL: ${d.url}`,`Palabras: ${d.wordCount}`,'','## Encabezados',...(d.headings||[]).map((x,i)=>`${i+1}. ${x}`),'','## Extractos',...(d.paragraphs||[]).slice(0,12).map(x=>`• ${shortText(x,500)}`)].join('\n');out.textContent=report;};
    r.querySelector('#brain-ai').onclick=async()=>{const d=await extractPage(current().t,16000);if(!d){toast40('Abre una web primero');return;}const q=String(prompt('¿Qué quieres saber de esta página?','Resume lo más importante')||'').trim();if(!q)return;const out=r.querySelector('#brain-out');out.textContent='Nova está pensando…';const resp=await askAI(q,`Título: ${d.title}\nURL: ${d.url}\n\n${d.text}`,'Eres Nova IA dentro de un navegador. Responde solo con base en el contexto proporcionado y di claramente cuando no hay suficiente información.');out.textContent=resp?.text||resp?.error||'No hubo respuesta.';report=out.textContent;};
    r.querySelector('#brain-save').onclick=()=>{if(!report)return toast40('Analiza o pregunta primero');st.vault.unshift({id:'v'+now(),type:'brain',title:'Page Brain — '+currentTitle(),text:report,createdAt:now()});save();toast40('Informe guardado')};
  };

  N.PG.talkpage = r => {
    r.innerHTML=page('INTELLIGENCE','Talk to Page','Pregunta sobre la página. Nova usa el contenido actual como contexto y puede caer a búsqueda local.',`<div class="n40-card"><input class="fld" id="talk-q" placeholder="¿Qué quieres saber?"><div class="n40-actions">${btn('Enviar','id="talk-go"','on')}${btn('Guardar','id="talk-save"')}</div><div id="talk-out" class="n40-code">Ejemplos: “precio”, “requisitos”, “resume esto”…</div></div>`);
    let last='';
    r.querySelector('#talk-go').onclick=async()=>{const q=String(r.querySelector('#talk-q').value||'').trim();if(!q)return;const d=await extractPage(current().t,12000);if(!d){r.querySelector('#talk-out').textContent='Abre una web primero.';return;}r.querySelector('#talk-out').textContent='Consultando…';const resp=await askAI(q,`Título: ${d.title}\nURL: ${d.url}\n\n${d.text}`,'Eres Nova Talk to Page. Responde con claridad, cita datos del contexto y no inventes información ausente.');last=resp?.text||resp?.error||'';if(!last){const low=q.toLowerCase();const hits=(d.paragraphs||[]).filter(x=>x.toLowerCase().includes(low)).slice(0,10);last=hits.join('\n\n')||'No encontré una respuesta en esta página.';}r.querySelector('#talk-out').textContent=last;};
    r.querySelector('#talk-save').onclick=()=>{if(!last)return toast40('Pregunta primero');st.vault.unshift({id:'v'+now(),type:'note',title:'Talk to Page — '+currentTitle(),text:last.slice(0,8000),createdAt:now()});save();toast40('Guardado en Vault');};
    r.querySelector('#talk-q').onkeydown=e=>{if(e.key==='Enter')r.querySelector('#talk-go').click();};
  };

  N.PG.research40 = r => {
    r.innerHTML=page('RESEARCH','Research Mode','Crea un informe real a partir de tus pestañas web, no solo una lista de URLs.',`<div class="n40-card"><div class="row"><span class="mut" id="res-count">Preparando…</span><div class="n40-actions">${btn('📚 Analizar pestañas','id="res-run"','on')}${btn('🤖 Sintetizar con IA','id="res-ai"')}${btn('💾 Guardar','id="res-save"')}</div></div><div id="res-out" class="n40-code">Pulsa “Analizar pestañas”.</div></div>`);
    let report=''; let data=[];
    r.querySelector('#res-count').textContent=`${(tabs||[]).length} pestañas abiertas`;
    r.querySelector('#res-run').onclick=async()=>{const out=r.querySelector('#res-out');out.textContent='Leyendo pestañas…';data=await collectTabs(true);report=['# Nova Research',`Generado: ${new Date().toLocaleString('es')}`,'',...data.map((x,i)=>`## ${i+1}. ${x.title}\n${x.url}\n${(x.headings||[]).slice(0,6).map(h=>'- '+h).join('\n')}\n${shortText((x.paragraphs||[]).join(' '),900)}`)].join('\n\n');out.textContent=report;};
    r.querySelector('#res-ai').onclick=async()=>{if(!data.length)data=await collectTabs(true);if(!data.length){toast40('No hay pestañas web');return;}const ctx=data.map((x,i)=>`FUENTE ${i+1}: ${x.title}\n${x.url}\n${x.text}`).join('\n\n').slice(0,26000);r.querySelector('#res-out').textContent='Sintetizando…';const resp=await askAI('Compara y resume estas fuentes, destacando coincidencias, diferencias y preguntas abiertas.',ctx,'Eres Nova Research. Usa únicamente las fuentes proporcionadas y nombra las URLs de las fuentes cuando afirmes algo importante.');report=resp?.text||resp?.error||'Sin respuesta.';r.querySelector('#res-out').textContent=report;};
    r.querySelector('#res-save').onclick=()=>{if(!report)return toast40('Genera un informe primero');st.vault.unshift({id:'v'+now(),type:'research',title:'Nova Research',text:report,createdAt:now()});save();toast40('Investigación guardada');};
  };

  // ---------- Personal Space ----------
  N.PG.vault40 = r => {
    const list=st.vault;
    const render=(query='')=>{const q=query.toLowerCase().trim();const filtered=list.filter(x=>!q||[x.title,x.url,x.text,x.type].some(v=>String(v||'').toLowerCase().includes(q)));r.innerHTML=page('VAULT','Nova Vault','Un solo lugar para páginas, notas, análisis e investigaciones.',`<div class="n40-actions"><input class="fld" id="vault-q" placeholder="Buscar en Vault…" value="${esc(query)}">${btn('＋ Nota','id="vault-note"','on')}${btn('🌐 Página','id="vault-page"')}${btn('💾 Exportar','id="vault-export"')}</div><div class="n40-list">${filtered.map(x=>{const i=list.indexOf(x);return `<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.type||'Elemento')}</b><span>${esc(x.type||'item')}${x.url?' · '+esc(x.url):''}</span></div><div class="n40-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${x.type==='note'||x.type==='brain'?btn('Editar',`data-edit="${i}"`):''}${btn('Borrar',`data-del="${i}"`)}</div></div>`}).join('')||'<div class="n40-empty">No hay resultados.</div>'}</div>`);
      r.querySelector('#vault-q').oninput=e=>render(e.target.value); r.querySelector('#vault-note').onclick=()=>{const text=String(prompt('Nota','')||'').trim();if(!text)return;list.unshift({id:'v'+now(),type:'note',title:'Nota',text,createdAt:now()});save();render(query);}; r.querySelector('#vault-page').onclick=()=>saveCurrentPage();
      r.querySelector('#vault-export').onclick=async()=>{const f=await ipc.invoke('save-text',{name:'Nova-Vault',ext:'json',content:JSON.stringify(list,null,2)}).catch(()=>null);toast40(f?'Vault exportado':'No se pudo exportar');};
      r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();render(query)});r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.edit];if(!x)return;const text=String(prompt('Texto',x.text||'')||'').trim();if(text){x.text=text;save();render(query)}});
    }; render();
  };

  const timelineItems=()=>[...(st.timeline||[]),...(S.hist||[]).slice(0,80).map(x=>({type:'visit',title:x.t||x.u,url:x.u,at:x.d||now()}))].sort((a,b)=>Number(b.at||b.createdAt||0)-Number(a.at||a.createdAt||0));
  N.PG.timeline40 = r => { const render=(q='')=>{const items=timelineItems().filter(x=>!q||[x.title,x.url,x.type].some(v=>String(v||'').toLowerCase().includes(q.toLowerCase())));r.innerHTML=page('TIMELINE','Timeline','Recupera lo importante por fecha y vuelve a abrirlo.',`<div class="n40-actions"><input class="fld" id="tl-q" placeholder="Buscar timeline…" value="${esc(q)}">${btn('🧭 Registrar actual','id="tl-now"','on')}${btn('🧹 Limpiar','id="tl-clear"')}</div><div class="n40-list">${items.slice(0,100).map(x=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.url||x.type)}</b><span>${esc(x.type||'evento')} · ${new Date(x.at||x.createdAt||now()).toLocaleString('es')}</span></div>${x.url?btn('Abrir',`data-url="${esc(x.url)}"`):''}</div>`).join('')||'<div class="n40-empty">Aún no hay actividad.</div>'}</div>`);r.querySelector('#tl-q').oninput=e=>render(e.target.value);r.querySelector('#tl-now').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');st.timeline.unshift({type:'visit',title:c.title,url:c.url,at:now()});save();render(q)};r.querySelector('#tl-clear').onclick=()=>{st.timeline=[];save();render(q)};r.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>newTab(b.dataset.url));}; render(); };

  N.PG.continue40 = r => {
    const list=st.sessions;
    r.innerHTML=page('CONTINUE','Continue Anywhere','Guarda la sesión completa y recupera sus pestañas cuando quieras.',`<div class="n40-actions">${btn('💾 Guardar sesión','id="cont-save"','on')}${btn('🧹 Borrar todas','id="cont-clear"')}</div><div class="n40-list">${list.map((s,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(s.name||'Sesión')}</b><span>${(s.tabs||[]).length} pestañas · ${new Date(s.createdAt||now()).toLocaleString('es')}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No hay sesiones guardadas.</div>'}</div>`);
    r.querySelector('#cont-save').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre de la sesión','Mi sesión')||'Mi sesión').trim()||'Mi sesión';list.unshift({id:'s'+now(),name,tabs:ts,createdAt:now()});list.splice(20);save();N.PG.continue40(r);toast40('Sesión guardada');};r.querySelector('#cont-clear').onclick=()=>{list.length=0;save();N.PG.continue40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(list[+b.dataset.open]?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast40('Sesión reabierta')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.continue40(r)});
  };

  // ---------- Web powers ----------
  const profileForTab=t=>{if(!t)return null;let url='';try{url=http(t.wv.getURL?.()||'')}catch{}const host=hostOf(url);return host?{host,profile:st.siteProfiles[host]||{}}:null;};
  const siteRule=()=>{const c=current();return c.host?(st.siteProfiles[c.host]||(st.siteProfiles[c.host]={})):null;};
  const applySiteFor=async t=>{const meta=profileForTab(t);if(!meta)return;const p=meta.profile;const css=[p.large?'body{font-size:1.16em!important}':'',p.clean?'header,nav,aside,footer,[role="banner"],[role="navigation"]{display:none!important}':'',p.reader?'body{max-width:820px!important;margin:auto!important;font:19px/1.8 system-ui,sans-serif!important}img,video{max-width:100%!important;height:auto!important}':''].join('');await inject(t,`(()=>{let s=document.getElementById('__nova40_site');if(!s){s=document.createElement('style');s.id='__nova40_site';document.head.appendChild(s)}s.textContent=${JSON.stringify(css)};return true})()`);};
  const applySite=()=>applySiteFor(current().t);
  N.PG.webpowers40=r=>{const p=siteRule()||{};r.innerHTML=page('WEB','Web Superpowers','Preferencias por sitio que se recuerdan automáticamente.',`<div class="n40-card"><h3>${esc(current().host||'Sin sitio')}</h3><label><input type="checkbox" id="wp-large" ${p.large?'checked':''}> Texto grande</label><label><input type="checkbox" id="wp-clean" ${p.clean?'checked':''}> Modo limpio</label><label><input type="checkbox" id="wp-reader" ${p.reader?'checked':''}> Reader local</label><div class="n40-actions">${btn('Aplicar','id="wp-apply"','on')}${btn('↗ Pop-out','id="wp-pop"')}${btn('📌 Guardar selección','id="wp-sel"')}</div></div>`);r.querySelector('#wp-apply').onclick=()=>{const c=current();if(!c.host)return toast40('Abre una web');st.siteProfiles[c.host]={large:r.querySelector('#wp-large').checked,clean:r.querySelector('#wp-clean').checked,reader:r.querySelector('#wp-reader').checked};save();applySite();toast40('Perfil aplicado')};r.querySelector('#wp-pop').onclick=()=>{try{N.popOut40?.()}catch{}};r.querySelector('#wp-sel').onclick=async()=>{const c=current();const txt=await inject(c.t,`window.getSelection?.().toString()||''`);if(!txt)return toast40('Selecciona texto');st.vault.unshift({id:'v'+now(),type:'selection',title:'Selección · '+currentTitle(),text:String(txt).slice(0,10000),createdAt:now()});save();toast40('Selección guardada')};};

  N.PG.workspaces40 = r => { const list=st.workspaces; r.innerHTML=page('WORKSPACE','Workspaces+','Guarda paquetes de pestañas para recuperarlos con un clic.',`<div class="n40-actions">${btn('＋ Crear workspace','id="ws-new"','on')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.name)}</b><span>${(x.tabs||[]).length} pestañas</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Todavía no hay Workspaces+.</div>'}</div>`);r.querySelector('#ws-new').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre','Trabajo')||'Trabajo').trim()||'Workspace';list.unshift({id:'w'+now(),name,tabs:ts,createdAt:now()});save();N.PG.workspaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(list[+b.dataset.open]?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast40('Workspace abierto')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.workspaces40(r)}); };
  N.PG.spaces40 = r => { const list=st.workspaces.filter(x=>x.kind==='space'); r.innerHTML=page('SPACES 2.0','Spaces 2.0','Una capa fácil para recuperar contextos de trabajo.',`<div class="n40-actions">${btn('＋ Crear Space','id="sp-new"','on')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🪐 ${esc(x.name)}</b><span>${(x.tabs||[]).length} pestañas</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Aún no hay Spaces.</div>'}</div>`);r.querySelector('#sp-new').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas');const name=String(prompt('Nombre del Space','Personal')||'Personal').trim()||'Space';st.workspaces.unshift({id:'sp'+now(),name,tabs:ts,createdAt:now(),kind:'space'});save();N.PG.spaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.open];(x?.tabs||[]).forEach(t=>t.url&&newTab(t.url));}); };

  N.PG.islands40 = r => { const list=st.islands; r.innerHTML=page('ISLANDS 2.0','Islands 2.0','Pequeñas tarjetas flotantes para dejar cosas a la vista.',`<div class="n40-actions">${btn('＋ Nueva Island','id="is-new"','on')}${btn('✦ Mostrar','id="is-show"')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.name)}</b><span>${esc(x.text||'')}</span></div><div class="n40-actions">${btn('Editar',`data-edit="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Crea una Island para verla aquí y en flotante.</div>'}</div>`);r.querySelector('#is-new').onclick=()=>{const c=current();const name=String(prompt('Nombre','Nueva Island')||'Nueva Island').trim();if(!name)return;const text=String(prompt('Contenido',c.url?c.title:'')||'').trim();list.unshift({id:'i'+now(),name,text,url:c.url||'',createdAt:now()});save();N.PG.islands40(r)};r.querySelector('#is-show').onclick=showIslands;r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.edit];if(!x)return;const text=String(prompt('Contenido',x.text||'')||x.text||'');x.text=text;save();N.PG.islands40(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.islands40(r)});};
  function showIslands(){document.getElementById('nova40-floats')?.remove();const box=document.createElement('div');box.id='nova40-floats';box.className='n40-float';box.innerHTML=`<div class="row"><b>🏝️ Islands</b><button class="btn" id="is-close">×</button></div>${st.islands.map((x,i)=>`<div class="n40-row" style="margin-top:8px"><div class="n40-meta"><b>${esc(x.name)}</b><span>${esc(x.text||'')}</span></div>${x.url?btn('Abrir',`data-open="${i}"`):''}</div>`).join('')||'<div class="n40-empty" style="margin-top:8px">No hay Islands.</div>'}`;document.body.appendChild(box);box.querySelector('#is-close').onclick=()=>box.remove();box.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(st.islands[+b.dataset.open]?.url));}

  // ---------- Studio / Automation / Extensions ----------
  const applyStudio=()=>{const x=st.customStudio||{};if(x.accent)document.documentElement.style.setProperty('--acc',x.accent);if(x.radius)document.documentElement.style.setProperty('--r',Math.max(6,Math.min(28,Number(x.radius)))+'px');};
  N.PG.studio40=r=>{const x=st.customStudio||{};r.innerHTML=page('STUDIO','Nova Studio','Ajusta la superficie de Nova sin tocar los módulos antiguos.',`<div class="n40-card"><div class="row"><label>Acento <input type="color" id="st-color" value="${esc(x.accent||'#5b8cff')}"></label><label>Radio <input type="range" id="st-radius" min="8" max="28" value="${Number(x.radius)||16}"></label></div><div class="n40-actions">${btn('Aplicar','id="st-apply"','on')}${btn('Restaurar','id="st-reset"')}</div></div>`);r.querySelector('#st-apply').onclick=()=>{st.customStudio={accent:r.querySelector('#st-color').value,radius:r.querySelector('#st-radius').value,density:1};save();applyStudio();toast40('Studio aplicado')};r.querySelector('#st-reset').onclick=()=>{st.customStudio={accent:'',radius:16,density:1};document.documentElement.style.removeProperty('--acc');document.documentElement.style.setProperty('--r','16px');save();N.PG.studio40(r)};}; applyStudio();

  const flowAction=async step=>{const t=String(step?.type||''),v=String(step?.value||'');if(t==='open'&&http(v)){newTab(v);return;}if(t==='feature'&&v){open(v);return;}if(t==='pin'){pinCurrent();return;}if(t==='note'&&v){st.vault.unshift({id:'v'+now(),type:'note',title:'Flow',text:v,createdAt:now()});save();return;}if(t==='island'){st.islands.unshift({id:'i'+now(),name:'Flow Island',text:v,url:current().url,createdAt:now()});save();showIslands();return;}if(t==='snapshot'){await open('snapshots');return;}};
  const runFlow=async f=>{for(const step of (f?.steps||[]))await flowAction(step);toast40('Flow completado: '+(f?.name||'Nova Flow'));};
  const flowPresets=[['Guardar web en Vault',[{type:'pin'}]],['Crear Island con título',[{type:'island',value:'Página actual'}]],['Abrir y guardar',[{type:'open',value:'https://example.com'},{type:'pin'}]]];
  N.PG.flows40=r=>{const list=st.flows;r.innerHTML=page('AUTOMATION','Nova Flows','Automatizaciones simples: crea, prueba y pausa sin programar.',`<div class="n40-card"><div class="n40-actions">${btn('＋ Nuevo Flow','id="flow-new"','on')}${flowPresets.map((x,i)=>btn('⚡ '+x[0],`data-preset="${i}"`)).join('')}</div></div><div class="n40-list">${list.map((f,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(f.name)}</b><span>${f.whenHost?'Al abrir '+esc(f.whenHost)+' · ':''}${(f.steps||[]).length} pasos · ${f.enabled===false?'pausado':'activo'}</span></div><div class="n40-actions">${btn('Ejecutar',`data-run="${i}"`)}${btn(f.enabled===false?'Activar':'Pausar',`data-toggle="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No tienes Flows.</div>'}</div>`);r.querySelector('#flow-new').onclick=()=>{const host=String(prompt('Sitio opcional que dispara el Flow','youtube.com')||'').trim().replace(/^www\./,'');const name=String(prompt('Nombre','Mi Flow')||'Mi Flow').trim()||'Mi Flow';const raw=String(prompt('Pasos: pin | note:Texto | island:Texto | open:https://... | feature:route','pin')||'pin').trim();const steps=raw.split('|').map(s=>s.trim()).filter(Boolean).map(s=>{const i=s.indexOf(':');return {type:i<0?s:s.slice(0,i),value:i<0?'':s.slice(i+1)}});list.unshift({id:'f'+now(),name,whenHost:host,steps,enabled:true,createdAt:now()});save();N.PG.flows40(r)};r.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const p=flowPresets[+b.dataset.preset];if(!p)return;list.unshift({id:'f'+now(),name:p[0],whenHost:'',steps:typeof structuredClone==='function'?structuredClone(p[1]):JSON.parse(JSON.stringify(p[1])),enabled:true,createdAt:now()});save();N.PG.flows40(r)});r.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>runFlow(list[+b.dataset.run]));r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const f=list[+b.dataset.toggle];if(f)f.enabled=f.enabled===false;save();N.PG.flows40(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.flows40(r)});};

  N.PG.extensions40=r=>{const list=st.extensions;r.innerHTML=page('EXTENSIONS','Extensions 2.0','Atajos personales que apuntan a rutas reales de Nova.',`<div class="n40-card"><div class="n40-actions">${btn('＋ Crear extensión','id="ext-new"','on')}</div></div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🧩 ${esc(x.name)}</b><span>${esc(x.route)}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No hay extensiones locales.</div>'}</div>`);r.querySelector('#ext-new').onclick=()=>{const name=String(prompt('Nombre','Mi comando')||'Mi comando').trim();const route=String(prompt('Ruta Nova','novaUltimate')||'novaUltimate').trim();if(!name||!internalRoute(route))return toast40('Nombre o ruta no válidos');list.unshift({id:'e'+now(),name,route:internalRoute(route),createdAt:now()});save();N.PG.extensions40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(list[+b.dataset.open]?.route));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.extensions40(r)});};

  // ---------- Web utilities ----------
  N.PG.visual40=r=>{r.innerHTML=page('WEB POWER','Visual Search','Busca la selección, el título o la URL actual con una sola acción.',`<div class="n40-card"><div class="n40-actions">${btn('🔎 Selección','id="vis-sel"','on')}${btn('🔎 Título/URL','id="vis-page"')}${btn('📸 Captura','id="vis-shot"')}</div></div>`);r.querySelector('#vis-sel').onclick=async()=>{const c=current();const t=await inject(c.t,`window.getSelection?.().toString()||''`);const q=String(t||'').trim()||c.title;if(!q)return toast40('No hay nada que buscar');newTab('https://www.google.com/search?q='+encodeURIComponent(q))};r.querySelector('#vis-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');newTab('https://www.google.com/search?q='+encodeURIComponent(c.title||c.url))};r.querySelector('#vis-shot').onclick=()=>open('snapshots');};
  N.PG.translate40=r=>{r.innerHTML=page('WEB POWER','Magic Translate','Traduce selección o página sin cambiar la original.',`<div class="n40-card"><div class="row"><label>Idioma <input class="fld" id="tr-lang" value="es" style="max-width:110px"></label><div class="n40-actions">${btn('🌍 Selección','id="tr-sel"','on')}${btn('🌍 Página','id="tr-page"')}</div></div></div>`);r.querySelector('#tr-sel').onclick=async()=>{const t=await inject(current().t,`window.getSelection?.().toString()||''`);if(!t)return toast40('Selecciona texto');const tl=String(r.querySelector('#tr-lang').value||'es').trim()||'es';newTab('https://translate.google.com/?sl=auto&tl='+encodeURIComponent(tl)+'&text='+encodeURIComponent(String(t)))};r.querySelector('#tr-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');const tl=String(r.querySelector('#tr-lang').value||'es').trim()||'es';newTab('https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(tl)+'&u='+encodeURIComponent(c.url))};};

  // ---------- Ecosystem ----------
  N.PG.companion40=r=>{const c=current();r.innerHTML=page('ECOSYSTEM','Nova Companion','Prepara una página para enviarla al móvil usando el QR de Nova.',`<div class="n40-card"><h3>${esc(c.title||'Sin página')}</h3><div class="mut">${esc(c.url||'Abre una web para generar el QR.')}</div><div class="n40-actions">${btn('📱 Crear QR','id="cmp-qr"','on')}${btn('📌 Guardar primero','id="cmp-save"')}</div></div>`);r.querySelector('#cmp-qr').onclick=()=>{if(!c.url)return toast40('Abre una web');try{N.openFeature?.('qr');setTimeout(()=>{try{const input=document.querySelector('#nx-qr-url,#qr-url,input[type="url"]');if(input){input.value=c.url;input.dispatchEvent(new Event('input',{bubbles:true}));}}catch{}},120)}catch{toast40('QR no disponible')}};r.querySelector('#cmp-save').onclick=()=>saveCurrentPage();};
  N.PG.sync40=r=>{r.innerHTML=page('ECOSYSTEM','Nova Sync','Exporta/importa tu espacio y, si tienes cuenta, sincronízalo.',`<div class="n40-card"><div class="n40-actions">${btn('☁️ Cuenta','id="sync-account"','on')}${btn('⬇ Exportar','id="sync-export"')}${btn('⬆ Importar','id="sync-import"')}</div><div class="n40-code" id="sync-status">Última sincronización: ${st.syncAt?new Date(st.syncAt).toLocaleString('es'):'nunca'}.</div></div>`);r.querySelector('#sync-export').onclick=async()=>{const payload={nova40:st,nova31:S.nova31||{},novaNext:S.novaNext||{}};const f=await ipc.invoke('save-text',{name:'Nova-Sync-Package',ext:'json',content:JSON.stringify(payload,null,2)}).catch(()=>null);r.querySelector('#sync-status').textContent=f?'Exportado a Descargas.':'No se pudo exportar.'};r.querySelector('#sync-import').onclick=()=>{const raw=String(prompt('Pega el JSON exportado por Nova','')||'');if(!raw)return;try{const data=JSON.parse(raw);if(data.nova40&&typeof data.nova40==='object')S.nova40=Object.assign(S.nova40,data.nova40);if(data.nova31&&typeof data.nova31==='object')S.nova31=Object.assign(S.nova31||{},data.nova31);save();r.querySelector('#sync-status').textContent='Importación completada.';toast40('Importado');}catch{toast40('JSON no válido')}};r.querySelector('#sync-account').onclick=async()=>{const s=await ipc.invoke('account-status').catch(()=>null);if(!s?.loggedIn)return toast40('Inicia sesión en Nova para sincronizar');const data={nova40:st,nova31:S.nova31||{},novaNext:S.novaNext||{}};const out=await ipc.invoke('account-sync',data).catch(()=>null);if(out?.ok){st.syncAt=now();save();r.querySelector('#sync-status').textContent='Cuenta sincronizada.';toast40('Sync completado')}else toast40(out?.error||'No se pudo sincronizar')};};
  N.PG.desktop40=r=>{r.innerHTML=page('WORKSPACE','Desktop Mode','Un panel compacto para saltar entre herramientas sin perder contexto.',`<div class="n40-grid">${[['🧠','Brain','pagebrain'],['💬','Talk','talkpage'],['🗃️','Vault','vault40'],['🕒','Timeline','timeline40'],['⚡','Flows','flows40'],['🎨','Studio','studio40'],['⌕','Launcher','novaLauncher']].map((x,i)=>card(x[0],x[1],'Abrir herramienta',btn('Abrir',`data-open="${i}"`))).join('')}</div>`);const m=[['pagebrain'],['talkpage'],['vault40'],['timeline40'],['flows40'],['studio40'],['novaLauncher']];r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(m[+b.dataset.open]?.[0]));};

  // ---------- Flow trigger / site profiles ----------
  const bound=new WeakSet(); const bindTab=t=>{if(!t?.wv?.addEventListener||bound.has(t))return;t._nova40Bound=true;bound.add(t);const refresh=()=>{setTimeout(()=>applySiteFor(t),80);const url=(()=>{try{return http(t.wv.getURL?.()||'')}catch{return ''}})();const host=hostOf(url);if(host){for(const f of st.flows.filter(x=>x.enabled!==false&&(!x.whenHost||x.whenHost===host)))setTimeout(()=>runFlow(f),180);}};t.wv.addEventListener('did-navigate',refresh);t.wv.addEventListener('did-navigate-in-page',()=>applySiteFor(t));};
  try{(tabs||[]).forEach(bindTab);}catch{}

  // ---------- Public API / discoverability ----------
  N.openFeature40=open; N.launcher40=launcher; N.quickActions40=quickActions; N.dock40=showDock; N.popOut40=()=>{const c=current();if(!c.url)return toast40('Abre una web');try{ipc.invoke('launch-web-app',{name:c.title||c.host||'Nova Pop-out',url:c.url}).then(x=>toast40(x?.ok?'Ventana abierta':'No se pudo abrir')).catch(()=>toast40('No se pudo abrir'));}catch{toast40('Pop-out no disponible')}};
  window.Nova40={open,launcher,quickActions,dock:showDock,brain:()=>open('pagebrain'),vault:()=>open('vault40'),research:()=>open('research40'),pin:pinCurrent};
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  if(!N.extraActs.some(a=>a[0]==='Nova 4.0 · Ultimate'))N.extraActs.push(['Nova 4.0 · Ultimate',()=>open('novaUltimate')]);

  N.resolveFeatureRoute=x=>{const p=internalRoute(x);return p || (oldResolve?oldResolve(x):String(x||''));};
  N.PG.novaLauncher=r=>{r.innerHTML=page('LAUNCHER','Nova Launcher','Una sola caja para encontrar funciones, pestañas, historial o URLs.',`<div class="n40-card"><input class="fld" id="launcher-input" placeholder="Escribe lo que buscas…"><div class="n40-actions">${btn('Abrir launcher completo','id="launcher-open"','on')}${btn('⚡ Acciones rápidas','id="launcher-quick"')}</div></div>`);r.querySelector('#launcher-open').onclick=()=>launcher();r.querySelector('#launcher-quick').onclick=quickActions;r.querySelector('#launcher-input').onkeydown=e=>{if(e.key==='Enter')launcher(e.target.value)};};

  document.addEventListener('keydown',e=>{
    const mod=e.ctrlKey||e.metaKey; const tag=document.activeElement?.tagName?.toLowerCase(); const typing=['input','textarea','select'].includes(tag);
    if(mod&&e.code==='Space'&&!typing){e.preventDefault();launcher();}
    if(mod&&e.shiftKey&&e.key.toLowerCase()==='u'&&!typing){e.preventDefault();open('novaUltimate');}
    if(mod&&e.shiftKey&&e.key.toLowerCase()==='a'&&!typing){e.preventDefault();quickActions();}
  });

  save();
})();


/* ---- nova41.js ---- */
/* Nova 4.1.0 · Evolution Layer
 * Additive update over Nova 4.0.0. Keeps existing modules intact.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = () => Date.now();
  const save = () => { try { N.save?.(); } catch {} try { window.save?.(); } catch {} };
  const open = route => { try { return newTab('nova://' + route); } catch { return null; } };
  const current = () => { try { return N.activeWebTab?.() || cur; } catch { return null; } };

  const state = () => {
    S.nova41 = Object.assign({
      version: 1,
      gaming: { favorites: [], playtime: {}, records: {} },
      gamingProfile: { active: true, accent: '#a970ff', extensions: [], privacy: { ads: true, threats: true } },
      sync: { enabled: true, encrypted: true, devices: [], last: 0 },
      privacy: { ads: true, threats: true, trackers: true },
      dynamicHome: true,
      news: { enabled: true, topics: ['Tecnología', 'Gaming', 'Internet'] }
    }, S.nova41 || {});
    S.nova41.gaming ||= { favorites: [], playtime: {}, records: {} };
    S.nova41.gamingProfile ||= { active: true, accent: '#a970ff', extensions: [], privacy: { ads: true, threats: true } };
    S.nova41.sync ||= { enabled: true, encrypted: true, devices: [], last: 0 };
    S.nova41.privacy ||= { ads: true, threats: true, trackers: true };
    return S.nova41;
  };
  const st = state();

  if (!document.getElementById('nova41-style')) {
    const css = document.createElement('style'); css.id = 'nova41-style';
    css.textContent = `
      .n41-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:30px}
      .n41-hero{padding:24px;border:1px solid var(--bd);border-radius:24px;background:radial-gradient(circle at 88% 5%,rgba(155,92,255,.20),transparent 45%),linear-gradient(145deg,var(--bar),color-mix(in srgb,var(--bar) 78%,#09060f));box-shadow:0 22px 80px #0004}
      .n41-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--acc);font-weight:800}.n41-title{font-size:32px;font-weight:700;letter-spacing:-.035em}.n41-sub{color:var(--mut);line-height:1.6;max-width:900px}
      .n41-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:10px}.n41-card{padding:16px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);display:flex;flex-direction:column;gap:8px}.n41-card h3{margin:0}.n41-card p{margin:0;color:var(--mut);line-height:1.55}.n41-stat{font-size:25px;font-weight:750}.n41-muted{font-size:12px;color:var(--mut)}
      .n41-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}.n41-row + .n41-row{margin-top:8px}.n41-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}
      .n41-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n41-chip.on{border-color:var(--acc);color:var(--acc)}
      .n41-news{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.n41-news article{min-height:145px;padding:16px;border:1px solid var(--bd);border-radius:18px;background:linear-gradient(145deg,var(--bar),color-mix(in srgb,var(--bar) 92%,#171023));display:flex;flex-direction:column;gap:9px}.n41-news article:hover{border-color:var(--acc);transform:translateY(-2px);transition:.18s}.n41-news .tag{font-size:10px;text-transform:uppercase;letter-spacing:.13em;color:var(--acc)}
      .n41-toggle{width:44px;height:24px;border-radius:999px;background:#2a2830;border:1px solid var(--bd);padding:3px;cursor:pointer}.n41-toggle span{display:block;width:16px;height:16px;border-radius:50%;background:#aaa;transition:.18s}.n41-toggle.on{background:color-mix(in srgb,var(--acc) 52%,#15111b);border-color:var(--acc)}.n41-toggle.on span{transform:translateX(19px);background:#fff}
      .n41-game{background:radial-gradient(circle at 95% 0,rgba(155,92,255,.22),transparent 35%),linear-gradient(145deg,#100d16,#15101f 50%,#0b0a0f);border-color:#44305a}.n41-score{font-size:30px;font-weight:800}.n41-bar{height:9px;border-radius:999px;background:#25212c;overflow:hidden}.n41-fill{height:100%;background:linear-gradient(90deg,#7040d4,#bd8aff);border-radius:999px}
      @media(max-width:800px){.n41-news{grid-template-columns:1fr}.n41-title{font-size:27px}.n41-row{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(css);
  }

  const page = (k,t,d,b='') => `<div class="n41-page"><div class="n41-kicker">${esc(k)}</div><div class="n41-title">${esc(t)}</div><div class="n41-sub">${esc(d)}</div>${b}</div>`;
  const btn = (label,attr='',cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const toggle = (on,id) => `<button class="n41-toggle ${on?'on':''}" id="${id}" aria-pressed="${!!on}"><span></span></button>`;

  N.PG.gaming41 = r => {
    const g = st.gaming, prof = st.gamingProfile;
    const entries = Object.entries(g.playtime || {}).sort((a,b) => b[1]-a[1]);
    const favs = g.favorites || [];
    r.innerHTML = page('NOVA GAMING','Game Hub','Tu espacio gaming: juegos favoritos, noticias y estadísticas en un solo lugar.',`
      <div class="n41-hero n41-game"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><div style="font-size:24px;font-weight:800">🎮 NEXA-style Gaming dentro de Nova</div><p class="n41-muted" style="margin-top:6px">Perfil Gaming ${prof.active?'activo':'inactivo'} · estética premium morada · sin sobrecargar la navegación.</p></div><div class="n41-chip on">🏆 Perfil Gaming</div></div><div class="n41-actions">${btn('⚙️ Configurar perfil','id="g-profile"')}${btn('🧩 Extensiones','id="g-ext"')}${btn('🛡 Privacidad','id="g-privacy"')}</div></div>
      <div class="n41-grid">
        <div class="n41-card"><div class="n41-score">${favs.length}</div><div class="n41-muted">Juegos favoritos</div><div class="n41-actions">${btn('＋ Añadir juego','id="g-add"','on')}</div></div>
        <div class="n41-card"><div class="n41-score">${entries.reduce((a,[,v])=>a+Number(v||0),0).toFixed(1)} h</div><div class="n41-muted">Tiempo total registrado</div><div class="n41-actions">${btn('＋ Registrar sesión','id="g-session"')}</div></div>
        <div class="n41-card"><div class="n41-score">${Object.keys(g.records||{}).length}</div><div class="n41-muted">Récords personales</div><div class="n41-actions">${btn('🏆 Editar récord','id="g-record"')}</div></div>
      </div>
      <div class="n41-grid">
        <div class="n41-card"><h3>🎮 Mis juegos</h3>${favs.map((x,i)=>`<div class="n41-row"><div><b>${esc(x)}</b><div class="n41-muted">${Number(g.playtime?.[x]||0).toFixed(1)} h</div></div><button class="btn" data-game-del="${i}">Quitar</button></div>`).join('') || '<div class="n41-muted">Añade tus juegos favoritos para verlos aquí.</div>'}</div>
        <div class="n41-card"><h3>📰 Noticias gaming</h3>${['Novedades de hardware y PC gaming','Lanzamientos y actualizaciones','Tendencias de videojuegos'].map((x,i)=>`<div class="n41-row"><div><b>${x}</b><div class="n41-muted">Resumen personalizado para tu perfil.</div></div></div>`).join('')}</div>
      </div>
      <div class="n41-card"><h3>📈 Estadísticas</h3>${entries.map(([x,v])=>`<div class="n41-row"><div style="flex:1"><b>${esc(x)}</b><div class="n41-bar" style="margin-top:7px"><div class="n41-fill" style="width:${Math.min(100,Number(v)*3)}%"></div></div></div><strong>${Number(v).toFixed(1)} h</strong></div>`).join('') || '<div class="n41-muted">Aún no hay sesiones registradas.</div>'}</div>
    `);
    r.querySelector('#g-add').onclick = () => { const x=String(prompt('Juego favorito','Minecraft')||'').trim(); if(!x)return; if(!g.favorites.includes(x))g.favorites.unshift(x); save(); N.PG.gaming41(r); };
    r.querySelector('#g-session').onclick = () => { const x=String(prompt('Juego','Minecraft')||'').trim(); const h=Math.max(0,Number(prompt('Horas de esta sesión','1'))||0); if(!x||!h)return; g.playtime[x]=Number(g.playtime[x]||0)+h; if(!g.favorites.includes(x))g.favorites.unshift(x); save(); N.PG.gaming41(r); };
    r.querySelector('#g-record').onclick = () => { const x=String(prompt('Nombre del récord','Mejor sesión')||'').trim(); const v=String(prompt('Valor','10')||'').trim(); if(!x||!v)return; g.records[x]=v; save(); N.PG.gaming41(r); };
    r.querySelectorAll('[data-game-del]').forEach(b=>b.onclick=()=>{g.favorites.splice(+b.dataset.gameDel,1);save();N.PG.gaming41(r)});
    r.querySelector('#g-profile').onclick=()=>open('gamingprofile41'); r.querySelector('#g-ext').onclick=()=>open('extensions41'); r.querySelector('#g-privacy').onclick=()=>open('privacy41');
  };

  N.PG.gamingprofile41 = r => {
    const p = st.gamingProfile;
    r.innerHTML = page('PROFILE','Perfil Gaming','Perfil separado para apariencia, configuración, extensiones, privacidad y sincronización.',`
      <div class="n41-card"><div class="n41-row"><div><b>🏆 Perfil Gaming</b><div class="n41-muted">${p.active?'Activo en este dispositivo':'Inactivo'}</div></div>${toggle(p.active,'gp-active')}</div>
      <div class="n41-grid"><div class="n41-card"><h3>🎨 Apariencia</h3><p>Usa el acento morado premium del perfil gaming.</p>${btn('Aplicar estilo Gaming','id="gp-style"','on')}</div><div class="n41-card"><h3>⚙️ Configuración</h3><p>Preferencias independientes del perfil personal.</p>${btn('Configurar','id="gp-settings"')}</div><div class="n41-card"><h3>🧩 Extensiones</h3><p>${p.extensions.length} extensiones asociadas.</p>${btn('Gestionar','id="gp-ext"')}</div><div class="n41-card"><h3>🔒 Privacidad</h3><p>Protección independiente para sesiones gaming.</p>${btn('Gestionar','id="gp-privacy"')}</div><div class="n41-card"><h3>🎮 Favoritos</h3><p>${st.gaming.favorites.length} juegos guardados.</p>${btn('Abrir Game Hub','id="gp-games"')}</div><div class="n41-card"><h3>☁️ Sync</h3><p>Perfil preparado para sincronización cifrada.</p>${btn('Abrir Nova Sync','id="gp-sync"')}</div></div></div>
    `);
    r.querySelector('#gp-active').onclick=()=>{p.active=!p.active;save();N.PG.gamingprofile41(r)};
    r.querySelector('#gp-style').onclick=()=>{S.quantumAppearance='dark';save();try{window.quantumSetAppearance?.('dark')}catch{};toast('Apariencia oscura aplicada')};
    r.querySelector('#gp-settings').onclick=()=>open('gamingsettings41'); r.querySelector('#gp-ext').onclick=()=>open('extensions41'); r.querySelector('#gp-privacy').onclick=()=>open('privacy41'); r.querySelector('#gp-games').onclick=()=>open('gaming41'); r.querySelector('#gp-sync').onclick=()=>open('sync41');
  };

  N.PG.gamingsettings41 = r => {
    const p=st.gamingProfile;
    r.innerHTML=page('PROFILE','Ajustes Gaming','Preferencias separadas para tu perfil de juego.',`<div class="n41-card"><div class="n41-row"><div><b>🟣 Acento premium</b><div class="n41-muted">${esc(p.accent)}</div></div><button class="btn" id="gp-accent">Cambiar</button></div><div class="n41-row"><div><b>🚀 Preparar sesión</b><div class="n41-muted">Deja el modo Gaming listo sin cambiar tus datos personales.</div></div><button class="btn on" id="gp-prepare">Activar</button></div></div>`);
    r.querySelector('#gp-accent').onclick=()=>{const v=String(prompt('Acento CSS (ej. #a970ff)',p.accent)||'').trim();if(/^#[0-9a-f]{6}$/i.test(v)){p.accent=v;save();N.PG.gamingsettings41(r)}};
    r.querySelector('#gp-prepare').onclick=()=>{p.active=true;save();toast('Perfil Gaming listo');N.PG.gamingsettings41(r)};
  };

  N.PG.extensions41 = r => {
    const installed=st.gamingProfile.extensions || [];
    const catalog=[['privacy-lite','🛡 Privacidad Plus','Protección reforzada para sesiones sensibles.'],['game-tools','🎮 Game Tools','Herramientas rápidas para tu flujo gaming.'],['reader','📖 Reader+','Lectura limpia para guías y documentación.'],['dev','🧑‍💻 Dev Tools','Accesos de desarrollador para webs y pruebas.']];
    r.innerHTML=page('EXTENSIONS','Extensions Store','Tienda integrada para descubrir extensiones, con permisos claros y compatibilidad amplia como objetivo.',`<div class="n41-card"><h3>⭐ Destacadas</h3><div class="n41-grid">${catalog.map(([id,n,d])=>`<div class="n41-card"><h3>${n}</h3><p>${d}</p><div class="n41-muted">✓ Revisada para este prototipo · permisos visibles</div><div class="n41-actions">${btn(installed.includes(id)?'✓ Instalada':'Instalar',`data-ext="${id}"`,installed.includes(id)?'':'on')}</div></div>`).join('')}</div></div><div class="n41-card"><h3>🔐 Seguridad</h3><p>Antes de instalar, NEXA/Nova muestra qué permisos solicita cada extensión. El modo desarrollador sigue separado del catálogo.</p>${btn('Abrir extensiones clásicas','id="ext-classic"')}</div>`);
    r.querySelectorAll('[data-ext]').forEach(b=>b.onclick=()=>{const id=b.dataset.ext;if(installed.includes(id))installed.splice(installed.indexOf(id),1);else installed.push(id);st.gamingProfile.extensions=installed;save();N.PG.extensions41(r)});
    r.querySelector('#ext-classic').onclick=()=>open('extensions40');
  };

  N.PG.privacy41 = r => {
    const p=st.privacy;
    r.innerHTML=page('PRIVACY','Centro de privacidad','Adiós a los anuncios, protección inteligente y controles claros.',`<div class="n41-grid"><div class="n41-card"><h3>🚫 Bloqueador de anuncios</h3><p>Controla anuncios y rastreadores desde una sola vista.</p><div class="n41-row"><span>${p.ads?'Activo':'Inactivo'}</span>${toggle(p.ads,'pv-ads')}</div></div><div class="n41-card"><h3>🛡 Protección inteligente</h3><p>Refuerza la navegación frente a phishing y descargas peligrosas.</p><div class="n41-row"><span>${p.threats?'Activa':'Inactiva'}</span>${toggle(p.threats,'pv-threats')}</div></div><div class="n41-card"><h3>🕵️ Rastreadores</h3><p>Controles de seguimiento y cookies de terceros.</p><div class="n41-row"><span>${p.trackers?'Protegidos':'Permitidos'}</span>${toggle(p.trackers,'pv-track')}</div></div></div><div class="n41-card"><h3>Estado</h3><div class="n41-chip on">${p.ads?'🚫 Anuncios':'✓ Anuncios permitidos'}</div> <div class="n41-chip ${p.threats?'on':''}">${p.threats?'🛡 Amenazas protegidas':'Amenazas sin protección'}</div> <div class="n41-actions">${btn('Abrir centro clásico','id="pv-classic"')}${btn('Configurar por sitio','id="pv-site"')}</div></div>`);
    r.querySelector('#pv-ads').onclick=()=>{p.ads=!p.ads;S.adblock=p.ads;save();try{ipc.invoke('adblock',p.ads)}catch{}N.PG.privacy41(r)};
    r.querySelector('#pv-threats').onclick=()=>{p.threats=!p.threats;save();N.PG.privacy41(r)}; r.querySelector('#pv-track').onclick=()=>{p.trackers=!p.trackers;save();N.PG.privacy41(r)};
    r.querySelector('#pv-classic').onclick=()=>open('privacidad');r.querySelector('#pv-site').onclick=()=>open('permissions31');
  };

  N.PG.sync41 = r => {
    const s=st.sync;
    r.innerHTML=page('SYNC','Nova Sync','Sincronización entre dispositivos con favoritos, pestañas, historial, configuración y cifrado.',`<div class="n41-hero"><div class="n41-row"><div><h3>☁️ Sincronización cifrada</h3><div class="n41-muted">${s.enabled?'Activa':'Inactiva'} · ${s.encrypted?'Cifrada':'Sin cifrado'}</div></div>${toggle(s.enabled,'sy-enabled')}</div><div class="n41-actions">${btn('☁️ Cuenta','id="sy-account"','on')}${btn('⬇ Exportar espacio','id="sy-export"')}${btn('⬆ Importar espacio','id="sy-import"')}</div></div><div class="n41-grid"><div class="n41-card"><h3>⭐ Favoritos</h3><div class="n41-stat">${S.marks?.length||0}</div></div><div class="n41-card"><h3>📑 Pestañas</h3><div class="n41-stat">${tabs?.length||0}</div></div><div class="n41-card"><h3>🕘 Historial</h3><div class="n41-stat">${S.hist?.length||0}</div></div><div class="n41-card"><h3>⚙️ Configuración</h3><p>Temas, preferencias y perfiles incluidos.</p></div></div><div class="n41-card"><h3>📱↔️💻 Continuar aquí</h3><p>Prepara una página actual para retomarla en otro dispositivo.</p>${btn('Crear QR','id="sy-qr"','on')}</div>`);
    r.querySelector('#sy-enabled').onclick=()=>{s.enabled=!s.enabled;save();N.PG.sync41(r)};
    r.querySelector('#sy-account').onclick=()=>open('sync40');
    r.querySelector('#sy-export').onclick=()=>open('sync40'); r.querySelector('#sy-import').onclick=()=>open('sync40'); r.querySelector('#sy-qr').onclick=()=>open('companion40');
  };

  N.PG.translate41 = r => {
    r.innerHTML=page('WEB POWER','Magic Translate','Traduce una selección o una página completa sin cambiar la original.',`<div class="n41-card"><div class="n41-grid"><div class="n41-card"><h3>🌍 Selección</h3><p>Usa la selección actual y abre la traducción.</p>${btn('Traducir selección','id="tr-sel"','on')}</div><div class="n41-card"><h3>🌍 Página</h3><p>Traduce la página completa en una nueva pestaña.</p>${btn('Traducir página','id="tr-page"')}</div><div class="n41-card"><h3>⚙️ Destino</h3><input class="fld" id="tr-lang" value="es" maxlength="10"><div class="n41-muted">Código de idioma, por ejemplo es, en, fr.</div></div></div></div>`);
    r.querySelector('#tr-sel').onclick=async()=>{const t=current();if(!t?.wv)return toast('Abre una página web');const x=await t.wv.executeJavaScript(`window.getSelection?.().toString()||''`).catch(()=> '');if(!x)return toast('Selecciona texto');const l=String(r.querySelector('#tr-lang').value||'es').trim();newTab('https://translate.google.com/?sl=auto&tl='+encodeURIComponent(l)+'&text='+encodeURIComponent(String(x)))};
    r.querySelector('#tr-page').onclick=()=>{const t=current();if(!t?.wv)return toast('Abre una página web');const u=t.wv.getURL?.()||'';if(!/^https?:/i.test(u))return toast('Abre una web');const l=String(r.querySelector('#tr-lang').value||'es').trim();newTab('https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(l)+'&u='+encodeURIComponent(u))};
  };

  N.PG.devtools41 = r => {
    r.innerHTML=page('DEVELOPER','Herramientas de desarrollador','Acceso rápido a Inspector, Console, Network, Sources, Performance y Storage.',`<div class="n41-grid">${[['🔎','Inspector'],['⌨️','Console'],['🌐','Network'],['📦','Sources'],['⚡','Performance'],['🗃','Storage']].map(([i,n])=>`<div class="n41-card"><div style="font-size:22px">${i}</div><h3>${n}</h3><p>Panel preparado para el flujo de desarrollo.</p>${btn('Abrir DevTools',`data-dev="${n}"`,'on')}</div>`).join('')}</div><div class="n41-card"><p>Atajo disponible desde el menú contextual de una página: <b>Inspeccionar elemento</b>.</p></div>`);
    r.querySelectorAll('[data-dev]').forEach(b=>b.onclick=()=>{const t=current();try{t?.wv?.openDevTools?.({mode:'detach'})}catch{toast('DevTools no disponible en esta vista')}});
  };

  const aliases = { gaming:'gaming41', 'game-hub':'gaming41', gamingprofile:'gamingprofile41', 'gaming-profile':'gamingprofile41', gamingsettings:'gamingsettings41', extensionsstore:'extensions41', 'extensions-store':'extensions41', privacy41:'privacy41', sync41:'sync41', translate41:'translate41', devtools41:'devtools41', developer:'devtools41' };
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]||(oldResolve?oldResolve(raw):raw)};
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct=(name,fn)=>{if(!N.extraActs.some(a=>a[0]===name))N.extraActs.push([name,fn])};
  addAct('🎮 Game Hub',()=>open('gaming41'));
  addAct('🏆 Perfil Gaming',()=>open('gamingprofile41'));
  addAct('🛡 Privacidad 4.1',()=>open('privacy41'));
  addAct('☁️ Sync 4.1',()=>open('sync41'));
  addAct('🌍 Traducción',()=>open('translate41'));
  addAct('🧑‍💻 DevTools',()=>open('devtools41'));

  window.Nova41={gaming:()=>open('gaming41'),profile:()=>open('gamingprofile41'),privacy:()=>open('privacy41'),sync:()=>open('sync41'),translate:()=>open('translate41'),devtools:()=>open('devtools41')};
  save();
})();


/* ---- nova432.js ---- */
/* Nova 4.3.2 — Hotfix Glass Clean. Aditivo sobre la shell estable; no reemplaza index.html. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const q = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save432 = () => { try { window.save?.(); N.save?.(); } catch {} };
  const toast432 = msg => { try { toast(String(msg)); } catch { const d=document.createElement('div'); d.textContent=String(msg); d.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;padding:9px 14px;border:1px solid var(--bd);border-radius:12px;background:rgba(24,27,34,.92);color:#fff;box-shadow:0 12px 40px #0007;backdrop-filter:blur(14px)';document.body.appendChild(d);setTimeout(()=>d.remove(),2200); } };

  S.nova432 = Object.assign({ pinnedSites: [], eco: false, uiVersion: 1 }, S.nova432 || {});
  if (!Array.isArray(S.nova432.pinnedSites)) S.nova432.pinnedSites = [];
  S.nova432.pinnedSites = S.nova432.pinnedSites.filter(x => x && /^https?:\/\//i.test(String(x.u || ''))).slice(0, 8);

  /* -------- Visual layer: Glass Clean, independent of the old theme engine. -------- */
  if (!document.getElementById('nova432-style')) {
    const st = document.createElement('style');
    st.id = 'nova432-style';
    st.textContent = `
      body.nova432-glass{
        --nova432-font:"Inter","Segoe UI Variable","Segoe UI",system-ui,sans-serif;
        --nova432-bg:#101217;--nova432-bg2:#171a21;--nova432-fg:#f3f5f8;--nova432-mut:#9ba3af;
        --nova432-accent:#6d95ff;--nova432-border:rgba(255,255,255,.10);--nova432-surface:rgba(24,27,34,.76);
        --nova432-surface2:rgba(32,36,45,.66);--nova432-shadow:0 18px 56px rgba(0,0,0,.28);--nova432-radius:12px;
        font-family:var(--nova432-font)!important;
        background:radial-gradient(900px 500px at 85% -10%,rgba(109,149,255,.10),transparent 64%),var(--nova432-bg)!important;
      }
      body.nova432-glass.t-light{
        --nova432-bg:#f4f6f9;--nova432-bg2:#edf0f4;--nova432-fg:#1d232b;--nova432-mut:#68717d;
        --nova432-accent:#416fe0;--nova432-border:rgba(18,25,38,.10);--nova432-surface:rgba(255,255,255,.76);--nova432-surface2:rgba(255,255,255,.68);
        background:radial-gradient(900px 500px at 85% -10%,rgba(65,111,224,.08),transparent 64%),var(--nova432-bg)!important;
      }
      body.nova432-glass #top{
        height:42px;padding-left:8px;background:var(--nova432-surface)!important;border-bottom:1px solid var(--nova432-border)!important;
        backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);box-shadow:0 6px 20px rgba(0,0,0,.06);
      }
      body.nova432-glass #brand{font-family:var(--nova432-font)!important;font-weight:650;letter-spacing:-.01em;padding-bottom:8px}
      body.nova432-glass #brand img{width:19px;height:19px;border-radius:5px;box-shadow:0 1px 8px rgba(0,0,0,.14)}
      body.nova432-glass #tabs{gap:4px;padding:4px 4px 0 2px;align-items:flex-end}
      body.nova432-glass .tab{height:32px;max-width:230px;min-width:78px;border:1px solid transparent!important;border-radius:11px 11px 0 0!important;background:transparent!important;color:var(--nova432-mut)!important;transition:background-color .14s ease,border-color .14s ease,color .14s ease,transform .14s ease!important}
      body.nova432-glass .tab.on{background:var(--nova432-surface2)!important;border-color:var(--nova432-border)!important;color:var(--nova432-fg)!important;box-shadow:0 4px 16px rgba(0,0,0,.10),inset 0 1px rgba(255,255,255,.05)}
      body.nova432-glass .tab:not(.on):hover{background:rgba(127,140,165,.10)!important;color:var(--nova432-fg)!important}
      body.nova432-glass .tab img{width:15px;height:15px;border-radius:4px}
      body.nova432-glass #bar{gap:7px;padding:7px 10px;background:var(--nova432-surface)!important;border-top:1px solid var(--nova432-border);border-bottom:1px solid var(--nova432-border)!important;backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%)}
      body.nova432-glass .ib,body.nova432-glass .btn,body.nova432-glass .fld{font-family:var(--nova432-font)!important}
      body.nova432-glass .ib{width:31px;height:31px;border-radius:10px!important;color:var(--nova432-fg);transition:transform .14s ease,background-color .14s ease,color .14s ease,box-shadow .14s ease!important}
      body.nova432-glass .ib:hover{background:rgba(127,140,165,.10)!important}
      body.nova432-glass .ib:active{transform:scale(.96)}
      body.nova432-glass #addr{height:34px;padding:0 16px;background:rgba(127,140,165,.08)!important;border:1px solid transparent!important;border-radius:17px!important;box-shadow:inset 0 1px rgba(255,255,255,.04)!important}
      body.nova432-glass #addr:focus{border-color:rgba(109,149,255,.45)!important;box-shadow:0 0 0 4px rgba(109,149,255,.13),inset 0 1px rgba(255,255,255,.06)!important}
      body.nova432-glass #side{width:54px;background:rgba(18,21,27,.62)!important;border-right:1px solid var(--nova432-border)!important;padding:9px 5px;gap:7px;backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%)}
      body.nova432-glass.t-light #side{background:rgba(250,251,253,.66)!important}
      body.nova432-glass #side .ib{width:40px;height:40px;border-radius:12px!important}
      body.nova432-glass #side .ib.on{background:rgba(109,149,255,.12)!important;color:var(--nova432-accent)!important;box-shadow:inset 0 0 0 1px rgba(109,149,255,.08)}
      body.nova432-glass #panel{background:var(--nova432-surface)!important;border-left:1px solid var(--nova432-border)!important;backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%);box-shadow:-18px 0 45px rgba(0,0,0,.12)}
      body.nova432-glass #panel.open{width:340px}
      body.nova432-glass .btn{background:rgba(127,140,165,.07)!important;border-color:var(--nova432-border)!important;border-radius:10px!important;transition:background-color .14s ease,border-color .14s ease,color .14s ease,transform .14s ease!important}
      body.nova432-glass .btn:hover,body.nova432-glass .btn.on{background:rgba(109,149,255,.10)!important;border-color:rgba(109,149,255,.32)!important;color:var(--nova432-accent)!important}
      body.nova432-glass .fld{background:rgba(127,140,165,.07)!important;border-color:var(--nova432-border)!important;border-radius:10px!important}
      body.nova432-glass #nova22-top-pop,body.nova432-glass #nova22-zoom-pop,body.nova432-glass #nova22-webctx,body.nova432-glass #nova22-profile-fallback,body.nova432-glass #mnp{
        background:rgba(24,27,34,.88)!important;border-color:var(--nova432-border)!important;border-radius:14px!important;box-shadow:0 24px 80px rgba(0,0,0,.28)!important;backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%)}
      body.nova432-glass.t-light #nova22-top-pop,body.nova432-glass.t-light #nova22-zoom-pop,body.nova432-glass.t-light #nova22-webctx,body.nova432-glass.t-light #nova22-profile-fallback,body.nova432-glass.t-light #mnp{background:rgba(255,255,255,.88)!important}
      body.nova432-glass #nova22-top-pop .nova22-menuitem,body.nova432-glass .nova22-ctxitem,body.nova432-glass #mnp button{border-radius:10px!important}
      body.nova432-glass #nova22-top-pop .nova22-menuitem:hover,body.nova432-glass .nova22-ctxitem:hover,body.nova432-glass #mnp button:hover{background:rgba(109,149,255,.10)!important}
      body.nova432-glass .nova432-pinwrap{position:relative;width:40px;height:40px}
      body.nova432-glass .nova432-pin{width:40px;height:40px;border:1px solid transparent;background:transparent;color:var(--nova432-fg);border-radius:12px;display:grid;place-items:center;padding:0;cursor:pointer;position:relative;transition:transform .14s ease,background-color .14s ease,border-color .14s ease}
      body.nova432-glass .nova432-pin:hover{background:rgba(127,140,165,.10);border-color:var(--nova432-border);transform:translateY(-1px)}
      body.nova432-glass .nova432-pin img{width:20px;height:20px;border-radius:5px;object-fit:cover}
      body.nova432-glass .nova432-sep{width:28px;height:1px;background:var(--nova432-border);margin:2px 0 3px}
      body.nova432-glass .nova432-energy{margin-top:auto}
      body.nova432-glass .nova432-energy.on{color:#5fd58c!important;background:rgba(95,213,140,.11)!important}
      body.nova432-glass .nova432-pin-remove{position:absolute;right:-2px;top:-2px;width:15px;height:15px;border-radius:50%;border:1px solid var(--nova432-border);background:rgba(20,23,29,.92);color:#fff;font-size:10px;line-height:13px;display:none;padding:0}
      body.nova432-glass .nova432-pin:hover .nova432-pin-remove{display:block}
      body.nova432-glass .th{display:none!important}
      body.nova432-glass .nova432-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.06);color:var(--nova432-mut);font-size:12px}
      body.nova432-glass .nova432-card{padding:13px 14px;border-radius:15px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.05);box-shadow:0 14px 42px rgba(0,0,0,.06)}
      @keyframes nova432-in{from{opacity:0;transform:translateY(4px) scale(.985)}to{opacity:1;transform:none}}
      body.nova432-glass #panel.open{animation:nova432-in .16s ease-out}
      body.nova432-glass .nova432-pin{animation:nova432-in .16s ease-out}
      body.noanim .nova432-pin,body.noanim #panel.open{animation:none!important}
      @media(prefers-reduced-motion:reduce){body.nova432-glass #panel.open,body.nova432-glass .nova432-pin{animation:none!important}}
    `;
    document.head.appendChild(st);
  }

  const baseApplyTheme432 = typeof applyTheme === 'function' ? applyTheme : null;
  if (baseApplyTheme432 && !window.__nova432ApplyWrapped) {
    window.__nova432ApplyWrapped = true;
    applyTheme = function() {
      baseApplyTheme432();
      document.body.classList.add('nova432-glass');
      const b = document.body.style;
      b.setProperty('--font','"Inter","Segoe UI Variable","Segoe UI",system-ui,sans-serif');
      b.setProperty('--fs','13px');
      b.setProperty('--r','11px');
    };
  }
  document.body.classList.add('nova432-glass');
  try { applyTheme?.(); } catch {}

  /* -------- Fijar sitios: favicons reales, separados de Favoritos. -------- */
  const faviconFallback = url => {
    try { return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=64`; } catch { return '../assets/icon.png'; }
  };
  const currentTab432 = () => {
    try { return N.activeWebTab?.() || N.currentWebTab?.() || cur; } catch { return cur; }
  };
  const title432 = t => { try { return String(t?.el?.querySelector('span')?.textContent || t?.wv?.getTitle?.() || t?.wv?.getURL?.() || 'Sitio'); } catch { return 'Sitio'; } };
  const url432 = t => { try { return String(t?.wv?.getURL?.() || ''); } catch { return ''; } };
  const persistPins432 = () => { S.nova432.pinnedSites = S.nova432.pinnedSites.slice(0,8); save432(); };
  const renderPins432 = () => {
    const side = q('#side'); if (!side) return;
    q('#nova432-pins')?.remove();
    const pins = document.createElement('div'); pins.id='nova432-pins'; pins.style.cssText='display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;margin-top:2px';
    S.nova432.pinnedSites.forEach((p, i) => {
      const wrap = document.createElement('div'); wrap.className='nova432-pinwrap';
      const b = document.createElement('button'); b.className='nova432-pin'; b.title=p.t || p.u; b.setAttribute('aria-label',`Abrir ${p.t || p.u}`);
      const img=document.createElement('img'); img.src=p.i && !String(p.i).endsWith('/assets/icon.png') ? p.i : faviconFallback(p.u); img.alt=''; img.onerror=()=>{if(img.src!=='../assets/icon.png')img.src='../assets/icon.png'};
      const rm=document.createElement('button'); rm.className='nova432-pin-remove';rm.type='button';rm.title='Quitar de fijados';rm.textContent='×';
      b.appendChild(img); wrap.append(b,rm); pins.appendChild(wrap);
      b.onclick=()=>{try{newTab(p.u)}catch{} };
      rm.onclick=e=>{e.stopPropagation();S.nova432.pinnedSites.splice(i,1);persistPins432();renderPins432();toast432('Sitio quitado de fijados');};
      b.oncontextmenu=e=>{e.preventDefault();rm.click()};
    });
    const anchor=q('#nova432-pin-anchor');
    if(anchor) anchor.replaceWith(pins); else side.appendChild(pins);
  };

  if(!q('#pinSite')){
    const b=document.createElement('button'); b.className='ib'; b.id='pinSite'; b.title='Fijar sitio en la barra lateral';
    b.innerHTML=(typeof ic==='function'?ic('pin'):'<svg viewBox="0 0 24 24"><path d="M12 17v5M7 4h10l-1 5 3 3H5l3-3z"/></svg>');
    const target=q('#st'); target?.after(b);
  }
  if(q('#pinSite') && !window.__nova432PinBound){
    window.__nova432PinBound=true;
    q('#pinSite').onclick=()=>{
      const t=currentTab432(), u=url432(t);
      if(!/^https?:\/\//i.test(u)){ toast432('Abre una página web para fijarla'); return; }
      if(S.nova432.pinnedSites.some(p=>p.u===u)){ toast432('Este sitio ya está fijado'); return; }
      const img=t?.el?.querySelector?.('img')?.src || faviconFallback(u);
      S.nova432.pinnedSites.unshift({u,t:title432(t),i:img,createdAt:Date.now()});
      persistPins432(); renderPins432(); toast432('Sitio fijado en la barra lateral');
    };
  }

  const attachFaviconWatcher432 = t => {
    if(!t?.wv || t._nova432Fav) return; t._nova432Fav=true;
    t.wv.addEventListener('page-favicon-updated', e=>{
      const f=e.favicons?.[0]; if(!f) return;
      try { const img=t.el?.querySelector('img'); if(img) img.src=f; } catch {}
      try {
        const u=url432(t), p=S.nova432.pinnedSites.find(x=>x.u===u);
        if(p){ p.i=f; p.t=title432(t); persistPins432(); renderPins432(); }
      } catch {}
    });
  };
  try { (tabs || []).forEach(attachFaviconWatcher432); } catch {}

  /* -------- Sidebar cleanup: remove wallpaper access from primary rail. -------- */
  const hideLegacyPrimary432 = () => {
    q('#side [data-p="walls"]')?.setAttribute('hidden','hidden');
    q('#side [data-p="walls"]')?.setAttribute('aria-hidden','true');
  };
  hideLegacyPrimary432();

  /* Insert pinned rail just before the auto-margin bottom area when possible. */
  const ensurePinAnchor432 = () => {
    const side=q('#side'); if(!side)return;
    if(!q('#nova432-pin-anchor')){
      const a=document.createElement('div'); a.id='nova432-pin-anchor'; a.style.display='none';
      side.appendChild(a);
    }
    renderPins432();
  };
  ensurePinAnchor432();

  /* -------- Ahorro de energía -------- */
  const energyBtnId='nova432-energy-btn';
  const ecoIcon = typeof ic === 'function' ? ic('leaf') : '<svg viewBox="0 0 24 24"><path d="M19 4C9 4 5 9 5 14c0 3 2 5 5 5 5 0 9-5 9-15Z"/><path d="M5 19c2-5 6-8 10-10"/></svg>';
  const setEco432 = async on => {
    const next=!!on;
    try { const ok=await ipc.invoke('performance-mode',next); if(!ok){toast432('No se pudo activar el ahorro de energía');return;} } catch { toast432('No se pudo activar el ahorro de energía');return; }
    S.nova432.eco=next; S.memSave=next; save432();
    try {
      (tabs || []).forEach(t => {
        if (t === currentTab432() || !t?.wv?.executeJavaScript) return;
        const code = next
          ? `(()=>{let s=document.getElementById('__nova432_eco');if(!s){s=document.createElement('style');s.id='__nova432_eco';s.textContent='*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(s)}})()`
          : `document.getElementById('__nova432_eco')?.remove()`;
        t.wv.executeJavaScript(code).catch(() => {});
      });
    } catch {}
    refreshEnergy432();
    toast432(next?'Ahorro de energía activado':'Ahorro de energía desactivado');
  };
  const refreshEnergy432 = () => {
    const b=q('#'+energyBtnId); if(b){ b.classList.toggle('on',!!S.nova432.eco);b.classList.toggle('nova432-energy',true);b.title=S.nova432.eco?'Ahorro de energía activado':'Ahorro de energía';b.setAttribute('aria-pressed',String(!!S.nova432.eco)); }
    const s=q('#nova432-energy-sw'); if(s){s.classList.toggle('on',!!S.nova432.eco);s.textContent=S.nova432.eco?'Activado':'Desactivado';}
  };
  if(!q('#'+energyBtnId)){
    const b=document.createElement('button'); b.className='ib nova432-energy';b.id=energyBtnId;b.innerHTML=ecoIcon;b.title='Ahorro de energía';b.setAttribute('aria-pressed','false');
    q('#side')?.appendChild(b);
    b.onclick=()=>setEco432(!S.nova432.eco);
  }
  refreshEnergy432();
  if (S.nova432.eco) setTimeout(() => { ipc.invoke('performance-mode', true).catch(() => {}); }, 150);

  /* -------- Ajustes: card simple, sin tocar la estructura existente. -------- */
  if(N.PG?.ajustes && !window.__nova432SettingsWrapped){
    window.__nova432SettingsWrapped=true;
    const baseSettings432=N.PG.ajustes;
    N.PG.ajustes=function(r){
      baseSettings432(r);
      const host=r; if(!host || host.querySelector('#nova432-hotfix-card'))return;
      const oldThemeCards=host.querySelectorAll('.th'); oldThemeCards.forEach(x=>{x.setAttribute('hidden','hidden');x.setAttribute('aria-hidden','true');const g=x.parentElement;if(g&&g.classList.contains('grid')){const prev=g.previousElementSibling;if(prev&&/tema/i.test(prev.textContent||'')){prev.setAttribute('hidden','hidden');}}});
      const card=document.createElement('div'); card.id='nova432-hotfix-card'; card.className='nova432-card'; card.style.marginTop='14px';
      card.innerHTML=`<div class="row"><div><h3 style="margin:0">Nova Glass Clean</h3><span class="mut">Interfaz limpia con transparencia moderada y animaciones sutiles.</span></div><span class="nova432-chip">4.3.2</span></div><div class="row" style="margin-top:10px"><div><b>Ahorro de energía</b><div class="mut">Reduce trabajo visual y usa el modo de rendimiento de Nova.</div></div><button class="btn" id="nova432-energy-sw">${S.nova432.eco?'Activado':'Desactivado'}</button></div><div class="mut" style="margin-top:9px">No cierra pestañas ni borra datos. Se conserva el perfil actual.</div>`;
      host.appendChild(card);
      card.querySelector('#nova432-energy-sw').onclick=async()=>{await setEco432(!S.nova432.eco);N.PG.ajustes(r);};
    };
  }

  /* -------- Runtime UI audit -------- */
  window.NovaUIAudit432=()=>{
    const core=['bk','fw','rl','st','sh','nt'];
    const present=core.filter(id=>q('#'+id));
    const missing=core.filter(id=>!q('#'+id));
    const coreNoHandler=core.filter(id=>{const el=q('#'+id);return el && typeof el.onclick!=='function'});
    const topNoHandler=[...document.querySelectorAll('#nova22-top-tools .nova22-topbtn')].filter(el=>typeof el.onclick!=='function').map(el=>el.id||el.textContent.trim());
    const sideUnroutable=[...document.querySelectorAll('#side .ib')].filter(el=>!el.hasAttribute('data-p')&&!el.hasAttribute('data-page')&&el.id!=='pinSite'&&el.id!=='nova432-energy-btn').map(el=>el.id||el.title||'side-button');
    const activeScripts=[...document.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'));
    const result={
      ok:missing.length===0 && coreNoHandler.length===0 && topNoHandler.length===0 && sideUnroutable.length===0 && activeScripts.includes('nova432.js'),
      missing,coreNoHandler,topNoHandler,sideUnroutable,scriptLoaded:activeScripts.includes('nova432.js'),pinned:S.nova432.pinnedSites.length,eco:!!S.nova432.eco
    };
    if(!result.ok)console.warn('[Nova 4.3.2 UI audit]',result); else console.info('[Nova 4.3.2 UI audit] OK',result);
    return result;
  };

  /* Keep the new layer after future theme refreshes and newly created tabs. */
  try { const poll=setInterval(()=>{document.body.classList.add('nova432-glass');hideLegacyPrimary432();renderPins432();(tabs||[]).forEach(attachFaviconWatcher432);refreshEnergy432();},4000); window.addEventListener('beforeunload',()=>clearInterval(poll)); } catch {}
  setTimeout(()=>window.NovaUIAudit432(),250);
})();


/* ---- nova44.js ---- */
/* Nova 4.4.0 — Professional layer
 * Additive over the stable 4.3.2 shell. No main HTML rewrite.
 */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc44 = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save44 = () => { try { window.save?.(); N.save?.(); } catch {} };
  const toast44 = msg => { try { toast(String(msg)); } catch { const d=document.createElement('div'); d.textContent=String(msg); d.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;padding:9px 14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(22,25,31,.92);color:#fff;box-shadow:0 14px 48px rgba(0,0,0,.25);backdrop-filter:blur(16px)';document.body.appendChild(d);setTimeout(()=>d.remove(),2200); } };
  const now44 = () => Date.now();
  const route44 = r => { try { return typeof newTab === 'function' ? newTab('nova://' + r) : null; } catch { return null; } };
  const icon44 = path => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  S.nova44 = Object.assign({ version: 1, autoEco: false, ecoThreshold: 30, eco: false, quickWorkspaces: true }, S.nova44 || {});
  S.nova44.ecoThreshold = Math.max(10, Math.min(80, Number(S.nova44.ecoThreshold) || 30));

  if (!document.getElementById('nova44-style')) {
    const st = document.createElement('style'); st.id = 'nova44-style'; st.textContent = `
      body.nova432-glass .nova44-railbtn{display:grid;place-items:center;width:40px;height:40px;border:1px solid transparent;border-radius:12px;background:transparent;color:var(--nova432-fg);cursor:pointer;transition:transform .14s ease,background-color .14s ease,border-color .14s ease,color .14s ease}
      body.nova432-glass .nova44-railbtn svg{width:20px;height:20px}.nova44-railbtn:hover{background:rgba(127,140,165,.10);border-color:var(--nova432-border);transform:translateY(-1px)}
      body.nova432-glass .nova44-railbtn.on{background:rgba(109,149,255,.12);border-color:rgba(109,149,255,.16);color:var(--nova432-accent)}
      body.nova432-glass .nova44-sep{width:28px;height:1px;background:var(--nova432-border);margin:1px 0}.nova44-rail-spacer{height:2px}
      body.nova432-glass .nova44-popup{position:fixed;left:60px;top:74px;z-index:500;width:292px;padding:10px;border:1px solid var(--nova432-border);border-radius:16px;background:rgba(24,27,34,.91);box-shadow:0 24px 80px rgba(0,0,0,.30);backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%);display:none;animation:nova44-pop .16s ease-out}
      body.nova432-glass.t-light .nova44-popup{background:rgba(255,255,255,.92)}.nova44-popup.on{display:block}
      @keyframes nova44-pop{from{opacity:0;transform:translateY(-4px) scale(.985)}to{opacity:1;transform:none}}
      body.nova432-glass .nova44-popup h3{margin:2px 4px 8px;font-size:13px;letter-spacing:-.01em}.nova44-popup .mut{font-size:11px}
      body.nova432-glass .nova44-ws{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;margin-top:5px;border:1px solid transparent;border-radius:11px;background:transparent;color:var(--nova432-fg);text-align:left;cursor:pointer}
      .nova44-ws:hover{background:rgba(109,149,255,.10);border-color:rgba(109,149,255,.10)}.nova44-ws .dot{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:rgba(109,149,255,.10);flex:none;color:var(--nova432-accent)}
      body.nova432-glass .nova44-popup .nova44-primary{margin-top:8px;width:100%;height:34px;border-radius:10px}
      body.nova432-glass .nova44-page{display:flex;flex-direction:column;gap:12px;max-width:1180px;margin:0 auto;padding-bottom:28px}.nova44-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--nova432-accent);font-weight:800}.nova44-title{font-size:29px;letter-spacing:-.035em;font-weight:730}.nova44-sub{color:var(--nova432-mut);line-height:1.55;max-width:920px}
      body.nova432-glass .nova44-card{padding:15px;border:1px solid var(--nova432-border);border-radius:16px;background:rgba(127,140,165,.045);box-shadow:0 12px 38px rgba(0,0,0,.055)}
      body.nova432-glass .nova44-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.nova44-stat{font-size:25px;font-weight:750;letter-spacing:-.03em}.nova44-label{font-size:11px;color:var(--nova432-mut);margin-top:2px}.nova44-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px;border:1px solid var(--nova432-border);border-radius:13px;background:rgba(127,140,165,.04)}.nova44-row+.nova44-row{margin-top:7px}.nova44-row .meta{min-width:0;display:flex;flex-direction:column;gap:2px}.nova44-row .meta b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nova44-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.05);font-size:11px;color:var(--nova432-mut)}.nova44-chip.on{color:#5fd58c;border-color:rgba(95,213,140,.22);background:rgba(95,213,140,.08)}
      body.nova432-glass .nova44-meter{height:8px;border-radius:999px;overflow:hidden;background:rgba(127,140,165,.11)}.nova44-meter>i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#6d95ff,#86aaff);width:0;transition:width .2s ease}
      body.nova432-glass .nova44-empty{padding:24px 8px;text-align:center;color:var(--nova432-mut);font-size:12px}.nova44-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
      body.nova432-glass .nova44-ext-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:rgba(109,149,255,.10);color:var(--nova432-accent);flex:none}.nova44-extpath{font-size:10px;color:var(--nova432-mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:440px}
      body.nova432-glass .nova44-mini{font-size:11px;color:var(--nova432-mut)}
      @media(max-width:800px){body.nova432-glass .nova44-popup{left:56px;width:calc(100vw - 66px)}.nova44-title{font-size:25px}}
      @media(prefers-reduced-motion:reduce){body.nova432-glass .nova44-popup,.nova44-meter>i{animation:none;transition:none}}
    `; document.head.appendChild(st);
  }

  /* ---------- Sidebar / Opera-like quick access ---------- */
  const existing = id => document.getElementById(id);
  const side = () => $('#side');
  const ensureRail = () => {
    const s = side(); if (!s) return;
    if (!existing('nova44-workspace-btn')) {
      const b=document.createElement('button'); b.className='nova44-railbtn'; b.id='nova44-workspace-btn'; b.title='Workspaces'; b.setAttribute('aria-label','Workspaces');
      b.innerHTML=icon44('M4 6.5h7l1.7 2H20v9.5H4z M4 6.5V5h6l2 2');
      s.prepend(b);
      b.onclick=e=>{e.stopPropagation();toggleWsPopup();};
    }
    if (!existing('nova44-performance-btn')) {
      const b=document.createElement('button'); b.className='nova44-railbtn'; b.id='nova44-performance-btn'; b.title='Rendimiento'; b.setAttribute('aria-label','Rendimiento');
      b.innerHTML=icon44('M5 12h3l2-6 3 12 2-6h4'); s.appendChild(b); b.onclick=()=>route44('rendimiento44');
    }
    // Put a stable separator before the bottom tools without touching existing handlers.
    if (!existing('nova44-sep')) { const x=document.createElement('div'); x.id='nova44-sep'; x.className='nova44-sep'; s.appendChild(x); }
  };

  let wsPopup = null;
  const workspaceData = () => {
    const a = Array.isArray(S.v200?.workspaces) ? S.v200.workspaces : [];
    const b = Array.isArray(S.nova40?.workspaces) ? S.nova40.workspaces : [];
    const out=[]; const seen=new Set();
    for (const w of [...a,...b]) { if(!w||!w.name) continue; const id=String(w.id||w.name); if(seen.has(id)) continue; seen.add(id); out.push(w); }
    return out.slice(0,12);
  };
  const currentTabs44 = () => (tabs||[]).map(t=>{try{return {url:String(t.wv.getURL?.()||''),title:String(t.el?.querySelector?.('span')?.textContent||'Nueva pestaña')};}catch{return null;}}).filter(x=>x&&/^https?:\/\//i.test(x.url));
  const saveCurrentWorkspace44 = () => {
    const ts=currentTabs44(); if(!ts.length){toast44('No hay pestañas web para guardar');return;}
    S.nova40 ||= {workspaces:[]}; S.nova40.workspaces ||= [];
    const name=String(prompt('Nombre del workspace','Trabajo')||'Trabajo').trim()||'Workspace';
    S.nova40.workspaces.unshift({id:'w44'+now44().toString(36),name,tabs:ts,createdAt:now44(),kind:'workspace44'}); S.nova40.workspaces.splice(16); save44(); refreshWsPopup(); toast44('Workspace guardado');
  };
  const toggleWsPopup = () => {
    if (!wsPopup) {
      wsPopup=document.createElement('div'); wsPopup.className='nova44-popup'; wsPopup.id='nova44-ws-popup'; document.body.appendChild(wsPopup);
      document.addEventListener('click',e=>{if(wsPopup?.classList.contains('on')&&!wsPopup.contains(e.target)&&!e.target.closest('#nova44-workspace-btn'))wsPopup.classList.remove('on')});
    }
    refreshWsPopup(); wsPopup.classList.toggle('on');
  };
  const refreshWsPopup = () => {
    if(!wsPopup)return;
    const list=workspaceData();
    wsPopup.innerHTML=`<h3>Workspaces</h3><div class="mut">Cambia de contexto sin perder tus pestañas actuales.</div>${list.map((w,i)=>`<button class="nova44-ws" data-ws="${i}"><span class="dot">${icon44('M5 7h5l2 2h7v8H5z')}</span><span style="min-width:0;flex:1"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc44(w.name)}</b><span class="nova44-mini">${Array.isArray(w.tabs)?w.tabs.length:0} pestañas guardadas</span></span></button>`).join('')||'<div class="nova44-empty">Todavía no tienes workspaces.</div>'}<button class="btn on nova44-primary" id="nova44-save-ws">Guardar pestañas actuales</button><button class="btn nova44-primary" id="nova44-manage-ws">Administrar workspaces</button>`;
    wsPopup.querySelectorAll('[data-ws]').forEach(b=>b.onclick=()=>{const w=list[+b.dataset.ws];(w?.tabs||[]).forEach(t=>t.url&&newTab(t.url));wsPopup.classList.remove('on');toast44('Workspace abierto');});
    wsPopup.querySelector('#nova44-save-ws').onclick=()=>saveCurrentWorkspace44(); wsPopup.querySelector('#nova44-manage-ws').onclick=()=>{wsPopup.classList.remove('on');route44('workspaces44')};
  };

  /* ---------- Pages ---------- */
  const page44=(k,t,d,b='')=>`<div class="nova44-page"><div class="nova44-kicker">${esc44(k)}</div><div class="nova44-title">${esc44(t)}</div><div class="nova44-sub">${esc44(d)}</div>${b}</div>`;
  const btn44=(label,attr='',cls='')=>`<button class="btn ${cls}" ${attr}>${label}</button>`;

  N.PG.workspaces44 = r => {
    const list=workspaceData();
    r.innerHTML=page44('NOVA 4.4','Workspaces','Contextos guardados con acceso rápido desde la barra lateral.',`<div class="nova44-grid"><div class="nova44-card"><div class="nova44-stat">${list.length}</div><div class="nova44-label">Workspaces guardados</div>${btn44('＋ Guardar pestañas actuales','id="ws44-save"','on')}</div><div class="nova44-card"><div class="nova44-stat">${(tabs||[]).length}</div><div class="nova44-label">Pestañas abiertas</div>${btn44('↻ Actualizar','id="ws44-refresh"')}</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Tus espacios</h3>${list.map((w,i)=>`<div class="nova44-row"><div class="meta"><b>${esc44(w.name)}</b><span class="nova44-mini">${Array.isArray(w.tabs)?w.tabs.length:0} pestañas · ${w.createdAt?new Date(w.createdAt).toLocaleString('es'):''}</span></div><div class="nova44-actions">${btn44('Abrir',`data-open="${i}"`)}${btn44('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="nova44-empty">Crea tu primer workspace guardando las pestañas actuales.</div>'}</div>`);
    r.querySelector('#ws44-save').onclick=saveCurrentWorkspace44; r.querySelector('#ws44-refresh').onclick=()=>N.PG.workspaces44(r);
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const w=list[+b.dataset.open];(w?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast44('Workspace abierto');});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const all=workspaceData(),w=all[+b.dataset.del];if(!w)return;const idx=(S.nova40?.workspaces||[]).indexOf(w);if(idx>=0){S.nova40.workspaces.splice(idx,1);save44();N.PG.workspaces44(r)}else{const idx2=(S.v200?.workspaces||[]).indexOf(w);if(idx2>=0){S.v200.workspaces.splice(idx2,1);save44();N.PG.workspaces44(r)}}});
  };

  N.PG.rendimiento44 = async r => {
    let timer=0;
    r.innerHTML=page44('NOVA 4.4','Rendimiento','RAM, CPU, pestañas y ahorro de energía en un solo panel.',`<div class="nova44-grid"><div class="nova44-card"><div class="nova44-stat" id="pm44">—</div><div class="nova44-label">RAM de Nova</div></div><div class="nova44-card"><div class="nova44-stat" id="pt44">—</div><div class="nova44-label">Pestañas web</div></div><div class="nova44-card"><div class="nova44-stat" id="pc44">—</div><div class="nova44-label">CPU del proceso principal</div></div><div class="nova44-card"><div class="nova44-stat" id="pf44">—</div><div class="nova44-label">Memoria disponible</div></div></div><div class="nova44-card"><div class="nova44-actions">${btn44('⚡ Ahorro de energía','id="eco44"')}${btn44('♻ Limpiar caché','id="cache44"')}${btn44('↻ Actualizar','id="refresh44"','on')}</div><div id="status44" class="nova44-mini" style="margin-top:8px">Consultando…</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Pestañas</h3><div id="ptab44"></div></div>`);
    const paint=async()=>{const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d?.ok){r.querySelector('#status44').textContent='Telemetría no disponible';return;}const mb=x=>Number(x)?(Number(x)/1024).toFixed(0)+' MB':'—';const cpu=x=>Number.isFinite(Number(x))?Number(x).toFixed(1)+' %':'—';r.querySelector('#pm44').textContent=mb(d.main.rssKB);r.querySelector('#pt44').textContent=String(d.tabs.length);r.querySelector('#pc44').textContent=cpu(d.main.cpuPercent);r.querySelector('#pf44').textContent=mb(d.system.availableKB||d.system.freeKB);r.querySelector('#status44').innerHTML=`${S.nova44.eco?'<span class="nova44-chip on">Ahorro activo</span>':'<span class="nova44-chip">Ahorro desactivado</span>'} <span class="nova44-chip">Actualizado ${new Date(d.generatedAt).toLocaleTimeString('es')}</span>`;r.querySelector('#ptab44').innerHTML=d.tabs.map(t=>`<div class="nova44-row"><div class="meta"><b>${esc44(t.title||t.url||'Pestaña')}</b><span class="nova44-mini">${esc44(t.url||'')}</span></div><span class="nova44-chip">${mb(t.workingSetKB)} · CPU ${cpu(t.cpuPercent)}</span></div>`).join('')||'<div class="nova44-empty">No hay pestañas web medibles.</div>';r.querySelector('#eco44').textContent=S.nova44.eco?'⚡ Desactivar ahorro':'⚡ Activar ahorro';};
    r.querySelector('#refresh44').onclick=paint; r.querySelector('#cache44').onclick=async()=>{const ok=await ipc.invoke('performance-cache').catch(()=>false);toast44(ok?'Caché limpiada':'No se pudo limpiar la caché');if(ok)paint()}; r.querySelector('#eco44').onclick=async()=>{const next=!S.nova44.eco;const ok=await ipc.invoke('performance-mode',next).catch(()=>false);if(ok){S.nova44.eco=next;if(S.nova432)S.nova432.eco=next;save44();paint();toast44(next?'Ahorro de energía activado':'Ahorro de energía desactivado')}};
    if (r.__nova44PerfTimer) clearInterval(r.__nova44PerfTimer); await paint(); r.__nova44PerfTimer=setInterval(()=>{ if(document.visibilityState==='visible') paint().catch(()=>{}); },5000);
  };

  N.PG.extensiones44 = async r => {
    const partition=typeof N.profilePartition==='function'?N.profilePartition():'persist:web';
    r.innerHTML=page44('NOVA 4.4','Extensiones reales','Carga extensiones Chromium desempaquetadas en el perfil activo y consérvalas entre arranques.',`<div class="nova44-card"><div class="nova44-actions">${btn44('＋ Cargar extensión desde carpeta','id="ext44-load"','on')}${btn44('↻ Actualizar','id="ext44-refresh"')}</div><div class="nova44-mini" style="margin-top:8px">Se espera una carpeta que contenga manifest.json. No se descarga ni ejecuta código desde la tienda automáticamente.</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Extensiones cargadas</h3><div id="ext44-list"><div class="nova44-empty">Consultando…</div></div></div>`);
    const paint=async()=>{const d=await ipc.invoke('extensions-list',{partition}).catch(()=>({ok:false,items:[]}));const list=Array.isArray(d?.items)?d.items:[];r.querySelector('#ext44-list').innerHTML=list.map((x,i)=>`<div class="nova44-row"><div class="meta" style="display:flex;flex-direction:row;align-items:center;gap:9px"><span class="nova44-ext-icon">${icon44('M5 8h14v11H5z M8 8V6a4 4 0 0 1 8 0v2')}</span><span class="meta"><b>${esc44(x.name||'Extensión')}</b><span class="nova44-extpath">${esc44(x.path||'')}</span></span></div><div class="nova44-actions">${btn44('Quitar',`data-ext-del="${i}"`)}</div></div>`).join('')||'<div class="nova44-empty">No hay extensiones reales cargadas en este perfil.</div>';r.querySelectorAll('[data-ext-del]').forEach(b=>b.onclick=async()=>{const x=list[+b.dataset.extDel];if(!x)return;const ok=await ipc.invoke('extension-unload',{partition,id:x.id}).catch(()=>false);toast44(ok?'Extensión retirada':'No se pudo retirar');paint();});};
    r.querySelector('#ext44-load').onclick=async()=>{const d=await ipc.invoke('extension-pick-load',{partition}).catch(()=>({ok:false,error:'No disponible'}));toast44(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar la extensión'));paint();};r.querySelector('#ext44-refresh').onclick=paint; await paint();
  };

  /* ---------- Settings: automatic battery saving ---------- */
  const wrapSettings=()=>{
    if(!N.PG?.ajustes||N.PG.ajustes.__nova44Wrapped)return;
    const base=N.PG.ajustes; const fn=r=>{base(r);if(r.querySelector('#nova44-settings'))return;const card=document.createElement('div');card.id='nova44-settings';card.className='nova44-card';card.style.marginTop='12px';card.innerHTML=`<div class="row"><div><b>Ahorro inteligente</b><div class="mut">Activa automáticamente el modo de rendimiento cuando el dispositivo está con batería baja.</div></div><div class="sw ${S.nova44.autoEco?'on':''}" id="eco44-auto"></div></div><div class="row" style="margin-top:8px"><span>Umbral de batería</span><select class="fld" id="eco44-th" style="width:110px"><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option></select></div><div class="mut" style="margin-top:8px">Nova mantiene el throttling normal de las pestañas; solo reduce trabajo de fondo cuando el modo está activo.</div>`;r.appendChild(card);const swc=card.querySelector('#eco44-auto'),th=card.querySelector('#eco44-th');th.value=String(S.nova44.ecoThreshold);swc.onclick=()=>{S.nova44.autoEco=!S.nova44.autoEco;save44();swc.classList.toggle('on',S.nova44.autoEco);runBatteryCheck44(true)};th.onchange=e=>{S.nova44.ecoThreshold=Math.max(10,Math.min(80,+e.target.value||30));save44();runBatteryCheck44(true)};};fn.__nova44Wrapped=true;N.PG.ajustes=fn;
  };

  let battery44=null;
  const syncEco44=async on=>{try{const ok=await ipc.invoke('performance-mode',!!on);if(!ok)return false;S.nova44.eco=!!on;if(S.nova432)S.nova432.eco=!!on;save44();try{document.getElementById('nova44-performance-btn')?.classList.toggle('on',!!on)}catch{}return true;}catch{return false}};
  const runBatteryCheck44=async manual=>{if(!S.nova44.autoEco||!battery44)return;const low=!battery44.charging && battery44.level*100<=S.nova44.ecoThreshold;if(low!==S.nova44.eco){const ok=await syncEco44(low);if(ok&&manual)toast44(low?'Ahorro automático activado':'Ahorro automático desactivado')}};
  const initBattery44=async()=>{try{if(!navigator.getBattery)return;battery44=await navigator.getBattery();['chargingchange','levelchange'].forEach(ev=>battery44.addEventListener(ev,()=>runBatteryCheck44(false)));runBatteryCheck44(false);}catch{}}

  /* ---------- Route aliases ---------- */
  const oldResolve44=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{
    const raw=String(x||'').replace(/^nova:\/\//,'').toLowerCase();
    const map={workspaces44:'workspaces44',workspacespro:'workspaces44','workspaces-profesional':'workspaces44',rendimiento44:'rendimiento44',taskmanager:'rendimiento44','gestor-rendimiento':'rendimiento44',extensiones44:'extensiones44','real-extensions':'extensiones44'};
    return map[raw] || (oldResolve44?oldResolve44(x):String(x||''));
  };
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct44=(name,fn)=>{if(!N.extraActs.some(a=>a[0]===name))N.extraActs.push([name,fn]);};
  addAct44('Workspaces',()=>route44('workspaces44')); addAct44('Rendimiento',()=>route44('rendimiento44')); addAct44('Extensiones reales',()=>route44('extensiones44'));
  // 4.4 elimina los accesos de usuario a los temas heredados; la apariencia queda en Glass Clean.
  try { if (typeof MENU !== 'undefined' && Array.isArray(MENU)) { for (let i=MENU.length-1;i>=0;i--) if (/^Tema:/i.test(String(MENU[i]?.[0]||''))) MENU.splice(i,1); } } catch {}
  if (Array.isArray(N.MENU)) N.MENU = N.MENU.filter(a => !/^Tema:/i.test(String(a?.[0]||'')));
  if (Array.isArray(N.extraActs)) N.extraActs = N.extraActs.filter(a => !/^Tema:/i.test(String(a?.[0]||'')));
  document.querySelectorAll('#mnp button').forEach(b => { if (/^Tema:/i.test(String(b.textContent||''))) b.remove(); });
  N.nova44={workspaces:()=>route44('workspaces44'),performance:()=>route44('rendimiento44'),extensions:()=>route44('extensiones44')};

  ensureRail(); wrapSettings(); initBattery44();
  setTimeout(()=>{try{refreshWsPopup();}catch{}},250);
  window.addEventListener('beforeunload',()=>{try{wsPopup?.remove()}catch{}});
})();


/* ---- nova441.js ---- */
/* Nova 4.4.1 · News & New Tab Reliability Hotfix */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const isNewTab = t => { try { return !!t?.wv?.getURL && String(t.wv.getURL()).includes('newtab.html'); } catch { return false; } };
  const topic = () => { try { return String(S.sec || 'videojuegos').toLowerCase(); } catch { return 'videojuegos'; } };
  const guestTopic = async t => {
    try {
      const x = await t.wv.executeJavaScript(`new URLSearchParams(location.search).get('sec')||''`);
      return String(x||'').toLowerCase() || topic();
    } catch { return topic(); }
  };
  const injectNews = async t => {
    if (!isNewTab(t) || !t.wv?.executeJavaScript) return;
    try {
      const d = await ipc.invoke('news-feed', { topic: await guestTopic(t) });
      await t.wv.executeJavaScript(`window.__NOVA_NEWS_DATA=${JSON.stringify(d)};window.renderNovaNews&&window.renderNovaNews(window.__NOVA_NEWS_DATA);`);
    } catch {}
  };
  const baseNewTab441 = window.newTab;
  if (typeof baseNewTab441 === 'function') {
    window.newTab = function nova441NewTab(u) {
      const t = baseNewTab441.apply(this, arguments);
      if (t?.wv) {
        const onReady = () => { injectNews(t).catch?.(()=>{}); try { t.wv.removeEventListener('dom-ready', onReady); } catch {} };
        try { t.wv.addEventListener('dom-ready', onReady); } catch {}
        setTimeout(() => injectNews(t).catch?.(()=>{}), 700);
      }
      return t;
    };
    N.newTab = window.newTab;
  }
  // Delegated click: the + button remains operational even if another UI layer moves/rebuilds #tabs.
  document.addEventListener('click', e => {
    const b = e.target?.closest?.('#nt');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    try { window.newTab?.(); } catch { try { typeof newTab === 'function' && newTab(); } catch {} }
  }, true);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey && String(e.key).toLowerCase() === 't') {
      e.preventDefault();
      try { window.newTab?.(); } catch {}
    }
  }, true);
  const old = window.newTab;
  const ensure = () => {
    const b=document.getElementById('nt'); if(!b) return;
    b.type='button'; b.setAttribute('aria-label','Nueva pestaña'); b.title='Nueva pestaña (Ctrl+T)';
    if (!b.dataset.nova441) {
      b.dataset.nova441='1';
      b.addEventListener('pointerup', e => { if(e.button!==0)return; e.preventDefault(); e.stopPropagation(); try { window.newTab?.(); } catch {} });
    }
    const tabsEl=document.getElementById('tabs'); if(tabsEl && tabsEl.lastElementChild!==b) tabsEl.appendChild(b);
  };
  ensure(); setTimeout(ensure,250); setTimeout(ensure,1000);
  window.addEventListener('beforeunload',()=>{});
})();


/* ---- nova50.js ---- */
/* Nova 5.0.0 Quantum Prime
 * Additive UX layer: keeps the proven 4.4.1 browser core and replaces only the visible shell presentation.
 */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const toast = msg => {
    let t = $('#q-toast');
    if (!t) { t = document.createElement('div'); t.id = 'q-toast'; document.body.appendChild(t); }
    t.textContent = String(msg || ''); t.classList.add('on');
    clearTimeout(t.__timer); t.__timer = setTimeout(() => t.classList.remove('on'), 1900);
  };
  const iconPaths = {
    home:'M4 10.5 12 4l8 6.5M6.5 9.5V20h11V9.5M9.5 20v-6h5v6',
    star:'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z',
    work:'M4 7h6l2 2h8v10H4zM4 7V5h6l2 2',
    dl:'M12 4v10M8 11l4 4 4-4M5 20h14',
    ext:'M8 4h3v3h2V4h3v3h4v4h-3v2h3v3h-4v4h-3v-3h-2v3H8v-4H4v-3h3v-2H4V7h4z',
    speed:'M4 14a8 8 0 1 1 16 0M12 14l4-4M12 14h.01',
    settings:'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    history:'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 5v4h4M12 7v5l3 2',
    puzzle:'M7 5h3V3h4v2h3v3h2v4h-2v3h-3v2h-4v-2H7v-3H5V8h2z',
    capture:'M4 8h4l2-3h4l2 3h6v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    search:'M10.7 18.2a7.5 7.5 0 1 1 5.3-2.2L21 21M10.7 15.2a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9',
    info:'M12 10v7M12 7.2v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    menu:'M5 7h14M5 12h14M5 17h14'
  };
  const ico = key => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[key] || iconPaths.info}"/></svg>`;

  const appearanceClass = () => {
    let mode = 'system';
    try { mode = String(S.quantumAppearance || 'system'); } catch {}
    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('q-dark', !!dark);
    document.body.classList.toggle('q-light', !dark);
    document.body.classList.add('quantum-prime');
  };
  const save = () => { try { window.save?.(); } catch {} try { N.save?.(); } catch {} };
  const applyPrimeAppearance = () => { appearanceClass(); };

  // Keep the legacy preference keys readable, but never expose the old theme system in Quantum Prime.
  try {
    if (!S.quantumAppearance) { S.quantumAppearance = 'system'; save(); }
  } catch {}

  if (typeof applyTheme === 'function' && !window.__nova50ApplyThemeWrapped) {
    const baseApplyTheme = applyTheme;
    applyTheme = function quantumApplyTheme() { baseApplyTheme.apply(this, arguments); applyPrimeAppearance(); };
    window.__nova50ApplyThemeWrapped = true;
  }

  const oldResolvePrime = N.resolveFeatureRoute;
  N.resolveFeatureRoute = x => {
    const raw = String(x || '').replace(/^nova:\/\//i, '').split(/[/?#]/)[0].toLowerCase();
    if (raw === 'quantumsettings' || raw === 'prime-settings') return 'quantumsettings';
    return oldResolvePrime ? oldResolvePrime(x) : String(x || '');
  };
  if (N.PG) {
    N.PG.quantumsettings = r => {
      const mode = (() => { try { return String(S.quantumAppearance || 'system'); } catch { return 'system'; } })();
      r.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px;max-width:880px;margin:0 auto;padding-bottom:28px">
        <div style="padding:22px;border:1px solid var(--q-border);border-radius:20px;background:var(--q-surface)"><div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--q-accent);font-weight:800">QUANTUM PRIME</div><h2 style="margin:6px 0 5px;font-size:28px">Ajustes</h2><div class="mut">Lo esencial de Nova, sin opciones que no vayas a usar.</div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Apariencia</div><div class="q-menu-sub" style="margin-bottom:10px">Tres estados simples. Los temas antiguos no forman parte de Quantum Prime.</div><div class="q-theme-row"><button data-qset-theme="system">Sistema</button><button data-qset-theme="light">Claro</button><button data-qset-theme="dark">Oscuro</button></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Privacidad</div><div class="q-menu-sub">El bloqueador se controla desde un único sitio.</div><div class="row" style="margin-top:12px"><span>Bloqueador de anuncios</span><div class="sw ${S.adblock ? 'on' : ''}" id="qset-adblock"></div></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Interfaz</div><div class="q-menu-sub">Animaciones cortas y accesibles.</div><div class="row" style="margin-top:12px"><span>Animaciones de Nova</span><div class="sw ${S.anim !== false ? 'on' : ''}" id="qset-anim"></div></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Rendimiento y energía</div><div class="q-menu-sub">Los controles avanzados se mantienen en sus paneles dedicados.</div><div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap"><button class="btn on" id="qset-perf">Abrir Rendimiento</button><button class="btn" id="qset-ext">Abrir Extensiones</button><button class="btn" id="qset-work">Abrir Workspaces</button></div></div>
        <div class="mut">Nova ${typeof NOVA_VER !== 'undefined' ? NOVA_VER : '5.0.0'} · Chromium · Quantum Prime</div>
      </div>`;
      r.querySelectorAll('[data-qset-theme]').forEach(b => { b.classList.toggle('on', b.dataset.qsetTheme === mode); b.onclick = () => { setAppearance(b.dataset.qsetTheme); N.PG.quantumsettings(r); }; });
      r.querySelector('#qset-adblock').onclick = async () => { S.adblock = !S.adblock; await ipc.invoke('adblock', S.adblock).catch(() => {}); save(); N.PG.quantumsettings(r); };
      r.querySelector('#qset-anim').onclick = () => { S.anim = S.anim === false; save(); try { applyTheme(); } catch {} N.PG.quantumsettings(r); };
      r.querySelector('#qset-perf').onclick = () => goFeature('rendimiento44');
      r.querySelector('#qset-ext').onclick = () => goFeature('extensiones44');
      r.querySelector('#qset-work').onclick = () => goFeature('workspaces44');
    };
  }
  const goFeature = route => { try { return typeof newTab === 'function' ? newTab('nova://' + route) : N.openFeature?.(route); } catch { toast('Esta función no está disponible'); return null; } };
  const openHome = () => { try { newTab(); } catch { toast('No se pudo abrir una pestaña nueva'); } };
  const openFavorites = () => { try { panel = panel === 'marks' ? null : 'marks'; draw(); } catch { toast('No se pudo abrir Favoritos'); } };
  const capture = () => { try { $('#sh')?.click(); } catch { toast('Captura no disponible'); } };
  const findInPage = () => { try { key('f'); } catch { $('#fi')?.focus(); } };

  function buildMenu() {
    if ($('#q-menu')) return;
    const bar = $('#bar'); if (!bar) return;
    const btn = document.createElement('button'); btn.id='q-menu-btn'; btn.type='button'; btn.title='Menú de Nova'; btn.setAttribute('aria-label','Menú de Nova'); btn.innerHTML=ico('menu');
    const sh = $('#sh'); if (sh?.parentNode) sh.parentNode.insertBefore(btn, sh.nextSibling); else bar.appendChild(btn);

    const menu = document.createElement('div'); menu.id='q-menu'; menu.setAttribute('role','menu');
    menu.innerHTML = `
      <div class="q-menu-head"><div class="q-menu-title">Nova Quantum</div><div class="q-menu-sub">Acciones esenciales, sin ruido</div></div>
      <button class="q-menu-item" data-qaction="new">${ico('home')}<span>Nueva pestaña</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+T</span></button>
      <button class="q-menu-item" data-qaction="favorites">${ico('star')}<span>Favoritos</span></button>
      <button class="q-menu-item" data-qaction="history">${ico('history')}<span>Historial</span></button>
      <button class="q-menu-item" data-qaction="downloads">${ico('dl')}<span>Descargas</span></button>
      <div class="q-menu-sep"></div>
      <button class="q-menu-item" data-qaction="workspaces">${ico('work')}<span>Workspaces</span></button>
      <button class="q-menu-item" data-qaction="extensions">${ico('puzzle')}<span>Extensiones</span></button>
      <button class="q-menu-item" data-qaction="performance">${ico('speed')}<span>Rendimiento</span></button>
      <div class="q-menu-sep"></div>
      <button class="q-menu-item" data-qaction="capture">${ico('capture')}<span>Capturar página</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+Shift+S</span></button>
      <button class="q-menu-item" data-qaction="find">${ico('search')}<span>Buscar en la página</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+F</span></button>
      <button class="q-menu-item" data-qaction="settings">${ico('settings')}<span>Ajustes</span></button>
      <div class="q-menu-sep"></div>
      <div class="q-theme"><div class="q-theme-label">Apariencia</div><div class="q-theme-row">
        <button data-qtheme="system">Sistema</button><button data-qtheme="light">Claro</button><button data-qtheme="dark">Oscuro</button>
      </div></div>`;
    document.body.appendChild(menu);
    const toggle = () => menu.classList.toggle('on');
    btn.onclick = e => { e.stopPropagation(); toggle(); syncThemeButtons(); };
    menu.onclick = e => e.stopPropagation();
    document.addEventListener('click', () => menu.classList.remove('on'), true);
    document.addEventListener('keydown', e => { if (e.key==='Escape') menu.classList.remove('on'); if (e.ctrlKey && e.shiftKey && !e.altKey && String(e.key).toLowerCase()==='s') { e.preventDefault(); capture(); } });
    menu.querySelectorAll('[data-qaction]').forEach(b => b.addEventListener('click', () => {
      menu.classList.remove('on');
      const a=b.dataset.qaction;
      if(a==='new')openHome(); else if(a==='favorites')openFavorites(); else if(a==='history')goFeature('historial'); else if(a==='downloads')goFeature('descargas2');
      else if(a==='workspaces')goFeature('workspaces44'); else if(a==='extensions')goFeature('extensiones44'); else if(a==='performance')goFeature('rendimiento44');
      else if(a==='capture')capture(); else if(a==='find')findInPage(); else if(a==='settings')goFeature('quantumsettings');
    }));
    menu.querySelectorAll('[data-qtheme]').forEach(b => b.addEventListener('click', () => { setAppearance(b.dataset.qtheme); }));
    syncThemeButtons();
  }
  function syncThemeButtons() {
    const mode = (()=>{try{return String(S.quantumAppearance||'system')}catch{return 'system'}})();
    document.querySelectorAll('[data-qtheme]').forEach(b=>b.classList.toggle('on',b.dataset.qtheme===mode));
  }
  function setAppearance(mode) {
    if(!['system','light','dark'].includes(mode)) mode='system';
    try { S.quantumAppearance=mode; save(); } catch {}
    appearanceClass(); syncThemeButtons();
    try { refreshNT(); } catch {}
    toast(mode==='system'?'Apariencia: sistema':mode==='light'?'Apariencia: claro':'Apariencia: oscuro');
  }
  window.quantumSetAppearance=setAppearance;

  function buildBrand() {
    const brand=$('#brand'); if(!brand) return;
    brand.innerHTML='<img src="../assets/logo/nova-quantum.svg" alt="Nova" aria-hidden="true"><span>NOVA</span>';
    brand.title='Nova Quantum Prime';
  }

  function buildSidebar() {
    const side=$('#side'); if(!side) return;
    side.innerHTML = `
      <button class="q-side-btn" data-qside="home" title="Inicio" aria-label="Inicio">${ico('home')}</button>
      <div class="q-pin-list" id="q-pin-list" aria-label="Sitios fijados"></div>
      <button class="q-side-btn" data-qside="favorites" title="Favoritos" aria-label="Favoritos">${ico('star')}</button>
      <button class="q-side-btn" data-qside="workspaces" title="Workspaces" aria-label="Workspaces">${ico('work')}</button>
      <button class="q-side-btn" data-qside="downloads" title="Descargas" aria-label="Descargas">${ico('dl')}</button>
      <button class="q-side-btn" data-qside="extensions" title="Extensiones" aria-label="Extensiones">${ico('puzzle')}</button>
      <button class="q-side-btn" data-qside="performance" title="Rendimiento" aria-label="Rendimiento">${ico('speed')}</button>
      <span class="q-side-spacer"></span>
      <button class="q-side-btn" data-qside="settings" title="Ajustes" aria-label="Ajustes">${ico('settings')}</button>`;
    side.onclick = e => {
      const pinned=e.target.closest('[data-qpin-url]');
      if(pinned){ const u=pinned.dataset.qpinUrl; if(/^https?:/i.test(u)){try{newTab(u)}catch{}} return; }
      const b=e.target.closest('[data-qside]'); if(!b)return;
      const a=b.dataset.qside;
      side.querySelectorAll('.q-side-btn').forEach(x=>x.classList.remove('on')); b.classList.add('on');
      if(a==='home')openHome(); else if(a==='favorites')openFavorites(); else if(a==='workspaces')goFeature('workspaces44'); else if(a==='downloads')goFeature('descargas2'); else if(a==='extensions')goFeature('extensiones44'); else if(a==='performance')goFeature('rendimiento44'); else if(a==='settings')goFeature('quantumsettings');
    };
  }

  function refreshPinnedRail() {
    const host=$('#q-pin-list'); if(!host) return;
    let list=[];
    try { list = [...(Array.isArray(S.quick)?S.quick:[]), ...(Array.isArray(S.marks)?S.marks:[])].filter(x=>x&&/^https?:/i.test(String(x.u||''))).filter((x,i,a)=>a.findIndex(y=>y.u===x.u)===i).slice(0,4); } catch {}
    host.innerHTML = list.map((x,i)=>{ let hostName='Sitio'; try{hostName=new URL(x.u).hostname.replace(/^www\./,'')}catch{}; return `<button class="q-pin" data-qpin-url="${String(x.u).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" title="${String(x.t||hostName).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><img src="../assets/logo/nova-quantum.svg" alt=""></button>`; }).join('');
    list.forEach((x,i)=>{ try{ const img=host.querySelectorAll('.q-pin img')[i]; const u=new URL(x.u); if(img){img.src=u.origin+'/favicon.ico';img.onerror=()=>{img.onerror=null;img.src='../assets/logo/nova-quantum.svg';};} }catch{} });
  }
  window.refreshQuantumPins=refreshPinnedRail;

  function cleanLegacyVisibleControls() {
    // Do not delete old handlers or modules; only remove obsolete controls from the visible Prime shell.
    $('#nova22-top-tools')?.classList.add('q-hidden');
    $('#sh')?.classList.add('q-hidden');
    document.querySelectorAll('#side .ib:not(.q-side-btn)').forEach(x=>x.classList.add('q-hidden'));
    // The old theme chooser stays available internally for migration compatibility, but never in the Prime UI.
    document.querySelectorAll('.th').forEach(x=>x.classList.add('q-hidden'));
  }

  function wrapDraw() {
    if(typeof draw!=='function' || window.__nova50DrawWrapped) return;
    const baseDraw=draw;
    draw=function quantumDraw(){ baseDraw.apply(this,arguments); appearanceClass(); cleanLegacyVisibleControls(); };
    window.__nova50DrawWrapped=true;
  }

  // Safer visible behavior: the original newTab function stays untouched. We simply keep the plus button wired after UI rebuilds.
  function ensureNewTabButton() {
    const b=$('#nt'); if(!b) return;
    b.type='button'; b.title='Nueva pestaña (Ctrl+T)'; b.setAttribute('aria-label','Nueva pestaña');
    b.onclick = e => { e?.preventDefault?.(); try { newTab(); } catch { toast('No se pudo abrir la pestaña'); } };
    const tabsEl=$('#tabs'); if(tabsEl && tabsEl.lastElementChild!==b) tabsEl.appendChild(b);
  }

  const init = () => {
    appearanceClass(); buildBrand(); buildSidebar(); buildMenu(); cleanLegacyVisibleControls(); wrapDraw(); ensureNewTabButton(); refreshPinnedRail();
    const mm=window.matchMedia?.('(prefers-color-scheme: dark)');
    mm?.addEventListener?.('change',()=>{try{if(String(S.quantumAppearance||'system')==='system')appearanceClass()}catch{}});
    // Refresh the Prime presentation after older modules finish their setup.
    setTimeout(()=>{appearanceClass();buildSidebar();ensureNewTabButton();refreshPinnedRail();},120);
    setTimeout(()=>{cleanLegacyVisibleControls();refreshPinnedRail();},500);
    $('#st')?.addEventListener('click',()=>setTimeout(refreshPinnedRail,80));
    setInterval(refreshPinnedRail,3000);
  };

  try { document.addEventListener('DOMContentLoaded', init, {once:true}); } catch { init(); }
  if(document.readyState!=='loading') init();
})();


/* ---- nova51.js ---- */
/* Nova 5.1 legacy layer — clean settings, recovery, diagnostics and productivity, retained under Quantum 5.2. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = m => { let t=$('#q51-toast'); if(!t){t=document.createElement('div');t.id='q51-toast';document.body.appendChild(t)} t.textContent=String(m||''); t.classList.add('on'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('on'),2200); };
  const sanitizeState = () => { try {
    S.logo='quantum'; S.theme='nova';
    if(!['system','light','dark'].includes(S.quantumAppearance)) S.quantumAppearance='system';
    if(!Array.isArray(S.marks)) S.marks=[]; if(!Array.isArray(S.hist)) S.hist=[]; if(!Array.isArray(S.dls)) S.dls=[]; if(!Array.isArray(S.quick)) S.quick=[];
    if(!S.performance || typeof S.performance!=='object' || Array.isArray(S.performance)) S.performance={};
    if(!S.mods || typeof S.mods!=='object' || Array.isArray(S.mods)) S.mods={};
    if(typeof S.search!=='string' || !S.search) S.search='https://duckduckgo.com/?q=';
    delete S.topc; delete S.topcc; delete S.topi; delete S.font; delete S.fs; delete S.r; delete S.snd; delete S.sound; delete S.wp; delete S.rand; delete S.sp; delete S.acc;
  } catch {} };
  const saveSafe = () => { try { sanitizeState(); save(); } catch {} };
  try { sanitizeState(); saveSafe(); } catch {}

  const feature = route => { try { return typeof newTab==='function' ? newTab('nova://'+route) : N.openFeature?.(route); } catch { toast('Esta sección no está disponible'); return null; } };
  const baseResolve = N.resolveFeatureRoute;
  N.resolveFeatureRoute = x => {
    const raw=String(x||'').replace(/^nova:\/\//i,'').split(/[/?#]/)[0].toLowerCase();
    const map={ajustes:'quantumsettings',personalizar:'quantumsettings',apariencia:'quantumsettings',fondos:'quantumsettings',mods:'quantumsettings',temas:'quantumsettings',theme:'quantumsettings',actualizaciones:'updates51',update:'updates51',updatecenter:'updates51',diagnostico:'diagnostics51',diagnostics:'diagnostics51',backup:'backup51',restaurar:'backup51',reader:'reader51',lectura:'reader51',novedades:'news51',news:'news51',acciones:'actions51',command:'actions51'};
    return map[raw] || (baseResolve ? baseResolve(x) : String(x||''));
  };

  if (N.PG) {
    N.PG.quantumsettings = r => {
      const mode=String(S.quantumAppearance||'system');
      r.innerHTML=`<div class="q51-settings"><header><div class="q51-eyebrow">NOVA QUANTUM 5.1</div><h2>Ajustes</h2><p>Solo controles que existen en esta versión. Los sistemas antiguos de temas, logos y personalización han sido retirados.</p></header>
      <section class="q51-card"><h3>Apariencia</h3><p>La interfaz de Nova usa un único diseño. Solo cambia el modo de color.</p><div class="q51-seg"><button data-mode="system">Sistema</button><button data-mode="light">Claro</button><button data-mode="dark">Oscuro</button></div></section>
      <section class="q51-card"><h3>Navegación</h3><div class="q51-row"><div><b>Buscador</b><span>El motor usado por la barra y Nueva pestaña.</span></div><select id="q51-search"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select></div><div class="q51-row"><div><b>Abrir enlaces en pestaña</b><span>Controla la preferencia de enlaces del navegador.</span></div><button class="q51-switch ${S.newTabLinks?'on':''}" id="q51-links">${S.newTabLinks?'Activo':'Inactivo'}</button></div></section>
      <section class="q51-card"><h3>Privacidad</h3><div class="q51-row"><div><b>Bloqueador de anuncios y rastreadores</b><span>Se conserva el bloqueador integrado de Nova.</span></div><button class="q51-switch ${S.adblock?'on':''}" id="q51-adblock">${S.adblock?'Activo':'Inactivo'}</button></div><div class="q51-actions"><button class="q51-btn" id="q51-clear">Limpiar datos</button><button class="q51-btn" id="q51-repair">Reparar interfaz</button><button class="q51-btn" data-open="diagnostics51">Comprobar estado</button></div></section>
      <section class="q51-card"><h3>Rendimiento</h3><div class="q51-row"><div><b>Ahorro de energía / memoria</b><span>Reduce actividad de pestañas en segundo plano cuando lo necesites.</span></div><button class="q51-switch ${S.performance?.memorySaver?'on':''}" id="q51-eco">${S.performance?.memorySaver?'Activo':'Inactivo'}</button></div><div class="q51-actions"><button class="q51-btn" data-open="rendimiento44">Rendimiento</button><button class="q51-btn" data-open="reader51">Modo lectura</button></div></section>
      <section class="q51-card"><h3>Extensiones y Workspaces</h3><div class="q51-actions"><button class="q51-btn" data-open="extensiones44">Extensiones</button><button class="q51-btn" data-open="workspaces44">Workspaces</button></div></section>
      <section class="q51-card"><h3>Actualización y recuperación</h3><div class="q51-actions"><button class="q51-btn" data-open="updates51">Buscar actualización</button><button class="q51-btn" data-open="backup51">Copias de seguridad</button><button class="q51-btn" data-open="diagnostics51">Diagnóstico</button></div></section>
      <footer>Nova ${typeof NOVA_VER!=='undefined'?NOVA_VER:'5.1.0'} · Chromium ${process.versions.chrome} · Electron ${process.versions.electron}</footer></div>`;
      const sel=$('#q51-search'); if(sel){sel.value=S.search; sel.onchange=e=>{S.search=e.target.value;saveSafe();refreshNT?.()}};
      r.querySelectorAll('.q51-seg button').forEach(b=>{b.classList.toggle('on',b.dataset.mode===mode);b.onclick=()=>{S.quantumAppearance=b.dataset.mode;saveSafe();try{window.quantumSetAppearance?.(b.dataset.mode)}catch{};N.PG.quantumsettings(r)}});
      $('#q51-links').onclick=()=>{S.newTabLinks=!S.newTabLinks;saveSafe();N.PG.quantumsettings(r)};
      $('#q51-adblock').onclick=async()=>{S.adblock=!S.adblock;try{await ipc.invoke('adblock',S.adblock)}catch{} saveSafe();N.PG.quantumsettings(r)};
      $('#q51-eco').onclick=async()=>{const on=!S.performance?.memorySaver;try{await ipc.invoke('performance-mode',on)}catch{} S.performance=Object.assign(S.performance||{},{memorySaver:on});saveSafe();N.PG.quantumsettings(r)};
      $('#q51-clear').onclick=async()=>{await ipc.invoke('clear').catch(()=>{});S.hist=[];saveSafe();toast('Datos locales limpiados')}; $('#q51-repair').onclick=()=>{sanitizeState();saveSafe();toast('Configuración de interfaz reparada');setTimeout(()=>location.reload(),500)};
      r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>feature(b.dataset.open));
    };

    N.PG.updates51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">NOVA UPDATE CENTER</div><h2>Actualizaciones</h2><p>Comprueba la versión disponible sin modificar tus datos.</p><div class="q51-card" id="q51-update-box">Comprobando…</div><button class="q51-btn" id="q51-update-check">Buscar de nuevo</button></div>';
      const box=$('#q51-update-box'), render=x=>{const newer=x?.newer||x?.state?.status==='available'; const failed=x?.ok===false; const title=failed?'No se pudo comprobar':x?.status==='checking'?'Comprobando…':newer?'Hay una versión disponible':'Nova está al día'; const sub=failed?'Comprueba tu conexión o abre los lanzamientos de GitHub.':`Instalada: ${esc(x?.current||NOVA_VER||'5.1.0')}${x?.latest?` · Última: ${esc(x.latest)}`:''}`; box.innerHTML=`<div class="q51-status ${failed?'bad':'good'}"><b>${title}</b><span>${sub}</span></div>${x?.url?`<button class="q51-btn" id="q51-open-release">Abrir lanzamientos</button>`:''}`; if($('#q51-open-release'))$('#q51-open-release').onclick=()=>{try{require('electron').shell.openExternal(x.url)}catch{}}};
      $('#q51-update-check').onclick=async()=>{box.textContent='Comprobando…'; const x=await ipc.invoke('update-check').catch(()=>({ok:false}));render(x)};
      const x=await ipc.invoke('update-check').catch(()=>({ok:false})); render(x);
    };

    N.PG.backup51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">SAFE STATE</div><h2>Copias de seguridad</h2><p>Nova guarda una copia de la configuración antes de sobrescribir el estado persistente.</p><div class="q51-card" id="q51-backup-box">Leyendo estado…</div><div class="q51-actions"><button class="q51-btn" id="q51-restore">Restaurar última copia</button><button class="q51-btn" id="q51-export">Exportar estado</button></div></div>';
      const d=await ipc.invoke('nova51-diagnostics').catch(()=>({})); const b=$('#q51-backup-box'); b.innerHTML=`<div class="q51-status good"><b>${d?.state?.backup?'Copia disponible':'Sin copia secundaria todavía'}</b><span>${d?.state?.ok?'Estado principal válido.':'Estado principal no disponible; Nova usará recuperación controlada.'}</span></div>`;
      $('#q51-restore').onclick=async()=>{const x=await ipc.invoke('nova51-restore-backup').catch(()=>({ok:false})); if(!x.ok)return toast(x.error||'No se pudo restaurar'); try{localStorage.nova=x.state;toast('Copia restaurada. Reiniciando…');setTimeout(()=>location.reload(),500)}catch{toast('Copia restaurada')} };
      $('#q51-export').onclick=async()=>{const raw=await ipc.invoke('nova51-export-state').catch(()=>null);if(!raw)return toast('No hay estado exportable');const blob=new Blob([raw],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nova-quantum-5.1-state.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
    };

    N.PG.diagnostics51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">QUANTUM DIAGNOSTICS</div><h2>Estado del navegador</h2><p>Comprueba recursos y configuración persistente sin modificar nada.</p><div class="q51-grid" id="q51-dg">Comprobando…</div></div>';
      const d=await ipc.invoke('nova51-diagnostics').catch(()=>null), g=$('#q51-dg');
      if(!d){g.innerHTML='<div class="q51-card"><b>No se pudo ejecutar el diagnóstico.</b></div>';return}
      const row=(ok,ttl,sub)=>`<div class="q51-card q51-ditem"><span class="q51-dot ${ok?'good':'warn'}"></span><div><b>${esc(ttl)}</b><span>${esc(sub)}</span></div></div>`;
      g.innerHTML=row(d.prefs?.ok,'Preferencias',d.prefs?.ok?'Válidas':'Revisión necesaria')+row(d.state?.ok,'Estado principal',d.state?.ok?'Legible':'No legible')+row(d.state?.backup,'Copia de seguridad',d.state?.backup?'Disponible':'No disponible')+row(d.prime?.iconIco&&d.prime?.iconPng,'Marca Prime',d.prime?.legacyLogoDir||d.prime?.legacyThemeFile?'Quedan residuos':'Limpia')+row(!d.renderer?.nodeIntegration,'Aislamiento del renderer',d.renderer?.nodeIntegration?'Legacy: Node integration activa; requiere migración futura':'Aislado');
      g.insertAdjacentHTML('beforeend',`<div class="q51-card"><b>Nova ${esc(d.version)}</b><span>Chromium ${esc(d.chromium)} · Electron ${esc(d.electron)}</span></div>`);
    };

    N.PG.reader51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">FOCUS</div><h2>Modo lectura</h2><p>Reduce elementos de interfaz en la página web actual para facilitar la lectura.</p><div class="q51-card"><button class="q51-btn" id="q51-reader-on">Activar en la página actual</button><button class="q51-btn" id="q51-reader-off">Desactivar</button></div></div>';
      $('#q51-reader-on').onclick=()=>{const t=N.activeWebTab?.();if(!t?.wv)return toast('Abre una página web');try{mod(t.wv,'reader',true);toast('Modo lectura activado')}catch{toast('No se pudo activar')}};
      $('#q51-reader-off').onclick=()=>{const t=N.activeWebTab?.();if(!t?.wv)return;try{mod(t.wv,'reader',false);toast('Modo lectura desactivado')}catch{}};
    };

    N.PG.news51 = r => {
      r.innerHTML=`<div class="q51-page"><div class="q51-eyebrow">NOVA NEWS</div><h2>Novedades actuales</h2><p>Esta vista solo muestra el ciclo actual y la historia recontextualizada del proyecto.</p><div class="q51-grid"><div class="q51-card"><b>Nova 5.1.0 Quantum Hotfix</b><span>Ajustes limpios, recuperación de configuración, diagnóstico, actualización y eliminación de restos de temas/logos antiguos.</span></div><div class="q51-card"><b>Nova 5.0.0 Quantum Prime</b><span>Base visual Prime, sidebar calmada, menú compacto, favicons reales, rendimiento y ahorro de energía.</span></div><div class="q51-card"><b>Nova 3.1 — Legacy Foundation</b><span>Recontextualizada como etapa fundacional: consolidó la navegación modular y dejó capacidades que hoy se mantienen bajo capas Prime.</span></div><div class="q51-card"><b>Nova 3.0 — Legacy Foundation</b><span>Recontextualizada como salto estructural histórico: introdujo una base de herramientas y páginas internas que luego evolucionaron hacia Quantum.</span></div></div></div>`;
    };

    N.PG.actions51 = r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">COMMAND</div><h2>Acciones rápidas</h2><p>Busca funciones y abre herramientas sin llenar la barra.</p><div class="q51-grid" id="q51-actions-grid"></div></div>';
      const acts=[['Nueva pestaña','new'],['Favoritos','fav'],['Historial','history'],['Descargas','downloads'],['Workspaces','work'],['Extensiones','ext'],['Rendimiento','perf'],['Modo lectura','reader51'],['Actualizaciones','updates51'],['Diagnóstico','diagnostics51'],['Copias de seguridad','backup51'],['Ajustes','quantumsettings']];
      const g=$('#q51-actions-grid');g.innerHTML=acts.map(([n,k])=>`<button class="q51-card q51-action" data-a="${k}"><b>${n}</b><span>Abrir</span></button>`).join('');g.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='new')newTab();else if(a==='fav')feature('marcadores');else if(a==='history')feature('historial');else if(a==='downloads')feature('descargas2');else if(a==='work')feature('workspaces44');else if(a==='ext')feature('extensiones44');else if(a==='perf')feature('rendimiento44');else feature(a)});
    };
    N.PG.ajustes = N.PG.quantumsettings;
  }

  // Hide and neutralize legacy visible routes/actions.
  const legacyNames=['personalizar','fondos','mods','tienda','bienvenida'];
  legacyNames.forEach(k=>{ if(N.PG) N.PG[k]=N.PG.quantumsettings; });
  try { N.LG={quantum:'Nova Quantum'}; N.setLogo=()=>{S.logo='quantum';saveSafe();try{refreshNT?.()}catch{}}; } catch {}
  N.welcome=()=>{S.welcomed=1;S.done=1;saveSafe();feature('quantumsettings')};
  N.tour=()=>feature('quantumsettings');
  N.resolveFeatureRoute('ajustes');

  function cleanUI(){
    document.querySelectorAll('#mn,#mnp,#nova22-top-tools,.nova22-topbtn,.n40-dock,.th,.lg,.pal,.apx,[data-t="win95"],[data-t="undertale"],[data-t="cyberpunk"],[data-t="neon"]').forEach(e=>e.classList.add('q51-hidden'));
    const textTargets=document.querySelectorAll('button,span,h2,h3,div');
    textTargets.forEach(e=>{const tx=(e.textContent||'').trim();if(/Windows 95|Undertale|Cyberpunk|Neón|Retro 2009|Clásico|Órbita|Estrella|Cometa|Minimal/.test(tx)&&e.closest('.ipage'))e.classList.add('q51-hidden')});
  }
  // Ctrl+K command palette: tabs, favorites, history and settings.
  function palette(){
    let ov=$('#q51-palette'); if(ov){ov.classList.toggle('on'); if(ov.classList.contains('on'))setTimeout(()=>$('#q51-pal-input')?.focus(),10);return;}
    ov=document.createElement('div');ov.id='q51-palette';ov.innerHTML='<div class="q51-pal-box"><input id="q51-pal-input" placeholder="Buscar pestañas, favoritos, historial o acciones…" autocomplete="off"><div id="q51-pal-list"></div><div class="q51-pal-hint">Esc para cerrar · Enter para abrir</div></div>';document.body.appendChild(ov);
    const input=$('#q51-pal-input'), list=$('#q51-pal-list');
    const build=q=>{q=String(q||'').toLowerCase();const items=[];
      try{tabs.forEach(t=>{const title=t.el?.querySelector('span')?.textContent||'Nueva pestaña',url=t.wv?.getURL?.()||'';items.push({type:'Pestaña',label:title+' '+url,run:()=>sel(t)})})}catch{}
      try{(S.marks||[]).slice(0,20).forEach(m=>items.push({type:'Favorito',label:m.t||m.u,run:()=>newTab(m.u)}))}catch{}
      try{(S.hist||[]).slice(0,30).forEach(m=>items.push({type:'Historial',label:m.t||m.u,run:()=>newTab(m.u)}))}catch{}
      items.push({type:'Acción',label:'Ajustes',run:()=>feature('quantumsettings')},{type:'Acción',label:'Workspaces',run:()=>feature('workspaces44')},{type:'Acción',label:'Rendimiento',run:()=>feature('rendimiento44')},{type:'Acción',label:'Extensiones',run:()=>feature('extensiones44')},{type:'Acción',label:'Diagnóstico',run:()=>feature('diagnostics51')},{type:'Acción',label:'Actualizaciones',run:()=>feature('updates51')});
      const out=items.filter(x=>!q||x.label.toLowerCase().includes(q)||x.type.toLowerCase().includes(q)).slice(0,12);list.innerHTML=out.map((x,i)=>`<button class="q51-pal-item" data-i="${i}"><span>${esc(x.type)}</span><b>${esc(x.label.slice(0,120))}</b></button>`).join('')||'<div class="q51-pal-empty">Sin resultados</div>';list.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{out[+b.dataset.i].run();ov.classList.remove('on')});};
    input.oninput=()=>build(input.value);input.onkeydown=e=>{if(e.key==='Escape')ov.classList.remove('on');if(e.key==='Enter'){list.querySelector('.q51-pal-item')?.click()}};build('');ov.classList.add('on');
    ov.onclick=e=>{if(e.target===ov)ov.classList.remove('on')};
  }
  window.addEventListener('keydown',e=>{if(e.ctrlKey&&!e.altKey&&!e.shiftKey&&String(e.key).toLowerCase()==='k'){e.preventDefault();palette()}},true);
  document.addEventListener('DOMContentLoaded',()=>{cleanUI();setTimeout(cleanUI,300);setTimeout(cleanUI,1000);}, {once:true});
  try { document.head.insertAdjacentHTML('beforeend', `<style id="q51-style">
    #q51-toast{position:fixed;left:50%;bottom:18px;transform:translate(-50%,10px);opacity:0;pointer-events:none;transition:opacity .16s,transform .16s;background:var(--bar);color:var(--fg);border:1px solid var(--bd);border-radius:10px;padding:9px 13px;box-shadow:0 14px 42px #0003;z-index:2000}#q51-toast.on{opacity:1;transform:translate(-50%,0)}
    .q51-settings,.q51-page{max-width:860px;margin:0 auto;padding:22px 0 40px;display:flex;flex-direction:column;gap:14px}.q51-settings header,.q51-page>header{padding:8px 4px 10px}.q51-eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);font-weight:800}.q51-settings h2,.q51-page h2{margin:4px 0;font-size:28px}.q51-settings header p,.q51-page>p{margin:0;color:var(--mut);line-height:1.55}.q51-card{background:color-mix(in srgb,var(--bar) 92%,transparent);border:1px solid var(--bd);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;box-shadow:0 10px 26px rgba(0,0,0,.04)}.q51-card h3{margin:0;font-size:15px}.q51-card p,.q51-card span{color:var(--mut);font-size:12px;line-height:1.5}.q51-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.q51-row>div{display:flex;flex-direction:column;gap:3px}.q51-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.q51-seg button,.q51-btn,.q51-switch{border:1px solid var(--bd);background:transparent;color:var(--fg);border-radius:10px;padding:9px 11px;font:inherit;cursor:pointer}.q51-seg button.on,.q51-btn:hover,.q51-switch.on{border-color:color-mix(in srgb,var(--acc) 50%,var(--bd));background:color-mix(in srgb,var(--acc) 8%,transparent);color:var(--acc)}.q51-switch{min-width:86px}.q51-actions{display:flex;flex-wrap:wrap;gap:8px}.q51-settings footer{font-size:11px;color:var(--mut);padding:5px}.q51-status{display:flex;flex-direction:column;gap:4px}.q51-status b{font-size:16px}.q51-status.good b{color:#2f9b70}.q51-status.bad b{color:#c05b5b}.q51-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.q51-ditem{flex-direction:row;align-items:center;gap:10px}.q51-dot{width:9px;height:9px;border-radius:50%;background:#d1d5db;flex:none}.q51-dot.good{background:#3db68a}.q51-dot.warn{background:#d59b43}.q51-action{text-align:left;cursor:pointer}.q51-action b,.q51-action span{display:block}.q51-action b{color:var(--fg)}.q51-hidden{display:none!important}
    #q51-palette{position:fixed;inset:0;background:rgba(15,17,22,.28);backdrop-filter:blur(5px);display:none;place-items:start center;padding-top:10vh;z-index:2100}.q-dark #q51-palette{background:rgba(0,0,0,.42)}#q51-palette.on{display:grid}.q51-pal-box{width:min(720px,92vw);background:var(--bar);border:1px solid var(--bd);border-radius:16px;box-shadow:0 28px 90px #0004;overflow:hidden}.q51-pal-box input{width:100%;border:0;border-bottom:1px solid var(--bd);background:transparent;color:var(--fg);outline:0;padding:15px 17px;font-size:14px}.q51-pal-item{display:grid;grid-template-columns:80px 1fr;gap:10px;width:100%;text-align:left;border:0;background:transparent;color:var(--fg);padding:10px 15px;cursor:pointer}.q51-pal-item:hover{background:color-mix(in srgb,var(--acc) 8%,transparent)}.q51-pal-item span{color:var(--mut);font-size:10px;text-transform:uppercase;letter-spacing:.08em}.q51-pal-item b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.q51-pal-empty{padding:16px;color:var(--mut)}.q51-pal-hint{padding:9px 15px;color:var(--mut);font-size:10px;border-top:1px solid var(--bd)}
    @media(max-width:700px){.q51-grid{grid-template-columns:1fr}.q51-row{align-items:flex-start;flex-direction:column}.q51-seg{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){#q51-toast,.q51-card,.q51-pal-item{transition:none!important}}
  </style>`)} catch {}

  // Make Nova's old logo/menus impossible to re-enable through old modules.
  try { Object.keys(THEMES).forEach(k=>{if(k!=='nova')delete THEMES[k]}); } catch {}
  try { document.body.classList.add('quantum-prime'); } catch {}
})();


/* ---- nova52.js ---- */
/* Nova 5.2.0 Identity — visual polish only; core navigation intentionally untouched. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  document.title = 'Nova Quantum';
  const style = document.createElement('style'); style.id = 'nova52-identity-style';
  style.textContent = `
    body.quantum-prime #brand{letter-spacing:.12em;font-weight:700}
    body.quantum-prime #brand img{border-radius:8px}
    body.quantum-prime #bar{box-shadow:0 1px 0 rgba(255,255,255,.03)}
    body.quantum-prime #addr{font-weight:450;letter-spacing:-.005em}
    body.quantum-prime .tab{transition:background 150ms ease,color 150ms ease,transform 150ms ease,box-shadow 150ms ease}
    body.quantum-prime .tab:active{transform:translateY(1px)}
    body.quantum-prime #q-menu{border-radius:14px;box-shadow:0 20px 56px rgba(0,0,0,.18)}
    body.quantum-prime #q-menu .q-menu-item{min-height:38px}
    body.quantum-prime #side .ib{transition:background 130ms ease,color 130ms ease,transform 130ms ease}
    body.quantum-prime #side .ib:hover{transform:translateY(-1px)}
    body.quantum-prime #side .ai svg{animation:none;filter:none}
    body.quantum-prime #side .ai:hover svg{filter:none}
    @media(prefers-reduced-motion:reduce){body.quantum-prime .tab,body.quantum-prime #side .ib{transition:none!important}}
  `;
  document.head.appendChild(style);

  // Keep old 5.1 labels from leaking into the visible settings/about pages.
  if (N.PG && typeof N.PG.quantumsettings === 'function') {
    const oldSettings = N.PG.quantumsettings;
    N.PG.quantumsettings = (r) => { oldSettings(r); r.querySelectorAll('.q51-eyebrow').forEach(x => x.textContent='NOVA QUANTUM 5.2'); r.querySelectorAll('footer').forEach(x => x.innerHTML=x.innerHTML.replace(/5\.1\.0/g,'5.2.0')); };
  }
  if (N.PG && typeof N.PG.acerca === 'function') {
    const oldAbout = N.PG.acerca;
    N.PG.acerca = (r) => {
      oldAbout(r);
      const stale=[...r.querySelectorAll('*')].filter(el => /5\.1\.0/.test(el.textContent||''));
      stale.forEach(el => { if(el.children.length===0) el.textContent=el.textContent.replace(/5\.1\.0/g,'5.2.0'); });
      const brand = document.createElement('div'); brand.className='nova52-about-brand'; brand.innerHTML='<img src="../assets/logo/nova-quantum.svg" alt="Nova"><div><b>Nova Quantum</b><span>Identity 5.2 · Calm by design.</span></div>'; r.prepend(brand);
    };
  }
  N.nova52 = Object.assign(N.nova52 || {}, { version:'5.2.0', identity:'Calm', coreNavigationProtected:true });
})();


/* ---- nova53.js ---- */
/* Nova 5.3.0 Reborn — renderer refresh, Extension Center, What's New and visual identity. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = () => { try { window.save?.(); } catch {} try { N.save?.(); } catch {} };
  const toast53 = msg => { let t=$('#q53-toast'); if(!t){t=document.createElement('div');t.id='q53-toast';t.className='q53-toast';document.body.appendChild(t)} t.textContent=String(msg||'');t.classList.add('on');clearTimeout(t.__x);t.__x=setTimeout(()=>t.classList.remove('on'),1800); };
  const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const icons = {
    palette:'M12 3a9 9 0 1 0 8.5 11.9 2.4 2.4 0 0 0-2.3-3.2H16a2 2 0 0 1-2-2v-.2a2.4 2.4 0 0 0-2.4-2.4H9.2A2.2 2.2 0 0 1 7 5.8',
    puzzle:'M8 4h3v3h2V4h3v3h4v4h-3v2h3v3h-4v4h-3v-3h-2v3H8v-4H4v-3h3V7H4V4z',
    spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
    shield:'M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6zM9.5 12l1.8 1.8 3.7-4',
    book:'M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z',
    info:'M12 10v7M12 7.2v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    rotate:'M20 11a8 8 0 1 0 1 4M20 4v7h-7'
  };
  const shellLink = (route, title) => { try { return N.openFeature?.(route) || newTab('nova://'+route); } catch { toast53(title+' no disponible'); return null; } };

  // ---------- Renderer skin ----------
  const applyRenderer = () => {
    document.body.classList.add('nova53-reborn');
    document.body.classList.remove('quantum-prime');
    const brand=$('#brand'); if(brand){brand.innerHTML='<img src="../assets/logo/nova-quantum-reborn.svg" alt="Nova"><span>NOVA</span>';brand.title='Nova Quantum 5.3 · Reborn';}
    $('#sh')?.classList.add('q-hidden');
    $('#nova22-top-tools')?.classList.add('q-hidden');
    $('#mn')?.classList.add('q-hidden');
    $('#bl')?.classList.add('q-hidden');
    $('#n40-dock')?.classList.add('q-hidden');
  };

  // ---------- Accent selector (accents, not old full themes) ----------
  const accentList = [
    ['Azul','#2563eb'],['Violeta','#7c5cff'],['Esmeralda','#10b981'],['Coral','#f26b5e'],['Ámbar','#d99018']
  ];
  const setAccent = color => { try{S.quantumAccent=color;S.acc=color;save();document.documentElement.style.setProperty('--acc',color);document.documentElement.style.setProperty('--acc2',color);document.documentElement.style.setProperty('--q53-accent',color);document.documentElement.style.setProperty('--q53-accent-soft',color+'1a');refreshNT?.();}catch{} };
  const syncAccent = () => { try{setAccent(S.quantumAccent||'#2563eb')}catch{} };
  const buildAccent = () => {
    if($('#q53-accent-btn')) return;
    const bar=$('#bar'); if(!bar)return;
    const btn=document.createElement('button');btn.id='q53-accent-btn';btn.type='button';btn.title='Color de Nova';btn.setAttribute('aria-label','Color de Nova');btn.innerHTML=svg(icons.palette);bar.appendChild(btn);
    const pop=document.createElement('div');pop.id='q53-accent-pop';pop.innerHTML='<div class="q53-accent-title">Color de Nova</div><div class="q53-accent-grid">'+accentList.map(([n,c])=>`<button title="${n}" data-c="${c}" style="--sw:${c}"><span></span></button>`).join('')+'</div><div class="q53-muted" style="padding:8px 6px 2px;font-size:10px">Solo cambia el acento. El diseño permanece Quantum.</div>';document.body.appendChild(pop);
    btn.onclick=e=>{e.stopPropagation();pop.classList.toggle('on');};pop.onclick=e=>e.stopPropagation();document.addEventListener('click',()=>pop.classList.remove('on'),true);
    pop.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{setAccent(b.dataset.c);pop.classList.remove('on');syncAccent();});
    syncAccent();
  };

  // ---------- Visible Reborn navigation ----------
  const addRebornNavigation = () => {
    const side=$('#side');
    if(side && !$('#q53-store-side')){
      const b=document.createElement('button');b.id='q53-store-side';b.className='q53-side-btn';b.type='button';b.title='Extension Center';b.setAttribute('aria-label','Extension Center');b.innerHTML=svg(icons.puzzle);
      const ext=side.querySelector('[data-qside=\"extensions\"]');
      if(ext) ext.after(b); else side.insertBefore(b,side.querySelector('.q-side-spacer')||null);
      b.addEventListener('click',e=>{e.stopPropagation();shellLink('extensioncenter53','Extensiones')});
    }
    const menu=$('#q-menu');
    if(menu && !$('#q53-menu-news')){
      const b=document.createElement('button');b.id='q53-menu-news';b.className='q-menu-item';b.type='button';b.innerHTML=svg(icons.spark)+'<span>Qué hay de nuevo</span>';
      const sep=menu.querySelectorAll('.q-menu-sep')[0]; if(sep) sep.after(b); else menu.appendChild(b);
      b.onclick=()=>{menu.classList.remove('on');shellLink('whatsnew53','Novedades')};
      const g=document.createElement('button');g.id='q53-menu-guide';g.className='q-menu-item';g.type='button';g.innerHTML=svg(icons.book)+'<span>Repetir guía de inicio</span>';
      const newsb=menu.querySelector('#q53-menu-news'); if(newsb) newsb.after(g); else menu.appendChild(g);
      g.onclick=()=>{menu.classList.remove('on');shellLink('guide53','Guía')};
    }
  };

  // ---------- Extension Center ----------
  const catalog = [
    {id:'ublock-origin-lite',name:'uBlock Origin Lite',cat:'Privacidad',desc:'Bloqueo de contenido y rastreadores con una experiencia ligera.',rating:'4.7',url:'https://chromewebstore.google.com/search/uBlock%20Origin%20Lite'},
    {id:'bitwarden',name:'Bitwarden',cat:'Privacidad',desc:'Gestor de contraseñas y credenciales para el navegador.',rating:'4.8',url:'https://chromewebstore.google.com/search/Bitwarden'},
    {id:'dark-reader',name:'Dark Reader',cat:'Apariencia',desc:'Tema oscuro para páginas web, con ajustes por sitio.',rating:'4.7',url:'https://chromewebstore.google.com/search/Dark%20Reader'},
    {id:'sponsorblock',name:'SponsorBlock',cat:'Vídeo',desc:'Salta segmentos patrocinados de vídeos usando una base comunitaria.',rating:'4.8',url:'https://chromewebstore.google.com/search/SponsorBlock'},
    {id:'tampermonkey',name:'Tampermonkey',cat:'Utilidades',desc:'Gestión de userscripts para personalizar páginas web.',rating:'4.5',url:'https://chromewebstore.google.com/search/Tampermonkey'},
    {id:'react-devtools',name:'React Developer Tools',cat:'Desarrollo',desc:'Herramientas para inspeccionar componentes React y su rendimiento.',rating:'4.6',url:'https://chromewebstore.google.com/search/React%20Developer%20Tools'},
    {id:'jsonviewer',name:'JSON Viewer',cat:'Desarrollo',desc:'Vista más cómoda para inspeccionar respuestas JSON en el navegador.',rating:'4.4',url:'https://chromewebstore.google.com/search/JSON%20Viewer'},
    {id:'keepa',name:'Keepa',cat:'Utilidades',desc:'Seguimiento de precios y evolución histórica para compras online.',rating:'4.6',url:'https://chromewebstore.google.com/search/Keepa'}
  ];
  const extIcon = svg(icons.puzzle);
  const extensionPage = async r => {
    const partition=typeof N.profilePartition==='function'?N.profilePartition():'persist:web';
    r.innerHTML=`<div class="q53-shell-page"><div class="q53-shell-inner"><div class="q53-store-top"><div><div class="q53-kicker">NOVA EXTENSION CENTER</div><div class="q53-title">Extensiones</div><p class="q53-sub">Un catálogo limpio para descubrir extensiones reales. Nova mantiene el control de instalación: puedes cargar una extensión Chromium desde una carpeta y las extensiones cargadas se restauran automáticamente al iniciar.</p></div><div class="q53-search"><input id="q53-ext-search" placeholder="Buscar extensiones…"><button class="q53-btn primary" id="q53-ext-load">＋ Cargar carpeta</button></div></div>
      <div class="q53-note">Las fichas enlazan a búsquedas de la Chrome Web Store. Nova no descarga código silenciosamente: para instalar una extensión desde el catálogo, revisa su ficha y usa la carga oficial o el flujo compatible de Chromium.</div>
      <div class="q53-chips" id="q53-ext-chips"></div><div class="q53-ext" id="q53-ext-list"></div><div class="q53-card" style="margin-top:14px"><h3>Extensiones cargadas en este perfil</h3><p>Estas extensiones reales proceden de carpetas locales y se conservan para el arranque siguiente.</p><div id="q53-ext-loaded" style="margin-top:10px"></div></div></div></div>`;
    const cats=['Todas',...new Set(catalog.map(x=>x.cat))];let active='Todas';let q='';
    const render=()=>{
      const list=catalog.filter(x=>(active==='Todas'||x.cat===active)&&(!q||(`${x.name} ${x.desc} ${x.cat}`).toLowerCase().includes(q.toLowerCase())));
      r.querySelector('#q53-ext-list').innerHTML=list.map(x=>`<article class="q53-ext-card"><div class="q53-ext-icon">${extIcon}</div><div class="q53-ext-meta"><b>${esc(x.name)}</b><span>${esc(x.desc)}</span><div class="q53-rating">★ ${esc(x.rating)} · ${esc(x.cat)}</div></div><div class="q53-ext-actions"><button class="q53-btn" data-store="${esc(x.url)}">Ver tienda</button></div></article>`).join('')||'<div class="q53-card"><p>No hay resultados.</p></div>';
      r.querySelector('#q53-ext-chips').innerHTML=cats.map(c=>`<button class="q53-chip ${c===active?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
      r.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;render()});
      r.querySelectorAll('[data-store]').forEach(b=>b.onclick=()=>{const u=b.dataset.store;if(/^https?:/i.test(u))newTab(u)});
    };
    r.querySelector('#q53-ext-search').oninput=e=>{q=e.target.value;render()};
    r.querySelector('#q53-ext-load').onclick=async()=>{const d=await ipc.invoke('extension-pick-load',{partition}).catch(()=>({ok:false,error:'No disponible'}));toast53(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar'));paintLoaded();};
    const paintLoaded=async()=>{const d=await ipc.invoke('extensions-list',{partition}).catch(()=>({ok:false,items:[]}));const items=Array.isArray(d?.items)?d.items:[];r.querySelector('#q53-ext-loaded').innerHTML=items.map(x=>`<div class="q53-ext-card" style="margin-bottom:7px"><div class="q53-ext-icon">${extIcon}</div><div class="q53-ext-meta"><b>${esc(x.name||'Extensión')}</b><span>v${esc(x.version||'')} · ${esc(x.path||'')}</span></div><div class="q53-ext-actions"><button class="q53-btn" data-remove="${esc(x.id)}">Quitar</button></div></div>`).join('')||'<span class="q53-muted">No hay extensiones cargadas en este perfil.</span>';r.querySelectorAll('[data-remove]').forEach(b=>b.onclick=async()=>{const ok=await ipc.invoke('extension-unload',{partition,id:b.dataset.remove}).catch(()=>false);toast53(ok?'Extensión retirada':'No se pudo retirar');paintLoaded();});};
    render();await paintLoaded();
  };

  // ---------- What's New ----------
  const whatsNew = r => {
    const slides=[
      {title:'Nuevo renderer Quantum',desc:'Interfaz renovada, tipografía más coherente, menús más relajados y un shell visual separado del núcleo de navegación.',img:'../assets/reborn/whatsnew-renderer.png'},
      {title:'Extension Center renovado',desc:'Descubre extensiones reales, revisa su propósito y cárgalas de forma controlada. Las extensiones cargadas se restauran al iniciar.',img:'../assets/reborn/store-extensions.png'},
      {title:'Más rendimiento visual',desc:'Menos ruido en la interfaz, animaciones cortas y reducción de efectos cuando el sistema prefiere menos movimiento.',img:'../assets/reborn/whatsnew-performance.png'},
      {title:'Nuevas ilustraciones Quantum',desc:'Recursos propios para hacer la experiencia de bienvenida, noticias y novedades más clara y reconocible.',img:'../assets/reborn/whatsnew-onboarding.png'}
    ];
    let idx=0;
    r.innerHTML=`<div class="q53-shell-page q53-whats"><div class="q53-shell-inner"><div class="q53-kicker">NOVA 5.3</div><div class="q53-title">What's New</div><p class="q53-sub">Conoce el rediseño de Nova 5.3 con una presentación guiada y suave.</p><div class="q53-steps">${slides.map((_,i)=>`<div class="q53-step ${i===0?'on':''}" data-step="${i}"><span></span></div>`).join('')}</div><img class="q53-hero-img" id="q53-hero" src="${slides[0].img}" alt="${esc(slides[0].title)}"><div class="q53-card" style="margin-top:12px"><div class="q53-kicker" id="q53-slide-kicker">01 / ${slides.length}</div><h2 id="q53-slide-title" style="margin:5px 0">${esc(slides[0].title)}</h2><p id="q53-slide-desc">${esc(slides[0].desc)}</p><div class="q53-actions"><button class="q53-btn" id="q53-prev">Anterior</button><button class="q53-btn primary" id="q53-next">Siguiente</button><button class="q53-btn" id="q53-ext-link">Extension Center</button></div></div><div class="q53-dotbar">${slides.map((_,i)=>`<span class="q53-dot ${i===0?'on':''}" data-dot="${i}"></span>`).join('')}</div></div></div>`;
    const paint=()=>{const s=slides[idx];const hero=r.querySelector('#q53-hero');hero.style.opacity='.01';hero.style.transform='translateY(7px) scale(.995)';hero.onload=()=>{hero.animate?.([{opacity:.01,transform:'translateY(7px) scale(.995)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});};hero.src=s.img;r.querySelector('#q53-slide-kicker').textContent=`${String(idx+1).padStart(2,'0')} / ${slides.length}`;r.querySelector('#q53-slide-title').textContent=s.title;r.querySelector('#q53-slide-desc').textContent=s.desc;r.querySelectorAll('[data-dot]').forEach(x=>x.classList.toggle('on',+x.dataset.dot===idx));r.querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('on',+x.dataset.step===idx));};
    r.querySelector('#q53-prev').onclick=()=>{idx=(idx-1+slides.length)%slides.length;paint()};r.querySelector('#q53-next').onclick=()=>{idx=(idx+1)%slides.length;paint()};r.querySelector('#q53-ext-link').onclick=()=>shellLink('extensioncenter53','Extensiones');r.querySelectorAll('[data-dot]').forEach(d=>d.onclick=()=>{idx=+d.dataset.dot;paint()});
    setTimeout(()=>r.querySelector('[data-step="0"] span')?.animate?.([{transform:'translateX(-101%)'},{transform:'none'}],{duration:2600,easing:'ease'}),200);
  };

  // ---------- Onboarding / About ----------
  const guide = r => { r.innerHTML=`<div class="q53-shell-page"><div class="q53-shell-inner q53-onboard"><div><div class="q53-kicker">PRIMEROS PASOS</div><div class="q53-title">Bienvenido a Nova</div><p class="q53-sub">Esta guía puede abrirse de nuevo cuando quieras. No necesitas reinstalar nada.</p><div class="q53-card"><h3>1. Empieza</h3><p>Escribe una dirección o una búsqueda en la barra superior.</p><h3 style="margin-top:13px">2. Organiza</h3><p>Usa Workspaces, favoritos y sitios fijados para mantener tus sesiones separadas.</p><h3 style="margin-top:13px">3. Descubre</h3><p>Abre el Extension Center para gestionar extensiones reales con control sobre lo que cargas.</p><div class="q53-actions"><button class="q53-btn primary" id="q53-guide-store">Extension Center</button><button class="q53-btn" id="q53-guide-news">Ver novedades</button></div></div></div><img src="../assets/reborn/whatsnew-onboarding.png" alt="Guía de inicio de Nova"></div></div>`;r.querySelector('#q53-guide-store').onclick=()=>shellLink('extensioncenter53','Extensiones');r.querySelector('#q53-guide-news').onclick=()=>shellLink('whatsnew53','Novedades'); };

  // ---------- Routing ----------
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//i,'').split(/[/?#]/)[0].toLowerCase();const map={extensioncenter:'extensioncenter53','extensions-store':'extensioncenter53','extensiones-store':'extensioncenter53','whatsnew':'whatsnew53','novedades53':'whatsnew53','guide':'guide53','bienvenida53':'guide53'};return map[raw]||(oldResolve?oldResolve(x):String(x||''));};
  if(N.PG){N.PG.extensioncenter53=extensionPage;N.PG.whatsnew53=whatsNew;N.PG.guide53=guide;}
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct=(label,fn)=>{if(!N.extraActs.some(x=>Array.isArray(x)&&x[0]===label))N.extraActs.push([label,fn]);};
  addAct('Nova 5.3 · Novedades',()=>shellLink('whatsnew53','Novedades'));
  addAct('Nova · Extension Center',()=>shellLink('extensioncenter53','Extensiones'));
  addAct('Nova · Repetir tutorial',()=>shellLink('guide53','Tutorial'));

  // ---------- Update notice ----------
  const showWelcomeOnVersion = () => {
    try{const key='nova53_seen_'+String(typeof NOVA_VER!=='undefined'?NOVA_VER:'5.3.0');if(localStorage.getItem(key))return;localStorage.setItem(key,'1');setTimeout(()=>shellLink('whatsnew53','Novedades'),1200);}catch{}
  };
  showWelcomeOnVersion();
})();

