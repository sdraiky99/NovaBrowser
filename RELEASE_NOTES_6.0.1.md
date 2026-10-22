# Nova 6.0.1 — Hotfix de calidad

## Correcciones
- La búsqueda de la nueva pestaña ahora tiene una ruta alternativa de navegación si el puente de Nova no está disponible.
- Se sustituyeron los iconos principales de la interfaz por recursos SVG locales incluidos en `assets/icons/`, con un estilo minimalista y coherente.
- El botón de nueva pestaña usa un icono gráfico centrado, con medidas y alineación corregidas.
- Las animaciones de pestañas, paneles y avisos son más suaves y siguen respetando `prefers-reduced-motion`.
- Las noticias ya no muestran titulares de ejemplo como si fueran noticias reales; si no hay feed ni caché, se indica que no hay contenido disponible.
- Se ampliaron las comprobaciones de calidad para cubrir recursos gráficos, fallback de búsqueda y ausencia de noticias ficticias.

## Extensiones
- El gestor carga extensiones Chromium desempaquetadas compatibles mediante `session.loadExtension`, permite retirarlas y restaura las rutas guardadas.
- La Chrome Web Store no ofrece instalación directa universal en Electron. Nova indica esta limitación en la interfaz y no promete compatibilidad total.

## Verificación
Se ejecutaron las comprobaciones estáticas del proyecto y la simulación de los flujos de nueva pestaña. La compilación del instalador y las pruebas de navegación real requieren ejecutar Nova con sus dependencias instaladas en Windows.
