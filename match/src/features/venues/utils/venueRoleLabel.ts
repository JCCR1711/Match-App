import type { VenueRole } from "@/src/types/businessAccess";

const labels: Record<VenueRole, string> = {
  owner: "Propietario",
  manager: "Administrador",
  staff: "Personal",
};

export const getVenueRoleLabel = (role: VenueRole) => labels[role];
