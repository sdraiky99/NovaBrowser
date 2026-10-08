/* Nova 5.2.0 Identity — visual polish only; core navigation intentionally untouched. */
(() => {
  'use strict';
  const N = window.NOVA || {};
  document.title = 'Nova Quantum';
  const style = document.createElement('style'); style.id = 'nova52-identity-style';
  style.textContent = `
    body.quantum-prime #brand{letter-spacing:.12em;font-weight:700}
    body.quantum-prime #brand img{border-radius:8px}
    body.quantum-prime #bar{box-shadow:0 1px 0 rgba(255,255,255,.03)}
    body.quantum-prime #addr{font-weight:450;letter-spacing:-.005em}
    body.quantum-prime .tab{transition:background 150ms ease,color 150ms ease,transform 150ms ease,box-shadow 150ms ease}
    body.quantum-prime .tab:active{transform:translateY(1px)}
    body.quantum-prime #q-menu{border-radius:14px;box-shadow:0 20px 56px rgba(0,0,0,.18)}
    body.quantum-prime #q-menu .q-menu-item{min-height:38px}
    body.quantum-prime #side .ib{transition:background 130ms ease,color 130ms ease,transform 130ms ease}
    body.quantum-prime #side .ib:hover{transform:translateY(-1px)}
    body.quantum-prime #side .ai svg{animation:none;filter:none}
    body.quantum-prime #side .ai:hover svg{filter:none}
    @media(prefers-reduced-motion:reduce){body.quantum-prime .tab,body.quantum-prime #side .ib{transition:none!important}}
  `;
  document.head.appendChild(style);

  // Keep old 5.1 labels from leaking into the visible settings/about pages.
  if (N.PG && typeof N.PG.quantumsettings === 'function') {
    const oldSettings = N.PG.quantumsettings;
    N.PG.quantumsettings = (r) => { oldSettings(r); r.querySelectorAll('.q51-eyebrow').forEach(x => x.textContent='NOVA QUANTUM 5.2'); r.querySelectorAll('footer').forEach(x => x.innerHTML=x.innerHTML.replace(/5\.1\.0/g,'5.2.0')); };
  }
  if (N.PG && typeof N.PG.acerca === 'function') {
    const oldAbout = N.PG.acerca;
    N.PG.acerca = (r) => {
      oldAbout(r);
      const stale=[...r.querySelectorAll('*')].filter(el => /5\.1\.0/.test(el.textContent||''));
      stale.forEach(el => { if(el.children.length===0) el.textContent=el.textContent.replace(/5\.1\.0/g,'5.2.0'); });
      const brand = document.createElement('div'); brand.className='nova52-about-brand'; brand.innerHTML='<img src="../assets/logo/nova-quantum.svg" alt="Nova"><div><b>Nova Quantum</b><span>Identity 5.2 · Calm by design.</span></div>'; r.prepend(brand);
    };
  }
  N.nova52 = Object.assign(N.nova52 || {}, { version:'5.2.0', identity:'Calm', coreNavigationProtected:true });
})();
