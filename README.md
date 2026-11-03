# NOVA 7 — 7.0.0

NOVA 7 es un navegador de escritorio basado en Electron/Chromium, construido sobre el proyecto Nova FLOW Reborn. Esta etapa prioriza la navegación diaria, privacidad visible, personalización, productividad y herramientas integradas.

## Funciones de esta entrega

- Barra de marcadores persistente y pestañas horizontales o verticales.
- Pantalla dividida con dos pestañas y Reader Mode.
- Nova Shield visible en la barra y control del bloqueador Ghostery.
- Noticias mediante RSS y API de Steam News, con instalaciones nuevas mostrando noticias por defecto.
- Nova Media: selección manual de archivos locales, reproducción Chromium y apertura con el reproductor del sistema.
- Nova Translate: traducción cloud mediante MyMemory bajo acción explícita del usuario.
- Nova Focus: temporizador local con sesiones completadas.
- Nova Assist local con Ollama, sin proveedor cloud de IA.
- Importación de marcadores e historial desde perfiles compatibles.
- Copias automáticas locales del estado y exportación/importación manual JSON.
- Setup por usuario y Portable en perfiles de datos separados.

## Distribución Windows

- `NOVA-7-Setup-7.0.0.exe`: instalador asistido por usuario. `perMachine: false`, `allowElevation: false`.
- `NOVA-7-Portable-7.0.0.exe`: edición portable, con datos independientes.

Requisitos de compilación: Windows, Node.js `>=22.12.0` y npm.

```powershell
npm install --no-audit --no-fund --engine-strict
npm run check
npm run dist:setup
npm run dist:portable
```

## Privacidad y limitaciones

- Nova Assist usa Ollama exclusivamente en `127.0.0.1:11434`.
- Nova Translate transmite al proveedor MyMemory el texto que el usuario envía explícitamente. El límite anónimo publicado por el proveedor es de 5.000 caracteres al día; la API admite segmentos de hasta 500 bytes. Véase la documentación oficial enlazada en las notas de versión.
- La biblioteca multimedia no escanea el disco. Solo registra archivos elegidos manualmente.
- Los backups excluyen recursivamente campos habituales de contraseñas, cookies, credenciales, secretos y tokens; tampoco incluyen archivos multimedia originales.
- La compatibilidad de extensiones Chromium y códecs varía. La Chrome Web Store no garantiza instalación universal dentro de Electron.
- Esta entrega no incluye sincronización, perfiles multiusuario completamente aislados, Bitwarden integrado de forma nativa ni Quick Notes.

## Archivos del proyecto

El paquete contiene el código fuente, recursos, workflows de GitHub Actions, scripts de validación y documentación. No incluye `node_modules`, credenciales ni datos personales.

Consulta `RELEASE_NOTES_7.0.0.md` y `VALIDATION_7.0.0.txt` para el alcance y el estado de verificación.
