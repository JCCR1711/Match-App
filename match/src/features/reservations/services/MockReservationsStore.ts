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
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "match:reservations:v1";

const normalizeReservation = (reservation: ReservationRecord): ReservationRecord => ({
  ...reservation,
  referenceCode: reservation.referenceCode || createReservationReferenceCode(reservation.id),
  customerDisplayName: reservation.customerDisplayName || getCompactCustomerName(reservation.customerName),
});

let reservations: ReservationRecord[] = [...reservationsPreview];

let blocks: AvailabilityBlock[] = [...availabilityBlocksPreview];

type Listener = () => void;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

interface PersistedReservationsState {
  previewVersion: number;
  previewDateKey: string;
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
}

let hydrated = false;
let hydrationPromise: Promise<void> | null = null;

const persist = () => {
  const state: PersistedReservationsState = { previewVersion: RESERVATIONS_PREVIEW_VERSION, previewDateKey: RESERVATIONS_PREVIEW_DATE_KEY, reservations, blocks };
  void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
};

export class MockReservationsStore {
  isHydrated() {
    return hydrated;
  }

  hydrate() {
    if (hydrationPromise) return hydrationPromise;

    hydrationPromise = AsyncStorage.getItem(STORAGE_KEY)
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
        emit();
      });

    return hydrationPromise;
  }

  getReservations() {
    return [...reservations];
  }

  getBlocks() {
    return [...blocks];
  }

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  createReservation(input: ReservationCreateInput) {
    if (this.isTimeRangeUnavailable(input.fieldId, input.dateKey, input.startTime, input.durationMinutes)) {
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
    emit();
    return reservation;
  }

  createBlock(input: AvailabilityBlockCreateInput) {
    if (this.isTimeRangeUnavailable(input.fieldId, input.dateKey, input.startTime, input.durationMinutes)) {
      return null;
    }

    const block: AvailabilityBlock = {
      id: `block-${Date.now()}`,
      ...input,
    };
    blocks.unshift(block);
    persist();
    emit();
    return block;
  }

  deleteBlock(blockId: string) {
    const blockIndex = blocks.findIndex((block) => block.id === blockId);
    if (blockIndex === -1) return false;

    blocks.splice(blockIndex, 1);
    persist();
    emit();
    return true;
  }

  confirmReservation(reservationId: string) {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation || reservation.status !== "pending") return null;

    reservation.status = "confirmed";
    persist();
    emit();
    return reservation;
  }

  cancelReservation(reservationId: string) {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation || reservation.status === "canceled") return null;

    reservation.status = "canceled";
    persist();
    emit();
    return reservation;
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
