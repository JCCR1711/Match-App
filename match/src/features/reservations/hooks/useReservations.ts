import { reservationQueryKeys } from "@/src/features/reservations/queries/reservationQueryKeys";
import { reservationsGateway } from "@/src/features/reservations/services";
import { DEMO_RESERVATIONS_ORGANIZATION_ID } from "@/src/features/reservations/services/ReservationsGateway";
import { useQuery } from "@tanstack/react-query";

const emptySnapshot = { reservations: [], blocks: [], isHydrated: false };

export const useReservations = (organizationId = DEMO_RESERVATIONS_ORGANIZATION_ID) => {
  const query = useQuery({
    queryKey: reservationQueryKeys.schedule(organizationId),
    queryFn: () => reservationsGateway.getSnapshot(organizationId),
  });

  const snapshot = query.data ?? emptySnapshot;

  return {
    ...snapshot,
    loading:
      query.isPending,
    error: query.error instanceof Error ? query.error.message : query.error ? "No pudimos cargar la agenda." : null,
    reload: query.refetch,
  };
};
