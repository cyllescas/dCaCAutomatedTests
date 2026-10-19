# Hallazgos de exploración — Ofrecimientos de invernada legacy

Resumen consolidado de las exploraciones del 03/09, 08/10, 09/10 y 13/10/2026.
Ambiente `https://stage.dcac.ar/`, UI black-box con Playwright MCP (cliente y, el 13/10, Admin).
Son **observaciones**, no reglas de negocio; las dudas están en `open-questions.md`.
Evidencia: `artifacts/ofrecimientos-invernada/` (capturas 01-29 y r2-01 a r2-14),
`artifacts/ofrecimientos-invernada-legacy-exploration.png`, `.playwright-mcp/`.
Planes: `specs/ofrecimientos-invernada.md` y `specs/ofrecimientos-invernada-legajo-admin.md`.

## Formulario (Cotizar > Invernada/Cría)

- Selectores base: `#sociedad_select`, `#estab_soc`, `#categoriasSelect`, `#plazo_select`,
  `.btn_ofrecer.env` (un `div`, nunca `disabled`), `#modal_crear` (`#razonsocial`, `#cuit`,
  `#aceptar`, `#cerrar`), `#modal-establecimiento-edit` (`#Nombre`, `#Provincias`, `#Partido`,
  `.btn_guardar_est`), campos por `name`: `re_cantidad`, `re_peso`, `re_raza`, `in_edad`,
  `in_calidad`, `in_tratamiento_nutricional`, `in_estado_corporal`, `in_descarte`, `in_desbaste`,
  `in_distancia_pesada`, `re_aclaracion_cliente`.
- Provincia y Partido: texto en `#_provincia`/`#_partido` (hidden `#provincia_input`, `#partido_input`).
- Obligatorios: Cantidad, Categoria (sin tilde), Raza y Plazo de venta →
  `.alert_input_faltante.required-<name>` "Debe completar el campo …". Los mensajes no se limpian
  al corregir hasta recargar (OQ-049).
- 17 categorías: simples, mixtas (Machos/Hembras), con cría (edad y peso de la cría; Edad en Meses,
  peso en Kg Netos), preñadas, Vaquillonas para madre y Toros. Unidad de Edad: Meses en Terneros,
  Terneras, mixtas, Novillitos, Vaquillonas, Novillos y las vaquillonas con cría/preñadas/para madre;
  Años en Vacas de invernada, Vacas con cría, Vacas CUT y Toros. MEJ sólo muestra los campos
  comunes (OQ-043). Vacas con cría y Vacas CUT con cría muestran Tipo de Rodeo; Novillitos,
  Vaquillonas y Novillos muestran Sanidad; Toros no.
- Preñadas: Tipo de Servicio (Inseminación, Servicio Natural, Inseminación + repaso; "A tiempo fijo"
  viene marcado). Los controles se reetiquetan (`in_raza_servicio` = Raza de inseminación/servicio;
  `in_toro` = Toro de inseminación/Origen de los toros); repaso suma `in_inicio_repaso`,
  `in_fin_repaso`, `in_toro_raza_repaso`, `in_toro_origen_repaso`.
- **Radios con input oculto** (activar con `label[for=<id>]`): Marca Líquida, Destetados, Capados,
  Zona, Plan sanitario, Uniformidad, Sanidad, Tipo de servicio, Inseminación, Garrapata, Mio-Mio.
  Destetados SÍ muestra `in_fecha_destete`; Capados SÍ muestra `in_fecha_capado`
  ("Fecha de capados"); fechas no obligatorias. Zona Lucha/Sucia muestran Garrapata y Mio-Mio,
  Limpia no. Plan sanitario SÍ no agrega campos (OQ-050).
- Listas: Calidad 6 a 10 de a 0,5; Estado Corporal 2 a 5 de a 0,5 (los `value` son ids: 7.5 = 4,
  3.5 = 6, por eso se eligen por texto); Tratamiento Nutricional (Campo Natural, Racionados,
  A Corral, Praderas y/o Verdeos, Otro); Dentición (Diente de leche, 2/4/6 Dientes, Boca Llena,
  1/2 Diente Arriba/…/Abajo, Liso, "(Aclarar en los comentarios)"); Tipo de Rodeo (General,
  Puro controlado, Puro Pedigree, Angus MAS); Plazo (Contado, 30 días, 30 y 60, 60, 30/60/90,
  90, Otro); 23 razas (iguales en `re_raza2`, `re_raza3`, raza de inseminación/servicio).
  Los placeholders de sociedad y establecimiento tienen `value=""`.
- Razas: `.btn_agregar_listado.agr_raza` revela `re_raza2` y `re_raza3`; un cuarto click no agrega.
- Sin validación de Cantidad (`0` y `-5` crean tropa; `abc` no), de la segmentación contra la
  Cantidad ni de Machos + Hembras (OQ-044/045/046, casos diferidos hasta que la app los valide).
- Altas: sociedad con CUIT válido abre `#modal_sugerir` (`#aceptarSug`) y queda auto-seleccionada
  (nombre normalizado); con dígito verificador incorrecto el modal queda abierto sin mensaje
  (validación por API; el usuario lo reportará, OQ-048). Establecimiento: provincia y partido
  antes de guardar; con sociedad nueva `#estab_soc` sólo ofrece el placeholder y "+ Nuevo
  Establecimiento". Cerrar no persiste.

## Video

- `input.btn_subir_video` ejecuta `jQuery('#Filedata').click(); vmRapidInv.crearLoteVideo();`:
  `POST /MODULOS/invernada/modulo_crearLote/index.php?parcial=true` (devuelve el id del lote) y luego
  la subida a `upload.php?lote=<id>`. Usar `setInputFiles` saltea ese paso (la exploración del 08/10
  quedó superada, OQ-047→OQ-051).
- `#barra_progreso_cont` siempre termina en "Archivo cargado" (no es oráculo). El resultado real está
  en `#seccion_archivos`: éxito (verde) "Video cargado correctamente…" con "Eliminar video cargado";
  fallo (rojo) "Aún no se han cargado archivos, compruebe que el formato sea el correcto.".
  Tarda 1 a 16 s.
- Resultados: 29 s M4V y 9 s MP4 → éxito; 4 s MP4 (excepción AWS MediaConvert
  `FramerateDenominator` 0, HTTP 200) y `.txt` ("formato de archivo no válido.") → fallo.
- Sin ubicación seleccionada el POST parcial devuelve un error SQL y `#seccion_archivos` queda vacío
  (OQ-052). Tras un rechazo se puede adjuntar otro; "Eliminar video cargado" abre un `confirm`
  nativo "¿Desea borrar el archivo?". El envío no se bloquea por video rechazado, ausente ni subida
  en curso (`#modal_siguiente` no se disparó, OQ-053). Cada click en "Adjuntar Filmación" deja un
  lote parcial huérfano si no se envía (OQ-055).
- Calidad (para triage, no defecto confirmado): `upload.php` devuelve un stack trace con rutas
  internas; la UI informa "Archivo cargado" aunque el servidor rechace.

## Envío y confirmación

- Envío asíncrono: el botón pasa a "Creando..." y a los 3-5 s cambia la vista (URL sin cambios).
  `POST …/modulo_crearLote/index.php` (form-urlencoded, HTTP 200, cuerpo = id plano del lote, el
  mismo del video parcial y de `#NNNNN` en Pendientes). Campos enviados: `re_sociedad_vendedora`,
  `re_establecimiento`, `re_provincia`, `re_partido`, `Filedata`, `re_cantidad`, `re_categoria`,
  `re_peso`, `in_cabeza_*`, `in_cuerpo_*`, `in_cola_*`, `re_raza(2,3)`, `in_edad`, `in_destetados`,
  `in_fecha_destete`, `in_capados`, `in_zona`, `in_descarte`, `re_aclaracion_cliente`,
  `in_plazo_select`, `in_plazo`, `in_desbaste`, `in_distancia_pesada`, entre otros.
- Confirmación: `.titulo_tropa_cargada` "Su tropa ha sido creada correctamente."; enlace
  `.txt_tropa_cargada a` (`/__dcac/misPublicaciones`, texto "operaciones"); botón
  `.btn_topa_cargada a` "INGRESAR NUEVA TROPA". No muestra número de lote.

## Pendientes de publicación (vendedor)

- `/__dcac/misPublicaciones/pendientespublicacion`; ítem `#contenido-listado .listado
  .titulo_ticket_inv`: `.tit_cant_cat`, `.tit_peso`, `.tit_razas`, `.razon_social_titulo`,
  `.id_titulo_lote` (`#<id>`), `.dato_fecha`, "Procesando Video" (`.txt-procesando`, también sin
  video), Operador "Sin Asignar", Estab. "<partido>, <provincia>".
- "Informe de la Tropa" (`button.modal-informe`) abre `#modal-informe`: tab 1 segmentación
  (`#segmentacion_de_tropa`, `#peso_promedio`), tab 2 características
  (`#caracteristicas_de_tropa`). El plazo de venta no se muestra (OQ-056); fechas vacías se ven
  `00/00/0000` (esperado, OQ-057).
- Sólo Cerradas tiene búsqueda (`#texto-buscar-cerradas`); no hay búsqueda por id en Pendientes
  (OQ-054).

## Legajo Admin (2026-10-13, tropas #35685-#35688)

Informe completo en `specs/ofrecimientos-invernada-legajo-admin.md`.

- Dos caminos con el mismo contenido: Home > INVERNADA > "Ofrecimientos (N)" > "Ver Legajo"
  (`#fila_<id>`, URL `#legajo`), o buscador `#busca_i` + ENTER + opción Invernada (vista sólo del
  legajo `#agregarinvernada`; la URL no cambia, esperado).
- El legajo muestra lo que el informe no: aclaración del cliente, Plazo de Venta, Descarte, Tipo de
  Rodeo, datos de la cría y el video (`b.video_cargado`, ítems en `#section_3`: 1 video + 6 imágenes,
  todos "Oculto", esperado).
- Los campos no cargados se ven con valores por defecto (Edad 0, Peso "0 Kg", Destetados/Capados
  "No", Zona "Limpia", Trat. Nutricional "Sin datos", Dentición "No especificado", Tipo Rodeo "-",
  fechas `00/00/0000`, "Fecha Revisación: 00/00/0000 a las 00:00"): es lo esperado (OQ-058/059/060).
  Error sería mostrar un campo que no corresponde a la categoría (OQ-061).
- El listado y el legajo difieren en la capitalización de la sociedad (aceptado, OQ-064).
- Envíos reales de la exploración: 4 tropas nuevas; las de 08/10 (#35415-#35420) y 09/10
  (#35561-#35578 y huérfanos) suman 8 envíos más. Los maestros (sociedad, establecimiento) son
  datos de stage y no se fijan en fixtures (`TST-INV-002`).
