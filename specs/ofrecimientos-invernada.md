# Plan QA - Ofrecimientos de invernada legacy

## Estado

Exploración completada el 03/09/2026 en `https://stage.dcac.ar/`; plan
revisable, pendiente de aprobación humana. No se generaron specs ni se
ejecutó Cypress.

## Charter

Investigar acceso, datos maestros, validaciones, dependencias por categoría y
ramas de servicio del formulario legacy. Riesgos principales: pérdida o
transformación de datos (Critical), bloqueo por obligatorios (High), altas
inconsistentes (High) y divergencias por categoría (High).

## Casos de prueba

### TC-INV-001 — Acceso y entidades existentes

- Tipo/prioridad: positive / High.
- Pasos: abrir `Cotizar`, elegir `Cotizar lote para Invernada / Cría`,
  seleccionar sociedad y establecimiento existentes y observar provincia y
  partido.
- Esperado observado: carga `Publicar una tropa de Invernada`, se habilita el
  establecimiento y se muestran ubicación y partido.
- Automatizable: sí.

### TC-INV-002 — Validación del formulario vacío

- Tipo/prioridad: validation / High.
- Pasos: seleccionar categoría y presionar `Ofrecer Tropa` sin completar.
- Esperado observado: aparecen mensajes para Cantidad, Raza y Plazo de venta;
  el formulario permanece visible.
- Automatizable: sí, `.btn_ofrecer.env` y mensajes visibles.

### TC-INV-003 — Categorías simples y mixtas

- Tipo/prioridad: positive + regression / High.
- Categorías: Terneros, Terneras, Novillitos, MEJ, Toros, Terneros y terneras
  y Novillitos y vaquillonas.
- Esperado: cada selección muestra controles observados; las mixtas muestran
  `in_cantidad_machos` e `in_cantidad_hembras`; Toros muestra origen de toros
  y aptitud para vaquillonas.
- Automatizable: sí para presencia y dependencias; carga positiva pendiente.

### TC-INV-004 — Categorías con cría

- Tipo/prioridad: positive / High.
- Categorías: Vacas con cría, Vacas CUT con cría y Vaquillonas con cría.
- Esperado: se muestran Tipo de Rodeo y datos de cría, incluyendo edad y peso
  promedio; no asumir obligatoriedad no observada.
- Automatizable: sí para presencia; datos positivos pendientes.

### TC-INV-005 — Categorías preñadas y servicio

- Tipo/prioridad: positive / High.
- Categorías: Vacas preñadas, Vacas CUT preñadas y Vaquillonas preñadas.
- Pasos: recorrer Inseminación, Servicio Natural e Inseminación + repaso.
- Esperado observado: Servicio Natural muestra Inicio/Fin, Raza de servicio y
  Origen de los toros; repaso muestra Inicio/Fin del repaso. Las reglas de
  fechas y obligatoriedad quedan abiertas.
- Automatizable: sí para presencia; contenido pendiente por OQ-010/OQ-012/
  OQ-033/OQ-037.

### TC-INV-006 — Zona y dependencias

- Tipo/prioridad: positive / Medium.
- Pasos: seleccionar Limpia, Lucha y Sucia.
- Esperado observado: Lucha y Sucia muestran Garrapata y Mio-Mio.
- Automatizable: sí.

### TC-INV-007 — Altas nuevas y cancelación

- Tipo/prioridad: validation / High.
- Pasos: elegir `+ Nueva Sociedad` y `+ Nuevo Establecimiento`, observar
  diálogos y cancelar sin guardar.
- Esperado observado: sociedad expone Razón Social/CUIT; establecimiento
  expone nombre/provincia/partido; cancelar cierra sin crear datos.
- Automatizable: sí para apertura/cancelación.

### TC-INV-008 — Guardar nueva sociedad y verla en el listado

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: cliente autenticado y autorización para crear una sociedad
  de prueba aislada.
- Pasos: elegir `+ Nueva Sociedad`; completar Razón Social y CUIT con datos
  generados dinámicamente; presionar `Guardar`; cerrar el diálogo si no se
  cierra automáticamente; abrir el listado de `#sociedad_select`.
- Esperado: la sociedad se guarda y aparece como una opción del listado de
  sociedades, identificable por la Razón Social generada; debe poder quedar
  seleccionada para continuar el ofrecimiento.
- Automatizable: sí, con `#modal_crear`, `#razonsocial`, `#cuit`, botones
  `Guardar`/`Aceptar` y `#sociedad_select`. El criterio de éxito es la
  aparición como opción; no usar IDs ni nombres persistidos. La ejecución
  confirmó que `Guardar` abre una confirmación de datos y `Aceptar` completa
  el alta; la UI puede normalizar mayúsculas del nombre.

### TC-INV-009 — Guardar nuevo establecimiento y verlo en el listado

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: cliente autenticado, sociedad existente seleccionada y
  autorización para crear un establecimiento de prueba aislado.
- Pasos: seleccionar `+ Nuevo Establecimiento`; completar nombre, provincia,
  partido y cualquier campo que la UI marque obligatorio; presionar `Guardar`;
  abrir el listado de `#estab_soc`.
- Esperado: el establecimiento se guarda y aparece como una opción del
  listado asociado a la sociedad seleccionada, identificable por el nombre
  generado; debe poder seleccionarse y reflejar su provincia/partido.
- Automatizable: sí, con `#modal-establecimiento-edit`, controles observados
  del diálogo, botón `Guardar` y `#estab_soc`. El criterio de éxito es la
  aparición como opción; no usar IDs ni nombres persistidos. La ejecución
  confirmó la selección de provincia/partido dependientes antes de guardar.

### TC-INV-010 — Envío y Pendientes de publicación

- Tipo/prioridad: positive + data-integrity / Critical.
- Precondiciones: perfil por categoría autorizado y permiso para crear lote
  aislado.
- Esperado: confirmar número de lote, ver la tropa en `Mis operaciones` →
  `Invernada` → `Venta` → `Pendientes de publicación` y conservar datos.
- Automatizable: candidato; no ejecutado por falta de datos autorizados.

## Automation Handoff

Use Page Objects para `#sociedad_select`, `#estab_soc`, `#categoriasSelect`,
`#plazo_select`, `.btn_ofrecer.env`, `#modal_crear`,
`#modal-establecimiento-edit`, `#razonsocial`, `#cuit` y controles por
`name`; mantener selectores fuera de specs. Reusar
`cypress/pages/MainClientPage.js` y `cypress/support/helpers/login_helper.js`;
crear/extender un POM de Invernada legacy y specs bajo
`cypress/e2e/ofrecimientos-invernada/` tras aprobación.

Data: credenciales desde `Cypress.env`; sociedad, establecimiento y lote
dinámicos; sin IDs persistidos, datos reales, APIs privadas ni base de datos.

Unsupported/pending: envío positivo, integridad Admin, límites numéricos,
fechas de servicio, video, distancia y reglas ambiguas OQ-005, OQ-006,
OQ-010, OQ-012, OQ-014, OQ-022, OQ-030, OQ-032, OQ-033, OQ-034, OQ-035,
OQ-036 y OQ-037. TC-INV-008 y TC-INV-009 requieren datos autorizados y
deben verificar explícitamente la aparición en el listado antes de considerarse
exitosos.

## Evidencia

- [Captura de exploración](../artifacts/ofrecimientos-invernada-legacy-exploration.png)
- Snapshots y consola en `.playwright-mcp/`.
- Navegador cerrado correctamente.

## Coverage ledger

| Include ID | Cobertura | Estado | Motivo si no automatizable |
| --- | --- | --- | --- |
| INV-SCOPE-001 | TC-INV-001 | automatizado | — |
| INV-SCOPE-002 | TC-INV-001, TC-INV-007, TC-INV-008, TC-INV-009 | automatizado | — |
| INV-SCOPE-003 | TC-INV-002, TC-INV-010 | parcial | envío positivo pendiente de datos autorizados |
| INV-SCOPE-004 | TC-INV-003, TC-INV-004, TC-INV-005 | automatizado para presencia | carga positiva pendiente |
| INV-SCOPE-005 | TC-INV-002, TC-INV-006 | automatizado para reglas observadas | límites y reglas abiertas pendientes |
| INV-SCOPE-006 | TC-INV-010 | candidato | missing_authorized_data |
| INV-SCOPE-007 | TC-INV-011 | no automatizable | missing_observed_selector |

## Implementación posterior a aprobación

Se agregó cobertura Cypress data-driven para categorías y dependencias
dinámicas en `cypress/e2e/ofrecimientos-invernada/ofrecimientos-invernada.cy.js`.
La ejecución contra Stage generó evidencia de fallos iniciales de selector y
fue detenida para ajustar la implementación. El envío positivo y la
validación del legajo Admin siguen sin automatizarse: requieren una tropa
creada con datos autorizados y un selector de `Ver legajo` observado en Stage.
