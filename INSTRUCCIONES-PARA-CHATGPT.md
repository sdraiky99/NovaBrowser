# Instrucciones para ChatGPT: completar el setup de Nova 1.6.1

## PROMPT PARA PEGAR (copia desde aquí)
Actúa como guía paciente de GitHub y Windows. Te paso el proyecto "Nova" (un navegador basado en Chromium/Electron) y tu misión es que yo termine con el instalador `Nova-Setup-1.6.1.exe` y el portable `Nova-Portable-1.6.1.exe` descargables en la pestaña Releases de mi repositorio https://github.com/sdraiky99/NovaBrowser.
REGLAS: (1) NO tengo administrador, ni CMD, ni PowerShell, ni puedo instalar programas: todo debe hacerse desde el navegador web con clics. (2) Háblame en español, con pasos cortos y numerados, UNA acción cada vez. (3) Después de cada bloque pídeme una captura o que te diga qué veo. (4) Si algo falla, pídeme el texto en rojo del log de Actions antes de proponer cambios. (5) No me pidas comandos de terminal. (6) No inventes botones: si no estás seguro de cómo se llama algo en GitHub, dilo.
Contexto técnico y procedimiento: sigue el documento de abajo.

## 1. Qué es el proyecto
Nova es una app Electron (Chromium por dentro). El .exe NO se compila en mi PC: lo compila GitHub Actions (Windows) cada vez que se sube código, y lo publica solo en Releases.
Estructura correcta en la RAÍZ del repositorio (no dentro de una carpeta "nova"):
- package.json, main.js, README.md, LEEME-SIN-ADMIN.txt, COPIA-build.yml
- shell/ (index.html, extensions.js, extras.js, extras2.js, extras3.js, extras4.js, extras5.js, tabs.js, newtab.html, offline.html, splash.html, themes.css)
- assets/ (icon.png, icon.ico, logos/ con .png y .ico de cada logotipo, wallpapers/)
- build/ (installerSidebar.bmp, uninstallerSidebar.bmp, LICENSE.txt, installer.nsh)
- .github/workflows/build.yml  <- imprescindible; sin él no hay compilación

## 2. Procedimiento (guíame así)
1. Confirmar que extraje el .zip (clic derecho > Extraer todo) y que veo package.json dentro de la carpeta "nova".
2. Abrir el repo > Add file > Upload files > Ctrl+A en la carpeta "nova" y arrastrar todo > Commit changes.
3. Comprobar en la página principal del repo que se ven package.json, main.js, shell, assets, build. Si veo una carpeta "nova" que lo contiene todo, está mal: hay que resubir el contenido de dentro.
4. Comprobar que existe .github/workflows/build.yml. Si no: Add file > Create new file > nombre `.github/workflows/build.yml` > pegar el contenido de COPIA-build.yml > Commit.
5. Pestaña Actions: debe aparecer "Build Nova". Amarillo = compilando (5-8 min), verde = listo, rojo = fallo.
6. Repo > Releases (barra derecha) > release más reciente "Nova 1.6.1" > descargar Nova-Portable-1.6.1.exe (recomendado, no instala nada) o Nova-Setup-1.6.1.exe (instala solo para mi usuario, sin admin).

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
- Instalador: package.json > build.nsis + build/installer.nsh (textos y registro de Nova como navegador en HKCU; no necesita administrador). main.js repite ese registro al arrancar si cambia la ruta o la version (registerBrowser).
- Navegador predeterminado: Windows 10/11 no permite fijarlo por codigo; el boton abre ms-settings:defaultapps?registeredAppUser=Nova y main.js lee HKCU\\...\\UrlAssociations\\https\\UserChoice para saber si es Nova. Con el portable no funciona.
- Logotipo: assets/logos/<id>.png (interfaz) y <id>.ico (Windows). main.js applyLogo() cambia el icono de la ventana y actualiza los .lnk (escritorio, Inicio, barra de tareas anclada). El icono del propio .exe solo cambia recompilando con otro assets/icon.ico.
- Extensiones: shell/extensions.js (CATALOG: id, name, cat, desc, css y/o js). Se inyectan en cada pagina con executeJavaScript.
- Nova IA (extras3.js): entiende órdenes locales (intent()), usa Claude si hay clave API de Anthropic (Ajustes > Nova IA) y si no usa el modo gratuito "Nova Free" (servicio externo text.pollinations.ai, NO verificado: si falla, sugerir clave API o quitar esa función).
- Clic derecho en webs: main.js (evento context-menu de los webview). Modo sin conexión: shell/offline.html (juego Nova Dino) se carga desde extras3.js al fallar la carga (did-fail-load).
- Orden de carga en index.html: extras.js, extras2.js, extras3.js, extras4.js (cada uno envuelve funciones del anterior; comparten variables globales de index.html).
- extras4.js (1.5): Nova IA 2.0, grupos de pestañas, marcadores, historial, descargas, notas, privacidad, avisos de actualización. La clave de Anthropic se guarda cifrada en main.js (safeStorage) y las llamadas a la IA se hacen en main.js (ipc 'ai-ask'); el renderer nunca la lee.
- Los webviews usan la partición 'persist:web' (datos de navegación aislados de la interfaz). Permisos de sitios y descargas se gestionan en main.js sobre esa sesión.
- Avisos de actualización: extras4.js consulta la última release de GitHub (por el nombre de los .exe: Nova-Setup-X.Y.Z.exe). No es autoactualización silenciosa.
- Estado real: NO se ha ejecutado nunca `npm install`, `npm run dist` ni la app en Windows por quien escribió el código. Solo se comprobó sintaxis y que existan los archivos referenciados. Si la compilación o la app fallan, corrige con el log.
- Si falla la compilación por las opciones de NSIS (sidebar/license), quita esas claves de build.nsis en package.json.
- Los fondos online vienen de Wikimedia Commons en tiempo de ejecución (necesita internet).
- Limitación conocida: esta versión nunca se ha ejecutado en Windows por quien la escribió; espera pequeños fallos y corrígelos con el log.

- Instalador 1.6.1: build/installer.nsh incluye una pagina de bienvenida animada (nsDialogs + temporizador que cambia build/slide1..5.bmp). Nunca se ha compilado por quien la escribio. build.yml reintenta solo sin animacion (define NOVA_NO_ANIM) si el primer intento falla; para desactivarla a mano, anade `!define NOVA_NO_ANIM` como primera linea de build/installer.nsh. Las imagenes BMP deben ser de 24 bits.
- Primer uso: onboard() en shell/extras.js (5 pasos + guia con marcas sobre #nt, #addr, #st, #side, #mn). Ajustes > Apariencia: appearanceBlock() en shell/extras5.js.
