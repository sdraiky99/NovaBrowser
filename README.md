# Nova Browser 5.5.0

Nova es un navegador de escritorio basado en Electron/Chromium, con una interfaz adaptativa inspirada en Chrome, barra lateral y nueva pestaña con buscador, accesos rápidos y noticias.

## Nova 5.5.0

- Reparación del flujo entre nueva pestaña, buscador, menú y noticias.
- Búsqueda unificada para direcciones, `localhost`, puertos, direcciones IP y texto.
- Puente de nueva pestaña limitado a la interfaz local; las webs externas no reciben Node integration.
- Corrección de la sincronización entre pestañas e historial.
- Tema claro/oscuro que sigue el sistema y se actualiza en nueva pestaña.
- Conservación de favoritos, historial, privacidad, barra lateral, extensiones, noticias, Workspaces y descargas.
- Recursos y notas de versiones anteriores conservados en el proyecto.

## Desarrollo

Requiere Node.js 22.12.0 o superior.

```bash
npm install
npm start
npm run check
```

Para compilar Windows: `npm run dist:win`.

## Publicación

El flujo de GitHub Actions realiza las comprobaciones y genera los paquetes para Windows y Linux. Antes de publicar una release, prueba Nova en Windows: la suite automática comprueba estáticamente el código y los recursos, pero no sustituye una prueba de la interfaz en ejecución.
