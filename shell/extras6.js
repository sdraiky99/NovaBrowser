/* Nova 1.6.4 - capa aditiva: marcadores inferiores, bienvenida visual, rendimiento/RAM, seguridad, novedades y extensiones nuevas. */
(() => {
  const { PG, MENU, row } = NOVA;
  const N = NOVA;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc6 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asUrl = s => { try { const u = new URL(String(s || '')); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
  const isBookmarksPage = () => location.href.includes('nova://marcadores');
  const safeToast = msg => { try { toast(msg); } catch { } };

  // Migración de la preferencia de versiones anteriores; no se elimina ningún dato.
  if (S.bmbar === undefined && S.bbar !== undefined) S.bmbar = !!S.bbar;
  S.bmbar = !!S.bmbar;
  S.memSave = !!S.memSave;
  save();

  const style = document.createElement('style');
  style.id = 'nova164-style';
  style.textContent = `
    #nova-bm-hint{font-size:11px;color:var(--mut);padding:0 4px;white-space:nowrap}
    #nova-perf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px}.nova-metric{padding:13px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bar)}.nova-metric b{display:block;font-size:21px;color:var(--acc)}.nova-metric span{font-size:11px;color:var(--mut)}
    .nova-whero{width:100%;max-height:280px;object-fit:cover;border-radius:calc(var(--r)*1.5);border:1px solid var(--bd);box-shadow:0 12px 40px #0004}.nova-wgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nova-wgrid img{width:100%;aspect-ratio:2/1;object-fit:cover;border-radius:var(--r);border:1px solid var(--bd)}
    .nova-security{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.nova-security .li{cursor:default}.nova-ok{color:#35d98b}
    .nova-upd4{padding:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 18%,var(--bar)),var(--bar));border:1px solid var(--acc);border-radius:calc(var(--r)*1.3);display:flex;flex-direction:column;gap:8px}
    body.nova-bm-on .toast{bottom:56px}
    #bmb{padding-bottom:max(5px,env(safe-area-inset-bottom))}
  `;
  document.head.appendChild(style);

  /* ---------- Barra de marcadores inferior: capa única para evitar duplicados ---------- */
  const bottomBar = document.getElementById('bmb');
  const openBookmarkCurrent = m => {
    if (!m?.u) return;
    try {
      if (cur?.wv?.tagName === 'WEBVIEW' && !cur.wv.classList.contains('ipage')) { const p = cur.wv.loadURL(m.u); p?.catch?.(() => newTab(m.u)); }
      else newTab(m.u);
    } catch { newTab(m.u); }
  };
  const openBookmarkNew = m => { if (m?.u) newTab(m.u); };
  const copyUrl = async url => { try { await navigator.clipboard.writeText(url); safeToast('Dirección copiada'); } catch { safeToast('No se pudo copiar la dirección'); } };
  const refreshPageBookmarks = () => { if (isBookmarksPage() && typeof NOVA.refreshPages === 'function') NOVA.refreshPages('marcadores'); };
  const renderBottomBar = () => {
    if (!bottomBar) return;
    bottomBar.classList.toggle('on', !!S.bmbar);
    bottomBar.setAttribute('aria-hidden', S.bmbar ? 'false' : 'true');
    document.body.classList.toggle('nova-bm-on', !!S.bmbar);
    if (!S.bmbar) { const mid = document.getElementById('mid'); if (mid) mid.style.marginBottom = '0'; bottomBar.replaceChildren(); return; }
    const folders = [...new Set([...(S.folders || []), ...(S.marks || []).map(m => m.f).filter(Boolean)])].filter(Boolean).sort((a,b)=>a.localeCompare(b, 'es'));
    const frag = document.createDocumentFragment();
    if (!folders.length && !S.marks.length) { const hint = document.createElement('span'); hint.className='mut'; hint.textContent='Guarda páginas con Ctrl+D'; frag.appendChild(hint); }
    for (const f of folders) { const b=document.createElement('button'); b.className='btn'; b.dataset.f=f; b.textContent='▸ '+f.split('/').pop(); b.title=f; frag.appendChild(b); }
    for (const m of S.marks.filter(x=>!x.f)) { const b=document.createElement('button'); b.className='btn'; b.dataset.u=m.u; b.textContent=(m.t||m.u).slice(0,26); b.title=m.t||m.u; frag.appendChild(b); }
    const close=document.createElement('button'); close.className='btn bmc'; close.id='bmbclose164'; close.title='Ocultar barra de marcadores'; close.textContent='Ocultar'; frag.appendChild(close);
    bottomBar.replaceChildren(frag);
    bottomBar.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>openBookmarkCurrent(S.marks.find(m=>m.u===b.dataset.u)));
    bottomBar.querySelectorAll('[data-f]').forEach(b=>b.onclick=e=>{e.stopPropagation(); folderContext(b.dataset.f,e.clientX,e.clientY)});
    close.onclick=toggleBookmarksBar;
    const mid=document.getElementById('mid'); if(mid) mid.style.marginBottom=(bottomBar.offsetHeight||38)+'px';
  };
  const refreshBarLayout = () => {
    if (!bottomBar) return;
    document.body.classList.toggle('nova-bm-on', !!S.bmbar);
    const mid=document.getElementById('mid'); if(mid) mid.style.marginBottom=S.bmbar?(bottomBar.offsetHeight||38)+'px':'0';
    bottomBar.setAttribute('aria-hidden', S.bmbar?'false':'true');
  };
  const oldBbar = N.bbar;
  const toggleBookmarksBar = () => {
    if (typeof oldBbar === 'function') oldBbar();
    else { S.bmbar=!S.bmbar; save(); }
    renderBottomBar();
  };
  N.bbar = toggleBookmarksBar;
  renderBottomBar();
  refreshBarLayout();
  window.addEventListener('resize', refreshBarLayout, { passive:true });

  const editBookmark = async m => {
    if (!m || typeof N.dlg !== 'function') return;
    const v=await N.dlg('Editar marcador',[{label:'Nombre',value:m.t||m.u},{label:'Dirección',value:m.u}],'Guardar');
    if(!v) return;
    const u=asUrl(v[1]); if(!u) return safeToast('La dirección debe ser http:// o https://');
    m.t=String(v[0]||m.t||u).trim(); m.u=u; save(); renderBottomBar(); refreshPageBookmarks(); safeToast('Marcador actualizado');
  };
  const removeBookmark=m=>{const i=S.marks.indexOf(m);if(i<0)return;S.marks.splice(i,1);save();renderBottomBar();refreshPageBookmarks();safeToast('Marcador eliminado');};
  const bookmarkContext=(m,x,y)=>{
    if(!m||typeof N.ctx!=='function')return;
    N.ctx(x,y,[['Abrir',()=>openBookmarkCurrent(m)],['Abrir en pestaña nueva',()=>openBookmarkNew(m)],['Editar marcador',()=>editBookmark(m)],['Copiar dirección',()=>copyUrl(m.u)],'-',['Eliminar marcador',()=>removeBookmark(m)]]);
  };
  const folderContext=(folder,x,y)=>{
    if(!folder||typeof N.ctx!=='function')return;
    const items=S.marks.filter(m=>m.f===folder);
    N.ctx(x,y,[['Abrir todos ('+items.length+')',()=>items.forEach(openBookmarkNew)],'-',
      ['Renombrar carpeta',async()=>{if(typeof N.dlg!=='function')return;const v=await N.dlg('Renombrar carpeta',[{label:'Nombre',value:folder}],'Guardar');const nn=String(v?.[0]||'').trim();if(!nn||nn===folder)return;S.marks.forEach(m=>{if(m.f===folder)m.f=nn});S.folders=(S.folders||[]).map(f=>f===folder?nn:f);save();renderBottomBar();refreshPageBookmarks();safeToast('Carpeta renombrada');}],
      ['Quitar carpeta (conservar marcadores)',()=>{S.marks.forEach(m=>{if(m.f===folder)m.f=''});S.folders=(S.folders||[]).filter(f=>f!==folder);save();renderBottomBar();refreshPageBookmarks();safeToast('Carpeta quitada; marcadores conservados');}]]);
  };
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#bmb [data-u]');if(!b)return;e.preventDefault();e.stopPropagation();bookmarkContext(S.marks.find(m=>m.u===b.dataset.u),e.clientX,e.clientY)},true);
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#bmb [data-f]');if(!b)return;e.preventDefault();e.stopPropagation();folderContext(b.dataset.f,e.clientX,e.clientY)},true);
  document.addEventListener('contextmenu',e=>{const b=e.target.closest('#ml .li[data-i]');if(!b)return;e.preventDefault();e.stopPropagation();bookmarkContext(S.marks[Number(b.dataset.i)],e.clientX,e.clientY)},true);

  /* La página de Marcadores conserva todo lo original, pero su botón de barra usa el estado único de 1.6.4. */
  const oldMarksPage=PG.marcadores;
  PG.marcadores=r=>{
    if(typeof oldMarksPage==='function') oldMarksPage(r);
    const b=r.querySelector('#mbb');
    if(b) b.onclick=()=>{N.bbar();PG.marcadores(r);};
    renderBottomBar();
  };

  /* ---------- Bienvenida visual: añade, no reemplaza ---------- */
  const oldWelcome=PG.bienvenida;
  PG.bienvenida=async r=>{
    if(typeof oldWelcome==='function')await oldWelcome(r);
    if(r.querySelector('.nova164-welcome'))return;
    const box=document.createElement('section');box.className='nova164-welcome';
    box.innerHTML=`<div class="nova-upd4"><b style="font-size:20px;color:var(--acc)">Nova 1.6.4 · actualización grande</b><span class="mut">Todo lo que ya tenías se conserva. Esta versión añade marcadores abajo, migración, rendimiento/RAM, seguridad y nuevas extensiones.</span><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="n64news">Ver novedades</button><button class="btn" id="n64bm">Importar marcadores</button><button class="btn" id="n64mig">Migrar desde Chrome / Edge / Firefox</button><button class="btn" id="n64perf">Rendimiento y RAM</button></div></div><img class="nova-whero" src="../assets/welcome/welcome-hero.jpg" alt="Nova 1.6.4"><div class="nova-wgrid"><img src="../assets/welcome/welcome-performance.jpg" alt="Rendimiento y memoria de Nova"><img src="../assets/welcome/welcome-security.jpg" alt="Seguridad de Nova"></div>`;
    r.appendChild(box);
    box.querySelector('#n64news').onclick=()=>newTab('nova://novedades');
    box.querySelector('#n64bm').onclick=()=>newTab('nova://marcadores');
    box.querySelector('#n64mig').onclick=()=>newTab('nova://migrar');
    box.querySelector('#n64perf').onclick=()=>newTab('nova://rendimiento');
  };

  /* ---------- Rendimiento / RAM ---------- */
  async function performancePage(r){
    r.innerHTML=`<h2>Rendimiento y RAM</h2><span class="mut">Medición local de Nova, del sistema y de las pestañas abiertas. No se envía este diagnóstico a ninguna web.</span><div id="nova-perf-grid"><div class="nova-metric"><b id="pmain">—</b><span>Nova · RAM</span></div><div class="nova-metric"><b id="pcpu">—</b><span>Nova · CPU</span></div><div class="nova-metric"><b id="psys">—</b><span>RAM libre</span></div><div class="nova-metric"><b id="ptotal">—</b><span>RAM total</span></div><div class="nova-metric"><b id="ptabs">—</b><span>Pestañas web</span></div></div>${row('Ahorro de memoria',`<div class="sw ${S.memSave?'on':''}" id="memsave" aria-label="Ahorro de memoria"></div>`)}<span class="mut">El modo ahorro conserva el throttling normal de Electron y limita la repetición de animaciones de imagen. No cierra pestañas ni borra datos.</span><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn" id="prefresh">Actualizar medición</button><button class="btn" id="pcache">Limpiar caché</button><button class="btn" id="psec">Diagnóstico de seguridad</button></div><div id="ptablist" style="display:flex;flex-direction:column;gap:6px"></div>`;
    const paint=async()=>{const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d.ok)return safeToast('No se pudo leer el estado de rendimiento');const mb=x=>Number(x)?(x/1024).toFixed(0)+' MB':'—',cpu=x=>Number.isFinite(Number(x))?Number(x).toFixed(1)+' %':'—';r.querySelector('#pmain').textContent=mb(d.main.rssKB);r.querySelector('#pcpu').textContent=cpu(d.main.cpuPercent);r.querySelector('#psys').textContent=mb(d.system.freeKB);r.querySelector('#ptotal').textContent=mb(d.system.totalKB);r.querySelector('#ptabs').textContent=String(d.tabs.length);r.querySelector('#ptablist').innerHTML=d.tabs.map(t=>`<div class="li" style="cursor:default"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc6(t.title||t.url||'Pestaña')}</span><span class="mut">${mb(t.workingSetKB)} · CPU ${cpu(t.cpuPercent)}</span></div>`).join('')||'<span class="mut">Sin pestañas web medibles.</span>';};
    r.querySelector('#memsave').onclick=async()=>{const next=!S.memSave,ok=await ipc.invoke('performance-mode',next).catch(()=>false);if(!ok)return safeToast('No se pudo cambiar el modo');S.memSave=next;save();r.querySelector('#memsave').classList.toggle('on',next);safeToast(next?'Ahorro de memoria activado':'Ahorro de memoria desactivado');paint();};
    r.querySelector('#prefresh').onclick=paint;r.querySelector('#pcache').onclick=async()=>{const ok=await ipc.invoke('performance-cache').catch(()=>false);safeToast(ok?'Caché limpiada':'No se pudo limpiar la caché');if(ok)paint();};r.querySelector('#psec').onclick=()=>newTab('nova://seguridad');await paint();
  }
  PG.rendimiento=performancePage;

  /* ---------- Auditoría de seguridad ---------- */
  async function securityPage(r){
    const x=await ipc.invoke('security-state').catch(()=>({}));
    const rows=[['Web Security',x.webSecurity],['Sandbox de webviews',x.webviewSandbox],['Node.js en páginas web',x.webviewNodeIntegration===false],['Contenido inseguro bloqueado',x.insecureContentBlocked],['Popups de páginas bloqueados',x.popupBlocked],['Acceso file → web bloqueado',x.fileAccessFromFileUrls===false],['Acceso universal file bloqueado',x.universalAccessFromFileUrls===false],['Instancia única',x.singleInstance],['Bloqueador de anuncios',x.adblock],['CSP de la interfaz local',x.csp]];
    r.innerHTML=`<h2>Auditoría de seguridad</h2><span class="mut">Comprobaciones locales de configuración. No se envía este resultado a ninguna web.</span><div class="nova-security">${rows.map(([n,v])=>`<div class="li"><span>${esc6(n)}</span><span class="${v?'nova-ok':''}">${v?'✓':'—'}</span></div>`).join('')}</div><div class="row" style="justify-content:flex-start"><button class="btn" id="scheck">Volver a comprobar</button><button class="btn" id="spriv">Centro de privacidad</button></div>`;
    r.querySelector('#scheck').onclick=()=>PG.seguridad(r);r.querySelector('#spriv').onclick=()=>newTab('nova://privacidad');
  }
  PG.seguridad=securityPage;

  /* ---------- Novedades: entrada completa de 1.6.4 + historial anterior ---------- */
  const oldNews=PG.novedades;
  PG.novedades=r=>{
    if(typeof oldNews==='function')oldNews(r);
    const head=r.querySelector('h2'),card=document.createElement('div');card.className='nova-upd4';
    card.innerHTML=`<b style="font-size:20px;color:var(--acc)">Nova 1.6.4 · Actualización grande</b><span class="mut">Nueva capa de funciones sin eliminar las anteriores.</span><ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px">${[
      'Barra de marcadores fija en la parte inferior, opcional y con ocultación desde el propio botón.',
      'Clic derecho sobre marcadores: abrir, abrir en pestaña nueva, editar, copiar y eliminar.',
      'Clic derecho sobre carpetas: abrir todos, renombrar o quitar carpeta conservando marcadores.',
      'Bienvenida ampliada con imágenes locales y accesos a Novedades, Importar marcadores, Migrar navegador y Rendimiento/RAM.',
      'Migración local de Chrome, Edge y Firefox en modo solo lectura: marcadores e historial compatibles.',
      'Importación de marcadores HTML y JSON desde el gestor de Marcadores.',
      'Centro de Rendimiento/RAM con memoria de Nova, CPU, RAM libre/total, pestañas y consumo por pestaña.',
      'Ahorro de memoria opcional sin cerrar pestañas y conservando el throttling normal de Electron.',
      'Auditoría local de seguridad con estado de webview, sandbox, navegación, popups, acceso a archivos, instancia única y bloqueador.',
      'Ghostery con `cross-fetch`, caché persistente versionada y renovación periódica de listas.',
      'Cuatro extensiones nuevas y opcionales: aviso HTTP, enlaces no HTTPS, limpieza de parámetros de seguimiento y vídeo ligero.',
      'Comprobación automática del proyecto en GitHub para detectar funciones o protecciones ausentes antes del build.',
      'Unificación del estado y del atajo Ctrl+Shift+B para evitar doble ejecución de la barra.',
      'Novedades y bienvenida usan imágenes locales y no dependen de una descarga externa para mostrarlas.'
    ].map(x=>`<li>${esc6(x)}</li>`).join('')}</ul><div class="row" style="justify-content:flex-start;flex-wrap:wrap"><button class="btn on" id="n64perf">Rendimiento y RAM</button><button class="btn" id="n64bm2">Marcadores</button><button class="btn" id="n64mig2">Migrar navegador</button><button class="btn" id="n64sec2">Seguridad</button></div>`;
    if(head)head.after(card);else r.prepend(card);card.querySelector('#n64perf').onclick=()=>newTab('nova://rendimiento');card.querySelector('#n64bm2').onclick=()=>newTab('nova://marcadores');card.querySelector('#n64mig2').onclick=()=>newTab('nova://migrar');card.querySelector('#n64sec2').onclick=()=>newTab('nova://seguridad');
  };

  /* ---------- Menu / Command Center: conservar acciones anteriores y añadir las nuevas ---------- */
  if(Array.isArray(N.extraActs)){
    const old= N.extraActs.find(a=>/barra.*marcadores/i.test(a[0]));
    if(old) old[1]=toggleBookmarksBar;
    else N.extraActs.push(['Mostrar/ocultar barra de marcadores',toggleBookmarksBar]);
  } else N.extraActs=[];
  N.extraActs.push(['Barra de marcadores abajo',toggleBookmarksBar],['Rendimiento y RAM',()=>newTab('nova://rendimiento')],['Auditoría de seguridad',()=>newTab('nova://seguridad')],['Importar marcadores',()=>newTab('nova://marcadores')],['Migrar desde Chrome / Edge / Firefox',()=>newTab('nova://migrar')]);
  if(Array.isArray(MENU)&&!MENU.some(m=>m[0]==='Rendimiento y RAM'))MENU.push(['Rendimiento y RAM',()=>newTab('nova://rendimiento')],['Auditoría de seguridad',()=>newTab('nova://seguridad')]);
  const mp=document.getElementById('mnp');if(mp&&Array.isArray(MENU))mp.innerHTML=MENU.map((m,i)=>`<button data-i="${i}">${esc6(m[0])}</button>`).join('');

  ipc.invoke('performance-mode',!!S.memSave).catch(()=>{});
  Object.assign(N,{refreshBottomBar:()=>{renderBottomBar();refreshBarLayout();},bookmarkContext,folderContext});
})();
