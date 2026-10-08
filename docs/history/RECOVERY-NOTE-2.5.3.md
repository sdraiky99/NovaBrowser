# Recovery note

La limpieza 2.5.2 consolidó demasiados módulos de una vez y cambió el aislamiento del renderer sin una prueba real de Electron disponible en el entorno de build. 2.5.3 revierte esos cambios y conserva el árbol funcional de 2.5.0.

Siguiente paso recomendado: migración incremental por subsistema, con `npm install`, `npm run check` y prueba de arranque antes de eliminar cada módulo antiguo.
