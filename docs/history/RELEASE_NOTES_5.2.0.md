# Nova 5.2.0 — Quantum Identity

## Enfoque
Esta actualización no intenta añadir otra colección de funciones. Nova 5.2.0 trabaja la identidad y el acabado del producto para que el navegador se sienta consistente, calmado y preparado para mantenerse estable durante más tiempo.

## Añadido
- Nuevo símbolo de Nova con variantes de marca, favicon e instalador.
- Splash renovado con animación breve y respetuosa con reducción de movimiento.
- Material gráfico nuevo para el instalador de Windows.
- Capa visual `nova52.js` aislada para el acabado de identidad.

## Cambiado
- Tipografía y espaciado visual refinados.
- Microanimaciones reducidas a movimientos cortos y discretos.
- Menús y controles con una jerarquía más serena.
- Etiquetas visibles de versión actualizadas a 5.2.0.

## Conservación
- No se rediseña ni reemplaza `shell/index.html`.
- No se altera el flujo de creación de pestañas.
- No se reintroducen temas, logos alternativos ni fondos antiguos.
- El instalador mantiene los datos de usuario y no borra `userData`.

## Validación
La CI debe ejecutar comprobaciones de proyecto, sintaxis, assets y regresión antes de empaquetar. El `.exe` final debe probarse en Windows.
