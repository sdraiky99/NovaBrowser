# Nova 2.2.0 — Auditoría técnica

Fecha de revisión: 2026-09-30

## Estado

La revisión estática cubre estructura, JavaScript, IPC, sesiones, descargas, navegación, permisos, bloqueador, migración, cuentas, sincronización, rendimiento, actualizaciones, instalador y CI.

## Hallazgos corregidos

- La documentación principal tenía referencias antiguas a Nova 1.6.4; se actualizó el encabezado y la guía Linux/Fedora.
- El workflow de build podía intentar crear/publicar releases en cada `push`; se separó CI de publicación y la publicación queda limitada a tags `v*.*.*`.
- Se añadió build Linux para RPM y AppImage.
- Se añadió flujo de release con artefactos Windows + Fedora/Linux.
- Se añadió un instalador sencillo para Fedora que usa el RPM publicado.
- Se añadieron archivos de desinstalación/instrucciones y metadata `.desktop`.

## Riesgos que siguen requiriendo trabajo específico

### Alto — proceso de UI con Node integrado
`BrowserWindow` usa `nodeIntegration: true` y `contextIsolation: false`. La interfaz local ejecuta código con privilegios Node. Esto no es equivalente al endurecimiento de los `webview`; una futura refactorización debería mover el acceso IPC a un `preload` seguro con `contextIsolation` activo y exponer una API mínima mediante `contextBridge`.

### Alto — dependencias sin lockfile
El repositorio no contiene `package-lock.json`/`npm-shrinkwrap.json`/`yarn.lock`/`pnpm-lock.yaml`. Eso hace que builds repetidos puedan resolver versiones transitivas distintas. No se ha fabricado un lockfile incompleto; hay que generar uno con acceso a npm y revisar sus integridades antes de adoptarlo.

### Medio — backend de cuentas de referencia
`account-server/server.js` usa `http.createServer` y escucha en localhost por defecto. Eso es adecuado como servicio local de referencia, pero no debe exponerse directamente a Internet. La API pública de cuentas debe ejecutarse detrás de HTTPS, proxy/reverse proxy y almacenamiento persistente apropiado.

### Medio — sincronización
La fusión actual evita machacar datos de otros dispositivos, pero no ofrece resolución de conflictos semántica ni cifrado extremo a extremo de los datos sincronizados.

### Medio — IA
La integración puede enviar contenido de páginas a los proveedores configurados por el usuario. Debe mantenerse explícito el consentimiento antes de enviar contenido y evitar incluir secretos/cookies/credenciales en el contexto.

### Bajo — test de instalador
El entorno de revisión es Debian x86_64 y no dispone de toolchain Windows ni de `rpmbuild`. Se valida configuración, sintaxis y workflows, pero no se afirma que un `.exe` o `.rpm` haya sido ejecutado en su plataforma final desde este entorno.

## Resultado estático

- JavaScript de proyecto: sintaxis válida.
- Extensiones catalogadas: 34, sin IDs duplicados.
- Ghostery: usa `fromPrebuiltAdsAndTracking` con `cross-fetch`.
- `allowpopups`: ausente.
- Un único registro del atajo Ctrl+Shift+B.
- Handlers IPC revisados y únicos.
- Assets de bienvenida presentes.
- Configuración Windows NSIS existente.
- Configuración Linux RPM/AppImage añadida.


## Revisión Nova 2.5.2
- El hallazgo alto de renderer con Node Integration queda corregido: `nodeIntegration:false`, `contextIsolation:true` y `preload.js` con `contextBridge`.
- El bridge usa listas blancas para `invoke`, `send` y eventos.
- Operaciones locales heredadas del renderer se limitan mediante IPC validado a rutas de datos conocidas.
- La IA continúa ejecutándose desde el proceso principal; el renderer ya no necesita una clave API directamente para llamar al proveedor.
- Sigue pendiente adoptar un lockfile generado y verificado desde npm en el entorno de release.

## Addendum 2.5.2 — shell clean-up

- `shell/index.html` ya no contiene el runtime JavaScript inline; el código de shell vive en `shell/shell.js`.
- La API renderer/proceso principal sigue limitada por `preload.js` y `contextBridge`.
- Se añadieron a la whitelist los canales de apertura de rutas controladas.
- No se ha activado sandbox de la ventana principal porque el preload actual usa módulos Node para compatibilidad; es una fase posterior de endurecimiento.
