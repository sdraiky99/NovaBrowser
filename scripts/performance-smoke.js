#!/usr/bin/env node
'use strict';
const { performance } = require('node:perf_hooks');
const assert = require('node:assert/strict');
const { resolveNavigation } = require('../shell/navigation.js');
const samples = [];
const rounds = 7;
const iterations = 10000;
for (let round = 0; round < rounds; round++) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const result = resolveNavigation(i % 2 ? 'example.com/docs' : `nova performance test ${i}`);
    assert.ok(result.startsWith('https://'));
  }
  samples.push(performance.now() - start);
}
samples.sort((a, b) => a - b);
const median = samples[Math.floor(samples.length / 2)];
const result = {
  test: 'navigation-resolution-microbenchmark',
  iterationsPerRound: iterations,
  rounds,
  medianMs: Number(median.toFixed(2)),
  operationsPerSecond: Math.round(iterations / (median / 1000)),
  scope: 'Pure URL/search resolution only; does not measure Electron startup, page load, CPU/RAM of web contents, or Windows packaging.'
};
console.log(JSON.stringify(result, null, 2));
if (!Number.isFinite(median) || median <= 0) process.exitCode = 1;
