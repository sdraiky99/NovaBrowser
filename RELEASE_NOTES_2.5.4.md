# Nova 2.5.4 — Hotfix

Hotfix funcional sobre Nova 2.5.3 Recovery.

## Correcciones
- Nova IA vuelve a tener un puente funcional hacia Anthropic desde el proceso principal.
- Las acciones de IA del Command Center vuelven a ejecutar funciones reales.
- Command Center queda expuesto como `NOVA.palette`.
- Las rutas `nova://` dejan de caer silenciosamente en “Acerca de Nova” cuando faltan; se muestran como rutas no disponibles.
- Los enlaces internos `#nova/...` desde Nueva pestaña se enrutan explícitamente.
- Download Hub puede abrir la carpeta de Descargas mediante IPC seguro.
- Colecciones permite abrir colecciones y guardar la pestaña actual.
- Study puede guardar la página actual en la primera colección disponible.
- Textos visibles de versión actualizados a 2.5.4.

## Verificación
- `node --check` en `main.js`, `shell/*.js` y servicios del proyecto.
- `scripts/check-project.js` OK.
- Comprobación estática de rutas internas: 0 rutas faltantes.

## Pendiente
- Ejecutar Electron/electron-builder en la máquina de build con dependencias instaladas.
- Migración futura del renderer principal a `preload.js` + `contextBridge`.
- Añadir/commit del lockfile npm para builds reproducibles.
