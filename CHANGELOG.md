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
