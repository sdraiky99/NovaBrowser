const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'shell','index.html'),'utf8');
const main=fs.readFileSync(path.join(root,'main.js'),'utf8');
const req=['bk','fw','rl','st','pinSite','sh','nt'];
const missing=req.filter(id=>!index.includes(`id="${id}"`));
if(missing.length) { console.error('UI audit failed: missing core ids',missing); process.exit(1); }
const tests=[
 ['pin button handler',fs.readFileSync(path.join(root,'shell/nova43.js'),'utf8').includes("#pinSite")],
 ['eco IPC',main.includes("ipcMain.handle('eco-mode'")],
 ['local extension loader',main.includes("ipcMain.handle('load-extension-local'")],
 ['glass stylesheet',fs.existsSync(path.join(root,'shell/ui.css')) && !fs.existsSync(path.join(root,'shell/themes.css'))],
 ['nova43 loaded',index.includes('nova43.js')]
];
for(const [n,ok] of tests){ if(!ok){console.error('UI audit failed:',n);process.exit(1)} console.log('OK',n); }
console.log('Nova UI audit static OK.');
