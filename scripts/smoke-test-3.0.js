'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const must = (ok, msg) => { if (!ok) throw new Error(msg); };

class FakeEl {
  constructor(tag='div', attrs={}) {
    this.tagName=String(tag).toUpperCase(); this.id=attrs.id||''; this.attributes=attrs; this.dataset={};
    for (const [k,v] of Object.entries(attrs)) if (k.startsWith('data-')) this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;
    this.style={}; this.classList={_s:new Set((attrs.class||'').split(/\s+/).filter(Boolean)),toggle:(k,on)=>{if(on===undefined)on=!this.classList._s.has(k);on?this.classList._s.add(k):this.classList._s.delete(k);return on},add:k=>this.classList._s.add(k),remove:k=>this.classList._s.delete(k),contains:k=>this.classList._s.has(k)};
    this.children=[]; this.innerHTML=''; this.innerText=''; this.textContent=''; this.value=attrs.value||''; this.files=[]; this.onclick=null; this.oninput=null; this.onchange=null; this.events={};
  }
  appendChild(x){this.children.push(x); if(x){x._root=this._root||this; if(this.byId && x.id)this.byId.set(x.id,x); for(const k of Object.keys(x.dataset||{})){if(this.byData){if(!this.byData.has(k))this.byData.set(k,[]);this.byData.get(k).push(x)}}} return x;} append(...xs){xs.forEach(x=>this.appendChild(x));}
  insertAdjacentHTML(){ }
  querySelector(sel){
    if(sel.startsWith('#')) return this._root?.byId.get(sel.slice(1)) || null;
    if(/^\[data-[^=\]]+\]$/.test(sel)) return (this._root?.byData.get(sel.match(/^\[data-([^\]]+)\]$/)[1])||[])[0]||null;
    if(sel.startsWith('.')) return (this._root?.byClass.get(sel.slice(1))||[])[0]||null;
    return null;
  }
  querySelectorAll(sel){
    if(/^\[data-[^=\]]+\]$/.test(sel)) return this._root?.byData.get(sel.match(/^\[data-([^\]]+)\]$/)[1])||[];
    if(sel.startsWith('.')) return this._root?.byClass.get(sel.slice(1))||[];
    return [];
  }
  remove(){ }
  addEventListener(type,fn){this.events[type]=fn;}
  setAttribute(name,val){this.attributes[name]=String(val);if(name==='id')this.id=String(val);}
  focus(){ }
}

class FakeRoot extends FakeEl {
  constructor(){super('div');this._root=this;this.byId=new Map();this.byData=new Map();this.byClass=new Map();}
  set innerHTML(v){
    this._html=String(v||''); this.children=[]; this.byId=new Map(); this.byData=new Map(); this.byClass=new Map();
    const re=/<([a-z0-9]+)\b([^>]*)>/gi; let m;
    while((m=re.exec(this._html))){
      const tag=m[1], raw=m[2]; const attrs={};
      const ar=/([:\w-]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g; let a;
      while((a=ar.exec(raw))){attrs[a[1]]=a[2]??a[3]??a[4]??'';}
      if(attrs.id||/^button$/i.test(tag)||Object.keys(attrs).some(k=>k.startsWith('data-'))){
        const el=new FakeEl(tag,attrs); el._root=this; this.children.push(el); if(el.id)this.byId.set(el.id,el); for(const k of Object.keys(attrs)) if(k.startsWith('data-')){const key=k.slice(5); if(!this.byData.has(key))this.byData.set(key,[]); this.byData.get(key).push(el);} for(const c of (attrs.class||'').split(/\s+/).filter(Boolean)){if(!this.byClass.has(c))this.byClass.set(c,[]);this.byClass.get(c).push(el);} }
    }
  }
  get innerHTML(){return this._html||'';}
  querySelector(sel){return super.querySelector(sel)||new FakeEl();}
  querySelectorAll(sel){return super.querySelectorAll(sel);}
}

async function main(){
  const jsFiles=[];
  for(const dir of ['.','shell','account-server','scripts']){
    const full=path.join(root,dir); if(!fs.existsSync(full))continue;
    for(const f of fs.readdirSync(full)){const p=path.join(full,f);if(fs.statSync(p).isFile()&&f.endsWith('.js'))jsFiles.push(p);}
  }
  for(const f of jsFiles)cp.execFileSync(process.execPath,['--check',f],{stdio:'ignore'});

  const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')); must(pkg.version==='3.0.0',`package version ${pkg.version}`);
  const idx=fs.readFileSync(path.join(root,'shell/index.html'),'utf8'); must(idx.includes('nova30.js'),'nova30 runtime not loaded');
  const nx=fs.readFileSync(path.join(root,'shell/nova30.js'),'utf8'); const n25=fs.readFileSync(path.join(root,'shell/nova25.js'),'utf8');
  const mainSrc=fs.readFileSync(path.join(root,'main.js'),'utf8'); const nt=fs.readFileSync(path.join(root,'shell/newtab.html'),'utf8');
  const routes=['safari','islands','workspaces','glance','focus','reader','collections','capture','writer','docs','study3','privacidad2','rendimiento2','descargas2','apps','panels','media','pip','pestanas','sesiones','qr','backup','shortcuts','send','mejoras','novedades','bienvenida'];
  for(const r of routes)must(nx.includes(`N.PG.${r}`)||n25.includes(`PG.${r}`),`route ${r} missing`);
  for(const x of ['N.palette','N.createIsland','N.snooze','launch-web-app','save-text','show-in-folder'])must(nx.includes(x)||mainSrc.includes(x),`${x} missing`);
  for(const x of ["ipcMain.handle('nova-ai'","ipcMain.handle('performance-info'","ipcMain.handle('performance-mode'","ipcMain.handle('performance-cache'","ipcMain.handle('open-downloads-folder'","ipcMain.handle('show-in-folder'","ipcMain.handle('save-text'","ipcMain.handle('save-docx'","ipcMain.handle('launch-web-app'"])must(mainSrc.includes(x),`IPC ${x} missing`);
  must(nt.includes('#nova/reading')&&nt.includes('#nova/workspaces')&&nt.includes('#nova/pestanas'),'Nova Tab 3.0 actions missing');
  must(nx.includes("raw === 'acciones'")&&nx.includes('N.palette?.()'),'Command Center Nova Tab route missing');

  const body=new FakeRoot(), head=new FakeRoot(); const doc={body,head,documentElement:new FakeRoot(),getElementById(id){return body.byId.get(id)||head.byId.get(id)||null},createElement(tag){const e=new FakeRoot();e.tagName=String(tag).toUpperCase();e._root=e;return e},addEventListener(){},querySelectorAll(){return []},execCommand(){return true}};
  const S={theme:'air',novaNext:{},nova25:{},groups:{},profiles:[{id:'default'}],activeProfile:'default',dls:[]};
  const N={PG:{},extraActs:[],resolveFeatureRoute:x=>String(x),toggleAI(){}}; const newTabs=[];
  const makeTab=(url='nova://newtab')=>{const el=new FakeRoot();const span=new FakeEl('span');span.textContent=url;el.byId.set('span',span);return {el,g:'',wv:{getURL:()=>url,executeJavaScript:async()=>'',loadURL:async()=>{},isCurrentlyAudible:()=>false,isAudioMuted:()=>false,setAudioMuted(){}}};};
  const ipcCalls=[];
  const ctx={window:{NOVA:N},NOVA:N,MENU:[],document:doc,S,tabs:[],cur:null,newTab(url){const t=makeTab(url);newTabs.push(t);return t},closeTab(){},sel(){},save(){},applyTheme(){},refreshNT(){},profilePartition(){return 'persist:web'},toast(){},setInterval(){return 0},clearInterval(){},setTimeout(){return 0},matchMedia(){return {matches:false,addEventListener(){}}},URL,console,Date,Math,JSON,encodeURIComponent,location:{href:'file:///nova'},navigator:{clipboard:{writeText:async()=>{}}},innerWidth:1200,innerHeight:800,prompt(){return null},alert(){},confirm(){return true},addEventListener(){},ipc:{invoke:async(name,payload)=>{ipcCalls.push([name,payload]);if(name==='performance-info')return {ok:true,main:{pid:123,rssKB:2097152},tabs:[],system:{}};if(name==='save-docx')return 'test.docx';if(name==='save-text')return 'test.html';return true},send(){}},chat:[],panel:null,draw(){},ask:async()=>{},isNT:()=>false,enforcePins(){},renderGroups(){},saveAll(){},checkUpd(){}};
  ctx.global=ctx;ctx.window.document=doc;ctx.window.setInterval=ctx.setInterval;ctx.window.setTimeout=ctx.setTimeout;ctx.window.NOVA=N;ctx.window.Nova25={};ctx.Nova25=ctx.window.Nova25;
  for(const file of ['shell/nova25.js','shell/hotfix254.js','shell/nova30.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});

  for(const r of routes)must(typeof N.PG[r]==='function',`runtime route ${r} missing`);
  must(typeof N.palette==='function'&&typeof N.openFeature==='function'&&typeof N.createIsland==='function','core 3.0 runtime API missing');
  const aliases={privacy:'privacidad2',performance:'rendimiento2',downloads:'descargas2',study:'study3',feedback:'mejoras',readinglist:'reading',qrshare:'qr',mediahub:'media',webpanels:'panels',backuprestore:'backup'};
  for(const [a,t] of Object.entries(aliases))must(N.resolveFeatureRoute(a)===t,`alias ${a} wrong`);
  const ccBefore=newTabs.length; N.openFeature('acciones'); must(newTabs.length===ccBefore,'Command Center alias opened a tab instead of palette');

  // Render routes and verify every generated button/data action received an event handler.
  for(const r of routes){
    const rootEl=new FakeRoot();
    try{await Promise.resolve(N.PG[r](rootEl));}catch(e){throw new Error(`render route ${r} failed: ${e?.message||e}`);}
    const buttons=rootEl.children.filter(e=>e.tagName==='BUTTON');
    for(const b of buttons){ if(b.id||Object.keys(b.dataset).length) must(typeof b.onclick==='function'||typeof rootEl.events.click==='function',`unbound button on ${r}: ${b.id||Object.keys(b.dataset).join(',')}`); }
    const inputs=rootEl.children.filter(e=>['INPUT','SELECT'].includes(e.tagName)&&e.id);
    for(const x of inputs){ if(x.id==='nx-bak-in') must(typeof x.onchange==='function',`backup import handler missing on ${r}`); }
  }

  ctx.cur=makeTab('https://example.com'); ctx.tabs=[ctx.cur];
  // Exercise every Command Center action in the mock runtime.
  const actions=N.ACTIONS(); must(Array.isArray(actions)&&actions.length>=25,`too few actions: ${actions.length}`);
  for(const [label,fn] of actions){must(typeof fn==='function',`bad action ${label}`);try{await Promise.resolve(fn());}catch(e){throw new Error(`Command Center action failed: ${label}: ${e?.message||e}`);}}

  // Exercise representative real interactions.
  const colRoot=new FakeRoot();N.PG.collections(colRoot);colRoot.querySelector('#nx-col-name').value='Test';colRoot.querySelector('#nx-col-create').onclick();must(S.novaNext.collections.some(x=>x.name==='Test'),'collection create failed');
  const readRoot=new FakeRoot();N.PG.reading(readRoot);readRoot.querySelector('#nx-r-save').onclick();must(S.novaNext.reading.length>0,'reading list save failed');
  const appRoot=new FakeRoot();N.PG.apps(appRoot);appRoot.querySelector('#nx-app-url').value='https://example.com';appRoot.querySelector('#nx-app-name').value='Example';appRoot.querySelector('#nx-app-add').onclick();must(S.novaNext.apps.length>0,'web app add failed');
  const writerRoot=new FakeRoot();N.PG.writer(writerRoot);must(typeof writerRoot.querySelector('#nx-docx').onclick==='function','writer DOCX handler missing');await writerRoot.querySelector('#nx-docx').onclick();must(ipcCalls.some(x=>x[0]==='save-docx'),'writer DOCX IPC not called');
  const perfRoot=new FakeRoot();await N.PG.rendimiento2(perfRoot);must(perfRoot.innerHTML.includes('2048 MB')&&perfRoot.innerHTML.includes('123'),'performance fields not mapped to real IPC response');
  const qrRoot=new FakeRoot();N.PG.qr(qrRoot);must(qrRoot.innerHTML.includes('api.qrserver.com'),'QR route did not render');

  // DOCX ZIP smoke: validate actual package structure, not only signature.
  const a=mainSrc.indexOf('function crc32(buf)');const b=mainSrc.indexOf("ipcMain.handle('save-docx'",a);must(a>=0&&b>a,'DOCX functions missing');
  const box={module:{exports:{}},exports:{},require,Buffer};vm.runInNewContext(mainSrc.slice(a,b)+';module.exports={crc32,zipDocx};',box);
  const z=box.module.exports.zipDocx([['[Content_Types].xml','<Types></Types>'],['_rels/.rels','<Relationships></Relationships>'],['word/document.xml','<w:document></w:document>']]);
  const tmp=path.join(root,'tmp-smoke.docx');fs.writeFileSync(tmp,z);must(z.readUInt32LE(0)===0x04034b50,'DOCX ZIP header invalid');const py=cp.spawnSync('python',['-c',`import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); print(','.join(sorted(z.namelist()))); z.testzip() is None or (_ for _ in ()).throw(Exception('bad zip'))`,tmp],{encoding:'utf8'});must(py.status===0,`DOCX zipfile validation failed: ${py.stderr||py.stdout}`);fs.unlinkSync(tmp);

  // Assets/docs and CI/installer sanity.
  const releaseDir=path.join(root,'assets','release','2.5');for(const f of ['onboarding.svg','safari.svg','islands.svg','focus.svg','reader.svg','collections.svg','capture.svg','writer.svg','docs.svg','study.svg','privacy.svg','performance.svg','downloads.svg','apps.svg','improvements.svg'])must(fs.existsSync(path.join(releaseDir,f)),`missing release asset ${f}`);
  for(const f of ['RELEASE_NOTES_3.0.0.md','TUTORIAL-NOVA-3.0.0.md','README.md','CHANGELOG.md','SECURITY.md'])must(fs.existsSync(path.join(root,f)),`missing project doc ${f}`);
  const installer=fs.readFileSync(path.join(root,'build/installer.nsh'),'utf8');must(installer.includes('Nova Browser 3.0.0'),'installer branding mismatch');
  const rel=fs.readFileSync(path.join(root,'.github/workflows/release.yml'),'utf8');must(rel.includes("'v*.*.*'"),'release workflow not tag gated');
  const build=fs.readFileSync(path.join(root,'.github/workflows/build.yml'),'utf8');must(!build.includes('softprops/action-gh-release'),'build workflow unexpectedly publishes releases');

  console.log(`Nova 3.0 deep smoke OK · ${jsFiles.length} JS files · ${routes.length} routes rendered + controls wired · ${actions.length} Command Center actions exercised · DOCX package valid`);
}
main().catch(e=>{console.error(e?.stack||e);process.exitCode=1});
