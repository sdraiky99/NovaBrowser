# Changelog NOVA 7

## 8.0.0 — NOVA X · la actualización mayor
- Hibernación de pestañas: las pestañas inactivas se duermen solas (configurable: 5/10/30/60 min o desactivado) y despiertan al clicarlas. Dormir manual desde el menú de pestaña y desde Command Center.
- Notas rápidas: notas locales en la barra lateral, sin cuentas ni nube; guardado, edición y borrado con límite de 50 notas.
- Temas nuevos: Aurora (azul glaciar), Carbon (gris neutro) y Solar (ámbar cálido), en claro y oscuro, en el navegador y en la nueva pestaña.
- Nova Update Center completo: estado en vivo, descarga con progreso y botón Instalar y reiniciar (el flujo de electron-updater ya estaba cableado por detrás).
- Copiar enlace limpio: el menú contextual copia enlaces y direcciones sin parámetros de rastreo (utm_*, fbclid, gclid…).
- Reader Mode renovado: respeta el tema oscuro y añade controles de tamaño de letra (A− / A+).
- Command Center ampliado: nodos de Notas, Dormir pestañas inactivas y Cerrar duplicadas.
- Historial configurable (300/1.000/3.000 entradas) desde Ajustes → Privacidad.
- Sobre la base 7.1.1 (noticias corregidas y Electron 45 / Chromium 156).

## 7.1.1 — Corrección de noticias
- Corregido el parser de noticias: los bloques CDATA se trataban como etiquetas HTML y borraban los titulares de Xataka, Genbeta, The Verge y PC Gamer (0 noticias de 4 de 7 fuentes).
- Feeds de Xataka y Genbeta actualizados a su URL final (feedburner.xml, redirección 301).
- Noticias de Steam filtradas por alfabeto latino: los ítems en ruso del feed comunitario ya no aparecen.
- Tiempo de espera de descarga de feeds ampliado de 7 a 12 segundos para feeds grandes (PC Gamer ~2 MB).

## 7.1.0 — Actualización de motor y dependencias
- Motor actualizado a Electron 45.3.0 con Chromium 156.0.8078.96 y Node.js 24.22.2.
- electron-builder 26.18.0, electron-updater 6.8.11, bloqueador Ghostery 2.20.3, sql.js 1.16.0 y cross-fetch 4.1.0.
- Mantenida la configuración de seguridad del renderer (sandbox, contextIsolation, nodeIntegration desactivado).
- Notas de versión y validación aisladas por entrega; artefactos Setup y Portable renombrados a 7.1.0.

## 7.0.0 — NOVA 7 FLOW Recovery
- Major update from 6.4.1; browser rebranded as NOVA 7.
- Dual tab layouts, persistent bookmarks bar, split view and Reader Mode.
- Nova Shield toolbar entry, Nova Media, cloud Translate, Focus timer and JSON backups.
- Spanish-first RSS feeds plus Steam News API integration.
- Setup/Portable artifact branding and CI validation for 7.0.0.

# Nova — Changelog

## 6.4.1 — FLOW Reborn
- Renovación visual minimalista y nuevo símbolo N con fondo transparente.
- Nueve colores de acento, selector de color personalizado y persistencia.
- Tema secreto Nova Eclipse: desbloqueo con diez clics en el logo; activación posterior en Ajustes.
- Nova Assist en el panel lateral: Ollama local exclusivo.
- El contenido de página solo se comparte con Nova Assist cuando el usuario marca explícitamente esa opción.
- Modo Focus y Quick Actions en Ctrl+Shift+P (Ctrl+K también sigue disponible).
- Actualización de checks de proyecto, configuración de distribución y workflows a 6.4.1.

# Changelog de Nova

## 6.3.0 — Velocidades Locas · Deluxe Edition
- Renovada la identidad de Nova con una N 3D geométrica sin fondo, en SVG, PNG transparente y un ICO multi-resolución para Windows.
- Integrado el nuevo logo en la barra de navegador, favicon, nueva pestaña, pantalla de inicio y recursos de ventana/instalador.
- Corregidas las referencias obsoletas a 6.2 en la interfaz y la documentación activa.
- Conservados Setup por usuario y Portable con perfiles separados y directorios de salida independientes.
- Añadidas comprobaciones de marca y mantenidas las pruebas de sesión, permisos, importación, navegación y rendimiento acotado.

## Historial
Las notas de versiones anteriores se conservan en `docs/history/`.
