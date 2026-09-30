# Nova 1.6.5

Actualización grande y aditiva. Se conservan las funciones de Nova 1.6.4 y se añaden perfiles, herramientas de desarrollador y Cuenta Nova.

## Perfiles
- Cada perfil tiene una sesión web persistente independiente.
- Creación, cambio, edición y eliminación desde Ajustes o el selector superior.
- Cookies y almacenamiento web quedan separados por perfil mediante particiones persistentes de Electron.

## F12 / DevTools
- F12 abre/cierra DevTools para la pestaña activa.
- También existe un botón en Ajustes y una acción en el Command Center.

## Cuenta Nova
- Formato visible: `usuario@Nova.com`.
- Se gestiona únicamente desde Ajustes de Nova.
- La sesión local se almacena con `safeStorage`.
- La misma cuenta puede iniciarse en otro PC para recuperar los datos sincronizados.
- Se sincronizan marcadores, historial y preferencias compatibles.
- No se sincronizan contraseñas guardadas del navegador, cookies ni la clave de Nova IA.

## Servidor
- Implementación sin dependencias externas en `account-server/`.
- Contraseñas con `scrypt`.
- Tokens de sesión opacos y caducables.
- Fusión de datos de varios dispositivos.
- Para producción debe publicarse detrás de HTTPS con almacenamiento persistente.

## Compatibilidad
GitHub Actions sigue generando `Nova-Setup-1.6.5.exe` y `Nova-Portable-1.6.5.exe`.
