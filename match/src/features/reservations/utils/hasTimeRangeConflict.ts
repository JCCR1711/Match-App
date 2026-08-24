import { parseTimeToMinutes } from "@/src/features/reservations/utils/reservationTime";

export interface ReservationTimeRange {
  startTime: string;
  durationMinutes: number;
}

/** Returns whether a proposed reservation overlaps any occupied time range. */
export const hasTimeRangeConflict = (
  requestedRange: ReservationTimeRange,
  occupiedRanges: readonly ReservationTimeRange[],
) => {
  const requestedStart = parseTimeToMinutes(requestedRange.startTime);
  if (requestedStart === null || !Number.isFinite(requestedRange.durationMinutes) || requestedRange.durationMinutes <= 0) return true;
  const requestedEnd = requestedStart + requestedRange.durationMinutes;

  return occupiedRanges.some((occupiedRange) => {
    const occupiedStart = parseTimeToMinutes(occupiedRange.startTime);
    if (occupiedStart === null || !Number.isFinite(occupiedRange.durationMinutes) || occupiedRange.durationMinutes <= 0) return true;
    const occupiedEnd = occupiedStart + occupiedRange.durationMinutes;

    return requestedStart < occupiedEnd && occupiedStart < requestedEnd;
  });
};
