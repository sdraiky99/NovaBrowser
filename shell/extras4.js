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
const TH = { 'windows 95': 'win95', win95: 'win95', 95: 'win95', codigo: 'code', code: 'code', undertale: 'undertale', aero: 'aero', neon: 'neon', nova: 'nova', claro: 'light', oscuro: 'nova', safari: 'safari', cyberpunk: 'cyberpunk', cyber: 'cyberpunk' };
const HELP = 'Puedo ejecutar órdenes:\n• "cambia el tema a neón / claro / oscuro"\n• "barra a la derecha / izquierda / dock"\n• "abre historial / descargas / marcadores / privacidad / juegos / ajustes / notas"\n• "busca gatos graciosos" · "abre youtube.com"\n• "2+2*5" · "qué hora es"\n• "activa modo oscuro" / "desactiva modo oscuro"\n• "captura" · "borra historial"\nPara todo lo demás, charla conmigo.';
function intent(raw) {
  const q = nrm(raw.trim()); let m;
  if (/^(ayuda|comandos|que puedes hacer)/.test(q)) return HELP;
  if ((m = q.match(/tema.*?(windows 95|win95|95|codigo|code|undertale|aero|neon|safari|cyberpunk|cyber|nova|claro|oscuro)\b/))) { const k = TH[m[1]]; S.theme = k; save(); applyTheme(); refreshNT(); return 'Tema cambiado a ' + THEMES[k] + '.'; }
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
