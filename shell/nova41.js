/* Nova 4.1.0 · Evolution Layer
 * Additive update over Nova 4.0.0. Keeps existing modules intact.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = () => Date.now();
  const save = () => { try { N.save?.(); } catch {} try { window.save?.(); } catch {} };
  const open = route => { try { return newTab('nova://' + route); } catch { return null; } };
  const current = () => { try { return N.activeWebTab?.() || cur; } catch { return null; } };

  const state = () => {
    S.nova41 = Object.assign({
      version: 1,
      gaming: { favorites: [], playtime: {}, records: {} },
      gamingProfile: { active: true, accent: '#a970ff', extensions: [], privacy: { ads: true, threats: true } },
      sync: { enabled: true, encrypted: true, devices: [], last: 0 },
      privacy: { ads: true, threats: true, trackers: true },
      dynamicHome: true,
      news: { enabled: true, topics: ['Tecnología', 'Gaming', 'Internet'] }
    }, S.nova41 || {});
    S.nova41.gaming ||= { favorites: [], playtime: {}, records: {} };
    S.nova41.gamingProfile ||= { active: true, accent: '#a970ff', extensions: [], privacy: { ads: true, threats: true } };
    S.nova41.sync ||= { enabled: true, encrypted: true, devices: [], last: 0 };
    S.nova41.privacy ||= { ads: true, threats: true, trackers: true };
    return S.nova41;
  };
  const st = state();

  if (!document.getElementById('nova41-style')) {
    const css = document.createElement('style'); css.id = 'nova41-style';
    css.textContent = `
      .n41-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:30px}
      .n41-hero{padding:24px;border:1px solid var(--bd);border-radius:24px;background:radial-gradient(circle at 88% 5%,rgba(155,92,255,.20),transparent 45%),linear-gradient(145deg,var(--bar),color-mix(in srgb,var(--bar) 78%,#09060f));box-shadow:0 22px 80px #0004}
      .n41-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--acc);font-weight:800}.n41-title{font-size:32px;font-weight:700;letter-spacing:-.035em}.n41-sub{color:var(--mut);line-height:1.6;max-width:900px}
      .n41-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:10px}.n41-card{padding:16px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);display:flex;flex-direction:column;gap:8px}.n41-card h3{margin:0}.n41-card p{margin:0;color:var(--mut);line-height:1.55}.n41-stat{font-size:25px;font-weight:750}.n41-muted{font-size:12px;color:var(--mut)}
      .n41-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}.n41-row + .n41-row{margin-top:8px}.n41-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}
      .n41-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n41-chip.on{border-color:var(--acc);color:var(--acc)}
      .n41-news{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.n41-news article{min-height:145px;padding:16px;border:1px solid var(--bd);border-radius:18px;background:linear-gradient(145deg,var(--bar),color-mix(in srgb,var(--bar) 92%,#171023));display:flex;flex-direction:column;gap:9px}.n41-news article:hover{border-color:var(--acc);transform:translateY(-2px);transition:.18s}.n41-news .tag{font-size:10px;text-transform:uppercase;letter-spacing:.13em;color:var(--acc)}
      .n41-toggle{width:44px;height:24px;border-radius:999px;background:#2a2830;border:1px solid var(--bd);padding:3px;cursor:pointer}.n41-toggle span{display:block;width:16px;height:16px;border-radius:50%;background:#aaa;transition:.18s}.n41-toggle.on{background:color-mix(in srgb,var(--acc) 52%,#15111b);border-color:var(--acc)}.n41-toggle.on span{transform:translateX(19px);background:#fff}
      .n41-game{background:radial-gradient(circle at 95% 0,rgba(155,92,255,.22),transparent 35%),linear-gradient(145deg,#100d16,#15101f 50%,#0b0a0f);border-color:#44305a}.n41-score{font-size:30px;font-weight:800}.n41-bar{height:9px;border-radius:999px;background:#25212c;overflow:hidden}.n41-fill{height:100%;background:linear-gradient(90deg,#7040d4,#bd8aff);border-radius:999px}
      @media(max-width:800px){.n41-news{grid-template-columns:1fr}.n41-title{font-size:27px}.n41-row{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(css);
  }

  const page = (k,t,d,b='') => `<div class="n41-page"><div class="n41-kicker">${esc(k)}</div><div class="n41-title">${esc(t)}</div><div class="n41-sub">${esc(d)}</div>${b}</div>`;
  const btn = (label,attr='',cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const toggle = (on,id) => `<button class="n41-toggle ${on?'on':''}" id="${id}" aria-pressed="${!!on}"><span></span></button>`;

  N.PG.gaming41 = r => {
    const g = st.gaming, prof = st.gamingProfile;
    const entries = Object.entries(g.playtime || {}).sort((a,b) => b[1]-a[1]);
    const favs = g.favorites || [];
    r.innerHTML = page('NOVA GAMING','Game Hub','Tu espacio gaming: juegos favoritos, noticias y estadísticas en un solo lugar.',`
      <div class="n41-hero n41-game"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><div style="font-size:24px;font-weight:800">🎮 NEXA-style Gaming dentro de Nova</div><p class="n41-muted" style="margin-top:6px">Perfil Gaming ${prof.active?'activo':'inactivo'} · estética premium morada · sin sobrecargar la navegación.</p></div><div class="n41-chip on">🏆 Perfil Gaming</div></div><div class="n41-actions">${btn('⚙️ Configurar perfil','id="g-profile"')}${btn('🧩 Extensiones','id="g-ext"')}${btn('🛡 Privacidad','id="g-privacy"')}</div></div>
      <div class="n41-grid">
        <div class="n41-card"><div class="n41-score">${favs.length}</div><div class="n41-muted">Juegos favoritos</div><div class="n41-actions">${btn('＋ Añadir juego','id="g-add"','on')}</div></div>
        <div class="n41-card"><div class="n41-score">${entries.reduce((a,[,v])=>a+Number(v||0),0).toFixed(1)} h</div><div class="n41-muted">Tiempo total registrado</div><div class="n41-actions">${btn('＋ Registrar sesión','id="g-session"')}</div></div>
        <div class="n41-card"><div class="n41-score">${Object.keys(g.records||{}).length}</div><div class="n41-muted">Récords personales</div><div class="n41-actions">${btn('🏆 Editar récord','id="g-record"')}</div></div>
      </div>
      <div class="n41-grid">
        <div class="n41-card"><h3>🎮 Mis juegos</h3>${favs.map((x,i)=>`<div class="n41-row"><div><b>${esc(x)}</b><div class="n41-muted">${Number(g.playtime?.[x]||0).toFixed(1)} h</div></div><button class="btn" data-game-del="${i}">Quitar</button></div>`).join('') || '<div class="n41-muted">Añade tus juegos favoritos para verlos aquí.</div>'}</div>
        <div class="n41-card"><h3>📰 Noticias gaming</h3>${['Novedades de hardware y PC gaming','Lanzamientos y actualizaciones','Tendencias de videojuegos'].map((x,i)=>`<div class="n41-row"><div><b>${x}</b><div class="n41-muted">Resumen personalizado para tu perfil.</div></div></div>`).join('')}</div>
      </div>
      <div class="n41-card"><h3>📈 Estadísticas</h3>${entries.map(([x,v])=>`<div class="n41-row"><div style="flex:1"><b>${esc(x)}</b><div class="n41-bar" style="margin-top:7px"><div class="n41-fill" style="width:${Math.min(100,Number(v)*3)}%"></div></div></div><strong>${Number(v).toFixed(1)} h</strong></div>`).join('') || '<div class="n41-muted">Aún no hay sesiones registradas.</div>'}</div>
    `);
    r.querySelector('#g-add').onclick = () => { const x=String(prompt('Juego favorito','Minecraft')||'').trim(); if(!x)return; if(!g.favorites.includes(x))g.favorites.unshift(x); save(); N.PG.gaming41(r); };
    r.querySelector('#g-session').onclick = () => { const x=String(prompt('Juego','Minecraft')||'').trim(); const h=Math.max(0,Number(prompt('Horas de esta sesión','1'))||0); if(!x||!h)return; g.playtime[x]=Number(g.playtime[x]||0)+h; if(!g.favorites.includes(x))g.favorites.unshift(x); save(); N.PG.gaming41(r); };
    r.querySelector('#g-record').onclick = () => { const x=String(prompt('Nombre del récord','Mejor sesión')||'').trim(); const v=String(prompt('Valor','10')||'').trim(); if(!x||!v)return; g.records[x]=v; save(); N.PG.gaming41(r); };
    r.querySelectorAll('[data-game-del]').forEach(b=>b.onclick=()=>{g.favorites.splice(+b.dataset.gameDel,1);save();N.PG.gaming41(r)});
    r.querySelector('#g-profile').onclick=()=>open('gamingprofile41'); r.querySelector('#g-ext').onclick=()=>open('extensions41'); r.querySelector('#g-privacy').onclick=()=>open('privacy41');
  };

  N.PG.gamingprofile41 = r => {
    const p = st.gamingProfile;
    r.innerHTML = page('PROFILE','Perfil Gaming','Perfil separado para apariencia, configuración, extensiones, privacidad y sincronización.',`
      <div class="n41-card"><div class="n41-row"><div><b>🏆 Perfil Gaming</b><div class="n41-muted">${p.active?'Activo en este dispositivo':'Inactivo'}</div></div>${toggle(p.active,'gp-active')}</div>
      <div class="n41-grid"><div class="n41-card"><h3>🎨 Apariencia</h3><p>Usa el acento morado premium del perfil gaming.</p>${btn('Aplicar estilo Gaming','id="gp-style"','on')}</div><div class="n41-card"><h3>⚙️ Configuración</h3><p>Preferencias independientes del perfil personal.</p>${btn('Configurar','id="gp-settings"')}</div><div class="n41-card"><h3>🧩 Extensiones</h3><p>${p.extensions.length} extensiones asociadas.</p>${btn('Gestionar','id="gp-ext"')}</div><div class="n41-card"><h3>🔒 Privacidad</h3><p>Protección independiente para sesiones gaming.</p>${btn('Gestionar','id="gp-privacy"')}</div><div class="n41-card"><h3>🎮 Favoritos</h3><p>${st.gaming.favorites.length} juegos guardados.</p>${btn('Abrir Game Hub','id="gp-games"')}</div><div class="n41-card"><h3>☁️ Sync</h3><p>Perfil preparado para sincronización cifrada.</p>${btn('Abrir Nova Sync','id="gp-sync"')}</div></div></div>
    `);
    r.querySelector('#gp-active').onclick=()=>{p.active=!p.active;save();N.PG.gamingprofile41(r)};
    r.querySelector('#gp-style').onclick=()=>{S.theme='dark';save();applyTheme();toast('Perfil Gaming aplicado')};
    r.querySelector('#gp-settings').onclick=()=>open('gamingsettings41'); r.querySelector('#gp-ext').onclick=()=>open('extensions41'); r.querySelector('#gp-privacy').onclick=()=>open('privacy41'); r.querySelector('#gp-games').onclick=()=>open('gaming41'); r.querySelector('#gp-sync').onclick=()=>open('sync41');
  };

  N.PG.gamingsettings41 = r => {
    const p=st.gamingProfile;
    r.innerHTML=page('PROFILE','Ajustes Gaming','Preferencias separadas para tu perfil de juego.',`<div class="n41-card"><div class="n41-row"><div><b>🟣 Acento premium</b><div class="n41-muted">${esc(p.accent)}</div></div><button class="btn" id="gp-accent">Cambiar</button></div><div class="n41-row"><div><b>🚀 Preparar sesión</b><div class="n41-muted">Deja el modo Gaming listo sin cambiar tus datos personales.</div></div><button class="btn on" id="gp-prepare">Activar</button></div></div>`);
    r.querySelector('#gp-accent').onclick=()=>{const v=String(prompt('Acento CSS (ej. #a970ff)',p.accent)||'').trim();if(/^#[0-9a-f]{6}$/i.test(v)){p.accent=v;save();N.PG.gamingsettings41(r)}};
    r.querySelector('#gp-prepare').onclick=()=>{p.active=true;save();toast('Perfil Gaming listo');N.PG.gamingsettings41(r)};
  };

  N.PG.extensions41 = r => {
    const installed=st.gamingProfile.extensions || [];
    const catalog=[['privacy-lite','🛡 Privacidad Plus','Protección reforzada para sesiones sensibles.'],['game-tools','🎮 Game Tools','Herramientas rápidas para tu flujo gaming.'],['reader','📖 Reader+','Lectura limpia para guías y documentación.'],['dev','🧑‍💻 Dev Tools','Accesos de desarrollador para webs y pruebas.']];
    r.innerHTML=page('EXTENSIONS','Extensions Store','Tienda integrada para descubrir extensiones, con permisos claros y compatibilidad amplia como objetivo.',`<div class="n41-card"><h3>⭐ Destacadas</h3><div class="n41-grid">${catalog.map(([id,n,d])=>`<div class="n41-card"><h3>${n}</h3><p>${d}</p><div class="n41-muted">✓ Revisada para este prototipo · permisos visibles</div><div class="n41-actions">${btn(installed.includes(id)?'✓ Instalada':'Instalar',`data-ext="${id}"`,installed.includes(id)?'':'on')}</div></div>`).join('')}</div></div><div class="n41-card"><h3>🔐 Seguridad</h3><p>Antes de instalar, NEXA/Nova muestra qué permisos solicita cada extensión. El modo desarrollador sigue separado del catálogo.</p>${btn('Abrir extensiones clásicas','id="ext-classic"')}</div>`);
    r.querySelectorAll('[data-ext]').forEach(b=>b.onclick=()=>{const id=b.dataset.ext;if(installed.includes(id))installed.splice(installed.indexOf(id),1);else installed.push(id);st.gamingProfile.extensions=installed;save();N.PG.extensions41(r)});
    r.querySelector('#ext-classic').onclick=()=>open('extensions40');
  };

  N.PG.privacy41 = r => {
    const p=st.privacy;
    r.innerHTML=page('PRIVACY','Centro de privacidad','Adiós a los anuncios, protección inteligente y controles claros.',`<div class="n41-grid"><div class="n41-card"><h3>🚫 Bloqueador de anuncios</h3><p>Controla anuncios y rastreadores desde una sola vista.</p><div class="n41-row"><span>${p.ads?'Activo':'Inactivo'}</span>${toggle(p.ads,'pv-ads')}</div></div><div class="n41-card"><h3>🛡 Protección inteligente</h3><p>Refuerza la navegación frente a phishing y descargas peligrosas.</p><div class="n41-row"><span>${p.threats?'Activa':'Inactiva'}</span>${toggle(p.threats,'pv-threats')}</div></div><div class="n41-card"><h3>🕵️ Rastreadores</h3><p>Controles de seguimiento y cookies de terceros.</p><div class="n41-row"><span>${p.trackers?'Protegidos':'Permitidos'}</span>${toggle(p.trackers,'pv-track')}</div></div></div><div class="n41-card"><h3>Estado</h3><div class="n41-chip on">${p.ads?'🚫 Anuncios':'✓ Anuncios permitidos'}</div> <div class="n41-chip ${p.threats?'on':''}">${p.threats?'🛡 Amenazas protegidas':'Amenazas sin protección'}</div> <div class="n41-actions">${btn('Abrir centro clásico','id="pv-classic"')}${btn('Configurar por sitio','id="pv-site"')}</div></div>`);
    r.querySelector('#pv-ads').onclick=()=>{p.ads=!p.ads;S.adblock=p.ads;save();try{ipc.invoke('adblock',p.ads)}catch{}N.PG.privacy41(r)};
    r.querySelector('#pv-threats').onclick=()=>{p.threats=!p.threats;save();N.PG.privacy41(r)}; r.querySelector('#pv-track').onclick=()=>{p.trackers=!p.trackers;save();N.PG.privacy41(r)};
    r.querySelector('#pv-classic').onclick=()=>open('privacidad');r.querySelector('#pv-site').onclick=()=>open('permissions31');
  };

  N.PG.sync41 = r => {
    const s=st.sync;
    r.innerHTML=page('SYNC','Nova Sync','Sincronización entre dispositivos con favoritos, pestañas, historial, configuración y cifrado.',`<div class="n41-hero"><div class="n41-row"><div><h3>☁️ Sincronización cifrada</h3><div class="n41-muted">${s.enabled?'Activa':'Inactiva'} · ${s.encrypted?'Cifrada':'Sin cifrado'}</div></div>${toggle(s.enabled,'sy-enabled')}</div><div class="n41-actions">${btn('☁️ Cuenta','id="sy-account"','on')}${btn('⬇ Exportar espacio','id="sy-export"')}${btn('⬆ Importar espacio','id="sy-import"')}</div></div><div class="n41-grid"><div class="n41-card"><h3>⭐ Favoritos</h3><div class="n41-stat">${S.marks?.length||0}</div></div><div class="n41-card"><h3>📑 Pestañas</h3><div class="n41-stat">${tabs?.length||0}</div></div><div class="n41-card"><h3>🕘 Historial</h3><div class="n41-stat">${S.hist?.length||0}</div></div><div class="n41-card"><h3>⚙️ Configuración</h3><p>Temas, preferencias y perfiles incluidos.</p></div></div><div class="n41-card"><h3>📱↔️💻 Continuar aquí</h3><p>Prepara una página actual para retomarla en otro dispositivo.</p>${btn('Crear QR','id="sy-qr"','on')}</div>`);
    r.querySelector('#sy-enabled').onclick=()=>{s.enabled=!s.enabled;save();N.PG.sync41(r)};
    r.querySelector('#sy-account').onclick=()=>open('sync40');
    r.querySelector('#sy-export').onclick=()=>open('sync40'); r.querySelector('#sy-import').onclick=()=>open('sync40'); r.querySelector('#sy-qr').onclick=()=>open('companion40');
  };

  N.PG.translate41 = r => {
    r.innerHTML=page('WEB POWER','Magic Translate','Traduce una selección o una página completa sin cambiar la original.',`<div class="n41-card"><div class="n41-grid"><div class="n41-card"><h3>🌍 Selección</h3><p>Usa la selección actual y abre la traducción.</p>${btn('Traducir selección','id="tr-sel"','on')}</div><div class="n41-card"><h3>🌍 Página</h3><p>Traduce la página completa en una nueva pestaña.</p>${btn('Traducir página','id="tr-page"')}</div><div class="n41-card"><h3>⚙️ Destino</h3><input class="fld" id="tr-lang" value="es" maxlength="10"><div class="n41-muted">Código de idioma, por ejemplo es, en, fr.</div></div></div></div>`);
    r.querySelector('#tr-sel').onclick=async()=>{const t=current();if(!t?.wv)return toast('Abre una página web');const x=await t.wv.executeJavaScript(`window.getSelection?.().toString()||''`).catch(()=> '');if(!x)return toast('Selecciona texto');const l=String(r.querySelector('#tr-lang').value||'es').trim();newTab('https://translate.google.com/?sl=auto&tl='+encodeURIComponent(l)+'&text='+encodeURIComponent(String(x)))};
    r.querySelector('#tr-page').onclick=()=>{const t=current();if(!t?.wv)return toast('Abre una página web');const u=t.wv.getURL?.()||'';if(!/^https?:/i.test(u))return toast('Abre una web');const l=String(r.querySelector('#tr-lang').value||'es').trim();newTab('https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(l)+'&u='+encodeURIComponent(u))};
  };

  N.PG.devtools41 = r => {
    r.innerHTML=page('DEVELOPER','Herramientas de desarrollador','Acceso rápido a Inspector, Console, Network, Sources, Performance y Storage.',`<div class="n41-grid">${[['🔎','Inspector'],['⌨️','Console'],['🌐','Network'],['📦','Sources'],['⚡','Performance'],['🗃','Storage']].map(([i,n])=>`<div class="n41-card"><div style="font-size:22px">${i}</div><h3>${n}</h3><p>Panel preparado para el flujo de desarrollo.</p>${btn('Abrir DevTools',`data-dev="${n}"`,'on')}</div>`).join('')}</div><div class="n41-card"><p>Atajo disponible desde el menú contextual de una página: <b>Inspeccionar elemento</b>.</p></div>`);
    r.querySelectorAll('[data-dev]').forEach(b=>b.onclick=()=>{const t=current();try{t?.wv?.openDevTools?.({mode:'detach'})}catch{toast('DevTools no disponible en esta vista')}});
  };

  const aliases = { gaming:'gaming41', 'game-hub':'gaming41', gamingprofile:'gamingprofile41', 'gaming-profile':'gamingprofile41', gamingsettings:'gamingsettings41', extensionsstore:'extensions41', 'extensions-store':'extensions41', privacy41:'privacy41', sync41:'sync41', translate41:'translate41', devtools41:'devtools41', developer:'devtools41' };
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]||(oldResolve?oldResolve(raw):raw)};
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct=(name,fn)=>{if(!N.extraActs.some(a=>a[0]===name))N.extraActs.push([name,fn])};
  addAct('🎮 Game Hub',()=>open('gaming41'));
  addAct('🏆 Perfil Gaming',()=>open('gamingprofile41'));
  addAct('🛡 Privacidad 4.1',()=>open('privacy41'));
  addAct('☁️ Sync 4.1',()=>open('sync41'));
  addAct('🌍 Traducción',()=>open('translate41'));
  addAct('🧑‍💻 DevTools',()=>open('devtools41'));

  window.Nova41={gaming:()=>open('gaming41'),profile:()=>open('gamingprofile41'),privacy:()=>open('privacy41'),sync:()=>open('sync41'),translate:()=>open('translate41'),devtools:()=>open('devtools41')};
  save();
})();
