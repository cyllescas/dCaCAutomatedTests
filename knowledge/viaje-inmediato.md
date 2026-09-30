# Viaje Inmediato (VI)

## Alcance

- `BR-VI-001`: Viaje Inmediato se gestiona en la rama `transporte.dcac.ar`.
- `BR-VI-002`: para crear la sección de VI de una tropa, es preferible crear el viaje cuando la tropa se encuentra en `Vendidas`.

## Elegibilidad y estados de la tropa

- `BR-VI-003`: desde el estado `A cargar` se puede enviar una VI si no existen viajes en estado `Realizado`.
- `BR-VI-004`: los viajes en estado `A realizar` no bloquean el envío de una VI desde `A cargar`.
- `BR-VI-005`: el estado del viaje cambia a `Realizado` cuando la tropa cambia a `Cargadas`.
- `BR-VI-006`: si una tropa está en `Cargadas` y luego vuelve a `A cargar`, el transportista continúa visualizándola en `Realizadas`.

## Creación y envío

`FL-VI-001`

1. Ir a `Transportes` → `Viajes a asignar` → `Por asignar`.
2. Seleccionar `Crear Viaje Inmediato`.
3. Preparar y cargar el CSV correspondiente.
4. Tras la carga, el viaje queda en estado `Con viaje inmediato`.
5. Ingresar a `Ver viaje inmediato` para enviarlo.

- `BR-VI-007`: un viaje aceptado mientras la tropa aún sigue en `Vendidas` no es visible para el transportista.
- `BR-VI-008`: al crear la VI, el legajo incorpora una sección nueva de `Viaje inmediato`.

## CSV de Viaje Inmediato

Precondiciones:

- `BR-VI-009`: la tropa debe estar a cargo de DCAC para cargar el CSV.
- `VAL-VI-001`: se requiere el número de flete, ya que una tropa puede tener más de un viaje.

Campos requeridos documentados:

| Campo | Regla |
| --- | --- |
| Fecha de carga | No admite fechas anteriores al día actual. |
| Responsable de carga | Requerido. |
| Distancia | Requerida. |
| Número de flete | Requerido para armar el CSV. |

## Agrupación y segmentación

- `BR-VI-010`: en faena, pueden enviarse viajes juntos cuando comparten fecha de carga, origen y destino.
- `BR-VI-011`: los destinatarios exclusivos también se incorporan como parte del primer grupo.

La fuente no define la estructura de grupos, el orden exacto de envío ni la interpretación funcional de “exclusivos”.

## Cambios posteriores a la aceptación

- `BR-VI-012`: si se modifica el legajo luego de que el transportista aceptó la VI, el transportista visualiza los datos actualizados.
- `BR-VI-013`: ese cambio no informa al transportista que se modificaron los datos.

### Riesgo funcional

Esta actualización silenciosa puede afectar la trazabilidad y la operación logística. Los casos de prueba deberían verificar qué campos se propagan, si se registra auditoría y si la aplicación protege cambios sensibles después de la aceptación.
