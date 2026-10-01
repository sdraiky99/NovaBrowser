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
