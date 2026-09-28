# Business subscriptions

La suscripción empresarial pertenece a la organización y es independiente del rol de la membresía.

## Contrato previsto

```http
GET /organizations/:organizationId/subscription
```

La respuesta debe incluir `plan`, `status`, `currentPeriodEndsAt` y capacidades resueltas por el servidor. El cliente no debe autorizar una función únicamente comparando `plan`.

## Capacidades del prototipo

- `basic`: una sede, una cancha, agenda, reservas, bloqueos, finanzas operativas y métricas esenciales de 30 días. Solo el propietario administra la organización.
- `pro`: varias sedes y canchas, acceso para gestores y personal, analítica de 12 meses y comparación consolidada entre sedes.

Los límites se resuelven en `BusinessPlanAccess` y la interfaz los aplica tanto
en los puntos de entrada como en las pantallas de creación. Al reducir un plan
no se borran ni ocultan recursos existentes: se impide crear recursos nuevos
hasta volver a estar dentro del límite o recuperar Pro.

Las capacidades futuras de empleados, automatización, campañas y exportación no se muestran como funcionales hasta que exista implementación real.

## Evolución de Pro

El valor de Pro debe crecer alrededor de resultados operativos, no de bloquear
acciones básicas. El orden previsto es:

1. miembros, roles y alcance por sede;
2. operación consolidada de varias sedes y canchas;
3. analítica accionable sobre ocupación, ingresos y horas libres;
4. exportación y conciliación;
5. precios por franja, promociones y automatizaciones;
6. clientes recurrentes, membresías, ligas, torneos y academias cuando el flujo
   principal de reservas esté validado.

Las pantallas de planes solo deben anunciar capacidades disponibles. Una
capacidad futura puede aparecer como próxima únicamente si se identifica de
forma inequívoca y no participa en la decisión de compra actual.

## Prueba y cambio de plan

- Basic es un plan permanente, no una prueba con vencimiento.
- Una organización nueva podrá recibir 30 días de Pro de prueba.
- Al finalizar la prueba, la organización vuelve a Basic si no contrata Pro.
- Al bajar a Basic no se eliminan recursos ni membresías.
- El propietario elige la sede y cancha que permanecerán operativas.
- Los recursos adicionales dejan de aceptar nuevas reservas.
- Las membresías `manager` y `staff` quedan suspendidas para el modo negocio, pero no se eliminan.

El modo activo de la cuenta no concede ni revoca permisos. Cambiar a modo jugador
oculta la experiencia empresarial, pero conserva la membresía. Al volver al
modo negocio, el acceso efectivo se calcula con la membresía, el rol, el plan,
el alcance asignado y el estado de cada recurso.

## Resolución implementada en el cliente

`getEffectiveBusinessMembership` combina la membresía original con las
capacidades vigentes del plan:

- `owner` permanece habilitado en Basic y Pro;
- `manager` y `staff` requieren `canManageEmployees`;
- si la capacidad no está disponible, el rol original se conserva y el rol
  efectivo pasa a `null` con la restricción `team_requires_pro`;
- un rol efectivo nulo no hereda permisos de lectura ni de escritura;
- las rutas empresariales secundarias redirigen al inicio del negocio, excepto
  la pantalla del plan;
- Inicio, Reservas y Sedes muestran un estado de acceso suspendido;
- Perfil permanece disponible para cambiar de modo, consultar el plan y probar
  escenarios de desarrollo.

Esta resolución adapta la interfaz, pero no reemplaza la autorización del
backend. El servidor deberá resolver y validar los mismos entitlements en cada
endpoint. La gestión real de invitaciones, membresías y alcances sigue pendiente.

## Hipótesis comercial del MVP

Los siguientes valores son hipótesis para validación y no deben codificarse
como reglas permanentes antes de integrar facturación:

- Pro fundador: S/ 9.90 mensuales durante un periodo promocional definido.
- Pro regular de referencia: S/ 19.90 mensuales.
- Prueba Pro: 30 días, una vez por organización.
- Comisión de plataforma inicial: 5% del importe de la reserva.
- Procesamiento de pago: separado y trasladado a costo real, con información clara.
- La comisión es la misma para Basic y Pro durante el MVP.
- Las liquidaciones y depósitos no generan otra comisión de Match.

No se debe prometer una comisión total de 5% mientras el costo del adquirente,
el cargo fijo, IGV, contracargos y reembolsos puedan consumirla. Como alternativa
comercial simple se evaluará una tarifa total de 8% a 10%, únicamente después de
medir ticket promedio y negociar costos de procesamiento.

## Estados

Solo `active` y `trialing` habilitan capacidades Pro. `past_due`, `canceled` y `expired` degradan de forma segura a capacidades Basic sin borrar datos empresariales.

El selector de plan actual existe únicamente en desarrollo y persiste el escenario mock por organización.

TanStack Query administra el ciclo de carga, caché e invalidación. No reemplaza
al origen de datos. Mientras no exista el endpoint real, el gateway de
suscripciones sigue siendo `MockBusinessSubscriptionGateway` con persistencia
local; posteriormente podrá sustituirse por un gateway HTTP sin cambiar las
vistas ni los hooks consumidores.
