# Conocimiento de regresión a partir de re-tests

## Naturaleza de esta fuente

Este archivo resume evidencia histórica del registro de re-tests entre noviembre de 2025 y septiembre de 2026. No establece por sí solo reglas vigentes: cada ítem debe validarse contra la versión, ticket y ambiente actuales.

Los ítems `REG` son candidatos de regresión priorizados. `OBS` son comportamientos observados que requieren confirmación funcional antes de convertirse en regla de negocio.

## Invernada

- `REG-INV-001` — Fecha de carga en Compras/Pendientes de pago: usar `Datos de origen`; si no existe, usar la fecha de Transporte. Evidencia: T15266, aprobado el 28/11/2025.
- `REG-INV-002` — Sin establecimiento, la vista de Compradas debe mostrar `A definir`. Evidencia: T15405, aprobado el 02/12/2025.
- `REG-INV-003` — Las tropas por bulto no deben mostrar condiciones o restricciones de pesada. Evidencia: T15702 y T16684, aprobados.
- `REG-INV-004` — La CI debe conservar datos comerciales al pasar la tropa de Publicadas a Vendidas. Evidencia: T17718 y T21188, finalmente aprobados tras rechazos previos.
- `REG-INV-005` — Al cambiar de sociedad en una CI, el resumen debe actualizar sus parámetros. Evidencia: T19312 y T21697, finalmente aprobados.
- `REG-INV-006` — La CI debe reflejar zona, TP2 y moneda cuando correspondan. Evidencia: T17119 y T21788.
- `REG-INV-007` — Una operación de CI debe mostrar confirmación de compra realizada al completarse. Evidencia: T19313, aprobado.

## Faena y CI de faena

- `REG-FAE-001` — En CI de faena, cuando la distancia es menor a 250 km, el cálculo debe aplicar el ajuste de 50 km documentado. Evidencia: T18334 y T16194, aprobados.
- `REG-FAE-002` — Al comprar una CI de faena, precio por km y distancia deben propagarse desde la CI. Evidencia: T8550, finalmente aprobado.
- `REG-FAE-003` — Valores vacíos de grasa o tipificación no deben convertirse en valores por defecto incorrectos ni producir paréntesis vacíos. Evidencia: T20887, T21010, T21011, T21153 y T21015, aprobados.
- `REG-FAE-004` — La segmentación, tipificación y grasa de la CI deben coincidir entre CSV, vista Admin y vista cliente. Evidencia: T14840, T14842, T14843 y T20843.
- `REG-FAE-005` — La categoría/terminación para destino Exportación Hilton debe ocultarse según las condiciones de Feedlot o Racionada. Evidencia: T21489 y T21563.

## DCP

- `REG-DCP-001` — Un usuario sin ninguna sociedad apta para DCP no debe tener visible el botón de acceso. Evidencia: T13010, finalmente aprobado el 29/12/2025.
- `REG-DCP-002` — Una sociedad con habilitación financiera pero CUIT vacío o inválido debe tener un comportamiento controlado y explicativo. En pruebas tempranas faltaba el aviso; confirmar la especificación vigente. Evidencia: T13010.
- `REG-DCP-003` — Los destinatarios y sus datos de contacto deben conservarse y visualizarse correctamente al crear/editar pagos. Evidencia: T22005 y T22360.

## Transporte y Viaje Inmediato

- `REG-TRA-001` — El alta y listado de VI deben soportar carga de archivos y mostrar tipo de camión cuando aplique. Evidencia: T16838, T16839 y T16849; inicialmente bloqueados.
- `REG-TRA-002` — La vista de Viajes Realizados debe mostrar el tipo de operación correcto. Evidencia: T22216, finalmente aprobado.
- `REG-TRA-003` — Los filtros por ID de lote y su combinación con otros filtros deben respetarse en `Viajes a asignar`. Evidencia: T18519 y T18680, aprobados con subtickets asociados.
- `REG-TRA-004` — El contador de operaciones con saldo en la home de Transportes debe reflejar el valor correcto. Evidencia: T19407, finalmente aprobado.

## Señales para priorizar pruebas

- Hay recurrencia en CI, fechas de carga, propagación de datos entre estados, visibilidad por sociedad y representación de valores vacíos.
- Un ticket marcado `Pasó` después de varios `Rechazado` es buen candidato para regresión automatizada estable.
- Un ticket `Bloqueado`, `Reportado` o `Cancelado` no debe usarse como aserción de producto sin revisar su resolución.
