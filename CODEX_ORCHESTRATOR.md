# Codex QA Orchestrator

Desde la raíz del proyecto, pedir a Codex que ejecute un flujo para un feature
de `config/`. Debe leer `AGENTS.md`, el YAML, el knowledge relevante y los
skills; crear un plan en `specs/`; y detenerse para aprobación humana exacta:
`approved` o `aprobado`.

La exploración debe terminar antes de crear el plan y debe dejar selectores
observados para los casos automatizables. Si faltan selectores, el caso queda
explícitamente como no automatizable con su motivo; no se puede guardar el
plan con selectores `UNKNOWN` o inventados. El generator solo puede ejecutarse
después de la aprobación.

Una carga o acción bloqueada durante más de 10 minutos (600000 ms) debe
informarse en consola con una propuesta de solución para aprobación humana.
Después se cierra el navegador y se detiene el flujo sin guardar el plan. El
navegador también se cierra al finalizar la exploración normalmente.

Después de la aprobación, el generator debe inspeccionar primero los Page
Objects, helpers y specs existentes, reutilizarlos y crear Cypress JavaScript
trazable al plan. El healer sólo se usa ante fallos y debe preservar la
intención de las aserciones. No se crean tickets externos automáticamente.

Ejemplo:

Cada exploraciÃ³n tambiÃ©n debe extender `knowledge/` antes de cerrar el flujo:
registrar hallazgos, evidencia, preguntas abiertas y selectores observados en
el archivo de dominio correspondiente. No se deben sobrescribir registros
anteriores; un cambio se documenta como una nueva entrada fechada, conservando
el selector o hallazgo anterior y su estado. Los selectores del conocimiento
deben coincidir con los observados y quedar implementados en Page Objects.
Seguir `knowledge/knowledge-capture.md` para la clasificaciÃ³n y trazabilidad.

```text
Ejecutá el flujo QA para config/login-dcac.yaml
```
