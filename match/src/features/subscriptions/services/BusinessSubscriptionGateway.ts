import type { BusinessPlan, BusinessSubscription } from "@/src/features/subscriptions/types/businessSubscription";

export interface BusinessSubscriptionGateway {
  getSubscription(organizationId: string): Promise<BusinessSubscription>;
  setDevPlan?(organizationId: string, plan: BusinessPlan): Promise<BusinessSubscription>;
}
