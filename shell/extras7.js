/* Nova 1.6.5 - capa aditiva: perfiles, F12/DevTools y Cuenta Nova con sincronización online. */
(() => {
  const N = NOVA;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const toastSafe = m => { try { toast(m); } catch { } };
  const clone = o => { try { return JSON.parse(JSON.stringify(o)); } catch { return {}; } };
  const profileKeys = ['theme','search','adblock','anim','sec','wp','marks','mods','memSave','bmbar','convs','groups','folders','quick','dash','notes','notesL','hist','dls','restore','session2','perms'];
  const syncKeys = ['theme','search','anim','sec','marks','folders','quick','dash','hist','notesL'];
  const profileMeta = () => ({ id:'default', name:'Principal', avatar:'N', createdAt:Date.now() });
  const normalProfileId = v => String(v || '').replace(/[^a-z0-9_-]/gi,'').slice(0,32) || 'default';
  const cleanProfileName = v => String(v || '').replace(/[\u0000-\u001f]/g,'').trim().slice(0,40) || 'Perfil';

  S.profiles = Array.isArray(S.profiles) && S.profiles.length ? S.profiles : [profileMeta()];
  S.profiles = S.profiles.map((p, i) => ({ id:normalProfileId(p.id || (i ? `p${Date.now().toString(36)}${i}` : 'default')), name:cleanProfileName(p.name || (i ? `Perfil ${i+1}` : 'Principal')), avatar:String(p.avatar || (p.name || 'P').slice(0,1)).slice(0,2), createdAt:Number(p.createdAt)||Date.now() }));
  if (!S.profiles.some(p => p.id === 'default')) S.profiles.unshift(profileMeta());
  S.activeProfile = S.activeProfile && S.profiles.some(p => p.id === S.activeProfile) ? S.activeProfile : S.profiles[0].id;
  S.profileStores = (S.profileStores && typeof S.profileStores === 'object') ? S.profileStores : {};
  const storeCurrent = () => Object.fromEntries(profileKeys.map(k => [k, clone(S[k])]));
  if (!S.profileStores[S.activeProfile]) S.profileStores[S.activeProfile] = storeCurrent();
  const ensureDefaults = () => {
    S.marks = Array.isArray(S.marks) ? S.marks : []; S.hist = Array.isArray(S.hist) ? S.hist : [];
    S.folders = Array.isArray(S.folders) ? S.folders : []; S.quick = Array.isArray(S.quick) ? S.quick : [];
    S.dash = Object.assign({clock:true,search:true,quick:true,recent:true,dl:true,ai:true}, S.dash);
    S.groups = S.groups && typeof S.groups === 'object' ? S.groups : {};
  };
  const saveProfile = () => { ensureDefaults(); S.profileStores[S.activeProfile] = storeCurrent(); save(); };
  const applyProfile = id => {
    const target = S.profileStores[id] || {};
    for (const k of profileKeys) delete S[k];
    Object.assign(S, clone(target));
    ensureDefaults();
    S.activeProfile = id;
    save();
  };
  ensureDefaults(); saveProfile();

  const profilePartition = () => S.activeProfile === 'default' ? 'persist:web' : `persist:nova-profile-${normalProfileId(S.activeProfile || 'default')}`;
  window.NOVA_PROFILE_PARTITION = profilePartition;

  const st = document.createElement('style');
  st.id = 'nova165-style';
  st.textContent = `
    #nova-profile-button{margin-left:auto;display:flex;align-items:center;gap:6px;max-width:190px;height:28px;padding:0 10px;border:1px solid var(--bd);border-radius:999px;background:var(--bar);color:var(--fg);cursor:pointer;overflow:hidden;white-space:nowrap}
    #nova-profile-avatar{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:#fff;font-size:10px;font-weight:800;flex:none}
    #nova-profile-name{overflow:hidden;text-overflow:ellipsis}
    #nova-profile-pop{position:fixed;top:38px;right:105px;z-index:70;display:none;min-width:250px;padding:10px;background:var(--bar);border:1px solid var(--bd);border-radius:calc(var(--r)*1.2);box-shadow:0 18px 55px #000b}
    #nova-profile-pop.on{display:block}.nova-profile-item{display:flex;align-items:center;gap:8px;width:100%;padding:8px;border:0;background:transparent;color:var(--fg);text-align:left;border-radius:var(--r);cursor:pointer}.nova-profile-item:hover{background:color-mix(in srgb,var(--acc) 12%,transparent)}
    .nova-profile-dot{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:#fff;font-weight:800;font-size:11px;flex:none}.nova-profile-current{font-size:11px;color:var(--mut);padding:5px 8px 8px}
    .nova165-card{margin-top:12px;padding:12px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bar);display:flex;flex-direction:column;gap:8px}.nova165-title{font-weight:750;color:var(--acc)}.nova165-state{display:flex;align-items:center;justify-content:space-between;gap:10px}.nova165-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:7px}.nova165-item{padding:8px;border:1px solid var(--bd);border-radius:var(--r);background:color-mix(in srgb,var(--bar) 75%,transparent)}
    .nova165-badge{padding:2px 7px;border-radius:999px;background:color-mix(in srgb,var(--acc) 18%,transparent);font-size:10px}.nova165-muted{font-size:11px;color:var(--mut)}
  `;
  document.head.appendChild(st);

  /* ---------- F12 / DevTools: únicamente añade el acceso; Electron mantiene DevTools habilitados. ---------- */
  N.devtools = () => { try { if (cur?.wv?.isDevToolsOpened?.()) cur.wv.closeDevTools(); else cur?.wv?.openDevTools?.({mode:'detach', activate:true}); } catch { toastSafe('No se pudieron abrir las herramientas de desarrollador'); } };
  N.SHORTCUTS = (N.SHORTCUTS || []).concat([['F12','Abrir/cerrar herramientas de desarrollador']]);
  N.ACTIONS = (() => { const old = N.ACTIONS; return () => [...(typeof old === 'function' ? old() : []), ['Herramientas de desarrollador (F12)', () => N.devtools()]]; })();
  N.extraActs = Array.isArray(N.extraActs) ? N.extraActs : [];
  if (!N.extraActs.some(a => /herramientas de desarrollador/i.test(a[0] || ''))) N.extraActs.push(['Herramientas de desarrollador (F12)', () => N.devtools()]);

  document.addEventListener('keydown', e => {
    if (e.key === 'F12') { e.preventDefault(); N.devtools(); }
  }, true);

  /* ---------- Perfiles ---------- */
  function currentProfile() { return S.profiles.find(p => p.id === S.activeProfile) || S.profiles[0]; }
  function drawProfileButton() {
    let b = document.getElementById('nova-profile-button');
    if (!b) {
      b = document.createElement('button'); b.id = 'nova-profile-button'; b.title = 'Cambiar perfil';
      b.innerHTML = '<span id="nova-profile-avatar"></span><span id="nova-profile-name"></span>';
      const wc = document.getElementById('wc'); document.getElementById('top')?.insertBefore(b, wc || null);
      b.onclick = e => { e.stopPropagation(); document.getElementById('nova-profile-pop')?.classList.toggle('on'); refreshProfilePop(); };
    }
    const p=currentProfile(); const a=document.getElementById('nova-profile-avatar'), n=document.getElementById('nova-profile-name');
    if(a)a.textContent=p.avatar||p.name.slice(0,1); if(n)n.textContent=p.name;
  }
  function makeProfilePop() {
    if(document.getElementById('nova-profile-pop')) return;
    const pop=document.createElement('div'); pop.id='nova-profile-pop'; document.body.appendChild(pop);
    document.addEventListener('click',e=>{ if(!pop.contains(e.target) && !e.target.closest('#nova-profile-button')) pop.classList.remove('on'); });
  }
  function refreshProfilePop() {
    makeProfilePop(); const pop=document.getElementById('nova-profile-pop'), curp=currentProfile();
    pop.innerHTML=`<div class="nova-profile-current">Perfil activo</div>${S.profiles.map(p=>`<button class="nova-profile-item" data-p="${esc(p.id)}"><span class="nova-profile-dot">${esc(p.avatar)}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</span>${p.id===curp.id?'<span class="nova165-badge">Activo</span>':''}</button>`).join('')}<hr style="border:0;border-top:1px solid var(--bd);margin:7px 0"><button class="nova-profile-item" id="np-new">＋ Crear perfil</button><button class="nova-profile-item" id="np-manage">⚙ Administrar perfiles</button>`;
    pop.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>switchProfile(b.dataset.p));
    pop.querySelector('#np-new').onclick=()=>createProfile(); pop.querySelector('#np-manage').onclick=()=>{pop.classList.remove('on');if(typeof draw==='function'){panel='set';draw();setTimeout(()=>document.getElementById('nova-profile-manager')?.scrollIntoView({behavior:'smooth',block:'center'}),50);}};
  }
  const captureTabs = () => {
    try { S.session2 = tabs.map(t => { const u=t.wv.getURL(); return !u || u.startsWith('nova:') || isNT(u) ? null : {u,g:t.g||'',p:t.el.classList.contains('pin')?1:0}; }).filter(Boolean); } catch { S.session2=[]; }
  };
  function rebuildTabs() {
    try { tabs.forEach(t=>{try{t.wv.remove()}catch{};try{t.el.remove()}catch{}}); tabs.length=0; cur=null; $('#tabs').replaceChildren(); } catch { }
    const list=Array.isArray(S.session2)?S.session2.slice(0,30):[]; const first=newTab(); list.forEach(s=>{const t=newTab(s.u); if(s.g && S.groups[s.g])t.g=s.g;if(s.p)t.el.classList.add('pin');});
    if(list.length && first){ try{first.wv.remove();first.el.remove();tabs.splice(tabs.indexOf(first),1)}catch{} }
    if(typeof renderGroups==='function')renderGroups();
  }
  async function switchProfile(id) {
    if(id===S.activeProfile)return;
    const target=S.profiles.find(p=>p.id===id); if(!target)return;
    captureTabs(); saveProfile(); applyProfile(id); applyTheme(); ipc.send('perm-policy', S.perms || {}); ipc.invoke('adblock', !!S.adblock).catch(()=>{}); N.refreshBottomBar?.(); refreshNT(); drawProfileButton(); refreshProfilePop(); rebuildTabs();
    toastSafe(`Perfil cambiado: ${target.name}`);
    syncNow(false);
  }
  async function createProfile() {
    const r=await N.dlg?.('Crear perfil',[{label:'Nombre',value:'Nuevo perfil'},{label:'Inicial / avatar',value:'N'}],'Crear'); if(!r)return;
    const id=normalProfileId((r[0]||'nuevo').toLowerCase().replace(/\s+/g,'-')+'-'+Date.now().toString(36)); const p={id,name:cleanProfileName(r[0]),avatar:String(r[1]||r[0]||'P').slice(0,2),createdAt:Date.now()};
    S.profiles.push(p); S.profileStores[id]={theme:S.theme,search:S.search,anim:S.anim,adblock:S.adblock,sec:S.sec,marks:[],folders:[],quick:[],dash:clone(S.dash),mods:{},memSave:S.memSave,bmbar:S.bmbar,hist:[],groups:{},notesL:[]}; save(); refreshProfilePop(); toastSafe(`Perfil creado: ${p.name}`); await switchProfile(id);
  }
  async function editProfile(id) {
    const p=S.profiles.find(x=>x.id===id);if(!p)return;
    const r=await N.dlg?.('Editar perfil',[{label:'Nombre',value:p.name},{label:'Inicial / avatar',value:p.avatar}],'Guardar'); if(!r)return;
    p.name=cleanProfileName(r[0]);p.avatar=String(r[1]||p.name).slice(0,2);save();drawProfileButton();refreshProfilePop();renderProfileManager();
  }
  async function deleteProfile(id) {
    if(S.profiles.length<=1)return toastSafe('Debe existir al menos un perfil.'); if(id===S.activeProfile)return toastSafe('Cambia a otro perfil antes de eliminar este.');
    const p=S.profiles.find(x=>x.id===id); if(!p)return; if(!confirm(`¿Eliminar el perfil «${p.name}» y sus datos locales de Nova?`))return;
    S.profiles=S.profiles.filter(x=>x.id!==id);delete S.profileStores[id];save();refreshProfilePop();renderProfileManager();
  }
  function renderProfileManager() {
    const box=document.getElementById('nova-profile-manager'); if(!box)return;
    box.innerHTML=`<div class="nova165-title">Perfiles</div><div class="nova165-muted">Cada perfil tiene su propia sesión web persistente. Las cuentas, cookies, historial y marcadores no se mezclan entre perfiles.</div>${S.profiles.map(p=>`<div class="nova165-state nova165-item"><span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="nova-profile-dot">${esc(p.avatar)}</span><span style="overflow:hidden;text-overflow:ellipsis">${esc(p.name)} ${p.id===S.activeProfile?'<span class="nova165-badge">Activo</span>':''}</span></span><span style="display:flex;gap:6px"><button class="btn" data-e="${esc(p.id)}">Editar</button><button class="btn" data-d="${esc(p.id)}">Eliminar</button></span></div>`).join('')}<div class="row"><button class="btn on" id="np-add">＋ Nuevo perfil</button></div>`;
    box.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>editProfile(b.dataset.e)); box.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>deleteProfile(b.dataset.d)); box.querySelector('#np-add').onclick=createProfile;
  }
  const oldDraw=draw;
  draw=function(){ oldDraw(); drawProfileButton(); makeProfilePop(); if(panel==='set'){ let b=document.getElementById('nova-profile-manager'); if(!b){b=document.createElement('div');b.id='nova-profile-manager';b.className='nova165-card';document.getElementById('pin')?.appendChild(b);} renderProfileManager(); } };
  drawProfileButton(); makeProfilePop(); refreshProfilePop();

  /* ---------- Cuenta Nova ---------- */
  let accountStatus={loggedIn:false,id:'',username:''};
  const accountPayload = () => {
    const data={version:1,profiles:clone(S.profiles),activeProfile:S.activeProfile,stores:{}};
    for(const [id,store] of Object.entries(S.profileStores||{})) data.stores[id]=Object.fromEntries(syncKeys.map(k=>[k,clone(store?.[k])]));
    return data;
  };
  function mergeSync(remote) {
    if(!remote || typeof remote!=='object') return;
    if(Array.isArray(remote.profiles)) for(const rp of remote.profiles){if(!S.profiles.some(p=>p.id===rp.id))S.profiles.push({id:normalProfileId(rp.id),name:cleanProfileName(rp.name),avatar:String(rp.avatar||'P').slice(0,2),createdAt:Number(rp.createdAt)||Date.now()});}
    if(remote.stores && typeof remote.stores==='object') for(const [id,rs] of Object.entries(remote.stores)){if(!S.profileStores[id])S.profileStores[id]={};for(const k of syncKeys){if(rs && Object.prototype.hasOwnProperty.call(rs,k))S.profileStores[id][k]=clone(rs[k]);}}
    const localStore=S.profileStores[S.activeProfile]||storeCurrent();
    if(localStore){
      if(Array.isArray(localStore.marks)) localStore.marks = [...new Map(localStore.marks.concat(S.marks||[]).map(x=>[x.u,x])).values()].slice(-20000);
      if(Array.isArray(localStore.hist)) localStore.hist = [...new Map(localStore.hist.concat(S.hist||[]).map(x=>[x.u,x])).values()].sort((a,b)=>(b.d||0)-(a.d||0)).slice(0,1000);
      S.profileStores[S.activeProfile]=localStore;
    }
    save();
  }
  async function refreshAccountStatus(){ accountStatus=await ipc.invoke('account-status').catch(()=>({})); return accountStatus; }
  async function accountRegister() {
    const r=await N.dlg?.('Crear cuenta Nova',[{label:'Usuario (se convertirá en usuario@Nova.com)',value:''},{label:'Contraseña (mínimo 8 caracteres)',value:''}],'Crear'); if(!r)return;
    const x=await ipc.invoke('account-register',{username:r[0],password:r[1]}).catch(()=>({ok:false,error:'No disponible'})); toastSafe(x.ok?`Cuenta creada: ${x.id}`:(x.error||'No se pudo crear la cuenta.')); if(x.ok){await refreshAccountStatus();renderAccountCard();await syncNow(false);}
  }
  async function accountLogin() {
    const r=await N.dlg?.('Iniciar sesión en Nova',[{label:'Usuario o usuario@Nova.com',value:''},{label:'Contraseña',value:''}],'Entrar'); if(!r)return;
    const x=await ipc.invoke('account-login',{username:r[0],password:r[1]}).catch(()=>({ok:false,error:'No disponible'})); toastSafe(x.ok?`Sesión iniciada: ${x.id}`:(x.error||'No se pudo iniciar sesión.')); if(x.ok){await refreshAccountStatus();renderAccountCard();await syncNow(true);}
  }
  async function accountLogout(){const x=await ipc.invoke('account-logout').catch(()=>({ok:false}));if(x.ok){accountStatus={loggedIn:false,id:'',username:''};renderAccountCard();toastSafe('Sesión cerrada en este equipo.');}}
  async function syncNow(show=true){
    await refreshAccountStatus(); if(!accountStatus.loggedIn){if(show)toastSafe('Inicia sesión en tu cuenta Nova para sincronizar.');return false;}
    saveProfile(); const x=await ipc.invoke('account-sync',accountPayload()).catch(()=>({ok:false,error:'No disponible'}));
    if(!x.ok){if(show)toastSafe(x.error||'No se pudo sincronizar.');return false;}
    if(x.remote)mergeSync(x.remote); saveProfile();
    if(show)toastSafe('Nova sincronizado.'); return true;
  }
  N.accountSync=syncNow;
  setInterval(()=>{if(document.visibilityState!=='hidden')syncNow(false)},10*60*1000);

  function renderAccountCard() {
    const box=document.getElementById('nova-account-card');if(!box)return;
    if(!accountStatus.loggedIn) box.innerHTML=`<div class="nova165-title">Cuenta Nova</div><div class="nova165-muted">Crea una cuenta gratuita que solo sirve dentro de Nova. Su identificador tendrá el formato <b>usuario@Nova.com</b>. La sesión de este PC se protege con el almacén seguro del sistema.</div><div class="row"><button class="btn on" id="na-reg">Crear cuenta</button><button class="btn" id="na-log">Iniciar sesión</button></div><div class="nova165-muted">La nube de Nova sincroniza marcadores, historial y preferencias de navegación. No sincroniza contraseñas guardadas, cookies ni la clave de Nova IA.</div>`;
    else box.innerHTML=`<div class="nova165-title">Cuenta Nova</div><div class="nova165-state"><span><b>${esc(accountStatus.id)}</b><br><span class="nova165-muted">Conectada en este PC</span></span><span class="nova165-badge">ONLINE</span></div><div class="row"><button class="btn on" id="na-sync">Sincronizar ahora</button><button class="btn" id="na-out">Cerrar sesión</button></div><div class="nova165-muted">Puedes iniciar sesión con esta misma cuenta en otro PC de Nova para recuperar tus datos sincronizados.</div>`;
    box.querySelector('#na-reg')?.addEventListener('click',accountRegister);box.querySelector('#na-log')?.addEventListener('click',accountLogin);box.querySelector('#na-sync')?.addEventListener('click',()=>syncNow(true));box.querySelector('#na-out')?.addEventListener('click',accountLogout);
  }
  async function enhanceSettings(){
    const pin=document.getElementById('pin');if(!pin)return;
    let box=document.getElementById('nova-account-card');if(!box){box=document.createElement('div');box.id='nova-account-card';box.className='nova165-card';pin.appendChild(box);} await refreshAccountStatus(); renderAccountCard();
    let help=document.getElementById('nova-f12-card');if(!help){help=document.createElement('div');help.id='nova-f12-card';help.className='nova165-card';help.innerHTML='<div class="nova165-title">Herramientas de desarrollador</div><div class="nova165-muted">Pulsa <b>F12</b> para abrir/cerrar DevTools de la pestaña activa.</div><button class="btn" id="nova-open-devtools">Abrir DevTools</button>';pin.appendChild(help);help.querySelector('#nova-open-devtools').onclick=()=>N.devtools();}
    let pm=document.getElementById('nova-profile-manager');if(!pm){pm=document.createElement('div');pm.id='nova-profile-manager';pm.className='nova165-card';pin.appendChild(pm);}renderProfileManager();
  }
  const wrappedDraw=draw;
  draw=function(){ wrappedDraw(); if(panel==='set') enhanceSettings().catch(()=>{}); };
  drawProfileButton();
  refreshAccountStatus().catch(()=>{});

  /* ---------- Recordatorio en Novedades/Bienvenida ---------- */
  const add165Block=(r, welcome=false)=>{
    if(!r || r.querySelector('.nova165-update')) return;
    const b=document.createElement('section');b.className='nova165-card nova165-update';
    b.innerHTML=`<div class="nova165-title">Nova 1.6.5</div><div class="nova165-muted">Nueva capa añadida sin eliminar las funciones anteriores.</div><div class="nova165-grid"><div class="nova165-item"><b>👤 Perfiles</b><br><span class="nova165-muted">Sesiones separadas</span></div><div class="nova165-item"><b>🛠 F12</b><br><span class="nova165-muted">DevTools de la pestaña</span></div><div class="nova165-item"><b>☁ Cuenta Nova</b><br><span class="nova165-muted">Sincronización entre PCs</span></div></div><div class="row"><button class="btn on" id="n65set">Abrir ajustes</button><button class="btn" id="n65sync">Cuenta Nova</button></div>`;
    r.appendChild(b);b.querySelector('#n65set').onclick=()=>newTab('nova://ajustes');b.querySelector('#n65sync').onclick=()=>newTab('nova://ajustes');
  };
  const ow=PG.bienvenida;PG.bienvenida=async r=>{if(typeof ow==='function')await ow(r);add165Block(r,true);};
  const on=PG.novedades;PG.novedades=r=>{if(typeof on==='function')on(r);add165Block(r,false);};

  /* ---------- Command Center ---------- */
  if(typeof N.extraActs==='object'){
    if(!N.extraActs.some(a=>/cambiar perfil/i.test(a[0]||'')))N.extraActs.push(['Cambiar perfil',()=>{document.getElementById('nova-profile-button')?.click()}]);
    if(!N.extraActs.some(a=>/crear perfil/i.test(a[0]||'')))N.extraActs.push(['Crear perfil',createProfile]);
    if(!N.extraActs.some(a=>/cuenta nova/i.test(a[0]||'')))N.extraActs.push(['Cuenta Nova',()=>newTab('nova://ajustes')]);
  }

  Object.assign(N,{createProfile,switchProfile,refreshProfileManager:renderProfileManager});
  drawProfileButton(); refreshProfilePop();
})();
