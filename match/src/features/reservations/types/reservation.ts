export type ReservationStatus = "confirmed" | "pending" | "canceled";
export type ReservationCreateStatus = Exclude<ReservationStatus, "canceled">;

export interface ReservationCustomer {
  id: string;
  displayName: string;
  email: string;
}
export type AvailabilityBlockKind = "blocked" | "maintenance";

export interface ReservationRecord {
  id: string;
  customerId: string | null;
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
  kind?: AvailabilityBlockKind;
}

export interface AvailabilityBlockCreateInput {
  venueId: string;
  fieldId: string;
  fieldName: string;
  dateKey: string;
  startTime: string;
  durationMinutes: number;
  label: string;
  kind?: AvailabilityBlockKind;
}

export interface ReservationCreateInput {
  customerId: string | null;
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
  status: ReservationCreateStatus;
}
