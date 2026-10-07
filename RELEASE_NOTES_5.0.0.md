# Nova 5.0.0 — Quantum Prime

## La versión Prime de Nova

Nova 5.0.0 es una actualización de identidad y madurez. La base de navegación se conserva y la interfaz se reorganiza para que el navegador resulte más tranquilo, claro y consistente.

### Diseño
- Nueva identidad visual **Nova Quantum**.
- Nuevo logotipo para aplicación, barra, nueva pestaña, splash e instalador.
- Tipografía con prioridad a Inter / Segoe UI Variable / Segoe UI.
- Transparencia y desenfoque moderados.
- Animaciones cortas, con soporte para reducción de movimiento.
- Pestañas y barra de dirección rediseñadas con controles más relajados.

### Interfaz
- Sidebar reducida a acciones útiles: Inicio, Favoritos, Workspaces, Descargas, Extensiones, Rendimiento y Ajustes.
- Menú principal nuevo y compacto.
- Se eliminan de la interfaz principal accesos que ya no forman parte de la experiencia Prime.
- Las herramientas secundarias quedan accesibles desde el menú en vez de ocupar espacio permanente.
- Se mantiene el sistema de favicons reales para sitios fijados.

### Nueva pestaña
- Nueva apariencia Quantum Prime.
- Conserva noticias con fuente, fecha y resumen.
- Mantiene el fallback **Nova Briefing** claramente identificado cuando no hay fuentes en vivo.
- Accesos y tarjetas con estilo más limpio y menos recargado.

### Rendimiento y funciones
- Se mantienen Workspaces, rendimiento, ahorro de energía y extensiones Chromium reales.
- Los paneles avanzados permanecen separados para evitar llenar la navegación principal de botones.
- La configuración Prime reduce opciones duplicadas y concentra lo esencial.

### Estabilidad
- La versión se construye sobre la base estable de Nova 4.4.1.
- Quantum Prime se añade como una capa independiente de UI para limitar el riesgo de regresiones.
- El `index.html` principal no se reescribe masivamente.
- CI comprueba recursos críticos antes de `electron-builder`.
- Node se fija en 22.12.0 para mantener compatibilidad con Electron 44.4.5.
- El icono de Windows incluye resoluciones modernas hasta 256/512 px.

### Notas conocidas
- La migración completa del renderer a `contextIsolation + preload/contextBridge` queda fuera de esta versión para no introducir una migración parcial peligrosa.
- El repositorio puede seguir sin lockfile si el entorno de desarrollo no dispone de acceso al registro npm; no se genera un lockfile artificial.
