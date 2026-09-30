# Plan de prueba — Autenticación dCaC

## Identificación

- **Feature:** `login-dcac`
- **Objetivo:** validar el inicio de sesión observable en Stage dCaC para los roles documentados, credenciales inválidas y validaciones visibles.
- **SUT:** `https://stage.dcac.ar/`
- **Suites previstas:** smoke, regression
- **Estado del plan:** pendiente de aprobación humana

## Contexto y trazabilidad

Este plan se deriva de `config/login-dcac.yaml` y del conocimiento funcional de `knowledge/README.md`, `knowledge/glossary.md`, `knowledge/users-and-permissions.md` y `knowledge/open-questions.md`.

Reglas relevantes:

- `BR-USR-001` y `BR-USR-002`: un cliente vendedor puede ofrecer tropas de invernada y faena sin permisos especiales; no se prueban esas operaciones en este feature.
- `BR-USR-005`: un Admin generalmente tiene perfil o permiso 4.
- `BR-USR-006` a `BR-USR-009`: un CR generalmente tiene permiso 6, comparte vista con Admin y se asocia a sociedades.
- `BR-USR-011` a `BR-USR-014`: representante y cliente comparten vista general, con asociaciones de sociedad distintas.

Las preguntas `OQ-002` y `OQ-004` impiden convertir los permisos/perfiles 4 y 6 o la diferencia Admin/CR en requisitos no observados. Las diferencias por rol se registrarán como evidencia observable, sin asumir una matriz de permisos.

## Alcance

Incluye login de cliente, administrador, agente y asociado comercial; campos obligatorios; formato de email; credenciales inválidas; redirección y vista posterior; diferencias observables por rol.

Excluye recuperación de contraseña, creación de usuarios y cambios de datos de negocio.

## Hallazgos de exploración

1. La navegación a la base redirige a `https://stage.dcac.ar/__dcac/login?`.
2. La página muestra el heading `Iniciá sesión`.
3. Los controles observables son un textbox para `Email`, un textbox para `Contraseña` y el botón `INGRESAR`.
4. Al enviar ambos campos vacíos, ambos muestran `Este campo es requerido.`.
5. Con un email sin formato válido se muestra `Direcion de email no valida.`.
6. El comportamiento de credenciales inválidas requiere ejecutar con email válido sintácticamente y una contraseña no válida; el diálogo no quedó expuesto en el snapshot exploratorio, por lo que debe verificarse durante la automatización.
7. Hay variables locales para las cuentas de los cuatro roles y la contraseña; no se incluyen valores en documentación ni fixtures.

## Riesgos

| Riesgo | Nivel | Motivo |
|---|---|---|
| Login válido no redirige o deja una vista incorrecta | Critical | Bloquea el acceso a toda la aplicación según rol. |
| Credenciales inválidas permiten acceso o no informan el error | High | Impacto de autenticación y seguridad observable. |
| Validaciones de campos obligatorios/formato no aparecen | High | Impide recuperación clara de errores de usuario. |
| Las vistas posteriores de Admin, cliente, agente o asociado comercial no corresponden | High | Puede indicar autorización o navegación incorrecta. |
| La cuenta de prueba o Stage no está disponible | Medium | Impide distinguir falla de aplicación de falla de ambiente. |

## Casos de prueba

### TC-LOGIN-001 — Login exitoso como cliente

- **Tipo:** positive, smoke, regression
- **Prioridad:** Critical
- **Precondiciones:** Stage disponible; cuenta configurada en `TEST_CLIENT_USERNAME`/`USER_CLIENT` y contraseña local válida; sesión limpia.
- **Pasos:**
  1. Abrir `https://stage.dcac.ar/`.
  2. Completar `Email` con la cuenta de cliente configurada.
  3. Completar `Contraseña` con la contraseña configurada.
  4. Activar `INGRESAR`.
- **Resultado esperado:** la URL contiene `/__dcac/`; se muestra la vista principal de cliente y el título `Tendencias del mercado`.
- **Falla si:** permanece en login, aparece un error de autenticación con credenciales válidas o la vista principal esperada no es visible.

### TC-LOGIN-002 — Login exitoso como administrador

- **Tipo:** positive, smoke, regression
- **Prioridad:** Critical
- **Precondiciones:** cuenta local válida en `TEST_ADMIN_USERNAME`/`USER_ADMIN`; sesión limpia.
- **Pasos:** repetir navegación, carga de credenciales y activación de `INGRESAR` con la cuenta Admin.
- **Resultado esperado:** la URL contiene `/__dcac/` y son visibles la barra principal, navegación principal y control de cierre de sesión.
- **Falla si:** no redirige o la vista Admin no se presenta.
- **Nota:** no se exige permiso 4; `BR-USR-005` lo describe sólo como general.

### TC-LOGIN-003 — Login exitoso como agente

- **Tipo:** positive, smoke, regression
- **Prioridad:** High
- **Precondiciones:** cuenta local válida en `TEST_AGENT_USERNAME`/`USER_AGENT`; sesión limpia.
- **Pasos:** repetir el flujo de login con la cuenta de agente.
- **Resultado esperado:** la URL contiene `/__dcac/`; son visibles el cuerpo principal, `Tendencias del mercado` y la barra superior.

### TC-LOGIN-004 — Login exitoso como asociado comercial

- **Tipo:** positive, smoke, regression
- **Prioridad:** High
- **Precondiciones:** cuenta local válida en `TEST_COMMERCIAL_PARTNER_USERNAME`/`USER_COMMERCIAL_PARTNER`; sesión limpia.
- **Pasos:** repetir el flujo de login con la cuenta de asociado comercial.
- **Resultado esperado:** la URL contiene `/__dcac/`; son visibles el cuerpo principal, la barra principal y la lista de sociedades.
- **Nota:** `OQ-004` queda explícitamente abierta; no se equipara asociado comercial con CR sin evidencia.

### TC-LOGIN-005 — Campos obligatorios

- **Tipo:** validation, negative
- **Prioridad:** High
- **Precondiciones:** sesión limpia en login.
- **Pasos:** activar `INGRESAR` sin completar ningún campo.
- **Resultado esperado:** `Email` y `Contraseña` muestran `Este campo es requerido.` y no se inicia sesión.

### TC-LOGIN-006 — Formato de email inválido

- **Tipo:** validation, negative, boundary
- **Prioridad:** Medium
- **Precondiciones:** sesión limpia en login.
- **Pasos:** completar `Email` con un valor sin formato de email, completar `Contraseña` con cualquier valor no sensible y activar `INGRESAR`.
- **Resultado esperado:** el campo email muestra `Direcion de email no valida.` y no se inicia sesión.
- **Nota:** se conserva literalmente el texto observable de Stage, incluida la grafía `Direcion`.

### TC-LOGIN-007 — Credenciales inválidas

- **Tipo:** negative, error_handling
- **Prioridad:** High
- **Precondiciones:** Stage disponible; usar email sintácticamente válido de prueba y contraseña deliberadamente inválida; no usar una cuenta real ni exponer secretos.
- **Pasos:** completar ambos campos y activar `INGRESAR`.
- **Resultado esperado:** el sistema rechaza el acceso, permanece en login y muestra el mensaje observable de credenciales inválidas (o diálogo equivalente); el texto exacto debe capturarse y trazarse durante la ejecución.
- **Falla si:** se concede acceso o no existe ninguna señal observable de rechazo.

## Datos, independencia y evidencia

- Cada caso inicia con sesión limpia y puede ejecutarse independientemente.
- Las cuentas y contraseñas se leen desde variables de entorno/configuración local ignorada; nunca se imprimen, fixturean ni hardcodean.
- Guardar screenshots, videos y reportes bajo `artifacts/`.
- Todo fallo se clasifica inicialmente como `UNKNOWN` y se analiza considerando autenticación, ambiente, locator, sincronización y aplicación.

## Automation Handoff

### Existing assets to reuse

- `cypress/pages/LoginPage.js`: `usernameField()`, `passwordField()`, `submitButton()`, `userFieldError()`, `passwordFieldError()`.
- `cypress/support/helpers/login_helper.js`: `fillLoginFields()`, role-specific success verifications, `verifyInvalidCredentialsAlert()`, and field-error verifications.
- `cypress/fixtures/login.json`: observable validation messages. Preserve the current literal text.
- `cypress.config.js`: environment-backed credentials and Stage base URL.

### Selector inventory

- Email: `#maillog` (accessible snapshot role: textbox; visible label: `Email`).
- Password: `#password` (accessible snapshot role: textbox; visible label: `Contraseña`).
- Submit: `#ingresar_login` (accessible role/name: button `INGRESAR`).
- Existing validation selectors: `:nth-child(2) > label.error` and `.error-password`; verify against the live DOM before relying on them.

### Required specs

- Create or extend `cypress/e2e/login/login-dcac.cy.js`.
- Trace each `it` to exactly one approved test case ID: `TC-LOGIN-001` through `TC-LOGIN-007`.
- Use `cy.session` only if it preserves test independence and does not hide the observable login assertion.
- Keep selectors and UI mechanics in the Page Object; keep role intent and assertions in the spec.

### Environment data

- Client: `TEST_CLIENT_USERNAME` or `USER_CLIENT`; password: corresponding password variable.
- Admin: `TEST_ADMIN_USERNAME` or `USER_ADMIN`.
- Agent: `TEST_AGENT_USERNAME` or `USER_AGENT`.
- Commercial partner: `TEST_COMMERCIAL_PARTNER_USERNAME` or `USER_COMMERCIAL_PARTNER`.
- Shared password fallback: `PASSWORD` only through Cypress config; never log its value.
- Invalid credentials: deterministic syntactically valid fake email and non-sensitive invalid password.

### Unsupported or conditional automation

- Role-specific cases are conditional on configured credentials being present and valid in Stage.
- Exact invalid-credentials message must be confirmed during execution before asserting it. If a browser dialog is used, handle it without exposing its contents in logs.
- Do not automate undocumented permission assumptions from `OQ-002` or `OQ-004`.

## Approval gate

No Cypress spec may be generated or executed from this plan until a human explicitly replies `approved` or `aprobado`.
