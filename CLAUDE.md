# Sistema Agentic QA — deCampoACampo

## Propósito

Este repositorio contiene una capa de QA black-box para `https://stage.dcac.ar/`.
Claude Code coordina la exploración y Cypress ejecuta pruebas reproducibles. La
automatización existente en `cypress/` es parte del producto del repositorio y
debe extenderse, no reemplazarse.

## Reglas de trabajo

- Usar sólo comportamiento observable de la aplicación, requisitos y `knowledge/`.
- No asumir reglas que estén listadas como preguntas abiertas.
- Mantener los selectores dentro de Page Objects y la intención funcional dentro de specs.
- Priorizar login, roles/permisos, ofertas, cotizaciones, CI/CD y Viaje Inmediato.
- No acceder a código interno, APIs privadas ni base de datos del SUT como parte de pruebas UI.
- Si se usa la documentación SQL, ejecutar únicamente `SELECT` en un ambiente autorizado.
- No exponer ni hardcodear credenciales; usar variables de entorno o configuración local ignorada.
- Un fallo automatizado no es automáticamente un defecto de aplicación: analizar evidencia y ambiente.

## Flujo Agentic QA

`config/<feature>.yaml` → planner → plan Markdown revisable → aprobación humana →
generator → `cypress/e2e/<feature>/*.cy.js` → Cypress → healer/análisis si falla.

El planner debe generar planes en español e incluir un `Automation Handoff` en
inglés con selectores, POMs, helpers, specs relacionadas y datos requeridos.
La exploración es una compuerta obligatoria: no iniciar ni guardar el test plan
hasta que haya terminado y se hayan obtenido selectores observados para cada
caso automatizable; los casos sin selector deben quedar explícitamente como no
automatizables con su motivo. Si una carga o acción queda bloqueada más de 10
minutos (600000 ms), informar el error en consola, proponer una solución para
aprobación humana, cerrar el navegador y detener el flujo sin guardar el plan.
Cerrar también el navegador al finalizar correctamente la exploración.
No se automatiza un caso que no esté trazado a un plan aprobado.

## Datos y conocimiento

`knowledge/` es contexto funcional. Cargar sólo los archivos necesarios y
consultar `open-questions.md` antes de asumir comportamiento. Los procedimientos
de testing no son reglas de producción. No agregar secretos, resultados de BD ni
identificadores reales a fixtures compartidos.
Los hallazgos nuevos de exploración deben persistirse en `knowledge/` siguiendo
`knowledge/knowledge-capture.md`, con evidencia y trazabilidad. Si aún no están
confirmados, deben registrarse como preguntas abiertas o procedimientos de
testing, no como reglas de negocio.

## Evidencia

Guardar screenshots, videos y reportes locales bajo `artifacts/`. Los reportes
de fallos deben clasificarse inicialmente como `UNKNOWN` hasta analizarse.

## Orquestación

El flujo se dispara con `/qa-flow config/<feature>.yaml` (ver
`.claude/commands/qa-flow.md`). Subagentes en `.claude/agents/`
(`playwright_test_planner`, `playwright_test_generator`, `playwright_test_healer`)
y skills en `.claude/skills/`. El servidor MCP `playwright-test` está definido
en `.mcp.json`. Los contratos se validan con `npm run qa:validate`.
