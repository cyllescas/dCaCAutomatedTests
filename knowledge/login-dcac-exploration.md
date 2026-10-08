# Hallazgos de exploración — Autenticación dCaC (login)

- Fecha: 2026-10-02
- Ambiente: `https://stage.dcac.ar/`
- Fuente: exploración UI black-box con Playwright MCP, cuatro roles y formulario sin sesión.
- Plan asociado: `specs/login-dcac.md` (pendiente de aprobación humana). Los selectores observados viven en su `Automation Handoff`, no se duplican aquí.
- Estado: hallazgos observados, no confirmados con Producto. No son reglas de negocio.
- No se registran credenciales, tokens ni datos de cuentas.

## Validaciones observadas del formulario

- `VAL-LOGIN-001`: con ambos campos vacíos, Email y Contraseña muestran `Este campo es requerido.`.
- `VAL-LOGIN-002`: con sólo uno de los dos campos vacío, ese campo muestra `Este campo es requerido.`.
- `VAL-LOGIN-003`: un email sin formato válido muestra `Direcion de email no valida.` (grafía literal; ver `OQ-039`).
- `VAL-LOGIN-004`: con email válido ficticio y contraseña incorrecta se dispara un `window.alert` nativo con `Usuario o contraseña incorrectos`; la URL permanece en `/__dcac/login` y el formulario se vacía. No hay modal ni toast en el DOM.

## Flujo observado

- `FL-LOGIN-001`: `https://stage.dcac.ar/` redirige a `/__dcac/login?`. Tras un login válido la redirección no es inmediata (observada hasta ~5 s) y la vista final depende del rol. El cierre de sesión vuelve a `/__dcac/login` en los cuatro roles.

## Equivalencias de vista por rol

Observaciones de interfaz; no son una matriz de permisos (`OQ-002`, `OQ-004`, `OQ-038`).

- `MAP-LOGIN-001`, Cliente: URL `/__dcac/`, título `Inicio`; barra superior con menú de usuario y navegación con `Comprar`, `Cotizar` y `DCP REACT`.
- `MAP-LOGIN-002`, Agente: URL `/__dcac/`, título `Inicio`; igual que Cliente más el ítem `Clientes`, y sin `DCP REACT`.
- `MAP-LOGIN-003`, Administrador: URL `/`, título `Admin DCAC ->`; barra de administración y tablero de actividad.
- `MAP-LOGIN-004`, Asociado comercial: URL `/`, título `Admin DCAC ->`; mismo shell que Administrador, sin tablero de actividad y con la sección `Gestión Sociedades`.

## Ambiente y procedimientos de testing

- `TST-LOGIN-001`: los valores de `.env` deben escribirse sin comillas, sin espacios tras `=` y sin coma final. Un email con coma final se rechaza con `Direcion de email no valida.` incluso para cuentas válidas, lo que produjo falsos fallos de login durante la exploración.
- `TST-LOGIN-002`: el servidor MCP `playwright-test` lee `.env` al iniciar; tras editarlo hay que reconectarlo (`/mcp`).
- Los enlaces `Ayuda`, `Consultas` y `DCP REACT` llevan tokens en la URL: no registrarlos en fixtures, logs ni conocimiento.
- Los errores de consola de JS/CSS y recursos 404 de Stage se ignoran mientras el flujo principal de login se cumpla.

## Preguntas abiertas generadas

`OQ-038` a `OQ-041` en `open-questions.md`.
