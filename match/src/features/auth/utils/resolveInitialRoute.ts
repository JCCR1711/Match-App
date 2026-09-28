import type { UserMode } from "@/src/types/auth";

type InitialRoute =
  | "/auth/onboarding"
  | "/auth/welcome"
  | "/auth/select-mode"
  | "/(tabs)"
  | "/(tabs)/dashboard";

interface InitialRouteState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  activeMode: UserMode | null | undefined;
}

const resolveInitialRoute = ({
  isAuthenticated,
  hasCompletedOnboarding,
  activeMode,
}: InitialRouteState): InitialRoute => {
  if (!isAuthenticated) {
    return hasCompletedOnboarding ? "/auth/welcome" : "/auth/onboarding";
  }

  if (!activeMode) {
    return "/auth/select-mode";
  }

  return activeMode === "venue_manager" ? "/(tabs)/dashboard" : "/(tabs)";
};

export default resolveInitialRoute;
