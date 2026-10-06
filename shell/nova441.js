/* Nova 4.4.1 · News & New Tab Reliability Hotfix */
(() => {
  'use strict';
  const N = window.NOVA || {};
  const isNewTab = t => { try { return !!t?.wv?.getURL && String(t.wv.getURL()).includes('newtab.html'); } catch { return false; } };
  const topic = () => { try { return String(S.sec || 'videojuegos').toLowerCase(); } catch { return 'videojuegos'; } };
  const guestTopic = async t => {
    try {
      const x = await t.wv.executeJavaScript(`new URLSearchParams(location.search).get('sec')||''`);
      return String(x||'').toLowerCase() || topic();
    } catch { return topic(); }
  };
  const injectNews = async t => {
    if (!isNewTab(t) || !t.wv?.executeJavaScript) return;
    try {
      const d = await ipc.invoke('news-feed', { topic: await guestTopic(t) });
      await t.wv.executeJavaScript(`window.__NOVA_NEWS_DATA=${JSON.stringify(d)};window.renderNovaNews&&window.renderNovaNews(window.__NOVA_NEWS_DATA);`);
    } catch {}
  };
  const baseNewTab441 = window.newTab;
  if (typeof baseNewTab441 === 'function') {
    window.newTab = function nova441NewTab(u) {
      const t = baseNewTab441.apply(this, arguments);
      if (t?.wv) {
        const onReady = () => { injectNews(t).catch?.(()=>{}); try { t.wv.removeEventListener('dom-ready', onReady); } catch {} };
        try { t.wv.addEventListener('dom-ready', onReady); } catch {}
        setTimeout(() => injectNews(t).catch?.(()=>{}), 700);
      }
      return t;
    };
    N.newTab = window.newTab;
  }
  // Delegated click: the + button remains operational even if another UI layer moves/rebuilds #tabs.
  document.addEventListener('click', e => {
    const b = e.target?.closest?.('#nt');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    try { window.newTab?.(); } catch { try { typeof newTab === 'function' && newTab(); } catch {} }
  }, true);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey && String(e.key).toLowerCase() === 't') {
      e.preventDefault();
      try { window.newTab?.(); } catch {}
    }
  }, true);
  const old = window.newTab;
  const ensure = () => {
    const b=document.getElementById('nt'); if(!b) return;
    b.type='button'; b.setAttribute('aria-label','Nueva pestaña'); b.title='Nueva pestaña (Ctrl+T)';
    if (!b.dataset.nova441) {
      b.dataset.nova441='1';
      b.addEventListener('pointerup', e => { if(e.button!==0)return; e.preventDefault(); e.stopPropagation(); try { window.newTab?.(); } catch {} });
    }
    const tabsEl=document.getElementById('tabs'); if(tabsEl && tabsEl.lastElementChild!==b) tabsEl.appendChild(b);
  };
  ensure(); setTimeout(ensure,250); setTimeout(ensure,1000);
  window.addEventListener('beforeunload',()=>{});
})();
