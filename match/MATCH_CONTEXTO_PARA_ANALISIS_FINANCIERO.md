# MATCH — Guía del proyecto para análisis y proyecciones financieras

**Fecha de revisión:** 28 de septiembre de 2026.  
**Dirigido a:** analista financiera que se incorpora al proyecto.  
**Base:** documentación y código actuales del repositorio, incluidos cambios locales aún no consolidados en Git.

## 1. Qué es MATCH y cómo leer este documento

MATCH es una aplicación móvil para descubrir, reservar y administrar canchas deportivas, con foco de producto en fútbol y el mercado peruano. Conecta a personas que quieren jugar con negocios que alquilan canchas y necesitan organizar su operación.

Combina dos propuestas:

- **Plataforma de reservas:** los jugadores encuentran oferta y solicitan horarios; la visión incluye pagos y organización de partidos.
- **Software de gestión para negocios:** los propietarios administran sedes, canchas, disponibilidad, reservas y métricas desde la misma aplicación.

La hipótesis económica combina comisiones sobre reservas procesadas por MATCH y suscripciones empresariales. Una eventual suscripción de jugador también está contemplada, pero no tiene precio validado.

**El estado actual es un prototipo funcional, no una operación financiera productiva acreditada por este repositorio.** Hay pantallas y lógica operativa, pero las reservas utilizan servicios simulados, las suscripciones no se cobran realmente y las finanzas muestran datos de demostración. No se encontraron en las fuentes revisadas cifras verificadas de clientes, facturación, inversión, costos o tracción comercial.

En este documento se distinguen cuatro niveles:

| Nivel | Qué significa |
|---|---|
| Implementado en prototipo | Existe código o una experiencia utilizable con datos locales o simulados. No equivale a producción. |
| Dirección de producto | Está descrito como funcionamiento objetivo; puede requerir desarrollo. |
| Hipótesis comercial | Precio, comisión o beneficio que debe contrastarse con clientes y costos. |
| Propuesta de análisis | Estructura sugerida aquí para preparar el modelo financiero; no es una decisión aprobada del proyecto. |

El alcance es explicar el proyecto y preparar el trabajo de modelado. No incluye investigación de mercado, tarifas actuales de proveedores ni determinación tributaria. Las cifras ilustrativas no son pronósticos ni cotizaciones.

## 2. Problema que busca resolver y propuesta de valor

Para el jugador, MATCH busca facilitar encontrar una cancha disponible, conocer su precio, reservar y coordinar un partido. Para el negocio, busca centralizar reservas y horarios, reducir conflictos, identificar horas libres y dar visibilidad comercial a su oferta.

Estos beneficios son objetivos por validar con usuarios. El repositorio no demuestra todavía cuánto aumentan la ocupación, cuánto tiempo ahorran o cuánto está dispuesto a pagar un establecimiento.

| Participante | Valor esperado | Evidencia que conviene obtener |
|---|---|---|
| Jugador que organiza | Encontrar y reservar con menos coordinación | Conversión a primera reserva y repetición |
| Jugador participante | Incorporarse a partidos y coordinar su participación | Uso real del futuro flujo de partidos |
| Propietario | Orden operativo, más demanda y mejor visibilidad del negocio | Horas ahorradas, reservas incrementales y disposición de pago |
| Administrador y personal | Agenda compartida y responsabilidades claras | Uso semanal y reducción de conflictos |

La unidad de oferta es una **cancha durante un intervalo de tiempo**. Una cancha registrada sin horario, tarifa o disponibilidad no representa capacidad vendible. Un usuario registrado tampoco equivale a un cliente que reserva o paga.

## 3. Quién usa la aplicación y cómo se organiza el negocio

Una persona tiene una sola cuenta y puede usar dos modos: **jugador** y **negocio**. Cambiar de modo cambia la experiencia, no crea otra identidad ni elimina su relación con una organización.

La estructura empresarial es:

```text
Organización o club
  └─ Una o varias sedes físicas
       └─ Una o varias canchas por sede
            └─ Horarios, tarifas, reservas y bloqueos
```

La suscripción empresarial pertenece a la organización. Por eso, en la hipótesis actual, tres sedes del mismo club no significan automáticamente tres suscripciones.

| Rol | Responsabilidad prevista |
|---|---|
| Propietario | Control del negocio, operación, plan y cuenta de depósito |
| Administrador | Operación y consulta de finanzas; no modifica la cuenta de depósito |
| Personal | Tareas operativas de reservas; sin acceso financiero ni configuración general |

El acceso también depende del plan: en Basic administra el propietario; el acceso empresarial de administradores y personal requiere Pro. La gestión real de invitaciones, asignación de sedes y autorización de servidor sigue pendiente.

**Para contar clientes:** separar cuentas personales, organizaciones, sedes, canchas y organizaciones pagadoras. No sumar jugadores y propietarios como personas diferentes si son la misma cuenta.

## 4. Cómo funcionará la experiencia del jugador

El recorrido objetivo es:

1. Registrarse por correo, verificarlo y completar el perfil.
2. Entrar al modo jugador y explorar canchas.
3. Consultar una sede, sus canchas, disponibilidad y precio.
4. Seleccionar cancha, fecha, hora y duración.
5. Revisar importe y condiciones; pagar mediante un proveedor integrado.
6. Recibir confirmación y consultar la reserva en su historial.
7. Utilizar el servicio o gestionar una cancelación según las condiciones acordadas.

**Lo que existe hoy:** inicio, detalle de sede, creación de reserva, pantalla posterior de confirmación y listado de reservas. En el código revisado, la creación del jugador registra la reserva como pendiente y el pago como pendiente. Llegar a la pantalla de confirmación no acredita un cobro.

**Lo que debe completarse:** pago real, confirmación confiable del proveedor, reglas operativas de cancelación, devoluciones y consistencia entre usuarios y dispositivos.

La dirección de producto también incluye pagos divididos entre jugadores, partidos abiertos para completar cupos e invitaciones por enlace. Son capacidades prioritarias previstas; no deben modelarse como servicios productivos ya disponibles. Equipos permanentes, rankings, ligas, torneos y academias corresponden a una evolución posterior.

## 5. Cómo funciona el lado del negocio

### Alta y preparación

El alta busca ser progresiva: el propietario registra nombre y contacto del club, entra al panel, agrega su primera sede y después su primera cancha. Completa ubicación, horario y tarifa para habilitar la oferta.

Una cancha puede heredar el horario de su sede o tener uno propio. Sedes y canchas pueden estar activas o inactivas; suspender una sede afecta la disponibilidad de sus canchas sin borrar su historial.

### Operación cotidiana

- El panel presenta contexto operativo y reservas que requieren atención.
- La agenda permite consultar reservas por fecha, sede y cancha.
- El negocio puede crear reservas manuales, incluso para clientes sin cuenta MATCH.
- Propietario y administrador pueden bloquear o liberar horarios según sus permisos.
- Las métricas ayudan a revisar reservas, ventas confirmadas, ocupación y horas disponibles.
- Finanzas y liquidaciones representan cómo se consultarán cobros y depósitos cuando exista integración real.

### Operar localmente y recibir reservas online son estados distintos

| Estado | Consecuencia |
|---|---|
| Solo operación local | El negocio utiliza su agenda sin recibir nuevas reservas del marketplace |
| Publicado | Puede recibir reservas online para recursos activos y preparados |
| Pausado | Deja de recibir nuevas reservas online; conserva la agenda y las reservas existentes |

Recibir reservas online está previsto dentro de Basic. Es parte de la captación de oferta y de la futura generación de comisiones.

**Implicación financiera:** no basta con contar negocios registrados. Se necesitan organizaciones activadas, publicadas, con oferta reservable y con transacciones efectivas.

## 6. Reservas, cobros y dinero: conceptos que no deben mezclarse

Una reserva tiene estado operativo —pendiente, confirmada o cancelada— y estado de pago separado —pendiente, pagado, cobro en sede, devolución pendiente o devuelto—.

También tiene un origen:

| Origen | Funcionamiento previsto | Tratamiento en la proyección |
|---|---|---|
| MATCH | Reserva generada en la plataforma y destinada a su flujo de pago | Incluir en la base de comisión solo cuando corresponda según cobro y prestación |
| Manual/local | Reserva registrada por el negocio; cobro gestionado en la sede | No atribuir automáticamente ingreso por comisión a MATCH |

Una reserva manual puede ser una venta del establecimiento y generar valor por uso del software, sin producir una comisión para la plataforma.

El flujo financiero objetivo documentado es:

```text
Jugador paga mediante proveedor
  → se registra el cobro y los cargos pendientes
  → se realiza el servicio
  → se confirma la comisión y el importe liquidable
  → se agrupan movimientos en una liquidación
  → el proveedor deposita el neto al negocio
  → se confirma y concilia el depósito
```

El diseño asigna al proveedor la custodia temporal y ejecución del depósito. MATCH conserva referencias, importes y estados. Esto sigue siendo un diseño a concretar con un proveedor; no prueba que exista un acuerdo operativo.

Reglas propuestas en los contratos del proyecto:

- Un pago pendiente o rechazado no genera comisión.
- El pago registra comisión pendiente; la prestación del servicio la vuelve firme.
- Un reembolso total revierte la comisión MATCH.
- Una cancelación con penalidad aplica comisión solo sobre el importe retenido.
- Un contracargo debe reflejarse como ajuste posterior.
- No se cobra otra comisión MATCH por retirar o liquidar el dinero.

La interfaz actual representa una cancelación pagada como devolución pendiente. No demuestra que el dinero haya sido reembolsado. Aunque el contrato contempla ajustes por contracargos, su gestión avanzada está fuera del primer MVP; hace falta definir cómo se atenderán esas incidencias al operar con dinero real.

## 7. Monetización y planes

### Hipótesis empresariales documentadas

| Concepto | Hipótesis actual | Observación para el modelo |
|---|---|---|
| Basic | Permanente, con operación esencial | Modelar sin ingreso de suscripción como supuesto inicial explícito; confirmar condiciones comerciales |
| Pro fundador | S/ 9.90 al mes | Falta fijar duración y elegibilidad de la promoción |
| Pro regular | S/ 19.90 al mes | Precio de referencia sujeto a validación |
| Prueba Pro | 30 días por organización | Prueba activa no equivale a suscriptor pagador |
| Comisión MATCH | 5% sobre la base elegible de la reserva | Mismo porcentaje previsto para Basic y Pro |
| Procesamiento | Separado, trasladado a costo real | Falta definir proveedor, tarifa, obligado al pago y presentación al cliente |
| Liquidación o depósito | Sin comisión MATCH adicional | Un eventual costo del proveedor debe presupuestarse por separado |
| Tarifa total alternativa | 8%–10%, solo en evaluación | No sumar esta tarifa al 5%; es otra alternativa comercial |

No hay evidencia en lo revisado de facturación real de Pro, contratación de una pasarela ni pruebas de disposición de pago.

### Diferencias de producto

Basic contempla una sede, una cancha, propietario, agenda, reservas, bloqueos y métricas esenciales de 30 días. Pro amplía sedes y canchas, acceso del equipo, análisis y reportes consolidados; el cliente configura 365 días de historia para Pro.

El código actual incluye exportación CSV de reservas conectada a la pantalla de estadísticas y condicionada a Pro. Esto supera algunas descripciones antiguas que la presentan como futura. Es una exportación operativa, no una conciliación bancaria ni contabilidad completa.

Existen capacidades declaradas para automatización, pero una bandera de acceso no demuestra que una automatización comercial esté implementada. Las invitaciones reales de empleados y otras herramientas avanzadas requieren desarrollo.

Al bajar de Pro a Basic, la dirección de producto conserva los datos y plantea elegir una sede y una cancha operativas. Hay descripciones parciales diferentes sobre el tratamiento del exceso de recursos; debe cerrarse y probarse el flujo antes de asumir una experiencia de downgrade comercial completa.

### Otras vías de ingreso

Player Pro contempla beneficios como menor comisión, recompensas o promociones negociadas, pero no tiene precio definido. La visibilidad patrocinada también está prevista como posibilidad identificable para el usuario. No incluir ingresos de estas líneas en el escenario base sin validar oferta, implementación y demanda.

Cualquier descuento debe identificar quién lo financia: MATCH, el establecimiento o ambos. Una recompensa financiada por MATCH reduce su margen; no es un beneficio gratuito para la empresa.

## 8. Estado real y distancia hasta el lanzamiento

| Área | Evidencia actual | Qué falta para considerarla operativa a escala real |
|---|---|---|
| Acceso y modos | Flujos y accesos demo documentados | Validación de identidad y sesiones productivas |
| Sedes y canchas | Gestión en prototipo; adaptador HTTP de alta disponible por configuración | Verificar backend desplegado y comportamiento integrado |
| Reservas | Gateway simulado con persistencia local | Disponibilidad compartida, concurrencia y autorización en servidor |
| Negocio | Panel, agenda, recursos y restricciones de interfaz | Pruebas completas en Android/iOS y operación con datos reales |
| Jugador | Descubrimiento y solicitud de reserva | Auditoría integral y pago real |
| Suscripciones | Planes y capacidades simulados por organización | Contratación, cobro, renovación, impago y cancelación reales |
| Finanzas | Resúmenes, movimientos y liquidaciones de demostración | Registro financiero, proveedor, conciliación y ajustes |
| Cuenta de depósito | Datos enmascarados y estado simulado | Registro y verificación con el proveedor |
| Analítica | Cálculos sobre reservas y exportación CSV | Datos confiables, histórico consistente y definiciones aprobadas |
| Partidos abiertos y pago dividido | Dirección de producto | Completar implementación y validar demanda |

La aplicación usa una base compartida para Android e iOS, con soporte web donde corresponde. El `package.json` revisado declara Expo 57, React Native 0.86 y React 19.2; algunos documentos conservan versiones anteriores. Compartir código no elimina costos de pruebas, distribución y mantenimiento por plataforma.

No se fija una fecha de lanzamiento: el repositorio no contiene evidencia suficiente sobre equipo disponible, presupuesto ni duración de integraciones.

## 9. Qué significan las métricas actuales y sus límites

**Las pantallas del negocio no son el estado de resultados de MATCH.** Sus ventas pertenecen al establecimiento; la plataforma obtendría únicamente sus comisiones y otros ingresos propios.

Hallazgos concretos de la revisión:

1. Finanzas importa resúmenes, movimientos y liquidaciones de un archivo de demostración. Sus cifras no son evidencia de facturación ni de dinero depositado.
2. Los cargos de esos ejemplos no siguen necesariamente el 5% propuesto y agrupan conceptos. No permiten inferir una tarifa real de procesamiento.
3. La analítica suma el importe de reservas confirmadas como «Ventas confirmadas», sin exigir que estén pagadas. Puede incluir cobros en sede y servicios futuros.
4. La ocupación se calcula con minutos reservados confirmados y horarios configurados. El cálculo revisado no descuenta bloqueos y utiliza la configuración disponible, no un histórico completo de cambios de capacidad.
5. El CSV contiene información de reservas y estados, pero no todos los movimientos, cargos y referencias necesarios para una conciliación financiera.

Antes de utilizar estos datos para proyecciones, acordar definiciones de venta, cobro, servicio realizado, reembolso, capacidad y comisión. Para comparar ocupación histórica también habrá que preservar horarios, bloqueos y estados de recursos por periodo.

## 10. Información que la analista necesita solicitar

El repositorio explica el producto; no reemplaza los datos comerciales y financieros del equipo.

| Bloque | Información pendiente | Fuente a solicitar |
|---|---|---|
| Lanzamiento | Ciudad o zona, segmentos, fecha objetivo y alcance inicial | Fundadores |
| Oferta | Clubes contactados, acuerdos, sedes y canchas publicables | Responsable comercial |
| Capacidad | Horarios, bloqueos, duración habitual y ocupación por franja | Negocios piloto |
| Demanda | Jugadores interesados, conversión, frecuencia y retención | Piloto y medición de uso |
| Precio | Tarifa por hora, descuentos, ticket por reserva y estacionalidad | Negocios piloto |
| Canal | Reservas manuales frente a reservas pagadas por MATCH | Operación piloto |
| Pro | Disposición de pago, conversión de prueba, bajas y mezcla fundador/regular | Entrevistas y experimentos comerciales |
| Pagos | Porcentaje, cargo fijo, costo por devolución/depósito, plazos y retenciones | Propuestas formales de proveedores |
| Adquisición | Inversión y horas comerciales por negocio y por jugador | Marketing y ventas |
| Operación | Equipo, remuneraciones, soporte, herramientas e infraestructura | Fundadores y proveedores |
| Caja | Saldo inicial, aportes, gastos incurridos, compromisos y deudas | Registros financieros del proyecto |
| Fiscal y contractual | Entidad que factura, contratos, impuestos y responsabilidades | Asesoría contable/legal con el modelo concreto |

Cada supuesto debería registrar valor, unidad, fuente, fecha, responsable y grado de confianza. Lo desconocido debe quedar marcado «por validar»; usar cero puede ocultar un costo o una obligación.

## 11. Estructura propuesta de la proyección

Se propone un modelo mensual de 24 meses, ajustable al horizonte que acuerde el equipo, con tres escenarios: conservador, base y favorable. Mantener separadas la operación económica de MATCH y la actividad de los establecimientos.

### 11.1 Oferta y demanda

```text
Organizaciones activas al cierre
  = activas al inicio + nuevas activadas − bajas

Horas vendibles
  = horas abiertas de canchas operativas − bloqueos no comercializables

Reservas potenciales por capacidad
  = horas vendibles × ocupación esperada / duración media por reserva

Reservas demandadas
  = clientes reservantes activos × reservas por cliente
```

Usar clientes que efectivamente organizan/reservan, no todos los participantes de un partido, para evitar multiplicar una misma reserva. Limitar las reservas a la capacidad disponible por zona, cancha y franja: el exceso de demanda nocturna no llena automáticamente las horas de la mañana.

Estimar aparte qué proporción termina pagándose por MATCH y cuántas reservas se cancelan, devuelven o no completan el pago.

### 11.2 Volumen transaccionado e ingreso propio

```text
GMV cobrado por MATCH
  = suma de importes de reservas cobrados mediante su proveedor

Base elegible de comisión del mes
  = importes de servicios realizados elegibles
    + penalidades retenidas elegibles
    − reversiones aplicables, sin duplicarlas

Ingreso estimado por comisión
  = base elegible × tasa MATCH

Ingreso estimado por Pro
  = meses de servicio pagado equivalentes × precio efectivo

Ingreso propio modelado
  = comisión + Pro + otras líneas efectivamente validadas
```

GMV es el volumen bruto de reservas procesadas, no la facturación propia de MATCH. Registrar por separado el GMV cobrado, los reembolsos y la base sobre la que corresponde comisión. Una reserva pagada hoy para jugar el próximo mes puede pertenecer a periodos distintos de caja y prestación.

Separar suscriptores en prueba, promoción y tarifa regular. Aplicar conversión al terminar la prueba, bajas por cohorte y eventuales impagos. La clasificación contable y tributaria final deberá definirse con los contratos; estas son relaciones para el modelo de gestión.

### 11.3 Costos

| Grupo | Partidas a presupuestar |
|---|---|
| Desarrollo inicial | Backend, reservas concurrentes, pagos, conciliación, pruebas y publicación |
| Equipo recurrente | Desarrollo, producto, comercial, administración y soporte; incluir trabajo fundador aunque se muestre aparte su desembolso |
| Infraestructura | Servidores, base de datos, almacenamiento, mapas, correo, notificaciones y monitoreo |
| Variables de transacción | Procesamiento, cargos fijos, devoluciones, contracargos y costos de depósito según contrato |
| Adquisición | Publicidad, visitas comerciales, referidos, materiales e incentivos |
| Servicio al negocio | Alta asistida, capacitación, atención e incidencias |
| Administración | Contabilidad, asesoría, herramientas y otros costos generales |

Clasificar cada partida como única o recurrente, fija o variable, y separar gasto económico de fecha de pago. Si se traslada procesamiento al cliente o al negocio, mostrar también cuánto se recupera y quién asume cualquier diferencia.

### 11.4 Margen y punto de equilibrio

```text
Contribución por reserva
  = comisión MATCH
    − costos variables netos asumidos por MATCH

Contribución mensual
  = contribución de reservas + contribución de suscripciones

Resultado operativo modelado
  = contribución mensual − costos fijos

Reservas necesarias para equilibrio
  = (costos fijos − contribución de suscripciones)
    / contribución media positiva por reserva
```

Si la contribución por reserva es negativa, aumentar reservas empeora el resultado. Si las suscripciones ya cubren los costos fijos, el requerimiento residual de reservas es cero. Los impuestos, depreciación y otras partidas deben incorporarse según la estructura que corresponda, sin confundir este cálculo simplificado con utilidad neta.

### 11.5 Caja y fondos del negocio

Proyectar fechas reales de cobro y pago, devoluciones, retenciones del proveedor y depósitos. El dinero destinado a las canchas no debe contarse como caja libre para financiar MATCH. Modelar por separado los fondos administrados por el proveedor y cualquier obligación económica de la plataforma.

Calcular saldo mensual y financiamiento necesario a partir del mayor déficit acumulado, más la reserva operativa que acuerde el equipo. El cociente caja disponible/consumo mensual solo es una aproximación útil si ese consumo es estable.

## 12. Ejemplo numérico exclusivamente ilustrativo

**Supuestos inventados para explicar la mecánica; no son resultados, metas ni estimaciones del proyecto.** Se omiten impuestos y diferencias temporales. Todas las reservas del ejemplo se cobran y se realizan en el mismo mes, sin cancelaciones ni reembolsos.

| Variable | Supuesto |
|---|---:|
| Organizaciones activas | 20 |
| Canchas operativas por organización | 1 |
| Reservas mensuales por cancha, todos los canales | 60 |
| Participación pagada por MATCH | 40% |
| Ticket por reserva | S/ 100 |
| Comisión MATCH | 5% |
| Organizaciones Pro pagadoras a tarifa regular | 5 |

Resultado de ese conjunto de supuestos:

- Reservas totales: 20 × 1 × 60 = **1,200**.
- Reservas pagadas por MATCH: 1,200 × 40% = **480**.
- GMV cobrado y elegible en este ejemplo: 480 × S/ 100 = **S/ 48,000**.
- Comisión MATCH: S/ 48,000 × 5% = **S/ 2,400**.
- Suscripciones: 5 × S/ 19.90 = **S/ 99.50**.
- Ingreso propio modelado antes de costos e impuestos: **S/ 2,499.50**.

El volumen de S/ 48,000 no es ingreso propio de MATCH. Tampoco S/ 2,499.50 es utilidad.

Supongamos además, solo para ilustrar sensibilidad, un procesamiento de **3% + S/ 1 por pago**. En un pago de S/ 100 serían S/ 4. Si MATCH lo absorbiera, de una comisión de S/ 5 quedarían S/ 1 antes de otros costos. Si se descontara del negocio junto con la comisión, este recibiría S/ 91, bajo esos supuestos. Si lo pagara el jugador adicionalmente, cambiarían el precio final y posiblemente la base de procesamiento.

No se ha cotizado esa tarifa. El propósito es mostrar por qué hay que definir quién paga cada cargo. El pago dividido puede generar varios cargos fijos para una misma reserva, por lo que debe modelarse por número de transacciones, no solo por reserva.

## 13. Indicadores que conviene medir desde el piloto

| Indicador | Definición de trabajo |
|---|---|
| Activación de oferta | Negocios con cancha, horario y tarifa listos / negocios dados de alta |
| Oferta publicada | Organizaciones publicadas y horas efectivamente reservables |
| Conversión de reserva | Reservas pagadas / inicios de reserva, con ventana temporal definida |
| Repetición | Clientes que vuelven a reservar en 30/60/90 días por cohorte |
| Participación MATCH | Reservas pagadas por MATCH / reservas totales conocidas del negocio |
| Ticket medio | Importe de reservas / número de reservas del mismo conjunto |
| Ocupación | Horas reservadas / horas vendibles, distinguiendo franja y canal |
| Comisión efectiva | Ingreso neto de comisión / base de volumen definida y consistente |
| Conversión a Pro | Organizaciones que comienzan a pagar / pruebas finalizadas de la misma cohorte |
| Ingreso mensual recurrente | Suscripciones recurrentes normalizadas; excluir pruebas y comisiones variables |
| Bajas de Pro | Pagadores que se dan de baja / pagadores al inicio del periodo |
| Costo de adquisición | Gasto atribuible / nuevos clientes activados, separado para negocios y jugadores |
| Contribución por cliente | Ingreso propio menos costos variables atribuibles |
| Incidencias de pago | Fallos, devoluciones y contracargos por número e importe |
| Calidad de liquidación | Importe y antigüedad de partidas no conciliadas; retrasos de depósito |

No calcular valor de vida del cliente con una retención inventada. Al inicio, usar contribución acumulada observada por cohorte y escenarios explícitos de permanencia.

## 14. Escenarios y riesgos que cambian el resultado

| Factor | Escenario conservador | Escenario favorable a validar |
|---|---|---|
| Activación de negocios | Alta lenta y acompañamiento intensivo | Oferta lista con menos intervención |
| Uso de MATCH para pagar | Mucha agenda manual y pagos externos | Mayor participación de pagos dentro de la plataforma |
| Retención | Reservas esporádicas y abandono | Repetición de grupos y negocios |
| Pro | Baja conversión y promoción prolongada | Conversión sustentada en valor operativo |
| Procesamiento | Cargos fijos altos respecto del ticket | Condiciones compatibles con el margen objetivo |
| Incidencias | Más soporte, devoluciones y conflictos | Operación estable con menos costo por reserva |
| Desarrollo | Integraciones demoradas | Hitos completos y validados antes de escalar |

Riesgos específicos:

- **Oferta y demanda desbalanceadas:** muchos usuarios sin horarios útiles, o muchas canchas sin reservas.
- **Desvío de pagos:** el negocio obtiene al cliente en MATCH y cobra fuera de la app.
- **Basic costoso:** organizaciones que consumen soporte pero no generan comisión ni suscripción.
- **Precio Pro insuficiente:** ingresos bajos frente al costo de atención y mantenimiento.
- **Beneficios sin financiación:** promociones o recompensas que absorben el margen.
- **Datos aparentes:** confundir valores demo, confirmaciones o ventas del negocio con ingresos cobrados por MATCH.
- **Riesgo operativo:** doble reserva, pago sin confirmación o depósito fallido que requiere resolución.
- **Estacionalidad:** clima, feriados, calendario y preferencias horarias; debe medirse por zona.

No fijar probabilidades ni porcentajes de escenario sin evidencia. Hacer sensibilidad de ticket, participación de pagos MATCH, comisión, conversión a Pro y costo por pago ayuda a identificar qué supuestos dominan el resultado.

## 15. Decisiones prioritarias para fundadores y analista

1. Definir ciudad/zona piloto, segmento de canchas y criterios de éxito.
2. Delimitar el primer lanzamiento: reserva, pago, agenda y liquidación; decidir cuándo entran pago dividido y partidos abiertos.
3. Confirmar precios, impuestos incluidos o excluidos, duración de promoción y reglas de prueba Pro.
4. Definir quién paga procesamiento, devoluciones y costos extraordinarios.
5. Acordar cancelaciones, penalidades, ausencia del jugador y momento de liberación de fondos.
6. Obtener propuestas de proveedores y verificar compatibilidad con el flujo de marketplace.
7. Validar disposición de pago y valor tangible de Pro con negocios reales.
8. Presupuestar implementación pendiente, operación y captación antes de estimar rentabilidad.
9. Instrumentar eventos y registros que permitan medir el piloto y conciliar dinero.

No se prevé una billetera propia para el primer MVP. Tampoco debe asumirse como disponible el financiamiento del negocio con saldos de jugadores o canchas.

## 16. Entregables propuestos para el trabajo financiero

La analista puede convertir este contexto en:

1. **Registro de supuestos:** dato, fuente, responsable, fecha y confianza.
2. **Modelo mensual:** oferta, demanda, reservas, ingreso propio, costos, resultado y caja.
3. **Economía por reserva y organización:** margen, costo de atención y recuperación de adquisición.
4. **Tres escenarios y sensibilidades:** con explicación de los supuestos que cambian.
5. **Necesidad de financiamiento:** monto, fechas y hitos que permite completar.
6. **Tablero de piloto:** métricas mínimas para actualizar el modelo con evidencia.
7. **Lista de decisiones:** precio, comisión, promociones y alcance, cada una con impacto económico.

El primer objetivo práctico es determinar qué combinación de negocios activos, reservas pagadas por MATCH y suscripciones sostiene la operación, y cuánto cuesta llegar a ella.

## 17. Fuentes internas y alcance de la revisión

Las siguientes referencias permiten verificar el contenido sin necesidad de leer todo el código:

| Fuente | Qué respalda |
|---|---|
| [Modelo de producto](PRODUCT_MODEL.md) | Usuarios, organizaciones, roles, planes, hipótesis comerciales y visión |
| [Pruebas del prototipo](DEVELOPMENT_TESTING.md) | Datos demo, persistencia local y validación pendiente |
| [Contrato de reservas](src/features/reservations/RESERVATIONS_API.md) | Origen, estados, cancelaciones y responsabilidades de servidor |
| [Contrato de pagos](src/features/payments/PAYMENTS_API.md) | Comisión, procesamiento, liquidaciones y cuenta de destino |
| [Contrato de suscripciones](src/features/subscriptions/SUBSCRIPTIONS_API.md) | Alcance de planes, prueba y límites actuales |
| [Creación de reserva del jugador](src/features/reservations/views/PlayerReservationCreateView.tsx) | Reserva y pago inicialmente pendientes |
| [Finanzas del negocio](src/features/payments/views/BusinessPaymentsView.tsx) y [datos de ejemplo](src/features/payments/data/paymentsPreview.ts) | Origen simulado de resúmenes, movimientos y liquidaciones |
| [Cálculo de analítica](src/features/analytics/utils/buildBusinessAnalytics.ts) | Ventas confirmadas, ocupación y canales |
| [Exportación CSV](src/features/analytics/services/exportAnalyticsCsv.ts) y [pantalla de estadísticas](src/features/analytics/views/BusinessAnalyticsView.tsx) | Exportación operativa implementada |
| [Capacidades del plan](src/features/subscriptions/utils/getBusinessPlanAccess.ts) | Límites y acceso del prototipo |
| [Gateway de reservas](src/features/reservations/services/index.ts), [suscripciones](src/features/subscriptions/services/index.ts) y [cuenta de depósito](src/features/payments/services/index.ts) | Uso de implementaciones simuladas |
| [Gateway empresarial](src/features/venues/services/index.ts) | Selección entre mock y HTTP según configuración |
| [Plan de auditoría](BUSINESS_FLOW_AUDIT_PLAN.md) | Validaciones empresariales y pruebas manuales pendientes |
| [Dependencias declaradas](package.json) | Plataforma técnica actual |

La revisión fue documental y de código localizado. El índice estructural reportó metadatos cambiados; las conclusiones materiales se contrastaron con los archivos actuales. No se ejecutaron recorridos en dispositivos, pagos, despliegues ni comprobaciones de un backend externo. Este documento no certifica el funcionamiento productivo ni sustituye datos reales de un piloto.
