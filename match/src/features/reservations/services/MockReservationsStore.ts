import type {
  AvailabilityBlock,
  AvailabilityBlockCreateInput,
  ReservationCreateInput,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import {
  availabilityBlocksPreview,
  reservationsPreview,
  RESERVATIONS_PREVIEW_DATE_KEY,
  RESERVATIONS_PREVIEW_VERSION,
} from "@/src/features/reservations/data/reservationsPreview";
import { isSlotUnavailable } from "@/src/features/reservations/utils/isSlotUnavailable";
import { createReservationReferenceCode, getCompactCustomerName } from "@/src/features/reservations/utils/reservationIdentity";
import { parseTimeToMinutes } from "@/src/features/reservations/utils/reservationTime";
import { hasAgendaSlotStarted } from "@/src/features/reservations/utils/reservationDate";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LEGACY_STORAGE_KEY = "match:reservations:v1";
const getStorageKey = (organizationId: string) => `match:reservations:v2:${organizationId}`;

const normalizeReservation = (reservation: ReservationRecord): ReservationRecord => ({
  ...reservation,
  referenceCode: reservation.referenceCode || createReservationReferenceCode(reservation.id),
  customerDisplayName: reservation.customerDisplayName || getCompactCustomerName(reservation.customerName),
  source: reservation.source ?? (reservation.customerId ? "match" : "manual"),
  paymentStatus: reservation.paymentStatus ?? (
    reservation.customerId
      ? reservation.status === "confirmed" ? "paid" : "pending"
      : "pay_at_venue"
  ),
});

let reservations: ReservationRecord[] = [...reservationsPreview];

let blocks: AvailabilityBlock[] = [...availabilityBlocksPreview];

interface PersistedReservationsState {
  previewVersion: number;
  previewDateKey: string;
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
}

let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
let activeOrganizationId: string | null = null;

const persist = () => {
  if (!activeOrganizationId) return;
  const state: PersistedReservationsState = { previewVersion: RESERVATIONS_PREVIEW_VERSION, previewDateKey: RESERVATIONS_PREVIEW_DATE_KEY, reservations, blocks };
  void AsyncStorage.setItem(getStorageKey(activeOrganizationId), JSON.stringify(state)).catch(() => undefined);
};

export class MockReservationsStore {
  isHydrated() {
    return hydrated;
  }

  hydrate(organizationId: string) {
    if (hydrationPromise && activeOrganizationId === organizationId) return hydrationPromise;

    activeOrganizationId = organizationId;
    hydrated = false;
    reservations = [...reservationsPreview];
    blocks = [...availabilityBlocksPreview];

    hydrationPromise = AsyncStorage.getItem(getStorageKey(organizationId))
      .then(async (scopedState) => scopedState ?? (
        organizationId === "mock-org-mock-venue-owner-1"
          ? AsyncStorage.getItem(LEGACY_STORAGE_KEY)
          : null
      ))
      .then((storedState) => {
        if (!storedState) return;

        const parsedState = JSON.parse(storedState) as Partial<PersistedReservationsState>;
        const shouldRefreshPreview =
          (parsedState.previewVersion ?? 0) < RESERVATIONS_PREVIEW_VERSION ||
          parsedState.previewDateKey !== RESERVATIONS_PREVIEW_DATE_KEY;
        if (Array.isArray(parsedState.reservations)) {
          const previewIds = new Set(reservationsPreview.map((reservation) => reservation.id));
          const persistedReservations = parsedState.reservations
            .filter((reservation) => !shouldRefreshPreview || !previewIds.has(reservation.id));
          const persistedIds = new Set(persistedReservations.map((reservation) => reservation.id));
          reservations = [
            ...persistedReservations.map(normalizeReservation),
            ...reservationsPreview.filter((reservation) => !persistedIds.has(reservation.id)),
          ];
        }
        if (Array.isArray(parsedState.blocks)) {
          const previewBlockIds = new Set(availabilityBlocksPreview.map((block) => block.id));
          const persistedBlocks = parsedState.blocks.filter(
            (block) => !shouldRefreshPreview || !previewBlockIds.has(block.id),
          );
          const persistedBlockIds = new Set(persistedBlocks.map((block) => block.id));
          blocks = [
            ...persistedBlocks,
            ...availabilityBlocksPreview.filter((block) => !persistedBlockIds.has(block.id)),
          ];
        }
        if (shouldRefreshPreview) persist();
      })
      .catch(() => {
        // Keep prototype seed data when local storage is unavailable or malformed.
      })
      .finally(() => {
        hydrated = true;
      });

    return hydrationPromise;
  }

  getReservations() {
    return [...reservations];
  }

  getBlocks() {
    return [...blocks];
  }

  replaceSnapshot(snapshot: {
    reservations: ReservationRecord[];
    blocks: AvailabilityBlock[];
  }) {
    reservations = [...snapshot.reservations];
    blocks = [...snapshot.blocks];
    hydrated = true;
    persist();
  }

  createReservation(input: ReservationCreateInput) {
    if (
      !input.fieldId ||
      !input.dateKey ||
      parseTimeToMinutes(input.startTime) === null ||
      !Number.isFinite(input.durationMinutes) ||
      input.durationMinutes <= 0 ||
      !Number.isFinite(input.amount) ||
      input.amount < 0 ||
      hasAgendaSlotStarted(input.dateKey, input.startTime) ||
      this.isTimeRangeUnavailable(input.fieldId, input.dateKey, input.startTime, input.durationMinutes)
    ) {
      return null;
    }

    const reservationId = `reservation-${Date.now()}`;
    const reservation: ReservationRecord = {
      id: reservationId,
      referenceCode: createReservationReferenceCode(reservationId),
      customerDisplayName: getCompactCustomerName(input.customerName),
      ...input,
    };
    reservations.unshift(reservation);
    persist();
    return reservation;
  }

  createBlock(input: AvailabilityBlockCreateInput) {
    if (
      !input.fieldId ||
      !input.dateKey ||
      parseTimeToMinutes(input.startTime) === null ||
      !Number.isFinite(input.durationMinutes) ||
      input.durationMinutes <= 0 ||
      hasAgendaSlotStarted(input.dateKey, input.startTime) ||
      this.isTimeRangeUnavailable(input.fieldId, input.dateKey, input.startTime, input.durationMinutes)
    ) {
      return null;
    }

    const block: AvailabilityBlock = {
      id: `block-${Date.now()}`,
      ...input,
    };
    blocks.unshift(block);
    persist();
    return block;
  }

  deleteBlock(blockId: string) {
    const blockIndex = blocks.findIndex((block) => block.id === blockId);
    if (blockIndex === -1) return false;
    const block = blocks[blockIndex];
    if (hasAgendaSlotStarted(block.dateKey, block.startTime)) return false;

    blocks.splice(blockIndex, 1);
    persist();
    return true;
  }

  confirmReservation(reservationId: string) {
    const reservationIndex = reservations.findIndex((item) => item.id === reservationId);
    const reservation = reservations[reservationIndex];
    if (!reservation || reservation.status !== "pending" || hasAgendaSlotStarted(reservation.dateKey, reservation.startTime)) return null;

    const confirmedReservation: ReservationRecord = {
      ...reservation,
      status: "confirmed",
      paymentStatus: reservation.source === "match" ? "paid" : reservation.paymentStatus,
    };
    reservations = reservations.map((item, index) =>
      index === reservationIndex ? confirmedReservation : item,
    );
    persist();
    return confirmedReservation;
  }

  cancelReservation(reservationId: string) {
    const reservationIndex = reservations.findIndex((item) => item.id === reservationId);
    const reservation = reservations[reservationIndex];
    if (!reservation || reservation.status === "canceled" || hasAgendaSlotStarted(reservation.dateKey, reservation.startTime)) return null;

    const canceledReservation: ReservationRecord = {
      ...reservation,
      status: "canceled",
      paymentStatus: reservation.paymentStatus === "paid" ? "refund_pending" : reservation.paymentStatus,
    };
    reservations = reservations.map((item, index) =>
      index === reservationIndex ? canceledReservation : item,
    );
    persist();
    return canceledReservation;
  }

  completeRefund(reservationId: string) {
    const reservationIndex = reservations.findIndex((item) => item.id === reservationId);
    const reservation = reservations[reservationIndex];
    if (!reservation || reservation.status !== "canceled" || reservation.paymentStatus !== "refund_pending") return null;

    const refundedReservation: ReservationRecord = { ...reservation, paymentStatus: "refunded" };
    reservations = reservations.map((item, index) => index === reservationIndex ? refundedReservation : item);
    persist();
    return refundedReservation;
  }

  isTimeRangeUnavailable(
    fieldId: string,
    dateKey: string,
    startTime: string,
    durationMinutes = 60,
  ) {
    return isSlotUnavailable({ fieldId, dateKey, startTime, durationMinutes, reservations, blocks });
  }
}

export const reservationsStore = new MockReservationsStore();
