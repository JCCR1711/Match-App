---
project: MATCH
type: decisions
updated: 2026-09-15
---

# Decisiones vigentes

## Cuenta y modos

- Una sola cuenta puede ser jugador y administrar una organizacion.
- `player` y `venue_manager` son modos de experiencia, no roles de seguridad.
- Los roles empresariales son `owner`, `manager` y `staff`, definidos por
  membresia de organizacion.

## Producto negocio

- La organizacion es propietaria de sedes, canchas, suscripcion, ingresos y
  reportes.
- El onboarding empresarial es progresivo: tras datos minimos se entra al
  Dashboard y se completan sede, cancha, horario y configuracion contextual.
- Basic conserva la operacion esencial; Pro representa capacidades avanzadas.
- Marketplace y agenda manual son estados distintos.

## Calidad y navegacion

- Expo Router es el unico sistema de navegacion.
- Las cargas iniciales estructuradas usan skeleton; indicadores compactos se
  reservan para acciones puntuales.
- Los cambios sin guardar usan guard y confirmacion compartidos.
- El estado de la barra del sistema debe mantener contraste en pantallas
  oscuras.
