# NOVA X QUANTUM — 11.0.0

NOVA X QUANTUM is a Windows Electron browser built on the existing NOVA X profile and installation identity. It keeps the current Chromium engine and adds a local-first suite of workspace, app and customization features.

## Quantum features

- **Quantum Atlas:** local project maps that collect links and short references.
- **Quantum Capsules:** snapshots of browser context, tabs, bookmarks, history, appearance and workspaces. Cookies, passwords and authenticated web sessions are never included.
- **Quantum Actions:** user-created workflows that open up to 12 HTTP(S) destinations. No downloaded scripts or arbitrary command execution.
- **App Center:** curated web-app shortcuts saved per browser profile and opened in independent windows with persistent per-app sessions. This is not a general Windows EXE store and does not claim to turn every site into an installable PWA.
- **Quantum Themes:** Aurora, Arctic, Obsidian, Neon, Solar and Mono, plus the existing retro UI recreations.
- **Quantum Vault:** encrypted credential storage through Electron `safeStorage` when the OS encryption facility is available. This release supports saving/copying/deleting entries; autofill is not implemented.
- **Profiles:** separate Chromium partitions and separate NOVA renderer state for additional profiles. The existing Personal profile keeps the legacy `persist:web` partition.
- **Recovery and Migration:** diagnostics, safe mode, cache cleanup, and compatible bookmark/history import.

## Extension compatibility

Electron supports a subset of Chromium extension APIs and loads unpacked extension directories. This release does not implement direct CRX loading or universal Chrome Web Store compatibility. Use the existing unpacked-extension loader and review permissions before loading an extension.

## Windows distribution

- Setup: per-user NSIS installation, no elevation, preserving the existing NOVA app identity and user-data location.
- Portable: separate `User Data` beside the executable, isolated from Setup.
- Automatic update metadata is generated and published by the tagged GitHub release workflow for Setup packages. Portable updates remain manual.

## Development

Requires Node.js 22.12 or newer.

```bash
npm install --no-audit --no-fund
npm run check
npm start
```

Build on Windows: `npm run dist:win`.

## Validation boundaries

Static checks can run cross-platform. A Windows build, Electron runtime QA, profile persistence, updater installation and real extension compatibility still require testing on Windows. The source bundle is not a prebuilt EXE release.
