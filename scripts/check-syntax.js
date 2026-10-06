'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const files = [
  'main.js', 'preload.js', 'migration.js', 'account-service.js', 'account-server/server.js',
  ...fs.readdirSync(path.join(root, 'shell')).filter(name => name.endsWith('.js')).map(name => path.join('shell', name)),
];
let failed = false;
for (const file of files) {
  const target = path.join(root, file);
  const result = spawnSync(process.execPath, ['--check', target], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout || `Syntax error: ${file}\n`);
  }
}
if (failed) process.exit(1);
console.log(`Nova syntax check OK · ${files.length} JavaScript files`);
