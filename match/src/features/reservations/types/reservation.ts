export type ReservationStatus = "confirmed" | "pending" | "canceled";

export interface ReservationRecord {
  id: string;
  venueId: string;
  venueName: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  customerName: string;
  amount: number;
  status: ReservationStatus;
}

export interface AvailabilityBlock {
  id: string;
  venueId: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  startTime: string;
  durationMinutes: number;
  label: string;
}

export interface AvailabilityBlockCreateInput {
  venueId: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  startTime: string;
  durationMinutes: number;
  label: string;
}

export interface ReservationCreateInput {
  venueId: string;
  venueName: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  amount: number;
  customerName: string;
}
