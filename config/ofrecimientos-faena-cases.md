# Casos de faena legacy — notas para la exploración

Fuente: descripción del formulario `Cotizar > Faena` dada por el usuario (2026-11-17).
Son observaciones sin fuente documentada; la exploración debe confirmar cada punto con
selectores observados. Lo no confirmado queda como pregunta abierta, no como regla.

## Campos del formulario (según el usuario)

- **Sociedad / Establecimiento:** listan los del usuario y permiten crear nuevos.
- **Tipo de jaula:** Simple o Doble (no agrega campos).
- **Categoría (29):** Terneros, Terneras, Terneros y Terneras, Novillitos, Vaquillonas, Novillitos y
  Vaquillonas, Novillos, MEJ, Vaca gorda, Vaca manufactura, Vaca conserva, Vacas y vaquillonas,
  Vacas y novillos, Toro gordo, Toro manufactura, Toro conserva, Toros y novillos, Toros y vacas,
  Toros vacas y novillos, MEJ y terneros, MEJ y terneras, MEJ y novillitos, MEJ y vaquillonas,
  MEJ y novillos, Varias, Bubalinos, Bubalinas, Bubalinos / Bubalinas, Novillos y vaquillonas.
- **Terminación:** A campo, Racionado, Feedlot. Racionado y Feedlot agregan `Días de encierre (aprox)`
  (input, placeholder `Días`).
- **Destino:** Consumo, Exportación Hilton, Exportación UE, Cuota 481.
- **Apto China:** Sí / No.
- **Raza:** misma lista que invernada; botón `Agregar otra raza`.
- **Peso de la tropa (kg netos):** animal más liviano, animal más pesado, peso promedio.
- **Planilla de pesada:** opcional; acepta imágenes y PDF.
- **Disponibilidad de carga:** selector de fecha.
- **Video:** botón para cargar.
- **Aclaraciones y comentarios:** textarea.
- **Condiciones comerciales:** Plazo de venta (desde la fecha de faena, input), Pesada (Con/Sin
  encierre), Desbaste, Flete (A retirar / Puesto en planta).
- Tipo de jaula, pesada con encierre y flete **no** agregan campos adicionales (confirmado por el usuario).

## Criterios de cobertura acordados

1. **Categorías (todas):** ingresar al formulario, seleccionar cada una de las 29 y verificar que se
   puede seleccionar y que se muestran todos los campos; no se ocultan ni se agregan campos según la categoría.
2. **Publicación por categoría (Ofrecer tropa):** sólo Terneros, Terneros y Terneras, Vaca gorda,
   Toro gordo, Toros y vacas y Bubalinos.
3. **Resto de campos:** los tests de publicación necesarios para cubrir cada valor de terminación,
   destino, apto China, jaula, pesada y flete **sin redundancia** (p. ej. A campo + Consumo; Racionado +
   Exportación Hilton; no el producto cartesiano de 24). Pueden reutilizarse las publicaciones por
   categoría variando estas opciones.
4. **Condicionales:** Días de encierre aparece con Racionado y Feedlot y no con A campo; `Agregar otra
   raza` agrega filas (límite a observar).
5. **Datos opcionales:** planilla de pesada y video (válido, inválido, sin archivo).
6. **Publicaciones adicionales:** usar categorías **distintas** de las 6 anteriores para ampliar la
   cobertura de categorías publicadas.
7. Alta de sociedad/establecimiento: reutilizar los criterios de invernada, sujetos a OQ-067 y OQ-042.

## Obligatoriedad y límites (según el usuario, 2026-11-17; confirmar al explorar)

- **Obligatorios:** Sociedad, Establecimiento, Tipo de jaula, Terminación, Destino, Raza, Peso de la
  tropa (alcanza con completar uno de los tres inputs) y Disponibilidad de carga.
- **No obligatorio:** Días de encierre.
- **Razas:** máximo 3; el sistema no debería permitir ingresar más de 3.
- **Peso:** la app no valida nada entre los tres campos de peso (no hay casos de rango/coherencia).

## A observar en la exploración (no asumir)

- Selectores de cada campo y del control `Agregar otra raza`.
- Mensajes de cada campo obligatorio y comportamiento al intentar una cuarta raza.
- Si `Plazo de venta` es `ng_condiciones_plazo_cotizacion`.
- Formatos aceptados por la planilla de pesada y duración mínima del video.
- Qué se muestra en pendientes de publicación y en el legajo admin tras publicar.
