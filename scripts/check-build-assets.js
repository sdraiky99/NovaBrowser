'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const req=['.nvmrc','main.js','shell/index.html','shell/newtab.html','shell/quantum.css','shell/quantum-newtab.css','shell/nova50.js','assets/icon.png','assets/icon.ico','assets/logo/nova-quantum.svg','assets/logo/nova-quantum-wordmark.svg'];
let bad=[]; for(const f of req) if(!fs.existsSync(path.join(root,f))) bad.push(f);
const ico=fs.existsSync(path.join(root,'assets/icon.ico'))?fs.readFileSync(path.join(root,'assets/icon.ico')):null;
if(!ico || ico.length<500) bad.push('assets/icon.ico(valid size)');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const files=pkg.build?.files||[]; if(!files.some(x=>String(x)==='shell/**')) bad.push('package.json build.files shell/**');
if(pkg.version!=='5.0.0') bad.push('package version 5.0.0');
if(bad.length){console.error('BUILD ASSET CHECK FAILED');bad.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('Build assets OK · Quantum Prime icon and shell files present');
