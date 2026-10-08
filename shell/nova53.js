/* Nova 5.3.0 Reborn — renderer refresh, Extension Center, What's New and visual identity. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = () => { try { window.save?.(); } catch {} try { N.save?.(); } catch {} };
  const toast53 = msg => { let t=$('#q53-toast'); if(!t){t=document.createElement('div');t.id='q53-toast';t.className='q53-toast';document.body.appendChild(t)} t.textContent=String(msg||'');t.classList.add('on');clearTimeout(t.__x);t.__x=setTimeout(()=>t.classList.remove('on'),1800); };
  const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const icons = {
    palette:'M12 3a9 9 0 1 0 8.5 11.9 2.4 2.4 0 0 0-2.3-3.2H16a2 2 0 0 1-2-2v-.2a2.4 2.4 0 0 0-2.4-2.4H9.2A2.2 2.2 0 0 1 7 5.8',
    puzzle:'M8 4h3v3h2V4h3v3h4v4h-3v2h3v3h-4v4h-3v-3h-2v3H8v-4H4v-3h3V7H4V4z',
    spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
    shield:'M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6zM9.5 12l1.8 1.8 3.7-4',
    book:'M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z',
    info:'M12 10v7M12 7.2v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    rotate:'M20 11a8 8 0 1 0 1 4M20 4v7h-7'
  };
  const shellLink = (route, title) => { try { return N.openFeature?.(route) || newTab('nova://'+route); } catch { toast53(title+' no disponible'); return null; } };

  // ---------- Renderer skin ----------
  const applyRenderer = () => {
    document.body.classList.add('nova53-reborn');
    document.body.classList.remove('quantum-prime');
    const brand=$('#brand'); if(brand){brand.innerHTML='<img src="../assets/logo/nova-quantum-reborn.svg" alt="Nova"><span>NOVA</span>';brand.title='Nova Quantum 5.3 · Reborn';}
    $('#sh')?.classList.add('q-hidden');
    $('#nova22-top-tools')?.classList.add('q-hidden');
    $('#mn')?.classList.add('q-hidden');
    $('#bl')?.classList.add('q-hidden');
    $('#n40-dock')?.classList.add('q-hidden');
  };

  // ---------- Accent selector (accents, not old full themes) ----------
  const accentList = [
    ['Azul','#2563eb'],['Violeta','#7c5cff'],['Esmeralda','#10b981'],['Coral','#f26b5e'],['Ámbar','#d99018']
  ];
  const setAccent = color => { try{S.quantumAccent=color;S.acc=color;save();document.documentElement.style.setProperty('--acc',color);document.documentElement.style.setProperty('--acc2',color);document.documentElement.style.setProperty('--q53-accent',color);document.documentElement.style.setProperty('--q53-accent-soft',color+'1a');refreshNT?.();}catch{} };
  const syncAccent = () => { try{setAccent(S.quantumAccent||'#2563eb')}catch{} };
  const buildAccent = () => {
    if($('#q53-accent-btn')) return;
    const bar=$('#bar'); if(!bar)return;
    const btn=document.createElement('button');btn.id='q53-accent-btn';btn.type='button';btn.title='Color de Nova';btn.setAttribute('aria-label','Color de Nova');btn.innerHTML=svg(icons.palette);bar.appendChild(btn);
    const pop=document.createElement('div');pop.id='q53-accent-pop';pop.innerHTML='<div class="q53-accent-title">Color de Nova</div><div class="q53-accent-grid">'+accentList.map(([n,c])=>`<button title="${n}" data-c="${c}" style="--sw:${c}"><span></span></button>`).join('')+'</div><div class="q53-muted" style="padding:8px 6px 2px;font-size:10px">Solo cambia el acento. El diseño permanece Quantum.</div>';document.body.appendChild(pop);
    btn.onclick=e=>{e.stopPropagation();pop.classList.toggle('on');};pop.onclick=e=>e.stopPropagation();document.addEventListener('click',()=>pop.classList.remove('on'),true);
    pop.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{setAccent(b.dataset.c);pop.classList.remove('on');syncAccent();});
    syncAccent();
  };

  // ---------- Visible Reborn navigation ----------
  const addRebornNavigation = () => {
    const side=$('#side');
    if(side && !$('#q53-store-side')){
      const b=document.createElement('button');b.id='q53-store-side';b.className='q53-side-btn';b.type='button';b.title='Extension Center';b.setAttribute('aria-label','Extension Center');b.innerHTML=svg(icons.puzzle);
      const ext=side.querySelector('[data-qside=\"extensions\"]');
      if(ext) ext.after(b); else side.insertBefore(b,side.querySelector('.q-side-spacer')||null);
      b.addEventListener('click',e=>{e.stopPropagation();shellLink('extensioncenter53','Extensiones')});
    }
    const menu=$('#q-menu');
    if(menu && !$('#q53-menu-news')){
      const b=document.createElement('button');b.id='q53-menu-news';b.className='q-menu-item';b.type='button';b.innerHTML=svg(icons.spark)+'<span>Qué hay de nuevo</span>';
      const sep=menu.querySelectorAll('.q-menu-sep')[0]; if(sep) sep.after(b); else menu.appendChild(b);
      b.onclick=()=>{menu.classList.remove('on');shellLink('whatsnew53','Novedades')};
      const g=document.createElement('button');g.id='q53-menu-guide';g.className='q-menu-item';g.type='button';g.innerHTML=svg(icons.book)+'<span>Repetir guía de inicio</span>';
      const newsb=menu.querySelector('#q53-menu-news'); if(newsb) newsb.after(g); else menu.appendChild(g);
      g.onclick=()=>{menu.classList.remove('on');shellLink('guide53','Guía')};
    }
  };

  // ---------- Extension Center ----------
  const catalog = [
    {id:'ublock-origin-lite',name:'uBlock Origin Lite',cat:'Privacidad',desc:'Bloqueo de contenido y rastreadores con una experiencia ligera.',rating:'4.7',url:'https://chromewebstore.google.com/search/uBlock%20Origin%20Lite'},
    {id:'bitwarden',name:'Bitwarden',cat:'Privacidad',desc:'Gestor de contraseñas y credenciales para el navegador.',rating:'4.8',url:'https://chromewebstore.google.com/search/Bitwarden'},
    {id:'dark-reader',name:'Dark Reader',cat:'Apariencia',desc:'Tema oscuro para páginas web, con ajustes por sitio.',rating:'4.7',url:'https://chromewebstore.google.com/search/Dark%20Reader'},
    {id:'sponsorblock',name:'SponsorBlock',cat:'Vídeo',desc:'Salta segmentos patrocinados de vídeos usando una base comunitaria.',rating:'4.8',url:'https://chromewebstore.google.com/search/SponsorBlock'},
    {id:'tampermonkey',name:'Tampermonkey',cat:'Utilidades',desc:'Gestión de userscripts para personalizar páginas web.',rating:'4.5',url:'https://chromewebstore.google.com/search/Tampermonkey'},
    {id:'react-devtools',name:'React Developer Tools',cat:'Desarrollo',desc:'Herramientas para inspeccionar componentes React y su rendimiento.',rating:'4.6',url:'https://chromewebstore.google.com/search/React%20Developer%20Tools'},
    {id:'jsonviewer',name:'JSON Viewer',cat:'Desarrollo',desc:'Vista más cómoda para inspeccionar respuestas JSON en el navegador.',rating:'4.4',url:'https://chromewebstore.google.com/search/JSON%20Viewer'},
    {id:'keepa',name:'Keepa',cat:'Utilidades',desc:'Seguimiento de precios y evolución histórica para compras online.',rating:'4.6',url:'https://chromewebstore.google.com/search/Keepa'}
  ];
  const extIcon = svg(icons.puzzle);
  const extensionPage = async r => {
    const partition=typeof N.profilePartition==='function'?N.profilePartition():'persist:web';
    r.innerHTML=`<div class="q53-shell-page"><div class="q53-shell-inner"><div class="q53-store-top"><div><div class="q53-kicker">NOVA EXTENSION CENTER</div><div class="q53-title">Extensiones</div><p class="q53-sub">Un catálogo limpio para descubrir extensiones reales. Nova mantiene el control de instalación: puedes cargar una extensión Chromium desde una carpeta y las extensiones cargadas se restauran automáticamente al iniciar.</p></div><div class="q53-search"><input id="q53-ext-search" placeholder="Buscar extensiones…"><button class="q53-btn primary" id="q53-ext-load">＋ Cargar carpeta</button></div></div>
      <div class="q53-note">Las fichas enlazan a búsquedas de la Chrome Web Store. Nova no descarga código silenciosamente: para instalar una extensión desde el catálogo, revisa su ficha y usa la carga oficial o el flujo compatible de Chromium.</div>
      <div class="q53-chips" id="q53-ext-chips"></div><div class="q53-ext" id="q53-ext-list"></div><div class="q53-card" style="margin-top:14px"><h3>Extensiones cargadas en este perfil</h3><p>Estas extensiones reales proceden de carpetas locales y se conservan para el arranque siguiente.</p><div id="q53-ext-loaded" style="margin-top:10px"></div></div></div></div>`;
    const cats=['Todas',...new Set(catalog.map(x=>x.cat))];let active='Todas';let q='';
    const render=()=>{
      const list=catalog.filter(x=>(active==='Todas'||x.cat===active)&&(!q||(`${x.name} ${x.desc} ${x.cat}`).toLowerCase().includes(q.toLowerCase())));
      r.querySelector('#q53-ext-list').innerHTML=list.map(x=>`<article class="q53-ext-card"><div class="q53-ext-icon">${extIcon}</div><div class="q53-ext-meta"><b>${esc(x.name)}</b><span>${esc(x.desc)}</span><div class="q53-rating">★ ${esc(x.rating)} · ${esc(x.cat)}</div></div><div class="q53-ext-actions"><button class="q53-btn" data-store="${esc(x.url)}">Ver tienda</button></div></article>`).join('')||'<div class="q53-card"><p>No hay resultados.</p></div>';
      r.querySelector('#q53-ext-chips').innerHTML=cats.map(c=>`<button class="q53-chip ${c===active?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
      r.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;render()});
      r.querySelectorAll('[data-store]').forEach(b=>b.onclick=()=>{const u=b.dataset.store;if(/^https?:/i.test(u))newTab(u)});
    };
    r.querySelector('#q53-ext-search').oninput=e=>{q=e.target.value;render()};
    r.querySelector('#q53-ext-load').onclick=async()=>{const d=await ipc.invoke('extension-pick-load',{partition}).catch(()=>({ok:false,error:'No disponible'}));toast53(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar'));paintLoaded();};
    const paintLoaded=async()=>{const d=await ipc.invoke('extensions-list',{partition}).catch(()=>({ok:false,items:[]}));const items=Array.isArray(d?.items)?d.items:[];r.querySelector('#q53-ext-loaded').innerHTML=items.map(x=>`<div class="q53-ext-card" style="margin-bottom:7px"><div class="q53-ext-icon">${extIcon}</div><div class="q53-ext-meta"><b>${esc(x.name||'Extensión')}</b><span>v${esc(x.version||'')} · ${esc(x.path||'')}</span></div><div class="q53-ext-actions"><button class="q53-btn" data-remove="${esc(x.id)}">Quitar</button></div></div>`).join('')||'<span class="q53-muted">No hay extensiones cargadas en este perfil.</span>';r.querySelectorAll('[data-remove]').forEach(b=>b.onclick=async()=>{const ok=await ipc.invoke('extension-unload',{partition,id:b.dataset.remove}).catch(()=>false);toast53(ok?'Extensión retirada':'No se pudo retirar');paintLoaded();});};
    render();await paintLoaded();
  };

  // ---------- What's New ----------
  const whatsNew = r => {
    const slides=[
      {title:'Nuevo renderer Quantum',desc:'Interfaz renovada, tipografía más coherente, menús más relajados y un shell visual separado del núcleo de navegación.',img:'../assets/reborn/whatsnew-renderer.png'},
      {title:'Extension Center renovado',desc:'Descubre extensiones reales, revisa su propósito y cárgalas de forma controlada. Las extensiones cargadas se restauran al iniciar.',img:'../assets/reborn/store-extensions.png'},
      {title:'Más rendimiento visual',desc:'Menos ruido en la interfaz, animaciones cortas y reducción de efectos cuando el sistema prefiere menos movimiento.',img:'../assets/reborn/whatsnew-performance.png'},
      {title:'Nuevas ilustraciones Quantum',desc:'Recursos propios para hacer la experiencia de bienvenida, noticias y novedades más clara y reconocible.',img:'../assets/reborn/whatsnew-onboarding.png'}
    ];
    let idx=0;
    r.innerHTML=`<div class="q53-shell-page q53-whats"><div class="q53-shell-inner"><div class="q53-kicker">NOVA 5.3</div><div class="q53-title">What's New</div><p class="q53-sub">Conoce el rediseño de Nova 5.3 con una presentación guiada y suave.</p><div class="q53-steps">${slides.map((_,i)=>`<div class="q53-step ${i===0?'on':''}" data-step="${i}"><span></span></div>`).join('')}</div><img class="q53-hero-img" id="q53-hero" src="${slides[0].img}" alt="${esc(slides[0].title)}"><div class="q53-card" style="margin-top:12px"><div class="q53-kicker" id="q53-slide-kicker">01 / ${slides.length}</div><h2 id="q53-slide-title" style="margin:5px 0">${esc(slides[0].title)}</h2><p id="q53-slide-desc">${esc(slides[0].desc)}</p><div class="q53-actions"><button class="q53-btn" id="q53-prev">Anterior</button><button class="q53-btn primary" id="q53-next">Siguiente</button><button class="q53-btn" id="q53-ext-link">Extension Center</button></div></div><div class="q53-dotbar">${slides.map((_,i)=>`<span class="q53-dot ${i===0?'on':''}" data-dot="${i}"></span>`).join('')}</div></div></div>`;
    const paint=()=>{const s=slides[idx];const hero=r.querySelector('#q53-hero');hero.style.opacity='.01';hero.style.transform='translateY(7px) scale(.995)';hero.onload=()=>{hero.animate?.([{opacity:.01,transform:'translateY(7px) scale(.995)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});};hero.src=s.img;r.querySelector('#q53-slide-kicker').textContent=`${String(idx+1).padStart(2,'0')} / ${slides.length}`;r.querySelector('#q53-slide-title').textContent=s.title;r.querySelector('#q53-slide-desc').textContent=s.desc;r.querySelectorAll('[data-dot]').forEach(x=>x.classList.toggle('on',+x.dataset.dot===idx));r.querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('on',+x.dataset.step===idx));};
    r.querySelector('#q53-prev').onclick=()=>{idx=(idx-1+slides.length)%slides.length;paint()};r.querySelector('#q53-next').onclick=()=>{idx=(idx+1)%slides.length;paint()};r.querySelector('#q53-ext-link').onclick=()=>shellLink('extensioncenter53','Extensiones');r.querySelectorAll('[data-dot]').forEach(d=>d.onclick=()=>{idx=+d.dataset.dot;paint()});
    setTimeout(()=>r.querySelector('[data-step="0"] span')?.animate?.([{transform:'translateX(-101%)'},{transform:'none'}],{duration:2600,easing:'ease'}),200);
  };

  // ---------- Onboarding / About ----------
  const guide = r => { r.innerHTML=`<div class="q53-shell-page"><div class="q53-shell-inner q53-onboard"><div><div class="q53-kicker">PRIMEROS PASOS</div><div class="q53-title">Bienvenido a Nova</div><p class="q53-sub">Esta guía puede abrirse de nuevo cuando quieras. No necesitas reinstalar nada.</p><div class="q53-card"><h3>1. Empieza</h3><p>Escribe una dirección o una búsqueda en la barra superior.</p><h3 style="margin-top:13px">2. Organiza</h3><p>Usa Workspaces, favoritos y sitios fijados para mantener tus sesiones separadas.</p><h3 style="margin-top:13px">3. Descubre</h3><p>Abre el Extension Center para gestionar extensiones reales con control sobre lo que cargas.</p><div class="q53-actions"><button class="q53-btn primary" id="q53-guide-store">Extension Center</button><button class="q53-btn" id="q53-guide-news">Ver novedades</button></div></div></div><img src="../assets/reborn/whatsnew-onboarding.png" alt="Guía de inicio de Nova"></div></div>`;r.querySelector('#q53-guide-store').onclick=()=>shellLink('extensioncenter53','Extensiones');r.querySelector('#q53-guide-news').onclick=()=>shellLink('whatsnew53','Novedades'); };

  // ---------- Routing ----------
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//i,'').split(/[/?#]/)[0].toLowerCase();const map={extensioncenter:'extensioncenter53','extensions-store':'extensioncenter53','extensiones-store':'extensioncenter53','whatsnew:'whatsnew53','novedades53':'whatsnew53','guide:'guide53','bienvenida53':'guide53'};return map[raw]||(oldResolve?oldResolve(x):String(x||''));};
  if(N.PG){N.PG.extensioncenter53=extensionPage;N.PG.whatsnew53=whatsNew;N.PG.guide53=guide;}
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct=(label,fn)=>{if(!N.extraActs.some(x=>Array.isArray(x)&&x[0]===label))N.extraActs.push([label,fn]);};
  addAct('Nova 5.3 · Novedades',()=>shellLink('whatsnew53','Novedades'));
  addAct('Nova · Extension Center',()=>shellLink('extensioncenter53','Extensiones'));
  addAct('Nova · Repetir tutorial',()=>shellLink('guide53','Tutorial'));

  // ---------- Update notice ----------
  const showWelcomeOnVersion = () => {
    try{const key='nova53_seen_'+String(typeof NOVA_VER!=='undefined'?NOVA_VER:'5.3.0');if(localStorage.getItem(key))return;localStorage.setItem(key,'1');setTimeout(()=>shellLink('whatsnew53','Novedades'),1200);}catch{}
  };


