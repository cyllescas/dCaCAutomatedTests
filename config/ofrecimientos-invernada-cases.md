# Casos solicitados — Ofrecimientos de invernada (legacy)

Insumo para `config/ofrecimientos-invernada.yaml` (`feature.cases_file`). El planner
debe **extender** `specs/ofrecimientos-invernada.md` con estos casos sin duplicar
los `TC-INV-*` existentes, y mapear cada caso a un ID del plan.

## Decisiones de la revisión (2026-10-08)

- **Fuente de la información:** no hay fuente documentada. Todo lo marcado como
  `confirmado` es una **observación del usuario** y debe registrarse en `knowledge/`
  como observación, no como regla de negocio. Lo contrastable se contrasta al explorar.
- **Después de "Ofrecer Tropa":** la URL **no cambia** y no hay redirección. Cambia la
  vista por una confirmación con el mensaje `Su tropa ha sido creada correctamente` y
  más información. **No se muestra número de lote/tropa.** La vista incluye enlaces
  como `Mis operaciones` (para ver la tropa recién ofrecida) y el botón
  `Ingresar nueva tropa`.
- **Raza y Plazo de venta** cuando el caso no los indica: usar la **primera opción
  disponible**.
- **Envíos reales:** los 17 casos de la sección F crean ofrecimientos reales en stage
  en cada corrida; no hace falta borrarlos. Pendiente de validar la frecuencia con el
  líder del equipo.
- **MEJ (Caso 46):** reproducido a mano, no agrega campos nuevos respecto de los comunes.
  Posible bug, pendiente de conversar con el líder → `OQ-043`.
- **Video:** se agregan los casos 12.1 a 12.4 (y 12.5 el 2026-10-09). El mínimo de 10 s
  era un dato del usuario y la app lo desmintió: el video de 9 s es válido.

## Correcciones del usuario (2026-10-09)

- **Diferidos** los casos 15, 16 (Cantidad 0 y negativa), 17 (Cantidad no numérica), 21
  (segmentación que no suma) y 67 (Machos + Hembras que no suman): hoy esas validaciones no
  existen, pero deberían; se agregan cuando la app las implemente. No se automatiza el
  comportamiento actual.
- **Video:** la validación de formato y duración solo ocurre si primero se seleccionan
  sociedad y establecimiento, y se carga el video con el botón real "Adjuntar Filmación".
  El mensaje real se ve en `#seccion_archivos`, no en la barra de progreso. Video inválido
  de prueba: `video_ofrecimiento_4seg.mp4` (4 s). El de 9 s se toma como válido.
- **CUIT inválido (caso 4):** la validación la hace una API que devuelve error, pero la UI
  no lo muestra; el usuario lo reportará como defecto. No se espera un mensaje.
- **Confirmación post-envío:** el enlace es "operaciones" y el botón "INGRESAR NUEVA TROPA"
  (confirmado por el usuario).
- **Flujo de envío a verificar:** completar formulario > Ofrecer Tropa > capturar `tropaId`
  (respuesta de `.../modulo_crearLote/index.php`) > "operaciones" > localizar la tropa por
  su id > comparar datos cargados con los visibles. Para los 17 perfiles no se piden más
  datos que los ya definidos.
- Varios campos descritos como "select" son **radios** (error de redacción, aceptado).

## Referencias usadas en todos los casos

- **Usuario base:** cliente o representante autenticado con variables de entorno.
- **Datos base:** Cantidad 50 · Peso promedio 250 · Segmentación Cabeza 260 kg / 1,
  Cuerpo 250 kg / 48, Cola 240 kg / 1 · Video `cypress/fixtures/video_ofrecimiento.mp4`
  (29 s) · Raza y Plazo de venta: primera opción disponible.
- **Formulario abierto:** Cotizar > Invernada/Cría, con sociedad y establecimiento seleccionados.
- Los nombres de categoría salen del listado funcional; confirmar el texto exacto en la UI durante la exploración.
- Campos sin opciones documentadas (Sanidad, Plan sanitario, Definidas, Análisis Sanitario,
  Origen de los toros, Apto para Vaquillonas, Uniformidad, Descarte, Pesada carguío, Desbaste,
  Distancia): completar con cualquier valor válido observado.
- **Casos donde se completa el ofrecimiento (botón `Ofrecer Tropa`):** se mantiene la misma
  URL y cambia la vista por la confirmación descrita arriba.
- **Videos de prueba** (`cypress/fixtures/`, no versionados): `video_ofrecimiento.mp4` (29 s,
  M4V, válido), `video_ofrecimiento_corto.mp4` (9 s, MP4, válido) y `video_ofrecimiento_4seg.mp4`
  (4 s, rechazado).

---

## A. Acceso, sociedad y establecimiento

### Caso 1: Acceso al formulario de Invernada/Cría
- Funcionalidad: Cotizar > Invernada/Cría
- Prioridad: crítica
- Precondiciones: Usuario base
- Pasos: Ir a Cotizar. Elegir Invernada/Cría.
- Esperado: Se abre el formulario de ofrecimiento de invernada.
- Certeza: confirmado
- Datos: ninguno
- Cobertura existente: TC-INV-001 (automatizado) — descartar

### Caso 2: Seleccionar sociedad existente
- Funcionalidad: Sociedad
- Prioridad: alta
- Precondiciones: Usuario base con al menos una sociedad de prueba
- Pasos: Abrir el select Sociedad. Elegir una sociedad existente.
- Esperado: La sociedad queda seleccionada.
- Certeza: confirmado
- Datos: sociedad de prueba (variable de entorno)
- Cobertura existente: TC-INV-001 (automatizado) — descartar

### Caso 3: Crear sociedad con CUIT válido
- Funcionalidad: Sociedad > formulario de nueva sociedad (Razón Social, CUIT)
- Prioridad: alta
- Precondiciones: Usuario base
- Pasos: Elegir la opción de crear sociedad. Completar Razón Social y un CUIT válido. Presionar Guardar.
- Esperado: La sociedad se crea y se puede usar en el ofrecimiento.
- Certeza: confirmado
- Datos: Razón Social dinámica, CUIT válido generado
- Notas: Observar si la nueva sociedad queda seleccionada automáticamente.
- Cobertura existente: TC-INV-008 (automatizado); falta observar la selección automática y el uso en el ofrecimiento — actualizar

### Caso 4: Crear sociedad con CUIT inválido
- Funcionalidad: Sociedad > formulario de nueva sociedad (CUIT)
- Prioridad: alta
- Precondiciones: Usuario base
- Pasos: Elegir la opción de crear sociedad. Completar Razón Social y un CUIT con dígito verificador incorrecto. Presionar Guardar.
- Esperado: La sociedad no se guarda y se indica que el CUIT es inválido.
- Certeza: confirmado
- Datos: CUIT con dígito verificador incorrecto
- Notas: El texto del mensaje de error no está documentado.

### Caso 5: Cerrar el formulario de nueva sociedad
- Funcionalidad: Sociedad > formulario de nueva sociedad (botón Cerrar)
- Prioridad: media
- Precondiciones: Usuario base
- Pasos: Abrir el formulario de nueva sociedad. Completar Razón Social. Presionar Cerrar.
- Esperado: El formulario se cierra y no se crea la sociedad.
- Certeza: a confirmar
- Datos: Razón Social dinámica
- Cobertura existente: TC-INV-007 cancela el modal sin completar datos ni verificar que no se crea — actualizar

### Caso 6: Sociedad existente + establecimiento existente
- Funcionalidad: Establecimiento
- Prioridad: alta
- Precondiciones: Usuario base, sociedad existente con al menos un establecimiento
- Pasos: Seleccionar la sociedad existente. Seleccionar un establecimiento existente.
- Esperado: El establecimiento queda seleccionado.
- Certeza: confirmado
- Datos: sociedad y establecimiento de prueba
- Cobertura existente: TC-INV-001 (automatizado) — descartar

### Caso 7: Sociedad existente + crear establecimiento
- Funcionalidad: Establecimiento > formulario de nuevo establecimiento (Nombre, Provincia, Partido)
- Prioridad: alta
- Precondiciones: Usuario base, sociedad existente
- Pasos: Seleccionar la sociedad existente. Elegir "Nuevo establecimiento". Completar Nombre, Provincia y Partido. Presionar Guardar.
- Esperado: El establecimiento se crea y se puede usar en el ofrecimiento.
- Certeza: confirmado
- Datos: nombre de establecimiento dinámico
- Cobertura existente: TC-INV-009 (automatizado) — descartar

### Caso 8: Opciones de Establecimiento con sociedad nueva
- Funcionalidad: Establecimiento
- Prioridad: alta
- Precondiciones: Usuario base, sociedad recién creada (Caso 3)
- Pasos: Con la sociedad nueva seleccionada, abrir el select Establecimiento.
- Esperado: Solo existen las opciones "Seleccionar un establecimiento" y "Nuevo establecimiento".
- Certeza: confirmado
- Datos: ninguno

### Caso 9: Sociedad nueva + crear establecimiento
- Funcionalidad: Establecimiento > formulario de nuevo establecimiento
- Prioridad: alta
- Precondiciones: Usuario base, sociedad recién creada
- Pasos: Elegir "Nuevo establecimiento". Completar Nombre, Provincia y Partido. Presionar Guardar.
- Esperado: El establecimiento se crea y se puede usar en el ofrecimiento.
- Certeza: confirmado
- Datos: nombre de establecimiento dinámico

### Caso 10: Cerrar el formulario de nuevo establecimiento
- Funcionalidad: Establecimiento > formulario de nuevo establecimiento (botón Cerrar)
- Prioridad: media
- Precondiciones: Usuario base, sociedad seleccionada
- Pasos: Elegir "Nuevo establecimiento". Completar Nombre. Presionar Cerrar.
- Esperado: El formulario se cierra y no se crea el establecimiento.
- Certeza: a confirmar
- Datos: nombre dinámico
- Cobertura existente: TC-INV-007 cancela el modal sin completar datos ni verificar que no se crea — actualizar

### Caso 11: Autocompletado de Provincia y Partido
- Funcionalidad: Establecimiento, Provincia, Partido
- Prioridad: alta
- Precondiciones: Usuario base, establecimiento existente
- Pasos: Seleccionar un establecimiento existente.
- Esperado: Provincia y Partido se completan con los datos del establecimiento.
- Certeza: confirmado
- Datos: establecimiento de prueba

---

## B. Datos generales

### Caso 12: Subir video de la tropa
- Funcionalidad: Video (botón "Adjuntar Filmación")
- Prioridad: alta
- Precondiciones: Formulario abierto
- Pasos: Cargar el archivo de video.
- Esperado: El video se carga correctamente en el ofrecimiento.
- Certeza: confirmado
- Datos: `cypress/fixtures/video_ofrecimiento.mp4` (29 s)
- Notas: Es un M4V de iTunes; si falla, registrar el formato como posible causa.

### Caso 12.1: Video corto rechazado
- Funcionalidad: Video (botón "Adjuntar Filmación")
- Prioridad: alta
- Precondiciones: Formulario abierto con sociedad y establecimiento seleccionados
- Pasos: Adjuntar el video de 4 segundos con el botón real.
- Esperado: La UI muestra el rechazo en `#seccion_archivos`.
- Certeza: a confirmar (observado el 2026-10-09)
- Datos: `cypress/fixtures/video_ofrecimiento_4seg.mp4` (4 s)
- Notas: El servidor falla por una excepción de AWS MediaConvert, no por una regla de duración con mensaje propio (OQ-051).

### Caso 12.5: Video de 9 segundos es válido
- Funcionalidad: Video (botón "Adjuntar Filmación")
- Prioridad: media
- Precondiciones: Formulario abierto con sociedad y establecimiento seleccionados
- Pasos: Adjuntar el video de 9 segundos con el botón real.
- Esperado: Éxito: "Video cargado correctamente".
- Certeza: confirmado por el usuario (2026-10-09)
- Datos: `cypress/fixtures/video_ofrecimiento_corto.mp4` (9 s)

### Caso 12.2: Archivo que no es un video
- Funcionalidad: Video (botón "Adjuntar Filmación")
- Prioridad: media
- Precondiciones: Formulario abierto
- Pasos: Adjuntar un archivo de texto en lugar de un video.
- Esperado: Observar si se rechaza o se bloquea la selección.
- Certeza: no sé
- Datos: archivo de texto generado en el test (sin fixture)

### Caso 12.3: Enviar sin video
- Funcionalidad: Video, envío del ofrecimiento
- Prioridad: alta
- Precondiciones: Formulario abierto, resto de campos obligatorios completos
- Pasos: No adjuntar video. Intentar enviar.
- Esperado: Observar si el video es obligatorio u opcional.
- Certeza: no sé
- Datos: Datos base sin video
- Notas: El envío vacío observado no mostró error de video. Si el envío prospera, crea un ofrecimiento real.

### Caso 12.4: Quitar o reemplazar el video adjunto
- Funcionalidad: Video
- Prioridad: baja
- Precondiciones: Formulario abierto con un video cargado
- Pasos: Intentar quitar o reemplazar el video por otro.
- Esperado: Observar si la UI lo permite y cómo queda el estado.
- Certeza: no sé
- Datos: ambos videos de `cypress/fixtures/`

### Caso 13: Cantidad válida
- Funcionalidad: Cantidad
- Prioridad: alta
- Precondiciones: Formulario abierto
- Pasos: Ingresar 50 en Cantidad.
- Esperado: El valor se acepta.
- Certeza: confirmado
- Datos: 50
- Notas: Los valores habituales van de 30 a 70.

### Caso 14: Cantidad vacía
- Funcionalidad: Cantidad
- Prioridad: media
- Precondiciones: Formulario abierto, resto de campos completos
- Pasos: Dejar Cantidad vacía. Intentar enviar.
- Esperado: Observar si se rechaza.
- Certeza: no sé
- Datos: ninguno
- Cobertura existente: TC-INV-002 (formulario vacío muestra `Debe completar el campo Cantidad`); este caso aísla el campo con el resto completo — actualizar

### Caso 15: Cantidad cero — DIFERIDO (2026-10-09: la app aún no valida; agregar cuando se implemente)
- Funcionalidad: Cantidad
- Prioridad: media
- Precondiciones: Formulario abierto
- Pasos: Ingresar 0 en Cantidad.
- Esperado: Observar si se rechaza.
- Certeza: no sé
- Datos: 0

### Caso 16: Cantidad negativa — DIFERIDO (2026-10-09: la app aún no valida; agregar cuando se implemente)
- Funcionalidad: Cantidad
- Prioridad: media
- Precondiciones: Formulario abierto
- Pasos: Ingresar -5 en Cantidad.
- Esperado: Observar si se rechaza.
- Certeza: no sé
- Datos: -5

### Caso 17: Cantidad no numérica — DIFERIDO (2026-10-09: la app aún no valida; agregar cuando se implemente)
- Funcionalidad: Cantidad
- Prioridad: media
- Precondiciones: Formulario abierto
- Pasos: Escribir "abc" en Cantidad.
- Esperado: Observar si se rechaza o se bloquea el ingreso.
- Certeza: no sé
- Datos: "abc"

### Caso 18: Opciones de Categoría
- Funcionalidad: Categoría
- Prioridad: alta
- Precondiciones: Formulario abierto
- Pasos: Abrir el select Categoría.
- Esperado: Aparecen las 17 categorías: Terneros, Terneras, Terneros y Terneras, Novillitos, Vaquillonas, Novillitos y Vaquillonas, Novillos, Vacas de invernada, Vacas con cría, MEJ, Vacas CUT con cría, Vacas CUT preñadas, Vacas preñadas, Vaquillonas con cría, Vaquillonas preñadas, Vaquillonas para madre, Toros.
- Certeza: confirmado
- Datos: ninguno
- Notas: Registrar los textos exactos de la UI (singular o plural).

### Caso 19: Peso promedio sin restricción
- Funcionalidad: Peso promedio
- Prioridad: baja
- Precondiciones: Formulario abierto
- Pasos: Ingresar 100 en Peso promedio.
- Esperado: El valor se acepta (el campo no tiene validación de mínimo).
- Certeza: confirmado
- Datos: 100
- Notas: En el resto de los casos usar ~250 por convención de realismo.

### Caso 20: Segmentación que suma la cantidad total
- Funcionalidad: Segmentación de la tropa (Cabeza, Cuerpo, Cola)
- Prioridad: alta
- Precondiciones: Formulario abierto, Cantidad 50, Peso promedio 250
- Pasos: Completar Cabeza 260 / 1, Cuerpo 250 / 48, Cola 240 / 1.
- Esperado: La segmentación se acepta.
- Certeza: confirmado
- Datos: Datos base

### Caso 21: Segmentación que no suma la cantidad total — DIFERIDO (2026-10-09: la app aún no valida; agregar cuando se implemente)
- Funcionalidad: Segmentación de la tropa (Cabeza, Cuerpo, Cola)
- Prioridad: alta
- Precondiciones: Formulario abierto, Cantidad 50, Peso promedio 250
- Pasos: Completar Cabeza 260 / 1, Cuerpo 250 / 40, Cola 240 / 1 (suma 42). Intentar enviar.
- Esperado: No se permite enviar el ofrecimiento.
- Certeza: confirmado
- Datos: cantidades que suman 42
- Notas: La regla está confirmada; el mensaje o momento del error (al tipear o al enviar) no está documentado.

### Caso 22: Agregar hasta 3 razas
- Funcionalidad: Raza, botón "+ Agregar otra raza"
- Prioridad: media
- Precondiciones: Formulario abierto
- Pasos: Elegir una raza. Presionar "+ Agregar otra raza" y elegir una segunda. Repetir para una tercera.
- Esperado: Quedan 3 razas cargadas.
- Certeza: confirmado
- Datos: 3 razas distintas

### Caso 23: No se puede agregar una cuarta raza
- Funcionalidad: Raza, botón "+ Agregar otra raza"
- Prioridad: media
- Precondiciones: Formulario abierto con 3 razas cargadas
- Pasos: Intentar agregar otra raza.
- Esperado: No se puede agregar una cuarta raza.
- Certeza: confirmado
- Datos: ninguno
- Notas: Observar si el botón desaparece, se deshabilita o muestra un aviso.

---

## C. Opciones de los selects

Precondición común: formulario abierto con una categoría que muestre el campo (indicada en cada caso).

### Caso 24: Opciones de Marca Líquida
- Funcionalidad: Marca Líquida
- Prioridad: baja
- Precondiciones: Categoría Terneros
- Pasos: Abrir Marca Líquida.
- Esperado: SI, NO.
- Certeza: confirmado
- Datos: ninguno

### Caso 25: Opciones de Calidad
- Funcionalidad: Calidad
- Prioridad: media
- Precondiciones: Categoría Terneros
- Pasos: Abrir Calidad.
- Esperado: 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10.
- Certeza: confirmado
- Datos: ninguno

### Caso 26: Opciones de Estado Corporal
- Funcionalidad: Informe de revisación > Estado Corporal
- Prioridad: media
- Precondiciones: Categoría Terneros
- Pasos: Abrir Estado Corporal.
- Esperado: 2, 2.5, 3, 3.5, 4, 4.5, 5.
- Certeza: confirmado
- Datos: ninguno

### Caso 27: Opciones de Tratamiento Nutricional
- Funcionalidad: Tratamiento Nutricional
- Prioridad: media
- Precondiciones: Categoría Terneros
- Pasos: Abrir Tratamiento Nutricional.
- Esperado: Campo Natural, Racionados, A Corral, Praderas y/o Verdeos, Otro.
- Certeza: confirmado
- Datos: ninguno

### Caso 28: Opciones de Zona
- Funcionalidad: Zona
- Prioridad: media
- Precondiciones: Categoría Terneros
- Pasos: Abrir Zona.
- Esperado: Limpia, Lucha, Sucia.
- Certeza: confirmado
- Datos: ninguno

### Caso 29: Opciones de Dentición
- Funcionalidad: Dentición
- Prioridad: media
- Precondiciones: Categoría Vacas de invernada
- Pasos: Abrir Dentición.
- Esperado: Diente de leche, 2 dientes, 4 dientes, 6 dientes, Boca llena, 1/2 Diente, 1/2 Diente Arriba, 1/2 Diente Abajo, Liso, Aclarar en los comentarios.
- Certeza: confirmado
- Datos: ninguno

### Caso 30: Opciones de Tipo de Rodeo
- Funcionalidad: Tipo de Rodeo
- Prioridad: media
- Precondiciones: Categoría Vacas de invernada
- Pasos: Abrir Tipo de Rodeo.
- Esperado: Rodeo General, Puro Controlado, Puro Pedigree, Angus MAS.
- Certeza: confirmado
- Datos: ninguno

### Caso 31: Opciones de Uniformidad de la cría
- Funcionalidad: Uniformidad - de la cría
- Prioridad: media
- Precondiciones: Categoría Vacas con cría
- Pasos: Abrir Uniformidad de la cría.
- Esperado: Parejo, Desparejo.
- Certeza: confirmado
- Datos: ninguno

### Caso 32: Opciones de Tipo de servicio
- Funcionalidad: Informe del servicio > Tipo de servicio
- Prioridad: media
- Precondiciones: Categoría Vacas preñadas
- Pasos: Abrir Tipo de servicio.
- Esperado: Inseminación, Servicio Natural, Inseminación + repaso.
- Certeza: confirmado
- Datos: ninguno

### Caso 33: Opciones de Inseminación
- Funcionalidad: Informe del servicio > Inseminación
- Prioridad: media
- Precondiciones: Categoría Vacas preñadas, Tipo de servicio Inseminación
- Pasos: Abrir Inseminación.
- Esperado: A tiempo fijo, Con detección.
- Certeza: confirmado
- Datos: ninguno

### Caso 34: Raza de inseminación tiene las mismas opciones que Raza
- Funcionalidad: Informe del servicio > Raza de inseminación
- Prioridad: baja
- Precondiciones: Categoría Vacas preñadas
- Pasos: Registrar las opciones de Raza. Registrar las opciones de Raza de inseminación.
- Esperado: Ambas listas son iguales.
- Certeza: confirmado
- Datos: ninguno

### Caso 35: Raza de servicio tiene las mismas opciones que Raza
- Funcionalidad: Informe del servicio > Raza de servicio
- Prioridad: baja
- Precondiciones: Categoría Vacas preñadas, Tipo de servicio Servicio Natural
- Pasos: Registrar las opciones de Raza. Registrar las opciones de Raza de servicio.
- Esperado: Ambas listas son iguales.
- Certeza: confirmado
- Datos: ninguno

---

## D. Campos por categoría

Todos: Precondiciones = Formulario abierto · Pasos = elegir la categoría · Datos = ninguno.
Verificar que existen los campos listados (además de los comunes). No validar la ausencia de Sanidad en las categorías que no la tienen.
Cobertura existente: TC-INV-003/004/005 verifican solo algunas etiquetas por categoría; estas listas las amplían — actualizar.

### Caso 36: Campos de Terneros
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Destetados, Capados, Zona, Desea informar el plan sanitario. Informe de revisación: Sanidad. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 37: Campos de Terneras
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Destetados, Zona, Desea informar el plan sanitario. Informe de revisación: Sanidad. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 38: Campos de Terneros y Terneras
- Esperado: Segmentación de la tropa: Cantidad Machos, Cantidad Hembras. Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Destetados, Capados, Zona, Desea informar el plan sanitario. Informe de revisación: Sanidad. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 39: Campos de Novillitos
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Desea informar el plan sanitario. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 40: Campos de Vaquillonas
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Desea informar el plan sanitario. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 41: Campos de Novillitos y Vaquillonas
- Esperado: Segmentación de la tropa: Cantidad Machos, Cantidad Hembras. Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Desea informar el plan sanitario. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 42: Campos de Novillos
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Desea informar el plan sanitario. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 43: Campos de Vacas de invernada
- Esperado: Información de la tropa: Edad (Años), Dentición, Marca Líquida, Calidad, Tipo de Rodeo, Tratamiento Nutricional, Zona. Informe de revisación: Sanidad. Condiciones comerciales: Pesada carguío, Desbaste, Distancia.
- Prioridad: alta · Certeza: confirmado

### Caso 44: Campos de Vacas con cría
- Esperado: Información de la tropa: Edad (Años), Dentición, Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Edad de la cría (Meses), Peso promedio de la cría, Uniformidad de la cría. Informe de revisación: Sanidad.
- Prioridad: alta · Certeza: confirmado

### Caso 45: Campos de Vacas CUT con cría
- Esperado: Los mismos campos que Vacas con cría (Caso 44).
- Prioridad: alta · Certeza: confirmado

### Caso 46: Campos de MEJ
- Esperado: Se muestran solo los campos comunes; no aparecen campos específicos de categoría.
- Prioridad: alta · Certeza: a confirmar
- Notas: Reproducido a mano por el usuario: no agrega campos nuevos. Posible bug, pendiente de conversar con el líder (`OQ-043`). Registrar lo observado sin tratarlo como regla.

### Caso 47: Campos de Vacas preñadas
- Esperado: Información de la tropa: Edad (Años), Dentición, Marca Líquida, Calidad, Tipo de Rodeo, Tratamiento Nutricional, Zona. Informe del servicio: Tipo de servicio, Raza de inseminación, Toro de inseminación. Informe de revisación: Sanidad.
- Prioridad: alta · Certeza: confirmado

### Caso 48: Campos de Vacas CUT preñadas
- Esperado: Los mismos campos que Vacas preñadas (Caso 47).
- Prioridad: alta · Certeza: confirmado

### Caso 49: Campos de Vaquillonas con cría
- Esperado: Información de la tropa: Tipo de Rodeo, Edad (Meses), Dentición, Marca Líquida, Calidad, Tratamiento Nutricional, Zona, Edad de la cría (Meses), Peso promedio de la cría, Uniformidad de la cría. Informe de revisación: Sanidad.
- Prioridad: alta · Certeza: confirmado

### Caso 50: Campos de Vaquillonas preñadas
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tipo de Rodeo, Tratamiento Nutricional, Zona. Informe del servicio: Tipo de servicio, Raza de inseminación, Toro de inseminación. Informe de revisación: Sanidad.
- Prioridad: alta · Certeza: confirmado

### Caso 51: Campos de Vaquillonas para madre
- Esperado: Información de la tropa: Edad (Meses), Marca Líquida, Calidad, Tipo de Rodeo, Definidas, Tratamiento Nutricional, Zona. Informe de revisación: Sanidad.
- Prioridad: alta · Certeza: confirmado

### Caso 52: Campos de Toros
- Esperado: Información de la tropa: Edad (Años), Tratamiento Nutricional, Análisis Sanitario, Dentición, Zona, Tipo de Rodeo, Calidad, Origen de los toros, Apto para Vaquillonas.
- Prioridad: alta · Certeza: confirmado

---

## E. Campos condicionales

### Caso 53: Destetados SI muestra Fecha de destete
- Funcionalidad: Destetados
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir SI en Destetados.
- Esperado: Aparece el campo Fecha de destete.
- Certeza: confirmado
- Datos: ninguno

### Caso 54: Destetados NO no muestra Fecha de destete
- Funcionalidad: Destetados
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir NO en Destetados.
- Esperado: No aparece Fecha de destete.
- Certeza: confirmado
- Datos: ninguno

### Caso 55: Capados SI muestra Fecha de capado
- Funcionalidad: Capados
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir SI en Capados.
- Esperado: Aparece el campo Fecha de capado.
- Certeza: confirmado
- Datos: ninguno

### Caso 56: Capados NO no muestra Fecha de capado
- Funcionalidad: Capados
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir NO en Capados.
- Esperado: No aparece Fecha de capado.
- Certeza: confirmado
- Datos: ninguno

### Caso 57: Zona Lucha muestra Garrapata y Mio-Mio
- Funcionalidad: Zona
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir Lucha en Zona.
- Esperado: Aparecen Garrapata (SI/NO) y Mio-Mio (SI/NO).
- Certeza: confirmado
- Datos: ninguno
- Cobertura existente: TC-INV-006 (automatizado) — descartar

### Caso 58: Zona Sucia muestra Garrapata y Mio-Mio
- Funcionalidad: Zona
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir Sucia en Zona.
- Esperado: Aparecen Garrapata (SI/NO) y Mio-Mio (SI/NO).
- Certeza: confirmado
- Datos: ninguno
- Cobertura existente: TC-INV-006 (automatizado) — descartar

### Caso 59: Zona Limpia no muestra Garrapata ni Mio-Mio
- Funcionalidad: Zona
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir Limpia en Zona.
- Esperado: No aparecen Garrapata ni Mio-Mio.
- Certeza: confirmado
- Datos: ninguno
- Cobertura existente: TC-INV-006 recorre Limpia pero la spec automatizada no lo asierta — actualizar

### Caso 60: Tipo de servicio Inseminación muestra Inseminación
- Funcionalidad: Informe del servicio > Tipo de servicio
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas
- Pasos: Elegir Inseminación en Tipo de servicio.
- Esperado: Aparece el campo Inseminación.
- Certeza: confirmado
- Datos: ninguno

### Caso 61: Inseminación A tiempo fijo muestra Fecha de inseminación
- Funcionalidad: Informe del servicio > Inseminación
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas, Tipo de servicio Inseminación
- Pasos: Elegir A tiempo fijo en Inseminación.
- Esperado: Aparece Fecha de inseminación.
- Certeza: confirmado
- Datos: ninguno

### Caso 62: Inseminación Con detección muestra Inicio y Fin de inseminación
- Funcionalidad: Informe del servicio > Inseminación
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas, Tipo de servicio Inseminación
- Pasos: Elegir Con detección en Inseminación.
- Esperado: Aparecen Inicio de inseminación y Fin de inseminación.
- Certeza: confirmado
- Datos: ninguno

### Caso 63: Servicio Natural muestra sus campos
- Funcionalidad: Informe del servicio > Tipo de servicio
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas
- Pasos: Elegir Servicio Natural en Tipo de servicio.
- Esperado: Aparecen Inicio de servicio, Fin de servicio, Raza de servicio y Origen de los toros.
- Certeza: confirmado
- Datos: ninguno
- Cobertura existente: TC-INV-005 (automatizado, etiquetas visibles) — descartar

### Caso 64: Servicio Natural oculta Raza y Toro de inseminación
- Funcionalidad: Informe del servicio > Tipo de servicio
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas
- Pasos: Elegir Servicio Natural en Tipo de servicio.
- Esperado: Raza de inseminación y Toro de inseminación dejan de mostrarse.
- Certeza: confirmado
- Datos: ninguno

### Caso 65: Inseminación + repaso muestra sus campos
- Funcionalidad: Informe del servicio > Tipo de servicio
- Prioridad: alta
- Precondiciones: Formulario abierto, categoría Vacas preñadas
- Pasos: Elegir Inseminación + repaso en Tipo de servicio.
- Esperado: Aparecen Raza de inseminación, Toro de inseminación, Inseminación, Fecha inicio de repaso, Fecha fin de repaso, Raza de servicio y Origen de los toros.
- Certeza: confirmado
- Datos: ninguno

### Caso 66: Inseminación + repaso con detección
- Funcionalidad: Informe del servicio > Inseminación
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Vacas preñadas, Tipo de servicio Inseminación + repaso
- Pasos: Elegir Con detección en Inseminación.
- Esperado: Aparecen Inicio de inseminación y Fin de inseminación.
- Certeza: confirmado
- Datos: ninguno

### Caso 67: Machos + Hembras frente a la Cantidad — DIFERIDO (2026-10-09: la app aún no valida; agregar cuando se implemente)
- Funcionalidad: Segmentación de la tropa > Cantidad Machos, Cantidad Hembras
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Terneros y Terneras, Cantidad 50
- Pasos: Ingresar Machos 20 y Hembras 20 (suma 40). Intentar enviar.
- Esperado: Observar si se exige que la suma sea igual a la Cantidad.
- Certeza: no sé
- Datos: Machos 20, Hembras 20
- Notas: Si no hay validación, no se envía nada; en ese caso cancelar antes de confirmar.

### Caso 68: Plan sanitario SI
- Funcionalidad: Desea informar el plan sanitario
- Prioridad: media
- Precondiciones: Formulario abierto, categoría Terneros
- Pasos: Elegir SI en Desea informar el plan sanitario.
- Esperado: Observar qué campos aparecen.
- Certeza: no sé
- Datos: ninguno

---

## F. Envío

Todos: Precondiciones = Usuario base, formulario abierto · Datos = Datos base + los indicados
· Pasos = elegir la categoría, completar campos comunes y de la categoría, presionar `Ofrecer Tropa`
· Prioridad = crítica · Certeza = confirmado.

**Esperado común (observado por el usuario):** se mantiene la misma URL y la vista cambia a una
confirmación con el mensaje `Su tropa ha sido creada correctamente` y más información. No se
muestra número de lote/tropa. La vista incluye enlaces como `Mis operaciones` (para ver la tropa
recién ofrecida) y el botón `Ingresar nueva tropa`.

**Notas comunes:** caso de envío; crea un ofrecimiento real en stage en cada corrida (no hace
falta borrarlo). Aprobado por ahora; frecuencia pendiente de validar con el líder. Raza y Plazo de
venta: primera opción disponible salvo indicación.

- **Caso 69: Envío Terneros** — Datos: Datos base + 1 raza, Edad 7 meses, Destetados SI, Capados SI, Zona Limpia
- **Caso 70: Envío Terneras** — Datos: Datos base + 2 razas, Edad 7 meses, Destetados NO, Zona Lucha (Garrapata NO, Mio-Mio NO)
- **Caso 71: Envío Terneros y Terneras** — Datos: Datos base + Machos 25, Hembras 25, Edad 7 meses, Destetados SI, Capados NO, Zona Sucia (Garrapata SI, Mio-Mio NO)
- **Caso 72: Envío Novillitos** — Datos: Datos base + Edad 14 meses, Tratamiento Nutricional Praderas y/o Verdeos, Zona Limpia
- **Caso 73: Envío Vaquillonas** — Datos: Datos base + 3 razas, Edad 14 meses, Zona Limpia
- **Caso 74: Envío Novillitos y Vaquillonas** — Datos: Datos base + Machos 30, Hembras 20, Edad 14 meses, Zona Limpia
- **Caso 75: Envío Novillos** — Datos: Datos base + Edad 20 meses, Tratamiento Nutricional A Corral, Zona Limpia
- **Caso 76: Envío Vacas de invernada** — Datos: Datos base + Edad 6 años, Dentición Boca llena, Tipo de Rodeo Rodeo General, Zona Limpia
- **Caso 77: Envío Vacas con cría** — Datos: Datos base + Edad 5 años, Edad de la cría 4 meses, Peso promedio de la cría 120, Uniformidad de la cría Parejo
- **Caso 78: Envío Vacas CUT con cría** — Datos: Datos base + Edad 8 años, Edad de la cría 4 meses, Peso promedio de la cría 120, Uniformidad de la cría Desparejo
- **Caso 79: Envío MEJ** — Datos: Datos base (solo campos comunes)
- **Caso 80: Envío Vacas preñadas (Inseminación a tiempo fijo)** — Datos: Datos base + Edad 5 años, Tipo de servicio Inseminación, Inseminación A tiempo fijo, Fecha de inseminación dinámica
- **Caso 81: Envío Vacas CUT preñadas (Servicio Natural)** — Datos: Datos base + Edad 8 años, Tipo de servicio Servicio Natural, Inicio y Fin de servicio dinámicos
- **Caso 82: Envío Vaquillonas con cría** — Datos: Datos base + Edad 26 meses, Edad de la cría 3 meses, Peso promedio de la cría 100, Uniformidad de la cría Parejo
- **Caso 83: Envío Vaquillonas preñadas (Inseminación + repaso con detección)** — Datos: Datos base + Edad 20 meses, Tipo de servicio Inseminación + repaso, Inseminación Con detección, fechas dinámicas
- **Caso 84: Envío Vaquillonas para madre** — Datos: Datos base + Edad 15 meses, Tipo de Rodeo Puro Controlado
- **Caso 85: Envío Toros** — Datos: Datos base + Edad 3 años, Tipo de Rodeo Puro Pedigree, Dentición 4 dientes

Cobertura existente: TC-INV-010 (candidato por falta de datos autorizados) — actualizar con estos 17 perfiles.
