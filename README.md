# Nova 6.3 Deluxe Edition — Velocidades Locas

Nova es un navegador de escritorio basado en Electron/Chromium. La edición Deluxe de 6.3 combina una identidad visual renovada con mejoras de continuidad, distribución y validación. Mantiene una interfaz compacta, iconos locales y temas claro/oscuro/sistema.

## Lo más destacado

- **Nueva marca Nova:** N geométrica 3D, con fondo transparente, usada en la interfaz, el splash, el favicon y los recursos de Windows.
- **Navegación y nueva pestaña:** búsqueda por URL o consulta, accesos rápidos editables y noticias opcionales desde fuentes identificables.
- **Continuidad:** preferencias guardadas, restauración de hasta 50 pestañas web y grupos en los casos compatibles con el estado almacenado.
- **Herramientas:** marcadores, historial, panel lateral, gestor de descargas, importador de marcadores/historial, permisos por sitio y gestión de extensiones Chromium desempaquetadas.
- **Setup y Portable:** configurados con directorios de compilación independientes y perfiles separados.
- **Validación:** comprobaciones del proyecto, sintaxis JavaScript, lógica de distribución, recursos gráficos y un microbenchmark acotado de resolución de URL/búsqueda.

Las limitaciones de compatibilidad de Electron y las verificaciones pendientes se describen en `RELEASE_NOTES_6.3.0.md` y `VALIDATION_6.3.0.txt`.

## Distribuciones de Windows

### Setup — instalación por usuario

El instalador NSIS es asistido y está configurado para el usuario actual, sin solicitar elevación como comportamiento normal: `oneClick: false`, `perMachine: false`, `allowElevation: false`. Crea accesos directos en Escritorio y menú Inicio. No borra de forma silenciosa los datos personales al desinstalar.

Ruta esperada: `dist/setup/Nova-Setup-6.3.0.exe`.

### Portable

No requiere instalación. Cuando la carpeta permite escritura, guarda el perfil en `User Data` junto al ejecutable. Si la carpeta no es escribible, la aplicación usa el perfil de Windows como alternativa e informa del modo de funcionamiento. Un Portable nuevo no copia automáticamente los datos de Setup.

Ruta esperada: `dist/portable/Nova-Portable-6.3.0.exe`.

## Compilar

Requisitos declarados: Windows para generar los ejecutables de Windows, Node.js `>=22.12.0` y npm. Las dependencias directas están fijadas en `package.json`. Este paquete no incluye `package-lock.json`; npm resolverá dependencias transitivas al instalar. Para una publicación reproducible conviene generar y revisar un lockfile en un entorno conectado antes de publicar.

```powershell
npm install --no-audit --no-fund --engine-strict
npm run check
npm run dist:setup
npm run dist:portable
```

`npm run dist` compila las dos ediciones en secuencia. Los artefactos se escriben en carpetas distintas para que la compilación Portable no sobrescriba el Setup.

## Comprobaciones

```powershell
npm run check:distribution-config
npm run check:project
npm run check:syntax
npm run qa:6.3
npm run check:build-assets
npm run check:performance
```

Las pruebas estáticas y de lógica no equivalen a abrir y probar el navegador con páginas reales. En esta entrega no se afirma que los `.exe` se hayan compilado o probado en Windows; los workflows de GitHub Actions deben completar esa parte.

## Seguridad y límites conocidos

- No se promete compatibilidad universal con Chrome Web Store ni con todos los APIs de extensiones.
- La importación no intenta descifrar contraseñas ni extraer secretos.
- El renderer local principal aún conserva `nodeIntegration: true` y `contextIsolation: false` por dependencias heredadas; la migración completa requiere una refactorización específica y pruebas de regresión.
- Las mediciones del script de rendimiento solo cubren la función pura de resolución de navegación, no el arranque completo, la red, las páginas remotas ni el consumo de RAM.
- No se entrega `package-lock.json` en este paquete.
