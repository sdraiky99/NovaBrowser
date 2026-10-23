# Nova 6.2.0 — Precision Update

## Calidad y productividad
- La sesión anterior se puede restaurar al iniciar: guarda localmente hasta 10 direcciones web y recuerda la pestaña activa. La opción se puede desactivar en Ajustes.
- El gestor de extensiones Chromium permite ver permisos declarados, activar, desactivar y quitar extensiones compatibles cargadas desde una carpeta desempaquetada. El estado de activación se conserva al reiniciar.
- Se evita intentar cargar una extensión que ya se encuentra cargada; los fallos de compatibilidad se devuelven con mensajes más claros.
- Los accesos rápidos de la nueva pestaña rellenan espacios libres con páginas iniciales útiles y muestran correctamente un icono de reserva si la web no ofrece favicon.
- Se mantiene la selección de tema adaptativa (Windows / manual), barra lateral plegable, iconos gráficos locales y animaciones respetuosas con la reducción de movimiento.
- Se amplía la suite de validación para cubrir el ciclo de vida de extensiones, la recuperación de sesión, la nueva pestaña, la búsqueda y los recursos del paquete.

## Límites conocidos
- Las extensiones se cargan desde carpetas desempaquetadas con `manifest.json`; el soporte de APIs depende de Electron/Chromium. La instalación directa desde Chrome Web Store y la carga universal de paquetes CRX no se prometen.
- El feed de noticias usa fuentes RSS remotas y una caché local; las noticias en directo requieren conexión.
- El ZIP pasa comprobaciones estáticas y simuladas en este entorno. La prueba visual de navegación, instalación interactiva de extensiones y compilación del instalador debe realizarse en Windows con dependencias instaladas.
