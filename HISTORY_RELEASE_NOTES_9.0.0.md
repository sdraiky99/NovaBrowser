# NOVA 9.0.0 — Complete Experience

## Una nueva generación de experiencias

NOVA 9 conserva Electron/Chromium y la identidad de marca existente, pero incorpora una capa de presentación capaz de recrear estilos completos de distintas épocas.

### Experiencias visuales
- NOVA Modern (predeterminada).
- Windows XP.
- Windows 7 Aero.
- Firefox clásico.
- Firefox 2017.
- Chrome 2017.
- Microsoft Edge Legacy.

El selector está en Ajustes → Apariencia → Experiencia completa. El cambio se aplica a la interfaz principal y a las nuevas pestañas abiertas.

### NOVA Time Machine
- Puntos manuales con nombre.
- Instantánea automática diaria al arrancar cuando hay datos útiles.
- Hasta 12 instantáneas locales.
- Restauración confirmada de ajustes, favoritos, historial, workspaces y sesión.
- Sin contraseñas, cookies, credenciales ni tokens.

### NOVA Companion
- Acceso desde la barra y el panel lateral.
- Atajos a Media, Focus, descargas y Time Machine.
- Control básico de audio/vídeo del sitio activo.
- Picture-in-Picture cuando lo soportan el vídeo y el sitio.
- Apertura de sitios HTTP/HTTPS en ventanas independientes con Node Integration desactivado y aislamiento habilitado.

### NOVA Gaming
- Perfil activable desde el panel lateral.
- Menos animaciones en la interfaz NOVA.
- Política Chromium `animateOnce` para animaciones de imagen en webviews.
- Conserva el throttling de pestañas en segundo plano.
- No detecta juegos externos, no manipula procesos de Windows y no garantiza más FPS.

### Acceso predeterminado
La nueva pestaña ofrece un botón para abrir el flujo de Aplicaciones predeterminadas de Windows. El sistema operativo sigue exigiendo confirmación explícita. No está disponible en Portable.

## Distribución
Se mantienen Setup per-user sin elevación y Portable con datos separados. Los workflows de GitHub Actions compilan ambos artefactos en Windows.
