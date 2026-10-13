# Informe de QA — Nova 5.5.3 Reliability & UI Fix

**Fecha:** 13 de octubre de 2026  
**Versión auditada:** 5.5.3  
**Alcance:** estructura y nombres, sintaxis, metadatos y recursos, navegación, puente de la nueva pestaña, ajustes visuales, controles, rutas de extensiones.

## Resultados automatizados

La orden `npm run check` se ejecutó dos veces completas sobre el código final y ambas terminaron con resultado satisfactorio.

En cada pasada:

- Revisión de estructura y archivos requeridos: correcta; 58 archivos antes de añadir este informe.
- Versiones del paquete, instalador, splash, documentación y notas de publicación: coherentes en 5.5.3.
- Sintaxis: 17 archivos JavaScript comprobados.
- QA de regresión: correcto.
- Casos de navegación y búsqueda: 14 entradas comprobadas.
- Puente seguro de la nueva pestaña: comprobado con un entorno Electron simulado.
- Formulario real de búsqueda de la página de inicio: su manejador de envío se ejecutó en un DOM simulado y transmitió la consulta al puente.
- Ajustes de color y tema oscuro: comprobaciones de código correctas.
- Botón de nueva pestaña, dimensiones y enlace de controles de ventana: comprobaciones estáticas correctas.
- Gestor de extensiones: comprobaciones estáticas, validación del manifiesto y aviso de la limitación de Chrome Web Store.
- Recursos de instalación: comprobación de inventario correcta.

Además, se validaron por separado los JSON del proyecto, la transparencia alfa del PNG y del ICO, los identificadores duplicados en el HTML y los recursos locales. No se detectaron IDs estáticos duplicados. Una referencia dinámica de imagen en la página de inicio corresponde a una plantilla JavaScript y no a un recurso estático ausente.

## Limitaciones que siguen pendientes

- La instalación de dependencias (`npm install --no-audit --no-fund --engine-strict`) agotó el tiempo de espera; no se creó `node_modules` ni un `package-lock.json` nuevo.
- No se pudo iniciar Electron dentro de este entorno, ni generar ni abrir el instalador de Windows.
- El intento de abrir la página con Chromium headless no produjo DOM verificable y mostró errores de inicialización del entorno. Por ello no se declara superada una prueba visual interactiva.
- La integración de extensiones solo se ha comprobado estáticamente y con pruebas de código. Cada extensión real puede depender de API y permisos que Electron no soporte.
- No se verificó una instalación real desde Chrome Web Store. Nova deja claro que la tienda no instala directamente en este navegador; el método disponible es cargar una carpeta desempaquetada compatible con `manifest.json`.

## Dictamen

**Comprobaciones automatizadas: aprobadas dos veces.**  
**Prueba real en Windows/Electron: pendiente de ejecución en un equipo con las dependencias instaladas.**

Este informe no considera una prueba estática como sustituto de verificar visualmente Nova ejecutándose.
