# Nova 6.2.1 — Portable Stability Update

Nova es un navegador de escritorio basado en Electron/Chromium. La distribución actual de Nova se centra en **Windows portable, sin instalador**.

## Características
- Interfaz propia, modo claro/oscuro y adaptación al sistema.
- Pestañas, barra de direcciones y búsqueda integrada.
- Nueva pestaña con buscador, accesos rápidos y noticias con estado de conexión honesto.
- Panel lateral plegable, marcadores, historial, descargas y ajustes.
- Carga de extensiones Chromium compatibles desde carpetas desempaquetadas; compatibilidad de APIs no universal.
- Restauración opcional de sesión.

## Portable y datos del usuario
El único artefacto publicado para Windows es `Nova-Portable-6.2.1.exe`. No se genera setup. Extrae o copia ese ejecutable a la carpeta que prefieras y ejecútalo sin permisos de administrador (sujeto a las políticas del equipo).

En una compilación portable, Nova guarda por defecto los datos en `User Data/` junto al ejecutable. En el primer arranque intenta migrar el perfil antiguo de Nova si la carpeta aún está vacía. Si esa ubicación no permite escribir, Nova utiliza el perfil normal de Windows y deja un aviso en el log. Para poder mover el navegador entre equipos, mueve la carpeta `User Data/` junto al ejecutable y cierra Nova antes de copiarla.

Haz una copia de seguridad de `User Data/` antes de sustituir el portable por una versión nueva. La actualización se realiza manualmente: cierra Nova, guarda la carpeta de datos, reemplaza el ejecutable y vuelve a abrirlo.

## Desarrollo y pruebas
Requiere Node.js 22.12.0 o superior.

```bash
npm install
npm run check
npm start
npm run dist:portable
```

`npm run dist:portable` genera `dist/Nova-Portable-6.2.1.exe`. `npm run dist` y `npm run dist:win` son alias de ese mismo comando portable. No hay flujo de compilación de setup.

`npm run check` ejecuta comprobaciones de estructura, sintaxis, pruebas de regresión y configuración portable. Las pruebas automáticas no sustituyen una prueba de arranque y navegación en Windows. No se incluye `package-lock.json`; cuando haya un entorno con conexión estable, conviene generarlo y cambiar CI a `npm ci`.

## Recursos históricos
Los recursos de NSIS de versiones anteriores se conservan en `docs/history/installer-resources-6.2.0/` únicamente como archivo histórico. No se usan para compilar Nova 6.2.1.
