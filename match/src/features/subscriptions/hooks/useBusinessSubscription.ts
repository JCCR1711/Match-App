import { businessSubscriptionQueryKeys } from "@/src/features/subscriptions/queries/businessSubscriptionQueryKeys";
import { businessSubscriptionGateway } from "@/src/features/subscriptions/services";
import type { BusinessPlan } from "@/src/features/subscriptions/types/businessSubscription";
import { getBusinessPlanAccess } from "@/src/features/subscriptions/utils/getBusinessPlanAccess";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBusinessSubscription = (organizationId?: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: businessSubscriptionQueryKeys.byOrganization(organizationId ?? "missing"),
    queryFn: () => businessSubscriptionGateway.getSubscription(organizationId!),
    enabled: Boolean(organizationId),
  });
  const subscription = query.data ?? {
    organizationId: organizationId ?? "missing",
    plan: "basic" as const,
    status: "active" as const,
    currentPeriodEndsAt: null,
  };
  const devPlanMutation = useMutation({
    mutationFn: (plan: BusinessPlan) => {
      if (!organizationId || !businessSubscriptionGateway.setDevPlan) throw new Error("No pudimos cambiar el plan.");
      return businessSubscriptionGateway.setDevPlan(organizationId, plan);
    },
    onSuccess: (nextSubscription) => {
      queryClient.setQueryData(
        businessSubscriptionQueryKeys.byOrganization(nextSubscription.organizationId),
        nextSubscription,
      );
    },
  });

  return {
    subscription,
    access: getBusinessPlanAccess(subscription),
    loading: Boolean(organizationId) && query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
    setDevPlan: devPlanMutation.mutateAsync,
    changingPlan: devPlanMutation.isPending,
  };
};
