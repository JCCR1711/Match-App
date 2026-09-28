# Finanzas del negocio

## Responsabilidades

- Un cobro representa una transaccion individual originada por una reserva.
- Una liquidacion agrupa uno o mas cobros elegibles de una organizacion.
- El proveedor de pagos custodia temporalmente los fondos y ejecuta el deposito.
- Match conserva referencias, importes y estados; no guarda fondos ni datos bancarios completos.

## Flujo

```text
Reserva pagada
  -> cobro confirmado
  -> calculo de comision Match y costo de procesamiento
  -> movimiento elegible
  -> corte de liquidacion
  -> deposito del neto en la cuenta del negocio
  -> confirmacion mediante webhook
```

La comision de Match se calcula por cada reserva pagada. No se cobra una nueva
comision al generar la liquidacion, depositar el saldo ni cambiar la cuenta de
destino. La liquidacion solo agrupa el neto de movimientos previamente
calculados.

Reglas del MVP:

- pago pendiente o rechazado: no genera comision;
- reserva pagada: registra comision y procesamiento como importes pendientes;
- servicio realizado: ambos importes quedan firmes y el neto es liquidable;
- reembolso total: revierte la comision de Match;
- cancelacion con penalidad: la comision se aplica solo al importe retenido;
- contracargo: se registra como ajuste de una liquidacion posterior;
- deposito o retiro: no genera comision adicional de Match.

Cada liquidacion debe conservar sus movimientos asociados, monto bruto,
comision Match, costo de procesamiento, ajustes, neto, cuenta de destino
enmascarada y fechas estimada y efectiva.

## Acceso

- `owner`: consulta finanzas y administra la cuenta de deposito.
- `manager`: consulta finanzas y liquidaciones.
- `staff`: no accede a informacion financiera.

Estas capacidades solo adaptan la interfaz. El servidor debe validar la
membresia y el rol en cada lectura o escritura.

El selector de roles del perfil existe solo en el mock de desarrollo. Sirve
para comprobar estas tres variantes visuales y no modifica permisos en un
backend ni habilita operaciones financieras reales.

## Contratos recomendados

```text
GET /organizations/:organizationId/finance/overview
GET /organizations/:organizationId/financial-movements
GET /organizations/:organizationId/settlements
GET /organizations/:organizationId/settlements/:settlementId
PUT /organizations/:organizationId/payout-account
```

La cuenta bancaria debe registrarse directamente con el proveedor. Match
persiste un identificador externo y los ultimos digitos necesarios para
presentacion y conciliacion.

## Mapa de pantallas

### Implementado en el prototipo

- `Finanzas`: resumen del negocio, monto por liquidar, metricas y movimientos.
- `Liquidaciones`: monto en proceso e historial de depositos.
- `Detalle de liquidacion`: desglose de bruto, comisiones, ajustes, neto,
  reservas agrupadas y cuenta enmascarada.
- `Cuenta de deposito`: banco, titular, cuenta enmascarada y estado. `owner`
  puede reemplazarla; `manager` conserva acceso de solo lectura y `staff` no
  accede al modulo financiero.

Cambiar la cuenta es una pantalla de tarea presentada verticalmente. No es un
sheet: requiere selector de banco, inputs, validacion, manejo de teclado y
proteccion de cambios sin guardar.

### Requerido para el MVP del negocio

1. `Detalle de movimiento`: reserva relacionada, cobro, comision, neto, fecha
   y estado. Puede implementarse como sheet mientras no requiera un flujo
   secundario complejo.
2. `Verificacion para liquidar`: estado de identidad o negocio solicitado por
   el proveedor, requisitos pendientes y accion para continuar. Debe existir
   solo si el proveedor seleccionado requiere onboarding o KYC.

### Responsabilidad del jugador

Las tarjetas y otros medios con los que un jugador paga una reserva no
pertenecen a la configuracion financiera del negocio. Deben vivir en el flujo
de pagos del jugador:

1. `Pagar reserva`: importe, cancha, politica y selector del medio de pago.
2. `Metodos de pago`: tarjetas o wallets tokenizadas por el proveedor.
3. `Resultado del pago`: exito, procesamiento o rechazo, con una referencia
   idempotente antes de confirmar la reserva.

Match no debe almacenar PAN, CVV ni datos completos de tarjeta. La pantalla de
metodos guardados se implementara cuando exista un proveedor y un contrato de
tokenizacion; no debe simular persistencia insegura en AsyncStorage.

El mock de la cuenta de deposito aplica la misma minimizacion: el numero existe
solo mientras el formulario esta abierto. Al guardar se descarta y se persisten
unicamente banco, titular, moneda, estado y ultimos cuatro digitos.

### Fuera del primer MVP

- disputas y contracargos;
- reembolsos parciales avanzados;
- comprobantes fiscales y reportes tributarios;
- multiples cuentas de deposito por organizacion;
- reglas automaticas de reparto entre propietarios.
