# Nova 2.5.3 — Recovery

Esta versión recupera la arquitectura de Nova 2.5.0 mientras se rehace la limpieza de forma incremental.

- Mantiene los módulos `extras*.js`, `nova25.js` y `supercat.js` porque forman parte del runtime probado de esta base.
- Conserva Air, Safari Mode, Islands, Focus, Writer, Docs, Study, Mejoras y el resto de funciones de 2.5.0.
- No introduce cambios de seguridad del renderer sin prueba de ejecución de Electron.
- Esta versión es una base estable para una limpieza posterior por módulos pequeños.
