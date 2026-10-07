/* Nova 4.5.0 — Calm UI layer
 * Purpose: simplify the visible browser chrome without rewriting the stable index.html.
 * Uses the proven 4.4.1 shell as the base and keeps existing feature pages/IPC intact.
 */
(() => {
  'use strict';
  const q = s => document.querySelector(s);
  const safe = (fn) => { try { return fn(); } catch { return null; } };
  const icon = path => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  const I = {
    back:'M15 6l-6 6 6 6', fwd:'M9 6l6 6-6 6', reload:'M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5',
    star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1 1-6.1 1.9.9z',
    home:'M4 10.5L12 4l8 6.5V20H4z M9 20v-5h6v5', bookmark:'M6 4h12v16l-6-3-6 3z',
    folder:'M3 7h7l2 2h9v10H3z', speed:'M5 17a7 7 0 1 1 14 0 M12 17l3-5', puzzle:'M8 4h3v3h2V4h3v4a3 3 0 0 1 0 6v6h-4v-3h-2v3H6v-6a3 3 0 0 1 0-6V4h2z',
    settings:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
    more:'M6 12h.01M12 12h.01M18 12h.01', camera:'M4 8h4l2-3h4l2 3h4v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0-6',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M17 17l4 4', ai:'M12 3l2 6 6 3-6 3-2 6-2-6-6-3 6-3z'
  };

  if (!document.getElementById('nova45-style')) {
    const st=document.createElement('style'); st.id='nova45-style'; st.textContent=`
      :root{--nova45-bg:#f5f7fb;--nova45-surface:rgba(255,255,255,.90);--nova45-surface2:rgba(248,250,253,.94);--nova45-text:#1d2530;--nova45-muted:#687383;--nova45-border:rgba(28,39,53,.12);--nova45-accent:#5d78f6;--nova45-hover:rgba(31,44,61,.065);--nova45-shadow:0 16px 44px rgba(24,36,52,.12);--nova45-radius:11px;--nova45-font:Inter,"Segoe UI Variable","Segoe UI",system-ui,sans-serif}
      @media(prefers-color-scheme:dark){:root{--nova45-bg:#12161c;--nova45-surface:rgba(25,30,37,.92);--nova45-surface2:rgba(31,37,45,.95);--nova45-text:#eef2f7;--nova45-muted:#9ea9b6;--nova45-border:rgba(255,255,255,.10);--nova45-accent:#8ea4ff;--nova45-hover:rgba(255,255,255,.065);--nova45-shadow:0 18px 55px rgba(0,0,0,.30)}}
      body.nova45{background:var(--nova45-bg)!important;color:var(--nova45-text)!important;font-family:var(--nova45-font)!important;letter-spacing:0!important}
      body.nova45 #app{font-family:var(--nova45-font)!important}
      body.nova45 #top{height:42px!important;align-items:center!important;padding:0 8px!important;background:var(--nova45-surface)!important;backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%);border-bottom:1px solid var(--nova45-border)!important}
      body.nova45 #brand{height:100%;padding:0 10px 0 2px!important;gap:8px!important;font-weight:650!important;color:var(--nova45-text)!important;font-size:14px!important;align-items:center!important}
      body.nova45 #brand img{width:21px!important;height:21px!important;opacity:1!important}
      body.nova45 #tabs{align-self:stretch!important;align-items:center!important;gap:3px!important;padding-top:0!important}
      body.nova45 .tab{height:31px!important;min-width:78px!important;max-width:225px!important;flex:0 1 190px!important;border:1px solid transparent!important;border-radius:9px!important;background:transparent!important;color:var(--nova45-muted)!important;animation:nova45TabIn .16s ease-out!important}
      body.nova45 .tab.on{background:var(--nova45-bg)!important;border-color:var(--nova45-border)!important;color:var(--nova45-text)!important;box-shadow:0 1px 1px rgba(0,0,0,.03)!important}
      body.nova45 .tab:not(.on):hover{background:var(--nova45-hover)!important;color:var(--nova45-text)!important}
      body.nova45 .tab img{width:15px!important;height:15px!important;border-radius:3px!important}
      body.nova45 #tabs #nt{width:30px!important;height:30px!important;border-radius:8px!important;background:transparent!important;color:var(--nova45-text)!important}
      body.nova45 #bar{height:50px!important;box-sizing:border-box!important;padding:8px 10px!important;gap:6px!important;background:var(--nova45-bg)!important;border-bottom:1px solid var(--nova45-border)!important}
      body.nova45 #bar>.ib{width:30px!important;height:30px!important;color:var(--nova45-muted)!important}
      body.nova45 #bar>.ib:hover{background:var(--nova45-hover)!important;color:var(--nova45-text)!important}
      body.nova45 #addr{height:34px!important;padding:0 15px!important;background:var(--nova45-surface)!important;border:1px solid var(--nova45-border)!important;border-radius:17px!important;color:var(--nova45-text)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.22)!important;font-family:var(--nova45-font)!important}
      body.nova45 #addr:focus{border-color:rgba(93,120,246,.36)!important;box-shadow:0 0 0 3px rgba(93,120,246,.12)!important}
      body.nova45 #sh{display:none!important}
      body.nova45 #nova22-top-tools,body.nova45 #mnp{display:none!important}
      body.nova45 .apx .lgs,body.nova45 .apx > h3:nth-of-type(3),body.nova45 .apx > h3:nth-of-type(3)+.pal,body.nova45 .apx > h3:nth-of-type(4),body.nova45 .apx > h3:nth-of-type(4)+.chips,body.nova45 .apx > h3:nth-of-type(4)+.chips~.row,body.nova45 .apx > h3:nth-of-type(4)+.chips~.mut{display:none!important}
      body.nova45 #wc{height:100%!important;align-self:center!important;margin-left:4px!important}
      body.nova45 #wc .ib{width:42px!important;height:34px!important;color:var(--nova45-muted)!important;border-radius:7px!important}
      body.nova45 #wc .ib:hover{background:var(--nova45-hover)!important;color:var(--nova45-text)!important}
      body.nova45 #wc .ib:last-child:hover{background:#d94d4d!important;color:#fff!important}
      body.nova45 #side{width:50px!important;padding:8px 0!important;gap:4px!important;background:var(--nova45-surface)!important;border-right:1px solid var(--nova45-border)!important;backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%)}
      body.nova45 #side .ib{width:36px!important;height:36px!important;border-radius:9px!important;color:var(--nova45-muted)!important}
      body.nova45 #side .ib:hover{background:var(--nova45-hover)!important;color:var(--nova45-text)!important}
      body.nova45 #side .ib.on,.nova45-railbtn.on{background:rgba(93,120,246,.12)!important;color:var(--nova45-accent)!important}
      body.nova45 #side .nova45-railbtn{display:grid;place-items:center;width:36px;height:36px;border:0;border-radius:9px;background:transparent;color:var(--nova45-muted);cursor:pointer}
      body.nova45 #side .nova45-railbtn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      body.nova45 #panel{background:var(--nova45-surface)!important;border-left:1px solid var(--nova45-border)!important;backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%)}
      body.nova45 #pin{padding:16px!important;width:340px!important;box-sizing:border-box}
      body.nova45 h3{font-weight:650!important;letter-spacing:-.01em}
      body.nova45 .btn,body.nova45 .fld{font-family:var(--nova45-font)!important;border-radius:9px!important;background:var(--nova45-surface2)!important;border-color:var(--nova45-border)!important;color:var(--nova45-text)!important}
      body.nova45 .btn:hover,body.nova45 .btn.on{background:rgba(93,120,246,.10)!important;border-color:rgba(93,120,246,.30)!important;color:var(--nova45-accent)!important}
      body.nova45 .sw.on{background:var(--nova45-accent)!important}
      #nova45-menu-btn{margin-left:2px}
      body.nova45 #nova45-menu-btn svg{width:18px;height:18px}
      #nova45-menu{position:fixed;top:92px;right:56px;z-index:1200;display:none;width:270px;padding:7px;background:var(--nova45-surface);border:1px solid var(--nova45-border);border-radius:13px;box-shadow:var(--nova45-shadow);backdrop-filter:blur(16px) saturate(120%);-webkit-backdrop-filter:blur(16px) saturate(120%);animation:nova45MenuIn .13s ease-out}
      #nova45-menu.on{display:block}
      .nova45-menuitem{display:flex;align-items:center;gap:10px;width:100%;min-height:36px;padding:7px 9px;border:0;border-radius:8px;background:transparent;color:var(--nova45-text);cursor:pointer;text-align:left;font:13px var(--nova45-font)}
      .nova45-menuitem:hover{background:var(--nova45-hover)} .nova45-menuitem svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;color:var(--nova45-muted);flex:none}.nova45-menuitem .shortcut{margin-left:auto;color:var(--nova45-muted);font-size:11px}.nova45-menusep{height:1px;background:var(--nova45-border);margin:6px 4px}
      #nova45-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
      .nova45-appearance{padding:10px;border:1px solid var(--nova45-border);border-radius:10px;background:var(--nova45-surface2)} .nova45-appearance b{display:block;font-size:12px;margin-bottom:4px}.nova45-appearance span{font-size:11px;color:var(--nova45-muted)}
      @keyframes nova45TabIn{from{opacity:0;transform:translateY(4px) scale(.985)}to{opacity:1;transform:none}}
      @keyframes nova45MenuIn{from{opacity:0;transform:translateY(-4px) scale(.985)}to{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){body.nova45 *{animation:none!important;transition:none!important}#nova45-menu{animation:none!important}}
    `; document.head.appendChild(st);
  }

  // Lock the new visual system. Legacy feature code can still run, but cannot expose old theme classes.
  const applyCalmTheme=()=>{
    safe(()=>{document.body.classList.remove('t-air','t-nova','t-nova44','t-light','t-safari','t-code','t-win95','t-undertale','t-aero','t-cyberpunk','t-neon');document.body.classList.add('nova45');});
    safe(()=>{ if (typeof S==='object') { S.theme='nova45'; window.save?.(); } });
  };
  applyCalmTheme();
  const classObserver=new MutationObserver(()=>{ if(!document.body.classList.contains('nova45') || document.body.className!=='nova45') applyCalmTheme(); });
  classObserver.observe(document.body,{attributes:true,attributeFilter:['class']});

  const logoSrc='../assets/nova-logo.svg';
  safe(()=>{const b=q('#brand img'); if(b){b.src=logoSrc;b.alt='Nova';}});

  // Remove clutter from the main toolbar and expose secondary tools in one calm menu.
  safe(()=>{
    q('#sh')?.setAttribute('aria-hidden','true');
    q('#mnp')?.setAttribute('aria-hidden','true');
    q('#mnp')?.setAttribute('inert','');
    q('#mnp')?.style.setProperty('display','none','important');
    q('#nova22-top-tools')?.setAttribute('aria-hidden','true');
  });
  const bar=q('#bar');
  if(bar && !q('#nova45-menu-btn')){
    const b=document.createElement('button'); b.type='button'; b.className='ib'; b.id='nova45-menu-btn'; b.title='Menú Nova'; b.setAttribute('aria-label','Menú Nova'); b.innerHTML=icon(I.more); bar.appendChild(b);
  }
  const menu=document.createElement('div'); menu.id='nova45-menu'; menu.setAttribute('role','menu');
  menu.innerHTML=`
    <button class="nova45-menuitem" data-act="new">${icon(I.plus||'M12 5v14M5 12h14')}<span>Nueva pestaña</span><span class="shortcut">Ctrl+T</span></button>
    <button class="nova45-menuitem" data-act="bookmarks">${icon(I.bookmark)}<span>Favoritos</span></button>
    <button class="nova45-menuitem" data-act="capture">${icon(I.camera)}<span>Capturar pantalla</span></button>
    <div class="nova45-menusep"></div>
    <button class="nova45-menuitem" data-act="workspaces">${icon(I.folder)}<span>Workspaces</span></button>
    <button class="nova45-menuitem" data-act="performance">${icon(I.speed)}<span>Rendimiento</span></button>
    <button class="nova45-menuitem" data-act="extensions">${icon(I.puzzle)}<span>Extensiones</span></button>
    <div class="nova45-menusep"></div>
    <button class="nova45-menuitem" data-act="appearance">${icon(I.settings)}<span>Ajustes</span></button>
    <button class="nova45-menuitem" data-act="ai">${icon(I.ai)}<span>Nova IA</span></button>`;
  document.body.appendChild(menu);

  // Replace the crowded sidebar with only the actions that have a clear, useful destination.
  const side=q('#side');
  if(side){
    side.innerHTML=`
      <button class="nova45-railbtn" data-n45="home" title="Inicio" aria-label="Inicio">${icon(I.home)}</button>
      <button class="nova45-railbtn" data-n45="bookmarks" title="Favoritos" aria-label="Favoritos">${icon(I.bookmark)}</button>
      <button class="nova45-railbtn" data-n45="workspaces" title="Workspaces" aria-label="Workspaces">${icon(I.folder)}</button>
      <button class="nova45-railbtn" data-n45="performance" title="Rendimiento" aria-label="Rendimiento">${icon(I.speed)}</button>
      <div style="flex:1"></div>
      <button class="nova45-railbtn" data-n45="settings" title="Ajustes" aria-label="Ajustes">${icon(I.settings)}</button>`;
    side.addEventListener('click',e=>{
      const b=e.target.closest('[data-n45]'); if(!b)return;
      const a=b.dataset.n45;
      if(a==='home'){ safe(()=>{ if(typeof cur!=='undefined'&&cur?.wv) cur.wv.loadURL(NT()); }); }
      if(a==='bookmarks'){ safe(()=>{ panel='marks'; draw(); }); }
      if(a==='workspaces'){ safe(()=>newTab('nova://workspaces44')); }
      if(a==='performance'){ safe(()=>newTab('nova://rendimiento44')); }
      if(a==='settings'){ safe(()=>newTab('nova://ajustes')); }
      menu.classList.remove('on');
    },false);
  }

  const toggleMenu=()=>menu.classList.toggle('on');
  q('#nova45-menu-btn')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleMenu();});
  document.addEventListener('click',e=>{if(menu.classList.contains('on') && !menu.contains(e.target) && !e.target.closest('#nova45-menu-btn')) menu.classList.remove('on');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')menu.classList.remove('on');});
  menu.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]'); if(!b)return; const a=b.dataset.act; menu.classList.remove('on');
    if(a==='new') safe(()=>newTab());
    else if(a==='bookmarks') safe(()=>{panel='marks';draw();});
    else if(a==='capture') safe(()=>q('#m1')?.click() || q('#sh')?.click());
    else if(a==='workspaces') safe(()=>newTab('nova://workspaces44'));
    else if(a==='performance') safe(()=>newTab('nova://rendimiento44'));
    else if(a==='extensions') safe(()=>newTab('nova://extensiones44'));
    else if(a==='appearance') safe(()=>newTab('nova://ajustes'));
    else if(a==='ai') safe(()=>{panel='ai';draw();});
  });

  // Remove old theme selectors whenever the legacy settings panel is rendered.
  const cleanSettings=()=>safe(()=>{
    const p=q('#pin'); if(!p || typeof panel==='undefined' || panel!=='set') return;
    p.querySelectorAll('.th').forEach(x=>x.remove());
    p.querySelectorAll('.grid').forEach(g=>{if(!g.querySelector('[data-f]') && !g.querySelector('.wp')) g.remove();});
    [...p.querySelectorAll('.mut,span')].forEach(x=>{if(/^(Tema|Theme)\b/i.test(String(x.textContent||'').trim()))x.remove();});
    if(!p.querySelector('#nova45-settings-note')){
      const d=document.createElement('div'); d.id='nova45-settings-note'; d.className='nova45-appearance'; d.innerHTML='<b>Apariencia Nova Calm</b><span>Interfaz clara, discreta y consistente. Nova ajusta automáticamente el modo claro u oscuro según el sistema.</span>'; p.prepend(d);
    }
  });
  const pinObs=new MutationObserver(cleanSettings); if(q('#pin')) pinObs.observe(q('#pin'),{childList:true,subtree:true});
  setTimeout(cleanSettings,50); setTimeout(cleanSettings,350);

  // Accessibility and visual consistency for retained controls.
  safe(()=>{q('#bk')?.setAttribute('aria-label','Atrás');q('#fw')?.setAttribute('aria-label','Adelante');q('#rl')?.setAttribute('aria-label','Recargar');q('#st')?.setAttribute('aria-label','Añadir a favoritos');});

  // QA-visible audit marker; no user-facing UI.
  window.NOVA45_AUDIT={version:'4.5.0',visibleToolbar:['back','forward','reload','address','bookmark','menu'],sidebar:['home','bookmarks','workspaces','performance','settings'],removed:['capture-from-toolbar','legacy-theme-choices','visible-mods-button','visible-wallpapers-button','legacy-main-menu'],menu:['new','bookmarks','capture','workspaces','performance','extensions','appearance','ai']};
})();
