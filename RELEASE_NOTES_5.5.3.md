# Nova 5.5.3 — Reliability & UI Fix

## Corregido
- La URL de una pestaña se asigna antes de adjuntar el elemento `webview`, de modo que Electron puede reconocer la nueva pestaña y aplicar el preload seguro durante `will-attach-webview`.
- Búsqueda y navegación desde la barra de direcciones y la nueva pestaña, incluyendo enlaces de accesos rápidos y mensajes de error más claros.
- Color de acento efectivo tanto en modo claro como oscuro; colores unificados entre Ajustes y el selector rápido.
- Botón `+` centrado, controles de minimizar/maximizar/cerrar con toda la altura de la barra y el botón de cerrar alineado al borde derecho.
- Validación de manifiestos de extensiones Chromium y mensajes más claros al instalar/quitar extensiones.

## Extensiones: una limitación importante
- Nova no es Google Chrome, por lo que Chrome Web Store puede bloquear la instalación directa. Los enlaces del centro ahora se identifican como fichas oficiales de consulta y no como instalación directa.
- La vía compatible de Nova es cargar una carpeta de extensión desempaquetada que incluya `manifest.json`, siempre que la extensión y su versión de Manifest sean compatibles con Electron/Chromium.

## Verificación
- Se amplía el chequeo sintáctico para recorrer todos los archivos JavaScript, incluidos los scripts históricos.
- Se incluyen pruebas de navegación, puente preload, variables de acento, orden de adjunción de webview, controles de ventana, instalación por carpeta y metadatos.
- Las pruebas automatizadas no sustituyen la prueba interactiva en Windows; esta entrega no afirma haber ejecutado el instalador gráfico ni verificado servicios remotos desde una sesión real.
