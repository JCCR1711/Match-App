# MATCH: contexto del proyecto y análisis financiero

**Audiencia:** análisis financiero y planificación del proyecto
**Actualizado:** 28 de septiembre de 2026

## 1. Descripción del proyecto

MATCH es una aplicación móvil que conecta a jugadores con negocios que alquilan canchas. Los jugadores buscan y reservan horarios; los negocios publican su oferta y administran sedes, canchas, disponibilidad y reservas.

La aplicación conecta dos grupos:

- **Jugadores**, que buscan una cancha, eligen un horario y quieren reservar.
- **Negocios**, que publican sus canchas, administran horarios y atienden reservas.

MATCH plantea dos fuentes principales de ingresos: una comisión sobre determinadas reservas pagadas en la aplicación y una suscripción mensual avanzada para negocios.

**Situación actual:** el proyecto cuenta con un prototipo funcional que permite revisar pantallas y flujos con datos de demostración. El código revisado no acredita pagos, suscripciones, depósitos ni ventas reales. Tampoco contiene cifras verificadas de clientes, costos o ingresos. Este documento describe el modelo propuesto y los datos necesarios para proyectarlo; no presenta resultados reales.

## 2. Modelo operativo

Una persona puede usar la misma cuenta para jugar y administrar un negocio. La aplicación ofrece ambos modos y permite alternar entre ellos.

Un negocio se organiza así:

```text
Negocio o club
  └── Una o varias sedes
       └── Una o varias canchas
            └── Horarios, precios, reservas y bloqueos
```

Por ejemplo, un club podría operar dos sedes con tres canchas en cada una. La propuesta asigna la suscripción a la organización del club, no a cada cancha por separado.

Hay tres tipos de acceso previstos:

| Persona | Qué haría en MATCH |
|---|---|
| Propietario | Administra el negocio, el plan y la cuenta donde se depositan los fondos. |
| Administrador | Ayuda con la operación y puede consultar las finanzas. |
| Personal | Ayuda con tareas de reservas; no tiene acceso a las finanzas del negocio. |

El proyecto aún debe integrar las invitaciones y los permisos con el servidor.

## 3. Flujos de uso

### El jugador

El jugador abre MATCH, busca una sede, revisa las canchas y horarios, elige la duración y solicita una reserva. En la versión completa, pagará dentro de la aplicación y recibirá la confirmación. Luego podrá consultar sus reservas y solicitar una cancelación según las condiciones del negocio.

La aplicación ya incluye pantallas de búsqueda y reserva. El código revisado crea la reserva con el pago pendiente; la pantalla posterior no confirma que MATCH haya recibido el dinero. El equipo aún debe integrar los cobros y definir cómo procesará cancelaciones y devoluciones.

La visión también contempla partidos abiertos y pagos divididos entre jugadores. El equipo aún debe implementar y validar esas funciones; por tanto, no debe contarlas como actividad comercial disponible.

### El negocio

El propietario registra el club, agrega una sede y crea una cancha. Luego configura su ubicación, horario y precio. Con esos datos, administra la agenda: revisa reservas, registra las que recibe directamente y bloquea los horarios en que no alquilará la cancha.

Una reserva que llega por MATCH y una que el negocio apunta manualmente son distintas:

| Tipo de reserva | Quién consigue o registra al jugador | ¿MATCH cobraría comisión? |
|---|---|---|
| Reserva de MATCH | El jugador encuentra y solicita la cancha en MATCH. | La propuesta es cobrarla si se procesa y cumple las condiciones acordadas. |
| Reserva manual | El negocio la registra porque la recibió por su cuenta. | No necesariamente. El negocio puede cobrar directamente al jugador. |

Una reserva manual puede generar una venta para el club sin generar ingresos para MATCH.

## 4. Flujo financiero e ingresos

Hay tres cantidades que conviene mantener separadas:

1. **Venta del negocio:** el importe que el jugador paga por alquilar la cancha.
2. **Volumen procesado por MATCH:** el importe de las reservas que pasan por el cobro de la aplicación.
3. **Ingreso de MATCH:** la comisión que le corresponde a la plataforma y los pagos de suscripciones que efectivamente reciba.

El volumen procesado por MATCH **no es lo mismo que el ingreso de MATCH**. Si una persona paga S/ 100 por una cancha, el negocio es quien presta el servicio. MATCH solo registraría como ingreso propio la comisión que se haya acordado, más los ingresos por suscripción que correspondan.

El flujo financiero propuesto es:

```text
El jugador paga
  → se registra el cobro de la reserva
  → se realiza el partido
  → se calcula cuánto corresponde a MATCH y al negocio
  → se prepara el depósito al negocio
```

Un proveedor de pagos procesaría el cobro y el depósito al negocio. MATCH conservaría los importes y referencias de cada operación, sin almacenar los datos completos de la tarjeta. El proyecto aún no conecta este flujo a un proveedor real.

La propuesta aplica una sola comisión MATCH por reserva; el depósito del saldo al negocio no generaría otra comisión de MATCH. Las devoluciones, cancelaciones con penalidad y disputas pueden modificar los importes. El equipo debe definir cómo las resolverá antes de operar.

## 5. Modelo de ingresos

### Comisión por reservas

La propuesta inicial usa una comisión de **5%** sobre el importe elegible de una reserva. Por ejemplo, con una reserva de S/ 100, una comisión del 5% equivaldría a S/ 5 antes de considerar los costos de procesar el pago.

Ese porcentaje es una **hipótesis**, no una tarifa vigente. El equipo debe confirmar qué pagos generan comisión, quién asume el costo del proveedor y cómo trata las devoluciones y cancelaciones. El contrato previsto deja la comisión pendiente hasta que se realice el servicio.

El proyecto también plantea evaluar una tarifa total de 8% a 10%. El equipo debe tratarla como alternativa al 5%, no sumarla a esa comisión.

### Suscripción de negocios

El producto contempla dos planes:

| Plan | Qué incluye la propuesta | Precio documentado |
|---|---|---:|
| Basic | Herramientas esenciales para administrar una sede, una cancha, reservas y horarios. | Sin precio confirmado; se plantea como plan permanente. |
| Pro | Más sedes y canchas, acceso del equipo y herramientas avanzadas de análisis. | S/ 19.90 al mes como precio de referencia. |

La propuesta también incluye un precio promocional de **S/ 9.90 al mes** para negocios fundadores y una prueba Pro de 30 días. El equipo debe definir la duración de la promoción y sus condiciones de acceso.

El prototipo incluye pantallas de planes, pero MATCH todavía no cobra suscripciones. Basic reduce la barrera para que un negocio publique su oferta. MATCH podría generar comisiones si esas canchas reciben reservas pagadas mediante la plataforma.

### Posibles ingresos futuros

El proyecto también menciona un plan Pro para jugadores y espacios promocionados para negocios. Como el equipo aún no confirma sus precios y condiciones, exclúyelos de la proyección principal hasta validarlos.

## 6. Estado actual del producto

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

La aplicación muestra cifras de ejemplo para probar las pantallas. No uses esas cifras como historial financiero de MATCH ni de un negocio real.

Una «reserva confirmada» no necesariamente equivale a dinero cobrado. Algunas estadísticas suman el importe de las reservas confirmadas sin verificar el pago. Antes de proyectar con datos de uso, acuerda con el equipo qué considera venta, cobro, servicio realizado y devolución.

## 7. Método para preparar la proyección financiera

Proyecta cada mes por separado y prepara tres escenarios: **conservador**, **base** y **favorable**. Registra la fuente de cada cifra. Marca como pendiente cualquier dato que el equipo aún no conozca y evita presentarlo como un hecho.

### 7.1 Estimar los negocios activos

Cuenta los negocios que pueden recibir reservas, no solo los que completaron el registro. Define con el equipo cuándo un negocio está activo; por ejemplo, cuando tiene al menos una cancha, horario y precio configurados.

```text
Negocios al final del mes
= negocios al inicio + negocios nuevos activados − negocios que dejan de usar MATCH
```

### 7.2 Estimar la capacidad y las reservas

Para cada cancha, reúne sus horas de operación, las franjas con demanda, la duración habitual de una reserva y la ocupación observada o estimada.

```text
Horas disponibles para alquilar
= horas abiertas − horas bloqueadas o fuera de servicio
```

No supongas que el negocio vende todas las horas disponibles. Separa la ocupación por franja, ya que las tardes y noches pueden tener más demanda que las mañanas. Cuenta una reserva por horario reservado, aunque participen varios jugadores.

### 7.3 Estimar las reservas procesadas por MATCH

Estima qué proporción de las reservas se pagará en la aplicación y cuál seguirá siendo manual. Esta proporción determina qué volumen podría generar comisión para MATCH.

```text
Volumen procesado por MATCH
= número de reservas pagadas por MATCH × importe promedio por reserva
```

### 7.4 Estimar los ingresos de MATCH

```text
Comisión estimada
= importe elegible de las reservas × porcentaje de comisión

Suscripciones estimadas
= negocios que pagan Pro × precio mensual que pagan

Ingresos estimados de MATCH
= comisiones + suscripciones efectivamente pagadas
```

Separa las pruebas gratis, las promociones de S/ 9.90 y el precio regular de S/ 19.90. Un negocio en prueba aún no es un suscriptor que paga.

### 7.5 Estimar los costos y la caja

Solicita al equipo y a los proveedores cotizaciones para procesar pagos, atender devoluciones, desarrollar la aplicación y mantenerla. Incluye sueldos, ventas, soporte, publicidad, servidores, herramientas y asesoría contable.

El proveedor puede cobrar un porcentaje y un importe fijo por cada pago. Confirma el costo total de una operación y si dividir una reserva entre varios jugadores genera varios cargos fijos.

Separa dos cosas:

- **Resultado:** cuánto ingresa MATCH y cuánto gasta durante un periodo.
- **Caja:** cuándo entra y sale el dinero de la cuenta de MATCH.

El dinero que corresponde a los negocios no es caja disponible para MATCH. En la proyección, registra qué importes recibe el proveedor y cuándo los deposita a cada negocio.

### 7.6 Calcular el punto de equilibrio

El punto de equilibrio indica el nivel de actividad en el que los ingresos cubren los gastos del periodo.

```text
Lo que deja una reserva para MATCH
= comisión − costos de pago y otros costos asociados a esa reserva
```

Por ejemplo, si cada reserva aporta S/ 1 después de sus costos y MATCH incurre en S/ 10,000 de gastos mensuales, necesitaría 10,000 reservas para cubrirlos, siempre que no tenga otros ingresos. Los importes de este ejemplo son ilustrativos; reemplázalos por datos verificados.

Si procesar cada reserva cuesta más que la comisión que genera, aumentar el volumen también aumentaría las pérdidas. Obtén las tarifas del proveedor antes de concluir que la comisión del 5% deja margen.

## 8. Ejemplo ilustrativo

Los siguientes supuestos son ilustrativos. **No representan resultados, metas ni pronósticos de MATCH.**

Supón que 10 clubes tienen una cancha cada uno y cada cancha registra 50 reservas al mes. Si la mitad se paga mediante MATCH y el importe promedio es S/ 100, el cálculo sería:

| Cuenta | Cálculo | Resultado ilustrativo |
|---|---:|---:|
| Reservas registradas | 10 clubes × 50 | 500 reservas |
| Reservas pagadas por MATCH | 500 × 50% | 250 reservas |
| Volumen pagado por MATCH | 250 × S/ 100 | S/ 25,000 |
| Comisión al 5% | S/ 25,000 × 5% | S/ 1,250 |

Los S/ 25,000 corresponden al importe de los alquileres procesados, no a ingresos de MATCH. La comisión ilustrativa de S/ 1,250 todavía debe cubrir los costos de procesamiento y otros gastos.

Si cuatro clubes pagaran Pro a S/ 19.90, MATCH recibiría S/ 79.60 en suscripciones ese mes, antes de gastos. La suma de comisiones y suscripciones sería S/ 1,329.60 antes de costos. Esa suma no representa utilidad.

## 9. Información necesaria para completar el modelo

El repositorio describe el producto, pero no contiene datos suficientes para determinar su rentabilidad. Solicita al equipo la siguiente información:

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

Para cada dato, registra el valor, la unidad, la fuente y la fecha. Distingue una cotización de una tarifa contratada y una opinión de un dato medido.

## 10. Indicadores del piloto

- **Negocios activos:** negocios que tienen una cancha lista y disponible.
- **Reservas pagadas por MATCH:** número de reservas cuyo pago se procesó dentro de la aplicación.
- **Importe promedio:** valor promedio de esas reservas.
- **Ocupación:** horas reservadas divididas entre horas disponibles para alquilar.
- **Repetición:** cuántos jugadores vuelven a reservar después de su primera reserva.
- **Conversión a Pro:** cuántos negocios comienzan a pagar después de probar el plan.
- **Costo por reserva:** costo de procesamiento y atención asociado a una reserva.
- **Devoluciones y fallos:** cantidad e importe de pagos que no terminan como se esperaba.

Usa periodos y definiciones consistentes. Por ejemplo, no compares una tasa de ocupación que resta los bloqueos con otra que incluye esas horas como disponibles.

## 11. Decisiones pendientes

Antes de usar la proyección para tomar decisiones, confirma con el equipo:

1. En qué ciudad y con cuántos negocios probará MATCH.
2. Qué funciones incluirá en la primera versión con pagos reales.
3. Qué precio tendrá Pro y cuánto durará la oferta para fundadores.
4. Quién pagará el costo de procesar el cobro.
5. Cuándo MATCH podrá cobrar su comisión: al pagar, al realizarse el servicio o bajo otra regla acordada.
6. Qué sucederá con cancelaciones, devoluciones y reclamos.
7. Cuánto costará captar negocios y jugadores y atenderlos.

## 12. Fuentes del proyecto

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

Este resumen se basa en la documentación y el código del repositorio. No incluye entrevistas, resultados de un piloto, cotizaciones de proveedores ni una revisión contable o legal. Completa la proyección con datos que el equipo pueda verificar.
