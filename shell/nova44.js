/* Nova 4.4.0 — Professional layer
 * Additive over the stable 4.3.2 shell. No main HTML rewrite.
 */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const $ = s => document.querySelector(s);
  const esc44 = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save44 = () => { try { window.save?.(); N.save?.(); } catch {} };
  const toast44 = msg => { try { toast(String(msg)); } catch { const d=document.createElement('div'); d.textContent=String(msg); d.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;padding:9px 14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(22,25,31,.92);color:#fff;box-shadow:0 14px 48px rgba(0,0,0,.25);backdrop-filter:blur(16px)';document.body.appendChild(d);setTimeout(()=>d.remove(),2200); } };
  const now44 = () => Date.now();
  const route44 = r => { try { return typeof newTab === 'function' ? newTab('nova://' + r) : null; } catch { return null; } };
  const icon44 = path => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  S.nova44 = Object.assign({ version: 1, autoEco: false, ecoThreshold: 30, eco: false, quickWorkspaces: true }, S.nova44 || {});
  S.nova44.ecoThreshold = Math.max(10, Math.min(80, Number(S.nova44.ecoThreshold) || 30));

  if (!document.getElementById('nova44-style')) {
    const st = document.createElement('style'); st.id = 'nova44-style'; st.textContent = `
      body.nova432-glass .nova44-railbtn{display:grid;place-items:center;width:40px;height:40px;border:1px solid transparent;border-radius:12px;background:transparent;color:var(--nova432-fg);cursor:pointer;transition:transform .14s ease,background-color .14s ease,border-color .14s ease,color .14s ease}
      body.nova432-glass .nova44-railbtn svg{width:20px;height:20px}.nova44-railbtn:hover{background:rgba(127,140,165,.10);border-color:var(--nova432-border);transform:translateY(-1px)}
      body.nova432-glass .nova44-railbtn.on{background:rgba(109,149,255,.12);border-color:rgba(109,149,255,.16);color:var(--nova432-accent)}
      body.nova432-glass .nova44-sep{width:28px;height:1px;background:var(--nova432-border);margin:1px 0}.nova44-rail-spacer{height:2px}
      body.nova432-glass .nova44-popup{position:fixed;left:60px;top:74px;z-index:500;width:292px;padding:10px;border:1px solid var(--nova432-border);border-radius:16px;background:rgba(24,27,34,.91);box-shadow:0 24px 80px rgba(0,0,0,.30);backdrop-filter:blur(20px) saturate(125%);-webkit-backdrop-filter:blur(20px) saturate(125%);display:none;animation:nova44-pop .16s ease-out}
      body.nova432-glass.t-light .nova44-popup{background:rgba(255,255,255,.92)}.nova44-popup.on{display:block}
      @keyframes nova44-pop{from{opacity:0;transform:translateY(-4px) scale(.985)}to{opacity:1;transform:none}}
      body.nova432-glass .nova44-popup h3{margin:2px 4px 8px;font-size:13px;letter-spacing:-.01em}.nova44-popup .mut{font-size:11px}
      body.nova432-glass .nova44-ws{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;margin-top:5px;border:1px solid transparent;border-radius:11px;background:transparent;color:var(--nova432-fg);text-align:left;cursor:pointer}
      .nova44-ws:hover{background:rgba(109,149,255,.10);border-color:rgba(109,149,255,.10)}.nova44-ws .dot{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:rgba(109,149,255,.10);flex:none;color:var(--nova432-accent)}
      body.nova432-glass .nova44-popup .nova44-primary{margin-top:8px;width:100%;height:34px;border-radius:10px}
      body.nova432-glass .nova44-page{display:flex;flex-direction:column;gap:12px;max-width:1180px;margin:0 auto;padding-bottom:28px}.nova44-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--nova432-accent);font-weight:800}.nova44-title{font-size:29px;letter-spacing:-.035em;font-weight:730}.nova44-sub{color:var(--nova432-mut);line-height:1.55;max-width:920px}
      body.nova432-glass .nova44-card{padding:15px;border:1px solid var(--nova432-border);border-radius:16px;background:rgba(127,140,165,.045);box-shadow:0 12px 38px rgba(0,0,0,.055)}
      body.nova432-glass .nova44-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.nova44-stat{font-size:25px;font-weight:750;letter-spacing:-.03em}.nova44-label{font-size:11px;color:var(--nova432-mut);margin-top:2px}.nova44-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px;border:1px solid var(--nova432-border);border-radius:13px;background:rgba(127,140,165,.04)}.nova44-row+.nova44-row{margin-top:7px}.nova44-row .meta{min-width:0;display:flex;flex-direction:column;gap:2px}.nova44-row .meta b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nova44-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;border:1px solid var(--nova432-border);background:rgba(127,140,165,.05);font-size:11px;color:var(--nova432-mut)}.nova44-chip.on{color:#5fd58c;border-color:rgba(95,213,140,.22);background:rgba(95,213,140,.08)}
      body.nova432-glass .nova44-meter{height:8px;border-radius:999px;overflow:hidden;background:rgba(127,140,165,.11)}.nova44-meter>i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#6d95ff,#86aaff);width:0;transition:width .2s ease}
      body.nova432-glass .nova44-empty{padding:24px 8px;text-align:center;color:var(--nova432-mut);font-size:12px}.nova44-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
      body.nova432-glass .nova44-ext-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:rgba(109,149,255,.10);color:var(--nova432-accent);flex:none}.nova44-extpath{font-size:10px;color:var(--nova432-mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:440px}
      body.nova432-glass .nova44-mini{font-size:11px;color:var(--nova432-mut)}
      @media(max-width:800px){body.nova432-glass .nova44-popup{left:56px;width:calc(100vw - 66px)}.nova44-title{font-size:25px}}
      @media(prefers-reduced-motion:reduce){body.nova432-glass .nova44-popup,.nova44-meter>i{animation:none;transition:none}}
    `; document.head.appendChild(st);
  }

  /* ---------- Sidebar / Opera-like quick access ---------- */
  const existing = id => document.getElementById(id);
  const side = () => $('#side');
  const ensureRail = () => {
    const s = side(); if (!s) return;
    if (!existing('nova44-workspace-btn')) {
      const b=document.createElement('button'); b.className='nova44-railbtn'; b.id='nova44-workspace-btn'; b.title='Workspaces'; b.setAttribute('aria-label','Workspaces');
      b.innerHTML=icon44('M4 6.5h7l1.7 2H20v9.5H4z M4 6.5V5h6l2 2');
      s.prepend(b);
      b.onclick=e=>{e.stopPropagation();toggleWsPopup();};
    }
    if (!existing('nova44-performance-btn')) {
      const b=document.createElement('button'); b.className='nova44-railbtn'; b.id='nova44-performance-btn'; b.title='Rendimiento'; b.setAttribute('aria-label','Rendimiento');
      b.innerHTML=icon44('M5 12h3l2-6 3 12 2-6h4'); s.appendChild(b); b.onclick=()=>route44('rendimiento44');
    }
    // Put a stable separator before the bottom tools without touching existing handlers.
    if (!existing('nova44-sep')) { const x=document.createElement('div'); x.id='nova44-sep'; x.className='nova44-sep'; s.appendChild(x); }
  };

  let wsPopup = null;
  const workspaceData = () => {
    const a = Array.isArray(S.v200?.workspaces) ? S.v200.workspaces : [];
    const b = Array.isArray(S.nova40?.workspaces) ? S.nova40.workspaces : [];
    const out=[]; const seen=new Set();
    for (const w of [...a,...b]) { if(!w||!w.name) continue; const id=String(w.id||w.name); if(seen.has(id)) continue; seen.add(id); out.push(w); }
    return out.slice(0,12);
  };
  const currentTabs44 = () => (tabs||[]).map(t=>{try{return {url:String(t.wv.getURL?.()||''),title:String(t.el?.querySelector?.('span')?.textContent||'Nueva pestaña')};}catch{return null;}}).filter(x=>x&&/^https?:\/\//i.test(x.url));
  const saveCurrentWorkspace44 = () => {
    const ts=currentTabs44(); if(!ts.length){toast44('No hay pestañas web para guardar');return;}
    S.nova40 ||= {workspaces:[]}; S.nova40.workspaces ||= [];
    const name=String(prompt('Nombre del workspace','Trabajo')||'Trabajo').trim()||'Workspace';
    S.nova40.workspaces.unshift({id:'w44'+now44().toString(36),name,tabs:ts,createdAt:now44(),kind:'workspace44'}); S.nova40.workspaces.splice(16); save44(); refreshWsPopup(); toast44('Workspace guardado');
  };
  const toggleWsPopup = () => {
    if (!wsPopup) {
      wsPopup=document.createElement('div'); wsPopup.className='nova44-popup'; wsPopup.id='nova44-ws-popup'; document.body.appendChild(wsPopup);
      document.addEventListener('click',e=>{if(wsPopup?.classList.contains('on')&&!wsPopup.contains(e.target)&&!e.target.closest('#nova44-workspace-btn'))wsPopup.classList.remove('on')});
    }
    refreshWsPopup(); wsPopup.classList.toggle('on');
  };
  const refreshWsPopup = () => {
    if(!wsPopup)return;
    const list=workspaceData();
    wsPopup.innerHTML=`<h3>Workspaces</h3><div class="mut">Cambia de contexto sin perder tus pestañas actuales.</div>${list.map((w,i)=>`<button class="nova44-ws" data-ws="${i}"><span class="dot">${icon44('M5 7h5l2 2h7v8H5z')}</span><span style="min-width:0;flex:1"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc44(w.name)}</b><span class="nova44-mini">${Array.isArray(w.tabs)?w.tabs.length:0} pestañas guardadas</span></span></button>`).join('')||'<div class="nova44-empty">Todavía no tienes workspaces.</div>'}<button class="btn on nova44-primary" id="nova44-save-ws">Guardar pestañas actuales</button><button class="btn nova44-primary" id="nova44-manage-ws">Administrar workspaces</button>`;
    wsPopup.querySelectorAll('[data-ws]').forEach(b=>b.onclick=()=>{const w=list[+b.dataset.ws];(w?.tabs||[]).forEach(t=>t.url&&newTab(t.url));wsPopup.classList.remove('on');toast44('Workspace abierto');});
    wsPopup.querySelector('#nova44-save-ws').onclick=()=>saveCurrentWorkspace44(); wsPopup.querySelector('#nova44-manage-ws').onclick=()=>{wsPopup.classList.remove('on');route44('workspaces44')};
  };

  /* ---------- Pages ---------- */
  const page44=(k,t,d,b='')=>`<div class="nova44-page"><div class="nova44-kicker">${esc44(k)}</div><div class="nova44-title">${esc44(t)}</div><div class="nova44-sub">${esc44(d)}</div>${b}</div>`;
  const btn44=(label,attr='',cls='')=>`<button class="btn ${cls}" ${attr}>${label}</button>`;

  N.PG.workspaces44 = r => {
    const list=workspaceData();
    r.innerHTML=page44('NOVA 4.4','Workspaces','Contextos guardados con acceso rápido desde la barra lateral.',`<div class="nova44-grid"><div class="nova44-card"><div class="nova44-stat">${list.length}</div><div class="nova44-label">Workspaces guardados</div>${btn44('＋ Guardar pestañas actuales','id="ws44-save"','on')}</div><div class="nova44-card"><div class="nova44-stat">${(tabs||[]).length}</div><div class="nova44-label">Pestañas abiertas</div>${btn44('↻ Actualizar','id="ws44-refresh"')}</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Tus espacios</h3>${list.map((w,i)=>`<div class="nova44-row"><div class="meta"><b>${esc44(w.name)}</b><span class="nova44-mini">${Array.isArray(w.tabs)?w.tabs.length:0} pestañas · ${w.createdAt?new Date(w.createdAt).toLocaleString('es'):''}</span></div><div class="nova44-actions">${btn44('Abrir',`data-open="${i}"`)}${btn44('Borrar',`data-del="${i}"`)}</div></div>`).join('')||'<div class="nova44-empty">Crea tu primer workspace guardando las pestañas actuales.</div>'}</div>`);
    r.querySelector('#ws44-save').onclick=saveCurrentWorkspace44; r.querySelector('#ws44-refresh').onclick=()=>N.PG.workspaces44(r);
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const w=list[+b.dataset.open];(w?.tabs||[]).forEach(t=>t.url&&newTab(t.url));toast44('Workspace abierto');});
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const all=workspaceData(),w=all[+b.dataset.del];if(!w)return;const idx=(S.nova40?.workspaces||[]).indexOf(w);if(idx>=0){S.nova40.workspaces.splice(idx,1);save44();N.PG.workspaces44(r)}else{const idx2=(S.v200?.workspaces||[]).indexOf(w);if(idx2>=0){S.v200.workspaces.splice(idx2,1);save44();N.PG.workspaces44(r)}}});
  };

  N.PG.rendimiento44 = async r => {
    let timer=0;
    r.innerHTML=page44('NOVA 4.4','Rendimiento','RAM, CPU, pestañas y ahorro de energía en un solo panel.',`<div class="nova44-grid"><div class="nova44-card"><div class="nova44-stat" id="pm44">—</div><div class="nova44-label">RAM de Nova</div></div><div class="nova44-card"><div class="nova44-stat" id="pt44">—</div><div class="nova44-label">Pestañas web</div></div><div class="nova44-card"><div class="nova44-stat" id="pc44">—</div><div class="nova44-label">CPU del proceso principal</div></div><div class="nova44-card"><div class="nova44-stat" id="pf44">—</div><div class="nova44-label">Memoria disponible</div></div></div><div class="nova44-card"><div class="nova44-actions">${btn44('⚡ Ahorro de energía','id="eco44"')}${btn44('♻ Limpiar caché','id="cache44"')}${btn44('↻ Actualizar','id="refresh44"','on')}</div><div id="status44" class="nova44-mini" style="margin-top:8px">Consultando…</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Pestañas</h3><div id="ptab44"></div></div>`);
    const paint=async()=>{const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d?.ok){r.querySelector('#status44').textContent='Telemetría no disponible';return;}const mb=x=>Number(x)?(Number(x)/1024).toFixed(0)+' MB':'—';const cpu=x=>Number.isFinite(Number(x))?Number(x).toFixed(1)+' %':'—';r.querySelector('#pm44').textContent=mb(d.main.rssKB);r.querySelector('#pt44').textContent=String(d.tabs.length);r.querySelector('#pc44').textContent=cpu(d.main.cpuPercent);r.querySelector('#pf44').textContent=mb(d.system.availableKB||d.system.freeKB);r.querySelector('#status44').innerHTML=`${S.nova44.eco?'<span class="nova44-chip on">Ahorro activo</span>':'<span class="nova44-chip">Ahorro desactivado</span>'} <span class="nova44-chip">Actualizado ${new Date(d.generatedAt).toLocaleTimeString('es')}</span>`;r.querySelector('#ptab44').innerHTML=d.tabs.map(t=>`<div class="nova44-row"><div class="meta"><b>${esc44(t.title||t.url||'Pestaña')}</b><span class="nova44-mini">${esc44(t.url||'')}</span></div><span class="nova44-chip">${mb(t.workingSetKB)} · CPU ${cpu(t.cpuPercent)}</span></div>`).join('')||'<div class="nova44-empty">No hay pestañas web medibles.</div>';r.querySelector('#eco44').textContent=S.nova44.eco?'⚡ Desactivar ahorro':'⚡ Activar ahorro';};
    r.querySelector('#refresh44').onclick=paint; r.querySelector('#cache44').onclick=async()=>{const ok=await ipc.invoke('performance-cache').catch(()=>false);toast44(ok?'Caché limpiada':'No se pudo limpiar la caché');if(ok)paint()}; r.querySelector('#eco44').onclick=async()=>{const next=!S.nova44.eco;const ok=await ipc.invoke('performance-mode',next).catch(()=>false);if(ok){S.nova44.eco=next;if(S.nova432)S.nova432.eco=next;save44();paint();toast44(next?'Ahorro de energía activado':'Ahorro de energía desactivado')}};
    if (r.__nova44PerfTimer) clearInterval(r.__nova44PerfTimer); await paint(); r.__nova44PerfTimer=setInterval(()=>{ if(document.visibilityState==='visible') paint().catch(()=>{}); },5000);
  };

  N.PG.extensiones44 = async r => {
    const partition=typeof N.profilePartition==='function'?N.profilePartition():'persist:web';
    r.innerHTML=page44('NOVA 4.4','Extensiones reales','Carga extensiones Chromium desempaquetadas en el perfil activo y consérvalas entre arranques.',`<div class="nova44-card"><div class="nova44-actions">${btn44('＋ Cargar extensión desde carpeta','id="ext44-load"','on')}${btn44('↻ Actualizar','id="ext44-refresh"')}</div><div class="nova44-mini" style="margin-top:8px">Se espera una carpeta que contenga manifest.json. No se descarga ni ejecuta código desde la tienda automáticamente.</div></div><div class="nova44-card"><h3 style="margin:0 0 8px">Extensiones cargadas</h3><div id="ext44-list"><div class="nova44-empty">Consultando…</div></div></div>`);
    const paint=async()=>{const d=await ipc.invoke('extensions-list',{partition}).catch(()=>({ok:false,items:[]}));const list=Array.isArray(d?.items)?d.items:[];r.querySelector('#ext44-list').innerHTML=list.map((x,i)=>`<div class="nova44-row"><div class="meta" style="display:flex;flex-direction:row;align-items:center;gap:9px"><span class="nova44-ext-icon">${icon44('M5 8h14v11H5z M8 8V6a4 4 0 0 1 8 0v2')}</span><span class="meta"><b>${esc44(x.name||'Extensión')}</b><span class="nova44-extpath">${esc44(x.path||'')}</span></span></div><div class="nova44-actions">${btn44('Quitar',`data-ext-del="${i}"`)}</div></div>`).join('')||'<div class="nova44-empty">No hay extensiones reales cargadas en este perfil.</div>';r.querySelectorAll('[data-ext-del]').forEach(b=>b.onclick=async()=>{const x=list[+b.dataset.extDel];if(!x)return;const ok=await ipc.invoke('extension-unload',{partition,id:x.id}).catch(()=>false);toast44(ok?'Extensión retirada':'No se pudo retirar');paint();});};
    r.querySelector('#ext44-load').onclick=async()=>{const d=await ipc.invoke('extension-pick-load',{partition}).catch(()=>({ok:false,error:'No disponible'}));toast44(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar la extensión'));paint();};r.querySelector('#ext44-refresh').onclick=paint; await paint();
  };

  /* ---------- Settings: automatic battery saving ---------- */
  const wrapSettings=()=>{
    if(!N.PG?.ajustes||N.PG.ajustes.__nova44Wrapped)return;
    const base=N.PG.ajustes; const fn=r=>{base(r);if(r.querySelector('#nova44-settings'))return;const card=document.createElement('div');card.id='nova44-settings';card.className='nova44-card';card.style.marginTop='12px';card.innerHTML=`<div class="row"><div><b>Ahorro inteligente</b><div class="mut">Activa automáticamente el modo de rendimiento cuando el dispositivo está con batería baja.</div></div><div class="sw ${S.nova44.autoEco?'on':''}" id="eco44-auto"></div></div><div class="row" style="margin-top:8px"><span>Umbral de batería</span><select class="fld" id="eco44-th" style="width:110px"><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option></select></div><div class="mut" style="margin-top:8px">Nova mantiene el throttling normal de las pestañas; solo reduce trabajo de fondo cuando el modo está activo.</div>`;r.appendChild(card);const swc=card.querySelector('#eco44-auto'),th=card.querySelector('#eco44-th');th.value=String(S.nova44.ecoThreshold);swc.onclick=()=>{S.nova44.autoEco=!S.nova44.autoEco;save44();swc.classList.toggle('on',S.nova44.autoEco);runBatteryCheck44(true)};th.onchange=e=>{S.nova44.ecoThreshold=Math.max(10,Math.min(80,+e.target.value||30));save44();runBatteryCheck44(true)};};fn.__nova44Wrapped=true;N.PG.ajustes=fn;
  };

  let battery44=null;
  const syncEco44=async on=>{try{const ok=await ipc.invoke('performance-mode',!!on);if(!ok)return false;S.nova44.eco=!!on;if(S.nova432)S.nova432.eco=!!on;save44();try{document.getElementById('nova44-performance-btn')?.classList.toggle('on',!!on)}catch{}return true;}catch{return false}};
  const runBatteryCheck44=async manual=>{if(!S.nova44.autoEco||!battery44)return;const low=!battery44.charging && battery44.level*100<=S.nova44.ecoThreshold;if(low!==S.nova44.eco){const ok=await syncEco44(low);if(ok&&manual)toast44(low?'Ahorro automático activado':'Ahorro automático desactivado')}};
  const initBattery44=async()=>{try{if(!navigator.getBattery)return;battery44=await navigator.getBattery();['chargingchange','levelchange'].forEach(ev=>battery44.addEventListener(ev,()=>runBatteryCheck44(false)));runBatteryCheck44(false);}catch{}}

  /* ---------- Route aliases ---------- */
  const oldResolve44=N.resolveFeatureRoute;
  N.resolveFeatureRoute=x=>{
    const raw=String(x||'').replace(/^nova:\/\//,'').toLowerCase();
    const map={workspaces44:'workspaces44',workspacespro:'workspaces44','workspaces-profesional':'workspaces44',rendimiento44:'rendimiento44',taskmanager:'rendimiento44','gestor-rendimiento':'rendimiento44',extensiones44:'extensiones44','real-extensions':'extensiones44'};
    return map[raw] || (oldResolve44?oldResolve44(x):String(x||''));
  };
  N.extraActs=Array.isArray(N.extraActs)?N.extraActs:[];
  const addAct44=(name,fn)=>{if(!N.extraActs.some(a=>a[0]===name))N.extraActs.push([name,fn]);};
  addAct44('Workspaces',()=>route44('workspaces44')); addAct44('Rendimiento',()=>route44('rendimiento44')); addAct44('Extensiones reales',()=>route44('extensiones44'));
  // 4.4 elimina los accesos de usuario a los temas heredados; la apariencia queda en Glass Clean.
  try { if (typeof MENU !== 'undefined' && Array.isArray(MENU)) { for (let i=MENU.length-1;i>=0;i--) if (/^Tema:/i.test(String(MENU[i]?.[0]||''))) MENU.splice(i,1); } } catch {}
  if (Array.isArray(N.MENU)) N.MENU = N.MENU.filter(a => !/^Tema:/i.test(String(a?.[0]||'')));
  if (Array.isArray(N.extraActs)) N.extraActs = N.extraActs.filter(a => !/^Tema:/i.test(String(a?.[0]||'')));
  document.querySelectorAll('#mnp button').forEach(b => { if (/^Tema:/i.test(String(b.textContent||''))) b.remove(); });
  N.nova44={workspaces:()=>route44('workspaces44'),performance:()=>route44('rendimiento44'),extensions:()=>route44('extensiones44')};

  ensureRail(); wrapSettings(); initBattery44();
  setTimeout(()=>{try{refreshWsPopup();}catch{}},250);
  window.addEventListener('beforeunload',()=>{try{wsPopup?.remove()}catch{}});
})();
