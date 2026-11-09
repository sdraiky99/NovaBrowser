# NOVA 9 — Complete Experience 9.0.0

NOVA 9 es la siguiente gran evolución del navegador de escritorio Electron/Chromium. Conserva la identidad visual y el emblema original de NOVA y amplía el proyecto 7.0.1 con experiencias visuales históricas completas, Time Machine, Companion y un perfil Gaming.

## Novedades principales

- **Experiencias completas:** NOVA Modern, Windows XP, Windows 7 Aero, Firefox clásico, Firefox 2017, Chrome 2017 y Edge Legacy. Cada modo cambia la apariencia de la barra de título, pestañas, navegación, panel lateral y nueva pestaña; todos utilizan el motor Chromium actual.
- **NOVA Time Machine:** puntos manuales y una instantánea automática diaria al iniciar cuando ya hay datos útiles. Conserva hasta 12 puntos con ajustes, favoritos, historial, workspaces y sesión. No almacena contraseñas, cookies, tokens ni credenciales.
- **NOVA Companion:** panel integrado para navegación rápida, reproducción/pausa de medios de la página, Picture-in-Picture cuando el sitio lo permite y apertura de aplicaciones web compatibles en ventanas independientes.
- **NOVA Gaming:** perfil que reduce animaciones de la interfaz y configura la animación de imágenes web en modo «una vez». No detecta juegos externos ni promete aumentos de FPS.
- Acceso desde la nueva pestaña para elegir NOVA como navegador predeterminado. Windows 11 requiere confirmación del usuario en Configuración; la edición Portable no puede registrarse como predeterminada.

## Funciones heredadas conservadas

Pestañas horizontales/verticales, grupos, sesiones, pantalla dividida, Reader Mode, Nova Shield, marcadores, historial, descargas, Workspaces, noticias RSS y Steam, Nova Media, Nova Translate bajo petición, Nova Focus, Nova Assist local con Ollama, importación de marcadores/historial, copias de seguridad y actualizaciones.

## Distribución Windows

- `NOVA-9-Setup-9.0.0.exe`: instalador asistido por usuario, sin elevación ni instalación por máquina.
- `NOVA-9-Portable-9.0.0.exe`: edición portable con carpeta `User Data` independiente cuando el directorio permite escritura.

Requiere Windows para generar los ejecutables, Node.js `>=22.12.0` y npm.

```powershell
npm install --no-audit --no-fund --engine-strict
npm run check
npm run dist:setup
npm run dist:portable
```

## Límites conocidos

- Los modos retro son recreaciones visuales; no incluyen motores históricos ni garantizan comportamiento idéntico a las versiones originales.
- Picture-in-Picture depende del soporte del sitio y del vídeo.
- La apertura de webs como aplicaciones se realiza en ventanas separadas y no convierte todos los sitios en PWAs instaladas.
- La importación actual cubre marcadores e historial de perfiles compatibles; no importa contraseñas.
- No se incluye aún sincronización de NOVA, bóveda de contraseñas propia ni acceso a Chrome Sync.
- La compatibilidad de extensiones y códecs varía con Electron.
- Esta validación estática no sustituye pruebas interactivas e instalación en Windows.

Consulta `RELEASE_NOTES_9.0.0.md` y `VALIDATION_9.0.0.txt`.
