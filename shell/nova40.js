/* Nova 4.0.0 · Ultimate Workspace layer
 * Adds the entire next-gen roadmap as one additive layer. Legacy Nova 3.x modules remain untouched.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const hostOf = u => { try { return new URL(String(u || '')).hostname.replace(/^www\./,'').toLowerCase(); } catch { return ''; } };
  const now = () => Date.now();
  const save = () => { try { window.save?.(); N.save?.(); } catch {} };
  const toast40 = msg => { try { toast(msg); } catch {} };
  const webTab = () => {
    try {
      const c = N.currentWebTab?.() || N.activeWebTab?.() || cur;
      if (c?.wv?.executeJavaScript && !c.wv.classList?.contains?.('ipage')) return c;
    } catch {}
    return null;
  };
  const current = () => {
    const t = webTab(); if (!t) return { t:null, url:'', title:'', host:'' };
    let url='', title='';
    try { url = http(t.wv.getURL?.() || ''); } catch {}
    try { title = t.el?.querySelector?.('span')?.textContent || url; } catch { title = url; }
    return { t, url, title, host:hostOf(url) };
  };
  const uniq = (arr, key, item) => {
    if (!item) return false;
    const v = String(item[key] || '');
    if (!v) return false;
    if (arr.some(x => String(x[key] || '') === v)) return false;
    arr.unshift(item); return true;
  };
  const ensure = () => {
    S.nova40 = Object.assign({
      vault: [], timeline: [], sessions: [], flows: [], workspaces: [], islands: [], extensions: [],
      siteProfiles: {}, customStudio: { accent:'', radius:16, glass:0.96 }, daily: {}, settings: { dock:true }, syncAt:0
    }, S.nova40 || {});
    for (const k of ['vault','timeline','sessions','flows','workspaces','islands','extensions']) if (!Array.isArray(S.nova40[k])) S.nova40[k]=[];
    for (const k of ['siteProfiles','daily','settings','customStudio']) if (!S.nova40[k] || typeof S.nova40[k] !== 'object') S.nova40[k]={};
  };
  ensure();

  const inject = async code => { const t=webTab(); if(!t) return null; try { return await t.wv.executeJavaScript(code); } catch { return null; } };
  const open = route => {
    const raw = String(route || '').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();
    if (raw==='command'||raw==='command-center'||raw==='acciones'||raw==='palette') { N.palette?.(); return null; }
    if (N.PG[raw]) return newTab('nova://' + raw);
    if (N.resolveFeatureRoute) {
      const r=N.resolveFeatureRoute(raw); if (r && N.PG[r]) return newTab('nova://' + r);
    }
    toast40('Función no disponible: '+raw); return null;
  };

  if (!document.getElementById('nova40-style')) {
    const st=document.createElement('style'); st.id='nova40-style'; st.textContent=`
      .n40-page{display:flex;flex-direction:column;gap:14px;max-width:1200px;margin:0 auto;padding-bottom:30px}.n40-hero{padding:22px;border:1px solid var(--bd);border-radius:24px;background:radial-gradient(circle at 92% 8%,color-mix(in srgb,var(--acc) 18%,transparent),transparent 48%),color-mix(in srgb,var(--bar) 96%,transparent);box-shadow:0 20px 70px #0002}.n40-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);font-weight:800}.n40-title{font-size:32px;font-weight:650;letter-spacing:-.03em}.n40-sub{color:var(--mut);line-height:1.6;max-width:900px}.n40-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:11px}.n40-card{padding:16px;border:1px solid var(--bd);border-radius:18px;background:color-mix(in srgb,var(--bar) 95%,transparent);display:flex;flex-direction:column;gap:9px}.n40-card:hover{border-color:color-mix(in srgb,var(--acc) 50%,var(--bd));box-shadow:0 12px 35px #0002}.n40-card h3{margin:0}.n40-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}.n40-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}.n40-list{display:flex;flex-direction:column;gap:8px}.n40-meta{min-width:0}.n40-meta b,.n40-meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n40-meta span{color:var(--mut);font-size:12px;margin-top:3px}.n40-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n40-chip.on{border-color:var(--acc);color:var(--acc)}.n40-code{white-space:pre-wrap;word-break:break-word;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}
      .n40-modal{position:fixed;inset:0;z-index:700;display:grid;place-items:center;background:rgba(0,0,0,.25);backdrop-filter:blur(9px)}.n40-dialog{width:min(820px,94vw);max-height:90vh;overflow:auto;padding:18px;border:1px solid var(--bd);border-radius:24px;background:color-mix(in srgb,var(--bar) 97%,transparent);box-shadow:0 30px 110px #0008}.n40-command{display:flex;flex-direction:column;gap:10px}.n40-command input{font-size:18px;padding:14px 15px;border-radius:15px}.n40-result{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid transparent;border-radius:12px;cursor:pointer}.n40-result:hover,.n40-result.sel{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent)}.n40-result small{color:var(--mut)}
      .n40-dock{position:fixed;left:12px;top:50%;transform:translateY(-50%);z-index:640;display:flex;flex-direction:column;gap:6px;padding:7px;border:1px solid var(--bd);border-radius:18px;background:color-mix(in srgb,var(--bar) 93%,transparent);box-shadow:0 20px 70px #0005;backdrop-filter:blur(18px)}.n40-dock button{width:38px;height:38px;border:0;border-radius:12px;background:transparent;color:var(--fg);cursor:pointer;font-size:16px}.n40-dock button:hover{background:color-mix(in srgb,var(--acc) 12%,transparent);color:var(--acc)}
      .n40-float{position:fixed;right:18px;bottom:18px;z-index:630;width:min(370px,calc(100vw - 36px));padding:14px;border:1px solid var(--acc);border-radius:20px;background:color-mix(in srgb,var(--bar) 96%,transparent);box-shadow:0 26px 100px #0008;backdrop-filter:blur(22px)}.n40-float h3{margin:0 0 5px}.n40-float p{margin:0;color:var(--mut);font-size:12px}.n40-desktop{display:grid;grid-template-columns:1fr 1fr;gap:12px}.n40-panel{min-height:200px;padding:14px;border:1px solid var(--bd);border-radius:16px;background:var(--bar)}
      @media(max-width:800px){.n40-grid{grid-template-columns:1fr}.n40-desktop{grid-template-columns:1fr}.n40-dock{left:8px}.n40-row{align-items:flex-start;flex-direction:column}}
    `; document.head.appendChild(st);
  }

  const page = (kicker,title,desc,body='') => `<div class="n40-page"><div class="n40-kicker">${esc(kicker)}</div><div class="n40-title">${esc(title)}</div><div class="n40-sub">${esc(desc)}</div>${body}</div>`;
  const btn=(label,attr='',cls='')=>`<button class="btn ${cls}" ${attr}>${label}</button>`;
  const card=(icon,title,desc,action='')=>`<div class="n40-card"><div style="font-size:24px">${icon}</div><h3>${esc(title)}</h3><div class="mut">${esc(desc)}</div>${action?`<div class="n40-actions">${action}</div>`:''}</div>`;

  async function pageSnapshotText(){
    const c=current(); if(!c.url) return null;
    return await inject(`(()=>{const clean=s=>String(s||'').replace(/\\s+/g,' ').trim();const hs=[...document.querySelectorAll('h1,h2,h3')].map(x=>clean(x.innerText)).filter(Boolean).slice(0,20);const ps=[...document.querySelectorAll('p,article li')].map(x=>clean(x.innerText)).filter(x=>x.length>40).slice(0,16);return {title:document.title||${JSON.stringify(c.title)},url:location.href,headings:hs,paragraphs:ps,links:document.links.length,words:(document.body?.innerText||'').trim().split(/\\s+/).filter(Boolean).length};})()`);
  }

  // ====== Launcher / Dock ======
  const commands = () => [
    ['🌌 Abrir Nova Ultimate',()=>open('novaUltimate'),'Hub'],
    ['⚡ Nova Launcher',()=>open('novaLauncher'),'Command'],
    ['🧠 Page Brain',()=>open('pagebrain'),'AI'],
    ['💬 Talk to Page',()=>open('talkpage'),'AI'],
    ['📚 Research Mode',()=>open('research40'),'Research'],
    ['🗃️ Nova Vault',()=>open('vault40'),'Workspace'],
    ['🕒 Timeline',()=>open('timeline40'),'Workspace'],
    ['↩️ Continue Anywhere',()=>open('continue40'),'Workspace'],
    ['⚙️ Web Superpowers',()=>open('webpowers40'),'Web'],
    ['🔎 Visual Search',()=>open('visual40'),'Web'],
    ['🌍 Magic Translate',()=>open('translate40'),'Web'],
    ['🧩 Workspaces+',()=>open('workspaces40'),'Organization'],
    ['🏝️ Islands 2.0',()=>open('islands40'),'Workspace'],
    ['🪐 Spaces 2.0',()=>open('spaces40'),'Workspace'],
    ['🧑‍🎨 Nova Studio',()=>open('studio40'),'Design'],
    ['⚙️ Nova Flows',()=>open('flows40'),'Automation'],
    ['🧩 Extensions 2.0',()=>open('extensions40'),'Extensions'],
    ['📱 Nova Companion',()=>open('companion40'),'Ecosystem'],
    ['☁️ Nova Sync',()=>open('sync40'),'Ecosystem'],
    ['🖥️ Desktop Mode',()=>open('desktop40'),'Workspace']
  ];
  function launcher(){
    document.getElementById('nova40-launcher')?.remove();
    const ov=document.createElement('div'); ov.id='nova40-launcher'; ov.className='n40-modal';
    ov.innerHTML=`<div class="n40-dialog n40-command"><div class="row"><b>Nova Launcher</b><span class="mut">Ctrl/Cmd + Space</span></div><input class="fld" id="n40-q" placeholder="Buscar funciones, pestañas, historial o URLs…" autofocus><div id="n40-r"></div></div>`;
    document.body.appendChild(ov); const q=ov.querySelector('#n40-q'), out=ov.querySelector('#n40-r');
    const render=()=>{
      const query=q.value.toLowerCase().trim(), items=[];
      for(const [label,fn,sub] of commands()) if(!query || label.toLowerCase().includes(query)||sub.toLowerCase().includes(query)) items.push({label,fn,sub});
      tabs.forEach(t=>{try{const label=t.el.querySelector('span')?.textContent||'Pestaña';const u=t.wv.getURL?.()||'';if(!query||label.toLowerCase().includes(query)||u.toLowerCase().includes(query))items.push({label,fn:()=>sel(t),sub:'Pestaña'})}catch{}});
      (S.hist||[]).slice(0,30).forEach(x=>{const label=String(x.t||x.u||'Historial'),u=String(x.u||'');if(!query||label.toLowerCase().includes(query)||u.toLowerCase().includes(query))items.push({label,fn:()=>newTab(u),sub:'Historial'})});
      out.innerHTML=items.slice(0,20).map((x,i)=>`<div class="n40-result ${i===0?'sel':''}" data-i="${i}"><span>${esc(x.label)}</span><small>${esc(x.sub)}</small></div>`).join('')||'<div class="mut">Nada encontrado.</div>';
      out.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const x=items[+b.dataset.i];ov.remove();x?.fn?.()});
    };
    q.oninput=render; ov.onclick=e=>{if(e.target===ov)ov.remove()}; q.onkeydown=e=>{if(e.key==='Escape')ov.remove();if(e.key==='Enter'){const b=out.querySelector('[data-i="0"]');if(b)b.click()}}; render();
  }

  function dock(){
    let d=document.getElementById('nova40-dock');
    if(d){d.remove();S.nova40.settings.dock=false;save();return;}
    d=document.createElement('div'); d.id='nova40-dock'; d.className='n40-dock';
    d.innerHTML=`<button title="Nova Ultimate">✦</button><button title="Launcher">⌕</button><button title="Pinboard">📌</button><button title="Brain">🧠</button><button title="Vault">🗃️</button><button title="Cerrar dock">×</button>`;
    document.body.appendChild(d); S.nova40.settings.dock=true; save();
    const bs=d.querySelectorAll('button');bs[0].onclick=()=>open('novaUltimate');bs[1].onclick=launcher;bs[2].onclick=()=>N.openFeature?.('pinboard');bs[3].onclick=()=>open('pagebrain');bs[4].onclick=()=>open('vault40');bs[5].onclick=()=>{d.remove();S.nova40.settings.dock=false;save()};
  }
  function addTop(){
    const host=document.getElementById('nova22-top-tools'); if(!host || host.querySelector('#n40-top'))return;
    const b=document.createElement('button');b.id='n40-top';b.className='nova22-topbtn';b.textContent='✦';b.title='Nova Ultimate';b.onclick=launcher;host.appendChild(b);
  }
  addTop();
  if(S.nova40.settings.dock) dock();

  // ====== Ultimate Hub ======
  N.PG.novaUltimate = r => {
    const groups=[
      ['🤖 Intelligence','Page Brain, Talk to Page, Research Mode', [['🧠','Page Brain','Entiende la página actual.',()=>open('pagebrain')],['💬','Talk to Page','Pregunta sobre lo que estás leyendo.',()=>open('talkpage')],['📚','Research Mode','Une varias pestañas en un informe.',()=>open('research40')]]],
      ['🗃️ Personal Space','Vault, Timeline, Continue Anywhere', [['🗃️','Nova Vault','Tu memoria y archivos locales.',()=>open('vault40')],['🕒','Timeline','Tu actividad importante, ordenada.',()=>open('timeline40')],['↩️','Continue Anywhere','Guarda y retoma una sesión completa.',()=>open('continue40')]]],
      ['🌐 Web Superpowers','Edición por sitio y herramientas contextuales', [['⚙️','Web Superpowers','Modo lectura, foco y estilo por sitio.',()=>open('webpowers40')],['🔎','Smart Web','Selección, extracción y resumen local.',()=>open('pagebrain')],['↗️','Pop-out Anything','Saca la página actual a una ventana.',()=>popOut()]]],
      ['🪐 Workspaces','Workspaces+, Islands 2.0 y Spaces 2.0', [['🧩','Workspaces+','Conjuntos de pestañas fáciles de recuperar.',()=>open('workspaces40')],['🏝️','Islands 2.0','Objetos flotantes de Nova.',()=>open('islands40')],['🪐','Spaces 2.0','Entornos personales independientes.',()=>open('spaces40')]]],
      ['🎨 Nova Studio','Personalización sin tocar el núcleo', [['🎨','Studio','Apariencia, acento y densidad.',()=>open('studio40')],['🧩','Extensions 2.0','Comandos locales sencillos.',()=>open('extensions40')]]],
      ['⚡ Automation','Flows y acciones automáticas', [['⚡','Nova Flows','Crea pequeños flujos visuales.',()=>open('flows40')],['🚀','Quick Launch','Lanza cualquier función rápidamente.',launcher]]],
      ['🌍 Ecosystem','Companion y Sync', [['📱','Companion','Envía páginas y texto al móvil mediante QR.',()=>open('companion40')],['☁️','Sync','Sincronización local o con cuenta Nova.',()=>open('sync40')],['🖥️','Desktop Mode','Un espacio con múltiples herramientas.',()=>open('desktop40')]]],
      ['✨ Nova 3.x Power','Tus herramientas existentes, ahora reunidas aquí', [['📸','Page Snapshot','Guarda una copia local de una página.',()=>open('snapshots')],['👀','Link Preview','Vista rápida de enlaces.',()=>open('preview31')],['🔔','Smart Notifications','Reglas por sitio.',()=>open('notifications31')],['🧩','Smart Tab Groups','Agrupa pestañas por dominio.',()=>open('smarttabs')],['🧹','One-Click Cleanup','Limpia datos seleccionados.',()=>open('cleanup31')],['☀️','Nova Daily','Continúa donde lo dejaste.',()=>open('daily')]]]
    ];
    r.innerHTML=page('NOVA 4.0','Nova Ultimate','Todo lo nuevo del roadmap en un solo sitio. Las funciones antiguas siguen donde estaban; esto se añade encima.',
      `<div class="n40-hero"><div class="n40-title" style="font-size:24px">Una Nova más potente, sin hacerla más difícil</div><div class="n40-sub" style="margin-top:6px">Un lanzador para descubrirlo todo y herramientas que se explican por sí solas.</div><div class="n40-actions" style="margin-top:12px">${btn('⌕ Abrir Nova Launcher','id="n40-launch"','on')}${btn('🧠 Analizar página','id="n40-brain"')}${btn('📌 Guardar página','id="n40-pin"')}${btn('✦ Mostrar/ocultar Dock','id="n40-dock-btn"')}</div></div>`+
      `<div class="n40-grid">${groups.map(g=>`<div class="n40-card"><h3>${esc(g[0])}</h3><div class="mut">${esc(g[1])}</div><div class="n40-grid">${g[2].map(x=>card(x[0],x[1],x[2],btn('Abrir',`data-route="${esc(x[1])}"`))).join('')}</div></div>`).join('')}</div>`);
    const all=groups.flatMap(g=>g[2]);
    r.querySelectorAll('[data-route]').forEach((b,i)=>{b.onclick=()=>all[i]?.[3]?.()});
    r.querySelector('#n40-launch').onclick=launcher;
    r.querySelector('#n40-brain').onclick=async()=>{open('pagebrain');};
    r.querySelector('#n40-pin').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web primero');if(!S.nova40.vault.some(x=>x.type==='page'&&x.url===c.url)){S.nova40.vault.unshift({id:'v'+now(),type:'page',title:c.title,url:c.url,createdAt:now()});save();toast40('Guardado en Nova Vault')}else toast40('Ya estaba guardada')};
    r.querySelector('#n40-dock-btn').onclick=dock;
  };

  // ====== Page Brain ======
  N.PG.pagebrain = r => {
    r.innerHTML=page('INTELLIGENCE','Page Brain','Extrae la estructura de la página actual sin salir de Nova.',`<div class="n40-card"><div class="n40-actions">${btn('🧠 Analizar ahora','id="brain-run"','on')}${btn('🤖 Abrir Nova IA','id="brain-ai"')}</div><div id="brain-out" class="n40-code">Pulsa “Analizar ahora”.</div></div>`);
    r.querySelector('#brain-run').onclick=async()=>{const out=r.querySelector('#brain-out');out.textContent='Analizando…';const data=await pageSnapshotText();if(!data){out.textContent='Abre una web antes de analizar.';return;}const lines=[`# ${data.title}`,`URL: ${data.url}`,`Palabras aproximadas: ${data.words}`,`Enlaces: ${data.links}`,'','## Estructura',...(data.headings||[]).map((x,i)=>`${i+1}. ${x}`),'','## Contenido destacado',...(data.paragraphs||[]).map(x=>`• ${x}`)];out.textContent=lines.join('\n');r.dataset.report=out.textContent;};
    r.querySelector('#brain-ai').onclick=()=>N.openFeature?.('ia');
  };

  // ====== Talk to Page ======
  N.PG.talkpage = r => {
    r.innerHTML=page('INTELLIGENCE','Talk to Page','Escribe una pregunta o palabra. Nova busca coincidencias dentro de la página.',`<div class="n40-card"><input class="fld" id="talk-q" placeholder="¿Qué quieres encontrar?" /><div class="n40-actions">${btn('Buscar','id="talk-go"','on')}${btn('Guardar resultado','id="talk-save"')}</div><div id="talk-out" class="n40-list"><div class="mut">Ejemplo: “precio”, “requisitos”, “garantía”…</div></div></div>`);
    let last='';
    r.querySelector('#talk-go').onclick=async()=>{const q=String(r.querySelector('#talk-q').value||'').trim();if(!q)return;const data=await inject(`(()=>{const q=${JSON.stringify(q.toLowerCase())};const text=(document.body?.innerText||'').replace(/\\s+/g,' ').trim();const parts=text.split(/(?<=[.!?])\\s+/);return parts.filter(x=>x.toLowerCase().includes(q)).slice(0,12);})()`);const hits=Array.isArray(data)?data:[];last=hits.length?hits.join('\n\n'):'No encontré coincidencias exactas. Prueba otra palabra.';r.querySelector('#talk-out').innerHTML=hits.length?hits.map(x=>`<div class="n40-row"><div class="n40-meta"><span>${esc(x)}</span></div></div>`).join(''):`<div class="n40-empty mut">${esc(last)}</div>`;};
    r.querySelector('#talk-save').onclick=()=>{if(!last)return toast40('Busca algo primero');S.nova40.vault.unshift({id:'v'+now(),type:'note',title:'Talk to Page',text:last.slice(0,6000),createdAt:now()});save();toast40('Resultado guardado en Vault')};
  };

  // ====== Research ======
  const collectTabs=()=>tabs.map(t=>{try{return {url:http(t.wv.getURL?.()||''),title:t.el?.querySelector?.('span')?.textContent||''}}catch{return null}}).filter(x=>x?.url);
  N.PG.research40 = r => {
    r.innerHTML=page('RESEARCH','Research Mode','Convierte tus pestañas web actuales en un informe simple y reutilizable.',`<div class="n40-card"><div class="n40-actions">${btn('📚 Crear informe','id="research-run"','on')}${btn('🗃️ Guardar en Vault','id="research-save"')}</div><div id="research-out" class="n40-code">Hay ${collectTabs().length} pestañas web disponibles.</div></div>`);
    let report='';
    r.querySelector('#research-run').onclick=()=>{const items=collectTabs();report=['# Nova Research',`Generado: ${new Date().toLocaleString('es')}`,'',...items.map((x,i)=>`## ${i+1}. ${x.title||x.url}\n${x.url}`)].join('\n');r.querySelector('#research-out').textContent=report;};
    r.querySelector('#research-save').onclick=()=>{if(!report){toast40('Crea el informe primero');return;}S.nova40.vault.unshift({id:'v'+now(),type:'research',title:'Nova Research',text:report,createdAt:now()});save();toast40('Investigación guardada')};
  };

  // ====== Vault ======
  N.PG.vault40 = r => {
    const list=S.nova40.vault;
    r.innerHTML=page('VAULT','Nova Vault','Tu espacio local para páginas, notas, investigaciones y recuerdos.',`<div class="n40-actions">${btn('＋ Nota','id="vault-note"','on')}${btn('🌐 Guardar página','id="vault-page"')}${btn('⬇ Exportar','id="vault-export"')}${btn('🧹 Vaciar','id="vault-clear"')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.text?.slice(0,80)||'Elemento')}</b><span>${esc(x.type||'item')} · ${new Date(x.createdAt||now()).toLocaleString('es')}</span></div><div class="n40-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">Vault vacío.</div>'}</div>`);
    r.querySelector('#vault-note').onclick=()=>{const v=String(prompt('Nota','')||'').trim();if(v){list.unshift({id:'v'+now(),type:'note',title:'Nota',text:v,createdAt:now()});save();N.PG.vault40(r)}};
    r.querySelector('#vault-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');if(uniq(list,'url',{id:'v'+now(),type:'page',title:c.title,url:c.url,createdAt:now()})){save();N.PG.vault40(r);toast40('Página guardada')}};
    r.querySelector('#vault-export').onclick=async()=>{const f=await ipc.invoke('save-text',{name:'Nova-Vault',ext:'json',content:JSON.stringify(list,null,2)}).catch(()=>null);toast40(f?'Vault exportado':'No se pudo exportar')};
    r.querySelector('#vault-clear').onclick=()=>{if(confirm('¿Vaciar Vault?')){list.length=0;save();N.PG.vault40(r)}};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.vault40(r)});
  };

  // ====== Timeline / Continue ======
  const timelineItems=()=>[...(S.nova40.timeline||[]),...(S.hist||[]).slice(0,60).map(x=>({type:'visit',title:x.t||x.u,url:x.u,at:x.d||now()}))].sort((a,b)=>Number(b.at||b.createdAt||0)-Number(a.at||a.createdAt||0));
  N.PG.timeline40 = r => { const items=timelineItems(); r.innerHTML=page('TIMELINE','Timeline','Una vista cronológica de lo importante que pasa dentro de Nova.',`<div class="n40-actions">${btn('🧭 Registrar página actual','id="tl-now"','on')}${btn('🧹 Limpiar eventos','id="tl-clear"')}</div><div class="n40-list">${items.slice(0,80).map(x=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.url||x.type)}</b><span>${esc(x.type||'evento')} · ${new Date(x.at||x.createdAt||now()).toLocaleString('es')}</span></div>${x.url?btn('Abrir',`data-url="${esc(x.url)}"`):''}</div>`).join('')||'<div class="mut">Aún no hay eventos.</div>'}</div>`);r.querySelector('#tl-now').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');S.nova40.timeline.unshift({type:'visit',title:c.title,url:c.url,at:now()});save();N.PG.timeline40(r);};r.querySelector('#tl-clear').onclick=()=>{S.nova40.timeline=[];save();N.PG.timeline40(r)};r.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>newTab(b.dataset.url)); };

  N.PG.continue40 = r => {
    const sessions=S.nova40.sessions;
    r.innerHTML=page('CONTINUE','Continue Anywhere','Guarda una sesión completa y vuelve a abrirla cuando quieras.',`<div class="n40-actions">${btn('💾 Guardar sesión actual','id="cont-save"','on')}${btn('🧹 Borrar sesiones','id="cont-clear"')}</div><div class="n40-list">${sessions.map((s,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(s.name)}</b><span>${s.tabs.length} pestañas · ${new Date(s.createdAt).toLocaleString('es')}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">No hay sesiones guardadas.</div>'}</div>`);
    r.querySelector('#cont-save').onclick=()=>{const ts=collectTabs();if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre de la sesión','Mi sesión')||'Mi sesión').trim();sessions.unshift({id:'s'+now(),name:name||'Mi sesión',tabs:ts,createdAt:now()});sessions.splice(20);save();N.PG.continue40(r);toast40('Sesión guardada')};
    r.querySelector('#cont-clear').onclick=()=>{sessions.length=0;save();N.PG.continue40(r)};
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const s=sessions[+b.dataset.open];(s?.tabs||[]).forEach(t=>newTab(t.url));toast40('Sesión reabierta')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{sessions.splice(+b.dataset.del,1);save();N.PG.continue40(r)});
  };

  // ====== Web Superpowers ======
  const siteRule=()=>{const c=current();return c.host?S.nova40.siteProfiles[c.host]||(S.nova40.siteProfiles[c.host]={}):null};
  const applySite=async()=>{const c=current();if(!c.host)return toast40('Abre una web');const p=siteRule();const css=[p.large?'body{font-size:1.16em!important}':'',p.clean?'header,nav,aside,footer,[role="banner"],[role="navigation"]{display:none!important}body{max-width:'+(p.clean?'980':'none')+'!important}':'',p.reader?'body{max-width:820px!important;margin:auto!important;font:19px/1.8 Georgia,serif!important}img,video{max-width:100%!important;height:auto!important}':''].join('');await inject(`(()=>{let s=document.getElementById('__nova40_site');if(!s){s=document.createElement('style');s.id='__nova40_site';document.head.appendChild(s)}s.textContent=${JSON.stringify(css)}`);toast40('Perfil aplicado en '+c.host)};
  N.PG.webpowers40=r=>{const p=siteRule()||{};r.innerHTML=page('WEB','Web Superpowers','Ajustes por sitio que se guardan en Nova.',`<div class="n40-card"><h3>${current().host?esc(current().host):'Sin sitio'}</h3><div class="row"><label><input type="checkbox" id="wp-large" ${p.large?'checked':''}> Texto grande</label></div><div class="row"><label><input type="checkbox" id="wp-clean" ${p.clean?'checked':''}> Ocultar navegación</label></div><div class="row"><label><input type="checkbox" id="wp-reader" ${p.reader?'checked':''}> Reader local</label></div><div class="n40-actions">${btn('Aplicar ahora','id="wp-apply"','on')}${btn('↗ Pop-out','id="wp-pop"')}${btn('📝 Guardar selección','id="wp-sel"')}</div></div>`);r.querySelector('#wp-apply').onclick=()=>{const c=current();if(!c.host)return toast40('Abre una web');S.nova40.siteProfiles[c.host]={large:r.querySelector('#wp-large').checked,clean:r.querySelector('#wp-clean').checked,reader:r.querySelector('#wp-reader').checked};save();applySite()};r.querySelector('#wp-pop').onclick=popOut;r.querySelector('#wp-sel').onclick=async()=>{const text=await inject(`window.getSelection?.().toString()||''`);if(!text)return toast40('Selecciona texto en la página');S.nova40.vault.unshift({id:'v'+now(),type:'selection',title:'Selección',text:String(text).slice(0,10000),createdAt:now()});save();toast40('Selección guardada en Vault')};};
  async function popOut(){const c=current();if(!c.url)return toast40('Abre una web');const out=await ipc.invoke('launch-web-app',{name:c.title||c.host||'Nova Pop-out',url:c.url}).catch(()=>null);toast40(out?.ok?'Página abierta en nueva ventana':'No se pudo abrir la ventana');}

  // ====== Workspaces / Islands / Spaces ======
  N.PG.workspaces40=r=>{const list=S.nova40.workspaces;r.innerHTML=page('WORKSPACE','Workspaces+','Conjuntos de pestañas, sin cambiar el sistema de Spaces existente.',`<div class="n40-actions">${btn('＋ Crear desde pestañas','id="ws-new"','on')}</div><div class="n40-list">${list.map((w,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(w.name)}</b><span>${w.tabs.length} pestañas</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">No tienes Workspaces+ todavía.</div>'}</div>`);r.querySelector('#ws-new').onclick=()=>{const ts=collectTabs();if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre','Trabajo')||'Trabajo').trim();list.unshift({id:'w'+now(),name:name||'Workspace',tabs:ts,createdAt:now()});save();N.PG.workspaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(list[+b.dataset.open]?.tabs||[]).forEach(t=>newTab(t.url));toast40('Workspace abierto')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.workspaces40(r)});};
  N.PG.islands40=r=>{const list=S.nova40.islands;r.innerHTML=page('ISLANDS 2.0','Islands 2.0','Objetos flotantes para cosas que quieres tener a mano.',`<div class="n40-actions">${btn('＋ Crear Island','id="is-new"','on')}${btn('✦ Mostrar flotantes','id="is-show"')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.name)}</b><span>${esc(x.text||'Sin nota')}</span></div><div class="n40-actions">${btn('Editar',`data-edit="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">Sin Islands nuevas.</div>'}</div>`);const redraw=()=>N.PG.islands40(r);r.querySelector('#is-new').onclick=()=>{const name=String(prompt('Nombre','Nueva Island')||'Nueva Island').trim();const text=String(prompt('Contenido','')||'').trim();if(name)list.unshift({id:'i'+now(),name,text,createdAt:now()});save();redraw()};r.querySelector('#is-show').onclick=()=>{showIslands();};r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.edit];if(!x)return;x.text=String(prompt('Contenido',x.text||'')||x.text||'');save();redraw()});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();redraw()});};
  function showIslands(){
    document.getElementById('nova40-floats')?.remove(); const box=document.createElement('div');box.id='nova40-floats';box.className='n40-float';
    box.innerHTML=`<div class="row"><h3>🏝️ Nova Islands</h3><button class="btn" id="float-close">×</button></div>${S.nova40.islands.map(x=>`<div class="n40-card" style="margin-top:8px"><b>${esc(x.name)}</b><span class="mut">${esc(x.text||'')}</span></div>`).join('')||'<div class="mut">Crea una Island desde Nova Ultimate.</div>'}`;document.body.appendChild(box);box.querySelector('#float-close').onclick=()=>box.remove();
  }
  N.PG.spaces40=r=>{const spaces=S.nova40.workspaces.map((x,i)=>({...x,kind:'space'}));r.innerHTML=page('SPACES 2.0','Spaces 2.0','Entornos conceptuales sobre la arquitectura actual de Nova.',`<div class="n40-card"><h3>Nuevo Space</h3><div class="mut">Un Space aquí es un contexto guardado: pestañas, estilo y recursos.</div><div class="n40-actions">${btn('＋ Crear Space','id="sp-new"','on')}</div></div><div class="n40-list">${spaces.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🪐 ${esc(x.name)}</b><span>${x.tabs.length} pestañas · contexto guardado</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}</div></div>`).join('')||'<div class="mut">Aún no hay Spaces 2.0.</div>'}</div>`);r.querySelector('#sp-new').onclick=()=>{const ts=collectTabs();if(!ts.length)return toast40('No hay pestañas');const name=String(prompt('Nombre del Space','Personal')||'Personal').trim();S.nova40.workspaces.unshift({id:'sp'+now(),name:name||'Space',tabs:ts,createdAt:now(),kind:'space'});save();N.PG.spaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(spaces[+b.dataset.open]?.tabs||[]).forEach(t=>newTab(t.url));toast40('Space abierto')});};

  // ====== Studio ======
  function applyStudio(){const x=S.nova40.customStudio||{};if(x.accent)document.documentElement.style.setProperty('--acc',x.accent);if(x.radius)document.documentElement.style.setProperty('--r',Math.max(6,Math.min(28,Number(x.radius)))+'px');}
  N.PG.studio40=r=>{const x=S.nova40.customStudio||{};r.innerHTML=page('STUDIO','Nova Studio','Personaliza la superficie sin tocar el resto del navegador.',`<div class="n40-card"><div class="row"><label>Acento <input type="color" id="st-color" value="${esc(x.accent||'#5b8cff')}"></label><label>Radio <input type="range" id="st-radius" min="8" max="28" value="${Number(x.radius)||16}"></label></div><div class="n40-actions">${btn('Aplicar','id="st-apply"','on')}${btn('Restaurar','id="st-reset"')}</div><div class="mut">Esto solo añade una capa visual encima de los temas existentes.</div></div>`);r.querySelector('#st-apply').onclick=()=>{S.nova40.customStudio={accent:r.querySelector('#st-color').value,radius:r.querySelector('#st-radius').value,glass:.96};save();applyStudio();toast40('Studio aplicado')};r.querySelector('#st-reset').onclick=()=>{S.nova40.customStudio={accent:'',radius:16,glass:.96};document.documentElement.style.removeProperty('--acc');document.documentElement.style.setProperty('--r','16px');save();N.PG.studio40(r)};};
  applyStudio();

  // ====== Flows ======
  const flowAction = async step => {const t=step.type,v=String(step.value||'');if(t==='open'&&http(v))return newTab(v);if(t==='feature'&&v)return open(v);if(t==='pin'){const c=current();if(c.url&&!S.nova40.vault.some(x=>x.type==='page'&&x.url===c.url))S.nova40.vault.unshift({id:'v'+now(),type:'page',title:c.title,url:c.url,createdAt:now()});save();return;}if(t==='note'&&v){S.nova40.vault.unshift({id:'v'+now(),type:'note',title:'Flow',text:v,createdAt:now()});save();return;}if(t==='popup')return popOut();if(t==='island'){S.nova40.islands.unshift({id:'i'+now(),name:'Flow Island',text:v,createdAt:now()});save();showIslands();}};
  const runFlow = async f => {for(const s of (f.steps||[])) await flowAction(s);toast40('Flow completado: '+f.name)};
  N.PG.flows40=r=>{const list=S.nova40.flows;r.innerHTML=page('AUTOMATION','Nova Flows','Automatiza acciones pequeñas con un creador muy simple.',`<div class="n40-card"><h3>Crear Flow</h3><div class="mut">Ejemplo de pasos: open URL → pin → island.</div><div class="n40-actions">${btn('＋ Nuevo Flow','id="flow-new"','on')}</div></div><div class="n40-list">${list.map((f,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(f.name)}</b><span>Al abrir ${esc(f.whenHost||'*')} · ${f.steps.length} pasos · ${f.enabled===false?'pausado':'activo'}</span></div><div class="n40-actions">${btn('Ejecutar',`data-run="${i}"`)}${btn(f.enabled===false?'Activar':'Pausar',`data-toggle="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">No tienes Flows.</div>'}</div>`);r.querySelector('#flow-new').onclick=()=>{const host=String(prompt('Sitio que dispara el Flow (ej. youtube.com)','')||'').trim().replace(/^www\./,'');if(!host)return;const name=String(prompt('Nombre','Mi Flow')||'Mi Flow').trim();const raw=String(prompt('Pasos separados por |\nopen:https://... | pin | note:Texto | feature:media | popup | island:Texto','pin | island:Hola')||'').trim();const map=raw.split('|').map(x=>x.trim()).filter(Boolean).map(s=>{const i=s.indexOf(':');const type=i<0?s:s.slice(0,i);const value=i<0?'':s.slice(i+1);return {type,value}});list.unshift({id:'f'+now(),name:name||'Mi Flow',whenHost:host,steps:map,enabled:true,createdAt:now()});save();N.PG.flows40(r)};r.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>runFlow(list[+b.dataset.run]));r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const f=list[+b.dataset.toggle];f.enabled=!f.enabled;save();N.PG.flows40(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.flows40(r)});};

  // ====== Extensions 2.0 ======
  N.PG.extensions40=r=>{const list=S.nova40.extensions;r.innerHTML=page('EXTENSIONS','Extensions 2.0','Pequeños comandos locales, sin tocar módulos del navegador.',`<div class="n40-card"><h3>Crear extensión local</h3><div class="mut">Nombre + acción Nova. Ideal para añadir accesos personales.</div><div class="n40-actions">${btn('＋ Crear','id="ext-new"','on')}</div></div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🧩 ${esc(x.name)}</b><span>${esc(x.route||x.action||'Nova')}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="mut">No hay extensiones locales.</div>'}</div>`);r.querySelector('#ext-new').onclick=()=>{const name=String(prompt('Nombre','Mi comando')||'Mi comando').trim();const route=String(prompt('Ruta Nova (ej. media, writer, novaUltimate)','novaUltimate')||'novaUltimate').trim();if(name)list.unshift({id:'e'+now(),name,route,createdAt:now()});save();N.PG.extensions40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(list[+b.dataset.open]?.route));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.extensions40(r)});};

  // ====== Visual Search / Translate ======
  N.PG.visual40=r=>{r.innerHTML=page('WEB POWER','Visual Search','Usa la selección o la página actual para lanzar una búsqueda visual/textual rápida.',`<div class="n40-card"><div class="n40-actions">${btn('🔎 Buscar selección','id="vis-sel"','on')}${btn('🔎 Buscar página','id="vis-page"')}${btn('📸 Capturar página','id="vis-shot"')}</div><div class="mut">La selección se busca como texto y la captura se guarda con el sistema de Nova.</div></div>`);r.querySelector('#vis-sel').onclick=async()=>{const t=await inject(`window.getSelection?.().toString()||''`);const q=String(t||'').trim()||current().title;if(!q)return toast40('No hay selección ni título');newTab('https://www.google.com/search?q='+encodeURIComponent(q))};r.querySelector('#vis-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');newTab('https://www.google.com/search?q='+encodeURIComponent(c.title||c.url))};r.querySelector('#vis-shot').onclick=async()=>{const c=current();if(!c.t?.wv?.capturePage)return toast40('Abre una web');try{const img=await c.t.wv.capturePage();const f=await ipc.invoke('save-shot',img.toPNG());toast40(f?'Captura guardada':'No se pudo guardar')}catch{toast40('No se pudo capturar')}}};
  N.PG.translate40=r=>{r.innerHTML=page('WEB POWER','Magic Translate','Traduce una selección sin reconfigurar toda la página.',`<div class="n40-card"><div class="n40-actions">${btn('🌍 Traducir selección','id="tr-sel"','on')}${btn('🌍 Traducir página','id="tr-page"')}</div><div class="mut">Abre la traducción en una pestaña normal y mantiene intacta la página original.</div></div>`);r.querySelector('#tr-sel').onclick=async()=>{const t=await inject(`window.getSelection?.().toString()||''`);if(!t)return toast40('Selecciona texto');newTab('https://translate.google.com/?sl=auto&tl=es&text='+encodeURIComponent(String(t)))};r.querySelector('#tr-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');newTab('https://translate.google.com/translate?sl=auto&tl=es&u='+encodeURIComponent(c.url))};};

  // ====== Companion / Sync / Desktop ======
  N.PG.companion40=r=>{const c=current();r.innerHTML=page('ECOSYSTEM','Nova Companion','Envía una página o texto a otro dispositivo usando el sistema QR de Nova.',`<div class="n40-card"><h3>${c.url?esc(c.title):'Sin página'}</h3><div class="mut">El QR se puede abrir desde un móvil sin instalar nada.</div><div class="n40-actions">${btn('📱 Crear QR','id="cmp-qr"','on')}${btn('📤 Guardar en Send','id="cmp-send"')}</div></div>`);r.querySelector('#cmp-qr').onclick=()=>{const url=c.url;if(!url)return toast40('Abre una web');N.openFeature?.('qr');setTimeout(()=>{try{const input=document.querySelector('#nx-qr-url,#qr-url,input[type=url]');if(input){input.value=url;input.dispatchEvent(new Event('input',{bubbles:true}))}}catch{}},120)};r.querySelector('#cmp-send').onclick=()=>{const c2=current();if(!c2.url)return toast40('Abre una web');S.nova40.vault.unshift({id:'v'+now(),type:'send',title:c2.title,url:c2.url,createdAt:now()});save();toast40('Preparado para enviar')};};
  N.PG.sync40=r=>{r.innerHTML=page('ECOSYSTEM','Nova Sync','Exporta, importa o sincroniza tu espacio Nova. Las funciones antiguas no se sustituyen.',`<div class="n40-card"><div class="n40-actions">${btn('☁️ Sincronizar con cuenta','id="sync-account"','on')}${btn('⬇ Exportar paquete','id="sync-export"')}${btn('⬆ Importar JSON','id="sync-import"')}</div><div class="n40-code" id="sync-status">Última sincronización: ${S.nova40.syncAt?new Date(S.nova40.syncAt).toLocaleString('es'):'nunca'}.</div></div>`);
    r.querySelector('#sync-export').onclick=async()=>{const payload={nova40:S.nova40,nova31:S.nova31||{},novaNext:S.novaNext||{}};const f=await ipc.invoke('save-text',{name:'Nova-Sync-Package',ext:'json',content:JSON.stringify(payload,null,2)}).catch(()=>null);r.querySelector('#sync-status').textContent=f?'Paquete exportado a Descargas.':'No se pudo exportar.'};
    r.querySelector('#sync-import').onclick=()=>{const raw=prompt('Pega aquí el JSON exportado por Nova:','');if(!raw)return;try{const data=JSON.parse(raw);if(data.nova40&&typeof data.nova40==='object')S.nova40=Object.assign(S.nova40,data.nova40);if(data.nova31&&typeof data.nova31==='object')S.nova31=Object.assign(S.nova31||{},data.nova31);save();r.querySelector('#sync-status').textContent='Importación completada.';toast40('Nova Sync importado')}catch{toast40('JSON no válido')}};
    r.querySelector('#sync-account').onclick=async()=>{const status=await ipc.invoke('account-status').catch(()=>({loggedIn:false}));if(!status?.loggedIn)return toast40('Inicia sesión en Nova para usar sincronización de cuenta');const payload={nova40:S.nova40,nova31:S.nova31||{},novaNext:S.novaNext||{}};const out=await ipc.invoke('account-sync',payload).catch(()=>null);if(out?.ok){S.nova40.syncAt=now();save();r.querySelector('#sync-status').textContent='Cuenta sincronizada.';toast40('Nova Sync completado')}else toast40(out?.error||'No se pudo sincronizar')};
  };
  N.PG.desktop40=r=>{r.innerHTML=page('WORKSPACE','Desktop Mode','Un panel de herramientas múltiples dentro de Nova, sin tocar la ventana principal.',`<div class="n40-desktop"><div class="n40-panel"><h3>🧠 Intelligence</h3><span class="mut">Page Brain y Talk to Page</span><div class="n40-actions">${btn('Brain','id="desk-brain"')}${btn('Talk','id="desk-talk"')}</div></div><div class="n40-panel"><h3>🗃️ Personal</h3><span class="mut">Vault y Timeline</span><div class="n40-actions">${btn('Vault','id="desk-vault"')}${btn('Timeline','id="desk-time"')}</div></div><div class="n40-panel"><h3>⚡ Control</h3><span class="mut">Launcher y Flows</span><div class="n40-actions">${btn('Launcher','id="desk-launch"')}${btn('Flows','id="desk-flows"')}</div></div><div class="n40-panel"><h3>🎨 Surface</h3><span class="mut">Studio y Web Superpowers</span><div class="n40-actions">${btn('Studio','id="desk-studio"')}${btn('Web Power','id="desk-web"')}</div></div></div>`);[['desk-brain','pagebrain'],['desk-talk','talkpage'],['desk-vault','vault40'],['desk-time','timeline40'],['desk-flows','flows40'],['desk-studio','studio40'],['desk-web','webpowers40']].forEach(([id,route])=>r.querySelector('#'+id).onclick=()=>open(route));r.querySelector('#desk-launch').onclick=launcher;};

  // ====== Global flow trigger, selection capture, context helpers ======
  const flowBound=new WeakSet();
  const bindFlow=t=>{if(!t?.wv?.addEventListener||flowBound.has(t))return;flowBound.add(t);t.wv.addEventListener('did-navigate',()=>{let u='';try{u=http(t.wv.getURL?.()||'')}catch{}const h=hostOf(u);if(!h)return;S.nova40.flows.filter(f=>f.enabled!==false&&(!f.whenHost||f.whenHost===h)).forEach(f=>setTimeout(()=>runFlow(f),180))})};
  tabs.forEach(bindFlow);
  const baseNewTab=window.newTab; if(typeof baseNewTab==='function'&&!baseNewTab.__nova40){const wrapped=function(u){const t=baseNewTab(u);bindFlow(t);return t};wrapped.__nova40=true;window.newTab=wrapped;N.newTab=wrapped;}

  // ====== Routes + API ======
  const aliases={nova40:'novaUltimate',novaultimate:'novaUltimate',novalauncher:'novaLauncher',ultimate:'novaUltimate','nova-ultimate':'novaUltimate',launcher:'novaLauncher','pagebrain':'pagebrain','talkpage':'talkpage','talk-to-page':'talkpage',research:'research40','research40':'research40',vault:'vault40','vault40':'vault40',timeline:'timeline40',continue:'continue40','continue-anywhere':'continue40',webpowers:'webpowers40','web-superpowers':'webpowers40',visual:'visual40','visual-search':'visual40',translate:'translate40','magic-translate':'translate40',workspacesplus:'workspaces40',workspaces40:'workspaces40',islands2:'islands40','islands-2':'islands40',spaces2:'spaces40','spaces-2':'spaces40',studio:'studio40',flows:'flows40',extensions2:'extensions40',companion:'companion40',sync:'sync40',desktop:'desktop40'};
  const oldResolve=N.resolveFeatureRoute;N.resolveFeatureRoute=x=>{const raw=String(x||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();return aliases[raw]||(oldResolve?oldResolve(raw):raw)};
  const oldOpenFeature=N.openFeature;
  if(typeof oldOpenFeature==='function'&&!oldOpenFeature.__nova40){
    const compat=function(name){const raw=String(name||'').replace(/^nova:\/\//,'').split(/[/?#]/)[0].toLowerCase();const page=aliases[raw]||raw;if(N.PG[page])return newTab('nova://'+page);return oldOpenFeature(name)};
    compat.__nova40=true; N.openFeature=compat;
  }
  N.openFeature40=open; N.launcher40=launcher; N.dock40=dock; N.popOut40=popOut;
  window.Nova40={open,launcher,dock,popOut,brain:()=>open('pagebrain'),vault:()=>open('vault40'),research:()=>open('research40')};

  // Unified launcher page
  N.PG.novaLauncher=r=>{r.innerHTML=page('LAUNCHER','Nova Launcher','Busca y ejecuta cualquier cosa con una sola caja.',`<div class="n40-card"><input class="fld" id="launcher-input" placeholder="Escribe una función…"><div class="n40-actions">${btn('Abrir lanzador completo','id="launcher-open"','on')}</div><div class="mut">Atajo global: Ctrl/Cmd + Space</div></div>`);r.querySelector('#launcher-open').onclick=launcher;r.querySelector('#launcher-input').onkeydown=e=>{if(e.key==='Enter'){const q=e.target.value.toLowerCase().trim();const hit=commands().find(x=>x[0].toLowerCase().includes(q));if(hit)hit[1]();else toast40('No encontré ese comando')}}};

  // Discoverability
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  if(!N.extraActs.some(a=>a[0]==='Nova 4.0 · Ultimate'))N.extraActs.push(['Nova 4.0 · Ultimate',()=>open('novaUltimate')]);
  const oldPalette=N.palette;
  if(typeof oldPalette==='function'&&!oldPalette.__nova40){const wrapped=()=>{oldPalette();setTimeout(()=>{const dlg=document.querySelector('#nova30-cmd .nx-command');if(!dlg||dlg.querySelector('#n40-palette'))return;const b=document.createElement('button');b.id='n40-palette';b.className='btn on';b.textContent='✦ Abrir Nova Ultimate';b.onclick=()=>{document.getElementById('nova30-cmd')?.remove();open('novaUltimate')};dlg.appendChild(b)},0)};wrapped.__nova40=true;N.palette=wrapped;}
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.code==='Space'){const tag=document.activeElement?.tagName?.toLowerCase();if(tag!=='input'&&tag!=='textarea'&&tag!=='select'){e.preventDefault();launcher();}}if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='u'){e.preventDefault();open('novaUltimate')}});
  save();
})();
