import type { BusinessPlanAccess } from "@/src/features/subscriptions/types/businessSubscription";
import type { VenueMembership, VenueRole } from "@/src/types/businessAccess";

export type BusinessMembershipRestriction = "missing_membership" | "team_requires_pro" | null;

export interface EffectiveBusinessMembership {
  role: VenueRole | null;
  originalRole: VenueRole | null;
  enabled: boolean;
  restriction: BusinessMembershipRestriction;
}

export const getEffectiveBusinessMembership = (
  membership: VenueMembership | null | undefined,
  planAccess: Pick<BusinessPlanAccess, "canManageEmployees">,
): EffectiveBusinessMembership => {
  if (!membership) {
    return {
      role: null,
      originalRole: null,
      enabled: false,
      restriction: "missing_membership",
    };
  }

  const teamMemberEnabled = membership.role === "owner" || planAccess.canManageEmployees;

  return {
    role: teamMemberEnabled ? membership.role : null,
    originalRole: membership.role,
    enabled: teamMemberEnabled,
    restriction: teamMemberEnabled ? null : "team_requires_pro",
  };
};
