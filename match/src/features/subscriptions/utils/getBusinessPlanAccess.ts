import type { BusinessPlanAccess, BusinessSubscription } from "@/src/features/subscriptions/types/businessSubscription";

const hasPaidAccess = (subscription: BusinessSubscription) =>
  subscription.plan === "pro" &&
  (subscription.status === "active" || subscription.status === "trialing");

export const getBusinessPlanAccess = (
  subscription: BusinessSubscription,
): BusinessPlanAccess => {
  const proEnabled = hasPaidAccess(subscription);

  return {
    effectivePlan: proEnabled ? "pro" : "basic",
    maxVenues: proEnabled ? null : 1,
    maxFieldsPerVenue: proEnabled ? null : 1,
    analyticsHistoryDays: proEnabled ? 365 : 30,
    canUseAdvancedAnalytics: proEnabled,
    canUseConsolidatedVenueReports: proEnabled,
    canManageEmployees: proEnabled,
    canExportReports: proEnabled,
    canUseAutomations: proEnabled,
  };
};
