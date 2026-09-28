---
project: MATCH
status: prototipo funcional
updated: 2026-09-15
---

# MATCH — resumen

MATCH es una aplicacion movil para descubrir, reservar y gestionar canchas.
Una misma cuenta puede utilizar el modo `player` y el modo `venue_manager`.

## Plataforma actual

- Expo 57, React Native 0.86 y React 19.2.
- TypeScript estricto, Expo Router, TanStack Query y Reanimated.
- Destinos principales: Android e iOS; web se mantiene cuando corresponde.

## Estado actual

El modo negocio tiene implementado su prototipo integral: Dashboard, Agenda,
reservas, sedes, canchas, disponibilidad, pagos, liquidaciones, analitica,
roles, planes y cuenta de deposito. La integracion real con backend, pagos y
autorizacion de servidor no esta implementada.

El modo jugador tiene Inicio, detalle de sede, creacion y confirmacion de
reserva y Mis reservas. Aun no posee una auditoria integral equivalente a la
de negocio.

Ver tambien: [[03 - Flujos de negocio]], [[04 - Testing y regresiones]] y
[[05 - Deuda y siguientes pasos]].
