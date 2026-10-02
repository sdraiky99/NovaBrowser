# Nova 3.0.0 — QA Hotfix basado en el informe de Claudio

Fecha: 2026-10-02
Base: Nova 3.0.0 Calm Power

## Fallos corregidos

1. `ReferenceError` de `N`, `PG` y `MENU` en módulos heredados: los módulos afectados vuelven a arrancar sin abortarse.
2. IA > Guardar clave: `again` faltaba como parámetro en la sección de IA de Ajustes.
3. Resumen con Nova IA: ahora busca la pestaña web activa en vez de intentar ejecutar JavaScript sobre una página interna.
4. Reader+: usa la última pestaña web activa cuando la página interna de Reader está seleccionada.
5. Web Capture: usa la última pestaña web activa y muestra un aviso claro si no hay ninguna.
6. Rutas `nova://`: las rutas desconocidas ya no caen silenciosamente en Acerca de.
7. Acceso cruzado entre módulos: `refreshPages` y `renderGroups` se consumen desde `NOVA` en lugar de depender de funciones privadas de otros IIFE.
8. Persistencia de sesión: una pantalla interna/offline no puede borrar la última sesión web guardada por el snapshot periódico.
9. Safari Mode: guardar/restaurar el tema anterior solo ocurre en las transiciones de estado, evitando sobrescribir `prevTheme` al activarlo varias veces.
10. Arranque inicial: `install-cfg` está protegido por fallback/try-catch para que un fallo de IPC no cancele el arranque.
11. Bridge de guardado: `save` se expone desde `extras.js` después de crear `window.NOVA`, evitando una referencia prematura al objeto `NOVA`.
12. Navegación/acciones 3.0: se mantienen los puentes de Command Center y las rutas nuevas.

## Verificación

- `node --check`: todos los JS del proyecto.
- `node scripts/check-project.js`: OK.
- `node scripts/smoke-test-3.0.js`: OK.
  - 27 rutas renderizadas.
  - 32 acciones de Command Center ejercitadas.
  - DOCX validado como paquete ZIP OpenXML.
- `node scripts/qa-regression-3.0.js`: OK.
  - 15 regresiones específicas de Claudio.
- 25 archivos JS procesados por el smoke actual.

## Limitaciones

No se ejecutó Electron empaquetado porque el entorno no contiene `node_modules`/Electron y no dispone de red. Por ello quedan pendientes las pruebas de instalación real, actualización real, GPU/memoria real y comportamiento exacto de `<webview>` bajo Electron empaquetado.

Warnings existentes que siguen documentados:

- El renderer principal todavía usa Node Integration; la migración a `preload` + `contextBridge` debe hacerse en una iteración separada y probada con Electron real.
- No hay `package-lock.json` en esta copia.

## Reproducción recomendada para Claudio

```text
1. Instalar dependencias con npm install.
2. Ejecutar npm run check.
3. Lanzar Electron.
4. Probar primero: IA, Reader+, Capture, rutas nova://, marcadores, sesión, Safari Mode.
5. Probar después Command Center, Writer/DOCX, Collections, Study, Downloads y Profiles.
6. Cerrar/reabrir Nova y comprobar recuperación de sesión.
```

## Principio del hotfix

No se eliminó ningún módulo histórico. Los cambios son correctivos y están pensados para poder verificarse y retirarse de forma aislada en una futura migración arquitectónica.
