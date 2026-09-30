# Knowledge base funcional — Agentic QA

## Propósito

Esta carpeta contiene conocimiento funcional normalizado para agentes de QA. La fuente original fue una guía interna de onboarding. El contenido duplicado fue consolidado y no se agregaron reglas que no estuvieran respaldadas por la fuente.

## Cómo recuperar el conocimiento

1. Consultar primero este índice.
2. Cargar `glossary.md` cuando aparezcan términos del negocio.
3. Cargar únicamente el dominio necesario para la tarea.
4. Consultar `open-questions.md` antes de asumir un comportamiento no documentado.
5. No tratar los procedimientos de `testing-procedures.md` como comportamiento esperado de producción.

## Índice

| Archivo | Alcance |
| --- | --- |
| `glossary.md` | Conceptos, abreviaturas y términos del negocio |
| `users-and-permissions.md` | Tipos de usuario, perfiles, asociaciones e impersonación |
| `companies.md` | Tipos, habilitaciones y creación de sociedades |
| `invernada.md` | Tropas, estados, cotizaciones y CI de invernada |
| `faena.md` | Tropas, estados, cotizaciones y CI de faena |
| `ofrecimientos-migracion.md` | Matriz de campos legacy, campos dinámicos y delta React/legacy de ofrecimientos |
| `viaje-inmediato.md` | Asignación, visibilidad y carga CSV de Viaje Inmediato |
| `shared-business-rules.md` | Reglas transversales a cotizaciones y compras inmediatas |
| `other-domains.md` | MAG, transportes y dominios mencionados sin detalle |
| `testing-procedures.md` | Datos y procedimientos específicos para testing |
| `knowledge-capture.md` | Criterios y flujo para persistir nuevos hallazgos |
| `open-questions.md` | Vacíos, ambigüedades y reglas pendientes de confirmar |

## Convenciones

- `BR-XXX-NNN`: regla de negocio.
- `FL-XXX-NNN`: flujo funcional.
- `VAL-XXX-NNN`: validación de datos.
- `MAP-XXX-NNN`: equivalencia de estados o vistas.
- `TST-XXX-NNN`: procedimiento o dato exclusivo de testing.
- `OQ-NNN`: pregunta abierta.

Los identificadores son referencias documentales y no identificadores del producto.
