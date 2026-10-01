# Nova — guía de mantenimiento 2.5.2

## Regla principal

No crear `extras2.js`, `extras13.js` ni capas paralelas. El runtime de funcionalidades está consolidado en `shell/features.js`.

## Archivos importantes

- `main.js`: Electron, ventanas, webviews, IPC y seguridad.
- `preload.js`: frontera renderer/proceso principal.
- `shell/index.html`: shell, toolbar, pestañas y vista.
- `shell/shell.js`: tabs, grupos, atajos y apertura de enlaces.
- `shell/extensions.js`: extensiones de contenido.
- `shell/features.js`: páginas internas, IA, ajustes, Focus, Reader, Study, Writer, Docs, Islands, feedback y temas extendidos.
- `shell/themes.css`: variables y temas visuales.

## IPC

El renderer debe usar `window.novaAPI`. El proceso principal registra handlers en `main.js`; `preload.js` mantiene una whitelist explícita.

## Páginas internas

Para añadir una página interna, registra `PG.miPagina = r => { ... }`, añade la ruta/título al router existente y, cuando sea una función principal, incorpora una acción en `N.ACTIONS` y un acceso desde Command Center o el hub correspondiente.

## UX

Nova sigue la regla: **muchas posibilidades, poca interfaz visible**. Las funciones avanzadas deben vivir en Command Center, More, Settings o páginas internas, no llenar la toolbar.

## Comprobaciones

Ejecuta `npm run check` antes de entregar cambios. En CI se deben ejecutar comprobaciones estáticas y, cuando haya dependencias instaladas, la build de Electron.
