'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const files = Array.isArray(pkg.build?.files) ? pkg.build.files : [];
const required = ['main.js', 'preload.js', 'migration.js', 'shell/**', 'assets/**', 'package.json'];
const missing = required.filter(x => !files.includes(x));
if (missing.length) {
  console.error('Packaging check failed: electron-builder is missing:', missing.join(', '));
  process.exit(1);
}
if (!fs.existsSync(path.join(root, 'preload.js'))) {
  console.error('Packaging check failed: preload.js does not exist');
  process.exit(1);
}
console.log('Nova packaging check OK · preload.js is explicitly included');
