export const businessSubscriptionQueryKeys = {
  all: ["business-subscription"] as const,
  byOrganization: (organizationId: string) => ["business-subscription", organizationId] as const,
};
