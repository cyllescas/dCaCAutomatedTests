# Procedimientos y datos de testing

> Este archivo describe preparación de datos o workarounds de testing. No representa necesariamente el comportamiento esperado en producción.

## Ambiente y procesamiento programado

- `TST-FAE-001`: en el ambiente de testing documentado, el proceso programado de cotizaciones de faena se ejecuta cada 10 minutos, en minutos múltiplos de 10 respecto de la hora indicada por la fuente.
- `TST-FAE-002`: al activar una cotización de faena, puede elegirse `Confirmar sin notificar` para evitar el envío real de correo durante la prueba.
- `TST-FAE-003`: la guía sugiere sociedades de prueba cuyo nombre comienza con `hill…` como comprador y planta objetivo. No se proporciona una identidad completa estable.

## Datos de prueba documentados

- Admin con capacidad observada para editar CR: `dcac-97464@mailnesia.com`.
- Sociedad o cuenta transportista usada para pruebas: `dcac-16023@mailnesia.com`.

Estos datos pueden vencer o cambiar. Verificar su disponibilidad antes de utilizarlos y no reutilizarlos como regla de permisos.

## Preparación del estado “Comprobante en proceso”

`TST-INV-001`

Objetivo: preparar una tropa para verificar que el cliente vea el aviso de comprobantes en proceso.

1. En Stage Admin, ir a `Invernada` → `Liquidadas`.
2. Elegir una tropa cuyo plazo de pago calculado desde la fecha de cargo, o fecha seleccionada, no haya superado la fecha actual.
3. Ingresar al legajo e intentar pasarla a cerrada.
4. La guía indica que el botón aparece deshabilitado y propone eliminar el atributo HTML `disabled` desde DevTools para habilitar el clic.
5. Verificar el mensaje de éxito y que la tropa cambie de estado.
6. Buscar la tropa en el nuevo estado y agregar el cliente de prueba a la sociedad vendedora.
7. En la aplicación React de Stage, con vista cliente, ir a `Operaciones` → `Invernada` → `Ventas` → `Operaciones con saldo`.
8. Buscar la tropa y desplegar `Ver completo`.
9. Verificar el aviso de comprobantes en proceso dentro de `Datos de liquidación`.

### Advertencia

Eliminar `disabled` sólo modifica el DOM del navegador. Este procedimiento depende de que el backend acepte una transición que la interfaz bloquea; por eso debe considerarse un workaround de preparación de datos, no un flujo válido del usuario. Antes de automatizarlo, conviene disponer de una API, fixture o mecanismo formal de setup.
