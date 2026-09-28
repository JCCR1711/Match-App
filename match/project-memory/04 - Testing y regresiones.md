---
project: MATCH
type: testing
updated: 2026-09-15
---

# Testing y regresiones

## Evidencia local

El 15 de septiembre de 2026 se aprobaron:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npx.cmd expo-doctor`

## Pendiente manual

En Android e iOS comprobar:

1. Arranque con sesion nueva, jugador y negocio.
2. Recorrido Dashboard → Pendientes → reserva → Agenda y retorno con contexto.
3. Crear, editar, desactivar y salir con cambios sin guardar en sedes/canchas.
4. Restricciones para `owner`, `manager` y `staff`.
5. Escenarios mock de reservas: lento, sin conexion, 500, 409 y 401.
6. Gesto atras, cierre vertical, teclado, safe areas y contraste de status bar.

La guia ejecutable completa esta en `DEVELOPMENT_TESTING.md`. El cierre se
registra en `BUSINESS_FLOW_AUDIT_PLAN.md`.
