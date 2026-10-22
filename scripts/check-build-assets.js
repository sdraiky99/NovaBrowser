const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const p=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const bad=[];
if(p.version!=='6.0.1')bad.push('package version');
for(const f of ['assets/brand/nova.ico','assets/brand/nova-icon.png','build/installerHeader.bmp','build/installerSidebar.bmp','build/uninstallerSidebar.bmp','build/installer.nsh','shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','shell/extensions.js','shell/navigation.js','shell/newtab-preload.js'])if(!fs.existsSync(path.join(root,f)))bad.push('missing '+f);
const ns=fs.readFileSync(path.join(root,'build','installer.nsh'),'utf8');
if(!ns.includes('6.0.1'))bad.push('installer version');
if(/1\.1\.0|1\.6\.4|2\.0\.0|3\.0\.1|4\.4\.0|5\.2\.0/.test(ns))bad.push('stale installer version');
const build=p.build||{};const list=Array.isArray(build.files)?build.files.join('\n'):'';
if(!list.includes('shell/**')||!list.includes('assets/**'))bad.push('build file globs');
try{const b=fs.readFileSync(path.join(root,'assets','brand','nova-icon.png'));if(b.length<1024)bad.push('icon png suspiciously small')}catch{}
try{const ico=fs.readFileSync(path.join(root,'assets','brand','nova.ico'));if(ico.length<1024)bad.push('ico suspiciously small')}catch{}
for(const [file,width,height] of [['build/installerHeader.bmp',150,57],['build/installerSidebar.bmp',164,314],['build/uninstallerSidebar.bmp',164,314]]){try{const b=fs.readFileSync(path.join(root,file));if(b.toString('ascii',0,2)!=='BM'||b.readInt32LE(18)!==width||Math.abs(b.readInt32LE(22))!==height||b.readUInt16LE(28)!==24)bad.push('invalid bitmap resource '+file)}catch{bad.push('unreadable bitmap '+file)}}
if(bad.length){console.error(bad.join('\n'));process.exit(1)}console.log('BUILD ASSETS OK (icons, installer branding, and bitmap dimensions)');
