import type {
  ReservationCreateStatus,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";

export type ActiveReservation = ReservationRecord & {
  status: ReservationCreateStatus;
};

export const isActiveReservation = (
  reservation: ReservationRecord,
): reservation is ActiveReservation => reservation.status !== "canceled";
