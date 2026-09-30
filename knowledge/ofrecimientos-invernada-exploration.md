# Hallazgos de exploración — Ofrecimientos de invernada legacy

- Fecha: 03/09/2026.
- Ambiente: `https://stage.dcac.ar/`.
- Fuente: exploración UI black-box con Playwright MCP.
- Rol: cliente autenticado mediante configuración local.

## Confirmado

- `Cotizar` lleva a `Cotizar lote para Invernada / Cría` y la pantalla muestra
  `Publicar una tropa de Invernada`.
- Selectores observados: `#sociedad_select`, `#estab_soc`,
  `#categoriasSelect`, `#plazo_select`, `.btn_ofrecer.env`, `#modal_crear`,
  `#modal-establecimiento-edit`, `#razonsocial`, `#cuit` y campos por `name`
  como `re_cantidad`, `re_peso`, `re_raza`, `in_edad`, `in_calidad`,
  `in_tratamiento_nutricional`, `in_estado_corporal`, `in_descarte`,
  `in_desbaste`, `in_distancia_pesada` y `re_aclaracion_cliente`.
- El formulario expone categorías simples, mixtas, con cría, preñadas,
  `Vaquillonas para madre` y `Toros`. Las mixtas exponen cantidad de machos y
  hembras; las de cría exponen edad y peso de la cría.
- Las categorías preñadas muestran Tipo de Servicio con Inseminación,
  Servicio Natural e Inseminación + repaso. Servicio Natural mostró Inicio y
  Fin del servicio, Raza de servicio y Origen de los toros; repaso mostró
  Inicio y Fin del repaso.
- Zona Lucha y Sucia mostró los campos Garrapata y Mio-Mio.
- El envío vacío mostró `Debe completar el campo Cantidad`, `Debe completar el
  campo Raza` y `Debe completar el campo Plazo de venta`.
- Las altas nuevas abrieron diálogos con campos observables y fueron
  canceladas sin persistir datos.

## Incertidumbres y límites

Se ejecutaron altas positivas aisladas con datos generados en runtime. En la
alta de sociedad, `Guardar` abre una confirmación de datos y `Aceptar` completa
el guardado; la nueva sociedad aparece seleccionada en `#sociedad_select` y la
UI puede normalizar mayúsculas del nombre. En la alta de establecimiento,
provincia y partido deben quedar seleccionados antes de `Guardar`; luego el
registro aparece en `#estab_soc`.

No se convierten en reglas las OQ-005,
OQ-006, OQ-010, OQ-012, OQ-014, OQ-030, OQ-032, OQ-033, OQ-034, OQ-035, OQ-036
y OQ-037.

## Evidencia

- `artifacts/ofrecimientos-invernada-legacy-exploration.png`
- Snapshots y consola de la sesión bajo `.playwright-mcp/`.
