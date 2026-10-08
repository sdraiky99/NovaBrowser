(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = msg => {
    let t = $('#nova532-toast');
    if (!t) { t = document.createElement('div'); t.id = 'nova532-toast'; document.body.appendChild(t); }
    t.textContent = String(msg || '');
    t.classList.add('on'); clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove('on'), 2200);
  };
  const route = r => { try { return typeof newTab === 'function' ? newTab('nova://' + r) : null; } catch { toast('Sección no disponible'); return null; } };

  const icons = {
    home:'M3 10.5 12 3l9 7.5v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    star:'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z',
    history:'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4M12 7v5l3 2',
    dl:'M12 4v11M8 11l4 4 4-4M5 20h14',
    ext:'M8 5h3V3h2v2h3a2 2 0 0 1 2 2v3h2v4h-2v3a2 2 0 0 1-2 2h-3v2h-2v-2H8a2 2 0 0 1-2-2v-3H4v-4h2V7a2 2 0 0 1 2-2z',
    work:'M4 7h6l2 2h8v10H4zM4 7V5h6l2 2',
    speed:'M4 15a8 8 0 1 1 16 0M12 15l4-4M12 15h.01',
    settings:'M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    help:'M9.5 9a2.5 2.5 0 1 1 4.3 1.8c-.9.9-1.8 1.2-1.8 2.7M12 17h.01',
    menu:'M4 7h16M4 12h16M4 17h16',
    plus:'M12 5v14M5 12h14',
    close:'M6 6l12 12M18 6 6 18',
    back:'M15 6l-6 6 6 6',
    fwd:'M9 6l6 6-6 6',
    reload:'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
    search:'M10.7 18.2a7.5 7.5 0 1 1 5.3-2.2L21 21'
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[k] || icons.help}"/></svg>`;

  const installUi = () => {
    if ($('#nova532-ui-style')) return;
    const style = document.createElement('style'); style.id='nova532-ui-style';
    style.textContent = `
      :root{--n53-accent:#4f63e8;--n53-bg:#f4f6f8;--n53-surface:#ffffff;--n53-surface2:#eef1f4;--n53-text:#202124;--n53-muted:#6f737b;--n53-border:rgba(32,33,36,.11);--n53-shadow:0 14px 38px rgba(20,28,42,.08);--n53-dur:140ms}
      body.nova53-ui{font-family:"Segoe UI Variable","Segoe UI",Inter,system-ui,sans-serif;background:var(--n53-bg);color:var(--n53-text)}
      body.nova53-ui.q-dark{--n53-bg:#101217;--n53-surface:#191c22;--n53-surface2:#242831;--n53-text:#f3f5f8;--n53-muted:#a3a9b5;--n53-border:rgba(255,255,255,.10);--n53-shadow:0 20px 60px rgba(0,0,0,.28)}
      body.nova53-ui #top{height:44px;padding:0 7px;background:color-mix(in srgb,var(--n53-surface) 94%,transparent);border-bottom:1px solid var(--n53-border);backdrop-filter:blur(16px);align-items:center}
      body.nova53-ui #brand{width:42px;height:34px;padding:0;margin:0 5px 0 0;display:grid;place-items:center;gap:0;overflow:hidden}
      body.nova53-ui #brand img{width:25px;height:25px;object-fit:contain;border-radius:0;filter:none}
      body.nova53-ui #brand span{display:none}
      body.nova53-ui #tabs{align-items:center;gap:4px;padding:0;min-width:0}
      body.nova53-ui .tab{height:32px;min-width:74px;max-width:220px;flex:0 1 190px;padding:0 9px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--n53-muted);transition:background var(--n53-dur),color var(--n53-dur),transform var(--n53-dur)}
      body.nova53-ui .tab:hover{background:var(--n53-surface2);color:var(--n53-text)}
      body.nova53-ui .tab.on{background:var(--n53-surface2);border-color:var(--n53-border);color:var(--n53-text);box-shadow:none}
      body.nova53-ui .tab img{width:15px;height:15px;border-radius:4px;object-fit:cover}
      body.nova53-ui #tabs #nt{width:32px;height:32px;flex:0 0 32px;border-radius:999px;background:var(--n53-surface2);color:var(--n53-muted);margin:0 2px;display:grid;place-items:center}
      body.nova53-ui #tabs #nt:hover{background:color-mix(in srgb,var(--n53-accent) 12%,var(--n53-surface2));color:var(--n53-accent)}
      body.nova53-ui #wc{height:44px;align-items:center;gap:2px}
      body.nova53-ui #wc .ib{width:31px;height:31px;border-radius:999px;background:transparent;color:var(--n53-muted)}
      body.nova53-ui #wc .ib:hover{background:var(--n53-surface2);color:var(--n53-text)}
      body.nova53-ui #wc .ib:last-child:hover{background:#d84e5e;color:white}
      body.nova53-ui #bar{padding:7px 9px;gap:6px;background:var(--n53-bg);border-bottom:1px solid var(--n53-border)}
      body.nova53-ui #bar .ib{width:34px;height:32px;border-radius:999px;background:var(--n53-surface2);color:var(--n53-muted);border:1px solid var(--n53-border)}
      body.nova53-ui #bar .ib:hover{background:color-mix(in srgb,var(--n53-accent) 10%,var(--n53-surface2));color:var(--n53-text)}
      body.nova53-ui #addr{height:34px;background:var(--n53-surface);color:var(--n53-text);border:1px solid var(--n53-border);border-radius:999px;box-shadow:none}
      body.nova53-ui #addr:focus{border-color:var(--n53-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--n53-accent) 17%,transparent)}
      body.nova53-ui #side{width:58px;padding:10px 8px;background:color-mix(in srgb,var(--n53-surface) 95%,transparent);border-right:1px solid var(--n53-border);gap:6px;backdrop-filter:blur(14px)}
      body.nova53-ui #side .q-side-btn{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:var(--n53-muted);display:grid;place-items:center;transition:background var(--n53-dur),color var(--n53-dur),transform var(--n53-dur)}
      body.nova53-ui #side .q-side-btn:hover{background:var(--n53-surface2);color:var(--n53-text)}
      body.nova53-ui #side .q-side-btn.on{background:color-mix(in srgb,var(--n53-accent) 12%,var(--n53-surface2));color:var(--n53-accent)}
      body.nova53-ui #side .q-side-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      body.nova53-ui #side .q-pin-list{gap:4px}.q-side-sep{width:26px;height:1px;background:var(--n53-border);margin:2px auto}
      body.nova53-ui #side .q-pin{width:36px;height:36px;border-radius:10px;background:transparent;border:0;display:grid;place-items:center}
      body.nova53-ui #side .q-pin img{width:19px;height:19px;border-radius:5px;object-fit:cover}
      body.nova53-ui #panel{background:var(--n53-surface);border-left:1px solid var(--n53-border);box-shadow:-18px 0 45px rgba(20,28,42,.08);backdrop-filter:blur(16px)}
      body.nova53-ui #pin{padding:18px}
      body.nova53-ui .btn,body.nova53-ui .fld{border-radius:12px;background:var(--n53-surface);border:1px solid var(--n53-border);color:var(--n53-text)}
      body.nova53-ui .btn:hover{background:var(--n53-surface2);border-color:color-mix(in srgb,var(--n53-accent) 28%,var(--n53-border));color:var(--n53-text)}
      body.nova53-ui .btn.on{background:color-mix(in srgb,var(--n53-accent) 12%,var(--n53-surface));border-color:color-mix(in srgb,var(--n53-accent) 34%,var(--n53-border));color:var(--n53-accent)}
      body.nova53-ui #sh{display:none!important}
      body.nova53-ui #nova20-wsbtn,body.nova53-ui #nova20-studybtn{display:none!important}
      body.nova53-ui .nova22-topbtn{display:none!important}
      body.nova53-ui .th{display:none!important}
      #nova532-toast{position:fixed;left:50%;bottom:20px;z-index:5000;padding:10px 14px;border:1px solid var(--n53-border);border-radius:999px;background:var(--n53-surface);color:var(--n53-text);box-shadow:var(--n53-shadow);opacity:0;transform:translate(-50%,8px);pointer-events:none;transition:opacity var(--n53-dur),transform var(--n53-dur)}#nova532-toast.on{opacity:1;transform:translate(-50%,0)}
      #nova532-settings{height:100%;overflow:auto;background:var(--n53-bg);color:var(--n53-text);padding:28px 32px 44px;font-family:"Segoe UI Variable","Segoe UI",Inter,system-ui,sans-serif}
      .n53-settings-inner{width:min(930px,100%);margin:auto}.n53-head{margin-bottom:20px}.n53-kicker{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--n53-accent);font-weight:800}.n53-head h1{margin:5px 0 5px;font-size:30px;letter-spacing:-.035em}.n53-head p{margin:0;color:var(--n53-muted);line-height:1.6}.n53-group{display:grid;gap:10px;margin-top:14px}.n53-card{background:var(--n53-surface);border:1px solid var(--n53-border);border-radius:16px;padding:16px 17px;box-shadow:0 8px 25px rgba(20,28,42,.04)}.n53-card h2{font-size:14px;margin:0 0 5px}.n53-card p{font-size:12px;color:var(--n53-muted);margin:0 0 12px;line-height:1.55}.n53-row{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:10px 0;border-top:1px solid var(--n53-border)}.n53-row:first-of-type{border-top:0}.n53-row b{display:block;font-size:12px}.n53-row span{display:block;color:var(--n53-muted);font-size:11px;margin-top:2px}.n53-pillrow{display:flex;gap:7px;flex-wrap:wrap}.n53-pill{border:1px solid var(--n53-border);background:var(--n53-surface2);color:var(--n53-muted);padding:8px 11px;border-radius:999px;cursor:pointer;font-size:11px}.n53-pill.on{background:color-mix(in srgb,var(--n53-accent) 12%,var(--n53-surface2));border-color:color-mix(in srgb,var(--n53-accent) 42%,var(--n53-border));color:var(--n53-accent)}.n53-color{width:28px;height:28px;border-radius:50%;border:2px solid var(--n53-surface);box-shadow:0 0 0 1px var(--n53-border);background:var(--c);cursor:pointer}.n53-color.on{box-shadow:0 0 0 2px var(--n53-accent)}
      @media(max-width:720px){#nova532-settings{padding:22px 17px}.n53-row{align-items:flex-start;flex-direction:column}.n53-color{width:30px;height:30px}}
      @media(prefers-reduced-motion:reduce){body.nova53-ui *,#nova532-settings *{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  };

  const mode = () => { try { return ['system','light','dark'].includes(String(S.quantumAppearance)) ? String(S.quantumAppearance) : 'system'; } catch { return 'system'; } };
  const isDark = () => mode()==='dark' || (mode()==='system' && matchMedia('(prefers-color-scheme:dark)').matches);
  const applyMode = () => {
    document.body.classList.add('nova53-ui');
    document.body.classList.toggle('q-dark', isDark());
    document.body.classList.toggle('q-light', !isDark());
    const accent = String(S.quantumAccent || '#4f63e8');
    if (/^#[0-9a-f]{6}$/i.test(accent)) {
      document.documentElement.style.setProperty('--n53-accent', accent);
      document.documentElement.style.setProperty('--q-accent', accent);
    }
  };
  const setMode = m => { S.quantumAppearance = ['system','light','dark'].includes(m) ? m : 'system'; window.save?.(); applyMode(); renderSettings(); try{refreshNT?.()}catch{} };
  const setAccent = c => { if(!/^#[0-9a-f]{6}$/i.test(c)) return; S.quantumAccent=c; window.save?.(); applyMode(); renderSettings(); try{refreshNT?.()}catch{}; toast('Color de acento actualizado'); };

  function rebuildTop() {
    const brand = $('#brand'); if (brand) { brand.innerHTML = '<img src="../assets/logo/nova-quantum.svg" alt="Nova">'; brand.title = 'Nova'; }
    ['#nova20-wsbtn','#nova20-studybtn','#nova22-top-tools','.nova22-topbtn'].forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
    // Remove visible workspace pills accidentally inserted beside the brand.
    document.querySelectorAll('#top button').forEach(b => {
      const txt = (b.textContent||'').trim().toLowerCase();
      if (txt === 'general' || txt === 'estudio' || txt.includes('nova study')) b.remove();
    });
    const sh = $('#sh'); if (sh) sh.remove();
  }

  function rebuildSide() {
    const side=$('#side'); if(!side) return;
    side.innerHTML = `
      <button class="q-side-btn" data-qside="home" title="Inicio">${svg('home')}</button>
      <div class="q-side-sep"></div>
      <button class="q-side-btn" data-qside="favorites" title="Favoritos">${svg('star')}</button>
      <button class="q-side-btn" data-qside="history" title="Historial">${svg('history')}</button>
      <button class="q-side-btn" data-qside="downloads" title="Descargas">${svg('dl')}</button>
      <button class="q-side-btn" data-qside="workspaces" title="Workspaces">${svg('work')}</button>
      <button class="q-side-btn" data-qside="extensions" title="Extensiones">${svg('ext')}</button>
      <button class="q-side-btn" data-qside="performance" title="Rendimiento">${svg('speed')}</button>
      <span style="flex:1"></span>
      <button class="q-side-btn" data-qside="settings" title="Ajustes">${svg('settings')}</button>`;
    side.onclick=e=>{
      const b=e.target.closest('[data-qside]'); if(!b)return;
      side.querySelectorAll('[data-qside]').forEach(x=>x.classList.remove('on')); b.classList.add('on');
      const a=b.dataset.qside;
      if(a==='home') newTab();
      else if(a==='favorites'){ try{panel=panel==='marks'?null:'marks';draw();}catch{} }
      else if(a==='history') route('historial');
      else if(a==='downloads') route('descargas2');
      else if(a==='workspaces') route('workspaces44');
      else if(a==='extensions') route('extensioncenter53');
      else if(a==='performance') route('rendimiento44');
      else if(a==='settings') route('quantumsettings');
    };
    refreshPins();
  }

  function refreshPins(){
    const host=$('#q-pin-list'); if(!host)return;
    const items=[...(S.quick||[]),...(S.marks||[])].filter(x=>x&&/^https?:/i.test(String(x.u||''))).filter((x,i,a)=>a.findIndex(y=>y.u===x.u)===i).slice(0,4);
    host.innerHTML=items.map(x=>{let h='Sitio';try{h=new URL(x.u).hostname.replace(/^www\./,'')}catch{};return `<button class="q-pin" data-u="${esc(x.u)}" title="${esc(x.t||h)}"><img src="../assets/logo/nova-quantum.svg" alt=""></button>`}).join('');
    items.forEach((x,i)=>{try{const img=host.querySelectorAll('.q-pin img')[i];const u=new URL(x.u);img.src=u.origin+'/favicon.ico';img.onerror=()=>{img.onerror=null;img.src='../assets/logo/nova-quantum.svg'}}catch{}});
    host.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>newTab(b.dataset.u));
  }

  function renderSettings(){
    const r = $('#pin'); if(!r) return;
    const old = window.NOVA?.PG?.quantumsettings;
    if (!window.NOVA?.PG) return;
    const current=mode(); const accent=String(S.quantumAccent||'#4f63e8');
    r.innerHTML=`<div id="nova532-settings"><div class="n53-settings-inner"><div class="n53-head"><div class="n53-kicker">NOVA QUANTUM 5.3.2</div><h1>Ajustes</h1><p>Una configuración completa, limpia y sin opciones fantasma. Todo lo que ves aquí corresponde a una función real de Nova.</p></div>
      <section class="n53-group"><div class="n53-card"><h2>Apariencia</h2><p>Elige cómo debe verse Nova. El contenido de las webs permanece independiente del tema de la interfaz.</p><div class="n53-pillrow">${['system','light','dark'].map(x=>`<button class="n53-pill ${current===x?'on':''}" data-mode="${x}">${x==='system'?'Sistema':x==='light'?'Claro':'Oscuro'}</button>`).join('')}</div><div class="n53-row"><div><b>Color de acento</b><span>Solo afecta a controles activos e indicadores.</span></div><div class="n53-pillrow">${['#4f63e8','#7c5cff','#1aa98a','#e58a2f','#d84f63'].map(c=>`<button class="n53-color ${accent.toLowerCase()===c?'on':''}" data-accent="${c}" style="--c:${c}" title="${c}"></button>`).join('')}</div></div></div>
      <div class="n53-card"><h2>Navegación</h2><p>Controles esenciales del navegador.</p><div class="n53-row"><div><b>Motor de búsqueda</b><span>Usado por la barra y Nueva pestaña.</span></div><select id="n53-search" class="fld" style="min-width:180px"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select></div></div>
      <div class="n53-card"><h2>Privacidad</h2><p>Protección integrada de Nova.</p><div class="n53-row"><div><b>Bloqueador de anuncios y rastreadores</b><span>Se aplica a la sesión web persistente.</span></div><button class="btn ${S.adblock?'on':''}" id="n53-adblock">${S.adblock?'Activo':'Inactivo'}</button></div></div>
      <div class="n53-card"><h2>Experiencia</h2><div class="n53-row"><div><b>Animaciones de Nova</b><span>Microanimaciones rápidas y suaves.</span></div><button class="btn ${S.anim!==false?'on':''}" id="n53-anim">${S.anim!==false?'Activas':'Desactivadas'}</button></div><div class="n53-row"><div><b>Abrir enlaces en nueva pestaña</b><span>Preferencia para enlaces compatibles.</span></div><button class="btn ${S.newTabLinks?'on':''}" id="n53-newlinks">${S.newTabLinks?'Activo':'Inactivo'}</button></div></div>
      <div class="n53-card"><h2>Herramientas</h2><div class="n53-row"><div><b>Workspaces</b><span>Contextos guardados de pestañas.</span></div><button class="btn" id="n53-work">Abrir</button></div><div class="n53-row"><div><b>Extensiones</b><span>Extension Center y extensiones Chromium reales.</span></div><button class="btn" id="n53-ext">Abrir</button></div><div class="n53-row"><div><b>Rendimiento</b><span>Memoria, CPU y ahorro.</span></div><button class="btn" id="n53-perf">Abrir</button></div></div>
      <div class="n53-card"><h2>Ayuda y versión</h2><div class="n53-row"><div><b>Repetir guía de inicio</b><span>La guía siempre está disponible.</span></div><button class="btn" id="n53-guide">Abrir guía</button></div><div class="n53-row"><div><b>Qué hay de nuevo</b><span>Consulta las novedades de la versión.</span></div><button class="btn" id="n53-news">Ver novedades</button></div><div class="n53-row"><div><b>Versión</b><span>Nova Quantum 5.3.2 · Chromium</span></div><span style="color:var(--n53-accent);font-weight:700">${esc(typeof NOVA_VER!=='undefined'?NOVA_VER:'5.3.2')}</span></div></div>
      </section></div></div>`;
    $('#n53-search').value=S.search||'https://duckduckgo.com/?q=';
    r.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
    r.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>setAccent(b.dataset.accent));
    $('#n53-search').onchange=e=>{S.search=e.target.value;window.save?.();try{refreshNT?.()}catch{}};
    $('#n53-adblock').onclick=async()=>{S.adblock=!S.adblock;await ipc.invoke('adblock',S.adblock).catch(()=>{});window.save?.();renderSettings()};
    $('#n53-anim').onclick=()=>{S.anim=S.anim===false;window.save?.();applyMode();renderSettings()};
    $('#n53-newlinks').onclick=()=>{S.newTabLinks=!S.newTabLinks;window.save?.();renderSettings()};
    $('#n53-work').onclick=()=>route('workspaces44'); $('#n53-ext').onclick=()=>route('extensioncenter53'); $('#n53-perf').onclick=()=>route('rendimiento44');
    $('#n53-guide').onclick=()=>route('guide53'); $('#n53-news').onclick=()=>route('whatsnew53');
    if(typeof old==='function'){} // intentionally unused: route is handled by NOVA router
  }

  // Keep old routing targets for compatibility, but make the actual Quantum settings page canonical.
  try {
    const N = window.NOVA || {};
    if(N.PG) N.PG.quantumsettings = renderSettings;
  } catch {}

  const removeLegacyUi = () => {
    document.querySelectorAll('#nova20-wsbtn,#nova20-studybtn,.nova20-studybtn').forEach(e=>e.remove());
    document.querySelectorAll('#top button').forEach(b=>{const t=(b.textContent||'').trim().toLowerCase();if(t==='general'||t==='estudio'||t.includes('nova study'))b.remove()});
    document.querySelectorAll('.nova20-wi').forEach(e=>{if(/general|estudio/i.test(e.textContent||''))e.remove()});
    document.querySelectorAll('.th,[data-t]').forEach(e=>e.classList.add('q-hidden'));
  };

  const init = () => {
    installUi(); applyMode(); rebuildTop(); rebuildSide(); removeLegacyUi();
    setTimeout(()=>{rebuildTop();rebuildSide();removeLegacyUi();applyMode()},180);
    setTimeout(()=>{removeLegacyUi();refreshPins()},700);
    const mm=matchMedia('(prefers-color-scheme:dark)'); mm.addEventListener?.('change',()=>{if(mode()==='system')applyMode()});
    if(typeof refreshPins==='function') setInterval(refreshPins,4000);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();

  // Intercept the legacy settings route after all older modules are loaded.
  setTimeout(()=>{try{if(window.NOVA?.PG){window.NOVA.PG.quantumsettings=renderSettings} }catch{}},100);
})();
