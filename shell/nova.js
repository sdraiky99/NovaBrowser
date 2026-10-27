const { ipcRenderer: ipc } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { CATALOG } = require('./extensions.js');
const { resolveNavigation } = require('./navigation.js');

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ACCENT_COLORS = ['#3f6df6', '#6f55df', '#188038', '#d56d12', '#c5221f'];
const APP_VERSION = ipc.sendSync('app-version') || '6.3.0';
let mainPrefs = ipc.sendSync('prefs-get') || {};
const DEFAULT_STATE = {
  appearance: 'system', accent: '#3f6df6', search: 'https://www.google.com/search?q=',
  sidebarOpen: false, sidebarVisible: true, adblock: true, animations: true, energy: false,
  bookmarks: [], history: [], downloads: [], workspaces: [], currentWorkspace: '',
  firstRun: true, showTourOnStart: true, toolbarWallpaper: '', showNews: true, restoreSession: true, sessionTabs: [], sessionActiveUrl: ''
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
  const toolbarWallpaper = typeof raw.toolbarWallpaper === 'string' ? raw.toolbarWallpaper : '';
  const sessionTabs = Array.isArray(raw.sessionTabs) ? raw.sessionTabs.slice(-50).map(x => { const url = typeof x === 'string' ? x : String(x?.url || ''); return /^https?:\/\//i.test(url) ? { url, group: String(typeof x === 'object' && x ? x.group || '' : '').slice(0, 32) } : null; }).filter(Boolean) : [];
  const sessionActiveUrl = typeof raw.sessionActiveUrl === 'string' && /^https?:\/\//i.test(raw.sessionActiveUrl) ? raw.sessionActiveUrl : '';
  const downloads = Array.isArray(raw.downloads) ? raw.downloads.slice(0, 100).filter(x => x && typeof x === 'object').map(x => ({ id: null, name: String(x.name || 'archivo').slice(0, 250), path: String(x.path || '').slice(0, 2000), state: ['done','completed'].includes(x.state) ? 'done' : ['cancelled','interrupted','paused','progressing'].includes(x.state) ? (x.state === 'progressing' ? 'interrupted' : x.state) : String(x.state || 'interrupted'), recv: Number(x.recv) || 0, total: Number(x.total) || 0, ts: Number(x.ts) || Date.now() })) : [];
  return {...DEFAULT_STATE, appearance:ap, accent, search, bookmarks, history, workspaces, downloads, toolbarWallpaper, showNews:raw.showNews!==false, restoreSession:raw.restoreSession!==false, sessionTabs, sessionActiveUrl, sidebarOpen:!!raw.sidebarOpen, sidebarVisible:raw.sidebarVisible!==false, adblock:raw.adblock!==false, animations:raw.animations!==false, energy:!!raw.energy, firstRun:raw.firstRun!==false, showTourOnStart:raw.showTourOnStart!==false};
}
function saveState() {
  try { localStorage.setItem('nova-state', JSON.stringify(state)); } catch {}
}
let restoringSession = false;
function persistSession() {
  if (restoringSession) return;
  if (!state.restoreSession) { state.sessionTabs=[]; state.sessionActiveUrl=''; saveState(); return; }
  const urls = tabs.map(t => ({ url: getTabUrl(t), group: String(t.group || '').slice(0, 32) })).filter(x => typeof x.url === 'string' && /^https?:\/\//i.test(x.url));
  state.sessionTabs = urls.slice(-50);
  const activeUrl = activeTab ? getTabUrl(activeTab) : '';
  state.sessionActiveUrl = /^https?:\/\//i.test(activeUrl) ? activeUrl : '';
  saveState();
}
function toolbarWallpaperUrl() {
  try {
    const u = new URL(state.toolbarWallpaper || '');
    if (u.protocol !== 'file:' || !/\/wallpapers\/nova-toolbar-wallpaper\.(?:png|jpe?g|webp)$/i.test(u.pathname) || u.search || u.hash) return '';
    return u.href;
  } catch { return ''; }
}
function applyToolbarWallpaper() {
  const url = toolbarWallpaperUrl();
  document.documentElement.style.setProperty('--toolbar-wallpaper', url ? `url("${url}")` : 'none');
  document.body.classList.toggle('has-toolbar-wallpaper', !!url);
}
function applyAppearance() {
  const ap = state.appearance;
  const dark = ap === 'dark' || (ap === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.classList.toggle('dark', dark);
  const accent = /^#[0-9a-f]{6}$/i.test(state.accent || '') ? state.accent : '#1a73e8';
  document.documentElement.style.setProperty('--user-accent', accent);
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent} 12%, transparent)`);
  document.body.classList.toggle('no-anim', !state.animations);
  document.body.classList.toggle('sidebar-open', !!state.sidebarOpen);
  document.body.classList.toggle('sidebar-hidden', state.sidebarVisible === false);
  const sidebarButton = $('#sidebarToggle');
  if (sidebarButton) { sidebarButton.setAttribute('aria-pressed', String(state.sidebarVisible !== false)); sidebarButton.title = state.sidebarVisible === false ? 'Mostrar panel lateral' : 'Ocultar panel lateral'; }
  applyToolbarWallpaper();
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
function getTabUrl(t) {
  try {
    const current = t?.wv?.getURL?.();
    if (typeof current === 'string' && current && current !== 'about:blank') return current;
  } catch { }
  try { return t?.wv?.getAttribute?.('src') || ''; } catch { return ''; }
}
function loadTabUrl(t, target) {
  if (!t?.wv || !target) return Promise.reject(new Error('Pestaña o destino no disponible'));
  try {
    if (typeof t.wv.loadURL === 'function') return Promise.resolve(t.wv.loadURL(target));
    // Fallback for the short period before Electron exposes guest methods.
    t.wv.setAttribute('src', target);
    return Promise.resolve();
  } catch (error) {
    try { t.wv.setAttribute('src', target); return Promise.resolve(); }
    catch { return Promise.reject(error); }
  }
}
function newTabUrl() {
  const file = pathToFileURL(path.join(__dirname, 'newtab.html'));
  const qp = new URLSearchParams({ state: JSON.stringify({ appearance:state.appearance, accent:state.accent, search:state.search, bookmarks:state.bookmarks.slice(0,20), showNews:state.showNews }) });
  return `${file.href}?${qp.toString()}`;
}
function isNewTabUrl(url) { return typeof url === 'string' && url.split(/[?#]/, 1)[0] === pathToFileURL(path.join(__dirname, 'newtab.html')).href; }

function iconSvg(name) {
  const allowed = new Set(['back','forward','reload','star','menu','close','search','home','download','history','extensions','sidebar','settings','grid','bolt','help','plus']);
  const key = allowed.has(name) ? name : 'help';
  return `<img class="nova-icon" src="../assets/icons/${key}.svg" alt="" aria-hidden="true">`;
}
const SIDEBAR_ICONS=['home','star','grid','download','extensions','bolt','settings'];document.querySelectorAll('[data-icon]').forEach(e=>{e.innerHTML=iconSvg(e.dataset.icon)});
function mkButton(cls, label, title, extra='') { return `<button class="${cls}" title="${esc(title || label)}" ${extra}>${label}</button>`; }

function renderTab(t) {
  t.el.innerHTML = `<img class="tab-fav" src="../assets/brand/nova-icon.png" alt=""><span class="tab-title">${esc(t.title || 'Nueva pestaña')}</span>${t.group ? `<span class="tab-group-badge" title="Grupo: ${esc(t.group)}">${esc(t.group)}</span>` : ''}<button class="icon-btn tab-close" title="Cerrar">${iconSvg('close')}</button>`;
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
function createTab(url, group = '') {
  const target = safeUrl(url || newTabUrl()) || newTabUrl();
  const t = { id: crypto.randomUUID?.() || String(Date.now() + Math.random()), title: 'Nueva pestaña', group: String(group || '').trim().slice(0, 32), wv: null, el: null };
  t.el = document.createElement('div');
  t.el.className = 'tab';
  t.wv = document.createElement('webview');
  t.wv.className = 'browser-view';
  t.wv.setAttribute('partition', 'persist:web');
  t.wv.setAttribute('allowpopups', 'false');
  t.wv.setAttribute('webpreferences', 'contextIsolation=true, nodeIntegration=false, sandbox=true');
  // Electron decides a webview's preload during will-attach-webview. Set src
  // BEFORE appending the element so the trusted new-tab preload is available
  // on its first document, not only after a later reload.
  t.wv.setAttribute('src', target);
  t.wv.addEventListener('did-start-loading', () => t.el.classList.add('loading'));
  t.wv.addEventListener('did-stop-loading', () => t.el.classList.remove('loading'));
  t.wv.addEventListener('did-navigate', () => syncTabFromWeb(t));
  t.wv.addEventListener('did-navigate-in-page', () => syncTabFromWeb(t));
  t.wv.addEventListener('ipc-message', event => {
    if (event.channel !== 'nova-newtab-action' || !isNewTabUrl(getTabUrl(t))) return;
    const action = event.args?.[0];
    if (!action || typeof action !== 'object') return;
    if (action.type === 'navigate' && typeof action.value === 'string' && action.value.trim() && action.value.length <= 2048) {
      selectTab(t);
      navigate(action.value);
    } else if (action.type === 'open-tour') { selectTab(t); showTour(); }
    else if (action.type === 'open-command') { selectTab(t); showCommand(); }
    else if (action.type === 'open-whats-new') { selectTab(t); showWhatsNew(true); }
    else if (action.type === 'open-settings') { selectTab(t); setInternal('settings'); }
    else if (action.type === 'add-shortcut' && action.value && typeof action.value === 'object') {
      const title = String(action.value.title || '').trim().slice(0, 80);
      const target = safeUrl(String(action.value.url || '').trim());
      if (!title || !target || !/^https?:/i.test(target)) { toast('Introduce un nombre y una dirección web válida.'); return; }
      const existing = state.bookmarks.findIndex(item => item.url === target);
      if (existing >= 0) state.bookmarks.splice(existing, 1);
      state.bookmarks.unshift({ title, url: target }); state.bookmarks = state.bookmarks.slice(0, 100);
      saveState(); refreshAllNewTabs(); toast('Acceso rápido guardado en Favoritos.');
    }
  });
  t.wv.addEventListener('page-title-updated', e => {
    t.title = e.title || 'Nueva pestaña';
    renderTab(t);
    if (t === activeTab) document.title = t.title;
  });
  t.wv.addEventListener('did-finish-load', () => { refreshTabIcon(t); applyBuiltinsToTab(t); });
  t.wv.addEventListener('did-fail-load', e => { if (e.errorCode !== -3) toast('No se pudo cargar la página'); });
  t.wv.addEventListener('render-process-gone', () => toast('Una pestaña dejó de responder; recárgala para continuar.'));
  tabs.push(t);
  $('#views').appendChild(t.wv);
  $('#tabs').appendChild(t.el);
  renderTab(t);
  selectTab(t);
  persistSession();
  return t;
}
function newTab(url, group = '') { return createTab(url || undefined, group); }
function selectTab(t) {
  if (!t) return;
  // Volver a la pestaña web elimina la vista interna anterior; dejarla en el DOM
  // provocaba capas obsoletas y hacía que algunos paneles parecieran parpadear.
  $('#internalPanel')?.remove();
  internalView = null;
  activeTab = t;
  tabs.forEach(x => {
    x.el.classList.toggle('active', x === t);
    x.wv.classList.toggle('active', x === t);
  });
  hideDrawer();
  syncAddress();
  document.title = t.title || 'Nova';
  persistSession();
}
function closeTab(t, remember=true) { const idx=tabs.indexOf(t); if(idx<0)return; const was=t===activeTab; const u=getTabUrl(t); if(remember && /^https?:/i.test(u)) closedTabs.unshift({url:u,title:t.title||u}); closedTabs=closedTabs.slice(0,10); try{t.wv.remove()}catch{} t.el.remove(); tabs.splice(idx,1); if(!tabs.length){newTab();return;} if(was)selectTab(tabs[Math.min(idx,tabs.length-1)]); persistSession(); }
function syncTabFromWeb(t) {
  if (!t || !tabs.includes(t)) return;
  let u = ''; try { u = t.wv.getURL(); } catch { return; }
  if (t === activeTab) { syncAddress(); refreshTabIcon(t); document.title = t.title || 'Nova'; }
  if (/^https?:/i.test(u)) {
    persistSession();
    state.history = [{ url: u, title: t.title || u, ts: Date.now() }, ...state.history.filter(x => x.url !== u)].slice(0, 300);
    saveState();
  }
}
function syncAddress() { if(!activeTab)return; const u=getTabUrl(activeTab); $('#address').value=isNewTabUrl(u)?'':u; $('#secureMark').className=/^https:/i.test(u)?'secure':(/^http:/i.test(u)?'insecure':''); $('#secureMark').textContent=/^https:/i.test(u)?'●':(/^http:/i.test(u)?'!':'○'); $('#star').innerHTML=iconSvg('star'); $('#star').style.color=isBookmarked(u)?'var(--accent)':''; }
function navigate(v) {
  const raw = String(v ?? '').trim();
  if (!raw) { toast('Escribe una dirección o una búsqueda.'); return false; }
  if (!activeTab || !tabs.includes(activeTab) || !activeTab.wv) {
    toast('No hay una pestaña activa. Abre una pestaña nueva e inténtalo de nuevo.');
    return false;
  }
  // Volver primero a la vista web; no dejar el panel interno sobre la navegación.
  if (internalView) backToBrowser();
  const target = resolveNavigation(raw, state.search);
  if (!target) { toast('No se pudo interpretar la dirección o búsqueda.'); return false; }
  const targetTab = activeTab;
  try {
    loadTabUrl(targetTab, target).catch(err => {
      console.error('Nova navigation failed:', err?.message || err);
      toast('No se pudo abrir la dirección. Comprueba la conexión e inténtalo otra vez.');
    });
    return true;
  } catch (err) {
    console.error('Nova navigation failed:', err?.message || err);
    toast('No se pudo abrir la dirección. Comprueba la conexión e inténtalo otra vez.');
    return false;
  }
}
function isBookmarked(u){return !!u && state.bookmarks.some(b=>b.url===u)}
function toggleBookmark(){if(!activeTab)return;const u=getTabUrl(activeTab);if(!/^https?:/i.test(u)){toast('Abre una página web para guardarla');return;}const i=state.bookmarks.findIndex(b=>b.url===u);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.unshift({url:u,title:activeTab.title||u});state.bookmarks=state.bookmarks.slice(0,100);saveState();syncAddress();toast(i>=0?'Favorito eliminado':'Añadido a favoritos');refreshAllNewTabs();}
function refreshAllNewTabs(){tabs.filter(t=>isNewTabUrl(getTabUrl(t))).forEach(t=>{const u=newTabUrl();loadTabUrl(t,u).catch(err=>{console.error('No se pudo actualizar la nueva pestaña:',err?.message||err);})})}
function applyBuiltinsToTab(t){const enabled=mainPrefs.ext||{};for(const x of CATALOG){if(enabled[x.id]){try{t.wv.executeJavaScript(require('./extensions.js').on(x.id))}catch{}}}}

function duplicateTab(t){ if(!t)return; const u=getTabUrl(t); if(u)newTab(u, t.group || ''); }
function setTabGroup(t){ if(!t)return; const value=prompt('Nombre del grupo de pestañas (deja vacío para quitarlo)', t.group || 'Trabajo'); if(value===null)return; t.group=String(value).trim().slice(0,32); renderTab(t); persistSession(); toast(t.group?`Pestaña añadida al grupo «${t.group}»`:'Grupo quitado de la pestaña'); }
function reopenClosedTab(){ const last=closedTabs.shift(); if(!last){toast('No hay pestañas cerradas para reabrir');return;} newTab(last.url); }
function showTabMenu(t){
  const items=[['Duplicar pestaña',()=>duplicateTab(t)],['Crear / asignar grupo',()=>setTabGroup(t)],...(t.group?[['Quitar del grupo',()=>{t.group='';renderTab(t);persistSession();toast('Pestaña sin grupo')}]]:[]),['Silenciar pestaña',()=>{try{t.wv.setAudioMuted(!t.wv.isAudioMuted());toast(t.wv.isAudioMuted()?'Pestaña silenciada':'Sonido activado')}catch{toast('Esta pestaña no permite controlar el audio')}}],['Fijar pestaña',()=>{t.pinned=!t.pinned; t.el.classList.toggle('pinned',!!t.pinned);toast(t.pinned?'Pestaña fijada':'Pestaña liberada')}],['Cerrar pestaña',()=>closeTab(t)],['Cerrar las demás',()=>tabs.slice().filter(x=>x!==t).forEach(x=>closeTab(x))]];
  showDrawer('Pestaña',items.map((x,i)=>`<button class="menu-item" data-tabmenu="${i}"><span>${esc(x[0])}</span><span class="muted">›</span></button>`).join(''));
  document.querySelectorAll('[data-tabmenu]').forEach(b=>b.onclick=()=>{const a=items[+b.dataset.tabmenu];hideDrawer();a&&a[1]()});
}
function renderOmniboxSuggestions(query){
  const box=$('#addressSuggestions'); if(!box)return; const q=String(query||'').trim().toLowerCase();
  if(!q){box.classList.remove('show');box.setAttribute('aria-hidden','true');return;}
  const list=[];
  tabs.forEach(t=>{const url=getTabUrl(t);const text=(t.title+' '+url).toLowerCase();if(text.includes(q))list.push({kind:'Pestaña',title:t.title||'Pestaña',url,run:()=>selectTab(t)})});
  state.bookmarks.forEach(b=>{if((b.title+' '+b.url).toLowerCase().includes(q))list.push({kind:'Favorito',title:b.title||b.url,url:b.url,run:()=>navigate(b.url)})});
  state.history.forEach(h=>{if((h.title+' '+h.url).toLowerCase().includes(q))list.push({kind:'Historial',title:h.title||h.url,url:h.url,run:()=>navigate(h.url)})});
  const out=list.slice(0,8); box.innerHTML=out.length?out.map((x,i)=>`<button class="suggestion" data-suggest="${i}"><span class="suggest-kind">${esc(x.kind)}</span><span class="suggest-main"><strong>${esc(x.title)}</strong><small>${esc(x.url)}</small></span></button>`).join(''):`<div class="suggest-empty">Buscar en la web al pulsar Enter</div>`;
  box.classList.add('show');box.setAttribute('aria-hidden','false');box.querySelectorAll('[data-suggest]').forEach(b=>b.onclick=()=>{out[+b.dataset.suggest].run();hideOmniboxSuggestions();});
}
function hideOmniboxSuggestions(){const b=$('#addressSuggestions');if(b){b.classList.remove('show');b.setAttribute('aria-hidden','true')}}

function setInternal(view) {
  internalView = view;
  // Desactiva la capa de contenido web mientras se muestra una sección de Nova.
  // Los webviews son posicionados y se pintaban por encima de los paneles normales.
  tabs.forEach(t => t.wv.classList.remove('active'));
  document.querySelectorAll('.side-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const root = $('#browserArea');
  root.querySelector('#internalPanel')?.remove();
  const p = document.createElement('section');
  p.className = 'panel';
  p.id = 'internalPanel';
  root.appendChild(p);
  renderInternal(p, view);
}
function backToBrowser() {
  internalView = null;
  $('#internalPanel')?.remove();
  document.querySelectorAll('.side-item').forEach(b => b.classList.toggle('active', b.dataset.view === 'home'));
  if (activeTab) selectTab(activeTab);
}

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
  if(view==='downloads'){const bytes=n=>{n=Number(n)||0;if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;if(n<1073741824)return `${(n/1048576).toFixed(1)} MB`;return `${(n/1073741824).toFixed(2)} GB`};r.innerHTML=panelHeader('Descargas','Consulta el progreso, controla las descargas activas y abre los archivos terminados.')+`<div class="section-card"><div class="row"><div><strong>Carpeta de descargas</strong><div class="sub">Destino de las descargas de Nova.</div></div><button class="btn primary" id="openDownloads">Abrir carpeta</button></div></div><div class="section-card">${state.downloads.length?state.downloads.map((x,i)=>{const pct=x.total>0?Math.min(100,Math.round((x.recv||0)/x.total*100)):0;const active=['progressing','paused','interrupted'].includes(x.state);const label=({progressing:'Descargando',paused:'Pausada',interrupted:'Interrumpida',done:'Completada',completed:'Completada',cancelled:'Cancelada'})[x.state]||x.state||'Estado desconocido';return `<div class="download-item detailed-download"><div class="ext-icon">${iconSvg('download')}</div><div class="stack"><strong>${esc(x.name)}</strong><small class="truncate">${esc(x.path||label)}</small><small class="sub">${esc(label)}${x.total?` · ${bytes(x.recv)} / ${bytes(x.total)} (${pct}%)`:x.recv?` · ${bytes(x.recv)}`:''}</small>${x.total&&x.state==='progressing'?`<div class="download-progress"><span style="width:${pct}%"></span></div>`:''}</div><div class="row download-actions">${x.id!==null&&x.state==='progressing'?`<button class="btn" data-dlctl="pause" data-dlid="${esc(x.id)}">Pausar</button>`:''}${x.id!==null&&x.state==='paused'?`<button class="btn" data-dlctl="resume" data-dlid="${esc(x.id)}">Reanudar</button>`:''}${x.id!==null&&active?`<button class="btn danger" data-dlctl="cancel" data-dlid="${esc(x.id)}">Cancelar</button>`:''}${x.path&&['done','completed'].includes(x.state)?`<button class="btn" data-showdl="${i}">Mostrar</button>`:''}</div></div>`}).join(''):'<div class="empty">Todavía no hay descargas registradas. Cuando descargues un archivo, aparecerá aquí.</div>'}</div>`;r.querySelector('#openDownloads').onclick=()=>ipc.invoke('open-downloads-folder').then(ok=>toast(ok?'Carpeta abierta':'No se pudo abrir la carpeta'));r.querySelectorAll('[data-showdl]').forEach(b=>b.onclick=()=>ipc.invoke('show-in-folder',state.downloads[+b.dataset.showdl]?.path||'').then(ok=>toast(ok?'Archivo mostrado':'No se pudo localizar el archivo')));r.querySelectorAll('[data-dlctl]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.dlid);ipc.send('dl-ctl',{id,a:b.dataset.dlctl});});return;}
  if(view==='extensions'){renderExtensions(r);return;}
  if(view==='performance'){renderPerformance(r);return;}
  if(view==='settings'){renderSettings(r);return;}
}
function getFavicon(u){try{return new URL(u).origin+'/favicon.ico'}catch{return '../assets/brand/nova-icon.png'}}

function renderWorkspaces(r){
  r.innerHTML=panelHeader('Workspaces','Separa tus sesiones por proyecto. Solo se guardan los espacios que tú crees.')+`<div class="section-card"><div class="row"><div><strong>Crear workspace</strong><div class="sub">Guarda las pestañas abiertas con un nombre propio.</div></div><button class="btn primary" id="createWs">Nuevo workspace</button></div></div><div class="section-card">${state.workspaces.length?state.workspaces.map((w,i)=>`<div class="workspace-card"><div class="ext-icon">${iconSvg('grid')}</div><div class="stack"><strong>${esc(w.name)}</strong><small>${w.tabs.length} pestañas guardadas</small></div><button class="btn primary" data-openws="${i}">Abrir</button><button class="btn danger" data-delws="${i}">Eliminar</button></div>`).join(''):'<div class="empty">Crea tu primer workspace. Nova no crea espacios de ejemplo automáticamente.</div>'}</div>`;
  r.querySelector('#createWs').onclick=()=>{const name=prompt('Nombre del workspace','Trabajo');if(!name?.trim())return;const w={name:name.trim().slice(0,40),tabs:tabs.map(getTabUrl).filter(u=>/^https?:/i.test(u)||isNewTabUrl(u))};state.workspaces.push(w);saveState();renderWorkspaces(r);toast('Workspace guardado')};
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
  const catHtml=CATALOG.map(x=>`<div class="section-card extension-card"><div class="ext-icon">${iconSvg('extensions')}</div><div class="ext-main"><strong>${esc(x.name)}</strong><div class="sub">${esc(x.cat)} · ${esc(x.desc)}</div></div><button class="toggle ${extPrefs[x.id]?'on':''}" data-toggle-ext="${esc(x.id)}" aria-label="Activar extensión"></button></div>`).join('');
  r.innerHTML=panelHeader('Extensiones','Gestiona extensiones integradas y extensiones Chromium compatibles. La Chrome Web Store no instala extensiones directamente en Nova; usa una carpeta compatible con manifest.json.')+
    `<div class="section-card"><div class="row"><div><strong>Extension Center</strong><div class="sub">Consulta la ficha oficial. La instalación directa desde Chrome Web Store está reservada a Chrome; para Nova, carga una carpeta desempaquetada compatible en el gestor de abajo.</div></div></div><div class="grid">${STORE.map((x,i)=>`<div class="section-card extension-card"><img class="ext-icon" src="${esc(x[4]||'../assets/brand/nova-icon.png')}" onerror="this.onerror=null;this.src='../assets/brand/nova-icon.png'" alt=""><div class="ext-main"><strong>${esc(x[0])}</strong><div class="sub">${esc(x[2])}</div><p class="sub">${esc(x[1])}</p></div><button class="btn primary" data-store="${i}">Ver ficha oficial</button></div>`).join('')}</div></div>`+
    `<div class="section-card"><div class="row"><div><strong>Extensiones Chromium instaladas</strong><div class="sub">Carga una carpeta de extensión con manifest.json. Las extensiones compatibles se recuperan al reiniciar; no todas las extensiones de Chrome son compatibles con Electron.</div></div><button class="btn primary" id="loadRealExt">Cargar carpeta</button></div><div id="realExtList" class="section-card"><div class="empty">Consultando…</div></div></div>`+
    `<h2>Extensiones integradas de Nova</h2>${catHtml}`;
  r.querySelectorAll('[data-store]').forEach(b=>b.onclick=()=>ipc.invoke('open-external',STORE[+b.dataset.store][3]).then(ok=>{
    if(!ok) toast('No se pudo abrir la ficha oficial. Puedes cargar una carpeta compatible desde este panel.');
    else toast('Ficha oficial abierta. Para instalar en Nova, carga una carpeta compatible con manifest.json.');
  }).catch(()=>toast('No se pudo abrir la ficha oficial.')));
  r.querySelectorAll('[data-toggle-ext]').forEach(b=>b.onclick=()=>{const id=b.dataset.toggleExt;const nx=Object.assign({},mainPrefs.ext||{});nx[id]=!nx[id];ipc.send('prefs-set',{ext:nx});mainPrefs=ipc.sendSync('prefs-get')||mainPrefs;renderExtensions(r)});
  r.querySelector('#loadRealExt').onclick=()=>ipc.invoke('extension-pick-load',{partition:'persist:web'}).then(d=>{toast(d?.ok?`Cargada: ${d.name||'extensión'}`:(d?.error||'No se pudo cargar'));return paintRealExt()}).catch(()=>toast('No se pudo abrir el selector de extensiones.'));
  const listBox=r.querySelector('#realExtList');
  async function paintRealExt(){const d=await ipc.invoke('extensions-list',{partition:'persist:web'}).catch(()=>({items:[]}));const items=d?.items||[];listBox.innerHTML=items.length?items.map((x,i)=>`<div class="row real-extension-row"><div class="stack"><strong>${esc(x.name||'Extensión')}</strong><small class="truncate">${esc(x.version||'Sin versión')} · ${esc(x.loaded?'Activa':(x.desiredEnabled?'No se ha podido cargar':'Desactivada'))}</small><small class="truncate">${esc((x.permissions||[]).length?'Permisos: '+x.permissions.join(', '):'Sin permisos declarados')} · ${esc((x.hostPermissions||[]).length?'Sitios: '+x.hostPermissions.join(', '):'Sin permisos de host declarados')}</small></div><button class="toggle ${x.enabled!==false?'on':''}" data-real-toggle="${i}" aria-label="${x.enabled!==false?'Desactivar':'Activar'} ${esc(x.name||'extensión')}" aria-pressed="${x.enabled!==false?'true':'false'}"></button><button class="btn danger" data-real-del="${i}">Quitar</button></div>`).join(''):'<div class="empty">No hay extensiones Chromium instaladas. Selecciona una carpeta desempaquetada que incluya manifest.json.</div>';listBox.querySelectorAll('[data-real-toggle]').forEach(b=>b.onclick=async()=>{const x=items[+b.dataset.realToggle];if(!x)return;b.disabled=true;const result=await ipc.invoke('extension-toggle',{partition:'persist:web',id:x.id,enabled:x.enabled===false}).catch(()=>({ok:false,error:'No se pudo cambiar el estado.'}));if(!result?.ok)toast(result?.error||'No se pudo cambiar el estado de la extensión.');else toast(result.enabled?'Extensión activada':'Extensión desactivada');await paintRealExt()});listBox.querySelectorAll('[data-real-del]').forEach(b=>b.onclick=async()=>{
      const x=items[+b.dataset.realDel]; if(!x)return;
      const ok=await ipc.invoke('extension-unload',{partition:'persist:web',id:x.id}).catch(()=>false);
      if(!ok) toast('No se pudo quitar la extensión.'); else toast('Extensión desinstalada de Nova.');
      await paintRealExt();
    })}
  paintRealExt();
}

async function renderPerformance(r){
  r.innerHTML=panelHeader('Rendimiento','Mide la sesión actual y controla el modo Eco sin ocultar datos.')+`<div class="grid"><div class="section-card"><strong id="ram">—</strong><div class="sub">RAM de Nova</div></div><div class="section-card"><strong id="tabsCount">—</strong><div class="sub">Pestañas web</div></div><div class="section-card"><strong id="cpu">—</strong><div class="sub">CPU del proceso principal</div></div><div class="section-card"><strong id="free">—</strong><div class="sub">Memoria disponible</div></div></div><div class="section-card"><div class="row"><div><strong>Ahorro de energía</strong><div class="sub">Mantiene el throttling de fondo y reduce animaciones de recursos cuando se activa.</div></div><button class="toggle ${state.energy?'on':''}" id="eco"></button></div><div class="row"><div><strong>Limpiar caché</strong><div class="sub">Limpia la caché web persistente de Nova.</div></div><button class="btn" id="clearCache">Limpiar</button></div></div><div class="section-card"><h2>Pestañas</h2><div id="tabMetrics"></div></div>`;
  async function paint(){const d=await ipc.invoke('performance-info').catch(()=>({ok:false}));if(!d?.ok){$('#ram').textContent='—';return;}const mb=x=>Number(x)?Math.round(Number(x)/1024)+' MB':'—';$('#ram').textContent=mb(d.main.rssKB);$('#tabsCount').textContent=String(d.tabs.length);$('#cpu').textContent=(Number(d.main.cpuPercent)||0).toFixed(1)+' %';$('#free').textContent=mb(d.system.availableKB||d.system.freeKB);$('#tabMetrics').innerHTML=d.tabs.map(x=>`<div class="row"><div class="stack"><strong class="truncate">${esc(x.title||x.url||'Pestaña')}</strong><small class="truncate">${esc(x.url||'')}</small></div><span class="muted">${mb(x.workingSetKB)} · CPU ${(Number(x.cpuPercent)||0).toFixed(1)}%</span></div>`).join('')||'<div class="empty">No hay datos de pestañas.</div>'}
  r.querySelector('#eco').onclick=async()=>{const next=!state.energy;const ok=await ipc.invoke('performance-mode',next);if(ok){state.energy=next;saveState();toast(next?'Ahorro activado':'Ahorro desactivado')}else toast('No se pudo cambiar el modo');renderPerformance(r)};
  r.querySelector('#clearCache').onclick=async()=>toast((await ipc.invoke('performance-cache'))?'Caché limpiada':'No se pudo limpiar la caché');paint();
}

function renderSettings(r){
  const colors = ACCENT_COLORS;
  const portableInfo = ipc.sendSync('portable-data-status') || {};
  const dataLocation = portableInfo.path || ipc.sendSync('userdata') || 'Ruta no disponible';
  const dataMode = portableInfo.isPortable ? (portableInfo.active ? 'Modo portable activo' : 'Portable usando el perfil de Windows') : 'Perfil estándar de Windows/desarrollo';
  r.innerHTML=panelHeader('Ajustes de Nova','Configuración organizada por funciones activas, sin opciones heredadas.')+
  `<div class="section-card"><h2>Apariencia</h2><div class="row"><div><strong>Modo</strong><div class="sub">Claro, oscuro o seguir el sistema operativo.</div></div><select id="appearance"><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></div><div class="row"><div><strong>Color de acento</strong><div class="sub">Cambia detalles interactivos sin crear temas completos.</div></div><div class="swatch-row">${colors.map(c=>`<button class="swatch ${state.accent===c?'active':''}" data-accent="${c}" style="background:${c}" aria-label="Acento ${c}"></button>`).join('')}</div></div></div>`+
  `<div class="section-card"><h2>Fondo de la barra superior</h2><p class="sub wallpaper-intro">Elige una imagen local para personalizar la zona de pestañas y navegación. Se guarda en este equipo.</p><div id="wallpaperPreview" class="wallpaper-preview"><span>Vista previa de la barra</span></div><div class="row wallpaper-row"><div><strong>Imagen personalizada</strong><div class="sub">PNG, JPG o WebP · máximo 12 MB.</div></div><div class="wallpaper-actions"><button class="btn primary" id="pickWallpaper">Elegir imagen</button><button class="btn" id="resetWallpaper">Restablecer</button></div></div><div id="wallpaperState" class="sub" aria-live="polite"></div></div>`+
  `<div class="section-card"><h2>Navegación</h2><div class="row"><div><strong>Buscador</strong><div class="sub">Proveedor usado al buscar desde la barra de dirección.</div></div><select id="search"><option value="https://www.google.com/search?q=">Google</option><option value="https://duckduckgo.com/?q=">DuckDuckGo</option><option value="https://www.bing.com/search?q=">Bing</option><option value="https://search.brave.com/search?q=">Brave</option></select></div><div class="row"><div><strong>Mostrar panel lateral</strong><div class="sub">Puedes ocultarlo desde la barra superior cuando no lo necesites.</div></div><button class="toggle ${state.sidebarVisible!==false?'on':''}" id="sideVisibility"></button></div><div class="row"><div><strong>Expandir panel lateral</strong><div class="sub">Muestra texto junto a los iconos.</div></div><button class="toggle ${state.sidebarOpen?'on':''}" id="sideToggle"></button></div><div class="row"><div><strong>Animaciones</strong><div class="sub">Desactívalas para reducir movimiento.</div></div><button class="toggle ${state.animations?'on':''}" id="animToggle"></button></div><div class="row"><div><strong>Noticias en nueva pestaña</strong><div class="sub">Muestra titulares recientes de fuentes externas; puedes ocultarlos cuando quieras.</div></div><button class="toggle ${state.showNews?'on':''}" id="newsToggle" aria-pressed="${state.showNews?'true':'false'}"></button></div></div>`+
  `<div class="section-card"><h2>Pestañas y sesión</h2><div class="row"><div><strong>Restaurar sesión anterior</strong><div class="sub">Guarda localmente hasta 10 direcciones web para recuperarlas al abrir Nova.</div></div><button class="toggle ${state.restoreSession?'on':''}" id="restoreSessionToggle" aria-pressed="${state.restoreSession?'true':'false'}"></button></div><div class="row"><div><strong>Reabrir pestaña cerrada</strong><div class="sub">Conserva hasta 10 pestañas cerradas durante la sesión.</div></div><button class="btn" id="reopenTab">Reabrir</button></div><div class="row"><div><strong>Guía de inicio al arrancar</strong><div class="sub">Muestra la guía automáticamente en el próximo arranque.</div></div><button class="toggle ${state.showTourOnStart?'on':''}" id="tourStartup"></button></div></div>`+
  `<div class="section-card"><h2>Privacidad y seguridad</h2><div class="row"><div><strong>Bloqueador integrado</strong><div class="sub">Controla el bloqueador de anuncios y rastreadores.</div></div><button class="toggle ${(mainPrefs.adblock!==false)?'on':''}" id="adblockToggle"></button></div><div class="row"><div><strong>Navegador predeterminado</strong><div class="sub">Abre la configuración de aplicaciones predeterminadas de Windows.</div></div><button class="btn" id="defaultBrowser">Configurar</button></div></div>`+
  `<div class="section-card"><h2>Permisos por sitio</h2><p class="sub">Gestiona decisiones recordadas para cámara, micrófono, ubicación y notificaciones. «Preguntar» elimina la decisión guardada y vuelve a solicitar permiso cuando proceda.</p><div id="sitePermissionList"><div class="empty">Cargando permisos guardados…</div></div><div class="row"><button class="btn" id="refreshSitePermissions">Actualizar lista</button></div></div>`+
  `<div class="section-card"><h2>Importar datos</h2><p class="sub">Busca perfiles locales de Chrome, Edge y Firefox. Nova puede importar marcadores e historial; no copia contraseñas ni datos cifrados.</p><div class="row"><div><strong>Perfiles detectados</strong><div class="sub">Cierra el navegador de origen si la importación del historial falla.</div></div><button class="btn primary" id="scanImport">Buscar navegadores</button></div><div id="importProfiles" class="import-profiles-list"><div class="empty">Pulsa «Buscar navegadores» para detectar perfiles disponibles.</div></div></div>`+
  `<div class="section-card"><h2>Ayuda</h2><div class="row"><div><strong>Guía de inicio</strong><div class="sub">Consulta las funciones principales cuando quieras.</div></div><button class="btn" id="tour">Repetir guía</button></div><div class="row"><div><strong>Novedades</strong><div class="sub">Abre la presentación de la versión actual.</div></div><button class="btn" id="news">Ver novedades</button></div><div class="row"><div><strong>Diagnóstico</strong><div class="sub">Comprueba el estado de la sesión y configuración.</div></div><button class="btn" id="diag">Ejecutar</button></div></div>`+
  `<div class="section-card"><h2>Datos de Nova</h2><div class="row"><div><strong>${esc(dataMode)}</strong><div class="sub" style="overflow-wrap:anywhere">${esc(dataLocation)}</div>${portableInfo.reason?`<small class="sub">No se pudo activar la carpeta portable: ${esc(portableInfo.reason)}. Los datos siguen en la carpeta de Windows.</small>`:''}</div></div><div class="sub">En modo portable, puedes mover el ejecutable junto a su carpeta User Data. Cierra Nova antes de copiar o actualizar.</div></div>`+
  `<div class="section-card"><h2>Acerca de Nova</h2><div class="row"><div><strong>Nova ${esc(APP_VERSION)}</strong><div class="sub">Chromium ${esc(process.versions.chrome)} · Electron ${esc(process.versions.electron)}</div></div><button class="btn" id="update">Buscar actualizaciones</button></div></div>`;
  // Nova 6: give existing settings a real shared navigation shell without replacing their behavior.
  const settingCards = [...r.querySelectorAll('.section-card')];
  const settingTitle = card => card.querySelector('h2')?.textContent?.trim() || 'Ajustes';
  const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const settingsLayout = document.createElement('div'); settingsLayout.className = 'settings-layout';
  const settingsNav = document.createElement('nav'); settingsNav.className = 'settings-nav'; settingsNav.setAttribute('aria-label','Secciones de ajustes');
  const settingsContent = document.createElement('div'); settingsContent.className = 'settings-content';
  settingCards.forEach((card, index) => {
    const id = 'settings-' + slugify(settingTitle(card)); card.id = id; settingsContent.appendChild(card);
    const link = document.createElement('button'); link.type = 'button'; link.className = 'settings-nav-item' + (index===0?' active':''); link.textContent = settingTitle(card); link.dataset.settingsTarget = id;
    link.onclick = () => { settingsNav.querySelectorAll('.settings-nav-item').forEach(x=>x.classList.toggle('active', x===link)); card.scrollIntoView({behavior: state.animations ? 'smooth' : 'auto', block:'start'}); };
    settingsNav.appendChild(link);
  });
  settingsLayout.append(settingsNav, settingsContent); r.appendChild(settingsLayout);
  $('#appearance').value=state.appearance;$('#search').value=state.search;
  const sitePermBox=r.querySelector('#sitePermissionList');
  const permissionLabels={cam:'Cámara',mic:'Micrófono',geo:'Ubicación',notif:'Notificaciones'};
  const paintSitePermissions=async()=>{
    sitePermBox.innerHTML='<div class="empty">Cargando permisos guardados…</div>';
    try{
      const entries=await ipc.invoke('permission-sites-list');
      if(!Array.isArray(entries)||!entries.length){sitePermBox.innerHTML='<div class="empty">Todavía no hay permisos recordados por sitio. Al elegir «Permitir siempre» o «Bloquear siempre» en una solicitud, aparecerán aquí.</div>';return;}
      sitePermBox.innerHTML=entries.map((entry,i)=>`<div class="site-permission"><div class="site-permission-head"><strong>${esc(entry.host)}</strong><button class="btn danger" data-site-reset="${i}">Borrar sitio</button></div>${Object.entries(entry.permissions||{}).map(([key,value])=>`<div class="row site-permission-row"><span>${esc(permissionLabels[key]||key)}</span><select data-site-host="${esc(entry.host)}" data-site-key="${esc(key)}"><option value="ask">Preguntar</option><option value="allow" ${value==='allow'?'selected':''}>Permitir siempre</option><option value="block" ${value==='block'?'selected':''}>Bloquear siempre</option></select></div>`).join('')}</div>`).join('');
      sitePermBox.querySelectorAll('[data-site-host]').forEach(select=>select.onchange=async()=>{const result=await ipc.invoke('permission-site-set',{host:select.dataset.siteHost,key:select.dataset.siteKey,value:select.value});if(result?.ok){toast('Permiso actualizado');paintSitePermissions()}else toast(result?.error||'No se pudo actualizar el permiso')});
      sitePermBox.querySelectorAll('[data-site-reset]').forEach(button=>button.onclick=async()=>{const entry=entries[Number(button.dataset.siteReset)];if(!entry)return;const ok=await ipc.invoke('permission-site-reset',entry.host);if(ok){toast('Permisos del sitio borrados');paintSitePermissions()}else toast('No se pudieron borrar los permisos')});
    }catch{sitePermBox.innerHTML='<div class="empty">No se pudo leer la lista de permisos.</div>';}
  };
  r.querySelector('#refreshSitePermissions').onclick=paintSitePermissions;paintSitePermissions();
  const importBox=r.querySelector('#importProfiles');
  r.querySelector('#scanImport').onclick=async()=>{
    const btn=r.querySelector('#scanImport');btn.disabled=true;btn.textContent='Buscando…';importBox.innerHTML='<div class="empty">Analizando perfiles locales…</div>';
    try{
      const sources=await ipc.invoke('migration-scan');
      if(!Array.isArray(sources)||!sources.length){importBox.innerHTML='<div class="empty">No se han encontrado perfiles compatibles. Asegúrate de que existen datos locales en Chrome, Edge o Firefox.</div>';return;}
      importBox.innerHTML=sources.map((source,i)=>`<div class="import-profile"><div class="stack"><strong>${esc(source.browserName||source.browser)} · ${esc(source.profileName||'Perfil')}</strong><small class="sub">${source.bookmarks?'Marcadores disponibles':'Sin marcadores'} · ${source.history?'Historial disponible':'Sin historial'}</small></div><label class="import-choice"><input type="checkbox" data-import-bookmarks="${i}" ${source.bookmarks?'checked':''} ${source.bookmarks?'':'disabled'}> Marcadores</label><label class="import-choice"><input type="checkbox" data-import-history="${i}" ${source.history?'checked':''} ${source.history?'':'disabled'}> Historial</label><button class="btn primary" data-import-run="${i}">Importar</button></div>`).join('');
      importBox.querySelectorAll('[data-import-run]').forEach(button=>button.onclick=async()=>{
        const index=Number(button.dataset.importRun),source=sources[index];if(!source)return;
        const bookmarks=!!importBox.querySelector(`[data-import-bookmarks="${index}"]`)?.checked;
        const history=!!importBox.querySelector(`[data-import-history="${index}"]`)?.checked;
        if(!bookmarks&&!history){toast('Selecciona al menos una categoría para importar.');return;}
        button.disabled=true;button.textContent='Importando…';
        try{
          const result=await ipc.invoke('migration-read',{id:source.id,bookmarks,history});
          if(result?.error)throw new Error(result.error);
          let addedBookmarks=0,addedHistory=0;
          if(bookmarks&&Array.isArray(result?.bookmarks?.items)){
            const seen=new Set(state.bookmarks.map(x=>x.url));
            for(const item of result.bookmarks.items){if(state.bookmarks.length>=100)break;const url=String(item.u||'');if(!/^https?:\/\//i.test(url)||seen.has(url))continue;state.bookmarks.push({url,title:String(item.t||url).slice(0,200)});seen.add(url);addedBookmarks++;}
          }
          if(history&&Array.isArray(result?.history)){
            const seen=new Set(state.history.map(x=>x.url));
            for(const item of result.history){if(state.history.length>=300)break;const url=String(item.u||'');if(!/^https?:\/\//i.test(url)||seen.has(url))continue;state.history.push({url,title:String(item.t||url).slice(0,200),ts:Number(item.d)||Date.now()});seen.add(url);addedHistory++;}
            state.history.sort((a,b)=>(b.ts||0)-(a.ts||0));state.history=state.history.slice(0,300);
          }
          saveState();refreshAllNewTabs();button.textContent='Importado';button.disabled=true;toast(`Importación completada: ${addedBookmarks} marcadores y ${addedHistory} entradas de historial.`);
        }catch(error){button.disabled=false;button.textContent='Reintentar';toast(String(error?.message||'No se pudo importar el perfil.').slice(0,220));}
      });
    }catch(error){importBox.innerHTML=`<div class="empty">No se pudo examinar el equipo: ${esc(error?.message||'error desconocido')}</div>`;}
    finally{btn.disabled=false;btn.textContent='Volver a buscar';}
  };
  const wpUrl=toolbarWallpaperUrl(), wpPreview=r.querySelector('#wallpaperPreview'), wpState=r.querySelector('#wallpaperState');
  if(wpUrl){wpPreview.style.backgroundImage=`linear-gradient(rgba(255,255,255,.48),rgba(255,255,255,.48)),url("${wpUrl}")`;wpState.textContent='Hay un fondo personalizado activo.';}else{wpPreview.style.backgroundImage='';wpState.textContent='Se está usando el fondo predeterminado.';}
  r.querySelector('#pickWallpaper').onclick=async()=>{const d=await ipc.invoke('toolbar-wallpaper-pick').catch(()=>({ok:false,error:'No se pudo abrir el selector de imágenes.'}));if(d?.ok){state.toolbarWallpaper=d.url;saveState();applyToolbarWallpaper();renderSettings(r);toast('Fondo de barra actualizado.');}else if(!d?.canceled)toast(d?.error||'No se pudo aplicar el fondo.');};
  r.querySelector('#resetWallpaper').onclick=async()=>{const ok=await ipc.invoke('toolbar-wallpaper-clear').catch(()=>false);if(ok){state.toolbarWallpaper='';saveState();applyToolbarWallpaper();renderSettings(r);toast('Fondo predeterminado restaurado.');}else toast('No se pudo restablecer el fondo.');};
  $('#appearance').onchange=e=>{state.appearance=e.target.value;saveState();applyAppearance();refreshAllNewTabs();renderSettings(r)};
  $('#search').onchange=e=>{state.search=e.target.value;saveState();refreshAllNewTabs()};
  r.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>{state.accent=b.dataset.accent;saveState();applyAppearance();refreshAllNewTabs();renderSettings(r)});
  $('#sideToggle').onclick=()=>{state.sidebarOpen=!state.sidebarOpen;saveState();applyAppearance();renderSettings(r)};
  r.querySelector('#sideVisibility').onclick=()=>{state.sidebarVisible=state.sidebarVisible===false;saveState();applyAppearance();renderSettings(r)};
  $('#animToggle').onclick=()=>{state.animations=!state.animations;saveState();applyAppearance();renderSettings(r)};
  r.querySelector('#newsToggle').onclick=()=>{state.showNews=!state.showNews;saveState();refreshAllNewTabs();renderSettings(r);toast(state.showNews?'Noticias activadas en nuevas pestañas':'Noticias ocultas en nuevas pestañas')};
  $('#reopenTab').onclick=reopenClosedTab;
  r.querySelector('#restoreSessionToggle').onclick=()=>{state.restoreSession=!state.restoreSession;if(!state.restoreSession){state.sessionTabs=[];state.sessionActiveUrl='';}else persistSession();saveState();renderSettings(r);toast(state.restoreSession?'Se restaurará la sesión anterior al iniciar Nova':'La sesión anterior ya no se guardará')};
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
  let i=0;const cards=[['../assets/brand/nova-mark.svg','Nueva identidad Deluxe','Marca N tridimensional, limpia y transparente, integrada en la ventana, la nueva pestaña, la pantalla de inicio y el icono de Windows.'],['../assets/illustrations/performance.svg','Inicio más ágil','La pantalla de inicio deja de imponer una espera larga. El rendimiento real de páginas y memoria debe medirse en el equipo de uso.'],['../assets/illustrations/onboarding.svg','Sesiones ampliadas','La restauración contempla hasta 50 pestañas web y conserva el grupo asociado cuando hay datos compatibles.'],['../assets/illustrations/renderer.svg','Setup y Portable','Dos distribuciones con carpetas de salida separadas y perfiles distintos para evitar mezclar los datos personales.']];const m=document.createElement('div');m.className='modal on';m.innerHTML=`<div class="modal-card"><div class="modal-head"><strong>Nova ${esc(APP_VERSION)} · Deluxe Edition</strong><button class="icon-btn" id="wnClose">×</button></div><div class="modal-body"><div id="wnCard" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center"></div><div class="tour-dots">${cards.map((_,k)=>`<span class="dot ${k===0?'on':''}" data-dot="${k}"></span>`).join('')}</div><div style="display:flex;justify-content:flex-end"><button class="btn primary" id="wnNext">Siguiente</button></div></div></div>`;document.body.appendChild(m);const keyClose=()=>{localStorage.setItem(key,'1');m.remove()};$('#wnClose').onclick=keyClose;$('#wnNext').onclick=()=>{if(i<cards.length-1){i++;paint()}else keyClose()};function paint(){const c=cards[i];$('#wnCard').innerHTML=`<img class="tour-img" src="${c[0]}" onerror="this.style.display='none'" alt=""><div><h2 style="margin-top:0">${esc(c[1])}</h2><p class="muted">${esc(c[2])}</p></div>`;m.querySelectorAll('[data-dot]').forEach(x=>x.classList.toggle('on',+x.dataset.dot===i));$('#wnNext').textContent=i===cards.length-1?'Terminar':'Siguiente'}paint();
}

function showMenu(){
  const actions=[
    ['Nueva pestaña','Ctrl+T',()=>newTab()],
    ['Favoritos','',()=>setInternal('favorites')],
    ['Historial','',()=>setInternal('history')],
    ['Descargas','',()=>setInternal('downloads')],
    ['Workspaces','',()=>setInternal('workspaces')],
    ['Extensiones','',()=>setInternal('extensions')],
    ['Rendimiento','',()=>setInternal('performance')],
    ['Ajustes','',()=>setInternal('settings')],
    ['Repetir guía de inicio','',()=>showTour()],
    ['Novedades','',()=>showWhatsNew(true)],
    ['Acerca de Nova','',()=>showAbout()]
  ];
  showDrawer('Menú',actions.map((x,i)=>(i===1||i===7||i===9?'<div class="menu-sep"></div>':'')+`<button class="menu-item" data-menu="${i}"><span>${esc(x[0])}</span><span class="muted">${esc(x[1])}</span></button>`).join(''));
  document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>{hideDrawer();actions[+b.dataset.menu]?.[2]?.()});
}
function showAbout(){showDrawer('Acerca de Nova',`<div style="text-align:center;padding:10px 0 16px"><img src="../assets/brand/nova-icon.png" style="width:76px;height:76px;object-fit:contain"><h2 style="margin:8px 0 2px">Nova</h2><div class="muted">Chrome Hybrid · ${esc(APP_VERSION)}</div></div><div class="section-card"><div class="row"><span>Chromium</span><strong>${esc(process.versions.chrome)}</strong></div><div class="row"><span>Electron</span><strong>${esc(process.versions.electron)}</strong></div><div class="row"><span>Node</span><strong>${esc(process.versions.node)}</strong></div></div>`)}

$('#newTab').innerHTML=iconSvg('plus');$('#newTab').onclick=()=>newTab();
$('#back').innerHTML=iconSvg('back');$('#forward').innerHTML=iconSvg('forward');$('#reload').innerHTML=iconSvg('reload');$('#star').innerHTML=iconSvg('star');$('#sidebarToggle').innerHTML=iconSvg('sidebar');$('#menuButton').innerHTML=iconSvg('menu');
$('#accentButton').querySelector('.accent-dot').style.removeProperty('background');
$('#back').onclick=()=>activeTab?.wv?.canGoBack()&&activeTab.wv.goBack();$('#forward').onclick=()=>activeTab?.wv?.canGoForward()&&activeTab.wv.goForward();$('#reload').onclick=()=>activeTab?.wv?.reload();$('#star').onclick=toggleBookmark;$('#sidebarToggle').onclick=()=>{state.sidebarVisible=state.sidebarVisible===false;saveState();applyAppearance()};$('#menuButton').onclick=showMenu;$('#accentButton').onclick=()=>showDrawer('Color de acento',`<div class="swatch-row" style="padding:10px 0">${ACCENT_COLORS.map(c=>`<button class="swatch ${state.accent===c?'active':''}" data-a="${c}" style="background:${c}"></button>`).join('')}</div>`);$('#accentButton').addEventListener('click',()=>setTimeout(()=>document.querySelectorAll('#drawer [data-a]').forEach(b=>b.onclick=()=>{state.accent=b.dataset.a;saveState();applyAppearance();hideDrawer();refreshAllNewTabs()}),0));
document.querySelectorAll('[data-window]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.window;try{ipc.send('win',a)}catch{toast('No se pudo controlar la ventana')}}));
$('#address').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();hideOmniboxSuggestions();navigate(e.target.value)}};$('#address').onfocus=e=>{e.target.select();renderOmniboxSuggestions(e.target.value)};$('#address').oninput=e=>{clearTimeout(omniboxTimer);omniboxTimer=setTimeout(()=>renderOmniboxSuggestions(e.target.value),40)};document.addEventListener('click',e=>{if(!e.target.closest('#addressWrap'))hideOmniboxSuggestions()});
$('.side-item[data-view="home"]').onclick=()=>backToBrowser();document.querySelectorAll('.side-item[data-view]:not([data-view="home"])').forEach(b=>b.onclick=()=>setInternal(b.dataset.view));
window.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='t'){e.preventDefault();reopenClosedTab()}else if(e.ctrlKey&&e.key.toLowerCase()==='t'){e.preventDefault();newTab()}else if(e.ctrlKey&&e.key.toLowerCase()==='w'){e.preventDefault();closeTab(activeTab)}else if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();$('#address').focus()}else if(e.ctrlKey&&e.key.toLowerCase()==='d'){e.preventDefault();toggleBookmark()}else if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();showCommand()}else if(e.key==='Escape'){hideDrawer();document.querySelectorAll('.modal.on').forEach(x=>x.remove())}});
ipc.on('open-tab',(_,url)=>newTab(url)); ipc.on('open-tour',()=>showTour()); ipc.on('open-command',()=>showCommand());ipc.on('blocked',(_,n)=>toast(`${n} solicitudes bloqueadas`));ipc.on('dl',(_,d)=>{const entry={id:d?.id??null,name:String(d?.name||'archivo'),path:String(d?.path||''),state:String(d?.state||''),recv:Number(d?.recv)||0,total:Number(d?.total)||0,ts:Date.now()};const idx=entry.id!==null?state.downloads.findIndex(x=>String(x.id)===String(entry.id)):-1;if(idx>=0)state.downloads[idx]={...state.downloads[idx],...entry};else state.downloads.unshift(entry);state.downloads=state.downloads.slice(0,100);saveState();if(internalView==='downloads'){const p=$('#internalPanel');if(p)renderInternal(p,'downloads')}if(['done','completed'].includes(entry.state))toast(`Descarga completada: ${entry.name}`)});ipc.on('tab-health',(_,d)=>{if(d?.type==='unresponsive')toast('Una pestaña no responde');if(d?.type==='responsive')toast('Pestaña recuperada')});
function showCommand(){showDrawer('Nova Command',`<input class="field" id="cmd" placeholder="Busca pestañas, favoritos, ajustes o acciones…"><div id="cmdResults" style="margin-top:10px"></div>`);const input=$('#cmd');const data=()=>{const q=input.value.trim().toLowerCase();const out=[];tabs.forEach((t,i)=>{if(!q||String(t.title+' '+getTabUrl(t)).toLowerCase().includes(q))out.push(['Pestaña: '+(t.title||'Nueva pestaña'),()=>selectTab(t)]);});state.bookmarks.forEach(b=>{if(!q||String(b.title+' '+b.url).toLowerCase().includes(q))out.push(['Favorito: '+(b.title||b.url),()=>navigate(b.url)])});[['Historial',()=>setInternal('history')],['Ajustes',()=>setInternal('settings')],['Extensiones',()=>setInternal('extensions')],['Rendimiento',()=>setInternal('performance')],['Workspaces',()=>setInternal('workspaces')],['Novedades',()=>showWhatsNew(true)]].forEach(x=>{if(!q||x[0].toLowerCase().includes(q))out.push([x[0],x[1]])});return out.slice(0,12)};function paint(){const box=$('#cmdResults');const arr=data();box.innerHTML=arr.length?arr.map((x,i)=>`<button class="menu-item" data-cmd="${i}">${esc(x[0])}</button>`).join(''):'<div class="empty">Sin resultados.</div>';box.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{arr[+b.dataset.cmd][1]();hideDrawer()})}input.oninput=paint;paint();input.focus();}

applyAppearance();
const initialSession = state.restoreSession && Array.isArray(state.sessionTabs) ? state.sessionTabs.slice(-50).filter(x=>x&&/^https?:\/\//i.test(typeof x==='string'?x:x.url||'')) : [];
if (initialSession.length) {
  restoringSession = true;
  initialSession.forEach(item => newTab(typeof item==='string'?item:item.url, typeof item==='object'?item.group||'':''));
  const preferred = state.sessionActiveUrl && tabs.find(t=>getTabUrl(t)===state.sessionActiveUrl);
  if (preferred) selectTab(preferred);
  restoringSession = false;
  persistSession();
} else newTab();
setTimeout(()=>{ if(state.showTourOnStart){ state.showTourOnStart=false; state.firstRun=false; saveState(); showTour(); } else showWhatsNew(false); },900);
