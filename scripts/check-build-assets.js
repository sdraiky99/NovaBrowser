#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const bad = [];
if (pkg.version !== '6.2.2') bad.push('package version');
if (JSON.stringify(pkg.build?.win?.target) !== JSON.stringify(['nsis','portable'])) bad.push('Windows target must include NSIS and Portable');
if (pkg.build?.nsis?.artifactName !== 'Nova-Setup-${version}.${ext}') bad.push('setup artifact name');
if (pkg.build?.nsis?.perMachine !== false || pkg.build?.nsis?.allowElevation !== false || pkg.build?.nsis?.oneClick !== false || pkg.build?.nsis?.allowToChangeInstallationDirectory !== false) bad.push('setup must be assisted, per-user, and avoid protected path selection');
if (pkg.build?.portable?.artifactName !== 'Nova-Portable-${version}.exe') bad.push('portable artifact name');
for (const file of ['portable-user-data.js','permission-policy.js','assets/brand/nova.ico','assets/brand/nova-icon.png','shell/index.html','shell/newtab.html','shell/nova.js','shell/nova.css','shell/extensions.js','shell/navigation.js','shell/newtab-preload.js','assets/icons/plus.svg','assets/icons/settings.svg']) if (!fs.existsSync(path.join(root,file))) bad.push(`missing ${file}`);
const files=Array.isArray(pkg.build?.files)?pkg.build.files.join('\n'):'';
if (!files.includes('shell/**') || !files.includes('assets/**') || !files.includes('portable-user-data.js') || !files.includes('migration.js') || !files.includes('permission-policy.js')) bad.push('missing packaged runtime files');
if (files.includes('docs/**') || files.includes('scripts/**') || files.includes('build/**')) bad.push('historical/QA/installer resources must not be runtime assets');
try { const png=fs.readFileSync(path.join(root,'assets/brand/nova-icon.png')); if(png.length<1024||png.toString('ascii',1,4)!=='PNG')bad.push('icon PNG invalid'); } catch {bad.push('icon PNG unreadable');}
try {const ico=fs.readFileSync(path.join(root,'assets/brand/nova.ico'));if(ico.length<1024)bad.push('icon ICO suspiciously small');}catch{bad.push('icon ICO unreadable');}
const svgFiles=fs.readdirSync(path.join(root,'assets/icons')).filter(f=>f.endsWith('.svg'));
if(svgFiles.length<15)bad.push('insufficient local SVG icons');
if(bad.length){console.error(bad.join('\n'));process.exit(1);}
console.log(`BUILD ASSETS OK: Setup per-user + Portable; ${svgFiles.length} local SVG icons.`);
