# Verificación de datos por base de datos

## Uso seguro

Este catálogo es para diagnóstico, preparación y aserciones de QA. Ejecutar únicamente consultas de lectura (`SELECT`) en el ambiente autorizado. No usar instrucciones de actualización o borrado como parte de una ejecución automatizada de tests.

Sustituir los parámetros `:...` por valores de prueba y limitar los resultados. No incluir correos personales, CUIT/CBU reales ni resultados de las consultas en prompts de IA si no son necesarios.

## Mapa de fuentes de datos

| Necesidad | Esquemas y tablas relevantes |
| --- | --- |
| Sociedades, usuarios y clientes | `dcac.sociedades_tags`, `dcac.usuarios`, `dcac.clientes`, `dcac.rel_usuarios_sociedades` |
| Tropas y características | `dcac.negocios`, `dcac.categorias`, `dcac.razas`, `dcac.lote_transportes` |
| Liquidaciones | `negocios.liquidaciones`, `negocios.liquidacion_oficial`, `negocios.liquidacion_segmentaciones` |
| CI / CD Faena | `negocios.compra_inmediata_faena`, `negocios.cd_cotizaciones`, `negocios.cd_segmentaciones` |
| Notificaciones | `salida_mails.bandeja_salida`, `salida_mails.notifix` |
| Financiero / DCP | `financiero.destinatarios`, `financiero.destinatarios_cuentas`, `financiero.cuentas_bancarias`, `financiero.estado_cuenta`, `financiero.bancos` |
| Crédito bancario | `dcac.acuerdos_por_banco`, `dcac.creditos_x_sociedad` |

## Consultas reutilizables

### Asociado comercial de una sociedad

```sql
SELECT st.razon_social, st.asociado_comercial AS asociado_comercial_id,
       CONCAT(u.apellido, ', ', u.nombre) AS asociado_comercial
FROM dcac.sociedades_tags st
JOIN dcac.usuarios u ON u.usuario = st.asociado_comercial
WHERE st.id = :sociedad_id;
```

Uso: verificar la asociación de un CR/Asociado Comercial a una sociedad.

### Tipo de cliente a partir de un correo

```sql
SELECT c.cliente, c.usuario, CONCAT(c.nombre, ', ', c.apellido) AS nombre_completo,
       c.tipo_cliente, tc.tipo_descripcion
FROM dcac.clientes c
JOIN dcac.usuarios u ON u.usuario = c.usuario
JOIN dcac.tipo_cliente tc ON tc.tipo_id = c.tipo_cliente
WHERE u.mail = :email;
```

Uso: verificar el tipo de cliente y su relación con el usuario antes de una prueba de permisos.

### Segmentación, tipificación y grasa de una CI/CD de faena

```sql
SELECT cdc.lote_nro, cdc.estado, n.categoria, cdc.id AS id_cotizacion,
       cds.id AS id_segmentacion, cds.desde, cds.hasta, cds.precio,
       cds.tipificacion_tipo, cds.grasa
FROM negocios.cd_cotizaciones cdc
JOIN negocios.cd_segmentaciones cds ON cds.cd_cotizacion_id = cdc.id
JOIN dcac.negocios n ON n.id = cdc.lote_nro
WHERE cdc.lote_nro = :lote_id AND cdc.estado = 1;
```

Uso: contrastar lo mostrado en la CI de faena contra la segmentación persistida.

### Costo por km y distancia en CI/CD de faena

```sql
SELECT costo_km, comprada, negocio
FROM negocios.compra_inmediata_faena
WHERE negocio = :lote_id AND comprada = 1;

SELECT distancia_flete, valor_flete_kms, lote_nro
FROM negocios.cd_cotizaciones
WHERE lote_nro = :lote_id;
```

Uso conjunto: verificar propagación de distancia y flete al avanzar la operación.

### Fecha de carga de Faena Cargadas

```sql
SELECT n.id, n.asociado_comercial,
       l.fecha_carga_origen AS fecha_carga_origen,
       t.fecha_carga AS fecha_carga_transporte,
       l.fecha_carga AS fecha_carga_proyectada
FROM dcac.negocios n
LEFT JOIN dcac.lote_transportes t ON t.lote_id = n.id AND t.lote_tipo_id = 1
LEFT JOIN negocios.liquidaciones l ON l.negocio = n.id
WHERE n.tipo = :tipo_estado
  AND n.directo = 1 AND n.borrado != 1 AND n.no_concretado != 1
ORDER BY n.asociado_comercial, l.fecha_carga_origen ASC, n.id;
```

La fuente documenta `7` para Cargadas y `13` para Faenadas; confirmar que sigan vigentes.

### Destinatarios DCP por método de pago

```sql
SELECT dc.sociedad_id, st.razon_social, COUNT(*) AS total
FROM financiero.destinatarios_cuentas dc
JOIN dcac.sociedades_tags st ON st.id = dc.sociedad_id
WHERE dc.metodo_pago_id = :metodo_pago_id
  AND dc.visible = 1 AND dc.fecha_eliminacion IS NULL
GROUP BY dc.sociedad_id, st.razon_social
HAVING COUNT(*) > :minimo_destinatarios
ORDER BY total DESC
LIMIT :limite;
```

Métodos observados: `1` cuenta propia, `2` cuenta de terceros, `3` cheque. Confirmar este catálogo antes de usarlo como enum de producto.

### Resolver razón social de destinatario desde CBU

1. Buscar la cuenta en `financiero.cuentas_bancarias` por `cbu`.
2. Buscar su relación visible y no eliminada en `financiero.destinatarios_cuentas` con `metodo_pago_id = 2` y el id de cuenta obtenido.
3. Consultar `financiero.destinatarios` por el id de destinatario.

No registrar CBUs reales en archivos de conocimiento o fixtures compartidos.

### Usuarios con teléfono validado y saldo acreditado

La fuente vincula `dcac.clientes`, `dcac.usuarios`, `dcac.rel_usuarios_sociedades` y `financiero.estado_cuenta`, filtrando `telefono_validado = 1` y `saldo_acreditado > 0`. Usar este perfil para escenarios DCP que requieran ambos atributos.

## Consultas excluidas

La fuente contiene una instrucción `UPDATE` para razón social. Fue excluida intencionalmente: la preparación de datos mutables debe realizarse por un procedimiento aprobado, reversible y aislado.
