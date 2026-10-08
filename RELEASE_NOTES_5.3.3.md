# Nova 5.3.3 — Deep Cleanup & UI Reset

## Cambios principales
- Nuevo renderer de interfaz unificado y aislado del contenido web.
- `index.html` y `newtab.html` reconstruidos para eliminar capas heredadas.
- Ajustes nuevos con únicamente opciones activas.
- Eliminados temas y configuraciones visuales legacy.
- Eliminados restos de UI 4.4/5.1/5.2/5.3 duplicados del runtime.
- Extension Center y gestor de extensiones unificados en una sola experiencia.
- Favicons reales en pestañas y accesos fijados, con fallback consistente.
- Noticias con fuentes RSS reales, caché del último feed válido y categorías que recuperan correctamente su contenido al cambiar.
- Las imágenes de noticias se muestran cuando la fuente las proporciona.
- What's New se muestra una sola vez por versión y puede abrirse manualmente desde Ayuda.
- Guía de inicio repetible desde Ayuda.
- Barra superior y contenido web quedan visualmente separados.
- Tipografía, botones, colores, light/dark y animaciones unificados.
- Instalador actualizado completamente a 5.3.3.
- Proyecto reducido por debajo de 100 archivos fuente.

## Compatibilidad preservada
La navegación Chromium, pestañas, favoritos, descargas, Workspaces, extensiones desempaquetadas, rendimiento y actualizaciones siguen utilizando el backend existente siempre que fue posible.

## Nota
La migración completa a un renderer sin `nodeIntegration` queda fuera de esta limpieza visual para evitar introducir una migración de seguridad a medias.
