const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');const p=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));const bad=[];
if(p.version!=='5.3.2')bad.push('package version');
for(const f of ['assets/icon.ico','assets/icon.png','build/installerHeader.bmp','build/installerSidebar.bmp','build/uninstallerSidebar.bmp','build/installer.nsh','shell/nova-runtime.js'])if(!fs.existsSync(path.join(root,f)))bad.push('missing '+f);
const ns=fs.readFileSync(path.join(root,'build','installer.nsh'),'utf8');if(!ns.includes('5.3.2'))bad.push('installer version');if(/1\.1\.0|1\.6\.4|2\.0\.0|5\.2\.0/.test(ns))bad.push('stale installer version');
const build=p.build||{};const list=Array.isArray(build.files)?build.files.join('\n'):'';if(!list.includes('shell/**')||!list.includes('assets/**'))bad.push('build file globs');
try{const b=fs.readFileSync(path.join(root,'assets','icon.png'));if(b.length<1024)bad.push('icon.png suspiciously small')}catch{}
if(bad.length){console.error(bad.join('\n'));process.exit(1)}console.log('BUILD ASSETS OK');
