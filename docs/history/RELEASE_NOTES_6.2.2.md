# Nova 6.2.2 — Next Evolution

## Novedades

- Distribución dual de Windows: Setup NSIS asistido por usuario y ejecutable Portable.
- Configuración de compilación declarada en `package.json`; los workflows ya no modifican la configuración en tiempo de ejecución.
- Separación de perfiles. El primer lanzamiento Portable no importa silenciosamente datos del perfil instalado.
- Grupos de pestañas con nombre y persistencia al restaurar la sesión.
- Gestor de descargas con progreso y acciones sobre descargas activas.
- Controles de permisos por sitio para cámara, micrófono, ubicación y notificaciones.
- Interfaz para importar marcadores e historial de Chrome, Edge y Firefox.
- Noticias RSS con fuentes adicionales y opción para ocultar la sección en nueva pestaña.
- Comprobaciones de distribución, estructura, sintaxis y lógica renovadas para 6.2.2.

## Límites conocidos

- Electron no soporta todas las APIs de extensiones de Chrome; se cargan extensiones desempaquetadas y compatibles.
- La importación cubre marcadores e historial; no importa contraseñas cifradas.
- La instalación y arranque real de los ejecutables deben verificarse en Windows/GitHub Actions. La validación estática por sí sola no certifica el instalador.
