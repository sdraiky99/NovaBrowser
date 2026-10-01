/* Nova 2.4.0 · tema Cyberpunk, logotipo "Retro 2009" con animación de inicio y notas de actualización */
(() => {
  if (window.__novaCyber) return; window.__novaCyber = true;
  const { PG } = window.NOVA;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- registro del tema y del logotipo ---------- */
  Object.assign(THEMES, { cyberpunk: 'Cyberpunk' });
  if (window.NOVA.LG) window.NOVA.LG.retro09 = 'Retro 2009';

  /* ---------- estilos del tema ---------- */
  const CH = 'polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px))';   // esquinas cortadas
  const CHS = 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))';
  const css = `
  @keyframes cpglitch{0%,92%,100%{text-shadow:2px 0 #ff003c,-2px 0 #00f0ff;transform:none}93%{text-shadow:-3px 0 #ff003c,3px 0 #00f0ff;transform:translateX(1px) skewX(-6deg)}95%{text-shadow:3px 0 #ff003c,-3px 0 #00f0ff;transform:translateX(-1px)}97%{text-shadow:2px 1px #ff003c,-2px -1px #00f0ff;transform:none}}
  @keyframes cpscan{from{background-position:0 0}to{background-position:0 6px}}
  body.t-cyberpunk{text-transform:none;letter-spacing:.02em;background:var(--bg)}
  body.t-cyberpunk #top{background:linear-gradient(180deg,#14130a,#07070a);border-bottom:2px solid var(--acc);box-shadow:0 2px 14px #fcee0a33;position:relative;z-index:3}
  body.t-cyberpunk #top::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 2px,#fcee0a0a 2px 3px);animation:cpscan 2s linear infinite}
  body.t-cyberpunk #brand{color:var(--acc);text-transform:uppercase;letter-spacing:.18em;font-weight:700;animation:cpglitch 5s infinite}
  body.t-cyberpunk #brand img{filter:drop-shadow(0 0 4px #fcee0a)}
  body.t-cyberpunk .tab{border:0;border-radius:0;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%);background:#16150a;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;font-size:12px;font-weight:600;margin-right:3px;height:29px}
  body.t-cyberpunk .tab:not(.on):hover{background:#26240c;color:var(--acc2)}
  body.t-cyberpunk .tab.on{background:var(--acc);color:#050507;font-weight:700}
  body.t-cyberpunk .tab.ld::after{background:var(--acc2);height:3px;box-shadow:0 0 8px var(--acc2)}
  body.t-cyberpunk .tab.on.ld::after{background:#ff003c;box-shadow:0 0 8px #ff003c}
  body.t-cyberpunk #nt{color:var(--acc)}
  body.t-cyberpunk #nt:hover,body.t-cyberpunk .ib:hover{background:#fcee0a1f;color:var(--acc2);box-shadow:inset 0 0 0 1px var(--acc2)}
  body.t-cyberpunk #wc .ib{color:var(--acc)}
  body.t-cyberpunk #wc .ib:last-child:hover{background:#ff003c;color:#fff;box-shadow:0 0 12px #ff003c}
  body.t-cyberpunk .ib{border-radius:0;color:var(--fg)}
  body.t-cyberpunk .ib svg{stroke-width:2}
  body.t-cyberpunk #bar{background:#07070a;border-bottom:1px solid var(--bd);box-shadow:0 1px 0 #00f0ff22}
  body.t-cyberpunk #addr{background:#0d0d12;border:1px solid var(--acc);border-radius:0;color:var(--acc2);font-family:"Cascadia Code",Consolas,monospace;font-size:13px;clip-path:${CHS};padding:0 16px;letter-spacing:.02em}
  body.t-cyberpunk #addr:focus{border-color:var(--acc2);box-shadow:0 0 0 1px var(--acc2),0 0 14px #00f0ff55;color:#fff}
  body.t-cyberpunk #addr::placeholder{color:var(--mut)}
  body.t-cyberpunk #side{background:#09090d;border-right:1px solid var(--bd);box-shadow:1px 0 0 #fcee0a22}
  body.t-cyberpunk #side .ib.on{background:var(--acc);color:#050507;box-shadow:0 0 12px #fcee0a77}
  body.t-cyberpunk #side .ai svg{filter:drop-shadow(0 0 6px #ff003c)}
  body.t-cyberpunk #side .ai:hover svg{filter:drop-shadow(0 0 10px #00f0ff)}
  body.t-cyberpunk #panel{background:#0a0a0f;border-left:1px solid var(--acc)}
  body.t-cyberpunk #bmb{background:#07070a;border-top:1px solid var(--acc);box-shadow:0 -2px 12px #fcee0a22}
  body.t-cyberpunk h2,body.t-cyberpunk h3{text-transform:uppercase;letter-spacing:.1em;color:var(--acc)}
  body.t-cyberpunk h3{font-size:14px}
  body.t-cyberpunk .btn{background:#12110a;border:1px solid var(--acc);color:var(--acc);text-transform:uppercase;letter-spacing:.08em;font-size:12px;font-weight:600;clip-path:${CH};padding:7px 16px}
  body.t-cyberpunk .btn:hover{background:var(--acc2);border-color:var(--acc2);color:#050507;box-shadow:0 0 14px #00f0ff88}
  body.t-cyberpunk .btn.on{background:var(--acc);border-color:var(--acc);color:#050507;box-shadow:0 0 12px #fcee0a66}
  body.t-cyberpunk .btn.on:hover{background:#fff35a;color:#050507}
  body.t-cyberpunk .fld{background:#0d0d12;border:1px solid var(--bd);border-bottom:2px solid var(--acc);border-radius:0;color:var(--fg)}
  body.t-cyberpunk .fld:focus{border-color:var(--acc2);box-shadow:0 0 10px #00f0ff44}
  body.t-cyberpunk #mnp{background:#0b0b10;border:1px solid var(--acc);border-radius:0;box-shadow:0 0 22px #fcee0a33,6px 6px 0 #ff003c55;padding:4px}
  body.t-cyberpunk #mnp button{border-radius:0;text-transform:uppercase;letter-spacing:.05em;font-size:12px}
  body.t-cyberpunk #mnp button:hover{background:var(--acc);color:#050507}
  body.t-cyberpunk .card{background:#0b0b10;border:1px solid var(--acc);border-radius:0;box-shadow:0 0 30px #fcee0a2a,8px 8px 0 #ff003c44;clip-path:${CH}}
  body.t-cyberpunk .ipage{background:radial-gradient(ellipse at 100% 0,#ff003c14,transparent 45%),radial-gradient(ellipse at 0 100%,#00f0ff10,transparent 45%),#050507;color:var(--fg)}
  body.t-cyberpunk .ipage h2{font-size:24px;border-left:5px solid var(--acc);padding-left:12px;margin-bottom:12px;text-shadow:2px 0 #ff003c55,-2px 0 #00f0ff55}
  body.t-cyberpunk .li{background:#0d0d12;border:0;border-left:3px solid var(--bd);border-radius:0}
  body.t-cyberpunk .li:hover{border-left-color:var(--acc);background:#16150a}
  body.t-cyberpunk .th{border-radius:0;border-width:1px;text-transform:uppercase;letter-spacing:.08em;clip-path:${CHS}}
  body.t-cyberpunk .th.on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc),0 0 12px #fcee0a55;color:var(--acc)}
  body.t-cyberpunk .th[data-t=cyberpunk]{background:linear-gradient(135deg,#fcee0a22,#ff003c22 55%,#00f0ff22)!important}
  body.t-cyberpunk .sw{border-radius:0;background:#2a280c;border:1px solid var(--bd)}
  body.t-cyberpunk .sw::after{border-radius:0;background:var(--mut)}
  body.t-cyberpunk .sw.on{background:#fcee0a33;border-color:var(--acc)}
  body.t-cyberpunk .sw.on::after{background:var(--acc);box-shadow:0 0 8px var(--acc)}
  body.t-cyberpunk .m{border-radius:0}
  body.t-cyberpunk .m.u{background:var(--acc);color:#050507}
  body.t-cyberpunk .m.a{background:#0d0d12;border:1px solid var(--bd);border-left:3px solid var(--acc2)}
  body.t-cyberpunk *::-webkit-scrollbar{width:9px;height:9px;background:#07070a}
  body.t-cyberpunk *::-webkit-scrollbar-thumb{background:#5b5416;border:1px solid var(--acc)}
  body.t-cyberpunk *::-webkit-scrollbar-thumb:hover{background:var(--acc)}
  body.t-cyberpunk ::selection{background:var(--acc);color:#050507}`;
  const st = document.createElement('style'); st.id = 'nova-cyber'; st.textContent = css; document.head.appendChild(st);

  /* ---------- Ajustes › Apariencia: acceso directo a Cyberpunk y al logotipo Retro 2009 ---------- */
  const prevSplash = logo => {
    const ov = document.createElement('div'); ov.className = 'ov';
    ov.innerHTML = `<iframe class="prev" src="splash.html?logo=${encodeURIComponent(logo)}"></iframe>`;
    document.body.appendChild(ov); const end = () => ov.remove(); ov.onclick = end; setTimeout(end, 3600);
  };
  const pAj = PG.ajustes;
  PG.ajustes = r => {
    pAj(r); const k = r.querySelector('nav .btn.on')?.dataset.k, c = r.querySelector('#sc');
    if (k !== 'apariencia' || !c || c.querySelector('.cpx')) return;
    const cy = S.theme === 'cyberpunk', rl = S.logo === 'retro09';
    c.insertAdjacentHTML('beforeend', `<div class="cpx" style="display:flex;flex-direction:column;gap:12px"><h3>Cyberpunk y Retro 2009</h3>
      <span class="mut">Cyberpunk: negro profundo, amarillo neón, cian y rojo, con esquinas cortadas y efecto glitch. Retro 2009: logotipo de esfera brillante al estilo de los navegadores de aquella época, con su propia animación de inicio.</span>
      <div class="chips"><button class="btn ${cy ? 'on' : ''}" id="cp-th">Tema Cyberpunk</button><button class="btn ${rl ? 'on' : ''}" id="cp-lg">Logotipo Retro 2009</button><button class="btn" id="cp-pv">Ver animación de inicio</button><button class="btn" id="cp-both">Aplicar los dos</button></div></div>`);
    const again = () => PG.ajustes(r);
    c.querySelector('#cp-th').onclick = () => { S.theme = 'cyberpunk'; save(); applyTheme(); refreshNT(); again(); };
    c.querySelector('#cp-lg').onclick = () => { window.NOVA.setLogo('retro09'); again(); };
    c.querySelector('#cp-pv').onclick = () => prevSplash('retro09');
    c.querySelector('#cp-both').onclick = () => { S.theme = 'cyberpunk'; save(); applyTheme(); window.NOVA.setLogo('retro09'); refreshNT(); again(); };
  };

  /* ---------- notas de actualización 2.4.0 ---------- */
  const oldNews = PG.novedades;
  PG.novedades = r => {
    if (typeof oldNews === 'function') oldNews(r);
    if (r.querySelector('#nova24-news')) return;
    const items = [
      ['Tema Cyberpunk', 'Nuevo tema inspirado en Cyberpunk 2077: negro profundo, amarillo neón con cian y rojo, pestañas y botones de esquinas cortadas, barra de direcciones tipo terminal y logotipo con efecto glitch. Se elige en Ajustes › Apariencia o en el selector de temas.'],
      ['Logotipo Retro 2009', 'Nueva esfera azul brillante al estilo de los navegadores de 2009. Se aplica a la barra, la nueva pestaña, la ventana y la barra de tareas.'],
      ['Animación de inicio Retro 2009', 'Ventana clara estilo Web 2.0 con el orbe rebotando, un destello que lo recorre, el nombre con reflejo y una barra de progreso verde brillante. Puedes verla en Ajustes › Apariencia › Ver animación de inicio.'],
      ['Nueva pestaña minimalista', 'La página de inicio muestra ahora solo la barra de búsqueda. Todo lo demás (reloj, accesos rápidos, marcadores, historial, descargas, Nova IA, Centro rápido y recientes) está en la pestaña «Más», abajo a la derecha.'],
      ['Notas de actualización', 'Esta página recoge los cambios de cada versión. Los de 2.4.0 también están en CHANGELOG.md y RELEASE_NOTES_2.4.0.md.']
    ];
    const c = document.createElement('section'); c.id = 'nova24-news'; c.className = 'nova21-card';
    c.innerHTML = `<h2>Nova 2.4.0</h2><span class="mut">Tema Cyberpunk, logotipo y animación Retro 2009 y una nueva pestaña mucho más limpia.</span><ul style="margin:0;padding-left:20px">${items.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join('')}</ul><div class="nova21-actions" style="margin-top:8px"><button class="btn on" id="n24th">Probar Cyberpunk</button><button class="btn" id="n24pv">Ver animación Retro 2009</button></div>`;
    r.prepend(c);
    c.querySelector('#n24th').onclick = () => { S.theme = 'cyberpunk'; save(); applyTheme(); refreshNT(); };
    c.querySelector('#n24pv').onclick = () => prevSplash('retro09');
  };
})();
