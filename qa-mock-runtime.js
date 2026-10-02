(() => {
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
        emit:(ch,...args)=>{for(const fn of listeners[ch]||[])try{fn({},...args)}catch(e){window.__novaQALastError += String(e.stack||e)+'\n';}}
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
  window.addEventListener('error', e => { window.__novaQALastError += String(e.error?.stack||e.message)+'\n'; });
  window.addEventListener('unhandledrejection', e => { window.__novaQALastError += String(e.reason?.stack||e.reason)+'\n'; });
})();