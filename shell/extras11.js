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
