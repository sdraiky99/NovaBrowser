# Nova 2.5.2 — limpieza definitiva

Esta versión retira del árbol ejecutable las capas históricas `extras.js`, `extras2.js` … `extras12.js`, `supercat.js` y `nova25.js` como ficheros independientes. Su código compatible está consolidado en `shell/features.js`.

## Runtime activo

- `shell/index.html`: HTML/CSS de la shell.
- `shell/shell.js`: navegación base, pestañas, grupos, apertura de enlaces, `+` y atajos.
- `shell/features.js`: funcionalidades, páginas internas, IA, Writer/Docs, Study, Islands, Focus, Reader, feedback y personalización.
- `shell/extensions.js`: catálogo/inyector usado por el proceso principal para las extensiones propias.
- `preload.js`: API controlada entre renderer y proceso principal.

## Seguridad

La ventana principal utiliza `preload.js`, `nodeIntegration: false` y `contextIsolation: true`. Los webviews se crean sin Node Integration y con restricciones de navegación y acceso a archivos.

## Para desarrolladores

No volver a crear cadenas `extrasN.js`. Para una nueva función, añade una sección con responsabilidad clara al bundle o extrae un módulo fuente y mantenlo integrado desde el runtime principal.
