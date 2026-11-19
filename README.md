# NOVA X — Browser 10.0.0

NOVA X is a major rebuild of the NOVA desktop browser, based on Electron and its bundled Chromium engine. This first development package uses a radical new modern interface while preserving the browser features and local profile data model inherited from NOVA 9.

## What is new in NOVA X

- **New modern browser chrome:** redesigned tab strip, navigation toolbar, address field, sidebar, bookmarks bar, internal panels and spacing. The NOVA symbol remains unchanged. Historical visual modes remain available as opt-in recreations.
- **Both tab layouts:** switch between horizontal and vertical tabs without rebuilding the session. Pinned tabs, groups, tab restoration and split view remain available.
- **Compact NOVA Shield:** a small counter in the upper toolbar shows actual blocked network requests for the active site. The panel reports page/session totals, resource types and destination hostnames. Statistics are session-only and retain origins and hostnames, not full request URLs. Ads/tracker labels are best-effort classifications from exposed rule text; unclassified matches remain in “Otros”.
- **New welcome tour:** five short, skippable steps for the browser, navigation, tab layouts, Shield and personalisation. It can be replayed from the welcome action in NOVA.
- **Runtime update:** Electron `45.4.1`, which bundles Chromium `156.0.8078.100`. Chromium is upgraded together with Electron, not separately.
- **Updated blocker engine:** `@ghostery/adblocker-electron` `2.20.3`.

## Preserved features

NOVA keeps the existing local-first browser features: bookmarks, history, downloads, workspaces, RSS news, extensions (subject to Electron compatibility), per-site permissions, Reader Mode, split view, import of supported bookmarks/history, local backups, Time Machine, Companion, Gaming, Media, Translate, Focus and Nova Assist via local Ollama.

The old Windows XP, Windows 7 Aero, Firefox Classic, Firefox 2017, Chrome 2017 and Edge Legacy modes remain visual recreations. They use the current Chromium engine; they are not historical browser engines.

## Windows distributions

The project is configured to produce two separate Windows deliverables:

- `NOVA-X-Setup-10.0.0.exe` — assisted per-user installer; no administrator elevation and no per-machine installation.
- `NOVA-X-Portable-10.0.0.exe` — portable app with its own `User Data` folder, separate from the Setup profile.

The ZIP supplied in this milestone contains the source project, not compiled Windows executables. Build and verify the Windows artifacts on a Windows machine or through the included GitHub Actions workflow.

## Build on Windows

Requires Node.js `>=22.12.0` and npm.

```powershell
npm install --no-audit --no-fund --engine-strict
npm run check
npm run dist:setup
npm run dist:portable
```

To build both packages sequentially:

```powershell
npm run dist:win
```

## Important validation notes

Static checks are included for JavaScript syntax, project structure, security boundaries, distribution configuration, portable profile isolation, and the browser feature contract. They do not replace running the application on Windows. The first NOVA X build still needs interactive testing of Electron 45 webviews, Ghostery request events and counters, both tab layouts, the onboarding tour, Setup permissions, Portable profile isolation and upgrades from NOVA 9.

Known inherited limitations remain: the import flow does not import passwords; NOVA does not yet provide its own audited password vault or account-based sync; Google Chrome Sync is not supported; extension and codec compatibility varies with Electron.

See `RELEASE_NOTES_10.0.0.md` and `VALIDATION_10.0.0.txt`.
