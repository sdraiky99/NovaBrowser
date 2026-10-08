# Nova 5.1.0 — Quantum Hotfix QA

## Resultado

- `npm run check` → PASS
- Project checks → PASS
- Nova 5.1 QA → PASS
- Build assets → PASS
- JavaScript syntax → PASS
- IPC invoke/handler audit → PASS (41 canales detectados)
- Windows ICO → PASS (incluye 256×256)
- Legacy `shell/themes.css` → eliminado
- Legacy `assets/logos/` → eliminado
- Release notes activas en raíz → solo 5.1.0
- Notas históricas 3.0/3.1 → `docs/history/` y recontextualizadas

## Advertencias no bloqueantes

- No hay `package-lock.json`; se mantienen versiones exactas en `package.json` y Node 22.12.0 está fijado en CI.
- El renderer principal conserva Node integration por compatibilidad con el núcleo histórico. La migración a preload/contextBridge queda fuera de este hotfix para evitar una regresión de estabilidad.

## Validación pendiente

El instalador `.exe` debe ejecutarse y probarse en Windows/GitHub Actions: instalación limpia, actualización sobre una versión anterior, arranque, creación/cierre de pestañas y conservación de `userData`.
