const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'); let fail=0; const err=m=>{console.error('FAIL',m);fail++}, ok=m=>console.log('OK',m);
const p=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if(p.version!=='5.4.1')err('package version'); else ok('version 5.4.1');
const files=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','dist'].includes(e.name))continue;const f=path.join(d,e.name);e.isDirectory()?walk(f):files.push(f)}})(root);
if(files.length>=100)err('file count '+files.length);else ok('file count '+files.length+' (<100)');
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js','shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','shell/extensions.js','assets/brand/nova-icon.png','assets/brand/nova.ico','build/installer.nsh'])if(!fs.existsSync(path.join(root,f)))err('missing '+f);
const html=fs.readFileSync(path.join(root,'shell/index.html'),'utf8'), js=fs.readFileSync(path.join(root,'shell/nova.js'),'utf8'), css=fs.readFileSync(path.join(root,'shell/nova.css'),'utf8');
for(const id of ['tabs','newTab','toolbar','address','addressSuggestions','back','forward','reload','star','menuButton','sidebar','browserArea','views'])if(!html.includes('id="'+id+'"'))err('missing '+id);
for(const marker of ['function newTab','function closeTab','function reopenClosedTab','function showTabMenu','function renderOmniboxSuggestions','function renderSettings','function showTour','function showWhatsNew','function showCommand'])if(!js.includes(marker))err('missing '+marker);
if(!js.includes("e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='t'"))err('reopen shortcut');
if(!js.includes("state.showTourOnStart"))err('tour persistence');
if(!js.includes("localStorage.getItem(key)==='1'"))err('whats new gate');
if(!css.includes('.address-suggestions'))err('omnibox css');
const roots=fs.readdirSync(root).filter(x=>/^RELEASE_NOTES_.*\.md$/i.test(x));if(roots.length!==1||roots[0]!=='RELEASE_NOTES_5.4.1.md')err('release notes root');
const ns=fs.readFileSync(path.join(root,'build','installer.nsh'),'utf8');if(!ns.includes('5.4.1'))err('installer version'); if(/1\.1\.0|1\.6\.4|2\.0\.0|3\.0\.1|4\.4\.0|5\.3\.4/.test(ns))err('stale installer version');
for(const rel of ['shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','package.json']){const s=fs.readFileSync(path.join(root,rel),'utf8');if(/Cyberpunk 2077|Nova 4\.4|Nova 4\.1|themes\.css|nova-runtime\.js|nova532-ui\.js/.test(s))err('legacy marker in '+rel)}
if(fail)process.exit(1);console.log(JSON.stringify({ok:true,version:p.version,files:files.length},null,2));
