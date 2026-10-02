#!/usr/bin/env node
'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const SHELL = path.join(ROOT, 'shell');
const SCRIPT_FILES = [
  'extras.js','extras2.js','extras3.js','extras4.js','extras5.js','extras6.js',
  'extras7.js','extras8.js','extras9.js','extras10.js','extras11.js','extras12.js',
  'supercat.js','nova25.js','hotfix254.js','nova30.js','nova31.js','nova40.js'
];

const calls = [];
const errors = [];
const timers = [];
let currentDocument = null;
let nextId = 1;

class ClassList {
  constructor() { this.s = new Set(); }
  add(...xs) { xs.forEach(x => x && this.s.add(String(x))); }
  remove(...xs) { xs.forEach(x => this.s.delete(String(x))); }
  contains(x) { return this.s.has(String(x)); }
  toggle(x, force) {
    if (force === undefined) force = !this.contains(x);
    if (force) this.add(x); else this.remove(x);
    return force;
  }
}

function textFromHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/g,' ')
    .replace(/&amp;/g,'&')
    .replace(/\s+/g,' ')
    .trim();
}

class El {
  constructor(tag='div', ownerDocument=currentDocument) {
    this.ownerDocument = ownerDocument;
    this.nodeType = 1;
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.childNodes = this.children;
    this.parentNode = null;
    this.style = {cssText:'',setProperty(){},removeProperty(){}};
    this.classList = new ClassList();
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.isConnected = true;
    this.scrollTop = 0;
    this.scrollHeight = 1000;
    this.files = [];
    this._html = '';
    this._text = '';
    this._innerText = '';
    this._nodes = new Map();
    this._uid = nextId++;
    if (this.ownerDocument?.register) this.ownerDocument.register(this);
    Object.defineProperty(this, 'id', {
      configurable:true,
      get:()=>this._id || '',
      set:v=>{
        this._id = String(v || '');
        if(this.ownerDocument?.register && this._id) this.ownerDocument.register(this);
      }
    });
  }
  set textContent(v){ this._text=String(v ?? ''); this._innerText=this._text; }
  get textContent(){ return this._text || textFromHtml(this._html); }
  set innerText(v){ this._innerText=String(v ?? ''); this._text=this._innerText; }
  get innerText(){ return this._innerText || this.textContent; }
  set innerHTML(v){
    this._html=String(v ?? '');
    this._text=textFromHtml(this._html);
    this._innerText=this._text;
    this.children=[];
    this._nodes=new Map();
    const rx=/<([a-zA-Z0-9-]+)\b([^>]*)>/g;
    let m;
    while((m=rx.exec(this._html))){
      const tag=m[1], attrs=m[2]||'';
      if(tag.startsWith('/')) continue;
      const node=new El(tag,this.ownerDocument);
      const idm=attrs.match(/\bid=["']([^"']+)["']/i); if(idm) node.id=idm[1];
      const cm=attrs.match(/\bclass=["']([^"']+)["']/i); if(cm) cm[1].split(/\s+/).forEach(x=>x&&node.classList.add(x));
      const dm=/\bdata-([\w-]+)=["']([^"']*)["']/gi; let d;
      while((d=dm.exec(attrs))){ const k=d[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase()); node.dataset[k]=d[2]; node.attributes['data-'+d[1]]=d[2]; }
      const vm=attrs.match(/\bvalue=["']([^"']*)["']/i); if(vm) node.value=vm[1];
      this.appendChild(node);
    }
  }
  get innerHTML(){ return this._html; }
  appendChild(e){ if(!e) return e; if(e.parentNode) e.parentNode.removeChild?.(e); e.parentNode=this; e.isConnected=true; this.children.push(e); if(e.ownerDocument?.register)e.ownerDocument.register(e); return e; }
  append(...xs){ xs.forEach(x=>typeof x==='string'?this._html+=x:this.appendChild(x)); }
  prepend(e){ if(!e)return; if(e.parentNode)e.parentNode.removeChild?.(e); e.parentNode=this; e.isConnected=true; this.children.unshift(e); }
  insertBefore(e,ref){
    if(!e)return e;
    if(e.parentNode)e.parentNode.removeChild?.(e);
    e.parentNode=this; e.isConnected=true;
    const i=this.children.indexOf(ref);
    if(i<0)this.children.push(e);else this.children.splice(i,0,e);
    return e;
  }
  removeChild(e){ const i=this.children.indexOf(e); if(i>=0)this.children.splice(i,1); if(e)e.parentNode=null; return e; }
  remove(){ this.isConnected=false; if(this.parentNode)this.parentNode.removeChild(this); this.ownerDocument?.unregister?.(this); }
  replaceChildren(...xs){ this.children.slice().forEach(c=>this.removeChild(c)); xs.forEach(x=>this.appendChild(x)); }
  after(e){ if(this.parentNode)this.parentNode.insertBefore(e,this.nextSibling||null); }
  before(e){ if(this.parentNode)this.parentNode.insertBefore(e,this); }
  get nextSibling(){ if(!this.parentNode)return null; const a=this.parentNode.children,i=a.indexOf(this); return i>=0?a[i+1]||null:null; }
  get lastElementChild(){ return this.children[this.children.length-1]||null; }
  get firstElementChild(){ return this.children[0]||null; }
  insertAdjacentHTML(pos,html){ const chunk=String(html||''); this._html += chunk; const rx=/<([a-zA-Z0-9-]+)\b([^>]*)>/g; let m; while((m=rx.exec(chunk))){ const tag=m[1], attrs=m[2]||''; if(tag.startsWith('/')) continue; const node=new El(tag,this.ownerDocument); const idm=attrs.match(/\bid=[\"']([^\"']+)[\"']/i); if(idm) node.id=idm[1]; const cm=attrs.match(/\bclass=[\"']([^\"']+)[\"']/i); if(cm) cm[1].split(/\s+/).forEach(x=>x&&node.classList.add(x)); const dm=/\bdata-([\w-]+)(?:=[\"']([^\"']*)[\"'])?/gi; let d; while((d=dm.exec(attrs))){const k=d[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase());node.dataset[k]=d[2]??'';node.attributes['data-'+d[1]]=d[2]??'';} this.appendChild(node); } }
  setAttribute(k,v){ this.attributes[k]=String(v); if(k==='id')this.id=v; if(k==='class')String(v).split(/\s+/).forEach(x=>x&&this.classList.add(x)); if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(v); }
  getAttribute(k){ return this.attributes[k] ?? null; }
  addEventListener(k,fn){ (this.listeners[k]??=[]).push(fn); }
  removeEventListener(k,fn){ this.listeners[k]=(this.listeners[k]||[]).filter(x=>x!==fn); }
  dispatchEvent(e){ for(const fn of this.listeners[e.type]||[]) fn({type:e.type,target:this,...e}); return true; }
  click(){ if(typeof this.onclick==='function') return this.onclick({target:this,currentTarget:this,button:0,preventDefault(){},stopPropagation(){}}); }
  focus(){} blur(){} select(){}
  getBoundingClientRect(){return {left:10,top:10,right:250,bottom:45,width:240,height:35};}
  closest(sel){
    if(!sel)return null;
    if(sel==='#'+this.id && this.id)return this;
    if(sel.includes('.tab') && this.classList.contains('tab'))return this;
    if(sel.startsWith('button') && this.tagName==='BUTTON')return this;
    if(sel.startsWith('[data-') && Object.keys(this.dataset).length)return this;
    return this.parentNode?.closest?.(sel)||null;
  }
  matches(sel){
    if(sel==='button')return this.tagName==='BUTTON';
    if(sel==='.tab')return this.classList.contains('tab');
    if(sel==='.sw')return this.classList.contains('sw');
    const m=String(sel).match(/^\[data-([\w-]+)(?:=["']?([^\]"']+)["']?)?\]$/); if(m){const k=m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return Object.prototype.hasOwnProperty.call(this.dataset,k)&&(m[2]===undefined||this.dataset[k]===m[2]);}
    return false;
  }
  querySelector(sel){
    if(sel.includes(',')){ for(const s of sel.split(',').map(x=>x.trim())){const n=this.querySelector(s);if(n)return n;} return null; }
    if(sel.startsWith('#')){
      const id=sel.slice(1).split(/\s+/)[0];
      if(this._nodes.has(id))return this._nodes.get(id);
      const n=this.ownerDocument?.getElementById?.(id); if(n && (n===this || n.parentNode===this || this===n.parentNode))return n;
      const c=new El('div',this.ownerDocument); c.id=id; c.parentNode=this; this._nodes.set(id,c); return c;
    }
    if(sel==='span' || sel==='h1' || sel==='h2' || sel==='h3' || sel==='article'){
      const existing=this.children.find(c=>c.tagName===sel.toUpperCase()); if(existing)return existing;
      const c=new El(sel,this.ownerDocument); c.parentNode=this;
      if(sel==='h1')c.innerText='QA Documento'; else if(sel==='span')c.textContent=this.textContent.slice(0,80) || 'Pestaña';
      this._nodes.set(sel,c); return c;
    }
    if(sel.includes('[data-')){
      const m=sel.match(/\[data-([\w-]+)(?:=["']([^"']+)["'])?\]/); if(m){const k=m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase()); const arr=this.querySelectorAll(`[data-${m[1]}]`); return arr.find(x=>m[2]===undefined||x.dataset[k]===m[2])||null;}
    }
    if(sel==='.sw'){ return this.children.find(c=>c.classList.contains('sw')) || new El('div',this.ownerDocument); }
    if(sel.startsWith('nav ')) return this.querySelector(sel.slice(4));
    if(sel==='input,select') return this.querySelector('input')||this.querySelector('select');
    const n=new El('div',this.ownerDocument); n.parentNode=this; return n;
  }
  querySelectorAll(sel){
    const all=[]; const visit=n=>{for(const c of n.children){ if(c.matches(sel))all.push(c); visit(c);} }; visit(this);
    if(all.length)return all;
    if(sel.includes(',')) return sel.split(',').flatMap(s=>this.querySelectorAll(s.trim()));
    const dm=sel.match(/^\[data-([\w-]+)\]$/); if(dm){return this.children.filter(c=>c.dataset[dm[1].replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]!==undefined)}
    return [];
  }
}

class Doc extends El {
  constructor(){ super('document',null); this.ownerDocument=this; this.map=new Map(); this.body=new El('body',this); this.head=new El('head',this); this.documentElement=new El('html',this); this.appendChild(this.documentElement); this.documentElement.appendChild(this.head); this.documentElement.appendChild(this.body); this.listeners={}; }
  register(el){ if(el?.id)this.map.set(el.id,el); }
  unregister(el){ if(el?.id&&this.map.get(el.id)===el)this.map.delete(el.id); }
  createElement(tag){ return String(tag).toLowerCase()==='webview'?new WV(this):new El(tag,this); }
  getElementById(id){ return this.map.get(id)||null; }
  querySelector(sel){
    if(sel.startsWith('#')){ const id=sel.slice(1).split(/\s+/)[0]; const n=this.getElementById(id); if(n)return n; }
    if(sel==='#tabs .tab.on')return this.getElementById('tabs')?.children.find(c=>c.classList.contains('tab')&&c.classList.contains('on'))||null;
    if(sel==='.upd')return null;
    return this.body.querySelector(sel);
  }
  querySelectorAll(sel){
    const out=[]; const seen=new Set(); const walk=n=>{for(const c of n.children){if(!seen.has(c)&&c.matches(sel)){out.push(c);seen.add(c)} walk(c)}}; walk(this.documentElement); return out;
  }
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}
  dispatchEvent(e){for(const fn of this.listeners[e.type]||[])fn(e);}
  createRange(){return {createContextualFragment:()=>new El('div',this)}};
  execCommand(){return true;}
}

class WV extends El {
  constructor(doc){ super('webview',doc); this.tagName='WEBVIEW'; this._url='about:blank'; this._zoom=1; this._muted=false; }
  set src(v){ this._url=String(v||'about:blank'); this._src=this._url; }
  get src(){return this._src||this._url;}
  getURL(){return this._url;}
  async loadURL(u){ this._url=String(u); this._src=this._url; this.dispatchEvent({type:'did-navigate',url:this._url}); return true; }
  reload(){}
  reloadIgnoringCache(){}
  stop(){}
  canGoBack(){return false} canGoForward(){return false} goBack(){} goForward(){}
  setZoomFactor(v){this._zoom=v} getZoomFactor(){return this._zoom}
  setZoomLevel(v){this._zoom=v} getZoomLevel(){return this._zoom}
  setAudioMuted(v){this._muted=!!v} isAudioMuted(){return this._muted}
  isDevToolsOpened(){return false} openDevTools(){} closeDevTools(){}
  findInPage(){} stopFindInPage(){}
  async capturePage(){return {toPNG:()=>Buffer.from([137,80,78,71,13,10,26,10])};}
  async executeJavaScript(code){
    code=String(code);
    calls.push({kind:'webview-js',code});
    if(code.includes('document.body.innerText'))return 'QA page body text for Nova';
    if(code.includes('getSelection().toString'))return 'QA selected text';
    if(code.includes('requestPictureInPicture'))return true;
    if(code.includes('exitPictureInPicture'))return true;
    return true;
  }
}

const document = new Doc();
currentDocument=document;
const baseIds=['tabs','view','side','panel','pin','addr','nt','st','sh','find','fi','fx','brand','mid','top','bar','mnp'];
for(const id of baseIds){const tag=id==='nt'?'button':'div'; const e=new El(tag,document); e.id=id; document.body.appendChild(e);}
const nt=document.getElementById('nt'); nt.classList.add('ib');
const addr=document.getElementById('addr'); addr.value='';
const fi=new El('input',document); fi.id='fi'; document.getElementById('find').appendChild(fi);

const localStorage={nova:JSON.stringify({theme:'air',anim:false,restore:false,newTabLinks:false,marks:[],closed:[],groups:{},convs:[],nova25:{},novaNext:{}}),
  getItem(k){return this[k]??null},setItem(k,v){this[k]=String(v)},removeItem(k){delete this[k]},clear(){for(const k of Object.keys(this))delete this[k]}}
const sessionStorage={};

const electron={
  ipcRenderer:{
    sendSync:(ch,arg)=>{calls.push({kind:'sendSync',ch,arg}); if(ch==='userdata')return '/tmp/nova-qa'; if(ch==='app-version')return '3.1.0'; if(ch==='prefs-get')return '{}'; return null;},
    send:(ch,arg)=>{calls.push({kind:'send',ch,arg});},
    on:(ch,fn)=>{electron.ipcRenderer.__listeners[ch]??=[];electron.ipcRenderer.__listeners[ch].push(fn);return electron.ipcRenderer},
    once:(ch,fn)=>{electron.ipcRenderer.__listeners[ch]??=[];electron.ipcRenderer.__listeners[ch].push(fn);return electron.ipcRenderer},
    emit:(ch,...args)=>{for(const fn of electron.ipcRenderer.__listeners[ch]||[])fn({},...args)},
    invoke:async(ch,arg)=>{
      calls.push({kind:'invoke',ch,arg});
      switch(ch){
        case 'install-cfg': return {theme:'air',adblock:true};
        case 'key-has': return false;
        case 'key-set': return true;
        case 'supercat-key-has': return false;
        case 'supercat-key-set': return true;
        case 'performance-info': return {ok:true,main:{pid:777,rssKB:102400},system:{platform:'linux',arch:'x64'},tabs:[]};
        case 'performance-mode': return true;
        case 'performance-cache': return true;
        case 'security-state': return {ok:true,adblock:true,nodeIntegration:true,contextIsolation:false};
        case 'account-status': return {loggedIn:false,id:''};
        case 'account-sync': return true;
        case 'state-load': return '';
        case 'state-save': return true;
        case 'save-shot': return '/tmp/nova-qa-shot.png';
        case 'save-docx': return '/tmp/nova-qa.docx';
        case 'save-text': return '/tmp/nova-qa.txt';
        case 'open-downloads-folder': return true;
        case 'ai-ask': return {text:'Respuesta QA de Nova IA',src:'free'};
        case 'clear': return true;
        case 'update-check': return {ok:true,newer:false,current:'3.1.0',latest:'3.1.0',url:''};
        case 'launch-web-app': return true;
        case 'show-in-folder': return true;
        default: return true;
      }
    },
    __listeners:{}
  },
  shell:{openPath:async()=>'',showItemInFolder(){},openExternal:async()=>{}},
  clipboard:{writeImage(){},writeText(){}},
};

const context={
  console,document,window:null,self:null,globalThis:null,
  localStorage,sessionStorage,
  navigator:{onLine:true,clipboard:{writeText:async()=>{}},userAgent:'Nova QA'},
  location:{href:'file:///tmp/nova/shell/index.html',origin:'file://',reload(){}},
  history:{replaceState(){}},
  process:{platform:'linux',versions:{chrome:'144.0.0',electron:'44.4.5',node:'22.16.0'}},
  innerWidth:1440,innerHeight:900,outerWidth:1440,outerHeight:900,
  screen:{availWidth:1440,availHeight:900},
  matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
  requestAnimationFrame:fn=>{fn?.();return 1},cancelAnimationFrame(){},
  setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length},clearTimeout(){},
  setInterval:()=>1,clearInterval(){},
  addEventListener(){},removeEventListener(){},
  alert(){},confirm:()=>true,prompt:()=>null,
  Event:class{constructor(type,opts={}){this.type=type;Object.assign(this,opts)}},
  MouseEvent:class{constructor(type,opts={}){this.type=type;Object.assign(this,opts)}},
  KeyboardEvent:class{constructor(type,opts={}){this.type=type;Object.assign(this,opts)}},
  CustomEvent:class extends Event{},
  MutationObserver:class{observe(){}disconnect(){}},ResizeObserver:class{observe(){}disconnect(){}},
  DOMParser:class{parseFromString(html){const e=new El('div',document);e.innerHTML=String(html);return e}},
  FileReader:class{readAsText(file){if(this.onload)this.onload({target:{result:file?.text||''}})}},
  Blob:class{constructor(a,b){this.parts=a;this.type=b?.type||''}},FormData:class{},
  SpeechSynthesisUtterance:class{},speechSynthesis:{cancel(){},speak(){},getVoices(){return[]}},
  AudioContext:class{createAnalyser(){return {fftSize:0,frequencyBinCount:0,getByteFrequencyData(){}}}},
  fetch:async()=>({ok:true,json:async()=>({})}),
  crypto:{randomUUID:()=>`qa-${Date.now()}`},
  URL,URLSearchParams,Buffer,require:null,ipc:null,__dirname:SHELL,__filename:path.join(SHELL,'index.html'),
};
context.window=context;context.self=context;context.globalThis=context;
context.require=(name)=>{
  if(name==='electron')return electron;
  if(String(name).endsWith('extensions.js')) return require(path.join(SHELL,'extensions.js'));
  if(name==='fs')return {readdirSync:()=>[],mkdirSync(){},writeFileSync(){},existsSync:()=>false,readFileSync:()=>Buffer.from(''),unlinkSync(){},rmSync(){},copyFileSync(){}};
  if(name==='path')return {join:(...a)=>a.join('/'),dirname:x=>String(x).split('/').slice(0,-1).join('/')||'/',basename:x=>String(x).split('/').pop(),extname:x=>{const b=String(x).split('/').pop();const i=b.lastIndexOf('.');return i>=0?b.slice(i):''},resolve:x=>String(x)};
  if(name==='url')return {pathToFileURL:x=>new URL('file:///tmp/nova')};
  if(name==='os')return {homedir:()=>'/tmp',platform:()=> 'linux',arch:()=> 'x64'};
  if(name==='crypto')return {randomBytes:n=>({toString:()=> 'a'.repeat(n*2)}),randomUUID:()=>`qa-${Date.now()}`};
  if(name==='zlib')return {deflateRawSync:b=>b};
  return {};
};
context.ipc=electron.ipcRenderer;

const ctx=vm.createContext(context);
const html=fs.readFileSync(path.join(SHELL,'index.html'),'utf8');
const inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
function run(name,code){try{vm.runInContext(code,ctx,{filename:name});}catch(e){errors.push({stage:name,name:e.name,message:e.message,stack:e.stack});}}

inline.forEach((code,i)=>run(`index-inline-${i}`,code));
SCRIPT_FILES.forEach(f=>run(`shell/${f}`,fs.readFileSync(path.join(SHELL,f),'utf8')));

// Execute only short startup timers; skip the 1s session restore timer in this smoke runtime.
for(const t of timers.splice(0)) if(t.ms < 100){try{t.fn()}catch(e){errors.push({stage:'timer',name:e.name,message:e.message,stack:e.stack})}}

function troot(){ return new El('div',document); }
async function click(el){ assert(el && typeof el.onclick==='function','control has no click handler'); return await Promise.resolve(el.onclick({target:el,currentTarget:el,preventDefault(){},stopPropagation(){}})); }
async function render(name){ const r=troot(); const out=ctx.NOVA.PG[name](r); await Promise.resolve(out); return r; }
function ok(cond,msg){if(!cond)throw new Error(msg)}
function flushTimers(maxMs=500){ const due=timers.splice(0).filter(t=>t.ms<=maxMs); for(const t of due){ try{ t.fn(); }catch(e){ errors.push({stage:'timer',name:e.name,message:e.message,stack:e.stack}); } } }

const results=[];
async function test(name,fn){try{await fn();results.push({name,ok:true})}catch(e){results.push({name,ok:false,error:String(e.stack||e)});}}

(async()=>{
  await test('startup-no-errors',()=>ok(errors.length===0,errors.map(x=>x.stage+': '+x.name+': '+x.message).join('\n')));
  await test('nova-exports',()=>{ok(!!ctx.NOVA,'NOVA missing');ok(typeof ctx.NOVA.dlg==='function','dlg missing');ok(typeof ctx.NOVA.ctx==='function','ctx missing');ok(typeof ctx.NOVA.reopen==='function','reopen missing');ok(typeof ctx.NOVA.toggleAI==='function','toggleAI missing');ok(typeof ctx.NOVA.askAI==='function','askAI missing');ok(typeof ctx.NOVA.palette==='function','palette missing')});
  await test('routes-50',()=>ok(Object.keys(ctx.NOVA.PG).length>=50,'PG='+Object.keys(ctx.NOVA.PG).length));
  await test('aliases',()=>{
    const expected={settings:'ajustes',preferences:'ajustes',history:'historial',downloads:'descargas2',notes:'notas',bookmarks:'marcadores',privacy:'privacidad2',performance:'rendimiento2',feedback:'mejoras',news:'novedades',welcome:'bienvenida',capture:'capture'};
    for(const [a,b] of Object.entries(expected))ok(ctx.NOVA.resolveFeatureRoute(a)===b,`${a} -> ${ctx.NOVA.resolveFeatureRoute(a)} (expected ${b})`);
    ok(ctx.NOVA.resolveFeatureRoute('does-not-exist')==='does-not-exist','unknown alias should remain unknown');
  });
  await test('all-routes-render',async()=>{for(const n of Object.keys(ctx.NOVA.PG)){await render(n)}});

  let web;
  await test('tab-create-and-plus',async()=>{
    web=ctx.NOVA.newTab('https://example.com/login');
    ok(web?.wv?.tagName==='WEBVIEW','web tab missing');
    await web.wv.loadURL('https://example.com/login');
    const tabsEl=document.getElementById('tabs');
    ok(tabsEl.lastElementChild===document.getElementById('nt'),'tab + is not at end');
    const w2=ctx.NOVA.newTab('https://example.com/next');
    await w2.wv.loadURL('https://example.com/next');
    ok(tabsEl.lastElementChild===document.getElementById('nt'),'tab + moved incorrectly');
  });
  await test('active-web-survives-internal-tab',async()=>{
    ctx.NOVA.internalTab('nova://historial');
    ok(ctx.NOVA.activeWebTab()===web || !!ctx.NOVA.activeWebTab(),'active web tab lost');
  });
  await test('link-handler-injected',async()=>{
    const before=calls.filter(x=>x.kind==='webview-js'&&x.code.includes('__novaLinkMode')).length;
    web.wv.dispatchEvent({type:'dom-ready'});
    const after=calls.filter(x=>x.kind==='webview-js'&&x.code.includes('__novaLinkMode')).length;
    ok(after>before,'link handling script was not injected');
  });
  await test('capture-active-web',async()=>{
    const r=await render('capture'); await click(r.querySelector('#cp25')); ok(calls.some(x=>x.kind==='invoke'&&x.ch==='save-shot'),'save-shot not invoked')
  });
  await test('reader-active-web',async()=>{const r=await render('reader');await click(r.querySelector('#nx-reader-apply'));ok(calls.some(x=>x.kind==='webview-js'&&x.code.includes('__nova30_reader')),'Reader script not executed')});
  await test('collections-save',async()=>{const r=await render('collections');await click(r.querySelector('#nx-col-save'));ok(vm.runInContext('(S.novaNext.collections||[])',ctx).some(c=>(c.items||[]).some(i=>i.url==='https://example.com/next')),'collection did not save active page')});
  await test('session-save',async()=>{ctx.NOVA.saveSession();ok(Array.isArray(vm.runInContext('S.session',ctx))&&vm.runInContext('S.session',ctx).length>=1,'session list not saved');flushTimers(400);ok(calls.some(x=>x.kind==='invoke'&&x.ch==='state-save'),'state-save not invoked')});
  await test('island-create',async()=>{const id=await ctx.NOVA.createIsland(web);ok(id&&vm.runInContext('S.groups',ctx)[id],'Island not stored');ok(web.g===id,'web tab not assigned to island')});
  await test('safari-toggle',()=>{ctx.NOVA.applySafari(true);ok(vm.runInContext("S.theme==='safari'&&S.novaNext.safari",ctx),'Safari not enabled');ctx.NOVA.applySafari(false);ok(vm.runInContext("S.theme==='air'&&!S.novaNext.safari",ctx),'Safari did not restore')});
  await test('ai-key-and-message',async()=>{await ctx.NOVA.setKey('sk-test');ctx.NOVA.openAI();const r=await Promise.resolve(ctx.NOVA.aiSend('hola'));await Promise.resolve(r);ok(calls.some(x=>x.kind==='invoke'&&x.ch==='ai-ask'),'ai-ask not invoked');ok(vm.runInContext('S.convs||[]',ctx).some(c=>(c.msgs||[]).some(m=>m.role==='assistant'&&m.content.includes('Respuesta QA'))),'AI response not stored')});
  await test('ai-new-conversation',()=>{const before=vm.runInContext('S.convs.length',ctx);const id=ctx.NOVA.aiNew();ok(id!=null,'aiNew did not return id');ok(vm.runInContext('S.convs.length',ctx)===before+1,'aiNew did not add conversation')});
  await test('feature-routing',()=>{const before=vm.runInContext('tabs.length',ctx);const t=ctx.NOVA.openFeature('nova://settings');ok(t&&vm.runInContext('tabs.length',ctx)>before,'settings route did not open a tab');ok(t.wv.getURL()==='nova://ajustes','settings route opened wrong URL');const bad=ctx.NOVA.openFeature('nova://not-a-real-page');ok(bad===null,'unknown route should return null')});
  await test('command-center',()=>{ctx.NOVA.palette();ok(document.getElementById('nova30-cmd'),'Command Center not created');document.getElementById('nova30-cmd').remove()});
  await test('writer-docx',async()=>{const r=await render('writer');const ed=r.querySelector('#nx-ed');ed.innerHTML='<h1>QA Documento</h1><p>Contenido de prueba</p>';await click(r.querySelector('#nx-docx'));await new Promise(q=>setTimeout(q,0));const c=calls.findLast?.(x=>x.kind==='invoke'&&x.ch==='save-docx')||calls.filter(x=>x.kind==='invoke'&&x.ch==='save-docx').at(-1);ok(c,'save-docx not invoked');ok(typeof c.arg?.documentXml==='string'&&c.arg.documentXml.includes('<w:document'),'DOCX XML payload invalid')});
  await test('performance',async()=>{const r=await render('rendimiento2');ok(r.textContent.includes('Centro de rendimiento'),'performance did not render');await click(r.querySelector('#nx-smart'));ok(calls.some(x=>x.kind==='invoke'&&x.ch==='performance-mode'),'performance-mode not invoked')});
  await test('downloads-folder',async()=>{const r=await render('descargas2');await click(r.querySelector('#nx-dl-folder'));ok(calls.some(x=>x.kind==='invoke'&&x.ch==='open-downloads-folder'),'open-downloads-folder not invoked')});
  await test('backup-export',async()=>{const r=await render('backup');await click(r.querySelector('#nx-bak-out'));ok(calls.some(x=>x.kind==='invoke'&&x.ch==='save-text'),'backup export not invoked')});
  await test('supercat-loaded',()=>{ok(!!ctx.NovaSuperCat,'NovaSuperCat API missing');ok(!!document.getElementById('supercat-root'),'Super Cat root missing')});
  await test('action-callbacks',()=>{const acts=ctx.NOVA.ACTIONS?.()||[];ok(acts.length>=30,'actions='+acts.length);for(const [label,fn] of acts)ok(typeof fn==='function',`no callback: ${label}`)});
  await test('nova31-routes',()=>{const names=['nova31','quick','pinboard','memory31','smarttabs','search31','preview31','sitethemes','notifications31','automations','mini31','sendbox','snapshots','daily','permissions31','cleanup31'];for(const n of names)ok(typeof ctx.NOVA.PG[n]==='function','missing route '+n)});
  await test('nova31-render',async()=>{for(const n of ['nova31','quick','pinboard','memory31','smarttabs','search31','preview31','sitethemes','notifications31','automations','mini31','sendbox','snapshots','daily','permissions31','cleanup31'])await render(n)});
  await test('nova31-storage',()=>{const x=vm.runInContext('S.nova31',ctx);ok(x&&Array.isArray(x.memory)&&Array.isArray(x.pinboard)&&Array.isArray(x.snapshots)&&Array.isArray(x.sendbox),'nova31 storage missing');});
  await test('nova31-actions',async()=>{const r=await render('pinboard');await click(r.querySelector('#pb-page'));ok(vm.runInContext('S.nova31.pinboard.length',ctx)>=1,'pinboard did not add page');const s=await render('sendbox');await click(s.querySelector('#send-page'));ok(vm.runInContext('S.nova31.sendbox.length',ctx)>=1,'sendbox did not add page');});
  await test('nova31-search-data',async()=>{const r=await render('search31');r.querySelector('#n31-q').value='example.com';r.querySelector('#n31-q').oninput();ok(r.querySelector('#n31-results').textContent.includes('example.com')||r.querySelector('#n31-results').innerHTML.includes('example.com'),'search did not find existing tab');});
  await test('nova31-open-feature',()=>{const t=ctx.NOVA.openFeature('nova://nova31');ok(t,'nova31 openFeature did not return tab');ok(t.wv.getURL()==='nova://nova31','wrong nova31 URL')});
  await test('nova31-action-registered',()=>{ok((ctx.NOVA.extraActs||[]).some(a=>a[0]==='Nova 3.1 · Nuevas cosas'),'new feature launcher not registered')});

  await test('nova40-routes',()=>{const names=['novaUltimate','novaLauncher','pagebrain','talkpage','research40','vault40','timeline40','continue40','webpowers40','visual40','translate40','workspaces40','islands40','spaces40','studio40','flows40','extensions40','companion40','sync40','desktop40'];for(const n of names)ok(typeof ctx.NOVA.PG[n]==='function','missing route '+n)});
  await test('nova40-render',async()=>{for(const n of ['novaUltimate','novaLauncher','pagebrain','talkpage','research40','vault40','timeline40','continue40','webpowers40','visual40','translate40','workspaces40','islands40','spaces40','studio40','flows40','extensions40','companion40','sync40','desktop40'])await render(n)});
  await test('nova40-storage',()=>{const x=vm.runInContext('S.nova40',ctx);ok(x&&Array.isArray(x.vault)&&Array.isArray(x.timeline)&&Array.isArray(x.sessions)&&Array.isArray(x.flows)&&Array.isArray(x.workspaces)&&Array.isArray(x.islands)&&Array.isArray(x.extensions),'nova40 storage missing')});
  await test('nova40-launcher',()=>{ctx.Nova40.launcher();ok(document.getElementById('nova40-launcher'),'launcher overlay missing');ok(document.getElementById('nova40-launcher').querySelector('#n40-q'),'launcher input missing');document.getElementById('nova40-launcher').remove()});
  await test('nova40-hub-actions',async()=>{const r=await render('novaUltimate');ok(r.querySelector('#n40-launch'),'hub launch missing');ok(typeof r.querySelector('#n40-launch').onclick==='function','hub launch not wired');const b=r.querySelector('[data-route]');ok(b,'hub route action missing');ok(typeof b.onclick==='function','hub route action not wired')});
  await test('nova40-vault-action',async()=>{const r=await render('vault40');await click(r.querySelector('#vault-page'));ok(vm.runInContext('S.nova40.vault.length',ctx)>=1,'vault did not add page')});
  await test('nova40-session-action',async()=>{const r=await render('continue40');await click(r.querySelector('#cont-save'));ok(vm.runInContext('S.nova40.sessions.length',ctx)>=1,'session was not saved')});
  await test('nova40-studio-action',async()=>{const r=await render('studio40');r.querySelector('#st-color').value='#123456';r.querySelector('#st-radius').value='22';await click(r.querySelector('#st-apply'));ok(vm.runInContext("S.nova40.customStudio.accent",ctx)==='#123456','studio accent not stored')});
  await test('nova40-flow-create',async()=>{const r=await render('flows40');const oldPrompt=ctx.prompt;let i=0;const vals=['example.com','QA Flow','pin | island:QA'];ctx.prompt=()=>vals[i++%vals.length];await click(r.querySelector('#flow-new'));ctx.prompt=oldPrompt;ok(vm.runInContext('S.nova40.flows.length',ctx)>=1,'flow not created')});
  await test('nova40-open-feature',()=>{const before=vm.runInContext('tabs.length',ctx);const t=ctx.NOVA.openFeature('nova://novaUltimate');ok(t&&vm.runInContext('tabs.length',ctx)>before,'novaUltimate did not open');ok(t.wv.getURL()==='nova://novaUltimate','wrong ultimate URL')});
  await test('nova40-legacy-preserved',()=>{for(const n of ['nova31','quick','pinboard','memory31','smarttabs','search31','preview31','sitethemes','notifications31','automations','mini31','sendbox','snapshots','daily','permissions31','cleanup31'])ok(typeof ctx.NOVA.PG[n]==='function','legacy route disappeared '+n)});
  await test('nova40-action-registered',()=>{ok((ctx.NOVA.extraActs||[]).some(a=>a[0]==='Nova 4.0 · Ultimate'),'ultimate launcher not registered')});


  const failed=results.filter(x=>!x.ok); const summary={passed:results.length-failed.length,failed:failed.length,total:results.length,routeCount:Object.keys(ctx.NOVA.PG).length,startupErrors:errors.length,ipcCalls:calls.length};
  console.log(JSON.stringify({summary,failed,results},null,2));
  process.exitCode=failed.length?1:0;
})();
