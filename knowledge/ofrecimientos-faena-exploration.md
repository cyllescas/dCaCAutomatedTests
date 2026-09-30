# Hallazgos de exploracion — Ofrecimientos de faena

- Fecha: 2026-09-03
- Ambiente: `https://stage.dcac.ar/`
- Fuente: exploracion UI black-box y ejecucion Cypress aprobada.

## Confirmado

- El formulario cliente de faena permite crear un ofrecimiento con una sociedad y un establecimiento existentes.
- Luego de finalizar el formulario, el POST observable retorna el numero de lote y el ofrecimiento aparece en la ruta funcional `/operacion/faena/venta/pendiente-publicacion`.
- El caso automatizado verifica los datos principales del lote en la tarjeta visible.

## UNKNOWN / preguntas abiertas

- El alta de una sociedad nueva no mostro confirmacion ni la sociedad en el desplegable durante la exploracion. Confirmar criterio de persistencia antes de automatizar PASS.
- La ruta lateral `/operaciones/faena` mostro ERROR 44; la ruta funcional observada usa `/operacion/faena/venta/pendiente-publicacion`.
- Admin > Faena > Ofrecimientos permanecio en `Cargando...`; no se observo un selector confiable para `Ver legajo` ni se pudo completar la trazabilidad administrativa.

Evidencia: `artifacts/ofrecimientos-faena-pendientes-publicacion.png`, `artifacts/ofrecimientos-faena-admin-ofrecimientos.png`, `artifacts/ofrecimientos-faena-mis-operaciones-ruta-404.png`.

## Registro acumulativo — 2026-09-03

Este registro extiende los hallazgos anteriores. No reemplaza ni invalida los
casos `UNKNOWN` documentados arriba.

### Selectores observados y utilizados

| Rol | Pantalla/acción | Selector o patrón | Propósito | Estado |
| --- | --- | --- | --- | --- |
| Cliente | Inicio, vender | `#btn_vender` | Abrir las opciones de venta | Observado |
| Cliente | Selección de operación | Texto `Cotizar lote para Faena` | Abrir el formulario de faena | Observado |
| Cliente | Formulario | `#sociedad_select` | Seleccionar sociedad | Observado |
| Cliente | Formulario | `select[name='ng_establecimiento']` | Seleccionar establecimiento | Observado |
| Cliente | Formulario | `select[name='ng_categoria']` | Seleccionar categoría | Observado |
| Cliente | Formulario | `select[name='ng_raza']` | Seleccionar raza | Observado |
| Cliente | Formulario | `input[name='ng_peso_min']` | Cargar peso mínimo | Observado |
| Cliente | Formulario | `input[name='ng_peso_max']` | Cargar peso máximo | Observado |
| Cliente | Formulario | `input[name='ng_peso']` | Cargar peso informado | Observado |
| Cliente | Formulario | `#fecha_I` | Cargar fecha | Observado |
| Cliente | Formulario | `input[name='ng_condiciones_plazo_cotizacion']` | Cargar plazo | Observado |
| Cliente | Formulario | Texto `Ofrecer tropa` | Enviar el ofrecimiento | Observado |
| Cliente | Confirmación | Texto `Su tropa ha sido creada correctamente` | Confirmar creación | Observado |
| Cliente | Pendientes | `/operacion/faena/venta/pendiente-publicacion` | Validar navegación funcional | Observado |
| Admin | Menú FAENA | Texto `FAENA` | Abrir menú administrativo | Observado |
| Admin | Ofrecimientos | `a[href="?ofrecimientos&secc=f&tit=0"]` | Abrir listado de ofrecimientos | Observado |
| Admin | Búsqueda | `input[placeholder="Buscar en el listado..."]` | Buscar por número de lote | Observado |
| Admin | Resultado | Texto `#<número de lote>` | Identificar el lote creado | Observado |
| Admin | Resultado | Texto `Ver legajo` | Abrir el legajo | Pendiente de confirmar en Stage |

### Sincronización observable

- El envío utiliza el POST observable `**/MODULOS/directo/modulo_crearLote/index.php`.
- La carga del listado administrativo utiliza el GET observable
  `**/MODULOS/listadosAdminNuevos/ajax/ofrecimientos_ajax.php**`.
- La automatización espera ambas solicitudes con un timeout de 60000 ms; no se
  usa una llamada directa al endpoint como sustituto de la UI.
- La pantalla admin y el control `Ver legajo` continúan requiriendo ejecución
  real para confirmar la carga completa y sus selectores definitivos.

Fuente: `cypress/pages/FaenaOfferPage.js`, `cypress/pages/MainAdminPage.js`,
`cypress/support/helpers/faena_offer_helper.js` y
`cypress/e2e/ofrecimientos-faena/ofrecimientos-faena.cy.js`. La inspección de
código no constituye una nueva confirmación funcional del ambiente Stage.
