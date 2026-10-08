# Nova Browser 5.3.3

Nova es un navegador de escritorio basado en Chromium y Electron, centrado en una interfaz limpia, organización de pestañas, Workspaces, extensiones y rendimiento.

## Desarrollo

```bash
npm install
npm start
```

## Comprobaciones

```bash
npm run check
```

## Build Windows

```bash
npm run dist:win
```

## Estructura

- `main.js` — proceso principal de Electron y servicios del navegador.
- `shell/index.html` — shell visual principal.
- `shell/nova.js` — renderer de Nova.
- `shell/nova.css` — sistema visual.
- `shell/newtab.html` — nueva pestaña.
- `shell/extensions.js` — catálogo e inyección de extensiones internas.
- `migration.js` — migraciones y compatibilidad de datos.

## Filosofía

Una función visible debe existir de verdad. Los sistemas antiguos que ya no forman parte de Nova no deben quedarse mezclados con la interfaz actual.
