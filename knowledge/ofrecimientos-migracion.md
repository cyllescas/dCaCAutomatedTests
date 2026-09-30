# Ofrecimientos: matriz legacy y migración React

## Alcance y fuentes

Esta ficha normaliza los campos de los formularios de ofrecimientos y separa
el contrato documentado para legacy de los cambios observados o decididos para
React.

- `Faena - Datos solicitados según categoría.xlsx`: campos adicionales por
  categoría. Se conserva como referencia del formulario legacy; el nombre del
  archivo no alcanza para confirmar que todos esos campos correspondan al
  dominio Faena.
- `Ofrecimientos - Campos por categoría.xlsx`: campos generales y específicos
  del formulario legacy.
- `Ofrecimientos- Web React 21-8.docx`: comparación manual entre
  `https://stage.dcac.ar/` y `https://react-stage.dcac.ar/`, incluyendo
  comentarios de Producto/Desarrollo.
- Evidencia UI ya persistida: `knowledge/ofrecimientos-faena-exploration.md`
  y artefactos bajo `artifacts/`.

Los Excel describen lo que se pedía en legacy. El DOCX no debe leerse como una
especificación única: sus observaciones pueden ser comportamiento actual,
defecto, cambio intencional o ticket pendiente. Sólo los comentarios que
expresan una decisión se registran como delta esperado de migración.

## Campos comunes documentados para legacy

| Campo | Aplica | Nota |
| --- | --- | --- |
| Sociedad, Establecimiento | Todas | Selección de entidades existentes. |
| Video | Todas | El DOCX registra una decisión de permitir publicar aunque el video sea menor a 7 s; ver `OQ-032`. |
| Cantidad, Categoría, Peso promedio | Todas | `Peso promedio` se marca obligatorio en varias categorías. |
| Segmentación | Todas según Excel | KG y cantidad de cabeza, cuerpo y cola. En categorías de cría React la sección se oculta y la carga observada es incorrecta. |
| Raza, Estado corporal, Uniformidad, Descarte | Todas | React no muestra parte de estos campos de informe; ver `OQ-030`. |
| Aclaraciones, Plazo de venta | Todas | React deja de pedir Plazo de venta según comentario de decisión. |

Campos generales adicionales documentados para el conjunto de categorías:
Marca líquida, Calidad, Tratamiento Nutricional, Zona, plan sanitario,
Sanidad, Pesada Carguío, Desbaste y Distancia. Su presencia se detalla en la
matriz por categoría y no debe inferirse para una pantalla React sin
exploración.

## Matriz dinámica de categorías (legacy)

La siguiente matriz consolida ambos Excel. “Obligatorio” y “Opcional” son la
clasificación explícita del archivo de Faena; cuando el segundo Excel enumera
un campo sin esa clasificación, se conserva como “solicitado” y no se inventa
su obligatoriedad.

| Categoría | Campos específicos / dinámicos solicitados | Obligatorios explícitos |
| --- | --- | --- |
| Terneros | Destetados, Fecha de Destete, Capados, Fecha de Capado | — |
| Terneras | Destetados, Fecha de Destete | — |
| Terneros y Terneras | Machos, Hembras, Destetados, Fecha de Destete, Capados, Fecha de Capado | Machos, Hembras |
| Novillitos y Vaquillonas | Machos, Hembras | Machos, Hembras |
| Novillos | — | — |
| Vaca de invernada | Tipo de Rodeo, Dentición | Tipo de Rodeo; Peso Promedio |
| Vaca con cría / Vacas con cría | Tipo de Rodeo, Dentición, Edad de la cría, Peso promedio de la cría, Uniformidad de la cría | Tipo de Rodeo |
| Vaca CUT con cría | Tipo de Rodeo, Dentición, Edad de la cría, Peso promedio de la cría, Uniformidad de la cría | Tipo de Rodeo; Peso Promedio |
| Vaca CUT preñada / Vaca CUT Preñada | Tipo de Rodeo, Dentición, Tipo de servicio, datos del servicio según opción | Tipo de Rodeo; Peso Promedio |
| Vaca preñada / Vaca Preñada | Tipo de Rodeo, Dentición, Tipo de servicio, datos del servicio según opción | Tipo de Rodeo; Peso Promedio |
| Vaquillonas con cría | Tipo de Rodeo, Dentición, Edad de la cría, Peso promedio de la cría, Uniformidad de la cría | Tipo de Rodeo |
| Vaquillonas preñada / Vaquillonas preñadas | Tipo de Rodeo, Tipo de servicio, datos del servicio según opción | Tipo de Rodeo; Peso Promedio |
| Vaquillonas para madre | Tipo de Rodeo, Definidas | Tipo de Rodeo; Peso Promedio |
| MEJ | Sin campos específicos además de los generales | Peso Promedio según Excel de Faena |
| Toros | Tipo de Rodeo, Dentición, Análisis Sanitario, Apto para Vaquillonas, Origen de los toros | Tipo de Rodeo; Peso Promedio |

### Dependencias dentro de campos dinámicos

- `Tipo de servicio` para Vacas preñadas y Vacas CUT preñadas habilita datos
  dependientes: **Inseminación** → Fecha de inseminación, Raza de inseminación,
  Toro de inseminación; **Servicio natural** → Inicio y Fin del servicio, Raza
  de servicio, Origen de los toros; **Inseminación + repaso** → datos de
  inseminación más Raza de servicio y Origen de los toros.
- Para las categorías con cría, la cría tiene Edad, Peso promedio y
  Uniformidad propios.
- Para Terneros y Terneras, `Capados` sólo corresponde a machos según el
  Excel de ofrecimientos.
- El Excel de Faena agrega `Definidas` para Vaquillonas para madre y marca
  `Cantidad` como deshabilitada para Terneros y Terneras y para Novillitos y
  Vaquillonas.

## Delta observado o decidido para React

### Faena

- React ya no expone selección de Tipo de Jaula; la decisión documentada es
  operar por defecto como jaula simple.
- React ya no solicita Plazo de venta.
- Para una tropa Faena feedlot con encierre, los campos “Encierre de pesada” y
  “Encierre” del legajo deben quedar vacíos según la decisión registrada; no
  deben reconstruirse desde Aclaraciones.

### Invernada

- Faltan en el formulario React, respecto de legacy, Calidad, Cantidad en
  tropas mixtas y los campos Estado corporal, Uniformidad, Descarte y Sanidad.
  Esto impacta el legajo y/o la vista resumida; no se debe tomar como regla
  funcional definitiva hasta confirmar el alcance del cambio.
- Zona (limpia, sucia, lucha) aparece dentro de Protocolo de pesada, aunque la
  decisión de diseño es ubicarla en Información de la tropa porque Cría no
  tiene protocolo de pesada.
- La selección de Zona Lucha o Sucia no desplegó Garrapatas y Mio Mio durante
  la comparación; queda como comportamiento a verificar.
- Si Balanza es “Balanza del Establecimiento”, el diseño esperado oculta
  “Distancia a la balanza”. La exploración reporta que React lo dejó visible;
  el comentario aclara que la distancia no siempre es cero y que la decisión
  de comportamiento todavía requiere confirmación.
- En categorías preñadas con Servicio natural debe existir Origen de los toros
  según la matriz legacy.
- En Vaquillonas con cría y MEJ la edad se presenta en años; la unidad esperada
  y el arreglo del problema general de edad requieren verificación.
- En categorías de Cría React oculta Segmentación de la tropa; la carga llega
  vacía salvo una cantidad total colocada incorrectamente en “cantidad
  cabeza”.
- Videos menores a 7 s pueden permitir el ofrecimiento y llegar vacíos al
  legajo, por decisión explícita del comentario. La validación de aplicación
  mencionada en el DOCX no debe trasladarse automáticamente a React.
- La decisión registrada indica que ya no se pedirán Fecha de destete ni Fecha
  de capado en ciertos formularios React, y que los campos no solicitados
  pueden viajar vacíos al legajo. Aplicar sólo cuando la pantalla React y la
  categoría concreta lo confirmen.

## Trazabilidad para futuras configs

- Configs legacy: usar esta matriz como datos de entrada y conservar la
  separación entre campos comunes, específicos y dependientes.
- Config Faena React: cubrir la navegación y los campos realmente observados
  en React; comparar explícitamente Jaula y Plazo de venta contra legacy.
- Config Invernada React y legacy: generar casos por categoría, incluyendo
  ramas de Servicio, cría, Balanza/Zona y Segmentación. Un campo ausente o con
  selector no observado queda no automatizable hasta exploración.
- Toda regla que no tenga confirmación de observación o decisión debe
  referenciar `open-questions.md` y no convertirse aún en expectativa PASS.

## Evidencia y límites

La comparación manual está fechada por el nombre del DOCX como 21-08, pero no
incluye en el repositorio las imágenes y videos referenciados dentro del texto.
Los hallazgos de React se consideran evidencia documental aportada por el
usuario, no una nueva exploración automatizada del ambiente.
