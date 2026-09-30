/* Nova - tienda de extensiones propias. Todo el código está aquí, sin descargas externas. */
const CATALOG = [
  { id: 'lectura', name: 'Lectura cómoda', cat: 'Lectura', desc: 'Centra el texto, agranda la letra y suaviza el interlineado en artículos.',
    css: 'article,main,[role=main]{max-width:780px!important;margin-left:auto!important;margin-right:auto!important}article p,main p,article li,main li{font-size:18px!important;line-height:1.75!important}' },
  { id: 'tiempo', name: 'Tiempo de lectura', cat: 'Lectura', desc: 'Muestra en una esquina cuántos minutos lleva leer la página (solo en textos largos).',
    js: `const w=(document.body?document.body.innerText:'').trim().split(/\\s+/).length;if(w<400)return;const d=document.createElement('div');d.id='nx-tiempo';d.textContent='≈ '+Math.max(1,Math.round(w/220))+' min de lectura';d.style.cssText='position:fixed;left:14px;bottom:14px;z-index:2147483647;padding:6px 12px;border-radius:999px;background:rgba(20,20,30,.82);color:#fff;font:12px system-ui,sans-serif;pointer-events:none';document.documentElement.appendChild(d);H.off=()=>d.remove();` },
  { id: 'oscuro', name: 'Webs en modo oscuro', cat: 'Aspecto', desc: 'Oscurece las páginas claras manteniendo las imágenes y vídeos con su color.',
    css: 'html{filter:invert(.92) hue-rotate(180deg)!important;background:#fff}img,video,canvas,picture,iframe,svg image{filter:invert(1) hue-rotate(180deg)!important}' },
  { id: 'cookies', name: 'Sin avisos de cookies', cat: 'Privacidad', desc: 'Oculta los avisos de cookies más habituales para que no tapen la página.',
    css: '#onetrust-consent-sdk,#CybotCookiebotDialog,#cookiebanner,.cookie-banner,.cookie-notice,.cc-window,.fc-consent-root,[id*="cookie-banner"],[class*="cookie-consent"],[id*="consent-banner"]{display:none!important}html,body{overflow:auto!important}' },
  { id: 'imagenes-blur', name: 'Imágenes difuminadas', cat: 'Privacidad', desc: 'Difumina imágenes y vídeos hasta que pasas el ratón por encima. Útil en público.',
    css: 'img,video{filter:blur(14px);transition:filter .2s}img:hover,video:hover{filter:none}' },
  { id: 'ahorro', name: 'Ahorro de datos', cat: 'Utilidades', desc: 'Oculta imágenes y vídeos para cargar y leer más rápido con poca conexión.',
    css: 'img,picture,video,iframe[src*="youtube"]{visibility:hidden!important}' },
  { id: 'arriba', name: 'Botón subir arriba', cat: 'Utilidades', desc: 'Añade un botón flotante para volver al inicio de páginas largas.',
    js: `const b=document.createElement('button');b.id='nx-arriba';b.textContent='↑';b.title='Subir';b.style.cssText='position:fixed;right:18px;bottom:18px;z-index:2147483647;width:40px;height:40px;border-radius:50%;border:0;background:rgba(20,20,30,.82);color:#fff;font:20px system-ui;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s';b.onclick=()=>scrollTo({top:0,behavior:'smooth'});const f=()=>{const on=scrollY>600;b.style.opacity=on?1:0;b.style.pointerEvents=on?'auto':'none'};addEventListener('scroll',f,{passive:true});document.documentElement.appendChild(b);H.off=()=>{removeEventListener('scroll',f);b.remove()};` },
  { id: 'copiar', name: 'Copiar sin formato', cat: 'Utilidades', desc: 'Al copiar texto de una web se guarda solo el texto, sin estilos ni enlaces.',
    js: `const h=e=>{const t=String(getSelection());if(!t)return;e.clipboardData.setData('text/plain',t);e.preventDefault()};document.addEventListener('copy',h,true);H.off=()=>document.removeEventListener('copy',h,true);` },
  { id: 'enlaces', name: 'Enlaces subrayados', cat: 'Aspecto', desc: 'Subraya todos los enlaces para distinguirlos mejor (accesibilidad).',
    css: 'a{text-decoration:underline!important;text-underline-offset:3px!important}' },
  { id: 'shorts', name: 'YouTube sin Shorts', cat: 'Utilidades', desc: 'Oculta la sección Shorts en YouTube. Puede dejar de funcionar si YouTube cambia su diseño.',
    css: 'ytd-reel-shelf-renderer,ytd-rich-shelf-renderer[is-shorts],ytd-guide-entry-renderer:has(a[title="Shorts"]),ytd-mini-guide-entry-renderer[aria-label="Shorts"]{display:none!important}' }
  ,
  { id: 'sepia', name: 'Modo noche cálido', cat: 'Aspecto', desc: 'Tono cálido tipo sepia que cansa menos la vista por la noche.',
    css: 'html{filter:sepia(.35) brightness(.94) contrast(.98)!important}' },
  { id: 'grises', name: 'Escala de grises', cat: 'Aspecto', desc: 'Muestra todas las webs en blanco y negro para distraerte menos.',
    css: 'html{filter:grayscale(1)!important}' },
  { id: 'contraste', name: 'Alto contraste', cat: 'Accesibilidad', desc: 'Aumenta el contraste y la saturación para leer mejor.',
    css: 'html{filter:contrast(1.25) saturate(1.1)!important}' },
  { id: 'zoom', name: 'Letra más grande', cat: 'Accesibilidad', desc: 'Agranda el contenido de todas las webs un 15 %.',
    css: 'body{zoom:1.15}' },
  { id: 'sin-anim', name: 'Sin animaciones', cat: 'Accesibilidad', desc: 'Detiene animaciones y transiciones de las webs. Más fluido en equipos lentos.',
    css: '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' },
  { id: 'suave', name: 'Desplazamiento suave', cat: 'Aspecto', desc: 'El scroll y los saltos dentro de la página se deslizan con suavidad.',
    css: 'html{scroll-behavior:smooth}' },
  { id: 'popups', name: 'Sin ventanas de suscripción', cat: 'Privacidad', desc: 'Oculta los avisos de newsletter, notificaciones y ofertas que tapan la página.',
    css: '[class*="newsletter-popup"],[class*="newsletter-modal"],[id*="newsletter-popup"],[class*="subscribe-popup"],[class*="subscribe-modal"],[class*="email-popup"],[class*="exit-intent"],[id*="exit-intent"],[class*="push-prompt"],[class*="notification-prompt"],.pum-overlay,.mc-modal,.privy-popup,#om-overlay{display:none!important}html,body{overflow:auto!important}' },
  { id: 'yt-limpio', name: 'YouTube sin distracciones', cat: 'Utilidades', desc: 'Oculta comentarios y vídeos relacionados en YouTube para centrarte en el vídeo.',
    css: 'ytd-watch-flexy #comments,ytd-watch-flexy #related,ytd-watch-next-secondary-results-renderer,#secondary.ytd-watch-flexy{display:none!important}' },
  { id: 'desbloquear', name: 'Permitir copiar y clic derecho', cat: 'Utilidades', desc: 'Desbloquea webs que impiden seleccionar texto, copiar o usar el menú contextual.',
    css: '*{-webkit-user-select:text!important;user-select:text!important}',
    js: `const ev=['contextmenu','copy','cut','selectstart','dragstart'],h=e=>e.stopImmediatePropagation();ev.forEach(n=>document.addEventListener(n,h,true));H.off=()=>ev.forEach(n=>document.removeEventListener(n,h,true));` },
  { id: 'progreso', name: 'Barra de progreso de lectura', cat: 'Lectura', desc: 'Una línea fina arriba muestra cuánto has avanzado en la página.',
    js: `const b=document.createElement('div');b.id='nx-progreso';b.style.cssText='position:fixed;left:0;top:0;height:3px;width:0;z-index:2147483647;background:linear-gradient(90deg,#22d3ee,#8b5cf6);pointer-events:none;transition:width .1s';const f=()=>{const m=document.documentElement.scrollHeight-innerHeight;b.style.width=(m>0?Math.min(100,scrollY/m*100):0)+'%'};addEventListener('scroll',f,{passive:true});f();document.documentElement.appendChild(b);H.off=()=>{removeEventListener('scroll',f);b.remove()};` },
  { id: 'regla', name: 'Regla de lectura', cat: 'Lectura', desc: 'Resalta una franja que sigue al ratón para no perder la línea mientras lees.',
    js: `const r=document.createElement('div');r.id='nx-regla';r.style.cssText='position:fixed;left:0;right:0;height:34px;z-index:2147483646;pointer-events:none;background:rgba(139,92,246,.14);border-top:1px solid rgba(139,92,246,.35);border-bottom:1px solid rgba(139,92,246,.35);top:-60px';const m=e=>{r.style.top=(e.clientY-17)+'px'};document.addEventListener('mousemove',m,{passive:true});document.documentElement.appendChild(r);H.off=()=>{document.removeEventListener('mousemove',m);r.remove()};` },
  { id: 'palabras', name: 'Contador de palabras', cat: 'Lectura', desc: 'Al seleccionar texto muestra cuántas palabras y caracteres tiene.',
    js: `const t=document.createElement('div');t.id='nx-palabras';t.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483647;padding:6px 12px;border-radius:999px;background:rgba(20,20,30,.85);color:#fff;font:12px system-ui,sans-serif;pointer-events:none;display:none';const f=()=>{const s=String(getSelection()).trim();if(!s){t.style.display='none';return}t.textContent=s.split(/\\s+/).length+' palabras · '+s.length+' caracteres';t.style.display='block'};document.addEventListener('selectionchange',f);document.documentElement.appendChild(t);H.off=()=>{document.removeEventListener('selectionchange',f);t.remove()};` },
  { id: 'password', name: 'Ver contraseñas', cat: 'Utilidades', desc: 'Haz doble clic en un campo de contraseña para verla u ocultarla.',
    js: `const h=e=>{const i=e.target;if(i&&i.tagName==='INPUT'&&(i.type==='password'||i.dataset.nxPw)){const v=i.type==='password';i.type=v?'text':'password';i.dataset.nxPw='1'}};document.addEventListener('dblclick',h,true);H.off=()=>{document.removeEventListener('dblclick',h,true);document.querySelectorAll('input[data-nx-pw]').forEach(i=>{i.type='password'})};` },
  { id: 'autoplay', name: 'Sin reproducción automática', cat: 'Utilidades', desc: 'Pausa los vídeos que empiezan solos hasta que interactúes con la página.',
    js: `const h=e=>{if(e.target&&e.target.tagName==='VIDEO'&&!(navigator.userActivation&&navigator.userActivation.hasBeenActive))e.target.pause()};document.addEventListener('play',h,true);H.off=()=>document.removeEventListener('play',h,true);` },
  { id: 'enlaces-ext', name: 'Marcar enlaces externos', cat: 'Aspecto', desc: 'Añade una flecha ↗ a los enlaces que llevan a otra web.',
    css: 'a[data-nx-ext]::after{content:" ↗";font-size:.8em;opacity:.6}',
    js: `const m=()=>document.querySelectorAll('a[href^="http"]:not([data-nx-ext])').forEach(a=>{try{if(new URL(a.href).hostname!==location.hostname)a.setAttribute('data-nx-ext','1')}catch(e){}});m();const o=new MutationObserver(()=>{clearTimeout(o.t);o.t=setTimeout(m,400)});o.observe(document.body||document.documentElement,{childList:true,subtree:true});const off=H.off;H.off=()=>{o.disconnect();off();document.querySelectorAll('a[data-nx-ext]').forEach(a=>a.removeAttribute('data-nx-ext'))};` }
];
const byId = id => CATALOG.find(x => x.id === id);
const q = s => JSON.stringify(s);
// Código que se inyecta en la página (idempotente)
const on = id => { const x = byId(id); if (!x) return '';
  return `(()=>{try{window.__nx=window.__nx||{};if(window.__nx[${q(id)}])return;const H=window.__nx[${q(id)}]={off(){}};` +
    (x.css ? `const s=document.createElement('style');s.id='nx-${id}';s.textContent=${q(x.css)};(document.head||document.documentElement).appendChild(s);H.off=()=>s.remove();` : '') +
    (x.js ? `(()=>{${x.js}})();` : '') + `}catch(e){}})()`; };
const off = id => `(()=>{try{const h=window.__nx&&window.__nx[${q(id)}];if(h){h.off();delete window.__nx[${q(id)}]}}catch(e){}})()`;
module.exports = { CATALOG, byId, on, off };
