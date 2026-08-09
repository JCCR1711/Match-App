import HomeView from "@/src/features/home/views/HomeView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function PlayerHomeRoute() {
  const { user } = useAuth();

  if (!user?.activeMode) {
    return <Redirect href="/" />;
  }

  if (user.activeMode !== "player") {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <HomeView />;
}
