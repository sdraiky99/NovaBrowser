# NOVA X QUANTUM 11.0.0

NOVA X QUANTUM is a complete evolution of NOVA X 10.0.0, built on the existing Electron project while preserving the established Windows application identity and the Personal profile's existing browser data.

## Visual identity
- New abstract circular logo with a transparent blue/violet/cyan gradient treatment.
- Quantum Aurora, Arctic, Obsidian, Neon, Solar and Mono palettes.
- Reworked navigation and new-tab shortcuts for the Quantum sections.
- Local gradient hero backgrounds; the main new-tab hero no longer depends on a third-party wallpaper host.

## New Quantum modules
- **App Center:** curated web-application shortcuts, a per-profile local library and isolated persistent app windows. This is not a Windows EXE store or a universal PWA installer.
- **Atlas:** locally stored projects with notes and web references.
- **Capsules:** uses NOVA's existing Time Machine snapshots and can include safe Quantum workspace metadata. Cookies, credentials and authenticated sessions are deliberately excluded.
- **Actions:** user-defined workflows that open validated HTTP(S) pages. Arbitrary JavaScript, shell commands and silent system actions are not supported.
- **Themes:** six Quantum palettes and locally stored accent variants. Arbitrary third-party theme-code packages are not loaded.
- **Vault:** local credential storage encrypted through Electron `safeStorage` when the operating system reports encryption available. Save, list, copy and delete are supported; browser autofill is not included in this edition.
- **Profiles:** additional Chromium session partitions with separate renderer state; the existing Personal profile continues using the original `persist:web` partition and `nova-state` key.
- **Recovery and Migration:** safe-mode restart and diagnostics; import remains limited to supported bookmarks/history data and does not migrate passwords, cookies or authenticated sessions.

## Reliability and security work
- Registered the `web-contents-created` handler before creating the main window.
- Corrected the default local Ollama endpoint to `127.0.0.1:11434`.
- Added an explicit one-session permission prompt for camera, microphone, geolocation and notifications in isolated App Center windows; permissions are not inherited from the main browser.
- Clears a copied Vault value after 20 seconds only when the clipboard still contains that same value.
- Preserved `appId: com.nova.browser`, Electron application name and the Personal profile storage identity to avoid treating this as a fresh install.
- Configured per-user NSIS Setup without elevation and a separate Portable data directory.
- Added a release workflow that creates the Setup updater manifest (`latest.yml`) and SHA-256 checksums. Portable updates remain manual.

## Compatibility notes
- Electron's Chrome extension support is partial. This build does not claim universal Chrome Web Store compatibility and does not load `.crx` files directly. Use the extension manager's supported unpacked-extension flow.
- App Center entries open websites in isolated windows; websites may still require their own login and may change their behavior independently. These windows have their own permission prompts and do not inherit the main browser Shield filtering or statistics in this edition.
- System apps (`.exe`/`.msi`) are not installed or managed by App Center.
- App Center windows ask separately before granting camera, microphone, geolocation or notification access. These temporary grants are not inherited from the main browser.

## Validation limitations
The source checks are static/local. This environment did not build Windows Setup or Portable executables, run Electron's graphical interface on Windows 11, or verify a real GitHub release/update. See `VALIDATION_11.0.0.txt` for the precise scope.
