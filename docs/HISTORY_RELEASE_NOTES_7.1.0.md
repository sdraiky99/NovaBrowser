# NOVA 7 — 7.1.0

Actualización de motor y dependencias sobre la entrega 7.0.0, sin cambios de comportamiento en la interfaz.

## Cambios incluidos en esta entrega

- Motor actualizado a Electron 45.3.0, que incorpora Chromium 156.0.8078.96 y Node.js 24.22.2.
- electron-updater 6.8.11 para el canal de actualizaciones de GitHub.
- Bloqueador Ghostery (`@ghostery/adblocker-electron`) actualizado a 2.20.3.
- sql.js actualizado a 1.16.0; cross-fetch se mantiene en 4.1.0 (última publicada).
- electron-builder 26.18.0 para los instaladores Setup y Portable.
- Artefactos renombrados: `NOVA-7-Setup-7.1.0.exe` y `NOVA-7-Portable-7.1.0.exe`.
- Notas de versión y validación aisladas por entrega; el historial 7.0.0 se conserva en `docs/`.

## Compatibilidad verificada con Electron 45

- El preload con sandbox solo usa `require('electron')` y `URL` global, sin los shims de Node eliminados en Electron 45 (`events`, `timers`, `url`, `Buffer`, `setImmediate`).
- No se usan `safeStorage` síncrono (deprecado), `desktopCapturer` con `chromeMediaSource: 'desktop'`, `contentTracing` heredado ni `net.request` con `Sec-Fetch-Dest` de navegación.
- `clipboard.writeText` en el proceso principal sigue siendo válido; el renderer usa `navigator.clipboard`.
- Configuración de seguridad del renderer sin cambios: sandbox activo, `contextIsolation: true`, `nodeIntegration: false`.

## Distribución

- Setup: `NOVA-7-Setup-7.1.0.exe` (instalación por usuario, sin elevación).
- Portable: `NOVA-7-Portable-7.1.0.exe` (datos independientes junto al ejecutable si la carpeta es escribible).
- Actualización: los usuarios de 7.0.0 con el canal de actualizaciones de GitHub reciben 7.1.0 al publicar el release; el perfil y las preferencias se conservan.

## Validación

Comprobaciones estáticas y pruebas automatizadas descritas en `VALIDATION_7.1.0.txt`. La compilación de los ejecutables Windows debe ejecutarse en GitHub Actions o en Windows con Node.js 22.12.0 o superior.
