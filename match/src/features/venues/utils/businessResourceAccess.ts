import type { VenueRole } from "@/src/types/businessAccess";

export interface BusinessResourceAccess {
  canViewResources: boolean;
  canConfigureResources: boolean;
}

const accessByRole: Record<VenueRole, BusinessResourceAccess> = {
  owner: { canViewResources: true, canConfigureResources: true },
  manager: { canViewResources: true, canConfigureResources: true },
  staff: { canViewResources: true, canConfigureResources: false },
};

const noAccess: BusinessResourceAccess = {
  canViewResources: false,
  canConfigureResources: false,
};

export const getBusinessResourceAccess = (
  role: VenueRole | null | undefined,
) => (role ? accessByRole[role] : noAccess);
