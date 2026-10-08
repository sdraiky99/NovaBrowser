# Nova 5.3.0 — Reborn

Nova 5.3.0 es una actualización de experiencia y renderer visual. El objetivo es modernizar la sensación del navegador sin alterar el núcleo de pestañas que ya estaba estable en 5.2.x.

## Nuevo

- Renderer visual Reborn aislado como capa de presentación.
- Extension Center con catálogo curado y enlaces a la Chrome Web Store.
- Gestión de extensiones Chromium reales desde carpetas locales.
- Restauración automática de extensiones cargadas al iniciar Nova.
- Qué hay de nuevo con presentación guiada y animaciones suaves.
- Guía de inicio accesible otra vez desde Nova.
- Selector de color de acento en la barra superior, separado del sistema de temas.
- Nuevas ilustraciones y materiales visuales incluidos en `assets/reborn/`.

## Diseño

- Tipografía ajustada a Segoe UI Variable/Segoe UI/Inter para una apariencia más nativa y relajada.
- Menús más compactos y jerarquía visual más clara.
- Transparencia y desenfoque moderados.
- Animaciones cortas con respeto a `prefers-reduced-motion`.
- Nuevo símbolo Reborn de Nova para la barra y páginas internas.

## Estabilidad

- El renderer Reborn no reemplaza `index.html`; se aplica mediante `quantum53.css` y `nova53.js`.
- No se toca la creación de pestañas ni se introduce un nuevo camino de navegación para abrirlas.
- QA comprueba que los recursos visuales y rutas nuevas estén presentes antes del empaquetado.

## Importante

La tienda presenta enlaces a la Chrome Web Store y conserva la carga local de extensiones reales. Nova no descarga código de extensiones silenciosamente.
