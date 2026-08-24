import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import type {
  AvailabilityBlock,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

interface ReservationsSnapshot {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  isHydrated: boolean;
}

const getSnapshot = (): ReservationsSnapshot => ({
  reservations: reservationsStore.getReservations(),
  blocks: reservationsStore.getBlocks(),
  isHydrated: reservationsStore.isHydrated(),
});

export const useReservations = () => {
  const version = useSyncExternalStore(
    subscribeToReservations,
    getReservationsVersion,
    getReservationsVersion,
  );

  useEffect(() => {
    void reservationsStore.hydrate();
  }, []);

  return useMemo(getSnapshot, [version]);
};

const subscribeToReservations = (listener: () => void) =>
  reservationsStore.subscribe(listener);

const getReservationsVersion = () => reservationsStore.getVersion();
