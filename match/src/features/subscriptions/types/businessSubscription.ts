export type BusinessPlan = "basic" | "pro";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface BusinessSubscription {
  organizationId: string;
  plan: BusinessPlan;
  status: SubscriptionStatus;
  currentPeriodEndsAt: string | null;
}

export interface BusinessPlanAccess {
  effectivePlan: BusinessPlan;
  maxVenues: number | null;
  maxFieldsPerVenue: number | null;
  analyticsHistoryDays: number;
  canUseAdvancedAnalytics: boolean;
  canUseConsolidatedVenueReports: boolean;
  canManageEmployees: boolean;
  canExportReports: boolean;
  canUseAutomations: boolean;
}
