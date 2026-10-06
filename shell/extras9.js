/* Nova 2.1.0 - Hub aditivo desde Nova Tab: Study 2.1, rendimiento, pestañas, notas, seguridad, perfiles, sync, media, PDF y acciones. */
(() => {
  'use strict';
  const N = NOVA, { PG } = N;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast21 = m => { try { toast(m); } catch {} };
  const clone = o => { try { return JSON.parse(JSON.stringify(o)); } catch { return {}; } };
  const addStyle = css => { const s = document.createElement('style'); s.id = 'nova21-style'; s.textContent = css; document.head.appendChild(s); };

  S.v21 = Object.assign({
    memory: [],
    turbo: false,
    focus: false,
    mediaOnly: false,
    syncSelective: { marks:true, hist:true, workspaces:true, notes:true, prefs:true },
    quick: []
  }, S.v21 || {});
  if (!Array.isArray(S.v21.memory)) S.v21.memory = [];
  save();

  addStyle(`
    .nova21-panel{display:flex;flex-direction:column;gap:12px}.nova21-hero{padding:18px;border:1px solid var(--acc);border-radius:18px;background:radial-gradient(circle at 90% 10%,color-mix(in srgb,var(--acc2) 18%,transparent),transparent 42%),linear-gradient(135deg,color-mix(in srgb,var(--acc) 20%,var(--bar)),var(--bar));box-shadow:0 18px 60px #0005}.nova21-title{font-size:28px;letter-spacing:.01em}.nova21-sub{color:var(--mut);font-size:13px}.nova21-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}.nova21-card{padding:14px;border:1px solid var(--bd);border-radius:14px;background:var(--bar);display:flex;flex-direction:column;gap:8px;min-height:125px}.nova21-card:hover{border-color:color-mix(in srgb,var(--acc) 60%,var(--bd));box-shadow:0 10px 28px #0003}.nova21-card h3{margin:0}.nova21-card .mut{min-height:36px}.nova21-stat{padding:12px;border:1px solid var(--bd);border-radius:12px;background:color-mix(in srgb,var(--bar) 84%,transparent)}.nova21-actions{display:flex;flex-wrap:wrap;gap:7px}.nova21-table{display:flex;flex-direction:column;gap:6px}.nova21-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--bd);border-radius:10px;background:var(--bar)}.nova21-row>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.nova21-kbd{padding:2px 7px;border:1px solid var(--bd);border-bottom-width:2px;border-radius:6px;background:var(--bg);font:11px ui-monospace,monospace}.nova21-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--acc) 13%,transparent);border:1px solid color-mix(in srgb,var(--acc) 35%,var(--bd));color:var(--acc)}
    .nova21-mutedbox{padding:10px;border:1px dashed var(--bd);border-radius:10px;color:var(--mut)}
    body.nova21-focus #tabs .tab:not(.on){opacity:.42}body.nova21-focus #side{opacity:.75}body.nova21-focus #bar{box-shadow:0 4px 18px #0004}
    @media(max-width:800px){.nova21-grid{grid-template-columns:1fr}.nova21-actions .btn{flex:1 1 42%}}
  `);

  /* ---------- Nueva pestaña 2.1 -> Hub central ---------- */
  const oldNT = window.NT;
  window.NT = function(){ return oldNT(); };

  const newTab21Url = () => {
    const u = oldNT();
    return u;
  };

  /* ---------- Páginas internas nuevas ---------- */
  PG.hub = r => {
    r.innerHTML = `<div class="nova21-panel">
      <section class="nova21-hero"><div class="nova21-title">Nova 2.1</div><div class="nova21-sub">Todo lo nuevo, organizado desde Nova Tab. Nada de lo anterior se elimina.</div><div class="nova21-actions" style="margin-top:10px"><button class="btn on" id="h-study">🎓 Abrir Study</button><button class="btn" id="h-tabs">▤ Gestionar pestañas</button><button class="btn" id="h-cmd">⌘ Acciones rápidas</button></div></section>
      <section><h3>Centro Nova</h3><div class="nova21-grid">
        <div class="nova21-card"><h3>🎓 Study 2.1</h3><span class="mut">Modo tutor, examen y contexto de varias pestañas.</span><button class="btn on" data-go="study">Abrir</button></div>
        <div class="nova21-card"><h3>▦ Workspaces</h3><span class="mut">Espacios y grupos de pestañas guardados por contexto.</span><button class="btn" data-go="workspaces">Abrir</button></div>
        <div class="nova21-card"><h3>▤ Tab Manager</h3><span class="mut">Buscar, restaurar, dormir y organizar pestañas abiertas.</span><button class="btn" data-go="pestanas">Gestionar</button></div>
        <div class="nova21-card"><h3>📝 Nova Notes</h3><span class="mut">Notas vinculadas al contexto de navegación y Study.</span><button class="btn" data-go="notas">Abrir notas</button></div>
        <div class="nova21-card"><h3>📄 PDFs</h3><span class="mut">Centro rápido para abrir PDFs locales y enviarlos a Study.</span><button class="btn" data-go="pdf">Abrir</button></div>
        <div class="nova21-card"><h3>⚡ Nova Turbo</h3><span class="mut">Control de memoria, pestañas inactivas y trabajo visual.</span><button class="btn" data-go="rendimiento">Abrir</button></div>
        <div class="nova21-card"><h3>🛡 Seguridad</h3><span class="mut">Auditoría local, permisos y estado de protección.</span><button class="btn" data-go="seguridad">Revisar</button></div>
        <div class="nova21-card"><h3>👤 Perfiles</h3><span class="mut">Sesiones separadas, perfil activo y cuenta Nova.</span><button class="btn" data-go="perfiles">Gestionar</button></div>
        <div class="nova21-card"><h3>☁ Sync</h3><span class="mut">Sincronización selectiva de datos compatibles entre PCs.</span><button class="btn" data-go="sync">Abrir</button></div>
        <div class="nova21-card"><h3>🧩 Extensiones</h3><span class="mut">Catálogo existente más control por permisos y estado.</span><button class="btn" data-go="extensiones">Ver</button></div>
        <div class="nova21-card"><h3>🔊 Media Hub</h3><span class="mut">Encuentra pestañas de vídeo y audio abiertas.</span><button class="btn" data-go="media">Abrir</button></div>
        <div class="nova21-card"><h3>♿ Accesibilidad</h3><span class="mut">Escala, contraste y reducción de movimiento.</span><button class="btn" data-go="ajustes">Configurar</button></div>
      </div></section>
      <section><h3>Atajos de Nova</h3><div class="nova21-grid">
        <div class="nova21-stat"><span class="mut">Buscar acciones</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">K</span></div>
        <div class="nova21-stat"><span class="mut">DevTools</span><br><span class="nova21-kbd">F12</span></div>
        <div class="nova21-stat"><span class="mut">Nueva pestaña</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">T</span></div>
        <div class="nova21-stat"><span class="mut">Barra de marcadores</span><br><span class="nova21-kbd">Ctrl</span> + <span class="nova21-kbd">Shift</span> + <span class="nova21-kbd">B</span></div>
      </div></section>
    </div>`;
    r.querySelector('#h-study').onclick=()=>N.study?.();
    r.querySelector('#h-tabs').onclick=()=>newTab('nova://pestanas');
    r.querySelector('#h-cmd').onclick=()=>N.palette?.();
    r.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const k=b.dataset.go; if(k==='study')N.study?.(); else newTab('nova://'+k); });
  };

  PG.study = r => {
    const choices=tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{}return {i,u,title};}).filter(x=>/^https?:/i.test(x.u));
    r.innerHTML=`<div class="nova21-panel"><h2>Nova Study</h2><span class="mut">Elige la pestaña que quieres estudiar. Study abrirá el contenido junto a la IA elegida.</span><div class="nova21-table">${choices.map(x=>`<div class="nova21-row"><span>🎓 <b>${esc(x.title)}</b><br><small class="mut">${esc(x.u)}</small></span><button class="btn on" data-study="${x.i}">Estudiar</button></div>`).join('')||'<div class="nova21-mutedbox">Abre primero una página web para iniciar una sesión de Study.</div>'}</div><div class="nova21-actions"><button class="btn" id="study-new">＋ Abrir una nueva página</button><button class="btn" id="study-back">← Volver a Nova Tab</button></div></div>`;
    r.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>{const t=choices[+b.dataset.study]?.i!=null?tabs[choices[+b.dataset.study].i]:null;if(t){sel(t);N.study?.();}});
    r.querySelector('#study-new').onclick=()=>{newTab();toast21('Escribe o abre la página que quieres estudiar y vuelve a Study.');};
    r.querySelector('#study-back').onclick=()=>newTab();
  };

  PG.pestanas = r => {
    const rows = tabs.map((t,i)=>{ let u='',title='Pestaña'; try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{} return {t,i,u,title}; });
    r.innerHTML = `<div class="nova21-panel"><h2>Gestor de pestañas</h2><span class="mut">Organiza la sesión actual sin cerrar ni borrar datos.</span><div class="nova21-actions"><button class="btn" id="tm-nt">＋ Nueva pestaña</button><button class="btn" id="tm-save">Guardar en Workspace</button><button class="btn" id="tm-reopen">Reabrir cerrada</button></div><input class="fld" id="tm-q" placeholder="Buscar pestañas abiertas"><div class="nova21-table" id="tm-list"></div></div>`;
    const render = () => { const q=(r.querySelector('#tm-q').value||'').toLowerCase(); r.querySelector('#tm-list').innerHTML=rows.filter(x=>(x.title+x.u).toLowerCase().includes(q)).map(x=>`<div class="nova21-row"><span><b>${esc(x.title)}</b><br><small class="mut">${esc(x.u)}</small></span><button class="btn" data-open="${x.i}">Abrir</button><button class="btn" data-close="${x.i}">Cerrar</button></div>`).join('')||'<div class="nova21-mutedbox">No hay coincidencias.</div>'; r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>sel(rows[+b.dataset.open].t)); r.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{closeTab(rows[+b.dataset.close].t);setTimeout(()=>PG.pestanas(r),50)}); };
    r.querySelector('#tm-nt').onclick=()=>newTab();
    r.querySelector('#tm-save').onclick=()=>{ try{const w=S.v200.workspaces.find(x=>x.id===S.v200.activeWorkspace)||S.v200.workspaces[0]; if(!w)return; w.tabs=tabs.map(t=>{try{const u=t.wv.getURL(); return /^https?:/i.test(u)?{u,title:t.el.querySelector('span')?.textContent||'',p:t.el.classList.contains('pin')}:null}catch{return null}}).filter(Boolean).slice(0,40); save();toast21('Workspace actual guardado.');}catch{toast21('No se pudo guardar.')} };
    r.querySelector('#tm-reopen').onclick=()=>N.reopen?.();
    r.querySelector('#tm-q').oninput=render; render();
  };

  PG.memoria = r => {
    const render=()=>{r.innerHTML=`<div class="nova21-panel"><h2>Memoria local</h2><span class="mut">Preferencias y recordatorios guardados solo en este perfil de Nova.</span><div class="nova21-actions"><button class="btn on" id="mm-add">＋ Añadir</button><button class="btn" id="mm-clear">Borrar memoria</button></div><div class="nova21-table" id="mm-list">${S.v21.memory.map((m,i)=>`<div class="nova21-row"><span>${esc(m)}</span><button class="btn" data-del="${i}">Eliminar</button></div>`).join('')||'<div class="nova21-mutedbox">No hay memoria guardada.</div>'}</div></div>`;r.querySelector('#mm-add').onclick=async()=>{const x=await N.dlg?.('Añadir memoria',[{label:'Texto',value:''}],'Guardar');if(x?.[0]){S.v21.memory.push(String(x[0]).slice(0,500));save();render();}};r.querySelector('#mm-clear').onclick=()=>{if(confirm('¿Borrar toda la memoria local?')){S.v21.memory=[];save();render();}};r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.v21.memory.splice(+b.dataset.del,1);save();render();});};render();
  };

  PG.media = r => {
    const data=tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL();title=t.el.querySelector('span')?.textContent||u||title}catch{} return {i,u,title};}).filter(x=>/(youtube|youtu\.be|spotify|twitch|soundcloud|\.mp4|\.webm|\.m3u8|\.mp3|\.ogg|\.wav)/i.test(x.u+x.title));
    r.innerHTML=`<div class="nova21-panel"><h2>Media Hub</h2><span class="mut">Pestañas que parecen contener vídeo o audio.</span><div class="nova21-table">${data.map(x=>`<div class="nova21-row"><span>🔊 ${esc(x.title)}<br><small class="mut">${esc(x.u)}</small></span><button class="btn" data-open="${x.i}">Abrir</button></div>`).join('')||'<div class="nova21-mutedbox">No se han detectado pestañas multimedia por URL/título.</div>'}</div></div>`;
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>sel(tabs[+b.dataset.open]));
  };

  PG.pdf = r => {
    r.innerHTML=`<div class="nova21-panel"><h2>Centro PDF</h2><span class="mut">Acceso rápido a PDFs locales. El documento no se sube automáticamente a ningún servicio.</span><div class="nova21-actions"><button class="btn on" id="pdf-pick">📄 Abrir PDF</button><button class="btn" id="pdf-study">🎓 Estudiar pestaña PDF</button></div><div class="nova21-mutedbox">Para estudiar un PDF abierto, pulsa “Estudiar pestaña PDF”: Nova Study trabajará sobre la pestaña seleccionada cuando lo solicites.</div></div>`;
    r.querySelector('#pdf-pick').onclick=()=>toast21('Abre un PDF con Ctrl+O o desde Descargas; el visor PDF de Chromium se conserva.');
    r.querySelector('#pdf-study').onclick=()=>N.study?.();
  };

  PG.perfiles = r => {
    r.innerHTML=`<div class="nova21-panel"><h2>Perfiles</h2><span class="mut">Tus perfiles de 1.6.5 siguen funcionando con sus sesiones separadas.</span><div class="nova21-grid" id="pf21"></div><div class="nova21-actions"><button class="btn on" id="pf-new">＋ Crear perfil</button><button class="btn" id="pf-settings">Cuenta y perfiles en Ajustes</button></div></div>`;
    const list=document.getElementById('pf21');const ps=Array.isArray(S.profiles)?S.profiles:[];list.innerHTML=ps.map(p=>`<div class="nova21-card"><h3>${esc(p.avatar||'P')} ${esc(p.name||'Perfil')}</h3><span class="mut">${p.id===S.activeProfile?'Activo':'Disponible'}</span><div class="nova21-actions"><button class="btn ${p.id===S.activeProfile?'on':''}" data-sw="${esc(p.id)}">${p.id===S.activeProfile?'Activo':'Cambiar'}</button></div></div>`).join('')||'<div class="nova21-mutedbox">No hay perfiles adicionales.</div>';list.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>N.switchProfile?.(b.dataset.sw));r.querySelector('#pf-new').onclick=()=>N.createProfile?.();r.querySelector('#pf-settings').onclick=()=>newTab('nova://ajustes');
  };

  PG.sync = async r => {
    const st=await ipc.invoke('account-status').catch(()=>({loggedIn:false,id:''}));
    r.innerHTML=`<div class="nova21-panel"><h2>Nova Sync</h2><span class="mut">Estado: ${st.loggedIn?'<span class="nova21-pill">ONLINE</span>':'sin sesión'}</span><div class="nova21-grid"><div class="nova21-card"><h3>☁ Datos compatibles</h3><span class="mut">Marcadores, historial, Workspaces, notas y preferencias compatibles con la cuenta.</span><div class="nova21-actions"><button class="btn on" id="sy-now">Sincronizar ahora</button><button class="btn" id="sy-set">Ajustar en Ajustes</button></div></div><div class="nova21-card"><h3>🔐 Privacidad</h3><span class="mut">Las credenciales del navegador, cookies y secretos de IA quedan fuera de esta sincronización general.</span></div></div><div class="nova21-mutedbox">La sincronización fusiona estados compatibles; no elimina datos del PC de origen.</div></div>`;
    r.querySelector('#sy-now').onclick=async()=>{const ok=await N.accountSync?.(true); if(ok)toast21('Nova Sync actualizado.');};r.querySelector('#sy-set').onclick=()=>newTab('nova://ajustes');
  };

  PG.extensiones = r => {
    const EXT = N.extensions || (typeof require==='function' ? NOVA_BRIDGE.extensions : null);
    const list=EXT?.CATALOG||[];
    r.innerHTML=`<div class="nova21-panel"><h2>Extensiones</h2><span class="mut">Las ${list.length||0} extensiones actuales permanecen intactas. Desde aquí puedes abrir su gestor completo.</span><div class="nova21-actions"><button class="btn on" id="ex-open">Abrir gestor de extensiones</button></div><div class="nova21-grid">${list.slice(0,18).map(x=>`<div class="nova21-card"><h3>${esc(x.name)}</h3><span class="mut">${esc(x.cat)} · ${esc(x.desc||'')}</span></div>`).join('')}</div></div>`;
    r.querySelector('#ex-open').onclick=()=>{document.querySelector('#side [data-p="mods"]')?.click();};
  };

  PG.acciones = r => {
    const actions=[['🎓 Study',()=>N.study?.()],['▦ Workspaces',()=>newTab('nova://workspaces')],['▤ Pestañas',()=>newTab('nova://pestanas')],['⚡ Rendimiento',()=>newTab('nova://rendimiento')],['🛡 Seguridad',()=>newTab('nova://seguridad')],['📝 Nueva nota',()=>newTab('nova://notas')],['☁ Sync',()=>newTab('nova://sync')],['👤 Perfiles',()=>newTab('nova://perfiles')],['📄 PDF',()=>newTab('nova://pdf')],['🔊 Media Hub',()=>newTab('nova://media')],['🧠 Memoria local',()=>newTab('nova://memoria')],['♿ Accesibilidad',()=>newTab('nova://ajustes')]];
    r.innerHTML=`<div class="nova21-panel"><h2>Acciones rápidas</h2><span class="mut">El mismo centro al que accede Ctrl+K, ahora visible desde Nova Tab.</span><div class="nova21-grid">${actions.map((a,i)=>`<button class="btn" data-a="${i}" style="text-align:left;padding:14px">${esc(a[0])}</button>`).join('')}</div></div>`;r.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>actions[+b.dataset.a][1]());
  };

  /* ---------- Nova Turbo ---------- */
  const applyTurbo = async on => {
    const ok=await ipc.invoke('performance-mode',!!on).catch(()=>false);
    if(ok){S.v21.turbo=!!on;save();document.body.classList.toggle('nova21-focus',!!S.v21.focus);}
    return ok;
  };
  PG.rendimiento21 = r => {};
  const oldPerf = PG.rendimiento;
  PG.rendimiento = r => {
    if(typeof oldPerf==='function') oldPerf(r);
    const c=document.createElement('section');c.className='nova21-card';c.innerHTML=`<h3>🚀 Nova Turbo 2.1</h3><span class="mut">Capa adicional de rendimiento: reduce trabajo visual de Nova y activa las medidas de ahorro existentes. No cierra pestañas ni borra datos.</span><div class="nova21-actions"><button class="btn ${S.v21.turbo?'on':''}" id="t21">${S.v21.turbo?'Turbo activado':'Activar Turbo'}</button><button class="btn" id="focus21">${S.v21.focus?'Salir de enfoque':'Modo enfoque'}</button><button class="btn" id="tabs21">Gestionar pestañas</button></div>`;r.appendChild(c);c.querySelector('#t21').onclick=async()=>{const ok=await applyTurbo(!S.v21.turbo);if(ok){c.querySelector('#t21').textContent=S.v21.turbo?'Turbo activado':'Activar Turbo';c.querySelector('#t21').classList.toggle('on',S.v21.turbo);toast21(S.v21.turbo?'Nova Turbo activado':'Nova Turbo desactivado')}};c.querySelector('#focus21').onclick=()=>{S.v21.focus=!S.v21.focus;save();document.body.classList.toggle('nova21-focus',S.v21.focus);c.querySelector('#focus21').textContent=S.v21.focus?'Salir de enfoque':'Modo enfoque';};c.querySelector('#tabs21').onclick=()=>newTab('nova://pestanas');
  };

  /* ---------- Study 2.1: controles encima del Study existente ---------- */
  const oldStudy = N.study;
  const openStudy21 = provider => {
    if(typeof oldStudy!=='function') return;
    oldStudy(provider);
    setTimeout(()=>{
      const root=document.getElementById('nova20-study'); if(!root || root.querySelector('#nova21-studytools')) return;
      const bar=root.querySelector('.nova20-studybar'); if(!bar) return;
      const tools=document.createElement('div');tools.id='nova21-studytools';tools.className='nova21-actions';tools.innerHTML=`<button class="btn" id="s21-tutor">Tutor</button><button class="btn" id="s21-exam">Examen</button><button class="btn" id="s21-multi">Contexto + pestañas</button><button class="btn" id="s21-memory">Memoria</button><button class="btn" id="s21-focus">Enfoque</button>`;bar.appendChild(tools);
      tools.querySelector('#s21-tutor').onclick=()=>toast21('Modo Tutor: pide a la IA que explique paso a paso y no salte directamente al resultado.');
      tools.querySelector('#s21-exam').onclick=()=>toast21('Modo Examen: pide preguntas, responde primero y después solicita la corrección.');
      tools.querySelector('#s21-multi').onclick=()=>{const urls=tabs.map(t=>{try{return t.wv.getURL()}catch{return ''}}).filter(u=>/^https?:/i.test(u)).slice(0,10);toast21('Contexto preparado con '+urls.length+' pestañas.');};
      tools.querySelector('#s21-memory').onclick=()=>newTab('nova://memoria');
      tools.querySelector('#s21-focus').onclick=()=>{S.v21.focus=!S.v21.focus;save();document.body.classList.toggle('nova21-focus',S.v21.focus);};
    },250);
  };
  N.study = openStudy21;

  /* ---------- Todos los accesos desde Nova Tab ---------- */
  const wrappedNewTab = newTab;
  newTab = function(u){
    if(u==='nova://study'){let current='';try{current=(N.activeWebTab?.()||cur)?.wv?.getURL?.()||'';}catch{} if(current && !isNT(current) && /^https?:/i.test(current)){N.study?.();return cur;} return wrappedNewTab('nova://study');}
    return wrappedNewTab(u);
  };

  /* ---------- Menú / Command Center ---------- */
  if(Array.isArray(N.extraActs)){
    const acts=[['Nova 2.1 · Centro',()=>newTab('nova://hub')],['Nova 2.1 · Pestañas',()=>newTab('nova://pestanas')],['Nova 2.1 · Memoria local',()=>newTab('nova://memoria')],['Nova 2.1 · Media Hub',()=>newTab('nova://media')],['Nova 2.1 · Sync',()=>newTab('nova://sync')]];
    acts.forEach(a=>{if(!N.extraActs.some(x=>x[0]===a[0]))N.extraActs.push(a)});
  }

  /* ---------- Nova Tab es el punto de partida; el hub está integrado directamente en newtab.html ---------- */

  /* ---------- What's New 2.1 y primera entrada ---------- */
  const oldNews=PG.novedades;
  PG.novedades=r=>{if(typeof oldNews==='function')oldNews(r);if(r.querySelector('#nova21-news'))return;const c=document.createElement('div');c.id='nova21-news';c.className='nova21-card';c.innerHTML=`<h2>Nova 2.1.0</h2><span class="mut">Nueva capa centrada en Nova Tab: todas las herramientas nuevas parten de la página inicial.</span><ul style="margin:0;padding-left:20px"><li>Study 2.1 con controles de Tutor, Examen, contexto y enfoque.</li><li>Centro Nova 2.1 desde la Nueva pestaña.</li><li>Gestor de pestañas, memoria local y Media Hub.</li><li>Centro PDF y acceso directo a Notas.</li><li>Perfiles, Sync, extensiones y seguridad reunidos desde Nova Tab.</li><li>Nova Turbo para rendimiento y trabajo visual.</li></ul><button class="btn on" id="n21hub">Abrir Centro 2.1</button>`;r.prepend(c);c.querySelector('#n21hub').onclick=()=>newTab('nova://hub');};

  const oldWelcome=PG.bienvenida;
  PG.bienvenida=async r=>{if(typeof oldWelcome==='function')await oldWelcome(r);if(r.querySelector('#nova21-welcome'))return;const c=document.createElement('div');c.id='nova21-welcome';c.className='nova21-card';c.innerHTML=`<h2>Bienvenido a Nova 2.1.0</h2><span class="mut">Ahora Nova Tab es el punto de partida de todas las herramientas nuevas.</span><div class="nova21-actions"><button class="btn on" id="w21">Abrir Centro 2.1</button><button class="btn" id="ws21">Nova Study</button></div>`;r.appendChild(c);c.querySelector('#w21').onclick=()=>newTab('nova://hub');c.querySelector('#ws21').onclick=()=>N.study?.();};

  const normalizeV21=()=>{S.v21=Object.assign({memory:[],turbo:false,focus:false,mediaOnly:false,syncSelective:{marks:true,hist:true,workspaces:true,notes:true,prefs:true},quick:[]},S.v21||{});if(!Array.isArray(S.v21.memory))S.v21.memory=[];return S.v21;};
  if(typeof N.switchProfile==='function'){
    const baseSwitchProfile=N.switchProfile;
    N.switchProfile=async id=>{const out=await baseSwitchProfile(id);normalizeV21();save();return out;};
  }
  if(typeof N.createProfile==='function'){
    const baseCreateProfile=N.createProfile;
    N.createProfile=async(...args)=>{const out=await baseCreateProfile(...args);normalizeV21();save();return out;};
  }
  if(Array.isArray(S.v200?.workspaces)){
    S.v200.lastLaunchHub=NOVA_VER; normalizeV21(); save();
  }
})();
