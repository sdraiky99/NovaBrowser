/* Nova 4.3 — Glass Clean / Sidebar / Pinboard / Eco / UI audit. */
(() => {
  const { ipc } = NOVA_BRIDGE;
  const esc43 = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q = s => document.querySelector(s);
  const svg = (name, size=18) => window.NOVA_ICONS?.svg ? NOVA_ICONS.svg(name, size) : '';
  S.pinned = Array.isArray(S.pinned) ? S.pinned.filter(x => x && /^https?:\/\//i.test(x.u)) : [];
  S.eco = !!S.eco;
  S.appearance = S.theme || 'system';

  const faviconUrl = url => { try { const u = new URL(url); return u.origin + '/favicon.ico'; } catch { return '../assets/icon.png'; } };
  const titleFor = t => { try { return t?.el?.querySelector('span')?.textContent || new URL(t.wv.getURL()).hostname; } catch { return 'Sitio'; } };
  const currentTab = () => NOVA?.activeWebTab?.() || cur;

  /* -------- Glass Clean CSS -------- */
  const st = document.createElement('style');
  st.textContent = `
  #top{height:42px;padding:0 7px;align-items:flex-end;background:var(--bar);backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);border-bottom:1px solid var(--bd);box-shadow:0 1px 0 rgba(255,255,255,.025)}
  #brand{height:42px;padding:0 10px 0 4px;gap:8px;font-weight:650;letter-spacing:-.01em}.t-light #brand{color:#20252b}#brand img{width:19px;height:19px;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.18)}
  #tabs{align-items:flex-end;gap:3px;height:42px;padding-top:5px}.tab{height:34px;min-width:76px;max-width:240px;flex:0 1 220px;padding:0 9px;border:1px solid transparent!important;border-radius:11px 11px 7px 7px;background:transparent;color:var(--mut);transition:background .16s,border-color .16s,transform .16s,box-shadow .16s}.tab:hover{background:var(--glass);transform:translateY(-1px)}.tab.on{background:color-mix(in srgb,var(--bar) 88%,var(--bg));border-color:var(--bd)!important;color:var(--fg);box-shadow:0 8px 24px rgba(0,0,0,.10)}.tab img{width:15px;height:15px;border-radius:4px;object-fit:contain}.tab.ld::after{height:2px;background:linear-gradient(90deg,var(--acc2),var(--acc));box-shadow:0 0 8px color-mix(in srgb,var(--acc) 42%,transparent)}
  #tabs #nt{width:32px;height:32px;border-radius:10px;flex:0 0 32px;margin-right:2px}.ib{border-radius:9px;transition:background .14s,color .14s,transform .14s,box-shadow .14s}.ib:hover{background:color-mix(in srgb,var(--fg) 7%,transparent)}.ib:active{transform:scale(.95)}
  #bar{height:48px;padding:7px 10px;gap:5px;background:rgba(15,17,22,.72);backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);border-bottom:1px solid var(--bd)}
  body.t-light #bar{background:rgba(245,247,250,.72)}
  #addr{height:34px;border-radius:17px;padding:0 15px;background:var(--glass);border:1px solid var(--bd);box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 1px 10px rgba(0,0,0,.05);transition:background .15s,border-color .15s,box-shadow .15s,transform .15s}#addr:focus{background:color-mix(in srgb,var(--bar) 90%,var(--fg));border-color:color-mix(in srgb,var(--acc) 62%,var(--bd));box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 14%,transparent),0 8px 22px rgba(0,0,0,.08)}
  #mid{background:var(--bg)}#view{background:var(--bg)}#side{width:56px;padding:9px 7px;gap:5px;background:rgba(20,23,29,.60);backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);border-right:1px solid var(--bd)}body.t-light #side{background:rgba(248,250,252,.72)}
  #side .ib{width:42px;height:42px;color:var(--mut);border:1px solid transparent}#side .ib:hover{color:var(--fg);background:color-mix(in srgb,var(--fg) 7%,transparent)}#side .ib.on{color:var(--acc);background:color-mix(in srgb,var(--acc) 11%,transparent);border-color:color-mix(in srgb,var(--acc) 18%,transparent);box-shadow:inset 2px 0 0 var(--acc)}
  #side .ib svg{width:19px;height:19px}.n43-sep{height:1px;width:30px;margin:3px auto;background:var(--bd)}#side-pinned{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;overflow:auto;scrollbar-width:none}#side-pinned::-webkit-scrollbar{display:none}.n43-pin{width:42px;height:42px;padding:0;border:1px solid transparent;border-radius:11px;background:transparent;display:grid;place-items:center;cursor:pointer}.n43-pin:hover{background:color-mix(in srgb,var(--fg) 7%,transparent);transform:translateY(-1px)}.n43-pin img{width:20px;height:20px;border-radius:5px;object-fit:contain;box-shadow:0 2px 8px rgba(0,0,0,.12)}.n43-pin.fallback img{padding:2px}
  #eco-toggle.eco-on{color:#77d69c!important;background:rgba(83,190,125,.12)!important;border-color:rgba(83,190,125,.22)!important;box-shadow:inset 2px 0 0 #64cb8f}
  #panel{width:0;background:rgba(19,22,28,.76);backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);border-left:1px solid var(--bd);transition:width .20s cubic-bezier(.2,.8,.2,1)}body.t-light #panel{background:rgba(248,250,252,.82)}#panel.open{width:350px}#pin{width:350px;padding:16px;gap:10px}.btn,.fld,.li,.nova165-card,.nova25-card,.nx-card,.n40-card{border-radius:11px}.btn{background:color-mix(in srgb,var(--bar) 76%,var(--bg));border:1px solid var(--bd);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}.btn:hover,.btn.on{border-color:color-mix(in srgb,var(--acc) 55%,var(--bd));background:color-mix(in srgb,var(--acc) 9%,var(--bar));color:var(--acc)}.fld{background:color-mix(in srgb,var(--bar) 62%,var(--bg));border:1px solid var(--bd)}
  #nova43-pop{position:fixed;z-index:1200;right:10px;top:45px;display:none;min-width:260px;padding:7px;background:var(--bar);backdrop-filter:blur(20px);border:1px solid var(--bd);border-radius:13px;box-shadow:var(--shadow)}#nova43-pop.on{display:grid;animation:n43pop .15s ease-out}@keyframes n43pop{from{opacity:0;transform:translateY(-4px) scale(.98)}}
  .n43-menurow{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border:0;border-radius:9px;background:transparent;color:var(--fg);cursor:pointer;text-align:left}.n43-menurow:hover{background:color-mix(in srgb,var(--acc) 10%,transparent);color:var(--acc)}
  .n43-card{padding:13px;background:color-mix(in srgb,var(--bar) 76%,transparent);border:1px solid var(--bd);border-radius:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 8px 26px rgba(0,0,0,.06)}.n43-card h2,.n43-card h3{margin:0}.n43-muted{color:var(--mut);font-size:12px}.n43-actions{display:flex;gap:7px;flex-wrap:wrap}.n43-wide{width:100%}
  .n43-real-ext{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:10px;border:1px solid var(--bd);border-radius:12px;background:color-mix(in srgb,var(--bar) 78%,transparent)}.n43-exticon{width:38px;height:38px;border-radius:10px;object-fit:contain;background:rgba(255,255,255,.05);padding:6px}.n43-real-ext b{font-size:13px}.n43-real-ext span{display:block;color:var(--mut);font-size:11px;margin-top:2px}
  .n43-toggle{width:38px;height:22px;border-radius:999px;border:1px solid var(--bd);background:var(--bd);position:relative;cursor:pointer}.n43-toggle:after{content:"";position:absolute;width:16px;height:16px;left:2px;top:2px;border-radius:50%;background:#fff;transition:transform .15s}.n43-toggle.on{background:#5fca8b;border-color:#5fca8b}.n43-toggle.on:after{transform:translateX(16px)}
  `;
  document.head.appendChild(st);

  const renderPins = () => {
    let box = q('#side-pinned');
    if (!box) { box=document.createElement('div'); box.id='side-pinned'; const sep=document.createElement('div'); sep.className='n43-sep'; const side=q('#side'); side.appendChild(sep); side.appendChild(box); }
    box.innerHTML='';
    S.pinned.slice(0,8).forEach((p,i)=>{
      const b=document.createElement('button'); b.className='n43-pin'; b.title=p.t||p.u; b.dataset.i=i;
      const img=document.createElement('img'); img.src=p.i||faviconUrl(p.u); img.alt=''; img.onerror=()=>{ if(!b.classList.contains('fallback')){b.classList.add('fallback');img.src='../assets/icon.png';} };
      b.appendChild(img); box.appendChild(b);
      b.onclick=()=>newTab(p.u);
      b.oncontextmenu=e=>{e.preventDefault();S.pinned.splice(i,1);save();renderPins();toast('Quitado de la barra lateral');};
    });
  };

  const refreshEcoUI = () => { const b=q('#eco-toggle'); if(!b)return; b.classList.toggle('eco-on',S.eco); b.title=S.eco?'Ahorro de energía activado':'Ahorro de energía'; };
  const ecoScript = on => `(()=>{let s=document.getElementById('__nova43_eco');if(${on}){if(!s){s=document.createElement('style');s.id='__nova43_eco';s.textContent='*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(s)}}else if(s)s.remove()})()`;
  const applyEco = () => {
    let activeId=0; try{activeId=currentTab()?.wv?.getWebContentsId?.()||0}catch{}
    ipc.invoke('eco-mode',{enabled:S.eco,activeId}).catch(()=>{});
    tabs.forEach(t=>{try{t.wv.executeJavaScript(ecoScript(S.eco && t!==currentTab())).catch(()=>{})}catch{}});
    refreshEcoUI();
  };
  const setEco = on => { S.eco=!!on; save(); applyEco(); toast(S.eco?'Ahorro de energía activado':'Ahorro de energía desactivado'); };

  // Replace the original sidebar with a smaller, purpose-driven Opera-like dock.
  const side=q('#side');
  if(side){
    side.innerHTML = `<button class="ib" data-n43="home" title="Nueva pestaña">${svg('home')}</button>
      <button class="ib" data-n43="marks" title="Favoritos">${svg('bookmark')}</button>
      <button class="ib" data-n43="history" title="Historial">${svg('history')}</button>
      <button class="ib" data-n43="downloads" title="Descargas">${svg('downloads')}</button>
      <div class="n43-sep"></div>
      <button class="ib" data-n43="workspaces" title="Espacios de trabajo">${svg('grid')}</button>
      <button class="ib" data-n43="extensions" title="Extensiones">${svg('extension')}</button>
      <button class="ib" id="eco-toggle" data-n43="eco" title="Ahorro de energía">${svg('leaf')}</button>
      <button class="ib" data-n43="settings" title="Ajustes">${svg('settings')}</button>`;
    const clicker=a=>{
      if(a==='home')return newTab();
      if(a==='marks')return newTab('nova://marcadores');
      if(a==='history')return newTab('nova://historial');
      if(a==='downloads')return newTab('nova://descargas');
      if(a==='workspaces')return newTab('nova://workspaces');
      if(a==='extensions')return newTab('nova://extensiones');
      if(a==='settings')return newTab('nova://ajustes');
      if(a==='eco')return setEco(!S.eco);
    };
    side.addEventListener('click',e=>{const b=e.target.closest('[data-n43]');if(b)clicker(b.dataset.n43)}); side.dataset.n43Bound='1';
  }
  renderPins(); refreshEcoUI();
  // Clean up legacy emoji affordances in the top menu without removing the implemented actions.
  try {
    const iconMap = ['home','sparkle','grid','settings','bookmark','grid','leaf','shield','sparkle','rl'];
    document.querySelectorAll('#nova22-top-pop .nova22-menuitem').forEach((b,i) => { const first=b.querySelector('span'); if(first && svg(iconMap[i]||'info',15)) first.innerHTML=svg(iconMap[i]||'info',15); });
    const mainBtn=q('#nova22-main-btn'); if(mainBtn){mainBtn.innerHTML=svg('sparkle',15)+'<span>Nova</span>';}
    const profileBtn=q('#nova-profile-button'); if(profileBtn) profileBtn.textContent='';
  } catch {}


  // Real favicon pin button in the toolbar.
  if(!q('#pinSite')){
    const star=q('#st'), b=document.createElement('button'); b.className='ib'; b.id='pinSite'; b.title='Fijar en la barra lateral'; b.innerHTML=svg('pin'); star?.after(b);
  }
  q('#pinSite')?.addEventListener('click',()=>{
    const t=currentTab(); let u='';try{u=t.wv.getURL()}catch{}
    if(!/^https?:\/\//i.test(u))return toast('Abre una página web para fijarla');
    if(S.pinned.some(x=>x.u===u))return toast('Ya está fijada');
    S.pinned.unshift({u,t:titleFor(t),i:t.el?.querySelector('img')?.src||faviconUrl(u)});S.pinned=S.pinned.slice(0,8);save();renderPins();toast('Fijada en la barra lateral');
  });

  // Keep favicons current for pinned sites and tabs.
  const watchTab = t => {
    if(!t?.wv||t._n43fav)return; t._n43fav=1;
    t.wv.addEventListener('page-favicon-updated',e=>{const f=e.favicons?.[0];if(!f)return;try{t.el.querySelector('img').src=f}catch{};try{const u=t.wv.getURL(),p=S.pinned.find(x=>x.u===u);if(p){p.i=f;p.t=titleFor(t);save();renderPins()}}catch{}});
  };
  tabs.forEach(watchTab);
  const oldNewTab=NOVA.newTab||newTab;
  window.addEventListener('load',()=>tabs.forEach(watchTab));
  const timer=setInterval(()=>{tabs.forEach(watchTab);if(S.eco)applyEco();},4000);

  // Full settings: add a compact Eco card without breaking existing settings sections.
  if(window.PG?.ajustes){
    const base=PG.ajustes;
    PG.ajustes=function(r){base(r); if(!r.querySelector('#n43-eco-card')){const c=document.createElement('div');c.id='n43-eco-card';c.className='n43-card';c.style.marginTop='14px';c.innerHTML=`<div class="row"><div><b>Ahorro de energía</b><div class="n43-muted">Reduce trabajo en pestañas en segundo plano y anima menos contenido.</div></div><div class="n43-toggle ${S.eco?'on':''}" id="n43-eco-sw"></div></div>`;r.appendChild(c);c.querySelector('#n43-eco-sw').onclick=()=>{setEco(!S.eco);PG.ajustes(r)};}}
  }

  // Keep the old wallpaper route invisible from primary navigation and normalize legacy data.
  if(Array.isArray(NOVA.SECT)){
    for(let i=NOVA.SECT.length-1;i>=0;i--){if(['fondos','walls'].includes(String(NOVA.SECT[i]?.[0]||'')))NOVA.SECT.splice(i,1)}
  }
  S.wp='';

  // Extensions page: real web-store destinations + local unpacked extension loader.
  if(window.PG){
    const realExts=[
      {name:'uBlock Origin Lite',publisher:'Raymond Hill',cat:'Privacidad',icon:'https://www.google.com/s2/favicons?domain=chromewebstore.google.com&sz=64',url:'https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh'},
      {name:'Bitwarden',publisher:'Bitwarden Inc.',cat:'Contraseñas',icon:'https://www.google.com/s2/favicons?domain=bitwarden.com&sz=64',url:'https://chromewebstore.google.com/detail/bitwarden-password-manage/nngceckbapebfimnlniiiahkandclblb'},
      {name:'Dark Reader',publisher:'Dark Reader Ltd',cat:'Accesibilidad',icon:'https://www.google.com/s2/favicons?domain=darkreader.org&sz=64',url:'https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh'}
    ];
    const old=PG.extensiones;
    PG.extensiones=function(r){
      if(old)old(r);
      const block=document.createElement('div');block.className='n43-card';block.style.marginTop='14px';
      block.innerHTML=`<h3>Extensiones reales</h3><div class="n43-muted" style="margin:4px 0 10px">Complementos oficiales de la Chrome Web Store. Nova los abre en su ficha oficial para instalarlos o administrarlos.</div>${realExts.map(x=>`<div class="n43-real-ext"><img class="n43-exticon" src="${x.icon}" alt=""><div><b>${esc43(x.name)}</b><span>${esc43(x.cat)} · ${esc43(x.publisher)}</span></div><button class="btn" data-n43-ext="${esc43(x.url)}">Abrir</button></div>`).join('')}<div class="n43-actions" style="margin-top:10px"><button class="btn on" id="n43-load-ext">Cargar extensión local…</button><span class="n43-muted">Soporta extensiones desempaquetadas compatibles con Electron.</span></div>`;
      block.querySelectorAll('[data-n43-ext]').forEach(b=>b.onclick=()=>newTab(b.dataset.n43Ext));
      block.querySelector('#n43-load-ext').onclick=async()=>{const res=await ipc.invoke('load-extension-local').catch(e=>({ok:false,error:e?.message||String(e)}));toast(res?.ok?`Extensión cargada: ${res.name||'lista'}`:(res?.error||'No se pudo cargar la extensión'));};
      r.appendChild(block);
    };
  }

  // Useful runtime audit: no destructive guesswork, only reports visible core controls with no handler.
  window.NovaUIAudit = () => {
    const ids=['bk','fw','rl','st','pinSite','sh','nt'];
    const missing=ids.filter(id=>{const el=document.getElementById(id);return el&&!el.onclick && !el.closest('#tabs,#wc')?.hasAttribute('data-w')});
    const side=document.querySelector('#side'); const sideMissing=side && side.dataset.n43Bound!=='1';
    return {ok:missing.length===0&&!sideMissing,missing,sideBound:!sideMissing,sideButtons:document.querySelectorAll('#side [data-n43]').length,pinned:S.pinned.length};
  };
  const audit=window.NovaUIAudit();
  if(!audit.ok)console.warn('[Nova 4.3 UI audit]',audit);
  else console.info('[Nova 4.3 UI audit] OK',audit);

  // Avoid runaway interval when page is destroyed.
  window.addEventListener('beforeunload',()=>clearInterval(timer));
  setTimeout(applyEco,250);
})();
