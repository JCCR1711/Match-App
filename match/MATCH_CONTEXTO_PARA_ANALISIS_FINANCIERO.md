# MATCH: guía sencilla para entender el proyecto y preparar proyecciones

**Para:** la analista financiera del proyecto
**Actualizado:** 28 de septiembre de 2026

## 1. MATCH en pocas palabras

MATCH es una aplicación para encontrar y reservar canchas y para que los negocios que las alquilan organicen su operación.

La aplicación conecta dos grupos:

- **Jugadores**, que buscan una cancha, eligen un horario y quieren reservar.
- **Negocios**, que publican sus canchas, administran horarios y atienden reservas.

MATCH busca ganar dinero principalmente de dos maneras: cobrando una comisión por ciertas reservas pagadas dentro de la aplicación y ofreciendo un plan mensual avanzado a los negocios.

**Situación actual:** MATCH tiene una aplicación de prototipo que permite recorrer varias pantallas y probar flujos con datos de demostración. El código revisado no demuestra que haya pagos, suscripciones, depósitos o ventas reales. Tampoco contiene cifras verificadas de clientes, costos o ingresos. Por eso, este documento explica el negocio propuesto y señala qué datos hacen falta para proyectarlo; no presenta resultados reales.

## 2. Cómo se usa MATCH

Una misma persona puede usar MATCH para jugar y para administrar un negocio. Dentro de la aplicación puede cambiar entre esos dos modos con su cuenta.

Un negocio se organiza así:

```text
Negocio o club
  └── Una o varias sedes
       └── Una o varias canchas
            └── Horarios, precios, reservas y bloqueos
```

Por ejemplo, un club podría tener dos sedes y tres canchas en cada una. La propuesta contempla que el plan del negocio corresponda al club, no que se cobre automáticamente un plan distinto por cada cancha.

Hay tres tipos de acceso previstos:

| Persona | Qué haría en MATCH |
|---|---|
| Propietario | Administra el negocio, el plan y la cuenta donde se depositan los fondos. |
| Administrador | Ayuda con la operación y puede consultar las finanzas. |
| Personal | Ayuda con tareas de reservas; no tiene acceso a las finanzas del negocio. |

El sistema de invitaciones y permisos todavía requiere integración real con un servidor.

## 3. El recorrido de cada cliente

### El jugador

El jugador abre MATCH, busca una sede, revisa las canchas y los horarios disponibles, elige cuánto tiempo quiere jugar y solicita una reserva. En la versión completa, pagaría dentro de la aplicación y recibiría la confirmación. Después podría revisar sus reservas y solicitar una cancelación según las condiciones del negocio.

La aplicación ya muestra pantallas de búsqueda y reserva. Sin embargo, el código revisado crea la reserva con el pago pendiente. La pantalla siguiente, por sí sola, **no confirma que MATCH haya recibido dinero**. Falta conectar el cobro real y definir cómo se procesan las cancelaciones y devoluciones.

La visión también incluye partidos abiertos y pagos repartidos entre jugadores. Esas funciones todavía no deben contarse como actividad comercial disponible.

### El negocio

El propietario registra el club, agrega una sede y crea una cancha. Luego configura su ubicación, horario y precio. Una vez listo, puede administrar la agenda: revisar reservas, añadir reservas que recibió directamente y bloquear horarios en los que no alquilará la cancha.

Una reserva que llega por MATCH y una que el negocio apunta manualmente son distintas:

| Tipo de reserva | Quién consigue o registra al jugador | ¿MATCH cobraría comisión? |
|---|---|---|
| Reserva de MATCH | El jugador encuentra y solicita la cancha en MATCH. | La propuesta es cobrarla si se procesa y cumple las condiciones acordadas. |
| Reserva manual | El negocio la registra porque la recibió por su cuenta. | No necesariamente. El negocio puede cobrar directamente al jugador. |

Esta diferencia es importante: una reserva registrada por el negocio puede ser una venta para el club sin ser un ingreso para MATCH.

## 4. De quién es el dinero

Hay tres cantidades que conviene mantener separadas:

1. **Venta del negocio:** el importe que el jugador paga por alquilar la cancha.
2. **Volumen procesado por MATCH:** el importe de las reservas que pasan por el cobro de la aplicación.
3. **Ingreso de MATCH:** la comisión que le corresponde a la plataforma y los pagos de suscripciones que efectivamente reciba.

El volumen procesado por MATCH **no es lo mismo que el ingreso de MATCH**. Si una persona paga S/ 100 por una cancha, el negocio es quien presta el servicio. MATCH solo registraría como ingreso propio la comisión que se haya acordado, más los ingresos por suscripción que correspondan.

El flujo de dinero propuesto es:

```text
El jugador paga
  → se registra el cobro de la reserva
  → se realiza el partido
  → se calcula cuánto corresponde a MATCH y al negocio
  → se prepara el depósito al negocio
```

Un proveedor de pagos tendría que procesar el cobro y el depósito. MATCH debería guardar los importes y referencias para poder revisar las operaciones, sin guardar los datos completos de la tarjeta. Este flujo aún no está conectado a un proveedor real.

La regla propuesta es que MATCH cobre una sola comisión por la reserva, no otra comisión adicional cuando deposite el saldo al negocio. Una devolución, una cancelación con penalidad o un cobro disputado puede cambiar los importes y necesita reglas claras antes de operar.

## 5. Cómo podría ganar dinero MATCH

### Comisión por reservas

La propuesta inicial usa una comisión de **5%** sobre el importe elegible de una reserva. Por ejemplo, con una reserva de S/ 100, una comisión del 5% equivaldría a S/ 5 antes de considerar los costos de procesar el pago.

Ese porcentaje todavía es una **hipótesis**, no una tarifa cobrada. Falta confirmar qué pagos generan comisión, quién asume el costo del proveedor y qué pasa cuando hay devoluciones o cancelaciones.

El proyecto también menciona evaluar una tarifa total de 8% a 10%. Es una alternativa para estudiar; no debe sumarse al 5% en una misma proyección.

### Suscripción de negocios

El producto contempla dos planes:

| Plan | Qué incluye la propuesta | Precio documentado |
|---|---|---:|
| Basic | Herramientas esenciales para administrar una sede, una cancha, reservas y horarios. | Sin precio confirmado; se plantea como plan permanente. |
| Pro | Más sedes y canchas, acceso del equipo y herramientas avanzadas de análisis. | S/ 19.90 al mes como precio de referencia. |

También se menciona un precio promocional de **S/ 9.90 al mes** para negocios fundadores y una prueba Pro de 30 días. El equipo aún debe decidir cuánto dura la promoción y quién puede acceder.

Las pantallas de planes existen en el prototipo; eso no quiere decir que MATCH ya cobre suscripciones. El plan Basic es importante para que un negocio pueda empezar y para que haya más canchas disponibles. MATCH podría obtener ingresos de esas canchas si generan reservas pagadas por la plataforma.

### Posibles ingresos futuros

El proyecto menciona un plan Pro para jugadores y espacios promocionados para negocios. No se han confirmado sus precios ni sus condiciones. Déjalos fuera de la proyección principal hasta que el equipo los valide.

## 6. Qué está hecho y qué no

| Tema | Estado encontrado en el proyecto |
|---|---|
| Pantallas para jugador | Hay búsqueda, detalles de sedes y creación y consulta de reservas. |
| Herramientas para negocios | Hay pantallas para agenda, reservas, sedes, canchas y disponibilidad. |
| Pago del jugador | No se encontró una integración de cobro real; la reserva se crea con pago pendiente. |
| Suscripciones | Hay pantallas y reglas de prueba, pero el servicio actual usa datos simulados. |
| Finanzas y depósitos | La aplicación muestra ejemplos de movimientos y liquidaciones; no son depósitos reales. |
| Estadísticas | El prototipo calcula reservas, ventas confirmadas y ocupación con los datos disponibles. |
| Exportación | Existe una exportación CSV de reservas; no equivale a una conciliación bancaria. |
| Datos comerciales | No se encontraron cifras verificadas de usuarios, negocios, ingresos o gastos. |

La aplicación puede mostrar cifras para probar cómo se vería el producto. Esas cifras de ejemplo no sirven como historial financiero de MATCH ni de un negocio real.

También hay una diferencia entre «reserva confirmada» y «dinero cobrado»: algunas estadísticas suman el importe de reservas confirmadas sin comprobar que el pago haya llegado. Antes de proyectar con datos de uso reales, el equipo tendrá que acordar qué cuenta como venta, pago, servicio realizado y devolución.

## 7. Cómo preparar una proyección

Conviene proyectar cada mes por separado y preparar tres versiones: **conservadora**, **base** y **favorable**. Cada cifra debe indicar de dónde salió. Si todavía no se conoce, márcala como pendiente; no la presentes como dato real.

### Paso 1: estimar los negocios activos

Cuenta los negocios que realmente pueden recibir reservas. Un negocio dado de alta no necesariamente tiene una cancha lista. Para considerarlo activo, define con el equipo requisitos sencillos, como tener cancha, horario y precio configurados.

```text
Negocios al final del mes
= negocios al inicio + negocios nuevos activados − negocios que dejan de usar MATCH
```

### Paso 2: estimar cuántas reservas caben y cuántas ocurrirán

Para cada cancha, pregunta cuántas horas abre, qué horarios tienen demanda, cuánto dura normalmente una reserva y qué porcentaje de esos horarios se ocupa.

```text
Horas disponibles para alquilar
= horas abiertas − horas bloqueadas o fuera de servicio
```

No supongas que todas las horas se venden. Las tardes y noches podrían tener más demanda que las mañanas. Si un grupo reserva una cancha, cuenta una reserva; no cuentes a cada jugador del grupo como si hubiera hecho otra reserva.

### Paso 3: separar las reservas que pasan por MATCH

Pregunta qué parte de las reservas se pagaría dentro de la aplicación y qué parte seguiría siendo manual. Solo así podrás estimar qué volumen podría generar comisión para MATCH.

```text
Volumen procesado por MATCH
= número de reservas pagadas por MATCH × importe promedio por reserva
```

### Paso 4: estimar los ingresos de MATCH

```text
Comisión estimada
= importe elegible de las reservas × porcentaje de comisión

Suscripciones estimadas
= negocios que pagan Pro × precio mensual que pagan

Ingresos estimados de MATCH
= comisiones + suscripciones efectivamente pagadas
```

Separa las pruebas gratis, las promociones de S/ 9.90 y el precio regular de S/ 19.90. Un negocio en prueba aún no es un suscriptor que paga.

### Paso 5: estimar los costos y el dinero disponible

Pide al equipo y a proveedores cotizaciones para procesar pagos, atender devoluciones, desarrollar la aplicación y mantenerla. Incluye también sueldos, ventas, soporte, publicidad, servidores, herramientas y asesoría contable.

El costo de procesar cada pago puede incluir un porcentaje y un importe fijo. Por eso, pregunta cuánto cuesta una operación completa y si una reserva dividida entre varios jugadores genera varios cobros.

Separa dos cosas:

- **Resultado:** cuánto ingresa MATCH y cuánto gasta durante un periodo.
- **Caja:** cuándo entra y sale el dinero de la cuenta de MATCH.

El dinero que corresponde a los negocios no es dinero libre de MATCH. En la proyección de caja, identifica qué importes cobra un proveedor y cuándo los deposita al negocio.

### Paso 6: encontrar el punto de equilibrio

El punto de equilibrio es el nivel de actividad en el que los ingresos alcanzan para cubrir los gastos del periodo.

```text
Lo que deja una reserva para MATCH
= comisión − costos de pago y otros costos asociados a esa reserva
```

Si cada reserva deja S/ 1 después de sus costos y los gastos mensuales de MATCH suman S/ 10,000, harían falta 10,000 reservas con ese margen para cubrirlos, suponiendo que no hubiera otros ingresos. Es solo un ejemplo para explicar la cuenta: los importes deben salir de datos reales.

Si procesar cada reserva cuesta más que la comisión que genera, aumentar las reservas también puede aumentar las pérdidas. Por eso hay que obtener las tarifas del proveedor antes de asumir que una comisión del 5% será rentable.

## 8. Ejemplo simple: cómo leer los números

Los siguientes números son inventados para mostrar cómo funciona el cálculo. **No son resultados, metas ni pronósticos de MATCH.**

Supongamos que 10 clubes tienen una cancha cada uno. Cada cancha registra 50 reservas al mes. La mitad se paga por MATCH y el importe promedio es S/ 100.

| Cuenta | Cálculo | Resultado ilustrativo |
|---|---:|---:|
| Reservas registradas | 10 clubes × 50 | 500 reservas |
| Reservas pagadas por MATCH | 500 × 50% | 250 reservas |
| Volumen pagado por MATCH | 250 × S/ 100 | S/ 25,000 |
| Comisión al 5% | S/ 25,000 × 5% | S/ 1,250 |

Los S/ 25,000 son pagos por alquiler de canchas, no ingresos de MATCH. En este ejemplo, S/ 1,250 sería la comisión antes de descontar los costos de pago y otros gastos.

Si además cuatro clubes pagaran Pro a S/ 19.90, MATCH recibiría S/ 79.60 de suscripciones ese mes, antes de gastos. El total ilustrativo de comisión y suscripciones sería S/ 1,329.60 antes de costos. No se debe llamar utilidad a esa cifra.

## 9. Qué información debe conseguir la analista

El repositorio explica cómo se piensa construir el producto, pero no contiene los datos necesarios para saber si el negocio será rentable. Conviene pedir al equipo:

| Pregunta | Dato que ayudaría a responderla |
|---|---|
| ¿Dónde empieza MATCH? | Ciudad, zonas y fecha tentativa del piloto. |
| ¿Cuántos negocios participarán? | Clubes contactados, interesados y comprometidos. |
| ¿Qué oferta tendrán? | Sedes, canchas, horarios, tarifas y días de operación. |
| ¿Cuánto se cobra por reserva? | Precio promedio y diferencias por horario o tipo de cancha. |
| ¿Cuántas reservas pueden ocurrir? | Reservas actuales de los clubes y horas que suelen quedar libres. |
| ¿Cuántas se pagarían por MATCH? | Porcentaje esperado de reservas dentro y fuera de la aplicación. |
| ¿Cuánto cobra el proveedor de pago? | Cotización, cargos fijos, devoluciones y depósitos. |
| ¿Qué cuesta operar? | Sueldos, soporte, ventas, marketing, desarrollo y servicios digitales. |
| ¿Qué planea cobrar MATCH? | Precio de Pro, duración de promoción y reglas de prueba. |
| ¿Cuánto dinero tiene el proyecto? | Aportes, gastos pagados, compromisos y caja disponible. |

Para cada dato, anota el valor, la unidad, quién lo proporcionó y cuándo. Distingue una cotización de proveedor de una tarifa ya contratada y una opinión de un dato medido.

## 10. Indicadores para revisar durante un piloto

- **Negocios activos:** negocios que tienen una cancha lista y disponible.
- **Reservas pagadas por MATCH:** número de reservas cuyo pago se procesó dentro de la aplicación.
- **Importe promedio:** valor promedio de esas reservas.
- **Ocupación:** horas reservadas divididas entre horas disponibles para alquilar.
- **Repetición:** cuántos jugadores vuelven a reservar después de su primera reserva.
- **Conversión a Pro:** cuántos negocios comienzan a pagar después de probar el plan.
- **Costo por reserva:** costo de procesamiento y atención asociado a una reserva.
- **Devoluciones y fallos:** cantidad e importe de pagos que no terminan como se esperaba.

Los indicadores deben usar periodos y definiciones consistentes. Por ejemplo, no compares una tasa de ocupación que descuenta bloqueos con otra que los cuenta como horas disponibles.

## 11. Decisiones que el equipo necesita tomar

Antes de confiar en una proyección, el equipo debe confirmar:

1. En qué ciudad y con cuántos negocios probará MATCH.
2. Qué funciones incluirá en la primera versión con pagos reales.
3. Qué precio tendrá Pro y cuánto durará la oferta para fundadores.
4. Quién pagará el costo de procesar el cobro.
5. Cuándo MATCH podrá cobrar su comisión: al pagar, al realizarse el servicio o bajo otra regla acordada.
6. Qué sucederá con cancelaciones, devoluciones y reclamos.
7. Cuánto costará captar negocios y jugadores y atenderlos.

## 12. Referencias del proyecto

Estas fuentes internas contienen más detalle y permiten revisar cómo se llegó a este resumen:

- [Modelo de producto](PRODUCT_MODEL.md): usuarios, negocios, roles, planes y precios propuestos.
- [Pruebas del prototipo](DEVELOPMENT_TESTING.md): accesos y datos de demostración.
- [Reservas](src/features/reservations/RESERVATIONS_API.md): estados y reglas previstas para las reservas.
- [Pagos](src/features/payments/PAYMENTS_API.md): comisiones, devoluciones y depósitos propuestos.
- [Suscripciones](src/features/subscriptions/SUBSCRIPTIONS_API.md): planes y límites.
- [Plan de auditoría empresarial](BUSINESS_FLOW_AUDIT_PLAN.md): flujos y validaciones aún pendientes.
- [Pantalla de finanzas](src/features/payments/views/BusinessPaymentsView.tsx) y [sus datos de ejemplo](src/features/payments/data/paymentsPreview.ts).
- [Creación de reservas del jugador](src/features/reservations/views/PlayerReservationCreateView.tsx).
- [Cálculo de estadísticas](src/features/analytics/utils/buildBusinessAnalytics.ts).

Este resumen se preparó leyendo documentación y código del repositorio. No incluye entrevistas, cifras de un piloto, cotizaciones de proveedores ni revisión contable o legal. Usa los datos que entregue el equipo para completar la proyección.
