# Agentic QA — deCampoACampo

Capa de QA black-box para `https://stage.dcac.ar/`. Claude Code (con Playwright MCP) explora la
aplicación y planifica; Cypress ejecuta la regresión reproducible. La automatización existente
bajo `cypress/` se extiende, no se reemplaza.

## Qué hay que instalar

| Requisito | Para qué | Cómo |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) LTS (con npm) | Todo el proyecto | Instalador oficial |
| Dependencias del proyecto | Cypress, Playwright, dotenv | `npm install` en la raíz |
| Binario de Cypress | Correr las pruebas | Se baja con `npm install`; si falta: `npx cypress install` |
| Navegador de Playwright | Exploración con Claude (MCP) | `npx playwright install chromium` |
| [Claude Code](https://claude.com/claude-code) CLI | Flujo agentic (`/qa-flow`) | Ver documentación de Claude Code; no hace falta para sólo correr Cypress |
| Git | Control de versiones | Instalador oficial |
| Videos de prueba | Casos de invernada con video | Copiarlos a `cypress/fixtures/` (ver abajo) |

Cypress usa Electron incluido, así que no requiere instalar Chrome. Hace falta acceso de red a
`stage.dcac.ar` y a `react-stage.dcac.ar`.

### Credenciales: archivo `.env`

Crear `.env` en la raíz (está en `.gitignore`; nunca se commitea ni se lee desde Claude):

```dotenv
PASSWORD=...                     # contraseña compartida por los usuarios de prueba
USER_CLIENT=...                  # cliente / representante
USER_ADMIN=...                   # Admin
USER_AGENT=...                   # Agente
USER_COMMERCIAL_PARTNER=...      # Asociado comercial
# Opcionales: USER_ADMIN_FULL, USER_TRANSPORTES, USER_CLIENT_INVERNADA_ONLY,
# PASSWORD_USER_CLIENT_INVERNADA_ONLY, TEST_BASE_URL (por defecto https://stage.dcac.ar/)
```

`cypress.config.js` también acepta los nombres `TEST_<ROL>_USERNAME` / `TEST_<ROL>_PASSWORD`.

### Videos de prueba (no versionados)

`cypress/fixtures/*.mp4` está ignorado por Git: cada persona debe tener en su máquina
`video_ofrecimiento.mp4` (válido, 29 s) y `video_ofrecimiento_4seg.mp4` (rechazado por la app, 4 s).
Se puede usar otra ruta con `INVERNADA_VIDEO_PATH` e `INVERNADA_VIDEO_SHORT_PATH`.

## Correr las pruebas

```bash
npm test                          # toda la suite (cypress run)
npm run test:regression           # sólo @regression (también test:smoke, test:sanity)
npx cypress open                  # modo interactivo
npx cypress run --spec "cypress/e2e/ofrecimientos-invernada-legajo-admin/*.cy.js"
npm run qa:validate               # valida contratos config/ ↔ specs/ ↔ cypress/
```

El flujo e2e `ofrecimientos-invernada-legajo-admin` **crea tropas reales en stage** (4 por corrida
completa, sin borrarlas). Para correr sólo algunos flujos: `--env INVERNADA_LEGAJO_FLOWS=...`.
Videos y capturas quedan en `artifacts/` (ignorado por Git).

## Flujo de trabajo

```text
config/<feature>.yaml → planner → specs/<feature>.md → aprobación humana → generator
→ cypress/e2e/<feature>/*.cy.js → Cypress → healer / análisis si falla
```

1. **Config.** Se describe la feature en `config/<feature>.yaml` (partir de
   `config/feature-template.yaml`): objetivo, alcance, precondiciones, `knowledge` a cargar y
   `scope_catalog`.
2. **Exploración y plan.** En Claude Code: `/qa-flow config/<feature>.yaml`. El planner explora la
   app con Playwright MCP (el login sale de `.env`; rol por defecto `client`, otro con
   `PLAYWRIGHT_MCP_LOGIN_ROLE=admin|agent|commercial_partner` antes de abrir Claude). La exploración
   es obligatoria: el plan en `specs/<feature>.md` (español, con `Automation Handoff` en inglés)
   debe traer selectores observados o marcar el caso como no automatizable con su motivo. Si una
   carga queda bloqueada más de 10 min, el flujo informa, propone una solución, cierra el navegador
   y se detiene sin guardar el plan.
3. **Conocimiento.** Los hallazgos van a `knowledge/` (ver `knowledge/knowledge-capture.md`) con
   evidencia; lo no confirmado se registra en `knowledge/open-questions.md`, nunca como regla.
4. **Aprobación humana.** El flujo se detiene hasta que se responde exactamente `aprobado` (o
   `approved`). Ningún caso se automatiza sin plan aprobado.
5. **Generator.** Crea los specs reutilizando Page Objects, helpers y datos existentes.
6. **Validación y ejecución.** `npm run qa:validate` y luego Cypress. Un fallo es `UNKNOWN` hasta
   analizar evidencia y ambiente; el healer repara tests preservando la intención de las aserciones.

## Convenciones de código

- **Page Objects** (`cypress/pages/`): primero los selectores/localizadores (un accesor por
  selector) y debajo los métodos de acción y aserción. Los specs sólo llaman métodos del POM;
  `qa:validate` prohíbe `cy.get/contains/find` directos en los specs.
- **Datos** en `cypress/support/data/` (perfiles data-driven), **helpers** en
  `cypress/support/helpers/`. Sin credenciales ni IDs reales hardcodeados.
- Los datos que cambian por corrida (fechas, nombres) se generan en runtime.

## Estructura

- `.claude/agents/`: planner, generator y healer · `.claude/commands/qa-flow.md`: orquestador ·
  `.claude/skills/`: discovery, diseño, automatización, análisis y reportes.
- `config/`: entradas de features. `specs/`: planes y casos aprobados.
- `knowledge/`: contexto funcional y hallazgos de exploración (mantenerlos resumidos).
- `cypress/`: `e2e/`, `pages/`, `support/`, `fixtures/`, `reporters/`.
- `scripts/`: lanzador de Playwright MCP, login de exploración y validador de contratos.
- `artifacts/`: evidencia y reportes locales, ignorados por Git.
