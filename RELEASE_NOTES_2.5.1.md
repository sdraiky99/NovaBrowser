# Nova 2.5.1 — Limpieza definitiva

## Superficie
- Air es la experiencia de referencia: menos controles, más espacio y cristal suave.
- Safari Mode queda como una superficie completa, no solo como un tema.
- Sidebar compacta con Command Center, Spaces, Focus, IA y Más.

## Pestañas
- `+` junto a la última pestaña y se mueve con la tira.
- Ctrl/Cmd + clic y clic central abren enlaces en pestaña nueva.
- Glance, Islands y Spaces trabajan como capas complementarias.

## Productividad
- Tutorial interactivo en `nova://tutorial`.
- Writer/Docs y exportación DOCX.
- Focus, Reader+, Study 3, Collections y Web Capture.

## Arquitectura
- Renderer endurecido con `preload.js` + `contextBridge`.
- El arranque deja de cargar `extras.js`, `extras2.js`, etc. por separado.
- IPC restringido por canal.
- Operaciones de archivos del renderer quedan acotadas a rutas conocidas.

## Instalador
- Setup NSIS simplificado: el producto guía al usuario en el primer arranque.
- Se elimina la presentación de cinco BMP del instalador.

## Feedback
- `nova://mejoras` muestra las propuestas y deja explícito que los votos son locales cuando no existe backend remoto.
