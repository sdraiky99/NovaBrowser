# Nova 6.2.1 — Hotfix de CI portable

## Causa
El workflow contenía un script que accedía a `p.build.nsis.include`. En la distribución portable de Nova 6.2.1, `p.build.nsis` es `undefined`; acceder a `.include` lanza un `TypeError`. El mismo script volvía a establecer el target `nsis` junto con `portable`, contradiciendo la decisión de publicar solo portable.

## Solución
No mutar `package.json` durante GitHub Actions. La configuración ya contiene `build.win.target: ["portable"]`, el nombre `Nova-Portable-${version}.exe` y el comando `npm run dist:portable`. El workflow ejecuta `npm run check:portable-config` y después `npm run check` antes de compilar.

## Uso
```bash
npm run check:portable-config
npm run check
npm run dist:portable
```

Este parche no genera ni incluye el ejecutable de Windows; el ejecutable se produce en el runner Windows de GitHub Actions.
