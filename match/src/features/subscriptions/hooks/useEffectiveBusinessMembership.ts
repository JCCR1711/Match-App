import { useBusinessSubscription } from "@/src/features/subscriptions/hooks/useBusinessSubscription";
import { getEffectiveBusinessMembership } from "@/src/features/subscriptions/utils/getEffectiveBusinessMembership";
import type { VenueMembership } from "@/src/types/businessAccess";

export const useEffectiveBusinessMembership = (
  membership: VenueMembership | null | undefined,
) => {
  const subscription = useBusinessSubscription(membership?.organizationId);
  const effectiveMembership = getEffectiveBusinessMembership(
    membership,
    subscription.access,
  );

  return {
    ...subscription,
    effectiveMembership,
    effectiveRole: effectiveMembership.role,
  };
};
