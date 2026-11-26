# Plan de pruebas — Representante: navegación del rol y selección en cascada (ofrecimientos-representante-core)

- Ambiente: https://stage.dcac.ar/ · Rol explorado: Representante (USER_AGENT) · Fecha de exploración: 2026-11-25
- Contrato: `config/ofrecimientos-representante-core.yaml` · Estado: **aprobado (revisión humana 2026-11-26)**
- Fuentes: exploración black-box con Playwright MCP, `knowledge/` (MAP-LOGIN-001/002, OQ-040, BR-USR-011..016, FL-SOC-003, FL-FAE-001, FL-INV-001, exploraciones previas de Faena e Invernada legacy) y `knowledge/representante-exploration.md`.
- La comparación Representante vs Cliente usa evidencia ya observada del Cliente (MAP-LOGIN-001, `MainClientPage`, `knowledge/ofrecimientos-faena-exploration.md`, `knowledge/ofrecimientos-invernada-exploration.md`). En esta sesión no se pudo cambiar al rol Cliente.
- No se registran nombres reales, IDs, credenciales ni URLs con tokens.

## 1. Charter

Confirmar que el Representante ve las secciones propias de su rol (Clientes, acceso a deCampoPagos/DCP) frente al Cliente. Confirmar también que en los formularios legacy de Faena e Invernada el selector Cliente → Sociedad → Establecimiento lista las sociedades del cliente elegido y, al elegir una sociedad, sus establecimientos, y que mantiene la integridad al cambiar de cliente.

Fuera de alcance: envío real de tropas, alta de clientes/sociedades/establecimientos, Faena React, flujos internos de DCP, correos, Matomo y app móvil.

## 2. Supuestos y estado inicial

- Cada caso parte de una sesión nueva del Representante (`loginWithSession` con USER_AGENT/PASSWORD) y navegación desde `/__dcac/`.
- Los clientes, sociedades y establecimientos se descubren en runtime. Ningún caso depende de un nombre o ID fijo.
- Ningún caso envía un ofrecimiento válido. Los envíos vacíos quedan bloqueados por la validación del front (no se observó POST `crearLote`).

## 3. Field inventory

| Pantalla | Campo/control | Selector | Tipo | Estado inicial observado |
|---|---|---|---|---|
| Header | Clientes | `a[href="/__dcac/misClientes"]` | link | visible (sólo Representante, MAP-LOGIN-002) |
| Header | Comprar / Cotizar | `#btn_comprar` / `#btn_vender` | link | visibles |
| Header | DCP (deCampoPagos) | `#btn_pagar` | link con logo `logo_dcp.svg`, sin texto, misma pestaña, origen `https://react-stage.dcac.ar`, ruta `/inicio` | visible |
| Header | DCP REACT | `a[href*="react-stage.dcac.ar"]` con texto `DCP REACT` | link | visible (contradice MAP-LOGIN-002, OQ-072) |
| Header | Performance | `a[href="/__dcac/misPublicaciones/Resultados_rep"]` | ítem del submenú Operaciones | oculto hasta hover |
| Header | Menú de usuario | `#div_log_out`, `a.a_perfil_pop` (Ver perfil, Salir) | menú | visible |
| Clientes | Título | `.span_titulo_clientes` | texto `Clientes` | visible |
| Clientes | Búsqueda | `#buscar_string` + `button.btn_buscar` | input + botón | vacío |
| Clientes | Filas | `.listado_p > .fila_listado` (`.clientes`, `.sociedades`, `.estableciemientos`) | listado | ≥1 fila |
| Clientes | Ver Perfil | `.fila_listado a.btn.btn-live` (texto `Ver Perfil`) | link | 1 por fila |
| Perfil cliente | Mis Sociedades / Volver | `a[href^="/__dcac/perfil/MisSociedades/"]`, `a[href="/__dcac/misClientes"]` | links | visibles |
| Faena | Cliente | `#send-pasos #idClienteRepresentante` (`ng_usuario`) | select | `Seleccionar` (value "") + N clientes |
| Faena | + Nuevo cliente | `#send-pasos .agr_cliente` | botón | visible (no se usa) |
| Faena | Sociedad | `#sociedad_select` (`ng_sociedad_vendedora`) | select | habilitado; `No hay sociedades disponibles` + `+ Nueva Sociedad` (`crear`) |
| Faena | Establecimiento | `#estab` (`ng_establecimiento`) | select | oculto; `Seleccione..` (0) |
| Invernada | Cliente | `#send-pasos-inv #idClienteRepresentante` (`re_usuario`) | select | `Seleccionar` + N clientes |
| Invernada | + Nuevo Cliente | `#send-pasos-inv .agr_cliente` | botón | visible (no se usa) |
| Invernada | Sociedad | `#sociedad_select` (`re_sociedad_vendedora`) | select | `Seleccionar una sociedad` + `+ Nueva Sociedad` |
| Invernada | Establecimiento | `#estab_soc` (`re_establecimiento`) | select | oculto, sin opciones |
| Invernada | Provincia/Partido | `#_provincia`, `#_partido` | texto | vacío |

## 4. Validation matrix

| Formulario | Acción | Mensajes observados (`.alert_input_faltante`) | Cliente requerido |
|---|---|---|---|
| Faena | "Ofrecer tropa" con todo vacío | Sociedad, Establecimiento, Tipo de Jaula, Categoría, Terminación, Destino, Raza, Peso, Disponibilidad de Carga | No se muestra mensaje (OQ-075) |
| Invernada | "Ofrecer tropa" con todo vacío | Sociedad, Establecimiento, Cantidad, Categoria, Raza, Plazo de venta | No se muestra mensaje (OQ-075) |
| Clientes | Búsqueda sin coincidencias | 0 filas, sin mensaje de "sin resultados" | n/a |

## 5. Dependency matrix (Cliente → Sociedad → Establecimiento)

| Paso | Faena | Invernada |
|---|---|---|
| Sin cliente | Sociedad habilitada: `No hay sociedades disponibles` + `+ Nueva Sociedad`; `#estab` oculto | Sociedad: `Seleccionar una sociedad` + `+ Nueva Sociedad`; `#estab_soc` oculto |
| Cliente con sociedades | <0,5 s: `Seleccionar una sociedad` + sociedades del cliente (coinciden con Clientes) + `+ Nueva Sociedad` | Igual |
| Cliente sin sociedades en el formulario | Sin cambios (respuesta `false`), aunque Clientes liste sociedades (OQ-073) | Igual |
| Sociedad elegida | `#estab` visible: `Seleccionar un establecimiento` + establecimientos + `+ Nuevo establecimiento`; etiquetas Provincia/Partido | ~2,5 s: `#estab_soc` visible: `Seleccionar un establecimiento` + establecimientos + `+ Nuevo Establecimiento` |
| Establecimiento elegido | Muestra Provincia/Partido (exploración previa del Cliente) | `#_provincia`/`#_partido` se completan (TC-INV-016 del Cliente) |
| Cambio de cliente | Sociedad vuelve a `No hay sociedades disponibles`; `#estab` queda visible con opciones previas (OQ-074) | Sociedad vuelve al placeholder; `#estab_soc` queda visible y vacío (OQ-074) |

## 6. Combination matrix

| Tipo de cliente (runtime) | Faena | Invernada | Estado |
|---|---|---|---|
| Cliente con ≥1 sociedad en el formulario y 0 establecimientos | TC-AGT-013/014/016 | TC-AGT-022/023/025 | automatable |
| Cliente con sociedad y ≥1 establecimiento en el formulario | TC-AGT-015 | TC-AGT-024 | missing_authorized_data (no existe en stage) |
| Cliente con sociedades en Clientes pero ninguna en el formulario | TC-AGT-019 | TC-AGT-028 | blocked_by_open_question (OQ-073) |
| Cliente → cambio a otro cliente | TC-AGT-016/017 | TC-AGT-025/026 | parcial (estab: OQ-074) |
| Sin cliente + envío vacío | TC-AGT-018 | TC-AGT-027 | automatable |

## 7. Casos de prueba

### AGT-07 — Navegación del Representante

**TC-AGT-001 — El header del Representante muestra los accesos propios del rol** (positive, navigation, permission · automatable)
1. Iniciar sesión como Representante y abrir `/__dcac/`.
2. Verificar que estén visibles `.top-banner`, `#div_log_out`, `#btn_comprar`, `#btn_vender`, `a[href="/__dcac/misClientes"]` (texto `Clientes`) y `#btn_pagar`.
- Esperado: todos visibles; la URL es `/__dcac/` y el título incluye `Inicio`. Falla si alguno no existe.

**TC-AGT-002 — Clientes abre el listado de clientes del Representante** (navigation, positive · automatable)
1. Desde la home, hacer clic en `Clientes`.
2. Verificar la URL `/__dcac/misClientes`, `.span_titulo_clientes` = `Clientes`, `#buscar_string` visible y al menos una `.listado_p > .fila_listado`.
3. Verificar que cada fila tenga `.clientes` no vacío, `.sociedades` y un enlace `Ver Perfil`.
- Falla si el listado está vacío (dato: el Representante debe tener clientes, precondición del contrato).

**TC-AGT-003 — Búsqueda de clientes sin coincidencias** (validation · automatable)
1. En Clientes, escribir un término aleatorio inexistente (p. ej. `zzqa-<timestamp>`) y presionar `Buscar`.
2. Verificar 0 filas `.fila_listado`.
3. Vaciar el campo y presionar `Buscar`: vuelve la cantidad inicial de filas.
- No se valida ningún mensaje de "sin resultados" (no existe; observación A9).

**TC-AGT-004 — Búsqueda parcial por nombre de cliente** (positive · automatable)
1. Leer en runtime el nombre de la primera fila y tomar sus primeros 4 caracteres.
2. Buscar ese término: todas las filas resultantes contienen el término (sin distinguir mayúsculas) y hay al menos 1.

**TC-AGT-005 — Ver Perfil de un cliente y volver al listado** (navigation · automatable)
1. En la primera fila, hacer clic en `Ver Perfil`: la URL empieza con `/__dcac/perfil/DatosPersonales/`.
2. Abrir `Mis Sociedades` (`a[href^="/__dcac/perfil/MisSociedades/"]`): la URL empieza con `/__dcac/perfil/MisSociedades/` y hay al menos un `a.btn_ver_sociedad`.
3. Hacer clic en `Volver al listado de clientes`: vuelve a `/__dcac/misClientes`.
- No usar `Nueva sociedad` (`#nueva_sociedad`).

**TC-AGT-006 — Acceso a deCampoPagos (DCP) desde el header** (permission, navigation · automatable)
1. En la home, verificar `#btn_pagar` visible.
2. Parsear su `href` sin registrarlo: el origen es `https://react-stage.dcac.ar` y la ruta `/inicio`; no tiene `target=_blank`.
- No hacer clic (los flujos de DCP están fuera de alcance). Nunca loguear el href (contiene tokens, TST-AGT-002).

**TC-AGT-007 — Presencia de `DCP REACT` para el Representante** (permission · blocked_by_open_question OQ-040/OQ-072)
- Hoy se observa visible, contra MAP-LOGIN-002. No se automatiza hasta definir el comportamiento esperado.

### AGT-07 — Conocimiento

**TC-AGT-010 — Corrección de BR-USR-013 (varios representantes por sociedad; "Sociedades en la que participa" sólo en DCP)** (manual_only, tarea de knowledge)
- No es observable en la UI explorada: la vista de usuarios de la sociedad no muestra representantes y DCP no se recorrió. Se documentó en `knowledge/users-and-permissions.md` (BR-USR-015, BR-USR-016; BR-USR-013 marcada como superada). No se automatiza.

### AGT-01 — Faena legacy

**TC-AGT-011 — El Representante ve el selector de Cliente con sus clientes** (positive, data-integrity · automatable)
1. Cotizar (`#btn_vender`) → `#btnGordo`. Verificar el título `Publicar una tropa de Gordo`.
2. Verificar `#idClienteRepresentante` visible, primera opción `Seleccionar` (value "") y `.agr_cliente` visible.
3. Comparar la cantidad y los nombres de las opciones reales con las filas de `/__dcac/misClientes` (normalizando espacios, comas y orden de palabras): deben coincidir.

**TC-AGT-012 — Estado inicial de Sociedad y Establecimiento sin cliente** (validation, dependency · automatable)
1. Abrir el formulario sin elegir cliente.
2. `#sociedad_select`: opciones `No hay sociedades disponibles` y `+ Nueva Sociedad` (`crear`), sin sociedades reales. `#estab` no visible.
- Que esté habilitado antes de elegir cliente es una observación (OQ-075); no se afirma habilitado ni deshabilitado.

**TC-AGT-013 — Elegir un cliente lista todas sus sociedades** (positive, data-integrity · automatable)
1. Recorrer las opciones de `#idClienteRepresentante` hasta encontrar una que cargue sociedades reales (espera de hasta 10 s por opción). Si ninguna carga, marcar el caso como pending/skip por datos (TST-AGT-001).
2. Verificar `Seleccionar una sociedad` como primera opción, las sociedades reales y `+ Nueva Sociedad`.
3. Comparar las sociedades con las de la fila del mismo cliente en `/__dcac/misClientes`: mismo conjunto y misma cantidad.

**TC-AGT-014 — Elegir una sociedad muestra el selector de establecimientos** (dependency · automatable)
1. Con el cliente de TC-AGT-013, elegir cada sociedad real.
2. `#estab` visible, con `Seleccionar un establecimiento` y `+ Nuevo establecimiento` (`crear`), más los establecimientos reales que existan (≥0).

**TC-AGT-015 — Los establecimientos de la sociedad se listan y muestran ubicación** (positive, data-integrity · missing_authorized_data)
- Requiere un cliente con sociedad con ≥1 establecimiento visible en el formulario; no existe en stage (TST-AGT-001).

**TC-AGT-016 — Cambiar de cliente reinicia la Sociedad** (data-integrity · automatable)
1. Elegir el cliente con sociedades y una sociedad.
2. Cambiar a otro cliente (o volver a `Seleccionar`).
3. `#sociedad_select` sin la sociedad previa: su valor no es ninguna sociedad del cliente anterior y ninguna de sus sociedades queda en la lista.

**TC-AGT-017 — Cambiar de cliente reinicia el Establecimiento** (data-integrity · blocked_by_open_question OQ-074)
- Hoy `#estab` queda visible con las opciones de la sociedad anterior. Posible defecto; no se automatiza hasta definir lo esperado.

**TC-AGT-018 — Envío vacío exige Sociedad y Establecimiento** (validation · automatable)
1. Abrir el formulario y hacer clic en `Ofrecer tropa` sin completar nada.
2. Verificar visibles `.required-ng_sociedad_vendedora` ("Debe completar el campo Sociedad") y `.required-ng_establecimiento` ("Debe completar el campo Establecimiento"). El formulario sigue en pantalla (`assertOfferFormStillShown`).
- La ausencia de mensaje para Cliente no se afirma (OQ-075).

**TC-AGT-019 — Clientes con sociedades en el listado y ninguna en el formulario** (data-integrity · blocked_by_open_question OQ-073)
- 5 de 6 clientes; posible defecto. Queda manual hasta aclarar si el formulario filtra por la asociación con el representante.

### AGT-01 — Invernada legacy

**TC-AGT-020 — Selector de Cliente en Invernada** (positive, data-integrity · automatable)
- Igual que TC-AGT-011, vía `#btnInvernada`: título `Publicar una tropa de Invernada`, `#send-pasos-inv #idClienteRepresentante`, `.agr_cliente` ("+ Nuevo Cliente"), opciones = clientes de `/__dcac/misClientes`.

**TC-AGT-021 — Estado inicial sin cliente** (validation, dependency · automatable)
- `#sociedad_select` con `Seleccionar una sociedad` + `+ Nueva Sociedad` y sin sociedades reales; `#estab_soc` no visible.

**TC-AGT-022 — Elegir un cliente lista todas sus sociedades** (positive, data-integrity · automatable)
- Igual que TC-AGT-013 en el formulario de Invernada.

**TC-AGT-023 — Elegir una sociedad muestra los establecimientos** (dependency · automatable)
- `#estab_soc` visible con `Seleccionar un establecimiento` (value "") y `+ Nuevo Establecimiento` (`crear`), más los reales (≥0). Reusar `waitForEstablishmentOptions` sólo si hay reales.

**TC-AGT-024 — Establecimiento elegido autocompleta Provincia/Partido** (positive · missing_authorized_data)
- Mismo faltante de datos que TC-AGT-015. Reusar `assertLocationAutofilled` cuando exista el dato.

**TC-AGT-025 — Cambiar de cliente reinicia la Sociedad** (data-integrity · automatable)
- Igual que TC-AGT-016: tras cambiar de cliente, `#sociedad_select` sólo tiene el placeholder y `crear`.

**TC-AGT-026 — Cambiar de cliente reinicia el Establecimiento** (data-integrity · blocked_by_open_question OQ-074)
- Hoy `#estab_soc` queda visible y sin opciones.

**TC-AGT-027 — Envío vacío del Representante** (validation · automatable)
1. Hacer clic en `.btn_ofrecer.env` sin completar nada.
2. Verificar visibles los mensajes `.required-re_sociedad_vendedora`, `.required-re_establecimiento`, `.required-re_cantidad`, `.required-re_categoria`, `.required-in_plazo_select` y el de Raza ("Debe completar el campo Raza"). El formulario sigue en pantalla.

**TC-AGT-028 — Clientes sin sociedades en el formulario de Invernada** (data-integrity · blocked_by_open_question OQ-073)

## 8. Coverage ledger

| Item / candidato | Casos | Estado |
|---|---|---|
| AGT-07 navegación Representante | TC-AGT-001..006 | automatable |
| AGT-07 `DCP REACT` | TC-AGT-007 | blocked_by_open_question (OQ-040/072) |
| AGT-07 comparación con Cliente (ex TC-AGT-008, 009) | — | out_of_scope (casos eliminados por revisión humana, 2026-11-26) |
| AGT-07 Performance (`Resultados_rep`) exclusivo | — | blocked_by_open_question (OQ-077) |
| AGT-07 flujos internos de DCP / "Sociedades en la que participa" | — | out_of_scope |
| AGT-07 impersonación desde Clientes | — | missing_observed_selector (no existe control visible) |
| AGT-07 knowledge BR-USR-013 | TC-AGT-010 | manual_only (tarea de knowledge) |
| AGT-01 Faena: cliente, estado inicial, sociedades, establecimientos, reinicio de sociedad, envío vacío | TC-AGT-011..014, 016, 018 | automatable |
| AGT-01 Faena: establecimientos reales y ubicación | TC-AGT-015 | missing_authorized_data |
| AGT-01 Faena: reinicio de establecimiento | TC-AGT-017 | blocked_by_open_question (OQ-074) |
| AGT-01 Faena: clientes sin sociedades en el formulario | TC-AGT-019 | blocked_by_open_question (OQ-073) |
| AGT-01 Invernada: equivalentes | TC-AGT-020..023, 025, 027 | automatable |
| AGT-01 Invernada: ubicación | TC-AGT-024 | missing_authorized_data |
| AGT-01 Invernada: reinicio de establecimiento | TC-AGT-026 | blocked_by_open_question (OQ-074) |
| AGT-01 Invernada: clientes sin sociedades | TC-AGT-028 | blocked_by_open_question (OQ-073) |
| Altas de cliente/sociedad/establecimiento, envío real, Faena React | — | out_of_scope |

## 9. Evidence index

Carpeta: `artifacts/exploration/ofrecimientos-representante-core/` (ignorada por git; puede contener nombres reales, no versionar).

- `ofrecimientos-representante-core-01-agent-home-header.png`: header del Representante (Clientes, DCP, DCP REACT).
- `ofrecimientos-representante-core-02-faena-initial.png`: Faena sin cliente.
- `ofrecimientos-representante-core-03-faena-after-client-reset.png`: Faena tras cambiar de cliente (`#estab` con opciones previas).
- `ofrecimientos-representante-core-04-invernada-initial.png`: Invernada sin cliente.
- `ofrecimientos-representante-core-05-invernada-after-client-reset.png`: Invernada tras cambiar de cliente (`#estab_soc` vacío).
- Snapshots y consola del MCP: `.playwright-mcp/page-2026-11-25T18-*.yml`, `.playwright-mcp/console-2026-11-25T18-02-38-949Z.log` (contienen URLs con tokens: no copiar).

## 10. Riesgos

- Datos de stage: hoy un solo cliente carga sociedades en el formulario y ninguna sociedad tiene establecimientos. Si cambian los datos, los casos de runtime pueden quedar en skip.
- La carga asíncrona de sociedades/establecimientos (0,5–2,5 s; en Faena se observaron ~2 s antes) exige esperas por condición, nunca `cy.wait` fijo.
- Los hrefs de DCP llevan tokens: riesgo de filtrarlos en logs o reportes de Cypress.
- `#idClienteRepresentante` se repite en ambos formularios: hay que acotarlo por formulario.

## 11. Hallazgos y preguntas abiertas

| # | Hallazgo | Clasificación | Referencia |
|---|---|---|---|
| A1 | `DCP REACT` visible para el Representante, contra MAP-LOGIN-002 | needs_investigation | OQ-072 |
| A2 | 5 de 6 clientes listan sociedades en Clientes pero ninguna en los formularios | potential_defect / needs_investigation | OQ-073 |
| A3 | Nombres de sociedad vacíos en algunas filas de Clientes | needs_investigation | OQ-076 |
| A4 | Faena: al cambiar de cliente `#estab` conserva opciones previas | potential_defect | OQ-074 |
| A5 | Invernada: al cambiar de cliente `#estab_soc` queda visible y vacío | observation | OQ-074 |
| A6 | Sociedad habilitada con `+ Nueva Sociedad` antes de elegir cliente | observation / needs_investigation | OQ-075 |
| A7 | Cliente no figura como requerido en el envío vacío | needs_investigation | OQ-075 |
| A8 | Invernada como Representante exige Sociedad y Establecimiento | observation | VAL-AGT-002 |
| A9 | Búsqueda sin coincidencias sin mensaje | observation | — |
| A10 | Diferencias de redacción entre formularios | observation | — |
| A11 | El pageview de GA envía el nombre del usuario como `uid` | needs_investigation (privacidad) | OQ-078 |

Preguntas: OQ-040, OQ-072 a OQ-078 en `knowledge/open-questions.md`.

## Automation Handoff

**Target specs** (functional area `ofrecimientos-representante`, tags `@representante @agent @regression`):
- `cypress/e2e/ofrecimientos-representante/representante-navegacion.cy.js`: TC-AGT-001..006
- `cypress/e2e/ofrecimientos-representante/representante-cascada-faena.cy.js`: TC-AGT-011..014, 016, 018
- `cypress/e2e/ofrecimientos-representante/representante-cascada-invernada.cy.js`: TC-AGT-020..023, 025, 027
- Not automated: TC-AGT-007, 010, 015, 017, 019, 024, 026, 028 (see ledger).
- TC-AGT-008 and TC-AGT-009 (Cliente-role comparison) were removed during human review (2026-11-26); IDs are retired, not reused.

**Observed selectors and POM ownership** (all observed 2026-11-25; no duplicates):
- `MainAgentPage` (existing: `#top`, `.top-banner`, `#div_log_out`, `a[href="/__dcac/misClientes"]`, `#new_wraper`).
  - Add: `.menu_logueado`, `#btn_comprar`, `#btn_pagar` (DCP), `a[href="/__dcac/misPublicaciones/Resultados_rep"]`, `a.a_perfil_pop`.
  - Clients page: `.span_titulo_clientes`, `#buscar_string`, `button.btn_buscar`, `.listado_p > .fila_listado`, `.fila_listado .clientes`, `.fila_listado .sociedades table tr` (skip header; name in first `td`), `.fila_listado .estableciemientos`, `a.btn.btn-live` contains `Ver Perfil`, `a[href^="/__dcac/perfil/MisSociedades/"]`, `a.btn_ver_sociedad`, `a[href="/__dcac/misClientes"]` contains `Volver al listado de clientes`.
  - Split into a new `AgentClientsPage.js` only if MainAgentPage grows too much; never duplicate.
- `MainClientPage.mainCotizarButton()` (`#btn_vender`): reuse for the Representante (same header).
- `OfferPage`: `#btnGordo`, `#btnInvernada` (reuse).
- `FaenaOfferPage`:
  - Add `clientSelect()` = `#send-pasos #idClienteRepresentante`, `newClientButton()` = `#send-pasos .agr_cliente`, and required messages `.alert_input_faltante.required-ng_sociedad_vendedora` / `.required-ng_establecimiento`.
  - Reuse `#sociedad_select`, `#estab` / `select[name='ng_establecimiento']`, `submitOffer()`, `assertOfferFormStillShown()`, `assertRequiredMessage()`.
- `InvernadaOfferPage`:
  - Add `clientSelect()` = `#send-pasos-inv #idClienteRepresentante`, `newClientButton()` = `#send-pasos-inv .agr_cliente`, and `.alert_input_faltante.required-re_sociedad_vendedora` / `.required-re_establecimiento`.
  - Reuse `societySelect()`, `establishmentSelect()` (`#estab_soc`), `waitForSocietyOptions()`, `waitForEstablishmentOptions()`, `assertOptionTexts()`, `submitEmptyOffer()`, `assertQuantityRequired()`, `assertOfferFormStillShown()`.
- Literal option texts: `Seleccionar`, `No hay sociedades disponibles`, `Seleccionar una sociedad`, `+ Nueva Sociedad` (value `crear`), `Seleccionar un establecimiento`, `+ Nuevo establecimiento` (Faena) / `+ Nuevo Establecimiento` (Invernada), `Seleccione..` (value `0`). Put them in a data module (`cypress/support/data/representante_data.js`).

**Helpers to reuse / add**
- `loginWithSession(USER_AGENT, PASSWORD, 'agent')` and `verifyLoginSuccessAsAgent()` from `login_helper.js`. `credentialsFor` / `skipWhenCredentialsAreMissing` with keys `USER_AGENT` / `PASSWORD`.
- `openInvernadaOfferForm` / `INVERNADA_OFFER_PATH` from `invernada_offer_helper.js` (role-agnostic path). Faena path `/__dcac/venderHacienda?solicitud_directo&rapido`.
- New `cypress/support/helpers/representante_helper.js`:
  - `findClientWithSocieties(form)`: iterates client options, waits by condition up to 10 s each, yields the index and society texts, and skips the test if none is found.
  - `clientsFromList()`: reads `.fila_listado` names and sociedades.
  - `assertDcpLink()`: parses `#btn_pagar` href with `new URL()` and asserts origin + pathname only; never `cy.log` the href.

**Required data**
- Env vars USER_AGENT, PASSWORD.
- Clients, sociedades and establishments are discovered at runtime. No real names or IDs in specs or fixtures.
- Black box only: no `cy.request`. `cy.intercept` only passive (optional alias on `**/MODULOS/modulo_gruposociedades/index.php?clientesociendad=1*` purely for waiting, never asserting its body).

**Related specs**: `cypress/e2e/login/login-dcac.cy.js` (TC-LOGIN-003), `cypress/e2e/ofrecimientos-faena/*.cy.js`, `cypress/e2e/ofrecimientos-invernada/ofrecimientos-invernada-sociedad-establecimiento.cy.js` (TC-INV-013..016).

**Safety**: do not click `#btn_pagar`, `DCP REACT`, `.agr_cliente`, `+ Nueva Sociedad`, `+ Nuevo establecimiento`, `Crear Nuevo Cliente`, `Descargar Listado` or `#nueva_sociedad`. Only empty-form submissions are allowed.
