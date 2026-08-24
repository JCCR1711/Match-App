import type { ReservationRecord } from "@/src/features/reservations/types/reservation";

const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export const getCompactCustomerName = (customerName: string) => {
  const nameParts = customerName.trim().split(/\s+/).filter(Boolean);
  return nameParts.slice(0, 2).join(" ") || "Jugador Match";
};

export const getCompactFieldName = (fieldName: string) => {
  const nameParts = fieldName.trim().split(/\s+/).filter(Boolean);
  return nameParts.slice(0, 2).join(" ") || "Cancha";
};

export const createReservationReferenceCode = (reservationId: string) => {
  let hash = 2166136261;
  for (const character of reservationId) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  let value = hash >>> 0;
  let code = "M";
  for (let index = 0; index < 5; index += 1) {
    code += REFERENCE_ALPHABET[value % REFERENCE_ALPHABET.length];
    value = Math.floor(value / REFERENCE_ALPHABET.length) || (hash >>> (index + 1));
  }
  return code;
};

export const getReservationCustomerLabel = (reservation: ReservationRecord) =>
  reservation.customerDisplayName || getCompactCustomerName(reservation.customerName);

export const getReservationReferenceLabel = (reservation: Pick<ReservationRecord, "id" | "referenceCode">) =>
  `#${reservation.referenceCode || createReservationReferenceCode(reservation.id)}`;
