# Nova 4.3.0

Nova es un navegador Chromium de escritorio con interfaz **Glass Clean**: transparencia moderada, iconos SVG consistentes, sidebar configurable, favoritos fijados con favicons reales, rendimiento y compatibilidad con WebExtensions desempaquetadas.

### Desarrollo
- Node 22+
- `npm install`
- `npm start`
- `npm run check`
- `npm run ui-audit`
- `npm run dist:win`

La configuración y preferencias viven en el directorio de datos de usuario de Electron; el instalador no elimina esos datos al desinstalar.

# Nova

Nova es un navegador de escritorio basado en Electron/Chromium, orientado a privacidad, productividad y una experiencia de uso limpia.

## Nova 4.3

- Interfaz visual unificada con iconografía SVG local.
- Solo tres modos de apariencia: Sistema, Claro y Oscuro.
- Instalador NSIS simplificado para actualizaciones conservadoras.
- Configuración y estado guardados fuera de la carpeta de instalación.
- Respaldo automático de preferencias antes de sobrescribirlas.
- Renderer principal aislado mediante `contextIsolation` + preload.
- Extensiones y navegación web siguen ejecutándose en contenido aislado.

## Desarrollo

```bash
npm install
npm run start
```

Comprobaciones:

```bash
npm run check
npm run dist:win
npm run dist:linux
```

La configuración del navegador se guarda en el directorio `userData` de Electron, no dentro del directorio de instalación.
