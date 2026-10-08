# Nova Browser — 5.3.2

Nova es un navegador basado en Chromium/Electron, con una interfaz propia y funciones esenciales de navegación diaria.

## 5.3.2

Esta versión prioriza estabilidad y mantenibilidad. Los módulos renderer heredados se consolidan en `shell/nova-runtime.js` sin cambiar el orden de ejecución del navegador. Se conservan funciones base de Chromium/Electron como atrás, adelante, recargar, barra de dirección/búsqueda, pestañas, favoritos y atajos.

### Incluye

- Pestañas y nueva pestaña.
- Barra de dirección/búsqueda.
- Favoritos e historial.
- Workspaces.
- Extensiones Chromium desde el flujo soportado por el proyecto.
- Ahorro de energía y herramientas de rendimiento.
- Bloqueador de contenido.
- Páginas internas y Nova Tab.

## Desarrollo

Requiere Node.js 22.12.0 o superior.

```bash
npm install
npm run check
npm start
```

Build Windows:

```bash
npm run dist:win
```

## Estructura

El runtime principal del renderer está consolidado en `shell/nova-runtime.js` para mantener el repositorio por debajo de 100 archivos sin eliminar las funciones que seguían siendo necesarias.

## Seguridad

Consulta `SECURITY.md`. Algunas partes del renderer forman parte de la arquitectura heredada y no se migran parcialmente en esta versión de estabilidad.
