import BusinessFieldsView from "@/src/features/venues/views/BusinessFieldsView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function BusinessFieldsRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Redirect href="/" />;
  if (user?.activeMode !== "venue_manager") return <Redirect href="/(tabs)" />;

  return <BusinessFieldsView />;
}
