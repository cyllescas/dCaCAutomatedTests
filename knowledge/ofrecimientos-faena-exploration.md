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

## Exploración del formulario legacy — 2026-11-17

Ambiente `https://stage.dcac.ar/` con cliente (sesión guardada tras la validación de Google). Ruta
`/__dcac/venderHacienda?solicitud_directo&rapido`. No se publicó ninguna tropa: sólo se recorrió el
formulario y se envió vacío/incompleto (bloqueado por validación). Son observaciones, no reglas.
Evidencia: `artifacts/faena-razas.png`, `artifacts/faena-solo-falta-fecha.png`.

- **Selectores:** `#sociedad_select` (`ng_sociedad_vendedora`, 36 sociedades + `Seleccionar una
  sociedad`; carga asíncrona), `#estab` (`ng_establecimiento`; aparece tras elegir sociedad con sus
  establecimientos y `+ Nuevo establecimiento`; al elegir uno muestra `Provincia:`/`Partido:`),
  `select[name='ng_categoria']`, `select[name='ng_raza']`, `input[name='ng_peso_min'|'ng_peso_max'|
  'ng_peso']`, `#fecha_I` (`ng_disp_carga`, jQuery UI datepicker, editable), `#fileuploadVideo`
  (`accept` video/*), `#selPlanilla` (`name=archivo`), `textarea[name='ng_aclaracion']`,
  `input[name='ng_condiciones_plazo_cotizacion']` (`Plazo de venta`, unidad Días),
  `input[name='ng_condiciones_desbaste']` (unidad %), `div._boot.btn_agregar_listado.env` `Ofrecer tropa`.
  Radios por `label[for=...]`: `simple|doble`, `a_campo|racionado|feedlot`, `consumo|hilton|UE|cuota`,
  `apto_china_si|apto_china_no`, `con_encierre|sin_encierre`, `a_retirar|puesto_planta`.
- **Categorías (29 + `Seleccionar`):** Terneros, Terneras, Terneros y Terneras, Novillitos, Vaquillonas,
  Novillitos y Vaquillonas, Novillos, MEJ, Vaca gorda, Vaca manufactura, Vaca conserva, Vacas y
  Vaquillonas, Vacas y Novillos, Toro gordo, Toro manufactura, Toro conserva, Toros y Novillos, Toros y
  Vacas, Toros, Vacas y Novillos, MEJ y Terneros, MEJ y Terneras, MEJ y Novillitos, MEJ y Vaquillonas,
  MEJ y Novillos, Varias, Bubalinos, Bubalinas, Bubalinos / Bubalinas, Novillos y Vaquillonas.
- **Sin campos dinámicos por categoría:** al recorrer las 29, el conjunto de controles visibles (27) es
  idéntico. Jaula, destino, apto China, pesada y flete tampoco agregan ni quitan campos.
- **Terminación:** Racionado y Feedlot agregan `ng_dias_encierre` (`Días de Encierre (aprox)`); A campo
  lo oculta. No es obligatorio (Feedlot sin días no genera mensaje).
- **Razas:** `ng_raza` con 24 opciones + `Seleccionar` (incluye `Bubalinos`). `+ Agregar otra raza`
  (`.agr_raza`) agrega `ng_raza2` (`#raza1`) y `ng_raza3` (`#raza2`) sólo si la raza anterior está
  elegida; un cuarto clic no agrega nada y el botón sigue visible, sin mensaje.
- **Obligatorios (mensaje `Debe completar el campo X`, clase `alert_input_faltante`):** Sociedad,
  Establecimiento, Tipo de Jaula, Categoría, Terminación, Destino, Raza, Peso, Disponibilidad de Carga.
  Apto China, Pesada, Flete, Plazo, Desbaste, planilla, video y aclaraciones no figuran como obligatorios.
- **Peso:** sólo `ng_peso` (promedio) satisface el obligatorio; min, max o ambos no. Confirmado por el usuario (OQ-069 resuelta).
  No se probó validación entre los tres campos (el usuario indica que la app no valida).
- **Planilla de pesada:** tras adjuntar una imagen aparece un enlace `a[target='_blank'][href^='/documentos/?ver=1&arch=']`
  con la imagen `/imagenes/baja.png` dentro de `div.org_neg`, más un enlace para borrar (con `confirm`). El
  enlace abre el documento en una pestaña nueva (el usuario confirma que se ve el archivo cargado). Adjuntarla
  sube un archivo al servidor aunque la tropa no se publique.
- **Video:** `input[type=button].btn_subir_video` abre el selector de archivos; el input real es
  `#fileuploadVideo` (`accept` video/*); resultado en `.videos_subidos`. El usuario ve el error del video de
  4 s (OQ-071).
- Ver OQ-070 y OQ-071 (diferencias entre lo que ve el usuario y lo observado con Playwright MCP).
