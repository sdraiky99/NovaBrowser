# Nova 6.3.0 — Velocidades Locas · Deluxe Edition

## Cambios destacados

- Nueva identidad de marca: N geométrica con volumen discreto, degradado azul/cian/violeta y exterior transparente. Se incluye como fuente SVG, PNG de 512 × 512 y ICO de varias resoluciones.
- La marca se usa en la barra superior, el favicon, la página de nueva pestaña, el splash y el icono Windows definido por electron-builder.
- La nueva pestaña anuncia la edición Deluxe y las novedades ya corresponden a la versión 6.3.
- La pantalla de novedades destaca la marca, el inicio más ágil, la restauración de sesiones y los dos tipos de distribución.
- Se corrige el README de la raíz, que seguía describiendo 6.2.2, y se mantiene el historial antiguo en `docs/history/`.
- Se mantiene la distribución doble Setup NSIS por usuario y Portable, con directorios de salida independientes.

## Rendimiento y continuidad

- La restauración puede conservar hasta 50 pestañas web y su grupo asociado cuando los datos disponibles son compatibles.
- La espera mínima de splash se reduce a 500 ms, sin declarar que eso acelera por sí solo la carga de páginas.
- Se incluye un microbenchmark reproducible de resolución de URL/búsqueda. No mide la apertura completa de Nova ni el rendimiento de la red.

## Limitaciones conocidas

- Los ejecutables deben compilarse y probarse en Windows mediante GitHub Actions o en un equipo Windows; no se afirma que los `.exe` hayan sido generados en este entorno.
- No existe compatibilidad universal garantizada con todas las extensiones de Chrome.
- La interfaz local principal conserva `nodeIntegration: true` y `contextIsolation: false` por dependencias heredadas; hace falta una refactorización específica y pruebas de regresión para cambiar esa arquitectura de manera segura.
- La instalación no incluye `package-lock.json`; para reproducibilidad estricta debe generarse y revisarse en un entorno con acceso a npm.
