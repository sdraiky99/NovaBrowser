# Nova Browser — 5.2.0 Quantum Identity

Nova es un navegador Chromium con una experiencia visual tranquila y coherente. Nova 5.2 no añade funciones de relleno: se centra en identidad, tipografía, iconografía, microanimaciones, splash e instalador.

## Esta versión

**5.2.0 Quantum Identity** consolida la apariencia de Nova: un único sistema de marca, menús más serenos, materiales de instalación renovados y una capa visual aislada para evitar regresiones del núcleo de navegación.

## Desarrollo

- Node.js `22.12.0` o superior
- Electron `44.4.5`

```bash
npm install
npm run check
npm start
```

Para crear los paquetes:

```bash
npm run dist:win
npm run dist:linux
```

## Historial

La historia de las versiones anteriores se conserva en `docs/history/`. La nota de la versión actual es `RELEASE_NOTES_5.2.0.md`.
