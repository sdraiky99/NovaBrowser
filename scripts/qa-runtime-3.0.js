#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const SHELL = path.join(ROOT, 'shell');
const RESULT_FILE = path.join(ROOT, '.qa-runtime-result.json');
try { fs.unlinkSync(RESULT_FILE); } catch {}

const mock = `(() => {
  const calls = []; const listeners = {};
  window.__novaQACalls = calls; window.__novaQALastError = ''; try{fetch('/__qa-start')}catch{}
  const record = (kind, ch, arg) => calls.push({kind, ch, arg});
  window.require = (name) => {
    if (name === 'electron') {
      const invoke = async (ch, arg) => {
        record('invoke', ch, arg);
        if (ch === 'install-cfg') return {theme:'air', adblock:true};
        if (ch === 'key-has' || ch === 'supercat-key-has') return false;
        if (ch === 'key-set' || ch === 'supercat-key-set') return true;
        if (ch === 'performance-info') return {ok:true, main:{pid:123, rssKB:102400}, system:{platform:'linux', arch:'x64'}, tabs:[]};
        if (ch === 'update-check') return {ok:true, newer:false, current:'3.0.0', latest:'3.0.0', url:''};
        if (ch === 'security-state') return {ok:true, adblock:true, nodeIntegration:false, contextIsolation:true};
        if (ch === 'state-load') return '';
        if (ch === 'account-status') return {loggedIn:false,id:''};
        if (ch === 'account-sync') return true;
        if (ch === 'save-docx' || ch === 'save-text' || ch === 'save-shot') return '/tmp/nova-qa-output';
        return true;
      };
      const ipc = {
        sendSync:(ch,arg)=>{record('sendSync',ch,arg); if(ch==='userdata')return '/tmp/nova-qa'; if(ch==='app-version')return '3.0.0'; if(ch==='prefs-get')return '{}'; return null;},
        invoke, send:(ch,arg)=>record('send',ch,arg),
        on:(ch,fn)=>{(listeners[ch]??=[]).push(fn);return ipc;}, once:(ch,fn)=>{(listeners[ch]??=[]).push(fn);return ipc;},
        emit:(ch,...args)=>{for(const fn of listeners[ch]||[])try{fn({},...args)}catch(e){window.__novaQALastError += String(e.stack||e)+'\\n';}}
      };
      return {ipcRenderer:ipc, shell:{openPath:async()=>'', showItemInFolder:()=>{}, openExternal:async()=>{}}, clipboard:{writeImage:()=>{}}};
    }
    if (name === 'fs') return {readdirSync:()=>[], mkdirSync:()=>{}, writeFileSync:()=>{}, existsSync:()=>false, readFileSync:()=>Buffer.from(''), unlinkSync:()=>{}};
    if (name === 'path') return {join:(...x)=>x.join('/'), dirname:x=>String(x).split('/').slice(0,-1).join('/')||'/', basename:x=>String(x).split('/').pop(), extname:x=>{const b=String(x).split('/').pop(),i=b.lastIndexOf('.');return i>=0?b.slice(i):''}};
    if (name === 'url') return {pathToFileURL:()=>new URL(location.origin+'/shell/newtab.html')};
    if (name === 'os') return {homedir:()=>'/tmp/nova-qa', platform:()=> 'linux', arch:()=> 'x64'};
    if (name === 'crypto') return {randomBytes:n=>({toString:()=> 'a'.repeat(n*2)})};
    return {};
  };
  window.process = {platform:'linux', versions:{chrome:'144.0.0', electron:'44.4.5', node:'22.0.0'}};
  window.__dirname = '/tmp/nova/shell';
  window.alert = ()=>{}; window.confirm = ()=>true; window.prompt = ()=>null;
  if (!window.matchMedia) window.matchMedia = ()=>({matches:false, addEventListener:()=>{}, removeEventListener:()=>{}});
  const realCreate = document.createElement.bind(document);
  const makeWV = () => {
    const e = realCreate('div'); e.className = 'mock-webview'; Object.defineProperty(e,'tagName',{value:'WEBVIEW'});
    let u='about:blank', muted=false, zoom=1;
    Object.defineProperty(e,'src',{get:()=>u,set:v=>{u=String(v||''); queueMicrotask(()=>['did-start-loading','dom-ready','did-stop-loading'].forEach(ev=>e.dispatchEvent(new Event(ev))))}});
    e.getURL=()=>u; e.loadURL=async v=>{e.src=v;return true}; e.reload=()=>{}; e.reloadIgnoringCache=()=>{}; e.goBack=()=>{}; e.goForward=()=>{}; e.canGoBack=()=>false; e.canGoForward=()=>false; e.stopFindInPage=()=>{}; e.findInPage=()=>{};
    e.setZoomFactor=v=>{zoom=v}; e.getZoomFactor=()=>zoom; e.isAudioMuted=()=>muted; e.setAudioMuted=v=>{muted=!!v}; e.isDevToolsOpened=()=>false; e.openDevTools=()=>{}; e.closeDevTools=()=>{};
    e.executeJavaScript=async code=> String(code).includes('document.body.innerText') ? document.body.innerText.slice(0,12000) : '';
    e.capturePage=async()=>({toPNG:()=>new Uint8Array([137,80,78,71,13,10,26,10])});
    e.remove=()=>e.parentNode&&e.parentNode.removeChild(e);
    return e;
  };
  document.createElement=(tag,opts)=>String(tag).toLowerCase()==='webview'?makeWV():realCreate(tag,opts);
  window.addEventListener('error', e => { window.__novaQALastError += String(e.error?.stack||e.message)+'\\n'; });
  window.addEventListener('unhandledrejection', e => { window.__novaQALastError += String(e.reason?.stack||e.reason)+'\\n'; });
})();`;
const runner = `(async()=>{ try{await fetch('/__qa-runner-start')}catch{}
  const results=[]; const pass=(n,d)=>results.push({name:n,ok:true,detail:d}); const fail=(n,e)=>results.push({name:n,ok:false,detail:String(e)}); const wait=ms=>new Promise(r=>setTimeout(r,ms));
  await wait(250);
  try { if(window.__novaQALastError) throw new Error(window.__novaQALastError); if(!window.NOVA) throw new Error('NOVA missing'); pass('startup','NOVA disponible y sin errores no capturados'); } catch(e){fail('startup',e)}
  const N=window.NOVA||{};
  const aliases=['historial','history','descargas','downloads','notas','notes','marcadores','bookmarks','ajustes','settings','privacy','privacidad','about','feedback','news','performance'];
  for(const a of aliases){try{const t=N.internalTab?.('nova://'+a);if(!t)throw new Error('ruta nula');pass('route:'+a,'ok');t?.el?.remove?.();t?.wv?.remove?.()}catch(e){fail('route:'+a,e)}}
  try{if(typeof N.dlg!=='function'||typeof N.ctx!=='function')throw new Error('dlg/ctx ausentes');pass('helpers','dlg y ctx expuestos')}catch(e){fail('helpers',e)}
  try{if(typeof N.renderGroups!=='function'||typeof N.newGroup!=='function'||typeof N.saveSession!=='function')throw new Error('helpers de pestañas ausentes');pass('tab-helpers','renderGroups/newGroup/saveSession expuestos')}catch(e){fail('tab-helpers',e)}
  try{if(Array.isArray(S.groups))throw new Error('S.groups sigue siendo array');pass('groups-shape','mapa de grupos correcto')}catch(e){fail('groups-shape',e)}
  let web=null;
  try{web=newTab('https://example.com/login');sel(web);if(!document.querySelector('#tabs .tab.on'))throw new Error('tab no seleccionada');pass('tab-create','pestaña web creada')}catch(e){fail('tab-create',e)}
  try{if(!N.activeWebTab?.())throw new Error('activeWebTab inexistente');pass('active-web','pestaña web activa detectada')}catch(e){fail('active-web',e)}
  try{sel(web);const r=document.createElement('div');r.className='ipage';N.PG.capture?.(r);const b=r.querySelector('#cx');if(!b)throw new Error('botón capture no encontrado');await b.click();await wait(30);if(!__novaQACalls.some(x=>x.kind==='invoke'&&x.ch==='save-shot'))throw new Error('save-shot no invocado');pass('capture','usa pestaña web activa')}catch(e){fail('capture',e)}
  try{const r=document.createElement('div');r.className='ipage';N.PG.reader?.(r);const b=r.querySelector('#rd-on');if(b){await b.click();await wait(20)}pass('reader','Reader ejecutable')}catch(e){fail('reader',e)}
  try{const r=document.createElement('div');r.className='ipage';N.PG.collections?.(r);const b=r.querySelector('#cc25');if(!b)throw new Error('guardar colección no encontrado');await b.click();await wait(20);if(!S.novaNext?.collections?.some(c=>(c.items||[]).length))throw new Error('colección vacía');pass('collections','guarda página actual')}catch(e){fail('collections',e)}
  try{const r=document.createElement('div');r.className='ipage';N.PG.rendimiento2?.(r);await wait(20);if(!r.textContent.includes('Centro de rendimiento'))throw new Error('render de performance falló');pass('performance','renderiza correctamente')}catch(e){fail('performance',e)}
  try{N.aiNew?.();N.aiSend?.('hola');await wait(20);if(typeof N.aiSend!=='function')throw new Error('aiSend ausente');pass('ai','acciones IA callable sin clave')}catch(e){fail('ai',e)}
  try{N.palette?.();if(!document.getElementById('nova30-cmd'))throw new Error('Command Center no abrió');document.getElementById('nova30-cmd')?.remove();pass('command-center','abre y cierra')}catch(e){fail('command-center',e)}
  try{const r=document.createElement('div');r.className='ipage';N.PG.writer?.(r);const b=r.querySelector('#nx-w-docx');if(!b)throw new Error('botón DOCX no encontrado');await b.click();await wait(50);if(!__novaQACalls.some(x=>x.kind==='invoke'&&x.ch==='save-docx'))throw new Error('save-docx no invocado');pass('writer-docx','exportación invoca IPC')}catch(e){fail('writer-docx',e)}
  try{if(!document.getElementById('supercat-root'))throw new Error('Super Cat root ausente');pass('supercat','cargado')}catch(e){fail('supercat',e)}
  try{const acts=typeof N.ACTIONS==='function'?N.ACTIONS():[];if(acts.length<25)throw new Error('solo '+acts.length+' acciones');let bad=[];for(const [label,fn] of acts){if(typeof fn!=='function')bad.push(label)}if(bad.length)throw new Error('acciones sin función: '+bad.join(', '));pass('actions','acciones '+acts.length+' con callbacks')}catch(e){fail('actions',e)}
  try{const routeCount=Object.keys(N.PG||{}).length;if(routeCount<45)throw new Error('solo '+routeCount+' rutas');pass('route-count','PG='+routeCount)}catch(e){fail('route-count',e)}
  const summary={passed:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length,total:results.length,routeCount:Object.keys(N.PG||{}).length,ipcCalls:window.__novaQACalls?.length||0,lastError:window.__novaQALastError};
  const payload={summary,results};
  try{await fetch('/__qa-result',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});}catch(e){console.error('QA REPORT SEND FAILED',e)}
})();`;
fs.writeFileSync(path.join(ROOT,'qa-mock-runtime.js'),mock);
fs.writeFileSync(path.join(ROOT,'qa-runner-runtime.js'),runner);
const src=fs.readFileSync(path.join(SHELL,'index.html'),'utf8');
const patched=src
  .replace('<script>\nconst {ipcRenderer:ipc}', '<script src="/qa-mock-runtime.js"></script><script>\nconst {ipcRenderer:ipc}')
  .replace('</body></html>', '<script src="/qa-runner-runtime.js"></script></body></html>');
fs.writeFileSync(path.join(SHELL,'qa-runtime.html'),patched);

let report=null;
const srv=http.createServer((req,res)=>{ console.error('REQ',req.method,req.url);
  if(req.url==='/__qa-start'){res.writeHead(204);return res.end()} if(req.url==='/__qa-runner-start'){res.writeHead(204);return res.end()} if(req.url==='/__qa-result'&&req.method==='POST'){
    let body=''; req.on('data',d=>body+=d); req.on('end',()=>{try{report=JSON.parse(body);fs.writeFileSync(RESULT_FILE,JSON.stringify(report,null,2));res.writeHead(204);res.end()}catch(e){res.writeHead(400);res.end('bad')}});return;
  }
  let u; try{u=decodeURIComponent(req.url.split('?')[0])}catch{u='/'};
  const file=path.join(ROOT,u.replace(/^\//,''));
  if(!file.startsWith(ROOT)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('not found')}
  const ext=path.extname(file);res.setHeader('content-type',ext==='.html'?'text/html':ext==='.js'?'text/javascript':'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
  await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const port=srv.address().port; const url=`http://127.0.0.1:${port}/shell/qa-runtime.html`;
  const args=['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--disable-default-apps','--no-first-run','--user-data-dir=/tmp/nova-qa-browser-'+process.pid,url];
  const child=cp.spawn('chromium',args,{stdio:['ignore','ignore','pipe']}); let stderr=''; child.stderr.on('data',d=>stderr+=d.toString());
  const started=Date.now();
  while(!report && Date.now()-started<15000) await new Promise(r=>setTimeout(r,100));
  try{child.kill('SIGKILL')}catch{}; await new Promise(r=>setTimeout(r,300)); srv.close();
  if(!report){console.error('QA runtime did not return a report. Chromium stderr:\n'+stderr.slice(-5000));process.exit(1)}
  console.log(JSON.stringify({...report,chromiumStderr:stderr.slice(-2000)},null,2));
  process.exit(report.summary.failed?1:0);
})();
