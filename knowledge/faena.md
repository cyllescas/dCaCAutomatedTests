# Faena

## Campos del ofrecimiento y migración

La matriz completa de campos legacy, campos por categoría y diferencias entre
`stage.dcac.ar` y `react-stage.dcac.ar` está en
[`ofrecimientos-migracion.md`](ofrecimientos-migracion.md). Para Faena React se
confirmó documentalmente que Tipo de Jaula dejó de seleccionarse (se opera por
defecto como simple) y que Plazo de venta dejó de solicitarse. No asumir otros
campos del Excel como presentes en React sin exploración.

## Creación de tropa

### Cliente o representante

`FL-FAE-001`

1. Ir a `Cotizar` → `Faena`.
2. Completar el formulario.
3. La tropa queda visible en `Mis operaciones` → `Faena` → `Venta` → `Pendientes de publicación`.
4. El Admin la ve en `Faena` → `Ofrecimientos`.

### Admin

- `FL-FAE-002`: desde cualquier estado excepto `Negocios terminados`, seleccionar `Crear lote`.
- Puede crear una tropa nueva o duplicar una existente.

## Equivalencia de estados

`MAP-FAE-001`

| Estado Admin | Estado cliente |
| --- | --- |
| Ofrecimientos | Pendientes de publicación |
| Publicados | Publicadas |
| Vendidas | Vendidas / Compradas |
| A cargar | A Cargar |
| Cargadas | Cargadas (vendedor) / Recibidas (comprador) |
| Faenadas | Faenadas |
| A liquidar | Faenadas |
| Liquidadas | Faenadas |
| Directos Cerrada | Cerradas |
| Pagos vencidos | Operaciones con saldo (vendedor) / Pendientes de pago (comprador) |
| Negocios cerrados | Cerradas |
| Dadas de baja | No concretados |
| No concretados | No concretados |

## Cotización de faena

`FL-FAE-003`

Precondición: tropa en `Publicadas`.

1. Como Admin, ingresar a `Faena` → `Publicadas` y buscar la tropa.
2. Abrir `Cotización` → `Nueva cotización`.
3. Completar los campos.
4. Enviar la cotización o crearla ya aceptada desde la simulación de precios.
5. Para que el vendedor la vea, seleccionar `Activar y programar notificación` y confirmar el modal.
6. Esperar el procesamiento programado.
7. Tras la aceptación, ejecutar `Copiar en condiciones pactadas`.

### Campos documentados

| Campo | Significado o regla |
| --- | --- |
| Rendimiento | Rendimiento esperado; la fuente menciona valores aproximados a 4 sin indicar unidad. |
| Fecha de faena | Fecha prevista para la faena. |
| Encierre | `24 hs`, `Tarde anterior` o `Sin encierre`. |
| Desbaste | Porcentaje esperado de pérdida de peso. |
| Comprador objetivo | Posible comprador. |
| Planta objetivo | Posible planta faenadora. |
| Comisión comprador | Comisión aplicable al comprador. |
| AEP comprador | Días estimados de demora del comprador. |
| Plazo comprador | Plazo de pago del comprador. |
| Tipo de precio a mostrar | `Kg vivo`, `Kg carne` o ambos. Si se eligen ambos, se requiere uno predeterminado. |
| TP2 | Si se activa, requiere un porcentaje. |
| Flete | `A retirar`, `Puesto en planta` o ambos. Si se eligen ambos, se requiere uno predeterminado. |
| Distancia | Distancia asociada a `Puesto en planta`. |

- `VAL-FAE-001`: si se muestran ambos tipos de precio, debe seleccionarse uno predeterminado.
- `VAL-FAE-002`: si se habilitan ambas modalidades de flete, debe seleccionarse una predeterminada.
- `VAL-FAE-003`: si TP2 es `Sí`, debe informarse un porcentaje.
- `VAL-FAE-004`: debe verificarse si `Distancia` es obligatoria cuando se selecciona `Puesto en planta`; la fuente sólo establece la relación funcional.

## Compra Inmediata de faena

`FL-FAE-004`

Precondiciones:

- Tropa en `Publicadas`.
- Cotización aceptada y copiada en condiciones pactadas.
- Sociedades habilitadas para compra de faena.

Carga:

1. Preparar una copia de la planilla modelo en Google Sheets.
2. Consultar `CID` → `Cargar datos de CSV` → `Formato esperado` para conocer las columnas.
3. Actualizar como mínimo los datos que correspondan, incluidos el ID de tropa y los ID de segmentación.
4. El ID de tropa se ubica en la primera columna.
5. Obtener el ID de segmentación desde `CID` → `Ver borradores` → `ID segmentación`; si aparecen varios, la fuente indica usar el primero.
6. Exportar la planilla como CSV desde Google Sheets.
7. Cargarla mediante `Cargar datos desde CSV`.
8. Verificar que aparezca `Compra inmediata creada`.
9. Revisar y editar la CI en `Borradores`.
10. Iniciar el envío cuando los datos sean correctos.

- `BR-FAE-001`: la CI de faena utiliza una secuencia de envíos con sociedades exclusivas y grupos.
- `BR-FAE-002`: durante el turno de una sociedad exclusiva, sólo sus integrantes pueden ver la CI.
- `BR-FAE-003`: al vencer su tiempo, la visibilidad pasa a la siguiente sociedad exclusiva o grupo.
- `BR-FAE-004`: un grupo contiene varias sociedades que ven la CI simultáneamente.
- `BR-FAE-005`: una sociedad exclusiva también puede integrar un grupo.
- `VAL-FAE-005`: la carga debe realizarse con CSV exportado desde Google Sheets; la fuente indica que Excel de escritorio produce errores.

La estructura completa del CSV, la duración de cada turno y las reglas ante CSV inválido no están incluidas en la fuente.
