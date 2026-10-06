# Nova 4.4.0 — Professional

Nova 4.4.0 consolida la base estable de 4.3.2 y centra la actualización en una experiencia de navegador más profesional, útil y mantenible.

## Nuevo

- Sidebar renovada con accesos rápidos a Workspaces y Rendimiento.
- Workspaces accesibles directamente desde la barra lateral, con guardado de las pestañas actuales y apertura rápida.
- Centro de rendimiento con RAM, CPU, memoria disponible y consumo por pestaña.
- Ahorro de energía manual desde Rendimiento y ahorro inteligente opcional basado en batería.
- Gestor de extensiones reales: permite cargar una extensión Chromium desempaquetada desde una carpeta con `manifest.json`, verla y retirarla.
- Mantiene los favicons reales de los sitios fijados y la interfaz Glass Clean de 4.3.2.
- Animaciones cortas y suaves, respetando `prefers-reduced-motion`.
- Nuevas rutas internas: Workspaces, Rendimiento y Extensiones reales.

## Estabilidad

- La shell principal de Nova no se reescribe: 4.4 añade una capa independiente sobre la base 4.3.2.
- Se conserva el empaquetado completo de `shell/**`.
- Las preferencias y perfiles existentes se mantienen.
- QA comprueba sintaxis, scripts activos e invocaciones IPC.

## No incluido

- No se reintroducen temas personalizados.
- No se añaden wallpapers ni widgets obligatorios.
- No se sustituye el `index.html` principal.
