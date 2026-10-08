const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');let fail=0;const err=m=>{console.error('FAIL',m);fail++};
const html=fs.readFileSync(path.join(root,'shell/index.html'),'utf8');
const ids=['windowbar','tabs','toolbar','address','sidebar','browserArea','views','drawer','toastStack'];
for(const id of ids)if(!html.includes(`id="${id}"`))err('missing UI id '+id);
if((html.match(/id="newTab"/g)||[]).length!==1)err('new tab control count');
if(!html.includes('shell')){} // no-op marker
const js=fs.readFileSync(path.join(root,'shell/nova.js'),'utf8');
for(const marker of ['function newTab','function closeTab','function toggleBookmark','function renderSettings','function renderExtensions','function renderPerformance','function showWhatsNew','function showTour','function showCommand'])if(!js.includes(marker))err('missing renderer feature '+marker);
if(js.includes("showWhatsNew(false)")){} else err('whats new bootstrap missing');
if(!js.includes(`localStorage.getItem(key)==='1'`))err('whats new one-time gate missing');
const nt=fs.readFileSync(path.join(root,'shell/newtab.html'),'utf8');if(!nt.includes("let topic='todas'"))err('news default is not all');
if(!js.includes('assets/brand/nova-icon.png'))err('brand asset missing');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json')));if(pkg.version!=='5.3.3')err('package version');
if(!pkg.scripts.check.includes('qa:5.3.3'))err('check script');
const count=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','dist'].includes(e.name))continue;const f=path.join(d,e.name);e.isDirectory()?walk(f):count.push(f)}})(root);if(count.length>=100)err('file count '+count.length);
const legacy=/Cyberpunk 2077|Nova 4\.4|Nova 4\.1|General\s*<|Estudio\s*<|themes\.css|nova-runtime\.js|nova532-ui\.js/;
for(const rel of ['shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css'])if(legacy.test(fs.readFileSync(path.join(root,rel),'utf8')))err('legacy marker in '+rel);
if(fail){process.exit(1)}console.log(JSON.stringify({version:pkg.version,files:count.length,ok:true},null,2));
