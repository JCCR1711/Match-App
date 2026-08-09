# Match

Aplicación móvil desarrollada con **React Native + Expo** y **Expo Router**.

## Tecnologías principales

- React Native
- Expo
- Expo Router
- TypeScript

## Estructura del proyecto

El proyecto utiliza una arquitectura basada en **features**.

Las rutas de navegación se encuentran en `app/` y la implementación de las funcionalidades se encuentra en `src/`.

Para conocer la estructura completa y las reglas de organización del código, consultar:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

Para conocer el modelo previsto de usuarios, negocios, permisos y planes, consultar:

**[PRODUCT_MODEL.md](./PRODUCT_MODEL.md)**

## Rutas

Expo Router utiliza la carpeta `app/` para definir la navegación de la aplicación.

Ejemplo:

```text
app/auth/login/index.tsx
        ↓
src/features/auth/views/LoginView.tsx
```

Las rutas deben mantenerse simples y delegar la implementación a las vistas correspondientes.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npx expo start
```

## Verificación de TypeScript

Antes de finalizar cambios:

```bash
npx tsc --noEmit
```

El proyecto debe mantenerse sin errores de TypeScript.

## Documentación

| Documento          | Propósito                                    |
| ------------------ | -------------------------------------------- |
| `README.md`        | Información general y ejecución del proyecto |
| `ARCHITECTURE.md`  | Arquitectura y organización del código       |
| `PRODUCT_MODEL.md` | Usuarios, modos, permisos y planes            |
| `TEAM_WORKFLOW.md` | Flujo de trabajo del equipo                  |
| `AGENTS.md`        | Instrucciones para agentes de desarrollo     |
| `CLAUDE.md`        | Instrucciones específicas para Claude        |

## Regla

Antes de crear nuevas carpetas o mover archivos, consultar `ARCHITECTURE.md`.

La arquitectura debe mantenerse consistente durante todo el desarrollo.
