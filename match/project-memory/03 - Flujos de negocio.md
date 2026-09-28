---
project: MATCH
type: business-flow
updated: 2026-09-15
---

# Flujos de negocio

## Implementado en el prototipo

1. Acceso como negocio y entrada al Dashboard.
2. Dashboard → Pendientes → reserva → Agenda contextual.
3. Agenda → reserva manual o bloqueo → actualizacion transversal.
4. Sedes/canchas → detalle → editar, disponibilidad o desactivar.
5. Finanzas → liquidaciones → cuenta de deposito, con restricciones por rol.
6. Perfil → rol de desarrollo y selector de plan de desarrollo.

## Fuente de datos actual

Los datos mock se persisten por cuenta u organizacion. Los contratos de
frontera estan cerca de cada feature (`VENUE_API.md`, `RESERVATIONS_API.md`,
`PAYMENTS_API.md` y `SUBSCRIPTIONS_API.md`). No representan un backend listo
para produccion.

## Validacion pendiente

El plan de auditoria mantiene las fases funcionales en validacion, no cerradas:
falta ejecutar el recorrido manual completo en Android e iOS y registrar
hallazgos. Consultar [[04 - Testing y regresiones]].
