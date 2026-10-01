# Nova 3.0.0 — Calm Power

Nova 3.0.0 consolida las mejoras de las ramas 2.5.x en una experiencia única: superficie Air/Safari, organización Zen, potencia tipo Vivaldi/Arc y herramientas de creación integradas.

## Qué cambia
- Safari Air: superficie compacta y cristalina.
- Islands + Spaces: proyectos dentro de contextos.
- Glance: previsualización de enlaces.
- Command Center: Ctrl/Cmd + K para acciones y pestañas.
- Focus + Reader+: trabajo concentrado y lectura limpia.
- Nova Writer + Docs: documentos locales y exportación DOCX/HTML.
- Study 3 + Collections + Reading List + Nova Send.
- Privacy Center, Performance Center y Download Hub.
- Nova Apps: abrir webs en ventanas propias.
- Web Panels, Media Hub, Tab Manager, Sessions y QR.
- Backup & Restore y página de Atajos.
- Novedades, bienvenida y centro rápido actualizados.

## Correcciones incluidas
- Se mantienen los módulos históricos de 2.5.x sin eliminarlos en esta versión.
- Se fijan rutas internas para que no hagan fallback silencioso a Acerca de.
- Se conectan las acciones de Command Center a funciones reales.
- Se corrige la apertura de carpeta de Descargas y la telemetría del Centro de rendimiento.
- Se incluyen nuevas acciones IPC para guardar archivos de texto, mostrar archivos en carpeta y abrir Web Apps de forma aislada.

## Nota de compatibilidad
Esta release conserva el modelo del renderer de la recuperación 2.5.4 para priorizar estabilidad. El endurecimiento de la ventana principal con preload/contextBridge queda como trabajo separado y no se mezcla con esta consolidación.
