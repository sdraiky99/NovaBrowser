# Nova 5.5.3.1 — Installer Hotfix

Este hotfix corrige el bloqueo de actualización cuando Nova sigue abierto. El instalador cierra el proceso `Nova.exe` antes de sustituir archivos, espera brevemente y continúa. No elimina el perfil ni los datos del usuario.

## Uso
1. Guarda tu trabajo y ejecuta el instalador actualizado.
2. El instalador cerrará Nova si sigue abierto.
3. Si sigue apareciendo el mensaje, abre el Administrador de tareas (`Ctrl`+`Shift`+`Esc`), finaliza `Nova.exe` y vuelve a ejecutar el instalador.

## Verificación
Se ha validado la integridad del ZIP, la sintaxis JSON de `package.json`, y la presencia del hook `customInit` en `build/installer.nsh`. Este entorno no puede ejecutar el instalador NSIS en Windows, así que el flujo debe confirmarse en el equipo destino.
