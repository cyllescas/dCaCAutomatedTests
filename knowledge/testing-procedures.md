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

## Datos que se acumulan en Stage por las pruebas de invernada

`TST-INV-002`

- Cada envío de un ofrecimiento de invernada legacy crea una tropa real en
  Stage (Pendientes de publicación); la autorización vigente del usuario no
  exige borrarlas. La frecuencia de ejecución queda por validar con el líder.
- Las altas de sociedad y establecimiento de las pruebas dejan registros con
  prefijo `QA-`; en el select de sociedades ya existen muchas "Qa Sociedad
  Invernada <timestamp>" de corridas anteriores y una opción `undefined`.
- La exploración del 2026-10-08 creó seis tropas (lotes observados #35415 a
  #35418) y la sociedad y el establecimiento `QA-...-20261008-1`.
- Los videos de prueba no se versionan (`cypress/fixtures/*.mp4`); ver
  `README.md` para las variables `INVERNADA_VIDEO_PATH` e
  `INVERNADA_VIDEO_SHORT_PATH`.
- Re-exploración 2026-10-09: tropas #35568 y #35578, más lotes parciales huérfanos (por ejemplo #35561 a #35567) creados por cada click en "Adjuntar Filmación". Hay también una tropa previa "-5 Terneros" (#35416) de la exploración del 2026-10-08.
- Para observar `tropaId` en pruebas: el request `POST .../modulo_crearLote/index.php` sin `?parcial=true` devuelve el id plano; usar sólo como observación pasiva (ver `specs/ofrecimientos-invernada.md`, TC-INV-033).
- Generación de specs (2026-10-09): el generator hizo 7 envíos reales adicionales (por ejemplo #35609) y unos 7 lotes parciales huérfanos por los casos de video.
- Decisión del usuario (2026-10-09): para obtener el `tropaId` se acepta `cy.intercept` pasivo sobre `modulo_crearLote/index.php` (no hay otra forma); aislado en `cypress/support/helpers/invernada_trace_helper.js`.
- Para filtrar los envíos de invernada por categoría: `CYPRESS_INVERNADA_SUBMIT_CATEGORIES="Terneros,Vacas preñadas"`; vacío corre las 17 (crea 17 tropas reales).
