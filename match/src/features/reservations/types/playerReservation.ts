export type PlayerReservationStatus = "confirmed" | "pending";

/** @deprecated Use ReservationRecord for new reservation UI. */
export interface PlayerReservation {
  id: string;
  venueName: string;
  fieldName: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  total: number;
  status: PlayerReservationStatus;
}

export interface PlayerBookingSummary {
  venueName: string;
  fieldName: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  total: number;
}
