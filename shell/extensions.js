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
