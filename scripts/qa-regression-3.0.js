const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const must=(c,m)=>{if(!c)throw new Error(m)};
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const idx=read('shell/index.html'), ex=read('shell/extras.js'), ex2=read('shell/extras2.js'), ex4=read('shell/extras4.js'), ex7=read('shell/extras7.js'), ex8=read('shell/extras8.js'), ex10=read('shell/extras10.js'), hot=read('shell/hotfix254.js'), nx25=read('shell/nova25.js'), nx30=read('shell/nova30.js'), main=read('main.js');

must(idx.includes('window.save = save;'),'save export missing');
must(ex4.includes('const N = NOVA'),'extras4 NOVA alias missing');
must(ex4.includes("bmb.querySelector('#bmbclose').onclick=toggleBar"),'bookmark close handler still uses an out-of-scope q');
must(ex4.includes('S.groups[t.g]') && !ex4.includes('S.groups.find(x => x.id'),'groups must use the canonical object map');
must(ex4.includes('N.dlg =') && ex4.includes('N.ctx ='),'public dialog/context bridges missing');
must(ex4.includes('N.renderGroups = layout') && ex4.includes('N.newGroup = groupDialog'),'group helpers not exported');
must(ex4.includes('S.session2 = list.map'),'legacy session mirror missing');
must(ex10.includes('const N = NOVA, { PG } = N'),'extras10 N/PG bridge missing');
must(ex.includes('NOVA.resolveFeatureRoute') && ex.includes('localAliases'),'internal route alias resolver missing');
must(nx25.includes('const currentWebTab = ()'),'nova25 active web target missing');
must(nx25.includes('source.wv.capturePage()'),'capture must target a webview source');
must(nx25.includes('source=currentWebTab()'),'capture/reader/collections must resolve the web source');
must(nx25.includes("d?.main?.rssKB"),'performance page must map the real IPC response');
must(hot.includes('N.currentWebTab?.() || N.activeWebTab?.()'),'AI summary must target active web tab');
must(main.includes("ipcMain.handle('open-downloads-folder'"),'download folder IPC missing');
must(main.includes("ipcMain.handle('save-shot'"),'capture IPC missing');
// Regression must never rely only on String.includes in the final check. Runtime startup is covered by qa-runtime-3.0.js.
console.log('Nova 3.0 source regressions OK · invariants verified');
