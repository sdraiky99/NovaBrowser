# Nova 2.5.2 — Clean Surface

Nova es un navegador basado en Chromium con una superficie tranquila y herramientas avanzadas que aparecen bajo demanda.

## Qué cambia en 2.5.2

- Air + Safari como experiencias principales.
- Tabs + Spaces + Islands con una jerarquía común.
- Glance para previsualizar enlaces sin llenar la barra de pestañas.
- Command Center (`Ctrl/Cmd + K`) para buscar y ejecutar acciones.
- Focus, Reader+, Study, Writer y Docs.
- Exportación DOCX real desde Nova Writer.
- Privacy Center, Performance Center y Download Hub.
- `nova://mejoras` para proponer feedback y revisar los votos locales.
- Setup y onboarding simplificados.
- Renderer protegido mediante `preload.js` + `contextBridge`; el arranque ya no carga capas `extras*.js`.

## Arquitectura

El renderer activo está organizado alrededor de:

- `main.js`: proceso principal y políticas de seguridad.
- `preload.js`: API controlada para IPC, portapapeles, rutas y shell.
- `shell/index.html`: shell visual y navegación base.
- `shell/shell.js`: shell base, pestañas, grupos, enlaces y atajos.
- `shell/extensions.js`: extensiones de contenido.
- `shell/features.js`: bundle consolidado de funcionalidades.
- `shell/themes.css`: temas y tokens visuales.

Las capas históricas ya no forman parte del árbol de ejecución.

## Páginas útiles

- `nova://bienvenida` — onboarding.
- `nova://tutorial` — tutorial interactivo.
- `nova://safari` — Safari Mode.
- `nova://islands` — organización por Islands.
- `nova://writer` — editor y exportación DOCX.
- `nova://docs` — documentos.
- `nova://study3` — espacio de estudio.
- `nova://mejoras` — feedback de la comunidad.
- `nova://novedades` — novedades de la versión.

## Desarrollo

```bash
npm install
npm run check
npm start
```

Para una build de Windows: `npm run dist:win`.
Para Linux: `npm run dist:linux`.
