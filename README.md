# Nova 1.6.1
Navegador basado en Chromium (Electron). Paginas: nova://historial, descargas, marcadores, notas, juegos, ajustes, privacidad, novedades, acerca, personalizar, tienda, bienvenida.
Atajos: Ctrl+K comandos, Ctrl+Espacio Nova IA, Ctrl+D marcador. Nova IA: Ajustes > Nova IA (clave cifrada).
Navegador predeterminado: menu > Navegador predeterminado (solo con Nova-Setup, no con el portable).

## Migración de navegador
En `nova://migrar` puedes detectar perfiles locales de Google Chrome, Microsoft Edge y Mozilla Firefox e importar marcadores e historial. La importación es de solo lectura y no elimina ni modifica el navegador de origen. Las contraseñas cifradas de los perfiles no se extraen.

## Seguridad y estabilidad
Nova incorpora validación de IPC, aislamiento de `webview`, restricciones de navegación y ventanas, permisos controlados, recuperación ante procesos renderer bloqueados, copias atómicas del estado y comprobaciones automáticas de seguridad en GitHub.
