# Auditoria: Splash a Dashboard

## Alcance

Recorridos revisados:

1. Splash nativo y splash React.
2. Onboarding.
3. Bienvenida y acceso por correo/proveedor.
4. Verificacion OTP.
5. Creacion de perfil.
6. Seleccion de modo.
7. Configuracion inicial de negocio.
8. Entrada al Dashboard.

La revision contrasta navegacion, estado, accesibilidad y consistencia visual con
los componentes y tokens actuales de Match.

## Resultado ejecutivo

El Dashboard y el onboarding tienen una direccion visual reconocible, pero el
flujo completo todavia no funciona como un solo sistema. El mayor riesgo es la
navegacion: `Index`, `AuthNavigationGuard` y algunas vistas toman decisiones de
redireccion sobre el mismo estado. Esto puede producir saltos, rutas reemplazadas
dos veces y diferencias entre Android e iOS.

La correccion debe comenzar por el flujo y los estados. Unificar solamente
colores o radios no resolveria la percepcion de inconsistencia.

## Hallazgos

### P0 - Corregir antes de cerrar el flujo

#### 1. Varias autoridades controlan la navegacion de autenticacion

- `app/index.tsx` decide onboarding, bienvenida, seleccion de modo y tabs.
- `AuthNavigationGuard` vuelve a decidir si debe abrir onboarding.
- `EmailVerificationView` y `SelectUserModeView` tambien redirigen mediante
  efectos.

Impacto:

- redirecciones competidoras;
- pantallas que aparecen por un instante;
- historial dificil de predecir;
- comportamiento diferente segun la velocidad de AsyncStorage y la sesion.

Solucion:

- definir una unica funcion pura que resuelva el destino de arranque;
- usarla desde un unico limite de navegacion;
- dejar que las vistas naveguen solo como resultado de una accion completada.

#### 2. El splash React bloquea cada arranque durante casi dos segundos

`LaunchSplash` espera 1450 ms y luego anima una salida de 420 ms aunque la app ya
este lista. Ademas del splash nativo de Expo, se presenta una segunda capa de
lanzamiento.

Impacto:

- aumenta artificialmente el tiempo hasta poder interactuar;
- retrasa tambien al usuario con sesion restaurada;
- no respeta Reduce Motion.

Solucion:

- mantener el splash nativo hasta que fuentes, sesion y onboarding esten listos;
- mostrar la animacion de marca solo en el primer recorrido o limitarla a una
  duracion breve no bloqueante;
- sustituir desplazamientos por opacidad cuando Reduce Motion este activo.

#### 3. OTP no aplica realmente el estado deshabilitado al input

`OtpCodeInput` evita cambios dentro del callback, pero el `TextInput` conserva
`editable` activo. Durante verificacion puede seguir recibiendo foco y teclado.

Solucion:

- usar `editable={!disabled}`;
- exponer `accessibilityState={{ disabled }}`;
- evitar refocus automatico mientras se procesa el codigo.

### P1 - Friccion alta

#### 4. El setup de negocio no tiene un contrato de entrada consistente

- El alta normal de administrador abre `business/setup`.
- El acceso demo abre Dashboard directamente.
- Al restaurar sesion, `app/index.tsx` abre Dashboard aunque el negocio no tenga
  datos completos.
- Dashboard ya contiene una progresion para crear sede y cancha.

Esto mezcla onboarding obligatorio con configuracion progresiva.

Decision recomendada para el MVP:

- entrar siempre al Dashboard despues de seleccionar modo negocio;
- presentar alli una unica siguiente accion de configuracion;
- reservar `business/setup` para datos realmente obligatorios antes de operar.

#### 5. La pantalla de setup permite volver aunque la ruta deshabilita el gesto

El Stack marca `setup` con `gestureEnabled: false`, pero `BusinessBasicsView`
muestra un boton que ejecuta `router.back()`. El usuario puede volver a una
seleccion ya persistida como `venue_manager`.

Solucion:

- si el setup es obligatorio, usar cierre de sesion/cambio de modo explicito;
- si es progresivo, permitir salir al Dashboard;
- no mezclar boton atras con gesto atras deshabilitado.

#### 6. Proveedores no disponibles parecen acciones listas

Google y Apple se muestran como botones principales pero solo abren una alerta
de desarrollo.

Solucion:

- ocultarlos fuera de desarrollo hasta conectar los proveedores;
- o mostrarlos deshabilitados con estado semanticamente deshabilitado;
- no presentar una accion primaria que siempre termina en un aviso.

#### 7. Errores de formulario tienen poca diferenciacion

Los campos de autenticacion usan bordes grises y texto secundario tanto para
ayuda como para error. Match ya dispone de tokens `error`, `errorSoft` y
`errorSurface`.

Solucion:

- usar el token semantico de error en borde y mensaje;
- mantener texto y estado accesible, sin depender solamente del color;
- conservar el mensaje junto al campo correspondiente.

### P2 - Consistencia y calidad percibida

#### 8. Las vistas de autenticacion duplican el mismo esqueleto

Correo, OTP y perfil repiten manualmente fondo, SafeArea, header, scroll,
espaciado y bloque de contenido. Esto ya produjo pequeñas diferencias en gaps,
posicion vertical y comportamiento del teclado.

Solucion:

- crear un layout de feature para el flujo de autenticacion;
- mantener dentro de cada vista solamente contenido y acciones propias;
- no moverlo a UI global porque su lenguaje pertenece a `auth`.

#### 9. Hay estilos visuales fuera del tema

El flujo contiene varios `rgba(...)` locales para superficies, divisores,
bordes y texto. Algunos ya tienen equivalentes en `theme.colors`.

Solucion:

- reemplazar valores repetidos por tokens semanticos existentes;
- crear un token solo cuando represente una responsabilidad reutilizada;
- no convertir valores exclusivos de una composicion en tokens globales.

#### 10. Alturas fijas pueden romper texto ampliado

Inputs, botones y celdas OTP usan alturas fijas de 56 a 64 puntos. Con texto
grande pueden recortar contenido o reducir demasiado el espacio interno.

Solucion:

- preferir `minHeight` con padding vertical;
- comprobar 200% de escala de texto;
- permitir que etiquetas largas ocupen dos lineas cuando corresponda.

#### 11. El boton atras de Bienvenida puede no tener destino

Onboarding abre Bienvenida mediante `replace`. Bienvenida siempre muestra un
boton que ejecuta `router.back()`, aunque esa entrada puede no conservar una ruta
anterior valida.

Solucion:

- usar regreso con fallback a onboarding cuando corresponda;
- o eliminar el boton si onboarding ya fue completado y no debe reaparecer.

#### 12. Dashboard necesita feedback de carga con presencia estable

La carga inicial muestra solo texto centrado. El contenido completo aparece de
golpe al terminar el draft.

Solucion:

- reservar la geometria del header y del primer bloque;
- usar un indicador o skeleton breve con Reduce Motion;
- conservar el estado de error y reintento actual, que ya es correcto.

## Patrones que si estan alineados

- Safe areas presentes en onboarding, autenticacion, setup y Dashboard.
- CTAs principales mantienen alturas tactiles adecuadas.
- Inputs de correo incluyen tipo de teclado, autocompletado y accion de envio.
- OTP declara `oneTimeCode` y permite el autocompletado del sistema.
- Los errores importantes usan `accessibilityRole="alert"`.
- Dashboard usa header colapsable, fondo compartido, avatar accesible y estados
  vacio/error.
- Los colores principales proceden mayormente del tema y los iconos usan una
  familia consistente.

## Arquitectura objetivo

```text
Native splash
  -> inicializacion de fuentes + sesion + onboarding
  -> resolucion unica de destino
  -> onboarding opcional
  -> autenticacion
  -> seleccion de modo
  -> Dashboard del modo activo
  -> configuracion progresiva contextual
```

Responsabilidades recomendadas:

- resolver destino: utilidad pura de `auth`;
- coordinar arranque: un unico guard/layout;
- UI repetida del acceso: layout interno de `auth`;
- persistencia de onboarding: contexto actual;
- configuracion del negocio: feature `venues`, abierta desde Dashboard.

## Orden de implementacion

1. Centralizar la resolucion de rutas y eliminar redirecciones competidoras.
2. Vincular el splash a la inicializacion real y soportar Reduce Motion.
3. Definir Dashboard como destino consistente del modo negocio.
4. Corregir OTP, errores semanticos y comportamiento atras.
5. Extraer el layout compartido de autenticacion.
6. Sustituir valores visuales repetidos por tokens existentes.
7. Validar Android/iOS con sesion nueva, restaurada y expirada.
8. Probar teclado, lector de pantalla, texto grande y Reduce Motion.

## Matriz minima de prueba

- Primera instalacion sin sesion.
- Regreso posterior sin sesion.
- Sesion de jugador restaurada.
- Sesion de negocio restaurada con y sin configuracion.
- Codigo correcto, incorrecto, expirado y reenviado.
- Cierre y reapertura durante cada paso.
- Back fisico de Android y gesto de iOS.
- Teclado visible en telefono pequeno.
- Texto al 200% y Reduce Motion activo.

## Implementacion aplicada

- Correo, OTP, perfil, seleccion de modo y setup usan el `AppScreenLayout`
  compartido por las pantallas secundarias de negocio.
- Los CTAs principales usan el footer compartido; ya no pertenecen al mismo
  grupo visual que los inputs ni dependen de margenes definidos por cada vista.
- Las pantallas de autenticacion usan la variante `solid` del fondo compartido,
  igual que los formularios operativos de negocio.
- Titulos, gutters, separacion vertical y posicion del formulario quedaron
  unificados.
- Inputs y CTAs principales usan altura minima y padding en vez de depender de
  una altura rigida.
- Los errores usan los tokens semanticos del tema.
- OTP bloquea realmente su `TextInput` durante la verificacion.
- El boton atras de autenticacion tiene fallback seguro hacia onboarding.
- El splash es mas breve y se omite cuando Reduce Motion esta activo.
- Setup usa retorno seguro hacia seleccion de modo y mensajes alineados al tema.
- Dashboard muestra progreso estable durante la carga inicial.
