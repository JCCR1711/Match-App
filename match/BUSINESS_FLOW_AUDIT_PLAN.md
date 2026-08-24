# Match - Plan de auditoria y mejora de flujos de negocio

## 1. Proposito

Este documento consolida el plan de analisis, validacion y resolucion de los
flujos del modo negocio de Match.

Su objetivo es evitar decisiones aisladas por pantalla y asegurar que cada
recorrido funcione de extremo a extremo con:

- navegacion predecible;
- continuidad de contexto;
- datos consistentes;
- acciones claras;
- estados de carga, vacio y error;
- permisos correctos;
- una experiencia coherente en Android y iOS.

Este plan complementa a:

- `PRODUCT_MODEL.md`, que define cuentas, modos, organizaciones y permisos;
- `ARCHITECTURE.md`, que define propiedad y ubicacion del codigo;
- `AGENTS.md`, que define las reglas generales de implementacion.

## 2. Principios de trabajo

1. Auditar recorridos completos, no pantallas aisladas.
2. Corregir primero comportamiento y continuidad; despues, presentacion.
3. Mantener Expo Router como unico sistema de navegacion.
4. Conservar la propiedad por feature.
5. Reutilizar componentes solo cuando exista una responsabilidad compartida.
6. No introducir capas, dependencias o estado global sin una necesidad real.
7. No considerar `activeMode` ni la interfaz como barreras de autorizacion.
8. Validar en dispositivos Android e iOS, no solo con TypeScript.
9. Cada cambio debe tener un criterio observable de aceptacion.
10. Los datos mock deben simular tambien errores, vacios y casos limite.

## 3. Alcance funcional

La auditoria cubre seis recorridos principales.

### 3.1 Entrada y activacion del modo negocio

- cambio entre modo jugador y modo negocio;
- negocio nuevo con onboarding incompleto;
- creacion progresiva de club, sede y primera cancha;
- regreso al dashboard despues de cada tarea;
- persistencia y recuperacion del progreso;
- acceso posterior a funciones operativas.

### 3.2 Home de negocio

- resumen de ingresos y ocupacion;
- reservas pendientes;
- agenda de hoy;
- accesos a pagos, liquidaciones y analiticas;
- listado de sedes y canchas;
- tareas contextuales de configuracion;
- estados sin sedes, sin canchas, sin reservas o sin movimientos.

### 3.3 Agenda y reservas

- seleccion de sede, cancha y fecha;
- navegacion desde Home a una reserva exacta;
- listado de pendientes;
- detalle de reserva;
- creacion manual;
- confirmacion, cancelacion y cambio de estado;
- bloqueo de disponibilidad;
- conflictos de horario;
- retorno conservando fecha, cancha y posicion relevante.

### 3.4 Sedes, canchas y disponibilidad

- listado y seleccion de sedes;
- creacion y edicion de sede;
- ubicacion actual, busqueda y seleccion en mapa;
- creacion y edicion de cancha;
- detalle de cancha;
- estado operativo de la cancha;
- tarifas diurna y nocturna;
- dias y horarios disponibles;
- proteccion de cambios sin guardar;
- eliminacion o desactivacion segura.

### 3.5 Pagos y liquidaciones

- saldo e ingresos visibles;
- movimientos vinculados a reservas;
- historial de liquidaciones;
- estados pendiente, pagado y fallido;
- cuenta de destino;
- consistencia de importes entre Home, Pagos y Liquidaciones;
- recuperacion ante fallos o informacion bancaria incompleta.

### 3.6 Perfil, organizacion y configuracion

- datos personales y del club;
- cambio de organizacion cuando aplique;
- miembros y roles `owner`, `manager` y `staff`;
- capacidades visibles segun permiso;
- configuracion de facturacion;
- cambio de modo sin cerrar sesion;
- cierre de sesion de la cuenta completa.

## 4. Estado conocido antes de la auditoria

Los siguientes ajustes ya fueron implementados y deben tratarse como regresiones
a comprobar, no como problemas pendientes asumidos:

- la apertura y cierre del detalle de cancha dejo de forzar una carga visible
  cuando ya existe un borrador disponible;
- crear una sede o una cancha intenta regresar al origen mediante `router.back()`
  y utiliza Canchas como destino alternativo;
- la tarjeta agregada de pendientes de Home abre un listado de pendientes;
- una reserva pendiente puede abrir Agenda con reserva, fecha y cancha concretas;
- Agenda consume el contexto recibido y limpia los parametros despues de usarlo;
- la accion `Ver agenda` abre explicitamente la fecha de hoy;
- Home, Pendientes y Agenda comparten un contrato tipado para transportar
  reserva, fecha y cancha;
- Agenda prioriza una cancha con actividad en la fecha solicitada cuando el
  enlace no especifica una cancha;
- un enlace a una reserva inexistente conserva el contexto valido y elimina
  los parametros obsoletos;
- la ruta de Pendientes aplica autenticacion y modo negocio antes de renderizar;
- Nueva reserva comparte un contrato tipado de parametros entre Agenda y su
  pantalla modal;
- los rangos horarios y precios invalidos se rechazan antes de crear datos;
- los bloqueos usan la duracion real del intervalo disponible, incluidos los
  espacios menores de una hora;
- un bloqueo o desbloqueo fallido mantiene abierto el sheet y comunica el error;
- la ruta Nueva reserva aplica autenticacion y modo negocio;
- todo el arbol `/business` aplica una unica proteccion de sesion y modo desde
  su layout de Expo Router;
- `nextStep` se calcula con todas las sedes y canchas, incluidas las canchas
  pendientes de disponibilidad;
- crear una cancha sin sedes disponibles regresa a Sedes y no expulsa a Home;
- el mock gateway valida datos, coordenadas, tarifas y horarios aunque la UI
  haya sido omitida;
- editar el horario general de una sede actualiza atomicamente las canchas que
  heredan ese horario;
- una sede o cancha con reservas o bloqueos activos no puede eliminarse desde
  el prototipo, evitando elementos huerfanos en Agenda;
- los movimientos financieros distinguen su estado de pago del estado de una
  reserva;
- los movimientos vinculados pueden abrir la reserva exacta en Agenda;
- Home y Pagos seleccionan la proxima liquidacion pendiente por estado y no
  por posicion dentro del arreglo;
- el saldo mock representa bruto mensual menos comisiones y menos el monto ya
  incluido en una liquidacion en proceso;
- movimientos y liquidaciones contemplan respuestas vacias;
- las canchas con horario heredado consultan el horario vigente de su sede como
  fuente de verdad, sin mantener una copia operativa duplicada;
- Perfil ya no presenta `Administrador` como rol cuando no existe una membresia
  organizacional cargada;
- una cuenta con ambos modos puede cambiar entre Jugador y Negocio sin cerrar
  sesion;
- la proteccion visual de rutas se mantiene separada de la autorizacion real,
  que debera validar membresia y capacidad en backend;
- Home ofrece una accion de reintento cuando falla la carga del negocio;
- Perfil comunica los errores producidos al cambiar de experiencia;
- los resultados del mapa y los horarios de Agenda anuncian su accion real a
  tecnologias de asistencia;
- el store de reservas usa `useSyncExternalStore`, evitando la ventana de
  actualizaciones perdidas entre render y suscripcion;
- los historiales financieros actuales se mantienen como resumen corto; deben
  migrar a lista virtualizada cuando el backend incorpore paginacion;
- existe una tarjeta reutilizable para vistas previas de reservas de negocio;
- el selector de ubicacion fue separado por plataforma para no cargar
  `react-native-maps` en Web.

Estos cambios todavia requieren validacion manual de navegacion, gestos, estado y
regreso en Android e iOS.

## 5. Cuellos de botella identificados

### P0 - Correctitud y bloqueo operativo

#### B01. Estado fragmentado entre pantallas

Cada vista puede cargar su propia copia del borrador o de los datos mock. Una
mutacion puede reflejarse tarde o de forma diferente en Home, Agenda, Canchas y
Pagos.

Riesgo:

- metricas desactualizadas;
- parpadeos al recuperar foco;
- acciones repetidas;
- decisiones tomadas con informacion inconsistente.

Resolucion a evaluar:

- definir una fuente de verdad por dominio;
- hacer que las mutaciones devuelvan el estado actualizado;
- invalidar o notificar solo los datos afectados;
- evitar recargas completas por cada `focus`.

#### B02. Contratos de navegacion informales

Existen recorridos que combinan `push`, `replace`, `navigate`, `back` y
parametros construidos en cada vista.

Riesgo:

- regreso al tab incorrecto;
- duplicacion de rutas en el stack;
- perdida de sede, cancha, fecha o filtro;
- comportamiento distinto segun el punto de entrada.

Resolucion a evaluar:

- documentar origen, destino y politica de regreso de cada ruta;
- tipar parametros compartidos;
- centralizar constructores de rutas solo cuando haya reutilizacion real;
- reservar `replace` para cambios que no deban volver al paso anterior.

#### B03. Mutaciones sin reconciliacion transversal

Confirmar, cancelar, crear o editar un recurso puede no actualizar de inmediato
todos los resumentes derivados.

Riesgo:

- pendientes incorrectos;
- ingresos y ocupacion desfasados;
- reservas que reaparecen al volver.

Resolucion a evaluar:

- enumerar los datos derivados afectados por cada comando;
- actualizar el store mock de forma atomica;
- preparar el contrato para invalidacion de datos cuando exista API real.

#### B04. Autorizacion aun ligada al prototipo

El producto objetivo usa cuenta, modo activo, organizacion y membresia. Un rol
global `player | admin` no representa el modelo final.

Riesgo:

- acciones sensibles visibles para personal no autorizado;
- mezcla entre permisos del dispositivo y autoridad del backend;
- dificultad para incorporar varias organizaciones.

Resolucion a evaluar:

- construir una matriz capacidad x rol;
- ocultar o deshabilitar acciones segun capacidad de interfaz;
- mantener la validacion definitiva en servidor al incorporar API;
- no introducir un `isPro` global para capacidades no relacionadas.

### P1 - Friccion frecuente

#### B05. Contexto local persistente en tabs montados

Los tabs pueden conservar fecha, cancha, modal o filtro anterior. Un enlace
externo o una tarjeta de Home debe reemplazar ese contexto de manera explicita.

#### B06. Formularios y cambios sin guardar inconsistentes

Crear y editar sede, cancha y disponibilidad deben compartir reglas de salida,
errores, teclado, carga y confirmacion, sin forzar una unica vista generica.

#### B07. Jerarquia irregular de modales, sheets y pantallas

Una misma clase de accion puede abrir contenedores distintos. Esto afecta la
previsibilidad del gesto de cierre, el boton atras y el tratamiento del teclado.

#### B08. Seleccion repetitiva de sede, cancha y fecha

Los flujos operativos pueden exigir demasiadas selecciones antes de llegar a la
reserva o disponibilidad que el usuario ya habia indicado desde Home.

#### B09. Estados excepcionales incompletos

Faltan recorridos sistematicos para carga inicial, reintento, error parcial,
datos vacios, recurso eliminado y conflicto concurrente.

#### B10. Listas con crecimiento no validado

Reservas, movimientos, liquidaciones y sedes deben probarse con volumen. Los
listados largos deben usar virtualizacion y elementos estables.

### P2 - Calidad y escalabilidad

#### B11. Semantica financiera pendiente de cerrar

Debe definirse que representa cada monto: ingreso confirmado, saldo disponible,
importe pendiente y liquidado. La interfaz no debe presentar cifras parecidas
con significados diferentes.

#### B12. Accesibilidad y dispositivos

Falta una revision transversal de objetivos tactiles, etiquetas accesibles,
contraste, escalado de texto, safe areas y teclado en ambos sistemas.

#### B13. Falta de telemetria de embudo

Sin eventos de producto no se podra confirmar en que paso abandonan los
administradores ni cuanto tardan en completar tareas frecuentes.

## 6. Metodo de auditoria

Cada recorrido se registrara con esta ficha:

```text
Identificador:
Objetivo del usuario:
Rol y organizacion:
Estado inicial:
Punto de entrada:
Pasos ejecutados:
Destino esperado:
Datos que deben conservarse:
Mutacion realizada:
Vistas que deben actualizarse:
Comportamiento de regreso:
Carga, vacio y error:
Resultado Android:
Resultado iOS:
Hallazgo:
Severidad:
Evidencia:
Resolucion propuesta:
Criterio de aceptacion:
```

La severidad se calculara considerando:

```text
prioridad = impacto x frecuencia x riesgo
```

- `P0`: bloquea la operacion, pierde datos o muestra informacion incorrecta;
- `P1`: obliga a repetir pasos, desorienta o rompe continuidad;
- `P2`: reduce claridad, accesibilidad o rendimiento;
- `P3`: mejora secundaria sin impacto operativo relevante.

## 7. Plan de analisis y resolucion

### Fase 0 - Linea base

Objetivo: disponer de un punto de comparacion reproducible.

Tareas:

- registrar version, plataforma y datos mock usados;
- ejecutar TypeScript y lint;
- capturar los recorridos principales en Android e iOS;
- identificar errores actuales de consola;
- congelar una matriz de datos de prueba con nombres largos, listas vacias,
  horarios limite, conflictos y estados financieros.

Entregable:

- matriz inicial de recorridos y evidencia.

### Fase 1 - Mapa de navegacion

Objetivo: definir el contrato de cada ruta del modo negocio.

Tareas:

- inventariar tabs, stacks, modales y pantallas presentadas verticalmente;
- registrar todos los usos de `push`, `replace`, `navigate` y `back`;
- definir parametros obligatorios y opcionales;
- definir politica de cierre y regreso;
- comprobar enlaces desde Home hacia el recurso exacto;
- comprobar que crear o editar conserve el origen adecuado.

Entregable:

- tabla `origen -> destino -> contexto -> regreso`;
- lista priorizada de rutas ambiguas o duplicadas.

### Fase 2 - Home, pendientes y agenda de hoy

Objetivo: validar el recorrido operativo de mayor frecuencia.

Casos principales:

1. Home -> Pendientes -> Reserva -> Confirmar -> Regresar.
2. Home -> Agenda de hoy -> Reserva exacta -> Regresar.
3. Home -> Ver agenda -> fecha de hoy y contexto esperado.
4. Home -> Cancha -> Detalle -> Cerrar -> misma posicion de Home.
5. Mutacion en Agenda -> metricas actualizadas en Home.

Resoluciones esperadas:

- preservar fecha, cancha y reserva;
- evitar saltos o recargas visibles;
- actualizar contadores derivados;
- mostrar el listado completo cuando una tarjeta representa una agregacion;
- abrir directamente el detalle cuando la tarjeta representa una entidad unica.

### Fase 3 - Agenda operativa

Objetivo: eliminar friccion al gestionar el dia.

Tareas:

- validar selector de sede, cancha y fecha;
- probar cambio de contexto con tabs ya montados;
- probar listas largas y reservas simultaneas;
- verificar conflictos de horario;
- revisar creacion manual y seleccion de cliente;
- validar acciones segun estado;
- revisar bloqueo y desbloqueo de disponibilidad;
- asegurar que cancelar no deje datos derivados obsoletos.

Entregable:

- flujo operativo aprobado para crear, localizar y gestionar una reserva.

### Fase 4 - Sedes, canchas y disponibilidad

Objetivo: asegurar un flujo de configuracion progresivo y recuperable.

Tareas:

- probar negocio sin sede, con sede sin cancha y negocio operativo;
- validar crear y editar desde todos los puntos de entrada;
- revisar cambios sin guardar en gesto, header y boton del sistema;
- validar permisos de ubicacion y errores de geocodificacion;
- comprobar seleccion manual y ubicacion actual en mapa;
- revisar estados de cancha y su impacto en reservas;
- validar disponibilidad y tarifas con datos limite;
- eliminar navegaciones o componentes duplicados despues de verificar referencias.

Entregable:

- alta y mantenimiento de recursos sin perdida de contexto o datos.

### Fase 5 - Pagos y liquidaciones

Objetivo: garantizar confianza en la informacion financiera.

Tareas:

- definir el significado y fuente de cada cifra;
- relacionar movimientos con reservas cuando corresponda;
- verificar que los estados usen el mismo contrato semantico;
- auditar cuenta de destino y datos enmascarados;
- separar saldo, ingresos, pendientes y liquidaciones;
- validar vacio, fallo, reintento y volumen de historial;
- comprobar permisos para visualizar o modificar facturacion.

Entregable:

- diccionario financiero de interfaz y recorridos consistentes.

### Fase 6 - Perfil, organizaciones y permisos

Objetivo: alinear el prototipo con `PRODUCT_MODEL.md` sin sobredisenar.

Tareas:

- mapear acciones por `owner`, `manager` y `staff`;
- identificar pantallas que asumen un administrador global;
- validar cambio de modo sin cerrar sesion;
- definir comportamiento con varias organizaciones;
- separar preferencias personales de configuracion del negocio;
- marcar las comprobaciones que deberan ejecutarse en backend.

Entregable:

- matriz de capacidades y backlog de migracion del modelo temporal.

### Fase 7 - Estados, accesibilidad y rendimiento

Objetivo: endurecer la experiencia antes de ampliar funcionalidad.

Tareas:

- normalizar carga, vacio, error, reintento y exito;
- comprobar objetivos tactiles de al menos 44 x 44;
- revisar etiquetas accesibles e indicadores no dependientes solo del color;
- probar texto grande y nombres largos;
- revisar safe areas, teclado y gestos;
- virtualizar listas que puedan crecer;
- evitar calculos y transformaciones costosas dentro de cada item;
- comprobar estabilidad de animaciones y scroll en dispositivos reales.

Entregable:

- checklist transversal aprobada en Android e iOS.

### Fase 8 - Verificacion y cierre

Objetivo: impedir regresiones entre features relacionadas.

Tareas:

- ejecutar `npx tsc --noEmit`;
- ejecutar el lint configurado por el proyecto;
- agregar pruebas de utilidades y reglas de negocio con riesgo real;
- agregar pruebas de componentes para acciones criticas;
- cubrir recorridos principales con pruebas de integracion o E2E cuando exista
  infraestructura adecuada;
- repetir la matriz manual en Android e iOS;
- actualizar este documento con resultado, evidencia y deuda aceptada.

Entregable:

- informe final con hallazgos cerrados, riesgos residuales y siguientes pasos.

## 8. Orden recomendado de implementacion

El trabajo debe ejecutarse en lotes verticales pequenos:

1. Home -> Pendientes -> Reserva -> Accion -> Regreso.
2. Home -> Agenda de hoy -> Reserva -> Regreso.
3. Agenda -> Crear reserva -> Actualizacion transversal.
4. Home/Canchas -> Detalle -> Editar -> Regreso.
5. Crear sede -> Crear cancha -> Disponibilidad -> Dashboard operativo.
6. Reserva -> Movimiento -> Liquidacion.
7. Perfil -> Organizacion -> Permisos.
8. Estados excepcionales, accesibilidad y rendimiento.

No se debe redisenar toda una feature antes de comprobar su contrato de datos y
navegacion.

## 9. Criterios globales de aceptacion

Un recorrido se considera resuelto cuando:

- llega al recurso y contexto correctos;
- conserva sede, cancha, fecha, filtro y posicion cuando corresponde;
- el gesto atras y el boton de cierre producen el mismo resultado esperado;
- no muestra recargas completas innecesarias;
- una mutacion actualiza todas las vistas derivadas;
- no permite duplicar acciones durante carga;
- ofrece recuperacion ante error;
- protege cambios sin guardar;
- respeta el alcance de organizacion y permisos;
- funciona con datos vacios, largos y numerosos;
- sus elementos interactivos son accesibles;
- supera TypeScript, lint y la prueba manual en Android e iOS.

## 10. Registro de ejecucion

Actualizar esta tabla al iniciar cada bloque. No marcar una fase como completada
solo porque el codigo compile.

| Fase | Estado | Hallazgos P0 | Hallazgos P1 | Responsable | Evidencia |
|---|---|---:|---:|---|---|
| 0. Linea base | Pendiente | - | - | - | - |
| 1. Navegacion | En analisis | 3 | 2 | Codex | Contrato tipado de Agenda creado; inventario global pendiente |
| 2. Home y Agenda | En validacion | 0 | 2 | Codex | TypeScript y lint aprobados; prueba Android/iOS pendiente |
| 3. Agenda operativa | En validacion | 2 | 1 | Codex | Rangos, conflictos y retorno corregidos; prueba Android/iOS pendiente |
| 4. Sedes y canchas | En validacion | 3 | 2 | Codex | Rutas, nextStep, herencia y eliminacion corregidos; prueba Android/iOS pendiente |
| 5. Pagos | En validacion | 2 | 2 | Codex | Semantica y enlaces corregidos; integracion financiera real pendiente |
| 6. Permisos | En analisis | 1 | 2 | Codex | Modo corregido; contrato backend de membresias y capacidades pendiente |
| 7. Calidad transversal | En validacion | 1 | 4 | Codex | Recuperacion, accesibilidad y store externo corregidos; prueba en dispositivos pendiente |
| 8. Cierre | Pendiente | - | - | - | - |

### Correccion: Oportunidad de hoy

- El total se calcula solo con sedes y canchas activas que operan el dia actual.
- Las ocupaciones se recortan al horario operativo y se fusionan para evitar dobles descuentos.
- La tarjeta representa el bloque continuo mas amplio y abre Agenda en la fecha y cancha correctas.
- Agenda resalta el horario recomendado; las acciones solo aparecen cuando el usuario toca ese bloque.
- Tanto la oportunidad como las reservas de `Agenda de hoy` centran el elemento enfocado en el viewport.
- Ningun acceso externo abre acciones automaticamente: todos centran y resaltan el elemento en Agenda.
- El modal de acciones solo aparece tras un toque explicito dentro de Agenda.
- El contrato elimina la variante `actionReservationId` y conserva una unica entrada `focusReservationId`.
- El enfoque usa un borde blanco superpuesto sobre el area del card, sin modificar padding ni dimensiones.
- El enfoque pertenece solo a la navegacion entrante y se limpia ante cualquier interaccion dentro de Agenda.
- Agenda conserva las medidas de todas sus filas y centra tambien reservas, horarios y bloqueos tocados localmente.
- Cada entrada desde otra pantalla emite una nueva solicitud de enfoque, incluso si Agenda sigue montada y el destino es el mismo.

### Correccion: rutas secundarias de negocio

- Pagos y Liquidaciones usan rutas de Stack declaradas y la misma transicion horizontal.
- La tarjeta de Liquidaciones representa el agregado pendiente que tambien muestra su pantalla destino.
- Liquidaciones usa `AppScreenLayout`; elimina el header y scroll especiales que producian un cambio de comportamiento.
- Editar cancha, editar sede y disponibilidad regresan al recurso padre o lo restauran si la entrada fue directa.
- Pagos y Liquidaciones son niveles jerarquicos con transicion horizontal.
- Editar cancha, editar sede y disponibilidad son tareas modales con entrada vertical, gesto hacia abajo e icono de cierre coherente.
- Si no existe un bloque accionable, mantiene como respaldo la Agenda de hoy.

### Correccion: transiciones de pantalla

- El Stack raiz define una transicion horizontal nativa como politica por defecto; una ruta nueva ya no aparece sin animacion por falta de configuracion.
- Los cambios de modo hacia el grupo de tabs usan una transicion breve por opacidad y no permiten volver con gesto a autenticacion.
- Onboarding usa opacidad porque forma parte del arranque, no de una navegacion jerarquica.
- Detalles y pantallas de segundo nivel conservan navegacion horizontal.
- Edicion, disponibilidad y creacion de reservas conservan entrada vertical con gesto de cierre coherente.
- La creacion de reservas incorpora direccion de gesto vertical, que faltaba frente a las otras tareas modales.
- Analitica queda registrada explicitamente como pantalla secundaria de negocio.
- Todas las transiciones comparten fondo negro para evitar destellos entre pantallas.
- La implementacion permanece sobre el Stack nativo de Expo Router; no agrega animaciones JS por vista.
- La auditoria jerarquica encontro que `app/business/_layout.tsx` usaba `Slot`; por ello las opciones `business/...` del Stack raiz no controlaban las transiciones internas.
- Negocio ahora posee un Stack nativo propio y registra sus rutas con nombres relativos al layout.

Estados permitidos:

- `Pendiente`;
- `En analisis`;
- `En correccion`;
- `En validacion`;
- `Completada`;
- `Bloqueada`.

## 11. Decisiones que deben confirmarse durante la auditoria

- fuente semantica de ingresos, saldo y ocupacion;
- limite funcional del plan Business Basic;
- capacidades exclusivas de Business Pro;
- alcance exacto de `manager` y `staff`;
- soporte de multiples organizaciones en el MVP;
- proveedor definitivo de mapas y geocodificacion;
- estrategia de cache y sincronizacion cuando se conecte la API;
- herramienta de pruebas E2E para los recorridos criticos;
- eventos minimos de telemetria del embudo de negocio.

Estas decisiones no deben resolverse mediante valores hardcodeados en la UI.
