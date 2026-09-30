/* Nova 2.2.0 - capa aditiva: barra superior, vista dividida, menú web robusto, perfiles, zoom, primer inicio, novedades y actualizaciones directas. */
(() => {
  const esc22 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast22 = m => { try { toast(m); } catch {} };
  S.v22 = Object.assign({ firstRunGuide:false, defaultPromptSeen:false, zoom:100, topOpen:false }, S.v22 || {});
  const save22 = () => { try { save(); } catch {} };

  // ---------- Barra superior: todas las funciones principales ----------
  const tools = document.getElementById('nova22-top-tools');
  const topPop = document.createElement('div'); topPop.id='nova22-top-pop'; document.body.appendChild(topPop);
  const topBtn = document.createElement('button'); topBtn.id='nova22-main-btn'; topBtn.className='nova22-topbtn'; topBtn.textContent='✦ Nova'; topBtn.title='Nova Tab, Study, vista dividida, perfiles, zoom y más'; tools?.appendChild(topBtn);
  const zoomBtn = document.createElement('button'); zoomBtn.id='nova22-zoom-btn'; zoomBtn.className='nova22-topbtn'; zoomBtn.textContent='100%'; zoomBtn.title='Zoom de la página actual'; tools?.appendChild(zoomBtn);

  const topItems = [
    ['⌂','Nova Tab',()=>newTab()],
    ['🎓','Study',()=>N.study?.()],
    ['▥','Vista dividida',()=>N.splitView?.()],
    ['👤','Perfiles',()=>openProfiles22()],
    ['📝','Notas',()=>newTab('nova://notas')],
    ['▦','Workspaces',()=>newTab('nova://workspaces')],
    ['⚡','Rendimiento',()=>newTab('nova://rendimiento')],
    ['🛡','Seguridad',()=>newTab('nova://seguridad')],
    ['📰','Novedades',()=>newTab('nova://novedades')],
    ['↻','Buscar actualizaciones',()=>checkUpdates22(true)]
  ];
  topPop.innerHTML = topItems.map((x,i)=>`<button class="nova22-menuitem" data-ti="${i}"><span style="width:24px;text-align:center">${x[0]}</span><span>${esc22(x[1])}</span></button>`).join('');
  topPop.querySelectorAll('[data-ti]').forEach(b=>b.onclick=()=>{ topPop.classList.remove('on'); topBtn.classList.remove('on'); topItems[+b.dataset.ti][2](); });
  topBtn.onclick=e=>{e.stopPropagation();const on=!topPop.classList.contains('on');topPop.classList.toggle('on',on);topBtn.classList.toggle('on',on);zoomPop.classList.remove('on');profilePop.classList.remove('on');};

  // ---------- Zoom real ----------
  const zoomPop=document.createElement('div'); zoomPop.id='nova22-zoom-pop'; document.body.appendChild(zoomPop);
  zoomPop.innerHTML=`<div class="row"><b>Zoom</b><button class="btn" id="zreset">Restablecer</button></div><div class="nova22-zoomrow" style="margin-top:8px"><button class="btn" id="zminus">−</button><div class="nova22-zoompct" id="zpct">100%</div><button class="btn" id="zplus">+</button></div><div class="mut" style="margin-top:7px">Ctrl + + / Ctrl + − · Ctrl + 0</div>`;
  const zoomFactor=()=>{try{return Math.max(.25,Math.min(5,Number(cur?.wv?.getZoomFactor?.()||1)))}catch{return 1}};
  const paintZoom=()=>{const n=Math.round(zoomFactor()*100);zoomBtn.textContent=n+'%';zoomPop.querySelector('#zpct').textContent=n+'%';S.v22.zoom=n;save22();};
  const setZoom22=n=>{try{cur?.wv?.setZoomFactor?.(Math.max(.25,Math.min(5,n)));paintZoom();}catch{toast22('Este contenido no permite cambiar el zoom.')}};
  zoomBtn.onclick=e=>{e.stopPropagation();const on=!zoomPop.classList.contains('on');zoomPop.classList.toggle('on',on);topPop.classList.remove('on');profilePop.classList.remove('on');paintZoom();};
  zoomPop.querySelector('#zminus').onclick=()=>setZoom22(zoomFactor()-.1);
  zoomPop.querySelector('#zplus').onclick=()=>setZoom22(zoomFactor()+.1);
  zoomPop.querySelector('#zreset').onclick=()=>setZoom22(1);
  ipc.on('zoom-changed',(_,d)=>{ if(d?.factor) paintZoom(); });

  // ---------- Perfiles en ventana principal: botón siempre funcional ----------
  const profilePop=document.createElement('div'); profilePop.id='nova22-profile-fallback'; profilePop.style.cssText='position:fixed;top:42px;right:105px;z-index:250;display:none;min-width:270px;padding:9px;background:var(--bar);border:1px solid var(--bd);border-radius:14px;box-shadow:0 24px 80px #000c'; document.body.appendChild(profilePop);
  const profileBtn=document.getElementById('nova-profile-button');
  if(profileBtn){profileBtn.style.zIndex='180';profileBtn.style.webkitAppRegion='no-drag';profileBtn.title='Perfiles Nova';}
  const currentProfile22=()=>S.profiles?.find?.(p=>p.id===S.activeProfile)||S.profiles?.[0]||{name:'Principal',avatar:'N'};
  function drawProfiles22(){
    const cp=currentProfile22(), list=Array.isArray(S.profiles)?S.profiles:[];
    profilePop.innerHTML=`<div class="mut" style="padding:5px 8px 9px">Perfil activo · <b>${esc22(cp.name)}</b></div>${list.map(p=>`<button class="nova22-menuitem" data-pid="${esc22(p.id)}"><span style="width:24px;text-align:center;border-radius:50%;background:var(--acc);color:#fff;padding:4px 0;font-size:10px">${esc22(p.avatar||p.name?.slice(0,1)||'P')}</span><span style="flex:1">${esc22(p.name||'Perfil')}</span>${p.id===S.activeProfile?'✓':''}</button>`).join('')}<hr class="nova22-ctxsep"><button class="nova22-menuitem" id="pf-create22"><span style="width:24px">＋</span><span>Crear perfil</span></button><button class="nova22-menuitem" id="pf-manage22"><span style="width:24px">⚙</span><span>Administrar perfiles</span></button>`;
    profilePop.querySelectorAll('[data-pid]').forEach(b=>b.onclick=async()=>{profilePop.style.display='none';try{await N.switchProfile?.(b.dataset.pid);toast22('Perfil cambiado.');setTimeout(()=>{try{paintZoom()}catch{}},150)}catch{toast22('No se pudo cambiar de perfil.')}});
    profilePop.querySelector('#pf-create22').onclick=async()=>{try{await N.createProfile?.();drawProfiles22();}catch{}};
    profilePop.querySelector('#pf-manage22').onclick=()=>{profilePop.style.display='none';newTab('nova://perfiles');};
  }
  const openProfiles22=()=>{drawProfiles22();profilePop.style.display=profilePop.style.display==='block'?'none':'block';topPop.classList.remove('on');zoomPop.classList.remove('on');};
  if(profileBtn) profileBtn.onclick=e=>{e.preventDefault();e.stopPropagation();openProfiles22();};
  else { const b=document.createElement('button');b.className='nova22-topbtn';b.textContent='👤';b.title='Perfiles Nova';b.onclick=openProfiles22;tools?.appendChild(b); }
  document.addEventListener('click',e=>{if(!profilePop.contains(e.target)&&!e.target.closest('#nova-profile-button'))profilePop.style.display='none';if(!topPop.contains(e.target)&&!e.target.closest('#nova22-main-btn'))topPop.classList.remove('on');if(!zoomPop.contains(e.target)&&!e.target.closest('#nova22-zoom-btn'))zoomPop.classList.remove('on');});

  // ---------- Vista dividida ----------
  let split=null;
  const cleanHttp=u=>{try{const x=new URL(String(u||''));return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
  function closeSplit22(){
    if(!split)return;
    try{const {t,left,right,host}=split;right?.remove();host?.remove();const view=document.getElementById('view');if(view&&left&&left.parentNode===host){};if(view&&t?.wv){view.appendChild(t.wv);Object.assign(t.wv.style,{position:'absolute',left:'',top:'',right:'',bottom:'',width:'',height:'',display:''});t.wv.classList.add('on');} }catch{}
    split=null; toast22('Vista dividida cerrada.');
  }
  async function splitView22(){
    if(split){closeSplit22();return;}
    if(!cur?.wv)return;
    const current=cleanHttp(cur.wv.getURL?.());
    let target='';
    try{const r=await N.dlg?.('Vista dividida',[{label:'Dirección del panel derecho',value:'https://www.google.com'}],'Abrir');if(!r)return;target=cleanHttp(r[0]);}catch{}
    if(!target)return toast22('Escribe una dirección HTTP o HTTPS.');
    const host=document.getElementById('nova22-split');if(!host)return;
    const t=cur;
    const left=document.createElement('div');left.className='nova22-split-pane nova22-split-left';
    const right=document.createElement('div');right.className='nova22-split-pane nova22-split-right';
    const head=document.createElement('div');head.className='nova22-split-head';head.innerHTML=`<b style="font-size:12px">Vista dividida</b><button class="btn" id="swap22">Intercambiar</button><button class="btn" id="close22">Cerrar</button>`;
    host.replaceChildren(head,left,right);host.style.display='block';
    document.getElementById('view').appendChild(host);
    left.appendChild(t.wv);
    Object.assign(t.wv.style,{position:'absolute',left:'0',top:'0',right:'0',bottom:'0',width:'100%',height:'100%',display:'flex'});
    const second=document.createElement('webview');second.setAttribute('partition',typeof profilePartition==='function'?profilePartition():'persist:web');second.src=target;right.appendChild(second);
    split={t,left,right,host,second};
    attachCtx22({wv:second});
    head.querySelector('#close22').onclick=closeSplit22;
    head.querySelector('#swap22').onclick=()=>{const a=t.wv,b=second;if(a.parentNode!==left||b.parentNode!==right)return;left.appendChild(b);right.appendChild(a);Object.assign(a.style,{left:'0',top:'0',width:'100%',height:'100%'});Object.assign(b.style,{left:'0',top:'0',width:'100%',height:'100%'});split.swapped=!split.swapped;};
    toast22('Vista dividida activa.');
  }
  N.splitView=splitView22;
  const baseSel22=sel; sel=t=>{if(split)closeSplit22();baseSel22(t);setTimeout(paintZoom,0);};
  const baseClose22=closeTab; closeTab=t=>{if(split?.t===t)closeSplit22();return baseClose22(t)};

  // ---------- Menú contextual web fallback ----------
  let webCtx=null, ctxTarget=null;
  function ensureWebCtx(){
    if(webCtx)return webCtx;
    webCtx=document.createElement('div');webCtx.id='nova22-webctx';document.body.appendChild(webCtx);
    document.addEventListener('click',e=>{if(!webCtx.contains(e.target))webCtx.classList.remove('on')},true);
    return webCtx;
  }
  const ctxAction=(label,fn,sep=false)=>({label,fn,sep});
  function showWebCtx22(t,d,x,y){
    ctxTarget={t,d}; const m=ensureWebCtx(); const acts=[];
    if(d.linkURL&&cleanHttp(d.linkURL)){acts.push(ctxAction('Abrir enlace en una pestaña nueva',()=>newTab(cleanHttp(d.linkURL))));acts.push(ctxAction('Copiar dirección del enlace',()=>require('electron').clipboard.writeText(cleanHttp(d.linkURL))));}
    if(d.mediaType==='image'&&cleanHttp(d.srcURL)){acts.push(ctxAction('Abrir imagen en una pestaña nueva',()=>newTab(cleanHttp(d.srcURL))));acts.push(ctxAction('Copiar dirección de la imagen',()=>require('electron').clipboard.writeText(cleanHttp(d.srcURL))));acts.push(ctxAction('Guardar imagen',()=>t.wv.downloadURL(cleanHttp(d.srcURL))));}
    if(d.isEditable){acts.push(ctxAction('Cortar',()=>t.wv.cut()));acts.push(ctxAction('Copiar',()=>t.wv.copy()));acts.push(ctxAction('Pegar',()=>t.wv.paste?.()));acts.push(ctxAction('Seleccionar todo',()=>t.wv.selectAll()));}
    if(d.selectionText){acts.push(ctxAction('Copiar selección',()=>t.wv.copy()));acts.push(ctxAction('Buscar selección',()=>{const u=cleanHttp(S.search+encodeURIComponent(d.selectionText.slice(0,1000)));if(u)newTab(u)}));acts.push(ctxAction('Explicar con Nova IA',()=>N.askSel?.(d.selectionText)));acts.push(ctxAction('Traducir con Nova IA',()=>N.askSel?.('Traduce al español:\n'+d.selectionText)));}
    if(acts.length)acts.push(ctxAction('',()=>{},true));
    try{const nav=t.wv.navigationHistory;acts.push(ctxAction('Atrás',()=>nav.canGoBack()&&nav.goBack()),ctxAction('Adelante',()=>nav.canGoForward()&&nav.goForward()),ctxAction('Recargar',()=>t.wv.reload()),ctxAction('Copiar dirección de la página',()=>require('electron').clipboard.writeText(t.wv.getURL())),ctxAction('Captura de pantalla',()=>$('#sh').click()),ctxAction('Inspeccionar elemento',()=>{const a=d.x||0,b=d.y||0;t.wv.inspectElement(a,b)}),ctxAction('Abrir DevTools (F12)',()=>t.wv.openDevTools?.()));}catch{}
    m.innerHTML=acts.map((a,i)=>a.sep?'<hr class="nova22-ctxsep">':`<button class="nova22-ctxitem" data-ci="${i}">${esc22(a.label)}</button>`).join('');
    m.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>{m.classList.remove('on');try{acts[+b.dataset.ci].fn()}catch{}});
    const w=innerWidth,h=innerHeight;const mw=260,mh=Math.min(420,m.innerHTML.length/2+80);m.style.left=Math.max(4,Math.min(x,w-mw))+'px';m.style.top=Math.max(4,Math.min(y,h-mh))+'px';m.classList.add('on');
  }
  function attachCtx22(t){
    if(!t?.wv||t.wv.__nova22ctx)return;t.wv.__nova22ctx=true;
    t.wv.addEventListener('console-message',e=>{if(!String(e.message||'').startsWith('NOVA_CTX22:'))return;let d;try{d=JSON.parse(String(e.message).slice(10))}catch{return}showWebCtx22(t,d,(t.wv.getBoundingClientRect().left||0)+(d.x||0),(t.wv.getBoundingClientRect().top||0)+(d.y||0));});
    const prefix='NOVA_CTX22:';
    const code=`(()=>{if(window.__NOVA_CTX22)return;window.__NOVA_CTX22=1;document.addEventListener('contextmenu',e=>{try{e.preventDefault();console.log(${JSON.stringify(prefix)}+JSON.stringify({x:e.clientX,y:e.clientY,selectionText:String(getSelection()||'').slice(0,6000),isEditable:!!e.target.closest?.('input,textarea,[contenteditable="true"]'),linkURL:(e.target.closest?.('a')?.href||''),mediaType:e.target.tagName==='IMG'?'image':'',srcURL:e.target.tagName==='IMG'?(e.target.currentSrc||e.target.src||''):''}))}catch{}} ,true)})()`;
    setTimeout(()=>t.wv.executeJavaScript(code).catch(()=>{}),80);
  }
  tabs.forEach(attachCtx22);
  const bn22=newTab; newTab=function(u){const t=bn22(u);setTimeout(()=>attachCtx22(t),120);return t;};

  // ---------- Primer inicio + navegador predeterminado ----------
  async function firstRun22(){
    if(S.v22.firstRunGuide)return;
    S.v22.firstRunGuide=true;save22();
    const box=document.createElement('div');box.id='nova22-first';document.body.appendChild(box);
    let isDefault=false, portable=false; try{const d=await ipc.invoke('default-browser',false);isDefault=!!d?.isDefault;portable=!!d?.portable}catch{}
    const render=()=>{box.classList.add('on');box.innerHTML=`<div class="row"><div><h2 style="margin:0">Bienvenido a Nova 2.2</h2><span class="mut">Una puesta a punto de las funciones que ya tienes, sin quitar nada.</span></div><button class="btn" id="first-close">Cerrar</button></div><div class="nova22-first-grid" style="margin-top:12px"><div class="nova22-first-card"><b>⚡ Barra superior</b><div class="mut">Nova Tab, Study, dividir, perfiles, zoom y más están a un clic.</div></div><div class="nova22-first-card"><b>↻ Actualizaciones</b><div class="mut">Nova puede comprobar y, en una instalación empaquetada, descargar la actualización sin desinstalar primero.</div></div><div class="nova22-first-card"><b>🧭 Navegador predeterminado</b><div class="mut">${portable?'El portable no puede registrarse como predeterminado.':isDefault?'Nova ya es tu navegador predeterminado.':'Te guío a la pantalla oficial de Windows para elegir Nova.'}</div><button class="btn ${isDefault||portable?'':'on'}" id="first-default" ${portable||isDefault?'disabled':''}>${isDefault?'Ya configurado':portable?'No disponible en portable':'Configurar Nova'}</button></div><div class="nova22-first-card"><b>◫ Vista dividida</b><div class="mut">Mantén dos páginas visibles en la misma ventana y cambia de lado cuando quieras.</div></div></div><div class="nova22-first-actions"><button class="btn on" id="first-ok">Entrar en Nova</button></div>`;
      box.querySelector('#first-close').onclick=()=>box.remove();box.querySelector('#first-ok').onclick=()=>box.remove();box.querySelector('#first-default').onclick=async()=>{await ipc.invoke('default-browser',true).catch(()=>{});toast22('Windows ha abierto la pantalla oficial de Aplicaciones predeterminadas.');};
    };render();
  }
  const firstPrefs=()=>{try{return S.v22.firstRunGuide!==true}catch{return true}};
  if(firstPrefs())setTimeout(firstRun22,1100);

  // Also add the default-browser guide to the existing welcome page without replacing it.
  const oldWelcome22=PG.bienvenida;
  PG.bienvenida=async r=>{
    if(typeof oldWelcome22==='function')await oldWelcome22(r);
    if(r.querySelector('#nova22-default-card'))return;
    const c=document.createElement('section');c.id='nova22-default-card';c.className='nova21-card';
    c.innerHTML='<h2>🧭 Navegador predeterminado</h2><span class="mut">Nova te puede guiar a la pantalla oficial de Windows para elegirlo como navegador predeterminado. Nova no cambia esa elección por ti.</span><div class="row" style="justify-content:flex-start;margin-top:8px"><button class="btn on" id="n22def">Configurar Nova</button><button class="btn" id="n22upw">Buscar actualizaciones</button></div>';
    r.appendChild(c);c.querySelector('#n22def').onclick=async()=>{const d=await ipc.invoke('default-browser',true).catch(()=>null);if(d?.portable)toast22('El portable no puede registrarse como navegador predeterminado.');else toast22('Abierta la configuración oficial de Windows.');};c.querySelector('#n22upw').onclick=()=>checkUpdates22(true);
  };

  // ---------- Novedades 2.2 ----------
  const oldNews22=PG.novedades;
  PG.novedades=r=>{
    if(typeof oldNews22==='function')oldNews22(r);
    if(r.querySelector('#nova22-news'))return;
    const c=document.createElement('section');c.id='nova22-news';c.className='nova21-card';
    c.innerHTML=`<h2>Nova 2.2.0</h2><span class="mut">Una actualización centrada en hacer más accesibles las funciones existentes y mejorar el ciclo de actualización.</span><ul style="margin:0;padding-left:20px"><li>Nuevo acceso en la barra superior a Nova Tab, Study, vista dividida, perfiles, zoom, novedades y actualizaciones.</li><li>Vista dividida para trabajar con dos páginas en la misma ventana, con intercambio de paneles y cierre limpio.</li><li>Menú contextual de webs reforzado con un fallback propio para enlaces, imágenes, selección, navegación y DevTools.</li><li>Perfiles accesibles directamente desde la ventana principal, con cambio y gestión desde el mismo menú.</li><li>Zoom real de la página con porcentaje actual, +, −, restablecer y atajos Ctrl + + / Ctrl + − / Ctrl + 0.</li><li>Guía de primer inicio para configurar Nova como navegador predeterminado.</li><li>Buscar actualizaciones usa el actualizador de Electron cuando Nova está instalada; permite descargar y aplicar la actualización sobre la instalación existente.</li><li>Pequeñas mejoras de estabilidad, rendimiento y uso de memoria manteniendo las funciones anteriores.</li></ul><div class="row" style="justify-content:flex-start;flex-wrap:wrap;margin-top:8px"><button class="btn on" id="n22check">Buscar actualizaciones</button><button class="btn" id="n22home">Abrir Nova Tab</button></div>`;
    r.prepend(c);c.querySelector('#n22check').onclick=()=>checkUpdates22(true);c.querySelector('#n22home').onclick=()=>newTab();
  };

  // ---------- Actualizaciones ----------
  let updateBox22=null;
  function ensureUpdateBox22(){if(updateBox22)return updateBox22;const b=document.createElement('div');b.id='nova22-updatebox';b.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:700;width:min(560px,92vw);padding:13px 15px;background:var(--bar);border:1px solid var(--acc);border-radius:15px;box-shadow:0 25px 90px #000b;display:flex;align-items:center;gap:10px';b.innerHTML='<div style="flex:1"><b id="n22ut">Nova</b><div class="mut" id="n22us"></div></div><button class="btn" id="n22later">Más tarde</button><button class="btn on" id="n22get">Descargar</button><button class="btn on" id="n22install" style="display:none">Instalar y reiniciar</button>';document.body.appendChild(b);updateBox22=b;b.querySelector('#n22later').onclick=()=>{b.remove();updateBox22=null};b.querySelector('#n22get').onclick=async()=>{const x=await ipc.invoke('update-download').catch(()=>({ok:false,error:'No disponible'}));if(!x.ok)toast22(x.error||'No se pudo descargar.')};b.querySelector('#n22install').onclick=()=>ipc.invoke('update-install');return b}
  function showUpdate22(version,direct=true){const b=ensureUpdateBox22();b.querySelector('#n22ut').textContent='Nova '+version+' disponible';b.querySelector('#n22us').textContent=direct?'Puedes descargarla y actualizar la instalación existente sin desinstalarla primero.':'Hay una versión nueva; esta instalación debe actualizarse desde el instalador oficial.';const get=b.querySelector('#n22get');if(get)get.textContent=direct?'Descargar':'Abrir descarga';get.onclick=async()=>{if(!direct){require('electron').shell.openExternal('https://github.com/sdraiky99/NovaBrowser/releases');return;}const x=await ipc.invoke('update-download').catch(()=>({ok:false,error:'No disponible'}));if(!x.ok)toast22(x.error||'No se pudo descargar.')};}
  async function checkUpdates22(manual=false){const r=await ipc.invoke('update-check').catch(()=>({ok:false}));if(!r?.ok){if(manual)toast22('No se pudo comprobar la actualización. Revisa tu conexión.');return false}const s=r.state||{};if(s.status==='available'||r.newer)showUpdate22(s.version||r.latest,r.directAvailable!==false);else if(manual&&(s.status==='latest'||r.newer===false))toast22('Nova está actualizada ('+(r.current||NOVA_VER||'2.2.0')+').');else if(manual)toast22('Comprobación completada.');return true}
  ipc.on('update-state',(_,s)=>{if(s?.status==='available'&&s.version)showUpdate22(s.version,true);if(!updateBox22)return;const us=updateBox22.querySelector('#n22us'),get=updateBox22.querySelector('#n22get'),ins=updateBox22.querySelector('#n22install');if(s.status==='checking')us.textContent='Comprobando…';if(s.status==='downloading')us.textContent='Descargando… '+Math.round(s.progress||0)+' %';if(s.status==='downloaded'){us.textContent='Descarga lista. Nova se actualizará directamente al instalar.';get.style.display='none';ins.style.display='inline-block'}if(s.status==='error'){us.textContent='Error: '+s.error;get.style.display='inline-block'}});
  N.checkUpdates22=checkUpdates22;
  if(Array.isArray(N.extraActs)&&!N.extraActs.some(a=>/actualizaciones/i.test(a[0]||'')))N.extraActs.push(['Buscar actualizaciones',()=>checkUpdates22(true)]);

  // ---------- Pequeños refuerzos de rendimiento ----------
  let lastPaint=0;
  const perfHint=()=>{const now=performance.now();if(now-lastPaint<250)return;lastPaint=now;document.body.classList.toggle('nova22-perfhint',S.v21?.turbo||S.v200?.perfPlus)};
  addEventListener('resize',perfHint,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)return;perfHint()},{passive:true});
  paintZoom();
  setTimeout(()=>checkUpdates22(false),8000);
})();
