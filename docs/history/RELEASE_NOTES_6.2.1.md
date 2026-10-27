# Nova 6.2.1 — Portable Stability Update

## Solo portable
- La publicación de Windows genera únicamente `Nova-Portable-6.2.1.exe`; no se compila ni publica un setup NSIS.
- Los recursos NSIS anteriores se han archivado en `docs/history/installer-resources-6.2.0/` y no forman parte del paquete de aplicación.

## Perfil portable
- En el modo portable, el perfil se guarda en `User Data/` junto al ejecutable portable.
- Se comprueba la escritura antes de activar esa ubicación. Si la carpeta no permite escribir, Nova usa el perfil normal de Windows y lo registra en el log.
- En el primer arranque portable, si `User Data/` está vacío, se intenta migrar el perfil anterior. Se omiten cachés y archivos de bloqueo de Chromium. Si la migración falla, se vacía el destino parcial y se vuelve al perfil de Windows.
- Se añade un canal IPC para consultar el estado y la ruta activa del perfil portable.

## Comprobación
- Se añaden pruebas automáticas de selección de carpeta, migración inicial, respeto de datos portables existentes y fallback a Windows.
- El paquete de código pasa comprobaciones estáticas y de regresión cuando se ejecuta `npm run check`. La compilación real del `.exe` debe verificarse en Windows con Node.js y dependencias instaladas.

## Límites
- El modo portable no se registra como navegador predeterminado desde el código de Nova.
- Las actualizaciones se aplican descargando y sustituyendo el portable cuando Nova está cerrada; realiza una copia de `User Data/` antes de cambiar de versión.


### Hotfix de GitHub Actions
- Añadido un preflight que valida que Windows solo compila el artefacto portable.
- Eliminada la necesidad de modificar `package.json` en el workflow.
- Se detecta la reintroducción accidental de NSIS antes de iniciar la compilación.
