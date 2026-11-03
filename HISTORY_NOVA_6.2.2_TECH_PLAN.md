# Nova 6.2.2 — Plan técnico y criterios de aceptación

## Decisiones bloqueadas

- Versión: `6.2.2`.
- Distribución: NSIS Setup y Portable.
- Setup: instalación asistida por usuario, `perMachine: false`, `allowElevation: false`, `allowToChangeInstallationDirectory: false` para mantener la instalación por usuario en la ubicación prevista.
- Perfil: Setup usa el perfil estándar de la aplicación; Portable utiliza `User Data` junto al ejecutable cuando se puede escribir. No se importan datos automáticamente entre las dos ediciones.
- Noticias: RSS real, caché identificada y opción para ocultarlas.
- Estilo: mezcla Chrome + identidad Nova, iconos SVG locales y modo claro/oscuro coherente.

## Arquitectura de distribución

`package.json` declara los dos targets de Windows y la configuración NSIS. Los comandos son independientes:

- `npm run dist:setup` → `Nova-Setup-6.2.2.exe`.
- `npm run dist:portable` → `Nova-Portable-6.2.2.exe`.
- `npm run dist:win` → ambos en secuencia.

Los workflows ejecutan preflight, comprobaciones de proyecto y QA antes de compilar. No deben abrir, modificar ni reescribir `package.json` mediante Node inline.

## Criterios de aceptación

### Configuración y artefactos

- [ ] La versión del paquete es `6.2.2` y Electron Builder acepta el número semántico.
- [ ] NSIS es asistido, per-user, no permite elevación y conserva los datos tras desinstalar.
- [ ] `Nova-Setup-6.2.2.exe` y `Nova-Portable-6.2.2.exe` existen después de compilar en Windows.
- [ ] Los workflows comprueban ambos archivos y no contienen acceso a `p.build.nsis.include` ni mutaciones de `package.json`.
- [ ] La publicación incluye ambos archivos y `SHA256SUMS.txt`.

### Perfil y persistencia

- [ ] Una instalación Setup almacena los datos bajo el perfil del usuario actual.
- [ ] Portable usa `User Data` al lado del ejecutable si la ubicación admite escritura.
- [ ] Portable nuevo no clona automáticamente el perfil instalado.
- [ ] Reemplazar el ejecutable Portable conserva el directorio de datos existente.
- [ ] Si la carpeta no permite escritura, la interfaz informa del fallback; no afirma que el perfil siga siendo portable.

### Navegación y funciones

- [ ] Omnibox y buscador de nueva pestaña aceptan direcciones y consultas con Enter.
- [ ] Grupos de pestañas se asignan desde el menú contextual y sobreviven a la restauración de sesión.
- [ ] Descargas activas muestran progreso y permiten pausa/reanudación/cancelación mientras el objeto siga activo.
- [ ] Marcadores e historial se pueden importar, con deduplicación y topes explícitos.
- [ ] Permisos guardados por sitio se pueden inspeccionar, cambiar a «Preguntar» y borrar.
- [ ] Noticias provienen de feeds externos, muestran estados de caché/offline y pueden ocultarse.
- [ ] La carga de extensiones informa errores reales; no afirma compatibilidad universal ni acepta `.crx` como si fueran carpetas.
- [ ] El panel lateral puede ocultarse/mostrarse y conservar su preferencia.

### Validación

- [ ] `npm run check` supera las comprobaciones automáticas.
- [ ] GitHub Actions compila ambos ejecutables en Windows.
- [ ] Se instala y ejecuta Setup en cuenta estándar sin privilegios de administrador.
- [ ] Portable se inicia desde una carpeta escribible y desde una carpeta de solo lectura para comprobar el fallback.
- [ ] Se prueba persistencia de cookies, marcadores, historial y ajustes entre reinicios.
- [ ] Se prueba el importador con perfiles de muestra y al menos una descarga real.

## Riesgo original `p.build.nsis`

El workflow previo intentaba ejecutar `delete p.build.nsis.include` cuando `p.build.nsis` era `undefined`. El nuevo diseño declara `build.nsis` estáticamente y valida la existencia de la propiedad y los valores de instalación por usuario antes de construir. No se usan mutaciones temporales de la configuración.

## Estado honesto

La existencia y sintaxis de los archivos fuente puede comprobarse en un entorno Node. La compilación de NSIS y Portable, la ausencia real de UAC y el comportamiento interactivo todavía necesitan confirmación de GitHub Actions y pruebas en Windows. No se considera que esos criterios estén cumplidos solo porque el código pase tests estáticos.
