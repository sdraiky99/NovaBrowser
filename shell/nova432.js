/* Nova 4.3.2 — Hotfix Glass Clean. Aditivo sobre la shell estable; no reemplaza index.html. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const q = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save432 = () => { try { window.save?.(); N.save?.(); } catch {} };
  const toast432 = msg => { try { toast(String(msg)); } catch { const d=document.createElement('div'); d.textContent=String(msg); d.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;padding:9px 14px;border:1px solid var(--bd);border-radius:12px;background:rgba(24,27,34,.92);color:#fff;box-shadow:0 12px 40px #0007;backdrop-filter:blur(14px)';document.body.appendChild(d);setTimeout(()=>d.remove(),2200); } };

  S.nova432 = Object.assign({ pinnedSites: [], eco: false, uiVersion: 1 }, S.nova432 || {});
  if (!Array.isArray(S.nova432.pinnedSites)) S.nova432.pinnedSites = [];
  S.nova432.pinnedSites = S.nova432.pinnedSites.filter(x => x && /^https?:\/\//i.test(String(x.u || ''))).slice(0, 8);

  /* -------- Visual layer: Glass Clean, independent of the old theme engine. -------- */
  if (!document.getElementById('nova432-style')) {
    const st = document.createElement('style');
    st.id = 'nova432-style';
    st.textContent = `
      body.nova432-glass{
        --nova432-font:"Inter","Segoe UI Variable","Segoe UI",system-ui,sans-serif;
        --nova432-bg:#101217;--nova432-bg2:#171a21;--nova432-fg:#f3f5f8;--nova432-mut:#9ba3af;
        --nova432-accent:#6d95ff;--nova432-border:rgba(255,255,255,.10);--nova432-surface:rgba(24,27,34,.76);
        --nova432-surface2:rgba(32,36,45,.66);--nova432-shadow:0 18px 56px rgba(0,0,0,.28);--nova432-radius:12px;
        font-family:var(--nova432-font)!important;
        background:radial-gradient(900px 500px at 85% -10%,rgba(109,149,255,.10),transparent 64%),var(--nova432-bg)!important;
      }
      body.nova432-glass.t-light{
        --nova432-bg:#f4f6f9;--nova432-bg2:#edf0f4;--nova432-fg:#1d232b;--nova432-mut:#68717d;
        --nova432-accent:#416fe0;--nova432-border:rgba(18,25,38,.10);--nova432-surface:rgba(255,255,255,.76);--nova432-surface2:rgba(255,255,255,.68);
        background:radial-gradient(900px 500px at 85% -10%,rgba(65,111,224,.08),transparent 64%),var(--nova432-bg)!important;
      }
      body.nova432-glass #top{
        height:42px;padding-left:8px;background:var(--nova432-surface)!important;border-bottom:1px solid var(--nova432-border)!important;
        backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);box-shadow:0 6px 20px rgba(0,0,0,.06);
      }
      body.nova432-glass #brand{font-family:var(--nova432-font)!important;font-weight:650;letter-spacing:-.01em;padding-bottom:8px}
      body.nova432-glass #brand img{width:19px;height:19px;border-radius:5px;box-shadow:0 1px 8px rgba(0,0,0,.14)}
      body.nova432-glass #tabs{gap:4px;padding:4px 4px 0 2px;align-items:flex-end}
      body.nova432-glass .tab{height:32px;max-width:230px;min-width:78px;border:1px solid transparent!important;border-radius:11px 11px 0 0!important;background:transparent!important;color:var(--nova432-mut)!important;transition:background-color .14s ease,border-color .14s ease,color .14s ease,transform .14s ease!important}
      body.nova432-glass .tab.on{background:var(--nova432-surface2)!important;border-color:var(--nova432-border)!important;color:var(--nova432-fg)!important;box-shadow:0 4px 16px rgba(0,0,0,.10),inset 0 1px rgba(255,255,255,.05)}
      body.nova432-glass .tab:not(.on):hover{background:rgba(127,140,165,.10)!important;color:var(--nova432-fg)!important}
      body.nova432-glass .tab img{width:15px;height:15px;border-radius:4px}
      body.nova432-glass #bar{gap:7px;padding:7px 10px;background:var(--nova432-surface)!important;border-top:1px solid var(--nova432-border);border-bottom:1px solid var(--nova432-border)!important;backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%)}
      body.nova432-glass .ib,body.nova432-glass .btn,body.nova432-glass .fld{font-family:var(--nova432-font)!important}
      body.nova432-glass .ib{width:31px;height:31px;border-radius:10px!important;color:var(--nova432-fg);transition:transform .14s ease,background-color .14s ease,color .14s ease,box-shadow .14s ease!important}
      body.nova432-glass .ib:hover{background:rgba(127,140,165,.10)!important}
      body.nova432-glass .ib:active{transform:scale(.96)}
      body.nova432-glass #addr{height:34px;padding:0 16px;background:rgba(127,140,165,.08)!important;border:1px solid transparent!important;border-radius:17px!important;box-shadow:inset 0 1px rgba(255,255,255,.04)!important}
      body.nova432-glass #addr:focus{border-color:rgba(109,149,255,.45)!important;box-shadow:0 0 0 4px rgba(109,149,255,.13),inset 0 1px rgba(255,255,255,.06)!important}
      body.nova432-glass #side{width:54px;background:rgba(18,21,27,.62)!important;border-right:1px solid var(--nova432-border)!important;padding:9px 5px;gap:7px;backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%)}
      body.nova432-glass.t-light #side{background:rgba(250,251,253,.66)!important}
      body.nova432-glass #side .ib{width:40px;height:40px;border-radius:12px!important}
      body.nova432-glass #side .ib.on{background:rgba(109,149,255,.12)!important;color:var(--nova432-accent)!important;box-shadow:inset 0 0 0 1px rgba(109,149,255,.08)}
      body.nova432-glass #panel{background:var(--nova432-surface)!important;border-left:1px solid var(--nova432-border)!important;backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%);box-shadow:-18px 0 45px rgba(0,0,0,.12)}
      body.nova432-glass #panel.open{width:340px}
      body.nova432-glass .btn{background:rgba(127,140,165,.07)!important;border-color:var(--nova432-border)!important;border-radius:10px!important;transition:background-color .14s ease,border-color .14s ease,color .14s ease,transform .14s ease!important}
      body.nova432-glass .btn:hover,body.nova432-glass .btn.on{background:rgba(109,149,255,.10)!important;border-color:rgba(109,149,255,.32)!important;color:var(--nova432-accent)!important}
      body.nova432-glass .fld{background:rgba(127,140,165,.07)!important;border-color:var(--nova432-border)!important;border-radius:10px!important}
      body.nova432-glass #nova22-top-pop,body.nova432-glass #nova22-zoom-pop,body.nova432-glass #nova22-webctx,body.nova432-glass #nova22-profile-fallback,body.nova432-glass #mnp{
        background:rgba(24,27,34,.88)!important;border-color:var(--nova432-border)!important;border-radius:14px!important;box-shadow:0 24px 80px rgba(0,0,0,.28)!important;backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%)}
      body.nova432-glass.t-light #nova22-top-pop,body.nova432-glass.t-light #nova22-zoom-pop,body.nova432-glass.t-light #nova22-webctx,body.nova432-glass.t-light #nova22-profile-fallback,body.nova432-glass.t-light #mnp{background:rgba(255,255,255,.88)!important}
      body.nova432-glass #nova22-top-pop .nova22-menuitem,body.nova432-glass .nova22-ctxitem,body.nova432-glass #mnp button{border-radius:10px!important}
      body.nova432-glass #nova22-top-pop .nova22-menuitem:hover,body.nova432-glass .nova22-ctxitem:hover,body.nova432-glass #mnp button:hover{background:rgba(109,149,255,.10)!important}
      body.nova432-glass .nova432-pinwrap{position:relative;width:40px;height:40px}
      body.nova432-glass .nova432-pin{width:40px;height:40px;border:1px solid transparent;background:transparent;color:var(--nova432-fg);border-radius:12px;display:grid;place-items:center;padding:0;cursor:pointer;position:relative;transition:transform .14s ease,background-color .14s ease,border-color .14s ease}
      body.nova432-glass .nova432-pin:hover{background:rgba(127,140,165,.10);border-color:var(--nova432-border);transform:translateY(-1px)}
      body.nova432-glass .nova432-pin img{width:20px;height:20px;border-radius:5px;object-fit:cover}
      body.nova432-glass .nova432-sep{width:28px;height:1px;background:var(--nova432-border);margin:2px 0 3px}
      body.nova432-glass .nova432-energy{margin-top:auto}
      body.nova432-glass .nova432-energy.on{color:#5fd58c!important;background:rgba(95,213,140,.11)!important}
      body.nova432-glass .nova432-pin-remove{position:absolute;right:-2px;top:-2px;width:15px;height:15px;border-radius:50%;border:1px solid var(--nova432-border);background:rgba(20,23,29,.92);color:#fff;font-size:10px;line-height:13px;display:none;padding:0}
      body.nova432-glass .nova432-pin:hover .nova432-pin-remove{display:block}
      body.nova432-glass .th{display:none!important}
      body.nova432-glass .nova432-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.06);color:var(--nova432-mut);font-size:12px}
      body.nova432-glass .nova432-card{padding:13px 14px;border-radius:15px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.05);box-shadow:0 14px 42px rgba(0,0,0,.06)}
      @keyframes nova432-in{from{opacity:0;transform:translateY(4px) scale(.985)}to{opacity:1;transform:none}}
      body.nova432-glass #panel.open{animation:nova432-in .16s ease-out}
      body.nova432-glass .nova432-pin{animation:nova432-in .16s ease-out}
      body.noanim .nova432-pin,body.noanim #panel.open{animation:none!important}
      @media(prefers-reduced-motion:reduce){body.nova432-glass #panel.open,body.nova432-glass .nova432-pin{animation:none!important}}
    `;
    document.head.appendChild(st);
  }

  const baseApplyTheme432 = typeof applyTheme === 'function' ? applyTheme : null;
  if (baseApplyTheme432 && !window.__nova432ApplyWrapped) {
    window.__nova432ApplyWrapped = true;
    applyTheme = function() {
      baseApplyTheme432();
      document.body.classList.add('nova432-glass');
      const b = document.body.style;
      b.setProperty('--font','"Inter","Segoe UI Variable","Segoe UI",system-ui,sans-serif');
      b.setProperty('--fs','13px');
      b.setProperty('--r','11px');
    };
  }
  document.body.classList.add('nova432-glass');
  try { applyTheme?.(); } catch {}

  /* -------- Fijar sitios: favicons reales, separados de Favoritos. -------- */
  const faviconFallback = url => {
    try { return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=64`; } catch { return '../assets/icon.png'; }
  };
  const currentTab432 = () => {
    try { return N.activeWebTab?.() || N.currentWebTab?.() || cur; } catch { return cur; }
  };
  const title432 = t => { try { return String(t?.el?.querySelector('span')?.textContent || t?.wv?.getTitle?.() || t?.wv?.getURL?.() || 'Sitio'); } catch { return 'Sitio'; } };
  const url432 = t => { try { return String(t?.wv?.getURL?.() || ''); } catch { return ''; } };
  const persistPins432 = () => { S.nova432.pinnedSites = S.nova432.pinnedSites.slice(0,8); save432(); };
  const renderPins432 = () => {
    const side = q('#side'); if (!side) return;
    q('#nova432-pins')?.remove();
    const pins = document.createElement('div'); pins.id='nova432-pins'; pins.style.cssText='display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;margin-top:2px';
    S.nova432.pinnedSites.forEach((p, i) => {
      const wrap = document.createElement('div'); wrap.className='nova432-pinwrap';
      const b = document.createElement('button'); b.className='nova432-pin'; b.title=p.t || p.u; b.setAttribute('aria-label',`Abrir ${p.t || p.u}`);
      const img=document.createElement('img'); img.src=p.i && !String(p.i).endsWith('/assets/icon.png') ? p.i : faviconFallback(p.u); img.alt=''; img.onerror=()=>{if(img.src!=='../assets/icon.png')img.src='../assets/icon.png'};
      const rm=document.createElement('button'); rm.className='nova432-pin-remove';rm.type='button';rm.title='Quitar de fijados';rm.textContent='×';
      b.appendChild(img); wrap.append(b,rm); pins.appendChild(wrap);
      b.onclick=()=>{try{newTab(p.u)}catch{} };
      rm.onclick=e=>{e.stopPropagation();S.nova432.pinnedSites.splice(i,1);persistPins432();renderPins432();toast432('Sitio quitado de fijados');};
      b.oncontextmenu=e=>{e.preventDefault();rm.click()};
    });
    const anchor=q('#nova432-pin-anchor');
    if(anchor) anchor.replaceWith(pins); else side.appendChild(pins);
  };

  if(!q('#pinSite')){
    const b=document.createElement('button'); b.className='ib'; b.id='pinSite'; b.title='Fijar sitio en la barra lateral';
    b.innerHTML=(typeof ic==='function'?ic('pin'):'<svg viewBox="0 0 24 24"><path d="M12 17v5M7 4h10l-1 5 3 3H5l3-3z"/></svg>');
    const target=q('#st'); target?.after(b);
  }
  if(q('#pinSite') && !window.__nova432PinBound){
    window.__nova432PinBound=true;
    q('#pinSite').onclick=()=>{
      const t=currentTab432(), u=url432(t);
      if(!/^https?:\/\//i.test(u)){ toast432('Abre una página web para fijarla'); return; }
      if(S.nova432.pinnedSites.some(p=>p.u===u)){ toast432('Este sitio ya está fijado'); return; }
      const img=t?.el?.querySelector?.('img')?.src || faviconFallback(u);
      S.nova432.pinnedSites.unshift({u,t:title432(t),i:img,createdAt:Date.now()});
      persistPins432(); renderPins432(); toast432('Sitio fijado en la barra lateral');
    };
  }

  const attachFaviconWatcher432 = t => {
    if(!t?.wv || t._nova432Fav) return; t._nova432Fav=true;
    t.wv.addEventListener('page-favicon-updated', e=>{
      const f=e.favicons?.[0]; if(!f) return;
      try { const img=t.el?.querySelector('img'); if(img) img.src=f; } catch {}
      try {
        const u=url432(t), p=S.nova432.pinnedSites.find(x=>x.u===u);
        if(p){ p.i=f; p.t=title432(t); persistPins432(); renderPins432(); }
      } catch {}
    });
  };
  try { (tabs || []).forEach(attachFaviconWatcher432); } catch {}

  /* -------- Sidebar cleanup: remove wallpaper access from primary rail. -------- */
  const hideLegacyPrimary432 = () => {
    q('#side [data-p="walls"]')?.setAttribute('hidden','hidden');
    q('#side [data-p="walls"]')?.setAttribute('aria-hidden','true');
  };
  hideLegacyPrimary432();

  /* Insert pinned rail just before the auto-margin bottom area when possible. */
  const ensurePinAnchor432 = () => {
    const side=q('#side'); if(!side)return;
    if(!q('#nova432-pin-anchor')){
      const a=document.createElement('div'); a.id='nova432-pin-anchor'; a.style.display='none';
      side.appendChild(a);
    }
    renderPins432();
  };
  ensurePinAnchor432();

  /* -------- Ahorro de energía -------- */
  const energyBtnId='nova432-energy-btn';
  const ecoIcon = typeof ic === 'function' ? ic('leaf') : '<svg viewBox="0 0 24 24"><path d="M19 4C9 4 5 9 5 14c0 3 2 5 5 5 5 0 9-5 9-15Z"/><path d="M5 19c2-5 6-8 10-10"/></svg>';
  const setEco432 = async on => {
    const next=!!on;
    try { const ok=await ipc.invoke('performance-mode',next); if(!ok){toast432('No se pudo activar el ahorro de energía');return;} } catch { toast432('No se pudo activar el ahorro de energía');return; }
    S.nova432.eco=next; S.memSave=next; save432();
    try {
      (tabs || []).forEach(t => {
        if (t === currentTab432() || !t?.wv?.executeJavaScript) return;
        const code = next
          ? `(()=>{let s=document.getElementById('__nova432_eco');if(!s){s=document.createElement('style');s.id='__nova432_eco';s.textContent='*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(s)}})()`
          : `document.getElementById('__nova432_eco')?.remove()`;
        t.wv.executeJavaScript(code).catch(() => {});
      });
    } catch {}
    refreshEnergy432();
    toast432(next?'Ahorro de energía activado':'Ahorro de energía desactivado');
  };
  const refreshEnergy432 = () => {
    const b=q('#'+energyBtnId); if(b){ b.classList.toggle('on',!!S.nova432.eco);b.classList.toggle('nova432-energy',true);b.title=S.nova432.eco?'Ahorro de energía activado':'Ahorro de energía';b.setAttribute('aria-pressed',String(!!S.nova432.eco)); }
    const s=q('#nova432-energy-sw'); if(s){s.classList.toggle('on',!!S.nova432.eco);s.textContent=S.nova432.eco?'Activado':'Desactivado';}
  };
  if(!q('#'+energyBtnId)){
    const b=document.createElement('button'); b.className='ib nova432-energy';b.id=energyBtnId;b.innerHTML=ecoIcon;b.title='Ahorro de energía';b.setAttribute('aria-pressed','false');
    q('#side')?.appendChild(b);
    b.onclick=()=>setEco432(!S.nova432.eco);
  }
  refreshEnergy432();
  if (S.nova432.eco) setTimeout(() => { ipc.invoke('performance-mode', true).catch(() => {}); }, 150);

  /* -------- Ajustes: card simple, sin tocar la estructura existente. -------- */
  if(N.PG?.ajustes && !window.__nova432SettingsWrapped){
    window.__nova432SettingsWrapped=true;
    const baseSettings432=N.PG.ajustes;
    N.PG.ajustes=function(r){
      baseSettings432(r);
      const host=r; if(!host || host.querySelector('#nova432-hotfix-card'))return;
      const oldThemeCards=host.querySelectorAll('.th'); oldThemeCards.forEach(x=>{x.setAttribute('hidden','hidden');x.setAttribute('aria-hidden','true');const g=x.parentElement;if(g&&g.classList.contains('grid')){const prev=g.previousElementSibling;if(prev&&/tema/i.test(prev.textContent||'')){prev.setAttribute('hidden','hidden');}}});
      const card=document.createElement('div'); card.id='nova432-hotfix-card'; card.className='nova432-card'; card.style.marginTop='14px';
      card.innerHTML=`<div class="row"><div><h3 style="margin:0">Nova Glass Clean</h3><span class="mut">Interfaz limpia con transparencia moderada y animaciones sutiles.</span></div><span class="nova432-chip">4.3.2</span></div><div class="row" style="margin-top:10px"><div><b>Ahorro de energía</b><div class="mut">Reduce trabajo visual y usa el modo de rendimiento de Nova.</div></div><button class="btn" id="nova432-energy-sw">${S.nova432.eco?'Activado':'Desactivado'}</button></div><div class="mut" style="margin-top:9px">No cierra pestañas ni borra datos. Se conserva el perfil actual.</div>`;
      host.appendChild(card);
      card.querySelector('#nova432-energy-sw').onclick=async()=>{await setEco432(!S.nova432.eco);N.PG.ajustes(r);};
    };
  }

  /* -------- Runtime UI audit -------- */
  window.NovaUIAudit432=()=>{
    const core=['bk','fw','rl','st','sh','nt'];
    const present=core.filter(id=>q('#'+id));
    const missing=core.filter(id=>!q('#'+id));
    const coreNoHandler=core.filter(id=>{const el=q('#'+id);return el && typeof el.onclick!=='function'});
    const topNoHandler=[...document.querySelectorAll('#nova22-top-tools .nova22-topbtn')].filter(el=>typeof el.onclick!=='function').map(el=>el.id||el.textContent.trim());
    const sideUnroutable=[...document.querySelectorAll('#side .ib')].filter(el=>!el.hasAttribute('data-p')&&!el.hasAttribute('data-page')&&el.id!=='pinSite'&&el.id!=='nova432-energy-btn').map(el=>el.id||el.title||'side-button');
    const activeScripts=[...document.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'));
    const result={
      ok:missing.length===0 && coreNoHandler.length===0 && topNoHandler.length===0 && sideUnroutable.length===0 && activeScripts.includes('nova432.js'),
      missing,coreNoHandler,topNoHandler,sideUnroutable,scriptLoaded:activeScripts.includes('nova432.js'),pinned:S.nova432.pinnedSites.length,eco:!!S.nova432.eco
    };
    if(!result.ok)console.warn('[Nova 4.3.2 UI audit]',result); else console.info('[Nova 4.3.2 UI audit] OK',result);
    return result;
  };

  /* Keep the new layer after future theme refreshes and newly created tabs. */
  try { const poll=setInterval(()=>{document.body.classList.add('nova432-glass');hideLegacyPrimary432();renderPins432();(tabs||[]).forEach(attachFaviconWatcher432);refreshEnergy432();},4000); window.addEventListener('beforeunload',()=>clearInterval(poll)); } catch {}
  setTimeout(()=>window.NovaUIAudit432(),250);
})();
