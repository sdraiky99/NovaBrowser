/* Nova 5.0.0 Quantum Prime
 * Additive UX layer: keeps the proven 4.4.1 browser core and replaces only the visible shell presentation.
 */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const toast = msg => {
    let t = $('#q-toast');
    if (!t) { t = document.createElement('div'); t.id = 'q-toast'; document.body.appendChild(t); }
    t.textContent = String(msg || ''); t.classList.add('on');
    clearTimeout(t.__timer); t.__timer = setTimeout(() => t.classList.remove('on'), 1900);
  };
  const iconPaths = {
    home:'M4 10.5 12 4l8 6.5M6.5 9.5V20h11V9.5M9.5 20v-6h5v6',
    star:'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z',
    work:'M4 7h6l2 2h8v10H4zM4 7V5h6l2 2',
    dl:'M12 4v10M8 11l4 4 4-4M5 20h14',
    ext:'M8 4h3v3h2V4h3v3h4v4h-3v2h3v3h-4v4h-3v-3h-2v3H8v-4H4v-3h3v-2H4V7h4z',
    speed:'M4 14a8 8 0 1 1 16 0M12 14l4-4M12 14h.01',
    settings:'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    history:'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 5v4h4M12 7v5l3 2',
    puzzle:'M7 5h3V3h4v2h3v3h2v4h-2v3h-3v2h-4v-2H7v-3H5V8h2z',
    capture:'M4 8h4l2-3h4l2 3h6v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    search:'M10.7 18.2a7.5 7.5 0 1 1 5.3-2.2L21 21M10.7 15.2a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9',
    info:'M12 10v7M12 7.2v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    menu:'M5 7h14M5 12h14M5 17h14'
  };
  const ico = key => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[key] || iconPaths.info}"/></svg>`;

  const appearanceClass = () => {
    let mode = 'system';
    try { mode = String(S.quantumAppearance || 'system'); } catch {}
    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('q-dark', !!dark);
    document.body.classList.toggle('q-light', !dark);
    document.body.classList.add('quantum-prime');
  };
  const save = () => { try { window.save?.(); } catch {} try { N.save?.(); } catch {} };
  const applyPrimeAppearance = () => { appearanceClass(); };

  // Keep the legacy preference keys readable, but never expose the old theme system in Quantum Prime.
  try {
    if (!S.quantumAppearance) { S.quantumAppearance = 'system'; save(); }
  } catch {}

  if (typeof applyTheme === 'function' && !window.__nova50ApplyThemeWrapped) {
    const baseApplyTheme = applyTheme;
    applyTheme = function quantumApplyTheme() { baseApplyTheme.apply(this, arguments); applyPrimeAppearance(); };
    window.__nova50ApplyThemeWrapped = true;
  }

  const oldResolvePrime = N.resolveFeatureRoute;
  N.resolveFeatureRoute = x => {
    const raw = String(x || '').replace(/^nova:\/\//i, '').split(/[/?#]/)[0].toLowerCase();
    if (raw === 'quantumsettings' || raw === 'prime-settings') return 'quantumsettings';
    return oldResolvePrime ? oldResolvePrime(x) : String(x || '');
  };
  if (N.PG) {
    N.PG.quantumsettings = r => {
      const mode = (() => { try { return String(S.quantumAppearance || 'system'); } catch { return 'system'; } })();
      r.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px;max-width:880px;margin:0 auto;padding-bottom:28px">
        <div style="padding:22px;border:1px solid var(--q-border);border-radius:20px;background:var(--q-surface)"><div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--q-accent);font-weight:800">QUANTUM PRIME</div><h2 style="margin:6px 0 5px;font-size:28px">Ajustes</h2><div class="mut">Lo esencial de Nova, sin opciones que no vayas a usar.</div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Apariencia</div><div class="q-menu-sub" style="margin-bottom:10px">Tres estados simples. Los temas antiguos no forman parte de Quantum Prime.</div><div class="q-theme-row"><button data-qset-theme="system">Sistema</button><button data-qset-theme="light">Claro</button><button data-qset-theme="dark">Oscuro</button></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Privacidad</div><div class="q-menu-sub">El bloqueador se controla desde un único sitio.</div><div class="row" style="margin-top:12px"><span>Bloqueador de anuncios</span><div class="sw ${S.adblock ? 'on' : ''}" id="qset-adblock"></div></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Interfaz</div><div class="q-menu-sub">Animaciones cortas y accesibles.</div><div class="row" style="margin-top:12px"><span>Animaciones de Nova</span><div class="sw ${S.anim !== false ? 'on' : ''}" id="qset-anim"></div></div></div>
        <div class="q-menu-head" style="border:1px solid var(--q-border);border-radius:16px;background:var(--q-surface)"><div class="q-menu-title">Rendimiento y energía</div><div class="q-menu-sub">Los controles avanzados se mantienen en sus paneles dedicados.</div><div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap"><button class="btn on" id="qset-perf">Abrir Rendimiento</button><button class="btn" id="qset-ext">Abrir Extensiones</button><button class="btn" id="qset-work">Abrir Workspaces</button></div></div>
        <div class="mut">Nova ${typeof NOVA_VER !== 'undefined' ? NOVA_VER : '5.0.0'} · Chromium · Quantum Prime</div>
      </div>`;
      r.querySelectorAll('[data-qset-theme]').forEach(b => { b.classList.toggle('on', b.dataset.qsetTheme === mode); b.onclick = () => { setAppearance(b.dataset.qsetTheme); N.PG.quantumsettings(r); }; });
      r.querySelector('#qset-adblock').onclick = async () => { S.adblock = !S.adblock; await ipc.invoke('adblock', S.adblock).catch(() => {}); save(); N.PG.quantumsettings(r); };
      r.querySelector('#qset-anim').onclick = () => { S.anim = S.anim === false; save(); try { applyTheme(); } catch {} N.PG.quantumsettings(r); };
      r.querySelector('#qset-perf').onclick = () => goFeature('rendimiento44');
      r.querySelector('#qset-ext').onclick = () => goFeature('extensiones44');
      r.querySelector('#qset-work').onclick = () => goFeature('workspaces44');
    };
  }
  const goFeature = route => { try { return typeof newTab === 'function' ? newTab('nova://' + route) : N.openFeature?.(route); } catch { toast('Esta función no está disponible'); return null; } };
  const openHome = () => { try { newTab(); } catch { toast('No se pudo abrir una pestaña nueva'); } };
  const openFavorites = () => { try { panel = panel === 'marks' ? null : 'marks'; draw(); } catch { toast('No se pudo abrir Favoritos'); } };
  const capture = () => { try { $('#sh')?.click(); } catch { toast('Captura no disponible'); } };
  const findInPage = () => { try { key('f'); } catch { $('#fi')?.focus(); } };

  function buildMenu() {
    if ($('#q-menu')) return;
    const bar = $('#bar'); if (!bar) return;
    const btn = document.createElement('button'); btn.id='q-menu-btn'; btn.type='button'; btn.title='Menú de Nova'; btn.setAttribute('aria-label','Menú de Nova'); btn.innerHTML=ico('menu');
    const sh = $('#sh'); if (sh?.parentNode) sh.parentNode.insertBefore(btn, sh.nextSibling); else bar.appendChild(btn);

    const menu = document.createElement('div'); menu.id='q-menu'; menu.setAttribute('role','menu');
    menu.innerHTML = `
      <div class="q-menu-head"><div class="q-menu-title">Nova Quantum</div><div class="q-menu-sub">Acciones esenciales, sin ruido</div></div>
      <button class="q-menu-item" data-qaction="new">${ico('home')}<span>Nueva pestaña</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+T</span></button>
      <button class="q-menu-item" data-qaction="favorites">${ico('star')}<span>Favoritos</span></button>
      <button class="q-menu-item" data-qaction="history">${ico('history')}<span>Historial</span></button>
      <button class="q-menu-item" data-qaction="downloads">${ico('dl')}<span>Descargas</span></button>
      <div class="q-menu-sep"></div>
      <button class="q-menu-item" data-qaction="workspaces">${ico('work')}<span>Workspaces</span></button>
      <button class="q-menu-item" data-qaction="extensions">${ico('puzzle')}<span>Extensiones</span></button>
      <button class="q-menu-item" data-qaction="performance">${ico('speed')}<span>Rendimiento</span></button>
      <div class="q-menu-sep"></div>
      <button class="q-menu-item" data-qaction="capture">${ico('capture')}<span>Capturar página</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+Shift+S</span></button>
      <button class="q-menu-item" data-qaction="find">${ico('search')}<span>Buscar en la página</span><span style="margin-left:auto;color:var(--q-muted);font-size:10px">Ctrl+F</span></button>
      <button class="q-menu-item" data-qaction="settings">${ico('settings')}<span>Ajustes</span></button>
      <div class="q-menu-sep"></div>
      <div class="q-theme"><div class="q-theme-label">Apariencia</div><div class="q-theme-row">
        <button data-qtheme="system">Sistema</button><button data-qtheme="light">Claro</button><button data-qtheme="dark">Oscuro</button>
      </div></div>`;
    document.body.appendChild(menu);
    const toggle = () => menu.classList.toggle('on');
    btn.onclick = e => { e.stopPropagation(); toggle(); syncThemeButtons(); };
    menu.onclick = e => e.stopPropagation();
    document.addEventListener('click', () => menu.classList.remove('on'), true);
    document.addEventListener('keydown', e => { if (e.key==='Escape') menu.classList.remove('on'); if (e.ctrlKey && e.shiftKey && !e.altKey && String(e.key).toLowerCase()==='s') { e.preventDefault(); capture(); } });
    menu.querySelectorAll('[data-qaction]').forEach(b => b.addEventListener('click', () => {
      menu.classList.remove('on');
      const a=b.dataset.qaction;
      if(a==='new')openHome(); else if(a==='favorites')openFavorites(); else if(a==='history')goFeature('historial'); else if(a==='downloads')goFeature('descargas2');
      else if(a==='workspaces')goFeature('workspaces44'); else if(a==='extensions')goFeature('extensiones44'); else if(a==='performance')goFeature('rendimiento44');
      else if(a==='capture')capture(); else if(a==='find')findInPage(); else if(a==='settings')goFeature('quantumsettings');
    }));
    menu.querySelectorAll('[data-qtheme]').forEach(b => b.addEventListener('click', () => { setAppearance(b.dataset.qtheme); }));
    syncThemeButtons();
  }
  function syncThemeButtons() {
    const mode = (()=>{try{return String(S.quantumAppearance||'system')}catch{return 'system'}})();
    document.querySelectorAll('[data-qtheme]').forEach(b=>b.classList.toggle('on',b.dataset.qtheme===mode));
  }
  function setAppearance(mode) {
    if(!['system','light','dark'].includes(mode)) mode='system';
    try { S.quantumAppearance=mode; save(); } catch {}
    appearanceClass(); syncThemeButtons();
    try { refreshNT(); } catch {}
    toast(mode==='system'?'Apariencia: sistema':mode==='light'?'Apariencia: claro':'Apariencia: oscuro');
  }
  window.quantumSetAppearance=setAppearance;

  function buildBrand() {
    const brand=$('#brand'); if(!brand) return;
    brand.innerHTML='<img src="../assets/logo/nova-quantum.svg" alt="Nova" aria-hidden="true"><span>NOVA</span>';
    brand.title='Nova Quantum Prime';
  }

  function buildSidebar() {
    const side=$('#side'); if(!side) return;
    side.innerHTML = `
      <button class="q-side-btn" data-qside="home" title="Inicio" aria-label="Inicio">${ico('home')}</button>
      <div class="q-pin-list" id="q-pin-list" aria-label="Sitios fijados"></div>
      <button class="q-side-btn" data-qside="favorites" title="Favoritos" aria-label="Favoritos">${ico('star')}</button>
      <button class="q-side-btn" data-qside="workspaces" title="Workspaces" aria-label="Workspaces">${ico('work')}</button>
      <button class="q-side-btn" data-qside="downloads" title="Descargas" aria-label="Descargas">${ico('dl')}</button>
      <button class="q-side-btn" data-qside="extensions" title="Extensiones" aria-label="Extensiones">${ico('puzzle')}</button>
      <button class="q-side-btn" data-qside="performance" title="Rendimiento" aria-label="Rendimiento">${ico('speed')}</button>
      <span class="q-side-spacer"></span>
      <button class="q-side-btn" data-qside="settings" title="Ajustes" aria-label="Ajustes">${ico('settings')}</button>`;
    side.onclick = e => {
      const pinned=e.target.closest('[data-qpin-url]');
      if(pinned){ const u=pinned.dataset.qpinUrl; if(/^https?:/i.test(u)){try{newTab(u)}catch{}} return; }
      const b=e.target.closest('[data-qside]'); if(!b)return;
      const a=b.dataset.qside;
      side.querySelectorAll('.q-side-btn').forEach(x=>x.classList.remove('on')); b.classList.add('on');
      if(a==='home')openHome(); else if(a==='favorites')openFavorites(); else if(a==='workspaces')goFeature('workspaces44'); else if(a==='downloads')goFeature('descargas2'); else if(a==='extensions')goFeature('extensiones44'); else if(a==='performance')goFeature('rendimiento44'); else if(a==='settings')goFeature('quantumsettings');
    };
  }

  function refreshPinnedRail() {
    const host=$('#q-pin-list'); if(!host) return;
    let list=[];
    try { list = [...(Array.isArray(S.quick)?S.quick:[]), ...(Array.isArray(S.marks)?S.marks:[])].filter(x=>x&&/^https?:/i.test(String(x.u||''))).filter((x,i,a)=>a.findIndex(y=>y.u===x.u)===i).slice(0,4); } catch {}
    host.innerHTML = list.map((x,i)=>{ let hostName='Sitio'; try{hostName=new URL(x.u).hostname.replace(/^www\./,'')}catch{}; return `<button class="q-pin" data-qpin-url="${String(x.u).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" title="${String(x.t||hostName).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><img src="../assets/logo/nova-quantum.svg" alt=""></button>`; }).join('');
    list.forEach((x,i)=>{ try{ const img=host.querySelectorAll('.q-pin img')[i]; const u=new URL(x.u); if(img){img.src=u.origin+'/favicon.ico';img.onerror=()=>{img.onerror=null;img.src='../assets/logo/nova-quantum.svg';};} }catch{} });
  }
  window.refreshQuantumPins=refreshPinnedRail;

  function cleanLegacyVisibleControls() {
    // Do not delete old handlers or modules; only remove obsolete controls from the visible Prime shell.
    $('#nova22-top-tools')?.classList.add('q-hidden');
    $('#sh')?.classList.add('q-hidden');
    document.querySelectorAll('#side .ib:not(.q-side-btn)').forEach(x=>x.classList.add('q-hidden'));
    // The old theme chooser stays available internally for migration compatibility, but never in the Prime UI.
    document.querySelectorAll('.th').forEach(x=>x.classList.add('q-hidden'));
  }

  function wrapDraw() {
    if(typeof draw!=='function' || window.__nova50DrawWrapped) return;
    const baseDraw=draw;
    draw=function quantumDraw(){ baseDraw.apply(this,arguments); appearanceClass(); cleanLegacyVisibleControls(); };
    window.__nova50DrawWrapped=true;
  }

  // Safer visible behavior: the original newTab function stays untouched. We simply keep the plus button wired after UI rebuilds.
  function ensureNewTabButton() {
    const b=$('#nt'); if(!b) return;
    b.type='button'; b.title='Nueva pestaña (Ctrl+T)'; b.setAttribute('aria-label','Nueva pestaña');
    b.onclick = e => { e?.preventDefault?.(); try { newTab(); } catch { toast('No se pudo abrir la pestaña'); } };
    const tabsEl=$('#tabs'); if(tabsEl && tabsEl.lastElementChild!==b) tabsEl.appendChild(b);
  }

  const init = () => {
    appearanceClass(); buildBrand(); buildSidebar(); buildMenu(); cleanLegacyVisibleControls(); wrapDraw(); ensureNewTabButton(); refreshPinnedRail();
    const mm=window.matchMedia?.('(prefers-color-scheme: dark)');
    mm?.addEventListener?.('change',()=>{try{if(String(S.quantumAppearance||'system')==='system')appearanceClass()}catch{}});
    // Refresh the Prime presentation after older modules finish their setup.
    setTimeout(()=>{appearanceClass();buildSidebar();ensureNewTabButton();refreshPinnedRail();},120);
    setTimeout(()=>{cleanLegacyVisibleControls();refreshPinnedRail();},500);
    $('#st')?.addEventListener('click',()=>setTimeout(refreshPinnedRail,80));
    setInterval(refreshPinnedRail,3000);
  };

  try { document.addEventListener('DOMContentLoaded', init, {once:true}); } catch { init(); }
  if(document.readyState!=='loading') init();
})();
