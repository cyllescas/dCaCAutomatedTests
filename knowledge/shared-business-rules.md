# Reglas compartidas de comercialización

## Cotizaciones

- `BR-COM-001`: la cotización es la propuesta enviada al vendedor para comprar su tropa.
- `BR-COM-002`: cuando el vendedor acepta la cotización, la tropa queda vendida.
- `BR-COM-003`: las cotizaciones se crean mientras la tropa está en `Publicadas`.
- `BR-COM-004`: después de aceptar una cotización, un usuario habilitado debe ejecutar `Copiar en condiciones pactadas` para que sus datos aparezcan en el legajo.
- `BR-COM-005`: una tropa sin cotización se representa en gris; una cotización activa, en azul; una aceptada, en verde; una vencida, en amarillo; una aceptada y vencida, en verde y amarillo; una rechazada, en rojo; una rechazada con solicitud de recotización, en naranja.

Faena agrega el estado visual rosa para cotizaciones en borrador. No se documenta ese color para cotizaciones de invernada.

## Compras Inmediatas o Dinámicas

- `BR-CI-001`: una CI se envía a posibles compradores de una tropa.
- `BR-CI-002`: se crea mientras la tropa está en `Publicadas`.
- `BR-CI-003`: cuando existe una CI, la tropa sólo es visible para los compradores habilitados o seleccionados para esa CI.
- `BR-CI-004`: puede haber varios posibles compradores, pero la tropa se asigna al primero que acepta.
- `BR-CI-005`: después de la primera aceptación, la CI deja de estar visible para los demás posibles compradores.
- `BR-CI-006`: cada comprador recibe una configuración personalizada y puede variar parámetros dentro de las opciones disponibles.
- `BR-CI-007`: colores de CI: gris sin CI, rosa borrador no visible, azul disponible y verde aceptada.

## Riesgo de concurrencia

La regla “el primero que acepta se la lleva” implica que la aceptación debe ser atómica. Los casos de prueba deben contemplar aceptaciones simultáneas, actualización de visibilidad y prevención de doble asignación.
