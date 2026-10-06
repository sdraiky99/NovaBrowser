# Changelog

## 4.3.0 — Glass Clean
- Rediseño visual limpio y translúcido.
- Iconografía SVG coherente.
- Sidebar orientada a tareas diarias.
- Favicons reales para fijados.
- Ahorro de energía.
- Extensiones WebExtension locales + catálogo oficial.
- Auditoría de UI y limpieza de controles heredados.

# Changelog

## 4.2.0 — Foundation

- Limpieza del árbol raíz y archivado de documentación histórica.
- Apariencia reducida a Sistema/Claro/Oscuro.
- Iconografía SVG local coherente.
- Renderer principal migrado a preload + contextIsolation.
- Preferencias con versión y respaldo automático.
- Instalador NSIS simplificado y textos actualizados.
- Logo único y estable para reducir errores de actualización.


# Nova 4.1.0
- Evolution Update: página principal premium/gaming, Game Hub, Perfil Gaming, privacidad 4.1, Sync 4.1, Extensions Store, traducción y DevTools.

# Nova 4.0.0 — Ultimate Workspace

## Limpieza y mejora
- Se retira `shell/tabs.js`, módulo heredado que no formaba parte del shell activo.
- Se eliminan `shell/qa-runtime.html`, `qa-mock-runtime.js` y `qa-runner-runtime.js` del paquete fuente de entrega; son artefactos temporales generados por la QA antigua.
- Nova Launcher ahora encuentra funciones de Nova 3.x/4.0, pestañas, historial y URLs, con navegación por teclado.
- Quick Actions se concentra en las acciones de uso frecuente y el Hub queda como punto único de entrada.
- Page Brain/Talk to Page usan el contexto de la página para Nova IA cuando está disponible y mantienen un fallback local.
- Research Mode analiza el contenido de las pestañas en lugar de guardar solo sus URLs.
- Vault incorpora búsqueda, edición de notas, exportación y gestión centralizada.
- Se corrige la resolución de rutas camelCase y la selección de pestañas desde el Launcher.
- Los perfiles Web Superpowers se reaplican al navegar.
- Se amplía la QA a 49 pruebas y se comprueba que todos los botones de la capa Ultimate tengan callback.

## Qué cambia
- Nova Ultimate Hub: una entrada única para las novedades.
- Nova Launcher: búsqueda rápida de funciones, pestañas e historial.
- Nova Dock: accesos persistentes a las herramientas nuevas.
- Page Brain + Talk to Page + Research Mode.
- Nova Vault + Timeline + Continue Anywhere.
- Web Superpowers por sitio, Visual Search y Magic Translate.
- Workspaces+, Islands 2.0 y Spaces 2.0.
- Nova Studio, Nova Flows y Extensions 2.0.
- Nova Companion, Nova Sync y Desktop Mode.
- Acceso desde el Hub a Snapshot, Link Preview, Notifications, Smart Groups, Cleanup y Daily ya existentes en 3.1.

## Compatibilidad
Los módulos existentes de Nova 3.0/3.1 siguen presentes. `shell/nova40.js` es una capa adicional.

# Nova 3.1.0 — New Things

- Añade 15 funciones nuevas en una capa independiente: Quick Actions, Pinboard, Nova Memory, Smart Tab Groups, Search Anything, Link Preview, Website Themes, Smart Notifications, Permission Center, Automations, Mini Mode, Nova Send, Page Snapshot, Nova Daily y One-Click Cleanup.
- Añade acceso **✨ Nuevas** al centro de novedades y al Command Center.
- Mantiene intacta la arquitectura estable de Nova 3.0.1 y guarda el nuevo estado bajo `S.nova31`.
- Verificación runtime: 31/31 pruebas, 66 rutas, 0 errores de arranque y 38 canales IPC `invoke` cubiertos.

# Nova 3.0.1 — QA Hotfix

- Corrige errores de arranque causados por referencias de módulo faltantes.
- Corrige rutas `nova://`, aliases y acciones de navegación internas.
- Reader+, Web Capture y Collections operan sobre la pestaña web activa.
- Corrige persistencia de sesión y restauración de Safari Mode.
- Corrige Nova IA, Command Center, Super Cat y acciones de contexto.
- Añade regresiones runtime que ejercitan 50 rutas y 32 acciones.
- Verificación final: 24/24 pruebas runtime, 38 canales IPC `invoke` cubiertos y 0 errores de startup.

# Nova 3.0.0 — Calm Power

- Repara Nova IA desde el panel y Command Center: acciones de abrir, nueva conversación, selección y resumen vuelven a ejecutar su lógica.
- Añade un puente seguro `nova-ai` en el proceso principal para no depender de la clave API en el renderer.
- Hace robustos los enlaces internos de Nova Tab y añade aliases para evitar caídas silenciosas a «Acerca de Nova».
- Expone el Command Center (`NOVA.palette`) y el acceso rápido a Nueva nota.
- Unifica etiquetas del instalador y versión 3.0.0.

# Changelog

## 3.0.0 - 2026-10-01
- Calm Power: Air + Safari + Zen-inspired Spaces/Islands.
- Glance, Focus, Reader+, Command Center y atajos personalizables.
- Writer/Docs con exportación DOCX real, Study 3, Collections, Reading List y Nova Send.
- Privacy Center, Performance Center, Download Hub, Web Apps, Web Panels, Media Hub y Picture-in-Picture.
- Sessions, Tab Manager/Snooze, QR sharing, Backup/Restore y pestañas verticales opcionales.
- Nova AI y Super Cat permanecen compatibles mediante la capa de hotfix.


## 2.5.0 - 2026-10-01
- Safari Mode, Nova Islands y Glance.
- Command Center ampliado, Focus y Reader+.
- Collections, Web Capture y Web Apps.
- Nova Writer/Docs con exportación DOCX.
- Study 3, Privacy Center, Performance Center y Download Hub.
- Nuevo onboarding, setup y Novedades con imágenes locales.
- Nuevo sitio `nova://mejoras`.

## 2.4.5
- Nova Air: interfaz limpia, translucidez suave y comportamiento adaptativo claro/oscuro.
- Pestañas: botón + integrado junto a la última pestaña y reordenable con el resto.
- Enlaces: soporte para abrir directamente en una nueva pestaña (opción en Ajustes), además de Ctrl/Cmd+clic y clic central.

## 2.4.0
- Nuevo tema **Cyberpunk** inspirado en Cyberpunk 2077: negro profundo, amarillo neón, cian y rojo; pestañas, botones y menús de esquinas cortadas; barra de direcciones tipo terminal y marca con efecto glitch. Se aplica también a Nova Tab y a las páginas internas.
- Nuevo logotipo **Retro 2009** (esfera azul brillante estilo Web 2.0) con icono de Windows (.ico) y su propia **animación de inicio**: ventana clara, orbe que rebota, destello, nombre con reflejo y barra de progreso verde.
- Nova Tab minimalista: la página de inicio muestra solo la barra de búsqueda. Reloj, accesos rápidos, marcadores, historial, descargas, Nova IA, Centro rápido y recientes pasan a la pestaña **Más**.
- Ajustes › Apariencia: accesos directos a Cyberpunk, al logotipo Retro 2009 y a la vista previa de su animación.
- Novedades (nova://novedades) incluye las notas de actualización 2.4.0.

## 2.3.0
- Super Cat se puede quitar y volver a activar (Ajustes › Super Cat).
- Windows 7 Aero rehecho con cristal real (Windows 11 22H2+) y reflejos.
- Nuevo tema Nova 44 (estilo Chrome 44, 2015).

## Nova 2.2.0 + Super Cat

- Añadido Super Cat como asistente flotante con animaciones de ánimo.
- Chat con OpenAI/ChatGPT mediante la Responses API y clave almacenada con `safeStorage`.
- Voz de salida con `speechSynthesis` y dictado por voz cuando está disponible.
- El contexto de la pestaña actual puede enviarse opcionalmente al asistente.

## Nova 2.2.0 — auditoría y distribución Fedora

- Auditoría técnica de seguridad, IPC, navegación, cuentas, actualización, extensiones y persistencia.
- CI separado de releases: los releases solo se publican desde tags `v*.*.*`.
- Añadidos targets Linux RPM + AppImage y workflow de release Linux.
- Añadido instalador sencillo para Fedora y guía de instalación/desinstalación.
- Publicación automática de `SHA256SUMS.txt`.

## Nova 2.2.0
- Barra superior, vista dividida, menú contextual web reforzado, perfiles funcionales en principal, zoom real, guía de navegador predeterminado y actualizaciones directas.

# Nova 2.1.0

- Nova Tab como hub central de Study, Workspaces, pestañas, notas, PDF, rendimiento, seguridad, perfiles, Sync, extensiones y Media Hub.
- Study 2.1 con controles de Tutor, Examen, contexto y enfoque.
- Nova Turbo, gestor de pestañas, memoria local y acciones rápidas.

# Nova 2.0.0

- Nova Study
- Workspaces
- Modo lectura
- Rendimiento/RAM
- Seguridad y accesibilidad
- Bienvenida, Novedades e instalador renovados
- 34 extensiones

# Changelog

## 1.6.5

- Perfiles de Nova con sesiones web persistentes separadas, cambio rápido, creación, edición y eliminación.
- La sesión web de cada perfil usa una partición persistente distinta; los perfiles no mezclan cookies ni almacenamiento web.
- F12 abre y cierra las herramientas de desarrollador de la pestaña activa; también queda disponible desde Ajustes/Command Center.
- Cuenta Nova añadida en Ajustes, con identificador del tipo `usuario@Nova.com`.
- Inicio de sesión persistente mediante token protegido con `safeStorage` en cada equipo.
- Sincronización online entre PCs para marcadores, historial y preferencias compatibles.
- El servidor de cuentas fusiona datos en vez de reemplazarlos para reducir pérdidas al conectar varios equipos.
- Las contraseñas guardadas del navegador, cookies y la clave de Nova IA quedan fuera de la sincronización.
- Servicio de cuentas incluido en `account-server/` para desplegar detrás de HTTPS.

## 1.6.4

- Barra de marcadores fija en la parte inferior, opcional y ocultable desde el propio navegador.
- Clic derecho sobre marcadores y carpetas con abrir, abrir en nueva pestaña, editar, copiar, eliminar, renombrar y quitar carpeta conservando marcadores.
- Bienvenida ampliada con imágenes locales y accesos a Novedades, Importar marcadores, Migrar navegador y Rendimiento/RAM.
- Migración local de Google Chrome, Microsoft Edge y Mozilla Firefox en modo solo lectura para marcadores e historial compatibles.
- Importación de marcadores HTML/JSON desde el gestor de Marcadores.
- Centro de Rendimiento/RAM con RAM de Nova, CPU, memoria del sistema, pestañas y consumo por pestaña.
- Modo opcional de ahorro de memoria; conserva el comportamiento normal de throttling de Electron y reduce la reproducción repetida de imágenes animadas.
- Auditoría local de seguridad para webviews, sandbox, web security, navegación, popups, acceso a archivos, instancia única y bloqueador.
- Bloqueador Ghostery con `cross-fetch`, caché persistente versionada y renovación periódica de listas.
- Cuatro extensiones nuevas y opcionales: aviso HTTP, enlaces no HTTPS, limpieza de parámetros de seguimiento y vídeo ligero.
- Corrección de rutas duplicadas de la barra y del atajo Ctrl+Shift+B.
- Diagnósticos de IPC, memoria y seguridad añadidos sin eliminar las funciones anteriores.

## 1.6.1

- Capa adicional de seguridad y recuperación.
- Comprobaciones automáticas de sintaxis y dependencias para GitHub.
- Migración añadida desde perfiles locales de Google Chrome, Microsoft Edge y Mozilla Firefox.
- La migración importa marcadores e historial sin borrar ni modificar los datos del navegador de origen.
