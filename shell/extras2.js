/* Nova 1.2.0 - ajustes como página, juegos, barra lateral movible, paleta Ctrl+K, novedades */
(() => {
const { PG, MENU, sw2, themeGrid, toURL, fmt } = NOVA, VER = NOVA_VER;
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
  const acts = [...MENU.map(m => [m[0].replace(/ \(.*\)/, ''), m[1]]), ['Novedades', () => newTab('nova://novedades')], ['Reabrir pestaña cerrada', reopen], ['Captura de pantalla', () => $('#sh').click()], ...(NOVA.extraActs || []), ['Barra lateral: izquierda', () => setSp('left')], ['Barra lateral: derecha', () => setSp('right')], ['Barra lateral: dock central', () => setSp('dock')]];
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
const SECT = [['apariencia', 'Apariencia', 'palette'], ['barra', 'Barra lateral', 'settings'], ['navegador', 'Navegador', 'globe'], ['fondos', 'Fondos', 'folder'], ['historial', 'Historial', 'history'], ['ia', 'Nova IA', 'brain'], ['datos', 'Privacidad y datos', 'shield']];
let curSec = 'apariencia';
const ap = () => { save(); applyTheme(); };
const seg = (k, opts) => `<div class="seg">${opts.map(([v, n]) => `<button class="btn ${(S[k] || opts[0][0]) === v ? 'on' : ''}" data-seg="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
const row = (t, c) => `<div class="row"><span>${t}</span>${c}</div>`;
function bind(root, again) {
  root.querySelectorAll('[data-set]').forEach(e => e.oninput = () => { const k = e.dataset.set; S[k] = e.type === 'range' ? +e.value : e.value; if (k === 'acc' || k === 'name') refreshNT(); ap(); });
  root.querySelectorAll('.sw').forEach(s => s.onclick = () => { S[s.dataset.k] = !S[s.dataset.k]; ap(); again(); });
  root.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { S[b.dataset.seg] = b.dataset.v; ap(); again(); });
  const tm = root.querySelector('[data-tm]'); if (tm) tm.onchange = e => { S.theme = e.target.value; ap(); refreshNT(); again(); };
  root.querySelectorAll('[data-hide]').forEach(b => b.onclick = () => { S.hide[b.dataset.hide] = !S.hide[b.dataset.hide]; ap(); again(); });
}
const SEC = {
  apariencia: (c, again) => {
    c.innerHTML = `<h2>Apariencia</h2><div class="grid">${themeGrid()}</div>` +
      row('Color de acento', `<input type="color" data-set="acc" value="${S.acc || '#8b5cf6'}">`) + row('Bordes redondeados', `<input type="range" data-set="r" min="0" max="22" value="${S.r ?? 10}">`) + row('Tamaño de letra', `<input type="range" data-set="fs" min="11" max="18" value="${S.fs || 13}">`) +
      row('Tipografía', `<select class="fld" data-set="font" style="width:auto"><option value="">Predeterminada</option><option>Segoe UI</option><option>Consolas</option><option>Georgia</option><option>Trebuchet MS</option><option>Courier New</option></select>`) +
      row('Animaciones', sw2('anim', S.anim)) + row('Sonidos de interfaz', sw2('sound', S.sound)) + '<button class="btn" id="ra" style="align-self:flex-start">Restablecer apariencia</button>';
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
    c.querySelector('#d3').onclick = () => { const data = JSON.stringify(S, null, 2); ipc.invoke('save-text',{name:'nova-ajustes',ext:'json',content:data}).then(f=>f?toast('Guardado en '+f):toast('No se pudo guardar')).catch(e=>toast('Error: '+e.message)); };
    c.querySelector('#d4').onchange = e => { const fr = new FileReader(); fr.onload = () => { try { Object.assign(S, JSON.parse(fr.result)); ap(); refreshNT(); toast('Ajustes importados'); again(); } catch { toast('Archivo no válido'); } }; fr.readAsText(e.target.files[0]); };
    c.querySelector('#d5').onclick = () => { if (confirm('¿Restablecer todo Nova?')) { localStorage.removeItem('nova'); location.reload(); } };
  }
};
Object.assign(NOVA, { SECT, SEC, bind, row, seg, reopen });
PG.ajustes = r => {
  r.innerHTML = `<div style="display:flex;gap:28px;flex-wrap:wrap"><nav style="display:flex;flex-direction:column;gap:6px;min-width:180px">${SECT.map(([k, n, icon]) => `<button class="btn ${k === curSec ? 'on' : ''}" data-k="${k}" style="text-align:left;display:flex;align-items:center;gap:8px">${NOVA_ICONS.svg(icon,16)}<span>${n}</span></button>`).join('')}</nav><div id="sc" style="flex:1;min-width:280px;max-width:640px;display:flex;flex-direction:column;gap:12px"></div></div>`;
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
