# Nova Changelog

## 5.5.3 — Reliability & UI Fix
- Corregido el orden de creación de pestañas para que el preload confiable de la nueva pestaña se configure en la primera carga, conectando búsqueda, accesos rápidos, novedades y feed.
- Reforzada la navegación desde la barra de direcciones y la página de inicio, con validación, gestión de errores y rutas centralizadas.
- Reparado el color de acento para que no quede anulado por el modo oscuro; el color del botón de acento ahora refleja la preferencia actual.
- Centrado el botón `+` y ampliada la altura de los controles de ventana hasta los bordes de la barra.
- Aclarado que Chrome Web Store no instala extensiones directamente en Nova; se pueden cargar carpetas de extensiones Chromium compatibles con `manifest.json`.
- Añadida validación de manifest y pruebas de regresión para el puente, navegación, apariencia, barra de título y extensiones.


## 5.5.2 — Stability Hotfix
- Corregida la superposición de paneles internos con el contenido web: Favoritos, Historial, Descargas, Workspaces, Extensiones, Rendimiento y Ajustes permanecen visibles y reciben los clics.
- Al volver a una pestaña web se retira correctamente el panel interno anterior.
- Icono de Nova exportado con canal alfa: sin fondo rectangular en la interfaz, ventanas y accesos directos.
- Metadatos, splash, novedades e instalador actualizados a 5.5.2.


## 5.5.1 — Nova Next-Gen
- Nuevo icono oficial 3D con la N de Nova, aplicado a recursos de la aplicación e instalador.
- Rediseño visual más contenido: menos sombras y radios grandes, mejores separadores y movimiento más discreto.
- Fondo personalizado de la barra superior con imágenes locales PNG, JPG/JPEG o WebP de hasta 12 MB.
- Vista previa y restablecimiento del fondo desde Ajustes.
- Novedades de la versión actualizadas; el historial previo se conserva en `docs/history/`.

## 5.5.0 — Navegación y nueva pestaña
- Reparado el acceso a noticias y acciones desde la nueva pestaña mediante un puente IPC limitado.
- Búsqueda y navegación centralizadas, con soporte para localhost, direcciones IP y búsquedas por texto.
- Corregida la sincronización por pestaña del historial y de la barra de direcciones.

## 5.4.1 — Navigation & Window Controls Hotfix
- Mejoras de los controles de ventana y búsqueda de direcciones con puertos explícitos.
- Pestañas, descargas, historial y favoritos pulidos.
