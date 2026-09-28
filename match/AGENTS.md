# MATCH — instrucciones para agentes

## Proyecto

MATCH es una app móvil de descubrimiento, reservas y gestión de canchas. Está en evolución desde prototipo visual hacia funcionalidad real; no conviertas una tarea visual en integración de backend o arquitectura de producción sin que se solicite.

Stack actual: Expo 54, React Native 0.81, React 19, TypeScript estricto, Expo Router 6, TanStack Query, Reanimated 4 y `StyleSheet`. Los destinos principales son iOS y Android; web se soporta donde la implementación lo permita.

## Contexto progresivo

- Empieza por la ruta, vista, componente o servicio mencionado en la solicitud y sigue únicamente sus imports y dependencias reales.
- Usa `rg`/`rg --files` y lecturas localizadas. No recorras todo `app/` o `src/`, no abras archivos grandes completos si basta una búsqueda y no repitas una exploración ya válida.
- Consulta `package.json`, el árbol completo o documentación adicional solo cuando el cambio dependa de ellos.
- No vuelvas a investigar decisiones ya documentadas salvo que el código relacionado indique que cambiaron.
- Antes de editar, revisa `git status --short` y conserva todo cambio ajeno del usuario.
- Ejecuta primero la comprobación mínima relacionada con lo modificado; amplía la validación según el alcance y riesgo.

Lee documentación especializada solo cuando corresponda:

- `ARCHITECTURE.md`: cambios de estructura, ownership o nuevas capas.
- `PRODUCT_MODEL.md`: cuentas, modos jugador/negocio, organizaciones, membresías, roles, suscripciones, permisos o navegación asociada.
- `DEVELOPMENT_TESTING.md`: flujos demo, datos mock, persistencia local y recorridos manuales.
- Los contratos `*_API.md` cercanos a una feature: cambios en gateways, servicios o datos de esa feature.

No uses `README.md`, auditorías o planes como fuente normativa si contradicen el código o los documentos anteriores.

## Arquitectura y ownership

- `app/` contiene rutas y layouts de Expo Router. Mantén las rutas delgadas: conectan parámetros/navegación con una vista de `src/features/`.
- `src/features/<feature>/` posee vistas, componentes, hooks, queries, servicios, tipos, datos y utilidades específicos de esa capacidad.
- `src/components/ui/` y `src/components/navigation/` son compartidos; promueve código allí solo cuando la reutilización entre features sea real.
- `src/context/`, `src/hooks/`, `src/services/`, `src/types/` y `src/utils/` contienen responsabilidades genuinamente transversales.
- `src/theme/` es la fuente de tokens globales. Reutiliza `theme` y `StyleSheet.create`; evita colores, tipografías y espaciados duplicados cuando ya exista un token apropiado.
- No crees carpetas vacías, capas especulativas ni ubicaciones sinónimas (`shared`, `common`, otro `api`, etc.). La estructura puede evolucionar cuando una responsabilidad real lo justifique.
- Usa el alias `@/` configurado en TypeScript para imports internos; conserva el patrón de nombres existente: componentes/vistas/providers en PascalCase y hooks/utilidades en camelCase.

## Implementación

- Busca primero en `src/components/` y en la feature afectada antes de crear un componente, hook o helper. Extiende una abstracción existente si conserva una responsabilidad clara.
- Usa componentes funcionales y TypeScript sin `any`; modela props y estados explícitamente cuando la inferencia no sea suficiente.
- Prefiere estado local para UI. El estado global actual usa Context; el estado de servidor usa TanStack Query y gateways por feature. No añadas otra librería de estado sin una necesidad explícita.
- Mantén red, persistencia y mocks fuera de las vistas. Infraestructura compartida vive en `src/services/`; gateways, queries y mocks propios permanecen en su feature.
- Expo Router es el único sistema de navegación. Verifica rutas tipadas y revisa el layout/guard más cercano cuando cambie un flujo.
- No uses `activeMode`, roles visibles o flags locales de plan como autorización. Para cambios del dominio de cuenta/negocio, sigue `PRODUCT_MODEL.md`.
- Mantén accesibilidad en controles interactivos y respeta targets táctiles, contraste y estados disabled/loading existentes.
- Para datos remotos o asincronos compartidos, usa TanStack Query con claves que incluyan el alcance real (cuenta, organizacion o recurso). No presentes datos placeholder como si ya estuvieran cargados.
- En la carga inicial de pantallas con contenido estructurado, usa un skeleton con shimmer basado en `AppSkeleton` que reproduzca la jerarquia aproximada de la interfaz. Reserva `ActivityIndicator` para acciones puntuales o esperas sin una estructura visual estable.
- No añadas dependencias ni modifiques UI, navegación o lógica fuera del alcance solicitado.

## Áreas que requieren cautela

- No edites imágenes, fuentes, lockfiles, configuración Expo/TypeScript ni documentación de producto salvo que la tarea lo requiera.
- No cambies claves de persistencia, IDs/versiones de seeds demo o contratos mock sin leer `DEVELOPMENT_TESTING.md` y buscar sus consumidores.
- No borres ni muevas archivos sin buscar referencias. No reformatees archivos no relacionados.
- Nunca incluyas secretos; cualquier valor `EXPO_PUBLIC_*` termina en el bundle cliente.

## Validación y cierre

Comandos disponibles:

```bash
npm run typecheck
npm run lint
```

No hay script de tests automatizados en `package.json`. Para un cambio local pequeño, valida primero imports/tipos o lint del alcance cuando la herramienta lo permita. Ejecuta `npm run typecheck` tras cambios TypeScript relevantes o estructurales y `npm run lint` cuando cambie código. Añade recorrido manual solo si el comportamiento o navegación cambió; usa `DEVELOPMENT_TESTING.md` para escenarios demo.

Antes de terminar:

1. Confirma que el diff contiene solo cambios solicitados y que no pisaste trabajo previo.
2. Comprueba imports/rutas/referencias afectados y elimina código obsoleto solo si quedó dentro del alcance.
3. Reporta archivos modificados, validaciones ejecutadas y cualquier limitación real; no afirmes haber probado algo que no ejecutaste.

La regla principal es implementar la solución profesional más pequeña que respete el ownership actual y deje el proyecto fácil de evolucionar.
