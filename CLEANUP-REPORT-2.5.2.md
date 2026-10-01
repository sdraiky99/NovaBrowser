# Nova 2.5.2 — Limpieza definitiva

## Cambios principales

- Renderer protegido con `preload.js`, `contextBridge`, `contextIsolation: true` y `nodeIntegration: false`.
- Las llamadas de Nova IA pasan por IPC; el renderer no llama directamente a Anthropic.
- Las capas históricas `extras*.js`, `nova25.js` y `supercat.js` ya no forman parte del árbol de archivos ejecutados.
- El runtime usa `shell/shell.js` + `shell/features.js` como núcleo activo.
- Se eliminaron las diapositivas BMP antiguas del instalador.
- Setup y onboarding pasan a una experiencia más corta y limpia.
- `nova://hub`, `nova://ajustes`, `nova://mejoras`, `nova://bienvenida` y `nova://novedades` usan superficies 2.5.2 limpias y no encadenan las pantallas históricas.
- Colecciones tienen flujo real de crear/abrir/añadir/eliminar.
- Performance Center usa los campos reales entregados por IPC.
- Downloads usa `open-path`/`show-in-folder` en lugar de convertir carpetas locales en enlaces externos.
- DOCX se genera como Open XML real desde Nova Writer.
- Feedback aclara que los votos incluidos son locales al perfil y ofrece acceso a GitHub Issues.

## Estructura activa

`main.js` → proceso principal y políticas.
`preload.js` → API mínima y controlada.
`shell/shell.js` → navegación, tabs, enlaces, atajos y shell.
`shell/features.js` → bundle consolidado de funciones.
`shell/extensions.js` → catálogo/runner de extensiones propias.
