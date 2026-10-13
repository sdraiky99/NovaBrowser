# Nova 5.5.1 — Next-Gen

## Identidad
- Nuevo icono oficial: cubo multicolor con una N tridimensional.
- Recurso actualizado para la aplicación, pestañas internas y recursos del instalador.

## Apariencia
- Menos sombras y superficies decorativas, con radios más discretos y controles más consistentes.
- Fondos de barra personalizados con imágenes locales PNG, JPG/JPEG o WebP de hasta 12 MB.
- Vista previa y restablecimiento del fondo desde Ajustes.
- Validación del formato del archivo y almacenamiento local en el perfil de Nova; esta función no sube la imagen a un servidor.
- Animaciones más contenidas y respeto por movimiento reducido.

## Verificación y límites
- `npm run check` valida sintaxis, metadatos, recursos, el puente de nueva pestaña, la lógica de navegación y los controles del selector de fondos.
- Estas pruebas son estáticas. El arranque real de Electron, el menú, la persistencia visual del fondo y el instalador deben probarse en Windows antes de publicar.
- Se mantienen las versiones actuales de Electron y las dependencias, porque no se pudo confirmar el registro de paquetes en este entorno y no conviene cambiar el runtime a ciegas.
