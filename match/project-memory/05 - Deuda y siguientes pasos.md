---
project: MATCH
type: backlog
updated: 2026-09-15
---

# Deuda y siguientes pasos

## Antes de ampliar funcionalidades

1. Ejecutar y registrar la matriz manual de negocio en Android e iOS.
2. Formalizar la actualizacion de plataforma a Expo 57 / React Native 0.86 en
   la documentacion de proyecto y validar Metro en Windows.
3. Validar en Android e iOS la resolucion centralizada de ruta inicial. Desde
   2026-09-15 `app/index.tsx` es la unica autoridad de arranque;
   `AuthNavigationGuard` fue retirado para evitar redirecciones competidoras.

## Posterior

1. Auditar el flujo jugador: Inicio → sede → reserva → confirmacion → Mis
   reservas.
2. Sustituir gateways mock por contratos de backend cuando existan.
3. Integrar autorizacion de servidor, pagos, liquidaciones y pruebas
   automatizadas para recorridos criticos.

## Regla

No agregar features de planes, pagos o permisos como si fueran produccion hasta
que sus contratos y fuentes de verdad existan en servidor.
