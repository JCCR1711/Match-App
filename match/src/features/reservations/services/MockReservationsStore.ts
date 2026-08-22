import type {
  AvailabilityBlock,
  AvailabilityBlockCreateInput,
  ReservationCreateInput,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import { isSlotUnavailable } from "@/src/features/reservations/utils/isSlotUnavailable";
import { reservationDates } from "@/src/features/reservations/data/reservationDates";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "match:reservations:v1";

const seedReservations: ReservationRecord[] = [
  {
    id: "reservation-1",
    venueId: "arena-san-miguel",
    venueName: "Arena San Miguel",
    fieldId: "arena-5",
    fieldName: "Cancha Central",
    dateKey: reservationDates[0].dateKey,
    dateLabel: `${reservationDates[0].label}, ${reservationDates[0].detail}`,
    startTime: "19:00",
    durationMinutes: 120,
    customerName: "Carlos Mendoza",
    amount: 135,
    status: "confirmed",
  },
  {
    id: "reservation-2",
    venueId: "arena-san-miguel",
    venueName: "Arena San Miguel",
    fieldId: "arena-7",
    fieldName: "Cancha Norte",
    dateKey: reservationDates[0].dateKey,
    dateLabel: `${reservationDates[0].label}, ${reservationDates[0].detail}`,
    startTime: "20:00",
    durationMinutes: 60,
    customerName: "Andrea Rojas",
    amount: 120,
    status: "pending",
  },
  {
    id: "reservation-3",
    venueId: "match-padel-club",
    venueName: "Match Club Surco",
    fieldId: "surco-5",
    fieldName: "Cancha 1",
    dateKey: reservationDates[1].dateKey,
    dateLabel: `${reservationDates[1].label}, ${reservationDates[1].detail}`,
    startTime: "18:00",
    durationMinutes: 60,
    customerName: "Diego Salazar",
    amount: 100,
    status: "confirmed",
  },
  {
    id: "reservation-4",
    venueId: "arena-san-miguel",
    venueName: "Arena San Miguel",
    fieldId: "arena-5",
    fieldName: "Cancha Central",
    dateKey: reservationDates[1].dateKey,
    dateLabel: `${reservationDates[1].label}, ${reservationDates[1].detail}`,
    startTime: "18:00",
    durationMinutes: 60,
    customerName: "Lucía Torres",
    amount: 110,
    status: "confirmed",
  },
  {
    id: "reservation-5",
    venueId: "arena-san-miguel",
    venueName: "Arena San Miguel",
    fieldId: "arena-5",
    fieldName: "Cancha Central",
    dateKey: reservationDates[2].dateKey,
    dateLabel: `${reservationDates[2].label}, ${reservationDates[2].detail}`,
    startTime: "20:00",
    durationMinutes: 120,
    customerName: "José Ramírez",
    amount: 220,
    status: "pending",
  },
];

let reservations: ReservationRecord[] = [...seedReservations];

let blocks: AvailabilityBlock[] = [
  {
    id: "block-1",
    venueId: "arena-san-miguel",
    fieldId: "arena-5",
    fieldName: "Cancha Central",
    dateKey: reservationDates[0].dateKey,
    startTime: "17:00",
    durationMinutes: 60,
    label: "Mantenimiento",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

interface PersistedReservationsState {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
}

let hydrated = false;
let hydrationPromise: Promise<void> | null = null;

const persist = () => {
  const state: PersistedReservationsState = { reservations, blocks };
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
        if (Array.isArray(parsedState.reservations)) {
          const persistedIds = new Set(parsedState.reservations.map((reservation) => reservation.id));
          reservations = [...parsedState.reservations, ...seedReservations.filter((reservation) => !persistedIds.has(reservation.id))];
        }
        if (Array.isArray(parsedState.blocks)) blocks = parsedState.blocks;
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
    const reservation: ReservationRecord = {
      id: `reservation-${Date.now()}`,
      ...input,
      status: "confirmed",
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

  updateReservationStatus(
    reservationId: string,
    status: ReservationRecord["status"],
  ) {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) return null;

    reservation.status = status;
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
