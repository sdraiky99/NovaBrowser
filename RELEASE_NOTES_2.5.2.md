# Nova 2.5.2 — Clean Surface

## Limpieza definitiva

- El runtime del shell deja de depender de un bloque JavaScript inline en `index.html`; pasa a `shell/shell.js`.
- Las capas históricas `extras*.js`/`nova25.js` ya no forman parte del árbol activo.
- El catálogo de extensiones del renderer queda embebido de forma controlada para eliminar dependencias relativas del runtime.
- Se corrige el acceso a carpetas mediante IPC seguro y se actualizan las whitelists de preload.

## Experiencia

- Safari Mode + Air como superficies principales.
- `Ctrl/Cmd + clic`, clic central y modo configurable de apertura de enlaces en nuevas pestañas.
- `+` siempre pegado a la última pestaña.
- Tutorial interno renovado.

## Productividad

- Writer + DOCX, Docs, Study, Focus, Reader+, Capture, Collections y Mejoras.
- Novedades con imágenes locales versionadas en `assets/release/2.5.2/`.

## Seguridad

- Ventana principal con `nodeIntegration: false` y `contextIsolation: true`.
- API del renderer expuesta mediante `preload.js` + `contextBridge`.
- Webviews endurecidos y navegación no permitida hacia protocolos no autorizados.

## Verificación

Se ejecutan comprobaciones estáticas de sintaxis y estructura. El runtime Electron completo requiere instalar las dependencias del proyecto.
