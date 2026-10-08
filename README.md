# Agentic QA — deCampoACampo

Infraestructura para explorar `stage.dcac.ar` con Claude Code/Playwright y ejecutar
regresión web reproducible con Cypress. La automatización dCaC existente se
conserva bajo `cypress/`; la arquitectura agentic se integra alrededor de ella.

## Uso rápido

```powershell
npm install
claude
```

En Claude Code:

```text
/qa-flow config/login-dcac.yaml
```

El planner crea un plan revisable y se detiene antes de generar pruebas. Para
ejecutar la suite sin Claude:

La exploración es obligatoria antes del plan: el handoff debe incluir
selectores observados (o el motivo explícito por el que un caso no es
automatizable). Si una carga o acción queda bloqueada más de 10 minutos, el
flujo informa el error y una propuesta para aprobación, cierra el navegador y
se detiene sin guardar el plan. El navegador también se cierra al terminar la
exploración normalmente.

```powershell
npm test
npm run test:regression
npx cypress open
```

La URL por defecto es `https://stage.dcac.ar/`. Configurar credenciales sólo
mediante variables de entorno en `.env` (por ejemplo `USER_CLIENT`,
`USER_ADMIN`, `USER_AGENT`, `USER_COMMERCIAL_PARTNER` y `PASSWORD`); nunca
commitear secretos.

Los videos de prueba de invernada no se versionan (`cypress/fixtures/*.mp4` está
en `.gitignore`). Cada persona debe tenerlos en su máquina y puede indicar otra
ruta con `INVERNADA_VIDEO_PATH` (video válido, >= 10 s) e
`INVERNADA_VIDEO_SHORT_PATH` (video corto, < 10 s). Por defecto se usan
`cypress/fixtures/video_ofrecimiento.mp4` y
`cypress/fixtures/video_ofrecimiento_corto.mp4`.

El launcher de Playwright MCP inyecta el login desde `.env` mediante un init
page; nunca imprime los valores. El rol predeterminado es `client`. Para otra
exploración, establecer `PLAYWRIGHT_MCP_LOGIN_ROLE` con `admin`, `agent` o
`commercial_partner` antes de iniciar Claude Code.

## Estructura

- `.claude/agents/`: planner, generator y healer.
- `.claude/commands/qa-flow.md`: orquestador del flujo (`/qa-flow`).
- `.claude/skills/`: discovery, design, automation, análisis y reportes.
- `config/`: entradas de features dCaC.
- `config/feature-template.yaml`: plantilla base para crear nuevas entradas de configuración.
- `knowledge/`: contexto funcional provisto por QA.
- `specs/`: planes y casos aprobados.
- `cypress/`: Page Objects, helpers y pruebas existentes/integradas.
- `artifacts/`: evidencia y reportes generados, ignorados por Git.

## Persistencia de conocimiento

Cada exploración debe extender el conocimiento de `knowledge/` con sus
hallazgos, evidencia, preguntas abiertas y selectores observados. Los registros
anteriores no se sobrescriben: si cambia un comportamiento o selector, se
conserva el registro previo y se agrega una entrada fechada con el nuevo estado
y su evidencia. El procedimiento detallado está en
`knowledge/knowledge-capture.md`; los selectores se documentan en el archivo
de dominio correspondiente y se implementan dentro de Page Objects.
