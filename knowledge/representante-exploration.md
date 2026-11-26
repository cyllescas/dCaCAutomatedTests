# Hallazgos de exploración — Rol Representante (navegación y cascada de ofrecimientos)

- Fecha: 2026-11-25
- Ambiente: `https://stage.dcac.ar/`
- Rol: Representante (`USER_AGENT`, rol `agent` del auto-login MCP)
- Fuente: exploración UI black-box con Playwright MCP (feature `config/ofrecimientos-representante-core.yaml`).
- Plan asociado: `specs/ofrecimientos-representante-core.md` (pendiente de aprobación humana). Los selectores completos viven en su `Automation Handoff`; aquí sólo se resumen.
- Estado: hallazgos observados, no confirmados con Producto. No son reglas de negocio.
- Evidencia: `artifacts/exploration/ofrecimientos-representante-core/` (no versionada; puede contener nombres reales).
- No se registran credenciales, tokens, nombres reales ni IDs.
- Comparación con Cliente: no se pudo cambiar de rol en la sesión. La comparación usa `MAP-LOGIN-001` y los inventarios previos de Faena e Invernada del Cliente.

## Equivalencias de vista

- `MAP-AGT-001`, header del Representante en `/__dcac/` (título `Inicio`), contenedor `.menu_logueado`:
  - `Operaciones` (`a.operaciones_menu`), con submenú Ventas, Compras, Ofertas, Resúmenes, Ventas directo y `Performance` (`a[href="/__dcac/misPublicaciones/Resultados_rep"]`, ver `OQ-077`).
  - `Precios`, `Consultas` (`a.consultas_menu`), `Clientes` (`a[href="/__dcac/misClientes"]`), `Perfil` (`a.perfil_menu`), `Clima`.
  - `Comprar` (`#btn_comprar`) y `Cotizar` (`#btn_vender`).
  - Acceso a deCampoPagos `#btn_pagar` (logo `logo_dcp.svg`, sin texto, misma pestaña), con destino origen `https://react-stage.dcac.ar`, ruta `/inicio`.
  - Enlace `DCP REACT` visible al mismo destino. **Difiere de `MAP-LOGIN-002` (2026-10-02), que lo registró ausente**; se conserva esa entrada y se abre `OQ-072`.
  - Menú de usuario `#div_log_out`: `Ver perfil` (`a.a_perfil_pop`, `/__dcac/perfil`) y `Salir` (`/__dcac/logout`).
- `MAP-AGT-002`, página `/__dcac/misClientes`:
  - Título `.span_titulo_clientes` = `Clientes`; acciones `Crear Nuevo Cliente` y `Descargar Listado` (no ejecutadas).
  - Búsqueda `#buscar_string` (placeholder `Nombre, Apellido o Razón Social`) + `button.btn_buscar`. Filtra sin petición visible. Sin coincidencias deja 0 filas y no muestra mensaje; con el campo vacío vuelve el listado completo.
  - Listado `.listado_p > .fila_listado` con columnas ID, Nombre Cliente, Sociedades, Establecimientos, Ult. Conexión, Detalles. Cada fila tiene `.clientes`, `.sociedades` (tabla Nombre Sociedad | Tel), `.estableciemientos` (grafía literal de la clase; muestra `S/Establecimiento` o partido/provincia), `Actividad` y `Ver Perfil`.
  - Algunas filas muestran nombres de sociedad vacíos (`OQ-076`).
  - No hay control de impersonación.

## Flujos observados

- `FL-AGT-001`: Clientes → `Ver Perfil` (`/__dcac/perfil/DatosPersonales/<id>`, título `Mi perfil`) → `Mis Sociedades` (`/__dcac/perfil/MisSociedades/<id>`) → `Ver sociedad` o `Volver al listado de clientes`. La vista de usuarios de una sociedad lista perfiles Administrador/Regular/Operativo/Financiero y no muestra representantes. Coincide con los pasos 1–3 de `FL-SOC-003`.
- `FL-AGT-002`: en los formularios legacy de Faena (`/__dcac/venderHacienda?solicitud_directo&rapido`) e Invernada (`/__dcac/venderHacienda?solicitud_invernada&rapido`), el Representante tiene un selector `Cliente` (`#idClienteRepresentante`, `ng_usuario` / `re_usuario`) antes de Sociedad. Lista los mismos clientes que la página Clientes.
  - Elegir un cliente con sociedades carga `Seleccionar una sociedad` + sus sociedades + `+ Nueva Sociedad` en menos de 0,5 s.
  - Elegir una sociedad muestra el selector de establecimiento: `#estab` en Faena; `#estab_soc` en Invernada, en unos 2,5 s.
  - Al cambiar de cliente, la Sociedad se reinicia. El establecimiento no: en Faena conserva las opciones previas; en Invernada queda visible y vacío (`OQ-074`).
  - Antes de elegir cliente, Sociedad está habilitada y ofrece `+ Nueva Sociedad`. Faena muestra `No hay sociedades disponibles` e Invernada `Seleccionar una sociedad` (`OQ-075`).
  - Sólo 1 de 6 clientes cargó sociedades en ambos formularios. Los otros 5, aunque Clientes les lista sociedades, no cargaron ninguna (`OQ-073`).

## Validaciones observadas

- `VAL-AGT-001`: Faena como Representante, envío vacío. Mensajes `.alert_input_faltante` para Sociedad, Establecimiento, Tipo de Jaula, Categoría, Terminación, Destino, Raza, Peso y Disponibilidad de Carga. Sin mensaje para Cliente. No se envió POST.
- `VAL-AGT-002`: Invernada como Representante, envío vacío. Mensajes para Sociedad, Establecimiento, Cantidad, Categoria, Raza y Plazo de venta. Sin mensaje para Cliente. Además de los obligatorios conocidos del Cliente, exige Sociedad y Establecimiento.

## Ambiente y procedimientos de testing

- `TST-AGT-001`: los clientes de prueba se descubren en runtime, recorriendo `#idClienteRepresentante` hasta uno que cargue sociedades. Al 2026-11-25 ningún cliente del formulario tiene una sociedad con establecimientos reales, así que los casos de establecimiento con ubicación quedan como `missing_authorized_data`.
- `TST-AGT-002`: los hrefs de `#btn_pagar` y `DCP REACT` llevan `token`, `refresh_token` y `callback_url`. No registrarlos en logs, reportes, fixtures ni conocimiento; validar sólo origen y ruta.
- `TST-AGT-003`: el rol del auto-login del MCP se elige con `artifacts/.mcp-login-role` (`agent` para Representante). Se relee en cada login, sin reiniciar el MCP.

## Preguntas abiertas generadas

`OQ-072` a `OQ-078` en `open-questions.md`.
