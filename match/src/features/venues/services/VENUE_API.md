# Contrato HTTP del onboarding empresarial

El onboarding de establecimientos usa `EXPO_PUBLIC_API_URL` como URL base y
requiere un access token vigente.

## Recuperar progreso

`GET /venue-organizations/onboarding`

Devuelve el borrador activo o `404` cuando todavía no existe. La app usa esta
respuesta para enviar al propietario al dashboard o al formulario inicial sin
repetir pasos ya guardados.

## Guardar datos básicos

`PUT /venue-organizations/onboarding/business`

Requiere:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Solicitud:

```json
{
  "businessName": "Match Arena",
  "contactPhone": "999999999"
}
```

Respuesta:

```json
{
  "organizationId": "org_123",
  "businessName": "Match Arena",
  "contactPhone": "999999999",
  "venues": [],
  "fields": [],
  "location": null,
  "field": null,
  "nextStep": "location"
}
```

## Crear una sede

`POST /venue-organizations/:organizationId/venues`

```json
{
  "venueName": "Sede San Miguel",
  "address": "Av. Principal 123",
  "district": "San Miguel",
  "city": "Lima",
  "coordinates": { "latitude": -12.08, "longitude": -77.09 },
  "status": "active",
  "defaultSchedule": {
    "weekdays": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "openingTime": "08:00",
    "closingTime": "23:00"
  }
}
```

Devuelve el estado completo con la nueva sede añadida a `venues`. `location`
se mantiene temporalmente como alias de compatibilidad durante la migración.

## Crear una cancha dentro de una sede

`POST /venue-organizations/:organizationId/venues/:venueId/fields`

```json
{
  "fieldName": "Cancha principal",
  "format": "7v7",
  "status": "active",
  "scheduleMode": "inherit",
  "scheduleOverride": null,
  "hourlyPrice": 120,
  "currency": "PEN"
}
```

Los formatos iniciales permitidos son `5v5`, `7v7` y `11v11`. Devuelve el
estado completo con la nueva cancha añadida a `fields`. Cada cancha conserva
su `venueId`; `field` se mantiene como alias temporal de compatibilidad.

## Guardar horarios y precio base

`PUT /venue-organizations/:organizationId/fields/:fieldId/availability`

```json
{
  "weekdays": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "openingTime": "08:00",
  "closingTime": "23:00",
  "hourlyPrice": 120,
  "currency": "PEN"
}
```

Devuelve el borrador completo con `availability` y `nextStep: "complete"`.
Los horarios especiales, feriados y precios por franja se configuran después
desde el panel, sin extender este onboarding inicial.

## Reglas del servidor

- Crear una sede o una cancha genera un recurso nuevo y no sobrescribe otro
  recurso de la organización.
- El usuario autenticado se registra como futuro `owner`, pero la membresía no
  debe habilitar operaciones administrativas hasta completar las validaciones
  requeridas.
- El teléfono debe almacenarse normalizado y nunca utilizarse como prueba de
  identidad sin un proceso de verificación independiente.
- `organizationId` se genera en el servidor y no se acepta desde el cliente.
- La respuesta indica el siguiente paso permitido por el servidor.
- El servidor debe comprobar que `venueId` pertenece a la organización antes de
  registrar una cancha.
- El servidor debe impedir registrar disponibilidad antes de tener una cancha.
- Toda lectura o escritura posterior debe comprobar la membresía y el alcance
  de la organización.

## Estados operativos

`PATCH /venue-organizations/:organizationId/venues/:venueId/status`

`DELETE /venue-organizations/:organizationId/venues/:venueId`

Elimina la sede y sus canchas asociadas. El servidor debe validar que la sede
pertenece a la organización autenticada antes de ejecutar la operación.

`PATCH /venue-organizations/:organizationId/fields/:fieldId/status`

Una sede inactiva hace que sus canchas estén inactivas de forma efectiva, pero
no modifica el estado propio de cada cancha. Al reactivar la sede vuelven solo
las canchas cuyo estado individual sea `active`. Cambiar estados no elimina
horarios, precios, bloqueos ni reservas.
