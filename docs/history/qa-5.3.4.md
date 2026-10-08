# Nova 5.3.4 QA

## Objetivo
Corrección de controles de ventana y pulido de la interfaz estilo Chromium, manteniendo el núcleo de navegación de Nova 5.3.3.

## Verificaciones estáticas
- Versión 5.3.4 consistente en `package.json` y NSIS.
- Controles de ventana minimiza/maximiza/cierra cableados al IPC `win`.
- Controles de navegación y menú presentes.
- Temas y artefactos legacy ausentes del shell.
- Extensiones, Workspaces, historial, descargas y rendimiento conservados.
- Repositorio por debajo de 100 archivos fuente.

## Limitación
El ejecutable Windows debe validarse en GitHub Actions/Windows para una prueba de arranque e instalación real.
