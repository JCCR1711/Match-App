import { useAuth } from "@/src/hooks/useAuth";
import { useOnboarding } from "@/src/features/auth/context/OnboardingProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { initialized, isAuthenticated, user } = useAuth();
  const { initialized: onboardingInitialized, hasCompletedOnboarding } = useOnboarding();

  if (!initialized || !onboardingInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={hasCompletedOnboarding ? "/auth/welcome" : "/auth/onboarding"} />;
  }

  if (!user?.activeMode) {
    return <Redirect href="/auth/select-mode" />;
  }

  return user.activeMode === "venue_manager" ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/(tabs)" />
  );
}
