import BusinessReservationsView from "@/src/features/reservations/views/BusinessReservationsView";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function BusinessReservationsRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Redirect href="/" />;
  if (user?.activeMode !== "venue_manager") return <Redirect href="/(tabs)" />;

  return <BusinessReservationsView />;
}
