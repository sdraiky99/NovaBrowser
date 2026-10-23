# Nova 6.2.0 — Precision Update

Nova es un navegador de escritorio basado en Electron/Chromium. Nova 6 mantiene una interfaz híbrida y pule las funciones cotidianas: interfaz híbrida inspirada en la familiaridad de Chrome, identidad propia de Nova y un sistema visual compartido entre ventana, nueva pestaña, paneles, menús y ajustes.

## Principios de Nova 6
La especificación completa de pantallas y criterios de aceptación está en [`docs/NOVA_6_DESIGN_SPEC.md`](docs/NOVA_6_DESIGN_SPEC.md).

- Interfaz equilibrada, clara y coherente; modo claro, oscuro y adaptación al sistema.
- Pestañas y barra de direcciones familiares, con búsqueda funcional.
- Nueva pestaña inspirada en Chrome con búsqueda, accesos rápidos y noticias visibles por defecto.
- Panel lateral opcional y contraíble.
- Conservación y auditoría de favoritos, historial, descargas, Workspaces, extensiones, privacidad y rendimiento.
- Instalador y paquete portable con versión técnica válida `6.2.0`.

## Desarrollo
Requiere Node.js 22.12.0 o superior.

```bash
npm install
npm run check
npm start
```

Compilar Windows: `npm run dist:win`. Compilar Linux: `npm run dist:linux`. Los artefactos previstos de Windows son `Nova-Setup-6.2.0.exe` y `Nova-Portable-6.2.0.exe`.

## Verificación
`npm run check` ejecuta las comprobaciones de proyecto, sintaxis, pruebas de regresión y recursos de compilación. Este paquete no incluye `package-lock.json` porque el registro de npm no respondió durante su preparación; los flujos de GitHub Actions usan `npm install`. Cuando se genere un lockfile en un entorno con conexión, conviene revisarlo, incluirlo y cambiar CI a `npm ci`. Una comprobación estática no sustituye abrir y probar Nova en Windows: confirma navegación, temas, menús, panel lateral, noticias, datos existentes e instalación antes de distribuirla.

## Datos y actualizaciones
No elimines manualmente la carpeta de datos de Nova al actualizar. Haz una copia de seguridad antes de instalar compilaciones de prueba. Las limitaciones de compatibilidad de extensiones deben comunicarse claramente; estar disponible en Chrome Web Store no garantiza que una extensión pueda instalarse directamente en Nova.

## Funciones de 6.2.0
- Recuperación opcional de la última sesión (hasta 10 direcciones HTTP/HTTPS), configurable desde Ajustes.
- Extensiones Chromium compatibles: cargar carpeta desempaquetada, ver permisos declarados, activar/desactivar y desinstalar, con estado persistente.
- Accesos rápidos que rellenan espacios disponibles y tienen fallback de icono fiable.
- Suite QA actualizada para los flujos críticos.

Las extensiones dependen de las APIs disponibles en la versión de Electron utilizada. No se ofrece instalación universal directa desde Chrome Web Store.
