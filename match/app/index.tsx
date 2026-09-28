import { useAuth } from "@/src/hooks/useAuth";
import { useOnboarding } from "@/src/features/auth/context/OnboardingProvider";
import resolveInitialRoute from "@/src/features/auth/utils/resolveInitialRoute";
import { Redirect } from "expo-router";

export default function Index() {
  const { initialized, isAuthenticated, user } = useAuth();
  const { initialized: onboardingInitialized, hasCompletedOnboarding } = useOnboarding();

  if (!initialized || !onboardingInitialized) {
    return null;
  }

  return (
    <Redirect
      href={resolveInitialRoute({
        isAuthenticated,
        hasCompletedOnboarding,
        activeMode: user?.activeMode,
      })}
    />
  );
}
