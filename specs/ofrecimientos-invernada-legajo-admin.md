# Plan QA — Ofrecimiento de invernada legacy verificado en el legajo Admin

Feature: `ofrecimientos-invernada-legajo-admin` (config: `config/ofrecimientos-invernada-legajo-admin.yaml`).

## Estado

Exploración completada el 13/10/2026 en `https://stage.dcac.ar/` con los roles Cliente y Admin.
**Plan pendiente de aprobación humana**: el generator no puede ejecutarse hasta que se responda
`aprobado`. No duplica los TC-INV-* de `specs/ofrecimientos-invernada.md` (se referencian TC-INV-032
y TC-INV-033). Se crearon 4 tropas reales en stage (#35685, #35686, #35687, #35688), no borradas.
Las preguntas OQ-057 a OQ-061 y OQ-063 a OQ-066 fueron respondidas por QA el 13/10/2026 (ver "Decisiones de QA"); OQ-062 sigue abierta. Lo no confirmado queda como pregunta abierta, no como defecto.

## Charter

Verificar que lo cargado por el cliente en el formulario legacy llega íntegro al legajo que ve el
Admin, por dos caminos:

1. Home > INVERNADA > OFRECIMIENTOS: listado con una tropa por div y botón "Ver Legajo".
2. Buscador global: tropaId (sólo números), ENTER y opción INVERNADA.

Riesgos: pérdida o transformación de datos (Critical), presentación de campos no cargados (High),
divergencia entre caminos (High).

## Datos cargados por flujo (exploración)

Comunes a los 4 flujos: primera sociedad y establecimiento disponibles, Raza 1 = Aberdeen Angus Negro,
Plazo = Contado, fecha actual = 13/10/2026.

| Dato | F1 Terneros mín. (#35685) | F2 Terneras compl. (#35686) | F3 Vacas con cría mín. (#35687) | F4 Vacas con cría compl. (#35688) |
| --- | --- | --- | --- | --- |
| Cantidad | 37 | 48 | 22 | 26 |
| Peso | no | 180 | no | 420 |
| Segmentación Cabeza/Cuerpo/Cola (peso/cant.) | no | 190/2, 180/44, 170/2 | no | 430/2, 420/22, 410/2 |
| Razas | 1 | 2 (Aberdeen Angus Colorado como 2.ª) | 1 | 2 |
| Edad | no | 8 (Meses) | no | 5 (Años) |
| Marca Líquida | no | Sí | no | Sí |
| Calidad / Estado Corporal | no | 7.5 / 3.5 | no | 7.5 / 3.5 |
| Trat. Nutricional | no | Racionados | no | A Corral |
| Destetados y fecha | no | Sí / fecha actual | n/a | n/a |
| Zona | no | Lucha, Garrapata Sí, Mio-Mio No | no | Sucia, Garrapata No, Mio-Mio Sí |
| Plan sanitario | no | Sí | n/a | n/a |
| Uniformidad / Sanidad | no | Parejo / Muy buena | no | Parejo / Muy buena |
| Descarte | no | 5 | no | 3 |
| Pesada Carguío | no | `#sociedad` | no | n/a para la categoría |
| Desbaste / Distancia | no | 4 / 20 | no | n/a |
| Tipo de Rodeo / Dentición | n/a | n/a | no | Puro controlado / Boca Llena |
| Cría: edad / peso / uniformidad | n/a | n/a | no | 4 meses / 120 kg / Desparejo |
| Aclaración del cliente | no | texto identificable | no | texto identificable |
| Video | no | `video_ofrecimiento.mp4` (29 s) | no | `video_ofrecimiento.mp4` (29 s) |

El formulario deja enviar con sólo cantidad, categoría, raza y plazo (sin peso ni segmentación).
Los textos y cantidades de la exploración son orientativos: el spec los genera con un sufijo
identificable `QA-LEG` y fecha dinámica.

## Perfiles de datos (nuevos, `cypress/support/data/invernada_offer_data.js`)

| Perfil | Categoría | Datos |
| --- | --- | --- |
| LEG_TERNEROS_MIN | Terneros | Cantidad; raza y plazo = primeras opciones; nada más |
| LEG_TERNERAS_FULL | Terneras | Según F2; fechas = fecha actual; video válido de 29 s |
| LEG_VACAS_MIN | Vacas con cría | Cantidad; raza y plazo = primeras opciones; nada más |
| LEG_VACAS_FULL | Vacas con cría | Según F4; video válido de 29 s |

## Matriz de caminos del Admin

| Flujo | Camino 1 (listado + Ver Legajo) | Camino 2 (buscador) | Datos del listado (INV-LEG-006) |
| --- | --- | --- | --- |
| F1 Terneros mínimo | sí | no | sí |
| F2 Terneras completo | no | sí | no |
| F3 Vacas con cría mínimo | no | sí | no |
| F4 Vacas con cría completo | sí | no | sí |

Cada camino queda en al menos un flujo mínimo y uno completo. El contenido del legajo se compara
completo en los 4 flujos.

## Observaciones por pantalla

### Listado del Admin (camino 1)

Los 4 divs coinciden en Sociedad, Cantidad, Categoría y Establecimiento. Diferencias:

| Dato | Observado |
| --- | --- |
| `.peso` en flujos mínimos | "0 Kg" (no se cargó peso) — OQ-059 |
| Sociedad (`a[href*="pag=sociedad"]`) | "Considine, O'kon And Feest" frente a "O'Kon and Feest" en el legajo — OQ-064 |
| Carga | lenta ("Cargando..."), páginas de 100 tropas, más nuevas primero — OQ-066 |

### Pendientes del cliente e informe (INV-LEG-007)

| Tropa | Observado |
| --- | --- |
| #35685 | Ítem "37 Terneros 0 Kg"; informe con defaults (Edad 0, Capados No, Destetados No, Garrapata No, Mio-Mio No, Zona Limpia, Calidad/Sanidad/Estado Corporal/Uniformidad vacíos, "Sin datos") |
| #35686 | Ítem "48 Terneras 180 Kg", 2 razas; informe con segmentación, Edad 8, Destetados Sí y fecha, Racionados, Marca Sí, Calidad 7.5, Sanidad, Zona Lucha, Garrapata Sí, Mio-Mio No, Estado Corporal 3.5, Uniformidad. NO se ve: Descarte, Desbaste, Distancia, Pesada Carguío, aclaración, Plan sanitario |
| #35687 | Ítem "22 Vacas con cría 0 Kg"; informe con Fecha de Servicio 00/00/0000, Raza de Servicio "No Especificado", Edad 0, "Cantidad crías machos/hembras: 0" |
| #35688 | Ítem "26 Vacas con cría 420 Kg", 2 razas; informe con segmentación, Edad 5, Boca Llena, campos de servicio y cría en 0 / 00/00/0000 (la cría 4 meses, 120 kg, Desparejo NO se ve). NO se ve Tipo de Rodeo, Trat. Nutricional, Descarte, aclaración — OQ-061 |

### Legajo del Admin: dato cargado vs. mostrado

Ambos caminos devuelven el mismo legajo (hash idéntico del texto en #35686, #35687 y #35688;
#35685 por revisión textual). Estado: C = coincide, F = formato o valor distinto, V = vacío.

#### Flujo 1, Terneros mínimo (#35685)

| Etiqueta | Valor mostrado | Estado |
| --- | --- | --- |
| Id negocio / Categoría / Cantidad (`#cant_sugerida`) | 35685 / Terneros / 37 | C |
| Sociedad / Establecimiento | los de stage usados en el envío | C |
| Aclaraciones del cliente | "No hay Comentarios del Cliente" | C (mensaje por defecto) |
| Fecha Solicitud | fecha actual | C |
| Fecha Revisación | 00/00/0000 a las 00:00 | F (OQ-060) |
| Raza 1 / 2 / 3 | Aberdeen Angus Negro / No Especificado / No Especificado | C |
| Peso, Segmentación, Peso promedio | 0 / 0 / "0 Kg" | F (OQ-058, OQ-059) |
| Edad | 0 Meses | F (OQ-058) |
| Trat. Nutricional | Sin datos | F (OQ-058) |
| Destetados / Capados y sus fechas | No / 00/00/0000 | F (OQ-036, OQ-057, OQ-058) |
| Marca Líquida / Garrapata / Mio-Mio / Zona | No / No / No / Limpia | F (defaults, OQ-058) |
| Estado Corporal / Calidad / Sanidad / Uniformidad | sin valor | V |
| Descarte / Desbaste / Distancia | sin valor | V |
| Multimedia | sin indicador `b.video_cargado` ni ítems | C (no se cargó video) |
| Plazo de Venta | Contado | C (el legajo lo muestra; Pendientes no, OQ-056) |
| Pesada Carguío | No Especificado | F |

#### Flujo 2, Terneras completo (#35686)

| Etiqueta | Valor mostrado | Estado |
| --- | --- | --- |
| Aclaraciones del cliente | texto cargado | C (Pendientes no la muestra) |
| Fecha Solicitud | fecha actual | C |
| Raza 1 / 2 / 3 | Aberdeen Angus Negro / Aberdeen Angus Colorado / No Especificado | C |
| Peso / Segmentación / Peso promedio | 180 / 190/2, 180/44, 170/2 / "180 Kg" | C |
| Categoría / Cantidad / Edad | Terneras / 48 / 8 Meses | C |
| Trat. Nutricional | Racionados | C |
| Destetados / Fecha de Destete | Sí / fecha actual | C (Capados no aparece, correcto para Terneras) |
| Plan Sanitario | tilde `img[src="/imagenes/tick.png"]`; tablas con fechas 00/00/0000; "Suplemento de cobre: No" | C / F |
| Marca Líquida / Garrapata / Mio-Mio / Zona | Sí / Sí / No / Lucha | C |
| Estado Corporal / Calidad / Sanidad / Uniformidad | 3.5 / 7.5 / Muy buena / Parejo | C |
| Multimedia | `b.video_cargado` "Si"; al expandir: 6 `imagen` y 1 `video`, todos "Oculto" | C (OQ-063) |
| Descarte / Desbaste / Distancia | 5 / 4 / 20 | C |
| Plazo de Venta | Contado | C |
| Pesada Carguío | "Sociedad Rural" (se cargó `#sociedad`) | F (OQ-062) |

#### Flujo 3, Vacas con cría mínimo (#35687)

| Etiqueta | Valor mostrado | Estado |
| --- | --- | --- |
| Aclaraciones del cliente | "No hay Comentarios del Cliente" | C |
| Categoría / Cantidad | Vacas con cría / 22 (bloque titulado "Vacas") | C |
| Peso / Segmentación / Peso promedio | 0 / 0 / "0 Kg" | F |
| Edad | 0 Años | F |
| Trat. Nutricional / Dentición | Sin datos / No especificado | F |
| Tipo Rodeo | "-" (placeholder del select) | F |
| Datos de la Cría (edad, peso, uniformidad) | sin valor | V |
| Marca Líquida / Garrapata / Mio-Mio / Zona | No / No / No / Limpia | F (defaults) |
| Estado Corporal / Calidad / Sanidad / Uniformidad | sin valor | V |
| Multimedia | sin indicador ni ítems | C |
| Plazo de Venta / Pesada Carguío | Contado / No Especificado | C / F |

#### Flujo 4, Vacas con cría completo (#35688)

| Etiqueta | Valor mostrado | Estado |
| --- | --- | --- |
| Aclaraciones del cliente | texto cargado | C |
| Raza 1 / 2 / 3, Peso | Aberdeen Angus Negro / Aberdeen Angus Colorado / No Especificado; 420 | C |
| Segmentación / Peso promedio | 430/2, 420/22, 410/2 / "420 Kg" | C |
| Categoría / Cantidad / Edad | Vacas con cría / 26 / 5 Años | C |
| Trat. Nutricional / Dentición / Tipo Rodeo | A Corral / Boca Llena / Puro controlado | C |
| Datos de la Cría: edad / peso / uniformidad | 4 / 120 / Desparejo | C |
| Marca Líquida / Garrapata / Mio-Mio / Zona | Sí / No / Sí / Sucia | C |
| Estado Corporal / Calidad / Sanidad / Uniformidad | 3.5 / 7.5 / Muy buena / Parejo | C |
| Multimedia | `b.video_cargado` "Si"; 7 ítems (6 imagen + 1 video), "Oculto" | C |
| Descarte / Plazo de Venta | 3 / Contado | C |
| Desbaste / Distancia / Pesada Carguío | sin valor / sin valor / No Especificado | C (no aplican a la categoría) |

Resumen de diferencias: la aclaración del cliente, el Plazo de Venta, el video, el Tipo de Rodeo y los
datos de la cría se ven en el legajo y NO en el informe de Pendientes. Los campos no cargados aparecen
como 0, "No", "Sin datos", "-", "No Especificado", 00/00/0000 o vacío, según el campo. El indicador
`b.video_cargado` existe sólo cuando hay video.

### Navegación

| Camino | Resultado observado |
| --- | --- |
| 1: Home admin > INVERNADA (`a.dropdown-toggle`) > "Ofrecimientos (N)" (`a[href="?ofrecimientos_a&secc=i&tit=0"]`) | Carga lenta con "Cargando..." (menos de 10 min). Cada tropa en `#fila_<id>`. "Ver Legajo" abre el legajo arriba de la página; URL `...#legajo`, título "[<id>] Ofrecimientos (N) - Invernada - ..."; el listado queda debajo. |
| 2: buscador `#busca_i`, ENTER, botón `#busca label.btn.btn-danger` ("Invernada") | URL `https://stage.dcac.ar/`, título "Admin DCAC ->"; la vista muestra "Lote en: Ofrecimientos", "Cerrar" y el legajo (`#agregarinvernada`). El menú ofrece además Faena, Mercado y Sociedades (un número puede coincidir con un CUIT; OQ-065). |

## Decisiones de QA (13/10/2026)

| OQ | Respuesta | Efecto en el plan |
| --- | --- | --- |
| OQ-057 | Una fecha no cargada se muestra `00/00/0000` | Se asierta en el legajo |
| OQ-058 | Los valores por defecto de campos no cargados son lo esperado | Se asierta (Edad 0, "No", "Sin datos", etc.) |
| OQ-059 | "0 Kg" debe verse | Se asierta en listado y legajo |
| OQ-060 | `00/00/0000 a las 00:00` es el formato esperado de Fecha Revisación | Se asierta |
| OQ-061 | El legajo muestra todos los campos, se hayan cargado o no; un campo que no corresponde a la categoría sería error (p. ej. Capados en Terneras) | Se asierta la ausencia de campos ajenos a la categoría |
| OQ-063 | "Oculto" en multimedia es lo esperado; el Admin hace visibles las imágenes con un clic | Se asierta el estado "Oculto" en el video y en las 6 imágenes generadas |
| OQ-064 | La capitalización distinta de la sociedad en el listado es aceptable | Se compara sin distinguir mayúsculas |
| OQ-065 | El buscador no cambia la URL; no es exclusivo de tropaId; hay que validar el ingreso al legajo desde ahí | Los flujos que usan el camino 2 asiertan que se abre el legajo de la tropa |
| OQ-066 | La página es lenta; el orden del listado no es igual en todos los estados; sólo hay un buscador (el cubierto) | Timeouts generosos; la fila se localiza por `#fila_<id>` |

## Casos de prueba

### TC-LEG-001 — F1 Terneros mínimo: cliente ofrece, vendedor verifica, Admin camino 1
- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-LEG-001, INV-LEG-003, INV-LEG-004, INV-LEG-005, INV-LEG-006, INV-LEG-007.
- Pasos: el cliente ofrece Terneros con sólo cantidad, categoría, raza y plazo y se captura el tropaId; verifica ítem e informe en Pendientes; el Admin abre Ofrecimientos, valida el div `#fila_<id>` (sociedad, cantidad, categoría, peso, establecimiento) y pulsa "Ver Legajo".
- Esperado observado: ver "Flujo 1". Cantidad y categoría coinciden; sin video ni comentarios.
- Automatizable: sí (aislamiento completo).

### TC-LEG-002 — F2 Terneras completo con video, Admin camino 2
- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-LEG-002, INV-LEG-003, INV-LEG-004, INV-LEG-007.
- Pasos: el cliente ofrece Terneras con todos los campos y el video de 29 s; verifica Pendientes; el Admin busca el tropaId en `#busca_i`, ENTER, elige Invernada.
- Esperado observado: ver "Flujo 2": todo coincide; Pesada Carguío "Sociedad Rural" (observado, OQ-062 abierta); aclaración visible; `b.video_cargado` "Si". Al entrar por el buscador se asierta que se abre el legajo de esa tropa (OQ-065).
- Automatizable: sí.

### TC-LEG-003 — F3 Vacas con cría mínimo, Admin camino 2
- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-LEG-001, INV-LEG-003, INV-LEG-004, INV-LEG-005, INV-LEG-007.
- Esperado observado: ver "Flujo 3".
- Automatizable: sí.

### TC-LEG-004 — F4 Vacas con cría completo con video, Admin camino 1
- Tipo/prioridad: positive + data-integrity / Critical. Cubre INV-LEG-002, INV-LEG-003, INV-LEG-004, INV-LEG-006, INV-LEG-007.
- Esperado observado: ver "Flujo 4": todo coincide, incluidos Tipo de Rodeo, Dentición, datos de la cría, aclaración y video.
- Automatizable: sí.

### TC-LEG-005 — Datos de la tropa en el listado del Admin (F1 y F4)
- Tipo/prioridad: data-integrity / High. Cubre INV-LEG-006.
- Esperado: `.cantidad`, `.categoria`, `.nombre` y sociedad coinciden (sociedad sin distinguir mayúsculas, OQ-064); `.peso` = peso cargado, o "0 Kg" cuando no se cargó (OQ-059, respondida).
- Automatizable: sí (dentro de TC-LEG-001 y TC-LEG-004).

### TC-LEG-006 — Presentación de campos no cargados (F1 y F3)
- Tipo/prioridad: data-integrity / High. Cubre INV-LEG-005. Relacionada con OQ-036, OQ-057, OQ-058, OQ-059.
- Esperado (confirmado por QA, OQ-057, 058, 059, 060, 061): el legajo muestra todos los campos aunque no se hayan cargado, con sus valores por defecto: Peso y Segmentación 0 ("0 Kg"), Edad 0, fechas no cargadas `00/00/0000`, Destetados/Capados "No", Marca Líquida/Garrapata/Mio-Mio "No", Zona "Limpia", Trat. Nutricional "Sin datos", Dentición "No especificado", Tipo Rodeo "-", Pesada Carguío "No Especificado"; vacíos: Estado Corporal, Calidad, Sanidad, Uniformidad, Descarte, Desbaste, Distancia y datos de la cría. Un campo que no corresponde a la categoría sería error (p. ej. Capados en Terneras).
- Automatizable: sí (F1 y F3), con los valores observados arriba.

### TC-LEG-007 — Aclaración del cliente y video en el legajo (F2 y F4)
- Tipo/prioridad: data-integrity / High. Cubre INV-LEG-004.
- Esperado (OQ-063 respondida): la aclaración se muestra en "Aclaraciones del cliente"; `b.video_cargado` "Si" y existe un ítem "Tipo: video" y 6 ítems "Tipo: imagen" (se generan 6 imágenes por el video cargado, confirmado por QA el 13/10/2026), los 7 con estado "Oculto" (el Admin los hace visibles luego con un clic).
- Automatizable: sí.

### TC-LEG-008 — Fechas actuales (F2)
- Tipo/prioridad: data-integrity / Medium. Cubre INV-LEG-004.
- Esperado observado: "Fecha de Destete" y "Fecha Solicitud" = fecha de hoy.
- Automatizable: sí.

### TC-LEG-009 — Destetados, Capados y datos de la cría
- Tipo/prioridad: data-integrity / Medium. Cubre INV-LEG-004.
- Esperado: F2 muestra Destetados y su fecha y NO muestra Capados ni su fecha (un campo ajeno a la categoría sería error, OQ-061); F4 muestra los tres datos de la cría y no muestra campos de Terneras.
- Automatizable: sí (dentro de TC-LEG-002 y TC-LEG-004).

### TC-LEG-010 — Equivalencia de los dos caminos
- Tipo/prioridad: navigation + data-integrity / High. Cubre INV-LEG-003.
- Esperado observado: el texto del legajo es idéntico por ambos caminos; difieren el contexto (URL, título, listado debajo).
- Automatizable: no. Motivo: `out_of_scope` como caso propio; queda cubierto de forma implícita por los 4 flujos (cada camino compara el legajo completo). Una comparación cruzada sobre la misma tropa queda como opción si se aprueba.

### TC-LEG-011 — Verificación del vendedor en Pendientes por flujo
- Tipo/prioridad: data-integrity / High. Cubre INV-LEG-007. Reutiliza TC-INV-033.
- Esperado observado: ver "Pendientes del cliente e informe". Se asierta sólo lo que el informe muestra con el valor cargado.
- Automatizable: sí (reutiliza `InvernadaMyPublicationsPendingPage`).

### TC-LEG-012 — Permisos: el cliente no accede al legajo Admin
- Tipo/prioridad: permission / Medium.
- Automatizable: no. Motivo: `missing_observed_selector` (no se exploró una URL del legajo Admin con rol cliente).

## Trazabilidad

| Alcance | Casos |
| --- | --- |
| INV-LEG-001 | TC-LEG-001, TC-LEG-003 |
| INV-LEG-002 | TC-LEG-002, TC-LEG-004 |
| INV-LEG-003 | TC-LEG-001 a TC-LEG-004, TC-LEG-010 |
| INV-LEG-004 | TC-LEG-001 a TC-LEG-004, TC-LEG-007, TC-LEG-008, TC-LEG-009 |
| INV-LEG-005 | TC-LEG-001, TC-LEG-003, TC-LEG-006 |
| INV-LEG-006 | TC-LEG-001, TC-LEG-004, TC-LEG-005 |
| INV-LEG-007 | TC-LEG-001 a TC-LEG-004, TC-LEG-011 |

## Preguntas abiertas propuestas

OQ-058 a OQ-066, registradas en `knowledge/open-questions.md`. Respondidas por QA el 13/10/2026: todas excepto OQ-062 (nombre "Sociedad Rural" de Pesada Carguío), que sigue abierta: ese valor se asierta como observado, sin darlo por regla.

## Automation Handoff

### Page Objects
- Create `cypress/pages/AdminInvernadaOffersPage.js` (listing): menu entry, `rowFor(tropaId)` = `#fila_<id>`, accessors for `.cantidad`, `.categoria`, `.peso`, `.nombre`, `.estab_provincia`, `.estab_partido`, society link, `openLegajo(tropaId)`.
- Create `cypress/pages/AdminInvernadaLegajoPage.js` (legajo): root `#agregarinvernada #a_new_form`; `valueOf(labelText)` = first visible `label` of the form whose text equals the label, then its `nextElementSibling`; `valueOfNth(label, n)` for the duplicated "Uniformidad:"; clarification (`h4` "Aclaraciones del cliente" and the next `div`); `#cant_sugerida`; `.a_id_negocio`; plan sanitario tick `img[src="/imagenes/tick.png"]`; multimedia (`b.video_cargado`, `#multimedias_invernada .a_new_title_1 strong`, `#section_3 .multimedia_invernada`); `close()` = `a[onclick="cerrarLote();location.reload();"]`. Never click Guardar, Publicar, Editar, Eliminar.
- Create `cypress/pages/AdminSearchPage.js` (global search): `#busca_i`, ENTER, `#busca label.btn.btn-danger` (Invernada).
- Reuse `InvernadaOfferPage` (`fillOffer`, `submitOffer`, `attachVideo`), `InvernadaMyPublicationsPendingPage`, `InvernadaConfirmationPage`, `loginWithSession` (role admin) and `captureTropaId` / `observeLotRequests` from `invernada_trace_helper.js`.

### Observed selector inventory (13/10/2026)
- Admin listing: menu `a.dropdown-toggle` with text "INVERNADA" (home); `a[href="?ofrecimientos_a&secc=i&tit=0"]` ("Ofrecimientos (N)"); `.tropas_cabezas`; container `#listadoOfrecimientos > .listado_g`; each tropa `div#fila_<tropaId>.listado_body.fila`.
- Inside the row: `.revisacion .no_mobile` ("#<tropaId>"), `.fecha_hora`, `.hora`, society `a[href*="pag=sociedad"]`, `.cantidad`, `.categoria`, `.categoria_id`, `.cantidad_machos`, `.cantidad_hembras`, `.peso` ("N Kg"), establishment `.nombre`, `.estab_provincia`, `.estab_partido`, "Ver Legajo" `.s-turque` (`a[onclick^="cargar_form_invernada"]`, href `#legajo`). `.eliminar-listado` must NOT be used.
- The listing's own search box was not identified and is not used by the flows.
- Global search: `#busca_i` (input, placeholder "Buscar..."), dropdown `ul#busca.dropdown-menu` inside `li#li_busca.dropdown`, Invernada option `#busca label.btn.btn-danger`.
- Legajo (`div#agregarinvernada > .a_new_wrapper_inv > form#a_new_form`): header `.a_new_name.box_gradient` (client name and masked email: do not verify or store), `.a_id_negocio` (its sibling `span` holds the id), `#sociedadNombre`, `.label_sociedades_invernada`, `.label_representante_invernada`, `.label_operador_invernada`, `.label_asociado_comercial`, `#renspa_establecimiento`, `#idEstablecimiento`.
- Legajo: `h4` "Aclaraciones del cliente" with the text in the next `div`; `#cant_sugerida`; the rest has no ids: `label` + `nextElementSibling` (`span`, or `span.aviso_col_2` for the unit). Labels: "Fecha Solicitud:", "Fecha Revisación:", "Raza 1:", "Peso:", "Raza Publicación", "Negocio a Término", "Categoría:", "Peso Kgs Aprox:" (Cabeza/Cuerpo/Cola), "Peso promedio:", "Edad:", "Trat. Nutricional:", "Destetados:", "Fecha de Destete:", "Capados:", "Fecha que se caparon:", "Denticion:", "Tipo Rodeo:", "Datos de la Cría" (Edad (meses), Peso (Kgs), Uniformidad), "Marca Líquida:", "Garrapata:", "Estado Corporal:", "Conocen Mio Mio:", "Calidad:", "Zona:", "Sanidad:", "Uniformidad:" (two labels: cría and tropa), "Descarte :" (with `.aclaracion_legajo` "(Cabezas)"), "Plazo de Venta:", "Pesada Carguío:", "Desbaste:", "Distancia:".
- Plan sanitario: label "Informa Plan Sanitario:" with `img[src="/imagenes/tick.png"]` and `input[name=info_plan_sanitario]`.
- Multimedia: fieldset `#multimedias_invernada`, header `.a_new_title_1 strong` (click expands/collapses), `b.video_cargado` ("Si" only with video; visible without expanding), `#section_3` (`display:none` by default), `#seccion_archivos`, `#grilla_multimedia`, `.multimedia_invernada` (`#multimedia_invernada_<id>`) with "Tipo: imagen|video", "Oculto", "Bajar", "Eliminar" (do not use).
- Legajo buttons not to be used: `input[name=guardar]`, `#b_publicar`, `#b_publicar_oculto`, `input[name=volver]`. Close: `a[onclick="cerrarLote();location.reload();"]`.
- Client form (new or confirmed): `[name=re_raza2]` appears after `.btn_agregar_listado.agr_raza`; `#sociedad_select` and `#estab_soc` placeholders have `value=""` (not `"0"`): pick the first option other than `""`, `"0"` and `crear`; `in_calidad` / `in_estado_corporal` option values are ids (7.5 = 4, 3.5 = 6): select by text; Terneras shows `in_fecha_destete` after `label[for=destetados]`, `in_pesada_carguio` (`#sociedad` shows "Sociedad Rural" in the legajo) and `in_sanidad` radios `#muy_buena/#buena/#regular`; Vacas con cría shows `in_tipo_rodeo` (options "-", Rodeo General, Puro controlado, Puro Pedigree, Angus MAS), `in_denticion`, `in_edad_cria`, `in_peso_promedio_cria`, `#parejo_cria/#desparejo_cria`, and no Plan sanitario, Pesada Carguío, Desbaste or Distancia.
- Pendientes: already observed in `specs/ofrecimientos-invernada.md`; they worked unchanged.

### Helpers
- Reuse `captureTropaId`, `observeLotRequests` and `loginWithSession`.
- New `visitAdminOfferings()`: admin session, home `/`, click INVERNADA, click the Ofrecimientos link, wait until "Cargando..." disappears (timeout of at least 120 s) and `#fila_<id>` exists.
- New `openLegajoByListing(tropaId)` and `openLegajoBySearch(tropaId)`; wait until the `.a_id_negocio` sibling contains the id.
- `legajoAssertions(profile, expected)`: compares label/value pairs, including the default values of unloaded fields (confirmed by QA, OQ-057 to OQ-061), and asserts that fields that do not belong to the category are absent (e.g. no Capados for Terneras).
- Do not hardcode society or establishment names: use the first available options.

### Related specs
- `cypress/e2e/ofrecimientos-invernada/ofrecimientos-invernada-envio.cy.js` (fillOffer, submit, tropaId, Pendientes).
- New: `cypress/e2e/ofrecimientos-invernada-legajo-admin/*.cy.js`, one chained `it` per flow (client, then admin) with full isolation.
- Legajo exploration: `knowledge/legajo-invernada-comprador-exploration.md`.

### Required data
- Env: `TEST_CLIENT_USERNAME`, `TEST_CLIENT_PASSWORD`; admin via `TEST_ADMIN_USERNAME` / `TEST_ADMIN_PASSWORD` (mapped in `cypress.config.js` from `USER_ADMIN` / `PASSWORD`).
- Video: `cypress/fixtures/video_ofrecimiento.mp4` (29 s), override `INVERNADA_VIDEO_PATH`. The full flows FAIL (not skip) if the file is missing, as in the other invernada specs (`attachVideo` already asserts it).
- New profiles in `cypress/support/data/invernada_offer_data.js`: LEG_TERNEROS_MIN, LEG_TERNERAS_FULL, LEG_VACAS_MIN, LEG_VACAS_FULL. Select Calidad and Estado Corporal by text (7.5 / 3.5).
- Each run creates 4 real, undeletable stage tropas. The listing shows the newest first (pages of 100): locate rows by `#fila_<id>`; if not found in the first page, fail with a clear message (OQ-066).

### Traceability
INV-LEG-001 to INV-LEG-007 as in the traceability table above.

### Excluded or not automated
- TC-LEG-010: `out_of_scope` as its own case.
- TC-LEG-012: `missing_observed_selector`.

## Notas de implementación (13/10/2026)

- Segmentación en el legajo: bloques `.seg_tropa .col_3.cabeza|cuerpo|cola`; cada uno tiene un `label` ("Peso Kgs Aprox:" o "Cantidad:"), un `span.aviso_col_2` con el nombre de la parte y un `span` con el valor, y el orden varía entre bloques. Se comparan los 6 pares con igualdad exacta (sólo en los flujos completos; en los mínimos vale 0 y no se asierta).
- Aclaración del cliente: es un nodo de texto dentro de `div.comentarios`, junto al `h4`.
- Menú INVERNADA del Admin: el texto lleva un contador ("INVERNADA 252"); se localiza por texto con el contador opcional. El indicador "Cargando..." queda en el DOM aunque esté oculto.
- El establecimiento sólo se compara en el listado; dentro del legajo no hay selector observado.
- Corrida final de los 4 flujos con el código final: 4 pasan (7 min), TC-LEG-001 a TC-LEG-004.

## Evidencia

No se guardaron capturas bajo `artifacts/` en esta exploración; quedó una captura en el directorio del
MCP (`.playwright-mcp/page-2026-10-13T09-28-34-613Z.png`, menú del buscador). Plan redactado a partir
del informe del subagente `playwright_test_planner` (13/10/2026) y persistido por el orquestador.
