# Nova Browser 5.0.0 — Quantum Prime

Nova es un navegador basado en Chromium con una interfaz propia, limpia y orientada a productividad.

## Quantum Prime

La versión 5.0.0 introduce la identidad Nova Quantum y una filosofía de interfaz más tranquila:

- Menos botones y menos duplicación.
- Menús compactos y fáciles de entender.
- Sidebar centrada en acciones útiles.
- Transparencia y blur moderados.
- Animaciones rápidas y accesibles.
- Favicons reales para sitios fijados.
- Workspaces, rendimiento, ahorro de energía y extensiones Chromium reales.
- Nueva pestaña con noticias con fuentes identificables y fallback editorial marcado.

## Desarrollo

Requisitos recomendados:

- Node.js 22.12.0 o superior (versión fijada en `.nvmrc`).
- npm.
- Windows para el instalador `.exe`.

Comandos principales:

```bash
npm install
npm run check
npm run check:build-assets
npm run dist:win
```

## Filosofía de estabilidad

Quantum Prime se implementa como una capa aislada sobre la base estable de Nova 4.4.1. Los cambios de interfaz no sustituyen masivamente `shell/index.html` y el pipeline comprueba recursos críticos antes del empaquetado.

## Licencia

Consulta `LICENSE.txt`.
