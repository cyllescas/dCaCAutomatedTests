# Exploración — legajo de Invernada y usuario comprador

- `TST-INV-002` (2026-09-25, Stage, rol Admin): el flujo observable para llegar al legajo es `Invernada` → `Vendidas` → `Ver Legajo`; la sección `Información Comprador` expone `Editar`, selector custom de usuario, `Guardar` y `Anular edición`.
- `TST-INV-003` (2026-09-25, Stage, rol Admin): el selector custom expone `Sin definir` y usuarios dinámicos; no deben fijarse nombres ni identificadores en fixtures compartidos.
- `TST-INV-004` (2026-09-25, Stage, rol Admin): al guardar una selección elegible, la reapertura del formulario conservó la selección, mientras que la vista de solo lectura mostró `No disponible`. Mantener como observación pendiente de confirmación, no como regla de negocio. Evidencia: `artifacts/legajo-invernada-comprador-after-save.yml` y `artifacts/legajo-invernada-comprador-reopen-after-save.yml`.

