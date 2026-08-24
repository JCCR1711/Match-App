import type {
  AvailabilityBlock,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";

export const hasFieldScheduleDependencies = (
  fieldIds: readonly string[],
  reservations: readonly ReservationRecord[],
  blocks: readonly AvailabilityBlock[],
) => {
  const fieldIdSet = new Set(fieldIds);
  return reservations.some((reservation) =>
    fieldIdSet.has(reservation.fieldId) && isActiveReservation(reservation)
  ) || blocks.some((block) => fieldIdSet.has(block.fieldId));
};
