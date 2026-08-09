import BusinessProfileView from "@/src/features/profile/views/BusinessProfileView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function BusinessProfileRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Redirect href="/" />;
  if (user?.activeMode !== "venue_manager") return <Redirect href="/(tabs)" />;

  return <BusinessProfileView />;
}
