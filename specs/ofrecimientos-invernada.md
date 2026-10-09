# Plan QA - Ofrecimientos de invernada legacy

## Estado

Exploración completada el 03/09/2026, ampliada el 08/10/2026 y corregida el
09/10/2026 en `https://stage.dcac.ar/`; plan revisable, pendiente de aprobación
humana. El 09/10/2026 el usuario aclaró que no existen validaciones de Cantidad
(0, negativa) ni de segmentación/Machos+Hembras contra la Cantidad (casos 15, 16,
17, 21 y 67 DIFERIDOS hasta que la app implemente esas validaciones) y que la validación de video sólo ocurre con sociedad y
establecimiento seleccionados; se re-exploró el video y el flujo de `tropaId`. Esta
extensión conserva TC-INV-001 a TC-INV-011 y agrega TC-INV-012 en adelante.
Todo lo que el archivo `config/ofrecimientos-invernada-cases.md` marcó como
"confirmado" es una observación del usuario sin fuente documentada; se
contrastó con la app y se registra como observación, no como regla de negocio.

## Charter

Investigar acceso, datos maestros, validaciones, dependencias por categoría,
ramas de servicio, carga de video y envío del formulario legacy. Riesgos
principales: pérdida o transformación de datos (Critical), bloqueo por
obligatorios (High), altas inconsistentes (High) y divergencias por categoría
(High).

## Casos de prueba

### TC-INV-001 — Acceso y entidades existentes

- Tipo/prioridad: positive / High.
- Pasos: abrir `Cotizar`, elegir `Cotizar lote para Invernada / Cría`,
  seleccionar sociedad y establecimiento existentes y observar provincia y
  partido.
- Esperado observado: carga `Publicar una tropa de Invernada`, se habilita el
  establecimiento y se muestran ubicación y partido.
- Automatizable: sí (automatizado).

### TC-INV-002 — Validación del formulario vacío

- Tipo/prioridad: validation / High.
- Pasos: seleccionar categoría y presionar `Ofrecer Tropa` sin completar.
- Esperado observado: aparecen mensajes para Cantidad, Raza y Plazo de venta; y
  si no hay categoría, `Debe completar el campo Categoria` (sin tilde). El
  formulario permanece visible. Los mensajes `.alert_input_faltante` NO se
  limpian al corregir campos (OQ-049).
- Automatizable: sí (automatizado), `.btn_ofrecer.env` y mensajes visibles.

### TC-INV-003 — Categorías simples y mixtas

- Tipo/prioridad: positive + regression / High.
- Categorías: Terneros, Terneras, Novillitos, MEJ, Toros, Terneros y terneras
  y Novillitos y vaquillonas.
- Esperado: cada selección muestra controles observados; las mixtas muestran
  `in_cantidad_machos` e `in_cantidad_hembras`; Toros muestra origen de toros
  y aptitud para vaquillonas. MEJ muestra sólo comunes (OQ-043).
- Automatizable: sí para presencia y dependencias (ampliado en TC-INV-026).

### TC-INV-004 — Categorías con cría

- Tipo/prioridad: positive / High.
- Categorías: Vacas con cría, Vacas CUT con cría y Vaquillonas con cría.
- Esperado: se muestran Tipo de Rodeo y datos de cría, incluyendo edad y peso
  promedio; no asumir obligatoriedad no observada.
- Automatizable: sí para presencia (ampliado en TC-INV-026).

### TC-INV-005 — Categorías preñadas y servicio

- Tipo/prioridad: positive / High.
- Categorías: Vacas preñadas, Vacas CUT preñadas y Vaquillonas preñadas.
- Pasos: recorrer Inseminación, Servicio Natural e Inseminación + repaso.
- Esperado observado: Servicio Natural muestra Inicio/Fin, Raza de servicio y
  Origen de los toros; repaso muestra Inicio/Fin del repaso. Las reglas de
  fechas y obligatoriedad quedan abiertas.
- Automatizable: sí para presencia (ampliado en TC-INV-029).

### TC-INV-006 — Zona y dependencias

- Tipo/prioridad: positive / Medium.
- Pasos: seleccionar Limpia, Lucha y Sucia.
- Esperado observado: Lucha y Sucia muestran Garrapata y Mio-Mio.
- Automatizable: sí (automatizado). La ausencia en Limpia se agrega en
  TC-INV-028.

### TC-INV-007 — Altas nuevas y cancelación

- Tipo/prioridad: validation / High.
- Pasos: elegir `+ Nueva Sociedad` y `+ Nuevo Establecimiento`, observar
  diálogos y cancelar sin guardar.
- Esperado observado: sociedad expone Razón Social/CUIT; establecimiento
  expone nombre/provincia/partido; cancelar cierra sin crear datos. La
  verificación de que no se persiste se agrega en TC-INV-013 y TC-INV-014.
- Automatizable: sí para apertura/cancelación.

### TC-INV-008 — Guardar nueva sociedad y verla en el listado

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: cliente autenticado y autorización para crear una sociedad
  de prueba aislada.
- Pasos: elegir `+ Nueva Sociedad`; completar Razón Social y CUIT con datos
  generados dinámicamente; presionar `Guardar`; confirmar con `Aceptar`
  (`#aceptarSug`); abrir el listado de `#sociedad_select`.
- Esperado OBSERVADO: la sociedad se guarda, queda auto-seleccionada y aparece
  como opción; la UI normaliza el nombre ("Qa-sociedad-...").
- Automatizable: sí (automatizado).

### TC-INV-009 — Guardar nuevo establecimiento y verlo en el listado

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: cliente autenticado, sociedad existente seleccionada.
- Pasos: seleccionar `+ Nuevo Establecimiento`; completar nombre, provincia,
  partido; presionar `Guardar`; abrir el listado de `#estab_soc`.
- Esperado OBSERVADO: el establecimiento queda seleccionado, aparece en
  `#estab_soc` y se actualizan `#_provincia` y `#_partido`.
- Automatizable: sí (automatizado).

### TC-INV-010 — Envío y Pendientes de publicación

- Tipo/prioridad: positive + data-integrity / Critical.
- Estado: ahora tiene datos autorizados y selectores observados; el detalle
  del envío por categoría está en TC-INV-032 y la verificación en el listado
  en TC-INV-033.
- Automatizable: sí (ver TC-INV-032 y TC-INV-033).

### TC-INV-011 — Integridad en legajo Admin

- Tipo/prioridad: data-integrity / Critical.
- Automatizable: no. Motivo: missing_observed_selector (no hay rol Admin ni
  selector de `Ver legajo` observado en esta exploración).

### TC-INV-012 — Alta de sociedad con CUIT inválido (caso 4)

- Tipo/prioridad: negative + validation / High.
- Precondiciones: formulario abierto.
- Pasos: elegir `+ Nueva Sociedad`; Razón Social `QA-CUITinvalido-<yyyymmddhhmm>`;
  CUIT de 11 dígitos con dígito verificador incorrecto; presionar `Guardar`.
- Esperado OBSERVADO: el modal `#modal_crear` queda abierto, NO aparece
  `#modal_sugerir`, no se muestra mensaje de error y no se crea la sociedad
  (no aparece en `#sociedad_select`). El mensaje de error esperado por el
  usuario NO se observó (OQ-048).
- Nota del usuario (09/10/2026): la validación del CUIT la hace una API que
  devuelve error, pero la UI no lo muestra; el usuario lo reportará como defecto.
  La falta de mensaje NO se convierte en expectativa.
- Automatizable: sí. Se asierta sólo que el modal sigue abierto, que
  `#modal_sugerir` no aparece y que la sociedad no se agrega; NO se asierta la
  ausencia de mensaje.

### TC-INV-013 — Cerrar alta de sociedad sin persistir (caso 5)

- Tipo/prioridad: negative + data-integrity / Medium.
- Pasos: elegir `+ Nueva Sociedad`; completar Razón Social y CUIT; presionar
  `#cerrar` ("Cerrar [ x ]").
- Esperado OBSERVADO: el modal se cierra, `#sociedad_select` vuelve a
  "Seleccionar una sociedad", no se crea opción nueva (cantidad de opciones
  sin cambios).
- Automatizable: sí.

### TC-INV-014 — Cerrar alta de establecimiento sin persistir (caso 10)

- Tipo/prioridad: negative + data-integrity / Medium.
- Precondiciones: sociedad seleccionada.
- Pasos: elegir `+ Nuevo Establecimiento`; completar `#Nombre`; presionar el
  botón `#cerrar` dentro de `#modal-establecimiento-edit`.
- Esperado OBSERVADO: el modal se cierra, `#estab_soc` vuelve al placeholder y
  no se crea opción nueva.
- Automatizable: sí.

### TC-INV-015 — Sociedad nueva: selección automática, opciones de establecimiento y alta de establecimiento (casos 3 ext, 8, 9)

- Tipo/prioridad: positive + data-integrity / High.
- Precondiciones: autorización para crear sociedad y establecimiento de
  prueba; CUIT válido generado en runtime.
- Pasos: crear sociedad (CUIT válido, `Guardar`, `Aceptar` en `#modal_sugerir`);
  observar `#sociedad_select`; abrir `#estab_soc`; elegir `+ Nuevo
  Establecimiento`; completar Nombre, Provincia y Partido; `Guardar`.
- Esperado OBSERVADO: la sociedad queda seleccionada automáticamente;
  `#estab_soc` se habilita y sólo contiene "Seleccionar un establecimiento" y
  "+ Nuevo Establecimiento"; el establecimiento nuevo queda seleccionado y
  `#_provincia`/`#_partido` reflejan lo cargado.
- Automatizable: sí. Aislamiento completo (crea datos).

### TC-INV-016 — Autocompletado de Provincia y Partido (caso 11)

- Tipo/prioridad: positive / High.
- Pasos: seleccionar sociedad y establecimiento existentes.
- Esperado OBSERVADO: `#_provincia` y `#_partido` muestran texto no vacío; los
  hidden `#provincia_input` y `#partido_input` tienen valor.
- Automatizable: sí (solo lectura).

### TC-INV-017 — Carga de video con validación real (casos 12, 12.1, 12.2, 12.4, 12.5)

- Tipo/prioridad: positive + validation / High. Cubre INV-SCOPE-008.
- Corrección 09/10/2026: la exploración del 08/10 subió los archivos con
  `setInputFiles` directo y sin ubicación seleccionada, salteando el `onclick`
  real del botón; esas observaciones (OBS-INV-008, OQ-047) quedan SUPERADAS.
- Precondiciones: sociedad y establecimiento existentes seleccionados. Sin ellos
  no hay validación (ver nota).
- Flujo real: click en `.btn_subir_video` → esperar `POST **/modulo_crearLote/index.php?parcial=true`
  (crea el lote parcial y devuelve su id) → adjuntar en `#Filedata` → esperar el
  resultado en `#seccion_archivos` con timeout generoso (observado 1 a 16 s).
  `#barra_progreso_cont` y `#texto_progreso` NO son oráculo: siempre terminan en
  "Archivo cargado", incluso para un `.txt`.
- Datos: `INVERNADA_VIDEO_PATH` (29 s), `video_ofrecimiento_corto.mp4` (9 s),
  `INVERNADA_VIDEO_SHORT_PATH` → `video_ofrecimiento_4seg.mp4` (4,4 s), archivo
  de texto generado en el test.

| Caso | Archivo | Resultado OBSERVADO en `#seccion_archivos` | Automatizable |
| --- | --- | --- | --- |
| 12 | 29 s M4V | Éxito (fondo verde): "Video cargado correctamente. Debe procesarse la versión de tu video con definición estándar ... Puede avanzar al siguiente paso." + enlace "Eliminar video cargado" | sí |
| 12.5 | 9 s MP4 | Éxito, mismo texto (el 9 s es VÁLIDO; el mínimo de 10 s del usuario no se sostiene) | sí |
| 12.1 | 4 s MP4 | Fallo (fondo rojo): "Aún no se han cargado archivos, compruebe que el formato sea el correcto." Sin enlace de eliminar. La causa en el servidor es una excepción de AWS MediaConvert, no una regla de duración con mensaje propio (OQ-051) | sí (se asierta el rechazo visible, no la causa) |
| 12.2 | `.txt` | Fallo, mismo mensaje rojo (el servidor responde "formato de archivo no válido.") | sí |
| 12.4 | Reemplazo | Tras un rechazo el botón sigue visible; adjuntar el 29 s da éxito. "Eliminar video cargado" abre un `confirm` nativo "¿Desea borrar el archivo?" y deja "Aún no se han cargado archivos." | sí |

- Contraste sin ubicación (observado, NO automatizable): `POST ...?parcial=true`
  devuelve un error SQL de MariaDB, `upload.php?lote=undefined`, la barra dice
  "Archivo cargado" y `#seccion_archivos` queda vacío. Se registra como
  hallazgo de calidad (OQ-052), no como expectativa.
- Skip del caso si el archivo de video local no existe.

### TC-INV-018 — Envío sin video y con video rechazado o en curso (caso 12.3)

- Tipo/prioridad: positive + negative / High.
- Pasos: completar datos base de Terneros sin adjuntar video; presionar
  `Ofrecer Tropa`; capturar el `tropaId`; ir a "operaciones".
- Esperado OBSERVADO: el envío prospera sin `#modal_siguiente`; aparece la
  vista de confirmación con la URL sin cambios; la tropa figura en Pendientes de
  publicación (se localiza por `.id_titulo_lote` `#<tropaId>`). El envío tampoco
  se bloquea con un video rechazado ni con la subida en curso (`.btn_ofrecer.env`
  es un `div` que nunca tiene atributo `disabled`). Crea un ofrecimiento real.
- NO se asierta "Procesando Video": decisión del usuario (09/10/2026), porque
  todas las tropas en Pendientes lo muestran, con o sin video, y no distingue
  nada. La verificación del video cargado queda diferida al estado siguiente
  (ver "Casos diferidos").
- Automatizable: sí (aislamiento completo, envío real).

### TC-INV-019 — Cantidad: válida, vacía, cero, negativa y no numérica (casos 13 a 17)

- Tipo/prioridad: boundary + validation / Medium.

| Caso | Entrada | Esperado OBSERVADO | Automatizable |
| --- | --- | --- | --- |
| 13 | 50 | Valor aceptado en `[name=re_cantidad]` | sí |
| 14 | vacía (resto completo) | `Debe completar el campo Cantidad`; no hay envío | sí |
| 15 | 0 | DIFERIDO 09/10/2026: hoy no hay validación y el envío se acepta (lote #35415); el usuario considera que debería rechazarse | no: deferred_until_app_validation |
| 16 | -5 | DIFERIDO 09/10/2026: igual que el caso 15 (lote #35416) | no: deferred_until_app_validation |
| 17 | abc | El input permite tipear; el envío no generó tropa. DIFERIDO 09/10/2026: el usuario considera que debería rechazarse con mensaje y hoy no lo hace | no: deferred_until_app_validation |

- Nota: el input es de texto sin filtro.

### TC-INV-020 — Opciones de Categoría (caso 18)

- Tipo/prioridad: positive / High.
- Esperado OBSERVADO: `#categoriasSelect` contiene las 17 categorías con los
  textos exactos de la UI: Terneros, Terneras, Terneros y Terneras, Novillitos,
  Vaquillonas, Novillitos y Vaquillonas, Novillos, Vacas de invernada, Vacas con
  cría, MEJ, Vacas CUT con cría, Vacas CUT preñadas, Vacas preñadas,
  Vaquillonas con cría, Vaquillonas preñadas, Vaquillonas para madre, Toros.
- Automatizable: sí (solo lectura).

### TC-INV-021 — Peso promedio sin restricción (caso 19)

- Tipo/prioridad: positive / Low.
- Esperado OBSERVADO: `[name=re_peso]` acepta 100 (input de texto).
- Automatizable: sí (solo lectura).

### TC-INV-022 — Segmentación contra la Cantidad (casos 20, 21)

- Tipo/prioridad: positive + boundary / High.

| Caso | Datos | Esperado OBSERVADO | Automatizable |
| --- | --- | --- | --- |
| 20 | Cantidad 50; Cabeza 260/1, Cuerpo 250/48, Cola 240/1 | Se completa y se acepta (cubierto por TC-INV-032) | sí |
| 21 | Cantidad 50; Cabeza 260/1, Cuerpo 250/40, Cola 240/1 (suma 42) | DIFERIDO 09/10/2026: hoy no hay validación (el envío se aceptó); el usuario considera que debería rechazarse | no: deferred_until_app_validation |

### TC-INV-023 — Hasta 3 razas (casos 22, 23)

- Tipo/prioridad: boundary / Medium.
- Pasos: elegir una raza; presionar `.agr_raza` dos veces y elegir razas
  distintas en `re_raza2` y `re_raza3`; presionar `.agr_raza` una tercera vez.
- Esperado OBSERVADO: quedan tres selects visibles; el botón sigue visible y no
  se deshabilita; un cuarto click no agrega un select.
- Automatizable: sí (solo lectura).

### TC-INV-024 — Listas de opciones de los selects (casos 24 a 33)

- Tipo/prioridad: data-driven / Medium. Cubre INV-SCOPE-009.

| Caso | Campo | Categoría | Esperado OBSERVADO |
| --- | --- | --- | --- |
| 24 | Marca Líquida | Terneros | Radios Sí / No (`in_marca_liquida`) |
| 25 | Calidad | Terneros | 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10 (`in_calidad`) |
| 26 | Estado Corporal | Terneros | 2, 2.5, 3, 3.5, 4, 4.5, 5 (`in_estado_corporal`) |
| 27 | Tratamiento Nutricional | Terneros | Campo Natural, Racionados, A Corral, Praderas y/o Verdeos, Otro |
| 28 | Zona | Terneros | Radios Limpia, Lucha, Sucia (`in_zona`) |
| 29 | Dentición | Vacas de invernada | Diente de leche, 2 Dientes, 4 Dientes, 6 Dientes, Boca Llena, 1/2 Diente Arriba, 1/2 Diente, 1/2 Diente Abajo, Liso, (Aclarar en los comentarios) |
| 30 | Tipo de Rodeo | Vacas de invernada | Rodeo General, Puro controlado, Puro Pedigree, Angus MAS |
| 31 | Uniformidad de la cría | Vacas con cría | Radios Parejo / Desparejo (`in_uniformidad_cria`) |
| 32 | Tipo de servicio | Vacas preñadas | Radios Inseminación, Servicio Natural, Inseminación + repaso |
| 33 | Inseminación | Vacas preñadas, Tipo de servicio Inseminación | Radios A tiempo fijo, Con detección |

- Automatizable: sí (solo lectura). Los textos coinciden con lo observado y
  difieren en mayúsculas/orden de algunos de los textos del usuario.

### TC-INV-025 — Raza de inseminación y de servicio frente a Raza (casos 34, 35)

- Tipo/prioridad: data-integrity / Low.
- Esperado OBSERVADO: `in_raza_servicio` (Raza de inseminación / Raza de
  servicio) e `in_toro_raza_repaso` tienen las mismas razas que `re_raza`,
  excepto una opción vacía inicial `0=`.
- Automatizable: sí (solo lectura).

### TC-INV-026 — Campos por categoría (casos 36 a 52)

- Tipo/prioridad: data-driven + regression / High. Cubre INV-SCOPE-004.
- Esperado OBSERVADO (controles visibles por categoría; los comunes siempre):

| Caso | Categoría | Campos propios observados |
| --- | --- | --- |
| 36 | Terneros | `in_edad` (Meses), Marca Líquida, `in_calidad`, `in_tratamiento_nutricional`, Destetados, Capados, Zona, Plan sanitario, Sanidad, Pesada Carguio, `in_desbaste`, `in_distancia_pesada` |
| 37 | Terneras | Igual que Terneros sin Capados |
| 38 | Terneros y Terneras | Igual que Terneros más `in_cantidad_machos` e `in_cantidad_hembras` |
| 39 | Novillitos | Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Plan sanitario, Sanidad, Pesada Carguio, Desbaste, Distancia |
| 40 | Vaquillonas | Igual que Novillitos |
| 41 | Novillitos y Vaquillonas | Igual que Novillitos más Machos y Hembras |
| 42 | Novillos | Igual que Novillitos |
| 43 | Vacas de invernada | Edad (Años), Dentición, Marca Líquida, Calidad, Tipo de Rodeo, Tratamiento Nutricional, Zona, Sanidad, Pesada Carguio, Desbaste, Distancia |
| 44 | Vacas con cría | Tipo de Rodeo, Edad (Años), Dentición, Marca Líquida, Calidad, Tratamiento Nutricional, Zona, `in_edad_cria` (Meses), `in_peso_promedio_cria` (Kg Netos), `in_uniformidad_cria`, Sanidad |
| 45 | Vacas CUT con cría | Igual que Vacas con cría |
| 46 | MEJ | Sólo comunes (Estado Corporal, Uniformidad, Descarte, Aclaraciones); sin campos propios (OQ-043, observación del usuario reproducida) |
| 47 | Vacas preñadas | Tipo de Rodeo, Edad (Años), Tratamiento Nutricional, Dentición, Marca Líquida, Calidad, Zona, Tipo de Servicio, Raza de inseminación (`in_raza_servicio`), Toro de inseminación (`in_toro`), Sanidad |
| 48 | Vacas CUT preñadas | Igual que Vacas preñadas |
| 49 | Vaquillonas con cría | Tipo de Rodeo, Edad (Meses), Dentición, Marca Líquida, Calidad, Tratamiento Nutricional, Zona, datos de cría, Sanidad |
| 50 | Vaquillonas preñadas | Tipo de Rodeo, Tratamiento Nutricional, Edad (Meses), Marca Líquida, Calidad, Zona, Tipo de Servicio, Raza y Toro de inseminación, Sanidad (sin Dentición) |
| 51 | Vaquillonas para madre | Edad (Meses), Marca Líquida, Calidad, Tipo de Rodeo, Definidas, Tratamiento Nutricional, Zona, Sanidad |
| 52 | Toros | Edad (Años), Tratamiento Nutricional, Análisis Sanitario, Dentición, Zona, Tipo de Rodeo, Calidad, Origen de los toros (`in_toro_origen_text`), Apto para Vaquillonas |

- Diferencias respecto del archivo de casos: Vacas con cría y CUT con cría
  muestran Tipo de Rodeo; Novillitos, Vaquillonas y Novillos muestran Sanidad.
  Los casos no validan la ausencia de Sanidad.
- Automatizable: sí (solo lectura, `resetCategory()` antes de cada caso).

### TC-INV-027 — Destetados y Capados (casos 53 a 56)

- Tipo/prioridad: positive + negative / High.
- Pasos: en Terneros, elegir SÍ y NO en Destetados y Capados.
- Esperado OBSERVADO: SÍ en Destetados muestra "Fecha de destete"
  (`in_fecha_destete`); NO la oculta. SÍ en Capados muestra "Fecha de capados"
  (`in_fecha_capado`); NO la oculta. Las fechas no son obligatorias (se envió
  una tropa con ambos en SÍ sin fechas).
- Automatizable: sí (solo lectura).

### TC-INV-028 — Zona Limpia oculta Garrapata y Mio-Mio (caso 59; casos 57 y 58 en TC-INV-006)

- Tipo/prioridad: negative / Medium.
- Esperado OBSERVADO: con Limpia no aparecen Garrapata ni Mio-Mio; Lucha y
  Sucia los muestran como radios Sí/No.
- Automatizable: sí (solo lectura).

### TC-INV-029 — Tipo de servicio e Inseminación (casos 60 a 66)

- Tipo/prioridad: positive / High. Cubre INV-SCOPE-010.

| Caso | Selección | Esperado OBSERVADO |
| --- | --- | --- |
| 60 | Tipo de servicio Inseminación | Aparece "Inseminación" (`in_inseminacion_tipo`) con A tiempo fijo marcado por defecto |
| 61 | A tiempo fijo | Aparece "Fecha de Inseminación" (`#fecha_servicio_input`) |
| 62 | Con detección | Aparecen "Inicio de inseminación" y "Fin de inseminación" |
| 63 | Servicio Natural | Aparecen "Inicio del servicio", "Fin del servicio", "Raza de servicio" y "Origen de los toros" |
| 64 | Servicio Natural | Los labels "Raza de inseminación" y "Toro de inseminación" dejan de mostrarse, pero los mismos controles se reutilizan con otro label |
| 65 | Inseminación + repaso | Aparecen Raza y Toro de inseminación, Inseminación, "Inicio del repaso", "Fin del repaso", "Raza de servicio" y "Origen de los toros" |
| 66 | Con detección en repaso | Aparecen "Inicio de inseminación" y "Fin de inseminación" |

- Automatizable: sí (solo lectura). 63 ya cubierto por TC-INV-005.

### TC-INV-030 — Machos + Hembras frente a la Cantidad (caso 67) — DIFERIDO

- Diferido el 09/10/2026: hoy esa validación no existe (se observó que 20 + 20
  con Cantidad 50 se acepta). Se agrega cuando la app la implemente. Sin
  automatización mientras tanto.
- Automatizable: no. Motivo: deferred_until_app_validation.

### TC-INV-031 — Plan sanitario (caso 68)

- Tipo/prioridad: positive / Medium.
- Esperado OBSERVADO: elegir SÍ en "¿Desea informar el plan sanitario?" no
  muestra campos nuevos (OQ-050).
- Automatizable: sí (asertar que no aparecen campos adicionales).

### TC-INV-032 — Envío de las 17 categorías (casos 69 a 85)

- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-SCOPE-006.
- Precondiciones: sociedad/establecimiento de prueba, datos base (Cantidad 50,
  Peso 250, Segmentación 260/1, 250/48, 240/1, Raza y Plazo primera opción).
  Crea un ofrecimiento real por caso (máximo 17 por corrida).
- Pasos: elegir categoría; completar comunes y propios; presionar `Ofrecer Tropa`;
  esperar `.titulo_tropa_cargada`; capturar el `tropaId` y verificar la tropa en
  Operaciones según TC-INV-033.
- Esperado OBSERVADO: la URL no cambia; la vista pasa a "Su tropa ha sido
  creada correctamente."; hay enlace "operaciones" y botón "INGRESAR NUEVA
  TROPA" (textos confirmados por el usuario el 09/10/2026); no se muestra número
  de lote en la confirmación.

| Caso | Categoría y datos propios |
| --- | --- |
| 69 | Terneros: 1 raza, Edad 7, Destetados SÍ, Capados SÍ, Zona Limpia |
| 70 | Terneras: 2 razas, Edad 7, Destetados NO, Zona Lucha (Garrapata NO, Mio-Mio NO) |
| 71 | Terneros y Terneras: Machos 25, Hembras 25, Edad 7, Destetados SÍ, Capados NO, Zona Sucia (Garrapata SÍ, Mio-Mio NO) |
| 72 | Novillitos: Edad 14, Praderas y/o Verdeos, Zona Limpia |
| 73 | Vaquillonas: 3 razas, Edad 14, Zona Limpia |
| 74 | Novillitos y Vaquillonas: Machos 30, Hembras 20, Edad 14, Zona Limpia |
| 75 | Novillos: Edad 20, A Corral, Zona Limpia |
| 76 | Vacas de invernada: Edad 6, Dentición Boca Llena, Rodeo General, Zona Limpia |
| 77 | Vacas con cría: Edad 5, cría 4 meses, peso cría 120, Uniformidad cría Parejo |
| 78 | Vacas CUT con cría: Edad 8, cría 4 meses, peso cría 120, Desparejo |
| 79 | MEJ: sólo datos base |
| 80 | Vacas preñadas: Edad 5, Inseminación, A tiempo fijo, fecha dinámica |
| 81 | Vacas CUT preñadas: Edad 8, Servicio Natural, Inicio y Fin de servicio dinámicos |
| 82 | Vaquillonas con cría: Edad 26, cría 3 meses, peso cría 100, Parejo |
| 83 | Vaquillonas preñadas: Edad 20, Inseminación + repaso, Con detección, fechas dinámicas |
| 84 | Vaquillonas para madre: Edad 15, Puro controlado |
| 85 | Toros: Edad 3, Puro Pedigree, 4 Dientes |

- Observación de exploración: sólo se envió el perfil de Terneros con otros
  datos (tropas #35417 y #35418). Los 17 perfiles exactos NO se enviaron durante
  la exploración. Se observó que sólo Cantidad, Categoría, Raza y Plazo de venta
  son obligatorios en el formulario vacío; la obligatoriedad por categoría no se
  pudo distinguir sin enviar.
- Automatizable: sí (aislamiento completo, data-driven).

### TC-INV-033 — Confirmación, `tropaId` y verificación en Operaciones

- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-SCOPE-006.
- Flujo (decidido por el usuario el 09/10/2026): completar formulario → `Ofrecer
  Tropa` → capturar `tropaId` → link "operaciones" → localizar la tropa por su id →
  comparar datos cargados vs. visibles.
- Captura del `tropaId` (observación pasiva del tráfico de la propia UI, sin
  llamar ni reproducir la API): registrar `cy.intercept('POST', '**/MODULOS/invernada/modulo_crearLote/index.php*')`
  ANTES del click y esperar el request SIN `parcial=true` (el que adjunta el
  video genera otro POST con `?parcial=true`). Respuesta OBSERVADA: HTTP 200,
  `text/html`, cuerpo = número plano (ej. `35568`), igual al lote creado al
  adjuntar el video y al `#NNNNN` que muestra Pendientes. Decisión ACEPTADA por el
  usuario el 09/10/2026: no existe otra forma de obtener el `tropaId`; el uso de
  `cy.intercept` es de solo lectura (ver Automation Handoff).
- Destino: `/__dcac/misPublicaciones` (abre en Pendientes Publicación; pestañas
  `a.filtro_invernada.menu_listado`). En Pendientes NO hay búsqueda por id (solo
  la pestaña Cerradas tiene `#texto-buscar-cerradas`, OQ-054); la tropa se
  localiza leyendo `.id_titulo_lote` con el texto `#<tropaId>` (aparece primera).
- Ítem visible: `.tit_cant_cat`, `.tit_peso`, `.tit_razas`, `.razon_social_titulo`,
  `.id_titulo_lote`, `.dato_fecha`, "Procesando Video" (`.txt-procesando`),
  Operador "Sin Asignar". Detalle: botón `button.modal-informe` ("Informe de la
  Tropa") abre `#modal-informe` con `#btn_segmentacion` y `#btn_caracteristicas`.

| Dato cargado (Terneros, tropa #35568) | Visible | Dónde | Resultado |
| --- | --- | --- | --- |
| Cantidad 50 | "50 Terneros"; `#cant_sugerida` 50 | ítem; informe tab 2 | Coincide |
| Categoría Terneros | Terneros | ítem; informe tab 1 | Coincide |
| Peso 250 | "250 Kg" / "250.00 Kg" | `.tit_peso`; `#peso_promedio` | Coincide (el informe agrega decimales) |
| Segmentación 260/1, 250/48, 240/1 | igual | informe tab 1 | Coincide |
| Raza (primera opción) | Aberdeen Angus Negro | `.tit_razas` | Coincide |
| Sociedad / Establecimiento | igual; "Adolfo Alsina, Buenos Aires" | ítem | Coincide (orden partido, provincia) |
| Edad 7, Destetados Sí, Capados No, Zona Limpia | igual (Edad con "Meses") | informe tab 2 | Coincide |
| Plazo de venta (Contado) | no se muestra | — | No verificable en la UI (OQ-056) |
| Fecha de destete (vacía) | 00/00/0000 | informe tab 2 | Diferencia de formato (OQ-057) |

- Automatizable: sí. Se comparan con el listado los campos visibles en el ítem
  (cantidad, categoría, peso, raza, sociedad, id) para las 17 categorías; la
  comparación del informe (`#modal-informe`) sólo tiene selectores observados para
  Terneros, el resto queda `missing_observed_selector` para el informe.
  Aislamiento completo; cada ejecución crea una tropa real.

### TC-INV-034 — Modal "El video no ha terminado de cargarse"

- Tipo/prioridad: negative / Low.
- Esperado: `#modal_siguiente` con "OK, prefiero esperar" y "Enviar tropa sin
  video". Re-exploración 09/10/2026: NO se dispara con la subida en curso y el
  formulario completo (el envío prospera en paralelo); la condición real no se
  identificó (OQ-053).
- Automatizable: no. Motivo: manual_only.

## Casos diferidos (backlog de validaciones faltantes)

Casos válidos que hoy NO se automatizan porque la app todavía no implementa la
validación esperada. No se automatiza el comportamiento actual (aceptar el dato)
para no fijar un defecto como correcto. Se agregan cuando la app mejore sus
validaciones. La expectativa es del usuario (09/10/2026), sin fuente documentada;
confirmar el texto y el criterio exactos al implementarse.

| Caso | Dato / acción | Comportamiento actual | Expectativa a verificar al implementarse |
| --- | --- | --- | --- |
| 15 | Cantidad `0` | Se acepta y crea tropa (#35415) | Rechazo con mensaje visible |
| 16 | Cantidad `-5` | Se acepta y crea tropa (#35416) | Rechazo con mensaje visible |
| 17 | Cantidad `abc` | El input permite tipear; el envío no crea tropa y no hay mensaje | Bloqueo del ingreso o rechazo con mensaje |
| 21 | Segmentación 1/40/1 (suma 42) con Cantidad 50 | Se acepta y crea tropa | Rechazo si la suma no coincide con la Cantidad |
| 67 | Machos 20 + Hembras 20 con Cantidad 50 | Se acepta y crea tropa | Rechazo si la suma no coincide con la Cantidad |
| 4 (mensaje) | CUIT con dígito verificador incorrecto | La API devuelve error y la UI no lo muestra (el usuario lo reportará) | Mensaje visible de CUIT inválido |
| Video cargado | Tropa enviada con video, vista en el estado posterior a Pendientes (Publicada) | En Pendientes todas las tropas muestran "Procesando Video", con o sin video | El video cargado se muestra en el estado siguiente. Requiere llevar la tropa a Publicada (flujo Admin, sin rol ni selector observados: `missing_authorized_data`) |

Razón registrada para el contrato: `deferred_until_app_validation` (video cargado en estado
siguiente: `missing_authorized_data`).

## Trazabilidad de casos

| Casos | TC | Estado |
| --- | --- | --- |
| 1, 2, 6 | TC-INV-001 | automatizado, descartar |
| 3 | TC-INV-008, TC-INV-015 | automatizado + extensión |
| 4 | TC-INV-012 | nuevo |
| 5 | TC-INV-013 (y TC-INV-007) | nuevo |
| 7 | TC-INV-009 | automatizado, descartar |
| 8, 9 | TC-INV-015 | nuevo |
| 10 | TC-INV-014 (y TC-INV-007) | nuevo |
| 11 | TC-INV-016 | nuevo |
| 12, 12.1, 12.2, 12.4, 12.5 | TC-INV-017 | nuevo (12.5 agregado el 09/10/2026) |
| 12.3 | TC-INV-018 | nuevo |
| 13, 14 | TC-INV-019 | nuevo (14 amplía TC-INV-002) |
| 15, 16, 17 | TC-INV-019 | DIFERIDOS 09/10/2026 (la validación no existe hoy; se agrega cuando la app la implemente) |
| 18 | TC-INV-020 | nuevo |
| 19 | TC-INV-021 | nuevo |
| 20 | TC-INV-022 | nuevo |
| 21 | TC-INV-022 | DIFERIDO 09/10/2026 (la validación no existe hoy; se agrega cuando la app la implemente) |
| 22, 23 | TC-INV-023 | nuevo |
| 24 a 33 | TC-INV-024 | nuevo |
| 34, 35 | TC-INV-025 | nuevo |
| 36 a 52 | TC-INV-026 | nuevo (amplía TC-INV-003/004/005) |
| 53 a 56 | TC-INV-027 | nuevo |
| 57, 58 | TC-INV-006 | automatizado, descartar |
| 59 | TC-INV-028 | nuevo |
| 60, 61, 62, 64, 65, 66 | TC-INV-029 | nuevo |
| 63 | TC-INV-005, TC-INV-029 | automatizado + extensión |
| 67 | TC-INV-030 | DIFERIDO 09/10/2026 (la validación no existe hoy; se agrega cuando la app la implemente) |
| 68 | TC-INV-031 | nuevo |
| 69 a 85 | TC-INV-032 | nuevo (actualiza TC-INV-010) |

## Coverage ledger

| Include ID | Cobertura | Estado | Motivo si no automatizable |
| --- | --- | --- | --- |
| INV-SCOPE-001 | TC-INV-001 | automatizado | — |
| INV-SCOPE-002 | TC-INV-001, 007, 008, 009, 012, 013, 014, 015, 016 | automatizado / automatizable | — |
| INV-SCOPE-003 | TC-INV-002, 018, 019, 020, 021, 023 | automatizable | 15, 16 y 17 diferidos (deferred_until_app_validation) |
| INV-SCOPE-004 | TC-INV-003, 004, 005, 026 | automatizado para presencia; ampliado | — |
| INV-SCOPE-005 | TC-INV-002, 006, 019, 022, 028 | automatizable | 21 y 67 diferidos (deferred_until_app_validation) |
| INV-SCOPE-006 | TC-INV-010, 032, 033 | automatizable (envío real autorizado) | — |
| INV-SCOPE-007 | TC-INV-011 | no automatizable | missing_observed_selector |
| INV-SCOPE-008 | TC-INV-017, 018, 034 | automatizable | 034: manual_only |
| INV-SCOPE-009 | TC-INV-020, 024, 025 | automatizable | — |
| INV-SCOPE-010 | TC-INV-027, 028, 029, 031 | automatizable | — |

## Automation Handoff

### Page Objects
- Extend `cypress/pages/InvernadaOfferPage.js`.
- Add `cypress/pages/InvernadaConfirmationPage.js` for the confirmation view and the Pendientes list.
- Reuse `OfferPage.offerInvernadaButton`, `MainClientPage.mainCotizarButton`, and `loginWithSession` (`visitInvernadaOfferForm`, `openInvernadaOfferForm`, `selectExistingInvernadaLocation`).

### Observed selector inventory (stage.dcac.ar)
- Society and establishment:
  - `#sociedad_select` (`[name=re_sociedad_vendedora]`); `option[value=crear]` = "+ Nueva Sociedad".
  - `#estab_soc` (`[name=re_establecimiento]`); `option[value=crear]` = "+ Nuevo Establecimiento".
  - `#_provincia`, `#_partido` (visible text); `#provincia_input`, `#partido_input` (hidden).
- New society modal:
  - `#modal_crear`, `#razonsocial`, `#cuit`, `#aceptar` (Guardar), `#cerrar` (Cerrar).
  - `#modal_sugerir` (confirmation), `#aceptarSug`, `button.btn-danger` (Cancelar).
- New establishment modal:
  - `#modal-establecimiento-edit`, `#Nombre`, `#Provincias`, `#Partido`.
  - `.btn_guardar_est`, `#modal-establecimiento-edit #cerrar`.
- Video:
  - `#Filedata` (input file, no `accept`), `input.btn_subir_video` (Adjuntar Filmación).
  - `#barra_progreso_cont[data-complete]`, `#texto_progreso` ("Archivo cargado").
  - `#modal_siguiente` (buttons "OK, prefiero esperar", "Enviar tropa sin video"); `#modal_ayudavideo`.
- Common fields: `[name=re_cantidad]`, `#categoriasSelect` (`[name=re_categoria]`), `[name=re_peso]`, `[name=in_cabeza_peso|cantidad]`, `[name=in_cuerpo_peso|cantidad]`, `[name=in_cola_peso|cantidad]`, `[name=re_raza]`, `[name=re_raza2]`, `[name=re_raza3]`, `.btn_agregar_listado.agr_raza`, `[name=in_estado_corporal]`, `[name=in_uniformidad]` (`#parejo`, `#desparejo`), `[name=in_descarte]`, `[name=re_aclaracion_cliente]`, `#plazo_select` (`[name=in_plazo_select]`), `.btn_ofrecer.env` (changes to "Creando...").
- Validation: `.alert_input_faltante.required-re_cantidad|re_categoria|re_raza|in_plazo_select`.
- Category-specific:
  - Text/select: `[name=in_edad]`, `in_calidad`, `in_tratamiento_nutricional`, `in_denticion`, `in_tipo_rodeo`, `in_desbaste`, `in_distancia_pesada`, `in_cantidad_machos`, `in_cantidad_hembras`, `in_edad_cria`, `in_peso_promedio_cria`, `in_toro_origen_text`.
  - Radios (hidden input, click `label[for=<id>]`): `#si_marca/#no_marca`, `#destetados/#no_destetados`, `#capados/#no_capados`, `#limpia/#lucha/#sucia`, `#si_plan/#no_plan`, `#parejo/#desparejo`, `#muy_buena/#buena/#regular`, `#inseminacion/#natural/#mas_repaso`, `#fijo/#deteccion`, `#si_garrapata/#no_garrapata`, `#si_miomio/#no_miomio`, `#sociedad/#publica/#establecimiento` (`in_pesada_carguio`), `#si_analisis/#no_analisis`, `#si_apto_vaquillonas/#no_apto_vaquillonas`, `#si_definidos/#no_definidos`, `#parejo_cria/#desparejo_cria`.
  - Conditional dates: `[name=in_fecha_destete]`, `[name=in_fecha_capado]`, `#fecha_servicio_input`, `#fecha_inicio_servicio_input`, `[name=in_fecha_servicio2]`, `[name=in_inicio_repaso]`, `[name=in_fin_repaso]`.
  - Service: `[name=in_raza_servicio]`, `[name=in_toro]`, `[name=in_toro_raza_repaso]`, `[name=in_toro_origen_repaso]`, `#informe_servicioDiv`.
- Confirmation view: `.div_tropa_cargada`, `.titulo_tropa_cargada`, `.txt_tropa_cargada a[href="/__dcac/misPublicaciones"]` (texto "operaciones"), `.btn_topa_cargada` (texto "INGRESAR NUEVA TROPA"; corrección 09/10/2026: el `a` interno aparece vacío o ausente según la corrida, por eso se asierta el texto sobre `.btn_topa_cargada`).
- Pendientes: `a.filtro_invernada.menu_listado`, `.id_titulo_lote` dentro de `#contenido-listado .listado`. Corrección 09/10/2026: `.titulo_ticket_inv` NO contiene `button.modal-informe`; el ítem se localiza como el ancestro más cercano del `.id_titulo_lote` que contenga el botón del informe y un único id de lote.

### Network observation (decisión aceptada por el usuario el 09/10/2026)
- Para capturar el `tropaId` se usa `cy.intercept` SOLO como observación pasiva
  (sin stub, sin reenviar ni llamar la API por cuenta propia):
  `POST **/modulo_crearLote/index.php*` (con `?parcial=true` al adjuntar video; sin query al ofrecer),
  `POST **/lib/i2.0/upload.php*`, `POST **/n_usuarios/invernada/ajax/form_multimedia_rapido.php`.
- Es una lectura de lo que la propia UI envía; no sustituye las aserciones de UI.
  `CLAUDE.md` prohíbe acceder a APIs privadas. El usuario aceptó el 09/10/2026
  esta observación pasiva porque no hay otra forma de obtener el `tropaId`; se
  mantiene aislada en `cypress/support/helpers/invernada_trace_helper.js` y no se
  llama ni reproduce la API por cuenta propia.

### Notas de implementación observadas al generar (09/10/2026)
- Los selects `#sociedad_select` y `#estab_soc` tienen placeholders con `value="0"`: esperar una opción distinta de `0` y `crear` antes de seleccionar (carrera de carga).
- Los campos de fecha son inputs de texto con jQuery datepicker; se llenan con `dd/mm/yyyy` (formato inferido de `00/00/0000`, no documentado).
- Con Zona Limpia `#garrapataDiv` y `#miomioDiv` siguen "visibles" en el DOM; la aserción de ausencia debe hacerse sobre sus radios y labels.
- Mapeos verificados por visibilidad: Sanidad = `#muy_buena`, Pesada Carguío = `#sociedad`, inicio y fin de servicio = `#fecha_inicio_servicio_input` y `in_fecha_servicio2`.
- Variable de entorno para filtrar categorías de envío: `CYPRESS_INVERNADA_SUBMIT_CATEGORIES="Terneros,Vacas preñadas"` (Cypress sólo lee `CYPRESS_*` o `--env`).

### Helpers
- Create `fillBaseOffer(category, overrides)`, `submitOffer()` (waits for `.titulo_tropa_cargada` with at least 15 s timeout), `uniqueQaName(prefix)`.
- Reuse `InvernadaOfferPage.validRuntimeCuit` (verified present in the page object).
- Optional data builder in `cypress/support/data/invernada_offer_data.js` for the 17 profiles and the select options tables.

### Video upload flow (observed 2026-10-09)
- Click `.btn_subir_video` (its `onclick` runs `jQuery('#Filedata').click(); vmRapidInv.crearLoteVideo();`),
  wait for `POST ...modulo_crearLote/index.php?parcial=true`, then `cy.get('#Filedata').selectFile(path, { force: true })`.
  Do NOT attach with `selectFile` before that POST: the upload goes to `lote=undefined`.
- Oracle: `#seccion_archivos` (success: "Video cargado correctamente"; failure: "compruebe que el formato sea el correcto"), generous timeout.
- New selectors: `#seccion_archivos`, `#seccion_archivos a` (Eliminar video cargado, native `confirm`), `.btn_subir_video`, `#revisacion`, `#re_revisacion`, `.loadinggg`.
- Operaciones: `a.filtro_invernada.menu_listado`, `#contenido-listado .listado`, `.id_titulo_lote`, `.tit_cant_cat`, `.tit_peso`, `.tit_razas`, `.razon_social_titulo`, `.dato_fecha`, `button.modal-informe`, `#modal-informe`, `.titulo_modal_informe`, `#btn_segmentacion`, `#segmentacion_de_tropa`, `#btn_caracteristicas`, `#caracteristicas_de_tropa`, `#cant_sugerida`, `#peso_promedio`, `#modal-informe .cerrar_datos_origen`, `#texto-buscar-cerradas`, `#lv_search`.

### Related specs
- `cypress/e2e/ofrecimientos-invernada/ofrecimientos-invernada.cy.js`
- `cypress/e2e/ofrecimientos-invernada/ofrecimientos-invernada-campos-dinamicos.cy.js`

### Required data
- Local, not versioned videos: `cypress/fixtures/video_ofrecimiento.mp4` (29 s, M4V, valid), `cypress/fixtures/video_ofrecimiento_corto.mp4` (9 s, also valid) and `cypress/fixtures/video_ofrecimiento_4seg.mp4` (4 s, rejected). Overridable with `INVERNADA_VIDEO_PATH` (valid) and `INVERNADA_VIDEO_SHORT_PATH` (rejected, defaults to the 4 s file). Skip when the file does not exist.
- Text file generated at runtime for the non-video case.
- Environment credentials (`TEST_CLIENT_USERNAME`, `TEST_CLIENT_PASSWORD`).
- Dynamic names with prefix `QA-` and timestamp suffix; runtime-generated valid CUIT.

### Recommended spec structure
- One file per block: A (societies/establishments), B (general data and video), C (select options), D (category fields), E (conditional fields), F (submission).
- `testIsolation:false` only in read-only blocks (C, D, E, most of B), with `resetCategory()` before each case.
- Full isolation for submissions and for any creation of societies or establishments.

## Evidencia

Re-exploración 09/10/2026: `artifacts/ofrecimientos-invernada/r2-01` a `r2-14`
(video con y sin ubicación, confirmación de la tropa #35568, Operaciones, informe de la tropa).

Todas las capturas bajo `artifacts/ofrecimientos-invernada/` (01 a 29, exploración del 08/10/2026):

- 01-formulario-establecimiento-seleccionado.png
- 02-video-corto-9s.png
- 03-video-valido-29s-reemplazo.png
- 04-archivo-no-video.png
- 05-vacas-prenadas-inseminacion.png
- 06-vacas-prenadas-servicio-natural.png
- 07-vacas-prenadas-insem-repaso.png
- 08-inseminacion-con-deteccion.png
- 09-terneros-plan-sanitario-si.png
- 10-tres-razas.png
- 11-modal-nueva-sociedad.png
- 12-sociedad-cuit-invalido.png
- 13-sociedad-cuit-valido-confirmacion.png
- 14-sociedad-nueva-seleccionada.png
- 15-modal-nuevo-establecimiento.png
- 16-establecimiento-nuevo-guardado.png
- 17-envio-vacio-sin-categoria.png
- 18-envio-vacio-terneros.png
- 19-cantidad-vacia.png
- 20-cantidad-cero.png
- 21-estado-tras-cantidades.png
- 22-mis-publicaciones.png
- 23-terneros-envio-con-fechas-vacias.png
- 24-video-no-termino-de-cargar.png
- 25-confirmacion-tropa-creada.png
- 26-pendientes-publicacion.png
- 27-segmentacion-no-suma.png
- 28-machos-hembras-no-suman.png
- 29-archivo-no-video-fresco.png

Nota de procedencia: este plan lo redactó el subagente `playwright_test_planner`
a partir de la exploración del 08/10/2026. Como su entorno no podía guardar
archivos, lo persistió el orquestador sin cambios de contenido, salvo la nota de
verificación de `validRuntimeCuit` y la lista de radios movida a la sección
Automation Handoff.
