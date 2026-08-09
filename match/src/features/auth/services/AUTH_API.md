# Contrato HTTP de autenticación

La aplicación usa `EXPO_PUBLIC_API_URL` como URL base. El mock solo está
disponible durante desarrollo cuando esa variable no existe; una compilación
de producción falla de forma segura si no está configurada.

## Solicitar código

`POST /auth/email/code`

```json
{ "email": "usuario@example.com" }
```

```json
{ "challengeId": "opaque-id", "expiresInSeconds": 300 }
```

La respuesta debe ser indistinguible tanto si el correo existe como si no,
para evitar enumeración de cuentas.

## Verificar código

`POST /auth/email/verify`

```json
{ "challengeId": "opaque-id", "code": "123456" }
```

Usuario existente:

```json
{
  "status": "authenticated",
  "user": {
    "id": "user_123",
    "displayName": "Ana",
    "email": "ana@example.com",
    "availableModes": ["player"],
    "activeMode": "player"
  },
  "tokens": {
    "accessToken": "short-lived-token",
    "refreshToken": "rotating-token",
    "accessTokenExpiresAt": "2026-08-08T20:15:00.000Z"
  }
}
```

Usuario nuevo:

```json
{
  "status": "sign_up_required",
  "verifiedEmail": "nuevo@example.com",
  "enrollmentToken": "single-use-token",
  "termsVersion": "2026-08"
}
```

## Completar registro

`POST /auth/sign-up/complete`

```json
{
  "enrollmentToken": "single-use-token",
  "displayName": "Ana",
  "acceptedTermsVersion": "2026-08"
}
```

Devuelve `AuthenticatedSession` (los campos `user` y `tokens` del ejemplo
anterior). En una cuenta nueva, `availableModes` debe ser `[]` y `activeMode`
debe ser `null` hasta completar la selección inicial.

## Seleccionar modo inicial

`PUT /users/me/mode`

Requiere `Authorization: Bearer <accessToken>`.

```json
{ "mode": "player" }
```

Valores permitidos:

- `player`
- `venue_manager`

Devuelve el usuario actualizado:

```json
{
  "id": "user_456",
  "displayName": "Ana",
  "email": "ana@example.com",
  "availableModes": ["player"],
  "activeMode": "player"
}
```

El servidor debe agregar el modo sin eliminar modos existentes. Seleccionar
`venue_manager` habilita el onboarding empresarial, pero no concede permisos
sobre ninguna organización hasta crear o aceptar una membresía válida.

## Renovar y revocar sesión

`POST /auth/session/refresh`

```json
{ "refreshToken": "rotating-token" }
```

Devuelve un `AuthenticatedSession` con un refresh token nuevo e invalida el
anterior.

`POST /auth/session/revoke`

```json
{ "refreshToken": "rotating-token" }
```

Puede responder `204 No Content`.

## Requisitos del servidor

- Usar HTTPS y guardar solo hashes de códigos, challenges y refresh tokens.
- Códigos de un solo uso, con expiración breve, límite de intentos y rate limit
  por cuenta, IP y dispositivo.
- Invalidar sesiones anteriores al detectar reutilización de un refresh token.
- Mantener access tokens breves y aplicar autorización en el servidor para
  pagos, reservas, roles y beneficios premium.
- Aplicar idempotencia y confirmación reforzada a operaciones financieras; una
  sesión válida no sustituye esa autorización.
