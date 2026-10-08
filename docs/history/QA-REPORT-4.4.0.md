# Nova 4.4.0 — QA Report

Estado: PASSED (static/project QA)

- Package version: 4.4.0
- Main shell preserved as additive base
- `nova432.js` + `nova44.js` loaded
- JavaScript syntax verified
- Active shell scripts verified
- IPC invoke channels checked against `ipcMain.handle`
- Electron Builder includes `shell/**`
- Only `RELEASE_NOTES_4.4.0.md` is present as release notes

Pendiente de validación externa: build y ejecución del instalador Windows real en GitHub Actions.
