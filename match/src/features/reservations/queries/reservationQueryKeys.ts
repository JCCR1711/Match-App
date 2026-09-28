export const reservationQueryKeys = {
  all: ["reservations"] as const,
  schedule: (organizationId: string) => [...reservationQueryKeys.all, organizationId, "schedule"] as const,
};
