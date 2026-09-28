import type { BusinessSubscriptionGateway } from "@/src/features/subscriptions/services/BusinessSubscriptionGateway";
import type { BusinessPlan, BusinessSubscription } from "@/src/features/subscriptions/types/businessSubscription";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storageKey = (organizationId: string) => `match:business-subscription:${organizationId}`;

const createDefaultSubscription = (organizationId: string): BusinessSubscription => ({
  organizationId,
  plan: "basic",
  status: "active",
  currentPeriodEndsAt: null,
});

export class MockBusinessSubscriptionGateway implements BusinessSubscriptionGateway {
  async getSubscription(organizationId: string) {
    const stored = await AsyncStorage.getItem(storageKey(organizationId));
    if (!stored) return createDefaultSubscription(organizationId);
    try {
      return JSON.parse(stored) as BusinessSubscription;
    } catch {
      return createDefaultSubscription(organizationId);
    }
  }

  async setDevPlan(organizationId: string, plan: BusinessPlan) {
    if (!__DEV__) throw new Error("Esta herramienta solo está disponible en desarrollo.");
    const subscription: BusinessSubscription = {
      organizationId,
      plan,
      status: "active",
      currentPeriodEndsAt: null,
    };
    await AsyncStorage.setItem(storageKey(organizationId), JSON.stringify(subscription));
    return subscription;
  }
}
