# Nova 5.3.1 — Estabilidad y fundamentos

Versión de mantenimiento sobre 5.3.0. No es una reescritura del renderer: corrige defectos encontrados al auditar el código real y sustituye el QA basado en búsqueda de texto por comprobaciones de relaciones entre archivos.

## Corregido

- `shell/nova53.js` (capa Reborn de 5.3.0) no compilaba: dos claves de objeto sin cerrar (`'whatsnew:'`, `'guide:'`) y la función autoejecutable estaba truncada al final. Con 5.3.0 el navegador cargaba el resto del shell, pero el Extension Center, las novedades y la guía de Reborn no podían ejecutarse.
- Las novedades de Reborn ahora se muestran una vez por versión (la función existía pero nunca se invocaba).
- `check` de 5.3.0 no ejecutaba la comprobación de sintaxis, por eso el fallo anterior no se detectó.

## Configuración (`prefs.json`)

- Esquema versionado (`schemaVersion: 2`) con migración: se normalizan los ajustes y se eliminan claves heredadas sin consumidor (`theme`, `customTheme`, `wallpaper`, `oldLogo`, `mods`) conservando el resto.
- Copia de seguridad `prefs.json.bak` antes de cada escritura válida.
- Si `prefs.json` está dañado: se aparta como `prefs.json.corrupt-<fecha>`, se restaura desde la copia y, si no hay copia válida, Nova arranca con valores por defecto. Los fallos se registran en consola en lugar de ocultarse.

## Limpieza (solo lo que no tenía ninguna referencia)

- IPC sin llamadores: `fullscreen`, `opacity`.
- Assets sin uso: logos mono/wordmark/PNG duplicado, `about-quantum.png`, `store-banner.png`, y dos pósters de ~2 MB (`quantum53-*.png`).
- Scripts QA de versiones 3.0 a 5.3.0 y documentos obsoletos (instrucciones 2.2.0, instalación 2.5.4) movidos o eliminados; notas 5.3.0 movidas a `docs/history/`.

## QA

`npm run check` ejecuta `scripts/qa.js`: compilación de todos los JS, scripts cargados vs. archivos reales, cruce IPC renderer↔main (llamadas a canales inexistentes, canales duplicados, canales muertos), assets referenciados vs. existentes, cobertura de `build.files`, frames del ICO, coherencia de versión, Node/CI, y pruebas funcionales de migración y recuperación de `prefs.json`.

## Limitaciones conocidas

Ver README, sección "Estado del proyecto".
