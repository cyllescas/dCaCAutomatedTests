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

---

# Ampliación de exploración — 2026-10-08

- Fecha: 08/10/2026. Ambiente: `https://stage.dcac.ar/`. Rol: cliente.
- Fuente: exploración UI black-box con Playwright MCP (subagente planner).
- Estado: **observaciones**; ninguna se convierte en regla de negocio. Lo que el
  usuario marcó como "confirmado" en `config/ofrecimientos-invernada-cases.md`
  no tiene fuente documentada y se contrasta aquí con lo observado.
- Evidencia: `artifacts/ofrecimientos-invernada/` (capturas 01 a 29), plan en
  `specs/ofrecimientos-invernada.md` (TC-INV-012 a TC-INV-034).
- Los registros del 03/09/2026 de este archivo se conservan sin cambios.

## Observaciones (OBS-INV-001 a OBS-INV-018)

- `OBS-INV-001` Provincia y Partido se muestran como texto en `#_provincia` y
  `#_partido`; los hidden son `#provincia_input` y `#partido_input`
  (`re_provincia`, `re_partido`). Captura 01.
- `OBS-INV-002` El envío es asíncrono: `.btn_ofrecer.env` pasa a "Creando..." y
  la vista cambia a los 3 a 5 s. Hay que esperar `.titulo_tropa_cargada` con
  timeout generoso.
- `OBS-INV-003` Vista de confirmación: la URL no cambia; `.titulo_tropa_cargada`
  dice "Su tropa ha sido creada correctamente."; el texto indica que se puede ver
  como pendiente de publicación dentro de operaciones; enlace
  `.txt_tropa_cargada a` (`/__dcac/misPublicaciones`, texto "operaciones" dentro
  de una frase, no "Mis operaciones"); botón `.btn_topa_cargada a` ("INGRESAR
  NUEVA TROPA"). No se muestra número de lote. Capturas 25 y 26.
- `OBS-INV-004` Pendientes de publicación: `/__dcac/misPublicaciones/pendientespublicacion`;
  ítem `#contenido-listado .listado .titulo_ticket_inv .id_titulo_lote` con el
  lote (por ejemplo `#35417`). Las tropas nuevas figuran en "Procesando Video",
  incluso la enviada sin video.
- `OBS-INV-005` Obligatorios: `.alert_input_faltante.required-<name>` con
  "Debe completar el campo Cantidad / Categoria (sin tilde) / Raza / Plazo de
  venta". Los mensajes de un envío previo no se limpian al corregir hasta
  recargar (OQ-049).
- `OBS-INV-006` Cantidad: input de texto sin filtro. Vacía se rechaza. `0` y
  `-5` se aceptaron y crearon tropas (#35415, #35416). `abc` no generó tropa
  (OQ-044).
- `OBS-INV-007` Segmentación 1/40/1 (suma 42) con Cantidad 50 y Machos 20 +
  Hembras 20 con Cantidad 50 (Terneros y Terneras) se aceptaron y crearon tropa
  (OQ-045, OQ-046). Contradice la regla marcada como confirmada en el caso 21.
- `OBS-INV-008` Video: `#Filedata` sin atributo `accept`. Un M4V de 29 s, un MP4
  de 9 s y un `.txt` muestran "Archivo cargado" (`#barra_progreso_cont`,
  `data-complete="true"`). No hay rechazo ni mensaje de duración. Reemplazar
  re-dispara la carga; no hay control para quitar. El envío sin video prospera
  (`#modal_siguiente` no apareció). OQ-047, relacionada con OQ-032.
- `OBS-INV-009` Alta de sociedad: `#modal_crear` (`#razonsocial`, `#cuit`,
  `#aceptar`, `#cerrar`). CUIT con dígito verificador incorrecto: el modal
  queda abierto, sin mensaje y no se crea nada (OQ-048). CUIT válido: abre
  `#modal_sugerir` ("Datos de la sociedad a crear", `#aceptarSug`); la sociedad
  queda auto-seleccionada con el nombre normalizado. Cerrar con datos cargados
  no persiste.
- `OBS-INV-010` Alta de establecimiento: `#modal-establecimiento-edit`
  (`#Nombre`, `#Provincias`, `#Partido`, `.btn_guardar_est`, `#cerrar`). Con
  sociedad nueva, `#estab_soc` sólo ofrece el placeholder y "+ Nuevo
  Establecimiento". Cerrar no persiste; guardar lo deja seleccionado.
- `OBS-INV-011` Marca Líquida, Destetados, Capados, Zona, Plan sanitario,
  Uniformidad, Sanidad, Tipo de servicio, Inseminación, Garrapata y Mio-Mio son
  **radios** con input oculto: se activan con `label[for=<id>]`.
- `OBS-INV-012` Listas observadas: Calidad 6 a 10 de a 0,5; Estado Corporal 2 a
  5 de a 0,5; Tratamiento Nutricional (Campo Natural, Racionados, A Corral,
  Praderas y/o Verdeos, Otro); Dentición (Diente de leche, 2/4/6 Dientes, Boca
  Llena, 1/2 Diente Arriba, 1/2 Diente, 1/2 Diente Abajo, Liso, "(Aclarar en
  los comentarios)"); Tipo de Rodeo (Rodeo General, Puro controlado, Puro
  Pedigree, Angus MAS); Plazo (`#plazo_select`: Contado, 30 días, 30 y 60 días,
  60 días, 30 / 60 y 90 días, 90 días, Otro); 23 razas más placeholder, iguales
  en `re_raza2`, `re_raza3`, Raza de inseminación y Raza de servicio (estas con
  una opción vacía inicial `0=`); 17 categorías con sus valores.
- `OBS-INV-013` Los mismos controles de servicio se reetiquetan: `in_raza_servicio`
  es "Raza de inseminación" o "Raza de servicio"; `in_toro` es "Toro de
  inseminación" o "Origen de los toros". "A tiempo fijo" viene marcado por
  defecto. Inseminación + repaso suma `in_inicio_repaso`, `in_fin_repaso`,
  `in_toro_raza_repaso` e `in_toro_origen_repaso`.
- `OBS-INV-014` Destetados SÍ muestra `in_fecha_destete`; Capados SÍ muestra
  `in_fecha_capado` ("Fecha de capados"). Las fechas no son obligatorias. Zona
  Lucha y Sucia muestran Garrapata y Mio-Mio; Limpia no. Plan sanitario SÍ no
  muestra campos nuevos (OQ-050).
- `OBS-INV-015` Razas: `.btn_agregar_listado.agr_raza` revela `re_raza2` y
  `re_raza3`; con 3 el botón sigue visible y un cuarto click no agrega nada.
- `OBS-INV-016` Unidad de Edad: Meses en Terneros, Terneras, mixtas, Novillitos,
  Vaquillonas, Novillos, Vaquillonas con cría/preñadas/para madre; Años en
  Vacas de invernada, Vacas con cría, Vacas CUT y Toros. Edad de la cría en
  Meses; Peso promedio de la cría en Kg Netos.
- `OBS-INV-017` MEJ muestra sólo los campos comunes (Estado Corporal,
  Uniformidad, Descarte, Aclaraciones). Reproducido también a mano por el
  usuario; posible bug pendiente con el líder (OQ-043).
- `OBS-INV-018` Vacas con cría y Vacas CUT con cría muestran Tipo de Rodeo;
  Novillitos, Vaquillonas y Novillos muestran Sanidad; Toros no la muestra.

## Diferencias con lo marcado como "confirmado" por el usuario

Casos 4 (no se muestra mensaje de CUIT inválido), 21 (la segmentación que no
suma sí se envía), 24/28/31/32/33 (son radios, no selects), 29 y 30 (textos
con otra capitalización y orden), 55 ("Fecha de capados"), 61 ("A tiempo
fijo" ya viene marcado), 64 (los controles se reetiquetan en lugar de
ocultarse), 65 ("Inicio/Fin del repaso") y el enlace post-envío ("operaciones"
en minúscula, botón "INGRESAR NUEVA TROPA"). El detalle está en el reporte del
planner y en las filas de `specs/ofrecimientos-invernada.md`.

## Envíos reales de esta exploración

Seis envíos con la sociedad `QA-Sociedad-20261008-1` y el establecimiento
`QA-Estab-20261008-1` creados en la sesión (ver `TST-INV-002`). Lotes
observados: #35415, #35416, #35417 y #35418; los dos últimos presumiblemente
#35419 y #35420 (no verificados).


---

# Corrección y re-exploración — 2026-10-09

- Fecha: 09/10/2026. Ambiente: `https://stage.dcac.ar/`. Rol: cliente.
- Fuente: aclaraciones del usuario + re-exploración UI con observación pasiva del tráfico
  de la propia UI. Evidencia: `artifacts/ofrecimientos-invernada/r2-01` a `r2-14`.
- Los registros anteriores se conservan; los de video (`OBS-INV-008`, `OQ-047`) quedan
  **superados** por lo siguiente.

## Aclaraciones del usuario
- No existen validaciones de Cantidad (0, negativa), de segmentación contra la Cantidad ni
  de Machos + Hembras contra la Cantidad. `OBS-INV-006` y `OBS-INV-007` describen ese
  comportamiento; los casos 15, 16, 17, 21 y 67 se DIFIEREN (el usuario considera que deberían validarse; se agregan cuando la app lo implemente; no se automatiza el comportamiento actual).
- La validación del CUIT es por API y el error no se muestra en pantalla; el usuario lo reportará.
- La confirmación usa el enlace "operaciones" y el botón "INGRESAR NUEVA TROPA".

## Observaciones (OBS-INV-019 a OBS-INV-027)
- `OBS-INV-019` La exploración del 08/10 usó `setInputFiles('#Filedata')` y saltó el `onclick`
  real de `input.btn_subir_video` (`jQuery('#Filedata').click(); vmRapidInv.crearLoteVideo();`).
  `crearLoteVideo()` hace `POST /MODULOS/invernada/modulo_crearLote/index.php?parcial=true`
  (devuelve el id del lote como número plano); después la subida va a `upload.php?lote=<id>`.
  Sin ese paso la subida va a `lote=undefined`.
- `OBS-INV-020` `#barra_progreso_cont` / `#texto_progreso` siempre terminan en "Archivo cargado"
  (`data-complete="true"`), aun para un `.txt`: no son oráculo. El resultado real está en
  `#seccion_archivos`: éxito (fondo verde) "Video cargado correctamente. Debe procesarse la versión
  de tu video con definición estándar ... Puede avanzar al siguiente paso." con el enlace "Eliminar
  video cargado"; fallo (fondo rojo) "Aún no se han cargado archivos, compruebe que el formato sea el
  correcto." Tiempo observado: 1 a 16 s.
- `OBS-INV-021` Resultados con sociedad y establecimiento seleccionados: 29 s M4V y 9 s MP4 → éxito;
  4 s MP4 y `.txt` → fallo. El 9 s es válido (no hay mínimo de 10 s). La falla del 4 s en el servidor
  es una excepción no controlada de AWS MediaConvert (`FramerateDenominator` 0) devuelta por
  `upload.php` con HTTP 200; el `.txt` devuelve "formato de archivo no válido.".
- `OBS-INV-022` Sin ubicación seleccionada, el POST parcial devuelve un error SQL de MariaDB, la
  barra dice "Archivo cargado" y `#seccion_archivos` queda vacío.
- `OBS-INV-023` Tras un rechazo, `.btn_subir_video` sigue visible y se puede adjuntar otro archivo;
  el lote parcial se reutiliza. "Eliminar video cargado" abre un `confirm` nativo "¿Desea borrar el
  archivo?" y deja "Aún no se han cargado archivos.". `.btn_ofrecer.env` (un `div`) nunca tiene
  `disabled`; el envío no se bloquea por video rechazado, ausente ni subida en curso.
  `#modal_siguiente` no se disparó (OQ-053).
- `OBS-INV-024` `Ofrecer Tropa` genera `POST .../modulo_crearLote/index.php` (sin query),
  `application/x-www-form-urlencoded`, HTTP 200, `text/html`, cuerpo = id plano (ej. `35568`).
  Ese id coincide con el lote creado al adjuntar el video y con `#NNNNN` de Pendientes
  (`.id_titulo_lote`). Campos enviados (sólo nombres): `re_sociedad_vendedora, re_establecimiento,
  re_provincia, re_partido, Filedata, clear_files, revisacion, perfil, re_cantidad, re_generado_por,
  re_representante, re_categoria, re_peso, in_cabeza_*, in_cuerpo_*, in_cola_*, re_raza, re_raza2,
  re_raza3, in_edad, in_destetados, in_fecha_destete, in_capados, in_zona, in_descarte,
  re_aclaracion_cliente, in_plazo_select, in_plazo, in_desbaste, in_distancia_pesada, re_usuario,
  create, re_revisacion`.
- `OBS-INV-025` El enlace "operaciones" (`.txt_tropa_cargada a`, `/__dcac/misPublicaciones`) abre
  "Operaciones - Ventas de Invernada" en Pendientes Publicación (la navegación tarda 3 a 6 s).
  Solo la pestaña Cerradas tiene búsqueda (`#texto-buscar-cerradas`, `#lv_search`,
  `POST .../ajax/buscarcerradas`); no hay búsqueda por id en Pendientes (OQ-054).
- `OBS-INV-026` Ítem de Pendientes: `.tit_cant_cat` "50 Terneros", `.tit_peso` "250 Kg",
  `.tit_razas`, `.razon_social_titulo`, `.id_titulo_lote` `#<id>`, `.dato_fecha`, "Procesando
  Video" (`.txt-procesando`), Operador "Sin Asignar", Estab. "<partido>, <provincia>".
  "Informe de la Tropa" (`button.modal-informe`) abre `#modal-informe`: tab 1 segmentación
  (`#segmentacion_de_tropa`, `#peso_promedio` "250.00 Kg"), tab 2 características
  (`#caracteristicas_de_tropa`: cantidad, edad con "Meses", capados, destetados, zona, etc.).
  El plazo de venta no se muestra en ningún lado (OQ-056); fechas vacías se muestran como
  `00/00/0000` (OQ-057).
- `OBS-INV-027` Cada click en "Adjuntar Filmación" crea un lote parcial en stage; los que no se
  envían quedan huérfanos (OQ-055).

## Hallazgos de calidad para triage (no confirmados como defecto)
- `upload.php` devuelve el volcado de una excepción PHP con stack trace y rutas internas (HTTP 200).
- `modulo_crearLote?parcial=true` devuelve texto de error SQL cuando falta la ubicación.
- La UI informa "Archivo cargado" aunque el servidor rechace el archivo.

## Envíos reales de esta re-exploración
Dos tropas: #35568 (flujo completo) y #35578 (envío con subida en curso), más lotes parciales
huérfanos #35561 a #35567 entre otros. Total de envíos reales de la exploración: 8.
