import type {
  AvailabilityBlock,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import type { SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";

export const getBusinessReservations = (
  reservations: readonly ReservationRecord[],
  fields: readonly SportsFieldDraft[],
) => {
  const fieldIds = new Set(fields.map((field) => field.fieldId));
  return reservations.filter((reservation) => fieldIds.has(reservation.fieldId));
};

export const getBusinessBlocks = (
  blocks: readonly AvailabilityBlock[],
  fields: readonly SportsFieldDraft[],
) => {
  const fieldIds = new Set(fields.map((field) => field.fieldId));
  return blocks.filter((block) => fieldIds.has(block.fieldId));
};
