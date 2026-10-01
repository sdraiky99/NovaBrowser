# Nova 3.0.0 — Verification Report

Fecha: 2026-10-01

## Automatizado y verificado

- Sintaxis JavaScript para el núcleo, shell, cuenta y scripts.
- `scripts/check-project.js`.
- `scripts/smoke-test-3.0.js`.
- 27 rutas internas de Nova renderizadas en el DOM simulado.
- Controles de las rutas comprobados: todos los botones generados tienen manejador.
- 32 acciones de Command Center ejercitadas con runtime simulado.
- Aliases internos y el alias `nova://acciones` resuelven al Command Center.
- Colecciones, Reading List y Web Apps ejercitados.
- Writer: exportación HTML ejercitada.
- Writer: payload DOCX generado y paquete ZIP validado con `zipfile.testzip()`.
- Performance: campos de IPC contrastados con el esquema real.
- Safari, Focus, Islands, Spaces, Reader+, Sessions, QR, Backup, Panels, PiP y Send cubiertos por las páginas/controles de la suite.
- Release assets locales presentes en `assets/release/3.0`.
- Configuración de Electron Builder y scripts de build verificados estáticamente.

## Resultado

`Nova 3.0 deep smoke OK`

## No ejecutado en este entorno

No se pudo iniciar Electron ni producir el `.exe` porque este entorno no tiene `node_modules`/Electron instalados y no dispone de un caché npm utilizable. Por tanto, esta revisión no sustituye una prueba interactiva de la aplicación empaquetada.

## Avisos técnicos que quedan

1. El renderer principal sigue usando `nodeIntegration: true` y `contextIsolation: false` por compatibilidad con la recuperación 2.5.x. La migración a `preload/contextBridge` debe hacerse en una rama separada y verificarse arrancando Electron antes de retirar el modelo actual.
2. No hay `package-lock.json` porque la generación reproducible no pudo completarse en este entorno sin red/caché.

## Regla para siguientes cambios

No retirar un módulo legacy hasta que su reemplazo tenga una prueba funcional y Nova haya arrancado con la nueva arquitectura.
