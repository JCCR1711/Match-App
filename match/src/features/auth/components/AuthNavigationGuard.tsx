import { useOnboarding } from "@/src/features/auth/context/OnboardingProvider";
import { useAuth } from "@/src/hooks/useAuth";
import { router, useSegments } from "expo-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

const AuthNavigationGuard = ({ children }: { children: ReactNode }) => {
  const { initialized: authInitialized, isAuthenticated } = useAuth();
  const { initialized: onboardingInitialized, hasCompletedOnboarding } = useOnboarding();
  const segments = useSegments();
  const isOnboardingRoute = segments[0] === "auth" && segments[1] === "onboarding";

  useEffect(() => {
    if (!authInitialized || !onboardingInitialized) return;
    if (!isAuthenticated && !hasCompletedOnboarding && !isOnboardingRoute) {
      router.replace("/auth/onboarding");
    }
  }, [authInitialized, hasCompletedOnboarding, isAuthenticated, isOnboardingRoute, onboardingInitialized]);

  if (!authInitialized || !onboardingInitialized) return null;
  return children;
};

export default AuthNavigationGuard;
