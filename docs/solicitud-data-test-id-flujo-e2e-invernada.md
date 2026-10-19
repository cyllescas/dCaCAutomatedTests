# Solicitud de `data-test-id` — Flujo e2e de ofrecimiento de Invernada (legacy)

**Ambiente:** `https://stage.dcac.ar/` · **Origen:** automatización Cypress del flujo
`ofrecimientos-invernada-legajo-admin` (QA).

## Objetivo

Hoy los tests localizan los elementos por clases CSS, `href`, `onclick`, texto visible, posición
(`:nth-child`) o `name`. Esos localizadores se rompen con cambios de estilo o de texto, y en el
formulario el mismo `name` aparece en bloques ocultos de otras categorías, lo que obliga a
filtrar por `:visible`. Pedimos agregar un atributo estable **solo a los elementos de esta lista**,
que son los que usa el flujo e2e.

## Flujo cubierto

1. **Cliente:** ofrece una tropa en el formulario legacy (Terneros mínimo, Terneras completo con
   video, Vacas con cría mínimo, Vacas con cría completo con video).
2. **Cliente (vendedor):** en Operaciones > Pendientes verifica el ítem y su informe.
3. **Admin:** abre el legajo por dos caminos: (1) Home > INVERNADA > Ofrecimientos > "Ver Legajo";
   (2) buscador global con el tropaId + ENTER + opción Invernada. Compara todos los datos cargados.

## Convención propuesta

- Atributo: `data-test-id="<valor>"`, en **kebab-case**, único dentro de la pantalla.
- Debe ir en el elemento que se lee o se pulsa (el control, el `span` del valor, el botón), no en un
  contenedor lejano.
- No debe depender del idioma, del estilo ni del contenido (el valor del atributo no cambia aunque
  cambie el texto o la clase).
- Los elementos repetidos por tropa llevan el id de la tropa en el contenedor
  (`offer-row-35700`) y atributos fijos en sus hijos.
- **Prioridad:** **Alta** = hoy se localiza por clase, `href`, `onclick`, texto o posición;
  **Media** = por `name` repetido u oculto; **Baja** = ya tiene un `id` estable (el `data-test-id` es
  deseable por consistencia, no urgente).

---

## 1. Login y confirmación de sesión

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 1.1 | Campo usuario | `#maillog` | `login-username` | Baja |
| 1.2 | Campo contraseña | `#password` | `login-password` | Baja |
| 1.3 | Botón Ingresar | `#ingresar_login` | `login-submit` | Baja |
| 1.4 | Título "Tendencias del mercado" (home del cliente) | `.contenedor_primario_escritorio > .titulo_secciones_home` | `home-market-trends-title` | Alta |
| 1.5 | Buscador del header (home Admin) | `input[placeholder="Buscar..."]` | `admin-search-input` (ver 5.1) | Alta |
| 1.6 | Barra de navegación del Admin | `.nav` | `admin-nav` | Alta |
| 1.7 | Cerrar sesión (Admin) | `.logout_azul` | `logout-button` | Media |

## 2. Cliente — formulario "Publicar una tropa de Invernada"

Ruta: `/__dcac/venderHacienda?solicitud_invernada&rapido`.

### 2.1 Selectores principales

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 2.1.1 | Sociedad vendedora | `#sociedad_select` | `offer-society-select` | Baja |
| 2.1.2 | Establecimiento | `#estab_soc` | `offer-establishment-select` | Baja |
| 2.1.3 | Categoría | `#categoriasSelect` | `offer-category-select` | Baja |
| 2.1.4 | Botón "Ofrecer Tropa" (hoy un `div`) | `.btn_ofrecer.env` | `offer-submit` | Alta |
| 2.1.5 | Botón agregar raza | `.btn_agregar_listado.agr_raza` | `offer-add-breed` | Alta |
| 2.1.6 | Botón "Adjuntar Filmación" | `.btn_subir_video` | `offer-video-button` | Alta |
| 2.1.7 | Input de archivo del video | `#Filedata` | `offer-video-file` | Baja |
| 2.1.8 | Resultado de la carga del video (éxito/fallo) | `#seccion_archivos` | `offer-video-result` | Baja |
| 2.1.9 | Enlace "Eliminar video cargado" (dentro de 2.1.8) | `#seccion_archivos a` | `offer-video-delete` | Media |
| 2.1.10 | Aviso "El video no ha terminado de cargarse" | `#modal_siguiente` | `offer-video-pending-modal` | Baja |

### 2.2 Campos de entrada (hoy por `name`, repetidos y ocultos según categoría)

Pedimos un `data-test-id` único por control **visible** de cada categoría. Valor propuesto: el mismo
nombre del campo en kebab-case.

| # | Campo | `name` actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 2.2.1 | Cantidad | `re_cantidad` | `offer-quantity` | Media |
| 2.2.2 | Peso promedio | `re_peso` | `offer-average-weight` | Media |
| 2.2.3 | Cabeza: peso / cantidad | `in_cabeza_peso` / `in_cabeza_cantidad` | `offer-head-weight` / `offer-head-quantity` | Media |
| 2.2.4 | Cuerpo: peso / cantidad | `in_cuerpo_peso` / `in_cuerpo_cantidad` | `offer-body-weight` / `offer-body-quantity` | Media |
| 2.2.5 | Cola: peso / cantidad | `in_cola_peso` / `in_cola_cantidad` | `offer-tail-weight` / `offer-tail-quantity` | Media |
| 2.2.6 | Raza 1 / 2 / 3 | `re_raza` / `re_raza2` / `re_raza3` | `offer-breed-1` / `offer-breed-2` / `offer-breed-3` | Media |
| 2.2.7 | Plazo de venta | `in_plazo_select` (`#plazo_select`) | `offer-sale-term` | Media |
| 2.2.8 | Edad | `in_edad` | `offer-age` | Media |
| 2.2.9 | Tratamiento nutricional | `in_tratamiento_nutricional` | `offer-nutrition` | Media |
| 2.2.10 | Estado corporal | `in_estado_corporal` | `offer-body-condition` | Media |
| 2.2.11 | Calidad | `in_calidad` | `offer-quality` | Media |
| 2.2.12 | Descarte | `in_descarte` | `offer-discard` | Media |
| 2.2.13 | Desbaste | `in_desbaste` | `offer-shrink` | Media |
| 2.2.14 | Distancia a la pesada | `in_distancia_pesada` | `offer-weighing-distance` | Media |
| 2.2.15 | Fecha de destete | `in_fecha_destete` | `offer-weaning-date` | Media |
| 2.2.16 | Tipo de rodeo | `in_tipo_rodeo` | `offer-herd-type` | Media |
| 2.2.17 | Dentición | `in_denticion` | `offer-teeth` | Media |
| 2.2.18 | Edad de la cría | `in_edad_cria` | `offer-calf-age` | Media |
| 2.2.19 | Peso promedio de la cría | `in_peso_promedio_cria` | `offer-calf-average-weight` | Media |
| 2.2.20 | Aclaración del cliente | `re_aclaracion_cliente` | `offer-client-clarification` | Media |

### 2.3 Radios (se activan con el `label[for=<id>]`)

El elemento que se pulsa es el `label`. Pedimos el `data-test-id` en el **label** (o en el input si
el label lo activa por `for`), con el valor `offer-radio-<id>`:

| Opción del formulario | `id` actual (`for`) | `data-test-id` propuesto |
|---|---|---|
| Marca Líquida: Sí | `si_marca` | `offer-radio-si_marca` |
| Destetados: Sí | `destetados` | `offer-radio-destetados` |
| Zona: Lucha / Sucia | `lucha` / `sucia` | `offer-radio-lucha` / `offer-radio-sucia` |
| Garrapata: Sí / No | `si_garrapata` / `no_garrapata` | `offer-radio-si_garrapata` / `offer-radio-no_garrapata` |
| Mio-Mio: Sí / No | `si_miomio` / `no_miomio` | `offer-radio-si_miomio` / `offer-radio-no_miomio` |
| Plan sanitario: Sí | `si_plan` | `offer-radio-si_plan` |
| Sanidad: Muy buena | `muy_buena` | `offer-radio-muy_buena` |
| Uniformidad: Parejo | `parejo` | `offer-radio-parejo` |
| Uniformidad de la cría: Desparejo | `desparejo_cria` | `offer-radio-desparejo_cria` |
| Pesada Carguío: Sociedad | `sociedad` | `offer-radio-sociedad` |

Prioridad: **Media** (el `id` existe pero se repite por bloques ocultos y el elemento visible se
resuelve filtrando `:visible`).

## 3. Cliente — confirmación del envío

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 3.1 | Título "Su tropa ha sido creada correctamente." | `.titulo_tropa_cargada` | `offer-created-title` | Alta |
| 3.2 | Enlace "operaciones" | `.txt_tropa_cargada a` | `offer-created-operations-link` | Alta |
| 3.3 | Botón "INGRESAR NUEVA TROPA" (el `a` interno a veces viene vacío) | `.btn_topa_cargada` | `offer-created-new-offer` | Alta |

## 4. Cliente (vendedor) — Pendientes de publicación e Informe de la tropa

Ruta: `/__dcac/misPublicaciones/pendientespublicacion`.

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 4.1 | Ítem de la tropa (contenedor; incluye el id de la tropa) | `#contenido-listado .listado` + texto de `.id_titulo_lote` | `pending-item-<tropaId>` | Alta |
| 4.2 | Número de lote `#NNNNN` | `.id_titulo_lote` | `pending-item-lot-id` | Alta |
| 4.3 | Cantidad y categoría | `.tit_cant_cat` | `pending-item-quantity-category` | Alta |
| 4.4 | Peso | `.tit_peso` | `pending-item-weight` | Alta |
| 4.5 | Razas | `.tit_razas` | `pending-item-breeds` | Alta |
| 4.6 | Sociedad | `.razon_social_titulo` | `pending-item-society` | Alta |
| 4.7 | Botón "Informe de la Tropa" | `button.modal-informe` | `pending-item-report-button` | Alta |
| 4.8 | Modal del informe | `#modal-informe` | `report-modal` | Baja |
| 4.9 | Bloque de segmentación | `#segmentacion_de_tropa` | `report-segmentation` | Baja |
| 4.10 | Peso promedio del informe | `#peso_promedio` | `report-average-weight` | Baja |
| 4.11 | Botón de la pestaña "Características" | `#btn_caracteristicas` | `report-characteristics-tab` | Baja |
| 4.12 | Cantidad sugerida | `#cant_sugerida` | `report-suggested-quantity` | Baja |
| 4.13 | Bloque de características (líneas "Etiqueta: valor") | `#caracteristicas_de_tropa` | `report-characteristics` | Baja |

> `4.1` a `4.6` se resuelven hoy buscando el bloque por el texto del lote; con `pending-item-<tropaId>`
> los hijos (`4.2` a `4.7`) se buscan dentro del ítem con atributos fijos.

## 5. Admin — navegación, buscador y listado de Ofrecimientos

### 5.1 Buscador global (camino 2)

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 5.1.1 | Campo de búsqueda | `#busca_i` | `admin-search-input` | Baja |
| 5.1.2 | Opción "Invernada" de los resultados (hoy `label.btn.btn-danger` filtrado por texto) | `#busca label.btn.btn-danger` + texto | `admin-search-option-invernada` | Alta |

### 5.2 Menú y listado (camino 1)

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 5.2.1 | Menú INVERNADA (su texto lleva un contador; todos los menús comparten `a.dropdown-toggle`) | `nav#navbar a.dropdown-toggle` + texto | `admin-menu-invernada` | Alta |
| 5.2.2 | Enlace "Ofrecimientos (N)" | `a[href="?ofrecimientos_a&secc=i&tit=0"]` | `admin-menu-invernada-offers` | Alta |
| 5.2.3 | Indicador "Cargando..." del listado (queda en el DOM al terminar) | `.loading-listado` | `offers-loading` | Alta |
| 5.2.4 | Contenedor del listado | `#listadoOfrecimientos` | `offers-list` | Baja |
| 5.2.5 | Fila de una tropa | `#fila_<tropaId>` (tiene además la clase `_boot`) | `offer-row-<tropaId>` | Media |
| 5.2.6 | Sociedad vendedora (enlace) | `a[href*="pag=sociedad"]` | `offer-row-society` | Alta |
| 5.2.7 | Cantidad | `.cantidad` | `offer-row-quantity` | Alta |
| 5.2.8 | Categoría | `.categoria` | `offer-row-category` | Alta |
| 5.2.9 | Peso promedio | `.peso` | `offer-row-weight` | Alta |
| 5.2.10 | Establecimiento | `.nombre` | `offer-row-establishment` | Alta |
| 5.2.11 | Botón "Ver Legajo" | `a[onclick^="cargar_form_invernada"]` | `offer-row-view-legajo` | Alta |

Los elementos `5.2.6` a `5.2.11` se buscan dentro de la fila `5.2.5`; basta que el atributo sea el
mismo en todas las filas.

## 6. Admin — Legajo de la tropa

El legajo se abre arriba del listado (camino 1) o solo en la vista (camino 2); el contenido es el
mismo, así que los atributos deben ser iguales en ambos.

### 6.1 Estructura general

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 6.1.1 | Contenedor del legajo | `#agregarinvernada #a_new_form` | `legajo-root` | Media |
| 6.1.2 | Número de negocio / tropa (`#NNNNN`) | `.a_id_negocio` | `legajo-tropa-id` | Alta |
| 6.1.3 | Cantidad sugerida | `#agregarinvernada #cant_sugerida` | `legajo-suggested-quantity` | Baja |
| 6.1.4 | Sociedad vendedora | `#sociedadNombre` | `legajo-society` | Baja |
| 6.1.5 | Bloque "Aclaraciones del cliente" (título `h4` + texto) | `div.comentarios` / `h4` por texto | `legajo-clarification` (el bloque completo) | Alta |
| 6.1.6 | Marca (tick) de Plan sanitario | `img[src="/imagenes/tick.png"]` | `legajo-sanitary-plan-tick` | Alta |

### 6.2 Datos del legajo (hoy se leen por el texto del `label` anterior, que no tiene id)

Pedimos el `data-test-id` en el elemento que contiene **el valor** (el `span` que sigue a la etiqueta).
Los de "Categoría" y "Peso promedio" hoy son `div.group_title` con el valor dentro de un `span`;
poner el atributo en ese `span`. Si un campo no corresponde a la categoría y no se muestra, el
elemento no debe existir (el test verifica esa ausencia).

| # | Dato (etiqueta actual) | `data-test-id` propuesto |
|---|---|---|
| 6.2.1 | Fecha Solicitud | `legajo-request-date` |
| 6.2.2 | Fecha Revisación | `legajo-review-date` |
| 6.2.3 | Raza 1 / Raza 2 / Raza 3 | `legajo-breed-1` / `legajo-breed-2` / `legajo-breed-3` |
| 6.2.4 | Categoría | `legajo-category` |
| 6.2.5 | Plazo de Venta | `legajo-sale-term` |
| 6.2.6 | Peso | `legajo-weight` |
| 6.2.7 | Peso promedio | `legajo-average-weight` |
| 6.2.8 | Edad | `legajo-age` |
| 6.2.9 | Trat. Nutricional | `legajo-nutrition` |
| 6.2.10 | Marca Líquida | `legajo-liquid-brand` |
| 6.2.11 | Garrapata | `legajo-tick` |
| 6.2.12 | Conocen Mio Mio | `legajo-mio-mio` |
| 6.2.13 | Zona | `legajo-zone` |
| 6.2.14 | Estado Corporal | `legajo-body-condition` |
| 6.2.15 | Calidad | `legajo-quality` |
| 6.2.16 | Sanidad | `legajo-health` |
| 6.2.17 | Uniformidad (de la tropa) | `legajo-uniformity` |
| 6.2.18 | Uniformidad (de la cría; hoy hay dos "Uniformidad:") | `legajo-calf-uniformity` |
| 6.2.19 | Descarte (Cabezas) | `legajo-discard` |
| 6.2.20 | Destetados | `legajo-weaned` |
| 6.2.21 | Fecha de Destete | `legajo-weaning-date` |
| 6.2.22 | Capados | `legajo-castrated` |
| 6.2.23 | Fecha que se caparon | `legajo-castration-date` |
| 6.2.24 | Desbaste | `legajo-shrink` |
| 6.2.25 | Distancia | `legajo-distance` |
| 6.2.26 | Pesada Carguío | `legajo-weighing-at` |
| 6.2.27 | Denticion | `legajo-teeth` |
| 6.2.28 | Tipo Rodeo | `legajo-herd-type` |
| 6.2.29 | Edad de la cría (Edad (meses)) | `legajo-calf-age` |
| 6.2.30 | Peso de la cría (Peso (Kgs)) | `legajo-calf-weight` |

Prioridad: **Alta** (no hay ningún identificador y la lectura depende del texto de la etiqueta y del
orden de los hermanos del DOM).

### 6.3 Segmentación

Hoy: `.seg_tropa .col_3.cabeza | .cuerpo | .cola`, con una etiqueta ("Peso Kgs Aprox:" o
"Cantidad:") y un `span` con el valor.

| # | Dato | `data-test-id` propuesto |
|---|---|---|
| 6.3.1 | Cabeza: peso / cantidad | `legajo-seg-head-weight` / `legajo-seg-head-quantity` |
| 6.3.2 | Cuerpo: peso / cantidad | `legajo-seg-body-weight` / `legajo-seg-body-quantity` |
| 6.3.3 | Cola: peso / cantidad | `legajo-seg-tail-weight` / `legajo-seg-tail-quantity` |

Prioridad: **Alta**. El atributo va en el elemento que contiene el valor numérico.

### 6.4 Multimedia

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 6.4.1 | Sección de multimedia | `#multimedias_invernada` | `legajo-media` | Baja |
| 6.4.2 | Título que expande la sección | `#multimedias_invernada .a_new_title_1 strong` | `legajo-media-toggle` | Alta |
| 6.4.3 | Indicador "Video cargado" (Si/No) | `b.video_cargado` | `legajo-video-loaded` | Alta |
| 6.4.4 | Sección desplegable | `#section_3` | `legajo-media-section` | Baja |
| 6.4.5 | Cada ítem (video o imagen; incluye "Tipo" y estado "Oculto") | `.multimedia_invernada` | `legajo-media-item` | Alta |

### 6.5 Cierre

| # | Elemento | Localizador actual | `data-test-id` propuesto | Prioridad |
|---|---|---|---|---|
| 6.5.1 | Botón cerrar legajo | `a[onclick="cerrarLote();location.reload();"]` | `legajo-close` | Alta |

## Resumen

| Prioridad | Filas de la tabla (cada fila puede cubrir 1 o 2 elementos) |
|---|---|
| Alta (clase/`href`/`onclick`/texto/posición) | 66 |
| Media (`name`/`id` repetidos u ocultos) | 34 |
| Baja (ya tienen `id` estable) | 21 |

Sugerencia de orden de implementación: primero **6.2 y 6.3** (legajo; es donde más depende el test
del texto de las etiquetas), luego **5.2** (listado), **4** (Pendientes) y **2.1/3** (botones y
confirmación). Cualquier cambio de nombre propuesto se puede ajustar si el equipo ya tiene una
convención de `data-test-id`; solo pedimos que nos avisen el valor final de cada uno.
