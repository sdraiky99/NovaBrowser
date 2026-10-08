# Nova 5.3.2 — Core & Repository Cleanup

## Objetivo

Consolidar la base de Nova para reducir deuda técnica y facilitar una subida completa a GitHub sin superar la regla de 100 archivos.

## Cambios

- El runtime del renderer pasa a `shell/nova-runtime.js`, conservando el orden de ejecución de los módulos existentes.
- Corregido el error de sintaxis de las rutas 5.3.
- Se mantienen funciones familiares de Chromium/Electron: atrás, adelante, recargar, barra de dirección/búsqueda, pestañas, favoritos y atajos.
- Se eliminan scripts de QA y documentación histórica que ya no son necesarios para la versión activa.
- Se conservan referencias históricas compactas de Nova 3.0, 3.1 y 5.3.0.
- Se eliminan wallpapers y helpers de Fedora del paquete activo para reducir el tamaño del repositorio sin tocar el núcleo de navegación.
- Installer NSIS actualizado completamente a 5.3.2.
- Se regeneran los materiales gráficos del instalador con la identidad actual.
- La QA comprueba que el repositorio tenga menos de 100 archivos.

## Compatibilidad

Nova sigue usando Chromium/Electron como base y conserva las funciones esenciales de navegación existentes. No se realiza una migración parcial del modelo de ventanas ni del renderer en esta versión.
