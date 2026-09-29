/* Nova 1.3.0 - Nova IA real, clic derecho, modo sin conexión, animaciones, pestañas pro */
(() => {
const { PG } = NOVA, VER = '1.3.0';
S.chat = S.chat || [];
const OFF = (u, e, play) => new URL('offline.html', document.baseURI).href + '?t=' + S.theme + '&a=' + encodeURIComponent(S.acc || '') + (play ? '&play=1' : '&u=' + encodeURIComponent(u) + '&e=' + encodeURIComponent(e || ''));
const nrm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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
  if (panel === 'ai') aiPanel();
};

/* ================= PESTAÑAS PRO ================= */
const bc = closeTab;
closeTab = function (t) {
  if (t._c) return; if (t.el.classList.contains('pin')) return toast('Pestaña fijada: desfíjala para cerrarla');
  t._c = 1; if (!S.anim) return bc(t); t.el.classList.add('closing'); setTimeout(() => bc(t), 150);
};
const tcm = document.createElement('div'); tcm.id = 'tcm'; tcm.className = 'ctx'; document.body.appendChild(tcm);
$('#tabs').addEventListener('contextmenu', e => {
  const el = e.target.closest('.tab'); if (!el) return; e.preventDefault();
  const t = tabs.find(x => x.el === el); if (!t) return;
  const it = [['Recargar', () => t.wv.reload()], ['Duplicar', () => { try { newTab(t.wv.getURL()); } catch { } }], [el.classList.contains('pin') ? 'Desfijar pestaña' : 'Fijar pestaña', () => el.classList.toggle('pin')],
    ['Cerrar las demás', () => tabs.filter(x => x !== t && !x.el.classList.contains('pin')).forEach(closeTab)], ['Cerrar pestaña', () => { el.classList.remove('pin'); closeTab(t); }]];
  tcm.innerHTML = it.map((m, i) => `<button data-i="${i}">${m[0]}</button>`).join(''); tcm.style.cssText = `left:${Math.min(e.clientX, innerWidth - 210)}px;top:${e.clientY}px`; tcm.classList.add('on');
  tcm.onclick = ev => { const b = ev.target.closest('button'); if (b) { tcm.classList.remove('on'); it[b.dataset.i][1](); } };
});
document.addEventListener('click', () => tcm.classList.remove('on'));
setInterval(() => { S.session = tabs.map(t => { try { const u = t.wv.getURL(); return !u || isNT(u) || u.includes('offline.html') || u.startsWith('nova:') ? null : u; } catch { return null; } }).filter(Boolean); save(); }, 5000);
setTimeout(() => {
  if (S.restore && S.session && S.session.length && tabs.length === 1) { const f = tabs[0], l = [...S.session]; l.forEach(u => newTab(u)); bc(f); }
}, 1000);

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

/* ================= NOVA IA ================= */
const md = s => esc(s).replace(/```([\s\S]*?)```/g, '<pre class="cb">$1</pre>').replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const sys = () => 'Eres Nova IA, el asistente integrado del navegador Nova. Responde en el idioma del usuario, breve y claro. ' + (S.persona || '');
const TH = { 'windows 95': 'win95', win95: 'win95', 95: 'win95', codigo: 'code', code: 'code', undertale: 'undertale', aero: 'aero', neon: 'neon', nova: 'nova' };
const HELP = 'Puedo ejecutar órdenes:\n• "cambia el tema a neón"\n• "barra a la derecha / izquierda / dock"\n• "abre historial / descargas / juegos / ajustes / notas"\n• "busca gatos graciosos"\n• "abre youtube.com"\n• "2+2*5"\n• "activa modo oscuro" / "desactiva modo oscuro"\n• "captura" · "qué hora es" · "borra historial"\nPara todo lo demás, charla conmigo como con cualquier IA.';
function intent(raw) {
  const q = nrm(raw.trim()); let m;
  if (/^(ayuda|comandos|que puedes hacer)/.test(q)) return HELP;
  if ((m = q.match(/tema.*?(windows 95|win95|95|codigo|code|undertale|aero|neon|nova)\b/))) { const k = TH[m[1]]; S.theme = k; save(); applyTheme(); refreshNT(); return 'Tema cambiado a ' + THEMES[k] + '.'; }
  if ((m = q.match(/barra.*(izquierda|derecha|dock|centro)/))) { S.sp = { izquierda: 'left', derecha: 'right', dock: 'dock', centro: 'dock' }[m[1]]; save(); applyTheme(); return 'Barra lateral movida.'; }
  if ((m = q.match(/^(?:abre|abrir|ve a|ir a|muestra|muestrame)\s+(?:el |la |los |las )?(historial|descargas|notas|juegos|ajustes|novedades|acerca)/))) { newTab('nova://' + m[1]); return 'Abriendo ' + m[1] + '.'; }
  if ((m = q.match(/^(?:abre|abrir|ve a|ir a)\s+(\S+\.\S+)/))) { newTab(NOVA.toURL(m[1])); return 'Abriendo ' + m[1] + '.'; }
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
async function claude(msgs) {
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': S.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: S.model || 'claude-sonnet-4-6', max_tokens: 1000, system: sys(), messages: msgs }) });
  const d = await r.json(); if (d.error) throw new Error(d.error.message); return d.content.map(c => c.text || '').join('');
}
async function free(msgs) {
  const r = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: 'openai', messages: [{ role: 'system', content: sys() }, ...msgs] }) });
  if (!r.ok) throw new Error('HTTP ' + r.status); const j = await r.json(); return j.choices?.[0]?.message?.content || 'No he recibido respuesta.';
}
let box;
function addMsg(role, text, raw) {
  const d = document.createElement('div'); d.className = 'm ' + (role === 'user' ? 'u' : 'a'); d.dataset.raw = raw ?? text;
  d.innerHTML = role === 'user' ? esc(text).replace(/\n/g, '<br>') : text; box.appendChild(d); box.scrollTop = 1e9; return d;
}
const fin = (el, txt) => { el.dataset.raw = txt; el.innerHTML = md(txt) + '<br><button class="cp">Copiar</button>'; box.scrollTop = 1e9; };
function typeOut(el, txt) {
  if (!S.anim) return fin(el, txt);
  let i = 0; const step = Math.max(2, txt.length / 140 | 0), iv = setInterval(() => { i += step; el.textContent = txt.slice(0, i); box.scrollTop = 1e9; if (i >= txt.length) { clearInterval(iv); fin(el, txt); } }, 16);
}
async function aiSend(text, shown) {
  text = (text || '').trim(); if (!text || !box || !box.isConnected) return;
  addMsg('user', shown || text); S.chat.push({ role: 'user', content: shown || text });
  const loc = intent(text);
  if (loc) { const el = addMsg('assistant', ''); typeOut(el, loc); S.chat.push({ role: 'assistant', content: loc }); S.chat = S.chat.slice(-40); return save(); }
  const el = addMsg('assistant', '<span class="dots"><i></i><i></i><i></i></span>'); let out;
  const prev = S.chat.slice(0, -1).slice(-10); while (prev.length && prev[0].role !== 'user') prev.shift();
  const msgs = [...prev, { role: 'user', content: text }];
  try { out = await (S.key ? claude : free)(msgs); }
  catch (e) { out = 'No pude conectar con la IA (' + e.message + '). ' + (S.key ? 'Revisa tu clave en Ajustes > Nova IA.' : 'El modo gratuito depende de un servicio externo; puedes usar mis órdenes ("ayuda") o añadir una clave API.'); }
  typeOut(el, out); S.chat.push({ role: 'assistant', content: out }); S.chat = S.chat.slice(-40); save();
}
function aiPanel() {
  const p = $('#pin'); if (panel !== 'ai') return;
  p.innerHTML = `<div class="row"><h3>Nova IA</h3><span class="mut">${S.key ? 'Claude' : 'Nova Free'}</span></div>
  <div class="chips"><button class="btn" data-a="sum">Resumir página</button><button class="btn" data-a="exp">Explicar selección</button><button class="btn" data-a="help">Ayuda</button><button class="btn" data-a="clr">Limpiar</button></div>
  <div id="chat"></div><div class="row" style="align-items:flex-end"><textarea id="aiq" class="fld" rows="2" placeholder="Escribe aquí… (Enter envía · Shift+Enter salto de línea)"></textarea><button class="btn on" id="aig">Enviar</button></div>`;
  box = p.querySelector('#chat');
  if (!S.chat.length) addMsg('assistant', md('¡Hola! Soy **Nova IA**. Escríbeme lo que quieras o pídeme órdenes como "cambia el tema a neón" o "abre historial". Escribe "ayuda" para ver todo.'));
  S.chat.forEach(m => { const el = addMsg(m.role, m.role === 'user' ? m.content : '', m.content); if (m.role !== 'user') fin(el, m.content); });
  const q = p.querySelector('#aiq'), send = () => { const v = q.value; q.value = ''; aiSend(v); };
  q.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }; p.querySelector('#aig').onclick = send;
  box.onclick = e => { const b = e.target.closest('.cp'); if (b) { navigator.clipboard.writeText(b.parentElement.dataset.raw); b.textContent = '¡Copiado!'; } };
  p.querySelectorAll('[data-a]').forEach(b => b.onclick = async () => {
    const a = b.dataset.a;
    if (a === 'help') { addMsg('user', 'ayuda'); const el = addMsg('assistant', ''); typeOut(el, HELP); }
    if (a === 'clr') { S.chat = []; save(); aiPanel(); }
    if (a === 'sum') { const t = await cur.wv.executeJavaScript('document.body.innerText.slice(0,12000)').catch(() => ''); t ? aiSend('Resume en español, en pocos puntos, esta página:\n\n' + t, 'Resume esta página') : toast('No puedo leer esta pestaña'); }
    if (a === 'exp') { const t = await cur.wv.executeJavaScript('getSelection().toString()').catch(() => ''); t ? aiSend('Explica de forma sencilla:\n\n' + t, 'Explica: ' + t.slice(0, 80)) : toast('Selecciona texto en la página primero'); }
  });
  q.focus();
}
ipc.on('ask-ai', (_, { m, t }) => { panel = 'ai'; draw(); aiSend((m === 'tr' ? 'Traduce al español, solo la traducción:\n\n' : 'Explica de forma sencilla:\n\n') + t, (m === 'tr' ? 'Traducir: ' : 'Explicar: ') + t.slice(0, 80)); });
ipc.on('ctx-search', (_, t) => newTab(S.search + encodeURIComponent(t)));
ipc.on('key', (_, k) => { if (k === 'shot') $('#sh').click(); });

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
