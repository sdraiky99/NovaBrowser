"use strict";
const fs=require('fs'), path=require('path');
for (const rel of ['dist','release','.cache']) { try { fs.rmSync(path.join(__dirname,'..',rel),{recursive:true,force:true}); } catch {} }
console.log('Nova: artefactos de build eliminados.');
