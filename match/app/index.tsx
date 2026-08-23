import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
  const { initialized, isAuthenticated, user } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/onboarding" />;
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
