# Auditoría de archivos — Nova 5.5.0

## Resultado

- Base de origen: Nova 5.4.1, con 46 archivos de proyecto.
- Resultado de esta actualización: 51 archivos de proyecto, todavía por debajo del límite acordado de 100.
- No se borró ningún archivo de forma permanente.

## Archivos nuevos

- `shell/navigation.js`: resolución compartida para direcciones, direcciones locales y búsquedas.
- `shell/newtab-preload.js`: puente IPC de capacidades limitadas para la nueva pestaña local.
- `scripts/qa-5.5.0.js`: pruebas de navegación, consistencia de versión, puente, privacidad e inventario.
- `RELEASE_NOTES_5.5.0.md`: notas de la actualización actual.
- `docs/history/auditoria-archivos-5.5.0.md`: este registro.

## Archivos archivados, no eliminados

- `RELEASE_NOTES_5.4.1.md` se trasladó a `docs/history/5.4.1.md` para dejar en la raíz solo las notas de la versión actual.
- Las comprobaciones específicas de versiones anteriores `qa-5.3.4.js` y `qa-5.4.1.js` se trasladaron a `docs/history/`. Sus referencias a comandos npm activos se retiraron porque esas comprobaciones validan versiones antiguas; la suite activa es `qa:5.5.0`.

## Cambios funcionales relacionados

- `main.js`, `shell/nova.js` y `shell/newtab.html` se modificaron para arreglar la comunicación de la nueva pestaña, sincronización de historial, cambio de tema y persistencia del bloqueador.
- `shell/nova.css` se pulió para el diseño inspirado en Chrome.
- `package.json`, scripts de comprobación, `README.md`, `CHANGELOG.md` y `build/installer.nsh` se actualizaron a 5.5.0.
- El contenido de `docs/history/` se conserva; solo se corrigió una cabecera que atribuía a 5.4.0 un título de 5.4.1.

## Comprobaciones

La suite automatizada comprueba sintaxis JavaScript, script inline de nueva pestaña, casos de resolución de direcciones, recursos, metadatos y número de archivos. No sustituye la prueba manual del arranque, navegación y controles de ventana en la versión de Electron para Windows.
