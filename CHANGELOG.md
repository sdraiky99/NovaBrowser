# Changelog de Nova

## 6.2.2 — Next Evolution
- Recupera la distribución dual Setup NSIS por usuario + Portable con compilaciones separadas.
- Elimina mutaciones de `package.json` dentro de GitHub Actions y valida los dos nombres de artefacto.
- Separa perfiles: el Portable nuevo no copia silenciosamente el perfil de Windows; se conserva el perfil `User Data` existente.
- Incorpora grupos de pestañas persistentes, gestor de descargas con controles, interfaz de importación y gestión de permisos por sitio.
- Añade configuración para ocultar noticias y amplía las fuentes RSS.
- Actualiza QA, documentación de distribución y criterios de aceptación.

# Changelog de Nova

## 6.2.1 — Portable Stability Update
- Se elimina el setup de la publicación: Windows compila únicamente `Nova-Portable-6.2.1.exe`.
- El perfil del portable se guarda en `User Data/` junto al ejecutable, con fallback automático al perfil de Windows si la carpeta no permite escribir.
- Se intenta migrar el perfil existente la primera vez, omitiendo cachés y bloqueos de Chromium y evitando continuar con una migración parcial.
- Se añaden pruebas del almacenamiento portable y se reduce el flujo de GitHub Actions a un artefacto portable de Windows.

## 6.2.0 — Precision Update
- Recuperación de sesión opcional, gestión de extensiones Chromium compatibles y accesos rápidos con icono alternativo.
- Suite de QA y validación de regresiones ampliada.

## Historial anterior
Las notas y recursos históricos se conservan en `docs/history/`.


## 6.2.1 — Hotfix de CI portable
- Corregido el flujo de GitHub Actions para no acceder a `build.nsis.include` cuando la configuración NSIS no existe.
- Reforzadas las validaciones para impedir que se reactive el instalador Setup.
