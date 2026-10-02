(async()=>{ try{await fetch('/__qa-runner-start')}catch{}
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
})();