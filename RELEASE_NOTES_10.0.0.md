# NOVA X 10.0.0 — First Generation Rebuild

## Main changes

- A radical new modern interface for the window chrome, horizontal tabs, navigation toolbar, address field, sidebar, bookmarks bar, panels and spacing. The original NOVA mark is preserved.
- Horizontal and vertical tab layouts are both supported and can be switched without discarding the active session.
- NOVA Shield moves to a compact upper-toolbar control. Its counter and panel use the Ghostery `request-blocked` event and expose per-origin/session aggregates, request types and destination hostnames. Full request URLs are not stored in the statistics.
- The Shield panel provides best-effort ad/tracker/other labels from exposed filter-rule text. Unrecognised matches are kept in “Otros”; no synthetic counts are generated.
- The first-run guide is redesigned as five skippable steps and can be replayed.
- Electron is updated to 45.4.1 (bundled Chromium 156.0.8078.100).
- `@ghostery/adblocker-electron` is updated to 2.20.3 and `electron-builder` to 26.18.1.
- Setup remains per-user and non-elevated. Portable keeps a separate `User Data` directory.

## Preserved

Existing bookmarks, history, downloads, workspaces, news, permissions, extensions interface, Reader Mode, split view, imports, local backups, Time Machine, Companion, Gaming and other utility panels are retained from the NOVA 9 codebase.

## Not claimed as verified

This source package does not include built Windows executables. Windows installation, browser runtime, Electron 45 webview compatibility, Ghostery event telemetry, UI interaction, Setup/Portable separation and upgrade behavior still require end-to-end tests on Windows 11.
