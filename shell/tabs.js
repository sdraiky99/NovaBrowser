/* Nova 1.5 - pestañas (grupos, arrastrar y soltar, menú), atajos, temas, selección, actualizaciones */
(() => {
const N = NOVA, COL = ['#8b5cf6', '#22d3ee', '#f43f5e', '#22c55e', '#f59e0b', '#3b82f6'];
N.NONCE = require('crypto').randomBytes(12).toString('hex');
const PFX = '__N__' + N.NONCE + ':';
S.groups = S.groups || {};
const isW = t => t && t.wv && t.wv.tagName === 'WEBVIEW';
const tabsEl = $('#tabs');
const tabAdd = $('#nt');
const keepTabAddAtEnd = () => { if (tabAdd && tabsEl.lastElementChild !== tabAdd) tabsEl.appendChild(tabAdd); };

/* ---------- estilos ---------- */
const st = document.createElement('style');
st.textContent = `
.tg{-webkit-app-region:no-drag;display:flex;align-items:center;gap:5px;height:24px;padding:0 10px;margin:0 3px 3px;border-radius:calc(var(--r) * 2);background:color-mix(in srgb,var(--gc) 28%,transparent);border:1px solid var(--gc);cursor:pointer;font-size:12px;white-space:nowrap;animation:tin .2s}
.tg i{width:8px;height:8px;border-radius:50%;background:var(--gc)}.tg:hover{background:color-mix(in srgb,var(--gc) 45%,transparent)}
.tab.ing{border-top:2px solid var(--gc)}.tab.gh{display:none}.tab.dragging{opacity:.35}
.tab.pin+.tab:not(.pin){margin-left:8px}.tab.aud span::before{content:'♪ ';color:var(--acc2)}.tab.muted span::before{content:'🔇 '}
#selchip{position:fixed;z-index:25;display:none;padding:6px 12px;background:var(--acc);color:#fff;border:0;border-radius:calc(var(--r) * 2);cursor:pointer;box-shadow:0 6px 24px #0009;animation:pop .15s}#selchip.on{display:block}
#upd{display:none;align-items:center;gap:10px;padding:6px 14px;background:color-mix(in srgb,var(--acc) 22%,var(--bar));border-bottom:1px solid var(--acc)}#upd.on{display:flex}#upd span{flex:1}
.ctx hr{border:0;border-top:1px solid var(--bd);margin:4px 0;width:100%}.ctx .lb{padding:4px 12px;color:var(--mut);font-size:11px;text-transform:uppercase}.ctx button:disabled{opacity:.4;cursor:default}
`;
document.head.appendChild(st);

/* ---------- utilidades compartidas: diálogo y menú contextual ---------- */
N.dlg = (title, fields, ok = 'Guardar', extra) => new Promise(res => {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${fields.map((f, i) => f.type === 'note' ? `<span class="mut">${esc(f.label)}</span>` : f.type === 'select'
    ? `<label class="mut">${esc(f.label)}</label><select class="fld" data-i="${i}">${f.opts.map(([v, n]) => `<option value="${esc(v)}">${esc(n)}</option>`).join('')}</select>`
    : `<label class="mut">${esc(f.label)}</label><input class="fld" data-i="${i}" value="${esc(f.value || '')}">`).join('')}
    <div class="row"><span>${extra ? '<button class="btn" id="dx">' + esc(extra) + '</button>' : ''}</span><span><button class="btn" id="dc">Cancelar</button> <button class="btn on" id="dk">${esc(ok)}</button></span></div></div>`;
  document.body.appendChild(ov);
  const els = [...ov.querySelectorAll('[data-i]')]; els.forEach(e => { const f = fields[+e.dataset.i]; if (f.type === 'select') e.value = f.value ?? f.opts[0][0]; });
  const done = v => { ov.remove(); res(v); };
  ov.querySelector('#dc').onclick = () => done(null); ov.querySelector('#dk').onclick = () => done(els.map(e => e.value));
  if (extra) ov.querySelector('#dx').onclick = () => done('__extra__');
  ov.onkeydown = e => { if (e.key === 'Escape') done(null); if (e.key === 'Enter' && e.target.tagName !== 'SELECT') ov.querySelector('#dk').click(); };
  ov.onmousedown = e => { if (e.target === ov) done(null); }; if (els[0]) { els[0].focus(); els[0].select && els[0].select(); }
});
const menu = $('#tcm');
N.ctx = (x, y, items) => {
  menu.innerHTML = items.map((m, i) => m === '-' ? '<hr>' : m.label ? `<div class="lb">${esc(m.label)}</div>` : `<button data-i="${i}" ${m[2] ? 'disabled' : ''}>${esc(m[0])}</button>`).join('');
  menu.style.cssText = `left:${Math.min(x, innerWidth - 230)}px;top:${Math.min(y, innerHeight - 40 - items.length * 30)}px`; menu.classList.add('on');
  menu.onclick = e => { const b = e.target.closest('button'); if (b && !b.disabled) { menu.classList.remove('on'); items[b.dataset.i][1](); } };
};

/* ---------- orden, fijadas y grupos ---------- */
const syncOrder = () => tabs.sort((a, b) => a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
const enforcePins = () => { tabs.filter(t => t.el.classList.contains('pin')).reverse().forEach(t => tabsEl.prepend(t.el)); syncOrder(); };
function renderGroups() {
  document.querySelectorAll('.tg').forEach(e => e.remove()); const seen = {};
  tabs.forEach(t => {
    t.el.classList.remove('ing', 'gh'); t.el.style.removeProperty('--gc'); const g = S.groups[t.g]; if (!t.g || !g) { t.g = null; return; }
    t.el.classList.add('ing'); t.el.style.setProperty('--gc', g.color);
    if (!seen[t.g]) {
      seen[t.g] = 1; const c = document.createElement('div'); c.className = 'tg'; c.dataset.g = t.g; c.style.setProperty('--gc', g.color); c.innerHTML = `<i></i><span>${esc(g.name)}</span>`; t.el.before(c);
      c.onclick = () => { g.collapsed = !g.collapsed; save(); renderGroups(); };
      c.oncontextmenu = e => { e.preventDefault(); grpMenu(e, t.g); };
      c.ondragover = e => { if (drag) e.preventDefault(); }; c.ondrop = e => { e.preventDefault(); if (drag) setGroup(drag, t.g); };
    }
    if (g.collapsed && cur !== t) t.el.classList.add('gh');
  }); keepTabAddAtEnd(); save();
}
N.enforcePins = enforcePins; N.renderGroups = renderGroups; N.syncTabOrder = syncOrder;
function setGroup(t, gid) {
  if (gid) { t.el.classList.remove('pin'); t.g = gid; const mem = tabs.filter(x => x !== t && x.g === gid); if (mem.length) mem[mem.length - 1].el.after(t.el); } else t.g = null;
  syncOrder(); renderGroups();
}
async function newGroup(t) {
  const r = await N.dlg('Nuevo grupo', [{ label: 'Nombre', value: 'Grupo' }, { label: 'Color', type: 'select', opts: COL.map((c, i) => [c, ['Violeta', 'Cian', 'Rosa', 'Verde', 'Naranja', 'Azul'][i]]) }], 'Crear'); if (!r) return;
  const id = 'g' + Date.now().toString(36); S.groups[id] = { name: r[0] || 'Grupo', color: r[1], collapsed: false }; setGroup(t, id);
}
async function grpMenu(e, gid) {
  const g = S.groups[gid];
  N.ctx(e.clientX, e.clientY, [['Renombrar / cambiar color', async () => { const r = await N.dlg('Editar grupo', [{ label: 'Nombre', value: g.name }, { label: 'Color', type: 'select', value: g.color, opts: COL.map((c, i) => [c, ['Violeta', 'Cian', 'Rosa', 'Verde', 'Naranja', 'Azul'][i]]) }]); if (r) { g.name = r[0] || g.name; g.color = r[1]; renderGroups(); } }],
    [g.collapsed ? 'Expandir' : 'Contraer', () => { g.collapsed = !g.collapsed; renderGroups(); }], ['Desagrupar', () => { tabs.filter(t => t.g === gid).forEach(t => t.g = null); delete S.groups[gid]; renderGroups(); }],
    ['Cerrar grupo', () => { tabs.filter(t => t.g === gid).forEach(closeTab); delete S.groups[gid]; save(); }]]);
}
const togglePin = t => { const on = !t.el.classList.contains('pin'); t.el.classList.toggle('pin', on); if (on) { t.g = null; enforcePins(); renderGroups(); } };

/* ---------- menú contextual de pestañas ---------- */
tabsEl.addEventListener('contextmenu', e => {
  const el = e.target.closest('.tab'); if (!el) return; e.preventDefault();
  const t = tabs.find(x => x.el === el); if (!t) return; const pin = el.classList.contains('pin'), i = tabs.indexOf(t);
  const muted = isW(t) && t.wv.isAudioMuted && t.wv.isAudioMuted(), groups = Object.entries(S.groups);
  N.ctx(e.clientX, e.clientY, [
    ['Nueva pestaña', () => newTab()], ['Nueva pestaña a la derecha', () => { const n = newTab(); t.el.after(n.el); syncOrder(); }], ['Duplicar', () => { try { newTab(t.wv.getURL()); } catch { } }], ['Recargar', () => t.wv.reload()], '-',
    [pin ? 'Desfijar pestaña' : 'Fijar pestaña', () => togglePin(t)], [muted ? 'Activar sonido' : 'Silenciar pestaña', () => { if (isW(t)) { t.wv.setAudioMuted(!muted); el.classList.toggle('muted', !muted); } }, !isW(t)], '-',
    { label: 'Mover a grupo' }, ...groups.map(([id, g]) => ['   ' + g.name, () => setGroup(t, id)]), ['   Nuevo grupo…', () => newGroup(t)], ['   Quitar del grupo', () => setGroup(t, null), !t.g], '-',
    ['Cerrar pestaña', () => { el.classList.remove('pin'); closeTab(t); }], ['Cerrar las demás', () => tabs.filter(x => x !== t && !x.el.classList.contains('pin')).forEach(closeTab)],
    ['Cerrar a la derecha', () => tabs.slice(i + 1).filter(x => !x.el.classList.contains('pin')).forEach(closeTab), i === tabs.length - 1], ['Reabrir pestaña cerrada', () => N.reopen()]]);
});

/* ---------- arrastrar y soltar ---------- */
let drag = null;
function dnd(t) {
  t.el.draggable = true;
  t.el.addEventListener('dragstart', e => { drag = t; t.el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'nova-tab'); });
  t.el.addEventListener('dragend', () => { t.el.classList.remove('dragging'); drag = null; syncOrder(); if (!t.el.classList.contains('pin')) tabs.filter(x => x.el.classList.contains('pin')).length && enforcePins(); renderGroups(); });
}
tabsEl.addEventListener('dragover', e => {
  if (!drag) return; e.preventDefault();
  const after = [...tabsEl.querySelectorAll('.tab:not(.dragging)')].find(x => x.offsetParent && e.clientX < x.getBoundingClientRect().left + x.offsetWidth / 2);
  after ? tabsEl.insertBefore(drag.el, after) : tabsEl.insertBefore(drag.el, tabAdd); keepTabAddAtEnd();
});

/* ---------- envolver newTab / sel: arrastrar, selección, audio, favicon ---------- */
const bn = newTab;
newTab = function (u) {
  const t = bn(u); if (!t || t._x) return t; t._x = 1; dnd(t);
  if (isW(t)) {
    t.wv.addEventListener('dom-ready', () => t.wv.executeJavaScript(`(()=>{const P=${JSON.stringify(PFX)};window.__novaLinkMode=${!!S.newTabLinks};
if(!window.__novaLinks){window.__novaLinks=1;const openLink=a=>{if(!a||!a.href||!/^https?:$/i.test((()=>{try{return new URL(a.href).protocol}catch{return ''}})()))return false;console.log(P+JSON.stringify({k:'link',u:a.href}));return true};
document.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a&&/^#nova\/[\w-]+$/i.test(a.getAttribute('href')||'')){const route=(a.getAttribute('href')||'').slice(6);console.log(P+JSON.stringify({k:'route',route}));e.preventDefault();e.stopPropagation();return;}if(!a)return;if(!(window.__novaLinkMode||e.ctrlKey||e.metaKey))return;if(openLink(a)){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener('auxclick',e=>{if(e.button!==1)return;const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;if(openLink(a)){e.preventDefault();e.stopPropagation()}},true)}
if(window.__ns)return;window.__ns=1;let z;
document.addEventListener('mouseup',e=>{clearTimeout(z);z=setTimeout(()=>{const s=String(getSelection()).trim();console.log(P+JSON.stringify(s.length>2?{k:'sel',t:s.slice(0,6000),x:e.clientX,y:e.clientY}:{k:'clr'}))},30)},true);
document.addEventListener('mousedown',()=>console.log(P+JSON.stringify({k:'clr'})),true)})()`).catch(() => { }));
    t.wv.addEventListener('console-message', e => {
      if (!e.message.startsWith(PFX)) return; let m; try { m = JSON.parse(e.message.slice(PFX.length)); } catch { return; }
      if (m.k === 'route' && typeof m.route === 'string') return (N.openFeature ? N.openFeature(m.route) : newTab('nova://' + m.route));
      if (m.k === 'link' && typeof m.u === 'string') return newTab(m.u);
      if (m.k === 'clr') return hideChip();
      if (m.k === 'sel' && typeof m.t === 'string' && cur === t) return showChip(t, m);
      if (m.k === 'cmd' && isNT(t.wv.getURL())) runCmd(m);
    });
    t.wv.addEventListener('media-started-playing', () => t.el.classList.add('aud')); t.wv.addEventListener('media-paused', () => t.el.classList.remove('aud'));
    t.wv.addEventListener('page-favicon-updated', e => { const h = S.hist.find(x => x.u === t.wv.getURL()); if (h && e.favicons[0]) h.i = e.favicons[0]; });
  }
  return t;
};
const bs = sel;
sel = function (t) { bs(t); hideChip(); if (t && t.g && S.groups[t.g] && S.groups[t.g].collapsed) { S.groups[t.g].collapsed = false; renderGroups(); } };

/* ---------- chip "Preguntar a Nova" y órdenes del inicio ---------- */
const chip = document.createElement('button'); chip.id = 'selchip'; chip.textContent = 'Preguntar a Nova'; document.body.appendChild(chip);
let chipT, chipText = '';
function showChip(t, m) { const r = t.wv.getBoundingClientRect(); chipText = m.t; chip.style.left = Math.min(r.left + m.x, innerWidth - 170) + 'px'; chip.style.top = Math.min(r.top + m.y + 16, innerHeight - 50) + 'px'; chip.classList.add('on'); clearTimeout(chipT); chipT = setTimeout(hideChip, 9000); }
function hideChip() { chip.classList.remove('on'); }
chip.onmousedown = e => e.preventDefault(); chip.onclick = () => { hideChip(); N.askSel && N.askSel(chipText); };
const PAGES = ['historial', 'descargas', 'marcadores', 'notas', 'juegos', 'ajustes', 'privacidad', 'ia'];
function runCmd(m) {
  if (m.a === 'ai') { panel = 'ai'; draw(); }
  else if (m.a === 'ask' && typeof m.q === 'string') { panel = 'ai'; draw(); N.aiSend && N.aiSend(m.q.slice(0, 2000)); }
  else if (m.a === 'customize') { N.goSec && N.goSec('inicio'); newTab('nova://ajustes'); }
  else if (PAGES.includes(m.a)) newTab('nova://' + m.a);
}

/* ---------- temas: oscuro / claro / sistema + transparencia ---------- */
Object.assign(THEMES, { light: 'Claro', system: 'Sistema' });
N.theme = () => S.theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'nova') : S.theme;
const bAT = applyTheme; let lastOp = 1;
applyTheme = function () {
  bAT(); if (S.theme === 'system') { document.body.classList.remove('t-system'); document.body.classList.add('t-' + N.theme()); }
  const op = S.op || 1; if (op !== lastOp) { lastOp = op; ipc.invoke('opacity', op); }
};
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (S.theme === 'system') { applyTheme(); refreshNT(); } });

/* ---------- atajos ---------- */
N.SHORTCUTS = [['Ctrl + T', 'Nueva pestaña'], ['Ctrl + W', 'Cerrar pestaña'], ['Ctrl + Shift + T', 'Reabrir pestaña cerrada'], ['Ctrl + Tab / Ctrl + Shift + Tab', 'Pestaña siguiente / anterior'], ['Ctrl + L', 'Barra de direcciones'], ['Ctrl + K', 'Nova Command Center'], ['Ctrl + Espacio', 'Abrir o cerrar Nova IA'], ['Ctrl + H', 'Historial'], ['Ctrl + J', 'Descargas'], ['Ctrl + D', 'Guardar página en marcadores'], ['Ctrl + Shift + D', 'Guardar todas las pestañas'], ['Ctrl + Shift + B', 'Mostrar u ocultar barra de marcadores'], ['Ctrl + R', 'Recargar'], ['Ctrl + Shift + R', 'Recargar sin caché'], ['Ctrl + F', 'Buscar en la página']];
const visible = () => tabs.filter(t => !t.el.classList.contains('gh'));
const cycle = d => { const v = visible(); if (v.length > 1) sel(v[(v.indexOf(cur) + d + v.length) % v.length]); };
const reload = hard => { try { hard && cur.wv.reloadIgnoringCache ? cur.wv.reloadIgnoringCache() : cur.wv.reload(); } catch { } };
N.toggleAI = () => { panel = panel === 'ai' ? null : 'ai'; draw(); };
const combo = c => {
  if (c === 'space') return N.toggleAI(); if (c === 'tab') return cycle(1); if (c === 'shift+tab') return cycle(-1);
  if (c === 'r') return reload(false); if (c === 'shift+r') return reload(true);
  if (c === 'shift+d') return N.saveAll && N.saveAll(); if (c === 'shift+b') return N.bbar ? N.bbar() : (S.bmbar = !S.bmbar, save());
};
ipc.on('combo', (_, c) => combo(c));
document.addEventListener('keydown', e => {
  if (!e.ctrlKey || e.altKey) return; const c = (e.shiftKey ? 'shift+' : '') + (e.key === ' ' ? 'space' : e.key.toLowerCase());
  if (['space', 'tab', 'shift+tab', 'r', 'shift+r', 'shift+d'].includes(c)) { e.preventDefault(); combo(c); }
});

/* ---------- acciones del Command Center ---------- */
const setT = k => { S.theme = k; save(); applyTheme(); refreshNT(); };
N.ACTIONS = () => [
  ['Nueva pestaña', () => newTab()], ['Cerrar pestaña', () => closeTab(cur)], ['Reabrir pestaña cerrada', () => N.reopen()],
  ['Historial', () => newTab('nova://historial')], ['Descargas', () => newTab('nova://descargas')], ['Marcadores', () => newTab('nova://marcadores')], ['Guardar esta página en marcadores', () => $('#st').click()],
  ['Modo oscuro', () => setT('nova')], ['Modo claro', () => setT('light')], ['Tema del sistema', () => setT('system')],
  ['Abrir ajustes', () => newTab('nova://ajustes')], ['Abrir Nova IA', () => { panel = 'ai'; draw(); }], ['Nueva conversación con Nova IA', () => N.aiNew && N.aiNew()], ['Resumir página', () => N.aiAct && N.aiAct('sum')],
  ['Centro de privacidad', () => newTab('nova://privacidad')], ['Limpiar datos de navegación', () => newTab('nova://privacidad')], ['Nueva nota', () => { newTab('nova://notas'); setTimeout(() => N.newNote && N.newNote(), 60); }],
  ['Pantalla completa', () => ipc.send('fullscreen')], ['Recargar', () => reload(false)], ['Recargar sin caché', () => reload(true)],
  ['Mostrar u ocultar barra de marcadores', () => combo('shift+b')], ['Buscar actualizaciones', () => checkUpd(true)]];

/* ---------- actualizaciones (avisa, nunca descarga en silencio) ---------- */
const upd = document.createElement('div'); upd.id = 'upd'; $('#top').after(upd);
async function checkUpd(manual) {
  if (!manual && S.noUpd) return;
  const r = await ipc.invoke('update-check');
  if (!r.ok) return manual && toast('No se pudo comprobar (¿sin conexión?)');
  if (r.newer && (manual || S.updSkip !== r.latest)) {
    upd.innerHTML = `<span>Nueva versión disponible · Nova ${esc(r.latest)}</span><button class="btn on" id="u1">Actualizar</button><button class="btn" id="u2">Más tarde</button>`; upd.classList.add('on');
    $('#u1').onclick = () => { ipc.invoke('open-external', r.url); upd.classList.remove('on'); }; $('#u2').onclick = () => { S.updSkip = r.latest; save(); upd.classList.remove('on'); };
  } else if (manual) toast('Ya tienes la última versión (' + r.current + ')');
}
N.checkUpd = checkUpd; setTimeout(checkUpd, 8000); setInterval(checkUpd, 6 * 3600e3);

/* ---------- sesión (pestañas + grupos + fijadas) y copia de seguridad de ajustes ---------- */
const snap = () => { const list = tabs.map(t => { try { const u = t.wv.getURL(); return !u || isNT(u) || u.includes('offline.html') || u.startsWith('nova:') ? null : { u, g: t.g || '', p: t.el.classList.contains('pin') ? 1 : 0 }; } catch { return null; } }).filter(Boolean); const hasWeb = tabs.some(t => isW(t)); if (list.length || hasWeb) S.session2 = list; save(); };
setInterval(snap, 5000); addEventListener('beforeunload', snap);
setTimeout(() => {
  if (S.restore && S.session2 && S.session2.length && tabs.length === 1) {
    const f = tabs[0]; S.session2.forEach(s => { const t = newTab(s.u); if (s.g && S.groups[s.g]) t.g = s.g; if (s.p) t.el.classList.add('pin'); }); enforcePins(); renderGroups(); closeTab(f);
  }
}, 1100);
let lastBk = ''; setInterval(() => { const s = localStorage.nova || ''; if (s && s !== lastBk) { lastBk = s; ipc.invoke('state-save', s); } }, 4000);
(async () => { if (!localStorage.nova) { const b = await ipc.invoke('state-load'); if (b) { localStorage.nova = b; location.reload(); } } })();
addEventListener('storage', e => { if (e.key === 'nova' && e.newValue) { try { Object.assign(S, JSON.parse(e.newValue)); } catch { } } });
applyTheme();
})();
