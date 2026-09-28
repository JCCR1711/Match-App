import type { VenueRole } from "@/src/types/businessAccess";

export interface BusinessFinanceAccess {
  canViewFinances: boolean;
  canViewSettlements: boolean;
  canManagePayoutAccount: boolean;
}

const accessByRole: Record<VenueRole, BusinessFinanceAccess> = {
  owner: {
    canViewFinances: true,
    canViewSettlements: true,
    canManagePayoutAccount: true,
  },
  manager: {
    canViewFinances: true,
    canViewSettlements: true,
    canManagePayoutAccount: false,
  },
  staff: {
    canViewFinances: false,
    canViewSettlements: false,
    canManagePayoutAccount: false,
  },
};

const noAccess: BusinessFinanceAccess = {
  canViewFinances: false,
  canViewSettlements: false,
  canManagePayoutAccount: false,
};

export const getBusinessFinanceAccess = (role: VenueRole | null | undefined) =>
  role ? accessByRole[role] : noAccess;
