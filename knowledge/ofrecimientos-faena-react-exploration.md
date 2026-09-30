# Hallazgos de exploración — Ofrecimientos de faena React

- Fecha: 2026-09-03
- Ambiente principal: `https://react-stage.dcac.ar/`
- Ambiente de comparación: `https://stage.dcac.ar/`
- Fuente: exploración UI black-box con Playwright MCP.
- Resultado: exploración bloqueada antes del formulario de alta; no se guardó
  plan ni se generaron specs.

## Confirmado

- La sesión inicial de React se cargó y mostró un usuario autenticado, la home
  y los menús `Operaciones`, `Precios`, `Consultas`, `Perfil`, `Comprar` y
  `Cotizar`.
- La ruta React `/operacion/faena/venta` cargó la vista `Operaciones - Venta
  para faena` y posteriormente redirigió a
  `/operacion/faena/venta/pendiente-publicacion`.
- La ruta de pendientes mostró el texto `Pendientes de publicación` y tarjetas
  de tropas con categoría, peso, raza, terminación, destino, sociedad,
  establecimiento y número de lote.
- La solicitud XHR observable que alimenta la vista fue
  `GET https://api.dcac.ar/v1/MisOperaciones/faena`, con respuesta HTTP `200`.
  Se registra como evidencia de comportamiento observable de la UI, no como
  contrato para usar mediante `cy.request()`.

## Navegación y bloqueo

- El enlace visible `Cotizar` tuvo el patrón observado
  `http://stage.dcac.ar/__dcac/venderHacienda` y derivó a
  `https://stage.dcac.ar/__dcac/login?`.
- La navegación directa a `https://react-stage.dcac.ar/venderHacienda` mostró
  `ERROR 44` y `¡Esta página no existe!`.
- La navegación directa a
  `https://react-stage.dcac.ar/operacion/faena/venta?solicitud_directo&rapido`
  mostró sólo el encabezado `Operaciones - Venta para faena`, sin formulario.
- El login automático previsto por `scripts/playwright-init-page.ts` no
  completó el login legacy dentro de la sesión MCP actual. No se cargaron
  credenciales manualmente y se cerró el navegador.
- El caso de acceso a `Cotizar`, el formulario React, el envío, las
  validaciones y la comparación contra legacy quedan sin explorar en esta
  ejecución. No deben convertirse en expectativas automatizadas.

## Inventario de selectores observados

| Rol | Pantalla/acción | Selector o patrón | Estado |
| --- | --- | --- | --- |
| Cliente | Menú principal | Texto `Cotizar` como link | Observado; deriva a legacy login |
| Cliente | Menú principal | Texto `Operaciones` | Observado |
| Cliente | Operaciones faena | Texto `Operaciones - Venta para faena` | Observado |
| Cliente | Pendientes | Link con URL `/operacion/faena/venta/pendiente-publicacion` | Observado |
| Cliente | Pendientes | Link con texto `Pendientes de publicación` | Observado |
| Cliente | Tarjeta | Texto `Vaca gorda`, `425 Kg`, `Aberdeen Angus Negro`, `Feedlot`, `Consumo` | Observado en datos existentes |
| Cliente | Login legacy | Dos elementos `textbox` y botón `INGRESAR` | Observado; no automatizado en esta exploración |

## ExploraciÃ³n reiniciada — flujo React directo — 2026-09-03

- Acceso utilizado: login autenticado en `https://react-stage.dcac.ar/` y navegaciÃ³n directa a `https://react-stage.dcac.ar/cotizar/faena`.
- No se utilizÃ³ comparaciÃ³n funcional con legacy. La ruta directa React permitiÃ³ completar el flujo.
- La pantalla mostrÃ³ `Cotizar tropa para Faena` y cargÃ³ los datos de la sesiÃ³n.
- Se seleccionaron una sociedad y establecimiento de prueba disponibles en la UI, sin persistir nombres, IDs ni otros identificadores.
- Se completÃ³ una cotizaciÃ³n con categorÃ­a `Vaca gorda`, raza `Aberdeen Angus Negro`, cantidad 50, pesos 350/425/500, `Feedlot`, 45 dÃ­as, `Consumo`, `Apto China: No`, `Sin Encierre`, desbaste 0, balanza `Establecimiento`, distancia 10 km y comentario de QA.
- Al enviar, la UI navegÃ³ a `/cotizar/faena/tropa-creada` y mostrÃ³ `CotizaciÃ³n en Proceso` y `Ir a Mis Operaciones`.
- La peticiÃ³n observable de la UI `POST /v1/MisOperaciones/faena/ofrecimiento` respondiÃ³ HTTP 200. No debe convertirse en `cy.request()`.

### Selectores observados

| AcciÃ³n | Selector/patrÃ³n observado | Resultado |
| --- | --- | --- |
| Sociedad | `#society` | Abre opciones visibles |
| Establecimiento | `#establishment` | Se habilita luego de sociedad |
| CategorÃ­a | `#category` | Incluye `Vaca gorda` |
| Razas | contenedor observado `.sc-hynwKY`; texto `Seleccionar (mÃ¡x. 3)` | Permite seleccionar; queda abierto y debe cerrarse antes de otros clics |
| Campos | `#quantity`, `#minWeight`, `#averageWeight`, `#maxWeight`, `#confinementDays`, `#dateCarga`, `#desbaste`, `#distancia`, `#comentario` | Editables |
| Botones | `Feedlot`, `Consumo`, `No`, `Sin Encierre`, `Establecimiento`, `Cotizar Tropa` | Observados y operativos |

### SincronizaciÃ³n y evidencia

- La carga requiriÃ³ esperar a que apareciera `Cotizar tropa para Faena` y a que los selectores estuvieran disponibles.
- Los clics paralelos produjeron errores de consola y elementos del dropdown interceptando clics. El flujo estable fue secuencial y cerrando el selector de razas.
- `#desbaste` y `#distancia` se reiniciaron al completarse antes de las selecciones; deben completarse al final.
- La UI mostrÃ³ `04/09/2026` en `#dateCarga`, mientras que la peticiÃ³n observable enviÃ³ `2026-09-03`; queda como discrepancia `UNKNOWN` para confirmar con el comportamiento esperado y no debe fijarse como regla de negocio.
- Evidencia visual: `artifacts/ofrecimientos-faena-react-tropa-creada.png`.

## Exploración ejecutada nuevamente — 2026-09-03

- Ambiente: `https://react-stage.dcac.ar/`; rol observable: cliente autenticado.
- La ruta directa `/cotizar/faena` cargó `Cotizar tropa para Faena`.
- Se observaron sociedades y establecimientos disponibles; se seleccionaron valores dinámicos sólo para explorar dependencias y se cancelaron las altas.
- Al enviar el formulario vacío se observaron mensajes `Este campo es obligatorio` y `Debe haber al menos una raza` en los campos visibles.
- El formulario expone `Cantidad`, pesos, `Terminación`, `Días de encierre`, `Destino`, `Apto China`, `Disponibilidad de Carga`, `Encierre`, `Desbaste`, `Balanza`, `Distancia`, videos y aclaraciones.
- No se observó `Tipo de Jaula` ni `Plazo de venta` en React. La comparación legacy no pudo ejecutarse porque `https://stage.dcac.ar/__dcac/venderHacienda` redirigió a `/__dcac/login?`; no se ingresaron credenciales manualmente.

### Selectores adicionales observados

| Acción | Selector/patrón | Resultado |
| --- | --- | --- |
| Alta de sociedad | `#society`, texto `+ Agregar nueva sociedad` | Abre formulario inline |
| Alta de sociedad | roles `textbox`, botones `Agregar Sociedad` y `Cancelar` | Campos Razón social y CUIT visibles |
| Alta de establecimiento | `#establishment`, texto `+ Agregar nuevo establecimiento` | Abre formulario inline |
| Alta de establecimiento | rol `textbox`, botones `Agregar Establecimiento` y `Cancelar` | Campo Nombre del establecimiento visible |
| Validación | texto `Este campo es obligatorio` / `Debe haber al menos una raza` | Visible al enviar vacío |
| Formulario | `#dateCarga` readonly con placeholder `Seleccionar` | Fecha de carga observable |

### Evidencia de esta ejecución

- Snapshots: `.playwright-mcp/page-2026-09-03T17-24-04-395Z.yml`, `.playwright-mcp/page-2026-09-03T17-24-59-153Z.yml`, `.playwright-mcp/page-2026-09-03T17-25-23-099Z.yml` y `.playwright-mcp/page-2026-09-03T17-25-45-336Z.yml`.
- Captura: `artifacts/ofrecimientos-faena-react-form-validation.png`.

## Evidencia

- Snapshots Playwright: `.playwright-mcp/page-2026-09-03T16-09-17-822Z.yml`,
  `.playwright-mcp/page-2026-09-03T16-10-31-388Z.yml`,
  `.playwright-mcp/page-2026-09-03T16-10-47-114Z.yml` y
  `.playwright-mcp/page-2026-09-03T16-11-36-149Z.yml`.
- Solicitud de red observable: captura `#25` de la sesión MCP, documentada en
  los eventos de red de la exploración.

## Próxima exploración requerida

- Resolver la transferencia/autenticación entre React y legacy, o contar con
  una sesión de prueba autorizada que permita entrar a `Cotizar`.
- Repetir la exploración del formulario antes de crear el plan.
- Registrar nuevos selectores como una sección fechada, conservando este
  inventario y cualquier estado `UNKNOWN` previo.
