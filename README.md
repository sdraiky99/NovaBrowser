# Nova Browser 4.0.0

Nova Browser es un navegador de escritorio basado en Electron/Chromium con interfaz personalizada, temas, pestañas, bloqueador, cuentas, migración, Super Cat y herramientas de navegación.

## Ejecutar

```bash
npm install
npm start
```

## Crear instaladores para Windows

```bash
npm run dist:win
```

Los archivos se generan en `dist/`.

## GitHub Actions

- `Build Nova` compila Windows y deja los `.exe` como artifact.
- `Release Nova` compila y publica automáticamente los `.exe` cuando se crea un tag `v*.*.*`.

## Cuenta Nova

Nova 4.0 incluye cuentas locales funcionales: crear usuario, iniciar sesión, cerrar sesión y guardar datos compatibles asociados a cada cuenta. Las contraseñas se almacenan con `scrypt` y la sesión usa el almacén seguro del sistema cuando está disponible.
