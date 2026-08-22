import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { hasTimeRangeConflict } from "@/src/features/reservations/utils/hasTimeRangeConflict";

interface IsSlotUnavailableInput {
  fieldId: string;
  dateKey: string;
  startTime: string;
  durationMinutes?: number;
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
}

export const isSlotUnavailable = ({
  fieldId,
  dateKey,
  startTime,
  durationMinutes = 60,
  reservations,
  blocks,
}: IsSlotUnavailableInput) => {
  const occupiedRanges = [
    ...reservations
      .filter(
        (reservation) =>
          reservation.fieldId === fieldId &&
          reservation.dateKey === dateKey &&
          reservation.status !== "canceled",
      )
      .map((reservation) => ({
        startTime: reservation.startTime,
        durationMinutes: reservation.durationMinutes,
      })),
    ...blocks
      .filter((block) => block.fieldId === fieldId && block.dateKey === dateKey)
      .map((block) => ({ startTime: block.startTime, durationMinutes: block.durationMinutes })),
  ];

  return hasTimeRangeConflict({ startTime, durationMinutes }, occupiedRanges);
};
