# Nova 4.5.1 — Build Hotfix

## Correcciones

- Corregido el icono de Windows del paquete de distribución: `assets/icon.ico` ahora contiene múltiples tamaños, incluyendo 256×256 y 512×512.
- CI fijado a Node.js 22.12.0 para cumplir el requisito de Electron 44.4.5 y evitar builds con Node 20.
- `npm install` en GitHub Actions ahora usa `--engine-strict` para fallar al principio si se intenta construir con una versión de Node incompatible.
- Añadida validación automática del `.ico` al QA para detectar iconos inválidos antes de ejecutar `electron-builder`.
- Versión actualizada a 4.5.1.

## Resultado esperado

La build de Windows debe superar la fase de `electron-builder` que anteriormente fallaba con:

`Icon must be at least 256x256 pixels, provided: 16x16`

El aviso de `punycode` no es el bloqueo del build; los avisos de dependencias obsoletas/vulnerabilidades siguen siendo deuda técnica independiente y no forman parte de este hotfix.
