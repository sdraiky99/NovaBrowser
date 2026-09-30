/* Nova 1.5.2 - logotipos, animación de inicio, sonidos, colores de la barra, tienda de extensiones, bienvenida */
(() => {
const { PG, MENU, sw2 } = NOVA, EXT = require('./extensions.js');
const PR = ipc.sendSync('prefs-get') || {};           // preferencias que también lee el proceso principal
const setPR = p => { Object.assign(PR, p); ipc.send('prefs-set', p); };
if (PR.logo && !S.logo) S.logo = PR.logo;
S.logo = S.logo || 'classic';

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
const LG = { classic: 'Clásico', orbita: 'Órbita', estrella: 'Estrella', cometa: 'Cometa', minimal: 'Minimal' };
const logoSrc = id => id === 'classic' ? '../assets/icon.png' : '../assets/logos/' + id + '.png';
const syncLogo = () => { const s = logoSrc(S.logo); document.querySelectorAll('img[src$="assets/icon.png"],img[src*="assets/logos/"]').forEach(i => { if (!i.dataset.keep && i.getAttribute('src') !== s) i.setAttribute('src', s); }); };
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
PG.personalizar = r => {
  const ren = () => PG.personalizar(r), q = s => r.querySelector(s), top = S.topc || 'ninguno';
  r.innerHTML = `<h2>Personalizar</h2>
  <h3>Logotipo</h3><span class="mut">Se usa en la barra, la nueva pestaña, la animación de inicio y el icono de la ventana. El icono del archivo .exe no cambia.</span>
  <div class="lgs">${Object.entries(LG).map(([k, n]) => `<div class="lg ${S.logo === k ? 'on' : ''}" data-lg="${k}"><img data-keep="1" src="${logoSrc(k)}"><span>${n}</span></div>`).join('')}</div>
  <h3>Animación de inicio</h3><span class="mut">Cada logotipo tiene su propia animación al abrir Nova.</span>
  <div class="row"><span>Mostrar animación al abrir</span>${tgl('spl', PR.splash !== false)}</div>
  <div class="row"><span>Ver la animación de este logotipo</span><button class="btn" id="pv">Reproducir</button></div>
  <h3>Sonidos</h3><span class="mut">Se generan en el momento, sin descargar nada.</span>
  <div class="chips">${Object.entries(PK).map(([k, n]) => chip(S.snd.pack === k, `data-pk="${k}"`, n)).join('')}</div>
  <div class="row"><span>Volumen</span><input type="range" id="vol" min="5" max="100" value="${S.snd.v}"></div>
  <div class="row"><span>Sonido al iniciar</span>${tgl('sst', S.snd.start !== false)}</div>
  <h3>Color de la barra superior</h3><span class="mut">Un tono suave sobre el tema que uses.</span>
  <div class="pal">${Object.entries(PAL).map(([k, [n, a, b]]) => `<div class="pw ${top === k ? 'on' : ''}" data-tc="${k}" title="${n}" style="${a ? `background:linear-gradient(90deg,${a},${b})` : 'background:var(--bar)'}">${a ? '' : '—'}</div>`).join('')}
    <input type="color" id="tcc" value="${S.topcc || '#c4b5fd'}" title="Color propio"></div>
  <div class="row"><span>Intensidad</span><input type="range" id="ti" min="10" max="60" value="${S.topi || 34}"></div>`;
  r.querySelectorAll('[data-lg]').forEach(e => e.onclick = () => { setLogo(e.dataset.lg); ren(); });
  q('#spl').onclick = () => { setPR({ splash: PR.splash === false }); ren(); };
  q('#pv').onclick = () => preview(S.logo);
  r.querySelectorAll('[data-pk]').forEach(e => e.onclick = () => { S.snd.pack = e.dataset.pk; save(); snd('new', true); ren(); });
  q('#vol').onchange = e => { S.snd.v = +e.target.value; save(); snd('dl', true); };
  q('#sst').onclick = () => { S.snd.start = S.snd.start === false; save(); ren(); };
  r.querySelectorAll('[data-tc]').forEach(e => e.onclick = () => { S.topc = e.dataset.tc; save(); applyTop(); ren(); });
  q('#tcc').oninput = e => { S.topc = 'custom'; S.topcc = e.target.value; save(); applyTop(); };
  q('#tcc').onchange = ren;
  q('#ti').oninput = e => { S.topi = +e.target.value; save(); applyTop(); };
};

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

PG.bienvenida = async r => {
  const st0 = await ipc.invoke('default-browser', false);
  r.innerHTML = `<div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:10px"><img src="${logoSrc(S.logo)}" width="96"><h2 style="font-size:32px">Bienvenido a Nova</h2><span class="mut">Un navegador rápido, moderno y privado.</span></div>
  <div class="bcard"><h3>Navegador predeterminado</h3>${st0.portable
    ? '<span class="mut">Estás usando la versión portable, que no se puede registrar como navegador. Instala Nova con Nova-Setup para elegirla.</span>'
    : st0.isDefault ? '<span>✓ Nova ya es tu navegador predeterminado.</span>'
    : '<span class="mut">Abre los enlaces de otras aplicaciones directamente en Nova. Windows te pedirá confirmarlo: elige Nova en la lista.</span><button class="btn on" id="db" style="align-self:flex-start">Hacer Nova mi navegador predeterminado</button>'}</div>
  <div class="bcard"><h3>Hazlo tuyo</h3><span class="mut">Cambia el logotipo, los sonidos y el color de la barra.</span><button class="btn" id="gp" style="align-self:flex-start">Personalizar</button></div>
  <div class="bcard"><h3>Extensiones</h3><span class="mut">Añade funciones con la tienda de extensiones de Nova.</span><button class="btn" id="gt" style="align-self:flex-start">Abrir la tienda</button></div>`;
  const b = r.querySelector('#db'); if (b) b.onclick = async () => { await ipc.invoke('default-browser', true); toast('Elige Nova en los ajustes de Windows'); };
  r.querySelector('#gp').onclick = () => newTab('nova://personalizar'); r.querySelector('#gt').onclick = () => newTab('nova://tienda');
};
NOVA.welcome = () => { S.welcomed = 1; save(); newTab('nova://bienvenida'); };

/* ---------- menú ---------- */
MENU.splice(5, 0, ['Personalizar', () => newTab('nova://personalizar')], ['Tienda de extensiones', () => newTab('nova://tienda')]);
const mp = document.getElementById('mnp'); if (mp) mp.innerHTML = MENU.map((m, i) => `<button data-i="${i}">${m[0]}</button>`).join('');

applyTheme(); syncLogo();
if (S.done && !S.welcomed) setTimeout(NOVA.welcome, 2600);
})();
