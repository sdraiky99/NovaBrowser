/* Nova 4.0.0 · Ultimate Clean
 * Additive layer: keeps Nova 3.x modules intact and makes the new tools easier to discover/use.
 */
(() => {
  'use strict';
  const N = window.NOVA;
  if (!N || !N.PG) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = () => Date.now();
  const http = u => { try { const x = new URL(String(u || '')); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
  const hostOf = u => { try { return new URL(String(u || '')).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
  const toast40 = msg => { try { toast(String(msg)); } catch {} };
  const save = () => { try { N.save?.(); } catch {} try { window.save?.(); } catch {} };

  const state = () => {
    S.nova40 = Object.assign({
      vault: [], timeline: [], sessions: [], flows: [], workspaces: [], islands: [], extensions: [],
      siteProfiles: {}, customStudio: { accent:'', radius:16, density:1 },
      syncAt: 0, settings: { dock:true, launcherHint:true }, version:1
    }, S.nova40 || {});
    for (const k of ['vault','timeline','sessions','flows','workspaces','islands','extensions']) {
      if (!Array.isArray(S.nova40[k])) S.nova40[k] = [];
    }
    for (const k of ['siteProfiles','settings','customStudio']) {
      if (!S.nova40[k] || typeof S.nova40[k] !== 'object') S.nova40[k] = {};
    }
    return S.nova40;
  };
  const st = state();

  const webTab = () => {
    try {
      const t = N.currentWebTab?.() || N.activeWebTab?.();
      if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage')) return t;
    } catch {}
    try {
      for (const t of tabs || []) if (t?.wv?.executeJavaScript && t.wv.tagName === 'WEBVIEW' && !t.wv.classList?.contains?.('ipage') && t.el?.classList?.contains?.('on')) return t;
    } catch {}
    return null;
  };

  const current = () => {
    const t = webTab();
    if (!t) return { t:null, url:'', title:'', host:'' };
    let url = '', title = '';
    try { url = http(t.wv.getURL?.() || ''); } catch {}
    try { title = t.el?.querySelector?.('span')?.textContent || url; } catch { title = url; }
    return { t, url, title, host: hostOf(url) };
  };

  const inject = async (t, code) => {
    if (!t?.wv?.executeJavaScript) return null;
    try { return await t.wv.executeJavaScript(code); } catch { return null; }
  };

  const oldResolve = N.resolveFeatureRoute;

  const internalRoute = route => {
    const raw = String(route || '').replace(/^nova:\/\//i, '').split(/[/?#]/)[0].trim();
    if (!raw) return '';
    const low = raw.toLowerCase();
    if (['command','command-center','acciones','palette'].includes(low)) return 'command';
    const direct = Object.keys(N.PG).find(k => k.toLowerCase() === low);
    if (direct) return direct;
    const alias = aliases[low];
    if (alias) return alias;
    try {
      const resolved = oldResolve?.(low);
      if (resolved && Object.keys(N.PG).some(k => k === resolved)) return resolved;
    } catch {}
    return '';
  };

  const open = route => {
    const page = internalRoute(route);
    if (page === 'command') { N.palette?.(); return null; }
    if (!page) { toast40('No encontré esa función'); return null; }
    try { return typeof newTab === 'function' ? newTab('nova://' + page) : N.openFeature?.(page); } catch { return null; }
  };

  const currentTitle = () => current().title || current().host || 'Página';
  const shortText = (s, n=320) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const pushUnique = (arr, item, key='url', limit=200) => {
    if (!item || !String(item[key] || '').trim()) return false;
    const value = String(item[key]);
    if (arr.some(x => String(x?.[key] || '') === value)) return false;
    arr.unshift(item);
    if (arr.length > limit) arr.length = limit;
    return true;
  };

  const aliases = {
    nova40:'novaUltimate', novaultimate:'novaUltimate', ultimate:'novaUltimate', 'nova-ultimate':'novaUltimate',
    launcher:'novaLauncher', novalauncher:'novaLauncher',
    pagebrain:'pagebrain', talkpage:'talkpage', 'talk-to-page':'talkpage',
    research:'research40', research40:'research40', vault:'vault40', vault40:'vault40',
    timeline:'timeline40', continue:'continue40', 'continue-anywhere':'continue40',
    webpowers:'webpowers40', 'web-superpowers':'webpowers40', visual:'visual40', 'visual-search':'visual40',
    translate:'translate40', 'magic-translate':'translate40', workspacesplus:'workspaces40', workspaces40:'workspaces40',
    islands2:'islands40', 'islands-2':'islands40', spaces2:'spaces40', 'spaces-2':'spaces40',
    studio:'studio40', flows:'flows40', extensions2:'extensions40', companion:'companion40', sync:'sync40', desktop:'desktop40',
    'smart-tab-groups':'smarttabs', smarttabs:'smarttabs', pinboard:'pinboard', memory:'memory31',
    search:'search31', searchanything:'search31', preview:'preview31', linkpreview:'preview31',
    notifications:'notifications31', automations:'automations', mini:'mini31', send:'sendbox', novasend:'sendbox',
    snapshots:'snapshots', snapshot:'snapshots', daily:'daily', permissions:'permissions31', cleanup:'cleanup31'
  };

  if (!document.getElementById('nova40-style')) {
    const css = document.createElement('style'); css.id = 'nova40-style';
    css.textContent = `
      .n40-page{display:flex;flex-direction:column;gap:14px;max-width:1180px;margin:0 auto;padding-bottom:28px}
      .n40-hero{padding:22px;border:1px solid var(--bd);border-radius:24px;background:radial-gradient(circle at 92% 6%,color-mix(in srgb,var(--acc) 18%,transparent),transparent 45%),var(--bar);box-shadow:0 18px 65px #0002}
      .n40-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);font-weight:800}.n40-title{font-size:31px;font-weight:650;letter-spacing:-.03em}.n40-sub{color:var(--mut);line-height:1.6;max-width:900px}
      .n40-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}.n40-card{display:flex;flex-direction:column;gap:8px;padding:15px;border:1px solid var(--bd);border-radius:18px;background:var(--bar)}
      .n40-card:hover{border-color:color-mix(in srgb,var(--acc) 55%,var(--bd));box-shadow:0 10px 30px #0002}.n40-card h3{margin:0}
      .n40-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}.n40-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid var(--bd);border-radius:14px;background:var(--bar)}
      .n40-meta{min-width:0}.n40-meta b,.n40-meta span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n40-meta span{color:var(--mut);font-size:12px;margin-top:3px}
      .n40-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);font-size:12px}.n40-chip.on{border-color:var(--acc);color:var(--acc)}
      .n40-code{white-space:pre-wrap;word-break:break-word;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:12px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)}
      .n40-modal{position:fixed;inset:0;z-index:980;display:grid;place-items:center;background:rgba(0,0,0,.24);backdrop-filter:blur(10px)}.n40-dialog{width:min(840px,94vw);max-height:88vh;overflow:auto;padding:18px;border:1px solid var(--bd);border-radius:24px;background:color-mix(in srgb,var(--bar) 97%,transparent);box-shadow:0 30px 110px #0009}
      .n40-command{display:flex;flex-direction:column;gap:10px}.n40-command input{font-size:18px;padding:14px 15px}.n40-result{display:flex;align-items:center;gap:12px;padding:11px 12px;border:1px solid transparent;border-radius:13px;cursor:pointer}.n40-result:hover,.n40-result.sel{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent)}.n40-result .grow{flex:1;min-width:0}.n40-result small{display:block;color:var(--mut);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .n40-dock{position:fixed;left:12px;top:50%;transform:translateY(-50%);z-index:940;display:flex;flex-direction:column;gap:5px;padding:7px;border:1px solid var(--bd);border-radius:18px;background:color-mix(in srgb,var(--bar) 93%,transparent);box-shadow:0 18px 65px #0005;backdrop-filter:blur(18px)}
      .n40-dock button{width:38px;height:38px;border:0;border-radius:12px;background:transparent;color:var(--fg);cursor:pointer;font-size:16px}.n40-dock button:hover{background:color-mix(in srgb,var(--acc) 12%,transparent);color:var(--acc)}
      .n40-empty{padding:15px;border:1px dashed var(--bd);border-radius:14px;color:var(--mut)}
      .n40-float{position:fixed;right:18px;bottom:18px;z-index:930;width:min(360px,calc(100vw - 36px));padding:14px;border:1px solid var(--acc);border-radius:20px;background:color-mix(in srgb,var(--bar) 96%,transparent);box-shadow:0 22px 90px #0008;backdrop-filter:blur(20px)}
      .n40-mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.n40-mini-grid .btn{width:100%}
      @media(max-width:760px){.n40-grid{grid-template-columns:1fr}.n40-row{align-items:flex-start;flex-direction:column}.n40-mini-grid{grid-template-columns:1fr}.n40-dock{left:7px}}
    `;
    document.head.appendChild(css);
  }

  const page = (kicker,title,desc,body='') => `<div class="n40-page"><div class="n40-kicker">${esc(kicker)}</div><div class="n40-title">${esc(title)}</div><div class="n40-sub">${esc(desc)}</div>${body}</div>`;
  const btn = (label, attr='', cls='') => `<button class="btn ${cls}" ${attr}>${label}</button>`;
  const card = (icon,title,desc,actions='') => `<div class="n40-card"><div style="font-size:23px">${icon}</div><h3>${esc(title)}</h3><div class="mut">${esc(desc)}</div>${actions ? `<div class="n40-actions">${actions}</div>` : ''}</div>`;

  async function extractPage(t=current().t, max=14000) {
    if (!t) return null;
    let tabUrl='';
    try { tabUrl=http(t.wv.getURL?.()||''); } catch {}
    if (!tabUrl) return null;
    const tabTitle=(() => { try { return t.el?.querySelector?.('span')?.textContent || tabUrl; } catch { return tabUrl; } })();
    const payload = await inject(t, `(()=>{const clean=s=>String(s||'').replace(/\\s+/g,' ').trim();const pick=(q,n)=>[...document.querySelectorAll(q)].map(x=>clean(x.innerText||x.textContent)).filter(Boolean).slice(0,n);return {title:document.title||'',url:location.href,headings:pick('h1,h2,h3',18),paragraphs:pick('article p,main p,p,li',24),selection:clean(window.getSelection?.().toString()||''),text:clean(document.body?.innerText||'').slice(0,${Math.max(1000, max)}),linkCount:document.links?.length||0};})()`);
    if (payload && typeof payload === 'object') return payload;
    return {title:tabTitle,url:tabUrl,headings:[],paragraphs:[],selection:'',text:'',linkCount:0};
  }

  const askAI = async (question, context='', system='Eres Nova IA. Responde de forma clara, útil y breve. Separa hechos de inferencias.') => {
    const q = String(question || '').trim(); if (!q) return { error:'Pregunta vacía.' };
    try {
      return await ipc.invoke('ai-ask', {
        msgs: [{role:'user', content:q}],
        system: system + (context ? '\n\nContexto proporcionado por el usuario:\n' + String(context).slice(0,18000) : ''),
        model: S.model
      });
    } catch (e) { return {error:e?.message || 'No se pudo consultar Nova IA.'}; }
  };

  const currentSnapshot = async () => {
    const c = current();
    if (!c.url) return null;
    const data = await extractPage(c.t, 18000);
    if (!data) return null;
    return {
      title: data.title || c.title,
      url: data.url || c.url,
      host: c.host,
      at: now(),
      headings: data.headings || [],
      paragraphs: data.paragraphs || [],
      wordCount: String(data.text||'').split(/\s+/).filter(Boolean).length,
      linkCount: Number(data.linkCount || 0)
    };
  };

  const saveCurrentPage = (extra={}) => {
    const c=current();
    if (!c.url) { toast40('Abre una página web primero'); return false; }
    const ok = pushUnique(st.vault, {id:'v'+now(), type:'page', title:c.title||c.host, url:c.url, createdAt:now(), ...extra}, 'url', 250);
    save(); toast40(ok ? 'Guardado en Nova Vault' : 'Ya estaba guardada'); return ok;
  };

  const pinCurrent = () => {
    const c=current();
    if (!c.url) { toast40('Abre una página web primero'); return false; }
    S.nova31 = S.nova31 || {}; S.nova31.pinboard = Array.isArray(S.nova31.pinboard) ? S.nova31.pinboard : [];
    const ok = pushUnique(S.nova31.pinboard, {title:c.title||c.host,url:c.url,createdAt:now()}, 'url', 250);
    save(); toast40(ok ? 'Añadido al Pinboard' : 'Ya estaba en el Pinboard'); return ok;
  };

  const collectTabs = async (withText=false) => {
    const out=[];
    for (const t of (tabs || [])) {
      try {
        const url=http(t.wv.getURL?.()||'');
        if (!url || !t.wv?.executeJavaScript || t.wv.classList?.contains?.('ipage')) continue;
        const title=t.el?.querySelector?.('span')?.textContent||url;
        const row={url,title};
        if (withText) {
          const d=await extractPage(t,8000);
          if (d) Object.assign(row,{headings:d.headings||[],paragraphs:d.paragraphs||[],text:d.text||''});
        }
        out.push(row);
      } catch {}
    }
    return out;
  };

  // ---------- Unified Launcher ----------
  const baseCommands = () => [
    ['✦ Nova Ultimate','Todo Nova en un sitio','novaUltimate'],['🧠 Page Brain','Entender la página actual','pagebrain'],['💬 Talk to Page','Preguntar sobre la página','talkpage'],
    ['📚 Research Mode','Investigar varias pestañas','research40'],['🗃️ Vault','Guardar y encontrar cosas','vault40'],['📌 Pinboard','Guardado temporal','pinboard'],['⚡ Quick Actions','Acciones rápidas','quick'],
    ['🪄 Flows','Automatizaciones','flows40'],['🧩 Workspaces+','Packs de pestañas','workspaces40'],['🪐 Spaces 2.0','Contextos guardados','spaces40'],['🏝️ Islands 2.0','Notas flotantes','islands40'],
    ['🎨 Nova Studio','Personalización','studio40'],['🌍 Translate','Traducción','translate40'],['🔎 Search','Búsqueda en la web','search31'],['☀️ Daily','Continuar','daily'],['📱 Companion','Enviar a otro dispositivo','companion40'],
    ['☁️ Sync','Exportar/importar','sync40'],['🖥️ Desktop Mode','Panel de herramientas','desktop40']
  ];

  const allCommands = () => {
    const out=baseCommands().map(x=>({label:x[0],sub:x[1],run:()=>open(x[2])}));
    const seen=new Set(out.map(x=>x.label));
    for (const [label, fn] of (N.extraActs || [])) if (typeof fn==='function' && !seen.has(label)) { out.push({label:String(label),sub:'Nova',run:fn}); seen.add(label); }
    for (const key of Object.keys(N.PG)) {
      if (['novaUltimate','novaLauncher'].includes(key)) continue;
      const label=key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/31|40/g,'').replace(/^\w/,m=>m.toUpperCase());
      if (seen.has(label)) continue;
      out.push({label:'Nova · '+label,sub:'Página interna',run:()=>open(key)}); seen.add(label);
    }
    return out;
  };

  function launcher(seed='') {
    document.getElementById('nova40-launcher')?.remove();
    const ov=document.createElement('div'); ov.id='nova40-launcher'; ov.className='n40-modal';
    ov.innerHTML=`<div class="n40-dialog n40-command"><div class="row"><b>Nova Launcher</b><span class="mut">Ctrl/Cmd + Space · ↑↓ · Enter</span></div><input class="fld" id="n40-q" autocomplete="off" placeholder="Busca una función, pestaña, historial o URL…" value="${esc(seed)}"><div id="n40-r"></div><div class="mut">Consejo: escribe “Writer”, “Reader”, “QR”, “Media”, “Downloads”…</div></div>`;
    document.body.appendChild(ov);
    const q=ov.querySelector('#n40-q'), out=ov.querySelector('#n40-r'); let index=0;
    const dynamic=()=>{
      const items=[]; const query=q.value.toLowerCase().trim();
      for (const x of allCommands()) if (!query || x.label.toLowerCase().includes(query) || x.sub.toLowerCase().includes(query)) items.push(x);
      for (const t of (tabs||[])) { try { const label=t.el?.querySelector?.('span')?.textContent||'Pestaña'; const url=t.wv.getURL?.()||''; if (!query || label.toLowerCase().includes(query)||url.toLowerCase().includes(query)) items.push({label,sub:'Pestaña',run:()=>{try{return N.selectTab?.(t) || sel?.(t);}catch{return null;}}}); } catch {} }
      for (const x of (S.hist||[]).slice(0,40)) { const label=String(x.t||x.u||'Historial'); const url=String(x.u||''); if (!query || label.toLowerCase().includes(query)||url.toLowerCase().includes(query)) items.push({label,sub:'Historial',run:()=>http(url)&&newTab(url)}); }
      if (http(q.value.trim())) items.unshift({label:'Abrir URL',sub:q.value.trim(),run:()=>newTab(http(q.value.trim()))});
      return items.slice(0,30);
    };
    const paint=()=>{
      const items=dynamic(); if(index>=items.length) index=Math.max(0,items.length-1);
      out.innerHTML=items.map((x,i)=>`<div class="n40-result ${i===index?'sel':''}" data-i="${i}"><div class="grow"><b>${esc(x.label)}</b><small>${esc(x.sub)}</small></div><span>↵</span></div>`).join('')||'<div class="n40-empty">Nada encontrado.</div>';
      out.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{const x=items[+el.dataset.i];ov.remove();x?.run?.();});
    };
    q.oninput=()=>{index=0;paint();};
    q.onkeydown=e=>{
      const items=dynamic();
      if(e.key==='ArrowDown'){e.preventDefault();index=Math.min(index+1,Math.max(items.length-1,0));paint();}
      else if(e.key==='ArrowUp'){e.preventDefault();index=Math.max(index-1,0);paint();}
      else if(e.key==='Enter'){e.preventDefault();ov.remove();items[index]?.run?.();}
      else if(e.key==='Escape'){e.preventDefault();ov.remove();}
    };
    ov.onclick=e=>{if(e.target===ov)ov.remove();}; paint(); q.focus(); q.select?.();
  }

  function quickActions() {
    document.getElementById('nova40-quick')?.remove();
    const ov=document.createElement('div'); ov.id='nova40-quick'; ov.className='n40-modal';
    ov.innerHTML=`<div class="n40-dialog"><div class="row"><b>⚡ Quick Actions</b><button class="btn" id="qa-close">×</button></div><div class="n40-mini-grid" style="margin-top:12px">${[
      ['📌','Pinboard',pinCurrent],['💾','Vault',saveCurrentPage],['🧠','Brain',()=>open('pagebrain')],['📸','Snapshot',()=>open('snapshots')],['📖','Reader+',()=>N.openFeature?.('reader')],['📝','Writer',()=>N.openFeature?.('writer')],['🔊','PIP',()=>N.openFeature?.('pip')],['⬇','Downloads',()=>N.openFeature?.('descargas2')],['⌕','Launcher',()=>launcher()],['✦','Ultimate',()=>open('novaUltimate')]
    ].map((x,i)=>`<button class="btn" data-i="${i}">${x[0]} ${esc(x[1])}</button>`).join('')}</div></div>`;
    document.body.appendChild(ov);
    const actions=[pinCurrent,saveCurrentPage,()=>open('pagebrain'),()=>open('snapshots'),()=>N.openFeature?.('reader'),()=>N.openFeature?.('writer'),()=>N.openFeature?.('pip'),()=>N.openFeature?.('descargas2'),()=>{ov.remove();launcher();},()=>{ov.remove();open('novaUltimate')}];
    ov.querySelector('#qa-close').onclick=()=>ov.remove(); ov.onclick=e=>{if(e.target===ov)ov.remove();}; ov.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>actions[+b.dataset.i]?.());
  }

  function showDock() {
    const existing=document.getElementById('nova40-dock');
    if(existing){existing.remove();st.settings.dock=false;save();return;}
    const d=document.createElement('div'); d.id='nova40-dock'; d.className='n40-dock';
    d.innerHTML='<button title="Ultimate">✦</button><button title="Launcher">⌕</button><button title="Quick Actions">⚡</button><button title="Vault">🗃</button><button title="Brain">🧠</button><button title="Cerrar">×</button>';
    document.body.appendChild(d); st.settings.dock=true; save();
    const b=d.querySelectorAll('button');
    b[0].onclick=()=>open('novaUltimate'); b[1].onclick=()=>launcher(); b[2].onclick=quickActions; b[3].onclick=()=>open('vault40'); b[4].onclick=()=>open('pagebrain'); b[5].onclick=()=>showDock();
  }

  const addTop = () => {
    const host=document.getElementById('nova22-top-tools'); if (!host || host.querySelector('#n40-top')) return;
    const b=document.createElement('button'); b.id='n40-top'; b.className='nova22-topbtn'; b.textContent='✦'; b.title='Nova Ultimate'; b.onclick=()=>open('novaUltimate'); host.appendChild(b);
  };
  addTop();
  if (st.settings.dock) showDock();

  // ---------- Hub ----------
  N.PG.novaUltimate = r => {
    const c=current(); const vault=st.vault.length + (S.nova31?.memory?.length||0); const tabsCount=(tabs||[]).length;
    const groups=[
      ['🤖 Intelligence','Entender, preguntar e investigar',['pagebrain','talkpage','research40']],
      ['🗃️ Space','Guardar, recuperar y continuar',['vault40','timeline40','continue40']],
      ['🌐 Web Powers','Herramientas encima de la web',['webpowers40','visual40','translate40','snapshots']],
      ['🧩 Organize','Pestañas, Islands y Spaces',['workspaces40','islands40','spaces40']],
      ['⚙️ Build','Personaliza y automatiza',['studio40','flows40','extensions40']],
      ['🌍 Ecosystem','Conecta y exporta',['companion40','sync40','desktop40']],
      ['✨ Nova 3.1','Las novedades que ya tienes',['quick','pinboard','memory31','search31','preview31','notifications31','automations','mini31','sendbox','snapshots','daily','permissions31','cleanup31']]
    ];
    r.innerHTML=page('NOVA ULTIMATE','Nova Ultimate','Todo lo nuevo, reunido en una sola superficie. Las funciones antiguas no se sustituyen.',
      `<div class="n40-hero"><div class="row"><div><div class="n40-title" style="font-size:24px">${c.url?esc(c.title||c.host):'Tu centro de Nova'}</div><div class="n40-sub" style="margin-top:5px">${c.url?esc(c.host):'Abre una web y usa las acciones contextuales.'}</div></div><span class="n40-chip on">${tabsCount} pestañas</span></div><div class="n40-actions" style="margin-top:12px">${btn('⌕ Buscar todo','id="n40-launch"','on')}${btn('⚡ Acciones rápidas','id="n40-quick"')}${btn('🧠 Analizar página','id="n40-brain"')}${btn('📌 Guardar','id="n40-save"')}${btn('☰ Dock','id="n40-dock"')}</div><div class="n40-actions" style="margin-top:9px"><span class="n40-chip">🗃️ ${vault} guardados/recuerdos</span><span class="n40-chip">⚙️ ${st.flows.length} Flows</span><span class="n40-chip">🧩 ${st.workspaces.length} Workspaces</span></div></div>`+
      `<div class="n40-grid">${groups.map(g=>`<div class="n40-card"><h3>${esc(g[0])}</h3><div class="mut">${esc(g[1])}</div><div class="n40-actions">${g[2].slice(0,6).map(route=>btn(labelFor(route),`data-route="${esc(route)}"`)).join('')}</div>${g[2].length>6?`<div class="n40-actions">${btn('Ver todo',`data-more="${esc(g[0])}"`)}</div>`:''}</div>`).join('')}</div>`
    );
    r.querySelector('#n40-launch').onclick=()=>launcher(); r.querySelector('#n40-quick').onclick=quickActions; r.querySelector('#n40-brain').onclick=()=>open('pagebrain'); r.querySelector('#n40-save').onclick=()=>saveCurrentPage(); r.querySelector('#n40-dock').onclick=showDock;
    r.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>open(b.dataset.route));
    r.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>launcher(b.dataset.more));
  };

  const labels = {
    pagebrain:'🧠 Page Brain',talkpage:'💬 Talk to Page',research40:'📚 Research',vault40:'🗃️ Vault',timeline40:'🕒 Timeline',continue40:'↩️ Continue',
    webpowers40:'⚙️ Web Powers',visual40:'🔎 Visual Search',translate40:'🌍 Translate',snapshots:'📸 Snapshot',workspaces40:'🧩 Workspaces+',islands40:'🏝️ Islands',spaces40:'🪐 Spaces',
    studio40:'🎨 Studio',flows40:'⚡ Flows',extensions40:'🧩 Extensions',companion40:'📱 Companion',sync40:'☁️ Sync',desktop40:'🖥️ Desktop',quick:'⚡ Quick Actions',pinboard:'📌 Pinboard',memory31:'🧠 Memory',search31:'⌕ Search',preview31:'👀 Preview',notifications31:'🔔 Notifications',automations:'🪄 Automations',mini31:'🪟 Mini Mode',sendbox:'📤 Nova Send',daily:'☀️ Daily',permissions31:'🛡 Permissions',cleanup31:'🧹 Cleanup'
  };
  const labelFor = route => labels[route] || ('Nova · ' + String(route).replace(/([a-z])([A-Z])/g,'$1 $2'));

  // ---------- Intelligence ----------
  N.PG.pagebrain = r => {
    r.innerHTML=page('INTELLIGENCE','Page Brain','Analiza la página actual y, cuando hay IA disponible, permite preguntas con contexto.',`<div class="n40-card"><div class="n40-actions">${btn('🧠 Analizar','id="brain-run"','on')}${btn('🤖 Preguntar a Nova','id="brain-ai"')}${btn('💾 Guardar informe','id="brain-save"')}</div><div id="brain-out" class="n40-code">Listo para analizar.</div></div>`);
    let report='';
    r.querySelector('#brain-run').onclick=async()=>{const out=r.querySelector('#brain-out');out.textContent='Analizando…';const d=await currentSnapshot();if(!d){out.textContent='Abre una web primero.';return;}report=[`# ${d.title}`,`URL: ${d.url}`,`Palabras: ${d.wordCount}`,'','## Encabezados',...(d.headings||[]).map((x,i)=>`${i+1}. ${x}`),'','## Extractos',...(d.paragraphs||[]).slice(0,12).map(x=>`• ${shortText(x,500)}`)].join('\n');out.textContent=report;};
    r.querySelector('#brain-ai').onclick=async()=>{const d=await extractPage(current().t,16000);if(!d){toast40('Abre una web primero');return;}const q=String(prompt('¿Qué quieres saber de esta página?','Resume lo más importante')||'').trim();if(!q)return;const out=r.querySelector('#brain-out');out.textContent='Nova está pensando…';const resp=await askAI(q,`Título: ${d.title}\nURL: ${d.url}\n\n${d.text}`,'Eres Nova IA dentro de un navegador. Responde solo con base en el contexto proporcionado y di claramente cuando no hay suficiente información.');out.textContent=resp?.text||resp?.error||'No hubo respuesta.';report=out.textContent;};
    r.querySelector('#brain-save').onclick=()=>{if(!report)return toast40('Analiza o pregunta primero');st.vault.unshift({id:'v'+now(),type:'brain',title:'Page Brain — '+currentTitle(),text:report,createdAt:now()});save();toast40('Informe guardado')};
  };

  N.PG.talkpage = r => {
    r.innerHTML=page('INTELLIGENCE','Talk to Page','Pregunta sobre la página. Nova usa el contenido actual como contexto y puede caer a búsqueda local.',`<div class="n40-card"><input class="fld" id="talk-q" placeholder="¿Qué quieres saber?"><div class="n40-actions">${btn('Enviar','id="talk-go"','on')}${btn('Guardar','id="talk-save"')}</div><div id="talk-out" class="n40-code">Ejemplos: “precio”, “requisitos”, “resume esto”…</div></div>`);
    let last='';
    r.querySelector('#talk-go').onclick=async()=>{const q=String(r.querySelector('#talk-q').value||'').trim();if(!q)return;const d=await extractPage(current().t,12000);if(!d){r.querySelector('#talk-out').textContent='Abre una web primero.';return;}r.querySelector('#talk-out').textContent='Consultando…';const resp=await askAI(q,`Título: ${d.title}\nURL: ${d.url}\n\n${d.text}`,'Eres Nova Talk to Page. Responde con claridad, cita datos del contexto y no inventes información ausente.');last=resp?.text||resp?.error||'';if(!last){const low=q.toLowerCase();const hits=(d.paragraphs||[]).filter(x=>x.toLowerCase().includes(low)).slice(0,10);last=hits.join('\n\n')||'No encontré una respuesta en esta página.';}r.querySelector('#talk-out').textContent=last;};
    r.querySelector('#talk-save').onclick=()=>{if(!last)return toast40('Pregunta primero');st.vault.unshift({id:'v'+now(),type:'note',title:'Talk to Page — '+currentTitle(),text:last.slice(0,8000),createdAt:now()});save();toast40('Guardado en Vault');};
    r.querySelector('#talk-q').onkeydown=e=>{if(e.key==='Enter')r.querySelector('#talk-go').click();};
  };

  N.PG.research40 = r => {
    r.innerHTML=page('RESEARCH','Research Mode','Crea un informe real a partir de tus pestañas web, no solo una lista de URLs.',`<div class="n40-card"><div class="row"><span class="mut" id="res-count">Preparando…</span><div class="n40-actions">${btn('📚 Analizar pestañas','id="res-run"','on')}${btn('🤖 Sintetizar con IA','id="res-ai"')}${btn('💾 Guardar','id="res-save"')}</div></div><div id="res-out" class="n40-code">Pulsa “Analizar pestañas”.</div></div>`);
    let report=''; let data=[];
    r.querySelector('#res-count').textContent=`${(tabs||[]).length} pestañas abiertas`;
    r.querySelector('#res-run').onclick=async()=>{const out=r.querySelector('#res-out');out.textContent='Leyendo pestañas…';data=await collectTabs(true);report=['# Nova Research',`Generado: ${new Date().toLocaleString('es')}`,'',...data.map((x,i)=>`## ${i+1}. ${x.title}\n${x.url}\n${(x.headings||[]).slice(0,6).map(h=>'- '+h).join('\n')}\n${shortText((x.paragraphs||[]).join(' '),900)}`)].join('\n\n');out.textContent=report;};
    r.querySelector('#res-ai').onclick=async()=>{if(!data.length)data=await collectTabs(true);if(!data.length){toast40('No hay pestañas web');return;}const ctx=data.map((x,i)=>`FUENTE ${i+1}: ${x.title}\n${x.url}\n${x.text}`).join('\n\n').slice(0,26000);r.querySelector('#res-out').textContent='Sintetizando…';const resp=await askAI('Compara y resume estas fuentes, destacando coincidencias, diferencias y preguntas abiertas.',ctx,'Eres Nova Research. Usa únicamente las fuentes proporcionadas y nombra las URLs de las fuentes cuando afirmes algo importante.');report=resp?.text||resp?.error||'Sin respuesta.';r.querySelector('#res-out').textContent=report;};
    r.querySelector('#res-save').onclick=()=>{if(!report)return toast40('Genera un informe primero');st.vault.unshift({id:'v'+now(),type:'research',title:'Nova Research',text:report,createdAt:now()});save();toast40('Investigación guardada');};
  };

  // ---------- Personal Space ----------
  N.PG.vault40 = r => {
    const list=st.vault;
    const render=(query='')=>{const q=query.toLowerCase().trim();const filtered=list.filter(x=>!q||[x.title,x.url,x.text,x.type].some(v=>String(v||'').toLowerCase().includes(q)));r.innerHTML=page('VAULT','Nova Vault','Un solo lugar para páginas, notas, análisis e investigaciones.',`<div class="n40-actions"><input class="fld" id="vault-q" placeholder="Buscar en Vault…" value="${esc(query)}">${btn('＋ Nota','id="vault-note"','on')}${btn('🌐 Página','id="vault-page"')}${btn('💾 Exportar','id="vault-export"')}</div><div class="n40-list">${filtered.map(x=>{const i=list.indexOf(x);return `<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.type||'Elemento')}</b><span>${esc(x.type||'item')}${x.url?' · '+esc(x.url):''}</span></div><div class="n40-actions">${x.url?btn('Abrir',`data-open="${i}"`):''}${x.type==='note'||x.type==='brain'?btn('Editar',`data-edit="${i}"`):''}${btn('Borrar',`data-del="${i}"`)}</div></div>`}).join('')||'<div class="n40-empty">No hay resultados.</div>'}</div>`);
      r.querySelector('#vault-q').oninput=e=>render(e.target.value); r.querySelector('#vault-note').onclick=()=>{const text=String(prompt('Nota','')||'').trim();if(!text)return;list.unshift({id:'v'+now(),type:'note',title:'Nota',text,createdAt:now()});save();render(query);}; r.querySelector('#vault-page').onclick=()=>saveCurrentPage();
      r.querySelector('#vault-export').onclick=async()=>{const f=await ipc.invoke('save-text',{name:'Nova-Vault',ext:'json',content:JSON.stringify(list,null,2)}).catch(()=>null);toast40(f?'Vault exportado':'No se pudo exportar');};
      r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(list[+b.dataset.open]?.url));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();render(query)});r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.edit];if(!x)return;const text=String(prompt('Texto',x.text||'')||'').trim();if(text){x.text=text;save();render(query)}});
    }; render();
  };

  const timelineItems=()=>[...(st.timeline||[]),...(S.hist||[]).slice(0,80).map(x=>({type:'visit',title:x.t||x.u,url:x.u,at:x.d||now()}))].sort((a,b)=>Number(b.at||b.createdAt||0)-Number(a.at||a.createdAt||0));
  N.PG.timeline40 = r => { const render=(q='')=>{const items=timelineItems().filter(x=>!q||[x.title,x.url,x.type].some(v=>String(v||'').toLowerCase().includes(q.toLowerCase())));r.innerHTML=page('TIMELINE','Timeline','Recupera lo importante por fecha y vuelve a abrirlo.',`<div class="n40-actions"><input class="fld" id="tl-q" placeholder="Buscar timeline…" value="${esc(q)}">${btn('🧭 Registrar actual','id="tl-now"','on')}${btn('🧹 Limpiar','id="tl-clear"')}</div><div class="n40-list">${items.slice(0,100).map(x=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.title||x.url||x.type)}</b><span>${esc(x.type||'evento')} · ${new Date(x.at||x.createdAt||now()).toLocaleString('es')}</span></div>${x.url?btn('Abrir',`data-url="${esc(x.url)}"`):''}</div>`).join('')||'<div class="n40-empty">Aún no hay actividad.</div>'}</div>`);r.querySelector('#tl-q').oninput=e=>render(e.target.value);r.querySelector('#tl-now').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');st.timeline.unshift({type:'visit',title:c.title,url:c.url,at:now()});save();render(q)};r.querySelector('#tl-clear').onclick=()=>{st.timeline=[];save();render(q)};r.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>newTab(b.dataset.url));}; render(); };

  N.PG.continue40 = r => {
    const list=st.sessions;
    r.innerHTML=page('CONTINUE','Continue Anywhere','Guarda la sesión completa y recupera sus pestañas cuando quieras.',`<div class="n40-actions">${btn('💾 Guardar sesión','id="cont-save"','on')}${btn('🧹 Borrar todas','id="cont-clear"')}</div><div class="n40-list">${list.map((s,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(s.name||'Sesión')}</b><span>${(s.tabs||[]).length} pestañas · ${new Date(s.createdAt||now()).toLocaleString('es')}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No hay sesiones guardadas.</div>'}</div>`);
    r.querySelector('#cont-save').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre de la sesión','Mi sesión')||'Mi sesión').trim()||'Mi sesión';list.unshift({id:'s'+now(),name,tabs:ts,createdAt:now()});list.splice(20);save();N.PG.continue40(r);toast40('Sesión guardada');};r.querySelector('#cont-clear').onclick=()=>{list.length=0;save();N.PG.continue40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(list[+b.dataset.open]?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast40('Sesión reabierta')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.continue40(r)});
  };

  // ---------- Web powers ----------
  const profileForTab=t=>{if(!t)return null;let url='';try{url=http(t.wv.getURL?.()||'')}catch{}const host=hostOf(url);return host?{host,profile:st.siteProfiles[host]||{}}:null;};
  const siteRule=()=>{const c=current();return c.host?(st.siteProfiles[c.host]||(st.siteProfiles[c.host]={})):null;};
  const applySiteFor=async t=>{const meta=profileForTab(t);if(!meta)return;const p=meta.profile;const css=[p.large?'body{font-size:1.16em!important}':'',p.clean?'header,nav,aside,footer,[role="banner"],[role="navigation"]{display:none!important}':'',p.reader?'body{max-width:820px!important;margin:auto!important;font:19px/1.8 system-ui,sans-serif!important}img,video{max-width:100%!important;height:auto!important}':''].join('');await inject(t,`(()=>{let s=document.getElementById('__nova40_site');if(!s){s=document.createElement('style');s.id='__nova40_site';document.head.appendChild(s)}s.textContent=${JSON.stringify(css)};return true})()`);};
  const applySite=()=>applySiteFor(current().t);
  N.PG.webpowers40=r=>{const p=siteRule()||{};r.innerHTML=page('WEB','Web Superpowers','Preferencias por sitio que se recuerdan automáticamente.',`<div class="n40-card"><h3>${esc(current().host||'Sin sitio')}</h3><label><input type="checkbox" id="wp-large" ${p.large?'checked':''}> Texto grande</label><label><input type="checkbox" id="wp-clean" ${p.clean?'checked':''}> Modo limpio</label><label><input type="checkbox" id="wp-reader" ${p.reader?'checked':''}> Reader local</label><div class="n40-actions">${btn('Aplicar','id="wp-apply"','on')}${btn('↗ Pop-out','id="wp-pop"')}${btn('📌 Guardar selección','id="wp-sel"')}</div></div>`);r.querySelector('#wp-apply').onclick=()=>{const c=current();if(!c.host)return toast40('Abre una web');st.siteProfiles[c.host]={large:r.querySelector('#wp-large').checked,clean:r.querySelector('#wp-clean').checked,reader:r.querySelector('#wp-reader').checked};save();applySite();toast40('Perfil aplicado')};r.querySelector('#wp-pop').onclick=()=>{try{N.popOut40?.()}catch{}};r.querySelector('#wp-sel').onclick=async()=>{const c=current();const txt=await inject(c.t,`window.getSelection?.().toString()||''`);if(!txt)return toast40('Selecciona texto');st.vault.unshift({id:'v'+now(),type:'selection',title:'Selección · '+currentTitle(),text:String(txt).slice(0,10000),createdAt:now()});save();toast40('Selección guardada')};};

  N.PG.workspaces40 = r => { const list=st.workspaces; r.innerHTML=page('WORKSPACE','Workspaces+','Guarda paquetes de pestañas para recuperarlos con un clic.',`<div class="n40-actions">${btn('＋ Crear workspace','id="ws-new"','on')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.name)}</b><span>${(x.tabs||[]).length} pestañas</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Todavía no hay Workspaces+.</div>'}</div>`);r.querySelector('#ws-new').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas web');const name=String(prompt('Nombre','Trabajo')||'Trabajo').trim()||'Workspace';list.unshift({id:'w'+now(),name,tabs:ts,createdAt:now()});save();N.PG.workspaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{(list[+b.dataset.open]?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast40('Workspace abierto')});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.workspaces40(r)}); };
  N.PG.spaces40 = r => { const list=st.workspaces.filter(x=>x.kind==='space'); r.innerHTML=page('SPACES 2.0','Spaces 2.0','Una capa fácil para recuperar contextos de trabajo.',`<div class="n40-actions">${btn('＋ Crear Space','id="sp-new"','on')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🪐 ${esc(x.name)}</b><span>${(x.tabs||[]).length} pestañas</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Aún no hay Spaces.</div>'}</div>`);r.querySelector('#sp-new').onclick=async()=>{const ts=await collectTabs(false);if(!ts.length)return toast40('No hay pestañas');const name=String(prompt('Nombre del Space','Personal')||'Personal').trim()||'Space';st.workspaces.unshift({id:'sp'+now(),name,tabs:ts,createdAt:now(),kind:'space'});save();N.PG.spaces40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.open];(x?.tabs||[]).forEach(t=>t.url&&newTab(t.url));}); };

  N.PG.islands40 = r => { const list=st.islands; r.innerHTML=page('ISLANDS 2.0','Islands 2.0','Pequeñas tarjetas flotantes para dejar cosas a la vista.',`<div class="n40-actions">${btn('＋ Nueva Island','id="is-new"','on')}${btn('✦ Mostrar','id="is-show"')}</div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(x.name)}</b><span>${esc(x.text||'')}</span></div><div class="n40-actions">${btn('Editar',`data-edit="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">Crea una Island para verla aquí y en flotante.</div>'}</div>`);r.querySelector('#is-new').onclick=()=>{const c=current();const name=String(prompt('Nombre','Nueva Island')||'Nueva Island').trim();if(!name)return;const text=String(prompt('Contenido',c.url?c.title:'')||'').trim();list.unshift({id:'i'+now(),name,text,url:c.url||'',createdAt:now()});save();N.PG.islands40(r)};r.querySelector('#is-show').onclick=showIslands;r.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.edit];if(!x)return;const text=String(prompt('Contenido',x.text||'')||x.text||'');x.text=text;save();N.PG.islands40(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.islands40(r)});};
  function showIslands(){document.getElementById('nova40-floats')?.remove();const box=document.createElement('div');box.id='nova40-floats';box.className='n40-float';box.innerHTML=`<div class="row"><b>🏝️ Islands</b><button class="btn" id="is-close">×</button></div>${st.islands.map((x,i)=>`<div class="n40-row" style="margin-top:8px"><div class="n40-meta"><b>${esc(x.name)}</b><span>${esc(x.text||'')}</span></div>${x.url?btn('Abrir',`data-open="${i}"`):''}</div>`).join('')||'<div class="n40-empty" style="margin-top:8px">No hay Islands.</div>'}`;document.body.appendChild(box);box.querySelector('#is-close').onclick=()=>box.remove();box.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>newTab(st.islands[+b.dataset.open]?.url));}

  // ---------- Studio / Automation / Extensions ----------
  const applyStudio=()=>{const x=st.customStudio||{};if(x.accent)document.documentElement.style.setProperty('--acc',x.accent);if(x.radius)document.documentElement.style.setProperty('--r',Math.max(6,Math.min(28,Number(x.radius)))+'px');};
  N.PG.studio40=r=>{const x=st.customStudio||{};r.innerHTML=page('STUDIO','Nova Studio','Ajusta la superficie de Nova sin tocar los módulos antiguos.',`<div class="n40-card"><div class="row"><label>Acento <input type="color" id="st-color" value="${esc(x.accent||'#5b8cff')}"></label><label>Radio <input type="range" id="st-radius" min="8" max="28" value="${Number(x.radius)||16}"></label></div><div class="n40-actions">${btn('Aplicar','id="st-apply"','on')}${btn('Restaurar','id="st-reset"')}</div></div>`);r.querySelector('#st-apply').onclick=()=>{st.customStudio={accent:r.querySelector('#st-color').value,radius:r.querySelector('#st-radius').value,density:1};save();applyStudio();toast40('Studio aplicado')};r.querySelector('#st-reset').onclick=()=>{st.customStudio={accent:'',radius:16,density:1};document.documentElement.style.removeProperty('--acc');document.documentElement.style.setProperty('--r','16px');save();N.PG.studio40(r)};}; applyStudio();

  const flowAction=async step=>{const t=String(step?.type||''),v=String(step?.value||'');if(t==='open'&&http(v)){newTab(v);return;}if(t==='feature'&&v){open(v);return;}if(t==='pin'){pinCurrent();return;}if(t==='note'&&v){st.vault.unshift({id:'v'+now(),type:'note',title:'Flow',text:v,createdAt:now()});save();return;}if(t==='island'){st.islands.unshift({id:'i'+now(),name:'Flow Island',text:v,url:current().url,createdAt:now()});save();showIslands();return;}if(t==='snapshot'){await open('snapshots');return;}};
  const runFlow=async f=>{for(const step of (f?.steps||[]))await flowAction(step);toast40('Flow completado: '+(f?.name||'Nova Flow'));};
  const flowPresets=[['Guardar web en Vault',[{type:'pin'}]],['Crear Island con título',[{type:'island',value:'Página actual'}]],['Abrir y guardar',[{type:'open',value:'https://example.com'},{type:'pin'}]]];
  N.PG.flows40=r=>{const list=st.flows;r.innerHTML=page('AUTOMATION','Nova Flows','Automatizaciones simples: crea, prueba y pausa sin programar.',`<div class="n40-card"><div class="n40-actions">${btn('＋ Nuevo Flow','id="flow-new"','on')}${flowPresets.map((x,i)=>btn('⚡ '+x[0],`data-preset="${i}"`)).join('')}</div></div><div class="n40-list">${list.map((f,i)=>`<div class="n40-row"><div class="n40-meta"><b>${esc(f.name)}</b><span>${f.whenHost?'Al abrir '+esc(f.whenHost)+' · ':''}${(f.steps||[]).length} pasos · ${f.enabled===false?'pausado':'activo'}</span></div><div class="n40-actions">${btn('Ejecutar',`data-run="${i}"`)}${btn(f.enabled===false?'Activar':'Pausar',`data-toggle="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No tienes Flows.</div>'}</div>`);r.querySelector('#flow-new').onclick=()=>{const host=String(prompt('Sitio opcional que dispara el Flow','youtube.com')||'').trim().replace(/^www\./,'');const name=String(prompt('Nombre','Mi Flow')||'Mi Flow').trim()||'Mi Flow';const raw=String(prompt('Pasos: pin | note:Texto | island:Texto | open:https://... | feature:route','pin')||'pin').trim();const steps=raw.split('|').map(s=>s.trim()).filter(Boolean).map(s=>{const i=s.indexOf(':');return {type:i<0?s:s.slice(0,i),value:i<0?'':s.slice(i+1)}});list.unshift({id:'f'+now(),name,whenHost:host,steps,enabled:true,createdAt:now()});save();N.PG.flows40(r)};r.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const p=flowPresets[+b.dataset.preset];if(!p)return;list.unshift({id:'f'+now(),name:p[0],whenHost:'',steps:typeof structuredClone==='function'?structuredClone(p[1]):JSON.parse(JSON.stringify(p[1])),enabled:true,createdAt:now()});save();N.PG.flows40(r)});r.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>runFlow(list[+b.dataset.run]));r.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const f=list[+b.dataset.toggle];if(f)f.enabled=f.enabled===false;save();N.PG.flows40(r)});r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.flows40(r)});};

  N.PG.extensions40=r=>{const list=st.extensions;r.innerHTML=page('EXTENSIONS','Extensions 2.0','Atajos personales que apuntan a rutas reales de Nova.',`<div class="n40-card"><div class="n40-actions">${btn('＋ Crear extensión','id="ext-new"','on')}</div></div><div class="n40-list">${list.map((x,i)=>`<div class="n40-row"><div class="n40-meta"><b>🧩 ${esc(x.name)}</b><span>${esc(x.route)}</span></div><div class="n40-actions">${btn('Abrir',`data-open="${i}"`)}${btn('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="n40-empty">No hay extensiones locales.</div>'}</div>`);r.querySelector('#ext-new').onclick=()=>{const name=String(prompt('Nombre','Mi comando')||'Mi comando').trim();const route=String(prompt('Ruta Nova','novaUltimate')||'novaUltimate').trim();if(!name||!internalRoute(route))return toast40('Nombre o ruta no válidos');list.unshift({id:'e'+now(),name,route:internalRoute(route),createdAt:now()});save();N.PG.extensions40(r)};r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(list[+b.dataset.open]?.route));r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{list.splice(+b.dataset.del,1);save();N.PG.extensions40(r)});};

  // ---------- Web utilities ----------
  N.PG.visual40=r=>{r.innerHTML=page('WEB POWER','Visual Search','Busca la selección, el título o la URL actual con una sola acción.',`<div class="n40-card"><div class="n40-actions">${btn('🔎 Selección','id="vis-sel"','on')}${btn('🔎 Título/URL','id="vis-page"')}${btn('📸 Captura','id="vis-shot"')}</div></div>`);r.querySelector('#vis-sel').onclick=async()=>{const c=current();const t=await inject(c.t,`window.getSelection?.().toString()||''`);const q=String(t||'').trim()||c.title;if(!q)return toast40('No hay nada que buscar');newTab('https://www.google.com/search?q='+encodeURIComponent(q))};r.querySelector('#vis-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');newTab('https://www.google.com/search?q='+encodeURIComponent(c.title||c.url))};r.querySelector('#vis-shot').onclick=()=>open('snapshots');};
  N.PG.translate40=r=>{r.innerHTML=page('WEB POWER','Magic Translate','Traduce selección o página sin cambiar la original.',`<div class="n40-card"><div class="row"><label>Idioma <input class="fld" id="tr-lang" value="es" style="max-width:110px"></label><div class="n40-actions">${btn('🌍 Selección','id="tr-sel"','on')}${btn('🌍 Página','id="tr-page"')}</div></div></div>`);r.querySelector('#tr-sel').onclick=async()=>{const t=await inject(current().t,`window.getSelection?.().toString()||''`);if(!t)return toast40('Selecciona texto');const tl=String(r.querySelector('#tr-lang').value||'es').trim()||'es';newTab('https://translate.google.com/?sl=auto&tl='+encodeURIComponent(tl)+'&text='+encodeURIComponent(String(t)))};r.querySelector('#tr-page').onclick=()=>{const c=current();if(!c.url)return toast40('Abre una web');const tl=String(r.querySelector('#tr-lang').value||'es').trim()||'es';newTab('https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(tl)+'&u='+encodeURIComponent(c.url))};};

  // ---------- Ecosystem ----------
  N.PG.companion40=r=>{const c=current();r.innerHTML=page('ECOSYSTEM','Nova Companion','Prepara una página para enviarla al móvil usando el QR de Nova.',`<div class="n40-card"><h3>${esc(c.title||'Sin página')}</h3><div class="mut">${esc(c.url||'Abre una web para generar el QR.')}</div><div class="n40-actions">${btn('📱 Crear QR','id="cmp-qr"','on')}${btn('📌 Guardar primero','id="cmp-save"')}</div></div>`);r.querySelector('#cmp-qr').onclick=()=>{if(!c.url)return toast40('Abre una web');try{N.openFeature?.('qr');setTimeout(()=>{try{const input=document.querySelector('#nx-qr-url,#qr-url,input[type="url"]');if(input){input.value=c.url;input.dispatchEvent(new Event('input',{bubbles:true}));}}catch{}},120)}catch{toast40('QR no disponible')}};r.querySelector('#cmp-save').onclick=()=>saveCurrentPage();};
  N.PG.sync40=r=>{r.innerHTML=page('ECOSYSTEM','Nova Sync','Exporta/importa tu espacio y, si tienes cuenta, sincronízalo.',`<div class="n40-card"><div class="n40-actions">${btn('☁️ Cuenta','id="sync-account"','on')}${btn('⬇ Exportar','id="sync-export"')}${btn('⬆ Importar','id="sync-import"')}</div><div class="n40-code" id="sync-status">Última sincronización: ${st.syncAt?new Date(st.syncAt).toLocaleString('es'):'nunca'}.</div></div>`);r.querySelector('#sync-export').onclick=async()=>{const payload={nova40:st,nova31:S.nova31||{},novaNext:S.novaNext||{}};const f=await ipc.invoke('save-text',{name:'Nova-Sync-Package',ext:'json',content:JSON.stringify(payload,null,2)}).catch(()=>null);r.querySelector('#sync-status').textContent=f?'Exportado a Descargas.':'No se pudo exportar.'};r.querySelector('#sync-import').onclick=()=>{const raw=String(prompt('Pega el JSON exportado por Nova','')||'');if(!raw)return;try{const data=JSON.parse(raw);if(data.nova40&&typeof data.nova40==='object')S.nova40=Object.assign(S.nova40,data.nova40);if(data.nova31&&typeof data.nova31==='object')S.nova31=Object.assign(S.nova31||{},data.nova31);save();r.querySelector('#sync-status').textContent='Importación completada.';toast40('Importado');}catch{toast40('JSON no válido')}};r.querySelector('#sync-account').onclick=async()=>{const s=await ipc.invoke('account-status').catch(()=>null);if(!s?.loggedIn)return toast40('Inicia sesión en Nova para sincronizar');const data={nova40:st,nova31:S.nova31||{},novaNext:S.novaNext||{}};const out=await ipc.invoke('account-sync',data).catch(()=>null);if(out?.ok){st.syncAt=now();save();r.querySelector('#sync-status').textContent='Cuenta sincronizada.';toast40('Sync completado')}else toast40(out?.error||'No se pudo sincronizar')};};
  N.PG.desktop40=r=>{r.innerHTML=page('WORKSPACE','Desktop Mode','Un panel compacto para saltar entre herramientas sin perder contexto.',`<div class="n40-grid">${[['🧠','Brain','pagebrain'],['💬','Talk','talkpage'],['🗃️','Vault','vault40'],['🕒','Timeline','timeline40'],['⚡','Flows','flows40'],['🎨','Studio','studio40'],['⌕','Launcher','novaLauncher']].map((x,i)=>card(x[0],x[1],'Abrir herramienta',btn('Abrir',`data-open="${i}"`))).join('')}</div>`);const m=[['pagebrain'],['talkpage'],['vault40'],['timeline40'],['flows40'],['studio40'],['novaLauncher']];r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(m[+b.dataset.open]?.[0]));};

  // ---------- Flow trigger / site profiles ----------
  const bound=new WeakSet(); const bindTab=t=>{if(!t?.wv?.addEventListener||bound.has(t))return;t._nova40Bound=true;bound.add(t);const refresh=()=>{setTimeout(()=>applySiteFor(t),80);const url=(()=>{try{return http(t.wv.getURL?.()||'')}catch{return ''}})();const host=hostOf(url);if(host){for(const f of st.flows.filter(x=>x.enabled!==false&&(!x.whenHost||x.whenHost===host)))setTimeout(()=>runFlow(f),180);}};t.wv.addEventListener('did-navigate',refresh);t.wv.addEventListener('did-navigate-in-page',()=>applySiteFor(t));};
  try{(tabs||[]).forEach(bindTab);}catch{}

  // ---------- Public API / discoverability ----------
  N.openFeature40=open; N.launcher40=launcher; N.quickActions40=quickActions; N.dock40=showDock; N.popOut40=()=>{const c=current();if(!c.url)return toast40('Abre una web');try{ipc.invoke('launch-web-app',{name:c.title||c.host||'Nova Pop-out',url:c.url}).then(x=>toast40(x?.ok?'Ventana abierta':'No se pudo abrir')).catch(()=>toast40('No se pudo abrir'));}catch{toast40('Pop-out no disponible')}};
  window.Nova40={open,launcher,quickActions,dock:showDock,brain:()=>open('pagebrain'),vault:()=>open('vault40'),research:()=>open('research40'),pin:pinCurrent};
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  if(!N.extraActs.some(a=>a[0]==='Nova 4.0 · Ultimate'))N.extraActs.push(['Nova 4.0 · Ultimate',()=>open('novaUltimate')]);

  N.resolveFeatureRoute=x=>{const p=internalRoute(x);return p || (oldResolve?oldResolve(x):String(x||''));};
  N.PG.novaLauncher=r=>{r.innerHTML=page('LAUNCHER','Nova Launcher','Una sola caja para encontrar funciones, pestañas, historial o URLs.',`<div class="n40-card"><input class="fld" id="launcher-input" placeholder="Escribe lo que buscas…"><div class="n40-actions">${btn('Abrir launcher completo','id="launcher-open"','on')}${btn('⚡ Acciones rápidas','id="launcher-quick"')}</div></div>`);r.querySelector('#launcher-open').onclick=()=>launcher();r.querySelector('#launcher-quick').onclick=quickActions;r.querySelector('#launcher-input').onkeydown=e=>{if(e.key==='Enter')launcher(e.target.value)};};

  document.addEventListener('keydown',e=>{
    const mod=e.ctrlKey||e.metaKey; const tag=document.activeElement?.tagName?.toLowerCase(); const typing=['input','textarea','select'].includes(tag);
    if(mod&&e.code==='Space'&&!typing){e.preventDefault();launcher();}
    if(mod&&e.shiftKey&&e.key.toLowerCase()==='u'&&!typing){e.preventDefault();open('novaUltimate');}
    if(mod&&e.shiftKey&&e.key.toLowerCase()==='a'&&!typing){e.preventDefault();quickActions();}
  });

  save();
})();
