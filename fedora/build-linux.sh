#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
command -v node >/dev/null || { echo 'Node.js 22+ es necesario.'; exit 1; }
command -v npm >/dev/null || { echo 'npm es necesario.'; exit 1; }
npm install --no-audit --no-fund
npm run check
npm run dist:linux
printf '\nArtefactos Linux en %s/dist\n' "$ROOT"
