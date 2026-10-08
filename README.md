# Nova Browser — 5.3.0 Reborn

Nova es un navegador Chromium con una interfaz propia, limpia y relajada. Nova 5.3.0 actualiza la experiencia visual y añade un Extension Center funcional sin sustituir el núcleo de navegación que se había estabilizado en 5.2.x.

## 5.3.0 Reborn

**Reborn** introduce una nueva capa visual para la interfaz principal: tipografía más nativa, menús más compactos, superficies suaves, animaciones cortas y una nueva identidad de renderer.

También incluye:

- Extension Center con catálogo curado y enlaces a la Chrome Web Store.
- Carga de extensiones Chromium reales desde carpetas locales.
- Restauración automática de extensiones cargadas al arrancar.
- What's New animado con ilustraciones incluidas en el proyecto.
- Selector de color de acento en la barra superior.
- Guía de inicio accesible desde Nova.

## Desarrollo

Requisitos: Node.js 22.12.0 o superior.

```bash
npm install --engine-strict
npm run check
npm run dist:win
```

El workflow de GitHub Actions también usa Node 22.12.0. No se versionan `node_modules`, `dist` ni artefactos locales.

## Versiones históricas

Las notas históricas se conservan en `docs/history/`. La nota de la versión actual es `RELEASE_NOTES_5.3.0.md`.
