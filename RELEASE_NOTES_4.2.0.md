# Nova 4.2.0 — Foundation

Nova 4.2.0 is a cleanup and stability release focused on a professional interface, safer renderer isolation, and safer upgrades.

## Highlights
- Unified appearance: Sistema, Claro u Oscuro. Legacy theme packs and per-site themes are removed.
- Single stable Nova icon and simplified splash/installer assets.
- Fresh NSIS installer configuration; user data is preserved on uninstall and during updates.
- Preferences are versioned and backed up before writes (`prefs.json.bak`).
- Renderer uses a preload bridge instead of direct Electron/Node access.
- Professional inline SVG icon set for the browser chrome.
- Cross-platform syntax and project QA scripts for GitHub/CI.

## Upgrade notes
Nova keeps user data under Electron's `userData` directory. Existing legacy theme preferences are normalized to Sistema/Claro/Oscuro on startup.

> Runtime installer verification still needs to be performed on Windows because this repository package is prepared here without a local Electron runtime/cache.
