import BusinessFieldsView from "@/src/features/venues/views/BusinessFieldsView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function BusinessFieldsRoute() {
  const { user } = useAuth();
  return user?.activeMode === "venue_manager" ? (
    <BusinessFieldsView />
  ) : (
    <Redirect href="/(tabs)" />
  );
}
