import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ONBOARDING_STORAGE_KEY = "match:onboarding-completed:v1";

interface OnboardingContextValue {
  initialized: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    let active = true;

    void AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
      .then((storedValue) => {
        if (active) setHasCompletedOnboarding(storedValue === "true");
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setInitialized(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setHasCompletedOnboarding(true);
  }, []);

  const value = useMemo(() => ({ initialized, hasCompletedOnboarding, completeOnboarding }), [completeOnboarding, hasCompletedOnboarding, initialized]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding debe usarse dentro de OnboardingProvider");
  return context;
};
