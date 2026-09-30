# Plan QA — Ofrecimientos de faena

## Estado

Plan actualizado después de exploración observable en `https://stage.dcac.ar/`,
el 03/09/2026. Estado: aprobado por el usuario (`aprobado`) y automatizado en
Cypress.

## Trazabilidad y objetivo

- Feature: `config/ofrecimientos-faena.yaml` / `ofrecimientos-faena`.
- FL-FAE-001: cliente o representante ofrece una tropa de faena.
- MAP-FAE-001: la tropa debe quedar en cliente `Pendientes de publicación` y
  admin `Ofrecimientos`.
- VAL-FAE-004 y preguntas OQ-014/OQ-015: distancia, flete y CSV permanecen
  sin regla completa; no se convierten en expectativas.

## Charter de exploración

**Misión:** investigar el recorrido cliente `Cotizar > Faena`, la selección o
alta de sociedad/establecimiento, validaciones visibles y la vista admin
`Faena > Ofrecimientos`, priorizando consistencia de datos y estados.

**Áreas:** navegación, formularios obligatorios, combinaciones de terminación,
destino y flete, límites de campos, altas de sociedad/establecimiento,
transición cliente-admin, permisos y solicitudes de red observables.

**Riesgos:** pérdida o transformación de datos del lote (Critical), bloqueo de
la publicación por validaciones o datos maestros (High), diferencias entre
estado cliente/admin (High), datos inválidos aceptados (High), carga del
listado admin (Medium).

**Heurísticas:** happy path, required fields, límites, combinaciones, repetición
de selección, navegación, recuperación ante validación y consistencia de
estado.

## Observaciones de exploración

- Cliente autenticado: `Cotizar` navega a `/__dcac/venderHacienda`; `Cotizar lote para Faena` navega a `?solicitud_directo&rapido`.
- La pantalla observada se titula `Publicar una tropa de Gordo`.
- Sociedad existente y establecimiento son comboboxes; al seleccionar una
  sociedad se cargan establecimientos y aparece `+ Nuevo establecimiento`.
- `+ Nuevo establecimiento` abre un diálogo con nombre, provincia, partido,
  motivo de compra, ubicación, superficie, explotación, propiedad y botón
  `Guardar`. Guardar vacío mostró `Debe completar el campo nombre`.
- `+ Nueva Sociedad` abre `Agregar nueva sociedad` con Razón Social y CUIT.
  Guardar vacío mostró Razón Social obligatoria y `CUIT` de 11 dígitos.
- Se observaron las opciones de terminación `A campo`, `Racionado` y
  `Feedlot`; destino `Consumo`, `Exportación Hilton`, `Exportación UE` y
  `Cuota 481`; flete `A retirar` y `Puesto en planta`.
- La vista admin `Faena > Ofrecimientos` fue accesible y mostró buscador,
  filtros de operador, columnas ID, fecha, sociedad vendedora, representante,
  categoría, peso, jaula, terminación, destino, establecimiento y operador,
  además de `Crear Lote`.
- En admin la grilla permaneció visible como `Cargando...` aunque la
  navegación y la solicitud observable del listado respondieron 200. Se
  clasifica inicialmente como `UNKNOWN` de ambiente/estado; no es defecto
  confirmado.
- El envío positivo creó correctamente una tropa y mostró `Su tropa ha sido
  creada correctamente`. La respuesta del POST observable de creación retornó
  un número de lote; el valor se mantuvo sólo en memoria de la exploración.
- Desde la confirmación, el enlace visible `operaciones` llevó a
  `/operacion/faena/venta` y la aplicación terminó mostrando
  `/operacion/faena/venta/pendiente-publicacion`.
- En pendientes apareció el ofrecimiento creado con los datos enviados y su
  número de lote. El menú lateral `Mis Operaciones > Faena` mostró un enlace
  distinto, `/operaciones/faena`, que respondió `ERROR 44 — ¡Esta página no
  existe!`; se registra como `UNKNOWN`/needs investigation, no como defecto
  confirmado.

## Casos de prueba

### TC-FAE-001 — Acceso al formulario de faena

- Tipo/prioridad: positive / Critical.
- Precondiciones: cliente vendedor dinámico autenticado; sociedad disponible.
- Pasos: abrir `Cotizar`; seleccionar `Cotizar lote para Faena`; observar el
  formulario y sus campos.
- Esperado: se muestra `Publicar una tropa de Gordo`, sociedad,
  establecimiento, jaula, categoría, terminación, destino, pesos,
  disponibilidad, condiciones comerciales y botón `Ofrecer tropa`.
- Automatizable: sí, selector observado.

### TC-FAE-002 — Selección de sociedad y establecimiento existentes

- Tipo/prioridad: positive / High.
- Precondiciones: cliente con sociedad y establecimiento existentes.
- Pasos: seleccionar sociedad; seleccionar establecimiento; revisar provincia
  y partido; recorrer las tres terminaciones, cuatro destinos y dos fletes.
- Esperado: se habilita establecimiento, se muestran datos de ubicación y cada
  opción seleccionada queda reflejada sin perder los demás campos.
- Automatizable: sí, selectores observados; datos deben resolverse dinámicamente.

### TC-FAE-003 — Validación de alta de establecimiento vacía

- Tipo/prioridad: validation / High.
- Pasos: seleccionar sociedad, elegir `+ Nuevo establecimiento` y guardar sin
  completar.
- Esperado observado: `Debe completar el campo nombre`; el diálogo permanece
  abierto y no se crea un registro.
- Automatizable: sí, selector y mensaje observados.

### TC-FAE-004 — Validación de alta de sociedad vacía

- Tipo/prioridad: validation / High.
- Pasos: elegir `+ Nueva Sociedad` y guardar sin completar.
- Esperado observado: se informa Razón Social obligatoria y CUIT de 11 dígitos;
  no se crea una sociedad.
- Automatizable: sí, selector y mensajes observados.

### TC-FAE-005 — Combinaciones y valores límite del formulario

- Tipo/prioridad: negative + boundary / High.
- Precondiciones: datos dinámicos autorizados; no crear datos compartidos sin
  aprobación.
- Pasos: probar campos vacíos, pesos mínimo/máximo/promedio, plazo,
  desbaste, fecha de carga y combinaciones simples/dobles, terminaciones,
  destinos y fletes.
- Esperado: registrar mensajes y límites realmente observados; para distancia,
  TP2/CSV y reglas no documentadas, dejar resultado como pregunta abierta.
- Automatizable: parcial; sólo casos con mensaje/selector observado. Los demás
  quedan no automatizables hasta confirmar la regla.

### TC-FAE-006 — Publicación cliente y estado pendiente

- Tipo/prioridad: positive + data-integrity / Critical.
- Precondiciones: sociedad/establecimiento válidos, datos dinámicos y permiso
  humano para crear un lote de prueba aislado.
- Pasos: instalar una captura de la solicitud POST observable que realiza la
  UI; completar una combinación válida; enviar `Ofrecer tropa`; extraer de la
  respuesta el número de lote; entrar a `Operaciones > Faena > Pendientes de
  publicación`; localizar el ofrecimiento creado.
- Esperado: el envío finaliza, la respuesta del POST informa el número de lote,
  el ofrecimiento aparece en pendientes y conserva los valores ingresados. El
  número de lote queda sólo en memoria de la prueba para los casos cliente y
  admin; no se fija un ID ni se consulta la API directamente.
- Automatizable: sí como flujo Cypress con `cy.intercept` de la solicitud de
  UI. Patrón observado: POST a `MODULOS/directo/modulo_crearLote/index.php`,
  cuya respuesta de éxito es el número de lote en texto; el valor debe
  conservarse sólo en memoria. La confirmación expone el enlace accesible
  `operaciones` y el resultado queda en la ruta pendiente observada.

### TC-FAE-007 — Integridad en admin Ofrecimientos y legajo

- Tipo/prioridad: data-integrity / Critical.
- Precondiciones: reutilizar en memoria el número de lote capturado por
  TC-FAE-006; admin dinámico autenticado.
- Pasos: abrir `FAENA > Ofrecimientos`; escribir el número de lote en `Buscar
  en el listado...`; esperar el resultado filtrado; presionar `Ver legajo` del
  ofrecimiento creado; comparar los datos del formulario con el legajo y el
  listado.
- Esperado: el número de lote identifica un único resultado; `Ver legajo` abre
  el legajo correcto; sociedad, establecimiento, categoría, peso, jaula,
  terminación y destino coinciden con lo enviado.
- Automatizable: parcial. El buscador y la pantalla están observados; falta
  observar el selector estable del resultado y del control `Ver legajo` durante
  una creación real. No usar el número de lote como fixture.

### TC-FAE-008 — Acceso por roles

- Tipo/prioridad: permission / High.
- Precondiciones: credenciales dinámicas de cliente y admin; no asumir CR ni
  permisos no documentados.
- Pasos: validar que cliente pueda iniciar el ofrecimiento; validar que admin
  pueda consultar Ofrecimientos; registrar cualquier acceso denegado visible.
- Esperado: cliente puede ofrecer según BR-USR-001/002 y admin ve la sección.
- Automatizable: sí para navegación básica; alcance CR queda no automatizable
  hasta resolver OQ-002/OQ-003.

### TC-FAE-009 — Crear sociedad nueva con datos dinámicos

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: cliente autenticado y permiso para crear datos de prueba
  aislados.
- Pasos: elegir `+ Nueva Sociedad`; generar en runtime una razón social única
  con prefijo de prueba y un CUIT de 11 dígitos; guardar; verificar que la
  sociedad creada quede seleccionada o figure entre las opciones del combobox;
  seleccionar la sociedad si no quedó seleccionada.
- Datos: no usar razón social, CUIT ni ID persistidos. El generador debe
  obtener una combinación de 11 dígitos en runtime; si Stage exige validación
  fiscal además de longitud, usar sólo una razón social/CUIT de prueba
  autorizados y configurados localmente, nunca hardcodeados en el repo.
- Esperado: guardar se considera exitoso únicamente si la sociedad creada
  queda seleccionada o aparece como una opción del combobox; luego puede ser
  seleccionada y queda asociada al ofrecimiento posterior.
- Automatizable: candidato, con selectores observados (`#modal_crear`,
  `#razonsocial`, `#cuit`, `Guardar`, `#sociedad_select`). La exploración del
  03/09 no confirmó el éxito: el lookup fiscal respondió 200 pero la sociedad
  no apareció y no se observó POST de guardado. Mantener `UNKNOWN` hasta
  repetir con datos válidos autorizados y observar la opción/selección final.

### TC-FAE-010 — Crear establecimiento nuevo para sociedad nueva

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: TC-FAE-009 exitoso; sociedad recién creada seleccionada.
- Pasos: elegir `+ Nuevo establecimiento`; generar nombre único en runtime;
  completar los campos observados necesarios (provincia, partido y cualquier
  campo obligatorio que Stage indique); guardar; seleccionar el
  establecimiento recién creado y verificar provincia/partido.
- Esperado: el establecimiento se guarda, aparece en el combobox de la
  sociedad nueva y sus datos se reflejan en el formulario de faena.
- Automatizable: candidato, con selectores observados (`#modal-establecimiento-edit`,
  `#Nombre`, `#Provincias`, `#Partido`, `#Locacion`, `#Superficie`,
  `#Explotacion`, `#Propio`, `#Alquilado`, `Guardar`). El flujo positivo aún
  requiere una creación exitosa para observar el selector del registro nuevo.

### TC-FAE-011 — Ver ofrecimiento creado en Pendientes de publicación

- Tipo/prioridad: positive + state-transition / Critical.
- Precondiciones: envío exitoso de un formulario de faena por el cliente;
  número de lote retornado por la respuesta del POST disponible en memoria.
- Pasos: abrir `Operaciones`; entrar a `Faena`; seleccionar `Pendientes de
  publicación`; buscar o identificar el ofrecimiento usando el número de lote
  retornado; abrirlo si la UI ofrece una acción de detalle.
- Esperado: el ofrecimiento creado aparece en `Pendientes de publicación`, el
  número coincide con el retornado por el POST y los datos visibles coinciden
  con el formulario enviado.
- Automatizable: sí para la ruta funcional observada. Selectores observados:
  enlace de confirmación `a` con nombre exacto `operaciones`, enlace lateral
  `a[href="/operacion/faena/venta"]`/`a[href="/operacion/faena/venta/pendiente-publicacion"]`,
  enlace `a[href="/operacion/faena/venta/pendiente-publicacion"]` con texto
  `Pendientes de publicación18`, y tarjetas que contienen el lote como texto
  `#<lote>` junto con sociedad, establecimiento, categoría, peso, terminación
  y destino. El número se debe obtener del POST, nunca hardcodear.

## Automation Handoff

### Observed selector inventory

- Login: `#maillog`, `#password`, botón `INGRESAR`.
- Cliente: `#btn_vender`; `#btnGordo`; `#sociedad_select`; `#estab`;
  `#simple`, `#doble`; `#a_campo`, `#racionado`, `#feedlot`; `#consumo`,
  `#hilton`, `#UE`, `#cuota`; `#apto_china_si`, `#apto_china_no`; `#fecha_I`;
  `#selPlanilla`; `#fileuploadVideo`; `#ng_id`.
- Cliente inputs por nombre: `ng_peso_min`, `ng_peso_max`, `ng_peso`,
  `ng_disp_carga`, `ng_condiciones_plazo_cotizacion`,
  `ng_condiciones_desbaste`, `ng_aclaracion`; botón/texto `Ofrecer tropa`.
- Establecimiento: `#modal-establecimiento-edit`, `#Nombre`, `#Provincias`,
  `#Partido`, `#Locacion`, `#Superficie`, `#Explotacion`, `#Propio`,
  `#Alquilado`, botón `Guardar`, botón `Close`.
- Sociedad: `#modal_crear`, `#razonsocial`, `#cuit`, botón `Guardar`, botón
  `Close`.
- Cliente navegación de operaciones: menú `Operaciones`, sección `Faena`, opción `Ventas`,
  estado `Pendientes de publicación` y resultado del ofrecimiento están
  observados para la ruta funcional singular `/operacion/faena/venta/pendiente-publicacion`.
  El enlace lateral alternativo `/operaciones/faena` queda documentado como
  `UNKNOWN` por 404.
- Admin: botón `FAENA`, link `Ofrecimientos`, link `Crear Lote`, textbox
  `Buscar en el listado...`; resultado de lote y control `Ver legajo` quedan
  pendientes de observación en una creación válida; columnas visibles
  descriptas en TC-FAE-007.

### POMs, helpers and related specs

- Reusar `cypress/pages/OfferPage.js` para `#btnGordo` y extenderlo sólo si
  hace falta un selector observado adicional.
- Reusar `cypress/pages/MainClientPage.js` y
  `cypress/support/helpers/login_helper.js` para sesión cliente/admin.
- Extender `cypress/pages/MainAdminPage.js` con el menú FAENA y Ofrecimientos;
  mantener selectores fuera de specs.
- Crear `cypress/pages/FaenaOfferPage.js` para formulario y diálogos; crear
  `cypress/e2e/ofrecimientos-faena/ofrecimientos-faena.cy.js` sólo después de
  aprobación.
- Relacionada: `cypress/e2e/login/login-dcac.cy.js` para el patrón de login.

### Data and unsupported items

- Credenciales sólo desde `Cypress.env`; no fixtures con credenciales, CUIT,
  nombres reales ni IDs.
- Sociedad/establecimiento/lote deben resolverse dinámicamente en configuración
  local autorizada y aislarse de pruebas concurrentes.
- No ejecutar todavía: comparación del registro admin específico, selector de
  `Ver legajo`, CSV de CI, TP2, distancia obligatoria y permisos CR; faltan
  selector/regla confirmada. El envío cliente y la navegación funcional a
  Pendientes de publicación ya fueron explorados. TC-FAE-009 y TC-FAE-010
  siguen pendientes por el alta positiva de sociedad/establecimiento; TC-FAE-011
  queda automatizable para la ruta funcional observada, pero no se ejecuta
  hasta aprobación. Todos los casos quedan trazados sin generar specs mientras
  el plan no esté aprobado.
- La prueba exploratoria de TC-FAE-009 usó datos temporales no persistidos en
  el repositorio. El lookup fiscal observable respondió, pero el modal no
  cerró ni agregó la sociedad; evidencia en
  `artifacts/ofrecimientos-faena-alta-sociedad-unknown.png`.
- La solicitud observable del listado admin fue `GET` a
  `MODULOS/listadosAdminNuevos/ajax/ofrecimientos_ajax.php`; se registra para
  diagnóstico de UI, no se usará como acceso directo ni como prueba contra API
  privada.

## Estado de automatizacion posterior a la ampliacion

La cobertura ejecutable ahora incluye el formulario vacio, las 24 combinaciones
de terminacion, destino y flete (3 x 4 x 2), y la busqueda admin por el numero
de lote capturado desde el POST observable. TC-FAE-009 y TC-FAE-010 dejan de ser
solo candidatos: su criterio de aceptacion es que la nueva sociedad o el nuevo
establecimiento aparezca en el desplegable o quede seleccionado automaticamente.

Siguen fuera de expectativas automatizadas los limites o reglas que no tienen
mensaje observable confirmado, CSV de CI, TP2, distancia obligatoria y permisos
CR.

## Evidencia

- [Validación de establecimiento](../artifacts/ofrecimientos-faena-establecimiento-validation.png)
- [Vista admin Ofrecimientos](../artifacts/ofrecimientos-faena-admin-ofrecimientos.png)
- [Pendientes de publicación](../artifacts/ofrecimientos-faena-pendientes-publicacion.png)
- Snapshots y consola Playwright en `.playwright-mcp/` del entorno local.

## Resultado de exploración

Exploración complementaria completada y navegador cerrado. La captura de lote
del POST, la búsqueda por número y `Ver legajo` quedan trazados en el diseño,
pero sus selectores de éxito todavía deben observarse con un ofrecimiento real.
La alta positiva de sociedad no quedó confirmada en Stage; por eso TC-FAE-009
y TC-FAE-010 son candidatos automatizables y no specs ejecutables todavía. No
se generaron specs ni se ejecutaron pruebas Cypress porque el plan no tiene
aprobación humana.
