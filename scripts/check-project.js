const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const p=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const fail=m=>{throw new Error(m)},ok=m=>console.log('OK',m);
if(p.version!=='5.4.0')fail('version '+p.version);ok('version 5.4.0');
const files=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','dist'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())walk(f);else files.push(path.relative(root,f))}})(root);
if(files.length>=100)fail('repository has '+files.length+' files; must be under 100');ok('repository files '+files.length+' (<100)');
for(const f of ['main.js','migration.js','account-service.js','account-server/server.js','shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','shell/extensions.js','assets/brand/nova-icon.png','assets/brand/nova.ico','build/installer.nsh','build/installerHeader.bmp','build/installerSidebar.bmp','.github/workflows/build.yml'])if(!fs.existsSync(path.join(root,f)))fail('missing '+f);else ok('required '+f);
const h=fs.readFileSync(path.join(root,'shell/index.html'),'utf8');
if(!h.includes('<script src="nova.js"></script>'))fail('clean renderer loader missing');
for(const x of ['nova-runtime.js','nova532-ui.js','nova44','Cyberpunk 2077','Estudio','Themes','Fondos','Mods'])if(h.includes(x))fail('legacy renderer text '+x);ok('clean renderer');
for(const rel of ['shell/themes.css','assets/logos','shell/nova-runtime.js','shell/nova532-ui.js','shell/quantum53.css','shell/quantum.css'])if(fs.existsSync(path.join(root,rel)))fail('legacy artifact '+rel);ok('legacy artifacts removed');
const roots=fs.readdirSync(root).filter(x=>/^RELEASE_NOTES_.*\.md$/i.test(x));if(roots.length!==1||roots[0]!=='RELEASE_NOTES_5.4.0.md')fail('release notes root');ok('current release notes isolated');
for(const rel of ['shell','main.js','package.json']){const filesToScan=[];const abs=path.join(root,rel);const scan=f=>{const st=fs.statSync(f);if(st.isDirectory()){for(const x of fs.readdirSync(f))scan(path.join(f,x))}else if(/\.(js|html|json)$/.test(f)||path.basename(f)==='README.md')filesToScan.push(f)};scan(abs);for(const f of filesToScan){const s=fs.readFileSync(f,'utf8');if(/Nova 4\.4|Nova 4\.1|Cyberpunk 2077|Nova 3\.0\.1|5\.2\.0/.test(s)&&!f.includes('docs'))fail('stale text in '+path.relative(root,f))}}
ok('stale source text scan');
