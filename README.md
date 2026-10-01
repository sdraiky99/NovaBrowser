# Nova 2.4.5
Navegador basado en Chromium (Electron). Paginas: nova://historial, descargas, marcadores, notas, juegos, ajustes, privacidad, novedades, acerca, personalizar, tienda, bienvenida.
Atajos: Ctrl+K comandos, Ctrl+Espacio Nova IA, Ctrl+D marcador. Nova IA: Ajustes > Nova IA (clave cifrada).
Navegador predeterminado: menu > Navegador predeterminado (solo con Nova-Setup, no con el portable).

## Migración de navegador
En `nova://migrar` puedes detectar perfiles locales de Google Chrome, Microsoft Edge y Mozilla Firefox e importar marcadores e historial. La importación es de solo lectura y no elimina ni modifica el navegador de origen. Las contraseñas cifradas de los perfiles no se extraen.

## Seguridad y estabilidad
Nova incorpora validación de IPC, aislamiento de `webview`, restricciones de navegación y ventanas, permisos controlados, recuperación ante procesos renderer bloqueados, copias atómicas del estado y comprobaciones automáticas de seguridad en GitHub.


## Nova 2.4.5 · versión actual
- Nova Air: interfaz limpia con cristal suave, pestañas redondeadas y modo claro/oscuro adaptativo.
- Nueva pestaña minimalista, accesos profundos mediante Command Center y sidebar más silenciosa.
- El botón `+` permanece junto a la última pestaña y se mueve al reordenarlas.
- Los enlaces pueden abrirse en pestaña nueva con Ctrl/Cmd + clic, clic central o mediante el ajuste de clic normal.
- Se conservan los temas y funciones retro/avanzadas anteriores, incluida la personalización Cyberpunk y Aero.
- Notas de actualización 2.4.5 en nova://novedades.

## Nova 2.3.0
- Super Cat opcional: se quita y se vuelve a activar desde Ajustes › Super Cat (o con el botón 🚫 de su panel).
- Tema Windows 7 Aero con cristal real (Windows 11 22H2+) y tema Nova 44 (estilo Chrome 44).


Esta actualización añade una barra de marcadores inferior opcional, menú contextual de marcadores y carpetas, bienvenida visual, importación y migración desde Chrome/Edge/Firefox, Centro de Rendimiento/RAM, modo opcional de ahorro de memoria y nuevas extensiones de seguridad, privacidad y rendimiento. La migración trabaja en modo solo lectura y no modifica el navegador de origen.

## Nova 2.1.0

Esta versión conserva las funciones anteriores y añade: perfiles con sesiones separadas, F12/DevTools y Cuenta Nova con sincronización online. El cliente no sincroniza contraseñas guardadas, cookies ni la clave de Nova IA.

### Cuenta Nova
El proyecto incluye un servicio de referencia en `account-server/`. Para usar cuentas online reales, ese servicio debe desplegarse detrás de HTTPS y `account-config.json` debe apuntar a su API. El identificador mostrado por Nova usa el formato `usuario@Nova.com`.


## Nova 2.1
Nova Tab incorpora un centro de acceso para Study, Workspaces, pestañas, notas, PDF, rendimiento, seguridad, perfiles, sincronización, extensiones y media.


## Nova 2.3.0 · versión actual
Nueva barra superior para acceder a las funciones principales, vista dividida, menú contextual web reforzado, perfiles desde la ventana principal, zoom real con porcentaje y restauración, guía de navegador predeterminado y comprobación/actualización directa sobre instalaciones de Windows compatibles.



## Fedora / Linux

Nova puede distribuirse para Fedora mediante RPM y, de forma más universal, AppImage. El build de Linux se genera con `npm run dist:linux`; en una release de GitHub se publican los artefactos Linux junto a los de Windows. El RPM se instala con `sudo dnf install ./Nova-2.2.0.x86_64.rpm`.
## Super Cat

Nova incluye ahora un asistente flotante llamado **Super Cat**. Usa el dibujo de `assets/super-cat.png`, tiene animaciones de estado, respuestas habladas mediante la voz del sistema y dictado por micrófono cuando Chromium lo permite. Para las conversaciones con ChatGPT, la clave de OpenAI se guarda cifrada mediante `safeStorage` y las peticiones se envían desde el proceso principal de Electron a la Responses API.
