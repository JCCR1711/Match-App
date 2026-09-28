import { onboardingStore } from "@/src/features/auth/services/OnboardingStore";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

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

    void onboardingStore.hasCompleted()
      .then((completed) => {
        if (active) setHasCompletedOnboarding(completed);
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
    await onboardingStore.markCompleted();
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
