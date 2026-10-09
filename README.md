# Nova Chromium 5.5.1 — Next-Gen

Nova es un navegador de escritorio basado en Electron/Chromium. Esta versión estrena la identidad 3D de Nova, una interfaz más sobria y fondos locales personalizables para la barra superior.

## Novedades
- Nuevo icono oficial de cubo 3D con la letra N.
- Menos sombras y efectos decorativos en la interfaz.
- Fondo local para la barra superior: PNG, JPG/JPEG o WebP, máximo 12 MB.
- Vista previa y opción para volver al fondo predeterminado.
- El fondo se guarda en el perfil local de Nova y no se envía a un servidor.

## Requisitos y desarrollo
Requiere Node.js 22.12.0 o superior.

```bash
npm install
npm start
npm run check
```

Para compilar Windows: `npm run dist:win`.

**Nota de reproducibilidad:** esta entrega no incluye `package-lock.json`. El registro de npm no estuvo accesible durante la preparación, así que no he inventado un lockfile. En un equipo con conexión, ejecuta `npm install`, conserva el `package-lock.json` generado en Git y repite `npm run check` antes de etiquetar una publicación.

## Publicación
Conserva una copia del proyecto y de los datos personales antes de probar una actualización. Ejecuta `npm run check` antes de publicar. Las pruebas estáticas no sustituyen una prueba interactiva en Windows: valida navegación, menús, persistencia de fondos e instalador antes de distribuir la versión.
