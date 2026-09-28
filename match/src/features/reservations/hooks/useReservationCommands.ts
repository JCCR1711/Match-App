import { reservationQueryKeys } from "@/src/features/reservations/queries/reservationQueryKeys";
import { reservationsGateway } from "@/src/features/reservations/services";
import { DEMO_RESERVATIONS_ORGANIZATION_ID } from "@/src/features/reservations/services/ReservationsGateway";
import type {
  AvailabilityBlockCreateInput,
  ReservationCreateInput,
} from "@/src/features/reservations/types/reservation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReservationCommands = (organizationId = DEMO_RESERVATIONS_ORGANIZATION_ID) => {
  const queryClient = useQueryClient();
  const refreshSchedule = () =>
    queryClient.invalidateQueries({ queryKey: reservationQueryKeys.schedule(organizationId) });

  const createReservationMutation = useMutation({
    mutationFn: (input: ReservationCreateInput) => reservationsGateway.createReservation(input, organizationId),
    onSuccess: refreshSchedule,
  });
  const confirmReservationMutation = useMutation({
    mutationFn: (reservationId: string) => reservationsGateway.confirmReservation(reservationId, organizationId),
    onSuccess: refreshSchedule,
  });
  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId: string) => reservationsGateway.cancelReservation(reservationId, organizationId),
    onSuccess: refreshSchedule,
  });
  const completeRefundMutation = useMutation({
    mutationFn: (reservationId: string) => reservationsGateway.completeRefund(reservationId, organizationId),
    onSuccess: refreshSchedule,
  });
  const createBlockMutation = useMutation({
    mutationFn: (input: AvailabilityBlockCreateInput) => reservationsGateway.createBlock(input, organizationId),
    onSuccess: refreshSchedule,
  });
  const deleteBlockMutation = useMutation({
    mutationFn: (blockId: string) => reservationsGateway.deleteBlock(blockId, organizationId),
    onSuccess: refreshSchedule,
  });

  return {
    createReservation: createReservationMutation.mutateAsync,
    confirmReservation: confirmReservationMutation.mutateAsync,
    cancelReservation: cancelReservationMutation.mutateAsync,
    completeRefund: completeRefundMutation.mutateAsync,
    createBlock: createBlockMutation.mutateAsync,
    deleteBlock: deleteBlockMutation.mutateAsync,
    isMutating:
      createReservationMutation.isPending ||
      confirmReservationMutation.isPending ||
      cancelReservationMutation.isPending ||
      completeRefundMutation.isPending ||
      createBlockMutation.isPending ||
      deleteBlockMutation.isPending,
  };
};
