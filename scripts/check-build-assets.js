#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));const bad=[];
if(pkg.version!=='11.0.0')bad.push('package version');
if(JSON.stringify(pkg.build?.win?.target)!==JSON.stringify(['nsis','portable']))bad.push('Windows target must include NSIS and Portable');
if(pkg.build?.nsis?.artifactName!=='NOVA-X-QUANTUM-Setup-${version}.${ext}')bad.push('setup artifact name');
if(pkg.build?.nsis?.perMachine!==false||pkg.build?.nsis?.allowElevation!==false||pkg.build?.nsis?.oneClick!==false||pkg.build?.nsis?.allowToChangeInstallationDirectory!==false)bad.push('setup must be assisted, per-user and non-elevated');
if(pkg.build?.nsis?.shortcutName!=='NOVA X QUANTUM')bad.push('Quantum shortcut name');
if(pkg.build?.portable?.artifactName!=='NOVA-X-QUANTUM-Portable-${version}.exe')bad.push('portable artifact name');
for(const file of ['portable-user-data.js','permission-policy.js','assets/brand/nova.ico','assets/brand/nova-icon.png','assets/brand/nova-mark.svg','shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','shell/quantum.js','shell/extensions.js','shell/navigation.js','shell/newtab-preload.js'])if(!fs.existsSync(path.join(root,file)))bad.push(`missing ${file}`);
const files=Array.isArray(pkg.build?.files)?pkg.build.files.join('\n'):'';if(!files.includes('shell/**')||!files.includes('assets/**')||!files.includes('portable-user-data.js')||!files.includes('migration.js')||!files.includes('permission-policy.js'))bad.push('missing packaged runtime files');
if(files.includes('scripts/**')||files.includes('build/**'))bad.push('QA/installer resources must not be runtime assets');
try{const png=fs.readFileSync(path.join(root,'assets/brand/nova-icon.png'));if(png.length<1024||png.toString('ascii',1,4)!=='PNG')bad.push('icon PNG invalid');else if(png[25]!==6)bad.push('icon PNG must preserve alpha transparency');}catch{bad.push('icon PNG unreadable');}
try{const svg=fs.readFileSync(path.join(root,'assets/brand/nova-mark.svg'),'utf8');if(!/<svg\b/.test(svg)||!/<path\b/.test(svg)||!/id="front"/.test(svg)||/<rect\b[^>]*fill="(?:#fff|white|#ffffff)"/i.test(svg))bad.push('vector brand SVG invalid or boxed');}catch{bad.push('brand SVG unreadable');}
try{const ico=fs.readFileSync(path.join(root,'assets/brand/nova.ico'));if(ico.length<1024||ico.readUInt16LE(0)!==0||ico.readUInt16LE(2)!==1)bad.push('icon ICO invalid');}catch{bad.push('icon ICO unreadable');}
const icons=fs.readdirSync(path.join(root,'assets/icons')).filter(f=>f.endsWith('.svg'));if(icons.length<15)bad.push('insufficient local SVG icons');
if(bad.length){console.error(bad.join('\n'));process.exit(1)}console.log(`BUILD ASSETS OK: transparent Quantum brand; Setup per-user + Portable; ${icons.length} local SVG icons.`);
