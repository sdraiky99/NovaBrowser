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
@keyframes rpl{to{transform:scale(28);opacity:0}}
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
