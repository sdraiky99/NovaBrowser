# Nova Accounts

Servicio mínimo para las cuentas `usuario@Nova.com` de Nova 1.6.5.

## Qué almacena
- Identidad de cuenta y hash `scrypt` de la contraseña.
- Sesiones opacas con caducidad.
- Estado de sincronización del navegador.

Nova **no envía** contraseñas guardadas del navegador, cookies ni la clave de Nova IA a este servicio.

## Desarrollo

```bash
node server.js
```

Para producción, publica este servicio detrás de HTTPS y usa una ruta de datos persistente (`NOVA_ACCOUNT_DATA_DIR`). El cliente Nova solo acepta HTTPS, salvo `localhost`/`127.0.0.1` durante desarrollo.

Después apunta `account-config.json` del navegador a:

```json
{"apiBase":"https://accounts.tu-dominio.com/v1"}
```

La cuenta que verá el usuario seguirá el formato `usuario@Nova.com`.
