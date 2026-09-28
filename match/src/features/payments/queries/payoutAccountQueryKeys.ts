export const payoutAccountQueryKeys = {
  all: ["payout-account"] as const,
  byOrganization: (organizationId: string) => [...payoutAccountQueryKeys.all, organizationId] as const,
};
