---
project: MATCH
type: architecture
updated: 2026-09-15
---

# Arquitectura

## Ownership

```text
app/                         Rutas y layouts de Expo Router
src/features/<feature>/      Vistas, componentes, datos, servicios y tipos propios
src/components/              UI y navegacion compartidas
src/context/                 Estado transversal
src/services/                Infraestructura transversal
src/theme/                   Tokens visuales globales
```

Las rutas deben ser delgadas y no contener logica de negocio. Los gateways y
queries pertenecen a su feature; las vistas no llaman HTTP directamente.

## Estado y datos

- Estado visual/formularios: local.
- Identidad y sesion: `AuthProvider`.
- Datos asincronos de feature: TanStack Query y gateways.
- Prototipo de negocio: stores mock persistidos con AsyncStorage.

## Limites importantes

`activeMode` modifica la experiencia de navegacion, pero no autoriza acciones.
Las capacidades de negocio se resuelven mediante membresia, rol, suscripcion,
alcance y estado del recurso. El backend debera aplicar esa regla.

Fuentes normativas relacionadas: `AGENTS.md`, `ARCHITECTURE.md` y
`PRODUCT_MODEL.md`.
