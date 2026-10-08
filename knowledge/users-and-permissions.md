# Usuarios, perfiles y permisos

## Tipos de usuario

### Clientes vendedores

- `BR-USR-001`: un cliente vendedor puede ofrecer tropas de invernada y de faena.
- `BR-USR-002`: ofrecer ambos tipos de tropa no requiere permisos especiales.

### Clientes compradores

- `BR-USR-003`: un cliente comprador de invernada no necesita un permiso de usuario especial.
- `BR-USR-004`: para comprar faena, el usuario debe pertenecer a una sociedad habilitada para dicha operatoria.

### Admin

- `BR-USR-005`: un Admin generalmente tiene perfil o permiso 4.
- La palabra “generalmente” indica que puede haber excepciones no documentadas.

### Asociado Comercial o Comercial Regional (CR)

- `BR-USR-006`: un CR generalmente tiene perfil o permiso 6.
- `BR-USR-007`: el CR tiene la misma vista que un Admin.
- `BR-USR-008`: el CR se asocia a sociedades; una sociedad puede no tener CR.
- `BR-USR-009`: el CR puede impersonar usuarios pertenecientes a las sociedades en las que está asociado y realizar movimientos.
- `BR-USR-010`: sólo determinados Admin pueden editar el CR asignado a una sociedad. El criterio de autorización no está documentado.

### Representantes

- `BR-USR-011`: un representante tiene la misma vista que un cliente.
- `BR-USR-012`: un representante puede estar asociado a varias sociedades.
- `BR-USR-013`: una sociedad puede tener un único representante.
- `BR-USR-014`: los representantes también se asocian a usuarios.

## Creación de usuarios

### Admin o CR

`FL-USR-001`

1. Ingresar a `Administradores`.
2. Seleccionar `Crear administrador`.
3. Elegir perfil 4 para crear un Admin o perfil 6 para crear un CR.

### Representante

`FL-USR-002`

1. Ingresar a `Representante`.
2. Seleccionar `Crear nuevo representante`.

### Clientes

El procedimiento está referenciado en una página externa llamada `Clientes`, pero no fue incluido en la fuente exportada.

## Observaciones de login por rol (2026-10-02)

Las vistas posteriores al login observadas por rol en Stage están en `knowledge/login-dcac-exploration.md` (`MAP-LOGIN-001` a `MAP-LOGIN-004`). Son evidencia de interfaz y no confirman permisos 4/6 ni la diferencia Admin/CR (`OQ-002`, `OQ-004`, `OQ-038`).
