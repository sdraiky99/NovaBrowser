# Nova 4.3.1 — Installer & Startup Fix

Patch de recuperación para Nova 4.3.0.

## Corrección crítica
- Se incluye `preload.js` explícitamente en el paquete de `electron-builder`.
- Esto corrige instalaciones donde Nova abría la ventana pero la interfaz no podía comunicarse con Electron mediante `NOVA_BRIDGE`.

## Mantenimiento
- Branding del instalador actualizado a Nova 4.3.
- Se conserva la configuración de usuario fuera de la carpeta de instalación.
- No se restauran temas antiguos.
