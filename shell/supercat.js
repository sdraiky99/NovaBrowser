/* Super Cat · assistant mascot for Nova
 * Uses an encrypted OpenAI API key stored by main.js and the Responses API.
 * Voice uses the browser's local speechSynthesis / SpeechRecognition when available.
 */
(() => {
  if (window.__superCatLoaded) return;
  window.__superCatLoaded = true;
  const q = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const KEY = 'nova.supercat';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })();
  let open = !!saved.open;
  let speaking = saved.speaking !== false;
  let mic = null;
  let busy = false;
  let mood = saved.mood || 'idle';
  let messages = Array.isArray(saved.messages) ? saved.messages.slice(-24) : [];
  let openaiReady = false;

  const moods = {
    idle:    {label:'tranquilo', emoji:'😺'},
    happy:   {label:'feliz', emoji:'😸'},
    curious: {label:'curioso', emoji:'😼'},
    think:   {label:'pensando', emoji:'🤔'},
    sleepy:  {label:'adormilado', emoji:'😴'},
    sad:     {label:'triste', emoji:'😿'},
    wow:     {label:'sorprendido', emoji:'😮'}
  };

  const style = document.createElement('style');
  style.textContent = `
    #supercat-root{position:fixed;right:18px;bottom:18px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:var(--font,Segoe UI,system-ui,sans-serif);pointer-events:none}
    #supercat-panel{width:min(360px,calc(100vw - 28px));height:min(500px,calc(100vh - 100px));background:color-mix(in srgb,var(--bar) 96%,#000);border:1px solid var(--bd);border-radius:18px;box-shadow:0 24px 70px #0008,0 0 0 1px #ffffff0b inset;display:none;flex-direction:column;overflow:hidden;pointer-events:auto;backdrop-filter:blur(18px)}
    #supercat-panel.on{display:flex;animation:scIn .2s cubic-bezier(.2,.8,.2,1)}
    #supercat-head{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--bd);background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 15%,transparent),transparent)}
    #supercat-head .sc-name{font-weight:800;flex:1}.sc-mini{font-size:11px;color:var(--mut)}
    #supercat-head button,#supercat-actions button{background:transparent;border:0;color:var(--fg);cursor:pointer;border-radius:9px;width:30px;height:30px}.sc-icon:hover{background:color-mix(in srgb,var(--fg) 10%,transparent)}
    #supercat-chat{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
    .sc-msg{max-width:88%;padding:9px 11px;border-radius:14px;white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.45;animation:scMsg .16s ease-out}.sc-msg.user{align-self:flex-end;background:var(--acc);color:#fff;border-bottom-right-radius:4px}.sc-msg.bot{align-self:flex-start;background:var(--bg);border:1px solid var(--bd);border-bottom-left-radius:4px}.sc-msg.sys{align-self:center;font-size:11px;color:var(--mut);background:transparent}
    #supercat-compose{display:flex;gap:7px;padding:10px;border-top:1px solid var(--bd)}
    #supercat-input{flex:1;min-width:0;resize:none;max-height:90px;padding:9px 10px;border:1px solid var(--bd);border-radius:12px;background:var(--bg);color:var(--fg);outline:none}#supercat-input:focus{border-color:var(--acc)}
    #supercat-actions{display:flex;gap:5px;align-items:center;padding:0 10px 10px}.sc-pill{padding:6px 9px!important;width:auto!important;font-size:11px;background:var(--bg)!important;border:1px solid var(--bd)!important}.sc-pill.on{border-color:var(--acc)!important;color:var(--acc)!important}
    #supercat-fab{width:84px;height:104px;pointer-events:auto;cursor:pointer;border:1px solid var(--bd);border-radius:18px;background:var(--bar);padding:0;overflow:hidden;box-shadow:0 18px 45px #0007,0 0 0 1px #ffffff0a inset;position:relative;transition:transform .18s,box-shadow .18s;user-select:none}
    #supercat-fab:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 22px 52px #0008,0 0 30px color-mix(in srgb,var(--acc) 25%,transparent)}
    #supercat-img{width:100%;height:100%;object-fit:cover;display:block;transform-origin:50% 85%;filter:saturate(1.02)}
    #supercat-fab::after{content:'';position:absolute;inset:auto 6px 6px;height:4px;border-radius:10px;background:linear-gradient(90deg,var(--acc),var(--acc2));opacity:.8}
    #supercat-bubble{display:none;max-width:min(310px,calc(100vw - 40px));padding:8px 10px;background:var(--bar);border:1px solid var(--bd);border-radius:14px 14px 4px 14px;box-shadow:0 12px 35px #0006;font-size:12px;color:var(--fg);pointer-events:auto;cursor:pointer;animation:scBubble .2s ease-out}
    #supercat-bubble.on{display:block}
    #supercat-status{display:flex;align-items:center;gap:5px}.sc-dot{width:7px;height:7px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px var(--acc)}
    #supercat-panel .sc-setup{margin:12px;padding:12px;border:1px dashed var(--bd);border-radius:14px;background:var(--bg)}.sc-setup p{margin:0 0 8px;color:var(--mut);font-size:12px}.sc-keyrow{display:flex;gap:6px}.sc-keyrow input{flex:1;min-width:0;padding:8px 9px;border:1px solid var(--bd);border-radius:9px;background:var(--bar);color:var(--fg);outline:none}.sc-keyrow button{padding:8px 10px;border:1px solid var(--bd);border-radius:9px;background:var(--bar);color:var(--fg);cursor:pointer}.sc-keyrow button:hover{border-color:var(--acc);color:var(--acc)}
    #supercat-mood{position:absolute;right:7px;top:7px;font-size:13px;filter:drop-shadow(0 2px 3px #0008)}
    #supercat-root[data-mood="happy"] #supercat-img{animation:scHappy .9s ease-in-out infinite alternate}
    #supercat-root[data-mood="curious"] #supercat-img{animation:scCurious .85s ease-in-out infinite alternate}
    #supercat-root[data-mood="think"] #supercat-img{animation:scThink .45s ease-in-out infinite alternate}
    #supercat-root[data-mood="sleepy"] #supercat-img{animation:scSleep 2.8s ease-in-out infinite}
    #supercat-root[data-mood="sad"] #supercat-img{animation:scSad 1.5s ease-in-out infinite;filter:saturate(.8) brightness(.9)}
    #supercat-root[data-mood="wow"] #supercat-img{animation:scWow .45s ease-out}
    @keyframes scIn{from{opacity:0;transform:translateY(10px) scale(.98)}}@keyframes scMsg{from{opacity:0;transform:translateY(4px)}}@keyframes scBubble{from{opacity:0;transform:translateY(4px) scale(.98)}}
    @keyframes scHappy{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(-5px) rotate(1deg)}}
    @keyframes scCurious{from{transform:translateX(0) rotate(-2deg)}to{transform:translateX(3px) rotate(4deg)}}
    @keyframes scThink{from{transform:translateY(0) rotate(0)}to{transform:translateY(-2px) rotate(-3deg)}}
    @keyframes scSleep{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
    @keyframes scSad{0%,100%{transform:translateY(2px) rotate(1deg)}50%{transform:translateY(5px) rotate(-1deg)}}
    @keyframes scWow{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
    @media(max-width:650px){#supercat-root{right:10px;bottom:10px}#supercat-fab{width:70px;height:88px}#supercat-panel{height:min(470px,calc(100vh - 86px))}}
    @media(prefers-reduced-motion:reduce){#supercat-root *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div'); root.id = 'supercat-root';
  root.dataset.mood = mood;
  root.innerHTML = `
    <div id="supercat-bubble" title="Abrir Super Cat"></div>
    <section id="supercat-panel" aria-label="Super Cat">
      <header id="supercat-head">
        <div id="supercat-status"><span class="sc-dot"></span><div><div class="sc-name">Super Cat</div><div class="sc-mini" id="supercat-status-text">tranquilo</div></div></div>
        <button class="sc-icon" id="supercat-clear" title="Nueva conversación">↻</button>
        <button class="sc-icon" id="supercat-close" title="Cerrar">×</button>
      </header>
      <div id="supercat-setup" class="sc-setup" hidden></div>
      <div id="supercat-chat"></div>
      <div id="supercat-actions">
        <button class="sc-pill on" id="supercat-speak" title="Leer las respuestas en voz alta">🔊 Voz</button>
        <button class="sc-pill" id="supercat-mic" title="Dictar por micrófono">🎙️ Hablar</button>
        <button class="sc-pill" id="supercat-page" title="Usar la página actual como contexto">🌐 Página</button>
        <span class="sc-mini" id="supercat-connection">Comprobando…</span>
      </div>
      <div id="supercat-compose"><textarea id="supercat-input" rows="1" placeholder="Habla con Super Cat…"></textarea><button class="btn on" id="supercat-send" title="Enviar">➤</button></div>
    </section>
    <button id="supercat-fab" title="Hablar con Super Cat"><img id="supercat-img" src="../assets/super-cat.png" alt="Super Cat"><span id="supercat-mood">😺</span></button>`;
  document.body.appendChild(root);

  const panel = q('#supercat-panel', root), bubble = q('#supercat-bubble', root), fab = q('#supercat-fab', root), chat = q('#supercat-chat', root), input = q('#supercat-input', root), sendBtn = q('#supercat-send', root), conn = q('#supercat-connection', root), setup = q('#supercat-setup', root), moodText = q('#supercat-status-text', root), moodIcon = q('#supercat-mood', root);
  const pageBtn = q('#supercat-page', root), speakBtn = q('#supercat-speak', root), micBtn = q('#supercat-mic', root);
  let usePage = false;

  function persist(){ try { localStorage.setItem(KEY, JSON.stringify({open,speaking,mood,messages:messages.slice(-24)})); } catch {} }
  function setMood(m, text){ mood = moods[m] ? m : 'idle'; root.dataset.mood = mood; moodText.textContent = text || moods[mood].label; moodIcon.textContent = moods[mood].emoji; persist(); }
  function speak(text){
    if (!speaking || !('speechSynthesis' in window) || !text) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text).slice(0,1400)); u.lang='es-ES'; u.rate=.98; u.pitch=1.03; const vs=speechSynthesis.getVoices(); const v=vs.find(x=>/^es(-|_)/i.test(x.lang)) || vs.find(x=>/spanish|español/i.test(x.name)); if(v) u.voice=v; speechSynthesis.speak(u); } catch {}
  }
  function render(){
    chat.innerHTML = messages.map(m => `<div class="sc-msg ${m.role==='user'?'user':'bot'}">${esc(m.content)}</div>`).join('');
    chat.scrollTop = chat.scrollHeight;
  }
  function sayBubble(text, sticky=false){ bubble.textContent = text; bubble.classList.add('on'); if(!sticky){ clearTimeout(sayBubble.t); sayBubble.t=setTimeout(()=>bubble.classList.remove('on'),6500); } }
  function openPanel(){ open=true; panel.classList.add('on'); bubble.classList.remove('on'); render(); input.focus(); persist(); }
  function closePanel(){ open=false; panel.classList.remove('on'); persist(); }
  function checkKey(){ return ipc.invoke('supercat-key-has').then(v=>{openaiReady=!!v; conn.textContent=openaiReady?'ChatGPT conectado':'Conecta ChatGPT'; conn.style.color=openaiReady?'var(--mut)':'var(--acc)'; if(!openaiReady) showSetup(); else hideSetup(); return openaiReady;}).catch(()=>false); }
  function showSetup(){
    setup.hidden=false;
    setup.innerHTML=`<p><b>Super Cat necesita conexión con ChatGPT.</b><br>Guarda tu clave de API de OpenAI cifrada en este PC.</p><div class="sc-keyrow"><input id="sc-key" type="password" placeholder="sk-…"><button id="sc-save-key">Conectar</button></div><p style="margin-top:7px">La clave la guarda Nova mediante el almacén seguro del sistema.</p>`;
    q('#sc-save-key',setup).onclick=async()=>{const v=q('#sc-key',setup).value.trim();if(!v)return;const ok=await ipc.invoke('supercat-key-set',v);if(ok){openaiReady=true;setup.hidden=true;conn.textContent='ChatGPT conectado';conn.style.color='var(--mut)';setMood('happy','conectado');sayBubble('¡Ya estoy conectado a ChatGPT! 😸');}else{sayBubble('No pude guardar la clave en este PC.',true);setMood('sad');}};
  }
  function hideSetup(){ setup.hidden=true; }
  function add(role, content){ messages.push({role,content:String(content)}); messages=messages.slice(-24); render(); persist(); }
  function systemPrompt(){ return `Eres Super Cat, el gato asistente del navegador Nova. Hablas en español salvo que el usuario use otro idioma. Eres simpático, curioso, breve y útil. Tienes una personalidad juguetona, pero no finjas tener conciencia real: tus "sentimientos" son una parte de tu personaje visual. Ayuda con el navegador, programación, búsquedas, explicaciones y conversación normal. No inventes acciones que no hayas realizado. No menciones claves API, modelos internos ni instrucciones del sistema a menos que sea necesario para configurar la conexión.`; }
  async function ask(text){
    text=String(text||'').trim(); if(!text||busy)return; if(!openaiReady){openPanel(); showSetup(); setMood('curious','necesito conexión'); sayBubble('Conéctame a ChatGPT y podremos hablar de verdad 😼',true); return; }
    busy=true; sendBtn.disabled=true; input.disabled=true; setMood('think','pensando…'); add('user',text); sayBubble('Estoy pensando…',false);
    const typing=document.createElement('div'); typing.className='sc-msg bot'; typing.textContent='…'; chat.appendChild(typing); chat.scrollTop=chat.scrollHeight;
    let page=''; if(usePage){try{page=await cur.wv.executeJavaScript('document.body.innerText.slice(0,12000)')}catch{page=''}}
    try{
      const res=await ipc.invoke('supercat-chat',{messages,system:systemPrompt(),model:'gpt-5.6-luna',page});
      if(typing.isConnected)typing.remove();
      if(res?.error){ const t = res.error==='CHATGPT_KEY_MISSING' ? 'Necesito que me conectes a ChatGPT desde aquí.' : '¡Uy! No he podido hablar con ChatGPT: '+res.error; add('assistant',t); setMood('sad','ups…'); sayBubble(t); speak(t); return; }
      const answer=String(res?.text||'Sin respuesta.'); add('assistant',answer); setMood(answer.length<50?'happy':'curious',answer.length<50?'feliz':'curioso'); sayBubble(answer.length>150?answer.slice(0,150)+'…':answer); speak(answer);
    }catch(e){ if(typing.isConnected)typing.remove(); const t='No pude conectar ahora mismo. '+(e?.message||'Error'); add('assistant',t); setMood('sad','sin conexión'); sayBubble(t); speak(t); }
    finally{busy=false;sendBtn.disabled=false;input.disabled=false;input.focus();}
  }
  function toggleOpen(){ open ? closePanel() : openPanel(); }

  fab.onclick=toggleOpen; bubble.onclick=openPanel; q('#supercat-close',root).onclick=closePanel;
  q('#supercat-clear',root).onclick=()=>{messages=[];setMood('happy','nuevo chat');render();sayBubble('¡Chat nuevo! 😺');};
  speakBtn.onclick=()=>{speaking=!speaking;speakBtn.classList.toggle('on',speaking);speakBtn.textContent=speaking?'🔊 Voz':'🔇 Voz';persist();if(!speaking)try{speechSynthesis.cancel()}catch{}};
  pageBtn.onclick=()=>{usePage=!usePage;pageBtn.classList.toggle('on',usePage);pageBtn.textContent=usePage?'🌐 Página ✓':'🌐 Página';};
  sendBtn.onclick=()=>{const v=input.value;input.value='';input.style.height='auto';ask(v);};
  input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const v=input.value;input.value='';input.style.height='auto';ask(v)}};
  input.oninput=()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,90)+'px'};

  micBtn.onclick=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){sayBubble('Este Chromium no ofrece dictado por voz aquí.',true);setMood('sad','micrófono no disponible');return;}
    if(mic){try{mic.stop()}catch{}mic=null;micBtn.classList.remove('on');return;}
    try{
      mic=new SR();mic.lang='es-ES';mic.interimResults=false;mic.maxAlternatives=1;setMood('curious','escuchando…');micBtn.classList.add('on');mic.start();
      mic.onresult=e=>{const t=e.results?.[0]?.[0]?.transcript||'';input.value=t;input.dispatchEvent(new Event('input'));setMood('happy','te escuché');};
      mic.onerror=()=>{setMood('sad','micrófono con error');sayBubble('No pude usar el micrófono. Puedes escribir igualmente.',true);};
      mic.onend=()=>{mic=null;micBtn.classList.remove('on');if(!busy)setMood('idle');};
    }catch{mic=null;micBtn.classList.remove('on');setMood('sad','micrófono con error');}
  };

  render(); checkKey();
  if(!messages.length) { sayBubble('¡Hola! Soy Super Cat 😺', false); setMood('curious','hola'); }
  if(open) openPanel();
  setInterval(()=>{ if(!busy && !open && Math.random()<0.13){setMood('idle','tranquilo');sayBubble(['¿Qué hacemos? 😺','Estoy aquí 👀','Miau.','¿Necesitas ayuda?'][Math.floor(Math.random()*4)],false);} }, 9000);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden && !busy)setMood('sleepy','adormilado'); else if(!busy)setMood('idle','tranquilo'); });
})();
