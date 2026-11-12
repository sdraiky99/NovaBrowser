# NOVA 7 — 7.0.0

Primera versión principal de la nueva etapa NOVA 7, construida sobre el código fuente 6.4.1 FLOW Reborn.

## Cambios incluidos en esta entrega

- Marca y distribución NOVA 7, versión SemVer 7.0.0, Setup por usuario y Portable independiente.
- Acento azul predeterminado, pestañas horizontales/verticales y barra de marcadores persistente.
- Panel Nova Shield visible en la barra, con control del bloqueador y acceso a permisos por sitio.
- Noticias habilitadas por defecto para instalaciones nuevas; RSS en medios tecnológicos y API pública de Steam News para noticias de juegos.
- Nova Media con selección manual de archivos y reproducción mediante los elementos multimedia de Chromium; opción de abrir con el reproductor del sistema.
- Nova Translate cloud bajo acción explícita, usando MyMemory; aviso de privacidad, límites de texto y selección de idiomas.
- Reader Mode mediante extracción de contenido principal en la página actual.
- Vista dividida de dos pestañas, temporizador Nova Focus y acceso directo a DevTools.
- Exportación/importación manual de estado y guardado automático de recuperación local; se eliminan recursivamente campos habituales de credenciales, cookies, secretos y tokens.
- What's New de la versión 7.0.0 en la primera apertura, no en cada inicio.
- Acerca de NOVA 7 obtiene versiones de Electron/Chromium a través del preload, sin depender de `process` en el renderer.

## Limitaciones conocidas

- Esta entrega no incorpora perfiles aislados múltiples, sincronización, gestor nativo de contraseñas ni integración Bitwarden automática; las contraseñas siguen fuera del backup y deben gestionarse con Bitwarden por su vía oficial.
- Chrome Web Store no instala cualquier extensión directamente en Electron. La carga de extensiones desempaquetadas sigue dependiendo de compatibilidad.
- La reproducción ampliada depende de los códecs incluidos o disponibles en Chromium/Windows. Para archivos incompatibles existe apertura externa.
- MyMemory es un proveedor cloud. El texto se transmite al servicio después de pulsar Traducir; el acceso anónimo tiene límite diario y la API limita el tamaño de cada segmento. No incluir texto privado.
- Las noticias Steam API pueden estar en inglés aunque la interfaz de Nova esté en español. No se inventan traducciones.
- No se incluyen fotos editoriales descargadas ni recursos con licencia no verificada; se conservan los assets del proyecto.
- No se afirma compatibilidad universal con extensiones ni todos los formatos multimedia.

## Distribución

- Setup: `NOVA-7-Setup-7.0.0.exe` (instalación por usuario, sin elevación).
- Portable: `NOVA-7-Portable-7.0.0.exe` (datos independientes junto al ejecutable si la carpeta es escribible).

## Validación

Las comprobaciones estáticas y pruebas automatizadas se describen en `VALIDATION_7.0.0.txt`. La compilación de los ejecutables Windows debe ejecutarse en GitHub Actions o en Windows con Node.js 22.12.0 o superior.
