/* Nova 1.1.0 - extras: páginas internas, fondos reales, ajustes, onboarding */
(() => {
const { shell } = require('electron');
Object.assign(THEMES, { neon: 'Neón' });
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
.t-aero .card{background:linear-gradient(#ffffffd0,#bcdcf5d0);backdrop-filter:blur(14px)}
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
const zoom = d => { try { cur.wv.setZoomLevel(cur.wv.getZoomLevel() + d); } catch { } };
let lastB = 0;
ipc.on('blocked', (_, n) => { S.blocked += n - lastB; lastB = n; save(); bl.querySelector('b').textContent = S.blocked.toLocaleString('es'); });
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
function internalTab(u) {
  let name = u.replace('nova://', '').split(/[/?]/)[0]; if (!PG[name]) name = 'acerca';
  const old = tabs.find(t => t.wv.dataset && t.wv.dataset.p === name); if (old) { sel(old); PG[name](old.wv); return old; }
  const el = document.createElement('div'); el.className = 'ipage'; el.dataset.p = name;
  Object.assign(el, { getURL: () => 'nova://' + name, canGoBack: () => false, canGoForward: () => false, goBack() { }, goForward() { }, reload: () => PG[name](el), loadURL() { }, stopFindInPage() { }, findInPage() { } });
  $('#view').appendChild(el);
  const te = document.createElement('div'); te.className = 'tab';
  const T = { historial: 'Historial', descargas: 'Descargas', notas: 'Notas', juegos: 'Nova Snake', ajustes: 'Ajustes', acerca: 'Acerca de Nova', novedades: 'Novedades', marcadores: 'Marcadores', privacidad: 'Privacidad', personalizar: 'Personalizar', tienda: 'Tienda de extensiones', bienvenida: 'Bienvenida' }[name] || name;
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

/* ---------- asistente de bienvenida ---------- */
function onboard() {
  const ov = document.createElement('div'); ov.className = 'ov'; document.body.appendChild(ov); let n = 0;
  const steps = [
    () => `<img src="../assets/icon.png" width="80" style="align-self:center"><h2 style="margin:0;text-align:center;font-weight:300">Bienvenido a Nova</h2><span class="mut" style="text-align:center">Vamos a dejarlo a tu gusto en 3 pasos.</span><input class="fld" id="ob" placeholder="¿Cómo te llamas?" value="${esc(S.name || '')}">`,
    () => `<h3>Elige tu tema</h3><div class="grid">${themeGrid()}</div><span class="mut">Cambia toda la interfaz. Puedes cambiarlo cuando quieras.</span>`,
    () => `<h3>Últimos detalles</h3><span class="mut">Buscador</span><select class="fld" id="se2"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option></select><div class="row"><span>Bloquear anuncios</span>${sw2('adblock', S.adblock)}</div><div class="row"><span>Animaciones</span>${sw2('anim', S.anim)}</div><span class="mut">Fondo favorito</span><div class="chips">${Object.entries(SECS).map(([k, v]) => `<button class="btn ${S.sec === k ? 'on' : ''}" data-s="${k}">${v}</button>`).join('')}</div>`
  ];
  const r = () => {
    ov.innerHTML = `<div class="card">${steps[n]()}<div class="row"><button class="btn" id="sk">Saltar</button><button class="btn on" id="nx">${n < 2 ? 'Siguiente' : '¡Empezar!'}</button></div></div>`;
    const q = s => ov.querySelector(s);
    if (q('#se2')) { q('#se2').value = S.search; q('#se2').onchange = e => { S.search = e.target.value; save(); }; }
    ov.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.theme = b.dataset.t; save(); applyTheme(); r(); });
    ov.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { S.sec = b.dataset.s; save(); r(); });
    ov.querySelectorAll('.sw').forEach(s => s.onclick = () => { S[s.dataset.k] = !S[s.dataset.k]; save(); applyTheme(); r(); });
    const end = () => { S.done = 1; save(); ov.remove(); refreshNT(); if (window.NOVA && NOVA.welcome) setTimeout(NOVA.welcome, 300); };
    q('#sk').onclick = end; q('#nx').onclick = () => { if (q('#ob')) { S.name = q('#ob').value.trim(); save(); } n < 2 ? (n++, r()) : end(); };
  };
  r();
}
window.NOVA = { PG, MENU, internalTab, sw2, themeGrid, toURL, fmt, refreshPages };
applyTheme();
if (!S.done) setTimeout(onboard, 700);
})();
