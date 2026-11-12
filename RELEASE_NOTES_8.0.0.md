# NOVA 7 — 8.0.0 · Edición X

La actualización mayor de Nova. Motor Electron 45 / Chromium 156 (base 7.1.1), con la capa de producto renovada.

## Novedades de esta entrega

- **Hibernación de pestañas.** Las pestañas inactivas se duermen automáticamente tras el tiempo configurado (5/10/30/60 minutos o desactivado) liberando su proceso render; conservan título, favicon y posición, y despiertan al seleccionarlas. Dormir manual desde el menú de pestaña, y acciones masivas ("Dormir pestañas inactivas") desde Command Center.
- **Notas rápidas.** Panel de notas en la barra lateral: crear, editar y eliminar, con límite de 50 notas de 2.000 caracteres. Todo local, sin cuentas ni nube, incluido en el estado guardado de Nova.
- **Temas nuevos: Aurora, Carbon y Solar.** Tres paletas nuevas para claro y oscuro, aplicadas al navegador y a la nueva pestaña, disponibles en Ajustes → Apariencia junto a los existentes.
- **Nova Update Center completo.** El panel de actualizaciones ahora muestra estado en vivo (disponible, descargando con progreso, descargada), y ofrece botones Descargar e Instalar y reiniciar usando los canales ya existentes del actualizador.
- **Copiar enlace limpio.** El menú contextual copia enlaces y direcciones de página sin parámetros de rastreo habituales (utm_*, fbclid, gclid, msclkid…).
- **Reader Mode renovado.** Se adapta al tema oscuro del sistema y añade controles de tamaño de letra (A− / A+) en la barra del modo lectura.
- **Command Center ampliado.** Nuevos nodos: Notas, Dormir pestañas inactivas y Cerrar pestañas duplicadas.
- **Historial configurable.** Límite de entradas ampliable a 1.000 o 3.000 desde Ajustes → Privacidad y seguridad.

## Incluye desde 7.1.1

- Noticias de la nueva pestaña corregidas (parser CDATA, feeds de Xataka/Genbeta, Steam filtrado por idioma, timeout ampliado).

## Distribución

- Setup: `NOVA-7-Setup-8.0.0.exe` (instalación por usuario, sin elevación).
- Portable: `NOVA-7-Portable-8.0.0.exe` (datos independientes junto al ejecutable si la carpeta es escribible).
- Actualización: los usuarios de 7.x reciben 8.0.0 al publicar el release; perfil, marcadores, notas y preferencias se conservan. El panel Novedades de la primera apertura resume la edición X.

## Seguridad sin cambios

- Renderer con sandbox activo, `contextIsolation: true`, `nodeIntegration: false`; preloads con listas blancas de canales IPC; backups que excluyen credenciales; permisos por sitio sin cambios.

## Validación

Comprobaciones estáticas y pruebas automatizadas descritas en `VALIDATION_8.0.0.txt`. La compilación de los ejecutables Windows debe ejecutarse en GitHub Actions o en Windows con Node.js 22.12.0 o superior.
