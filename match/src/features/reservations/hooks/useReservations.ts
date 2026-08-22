import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import type {
  AvailabilityBlock,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import { useEffect, useState } from "react";

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
  const [snapshot, setSnapshot] = useState<ReservationsSnapshot>(getSnapshot);

  useEffect(() => {
    const unsubscribe = reservationsStore.subscribe(() => setSnapshot(getSnapshot()));
    void reservationsStore.hydrate();
    return unsubscribe;
  }, []);

  return snapshot;
};
