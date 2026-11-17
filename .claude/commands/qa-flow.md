---
description: Ejecuta el flujo QA agentic (planner → aprobación → generator → Cypress → healer) para un feature de config/
argument-hint: config/<feature>.yaml
---

Ejecutá el flujo QA para `$ARGUMENTS`.

## Fase 1: Contexto
1. Leé `CLAUDE.md`, el YAML indicado, los archivos de `knowledge/` que el YAML
   lista en `knowledge:` (más `knowledge/open-questions.md`) y los skills
   relevantes de `.claude/skills/`.

## Fase 2: Plan (planner)
2. Delegá al subagente `playwright_test_planner` pasándole el contenido del
   YAML y el contexto relevante. La exploración debe terminar antes de crear el
   plan y dejar selectores observados para los casos automatizables. Si faltan
   selectores, el caso queda explícitamente como no automatizable con su
   motivo; no se puede guardar el plan con selectores `UNKNOWN` o inventados.
3. Una carga o acción bloqueada más de 10 minutos (600000 ms) se informa en
   consola con una propuesta de solución para aprobación humana; se cierra el
   navegador (`browser_close`) y se detiene el flujo sin guardar el plan. El
   navegador también se cierra al finalizar la exploración normalmente.
4. El plan queda en `specs/<feature>.md` (español, con `Automation Handoff` en
   inglés).

## Fase 3: Conocimiento
5. Extendé `knowledge/` antes de cerrar la exploración: hallazgos, evidencia,
   preguntas abiertas y selectores observados en el archivo de dominio
   correspondiente. No sobrescribas registros anteriores: un cambio se
   documenta como nueva entrada fechada conservando el selector o hallazgo
   previo y su estado. Seguí `knowledge/knowledge-capture.md`.

## Compuerta de aprobación
6. DETENETE y pedí revisión humana del plan. Solo continuá si el usuario
   responde exactamente `approved` o `aprobado`. El generator no puede
   ejecutarse antes.

## Fase 4: Automatización (tras la aprobación)
7. Delegá a `playwright_test_generator`: inspecciona Page Objects, helpers y
   specs existentes, los reutiliza y crea `cypress/e2e/<feature>/*.cy.js`
   trazable al plan.
8. Ejecutá `npm run qa:validate` y corregí incumplimientos de contrato.
9. Ejecutá Cypress sobre los specs generados. Solo ante fallos delegá a
   `playwright_test_healer`, que debe preservar la intención de las
   aserciones. Los fallos se clasifican como `UNKNOWN` hasta analizarlos.

No crear tickets externos automáticamente.
