# Reservations API boundary

The reservations feature currently uses `ReservationsGateway` with a mock implementation. The UI must not depend on mock storage details so the gateway can later be replaced by an HTTP adapter.

## Agenda query

The production API should expose an organization-scoped agenda query equivalent to:

```text
GET /organizations/{organizationId}/agenda
  ?venueId={venueId}
  &fieldId={fieldId}
  &from={YYYY-MM-DD}
  &to={YYYY-MM-DD}
```

The response should contain the requested reservations and availability blocks. Venue status, field status and the effective schedule must come from authoritative resource data; the client must not invent a fallback schedule.

Query caching must include the organization and requested scope:

```text
["reservations", organizationId, venueId, fieldId, from, to]
```

## Commands

Reservation and availability changes remain separate commands:

```text
POST   /organizations/{organizationId}/reservations
PATCH  /organizations/{organizationId}/reservations/{reservationId}/status
POST   /organizations/{organizationId}/reservations/{reservationId}/cancellations
POST   /organizations/{organizationId}/availability-blocks
DELETE /organizations/{organizationId}/availability-blocks/{blockId}
```

Every command must validate the organization membership, resource ownership, resource status, schedule and time conflicts on the server. Client checks only improve the experience and are not an authorization boundary.

Player-created reservations additionally require the organization marketplace status to be `live`. `local_only` and `paused` continue accepting manual business reservations but reject new marketplace reservations. Changing this status never cancels existing reservations.

Reservations must keep operational state separate from payment state:

```text
status:        pending | confirmed | canceled
source:        match | manual
paymentStatus: pending | paid | pay_at_venue | refund_pending | refunded
```

A reservation created from the business agenda is `manual` and may reference a Match customer or a local customer without an account. Its payment is handled at the venue. A Match reservation can become `confirmed` only after payment confirmation from the payment provider; the production API must not trust a client-only status change for this transition.

Canceling a paid reservation must create an auditable cancellation/refund operation. It must not only change the reservation status. The cancellation response should include the resulting `paymentStatus`, retained amount, refund amount and provider reference. Until that production workflow exists, the mock represents a paid cancellation as `refund_pending` and the UI must not claim that money was already returned.

A slot whose local start time has already been reached is unavailable for a new reservation or availability block. The agenda labels it as `Hora pasada`; it is not a business-created block. Inactive venues, inactive fields, closed weekdays and fields without a configured schedule expose no new availability, while their existing reservations and blocks remain readable for operational traceability.

## Role capabilities

The current client policy is centralized in `utils/businessAgendaAccess.ts`:

| Capability | Propietario | Gestor | Personal |
| --- | --- | --- | --- |
| View agenda | Yes | Yes | Yes |
| Manage reservations | Yes | Yes | Yes |
| Create manual reservations | Yes | Yes | Yes |
| Block or release availability | Yes | Yes | No |
| Configure venues, fields and schedules | Yes | Yes | No |

The backend must enforce the same permissions and return `403` when a membership does not have the required capability.

## UI state contract

The gateway adapter must distinguish:

- loading from an empty agenda;
- transport/server errors from an empty agenda;
- missing schedule from zero availability;
- configured schedules from dates whose weekday is closed;
- inactive resources from active resources without reservations.

On a failed mutation, keep the sheet open and return a useful error. On a successful mutation, update or invalidate the organization-scoped agenda query.
