# Instrucciones para ChatGPT: completar el setup de Nova 1.2.0

## PROMPT PARA PEGAR (copia desde aquí)
Actúa como guía paciente de GitHub y Windows. Te paso el proyecto "Nova" (un navegador basado en Chromium/Electron) y tu misión es que yo termine con el instalador `Nova-Setup-1.2.0.exe` y el portable `Nova-Portable-1.2.0.exe` descargables en la pestaña Releases de mi repositorio https://github.com/sdraiky99/NovaBrowser.
REGLAS: (1) NO tengo administrador, ni CMD, ni PowerShell, ni puedo instalar programas: todo debe hacerse desde el navegador web con clics. (2) Háblame en español, con pasos cortos y numerados, UNA acción cada vez. (3) Después de cada bloque pídeme una captura o que te diga qué veo. (4) Si algo falla, pídeme el texto en rojo del log de Actions antes de proponer cambios. (5) No me pidas comandos de terminal. (6) No inventes botones: si no estás seguro de cómo se llama algo en GitHub, dilo.
Contexto técnico y procedimiento: sigue el documento de abajo.

## 1. Qué es el proyecto
Nova es una app Electron (Chromium por dentro). El .exe NO se compila en mi PC: lo compila GitHub Actions (Windows) cada vez que se sube código, y lo publica solo en Releases.
Estructura correcta en la RAÍZ del repositorio (no dentro de una carpeta "nova"):
- package.json, main.js, README.md, LEEME-SIN-ADMIN.txt, COPIA-build.yml
- shell/ (index.html, extras.js, extras2.js, newtab.html, splash.html, themes.css)
- assets/ (icon.png, icon.ico, wallpapers/)
- build/ (installerSidebar.bmp, uninstallerSidebar.bmp, LICENSE.txt, installer.nsh.OPCIONAL)
- .github/workflows/build.yml  <- imprescindible; sin él no hay compilación

## 2. Procedimiento (guíame así)
1. Confirmar que extraje el .zip (clic derecho > Extraer todo) y que veo package.json dentro de la carpeta "nova".
2. Abrir el repo > Add file > Upload files > Ctrl+A en la carpeta "nova" y arrastrar todo > Commit changes.
3. Comprobar en la página principal del repo que se ven package.json, main.js, shell, assets, build. Si veo una carpeta "nova" que lo contiene todo, está mal: hay que resubir el contenido de dentro.
4. Comprobar que existe .github/workflows/build.yml. Si no: Add file > Create new file > nombre `.github/workflows/build.yml` > pegar el contenido de COPIA-build.yml > Commit.
5. Pestaña Actions: debe aparecer "Build Nova". Amarillo = compilando (5-8 min), verde = listo, rojo = fallo.
6. Repo > Releases (barra derecha) > release más reciente "Nova 1.2.0" > descargar Nova-Portable-1.2.0.exe (recomendado, no instala nada) o Nova-Setup-1.2.0.exe (instala solo para mi usuario, sin admin).

## 3. Diagnóstico
| Síntoma | Causa probable | Solución |
|---|---|---|
| Actions vacío | falta .github/workflows/build.yml o el proyecto está dentro de una subcarpeta | pasos 3 y 4 |
| Repo con un .zip dentro | GitHub no descomprime | borrar el zip y subir el contenido extraído |
| Rojo en "npm install" | fallo de red/dependencias | pulsar "Re-run all jobs"; si persiste, pedirme el log |
| Rojo en "Run npm run dist" con error de NSIS, sidebar, license o bmp | opciones del instalador | en package.json borrar dentro de build.nsis las claves installerSidebar, uninstallerSidebar y license, y hacer commit |
| Error 403 "Resource not accessible by integration" al publicar | permisos del token | Settings > Actions > General > Workflow permissions > Read and write permissions > Save; luego Actions > Re-run |
| Verde pero Releases vacío | el paso de release no corrió | abrir la ejecución, mirar el último paso, pedirme el log |
| Windows: "Windows protegió su PC" | .exe sin firmar | Más información > Ejecutar de todos modos |
| Nova abre y se cierra | error de código | pedirme captura; usar el portable |

## 4. Si hay que modificar el código (futuras actualizaciones)
- Todo se sube por la web de GitHub (editar archivo con el lápiz o Upload files); cada commit dispara una compilación nueva.
- shell/index.html: interfaz base (pestañas, barra, paneles, Nova IA). shell/extras.js y extras2.js se cargan después y comparten variables globales; envuelven funciones (newTab, go, draw, applyTheme, closeTab). extras.js exporta window.NOVA={PG,MENU,...}.
- Páginas internas nova://X: añadir `PG.X = r => { r.innerHTML = ... }` y, si quiere título, añadirlo al mapa de títulos en internalTab (extras.js).
- Temas: bloque `body.t-xxx{...}` en themes.css + nombre en THEMES.
- Instalador: package.json > build.nsis. Hay una página personalizada de NSIS SIN PROBAR en build/installer.nsh.OPCIONAL; solo activarla (renombrar a installer.nsh y añadir "include":"build/installer.nsh" en build.nsis) si el resto ya funciona.
- Nova IA usa una clave de API de Anthropic que el usuario pega en Ajustes > Nova IA.
- Los fondos online vienen de Wikimedia Commons en tiempo de ejecución (necesita internet).
- Limitación conocida: esta versión nunca se ha ejecutado en Windows por quien la escribió; espera pequeños fallos y corrígelos con el log.
