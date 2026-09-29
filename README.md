# Nova 2.0

Navegador basado en Chromium (vía Electron) con interfaz propia, temas, Nova IA y bloqueador de anuncios.

## Generar el .exe
Lee LEEME-SIN-ADMIN.txt (se compila en GitHub, sin admin ni terminal).

## Nova IA
Ajustes → pega tu clave API de Anthropic (console.anthropic.com).

## Fondos propios
Panel Fondos → "Añadir mis imágenes", o copia .jpg/.png/.webp en `assets/wallpapers/<seccion>/` antes de compilar.
Los fondos incluidos son ilustraciones vectoriales; añade tus fotos reales de coches, juegos o código.

## Añadir un tema
Copia un bloque `body.t-xxx{...}` en `shell/themes.css` y añade su nombre en `THEMES` de `shell/index.html`.
