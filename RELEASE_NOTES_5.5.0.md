# Nova 5.5.0 — Navigation & New Tab Repair

## Cambios principales

- Reparada la integración de la nueva pestaña: ya no depende de `require('electron')` dentro del contenido web.
- Añadido un puente de capacidades limitadas para buscar, abrir la guía, abrir Nova Command y solicitar el feed de noticias.
- Las páginas web externas siguen sin Node integration; el puente solo se expone en la nueva pestaña local de Nova.
- La búsqueda de la barra de direcciones y la de nueva pestaña comparten un único resolutor, con soporte para URL explícitas, dominios con puerto, `localhost`, direcciones IP locales y búsquedas por texto.
- Corregida la sincronización de dirección e historial para actualizar la pestaña que realmente ha navegado, no siempre la pestaña activa.
- El menú contextual de pestañas ya no acumula listeners cada vez que cambia el título.
- El botón de actualizar noticias fuerza una nueva consulta, sin quedarse bloqueado por la caché de cinco minutos.
- Tema del sistema actualizado también en la página de nueva pestaña cuando Windows cambia entre claro y oscuro.
- Pulido de la interfaz inspirado en Chrome: pestañas, barra superior, foco de teclado y controles más consistentes.
- El historial de notas y comprobaciones anteriores queda archivado en `docs/history/`.

## Funciones que se mantienen

Favoritos, historial, privacidad, barra lateral, extensiones, noticias, Workspaces, descargas, ajustes y controles de ventana.

## Verificación

La suite `npm run check` valida sintaxis, metadatos, recursos, el puente de la nueva pestaña y casos de navegación. La ejecución de pruebas estáticas no sustituye una prueba visual de la aplicación en Windows; el arranque real de Electron y el instalador deben comprobarse en el equipo de destino antes de publicar una release.
