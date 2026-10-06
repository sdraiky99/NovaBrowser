# Nova 4.3.2 · Hotfix Glass Clean

Nova 4.3.2 es un hotfix de recuperación y pulido visual construido sobre la base estable de Nova 4.1.0. El `shell/index.html` principal se conserva y las mejoras nuevas se añaden como capas aisladas para reducir el riesgo de regresiones.

## Experiencia

- **Glass Clean:** transparencia moderada, blur suave y controles redondeados.
- **Tipografía:** Inter con fallbacks nativos de Windows.
- **Animaciones:** breves, discretas y respetuosas con `prefers-reduced-motion`.
- **Sitios fijados:** favicon real, título y apertura directa desde la barra lateral.
- **Ahorro de energía:** usa el modo de rendimiento de Nova y reduce trabajo visual en pestañas en segundo plano.
- **Ajustes:** la capa nueva se añade sin sustituir la estructura existente.

## Arranque

```bash
npm install
npm start
```

## Comprobaciones

```bash
npm run check
```

Para crear los instaladores de Windows en GitHub Actions:

```bash
npm run dist:win
```

El instalador conserva `userData` y no borra los datos del perfil al desinstalar.

## Nota de estabilidad

Esta versión no reemplaza el renderer principal ni hace una migración incompleta a `preload.js`. La migración de seguridad completa queda reservada para una actualización separada con pruebas específicas.
