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

`admin` no debe utilizarse como tipo general de usuario. Una futura administración interna de Match debe modelarse como autorización de plataforma separada de los roles de una organización.

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

- Registrar y configurar canchas.
- Administrar horarios y disponibilidad.
- Recibir y consultar reservas.
- Bloquear horarios.
- Consultar métricas operativas básicas.

#### Pro — sujeto a validación

- Analítica avanzada.
- Gestión avanzada y reportes consolidados para varias sedes.
- Acceso para empleados.
- Automatización de precios y horarios.
- Promociones y campañas.
- Herramientas para clientes recurrentes.
- Reportes exportables.
- Integraciones y notificaciones avanzadas.
- Opciones adicionales de visibilidad.

La visibilidad pagada debe identificarse como promoción o contenido patrocinado. La suscripción no debe manipular silenciosamente resultados orgánicos.

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
