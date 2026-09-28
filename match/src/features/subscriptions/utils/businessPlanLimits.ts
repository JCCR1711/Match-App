import type { BusinessPlanAccess } from "@/src/features/subscriptions/types/businessSubscription";

const isBelowLimit = (currentCount: number, limit: number | null) =>
  limit === null || currentCount < limit;

export const canCreateVenueForPlan = (
  access: BusinessPlanAccess,
  venueCount: number,
) => isBelowLimit(venueCount, access.maxVenues);

export const canCreateFieldForPlan = (
  access: BusinessPlanAccess,
  fieldCountAtVenue: number,
) => isBelowLimit(fieldCountAtVenue, access.maxFieldsPerVenue);
