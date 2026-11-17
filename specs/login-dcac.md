# Plan de prueba — Autenticación dCaC

## Identificación

- **Feature:** `login-dcac`
- **Objetivo:** validar el inicio de sesión observable en Stage dCaC para los roles documentados, credenciales inválidas y validaciones visibles.
- **SUT:** `https://stage.dcac.ar/`
- **Suites previstas:** smoke, regression
- **Estado del plan:** pendiente de aprobación humana
- **Última exploración:** 2026-10-02, Stage, los cuatro roles y el formulario sin sesión.

## Contexto y trazabilidad

Este plan se deriva de `config/login-dcac.yaml` y del conocimiento funcional de `knowledge/README.md`, `knowledge/glossary.md`, `knowledge/users-and-permissions.md` y `knowledge/open-questions.md`.

Reglas relevantes:

- `BR-USR-001` y `BR-USR-002`: un cliente vendedor puede ofrecer tropas de invernada y faena sin permisos especiales; no se prueban esas operaciones en este feature.
- `BR-USR-005`: un Admin generalmente tiene perfil o permiso 4.
- `BR-USR-006` a `BR-USR-009`: un CR generalmente tiene permiso 6, comparte vista con Admin y se asocia a sociedades.
- `BR-USR-011` a `BR-USR-014`: representante y cliente comparten vista general, con asociaciones de sociedad distintas.

Las preguntas `OQ-002` y `OQ-004` impiden convertir los permisos/perfiles 4 y 6 o la diferencia Admin/CR en requisitos no observados. Las diferencias por rol se registran como evidencia observable, sin asumir una matriz de permisos.

## Alcance

Incluye login de cliente, administrador, agente y asociado comercial; campos obligatorios; formato de email; credenciales inválidas; redirección y vista posterior; diferencias observables por rol.

Excluye recuperación de contraseña, creación de usuarios y cambios de datos de negocio.

## Hallazgos de exploración

### Formulario (sin sesión)

1. La navegación a la base redirige a `https://stage.dcac.ar/__dcac/login?`, título `deCampoaCampo`, heading `Iniciá sesión`.
2. Controles: `Email` (`#maillog`), `Contraseña` (`#password`, ícono de mostrar `#icono`) y `INGRESAR` (`#ingresar_login`). El formulario (`#login_modal`) usa `novalidate` y validación de jQuery Validate.
3. Mensajes observados:

   | Escenario | Resultado observado |
   |---|---|
   | Ambos campos vacíos | Email y Contraseña muestran `Este campo es requerido.`; ambos inputs reciben clase `error`. |
   | Sólo contraseña completa | Email muestra `Este campo es requerido.`. |
   | Sólo email completo | Contraseña muestra `Este campo es requerido.`. |
   | Email `noesunemail` + contraseña | Email muestra `Direcion de email no valida.` (grafía literal). |
   | Email válido ficticio + contraseña incorrecta ficticia | `window.alert` nativo `Usuario o contraseña incorrectos`; la URL permanece en `/__dcac/login`; el formulario se vacía; no hay modal ni toast en el DOM. |

4. Tras corregir un campo, los labels de error quedan en el DOM pero ocultos: asertar visibilidad, no existencia.

### Vista posterior por rol

| Rol | URL | Título | Elementos distintivos observados |
|---|---|---|---|
| Cliente | `/__dcac/` | `Inicio` | `.top-banner`; menú de usuario `#div_log_out` (popup `#modal_log_out` con `Ver perfil` y `Salir`); navegación Operaciones, Precios, Consultas, Perfil, Clima, Comprar, Cotizar, DCP REACT; contenido `Tendencias del mercado` e `Invernada - Tropas para ofertar`. |
| Agente | `/__dcac/` | `Inicio` | Igual que cliente, más el ítem `Clientes` (`/__dcac/misClientes`); no se observó `DCP REACT`. |
| Administrador | `/` | `Admin DCAC ->` | `nav#navbar.navbar-fixed-top`; `a.logout_azul` (`?logout`) dentro de `div.bloque_user_azul`; botones INVERNADA, FAENA, MAG, TRANSPORTES, OFERTAS; `table#liveBoard` (actividad). |
| Asociado comercial | `/` | `Admin DCAC ->` | Mismo shell que Administrador (`nav#navbar`, `a.logout_azul`); sin `table#liveBoard`; sección `#app-gestion_sociedades` (`Gestión Sociedades`, filas `#sociedad_<id>`). |

Cierre de sesión confirmado en los cuatro roles (vuelve a `/__dcac/login`). Cliente y agente: abrir `#div_log_out` y activar `a[href="/__dcac/logout"]`. Administrador y asociado comercial: `a.logout_azul`.

Los errores de consola de JS/CSS y recursos 404 observados en Stage se ignoran mientras el flujo principal de login se cumpla. Los enlaces de `Ayuda`, `Consultas` y `DCP REACT` llevan tokens en la URL: no se registran.

## Riesgos

| Riesgo | Nivel | Motivo |
|---|---|---|
| Login válido no redirige o deja una vista incorrecta | Critical | Bloquea el acceso a toda la aplicación según rol. |
| Credenciales inválidas permiten acceso o no informan el error | High | Impacto de autenticación y seguridad observable. |
| Validaciones de campos obligatorios/formato no aparecen | High | Impide recuperación clara de errores de usuario. |
| Las vistas posteriores no corresponden al rol | High | Puede indicar autorización o navegación incorrecta. |
| La cuenta de prueba o Stage no está disponible | Medium | Impide distinguir falla de aplicación de falla de ambiente. |

## Casos de prueba

### TC-LOGIN-001 — Login exitoso como cliente

- **Tipo:** positive, smoke, regression
- **Prioridad:** Critical
- **Automatizable:** SÍ
- **Precondiciones:** Stage disponible; cuenta en `TEST_CLIENT_USERNAME`/`USER_CLIENT` y contraseña local válida; sesión limpia.
- **Pasos:**
  1. Abrir `https://stage.dcac.ar/`.
  2. Completar `Email` y `Contraseña` con la cuenta de cliente configurada.
  3. Activar `INGRESAR`.
- **Resultado esperado:** la URL pasa a `/__dcac/` (esperar el cambio de URL de forma explícita); título `Inicio`; son visibles `.top-banner`, `#div_log_out` y el título de sección `Tendencias del mercado`.
- **Falla si:** permanece en login, aparece un error de autenticación con credenciales válidas o la vista no es visible.

### TC-LOGIN-002 — Login exitoso como administrador

- **Tipo:** positive, smoke, regression
- **Prioridad:** Critical
- **Automatizable:** SÍ
- **Precondiciones:** cuenta en `TEST_ADMIN_USERNAME`/`USER_ADMIN`; sesión limpia.
- **Pasos:** repetir el flujo con la cuenta Admin.
- **Resultado esperado:** la URL pasa a la raíz `/`; título `Admin DCAC ->`; son visibles `nav#navbar`, `a.logout_azul` y `table#liveBoard`.
- **Nota:** no se exige permiso 4; `BR-USR-005` lo describe sólo como general.

### TC-LOGIN-003 — Login exitoso como agente

- **Tipo:** positive, smoke, regression
- **Prioridad:** High
- **Automatizable:** SÍ
- **Precondiciones:** cuenta en `TEST_AGENT_USERNAME`/`USER_AGENT`; sesión limpia.
- **Pasos:** repetir el flujo con la cuenta de agente.
- **Resultado esperado:** la URL pasa a `/__dcac/`; título `Inicio`; son visibles `.top-banner`, `#div_log_out` y el enlace de navegación `Clientes` (`/__dcac/misClientes`).
- **Nota:** que `Clientes` distinga al agente es una observación, no una regla (ver preguntas abiertas).

### TC-LOGIN-004 — Login exitoso como asociado comercial

- **Tipo:** positive, smoke, regression
- **Prioridad:** High
- **Automatizable:** SÍ
- **Precondiciones:** cuenta en `TEST_COMMERCIAL_PARTNER_USERNAME`/`USER_COMMERCIAL_PARTNER`; sesión limpia.
- **Pasos:** repetir el flujo con la cuenta de asociado comercial.
- **Resultado esperado:** la URL pasa a `/`; título `Admin DCAC ->`; son visibles `nav#navbar`, `a.logout_azul` y `#app-gestion_sociedades`; no existe `table#liveBoard`.
- **Nota:** `OQ-004` queda abierta; no se equipara asociado comercial con CR sin evidencia. Título y URL no distinguen a este rol del Admin.

### TC-LOGIN-005 — Campos obligatorios (ambos vacíos)

- **Tipo:** validation, negative
- **Prioridad:** High
- **Automatizable:** SÍ
- **Precondiciones:** sesión limpia en login.
- **Pasos:** activar `INGRESAR` sin completar ningún campo.
- **Resultado esperado:** `label.error[for="maillog"]` y `.error-password` visibles con `Este campo es requerido.`; la URL permanece en `/__dcac/login`.

### TC-LOGIN-006 — Formato de email inválido

- **Tipo:** validation, negative, boundary
- **Prioridad:** Medium
- **Automatizable:** SÍ
- **Pasos:** completar `Email` con `noesunemail`, `Contraseña` con un valor no sensible y activar `INGRESAR`.
- **Resultado esperado:** `label.error[for="maillog"]` visible con `Direcion de email no valida.`; no se inicia sesión.
- **Nota:** se conserva literalmente la grafía `Direcion`.

### TC-LOGIN-007 — Credenciales inválidas

- **Tipo:** negative, error_handling
- **Prioridad:** High
- **Automatizable:** SÍ
- **Precondiciones:** email sintácticamente válido ficticio y contraseña ficticia incorrecta; sin cuentas reales ni secretos.
- **Pasos:** registrar `cy.on('window:alert', ...)` antes de activar `INGRESAR`; completar ambos campos y activar `INGRESAR`.
- **Resultado esperado:** se dispara un `window.alert` con `Usuario o contraseña incorrectos`; la URL permanece en `/__dcac/login`; el formulario queda vacío.
- **Falla si:** se concede acceso o el alert nunca se dispara (la aserción debe fallar si el alert no ocurre).

### TC-LOGIN-008 — Falta sólo el email

- **Tipo:** validation, negative
- **Prioridad:** Medium
- **Automatizable:** SÍ
- **Pasos:** completar sólo `Contraseña` y activar `INGRESAR`.
- **Resultado esperado:** `label.error[for="maillog"]` visible con `Este campo es requerido.`; sin error visible en contraseña; no se inicia sesión.

### TC-LOGIN-009 — Falta sólo la contraseña

- **Tipo:** validation, negative
- **Prioridad:** Medium
- **Automatizable:** SÍ
- **Pasos:** completar sólo `Email` con formato válido y activar `INGRESAR`.
- **Resultado esperado:** `.error-password` visible con `Este campo es requerido.`; sin error visible en email; no se inicia sesión.

## Datos, independencia y evidencia

- Cada caso inicia con sesión limpia y puede ejecutarse independientemente.
- Las cuentas y contraseñas se leen desde variables de entorno/configuración local ignorada; nunca se imprimen, fixturean ni hardcodean.
- Guardar screenshots, videos y reportes bajo `artifacts/`.
- Todo fallo se clasifica inicialmente como `UNKNOWN` y se analiza considerando autenticación, ambiente, locator, sincronización y aplicación.

## Preguntas abiertas candidatas

- ¿Por qué Admin y asociado comercial entran a `/` (shell `Admin DCAC ->`) y cliente y agente a `/__dcac/`? ¿Qué ocurre al abrir la URL de otro rol? (relacionada con `OQ-002`, `OQ-004`)
- ¿Es esperado que el agente vea `Clientes` y no `DCP REACT`?
- ¿Qué alcance de datos corresponde al asociado comercial? Los contadores de Invernada/Faena parecen globales frente a las pocas sociedades visibles.
- ¿Es intencional la grafía `Direcion`?
- ¿Un email válido inexistente debe producir el mismo mensaje que una contraseña errónea? Sólo se observó un alert genérico.

## Automation Handoff

### Observed selectors

- Login form: `#maillog` (`input[type=email][name=mail]`), `#password`, `#icono`, `#ingresar_login`, `#login_modal`.
- Email error: `label.error[for="maillog"]` (also matched by the existing `:nth-child(2) > label.error`). Password error: `label.error.error-password` (existing `.error-password`). Hidden labels remain in the DOM after the field is fixed: assert `be.visible`.
- Client and agent: `.top-banner`, `#div_log_out`, `#modal_log_out`, `a[href="/__dcac/logout"]` (open the menu first), `img[alt="decampoacampo_logo"]`; agent only: link `Clientes` (`/__dcac/misClientes`).
- Admin and commercial partner: `nav#navbar.navbar-fixed-top`, `a.logout_azul` (`?logout`) inside `div.bloque_user_azul`; admin only: `table#liveBoard`; commercial partner only: `#app-gestion_sociedades`.
- The navbar buttons of the admin shell have no id or class; identify them by text only if needed.

### Observed messages and URLs

- `Este campo es requerido.`; `Direcion de email no valida.`; wrong credentials: native `window.alert` `Usuario o contraseña incorrectos`, URL stays `/__dcac/login`, form cleared.
- Post-login URLs: client and agent `/__dcac/` (title `Inicio`); admin and commercial partner `/` (title `Admin DCAC ->`). The redirect is not immediate: wait explicitly for the URL change.

### POM ownership

- `cypress/pages/LoginPage.js`: form selectors and validation errors.
- `cypress/pages/Main{Client,Admin,Agent,CommercialPartner}Page.js`: role views. Verify their current selectors against the inventory above before reuse and reconcile differences.

### Helpers / fixtures / specs

- `cypress/support/helpers/login_helper.js`: `verifyInvalidCredentialsAlert()` registers `cy.on('window:alert')` without proving the alert fired; it must fail if the alert never occurs.
- `cypress/fixtures/login.json`: keep the literal messages.
- `cypress/e2e/login/login-dcac.cy.js`: one `it` per approved TC id (`TC-LOGIN-001` to `009`).
- Spec structure: one outer `describe('Autenticación dCaC')` holding the shared `beforeEach` (clear cookies and storage, visit `/`), with nested `describe` groups: `Login exitoso por rol` (TC-LOGIN-001..004), `Validaciones del formulario` (TC-LOGIN-005, 006, 008, 009) and `Credenciales inválidas` (TC-LOGIN-007). Keep the TC id in each `it` title; do not nest deeper.

### Required data

- `USER_CLIENT`, `USER_ADMIN`, `USER_AGENT`, `USER_COMMERCIAL_PARTNER` (or `TEST_*_USERNAME`) and `PASSWORD` through env/Cypress config only; never printed. Values must have no quotes or trailing commas.
- Invalid credentials: a fictitious valid-format email and a non-sensitive wrong password.

### Out of scope

- Do not automate undocumented permission assumptions from `OQ-002` or `OQ-004`; do not assert role differences beyond the observed markers.
- Do not log or persist tokens present in the `Ayuda`, `Consultas` and `DCP REACT` links.

## Approval gate

No Cypress spec may be generated or executed from this plan until a human explicitly replies `approved` or `aprobado`.
