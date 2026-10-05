## Nova 4.1.0 · Evolution Update

Nova 4.1.0 actualiza la base de Nova 4.0.0 sin sustituir sus módulos. Añade una nueva experiencia de inicio, privacidad reforzada, sincronización preparada para Windows + Android, Extensions Store, Game Hub, Perfil Gaming, Magic Translate y acceso centralizado a DevTools.

### Qué cambia
- **Nueva pestaña:** búsqueda central, noticias personalizadas y fondo dinámico.
- **Privacidad:** bloqueador de anuncios + protección inteligente + controles de rastreo.
- **Sync:** favoritos, pestañas, historial y configuración dentro de un modelo de sincronización cifrada.
- **Extensiones:** tienda destacada, permisos visibles y compatibilidad amplia como objetivo.
- **Gaming:** Game Hub, favoritos, noticias, tiempo jugado y récords personales.
- **Perfil Gaming:** apariencia, configuración, extensiones, privacidad y sincronización independientes.
- **Web Power:** Magic Translate y acceso directo a DevTools.

### Nota sobre plataformas
La aplicación de escritorio de este repositorio sigue siendo Electron/Chromium. La actualización prepara la experiencia y el modelo de sincronización para Windows + Android; este paquete no contiene un APK Android.

### Arranque

```bash
npm install
npm start
```

### QA

```bash
npm run check
```

El arnés heredado de Nova 4.0.0 sigue pasando 49/49 pruebas en esta copia; la comprobación de proyecto se ha actualizado para validar Nova 4.1.0 y el nuevo módulo.
