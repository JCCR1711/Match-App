import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_STORAGE_KEY = "match:onboarding-completed:v1";

export interface OnboardingStore {
  hasCompleted(): Promise<boolean>;
  markCompleted(): Promise<void>;
}

class AsyncStorageOnboardingStore implements OnboardingStore {
  async hasCompleted() {
    return (await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)) === "true";
  }

  async markCompleted() {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  }
}

export const onboardingStore: OnboardingStore = new AsyncStorageOnboardingStore();
