import type { VenueRole } from "@/src/types/businessAccess";

export interface BusinessAgendaAccess {
  canViewAgenda: boolean;
  canManageReservations: boolean;
  canCancelPaidReservations: boolean;
  canCreateReservation: boolean;
  canManageAvailability: boolean;
  canConfigureResources: boolean;
}

const accessByRole: Record<VenueRole, BusinessAgendaAccess> = {
  owner: {
    canViewAgenda: true,
    canManageReservations: true,
    canCancelPaidReservations: true,
    canCreateReservation: true,
    canManageAvailability: true,
    canConfigureResources: true,
  },
  manager: {
    canViewAgenda: true,
    canManageReservations: true,
    canCancelPaidReservations: true,
    canCreateReservation: true,
    canManageAvailability: true,
    canConfigureResources: true,
  },
  staff: {
    canViewAgenda: true,
    canManageReservations: true,
    canCancelPaidReservations: false,
    canCreateReservation: true,
    canManageAvailability: false,
    canConfigureResources: false,
  },
};

const noAccess: BusinessAgendaAccess = {
  canViewAgenda: false,
  canManageReservations: false,
  canCancelPaidReservations: false,
  canCreateReservation: false,
  canManageAvailability: false,
  canConfigureResources: false,
};

export const getBusinessAgendaAccess = (role: VenueRole | null | undefined) =>
  role ? accessByRole[role] : noAccess;
