# Nova 6.0 — Especificación visual y criterios de aceptación

**Dirección aprobada:** híbrido Chrome + identidad propia de Nova.  
**Densidad:** equilibrada.  
**Nueva pestaña:** cercana a Chrome.  
**Panel lateral:** opcional, ocultable y expandible.  
**Noticias:** visibles por defecto.

## Principios de producto

1. La estructura debe resultar familiar para usuarios de Chrome, sin reutilizar marca ni presentar Nova como una versión oficial de Chrome.
2. Toda la aplicación comparte paleta, tipografía, tamaños, iconografía, márgenes, radios y estados interactivos.
3. Claridad y utilidad tienen prioridad frente a efectos decorativos, transparencias, sombras o tarjetas innecesarias.
4. El diseño no simula funciones: los controles deben ejecutar acciones reales o informar claramente de sus límites.
5. Favoritos, historial, descargas, Workspaces, privacidad, ajustes y datos útiles existentes se conservan salvo que una auditoría técnica documente por qué no pueden mantenerse.
6. El modo claro, el oscuro y el modo sistema deben ser coherentes en todas las páginas internas y componentes propios.

## Mapa de interfaces

### Ventana y navegación

| ID | Interfaz | Resultado esperado |
|---|---|---|
| UI-01 | Ventana principal | Estructura estable, controles de Windows alineados y contenido sin solapamientos. |
| UI-02 | Barra de pestañas | Pestañas activas/inactivas, iconos, carga, fijado y cierre visibles y coherentes. |
| UI-03 | Botón de nueva pestaña | Se ubica después de las pestañas y abre una nueva pestaña. |
| UI-04 | Barra de navegación | Atrás, adelante, recargar, favoritos, panel lateral, acento y menú. |
| UI-05 | Barra de direcciones | Admite URL y consultas; Enter ejecuta la navegación. |
| UI-06 | Sugerencias | Presenta pestañas, favoritos e historial coincidentes sin tapar controles esenciales. |
| UI-07 | Menú principal | Acceso a acciones frecuentes, historial, descargas, Workspaces, extensiones, ajustes y ayuda. |
| UI-08 | Menú contextual de pestaña | Duplicar, silenciar, fijar y cerrar pestañas según el soporte actual. |
| UI-09 | Menús contextuales de contenido | Estilo compartido; acciones permitidas según el elemento y capacidades existentes. |
| UI-10 | Buscar en página | Campo compacto, coincidencias, navegación de resultados y cierre. |
| UI-11 | Ventanas de confirmación | Mensaje, acción primaria, cancelación y foco de teclado coherentes. |

### Nueva pestaña

| ID | Interfaz | Resultado esperado |
|---|---|---|
| UI-12 | Marca y búsqueda | Nova se reconoce y la búsqueda lleva a la navegación normal del navegador. |
| UI-13 | Accesos rápidos | Los favoritos aparecen como accesos; si no hay favoritos, se muestra una selección inicial útil. |
| UI-14 | Añadir acceso rápido | Formulario para guardar nombre y URL; valida la URL y lo añade a Favoritos, que alimentan los accesos. |
| UI-15 | Noticias | Visibles al abrir una pestaña; tarjetas discretas con fuente, titular, resumen, fecha y enlace cuando hay datos. |
| UI-16 | Categorías de noticias | Todas, Tecnología, Gaming y Desarrollo filtran el feed usando la API existente. |
| UI-17 | Estado de noticias | Muestra carga, actualización, caché, feed disponible, ausencia de resultados o error. |
| UI-18 | Acceso a ajustes | Abre los ajustes de Nova desde la propia nueva pestaña. |
| UI-19 | Guía, novedades y Command | Cada acción usa el puente limitado de la nueva pestaña. |

### Páginas y herramientas internas

| ID | Interfaz | Resultado esperado |
|---|---|---|
| UI-20 | Favoritos | Abrir, eliminar y mantener datos persistentes. |
| UI-21 | Historial | Buscar, agrupar por fecha, abrir entradas y limpiar con resultado visible. |
| UI-22 | Descargas | Ver elementos registrados, abrir la carpeta y mostrar ubicación cuando existe una ruta. |
| UI-23 | Extensiones | Mostrar extensiones integradas y cargadas; habilitar gestión y comunicar límites de compatibilidad. |
| UI-24 | Workspaces | Guardar las pestañas relevantes, abrir un espacio y eliminarlo. |
| UI-25 | Panel lateral | Ocultar/mostrar desde la barra y expandir/contraer etiquetas desde ajustes. |
| UI-26 | Rendimiento | Mostrar métricas reales de la sesión y aplicar modo Eco/caché solo si la API lo confirma. |
| UI-27 | Privacidad y seguridad | Controles reales disponibles, etiquetas claras y ausencia de promesas no implementadas. |
| UI-28 | Noticias ampliadas | Reutilizar el feed existente sin inventar fuentes ni titulares. |
| UI-29 | Acerca de Nova | Mostrar la versión del paquete y versiones de Chromium/Electron de la ejecución actual. |

### Ajustes

| ID | Sección | Resultado esperado |
|---|---|---|
| UI-30 | Apariencia | Claro, oscuro y sistema; acento opcional; aplicación inmediata. |
| UI-31 | Fondo de barra | Elegir una imagen local compatible, mostrar vista previa, persistir y restablecer. |
| UI-32 | Buscador | Cambiar el proveedor de búsqueda y usarlo desde la barra de direcciones. |
| UI-33 | Visibilidad del panel lateral | Ocultarlo o mostrarlo desde ajustes o desde la barra superior. |
| UI-34 | Expansión del panel lateral | Mostrar iconos con o sin sus etiquetas. |
| UI-35 | Animaciones | Respetar la preferencia para desactivarlas y reducir movimiento. |
| UI-36 | Sesión y guía | Reabrir una pestaña cerrada y configurar la guía de inicio. |
| UI-37 | Privacidad | Cambiar el bloqueador integrado y acceder a la configuración de aplicaciones predeterminadas de Windows. |
| UI-38 | Ayuda | Abrir guía, novedades y diagnóstico. |
| UI-39 | Actualizaciones | Mostrar versión instalada y acceso a releases cuando la consulta esté disponible. |
| UI-40 | Navegación por ajustes | Índice lateral que salta a secciones dentro del mismo sistema visual. |

### Estados transversales

| ID | Estado | Resultado esperado |
|---|---|---|
| UI-41 | Primer inicio | Mostrar guía solo según la preferencia de inicio. |
| UI-42 | Novedades | Mostrar una vez por versión, permitiendo abrirlas manualmente otra vez. |
| UI-43 | Sin conexión | Mensaje claro; búsqueda y navegación local no se bloquean. |
| UI-44 | Contenido vacío | Explicar cómo empezar, sin paneles rotos ni listas falsas. |
| UI-45 | Error recuperable | Ofrecer reintentar, volver o cerrar cuando proceda. |
| UI-46 | Ventana estrecha | Reorganizar controles, navegación y ajustes sin solapamiento. |

## Sistema visual

- **Modo claro:** superficies blancas, grises neutros, borde suave y texto oscuro.
- **Modo oscuro:** superficies escalonadas, separadores visibles y contraste suficiente.
- **Acento:** uno solo y configurable, para foco, selección, enlaces y acciones principales.
- **Tipografía:** Segoe UI/Segoe UI Variable y tipografía de sistema como reserva.
- **Iconos:** SVG lineales homogéneos, sin emojis en controles de la interfaz.
- **Geometría:** pestañas y campos familiares, radios discretos, zonas de clic cómodas y espaciado consistente.
- **Estados:** hover, focus-visible, activo, deshabilitado, cargando, error y vacío.
- **Movimiento:** breve, funcional y desactivable.
- **Adaptación:** escritorio amplio como objetivo principal; ventanas estrechas conservan búsqueda y funciones básicas.

## Criterios de aceptación

### Visuales

- VIS-01: no queda una mezcla visible entre el sistema anterior y el nuevo en ventana, página de inicio, páginas internas, menús o ajustes.
- VIS-02: claro, oscuro y sistema no generan texto invisible ni paneles con contraste insuficiente.
- VIS-03: barra de pestañas, botón `+`, barra de direcciones y controles de ventana están alineados.
- VIS-04: el panel lateral se oculta, muestra y expande sin perder contenido.
- VIS-05: menús, formularios, botones, diálogos y estados vacíos comparten componentes y estilo.
- VIS-06: ventanas redimensionadas no producen solapamientos ni dejan acciones esenciales fuera de alcance.

### Funcionales

- FUN-01: buscar desde la página nueva y desde la barra de direcciones funciona con Enter.
- FUN-02: añadir un acceso desde la nueva pestaña lo guarda en Favoritos y lo presenta al refrescar nuevas pestañas.
- FUN-03: las pestañas se crean, seleccionan, cierran y recuperan correctamente.
- FUN-04: favoritos e historial persisten y sus acciones actualizan la interfaz.
- FUN-05: los modos visuales y el acento se aplican a la ventana y a la nueva pestaña.
- FUN-06: mostrar/ocultar y expandir/contraer el panel lateral conserva la preferencia.
- FUN-07: las categorías y la actualización de noticias llaman al feed existente; errores y feed vacío se muestran con claridad.
- FUN-08: ajustes y menús enlazan a acciones existentes; no hay botones decorativos presentados como funcionales.
- FUN-09: Workspaces, descargas, extensiones y rendimiento conservan sus funciones existentes y comunican sus limitaciones.
- FUN-10: actualizar la interfaz no elimina datos del perfil del usuario.

### Técnicos y publicación

- TEC-01: `package.json` usa una versión semántica válida, ahora `6.0.0`.
- TEC-02: `npm run check` termina correctamente en el entorno de preparación.
- TEC-03: GitHub Actions valida la versión y espera `Nova-Setup-6.0.0.exe` y `Nova-Portable-6.0.0.exe` para Windows.
- TEC-04: instalar dependencias y compilar se verifica en CI; este entorno no tiene acceso confirmado al registro npm.
- TEC-05: instalar, actualizar, ejecutar y desinstalar se prueban en Windows; las pruebas estáticas no se consideran prueba de instalación.
- TEC-06: la actualización conserva datos existentes y no borra el perfil durante la instalación.

## Estado de la entrega

El sistema de diseño, la ventana, la hoja de estilos compartida, la nueva pestaña, la navegación de ajustes y el control de visibilidad del panel lateral se han implementado en la base Nova 6.0.0. Las comprobaciones automáticas de estructura, sintaxis, lógica de navegación, puente de nueva pestaña y recursos pasan en el entorno de preparación. No se afirma que el instalador ya se haya compilado ni que la experiencia se haya probado interactivamente en Windows.
