# Nova 4.3.2 · Hotfix Glass Clean

## Objetivo

Hotfix de recuperación de la interfaz principal de Nova y pulido visual sin volver a reemplazar el `shell/index.html`.

## Cambios

- Restaurado el `shell/index.html` estable de Nova 4.1.0 como base funcional.
- Añadida la capa visual **Glass Clean** con transparencia moderada, blur suave y bordes redondeados.
- Tipografía prioritaria **Inter**, con fallback a Segoe UI Variable/Segoe UI.
- Animaciones cortas y discretas, respetando `prefers-reduced-motion`.
- Nuevo botón para **fijar la web actual**.
- Los elementos fijados muestran el **favicon real** de la web cuando está disponible y actualizan el icono al cambiar el favicon.
- Nuevo **Ahorro de energía** que reutiliza el modo de rendimiento existente de Nova.
- El ahorro reduce trabajo visual en pestañas en segundo plano sin cerrar pestañas ni borrar datos.
- El acceso principal a Fondos queda fuera de la barra lateral para mantener una interfaz limpia.
- Los módulos existentes (`extras*.js`, `nova25.js`, `nova30.js`, `nova31.js`, `nova40.js`, `nova41.js`) se conservan.
- Añadida auditoría de UI para comprobar controles principales y que el hotfix se carga realmente.
- El instalador conserva `userData` y se mantiene el flujo NSIS estable.

## Compatibilidad

Esta versión mantiene la arquitectura renderer de la base 4.1.0. No se realiza una migración incompleta a `preload.js`; esa migración queda reservada para una actualización de seguridad independiente y verificable.
