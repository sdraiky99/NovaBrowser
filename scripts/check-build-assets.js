'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const req=['.nvmrc','main.js','shell/index.html','shell/newtab.html','shell/quantum.css','shell/quantum-newtab.css','shell/nova50.js','shell/nova51.js','shell/nova52.js','shell/nova53.js','shell/quantum53.css','assets/icon.png','assets/icon.ico','assets/logo/nova-quantum.svg','assets/logo/nova-quantum-wordmark.svg','assets/logo/nova-quantum-reborn.svg','assets/reborn/quantum53-overview.png','assets/reborn/whatsnew-renderer.png','assets/reborn/whatsnew-performance.png','assets/reborn/store-extensions.png'];
let bad=[]; for(const f of req) if(!fs.existsSync(path.join(root,f))) bad.push(f);
const ico=fs.existsSync(path.join(root,'assets/icon.ico'))?fs.readFileSync(path.join(root,'assets/icon.ico')):null;
if(!ico || ico.length<500) bad.push('assets/icon.ico(valid size)');
if(ico){ try { const count=ico.readUInt16LE(4); const sizes=[]; for(let i=0;i<count;i++){ const off=6+i*16; const w=ico.readUInt8(off)||256; const h=ico.readUInt8(off+1)||256; sizes.push(w+'x'+h); } if(!sizes.some(x=>Number(x.split('x')[0])>=256 && Number(x.split('x')[1])>=256)) bad.push('assets/icon.ico has no 256x256 frame'); else console.log('Windows icon frames: '+sizes.join(', ')); } catch { bad.push('assets/icon.ico header unreadable'); } }
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const files=pkg.build?.files||[]; if(!files.some(x=>String(x)==='shell/**')) bad.push('package.json build.files shell/**');
if(pkg.version!=='5.3.0') bad.push('package version 5.3.0');
if(bad.length){console.error('BUILD ASSET CHECK FAILED');bad.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('Build assets OK · Reborn icon and shell files present');
