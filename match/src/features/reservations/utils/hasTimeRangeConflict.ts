export interface ReservationTimeRange {
  startTime: string;
  durationMinutes: number;
}

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

/** Returns whether a proposed reservation overlaps any occupied time range. */
export const hasTimeRangeConflict = (
  requestedRange: ReservationTimeRange,
  occupiedRanges: readonly ReservationTimeRange[],
) => {
  const requestedStart = toMinutes(requestedRange.startTime);
  const requestedEnd = requestedStart + requestedRange.durationMinutes;

  return occupiedRanges.some((occupiedRange) => {
    const occupiedStart = toMinutes(occupiedRange.startTime);
    const occupiedEnd = occupiedStart + occupiedRange.durationMinutes;

    return requestedStart < occupiedEnd && occupiedStart < requestedEnd;
  });
};
