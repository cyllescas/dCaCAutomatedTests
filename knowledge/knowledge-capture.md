# Persistencia de conocimiento

Este archivo define cómo incorporar al `knowledge/` los hallazgos obtenidos
durante exploraciones, ejecuciones de Cypress y validaciones funcionales.

## Qué se incorpora

- Reglas observables confirmadas: usar identificadores `BR-XXX-NNN`.
- Flujos reproducibles: usar `FL-XXX-NNN`.
- Validaciones observables: usar `VAL-XXX-NNN`.
- Equivalencias de estados o vistas: usar `MAP-XXX-NNN`.
- Datos, workarounds o condiciones propias del ambiente de prueba: usar
  `TST-XXX-NNN` y mantenerlos separados de las reglas de producción.
- Comportamientos todavía no confirmados: agregarlos a `open-questions.md` como
  `OQ-NNN`, sin convertirlos en expectativa automatizada.

## Criterio de evidencia

Cada conocimiento nuevo debe indicar, cuando sea posible:

- fuente o escenario que lo originó;
- fecha y ambiente;
- rol utilizado;
- comportamiento observado y resultado esperado, si corresponde;
- referencia a la spec, screenshot, video o reporte bajo `artifacts/`.

No guardar credenciales, tokens, resultados de base de datos, identificadores
reales ni datos personales en archivos compartidos. Los datos dinámicos deben
resolverse mediante configuración local o variables de entorno.

## Flujo de actualización

1. Durante la exploración, registrar el hallazgo como provisional.
2. Clasificarlo en el archivo de dominio correspondiente (`faena.md`,
   `companies.md`, etc.).
3. Si depende del ambiente o de un workaround, usar `testing-procedures.md`.
4. Si no hay evidencia suficiente o existe ambigüedad, actualizar
   `open-questions.md` en lugar de inventar una regla.
5. Referenciar el nuevo identificador desde los planes de `specs/` y los
   `config/` que lo utilicen.
6. Sólo después de revisión humana usarlo como expectativa automatizada.

El conocimiento es acumulativo: no se reemplazan hallazgos previos sin dejar
constancia de la nueva evidencia o de la razón del cambio.
