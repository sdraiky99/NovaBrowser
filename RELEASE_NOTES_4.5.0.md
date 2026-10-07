# Nova 4.5.0 — Calm UI

Nova 4.5.0 es un rediseño de la interfaz centrado en claridad, calma y consistencia.

## Cambios principales

- Nuevo logotipo oficial de Nova.
- Nueva barra superior con jerarquía visual simplificada.
- Menú principal compacto para acciones secundarias.
- Sidebar reducida a acciones de uso real: Inicio, Favoritos, Workspaces, Rendimiento y Ajustes.
- Captura de pantalla retirada de la barra principal y movida al menú.
- Accesos visibles heredados de Mods/Fondos retirados de la barra lateral, sin eliminar sus funciones internas.
- Eliminadas de la experiencia visible las opciones de temas heredados.
- Apariencia Nova Calm: transparencias ligeras, blur moderado, bordes suaves y animaciones cortas.
- Iconografía SVG unificada y favicons reales conservados para pestañas y elementos fijados.
- Nueva pestaña mantiene las noticias RSS de 4.4.1 y el fallback Nova Briefing.
- La estructura estable de `index.html` se conserva; el rediseño se aplica como una capa separada.

## Estabilidad

- No se cambia la arquitectura del renderer en esta versión.
- No se introduce una migración de seguridad parcial.
- El empaquetado sigue incluyendo `shell/**` y los recursos del instalador.

## QA

La validación de 4.5.0 comprueba sintaxis JavaScript, elementos obligatorios del shell, ausencia de controles obsoletos visibles, enlaces del menú, IPC y archivos de empaquetado.
