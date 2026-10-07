'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const fail = m => { console.error('BUILD ASSET FAIL:', m); process.exit(1); };
const p = path.join(root, 'assets', 'icon.ico');
if (!fs.existsSync(p)) fail('assets/icon.ico is missing');
const b = fs.readFileSync(p);
if (b.length < 22) fail('assets/icon.ico is too small to be a valid ICO');
if (b.readUInt16LE(0)!==0 || b.readUInt16LE(2)!==1) fail('assets/icon.ico has an invalid header');
const n=b.readUInt16LE(4);
if(n<1) fail('assets/icon.ico contains no image entries');
let has256=false;
for(let i=0;i<n;i++){
  const off=6+i*16;
  if(off+16>b.length) fail('assets/icon.ico directory is truncated');
  const w=b[off]||256, h=b[off+1]||256;
  if(w>=256&&h>=256) has256=true;
}
if(!has256) fail('assets/icon.ico has no 256x256 or larger image');
console.log(`Build assets OK · Windows ICO ${n} frames · 256x256+ present`);
