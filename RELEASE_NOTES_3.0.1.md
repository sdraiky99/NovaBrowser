# Nova 3.0.1 — QA Hotfix

Fecha: 2026-10-02

## Corregido
- Arranque sin `ReferenceError` en los módulos históricos.
- Rutas internas y aliases robustos.
- Historial, Descargas, Notas y rutas `nova://` verificadas.
- Reader+ y Web Capture usando la pestaña web activa.
- Colecciones y Reading List con guardado de página actual.
- Persistencia de sesión y restauración de Safari Mode.
- Command Center, Nova IA y Super Cat con acciones conectadas.
- Writer con payload DOCX válido.
- Performance y Downloads con IPC verificado.

## QA
24/24 pruebas runtime pasan. El chequeo de proyecto verifica 38 canales `invoke`, 5 canales `send`, 27 rutas base más aliases y 34 extensiones sin duplicados.

## Nota
La ejecución final no incluye Electron empaquetado porque este entorno no dispone de sus dependencias npm. El ZIP incluye las pruebas para repetir `npm run check` antes de generar el instalador.
