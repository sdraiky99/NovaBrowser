# Nova 3.0.1 — QA verification

## Scope

This verification covers the repaired Nova 3.0.1 shell based on the 3.0.0 QA hotfix.

## Automated checks

- `node scripts/check-project.js` — project structure, version, active scripts, IPC coverage, syntax, assets and bridges.
- `node scripts/qa-vm-3.0.1.js` — browser-JavaScript runtime harness with a real VM and mocked Electron/webview APIs.
- `node --check` across main, migration, account service/server and all shell JavaScript.

## Latest result

- Runtime QA: **24/24 passed**
- Startup ReferenceErrors: **0**
- Internal feature routes registered: **50**
- Command Center actions checked: **32 callbacks available**
- Renderer `ipc.invoke` channels checked against `ipcMain.handle`: **38 used / 0 missing**
- DOCX XML payload test: **passed**
- ZIP/package integrity: checked before release packaging

## Regressions covered

- Startup scope/ReferenceErrors
- IA key/send/new conversation
- Internal-route aliases and unknown-route handling
- Web-tab selection while viewing `nova://` pages
- Link-to-new-tab injection
- Tab `+` placement
- Web Capture on the active web tab
- Reader+ on the active web tab
- Collections save from the active page
- Session save and state IPC
- Island creation and tab assignment
- Safari mode toggle/restoration
- Nova AI response persistence
- Command Center creation
- Writer DOCX export
- Performance mode IPC
- Download folder IPC
- Backup export
- Super Cat initialization
- Action callback availability

## Known environment limits

Electron itself is not installed in this environment, so the packaged application window was not launched here and the Windows `.exe` was not built here. Chromium headless was available but was not reliable enough to use as a substitute for an Electron process.

The project still has two known production-hardening warnings inherited from the base: the main renderer uses Node integration/context isolation settings that should eventually be migrated to a preload/contextBridge design, and this checkout has no npm lockfile because the registry/cache is unavailable offline.
