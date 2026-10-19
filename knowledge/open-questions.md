# Preguntas abiertas y ambigüedades

Estas preguntas deben resolverse con Producto, Desarrollo o una fuente funcional adicional. Los agentes no deben inventar respuestas.

## Abiertas

- `OQ-001`: ¿Cuál es el procedimiento completo para crear clientes?
- `OQ-002`: ¿Admin corresponde siempre al permiso 4 y CR siempre al 6? ¿Qué excepciones existen?
- `OQ-003`: ¿Qué permiso concreto habilita a un Admin para editar el CR de una sociedad?
- `OQ-004`: ¿Cuál es la diferencia oficial entre Asociado Comercial y Comercial Regional, si existe?
- `OQ-005`: la fuente dice que todas las sociedades pueden “ofertar” tropas de invernada, pero también exige una marca para comprar por CI. ¿Qué acciones permite cada condición?
- `OQ-006`: ¿`Matrícula` acepta cualquier texto y qué formato/rango valida `ONCCA`?
- `OQ-007`: ¿Cuál es el flujo y la configuración completos de notificaciones por sociedad?
- `OQ-008`: ¿CI y CID son nombres equivalentes o funcionalidades distintas?
- `OQ-009`: ¿Cuál es la fórmula exacta de `Tabla menos` y cómo interactúan `Tabla desde` y `Tope`?
- `OQ-010`: ¿Cuáles son los tres plazos mínimos válidos de una cotización de invernada y qué validaciones tienen sus porcentajes?
- `OQ-011`: la CI de invernada enumera Cuota 2 como obligatoria, pero permite 100 % en Cuota 1. ¿Puede omitirse Cuota 2 o debe cargarse con 0 %?
- `OQ-012`: ¿10 % es un límite de `Rendimiento esperado` de CI de invernada o sólo un valor habitual?
- `OQ-013`: ¿Qué unidad utiliza el rendimiento de faena mencionado como valor aproximado a 4?
- `OQ-014`: ¿`Distancia` es obligatoria y qué unidad/formato usa cuando el flete es `Puesto en planta`?
- `OQ-015`: ¿Cuál es el esquema completo y la validación de columnas del CSV de CI de faena?
- `OQ-016`: ¿Cómo se determina la duración de cada sociedad exclusiva o grupo en la secuencia de envíos?
- `OQ-017`: ¿Qué sucede si dos compradores aceptan una CI simultáneamente?
- `OQ-018`: ¿Qué transiciones componen los estados de Invernada y Faena y qué roles pueden ejecutarlas?
- `OQ-019`: ¿Por qué `A liquidar` y `Liquidadas` comparten estado visible para el cliente? ¿Qué datos o acciones los diferencian?
- `OQ-020`: ¿Cuál es la definición formal de TP2 y qué restricciones legales, funcionales y de validación tiene?
- `OQ-021`: ¿Qué comportamiento produce exactamente el estado o aviso `Comprobante en proceso`?
- `OQ-022`: ¿El workaround que elimina `disabled` es todavía necesario y válido en Stage?
- `OQ-023`: faltan reglas completas para MAG, dCP y Ventas Externas.
- `OQ-024`: ¿Los nombres de estado singulares/plurales y diferencias como `Publicadas`/`Publicados` son etiquetas exactas o errores de la fuente?
- `OQ-025`: ¿Qué campos exactos, formatos, encoding y validaciones requiere el CSV de Viaje Inmediato?
- `OQ-026`: ¿Qué significa funcionalmente que una tropa esté “a cargo de dcac” y cómo se configura?
- `OQ-027`: ¿Qué ocurre con un Viaje Inmediato ya aceptado si se modifican los datos del legajo? ¿Debe notificarse, reaceptarse o auditarse el cambio?
- `OQ-028`: ¿Qué define que varios viajes de faena puedan enviarse juntos, además de compartir fecha de carga, origen y destino?
- `OQ-029`: ¿Qué diferencia existe entre los estados de viaje `A realizar` y `Realizado`, y qué actor puede efectuar la transición?
- `OQ-030`: ¿React debe volver a mostrar o persistir Calidad, Cantidad en tropas mixtas, Estado corporal, Uniformidad, Descarte y Sanidad en ofrecimientos de invernada, o su ausencia es un cambio aprobado?
- `OQ-031`: ¿Cuál es la matriz oficial de categorías aplicable a Faena frente a Invernada? El archivo `Faena - Datos solicitados según categoría.xlsx` contiene categorías de invernada/cría y no permite atribuirlas por sí solo a Faena.
- `OQ-032`: ¿La decisión de permitir videos menores a 7 segundos aplica a React, legacy o ambos, y cuál es el umbral exacto? El DOCX menciona también una validación de aplicación y referencias a videos menores a 10/7 segundos.
- `OQ-033`: ¿Cuál es la unidad y regla de Edad en React para Vaquillonas con cría y MEJ, y se resolvió el problema general de que la edad no llega al legajo?
- `OQ-034`: ¿Zona debe moverse definitivamente a Información de la tropa y qué campos Garrapatas/Mio Mio deben desplegarse para Zona Lucha/Sucia?
- `OQ-035`: Cuando Balanza es “Balanza del Establecimiento”, ¿Distancia a la balanza debe ocultarse, quedar opcional o enviarse con un valor distinto de cero?
- `OQ-036`: ¿Las fechas de destete/capado y los campos no solicitados que llegan vacíos al legajo se eliminaron para todas las categorías React o sólo para los escenarios documentados?
- `OQ-037`: Para categorías preñadas con Servicio natural, ¿Origen de los toros está implementado en React y se persiste correctamente en el legajo?
- `OQ-038`: ¿Por qué Administrador y Asociado comercial ingresan a `/` (shell `Admin DCAC ->`) y Cliente y Agente a `/__dcac/`? ¿Qué ocurre al abrir la URL de otro rol? (`knowledge/login-dcac-exploration.md`; relacionada con `OQ-002` y `OQ-004`)
- `OQ-039`: ¿Es intencional la grafía `Direcion` en `Direcion de email no valida.`?
- `OQ-040`: ¿El ítem `Clientes` visible para el Agente y la ausencia de `DCP REACT` son comportamiento esperado o dependen de la configuración de la cuenta?
- `OQ-041`: ¿Qué alcance de datos corresponde al Asociado comercial? Se observaron contadores de Invernada/Faena muy altos frente a pocas sociedades visibles.
- `OQ-042`: ¿Cómo debe automatizarse el login en `https://cliente-stage.dcac.ar/`? `cy.visit('/__dcac/')` termina en `/__dcac/login` (landing pública) y el formulario queda dentro de `#modalLogin` (`display: none`), que se abre con el botón INGRESAR (selector sin observar); en `stage.dcac.ar` el formulario ya está visible. Sin cambios de automatización; consideración para un release futuro. Evidencia: `artifacts/cypress/screenshots/login/`.
- `OQ-043`: En invernada legacy, ¿`MEJ` debe mostrar sólo los campos comunes o campos propios? Reproducido a mano por el usuario (2026-10-08): no agrega campos; posible bug, pendiente con el líder. Relacionada con `TC-INV-003` y el Caso 46 de `config/ofrecimientos-invernada-cases.md`.
- `OQ-048`: ¿El alta de sociedad con CUIT inválido debe mostrar un mensaje? El modal queda abierto sin mensaje (caso 4). El usuario (2026-10-09): la validación es por API, la UI no lo muestra y lo reportará como defecto.
- `OQ-049`: ¿Es intencional que los mensajes `.alert_input_faltante` de un envío previo no se limpien al corregir los campos hasta recargar?
- `OQ-050`: ¿Qué campos debe mostrar "¿Desea informar el plan sanitario?" = Sí? No se observó ningún campo nuevo (caso 68).
- `OQ-051`: ¿Cuál es la regla real de duración y formato del video legacy? 29 s y 9 s se aceptan; 4 s y un `.txt` se rechazan con "Aún no se han cargado archivos, compruebe que el formato sea el correcto." El 4 s falla por una excepción de AWS MediaConvert, no por una regla con mensaje propio. ¿Cuál es el mínimo real entre 4 y 9 s?
- `OQ-052`: ¿Es esperado que sin sociedad y establecimiento el POST parcial de video devuelva un error SQL con "Archivo cargado" y que `upload.php` exponga un stack trace con rutas internas?
- `OQ-053`: ¿En qué condición se dispara `#modal_siguiente` ("El video no ha terminado de cargarse")? No se disparó con la subida en curso.
- `OQ-054`: ¿Debería poder buscarse por id en Pendientes y Publicadas, como en Cerradas? ¿Por qué la búsqueda en Cerradas devuelve siempre `#11854`?
- `OQ-055`: ¿Los lotes parciales que crea "Adjuntar Filmación" y no se envían deben limpiarse?
- `OQ-056`: ¿El plazo de venta debería verse en el informe de la tropa? Hoy no se muestra.
- `OQ-062`: Para Pesada Carguío se cargó la opción `#sociedad` y el legajo muestra "Sociedad Rural". ¿Es el nombre esperado de la opción? Evidencia: legajo #35686. **Pendiente: el usuario lo confirma con su líder.**

## Respondidas / superadas

| ID | Respuesta (fuente) |
|---|---|
| `OQ-044` | Sin validación de Cantidad `0`/negativa hoy (`0` y `-5` crearon #35415, #35416); casos 15 y 16 diferidos hasta que la app la implemente (usuario, 2026-10-09). |
| `OQ-045` | Sin validación Cabeza + Cuerpo + Cola contra la Cantidad (suma 42 con Cantidad 50 se acepta); caso 21 diferido (usuario, 2026-10-09). |
| `OQ-046` | Sin validación Machos + Hembras contra la Cantidad (20 + 20 con 50 se acepta); caso 67 diferido (usuario, 2026-10-09). |
| `OQ-047` | Superada por `OQ-051`: la observación del 08/10 no usó el flujo real del botón. |
| `OQ-057` | Una fecha no cargada se muestra `00/00/0000` (QA, 2026-10-13). |
| `OQ-058` | El legajo muestra valores por defecto en los campos no cargados (Edad 0, Peso 0, Destetados/Capados "No", Zona "Limpia", Trat. Nutricional "Sin datos", Dentición "No especificado", Tipo Rodeo "-", Pesada Carguío "No Especificado", fechas `00/00/0000`): es lo esperado (QA, 2026-10-13; #35685, #35687). |
| `OQ-059` | El peso no cargado se ve "0 Kg" en listado y legajo (QA, 2026-10-13). |
| `OQ-060` | "Fecha Revisación: 00/00/0000 a las 00:00" es el formato esperado en una tropa sin revisar (QA, 2026-10-13). |
| `OQ-061` | El legajo muestra todos los campos, estén cargados o no; es error que aparezca un campo ajeno a la categoría (p. ej. "Capados: Sí" en Terneras). El informe de Pendientes difiere del legajo (sin aclaración, Plazo, Descarte, Tipo de Rodeo, cría ni video; muestra "Cantidad crías machos/hembras" y Fecha/Raza de Servicio en Vacas con cría) (QA, 2026-10-13). |
| `OQ-063` | "Oculto" es lo esperado: el video genera 1 video + 6 imágenes, todos "Oculto"; luego el Admin clickea las imágenes para hacerlas visibles en la publicación (QA, 2026-10-13). |
| `OQ-064` | La diferencia de capitalización de la sociedad entre listado y legajo es aceptada (QA, 2026-10-13). |
| `OQ-065` | El buscador no cambia la URL: esperado. No es exclusivo de tropaId, pero igual se valida el ingreso al legajo desde ahí (QA, 2026-10-13). |
| `OQ-066` | La búsqueda y casi toda la página son lentas; en Ofrecimientos se ven primero las más nuevas (no en todos los estados). Hay un solo buscador y ya está cubierto (QA, 2026-10-13). |
