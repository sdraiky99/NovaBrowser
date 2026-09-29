# Nova Browser 2.1

Nova es un navegador de escritorio basado en Electron con una interfaz propia y funciones inspiradas en los navegadores modernos.

## Funciones

- Pestañas con arrastrar y soltar, fijar, duplicar, silenciar, cerrar otras/derecha y reabrir cerradas.
- Restauración de sesión entre reinicios.
- Pestañas privadas con almacenamiento temporal separado y descargas privadas.
- Favoritos con búsqueda y ordenación.
- Historial con búsqueda y borrado.
- Centro de descargas con pausa/reanudación, abrir y mostrar en carpeta.
- Bloqueador de anuncios y rastreadores.
- Buscador configurable: DuckDuckGo, Google, Bing y Brave.
- Página Nueva pestaña renovada con accesos rápidos, recientes, favoritos, reloj y protección Nova.
- Buscar en página, zoom, pantalla completa, imprimir a PDF, guardar página HTML y captura PNG.
- Modo lectura, oscuro forzado, texto grande y desactivar animaciones.
- Paleta de comandos Ctrl+K.
- Menú contextual de enlaces y selección.
- Ajustes exportables/importables.
- Temas Nova, Neón, Código, Windows 95, Undertale y Aero.
- Fondos personalizados.
- Instalador NSIS con branding propio, selección inicial de tema/privacidad y acceso directo.
- Portable para ejecutar sin instalar.
- GitHub Actions para generar automáticamente los `.exe` de Windows.

## Construir

```bash
npm install
npm run dist
```

Los ejecutables aparecen en `dist/`.
