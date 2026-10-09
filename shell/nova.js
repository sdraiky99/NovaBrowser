const { ipcRenderer: ipc } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { CATALOG } = require('./extensions.js');
const { resolveNavigation } = require('./navigation.js');

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const APP_VERSION = ipc.sendSync('app-version') || '5.5.0';
let mainPrefs = ipc.sendSync('prefs-get') || {};
const DEFAULT_STATE = {
  appearance: 'system', accent: '#3f6df6', search: 'https://www.google.com/search?q=',
  sidebarOpen: false, adblock: true, animations: true, energy: false,
  bookmarks: [], history: [], downloads: [], workspaces: [], currentWorkspace: '',
  firstRun: true, showTourOnStart: true
};
let state = loadState();
let tabs = [], activeTab = null, internalView = null, closedTabs = [], omniboxTimer = null;

function loadState() {
  let raw={}; try { raw=JSON.parse(localStorage.getItem('nova-state')||'{}'); } catch {}
  const ap=['system','light','dark'].includes(raw.appearance)?raw.appearance:(raw.theme==='dark'?'dark':raw.theme==='light'?'light':'system');
  const accent=/^#[0-9a-f]{6}$/i.test(raw.accent)?raw.accent:'#3f6df6';
  const search=['https://www.google.com/search?q=','https://duckduckgo.com/?q=','https://www.bing.com/search?q=','https://search.brave.com/search?q='].includes(raw.search)?raw.search:DEFAULT_STATE.search;
  const bookmarks=Array.isArray(raw.bookmarks)?raw.bookmarks.filter(x=>x&&typeof x.url==='string'&&/^https?:/i.test(x.url)).slice(0,100).map(x=>({url:x.url,title:String(x.title||x.url).slice(0,200)})):[];
  const history=Array.isArray(raw.history)?raw.history.filter(x=>x&&typeof x.url==='string'&&/^https?:/i.test(x.url)).slice(0,300).map(x=>({url:x.url,title:String(x.title||x.url).slice(0,200),ts:Number(x.ts)||Date.now()})):[];
  const workspaces=Array.isArray(raw.workspaces)?raw.workspaces.filter(x=>x&&typeof x.name==='string'&&Array.isArray(x.tabs)).slice(0,20).map(x=>({name:x.name.slice(0,40),tabs:x.tabs.filter(u=>typeof u==='string'&&(/^https?:/i.test(u)||isNewTabUrl(u))).slice(0,50)})):[];
  return {...DEFAULT_STATE, appearance:ap, accent, search, bookmarks, history, workspaces, sidebarOpen:!!raw.sidebarOpen, adblock:raw.adblock!==false, animations:raw.animations!==false, energy:!!raw.energy, firstRun:raw.firstRun!==false, showTourOnStart:raw.showTourOnStart!==false};
}
function saveState() {
  try { localStorage.setItem('nova-state', JSON.stringify(state)); } catch {}
}
function applyAppearance() {
  const ap = state.appearance;
  const dark = ap === 'dark' || (ap === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.classList.toggle('dark', dark);
  document.documentElement.style.setProperty('--accent', state.accent || '#3f6df6');
  document.documentElement.style.setProperty('--accent-soft', `color-mix(in srgb, ${state.accent || '#3f6df6'} 12%, transparent)`);
  document.body.classList.toggle('no-anim', !state.animations);
  document.body.classList.toggle('sidebar-open', !!state.sidebarOpen);
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyAppearance);

function toast(text) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = text;
  $('#toastStack').appendChild(d); setTimeout(() => d.remove(), 2700);
}
function showDrawer(title, html) {
  const d = $('#drawer');
  d.innerHTML = `<div class="drawer-head"><strong>${esc(title)}</strong><button class="icon-btn" id="drawerClose">×</button></div><div class="drawer-body">${html}</div>`;
  d.classList.add('drawer-open'); d.setAttribute('aria-hidden','false');
  $('#drawerClose').onclick = hideDrawer;
}
function hideDrawer() { $('#drawer').classList.remove('drawer-open'); $('#drawer').setAttribute('aria-hidden','true'); }
function safeUrl(raw) { try { const u = new URL(raw); return ['http:','https:','file:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
function newTabUrl() {
  const file = pathToFileURL(path.join(__dirname, 'newtab.html'));
  const qp = new URLSearchParams({ state: JSON.stringify({ appearance:state.appearance, accent:state.accent, search:state.search, bookmarks:state.bookmarks.slice(0,20) }) });
  return `${file.href}?${qp.toString()}`;
}
function isNewTabUrl(url) { return typeof url === 'string' && url.split(/[?#]/, 1)[0] === pathToFileURL(path.join(__dirname, 'newtab.html')).href; }

function iconSvg(name) {
  const p = {
    back:'M19 12H5m7 7-7-7 7-7', forward:'M5 12h14m-7-7 7 7-7 7', reload:'M20 11a8 8 0 1 0 2 5m0-5v5h-5',
    star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 18.9 6.4 22.2l1.1-6.2L3 9.6l6.2-.9L12 3z', menu:'M5 7h14M5 12h14M5 17h14',
    close:'M6 6l12 12M18 6 6 18', search:'M21 21l-4.4-4.4M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4',
    home:'M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9.5 21v-6h5v6', download:'M12 3v11m0 0 4-4m-4 4-4-4M4 17v4h16v-4',
    history:'M3 12a9 9 0 1 0 3-6.7M3 4v5h5', extensions:'M9 3h6v3a3 3 0 1 1 3 3h3v6h-3a3 3 0 1 1-3 3v3H9v-3a3 3 0 1 1-3-3H3V9h3a3 3 0 1 1 3-3V3',
    settings:'M12 15.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z M19.4 15a7.8 7.8 0 0 0 .1-3 7.8 7.8 0 0 0-2.2-3.8l1-1.8-2.6-1.5-1.1 1.6a8 8 0 0 0-3-.9L11.3 3H8.4l-.3 2.1a8 8 0 0 0-3 .9L4 4.4 1.4 5.9l1 1.8A7.8 7.8 0 0 0 .2 11.5l-2 .2v3l2 .2a7.8 7.8 0 0 0 2.2 3.8l-1 1.8L4 22l1.1-1.6a8 8 0 0 0 3 .9l.3 2.1h2.9l.3-2.1a8 8 0 0 0 3-.9l1.1 1.6 2.6-1.5-1-1.8a7.8 7.8 0 0 0 2.2-3.8l2-.2v-3l-2-.2z',
    grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', bolt:'M13 2 4 13h6l-1 9 9-11h-6l1-9z', help:'M12 18h.01M9.1 9a3 3 0 1 1 5.8 1c-.6 1-1.9 1.3-2.4 2.2-.3.5-.5 1-.5 1.8M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p[name] || p.help}"/></svg>`;
}
const SIDEBAR_ICONS=['home','star','grid','download','extensions','bolt','settings'];document.querySelectorAll('[data-icon]').forEach(e=>{e.innerHTML=iconSvg(e.dataset.icon)});
function mkButton(cls, label, title, extra='') { return `<button class="${cls}" title="${esc(title || label)}" ${extra}>${label}</button>`; }

function renderTab(t) {
  t.el.innerHTML = `<img class="tab-fav" src="../assets/brand/nova-icon.png" alt=""><span class="tab-title">${esc(t.title || 'Nueva pestaña')}</span><button class="icon-btn tab-close" title="Cerrar">${iconSvg('close')}</button>`;
  const close = t.el.querySelector('.tab-close'); close.onclick = e => { e.stopPropagation(); closeTab(t); };
  t.el.onclick = () => selectTab(t);
  t.el.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); showTabMenu(t); };
  refreshTabIcon(t);
  t.el.classList.toggle('active', t === activeTab);
}
function refreshTabIcon(t) {
  const img = t?.el?.querySelector('.tab-fav'); if (!img) return;
  let u = ''; try { u = t.wv.getURL(); } catch { }
  const fallback = '../assets/brand/nova-icon.png';
  const setFallback = () => { if (img.isConnected) img.src = fallback; };
  if (isNewTabUrl(u) || !/^https?:/i.test(u)) { setFallback(); return; }
  let originIcon = fallback;
  try { originIcon = new URL(u).origin + '/favicon.ico'; } catch { setFallback(); return; }
  img.onerror = () => { img.onerror = null; setFallback(); };
  img.src = originIcon;
  // Prioriza el favicon declarado por la página frente a /favicon.ico.
  try {
    Promise.resolve(t.wv.executeJavaScript("(() => { const links = [...document.querySelectorAll('link[rel]')]; const icon = links.find(link => /icon/i.test(link.rel)); return icon ? icon.href : ''; })()"))
      .then(raw => {
        if (!img.isConnected || typeof raw !== 'string' || !raw) return;
        const iconUrl = new URL(raw, u);
        if (['http:', 'https:', 'data:'].includes(iconUrl.protocol)) { img.onerror = () => { img.onerror = null; img.src = originIcon; }; img.src = iconUrl.href; }
      }).catch(() => {});
  } catch { }
}
function createTab(url) {
  const t = { id: crypto.randomUUID?.() || String(Date.now()+Math.random()), title:'Nueva pestaña', wv:null, el:null };
  t.el = document.createElement('div'); t.el.className='tab';
  t.wv = document.createElement('webview'); t.wv.className='browser-view'; t.wv.setAttribute('partition','persist:web'); t.wv.setAttribute('allowpopups','false');
  t.wv.setAttribute('webpreferences','contextIsolation=false, nodeIntegration=true, sandbox=false');
  $('#views').appendChild(t.wv); $('#tabs').appendChild(t.el);
  t.wv.addEventListener('did-start-loading', ()=>t.el.classList.add('loading'));
  t.wv.addEventListener('did-stop-loading', ()=>t.el.classList.remove('loading'));
  t.wv.addEventListener('did-navigate', () => syncTabFromWeb(t));
  t.wv.addEventListener('did-navigate-in-page', () => syncTabFromWeb(t));
  t.wv.addEventListener('ipc-message', event => {
    if (event.channel !== 'nova-newtab-action' || !isNewTabUrl(t.wv.getURL())) return;
    const action = event.args?.[0];
    if (!action || typeof action !== 'object') return;
    if (action.type === 'navigate' && typeof action.value === 'string' && action.value.length <= 2048) {
      selectTab(t); navigate(action.value);
    } else if (action.type === 'open-tour') { selectTab(t); showTour(); }
    else if (action.type === 'open-command') { selectTab(t); showCommand(); }
  });
  t.wv.addEventListener('page-title-updated', e=>{t.title=e.title||'Nueva pestaña';renderTab(t);if(t===activeTab)document.title=t.title});
  t.wv.addEventListener('did-finish-load', ()=>{refreshTabIcon(t);applyBuiltinsToTab(t)});
  t.wv.addEventListener('did-fail-load', e=>{if(e.errorCode!==-3)toast('No se pudo cargar la página')});
  t.wv.addEventListener('render-process-gone', ()=>toast('Una pestaña dejó de responder; Nova la recuperará al recargarla.'));
  const target = safeUrl(url || newTabUrl()) || newTabUrl(); t.wv.src=target; tabs.push(t); renderTab(t); selectTab(t); return t;
}
function newTab(url) { return createTab(url || undefined); }
function selectTab(t) { if(!t) return; activeTab=t; tabs.forEach(x=>{x.el.classList.toggle('active',x===t);x.wv.classList.toggle('active',x===t)}); internalView=null; hideDrawer(); syncAddress(); document.title=t.title||'Nova'; }
function closeTab(t, remember=true) { const idx=tabs.indexOf(t); if(idx<0)return; const was=t===activeTab; if(remember && /^https?:/i.test(t.wv.getURL())) closedTabs.unshift({url:t.wv.getURL(),title:t.title||t.wv.getURL()}); closedTabs=closedTabs.slice(0,10); try{t.wv.remove()}catch{} t.el.remove(); tabs.splice(idx,1); if(!tabs.length){newTab();return;} if(was)selectTab(tabs[Math.min(idx,tabs.length-1)]); }
function syncTabFromWeb(t) {
  if (!t || !tabs.includes(t)) return;
  let u = ''; try { u = t.wv.getURL(); } catch { return; }
  if (t === activeTab) { syncAddress(); refreshTabIcon(t); document.title = t.title || 'Nova'; }
  if (/^https?:/i.test(u)) {
    state.history = [{ url: u, title: t.title || u, ts: Date.now() }, ...state.history.filter(x => x.url !== u)].slice(0, 300);
    saveState();
  }
}
function syncAddress() { if(!activeTab)return; const u=activeTab.wv.getURL(); $('#address').value=isNewTabUrl(u)?'':u; $('#secureMark').className=/^https:/i.test(u)?'secure':(/^http:/i.test(u)?'insecure':''); $('#secureMark').textContent=/^https:/i.test(u)?'●':(/^http:/i.test(u)?'!':'○'); $('#star').innerHTML=iconSvg('star'); $('#star').style.color=isBookmarked(u)?'var(--accent)':''; }
function navigate(v) {
  if (!activeTab) return;
  const target = resolveNavigation(v, state.search);
  if (!target) return;
  try { Promise.resolve(activeTab.wv.loadURL(target)).catch(() => toast('No se pudo abrir la dirección')); }
  catch { toast('No se pudo abrir la dirección'); }
}
function isBookmarked(u){return !!u && state.bookmarks.some(b=>b.url===u)}
function toggleBookmark(){if(!activeTab)return;const u=activeTab.wv.getURL();if(!/^https?:/i.test(u)){toast('Abre una página web para guardarla');return;}const i=state.bookmarks.findIndex(b=>b.url===u);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.unshift({url:u,title:activeTab.title||u});state.bookmarks=state.bookmarks.slice(0,100);saveState();syncAddress();toast(i>=0?'Favorito eliminado':'Añadido a favoritos');refreshAllNewTabs();}
function refreshAllNewTabs(){tabs.filter(t=>isNewTabUrl(t.wv.getURL())).forEach(t=>{const u=newTabUrl();try{t.wv.loadURL(u)}catch{}})}
function applyBuiltinsToTab(t){const enabled=mainPrefs.ext||{};for(const x of CATALOG){if(enabled[x.id]){try{t.wv.executeJavaScript(require('./extensions.js').on(x.id))}catch{}}}}

function duplicateTab(t){ if(!t)return; const u=t.wv.getURL(); if(u)newTab(u); }
function reopenClosedTab(){ const last=closedTabs.shift(); if(!last){toast('No hay pestañas cerradas para reabrir');return;} newTab(last.url); }
function showTabMenu(t){
  const items=[['Duplicar pestaña',()=>duplicateTab(t)],['Silenciar pestaña',()=>{try{t.wv.setAudioMuted(!t.wv.isAudioMuted());toast(t.wv.isAudioMuted()?'Pestaña silenciada':'Sonido activado')}catch{toast('Esta pestaña no permite controlar el audio')}}],['Fijar pestaña',()=>{t.pinned=!t.pinned; t.el.classList.toggle('pinned',!!t.pinned);toast(t.pinned?'Pestaña fijada':'Pestaña liberada')}],['Cerrar pestaña',()=>closeTab(t)],['Cerrar las demás',()=>tabs.slice().filter(x=>x!==t).forEach(x=>closeTab(x))]];
  showDrawer('Pestaña',items.map((x,i)=>`<button class="menu-item" data-tabmenu="${i}"><span>${esc(x[0])}</span><span class="muted">›</span></button>`).join(''));
  document.querySelectorAll('[data-tabmenu]').forEach(b=>b.onclick=()=>{const a=items[+b.dataset.tabmenu];hideDrawer();a&&a[1]()});
}
function renderOmniboxSuggestions(query){
  const box=$('#addressSuggestions'); if(!box)return; const q=String(query||'').trim().toLowerCase();
  if(!q){box.classList.remove('show');box.setAttribute('aria-hidden','true');return;}
  const list=[];
  tabs.forEach(t=>{const text=(t.title+' '+t.wv.getURL()).toLowerCase();if(text.includes(q))list.push({kind:'Pestaña',title:t.title||'Pestaña',url:t.wv.getURL(),run:()=>selectTab(t)})});
  state.bookmarks.forEach(b=>{if((b.title+' '+b.url).toLowerCase().includes(q))list.push({kind:'Favorito',title:b.title||b.url,url:b.url,run:()=>navigate(b.url)})});
  state.history.forEach(h=>{if((h.title+' '+h.url).toLowerCase().includes(q))list.push({kind:'Historial',title:h.title||h.url,url:h.url,run:()=>navigate(h.url)})});
  const out=list.slice(0,8); box.innerHTML=out.length?out.map((x,i)=>`<button class="suggestion" data-suggest="${i}"><span class="suggest-kind">${esc(x.kind)}</span><span class="suggest-main"><strong>${esc(x.title)}</strong><small>${esc(x.url)}</small></span></button>`).join(''):`<div class="suggest-empty">Buscar en la web al pulsar Enter</div>`;
  box.classList.add('show');box.setAttribute('aria-hidden','false');box.querySelectorAll('[data-suggest]').forEach(b=>b.onclick=()=>{out[+b.dataset.suggest].run();hideOmniboxSuggestions();});
}
function hideOmniboxSuggestions(){const b=$('#addressSuggestions');if(b){b.classList.remove('show');b.setAttribute('aria-hidden','true')}}

function setInternal(view) {
  internalView=view;
  document.querySelectorAll('.side-item').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  const root=$('#browserArea');
  const old=root.querySelector('.panel'); if(old)old.remove();
  const p=document.createElement('section'); p.className='panel'; p.id='internalPanel'; root.appendChild(p); renderInternal(p,view);
}
function backToBrowser(){internalView=null;const p=$('#internalPanel');p?.remove();document.querySelectorAll('.side-item').forEach(b=>b.classList.toggle('active',b.dataset.view==='home'));if(activeTab)selectTab(activeTab)}

function panelHeader(title, lead){return `<h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p>`}
function renderInternal(r, view){
  if(view==='home'){backToBrowser(); return;}
  if(view==='favorites'){r.innerHTML=panelHeader('Favoritos','Tus páginas guardadas, con el favicon real del sitio cuando está disponible.')+`<div class="section-card">${state.bookmarks.length?state.bookmarks.map((b,i)=>{let host='';try{host=new URL(b.url).hostname.replace(/^www\./,'')}catch{}return `<div class="bookmark-item"><img class="ext-icon" src="${esc(getFavicon(b.url))}" onerror="this.src='../assets/brand/nova-icon.png'" alt=""><div class="stack"><strong>${esc(b.title||host||b.url)}</strong><small class="truncate">${esc(host||b.url)}</small></div><button class="btn" data-open="${i}">Abrir</button><button class="btn danger" data-del="${i}">Eliminar</button></div>`}).join(''):'<div class="empty">Todavía no tienes favoritos. Usa la estrella de la barra para guardar una página.</div>'}</div>`;
    r.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>navigate(state.bookmarks[+b.dataset.open]?.url));
    r.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{state.bookmarks.splice(+b.dataset.del,1);saveState();renderInternal(r,view);refreshAllNewTabs()});
    return;
  }
  if(view==='workspaces'){renderWorkspaces(r);return;}
  if(view==='history'){const groups={};state.history.forEach(x=>{const d=new Date(x.ts||Date.now()).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});(groups[d]??=[]).push(x)});r.innerHTML=panelHeader('Historial','Tus páginas recientes, organizadas por día y con búsqueda rápida.')+`<div class="section-card"><div class="row"><input class="field" id="historySearch" placeholder="Buscar en historial…"><button class="btn" id="clearHistory">Limpiar</button></div></div><div id="historyList"></div>`;const list=r.querySelector('#historyList');const paint=q=>{q=String(q||'').toLowerCase();const rows=Object.entries(groups).map(([d,items])=>`<div class="section-card"><h2>${esc(d)}</h2>${items.filter(x=>!q||String(x.title+' '+x.url).toLowerCase().includes(q)).map(x=>`<div class="bookmark-item"><img class="ext-icon" src="${esc(getFavicon(x.url))}" onerror="this.src='../assets/brand/nova-icon.png'" alt=""><div class="stack"><strong>${esc(x.title||x.url)}</strong><small class="truncate">${esc(x.url)}</small></div><button class="btn" data-hu="${esc(x.url)}">Abrir</button></div>`).join('')}</div>`).join('');list.innerHTML=rows||'<div class="empty">No hay resultados.</div>';list.querySelectorAll('[data-hu]').forEach(b=>b.onclick=()=>navigate(b.dataset.hu))};paint('');r.querySelector('#historySearch').oninput=e=>paint(e.target.value);r.querySelector('#clearHistory').onclick=()=>{if(!state.history.length){toast('El historial ya está vacío');return;}state.history=[];saveState();renderInternal(r,view);toast('Historial limpiado')};return;}
  if(view==='downloads'){r.innerHTML=panelHeader('Descargas','Archivos de la sesión y acceso a la carpeta de descargas.')+`<div class="section-card"><div class="row"><div><strong>Carpeta de descargas</strong><div class="sub">Abre la carpeta configurada por el sistema.</div></div><button class="btn primary" id="openDownloads">Abrir carpeta</button></div></div><div class="section-card">${state.downloads.length?state.downloads.map((x,i)=>`<div class="download-item"><div class="ext-icon">↓</div><div class="stack"><strong>${esc(x.name)}</strong><small class="truncate">${esc(x.path||x.state)}</small></div>${x.path?`<button class="btn" data-showdl="${i}">Mostrar</button>`:''}</div>`).join(''):'<div class="empty">Todavía no hay descargas en esta sesión.</div>'}</div>`;r.querySelector('#openDownloads').onclick=()=>ipc.invoke('open-downloads-folder').then(ok=>toast(ok?'Carpeta abierta':'No se pudo abrir la carpeta'));r.querySelectorAll('[data-showdl]').forEach(b=>b.onclick=()=>ipc.invoke('show-in-folder',state.downloads[+b.dataset.showdl]?.path||'').then(ok=>toast(ok?'Archivo mostrado':'No se pudo localizar el archivo')));return;}
  if(view==='extensions'){renderExtensions(r);return;}
  if(view==='performance'){renderPerformance(r);return;}
  if(view==='settings'){renderSettings(r);return;}
}
function getFavicon(u){try{return new URL(u).origin+'/favicon.ico'}catch{return '../assets/brand/nova-icon.png'}}

function renderWorkspaces(r){
  r.innerHTML=panelHeader('Workspaces','Separa tus sesiones por proyecto. Solo se guardan los espacios que tú crees.')+`<div class="section-card"><div class="row"><div><strong>Crear workspace</strong><div class="sub">Guarda las pestañas abiertas con un nombre propio.</div></div><button class="btn primary" id="createWs">Nuevo workspace</button></div></div><div class="section-card">${state.workspaces.length?state.workspaces.map((w,i)=>`<div class="workspace-card"><div class="ext-icon">▦</div><div class="stack"><strong>${esc(w.name)}</strong><small>${w.tabs.length} pestañas guardadas</small></div><button class="btn primary" data-openws="${i}">Abrir</button><button class="btn danger" data-delws="${i}">Eliminar</button></div>`).join(''):'<div class="empty">Crea tu primer workspace. Nova no crea espacios de ejemplo automáticamente.</div>'}</div>`;
  r.querySelector('#createWs').onclick=()=>{const name=prompt('Nombre del workspace','Trabajo');if(!name?.trim())return;const w={name:name.trim().slice(0,40),tabs:tabs.map(t=>t.wv.getURL()).filter(u=>/^https?:/i.test(u)||isNewTabUrl(u))};state.workspaces.push(w);saveState();renderWorkspaces(r);toast('Workspace guardado')};
  r.querySelectorAll('[data-openws]').forEach(b=>b.onclick=()=>{const w=state.workspaces[+b.dataset.openws];if(!w)return;tabs.slice().forEach(closeTab);w.tabs.filter(Boolean).forEach(u=>newTab(u));toast(`Workspace ${w.name} abierto`) });
  r.querySelectorAll('[data-delws]').forEach(b=>b.onclick=()=>{state.workspaces.splice(+b.dataset.delws,1);saveState();renderWorkspaces(r)});
}

const STORE=[
  ['uBlock Origin Lite','Bloqueo de contenido y rastreadores','Privacidad','https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh','https://ublockorigin.com/favicon.ico'],
  ['Bitwarden','Gestor de contraseñas y credenciales','Seguridad','https://chromewebstore.google.com/detail/bitwarden-password-manager/nngceckbapebfimnlniiiahkandclblb','https://bitwarden.com/favicon.ico'],
  ['Dark Reader','Modo oscuro para páginas web','Apariencia','https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh','https://darkreader.org/images/favicon-32x32.png'],
  ['SponsorBlock','Saltar segmentos patrocinados en vídeos','Vídeo','https://chromewebstore.google.com/detail/sponsorblock/cfhdojbkjhnklbpkdaibdccddilifddb','https://sponsor.ajay.app/favicon.ico'],
  ['React Developer Tools','Inspección y depuración de React','Desarrollo','https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi','https://react.dev/favicon.ico']
];
function renderExtensions(r){
  const extPrefs=mainPrefs.ext||{};
  const catHtml=CATALOG.map(x=>`<div class="section-card extension-card"><div class="ext-icon">◈</div><div class="ext-main"><strong>${esc(x.name)}</strong><div class="sub">${esc(x.cat)} · ${esc(x.desc)}</div></div><button class="toggle ${extPrefs[x.id]?'on':''}" data-toggle-ext="${esc(x.id)}" aria-label="Activar extensión"></button></div>`).join('');
  r.innerHTML=panelHeader('Extensiones','Un único centro para extensiones integradas, extensiones Chromium cargadas y enlaces a la tienda oficial.')+
    `<div class="section-card"><div class="row"><div><strong>Extension Center</strong><div class="sub">Extensiones externas verificables en Chrome Web Store. Nova abre la ficha oficial; la instalación queda bajo tu control.</div></div></div><div class="grid">${STORE.map((x,i)=>`<div class="section-card extension-card"><img class="ext-icon" src="${esc(x[4]||'../assets/brand/nova-icon.png')}" onerror="this.onerror=null;this.src='../assets/brand/nova-icon.png'" alt=""><div class="ext-main"><strong>${esc(x[0])}</strong><div class="sub">${esc(x[2])}</div><p class="sub">${esc(x[1])}</p></div><button class="btn primary" data-store="${i}">Abrir tienda</button></div>`).join('')}</div></div>`+
    `<div class="section-card"><div class="row"><div><strong>Manager de extensiones reales</strong><div class="sub">Carga una carpeta con manifest.json y recupérala automáticamente al reiniciar.</div></div><button class="btn primary" id="loadRealExt">Cargar carpeta</button></div><div id="realExtList" class="section-card"><div class="empty">Consultando…</div></div></div>`+
    `<h2>Extensiones integradas de Nova</h2>${catHtml}`;
  r.querySelectorAll('[data-store]').forEach(b=>b.onclick=()=>ipc.invoke('open-external',STORE[+b.dataset.store][3]).then(ok=>{if(!ok)toast('No se pudo abrir la tienda oficial')}).catch(()=>toast('No se pudo abrir la tienda oficial')));
  r.querySelectorAll('[data-toggle-ext]').forEach(b=>b.onclick=()=>{const id=b.dataset.toggleExt;const nx=Object.assign({},mainPrefs.ext||{});nx[id]=!nx[id];ipc.send('prefs-set',{ext:nx});mainPrefs=ipc.sendSync('prefs-get')||mainPrefs;renderExtensions(r)});
  r.querySelector('#loadRealExt').onclick=()=>ipc.invoke('extension-pick-load',{partition:'persist:web'}).then(d=>{toast(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar'));paintRealExt()});
  const listBox=r.querySelector('#realExtList');
  async function paintRealExt(){const d=await ipc.invoke('extensions-list',{partition:'persist:web'}).catch(()=>({items:[]}));const items=d?.items||[];listBox.innerHTML=items.length?items.map((x,i)=>`<div class="row"><div class="stack"><strong>${esc(x.name||'Extensión')}</strong><small class="truncate">${esc(x.version||'')} · ${esc(x.path||'')}</small></div><button class="btn danger" data-real-del="${i}">Quitar</button></div>`).join(''):'<div class="empty">No hay extensiones Chromium desempaquetadas.</div>';listBox.querySelectorAll('[data-real-del]').forEach(b=>b.onclick=async()=>{const x=items[+b.dataset.realDel];if(!x)return;await ipc.invoke('extension-unload',{partition:'persist:web',id:x.id});paintRealExt()})}
  paintRealExt();
}

async function renderPerformance(r){
  r.innerHTML=panelHeader('Rendimiento','Mide la sesión actual y controla el modo Eco sin ocultar datos.')+`<div class="grid"><div class="section-card"><strong id="ram">—</strong><div class="sub">RAM de Nova</div></div><div class="section-card"><strong id="tabsCount">—</strong><div class="sub">Pestañas web</div></div><div class="section-card"><strong id="cpu">—</strong><div class="sub">CPU del proceso principal</div></div><div class="section-card"><strong id="free">—</strong><div class="sub">Memoria disponible</div></div></div><div class="section-card"><div class="row"><div><strong>Ahorro de energía</strong><div class="sub">Mantiene el throttling de fondo y reduce animaciones de recursos cuando se activa.</div></div><button class="toggle ${state.energy?'on':''}" id="eco"></button></div><div class="row"><div><strong>Limpiar caché</strong><div class="sub">Limpia la caché web persistente de Nova.</div></div><button class="btn" id="clearCache">Limpiar</button></div></div><div class="section-card"><h2>Pestañas</h2><div id="tabMetrics"></div></div>`;
  async function paint(){const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d?.ok){$('#ram').textContent='—';return;}const mb=x=>Number(x)?Math.round(Number(x)/1024)+' MB':'—';$('#ram').textContent=mb(d.main.rssKB);$('#tabsCount').textContent=String(d.tabs.length);$('#cpu').textContent=(Number(d.main.cpuPercent)||0).toFixed(1)+' %';$('#free').textContent=mb(d.system.availableKB||d.system.freeKB);$('#tabMetrics').innerHTML=d.tabs.map(x=>`<div class="row"><div class="stack"><strong class="truncate">${esc(x.title||x.url||'Pestaña')}</strong><small class="truncate">${esc(x.url||'')}</small></div><span class="muted">${mb(x.workingSetKB)} · CPU ${(Number(x.cpuPercent)||0).toFixed(1)}%</span></div>`).join('')||'<div class="empty">No hay datos de pestañas.</div>'}
  r.querySelector('#eco').onclick=async()=>{const next=!state.energy;const ok=await ipc.invoke('performance-mode',next);if(ok){state.energy=next;saveState();toast(next?'Ahorro activado':'Ahorro desactivado')}else toast('No se pudo cambiar el modo');renderPerformance(r)};
  r.querySelector('#clearCache').onclick=async()=>toast((await ipc.invoke('performance-cache'))?'Caché limpiada':'No se pudo limpiar la caché');paint();
}

function renderSettings(r){
  const colors=['#1a73e8','#6f55df','#188038','#d56d12','#c5221f'];
  r.innerHTML=panelHeader('Ajustes de Nova','Configuración organizada por funciones activas, sin opciones heredadas.')+
  `<div class="section-card"><h2>Apariencia</h2><div class="row"><div><strong>Modo</strong><div class="sub">Claro, oscuro o seguir el sistema operativo.</div></div><select id="appearance"><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></div><div class="row"><div><strong>Color de acento</strong><div class="sub">Cambia detalles interactivos sin crear temas completos.</div></div><div class="swatch-row">${colors.map(c=>`<button class="swatch ${state.accent===c?'active':''}" data-accent="${c}" style="background:${c}" aria-label="Acento ${c}"></button>`).join('')}</div></div></div>`+
  `<div class="section-card"><h2>Navegación</h2><div class="row"><div><strong>Buscador</strong><div class="sub">Proveedor usado al buscar desde la barra de dirección.</div></div><select id="search"><option value="https://www.google.com/search?q=">Google</option><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select></div><div class="row"><div><strong>Sidebar expandida</strong><div class="sub">Muestra texto junto a los iconos.</div></div><button class="toggle ${state.sidebarOpen?'on':''}" id="sideToggle"></button></div><div class="row"><div><strong>Animaciones</strong><div class="sub">Desactívalas para reducir movimiento.</div></div><button class="toggle ${state.animations?'on':''}" id="animToggle"></button></div></div>`+
  `<div class="section-card"><h2>Pestañas y sesión</h2><div class="row"><div><strong>Reabrir pestaña cerrada</strong><div class="sub">Conserva hasta 10 pestañas cerradas durante la sesión.</div></div><button class="btn" id="reopenTab">Reabrir</button></div><div class="row"><div><strong>Guía de inicio al arrancar</strong><div class="sub">Muestra la guía automáticamente en el próximo arranque.</div></div><button class="toggle ${state.showTourOnStart?'on':''}" id="tourStartup"></button></div></div>`+
  `<div class="section-card"><h2>Privacidad y seguridad</h2><div class="row"><div><strong>Bloqueador integrado</strong><div class="sub">Controla el bloqueador de anuncios y rastreadores.</div></div><button class="toggle ${(mainPrefs.adblock!==false)?'on':''}" id="adblockToggle"></button></div><div class="row"><div><strong>Navegador predeterminado</strong><div class="sub">Abre la configuración de aplicaciones predeterminadas de Windows.</div></div><button class="btn" id="defaultBrowser">Configurar</button></div></div>`+
  `<div class="section-card"><h2>Ayuda</h2><div class="row"><div><strong>Guía de inicio</strong><div class="sub">Consulta las funciones principales cuando quieras.</div></div><button class="btn" id="tour">Repetir guía</button></div><div class="row"><div><strong>Novedades</strong><div class="sub">Abre la presentación de la versión actual.</div></div><button class="btn" id="news">Ver novedades</button></div><div class="row"><div><strong>Diagnóstico</strong><div class="sub">Comprueba el estado de la sesión y configuración.</div></div><button class="btn" id="diag">Ejecutar</button></div></div>`+
  `<div class="section-card"><h2>Acerca de Nova</h2><div class="row"><div><strong>Nova ${esc(APP_VERSION)}</strong><div class="sub">Chromium ${esc(process.versions.chrome)} · Electron ${esc(process.versions.electron)}</div></div><button class="btn" id="update">Buscar actualizaciones</button></div></div>`;
  $('#appearance').value=state.appearance;$('#search').value=state.search;
  $('#appearance').onchange=e=>{state.appearance=e.target.value;saveState();applyAppearance();refreshAllNewTabs();renderSettings(r)};
  $('#search').onchange=e=>{state.search=e.target.value;saveState();refreshAllNewTabs()};
  r.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>{state.accent=b.dataset.accent;saveState();applyAppearance();refreshAllNewTabs();renderSettings(r)});
  $('#sideToggle').onclick=()=>{state.sidebarOpen=!state.sidebarOpen;saveState();applyAppearance();renderSettings(r)};
  $('#animToggle').onclick=()=>{state.animations=!state.animations;saveState();applyAppearance();renderSettings(r)};
  $('#reopenTab').onclick=reopenClosedTab;
  $('#tourStartup').onclick=()=>{state.showTourOnStart=!state.showTourOnStart;saveState();renderSettings(r);toast(state.showTourOnStart?'La guía aparecerá al iniciar':'La guía automática está desactivada')};
  $('#adblockToggle').onclick=async()=>{const next=mainPrefs.adblock===false;const ok=await ipc.invoke('adblock',next);if(ok){mainPrefs=ipc.sendSync('prefs-get')||mainPrefs;renderSettings(r)}else toast('No se pudo cambiar el bloqueador')};
  $('#defaultBrowser').onclick=()=>ipc.invoke('default-browser',true).then(d=>toast(d?.portable?'No disponible en modo portable':'Abre la configuración de Windows'));
  $('#tour').onclick=()=>showTour();$('#news').onclick=()=>showWhatsNew(true);$('#diag').onclick=async()=>{const d=await ipc.invoke('nova51-diagnostics').catch(()=>null);showDrawer('Diagnóstico',`<pre style="white-space:pre-wrap;font-size:11px">${esc(JSON.stringify(d,null,2))}</pre>`)};
  $('#update').onclick=async()=>{const d=await ipc.invoke('update-check').catch(()=>({ok:false}));showDrawer('Nova Update Center',`<p>${d?.newer?'Hay una versión más reciente disponible.':'Nova está al día o no se pudo comprobar una versión nueva.'}</p><p class="muted">Actual: ${esc(APP_VERSION)}${d?.latest?` · Última: ${esc(d.latest)}`:''}</p><button class="btn primary" id="openReleases">Abrir releases</button>`);$('#openReleases').onclick=()=>ipc.invoke('open-external','https://github.com/sdraiky99/NovaBrowser/releases')};
}

function showTour(){
  const steps=[['../assets/illustrations/onboarding.svg','Navegación','La barra superior reúne navegación, dirección, favoritos y menú sin ocupar el contenido web.'],['../assets/illustrations/renderer.svg','Pestañas','Crea, cambia y cierra pestañas desde una barra compacta. Ctrl+T siempre abre una pestaña nueva.'],['../assets/illustrations/extensions.svg','Extensiones','Gestiona extensiones integradas y abre el centro de extensiones oficiales desde un único lugar.'],['../assets/illustrations/performance.svg','Rendimiento','Controla memoria y ahorro de energía desde Rendimiento.']];let i=0;const modal=document.createElement('div');modal.className='modal on';modal.innerHTML=`<div class="modal-card"><div class="modal-head"><strong>Guía rápida de Nova</strong><button class="icon-btn" id="tourClose">×</button></div><div class="modal-body">${steps.map((s,k)=>`<div class="tour-step ${k===0?'active':''}" data-step="${k}"><img class="tour-img" src="${s[0]}" onerror="this.style.display='none'"><h2>${esc(s[1])}</h2><p class="muted">${esc(s[2])}</p></div>`).join('')}<div class="tour-dots">${steps.map((_,k)=>`<span class="dot ${k===0?'on':''}" data-dot="${k}"></span>`).join('')}</div><div style="display:flex;justify-content:flex-end;gap:8px"><button class="btn" id="tourPrev">Atrás</button><button class="btn primary" id="tourNext">Siguiente</button></div></div></div>`;document.body.appendChild(modal);const close=()=>modal.remove();$('#tourClose').onclick=close;$('#tourPrev').onclick=()=>{i=Math.max(0,i-1);paint()};$('#tourNext').onclick=()=>{if(i<steps.length-1){i++;paint()}else close()};function paint(){modal.querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('active',+x.dataset.step===i));modal.querySelectorAll('[data-dot]').forEach(x=>x.classList.toggle('on',+x.dataset.dot===i));$('#tourPrev').disabled=i===0;$('#tourNext').textContent=i===steps.length-1?'Terminar':'Siguiente'}paint();
}
function showWhatsNew(force=false){
  const key='nova-whatsnew-seen-'+APP_VERSION;
  if(!force && localStorage.getItem(key)==='1')return;
  let i=0;const cards=[['../assets/illustrations/renderer.svg','Nueva pestaña reparada','El buscador, las noticias y las acciones de la página de inicio vuelven a comunicarse con Nova mediante un puente limitado.'],['../assets/illustrations/onboarding.svg','Búsqueda unificada','Direcciones web, dominios con puerto, localhost y búsquedas por texto comparten el mismo resolutor.'],['../assets/illustrations/extensions.svg','Pestañas más fiables','El historial y la barra de direcciones se actualizan desde la pestaña que realmente ha navegado.'],['../assets/illustrations/performance.svg','Interfaz adaptativa','Estilo inspirado en Chrome, tema del sistema actualizado en nueva pestaña y controles de teclado más visibles.']];const m=document.createElement('div');m.className='modal on';m.innerHTML=`<div class="modal-card"><div class="modal-head"><strong>Novedades de Nova ${esc(APP_VERSION)}</strong><button class="icon-btn" id="wnClose">×</button></div><div class="modal-body"><div id="wnCard" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center"></div><div class="tour-dots">${cards.map((_,k)=>`<span class="dot ${k===0?'on':''}" data-dot="${k}"></span>`).join('')}</div><div style="display:flex;justify-content:flex-end"><button class="btn primary" id="wnNext">Siguiente</button></div></div></div>`;document.body.appendChild(m);const keyClose=()=>{localStorage.setItem(key,'1');m.remove()};$('#wnClose').onclick=keyClose;$('#wnNext').onclick=()=>{if(i<cards.length-1){i++;paint()}else keyClose()};function paint(){const c=cards[i];$('#wnCard').innerHTML=`<img class="tour-img" src="${c[0]}" onerror="this.style.display='none'" alt=""><div><h2 style="margin-top:0">${esc(c[1])}</h2><p class="muted">${esc(c[2])}</p></div>`;m.querySelectorAll('[data-dot]').forEach(x=>x.classList.toggle('on',+x.dataset.dot===i));$('#wnNext').textContent=i===cards.length-1?'Terminar':'Siguiente'}paint();
}

function showMenu(){
  const actions=[
    ['Nueva pestaña','Ctrl+T',()=>newTab()],
    ['Favoritos','',()=>setInternal('favorites')],
    ['Descargas','',()=>setInternal('downloads')],
    ['Workspaces','',()=>setInternal('workspaces')],
    ['Extensiones','',()=>setInternal('extensions')],
    ['Rendimiento','',()=>setInternal('performance')],
    ['Ajustes','',()=>setInternal('settings')],
    ['Repetir guía de inicio','',()=>showTour()],
    ['Novedades','',()=>showWhatsNew(true)],
    ['Acerca de Nova','',()=>showAbout()]
  ];
  showDrawer('Menú',actions.map((x,i)=>(i===1||i===6||i===8?'<div class="menu-sep"></div>':'')+`<button class="menu-item" data-menu="${i}"><span>${esc(x[0])}</span><span class="muted">${esc(x[1])}</span></button>`).join(''));
  document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>{hideDrawer();actions[+b.dataset.menu]?.[2]?.()});
}
function showAbout(){showDrawer('Acerca de Nova',`<div style="text-align:center;padding:10px 0 16px"><img src="../assets/brand/nova-icon.png" style="width:76px;height:76px;object-fit:contain"><h2 style="margin:8px 0 2px">Nova</h2><div class="muted">Quantum · ${esc(APP_VERSION)}</div></div><div class="section-card"><div class="row"><span>Chromium</span><strong>${esc(process.versions.chrome)}</strong></div><div class="row"><span>Electron</span><strong>${esc(process.versions.electron)}</strong></div><div class="row"><span>Node</span><strong>${esc(process.versions.node)}</strong></div></div>`)}

$('#newTab').innerHTML='+';$('#newTab').onclick=()=>newTab();
$('#back').innerHTML=iconSvg('back');$('#forward').innerHTML=iconSvg('forward');$('#reload').innerHTML=iconSvg('reload');$('#star').innerHTML=iconSvg('star');$('#menuButton').innerHTML=iconSvg('menu');
$('#accentButton').querySelector('.accent-dot').style.background=state.accent;
$('#back').onclick=()=>activeTab?.wv?.canGoBack()&&activeTab.wv.goBack();$('#forward').onclick=()=>activeTab?.wv?.canGoForward()&&activeTab.wv.goForward();$('#reload').onclick=()=>activeTab?.wv?.reload();$('#star').onclick=toggleBookmark;$('#menuButton').onclick=showMenu;$('#accentButton').onclick=()=>showDrawer('Color de acento',`<div class="swatch-row" style="padding:10px 0">${['#3f6df6','#6f55df','#16a36c','#e07b24','#cf4c4c'].map(c=>`<button class="swatch ${state.accent===c?'active':''}" data-a="${c}" style="background:${c}"></button>`).join('')}</div>`);$('#accentButton').addEventListener('click',()=>setTimeout(()=>document.querySelectorAll('#drawer [data-a]').forEach(b=>b.onclick=()=>{state.accent=b.dataset.a;saveState();applyAppearance();hideDrawer();refreshAllNewTabs()}),0));
document.querySelectorAll('[data-window]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.window;try{ipc.send('win',a)}catch{toast('No se pudo controlar la ventana')}}));
$('#address').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();hideOmniboxSuggestions();navigate(e.target.value)}};$('#address').onfocus=e=>{e.target.select();renderOmniboxSuggestions(e.target.value)};$('#address').oninput=e=>{clearTimeout(omniboxTimer);omniboxTimer=setTimeout(()=>renderOmniboxSuggestions(e.target.value),40)};document.addEventListener('click',e=>{if(!e.target.closest('#addressWrap'))hideOmniboxSuggestions()});
$('.side-item[data-view="home"]').onclick=()=>backToBrowser();document.querySelectorAll('.side-item[data-view]:not([data-view="home"])').forEach(b=>b.onclick=()=>setInternal(b.dataset.view));
window.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='t'){e.preventDefault();reopenClosedTab()}else if(e.ctrlKey&&e.key.toLowerCase()==='t'){e.preventDefault();newTab()}else if(e.ctrlKey&&e.key.toLowerCase()==='w'){e.preventDefault();closeTab(activeTab)}else if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();$('#address').focus()}else if(e.ctrlKey&&e.key.toLowerCase()==='d'){e.preventDefault();toggleBookmark()}else if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();showCommand()}else if(e.key==='Escape'){hideDrawer();document.querySelectorAll('.modal.on').forEach(x=>x.remove())}});
ipc.on('open-tab',(_,url)=>newTab(url)); ipc.on('open-tour',()=>showTour()); ipc.on('open-command',()=>showCommand());ipc.on('blocked',(_,n)=>toast(`${n} solicitudes bloqueadas`));ipc.on('dl',(_,d)=>{state.downloads=[{name:String(d?.name||'archivo'),path:String(d?.path||''),state:String(d?.state||''),ts:Date.now()},...state.downloads].slice(0,100);saveState();toast(d?.state==='done'?`Descarga completada: ${d.name||'archivo'}`:`Descarga: ${d.name||'archivo'}`)});ipc.on('tab-health',(_,d)=>{if(d?.type==='unresponsive')toast('Una pestaña no responde');if(d?.type==='responsive')toast('Pestaña recuperada')});
function showCommand(){showDrawer('Nova Command',`<input class="field" id="cmd" placeholder="Busca pestañas, favoritos, ajustes o acciones…"><div id="cmdResults" style="margin-top:10px"></div>`);const input=$('#cmd');const data=()=>{const q=input.value.trim().toLowerCase();const out=[];tabs.forEach((t,i)=>{if(!q||String(t.title+' '+t.wv.getURL()).toLowerCase().includes(q))out.push(['Pestaña: '+(t.title||'Nueva pestaña'),()=>selectTab(t)]);});state.bookmarks.forEach(b=>{if(!q||String(b.title+' '+b.url).toLowerCase().includes(q))out.push(['Favorito: '+(b.title||b.url),()=>navigate(b.url)])});[['Historial',()=>setInternal('history')],['Ajustes',()=>setInternal('settings')],['Extensiones',()=>setInternal('extensions')],['Rendimiento',()=>setInternal('performance')],['Workspaces',()=>setInternal('workspaces')],['Novedades',()=>showWhatsNew(true)]].forEach(x=>{if(!q||x[0].toLowerCase().includes(q))out.push([x[0],x[1]])});return out.slice(0,12)};function paint(){const box=$('#cmdResults');const arr=data();box.innerHTML=arr.length?arr.map((x,i)=>`<button class="menu-item" data-cmd="${i}">${esc(x[0])}</button>`).join(''):'<div class="empty">Sin resultados.</div>';box.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{arr[+b.dataset.cmd][1]();hideDrawer()})}input.oninput=paint;paint();input.focus();}

applyAppearance();
newTab();
setTimeout(()=>{ if(state.showTourOnStart){ state.showTourOnStart=false; state.firstRun=false; saveState(); showTour(); } else showWhatsNew(false); },900);
