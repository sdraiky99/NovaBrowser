# Nova Browser

Navegador de escritorio basado en Electron/Chromium con interfaz propia (barra superior, sidebar, nueva pestaña, perfiles, Extension Center y recuperación de sesión). Windows y Linux (RPM/AppImage).

Versión actual: **5.3.1** — ver `RELEASE_NOTES_5.3.1.md` y `CHANGELOG.md`.

## Requisitos

- Node.js **22.12.0** o superior (`.nvmrc`, `engines`).
- Windows 10/11 para generar el instalador `.exe`; Linux para RPM/AppImage.

## Desarrollo

```bash
npm install --engine-strict
npm run check     # QA estático y funcional (sin Electron)
npm start         # arranca Nova
npm run dist:win  # instalador NSIS + portable (ejecuta antes las comprobaciones de build)
```

No hay `package-lock.json` en este repositorio; para generar uno real (requiere red) ejecuta `npm install --package-lock-only`, súbelo y cambia la CI a `npm ci`.

## Arquitectura (real, tal como está)

- `main.js`: proceso principal, ventanas, sesión, descargas, permisos, extensiones, IPC (~50 canales), actualizador.
- `shell/index.html`: renderer de la interfaz. Sobre él se cargan, en orden, las capas históricas `extras*.js`, `nova25…nova53.js`; cada versión añadió una capa. Es deuda técnica conocida.
- Las pestañas son `<webview>` con `partition` por perfil.
- Datos de usuario en `userData`: `prefs.json` (+`.bak`), `state-backup.json` (+`.bak`), `real-extensions.json`. El instalador no los borra (`deleteAppDataOnUninstall: false`).
- `migration.js`: migración de datos de versiones antiguas. `account-*`: servicio de cuenta opcional.

## Extensiones

El Extension Center muestra un catálogo curado con enlaces a la Chrome Web Store y permite cargar extensiones Chromium desde carpetas locales (se restauran al iniciar). Nova no descarga ni instala código de extensiones silenciosamente. La compatibilidad completa con extensiones de la Chrome Web Store **no está verificada**.

## Estado del proyecto

| Área | Estado |
|---|---|
| Compilación de todos los JS, cableado de scripts, IPC, assets, build.files, ICO | VERIFICADO (`npm run check`) |
| Migración y recuperación de `prefs.json` | VERIFICADO con pruebas funcionales |
| Arranque, pestañas, nueva pestaña, extensiones reales, instalador, actualizador | NO COMPROBADO en este entorno (requiere Electron/Windows) |
| Seguridad del renderer | **Limitación conocida:** el shell usa `nodeIntegration: true` y `contextIsolation: false`. Migrar a preload/contextBridge exige reescribir ~28 scripts que usan `require()` y no se ha hecho |
| Rediseño completo, familia de iconos, Workspaces, Ctrl+K, modo lectura, panel de rendimiento | No implementado en esta versión |
| Imágenes de las bienvenidas 1.6.4/2.0 (`assets/welcome/`) | Faltan; las pantallas antiguas muestran imagen rota |

## Solución de problemas

- Si Nova no conserva ajustes: revisa `userData/prefs.json.corrupt-*` y `prefs.json.bak`.
- CI roja: ejecuta `npm run check` en local; indica el archivo y la relación rota.

## Licencia

Ver `LICENSE.txt`.
