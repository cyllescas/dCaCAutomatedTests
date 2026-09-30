# Catálogo de perfiles de datos de prueba

## Política de datos

Este archivo describe perfiles, no credenciales ni identificadores concretos. Resolver usuarios, sociedades y lotes dinámicamente con `database-validation.md`, verificar su estado al inicio y restaurar cualquier modificación autorizada al finalizar.

## Perfiles reutilizables

| ID | Perfil | Uso esperado |
| --- | --- | --- |
| `TD-001` | Cliente comprador de invernada con operaciones sólo cerradas | Validar establecimiento, vistas de cerradas y acciones restringidas sobre historial. |
| `TD-002` | Cliente comprador de faena con operaciones sólo cerradas | Validar vistas de cerradas de faena. |
| `TD-003` | Usuario multi-sociedad sin DCP habilitado | Validar ausencia de botón/acceso DCP. |
| `TD-004` | Usuario con sociedad financiera habilitada y CUIT ausente o inválido | Validar manejo de precondiciones DCP y mensajes de error. |
| `TD-005` | Sociedad habilitada para CI de invernada | Crear y visualizar CI de invernada. |
| `TD-006` | Sociedad habilitada para compra de directo y CI de faena, con Matrícula y ONCCA | Crear, visualizar o aceptar CI de faena. |
| `TD-007` | Tropa de invernada publicada con cotización aceptada copiada al legajo | Crear CI de invernada. |
| `TD-008` | Tropa de faena publicada con cotización aceptada copiada al legajo | Cargar CI de faena por CSV. |
| `TD-009` | Tropa en `A cargar` a cargo de DCAC, sin viaje realizado | Crear y cargar Viaje Inmediato. |
| `TD-010` | Tropa liquidada con plazo de pago no vencido | Preparar la validación de comprobantes en proceso, mediante mecanismo autorizado. |

## Precauciones

- Un mismo usuario puede pertenecer a varias sociedades: no inferir permisos a partir de una sola sociedad.
- Los perfiles DCP que manipulan CUIT o habilitación financiera deben aislarse de pruebas paralelas.
- Evitar datos ya usados por otro re-test; la fuente registra modificaciones concurrentes en la base de testing.
- Los datos históricos del registro de re-tests son pistas de búsqueda, no fixtures permanentes.
