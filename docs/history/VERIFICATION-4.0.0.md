# Verification — Nova 4.0.0 · Ultimate Clean

- Base: Nova 3.1.0 estable
- Arquitectura: capa aditiva `shell/nova40.js`
- Script registrado en `shell/index.html`
- Version package: 4.0.0
- QA principal: `npm run check`
- QA adicional: 49/49 pruebas runtime, 86 rutas, 0 errores de arranque
- Controles Ultimate: callbacks verificados en todas las páginas nuevas
- Limpieza: `shell/tabs.js` y artefactos temporales de QA retirados del paquete de entrega
- Node/Electron GUI real: no disponible en este entorno
- Avisos no bloqueantes: no hay lockfile; el renderer antiguo todavía usa Node integration
