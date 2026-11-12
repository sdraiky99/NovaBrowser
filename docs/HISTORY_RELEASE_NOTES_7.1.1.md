# NOVA 7 — 7.1.1

Corrección de las noticias de la nueva pestaña. Sin cambios de interfaz ni de motor respecto a 7.1.0.

## Problema corregido

- El panel de noticias de la nueva pestaña dejaba de mostrar titulares de la mayoría de fuentes: el parser de RSS/Atom trataba los bloques `<![CDATA[...]]>` como si fueran etiquetas HTML y eliminaba el contenido completo, titulares incluidos.
- Consecuencia antes de esta versión: 0 noticias de Xataka, Genbeta, The Verge y PC Gamer; solo MuyComputer y Ars Technica aportaban contenido, y con pocas fuentes el panel parecía "no funcionar".

## Cambios incluidos en esta entrega

- `newsStripHtml` ahora desenvuelve los bloques CDATA antes de limpiar HTML: los titulares y resúmenes de todas las fuentes vuelven a extraerse.
- Feeds de Xataka y Genbeta apuntados a su URL final (`/feedburner.xml`); el servidor responde 301 desde las direcciones antiguas.
- Noticias de Steam filtradas por alfabeto latino: el parámetro de idioma de la API no filtra contenido y el feed comunitario de Counter-Strike 2 incluye ítems en ruso que se mostraban tal cual.
- Tiempo de espera de descarga de feeds ampliado de 7 a 12 segundos: el feed de PC Gamer pesa ~2 MB sin comprimir y en conexiones lentas superaba el límite anterior.

## Verificación (entorno Linux, Node 20)

Ejecutada la lógica real de `fetchNewsFeed`/`fetchSteamNews` del `main.js` corregido: Xataka 26 ítems, Genbeta 16, MuyComputer 20, Ars Technica 20, Ars Technica Gaming 20, The Verge 10, PC Gamer 50 y Steam CS2 3 (tras filtrar idioma). Antes de la corrección, 4 de 7 fuentes devolvían 0 ítems.

## Distribución

- Setup: `NOVA-7-Setup-7.1.1.exe` (instalación por usuario, sin elevación).
- Portable: `NOVA-7-Portable-7.1.1.exe` (datos independientes junto al ejecutable).
- Actualización: los usuarios de 7.1.0 reciben 7.1.1 al publicar el release; el caché local de noticias (`news-live-cache.json`) se renueva en la primera carga.
