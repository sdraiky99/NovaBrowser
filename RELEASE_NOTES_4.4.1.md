# Nova 4.4.1 — News & New Tab Fix

Fecha: 2026-10-06

## Cambios

- Reparado el botón de **Nueva pestaña (+)** con un handler delegado y una ruta de apertura de respaldo.
- La nueva pestaña recibe ahora la sección activa y puede cambiar entre **Tecnología, Gaming y Dev**.
- Añadidas **noticias en vivo** desde fuentes RSS públicas, mostrando fuente, fecha, resumen y enlace al artículo original.
- Añadido un fallback **Nova Briefing** claramente marcado para cuando no hay conexión.
- Rediseño de la nueva pestaña con Glass Clean, tarjetas de noticias, estados de carga y animaciones breves.
- Se mantiene el HTML principal del navegador sin reescritura estructural.
- La carga de noticias está cacheada durante 5 minutos para evitar consultas innecesarias.

## Correcciones de estabilidad

- `Ctrl+T` y el botón `+` comparten una ruta robusta de apertura.
- La inclusión de scripts y canales de noticias queda cubierta por la QA de 4.4.1.
