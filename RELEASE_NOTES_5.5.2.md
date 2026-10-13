# Nova 5.5.2 — Stability Hotfix

## Corregido
- Los paneles internos ya no quedan por detrás de los webviews. Favoritos, Historial, Descargas, Workspaces, Extensiones, Rendimiento y Ajustes deben mantenerse visibles después de hacer clic.
- Cambiar de panel o volver a una pestaña web elimina la capa interna anterior de forma explícita.
- Los estilos de capa del contenido web y los paneles internos ahora están definidos de forma explícita para evitar parpadeos y clics bloqueados.

## Icono
- `assets/brand/nova-icon.png` ahora usa transparencia alfa real fuera de la silueta del cubo 3D con la N.
- `assets/brand/nova.ico` se ha regenerado a partir del PNG transparente para que la ventana, los accesos directos y el instalador no dibujen un fondo opaco.

## Comprobaciones
- Se amplían las pruebas estáticas para la regresión de las capas de paneles y transparencia del PNG.
- La compilación e interacción real en Windows deben validarse en un equipo con dependencias instaladas; esta entrega no afirma que se haya ejecutado el instalador de Windows.
