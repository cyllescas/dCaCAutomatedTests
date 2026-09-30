# Plan QA — Edición del usuario comprador en legajo de Invernada

## Estado

`APPROVED` — aprobado por el usuario; automatización ejecutada el 2026-09-25.

## Feature y trazabilidad

- Config: `config/legajo-invernada-comprador.yaml`
- SUT: `https://stage.dcac.ar/`
- Rol: Admin autenticado mediante `USER_ADMIN` y `PASSWORD` desde configuración local.
- Fecha/ambiente: 2026-09-25, Stage.
- Casos: `INV-COMP-001` a `INV-COMP-004`.

## Charte de exploración

Misión: verificar la navegación Admin → Invernada → Vendidas, apertura de un legajo elegible y consistencia observable de la sección Información Comprador al editar, cancelar y guardar, sin volver a ingresar al legajo.

Riesgos principales: pérdida o sustitución del usuario comprador, persistencia incorrecta, opción Sin definir no guardable, sección ausente después de editar y destino incorrecto del botón de información.

## Observaciones y hallazgos

- La autenticación administrativa funcionó. La spec existente de login pasó 7/7.
- El menú Invernada expone Vendidas y la pantalla mostró tropas vendidas y enlaces Ver Legajo observables.
- El legajo mantiene visible Información Comprador y ofrece Editar.
- En edición, el selector custom muestra Sin definir y usuarios compradores observables; Guardar y Anular edición están disponibles.
- Anular edición presenta el diálogo `¿Eliminar los cambios realizados?` con Aceptar y Cancelar.
- El botón de información del usuario lleva al perfil administrativo `PAG=USUARIO`; el destino mostró encabezado Usuario y el usuario seleccionado.
- En una edición controlada, un usuario elegible quedó seleccionado al reabrir el formulario, pero la vista de solo lectura mostró `No disponible`. Esto contradice la expectativa de visibilidad del usuario y queda como `needs_investigation`/potencial defecto, con evidencia en `legajo-invernada-comprador-after-save.yml` y `legajo-invernada-comprador-reopen-after-save.yml`. El estado se restauró luego a Sin definir.
- Se observaron errores y warnings de consola durante la navegación protegida. No se clasifican como defecto del flujo sin separar recursos del ambiente y errores asociados a la edición.

## Casos de prueba

### INV-COMP-001 — Editar y guardar un usuario comprador

- Tipo: positive; prioridad: alta.
- Precondiciones: Admin autenticado; listado Vendidas disponible; resolver dinámicamente la primera tropa elegible; disponer de un usuario comprador elegible.
- Pasos: abrir Vendidas; abrir Ver Legajo; editar Información Comprador; abrir selector; elegir usuario elegible; guardar; validar la vista de solo lectura del mismo legajo.
- Esperado: la sección permanece visible y el usuario elegido coincide con el usuario mostrado inmediatamente después de guardar; no hay error visible asociado.
- Estado exploratorio: `needs_investigation` por discrepancia observada entre selección persistida y lectura `No disponible`.

### INV-COMP-002 — Guardar Sin definir

- Tipo: validation; prioridad: alta.
- Pasos: editar; seleccionar Sin definir; guardar; validar la vista de solo lectura del mismo legajo.
- Esperado: la selección sin asignar impacta inmediatamente; la sección permanece y no se muestra el valor anterior.
- Automatizable después de aprobación: sí, con datos dinámicos.

### INV-COMP-003 — Navegar desde información del usuario

- Tipo: navigation; prioridad: media.
- Pasos: abrir legajo con usuario asignado; activar el control de información junto al usuario.
- Esperado: destino observable `PAG=USUARIO`, encabezado Usuario o identificador visible; sin pantalla en blanco.
- Automatizable después de aprobación: sí.

### INV-COMP-004 — Integridad al cancelar y guardar

- Tipo: negative/data-integrity; prioridad: alta.
- Pasos: abrir/cerrar edición; cambiar selección y cancelar mediante el diálogo; volver a editar la sección en el mismo legajo; luego guardar una selección válida.
- Esperado: cancelar no persiste; guardar sí persiste; sección disponible en todos los estados.
- Automatizable después de aprobación: sí, con restauración final a Sin definir.

## Field inventory

| Campo/control | Estado observado | Caso | Candidato |
|---|---|---|---|
| Selector de usuario comprador custom | Sin definir, lista de usuarios | 001, 002, 004 | automatable |
| Opción Sin definir | observable en lista | 002, 004 | automatable |
| Editar Información Comprador | enlace observable | 001–004 | automatable |
| Guardar | enlace observable | 001, 002, 004 | automatable |
| Anular edición | enlace observable | 004 | automatable |
| Confirmación de cancelación | Aceptar/Cancelar | 004 | automatable |
| Información junto a usuario | enlace observable | 003 | automatable |

## Validation matrix

| Acción | Entrada | Resultado esperado | Resultado explorado |
|---|---|---|---|
| Abrir edición | sin cambios | sección editable | observado |
| Seleccionar Sin definir | opción observable | valor seleccionable | observado |
| Seleccionar usuario | opción elegible dinámica | valor seleccionable | observado |
| Guardar | selección válida | persistencia visible | discrepancia a investigar |
| Cancelar | cambio sin guardar | confirmación y no persistencia | diálogo observado |

## Dependency matrix

| Dependencia | Impacto |
|---|---|
| Credenciales Admin | bloquea todo el flujo protegido |
| Tropa en Vendidas o posterior | necesaria para Ver Legajo |
| Usuario comprador elegible | necesaria para caso positivo |
| Sin definir | necesaria para validación y restauración |
| Perfil de usuario accesible | necesaria para navegación |

## Combination matrix

| Estado inicial | Acción | Selección | Reapertura | Caso |
|---|---|---|---|---|
| usuario asignado | editar/guardar | usuario elegible | sí | 001 |
| usuario asignado o definido | editar/guardar | Sin definir | sí | 002 |
| usuario asignado | información | n/a | destino perfil | 003 |
| cualquier valor | editar/cancelar | usuario distinto | sí | 004 |

## Selector inventory observed

- Login: `#maillog`, `#password`, `#ingresar_login`.
- Menú: role button `INVERNADA`.
- Estado: link text `Vendidas`, href observado `?vendidas_invernada&secc=i&tit=2`.
- Legajo: role link `Ver Legajo`; la exploración observó múltiples coincidencias y debe resolverse dinámicamente.
- Sección: contenedor observado `#loader_comprador`; link `Editar` dentro de la sección.
- Selector custom: `#sociedades_select_chosen`; opciones observadas como elementos `li`; `Sin definir` es una opción.
- Guardado/cancelación: role link `Guardar`, role link `Anular edición`; diálogo con botones `Aceptar` y `Cancelar`.
- Información de usuario: control observado `#sociedad_usuario_info`; href de destino con patrón `?u&cliente=<dynamic>`.
- Destino: URL observada con patrón `?pag=usuario&profile&cliente=<dynamic>&usuario`, encabezado `Usuario`.

No se usaron selectores no observados ni identificadores fijos de tropa/usuario.

## Evidence index

- [Admin después de login](../artifacts/legajo-invernada-comprador-admin-after-login.yml)
- [Menú Invernada](../artifacts/legajo-invernada-comprador-invernada-menu.yml)
- [Listado Vendidas cargado](../artifacts/legajo-invernada-comprador-vendidas-loaded.yml)
- [Legajo y sección comprador](../artifacts/legajo-invernada-comprador-legajo.yml)
- [Selector de usuario](../artifacts/legajo-invernada-comprador-user-selector-open2.yml)
- [Destino del usuario](../artifacts/legajo-invernada-comprador-user-destination.yml)
- [Persistencia después de guardar](../artifacts/legajo-invernada-comprador-reopen-after-save.yml)
- [Consola Playwright](../.playwright-mcp/console-2026-09-25T16-31-38-347Z.log)

## Coverage ledger

| Include de config | Cobertura | Estado |
|---|---|---|
| Admin: Invernada → Vendidas en adelante | navegación explorada | automatable |
| Apertura de legajo elegible | Ver Legajo observado | automatable |
| Información del comprador | sección y edición observadas | automatable |
| Edición y guardado | ejecutado exploratoriamente; discrepancia | automatable con análisis |
| Sin definir | observado y restaurado | automatable |
| Botón de información | destino observado | automatable |
| Persistencia visible tras guardar | lectura inmediata observada; debe coincidir con la selección | automatable con análisis |
| Ausencia de errores | consola con errores existentes | needs_investigation |

Casos no automatizables: ninguno por falta de selector. La atribución de errores de consola queda pendiente de análisis.

## Automation Handoff

Use the existing Cypress login helper and Page Objects. Keep selectors and UI mechanics in the Page Object; keep business intent and assertions in the spec. Resolve the first eligible `Ver Legajo` dynamically and never hardcode lot, user, company, or credential identifiers. After `Guardar`, assert the selected buyer against the read-only value in the same open legajo and assert that `Información Comprador` remains visible; do not reload or reopen the legajo for these cases. Reuse `#loader_comprador`, `#sociedades_select_chosen`, the observed custom `li` options, `Guardar`, `Anular edición`, confirmation buttons, and `#sociedad_usuario_info` only as observed. Generate one independent Cypress test per approved case with titles containing `INV-COMP-001` through `INV-COMP-004`. Capture screenshots/videos/reports under `artifacts/`. Do not run the generator until this plan is approved exactly as `approved` or `aprobado`.

## Approval gate

Human approval required before generator and Cypress feature execution: reply exactly `approved` or `aprobado`.
