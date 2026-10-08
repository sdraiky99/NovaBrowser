/* Nova 5.1 legacy layer — clean settings, recovery, diagnostics and productivity, retained under Quantum 5.2. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = m => { let t=$('#q51-toast'); if(!t){t=document.createElement('div');t.id='q51-toast';document.body.appendChild(t)} t.textContent=String(m||''); t.classList.add('on'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('on'),2200); };
  const sanitizeState = () => { try {
    S.logo='quantum'; S.theme='nova';
    if(!['system','light','dark'].includes(S.quantumAppearance)) S.quantumAppearance='system';
    if(!Array.isArray(S.marks)) S.marks=[]; if(!Array.isArray(S.hist)) S.hist=[]; if(!Array.isArray(S.dls)) S.dls=[]; if(!Array.isArray(S.quick)) S.quick=[];
    if(!S.performance || typeof S.performance!=='object' || Array.isArray(S.performance)) S.performance={};
    if(!S.mods || typeof S.mods!=='object' || Array.isArray(S.mods)) S.mods={};
    if(typeof S.search!=='string' || !S.search) S.search='https://duckduckgo.com/?q=';
    delete S.topc; delete S.topcc; delete S.topi; delete S.font; delete S.fs; delete S.r; delete S.snd; delete S.sound; delete S.wp; delete S.rand; delete S.sp; delete S.acc;
  } catch {} };
  const saveSafe = () => { try { sanitizeState(); save(); } catch {} };
  try { sanitizeState(); saveSafe(); } catch {}

  const feature = route => { try { return typeof newTab==='function' ? newTab('nova://'+route) : N.openFeature?.(route); } catch { toast('Esta sección no está disponible'); return null; } };
  const baseResolve = N.resolveFeatureRoute;
  N.resolveFeatureRoute = x => {
    const raw=String(x||'').replace(/^nova:\/\//i,'').split(/[/?#]/)[0].toLowerCase();
    const map={ajustes:'quantumsettings',personalizar:'quantumsettings',apariencia:'quantumsettings',fondos:'quantumsettings',mods:'quantumsettings',temas:'quantumsettings',theme:'quantumsettings',actualizaciones:'updates51',update:'updates51',updatecenter:'updates51',diagnostico:'diagnostics51',diagnostics:'diagnostics51',backup:'backup51',restaurar:'backup51',reader:'reader51',lectura:'reader51',novedades:'news51',news:'news51',acciones:'actions51',command:'actions51'};
    return map[raw] || (baseResolve ? baseResolve(x) : String(x||''));
  };

  if (N.PG) {
    N.PG.quantumsettings = r => {
      const mode=String(S.quantumAppearance||'system');
      r.innerHTML=`<div class="q51-settings"><header><div class="q51-eyebrow">NOVA QUANTUM 5.1</div><h2>Ajustes</h2><p>Solo controles que existen en esta versión. Los sistemas antiguos de temas, logos y personalización han sido retirados.</p></header>
      <section class="q51-card"><h3>Apariencia</h3><p>La interfaz de Nova usa un único diseño. Solo cambia el modo de color.</p><div class="q51-seg"><button data-mode="system">Sistema</button><button data-mode="light">Claro</button><button data-mode="dark">Oscuro</button></div></section>
      <section class="q51-card"><h3>Navegación</h3><div class="q51-row"><div><b>Buscador</b><span>El motor usado por la barra y Nueva pestaña.</span></div><select id="q51-search"><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.google.com/search?q=">Google</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select></div><div class="q51-row"><div><b>Abrir enlaces en pestaña</b><span>Controla la preferencia de enlaces del navegador.</span></div><button class="q51-switch ${S.newTabLinks?'on':''}" id="q51-links">${S.newTabLinks?'Activo':'Inactivo'}</button></div></section>
      <section class="q51-card"><h3>Privacidad</h3><div class="q51-row"><div><b>Bloqueador de anuncios y rastreadores</b><span>Se conserva el bloqueador integrado de Nova.</span></div><button class="q51-switch ${S.adblock?'on':''}" id="q51-adblock">${S.adblock?'Activo':'Inactivo'}</button></div><div class="q51-actions"><button class="q51-btn" id="q51-clear">Limpiar datos</button><button class="q51-btn" id="q51-repair">Reparar interfaz</button><button class="q51-btn" data-open="diagnostics51">Comprobar estado</button></div></section>
      <section class="q51-card"><h3>Rendimiento</h3><div class="q51-row"><div><b>Ahorro de energía / memoria</b><span>Reduce actividad de pestañas en segundo plano cuando lo necesites.</span></div><button class="q51-switch ${S.performance?.memorySaver?'on':''}" id="q51-eco">${S.performance?.memorySaver?'Activo':'Inactivo'}</button></div><div class="q51-actions"><button class="q51-btn" data-open="rendimiento44">Rendimiento</button><button class="q51-btn" data-open="reader51">Modo lectura</button></div></section>
      <section class="q51-card"><h3>Extensiones y Workspaces</h3><div class="q51-actions"><button class="q51-btn" data-open="extensiones44">Extensiones</button><button class="q51-btn" data-open="workspaces44">Workspaces</button></div></section>
      <section class="q51-card"><h3>Actualización y recuperación</h3><div class="q51-actions"><button class="q51-btn" data-open="updates51">Buscar actualización</button><button class="q51-btn" data-open="backup51">Copias de seguridad</button><button class="q51-btn" data-open="diagnostics51">Diagnóstico</button></div></section>
      <footer>Nova ${typeof NOVA_VER!=='undefined'?NOVA_VER:'5.1.0'} · Chromium ${process.versions.chrome} · Electron ${process.versions.electron}</footer></div>`;
      const sel=$('#q51-search'); if(sel){sel.value=S.search; sel.onchange=e=>{S.search=e.target.value;saveSafe();refreshNT?.()}};
      r.querySelectorAll('.q51-seg button').forEach(b=>{b.classList.toggle('on',b.dataset.mode===mode);b.onclick=()=>{S.quantumAppearance=b.dataset.mode;saveSafe();try{window.quantumSetAppearance?.(b.dataset.mode)}catch{};N.PG.quantumsettings(r)}});
      $('#q51-links').onclick=()=>{S.newTabLinks=!S.newTabLinks;saveSafe();N.PG.quantumsettings(r)};
      $('#q51-adblock').onclick=async()=>{S.adblock=!S.adblock;try{await ipc.invoke('adblock',S.adblock)}catch{} saveSafe();N.PG.quantumsettings(r)};
      $('#q51-eco').onclick=async()=>{const on=!S.performance?.memorySaver;try{await ipc.invoke('performance-mode',on)}catch{} S.performance=Object.assign(S.performance||{},{memorySaver:on});saveSafe();N.PG.quantumsettings(r)};
      $('#q51-clear').onclick=async()=>{await ipc.invoke('clear').catch(()=>{});S.hist=[];saveSafe();toast('Datos locales limpiados')}; $('#q51-repair').onclick=()=>{sanitizeState();saveSafe();toast('Configuración de interfaz reparada');setTimeout(()=>location.reload(),500)};
      r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>feature(b.dataset.open));
    };

    N.PG.updates51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">NOVA UPDATE CENTER</div><h2>Actualizaciones</h2><p>Comprueba la versión disponible sin modificar tus datos.</p><div class="q51-card" id="q51-update-box">Comprobando…</div><button class="q51-btn" id="q51-update-check">Buscar de nuevo</button></div>';
      const box=$('#q51-update-box'), render=x=>{const newer=x?.newer||x?.state?.status==='available'; const failed=x?.ok===false; const title=failed?'No se pudo comprobar':x?.status==='checking'?'Comprobando…':newer?'Hay una versión disponible':'Nova está al día'; const sub=failed?'Comprueba tu conexión o abre los lanzamientos de GitHub.':`Instalada: ${esc(x?.current||NOVA_VER||'5.1.0')}${x?.latest?` · Última: ${esc(x.latest)}`:''}`; box.innerHTML=`<div class="q51-status ${failed?'bad':'good'}"><b>${title}</b><span>${sub}</span></div>${x?.url?`<button class="q51-btn" id="q51-open-release">Abrir lanzamientos</button>`:''}`; if($('#q51-open-release'))$('#q51-open-release').onclick=()=>{try{require('electron').shell.openExternal(x.url)}catch{}}};
      $('#q51-update-check').onclick=async()=>{box.textContent='Comprobando…'; const x=await ipc.invoke('update-check').catch(()=>({ok:false}));render(x)};
      const x=await ipc.invoke('update-check').catch(()=>({ok:false})); render(x);
    };

    N.PG.backup51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">SAFE STATE</div><h2>Copias de seguridad</h2><p>Nova guarda una copia de la configuración antes de sobrescribir el estado persistente.</p><div class="q51-card" id="q51-backup-box">Leyendo estado…</div><div class="q51-actions"><button class="q51-btn" id="q51-restore">Restaurar última copia</button><button class="q51-btn" id="q51-export">Exportar estado</button></div></div>';
      const d=await ipc.invoke('nova51-diagnostics').catch(()=>({})); const b=$('#q51-backup-box'); b.innerHTML=`<div class="q51-status good"><b>${d?.state?.backup?'Copia disponible':'Sin copia secundaria todavía'}</b><span>${d?.state?.ok?'Estado principal válido.':'Estado principal no disponible; Nova usará recuperación controlada.'}</span></div>`;
      $('#q51-restore').onclick=async()=>{const x=await ipc.invoke('nova51-restore-backup').catch(()=>({ok:false})); if(!x.ok)return toast(x.error||'No se pudo restaurar'); try{localStorage.nova=x.state;toast('Copia restaurada. Reiniciando…');setTimeout(()=>location.reload(),500)}catch{toast('Copia restaurada')} };
      $('#q51-export').onclick=async()=>{const raw=await ipc.invoke('nova51-export-state').catch(()=>null);if(!raw)return toast('No hay estado exportable');const blob=new Blob([raw],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nova-quantum-5.1-state.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
    };

    N.PG.diagnostics51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">QUANTUM DIAGNOSTICS</div><h2>Estado del navegador</h2><p>Comprueba recursos y configuración persistente sin modificar nada.</p><div class="q51-grid" id="q51-dg">Comprobando…</div></div>';
      const d=await ipc.invoke('nova51-diagnostics').catch(()=>null), g=$('#q51-dg');
      if(!d){g.innerHTML='<div class="q51-card"><b>No se pudo ejecutar el diagnóstico.</b></div>';return}
      const row=(ok,ttl,sub)=>`<div class="q51-card q51-ditem"><span class="q51-dot ${ok?'good':'warn'}"></span><div><b>${esc(ttl)}</b><span>${esc(sub)}</span></div></div>`;
      g.innerHTML=row(d.prefs?.ok,'Preferencias',d.prefs?.ok?'Válidas':'Revisión necesaria')+row(d.state?.ok,'Estado principal',d.state?.ok?'Legible':'No legible')+row(d.state?.backup,'Copia de seguridad',d.state?.backup?'Disponible':'No disponible')+row(d.prime?.iconIco&&d.prime?.iconPng,'Marca Prime',d.prime?.legacyLogoDir||d.prime?.legacyThemeFile?'Quedan residuos':'Limpia')+row(!d.renderer?.nodeIntegration,'Aislamiento del renderer',d.renderer?.nodeIntegration?'Legacy: Node integration activa; requiere migración futura':'Aislado');
      g.insertAdjacentHTML('beforeend',`<div class="q51-card"><b>Nova ${esc(d.version)}</b><span>Chromium ${esc(d.chromium)} · Electron ${esc(d.electron)}</span></div>`);
    };

    N.PG.reader51 = async r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">FOCUS</div><h2>Modo lectura</h2><p>Reduce elementos de interfaz en la página web actual para facilitar la lectura.</p><div class="q51-card"><button class="q51-btn" id="q51-reader-on">Activar en la página actual</button><button class="q51-btn" id="q51-reader-off">Desactivar</button></div></div>';
      $('#q51-reader-on').onclick=()=>{const t=N.activeWebTab?.();if(!t?.wv)return toast('Abre una página web');try{mod(t.wv,'reader',true);toast('Modo lectura activado')}catch{toast('No se pudo activar')}};
      $('#q51-reader-off').onclick=()=>{const t=N.activeWebTab?.();if(!t?.wv)return;try{mod(t.wv,'reader',false);toast('Modo lectura desactivado')}catch{}};
    };

    N.PG.news51 = r => {
      r.innerHTML=`<div class="q51-page"><div class="q51-eyebrow">NOVA NEWS</div><h2>Novedades actuales</h2><p>Esta vista solo muestra el ciclo actual y la historia recontextualizada del proyecto.</p><div class="q51-grid"><div class="q51-card"><b>Nova 5.1.0 Quantum Hotfix</b><span>Ajustes limpios, recuperación de configuración, diagnóstico, actualización y eliminación de restos de temas/logos antiguos.</span></div><div class="q51-card"><b>Nova 5.0.0 Quantum Prime</b><span>Base visual Prime, sidebar calmada, menú compacto, favicons reales, rendimiento y ahorro de energía.</span></div><div class="q51-card"><b>Nova 3.1 — Legacy Foundation</b><span>Recontextualizada como etapa fundacional: consolidó la navegación modular y dejó capacidades que hoy se mantienen bajo capas Prime.</span></div><div class="q51-card"><b>Nova 3.0 — Legacy Foundation</b><span>Recontextualizada como salto estructural histórico: introdujo una base de herramientas y páginas internas que luego evolucionaron hacia Quantum.</span></div></div></div>`;
    };

    N.PG.actions51 = r => {
      r.innerHTML='<div class="q51-page"><div class="q51-eyebrow">COMMAND</div><h2>Acciones rápidas</h2><p>Busca funciones y abre herramientas sin llenar la barra.</p><div class="q51-grid" id="q51-actions-grid"></div></div>';
      const acts=[['Nueva pestaña','new'],['Favoritos','fav'],['Historial','history'],['Descargas','downloads'],['Workspaces','work'],['Extensiones','ext'],['Rendimiento','perf'],['Modo lectura','reader51'],['Actualizaciones','updates51'],['Diagnóstico','diagnostics51'],['Copias de seguridad','backup51'],['Ajustes','quantumsettings']];
      const g=$('#q51-actions-grid');g.innerHTML=acts.map(([n,k])=>`<button class="q51-card q51-action" data-a="${k}"><b>${n}</b><span>Abrir</span></button>`).join('');g.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='new')newTab();else if(a==='fav')feature('marcadores');else if(a==='history')feature('historial');else if(a==='downloads')feature('descargas2');else if(a==='work')feature('workspaces44');else if(a==='ext')feature('extensiones44');else if(a==='perf')feature('rendimiento44');else feature(a)});
    };
    N.PG.ajustes = N.PG.quantumsettings;
  }

  // Hide and neutralize legacy visible routes/actions.
  const legacyNames=['personalizar','fondos','mods','tienda','bienvenida'];
  legacyNames.forEach(k=>{ if(N.PG) N.PG[k]=N.PG.quantumsettings; });
  try { N.LG={quantum:'Nova Quantum'}; N.setLogo=()=>{S.logo='quantum';saveSafe();try{refreshNT?.()}catch{}}; } catch {}
  N.welcome=()=>{S.welcomed=1;S.done=1;saveSafe();feature('quantumsettings')};
  N.tour=()=>feature('quantumsettings');
  N.resolveFeatureRoute('ajustes');

  function cleanUI(){
    document.querySelectorAll('#mn,#mnp,#nova22-top-tools,.nova22-topbtn,.n40-dock,.th,.lg,.pal,.apx,[data-t="win95"],[data-t="undertale"],[data-t="cyberpunk"],[data-t="neon"]').forEach(e=>e.classList.add('q51-hidden'));
    const textTargets=document.querySelectorAll('button,span,h2,h3,div');
    textTargets.forEach(e=>{const tx=(e.textContent||'').trim();if(/Windows 95|Undertale|Cyberpunk|Neón|Retro 2009|Clásico|Órbita|Estrella|Cometa|Minimal/.test(tx)&&e.closest('.ipage'))e.classList.add('q51-hidden')});
  }
  // Ctrl+K command palette: tabs, favorites, history and settings.
  function palette(){
    let ov=$('#q51-palette'); if(ov){ov.classList.toggle('on'); if(ov.classList.contains('on'))setTimeout(()=>$('#q51-pal-input')?.focus(),10);return;}
    ov=document.createElement('div');ov.id='q51-palette';ov.innerHTML='<div class="q51-pal-box"><input id="q51-pal-input" placeholder="Buscar pestañas, favoritos, historial o acciones…" autocomplete="off"><div id="q51-pal-list"></div><div class="q51-pal-hint">Esc para cerrar · Enter para abrir</div></div>';document.body.appendChild(ov);
    const input=$('#q51-pal-input'), list=$('#q51-pal-list');
    const build=q=>{q=String(q||'').toLowerCase();const items=[];
      try{tabs.forEach(t=>{const title=t.el?.querySelector('span')?.textContent||'Nueva pestaña',url=t.wv?.getURL?.()||'';items.push({type:'Pestaña',label:title+' '+url,run:()=>sel(t)})})}catch{}
      try{(S.marks||[]).slice(0,20).forEach(m=>items.push({type:'Favorito',label:m.t||m.u,run:()=>newTab(m.u)}))}catch{}
      try{(S.hist||[]).slice(0,30).forEach(m=>items.push({type:'Historial',label:m.t||m.u,run:()=>newTab(m.u)}))}catch{}
      items.push({type:'Acción',label:'Ajustes',run:()=>feature('quantumsettings')},{type:'Acción',label:'Workspaces',run:()=>feature('workspaces44')},{type:'Acción',label:'Rendimiento',run:()=>feature('rendimiento44')},{type:'Acción',label:'Extensiones',run:()=>feature('extensiones44')},{type:'Acción',label:'Diagnóstico',run:()=>feature('diagnostics51')},{type:'Acción',label:'Actualizaciones',run:()=>feature('updates51')});
      const out=items.filter(x=>!q||x.label.toLowerCase().includes(q)||x.type.toLowerCase().includes(q)).slice(0,12);list.innerHTML=out.map((x,i)=>`<button class="q51-pal-item" data-i="${i}"><span>${esc(x.type)}</span><b>${esc(x.label.slice(0,120))}</b></button>`).join('')||'<div class="q51-pal-empty">Sin resultados</div>';list.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{out[+b.dataset.i].run();ov.classList.remove('on')});};
    input.oninput=()=>build(input.value);input.onkeydown=e=>{if(e.key==='Escape')ov.classList.remove('on');if(e.key==='Enter'){list.querySelector('.q51-pal-item')?.click()}};build('');ov.classList.add('on');
    ov.onclick=e=>{if(e.target===ov)ov.classList.remove('on')};
  }
  window.addEventListener('keydown',e=>{if(e.ctrlKey&&!e.altKey&&!e.shiftKey&&String(e.key).toLowerCase()==='k'){e.preventDefault();palette()}},true);
  document.addEventListener('DOMContentLoaded',()=>{cleanUI();setTimeout(cleanUI,300);setTimeout(cleanUI,1000);}, {once:true});
  try { document.head.insertAdjacentHTML('beforeend', `<style id="q51-style">
    #q51-toast{position:fixed;left:50%;bottom:18px;transform:translate(-50%,10px);opacity:0;pointer-events:none;transition:opacity .16s,transform .16s;background:var(--bar);color:var(--fg);border:1px solid var(--bd);border-radius:10px;padding:9px 13px;box-shadow:0 14px 42px #0003;z-index:2000}#q51-toast.on{opacity:1;transform:translate(-50%,0)}
    .q51-settings,.q51-page{max-width:860px;margin:0 auto;padding:22px 0 40px;display:flex;flex-direction:column;gap:14px}.q51-settings header,.q51-page>header{padding:8px 4px 10px}.q51-eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);font-weight:800}.q51-settings h2,.q51-page h2{margin:4px 0;font-size:28px}.q51-settings header p,.q51-page>p{margin:0;color:var(--mut);line-height:1.55}.q51-card{background:color-mix(in srgb,var(--bar) 92%,transparent);border:1px solid var(--bd);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;box-shadow:0 10px 26px rgba(0,0,0,.04)}.q51-card h3{margin:0;font-size:15px}.q51-card p,.q51-card span{color:var(--mut);font-size:12px;line-height:1.5}.q51-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.q51-row>div{display:flex;flex-direction:column;gap:3px}.q51-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.q51-seg button,.q51-btn,.q51-switch{border:1px solid var(--bd);background:transparent;color:var(--fg);border-radius:10px;padding:9px 11px;font:inherit;cursor:pointer}.q51-seg button.on,.q51-btn:hover,.q51-switch.on{border-color:color-mix(in srgb,var(--acc) 50%,var(--bd));background:color-mix(in srgb,var(--acc) 8%,transparent);color:var(--acc)}.q51-switch{min-width:86px}.q51-actions{display:flex;flex-wrap:wrap;gap:8px}.q51-settings footer{font-size:11px;color:var(--mut);padding:5px}.q51-status{display:flex;flex-direction:column;gap:4px}.q51-status b{font-size:16px}.q51-status.good b{color:#2f9b70}.q51-status.bad b{color:#c05b5b}.q51-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.q51-ditem{flex-direction:row;align-items:center;gap:10px}.q51-dot{width:9px;height:9px;border-radius:50%;background:#d1d5db;flex:none}.q51-dot.good{background:#3db68a}.q51-dot.warn{background:#d59b43}.q51-action{text-align:left;cursor:pointer}.q51-action b,.q51-action span{display:block}.q51-action b{color:var(--fg)}.q51-hidden{display:none!important}
    #q51-palette{position:fixed;inset:0;background:rgba(15,17,22,.28);backdrop-filter:blur(5px);display:none;place-items:start center;padding-top:10vh;z-index:2100}.q-dark #q51-palette{background:rgba(0,0,0,.42)}#q51-palette.on{display:grid}.q51-pal-box{width:min(720px,92vw);background:var(--bar);border:1px solid var(--bd);border-radius:16px;box-shadow:0 28px 90px #0004;overflow:hidden}.q51-pal-box input{width:100%;border:0;border-bottom:1px solid var(--bd);background:transparent;color:var(--fg);outline:0;padding:15px 17px;font-size:14px}.q51-pal-item{display:grid;grid-template-columns:80px 1fr;gap:10px;width:100%;text-align:left;border:0;background:transparent;color:var(--fg);padding:10px 15px;cursor:pointer}.q51-pal-item:hover{background:color-mix(in srgb,var(--acc) 8%,transparent)}.q51-pal-item span{color:var(--mut);font-size:10px;text-transform:uppercase;letter-spacing:.08em}.q51-pal-item b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.q51-pal-empty{padding:16px;color:var(--mut)}.q51-pal-hint{padding:9px 15px;color:var(--mut);font-size:10px;border-top:1px solid var(--bd)}
    @media(max-width:700px){.q51-grid{grid-template-columns:1fr}.q51-row{align-items:flex-start;flex-direction:column}.q51-seg{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){#q51-toast,.q51-card,.q51-pal-item{transition:none!important}}
  </style>`)} catch {}

  // Make Nova's old logo/menus impossible to re-enable through old modules.
  try { Object.keys(THEMES).forEach(k=>{if(k!=='nova')delete THEMES[k]}); } catch {}
  try { document.body.classList.add('quantum-prime'); } catch {}
})();
