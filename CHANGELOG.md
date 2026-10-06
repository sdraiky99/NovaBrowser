# Nova 4.3.2 · Hotfix Glass Clean

## Objetivo

Hotfix de recuperación sobre la base estable de Nova 4.1.0. Esta versión restaura el `shell/index.html` principal y añade la capa visual y funcional de 4.3 sin reescribir la arquitectura existente.

## Cambios

- Restaurado el `shell/index.html` estable de Nova 4.1.0 como base de interfaz.
- Nueva capa visual **Nova Glass Clean**: transparencia moderada, desenfoque suave, bordes redondeados y sombras discretas.
- Tipografía prioritaria: **Inter**, con fallback a Segoe UI Variable/Segoe UI.
- Animaciones de interfaz cortas y suaves, con respeto a `prefers-reduced-motion`.
- Barra lateral más limpia, con accesos principales y separador visual para elementos fijados.
- Nuevo botón **Fijar sitio** en la barra: guarda URL, título y favicon real de la página.
- Los sitios fijados se muestran con su favicon; se actualizan cuando el sitio cambia su favicon.
- Se mantiene el sistema de favoritos existente; el pin lateral es una función separada.
- Nuevo **Ahorro de energía** para reducir trabajo visual y activar el modo de rendimiento existente de Nova.
- Nuevo panel de estado de energía en Ajustes, sin borrar pestañas ni datos.
- Ocultado de la navegación primaria del selector antiguo de fondos para mantener la interfaz limpia.
- Conservadas las rutas y módulos internos existentes para evitar regresiones.
- Añadido auditor de UI que comprueba controles principales y conexiones IPC.
- Instalador actualizado a 4.3.2, conservando `userData` y el flujo NSIS existente.
- Comprobación de empaquetado para asegurar que todos los archivos activos de `shell/**` se incluyen en la aplicación.

## Compatibilidad

- Se conserva la base Electron/Chromium de Nova 4.1.0.
- No se cambia el formato de `prefs.json` ni el almacenamiento del perfil.
- No se fuerza ninguna desinstalación previa.

## Limitaciones conocidas

El binario `.exe` final debe generarse en Windows mediante GitHub Actions o `npm run dist:win`. Este repositorio incluye el código y la configuración necesarios para hacerlo, pero el entorno de preparación no ejecuta Electron de Windows.
