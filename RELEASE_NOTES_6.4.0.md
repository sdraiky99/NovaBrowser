# Nova 6.4.0 FLOW

## Cambios principales
- Renderer principal migrado a `contextIsolation: true` y `nodeIntegration: false`.
- Nuevo preload `shell/preload.js` sandboxed con NovaAPI y listas explícitas de canales permitidos.
- CSP del shell principal sin `unsafe-inline` para scripts.
- Noticias desactivadas por defecto; se activan desde Configuración.
- Diagnóstico local con acción explícita para restaurar la última copia válida.
- Captura de pantalla desde el menú contextual con diálogo de guardado.
- Eliminada la infraestructura de cuentas Nova y sus endpoints.
- Nova Assist queda fijado a Ollama local; se eliminan los proveedores online de esa función.
- Se conectan los eventos IPC `key`, `ctx-search`, `ask-ai`, `zoom-changed` y `update-state` con el renderer.
- Portable se detiene con un aviso si no puede escribir en `User Data`; no recurre al perfil de Setup.
- Versión actualizada a 6.4.0 y retirado el historial documental antiguo del paquete de proyecto.
- Añadidas comprobaciones de seguridad estáticas.

## Conservación
Se mantienen los módulos existentes de pestañas, marcadores, historial, descargas, extensiones, importación, permisos por sitio, workspaces, Focus Mode, actualizador y copias de seguridad.

## Pendiente de validación real
Esta entrega no se ha ejecutado en Windows ni se ha empaquetado con Electron. La migración de `contextIsolation` requiere pruebas funcionales completas en Windows, especialmente controles de ventana, webviews, menús contextuales, diálogos, descargas, extensiones, captura de pantalla y actualizador. El Command Center radial y la nueva página modular descritos en la hoja de ruta todavía no están implementados en esta iteración.
