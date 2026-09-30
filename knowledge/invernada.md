# Invernada

## Campos dinámicos del ofrecimiento

La matriz legacy y el delta documentado de React están en
[`ofrecimientos-migracion.md`](ofrecimientos-migracion.md). El formulario debe
modelarse por categoría y por dependencias: categorías con cría, categorías
preñadas según Tipo de servicio, Toros, y condiciones de Zona/Balanza. La
ausencia o ubicación distinta de campos en React es un hallazgo de migración,
no una regla para eliminar automáticamente los casos legacy.

## Creación de tropa

### Cliente o representante

`FL-INV-001`

1. Ir a `Cotizar` → `Invernada/Cría`.
2. Completar el formulario.
3. La tropa queda visible para el usuario en `Mis operaciones` → `Invernada` → `Venta` → `Pendientes de publicación`.
4. El Admin la visualiza en `Invernada` → `Ofrecimientos`.

### Admin

- `FL-INV-002`: desde cualquier estado excepto `Negocios terminados`, seleccionar `Crear lote`.
- El Admin puede crear una tropa nueva o duplicar una existente.

## Equivalencia de estados

`MAP-INV-001`

| Estado Admin | Estado cliente |
| --- | --- |
| Ofrecimientos | Pendientes de publicación |
| Publicadas | Publicadas |
| Vendidas | Vendidas / Compradas |
| A Cargar | A Cargar |
| Cargadas | Cargadas (vendedor) / Recibidas (comprador) |
| A liquidar | Entregadas (vendedor) / Recibidas (comprador) |
| Liquidadas | Entregadas (vendedor) / Recibidas (comprador) |
| Invernada Cerrada | Cerrada |
| Pagos vencidos | Operaciones con saldo (vendedor) / Pendientes de pago (comprador) |
| Negocios terminados | Cerradas |
| No concretadas | No concretadas |
| Dados de baja | No concretadas |

## Cotización de invernada

`FL-INV-003`

Precondición: tropa en `Publicadas`.

1. Como Admin, buscar la tropa.
2. Abrir `Cotización` → `Nueva cotización`.
3. Completar los campos.
4. Seleccionar al menos tres plazos de precios.
5. Elegir `Crear cotización` o `Crear cotización aceptada`.
6. Tras la aceptación, ejecutar `Copiar en condiciones pactadas`.

### Campos documentados

| Campo | Significado o regla |
| --- | --- |
| Tabla | Precio por kilogramo. |
| Tabla desde | Peso mínimo desde el que aplica el precio de tabla. |
| Tope | Peso máximo. |
| Tabla menos | Importe por kg excedente según el rango documentado; fórmula pendiente de confirmar. |
| Desbaste | Pérdida de peso esperada. |
| Balanza | Lugar donde se pesa la tropa. |
| Destino | Zona de destino. Si vale `Ambas`, el cliente no ve un valor; sólo ve `Zona sucia` o `Zona limpia`. Se modifica desde el legajo. |
| Precio | Precio ofrecido al vendedor. |
| Plazo base | Días y porcentaje del plazo predeterminado; el vendedor puede variarlo usando los otros plazos ofrecidos. |
| TP2 | Si se activa, requiere un porcentaje. |

- `VAL-INV-001`: deben seleccionarse como mínimo tres plazos de precios.
- `VAL-INV-002`: si TP2 es `Sí`, debe informarse un porcentaje.

## Compra Inmediata de invernada

`FL-INV-004`

Precondiciones:

- La tropa está en `Publicadas`.
- Existe una cotización aceptada y copiada en condiciones pactadas en el legajo.
- Las sociedades destinatarias tienen habilitada la Compra Inmediata de Invernada.

Pasos:

1. Abrir `CI`.
2. En `HCI Sociedades`, seleccionar las sociedades destinatarias.
3. Completar los campos.
4. Seleccionar `Agregar y Habilitar`.
5. La tropa queda visible para el destinatario en la home como `Compra Inmediata disponible`.
6. La acción `Enviar` remite un correo sólo a los usuarios inscriptos en las notificaciones correspondientes de la sociedad.

### Campos y validaciones

- `VAL-INV-003`: son obligatorios Precio, Opción 1, Cuota 1, Cuota 2, Tasa, AEP y Rendimiento esperado, según la lista explícita de la fuente.
- `VAL-INV-004`: debe existir al menos una opción de pago.
- `VAL-INV-005`: cada opción admite como máximo dos cuotas.
- `VAL-INV-006`: la suma porcentual de ambas cuotas debe ser 100 %. Puede utilizarse 100 % en la primera cuota.

| Campo | Significado o regla |
| --- | --- |
| Precio | Precio base ofrecido al comprador. |
| Opción | Alternativa de pago con un máximo de dos cuotas. |
| Cuota 1 / Cuota 2 | Días y porcentaje a pagar en cada vencimiento. |
| Tasa | Tasa aplicada a la operación. |
| AEP | Plazo estimado por demora habitual de pago. |
| Gastos comerciales | Opcional. |
| Bonificación | Opcional. |
| Rendimiento esperado | Rendimiento estimado; la fuente indica que suele ser menor o igual a 10 %, pero no lo define como límite técnico. |
| TP2 | Porcentaje del valor total bajo la condición TP2. |
