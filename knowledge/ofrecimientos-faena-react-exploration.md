# Hallazgos de exploración — Ofrecimientos de faena React

Resumen consolidado de las exploraciones del 2026-09-03 (UI black-box con Playwright MCP, cliente
autenticado). Ambiente principal `https://react-stage.dcac.ar/`; comparación con
`https://stage.dcac.ar/`. Son observaciones, no reglas de negocio; las diferencias con legacy
están en `ofrecimientos-migracion.md`.

## Navegación y bloqueos

- Menús del cliente: `Operaciones`, `Precios`, `Consultas`, `Perfil`, `Comprar`, `Cotizar`.
- `/operacion/faena/venta` ("Operaciones - Venta para faena") redirige a
  `/operacion/faena/venta/pendiente-publicacion` ("Pendientes de publicación"), con tarjetas de
  tropas (categoría, peso, raza, terminación, destino, sociedad, establecimiento, lote). La vista se
  alimenta con `GET https://api.dcac.ar/v1/MisOperaciones/faena` (HTTP 200); es evidencia de la UI,
  no un contrato para `cy.request()`.
- El enlace `Cotizar` del menú deriva a `https://stage.dcac.ar/__dcac/login?` (legacy), y
  `/venderHacienda` en React da `ERROR 44`. La ruta directa **`/cotizar/faena`** sí abre el
  formulario React ("Cotizar tropa para Faena"), por eso la comparación funcional contra legacy
  no pudo ejecutarse (`/__dcac/venderHacienda` redirigió al login).
- Pendiente de resolver: transferencia de autenticación React → legacy, o sesión autorizada que
  entre a `Cotizar`, antes de comparar ambos formularios.

## Formulario React (`/cotizar/faena`)

- Campos: Sociedad, Establecimiento (se habilita tras sociedad), Categoría, Razas (máx. 3),
  Cantidad, pesos mínimo/promedio/máximo, Terminación (Feedlot…), Días de encierre, Destino
  (Consumo…), Apto China, Disponibilidad de Carga, Encierre, Desbaste, Balanza, Distancia, videos,
  aclaraciones. No se observó Tipo de Jaula ni Plazo de venta.
- Envío vacío: `Este campo es obligatorio` y `Debe haber al menos una raza`.
- Envío completo (Vaca gorda, Aberdeen Angus Negro, 50 cabezas, pesos 350/425/500, Feedlot, 45 días,
  Consumo, Apto China No, Sin Encierre, desbaste 0, balanza Establecimiento, distancia 10 km):
  navega a `/cotizar/faena/tropa-creada` ("Cotización en Proceso", "Ir a Mis Operaciones");
  `POST /v1/MisOperaciones/faena/ofrecimiento` → 200.
- Discrepancia `UNKNOWN`: `#dateCarga` mostró `04/09/2026` y la petición envió `2026-09-03`; no
  fijarla como regla.

## Selectores observados

| Elemento | Selector / patrón | Nota |
| --- | --- | --- |
| Sociedad / Establecimiento / Categoría | `#society`, `#establishment`, `#category` | Abren opciones (`[name="society"]`, etc.) |
| Razas | contenedor `.sc-hynwKY`, texto `Seleccionar (máx. 3)` | Queda abierto: cerrarlo antes de otros clics |
| Campos | `#quantity`, `#minWeight`, `#averageWeight`, `#maxWeight`, `#confinementDays`, `#dateCarga` (readonly, placeholder `Seleccionar`), `#desbaste`, `#distancia`, `#comentario` | Editables |
| Botones | `Feedlot`, `Consumo`, `No`, `Sin Encierre`, `Establecimiento`, `Cotizar Tropa` | Operativos |
| Alta de sociedad | texto `+ Agregar nueva sociedad`, botones `Agregar Sociedad`/`Cancelar` | Formulario inline (Razón social, CUIT) |
| Alta de establecimiento | texto `+ Agregar nuevo establecimiento`, botones `Agregar Establecimiento`/`Cancelar` | Formulario inline (Nombre) |
| Pendientes | link `/operacion/faena/venta/pendiente-publicacion` | Tarjetas con datos existentes |

## Sincronización

- Esperar `Cotizar tropa para Faena` y los selectores antes de operar.
- Los clics paralelos generan errores de consola y dropdowns que interceptan clics: operar en
  secuencia y cerrar el selector de razas.
- `#desbaste` y `#distancia` se reinician si se completan antes de las otras selecciones:
  completarlos al final.

## Evidencia

`artifacts/ofrecimientos-faena-react-tropa-creada.png`,
`artifacts/ofrecimientos-faena-react-form-validation.png` y snapshots bajo `.playwright-mcp/`
(`page-2026-09-03T16-*` y `T17-24/25-*`).
