# Match — Modelo de usuarios, acceso y planes

## 1. Propósito

Este documento define la dirección funcional para usuarios, negocios, permisos y planes de Match. Es una guía para evolucionar el producto y sus contratos de API; no implica que todas las capacidades descritas ya estén implementadas.

Debe aplicarse junto con `AGENTS.md`, `ARCHITECTURE.md` y los contratos reales del backend cuando estén disponibles.

## 2. Decisión principal

Match será inicialmente **una sola aplicación con dos modos de uso**:

1. `player`: buscar canchas, organizar partidos y realizar reservas.
2. `venue_manager`: administrar negocios, sedes y canchas.

Los modos no son mutuamente excluyentes. Una misma cuenta puede jugar y también administrar una cancha. No se crearán cuentas separadas ni aplicaciones independientes mientras el producto no demuestre una necesidad operativa real.

## 3. Conceptos del dominio

### 3.1 Cuenta

Representa la identidad autenticada de una persona: identificador, correo verificado, nombre visible, modos disponibles y modo activo.

### 3.2 Modo de uso

Configura la experiencia de navegación, pero no concede permisos por sí mismo.

```ts
export type UserMode = "player" | "venue_manager";

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  availableModes: UserMode[];
  activeMode: UserMode;
}
```

`username` es la identidad pública única de la cuenta. Se almacena normalizado y sin el prefijo `@`; la interfaz añade el prefijo al mostrarlo. El correo permanece como dato privado de autenticación y no debe mostrarse en búsquedas públicas de jugadores.

### 3.3 Organización

Representa al negocio que opera una o varias sedes. Las canchas, empleados, suscripciones empresariales, reportes e ingresos pertenecen a una organización, no directamente al usuario autenticado.

Cardinalidad estable del dominio:

```text
Organización 1 ── N Sedes 1 ── N Canchas
```

El modelo de datos siempre admite varias sedes y varias canchas. Los planes
pueden limitar cantidades o habilitar herramientas de gestión avanzada, pero
no deben cambiar esta estructura ni exigir una migración del negocio.

Las sedes definen un horario general opcional. Cada cancha usa
`scheduleMode: "inherit" | "custom"`: el modo heredado consulta el horario
vigente de la sede y el personalizado conserva su propio horario. El horario
heredado no se duplica como fuente de verdad.

Sedes y canchas tienen estado `active | inactive`. Una sede inactiva suspende
operativamente sus canchas sin sobrescribir su estado individual.

### 3.4 Membresía y permiso

Relaciona una cuenta con una organización y define qué puede hacer dentro de ella.

```ts
export type VenueRole = "owner" | "manager" | "staff";

export interface VenueMembership {
  organizationId: string;
  role: VenueRole;
}
```

- `owner`: controla el negocio, facturación y miembros.
- `manager`: gestiona la operación sin transferir propiedad.
- `staff`: tiene acceso limitado a tareas operativas.

Una membresía tiene un solo rol dentro de una organización. `owner` no es un
segundo rol combinado con `manager`: es el nivel superior y hereda las
capacidades operativas necesarias. `manager` representa a una persona de
confianza que administra la operación sin controlar propiedad, miembros ni la
cuenta de depósito. `staff` se limita a tareas operativas asignadas.

Una misma cuenta puede pertenecer a organizaciones distintas con roles
distintos. El rol siempre se resuelve en el contexto de una membresía y nunca
como propiedad global de la cuenta.

`admin` no debe utilizarse como tipo general de usuario. Una futura administración interna de Match debe modelarse como autorización de plataforma separada de los roles de una organización.

Durante el prototipo existe un selector de rol exclusivo para desarrollo. Solo
modifica la membresía mock para revisar variantes de interfaz; no forma parte
del producto, no existe en el gateway HTTP y no representa una autorización
válida del servidor.

### 3.5 Suscripción

Define capacidades comerciales contratadas. No reemplaza roles ni permisos.

- El plan de jugador pertenece a la cuenta.
- El plan empresarial pertenece a la organización.

No se debe usar un único booleano `isPro`, porque no identifica producto, alcance, vigencia ni estado de pago.

## 4. Planes previstos

Los nombres comerciales y beneficios exactos siguen sujetos a validación.

### 4.1 Jugador

```ts
export type PlayerPlan = "free" | "pro";
```

#### Free

- Buscar canchas y horarios.
- Crear o unirse a partidos.
- Reservar y pagar.
- Consultar historial básico.

#### Pro — sujeto a validación

- Menor comisión de servicio.
- Recompensas por recurrencia.
- Promociones acordadas con establecimientos.
- Acceso anticipado a determinados horarios.
- Estadísticas personales ampliadas.
- Condiciones mejoradas para cambios o cancelaciones cuando el establecimiento lo permita.

Match no debe prometer descuentos universales sin definir quién los financia. Se priorizarán beneficios sostenibles: reducción de comisión, recompensas y promociones negociadas.

### 4.2 Negocio

```ts
export type BusinessPlan = "basic" | "pro";
```

#### Basic

- Administrar una sede y una cancha.
- Acceso administrativo exclusivo para el propietario.
- Administrar horarios y disponibilidad.
- Recibir y consultar reservas.
- Bloquear horarios.
- Consultar métricas operativas de los últimos 30 días.

#### Pro — sujeto a validación

- Analítica avanzada.
- Varias sedes y ampliación de canchas por sede.
- Gestión avanzada y reportes consolidados para varias sedes.
- Acceso para empleados.
- Automatización de precios y horarios.
- Promociones y campañas.
- Herramientas para clientes recurrentes.
- Reportes exportables.
- Integraciones y notificaciones avanzadas.
- Opciones adicionales de visibilidad.

Basic es permanente. No debe utilizarse como una prueba temporal encubierta.

La operación local y la publicación en el marketplace son estados distintos. Una organización puede mantener su agenda manual mientras no acepta reservas de jugadores. `marketplaceStatus` usa `local_only | live | paused`: `local_only` es el estado inicial, `live` publica únicamente sedes y canchas activas con ubicación, horario y tarifa válidos, y `paused` detiene reservas online nuevas sin cancelar reservas existentes ni desactivar la agenda local. Recibir reservas online forma parte de Basic porque genera actividad y comisión para Match; no debe bloquearse detrás de Pro.
Una organización nueva podrá recibir una prueba de Pro de 30 días y volver a
Basic sin pérdida de datos cuando termine.

Al bajar de Pro a Basic, el propietario selecciona la sede y la cancha que
seguirán operativas. Las demás dejan de aceptar reservas nuevas, pero sus datos
se conservan. Las membresías de gestores y personal no se eliminan: su acceso
empresarial queda suspendido hasta recuperar Pro.

El permiso efectivo de una operación se calcula como la intersección de:

```text
membresía activa
    + rol
    + capacidades de la suscripción
    + alcance asignado
    + estado del recurso
```

Cambiar a modo jugador solo cambia la experiencia de navegación. No elimina la
membresía ni el rol empresarial. Al volver al modo negocio se recuperan los
permisos que continúen vigentes. El backend nunca debe utilizar `activeMode`
como frontera de autorización.

La visibilidad pagada debe identificarse como promoción o contenido patrocinado. La suscripción no debe manipular silenciosamente resultados orgánicos.

### 4.3 Hipótesis de monetización empresarial

La monetización combina suscripción y reservas. Ninguna cifra se considera
precio definitivo hasta validar disposición de pago, ticket promedio y costos
reales del proveedor de pagos.

Propuesta inicial:

- Basic permanente para reducir la barrera de entrada y generar oferta de canchas.
- Pro fundador a S/ 9.90 mensuales durante una promoción limitada.
- Pro regular de referencia a S/ 19.90 mensuales, sujeto a validación.
- Prueba Pro de 30 días por organización.
- Comisión de plataforma de 5% por reserva pagada, que se confirma cuando el servicio queda realizado.
- Costo de procesamiento separado de la comisión de Match y mostrado con transparencia.
- La comisión es la misma para Basic y Pro durante el MVP.
- Las liquidaciones y depósitos no generan otra comisión de Match.

La comisión se registra inicialmente como pendiente. Un reembolso total la
revierte; una cancelación con penalidad la calcula solo sobre el importe
retenido. Los contracargos se representan como ajustes posteriores. Match no
debe cobrar simultáneamente comisión por reserva y comisión por retiro.

Una comisión total de 5% no es sostenible si Match absorbe procesamiento,
cargos fijos, IGV, fraude, contracargos y reembolsos. Antes de ofrecer una tarifa
todo incluido se debe calcular:

```text
margen por reserva
= comisión de Match
- procesamiento
- impuestos aplicables
- devoluciones y contracargos
- soporte e incentivos
```

Como alternativa simplificada se evaluará una comisión total entre 8% y 10%,
pero no se adoptará sin datos reales. Un porcentaje alto puede desalentar que
las canchas canalicen reservas por Match o incentivar pagos fuera de la app.

Para que Pro justifique su precio deben completarse, en este orden:

1. Gestión real de gestores y personal, con invitaciones, alcance y auditoría.
2. Varias sedes y canchas con reportes consolidados.
3. Analítica accionable: ocupación, ingresos, cancelaciones y horas sin vender.
4. Exportación y conciliación de reservas, comisiones y liquidaciones.
5. Automatizaciones útiles, como precios por franja y reglas de disponibilidad.
6. Herramientas de retención, promociones y clientes recurrentes.

Para que Basic también sea sostenible debe generar reservas procesadas por
Match, mantener bajo el costo de soporte y ofrecer una ruta de actualización
visible cuando el negocio necesite otra cancha, equipo o análisis avanzado.

### 4.4 Evolución competitiva del producto

Match toma como referencia el modelo de plataformas que conectan una aplicación
de jugadores con un sistema operativo para establecimientos. La referencia no
implica copiar interfaces, reglas ni términos comerciales. Match se especializa
en fútbol y en las necesidades operativas y de pago del mercado peruano.

#### Capacidades prioritarias del MVP

1. Disponibilidad real por sede y cancha.
2. Reserva privada con pago completo o dividido entre jugadores.
3. Partidos abiertos que permitan completar cupos sin coordinación manual.
4. Invitaciones por enlace y confirmación individual de participantes.
5. Agenda del negocio sin dobles reservas.
6. Pagos, cancelaciones, reembolsos y liquidaciones conciliables.
7. Recordatorios y cambios de estado relevantes.
8. Gestión Pro de propietarios, gestores y personal.
9. Métricas de ocupación, ingresos, cancelaciones y horas libres.

#### Capacidades que deben fortalecer Pro

1. Consolidación de varias sedes y canchas.
2. Permisos y alcance de empleados por sede.
3. Precios por franja y reglas automáticas para horas de baja demanda.
4. Promociones y campañas medibles.
5. Clientes recurrentes, membresías y beneficios configurados por el negocio.
6. Exportación, conciliación y reportes operativos.
7. Gestión de ligas, torneos, academias y entrenadores cuando exista demanda.

#### Capacidades del jugador para una etapa posterior

- equipos permanentes y convocatorias;
- retos y competiciones entre equipos;
- historial y estadísticas deportivas;
- nivel o ranking con controles contra manipulación;
- descubrimiento de entrenadores y academias;
- recompensas sostenibles financiadas por Match o por establecimientos.

No se implementará una billetera propia durante el primer MVP. Primero deben
resolverse custodia, conciliación, reembolsos, regulación y soporte. Tampoco se
añadirán torneos, ligas o rankings antes de estabilizar reserva, pago y partido
abierto, que constituyen el ciclo principal del marketplace.

## 5. Estado y capacidades

Una suscripción real debe representar producto, plan, estado y vigencia:

```ts
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface Subscription {
  id: string;
  product: "player" | "business";
  plan: PlayerPlan | BusinessPlan;
  status: SubscriptionStatus;
  currentPeriodEndsAt: string | null;
}
```

Cuando las reglas crezcan, la interfaz debe consumir capacidades resueltas por el servidor:

```ts
export interface Entitlement {
  key: string;
  enabled: boolean;
}
```

Esto evita distribuir comparaciones de planes por todas las pantallas.

## 6. Registro y onboarding

El acceso será común para todos:

```text
Correo
  ↓
Código de verificación
  ↓
Perfil básico
  ↓
Selección de experiencia inicial
```

Después de crear el perfil se preguntará: **¿Qué quieres hacer en Match?**

- Buscar y jugar partidos.
- Administrar una cancha.

La selección configura el modo inicial; no crea una restricción permanente. El segundo modo podrá activarse más adelante desde el perfil.

### 6.1 Flujo de jugador

Puede entrar directamente a la experiencia de descubrimiento y reservas.

### 6.2 Flujo de negocio

Continúa con un onboarding empresarial independiente:

1. Datos del negocio.
2. Organización y sedes.
3. Canchas y horarios.
4. Datos necesarios para cobros y liquidaciones.
5. Verificación del responsable cuando corresponda.
6. Selección o confirmación del plan.

La cuenta puede existir aunque el onboarding empresarial esté incompleto. El progreso debe persistirse en el backend.

La experiencia será progresiva: después de guardar el nombre y contacto del
club, el propietario entra al dashboard. Desde su estado vacío agrega la
primera sede y luego la primera cancha. No se debe bloquear el acceso al panel
con un formulario largo.

Al crear la primera cancha termina el alta inicial. Horarios y precio se
presentan después como una tarea contextual del panel y desaparecen del estado
principal cuando se completan; no se mantiene una lista permanente de pasos de
onboarding dentro del dashboard operativo.

Terminología de producto:

- `club`: nombre cercano mostrado al propietario;
- `organization`: entidad interna que representa el negocio;
- `venue` / sede: ubicación física del club;
- `field` / cancha: espacio deportivo reservable dentro de una sede.

## 7. Navegación

Expo Router seguirá siendo el único sistema de navegación. La aplicación podrá mostrar grupos distintos según el modo activo, pero el modo activo no constituye una barrera de seguridad.

Dirección prevista:

```text
app/
├── (player)/
├── (business)/
├── auth/
└── legal/
```

Esta estructura se creará solo cuando existan pantallas reales para ambos modos. No deben añadirse grupos vacíos. Cambiar de modo no debe cerrar la sesión.

En modo negocio, Inicio, Reservas, Canchas y Perfil son destinos principales de
una navegación por tabs. Cada destino utiliza navegación stack para tareas de
detalle, creación o edición. Cerrar sesión pertenece al perfil de la cuenta
porque finaliza la sesión completa; no es una acción de una organización, sede
o cancha.

## 8. Seguridad y autorización

El cliente adapta la interfaz, pero nunca es la autoridad final. El backend debe comprobar en cada operación protegida:

- identidad y sesión vigentes;
- membresía en la organización solicitada;
- rol suficiente;
- suscripción y estado de pago cuando aplique;
- capacidad habilitada;
- propiedad o alcance del recurso.

Reglas obligatorias:

- No confiar en `activeMode` para autorizar operaciones.
- No habilitar funciones únicamente mediante `isPro` en el dispositivo.
- No almacenar datos completos de tarjetas en Match.
- No aceptar identificadores de organización sin comprobar membresía.
- No permitir que un empleado modifique facturación o propiedad.
- Registrar en servidor cambios sensibles de roles, cobros y configuración.

## 9. Propiedad dentro de la arquitectura

Las responsabilidades crecerán por feature cuando exista implementación real:

```text
src/features/auth/          Identidad, sesión y registro básico
src/features/profile/       Perfil personal y selección de modo
src/features/venues/        Organizaciones, sedes y canchas
src/features/reservations/  Reservas compartidas por jugador y negocio
src/features/subscriptions/ Planes, capacidades y estados comerciales
src/features/payments/      Pagos, cobros y liquidaciones
```

No deben crearse carpetas vacías por anticipado. Tampoco se deben mover responsabilidades a `dashboard` solo porque tengan una interfaz administrativa.

Los contratos compartidos entre varias features podrán vivir en `src/types/`. Los DTO específicos de una integración deben permanecer cerca de su servicio.

## 10. Migración desde el prototipo

El contrato actual contiene:

```ts
export type UserRole = "player" | "admin";
```

Este tipo es temporal y no representa el modelo objetivo.

Orden recomendado:

1. Definir el contrato real del backend para cuenta y modos.
2. Reemplazar `UserRole` por modos disponibles y modo activo.
3. Añadir la selección posterior al registro.
4. Crear organizaciones y membresías al iniciar el flujo empresarial.
5. Introducir planes cuando exista facturación o una restricción funcional real.
6. Introducir entitlements cuando las reglas ya no sean triviales.

No añadir repositorios, casos de uso ni sistemas completos de permisos antes de que la funcionalidad los requiera.

## 11. Decisiones abiertas

Antes de implementar monetización se debe validar:

- Precio y periodicidad de Player Pro.
- Fuente económica de descuentos y recompensas.
- Límites exactos de Business Basic.
- Funciones que justifican Business Pro.
- Prueba gratuita y reglas de renovación.
- Comisiones por reserva y procesamiento.
- Política de cancelación y reembolso.
- Requisitos legales y fiscales para liquidar fondos a negocios.
- Verificación necesaria para publicar una cancha.
- Reglas de visibilidad patrocinada.

Hasta resolverlas, las pantallas de planes son prototipos y no compromisos comerciales definitivos.

### Estado del prototipo empresarial

El prototipo implementa una suscripción empresarial separada de los roles. Basic conserva la operación esencial y Pro habilita únicamente capacidades avanzadas ya representadas en la interfaz. El selector de plan del perfil es exclusivo de desarrollo; no representa facturación ni autorización del servidor.

## 12. Regla de evolución

```text
Cuenta única
    ↓
Modos de uso
    ↓
Organizaciones y membresías
    ↓
Roles y autorización del servidor
    ↓
Suscripciones por alcance
    ↓
Capacidades avanzadas
```

La meta es mantener una experiencia simple sin simplificar de forma insegura el dominio interno.
