# Nova 6.2.2 — Next Evolution

Nova es un navegador de escritorio basado en Electron/Chromium con una interfaz inspirada en la claridad de Chrome y una identidad visual propia. Esta actualización grande reúne distribución dual, perfiles independientes, navegación, grupos de pestañas, descargas controlables, permisos por sitio, importación de datos y noticias desactivables.

## Distribuciones de Windows

### Setup — instalación por usuario

El instalador NSIS es asistido, instala para el usuario actual y está configurado para no solicitar elevación: `oneClick: false`, `perMachine: false`, `allowElevation: false`. De forma predeterminada crea accesos directos en Escritorio y menú Inicio. Mantiene la ruta de usuario predeterminada para evitar elegir accidentalmente una carpeta protegida. El objetivo de salida es `dist/setup/Nova-Setup-6.2.2.exe`.

### Portable

El ejecutable portable no requiere instalación. Cuando la carpeta permite escritura, guarda sus datos en `User Data` junto al ejecutable. Si la carpeta está protegida o es de solo lectura, Nova explica el problema y usa el perfil de Windows como alternativa. El objetivo de salida es `dist/portable/Nova-Portable-6.2.2.exe`. Las dos ediciones usan directorios de compilación separados para que el segundo proceso no pueda borrar el primer instalador.

**Setup y Portable mantienen perfiles independientes.** Un Portable nuevo no copia automáticamente marcadores, cookies, historial ni preferencias de la edición instalada. Para conservar el perfil de una edición Portable previa, deja su carpeta `User Data` junto al ejecutable. La copia desde un perfil de Windows solo puede activarse de manera explícita mediante `NOVA_IMPORT_EXISTING_PROFILE=1` durante un lanzamiento controlado.

## Compilación

Requisitos declarados: Node.js `>=22.12.0`, npm y Windows para crear los ejecutables de Windows. Las dependencias directas están fijadas en `package.json`; esta entrega no incluye `package-lock.json`, así que npm resolverá las dependencias transitivas durante la instalación. Para una release reproducible, conviene generar y revisar el lockfile con npm en un entorno conectado antes de publicar.

```powershell
npm install --no-audit --no-fund --engine-strict
npm run check
npm run dist:setup
npm run dist:portable
```

`npm run dist` / `npm run dist:win` compilan las dos ediciones en secuencia. `npm run dist:setup` y `npm run dist:portable` permiten compilar cada artefacto de forma independiente. La salida debe contener exactamente los nombres esperados para la versión del paquete.

## Qué incluye 6.2.2

- Búsqueda con URL o consulta, motores configurables y nueva pestaña actualizable.
- Noticias RSS de fuentes identificables, con caché señalizada y una opción en Ajustes para ocultarlas.
- Grupos de pestañas con nombre que se conservan en la restauración de sesión.
- Gestor de descargas con progreso, estado, pausa, reanudación, cancelación, abrir carpeta y mostrar archivo cuando la API lo permite.
- Permisos recordados por sitio para cámara, micrófono, ubicación y notificaciones, con una pantalla para cambiar o borrar decisiones guardadas.
- Importación de marcadores e historial desde perfiles locales detectados de Chrome, Edge y Firefox. No importa contraseñas cifradas.
- Centro de extensiones integrado y gestor de extensiones Chromium desempaquetadas. Electron admite solo un subconjunto de las APIs de extensiones; no se garantiza compatibilidad con todas las extensiones de Chrome ni se instalan paquetes `.crx` directamente.
- Barra lateral configurable, modo claro/oscuro/sistema, acento, fondo de barra opcional y ajustes persistentes.

## GitHub Actions

Los workflows `build.yml` y `release.yml` validan la configuración, ejecutan las comprobaciones, generan Setup y Portable por separado y verifican la existencia de ambos artefactos. `release.yml` calcula SHA-256 y publica ambos ejecutables. No se modifica `package.json` desde los workflows.

El fallo anterior de `p.build.nsis.include` ocurría porque el perfil portable no definía `build.nsis`; acceder a `.include` provocaba un error de tipo. En 6.2.2 `build.nsis` se define de forma estática y las comprobaciones verifican sus valores antes de compilar.

## Comprobación y límites

```powershell
npm run check:distribution-config
npm run check:project
npm run check:syntax
npm run qa:6.2.2
npm run check:build-assets
```

Estas pruebas estáticas y de lógica no sustituyen la compilación y ejecución real de Setup y Portable en Windows. El informe de validación distingue entre las verificaciones realizadas en este entorno y las pruebas que deben confirmarse mediante GitHub Actions o un equipo Windows.
