/* Nova 3.0.1 Hotfix · functional routing, IA actions and command bridge */
(() => {
  const N = window.NOVA;
  if (!N) return;
  const aliases = Object.freeze({
    about:'acerca', settings:'ajustes', preference:'ajustes', preferences:'ajustes',
    privacy:'privacidad2', rendimiento:'rendimiento2', performance:'rendimiento2',
    downloads:'descargas2', download:'descargas2', study:'study3', feedback:'mejoras',
    improvements:'mejoras', news:'novedades', start:'bienvenida', welcome:'bienvenida',
    ia:'ia'
  });
  const title = Object.freeze({
    safari:'Safari Mode', islands:'Nova Islands', glance:'Glance', focus:'Nova Focus', reader:'Nova Reader+',
    collections:'Colecciones', capture:'Web Capture', writer:'Nova Writer', docs:'Nova Docs', study3:'Nova Study 3',
    privacidad2:'Centro de privacidad', rendimiento2:'Centro de rendimiento', descargas2:'Download Hub', apps:'Web Apps',
    mejoras:'Mejoras de Nova', novedades:'Novedades', welcome:'Bienvenida', acerca:'Acerca de Nova', ajustes:'Ajustes',
    notas:'Notas', workspaces:'Workspaces', pestanas:'Pestañas', seguridad:'Seguridad'
  });
  const resolve = raw => {
    const x = String(raw || '').replace(/^nova:\/\//,'').split(/[/?#]/)[0].trim().toLowerCase();
    return aliases[x] || x;
  };
  N.resolveFeatureRoute = resolve;
  N.openFeature = route => {
    const name = resolve(route);
    if (name === 'ia') { N.openAI?.(); return window.cur || null; }
    if (!N.PG?.[name]) {
      try { if (typeof toast === 'function') toast('Esta función no está disponible en esta versión: ' + name); } catch {}
      return null;
    }
    const t = newTab('nova://' + name);
    setTimeout(() => { try { const sp = t?.el?.querySelector('span'); if (sp) sp.textContent = title[name] || name; } catch {} }, 25);
    return t;
  };
  // Prevent the old internalTab() fallback from silently opening Acerca de.
  if (typeof internalTab === 'function' && !N.__hotfixInternalRouter) {
    const baseInternalTab = internalTab;
    internalTab = function (u) {
      const name = resolve(u);
      if (!N.PG?.[name]) {
        try { toast('Ruta interna no encontrada: ' + name); } catch {}
        return null;
      }
      return baseInternalTab('nova://' + name);
    };
    N.__hotfixInternalRouter = true;
  }
  // Working AI bridge for the Command Center, selection chip and New Tab.
  N.aiNew = () => { try { if (typeof S !== 'undefined' && Array.isArray(S.convs)) { const fresh = { id: Date.now(), title: 'Nueva conversación', msgs: [], ts: Date.now() }; S.convs.unshift(fresh); S.cid = fresh.id; save?.(); } N.openAI?.(); return (typeof S !== 'undefined') ? S.cid : null; } catch { N.openAI?.(); return null; } };
  N.aiSend = q => { try { N.openAI?.(); return N.askAI?.(String(q || '')); } catch { return null; } };
  N.askSel = t => N.aiSend('Explica o resume este texto seleccionado:\n\n' + String(t || '').slice(0, 6000));
  N.aiAct = kind => {
    if (kind === 'sum') {
      const source = N.currentWebTab?.() || N.activeWebTab?.();
      (async () => {
        try {
          const body = source?.wv?.executeJavaScript ? await source.wv.executeJavaScript('document.body.innerText.slice(0,12000)') : '';
          if (!body) throw new Error('no-web-page');
          N.aiSend('Resume en español, en pocos puntos, esta página:\n\n' + body);
        } catch {
          N.aiSend('Abre una página web para poder resumirla.');
        }
      })();
      return;
    }
    N.toggleAI?.();
  };
  N.goSec = () => N.openFeature('ajustes');
  N.newNote = () => {
    const t = N.openFeature('notas');
    try { toast('Notas abierto. Pulsa “+ Nueva nota” para crear una nota.'); } catch {}
    return t;
  };
  // Fix wrong/empty Command Center actions and add all 2.5 actions as callable entries.
  const ensure = (label, fn) => {
    N.extraActs = Array.isArray(N.extraActs) ? N.extraActs : [];
    const i = N.extraActs.findIndex(a => Array.isArray(a) && a[0] === label);
    if (i >= 0) N.extraActs[i] = [label, fn]; else N.extraActs.push([label, fn]);
  };
  ensure('Abrir Nova IA', () => N.toggleAI?.());
  ensure('Nueva conversación con Nova IA', () => N.aiNew());
  ensure('Resumir página', () => N.aiAct('sum'));
  ensure('Preguntar a Nova IA', () => N.openAI?.());
  ensure('Command Center', () => N.palette?.());
  ensure('Nueva nota', () => N.newNote());
  ensure('Safari Mode', () => N.openFeature('safari'));
  ensure('Nova Islands', () => N.openFeature('islands'));
  ensure('Glance', () => N.openFeature('glance'));
  ensure('Nova Focus', () => N.openFeature('focus'));
  ensure('Nova Reader+', () => N.openFeature('reader'));
  ensure('Colecciones', () => N.openFeature('collections'));
  ensure('Web Capture', () => N.openFeature('capture'));
  ensure('Nova Writer', () => N.openFeature('writer'));
  ensure('Nova Docs', () => N.openFeature('docs'));
  ensure('Nova Study 3', () => N.openFeature('study3'));
  ensure('Centro de privacidad', () => N.openFeature('privacidad2'));
  ensure('Centro de rendimiento', () => N.openFeature('rendimiento2'));
  ensure('Download Hub', () => N.openFeature('descargas2'));
  ensure('Web Apps', () => N.openFeature('apps'));
  ensure('Mejoras de Nova', () => N.openFeature('mejoras'));
  ensure('Workspaces', () => N.openFeature('workspaces'));
  ensure('Gestor de pestañas', () => N.openFeature('pestanas'));
  N.__hotfix254Ready = true;
})();
