# Plan de pruebas — Ofrecimientos de faena React

- Feature: `ofrecimientos-faena-react`
- Ambiente: `https://react-stage.dcac.ar/`
- Estado: REVISABLE — pendiente de aprobación humana antes de generar specs
- Trazabilidad: `config/ofrecimientos-faena-react.yaml`, `FL-FAE-001`

## Casos

### FAE-REACT-001 — Acceso al formulario
Tipo: positive. Prioridad: High.
1. Navegar a `/cotizar/faena`.
2. Esperar `Cotizar tropa para Faena`.
3. Seleccionar sociedad con `#society` y establecimiento con `#establishment`.
Resultado: el formulario queda visible y el establecimiento se habilita después de elegir sociedad. Automatizable.

### FAE-REACT-002 — Validación del formulario vacío
Tipo: validation. Prioridad: High.
1. Abrir `/cotizar/faena`.
2. Activar `Cotizar Tropa` sin completar campos.
Resultado: permanecen visibles `Este campo es obligatorio` y `Debe haber al menos una raza`, sin navegar. Automatizable.

### FAE-REACT-003 — Creación de nueva sociedad
Tipo: positive. Prioridad: High.
1. Abrir `#society` y seleccionar `+ Agregar nueva sociedad`.
2. Completar Razón social y CUIT con datos dinámicos autorizados.
3. Activar `Agregar Sociedad`.
Criterio de aceptación: la nueva sociedad aparece como opción en `#society` y queda seleccionable. No se valida un nombre fijo.

### FAE-REACT-004 — Creación de nuevo establecimiento
Tipo: positive. Prioridad: High.
Precondición: sociedad existente seleccionada.
1. Abrir `#establishment` y seleccionar `+ Agregar nuevo establecimiento`.
2. Completar nombre y datos requeridos con valores dinámicos autorizados.
3. Activar `Agregar Establecimiento`.
Criterio de aceptación: el nuevo establecimiento aparece como opción en `#establishment` y queda seleccionable. No se valida un nombre fijo.

### FAE-REACT-005 — Combinaciones completas y validación en legajo admin
Tipo: positive/data-integrity. Prioridad: Critical.

Ejecutar un caso independiente por cada combinación cartesiana de terminación (`De Campo`, `Racionada`, `Feedlot`), destino (`Consumo`, `Exportación Hilton`, `Exportación NO Hilton`, `Cuota 481`) y cada opción de Flete observada, incluyendo `A retirar` y `Puesto en planta` cuando estén disponibles.

En cada caso completar el ofrecimiento completo: sociedad, establecimiento, categoría `Vaca gorda`, raza, cantidad, pesos, terminación, destino, Apto China, disponibilidad de carga, encierre, desbaste, balanza, distancia y aclaraciones. Enviar con `Cotizar Tropa`, capturar dinámicamente el lote y navegar a operaciones.

Resultado: aparece `Cotización en Proceso`, `Ir a Mis Operaciones` y el lote en `/operacion/faena/venta/pendiente-publicacion`. Luego iniciar sesión como administrador, entrar a `Faena > Ofrecimientos`, buscar el lote, abrir `Ver legajo` y validar siempre el contenido completo enviado: lote, categoría, raza, cantidad, pesos, terminación, destino, flete, sociedad, establecimiento y campos de pesada. Toda diferencia queda para análisis de resultado.

## Riesgos y límites
- Flete no apareció como control identificable en la exploración React actual;
  se mantienen los escenarios solicitados como matriz de cobertura, pero cada
  combinación de Flete queda no automatizable hasta observar su selector y su
  representación en el legajo.
- La discrepancia documentada entre fecha visible y fecha enviada queda `UNKNOWN`, no como expectativa PASS.
- Videos y su umbral no se automatizan sin fixture autorizado.
- Las altas persistentes requieren datos únicos y autorización del ambiente.

## Automation Handoff

Automate FAE-REACT-001 through FAE-REACT-005 only after human approval. Use one independent data-driven test per observed termination/destination/freight combination. Every created lot must be validated in the administrator legajo.

Observed selectors: `/cotizar/faena`; `#society`; `#establishment`; `#category`; `.sc-hynwKY`; `#quantity`; `#minWeight`; `#averageWeight`; `#maxWeight`; `#confinementDays`; `#dateCarga`; `#desbaste`; `#distancia`; `#comentario`; `textarea[name="comentario"]`; `input[type="file"]` (two video inputs, without stable IDs); buttons `De Campo`, `Racionada`, `Feedlot`, `Consumo`, `Exportación Hilton`, `Exportación NO Hilton`, `Cuota 481`, `No`, `Sí`, `Sin Encierre`, `Con Encierre`, `Sociedad Rural`, `Establecimiento`, `Balanza Pública`, `Cotizar Tropa`; creation actions `+ Agregar nueva sociedad`, `Agregar Sociedad`, `+ Agregar nuevo establecimiento`, `Agregar Establecimiento`, `Cancelar`; validation text `Este campo es obligatorio` and `Debe haber al menos una raza`; confirmation `Cotización en Proceso`, `Ir a Mis Operaciones`; pending route `/operacion/faena/venta/pendiente-publicacion`.

Observed dropdown option patterns: `[name="society"]`, `[name="establishment"]`, and `[name="category"]`, selected by visible option text. The society and establishment dropdowns expose `+ Agregar nueva sociedad` and `+ Agregar nuevo establecimiento` respectively. `#dateCarga` is a readonly input with placeholder `Seleccionar`.

POM ownership: add `FaenaReactOfferPage` under `cypress/pages/`; reuse `login_helper.js`, `MainAdminPage`, and `validateCreatedLotInAdmin`; extend the helper/POM to assert every submitted field. Add the spec under `cypress/e2e/ofrecimientos-faena-react/` after approval. Do not use `cy.request()` against the observed API.

Data: discover society and establishment options dynamically. New entities must use unique, environment-configured data; acceptance is their appearance in the corresponding dropdown. Never hardcode credentials, identifiers, company names, or lot numbers.
