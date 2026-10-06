/* Nova 3.1.0 · New Things layer
 * Adds genuinely new, easy-to-use features without replacing the existing 3.0.1 systems.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const hostOf = u => { try { return new URL(String(u || '')).hostname.replace(/^www\./,'').toLowerCase(); } catch { return ''; } };
  const now = () => Date.now();
  const save = () => { try { N.save?.(); window.save?.(); } catch {} };
  const toast31 = m => { try { toast(m); } catch {} };
  const open = route => { try { return newTab('nova://' + route); } catch { return null; } };
  const webTab = () => {
    try {
      const t = N.currentWebTab?.() || N.activeWebTab?.() || cur;
      if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage')) return t;
      return null;
    } catch { return null; }
  };
  const current = () => {
    const t = webTab(); if (!t) return { t:null, url:'', title:'', host:'' };
    let url='', title='';
    try { url = http(t.wv.getURL?.() || ''); } catch {}
    try { title = t.el?.querySelector?.('span')?.textContent || url; } catch { title=url; }
    return { t, url, title, host:hostOf(url) };
  };
  const ensure = () => {
    S.nova31 = Object.assign({
      memory: [], pinboard: [], snapshots: [], sendbox: [], automations: [], siteThemes: {},
      permissions: {}, mini: false, smartGroups: { enabled: true }, dailyDismissed: {}, linkPreview: true
    }, S.nova31 || {});
    for (const k of ['memory','pinboard','snapshots','sendbox','automations']) if (!Array.isArray(S.nova31[k])) S.nova31[k] = [];
    for (const k of ['siteThemes','permissions','dailyDismissed']) if (!S.nova31[k] || typeof S.nova31[k] !== 'object') S.nova31[k] = {};
    S.nova31.smartGroups = Object.assign({ enabled:true }, S.nova31.smartGroups || {});
    if (Array.isArray(S.v21?.memory) && !S.nova31._migrated21) {
      S.nova31.memory = S.nova31.memory.concat(S.v21.memory.map(text => ({ text:String(text).slice(0,500), createdAt:now(), source:'Nova 2.1' })));
      S.nova31._migrated21 = true;
    }
  };
  ensure();

  if (!document.getElementById('nova31-style')) {
    const st = document.createElement('style'); st.id='nova31-style'; st.textContent = `
      .n31-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:24px}.n31-hero{padding:20px;border:1px solid var(--acc);border-radius:22px;background:radial-gradient(circle at 90% 10%,color-mix(in srgb,var(--acc) 18%,transparent),transparent 46%),var(--bar);box-shadow:0 20px 70px #0003}.n31-kicker{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);font-weight:800}.n31-title{font-size:30px;font-weight:600}.n31-sub{color:var(--mut);line-height:1.55;max-width:860px}.n31-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:10px}.n31-card{display:flex;flex-direction:column;gap:9px;padding:15px;border:1px solid var(--bd);border-radius:18px;background:var(--bar);min-height:150px}.n31-card:hover{border-color:color-mix(in srgb,var(--acc) 58%,var(--bd));box-shadow:0 10px 35px #0002}.n31-card h3{margin:0}.n31-actions{display:flex;gap:7px;flex-wrap:wrap}.n31-list{display:flex;flex-direction:column;gap:7px}.n31-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:13px;background:var(--bar)}.n31-row .meta{min-width:0}.n31-row .meta b,.n31-row .meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n31-row .meta span{color:var(--mut);font-size:12px;margin-top:3px}.n31-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n31-chip.on{border-color:var(--acc);color:var(--acc)}.n31-empty{padding:15px;border:1px dashed var(--bd);border-radius:14px;color:var(--mut)}.n31-search{font-size:17px!important;padding:13px 15px!important;border-radius:14px!important}.n31-result{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:13px;background:var(--bar);cursor:pointer}.n31-result:hover{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 9%,var(--bar))}.n31-result small{color:var(--mut);white-space:nowrap}.n31-code{white-space:pre-wrap;word-break:break-word;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}.n31-mini{position:fixed;right:18px;bottom:18px;z-index:900;width:min(350px,calc(100vw - 36px));padding:14px;border:1px solid var(--acc);border-radius:20px;background:color-mix(in srgb,var(--bar) 95%,transparent);box-shadow:0 24px 90px #0008;backdrop-filter:blur(22px)}.n31-mini .small{font-size:12px;color:var(--mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n31-mini-title{font-weight:700;margin-bottom:4px}.n31-topbtn{height:30px;padding:0 10px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--fg);cursor:pointer;font-size:12px;white-space:nowrap}.n31-topbtn:hover{background:color-mix(in srgb,var(--acc) 12%,transparent);border-color:color-mix(in srgb,var(--acc) 40%,transparent)}
      @media(max-width:760px){.n31-grid{grid-template-columns:1fr}.n31-row{align-items:flex-start;flex-direction:column}.n31-row .n31-actions{width:100%}.n31-row .n31-actions .btn{flex:1}}
    `; document.head.appendChild(st);
  }

  const page = (kicker,title,desc,body='') => `<div class="n31-page"><div class="n31-kicker">${esc(kicker)}</div><div class="n31-title">${esc(title)}</div><div class="n31-sub">${esc(desc)}</div>${body}</div>`;
  const btn = (label,attr='',cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const card = (icon,title,desc,act='') => `<div class="n31-card"><div style="font-size:23px">${icon}</div><h3>${esc(title)}</h3><div class="mut">${esc(desc)}</div>${act ? `<div class="n31-actions" style="margin-top:auto">${act}</div>`:''}</div>`;
  const pushUnique = (arr,item,key='url') => { if (!item || !String(item[key]||'').trim()) return false; if (arr.some(x => String(x[key]||'')===String(item[key]))) return false; arr.unshift(item); return true; };
  const addMemory = text => { const v=String(text||'').trim().slice(0,1000); if(!v)return false; S.nova31.memory.unshift({text:v,createdAt:now()});S.nova31.memory=S.nova31.memory.slice(0,300);save();return true; };
  const pinCurrent = () => { const c=current(); if(!c.url) {toast31('Abre primero una página web');return false;} const ok=pushUnique(S.nova31.pinboard,{title:c.title,url:c.url,createdAt:now()},'url'); if(ok){save();toast31('Añadido al Pinboard');} else toast31('Esa página ya está en el Pinboard'); return ok; };
  const saveSend = () => { const c=current(); if(!c.url){toast31('Abre primero una página web');return false;} const ok=pushUnique(S.nova31.sendbox,{type:'page',title:c.title,url:c.url,createdAt:now()},'url'); if(ok){save();toast31('Enviado al buzón de Nova');} else toast31('Ya estaba en Nova Send'); return ok; };
  const addReading = () => { const c=current(); if(!c.url){toast31('Abre primero una página web');return false;} S.novaNext=S.novaNext||{};S.novaNext.reading=Array.isArray(S.novaNext.reading)?S.novaNext.reading:[];const ok=pushUnique(S.novaNext.reading,{title:c.title,url:c.url,added:now(),read:false},'url');if(ok){save();toast31('Guardado en Reading List');}else toast31('Ya estaba en Reading List');return ok; };

  /* ---------- Nova 3.1 Center ---------- */
  N.PG.nova31 = r => {
    const features = [
      ['⚡','Quick Actions','Las acciones importantes de Nova, sin buscar por ajustes.','quick'],
      ['📌','Pinboard','Guarda temporalmente enlaces, texto y páginas.','pinboard'],
      ['🧠','Nova Memory','Recordatorios locales y memoria que tú controlas.','memory31'],
      ['🧩','Smart Tab Groups','Detecta grupos naturales entre tus pestañas.','smarttabs'],
      ['⌕','Search Anything','Busca pestañas, historial, favoritos, notas y contenido guardado.','search31'],
      ['👀','Link Preview','Información rápida de un enlace sin abrir otra pestaña.','preview31'],
      ['🎨','Website Themes','Un estilo distinto por sitio web, guardado localmente.','sitethemes'],
      ['🔔','Smart Notifications','Reglas sencillas por sitio para las notificaciones.','notifications31'],
      ['🪄','Automations','Automatizaciones pequeñas y útiles sin programar.','automations'],
      ['🪟','Mini Mode','Un panel compacto para controlar tu página sin cambiar de contexto.','mini31'],
      ['📤','Nova Send','Un buzón local para mover cosas dentro de Nova.','sendbox'],
      ['📸','Page Snapshot','Guarda una instantánea HTML de una página.','snapshots'],
      ['☀️','Nova Daily','Tu punto de continuidad: recientes, guardados y pendientes.','daily'],
      ['🛡','Permission Center','Reglas claras para cámara, micrófono, ubicación y avisos.','permissions31'],
      ['🧹','One-Click Cleanup','Limpieza de datos con controles sencillos.','cleanup31']
    ];
    r.innerHTML = page('NOVA 3.1','Nuevas cosas para Nova','No sustituye tus funciones actuales. Esta capa añade herramientas nuevas y fáciles de encontrar.',
      `<section class="n31-hero"><div class="n31-title" style="font-size:24px">✨ Nova 3.1 — New Things</div><div class="n31-sub" style="margin-top:5px">15 funciones nuevas. Entran desde aquí, desde el Command Center o desde el botón <b>Nuevas</b> de la barra.</div><div class="n31-actions" style="margin-top:12px">${btn('⚡ Quick Actions','data-open="quick"','on')}${btn('☀️ Nova Daily','data-open="daily"')}${btn('⌕ Search Anything','data-open="search31"')}</div></section>`+
      `<div class="n31-grid">${features.map(([i,t,d,route])=>card(i,t,d,btn('Abrir',`data-open="${route}"`))).join('')}</div>`+
      `<div class="n31-actions">${btn('Volver al Centro Nova 3.0','id="n31-oldhub"')}${btn('Command Center','id="n31-cmd"')}</div>`
    );
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));
    r.querySelector('#n31-oldhub').onclick=()=>open('hub');
    r.querySelector('#n31-cmd').onclick=()=>N.palette?.();
  };

  /* ---------- Quick Actions ---------- */
  N.PG.quick = r => {
    const actions = [
      ['🔗','Copiar enlace',()=>{const c=current();if(!c.url)return toast31('Abre una página');navigator.clipboard?.writeText(c.url).then(()=>toast31('Enlace copiado')).catch(()=>toast31('No se pudo copiar'))}],
      ['📌','Pinboard',pinCurrent],
      ['📚','Reading List',addReading],
      ['📤','Nova Send',saveSend],
      ['📝','Abrir Writer',()=>open('writer')],
      ['📸','Capturar pantalla',()=>open('capture')],
      ['🗂','Guardar Snapshot',()=>open('snapshots')],
      ['🤖','Preguntar a Nova',()=>N.openAI?.() || open('ia')],
      ['🔊','Media Hub',()=>open('media')],
      ['🧠','Memoria',()=>open('memory31')],
      ['🪄','Automations',()=>open('automations')],
      ['🛡','Permisos',()=>open('permissions31')]
    ];
    r.innerHTML=page('QUICK','Quick Actions','Lo más útil de Nova en una pantalla. Cada botón actúa sobre la pestaña actual cuando tiene sentido.',`<div class="n31-grid">${actions.map(([i,t])=>card(i,t,'Acción rápida',btn('Ejecutar',''))).join('')}</div>`);
    r.querySelectorAll('.n31-card .btn').forEach((b,i)=>b.onclick=()=>actions[i]?.[2]?.());
  };

  /* ---------- Pinboard ---------- */
  N.PG.pinboard = r => {
    const list=S.nova31.pinboard;
    r.innerHTML=page('SAVE','Pinboard','Un sitio temporal para dejar cosas mientras navegas.',`<div class="n31-actions">${btn('📌 Página actual','id="pb-page"','on')}${btn('＋ Nota rápida','id="pb-note"')}${btn('🗑 Vaciar','id="pb-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title||x.text||'Elemento')}</b><span>${x.url?esc(x.url):'Nota local'} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">El Pinboard está vacío. Guarda la página actual o añade una nota rápida.</div>'}</div>`);
    r.querySelector('#pb-page').onclick=()=>{pinCurrent();N.PG.pinboard(r)};
    r.querySelector('#pb-note').onclick=()=>{const v=prompt('Nota rápida','');if(v&&String(v).trim()){S.nova31.pinboard.unshift({text:String(v).trim().slice(0,1000),createdAt:now()});S.nova31.pinboard=S.nova31.pinboard.slice(0,300);save();N.PG.pinboard(r)}};
    r.querySelector('#pb-clear').onclick=()=>{if(!confirm('¿Vaciar todo el Pinboard?'))return;S.nova31.pinboard=[];save();N.PG.pinboard(r)};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.pinboard(r)});
  };

  /* ---------- Memory ---------- */
  N.PG.memory31 = r => {
    const list=S.nova31.memory;
    r.innerHTML=page('MEMORY','Nova Memory','Memoria local. Tú decides qué entra y qué sale.',`<div class="n31-actions">${btn('＋ Añadir recuerdo','id="mem-add"','on')}${btn('🧷 Recordar página actual','id="mem-page"')}${btn('Borrar todo','id="mem-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.text||'')}</b><span>${new Date(x.createdAt||now()).toLocaleString('es')}${x.source?' · '+esc(x.source):''}</span></div><div class="n31-actions">${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay recuerdos guardados.</div>'}</div>`);
    r.querySelector('#mem-add').onclick=()=>{const v=prompt('¿Qué quieres que Nova recuerde?','');if(addMemory(v))N.PG.memory31(r)};
    r.querySelector('#mem-page').onclick=()=>{const c=current();if(!c.url)return toast31('Abre primero una página');if(addMemory(c.title+' — '+c.url))toast31('Página guardada en Memory');N.PG.memory31(r)};
    r.querySelector('#mem-clear').onclick=()=>{if(!confirm('¿Borrar toda Nova Memory?'))return;S.nova31.memory=[];save();N.PG.memory31(r)};
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.memory31(r)});
  };

  /* ---------- Smart Tab Groups ---------- */
  const tabRows = () => tabs.map((t,i)=>{let u='',title='Pestaña';try{u=t.wv.getURL?.()||'';title=t.el?.querySelector?.('span')?.textContent||u||title}catch{}return {t,i,u,title,host:hostOf(u)}}).filter(x=>x.host);
  const suggestions = () => {
    const map=new Map(); for(const x of tabRows()){if(!map.has(x.host))map.set(x.host,[]);map.get(x.host).push(x);}return [...map.entries()].filter(([,a])=>a.length>=2).sort((a,b)=>b[1].length-a[1].length);
  };
  const groupHost = host => {
    const rows=tabRows().filter(x=>x.host===host); if(rows.length<2)return false;
    S.groups=S.groups&&typeof S.groups==='object'?S.groups:{}; const old=Object.entries(S.groups).find(([,g])=>g?.name===host);
    const id=old?old[0]:'g'+Date.now().toString(36); S.groups[id]=Object.assign({name:host,color:'#0a84ff',collapsed:false},old?.[1]||{}); rows.forEach(x=>x.t.g=id); save(); N.renderGroups?.(); N.refreshIslands?.(); return true;
  };
  N.PG.smarttabs = r => {
    const groups=suggestions();
    r.innerHTML=page('ORGANIZE','Smart Tab Groups','Nova mira las pestañas abiertas y te propone grupos sencillos. No mueve nada hasta que pulses un botón.',`<div class="n31-actions">${btn('✨ Agrupar todo lo sugerido','id="stg-all"','on')}${btn('🏝 Ver Islands','id="stg-islands"')}</div><div class="n31-list">${groups.map(([host,rows])=>`<div class="n31-row"><div class="meta"><b>${esc(host)}</b><span>${rows.length} pestañas · ${esc(rows.map(x=>x.title).slice(0,3).join(' · '))}</span></div><div class="n31-actions">${btn('Crear grupo',`data-host="${esc(host)}"`)}${btn('Seleccionar',`data-sel="${esc(host)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay dos pestañas del mismo sitio ahora mismo. Abre varias páginas relacionadas y vuelve aquí.</div>'}</div>`);
    r.querySelector('#stg-all').onclick=()=>{let n=0;for(const [h] of groups)if(groupHost(h))n++;toast31(n?'Se crearon '+n+' grupos inteligentes':'No había grupos nuevos');N.PG.smarttabs(r)};
    r.querySelector('#stg-islands').onclick=()=>open('islands');
    r.querySelectorAll('[data-host]').forEach(b=>b.onclick=()=>{if(groupHost(b.dataset.host))toast31('Grupo creado para '+b.dataset.host);N.PG.smarttabs(r)});
    r.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{const x=tabRows().find(v=>v.host===b.dataset.sel);if(x)sel(x.t)});
  };

  /* ---------- Search Anything ---------- */
  const allSearchItems = () => {
    const out=[];
    tabRows().forEach(x=>out.push({kind:'Pestaña',label:x.title,sub:x.u,fn:()=>sel(x.t)}));
    (S.hist||[]).slice(0,500).forEach(x=>out.push({kind:'Historial',label:x.t||x.u,sub:x.u,fn:()=>newTab(x.u)}));
    (S.marks||[]).forEach(x=>out.push({kind:'Favorito',label:x.t||x.u,sub:x.u,fn:()=>newTab(x.u)}));
    (S.novaNext?.reading||[]).forEach(x=>out.push({kind:'Reading List',label:x.title,sub:x.url,fn:()=>newTab(x.url)}));
    (S.novaNext?.collections||[]).forEach(c=>(c.items||[]).forEach(x=>{if(x.url)out.push({kind:'Colección',label:x.title||c.name,sub:x.url,fn:()=>newTab(x.url)});else if(x.text)out.push({kind:'Colección',label:x.text,sub:c.name,fn:()=>open('collections')})}));
    S.nova31.pinboard.forEach(x=>out.push({kind:'Pinboard',label:x.title||x.text,sub:x.url||'Nota',fn:()=>x.url?newTab(x.url):open('pinboard')}));
    S.nova31.memory.forEach(x=>out.push({kind:'Memory',label:x.text,sub:new Date(x.createdAt||now()).toLocaleString('es'),fn:()=>open('memory31')}));
    S.nova31.snapshots.forEach(x=>out.push({kind:'Snapshot',label:x.title,sub:x.url,fn:()=>newTab(pathToFileURL(x.file).href)}));
    S.nova31.sendbox.forEach(x=>out.push({kind:'Nova Send',label:x.title||x.text,sub:x.url||'Elemento local',fn:()=>x.url?newTab(x.url):open('sendbox')}));
    return out;
  };
  N.PG.search31 = r => {
    r.innerHTML=page('SEARCH','Search Anything','Una sola búsqueda para casi todo lo que Nova ya conoce.',`<input class="fld n31-search" id="n31-q" placeholder="Busca una pestaña, web, nota, favorito…"><div class="n31-list" id="n31-results"></div>`);
    const inp=r.querySelector('#n31-q'),out=r.querySelector('#n31-results');
    const draw=()=>{const q=inp.value.toLowerCase().trim(),items=allSearchItems().filter(x=>!q||String(x.label+' '+x.sub).toLowerCase().includes(q)).slice(0,60);out.innerHTML=items.map((x,i)=>`<div class="n31-result" data-i="${i}"><span><b>${esc(x.label||'Elemento')}</b><br><small>${esc(x.kind)} · ${esc(x.sub||'')}</small></span><small>›</small></div>`).join('')||'<div class="n31-empty">No hay resultados.</div>';out.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>items[+b.dataset.i]?.fn?.())};
    inp.oninput=draw; draw(); setTimeout(()=>inp.focus(),0);
  };

  /* ---------- Link Preview ---------- */
  const installPreview = t => {
    if(!S.nova31.linkPreview || !t?.wv?.executeJavaScript || t._nova31Preview) return; t._nova31Preview=true;
    const script=`(()=>{try{if(window.__nova31Preview)return true;window.__nova31Preview=1;const s=document.createElement('style');s.id='__nova31-preview-style';s.textContent='.nova31-link-preview{position:fixed;z-index:2147483647;max-width:360px;padding:10px 12px;border-radius:12px;border:1px solid rgba(120,120,140,.35);background:rgba(20,20,28,.94);color:#fff;font:12px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 14px 42px rgba(0,0,0,.28);pointer-events:none;opacity:0;transition:opacity .1s}.nova31-link-preview b{display:block;font-size:13px;margin-bottom:3px}.nova31-link-preview small{display:block;opacity:.72;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';document.head.appendChild(s);const p=document.createElement('div');p.className='nova31-link-preview';document.body.appendChild(p);let timer=0;const hide=()=>{p.style.opacity='0'};document.addEventListener('mouseover',e=>{const a=e.target?.closest?.('a[href]');if(!a||!a.href||!/^https?:/i.test(a.href))return;clearTimeout(timer);timer=setTimeout(()=>{try{const u=new URL(a.href);p.innerHTML='<b>'+String(a.title||a.innerText||u.hostname).replace(/[&<>]/g,\'\')+'</b><small>'+u.hostname+'</small><small>'+u.href.replace(/&/g,'&amp;').slice(0,240)+'</small>';p.style.left=Math.min(innerWidth-380,Math.max(8,e.clientX+14))+\'px\';p.style.top=Math.min(innerHeight-100,Math.max(8,e.clientY+14))+\'px\';p.style.opacity=\'1\'}catch{}},180)},true);document.addEventListener('mouseout',e=>{const a=e.target?.closest?.('a[href]');if(a){clearTimeout(timer);hide()}},true);return true}catch{return false}})()`;
    t.wv.executeJavaScript(script).catch(()=>{});
  };

  /* ---------- Link Preview settings page ---------- */
  N.PG.preview31 = r => {
    r.innerHTML=page('PREVIEW','Link Preview','Cuando pasas por un enlace, Nova puede mostrar título, dominio y URL sin abrir una pestaña.',`<div class="n31-hero"><div class="n31-title" style="font-size:22px">${S.nova31.linkPreview?'👀 Activo':'⏸ Pausado'}</div><div class="n31-sub" style="margin-top:5px">La vista previa es ligera: no abre la web ni descarga el destino automáticamente.</div><div class="n31-actions" style="margin-top:10px">${btn(S.nova31.linkPreview?'Desactivar':'Activar','id="prev-toggle"','on')} ${btn('Reaplicar en pestañas','id="prev-reapply"')}</div></div>`);
    r.querySelector('#prev-toggle').onclick=()=>{S.nova31.linkPreview=!S.nova31.linkPreview;save();tabs.forEach(t=>{if(S.nova31.linkPreview){t._nova31Preview=false;installPreview(t)}else{try{t.wv.executeJavaScript(`document.getElementById('__nova31-preview-style')?.remove();document.querySelector('.nova31-link-preview')?.remove();delete window.__nova31Preview`)}catch{}}});N.PG.preview31(r)};
    r.querySelector('#prev-reapply').onclick=()=>{tabs.forEach(t=>{t._nova31Preview=false;installPreview(t)});toast31('Link Preview reaplicado');};
  };

  /* ---------- Website Themes ---------- */
  const applySiteTheme = t => {
    if(!t?.wv?.executeJavaScript) return; const u=http(t.wv.getURL?.()||''),h=hostOf(u); if(!h)return;
    const css=String(S.nova31.siteThemes[h]?.css||'');
    const code=`(()=>{try{let s=document.getElementById('__nova31-site-theme');if(!${JSON.stringify(!!css)}){s?.remove();return true}if(!s){s=document.createElement('style');s.id='__nova31-site-theme';document.head.appendChild(s)}s.textContent=${JSON.stringify(css)};return true}catch{return false}})()`;
    t.wv.executeJavaScript(code).catch(()=>{});
  };
  const installSiteEditor = r => {
    const c=current(); if(!c.host)return toast31('Abre una web para editar su tema');
    const old=String(S.nova31.siteThemes[c.host]?.css||''); const preset=`body{border-top:4px solid var(--nova31-accent, #8b5cf6)!important;} a{border-radius:6px;} `;
    r.innerHTML+=`<div class="n31-card"><h3>Tema para ${esc(c.host)}</h3><span class="mut">CSS local aplicado solo a este sitio.</span><textarea class="fld" id="site-css" style="min-height:160px;resize:vertical">${esc(old)}</textarea><div class="n31-actions">${btn('Guardar','id="site-save"','on')}${btn('Preset suave','id="site-preset"')}${btn('Quitar tema','id="site-clear"')}</div></div>`;
    r.querySelector('#site-save').onclick=()=>{const css=r.querySelector('#site-css').value.slice(0,12000);S.nova31.siteThemes[c.host]={css,updatedAt:now()};save();applySiteTheme(c.t);toast31('Tema guardado para '+c.host)};
    r.querySelector('#site-preset').onclick=()=>{r.querySelector('#site-css').value=preset};
    r.querySelector('#site-clear').onclick=()=>{delete S.nova31.siteThemes[c.host];save();applySiteTheme(c.t);r.querySelector('#site-css').value='';toast31('Tema quitado')};
  };
  N.PG.sitethemes = r => {
    const hosts=Object.entries(S.nova31.siteThemes).filter(([,v])=>v?.css);
    r.innerHTML=page('STYLE','Website Themes','Define un pequeño estilo por sitio. Se guarda en tu perfil de Nova.',`<div class="n31-actions">${btn('🎨 Editar sitio actual','id="site-current"','on')}${btn('Quitar todos los temas','id="site-all-clear"')}</div><div class="n31-list">${hosts.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>${String(v.css).length} caracteres CSS · ${new Date(v.updatedAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${btn('Aplicar ahora',`data-apply="${esc(h)}"`)}${btn('Eliminar',`data-del="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay temas por sitio.</div>'}</div><div id="site-editor"></div>`);
    r.querySelector('#site-current').onclick=()=>installSiteEditor(r);
    r.querySelector('#site-all-clear').onclick=()=>{if(!confirm('¿Quitar todos los temas de sitios?'))return;S.nova31.siteThemes={};save();r.querySelector('#site-editor').innerHTML='';const c=current();if(c.t)applySiteTheme(c.t);N.PG.sitethemes(r)};
    r.querySelectorAll('[data-apply]').forEach(b=>b.onclick=()=>{const c=current();if(c.host===b.dataset.apply)applySiteTheme(c.t);else toast31('Abre '+b.dataset.apply+' para aplicarlo')});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{delete S.nova31.siteThemes[b.dataset.del];save();N.PG.sitethemes(r)});
  };

  /* ---------- Smart Notifications / Permissions ---------- */
  const permLabel = p => ({notifications:'notificaciones',camera:'cámara',microphone:'micrófono',geolocation:'ubicación',clipboardRead:'portapapeles',clipboardWrite:'portapapeles'}[p]||p);
  const bindPermission = t => {
    if(!t?.wv?.addEventListener || t._nova31Perm) return; t._nova31Perm=true;
    t.wv.addEventListener('permission-request',e=>{
      try {
        const host=hostOf(e.requestingUrl||t.wv.getURL?.()||''); const raw=String(e.permission||'').toLowerCase(); const map=raw.includes('notification')?'notifications':raw.includes('camera')?'camera':raw.includes('microphone')?'microphone':raw.includes('geolocation')?'geolocation':raw; const rule=S.nova31.permissions[host]?.[map];
        if(rule==='block'){e.preventDefault?.();e.callback?.(false);toast31('Bloqueado: '+permLabel(map)+' · '+host)}
        else if(rule==='allow'){e.callback?.(true)}
      } catch {}
    });
  };
  N.PG.notifications31 = r => {
    const rows=Object.entries(S.nova31.permissions).filter(([,v])=>v?.notifications);
    r.innerHTML=page('NOTIFICATIONS','Smart Notifications','Controla los avisos por sitio. “Preguntar” deja el comportamiento normal del navegador.',`<div class="n31-actions">${btn('🔔 Configurar sitio actual','id="not-site"','on')}${btn('Bloquear todas las nuevas reglas','id="not-all"')}</div><div class="n31-list">${rows.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>Notificaciones: ${esc(v.notifications)}</span></div><div class="n31-actions">${btn('Alternar',`data-host="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay reglas de notificaciones. Configura el sitio actual.</div>'}</div>`);
    r.querySelector('#not-site').onclick=()=>{const c=current();if(!c.host)return toast31('Abre una página');S.nova31.permissions[c.host]=S.nova31.permissions[c.host]||{};const currentRule=S.nova31.permissions[c.host].notifications||'ask';const next=currentRule==='ask'?'allow':currentRule==='allow'?'block':'ask';S.nova31.permissions[c.host].notifications=next;save();bindPermission(c.t);toast31(c.host+': '+next);N.PG.notifications31(r)};
    r.querySelector('#not-all').onclick=()=>{const c=current();if(!c.host)return toast31('Abre una página');S.nova31.permissions[c.host]=Object.assign({},S.nova31.permissions[c.host],{notifications:'block'});save();bindPermission(c.t);toast31('Notificaciones bloqueadas para '+c.host);N.PG.notifications31(r)};
    r.querySelectorAll('[data-host]').forEach(b=>b.onclick=()=>{const h=b.dataset.host;const v=S.nova31.permissions[h]||{};v.notifications=v.notifications==='ask'?'allow':v.notifications==='allow'?'block':'ask';S.nova31.permissions[h]=v;save();N.PG.notifications31(r)});
  };
  N.PG.permissions31 = r => {
    const c=current(); const host=c.host;
    const entries=Object.entries(S.nova31.permissions);
    r.innerHTML=page('PRIVACY','Permission Center','Reglas locales y sencillas para cámara, micrófono, ubicación y notificaciones.',`<div class="n31-card"><h3>${host?'Sitio actual: '+esc(host):'Abre una web para configurar un sitio'}</h3><div class="n31-actions">${['notifications','camera','microphone','geolocation'].map(k=>`<button class="btn" data-perm="${k}">${permLabel(k)}: ${host?esc(S.nova31.permissions[host]?.[k]||'ask'):'ask'}</button>`).join('')}</div></div><div class="n31-list">${entries.map(([h,v])=>`<div class="n31-row"><div class="meta"><b>${esc(h)}</b><span>${Object.entries(v||{}).map(([k,x])=>permLabel(k)+': '+x).join(' · ')}</span></div><div class="n31-actions">${btn('Eliminar reglas',`data-del="${esc(h)}"`)}</div></div>`).join('')||'<div class="n31-empty">No hay reglas guardadas todavía.</div>'}</div><div class="n31-actions">${btn('Abrir Smart Notifications','id="perm-not"')}${btn('Revisar seguridad de Nova','id="perm-security"')}</div>`);
    r.querySelectorAll('[data-perm]').forEach(b=>b.onclick=()=>{if(!host)return toast31('Abre una página web');S.nova31.permissions[host]=S.nova31.permissions[host]||{};const k=b.dataset.perm,v=S.nova31.permissions[host][k]||'ask';S.nova31.permissions[host][k]=v==='ask'?'allow':v==='allow'?'block':'ask';save();bindPermission(c.t);N.PG.permissions31(r)});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{delete S.nova31.permissions[b.dataset.del];save();N.PG.permissions31(r)});
    r.querySelector('#perm-not').onclick=()=>open('notifications31');
    r.querySelector('#perm-security').onclick=()=>open('seguridad');
  };

  /* ---------- Automations ---------- */
  const automationAction = (a, ctx) => {
    try {
      const type=a?.action?.type, value=String(a?.action?.value||'');
      if(type==='open-url' && http(value)) return newTab(value);
      if(type==='feature' && value) return open(value.replace(/^nova:\/\//,''));
      if(type==='pin') return pinCurrent();
      if(type==='reading') return addReading();
      if(type==='send') return saveSend();
      if(type==='memory') return addMemory(ctx.title+' — '+ctx.url);
      if(type==='notify') return toast31(value||('Automatización: '+a.name));
      if(type==='focus') return N.startFocus?.(Number(value)||25);
    } catch {}
  };
  const runAutomations = t => {
    if(!t?.wv || t._nova31Auto) return; t._nova31Auto=true;
    t.wv.addEventListener('did-navigate',()=>{ const c=(()=>{let url='';try{url=http(t.wv.getURL?.()||'')}catch{}return {url,title:t.el?.querySelector?.('span')?.textContent||url,host:hostOf(url)}})(); if(!c.url)return; for(const a of S.nova31.automations){if(!a?.enabled)continue;const h=String(a.whenHost||'').replace(/^www\./,'').toLowerCase();const pathPart=String(a.whenPath||'').trim();let path='';try{path=new URL(c.url).pathname}catch{}if(h&&h!==c.host)continue;if(pathPart&&!path.includes(pathPart))continue;const key=a.id+'|'+c.url;if(a._lastRun===key && now()-Number(a._lastRunAt||0)<8000)continue;a._lastRun=key;a._lastRunAt=now();save();setTimeout(()=>automationAction(a,c),120)}});
  };
  N.PG.automations = r => {
    const list=S.nova31.automations;
    r.innerHTML=page('AUTOMATE','Nova Automations','Cuando abras una web, Nova puede hacer una acción sencilla por ti.',`<div class="n31-card"><h3>＋ Nueva automatización</h3><span class="mut">Ejemplo: al abrir youtube.com → abrir Media Hub.</span><div class="n31-actions">${btn('Crear con el asistente','id="auto-new"','on')}</div></div><div class="n31-list">${list.map((a,i)=>`<div class="n31-row"><div class="meta"><b>${esc(a.name||'Automatización')}</b><span>${esc(a.whenHost||'*')}${a.whenPath?esc(a.whenPath):''} → ${esc(a.action?.type||'notify')} ${esc(a.action?.value||'')} · ${a.enabled===false?'apagada':'activa'}</span></div><div class="n31-actions">${btn(a.enabled===false?'Activar':'Pausar',`data-toggle="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">No has creado automatizaciones todavía.</div>'}</div>`);
    r.querySelector('#auto-new').onclick=()=>{const host=String(prompt('¿En qué sitio? (ej. youtube.com)','')||'').trim().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];if(!host)return;const name=String(prompt('Nombre','Mi automatización')||'').trim()||'Mi automatización';const types={1:'feature',2:'open-url',3:'pin',4:'reading',5:'send',6:'memory',7:'notify',8:'focus'};const choice=prompt('Acción:\n1 Abrir función Nova\n2 Abrir URL\n3 Pinboard\n4 Reading List\n5 Nova Send\n6 Memory\n7 Mostrar aviso\n8 Focus','1');const type=types[choice]||'notify';let value='';if(type==='feature')value=String(prompt('Ruta Nova (ej. media)','media')||'media').trim();else if(type==='open-url')value=String(prompt('URL','https://')||'').trim();else if(type==='notify')value=String(prompt('Texto del aviso','Nova ha hecho algo')||'Nova ha hecho algo').trim();else if(type==='focus')value=String(prompt('Minutos','25')||'25').trim();list.unshift({id:'a'+now().toString(36),name,whenHost:host,whenPath:'',action:{type,value},enabled:true,createdAt:now()});save();list.forEach(()=>{});N.PG.automations(r);toast31('Automatización creada')};
    r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const a=list[+b.dataset.toggle];if(!a)return;a.enabled=!a.enabled;save();N.PG.automations(r)});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.automations(r)});
  };

  /* ---------- Mini Mode ---------- */
  const closeMini = () => { document.getElementById('nova31-mini')?.remove(); S.nova31.mini=false; save(); };
  const mini = () => {
    document.getElementById('nova31-mini')?.remove(); const c=current(); const d=document.createElement('div'); d.id='nova31-mini';d.className='n31-mini';
    d.innerHTML=`<div class="n31-mini-title">🪟 Mini Mode</div><div class="small" id="mini-title">${esc(c.title||'Sin página')}</div><div class="small" id="mini-url">${esc(c.url||'')}</div><div class="n31-actions" style="margin-top:9px">${btn('←','id="mini-back"')}${btn('→','id="mini-fwd"')}${btn('↻','id="mini-reload"')}${btn('Pin','id="mini-pin"')}${btn('Cerrar','id="mini-close"')}</div><div class="row" style="margin-top:8px"><input class="fld" id="mini-go" placeholder="Escribe una URL…"><button class="btn on" id="mini-open">Abrir</button></div>`;
    document.body.appendChild(d); S.nova31.mini=true; save();
    d.querySelector('#mini-back').onclick=()=>c.t?.wv?.canGoBack?.()&&c.t.wv.goBack();d.querySelector('#mini-fwd').onclick=()=>c.t?.wv?.canGoForward?.()&&c.t.wv.goForward();d.querySelector('#mini-reload').onclick=()=>c.t?.wv?.reload?.();d.querySelector('#mini-pin').onclick=pinCurrent;d.querySelector('#mini-close').onclick=closeMini;d.querySelector('#mini-open').onclick=()=>{let v=d.querySelector('#mini-go').value.trim();if(v){if(!/^https?:\/\//i.test(v))v=typeof toURL==='function'?toURL(v):v;const t=c.t||webTab();t?.wv?.loadURL?.(v);}};
  };
  N.PG.mini31 = r => { r.innerHTML=page('MINI','Mini Mode','Un panel flotante y compacto para controlar la navegación sin perder de vista la página.',`<div class="n31-hero"><div class="n31-title" style="font-size:22px">Control rápido encima de tu página</div><div class="n31-sub" style="margin-top:5px">No reemplaza la ventana de Nova ni crea una ventana adicional del sistema; es un modo compacto dentro de Nova.</div><div class="n31-actions" style="margin-top:10px">${btn('Abrir Mini Mode','id="mini-open-page"','on')}${btn('Cerrar Mini Mode','id="mini-close-page"')}</div></div>`);r.querySelector('#mini-open-page').onclick=mini;r.querySelector('#mini-close-page').onclick=closeMini; };

  /* ---------- Nova Send ---------- */
  N.PG.sendbox = r => {
    const list=S.nova31.sendbox;
    r.innerHTML=page('SEND','Nova Send','Buzón local para mover enlaces y notas dentro de tu navegador.',`<div class="n31-actions">${btn('📤 Enviar página actual','id="send-page"','on')}${btn('＋ Enviar nota','id="send-note"')}${btn('🗑 Vaciar','id="send-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title||x.text||'Elemento')}</b><span>${esc(x.url||'Nota local')} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Nova Send está vacío.</div>'}</div>`);
    r.querySelector('#send-page').onclick=()=>{saveSend();N.PG.sendbox(r)};
    r.querySelector('#send-note').onclick=()=>{const v=prompt('Nota para Nova Send','');if(v&&String(v).trim()){list.unshift({type:'note',text:String(v).trim().slice(0,1000),createdAt:now()});save();N.PG.sendbox(r)}};
    r.querySelector('#send-clear').onclick=()=>{if(confirm('¿Vaciar Nova Send?')){S.nova31.sendbox=[];save();N.PG.sendbox(r)}};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.sendbox(r)});
  };

  /* ---------- Page Snapshots ---------- */
  const saveSnapshot = async () => {
    const c=current(); if(!c.t||!c.url)return toast31('Abre primero una página web');
    toast31('Guardando snapshot…');
    const raw=await c.t.wv.executeJavaScript(`(()=>({title:document.title,url:location.href,html:'<!doctype html>'+document.documentElement.outerHTML}))()`).catch(()=>null);
    if(!raw?.html)return toast31('No se pudo capturar el HTML');
    const safe=(raw.title||'Nova Snapshot').replace(/[^\w\- ]+/g,' ').trim().slice(0,70)||'Nova Snapshot';
    const file=await ipc.invoke('save-text',{name:'Nova-Snapshot-'+safe,ext:'html',content:raw.html}).catch(()=>null);
    if(!file)return toast31('No se pudo guardar el archivo');
    S.nova31.snapshots.unshift({title:raw.title||c.title,url:raw.url||c.url,file,createdAt:now()});S.nova31.snapshots=S.nova31.snapshots.slice(0,100);save();toast31('Snapshot guardado en Descargas');return file;
  };
  N.PG.snapshots = r => {
    const list=S.nova31.snapshots;
    r.innerHTML=page('SNAPSHOT','Page Snapshot','Guarda una copia HTML local de la página que tienes abierta.',`<div class="n31-actions">${btn('📸 Guardar página actual','id="snap-save"','on')}${btn('🗑 Borrar lista','id="snap-clear"')}</div><div class="n31-list">${list.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.title)}</b><span>${esc(x.url)} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n31-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Carpeta',`data-folder="${i}"`)}${btn('Eliminar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">Todavía no hay snapshots.</div>'}</div>`);
    r.querySelector('#snap-save').onclick=async()=>{await saveSnapshot();N.PG.snapshots(r)};
    r.querySelector('#snap-clear').onclick=()=>{S.nova31.snapshots=[];save();N.PG.snapshots(r)};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.open];if(x?.file)newTab(pathToFileURL(x.file).href)});
    r.querySelectorAll('[data-folder]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.folder];if(x?.file)ipc.invoke('show-in-folder',x.file).catch(()=>{})});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.snapshots(r)});
  };

  /* ---------- Nova Daily ---------- */
  N.PG.daily = r => {
    const recent=(S.hist||[]).slice(0,8);const pb=S.nova31.pinboard.slice(0,6);const todo=(S.nova31.sendbox||[]).slice(0,6);
    r.innerHTML=page('DAILY','Nova Daily','Una portada para continuar donde lo dejaste, sin convertir Nova en una red social.',`<section class="n31-hero"><div class="n31-title" style="font-size:24px">Hola 👋</div><div class="n31-sub" style="margin-top:5px">${recent.length?'Tienes '+recent.length+' páginas recientes y '+pb.length+' cosas guardadas.':'Todavía no hay suficiente actividad para preparar un resumen.'}</div><div class="n31-actions" style="margin-top:10px">${btn('⌕ Buscar Anything','id="daily-search"','on')}${btn('📌 Pinboard','id="daily-pin"')}${btn('📤 Nova Send','id="daily-send"')}</div></section><div class="n31-grid">${card('🕘','Continuar','Tus páginas recientes.',recent.slice(0,1).map(x=>btn('Abrir',`data-r="${recent.indexOf(x)}"`)).join('')||'')}${card('📌','Guardado rápido',pb.length+' elementos en Pinboard.',btn('Ver Pinboard','id="daily-pb"'))}${card('📤','Pendiente',todo.length+' elementos en Nova Send.',btn('Ver buzón','id="daily-sb"'))}${card('🧠','Memory',S.nova31.memory.length+' recuerdos locales.',btn('Abrir Memory','id="daily-mem"'))}</div><div class="n31-list">${recent.map((x,i)=>`<div class="n31-row"><div class="meta"><b>${esc(x.t||x.u)}</b><span>${esc(x.u||'')}</span></div><div class="n31-actions">${btn('Abrir',`data-recent="${i}"`)}</div></div>`).join('')||'<div class="n31-empty">El historial reciente aparecerá aquí cuando navegues.</div>'}</div>`);
    r.querySelector('#daily-search').onclick=()=>open('search31');r.querySelector('#daily-pin').onclick=()=>open('pinboard');r.querySelector('#daily-send').onclick=()=>open('sendbox');r.querySelector('#daily-pb').onclick=()=>open('pinboard');r.querySelector('#daily-sb').onclick=()=>open('sendbox');r.querySelector('#daily-mem').onclick=()=>open('memory31');
    r.querySelectorAll('[data-recent]').forEach(b=>b.onclick=()=>newTab(recent[+b.dataset.recent]?.u));
  };

  /* ---------- Cleanup ---------- */
  N.PG.cleanup31 = r => {
    r.innerHTML=page('CLEAN','One-Click Cleanup','Elige qué limpiar. Nada se borra hasta que pulses el botón.',`<div class="n31-grid"><div class="n31-card"><h3>🌐 Datos web</h3><span class="mut">Cookies, almacenamiento de sitios y caché.</span><div class="row"><label><input type="checkbox" id="cl-cookie" checked> Cookies y datos</label></div><div class="row"><label><input type="checkbox" id="cl-cache" checked> Caché</label></div></div><div class="n31-card"><h3>🧭 Nova</h3><span class="mut">Datos locales que controlas desde Nova.</span><div class="row"><label><input type="checkbox" id="cl-hist"> Historial</label></div><div class="row"><label><input type="checkbox" id="cl-pin"> Pinboard</label></div><div class="row"><label><input type="checkbox" id="cl-send"> Nova Send</label></div></div></div><div class="n31-actions">${btn('🧹 Limpiar ahora','id="cl-go"','on')}${btn('Borrar solo historial','id="cl-hist-only"')}</div><div class="n31-code" id="cl-status">Listo.</div>`);
    r.querySelector('#cl-go').onclick=async()=>{const opts={cookies:r.querySelector('#cl-cookie').checked,cache:r.querySelector('#cl-cache').checked,storage:r.querySelector('#cl-cookie').checked};const ok=await ipc.invoke('clear-data',opts).catch(()=>false);if(r.querySelector('#cl-hist').checked){S.hist=[];};if(r.querySelector('#cl-pin').checked){S.nova31.pinboard=[];}if(r.querySelector('#cl-send').checked){S.nova31.sendbox=[];}save();r.querySelector('#cl-status').textContent=ok?'Limpieza completada.':'No se pudo completar toda la limpieza.';toast31(ok?'Limpieza completada':'No se pudo completar toda la limpieza')};
    r.querySelector('#cl-hist-only').onclick=()=>{S.hist=[];save();r.querySelector('#cl-status').textContent='Historial de Nova borrado.';toast31('Historial borrado')};
  };

  /* ---------- Discoverability ---------- */
  const addTopButton = () => {
    const host=document.getElementById('nova22-top-tools');if(!host||host.querySelector('#n31-top'))return;
    const b=document.createElement('button');b.id='n31-top';b.className='n31-topbtn';b.textContent='✨ Nuevas';b.title='Nova 3.1 — nuevas funciones';b.onclick=()=>open('nova31');host.appendChild(b);
  };
  addTopButton();
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  if(!N.extraActs.some(a=>a[0]==='Nova 3.1 · Nuevas cosas'))N.extraActs.push(['Nova 3.1 · Nuevas cosas',()=>open('nova31')]);

  const oldPalette=N.palette;
  if(typeof oldPalette==='function'&&!oldPalette.__nova31Wrapped){
    const wrapped=()=>{oldPalette();setTimeout(()=>{const dlg=document.querySelector('#nova30-cmd .nx-command');if(!dlg||dlg.querySelector('#n31-palette'))return;const b=document.createElement('button');b.id='n31-palette';b.className='btn on';b.textContent='✨ Abrir nuevas funciones de Nova 3.1';b.onclick=()=>{document.getElementById('nova30-cmd')?.remove();open('nova31')};dlg.appendChild(b)},0)};wrapped.__nova31Wrapped=true;N.palette=wrapped;
  }

  const wrapPage = (name,html) => { const old=N.PG[name]; if(typeof old!=='function')return; const wrapped=r=>{old(r);if(r.querySelector('#nova31-extra'))return;const d=document.createElement('div');d.id='nova31-extra';d.className='n31-card';d.innerHTML=html;d.style.marginTop='12px';r.appendChild(d);const b=d.querySelector('[data-n31]');if(b)b.onclick=()=>open('nova31');}; wrapped.__nova31Wrapped=true;N.PG[name]=wrapped; };
  wrapPage('hub',`<h3>✨ Nova 3.1</h3><span class="mut">15 funciones nuevas están aquí, sin tocar tu centro anterior.</span><div class="n31-actions"><button class="btn on" data-n31>Abrir Nuevas funciones</button></div>`);
  wrapPage('novedades',`<h3>Nova 3.1 · New Things</h3><span class="mut">Quick Actions, Pinboard, Memory, Smart Groups, Snapshots, Automations y más.</span><div class="n31-actions"><button class="btn on" data-n31>Ver Nova 3.1</button></div>`);

  /* ---------- Bind existing and future tabs ---------- */
  const bindTab = t => {
    if(!t?.wv?.addEventListener || t._nova31Bound)return t;
    t._nova31Bound=true;
    const ready=()=>{installPreview(t);applySiteTheme(t);bindPermission(t);};
    t.wv.addEventListener('dom-ready',ready); t.wv.addEventListener('did-navigate',()=>{ready();runAutomations(t)});t.wv.addEventListener('did-navigate-in-page',()=>{applySiteTheme(t)});
    runAutomations(t); bindPermission(t);
    return t;
  };
  const baseNewTab31 = newTab;
  if(!baseNewTab31.__nova31Wrapped){
    const wrappedNewTab = function(u){const t=baseNewTab31(u);return bindTab(t);}; wrappedNewTab.__nova31Wrapped=true; newTab=wrappedNewTab; N.newTab=wrappedNewTab;
  }
  tabs.slice().forEach(bindTab);

  /* ---------- Small keyboard shortcuts ---------- */
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='p'){e.preventDefault();open('pinboard');}
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='s'){e.preventDefault();open('snapshots');}
  });

  const aliases={nova31:'nova31',newthings:'nova31','new-things':'nova31',quick:'quick',pinboard:'pinboard',memory31:'memory31',smarttabs:'smarttabs',searchanything:'search31',search:'search31',preview:'preview31',linkpreview:'preview31',sitethemes:'sitethemes',websitethemes:'sitethemes',notifications31:'notifications31',automations:'automations',automation:'automations',mini:'mini31',minimode:'mini31',sendbox:'sendbox',novasend:'sendbox',snapshots:'snapshots',snapshot:'snapshots',daily:'daily',novadaily:'daily',permissions31:'permissions31',permission:'permissions31',cleanup31:'cleanup31',cleanup:'cleanup31'};
  const oldResolve=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]||(oldResolve?oldResolve(raw):raw)};
  N.openFeature31=open; N.pinCurrent31=pinCurrent; N.saveSnapshot31=saveSnapshot; N.nova31={open,mini,closeMini,saveSnapshot,pinCurrent,addMemory};
  window.Nova31=N.nova31;
  save();
})();
