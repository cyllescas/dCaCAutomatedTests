# Plan QA — Home React

## Estado

`DRAFT — requiere aprobación humana antes de generar specs Cypress`

## Fuente y reglas aplicadas

- Requerimientos funcionales: `PRD - Fin React Home.docx`.
- Referencia visual: Figma `JgHwl7iOvjJIiXkdQz83a1`, nodo `1763:21847`.
- Operación: `AGENTS.md`, `knowledge/open-questions.md` y evidencia del reporte exploratorio.
- El plan no asume respuestas para OQ-005, OQ-008, OQ-018, OQ-024 ni reglas de perfiles no observados.

## Casos propuestos

| ID | Caso | Perfil/datos | Automatizable | Selectores observados |
| --- | --- | --- | --- | --- |
| HOME-001 | Carga de Mercados Hoy y datos principales | Cliente autenticado | Sí | `MERCADOS HOY`, `.itemMercado` |
| HOME-002 | Hover muestra “Ver todo” | Cliente autenticado | Sí, tras aprobar expectativa | `.itemMercado` |
| HOME-003 | Mi Actividad sólo aparece con operaciones activas | Cliente con/sin operaciones | Parcial; falta perfil sin operaciones | `MI ACTIVIDAD`, links `/operaciones/` |
| HOME-004 | Tabs Destino y Tipo según perfil | Sin faena: `user_client_invernada_only`; con faena pendiente | Parcial; perfil con faena pendiente | botones exactos observados |
| HOME-005 | Multiselect Categoría y Ubicación | Cliente con opciones | Sí, selector técnico estable pendiente | `#categoria`; `#ubicacion` por confirmar |
| HOME-006 | Intersección Destino + Tipo + dropdowns | Cliente con datos compatibles | Sí, luego de HOME-005 | botones y `#categoria` |
| HOME-007 | Limpiar filtros devuelve resultados iniciales | Cliente con datos compatibles | Sí, control “limpiar” pendiente de selector | selector no observado |
| HOME-008 | Empty state y evento `HomeTropasEmptyState` | Combinación sin resultados | Bloqueado: empty state no observado | no disponible |
| HOME-009 | Estados CI/Oferta Baja/Ofertado y “ya vista” | `user_client_invernada_only` permite CI/Oferta Baja; “ya vista” pendiente | Parcial | links `/lote/invernada/{id}`, labels de estado |
| HOME-010 | Responsive 390 px sin overflow y navegación accesible | Cliente autenticado | Sí | viewport; menú mobile pendiente |
| HOME-011 | Visual baseline desktop contra Figma | Cliente autenticado / fixture estable | Sí con `cy.screenshot` y comparación aprobada | `.itemMercado`, headings, cards |
| HOME-012 | Visual baseline móvil contra referencia aprobada | Cliente autenticado | Bloqueado: Figma entregado es desktop | pendiente |

## Criterios visuales

- Desktop: estructura, espaciado, tipografía, colors semánticos y jerarquía contra captura Figma.
- Mercado: tendencia verde para suba y rojo para baja.
- Tropas: tratamiento de estados y labels persistentes.
- Mobile: sin scroll horizontal, controles legibles y header/menu accesible.

## Automation Handoff

### POMs

- `cypress/pages/MainClientPage.js` para la Home cliente; extenderlo sólo con selectores observados y estables.
- Crear `cypress/pages/HomeReactPage.js` únicamente después de aprobación, encapsulando `.itemMercado`, `#categoria`, `#ubicacion`, tabs y cards.

### Helpers

- Reusar `cypress/support/helpers/login_helper.js`.
- No hardcodear credenciales; usar `TEST_CLIENT_USERNAME` y `TEST_CLIENT_PASSWORD`.
- No crear datos de CI/perfiles ni usar workarounds DOM sin autorización.

### Specs relacionadas

- `cypress/e2e/login/login-dcac.cy.js`.
- Nuevas specs propuestas: `cypress/e2e/home-react/home-react.cy.js` y `home-react-visual.cy.js`, sólo después de aprobación.

### Selectors and assertions

- Preferir texto exacto/roles cuando estén disponibles.
- Confirmar y encapsular selectores de dropdowns; `#categoria` fue observado, `#ubicacion` debe verificarse.
- Para visual, usar viewport fijo y screenshots bajo `artifacts/`; no usar snapshots dinámicos como único criterio.

### Required data

- Cliente autenticado actual o `user_client_invernada_only` para HOME-001/002/005/006/010/011.
- Usuario sin sociedad y comprador con faena para HOME-003/004.
- `user_client_invernada_only` cubre parte de HOME-009; TD-005/TD-007 y estados aprobados siguen requeridos para CI completa, empty state y “ya vista”.

## Aprobación requerida

Aprobar el plan y resolver los datos/perfiles bloqueados antes de generar o ejecutar specs. Los cuatro hallazgos del reporte quedan inicialmente `UNKNOWN` hasta el análisis de ambiente y la confirmación de Producto/Desarrollo.
