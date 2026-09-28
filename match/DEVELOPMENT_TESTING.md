# Pruebas del prototipo

Este documento describe los accesos, datos mock y herramientas disponibles
durante el desarrollo local de Match. Ninguna de estas facilidades constituye
un contrato de autenticacion o autorizacion para produccion.

## Accesos demo

La pantalla de bienvenida ofrece dos accesos directos sin contrasena:

| Experiencia | Usuario | Correo simulado | Identificador |
|---|---|---|---|
| Jugador | `@josue17` | `jugador@match.demo` | `mock-player-1` |
| Negocio | `@josue_negocio` | `negocio@match.demo` | `mock-venue-owner-1` |

El flujo tradicional por correo acepta:

```text
Correo: demo@match.app
Codigo: 123456
```

Ese flujo representa una cuenta de jugador. Los accesos directos existen solo
en desarrollo y no deben aparecer como autenticacion valida en produccion.

## Roles del negocio

La cuenta demo de negocio pertenece a `Match Arena`. En desarrollo, Perfil
muestra el control `Rol de prueba` para alternar la membresia actual:

| Rol interno | Etiqueta | Alcance financiero actual |
|---|---|---|
| `owner` | Propietario | Consulta finanzas y liquidaciones; administra la cuenta de deposito |
| `manager` | Administrador | Consulta finanzas y liquidaciones; no administra la cuenta de deposito |
| `staff` | Personal | No accede a informacion financiera |

El cambio se guarda en el borrador mock del negocio y las pantallas vuelven a
resolver sus capacidades cuando recuperan el foco. El selector se renderiza
solo con `__DEV__`; el gateway HTTP no implementa esta operacion y el mock la
rechaza fuera de desarrollo.

La Home muestra el rol como contexto secundario sobre el nombre del club cuando
el header esta expandido. Al hacer scroll desaparece y queda solo el nombre del
club, evitando repetir la etiqueta en el estado compacto. Perfil conserva el
rol como dato permanente. Las cards, tabs y metricas no repiten esta etiqueta;
las pantallas sensibles expresan la diferencia mediante capacidades y estados
de acceso.

Esta herramienta sirve para revisar variantes de interfaz. No reemplaza la
autorizacion del servidor, que debe validar identidad, organizacion, membresia
y capacidad en cada operacion protegida.

## Escenarios de API de reservas

En desarrollo, Perfil muestra `API de reservas`. El selector cambia el
comportamiento del gateway mock e invalida la consulta de TanStack Query para
reflejar el resultado sin reiniciar la app:

| Escenario | Comportamiento |
|---|---|
| Normal | Devuelve el snapshot persistido |
| Carga lenta | Retrasa la respuesta 2.8 segundos |
| Agenda vacia | Aisla un snapshot vacio y permite crear reservas o bloqueos visibles |
| Sin conexion | Simula un fallo de red |
| Error 500 | Simula indisponibilidad del servicio |
| Conflicto 409 | Las lecturas funcionan y las mutaciones fallan por conflicto |
| Sesion 401 | Simula una sesion expirada en el limite de reservas |

El escenario se guarda en AsyncStorage y solo existe en el gateway mock. Antes
de continuar una prueba normal conviene devolver el selector a `Normal`.
Al entrar en `Agenda vacia`, el gateway conserva una copia del snapshot normal.
Las operaciones realizadas dentro de ese escenario se muestran de inmediato,
pero se descartan al cambiar de escenario y se restaura la copia original.

## Catalogo empresarial demo

Los recursos iniciales usan identificadores estables para que Home, Agenda,
Pendientes, detalle de cancha y Finanzas compartan las mismas relaciones:

| Sede | Cancha | Formato |
|---|---|---|
| Sede San Juan | Cancha Principal | Futbol 7 |
| Sede Surco | Cancha Norte | Futbol 5 |
| Sede Miraflores | Cancha Terraza | Futbol 7 |
| Sede La Molina | Sin cancha inicial | - |

Fuentes de verdad del prototipo:

```text
src/features/venues/data/businessDemoVenues.ts
src/features/reservations/data/reservationsPreview.ts
src/features/reservations/services/MockReservationsStore.ts
src/features/venues/services/MockBusinessDraftStore.ts
```

Las reservas empresariales se seleccionan por `fieldId`; una pantalla no debe
inventar canchas a partir de reservas huerfanas. Las vistas empresariales deben
filtrar reservas y bloqueos con las canchas pertenecientes a la organizacion.

`BUSINESS_DEMO_VERSION` restablece una sola vez el catalogo de la cuenta demo
cuando cambia la estructura de sus sedes o canchas. Despues de esa migracion,
las altas y ediciones manuales vuelven a persistir con normalidad.

`RESERVATIONS_PREVIEW_VERSION` permite renovar los seeds al cambiar su
contrato, conservando registros creados manualmente que no pertenezcan al seed
actual.

## Persistencia local

- Sesion demo: Secure Store, clave `match.mock-auth.session`.
- Borrador empresarial: AsyncStorage, prefijo
  `match.mock-business.draft.` seguido del identificador de cuenta.
- Version del catalogo demo: AsyncStorage, prefijo
  `match.mock-business.draft-version.` seguido del identificador de cuenta.
- Reservas y bloqueos: AsyncStorage, prefijo `match:reservations:v2:` seguido
  del identificador de organizacion. La clave global `match:reservations:v1`
  se conserva unicamente como origen de migracion para instalaciones previas.
- Cuenta de deposito: AsyncStorage, prefijo
  `match.mock-payout-account.` seguido del identificador de organizacion. El
  mock guarda solo metadatos y ultimos cuatro digitos.

Cambiar de rol no crea otra cuenta ni otra organizacion. Solo modifica la
membresia de prueba de la organizacion actual.

## Verificacion minima

```bash
npm.cmd run typecheck
npm.cmd run lint
```

En PowerShell, usar los ejecutables `.cmd` evita que la politica local de
ejecucion bloquee `npm.ps1`. En terminales que no sean PowerShell, los mismos
checks pueden ejecutarse con `npm run typecheck` y `npm run lint`.

Estado verificado localmente el 15 de septiembre de 2026:

- `npm.cmd run typecheck`: aprobado.
- `npm.cmd run lint`: aprobado.
- `npx.cmd expo-doctor`: aprobado, sin incidencias reportadas.

La configuracion instalada usa Expo 57, React Native 0.86 y React 19.2. La
validacion estatica no sustituye la prueba de arranque ni las pruebas manuales
en dispositivo, en especial tras cambios de Expo o Metro.

Recorrido manual recomendado:

1. Entrar como negocio.
2. Abrir Perfil y seleccionar cada rol.
3. Volver a Home y comprobar la visibilidad de Finanzas.
4. Abrir Canchas, entrar a Cancha Principal y verificar ingresos y reservas.
5. Abrir Agenda y Pendientes y comprobar que muestran las mismas reservas.
6. Como Propietario, abrir Finanzas, cambiar la cuenta de deposito y comprobar
   que el estado pasa a `En verificacion`.
7. Como Administrador, comprobar que la cuenta es de solo lectura; como
   Personal, comprobar que Finanzas permanece restringida.

## Cierre manual de negocio

Realizar este bloque en Android y en iOS antes de considerar cerrada la
auditoria empresarial:

1. Iniciar la app y comprobar que el splash termina en la experiencia correcta
   para una sesion nueva, una sesion de jugador y una sesion de negocio.
2. Entrar como negocio y completar el recorrido de verificacion anterior.
3. Desde Home abrir Pendientes, una reserva y Agenda; confirmar que conserva
   fecha, sede y cancha al regresar.
4. Crear, editar y desactivar una sede o cancha; salir de un formulario con
   cambios sin guardar y comprobar que aparece la confirmacion.
5. En Perfil alternar `owner`, `manager` y `staff`; comprobar las restricciones
   de Finanzas, planes y cuenta de deposito.
6. En Perfil alternar los escenarios de API de reservas `Carga lenta`, `Sin
   conexion`, `Error 500`, `Conflicto 409` y `Sesion 401`; verificar skeleton,
   mensaje de error, reintento y que no se duplican acciones.
7. Revisar gesto atras de Android, gesto de cierre de iOS, teclado visible y
   contraste de la barra de estado sobre las pantallas oscuras.

Registrar la fecha, plataforma y cualquier hallazgo en
`BUSINESS_FLOW_AUDIT_PLAN.md`; las pruebas manuales no se han ejecutado desde
este entorno.
